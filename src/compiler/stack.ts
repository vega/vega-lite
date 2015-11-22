import {Model} from './Model';
import {Channel} from '../channel';
import * as util from '../util';

export interface StackDef {
  groupbyChannel: Channel;
  fieldChannel: Channel;
  stack: Channel; // COLOR or DETAIL
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

export default function(model: Model, mdef, stack: StackDef) {
  var groupby = stack.groupbyChannel;
  var fieldChannel = stack.fieldChannel;

  var valName = model.fieldRef(fieldChannel);
  var startField = valName + '_start';
  var endField = valName + '_end';

  var transforms = [];

  if (model.marktype() === 'area') {
    // Add impute transform to ensure we have all values for each series
    transforms.push({
      type: 'impute',
      field: model.fieldRef(fieldChannel),
      groupby: [model.fieldRef(stack.stack)],
      orderby: [model.fieldRef(groupby)],
      method: 'value',
      value: 0
    });
  }

  const sortby = stack.config.sort === 'descending' ?
                   '-' + model.fieldRef(stack.stack) :
                 stack.config.sort === 'ascending' ?
                   model.fieldRef(stack.stack) :
                 util.isObject(stack.config.sort) ?
                   stack.config.sort :
                   '-' + model.fieldRef(stack.stack); // default

  // add stack transform to mark
  var stackTransform: StackTransform = {
    type: 'stack',
    groupby: [model.fieldRef(groupby)],
    field: model.fieldRef(fieldChannel),
    sortby: sortby,
    output: {start: startField, end: endField}
  };

  if (stack.config.offset) {
    stackTransform.offset = stack.config.offset;
  }

  transforms.push(stackTransform);

  mdef.from.transform = transforms;

  // TODO(#276): This is super hack-ish -- consolidate into modular mark properties?
  mdef.properties.update[fieldChannel] = {
    scale: fieldChannel,
    field: startField
  };
  mdef.properties.update[fieldChannel + '2'] = {
    scale: fieldChannel,
    field: endField
  };
}
