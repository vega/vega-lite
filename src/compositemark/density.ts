import {Interpolate, Orientation} from 'vega';
import {isContinuousFieldOrDatumDef, isFieldDef, PositionFieldDef} from '../channeldef.js';
import {Config} from '../config.js';
import {Encoding, extractTransformsFromEncoding, normalizeEncoding} from '../encoding.js';
import * as log from '../log/index.js';
import {isMarkDef, MarkDef} from '../mark.js';
import {NormalizerParams} from '../normalize/index.js';
import {GenericUnitSpec, NormalizedLayerSpec} from '../spec/index.js';
import {DensityTransform, Transform} from '../transform.js';
import {hasProperty} from '../util.js';
import {CompositeMarkNormalizer} from './base.js';
import {compositeMarkOrient, GenericCompositeMarkDef, PartsMixins} from './common.js';

export const DENSITY = 'density' as const;
export type Density = typeof DENSITY;

export const DENSITY_PARTS = ['density'] as const;

type DensityPart = (typeof DENSITY_PARTS)[number];

export type DensityPartsMixins = PartsMixins<DensityPart>;

export interface DensityConfig extends DensityPartsMixins {
  /**
   * The bandwidth (standard deviation) of the Gaussian kernel. If unspecified or set to zero, the bandwidth value is automatically estimated from the input data using Scott's rule.
   */
  bandwidth?: number;

  /**
   * A boolean flag indicating whether to produce density estimates (false) or cumulative density estimates (true).
   *
   * __Default value:__ `false`
   */
  cumulative?: boolean;

  /**
   * A boolean flag indicating if the output values should be probability estimates (false) or smoothed counts (true).
   *
   * __Default value:** `false`
   */
  counts?: boolean;

  /**
   * A [min, max] domain from which to sample the distribution. If unspecified, the extent will be determined by the observed minimum and maximum values of the density value field.
   */
  extent?: [number, number];

  /**
   * The minimum number of samples to take along the extent domain for plotting the density.
   *
   * __Default value:__ `25`
   */
  minsteps?: number;

  /**
   * The maximum number of samples to take along the extent domain for plotting the density.
   *
   * __Default value:__ `200`
   */
  maxsteps?: number;

  /**
   * The exact number of samples to take along the extent domain for plotting the density. If specified, overrides both minsteps and maxsteps to set an exact number of uniform samples.
   */
  steps?: number;

  /**
   * The line interpolation method for the density area. One of the following:
   * - `"linear"`: piecewise linear segments, as in a polyline.
   * - `"linear-closed"`: close the linear segments to form a polygon.
   * - `"step"`: a piecewise constant function (a step function) consisting of alternating horizontal and vertical lines. The y-value changes at the midpoint of each pair of adjacent x-values.
   * - `"step-before"`: a piecewise constant function (a step function) consisting of alternating horizontal and vertical lines. The y-value changes before the x-value.
   * - `"step-after"`: a piecewise constant function (a step function) consisting of alternating horizontal and vertical lines. The y-value changes after the x-value.
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
   * The tension parameter for the interpolation type of the density area.
   *
   * @minimum 0
   * @maximum 1
   */
  tension?: number;
}

export type DensityDef = GenericCompositeMarkDef<Density> &
  DensityConfig & {
    /**
     * Orientation of the density. This is normally automatically determined based on types of fields on x and y channels. However, an explicit `orient` be specified when the orientation is ambiguous.
     */
    orient?: Orientation;
  };

export interface DensityConfigMixins {
  /**
   * Density Config
   */
  density?: DensityConfig;
}

export const densityNormalizer = new CompositeMarkNormalizer(DENSITY, normalizeDensity);

export function normalizeDensity(
  spec: GenericUnitSpec<Encoding<string>, Density | DensityDef>,
  {config}: NormalizerParams,
): NormalizedLayerSpec {
  spec = {
    ...spec,
    encoding: normalizeEncoding(spec.encoding, config),
  };

  const {mark, encoding: _encoding, params, projection: _p, ...outerSpec} = spec;
  const markDef: DensityDef = isMarkDef(mark) ? mark : {type: mark};

  if (params) {
    log.warn(log.message.selectionNotSupported('density'));
  }

  const {transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis} = densityParams(
    spec,
    markDef,
    config,
  );

  const aliasedFieldName = continuousAxisChannelDef.field;

  const {orient} = markDef;
  const markOrient = continuousAxis === 'y' ? 'horizontal' : 'vertical';

  const densityMark: MarkDef = {
    type: 'area',
    orient: orient ?? markOrient,
    ...(markDef.opacity !== undefined ? {opacity: markDef.opacity} : {}),
    ...(markDef.color !== undefined ? {color: markDef.color} : {}),
    ...(markDef.interpolate !== undefined ? {interpolate: markDef.interpolate} : {}),
    ...(markDef.tension !== undefined ? {tension: markDef.tension} : {}),
    ...(markDef.clip !== undefined ? {clip: markDef.clip} : {}),
  };

  // Density transform outputs "value" and "density" by default
  const valueField = 'value';
  const densityField = 'density';

  // Preserve the original field's title if it was specified
  const valueFieldTitle = hasProperty(continuousAxisChannelDef, 'title')
    ? continuousAxisChannelDef.title
    : aliasedFieldName;

  const layer = [
    {
      mark: densityMark,
      encoding: {
        [continuousAxis]: {
          field: valueField,
          type: continuousAxisChannelDef.type,
          title: valueFieldTitle,
          ...(hasProperty(continuousAxisChannelDef, 'scale') ? {scale: continuousAxisChannelDef.scale} : {}),
          ...(hasProperty(continuousAxisChannelDef, 'axis') ? {axis: continuousAxisChannelDef.axis} : {}),
        },
        [continuousAxis === 'x' ? 'y' : 'x']: {
          field: densityField,
          type: 'quantitative',
        },
        ...encodingWithoutContinuousAxis,
      },
    },
  ];

  return {
    ...outerSpec,
    transform,
    layer,
  };
}

