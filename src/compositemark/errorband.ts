import {Config} from '../config';
import {isMarkDef, MarkConfig} from '../mark';
import {AggregatedFieldDef, CalculateTransform} from '../transform';
import {Flag, keys} from '../util';
import {Encoding} from './../encoding';
import * as log from './../log';
import {GenericUnitSpec, NormalizedLayerSpec} from './../spec';
import {Orient} from './../vega.schema';
import {
  filterUnsupportedChannels,
  GenericCompositeMarkDef,
  makeCompositeAggregatePartFactory,
} from './common';
import {ErrorBarCenter, ErrorBarExtent, errorBarParams} from './errorbar';

export const ERRORBAND: 'errorband' = 'errorband';
export type ErrorBand = typeof ERRORBAND;

export type ErrorBandPart = 'band' | 'rims';

const ERRORBAND_PART_INDEX: Flag<ErrorBandPart> = {
  band: 1,
  rims: 1
};

export const ERRORBAND_PARTS = keys(ERRORBAND_PART_INDEX);

// TODO: Currently can't use `PartsMixins<ErrorBandPart>`
// as the schema generator will fail
export type ErrorBandPartsMixins = {
  [part in ErrorBandPart]?: boolean | MarkConfig
};

export interface ErrorBandConfig extends ErrorBandPartsMixins {
  /**
   * The center of the error band. Available options include:
   * - `"mean": the mean of the data points.
   * - `"median": the median of the data points.
   *
   * __Default value:__ `"mean"`.
   */
  center?: ErrorBarCenter;

  /**
   * The extent of the band. Available options include:
   * - `"ci": Extend the band to the confidence interval of the mean.
   * - `"stderr": The size of band are set to the value of standard error, extending from the center.
   * - `"stdev": The size of band are set to the value of standard deviation, extending from the center.
   * - `"iqr": Extend the band to the q1 and q3.
   *
   * __Default value:__ `"stderr"`.
   */
  extent?: ErrorBarExtent;
}

export type ErrorBandDef = GenericCompositeMarkDef<ErrorBand> & ErrorBandConfig & {
  /**
   * Orientation of the error band. This is normally automatically determined, but can be specified when the orientation is ambiguous and cannot be automatically determined.
   */
  orient?: Orient;
};

export interface ErrorBandConfigMixins {
  /**
   * ErrorBand Config
   */
  errorband?: ErrorBandConfig;
}

export function normalizeErrorBand(spec: GenericUnitSpec<Encoding<string>, ErrorBand | ErrorBandDef>, config: Config): NormalizedLayerSpec {
  spec = filterUnsupportedChannels(spec, ERRORBAND);

  // TODO: use selection
  const {mark, encoding, selection, projection: _p, ...outerSpec} = spec;
  const markDef: ErrorBandDef = isMarkDef(mark) ? mark : {type: mark};

  // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
  if (selection) {
    log.warn(log.message.selectionNotSupported('errorband'));
  }

  const center: ErrorBarCenter = markDef.center || config.errorband.center;
  const extent: ErrorBarExtent = markDef.extent || ((center === 'mean') ? 'stderr' : 'iqr');

  if ((center === 'median') !== (extent === 'iqr')) {
    log.warn(`${center} is not usually used with ${extent} for error band.`);
  }

  const {transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis} = errorBarParams(spec, center, extent, ERRORBAND);

  // drop size
  const {size: _s, ...sharedEncoding} = encodingWithoutContinuousAxis;

  const makeErrorBandPart = makeCompositeAggregatePartFactory<ErrorBandPartsMixins>(
      markDef,
      continuousAxis,
      continuousAxisChannelDef,
      sharedEncoding,
      config.errorband
  );

  return {
    ...outerSpec,
    transform,
    layer: [
      ...makeErrorBandPart('band', 'area', 'lower', 'upper'),
      ...makeErrorBandPart('rims', 'line', 'lower'),
      ...makeErrorBandPart('rims', 'line', 'upper'),
    ]
  };
}
