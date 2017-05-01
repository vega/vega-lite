"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stringify = require("json-stable-stringify");
var vega_util_1 = require("vega-util");
exports.extend = vega_util_1.extend;
exports.isArray = vega_util_1.isArray;
exports.isObject = vega_util_1.isObject;
exports.isNumber = vega_util_1.isNumber;
exports.isString = vega_util_1.isString;
exports.truncate = vega_util_1.truncate;
exports.toSet = vega_util_1.toSet;
exports.stringValue = vega_util_1.stringValue;
var vega_util_2 = require("vega-util");
/**
 * Creates an object composed of the picked object properties.
 *
 * Example:  (from lodash)
 *
 * var object = {'a': 1, 'b': '2', 'c': 3};
 * pick(object, ['a', 'c']);
 * // → {'a': 1, 'c': 3}
 *
 */
function pick(obj, props) {
    var copy = {};
    props.forEach(function (prop) {
        if (obj.hasOwnProperty(prop)) {
            copy[prop] = obj[prop];
        }
    });
    return copy;
}
exports.pick = pick;
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
function omit(obj, props) {
    var copy = duplicate(obj);
    props.forEach(function (prop) {
        delete copy[prop];
    });
    return copy;
}
exports.omit = omit;
function hash(a) {
    if (vega_util_2.isString(a) || vega_util_2.isNumber(a) || isBoolean(a)) {
        return String(a);
    }
    return stringify(a);
}
exports.hash = hash;
function contains(array, item) {
    return array.indexOf(item) > -1;
}
exports.contains = contains;
/** Returns the array without the elements in item */
function without(array, excludedItems) {
    return array.filter(function (item) { return !contains(excludedItems, item); });
}
exports.without = without;
function union(array, other) {
    return array.concat(without(other, array));
}
exports.union = union;
/**
 * Returns true if any item returns true.
 */
function some(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
exports.some = some;
/**
 * Returns true if all items return true.
 */
function every(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
function flatten(arrays) {
    return [].concat.apply([], arrays);
}
exports.flatten = flatten;
/**
 * recursively merges src into dest
 */
function mergeDeep(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    for (var _a = 0, src_1 = src; _a < src_1.length; _a++) {
        var s = src_1[_a];
        dest = deepMerge_(dest, s);
    }
    return dest;
}
exports.mergeDeep = mergeDeep;
// recursively merges src into dest
function deepMerge_(dest, src) {
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
        if (typeof src[p] !== 'object' || vega_util_2.isArray(src[p]) || src[p] === null) {
            dest[p] = src[p];
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = mergeDeep(src[p].constructor === Array ? [] : {}, src[p]);
        }
        else {
            mergeDeep(dest[p], src[p]);
        }
    }
    return dest;
}
function unique(values, f) {
    var results = [];
    var u = {};
    var v;
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var val = values_1[_i];
        v = f(val);
        if (v in u) {
            continue;
        }
        u[v] = 1;
        results.push(val);
    }
    return results;
}
exports.unique = unique;
/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
function differ(dict, other) {
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            if (other[key] && dict[key] && other[key] !== dict[key]) {
                return true;
            }
        }
    }
    return false;
}
exports.differ = differ;
function hasIntersection(a, b) {
    for (var key in a) {
        if (key in b) {
            return true;
        }
    }
    return false;
}
exports.hasIntersection = hasIntersection;
function differArray(array, other) {
    if (array.length !== other.length) {
        return true;
    }
    array.sort();
    other.sort();
    for (var i = 0; i < array.length; i++) {
        if (other[i] !== array[i]) {
            return true;
        }
    }
    return false;
}
exports.differArray = differArray;
exports.keys = Object.keys;
function vals(x) {
    var _vals = [];
    for (var k in x) {
        if (x.hasOwnProperty(k)) {
            _vals.push(x[k]);
        }
    }
    return _vals;
}
exports.vals = vals;
function duplicate(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.duplicate = duplicate;
function isBoolean(b) {
    return b === true || b === false;
}
exports.isBoolean = isBoolean;
/**
 * Convert a string into a valid variable name
 */
function varName(s) {
    // Replace non-alphanumeric characters (anything besides a-zA-Z0-9_) with _
    var alphanumericS = s.replace(/\W/g, '_');
    // Add _ if the string has leading numbers.
    return (s.match(/^\d+/) ? '_' : '') + alphanumericS;
}
exports.varName = varName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQW1EO0FBQ25ELHVDQUFzRztBQUE5Riw2QkFBQSxNQUFNLENBQUE7QUFBRSw4QkFBQSxPQUFPLENBQUE7QUFBRSwrQkFBQSxRQUFRLENBQUE7QUFBRSwrQkFBQSxRQUFRLENBQUE7QUFBRSwrQkFBQSxRQUFRLENBQUE7QUFBRSwrQkFBQSxRQUFRLENBQUE7QUFBRSw0QkFBQSxLQUFLLENBQUE7QUFBRSxrQ0FBQSxXQUFXLENBQUE7QUFDbkYsdUNBQXNEO0FBRXREOzs7Ozs7Ozs7R0FTRztBQUNILGNBQXFCLEdBQVEsRUFBRSxLQUFlO0lBQzVDLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNoQixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtRQUNqQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBUkQsb0JBUUM7QUFFRDs7O0dBR0c7QUFDSCxjQUFxQixHQUFRLEVBQUUsS0FBZTtJQUM1QyxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7UUFDakIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQU5ELG9CQU1DO0FBRUQsY0FBcUIsQ0FBTTtJQUN6QixFQUFFLENBQUMsQ0FBQyxvQkFBUSxDQUFDLENBQUMsQ0FB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