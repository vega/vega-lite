import {keys} from '../util.js';
import {CompositeMarkNormalizer} from './base.js';
import {BOXPLOT, BOXPLOT_PARTS, normalizeBoxPlot} from './boxplot.js';
import {ERRORBAND, ERRORBAND_PARTS, normalizeErrorBand} from './errorband.js';
import {ERRORBAR, ERRORBAR_PARTS, normalizeErrorBar} from './errorbar.js';
/**
 * Registry index for all composite mark's normalizer
 */
const compositeMarkRegistry = {};
export function add(mark, run, parts) {
  const normalizer = new CompositeMarkNormalizer(mark, run);
  compositeMarkRegistry[mark] = {normalizer, parts};
}
export function remove(mark) {
  delete compositeMarkRegistry[mark];
}
export function getAllCompositeMarks() {
  return keys(compositeMarkRegistry);
}
add(BOXPLOT, normalizeBoxPlot, BOXPLOT_PARTS);
add(ERRORBAR, normalizeErrorBar, ERRORBAR_PARTS);
add(ERRORBAND, normalizeErrorBand, ERRORBAND_PARTS);
//# sourceMappingURL=index.js.map
