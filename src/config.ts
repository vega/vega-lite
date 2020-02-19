import {scheme} from 'vega-scale';
import {Color, InitSignal, NewSignal, RangeConfig, RangeScheme} from 'vega-typings';
import {isObject, mergeConfig} from 'vega-util';
import {Axis, AxisConfigMixins, isConditionalAxisValue} from './axis';
import {CompositeMarkConfigMixins, getAllCompositeMarks} from './compositemark';
import {VL_ONLY_LEGEND_CONFIG} from './guide';
import {HeaderConfigMixins} from './header';
import {defaultLegendConfig, LegendConfig} from './legend';
import * as mark from './mark';
import {
  Mark,
  MarkConfig,
  MarkConfigMixins,
  PRIMITIVE_MARKS,
  VL_ONLY_MARK_CONFIG_PROPERTIES,
  VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX
} from './mark';
import {ProjectionConfig} from './projection';
import {defaultScaleConfig, ScaleConfig} from './scale';
import {defaultConfig as defaultSelectionConfig, SelectionConfig} from './selection';
import {BaseViewBackground, CompositionConfigMixins, DEFAULT_SPACING, isStep} from './spec/base';
import {TopLevelProperties} from './spec/toplevel';
import {extractTitleConfig, TitleConfig} from './title';
import {duplicate, getFirstDefined, keys} from './util';

export interface ViewConfig extends BaseViewBackground {
  /**
   * Default width
   *
   * __Deprecated:__ Since Vega-Lite 4.0. Please use continuousWidth and discreteWidth instead.
   */
  width?: number;

  /**
   * Default height
   *
   * __Deprecated:__ Since Vega-Lite 4.0. Please use continuousHeight and discreteHeight instead.
   */
  height?: number;

  /**
   * The default width when the plot has a continuous x-field.
   *
   * __Default value:__ `200`
   */
  continuousWidth?: number;

  /**
   * The default width when the plot has either a discrete x-field or no x-field.
   * The width can be either a number indicating a fixed width or an object in the form of `{step: number}` defining the width per discrete step.
   *
   * __Default value:__ a step size based on `config.view.step`.
   */
  discreteWidth?: number | {step: number};
  /**
   * The default height when the plot has a continuous y-field.
   *
   * __Default value:__ `200`
   */
  continuousHeight?: number;

  /**
   * The default height when the plot has either a discrete y-field or no y-field.
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

export function getViewConfigContinuousSize(viewConfig: ViewConfig, channel: 'width' | 'height') {
  return viewConfig[channel] ?? viewConfig[channel === 'width' ? 'continuousWidth' : 'continuousHeight']; // get width/height for backwards compatibility
}

export function getViewConfigDiscreteStep(viewConfig: ViewConfig, channel: 'width' | 'height') {
  const size = getViewConfigDiscreteSize(viewConfig, channel);
  return isStep(size) ? size.step : DEFAULT_STEP;
}

export function getViewConfigDiscreteSize(viewConfig: ViewConfig, channel: 'width' | 'height') {
  const size = viewConfig[channel] ?? viewConfig[channel === 'width' ? 'discreteWidth' : 'discreteHeight']; // get width/height for backwards compatibility
  return getFirstDefined(size, {step: viewConfig.step});
}

export const DEFAULT_STEP = 20;

export const defaultViewConfig: ViewConfig = {
  continuousWidth: 200,
  continuousHeight: 200,
  step: DEFAULT_STEP
};

export function isVgScheme(rangeScheme: string[] | RangeScheme): rangeScheme is RangeScheme {
  return rangeScheme && !!rangeScheme['scheme'];
}

export type ColorConfig = {[name: string]: Color};

export type FontSizeConfig = {[name: string]: number};

export interface VLOnlyConfig {
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
   * D3 Number format for guide labels and text marks. For example "s" for SI units. Use [D3's number format pattern](https://github.com/d3/d3-format#locale_format).
   */
  numberFormat?: string;

  /**
   * Default time format for raw time values (without time units) in text marks, legend labels and header labels.
   *
   * __Default value:__ `"%b %d, %Y"`
   * __Note:__ Axes automatically determine format each label automatically so this config would not affect axes.
   */
  timeFormat?: string;

  /** Default properties for [single view plots](https://vega.github.io/vega-lite/docs/spec.html#single). */
  view?: ViewConfig;

  /**
   * Scale configuration determines default properties for all [scales](https://vega.github.io/vega-lite/docs/scale.html). For a full list of scale configuration options, please see the [corresponding section of the scale documentation](https://vega.github.io/vega-lite/docs/scale.html#config).
   */
  scale?: ScaleConfig;

  /** An object hash for defining default properties for each type of selections. */
  selection?: SelectionConfig;
}

export type StyleConfigIndex = Partial<Record<string, MarkConfig | Axis>> &
  Partial<Record<Mark, MarkConfig>> & {
    /**
     * Default style for axis, legend, and header titles.
     */
    'guide-title'?: MarkConfig;

    /**
     * Default style for axis, legend, and header labels.
     */
    'guide-label'?: MarkConfig;

    /**
     * Default style for chart titles
     */
    'group-title'?: MarkConfig;

    /**
     * Default style for chart subtitles
     */
    'group-subtitle'?: MarkConfig;
  };

