import {ScaleConfig, defaultScaleConfig} from './scale';
import {AxisConfig, defaultAxisConfig, defaultFacetAxisConfig} from './axis';
import {LegendConfig, defaultLegendConfig} from './legend';
import {StackOffset} from './stack';

export interface CellConfig {
  width?: number;
  height?: number;

  clip?: boolean;

  // FILL_STROKE_CONFIG
  /**
   * The fill color.
   * @format color
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
  /** @format color */
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

export namespace FontWeight {
    export const NORMAL: 'normal' = 'normal';
    export type NORMAL = typeof NORMAL;
    export const BOLD: 'bold' = 'bold';
    export type BOLD = typeof BOLD;
}
export type FontWeight = FontWeight.NORMAL | FontWeight.BOLD;

export namespace Shape {
    export const CIRCLE: 'circle' = 'circle';
    export type CIRCLE = typeof CIRCLE;
    export const SQUARE: 'square' = 'square';
    export type SQUARE = typeof SQUARE;
    export const CROSS: 'cross' = 'cross';
    export type CROSS = typeof CROSS;
    export const DIAMOND: 'diamond' = 'diamond';
    export type DIAMOND = typeof DIAMOND;
    export const TRIANGLEUP: 'triangle-up' = 'triangle-up';
    export type TRIANGLEUP = typeof TRIANGLEUP;
    export const TRIANGLEDOWN: 'triangle-down' = 'triangle-down';
    export type TRIANGLEDOWN = typeof TRIANGLEDOWN;
}
export type Shape = Shape.CIRCLE | Shape.SQUARE | Shape.CROSS | Shape.DIAMOND | Shape.TRIANGLEUP | Shape.TRIANGLEDOWN;

export namespace Orient {
    export const HORIZONTAL: 'horizontal' = 'horizontal';
    export type HORIZONTAL = typeof HORIZONTAL;
    export const VERTICAL: 'vertical' = 'vertical';
    export type VERTICAL = typeof VERTICAL;
}
export type Orient = Orient.HORIZONTAL | Orient.VERTICAL;

export namespace HorizontalAlign {
    export const LEFT: 'left' = 'left';
    export type LEFT = typeof LEFT;
    export const RIGHT: 'right' = 'right';
    export type RIGHT = typeof RIGHT;
    export const CENTER: 'center' = 'center';
    export type CENTER = typeof CENTER;
}
export type HorizontalAlign = HorizontalAlign.LEFT | HorizontalAlign.RIGHT | HorizontalAlign.CENTER;

export namespace VerticalAlign {
    export const TOP: 'top' = 'top';
    export type TOP = typeof TOP;
    export const MIDDLE: 'middle' = 'middle';
    export type MIDDLE = typeof MIDDLE;
    export const BOTTOM: 'bottom' = 'bottom';
    export type BOTTOM = typeof BOTTOM;
}
export type VerticalAlign = VerticalAlign.TOP | VerticalAlign.MIDDLE | VerticalAlign.BOTTOM;

export namespace FontStyle {
    export const NORMAL: 'normal' = 'normal';
    export type NORMAL = typeof NORMAL;
    export const ITALIC: 'italic' = 'italic';
    export type ITALIC = typeof ITALIC;
}
export type FontStyle = FontStyle.NORMAL | FontStyle.ITALIC;

export namespace Interpolate {
    /** piecewise linear segments, as in a polyline */
    export const LINEAR: 'linear' = 'linear';
    export type LINEAR = typeof LINEAR;
    /** close the linear segments to form a polygon */
    export const LINEAR_CLOSED: 'linear-closed' = 'linear-closed';
    export type LINEAR_CLOSED = typeof LINEAR_CLOSED;
    /** alternate between horizontal and vertical segments, as in a step function */
    export const STEP: 'step' = 'step';
    export type STEP = typeof STEP;
    /** alternate between vertical and horizontal segments, as in a step function */
    export const STEP_BEFORE: 'step-before' = 'step-before';
    export type STEP_BEFORE = typeof STEP_BEFORE;
    /** alternate between horizontal and vertical segments, as in a step function */
    export const STEP_AFTER: 'step-after' = 'step-after';
    export type STEP_AFTER = typeof STEP_AFTER;
    /** a B-spline, with control point duplication on the ends */
    export const BASIS: 'basis' = 'basis';
    export type BASIS = typeof BASIS;
    /** an open B-spline; may not intersect the start or end */
    export const BASIS_OPEN: 'basis-open' = 'basis-open';
    export type BASIS_OPEN = typeof BASIS_OPEN;
    /** a closed B-spline, as in a loop */
    export const BASIS_CLOSED: 'basis-closed' = 'basis-closed';
    export type BASIS_CLOSED = typeof BASIS_CLOSED;
    /** a Cardinal spline, with control point duplication on the ends */
    export const CARDINAL: 'cardinal' = 'cardinal';
    export type CARDINAL = typeof CARDINAL;
    /** an open Cardinal spline; may not intersect the start or end, but will intersect other control points */
    export const CARDINAL_OPEN: 'cardinal-open' = 'cardinal-open';
    export type CARDINAL_OPEN = typeof CARDINAL_OPEN;
    /** a closed Cardinal spline, as in a loop */
    export const CARDINAL_CLOSED: 'cardinal-closed' = 'cardinal-closed';
    export type CARDINAL_CLOSED = typeof CARDINAL_CLOSED;
    /** equivalent to basis, except the tension parameter is used to straighten the spline */
    export const BUNDLE: 'bundle' = 'bundle';
    export type BUNDLE = typeof BUNDLE;
    /** cubic interpolation that preserves monotonicity in y */
    export const MONOTONE: 'monotone' = 'monotone';
    export type MONOTONE = typeof MONOTONE;
}
export type Interpolate = Interpolate.BASIS | Interpolate.BASIS_CLOSED | Interpolate.BASIS_OPEN
  | Interpolate.BUNDLE | Interpolate.CARDINAL | Interpolate.CARDINAL_CLOSED | Interpolate.CARDINAL_OPEN
  | Interpolate.LINEAR | Interpolate.LINEAR_CLOSED | Interpolate.MONOTONE | Interpolate.STEP
  | Interpolate.STEP_AFTER | Interpolate.STEP_BEFORE;

export namespace AreaOverlay {
  export const LINE: 'line' = 'line';
  export type LINE = typeof LINE;
  export const LINEPOINT: 'linepoint' = 'linepoint';
  export type LINEPOINT = typeof LINEPOINT;
  export const NONE: 'none' = 'none';
  export type NONE = typeof NONE;
}
export type AreaOverlay = AreaOverlay.LINE | AreaOverlay.LINEPOINT | AreaOverlay.NONE;

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

export interface MarkConfig {

