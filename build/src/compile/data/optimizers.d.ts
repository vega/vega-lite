import { DataFlowNode } from './dataflow';
/**
 * Start optimization path at the leaves. Useful for merging up things.
 */
export declare function optimizeFromLeaves(f: (node: DataFlowNode) => void): (node: DataFlowNode) => void;
export declare function parse(node: DataFlowNode): void;
