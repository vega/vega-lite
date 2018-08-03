import { FacetMapping } from '../../facet';
import { WindowTransform } from '../../transform';
import { VgWindowTransform } from '../../vega.schema';
import { DataFlowNode, TransformNode } from './dataflow';
/**
 * A class for the window transform nodes
 */
export declare class WindowTransformNode extends TransformNode {
    private transform;
    static makeFromFacet(parent: DataFlowNode, facet: FacetMapping<string>): WindowTransformNode;
    clone(): WindowTransformNode;
    constructor(parent: DataFlowNode, transform: WindowTransform);
    producedFields(): {};
    private getDefaultName;
    hash(): string;
    assemble(): VgWindowTransform;
}
