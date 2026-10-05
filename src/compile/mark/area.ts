import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const area: MarkCompiler = {
  vgMark: 'area',
  encodeEntry: (model: UnitModel) => {
    const xRangeFromOffset = model.isRangedOffset('x');
    const yRangeFromOffset = model.isRangedOffset('y');
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
