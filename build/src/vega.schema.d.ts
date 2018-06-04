import { AggregateOp } from 'vega';
import { BaseBin } from './bin';
import { NiceTime, ScaleType } from './scale';
import { SortOrder } from './sort';
import { StackOffset } from './stack';
import { WindowOnlyOp } from './transform';
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
export interface VgParentRef {
    parent: string;
}
export declare type VgFieldRef = string | VgParentRef | VgParentRef[];
export declare type VgSortField = true | {
    field?: VgFieldRef;
    op: AggregateOp;
    order?: SortOrder;
};
/**
 * Unioned domains can only be sorted by count aggregate.
 */
export declare type VgUnionSortField = true | {
    op: 'count';
    order?: SortOrder;
};
export interface VgDataRef {
    data: string;
    field: VgFieldRef;
    sort?: VgSortField;
}
export interface VgSignalRef {
    signal: string;
}
export declare function isVgSignalRef(o: any): o is VgSignalRef;
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
    fields: (any[] | VgDataRef | VgSignalRef)[];
    sort?: VgUnionSortField;
}
export interface VgFieldRefUnionDomain {
    data: string;
    fields: VgFieldRef[];
    sort?: VgUnionSortField;
}
export declare type VgScheme = {
    scheme: string;
    extent?: number[];
    count?: number;
};
export declare type VgRange = string | VgDataRef | (number | string | VgDataRef | VgSignalRef)[] | VgScheme | VgRangeStep;
export declare type VgRangeStep = {
    step: number | VgSignalRef;
};
export declare function isVgRangeStep(range: VgRange): range is VgRangeStep;
export declare type VgNonUnionDomain = any[] | VgDataRef | VgSignalRef;
export declare type VgDomain = VgNonUnionDomain | DataRefUnionDomain | VgFieldRefUnionDomain;
export declare type VgMarkGroup = any;
export declare type VgProjectionType = 'albers' | 'albersUsa' | 'azimuthalEqualArea' | 'azimuthalEquidistant' | 'conicConformal' | 'conicEqualArea' | 'conicEquidistant' | 'equirectangular' | 'gnomonic' | 'mercator' | 'orthographic' | 'stereographic' | 'transverseMercator';
export declare type VgProjection = {
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
    precision?: String;
    fit?: VgSignalRef | Object | any[];
    extent?: VgSignalRef | number[][];
    size?: VgSignalRef | (number | VgSignalRef)[];
    coefficient?: number;
    distance?: number;
    fraction?: number;
    lobes?: number;
    parallel?: number;
    radius?: number;
    ratio?: number;
    spacing?: number;
    tilt?: number;
};
export interface VgScale {
    name: string;
    type: ScaleType;
    domain: VgDomain;
    domainRaw?: VgSignalRef;
    range: VgRange;
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
export declare type RowCol<T> = {
    row?: T;
    column?: T;
};
export interface VgLayout {
    padding: number | RowCol<number>;
    headerBand?: number | RowCol<number>;
    footerBand?: number | RowCol<number>;
    offset: number | {
        rowHeader: number;
        rowFooter: number;
        rowTitle: number;
        columnHeader: number;
        columnFooter: number;
        columnTitle: number;
    };
    bounds: 'full' | 'flush';
    columns?: number | {
        signal: string;
    };
    align?: VgLayoutAlign | {
        row: VgLayoutAlign;
        column: VgLayoutAlign;
    };
}
export declare function isDataRefUnionedDomain(domain: VgDomain): domain is DataRefUnionDomain;
export declare function isFieldRefUnionDomain(domain: VgDomain): domain is VgFieldRefUnionDomain;
export declare function isDataRefDomain(domain: VgDomain): domain is VgDataRef;
export declare function isSignalRefDomain(domain: VgDomain): domain is VgSignalRef;
export interface VgEventHandler {
    events: string[] | VgSignalRef;
    update?: string;
    encode?: string;
    force?: boolean;
    between?: any[];
}
export interface VgSignal {
    name: string;
    bind?: string;
    description?: string;
    on?: VgEventHandler[];
    update?: string;
    react?: boolean;
    value?: string | number | boolean | {} | VgSignalRef;
    push?: string;
}
export declare type VgEncodeChannel = 'x' | 'x2' | 'xc' | 'width' | 'y' | 'y2' | 'yc' | 'height' | 'opacity' | 'fill' | 'fillOpacity' | 'stroke' | 'strokeWidth' | 'strokeCap' | 'strokeOpacity' | 'strokeDash' | 'strokeDashOffset' | 'cursor' | 'clip' | 'size' | 'shape' | 'path' | 'innerRadius' | 'outerRadius' | 'startAngle' | 'endAngle' | 'interpolate' | 'tension' | 'orient' | 'url' | 'align' | 'baseline' | 'text' | 'dir' | 'ellipsis' | 'limit' | 'dx' | 'dy' | 'radius' | 'theta' | 'angle' | 'font' | 'fontSize' | 'fontWeight' | 'fontStyle' | 'tooltip' | 'href' | 'cursor' | 'defined';
export declare type VgEncodeEntry = {
    [k in VgEncodeChannel]?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
};
export declare type AxisOrient = 'top' | 'right' | 'left' | 'bottom';
export interface VgAxis {
    scale: string;
    domain?: boolean;
    format?: string;
    grid?: boolean;
    gridScale?: string;
    labels?: boolean;
    labelBound?: boolean | number;
    labelFlush?: boolean | number;
    labelPadding?: number;
    labelOverlap?: boolean | 'parity' | 'greedy';
    maxExtent?: number;
    minExtent?: number;
    offset?: number;
    orient?: AxisOrient;
    position?: number;
    ticks?: boolean;
    tickCount?: number;
    tickSize?: number;
    title?: string;
    titlePadding?: number;
    values?: any[] | VgSignalRef;
    zindex?: number;
    encode?: VgAxisEncode;
}
export declare type LegendType = 'symbol' | 'gradient';
export interface VgLegend {
    fill?: string;
    stroke?: string;
    size?: string;
    shape?: string;
    opacity?: string;
    entryPadding?: number;
    format?: string;
    offset?: number;
    orient?: LegendOrient;
    padding?: number;
    tickCount?: number;
    title?: string;
    type?: LegendType;
    values?: any[] | VgSignalRef;
    zindex?: number;
    encode?: VgLegendEncode;
}
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
    groupby?: VgFieldRef[];
    fields?: VgFieldRef[];
    ops?: AggregateOp[];
    as?: string[];
    cross?: boolean;
    drop?: boolean;
}
export interface VgCollectTransform {
    type: 'collect';
    sort: VgSort;
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
    sort: VgSort;
    as: string[];
}
export interface VgIdentifierTransform {
    type: 'identifier';
    as: string;
}
export declare type VgTransform = VgBinTransform | VgExtentTransform | VgFormulaTransform | VgAggregateTransform | VgFilterTransform | VgImputeTransform | VgStackTransform | VgCollectTransform | VgLookupTransform | VgIdentifierTransform | VgGeoPointTransform | VgGeoJSONTransform | VgGeoJSONTransform | VgWindowTransform;
export interface VgGeoPointTransform {
    type: 'geopoint';
    projection: string;
    fields: VgFieldRef[];
    as?: string[];
}
export interface VgGeoShapeTransform {
    type: 'geoshape';
    projection: string;
    field?: VgFieldRef;
    as?: string;
}
export interface VgGeoJSONTransform {
    type: 'geojson';
    fields?: VgFieldRef[];
    geojson?: VgFieldRef;
    signal: string;
}
export declare type VgPostEncodingTransform = VgGeoShapeTransform;
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
export declare type VgGuideEncode = any;
export declare type VgSort = {
    field: string;
    order?: VgComparatorOrder;
} | {
    field: string[];
    order?: (VgComparatorOrder)[];
};
export interface VgImputeTransform {
    type: 'impute';
    groupby?: string[];
    field: string;
    key: string;
    keyvals?: string[];
    method?: 'value' | 'median' | 'max' | 'min' | 'mean';
    value?: any;
}
export declare type VgCheckboxBinding = {
    input: 'checkbox';
    element?: string;
};
export declare type VgRadioBinding = {
    input: 'radio';
    options: string[];
    element?: string;
};
export declare type VgSelectBinding = {
    input: 'select';
    options: string[];
    element?: string;
};
export declare type VgRangeBinding = {
    input: 'range';
    min?: number;
    max?: number;
    step?: number;
    element?: string;
};
export declare type VgGenericBinding = {
    input: string;
    element?: string;
};
export declare type VgBinding = VgCheckboxBinding | VgRadioBinding | VgSelectBinding | VgRangeBinding | VgGenericBinding;
/**
 * Base object for Vega's Axis and Axis Config.
 * All of these properties are both properties of Vega's Axis and Axis Config.
 */
