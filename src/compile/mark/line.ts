import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {MarkCompiler} from './base';

export const line: MarkCompiler = {
  vgMark: 'line',
  defaultRole: undefined,
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.pointPosition('x', model, 'zeroOrMin'),
      ...mixins.pointPosition('y', model, 'zeroOrMin'),
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth'  // VL's line size is strokeWidth
      }),
      ...mixins.markDefProperties(model.markDef, ['interpolate', 'tension'])
    };
  }
};
