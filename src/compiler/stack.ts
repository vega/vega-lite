import {Spec} from '../schema/schema';
import {stackConfig as stackConfigSchema} from '../schema/config.stack.schema';
import {FieldDef} from '../schema/fielddef.schema';
import {instantiate} from '../schema/schemautil';
import {Model} from './Model';
import {Channel, X, Y, COLOR, DETAIL} from '../channel';
import {BAR, AREA} from '../mark';
import {field, isMeasure} from '../fielddef';
import {has, isAggregate} from '../encoding';
import {isArray, contains} from '../util';

import {type as scaleType} from './scale';

export interface StackProperties {
  /** Dimension axis of the stack ('x' or 'y'). */
  groupbyChannel: Channel;
  /** Measure axis of the stack ('x' or 'y'). */
  fieldChannel: Channel;

  /** Stack-by field names (from 'color' and 'detail') */
  stackFields: string[];

  /** Stack config for the stack transform. */
  config: any;
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
      spec.config.stack !== false &&
      isAggregate(spec.encoding)) {

    var isXMeasure = has(spec.encoding, X) && isMeasure(spec.encoding.x);
    var isYMeasure = has(spec.encoding, Y) && isMeasure(spec.encoding.y);

    if (isXMeasure && !isYMeasure) {
      return {
        groupbyChannel: Y,
        fieldChannel: X,
        stackFields: stackFields,
        config: spec.config.stack === true  ? instantiate(stackConfigSchema) : spec.config.stack
      };
    } else if (isYMeasure && !isXMeasure) {
      return {
        groupbyChannel: X,
        fieldChannel: Y,
        stackFields: stackFields,
        config: spec.config.stack === true  ? instantiate(stackConfigSchema) : spec.config.stack
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
          binSuffix: scaleType(fieldDef, channel, spec.mark) === 'ordinal' ? '_range' : '_start'
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
  const sortby = stack.config.sort === 'ascending' ?
                   stack.stackFields :
                 isArray(stack.config.sort) ?
                   stack.config.sort :
                   // descending, or default
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

  if (stack.config.offset) {
    transform.offset = stack.config.offset;
  }
  return transform;
}
