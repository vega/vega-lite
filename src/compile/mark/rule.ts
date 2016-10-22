import {X, Y, SIZE} from '../../channel';
import {Config, Orient} from '../../config';
import {FieldDef, field} from '../../fielddef';

import {VgValueRef} from '../../vega.schema';

import {UnitModel} from '../unit';
import {applyColorAndOpacity} from '../common';

export namespace rule {
  export function markType() {
    return 'rule';
  }

  export function properties(model: UnitModel) {
    let p: any = {};
    const orient = model.config().mark.orient;
    const config = model.config();

    p.x = x(model.encoding().x, model.scaleName(X));
    p.y = y(model.encoding().y, model.scaleName(Y));

    if(orient === Orient.VERTICAL) {
      p.y2 = y2(model.encoding().y2, model.scaleName(Y));
    } else {
      p.x2 = x2(model.encoding().x2, model.scaleName(X));
    }

    // FIXME: this function would overwrite strokeWidth but shouldn't
    applyColorAndOpacity(p, model);

    p.strokeWidth = size(model.encoding().size, model.scaleName(SIZE), config);

    return p;
  }

  function x(fieldDef: FieldDef, scaleName: string): VgValueRef {
    if (fieldDef) {
      return {
        scale: scaleName,
        field: field(fieldDef, { binSuffix: 'mid' })
      };
    } else {
      return { value: 0 };
    }
  }

  function y(fieldDef: FieldDef, scaleName: string): VgValueRef {
    if (fieldDef) {
      return {
        scale: scaleName,
        field: field(fieldDef, { binSuffix: 'mid' })
      };
    } else {
      return {field: {group: 'height'}};
    }
  }

  function y2(fieldDef: FieldDef, scaleName: string): VgValueRef {
    if (fieldDef) {
      return {
        scale: scaleName,
        field: field(fieldDef, { binSuffix: 'mid' })
      };
    } else { // Default
      // TODO: log scale / zero = false?
      if (scaleName) {
        // If there is a scale, put y2 on the axis
        return {
          scale: scaleName,
          value: 0
        };
      }
      // Otherwise, put it on the axis
      return {value: 0};
    }
  }

  function x2(fieldDef: FieldDef, scaleName: string): VgValueRef {
    if (fieldDef) {
      return {
        scale: scaleName,
        field: field(fieldDef, { binSuffix: 'mid' })
      };
    } else { // Default
      // TODO: log scale / zero = false?
      if (scaleName) {
        // If there is a scale, put x2 on the axis
        return {
          scale: scaleName,
          value: 0
        };
      }
      return { field: { group: 'width' } };
    }
  }

  function size(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
    if (fieldDef) {
      if (fieldDef.field) {
        return {
          scale: scaleName,
          field: field(fieldDef) // TODO: what's the missing suffix
        };
      } else if (fieldDef.value) {
        return {value: fieldDef.value};
      }
    }

    return {value: config.mark.ruleSize};
  }
}
