import { SequenceParams } from '../../data';
import { VgSequenceTransform } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
export declare class SequenceNode extends DataFlowNode {
    private params;
    clone(): SequenceNode;
    constructor(parent: DataFlowNode, params: SequenceParams);
    dependentFields(): Set<string>;
    producedFields(): Set<string>;
    hash(): string;
    assemble(): VgSequenceTransform;
}
//# sourceMappingURL=sequence.d.ts.map