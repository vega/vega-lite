import {StackOffset} from './stack';
import {ScaleType, NiceTime} from './scale';
import {isArray} from './util';

export interface VgData {
  name: string;
  source?: string;
  values?: any;
  format?: any;
  url?: any;
  transform?: any;
}

export type VgParentRef = {
  parent: string
};

export type VgFieldRef = string | VgParentRef | VgParentRef[];

export type VgSortField = boolean | {
  field: VgFieldRef,
  op: string
};

export type VgDataRef = {
  data: string,
  field: VgFieldRef,
  sort?: VgSortField
};

export type VgSignalRef = {
  signal: string
};

// TODO: add type of value (Make it VgValueRef<T> {value?:T ...})
export type VgValueRef = {
  value?: number | string | boolean,
  field?: string | {
    datum?: string,
    group?: string,
    parent?: string
  },
  signal?: string;
  scale?: string, // TODO: object
  mult?: number,
  offset?: number | VgValueRef,
  band?: boolean | number
};

// TODO: add vg prefix
export type DataRefUnionDomain = {
  fields: (any[] | VgDataRef)[],
  sort?: boolean | {
    op: 'count'
  }
};

// TODO: add vg prefix
export type FieldRefUnionDomain = {
  data: string,
  fields: VgFieldRef[],
  sort?: boolean | {
    op: 'count'
  }
};

export type VgRangeScheme = {scheme: string, extent?: number[], count?: number};
export type VgRange = string | VgDataRef | (number|string|VgDataRef)[] | VgRangeScheme | {step: number};

export type VgDomain = any[] | VgDataRef | DataRefUnionDomain | FieldRefUnionDomain | VgSignalRef;

export type VgScale = {
  name: string,
  type: ScaleType,
  domain: VgDomain,
  domainRaw?: VgSignalRef,
  range: VgRange,

  clamp?: boolean,
  exponent?: number,
  nice?: boolean | NiceTime,
  padding?: number,
  paddingInner?: number,
  paddingOuter?: number,
  reverse?: boolean,
  round?: boolean,
  zero?: boolean
};

export function isDataRefUnionedDomain(domain: VgDomain): domain is DataRefUnionDomain {
  if (!isArray(domain)) {
    return 'fields' in domain && !('data' in domain);
  }
  return false;
}

export function isFieldRefUnionDomain(domain: VgDomain): domain is FieldRefUnionDomain {
  if (!isArray(domain)) {
    return 'fields' in domain && 'data' in domain;
  }
  return false;
}

export function isDataRefDomain(domain: VgDomain): domain is VgDataRef {
  if (!isArray(domain)) {
    return !('fields' in domain);
  }
  return false;
}

export type VgEncodeEntry = any;
// TODO: make export interface VgEncodeEntry {
//   x?: VgValueRef<number>
//   y?: VgValueRef<number>
//  ...
//   color?: VgValueRef<string>
//  ...
// }

export type VgAxis = any;
export type VgLegend = any;

export interface VgBinTransform {
  type: 'bin';
  field: string;
  as: string;
  extent?: {signal: string};
  // TODO: add other properties
}

export interface VgExtentTransform {
  type: 'extent';
  field: string;
  signal: string;
}

export interface VgFormulaTransform {
  type: 'formula';
  as: string;
  expr: string;
}

export interface VgAxisEncode {
  ticks?: VgGuideEncode;
  labels?: VgGuideEncode;
  title?: VgGuideEncode;
  grid?: VgGuideEncode;
  domain?: VgGuideEncode;
}

export interface VgLegendEncode {
  title?: VgGuideEncode;
  labels?: VgGuideEncode;
  legend?: VgGuideEncode;
  symbols?: VgGuideEncode;
  gradient?: VgGuideEncode;
}

export type VgGuideEncode = any; // TODO: replace this (See guideEncode in Vega Schema)

export type VgTransform = VgBinTransform | VgExtentTransform | VgFormulaTransform | any;

export interface VgStackTransform {
  type: 'stack';
  offset?: StackOffset;
  groupby: string[];
  field: string;
  sort: VgSort;
  as: string[];
}

export type VgSort = {
  field: string;
  order: 'ascending' | 'descending';
} | {
  field: string[];
  order: ('ascending' | 'descending')[];
};

export interface VgImputeTransform {
  type: 'impute';
  groupby?: string[];
  field: string;
  orderby?: string[];
  method?: 'value' | 'median' | 'max' | 'min' | 'mean';
  value?: any;
};

export type VgCheckboxBinding = {
  input: 'checkbox';
  element?: string;
};

export type VgRadioBinding = {
  input: 'radio';
  options: string[];
  element?: string;
};

export type VgSelectBinding = {
  input: 'select';
  options: string[];
  element?: string;
};

export type VgRangeBinding = {
  input: 'range';
  min?: number;
  max?: number;
  step?: number;
  element?: string;
};

export type VgGenericBinding = {
  input: string;
  element?: string;
};

export type VgBinding = VgCheckboxBinding | VgRadioBinding |
  VgSelectBinding | VgRangeBinding | VgGenericBinding;


/**
 * Base object for Vega's Axis and Axis Config.
 * All of these properties are both properties of Vega's Axis and Axis Config.
 */
export interface VgAxisBase {
  /**
   * Whether to include the axis domain line.
   */
  domain?: boolean;

  /**
   * A flag indicate if gridlines should be created in addition to ticks. If `grid` is unspecified, the default value is `true` for ROW and COL. For X and Y, the default value is `true` for quantitative and time fields and `false` otherwise.
   */
  grid?: boolean;