export interface Config
  extends TopLevelProperties,
    VLOnlyConfig,
    MarkConfigMixins,
    CompositeMarkConfigMixins,
    AxisConfigMixins,
    HeaderConfigMixins,
    CompositionConfigMixins {
  /**
   * CSS color property to use as the background of the entire view.
   *
   * __Default value:__ `"white"`
   */
  background?: Color;

  /**
   * An object hash that defines default range arrays or schemes for using with scales.
   * For a full list of scale range configuration options, please see the [corresponding section of the scale documentation](https://vega.github.io/vega-lite/docs/scale.html#config).
   */
  range?: RangeConfig;

  /**
   * Legend configuration, which determines default properties for all [legends](https://vega.github.io/vega-lite/docs/legend.html). For a full list of legend configuration options, please see the [corresponding section of in the legend documentation](https://vega.github.io/vega-lite/docs/legend.html#config).
   */
  legend?: LegendConfig;

  /**
   * Title configuration, which determines default properties for all [titles](https://vega.github.io/vega-lite/docs/title.html). For a full list of title configuration options, please see the [corresponding section of the title documentation](https://vega.github.io/vega-lite/docs/title.html#config).
   */
  title?: TitleConfig;

  /**
   * Projection configuration, which determines default properties for all [projections](https://vega.github.io/vega-lite/docs/projection.html). For a full list of projection configuration options, please see the [corresponding section of the projection documentation](https://vega.github.io/vega-lite/docs/projection.html#config).
   */
  projection?: ProjectionConfig;

  /** An object hash that defines key-value mappings to determine default properties for marks with a given [style](https://vega.github.io/vega-lite/docs/mark.html#mark-def). The keys represent styles names; the values have to be valid [mark configuration objects](https://vega.github.io/vega-lite/docs/mark.html#config). */
  style?: StyleConfigIndex;

  /**
   * @hidden
   */
  signals?: (InitSignal | NewSignal)[];
}

export const defaultConfig: Config = {
  background: 'white',

  padding: 5,
  timeFormat: '%b %d, %Y',
  countTitle: 'Count of Records',

  view: defaultViewConfig,

  mark: mark.defaultMarkConfig,
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

  axis: {},
  axisX: {},
  axisY: {},
  axisLeft: {},
  axisRight: {},
  axisTop: {},
  axisBottom: {},
  axisBand: {},
  legend: defaultLegendConfig,
  header: {titlePadding: 10, labelPadding: 10},
  headerColumn: {},
  headerRow: {},
  headerFacet: {},

  selection: defaultSelectionConfig,
  style: {},

  title: {},

  facet: {spacing: DEFAULT_SPACING},
  repeat: {spacing: DEFAULT_SPACING},
  concat: {spacing: DEFAULT_SPACING}
};

const tab10 = scheme('tableau10');

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

export function initConfig(config: Config = {}) {
  const {color, font, fontSize, ...restConfig} = config;

  return mergeConfig(
    {},
    defaultConfig,
    font ? fontConfig(font) : {},
    color ? colorSignalConfig(color) : {},
    fontSize ? fontSizeSignalConfig(fontSize) : {},
    restConfig || {}
  );
}

const MARK_STYLES = ['view', ...PRIMITIVE_MARKS] as ('view' | Mark)[];

const VL_ONLY_CONFIG_PROPERTIES: (keyof Config)[] = [
  'color',
  'fontSize',
  'background', // We apply background to the spec directly.
  'padding',
  'facet',
  'concat',
  'repeat',
  'numberFormat',
  'timeFormat',
  'countTitle',
  'header',
  'axisQuantitative',
  'axisTemporal',
  'scale',
  'selection',
  'overlay' as keyof Config // FIXME: Redesign and unhide this
];

const VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = {
  view: ['continuousWidth', 'continuousHeight', 'discreteWidth', 'discreteHeight', 'step'],
  ...VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX
};

export function stripAndRedirectConfig(config: Config) {
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
    if (isObject(config[prop]) && keys(config[prop]).length === 0) {
      delete config[prop];
    }
  }

  return keys(config).length > 0 ? config : undefined;
}

/**
 *
 * Redirect config.title -- so that title config do not affect header labels,
 * which also uses `title` directive to implement.
 *
 * For subtitle configs in config.title, keep them in config.title as header titles never have subtitles.
 */
function redirectTitleConfig(config: Config) {
  const {mark: m, subtitle} = extractTitleConfig(config.title);

  const style: MarkConfig = {
    ...m,
    ...config.style['group-title']
  };

  // set config.style if it is not an empty object
  if (keys(style).length > 0) {
    config.style['group-title'] = style;
  }

  //
  if (keys(subtitle).length > 0) {
    config.title = subtitle;
  } else {
    delete config.title;
  }
}

function redirectConfigToStyleConfig(
  config: Config,
  prop: Mark | 'view' | string, // string = composite mark
  toProp?: string,
  compositeMarkPart?: string
) {
  const propConfig: MarkConfig = compositeMarkPart ? config[prop][compositeMarkPart] : config[prop];

  if (prop === 'view') {
    toProp = 'cell'; // View's default style is "cell"
  }

  const style: MarkConfig = {
    ...propConfig,
    ...(config.style[toProp ?? prop] as MarkConfig)
  };

  // set config.style if it is not an empty object
  if (keys(style).length > 0) {
    config.style[toProp ?? prop] = style;
  }

  if (!compositeMarkPart) {
    // For composite mark, so don't delete the whole config yet as we have to do multiple redirections.
    delete config[prop];
  }
}
