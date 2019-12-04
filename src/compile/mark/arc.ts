import {VgValueRef} from '../../vega.schema';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as encode from './encode';

export const arc: MarkCompiler = {
  vgMark: 'arc',
  encodeEntry: (model: UnitModel) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        size: 'ignore',
        orient: 'ignore'
      }),
      ...encode.pointPosition('x', model, {defaultPos: 'mid'}),
      ...encode.pointPosition('y', model, {defaultPos: 'mid'}),
      ...encode.arcRangePosition(model, {
        channel: 'radius',
        vgChannel: 'outerRadius',
        vgChannel2: 'innerRadius',
        defaultRef: defaultOuterRadius(model)
      }),
      ...encode.arcRangePosition(model, {
        channel: 'theta',
        vgChannel: 'startAngle',
        vgChannel2: 'endAngle',
        defaultRef: {signal: 'PI * 2'}
      })
    };
  }
};

function defaultOuterRadius(model: UnitModel): VgValueRef {
  // radius = min(width,height)/2
  return {
    signal: `min(${model.width.signal},${model.height.signal})/2`
  };
}
