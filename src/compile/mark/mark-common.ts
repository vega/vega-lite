import {ScaleComponent} from '../scale';

import {X, Y, Channel} from '../../channel';
import {FieldDef, FieldRefOption, field} from '../../fielddef';
import {ScaleType} from '../../scale';
import {VgValueRef} from '../../vega.schema';

export function normalFieldRef(fieldDef: FieldDef, scale: ScaleComponent, channel: Channel, defaultValue?): VgValueRef {
  // TODO: datum support

  if (fieldDef) {
    if (fieldDef.field) {
      let opt: FieldRefOption = {};
      if (scale.type === ScaleType.ORDINAL) {
        opt = {binSuffix: 'range'};
      } else {
        opt = {binSuffix: 'mid'};
      }
      return {
        scale: scale.name,
        field: field(fieldDef, opt)
      };
    } else if (fieldDef.value) {
      return {
        value: fieldDef.value
      };
    }
  }

  if (defaultValue) {
    return {value: defaultValue};
  }
  return undefined;
}

export function stackEndRef(fieldDef: FieldDef, scale: ScaleComponent): VgValueRef {
  return {
    scale: scale.name,
    field: field(fieldDef, { suffix: 'end' })
  };
}