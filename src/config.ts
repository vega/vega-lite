import {AxisConfig, AxisConfigMixins} from './axis';
import {BoxPlotConfig, COMPOSITE_MARK_ROLES} from './compositemark';
import {CompositeMarkConfigMixins, VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX} from './compositemark/index';
import {VL_ONLY_GUIDE_CONFIG} from './guide';
import {defaultLegendConfig, LegendConfig} from './legend';
import {BarConfig, Mark, MarkConfig, MarkConfigMixins, PRIMITIVE_MARKS, TextConfig, TickConfig, VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX} from './mark';
import * as mark from './mark';
import {defaultScaleConfig, ScaleConfig} from './scale';
import {defaultConfig as defaultSelectionConfig, SelectionConfig} from './selection';
import {StackOffset} from './stack';
import {TopLevelProperties} from './toplevelprops';
import {duplicate, isObject, keys, mergeDeep} from './util';
import {VgRangeScheme, VgTitleConfig} from './vega.schema';


export interface CellConfig {
  /**
   * The default width of the single plot or each plot in a trellis plot when the visualization has a continuous (non-ordinal) x-scale or ordinal x-scale with `rangeStep` = `null`.
   *
   * __Default value:__ `200`
   *
   */
  width?: number;

  /**
   * The default height of the single plot or each plot in a trellis plot when the visualization has a continuous (non-ordinal) y-scale with `rangeStep` = `null`.
   *
   * __Default value:__ `200`
   *
   */
  height?: number;

  /**
   * Whether the view should be clipped.
   */
  clip?: boolean;

  // FILL_STROKE_CONFIG
  /**
   * The fill color.
   *
   * __Default value:__ (none)
   *
   */
  fill?: string;

  /**
   * The fill opacity (value between [0,1]).
   *
   * __Default value:__ (none)
   *
   */
  fillOpacity?: number;

  /**
   * The stroke color.
   *
   * __Default value:__ (none)
   *
   */
  stroke?: string;

  /**
   * The stroke opacity (value between [0,1]).
   *
   * __Default value:__ (none)
   *
   */
  strokeOpacity?: number;

  /**
   * The stroke width, in pixels.
   *
   * __Default value:__ (none)
   *
   */
  strokeWidth?: number;

  /**
   * An array of alternating stroke, space lengths for creating dashed or dotted lines.
   *
   * __Default value:__ (none)
   *
   */
  strokeDash?: number[];

  /**
   * The offset (in pixels) into which to begin drawing with the stroke dash array.
   *
   * __Default value:__ (none)
   *
   */
  strokeDashOffset?: number;
}

export const defaultCellConfig: CellConfig = {
  width: 200,
  height: 200,
  fill: 'transparent',
  stroke: '#ccc'
};

export type RangeConfig = (number|string)[] | VgRangeScheme | {step: number};

export interface VLOnlyConfig {
  /**
   * Default axis and legend title for count fields.
   *
   * __Default value:__ `'Number of Records'`.
   *
   * @type {string}
   */
  countTitle?: string;

  /**
   * Defines how Vega-Lite should handle invalid values (`null` and `NaN`).
   * - If set to `"filter"` (default), all data items with null values are filtered.
   * - If `null`, all data items are included. In this case, invalid values will be interpreted as zeroes.
   */
  invalidValues?: 'filter';

  /**
   * D3 Number format for axis labels and text tables. For example "s" for SI units.(in the form of [D3 number format pattern](https://github.com/mbostock/d3/wiki/Formatting)).
   *
   * __Default value:__ `"s"` (except for text marks that encode a count field, the default value is `"d"`).
   *
   */
  numberFormat?: string;

  /**
   * Default datetime format for axis and legend labels. The format can be set directly on each axis and legend. [D3 time format pattern](https://github.com/mbostock/d3/wiki/Time-Formatting)).
   *
   * __Default value:__ `'%b %d, %Y'`.
   *
   */
  timeFormat?: string;


  /** Cell Config */
  cell?: CellConfig;

  /** Scale Config */
  scale?: ScaleConfig;

  /** Selection Config */
  selection?: SelectionConfig;

  /** Default stack offset for stackable mark. */
  stack?: StackOffset;
}

export interface Config extends TopLevelProperties, VLOnlyConfig, MarkConfigMixins, CompositeMarkConfigMixins, AxisConfigMixins {

  /**
   * Scale range config, or properties defining named range arrays
   * that can be used within scale range definitions
   * (such as `{"type": "ordinal", "range": "category"}`).
   * For default range that Vega-Lite adopts from Vega, see https://github.com/vega/vega-parser#scale-range-properties.
   */
  range?: {[name: string]: RangeConfig};

  /** Legend Config */
  legend?: LegendConfig;

  /** Title Config */
  title?: VgTitleConfig;

  // Support arbitrary key for role config
  // Note: Technically, the type for role config should be `MarkConfig`.
  // However, Typescript requires that the index type must be compatible with all other properties.
  // Basically, it will complain that `legend: LegendConfig` is not an instance of `MarkConfig`
  // Thus, we have to use `any` here.
  [role: string]: any;
}

export const defaultConfig: Config = {
  padding: 5,
  timeFormat: '%b %d, %Y',
  countTitle: 'Number of Records',

  invalidValues: 'filter',

  cell: defaultCellConfig,

  mark: mark.defaultMarkConfig,
  area: {},
  bar: mark.defaultBarConfig,
  circle: {},
  geoshape: {},
  line: {},
  point: {},
  rect: {},
  rule: {color: 'black'},
  square: {},
  text: {color: 'black'},
  tick: mark.defaultTickConfig,

  box: {size: 14},
  boxWhisker: {},
  boxMid: {color: 'white'},

  scale: defaultScaleConfig,
  projection: {},
  axis: {
    domainColor: '#888',
    tickColor: '#888'
  },
  axisX: {},
  axisY: {minExtent: 30},
  axisLeft: {},
  axisRight: {},
  axisTop: {},
  axisBottom: {},
  axisBand: {},
  legend: defaultLegendConfig,

  selection: defaultSelectionConfig,

  title: {},
};

export function initConfig(config: Config) {
  return mergeDeep(duplicate(defaultConfig), config);
}

const MARK_ROLES = [].concat(PRIMITIVE_MARKS, COMPOSITE_MARK_ROLES) as (Mark | typeof COMPOSITE_MARK_ROLES[0])[];

const VL_ONLY_CONFIG_PROPERTIES: (keyof Config)[] = ['padding', 'numberFormat', 'timeFormat', 'countTitle', 'cell', 'stack', 'overlay', 'scale', 'selection', 'invalidValues'];

const VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = {
  ...VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX,
  ...VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX
};

export function stripConfig(config: Config) {
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
  }

  // Remove Vega-Lite only generic mark config
  if (config.mark) {
    for (const prop of mark.VL_ONLY_MARK_CONFIG_PROPERTIES) {
      delete config.mark[prop];
    }
  }

  // Remove Vega-Lite Mark/Role config
  for (const role of MARK_ROLES) {
    for (const prop of mark.VL_ONLY_MARK_CONFIG_PROPERTIES) {
      delete config[role][prop];
    }
    const vlOnlyMarkSpecificConfigs = VL_ONLY_ALL_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX[role];
    if (vlOnlyMarkSpecificConfigs) {
      for (const prop of vlOnlyMarkSpecificConfigs) {
        delete config[role][prop];
      }
    }
  }

  // Remove empty config objects
  for (const prop in config) {
    if (isObject(config[prop]) && keys(config[prop]).length === 0) {
      delete config[prop];
    }
  }

  return keys(config).length > 0 ? config : undefined;
}
