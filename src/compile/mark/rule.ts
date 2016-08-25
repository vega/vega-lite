import {X, Y, X2, Y2, SIZE} from '../../channel';
import {Orient} from '../../config';

import {UnitModel} from '../unit';
import {applyColorAndOpacity} from '../common';

export namespace rule {
  export function markType() {
    return 'rule';
  }

  export function properties(model: UnitModel) {
    let p: any = {};

    // TODO: support explicit value
    if(model.config().mark.orient === Orient.VERTICAL) {
      if (model.has(X)) {
        p.x = {
          scale: model.scaleName(X),
          field: model.field(X, { binSuffix: 'mid' })
        };
      } else {
        p.x = { value : 0 };
      }

      if (model.has(Y)) {
        p.y = {
          scale: model.scaleName(Y),
          field: model.field(Y, { binSuffix: 'mid' })
        };
      } else {
        p.y = { field: { group: 'height' } };
      }

      if (model.has(Y2)) {
        p.y2 = {
          scale: model.scaleName(Y),
          field: model.field(Y2, { binSuffix: 'mid' })
        };
      } else {
        p.y2 = { value: 0 };
      }
    } else {
      if (model.has(Y)) {
        p.y = {
          scale: model.scaleName(Y),
          field: model.field(Y, { binSuffix: 'mid' })
        };
      } else {
        p.y = { value: 0 };
      }

      if (model.has(X)) {
        p.x = {
          scale: model.scaleName(X),
          field: model.field(X, { binSuffix: 'mid' })
        };
      } else {
        p.x = { value: 0 };
      }

      if (model.has(X2)) {
        p.x2 = {
          scale: model.scaleName(X),
          field: model.field(X2, { binSuffix: 'mid' })
        };
      } else {
        p.x2 = { field: { group: 'width' } };
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

  function sizeValue(model: UnitModel) {
    const fieldDef = model.encoding().size;
    if (fieldDef && fieldDef.value !== undefined) {
       return fieldDef.value;
    }

    return model.config().mark.ruleSize;
  }
}
