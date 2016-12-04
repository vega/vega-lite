import {X, Y, SIZE} from '../../channel';
import {Config} from '../../config';
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

    if (config.mark.orient === 'horizontal') {
      p.width = size(model.encoding().size, model.scaleName(SIZE), model.scale(SIZE), config, (model.scale(X) || {}).rangeStep);
      p.height = { value: config.tick.thickness };
    } else {
      p.width = { value: config.tick.thickness };
      p.height = size(model.encoding().size, model.scaleName(SIZE), model.scale(SIZE), config, (model.scale(Y) || {}).rangeStep);
    }

    applyColorAndOpacity(p, model);
    return p;
  }

  function size(fieldDef: FieldDef, scaleName: string, scale: Scale, config: Config, scaleRangeStep: number | null): VgValueRef {
    let defaultSize: number;
    if (config.tick.bandSize !== undefined) {
      defaultSize = config.tick.bandSize;
    } else {
      const rangeStep = scaleRangeStep !== undefined ?
        scaleRangeStep :
        config.scale.rangeStep;
      if (typeof rangeStep !== 'number') {
        // FIXME consolidate this log
        throw new Error('Function does not handle non-numeric rangeStep');
      }
      defaultSize = rangeStep / 1.5;
    }

    return ref.midPoint(SIZE, fieldDef, scaleName, scale, {value: defaultSize});
  }
}
