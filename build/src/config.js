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
    fill: 'transparent',
    stroke: '#ccc'
};
exports.defaultConfig = {
    padding: 5,
    timeFormat: '%b %d, %Y',
    countTitle: 'Number of Records',
    invalidValues: 'filter',
    cell: exports.defaultCellConfig,
    mark: mark.defaultMarkConfig,
    area: {},
    bar: mark.defaultBarConfig,
    circle: {},
    line: {},
    point: {},
    rect: {},
    rule: { color: 'black' },
    square: {},
    text: { color: 'black' },
    tick: mark.defaultTickConfig,
    box: { size: 14 },
    boxWhisker: {},
    boxMid: { color: 'white' },
    scale: scale_1.defaultScaleConfig,
    axis: {
        minExtent: 30,
        domainColor: '#888',
        tickColor: '#888'
    },
    axisX: {},
    axisY: {},
    axisLeft: {},
    axisRight: {},
    axisTop: {},
    axisBottom: {},
    axisBand: {},
    legend: legend_1.defaultLegendConfig,
    selection: selection_1.defaultConfig,
    title: {},
};
function initConfig(config) {
    return util_1.mergeDeep(util_1.duplicate(exports.defaultConfig), config);
}
exports.initConfig = initConfig;
var MARK_ROLES = [].concat(mark_1.PRIMITIVE_MARKS, compositemark_1.COMPOSITE_MARK_ROLES);
var VL_ONLY_CONFIG_PROPERTIES = ['padding', 'numberFormat', 'timeFormat', 'countTitle', 'cell', 'stack', 'overlay', 'scale', 'selection', 'invalidValues'];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpREFBb0U7QUFDcEUsK0NBQXVIO0FBQ3ZILGlDQUE2QztBQUM3QyxtQ0FBMkQ7QUFDM0QsK0JBQTJKO0FBQzNKLDZCQUErQjtBQUMvQixpQ0FBd0Q7QUFDeEQseUNBQXFGO0FBR3JGLCtCQUE0RDtBQW9GL0MsUUFBQSxpQkFBaUIsR0FBZTtJQUMzQyxLQUFLLEVBQUUsR0FBRztJQUNWLE1BQU0sRUFBRSxHQUFHO0lBQ1gsSUFBSSxFQUFFLGFBQWE7SUFDbkIsTUFBTSxFQUFFLE1BQU07Q0FDZixDQUFDO0FBMkVXLFFBQUEsYUFBYSxHQUFXO0lBQ25DLE9BQU8sRUFBRSxDQUFDO0lBQ1YsVUFBVSxFQUFFLFdBQVc7SUFDdkIsVUFBVSxFQUFFLG1CQUFtQjtJQUUvQixhQUFhLEVBQUUsUUFBUTtJQUV2QixJQUFJLEVBQUUseUJBQWlCO0lBRXZCLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCO0lBQzVCLElBQUksRUFBRSxFQUFFO0lBQ1IsR0FBRyxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7SUFDMUIsTUFBTSxFQUFFLEVBQUU7SUFDVixJQUFJLEVBQUUsRUFBRTtJQUNSLEtBQUssRUFBRSxFQUFFO0lBQ1QsSUFBSSxFQUFFLEVBQUU7SUFDUixJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDO0lBQ3RCLE1BQU0sRUFBRSxFQUFFO0lBQ1YsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQztJQUN0QixJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtJQUU1QixHQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsRUFBRSxFQUFDO0lBQ2YsVUFBVSxFQUFFLEVBQUU7SUFDZCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDO0lBRXhCLEtBQUssRUFBRSwwQkFBa0I7SUFDekIs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