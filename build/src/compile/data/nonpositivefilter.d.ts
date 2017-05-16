import { Dict } from '../../util';
import { VgTransform } from '../../vega.schema';
import { UnitModel } from './../unit';
import { DataFlowNode } from './dataflow';
export declare class NonPositiveFilterNode extends DataFlowNode {
    private _filter;
    clone(): NonPositiveFilterNode;
    constructor(filter: Dict<boolean>);
    static make(model: UnitModel): NonPositiveFilterNode;
    readonly filter: Dict<boolean>;
    assemble(): VgTransform[];
}
