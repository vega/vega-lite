import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const rect: MarkCompiler = {
  vgMark: 'rect',
  encodeEntry: (model: UnitModel) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        orient: 'ignore',
        size: 'ignore',
        theta: 'ignore',
      }),
      ...encode.rectPosition(model, 'x'),
      ...encode.rectPosition(model, 'y'),
    };
  },
};
