import { writeConfig } from 'vega';
import { isObject, mergeConfig } from 'vega-util';
import { AXIS_CONFIGS, isConditionalAxisValue } from './axis';
import { signalOrValueRefWithCondition, signalRefOrValue } from './compile/common';
import { getAllCompositeMarks } from './compositemark';
import { replaceExprRef } from './expr';
import { VL_ONLY_LEGEND_CONFIG } from './guide';
import { HEADER_CONFIGS } from './header';
import { defaultLegendConfig } from './legend';
import * as mark from './mark';
import { MARK_CONFIGS, PRIMITIVE_MARKS, VL_ONLY_MARK_CONFIG_PROPERTIES, VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX } from './mark';
import { assembleParameterSignals } from './parameter';
import { defaultScaleConfig } from './scale';
import { defaultConfig as defaultSelectionConfig } from './selection';
import { DEFAULT_SPACING, isStep } from './spec/base';
import { extractTitleConfig } from './title';
import { duplicate, getFirstDefined, isEmpty, keys, omit } from './util';
export function getViewConfigContinuousSize(viewConfig, channel) {
    return viewConfig[channel] ?? viewConfig[channel === 'width' ? 'continuousWidth' : 'continuousHeight']; // get width/height for backwards compatibility
}
export function getViewConfigDiscreteStep(viewConfig, channel) {
    const size = getViewConfigDiscreteSize(viewConfig, channel);
    return isStep(size) ? size.step : DEFAULT_STEP;
}
export function getViewConfigDiscreteSize(viewConfig, channel) {
    const size = viewConfig[channel] ?? viewConfig[channel === 'width' ? 'discreteWidth' : 'discreteHeight']; // get width/height for backwards compatibility
    return getFirstDefined(size, { step: viewConfig.step });
}
export const DEFAULT_STEP = 20;
export const defaultViewConfig = {
    continuousWidth: 200,
    continuousHeight: 200,
    step: DEFAULT_STEP
};
export function isVgScheme(rangeScheme) {
    return rangeScheme && !!rangeScheme['scheme'];
}
export const defaultConfig = {
    background: 'white',
    padding: 5,
    timeFormat: '%b %d, %Y',
    countTitle: 'Count of Records',
    view: defaultViewConfig,
    mark: mark.defaultMarkConfig,
    arc: {},
    area: {},
    bar: mark.defaultBarConfig,
    circle: {},
    geoshape: {},
    image: {},
    line: {},
    point: {},
    rect: mark.defaultRectConfig,
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
    legend: defaultLegendConfig,
    header: { titlePadding: 10, labelPadding: 10 },
    headerColumn: {},
    headerRow: {},
    headerFacet: {},
    selection: defaultSelectionConfig,
    style: {},
    title: {},
    facet: { spacing: DEFAULT_SPACING },
    concat: { spacing: DEFAULT_SPACING },
    normalizedNumberFormat: '.0%'
};
// Tableau10 color palette, copied from `vegaScale.scheme('tableau10')`
const tab10 = [
    '#4c78a8',
    '#f58518',
    '#e45756',
    '#72b7b2',
    '#54a24b',
    '#eeca3b',
    '#b279a2',
    '#ff9da6',
    '#9d755d',
    '#bab0ac'
];
export const DEFAULT_FONT_SIZE = {
    text: 11,
    guideLabel: 10,
    guideTitle: 11,
    groupTitle: 13,
    groupSubtitle: 12
};
export const DEFAULT_COLOR = {
    blue: tab10[0],
    orange: tab10[1],
    red: tab10[2],
    teal: tab10[3],
    green: tab10[4],
    yellow: tab10[5],
    purple: tab10[6],
    pink: tab10[7],
    brown: tab10[8],
    gray0: '#000',
    gray1: '#111',
    gray2: '#222',
    gray3: '#333',
    gray4: '#444',
    gray5: '#555',
    gray6: '#666',
    gray7: '#777',
    gray8: '#888',
    gray9: '#999',
    gray10: '#aaa',
    gray11: '#bbb',
    gray12: '#ccc',
    gray13: '#ddd',
    gray14: '#eee',
    gray15: '#fff'
};
export function colorSignalConfig(color = {}) {
    return {
        signals: [
            {
                name: 'color',
                value: isObject(color) ? { ...DEFAULT_COLOR, ...color } : DEFAULT_COLOR
            }
        ],
        mark: { color: { signal: 'color.blue' } },
        rule: { color: { signal: 'color.gray0' } },
        text: {
            color: { signal: 'color.gray0' }
        },
        style: {
            'guide-label': {
                fill: { signal: 'color.gray0' }
            },
            'guide-title': {
                fill: { signal: 'color.gray0' }
            },
            'group-title': {
                fill: { signal: 'color.gray0' }
            },
            'group-subtitle': {
                fill: { signal: 'color.gray0' }
            },
            cell: {
                stroke: { signal: 'color.gray8' }
            }
        },
        axis: {
            domainColor: { signal: 'color.gray13' },
            gridColor: { signal: 'color.gray8' },
            tickColor: { signal: 'color.gray13' }
        },
        range: {
            category: [
                { signal: 'color.blue' },
                { signal: 'color.orange' },
                { signal: 'color.red' },
                { signal: 'color.teal' },
                { signal: 'color.green' },
                { signal: 'color.yellow' },
                { signal: 'color.purple' },
                { signal: 'color.pink' },
                { signal: 'color.brown' },
                { signal: 'color.grey8' }
            ]
        }
    };
}
export function fontSizeSignalConfig(fontSize) {
    return {
        signals: [
            {
                name: 'fontSize',
                value: isObject(fontSize) ? { ...DEFAULT_FONT_SIZE, ...fontSize } : DEFAULT_FONT_SIZE
            }
        ],
        text: {
            fontSize: { signal: 'fontSize.text' }
        },
        style: {
            'guide-label': {
                fontSize: { signal: 'fontSize.guideLabel' }
            },
            'guide-title': {
                fontSize: { signal: 'fontSize.guideTitle' }
            },
            'group-title': {
                fontSize: { signal: 'fontSize.groupTitle' }
            },
            'group-subtitle': {
                fontSize: { signal: 'fontSize.groupSubtitle' }
            }
        }
    };
}
export function fontConfig(font) {
    return {
        text: { font },
        style: {
            'guide-label': { font },
            'guide-title': { font },
            'group-title': { font },
            'group-subtitle': { font }
        }
    };
}
function getAxisConfigInternal(axisConfig) {
    const props = keys(axisConfig || {});
    const axisConfigInternal = {};
    for (const prop of props) {
        const val = axisConfig[prop];
        axisConfigInternal[prop] = isConditionalAxisValue(val)
            ? signalOrValueRefWithCondition(val)
            : signalRefOrValue(val);
    }
    return axisConfigInternal;
}
function getStyleConfigInternal(styleConfig) {
    const props = keys(styleConfig);
    const styleConfigInternal = {};
    for (const prop of props) {
        // We need to cast to cheat a bit here since styleConfig can be either mark config or axis config
        styleConfigInternal[prop] = getAxisConfigInternal(styleConfig[prop]);
    }
    return styleConfigInternal;
}
const configPropsWithExpr = [
    ...MARK_CONFIGS,
    ...AXIS_CONFIGS,
    ...HEADER_CONFIGS,
    'background',
    'padding',
    'legend',
    'lineBreak',
    'scale',
    'style',
    'title',
    'view'
];
/**
 * Merge specified config with default config and config for the `color` flag,
 * then replace all expressions with signals
 */
