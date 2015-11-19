import * as vlFieldDef from '../fielddef';
import * as util from '../util';
import Encoding from '../Encoding';
import {Table, Type} from '../consts';

import * as time from './time';

/**
 * Create Vega's data array from a given encoding.
 *
 * @param  {Encoding} encoding
 * @return {Array} Array of Vega data.
 *                 This always includes a "source" data table.
 *                 If the encoding contains aggregate value, this will also create
 *                 aggregate table as well.
 */
export default function(encoding: Encoding) {
  var def = [source.def(encoding)];

  var summaryDef = summary.def(encoding);
  if (summaryDef) {
    def.push(summaryDef);
  }

  // TODO add "having" filter here

  // append non-positive filter at the end for the data table
  filterNonPositive(def[def.length - 1], encoding);

  // Stack
  var stackCfg = encoding.stack();
  if (stackCfg) {
    def.push(stack.def(encoding, stackCfg));
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
  export function def(encoding: Encoding): VgData {
    var source:VgData = {name: Table.SOURCE};

    // Data source (url or inline)
    if (encoding.hasValues()) {
      source.values = encoding.data().values;
      source.format = {type: 'json'};
    } else {
      source.url = encoding.data().url;
      source.format = {type: encoding.data().formatType};
    }

    // Set data's format.parse if needed
    var parse = formatParse(encoding);
    if (parse) {
      source.format.parse = parse;
    }

    source.transform = transform(encoding);
    return source;
  }

  function formatParse(encoding: Encoding) {
    var parse;

    encoding.forEach(function(fieldDef) {
      if (fieldDef.type === Type.TEMPORAL) {
        parse = parse || {};
        parse[fieldDef.name] = 'date';
      } else if (fieldDef.type === Type.QUANTITATIVE) {
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
  export function transform(encoding: Encoding) {
    // null filter comes first so transforms are not performed on null values
    // time and bin should come before filter so we can filter by time and bin
    return nullFilterTransform(encoding).concat(
      formulaTransform(encoding),
      timeTransform(encoding),
      binTransform(encoding),
      filterTransform(encoding)
    );
  }

  export function timeTransform(encoding: Encoding) {
    return encoding.reduce(function(transform, fieldDef, encType) {
      if (fieldDef.type === Type.TEMPORAL && fieldDef.timeUnit) {
        var fieldRef = encoding.fieldRef(encType, {nofn: true, datum: true});

        transform.push({
          type: 'formula',
          field: encoding.fieldRef(encType),
          expr: time.formula(fieldDef.timeUnit, fieldRef)
        });
      }
      return transform;
    }, []);
  }

  export function binTransform(encoding: Encoding) {
    return encoding.reduce(function(transform, fieldDef, encType) {
      if (encoding.bin(encType)) {
        transform.push({
          type: 'bin',
          field: fieldDef.name,
          output: {
            start: encoding.fieldRef(encType, {bin_suffix: '_start'}),
            end: encoding.fieldRef(encType, {bin_suffix: '_end'})
          },
          maxbins: encoding.bin(encType).maxbins
        });
        // temporary fix for adding missing `bin_mid` from the bin transform
        transform.push({
          type: 'formula',
          field: encoding.fieldRef(encType, {bin_suffix: '_mid'}),
          expr: '(' + encoding.fieldRef(encType, {datum:1, bin_suffix: '_start'}) + '+' + encoding.fieldRef(encType, {datum:1, bin_suffix: '_end'}) + ')/2'
        });
      }
      return transform;
    }, []);
  }

  /**
   * @return {Array} An array that might contain a filter transform for filtering null value based on filterNul config
   */
  export function nullFilterTransform(encoding: Encoding) {
    var filteredFields = util.reduce(encoding.fields(),
      function(filteredFields, fieldList, fieldName) {
        if (fieldName === '*') return filteredFields; //count

        // TODO(#597) revise how filterNull is structured.
        if ((encoding.config('filterNull').quantitative && fieldList.containsType[Type.QUANTITATIVE]) ||
            (encoding.config('filterNull').temporal && fieldList.containsType[Type.TEMPORAL]) ||
            (encoding.config('filterNull').ordinal && fieldList.containsType[Type.ORDINAL]) ||
            (encoding.config('filterNull').nominal && fieldList.containsType[Type.NOMINAL])) {
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

  export function filterTransform(encoding: Encoding) {
    var filter = encoding.data().filter;
    return filter ? [{
        type: 'filter',
        test: filter
    }] : [];
  }

  export function formulaTransform(encoding: Encoding) {
    var calculate = encoding.data().calculate;
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
  export function def(encoding):VgData {
    /* dict set for dimensions */
    var dims = {};

    /* dictionary mapping field name => dict set of aggregation functions */
    var meas = {};

    var hasAggregate = false;

    encoding.forEach(function(fieldDef, encType) {
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
          dims[encoding.fieldRef(encType, {bin_suffix: '_start'})] = encoding.fieldRef(encType, {bin_suffix: '_start'});
          dims[encoding.fieldRef(encType, {bin_suffix: '_mid'})] = encoding.fieldRef(encType, {bin_suffix: '_mid'});
          dims[encoding.fieldRef(encType, {bin_suffix: '_end'})] = encoding.fieldRef(encType, {bin_suffix: '_end'});
        } else {
          dims[fieldDef.name] = encoding.fieldRef(encType);
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
        name: Table.SUMMARY,
        source: Table.SOURCE,
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
  export function def(encoding: Encoding, stackCfg):VgData {
    var dim = stackCfg.groupby;
    var val = stackCfg.value;
    var facets = encoding.facets();

    var stacked:VgData = {
      name: Table.STACKED,
      source: encoding.dataTable(),
      transform: [{
        type: 'aggregate',
        groupby: [encoding.fieldRef(dim)].concat(facets), // dim and other facets
        summarize: [{ops: ['sum'], field: encoding.fieldRef(val)}]
      }]
    };

    if (facets && facets.length > 0) {
      stacked.transform.push({ //calculate max for each facet
        type: 'aggregate',
        groupby: facets,
        summarize: [{
          ops: ['max'],
          // we want max of sum from above transform
          field: encoding.fieldRef(val, {prefn: 'sum_'})
        }]
      });
    }
    return stacked;
  };
}

export function filterNonPositive(dataTable, encoding: Encoding) {
  encoding.forEach(function(_, encType) {
    if (encoding.scale(encType).type === 'log') {
      dataTable.transform.push({
        type: 'filter',
        test: encoding.fieldRef(encType, {datum: 1}) + ' > 0'
      });
    }
  });
}
