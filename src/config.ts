import {Color, InitSignal, Locale, NewSignal, RangeConfig, RangeScheme, SignalRef, writeConfig} from 'vega';
import {isObject, mergeConfig} from 'vega-util';
import {Axis, AxisConfig, AxisConfigMixins, AXIS_CONFIGS, isConditionalAxisValue} from './axis';
import {signalOrValueRefWithCondition, signalRefOrValue} from './compile/common';
import {CompositeMarkConfigMixins, getAllCompositeMarks} from './compositemark';
import {ExprRef, replaceExprRef} from './expr';
import {VL_ONLY_LEGEND_CONFIG} from './guide';
import {HeaderConfigMixins, HEADER_CONFIGS} from './header';
import {defaultLegendConfig, LegendConfig} from './legend';
import * as mark from './mark';
import {
  AnyMarkConfig,
  Mark,
  MarkConfig,
  MarkConfigMixins,
  MARK_CONFIGS,
  PRIMITIVE_MARKS,
  VL_ONLY_MARK_CONFIG_PROPERTIES,
  VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX
} from './mark';
import {assembleParameterSignals} from './parameter';
import {ProjectionConfig} from './projection';
import {defaultScaleConfig, ScaleConfig} from './scale';
import {defaultConfig as defaultSelectionConfig, SelectionConfig} from './selection';
import {BaseViewBackground, CompositionConfigMixins, DEFAULT_SPACING, isStep} from './spec/base';
import {TopLevelProperties} from './spec/toplevel';
import {extractTitleConfig, TitleConfig} from './title';
import {duplicate, getFirstDefined, isEmpty, keys, omit} from './util';

export interface ViewConfig<ES extends ExprRef | SignalRef> extends BaseViewBackground<ES> {
  /**
   * The default width when the plot has a continuous field for x or longitude, or has arc marks.
   *
   * __Default value:__ `200`
   */
  continuousWidth?: number;

  /**
   * The default width when the plot has non-arc marks and either a discrete x-field or no x-field.
   * The width can be either a number indicating a fixed width or an object in the form of `{step: number}` defining the width per discrete step.
   *
   * __Default value:__ a step size based on `config.view.step`.
   */
  discreteWidth?: number | {step: number};
  /**
   * The default height when the plot has a continuous y-field for x or latitude, or has arc marks.
   *
   * __Default value:__ `200`
   */
  continuousHeight?: number;

  /**
   * The default height when the plot has non arc marks and either a discrete y-field or no y-field.
   * The height can be either a number indicating a fixed height or an object in the form of `{step: number}` defining the height per discrete step.
   *
   * __Default value:__ a step size based on `config.view.step`.
   */
  discreteHeight?: number | {step: number};

  /**
   * Default step size for x-/y- discrete fields.
   */
  step?: number;

  /**
   * Whether the view should be clipped.
   */
  clip?: boolean;
}

export function getViewConfigContinuousSize<ES extends ExprRef | SignalRef>(
  viewConfig: ViewConfig<ES>,
  channel: 'width' | 'height'
) {
  return viewConfig[channel] ?? viewConfig[channel === 'width' ? 'continuousWidth' : 'continuousHeight']; // get width/height for backwards compatibility
}

export function getViewConfigDiscreteStep<ES extends ExprRef | SignalRef>(
  viewConfig: ViewConfig<ES>,
  channel: 'width' | 'height'
) {
  const size = getViewConfigDiscreteSize(viewConfig, channel);
  return isStep(size) ? size.step : DEFAULT_STEP;
}

export function getViewConfigDiscreteSize<ES extends ExprRef | SignalRef>(
  viewConfig: ViewConfig<ES>,
  channel: 'width' | 'height'
) {
  const size = viewConfig[channel] ?? viewConfig[channel === 'width' ? 'discreteWidth' : 'discreteHeight']; // get width/height for backwards compatibility
  return getFirstDefined(size, {step: viewConfig.step});
}

export const DEFAULT_STEP = 20;

export const defaultViewConfig: ViewConfig<SignalRef> = {
  continuousWidth: 200,
  continuousHeight: 200,
  step: DEFAULT_STEP
};

export function isVgScheme(rangeScheme: string[] | RangeScheme): rangeScheme is RangeScheme {
  return rangeScheme && !!rangeScheme['scheme'];
}

