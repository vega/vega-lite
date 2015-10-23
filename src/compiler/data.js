'use strict';

require('../globals');

module.exports = data;

var vlEncDef = require('../encdef'),
  util = require('../util'),
  time = require('./time');

/**
 * Create Vega's data array from a given encoding.
 *
 * @param  {Encoding} encoding
 * @return {Array} Array of Vega data.
 *                 This always includes a "raw" data table.
 *                 If the encoding contains aggregate value, this will also create
 *                 aggregate table as well.
 */
function data(encoding) {
  var def = [data.raw(encoding)];

  var aggregate = data.aggregate(encoding);
  if (aggregate) {
    def.push(data.aggregate(encoding));
  }

  // TODO add "having" filter here

  // append non-positive filter at the end for the data table
  data.filterNonPositive(def[def.length - 1], encoding);

  // Stack
  var stack = encoding.stack();
  if (stack) {
    def.push(data.stack(encoding, stack));
  }

  return def;
}

data.raw = function(encoding) {
  var raw = {name: RAW};

  // Data source (url or inline)
  if (encoding.hasValues()) {
    raw.values = encoding.data().values;
    raw.format = {type: 'json'};
  } else {
    raw.url = encoding.data().url;
    raw.format = {type: encoding.data().formatType};
  }

  // Set data's format.parse if needed
  var parse = data.raw.formatParse(encoding);
  if (parse) {
    raw.format.parse = parse;
  }

  raw.transform = data.raw.transform(encoding);
  return raw;
};

data.raw.formatParse = function(encoding) {
  var parse;

  encoding.forEach(function(encDef) {
    if (encDef.type == T) {
      parse = parse || {};
      parse[encDef.name] = 'date';
    } else if (encDef.type == Q) {
      if (vlEncDef.isCount(encDef)) return;
      parse = parse || {};
      parse[encDef.name] = 'number';
    }
  });

  return parse;
};

/**
 * Generate Vega transforms for the raw data table.  This can include
 * transforms for time unit, binning and filtering.
 */
data.raw.transform = function(encoding) {
  // null filter comes first so transforms are not performed on null values
  // time and bin should come before filter so we can filter by time and bin
  return data.raw.transform.nullFilter(encoding).concat(
    data.raw.transform.formula(encoding),
    data.raw.transform.time(encoding),
    data.raw.transform.bin(encoding),
    data.raw.transform.filter(encoding)
  );
};

data.raw.transform.time = function(encoding) {
  return encoding.reduce(function(transform, encDef, encType) {
    if (encDef.type === T && encDef.timeUnit) {
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

data.raw.transform.bin = function(encoding) {
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
data.raw.transform.nullFilter = function(encoding) {
  var filteredFields = util.reduce(encoding.fields(),
    function(filteredFields, fieldList, fieldName) {
      if (fieldName === '*') return filteredFields; //count

      // TODO(#597) revise how filterNull is structured.
      if ((encoding.config('filterNull').Q && fieldList.containsType[Q]) ||
          (encoding.config('filterNull').T && fieldList.containsType[T]) ||
          (encoding.config('filterNull').O && fieldList.containsType[O]) ||
          (encoding.config('filterNull').N && fieldList.containsType[N])) {
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

data.raw.transform.filter = function(encoding) {
  var filter = encoding.data().filter;
  return filter ? [{
      type: 'filter',
      test: filter
  }] : [];
};

data.raw.transform.formula = function(encoding) {
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

data.aggregate = function(encoding) {
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
      name: AGGREGATE,
      source: RAW,
      transform: [{
        type: 'aggregate',
        groupby: groupby,
        summarize: summarize
      }]
    };
  }

  return null;
};

/**
 * Add stacked data source, for feeding the shared scale.
 */
data.stack = function(encoding, stack) {
  var dim = stack.groupby;
  var val = stack.value;
  var facets = encoding.facets();

  var stacked = {
    name: STACKED,
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

data.filterNonPositive = function(dataTable, encoding) {
  encoding.forEach(function(encDef, encType) {
    if (encoding.scale(encType).type === 'log') {
      dataTable.transform.push({
        type: 'filter',
        test: encoding.fieldRef(encType, {datum: 1}) + ' > 0'
      });
    }
  });
};
