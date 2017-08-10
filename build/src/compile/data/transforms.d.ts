import { Filter } from '../../filter';
import { LogicalOperand } from '../../logical';
import { CalculateTransform, LookupTransform } from '../../transform';
import { StringSet } from '../../util';
import { VgFilterTransform, VgFormulaTransform, VgIdentifierTransform, VgLookupTransform } from '../../vega.schema';
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
export declare class LookupNode extends DataFlowNode {
    readonly transform: LookupTransform;
    readonly secondary: string;
    constructor(transform: LookupTransform, secondary: string);
    static make(model: Model, transform: LookupTransform, counter: number): LookupNode;
    producedFields(): StringSet;
    assemble(): VgLookupTransform;
}
export declare class IdentifierNode extends DataFlowNode {
    clone(): IdentifierNode;
    constructor();
    producedFields(): {
        [x: string]: boolean;
    };
    assemble(): VgIdentifierTransform;
}
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
export declare function parseTransformArray(model: Model): {
    first: DataFlowNode;
    last: DataFlowNode;
};
