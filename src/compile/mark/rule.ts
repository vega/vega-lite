import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';

export const rule: MarkCompiler = {
  vgMark: 'rule',
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.pointPosition('x', model, 'base'),
      ...mixins.pointPosition('y', model, 'base'),
      ...mixins.pointPosition2(model, 'baseOrMax'),

      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth'  // VL's rule size is strokeWidth
      })
    };
  }
};
