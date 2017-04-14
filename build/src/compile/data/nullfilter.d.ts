import { FieldDef } from '../../fielddef';
import { Dict } from '../../util';
import { VgFilterTransform } from '../../vega.schema';
import { Model } from './../model';
import { DataFlowNode } from './dataflow';
export declare class NullFilterNode extends DataFlowNode {
    private _filteredFields;
    clone(): NullFilterNode;
    constructor(fields: Dict<FieldDef>);
    static make(model: Model): NullFilterNode;
    readonly filteredFields: Dict<FieldDef>;
    merge(other: NullFilterNode): void;
    assemble(): VgFilterTransform;
}