  /**
   * Enable or disable labels.
   */
  labels?: boolean;

  /**
   * The rotation angle of the axis labels.
   * @minimum 0
   * @maximum 360
   */
  labelAngle?: number;  // FIXME: not sure if this should be a theme

  /**
   * Whether the axis should include ticks.
   */
  ticks?: boolean;

  /**
   * The size, in pixels, of major, minor and end ticks.
   * @minimum 0
   */
  tickSize?: number;

  /**
   * Max length for axis title if the title is automatically generated from the field's description. By default, this is automatically based on cell size and characterWidth property.
   * @minimum 0
   * @TJS-type integer
   */
  titleMaxLength?: number;

  /**
   * The padding, in pixels, between title and axis.
   */
  titlePadding?: number;

  /**
   * Minimum extent, which determines the offset between axis ticks and labels.
   */
  minExtent?: number;

  /**
   * Maximum extent, which determines the offset between axis ticks and labels.
   */
  maxExtent?: number;
}

export interface VgAxisConfig extends VgAxisBase {
 // ---------- Axis ----------
  /**
   * Width of the domain line
   */
  domainWidth?: number;

  /**
   * Color of axis domain line.
   */
  domainColor?: string;

  // ---------- Grid ----------
  /**
   * Color of gridlines.
   */
  gridColor?: string;

  /**
   * The offset (in pixels) into which to begin drawing with the grid dash array.
   * @minimum 0
   */
  gridDash?: number[];

  /**
   * The stroke opacity of grid (value between [0,1])
   * @minimum 0
   * @maximum 1
   */
  gridOpacity?: number;

  /**
   * The grid width, in pixels.
   * @minimum 0
   */
  gridWidth?: number;

  // ---------- Ticks ----------
  /**
   * The color of the axis's tick.
   */
  tickColor?: string;

  /**
   * The color of the tick label, can be in hex color code or regular color name.
   */
  labelColor?: string;

  /**
   * The font of the tick label.
   */
  labelFont?: string;

  /**
   * The font size of label, in pixels.
   * @minimum 0
   */
  labelFontSize?: number;

  /**
   * The width, in pixels, of ticks.
   * @minimum 0
   */
  tickWidth?: number;

  // ---------- Title ----------
  /**
   * Color of the title, can be in hex color code or regular color name.
   */
  titleColor?: string;

  /**
   * Font of the title.
   */
  titleFont?: string;

  /**
   * Size of the title.
   * @minimum 0
   */
  titleFontSize?: number;

  /**
   * Weight of the title.
   */
  titleFontWeight?: string | number;
  /**
   * Whether month names and weekday names should be abbreviated.
   */
  shortTimeLabels?: boolean;
}

export interface VgLegendBase {
  /**
   * Padding (in pixels) between legend entries in a symbol legend.
   */
  entryPadding?: number;

  /**
   * The orientation of the legend. One of "left" or "right". This determines how the legend is positioned within the scene. The default is "right".
   */
  orient?: string;

  /**
   * The offset, in pixels, by which to displace the legend from the edge of the enclosing group or data rectangle.
   */
  offset?: number;

  /**
   * The padding, in pixels, between the legend and axis.
   */
  padding?: number;
}

export interface VgLegendConfig extends VgLegendBase {
  // ---------- Gradient ----------
  /**
   * The color of the gradient stroke, can be in hex color code or regular color name.
   */
  gradientStrokeColor?: string;

  /**
   * The width of the gradient stroke, in pixels.
   * @mimimum 0
   */
  gradientStrokeWidth?: number;

  /**
   * The height of the gradient, in pixels.
   * @mimimum 0
   */
  gradientHeight?: number;

  /**
   * The width of the gradient, in pixels.
   * @mimimum 0
   */
  gradientWidth?: number;

  // ---------- Label ----------
  /**
   * The alignment of the legend label, can be left, middle or right.
   */
  labelAlign?: string;

  /**
   * The position of the baseline of legend label, can be top, middle or bottom.
   */
  labelBaseline?: string;

  /**
   * The color of the legend label, can be in hex color code or regular color name.
   */
  labelColor?: string;

  /**
   * The font of the legend label.
   */
  labelFont?: string;

  /**
   * The font size of legend label.
   * @mimimum 0
   */
  labelFontSize?: number;

  /**
   * The offset of the legend label.
   * @mimimum 0
   */
  labelOffset?: number;

  // ---------- Symbols ----------
  /**
   * The color of the legend symbol,
   */
  symbolColor?: string;

  // FIXME: need better description
  /**
   * Default shape type (such as "circle") for legend symbols.
   */
  symbolType?: string;

  /**
   * The size of the legend symbol, in pixels.
   * @mimimum 0
   */
  symbolSize?: number;

  /**
   * The width of the symbol's stroke.
   * @minimum 0
   */
  symbolStrokeWidth?: number;

  // ---------- Title ----------
  /**
   * Optional mark property definitions for custom legend styling.
   */
  /**
   * The color of the legend title, can be in hex color code or regular color name.
   */
  titleColor?: string;

  /**
   * The font of the legend title.
   */
  titleFont?: string;

  /**
   * The font size of the legend title.
   */
  titleFontSize?: number;

  /**
   * The font weight of the legend title.
   */
  titleFontWeight?: string | number;

  /**
   * The padding, in pixels, between title and legend.
   */
  titlePadding?: number;
}
