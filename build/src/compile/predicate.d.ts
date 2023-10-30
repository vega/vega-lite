import { LogicalComposition } from '../logical';
import { Predicate } from '../predicate';
import { DataFlowNode } from './data/dataflow';
import { Model } from './model';
/**
 * Converts a predicate into an expression.
 */
export declare function expression(model: Model, filterOp: LogicalComposition<Predicate>, node?: DataFlowNode): string;
//# sourceMappingURL=predicate.d.ts.map