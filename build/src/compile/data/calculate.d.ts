import { SingleDefChannel } from '../../channel';
import { FieldRefOption, TypedFieldDef } from '../../fielddef';
import { CalculateTransform } from '../../transform';
import { VgFormulaTransform } from '../../vega.schema';
import { ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
export declare class CalculateNode extends DataFlowNode {
    private readonly transform;
    private _dependentFields;
    clone(): CalculateNode;
    constructor(parent: DataFlowNode, transform: CalculateTransform);
    static parseAllForSortIndex(parent: DataFlowNode, model: ModelWithField): DataFlowNode;
    producedFields(): Set<string>;
    dependentFields(): Set<string>;
    assemble(): VgFormulaTransform;
    hash(): string;
}
export declare function sortArrayIndexField(fieldDef: TypedFieldDef<string>, channel: SingleDefChannel, opt?: FieldRefOption): string;
