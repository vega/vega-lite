import * as vlFieldDef from '../fielddef';
import {extend, keys, vals, reduce} from '../util';
import {Model} from './Model';
import {FieldDef} from '../schema/fielddef.schema';
import {StackProperties} from './stack';

import {autoMaxBins} from '../bin';
import {Channel, X, Y, ROW, COLUMN} from '../channel';
import {SOURCE, STACKED, LAYOUT, SUMMARY} from '../data';
import * as time from './time';
import {QUANTITATIVE, TEMPORAL} from '../type';


/**
 * Create Vega's data array from a given encoding.
 *
 * @param  encoding
 * @return Array of Vega data.
 *                 This always includes a "source" data table.
 *                 If the encoding contains aggregate value, this will also create
 *                 aggregate table as well.
 */
export function compileData(model: Model): VgData[] {
  var def = [source.def(model)];

  const summaryDef = summary.def(model);
  if (summaryDef) {
    def.push(summaryDef);
  }

  // TODO add "having" filter here

  // append non-positive filter at the end for the data table
  filterNonPositiveForLog(def[def.length - 1], model);

  // add stats for layout calculation
  const statsDef = layout.def(model);
  if(statsDef) {
    def.push(statsDef);
  }

  // Stack
  const stackDef = model.stack();
  if (stackDef) {
    def.push(stack.def(model, stackDef));
  }

  return def;
}

// TODO: Consolidate all Vega interface
interface VgData {
  name: string;
  source?: string;
  values?: any;
  format?: any;
  url?: any;
  transform?: any;
}

export namespace source {
  export function def(model: Model): VgData {
    var source:VgData = {name: SOURCE};

    // Data source (url or inline)
    if (model.hasValues()) {
      source.values = model.data().values;
      source.format = {type: 'json'};
    } else {
      source.url = model.data().url;
      source.format = {type: model.data().formatType};
    }

    // Set data's format.parse if needed
    var parse = formatParse(model);
    if (parse) {
      source.format.parse = parse;
    }

    source.transform = transform(model);
    return source;
  }

  function formatParse(model: Model) {
    const calcFieldMap = (model.data().calculate || []).reduce(function(fieldMap, formula) {
      fieldMap[formula.field] = true;
      return fieldMap;
    }, {});

    let parse;
    // use forEach rather than reduce so that it can return undefined
    // if there is no parse needed
    model.forEach(function(fieldDef: FieldDef) {
      if (fieldDef.type === TEMPORAL) {
        parse = parse || {};
        parse[fieldDef.field] = 'date';
      } else if (fieldDef.type === QUANTITATIVE) {
        if (vlFieldDef.isCount(fieldDef) || calcFieldMap[fieldDef.field]) {
          return;
        }
        parse = parse || {};
        parse[fieldDef.field] = 'number';
      }
    });
    return parse;
  }

  /**
   * Generate Vega transforms for the source data table.  This can include
   * transforms for time unit, binning and filtering.
   */
  export function transform(model: Model) {
    // null filter comes first so transforms are not performed on null values
    // time and bin should come before filter so we can filter by time and bin
    return nullFilterTransform(model).concat(
      formulaTransform(model),
      timeTransform(model),
      binTransform(model),
      filterTransform(model)
    );
  }

  export function timeTransform(model: Model) {
    return model.reduce(function(transform, fieldDef: FieldDef, channel: Channel) {
      if (fieldDef.type === TEMPORAL && fieldDef.timeUnit) {
        var field = model.field(channel, {nofn: true, datum: true});

        transform.push({
          type: 'formula',
          field: model.field(channel),
          expr: time.formula(fieldDef.timeUnit, field)
        });
      }
      return transform;
    }, []);
  }

