import {X, Y, SHAPE, SIZE} from '../../channel';
import {Config} from '../../config';
import {ChannelDefWithLegend} from '../../fielddef';
import {Scale} from '../../scale';
import {VgValueRef} from '../../vega.schema';

import {applyColorAndOpacity} from '../common';
import {UnitModel} from '../unit';
import * as ref from './valueref';

export namespace point {
  export function markType() {
    return 'symbol';
  }

  export function properties(model: UnitModel, fixedShape?: string) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const config = model.config();
    const stack = model.stack();

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

    p.x = ref.stackable(X, model.encoding().x, model.scaleName(X), model.scale(X), stack, ref.midX(config));
    p.y = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, ref.midY(config));

    p.size = ref.midPoint(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
       {value: config.mark.size}
    );

    p.shape = shape(model.encoding().shape, model.scaleName(SHAPE), model.scale(SHAPE), config, fixedShape);

    applyColorAndOpacity(p, model);
    return p;
  }

  function shape(fieldDef: ChannelDefWithLegend, scaleName: string, scale: Scale, config: Config, fixedShape?: string): VgValueRef {
    // shape
    if (fixedShape) { // square and circle marks
      return { value: fixedShape };
    }
    return ref.midPoint(SHAPE, fieldDef, scaleName, scale, {value: config.mark.shape});
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
