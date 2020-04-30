import {getSecondaryRangeChannel, PositionScaleChannel} from '../../channel';
import {getFieldOrDatumDef, isFieldOrDatumDefWithCustomTimeFormat} from '../../channeldef';
import {keys} from '../../util';
import {formatCustomType} from '../format';
import {UnitModel} from '../unit';

export function labels(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any) {
  const {encoding, config} = model;

  const fieldOrDatumDef =
    getFieldOrDatumDef<string>(encoding[channel]) ?? getFieldOrDatumDef(encoding[getSecondaryRangeChannel(channel)]);
  const axis = model.axis(channel) || {};
  const {format, formatType} = axis;

  const text = isFieldOrDatumDefWithCustomTimeFormat(fieldOrDatumDef, config)
    ? formatCustomType({
        fieldOrDatumDef,
        field: 'datum.value',
        format,
        formatType,
        config
      })
    : undefined;

  const labelsSpec: any = {
    ...(text ? {text} : {}),
    ...specifiedLabelsSpec
  };

  return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
