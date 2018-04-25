import { FieldDef } from '../../fielddef';
import { Dict } from '../../util';
import { VgFilterTransform } from '../../vega.schema';
import { UnitModel } from '../unit';
import { DataFlowNode } from './dataflow';
export declare class FilterInvalidNode extends DataFlowNode {
    private fieldDefs;
    clone(): FilterInvalidNode;
    constructor(parent: DataFlowNode, fieldDefs: Dict<FieldDef<string>>);
    static make(parent: DataFlowNode, model: UnitModel): FilterInvalidNode;
    readonly filter: Dict<FieldDef<string>>;
    assemble(): VgFilterTransform;
}