  export function binTransform(model: Model) {
    return model.reduce(function(transform, fieldDef: FieldDef, channel: Channel) {
      const bin = model.fieldDef(channel).bin;
      if (bin) {
        let binTrans = extend({
            type: 'bin',
            field: fieldDef.field,
            output: {
              start: model.field(channel, {binSuffix: '_start'}),
              mid: model.field(channel, {binSuffix: '_mid'}),
              end: model.field(channel, {binSuffix: '_end'})
            }
          },
          // if bin is an object, load parameter here!
          typeof bin === 'boolean' ? {} : bin
        );

        if (!binTrans.maxbins && !binTrans.step) {
          // if both maxbins and step are specified, need to automatically determine bin
          binTrans.maxbins = autoMaxBins(channel);
        }

        transform.push(binTrans);
      }
      return transform;
    }, []);
  }

  /**
   * @return An array that might contain a filter transform for filtering null value based on filterNul config
   */
  export function nullFilterTransform(model: Model) {
    const filterNull = model.config('filterNull');
    const filteredFields = keys(model.reduce(function(aggregator, fieldDef: FieldDef) {
      if (fieldDef.field && fieldDef.field !== '*' && filterNull[fieldDef.type]) {
        aggregator[fieldDef.field] = true;
      }
      return aggregator;
    }, {}));

    return filteredFields.length > 0 ?
      [{
        type: 'filter',
        test: filteredFields.map(function(fieldName) {
          return 'datum.' + fieldName + '!==null';
        }).join(' && ')
      }] : [];
  }

  export function filterTransform(model: Model) {
    var filter = model.data().filter;
    return filter ? [{
        type: 'filter',
        test: filter
    }] : [];
  }

  export function formulaTransform(model: Model) {
    return (model.data().calculate || []).reduce(function(transform, formula) {
      transform.push(extend({type: 'formula'}, formula));
      return transform;
    }, []);
  }
}

export namespace layout {

  export function def(model: Model): VgData {
    let summarize = [];
    let formulas = [];

    // TODO: handle "fit" mode
    if (model.has(X) && model.isOrdinalScale(X)) {
      const xScale = model.fieldDef(X).scale;
      const xHasDomain = xScale.domain instanceof Array;
      if (!xHasDomain) {
        summarize.push({
          field: model.field(X),
          ops: ['distinct']
        });
      }
      const xCardinality = xHasDomain ? xScale.domain.length :
                             model.field(X, {datum: true, prefn: 'distinct_'});
      formulas.push({
        type: 'formula',
        field: 'cellWidth',
        expr: '(' + xCardinality + ' + ' + xScale.padding + ') * ' + xScale.bandWidth
      });
    }

    if (model.has(Y) && model.isOrdinalScale(Y)) {
      const yScale = model.fieldDef(Y).scale;
      const yHasDomain = yScale.domain instanceof Array;

      if (!yHasDomain) {
        summarize.push({
          field: model.field(Y),
          ops: ['distinct']
        });
      }

      const yCardinality = yHasDomain ? yScale.domain.length :
                             model.field(Y, {datum: true, prefn: 'distinct_'});
      formulas.push({
        type: 'formula',
        field: 'cellHeight',
        expr: '(' + yCardinality + ' + ' + yScale.padding + ') * ' + yScale.bandWidth
      });
    }

    const cellPadding = model.config('cell').padding;
    const layout = model.layout();

    if (model.has(COLUMN)) {
      const cellWidth = layout.cellWidth.field ?
                        'datum.' + layout.cellWidth.field :
                        layout.cellWidth;
      const colScale = model.fieldDef(COLUMN).scale;
      const colHasDomain = colScale.domain instanceof Array;
      if (!colHasDomain) {
        summarize.push({
          field: model.field(COLUMN),
          ops: ['distinct']
        });
      }

      const colCardinality = colHasDomain ? colScale.domain.length :
                               model.field(COLUMN, {datum: true, prefn: 'distinct_'});
      formulas.push({
        type: 'formula',
        field: 'width',
        expr: cellWidth + ' * ' + colCardinality + ' + ' +
              '(' + colCardinality + ' - 1) * ' + cellPadding
      });
    }

    if (model.has(ROW)) {
      const cellHeight = layout.cellHeight.field ?
                        'datum.' + layout.cellHeight.field :
                        layout.cellHeight;
      const rowScale = model.fieldDef(ROW).scale;
      const rowHasDomain = rowScale.domain instanceof Array;
      if (!rowHasDomain) {
        summarize.push({
          field: model.field(ROW),
          ops: ['distinct']
        });
      }

      const rowCardinality = rowHasDomain ? rowScale.domain.length :
                               model.field(ROW, {datum: true, prefn: 'distinct_'});
      formulas.push({
        type: 'formula',
        field: 'height',
        expr: cellHeight + ' * ' + rowCardinality + ' + ' +
              '(' +rowCardinality + ' - 1) * ' + cellPadding
      });
    }

    if (formulas.length > 0) {
      return summarize.length > 0 ? {
        name: LAYOUT,
        source: model.dataTable(),
        transform: [{
            type: 'aggregate',
            summarize: summarize
          }].concat(formulas)
      } : {
        name: LAYOUT,
        values: [{}],
        transform: formulas
      };
    }
    return null;
  }
}

