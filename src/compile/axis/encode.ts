import {getSecondaryRangeChannel, PositionScaleChannel} from '../../channel';
import {channelDefType, getFieldOrDatumDef, isPositionFieldOrDatumDef} from '../../channeldef';
import {formatCustomType, isCustomFormatType} from '../format';
import {UnitModel} from '../unit';

export function labels(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any) {
  const {encoding, config} = model;

  const fieldOrDatumDef =
    getFieldOrDatumDef<string>(encoding[channel]) ?? getFieldOrDatumDef(encoding[getSecondaryRangeChannel(channel)]);
  const axis = model.axis(channel) || {};
  const {format, formatType} = axis;

  if (isCustomFormatType(formatType)) {
    return {
      text: formatCustomType({
        fieldOrDatumDef,
        field: 'datum.value',
        format,
        formatType,
        config
      }),
      ...specifiedLabelsSpec
    };
  } else if (
    format === undefined &&
    formatType === undefined &&
    config.customFormatTypes &&
    config.numberFormatType &&
    channelDefType(fieldOrDatumDef) === 'quantitative'
  ) {
    return {
      text: formatCustomType({
        fieldOrDatumDef,
        field: 'datum.value',
        format: config.numberFormat,
        formatType: config.numberFormatType,
        config
      }),
      ...specifiedLabelsSpec
    };
  } else if (
    format === undefined &&
    formatType === undefined &&
    isPositionFieldOrDatumDef(fieldOrDatumDef) &&
    fieldOrDatumDef.stack === 'normalize' &&
    channelDefType(fieldOrDatumDef) === 'quantitative'
  ) {
    let fmt = 'format';
    if (config.normalizedNumberFormatType && config.customFormatTypes) {
      fmt = config.normalizedNumberFormatType;
    }
    return {
      text: formatCustomType({
        fieldOrDatumDef,
        field: 'datum.value',
        format: config.normalizedNumberFormat,
        formatType: fmt,
        config
      }),
      ...specifiedLabelsSpec
    };
  }

  return specifiedLabelsSpec;
}
