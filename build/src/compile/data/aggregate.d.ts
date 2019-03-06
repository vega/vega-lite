import { AggregateOp } from 'vega';
import { AggregateTransform } from '../../transform';
import { Dict } from '../../util';
import { VgAggregateTransform } from '../../vega.schema';
import { UnitModel } from '../unit';
import { DataFlowNode } from './dataflow';
declare type Measures = Dict<{
    [key in AggregateOp]?: Set<string>;
}>;
export declare class AggregateNode extends DataFlowNode {
    private dimensions;
    private measures;
    clone(): AggregateNode;
    /**
     * @param dimensions string set for dimensions
     * @param measures dictionary mapping field name => dict of aggregation functions and names to use
     */
    constructor(parent: DataFlowNode, dimensions: Set<string>, measures: Measures);
    readonly groupBy: Set<string>;
    static makeFromEncoding(parent: DataFlowNode, model: UnitModel): AggregateNode;
    static makeFromTransform(parent: DataFlowNode, t: AggregateTransform): AggregateNode;
    merge(other: AggregateNode): boolean;
    addDimensions(fields: string[]): void;
    dependentFields(): Set<string>;
    producedFields(): Set<string>;
    hash(): string;
    assemble(): VgAggregateTransform;
}
export {};
