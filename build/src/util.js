import { default as clone_ } from 'clone';
import deepEqual_ from 'fast-deep-equal';
import stableStringify from 'fast-json-stable-stringify';
import { hasOwnProperty, isNumber, isString, splitAccessPath, stringValue, writeConfig } from 'vega-util';
import { isLogicalAnd, isLogicalNot, isLogicalOr } from './logical';
export const deepEqual = deepEqual_;
export const duplicate = clone_;
export function never(message) {
    throw new Error(message);
}
/**
 * Creates an object composed of the picked object properties.
 *
 * var object = {'a': 1, 'b': '2', 'c': 3};
 * pick(object, ['a', 'c']);
 * // → {'a': 1, 'c': 3}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function pick(obj, props) {
    const copy = {};
    for (const prop of props) {
        if (hasOwnProperty(obj, prop)) {
            copy[prop] = obj[prop];
        }
    }
    return copy;
}
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function omit(obj, props) {
    const copy = { ...obj };
    for (const prop of props) {
        delete copy[prop];
    }
    return copy;
}
/**
 * Monkey patch Set so that `stringify` produces a string representation of sets.
 */
Set.prototype['toJSON'] = function () {
    return `Set(${[...this].map(x => stableStringify(x)).join(',')})`;
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
export function isNullOrFalse(x) {
    return x === false || x === null;
}
export function contains(array, item) {
    return array.includes(item);
}
/**
 * Returns true if any item returns true.
 */
export function some(arr, f) {
    let i = 0;
    for (const [k, a] of arr.entries()) {
        if (f(a, k, i++)) {
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
    for (const [k, a] of arr.entries()) {
        if (!f(a, k, i++)) {
            return false;
        }
    }
    return true;
}
/**
 * recursively merges src into dest
 */
export function mergeDeep(dest, ...src) {
    for (const s of src) {
        deepMerge_(dest, s ?? {});
    }
    return dest;
}
function deepMerge_(dest, src) {
    for (const property of keys(src)) {
        writeConfig(dest, property, src[property], true);
    }
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
        for (const y of computedPrefixes) {
            prefixes.add(y);
        }
    }
    return prefixes;
}
/**
 * Returns true if a and b have an intersection. Also return true if a or b are undefined
 * since this means we don't know what fields a node produces or depends on.
 */
export function fieldIntersection(a, b) {
    if (a === undefined || b === undefined) {
        return true;
    }
    return hasIntersection(prefixGenerator(a), prefixGenerator(b));
}
// eslint-disable-next-line @typescript-eslint/ban-types
export function isEmpty(obj) {
    return keys(obj).length === 0;
}
// This is a stricter version of Object.keys but with better types. See https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
export const keys = Object.keys;
export const vals = Object.values;
export const entries = Object.entries;
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
        return `!(${logicalExpr(op.not, cb)})`;
    }
    else if (isLogicalAnd(op)) {
        return `(${op.and.map((and) => logicalExpr(and, cb)).join(') && (')})`;
    }
    else if (isLogicalOr(op)) {
        return `(${op.or.map((or) => logicalExpr(or, cb)).join(') || (')})`;
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
    const prop = orderedProps.shift(); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    if (prop in obj && deleteNestedProperty(obj[prop], orderedProps)) {
        delete obj[prop];
    }
    return isEmpty(obj);
}
export function titleCase(s) {
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
        const prefix = `[${pieces.slice(0, i).map(stringValue).join('][')}]`;
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
function escapePathAccess(string) {
    return string.replace(/(\[|\]|\.|'|")/g, '\\$1');
}
/**
 * Replaces path accesses with access to non-nested field.
 * For example, `foo["bar"].baz` becomes `foo\\.bar\\.baz`.
 */
export function replacePathInField(path) {
    return `${splitAccessPath(path).map(escapePathAccess).join('\\.')}`;
}
/**
 * Replace all occurrences of a string with another string.
 *
 * @param string the string to replace in
 * @param find the string to replace
 * @param replacement the replacement
 */
export function replaceAll(string, find, replacement) {
    return string.replace(new RegExp(find.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replacement);
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
export function internalField(name) {
    return isInternalField(name) ? name : `__${name}`;
}
export function isInternalField(name) {
    return name.startsWith('__');
}
/**
 * Normalize angle to be within [0,360).
 */
export function normalizeAngle(angle) {
    if (angle === undefined) {
        return undefined;
    }
    return ((angle % 360) + 360) % 360;
}
/**
 * Returns whether the passed in value is a valid number.
 */
export function isNumeric(value) {
    if (isNumber(value)) {
        return true;
    }
    return !isNaN(value) && !isNaN(parseFloat(value));
}
//# sourceMappingURL=util.js.map