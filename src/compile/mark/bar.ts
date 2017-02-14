import {X, Y, X2, Y2, SIZE} from '../../channel';
import {Config} from '../../config';
import {isFieldDef} from '../../fielddef';
import {Scale, ScaleType} from '../../scale';
import {StackProperties} from '../../stack';
import {extend} from '../../util';
import * as log from '../../log';
import {VgEncodeEntry} from '../../vega.schema';

import {applyColor} from './common';
import {UnitModel} from '../unit';
import {VgValueRef} from '../../vega.schema';

import {MarkCompiler} from './base';
import * as ref from './valueref';

export const bar: MarkCompiler = {
  vgMark: 'rect',
  role: 'bar',
  encodeEntry: (model: UnitModel) => {
    const stack = model.stack;
    let e: VgEncodeEntry = extend(
      x(model, stack),
      y(model, stack)
    );
    applyColor(e, model);
    ref.midPoint('opacity', model.encoding.opacity, model.scaleName('opacity'), model.scale('opacity'), model.config.mark.opacity && {value: model.config.mark.opacity});
    return e;
  }
};

function x(model: UnitModel, stack: StackProperties) {
  let e: VgEncodeEntry = {};
  const {config, encoding} = model;
  const orient = model.config.mark.orient;
  const sizeDef = model.encoding.size;

  const xDef = model.encoding.x;
  const xScaleName = model.scaleName(X);
  const xScale = model.scale(X);
  // x, x2, and width -- we must specify two of these in all conditions
  if (orient === 'horizontal') {
    e.x = ref.stackable(X, xDef, xScaleName, model.scale(X), stack, 'base');
    e.x2 = ref.stackable2(X2, xDef, encoding.x2, xScaleName, model.scale(X), stack, 'base');
    return e;
  } else { // vertical
    if (isFieldDef(xDef)) {
      if (xDef.bin && !sizeDef) {
        // TODO: check scale type = linear

        e.x2 = ref.bin(xDef, xScaleName, 'start', config.bar.binSpacing);
        e.x = ref.bin(xDef, xScaleName, 'end');
        return e;
      } else if (xScale.type === ScaleType.BAND) {
        // TODO: band scale doesn't support size yet
        e.x = ref.fieldRef(xDef, xScaleName, {});
        e.width = ref.band(xScaleName);
        return e;
      }
    }
    // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
    e.xc = ref.midPoint(X, xDef, xScaleName, model.scale(X),
      extend(ref.midX(config), {offset: 1}) // TODO: config.singleBarOffset
    );
    e.width = ref.midPoint(SIZE, encoding.size, model.scaleName(SIZE), model.scale(SIZE),
      defaultSizeRef(xScaleName, model.scale(X), config)
    );
    return e;
  }
}

function y(model: UnitModel, stack: StackProperties) {
  let e: VgEncodeEntry = {};
  const {config, encoding} = model;
  const orient = model.config.mark.orient;
  const sizeDef = encoding.size;

  const yDef = encoding.y;
  const yScaleName = model.scaleName(Y);
  const yScale = model.scale(Y);
  // y, y2 & height -- we must specify two of these in all conditions
  if (orient === 'vertical') {
    e.y = ref.stackable(Y, yDef, yScaleName, model.scale(Y), stack, 'base');
    e.y2 = ref.stackable2(Y2, yDef, encoding.y2, yScaleName, model.scale(Y), stack, 'base');
    return e;
  } else {
    if (isFieldDef(yDef)) {
      if (yDef.bin && !sizeDef) {
        e.y2 = ref.bin(yDef, yScaleName, 'start');
        e.y = ref.bin(yDef, yScaleName, 'end', config.bar.binSpacing);
        return e;
      } else if (yScale.type === ScaleType.BAND) {
        // TODO: band scale doesn't support size yet
        e.y = ref.fieldRef(yDef, yScaleName, {});
        e.height = ref.band(yScaleName);
        return e;
      }
    }
    e.yc = ref.midPoint(Y, yDef, yScaleName, model.scale(Y),
      ref.midY(config)
    );
    e.height = ref.midPoint(SIZE, encoding.size, model.scaleName(SIZE), model.scale(SIZE),
      defaultSizeRef(yScaleName, model.scale(Y), config)
    );
    return e;
  }
}

function defaultSizeRef(scaleName: string, scale: Scale, config: Config): VgValueRef {
  if (config.bar.discreteBandSize) {
    return {value: config.bar.discreteBandSize};
  }

  if (scale) {
    if (scale.type === ScaleType.POINT) {
      if (scale.rangeStep !== null) {
        return {value: scale.rangeStep - 1};
      }
      log.warn(log.message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL);
    } else if (scale.type === ScaleType.BAND) {
      return ref.band(scaleName);
    } else { // non-ordinal scale
      return {value: config.bar.continuousBandSize};
    }
  }
  if (config.scale.rangeStep && config.scale.rangeStep !== null) {
    return {value: config.scale.rangeStep - 1};
  }
  // TODO: this should depends on cell's width / height?
  return {value: 20};
}

