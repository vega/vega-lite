import {UnitModel} from '../unit.js';
import {getOffsetScaleChannel, getSecondaryRangeChannel} from '../../channel.js';
import {isFieldDef, isFieldOrDatumDef} from '../../channeldef.js';
import {hasDiscreteDomain} from '../../scale.js';
import {isContinuous} from '../../type.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const area: MarkCompiler = {
  vgMark: 'area',
  encodeEntry: (model: UnitModel) => {
    const xRangeFromOffset = hasContinuousOffsetRange(model, 'x');
    const yRangeFromOffset = hasContinuousOffsetRange(model, 'y');

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
        range: model.markDef.orient === 'horizontal' || xRangeFromOffset,
      }),
      ...encode.pointOrRangePosition('y', model, {
        defaultPos: 'zeroOrMin',
        defaultPos2: 'zeroOrMin',
        range: model.markDef.orient === 'vertical' || yRangeFromOffset,
      }),
      ...encode.defined(model),
    };
  },
};

function hasContinuousOffsetRange(model: UnitModel, channel: 'x' | 'y'): boolean {
  const {encoding} = model;
  const channelDef = encoding[channel];
  const channel2 = getSecondaryRangeChannel(channel);

  if (!isFieldOrDatumDef(channelDef) || encoding[channel2]) {
    return false;
  }

  const scaleType = model.getScaleComponent(channel)?.get('type');
  if (!hasDiscreteDomain(scaleType)) {
    return false;
  }

  const offsetChannel = getOffsetScaleChannel(channel);
  const offsetDef = encoding[offsetChannel];
  return isFieldDef(offsetDef) && isContinuous(offsetDef.type);
}
