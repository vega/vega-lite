import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const treemap: MarkCompiler = {
  vgMark: 'rect',
  encodeEntry: (model: UnitModel) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        size: 'ignore', // size drives the treemap layout transform, not a visual encoding
        orient: 'ignore',
        theta: 'ignore',
      }),
      x: {field: 'x0'},
      x2: {field: 'x1'},
      y: {field: 'y0'},
      y2: {field: 'y1'},
    };
  },
};
