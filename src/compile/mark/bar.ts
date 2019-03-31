import {isNumber} from 'vega-util';
import {isBinned, isBinning} from '../../bin';
import {isFieldDef} from '../../channeldef';
import {Config} from '../../config';
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
      ...barPosition(model, 'x'),
      ...barPosition(model, 'y')
    };
  }
};

function barPosition(model: UnitModel, channel: 'x' | 'y'): VgEncodeEntry {
  const {config, encoding, markDef} = model;
  const orient = markDef.orient;
  const sizeDef = encoding.size;

  const isBarLength = channel === 'x' ? orient === 'horizontal' : orient === 'vertical';

  const channel2 = channel === 'x' ? 'x2' : 'y2';

  const fieldDef = encoding[channel];
  const fieldDef2 = encoding[channel2];
  const scaleName = model.scaleName(channel);
  const scale = model.getScaleComponent(channel);
  const spacing = getFirstDefined(markDef.binSpacing, config.bar.binSpacing);
  const reverse = scale ? scale.get('reverse') : undefined;
  const mark = 'bar';

  // x, x2, and width -- we must specify two of these in all conditions
  if (isFieldDef(fieldDef) && isBinned(fieldDef.bin)) {
    return mixins.binPosition({fieldDef, fieldDef2, channel, mark, scaleName, spacing, reverse});
  } else if (isBarLength || fieldDef2) {
    return {
      ...mixins.pointPosition(channel, model, 'zeroOrMin'),
      ...mixins.pointPosition2(model, 'zeroOrMin', channel2)
    };
  } else {
    const sizeChannel = channel === 'x' ? 'width' : 'height';

    // vertical
    if (isFieldDef(fieldDef)) {
      const scaleType = scale.get('type');
      if (isBinning(fieldDef.bin) && !sizeDef && !hasDiscreteDomain(scaleType)) {
        return mixins.binPosition({fieldDef, channel, scaleName, mark, spacing, reverse});
      } else {
        if (scaleType === ScaleType.BAND) {
          return mixins.bandPosition(
            fieldDef,
            channel,
            model,
            defaultSizeRef(markDef, sizeChannel, scaleName, scale, config)
          );
        }
      }
    }

    // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
    return mixins.centeredPointPositionWithSize(
      channel,
      model,
      ref.mid(model[sizeChannel]),
      defaultSizeRef(markDef, sizeChannel, scaleName, scale, config)
    );
  }
}

function defaultSizeRef(
  markDef: MarkDef,
  sizeChannel: 'width' | 'height',
  scaleName: string,
  scale: ScaleComponent,
  config: Config
): VgValueRef {
  const markPropOrConfig = getFirstDefined(
    markDef[sizeChannel],
    markDef.size,
    getMarkConfig('size', markDef, config, {vgChannel: sizeChannel})
  );

  if (markPropOrConfig !== undefined) {
    return {value: markPropOrConfig};
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
