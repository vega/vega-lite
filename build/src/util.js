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
function reduce(obj, f, init, thisArg) {
    if (obj.reduce) {
        return obj.reduce.call(thisArg, f, init);
    }
    else {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                init = f.call(thisArg, init, obj[k], k, obj);
            }
        }
        return init;
    }
}
exports.reduce = reduce;
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
;
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
;
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
;
function duplicate(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.duplicate = duplicate;
;
function isBoolean(b) {
    return b === true || b === false;
}
exports.isBoolean = isBoolean;
//# sourceMappingURL=util.js.map