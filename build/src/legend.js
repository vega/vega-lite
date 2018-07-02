import * as tslib_1 from "tslib";
import { flagKeys } from './util';
export var defaultLegendConfig = {};
var COMMON_LEGEND_PROPERTY_INDEX = {
    entryPadding: 1,
    format: 1,
    offset: 1,
    orient: 1,
    padding: 1,
    tickCount: 1,
    title: 1,
    type: 1,
    values: 1,
    zindex: 1
};
var VG_LEGEND_PROPERTY_INDEX = tslib_1.__assign({}, COMMON_LEGEND_PROPERTY_INDEX, { 
    // channel scales
    opacity: 1, shape: 1, stroke: 1, fill: 1, size: 1, 
    // encode
    encode: 1 });
export var LEGEND_PROPERTIES = flagKeys(COMMON_LEGEND_PROPERTY_INDEX);
export var VG_LEGEND_PROPERTIES = flagKeys(VG_LEGEND_PROPERTY_INDEX);
//# sourceMappingURL=legend.js.map