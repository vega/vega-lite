import { AggregateOp, AggregateTransform as VgAggregateTransform } from 'vega';
import { AggregateTransform } from '../../transform';
import { Dict } from '../../util';
import { UnitModel } from '../unit';
import { DataFlowNode } from './dataflow';
type Measures = Dict<Partial<Record<AggregateOp, Set<string>>>>;
export declare class AggregateNode extends DataFlowNode {
    private dimensions;
    private measures;
    clone(): AggregateNode;
    /**
     * @param dimensions string set for dimensions
     * @param measures dictionary mapping field name => dict of aggregation functions and names to use
     */
    constructor(parent: DataFlowNode, dimensions: Set<string>, measures: Measures);
    get groupBy(): Set<string>;
    static makeFromEncoding(parent: DataFlowNode, model: UnitModel): AggregateNode;
    static makeFromTransform(parent: DataFlowNode, t: AggregateTransform): AggregateNode;
    merge(other: AggregateNode): boolean;
    addDimensions(fields: readonly string[]): void;
    dependentFields(): Set<string>;
    producedFields(): Set<string>;
    hash(): string;
    assemble(): VgAggregateTransform;
}
export {};
//# sourceMappingURL=aggregate.d.ts.map