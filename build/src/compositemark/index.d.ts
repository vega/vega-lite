import { Config } from './../config';
import { AnyMark } from './../mark';
import { GenericUnitSpec, NormalizedLayerSpec } from './../spec';
import { BOXPLOT, BoxPlotConfigMixins, BoxPlotDef } from './boxplot';
import { ERRORBAR } from './errorbar';
export { BoxPlotConfig } from './boxplot';
export declare type UnitNormalizer = (spec: GenericUnitSpec<any, any>, config: Config) => NormalizedLayerSpec;
export declare function add(mark: string, normalizer: UnitNormalizer): void;
export declare function remove(mark: string): void;
export declare type CompositeMark = BOXPLOT | ERRORBAR;
export declare type CompositeMarkDef = BoxPlotDef;
export declare type CompositeAggregate = BOXPLOT;
export declare const COMPOSITE_MARK_STYLES: import("../../../../../../../../../Users/kanitw/Documents/_code/_idl/_visrec/vega-lite/node_modules/vega-lite/build/src/compositemark/boxplot").BoxPlotStyle[];
export declare type CompositeMarkStyle = typeof COMPOSITE_MARK_STYLES[0];
export interface CompositeMarkConfigMixins extends BoxPlotConfigMixins {
}
export declare const VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: {
    box?: ("dir" | "font" | "text" | "shape" | "orient" | "extent" | "interpolate" | "color" | "fill" | "stroke" | "opacity" | "size" | "tooltip" | "href" | "fillOpacity" | "strokeWidth" | "strokeCap" | "strokeOpacity" | "strokeDash" | "strokeDashOffset" | "cursor" | "tension" | "align" | "baseline" | "ellipsis" | "limit" | "dx" | "dy" | "radius" | "theta" | "angle" | "fontSize" | "fontWeight" | "fontStyle" | "filled" | "strokeJoin" | "strokeMiterLimit" | "cornerRadius")[];
    boxWhisker?: ("dir" | "font" | "text" | "shape" | "orient" | "interpolate" | "color" | "fill" | "stroke" | "opacity" | "size" | "tooltip" | "href" | "fillOpacity" | "strokeWidth" | "strokeCap" | "strokeOpacity" | "strokeDash" | "strokeDashOffset" | "cursor" | "tension" | "align" | "baseline" | "ellipsis" | "limit" | "dx" | "dy" | "radius" | "theta" | "angle" | "fontSize" | "fontWeight" | "fontStyle" | "filled" | "strokeJoin" | "strokeMiterLimit" | "cornerRadius")[];
    boxMid?: ("dir" | "font" | "text" | "shape" | "orient" | "interpolate" | "color" | "fill" | "stroke" | "opacity" | "size" | "tooltip" | "href" | "fillOpacity" | "strokeWidth" | "strokeCap" | "strokeOpacity" | "strokeDash" | "strokeDashOffset" | "cursor" | "tension" | "align" | "baseline" | "ellipsis" | "limit" | "dx" | "dy" | "radius" | "theta" | "angle" | "fontSize" | "fontWeight" | "fontStyle" | "filled" | "strokeJoin" | "strokeMiterLimit" | "cornerRadius")[];
};
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export declare function normalize(spec: GenericUnitSpec<any, AnyMark>, config: Config): NormalizedLayerSpec;
