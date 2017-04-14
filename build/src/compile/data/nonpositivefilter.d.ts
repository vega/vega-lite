import { Dict } from '../../util';
import { VgTransform } from '../../vega.schema';
import { Model } from './../model';
import { DataFlowNode } from './dataflow';
export declare class NonPositiveFilterNode extends DataFlowNode {
    private _filter;
    clone(): NonPositiveFilterNode;
    constructor(filter: Dict<boolean>);
    static make(model: Model): NonPositiveFilterNode;
    readonly filter: Dict<boolean>;
    assemble(): VgTransform[];
}
