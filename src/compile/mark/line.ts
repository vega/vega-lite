import * as mixins from './mixins';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';

export const line: MarkCompiler = {
  vgMark: 'line',
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.pointPosition('x', model, 'base'),
      ...mixins.pointPosition('y', model, 'base'),
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth'  // VL's line size is strokeWidth
      }),
      ...mixins.markDefProperties(model.markDef, ['interpolate', 'tension'])
    };
  }
};
