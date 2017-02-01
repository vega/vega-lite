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
  markType: () => {
    return 'line';
  },
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    let e: VgEncodeEntry = {};
    const config = model.config();
    const stack = model.stack();

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

    e.x = ref.stackable(X, model.encoding().x, model.scaleName(X), model.scale(X), stack, 'base');
    e.y = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, 'base');

    const _size = size(model.encoding().size, config);
    if (_size) { e.strokeWidth = _size; }

    applyColorAndOpacity(e, model);
    applyMarkConfig(e, model, ['interpolate', 'tension']);
    return e;
  }
};

// FIXME: replace this with normal size and throw warning if the size field is not the grouping field instead?
// NOTE: This is different from other size because
// Vega does not support variable line size.
function size(sizeDef: ChannelDef, config: Config) {
  if (isValueDef(sizeDef)) {
      return { value: sizeDef.value};
  }
  // FIXME: We should not need this line since this should be taken care by applyColorAndOpacity
  // but we have to refactor \ first
  return { value: config.mark.strokeWidth };
}

