import {UnitModel} from '../unit';
import {X, Y, SIZE} from '../../channel';
import {applyColorAndOpacity, applyMarkConfig} from '../common';


export namespace line {
  export function markType() {
    return 'line';
  }

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = {};

    // x
    if (model.has(X)) {
      p.x = {
        scale: model.scaleName(X),
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else {
      p.x = { value: 0 };
    }

    // y
    if (model.has(Y)) {
      p.y = {
        scale: model.scaleName(Y),
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else {
      p.y = { field: { group: 'height' } };
    }

    applyColorAndOpacity(p, model);
    applyMarkConfig(p, model, ['interpolate', 'tension']);

    // size as a channel is not supported in Vega yet.
    const size = sizeValue(model);
    if (size) {
      p.strokeWidth = { value: size };
    }
    return p;
  }

  function sizeValue(model: UnitModel) {
    const fieldDef = model.fieldDef(SIZE);
    if (fieldDef && fieldDef.value !== undefined) {
       return fieldDef.value;
    }
    return model.config().mark.lineSize;
  }

  export function labels(model: UnitModel) {
    // TODO(#240): fill this method
    return undefined;
  }
}
