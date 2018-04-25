import { DataFlowNode } from './dataflow';
/**
 * Start optimization path at the leaves. Useful for merging up or removing things.
 *
 * If the callback returns true, the recursion continues.
 */
export declare function iterateFromLeaves(f: (node: DataFlowNode) => boolean): (node: DataFlowNode) => void;
/**
 * Move parse nodes up to forks.
 */
export declare function moveParseUp(node: DataFlowNode): boolean;
/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
export declare function removeUnusedSubtrees(node: DataFlowNode): boolean;
/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
export declare function removeDuplicateTimeUnits(leaf: DataFlowNode): void;
