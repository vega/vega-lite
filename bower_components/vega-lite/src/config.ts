import {ScaleConfig, FacetScaleConfig, defaultScaleConfig, defaultFacetScaleConfig} from './scale';
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
  /** Facet Scale Config */
  scale?: FacetScaleConfig;

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
  scale: defaultFacetScaleConfig,
  axis: defaultFacetAxisConfig,
  grid: defaultFacetGridConfig,
  cell: defaultFacetCellConfig
};

export enum FontWeight {
    NORMAL = 'normal' as any,
    BOLD = 'bold' as any
}

export enum Shape {
    CIRCLE = 'circle' as any,
    SQUARE = 'square' as any,
    CROSS = 'cross' as any,
    DIAMOND = 'diamond' as any,
    TRIANGLEUP = 'triangle-up' as any,
    TRIANGLEDOWN = 'triangle-down' as any,
}

export enum Orient {
  HORIZONTAL = 'horizontal' as any,
  VERTICAL = 'vertical' as any
}

export enum HorizontalAlign {
    LEFT = 'left' as any,
    RIGHT = 'right' as any,
    CENTER = 'center' as any,
}

export enum VerticalAlign {
    TOP = 'top' as any,
    MIDDLE = 'middle' as any,
    BOTTOM = 'bottom' as any,
}

export enum FontStyle {
    NORMAL = 'normal' as any,
    ITALIC = 'italic' as any,
}

export enum Interpolate {
    /** piecewise linear segments, as in a polyline */
    LINEAR = 'linear' as any,
    /** close the linear segments to form a polygon */
    LINEAR_CLOSED = 'linear-closed' as any,
    /** alternate between horizontal and vertical segments, as in a step function */
    STEP = 'step' as any,
    /** alternate between vertical and horizontal segments, as in a step function */
    STEP_BEFORE = 'step-before' as any,
    /** alternate between horizontal and vertical segments, as in a step function */
    STEP_AFTER = 'step-after' as any,
    /** a B-spline, with control point duplication on the ends */
    BASIS = 'basis' as any,
    /** an open B-spline; may not intersect the start or end */
    BASIS_OPEN = 'basis-open' as any,
    /** a closed B-spline, as in a loop */
    BASIS_CLOSED = 'basis-closed' as any,
    /** a Cardinal spline, with control point duplication on the ends */
    CARDINAL = 'cardinal' as any,
    /** an open Cardinal spline; may not intersect the start or end, but will intersect other control points */
    CARDINAL_OPEN = 'cardinal-open' as any,
    /** a closed Cardinal spline, as in a loop */
    CARDINAL_CLOSED = 'cardinal-closed' as any,
    /** equivalent to basis, except the tension parameter is used to straighten the spline */
    BUNDLE = 'bundle' as any,
    /** cubic interpolation that preserves monotonicity in y */
    MONOTONE = 'monotone' as any,
}

export enum AreaOverlay {
  LINE = 'line' as any,
  LINEPOINT = 'linepoint' as any,
  NONE = 'none' as any
}

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

  shortTimeLabels: false,
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
  timeFormat: '%Y-%m-%d',
  countTitle: 'Number of Records',

  cell: defaultCellConfig,
  mark: defaultMarkConfig,
  overlay: defaultOverlayConfig,
  scale: defaultScaleConfig,
  axis: defaultAxisConfig,
  legend: defaultLegendConfig,

  facet: defaultFacetConfig,
};
