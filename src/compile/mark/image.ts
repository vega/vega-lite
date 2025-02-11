import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode.js';

export const image: MarkCompiler = {
  vgMark: 'image',
  encodeEntry: (model: UnitModel) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'ignore',
        orient: 'ignore',
        size: 'ignore',
        theta: 'ignore',
      }),
      ...encode.rectPosition(model, 'x'),
      ...encode.rectPosition(model, 'y'),
      ...encode.text(model, 'url'),
    };
  },
};
