import { isObject } from 'vega-util';
import { getAllCompositeMarks } from './compositemark';
import { VL_ONLY_GUIDE_CONFIG, VL_ONLY_LEGEND_CONFIG } from './guide';
import { defaultLegendConfig } from './legend';
import * as mark from './mark';
import { PRIMITIVE_MARKS, VL_ONLY_MARK_CONFIG_PROPERTIES, VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX } from './mark';
import { defaultScaleConfig } from './scale';
import { defaultConfig as defaultSelectionConfig } from './selection';
import { extractTitleConfig } from './title';
import { duplicate, keys, mergeDeep } from './util';
export const defaultViewConfig = {
    width: 200,
    height: 200
};
export function isVgScheme(rangeConfig) {
    return rangeConfig && !!rangeConfig['scheme'];
}
export const defaultConfig = {
    padding: 5,
    timeFormat: '%b %d, %Y',
    countTitle: 'Count of Records',
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
const MARK_STYLES = ['view', ...PRIMITIVE_MARKS];
const VL_ONLY_CONFIG_PROPERTIES = [
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
const VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = Object.assign({ view: ['width', 'height'] }, VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX);
export function stripAndRedirectConfig(config) {
    config = duplicate(config);
    for (const prop of VL_ONLY_CONFIG_PROPERTIES) {
        delete config[prop];
    }
    // Remove Vega-Lite only axis/legend config
    if (config.axis) {
        for (const prop of VL_ONLY_GUIDE_CONFIG) {
            delete config.axis[prop];
        }
    }
    if (config.legend) {
        for (const prop of VL_ONLY_GUIDE_CONFIG) {
            delete config.legend[prop];
        }
        for (const prop of VL_ONLY_LEGEND_CONFIG) {
            delete config.legend[prop];
        }
    }
    // Remove Vega-Lite only generic mark config
    if (config.mark) {
        for (const prop of VL_ONLY_MARK_CONFIG_PROPERTIES) {
            delete config.mark[prop];
        }
    }
    for (const markType of MARK_STYLES) {
        // Remove Vega-Lite-only mark config
        for (const prop of VL_ONLY_MARK_CONFIG_PROPERTIES) {
            delete config[markType][prop];
        }
        // Remove Vega-Lite only mark-specific config
        const vlOnlyMarkSpecificConfigs = VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX[markType];
        if (vlOnlyMarkSpecificConfigs) {
            for (const prop of vlOnlyMarkSpecificConfigs) {
                delete config[markType][prop];
            }
        }
        // Redirect mark config to config.style so that mark config only affect its own mark type
        // without affecting other marks that share the same underlying Vega marks.
        // For example, config.rect should not affect bar marks.
        redirectConfig(config, markType);
    }
    for (const m of getAllCompositeMarks()) {
        // Clean up the composite mark config as we don't need them in the output specs anymore
        delete config[m];
    }
    // Redirect config.title -- so that title config do not
    // affect header labels, which also uses `title` directive to implement.
    redirectConfig(config, 'title', 'group-title');
    // Remove empty config objects
    for (const prop in config) {
        if (isObject(config[prop]) && keys(config[prop]).length === 0) {
            delete config[prop];
        }
    }
    return keys(config).length > 0 ? config : undefined;
}
function redirectConfig(config, prop, // string = composite mark
toProp, compositeMarkPart) {
    const propConfig = prop === 'title'
        ? extractTitleConfig(config.title).mark
        : compositeMarkPart
            ? config[prop][compositeMarkPart]
            : config[prop];
    if (prop === 'view') {
        toProp = 'cell'; // View's default style is "cell"
    }
    const style = Object.assign({}, propConfig, config.style[prop]);
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