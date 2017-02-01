import {X, Y, SIZE} from '../../channel';
import {Config} from '../../config';
import {FieldDef} from '../../fielddef';
import {Scale} from '../../scale';
import {VgEncodeEntry, VgValueRef} from '../../vega.schema';

import {applyColorAndOpacity} from './common';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';
import * as ref from './valueref';

export const tick: MarkCompiler = {
  vgMark: 'rect',
  role: 'tick',

  encodeEntry: (model: UnitModel) => {
    let e: VgEncodeEntry = {};
    const config = model.config();
    const stack = model.stack();

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

    e.xc = ref.stackable(X, model.encoding().x, model.scaleName(X), model.scale(X), stack, ref.midX(config));
    e.yc = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, ref.midY(config));

    if (config.mark.orient === 'horizontal') {
      e.width = size(model.encoding().size, model.scaleName(SIZE), model.scale(SIZE), config, (model.scale(X) || {}).rangeStep);
      e.height = { value: config.tick.thickness };
    } else {
      e.width = { value: config.tick.thickness };
      e.height = size(model.encoding().size, model.scaleName(SIZE), model.scale(SIZE), config, (model.scale(Y) || {}).rangeStep);
    }

    applyColorAndOpacity(e, model);
    return e;
  }
};

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