  // ---------- Color ----------
  /**
   * Whether the shape\'s color should be used as fill color instead of stroke color.
   * This is only applicable for "bar", "point", and "area".
   * All marks except "point" marks are filled by default.
   * See Mark Documentation (http://vega.github.io/vega-lite/docs/marks.html)
   * for usage example.
   */
  filled?: boolean;

  /**
   * Default color.
   * @format color
   */
  color?: string;

  /**
   * Default Fill Color.  This has higher precedence than config.color
   * @format color
   */
  fill?: string;

  /**
   * Default Stroke Color.  This has higher precedence than config.color
   * @format color
   */
  stroke?: string;

  // ---------- Opacity ----------
  /**
   * @minimum 0
   * @maximum 1
   */
  opacity?: number;

  /**
   * @minimum 0
   * @maximum 1
   */
  fillOpacity?: number;

  /**
   * @minimum 0
   * @maximum 1
   */
  strokeOpacity?: number;

  // ---------- Stroke Style ----------
  /**
   * @minimum 0
   */
  strokeWidth?: number;

  /**
   * An array of alternating stroke, space lengths for creating dashed or dotted lines.
   */
  strokeDash?: number[];

  /**
   * The offset (in pixels) into which to begin drawing with the stroke dash array.
   */
  strokeDashOffset?: number;

  // ---------- Stacking: Bar & Area ----------
  stacked?: StackOffset;

