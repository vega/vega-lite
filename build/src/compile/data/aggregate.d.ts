import { AggregateOp } from 'vega';
import { AggregateTransform } from '../../transform';
import { Dict, StringSet } from '../../util';
import { VgAggregateTransform } from '../../vega.schema';
import { UnitModel } from '../unit';
import { DataFlowNode, TransformNode } from './dataflow';
export declare class AggregateNode extends TransformNode {
    private dimensions;
    private measures;
    clone(): AggregateNode;
    /**
     * @param dimensions string set for dimensions
     * @param measures dictionary mapping field name => dict of aggregation functions and names to use
     */
    constructor(parent: DataFlowNode, dimensions: StringSet, measures: Dict<{
        [key in AggregateOp]?: string;
    }>);
    static makeFromEncoding(parent: DataFlowNode, model: UnitModel): AggregateNode;
    static makeFromTransform(parent: DataFlowNode, t: AggregateTransform): AggregateNode;
    merge(other: AggregateNode): void;
    addDimensions(fields: string[]): void;
    dependentFields(): {};
    producedFields(): {};
    hash(): string;
    assemble(): VgAggregateTransform;
}
