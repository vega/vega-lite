import {X, Y} from '../../channel';
import {Config} from '../../config';
import {isFieldDef} from '../../fielddef';
import * as log from '../../log';
import {isBinScale, Scale, ScaleType} from '../../scale';
import {StackProperties} from '../../stack';
import {VgEncodeEntry} from '../../vega.schema';

import {VgValueRef} from '../../vega.schema';
import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {MarkCompiler} from './base';
import * as ref from './valueref';

export const bar: MarkCompiler = {
  vgMark: 'rect',
  defaultRole: 'bar',
  encodeEntry: (model: UnitModel) => {
    const stack = model.stack;
    return {
      ...x(model, stack),
      ...y(model, stack),
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model)
    };
  }
};

function x(model: UnitModel, stack: StackProperties): VgEncodeEntry {
  const {config, width} = model;
  const orient = model.markDef.orient;
  const sizeDef = model.encoding.size;

  const xDef = model.encoding.x;
  const xScaleName = model.scaleName(X);
  const xScale = model.scale(X);
  // x, x2, and width -- we must specify two of these in all conditions
  if (orient === 'horizontal') {
    return {
      ...mixins.pointPosition('x', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin'),
    };
  } else { // vertical
    if (isFieldDef(xDef)) {
      if (!sizeDef && isBinScale(xScale.type)) {
        return mixins.binnedPosition('x', model, config.bar.binSpacing);
      } else if (xScale.type === ScaleType.BAND) {
        return mixins.bandPosition('x', model);
      }
    }
    // sized bin, normal point-ordinal axis, quantitative x-axis, or no x

    return mixins.centeredBandPosition('x', model,
      {...ref.midX(width, config)},
      defaultSizeRef(xScaleName, model.scale(X), config)
    );
  }
}

function y(model: UnitModel, stack: StackProperties) {
  const {config, encoding, height} = model;
  const orient = model.markDef.orient;
  const sizeDef = encoding.size;

  const yDef = encoding.y;
  const yScaleName = model.scaleName(Y);
  const yScale = model.scale(Y);
  // y, y2 & height -- we must specify two of these in all conditions
  if (orient === 'vertical') {
    return {
      ...mixins.pointPosition('y', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin'),
    };
  } else {
    if (isFieldDef(yDef)) {
      if (yDef.bin && !sizeDef) {
        return mixins.binnedPosition('y', model, config.bar.binSpacing);
      } else if (yScale.type === ScaleType.BAND) {
        return mixins.bandPosition('y', model);
      }
    }
    return mixins.centeredBandPosition('y', model, ref.midY(height, config), defaultSizeRef(yScaleName, model.scale(Y), config));
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

