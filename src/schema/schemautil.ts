import * as util from '../util';

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
};

export function extend(instance, schema) {
  return merge(instantiate(schema), instance);
};

// instantiate a schema
export function instantiate(schema) {
  var val;
  if (schema === undefined) {
    return undefined;
  } else if ('default' in schema) {
    val = schema.default;
    return util.isObject(val) ? util.duplicate(val) : val;
  } else if (schema.type === 'object') {
    var instance = {};
    for (var name in schema.properties) {
      if (schema.properties.hasOwnProperty(name)) {
        val = instantiate(schema.properties[name]);
        if (val !== undefined) {
          instance[name] = val;
        }
      }
    }
    return instance;
  } else if (schema.type === 'array') {
    return undefined;
  }
  return undefined;
};

// remove all defaults from an instance
export function subtract(instance, defaults) {
  var changes: any = {};
  for (var prop in instance) {
    if (instance.hasOwnProperty(prop)) {
      var def = defaults[prop];
      var ins = instance[prop];
      // Note: does not properly subtract arrays
      if (!defaults || def !== ins) {
        if (typeof ins === 'object' && !util.isArray(ins) && def) {
          var c = subtract(ins, def);
          if (!isEmpty(c)) {
            changes[prop] = c;
          }
        } else if (util.isArray(ins)) {
          if (util.isArray(def)) {
            // check each item in the array
            if (ins.length === def.length) {
              var equal = true;
              for (var i = 0; i < ins.length; i++) {
                if (ins[i] !== def[i]) {
                  equal = false;
                  break;
                }
              }
              if (equal) {
                continue; // continue with next property
              }
            }
          }
          changes[prop] = ins;
        } else {
          changes[prop] = ins;
        }
      }
    }
  }
  return changes;
};

export function merge(dest, ...src: any[]) {
  for (var i = 0; i < src.length; i++) {
    dest = merge_(dest, src[i]);
  }
  return dest;
};

// recursively merges src into dest
function merge_(dest, src) {
  if (typeof src !== 'object' || src === null) {
    return dest;
  }

  for (var p in src) {
    if (!src.hasOwnProperty(p)) {
      continue;
    }
    if (src[p] === undefined) {
      continue;
    }
    if (typeof src[p] !== 'object' || src[p] === null) {
      dest[p] = src[p];
    } else if (typeof dest[p] !== 'object' || dest[p] === null) {
      dest[p] = merge(src[p].constructor === Array ? [] : {}, src[p]);
    } else {
      merge(dest[p], src[p]);
    }
  }
  return dest;
}
