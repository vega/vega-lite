"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var json_stable_stringify_1 = tslib_1.__importDefault(require("json-stable-stringify"));
var vega_util_1 = require("vega-util");
var logical_1 = require("./logical");
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
exports.stringify = json_stable_stringify_1.default;
/**
 * Converts any object into a string of limited size, or a number.
 */
function hash(a) {
    if (vega_util_1.isNumber(a)) {
        return a;
    }
    var str = vega_util_1.isString(a) ? a : json_stable_stringify_1.default(a);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdGQUFvRDtBQUNwRCx1Q0FBb0Y7QUFDcEYscUNBQWtGO0FBRWxGOzs7Ozs7Ozs7R0FTRztBQUNILGNBQXFCLEdBQVcsRUFBRSxLQUFlO0lBQy9DLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNoQixLQUFtQixVQUFLLEVBQUwsZUFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSyxFQUFFO1FBQXJCLElBQU0sSUFBSSxjQUFBO1FBQ2IsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEI7S0FDRjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVJELG9CQVFDO0FBRUQ7OztHQUdHO0FBQ0gsY0FBcUIsR0FBVyxFQUFFLEtBQWU7SUFDL0MsSUFBTSxJQUFJLHdCQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLEtBQW1CLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLLEVBQUU7UUFBckIsSUFBTSxJQUFJLGNBQUE7UUFDYixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQU5ELG9CQU1DO0FBRUQ7O0dBRUc7QUFDVSxRQUFBLFNBQVMsR0FBRywrQkFBZSxDQUFDO0FBRXpDOztHQUVHO0FBQ0gsY0FBcUIsQ0FBTTtJQUN6QixJQUFJLG9CQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDZixPQUFPLENBQUMsQ0FBQztLQUNWO0lBRUQsSUFBTSxHQUFHLEdBQUcsb0JBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywrQkFBZSxDQUFDLENBQUMs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Q0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFSRCxrREFRQztBQUVEOzs7O0dBSUc7QUFDSCw2QkFBb0MsSUFBWSxFQUFFLEtBQWE7SUFBYixzQkFBQSxFQUFBLGVBQWE7SUFDN0QsT0FBVSxLQUFLLFNBQUksdUJBQVcsQ0FBQywyQkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFHLENBQUM7QUFDckUsQ0FBQztBQUZELGtEQUVDO0FBRUQ7OztHQUdHO0FBQ0gsNEJBQW1DLElBQVk7SUFDN0MsT0FBTyxLQUFHLDJCQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFHLENBQUM7QUFDaEYsQ0FBQztBQUZELGdEQUVDO0FBRUQ7OztHQUdHO0FBQ0gsNkJBQW9DLElBQVk7SUFDOUMsT0FBTyxLQUFHLDJCQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRyxDQUFDO0FBQzlDLENBQUM7QUFGRCxrREFFQztBQUVEOztHQUVHO0FBQ0gseUJBQWdDLElBQVk7SUFDMUMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNULE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxPQUFPLDJCQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3RDLENBQUM7QUFMRCwwQ0FLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzdGFibGVTdHJpbmdpZnkgZnJvbSAnanNvbi1zdGFibGUtc3RyaW5naWZ5JztcbmltcG9ydCB7aXNBcnJheSwgaXNOdW1iZXIsIGlzU3RyaW5nLCBzcGxpdEFjY2Vzc1BhdGgsIHN0cmluZ1ZhbHVlfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtpc0xvZ2ljYWxBbmQsIGlzTG9naWNhbE5vdCwgaXNMb2dpY2FsT3IsIExvZ2ljYWxPcGVyYW5kfSBmcm9tICcuL2xvZ2ljYWwnO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBwaWNrZWQgb2JqZWN0IHByb3BlcnRpZXMuXG4gKlxuICogRXhhbXBsZTogIChmcm9tIGxvZGFzaClcbiAqXG4gKiB2YXIgb2JqZWN0ID0geydhJzogMSwgJ2InOiAnMicsICdjJzogM307XG4gKiBwaWNrKG9iamVjdCwgWydhJywgJ2MnXSk7XG4gKiAvLyDihpIgeydhJzogMSwgJ2MnOiAzfVxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2sob2JqOiBvYmplY3QsIHByb3BzOiBzdHJpbmdbXSkge1xuICBjb25zdCBjb3B5ID0ge307XG4gIGZvciAoY29uc3QgcHJvcCBvZiBwcm9wcykge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgIGNvcHlbcHJvcF0gPSBvYmpbcHJvcF07XG4gICAgfVxuICB9XG4gIHJldHVybiBjb3B5O1xufVxuXG4vKipcbiAqIFRoZSBvcHBvc2l0ZSBvZiBfLnBpY2s7IHRoaXMgbWV0aG9kIGNyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBvd25cbiAqIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydGllcyBvZiBvYmplY3QgdGhhdCBhcmUgbm90IG9taXR0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbWl0KG9iajogb2JqZWN0LCBwcm9wczogc3RyaW5nW10pIHtcbiAgY29uc3QgY29weSA9IHsuLi5vYmp9O1xuICBmb3IgKGNvbnN0IHByb3Agb2YgcHJvcHMpIHtcbiAgICBkZWxldGUgY29weVtwcm9wXTtcbiAgfVxuICByZXR1cm4gY29weTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbnkgb2JqZWN0IGludG8gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gdGhhdCBjYW4gYmUgY29uc3VtZWQgYnkgaHVtYW5zLlxuICovXG5leHBvcnQgY29uc3Qgc3RyaW5naWZ5ID0gc3RhYmxlU3RyaW5naWZ5O1xuXG4vKipcbiAqIENvbnZlcnRzIGFueSBvYmplY3QgaW50byBhIHN0cmluZyBvZiBsaW1pdGVkIHNpemUsIG9yIGEgbnVtYmVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzaChhOiBhbnkpIHtcbiAgaWYgKGlzTnVtYmVyKGEpKSB7XG4gICAgcmV0dXJuIGE7XG4gIH1cblxuICBjb25zdCBzdHIgPSBpc1N0cmluZyhhKSA/IGEgOiBzdGFibGVTdHJpbmdpZnkoYSk7XG5cbiAgLy8gc2hvcnQgc3RyaW5ncyBjYW4gYmUgdXNlZCBhcyBoYXNoIGRpcmVjdGx5LCBsb25nZXIgc3RyaW5ncyBhcmUgaGFzaGVkIHRvIHJlZHVjZSBtZW1vcnkgdXNhZ2VcbiAgaWYgKHN0ci5sZW5ndGggPCAxMDApIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgLy8gZnJvbSBodHRwOi8vd2VyeGx0ZC5jb20vd3AvMjAxMC8wNS8xMy9qYXZhc2NyaXB0LWltcGxlbWVudGF0aW9uLW9mLWphdmFzLXN0cmluZy1oYXNoY29kZS1tZXRob2QvXG4gIGxldCBoID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGFyID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgaCA9ICgoaDw8NSktaCkrY2hhcjtcbiAgICBoID0gaCAmIGg7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICB9XG4gIHJldHVybiBoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnM8VD4oYXJyYXk6IFRbXSwgaXRlbTogVCkge1xuICByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtKSA+IC0xO1xufVxuXG4vKiogUmV0dXJucyB0aGUgYXJyYXkgd2l0aG91dCB0aGUgZWxlbWVudHMgaW4gaXRlbSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhvdXQ8VD4oYXJyYXk6IFRbXSwgZXhjbHVkZWRJdGVtczogVFtdKSB7XG4gIHJldHVybiBhcnJheS5maWx0ZXIoaXRlbSA9PiAhY29udGFpbnMoZXhjbHVkZWRJdGVtcywgaXRlbSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5pb248VD4oYXJyYXk6IFRbXSwgb3RoZXI6IFRbXSkge1xuICByZXR1cm4gYXJyYXkuY29uY2F0KHdpdGhvdXQob3RoZXIsIGFycmF5KSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGFueSBpdGVtIHJldHVybnMgdHJ1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvbWU8VD4oYXJyOiBUW10sIGY6IChkOiBULCBrPzogYW55LCBpPzogYW55KSA9PiBib29sZWFuKSB7XG4gIGxldCBpID0gMDtcbiAgZm9yIChsZXQgayA9IDA7IGs8YXJyLmxlbmd0aDsgaysrKSB7XG4gICAgaWYgKGYoYXJyW2tdLCBrLCBpKyspKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBhbGwgaXRlbXMgcmV0dXJuIHRydWUuXG4gKi9cbiBleHBvcnQgZnVuY3Rpb24gZXZlcnk8VD4oYXJyOiBUW10sIGY6IChkOiBULCBrPzogYW55LCBpPzogYW55KSA9PiBib29sZWFuKSB7XG4gIGxldCBpID0gMDtcbiAgZm9yIChsZXQgayA9IDA7IGs8YXJyLmxlbmd0aDsgaysrKSB7XG4gICAgaWYgKCFmKGFycltrXSwgaywgaSsrKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXlzOiBhbnlbXSkge1xuICByZXR1cm4gW10uY29uY2F0LmFwcGx5KFtdLCBhcnJheXMpO1xufVxuXG4vKipcbiAqIHJlY3Vyc2l2ZWx5IG1lcmdlcyBzcmMgaW50byBkZXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlZXA8VD4oZGVzdDogVCwgLi4uc3JjOiBQYXJ0aWFsPFQ+W10pOiBUIHtcbiAgZm9yIChjb25zdCBzIG9mIHNyYykge1xuICAgIGRlc3QgPSBkZWVwTWVyZ2VfKGRlc3QsIHMpO1xuICB9XG4gIHJldHVybiBkZXN0O1xufVxuXG4vLyByZWN1cnNpdmVseSBtZXJnZXMgc3JjIGludG8gZGVzdFxuZnVuY3Rpb24gZGVlcE1lcmdlXyhkZXN0OiBhbnksIHNyYzogYW55KSB7XG4gIGlmICh0eXBlb2Ygc3JjICE9PSAnb2JqZWN0JyB8fCBzcmMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZGVzdDtcbiAgfVxuXG4gIGZvciAoY29uc3QgcCBpbiBzcmMpIHtcbiAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzcmNbcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc3JjW3BdICE9PSAnb2JqZWN0JyB8fCBpc0FycmF5KHNyY1twXSkgfHwgc3JjW3BdID09PSBudWxsKSB7XG4gICAgICBkZXN0W3BdID0gc3JjW3BdO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlc3RbcF0gIT09ICdvYmplY3QnIHx8IGRlc3RbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBtZXJnZURlZXAoaXNBcnJheShzcmNbcF0uY29uc3RydWN0b3IpID8gW10gOiB7fSwgc3JjW3BdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2VEZWVwKGRlc3RbcF0sIHNyY1twXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5pcXVlPFQ+KHZhbHVlczogVFtdLCBmOiAoaXRlbTogVCkgPT4gc3RyaW5nIHwgbnVtYmVyKTogVFtdIHtcbiAgY29uc3QgcmVzdWx0czogYW55W10gPSBbXTtcbiAgY29uc3QgdSA9IHt9O1xuICBsZXQgdjogc3RyaW5nIHwgbnVtYmVyO1xuICBmb3IgKGNvbnN0IHZhbCBvZiB2YWx1ZXMpIHtcbiAgICB2ID0gZih2YWwpO1xuICAgIGlmICh2IGluIHUpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB1W3ZdID0gMTtcbiAgICByZXN1bHRzLnB1c2godmFsKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEaWN0PFQ+IHtcbiAgW2tleTogc3RyaW5nXTogVDtcbn1cblxuZXhwb3J0IHR5cGUgU3RyaW5nU2V0ID0gRGljdDx0cnVlPjtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHR3byBkaWN0aW9uYXJpZXMgZGlzYWdyZWUuIEFwcGxpZXMgb25seSB0byBkZWZpbmVkIHZhbHVlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpZmZlcjxUPihkaWN0OiBEaWN0PFQ+LCBvdGhlcjogRGljdDxUPikge1xuICBmb3IgKGNvbnN0IGtleSBpbiBkaWN0KSB7XG4gICAgaWYgKGRpY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgaWYgKG90aGVyW2tleV0gJiYgZGljdFtrZXldICYmIG90aGVyW2tleV0gIT09IGRpY3Rba2V5XSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzSW50ZXJzZWN0aW9uKGE6IFN0cmluZ1NldCwgYjogU3RyaW5nU2V0KSB7XG4gIGZvciAoY29uc3Qga2V5IGluIGEpIHtcbiAgICBpZiAoa2V5IGluIGIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bWVyaWMobnVtOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgcmV0dXJuICFpc05hTihudW0gYXMgYW55KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZlckFycmF5PFQ+KGFycmF5OiBUW10sIG90aGVyOiBUW10pIHtcbiAgaWYgKGFycmF5Lmxlbmd0aCAhPT0gb3RoZXIubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhcnJheS5zb3J0KCk7XG4gIG90aGVyLnNvcnQoKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG90aGVyW2ldICE9PSBhcnJheVtpXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBUaGlzIGlzIGEgc3RyaWN0ZXIgdmVyc2lvbiBvZiBPYmplY3Qua2V5cyBidXQgd2l0aCBiZXR0ZXIgdHlwZXMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvcHVsbC8xMjI1MyNpc3N1ZWNvbW1lbnQtMjYzMTMyMjA4XG5leHBvcnQgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzIGFzIDxUPihvOiBUKSA9PiAoRXh0cmFjdDxrZXlvZiBULCBzdHJpbmc+KVtdO1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsczxUPih4OiB7W2tleTogc3RyaW5nXTogVH0pOiBUW10ge1xuICBjb25zdCBfdmFsczogVFtdID0gW107XG4gIGZvciAoY29uc3QgayBpbiB4KSB7XG4gICAgaWYgKHguaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgIF92YWxzLnB1c2goeFtrXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBfdmFscztcbn1cblxuLy8gVXNpbmcgbWFwcGVkIHR5cGUgdG8gZGVjbGFyZSBhIGNvbGxlY3Qgb2YgZmxhZ3MgZm9yIGEgc3RyaW5nIGxpdGVyYWwgdHlwZSBTXG4vLyBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9hZHZhbmNlZC10eXBlcy5odG1sI21hcHBlZC10eXBlc1xuZXhwb3J0IHR5cGUgRmxhZzxTIGV4dGVuZHMgc3RyaW5nPiA9IHtcbiAgW0sgaW4gU106IDFcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGFnS2V5czxTIGV4dGVuZHMgc3RyaW5nPihmOiBGbGFnPFM+KTogU1tdIHtcbiAgcmV0dXJuIGtleXMoZikgYXMgU1tdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHVwbGljYXRlPFQ+KG9iajogVCk6IFQge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm9vbGVhbihiOiBhbnkpOiBiIGlzIGJvb2xlYW4ge1xuICByZXR1cm4gYiA9PT0gdHJ1ZSB8fCBiID09PSBmYWxzZTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgc3RyaW5nIGludG8gYSB2YWxpZCB2YXJpYWJsZSBuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YXJOYW1lKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFJlcGxhY2Ugbm9uLWFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIChhbnl0aGluZyBiZXNpZGVzIGEtekEtWjAtOV8pIHdpdGggX1xuICBjb25zdCBhbHBoYW51bWVyaWNTID0gcy5yZXBsYWNlKC9cXFcvZywgJ18nKTtcblxuICAvLyBBZGQgXyBpZiB0aGUgc3RyaW5nIGhhcyBsZWFkaW5nIG51bWJlcnMuXG4gIHJldHVybiAocy5tYXRjaCgvXlxcZCsvKSA/ICdfJyA6ICcnKSArIGFscGhhbnVtZXJpY1M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dpY2FsRXhwcjxUPihvcDogTG9naWNhbE9wZXJhbmQ8VD4sIGNiOiBGdW5jdGlvbik6IHN0cmluZyB7XG4gIGlmIChpc0xvZ2ljYWxOb3Qob3ApKSB7XG4gICAgcmV0dXJuICchKCcgKyBsb2dpY2FsRXhwcihvcC5ub3QsIGNiKSArICcpJztcbiAgfSBlbHNlIGlmIChpc0xvZ2ljYWxBbmQob3ApKSB7XG4gICAgcmV0dXJuICcoJyArIG9wLmFuZC5tYXAoKGFuZDogTG9naWNhbE9wZXJhbmQ8VD4pID0+IGxvZ2ljYWxFeHByKGFuZCwgY2IpKS5qb2luKCcpICYmICgnKSArICcpJztcbiAgfSBlbHNlIGlmIChpc0xvZ2ljYWxPcihvcCkpIHtcbiAgICByZXR1cm4gJygnICsgb3Aub3IubWFwKChvcjogTG9naWNhbE9wZXJhbmQ8VD4pID0+IGxvZ2ljYWxFeHByKG9yLCBjYikpLmpvaW4oJykgfHwgKCcpICsgJyknO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjYihvcCk7XG4gIH1cbn1cblxuLy8gT21pdCBmcm9tIGh0dHA6Ly9pZGVhc2ludG9zb2Z0d2FyZS5jb20vdHlwZXNjcmlwdC1hZHZhbmNlZC10cmlja3MvXG5leHBvcnQgdHlwZSBEaWZmPFQgZXh0ZW5kcyBzdHJpbmcgfCBudW1iZXIgfCBzeW1ib2wsIFUgZXh0ZW5kcyBzdHJpbmcgfCBudW1iZXIgfCBzeW1ib2w+ID0gKHtbUCBpbiBUXTogUCB9ICYge1tQIGluIFVdOiBuZXZlciB9ICYgeyBbeDogc3RyaW5nXTogbmV2ZXIgfSlbVF07XG5leHBvcnQgdHlwZSBPbWl0PFQsIEsgZXh0ZW5kcyBrZXlvZiBUPiA9IHtbUCBpbiBEaWZmPGtleW9mIFQsIEs+XTogVFtQXX07XG5cbi8qKlxuICogRGVsZXRlIG5lc3RlZCBwcm9wZXJ0eSBvZiBhbiBvYmplY3QsIGFuZCBkZWxldGUgdGhlIGFuY2VzdG9ycyBvZiB0aGUgcHJvcGVydHkgaWYgdGhleSBiZWNvbWUgZW1wdHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVOZXN0ZWRQcm9wZXJ0eShvYmo6IGFueSwgb3JkZXJlZFByb3BzOiBzdHJpbmdbXSkge1xuICBpZiAob3JkZXJlZFByb3BzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGNvbnN0IHByb3AgPSBvcmRlcmVkUHJvcHMuc2hpZnQoKTtcbiAgaWYgKGRlbGV0ZU5lc3RlZFByb3BlcnR5KG9ialtwcm9wXSwgb3JkZXJlZFByb3BzKSkge1xuICAgIGRlbGV0ZSBvYmpbcHJvcF07XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGVjYXNlKHM6IHN0cmluZykge1xuICByZXR1cm4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc3Vic3RyKDEpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgcGF0aCB0byBhbiBhY2Nlc3MgcGF0aCB3aXRoIGRhdHVtLlxuICogQHBhcmFtIHBhdGggVGhlIGZpZWxkIG5hbWUuXG4gKiBAcGFyYW0gZGF0dW0gVGhlIHN0cmluZyB0byB1c2UgZm9yIGBkYXR1bWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhY2Nlc3NQYXRoV2l0aERhdHVtKHBhdGg6IHN0cmluZywgZGF0dW09J2RhdHVtJykge1xuICBjb25zdCBwaWVjZXMgPSBzcGxpdEFjY2Vzc1BhdGgocGF0aCk7XG4gIGNvbnN0IHByZWZpeGVzID0gW107XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IHBpZWNlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHByZWZpeCA9IGBbJHtwaWVjZXMuc2xpY2UoMCxpKS5tYXAoc3RyaW5nVmFsdWUpLmpvaW4oJ11bJyl9XWA7XG4gICAgcHJlZml4ZXMucHVzaChgJHtkYXR1bX0ke3ByZWZpeH1gKTtcbiAgfVxuICByZXR1cm4gcHJlZml4ZXMuam9pbignICYmICcpO1xufVxuXG4vKipcbiAqIFJldHVybiBhY2Nlc3Mgd2l0aCBkYXR1bSB0byB0aGUgZmFsdHRlbmVkIGZpZWxkLlxuICogQHBhcmFtIHBhdGggVGhlIGZpZWxkIG5hbWUuXG4gKiBAcGFyYW0gZGF0dW0gVGhlIHN0cmluZyB0byB1c2UgZm9yIGBkYXR1bWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0QWNjZXNzV2l0aERhdHVtKHBhdGg6IHN0cmluZywgZGF0dW09J2RhdHVtJykge1xuICByZXR1cm4gYCR7ZGF0dW19WyR7c3RyaW5nVmFsdWUoc3BsaXRBY2Nlc3NQYXRoKHBhdGgpLmpvaW4oJy4nKSl9XWA7XG59XG5cbi8qKlxuICogUmVwbGFjZXMgcGF0aCBhY2Nlc3NlcyB3aXRoIGFjY2VzcyB0byBub24tbmVzdGVkIGZpZWxkLlxuICogRm9yIGV4YW1wbGUsIGBmb29bXCJiYXJcIl0uYmF6YCBiZWNvbWVzIGBmb29cXFxcLmJhclxcXFwuYmF6YC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VQYXRoSW5GaWVsZChwYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke3NwbGl0QWNjZXNzUGF0aChwYXRoKS5tYXAocCA9PiBwLnJlcGxhY2UoJy4nLCAnXFxcXC4nKSkuam9pbignXFxcXC4nKX1gO1xufVxuXG4vKipcbiAqIFJlbW92ZSBwYXRoIGFjY2Vzc2VzIHdpdGggYWNjZXNzIGZyb20gZmllbGQuXG4gKiBGb3IgZXhhbXBsZSwgYGZvb1tcImJhclwiXS5iYXpgIGJlY29tZXMgYGZvby5iYXIuYmF6YC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVBhdGhGcm9tRmllbGQocGF0aDogc3RyaW5nKSB7XG4gIHJldHVybiBgJHtzcGxpdEFjY2Vzc1BhdGgocGF0aCkuam9pbignLicpfWA7XG59XG5cbi8qKlxuICogQ291bnQgdGhlIGRlcHRoIG9mIHRoZSBwYXRoLiBSZXR1cm5zIDEgZm9yIGZpZWxkcyB0aGF0IGFyZSBub3QgbmVzdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWNjZXNzUGF0aERlcHRoKHBhdGg6IHN0cmluZykge1xuICBpZiAoIXBhdGgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gc3BsaXRBY2Nlc3NQYXRoKHBhdGgpLmxlbmd0aDtcbn1cbiJdfQ==