import { VgIdentifierTransform } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
export declare class IdentifierNode extends DataFlowNode {
    clone(): IdentifierNode;
    constructor();
    producedFields(): {
        [SELECTION_ID]: boolean;
    };
    assemble(): VgIdentifierTransform;
}
