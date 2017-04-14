/** Constants and utilities for data type */
/** Data type based on level of measurement */
export declare namespace Type {
    const QUANTITATIVE: 'quantitative';
    const ORDINAL: 'ordinal';
    const TEMPORAL: 'temporal';
    const NOMINAL: 'nominal';
}
export declare type Type = typeof Type.QUANTITATIVE | typeof Type.ORDINAL | typeof Type.TEMPORAL | typeof Type.NOMINAL;
export declare const QUANTITATIVE: "quantitative";
export declare const ORDINAL: "ordinal";
export declare const TEMPORAL: "temporal";
export declare const NOMINAL: "nominal";
/**
 * Get full, lowercase type name for a given type.
 * @param  type
 * @return Full type name.
 */
export declare function getFullName(type: Type | string): Type;
