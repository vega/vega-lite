import { keys } from './util';
/**
 * Data type based on level of measurement
 */
export const Type = {
    quantitative: 'quantitative',
    ordinal: 'ordinal',
    temporal: 'temporal',
    nominal: 'nominal',
    geojson: 'geojson'
};
export function isType(t) {
    return t in Type;
}
export function isContinuous(type) {
    return type === 'quantitative' || type === 'temporal';
}
export function isDiscrete(type) {
    return type === 'ordinal' || type === 'nominal';
}
export const QUANTITATIVE = Type.quantitative;
export const ORDINAL = Type.ordinal;
export const TEMPORAL = Type.temporal;
export const NOMINAL = Type.nominal;
export const GEOJSON = Type.geojson;
export const TYPES = keys(Type);
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