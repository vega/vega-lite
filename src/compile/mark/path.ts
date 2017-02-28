import * as mixins from './mixins';
import {UnitModel} from '../unit';
import {Config} from '../../config';
import {ChannelDef, isFieldDef} from '../../fielddef';
import {GEOJSON} from '../../type';
import {VgValueRef} from '../../vega.schema';

import {MarkCompiler} from './base';

export const path: MarkCompiler = {
  vgMark: 'path',
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    const {config, encoding} = model;
    return {
      path: pathDefault(config, encoding.path),
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'strokeWidth'  // VL's path size is strokeWidth
      })
    };
  }
};

function pathDefault(config: Config, fieldDef: ChannelDef): VgValueRef {
  if (isFieldDef(fieldDef) && fieldDef.type === GEOJSON) {
    return {field: 'layout_path'};
  }
  return undefined;
}