export type ColorConfig = Record<string, Color>;

export type FontSizeConfig = Record<string, number>;

export interface VLOnlyConfig<ES extends ExprRef | SignalRef> {
  /**
   * Default font for all text marks, titles, and labels.
   */
  font?: string;

  /**
   * Default color signals.
   *
   * @hidden
   */
  color?: boolean | ColorConfig;

  /**
   * Default font size signals.
   *
   * @hidden
   */
  fontSize?: boolean | FontSizeConfig;

  /**
   * Default axis and legend title for count fields.
   *
   * __Default value:__ `'Count of Records`.
   *
   * @type {string}
   */
  countTitle?: string;

  /**
   * Defines how Vega-Lite generates title for fields. There are three possible styles:
   * - `"verbal"` (Default) - displays function in a verbal style (e.g., "Sum of field", "Year-month of date", "field (binned)").
   * - `"function"` - displays function using parentheses and capitalized texts (e.g., "SUM(field)", "YEARMONTH(date)", "BIN(field)").
   * - `"plain"` - displays only the field name without functions (e.g., "field", "date", "field").
   */
  fieldTitle?: 'verbal' | 'functional' | 'plain';

  /**
   * D3 Number format for guide labels and text marks. For example `"s"` for SI units. Use [D3's number format pattern](https://github.com/d3/d3-format#locale_format).
   */
  numberFormat?: string;

  /**
   * Default time format for raw time values (without time units) in text marks, legend labels and header labels.
   *
   * __Default value:__ `"%b %d, %Y"`
   * __Note:__ Axes automatically determine the format for each label automatically so this config does not affect axes.
   */
  timeFormat?: string;

  /**
   * Allow the `formatType` property for text marks and guides to accept a custom formatter function [registered as a Vega expression](https://vega.github.io/vega-lite/usage/compile.html#format-type).
   */
  customFormatTypes?: boolean;

  /** Default properties for [single view plots](https://vega.github.io/vega-lite/docs/spec.html#single). */
  view?: ViewConfig<ES>;

  /**
   * Scale configuration determines default properties for all [scales](https://vega.github.io/vega-lite/docs/scale.html). For a full list of scale configuration options, please see the [corresponding section of the scale documentation](https://vega.github.io/vega-lite/docs/scale.html#config).
   */
  scale?: ScaleConfig<ES>;

  /** An object hash for defining default properties for each type of selections. */
  selection?: SelectionConfig;
}

export type StyleConfigIndex<ES extends ExprRef | SignalRef> = Partial<Record<string, AnyMarkConfig<ES> | Axis<ES>>> &
  MarkConfigMixins<ES> & {
    /**
     * Default style for axis, legend, and header titles.
     */
    'guide-title'?: MarkConfig<ES>;

    /**
     * Default style for axis, legend, and header labels.
     */
    'guide-label'?: MarkConfig<ES>;

    /**
     * Default style for chart titles
     */
    'group-title'?: MarkConfig<ES>;

    /**
     * Default style for chart subtitles
     */
    'group-subtitle'?: MarkConfig<ES>;
  };

