import {getMarkConfig} from './compile/common';
import {Config} from './config';
import {extractTransformsFromEncoding, isAggregate} from './encoding';
import * as log from './log';
import {CIRCLE, isMarkDef, Mark, MarkDef, POINT, SQUARE, TICK} from './mark';
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
import {contains, getFirstDefined} from './util';

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
    // Hack to ensure that mark's used with aggregates keep opacity of 1.0
    if (isAggregate(spec.encoding)) {
      spec.mark = setMarkOpacityForAggregate(spec.mark, config);
    }

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

/**
 * Set mark's opacity to 1.0 if it's not explicitly defined. This is done in order to ensure
 * that channels with aggregates don't get their opacity set to 0.7 when normalizeMarkDefs is
 * called because they've had their aggregation extracted
 */
function setMarkOpacityForAggregate(mark: Mark | MarkDef, config: Config): Mark | MarkDef {
  const markDef: MarkDef = isMarkDef(mark) ? {...mark} : {type: mark};
  if (contains([POINT, TICK, CIRCLE, SQUARE], markDef.type)) {
    const specifiedOpacity = getFirstDefined(markDef.opacity, getMarkConfig('opacity', markDef, config));
    if (specifiedOpacity === undefined) {
      markDef.opacity = 1;
      return markDef;
    }
  }
  return mark;
}
