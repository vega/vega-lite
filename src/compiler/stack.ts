import {Model} from './Model';
import {Channel} from '../channel';
import {isArray} from '../util';

export interface StackProperties {
  groupbyChannel: Channel;
  fieldChannel: Channel;
  stackChannels: Channel[]; // COLOR or DETAIL
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
export function imputeTransform(model: Model) {
  const stack = model.stack();
  return {
    type: 'impute',
    field: model.field(stack.fieldChannel),
    groupby: [stack.stackChannels.map(function(c) { return model.field(c); })],
    orderby: [model.field(stack.groupbyChannel)],
    method: 'value',
    value: 0
  };
}

export function stackTransform(model: Model) {
  const stack = model.stack();
  const sortby = stack.config.sort === 'ascending' ?
                   stack.stackChannels.map(function(c) {
                     return model.field(c);
                   }) :
                 isArray(stack.config.sort) ?
                   stack.config.sort :
                   // descending, or default
                   stack.stackChannels.map(function(c) {
                     return '-' + model.field(c);
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
