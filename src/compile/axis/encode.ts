import {Channel, SpatialScaleChannel, X} from '../../channel';
import {ScaleType} from '../../scale';
import {NOMINAL, ORDINAL, TEMPORAL} from '../../type';
import {contains, extend, keys} from '../../util';
import {VgAxis} from '../../vega.schema';
import {timeFormatExpression} from '../common';
import {UnitModel} from '../unit';

export function labels(model: UnitModel, channel: SpatialScaleChannel, labelsSpec: any, def: VgAxis) {
  const fieldDef = model.fieldDef(channel) ||
    (
      channel === 'x' ? model.fieldDef('x2') :
      channel === 'y' ? model.fieldDef('y2') :
      undefined
    );
  const axis = model.axis(channel);
  const config = model.config;

  // Text
  if (fieldDef.type === TEMPORAL) {
    const isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;
    labelsSpec = extend({
      text: {
        signal: timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, config.timeFormat, isUTCScale)
      }
    }, labelsSpec);
  }

  // Label Angle
  if (axis.labelAngle !== undefined) {
    labelsSpec.angle = {value: axis.labelAngle};
  } else {
    // auto rotate for X
    if (channel === X && (contains([NOMINAL, ORDINAL], fieldDef.type) || !!fieldDef.bin || fieldDef.type === TEMPORAL)) {
      labelsSpec.angle = {value: 270};
    }
  }

  if (labelsSpec.angle && channel === 'x') {
    // Auto set baseline if x is rotated by 90, or -90
    if (contains([270, 90, -90], labelsSpec.angle.value)) {
      labelsSpec.baseline = {value: 'middle'};
    }
  }

  return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
