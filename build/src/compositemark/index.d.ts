import { Field } from '../channeldef';
import { Encoding } from '../encoding';
import { NormalizerParams } from '../normalize/index';
import { GenericUnitSpec, NormalizedLayerSpec } from '../spec';
import { EncodingFacetMapping } from '../spec/facet';
import { BoxPlot, BoxPlotConfigMixins, BoxPlotDef } from './boxplot';
import { ErrorBand, ErrorBandConfigMixins, ErrorBandDef } from './errorband';
import { ErrorBar, ErrorBarConfigMixins, ErrorBarDef, ErrorExtraEncoding } from './errorbar';
export { BoxPlotConfig } from './boxplot';
export { ErrorBandConfigMixins } from './errorband';
export { ErrorBarConfigMixins } from './errorbar';
export declare type CompositeMarkNormalizerRun = (spec: GenericUnitSpec<any, any>, params: NormalizerParams) => NormalizedLayerSpec;
export declare function add(mark: string, run: CompositeMarkNormalizerRun, parts: string[]): void;
export declare function remove(mark: string): void;
export declare type CompositeEncoding = Encoding<Field> & ErrorExtraEncoding<Field>;
export declare type FacetedCompositeEncoding = Encoding<Field> & ErrorExtraEncoding<Field> & EncodingFacetMapping<Field>;
export declare type CompositeMark = BoxPlot | ErrorBar | ErrorBand;
export declare function getAllCompositeMarks(): string[];
export declare type CompositeMarkDef = BoxPlotDef | ErrorBarDef | ErrorBandDef;
export declare type CompositeAggregate = BoxPlot | ErrorBar | ErrorBand;
export interface CompositeMarkConfigMixins extends BoxPlotConfigMixins, ErrorBarConfigMixins, ErrorBandConfigMixins {
}
//# sourceMappingURL=index.d.ts.map