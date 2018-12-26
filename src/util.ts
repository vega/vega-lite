import clone_ from 'clone';
import deepEqual_ from 'fast-deep-equal';
import stableStringify from 'fast-json-stable-stringify';
import {isArray, isNumber, isString, splitAccessPath, stringValue} from 'vega-util';
import {isLogicalAnd, isLogicalNot, isLogicalOr, LogicalOperand} from './logical';

export const deepEqual = deepEqual_;
export const duplicate = clone_;

/**
 * Make a regular expression that matches a whole word of the given string
 */
export function globalWholeWordRegExp(word: string) {
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
export function pick<T extends object, K extends keyof T>(obj: T, props: K[]): Pick<T, K> {
  const copy: any = {};
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
export function omit<T extends object, K extends keyof T>(obj: T, props: K[]): Omit<T, K> {
  const copy = {...(obj as any)};
  for (const prop of props) {
    delete copy[prop];
  }
  return copy;
}

/**
 * Monkey patch Set so that `stringify` produces a string representation of sets.
 */
Set.prototype['toJSON'] = function() {
  return `Set(${[...this].map(stableStringify).join(',')})`;
};

/**
 * Converts any object to a string representation that can be consumed by humans.
 */
export const stringify = stableStringify;

/**
 * Converts any object to a string of limited size, or a number.
 */
export function hash(a: any): string | number {
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

export function contains<T>(array: T[], item: T) {
  return array.indexOf(item) > -1;
}

/** Returns the array without the elements in item */
export function without<T>(array: T[], excludedItems: T[]) {
  return array.filter(item => !contains(excludedItems, item));
}

export function union<T>(array: T[], other: T[]) {
  return array.concat(without(other, array));
}

/**
 * Returns true if any item returns true.
 */
export function some<T>(arr: T[], f: (d: T, k?: any, i?: any) => boolean) {
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
export function every<T>(arr: T[], f: (d: T, k?: any, i?: any) => boolean) {
  let i = 0;
  for (let k = 0; k < arr.length; k++) {
    if (!f(arr[k], k, i++)) {
      return false;
    }
  }
  return true;
}

export function flatten<T>(arrays: T[][]): T[] {
  return ([] as T[]).concat(...arrays);
}

export function fill<T>(val: T, len: number) {
  const arr = new Array<T>(len);
  for (let i = 0; i < len; ++i) {
    arr[i] = val;
  }
  return arr;
}

/**
 * Like TS Partial but applies recursively to all properties.
 */
export type DeepPartial<T> = {[P in keyof T]?: DeepPartial<T[P]>};

/**
 * recursively merges src into dest
 */
export function mergeDeep<T>(dest: T, ...src: DeepPartial<T>[]): T {
  for (const s of src) {
    dest = deepMerge_(dest, s);
  }
  return dest;
}

// recursively merges src into dest
function deepMerge_(dest: any, src: any) {
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
    } else if (typeof dest[p] !== 'object' || dest[p] === null) {
      dest[p] = mergeDeep(isArray(src[p].constructor) ? [] : {}, src[p]);
    } else {
      mergeDeep(dest[p], src[p]);
    }
  }
  return dest;
}

export function unique<T>(values: T[], f: (item: T) => string | number): T[] {
  const results: T[] = [];
  const u = {};
  let v: string | number;
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

export interface Dict<T> {
  [key: string]: T;
}

/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
export function isEqual<T>(dict: Dict<T>, other: Dict<T>) {
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

export function setEqual<T>(a: Set<T>, b: Set<T>) {
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

export function hasIntersection<T>(a: Set<T>, b: Set<T>) {
  for (const key of a) {
    if (b.has(key)) {
      return true;
    }
  }
  return false;
}

export function prefixGenerator(a: Set<string>): Set<string> {
  const prefixes = new Set<string>();
  for (const x of a) {
    const splitField = splitAccessPath(x);
    // Wrap every element other than the first in `[]`
    const wrappedWithAccessors = splitField.map((y, i) => (i === 0 ? y : `[${y}]`));
    const computedPrefixes = wrappedWithAccessors.map((_, i) => wrappedWithAccessors.slice(0, i + 1).join(''));
    computedPrefixes.forEach(y => prefixes.add(y));
  }
  return prefixes;
}

export function fieldIntersection(a: Set<string>, b: Set<string>): boolean {
  return hasIntersection(prefixGenerator(a), prefixGenerator(b));
}

export function isNumeric(num: string | number) {
  return !isNaN(num as any);
}

export function differArray<T>(array: T[], other: T[]) {
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
export const keys = Object.keys as <T>(o: T) => (Extract<keyof T, string>)[];

export function vals<T>(x: {[key: string]: T}): T[] {
  const _vals: T[] = [];
  for (const k in x) {
    if (x.hasOwnProperty(k)) {
      _vals.push(x[k]);
    }
  }
  return _vals;
}

export function entries<T>(x: {[key: string]: T}): {key: string; value: T}[] {
  const _entries: {key: string; value: T}[] = [];
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

// Using mapped type to declare a collect of flags for a string literal type S
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
export type Flag<S extends string> = {[K in S]: 1};

export function flagKeys<S extends string>(f: Flag<S>): S[] {
  return keys(f) as S[];
}

export function isBoolean(b: any): b is boolean {
  return b === true || b === false;
}

/**
 * Convert a string into a valid variable name
 */
export function varName(s: string): string {
  // Replace non-alphanumeric characters (anything besides a-zA-Z0-9_) with _
  const alphanumericS = s.replace(/\W/g, '_');

  // Add _ if the string has leading numbers.
  return (s.match(/^\d+/) ? '_' : '') + alphanumericS;
}

export function logicalExpr<T>(op: LogicalOperand<T>, cb: (...args: any[]) => string): string {
  if (isLogicalNot(op)) {
    return '!(' + logicalExpr(op.not, cb) + ')';
  } else if (isLogicalAnd(op)) {
    return '(' + op.and.map((and: LogicalOperand<T>) => logicalExpr(and, cb)).join(') && (') + ')';
  } else if (isLogicalOr(op)) {
    return '(' + op.or.map((or: LogicalOperand<T>) => logicalExpr(or, cb)).join(') || (') + ')';
  } else {
    return cb(op);
  }
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Delete nested property of an object, and delete the ancestors of the property if they become empty.
 */
export function deleteNestedProperty(obj: any, orderedProps: string[]) {
  if (orderedProps.length === 0) {
    return true;
  }
  const prop = orderedProps.shift();
  if (deleteNestedProperty(obj[prop], orderedProps)) {
    delete obj[prop];
  }
  return keys(obj).length === 0;
}

export function titlecase(s: string) {
  return s.charAt(0).toUpperCase() + s.substr(1);
}

/**
 * Converts a path to an access path with datum.
 * @param path The field name.
 * @param datum The string to use for `datum`.
 */
export function accessPathWithDatum(path: string, datum = 'datum') {
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
export function flatAccessWithDatum(path: string, datum: 'datum' | 'parent' = 'datum') {
  return `${datum}[${stringValue(splitAccessPath(path).join('.'))}]`;
}

/**
 * Replaces path accesses with access to non-nested field.
 * For example, `foo["bar"].baz` becomes `foo\\.bar\\.baz`.
 */
export function replacePathInField(path: string) {
  return `${splitAccessPath(path)
    .map(p => p.replace('.', '\\.'))
    .join('\\.')}`;
}

/**
 * Remove path accesses with access from field.
 * For example, `foo["bar"].baz` becomes `foo.bar.baz`.
 */
export function removePathFromField(path: string) {
  return `${splitAccessPath(path).join('.')}`;
}

/**
 * Count the depth of the path. Returns 1 for fields that are not nested.
 */
export function accessPathDepth(path: string) {
  if (!path) {
    return 0;
  }
  return splitAccessPath(path).length;
}

/**
 * This is a replacement for chained || for numeric properties or properties that respect null so that 0 will be included.
 */
export function getFirstDefined<T>(...args: T[]): T {
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
export function uniqueId(prefix?: string) {
  const id = ++idCounter;
  return prefix ? String(prefix) + id : id;
}

/**
 * Resets the id counter used in uniqueId. This can be useful for testing.
 */
export function resetIdCounter() {
  idCounter = 42;
}
