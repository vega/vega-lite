import { Config } from '../config';
import { AnyMark } from '../mark';
import { GenericUnitSpec, NormalizedLayerSpec } from '../spec';
import { BoxPlot, BoxPlotConfigMixins, BoxPlotDef } from './boxplot';
import { ErrorBand, ErrorBandConfigMixins, ErrorBandDef } from './errorband';
import { ErrorBar, ErrorBarConfigMixins, ErrorBarDef } from './errorbar';
export { BoxPlotConfig } from './boxplot';
export { ErrorBandConfigMixins } from './errorband';
export { ErrorBarConfigMixins } from './errorbar';
export declare type UnitNormalizer = (spec: GenericUnitSpec<any, any>, config: Config) => NormalizedLayerSpec;
export declare function add(mark: string, normalizer: UnitNormalizer, parts: string[]): void;
export declare function remove(mark: string): void;
export declare type CompositeMark = BoxPlot | ErrorBar | ErrorBand;
export declare function getAllCompositeMarks(): string[];
export declare function getCompositeMarkParts(mark: string): string[];
export declare type CompositeMarkDef = BoxPlotDef | ErrorBarDef | ErrorBandDef;
export declare type CompositeAggregate = BoxPlot | ErrorBar | ErrorBand;
export interface CompositeMarkConfigMixins extends BoxPlotConfigMixins, ErrorBarConfigMixins, ErrorBandConfigMixins {
}
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export declare function normalize(spec: GenericUnitSpec<any, AnyMark>, config: Config): NormalizedLayerSpec;
