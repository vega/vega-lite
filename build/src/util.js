"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var stableStringify_ = require("json-stable-stringify");
var vega_util_1 = require("vega-util");
var logical_1 = require("./logical");
var stableStringify = stableStringify_['default'] || stableStringify_;
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
    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
        var prop = props_1[_i];
        if (obj.hasOwnProperty(prop)) {
            copy[prop] = obj[prop];
        }
    }
    return copy;
}
exports.pick = pick;
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
function omit(obj, props) {
    var copy = tslib_1.__assign({}, obj);
    for (var _i = 0, props_2 = props; _i < props_2.length; _i++) {
        var prop = props_2[_i];
        delete copy[prop];
    }
    return copy;
}
exports.omit = omit;
/**
 * Converts any object into a string representation that can be consumed by humans.
 */
exports.stringify = stableStringify;
/**
 * Converts any object into a string of limited size, or a number.
 */
function hash(a) {
    if (vega_util_1.isNumber(a)) {
        return a;
    }
    var str = vega_util_1.isString(a) ? a : stableStringify(a);
    // short strings can be used as hash directly, longer strings are hashed to reduce memory usage
    if (str.length < 100) {
        return str;
    }
    // from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    var h = 0;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        h = ((h << 5) - h) + char;
        h = h & h; // Convert to 32bit integer
    }
    return h;
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
        if (typeof src[p] !== 'object' || vega_util_1.isArray(src[p]) || src[p] === null) {
            dest[p] = src[p];
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = mergeDeep(vega_util_1.isArray(src[p].constructor) ? [] : {}, src[p]);
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
function isNumeric(num) {
    return !isNaN(num);
}
exports.isNumeric = isNumeric;
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
// This is a stricter version of Object.keys but with better types. See https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
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
function flagKeys(f) {
    return exports.keys(f);
}
exports.flagKeys = flagKeys;
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
function logicalExpr(op, cb) {
    if (logical_1.isLogicalNot(op)) {
        return '!(' + logicalExpr(op.not, cb) + ')';
    }
    else if (logical_1.isLogicalAnd(op)) {
        return '(' + op.and.map(function (and) { return logicalExpr(and, cb); }).join(') && (') + ')';
    }
    else if (logical_1.isLogicalOr(op)) {
        return '(' + op.or.map(function (or) { return logicalExpr(or, cb); }).join(') || (') + ')';
    }
    else {
        return cb(op);
    }
}
exports.logicalExpr = logicalExpr;
/**
 * Delete nested property of an object, and delete the ancestors of the property if they become empty.
 */
function deleteNestedProperty(obj, orderedProps) {
    if (orderedProps.length === 0) {
        return true;
    }
    var prop = orderedProps.shift();
    if (deleteNestedProperty(obj[prop], orderedProps)) {
        delete obj[prop];
    }
    return Object.keys(obj).length === 0;
}
exports.deleteNestedProperty = deleteNestedProperty;
function titlecase(s) {
    return s.charAt(0).toUpperCase() + s.substr(1);
}
exports.titlecase = titlecase;
/**
 * Converts a path to an access path with datum.
 * @param path The field name.
 * @param datum The string to use for `datum`.
 */
function accessPathWithDatum(path, datum) {
    if (datum === void 0) { datum = 'datum'; }
    var pieces = vega_util_1.splitAccessPath(path);
    var prefixes = [];
    for (var i = 1; i <= pieces.length; i++) {
        var prefix = "[" + pieces.slice(0, i).map(vega_util_1.stringValue).join('][') + "]";
        prefixes.push("" + datum + prefix);
    }
    return prefixes.join(' && ');
}
exports.accessPathWithDatum = accessPathWithDatum;
/**
 * Return access with datum to the falttened field.
 * @param path The field name.
 * @param datum The string to use for `datum`.
 */
function flatAccessWithDatum(path, datum) {
    if (datum === void 0) { datum = 'datum'; }
    return datum + "[" + vega_util_1.stringValue(vega_util_1.splitAccessPath(path).join('.')) + "]";
}
exports.flatAccessWithDatum = flatAccessWithDatum;
/**
 * Replaces path accesses with access to non-nested field.
 * For example, `foo["bar"].baz` becomes `foo\\.bar\\.baz`.
 */
function replacePathInField(path) {
    return "" + vega_util_1.splitAccessPath(path).map(function (p) { return p.replace('.', '\\.'); }).join('\\.');
}
exports.replacePathInField = replacePathInField;
/**
 * Remove path accesses with access from field.
 * For example, `foo["bar"].baz` becomes `foo.bar.baz`.
 */
function removePathFromField(path) {
    return "" + vega_util_1.splitAccessPath(path).join('.');
}
exports.removePathFromField = removePathFromField;
/**
 * Count the depth of the path. Returns 1 for fields that are not nested.
 */
function accessPathDepth(path) {
    if (!path) {
        return 0;
    }
    return vega_util_1.splitAccessPath(path).length;
}
exports.accessPathDepth = accessPathDepth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdEQUEwRDtBQUMxRCx1Q0FBb0Y7QUFDcEYscUNBQWtGO0FBRWxGLElBQU0sZUFBZSxHQUFHLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDO0FBRXhFOzs7Ozs7Ozs7R0FTRztBQUNILGNBQXFCLEdBQVcsRUFBRSxLQUFlO0lBQy9DLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNoQixLQUFtQixVQUFLLEVBQUwsZUFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSztRQUFuQixJQUFNLElBQUksY0FBQTtRQUNiLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hCO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFSRCxvQkFRQztBQUVEOzs7R0FHRztBQUNILGNBQXFCLEdBQVcsRUFBRSxLQUFlO0lBQy9DLElBQU0sSUFBSSx3QkFBTyxHQUFHLENBQUMsQ0FBQztJQUN0QixLQUFtQixVQUFLLEVBQUwsZUFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSztRQUFuQixJQUFNLElBQUksY0FBQTtRQUNiLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBTkQsb0JBTUM7QUFFRDs7R0FFRztBQUNVLFFBQUEsU0FBUyxHQUFHLGVBQWUsQ0FBQztBQUV6Qzs7R0FFRztBQUNILGNBQXFCLENBQU07SUFDekIsSUFBSSxvQkFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2YsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUVELElBQU0sR0FBRyxHQUFHLG9CQUFRLENBQUMsQ0FBQyxDQUFDLENB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QUFHLEtBQUssR0FBRyxNQUFRLENBQUMsQ0FBQztLQUNwQztJQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBUkQsa0RBUUM7QUFFRDs7OztHQUlHO0FBQ0gsNkJBQW9DLElBQVksRUFBRSxLQUFhO0lBQWIsc0JBQUEsRUFBQSxlQUFhO0lBQzdELE9BQVUsS0FBSyxTQUFJLHVCQUFXLENBQUMsMkJBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBRyxDQUFDO0FBQ3JFLENBQUM7QUFGRCxrREFFQztBQUVEOzs7R0FHRztBQUNILDRCQUFtQyxJQUFZO0lBQzdDLE9BQU8sS0FBRywyQkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBRyxDQUFDO0FBQ2hGLENBQUM7QUFGRCxnREFFQztBQUVEOzs7R0FHRztBQUNILDZCQUFvQyxJQUFZO0lBQzlDLE9BQU8sS0FBRywyQkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUcsQ0FBQztBQUM5QyxDQUFDO0FBRkQsa0RBRUM7QUFFRDs7R0FFRztBQUNILHlCQUFnQyxJQUFZO0lBQzFDLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDVCxPQUFPLENBQUMsQ0FBQztLQUNWO0lBQ0QsT0FBTywyQkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN0QyxDQUFDO0FBTEQsMENBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzdGFibGVTdHJpbmdpZnlfIGZyb20gJ2pzb24tc3RhYmxlLXN0cmluZ2lmeSc7XG5pbXBvcnQge2lzQXJyYXksIGlzTnVtYmVyLCBpc1N0cmluZywgc3BsaXRBY2Nlc3NQYXRoLCBzdHJpbmdWYWx1ZX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7aXNMb2dpY2FsQW5kLCBpc0xvZ2ljYWxOb3QsIGlzTG9naWNhbE9yLCBMb2dpY2FsT3BlcmFuZH0gZnJvbSAnLi9sb2dpY2FsJztcblxuY29uc3Qgc3RhYmxlU3RyaW5naWZ5ID0gc3RhYmxlU3RyaW5naWZ5X1snZGVmYXVsdCddIHx8IHN0YWJsZVN0cmluZ2lmeV87XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIHBpY2tlZCBvYmplY3QgcHJvcGVydGllcy5cbiAqXG4gKiBFeGFtcGxlOiAgKGZyb20gbG9kYXNoKVxuICpcbiAqIHZhciBvYmplY3QgPSB7J2EnOiAxLCAnYic6ICcyJywgJ2MnOiAzfTtcbiAqIHBpY2sob2JqZWN0LCBbJ2EnLCAnYyddKTtcbiAqIC8vIOKGkiB7J2EnOiAxLCAnYyc6IDN9XG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGljayhvYmo6IG9iamVjdCwgcHJvcHM6IHN0cmluZ1tdKSB7XG4gIGNvbnN0IGNvcHkgPSB7fTtcbiAgZm9yIChjb25zdCBwcm9wIG9mIHByb3BzKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgY29weVtwcm9wXSA9IG9ialtwcm9wXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvcHk7XG59XG5cbi8qKlxuICogVGhlIG9wcG9zaXRlIG9mIF8ucGljazsgdGhpcyBtZXRob2QgY3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIG93blxuICogYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzIG9mIG9iamVjdCB0aGF0IGFyZSBub3Qgb21pdHRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9taXQob2JqOiBvYmplY3QsIHByb3BzOiBzdHJpbmdbXSkge1xuICBjb25zdCBjb3B5ID0gey4uLm9ian07XG4gIGZvciAoY29uc3QgcHJvcCBvZiBwcm9wcykge1xuICAgIGRlbGV0ZSBjb3B5W3Byb3BdO1xuICB9XG4gIHJldHVybiBjb3B5O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFueSBvYmplY3QgaW50byBhIHN0cmluZyByZXByZXNlbnRhdGlvbiB0aGF0IGNhbiBiZSBjb25zdW1lZCBieSBodW1hbnMuXG4gKi9cbmV4cG9ydCBjb25zdCBzdHJpbmdpZnkgPSBzdGFibGVTdHJpbmdpZnk7XG5cbi8qKlxuICogQ29udmVydHMgYW55IG9iamVjdCBpbnRvIGEgc3RyaW5nIG9mIGxpbWl0ZWQgc2l6ZSwgb3IgYSBudW1iZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNoKGE6IGFueSkge1xuICBpZiAoaXNOdW1iZXIoYSkpIHtcbiAgICByZXR1cm4gYTtcbiAgfVxuXG4gIGNvbnN0IHN0ciA9IGlzU3RyaW5nKGEpID8gYSA6IHN0YWJsZVN0cmluZ2lmeShhKTtcblxuICAvLyBzaG9ydCBzdHJpbmdzIGNhbiBiZSB1c2VkIGFzIGhhc2ggZGlyZWN0bHksIGxvbmdlciBzdHJpbmdzIGFyZSBoYXNoZWQgdG8gcmVkdWNlIG1lbW9yeSB1c2FnZVxuICBpZiAoc3RyLmxlbmd0aCA8IDEwMCkge1xuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICAvLyBmcm9tIGh0dHA6Ly93ZXJ4bHRkLmNvbS93cC8yMDEwLzA1LzEzL2phdmFzY3JpcHQtaW1wbGVtZW50YXRpb24tb2YtamF2YXMtc3RyaW5nLWhhc2hjb2RlLW1ldGhvZC9cbiAgbGV0IGggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNoYXIgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICBoID0gKChoPDw1KS1oKStjaGFyO1xuICAgIGggPSBoICYgaDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gIH1cbiAgcmV0dXJuIGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250YWluczxUPihhcnJheTogVFtdLCBpdGVtOiBUKSB7XG4gIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pID4gLTE7XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBhcnJheSB3aXRob3V0IHRoZSBlbGVtZW50cyBpbiBpdGVtICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aG91dDxUPihhcnJheTogVFtdLCBleGNsdWRlZEl0ZW1zOiBUW10pIHtcbiAgcmV0dXJuIGFycmF5LmZpbHRlcihpdGVtID0+ICFjb250YWlucyhleGNsdWRlZEl0ZW1zLCBpdGVtKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmlvbjxUPihhcnJheTogVFtdLCBvdGhlcjogVFtdKSB7XG4gIHJldHVybiBhcnJheS5jb25jYXQod2l0aG91dChvdGhlciwgYXJyYXkpKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYW55IGl0ZW0gcmV0dXJucyB0cnVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc29tZTxUPihhcnI6IFRbXSwgZjogKGQ6IFQsIGs/OiBhbnksIGk/OiBhbnkpID0+IGJvb2xlYW4pIHtcbiAgbGV0IGkgPSAwO1xuICBmb3IgKGxldCBrID0gMDsgazxhcnIubGVuZ3RoOyBrKyspIHtcbiAgICBpZiAoZihhcnJba10sIGssIGkrKykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGFsbCBpdGVtcyByZXR1cm4gdHJ1ZS5cbiAqL1xuIGV4cG9ydCBmdW5jdGlvbiBldmVyeTxUPihhcnI6IFRbXSwgZjogKGQ6IFQsIGs/OiBhbnksIGk/OiBhbnkpID0+IGJvb2xlYW4pIHtcbiAgbGV0IGkgPSAwO1xuICBmb3IgKGxldCBrID0gMDsgazxhcnIubGVuZ3RoOyBrKyspIHtcbiAgICBpZiAoIWYoYXJyW2tdLCBrLCBpKyspKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbihhcnJheXM6IGFueVtdKSB7XG4gIHJldHVybiBbXS5jb25jYXQuYXBwbHkoW10sIGFycmF5cyk7XG59XG5cbi8qKlxuICogcmVjdXJzaXZlbHkgbWVyZ2VzIHNyYyBpbnRvIGRlc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRGVlcDxUPihkZXN0OiBULCAuLi5zcmM6IFBhcnRpYWw8VD5bXSk6IFQge1xuICBmb3IgKGNvbnN0IHMgb2Ygc3JjKSB7XG4gICAgZGVzdCA9IGRlZXBNZXJnZV8oZGVzdCwgcyk7XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59XG5cbi8vIHJlY3Vyc2l2ZWx5IG1lcmdlcyBzcmMgaW50byBkZXN0XG5mdW5jdGlvbiBkZWVwTWVyZ2VfKGRlc3Q6IGFueSwgc3JjOiBhbnkpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgZm9yIChjb25zdCBwIGluIHNyYykge1xuICAgIGlmICghc3JjLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNyY1twXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzcmNbcF0gIT09ICdvYmplY3QnIHx8IGlzQXJyYXkoc3JjW3BdKSB8fCBzcmNbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBzcmNbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdFtwXSAhPT0gJ29iamVjdCcgfHwgZGVzdFtwXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IG1lcmdlRGVlcChpc0FycmF5KHNyY1twXS5jb25zdHJ1Y3RvcikgPyBbXSA6IHt9LCBzcmNbcF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXJnZURlZXAoZGVzdFtwXSwgc3JjW3BdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWU8VD4odmFsdWVzOiBUW10sIGY6IChpdGVtOiBUKSA9PiBzdHJpbmcgfCBudW1iZXIpOiBUW10ge1xuICBjb25zdCByZXN1bHRzOiBhbnlbXSA9IFtdO1xuICBjb25zdCB1ID0ge307XG4gIGxldCB2OiBzdHJpbmcgfCBudW1iZXI7XG4gIGZvciAoY29uc3QgdmFsIG9mIHZhbHVlcykge1xuICAgIHYgPSBmKHZhbCk7XG4gICAgaWYgKHYgaW4gdSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHVbdl0gPSAxO1xuICAgIHJlc3VsdHMucHVzaCh2YWwpO1xuICB9XG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERpY3Q8VD4ge1xuICBba2V5OiBzdHJpbmddOiBUO1xufVxuXG5leHBvcnQgdHlwZSBTdHJpbmdTZXQgPSBEaWN0PHRydWU+O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHdvIGRpY3Rpb25hcmllcyBkaXNhZ3JlZS4gQXBwbGllcyBvbmx5IHRvIGRlZmluZWQgdmFsdWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlmZmVyPFQ+KGRpY3Q6IERpY3Q8VD4sIG90aGVyOiBEaWN0PFQ+KSB7XG4gIGZvciAoY29uc3Qga2V5IGluIGRpY3QpIHtcbiAgICBpZiAoZGljdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBpZiAob3RoZXJba2V5XSAmJiBkaWN0W2tleV0gJiYgb3RoZXJba2V5XSAhPT0gZGljdFtrZXldKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNJbnRlcnNlY3Rpb24oYTogU3RyaW5nU2V0LCBiOiBTdHJpbmdTZXQpIHtcbiAgZm9yIChjb25zdCBrZXkgaW4gYSkge1xuICAgIGlmIChrZXkgaW4gYikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyhudW06IHN0cmluZyB8IG51bWJlcikge1xuICByZXR1cm4gIWlzTmFOKG51bSBhcyBhbnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlmZmVyQXJyYXk8VD4oYXJyYXk6IFRbXSwgb3RoZXI6IFRbXSkge1xuICBpZiAoYXJyYXkubGVuZ3RoICE9PSBvdGhlci5sZW5ndGgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFycmF5LnNvcnQoKTtcbiAgb3RoZXIuc29ydCgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3RoZXJbaV0gIT09IGFycmF5W2ldKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFRoaXMgaXMgYSBzdHJpY3RlciB2ZXJzaW9uIG9mIE9iamVjdC5rZXlzIGJ1dCB3aXRoIGJldHRlciB0eXBlcy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9wdWxsLzEyMjUzI2lzc3VlY29tbWVudC0yNjMxMzIyMDhcbmV4cG9ydCBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMgYXMgPFQ+KG86IFQpID0+IChrZXlvZiBUKVtdO1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsczxUPih4OiB7W2tleTogc3RyaW5nXTogVH0pOiBUW10ge1xuICBjb25zdCBfdmFsczogVFtdID0gW107XG4gIGZvciAoY29uc3QgayBpbiB4KSB7XG4gICAgaWYgKHguaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgIF92YWxzLnB1c2goeFtrXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBfdmFscztcbn1cblxuLy8gVXNpbmcgbWFwcGVkIHR5cGUgdG8gZGVjbGFyZSBhIGNvbGxlY3Qgb2YgZmxhZ3MgZm9yIGEgc3RyaW5nIGxpdGVyYWwgdHlwZSBTXG4vLyBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9hZHZhbmNlZC10eXBlcy5odG1sI21hcHBlZC10eXBlc1xuZXhwb3J0IHR5cGUgRmxhZzxTIGV4dGVuZHMgc3RyaW5nPiA9IHtcbiAgW0sgaW4gU106IDFcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGFnS2V5czxTIGV4dGVuZHMgc3RyaW5nPihmOiBGbGFnPFM+KTogU1tdIHtcbiAgcmV0dXJuIGtleXMoZikgYXMgU1tdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHVwbGljYXRlPFQ+KG9iajogVCk6IFQge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm9vbGVhbihiOiBhbnkpOiBiIGlzIGJvb2xlYW4ge1xuICByZXR1cm4gYiA9PT0gdHJ1ZSB8fCBiID09PSBmYWxzZTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgc3RyaW5nIGludG8gYSB2YWxpZCB2YXJpYWJsZSBuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YXJOYW1lKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFJlcGxhY2Ugbm9uLWFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIChhbnl0aGluZyBiZXNpZGVzIGEtekEtWjAtOV8pIHdpdGggX1xuICBjb25zdCBhbHBoYW51bWVyaWNTID0gcy5yZXBsYWNlKC9cXFcvZywgJ18nKTtcblxuICAvLyBBZGQgXyBpZiB0aGUgc3RyaW5nIGhhcyBsZWFkaW5nIG51bWJlcnMuXG4gIHJldHVybiAocy5tYXRjaCgvXlxcZCsvKSA/ICdfJyA6ICcnKSArIGFscGhhbnVtZXJpY1M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dpY2FsRXhwcjxUPihvcDogTG9naWNhbE9wZXJhbmQ8VD4sIGNiOiBGdW5jdGlvbik6IHN0cmluZyB7XG4gIGlmIChpc0xvZ2ljYWxOb3Qob3ApKSB7XG4gICAgcmV0dXJuICchKCcgKyBsb2dpY2FsRXhwcihvcC5ub3QsIGNiKSArICcpJztcbiAgfSBlbHNlIGlmIChpc0xvZ2ljYWxBbmQob3ApKSB7XG4gICAgcmV0dXJuICcoJyArIG9wLmFuZC5tYXAoKGFuZDogTG9naWNhbE9wZXJhbmQ8VD4pID0+IGxvZ2ljYWxFeHByKGFuZCwgY2IpKS5qb2luKCcpICYmICgnKSArICcpJztcbiAgfSBlbHNlIGlmIChpc0xvZ2ljYWxPcihvcCkpIHtcbiAgICByZXR1cm4gJygnICsgb3Aub3IubWFwKChvcjogTG9naWNhbE9wZXJhbmQ8VD4pID0+IGxvZ2ljYWxFeHByKG9yLCBjYikpLmpvaW4oJykgfHwgKCcpICsgJyknO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjYihvcCk7XG4gIH1cbn1cblxuLy8gT21pdCBmcm9tIGh0dHA6Ly9pZGVhc2ludG9zb2Z0d2FyZS5jb20vdHlwZXNjcmlwdC1hZHZhbmNlZC10cmlja3MvXG5leHBvcnQgdHlwZSBEaWZmPFQgZXh0ZW5kcyBzdHJpbmcsIFUgZXh0ZW5kcyBzdHJpbmc+ID0gKHtbUCBpbiBUXTogUCB9ICYge1tQIGluIFVdOiBuZXZlciB9ICYgeyBbeDogc3RyaW5nXTogbmV2ZXIgfSlbVF07XG5leHBvcnQgdHlwZSBPbWl0PFQsIEsgZXh0ZW5kcyBrZXlvZiBUPiA9IHtbUCBpbiBEaWZmPGtleW9mIFQsIEs+XTogVFtQXX07XG5cbi8qKlxuICogRGVsZXRlIG5lc3RlZCBwcm9wZXJ0eSBvZiBhbiBvYmplY3QsIGFuZCBkZWxldGUgdGhlIGFuY2VzdG9ycyBvZiB0aGUgcHJvcGVydHkgaWYgdGhleSBiZWNvbWUgZW1wdHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVOZXN0ZWRQcm9wZXJ0eShvYmo6IGFueSwgb3JkZXJlZFByb3BzOiBzdHJpbmdbXSkge1xuICBpZiAob3JkZXJlZFByb3BzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGNvbnN0IHByb3AgPSBvcmRlcmVkUHJvcHMuc2hpZnQoKTtcbiAgaWYgKGRlbGV0ZU5lc3RlZFByb3BlcnR5KG9ialtwcm9wXSwgb3JkZXJlZFByb3BzKSkge1xuICAgIGRlbGV0ZSBvYmpbcHJvcF07XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGVjYXNlKHM6IHN0cmluZykge1xuICByZXR1cm4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc3Vic3RyKDEpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgcGF0aCB0byBhbiBhY2Nlc3MgcGF0aCB3aXRoIGRhdHVtLlxuICogQHBhcmFtIHBhdGggVGhlIGZpZWxkIG5hbWUuXG4gKiBAcGFyYW0gZGF0dW0gVGhlIHN0cmluZyB0byB1c2UgZm9yIGBkYXR1bWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhY2Nlc3NQYXRoV2l0aERhdHVtKHBhdGg6IHN0cmluZywgZGF0dW09J2RhdHVtJykge1xuICBjb25zdCBwaWVjZXMgPSBzcGxpdEFjY2Vzc1BhdGgocGF0aCk7XG4gIGNvbnN0IHByZWZpeGVzID0gW107XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IHBpZWNlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHByZWZpeCA9IGBbJHtwaWVjZXMuc2xpY2UoMCxpKS5tYXAoc3RyaW5nVmFsdWUpLmpvaW4oJ11bJyl9XWA7XG4gICAgcHJlZml4ZXMucHVzaChgJHtkYXR1bX0ke3ByZWZpeH1gKTtcbiAgfVxuICByZXR1cm4gcHJlZml4ZXMuam9pbignICYmICcpO1xufVxuXG4vKipcbiAqIFJldHVybiBhY2Nlc3Mgd2l0aCBkYXR1bSB0byB0aGUgZmFsdHRlbmVkIGZpZWxkLlxuICogQHBhcmFtIHBhdGggVGhlIGZpZWxkIG5hbWUuXG4gKiBAcGFyYW0gZGF0dW0gVGhlIHN0cmluZyB0byB1c2UgZm9yIGBkYXR1bWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0QWNjZXNzV2l0aERhdHVtKHBhdGg6IHN0cmluZywgZGF0dW09J2RhdHVtJykge1xuICByZXR1cm4gYCR7ZGF0dW19WyR7c3RyaW5nVmFsdWUoc3BsaXRBY2Nlc3NQYXRoKHBhdGgpLmpvaW4oJy4nKSl9XWA7XG59XG5cbi8qKlxuICogUmVwbGFjZXMgcGF0aCBhY2Nlc3NlcyB3aXRoIGFjY2VzcyB0byBub24tbmVzdGVkIGZpZWxkLlxuICogRm9yIGV4YW1wbGUsIGBmb29bXCJiYXJcIl0uYmF6YCBiZWNvbWVzIGBmb29cXFxcLmJhclxcXFwuYmF6YC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VQYXRoSW5GaWVsZChwYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke3NwbGl0QWNjZXNzUGF0aChwYXRoKS5tYXAocCA9PiBwLnJlcGxhY2UoJy4nLCAnXFxcXC4nKSkuam9pbignXFxcXC4nKX1gO1xufVxuXG4vKipcbiAqIFJlbW92ZSBwYXRoIGFjY2Vzc2VzIHdpdGggYWNjZXNzIGZyb20gZmllbGQuXG4gKiBGb3IgZXhhbXBsZSwgYGZvb1tcImJhclwiXS5iYXpgIGJlY29tZXMgYGZvby5iYXIuYmF6YC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVBhdGhGcm9tRmllbGQocGF0aDogc3RyaW5nKSB7XG4gIHJldHVybiBgJHtzcGxpdEFjY2Vzc1BhdGgocGF0aCkuam9pbignLicpfWA7XG59XG5cbi8qKlxuICogQ291bnQgdGhlIGRlcHRoIG9mIHRoZSBwYXRoLiBSZXR1cm5zIDEgZm9yIGZpZWxkcyB0aGF0IGFyZSBub3QgbmVzdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWNjZXNzUGF0aERlcHRoKHBhdGg6IHN0cmluZykge1xuICBpZiAoIXBhdGgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gc3BsaXRBY2Nlc3NQYXRoKHBhdGgpLmxlbmd0aDtcbn1cbiJdfQ==