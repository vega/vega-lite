import {X, Y} from '../../channel';
import {Config} from '../../config';
import {FieldDef, field} from '../../fielddef';
import {VgValueRef} from '../../vega.schema';

import {applyColorAndOpacity, applyMarkConfig} from '../common';
import {UnitModel} from '../unit';

export namespace line {
  export function markType() {
    return 'line';
  }

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const config = model.config();

    p.x = x(model.encoding().x, model.scaleName(X), config);

    p.y = y(model.encoding().y, model.scaleName(Y), config);

    const _size = size(model.encoding().size, config);
    if (_size) { p.strokeWidth = _size; }

    applyColorAndOpacity(p, model);
    applyMarkConfig(p, model, ['interpolate', 'tension']);
    return p;
  }

  function x(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
    // x
    if (fieldDef) {
      if (fieldDef.field) {
        return {
          scale: scaleName,
          field: field(fieldDef, { binSuffix: 'mid' })
        };
      }
      // TODO: fieldDef.value (for layering)
    }
    return { value: 0 };
  }

  function y(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
    // y
    if (fieldDef) {
      if (fieldDef.field) {
        return {
          scale: scaleName,
          field: field(fieldDef, { binSuffix: 'mid' })
        };
      }
      // TODO: fieldDef.value (for layering)
    }
    return { field: { group: 'height' } };
  }

  function size(fieldDef: FieldDef, config: Config) {
    if (fieldDef && fieldDef.value !== undefined) {
       return { value: fieldDef.value};
    }
    return { value: config.mark.lineSize };
  }
}
