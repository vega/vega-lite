import {VgValueRef} from '../../vega.schema';

import {X, Y} from '../../channel';
import {isDimension, isMeasure, FieldDef, field} from '../../fielddef';
import {StackProperties} from '../../stack';

import {applyColorAndOpacity, applyMarkConfig} from '../common';
import {UnitModel} from '../unit';

export namespace area {
  export function markType() {
    return 'area';
  }

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const config = model.config();

    const orient = config.mark.orient;
    if (orient) {
      p.orient = { value: orient} ;
    }

    const stack = model.stack();
    const _x = x(model.encoding().x, model.scaleName(X), orient, stack);
    if (_x) {
      p.x = _x;
    }

    const _y = y(model.encoding().y, model.scaleName(Y), orient, stack);
    if (_y) {
      p.y = _y;
    }

    const _x2 = x2(model.encoding().x, model.encoding().x2, model.scaleName(X), orient, stack);
    if (_x2) {
      p.x2 = _x2;
    }

    const _y2 = y2(model.encoding().y, model.encoding().y2, model.scaleName(Y), orient, stack);
    if (_y2) {
      p.y2 = _y2;
    }

    applyColorAndOpacity(p, model);
    applyMarkConfig(p, model, ['interpolate', 'tension']);
    return p;
  }

  export function x(fieldDef: FieldDef, scaleName: string, orient: string, stack: StackProperties): VgValueRef {
    if (stack && X === stack.fieldChannel) { // Stacked Measure
      return {
        scale: scaleName,
        field: field(fieldDef, { suffix: '_start' })
      };
    } else if (isMeasure(fieldDef)) { // Measure
      if (orient === 'horizontal') {
        // x
        if (fieldDef && fieldDef.field) {
          return {
            scale: scaleName,
            field: field(fieldDef)
          };
        } else {
          return {
            scale: scaleName,
            value: 0
          };
        }
      } else {
        return {
          scale: scaleName,
          field: field(fieldDef)
        };
      }
    } else if (isDimension(fieldDef)) {
      return {
        scale: scaleName,
        field: field(fieldDef, { binSuffix: '_mid' })
      };
    }
    return undefined;
  }

  export function x2(xFieldDef: FieldDef, x2FieldDef: FieldDef, scaleName: string, orient: string, stack: StackProperties): VgValueRef {
    // x
    if (stack && X === stack.fieldChannel) { // Stacked Measure
      if (orient === 'horizontal') {
        return {
          scale: scaleName,
          field: field(xFieldDef, { suffix: '_end' })
        };
      }
    } else if (isMeasure(x2FieldDef)) { // Measure
      if (orient === 'horizontal') {
        if (x2FieldDef && x2FieldDef.field) {
          return {
            scale: scaleName,
            field: field(x2FieldDef)
          };
        } else {
          return {
            scale: scaleName,
            value: 0
          };
        }
      }
    }
    return undefined;
  }

  export function y(fieldDef: FieldDef, scaleName: string, orient: string, stack: StackProperties): VgValueRef {
    if (stack && Y === stack.fieldChannel) { // Stacked Measure
      return {
        scale: scaleName,
        field: field(fieldDef, { suffix: '_start' })
      };
    } else if (isMeasure(fieldDef)) {
      if (orient !== 'horizontal') {
        // y
        if (fieldDef && fieldDef.field) {
          return {
            scale: scaleName,
            field: field(fieldDef)
          };
        } else {
          return { field: { group: 'height' } };
        }
      } else {
        return {
          scale: scaleName,
          field: field(fieldDef)
        };
      }
    } else if (isDimension(fieldDef)) {
      return {
        scale: scaleName,
        field: field(fieldDef, { binSuffix: '_mid' })
      };
    }
    return undefined;
  }

  export function y2(yFieldDef: FieldDef, y2FieldDef: FieldDef, scaleName: string, orient: string, stack: StackProperties): VgValueRef {
    if (stack && Y === stack.fieldChannel) { // Stacked Measure
      if (orient !== 'horizontal') {
        return {
          scale: scaleName,
          field: field(yFieldDef, { suffix: '_end' })
        };
      }
    } else if (isMeasure(yFieldDef)) {
      if (orient !== 'horizontal') {
        // y2
        if (y2FieldDef && y2FieldDef.field) {
          return {
            scale: scaleName,
            field: field(y2FieldDef)
          };
        } else {
          return {
            scale: scaleName,
            value: 0
          };
        }
      }
    }
    return undefined;
  }


  export function labels(model: UnitModel) {
    // TODO(#240): fill this method
    return undefined;
  }
}