export function initConfig(specifiedConfig = {}) {
    const { color, font, fontSize, selection, ...restConfig } = specifiedConfig;
    const mergedConfig = mergeConfig({}, duplicate(defaultConfig), font ? fontConfig(font) : {}, color ? colorSignalConfig(color) : {}, fontSize ? fontSizeSignalConfig(fontSize) : {}, restConfig || {});
    // mergeConfig doesn't recurse and overrides object values.
    if (selection) {
        writeConfig(mergedConfig, 'selection', selection, true);
    }
    const outputConfig = omit(mergedConfig, configPropsWithExpr);
    for (const prop of ['background', 'lineBreak', 'padding']) {
        if (mergedConfig[prop]) {
            outputConfig[prop] = signalRefOrValue(mergedConfig[prop]);
        }
    }
    for (const markConfigType of mark.MARK_CONFIGS) {
        if (mergedConfig[markConfigType]) {
            // FIXME: outputConfig[markConfigType] expects that types are replaced recursively but replaceExprRef only replaces one level deep
            outputConfig[markConfigType] = replaceExprRef(mergedConfig[markConfigType]);
        }
    }
    for (const axisConfigType of AXIS_CONFIGS) {
        if (mergedConfig[axisConfigType]) {
            outputConfig[axisConfigType] = getAxisConfigInternal(mergedConfig[axisConfigType]);
        }
    }
    for (const headerConfigType of HEADER_CONFIGS) {
        if (mergedConfig[headerConfigType]) {
            outputConfig[headerConfigType] = replaceExprRef(mergedConfig[headerConfigType]);
        }
    }
    if (mergedConfig.legend) {
        outputConfig.legend = replaceExprRef(mergedConfig.legend);
    }
    if (mergedConfig.scale) {
        outputConfig.scale = replaceExprRef(mergedConfig.scale);
    }
    if (mergedConfig.style) {
        outputConfig.style = getStyleConfigInternal(mergedConfig.style);
    }
    if (mergedConfig.title) {
        outputConfig.title = replaceExprRef(mergedConfig.title);
    }
    if (mergedConfig.view) {
        outputConfig.view = replaceExprRef(mergedConfig.view);
    }
    return outputConfig;
}
const MARK_STYLES = new Set(['view', ...PRIMITIVE_MARKS]);
const VL_ONLY_CONFIG_PROPERTIES = [
    'color',
    'fontSize',
    'background',
    'padding',
    'facet',
    'concat',
    'numberFormat',
    'numberFormatType',
    'normalizedNumberFormat',
    'normalizedNumberFormatType',
    'timeFormat',
    'countTitle',
    'header',
    'axisQuantitative',
    'axisTemporal',
    'axisDiscrete',
    'axisPoint',
    'axisXBand',
    'axisXPoint',
    'axisXDiscrete',
    'axisXQuantitative',
    'axisXTemporal',
    'axisYBand',
    'axisYPoint',
    'axisYDiscrete',
    'axisYQuantitative',
    'axisYTemporal',
    'scale',
    'selection',
    'overlay' // FIXME: Redesign and unhide this
];
const VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = {
    view: ['continuousWidth', 'continuousHeight', 'discreteWidth', 'discreteHeight', 'step'],
    ...VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX
};
export function stripAndRedirectConfig(config) {
    config = duplicate(config);
    for (const prop of VL_ONLY_CONFIG_PROPERTIES) {
        delete config[prop];
    }
    if (config.axis) {
        // delete condition axis config
        for (const prop in config.axis) {
            if (isConditionalAxisValue(config.axis[prop])) {
                delete config.axis[prop];
            }
        }
    }
    if (config.legend) {
        for (const prop of VL_ONLY_LEGEND_CONFIG) {
            delete config.legend[prop];
        }
    }
    // Remove Vega-Lite only generic mark config
    if (config.mark) {
        for (const prop of VL_ONLY_MARK_CONFIG_PROPERTIES) {
            delete config.mark[prop];
        }
        if (config.mark.tooltip && isObject(config.mark.tooltip)) {
            delete config.mark.tooltip;
        }
    }
    if (config.params) {
        config.signals = (config.signals || []).concat(assembleParameterSignals(config.params));
        delete config.params;
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
        redirectConfigToStyleConfig(config, markType);
    }
    for (const m of getAllCompositeMarks()) {
        // Clean up the composite mark config as we don't need them in the output specs anymore
        delete config[m];
    }
    redirectTitleConfig(config);
    // Remove empty config objects.
    for (const prop in config) {
        if (isObject(config[prop]) && isEmpty(config[prop])) {
            delete config[prop];
        }
    }
    return isEmpty(config) ? undefined : config;
}
/**
 *
 * Redirect config.title -- so that title config do not affect header labels,
 * which also uses `title` directive to implement.
 *
 * For subtitle configs in config.title, keep them in config.title as header titles never have subtitles.
 */
