import { Filter } from '../../filter';
import { CalculateTransform } from '../../transform';
import { VgFilterTransform, VgFormulaTransform } from '../../vega.schema';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
export declare class FilterNode extends DataFlowNode {
    private readonly model;
    private filter;
    clone(): FilterNode;
    constructor(model: Model, filter: Filter);
    assemble(): VgFilterTransform;
}
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
export declare class CalculateNode extends DataFlowNode {
    private transform;
    clone(): CalculateNode;
    constructor(transform: CalculateTransform);
    producedFields(): {};
    assemble(): VgFormulaTransform;
}
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
export declare function parseTransformArray(model: Model): {
    first: DataFlowNode;
    last: DataFlowNode;
};