export interface Config<ES extends ExprRef | SignalRef = ExprRef | SignalRef>
  extends TopLevelProperties<ES>,
    VLOnlyConfig<ES>,
    MarkConfigMixins<ES>,
    CompositeMarkConfigMixins,
    AxisConfigMixins<ES>,
    HeaderConfigMixins<ES>,
    CompositionConfigMixins {
  /**
   * An object hash that defines default range arrays or schemes for using with scales.
   * For a full list of scale range configuration options, please see the [corresponding section of the scale documentation](https://vega.github.io/vega-lite/docs/scale.html#config).
   */
  range?: RangeConfig;

  /**
   * Legend configuration, which determines default properties for all [legends](https://vega.github.io/vega-lite/docs/legend.html). For a full list of legend configuration options, please see the [corresponding section of in the legend documentation](https://vega.github.io/vega-lite/docs/legend.html#config).
   */
  legend?: LegendConfig<ES>;

  /**
   * Title configuration, which determines default properties for all [titles](https://vega.github.io/vega-lite/docs/title.html). For a full list of title configuration options, please see the [corresponding section of the title documentation](https://vega.github.io/vega-lite/docs/title.html#config).
   */
  title?: TitleConfig<ES>;

  /**
   * Projection configuration, which determines default properties for all [projections](https://vega.github.io/vega-lite/docs/projection.html). For a full list of projection configuration options, please see the [corresponding section of the projection documentation](https://vega.github.io/vega-lite/docs/projection.html#config).
   */
  projection?: ProjectionConfig;

  /** An object hash that defines key-value mappings to determine default properties for marks with a given [style](https://vega.github.io/vega-lite/docs/mark.html#mark-def). The keys represent styles names; the values have to be valid [mark configuration objects](https://vega.github.io/vega-lite/docs/mark.html#config). */
  style?: StyleConfigIndex<ES>;

  /**
   * A delimiter, such as a newline character, upon which to break text strings into multiple lines. This property provides a global default for text marks, which is overridden by mark or style config settings, and by the lineBreak mark encoding channel. If signal-valued, either string or regular expression (regexp) values are valid.
   */
  lineBreak?: string | ES;

  /**
   * A boolean flag indicating if ARIA default attributes should be included for marks and guides (SVG output only). If false, the `"aria-hidden"` attribute will be set for all guides, removing them from the ARIA accessibility tree and Vega-Lite will not generate default descriptions for marks.
   *
   * __Default value:__ `true`.
   */
  aria?: boolean;

  /**
   * Locale definitions for string parsing and formatting of number and date values. The locale object should contain `number` and/or `time` properties with [locale definitions](https://vega.github.io/vega/docs/api/locale/). Locale definitions provided in the config block may be overridden by the View constructor locale option.
   */
  locale?: Locale;

  /**
   * @hidden
   */
  signals?: (InitSignal | NewSignal)[];
}

