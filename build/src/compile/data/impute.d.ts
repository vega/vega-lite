import { ImputeTransform } from '../../transform';
import { VgFormulaTransform, VgImputeTransform, VgWindowTransform } from '../../vega.schema';
import { UnitModel } from '../unit';
import { DataFlowNode } from './dataflow';
export declare class ImputeNode extends DataFlowNode {
    private transform;
    clone(): ImputeNode;
    producedFields(): {
        [x: string]: true;
    };
    constructor(parent: DataFlowNode, transform: ImputeTransform);
    private processSequence;
    static makeFromTransform(parent: DataFlowNode, imputeTransform: ImputeTransform): ImputeNode;
    static makeFromEncoding(parent: DataFlowNode, model: UnitModel): ImputeNode;
    assemble(): (VgFormulaTransform | VgImputeTransform | VgWindowTransform)[];
}
