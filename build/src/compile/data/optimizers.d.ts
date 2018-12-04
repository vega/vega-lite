import { DataFlowNode } from './dataflow';
import { BottomUpOptimizer, TopDownOptimizer } from './optimizer';
import * as optimizers from './optimizers';
export interface OptimizerFlags {
    /**
     * If true, iteration continues
     */
    continueFlag: boolean;
    /**
     * If true, the tree has been mutated by the function
     */
    mutatedFlag: boolean;
}
/**
 * Start optimization path at the leaves. Useful for merging up or removing things.
 *
 * If the callback returns true, the recursion continues.
 */
export declare function iterateFromLeaves(f: (node: DataFlowNode) => OptimizerFlags): (node: DataFlowNode) => boolean;
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
 * Inserts an Intermediate ParseNode containing all non-conflicting Parse fields and removes the empty ParseNodes
 */
export declare class MergeParse extends BottomUpOptimizer {
    run(node: DataFlowNode): optimizers.OptimizerFlags;
}
export declare class MergeAggregateNodes extends BottomUpOptimizer {
    run(node: DataFlowNode): optimizers.OptimizerFlags;
}
