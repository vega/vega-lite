import {NonPositionScaleChannel, PolarPositionScaleChannel, PositionScaleChannel} from '../../../channel';
import {Config} from '../../../config';
import {VgValueRef} from '../../../vega.schema';
import {ScaleComponent} from '../../scale/component';

export function zeroOrMinOrMax({
  scaleName,
  scale,
  mode,
  mainChannel,
  config
}: {
  scaleName: string;
  scale: ScaleComponent;
  mode: 'min' | 'zeroOrMin' | {zeroOrMax: {widthSignal: string; heightSignal: string}};
  mainChannel: PositionScaleChannel | PolarPositionScaleChannel | NonPositionScaleChannel;
  config: Config;
}): VgValueRef {
  const domain = `domain('${scaleName}')`;
  const min = `${domain}[0]`;
  const max = `peek(${domain})`; // peek = the last item of the array

  if (scale && scaleName) {
    // If there is a scale (and hence its name)
    const domainHasZero = scale.domainHasZero();
    if (mode === 'min') {
      return {signal: `scale('${scaleName}', ${min})`}; // encode the scale domain min
    } else {
      // zeroOrMin or zeroOrMax mode
      if (domainHasZero === 'definitely') {
        return {
          scale: scaleName,
          value: 0
        };
      } else if (domainHasZero === 'maybe') {
        if (mode === 'zeroOrMin') {
          return {signal: `scale('${scaleName}', inrange(0, ${domain}) ? 0 : ${min})`}; // encode the scale domain min
        } else {
          return {signal: `scale('${scaleName}', inrange(0, ${domain}) ? 0 : ${max})`}; // encode the scale domain max
        }
      }
    }
  }

  const isMin = mode === 'zeroOrMin' || mode === 'min';
  switch (mainChannel) {
    case 'radius': {
      if (mode === 'min' || mode === 'zeroOrMin') {
        return {value: 0}; // min value
      }
      const {widthSignal, heightSignal} = mode.zeroOrMax;
      // max of radius is min(width, height) / 2
      return {
        signal: `min(${widthSignal},${heightSignal})/2`
      };
    }
    case 'theta':
    case 'angle':
      return isMin ? {value: 0} : {signal: '2*PI'};
    case 'x':
      return isMin ? {value: 0} : {field: {group: 'width'}};
    case 'y':
      return isMin ? {field: {group: 'height'}} : {value: 0};
    case 'color':
    case 'fill':
    case 'stroke':
      return {value: '#aaa'};
    case 'opacity':
    case 'fillOpacity':
    case 'strokeOpacity':
      return {value: config.scale[isMin ? 'minOpacity' : 'maxOpacity']};
    case 'strokeWidth':
      return {value: config.scale[isMin ? 'minStrokeWidth' : 'maxStrokeWidth']};
    case 'size':
      return {value: config.scale[isMin ? 'minSize' : 'maxSize']};
    case 'strokeDash':
    case 'shape':
      return {value: null};
  }
}
