import {SignalRef} from 'vega';
import {isArray, isNumber} from 'vega-util';
import {isBinning} from '../../bin';
import {
  Channel,
  COLOR,
  FILL,
  FILLOPACITY,
  OPACITY,
  POSITION_SCALE_CHANNELS,
  ScaleChannel,
  SCALE_CHANNELS,
  SHAPE,
  SIZE,
  STROKE,
  STROKEOPACITY,
  STROKEWIDTH,
  X,
  Y
} from '../../channel';
import {Config} from '../../config';
import * as log from '../../log';
import {Mark} from '../../mark';
import {
  channelScalePropertyIncompatability,
  Domain,
  hasContinuousDomain,
  hasDiscreteDomain,
  isContinuousToDiscrete,
  isExtendedScheme,
  Scale,
  ScaleConfig,
  ScaleType,
  scaleTypeSupportProperty,
  Scheme
} from '../../scale';
import {Type} from '../../type';
import * as util from '../../util';
import {isSignalRef, isVgRangeStep, SchemeConfig, VgRange} from '../../vega.schema';
import {getBinSignalName} from '../data/bin';
import {Rename, SignalRefWrapper} from '../signal';
import {Explicit, makeExplicit, makeImplicit} from '../split';
import {UnitModel} from '../unit';
import {ScaleComponentIndex} from './component';

export const RANGE_PROPERTIES: (keyof Scale)[] = ['range', 'rangeStep', 'scheme'];

function getSizeType(channel: ScaleChannel) {
  return channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
}

export function parseUnitScaleRange(model: UnitModel) {
  const localScaleComponents: ScaleComponentIndex = model.component.scales;

  // use SCALE_CHANNELS instead of scales[channel] to ensure that x, y come first!
  SCALE_CHANNELS.forEach((channel: ScaleChannel) => {
    const localScaleCmpt = localScaleComponents[channel];
    if (!localScaleCmpt) {
      return;
    }
    const mergedScaleCmpt = model.getScaleComponent(channel);

    const specifiedScale = model.specifiedScales[channel];
    const fieldDef = model.fieldDef(channel);

    // Read if there is a specified width/height
    const sizeType = getSizeType(channel);
    let sizeSpecified = sizeType ? !!model.component.layoutSize.get(sizeType) : undefined;

    const scaleType = mergedScaleCmpt.get('type');

    // if autosize is fit, size cannot be data driven
    const rangeStep = util.contains(['point', 'band'], scaleType) || !!specifiedScale.rangeStep;
    if (sizeType && model.fit && !sizeSpecified && rangeStep) {
      log.warn(log.message.CANNOT_FIX_RANGE_STEP_WITH_FIT);
      sizeSpecified = true;
    }

    const xyRangeSteps = getXYRangeStep(model);

    const rangeWithExplicit = parseRangeForChannel(
      channel,
      model.getSignalName.bind(model),
      scaleType,
      fieldDef.type,
      specifiedScale,
      model.config,
      localScaleCmpt.get('zero'),
      model.mark,
      sizeSpecified,
      model.getName(sizeType),
      xyRangeSteps
    );

    localScaleCmpt.setWithExplicit('range', rangeWithExplicit);
  });
}

function getRangeStep(model: UnitModel, channel: 'x' | 'y'): number | SignalRef {
  const scaleCmpt = model.getScaleComponent(channel);
  if (!scaleCmpt) {
    return undefined;
  }

  const scaleType = scaleCmpt.get('type');
  const fieldDef = model.fieldDef(channel);

  if (hasDiscreteDomain(scaleType)) {
    const range = scaleCmpt && scaleCmpt.get('range');
    if (range && isVgRangeStep(range) && isNumber(range.step)) {
      return range.step;
      // TODO: support the case without range step
    }
  } else if (fieldDef && fieldDef.bin && isBinning(fieldDef.bin)) {
    const binSignal = getBinSignalName(model, fieldDef.field, fieldDef.bin);

    // TODO: extract this to be range step signal
    const sizeType = getSizeType(channel);
    const sizeSignal = model.getName(sizeType);
    return new SignalRefWrapper(() => {
      const updatedName = model.getSignalName(binSignal);
      const binCount = `(${updatedName}.stop - ${updatedName}.start) / ${updatedName}.step`;
      return `${model.getSignalName(sizeSignal)} / (${binCount})`;
    });
  }
  return undefined;
}

function getXYRangeStep(model: UnitModel) {
  const steps: (number | SignalRef)[] = [];
  for (const channel of POSITION_SCALE_CHANNELS) {
    const step = getRangeStep(model, channel);
    if (step !== undefined) {
      steps.push(step);
    }
  }
  return steps;
}

/**
 * Return mixins that includes one of the range properties (range, rangeStep, scheme).
 */
export function parseRangeForChannel(
  channel: Channel,
  getSignalName: Rename,
  scaleType: ScaleType,
  type: Type,
  specifiedScale: Scale,
  config: Config,
  zero: boolean,
  mark: Mark,
  sizeSpecified: boolean,
  sizeSignal: string,
  xyRangeSteps: (number | SignalRef)[]
): Explicit<VgRange> {
  const noRangeStep = sizeSpecified || specifiedScale.rangeStep === null;

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
          case 'range':
            return makeExplicit(specifiedScale[property]);
          case 'scheme':
            return makeExplicit(parseScheme(specifiedScale[property]));
          case 'rangeStep': {
            const rangeStep = specifiedScale[property];
            if (rangeStep !== null) {
              if (!sizeSpecified) {
                return makeExplicit({step: rangeStep});
              } else {
                // If top-level size is specified, we ignore specified rangeStep.
                log.warn(log.message.rangeStepDropped(channel));
              }
            }
          }
        }
      }
    }
  }
  return makeImplicit(
    defaultRange(
      channel,
      getSignalName,
      scaleType,
      type,
      config,
      zero,
      mark,
      sizeSignal,
      xyRangeSteps,
      noRangeStep,
      specifiedScale.domain
    )
  );
}

