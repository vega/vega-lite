import { DataFlowNode } from './dataflow';
/**
 * Move facet nodes down to the next fork or output node. Also pull the main output with the facet node.
 * After moving down the facet node, make a copy of the subtree and make it a child of the main output.
 */
export declare function moveFacetDown(node: DataFlowNode): void;
//# sourceMappingURL=subtree.d.ts.map