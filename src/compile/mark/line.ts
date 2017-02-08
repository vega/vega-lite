import {X, Y} from '../../channel';
import {Config} from '../../config';
import {ChannelDef, isValueDef} from '../../fielddef';
import {VgEncodeEntry} from '../../vega.schema';

import {applyMarkConfig} from '../common';
import {applyColorAndOpacity} from './common';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';
import * as ref from './valueref';

export const line: MarkCompiler = {
  vgMark: 'line',
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    let e: VgEncodeEntry = {};
    const config = model.config();
    const stack = model.stack();

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

    e.x = ref.stackable(X, model.encoding().x, model.scaleName(X), model.scale(X), stack, 'base');
    e.y = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, 'base');
    e.strokeWidth = ref.midPoint('size', model.encoding().size, model.scaleName('size'), model.scale('size'),
      {value: config.mark.strokeWidth}
    );
    applyColorAndOpacity(e, model);
    applyMarkConfig(e, model, ['interpolate', 'tension']);
    return e;
  }
};
