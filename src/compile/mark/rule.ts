import {X2, Y2} from '../../channel';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';

export const rule: MarkCompiler = {
  vgMark: 'rule',
  encodeEntry: (model: UnitModel) => {
    const {config: _config, markDef, width, height} = model;
    const orient = markDef.orient;

    if (!model.encoding.x && !model.encoding.y) {
      // if we have neither x or y, show nothing
      return {};
    }

    let secondary = {};
    if (model.channelHasField(X2) && model.channelHasField(Y2)) {
      secondary = {
        ...mixins.pointPosition2(model, 'zeroOrMax', 'x2'),
        ...mixins.pointPosition2(model, 'zeroOrMax', 'y2'),
      };
    } else {
      secondary = {
        ...mixins.pointPosition2(model, 'zeroOrMax'),
      };
    }

    return {
      ...mixins.baseEncodeEntry(model, true),
      ...mixins.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : ref.mid(width)),
      ...mixins.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : ref.mid(height)),
      ...secondary,

      // include x2 for horizontal or line segment rule
      ...(orient !== 'vertical' ? mixins.pointPosition2(model, 'zeroOrMax', 'x2') : {}),

      // include y2 for vertical or line segment rule
      ...(orient !== 'horizontal' ? mixins.pointPosition2(model, 'zeroOrMax', 'y2') : {}),

      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth'  // VL's rule size is strokeWidth
      })
    };
  }
};
