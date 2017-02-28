import {AxisConfig, defaultAxisConfig} from './axis';
import {LegendConfig, defaultLegendConfig} from './legend';
import {MarkConfig, BarConfig, TextConfig, TickConfig} from './mark';
import * as mark from './mark';
import {ScaleConfig, defaultScaleConfig} from './scale';
import {StackOffset} from './stack';
import {Padding} from './spec';
import {VgRangeScheme} from './vega.schema';
import {SelectionConfig, defaultConfig as defaultSelectionConfig} from './selection';

export interface CellConfig {
  width?: number;
  height?: number;

  clip?: boolean;

  // FILL_STROKE_CONFIG
  /**
   * The fill color.
   */
  fill?: string;

  /** The fill opacity (value between [0,1]). */
  fillOpacity?: number;

  /** The stroke color. */
  stroke?: string;

  /** The stroke opacity (value between [0,1]). */
  strokeOpacity?: number;

  /** The stroke width, in pixels. */
  strokeWidth?: number;

  /** An array of alternating stroke, space lengths for creating dashed or dotted lines. */
  strokeDash?: number[];

  /** The offset (in pixels) into which to begin drawing with the stroke dash array. */
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
  /** Facet Axis Config */
  axis?: AxisConfig;

  /** Facet Grid Config */
  grid?: FacetGridConfig;

  /** Facet Cell Config */
  cell?: CellConfig;
}

export interface FacetGridConfig {
  color?: string;
  opacity?: number;
  offset?: number;
}

const defaultFacetGridConfig: FacetGridConfig = {
  color: '#000000',
  opacity: 0.4,
  offset: 0
};

export const defaultFacetConfig: FacetConfig = {
  axis: {},
  grid: defaultFacetGridConfig,
  cell: defaultFacetCellConfig
};

export type AreaOverlay = 'line' | 'linepoint' | 'none';

export interface OverlayConfig {
  /**
   * Whether to overlay line with point.
   */
  line?: boolean;

  /**
   * Type of overlay for area mark (line or linepoint)
   */
  area?: AreaOverlay;

  /**
   * Default style for the overlayed point.
   */
  pointStyle?: MarkConfig;

  /**
   * Default style for the overlayed point.
   */
  lineStyle?: MarkConfig;
}

export const defaultOverlayConfig: OverlayConfig = {
  line: false,
  pointStyle: {filled: true},
  lineStyle: {}
};

export type RangeConfig = (number|string)[] | VgRangeScheme | {step: number};

export interface Config {
  // TODO: add this back once we have top-down layout approach
  // width?: number;
  // height?: number;
  // padding?: number|string;
  /**
   * The width and height of the on-screen viewport, in pixels. If necessary, clipping and scrolling will be applied.
   */
  viewport?: number;
  /**
   * CSS color property to use as background of visualization. Default is `"transparent"`.
   */
  background?: string;

  /**
   * The default visualization padding, in pixels, from the edge of the visualization canvas to the data rectangle. This can be a single number or an object with `"top"`, `"left"`, `"right"`, `"bottom"` properties.
   *
   * __Default value__: `5`
   *
   * * @minimum 0
   */
  padding?: Padding;

  /**
   * D3 Number format for axis labels and text tables. For example "s" for SI units.
   */
  numberFormat?: string;

  /**
   * Default datetime format for axis and legend labels. The format can be set directly on each axis and legend.
   */
  timeFormat?: string;

  /**
   * Default axis and legend title for count fields.
   * @type {string}
   */
  countTitle?: string;

  /** Cell Config */
  cell?: CellConfig;

  /** Default stack offset for stackable mark. */
  stack?: StackOffset;

  /** Mark Config */
  mark?: MarkConfig;

  // MARK-SPECIFIC CONFIGS
  /** Area-Specific Config */
  area?: MarkConfig;

  /** Bar-Specific Config */
  bar?: BarConfig;

  /** Circle-Specific Config */
  circle?: MarkConfig;

  /** Line-Specific Config */
  line?: MarkConfig;

  /** Point-Specific Config */
  point?: MarkConfig;

  /** Rect-Specific Config */
  rect?: MarkConfig;

  /** Rule-Specific Config */
  rule?: MarkConfig;

  /** Square-Specific Config */
  square?: MarkConfig;

  /** Text-Specific Config */
  text?: TextConfig;

  /** Tick-Specific Config */
  tick?: TickConfig;

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

  /** Axis Config */
  axis?: AxisConfig;

  /** Legend Config */
  legend?: LegendConfig;

  /** Facet Config */
  facet?: FacetConfig;

  /** Selection Config */
  selection?: SelectionConfig;
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

  overlay: defaultOverlayConfig,
  scale: defaultScaleConfig,
  axis: defaultAxisConfig,
  legend: defaultLegendConfig,

  facet: defaultFacetConfig,

  selection: defaultSelectionConfig
};
