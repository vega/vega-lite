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
   * The output fields for the sample value and corresponding density estimate.
   *
   * __Default value:__ `["value", "density"]`
   */
  as?: [string, string];

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
   * __Default value:__ `"shared"`.
   *
   * For grouped densities, the implicit default is `"independent"` when either:
   * - the density renders as a line mark with no explicit non-null `stack`, or
   * - the density renders as an area mark with `stack: null`.
   *
   * This implicit default applies only when `resolve` is not explicitly set in the mark definition or config.
   */
  resolve?: 'independent' | 'shared';

  /**
   * The opacity (value between [0,1]) of the density mark.
   */
  opacity?: number;

  /**
   * Whether the density mark should be clipped to the enclosing group’s width and height.
   */
  clip?: boolean;

  /**
   * Default stroke color.
   */
  stroke?: string | null;

  /**
   * The stroke width in pixels.
   */
  strokeWidth?: number;

  /**
   * The stroke opacity (value between [0,1]).
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
   * Default fill color.
   */
  fill?: string | null;

  /**
   * The fill opacity (value between [0,1]).
   */
  fillOpacity?: number;

  /**
   * Type of stacking offset for the density.
   */
  stack?: 'zero' | 'center' | 'normalize' | null;
}

export type DensityDef = GenericCompositeMarkDef<Density> &
  DensityConfig & {
    /**
     * Orientation of the density. This is normally automatically determined based on types of fields on x and y channels. However, an explicit `orient` be specified when the orientation is ambiguous.
     */
    orient?: Orientation;

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
     * Default fill color. Setting `fill` (or `fillOpacity`) causes the density to render as a filled area mark.
     * When neither `fill` nor `fillOpacity` is set, the density renders as a line mark.
     */
    fill?: string | null;

    /**
     * The fill opacity (value between [0,1]). Setting `fillOpacity` (or `fill`) causes the density to render as a filled area mark.
     * When neither `fill` nor `fillOpacity` is set, the density renders as a line mark.
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
     * __Note:__ Stacking is only applicable for area marks (i.e., when `fill` or `fillOpacity` is set) and when grouping by a field (e.g., `color`).
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

const AREA_SHARED_MARK_PROPS = ['opacity', 'interpolate', 'tension', 'clip'] as const;

// Encoding channels that only apply to area (fill side)
const AREA_ONLY_ENCODING_CHANNELS = ['fill', 'fillOpacity'] as const;
const AREA_ONLY_ENCODING_CHANNEL_SET = new Set<string>(AREA_ONLY_ENCODING_CHANNELS);

// Encoding channels that only apply to line (stroke side)
const LINE_ONLY_ENCODING_CHANNELS = ['color', 'stroke', 'strokeWidth', 'strokeOpacity', 'strokeDash'] as const;
const LINE_ONLY_ENCODING_CHANNEL_SET = new Set<string>(LINE_ONLY_ENCODING_CHANNELS);

const LINE_OVERLAY_MARK_PROPS = [
  'color',
  'stroke',
  'strokeWidth',
  'strokeOpacity',
  'strokeDash',
  'strokeDashOffset',
] as const;

const LINE_OVERLAY_ENCODING_CHANNELS = ['color', 'stroke', 'strokeWidth', 'strokeOpacity', 'strokeDash'] as const;

const DEFAULT_DENSITY_FILL_OPACITY = 0.5;

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
  const densityConfig = (config as {density?: DensityConfig}).density;
  const densityMarkDef: DensityDef = {
    ...(densityConfig as Partial<DensityDef>),
    ...markDef,
  };

  if (params) {
    log.warn(log.message.selectionNotSupported('density'));
  }

  const {stack} = densityMarkDef;

  // Infer mark type: use area if fill or fillOpacity is set — either as a mark property
  // or as an encoding channel (e.g. fill: {field: 'Species', type: 'nominal'}).
  const useArea =
    densityMarkDef.fill !== undefined ||
    densityMarkDef.fillOpacity !== undefined ||
    spec.encoding.fill !== undefined ||
    spec.encoding.fillOpacity !== undefined;

  const {
    transform: densityTransforms,
    continuousAxisChannelDef,
    continuousAxis,
    encodingWithoutContinuousAxis,
    groupby,
    densityAs,
  } = densityParams(spec, densityMarkDef, config, useArea);

  const [densityValueField, densityEstimateField] = densityAs;

  const markOrient = continuousAxis === 'y' ? 'horizontal' : 'vertical';
  const densityAxis = continuousAxis === 'x' ? 'y' : 'x';

  // Use a line overlay on top of the area when stroke/color properties are also present.
  const useLineOverlay =
    useArea &&
    (LINE_OVERLAY_MARK_PROPS.some((prop) => densityMarkDef[prop] !== undefined) ||
      LINE_OVERLAY_ENCODING_CHANNELS.some((channel) => spec.encoding[channel] !== undefined));

  // Default fillOpacity of 0.5 when the user hasn't set it explicitly, so overlapping
  // densities remain visible.
  const defaultedFillOpacity =
    useArea && densityMarkDef.fillOpacity === undefined && spec.encoding.fillOpacity === undefined
      ? DEFAULT_DENSITY_FILL_OPACITY
      : undefined;

  // Build the shared positional encoding used by all layers.
  const continuousAxisEncoding = {
    field: densityValueField,
    type: continuousAxisChannelDef.type,
    title: getTitle(continuousAxisChannelDef),
    ...(continuousAxisChannelDef.scale !== undefined ? {scale: continuousAxisChannelDef.scale} : {}),
    ...(continuousAxisChannelDef.axis !== undefined ? {axis: continuousAxisChannelDef.axis} : {}),
  };

  // Area densities default to unstacked (`stack: null`) when stack is unspecified.
  const densityAxisEncoding = useArea
    ? {field: densityEstimateField, type: 'quantitative', stack: stack ?? null}
    : stack !== undefined
      ? {field: densityEstimateField, type: 'quantitative', stack}
      : {field: densityEstimateField, type: 'quantitative'};

  const lineDensityAxisEncoding =
    stack !== undefined
      ? {field: densityEstimateField, type: 'quantitative', stack}
      : {field: densityEstimateField, type: 'quantitative'};

  if (useLineOverlay) {
    // Split encodingWithoutContinuousAxis into fill-side and stroke-side.
    const areaEncoding: Record<string, unknown> = {};
    const lineEncoding: Record<string, unknown> = {};
    for (const [ch, def] of Object.entries(encodingWithoutContinuousAxis)) {
      if (AREA_ONLY_ENCODING_CHANNEL_SET.has(ch)) {
        areaEncoding[ch] = def;
      } else if (LINE_ONLY_ENCODING_CHANNEL_SET.has(ch)) {
        lineEncoding[ch] = def;
      } else {
        // Shared channels (e.g. tooltip, detail) go on both layers.
        areaEncoding[ch] = def;
        lineEncoding[ch] = def;
      }
    }

    ensureDetailForGroupby(areaEncoding, groupby);
    ensureDetailForGroupby(lineEncoding, groupby);

    // Area mark — forward fill/fillOpacity from markDef; suppress stroke properties.

    const areaMark: any = {type: 'area', orient: markOrient};
    for (const prop of AREA_SHARED_MARK_PROPS) {
      if (densityMarkDef[prop] !== undefined) areaMark[prop] = densityMarkDef[prop];
    }
    for (const prop of AREA_ONLY_PROPS) {
      if (densityMarkDef[prop] !== undefined) areaMark[prop] = densityMarkDef[prop];
    }
    if (defaultedFillOpacity !== undefined) areaMark.fillOpacity = defaultedFillOpacity;

    // Line mark — forward stroke/color properties from markDef.

    const lineMark: any = {type: 'line', orient: markOrient};
    for (const prop of SHARED_MARK_PROPS) {
      if (densityMarkDef[prop] !== undefined) lineMark[prop] = densityMarkDef[prop];
    }
    const layer = [
      {
        mark: areaMark,
        encoding: {
          [continuousAxis]: continuousAxisEncoding,
          [densityAxis]: densityAxisEncoding,
          ...areaEncoding,
        },
      },
      {
        mark: lineMark,
        encoding: {
          [continuousAxis]: continuousAxisEncoding,
          [densityAxis]: lineDensityAxisEncoding,
          ...lineEncoding,
        },
      },
    ];

    return normalize(
      {
        ...outerSpec,
        transform: densityTransforms,
        layer,
      },
      {config},
    ) as NormalizedLayerSpec;
  }

  // Single mark (area or line).

  const densityMark: any = {
    type: useArea ? 'area' : 'line',
    orient: markOrient,
  };

  for (const prop of SHARED_MARK_PROPS) {
    if (densityMarkDef[prop] !== undefined) {
      densityMark[prop] = densityMarkDef[prop];
    }
  }

  // Forward fill/fillOpacity only for area marks.
  if (useArea) {
    for (const prop of AREA_ONLY_PROPS) {
      if (densityMarkDef[prop] !== undefined) {
        densityMark[prop] = densityMarkDef[prop];
      }
    }
    if (defaultedFillOpacity !== undefined) {
      densityMark.fillOpacity = defaultedFillOpacity;
    }
  }

  const layer = [
    {
      mark: densityMark,
      encoding: {
        [continuousAxis]: continuousAxisEncoding,
        [densityAxis]: densityAxisEncoding,
        ...encodingWithoutContinuousAxis,
      },
    },
  ];

  return normalize(
    {
      ...outerSpec,
      transform: densityTransforms,
      layer,
    },
    {config},
  ) as NormalizedLayerSpec;
}

function densityParams(
  spec: GenericUnitSpec<Encoding<string>, Density | DensityDef>,
  markDef: DensityDef,
  config: Config,
  useArea: boolean,
): {
  transform: Transform[];
  continuousAxisChannelDef: PositionFieldDef<string>;
  continuousAxis: 'x' | 'y';
  encodingWithoutContinuousAxis: Encoding<string>;
  groupby: string[];
  densityAs: [string, string];
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
    'as',
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

  const resolvedStack = markDef.stack ?? null;
  const hasExplicitResolve = markDef.resolve !== undefined || densityConfig?.resolve !== undefined;
  const defaultResolveForStack =
    !hasExplicitResolve && groupby.length > 0 && resolvedStack === null ? 'independent' : undefined;

  const densityTransform: DensityTransform = {
    density: continuousAxisChannelDef.field,
    ...(groupby.length > 0 ? {groupby} : {}),
    ...transformOverrides,
    ...(defaultResolveForStack !== undefined ? {resolve: defaultResolveForStack} : {}),
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
    densityAs: densityTransform.as ?? ['value', 'density'],
  };
}

function channelHasField(channelDef: unknown, field: string): boolean {
  if (Array.isArray(channelDef)) {
    return channelDef.some((def) => channelHasField(def, field));
  }

  return !!(
    channelDef &&
    typeof channelDef === 'object' &&
    'field' in channelDef &&
    (channelDef as any).field === field
  );
}

function ensureDetailForGroupby(encoding: Record<string, unknown>, groupby: string[]) {
  if (groupby.length === 0) {
    return;
  }

  const missingFields = groupby.filter(
    (field) => !Object.values(encoding).some((channelDef) => channelHasField(channelDef, field)),
  );

  if (missingFields.length === 0) {
    return;
  }

  const missingDetails = missingFields.map((field) => ({field}));
  const existingDetail = encoding.detail;

  if (existingDetail === undefined) {
    encoding.detail = missingDetails.length === 1 ? missingDetails[0] : missingDetails;
  } else if (Array.isArray(existingDetail)) {
    encoding.detail = [...existingDetail, ...missingDetails];
  } else {
    encoding.detail = [existingDetail, ...missingDetails];
  }
}
