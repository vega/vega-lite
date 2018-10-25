import {Config} from './config';
import {extractTransformsFromEncoding} from './encoding';
import * as log from './log';
import {
  GenericHConcatSpec,
  GenericVConcatSpec,
  isFacetSpec,
  isHConcatSpec,
  isLayerSpec,
  isRepeatSpec,
  isUnitSpec,
  isVConcatSpec,
  NormalizedConcatSpec,
  NormalizedFacetSpec,
  NormalizedLayerSpec,
  NormalizedRepeatSpec,
  NormalizedSpec,
  NormalizedUnitSpec
} from './spec';

/**
 * Modifies spec extracting transformations from encoding and moving them to the transforms array
 */
export function extractTransforms(spec: NormalizedSpec, config: Config): NormalizedSpec {
  if (isFacetSpec(spec) || isRepeatSpec(spec)) {
    return extractTransformsSingle(spec, config);
  }
  if (isLayerSpec(spec)) {
    return extractTransformsLayered(spec, config);
  }
  if (isUnitSpec(spec)) {
    return extractTransformsUnit(spec, config);
  }
  if (isVConcatSpec(spec)) {
    return extractTransformsVConcat(spec, config);
  }
  if (isHConcatSpec(spec)) {
    return extractTransformsHConcat(spec, config);
  }
  throw new Error(log.message.INVALID_SPEC);
}

function extractTransformsUnit(spec: NormalizedUnitSpec, config: Config): NormalizedUnitSpec {
  if (spec.encoding) {
    const {encoding: oldEncoding, transform: oldTransforms, ...rest} = spec;
    const {bins, timeUnits, aggregate, groupby, encoding: newEncoding} = extractTransformsFromEncoding(
      oldEncoding,
      config
    );
    return {
      transform: [
        ...(oldTransforms ? oldTransforms : []),
        ...bins,
        ...timeUnits,
        ...(!aggregate.length ? [] : [{aggregate, groupby}])
      ],
      ...rest,
      encoding: newEncoding
    };
  } else {
    return spec;
  }
}

function extractTransformsSingle(
  spec: NormalizedFacetSpec | NormalizedRepeatSpec,
  config: Config
): NormalizedFacetSpec | NormalizedRepeatSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    spec: extractTransforms(subspec, config) as any
  };
}

function extractTransformsLayered(spec: NormalizedLayerSpec, config: Config): NormalizedLayerSpec {
  const {layer, ...rest} = spec;
  return {
    ...rest,
    layer: layer.map(subspec => {
      return extractTransforms(subspec, config) as any;
    })
  };
}

function extractTransformsVConcat(
  spec: GenericVConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>,
  config: Config
): NormalizedConcatSpec {
  const {vconcat, ...rest} = spec;
  return {
    ...rest,
    vconcat: vconcat.map(subspec => {
      return extractTransforms(subspec, config) as any;
    })
  };
}

function extractTransformsHConcat(
  spec: GenericHConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>,
  config: Config
): NormalizedConcatSpec {
  const {hconcat, ...rest} = spec;
  return {
    ...rest,
    hconcat: hconcat.map(subspec => {
      return extractTransforms(subspec, config) as any;
    })
  };
}
