import { FieldDef } from '../../channeldef';
import { Dict } from '../../util';
import { VgFilterTransform } from '../../vega.schema';
import { UnitModel } from '../unit';
import { DataFlowNode } from './dataflow';
export declare class FilterInvalidNode extends DataFlowNode {
    readonly filter: Dict<FieldDef<string>>;
    clone(): FilterInvalidNode;
    constructor(parent: DataFlowNode, filter: Dict<FieldDef<string>>);
    static make(parent: DataFlowNode, model: UnitModel): FilterInvalidNode;
    dependentFields(): Set<string>;
    producedFields(): Set<string>;
    hash(): string;
    /**
     * Create the VgTransforms for each of the filtered fields.
     */
    assemble(): VgFilterTransform;
}
//# sourceMappingURL=filterinvalid.d.ts.map