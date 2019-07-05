import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import {rectPosition} from './rect';

export const image: MarkCompiler = {
  vgMark: 'image',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.baseEncodeEntry(model, {color: 'ignore', size: 'ignore', orient: 'ignore'}),
      ...rectPosition(model, 'x', 'image'),
      ...rectPosition(model, 'y', 'image'),
      ...mixins.text(model, 'url')
    };
  }
};
