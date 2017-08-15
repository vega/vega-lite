import {Channel, COLOR} from '../../channel';
import {DateTime, dateTimeExpr, isDateTime} from '../../datetime';
import {Legend} from '../../legend';
import {isBinScale, ScaleType} from '../../scale';
import {Type} from '../../type';
import {contains} from '../../util';

export function values(legend: Legend) {
  const vals = legend.values;
  if (vals && isDateTime(vals[0])) {
    return (vals as DateTime[]).map((dt) => {
      // normalize = true as end user won't put 0 = January
      return {signal: dateTimeExpr(dt, true)};
    });
  }
  return vals;
}

export function type(type: Type, channel: Channel, scaleType: ScaleType): 'gradient' {
  if (
      channel === COLOR && (
        (type === 'quantitative' && !isBinScale(scaleType)) ||
        (type === 'temporal' && contains<ScaleType>(['time', 'utc'], scaleType))
      )
    ) {
    return 'gradient';
  }
  return undefined;
}