export interface VgAxisBase {
    /**
     * A boolean flag indicating if the domain (the axis baseline) should be included as part of the axis.
     *
     * __Default value:__ `true`
     */
    domain?: boolean;
    /**
     * A boolean flag indicating if grid lines should be included as part of the axis
     *
     * __Default value:__ `true` for [continuous scales](https://vega.github.io/vega-lite/docs/scale.html#continuous) that are not binned; otherwise, `false`.
     */
    grid?: boolean;
    /**
     * A boolean flag indicating if labels should be included as part of the axis.
     *
     * __Default value:__  `true`.
     */
    labels?: boolean;
    /**
     * Indicates if labels should be hidden if they exceed the axis range. If `false `(the default) no bounds overlap analysis is performed. If `true`, labels will be hidden if they exceed the axis range by more than 1 pixel. If this property is a number, it specifies the pixel tolerance: the maximum amount by which a label bounding box may exceed the axis range.
     *
     * __Default value:__ `false`.
     */
    labelBound?: boolean | number;
    /**
     * Indicates if the first and last axis labels should be aligned flush with the scale range. Flush alignment for a horizontal axis will left-align the first label and right-align the last label. For vertical axes, bottom and top text baselines are applied instead. If this property is a number, it also indicates the number of pixels by which to offset the first and last labels; for example, a value of 2 will flush-align the first and last labels and also push them 2 pixels outward from the center of the axis. The additional adjustment can sometimes help the labels better visually group with corresponding axis ticks.
     *
     * __Default value:__ `true` for axis of a continuous x-scale. Otherwise, `false`.
     */
    labelFlush?: boolean | number;
    /**
     * The strategy to use for resolving overlap of axis labels. If `false` (the default), no overlap reduction is attempted. If set to `true` or `"parity"`, a strategy of removing every other label is used (this works well for standard linear axes). If set to `"greedy"`, a linear scan of the labels is performed, removing any labels that overlaps with the last visible label (this often works better for log-scaled axes).
     *
     * __Default value:__ `true` for non-nominal fields with non-log scales; `"greedy"` for log scales; otherwise `false`.
     */
    labelOverlap?: boolean | 'parity' | 'greedy';
    /**
     * The padding, in pixels, between axis and text labels.
     */
    labelPadding?: number;
    /**
     * Boolean value that determines whether the axis should include ticks.
     */
    ticks?: boolean;
    /**
     * The size in pixels of axis ticks.
     *
     * @minimum 0
     */
    tickSize?: number;
    /**
     * Max length for axis title if the title is automatically generated from the field's description.
     *
     * @minimum 0
     * __Default value:__ `undefined`.
     */
    titleMaxLength?: number;
    /**
     * The padding, in pixels, between title and axis.
     */
    titlePadding?: number;
    /**
     * The minimum extent in pixels that axis ticks and labels should use. This determines a minimum offset value for axis titles.
     *
     * __Default value:__ `30` for y-axis; `undefined` for x-axis.
     */
    minExtent?: number;
    /**
     * The maximum extent in pixels that axis ticks and labels should use. This determines a maximum offset value for axis titles.
     *
     * __Default value:__ `undefined`.
     */
    maxExtent?: number;
}
export interface VgAxisConfig extends VgAxisBase {
    /**
     * An interpolation fraction indicating where, for `band` scales, axis ticks should be positioned. A value of `0` places ticks at the left edge of their bands. A value of `0.5` places ticks in the middle of their bands.
     */
    bandPosition?: number;
    /**
     * Stroke width of axis domain line
     *
     * __Default value:__  (none, using Vega default).
     */
    domainWidth?: number;
    /**
     * Color of axis domain line.
     *
     * __Default value:__  (none, using Vega default).
     */
    domainColor?: string;
    /**
     * Color of gridlines.
     */
    gridColor?: string;
    /**
     * The offset (in pixels) into which to begin drawing with the grid dash array.
     */
    gridDash?: number[];
    /**
     * The stroke opacity of grid (value between [0,1])
     *
     * __Default value:__ (`1` by default)
     * @minimum 0
     * @maximum 1
     */
    gridOpacity?: number;
    /**
     * The grid width, in pixels.
     * @minimum 0
     */
    gridWidth?: number;
    /**
     * The color of the axis's tick.
     */
    tickColor?: string;
    /**
     * The rotation angle of the axis labels.
     *
     * __Default value:__ `-90` for nominal and ordinal fields; `0` otherwise.
     *
     * @minimum -360
     * @maximum 360
     */
    labelAngle?: number;
    /**
     * The color of the tick label, can be in hex color code or regular color name.
     */
    labelColor?: string;
    /**
     * The font of the tick label.
     */
    labelFont?: string;
    /**
     * The font size of the label, in pixels.
     *
     * @minimum 0
     */
    labelFontSize?: number;
    /**
     * Maximum allowed pixel width of axis tick labels.
     */
    labelLimit?: number;
    /**
     * Boolean flag indicating if pixel position values should be rounded to the nearest integer.
     */
    tickRound?: boolean;
    /**
     * The width, in pixels, of ticks.
     *
     * @minimum 0
     */
    tickWidth?: number;
    /**
     * Horizontal text alignment of axis titles.
     */
    titleAlign?: string;
    /**
     * Angle in degrees of axis titles.
     */
    titleAngle?: number;
    /**
     * Vertical text baseline for axis titles.
     */
    titleBaseline?: string;
    /**
     * Color of the title, can be in hex color code or regular color name.
     */
    titleColor?: string;
    /**
     * Font of the title. (e.g., `"Helvetica Neue"`).
     */
    titleFont?: string;
    /**
     * Font size of the title.
     *
     * @minimum 0
     */
    titleFontSize?: number;
    /**
     * Font weight of the title.
     * This can be either a string (e.g `"bold"`, `"normal"`) or a number (`100`, `200`, `300`, ..., `900` where `"normal"` = `400` and `"bold"` = `700`).
     */
    titleFontWeight?: FontWeight;
    /**
     * Maximum allowed pixel width of axis titles.
     */
    titleLimit?: number;
    /**
     * X-coordinate of the axis title relative to the axis group.
     */
    titleX?: number;
    /**
     * Y-coordinate of the axis title relative to the axis group.
     */
    titleY?: number;
}
export declare type LegendOrient = 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none';
export interface VgLegendBase {
    /**
     * Padding (in pixels) between legend entries in a symbol legend.
     */
    entryPadding?: number;
    /**
     * The orientation of the legend, which determines how the legend is positioned within the scene. One of "left", "right", "top-left", "top-right", "bottom-left", "bottom-right", "none".
     *
     * __Default value:__ `"right"`
     */
    orient?: LegendOrient;
    /**
     * The offset, in pixels, by which to displace the legend from the edge of the enclosing group or data rectangle.
     *
     * __Default value:__  `0`
     */
    offset?: number;
    /**
     * The padding, in pixels, between the legend and axis.
     */
    padding?: number;
}
export interface VgLegendConfig extends VgLegendBase {
    /**
     * Corner radius for the full legend.
     */
    cornerRadius?: number;
    /**
     * Background fill color for the full legend.
     */
    fillColor?: string;
    /**
     * Border stroke color for the full legend.
     */
    strokeColor?: string;
    /**
     * Border stroke dash pattern for the full legend.
     */
    strokeDash?: number[];
    /**
     * Border stroke width for the full legend.
     */
    strokeWidth?: number;
    /**
     * The color of the gradient stroke, can be in hex color code or regular color name.
     */
    gradientStrokeColor?: string;
    /**
     * The width of the gradient stroke, in pixels.
     * @minimum 0
     */
    gradientStrokeWidth?: number;
    /**
     * The height of the gradient, in pixels.
     * @minimum 0
     */
    gradientHeight?: number;
    /**
     * Text baseline for color ramp gradient labels.
     */
    gradientLabelBaseline?: string;
    /**
     * The maximum allowed length in pixels of color ramp gradient labels.
     */
    gradientLabelLimit?: number;
    /**
     * Vertical offset in pixels for color ramp gradient labels.
     */
    gradientLabelOffset?: number;
    /**
     * The width of the gradient, in pixels.
     * @minimum 0
     */
    gradientWidth?: number;
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
     *
     * __Default value:__ `10`.
     *
     * @minimum 0
     */
    labelFontSize?: number;
    /**
     * Maximum allowed pixel width of axis tick labels.
     */
    labelLimit?: number;
    /**
     * The offset of the legend label.
     * @minimum 0
     */
    labelOffset?: number;
    /**
     * The color of the legend symbol,
     */
    symbolColor?: string;
    /**
     * Default shape type (such as "circle") for legend symbols.
     */
    symbolType?: string;
    /**
     * The size of the legend symbol, in pixels.
     * @minimum 0
     */
    symbolSize?: number;
    /**
     * The width of the symbol's stroke.
     * @minimum 0
     */
    symbolStrokeWidth?: number;
    /**
     * Horizontal text alignment for legend titles.
     */
    titleAlign?: string;
    /**
     * Vertical text baseline for legend titles.
     */
    titleBaseline?: string;
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
     * This can be either a string (e.g `"bold"`, `"normal"`) or a number (`100`, `200`, `300`, ..., `900` where `"normal"` = `400` and `"bold"` = `700`).
     */
    titleFontWeight?: FontWeight;
    /**
     * Maximum allowed pixel width of axis titles.
     */
    titleLimit?: number;
    /**
     * The padding, in pixels, between title and legend.
     */
    titlePadding?: number;
}
export declare type FontStyle = 'normal' | 'italic';
export declare type FontWeightString = 'normal' | 'bold';
/**
 * @TJS-type integer
 * @minimum 100
 * @maximum 900
 */
