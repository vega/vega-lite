/**
 * Generic classs for storing properties that are explicitly specified and implicitly determined by the compiler.
 */
export declare class Split<T extends Object> {
    readonly explicit: T;
    readonly implicit: T;
    constructor(explicit?: T, implicit?: T);
    combine(keys?: (keyof T)[]): T;
    get<K extends keyof T>(key: K): T[K];
    getWithExplicit<K extends keyof T>(key: K): Explicit<T[K]>;
    setWithExplicit<K extends keyof T>(key: K, value: Explicit<T[K]>): void;
    set<K extends keyof T>(key: K, value: T[K], explicit: boolean): this;
    copyKeyFromSplit<S, K extends keyof (T | S)>(key: K, s: Split<S>): void;
    copyKeyFromObject<S, K extends keyof (T | S)>(key: K, s: S): void;
    extend(mixins: T, explicit: boolean): Split<T>;
}
export interface Explicit<T> {
    explicit: boolean;
    value: T;
}
export declare function makeExplicit<T>(value: T): Explicit<T>;
export declare function makeImplicit<T>(value: T): Explicit<T>;
export declare function mergeValuesWithExplicit<T>(v1: Explicit<T>, v2: Explicit<T>, compare?: (v1: T, v2: T) => number): Explicit<T>;
