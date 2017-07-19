"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axis_1 = require("./axis");
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
    axis: axis_1.DEFAULT_AXIS_CONFIG,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBeUU7QUFDekUsaURBQW9FO0FBQ3BFLCtDQUF1SDtBQUN2SCxpQ0FBNkM7QUFDN0MsbUNBQTJEO0FBQzNELCtCQUEySjtBQUMzSiw2QkFBK0I7QUFDL0IsaUNBQXdEO0FBQ3hELHlDQUFxRjtBQUdyRiwrQkFBNEQ7QUFvRi9DLFFBQUEsaUJBQWlCLEdBQWU7SUFDM0MsS0FBSyxFQUFFLEdBQUc7SUFDVixNQUFNLEVBQUUsR0FBRztJQUNYLElBQUksRUFBRSxhQUFhO0lBQ25CLE1BQU0sRUFBRSxNQUFNO0NBQ2YsQ0FBQztBQTJFVyxRQUFBLGFBQWEsR0FBVztJQUNuQyxPQUFPLEVBQUUsQ0FBQztJQUNWLFVBQVUsRUFBRSxXQUFXO0lBQ3ZCLFVBQVUsRUFBRSxtQkFBbUI7SUFFL0IsYUFBYSxFQUFFLFFBQVE7SUFFdkIsSUFBSSxFQUFFLHlCQUFpQjtJQUV2QixJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtJQUM1QixJQUFJLEVBQUUsRUFBRTtJQUNSLEdBQUcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO0lBQzFCLE1BQU0sRUFBRSxFQUFFO0lBQ1YsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUUsRUFBRTtJQUNULElBQUksRUFBRSxFQUFFO0lBQ1IsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQztJQUN0QixNQUFNLEVBQUUsRUFBRTtJQUNWLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUM7SUFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7SUFFNUIsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBQztJQUNmLFVBQVUsRUFBRSxFQUFFO0lBQ2QsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQztJQUV4QixLQUFLLEVBQUUs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