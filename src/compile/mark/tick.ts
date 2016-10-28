import {X, Y, SIZE} from '../../channel';
import {Config, Orient} from '../../config';
import {FieldDef} from '../../fielddef';
import {Scale} from '../../scale';
import {VgValueRef} from '../../vega.schema';

import {applyColorAndOpacity} from '../common';
import {UnitModel} from '../unit';
import * as ref from './valueref';

export namespace tick {
  export function markType() {
    return 'rect';
  }

  export function properties(model: UnitModel) {
    let p: any = {};
    const config = model.config();
    const stack = model.stack();

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

    p.xc = ref.stackable(X, model.encoding().x, model.scaleName(X), model.scale(X), stack, ref.midX(config));
    p.yc = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, ref.midY(config));

    if (config.mark.orient === Orient.HORIZONTAL) {
      p.width = size(model.encoding().size, model.scaleName(SIZE), model.scale(SIZE), config, (model.scale(X) || {}).bandSize);
      p.height = { value: config.mark.tickThickness };
    } else {
      p.width = { value: config.mark.tickThickness };
      p.height = size(model.encoding().size, model.scaleName(SIZE), model.scale(SIZE), config, (model.scale(Y) || {}).bandSize);
    }

    applyColorAndOpacity(p, model);
    return p;
  }

  function size(fieldDef: FieldDef, scaleName: string, scale: Scale, config: Config, scaleBandSize: number): VgValueRef {
    let defaultSize;
    if (config.mark.tickSize) {
      defaultSize = config.mark.tickSize;
    } else {
      const bandSize = scaleBandSize !== undefined ?
        scaleBandSize :
        config.scale.bandSize;
      defaultSize = bandSize / 1.5;
    }

    return ref.normal(SIZE, fieldDef, scaleName, scale, {value: defaultSize});
  }
}