export const defaultConfig: Config<SignalRef> = {
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
  rule: {color: 'black'}, // Need this to override default color in mark config
  square: {},
  text: {color: 'black'}, // Need this to override default color in mark config
  tick: mark.defaultTickConfig,
  trail: {},

  boxplot: {
    size: 14,
    extent: 1.5,
    box: {},
    median: {color: 'white'},
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
  header: {titlePadding: 10, labelPadding: 10},
  headerColumn: {},
  headerRow: {},
  headerFacet: {},

  selection: defaultSelectionConfig,
  style: {},

  title: {},

  facet: {spacing: DEFAULT_SPACING},
  concat: {spacing: DEFAULT_SPACING}
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

export function colorSignalConfig(color: boolean | ColorConfig = {}): Config {
  return {
    signals: [
      {
        name: 'color',
        value: isObject(color) ? {...DEFAULT_COLOR, ...color} : DEFAULT_COLOR
      }
    ],
    mark: {color: {signal: 'color.blue'}},
    rule: {color: {signal: 'color.gray0'}},
    text: {
      color: {signal: 'color.gray0'}
    },
    style: {
      'guide-label': {
        fill: {signal: 'color.gray0'}
      },
      'guide-title': {
        fill: {signal: 'color.gray0'}
      },
      'group-title': {
        fill: {signal: 'color.gray0'}
      },
      'group-subtitle': {
        fill: {signal: 'color.gray0'}
      },
      cell: {
        stroke: {signal: 'color.gray8'}
      }
    },
    axis: {
      domainColor: {signal: 'color.gray13'},
      gridColor: {signal: 'color.gray8'},
      tickColor: {signal: 'color.gray13'}
    },
    range: {
      category: [
        {signal: 'color.blue'},
        {signal: 'color.orange'},
        {signal: 'color.red'},
        {signal: 'color.teal'},
        {signal: 'color.green'},
        {signal: 'color.yellow'},
        {signal: 'color.purple'},
        {signal: 'color.pink'},
        {signal: 'color.brown'},
        {signal: 'color.grey8'}
      ]
    }
  };
}

export function fontSizeSignalConfig(fontSize: boolean | FontSizeConfig): Config {
  return {
    signals: [
      {
        name: 'fontSize',
        value: isObject(fontSize) ? {...DEFAULT_FONT_SIZE, ...fontSize} : DEFAULT_FONT_SIZE
      }
    ],
    text: {
      fontSize: {signal: 'fontSize.text'}
    },
    style: {
      'guide-label': {
        fontSize: {signal: 'fontSize.guideLabel'}
      },
      'guide-title': {
        fontSize: {signal: 'fontSize.guideTitle'}
      },
      'group-title': {
        fontSize: {signal: 'fontSize.groupTitle'}
      },
      'group-subtitle': {
        fontSize: {signal: 'fontSize.groupSubtitle'}
      }
    }
  };
}

export function fontConfig(font: string): Config {
  return {
    text: {font},
    style: {
      'guide-label': {font},
      'guide-title': {font},
      'group-title': {font},
      'group-subtitle': {font}
    }
  };
}

function getAxisConfigInternal(axisConfig: AxisConfig<ExprRef | SignalRef>) {
  const props = keys(axisConfig || {});
  const axisConfigInternal: AxisConfig<SignalRef> = {};
  for (const prop of props) {
    const val = axisConfig[prop];
    axisConfigInternal[prop as any] = isConditionalAxisValue<any, ExprRef | SignalRef>(val)
      ? signalOrValueRefWithCondition<any>(val)
      : signalRefOrValue(val);
  }
  return axisConfigInternal;
}

function getStyleConfigInternal(styleConfig: StyleConfigIndex<ExprRef | SignalRef>) {
  const props = keys(styleConfig);

  const styleConfigInternal: StyleConfigIndex<SignalRef> = {};
  for (const prop of props) {
    // We need to cast to cheat a bit here since styleConfig can be either mark config or axis config
    styleConfigInternal[prop as any] = getAxisConfigInternal(styleConfig[prop] as any);
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
] as const;

/**
 * Merge specified config with default config and config for the `color` flag,
 * then replace all expressions with signals
 */
export function initConfig(specifiedConfig: Config = {}): Config<SignalRef> {
  const {color, font, fontSize, selection, ...restConfig} = specifiedConfig;
  const mergedConfig = mergeConfig(
    {},
    duplicate(defaultConfig),
    font ? fontConfig(font) : {},
    color ? colorSignalConfig(color) : {},
    fontSize ? fontSizeSignalConfig(fontSize) : {},
    restConfig || {}
  );

  // mergeConfig doesn't recurse and overrides object values.
  if (selection) {
    writeConfig(mergedConfig, 'selection', selection, true);
  }

  const outputConfig: Config<SignalRef> = omit(mergedConfig, configPropsWithExpr);

  for (const prop of ['background', 'lineBreak', 'padding']) {
    if (mergedConfig[prop]) {
      outputConfig[prop] = signalRefOrValue(mergedConfig[prop]);
    }
  }

  for (const markConfigType of mark.MARK_CONFIGS) {
    if (mergedConfig[markConfigType]) {
      // FIXME: outputConfig[markConfigType] expects that types are replaced recursively but replaceExprRef only replaces one level deep
      outputConfig[markConfigType] = replaceExprRef(mergedConfig[markConfigType]) as any;
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

const MARK_STYLES = new Set(['view', ...PRIMITIVE_MARKS]) as ReadonlySet<'view' | Mark>;

const VL_ONLY_CONFIG_PROPERTIES: (keyof Config)[] = [
  'color',
  'fontSize',
  'background', // We apply background to the spec directly.
  'padding',
  'facet',
  'concat',
  'numberFormat',
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
  'overlay' as keyof Config // FIXME: Redesign and unhide this
];

const VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = {
  view: ['continuousWidth', 'continuousHeight', 'discreteWidth', 'discreteHeight', 'step'],
  ...VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX
};

export function stripAndRedirectConfig(config: Config<SignalRef>) {
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
function redirectTitleConfig(config: Config<SignalRef>) {
  const {titleMarkConfig, subtitleMarkConfig, subtitle} = extractTitleConfig(config.title);

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
  } else {
    delete config.title;
  }
}

function redirectConfigToStyleConfig(
  config: Config<SignalRef>,
  prop: Mark | 'view' | string, // string = composite mark
  toProp?: string,
  compositeMarkPart?: string
) {
  const propConfig: MarkConfig<SignalRef> = compositeMarkPart ? config[prop][compositeMarkPart] : config[prop];

  if (prop === 'view') {
    toProp = 'cell'; // View's default style is "cell"
  }

  const style: MarkConfig<SignalRef> = {
    ...propConfig,
    ...(config.style[toProp ?? prop] as MarkConfig<SignalRef>)
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
