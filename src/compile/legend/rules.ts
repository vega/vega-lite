import {COLOR, Channel} from '../../channel';
import {Config} from '../../config';
import {DateTime, isDateTime, timestamp} from '../../datetime';
import {FieldDef} from '../../fielddef';
import {Legend} from '../../legend';
import {title as fieldTitle} from '../../fielddef';
import {contains} from '../../util';
import {containsTimeUnit, TimeUnit} from '../../timeunit';
import {ScaleType} from '../../scale';

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

export function type(legend: Legend, timeUnit: TimeUnit, channel: Channel, scaleType: ScaleType) {
  if (legend.type) {
    return legend.type;
  }
  if (channel === COLOR && (!timeUnit || containsTimeUnit(timeUnit, 'year')) && contains<ScaleType>(['time', 'utc', 'sequential'], scaleType)) {
    return 'gradient';
  }
  return undefined;
}
