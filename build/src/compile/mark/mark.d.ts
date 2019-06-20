import { Encoding } from '../../encoding';
import { Mark } from '../../mark';
import { UnitModel } from '../unit';
export declare function parseMarkGroup(model: UnitModel): any[];
export declare function getSort(model: UnitModel): {
    field: string;
    order?: import("../../../../../../../../Users/domoritz/Developer/UW/vega-lite-2/node_modules/vega-typings/node_modules/vega-util").Order;
} | {
    field: string[];
    order?: import("../../../../../../../../Users/domoritz/Developer/UW/vega-lite-2/node_modules/vega-typings/node_modules/vega-util").Order[];
} | {
    field: string;
    order: string;
};
/**
 * Returns list of path grouping fields
 * that the model's spec contains.
 */
export declare function pathGroupingFields(mark: Mark, encoding: Encoding<string>): string[];
