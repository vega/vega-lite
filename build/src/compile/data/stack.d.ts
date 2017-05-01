import { StackOffset } from '../../stack';
import { VgSort, VgTransform } from '../../vega.schema';
import { UnitModel } from './../unit';
import { DataFlowNode } from './dataflow';
export interface StackComponent {
    /**
     * Grouping fields for stacked charts.  This includes one of x- or 'y-field and may include faceted field.
     */
    groupby: string[];
    /**
     * Stack measure's field
     */
    field: string;
    /**
     * Level of detail fields for each level in the stacked charts such as color or detail.
     */
    stackby: string[];
    /**
     * Field that determines order of levels in the stacked charts.
     */
    sort: VgSort;
    /** Mode for stacking marks. */
    offset: StackOffset;
    /**
     * Whether to impute the data before stacking.
     */
    impute: boolean;
}
export declare class StackNode extends DataFlowNode {
    private _stack;
    clone(): StackNode;
    constructor(stack: StackComponent);
    static make(model: UnitModel): StackNode;
    readonly stack: StackComponent;
    addDimensions(fields: string[]): void;
    dependentFields(): {};
    producedFields(): {};
    assemble(): VgTransform[];
}
