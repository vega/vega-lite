import {X, Y, SIZE, Channel} from '../../channel';

import {UnitModel} from '../unit';
import {applyColorAndOpacity} from '../common';

export namespace rule {
  export function markType() {
    return 'rule';
  }

  export function properties(model: UnitModel) {
    let p: any = {};

    // TODO: support explicit value

    // vertical
    if (model.has(X)) {
      p.x = position(model, X);

      p.y = { value: 0 };
      p.y2 = {
          field: {group: 'height'}
        };
    }

    // horizontal
    if (model.has(Y)) {
      p.y = position(model, Y);

      p.x = { value: 0 };
      p.x2 = {
          field: {group: 'width'}
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
