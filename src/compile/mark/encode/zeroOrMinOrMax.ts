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
  mode: 'zeroOrMin' | {zeroOrMax: {widthSignal: string; heightSignal: string}};
  mainChannel: PositionScaleChannel | PolarPositionScaleChannel | NonPositionScaleChannel;
  config: Config;
}): VgValueRef {
  const domain = `domain('${scaleName}')`;

  if (scale && scaleName) {
    const min = `${domain}[0]`;
    const max = `peek(${domain})`; // peek = the last item of the array

    // If there is a scale (and hence its name)
    const domainHasZero = scale.domainHasZero();
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
    } else if (domainHasZero === 'definitely-not') {
      return {signal: `scale('${scaleName}', ${mode === 'zeroOrMin' ? min : max})`};
    }
  }

  switch (mainChannel) {
    case 'radius': {
      if (mode === 'zeroOrMin') {
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
      return mode === 'zeroOrMin' ? {value: 0} : {signal: '2*PI'};
    case 'x':
      return mode === 'zeroOrMin' ? {value: 0} : {field: {group: 'width'}};
    case 'y':
      return mode === 'zeroOrMin' ? {field: {group: 'height'}} : {value: 0};
    case 'color':
    case 'fill':
    case 'stroke':
      return {value: '#aaa'};
    case 'opacity':
    case 'fillOpacity':
    case 'strokeOpacity':
      return {value: config.scale[mode === 'zeroOrMin' ? 'minOpacity' : 'maxOpacity']};
    case 'strokeWidth':
      return {value: config.scale[mode === 'zeroOrMin' ? 'minStrokeWidth' : 'maxStrokeWidth']};
    case 'size':
      return {value: config.scale[mode === 'zeroOrMin' ? 'minSize' : 'maxSize']};
    case 'strokeDash':
    case 'shape':
      // Vega-Lite don't allow strokeDash and shape to be used with continuous scale.
      // So it should never reach here. Here we just return null so Typescript doesn't complain.
      return {value: null};
  }
}
