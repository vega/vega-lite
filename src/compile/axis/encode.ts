import {getSecondaryRangeChannel, PositionScaleChannel} from '../../channel';
import {getFieldOrDatumDef} from '../../channeldef';
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
  }

  return specifiedLabelsSpec;
}
