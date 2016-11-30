import {AxisConfig, defaultAxisConfig, defaultFacetAxisConfig} from './axis';
import {LegendConfig, defaultLegendConfig} from './legend';
import {MarkConfig, AreaConfig, BarConfig, LineConfig, PointConfig, TextConfig, TickConfig, RectConfig, RuleConfig} from './mark';
import * as mark from './mark';
import {ScaleConfig, defaultScaleConfig} from './scale';


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
  height: 200
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
  axis: defaultFacetAxisConfig,
  grid: defaultFacetGridConfig,
  cell: defaultFacetCellConfig
};

// FIXME refactor this
export namespace AreaOverlay {
  export const LINE: 'line' = 'line';
  export const LINEPOINT: 'linepoint' = 'linepoint';
  export const NONE: 'none' = 'none';
}
export type AreaOverlay = typeof AreaOverlay.LINE | typeof AreaOverlay.LINEPOINT | typeof AreaOverlay.NONE;

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

  /** Mark Config */
  mark?: MarkConfig;

  // MARK-SPECIFIC CONFIGS
  /** Area-Specific Config */
  area?: AreaConfig;

  /** Bar-Specific Config */
  bar?: BarConfig;

  /** Circle-Specific Config */
  circle?: PointConfig;

  /** Line-Specific Config */
  line?: LineConfig;

  /** Point-Specific Config */
  point?: PointConfig;

  /** Rect-Specific Config */
  rect?: RectConfig;

  /** Rule-Specific Config */
  rule?: RuleConfig;

  /** Square-Specific Config */
  square?: PointConfig;

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

  /** Axis Config */
  axis?: AxisConfig;

  /** Legend Config */
  legend?: LegendConfig;

  /** Facet Config */
  facet?: FacetConfig;
}

export const defaultConfig: Config = {
  numberFormat: 's',
  timeFormat: '%b %d, %Y',
  countTitle: 'Number of Records',

  cell: defaultCellConfig,

  mark: mark.defaultMarkConfig,
  area: mark.defaultAreaConfig,
  bar: mark.defaultBarConfig,
  circle: mark.defaultCircleConfig,
  line: mark.defaultLineConfig,
  point: mark.defaultPointConfig,
  rect: mark.defaultRectConfig,
  rule: mark.defaultRuleConfig,
  square: mark.defaultSquareConfig,
  text: mark.defaultTextConfig,
  tick: mark.defaultTickConfig,

  overlay: defaultOverlayConfig,
  scale: defaultScaleConfig,
  axis: defaultAxisConfig,
  legend: defaultLegendConfig,

  facet: defaultFacetConfig,
};
