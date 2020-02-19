import {
  AggregateOp,
  BandScale,
  BaseScale,
  BinOrdinalScale,
  ColorValueRef,
  Compare as VgCompare,
  ExprRef as VgExprRef,
  GeoShapeTransform as VgGeoShapeTransform,
  IdentityScale,
  LayoutAlign,
  LinearScale,
  LogScale,
  MarkConfig as VgMarkConfig,
  NumericValueRef,
  OrdinalScale,
  PointScale,
  PowScale,
  ProjectionType,
  QuantileScale,
  QuantizeScale,
  RangeBand,
  RangeRaw,
  RangeScheme,
  ScaleData,
  ScaleDataRef,
  ScaledValueRef,
  ScaleMultiDataRef,
  ScaleMultiFieldsRef,
  SequentialScale,
  SignalRef,
  SortField as VgSortField,
  SqrtScale,
  SymLogScale,
  ThresholdScale,
  TimeInterval,
  TimeIntervalStep,
  TimeScale,
  Title as VgTitle,
  Transforms as VgTransform,
  UnionSortField as VgUnionSortField
} from 'vega-typings';
import {isArray} from 'vega-util';
import {ValueOrGradientOrText} from './channeldef';
import {SortOrder} from './sort';
import {Flag, keys} from './util';

export {VgSortField, VgUnionSortField, VgCompare, VgTitle, LayoutAlign, ProjectionType, VgExprRef};

// TODO: make recursive
type ExcludeMapped<T, E> = {
  [P in keyof T]: Exclude<T[P], E>;
};

// Remove ValueRefs from mapped types
export type ExcludeMappedValueRef<T> = ExcludeMapped<T, ScaledValueRef<any> | NumericValueRef | ColorValueRef>;

export type ExcludeMappedValueRefButKeepSignal<T> = ExcludeMapped<
  T,
  Exclude<ScaledValueRef<any> | NumericValueRef | ColorValueRef, SignalRef>
>;

export interface VgData {
  name: string;
  source?: string;
  values?: any;
  format?: {
    type?: string;
    parse?: string | object;
    property?: string;
    feature?: string;
    mesh?: string;
  };
  url?: string;
  transform?: VgTransform[];
}

export type VgScaleDataRefWithSort = ScaleDataRef & {
  sort?: VgSortField;
};

export function isSignalRef(o: any): o is SignalRef {
  return o && !!o['signal'];
}

// TODO: add type of value (Make it VgValueRef<V extends ValueOrGradient> {value?:V ...})
export interface VgValueRef {
  value?: ValueOrGradientOrText | number[];
  field?:
    | string
    | {
        datum?: string;
        group?: string;
        parent?: string;
      };
  signal?: string;
  scale?: string; // TODO: object
  mult?: number;
  offset?: number | VgValueRef;
  band?: boolean | number | VgValueRef;
  test?: string;
}

// TODO: add vg prefix
export type VgScaleMultiDataRefWithSort = ScaleMultiDataRef & {
  fields: (any[] | VgScaleDataRefWithSort | SignalRef)[];
  sort?: VgUnionSortField;
};

export type VgMultiFieldsRefWithSort = ScaleMultiFieldsRef & {
  sort?: VgUnionSortField;
};

export type VgRange = RangeScheme | ScaleData | RangeBand | RangeRaw;

export function isVgRangeStep(range: VgRange): range is VgRangeStep {
  return !!range['step'];
}

export interface VgRangeStep {
  step: number | SignalRef;
}
// Domains that are not a union of domains
export type VgNonUnionDomain = (null | string | number | boolean | SignalRef)[] | VgScaleDataRefWithSort | SignalRef;

export type VgDomain = BaseScale['domain'];

export type VgMarkGroup = any;

/**
 * A combined type for any Vega scales that Vega-Lite can generate
 */
export type VgScale = Pick<BaseScale, 'type'> & {
  range?: RangeScheme | RangeBand | ScaleData; // different Vega scales have conflicting range, need to union them here
  nice?: boolean | number | TimeInterval | TimeIntervalStep | SignalRef; // different Vega scales have conflicting range, need to union them here
  zero?: boolean | SignalRef; // LogScale only allow false, making the intersection type overly strict
} & Omit<
    // Continuous

    LinearScale &
      LogScale &
      SymLogScale &
      Partial<PowScale> & // use partial so exponent is not required
      SqrtScale &
      IdentityScale &
      TimeScale &
      // discretizing
      QuantileScale &
      QuantizeScale &
      ThresholdScale &
      BinOrdinalScale &
      // sequential
      SequentialScale &
      // discrete
      BandScale &
      PointScale &
      OrdinalScale,
    'type' | 'range' | 'nice' | 'zero'
  >;

export interface RowCol<T> {
  row?: T;
  column?: T;
}

export interface VgLayout {
  center?: boolean | RowCol<boolean>;
  padding?: number | RowCol<number>;
  headerBand?: number | RowCol<number>;
  footerBand?: number | RowCol<number>;

  titleAnchor?: 'start' | 'end' | RowCol<'start' | 'end'>;
  offset?:
    | number
    | {
        rowHeader?: number;
        rowFooter?: number;
        rowTitle?: number;
        columnHeader?: number;
        columnFooter?: number;
        columnTitle?: number;
      };
  bounds?: 'full' | 'flush';
  columns?: number | {signal: string};
  align?: LayoutAlign | RowCol<LayoutAlign>;
}

