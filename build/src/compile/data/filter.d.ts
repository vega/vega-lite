import { LogicalOperand } from '../../logical';
import { Predicate } from '../../predicate';
import { VgFilterTransform } from '../../vega.schema';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
export declare class FilterNode extends DataFlowNode {
    private readonly model;
    private filter;
    private expr;
    clone(): FilterNode;
    constructor(parent: DataFlowNode, model: Model, filter: LogicalOperand<Predicate>);
    assemble(): VgFilterTransform;
}
