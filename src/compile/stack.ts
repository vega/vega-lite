import {ORDER, STACK_GROUP_CHANNELS} from '../channel';
import {sortField} from './common';
import {has} from '../encoding';
import {FieldDef, field} from '../fielddef';
import {ScaleType} from '../scale';
import {UnitModel} from './unit';
import {isArray} from '../util';

// TODO: put all vega interface in one place
export interface StackTransform {
  type: string;
  offset?: any;
  groupby: any;
  field: any;
  sortby: any;
  output: any;
}

/** Compile stack-by field names from (from 'color' and 'detail') */
function getStackFields(model: UnitModel) {
  const encoding = model.encoding();

  return STACK_GROUP_CHANNELS.reduce(function(fields, channel) {
    const channelEncoding = encoding[channel];
    if (has(encoding, channel)) {
      if (isArray(channelEncoding)) {
        channelEncoding.forEach(function(fieldDef) {
          fields.push(field(fieldDef));
        });
      } else {
        const fieldDef: FieldDef = channelEncoding;
        const scale = model.scale(channel);
        fields.push(field(fieldDef, {
          binSuffix: scale && scale.type === ScaleType.ORDINAL ? '_range' : '_start'
        }));
      }
    }
    return fields;
  }, []);
}

export function stackTransforms(model: UnitModel, impute: boolean): any[] {
  const stackFields = getStackFields(model);
  if (impute) {
    return [imputeTransform(model, stackFields), stackTransform(model, stackFields)];
  }
  return [stackTransform(model, stackFields)];
}

// impute data for stacked area
export function imputeTransform(model: UnitModel, stackFields: string[]) {
  const stack = model.stack();
  return {
    type: 'impute',
    field: model.field(stack.fieldChannel),
    groupby: stackFields,
    orderby: [model.field(stack.groupbyChannel, {binSuffix: '_mid'})],
    method: 'value',
    value: 0
  };
}

export function stackTransform(model: UnitModel, stackFields: string[]) {
  const stack = model.stack();
  const encoding = model.encoding();
  const sortby = model.has(ORDER) ?
    (isArray(encoding[ORDER]) ? encoding[ORDER] : [encoding[ORDER]]).map(sortField) :
    // default = descending by stackFields
    stackFields.map(function(field) {
     return '-' + field;
    });

  const valName = model.field(stack.fieldChannel);

  // add stack transform to mark
  let transform: StackTransform = {
    type: 'stack',
    groupby: [model.field(stack.groupbyChannel, {binSuffix: '_mid'})],
    field: model.field(stack.fieldChannel),
    sortby: sortby,
    output: {
      start: valName + '_start',
      end: valName + '_end'
    }
  };

  if (stack.offset) {
    transform.offset = stack.offset;
  }
  return transform;
}
