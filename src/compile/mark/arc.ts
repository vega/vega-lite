import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const arc: MarkCompiler = {
  vgMark: 'arc',
  encodeEntry: (model: UnitModel) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        size: 'ignore',
        orient: 'ignore',
        theta: 'ignore',
      }),
      ...encode.pointPosition('x', model, {defaultPos: 'mid'}),
      ...encode.pointPosition('y', model, {defaultPos: 'mid'}),

      // arcs are rectangles in polar coordinates
      ...encode.rectPosition(model, 'radius'),
      ...encode.rectPosition(model, 'theta'),
    };
  },
};
