import { Model } from '../model';
import { DataFlowNode } from './dataflow';
import { BottomUpOptimizer, Optimizer, TopDownOptimizer } from './optimizer';
/**
 * Merge identical nodes at forks by comparing hashes.
 *
 * Does not need to iterate from leaves so we implement this with recursion as it's a bit simpler.
 */
export declare class MergeIdenticalNodes extends TopDownOptimizer {
    mergeNodes(parent: DataFlowNode, nodes: DataFlowNode[]): void;
    run(node: DataFlowNode): void;
}
/**
 * Optimizer that removes identifier nodes that are not needed for selections.
 */
export declare class RemoveUnnecessaryIdentifierNodes extends TopDownOptimizer {
    private requiresSelectionId;
    constructor(model: Model);
    run(node: DataFlowNode): void;
}
/**
 * Removes duplicate time unit nodes (as determined by the name of the output field) that may be generated due to
 * selections projected over time units. Only keeps the first time unit in any branch.
 *
 * This optimizer is a custom top down optimizer that keep track of produced fields in a branch.
 */
export declare class RemoveDuplicateTimeUnits extends Optimizer {
    optimize(node: DataFlowNode): boolean;
    run(node: DataFlowNode, timeUnitFields: Set<string>): void;
}
/**
 * Remove output nodes that are not required.
 */
export declare class RemoveUnnecessaryOutputNodes extends TopDownOptimizer {
    constructor();
    run(node: DataFlowNode): void;
}
/**
 * Move parse nodes up to forks and merges them if possible.
 */
export declare class MoveParseUp extends BottomUpOptimizer {
    run(node: DataFlowNode): void;
}
/**
 * Inserts an intermediate ParseNode containing all non-conflicting parse fields and removes the empty ParseNodes.
 *
 * We assume that dependent paths that do not have a parse node can be just merged.
 */
export declare class MergeParse extends BottomUpOptimizer {
    run(node: DataFlowNode): void;
}
/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
export declare class RemoveUnusedSubtrees extends BottomUpOptimizer {
    run(node: DataFlowNode): void;
}
/**
 * Merge adjacent time unit nodes.
 */
export declare class MergeTimeUnits extends BottomUpOptimizer {
    run(node: DataFlowNode): void;
}
export declare class MergeAggregates extends BottomUpOptimizer {
    run(node: DataFlowNode): void;
}
/**
 * Merge bin nodes and move them up through forks. Stop at filters, parse, identifier as we want them to stay before the bin node.
 */
export declare class MergeBins extends BottomUpOptimizer {
    private model;
    constructor(model: Model);
    run(node: DataFlowNode): void;
}
/**
 * This optimizer takes output nodes that are at a fork and moves them before the fork.
 *
 * The algorithm iterates over the children and tries to find the last output node in a chain of output nodes.
 * It then moves all output nodes before that main output node. All other children (and the children of the output nodes)
 * are inserted after the main output node.
 */
export declare class MergeOutputs extends BottomUpOptimizer {
    run(node: DataFlowNode): void;
}
//# sourceMappingURL=optimizers.d.ts.map