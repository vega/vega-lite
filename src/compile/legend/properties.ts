import {LabelOverlap} from 'vega';
import {FieldDef, valueArray} from '../../fielddef';
import {Legend} from '../../legend';
import {hasContinuousDomain, ScaleType} from '../../scale';

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
  if (scaleType === 'log') {
    return 'greedy';
  }
  return undefined;
}
