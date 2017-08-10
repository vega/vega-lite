import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';


export const line: MarkCompiler = {
  vgMark: 'line',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.pointPosition('x', model, 'zeroOrMin'),
      ...mixins.pointPosition('y', model, 'zeroOrMin'),
      ...mixins.color(model),
      ...mixins.text(model, 'tooltip'),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth'  // VL's line size is strokeWidth
      }),
      ...mixins.markDefProperties(model.markDef, ['interpolate', 'tension'])
    };
  }
};
