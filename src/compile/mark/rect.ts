import {isBinned, isBinning} from '../../bin';
import {isFieldDef} from '../../fielddef';
import * as log from '../../log';
import {RECT} from '../../mark';
import {hasDiscreteDomain, ScaleType} from '../../scale';
import {VgEncodeEntry} from '../../vega.schema';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';

export const rect: MarkCompiler = {
  vgMark: 'rect',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.baseEncodeEntry(model, {size: 'ignore', orient: 'ignore'}),
      ...rectPosition(model, 'x'),
      ...rectPosition(model, 'y')
    };
  }
};

export function rectPosition(model: UnitModel, channel: 'x' | 'y'): VgEncodeEntry {
  const channel2 = channel === 'x' ? 'x2' : 'y2';
  const fieldDef = model.encoding[channel];
  const fieldDef2 = model.encoding[channel2];
  const scale = model.getScaleComponent(channel);
  const scaleType = scale ? scale.get('type') : undefined;
  const scaleName = model.scaleName(channel);

  if (isFieldDef(fieldDef) && (isBinning(fieldDef.bin) || isBinned(fieldDef.bin))) {
    return mixins.binPosition({
      fieldDef,
      fieldDef2,
      channel,
      mark: 'rect',
      scaleName,
      spacing: 0,
      reverse: scale.get('reverse')
    });
  } else if (isFieldDef(fieldDef) && scale && hasDiscreteDomain(scaleType)) {
    /* istanbul ignore else */
    if (scaleType === ScaleType.BAND) {
      return mixins.bandPosition(fieldDef, channel, model);
    } else {
      // We don't support rect mark with point/ordinal scale
      throw new Error(log.message.scaleTypeNotWorkWithMark(RECT, scaleType));
    }
  } else {
    // continuous scale or no scale
    return {
      ...mixins.pointPosition(channel, model, 'zeroOrMax'),
      ...mixins.pointPosition2(model, 'zeroOrMin', channel2)
    };
  }
}
