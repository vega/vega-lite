/** Constants and utilities for data type */
/** Data type based on level of measurement */
export var Type;
(function (Type) {
    Type.QUANTITATIVE = 'quantitative';
    Type.ORDINAL = 'ordinal';
    Type.TEMPORAL = 'temporal';
    Type.NOMINAL = 'nominal';
    Type.GEOJSON = 'geojson';
})(Type || (Type = {}));
export const TYPE_INDEX = {
    quantitative: 1,
    ordinal: 1,
    temporal: 1,
    nominal: 1,
    geojson: 1
};
export function isType(t) {
    return !!TYPE_INDEX[t];
}
export const QUANTITATIVE = Type.QUANTITATIVE;
export const ORDINAL = Type.ORDINAL;
export const TEMPORAL = Type.TEMPORAL;
export const NOMINAL = Type.NOMINAL;
export const GEOJSON = Type.GEOJSON;
/**
 * Get full, lowercase type name for a given type.
 * @param  type
 * @return Full type name.
 */
export function getFullName(type) {
    if (type) {
        type = type.toLowerCase();
        switch (type) {
            case 'q':
            case QUANTITATIVE:
                return 'quantitative';
            case 't':
            case TEMPORAL:
                return 'temporal';
            case 'o':
            case ORDINAL:
                return 'ordinal';
            case 'n':
            case NOMINAL:
                return 'nominal';
            case GEOJSON:
                return 'geojson';
        }
    }
    // If we get invalid input, return undefined type.
    return undefined;
}
//# sourceMappingURL=type.js.map