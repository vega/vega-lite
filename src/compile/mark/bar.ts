import {isNumber} from 'vega-util';
import {isBinned, isBinning} from '../../bin';
import {X, Y} from '../../channel';
import {Config} from '../../config';
import {isFieldDef} from '../../fielddef';
import * as log from '../../log';
import {MarkDef} from '../../mark';
import {hasDiscreteDomain, ScaleType} from '../../scale';
import {getFirstDefined} from '../../util';
import {isVgRangeStep, VgEncodeEntry, VgValueRef} from '../../vega.schema';
import {getMarkConfig} from '../common';
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
      ...y(model)
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
  if (isFieldDef(xDef) && isBinned(xDef.bin)) {
    return mixins.binPosition(
      xDef,
      x2Def,
      X,
      xScaleName,
      getFirstDefined(markDef.binSpacing, config.bar.binSpacing),
      xScale.get('reverse')
    );
  } else if (orient === 'horizontal' || x2Def) {
    return {
      ...mixins.pointPosition('x', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin', 'x2')
    };
  } else {
    // vertical
    if (isFieldDef(xDef)) {
      const xScaleType = xScale.get('type');
      if (isBinning(xDef.bin) && !sizeDef && !hasDiscreteDomain(xScaleType)) {
        return mixins.binPosition(
          xDef,
          undefined,
          X,
          model.scaleName('x'),
          getFirstDefined(markDef.binSpacing, config.bar.binSpacing),
          xScale.get('reverse')
        );
      } else {
        if (xScaleType === ScaleType.BAND) {
          return mixins.bandPosition(xDef, 'x', model);
        }
      }
    }
    // sized bin, normal point-ordinal axis, quantitative x-axis, or no x

    return mixins.centeredBandPosition(
      'x',
      model,
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
  if (isFieldDef(yDef) && isBinned(yDef.bin)) {
    return mixins.binPosition(
      yDef,
      y2Def,
      Y,
      yScaleName,
      getFirstDefined(markDef.binSpacing, config.bar.binSpacing),
      yScale.get('reverse')
    );
  } else if (orient === 'vertical' || y2Def) {
    return {
      ...mixins.pointPosition('y', model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin', 'y2')
    };
  } else {
    if (isFieldDef(yDef)) {
      const yScaleType = yScale.get('type');
      if (isBinning(yDef.bin) && !sizeDef && !hasDiscreteDomain(yScaleType)) {
        return mixins.binPosition(
          yDef,
          undefined,
          Y,
          model.scaleName('y'),
          getFirstDefined(markDef.binSpacing, config.bar.binSpacing),
          yScale.get('reverse')
        );
      } else if (yScaleType === ScaleType.BAND) {
        return mixins.bandPosition(yDef, 'y', model);
      }
    }
    return mixins.centeredBandPosition(
      'y',
      model,
      ref.mid(height),
      defaultSizeRef(markDef, yScaleName, yScale, config)
    );
  }
}

function defaultSizeRef(markDef: MarkDef, scaleName: string, scale: ScaleComponent, config: Config): VgValueRef {
  if (markDef.size !== undefined) {
    return {value: markDef.size};
  }
  const sizeConfig = getMarkConfig('size', markDef, config, {
    // config.mark.size shouldn't affect bar size
    skipGeneralMarkConfig: true
  });

  if (sizeConfig !== undefined) {
    return {value: sizeConfig};
  }

  if (scale) {
    const scaleType = scale.get('type');
    if (scaleType === 'point' || scaleType === 'band') {
      if (config.bar.discreteBandSize !== undefined) {
        return {value: config.bar.discreteBandSize};
      }
      if (scaleType === ScaleType.POINT) {
        const scaleRange = scale.get('range');
        if (isVgRangeStep(scaleRange) && isNumber(scaleRange.step)) {
          return {value: scaleRange.step - 1};
        }
        log.warn(log.message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL);
      } else {
        // BAND
        return ref.bandRef(scaleName);
      }
    } else {
      // continuous scale
      return {value: config.bar.continuousBandSize};
    }
  }
  // No Scale
  const value = getFirstDefined(
    // No scale is like discrete bar (with one item)
    config.bar.discreteBandSize,
    config.scale.rangeStep ? config.scale.rangeStep - 1 : undefined,
    // If somehow default rangeStep is set to null or undefined, use 20 as back up
    20
  );
  return {value};
}
