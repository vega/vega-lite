import * as tslib_1 from "tslib";
import { flagKeys } from './util';
export var AXIS_PARTS = ['domain', 'grid', 'labels', 'ticks', 'title'];
/**
 * A dictionary listing whether a certain axis property is applicable for only main axes or only grid axes.
 * (Properties not listed are applicable for both)
 */
export var AXIS_PROPERTY_TYPE = {
    grid: 'grid',
    gridScale: 'grid',
    domain: 'main',
    labels: 'main',
    labelFlush: 'main',
    labelOverlap: 'main',
    minExtent: 'main',
    maxExtent: 'main',
    offset: 'main',
    ticks: 'main',
    title: 'main',
    values: 'both',
    scale: 'both',
    zindex: 'both' // this is actually set afterward, so it doesn't matter
};
var COMMON_AXIS_PROPERTIES_INDEX = {
    orient: 1,
    domain: 1,
    format: 1,
    grid: 1,
    labelBound: 1,
    labelFlush: 1,
    labelPadding: 1,
    labels: 1,
    labelOverlap: 1,
    maxExtent: 1,
    minExtent: 1,
    offset: 1,
    position: 1,
    tickCount: 1,
    ticks: 1,
    tickSize: 1,
    title: 1,
    titlePadding: 1,
    values: 1,
    zindex: 1,
};
var AXIS_PROPERTIES_INDEX = tslib_1.__assign({}, COMMON_AXIS_PROPERTIES_INDEX, { encoding: 1, labelAngle: 1, titleMaxLength: 1 });
var VG_AXIS_PROPERTIES_INDEX = tslib_1.__assign({ scale: 1 }, COMMON_AXIS_PROPERTIES_INDEX, { gridScale: 1, encode: 1 });
export function isAxisProperty(prop) {
    return !!AXIS_PROPERTIES_INDEX[prop];
}
export var VG_AXIS_PROPERTIES = flagKeys(VG_AXIS_PROPERTIES_INDEX);
// Export for dependent projects
export var AXIS_PROPERTIES = flagKeys(AXIS_PROPERTIES_INDEX);
//# sourceMappingURL=axis.js.map