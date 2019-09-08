import { SampleTransform as VgSampleTransform } from 'vega';
import { SampleTransform } from '../../transform';
import { DataFlowNode } from './dataflow';
/**
 * A class for the sample transform nodes
 */
export declare class SampleTransformNode extends DataFlowNode {
    private transform;
    clone(): SampleTransformNode;
    constructor(parent: DataFlowNode, transform: SampleTransform);
    dependentFields(): Set<string>;
    producedFields(): Set<string>;
    hash(): string;
    assemble(): VgSampleTransform;
}
//# sourceMappingURL=sample.d.ts.map