import {RangeScheme, SignalRef} from 'vega';
import {isArray, isNumber, isObject} from 'vega-util';
import {isBinning} from '../../bin.js';
import {
  ANGLE,
  COLOR,
  FILL,
  FILLOPACITY,
  getOffsetScaleChannel,
  getSizeChannel,
  isXorY,
  isXorYOffset,
  OPACITY,
  PositionScaleChannel,
  RADIUS,
  ScaleChannel,
  SCALE_CHANNELS,
  SHAPE,
  SIZE,
  STROKE,
  STROKEDASH,
  STROKEOPACITY,
  STROKEWIDTH,
  THETA,
  X,
  XOFFSET,
  Y,
  YOFFSET,
  TIME,
} from '../../channel.js';
import {
  getBandPosition,
  getFieldOrDatumDef,
  isFieldDef,
  isFieldOrDatumDef,
  ScaleDatumDef,
  ScaleFieldDef,
} from '../../channeldef.js';
import {Config, getViewConfigDiscreteSize, getViewConfigDiscreteStep, ViewConfig} from '../../config.js';
import {DataSourceType} from '../../data.js';
import {channelHasFieldOrDatum} from '../../encoding.js';
import * as log from '../../log/index.js';
import {Mark} from '../../mark.js';
import {
  channelScalePropertyIncompatability,
  Domain,
  hasContinuousDomain,
  hasDiscreteDomain,
  isContinuousToDiscrete,
  isExtendedScheme,
  Scale,
  ScaleType,
  scaleTypeSupportProperty,
  Scheme,
} from '../../scale.js';
import {getStepFor, isStep, LayoutSizeMixins, Step} from '../../spec/base.js';
import {isDiscrete} from '../../type.js';
import * as util from '../../util.js';
import {isSignalRef, VgRange} from '../../vega.schema.js';
import {exprFromSignalRefOrValue, signalOrStringValue} from '../common.js';
import {getBinSignalName} from '../data/bin.js';
import {SignalRefWrapper} from '../signal.js';
import {Explicit, makeExplicit, makeImplicit} from '../split.js';
import {UnitModel} from '../unit.js';
import {ScaleComponentIndex} from './component.js';
import {durationExpr} from '../../timeunit.js';
import {isFacetModel} from '../model.js';

export const RANGE_PROPERTIES: (keyof Scale)[] = ['range', 'scheme'];

export function parseUnitScaleRange(model: UnitModel) {
  const localScaleComponents: ScaleComponentIndex = model.component.scales;

  // use SCALE_CHANNELS instead of scales[channel] to ensure that x, y come first!
  for (const channel of SCALE_CHANNELS) {
    const localScaleCmpt = localScaleComponents[channel];
    if (!localScaleCmpt) {
      continue;
    }

    const rangeWithExplicit = parseRangeForChannel(channel, model);

    localScaleCmpt.setWithExplicit('range', rangeWithExplicit);
  }
}

function getBinStepSignal(model: UnitModel, channel: 'x' | 'y'): SignalRefWrapper {
  const fieldDef = model.fieldDef(channel);

  if (fieldDef?.bin) {
    const {bin, field} = fieldDef;
    const sizeType = getSizeChannel(channel);
    const sizeSignal = model.getName(sizeType);

    if (isObject(bin) && bin.binned && bin.step !== undefined) {
      return new SignalRefWrapper(() => {
        const scaleName = model.scaleName(channel);
        const binCount = `(domain("${scaleName}")[1] - domain("${scaleName}")[0]) / ${bin.step}`;
        return `${model.getSignalName(sizeSignal)} / (${binCount})`;
      });
    } else if (isBinning(bin)) {
      const binSignal = getBinSignalName(model, field, bin);

      // TODO: extract this to be range step signal
      return new SignalRefWrapper(() => {
        const updatedName = model.getSignalName(binSignal);
        const binCount = `(${updatedName}.stop - ${updatedName}.start) / ${updatedName}.step`;
        return `${model.getSignalName(sizeSignal)} / (${binCount})`;
      });
    }
  }
  return undefined;
}

/**
 * Return mixins that includes one of the Vega range types (explicit range, range.step, range.scheme).
 */
