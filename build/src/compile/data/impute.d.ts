import { ImputeTransform } from '../../transform';
import { VgFormulaTransform, VgImputeTransform, VgWindowTransform } from '../../vega.schema';
import { UnitModel } from '../unit';
import { DataFlowNode, TransformNode } from './dataflow';
export declare class ImputeNode extends TransformNode {
    private transform;
    clone(): ImputeNode;
    producedFields(): {
        [x: string]: true;
    };
    constructor(parent: DataFlowNode, transform: ImputeTransform);
    private processSequence;
    static makeFromTransform(parent: DataFlowNode, imputeTransform: ImputeTransform): ImputeNode;
    static makeFromEncoding(parent: DataFlowNode, model: UnitModel): ImputeNode;
    hash(): string;
    assemble(): (VgFormulaTransform | VgImputeTransform | VgWindowTransform)[];
}
