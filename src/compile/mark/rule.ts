import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';

export const rule: MarkCompiler = {
  vgMark: 'rule',
  defaultRole: undefined,
  encodeEntry: (model: UnitModel) => {
    const {config, markDef} = model;
    const orient = markDef.orient;

    return {
      ...mixins.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : ref.midX(config)),
      ...mixins.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : ref.midY(config)),
      ...mixins.pointPosition2(model, 'zeroOrMax'),

      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth'  // VL's rule size is strokeWidth
      })
    };
  }
};
