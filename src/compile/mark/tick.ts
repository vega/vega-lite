import {isNumber} from 'vega-util';
import {getViewConfigDiscreteStep} from '../../config';
import {isVgRangeStep, VgValueRef} from '../../vega.schema';
import {exprFromSignalRefOrValue, getMarkPropOrConfig, signalOrValueRef} from '../common';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as encode from './encode';

export const tick: MarkCompiler = {
  vgMark: 'rect',

  encodeEntry: (model: UnitModel) => {
    const {config, markDef} = model;
    const orient = markDef.orient;

    const vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
    const vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';

    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        orient: 'ignore',
        size: 'ignore',
        theta: 'ignore'
      }),

      ...encode.pointPosition('x', model, {defaultPos: 'mid', vgChannel: 'xc'}),
      ...encode.pointPosition('y', model, {defaultPos: 'mid', vgChannel: 'yc'}),

      // size / thickness => width / height
      ...encode.nonPosition('size', model, {
        defaultRef: defaultSize(model),
        vgChannel: vgSizeChannel
      }),
      [vgThicknessChannel]: signalOrValueRef(getMarkPropOrConfig('thickness', markDef, config))
    };
  }
};

function defaultSize(model: UnitModel): VgValueRef {
  const {config, markDef} = model;
  const {orient} = markDef;

  const vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
  const positionChannel = orient === 'horizontal' ? 'x' : 'y';
  const scale = model.getScaleComponent(positionChannel);

  const markPropOrConfig =
    getMarkPropOrConfig('size', markDef, config, {vgChannel: vgSizeChannel}) ?? config.tick.bandSize;

  if (markPropOrConfig !== undefined) {
    return signalOrValueRef(markPropOrConfig);
  } else if (scale?.get('type') === 'band') {
    return {scale: model.scaleName(positionChannel), band: 1};
  }

  const scaleRange = scale?.get('range');
  const {tickBandPaddingInner} = config.scale;

  const step =
    scaleRange && isVgRangeStep(scaleRange) ? scaleRange.step : getViewConfigDiscreteStep(config.view, vgSizeChannel);

  if (isNumber(step) && isNumber(tickBandPaddingInner)) {
    return {value: step * (1 - tickBandPaddingInner)};
  } else {
    return {signal: `${exprFromSignalRefOrValue(tickBandPaddingInner)} * ${exprFromSignalRefOrValue(step)}`};
  }
}
