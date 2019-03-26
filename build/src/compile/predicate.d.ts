import { LogicalOperand } from '../logical';
import { Predicate } from '../predicate';
import { DataFlowNode } from './data/dataflow';
import { Model } from './model';
/**
 * Converts a predicate into an expression.
 */
export declare function expression(model: Model, filterOp: LogicalOperand<Predicate>, node?: DataFlowNode): string;
