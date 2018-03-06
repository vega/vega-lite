import { CalculateTransform } from '../../transform';
import { VgFormulaTransform } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
export declare class CalculateNode extends DataFlowNode {
    private transform;
    clone(): CalculateNode;
    constructor(transform: CalculateTransform);
    producedFields(): {};
    assemble(): VgFormulaTransform;
}
