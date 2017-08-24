import { Filter } from '../../filter';
import { LogicalOperand } from '../../logical';
import { VgFilterTransform } from '../../vega.schema';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
export declare class FilterNode extends DataFlowNode {
    private readonly model;
    private filter;
    private expr;
    clone(): FilterNode;
    constructor(model: Model, filter: LogicalOperand<Filter>);
    assemble(): VgFilterTransform;
}
