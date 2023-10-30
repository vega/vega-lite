export type LogicalComposition<T> = LogicalNot<T> | LogicalAnd<T> | LogicalOr<T> | T;
export interface LogicalOr<T> {
    or: LogicalComposition<T>[];
}
export interface LogicalAnd<T> {
    and: LogicalComposition<T>[];
}
export interface LogicalNot<T> {
    not: LogicalComposition<T>;
}
export declare function isLogicalOr(op: LogicalComposition<any>): op is LogicalOr<any>;
export declare function isLogicalAnd(op: LogicalComposition<any>): op is LogicalAnd<any>;
export declare function isLogicalNot(op: LogicalComposition<any>): op is LogicalNot<any>;
export declare function forEachLeaf<T>(op: LogicalComposition<T>, fn: (op: T) => void): void;
export declare function normalizeLogicalComposition<T>(op: LogicalComposition<T>, normalizer: (o: T) => T): LogicalComposition<T>;
//# sourceMappingURL=logical.d.ts.map