import { Filter } from './filter';
export interface FilterTransform {
    /**
     * A string containing the filter Vega expression. Use `datum` to refer to the current data object.
     */
    filter: Filter | Filter[];
}
export declare function isFilter(t: Transform): t is FilterTransform;
export interface CalculateTransform {
    /**
     * A string containing a Vega Expression. Use the variable `datum` to to refer to the current data object.
     */
    calculate: string;
    /**
     * The field for storing the computed formula value.
     */
    as: string;
}
export declare function isCalculate(t: Transform): t is CalculateTransform;
export declare type Transform = FilterTransform | CalculateTransform;
