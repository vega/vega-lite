import {isNumber} from 'vega-util';
import {X, Y} from '../../channel';
import {Config} from '../../config';
import {isFieldDef} from '../../fielddef';
import * as log from '../../log';
import {hasDiscreteDomain, ScaleType} from '../../scale';
import {StackProperties} from '../../stack';
import {VgValueRef} from '../../vega.schema';
import {isVgRangeStep, VgEncodeEntry} from '../../vega.schema';
import {ScaleComponent} from '../scale/component';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';


export const bar: MarkCompiler = {
  vgMark: 'rect',
  encodeEntry: (model: UnitModel) => {
    const stack = model.stack;
    return {
      ...mixins.baseEncodeEntry(model, true),
      ...x(model, stack),
      ...y(model, stack),
    };
  }
};

function x(model: UnitModel, stack: StackProperties): VgEncodeEntry {
  const {config, width} = model;
  const orient = model.markDef.orient;
  const sizeDef = model.encoding.size;

  const xDef = model.encoding.x;
  const xScaleName = model.scaleName(X);
  const xScale = model.getScaleComponent(X);
  // x, x2, and width -- we must specify two of these in all conditions
  if (orient === 'horizontal') {
    return {
      ...mixins.pointPosition('x', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin'),
    };
  } else { // vertical
    if (isFieldDef(xDef)) {
      const xScaleType = xScale.get('type');
      if (xDef.bin && !sizeDef && !hasDiscreteDomain(xScaleType)) {
        return mixins.binnedPosition(
          xDef, 'x', model.scaleName('x'), config.bar.binSpacing, xScale.get('reverse')
        );
      } else {
        if (xScaleType === ScaleType.BAND) {
          return mixins.bandPosition(xDef, 'x', model);
        }
      }
    }
    // sized bin, normal point-ordinal axis, quantitative x-axis, or no x

    return mixins.centeredBandPosition('x', model,
      {...ref.mid(width)},
      defaultSizeRef(xScaleName, xScale, config)
    );
  }
}

function y(model: UnitModel, stack: StackProperties) {
  const {config, encoding, height} = model;
  const orient = model.markDef.orient;
  const sizeDef = encoding.size;

  const yDef = encoding.y;
  const yScaleName = model.scaleName(Y);
  const yScale = model.getScaleComponent(Y);
  // y, y2 & height -- we must specify two of these in all conditions
  if (orient === 'vertical') {
    return {
      ...mixins.pointPosition('y', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin'),
    };
  } else {
    if (isFieldDef(yDef)) {
      const yScaleType = yScale.get('type');
      if (yDef.bin && !sizeDef && !hasDiscreteDomain(yScaleType)) {
        return mixins.binnedPosition(
          yDef, 'y', model.scaleName('y'), config.bar.binSpacing, yScale.get('reverse')
        );
      } else if (yScaleType === ScaleType.BAND) {
        return mixins.bandPosition(yDef, 'y', model);
      }
    }
    return mixins.centeredBandPosition('y', model, ref.mid(height),
      defaultSizeRef(yScaleName, yScale, config)
    );
  }
}

function defaultSizeRef(scaleName: string, scale: ScaleComponent, config: Config): VgValueRef {
  if (config.bar.discreteBandSize) {
    return {value: config.bar.discreteBandSize};
  }

  if (scale) {
    const scaleType = scale.get('type');
    if (scaleType === ScaleType.POINT) {
      const scaleRange = scale.get('range');
      if (isVgRangeStep(scaleRange) && isNumber(scaleRange.step)) {
        return {value: scaleRange.step - 1};
      }
      log.warn(log.message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL);
    } else if (scaleType === ScaleType.BAND) {
      return ref.bandRef(scaleName);
    } else { // non-ordinal scale
      return {value: config.bar.continuousBandSize};
    }
  }
  if (config.scale.rangeStep && config.scale.rangeStep !== null) {
    return {value: config.scale.rangeStep - 1};
  }
  return {value: 20};
}

