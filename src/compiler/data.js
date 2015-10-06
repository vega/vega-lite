'use strict';

require('../globals');

module.exports = data;

var vlfield = require('../field'),
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
  if (aggregate) def.push(data.aggregate(encoding));

  // TODO add "having" filter here

  // append non-positive filter at the end for the data table
  data.filterNonPositive(def[def.length - 1], encoding);

  return def;
}

data.raw = function(encoding) {
  var raw = {name: RAW};

  // Data source (url or inline)
  if (encoding.hasValues()) {
    raw.values = encoding.data().values;
  } else {
    raw.url = encoding.data().url;
    raw.format = {type: encoding.data().formatType};
  }

  // Set data's format.parse if needed
  var parse = data.raw.formatParse(encoding);
  if (parse) {
    raw.format = raw.format || {};
    raw.format.parse = parse;
  }

  raw.transform = data.raw.transform(encoding);
  return raw;
};

data.raw.formatParse = function(encoding) {
  var parse;

  encoding.forEach(function(field) {
    if (field.type == T) {
      parse = parse || {};
      parse[field.name] = 'date';
    } else if (field.type == Q) {
      if (vlfield.isCount(field)) return;
      parse = parse || {};
      parse[field.name] = 'number';
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
    data.raw.transform.time(encoding),
    data.raw.transform.bin(encoding),
    data.raw.transform.filter(encoding)
  );
};

data.raw.transform.time = function(encoding) {
  return encoding.reduce(function(transform, field, encType) {
    if (field.type === T && field.timeUnit) {
      var fieldRef = encoding.fieldRef(encType, {nofn: true, datum: true});

      transform.push({
        type: 'formula',
        field: encoding.fieldRef(encType),
        expr: time.formula(field.timeUnit, fieldRef)
      });
    }
    return transform;
  }, []);
};

data.raw.transform.bin = function(encoding) {
  return encoding.reduce(function(transform, field, encType) {
    if (encoding.bin(encType)) {
      transform.push({
        type: 'bin',
        field: field.name,
        output: encoding.fieldRef(encType),
        maxbins: encoding.bin(encType).maxbins
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

data.aggregate = function(encoding) {
  var dims = {}, meas = {};

  encoding.forEach(function(field, encType) {
    if (field.aggregate) {
      if (field.aggregate === 'count') {
        meas.count = {op: 'count', field: '*'};
      }else {
        meas[field.aggregate + '|' + field.name] = {
          op: field.aggregate,
          field: field.name
        };
      }
    } else {
      dims[field.name] = encoding.fieldRef(encType);
    }
  });

  dims = util.vals(dims);
  meas = util.vals(meas);

  if (meas.length > 0) {
    return {
      name: AGGREGATE,
      source: RAW,
      transform: [{
        type: 'aggregate',
        groupby: dims,
        fields: meas
      }]
    };
  }

  return null;
};

data.filterNonPositive = function(dataTable, encoding) {
  encoding.forEach(function(field, encType) {
    if (encoding.scale(encType).type === 'log') {
      dataTable.transform.push({
        type: 'filter',
        test: encoding.fieldRef(encType, {datum: 1}) + ' > 0'
      });
    }
  });
};
