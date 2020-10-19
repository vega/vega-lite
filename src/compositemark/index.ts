import {Field} from '../channeldef';
import {Encoding} from '../encoding';
import {NormalizerParams} from '../normalize';
import {GenericUnitSpec, NormalizedLayerSpec} from '../spec';
import {EncodingFacetMapping} from '../spec/facet';
import {NormalizedUnitSpec} from '../spec/unit';
import {keys} from '../util';
import {CompositeMarkNormalizer} from './base';
import {BOXPLOT, BoxPlot, BoxPlotConfigMixins, BoxPlotDef, BOXPLOT_PARTS, normalizeBoxPlot} from './boxplot';
import {
  ERRORBAND,
  ErrorBand,
  ErrorBandConfigMixins,
  ErrorBandDef,
  ERRORBAND_PARTS,
  normalizeErrorBand
} from './errorband';
import {
  ERRORBAR,
  ErrorBar,
  ErrorBarConfigMixins,
  ErrorBarDef,
  ERRORBAR_PARTS,
  ErrorExtraEncoding,
  normalizeErrorBar
} from './errorbar';

export {BoxPlotConfig} from './boxplot';
export {ErrorBandConfigMixins} from './errorband';
export {ErrorBarConfigMixins} from './errorbar';

export type CompositeMarkNormalizerRun = (
  spec: GenericUnitSpec<any, any>,
  params: NormalizerParams
) => NormalizedLayerSpec | NormalizedUnitSpec;

/**
 * Registry index for all composite mark's normalizer
 */
const compositeMarkRegistry: {
  [mark: string]: {
    normalizer: CompositeMarkNormalizer<any>;
    parts: readonly string[];
  };
} = {};

export function add(mark: string, run: CompositeMarkNormalizerRun, parts: readonly string[]) {
  const normalizer = new CompositeMarkNormalizer(mark, run);
  compositeMarkRegistry[mark] = {normalizer, parts};
}

export function remove(mark: string) {
  delete compositeMarkRegistry[mark];
}

export type CompositeEncoding<F extends Field> = Encoding<F> & ErrorExtraEncoding<F>;

export type PartialIndex<T extends Encoding<any>> = {
  [t in keyof T]?: Partial<T[t]>;
};

export type SharedCompositeEncoding<F extends Field> = PartialIndex<
  Omit<CompositeEncoding<F>, 'detail' | 'order' | 'tooltip'> // need to omit and cherry pick detail / order / tooltip since they allow array
> &
  Pick<Encoding<F>, 'detail' | 'order' | 'tooltip'>;

export type FacetedCompositeEncoding<F extends Field> = Encoding<F> & ErrorExtraEncoding<F> & EncodingFacetMapping<F>;

export type CompositeMark = BoxPlot | ErrorBar | ErrorBand;

export function getAllCompositeMarks() {
  return keys(compositeMarkRegistry);
}

export type CompositeMarkDef = BoxPlotDef | ErrorBarDef | ErrorBandDef;

export type CompositeAggregate = BoxPlot | ErrorBar | ErrorBand;

export interface CompositeMarkConfigMixins extends BoxPlotConfigMixins, ErrorBarConfigMixins, ErrorBandConfigMixins {}

add(BOXPLOT, normalizeBoxPlot, BOXPLOT_PARTS);
add(ERRORBAR, normalizeErrorBar, ERRORBAR_PARTS);
add(ERRORBAND, normalizeErrorBand, ERRORBAND_PARTS);
