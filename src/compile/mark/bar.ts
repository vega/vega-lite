import {isNumber} from 'vega-util';
import {X, Y} from '../../channel';
import {Config} from '../../config';
import {isFieldDef} from '../../fielddef';
import * as log from '../../log';
import {MarkDef} from '../../mark';
import {hasDiscreteDomain, ScaleType} from '../../scale';
import {isVgRangeStep, VgEncodeEntry} from '../../vega.schema';
import {VgValueRef} from '../../vega.schema';
import {ScaleComponent} from '../scale/component';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';


export const bar: MarkCompiler = {
  vgMark: 'rect',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.baseEncodeEntry(model, {size: 'ignore', orient: 'ignore'}),
      ...x(model),
      ...y(model),
    };
  }
};

function x(model: UnitModel): VgEncodeEntry {
  const {config, encoding, markDef, width} = model;
  const orient = markDef.orient;
  const sizeDef = encoding.size;

  const xDef = encoding.x;
  const x2Def = encoding.x2;
  const xScaleName = model.scaleName(X);
  const xScale = model.getScaleComponent(X);
  // x, x2, and width -- we must specify two of these in all conditions
  if (orient === 'horizontal' || x2Def) {
    return {
      ...mixins.pointPosition('x', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin', 'x2'),
    };
  } else { // vertical
    if (isFieldDef(xDef)) {
      const xScaleType = xScale.get('type');
      if (xDef.bin && !sizeDef && !hasDiscreteDomain(xScaleType)) {
        return mixins.binnedPosition(
          xDef, 'x', model.scaleName('x'), markDef.binSpacing === undefined ? config.bar.binSpacing : markDef.binSpacing,
          xScale.get('reverse')
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
      defaultSizeRef(markDef, xScaleName, xScale, config)
    );
  }
}

function y(model: UnitModel) {
  const {config, encoding, height, markDef} = model;
  const orient = markDef.orient;
  const sizeDef = encoding.size;

  const yDef = encoding.y;
  const y2Def = encoding.y2;
  const yScaleName = model.scaleName(Y);
  const yScale = model.getScaleComponent(Y);

  // y, y2 & height -- we must specify two of these in all conditions
  if (orient === 'vertical' || y2Def) {
    return {
      ...mixins.pointPosition('y', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin', 'y2'),
    };
  } else {
    if (isFieldDef(yDef)) {
      const yScaleType = yScale.get('type');
      if (yDef.bin && !sizeDef && !hasDiscreteDomain(yScaleType)) {
        return mixins.binnedPosition(
          yDef, 'y', model.scaleName('y'),
          markDef.binSpacing === undefined ? config.bar.binSpacing : markDef.binSpacing,
          yScale.get('reverse')
        );
      } else if (yScaleType === ScaleType.BAND) {
        return mixins.bandPosition(yDef, 'y', model);
      }
    }
    return mixins.centeredBandPosition('y', model, ref.mid(height),
      defaultSizeRef(markDef, yScaleName, yScale, config)
    );
  }
}

function defaultSizeRef(markDef: MarkDef, scaleName: string, scale: ScaleComponent, config: Config): VgValueRef {
  if (markDef.size !== undefined) {
    return {value: markDef.size};
  } else if (config.bar.discreteBandSize) {
    return {value: config.bar.discreteBandSize};
  } else if (scale) {
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
  } else if (config.scale.rangeStep && config.scale.rangeStep !== null) {
    return {value: config.scale.rangeStep - 1};
  }
  return {value: 20};
}

