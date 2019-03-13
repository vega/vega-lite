/**
 * Generic class for storing properties that are explicitly specified
 * and implicitly determined by the compiler.
 * This is important for scale/axis/legend merging as
 * we want to prioritize properties that users explicitly specified.
 */
export declare class Split<T extends object> {
    readonly explicit: Partial<T>;
    readonly implicit: Partial<T>;
    constructor(explicit?: Partial<T>, implicit?: Partial<T>);
    clone(): Split<T>;
    combine(): Partial<T>;
    get<K extends keyof T>(key: K): T[K];
    getWithExplicit<K extends keyof T>(key: K): Explicit<T[K]>;
    setWithExplicit<K extends keyof T>(key: K, value: Explicit<T[K]>): void;
    set<K extends keyof T>(key: K, value: T[K], explicit: boolean): this;
    copyKeyFromSplit<S extends T>(key: keyof T, s: Split<S>): void;
    copyKeyFromObject<S extends Partial<T>>(key: keyof T, s: S): void;
    /**
     * Merge split object into this split object. Properties from the other split
     * overwrite properties from this split.
     */
    copyAll(other: Split<T>): void;
}
export interface Explicit<T> {
    explicit: boolean;
    value: T;
}
export declare function makeExplicit<T>(value: T): Explicit<T>;
export declare function makeImplicit<T>(value: T): Explicit<T>;
export declare function tieBreakByComparing<S, T>(compare: (v1: T, v2: T) => number): (v1: Explicit<T>, v2: Explicit<T>, property: keyof S, propertyOf: string | number | symbol) => Explicit<T>;
export declare function defaultTieBreaker<S, T>(v1: Explicit<T>, v2: Explicit<T>, property: keyof S, propertyOf: string | number | symbol): Explicit<T>;
export declare function mergeValuesWithExplicit<S, T>(v1: Explicit<T>, v2: Explicit<T>, property: keyof S, propertyOf: 'scale' | 'axis' | 'legend' | '', tieBreaker?: (v1: Explicit<T>, v2: Explicit<T>, property: keyof S, propertyOf: string) => Explicit<T>): Explicit<T>;
