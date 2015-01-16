var schema = require("./schema.js").spec,
  util = require('util'),
  _ = require("lodash");

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0
}

exports.instantiate = function(schema, required) {
  if (schema.type === 'object') {
    schema.required = schema.required ? schema.required : [];
    return _.mapValues(schema.properties, function(child, name) {
      return exports.instantiate(child, _.contains(schema.required , name));
    });
  } else if (_.has(schema, 'default')) {
    return schema.default;
  } else if (schema.enum && required) {
    return schema.enum[0];
  }
  return undefined;
};

exports.difference = function(defaults, schema) {
  var changes = {};
  for (var prop in schema) {
    if (!defaults || defaults[prop] !== schema[prop]) {
      if (typeof schema[prop] == "object") {
        var c = exports.difference(defaults[prop], schema[prop]);
        if (!isEmpty(c))
          changes[prop] = c;
      } else {
        changes[prop] = schema[prop];
      }
    }
  }
  return changes;
};
