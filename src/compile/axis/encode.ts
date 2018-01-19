import {Axis} from '../../axis';
import {Channel, PositionScaleChannel, X} from '../../channel';
import {FieldDef, isTimeFieldDef} from '../../fielddef';
import {ScaleType} from '../../scale';
import {NOMINAL, ORDINAL} from '../../type';
import {contains, keys} from '../../util';
import {AxisOrient, HorizontalAlign} from '../../vega.schema';
import {timeFormatExpression} from '../common';
import {UnitModel} from '../unit';
import {getAxisConfig} from './config';

export function labels(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any, orient: AxisOrient) {
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

    labelsSpec.text = {
      signal: timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, config.timeFormat, isUTCScale)
    };
  }

  // Label Angle
  let angle = getAxisConfig('labelAngle', model.config, channel, orient, model.getScaleComponent(channel).get('type'));
  if (angle === undefined) {
    angle = labelAngle(axis, channel, fieldDef);
    if (angle) {
      labelsSpec.angle = {value: angle};
    }
  }

  if (angle !== undefined) {
    const align = labelAlign(angle, orient);
    if (align) {
      labelsSpec.align = {value: align};
    }

    labelsSpec.baseline = labelBaseline(angle, orient);
  }

  labelsSpec = {
    ...labelsSpec,
    ...specifiedLabelsSpec
  };

  return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}

export function labelBaseline(angle: number, orient: AxisOrient) {
  if (orient === 'top' || orient === 'bottom') {
    if (angle % 90 === 0) {
      return {value: 'middle'};
    } else if (angle < 90 || 270 < angle) {
      return {value: orient === 'bottom' ? 'top' : 'bottom'};
    } else {
      return {value: orient === 'bottom'? 'bottom' : 'top'};
    }
  } else {
    if (angle % 180 === 0) {
      return {value: 'middle'};
    } else if (0 < angle && angle < 180) {
      return {value: orient === 'left' ? 'top' : 'bottom'};
    } else {
      return {value: orient === 'left'? 'bottom' : 'top'};
    }
  }
}

export function labelAngle(axis: Axis, channel: Channel, fieldDef: FieldDef<string>) {
  if (axis.labelAngle !== undefined) {
    // Make angle within [0,360)
    return ((axis.labelAngle % 360) + 360) % 360;
  } else {
    if (channel === X && contains([NOMINAL, ORDINAL], fieldDef.type)) {
      return 270;
    }
  }
  return undefined;
}

export function labelAlign(angle: number, orient: AxisOrient): HorizontalAlign {
  angle = ((angle % 360) + 360) % 360;
  if (orient === 'top' || orient === 'bottom') {
    if (angle % 180 === 0) {
      return 'center';
    } else if (angle > 180) {
      return orient === 'top' ? 'left' : 'right';
    } else {
      return orient === 'top' ? 'right': 'left';
    }
  } else {
    if (angle === 90 || angle === 270) {  // for 90 and 270
      return 'center';
    } else if (angle < 90 || 270 < angle) {
      return orient === 'left' ? 'right': 'left';
    } else {
      return orient === 'left' ? 'left' : 'right';
    }
  }
}

