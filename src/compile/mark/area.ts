import {Model} from '../Model';
import {X, Y} from '../../channel';
import {isDimension, isMeasure} from '../../fielddef';
import {applyColorAndOpacity, applyMarkConfig} from '../common';

export namespace area {
  export function markType() {
    return 'area';
  }

  export function properties(model: Model) {
    // TODO Use Vega's marks properties interface
    let p: any = {};

    const orient = model.config().mark.orient;
    if (orient !== undefined) {
      p.orient = { value: orient };
    }

    const stack = model.stack();
    const xFieldDef = model.encoding().x;
    // x
    if (stack && X === stack.fieldChannel) { // Stacked Measure
      p.x = {
        scale: model.scaleName(X),
        field: model.field(X, { suffix: '_start' })
      };
    } else if (isMeasure(xFieldDef)) { // Measure
      p.x = { scale: model.scaleName(X), field: model.field(X) };
    } else if (isDimension(xFieldDef)) {
      p.x = {
        scale: model.scaleName(X),
        field: model.field(X, { binSuffix: '_mid' })
      };
    }

    // x2
    if (orient === 'horizontal') {
      if (stack && X === stack.fieldChannel) {
        p.x2 = {
          scale: model.scaleName(X),
          field: model.field(X, { suffix: '_end' })
        };
      } else {
        p.x2 = {
          scale: model.scaleName(X),
          value: 0
        };
      }
    }

    // y
    const yFieldDef = model.encoding().y;
    if (stack && Y === stack.fieldChannel) { // Stacked Measure
      p.y = {
        scale: model.scaleName(Y),
        field: model.field(Y, { suffix: '_start' })
      };
    } else if (isMeasure(yFieldDef)) {
      p.y = {
        scale: model.scaleName(Y),
        field: model.field(Y)
      };
    } else if (isDimension(yFieldDef)) {
      p.y = {
        scale: model.scaleName(Y),
        field: model.field(Y, { binSuffix: '_mid' })
      };
    }

    if (orient !== 'horizontal') { // 'vertical' or undefined are vertical
      if (stack && Y === stack.fieldChannel) {
        p.y2 = {
          scale: model.scaleName(Y),
          field: model.field(Y, { suffix: '_end' })
        };
      } else {
        p.y2 = {
          scale: model.scaleName(Y),
          value: 0
        };
      }
    }

    applyColorAndOpacity(p, model);
    applyMarkConfig(p, model, ['interpolate', 'tension']);
    return p;
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}
