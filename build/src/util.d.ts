import clone_ from 'clone';
import stableStringify from 'fast-json-stable-stringify';
import { LogicalOperand } from './logical';
export declare const deepEqual: (a: any, b: any) => boolean;
export declare const duplicate: typeof clone_;
/**
 * Make a regular expression that matches a whole word of the given string
 */
export declare function globalWholeWordRegExp(word: string): RegExp;
/**
 * Creates an object composed of the picked object properties.
 *
 * var object = {'a': 1, 'b': '2', 'c': 3};
 * pick(object, ['a', 'c']);
 * // → {'a': 1, 'c': 3}
 *
 */
export declare function pick<T extends object, K extends keyof T>(obj: T, props: K[]): Pick<T, K>;
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
export declare function omit<T extends object, K extends keyof T>(obj: T, props: K[]): Omit<T, K>;
/**
 * Converts any object to a string representation that can be consumed by humans.
 */
export declare const stringify: typeof stableStringify;
/**
 * Converts any object to a string of limited size, or a number.
 */
export declare function hash(a: any): string | number;
export declare function contains<T>(array: T[], item: T): boolean;
/** Returns the array without the elements in item */
export declare function without<T>(array: T[], excludedItems: T[]): T[];
export declare function union<T>(array: T[], other: T[]): T[];
/**
 * Returns true if any item returns true.
 */
export declare function some<T>(arr: T[], f: (d: T, k?: any, i?: any) => boolean): boolean;
/**
 * Returns true if all items return true.
 */
export declare function every<T>(arr: T[], f: (d: T, k?: any, i?: any) => boolean): boolean;
export declare function flatten<T>(arrays: T[][]): T[];
export declare function fill<T>(val: T, len: number): T[];
/**
 * Like TS Partial but applies recursively to all properties.
 */
export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
/**
 * recursively merges src into dest
 */
export declare function mergeDeep<T>(dest: T, ...src: DeepPartial<T>[]): T;
export declare function unique<T>(values: T[], f: (item: T) => string | number): T[];
export interface Dict<T> {
    [key: string]: T;
}
/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
export declare function isEqual<T>(dict: Dict<T>, other: Dict<T>): boolean;
export declare function setEqual<T>(a: Set<T>, b: Set<T>): boolean;
export declare function hasIntersection<T>(a: Set<T>, b: Set<T>): boolean;
export declare function prefixGenerator(a: Set<string>): Set<string>;
export declare function fieldIntersection(a: Set<string>, b: Set<string>): boolean;
export declare function isNumeric(num: string | number): boolean;
export declare function differArray<T>(array: T[], other: T[]): boolean;
export declare const keys: <T>(o: T) => Extract<keyof T, string>[];
export declare function vals<T>(x: {
    [key: string]: T;
}): T[];
export declare function entries<T>(x: {
    [key: string]: T;
}): {
    key: string;
    value: T;
}[];
export declare type Flag<S extends string> = {
    [K in S]: 1;
};
export declare function flagKeys<S extends string>(f: Flag<S>): S[];
export declare function isBoolean(b: any): b is boolean;
/**
 * Convert a string into a valid variable name
 */
export declare function varName(s: string): string;
export declare function logicalExpr<T>(op: LogicalOperand<T>, cb: (...args: any[]) => string): string;
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/**
 * Delete nested property of an object, and delete the ancestors of the property if they become empty.
 */
export declare function deleteNestedProperty(obj: any, orderedProps: string[]): boolean;
export declare function titlecase(s: string): string;
/**
 * Converts a path to an access path with datum.
 * @param path The field name.
 * @param datum The string to use for `datum`.
 */
export declare function accessPathWithDatum(path: string, datum?: string): string;
/**
 * Return access with datum to the flattened field.
 *
 * @param path The field name.
 * @param datum The string to use for `datum`.
 */
export declare function flatAccessWithDatum(path: string, datum?: 'datum' | 'parent'): string;
/**
 * Replaces path accesses with access to non-nested field.
 * For example, `foo["bar"].baz` becomes `foo\\.bar\\.baz`.
 */
export declare function replacePathInField(path: string): string;
/**
 * Remove path accesses with access from field.
 * For example, `foo["bar"].baz` becomes `foo.bar.baz`.
 */
export declare function removePathFromField(path: string): string;
/**
 * Count the depth of the path. Returns 1 for fields that are not nested.
 */
export declare function accessPathDepth(path: string): number;
/**
 * This is a replacement for chained || for numeric properties or properties that respect null so that 0 will be included.
 */
export declare function getFirstDefined<T>(...args: T[]): T;
/**
 * Returns a new random id every time it gets called.
 *
 * Has side effect!
 */
export declare function uniqueId(prefix?: string): string | number;
/**
 * Resets the id counter used in uniqueId. This can be useful for testing.
 */
export declare function resetIdCounter(): void;
