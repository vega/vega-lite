import {Interpolate, Orientation} from 'vega';
import {isContinuousFieldOrDatumDef, isFieldDef, PositionFieldDef} from '../channeldef.js';
import {Config} from '../config.js';
import {Encoding, extractTransformsFromEncoding, normalizeEncoding} from '../encoding.js';
import * as log from '../log/index.js';
import {isMarkDef} from '../mark.js';
import {NormalizerParams} from '../normalize/index.js';
import {GenericUnitSpec, NormalizedLayerSpec} from '../spec/index.js';
import {Transform} from '../transform.js';
import {hasProperty} from '../util.js';
import {CompositeMarkNormalizer} from './base.js';
import {compositeMarkOrient, GenericCompositeMarkDef, PartsMixins} from './common.js';

export const DENSITY = 'density' as const;
export type Density = typeof DENSITY;

export const DENSITY_PARTS = ['density'] as const;
type DensityPart = (typeof DENSITY_PARTS)[number];
export type DensityPartsMixins = PartsMixins<DensityPart>;

export interface DensityConfig extends DensityPartsMixins {
  bandwidth?: number;
  cumulative?: boolean;
  counts?: boolean;
  extent?: [number, number];
  minsteps?: number;
  maxsteps?: number;
  steps?: number;
  interpolate?: Interpolate;
  tension?: number;
}

export type DensityDef = GenericCompositeMarkDef<Density> &
  DensityConfig & {
    orient?: Orientation;
    line?: boolean;
    point?: boolean | Record<string, unknown> | 'transparent';
    stroke?: string | null;
    strokeWidth?: number;
    strokeOpacity?: number;
    strokeDash?: number[];
    strokeDashOffset?: number;
    fill?: string | null;
    fillOpacity?: number;
  };

export interface DensityConfigMixins {
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

  const {orient, line, point} = markDef;
  const markOrient = continuousAxis === 'y' ? 'horizontal' : 'vertical';
  const useLine = line ?? false;

  // Build mark type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const densityMark: any = {
    type: useLine ? 'line' : 'area',
    orient: orient ?? markOrient,
  };

  // Pass through shared mark properties
  for (const prop of SHARED_MARK_PROPS) {
    if (markDef[prop] !== undefined) {
      densityMark[prop] = markDef[prop];
    }
  }

  // Pass through area-only properties
  if (!useLine) {
    for (const prop of AREA_ONLY_PROPS) {
      if (markDef[prop] !== undefined) {
        densityMark[prop] = markDef[prop];
      }
    }
  }

  // Pass through point overlay
  if (point !== undefined) {
    densityMark.point = point;
  }

  // Preserve the original field's title if it was specified
  const valueFieldTitle = hasProperty(continuousAxisChannelDef, 'title')
    ? continuousAxisChannelDef.title
    : continuousAxisChannelDef.field;

  const layer = [
    {
      mark: densityMark,
      encoding: {
        [continuousAxis]: {
          field: 'value',
          type: continuousAxisChannelDef.type,
          title: valueFieldTitle,
          ...(hasProperty(continuousAxisChannelDef, 'scale') ? {scale: continuousAxisChannelDef.scale} : {}),
          ...(hasProperty(continuousAxisChannelDef, 'axis') ? {axis: continuousAxisChannelDef.axis} : {}),
        },
        [continuousAxis === 'x' ? 'y' : 'x']: {
          field: 'density',
          type: 'quantitative',
          ...(useLine ? {} : {stack: null}),
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
  const densityConfig = (config as {density?: DensityConfig}).density;

  // Build density transform with precedence: markDef > config
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const densityTransform: any = {
    density: continuousAxisChannelDef.field,
    groupby: groupbyFields.length > 0 ? groupbyFields : undefined,
  };

  const transformProps = ['bandwidth', 'extent', 'minsteps', 'maxsteps', 'steps', 'cumulative', 'counts'] as const;
  for (const prop of transformProps) {
    const value = markDef[prop] ?? densityConfig?.[prop];
    if (value !== undefined) {
      densityTransform[prop] = value;
    }
  }

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

  return {continuousAxisChannelDef, continuousAxis};
}