export function isDataRefUnionedDomain(domain: VgDomain): domain is VgScaleMultiDataRefWithSort {
  if (!isArray(domain)) {
    return 'fields' in domain && !('data' in domain);
  }
  return false;
}

export function isFieldRefUnionDomain(domain: VgDomain): domain is VgMultiFieldsRefWithSort {
  if (!isArray(domain)) {
    return 'fields' in domain && 'data' in domain;
  }
  return false;
}

export function isDataRefDomain(domain: VgDomain): domain is VgScaleDataRefWithSort {
  if (!isArray(domain)) {
    return 'field' in domain && 'data' in domain;
  }
  return false;
}

export type VgEncodeChannel =
  | 'x'
  | 'x2'
  | 'xc'
  | 'width'
  | 'y'
  | 'y2'
  | 'yc'
  | 'height'
  | 'opacity'
  | 'fill'
  | 'fillOpacity'
  | 'stroke'
  | 'strokeWidth'
  | 'strokeCap'
  | 'strokeOpacity'
  | 'strokeDash'
  | 'strokeDashOffset'
  | 'strokeMiterLimit'
  | 'strokeJoin'
  | 'strokeOffset'
  | 'strokeForeground'
  | 'cursor'
  | 'clip'
  | 'size'
  | 'shape'
  | 'path'
  | 'innerRadius'
  | 'outerRadius'
  | 'startAngle'
  | 'endAngle'
  | 'interpolate'
  | 'tension'
  | 'orient'
  | 'url'
  | 'align'
  | 'baseline'
  | 'text'
  | 'dir'
  | 'ellipsis'
  | 'limit'
  | 'dx'
  | 'dy'
  | 'radius'
  | 'theta'
  | 'angle'
  | 'font'
  | 'fontSize'
  | 'fontWeight'
  | 'fontStyle'
  | 'tooltip'
  | 'href'
  | 'cursor'
  | 'defined'
  | 'cornerRadius'
  | 'cornerRadiusTopLeft'
  | 'cornerRadiusTopRight'
  | 'cornerRadiusBottomRight'
  | 'cornerRadiusBottomLeft'
  | 'scaleX'
  | 'scaleY';

export type VgEncodeEntry = {[k in VgEncodeChannel]?: VgValueRef | (VgValueRef & {test?: string})[]};

// TODO: make export interface VgEncodeEntry {
//   x?: VgValueRef<number>
//   y?: VgValueRef<number>
//  ...
//   color?: VgValueRef<string>
//  ...
// }

export type VgPostEncodingTransform = VgGeoShapeTransform;

export type VgGuideEncode = any; // TODO: replace this (See guideEncode in Vega Schema)

export type StrokeCap = 'butt' | 'round' | 'square';
export type StrokeJoin = 'miter' | 'round' | 'bevel';
export type Dir = 'ltr' | 'rtl';

const VG_MARK_CONFIG_INDEX: Flag<keyof VgMarkConfig> = {
  opacity: 1,
  fill: 1,
  fillOpacity: 1,
  stroke: 1,
  strokeCap: 1,
  strokeWidth: 1,
  strokeOpacity: 1,
  strokeDash: 1,
  strokeDashOffset: 1,
  strokeJoin: 1,
  strokeOffset: 1,
  strokeMiterLimit: 1,
  size: 1,
  shape: 1,
  interpolate: 1,
  tension: 1,
  orient: 1,
  align: 1,
  baseline: 1,
  text: 1,
  dir: 1,
  dx: 1,
  dy: 1,
  ellipsis: 1,
  limit: 1,
  radius: 1,
  theta: 1,
  angle: 1,
  font: 1,
  fontSize: 1,
  fontWeight: 1,
  fontStyle: 1,
  lineBreak: 1,
  lineHeight: 1,
  cursor: 1,
  href: 1,
  tooltip: 1,
  cornerRadius: 1,
  cornerRadiusTopLeft: 1,
  cornerRadiusTopRight: 1,
  cornerRadiusBottomLeft: 1,
  cornerRadiusBottomRight: 1,
  aspect: 1,
  width: 1,
  height: 1

  // commented below are vg channel that do not have mark config.
  // x: 1,
  // y: 1,
  // x2: 1,
  // y2: 1,

  // xc'|'yc'
  // clip: 1,
  // endAngle: 1,
  // innerRadius: 1,
  // outerRadius: 1,
  // path: 1,
  // startAngle: 1,
  // url: 1,
};

export const VG_MARK_CONFIGS = keys(VG_MARK_CONFIG_INDEX);

// Vega's cornerRadius channels.
export const VG_CORNERRADIUS_CHANNELS = [
  'cornerRadius',
  'cornerRadiusTopLeft',
  'cornerRadiusTopRight',
  'cornerRadiusBottomLeft',
  'cornerRadiusBottomRight'
] as const;

export interface VgComparator {
  field?: string | string[];
  order?: SortOrder | SortOrder[];
}

export interface VgJoinAggregateTransform {
  type: 'joinaggregate';
  as?: string[];
  ops?: AggregateOp[];
  fields?: string[];
  groupby?: string[];
}
