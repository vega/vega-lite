import {Config, initConfig} from '../config';
import {ExtendedLayerSpec, FacetedUnitSpec, GenericSpec, NormalizedSpec, UnitSpec} from '../spec';
import {TopLevelSpec} from '../spec/index';
import {TopLevel} from '../spec/toplevel';
import {NormalizerParams} from './base';
import {CoreNormalizer} from './core';

export function normalize(spec: TopLevelSpec, config?: Config): TopLevel<NormalizedSpec> {
  if (config === undefined) {
    config = initConfig(spec.config);
  }

  return normalizeGenericSpec(spec, config);
}

const normalizer = new CoreNormalizer();

/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
function normalizeGenericSpec(
  spec: GenericSpec<UnitSpec, ExtendedLayerSpec> | FacetedUnitSpec,
  config: Config = {}
): NormalizedSpec {
  return normalizer.map(spec, {config});
}

export {NormalizerParams};
