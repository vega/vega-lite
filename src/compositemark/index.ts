import {Config} from './../config';
import {isMarkDef, MarkDef} from './../mark';
import {GenericUnitSpec, LayerSpec} from './../spec';
import {BOXPLOT, normalizeBoxPlot} from './boxplot';
import {ERRORBAR, normalizeErrorBar} from './errorbar';

export {BoxPlotConfig} from './boxplot';
export type UnitNormalizer = (spec: GenericUnitSpec<any, any>, config: Config)=> LayerSpec;

/**
 * Registry index for all composite mark's normalizer
 */
const normalizerRegistry: {[mark: string]: UnitNormalizer} = {};

export function add(mark: string, normalizer: UnitNormalizer) {
  normalizerRegistry[mark] = normalizer;
}

export function remove(mark: string) {
  delete normalizerRegistry[mark];
}

export type CompositeMark = BOXPLOT | ERRORBAR;
export type CompositeAggregate = BOXPLOT;

add(BOXPLOT, normalizeBoxPlot);
add(ERRORBAR, normalizeErrorBar);

/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export function normalize(
    // This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
    spec: GenericUnitSpec<any, string | MarkDef>,
    config: Config
  ): LayerSpec {

  const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
  const normalizer = normalizerRegistry[mark];
  if (normalizer) {
    return normalizer(spec, config);
  }

  throw new Error(`Unregistered composite mark ${mark}`);
}
