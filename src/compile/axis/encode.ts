import {PositionScaleChannel} from '../../channel';
import {isFieldDefWithCustomTimeFormat, isTimeFormatFieldDef} from '../../channeldef';
import {ScaleType} from '../../scale';
import {normalizeTimeUnit} from '../../timeunit';
import {keys} from '../../util';
import {customFormatExpr, timeFormatExpression} from '../common';
import {UnitModel} from '../unit';

export function labels(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any) {
  const fieldDef =
    model.fieldDef(channel) ??
    (channel === 'x' ? model.fieldDef('x2') : channel === 'y' ? model.fieldDef('y2') : undefined);
  const axis = model.axis(channel);
  const {format, formatType} = axis;
  const field = 'datum.value';

  let labelsSpec: any = {};

  // We use a label encoding instead of setting the `format` property because Vega does not let us determine how the format should be interpreted.
  if (isFieldDefWithCustomTimeFormat(fieldDef)) {
    labelsSpec.text = {signal: customFormatExpr({field, format, formatType})};
  } else if (isTimeFormatFieldDef(fieldDef)) {
    const isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;

    const expr = timeFormatExpression(field, normalizeTimeUnit(fieldDef.timeUnit)?.unit, axis.format, null, isUTCScale);

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
