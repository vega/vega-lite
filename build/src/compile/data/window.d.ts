import { WindowTransform } from '../../transform';
import { VgWindowTransform } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
/**
 * A class for the window transform nodes
 */
export declare class WindowTransformNode extends DataFlowNode {
    private transform;
    clone(): WindowTransformNode;
    constructor(parent: DataFlowNode, transform: WindowTransform);
    producedFields(): {};
    private getDefaultName;
    assemble(): VgWindowTransform;
}
