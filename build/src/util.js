import clone_ from 'clone';
import deepEqual_ from 'fast-deep-equal';
import stableStringify from 'fast-json-stable-stringify';
import { isArray, isNumber, isString, splitAccessPath, stringValue } from 'vega-util';
import { isLogicalAnd, isLogicalNot, isLogicalOr } from './logical';
export const deepEqual = deepEqual_;
export const duplicate = clone_;
/**
 * Make a regular expression that matches a whole word of the given string
 */
export function globalWholeWordRegExp(word) {
    // `\b` = word boundary
    // https://stackoverflow.com/questions/2232934/whole-word-match-in-javascript
    return new RegExp(`\\b${word}\\b`, 'g');
}
/**
 * Creates an object composed of the picked object properties.
 *
 * var object = {'a': 1, 'b': '2', 'c': 3};
 * pick(object, ['a', 'c']);
 * // → {'a': 1, 'c': 3}
 *
 */
export function pick(obj, props) {
    const copy = {};
    for (const prop of props) {
        if (obj.hasOwnProperty(prop)) {
            copy[prop] = obj[prop];
        }
    }
    return copy;
}
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
export function omit(obj, props) {
    const copy = Object.assign({}, obj);
    for (const prop of props) {
        delete copy[prop];
    }
    return copy;
}
/**
 * Monkey patch Set so that `stringify` produces a string representation of sets.
 */
Set.prototype['toJSON'] = function () {
    return `Set(${[...this].map(stableStringify).join(',')})`;
};
/**
 * Converts any object to a string representation that can be consumed by humans.
 */
export const stringify = stableStringify;
/**
 * Converts any object to a string of limited size, or a number.
 */
export function hash(a) {
    if (isNumber(a)) {
        return a;
    }
    const str = isString(a) ? a : stableStringify(a);
    // short strings can be used as hash directly, longer strings are hashed to reduce memory usage
    if (str.length < 250) {
        return str;
    }
    // from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        h = (h << 5) - h + char;
        h = h & h; // Convert to 32bit integer
    }
    return h;
}
export function contains(array, item) {
    return array.indexOf(item) > -1;
}
/** Returns the array without the elements in item */
export function without(array, excludedItems) {
    return array.filter(item => !contains(excludedItems, item));
}
export function union(array, other) {
    return array.concat(without(other, array));
}
/**
 * Returns true if any item returns true.
 */
