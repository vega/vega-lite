import { VgIdentifierTransform } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
export declare class IdentifierNode extends DataFlowNode {
    clone(): IdentifierNode;
    constructor(parent: DataFlowNode);
    producedFields(): Set<string>;
    assemble(): VgIdentifierTransform;
}
