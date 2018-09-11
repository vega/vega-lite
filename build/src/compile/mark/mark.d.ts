import { Encoding } from '../../encoding';
import { Mark } from '../../mark';
import { UnitModel } from '../unit';
export declare function parseMarkGroup(model: UnitModel): any[];
export declare function getSort(model: UnitModel): {
    field: string;
    order?: import("vega-util").Order;
} | {
    field: string[];
    order?: import("vega-util").Order[];
} | {
    field: string;
    order: string;
};
/**
 * Returns list of path grouping fields
 * that the model's spec contains.
 */
export declare function pathGroupingFields(mark: Mark, encoding: Encoding<string>): string[];