  // ---------- Orientation: Bar, Tick, Line, Area ----------
  /**
   * The orientation of a non-stacked bar, tick, area, and line charts.
   * The value is either horizontal (default) or vertical.
   * - For bar, rule and tick, this determines whether the size of the bar and tick
   * should be applied to x or y dimension.
   * - For area, this property determines the orient property of the Vega output.
   * - For line, this property determines the sort order of the points in the line
   * if `config.sortLineBy` is not specified.
   * For stacked charts, this is always determined by the orientation of the stack;
   * therefore explicitly specified value will be ignored.
   */
  orient?: Orient;

  // ---------- Interpolation: Line / area ----------
  /**
   * The line interpolation method to use. One of linear, step-before, step-after, basis, basis-open, cardinal, cardinal-open, monotone.
   */
  interpolate?: Interpolate;
  /**
   * Depending on the interpolation type, sets the tension parameter.
   */
  tension?: number;

  // ---------- Line ---------
  /**
   * Size of line mark.
   */
  lineSize?: number;

  // ---------- Rule ---------
  /**
   * Size of rule mark.
   */
  ruleSize?: number;

  // ---------- Bar ----------
  /**
   * The size of the bars.  If unspecified, the default size is  `bandSize-1`,
   * which provides 1 pixel offset between bars.
   */
  barSize?: number;

  /**
   * The size of the bars on continuous scales.
   */
  barThinSize?: number;

  // ---------- Point ----------
  /**
   * The symbol shape to use. One of circle (default), square, cross, diamond, triangle-up, or triangle-down, or a custom SVG path.
   */
  shape?: Shape | string;

  // ---------- Point Size (Point / Square / Circle) ----------
  /**
   * The pixel area each the point. For example: in the case of circles, the radius is determined in part by the square root of the size value.
   */
  size?: number;

  // ---------- Tick ----------
  /** The width of the ticks. */
  tickSize?: number;

  /** Thickness of the tick mark. */
  tickThickness?: number;

  // ---------- Text ----------
  /**
   * The horizontal alignment of the text. One of left, right, center.
   */
  align?: HorizontalAlign;
  /**
   * The rotation angle of the text, in degrees.
   */
  angle?: number;
  /**
   * The vertical alignment of the text. One of top, middle, bottom.
   */
  baseline?: VerticalAlign;
  /**
   * The horizontal offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the angle property.
   */
  dx?: number;
  /**
   * The vertical offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the angle property.
   */
  dy?: number;
  /**
   * Polar coordinate radial offset, in pixels, of the text label from the origin determined by the x and y properties.
   */
  radius?: number;
  /**
   * Polar coordinate angle, in radians, of the text label from the origin determined by the x and y properties. Values for theta follow the same convention of arc mark startAngle and endAngle properties: angles are measured in radians, with 0 indicating "north".
   */
  theta?: number;
  /**
   * The typeface to set the text in (e.g., Helvetica Neue).
   */
  font?: string;
  /**
   * The font size, in pixels.
   */
  fontSize?: number;
  /**
   * The font style (e.g., italic).
   */
  fontStyle?: FontStyle;
  /**
   * The font weight (e.g., bold).
   */
  fontWeight?: FontWeight;
  // Vega-Lite only for text only
  /**
   * The formatting pattern for text value. If not defined, this will be determined automatically.
   */
  format?: string;
  /**
   * Whether month names and weekday names should be abbreviated.
   */
  shortTimeLabels?: boolean;
  /**
   * Placeholder Text
   */
  text?: string;

  /**
   * Offset between bar for binned field
   * @minimum 0
   */
  barBinSpacing?: number;

  /**
   * Apply color field to background color instead of the text.
   */
  applyColorToBackground?: boolean;
}

export const defaultMarkConfig: MarkConfig = {
  color: '#4682b4',
  shape: Shape.CIRCLE,
  strokeWidth: 2,
  size: 30,
  barThinSize: 2,
  // lineSize is undefined by default, and refer to value from strokeWidth
  ruleSize: 1,
  tickThickness: 1,

  fontSize: 10,
  baseline: VerticalAlign.MIDDLE,
  text: 'Abc',

  barBinSpacing: 1,

  applyColorToBackground: false
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
  mark: defaultMarkConfig,
  overlay: defaultOverlayConfig,
  scale: defaultScaleConfig,
  axis: defaultAxisConfig,
  legend: defaultLegendConfig,

  facet: defaultFacetConfig,
};
