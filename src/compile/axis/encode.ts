import {getSecondaryRangeChannel, PositionScaleChannel} from '../../channel';
import {getFieldOrDatumDef} from '../../channeldef';
import {ScaleType} from '../../scale';
import {keys} from '../../util';
import {formatSignalRef} from '../format';
import {UnitModel} from '../unit';

export function labels(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any) {
  const {encoding, config} = model;

  const fieldOrDatumDef =
    getFieldOrDatumDef<string>(encoding[channel]) ?? getFieldOrDatumDef(encoding[getSecondaryRangeChannel(channel)]);
  const axis = model.axis(channel) || {};
  const {format, formatType} = axis;

  const text = formatSignalRef({
    fieldOrDatumDef,
    field: 'datum.value',
    format,
    formatType,
    config,
    isUTCScale: model.getScaleComponent(channel).get('type') === ScaleType.UTC,
    omitTimeFormatConfig: true, // Vega axes automatically determine the format for each label so we don't apply config.timeFormat
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
