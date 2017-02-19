import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';

export const rule: MarkCompiler = {
  vgMark: 'rule',
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.pointPosition('x', model, 'zeroOrMin'),
      ...mixins.pointPosition('y', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMax'),

      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth'  // VL's rule size is strokeWidth
      })
    };
  }
};
