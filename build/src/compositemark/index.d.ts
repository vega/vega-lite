import { Config } from './../config';
import { AnyMark } from './../mark';
import { GenericUnitSpec, NormalizedLayerSpec } from './../spec';
import { BOXPLOT, BoxPlotConfigMixins, BoxPlotDef } from './boxplot';
import { ERRORBAR } from './errorbar';
import * as boxplot from './boxplot';
export { BoxPlotConfig } from './boxplot';
export declare type UnitNormalizer = (spec: GenericUnitSpec<any, any>, config: Config) => NormalizedLayerSpec;
export declare function add(mark: string, normalizer: UnitNormalizer): void;
export declare function remove(mark: string): void;
export declare type CompositeMark = BOXPLOT | ERRORBAR;
export declare type CompositeMarkDef = BoxPlotDef;
export declare type CompositeAggregate = BOXPLOT;
export declare const COMPOSITE_MARK_STYLES: boxplot.BoxPlotStyle[];
export declare type CompositeMarkStyle = typeof COMPOSITE_MARK_STYLES[0];
export interface CompositeMarkConfigMixins extends BoxPlotConfigMixins {
}
export declare const VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: {
    box?: ("dir" | "font" | "text" | "shape" | "orient" | "extent" | "color" | "fill" | "stroke" | "opacity" | "size" | "tooltip" | "href" | "interpolate" | "angle" | "baseline" | "fontSize" | "fontWeight" | "limit" | "strokeWidth" | "strokeDash" | "strokeDashOffset" | "strokeOpacity" | "strokeJoin" | "strokeMiterLimit" | "fillOpacity" | "filled" | "strokeCap" | "tension" | "align" | "dx" | "dy" | "radius" | "ellipsis" | "theta" | "fontStyle" | "cursor" | "cornerRadius")[];
    boxWhisker?: ("dir" | "font" | "text" | "shape" | "orient" | "color" | "fill" | "stroke" | "opacity" | "size" | "tooltip" | "href" | "interpolate" | "angle" | "baseline" | "fontSize" | "fontWeight" | "limit" | "strokeWidth" | "strokeDash" | "strokeDashOffset" | "strokeOpacity" | "strokeJoin" | "strokeMiterLimit" | "fillOpacity" | "filled" | "strokeCap" | "tension" | "align" | "dx" | "dy" | "radius" | "ellipsis" | "theta" | "fontStyle" | "cursor" | "cornerRadius")[];
    boxMid?: ("dir" | "font" | "text" | "shape" | "orient" | "color" | "fill" | "stroke" | "opacity" | "size" | "tooltip" | "href" | "interpolate" | "angle" | "baseline" | "fontSize" | "fontWeight" | "limit" | "strokeWidth" | "strokeDash" | "strokeDashOffset" | "strokeOpacity" | "strokeJoin" | "strokeMiterLimit" | "fillOpacity" | "filled" | "strokeCap" | "tension" | "align" | "dx" | "dy" | "radius" | "ellipsis" | "theta" | "fontStyle" | "cursor" | "cornerRadius")[];
};
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export declare function normalize(spec: GenericUnitSpec<any, AnyMark>, config: Config): NormalizedLayerSpec;
