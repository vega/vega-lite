import { AggregateOp } from 'vega';
import { FieldName } from './channeldef';
export declare const MULTIDOMAIN_SORT_OP_INDEX: {
    count: number;
    min: number;
    max: number;
};
export interface ArgminDef {
    argmin: FieldName;
}
export interface ArgmaxDef {
    argmax: FieldName;
}
export type NonArgAggregateOp = Exclude<AggregateOp, 'argmin' | 'argmax'>;
export type Aggregate = NonArgAggregateOp | ArgmaxDef | ArgminDef;
export declare function isArgminDef(a: Aggregate | string): a is ArgminDef;
export declare function isArgmaxDef(a: Aggregate | string): a is ArgmaxDef;
export declare function isAggregateOp(a: string | ArgminDef | ArgmaxDef): a is AggregateOp;
export declare const COUNTING_OPS: ReadonlySet<NonArgAggregateOp>;
export declare function isCountingAggregateOp(aggregate?: string | Aggregate): boolean;
export declare function isMinMaxOp(aggregate?: Aggregate | string): boolean;
/** Additive-based aggregation operations. These can be applied to stack. */
export declare const SUM_OPS: ReadonlySet<NonArgAggregateOp>;
/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export declare const SHARED_DOMAIN_OPS: ReadonlySet<AggregateOp>;
//# sourceMappingURL=aggregate.d.ts.map