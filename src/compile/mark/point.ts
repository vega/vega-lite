import {X, Y, SHAPE, SIZE} from '../../channel';
import {Config} from '../../config';
import {ChannelDefWithLegend, FieldDef, field} from '../../fielddef';
import {StackProperties} from '../../stack';
import {VgValueRef} from '../../vega.schema';

import {applyColorAndOpacity} from '../common';
import {ScaleComponent} from '../scale';
import {UnitModel} from '../unit';

import {normalFieldRef, stackEndRef} from './mark-common';

export namespace point {
  export function markType() {
    return 'symbol';
  }

  export function properties(model: UnitModel, fixedShape?: string) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const config = model.config();
    const stack = model.stack();

    p.x = x(model.encoding().x, model.parsedScale(X), stack, config);

    p.y = y(model.encoding().y, model.parsedScale(Y), stack, config);

    p.size = size(model.encoding().size, model.parsedScale(SIZE), config);

    p.shape = shape(model.encoding().shape, model.parsedScale(SHAPE), config, fixedShape);

    applyColorAndOpacity(p, model);
    return p;
  }

  function x(fieldDef: FieldDef, scale: ScaleComponent, stack: StackProperties, config: Config): VgValueRef {
    // x
    if (fieldDef && stack && X === stack.fieldChannel) {
      return stackEndRef(fieldDef, scale);
    }
    return normalFieldRef(fieldDef, scale, X,
      // TODO: For fit-mode, use middle of the width
      config.scale.bandSize / 2
    );
  }

  function y(fieldDef: FieldDef, scale: ScaleComponent, stack: StackProperties, config: Config): VgValueRef {
    // y
    if (fieldDef && stack && Y === stack.fieldChannel) {
      return stackEndRef(fieldDef, scale);
    }

    return normalFieldRef(fieldDef, scale, Y,
      // TODO: For fit-mode, use middle of the width
      config.scale.bandSize / 2
    );
  }

  function size(fieldDef: ChannelDefWithLegend, scale: ScaleComponent, config: Config): VgValueRef {
    return normalFieldRef(fieldDef, scale, SIZE, config.mark.size);
  }

  function shape(fieldDef: ChannelDefWithLegend, scale: ScaleComponent, config: Config, fixedShape?: string): VgValueRef {
    // shape
    if (fixedShape) { // square and circle marks
      return { value: fixedShape };
    }
    return normalFieldRef(fieldDef, scale, SHAPE, config.mark.shape);
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
