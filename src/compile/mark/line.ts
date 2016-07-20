import {X, Y} from '../../channel';
import {Config} from '../../config';
import {FieldDef, field} from '../../fielddef';
import {Scale} from '../../scale';
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

    p.x = x(model.encoding().x, model.scaleName(X), model.scale(X), config);

    p.y = y(model.encoding().y, model.scaleName(Y), model.scale(Y), config);

    const _size = size(model.encoding().size, config);
    if (_size) { p.strokeWidth = _size; }

    applyColorAndOpacity(p, model);
    applyMarkConfig(p, model, ['interpolate', 'tension']);
    return p;
  }

  function x(fieldDef: FieldDef, scaleName: string, scale: Scale, config: Config): VgValueRef {
    // x
    if (fieldDef) {
      if (fieldDef.field) {
        let fieldRef: VgValueRef = {field: field(fieldDef, { binSuffix: '_mid' })};
        if (scale) {
          fieldRef.scale = scaleName;
        }
        return fieldRef;
      }
      // TODO: fieldDef.value (for layering)
    }
    return { value: 0 };
  }

  function y(fieldDef: FieldDef, scaleName: string, scale: Scale, config: Config): VgValueRef {
    // y
    if (fieldDef) {
      if (fieldDef.field) {
        let fieldRef: VgValueRef = {field: field(fieldDef, { binSuffix: '_mid' })};
        if (scale) {
          fieldRef.scale = scaleName;
        }
        return fieldRef;
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

  export function labels(model: UnitModel) {
    // TODO(#240): fill this method
    return undefined;
  }
}
