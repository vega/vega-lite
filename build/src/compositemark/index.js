import { isMarkDef } from '../mark';
import { keys } from '../util';
import { BOXPLOT, BOXPLOT_PARTS, normalizeBoxPlot } from './boxplot';
import { ERRORBAND, ERRORBAND_PARTS, normalizeErrorBand } from './errorband';
import { ERRORBAR, ERRORBAR_PARTS, normalizeErrorBar } from './errorbar';
/**
 * Registry index for all composite mark's normalizer
 */
const compositeMarkRegistry = {};
export function add(mark, normalizer, parts) {
    compositeMarkRegistry[mark] = { normalizer, parts };
}
export function remove(mark) {
    delete compositeMarkRegistry[mark];
}
export function getAllCompositeMarks() {
    return keys(compositeMarkRegistry);
}
export function getCompositeMarkParts(mark) {
    if (mark in compositeMarkRegistry) {
        return compositeMarkRegistry[mark].parts;
    }
    throw new Error(`Unregistered composite mark ${mark}`);
}
add(BOXPLOT, normalizeBoxPlot, BOXPLOT_PARTS);
add(ERRORBAR, normalizeErrorBar, ERRORBAR_PARTS);
add(ERRORBAND, normalizeErrorBand, ERRORBAND_PARTS);
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export function normalize(
// This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
spec, config) {
    const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    if (mark in compositeMarkRegistry) {
        const { normalizer } = compositeMarkRegistry[mark];
        return normalizer(spec, config);
    }
    throw new Error(`Invalid mark type "${mark}"`);
}
//# sourceMappingURL=index.js.map