import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {MarkCompiler} from './base';

export const area: MarkCompiler = {
  vgMark: 'area',
  defaultRole: undefined,
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.pointPosition('x', model, 'zeroOrMin'),
      ...mixins.pointPosition('y', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin'),

      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.markDefProperties(model.markDef, ['orient', 'interpolate', 'tension']),
    };
  }
};
