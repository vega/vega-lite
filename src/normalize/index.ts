import type {SignalRef} from 'vega';
import {isString} from 'vega-util';
import {Field} from '../channeldef.js';
import {Config, initConfig} from '../config.js';
import * as log from '../log/index.js';
import {
  FacetedUnitSpec,
  isFacetSpec,
  isHConcatSpec,
  isLayerSpec,
  isUnitSpec,
  isVConcatSpec,
  LayoutSizeMixins,
  NonNormalizedSpec,
  NormalizedSpec,
  RepeatSpec,
  TopLevelSpec,
} from '../spec/index.js';
import {isFacetMapping} from '../spec/facet.js';
import {AutoSizeParams, AutosizeType, TopLevel} from '../spec/toplevel.js';
import {deepEqual} from '../util.js';
import {NormalizerParams} from './base.js';
import {CoreNormalizer} from './core.js';
import {SelectionCompatibilityNormalizer} from './selectioncompat.js';
import {TopLevelSelectionsNormalizer} from './toplevelselection.js';

export function normalize(
  spec: TopLevelSpec & LayoutSizeMixins,
  config?: Config<SignalRef>,
): TopLevel<NormalizedSpec> & LayoutSizeMixins {
  if (config === undefined) {
    config = initConfig(spec.config);
  }

  const normalizedSpec = normalizeGenericSpec(spec, config);

  const {width, height} = spec;
  const autosize = normalizeAutoSize(normalizedSpec, {width, height, autosize: spec.autosize}, config);

  return {
    ...normalizedSpec,
    ...(autosize ? {autosize} : {}),
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
  spec: NonNormalizedSpec | FacetedUnitSpec<Field, any> | RepeatSpec,
  config: Config<SignalRef> = {},
) {
  const normParams = {config};
  return topLevelSelectionNormalizer.map(
    coreNormalizer.map(selectionCompatNormalizer.map(spec, normParams), normParams),
    normParams,
  );
}

function _normalizeAutoSize(autosize: AutosizeType | AutoSizeParams) {
  return isString(autosize) ? {type: autosize} : (autosize ?? {});
}

type FitCompatibility = {
  x: boolean;
  y: boolean;
};

function getFitCompatibility(spec: TopLevel<NormalizedSpec>): FitCompatibility {
  if (isUnitSpec(spec) || isLayerSpec(spec)) {
    return {x: true, y: true};
  }

  if (isVConcatSpec(spec) || (!isHConcatSpec(spec) && !isFacetSpec(spec) && spec.columns === 1)) {
    return {x: true, y: false};
  }

  if (
    isHConcatSpec(spec) ||
    (!isVConcatSpec(spec) &&
      !isFacetSpec(spec) &&
      (spec.columns === undefined || (spec.columns > 1 && spec.concat.length === spec.columns)))
  ) {
    return {x: false, y: true};
  }

  if (isFacetSpec(spec)) {
    if (isFacetMapping(spec.facet)) {
      const hasRow = spec.facet.row !== undefined;
      const hasColumn = spec.facet.column !== undefined;

      if (hasRow && !hasColumn) {
        return {x: true, y: false};
      }

      if (hasColumn && !hasRow) {
        return {x: false, y: true};
      }

      return {x: false, y: false};
    }

    if (spec.columns === 1) {
      return {x: true, y: false};
    }

    if (spec.columns === undefined) {
      return {x: false, y: true};
    }
  }

  return {x: false, y: false};
}

/**
 * Normalize autosize and deal with width or height == "container".
 */
export function normalizeAutoSize(
  spec: TopLevel<NormalizedSpec>,
  sizeInfo: {autosize: AutosizeType | AutoSizeParams} & LayoutSizeMixins,
  config?: Config,
) {
  let {width, height} = sizeInfo;

  const fitCompatibility = getFitCompatibility(spec);
  const autosizeDefault: AutoSizeParams = {};

  // If a dimension is incompatible, discard container size for that dimension.
  if (width == 'container' && !fitCompatibility.x) {
    log.warn(log.message.containerSizeNonSingle('width'));
    width = undefined;
  }
  if (height == 'container' && !fitCompatibility.y) {
    log.warn(log.message.containerSizeNonSingle('height'));
    height = undefined;
  }

  // Default autosize parameters to fit when width/height is "container"
  if (width == 'container' && height == 'container') {
    if (fitCompatibility.x && fitCompatibility.y) {
      autosizeDefault.type = 'fit';
      autosizeDefault.contains = 'padding';
    } else if (fitCompatibility.x) {
      autosizeDefault.type = 'fit-x';
      autosizeDefault.contains = 'padding';
    } else if (fitCompatibility.y) {
      autosizeDefault.type = 'fit-y';
      autosizeDefault.contains = 'padding';
    }
  } else if (width == 'container' && fitCompatibility.x) {
    autosizeDefault.type = 'fit-x';
    autosizeDefault.contains = 'padding';
  } else if (height == 'container' && fitCompatibility.y) {
    autosizeDefault.type = 'fit-y';
    autosizeDefault.contains = 'padding';
  }

  const autosize: AutoSizeParams = {
    type: 'pad',
    ...autosizeDefault,
    ...(config ? _normalizeAutoSize(config.autosize) : {}),
    ..._normalizeAutoSize(spec.autosize),
  };

  if (autosize.type === 'fit' && !(fitCompatibility.x && fitCompatibility.y)) {
    if (fitCompatibility.x || fitCompatibility.y) {
      autosize.type = fitCompatibility.x ? 'fit-x' : 'fit-y';
      log.warn(log.message.droppingFit(fitCompatibility.x ? 'y' : 'x'));
    } else {
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

  // Delete autosize property if it's Vega's default
  if (deepEqual(autosize, {type: 'pad'})) {
    return undefined;
  }

  return autosize;
}

export type {NormalizerParams};
