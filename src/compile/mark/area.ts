import {UnitModel} from '../unit';
import {X, Y, X2, Y2} from '../../channel';
import {isDimension, isMeasure} from '../../fielddef';
import {applyColorAndOpacity, applyMarkConfig} from '../common';

export namespace area {
  export function markType() {
    return 'area';
  }

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = {};

    const orient = model.config().mark.orient;
    if (orient !== undefined) {
      p.orient = { value: orient };
    }

    const stack = model.stack();
    const xFieldDef = model.encoding().x;
    const x2FieldDef = model.encoding().x2;
    // x
    if (stack && X === stack.fieldChannel) { // Stacked Measure
      p.x = {
        scale: model.scaleName(X),
        field: model.field(X, { suffix: '_start' })
      };
      if (orient === 'horizontal') {
        p.x2 = {
          scale: model.scaleName(X),
          field: model.field(X, { suffix: '_end' })
        };
      }
    } else if (isMeasure(xFieldDef) || isMeasure(x2FieldDef)) { // Measure
      if (orient === 'horizontal') {
        // x
        if (model.has(X)) {
          p.x = {
            scale: model.scaleName(X),
            field: model.field(X)
          };
        } else {
          p.x = {
            scale: model.scaleName(X),
            value: 0
          };
        }

        // x2
        if (model.has(X2)) {
          p.x2 = {
            scale: model.scaleName(X),
            field: model.field(X2)
          };
        } else {
          p.x2 = {
            scale: model.scaleName(X),
            value: 0
          };
        }
      } else {
        if (model.has(X)) {
          p.x = {
            scale: model.scaleName(X),
            field: model.field(X)
          };
        } else if (model.has(X2)) {
          p.x = {
            scale: model.scaleName(X),
            field: model.field(X2)
          };
        }
      }
    } else if (isDimension(xFieldDef) || isDimension(x2FieldDef)) {
      if (model.has(X)) {
        p.x = {
          scale: model.scaleName(X),
          field: model.field(X, { binSuffix: '_mid' })
        };
      } else if (model.has(X2)) {
        p.x = {
          scale: model.scaleName(X),
          field: model.field(X2, { binSuffix: '_mid' })
        };
      }
    }

    // y
    const yFieldDef = model.encoding().y;
    const y2FieldDef = model.encoding().y2;
    if (stack && Y === stack.fieldChannel) { // Stacked Measure
      p.y = {
        scale: model.scaleName(Y),
        field: model.field(Y, { suffix: '_start' })
      };
      if (orient !== 'horizontal') {
        p.y2 = {
          scale: model.scaleName(Y),
          field: model.field(Y, { suffix: '_end' })
        };
      }
    } else if (isMeasure(yFieldDef) || isMeasure(y2FieldDef)) {
      if (orient !== 'horizontal') {
        // y
        if (model.has(Y)) {
          p.y = {
            scale: model.scaleName(Y),
            field: model.field(Y)
          };
        } else {
          p.y = { field: { group: 'height' } };
        }

        // y2
        if (model.has(Y2)) {
          p.y2 = {
            scale: model.scaleName(Y),
            field: model.field(Y2)
          };
        } else {
          p.y2 = {
            scale: model.scaleName(Y),
            value: 0
          };
        }
      } else {
        if (model.has(Y)) {
          p.y = {
            scale: model.scaleName(Y),
            field: model.field(Y)
          };
        } else if (model.has(Y2)) {
          p.y = {
            scale: model.scaleName(Y),
            field: model.field(Y2)
          };
        }
      }
    } else if (isDimension(yFieldDef)) {
      if (model.has(Y)) {
        p.y = {
          scale: model.scaleName(Y),
          field: model.field(Y, { binSuffix: '_mid' })
        };
      } else if (model.has(Y2)) {
        p.y = {
          scale: model.scaleName(Y),
          field: model.field(Y2, { binSuffix: '_mid' })
        };
      }
    }

    applyColorAndOpacity(p, model);
    applyMarkConfig(p, model, ['interpolate', 'tension']);
    return p;
  }

  export function labels(model: UnitModel) {
    // TODO(#240): fill this method
    return undefined;
  }
}
