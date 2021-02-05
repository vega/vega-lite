import {SignalRef} from 'vega';
import {isString} from 'vega-util';
import {Field} from '../channeldef';
import {Config, initConfig} from '../config';
import * as log from '../log';
import {
  FacetedUnitSpec,
  isLayerSpec,
  isUnitSpec,
  LayoutSizeMixins,
  NonNormalizedSpec,
  NormalizedSpec,
  RepeatSpec,
  TopLevelSpec
} from '../spec';
import {AutoSizeParams, AutosizeType, TopLevel} from '../spec/toplevel';
import {deepEqual} from '../util';
import {NormalizerParams} from './base';
import {CoreNormalizer} from './core';
import {SelectionCompatibilityNormalizer} from './selectioncompat';
import {TopLevelSelectionsNormalizer} from './toplevelselection';

export function normalize(
  spec: TopLevelSpec & LayoutSizeMixins,
  config?: Config<SignalRef>
): TopLevel<NormalizedSpec> & LayoutSizeMixins {
  if (config === undefined) {
    config = initConfig(spec.config);
  }

  const normalizedSpec = normalizeGenericSpec(spec, config);

  const {width, height} = spec;
  const autosize = normalizeAutoSize(normalizedSpec, {width, height, autosize: spec.autosize}, config);

  return {
    ...normalizedSpec,
    ...(autosize ? {autosize} : {})
  };
}

const coreNormalizer = new CoreNormalizer();
const selectionCompatNormalizer = new SelectionCompatibilityNormalizer();
const topLevelSelectionNormalizer = new TopLevelSelectionsNormalizer();

/**
 * Decompose extended unit specs into composition of pure unit specs.
 * And push top-level selection definitions down to unit specs.
 */
function normalizeGenericSpec(
  spec: NonNormalizedSpec | FacetedUnitSpec<Field> | RepeatSpec,
  config: Config<SignalRef> = {}
) {
  const normParams = {config};
  return topLevelSelectionNormalizer.map(
    coreNormalizer.map(selectionCompatNormalizer.map(spec, normParams), normParams),
    normParams
  );
}

function _normalizeAutoSize(autosize: AutosizeType | AutoSizeParams) {
  return isString(autosize) ? {type: autosize} : autosize ?? {};
}

/**
 * Normalize autosize and deal with width or height == "container".
 */
export function normalizeAutoSize(
  spec: TopLevel<NormalizedSpec>,
  sizeInfo: {autosize: AutosizeType | AutoSizeParams} & LayoutSizeMixins,
  config?: Config
) {
  let {width, height} = sizeInfo;

  const isFitCompatible = isUnitSpec(spec) || isLayerSpec(spec);
  const autosizeDefault: AutoSizeParams = {};

  if (!isFitCompatible) {
    // If spec is not compatible with autosize == "fit", discard width/height == container
    if (width == 'container') {
      log.warn(log.message.containerSizeNonSingle('width'));
      width = undefined;
    }
    if (height == 'container') {
      log.warn(log.message.containerSizeNonSingle('height'));
      height = undefined;
    }
  } else {
    // Default autosize parameters to fit when width/height is "container"
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
  }

  const autosize: AutoSizeParams = {
    type: 'pad',
    ...autosizeDefault,
    ...(config ? _normalizeAutoSize(config.autosize) : {}),
    ..._normalizeAutoSize(spec.autosize)
  };

  if (autosize.type === 'fit' && !isFitCompatible) {
    log.warn(log.message.FIT_NON_SINGLE);
    autosize.type = 'pad';
  }

  if (width == 'container' && !(autosize.type == 'fit' || autosize.type == 'fit-x')) {
    log.warn(log.message.containerSizeNotCompatibleWithAutosize('width'));
  }
  if (height == 'container' && !(autosize.type == 'fit' || autosize.type == 'fit-y')) {
    log.warn(log.message.containerSizeNotCompatibleWithAutosize('height'));
  }

  // Delete autosize property if it's Vega's default
  if (deepEqual(autosize, {type: 'pad'})) {
    return undefined;
  }

  return autosize;
}

export type {NormalizerParams};
