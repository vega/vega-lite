import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';

export const rule: MarkCompiler = {
  vgMark: 'rule',
  encodeEntry: (model: UnitModel) => {
    const {markDef, width, height} = model;
    const orient = markDef.orient;

    if (!model.encoding.x && !model.encoding.y && !model.encoding.latitude && !model.encoding.longitude) {
      // Show nothing if we have none of x, y, lat, and long.
      return {};
    }

    return {
      ...mixins.baseEncodeEntry(model, {size: 'ignore', orient: 'ignore'}),
      ...mixins.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : ref.mid(width)),
      ...mixins.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : ref.mid(height)),

      // include x2 for horizontal or line segment rule
      ...(orient !== 'vertical' ? mixins.pointPosition2(model, 'zeroOrMax', 'x2') : {}),

      // include y2 for vertical or line segment rule
      ...(orient !== 'horizontal' ? mixins.pointPosition2(model, 'zeroOrMax', 'y2') : {}),

      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth', // VL's rule size is strokeWidth
        defaultValue: markDef.size
      })
    };
  }
};
