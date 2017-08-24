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
var title_1 = require("./title");
var util_1 = require("./util");
exports.defaultCellConfig = {
    width: 200,
    height: 200
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
        domainColor: '#888',
        tickColor: '#888'
    },
    axisX: {},
    axisY: { minExtent: 30 },
    axisLeft: {},
    axisRight: {},
    axisTop: {},
    axisBottom: {},
    axisBand: {},
    legend: legend_1.defaultLegendConfig,
    selection: selection_1.defaultConfig,
    style: {},
    title: {},
};
function initConfig(config) {
    return util_1.mergeDeep(util_1.duplicate(exports.defaultConfig), config);
}
exports.initConfig = initConfig;
var MARK_STYLES = ['cell'].concat(mark_1.PRIMITIVE_MARKS, compositemark_1.COMPOSITE_MARK_STYLES);
var VL_ONLY_CONFIG_PROPERTIES = [
    'padding', 'numberFormat', 'timeFormat', 'countTitle',
    'stack', 'scale', 'selection', 'invalidValues',
    'overlay' // FIXME: Redesign and unhide this
];
var VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = tslib_1.__assign({ cell: ['width', 'height'] }, mark_1.VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX, index_1.VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX);
function stripAndRedirectConfig(config) {
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
        for (var _c = 0, VL_ONLY_MARK_CONFIG_PROPERTIES_1 = mark_1.VL_ONLY_MARK_CONFIG_PROPERTIES; _c < VL_ONLY_MARK_CONFIG_PROPERTIES_1.length; _c++) {
            var prop = VL_ONLY_MARK_CONFIG_PROPERTIES_1[_c];
            delete config.mark[prop];
        }
    }
    for (var _d = 0, MARK_STYLES_1 = MARK_STYLES; _d < MARK_STYLES_1.length; _d++) {
        var mark_2 = MARK_STYLES_1[_d];
        // Remove Vega-Lite-only mark config
        for (var _e = 0, VL_ONLY_MARK_CONFIG_PROPERTIES_2 = mark_1.VL_ONLY_MARK_CONFIG_PROPERTIES; _e < VL_ONLY_MARK_CONFIG_PROPERTIES_2.length; _e++) {
            var prop = VL_ONLY_MARK_CONFIG_PROPERTIES_2[_e];
            delete config[mark_2][prop];
        }
        // Remove Vega-Lite only mark-specific config
        var vlOnlyMarkSpecificConfigs = VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX[mark_2];
        if (vlOnlyMarkSpecificConfigs) {
            for (var _f = 0, vlOnlyMarkSpecificConfigs_1 = vlOnlyMarkSpecificConfigs; _f < vlOnlyMarkSpecificConfigs_1.length; _f++) {
                var prop = vlOnlyMarkSpecificConfigs_1[_f];
                delete config[mark_2][prop];
            }
        }
        // Redirect mark config to config.style so that mark config only affect its own mark type
        // without affecting other marks that share the same underlying Vega marks.
        // For example, config.rect should not affect bar marks.
        redirectConfig(config, mark_2);
    }
    // Redirect config.title -- so that title config do not
    // affect header labels, which also uses `title` directive to implement.
    redirectConfig(config, 'title', 'group-title');
    // Remove empty config objects
    for (var prop in config) {
        if (util_1.isObject(config[prop]) && util_1.keys(config[prop]).length === 0) {
            delete config[prop];
        }
    }
    return util_1.keys(config).length > 0 ? config : undefined;
}
exports.stripAndRedirectConfig = stripAndRedirectConfig;
function redirectConfig(config, prop, toProp) {
    var propConfig = prop === 'title' ? title_1.extractTitleConfig(config.title).mark : config[prop];
    var style = tslib_1.__assign({}, propConfig, config.style[prop]);
    // set config.style if it is not an empty object
    if (util_1.keys(style).length > 0) {
        config.style[toProp || prop] = style;
    }
    delete config[prop];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpREFBc0Q7QUFDdEQsK0NBQTJJO0FBQzNJLGlDQUE2QztBQUM3QyxtQ0FBMkQ7QUFDM0QsK0JBQTRJO0FBQzVJLDZCQUErQjtBQUMvQixpQ0FBd0Q7QUFDeEQseUNBQXFGO0FBRXJGLGlDQUEyQztBQUUzQywrQkFBNEQ7QUFvRi9DLFFBQUEsaUJBQWlCLEdBQWU7SUFDM0MsS0FBSyxFQUFFLEdBQUc7SUFDVixNQUFNLEVBQUUsR0FBRztDQUNaLENBQUM7QUFrSVcsUUFBQSxhQUFhLEdBQVc7SUFDbkMsT0FBTyxFQUFFLENBQUM7SUFDVixVQUFVLEVBQUUsV0FBVztJQUN2QixVQUFVLEVBQUUsbUJBQW1CO0lBRS9CLGFBQWEsRUFBRSxRQUFRO0lBRXZCLElBQUksRUFBRSx5QkFBaUI7SUFFdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7SUFDNUIsSUFBSSxFQUFFLEVBQUU7SUFDUixHQUFHLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtJQUMxQixNQUFNLEVBQUUsRUFBRTtJQUNWLElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7SUFDVCxJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUM7SUFDdEIsTUFBTSxFQUFFLEVBQUU7SUFDVixJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDO0lBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCO0lBRTVCLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUM7SUFDZixVQUFVLEVBQUUsRUFBRTtJQUNkLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUM7SUFFeEIsS0FBSyxFQUFFLDBCQUFrQjtJQUN6QixJQUFJLEVBQUU7UUFDSixXQUFXLEVBQUUsTUFB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