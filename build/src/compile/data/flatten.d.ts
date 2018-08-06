import { FlattenTransform as VgFlattenTransform } from 'vega';
import { FlattenTransform } from '../../transform';
import { DataFlowNode, TransformNode } from './dataflow';
/**
 * A class for flatten transform nodes
 */
export declare class FlattenTransformNode extends TransformNode {
    private transform;
    clone(): FlattenTransformNode;
    constructor(parent: DataFlowNode, transform: FlattenTransform);
    producedFields(): {};
    hash(): string;
    assemble(): VgFlattenTransform;
}
