import {Axis} from '../../axis';
import {Channel, SpatialScaleChannel, X} from '../../channel';
import {FieldDef, isTimeFieldDef} from '../../fielddef';
import {ScaleType} from '../../scale';
import {NOMINAL, ORDINAL} from '../../type';
import {contains, keys} from '../../util';
import {AxisOrient, VgAxis} from '../../vega.schema';
import {timeFormatExpression} from '../common';
import {Split} from '../split';
import {UnitModel} from '../unit';

export function labels(model: UnitModel, channel: SpatialScaleChannel, specifiedLabelsSpec: any, def: Split<Partial<VgAxis>>) {
  const fieldDef = model.fieldDef(channel) ||
    (
      channel === 'x' ? model.fieldDef('x2') :
      channel === 'y' ? model.fieldDef('y2') :
      undefined
    );
  const axis = model.axis(channel);
  const config = model.config;

  let labelsSpec: any = {};

  // Text
  if (isTimeFieldDef(fieldDef)) {
    const isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;

    labelsSpec.text =  {
      signal: timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, config.timeFormat, isUTCScale)
    };
  }

  // Label Angle
  const angle = labelAngle(axis, channel, fieldDef);
  if (angle) {
    labelsSpec.angle = {value: angle};
  }

  if (labelsSpec.angle && channel === 'x') {
    const align = labelAlign(angle, def.get('orient'));
    if (align) {
      labelsSpec.align = {value: align};
    }

    // Auto set baseline if x is rotated by 90, or -90
    if (contains([90, 270], angle)) {
      labelsSpec.baseline = {value: 'middle'};
    }
  }

  labelsSpec = {
    ...labelsSpec,
    ...specifiedLabelsSpec
  };

  return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
export function labelAngle(axis: Axis, channel: Channel, fieldDef: FieldDef<string>) {
  if (axis.labelAngle !== undefined) {
    // Make angle within [0,360)
    return ((axis.labelAngle % 360) + 360) % 360;
  } else {
    // auto rotate for X
    if (channel === X && (contains([NOMINAL, ORDINAL], fieldDef.type) || !!fieldDef.bin ||  isTimeFieldDef(fieldDef))) {
      return 270;
    }
  }
  return undefined;
}
export function labelAlign(angle: number, orient: AxisOrient) {
  if (angle && angle > 0) {
    if (angle > 180) {
      return orient === 'top' ? 'left' : 'right';
    }  else if (angle < 180) {
      return orient === 'top' ? 'right': 'left';
    }
  }
  return undefined;
}

