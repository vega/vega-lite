import {Channel, isColorChannel} from '../../channel';
import {FieldDef, valueArray} from '../../fielddef';
import {Legend} from '../../legend';
import {isBinScale, ScaleType} from '../../scale';
import {Type} from '../../type';
import {contains} from '../../util';

export function values(legend: Legend, fieldDef: FieldDef<string>) {
  const vals = legend.values;

  if (vals) {
    return valueArray(fieldDef, vals);
  }
  return undefined;
}

export function type(t: Type, channel: Channel, scaleType: ScaleType): 'gradient' {
  if (
      isColorChannel(channel) && (
        (t === 'quantitative' && !isBinScale(scaleType)) ||
        (t === 'temporal' && contains<ScaleType>(['time', 'utc'], scaleType))
      )
    ) {
    return 'gradient';
  }
  return undefined;
}