export function parseRangeForChannel(channel: ScaleChannel, model: UnitModel): Explicit<VgRange> {
  const specifiedScale = model.specifiedScales[channel];
  const {size} = model;

  const mergedScaleCmpt = model.getScaleComponent(channel);
  const scaleType = mergedScaleCmpt.get('type');

  // Check if any of the range properties is specified.
  // If so, check if it is compatible and make sure that we only output one of the properties
  for (const property of RANGE_PROPERTIES) {
    if (specifiedScale[property] !== undefined) {
      const supportedByScaleType = scaleTypeSupportProperty(scaleType, property);
      const channelIncompatability = channelScalePropertyIncompatability(channel, property);
      if (!supportedByScaleType) {
        log.warn(log.message.scalePropertyNotWorkWithScaleType(scaleType, property, channel));
      } else if (channelIncompatability) {
        // channel
        log.warn(channelIncompatability);
      } else {
        switch (property) {
          case 'range': {
            const range = specifiedScale.range;
            if (isArray(range)) {
              if (isXorY(channel)) {
                return makeExplicit(
                  range.map((v) => {
                    if (v === 'width' || v === 'height') {
                      // get signal for width/height

                      // Just like default range logic below, we use SignalRefWrapper to account for potential merges and renames.

                      const sizeSignal = model.getName(v);
                      const getSignalName = model.getSignalName.bind(model);
                      return SignalRefWrapper.fromName(getSignalName, sizeSignal);
                    }
                    return v;
                  }),
                );
              }
            } else if (isObject(range)) {
              return makeExplicit({
                data: model.requestDataName(DataSourceType.Main),
                field: range.field,
                sort: {op: 'min', field: model.vgField(channel)},
              });
            }

            return makeExplicit(range);
          }
          case 'scheme':
            return makeExplicit(parseScheme(specifiedScale[property]));
        }
      }
    }
  }

  const sizeChannel = channel === X || channel === 'xOffset' ? 'width' : 'height';
  const sizeValue = size[sizeChannel];
  if (isStep(sizeValue)) {
    if (isXorY(channel)) {
      if (hasDiscreteDomain(scaleType)) {
        const step = getPositionStep(sizeValue, model, channel);
        // Need to be explicit so layer with step wins over layer without step
        if (step) {
          return makeExplicit({step});
        }
      } else {
        log.warn(log.message.stepDropped(sizeChannel));
      }
    } else if (isXorYOffset(channel)) {
      const positionChannel = channel === XOFFSET ? 'x' : 'y';
      const positionScaleCmpt = model.getScaleComponent(positionChannel);
      const positionScaleType = positionScaleCmpt.get('type');
      if (positionScaleType === 'band') {
        const step = getOffsetStep(sizeValue, scaleType);
        if (step) {
          return makeExplicit(step);
        }
      }
    }
  }

  const {rangeMin, rangeMax} = specifiedScale;
  const d = defaultRange(channel, model);

  if (
    (rangeMin !== undefined || rangeMax !== undefined) &&
    // it's ok to check just rangeMin's compatibility since rangeMin/rangeMax are the same
    scaleTypeSupportProperty(scaleType, 'rangeMin') &&
    isArray(d) &&
    d.length === 2
  ) {
    return makeExplicit([rangeMin ?? d[0], rangeMax ?? d[1]]);
  }

  return makeImplicit(d);
}

function parseScheme(scheme: Scheme | SignalRef): RangeScheme {
  if (isExtendedScheme(scheme)) {
    return {
      scheme: scheme.name,
      ...util.omit(scheme, ['name']),
    };
  }
  return {scheme};
}

function fullWidthOrHeightRange(
  channel: 'x' | 'y',
  model: UnitModel,
  scaleType: ScaleType,
  {center}: {center?: boolean} = {},
) {
  // If step is null, use zero to width or height.
  // Note that we use SignalRefWrapper to account for potential merges and renames.
  const sizeType = getSizeChannel(channel);
  const sizeSignal = model.getName(sizeType);
  const getSignalName = model.getSignalName.bind(model);

  if (channel === Y && hasContinuousDomain(scaleType)) {
    // For y continuous scale, we have to start from the height as the bottom part has the max value.
    return center
      ? [
          SignalRefWrapper.fromName((name) => `${getSignalName(name)}/2`, sizeSignal),
          SignalRefWrapper.fromName((name) => `-${getSignalName(name)}/2`, sizeSignal),
        ]
      : [SignalRefWrapper.fromName(getSignalName, sizeSignal), 0];
  } else {
    return center
      ? [
          SignalRefWrapper.fromName((name) => `-${getSignalName(name)}/2`, sizeSignal),
          SignalRefWrapper.fromName((name) => `${getSignalName(name)}/2`, sizeSignal),
        ]
      : [0, SignalRefWrapper.fromName(getSignalName, sizeSignal)];
  }
}

