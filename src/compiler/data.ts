import * as vlEncDef from '../encdef';
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
  export function def(encoding): VgData {
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
  };

  function formatParse(encoding) {
    var parse;

    encoding.forEach(function(encDef) {
      if (encDef.type == Type.T) {
        parse = parse || {};
        parse[encDef.name] = 'date';
      } else if (encDef.type == Type.Q) {
        if (vlEncDef.isCount(encDef)) return;
        parse = parse || {};
        parse[encDef.name] = 'number';
      }
    });

    return parse;
  };

  /**
   * Generate Vega transforms for the source data table.  This can include
   * transforms for time unit, binning and filtering.
   */
  export function transform(encoding) {
    // null filter comes first so transforms are not performed on null values
    // time and bin should come before filter so we can filter by time and bin
    return nullFilterTransform(encoding).concat(
      formulaTransform(encoding),
      timeTransform(encoding),
      binTransform(encoding),
      filterTransform(encoding)
    );
  };

  export function timeTransform(encoding) {
    return encoding.reduce(function(transform, encDef, encType) {
      if (encDef.type === Type.T && encDef.timeUnit) {
        var fieldRef = encoding.fieldRef(encType, {nofn: true, datum: true});

        transform.push({
          type: 'formula',
          field: encoding.fieldRef(encType),
          expr: time.formula(encDef.timeUnit, fieldRef)
        });
      }
      return transform;
    }, []);
  };

  export function binTransform(encoding) {
    return encoding.reduce(function(transform, encDef, encType) {
      if (encoding.bin(encType)) {
        transform.push({
          type: 'bin',
          field: encDef.name,
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
  };

  /**
   * @return {Array} An array that might contain a filter transform for filtering null value based on filterNul config
   */
  export function nullFilterTransform(encoding) {
    var filteredFields = util.reduce(encoding.fields(),
      function(filteredFields, fieldList, fieldName) {
        if (fieldName === '*') return filteredFields; //count

        // TODO(#597) revise how filterNull is structured.
        if ((encoding.config('filterNull').Q && fieldList.containsType[Type.Q]) ||
            (encoding.config('filterNull').T && fieldList.containsType[Type.T]) ||
            (encoding.config('filterNull').O && fieldList.containsType[Type.O]) ||
            (encoding.config('filterNull').N && fieldList.containsType[Type.N])) {
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
  };

  export function filterTransform(encoding) {
    var filter = encoding.data().filter;
    return filter ? [{
        type: 'filter',
        test: filter
    }] : [];
  };

  export function formulaTransform(encoding) {
    var formulas = encoding.data().formulas;
    if (formulas === undefined) {
      return [];
    }

    return formulas.reduce(function(transform, formula) {
      formula.type = 'formula';
      transform.push(formula);
      return transform;
    }, []);
  };
}
export namespace summary {
  export function def(encoding):VgData {
    /* dict set for dimensions */
    var dims = {};

    /* dictionary mapping field name => dict set of aggregation functions */
    var meas = {};

    var hasAggregate = false;

    encoding.forEach(function(encDef, encType) {
      if (encDef.aggregate) {
        hasAggregate = true;
        if (encDef.aggregate === 'count') {
          meas['*'] = meas['*'] || {};
          meas['*'].count = true;
        } else {
          meas[encDef.name] = meas[encDef.name] || {};
          meas[encDef.name][encDef.aggregate] = true;
        }
      } else {
        if (encDef.bin) {
          // TODO(#694) only add dimension for the required ones.
          dims[encoding.fieldRef(encType, {bin_suffix: '_start'})] = encoding.fieldRef(encType, {bin_suffix: '_start'});
          dims[encoding.fieldRef(encType, {bin_suffix: '_mid'})] = encoding.fieldRef(encType, {bin_suffix: '_mid'});
          dims[encoding.fieldRef(encType, {bin_suffix: '_end'})] = encoding.fieldRef(encType, {bin_suffix: '_end'});
        } else {
          dims[encDef.name] = encoding.fieldRef(encType);
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
  export function def(encoding, stackCfg):VgData {
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

export function filterNonPositive(dataTable, encoding) {
  encoding.forEach(function(encDef, encType) {
    if (encoding.scale(encType).type === 'log') {
      dataTable.transform.push({
        type: 'filter',
        test: encoding.fieldRef(encType, {datum: 1}) + ' > 0'
      });
    }
  });
};
