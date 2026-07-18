import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const area: MarkCompiler = {
  vgMark: 'area',
  encodeEntry: (model: UnitModel) => {
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
