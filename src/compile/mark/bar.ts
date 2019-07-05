import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import {rectPosition} from './rect';

export const bar: MarkCompiler = {
  vgMark: 'rect',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.baseEncodeEntry(model, {color: 'include', size: 'ignore', orient: 'ignore'}),
      ...rectPosition(model, 'x', 'bar'),
      ...rectPosition(model, 'y', 'bar')
    };
  }
};
