import {Model} from './Model';
import {X, Y} from '../channel';
import {applyColorAndOpacity, applyMarkConfig} from './util';

export namespace area {
  export function markType() {
    return 'area';
  }

  export function properties(model: Model) {
    // TODO Use Vega's marks properties interface
    var p: any = {};

    const orient = model.config().mark.orient;
    if (orient !== undefined) {
      p.orient = { value: orient };
    }

    const stack = model.stack();
    // x
    if (stack && X === stack.fieldChannel) { // Stacked Measure
      p.x = {
        scale: model.scaleName(X),
        field: model.field(X, { suffix: '_start' })
      };
    } else if (model.isMeasure(X)) { // Measure
      p.x = { scale: model.scaleName(X), field: model.field(X) };
    } else if (model.isDimension(X)) {
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
    if (stack && Y === stack.fieldChannel) { // Stacked Measure
      p.y = {
        scale: model.scaleName(Y),
        field: model.field(Y, { suffix: '_start' })
      };
    } else if (model.isMeasure(Y)) {
      p.y = {
        scale: model.scaleName(Y),
        field: model.field(Y)
      };
    } else if (model.isDimension(Y)) {
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
