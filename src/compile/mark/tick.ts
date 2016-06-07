import {X, Y, SIZE} from '../../channel';
import {FieldDef, field} from '../../fielddef';
import {Config} from '../../config';
import {VgValueRef} from '../../vega.schema';

import {UnitModel} from '../unit';
import {applyColorAndOpacity} from '../common';

export namespace tick {
  export function markType() {
    return 'rect';
  }

  export function properties(model: UnitModel) {
    let p: any = {};
    const config = model.config();

    // TODO: support explicit value

    p.xc = x(model.encoding().x, model.scaleName(X), config);

    p.yc = y(model.encoding().y, model.scaleName(Y), config);

    if (config.mark.orient === 'horizontal') {
      p.width = size(model.encoding().size, model.scaleName(SIZE), config, (model.scale(X) || {}).bandSize);
      p.height = { value: config.mark.tickThickness };
    } else {
      p.width = { value: config.mark.tickThickness };
      p.height = size(model.encoding().size, model.scaleName(SIZE), config, (model.scale(Y) || {}).bandSize);
    }

    applyColorAndOpacity(p, model);
    return p;
  }

  function x(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
    // x
    if (fieldDef) {
      if (fieldDef.field) {
        return {
          scale: scaleName,
          field: field(fieldDef, { binSuffix: '_mid' })
        };
      } else if (fieldDef.value) {
        return {value: fieldDef.value};
      }
    }
    return { value: config.scale.bandSize / 2 };
  }

  function y(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
    // y
    if (fieldDef) {
      if (fieldDef.field) {
        return {
          scale: scaleName,
          field: field(fieldDef, { binSuffix: '_mid' })
        };
      } else if (fieldDef.value) {
        return {value: fieldDef.value};
      }
    }
    return { value: config.scale.bandSize / 2 };
  }

  function size(fieldDef: FieldDef, scaleName: string, config: Config, scaleBandSize: number): VgValueRef {
    if (fieldDef) {
      if (fieldDef.field) {
        return {
          scale: scaleName,
          field: fieldDef.field
        };
      } else if (fieldDef.value !== undefined) {
        return { value: fieldDef.value };
      }
    }
    if (config.mark.tickSize) {
      return { value: config.mark.tickSize };
    }
    const bandSize = scaleBandSize !== undefined ?
      scaleBandSize :
      config.scale.bandSize;
    return { value: bandSize / 1.5 };
  }

  export function labels(model: UnitModel) {
    // TODO(#240): fill this method
    return undefined;
  }
}
