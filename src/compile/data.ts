import * as vlFieldDef from '../fielddef';
import {extend, keys, vals, reduce, contains} from '../util';
import {Model} from './Model';
import {FieldDef} from '../fielddef';
import {VgData} from '../vega.schema';
import {StackProperties} from './stack';
import {ScaleType} from '../scale';

import {autoMaxBins} from '../bin';
import {Channel, ROW, COLUMN, COLOR} from '../channel';
import {SOURCE, STACKED_SCALE, SUMMARY} from '../data';
import {field} from '../fielddef';
import {QUANTITATIVE, TEMPORAL, ORDINAL} from '../type';
import {scaleType} from './scale';
import {parseExpression, rawDomain} from './time';
import {AggregateOp} from '../aggregate';

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

  // add rank to the last dataset
  rankTransform(def[def.length-1], model);

  // append non-positive filter at the end for the data table
  filterNonPositiveForLog(def[def.length - 1], model);

  // Stack
  const stackDef = model.stack();
  if (stackDef) {
    def.push(stack.def(model, stackDef));
  }

  return def.concat(
    dates.defs(model) // Time domain tables
  );
}

export namespace source {
  export function def(model: Model): VgData {
    let source:VgData = {name: SOURCE};

    // Data source (url or inline)
    const data = model.data();

    if (data) {
      if (data.values && data.values.length > 0) {
        source.values = model.data().values;
        source.format = {type: 'json'};
      } else if (data.url) {
        source.url = data.url;

        // Extract extension from URL using snippet from
        // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
        let defaultExtension = /(?:\.([^.]+))?$/.exec(source.url)[1];
        if (!contains(['json', 'csv', 'tsv'], defaultExtension)) {
          defaultExtension = 'json';
        }
        source.format = {type: model.data().formatType || defaultExtension};
      }
    }

      // Set data's format.parse if needed
    const parse = formatParse(model);
    if (parse) {
      source.format = source.format || {};
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
      const scale = model.scale(channel);
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
        // color ramp has type linear or time
        if (scaleType(scale, fieldDef, channel, model.mark()) === ScaleType.ORDINAL || channel === COLOR) {
          transform.push({
            type: 'formula',
            field: field(fieldDef, {binSuffix: '_range'}),
            expr: field(fieldDef, {datum: true, binSuffix: '_start'}) +
                  ' + \'-\' + ' +
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
    const filter = model.transform().filter;
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

export namespace summary {
  export function def(model: Model):VgData {
    /* dict set for dimensions */
    let dims = {};

    /* dictionary mapping field name => dict set of aggregation functions */
    let meas = {};

    let hasAggregate = false;

    model.forEach(function(fieldDef: FieldDef, channel: Channel) {
      if (fieldDef.aggregate) {
        hasAggregate = true;
        if (fieldDef.aggregate === AggregateOp.COUNT) {
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

          const scale = model.scale(channel);
          if (scaleType(scale, fieldDef, channel, model.mark()) === ScaleType.ORDINAL) {
            // also produce bin_range if the binned field use ordinal scale
            dims[field(fieldDef, {binSuffix: '_range'})] = field(fieldDef, {binSuffix: '_range'});
          }
        } else {
          dims[field(fieldDef)] = field(fieldDef);
        }
      }
    });

    const groupby = vals(dims);

    // short-format summarize object for Vega's aggregate transform
    // https://github.com/vega/vega/wiki/Data-Transforms#-aggregate
    const summarize = reduce(meas, function(aggregator, fnDictSet, field) {
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
    const groupbyChannel = stackProps.groupbyChannel,
    fieldChannel = stackProps.fieldChannel,
    facetFields = (model.has(COLUMN) ? [model.field(COLUMN)] : [])
                      .concat((model.has(ROW) ? [model.field(ROW)] : []));

    const stacked:VgData = {
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

// We need to add a rank transform so that we can use the rank value as
// input for color ramp's linear scale.
export function rankTransform(dataTable, model: Model) {
  if (model.has(COLOR) && model.fieldDef(COLOR).type === ORDINAL) {
    dataTable.transform = dataTable.transform.concat([{
      type: 'sort',
      by: model.field(COLOR)
    },{
      type: 'rank',
      field: model.field(COLOR),
      output: {
        rank: model.field(COLOR, {prefn: 'rank_'})
      }
    }]);
  }
}

export function filterNonPositiveForLog(dataTable, model: Model) {
  model.forEach(function(_, channel) {
    const scale = model.scale(channel);
    if (scale && scale.type === ScaleType.LOG) {
      dataTable.transform.push({
        type: 'filter',
        test: model.field(channel, {datum: true}) + ' > 0'
      });
    }
  });
}