export declare type FontWeightNumber = number;
export declare type FontWeight = FontWeightString | FontWeightNumber;
export declare type HorizontalAlign = 'left' | 'right' | 'center';
export declare type Interpolate = 'linear' | 'linear-closed' | 'step' | 'step-before' | 'step-after' | 'basis' | 'basis-open' | 'basis-closed' | 'cardinal' | 'cardinal-open' | 'cardinal-closed' | 'bundle' | 'monotone';
export declare type Orient = 'horizontal' | 'vertical';
export declare type VerticalAlign = 'top' | 'middle' | 'bottom';
export interface VgMarkConfig {
    /**
     * Default Fill Color.  This has higher precedence than `config.color`
     *
     * __Default value:__ (None)
     *
     */
    fill?: string;
    /**
     * Default Stroke Color.  This has higher precedence than `config.color`
     *
     * __Default value:__ (None)
     *
     */
    stroke?: string;
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
    strokeCap?: 'butt' | 'round' | 'square';
    /**
     * An array of alternating stroke, space lengths for creating dashed or dotted lines.
     */
    strokeDash?: number[];
    /**
     * The offset (in pixels) into which to begin drawing with the stroke dash array.
     */
    strokeDashOffset?: number;
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
    align?: HorizontalAlign;
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
    baseline?: VerticalAlign;
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
     * The maximum length of the text mark in pixels (default 0, indicating no limit). The text value will be automatically truncated if the rendered size exceeds the limit.
     */
    limit?: number;
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
     */
    fontSize?: number;
    /**
     * The font style (e.g., `"italic"`).
     */
    fontStyle?: FontStyle;
    /**
     * The font weight.
     * This can be either a string (e.g `"bold"`, `"normal"`) or a number (`100`, `200`, `300`, ..., `900` where `"normal"` = `400` and `"bold"` = `700`).
     */
    fontWeight?: FontWeight;
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
    cursor?: 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing';
}
export declare const VG_MARK_CONFIGS: ("font" | "text" | "shape" | "orient" | "fill" | "stroke" | "opacity" | "size" | "href" | "interpolate" | "strokeWidth" | "strokeDash" | "strokeDashOffset" | "strokeOpacity" | "fillOpacity" | "strokeCap" | "tension" | "align" | "angle" | "baseline" | "dx" | "dy" | "radius" | "limit" | "theta" | "fontSize" | "fontStyle" | "fontWeight" | "cursor")[];
export declare type Anchor = 'start' | 'middle' | 'end';
export interface VgTitle {
    /**
     * The title text.
     */
    text: string;
    /**
     * The orientation of the title relative to the chart. One of `"top"` (the default), `"bottom"`, `"left"`, or `"right"`.
     */
    orient?: TitleOrient;
    /**
     * The anchor position for placing the title. One of `"start"`, `"middle"` (the default), or `"end"`. For example, with an orientation of top these anchor positions map to a left-, center-, or right-aligned title.
     */
    anchor?: Anchor;
    /**
     * The orthogonal offset in pixels by which to displace the title from its position along the edge of the chart.
     */
    offset?: number;
    style?: string | string[];
}
export declare type TitleOrient = 'top' | 'bottom' | 'left' | 'right';
export interface VgTitleConfig {
    /**
     * The anchor position for placing the title. One of `"start"`, `"middle"`, or `"end"`. For example, with an orientation of top these anchor positions map to a left-, center-, or right-aligned title.
     *
     * __Default value:__ `"middle"` for [single](https://vega.github.io/vega-lite/docs/spec.html) and [layered](https://vega.github.io/vega-lite/docs/layer.html) views.
     * `"start"` for other composite views.
     *
     * __Note:__ [For now](https://github.com/vega/vega-lite/issues/2875), `anchor` is only customizable only for [single](https://vega.github.io/vega-lite/docs/spec.html) and [layered](https://vega.github.io/vega-lite/docs/layer.html) views.  For other composite views, `anchor` is always `"start"`.
     */
    anchor?: Anchor;
    /**
     * Angle in degrees of title text.
     */
    angle?: number;
    /**
     * Vertical text baseline for title text.
     */
    baseline?: VerticalAlign;
    /**
     * Text color for title text.
     */
    color?: string;
    /**
     * Font name for title text.
     */
    font?: string;
    /**
     * Font size in pixels for title text.
     *
     * __Default value:__ `10`.
     *
     * @minimum 0
     */
    fontSize?: number;
    /**
     * Font weight for title text.
     * This can be either a string (e.g `"bold"`, `"normal"`) or a number (`100`, `200`, `300`, ..., `900` where `"normal"` = `400` and `"bold"` = `700`).
     */
    fontWeight?: FontWeight;
    /**
     * The maximum allowed length in pixels of legend labels.
     *
     * @minimum 0
     */
    limit?: number;
    /**
     * Offset in pixels of the title from the chart body and axes.
     */
    offset?: number;
    /**
     * Default title orientation ("top", "bottom", "left", or "right")
     */
    orient?: TitleOrient;
}
export declare type VgComparatorOrder = 'ascending' | 'descending';
export interface VgComparator {
    field?: string | string[];
    order?: VgComparatorOrder | VgComparatorOrder[];
}
export interface VgWindowTransform {
    type: 'window';
    params?: Number[];
    as?: string[];
    ops?: (AggregateOp | WindowOnlyOp)[];
    fields?: string[];
    frame?: Number[];
    ignorePeers?: Boolean;
    groupby?: string[];
    sort?: VgComparator;
}
