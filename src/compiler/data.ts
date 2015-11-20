import * as vlFieldDef from '../fielddef';
import * as util from '../util';
import {Model} from './Model';
import {SOURCE, STACKED, SUMMARY} from '../data';
import * as time from './time';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';
import {Channel} from '../channel';

/**
 * Create Vega's data array from a given encoding.
 *
 * @param  {Encoding} encoding
 * @return {Array} Array of Vega data.
 *                 This always includes a "source" data table.
 *                 If the encoding contains aggregate value, this will also create
 *                 aggregate table as well.
 */
export default function(model: Model) {
  var def = [source.def(model)];

  var summaryDef = summary.def(model);
  if (summaryDef) {
    def.push(summaryDef);
  }

  // TODO add "having" filter here

  // append non-positive filter at the end for the data table
  filterNonPositive(def[def.length - 1], model);

  // Stack
  var stackCfg = model.stack();
  if (stackCfg) {
    def.push(stack.def(model, stackCfg));
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

    model.forEach(function(fieldDef) {
      if (fieldDef.type === TEMPORAL) {
        parse = parse || {};
        parse[fieldDef.name] = 'date';
      } else if (fieldDef.type === QUANTITATIVE) {
        if (vlFieldDef.isCount(fieldDef)) return;
        parse = parse || {};
        parse[fieldDef.name] = 'number';
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
    return model.reduce(function(transform, fieldDef, channel) {
      if (fieldDef.type === TEMPORAL && fieldDef.timeUnit) {
        var fieldRef = model.fieldRef(channel, {nofn: true, datum: true});

        transform.push({
          type: 'formula',
          field: model.fieldRef(channel),
          expr: time.formula(fieldDef.timeUnit, fieldRef)
        });
      }
      return transform;
    }, []);
  }

  export function binTransform(model: Model) {
    return model.reduce(function(transform, fieldDef, channel) {
      if (model.bin(channel)) {
        transform.push({
          type: 'bin',
          field: fieldDef.name,
          output: {
            start: model.fieldRef(channel, {binSuffix: '_start'}),
            end: model.fieldRef(channel, {binSuffix: '_end'})
          },
          maxbins: model.bin(channel).maxbins
        });
        // temporary fix for adding missing `bin_mid` from the bin transform
        transform.push({
          type: 'formula',
          field: model.fieldRef(channel, {binSuffix: '_mid'}),
          expr: '(' + model.fieldRef(channel, {datum:1, binSuffix: '_start'}) + '+' + model.fieldRef(channel, {datum:1, binSuffix: '_end'}) + ')/2'
        });
      }
      return transform;
    }, []);
  }

  /**
   * @return {Array} An array that might contain a filter transform for filtering null value based on filterNul config
   */
  export function nullFilterTransform(model: Model) {
    var filteredFields = util.reduce(model.fields(),
      function(filteredFields, fieldList, fieldName) {
        if (fieldName === '*') return filteredFields; //count

        // TODO(#597) revise how filterNull is structured.
        if ((model.config('filterNull').quantitative && fieldList.containsType[QUANTITATIVE]) ||
            (model.config('filterNull').temporal && fieldList.containsType[TEMPORAL]) ||
            (model.config('filterNull').ordinal && fieldList.containsType[ORDINAL]) ||
            (model.config('filterNull').nominal && fieldList.containsType[NOMINAL])) {
          filteredFields.push(fieldName);
        }
        return filteredFields;
      }, []);

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
      formula.type = 'formula';
      transform.push(formula);
      return transform;
    }, []);
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
          meas[fieldDef.name] = meas[fieldDef.name] || {};
          meas[fieldDef.name][fieldDef.aggregate] = true;
        }
      } else {
        if (fieldDef.bin) {
          // TODO(#694) only add dimension for the required ones.
          dims[model.fieldRef(channel, {binSuffix: '_start'})] = model.fieldRef(channel, {binSuffix: '_start'});
          dims[model.fieldRef(channel, {binSuffix: '_mid'})] = model.fieldRef(channel, {binSuffix: '_mid'});
          dims[model.fieldRef(channel, {binSuffix: '_end'})] = model.fieldRef(channel, {binSuffix: '_end'});
        } else {
          dims[fieldDef.name] = model.fieldRef(channel);
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
  export function def(model: Model, stackCfg):VgData {
    var dim = stackCfg.groupby;
    var val = stackCfg.value;
    var facets = model.facets();

    var stacked:VgData = {
      name: STACKED,
      source: model.dataTable(),
      transform: [{
        type: 'aggregate',
        groupby: [model.fieldRef(dim)].concat(facets), // dim and other facets
        summarize: [{ops: ['sum'], field: model.fieldRef(val)}]
      }]
    };

    if (facets && facets.length > 0) {
      stacked.transform.push({ //calculate max for each facet
        type: 'aggregate',
        groupby: facets,
        summarize: [{
          ops: ['max'],
          // we want max of sum from above transform
          field: model.fieldRef(val, {prefn: 'sum_'})
        }]
      });
    }
    return stacked;
  };
}

export function filterNonPositive(dataTable, model: Model) {
  model.forEach(function(_, channel) {
    if (model.scale(channel).type === 'log') {
      dataTable.transform.push({
        type: 'filter',
        test: model.fieldRef(channel, {datum: 1}) + ' > 0'
      });
    }
  });
}
