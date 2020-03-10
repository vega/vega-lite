import {PositionScaleChannel} from '../../channel';
import {ScaleType} from '../../scale';
import {keys} from '../../util';
import {formatSignalRef} from '../common';
import {UnitModel} from '../unit';

export function labels(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any) {
  const fieldDef =
    model.fieldDef(channel) ??
    (channel === 'x' ? model.fieldDef('x2') : channel === 'y' ? model.fieldDef('y2') : undefined);
  const axis = model.axis(channel);
  const {format, formatType} = axis;
  const {config} = model;

  const text = formatSignalRef({
    fieldDef,
    field: 'datum.value',
    format,
    formatType,
    config,
    isUTCScale: model.getScaleComponent(channel).get('type') === ScaleType.UTC,
    omitTimeFormatConfig: true, // Vega axes automatically determine format each label automatically so we don't apply config.timeFormat
    omitNumberFormatAndEmptyTimeFormat: true // no need to generate number format for encoding block as we can use Vega's axis format
  });

  let labelsSpec: any = {
    ...(text ? {text} : {}),
    ...specifiedLabelsSpec
  };

  labelsSpec = {
    ...labelsSpec,
    ...specifiedLabelsSpec
  };

  return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
