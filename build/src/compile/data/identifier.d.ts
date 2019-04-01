import { VgIdentifierTransform } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
export declare class IdentifierNode extends DataFlowNode {
    clone(): IdentifierNode;
    constructor(parent: DataFlowNode);
    producedFields(): Set<string>;
    hash(): string;
    assemble(): VgIdentifierTransform;
}
//# sourceMappingURL=identifier.d.ts.map