import * as log from '../../log';

import {COLUMN, ROW, X, Y, SHAPE, SIZE, COLOR, OPACITY, Channel} from '../../channel';
import {Config} from '../../config';
import {Mark, MarkConfig, PointConfig} from '../../mark';
import {Scale, ScaleConfig, ScaleType} from '../../scale';
import * as util from '../../util';

import {Model} from '../model';
import {UnitModel} from '../unit';

export function rangeStep(rangeStep: number | null, topLevelSize: number | undefined, mark: Mark | undefined,
    channel: Channel, scaleConfig: ScaleConfig): number {
  if (topLevelSize === undefined) {

    // If rangeStep is null, we really want to make rangeStep fit width/height.  (If undefined, use default value.)
    if (rangeStep === null) {
      return undefined; // no rangeStep
    } else if (rangeStep !== undefined) {
      // Use manually specified rangeStep
      return rangeStep;
    } else if (util.contains([X, Y], channel)) {
      // only use config by default for X and Y
      if (channel === X && mark === 'text') {
        return scaleConfig.textXRangeStep;
      } else if (scaleConfig.rangeStep) {
        return scaleConfig.rangeStep;
      }
    }
  }

  // If top-level is specified, use rangeStep fit
  if (rangeStep && rangeStep !== null) {
    // If top-level size is specified, we drop specified rangeStep.
    log.warn(log.message.rangeStepDropped(channel));
  }
  return undefined;
}

/**
 * @returns {*} mix-in of rangeStep, range, scheme.
 */
export default function rangeMixins(scale: Scale, model: Model, channel: Channel):
  {range: string | Array<number|string|{data: string, field:string}>} | {rangeStep: number} | {scheme: string} {

  const config = model.config();

  // TODO: need to add rule for quantile, quantize, threshold scale

  const fieldDef = model.fieldDef(channel);

  if (scale.rangeStep) {
    /* istanbul ignore else: should never reach there */
    if (scale.type === ScaleType.BAND || scale.type === ScaleType.POINT) {
      return {rangeStep: scale.rangeStep};
    } else {
      delete scale.rangeStep;
      log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, 'rangeStep', channel));
    }
  }

  if (scale.scheme) {
    if (scale.type === 'ordinal' || scale.type === 'sequential') {
      return {scheme: scale.scheme};
    } else {
      log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, 'scheme', channel));
    }
  }

  if (scale.range) {
    if (!util.contains([X, Y, ROW, COLUMN], channel)) {
      // explicit range value
      return {range: scale.range};
    } else {
      // Do not allow explicit values for X, Y, ROW, COLUMN)
      log.warn(log.message.customScaleRangeNotAllowed(channel));
    }
  }

  switch (channel) {
    case ROW:
      return {range: 'height'};
    case COLUMN:
      return {range: 'width'};
  }

  // If not ROW / COLUMN, we can assume that this is a unit spec.
  const unitModel = model as UnitModel;
  const topLevelSize = channel === X ? unitModel.width : unitModel.height;
  const mark = unitModel.mark();

  switch (channel) {
    case X:
      // FIXME revise if this is still true in Vega 3
      // FIXME: what if size is not specified
      // we can't use {range: "width"} here since we put scale in the root group
      // not inside the cell, so scale is reusable for axes group

      return {range: [0, topLevelSize]};
    case Y:
      // FIXME revise if this is still true in Vega 3
      // FIXME: what if size is not specified
      return {range: [topLevelSize, 0]};
    case SIZE:
      // TODO: support custom rangeMin, rangeMax
      const rangeMin = sizeRangeMin(mark, scale.zero, config);
      const rangeMax = sizeRangeMax(mark, model, config);
      return {range: [rangeMin, rangeMax]};
    case SHAPE:
      return {range: config.point.shapes};
    case COLOR:
      if (fieldDef.type === 'nominal') {
        return {scheme: config.mark.nominalColorScheme};
      }
      // TODO(#1737): support sequentialColorRange (with linear scale) if sequentialColorScheme is not specified.
      // TODO: support custom rangeMin, rangeMax
      // else -- ordinal, time, or quantitative
      return {scheme: config.mark.sequentialColorScheme};

    case OPACITY:
      // TODO: support custom rangeMin, rangeMax
      return {range: [config.mark.minOpacity, config.mark.maxOpacity]};
  }
  /* istanbul ignore next: should never reach here */
  throw new Error(`Scale range undefined for channel ${channel}`);
}

function sizeRangeMin(mark: Mark, zero: boolean, config: Config) {
  if (zero) {
    return 0;
  }
  switch (mark) {
    case 'bar':
      return config.bar.minBandSize !== undefined ? config.bar.minBandSize : config.bar.continuousBandSize;
    case 'tick':
      return config.tick.minBandSize;
    case 'rule':
      return config.rule.minStrokeWidth;
    case 'text':
      return config.text.minFontSize;
    case 'point':
      return config.point.minSize;
    case 'square':
      return config.square.minSize;
    case 'circle':
      return config.circle.minSize;
  }
  /* istanbul ignore next: should never reach here */
  // sizeRangeMin not implemented for the mark
  throw new Error(log.message.incompatibleChannel('size', mark));
}

function sizeRangeMax(mark: Mark, model: Model,  config: Config) {
  const scaleConfig = model.config().scale;
  // TODO(#1168): make max size scale based on rangeStep / overall plot size
  switch (mark) {
    case 'bar':
      if (config.bar.maxBandSize !== undefined) {
        return config.bar.maxBandSize;
      }
      return barTickRangeStep(model, config.mark) - 1;
    case 'tick':
      if (config.tick.maxBandSize !== undefined) {
        return config.tick.maxBandSize;
      }
      return barTickRangeStep(model, config.mark) - 1;
    case 'rule':
      return config.rule.maxStrokeWidth;
    case 'text':
      return config.text.maxFontSize;
    case 'point':
    case 'square':
    case 'circle':
      if ((config[mark] as PointConfig).maxSize) {
        return (config[mark] as PointConfig).maxSize;
      }

      // FIXME this case totally should be refactored
      const pointStep = pointRangeStep(model as UnitModel, scaleConfig);
      return (pointStep - 2) * (pointStep - 2);
  }
  /* istanbul ignore next: should never reach here */
  // sizeRangeMax not implemented for the mark
  throw new Error(log.message.incompatibleChannel('size', mark));
}

// TODO: we might be able to consolidate this with pointRangeStep
function barTickRangeStep(model: Model, markConfig: MarkConfig) {
  const dimension = markConfig.orient === 'horizontal' ? Y : X;
  const step = model.scale(dimension).rangeStep;
  if (step) {
    return step;
  }
  // TODO(#1168): proportional rangeStep for fit mode
  return 21;
}

/**
 * @returns {number} Range step of x or y or minimum between the two if both are ordinal scale.
 */
function pointRangeStep(model: UnitModel, scaleConfig: ScaleConfig): number {
  const rangeSteps: number[] = [];
  if (model.scale(X)) {
    const xStep = model.scale(X).rangeStep;
    // TODO(#1168): proportional rangeStep for fit mode
    if (xStep) {
      rangeSteps.push(xStep);
    }
  }

  if (model.scale(Y)) {
    const yStep = model.scale(Y).rangeStep;
    // TODO(#1168): proportional rangeStep for fit mode
    if (yStep) {
      rangeSteps.push(yStep);
    }
  }

  if (rangeSteps.length > 0) {
    return Math.min.apply(null, rangeSteps);
  }
  if (scaleConfig.rangeStep) {
    return scaleConfig.rangeStep;
  }
  return 21;
}
