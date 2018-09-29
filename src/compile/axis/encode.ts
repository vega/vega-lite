import {AxisOrient} from 'vega';
import {PositionScaleChannel} from '../../channel';
import {isTimeFieldDef} from '../../fielddef';
import {ScaleType} from '../../scale';
import {keys} from '../../util';
import {timeFormatExpression} from '../common';
import {UnitModel} from '../unit';

export function labels(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any, orient: AxisOrient) {
  const fieldDef =
    model.fieldDef(channel) ||
    (channel === 'x' ? model.fieldDef('x2') : channel === 'y' ? model.fieldDef('y2') : undefined);
  const axis = model.axis(channel);
  const config = model.config;

  let labelsSpec: any = {};

  // Text
  if (isTimeFieldDef(fieldDef) || axis.formatType === 'time') {
    const isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;

    const expr = timeFormatExpression(
      'datum.value',
      fieldDef.timeUnit,
      axis.format,
      config.axis.shortTimeLabels,
      null,
      isUTCScale
    );

    if (expr) {
      labelsSpec.text = {signal: expr};
    }
  }

  labelsSpec = {
    ...labelsSpec,
    ...specifiedLabelsSpec
  };

  return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
