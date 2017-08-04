import { FieldDef } from '../../fielddef';
import { Dict } from '../../util';
import { VgFilterTransform } from '../../vega.schema';
import { ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
export declare class NullFilterNode extends DataFlowNode {
    private _filteredFields;
    clone(): NullFilterNode;
    constructor(fields: Dict<FieldDef<string>>);
    static make(model: ModelWithField): NullFilterNode;
    readonly filteredFields: Dict<FieldDef<string>>;
    merge(other: NullFilterNode): void;
    assemble(): VgFilterTransform;
}
