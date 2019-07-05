import {isNumber} from 'vega-util';
import {getViewConfigDiscreteStep} from '../../config';
import {getFirstDefined} from '../../util';
import {isVgRangeStep} from '../../vega.schema';
import {getMarkConfig} from '../common';
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
      ...mixins.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        orient: 'ignore',
        size: 'ignore'
      }),

      ...mixins.pointPosition('x', model, ref.mid(width), {vgChannel: 'xc'}),
      ...mixins.pointPosition('y', model, ref.mid(height), {vgChannel: 'yc'}),

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
  const {orient} = markDef;

  const vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
  const scale = model.getScaleComponent(orient === 'horizontal' ? 'x' : 'y');

  const markPropOrConfig = getFirstDefined(
    markDef[vgSizeChannel],
    markDef.size,
    getMarkConfig('size', markDef, config, {vgChannel: vgSizeChannel}),
    config.tick.bandSize
  );

  if (markPropOrConfig !== undefined) {
    return markPropOrConfig;
  } else {
    const scaleRange = scale ? scale.get('range') : undefined;
    if (scaleRange && isVgRangeStep(scaleRange) && isNumber(scaleRange.step)) {
      return (scaleRange.step * 3) / 4;
    }

    const defaultViewStep = getViewConfigDiscreteStep(config.view, vgSizeChannel);

    return (defaultViewStep * 3) / 4;
  }
}
