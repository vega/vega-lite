import { FieldDef } from '../../fielddef';
import { Dict } from '../../util';
import { VgFilterTransform } from '../../vega.schema';
import { ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
export declare class FilterInvalidNode extends DataFlowNode {
    private fieldDefs;
    clone(): FilterInvalidNode;
    constructor(fieldDefs: Dict<FieldDef<string>>);
    static make(model: ModelWithField): FilterInvalidNode;
    readonly filter: Dict<FieldDef<string>>;
    assemble(): VgFilterTransform;
}
