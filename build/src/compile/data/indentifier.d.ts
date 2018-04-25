import { StringSet } from '../../util';
import { VgIdentifierTransform } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
export declare class IdentifierNode extends DataFlowNode {
    clone(): IdentifierNode;
    constructor(parent: DataFlowNode);
    producedFields(): StringSet;
    assemble(): VgIdentifierTransform;
}
