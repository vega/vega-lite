import { LogicalOperand } from '../../logical';
import { Predicate } from '../../predicate';
import { VgFilterTransform } from '../../vega.schema';
import { Model } from '../model';
import { DataFlowNode, TransformNode } from './dataflow';
export declare class FilterNode extends TransformNode {
    private readonly model;
    private filter;
    private expr;
    private _dependentFields;
    clone(): FilterNode;
    constructor(parent: DataFlowNode, model: Model, filter: LogicalOperand<Predicate>);
    dependentFields(): import("../../util").Dict<true>;
    assemble(): VgFilterTransform;
    hash(): string;
}
