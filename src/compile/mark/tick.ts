import {getFirstDefined} from '../../util';
import {isVgRangeStep} from '../../vega.schema';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';

export const tick: MarkCompiler = {
  vgMark: 'rect',

  encodeEntry: (model: UnitModel) => {
    const {config, markDef, width, height} = model;
    const orient = markDef.orient;

    const vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
    const vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';

    return {
      ...mixins.baseEncodeEntry(model, {size: 'ignore', orient: 'ignore'}),

      ...mixins.pointPosition('x', model, ref.mid(width), 'xc'),
      ...mixins.pointPosition('y', model, ref.mid(height), 'yc'),

      // size / thickness => width / height
      ...mixins.nonPosition('size', model, {
        defaultValue: defaultSize(model),
        vgChannel: vgSizeChannel
      }),
      [vgThicknessChannel]: {value: getFirstDefined(markDef.thickness, config.tick.thickness)}
    };
  }
};

function defaultSize(model: UnitModel): number {
  const {config, markDef} = model;
  const orient = markDef.orient;
  const scale = model.getScaleComponent(orient === 'horizontal' ? 'x' : 'y');

  if (markDef.size !== undefined) {
    return markDef.size;
  } else if (config.tick.bandSize !== undefined) {
    return config.tick.bandSize;
  } else {
    const scaleRange = scale ? scale.get('range') : undefined;
    const rangeStep = scaleRange && isVgRangeStep(scaleRange) ? scaleRange.step : config.scale.rangeStep;
    if (typeof rangeStep !== 'number') {
      // FIXME consolidate this log
      throw new Error('Function does not handle non-numeric rangeStep');
    }
    return (rangeStep * 3) / 4;
  }
}
