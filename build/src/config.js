"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var compositemark_1 = require("./compositemark");
var index_1 = require("./compositemark/index");
var guide_1 = require("./guide");
var legend_1 = require("./legend");
var mark_1 = require("./mark");
var mark = require("./mark");
var scale_1 = require("./scale");
var selection_1 = require("./selection");
var util_1 = require("./util");
exports.defaultCellConfig = {
    width: 200,
    height: 200,
    fill: 'transparent'
};
exports.defaultFacetCellConfig = {
    stroke: '#ccc',
    strokeWidth: 1
};
exports.defaultFacetConfig = {
    cell: exports.defaultFacetCellConfig
};
exports.defaultOverlayConfig = {
    line: false
};
exports.defaultConfig = {
    padding: 5,
    numberFormat: 's',
    timeFormat: '%b %d, %Y',
    countTitle: 'Number of Records',
    cell: exports.defaultCellConfig,
    mark: mark.defaultMarkConfig,
    area: {},
    bar: mark.defaultBarConfig,
    circle: {},
    line: {},
    point: {},
    rect: {},
    rule: {},
    square: {},
    text: mark.defaultTextConfig,
    tick: mark.defaultTickConfig,
    box: { size: 14 },
    boxWhisker: {},
    boxMid: {},
    overlay: exports.defaultOverlayConfig,
    scale: scale_1.defaultScaleConfig,
    axis: {},
    axisX: {},
    axisY: {},
    axisLeft: {},
    axisRight: {},
    axisTop: {},
    axisBottom: {},
    axisBand: {},
    legend: legend_1.defaultLegendConfig,
    facet: exports.defaultFacetConfig,
    selection: selection_1.defaultConfig,
};
function initConfig(config) {
    return util_1.mergeDeep(util_1.duplicate(exports.defaultConfig), config);
}
exports.initConfig = initConfig;
var MARK_ROLES = [].concat(mark_1.PRIMITIVE_MARKS, compositemark_1.COMPOSITE_MARK_ROLES);
var VL_ONLY_CONFIG_PROPERTIES = ['padding', 'numberFormat', 'timeFormat', 'countTitle', 'cell', 'stack', 'overlay', 'scale', 'facet', 'selection', 'filterInvalid'];
var VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = tslib_1.__assign({}, mark_1.VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX, index_1.VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX);
function stripConfig(config) {
    config = util_1.duplicate(config);
    for (var _i = 0, VL_ONLY_CONFIG_PROPERTIES_1 = VL_ONLY_CONFIG_PROPERTIES; _i < VL_ONLY_CONFIG_PROPERTIES_1.length; _i++) {
        var prop = VL_ONLY_CONFIG_PROPERTIES_1[_i];
        delete config[prop];
    }
    // Remove Vega-Lite only axis/legend config
    if (config.axis) {
        for (var _a = 0, VL_ONLY_GUIDE_CONFIG_1 = guide_1.VL_ONLY_GUIDE_CONFIG; _a < VL_ONLY_GUIDE_CONFIG_1.length; _a++) {
            var prop = VL_ONLY_GUIDE_CONFIG_1[_a];
            delete config.axis[prop];
        }
    }
    if (config.legend) {
        for (var _b = 0, VL_ONLY_GUIDE_CONFIG_2 = guide_1.VL_ONLY_GUIDE_CONFIG; _b < VL_ONLY_GUIDE_CONFIG_2.length; _b++) {
            var prop = VL_ONLY_GUIDE_CONFIG_2[_b];
            delete config.legend[prop];
        }
    }
    // Remove Vega-Lite only generic mark config
    if (config.mark) {
        for (var _c = 0, _d = mark.VL_ONLY_MARK_CONFIG_PROPERTIES; _c < _d.length; _c++) {
            var prop = _d[_c];
            delete config.mark[prop];
        }
    }
    // Remove Vega-Lite Mark/Role config
    for (var _e = 0, MARK_ROLES_1 = MARK_ROLES; _e < MARK_ROLES_1.length; _e++) {
        var role = MARK_ROLES_1[_e];
        for (var _f = 0, _g = mark.VL_ONLY_MARK_CONFIG_PROPERTIES; _f < _g.length; _f++) {
            var prop = _g[_f];
            delete config[role][prop];
        }
        var vlOnlyMarkSpecificConfigs = VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX[role];
        if (vlOnlyMarkSpecificConfigs) {
            for (var _h = 0, vlOnlyMarkSpecificConfigs_1 = vlOnlyMarkSpecificConfigs; _h < vlOnlyMarkSpecificConfigs_1.length; _h++) {
                var prop = vlOnlyMarkSpecificConfigs_1[_h];
                delete config[role][prop];
            }
        }
    }
    // Remove empty config objects
    for (var prop in config) {
        if (util_1.isObject(config[prop]) && util_1.keys(config[prop]).length === 0) {
            delete config[prop];
        }
    }
    return util_1.keys(config).length > 0 ? config : undefined;
}
exports.stripConfig = stripConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpREFBb0U7QUFDcEUsK0NBQXVIO0FBQ3ZILGlDQUE2QztBQUM3QyxtQ0FBMkQ7QUFDM0QsK0JBQTJKO0FBQzNKLDZCQUErQjtBQUMvQixpQ0FBd0Q7QUFDeEQseUNBQXFGO0FBR3JGLCtCQUE0RDtBQW1GL0MsUUFBQSxpQkFBaUIsR0FBZTtJQUMzQyxLQUFLLEVBQUUsR0FBRztJQUNWLE1BQU0sRUFBRSxHQUFHO0lBQ1gsSUFBSSxFQUFFLGFBQWE7Q0FDcEIsQ0FBQztBQUVXLFFBQUEsc0JBQXNCLEdBQWU7SUFDaEQsTUFBTSxFQUFFLE1BQU07SUFDZCxXQUFXLEVBQUUsQ0FBQztDQUNmLENBQUM7QUFRVyxRQUFBLGtCQUFrQixHQUFnQjtJQUM3QyxJQUFJLEVBQUUsOEJBQXNCO0NBQzdCLENBQUM7QUFrQlcsUUFBQSxvQkFBb0IsR0FBa0I7SUFDakQsSUFBSSxFQUFFLEtBQUs7Q0FDWixDQUFDO0FBbUZXLFFBQUEsYUFBYSxHQUFXO0lBQ25DLE9BQU8sRUFBRSxDQUFDO0lBQ1YsWUFBWSxFQUFFLEdBQUc7SUFDakIsVUFBVSxFQUFFLFdBQVc7SUFDdkIsVUFBVSxFQUFFLG1CQUFtQjtJQUUvQixJQUFJLEVBQUUseUJBQWlCO0lBRXZCLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCO0lBQzVCLElBQUksRUFBRSxFQUFFO0lBQ1IsR0FBRyxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7SUFDMUIsTUFBTSxFQUFFLEVBQUU7SUFDVixJQUFJLEVBQUUsRUFBRTtJQUNSLEtBQUssRUFBRSxFQUFFO0lBQ1QsSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUUsRUFBRTtJQUNSLE1BQU0sRUFBRSxFQUFFO0lBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7SUFDNUIsSUFBSSxFQUFFLElBQUksQ0FBQyxp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