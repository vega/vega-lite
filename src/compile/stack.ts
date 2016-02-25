import {Encoding} from '../encoding';
import {Config} from '../config';
import {FieldDef} from '../fielddef';
import {Model, ScaleMap} from './Model';
import {Channel, X, Y, COLOR, DETAIL, ORDER} from '../channel';
import {ScaleType} from '../scale';
import {StackOffset} from '../config';
import {BAR, AREA, Mark} from '../mark';
import {field, isMeasure} from '../fielddef';
import {has, isAggregate} from '../encoding';
import {isArray, contains} from '../util';
import {sortField} from './common';

import {scaleType} from './scale';

export interface StackProperties {
  /** Dimension axis of the stack ('x' or 'y'). */
  groupbyChannel: Channel;
  /** Measure axis of the stack ('x' or 'y'). */
  fieldChannel: Channel;

  /** Stack-by field names (from 'color' and 'detail') */
  stackFields: string[];

  /** Stack offset property. */
  offset: StackOffset;
}

// TODO: put all vega interface in one place
export interface StackTransform {
  type: string;
  offset?: any;
  groupby: any;
  field: any;
  sortby: any;
  output: any;
}

/** Compile stack properties from a given spec */
export function compileStackProperties(mark: Mark, encoding: Encoding, scale: ScaleMap, config: Config) {
  const stackFields = getStackFields(mark, encoding, scale);

  if (stackFields.length > 0 &&
      contains([BAR, AREA], mark) &&
      config.mark.stacked !== StackOffset.NONE &&
      isAggregate(encoding)) {

    const isXMeasure = has(encoding, X) && isMeasure(encoding.x),
    isYMeasure = has(encoding, Y) && isMeasure(encoding.y);

    if (isXMeasure && !isYMeasure) {
      return {
        groupbyChannel: Y,
        fieldChannel: X,
        stackFields: stackFields,
        offset: config.mark.stacked
      };
    } else if (isYMeasure && !isXMeasure) {
      return {
        groupbyChannel: X,
        fieldChannel: Y,
        stackFields: stackFields,
        offset: config.mark.stacked
      };
    }
  }
  return null;
}

/** Compile stack-by field names from (from 'color' and 'detail') */
function getStackFields(mark: Mark, encoding: Encoding, scale: ScaleMap) {
  return [COLOR, DETAIL].reduce(function(fields, channel) {
    const channelEncoding = encoding[channel];
    if (has(encoding, channel)) {
      if (isArray(channelEncoding)) {
        channelEncoding.forEach(function(fieldDef) {
          fields.push(field(fieldDef));
        });
      } else {
        const fieldDef: FieldDef = channelEncoding;
        fields.push(field(fieldDef, {
          binSuffix: scaleType(scale[channel], fieldDef, channel, mark) === ScaleType.ORDINAL ? '_range' : '_start'
        }));
      }
    }
    return fields;
  }, []);
}

// impute data for stacked area
export function imputeTransform(model: Model) {
  const stack = model.stack();
  return {
    type: 'impute',
    field: model.field(stack.fieldChannel),
    groupby: stack.stackFields,
    orderby: [model.field(stack.groupbyChannel)],
    method: 'value',
    value: 0
  };
}

export function stackTransform(model: Model) {
  const stack = model.stack();
  const encoding = model.encoding();
  const sortby = model.has(ORDER) ?
    (isArray(encoding[ORDER]) ? encoding[ORDER] : [encoding[ORDER]]).map(sortField) :
    // default = descending by stackFields
    stack.stackFields.map(function(field) {
     return '-' + field;
    });

  const valName = model.field(stack.fieldChannel);

  // add stack transform to mark
  let transform: StackTransform = {
    type: 'stack',
    groupby: [model.field(stack.groupbyChannel)],
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
