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
    title: {},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpREFBb0U7QUFDcEUsK0NBQXVIO0FBQ3ZILGlDQUE2QztBQUM3QyxtQ0FBMkQ7QUFDM0QsK0JBQTJKO0FBQzNKLDZCQUErQjtBQUMvQixpQ0FBd0Q7QUFDeEQseUNBQXFGO0FBR3JGLCtCQUE0RDtBQW1GL0MsUUFBQSxpQkFBaUIsR0FBZTtJQUMzQyxLQUFLLEVBQUUsR0FBRztJQUNWLE1BQU0sRUFBRSxHQUFHO0lBQ1gsSUFBSSxFQUFFLGFBQWE7Q0FDcEIsQ0FBQztBQUVXLFFBQUEsc0JBQXNCLEdBQWU7SUFDaEQsTUFBTSxFQUFFLE1BQU07SUFDZCxXQUFXLEVBQUUsQ0FBQztDQUNmLENBQUM7QUFRVyxRQUFBLGtCQUFrQixHQUFnQjtJQUM3QyxJQUFJLEVBQUUsOEJBQXNCO0NBQzdCLENBQUM7QUFrQlcsUUFBQSxvQkFBb0IsR0FBa0I7SUFDakQsSUFBSSxFQUFFLEtBQUs7Q0FDWixDQUFDO0FBc0ZXLFFBQUEsYUFBYSxHQUFXO0lBQ25DLE9BQU8sRUFBRSxDQUFDO0lBQ1YsWUFBWSxFQUFFLEdBQUc7SUFDakIsVUFBVSxFQUFFLFdBQVc7SUFDdkIsVUFBVSxFQUFFLG1CQUFtQjtJQUUvQixJQUFJLEVBQUUseUJBQWlCO0lBRXZCLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCO0lBQzVCLElBQUksRUFBRSxFQUFFO0lBQ1IsR0FBRyxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7SUFDMUIsTUFBTSxFQUFFLEVBQUU7SUFDVixJQUFJLEVBQUUsRUFBRTtJQUNSLEtBQUssRUFBRSxFQUFFO0lBQ1QsSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUUsRUFBRTtJQUNSLE1BQU0sRUFBRSxFQUFFO0lBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7SUFDNUIsSUFBSSxFQUFFLElBQUksQ0FBQyxp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