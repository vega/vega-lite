import { AggregateOp } from 'vega';
export interface ArgminDef {
    argmin: string;
}
export interface ArgmaxDef {
    argmax: string;
}
export declare type Aggregate = AggregateOp | ArgmaxDef | ArgminDef;
export declare function isArgminDef(a: Aggregate | string): a is ArgminDef;
export declare function isArgmaxDef(a: Aggregate | string): a is ArgmaxDef;
export declare const AGGREGATE_OPS: AggregateOp[];
export declare function isAggregateOp(a: string | ArgminDef | ArgmaxDef): a is AggregateOp;
export declare const COUNTING_OPS: AggregateOp[];
export declare function isCountingAggregateOp(aggregate: string | Aggregate): boolean;
export declare function isMinMaxOp(aggregate: Aggregate | string): boolean;
/** Additive-based aggregation operations.  These can be applied to stack. */
export declare const SUM_OPS: AggregateOp[];
/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export declare const SHARED_DOMAIN_OPS: AggregateOp[];
export declare const SHARED_DOMAIN_OP_INDEX: {
    [T: string]: true;
};
//# sourceMappingURL=aggregate.d.ts.map