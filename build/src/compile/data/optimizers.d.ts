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
 * Repeatedly remove leaf nodes that are not output nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 */
export declare function removeUnusedSubtrees(node: DataFlowNode): boolean;
