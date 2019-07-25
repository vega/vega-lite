import { Model } from '../model';
import { DataFlowNode } from './dataflow';
import { BottomUpOptimizer, TopDownOptimizer } from './optimizer';
import * as optimizers from './optimizers';
export interface OptimizerFlags {
    /**
     * If true, iteration continues.
     */
    continueFlag: boolean;
    /**
     * If true, the tree has been mutated by the function.
     */
    mutatedFlag: boolean;
}
/**
 * Move parse nodes up to forks.
 */
export declare class MoveParseUp extends BottomUpOptimizer {
    run(node: DataFlowNode): OptimizerFlags;
}
/**
 * Merge identical nodes at forks by comparing hashes.
 *
 * Does not need to iterate from leaves so we implement this with recursion as it's a bit simpler.
 */
export declare class MergeIdenticalNodes extends TopDownOptimizer {
    mergeNodes(parent: DataFlowNode, nodes: DataFlowNode[]): void;
    run(node: DataFlowNode): boolean;
}
/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
export declare class RemoveUnusedSubtrees extends BottomUpOptimizer {
    run(node: DataFlowNode): OptimizerFlags;
}
/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
export declare class RemoveDuplicateTimeUnits extends BottomUpOptimizer {
    private fields;
    run(node: DataFlowNode): OptimizerFlags;
    reset(): void;
}
/**
 * Merge adjacent time unit nodes.
 */
export declare class MergeTimeUnits extends BottomUpOptimizer {
    run(node: DataFlowNode): OptimizerFlags;
}
/**
 * Move facet nodes down to the next fork or output node. Also pull the main output with the facet node.
 * After moving down the facet node, make a copy of the subtree and make it a child of the main output.
 */
export declare function moveFacetDown(node: DataFlowNode): void;
/**
 * Remove nodes that are not required starting from a root.
 */
export declare class RemoveUnnecessaryNodes extends TopDownOptimizer {
    run(node: DataFlowNode): boolean;
}
/**
 * Inserts an intermediate ParseNode containing all non-conflicting parse fields and removes the empty ParseNodes.
 *
 * We assume that dependent paths that do not have a parse node can be just merged.
 */
export declare class MergeParse extends BottomUpOptimizer {
    run(node: DataFlowNode): optimizers.OptimizerFlags;
}
export declare class MergeAggregates extends BottomUpOptimizer {
    run(node: DataFlowNode): optimizers.OptimizerFlags;
}
/**
 * Merge bin nodes and move them up through forks. Stop at filters and parse as we want them to stay before the bin node.
 */
export declare class MergeBins extends BottomUpOptimizer {
    private model;
    constructor(model: Model);
    run(node: DataFlowNode): OptimizerFlags;
}
/**
 * This optimizer takes output nodes that are at a fork and moves them before the fork.
 *
 * The algorithm iterates over the children and tries to find the last output node in a cahin of output nodes.
 * It then moves all output nodes before that main output node. All other children (and the children of the output nodes)
 * are inserted after the main output node.
 */
export declare class MergeOutputs extends BottomUpOptimizer {
    run(node: DataFlowNode): optimizers.OptimizerFlags;
}
//# sourceMappingURL=optimizers.d.ts.map