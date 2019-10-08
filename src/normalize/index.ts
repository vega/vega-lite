import {isString} from 'vega-util';
import {Config, initConfig} from '../config';
import * as log from '../log';
import {
  ExtendedLayerSpec,
  FacetedUnitSpec,
  GenericSpec,
  isLayerSpec,
  isUnitSpec,
  LayoutSizeMixins,
  NormalizedSpec,
  UnitSpec
} from '../spec';
import {TopLevelSpec} from '../spec/index';
import {AutoSizeParams, AutosizeType, TopLevel} from '../spec/toplevel';
import {NormalizerParams} from './base';
import {CoreNormalizer} from './core';
import {deepEqual} from '../util';

export function normalize(
  spec: TopLevelSpec & LayoutSizeMixins,
  config?: Config
): TopLevel<NormalizedSpec> & LayoutSizeMixins {
  if (config === undefined) {
    config = initConfig(spec.config);
  }

  let normalizedSpec = normalizeGenericSpec(spec, config);

  // Normalize autosize and deal with width or height == "container"
  normalizedSpec = normalizeAutoSize(
    normalizedSpec,
    {width: spec.width, height: spec.height, autosize: spec.autosize},
    config
  );

  return normalizedSpec;
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

/** Helper function for normalizeAutoSize */
function _normalizeAutoSize(autosize: AutosizeType | AutoSizeParams) {
  return isString(autosize) ? {type: autosize} : autosize || {};
}

export function normalizeAutoSize(
  spec: TopLevel<NormalizedSpec>,
  sizeInfo: {autosize: AutosizeType | AutoSizeParams} & LayoutSizeMixins,
  config?: Config
): TopLevel<NormalizedSpec> & LayoutSizeMixins {
  let {width, height} = sizeInfo;

  const isFitCompatible = isUnitSpec(spec) || isLayerSpec(spec);

  // Don't attempt to change autosize if spec is not compatible with autosize == "fit"
  if (!isFitCompatible) {
    if (width == 'container') {
      log.warn(log.message.containerSizeNonSingle('width'));
      width = undefined;
    }
    if (height == 'container') {
      log.warn(log.message.containerSizeNonSingle('height'));
      height = undefined;
    }
  }

  // Default autosize parameters to fit when width/height is "container"
  const autosizeDefault: AutoSizeParams = {};
  if (width == 'container' && height == 'container') {
    autosizeDefault.type = 'fit';
    autosizeDefault.contains = 'padding';
  } else if (width == 'container') {
    autosizeDefault.type = 'fit-x';
    autosizeDefault.contains = 'padding';
  } else if (height == 'container') {
    autosizeDefault.type = 'fit-y';
    autosizeDefault.contains = 'padding';
  }

  const autosize: AutoSizeParams = {
    type: 'pad',
    ...autosizeDefault,
    ...(config ? _normalizeAutoSize(config.autosize) : {}),
    ..._normalizeAutoSize(spec.autosize)
  };

  if (autosize.type === 'fit') {
    if (!isFitCompatible) {
      log.warn(log.message.FIT_NON_SINGLE);
      autosize.type = 'pad';
    }
  }

  if (width == 'container' && !(autosize.type == 'fit' || autosize.type == 'fit-x')) {
    log.warn(log.message.containerSizeNotCompatibleWithAutosize('width'));
  }
  if (height == 'container' && !(autosize.type == 'fit' || autosize.type == 'fit-y')) {
    log.warn(log.message.containerSizeNotCompatibleWithAutosize('height'));
  }

  const result: TopLevel<NormalizedSpec> & LayoutSizeMixins = {...spec, autosize: autosize};
  if (isFitCompatible) {
    if (result.width === undefined && width !== undefined) result.width = width;
    if (result.height === undefined && height !== undefined) result.height = height;
  }

  // Delete autosize property if it's Vega's default
  if (deepEqual(result.autosize, {type: 'pad'})) {
    delete result.autosize;
  }

  return result;
}

export {NormalizerParams};
