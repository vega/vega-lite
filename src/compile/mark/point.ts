import {X, Y, SHAPE, SIZE} from '../../channel';
import {Config} from '../../config';
import {ChannelDefWithLegend, FieldDef, field} from '../../fielddef';
import {Scale} from '../../scale';
import {VgValueRef} from '../../vega.schema';

import {applyColorAndOpacity} from '../common';
import {UnitModel} from '../unit';

export namespace point {
  export function markType() {
    return 'symbol';
  }

  export function properties(model: UnitModel, fixedShape?: string) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const config = model.config();

    p.x = x(model.encoding().x, model.scaleName(X), config);

    p.y = y(model.encoding().y, model.scaleName(Y), config);

    p.size = size(model.encoding().size, model.scaleName(SIZE), model.scale(SIZE), config);

    p.shape = shape(model.encoding().shape, model.scaleName(SHAPE), model.scale(SHAPE), config, fixedShape);

    applyColorAndOpacity(p, model);
    return p;
  }

  function x(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
    // x
    if (fieldDef) {
      if (fieldDef.field) {
        return {
          scale: scaleName,
          field: field(fieldDef, { binSuffix: 'mid' })
        };
      }
      // TODO: fieldDef.value (for layering)
    }
    // TODO: allow this to fit
    return { value: config.scale.bandSize / 2 };
  }

  function y(fieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
    // y
    if (fieldDef) {
      if (fieldDef.field) {
        return {
          scale: scaleName,
          field: field(fieldDef, { binSuffix: 'mid' })
        };
      }
      // TODO: fieldDef.value (for layering)
    }
    // TODO: allow this to fit
    return { value: config.scale.bandSize / 2 };
  }

  function size(fieldDef: ChannelDefWithLegend, scaleName: string, scale: Scale, config: Config): VgValueRef {
    if (fieldDef) {
      if (fieldDef.field) {
        return {
          scale: scaleName,
          field: field(fieldDef, {scaleType: scale.type})
        };
      } else if (fieldDef.value !== undefined) {
        return { value: fieldDef.value };
      }
    }
    return { value: config.mark.size };
  }

  function shape(fieldDef: ChannelDefWithLegend, scaleName: string, scale: Scale, config: Config, fixedShape?: string): VgValueRef {
    // shape
    if (fixedShape) { // square and circle marks
      return { value: fixedShape };
    } else if (fieldDef) {
      if (fieldDef.field) {
        return {
          scale: scaleName,
          field: field(fieldDef, {scaleType: scale.type})
        };
      } else if (fieldDef.value) {
        return { value: fieldDef.value };
      }
    }
    return { value: config.mark.shape };
  }
}

export namespace circle {
  export function markType() {
    return 'symbol';
  }

  export function properties(model: UnitModel) {
    return point.properties(model, 'circle');
  }
}

export namespace square {
  export function markType() {
    return 'symbol';
  }

  export function properties(model: UnitModel) {
    return point.properties(model, 'square');
  }
}
