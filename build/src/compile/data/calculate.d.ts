import { SingleDefChannel } from '../../channel';
import { FieldDef } from '../../fielddef';
import { FieldRefOption } from '../../fielddef';
import { CalculateTransform } from '../../transform';
import { VgFormulaTransform } from '../../vega.schema';
import { ModelWithField } from '../model';
import { DataFlowNode, TransformNode } from './dataflow';
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
export declare class CalculateNode extends TransformNode {
    private transform;
    private _dependentFields;
    clone(): CalculateNode;
    constructor(parent: DataFlowNode, transform: CalculateTransform);
    static parseAllForSortIndex(parent: DataFlowNode, model: ModelWithField): DataFlowNode;
    producedFields(): {};
    dependentFields(): import("../../util").Dict<true>;
    assemble(): VgFormulaTransform;
    hash(): string;
}
export declare function sortArrayIndexField(fieldDef: FieldDef<string>, channel: SingleDefChannel, opt?: FieldRefOption): string;
