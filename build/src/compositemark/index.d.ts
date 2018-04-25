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
export declare const COMPOSITE_MARK_STYLES: ("boxWhisker" | "box" | "boxMid")[];
export declare type CompositeMarkStyle = typeof COMPOSITE_MARK_STYLES[0];
export interface CompositeMarkConfigMixins extends BoxPlotConfigMixins {
}
export declare const VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: {
    box?: ("font" | "text" | "shape" | "extent" | "interpolate" | "color" | "fill" | "stroke" | "opacity" | "size" | "href" | "fillOpacity" | "strokeWidth" | "strokeOpacity" | "strokeDash" | "strokeDashOffset" | "cursor" | "tension" | "orient" | "align" | "baseline" | "limit" | "dx" | "dy" | "radius" | "theta" | "angle" | "fontSize" | "fontWeight" | "fontStyle" | "filled" | "strokeCap")[];
    boxWhisker?: ("font" | "text" | "shape" | "interpolate" | "color" | "fill" | "stroke" | "opacity" | "size" | "href" | "fillOpacity" | "strokeWidth" | "strokeOpacity" | "strokeDash" | "strokeDashOffset" | "cursor" | "tension" | "orient" | "align" | "baseline" | "limit" | "dx" | "dy" | "radius" | "theta" | "angle" | "fontSize" | "fontWeight" | "fontStyle" | "filled" | "strokeCap")[];
    boxMid?: ("font" | "text" | "shape" | "interpolate" | "color" | "fill" | "stroke" | "opacity" | "size" | "href" | "fillOpacity" | "strokeWidth" | "strokeOpacity" | "strokeDash" | "strokeDashOffset" | "cursor" | "tension" | "orient" | "align" | "baseline" | "limit" | "dx" | "dy" | "radius" | "theta" | "angle" | "fontSize" | "fontWeight" | "fontStyle" | "filled" | "strokeCap")[];
};
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export declare function normalize(spec: GenericUnitSpec<any, AnyMark>, config: Config): NormalizedLayerSpec;