function defaultRange(channel: ScaleChannel, model: UnitModel): VgRange {
  const {size, config, mark, encoding} = model;

  const {type} = getFieldOrDatumDef(encoding[channel]) as ScaleFieldDef<string> | ScaleDatumDef;

  const mergedScaleCmpt = model.getScaleComponent(channel);
  const scaleType = mergedScaleCmpt.get('type');

  const {domain, domainMid} = model.specifiedScales[channel];

  switch (channel) {
    case X:
    case Y: {
      // If there is no explicit width/height for discrete x/y scales
      if (util.contains(['point', 'band'], scaleType)) {
        const positionSize = getDiscretePositionSize(channel, size, config.view);
        if (isStep(positionSize)) {
          const step = getPositionStep(positionSize, model, channel);
          return {step};
        }
      }

      return fullWidthOrHeightRange(channel, model, scaleType);
    }

    case XOFFSET:
    case YOFFSET:
      return getOffsetRange(channel, model, scaleType);

    case SIZE: {
      // TODO: support custom rangeMin, rangeMax
      const rangeMin = sizeRangeMin(mark, config);
      const rangeMax = sizeRangeMax(mark, size, model, config);
      if (isContinuousToDiscrete(scaleType)) {
        return interpolateRange(
          rangeMin,
          rangeMax,
          defaultContinuousToDiscreteCount(scaleType, config, domain, channel),
        );
      } else {
        return [rangeMin, rangeMax];
      }
    }

    case THETA:
      return [0, Math.PI * 2];

    case ANGLE:
      // TODO: add config.scale.min/maxAngleDegree (for point and text) and config.scale.min/maxAngleRadian (for arc) once we add arc marks.
      // (It's weird to add just config.scale.min/maxAngleDegree for now)
      return [0, 360];

    case RADIUS: {
      // max radius = half od min(width,height)

      return [
        0,
        new SignalRefWrapper(() => {
          const w = model.getSignalName(isFacetModel(model.parent) ? 'child_width' : 'width');
          const h = model.getSignalName(isFacetModel(model.parent) ? 'child_height' : 'height');
          return `min(${w},${h})/2`;
        }),
      ];
    }

    case TIME: {
      // if (scaleType === 'band') {
      return {step: 1000 / config.scale.framesPerSecond};
      // }
      // return [0, config.scale.animationDuration * 1000]; // TODO(jzong): uncomment for linear scales when interpolation is implemented
    }

    case STROKEWIDTH:
      // TODO: support custom rangeMin, rangeMax
      return [config.scale.minStrokeWidth, config.scale.maxStrokeWidth];
    case STROKEDASH:
      return [
        // TODO: add this to Vega's config.range?
        [1, 0],
        [4, 2],
        [2, 1],
        [1, 1],
        [1, 2, 4, 2],
      ];
    case SHAPE:
      return 'symbol';
    case COLOR:
    case FILL:
    case STROKE:
      if (scaleType === 'ordinal') {
        // Only nominal data uses ordinal scale by default
        return type === 'nominal' ? 'category' : 'ordinal';
      } else {
        if (domainMid !== undefined) {
          return 'diverging';
        } else {
          return mark === 'rect' || mark === 'geoshape' ? 'heatmap' : 'ramp';
        }
      }
    case OPACITY:
    case FILLOPACITY:
    case STROKEOPACITY:
      // TODO: support custom rangeMin, rangeMax
      return [config.scale.minOpacity, config.scale.maxOpacity];
  }
}

