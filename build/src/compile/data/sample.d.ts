import { SampleTransform as VgSampleTransform } from 'vega';
import { SampleTransform } from '../../transform';
import { DataFlowNode, TransformNode } from './dataflow';
/**
 * A class for the sample transform nodes
 */
export declare class SampleTransformNode extends TransformNode {
    private transform;
    clone(): SampleTransformNode;
    constructor(parent: DataFlowNode, transform: SampleTransform);
    hash(): string;
    assemble(): VgSampleTransform;
}
