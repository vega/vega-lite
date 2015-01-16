var isEmpty = function(obj) {
  return Object.keys(obj).length === 0
}

// instantiate a schema
exports.instantiate = function(schema, required) {
  if (schema.type === 'object') {
    schema.required = schema.required ? schema.required : [];
    var instance = {};
    for (var name in schema.properties) {
      var child = schema.properties[name];
      instance[name] = exports.instantiate(child, schema.required.indexOf(name) != -1);
    };
    return instance;
  } else if ('default' in schema) {
    return schema.default;
  } else if (schema.enum && required) {
    return schema.enum[0];
  }
  return undefined;
};

// remove all defaults from an instance
exports.difference = function(defaults, instance) {
  var changes = {};
  for (var prop in instance) {
    if (!defaults || defaults[prop] !== instance[prop]) {
      if (typeof instance[prop] == "object") {
        var c = exports.difference(defaults[prop], instance[prop]);
        if (!isEmpty(c))
          changes[prop] = c;
      } else {
        changes[prop] = instance[prop];
      }
    }
  }
  return changes;
};

// recursively merges instance into defaults
exports.merge = function (defaults, instance) {
    if (typeof instance!=='object' || instance===null) {
      return defaults;
    }

    for (var p in instance) {
      if (!instance.hasOwnProperty(p))
        continue;
      if (instance[p]===undefined )
        continue;
      if (typeof instance[p] !== 'object' || instance[p] === null) {
        defaults[p] = instance[p];
      } else if (typeof defaults[p] !== 'object' || defaults[p] === null) {
        defaults[p] = exports.merge(instance[p].constructor === Array ? [] : {}, instance[p]);
      } else {
        exports.merge(defaults[p], instance[p]);
      }
    }
    return defaults;
  }
