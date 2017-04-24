export { extend, isArray, isObject, isNumber, isString, truncate, toSet, stringValue } from 'vega-util';
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
export declare function pick(obj: any, props: string[]): {};
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
export declare function omit(obj: any, props: string[]): any;
export declare function hash(a: any): string;
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
export declare function flatten(arrays: any[]): any;
/**
 * recursively merges src into dest
 */
export declare function mergeDeep(dest: any, ...src: any[]): any;
export declare function unique<T>(values: T[], f: (item: T) => string): T[];
export interface Dict<T> {
    [key: string]: T;
}
export declare type StringSet = Dict<boolean>;
/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
export declare function differ<T>(dict: Dict<T>, other: Dict<T>): boolean;
export declare function hasIntersection(a: StringSet, b: StringSet): boolean;
export declare function differArray<T>(array: T[], other: T[]): boolean;
export declare const keys: (o: any) => string[];
export declare function vals<T>(x: {
    [key: string]: T;
}): T[];
export declare function duplicate<T>(obj: T): T;
export declare function isBoolean(b: any): b is boolean;
/**
 * Convert a string into a valid variable name
 */
export declare function varName(s: string): string;