function redirectTitleConfig(config) {
    const { titleMarkConfig, subtitleMarkConfig, subtitle } = extractTitleConfig(config.title);
    // set config.style if title/subtitleMarkConfig is not an empty object
    if (!isEmpty(titleMarkConfig)) {
        config.style['group-title'] = {
            ...config.style['group-title'],
            ...titleMarkConfig // config.title has higher precedence than config.style.group-title in Vega
        };
    }
    if (!isEmpty(subtitleMarkConfig)) {
        config.style['group-subtitle'] = {
            ...config.style['group-subtitle'],
            ...subtitleMarkConfig
        };
    }
    // subtitle part can stay in config.title since header titles do not use subtitle
    if (!isEmpty(subtitle)) {
        config.title = subtitle;
    }
    else {
        delete config.title;
    }
}
function redirectConfigToStyleConfig(config, prop, // string = composite mark
toProp, compositeMarkPart) {
    const propConfig = compositeMarkPart ? config[prop][compositeMarkPart] : config[prop];
    if (prop === 'view') {
        toProp = 'cell'; // View's default style is "cell"
    }
    const style = {
        ...propConfig,
        ...config.style[toProp ?? prop]
    };
    // set config.style if it is not an empty object
    if (!isEmpty(style)) {
        config.style[toProp ?? prop] = style;
    }
    if (!compositeMarkPart) {
        // For composite mark, so don't delete the whole config yet as we have to do multiple redirections.
        delete config[prop];
    }
}
//# sourceMappingURL=config.js.map