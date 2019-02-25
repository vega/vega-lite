import { DataFlowNode } from './dataflow';
import { OptimizerFlags } from './optimizers';
/**
 * Abstract base class for BottomUpOptimizer and TopDownOptimizer.
 * Contains only mutation handling logic. Subclasses need to implement iteration logic.
 */
declare abstract class OptimizerBase {
    private _mutated;
    constructor();
    setMutated(): void;
    readonly mutatedFlag: boolean;
}
/**
 * Starts from a node and runs the optimization function(the "run" method) upwards to the root,
 * depending on the continueFlag and mutatedFlag values returned by the optimization function.
 */
export declare abstract class BottomUpOptimizer extends OptimizerBase {
    private _continue;
    constructor();
    setContinue(): void;
    readonly continueFlag: boolean;
    flags: OptimizerFlags;
    abstract run(node: DataFlowNode): OptimizerFlags;
    optimizeNextFromLeaves(node: DataFlowNode): boolean;
}
/**
 * The optimizer function( the "run" method), is invoked on the given node and then continues recursively.
 */
export declare abstract class TopDownOptimizer extends OptimizerBase {
    abstract run(node: DataFlowNode): boolean;
}
export {};
