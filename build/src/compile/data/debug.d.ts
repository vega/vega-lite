import { DataFlowNode } from './dataflow';
/**
 * Print debug information for dataflow tree.
 */
export declare function debug(node: DataFlowNode): void;
/**
 * Print the dataflow tree as graphviz.
 *
 * Render the output in http://viz-js.com/.
 */
export declare function draw(roots: DataFlowNode[]): string;
/**
 * Iterates over a dataflow graph and checks whether all links are consistent.
 */
export declare function checkLinks(nodes: DataFlowNode[]): boolean;
