import {Spec} from '../schema/schema';
import {FieldDef} from '../schema/fielddef.schema';
import {Model} from './Model';
import {Channel, X, Y, COLOR, DETAIL, ORDER} from '../channel';
import {BAR, AREA} from '../mark';
import {field, isMeasure} from '../fielddef';
import {has, isAggregate} from '../encoding';
import {isArray, contains} from '../util';
import {sortField} from './util';

import {type as scaleType} from './scale';

export interface StackProperties {
  /** Dimension axis of the stack ('x' or 'y'). */
  groupbyChannel: Channel;
  /** Measure axis of the stack ('x' or 'y'). */
  fieldChannel: Channel;

  /** Stack-by field names (from 'color' and 'detail') */
  stackFields: string[];

  /** Stack offset property. */
  offset: string;
}

// TODO: put all vega interface in one place
interface StackTransform {
  type: string;
  offset?: any;
  groupby: any;
  field: any;
  sortby: any;
  output: any;
}

/** Compile stack properties from a given spec */
export function compileStackProperties(spec: Spec) {
  const stackFields = getStackFields(spec);

  if (stackFields.length > 0 &&
      contains([BAR, AREA], spec.mark) &&
      spec.config.mark.stacked !== 'none' &&
      isAggregate(spec.encoding)) {

    var isXMeasure = has(spec.encoding, X) && isMeasure(spec.encoding.x);
    var isYMeasure = has(spec.encoding, Y) && isMeasure(spec.encoding.y);

    if (isXMeasure && !isYMeasure) {
      return {
        groupbyChannel: Y,
        fieldChannel: X,
        stackFields: stackFields,
        offset: spec.config.mark.stacked
      };
    } else if (isYMeasure && !isXMeasure) {
      return {
        groupbyChannel: X,
        fieldChannel: Y,
        stackFields: stackFields,
        offset: spec.config.mark.stacked
      };
    }
  }
  return null;
}

/** Compile stack-by field names from (from 'color' and 'detail') */
function getStackFields(spec: Spec) {
  return [COLOR, DETAIL].reduce(function(fields, channel) {
    const channelEncoding = spec.encoding[channel];
    if (has(spec.encoding, channel)) {
      if (isArray(channelEncoding)) {
        channelEncoding.forEach(function(fieldDef) {
          fields.push(field(fieldDef));
        });
      } else {
        const fieldDef: FieldDef = channelEncoding;
        fields.push(field(fieldDef, {
          binSuffix: scaleType(fieldDef.scale, fieldDef, channel, spec.mark) === 'ordinal' ? '_range' : '_start'
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
  const encoding = model.spec().encoding;
  const sortby = model.has(ORDER) ?
    (isArray(encoding[ORDER]) ? encoding[ORDER] : [encoding[ORDER]]).map(sortField) :
    // default = descending by stackFields
    stack.stackFields.map(function(field) {
     return '-' + field;
    });

  const valName = model.field(stack.fieldChannel);

  // add stack transform to mark
  var transform: StackTransform = {
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
