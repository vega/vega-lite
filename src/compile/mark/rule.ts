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
      ...mixins.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        orient: 'ignore',
        size: 'ignore'
      }),
      ...mixins.pointOrRangePosition('x', model, {
        defaultRef: orient === 'horizontal' ? 'zeroOrMin' : ref.mid(width),
        defaultRef2: 'zeroOrMax',
        range: orient !== 'vertical' // include x2 for horizontal or line segment rule
      }),
      ...mixins.pointOrRangePosition('y', model, {
        defaultRef: orient === 'vertical' ? 'zeroOrMin' : ref.mid(height),
        defaultRef2: 'zeroOrMax',
        range: orient !== 'horizontal' // include y2 for vertical or line segment rule
      }),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth' // VL's rule size is strokeWidth
      })
    };
  }
};
