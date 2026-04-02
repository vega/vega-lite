import {Interpolate, Orientation} from 'vega';
import {PositionFieldDef} from '../channeldef.js';
import {Config} from '../config.js';
import {Encoding, extractTransformsFromEncoding, normalizeEncoding} from '../encoding.js';
import * as log from '../log/index.js';
import {isMarkDef} from '../mark.js';
import {NormalizerParams} from '../normalize/index.js';
import {NormalizeLayerOrUnit} from '../normalize/base.js';
import {GenericUnitSpec, NormalizedLayerSpec} from '../spec/index.js';
import {DensityTransform, Transform} from '../transform.js';
import {CompositeMarkNormalizer} from './base.js';
import {compositeMarkContinuousAxis, compositeMarkOrient, GenericCompositeMarkDef, getTitle} from './common.js';

export const DENSITY = 'density' as const;
export type Density = typeof DENSITY;

export const DENSITY_PARTS = ['density'] as const;

export interface DensityConfig {
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
   * __Default value:__ `false`
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
   * The line interpolation method for the density curve/area.
   */
  interpolate?: Interpolate;

  /**
   * The tension parameter for the interpolation type of the density curve/area.
   *
   * @minimum 0
   * @maximum 1
   */
  tension?: number;

  /**
   * Indicates how parameters for multiple densities should be resolved.
   * If `"independent"`, each density may have its own domain extent and dynamic number of curve sample steps.
   * If `"shared"`, the KDE transform will ensure that all densities are defined over a shared domain and curve steps, enabling stacking.
   *
   * __Default value:__ `"shared"`
   */
  resolve?: 'independent' | 'shared';
}

export type DensityDef = GenericCompositeMarkDef<Density> &
  DensityConfig & {
    /**
     * Orientation of the density. This is normally automatically determined based on types of fields on x and y channels. However, an explicit `orient` be specified when the orientation is ambiguous.
     */
    orient?: Orientation;

    /**
     * Whether to draw the density as a line (true) or a filled area (false).
     *
     * __Default value:__ `false`
     */
    line?: boolean;

    /**
     * A flag for overlaying points on top of the density line or area, or an object defining properties of the overlayed points.
     *
     * - If this property is `"transparent"`, transparent points will be used (for enhancing tooltips and selections).
     * - If this property is an empty object (`{}`) or `true`, filled points with default properties will be used.
     * - If this property is `false`, no points would be automatically added.
     *
     * __Default value:__ `false`.
     */
    point?: boolean | Record<string, unknown> | 'transparent';

    /**
     * Default stroke color.
     */
    stroke?: string | null;

    /**
     * The stroke width in pixels.
     *
     * @minimum 0
     */
    strokeWidth?: number;

    /**
     * The stroke opacity (value between [0,1]).
     *
     * @minimum 0
     * @maximum 1
     */
    strokeOpacity?: number;

    /**
     * An array of alternating stroke length and space lengths for creating dashed lines.
     */
    strokeDash?: number[];

    /**
     * The offset for stroke dash pattern.
     */
    strokeDashOffset?: number;

    /**
     * Default fill color. Only applies when `line` is `false` (area mark).
     */
    fill?: string | null;

    /**
     * The fill opacity (value between [0,1]). Only applies when `line` is `false` (area mark).
     *
     * @minimum 0
     * @maximum 1
     */
    fillOpacity?: number;

    /**
     * Type of stacking offset for the density area. One of `"zero"` (default), `"center"`, or `"normalize"`.
     * - `"zero"`: stacking with a baseline at the bottom of the chart (default stacking)
     * - `"center"`: stream graphs with a baseline at the middle of the chart
     * - `"normalize"`: stacked normalized percentages
     *
     * __Note:__ This is only applicable with `line: false` and when grouping by a field (e.g., `color`).
     */
    stack?: 'zero' | 'center' | 'normalize' | null;
  };

export interface DensityConfigMixins {
  /**
   * Density Config
   */
  density?: DensityConfig;
}

export const densityNormalizer = new CompositeMarkNormalizer(DENSITY, normalizeDensity);

// Properties that apply to both line and area
const SHARED_MARK_PROPS = [
  'opacity',
  'color',
  'interpolate',
  'tension',
  'clip',
  'stroke',
  'strokeWidth',
  'strokeOpacity',
  'strokeDash',
  'strokeDashOffset',
] as const;

// Properties that only apply to area
const AREA_ONLY_PROPS = ['fill', 'fillOpacity'] as const;

