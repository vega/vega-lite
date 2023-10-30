import { default as clone_ } from 'clone';
import stableStringify from 'fast-json-stable-stringify';
import { LogicalComposition } from './logical';
export declare const deepEqual: (a: any, b: any) => boolean;
export declare const duplicate: typeof clone_;
export declare function never(message: string): never;
/**
 * Creates an object composed of the picked object properties.
 *
 * var object = {'a': 1, 'b': '2', 'c': 3};
 * pick(object, ['a', 'c']);
 * // → {'a': 1, 'c': 3}
 */
export declare function pick<T extends object, K extends keyof T>(obj: T, props: readonly K[]): Pick<T, K>;
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
export declare function omit<T extends object, K extends keyof T>(obj: T, props: readonly K[]): Omit<T, K>;
/**
 * Converts any object to a string representation that can be consumed by humans.
 */
export declare const stringify: typeof stableStringify;
/**
 * Converts any object to a string of limited size, or a number.
 */
export declare function hash(a: any): string | number;
export declare function isNullOrFalse(x: any): x is false | null;
export declare function contains<T>(array: readonly T[], item: T): boolean;
/**
 * Returns true if any item returns true.
 */
export declare function some<T>(arr: readonly T[], f: (d: T, k?: any, i?: any) => boolean): boolean;
/**
 * Returns true if all items return true.
 */
export declare function every<T>(arr: readonly T[], f: (d: T, k?: any, i?: any) => boolean): boolean;
/**
 * Like TS Partial but applies recursively to all properties.
 */
export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
/**
 * recursively merges src into dest
 */
export declare function mergeDeep<T>(dest: T, ...src: readonly DeepPartial<T>[]): T;
export declare function unique<T>(values: readonly T[], f: (item: T) => string | number): T[];
export type Dict<T> = Record<string, T>;
/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
export declare function isEqual<T>(dict: Dict<T>, other: Dict<T>): boolean;
export declare function setEqual<T>(a: Set<T>, b: Set<T>): boolean;
export declare function hasIntersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): boolean;
export declare function prefixGenerator(a: ReadonlySet<string>): ReadonlySet<string>;
/**
 * Returns true if a and b have an intersection. Also return true if a or b are undefined
 * since this means we don't know what fields a node produces or depends on.
 */
export declare function fieldIntersection(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean;
export declare function isEmpty(obj: object): boolean;
export declare const keys: <T>(o: T) => Extract<keyof T, string>[];
export declare const vals: {
    <T>(o: {
        [s: string]: T;
    } | ArrayLike<T>): T[];
    (o: {}): any[];
};
export declare const entries: {
    <T>(o: {
        [s: string]: T;
    } | ArrayLike<T>): [string, T][];
    (o: {}): [string, any][];
};
export type Flag<S extends string> = {
    [K in S]: 1;
};
export declare function isBoolean(b: any): b is boolean;
/**
 * Convert a string into a valid variable name
 */
export declare function varName(s: string): string;
export declare function logicalExpr<T>(op: LogicalComposition<T>, cb: (...args: readonly any[]) => string): string;
/**
 * Delete nested property of an object, and delete the ancestors of the property if they become empty.
 */
export declare function deleteNestedProperty(obj: any, orderedProps: string[]): boolean;
export declare function titleCase(s: string): string;
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
export declare function flatAccessWithDatum(path: string, datum?: 'datum' | 'parent' | 'datum.datum'): string;
/**
 * Replaces path accesses with access to non-nested field.
 * For example, `foo["bar"].baz` becomes `foo\\.bar\\.baz`.
 */
export declare function replacePathInField(path: string): string;
/**
 * Replace all occurrences of a string with another string.
 *
 * @param string the string to replace in
 * @param find the string to replace
 * @param replacement the replacement
 */
export declare function replaceAll(string: string, find: string, replacement: string): string;
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
export declare function getFirstDefined<T>(...args: readonly T[]): T | undefined;
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
export declare function internalField(name: string): string;
export declare function isInternalField(name: string): boolean;
/**
 * Normalize angle to be within [0,360).
 */
export declare function normalizeAngle(angle: number): number;
/**
 * Returns whether the passed in value is a valid number.
 */
export declare function isNumeric(value: number | string): boolean;
//# sourceMappingURL=util.d.ts.map