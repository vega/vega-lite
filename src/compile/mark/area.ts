import * as mixins from './mixins';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';

export const area: MarkCompiler = {
  vgMark: 'area',
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    const orient = model.markDef.orient;

    return {
      ...mixins.pointPosition('x', model, 'base'),
      ...mixins.pointPosition('y', model, 'base'),
      ...mixins.pointPosition2(model, 'base'),

      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.markDefProperties(model.markDef, ['orient', 'interpolate', 'tension']),
    };
  }
};
