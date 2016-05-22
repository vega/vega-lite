import {X, Y, X2, Y2, SIZE, Channel} from '../../channel';

import {UnitModel} from '../unit';
import {applyColorAndOpacity} from '../common';

export namespace rule {
  export function markType() {
    return 'rule';
  }

  export function properties(model: UnitModel) {
    let p: any = {};

    // TODO: support explicit value

    if (model.has(X) && model.has(Y) && model.has(Y2)) { // vertical range
      p.x = position(model, X);
      p.y = position(model, Y);
      p.y2 = {
        scale: model.scaleName(Y),
        field: model.field(Y2)
      };
    } else if (model.has(Y) && model.has(X) && model.has(X2)) { // horizontal range
      p.y = position(model, Y);
      p.x = position(model, X);
      p.x2 = {
        scale: model.scaleName(X),
        field: model.field(X2)
      };
    } else if (model.has(X)) { // vertical
      p.x = position(model, X);
      p.y = { value: 0 };
      p.y2 = { field: { group: 'height' } };
    } else if (model.has(Y)) { // horizontal
      p.y = position(model, Y);
      p.x = { value: 0 };
      p.x2 = {
          field: { group: 'width' }
        };
    }

    // FIXME: this function would overwrite strokeWidth but shouldn't
    applyColorAndOpacity(p, model);

    // size
    if (model.has(SIZE)) {
      p.strokeWidth = {
        scale: model.scaleName(SIZE),
        field: model.field(SIZE)
      };
    } else {
      p.strokeWidth = { value: sizeValue(model) };
    }
    return p;
  }

  function position(model: UnitModel, channel: Channel) {
    return {
        scale: model.scaleName(channel),
        field: model.field(channel, { binSuffix: '_mid' })
      };
  }

  function sizeValue(model: UnitModel) {
    const fieldDef = model.fieldDef(SIZE);
    if (fieldDef && fieldDef.value !== undefined) {
       return fieldDef.value;
    }

    return model.config().mark.ruleSize;
  }

  export function labels(model: UnitModel) {
    // TODO(#240): fill this method
    return undefined;
  }
}
