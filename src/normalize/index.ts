import {Config, initConfig} from '../config';
import {ExtendedLayerSpec, ExtendedUnitSpec, FacetedExtendedUnitSpec, GenericSpec, NormalizedSpec} from '../spec';
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
  spec: GenericSpec<ExtendedUnitSpec, ExtendedLayerSpec> | FacetedExtendedUnitSpec,
  config: Config = {}
): NormalizedSpec {
  return normalizer.map(spec, {config});
}

export {NormalizerParams};