function getPositionStep(step: Step, model: UnitModel, channel: PositionScaleChannel): number | SignalRef {
  const {encoding} = model;

  const mergedScaleCmpt = model.getScaleComponent(channel);
  const offsetChannel = getOffsetScaleChannel(channel);
  const offsetDef = encoding[offsetChannel];
  const stepFor = getStepFor({step, offsetIsDiscrete: isFieldOrDatumDef(offsetDef) && isDiscrete(offsetDef.type)});

  if (stepFor === 'offset' && channelHasFieldOrDatum(encoding, offsetChannel)) {
    const offsetScaleCmpt = model.getScaleComponent(offsetChannel);
    const offsetScaleName = model.scaleName(offsetChannel);

    let stepCount = `domain('${offsetScaleName}').length`;

    if (offsetScaleCmpt.get('type') === 'band') {
      const offsetPaddingInner = offsetScaleCmpt.get('paddingInner') ?? offsetScaleCmpt.get('padding') ?? 0;
      const offsetPaddingOuter = offsetScaleCmpt.get('paddingOuter') ?? offsetScaleCmpt.get('padding') ?? 0;
      stepCount = `bandspace(${stepCount}, ${offsetPaddingInner}, ${offsetPaddingOuter})`;
    }

    const paddingInner = mergedScaleCmpt.get('paddingInner') ?? mergedScaleCmpt.get('padding');
    return {
      signal: `${step.step} * ${stepCount} / (1-${exprFromSignalRefOrValue(paddingInner)})`,
    };
  } else {
    return step.step;
  }
}

function getOffsetStep(step: Step, offsetScaleType: ScaleType) {
  const stepFor = getStepFor({step, offsetIsDiscrete: hasDiscreteDomain(offsetScaleType)});
  if (stepFor === 'offset') {
    return {step: step.step};
  }
  return undefined;
}

function getOffsetRange(channel: string, model: UnitModel, offsetScaleType: ScaleType): VgRange {
  const positionChannel = channel === XOFFSET ? 'x' : 'y';
  const positionScaleCmpt = model.getScaleComponent(positionChannel);

  if (!positionScaleCmpt) {
    return fullWidthOrHeightRange(positionChannel, model, offsetScaleType, {center: true});
  }

  const positionScaleType = positionScaleCmpt.get('type');
  const positionScaleName = model.scaleName(positionChannel);

  const {markDef, config} = model;

  if (positionScaleType === 'band') {
    const size = getDiscretePositionSize(positionChannel, model.size, model.config.view);

    if (isStep(size)) {
      // step is for offset
      const step = getOffsetStep(size, offsetScaleType);
      if (step) {
        return step;
      }
    }
    // otherwise use the position
    return [0, {signal: `bandwidth('${positionScaleName}')`}];
  } else {
    // continuous scale
    const positionDef = model.encoding[positionChannel];
    if (isFieldDef(positionDef) && positionDef.timeUnit) {
      const duration = durationExpr(positionDef.timeUnit, (expr) => `scale('${positionScaleName}', ${expr})`);
      const padding = model.config.scale.bandWithNestedOffsetPaddingInner;
      const bandPositionOffset =
        getBandPosition({
          fieldDef: positionDef,
          markDef,
          config,
        }) - 0.5;
      const bandPositionOffsetExpr = bandPositionOffset !== 0 ? ` + ${bandPositionOffset}` : '';
      if (padding) {
        const startRatio = isSignalRef(padding)
          ? `${padding.signal}/2${bandPositionOffsetExpr}`
          : `${padding / 2 + bandPositionOffset}`;
        const endRatio = isSignalRef(padding)
          ? `(1 - ${padding.signal}/2)${bandPositionOffsetExpr}`
          : `${1 - padding / 2 + bandPositionOffset}`;
        return [{signal: `${startRatio} * (${duration})`}, {signal: `${endRatio} * (${duration})`}];
      }
      return [0, {signal: duration}];
    }
    return util.never(`Cannot use ${channel} scale if ${positionChannel} scale is not discrete.`);
  }
}

function getDiscretePositionSize(
  channel: 'x' | 'y',
  size: LayoutSizeMixins,
  viewConfig: ViewConfig<SignalRef>,
): Step | number | 'container' {
  const sizeChannel = channel === X ? 'width' : 'height';
  const sizeValue = size[sizeChannel];
  if (sizeValue !== undefined) {
    return sizeValue;
  }
  return getViewConfigDiscreteSize(viewConfig, sizeChannel);
}

export function defaultContinuousToDiscreteCount(
  scaleType: 'quantile' | 'quantize' | 'threshold',
  config: Config,
  domain: Domain,
  channel: ScaleChannel,
) {
  switch (scaleType) {
    case 'quantile':
      return config.scale.quantileCount;
    case 'quantize':
      return config.scale.quantizeCount;
    case 'threshold':
      if (domain !== undefined && isArray(domain)) {
        return domain.length + 1;
      } else {
        log.warn(log.message.domainRequiredForThresholdScale(channel));
        // default threshold boundaries for threshold scale since domain has cardinality of 2
        return 3;
      }
  }
}

