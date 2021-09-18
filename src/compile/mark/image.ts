import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as encode from './encode';

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
        theta: 'ignore'
      }),
      ...encode.rectPosition(model, 'x'),
      ...encode.rectPosition(model, 'y'),
      ...encode.text(model, 'url')
    };
  }
};
