import {AxisConfig} from './axis';
import {BoxPlotConfig, COMPOSITE_MARK_ROLES} from './compositemark';
import {defaultLegendConfig, LegendConfig} from './legend';
import {BarConfig, Mark, MarkConfig, MarkConfigMixins, PRIMITIVE_MARKS, TextConfig, TickConfig, VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX} from './mark';
import * as mark from './mark';
import {defaultScaleConfig, ScaleConfig} from './scale';
import {defaultConfig as defaultSelectionConfig, SelectionConfig} from './selection';
import {StackOffset} from './stack';
import {TopLevelProperties} from './toplevelprops';
import {duplicate, isObject, keys, mergeDeep} from './util';
import {VgRangeScheme} from './vega.schema';

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
  fill: 'transparent'
};

export const defaultFacetCellConfig: CellConfig = {
  stroke: '#ccc',
  strokeWidth: 1
};

export interface FacetConfig {
  /** Facet Cell Config */
  cell?: CellConfig;
}


export const defaultFacetConfig: FacetConfig = {
  cell: defaultFacetCellConfig
};

export type AreaOverlay = 'line' | 'linepoint' | 'none';

export interface OverlayConfig {
  /**
   * Whether to overlay line with point.
   *
   * __Default value:__ `false`
   */
  line?: boolean;

  /**
   * Type of overlay for area mark (line or linepoint)
   */
  area?: AreaOverlay;
}

export const defaultOverlayConfig: OverlayConfig = {
  line: false
};

export type RangeConfig = (number|string)[] | VgRangeScheme | {step: number};

export interface Config  extends TopLevelProperties, MarkConfigMixins {
  // TODO: add this back once we have top-down layout approach
  // width?: number;
  // height?: number;

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

  /**
   * Default axis and legend title for count fields.
   *
   * __Default value:__ `'Number of Records'`.
   *
   * @type {string}
   */
  countTitle?: string;

  /** Cell Config */
  cell?: CellConfig;

  /** Default stack offset for stackable mark. */
  stack?: StackOffset;


  /** Box Config */
  box?: BoxPlotConfig;

  boxWhisker?: MarkConfig;

  boxMid?: MarkConfig;

  // OTHER CONFIG

  // FIXME: move this to line/area
  /** Mark Overlay Config */
  overlay?: OverlayConfig;

  /** Scale Config */
  scale?: ScaleConfig;

  /**
   * Scale range config, or properties defining named range arrays
   * that can be used within scale range definitions
   * (such as `{"type": "ordinal", "range": "category"}`).
   * For default range that Vega-Lite adopts from Vega, see https://github.com/vega/vega-parser#scale-range-properties.
   */
  range?: {[name: string]: RangeConfig};

  /** Generic axis config. */
  axis?: AxisConfig;

  /**
   * X-axis specific config.
   */
  axisX?: AxisConfig;

  /**
   * Y-axis specific config.
   */
  axisY?: AxisConfig;

  /**
   * Specific axis config for y-axis along the left edge of the chart.
   */
  axisLeft?: AxisConfig;

  /**
   * Specific axis config for y-axis along the right edge of the chart.
   */
  axisRight?: AxisConfig;

  /**
   * Specific axis config for x-axis along the top edge of the chart.
   */
  axisTop?: AxisConfig;

  /**
   * Specific axis config for x-axis along the bottom edge of the chart.
   */
  axixBottom?: AxisConfig;

  /**
   * Specific axis config for axes with "band" scales.
   */
  axisBand?: AxisConfig;

  /** Legend Config */
  legend?: LegendConfig;

  /** Facet Config */
  facet?: FacetConfig;

  /** Selection Config */
  selection?: SelectionConfig;

  /**
   * Whether to filter invalid values (`null` and `NaN`) from the data.
   * - By default (`undefined`), only quantitative and temporal fields are filtered.
   * - If set to `true`, all data items with null values are filtered.
   * - If `false`, all data items are included. In this case, null values will be interpreted as zeroes.
   */
  filterInvalid?: boolean;

  // Support arbitrary key for role config
  // Note: Technically, the type for role config should be `MarkConfig`.
  // However, Typescript requires that the index type must be compatible with all other properties.
  // Basically, it will complain that `legend: LegendConfig` is not an instance of `MarkConfig`
  // Thus, we have to use `any` here.
  [role: string]: any;
}

export const defaultConfig: Config = {
  padding: 5,
  numberFormat: 's',
  timeFormat: '%b %d, %Y',
  countTitle: 'Number of Records',

  cell: defaultCellConfig,

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

  box: {size: 14},
  boxWhisker: {},
  boxMid: {},

  overlay: defaultOverlayConfig,
  scale: defaultScaleConfig,
  axis: {},
  axisX: {},
  axisY: {},
  axisLeft: {},
  axisRight: {},
  axisTop: {},
  axisBottom: {},
  axisBand: {},
  legend: defaultLegendConfig,

  facet: defaultFacetConfig,

  selection: defaultSelectionConfig,
};

export function initConfig(config: Config) {
  return mergeDeep(duplicate(defaultConfig), config);
}

const MARK_ROLES = [].concat(PRIMITIVE_MARKS, COMPOSITE_MARK_ROLES) as (Mark | typeof COMPOSITE_MARK_ROLES[0])[];

const VL_ONLY_CONFIG_PROPERTIES: (keyof Config)[] = ['padding', 'numberFormat', 'timeFormat', 'countTitle', 'cell', 'stack', 'overlay', 'scale', 'facet', 'selection', 'filterInvalid'];

export function stripConfig(config: Config) {
  config = duplicate(config);

  for (const prop of VL_ONLY_CONFIG_PROPERTIES) {
    delete config[prop];
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
    const vlOnlyMarkSpecificConfigs = VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX[role];
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
