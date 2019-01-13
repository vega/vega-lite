import { AggregateOp, Align, Compare as VgCompare, Field as VgField, FlattenTransform as VgFlattenTransform, FoldTransform as VgFoldTransform, FontStyle as VgFontStyle, FontWeight as VgFontWeight, SampleTransform as VgSampleTransform, SignalRef, SortField as VgSortField, TextBaseline as VgTextBaseline, UnionSortField as VgUnionSortField } from 'vega';
import { BaseBin } from './bin';
import { NiceTime, ScaleType } from './scale';
import { StackOffset } from './stack';
import { WindowOnlyOp } from './transform';
export { VgSortField, VgUnionSortField, VgCompare };
export declare type Color = string;
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
export interface VgDataRef {
    data: string;
    field: VgField;
    sort?: VgSortField;
}
export declare function isSignalRef(o: any): o is SignalRef;
export declare type VgEventStream = any;
export interface VgValueRef {
    value?: number | string | boolean;
    field?: string | {
        datum?: string;
        group?: string;
        parent?: string;
    };
    signal?: string;
    scale?: string;
    mult?: number;
    offset?: number | VgValueRef;
    band?: boolean | number | VgValueRef;
}
export interface DataRefUnionDomain {
    fields: (any[] | VgDataRef | SignalRef)[];
    sort?: VgUnionSortField;
}
export interface VgFieldRefUnionDomain {
    data: string;
    fields: VgField[];
    sort?: VgUnionSortField;
}
export interface VgScheme {
    scheme: string;
    extent?: number[];
    count?: number;
}
export declare type VgRange<S> = string | VgDataRef | (number | string | VgDataRef | S)[] | VgScheme | VgRangeStep | S;
export declare function isVgRangeStep(range: VgRange<any>): range is VgRangeStep;
export interface VgRangeStep {
    step: number | SignalRef;
}
export declare type VgNonUnionDomain = any[] | VgDataRef | SignalRef;
export declare type VgDomain = VgNonUnionDomain | DataRefUnionDomain | VgFieldRefUnionDomain;
export declare type VgMarkGroup = any;
export declare type VgProjectionType = 'albers' | 'albersUsa' | 'azimuthalEqualArea' | 'azimuthalEquidistant' | 'conicConformal' | 'conicEqualArea' | 'conicEquidistant' | 'equirectangular' | 'gnomonic' | 'mercator' | 'orthographic' | 'stereographic' | 'transverseMercator';
export interface VgProjection {
    name: string;
    type?: VgProjectionType;
    clipAngle?: number;
    clipExtent?: number[][];
    scale?: number;
    translate?: number[];
    center?: number[];
    /**
     * The rotation of the projection.
     */
    rotate?: number[];
    precision?: string;
    fit?: SignalRef | object | any[];
    extent?: SignalRef | number[][];
    size?: SignalRef | (number | SignalRef)[];
    coefficient?: number;
    distance?: number;
    fraction?: number;
    lobes?: number;
    parallel?: number;
    radius?: number;
    ratio?: number;
    spacing?: number;
    tilt?: number;
}
export interface VgScale {
    name: string;
    type: ScaleType;
    domain: VgDomain;
    domainRaw?: SignalRef;
    range: VgRange<SignalRef>;
    clamp?: boolean;
    base?: number;
    exponent?: number;
    interpolate?: ScaleInterpolate | ScaleInterpolateParams;
    nice?: boolean | number | NiceTime | {
        interval: string;
        step: number;
    };
    padding?: number;
    paddingInner?: number;
    paddingOuter?: number;
    reverse?: boolean;
    round?: boolean;
    zero?: boolean;
}
export declare type ScaleInterpolate = 'rgb' | 'lab' | 'hcl' | 'hsl' | 'hsl-long' | 'hcl-long' | 'cubehelix' | 'cubehelix-long';
export interface ScaleInterpolateParams {
    type: 'rgb' | 'cubehelix' | 'cubehelix-long';
    gamma?: number;
}
export declare type VgLayoutAlign = 'none' | 'each' | 'all';
export interface RowCol<T> {
    row?: T;
    column?: T;
}
export interface VgLayout {
    center?: boolean | RowCol<boolean>;
    padding?: number | RowCol<number>;
    headerBand?: number | RowCol<number>;
    footerBand?: number | RowCol<number>;
    offset?: number | {
        rowHeader?: number;
        rowFooter?: number;
        rowTitle?: number;
        columnHeader?: number;
        columnFooter?: number;
        columnTitle?: number;
    };
    bounds?: 'full' | 'flush';
    columns?: number | {
        signal: string;
    };
    align?: VgLayoutAlign | RowCol<VgLayoutAlign>;
}
export declare function isDataRefUnionedDomain(domain: VgDomain): domain is DataRefUnionDomain;
export declare function isFieldRefUnionDomain(domain: VgDomain): domain is VgFieldRefUnionDomain;
export declare function isDataRefDomain(domain: VgDomain): domain is VgDataRef;
export declare function isSignalRefDomain(domain: VgDomain): domain is SignalRef;
export declare type VgEncodeChannel = 'x' | 'x2' | 'xc' | 'width' | 'y' | 'y2' | 'yc' | 'height' | 'opacity' | 'fill' | 'fillOpacity' | 'stroke' | 'strokeWidth' | 'strokeCap' | 'strokeOpacity' | 'strokeDash' | 'strokeDashOffset' | 'strokeMiterLimit' | 'strokeJoin' | 'cursor' | 'clip' | 'size' | 'shape' | 'path' | 'innerRadius' | 'outerRadius' | 'startAngle' | 'endAngle' | 'interpolate' | 'tension' | 'orient' | 'url' | 'align' | 'baseline' | 'text' | 'dir' | 'ellipsis' | 'limit' | 'dx' | 'dy' | 'radius' | 'theta' | 'angle' | 'font' | 'fontSize' | 'fontWeight' | 'fontStyle' | 'tooltip' | 'href' | 'cursor' | 'defined' | 'cornerRadius';
export declare type VgEncodeEntry = {
    [k in VgEncodeChannel]?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
};
export interface VgBinTransform extends BaseBin {
    type: 'bin';
    extent?: number[] | {
        signal: string;
    };
    field: string;
    as: string[];
    signal?: string;
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
export interface VgFilterTransform {
    type: 'filter';
    expr: string;
}
export interface VgAggregateTransform {
    type: 'aggregate';
    groupby?: VgField[];
    fields?: VgField[];
    ops?: AggregateOp[];
    as?: string[];
    cross?: boolean;
    drop?: boolean;
}
export interface VgCollectTransform {
    type: 'collect';
    sort: VgCompare;
}
export interface VgLookupTransform {
    type: 'lookup';
    from: string;
    key: string;
    fields: string[];
    values?: string[];
    as?: string[];
    default?: string;
}
export interface VgStackTransform {
    type: 'stack';
    offset?: StackOffset;
    groupby: string[];
    field: string;
    sort: VgCompare;
    as: string[];
}
export interface VgIdentifierTransform {
    type: 'identifier';
    as: string;
}
export declare type VgTransform = VgBinTransform | VgExtentTransform | VgFormulaTransform | VgAggregateTransform | VgFilterTransform | VgFlattenTransform | VgImputeTransform | VgStackTransform | VgCollectTransform | VgLookupTransform | VgIdentifierTransform | VgGeoPointTransform | VgGeoJSONTransform | VgWindowTransform | VgFoldTransform | VgSampleTransform;
export interface VgGeoPointTransform {
    type: 'geopoint';
    projection: string;
    fields: VgField[];
    as?: string[];
}
export interface VgGeoShapeTransform {
    type: 'geoshape';
    projection: string;
    field?: VgField;
    as?: string;
}
export interface VgGeoJSONTransform {
    type: 'geojson';
    fields?: VgField[];
    geojson?: VgField;
    signal: string;
}
export declare type VgPostEncodingTransform = VgGeoShapeTransform;
export declare type VgGuideEncode = any;
export declare type ImputeMethod = 'value' | 'median' | 'max' | 'min' | 'mean';
export interface VgImputeTransform {
    type: 'impute';
    groupby?: string[];
    field: string;
    key: string;
    keyvals?: any[] | SignalRef;
    method?: ImputeMethod;
    value?: any;
}
export declare type Interpolate = 'linear' | 'linear-closed' | 'step' | 'step-before' | 'step-after' | 'basis' | 'basis-open' | 'basis-closed' | 'cardinal' | 'cardinal-open' | 'cardinal-closed' | 'bundle' | 'monotone';
export declare type Orient = 'horizontal' | 'vertical';
export declare type Cursor = 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing';
export declare type StrokeCap = 'butt' | 'round' | 'square';
export declare type StrokeJoin = 'miter' | 'round' | 'bevel';
export declare type Dir = 'ltr' | 'rtl';
export interface VgMarkConfig {
    /**
     * Default Fill Color.  This has higher precedence than `config.color`
     *
     * __Default value:__ (None)
     *
     */
    fill?: Color;
    /**
     * Default Stroke Color.  This has higher precedence than `config.color`
     *
     * __Default value:__ (None)
     *
     */
    stroke?: Color;
    /**
     * The overall opacity (value between [0,1]).
     *
     * __Default value:__ `0.7` for non-aggregate plots with `point`, `tick`, `circle`, or `square` marks or layered `bar` charts and `1` otherwise.
     *
     * @minimum 0
     * @maximum 1
     */
    opacity?: number;
    /**
     * The fill opacity (value between [0,1]).
     *
     * __Default value:__ `1`
     *
     * @minimum 0
     * @maximum 1
     */
    fillOpacity?: number;
    /**
     * The stroke opacity (value between [0,1]).
     *
     * __Default value:__ `1`
     *
     * @minimum 0
     * @maximum 1
     */
    strokeOpacity?: number;
    /**
     * The stroke width, in pixels.
     *
     * @minimum 0
     */
    strokeWidth?: number;
    /**
     * The stroke cap for line ending style. One of `"butt"`, `"round"`, or `"square"`.
     *
     * __Default value:__ `"square"`
     */
    strokeCap?: StrokeCap;
    /**
     * An array of alternating stroke, space lengths for creating dashed or dotted lines.
     */
    strokeDash?: number[];
    /**
     * The offset (in pixels) into which to begin drawing with the stroke dash array.
     */
    strokeDashOffset?: number;
    /**
     * The stroke line join method. One of `"miter"`, `"round"` or `"bevel"`.
     *
     * __Default value:__ `"miter"`
     */
    strokeJoin?: StrokeJoin;
    /**
     * The miter limit at which to bevel a line join.
     */
    strokeMiterLimit?: number;
    /**
     * The orientation of a non-stacked bar, tick, area, and line charts.
     * The value is either horizontal (default) or vertical.
     * - For bar, rule and tick, this determines whether the size of the bar and tick
     * should be applied to x or y dimension.
     * - For area, this property determines the orient property of the Vega output.
     * - For line and trail marks, this property determines the sort order of the points in the line
     * if `config.sortLineBy` is not specified.
     * For stacked charts, this is always determined by the orientation of the stack;
     * therefore explicitly specified value will be ignored.
     */
    orient?: Orient;
    /**
     * The line interpolation method to use for line and area marks. One of the following:
     * - `"linear"`: piecewise linear segments, as in a polyline.
     * - `"linear-closed"`: close the linear segments to form a polygon.
     * - `"step"`: alternate between horizontal and vertical segments, as in a step function.
     * - `"step-before"`: alternate between vertical and horizontal segments, as in a step function.
     * - `"step-after"`: alternate between horizontal and vertical segments, as in a step function.
     * - `"basis"`: a B-spline, with control point duplication on the ends.
     * - `"basis-open"`: an open B-spline; may not intersect the start or end.
     * - `"basis-closed"`: a closed B-spline, as in a loop.
     * - `"cardinal"`: a Cardinal spline, with control point duplication on the ends.
     * - `"cardinal-open"`: an open Cardinal spline; may not intersect the start or end, but will intersect other control points.
     * - `"cardinal-closed"`: a closed Cardinal spline, as in a loop.
     * - `"bundle"`: equivalent to basis, except the tension parameter is used to straighten the spline.
     * - `"monotone"`: cubic interpolation that preserves monotonicity in y.
     */
    interpolate?: Interpolate;
    /**
     * Depending on the interpolation type, sets the tension parameter (for line and area marks).
     * @minimum 0
     * @maximum 1
     */
    tension?: number;
    /**
     * The default symbol shape to use. One of: `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"`, or a custom SVG path.
     *
     * __Default value:__ `"circle"`
     *
     */
    shape?: string;
    /**
     * The pixel area each the point/circle/square.
     * For example: in the case of circles, the radius is determined in part by the square root of the size value.
     *
     * __Default value:__ `30`
     *
     * @minimum 0
     */
    size?: number;
    /**
     * The horizontal alignment of the text. One of `"left"`, `"right"`, `"center"`.
     */
    align?: Align;
    /**
     * The rotation angle of the text, in degrees.
     * @minimum 0
     * @maximum 360
     */
    angle?: number;
    /**
     * The vertical alignment of the text. One of `"top"`, `"middle"`, `"bottom"`.
     *
     * __Default value:__ `"middle"`
     *
     */
    baseline?: VgTextBaseline;
    /**
     * The direction of the text. One of `"ltr"` (left-to-right) or `"rtl"` (right-to-left). This property determines on which side is truncated in response to the limit parameter.
     *
     * __Default value:__ `"ltr"`
     */
    dir?: Dir;
    /**
     * The horizontal offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the _angle_ property.
     */
    dx?: number;
    /**
     * The vertical offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the _angle_ property.
     */
    dy?: number;
    /**
     * Polar coordinate radial offset, in pixels, of the text label from the origin determined by the `x` and `y` properties.
     * @minimum 0
     */
    radius?: number;
    /**
     * The maximum length of the text mark in pixels. The text value will be automatically truncated if the rendered size exceeds the limit.
     *
     * __Default value:__ `0`, indicating no limit
     */
    limit?: number;
    /**
     * The ellipsis string for text truncated in response to the limit parameter.
     *
     * __Default value:__ `"…"`
     */
    ellipsis?: string;
    /**
     * Polar coordinate angle, in radians, of the text label from the origin determined by the `x` and `y` properties. Values for `theta` follow the same convention of `arc` mark `startAngle` and `endAngle` properties: angles are measured in radians, with `0` indicating "north".
     */
    theta?: number;
    /**
     * The typeface to set the text in (e.g., `"Helvetica Neue"`).
     */
    font?: string;
    /**
     * The font size, in pixels.
     * @minimum 0
     *
     * __Default value:__ `11`
     */
    fontSize?: number;
    /**
     * The font style (e.g., `"italic"`).
     */
    fontStyle?: VgFontStyle;
    /**
     * The font weight.
     * This can be either a string (e.g `"bold"`, `"normal"`) or a number (`100`, `200`, `300`, ..., `900` where `"normal"` = `400` and `"bold"` = `700`).
     */
    fontWeight?: VgFontWeight;
    /**
     * Placeholder text if the `text` channel is not specified
     */
    text?: string;
    /**
     * A URL to load upon mouse click. If defined, the mark acts as a hyperlink.
     *
     * @format uri
     */
    href?: string;
    /**
     * The mouse cursor used over the mark. Any valid [CSS cursor type](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor#Values) can be used.
     */
    cursor?: Cursor;
    /**
     * The tooltip text to show upon mouse hover.
     */
    tooltip?: any;
    /**
     * The radius in pixels of rounded rectangle corners.
     *
     * __Default value:__ `0`
     */
    cornerRadius?: number;
}
export declare const VG_MARK_CONFIGS: ("dir" | "font" | "cursor" | "text" | "shape" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size" | "tooltip" | "href" | "interpolate" | "strokeDash" | "strokeDashOffset" | "strokeJoin" | "strokeMiterLimit" | "strokeCap" | "orient" | "tension" | "align" | "angle" | "baseline" | "dx" | "dy" | "radius" | "limit" | "ellipsis" | "theta" | "fontSize" | "fontStyle" | "fontWeight" | "cornerRadius")[];
export declare type VgComparatorOrder = 'ascending' | 'descending';
export interface VgComparator {
    field?: string | string[];
    order?: VgComparatorOrder | VgComparatorOrder[];
}
export interface VgWindowTransform {
    type: 'window';
    params?: number[];
    as?: string[];
    ops?: (AggregateOp | WindowOnlyOp)[];
    fields?: string[];
    frame?: number[];
    ignorePeers?: boolean;
    groupby?: string[];
    sort?: VgComparator;
}
