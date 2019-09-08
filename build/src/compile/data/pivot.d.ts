import { PivotTransform } from '../../transform';
import { VgPivotTransform } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
/**
 * A class for pivot transform nodes.
 */
export declare class PivotTransformNode extends DataFlowNode {
    private transform;
    clone(): PivotTransformNode;
    constructor(parent: DataFlowNode, transform: PivotTransform);
    addDimensions(fields: string[]): void;
    producedFields(): undefined;
    dependentFields(): Set<string>;
    hash(): string;
    assemble(): VgPivotTransform;
}
//# sourceMappingURL=pivot.d.ts.map