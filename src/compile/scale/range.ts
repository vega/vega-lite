import * as log from '../../log';

import {COLUMN, ROW, X, Y, SHAPE, SIZE, COLOR, OPACITY, Channel} from '../../channel';
import {Config} from '../../config';
import {Mark} from '../../mark';
import {Scale, ScaleConfig, ScaleType, Range, scaleTypeSupportProperty} from '../../scale';
import {Type} from '../../type';
import * as util from '../../util';

import {channelScalePropertyIncompatability} from './scale';

export type RangeMixins = {range: Range | string} | {rangeStep: number};

/**
 * Return mixins that includes one of the range properties (range, rangeStep, scheme).
 */
export default function rangeMixins(
  channel: Channel, scaleType: ScaleType, type: Type, specifiedScale: Scale, config: Config,
  zero: boolean, mark: Mark, topLevelSize: number | undefined, xyRangeSteps: number[]): RangeMixins {

  let specifiedRangeStepIsNull = false;

  // Check if any of the range properties is specified.
  // If so, check if it is compatible and make sure that we only output one of the properties
  for (let property of ['range', 'rangeStep']) {
    const specifiedValue = specifiedScale[property];
    if (specifiedValue !== undefined) {
      let supportedByScaleType = scaleTypeSupportProperty(scaleType, property);
      const channelIncompatability = channelScalePropertyIncompatability(channel, property);
      if (!supportedByScaleType) {
        log.warn(log.message.scalePropertyNotWorkWithScaleType(scaleType, property, channel));
      } else if (channelIncompatability) { // channel
        log.warn(channelIncompatability);
      } else {
        switch (property) {
          case 'range':
            return {range: specifiedValue};

          case 'rangeStep':
            if (topLevelSize === undefined) {
              if (specifiedValue !== null) {
                return {rangeStep: specifiedValue};
              } else {
                specifiedRangeStepIsNull = true;
              }
            } else {
              // If top-level size is specified, we ignore specified rangeStep.
              log.warn(log.message.rangeStepDropped(channel));
            }
        }
      }
    }
  }

  switch (channel) {
    // TODO: revise row/column when facetSpec has top-level width/height
    case ROW:
      return {range: 'height'};
    case COLUMN:
      return {range: 'width'};
    case X:
    case Y:
      if (topLevelSize === undefined) {
        if (util.contains(['point', 'band'], scaleType) && !specifiedRangeStepIsNull) { // FIXME isDiscrete blah blah
          if (channel === X && mark === 'text') {
            if (config.scale.textXRangeStep) {
              return {rangeStep: config.scale.textXRangeStep};
            }
          } else {
            if (config.scale.rangeStep) {
              return {rangeStep: config.scale.rangeStep};
            }
          }
        }
        // If specified range step is null or the range step config is null.
        // Use default topLevelSize rule/config
        topLevelSize = channel === X ? config.cell.width : config.cell.height;
      }
      return {range: channel === X ? [0, topLevelSize] : [topLevelSize, 0]};

    case SIZE:
      // TODO: support custom rangeMin, rangeMax
      const rangeMin = sizeRangeMin(mark, zero, config);
      const rangeMax = sizeRangeMax(mark, xyRangeSteps, config);
      return {range: [rangeMin, rangeMax]};
    case SHAPE:
    case COLOR:
      return {range: defaultRange(channel, scaleType, type, mark)};


    case OPACITY:
      // TODO: support custom rangeMin, rangeMax
      return {range: [config.mark.minOpacity, config.mark.maxOpacity]};
  }
  /* istanbul ignore next: should never reach here */
  throw new Error(`Scale range undefined for channel ${channel}`);
}

function defaultRange(channel: 'shape' | 'color', scaleType: ScaleType, type: Type, mark: Mark) {
  switch (channel) {
    case SHAPE:
      return 'symbol';
    case COLOR:
      if (scaleType === 'ordinal') {
        // Only nominal data uses ordinal scale by default
        return type === 'nominal' ? 'category' : 'ordinal';
      }
      return mark === 'rect' ? 'heatmap' : 'ramp';
  }
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

function sizeRangeMax(mark: Mark, xyRangeSteps: number[], config: Config) {
  const scaleConfig = config.scale;
  // TODO(#1168): make max size scale based on rangeStep / overall plot size
  switch (mark) {
    case 'bar':
      if (config.bar.maxBandSize !== undefined) {
        return config.bar.maxBandSize;
      }
      return minXYRangeStep(xyRangeSteps, config.mark) - 1;
    case 'tick':
      if (config.tick.maxBandSize !== undefined) {
        return config.tick.maxBandSize;
      }
      return minXYRangeStep(xyRangeSteps, config.mark) - 1;
    case 'rule':
      return config.rule.maxStrokeWidth;
    case 'text':
      return config.text.maxFontSize;
    case 'point':
    case 'square':
    case 'circle':
      if (config[mark].maxSize) {
        return config[mark].maxSize;
      }

      // FIXME this case totally should be refactored
      const pointStep = minXYRangeStep(xyRangeSteps, scaleConfig);
      return (pointStep - 2) * (pointStep - 2);
  }
  /* istanbul ignore next: should never reach here */
  // sizeRangeMax not implemented for the mark
  throw new Error(log.message.incompatibleChannel('size', mark));
}

/**
 * @returns {number} Range step of x or y or minimum between the two if both are ordinal scale.
 */
function minXYRangeStep(xyRangeSteps: number[], scaleConfig: ScaleConfig): number {
  if (xyRangeSteps.length > 0) {
    return Math.min.apply(null, xyRangeSteps);
  }
  if (scaleConfig.rangeStep) {
    return scaleConfig.rangeStep;
  }
  return 21; // FIXME: re-evaluate the default value here.
}
