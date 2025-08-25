import {hasOwnProperty, isNumber, isString, splitAccessPath, stringValue, writeConfig, isObject} from 'vega-util';
import {isLogicalAnd, isLogicalNot, isLogicalOr, LogicalComposition} from './logical.js';

export const duplicate = structuredClone;

export function never(message: string): never {
  throw new Error(message);
}

/**
 * Creates an object composed of the picked object properties.
 *
 * var object = {'a': 1, 'b': '2', 'c': 3};
 * pick(object, ['a', 'c']);
 * // → {'a': 1, 'c': 3}
 */
export function pick<T extends object, K extends keyof T>(obj: T, props: readonly K[]): Pick<T, K> {
  const copy: any = {};
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
export function omit<T extends object, K extends keyof T>(obj: T, props: readonly K[]): Omit<T, K> {
  const copy = {...(obj as any)};
  for (const prop of props) {
    delete copy[prop];
  }
  return copy;
}

/**
 * Monkey patch Set so that `stringify` produces a string representation of sets.
 */
(Set.prototype as any)['toJSON'] = function () {
  return `Set(${[...this].map((x) => stringify(x)).join(',')})`;
};

/**
 * Converts any object to a string of limited size, or a number.
 */
export function hash(a: any): string | number {
  if (isNumber(a)) {
    return a;
  }

  const str = isString(a) ? a : stringify(a);

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

export function isNullOrFalse(x: any): x is false | null {
  return x === false || x === null;
}

export function contains<T>(array: readonly T[], item: T) {
  return array.includes(item);
}

/**
 * Returns true if any item returns true.
 */
export function some<T>(arr: readonly T[], f: (d: T, k?: any, i?: any) => boolean) {
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
export function every<T>(arr: readonly T[], f: (d: T, k?: any, i?: any) => boolean) {
  let i = 0;
  for (const [k, a] of arr.entries()) {
    if (!f(a, k, i++)) {
      return false;
    }
  }
  return true;
}

/**
 * Like TS Partial but applies recursively to all properties.
 */
export type DeepPartial<T> = {[P in keyof T]?: DeepPartial<T[P]>};

/**
 * recursively merges src into dest
 */
export function mergeDeep<T>(dest: T, ...src: readonly DeepPartial<T>[]): T {
  for (const s of src) {
    deepMerge_(dest, s ?? {});
  }
  return dest;
}

function deepMerge_(dest: any, src: any) {
  for (const property of keys(src)) {
    writeConfig(dest, property, src[property], true);
  }
}

export function unique<T>(values: readonly T[], f: (item: T) => string | number): T[] {
  const results: T[] = [];
  const u = {};
  let v: string | number;
  for (const val of values) {
    v = f(val);
    if (v in u) {
      continue;
    }
    (u as any)[v] = 1;
    results.push(val);
  }
  return results;
}

export type Dict<T> = Record<string, T>;

/**
 * Returns true if the two dictionaries agree. Applies only to defined values.
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

export function hasIntersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>) {
  for (const key of a) {
    if (b.has(key)) {
      return true;
    }
  }
  return false;
}

export function prefixGenerator(a: ReadonlySet<string>): ReadonlySet<string> {
  const prefixes = new Set<string>();
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
export function fieldIntersection(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  if (a === undefined || b === undefined) {
    return true;
  }
  return hasIntersection(prefixGenerator(a), prefixGenerator(b));
}

export function isEmpty(obj: object) {
  return keys(obj).length === 0;
}

// This is a stricter version of Object.keys but with better types. See https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
export const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];

// Stricter version from https://github.com/microsoft/TypeScript/issues/51572#issuecomment-1319153323
export const vals = Object.values as <T>(obj: T) => Array<T[keyof T]>;

// Stricter version from https://github.com/microsoft/TypeScript/issues/51572#issuecomment-1319153323
export const entries = Object.entries as <T>(obj: T) => Array<[keyof T, T[keyof T]]>;

// Using mapped type to declare a collect of flags for a string literal type S
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
export type Flag<S extends string> = {[K in S]: 1};

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

export function logicalExpr<T>(op: LogicalComposition<T>, cb: (...args: readonly any[]) => string): string {
  if (isLogicalNot(op)) {
    return `!(${logicalExpr(op.not, cb)})`;
  } else if (isLogicalAnd(op)) {
    return `(${op.and.map((and: LogicalComposition<T>) => logicalExpr(and, cb)).join(') && (')})`;
  } else if (isLogicalOr(op)) {
    return `(${op.or.map((or: LogicalComposition<T>) => logicalExpr(or, cb)).join(') || (')})`;
  } else {
    return cb(op);
  }
}

/**
 * Delete nested property of an object, and delete the ancestors of the property if they become empty.
 */
export function deleteNestedProperty(obj: any, orderedProps: string[]) {
  if (orderedProps.length === 0) {
    return true;
  }
  const prop = orderedProps.shift()!;
  if (prop in obj && deleteNestedProperty(obj[prop], orderedProps)) {
    delete obj[prop];
  }
  return isEmpty(obj);
}

export function titleCase(s: string) {
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
export function flatAccessWithDatum(path: string, datum: 'datum' | 'parent' | 'datum.datum' = 'datum') {
  return `${datum}[${stringValue(splitAccessPath(path).join('.'))}]`;
}

/**
 * Return access with datum to **an unescaped path**.
 *
 * ```ts
 * console.log(accessWithDatumToUnescapedPath("vega's favorite"))
 * // "datum['vega\\'s favorite']"
 * ```
 *
 * @param path The unescaped path name. E.g., `"a.b"`, `"vega's favorite"`. (Note
 * that the field defs take escaped strings like `"a\\.b"`, `"vega\\'s favorite"`,
 * but this function is for the unescaped field/path)
 */
export function accessWithDatumToUnescapedPath(unescapedPath: string) {
  const singleQuoteEscapedPath = unescapedPath.replaceAll("'", "\\'");
  return `datum['${singleQuoteEscapedPath}']`;
}

export function unescapeSingleQuoteAndPathDot(escapedPath: string) {
  return escapedPath.replaceAll("\\'", "'").replaceAll('\\.', '.');
}

function escapePathAccess(string: string) {
  return string.replace(/(\[|\]|\.|'|")/g, '\\$1');
}

/**
 * Replaces path accesses with access to non-nested field.
 * For example, `foo["bar"].baz` becomes `foo\\.bar\\.baz`.
 */
export function replacePathInField(path: string) {
  return `${splitAccessPath(path).map(escapePathAccess).join('\\.')}`;
}

/**
 * Replace all occurrences of a string with another string.
 *
 * @param string the string to replace in
 * @param find the string to replace
 * @param replacement the replacement
 */
export function replaceAll(string: string, find: string, replacement: string) {
  return string.replace(new RegExp(find.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replacement);
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
export function getFirstDefined<T>(...args: readonly T[]): T | undefined {
  return args.find((a) => a !== undefined);
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

export function internalField(name: string) {
  return isInternalField(name) ? name : `__${name}`;
}

export function isInternalField(name: string) {
  return name.startsWith('__');
}

/**
 * Normalize angle to be within [0,360).
 */
export function normalizeAngle(angle: number) {
  if (angle === undefined) {
    return undefined;
  }
  return ((angle % 360) + 360) % 360;
}

/**
 * Returns whether the passed in value is a valid number.
 */
export function isNumeric(value: number | string): boolean {
  if (isNumber(value)) {
    return true;
  }
  return !isNaN(value as any) && !isNaN(parseFloat(value));
}

const clonedProto = Object.getPrototypeOf(structuredClone({}));

/**
 * Compares two values for equality, including arrays and objects.
 *
 * Adapted from https://github.com/epoberezkin/fast-deep-equal.
 */
export function deepEqual(a: any, b: any) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    // compare names to avoid issues with structured clone
    if (a.constructor.name !== b.constructor.name) return false;

    let length;
    let i: number;

    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }

    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      for (const e of a.entries()) if (!b.has(e[0])) return false;
      for (const e of a.entries()) if (!deepEqual(e[1], b.get(e[0]))) return false;
      return true;
    }

    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      for (const e of a.entries()) if (!b.has(e[0])) return false;
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = (a as any).length;
      if (length != (b as any).length) return false;
      for (i = length; i-- !== 0; ) if ((a as any)[i] !== (b as any)[i]) return false;
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    // also compare to structured clone prototype
    if (a.valueOf !== Object.prototype.valueOf && a.valueOf !== clonedProto.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString && a.toString !== clonedProto.toString)
      return a.toString() === b.toString();

    const ks = Object.keys(a);
    length = ks.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, ks[i])) return false;

    for (i = length; i-- !== 0; ) {
      const key = ks[i];

      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
}

/**
 * Converts any object to a string representation that can be consumed by humans.
 *
 * Adapted from https://github.com/epoberezkin/fast-json-stable-stringify
 */
export function stringify(data: any) {
  const seen: any[] = [];

  return (function _stringify(node: any) {
    if (node?.toJSON && typeof node.toJSON === 'function') {
      node = node.toJSON();
    }

    if (node === undefined) return undefined;
    if (typeof node == 'number') return isFinite(node) ? `${node}` : 'null';
    if (typeof node !== 'object') return JSON.stringify(node);

    let i;
    let out;
    if (Array.isArray(node)) {
      out = '[';
      for (i = 0; i < node.length; i++) {
        if (i) out += ',';
        out += _stringify(node[i]) || 'null';
      }
      return `${out}]`;
    }

    if (node === null) return 'null';

    if (seen.includes(node)) {
      throw new TypeError('Converting circular structure to JSON');
    }

    const seenIndex = seen.push(node) - 1;
    const ks = Object.keys(node).sort();
    out = '';
    for (i = 0; i < ks.length; i++) {
      const key = ks[i];
      const value = _stringify(node[key]);

      if (!value) continue;
      if (out) out += ',';
      out += `${JSON.stringify(key)}:${value}`;
    }
    seen.splice(seenIndex, 1);
    return `{${out}}`;
  })(data);
}

/**
 * Check if the input object has the property and it's not undefined.
 *
 * @param object the object
 * @param property the property to search
 * @returns if the object has the property and it's not undefined.
 */
export function hasProperty<T>(obj: T, key: string | number | symbol): key is keyof T {
  return isObject(obj) && hasOwnProperty(obj, key) && (obj as any)[key] !== undefined;
}