export function normalizeDensity(
  spec: GenericUnitSpec<Encoding<string>, Density | DensityDef>,
  {config}: NormalizerParams,
  normalize: NormalizeLayerOrUnit,
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

  if ((markDef as any).as !== undefined) {
    log.warn(log.message.densityMarkAsNotSupported());
  }

  const {
    transform: densityTransforms,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis,
    groupby,
  } = densityParams(spec, markDef, config);

  const {line, point, stack} = markDef;
  const markOrient = continuousAxis === 'y' ? 'horizontal' : 'vertical';
  const useLine = line ?? false;
  const densityAxis = continuousAxis === 'x' ? 'y' : 'x';

  // When line:true, inject window + calculate transforms after the density transform
  // to compute a _y2 (or _x2) field used to suppress the baseline stroke while keeping
  // the vertical drops at both endpoints of the KDE curve.
  // Strategy: set density-axis-baseline = 0 for the first and last row of each group,
  // and = density for all interior rows. This makes the area's closed SVG path:
  //   top curve → right drop → retrace top curve backwards → left drop → close
  // The retrace overlaps the top curve exactly, so the baseline segment disappears.
  const Y2_FIELD = '_density_y2';
  const RN_FIELD = '_density_rn';
  const N_FIELD = '_density_n';

  const lineTransforms: Transform[] = useLine
    ? [
        {
          window: [{op: 'row_number', as: RN_FIELD}],
          sort: [{field: 'value'}],
          ...(groupby.length > 0 ? {groupby} : {}),
        } as Transform,
        {
          window: [{op: 'count', as: N_FIELD}],
          frame: [null, null] as [null, null],
          ...(groupby.length > 0 ? {groupby} : {}),
        } as Transform,
        {
          calculate: `(datum.${RN_FIELD} === 1 || datum.${RN_FIELD} === datum.${N_FIELD}) ? 0 : datum.density`,
          as: Y2_FIELD,
        } as Transform,
      ]
    : [];

  const transform = [...densityTransforms, ...lineTransforms];

  // Build mark object, forwarding applicable visual properties from the markDef.
  // When line:true, use a stroke-only area mark (filled:false). The y2 encoding
  // uses the _density_y2 field which is 0 at the curve endpoints and equals
  // density at interior points — this produces the top KDE curve + vertical drops
  // at both ends, but suppresses the horizontal baseline stroke.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const densityMark: any = {
    type: 'area',
    orient: markOrient,
    ...(useLine ? {filled: false} : {}),
  };

  for (const prop of SHARED_MARK_PROPS) {
    if (markDef[prop] !== undefined) {
      densityMark[prop] = markDef[prop];
    }
  }

  // Forward area-only props (fill/fillOpacity) for area mode.
  // In line mode these are ignored since filled:false makes stroke the primary channel.
  if (!useLine) {
    for (const prop of AREA_ONLY_PROPS) {
      if (markDef[prop] !== undefined) {
        densityMark[prop] = markDef[prop];
      }
    }
  }

  if (point !== undefined) {
    densityMark.point = point;
  }

  // Determine stacking: default to null (no stacking) for both area and line-mode.
  // Stack only takes effect when an explicit non-null value is given.
  const stackEncoding: {stack?: 'zero' | 'center' | 'normalize' | null} = {stack: stack ?? null};

  const layer = [
    {
      mark: densityMark,
      encoding: {
        [continuousAxis]: {
          field: 'value',
          type: continuousAxisChannelDef.type,
          title: getTitle(continuousAxisChannelDef),
          ...(continuousAxisChannelDef.scale !== undefined ? {scale: continuousAxisChannelDef.scale} : {}),
          ...(continuousAxisChannelDef.axis !== undefined ? {axis: continuousAxisChannelDef.axis} : {}),
        },
        [densityAxis]: {
          field: 'density',
          type: 'quantitative',
          ...stackEncoding,
        },
        // When line:true, y2/x2 uses the computed field that suppresses the baseline
        ...(useLine ? {[`${densityAxis}2`]: {field: Y2_FIELD}} : {}),
        ...encodingWithoutContinuousAxis,
      },
    },
  ];

  return normalize(
    {
      ...outerSpec,
      transform,
      layer,
    },
    {config},
  ) as NormalizedLayerSpec;
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
  groupby: string[];
} {
  const orient = compositeMarkOrient(spec, DENSITY);
  const {continuousAxisChannelDef, continuousAxis} = compositeMarkContinuousAxis(spec, orient, DENSITY);

  const {[continuousAxis]: _oldContinuousAxisChannelDef, ...encodingWithoutContinuousAxis} = spec.encoding;

  const {
    bins,
    timeUnits,
    aggregate: oldAggregate,
    groupby,
    encoding: normalizedEncodingWithoutContinuousAxis,
  } = extractTransformsFromEncoding(encodingWithoutContinuousAxis, config);

  const densityConfig = (config as {density?: DensityConfig}).density;

  // Build density transform with precedence: markDef > config
  const transformProps = [
    'bandwidth',
    'extent',
    'minsteps',
    'maxsteps',
    'steps',
    'cumulative',
    'counts',
    'resolve',
  ] as const;
  const transformOverrides = Object.fromEntries(
    transformProps.flatMap((prop) => {
      const value = markDef[prop] ?? densityConfig?.[prop];
      return value !== undefined ? [[prop, value]] : [];
    }),
  );

  const densityTransform: DensityTransform = {
    density: continuousAxisChannelDef.field,
    ...(groupby.length > 0 ? {groupby} : {}),
    ...transformOverrides,
  };

  const transform: Transform[] = [
    ...(spec.transform ?? []),
    ...bins,
    ...timeUnits,
    ...(oldAggregate.length > 0 ? [{aggregate: oldAggregate, groupby}] : []),
    densityTransform,
  ];

  return {
    transform,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis: normalizedEncodingWithoutContinuousAxis,
    groupby,
  };
}
