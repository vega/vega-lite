import { FormulaTransform as VgFormulaTransform } from 'vega';
import { SingleDefChannel } from '../../channel';
import { FieldRefOption, TypedFieldDef } from '../../channeldef';
import { CalculateTransform } from '../../transform';
import { ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
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
//# sourceMappingURL=calculate.d.ts.map