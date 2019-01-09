import { FlattenTransform as VgFlattenTransform } from 'vega';
import { FlattenTransform } from '../../transform';
import { DataFlowNode } from './dataflow';
/**
 * A class for flatten transform nodes
 */
export declare class FlattenTransformNode extends DataFlowNode {
    private transform;
    clone(): FlattenTransformNode;
    constructor(parent: DataFlowNode, transform: FlattenTransform);
    producedFields(): Set<string>;
    hash(): string;
    assemble(): VgFlattenTransform;
}
