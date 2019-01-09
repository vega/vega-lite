import { Encoding } from '../../encoding';
import { Mark } from '../../mark';
import { VgCompare } from '../../vega.schema';
import { UnitModel } from '../unit';
export declare function parseMarkGroup(model: UnitModel): any[];
export declare function getSort(model: UnitModel): VgCompare;
/**
 * Returns list of path grouping fields
 * that the model's spec contains.
 */
export declare function pathGroupingFields(mark: Mark, encoding: Encoding<string>): string[];
