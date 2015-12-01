import * as vlFieldDef from '../fielddef';
import * as util from '../util';
import {Model} from './Model';
import {FieldDef} from '../schema/fielddef.schema';
import {StackProperties} from './stack';

import {MAXBINS_DEFAULT} from '../bin';
import {Channel, X, Y, ROW, COLUMN} from '../channel';
import {SOURCE, STACKED, LAYOUT, SUMMARY} from '../data';
import * as time from './time';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';

/**
 * Create Vega's data array from a given encoding.
 *
 * @param  {Encoding} encoding
 * @return {Array} Array of Vega data.
 *                 This always includes a "source" data table.
 *                 If the encoding contains aggregate value, this will also create
 *                 aggregate table as well.
 */
export function compileData(model: Model) {
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
    var parse;

    model.forEach(function(fieldDef: FieldDef) {
      if (fieldDef.type === TEMPORAL) {
        parse = parse || {};
        parse[fieldDef.field] = 'date';
      } else if (fieldDef.type === QUANTITATIVE) {
        if (vlFieldDef.isCount(fieldDef)) return;
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
      const bin = model.bin(channel);
      if (bin) {
        transform.push({
          type: 'bin',
          field: fieldDef.field,
          output: {
            start: model.field(channel, {binSuffix: '_start'}),
            mid: model.field(channel, {binSuffix: '_mid'}),
            end: model.field(channel, {binSuffix: '_end'})
          },
          maxbins: typeof bin === 'boolean' ? MAXBINS_DEFAULT : bin.maxbins
        });
      }
      return transform;
    }, []);
  }

  /**
   * @return {Array} An array that might contain a filter transform for filtering null value based on filterNul config
   */
  export function nullFilterTransform(model: Model) {
    const filterNull = model.config('filterNull');
    const filteredFields = util.keys(model.reduce(function(filteredFields, fieldDef: FieldDef) {
      if (fieldDef.field && fieldDef.field !== '*' && filterNull[fieldDef.type]) {
        filteredFields[fieldDef.field] = true;
      }
      return filteredFields;
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
    var calculate = model.data().calculate;
    if (calculate === undefined) {
      return [];
    }

    return calculate.reduce(function(transform, formula) {
      transform.push(util.extend({type: 'formula'}, formula));
      return transform;
    }, []);
  }
}

export namespace layout {

  export function def(model: Model): VgData {
    let summarize = [];
    let formulas = [];

    // TODO: handle "fit" mode
    if (model.has(X) && model.isOrdinalScale(X)) { // FIXME check if we need to call twice
      summarize.push({
        field: model.field(X),
        ops: ['distinct']
      });
      const xScale = model.fieldDef(X).scale;
      formulas.push({
        type: 'formula',
        field: 'cellWidth',
        // (xCardinality + model.padding(X)) * model.fieldDef(X).scale.bandWidth
        expr: '(' + model.field(X, {datum: true, prefn: 'distinct_'}) + ' + ' +
              xScale.padding + ') * ' + xScale.bandWidth
      });
    }

    if (model.has(Y) && model.isOrdinalScale(Y)) { // FIXME check if we need to call twice
      summarize.push({
        field: model.field(Y),
        ops: ['distinct']
      });

      const yScale = model.fieldDef(Y).scale;
      formulas.push({
        type: 'formula',
        field: 'cellHeight',
        // (yCardinality + model.padding(Y)) * model.fieldDef(Y).scale.bandWidth
        expr: '(' + model.field(Y, {datum: true, prefn: 'distinct_'}) + ' + ' +
              yScale.padding + ') * ' + yScale.bandWidth
      });
    }

    const cellPadding = model.config('cell').padding;
    const layout = model.layout();

    if (model.has(COLUMN)) {
      const cellWidth = layout.cellWidth.field ?
                        'datum.' + layout.cellWidth.field :
                        layout.cellWidth;
      const distinctCol = model.field(COLUMN, {datum: true, prefn: 'distinct_'});
      summarize.push({
        field: model.fieldDef(COLUMN).field,
        ops: ['distinct']
      });
      formulas.push({
        type: 'formula',
        field: 'width',
        // cellWidth + (|col| + (|col| - 1) * cellPadding)
        expr: cellWidth + ' * ' + distinctCol + ' + ' +
              '(' + distinctCol + ' - 1) * ' + cellPadding
      });
    }

    if (model.has(ROW)) {
      const cellHeight = layout.cellHeight.field ?
                        'datum.' + layout.cellHeight.field :
                        layout.cellHeight;
      const distinctRow = model.field(ROW, {datum: true, prefn: 'distinct_'});
      summarize.push({
        field: model.fieldDef(ROW).field,
        ops: ['distinct']
      });
      formulas.push({
        type: 'formula',
        field: 'height',
        // cellHeight + (|row| + (|row| - 1) * cellPadding)
        expr: cellHeight + ' * ' + distinctRow + ' + ' +
              '(' + distinctRow + ' - 1) * ' + cellPadding
      });
    }

    if (summarize.length > 0) {
      return {
        name: LAYOUT,
        source: model.dataTable(),
        transform: [{
            type: 'aggregate',
              summarize: summarize
          }].concat(formulas)
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

    var groupby = util.vals(dims);

    // short-format summarize object for Vega's aggregate transform
    // https://github.com/vega/vega/wiki/Data-Transforms#-aggregate
    var summarize = util.reduce(meas, function(summarize, fnDictSet, field) {
      summarize[field] = util.keys(fnDictSet);
      return summarize;
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
      stacked.transform.push({ //calculate max for each facet
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
