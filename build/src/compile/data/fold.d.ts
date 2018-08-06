import { FoldTransform as VgFoldTransform } from 'vega';
import { FoldTransform } from '../../transform';
import { DataFlowNode, TransformNode } from './dataflow';
/**
 * A class for flatten transform nodes
 */
export declare class FoldTransformNode extends TransformNode {
    private transform;
    clone(): FoldTransformNode;
    constructor(parent: DataFlowNode, transform: FoldTransform);
    producedFields(): {};
    hash(): string;
    assemble(): VgFoldTransform;
}
