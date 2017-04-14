import { VgCollectTransform, VgSort } from '../../vega.schema';
import { UnitModel } from '../unit';
import { DataFlowNode } from './dataflow';
export declare class OrderNode extends DataFlowNode {
    private sort;
    clone(): OrderNode;
    constructor(sort: VgSort);
    static make(model: UnitModel): OrderNode;
    assemble(): VgCollectTransform;
}
