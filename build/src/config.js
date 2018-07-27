import * as tslib_1 from "tslib";
import { isObject } from 'vega-util';
import { getAllCompositeMarks } from './compositemark';
import { VL_ONLY_GUIDE_CONFIG } from './guide';
import { defaultLegendConfig } from './legend';
import * as mark from './mark';
import { PRIMITIVE_MARKS, VL_ONLY_MARK_CONFIG_PROPERTIES, VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX } from './mark';
import { defaultScaleConfig } from './scale';
import { defaultConfig as defaultSelectionConfig } from './selection';
import { extractTitleConfig } from './title';
import { duplicate, keys, mergeDeep } from './util';
export var defaultViewConfig = {
    width: 200,
    height: 200
};
export function isVgScheme(rangeConfig) {
    return rangeConfig && !!rangeConfig['scheme'];
}
export var defaultConfig = {
    padding: 5,
    timeFormat: '%b %d, %Y',
    countTitle: 'Number of Records',
    invalidValues: 'filter',
    view: defaultViewConfig,
    mark: mark.defaultMarkConfig,
    area: {},
    bar: mark.defaultBarConfig,
    circle: {},
    geoshape: {},
    line: {},
    point: {},
    rect: {},
    rule: { color: 'black' },
    square: {},
    text: { color: 'black' },
    tick: mark.defaultTickConfig,
    trail: {},
    boxplot: {
        size: 14,
        extent: 1.5,
        box: {},
        median: { color: 'white' },
        outliers: {},
        rule: {},
        ticks: null
    },
    errorbar: {
        center: 'mean',
        rule: true,
        ticks: false
    },
    errorband: {
        band: {
            opacity: 0.3
        },
        borders: false
    },
    scale: defaultScaleConfig,
    projection: {},
    axis: {},
    axisX: {},
    axisY: { minExtent: 30 },
    axisLeft: {},
    axisRight: {},
    axisTop: {},
    axisBottom: {},
    axisBand: {},
    legend: defaultLegendConfig,
    selection: defaultSelectionConfig,
    style: {},
    title: {}
};
export function initConfig(config) {
    return mergeDeep(duplicate(defaultConfig), config);
}
var MARK_STYLES = ['view'].concat(PRIMITIVE_MARKS);
var VL_ONLY_CONFIG_PROPERTIES = [
    'padding',
    'numberFormat',
    'timeFormat',
    'countTitle',
    'stack',
    'scale',
    'selection',
    'invalidValues',
    'overlay' // FIXME: Redesign and unhide this
];
var VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = tslib_1.__assign({ view: ['width', 'height'] }, VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX);
export function stripAndRedirectConfig(config) {
    config = duplicate(config);
    for (var _i = 0, VL_ONLY_CONFIG_PROPERTIES_1 = VL_ONLY_CONFIG_PROPERTIES; _i < VL_ONLY_CONFIG_PROPERTIES_1.length; _i++) {
        var prop = VL_ONLY_CONFIG_PROPERTIES_1[_i];
        delete config[prop];
    }
    // Remove Vega-Lite only axis/legend config
    if (config.axis) {
        for (var _a = 0, VL_ONLY_GUIDE_CONFIG_1 = VL_ONLY_GUIDE_CONFIG; _a < VL_ONLY_GUIDE_CONFIG_1.length; _a++) {
            var prop = VL_ONLY_GUIDE_CONFIG_1[_a];
            delete config.axis[prop];
        }
    }
    if (config.legend) {
        for (var _b = 0, VL_ONLY_GUIDE_CONFIG_2 = VL_ONLY_GUIDE_CONFIG; _b < VL_ONLY_GUIDE_CONFIG_2.length; _b++) {
            var prop = VL_ONLY_GUIDE_CONFIG_2[_b];
            delete config.legend[prop];
        }
    }
    // Remove Vega-Lite only generic mark config
    if (config.mark) {
        for (var _c = 0, VL_ONLY_MARK_CONFIG_PROPERTIES_1 = VL_ONLY_MARK_CONFIG_PROPERTIES; _c < VL_ONLY_MARK_CONFIG_PROPERTIES_1.length; _c++) {
            var prop = VL_ONLY_MARK_CONFIG_PROPERTIES_1[_c];
            delete config.mark[prop];
        }
    }
    for (var _d = 0, MARK_STYLES_1 = MARK_STYLES; _d < MARK_STYLES_1.length; _d++) {
        var markType = MARK_STYLES_1[_d];
        // Remove Vega-Lite-only mark config
        for (var _e = 0, VL_ONLY_MARK_CONFIG_PROPERTIES_2 = VL_ONLY_MARK_CONFIG_PROPERTIES; _e < VL_ONLY_MARK_CONFIG_PROPERTIES_2.length; _e++) {
            var prop = VL_ONLY_MARK_CONFIG_PROPERTIES_2[_e];
            delete config[markType][prop];
        }
        // Remove Vega-Lite only mark-specific config
        var vlOnlyMarkSpecificConfigs = VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX[markType];
        if (vlOnlyMarkSpecificConfigs) {
            for (var _f = 0, vlOnlyMarkSpecificConfigs_1 = vlOnlyMarkSpecificConfigs; _f < vlOnlyMarkSpecificConfigs_1.length; _f++) {
                var prop = vlOnlyMarkSpecificConfigs_1[_f];
                delete config[markType][prop];
            }
        }
        // Redirect mark config to config.style so that mark config only affect its own mark type
        // without affecting other marks that share the same underlying Vega marks.
        // For example, config.rect should not affect bar marks.
        redirectConfig(config, markType);
    }
    for (var _g = 0, _h = getAllCompositeMarks(); _g < _h.length; _g++) {
        var m = _h[_g];
        // Clean up the composite mark config as we don't need them in the output specs anymore
        delete config[m];
    }
    // Redirect config.title -- so that title config do not
    // affect header labels, which also uses `title` directive to implement.
    redirectConfig(config, 'title', 'group-title');
    // Remove empty config objects
    for (var prop in config) {
        if (isObject(config[prop]) && keys(config[prop]).length === 0) {
            delete config[prop];
        }
    }
    return keys(config).length > 0 ? config : undefined;
}
function redirectConfig(config, prop, // string = composite mark
toProp, compositeMarkPart) {
    var propConfig = prop === 'title'
        ? extractTitleConfig(config.title).mark
        : compositeMarkPart
            ? config[prop][compositeMarkPart]
            : config[prop];
    if (prop === 'view') {
        toProp = 'cell'; // View's default style is "cell"
    }
    var style = tslib_1.__assign({}, propConfig, config.style[prop]);
    // set config.style if it is not an empty object
    if (keys(style).length > 0) {
        config.style[toProp || prop] = style;
    }
    if (!compositeMarkPart) {
        // For composite mark, so don't delete the whole config yet as we have to do multiple redirections.
        delete config[prop];
    }
}
//# sourceMappingURL=config.js.map