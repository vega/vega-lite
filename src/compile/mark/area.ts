import {UnitModel} from '../unit';
import {X, Y} from '../../channel';
import {isDimension, isMeasure, FieldDef, field} from '../../fielddef';
import {VgValueRef} from '../../vega.schema';

import {applyColorAndOpacity, applyMarkConfig} from '../common';
import {StackProperties} from '../stack';

export namespace area {
  export function markType() {
    return 'area';
  }

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const config = model.config();

    const _orient = orient(config.mark.orient);
    if (_orient) { p.orient = _orient; }

    p.x = x(model.encoding().x, model.scaleName(X), model.stack());

    const _x2 = x2(model.encoding().x, model.scaleName(X), model.stack(), config.mark.orient);
    if (_x2) { p.x2 = _x2; }

    p.y = y(model.encoding().y, model.scaleName(Y), model.stack());

    const _y2 = y2(model.encoding().y, model.scaleName(Y), model.stack(), config.mark.orient);
    if (_y2) { p.y2 = _y2; }

    applyColorAndOpacity(p, model);
    applyMarkConfig(p, model, ['interpolate', 'tension']);
    return p;
  }

  function orient(orient: string): VgValueRef {
    if (orient) {
      return { value: orient };
    }
    return undefined;
  }

  function x(fieldDef: FieldDef, scaleName: string, stack: StackProperties): VgValueRef {
    // x
    if (stack && X === stack.fieldChannel) { // Stacked Measure
      return {
        scale: scaleName,
        field: field(fieldDef, { suffix: '_start' })
      };
    } else if (isMeasure(fieldDef)) { // Measure
      return { scale: scaleName, field: field(fieldDef) };
    } else if (isDimension(fieldDef)) {
      return {
        scale: scaleName,
        field: field(fieldDef, { binSuffix: '_mid' })
      };
    }
    return undefined;
  }

  function x2(fieldDef: FieldDef, scaleName: string, stack: StackProperties, orient: string): VgValueRef {
    // x2
    if (orient === 'horizontal') {
      if (stack && X === stack.fieldChannel) {
        return {
          scale: scaleName,
          field: field(fieldDef, { suffix: '_end' })
        };
      } else {
        return {
          scale: scaleName,
          value: 0
        };
      }
    }
    return undefined;
  }

  function y(fieldDef: FieldDef, scaleName: string, stack: StackProperties): VgValueRef {
    // y
    if (stack && Y === stack.fieldChannel) { // Stacked Measure
      return {
        scale: scaleName,
        field: field(fieldDef, { suffix: '_start' })
      };
    } else if (isMeasure(fieldDef)) {
      return {
        scale: scaleName,
        field: field(fieldDef)
      };
    } else if (isDimension(fieldDef)) {
      return {
        scale: scaleName,
        field: field(fieldDef, { binSuffix: '_mid' })
      };
    }
    return undefined;
  }

  function y2(fieldDef: FieldDef, scaleName: string, stack: StackProperties, orient: string): VgValueRef {
    if (orient !== 'horizontal') { // 'vertical' or undefined are vertical
      if (stack && Y === stack.fieldChannel) {
        return {
          scale: scaleName,
          field: field(fieldDef, { suffix: '_end' })
        };
      } else {
        return {
          scale: scaleName,
          value: 0
        };
      }
    }
    return undefined;
  }

  export function labels(model: UnitModel) {
    // TODO(#240): fill this method
    return undefined;
  }
}
