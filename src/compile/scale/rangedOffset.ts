import {SignalRef} from 'vega';
import {stringValue} from 'vega-util';
import {getOffsetScaleChannel, PositionScaleChannel} from '../../channel.js';
import {isContinuousToContinuous} from '../../scale.js';
import {VgValueRef} from '../../vega.schema.js';
import {UnitModel} from '../unit.js';

export interface RangedOffsetBaseline {
  offset: VgValueRef;
  bandPosition: number | SignalRef;
}

/** Returns a safe offset baseline and its relative position within the base band. */
export function rangedOffsetBaseline(model: UnitModel, channel: PositionScaleChannel): RangedOffsetBaseline {
  const offsetChannel = getOffsetScaleChannel(channel);
  const offsetScale = model.getScaleComponent(offsetChannel);
  const offsetScaleName = model.scaleName(offsetChannel);
  const positionScale = model.getScaleComponent(channel);
  const positionScaleName = model.scaleName(channel);

  if (!offsetScale || !offsetScaleName) {
    return {offset: {value: 0}, bandPosition: positionScale?.get('type') === 'band' ? 0 : 0.5};
  }

  const offsetScaleType = offsetScale.get('type');
  if (!isContinuousToContinuous(offsetScaleType)) {
    return fallbackBaseline(positionScaleName, positionScale?.get('type'));
  }

  const offsetName = stringValue(offsetScaleName);
  const domainExtent = `extent(domain(${offsetName}))`;
  const closestToZero = `clamp(0, ${domainExtent}[0], ${domainExtent}[1])`;
  const scaledBaseline = `scale(${offsetName}, ${closestToZero})`;

  if (positionScale?.get('type') === 'band' && positionScaleName) {
    const bandwidth = `bandwidth(${stringValue(positionScaleName)})`;
    const valid = `isFinite(${scaledBaseline}) && isFinite(${bandwidth}) && ${bandwidth} > 0`;
    return {
      offset: {
        signal: `${valid} ? clamp(${scaledBaseline}, 0, ${bandwidth}) : (isFinite(${bandwidth}) ? (${bandwidth}) / 2 : 0)`,
      },
      bandPosition: {
        signal: `${valid} ? clamp(${scaledBaseline} / ${bandwidth}, 0, 1) : 0.5`,
      },
    };
  }

  return {offset: {value: 0}, bandPosition: 0.5};
}

function fallbackBaseline(positionScaleName: string, positionScaleType: string | undefined): RangedOffsetBaseline {
  if (positionScaleType === 'band' && positionScaleName) {
    return {
      offset: {signal: `bandwidth(${stringValue(positionScaleName)}) / 2`},
      bandPosition: 0.5,
    };
  }

  return {offset: {value: 0}, bandPosition: 0.5};
}
