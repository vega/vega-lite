import {NonPositionScaleChannel, PolarPositionScaleChannel, PositionScaleChannel} from '../../../channel';
import {VgValueRef} from '../../../vega.schema';
import {ScaleComponent} from '../../scale/component';

export function zeroOrMinOrMax({
  scaleName,
  scale,
  mode,
  mainChannel
}: {
  scaleName: string;
  scale: ScaleComponent;
  mode: 'min' | 'zeroOrMin' | {zeroOrMax: {widthSignal: string; heightSignal: string}};
  mainChannel: PositionScaleChannel | PolarPositionScaleChannel | NonPositionScaleChannel;
}): VgValueRef {
  if (mode !== 'min' && scaleName && scale.domainDefinitelyIncludesZero()) {
    return {
      scale: scaleName,
      value: 0
    };
  }

  if (mode === 'zeroOrMin' || mode === 'min') {
    switch (mainChannel) {
      case 'radius':
      case 'theta':
      case 'x':
        return {value: 0};
      case 'y':
        return {field: {group: 'height'}};
      default:
        return {signal: `scale('${scaleName}', domain('${scaleName}')[0])`}; // encode the scale domain min
    }
  } else {
    // zeroOrMax
    switch (mainChannel) {
      case 'radius': {
        const {widthSignal, heightSignal} = mode.zeroOrMax;
        // max of radius is min(width, height) / 2
        return {
          signal: `min(${widthSignal},${heightSignal})/2`
        };
      }
      case 'theta':
        return {signal: '2*PI'};
      case 'x':
        return {field: {group: 'width'}};
      case 'y':
        return {value: 0};
      default:
        return {signal: `scale('${scaleName}', domain('${scaleName}')[1])`}; // encode the scale domain max
    }
  }
}
