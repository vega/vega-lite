import * as vlFieldDef from '../fielddef';
import {extend, keys, vals, reduce} from '../util';
import {Model} from './Model';
import {FieldDef} from '../schema/fielddef.schema';
import {StackProperties} from './stack';

import {autoMaxBins} from '../bin';
import {Channel, X, Y, ROW, COLUMN} from '../channel';
import {SOURCE, STACKED_SCALE, LAYOUT, SUMMARY} from '../data';
import {field} from '../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../type';
import {type as scaleType} from './scale';
import {parseExpression, rawDomain} from './time';

const DEFAULT_NULL_FILTERS = {
  nominal: false,
  ordinal: false,
  quantitative: true,
  temporal: true
};

/**
 * Create Vega's data array from a given model.
 *
 * @param  model
 * @return Array of Vega data.
 *                 This always includes a "source" data table.
 *                 If the model contains aggregate value, this will also create
 *                 aggregate table as well.
 */
export function compileData(model: Model): VgData[] {
  const def = [source.def(model)];

  const summaryDef = summary.def(model);
  if (summaryDef) {
    def.push(summaryDef);
  }

  // append non-positive filter at the end for the data table
  filterNonPositiveForLog(def[def.length - 1], model);

  // add stats for layout calculation
  const layoutDef = layout.def(model);
  if(layoutDef) {
    def.push(layoutDef);
  }

  // Stack
  const stackDef = model.stack();
  if (stackDef) {
    def.push(stack.def(model, stackDef));
  }

  return def.concat(
    dates.defs(model) // Time domain tables
  );
}

// TODO: Consolidate all Vega interfaces
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
    const calcFieldMap = (model.transform().calculate || []).reduce(function(fieldMap, formula) {
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
      filterTransform(model),
      binTransform(model),
      timeTransform(model)
    );
  }

  export function timeTransform(model: Model) {
    return model.reduce(function(transform, fieldDef: FieldDef, channel: Channel) {
      const ref = field(fieldDef, { nofn: true, datum: true });
      if (fieldDef.type === TEMPORAL && fieldDef.timeUnit) {
        transform.push({
          type: 'formula',
          field: field(fieldDef),
          expr: parseExpression(fieldDef.timeUnit, ref)
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
              start: field(fieldDef, {binSuffix: '_start'}),
              mid: field(fieldDef, {binSuffix: '_mid'}),
              end: field(fieldDef, {binSuffix: '_end'})
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
        if (scaleType(fieldDef, channel, model.mark()) === 'ordinal') {
          transform.push({
            type: 'formula',
            field: field(fieldDef, {binSuffix: '_range'}),
            expr: field(fieldDef, {datum: true, binSuffix: '_start'}) +
                  '+ \'-\' +' +
                  field(fieldDef, {datum: true, binSuffix: '_end'})
          });
        }
      }
      return transform;
    }, []);
  }

  /**
   * @return An array that might contain a filter transform for filtering null value based on filterNul config
   */
  export function nullFilterTransform(model: Model) {
    const filterNull = model.transform().filterNull;
    const filteredFields = keys(model.reduce(function(aggregator, fieldDef: FieldDef) {
      if (filterNull ||
        (filterNull === undefined && fieldDef.field && fieldDef.field !== '*' && DEFAULT_NULL_FILTERS[fieldDef.type])) {
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
    var filter = model.transform().filter;
    return filter ? [{
        type: 'filter',
        test: filter
    }] : [];
  }

  export function formulaTransform(model: Model) {
    return (model.transform().calculate || []).reduce(function(transform, formula) {
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

    const layout = model.layout();

    if (model.has(COLUMN)) {
      const layoutCellWidth = layout.cellWidth;
      const cellWidth = typeof layoutCellWidth !== 'number' ?
                        'datum.' + layoutCellWidth.field :
                        layoutCellWidth;
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
        expr: '(' + cellWidth + ' + ' + colScale.padding + ')' + ' * ' + colCardinality
      });
    }

    if (model.has(ROW)) {
      const layoutCellHeight = layout.cellHeight;
      const cellHeight = typeof layoutCellHeight !== 'number' ?
                        'datum.' + layoutCellHeight.field :
                        layoutCellHeight;
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
        expr: '(' + cellHeight + '+' + rowScale.padding + ')' + ' * ' + rowCardinality
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

    model.forEach(function(fieldDef: FieldDef, channel: Channel) {
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
          dims[field(fieldDef, {binSuffix: '_start'})] = field(fieldDef, {binSuffix: '_start'});
          dims[field(fieldDef, {binSuffix: '_mid'})] = field(fieldDef, {binSuffix: '_mid'});
          dims[field(fieldDef, {binSuffix: '_end'})] = field(fieldDef, {binSuffix: '_end'});

          if (scaleType(fieldDef, channel, model.mark()) === 'ordinal') {
            // also produce bin_range if the binned field use ordinal scale
            dims[field(fieldDef, {binSuffix: '_range'})] = field(fieldDef, {binSuffix: '_range'});
          }
        } else {
          dims[field(fieldDef)] = field(fieldDef);
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
      name: STACKED_SCALE,
      source: model.dataTable(),
      transform: [{
        type: 'aggregate',
        // group by channel and other facets
        groupby: [model.field(groupbyChannel)].concat(facetFields),
        // produce sum of the field's value e.g., sum of sum, sum of distinct
        summarize: [{ops: ['sum'], field: model.field(fieldChannel)}]
      }]
    };

    return stacked;
  };
}

export namespace dates {
  /**
   * Add data source for with dates for all months, days, hours, ... as needed.
   */
  export function defs(model: Model) {
    let alreadyAdded = {};

    return model.reduce(function(aggregator, fieldDef: FieldDef, channel: Channel) {
      if (fieldDef.timeUnit) {
        const domain = rawDomain(fieldDef.timeUnit, channel);
        if (domain && !alreadyAdded[fieldDef.timeUnit]) {
          alreadyAdded[fieldDef.timeUnit] = true;
          aggregator.push({
            name: fieldDef.timeUnit,
            values: domain,
            transform: [{
              type: 'formula',
              field: 'date',
              expr: parseExpression(fieldDef.timeUnit, 'datum.data', true)
            }]
          });
        }
      }
      return aggregator;
    }, []);
  }
}

export function filterNonPositiveForLog(dataTable, model: Model) {
  model.forEach(function(_, channel) {
    const scale = model.fieldDef(channel).scale;
    if (scale && scale.type === 'log') {
      dataTable.transform.push({
        type: 'filter',
        test: model.field(channel, {datum: true}) + ' > 0'
      });
    }
  });
}
