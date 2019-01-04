import {Config} from '../config';
import {Encoding} from '../encoding';
import {Field} from '../fielddef';
import * as log from '../log';
import {MarkDef} from '../mark';
import {GenericUnitSpec, NormalizedLayerSpec} from '../spec';
import {Flag, keys} from '../util';
import {Interpolate, Orient} from '../vega.schema';
import {GenericCompositeMarkDef, makeCompositeAggregatePartFactory, PartsMixins} from './common';
import {ErrorBarCenter, ErrorBarExtent, errorBarParams, ErrorEncoding} from './errorbar';

export type ErrorBandUnitSpec<
  EE = {} // extra encoding parameter (for faceted composite unit spec)
> = GenericUnitSpec<ErrorEncoding<Field> & EE, ErrorBand | ErrorBandDef>;

export const ERRORBAND: 'errorband' = 'errorband';
export type ErrorBand = typeof ERRORBAND;

export type ErrorBandPart = 'band' | 'borders';

const ERRORBAND_PART_INDEX: Flag<ErrorBandPart> = {
  band: 1,
  borders: 1
};

export const ERRORBAND_PARTS = keys(ERRORBAND_PART_INDEX);

export type ErrorBandPartsMixins = PartsMixins<ErrorBandPart>;

export interface ErrorBandConfig extends ErrorBandPartsMixins {
  /**
   * The center of the error band. Available options include:
   * - `"mean"`: the mean of the data points.
   * - `"median"`: the median of the data points.
   *
   * __Default value:__ `"mean"`.
   * @hide
   */

  // center is not needed right now but will be added back to the schema if future features require it.
  center?: ErrorBarCenter;

  /**
   * The extent of the band. Available options include:
   * - `"ci"`: Extend the band to the confidence interval of the mean.
   * - `"stderr"`: The size of band are set to the value of standard error, extending from the mean.
   * - `"stdev"`: The size of band are set to the value of standard deviation, extending from the mean.
   * - `"iqr"`: Extend the band to the q1 and q3.
   *
   * __Default value:__ `"stderr"`.
   */
  extent?: ErrorBarExtent;

  /**
   * The line interpolation method for the error band. One of the following:
   * - `"linear"`: piecewise linear segments, as in a polyline.
   * - `"linear-closed"`: close the linear segments to form a polygon.
   * - `"step"`: alternate between horizontal and vertical segments, as in a step function.
   * - `"step-before"`: alternate between vertical and horizontal segments, as in a step function.
   * - `"step-after"`: alternate between horizontal and vertical segments, as in a step function.
   * - `"basis"`: a B-spline, with control point duplication on the ends.
   * - `"basis-open"`: an open B-spline; may not intersect the start or end.
   * - `"basis-closed"`: a closed B-spline, as in a loop.
   * - `"cardinal"`: a Cardinal spline, with control point duplication on the ends.
   * - `"cardinal-open"`: an open Cardinal spline; may not intersect the start or end, but will intersect other control points.
   * - `"cardinal-closed"`: a closed Cardinal spline, as in a loop.
   * - `"bundle"`: equivalent to basis, except the tension parameter is used to straighten the spline.
   * - `"monotone"`: cubic interpolation that preserves monotonicity in y.
   */
  interpolate?: Interpolate;

  /**
   * The tension parameter for the interpolation type of the error band.
   * @minimum 0
   * @maximum 1
   */
  tension?: number;
}

export type ErrorBandDef = GenericCompositeMarkDef<ErrorBand> &
  ErrorBandConfig & {
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

export function normalizeErrorBand(
  spec: GenericUnitSpec<Encoding<string>, ErrorBand | ErrorBandDef>,
  config: Config
): NormalizedLayerSpec {
  const {
    transform,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis,
    markDef,
    outerSpec,
    tooltipEncoding
  } = errorBarParams(spec, ERRORBAND, config);

  const makeErrorBandPart = makeCompositeAggregatePartFactory<ErrorBandPartsMixins>(
    markDef,
    continuousAxis,
    continuousAxisChannelDef,
    encodingWithoutContinuousAxis,
    config.errorband
  );

  const is2D = spec.encoding.x !== undefined && spec.encoding.y !== undefined;

  let bandMark: MarkDef = {type: is2D ? 'area' : 'rect'};
  let bordersMark: MarkDef = {type: is2D ? 'line' : 'rule'};
  const interpolate = {
    ...(markDef.interpolate ? {interpolate: markDef.interpolate} : {}),
    ...(markDef.tension && markDef.interpolate ? {interpolate: markDef.tension} : {})
  };

  if (is2D) {
    bandMark = {
      ...bandMark,
      ...interpolate
    };
    bordersMark = {
      ...bordersMark,
      ...interpolate
    };
  } else if (markDef.interpolate) {
    log.warn(log.message.errorBand1DNotSupport('interpolate'));
  } else if (markDef.tension) {
    log.warn(log.message.errorBand1DNotSupport('tension'));
  }

  return {
    ...outerSpec,
    transform,
    layer: [
      ...makeErrorBandPart({
        partName: 'band',
        mark: bandMark,
        positionPrefix: 'lower',
        endPositionPrefix: 'upper',
        extraEncoding: tooltipEncoding
      }),
      ...makeErrorBandPart({
        partName: 'borders',
        mark: bordersMark,
        positionPrefix: 'lower',
        extraEncoding: tooltipEncoding
      }),
      ...makeErrorBandPart({
        partName: 'borders',
        mark: bordersMark,
        positionPrefix: 'upper',
        extraEncoding: tooltipEncoding
      })
    ]
  };
}
