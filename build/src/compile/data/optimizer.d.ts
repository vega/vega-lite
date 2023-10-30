import { DataFlowNode } from './dataflow';
/**
 * Whether this dataflow node is the source of the dataflow that produces data i.e. a source or a generator.
 */
export declare function isDataSourceNode(node: DataFlowNode): boolean;
/**
 * Abstract base class for Dataflow optimizers.
 * Contains only mutation handling logic. Subclasses need to implement iteration logic.
 */
export declare abstract class Optimizer {
    #private;
    constructor();
    setModified(): void;
    get modifiedFlag(): boolean;
    /**
     * Run the optimization for the tree with the provided root.
     */
    abstract optimize(root: DataFlowNode): boolean;
}
/**
 * Starts from a node and runs the optimization function (the "run" method) upwards to the root,
 * depending on the continue and modified flag values returned by the optimization function.
 */
export declare abstract class BottomUpOptimizer extends Optimizer {
    /**
     * Run the optimizer at the node. This method should not change the parent of the passed in node (it should only affect children).
     */
    abstract run(node: DataFlowNode): void;
    /**
     * Compute a map of node depths that we can use to determine a topological sort order.
     */
    private getNodeDepths;
    /**
     * Run the optimizer on all nodes starting from the leaves.
     */
    optimize(node: DataFlowNode): boolean;
}
/**
 * The optimizer function (the "run" method), is invoked on the given node and then continues recursively.
 */
export declare abstract class TopDownOptimizer extends Optimizer {
    /**
     * Run the optimizer at the node.
     */
    abstract run(node: DataFlowNode): void;
    /**
     * Run the optimizer depth first on all nodes starting from the roots.
     */
    optimize(node: DataFlowNode): boolean;
}
//# sourceMappingURL=optimizer.d.ts.map