export namespace summary {
  export function def(model: Model):VgData {
    /* dict set for dimensions */
    var dims = {};

    /* dictionary mapping field name => dict set of aggregation functions */
    var meas = {};

    var hasAggregate = false;

    model.forEach(function(fieldDef, channel: Channel) {
      if (fieldDef.aggregate) {
        hasAggregate = true;
        if (fieldDef.aggregate === 'count') {
          meas['*'] = meas['*'] || {};
          meas['*'].count = true;
        } else {
          meas[fieldDef.field] = meas[fieldDef.field] || {};
          meas[fieldDef.field][fieldDef.aggregate] = true;
        }
      } else {
        if (fieldDef.bin) {
          // TODO(#694) only add dimension for the required ones.
          dims[model.field(channel, {binSuffix: '_start'})] = model.field(channel, {binSuffix: '_start'});
          dims[model.field(channel, {binSuffix: '_mid'})] = model.field(channel, {binSuffix: '_mid'});
          dims[model.field(channel, {binSuffix: '_end'})] = model.field(channel, {binSuffix: '_end'});
        } else {
          dims[fieldDef.field] = model.field(channel);
        }

      }
    });

    var groupby = vals(dims);

    // short-format summarize object for Vega's aggregate transform
    // https://github.com/vega/vega/wiki/Data-Transforms#-aggregate
    var summarize = reduce(meas, function(aggregator, fnDictSet, field) {
      aggregator[field] = keys(fnDictSet);
      return aggregator;
    }, {});

    if (hasAggregate) {
      return {
        name: SUMMARY,
        source: SOURCE,
        transform: [{
          type: 'aggregate',
          groupby: groupby,
          summarize: summarize
        }]
      };
    }

    return null;
  };
}

export namespace stack {
  /**
   * Add stacked data source, for feeding the shared scale.
   */
  export function def(model: Model, stackProps: StackProperties):VgData {
    var groupbyChannel = stackProps.groupbyChannel;
    var fieldChannel = stackProps.fieldChannel;
    var facetFields = (model.has(COLUMN) ? [model.field(COLUMN)] : [])
                      .concat((model.has(ROW) ? [model.field(ROW)] : []));

    var stacked:VgData = {
      name: STACKED,
      source: model.dataTable(),
      transform: [{
        type: 'aggregate',
        // group by channel and other facets
        groupby: [model.field(groupbyChannel)].concat(facetFields),
        summarize: [{ops: ['sum'], field: model.field(fieldChannel)}]
      }]
    };

    if (facetFields && facetFields.length > 0) {
      stacked.transform.push({ // calculate max for each facet
        type: 'aggregate',
        groupby: facetFields,
        summarize: [{
          ops: ['max'],
          // we want max of sum from above transform
          field: model.field(fieldChannel, {prefn: 'sum_'})
        }]
      });
    }
    return stacked;
  };
}

export function filterNonPositiveForLog(dataTable, model: Model) {
  model.forEach(function(_, channel) {
    if (model.fieldDef(channel).scale.type === 'log') {
      dataTable.transform.push({
        type: 'filter',
        test: model.field(channel, {datum: true}) + ' > 0'
      });
    }
  });
}
