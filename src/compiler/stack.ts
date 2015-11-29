import {Model} from './Model';
import {Channel} from '../channel';
import {isObject} from '../util';

export interface StackProperties {
  groupbyChannel: Channel;
  fieldChannel: Channel;
  stackChannel: Channel; // COLOR or DETAIL
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

// impute data for stacked area
export function imputeTransform(model) {
  const stack = model.stack();
  return {
    type: 'impute',
    field: model.fieldRef(stack.fieldChannel),
    groupby: [model.fieldRef(stack.stackChannel)],
    orderby: [model.fieldRef(stack.groupbyChannel)],
    method: 'value',
    value: 0
  };
}

export function stackTransform(model: Model) {
  const stack = model.stack();
  const sortby = stack.config.sort === 'descending' ?
                   '-' + model.fieldRef(stack.stackChannel) :
                 stack.config.sort === 'ascending' ?
                   model.fieldRef(stack.stackChannel) :
                 isObject(stack.config.sort) ?
                   stack.config.sort :
                   '-' + model.fieldRef(stack.stackChannel); // default

  const valName = model.fieldRef(stack.fieldChannel);

  // add stack transform to mark
  var transform: StackTransform = {
    type: 'stack',
    groupby: [model.fieldRef(stack.groupbyChannel)],
    field: model.fieldRef(stack.fieldChannel),
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
