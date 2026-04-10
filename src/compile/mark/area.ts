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
    const hasOffsetDrivenRange = xRangeFromOffset || yRangeFromOffset;
    const xIsRange = xRangeFromOffset || (!hasOffsetDrivenRange && model.markDef.orient === 'horizontal');
    const yIsRange = yRangeFromOffset || (!hasOffsetDrivenRange && model.markDef.orient === 'vertical');
    const yDefaultPos = yRangeFromOffset && !model.encoding.y ? 'zeroOrMax' : 'zeroOrMin';

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
        range: xIsRange,
      }),
      ...encode.pointOrRangePosition('y', model, {
        defaultPos: yDefaultPos,
        defaultPos2: 'zeroOrMin',
        range: yIsRange,
      }),
      ...encode.defined(model),
    };
  },
};

function hasContinuousOffsetRange(model: UnitModel, channel: 'x' | 'y'): boolean {
  const {encoding} = model;
  const channelDef = encoding[channel];
  const channel2 = getSecondaryRangeChannel(channel);

  if (encoding[channel2]) {
    return false;
  }

  const offsetChannel = getOffsetScaleChannel(channel);
  const offsetDef = encoding[offsetChannel];
  if (!(isFieldDef(offsetDef) && isContinuous(offsetDef.type))) {
    return false;
  }

  if (channelDef === undefined) {
    return true;
  }

  if (!isFieldOrDatumDef(channelDef)) {
    return false;
  }

  const scaleType = model.getScaleComponent(channel)?.get('type');
  if (!hasDiscreteDomain(scaleType)) {
    return false;
  }

  return true;
}
