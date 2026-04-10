import {UnitModel} from '../unit.js';
import {getSecondaryRangeChannel} from '../../channel.js';
import {isFieldOrDatumDef, isValueDef} from '../../channeldef.js';
import {VgValueRef} from '../../vega.schema.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const area: MarkCompiler = {
  vgMark: 'area',
  encodeEntry: (model: UnitModel) => {
    const thickness = getAreaThicknessRef(model);

    if (thickness && hasThicknessRangeFromSize(model, 'y')) {
      const yCenter = encode.pointPosition('y', model, {defaultPos: 'mid'}).y as VgValueRef;
      return {
        ...encode.baseEncodeEntry(model, {
          align: 'ignore',
          baseline: 'ignore',
          color: 'include',
          orient: 'include',
          size: 'ignore',
          theta: 'ignore',
        }),
        ...encode.pointPosition('x', model, {defaultPos: 'zeroOrMin'}),
        y: withOffset(yCenter, halfThicknessRef(thickness, 0.5)),
        y2: withOffset(yCenter, halfThicknessRef(thickness, -0.5)),
        ...encode.defined(model),
      };
    }

    if (thickness && hasThicknessRangeFromSize(model, 'x')) {
      const xCenter = encode.pointPosition('x', model, {defaultPos: 'mid'}).x as VgValueRef;
      return {
        ...encode.baseEncodeEntry(model, {
          align: 'ignore',
          baseline: 'ignore',
          color: 'include',
          orient: 'include',
          size: 'ignore',
          theta: 'ignore',
        }),
        ...encode.pointPosition('y', model, {defaultPos: 'zeroOrMin'}),
        x: withOffset(xCenter, halfThicknessRef(thickness, 0.5)),
        x2: withOffset(xCenter, halfThicknessRef(thickness, -0.5)),
        ...encode.defined(model),
      };
    }

    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        orient: 'include',
        size: 'ignore',
        theta: 'ignore',
      }),
      ...encode.pointOrRangePosition('x', model, {
        defaultPos: 'zeroOrMin',
        defaultPos2: 'zeroOrMin',
        range: model.markDef.orient === 'horizontal',
      }),
      ...encode.pointOrRangePosition('y', model, {
        defaultPos: 'zeroOrMin',
        defaultPos2: 'zeroOrMin',
        range: model.markDef.orient === 'vertical',
      }),
      ...encode.defined(model),
    };
  },
};

function hasThicknessRangeFromSize(model: UnitModel, channel: 'x' | 'y'): boolean {
  const {encoding} = model;
  const channelDef = encoding[channel];
  const channel2 = getSecondaryRangeChannel(channel);

  if (!encoding.size || encoding[channel2]) {
    return false;
  }

  if (!(isFieldOrDatumDef(channelDef) || isValueDef(channelDef))) {
    return false;
  }

  if (channel === 'y') {
    return !!encoding.x;
  }

  return !encoding.y && !!encoding.x;
}

function getAreaThicknessRef(model: UnitModel): VgValueRef {
  return encode.nonPosition('size', model).size as VgValueRef;
}

function halfThicknessRef(thickness: VgValueRef, factor: number): VgValueRef {
  return {
    ...thickness,
    mult: (thickness.mult ?? 1) * factor,
  };
}

function withOffset(baseRef: VgValueRef, offset: VgValueRef): VgValueRef {
  return {
    ...baseRef,
    offset,
  };
}
