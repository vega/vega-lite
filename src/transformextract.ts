import {Config} from './config';
import {extractTransformsFromEncoding, forEach} from './encoding';
import {getGuide} from './fielddef';
import * as log from './log';
import {
  forEachUnitSpec,
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
import {StringSet} from './util';

/**
 * Modifies spec extracting transformations from encoding and moving them to the transforms array
 */
export function extractTransforms(spec: NormalizedSpec, config: Config): NormalizedSpec {
  return doExtractTransforms(spec, config, getChannelsWithTitles(spec));
}

function doExtractTransforms(spec: NormalizedSpec, config: Config, channelsWithTitles: StringSet): NormalizedSpec {
  if (isFacetSpec(spec) || isRepeatSpec(spec)) {
    return extractTransformsSingle(spec, config, channelsWithTitles);
  }
  if (isLayerSpec(spec)) {
    return extractTransformsLayered(spec, config, channelsWithTitles);
  }
  if (isUnitSpec(spec)) {
    return extractTransformsUnit(spec, config, channelsWithTitles);
  }
  if (isVConcatSpec(spec)) {
    return extractTransformsVConcat(spec, config, channelsWithTitles);
  }
  if (isHConcatSpec(spec)) {
    return extractTransformsHConcat(spec, config, channelsWithTitles);
  }
  throw new Error(log.message.INVALID_SPEC);
}

function extractTransformsUnit(
  spec: NormalizedUnitSpec,
  config: Config,
  channelsWithTitles: StringSet = {}
): NormalizedUnitSpec {
  if (spec.encoding) {
    const {encoding: oldEncoding, transform: oldTransforms, ...rest} = spec;
    const {bins, timeUnits, aggregate, groupby, encoding: newEncoding} = extractTransformsFromEncoding(
      oldEncoding,
      config,
      channelsWithTitles
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
  config: Config,
  channelsWithTitles: StringSet = {}
): NormalizedFacetSpec | NormalizedRepeatSpec {
  const {spec: subspec, ...rest} = spec;
  return {
    ...rest,
    spec: doExtractTransforms(subspec, config, channelsWithTitles) as any
  };
}

function extractTransformsLayered(
  spec: NormalizedLayerSpec,
  config: Config,
  channelsWithTitles: StringSet = {}
): NormalizedLayerSpec {
  const {layer, ...rest} = spec;
  return {
    ...rest,
    layer: layer.map(subspec => {
      return doExtractTransforms(subspec, config, channelsWithTitles) as any;
    })
  };
}

function extractTransformsVConcat(
  spec: GenericVConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>,
  config: Config,
  channelsWithTitles: StringSet = {}
): NormalizedConcatSpec {
  const {vconcat, ...rest} = spec;
  return {
    ...rest,
    vconcat: vconcat.map(subspec => {
      return doExtractTransforms(subspec, config, channelsWithTitles) as any;
    })
  };
}

function extractTransformsHConcat(
  spec: GenericHConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>,
  config: Config,
  channelsWithTitles: StringSet = {}
): NormalizedConcatSpec {
  const {hconcat, ...rest} = spec;
  return {
    ...rest,
    hconcat: hconcat.map(subspec => {
      return doExtractTransforms(subspec, config, channelsWithTitles) as any;
    })
  };
}

export function getChannelsWithTitles(spec: NormalizedSpec): StringSet {
  const channelsWithTitles: StringSet = {};
  forEachUnitSpec(spec, (unit: NormalizedUnitSpec) => {
    if (unit.encoding) {
      forEach(unit.encoding, (channelDef, channel) => {
        const guide = getGuide(channelDef);
        if (channelDef.title || (guide && guide.title !== undefined)) {
          channelsWithTitles[channel] = true;
        }
      });
    }
  });
  return channelsWithTitles;
}
