import {Channel, COLOR} from '../../channel';
import {Config} from '../../config';
import {DateTime, isDateTime, timestamp} from '../../datetime';
import {FieldDef} from '../../fielddef';
import {title as fieldTitle} from '../../fielddef';
import {Legend} from '../../legend';
import {isBinScale, ScaleType} from '../../scale';
import {Type} from '../../type';
import {contains} from '../../util';

export function title(legend: Legend, fieldDef: FieldDef, config: Config) {
  if (legend.title !== undefined) {
    return legend.title;
  }

  return fieldTitle(fieldDef, config);
}

export function values(legend: Legend) {
  const vals = legend.values;
  if (vals && isDateTime(vals[0])) {
    return (vals as DateTime[]).map((dt) => {
      // normalize = true as end user won't put 0 = January
      return timestamp(dt, true);
    });
  }
  return vals;
}

export function type(legend: Legend, type: Type, channel: Channel, scaleType: ScaleType) {
  if (legend.type) {
    return legend.type;
  }
  if (channel === COLOR && ((type === 'quantitative' && !isBinScale(scaleType)) || (type === 'temporal' && contains<ScaleType>(['time', 'utc'], scaleType)))) {
    return 'gradient';
  }
  return undefined;
}
