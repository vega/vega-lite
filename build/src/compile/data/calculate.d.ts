import { FieldDef } from '../../fielddef';
import { VgFormulaTransform } from '../../vega.schema';
import { ModelWithField } from '../model';
import { SingleDefChannel } from './../../channel';
import { CalculateTransform } from './../../transform';
import { DataFlowNode } from './dataflow';
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
export declare class CalculateNode extends DataFlowNode {
    private transform;
    clone(): CalculateNode;
    constructor(parent: DataFlowNode, transform: CalculateTransform);
    static parseAllForSortIndex(parent: DataFlowNode, model: ModelWithField): DataFlowNode;
    producedFields(): {};
    assemble(): VgFormulaTransform;
}
export declare function sortArrayIndexField(fieldDef: FieldDef<string>, channel: SingleDefChannel, expr?: 'datum'): string;