function parseScheme(scheme: Scheme): SchemeConfig {
  if (isExtendedScheme(scheme)) {
    return {
      scheme: scheme.name,
      ...util.omit(scheme, ['name'])
    };
  }
  return {scheme: scheme};
}

function defaultRange(
  channel: Channel,
  getSignalName: Rename,
  scaleType: ScaleType,
  type: Type,
  config: Config,
  zero: boolean,
  mark: Mark,
  sizeSignal: string,
  xyRangeSteps: (number | SignalRef)[],
  noRangeStep: boolean,
  domain: Domain
): VgRange {
  switch (channel) {
    case X:
    case Y:
      if (util.contains(['point', 'band'], scaleType) && !noRangeStep) {
        if (channel === X && mark === 'text') {
          if (config.scale.textXRangeStep) {
            return {step: config.scale.textXRangeStep};
          }
        } else {
          if (config.scale.rangeStep) {
            return {step: config.scale.rangeStep};
          }
        }
      }

      // If range step is null, use zero to width or height.
      // Note that these range signals are temporary
      // as they can be merged and renamed.
      // (We do not have the right size signal here since parseLayoutSize() happens after parseScale().)
      // We will later replace these temporary names with
      // the final name in assembleScaleRange()

      if (channel === Y && hasContinuousDomain(scaleType)) {
        // For y continuous scale, we have to start from the height as the bottom part has the max value.
        return [SignalRefWrapper.fromName(getSignalName, sizeSignal), 0];
      } else {
        return [0, SignalRefWrapper.fromName(getSignalName, sizeSignal)];
      }
    case SIZE: {
      // TODO: support custom rangeMin, rangeMax
      const rangeMin = sizeRangeMin(mark, zero, config);
      const rangeMax = sizeRangeMax(mark, xyRangeSteps, config);
      if (isContinuousToDiscrete(scaleType)) {
        return interpolateRange(
          rangeMin,
          rangeMax,
          defaultContinuousToDiscreteCount(scaleType, config, domain, channel)
        );
      } else {
        return [rangeMin, rangeMax];
      }
    }
    case STROKEWIDTH:
      // TODO: support custom rangeMin, rangeMax
      return [config.scale.minStrokeWidth, config.scale.maxStrokeWidth];
    case SHAPE:
      return 'symbol';
    case COLOR:
    case FILL:
    case STROKE:
      if (scaleType === 'ordinal') {
        // Only nominal data uses ordinal scale by default
        return type === 'nominal' ? 'category' : 'ordinal';
      } else {
        return mark === 'rect' || mark === 'geoshape' ? 'heatmap' : 'ramp';
      }
    case OPACITY:
    case FILLOPACITY:
    case STROKEOPACITY:
      // TODO: support custom rangeMin, rangeMax
      return [config.scale.minOpacity, config.scale.maxOpacity];
  }
  /* istanbul ignore next: should never reach here */
  throw new Error(`Scale range undefined for channel ${channel}`);
}

export function defaultContinuousToDiscreteCount(
  scaleType: 'quantile' | 'quantize' | 'threshold',
  config: Config,
  domain: Domain,
  channel: Channel
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
export function interpolateRange(rangeMin: number, rangeMax: number | SignalRef, cardinality: number): SignalRef {
  // always return a signal since it's better to compute the sequence in Vega later
  const f = () => {
    const rMax = isSignalRef(rangeMax) ? rangeMax.signal : rangeMax;
    const step = `(${rMax} - ${rangeMin}) / (${cardinality} - 1)`;
    return `sequence(${rangeMin}, ${rangeMax} + ${step}, ${step})`;
  };
  if (isSignalRef(rangeMax)) {
    return new SignalRefWrapper(f);
  } else {
    return {signal: f()};
  }
}

function sizeRangeMin(mark: Mark, zero: boolean, config: Config) {
  if (zero) {
    return 0;
  }
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

function sizeRangeMax(mark: Mark, xyRangeSteps: (number | SignalRef)[], config: Config): number | SignalRef {
  const scaleConfig = config.scale;
  switch (mark) {
    case 'bar':
    case 'tick': {
      if (config.scale.maxBandSize !== undefined) {
        return config.scale.maxBandSize;
      }
      const min = minXYRangeStep(xyRangeSteps, config.scale);

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

      const pointStep = minXYRangeStep(xyRangeSteps, scaleConfig);
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
function minXYRangeStep(xyRangeSteps: (number | SignalRef)[], scaleConfig: ScaleConfig): number | SignalRef {
  if (xyRangeSteps.length > 0) {
    let min = Infinity;

    for (const step of xyRangeSteps) {
      if (isSignalRef(step)) {
        min = undefined;
      } else {
        if (min !== undefined && step < min) {
          min = step;
        }
      }
    }

    return min !== undefined
      ? min
      : new SignalRefWrapper(() => {
          const exprs = xyRangeSteps.map(e => (isSignalRef(e) ? e.signal : e));
          return `min(${exprs.join(', ')})`;
        });
  }
  if (scaleConfig.rangeStep) {
    return scaleConfig.rangeStep;
  }
  return 21; // FIXME: re-evaluate the default value here.
}
