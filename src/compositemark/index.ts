import {Field} from '../channeldef.js';
import {Encoding} from '../encoding.js';
import {NormalizerParams} from '../normalize/index.js';
import {GenericUnitSpec, NormalizedLayerSpec} from '../spec/index.js';
import {EncodingFacetMapping} from '../spec/facet.js';
import {NormalizedUnitSpec} from '../spec/unit.js';
import {keys} from '../util.js';
import {CompositeMarkNormalizer} from './base.js';
import {BOXPLOT, BoxPlot, BoxPlotConfigMixins, BoxPlotDef, BOXPLOT_PARTS, normalizeBoxPlot} from './boxplot.js';
import {
  ERRORBAND,
  ErrorBand,
  ErrorBandConfigMixins,
  ErrorBandDef,
  ERRORBAND_PARTS,
  normalizeErrorBand,
} from './errorband.js';
import {
  ERRORBAR,
  ErrorBar,
  ErrorBarConfigMixins,
  ErrorBarDef,
  ERRORBAR_PARTS,
  ErrorExtraEncoding,
  normalizeErrorBar,
} from './errorbar.js';

export type {BoxPlotConfig} from './boxplot.js';
export type {ErrorBandConfigMixins} from './errorband.js';
export type {ErrorBarConfigMixins} from './errorbar.js';

export type CompositeMarkNormalizerRun = (
  spec: GenericUnitSpec<any, any>,
  params: NormalizerParams,
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
