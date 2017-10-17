import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';


export const area: MarkCompiler = {
  vgMark: 'area',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.markDefProperties(model.markDef),
      ...mixins.pointPosition('x', model, 'zeroOrMin'),
      ...mixins.pointPosition('y', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin'),

      ...mixins.color(model),
      ...mixins.text(model, 'tooltip'),
      ...mixins.nonPosition('opacity', model),
    };
  }
};
