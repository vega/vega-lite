import {LabelOverlap} from 'vega';
import {FieldDef, valueArray} from '../../fielddef';
import {Legend} from '../../legend';
import {hasContinuousDomain, ScaleType} from '../../scale';
import {contains} from '../../util';

export function values(legend: Legend, fieldDef: FieldDef<string>) {
  const vals = legend.values;

  if (vals) {
    return valueArray(fieldDef, vals);
  }
  return undefined;
}

export function clipHeight(scaleType: ScaleType) {
  if (hasContinuousDomain(scaleType)) {
    return 20;
  }
  return undefined;
}

export function labelOverlap(scaleType: ScaleType): LabelOverlap {
  if (contains(['quantile', 'threshold', 'log'], scaleType)) {
    return 'greedy';
  }
  return undefined;
}