function densityParams(
  spec: GenericUnitSpec<Encoding<string>, Density | DensityDef>,
  markDef: DensityDef,
  config: Config,
): {
  transform: Transform[];
  continuousAxisChannelDef: PositionFieldDef<string>;
  continuousAxis: 'x' | 'y';
  encodingWithoutContinuousAxis: Encoding<string>;
} {
  const orient = compositeMarkOrient(spec, DENSITY);
  const {continuousAxisChannelDef, continuousAxis} = getDensityContinuousAxis(spec, orient);

  const {[continuousAxis]: _oldContinuousAxisChannelDef, ...encodingWithoutContinuousAxis} = spec.encoding;

  const {
    bins,
    timeUnits,
    aggregate: oldAggregate,
    groupby,
    encoding: normalizedEncodingWithoutContinuousAxis,
  } = extractTransformsFromEncoding(encodingWithoutContinuousAxis, config);

  const groupbyFields = groupby;

  const densityConfig = (config as any).density as DensityConfig | undefined;

  const densityTransform: DensityTransform = {
    density: continuousAxisChannelDef.field,
    groupby: groupbyFields.length > 0 ? groupbyFields : undefined,
    ...(markDef.bandwidth !== undefined ? {bandwidth: markDef.bandwidth} : {}),
    ...(markDef.extent !== undefined ? {extent: markDef.extent} : {}),
    ...(markDef.minsteps !== undefined ? {minsteps: markDef.minsteps} : {}),
    ...(markDef.maxsteps !== undefined ? {maxsteps: markDef.maxsteps} : {}),
    ...(markDef.steps !== undefined ? {steps: markDef.steps} : {}),
    ...(markDef.cumulative !== undefined ? {cumulative: markDef.cumulative} : {}),
    ...(markDef.counts !== undefined ? {counts: markDef.counts} : {}),
    ...(densityConfig?.bandwidth !== undefined && markDef.bandwidth === undefined
      ? {bandwidth: densityConfig.bandwidth}
      : {}),
    ...(densityConfig?.extent !== undefined && markDef.extent === undefined ? {extent: densityConfig.extent} : {}),
    ...(densityConfig?.minsteps !== undefined && markDef.minsteps === undefined
      ? {minsteps: densityConfig.minsteps}
      : {}),
    ...(densityConfig?.maxsteps !== undefined && markDef.maxsteps === undefined
      ? {maxsteps: densityConfig.maxsteps}
      : {}),
    ...(densityConfig?.steps !== undefined && markDef.steps === undefined ? {steps: densityConfig.steps} : {}),
    ...(densityConfig?.cumulative !== undefined && markDef.cumulative === undefined
      ? {cumulative: densityConfig.cumulative}
      : {}),
    ...(densityConfig?.counts !== undefined && markDef.counts === undefined ? {counts: densityConfig.counts} : {}),
  };

  const transform: Transform[] = [
    ...(spec.transform ?? []),
    ...bins,
    ...timeUnits,
    ...(oldAggregate.length > 0 ? [{aggregate: oldAggregate, groupby: groupbyFields}] : []),
    densityTransform,
  ];

  return {
    transform,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis: normalizedEncodingWithoutContinuousAxis,
  };
}

function getDensityContinuousAxis(
  spec: GenericUnitSpec<Encoding<string>, Density | DensityDef>,
  orient: Orientation,
): {
  continuousAxisChannelDef: PositionFieldDef<string>;
  continuousAxis: 'x' | 'y';
} {
  const {encoding} = spec;
  const continuousAxis: 'x' | 'y' = orient === 'vertical' ? 'y' : 'x';
  const continuousAxisChannelDef = encoding[continuousAxis];

  if (!isFieldDef(continuousAxisChannelDef) || !isContinuousFieldOrDatumDef(continuousAxisChannelDef)) {
    throw new Error(
      `The ${continuousAxis} channel for a density mark must be a continuous field. Received ${JSON.stringify(continuousAxisChannelDef)}`,
    );
  }

  return {
    continuousAxisChannelDef,
    continuousAxis,
  };
}
