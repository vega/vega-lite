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
    const orient = model.config().mark.orient;

    if (orient === 'vertical') {
      if (model.has(X) && model.has(Y) && model.has(Y2)) {
        p.x = position(model, X);
        p.y = position(model, Y);
        p.y2 = {
          scale: model.scaleName(Y),
          field: model.field(Y2)
        };
      } else if (model.has(X) && model.has(Y)) {
          p.x = position(model, X);
          p.y = { field: { group: 'height' } };
          p.y2 = position(model, Y);
      }
    } else if (orient === 'horizontal') {
      if (model.has(Y) && model.has(X) && model.has(X2)) {
        p.x = position(model, X);
        p.x2 = {
          scale: model.scaleName(X),
          field: model.field(X2)
        };
        p.y = position(model, Y);
      } else if (model.has(X) && model.has(Y)) {
        p.x = { value: 0 };
        p.x2 = position(model, X);
        p.y = position(model, Y);
      }
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
