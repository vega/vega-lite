import { Dict, StringSet } from '../../util';
import { VgAggregateTransform } from '../../vega.schema';
import { UnitModel } from './../unit';
import { DataFlowNode } from './dataflow';
export declare class AggregateNode extends DataFlowNode {
    private dimensions;
    private measures;
    clone(): AggregateNode;
    /**
     * @param dimensions string set for dimensions
     * @param measures dictionary mapping field name => dict set of aggregation functions
     */
    constructor(dimensions: StringSet, measures: Dict<StringSet>);
    static make(model: UnitModel): AggregateNode;
    merge(other: AggregateNode): void;
    addDimensions(fields: string[]): void;
    dependentFields(): {};
    producedFields(): {};
    assemble(): VgAggregateTransform;
}
