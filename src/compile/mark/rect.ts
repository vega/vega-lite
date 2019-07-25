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

export const rect: MarkCompiler = {
  vgMark: 'rect',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.baseEncodeEntry(model, {size: 'ignore', orient: 'ignore'}),
      ...rectPosition(model, 'x', 'rect'),
      ...rectPosition(model, 'y', 'rect')
    };
  }
};

export function rectPosition(model: UnitModel, channel: 'x' | 'y', mark: 'bar' | 'rect'): VgEncodeEntry {
  const {config, encoding, markDef} = model;

  const channel2 = channel === 'x' ? 'x2' : 'y2';
  const sizeChannel = channel === 'x' ? 'width' : 'height';
  const fieldDef = encoding[channel];
  const fieldDef2 = encoding[channel2];

  const scale = model.getScaleComponent(channel);
  const scaleType = scale ? scale.get('type') : undefined;
  const scaleName = model.scaleName(channel);

  const orient = markDef.orient;
  const hasSizeDef =
    encoding[sizeChannel] ||
    encoding.size ||
    markDef[sizeChannel] ||
    markDef.size ||
    getMarkConfig('size', markDef, config, {vgChannel: sizeChannel});

  const isBarBand = channel === 'x' ? orient === 'vertical' : orient === 'horizontal';

  // x, x2, and width -- we must specify two of these in all conditions
  if (
    isFieldDef(fieldDef) &&
    (isBinning(fieldDef.bin) || isBinned(fieldDef.bin)) &&
    !hasSizeDef &&
    !hasDiscreteDomain(scaleType)
  ) {
    return mixins.binPosition({
      fieldDef,
      fieldDef2,
      channel,
      mark,
      scaleName,
      spacing: getFirstDefined(markDef.binSpacing, config[mark].binSpacing),
      reverse: scale.get('reverse')
    });
  } else if (((isFieldDef(fieldDef) && hasDiscreteDomain(scaleType)) || isBarBand) && !fieldDef2) {
    // vertical
    if (isFieldDef(fieldDef) && scaleType === ScaleType.BAND) {
      return mixins.bandPosition(
        fieldDef,
        channel,
        model,
        defaultSizeRef(mark, markDef, sizeChannel, scaleName, scale, config)
      );
    }

    // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
    return mixins.centeredPointPositionWithSize(
      channel,
      model,
      ref.mid(model[sizeChannel]),
      defaultSizeRef(mark, markDef, sizeChannel, scaleName, scale, config)
    );
  } else {
    return {
      ...mixins.pointPosition(channel, model, 'zeroOrMax'),
      ...mixins.pointPosition2(model, 'zeroOrMin', channel2)
    };
  }
}

function defaultSizeRef(
  mark: 'bar' | 'rect',
  markDef: MarkDef,
  sizeChannel: 'width' | 'height',
  scaleName: string,
  scale: ScaleComponent,
  config: Config
): VgValueRef {
  const markPropOrConfig = getFirstDefined(
    markDef[sizeChannel],
    markDef.size,
    // TODO: deal with sizeChannel config
    getMarkConfig('size', markDef, config, {vgChannel: sizeChannel})
  );

  if (markPropOrConfig !== undefined) {
    return {value: markPropOrConfig};
  }

  if (scale) {
    const scaleType = scale.get('type');
    if (scaleType === 'point' || scaleType === 'band') {
      if (config[mark].discreteBandSize !== undefined) {
        return {value: config[mark].discreteBandSize};
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
      return {value: config[mark].continuousBandSize};
    }
  }
  // No Scale
  const value = getFirstDefined(
    // No scale is like discrete bar (with one item)
    config[mark].discreteBandSize,
    config.scale.rangeStep ? config.scale.rangeStep - 1 : undefined,
    // If somehow default rangeStep is set to null or undefined, use 20 as back up
    20
  );
  return {value};
}
