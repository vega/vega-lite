import { DataComponentCompiler } from './base';
import { StackOffset } from '../../stack';
import { VgSort } from '../../vega.schema';
export interface StackComponent {
    /**
     * Name of the output stacked data source
     */
    name: string;
    /**
     * Name of the input source data for stacked data source
     */
    source: string;
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
/**
 * Stack data compiler
 */
export declare const stack: DataComponentCompiler<StackComponent>;
