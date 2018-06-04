import { FieldDef } from '../../fielddef';
import { StackOffset } from '../../stack';
import { StackTransform } from '../../transform';
import { VgSort, VgTransform } from '../../vega.schema';
import { UnitModel } from './../unit';
import { DataFlowNode } from './dataflow';
export interface StackComponent {
    /**
     * Faceted field.
     */
    facetby: string[];
    dimensionFieldDef?: FieldDef<string>;
    /**
     * Stack measure's field. Used in makeFromEncoding.
     */
    stackField: string;
    /**
     * Level of detail fields for each level in the stacked charts such as color or detail.
     * Used in makeFromEncoding.
     */
    stackby?: string[];
    /**
     * Field that determines order of levels in the stacked charts.
     * Used in both but optional in transform.
     */
    sort: VgSort;
    /** Mode for stacking marks.
     */
    offset: StackOffset;
    /**
     * Whether to impute the data before stacking. Used only in makeFromEncoding.
     */
    impute?: boolean;
    /**
     * The data fields to group by.
     */
    groupby?: string[];
    /**
     * Output field names of each stack field.
     */
    as: string[];
}
export declare class StackNode extends DataFlowNode {
    private _stack;
    clone(): StackNode;
    constructor(parent: DataFlowNode, stack: StackComponent);
    static makeFromTransform(parent: DataFlowNode, stackTransform: StackTransform): StackNode;
    static makeFromEncoding(parent: DataFlowNode, model: UnitModel): StackNode;
    readonly stack: StackComponent;
    addDimensions(fields: string[]): void;
    dependentFields(): {};
    producedFields(): {};
    private getGroupbyFields;
    assemble(): VgTransform[];
}
