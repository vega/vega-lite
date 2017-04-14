

import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {MarkCompiler} from './base';
import * as ref from './valueref';

export const tick: MarkCompiler = {
  vgMark: 'rect',
  defaultRole: 'tick',

  encodeEntry: (model: UnitModel) => {
    const {config, markDef, width, height} = model;
    const orient = markDef.orient;

    const vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
    const vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';

    return {
      ...mixins.pointPosition('x', model, ref.midX(width, config), 'xc'),
      ...mixins.pointPosition('y', model, ref.midY(height, config), 'yc'),

      // size / thickness => width / height
      ...mixins.nonPosition('size', model, {
        defaultValue: defaultSize(model),
        vgChannel: vgSizeChannel
      }),
      [vgThicknessChannel]: {value: config.tick.thickness},

      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
    };
  }
};

function defaultSize(model: UnitModel): number {
  const {config} = model;
  const orient = model.markDef.orient;

  const scaleRangeStep: number | null = (model.scale(orient === 'horizontal' ? 'x' : 'y') || {}).rangeStep;

  if (config.tick.bandSize !== undefined) {
    return config.tick.bandSize;
  } else {
    const rangeStep = scaleRangeStep !== undefined ?
      scaleRangeStep :
      config.scale.rangeStep;
    if (typeof rangeStep !== 'number') {
      // FIXME consolidate this log
      throw new Error('Function does not handle non-numeric rangeStep');
    }
    return rangeStep / 1.5;
  }
}
