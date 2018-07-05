import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';

export const line: MarkCompiler = {
  vgMark: 'line',
  encodeEntry: (model: UnitModel) => {
    const {width, height} = model;

    return {
      ...mixins.baseEncodeEntry(model, {size: 'ignore', orient: 'ignore'}),
      ...mixins.pointPosition('x', model, ref.mid(width)),
      ...mixins.pointPosition('y', model, ref.mid(height)),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth' // VL's line size is strokeWidth
      }),
      ...mixins.defined(model)
    };
  }
};

export const trail: MarkCompiler = {
  vgMark: 'trail',
  encodeEntry: (model: UnitModel) => {
    const {width, height} = model;

    return {
      ...mixins.baseEncodeEntry(model, {size: 'include', orient: 'ignore'}),
      ...mixins.pointPosition('x', model, ref.mid(width)),
      ...mixins.pointPosition('y', model, ref.mid(height)),
      ...mixins.nonPosition('size', model),
      ...mixins.defined(model)
    };
  }
};
