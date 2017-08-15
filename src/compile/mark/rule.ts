import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';


export const rule: MarkCompiler = {
  vgMark: 'rule',
  encodeEntry: (model: UnitModel) => {
    const {config: _config, markDef, width, height} = model;
    const orient = markDef.orient;

    return {
      ...mixins.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : ref.mid(width)),
      ...mixins.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : ref.mid(height)),
      ...mixins.pointPosition2(model, 'zeroOrMax'),

      ...mixins.color(model),
      ...mixins.text(model, 'tooltip'),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth'  // VL's rule size is strokeWidth
      })
    };
  }
};
