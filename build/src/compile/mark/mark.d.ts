import { Encoding } from '../../encoding';
import { UnitModel } from '../unit';
export declare function parseMarkGroup(model: UnitModel): any[];
export declare function getPathSort(model: UnitModel): {
    field: string;
    order?: "ascending" | "descending";
} | {
    field: string[];
    order?: ("ascending" | "descending")[];
} | {
    field: string;
    order: string;
};
/**
 * Returns list of path grouping fields
 * that the model's spec contains.
 */
export declare function pathGroupingFields(encoding: Encoding<string>): string[];
