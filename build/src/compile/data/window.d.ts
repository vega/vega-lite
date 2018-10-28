import { WindowTransform } from '../../transform';
import { VgWindowTransform } from '../../vega.schema';
import { StringSet } from './../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for the window transform nodes
 */
export declare class WindowTransformNode extends DataFlowNode {
    private readonly transform;
    clone(): WindowTransformNode;
    constructor(parent: DataFlowNode, transform: WindowTransform);
    addDimensions(fields: string[]): void;
    dependentFields(): {};
    producedFields(): StringSet;
    private getDefaultName;
    hash(): string;
    assemble(): VgWindowTransform;
}
