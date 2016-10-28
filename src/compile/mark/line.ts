import {X, Y} from '../../channel';
import {Config} from '../../config';
import {FieldDef} from '../../fielddef';

import {applyColorAndOpacity, applyMarkConfig} from '../common';
import {UnitModel} from '../unit';
import * as ref from './valueref';

export namespace line {
  export function markType() {
    return 'line';
  }

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const config = model.config();
    const stack = model.stack();

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

    p.x = ref.stackable(X, model.encoding().x, model.scaleName(X), model.scale(X), stack, 'base');
    p.y = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, 'base');

    const _size = size(model.encoding().size, config);
    if (_size) { p.strokeWidth = _size; }

    applyColorAndOpacity(p, model);
    applyMarkConfig(p, model, ['interpolate', 'tension']);
    return p;
  }

  // NOTE: This is different from other size because
  // Vega does not support variable line size.
  function size(fieldDef: FieldDef, config: Config) {
    if (fieldDef && fieldDef.value !== undefined) {
       return { value: fieldDef.value};
    }
    return { value: config.mark.lineSize };
  }
}