/**
 * Returns the linear interpolation of the range according to the cardinality
 *
 * @param rangeMin start of the range
 * @param rangeMax end of the range
 * @param cardinality number of values in the output range
 */
export function interpolateRange(
  rangeMin: number | SignalRef,
  rangeMax: number | SignalRef,
  cardinality: number,
): SignalRef {
  // always return a signal since it's better to compute the sequence in Vega later
  const f = () => {
    const rMax = signalOrStringValue(rangeMax);
    const rMin = signalOrStringValue(rangeMin);
    const step = `(${rMax} - ${rMin}) / (${cardinality} - 1)`;
    return `sequence(${rMin}, ${rMax} + ${step}, ${step})`;
  };
  if (isSignalRef(rangeMax)) {
    return new SignalRefWrapper(f);
  } else {
    return {signal: f()};
  }
}

function sizeRangeMin(mark: Mark, config: Config): number | SignalRef {
  switch (mark) {
    case 'bar':
    case 'tick':
      return config.scale.minBandSize;
    case 'line':
    case 'trail':
    case 'rule':
      return config.scale.minStrokeWidth;
    case 'text':
      return config.scale.minFontSize;
    case 'point':
    case 'square':
    case 'circle':
      return config.scale.minSize;
  }
  /* istanbul ignore next: should never reach here */
  // sizeRangeMin not implemented for the mark
  throw new Error(log.message.incompatibleChannel('size', mark));
}

export const MAX_SIZE_RANGE_STEP_RATIO = 0.95;

function sizeRangeMax(
  mark: Mark,
  size: LayoutSizeMixins,
  model: UnitModel,
  config: Config<SignalRef>,
): number | SignalRef {
  const xyStepSignals = {
    x: getBinStepSignal(model, 'x'),
    y: getBinStepSignal(model, 'y'),
  };

  switch (mark) {
    case 'bar':
    case 'tick': {
      if (config.scale.maxBandSize !== undefined) {
        return config.scale.maxBandSize;
      }
      const min = minXYStep(size, xyStepSignals, config.view);

      if (isNumber(min)) {
        return min - 1;
      } else {
        return new SignalRefWrapper(() => `${min.signal} - 1`);
      }
    }
    case 'line':
    case 'trail':
    case 'rule':
      return config.scale.maxStrokeWidth;
    case 'text':
      return config.scale.maxFontSize;
    case 'point':
    case 'square':
    case 'circle': {
      if (config.scale.maxSize) {
        return config.scale.maxSize;
      }

      const pointStep = minXYStep(size, xyStepSignals, config.view);
      if (isNumber(pointStep)) {
        return Math.pow(MAX_SIZE_RANGE_STEP_RATIO * pointStep, 2);
      } else {
        return new SignalRefWrapper(() => `pow(${MAX_SIZE_RANGE_STEP_RATIO} * ${pointStep.signal}, 2)`);
      }
    }
  }
  /* istanbul ignore next: should never reach here */
  // sizeRangeMax not implemented for the mark
  throw new Error(log.message.incompatibleChannel('size', mark));
}

/**
 * @returns {number} Range step of x or y or minimum between the two if both are ordinal scale.
 */
function minXYStep(
  size: LayoutSizeMixins,
  xyStepSignals: {x?: SignalRefWrapper; y?: SignalRefWrapper},
  viewConfig: ViewConfig<SignalRef>,
): number | SignalRef {
  const widthStep = isStep(size.width) ? size.width.step : getViewConfigDiscreteStep(viewConfig, 'width');
  const heightStep = isStep(size.height) ? size.height.step : getViewConfigDiscreteStep(viewConfig, 'height');

  if (xyStepSignals.x || xyStepSignals.y) {
    return new SignalRefWrapper(() => {
      const exprs = [
        xyStepSignals.x ? xyStepSignals.x.signal : widthStep,
        xyStepSignals.y ? xyStepSignals.y.signal : heightStep,
      ];
      return `min(${exprs.join(', ')})`;
    });
  }

  return Math.min(widthStep, heightStep);
}