export function some(arr, f) {
    let i = 0;
    for (let k = 0; k < arr.length; k++) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
/**
 * Returns true if all items return true.
 */
export function every(arr, f) {
    let i = 0;
    for (let k = 0; k < arr.length; k++) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
export function flatten(arrays) {
    return [].concat(...arrays);
}
export function fill(val, len) {
    const arr = new Array(len);
    for (let i = 0; i < len; ++i) {
        arr[i] = val;
    }
    return arr;
}
/**
 * recursively merges src into dest
 */
export function mergeDeep(dest, ...src) {
    for (const s of src) {
        dest = deepMerge_(dest, s);
    }
    return dest;
}
// recursively merges src into dest
function deepMerge_(dest, src) {
    if (typeof src !== 'object' || src === null) {
        return dest;
    }
    for (const p in src) {
        if (!src.hasOwnProperty(p)) {
            continue;
        }
        if (src[p] === undefined) {
            continue;
        }
        if (typeof src[p] !== 'object' || isArray(src[p]) || src[p] === null) {
            dest[p] = src[p];
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = mergeDeep(isArray(src[p].constructor) ? [] : {}, src[p]);
        }
        else {
            mergeDeep(dest[p], src[p]);
        }
    }
    return dest;
}
export function unique(values, f) {
    const results = [];
    const u = {};
    let v;
    for (const val of values) {
        v = f(val);
        if (v in u) {
            continue;
        }
        u[v] = 1;
        results.push(val);
    }
    return results;
}
/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
export function isEqual(dict, other) {
    const dictKeys = keys(dict);
    const otherKeys = keys(other);
    if (dictKeys.length !== otherKeys.length) {
        return false;
    }
    for (const key of dictKeys) {
        if (dict[key] !== other[key]) {
            return false;
        }
    }
    return true;
}
export function setEqual(a, b) {
    if (a.size !== b.size) {
        return false;
    }
    for (const e of a) {
        if (!b.has(e)) {
            return false;
        }
    }
    return true;
}
export function hasIntersection(a, b) {
    for (const key of a) {
        if (b.has(key)) {
            return true;
        }
    }
    return false;
}
export function prefixGenerator(a) {
    const prefixes = new Set();
    for (const x of a) {
        const splitField = splitAccessPath(x);
        // Wrap every element other than the first in `[]`
        const wrappedWithAccessors = splitField.map((y, i) => (i === 0 ? y : `[${y}]`));
        const computedPrefixes = wrappedWithAccessors.map((_, i) => wrappedWithAccessors.slice(0, i + 1).join(''));
        computedPrefixes.forEach(y => prefixes.add(y));
    }
    return prefixes;
}
export function fieldIntersection(a, b) {
    return hasIntersection(prefixGenerator(a), prefixGenerator(b));
}
export function isNumeric(num) {
    return !isNaN(num);
}
export function differArray(array, other) {
    if (array.length !== other.length) {
        return true;
    }
    array.sort();
    other.sort();
    for (let i = 0; i < array.length; i++) {
        if (other[i] !== array[i]) {
            return true;
        }
    }
    return false;
}
// This is a stricter version of Object.keys but with better types. See https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
export const keys = Object.keys;
export function vals(x) {
    const _vals = [];
    for (const k in x) {
        if (x.hasOwnProperty(k)) {
            _vals.push(x[k]);
        }
    }
    return _vals;
}
export function entries(x) {
    const _entries = [];
    for (const k in x) {
        if (x.hasOwnProperty(k)) {
            _entries.push({
                key: k,
                value: x[k]
            });
        }
    }
    return _entries;
}
export function flagKeys(f) {
    return keys(f);
}
export function isBoolean(b) {
    return b === true || b === false;
}
/**
 * Convert a string into a valid variable name
 */
export function varName(s) {
    // Replace non-alphanumeric characters (anything besides a-zA-Z0-9_) with _
    const alphanumericS = s.replace(/\W/g, '_');
    // Add _ if the string has leading numbers.
    return (s.match(/^\d+/) ? '_' : '') + alphanumericS;
}
export function logicalExpr(op, cb) {
    if (isLogicalNot(op)) {
        return '!(' + logicalExpr(op.not, cb) + ')';
    }
    else if (isLogicalAnd(op)) {
        return '(' + op.and.map((and) => logicalExpr(and, cb)).join(') && (') + ')';
    }
    else if (isLogicalOr(op)) {
        return '(' + op.or.map((or) => logicalExpr(or, cb)).join(') || (') + ')';
    }
    else {
        return cb(op);
    }
}
/**
 * Delete nested property of an object, and delete the ancestors of the property if they become empty.
 */
export function deleteNestedProperty(obj, orderedProps) {
    if (orderedProps.length === 0) {
        return true;
    }
    const prop = orderedProps.shift();
    if (deleteNestedProperty(obj[prop], orderedProps)) {
        delete obj[prop];
    }
    return keys(obj).length === 0;
}
export function titlecase(s) {
    return s.charAt(0).toUpperCase() + s.substr(1);
}
/**
 * Converts a path to an access path with datum.
 * @param path The field name.
 * @param datum The string to use for `datum`.
 */
export function accessPathWithDatum(path, datum = 'datum') {
    const pieces = splitAccessPath(path);
    const prefixes = [];
    for (let i = 1; i <= pieces.length; i++) {
        const prefix = `[${pieces
            .slice(0, i)
            .map(stringValue)
            .join('][')}]`;
        prefixes.push(`${datum}${prefix}`);
    }
    return prefixes.join(' && ');
}
/**
 * Return access with datum to the flattened field.
 *
 * @param path The field name.
 * @param datum The string to use for `datum`.
 */
export function flatAccessWithDatum(path, datum = 'datum') {
    return `${datum}[${stringValue(splitAccessPath(path).join('.'))}]`;
}
/**
 * Replaces path accesses with access to non-nested field.
 * For example, `foo["bar"].baz` becomes `foo\\.bar\\.baz`.
 */
export function replacePathInField(path) {
    return `${splitAccessPath(path)
        .map(p => p.replace('.', '\\.'))
        .join('\\.')}`;
}
/**
 * Remove path accesses with access from field.
 * For example, `foo["bar"].baz` becomes `foo.bar.baz`.
 */
export function removePathFromField(path) {
    return `${splitAccessPath(path).join('.')}`;
}
/**
 * Count the depth of the path. Returns 1 for fields that are not nested.
 */
export function accessPathDepth(path) {
    if (!path) {
        return 0;
    }
    return splitAccessPath(path).length;
}
/**
 * This is a replacement for chained || for numeric properties or properties that respect null so that 0 will be included.
 */
export function getFirstDefined(...args) {
    for (const arg of args) {
        if (arg !== undefined) {
            return arg;
        }
    }
    return undefined;
}
// variable used to generate id
let idCounter = 42;
/**
 * Returns a new random id every time it gets called.
 *
 * Has side effect!
 */
export function uniqueId(prefix) {
    const id = ++idCounter;
    return prefix ? String(prefix) + id : id;
}
/**
 * Resets the id counter used in uniqueId. This can be useful for testing.
 */
export function resetIdCounter() {
    idCounter = 42;
}
//# sourceMappingURL=util.js.map