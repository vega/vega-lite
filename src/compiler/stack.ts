import {Model} from './Model';
import {Channel} from '../channel';
import * as util from '../util';

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

export default function(model: Model, mdef, stackProps: StackProperties) {
  var groupby = stackProps.groupbyChannel;
  var fieldChannel = stackProps.fieldChannel;

  var valName = model.fieldRef(fieldChannel);
  var startField = valName + '_start';
  var endField = valName + '_end';

  var transforms = [];

  if (model.marktype() === 'area') {
    // Add impute transform to ensure we have all values for each series
    transforms.push({
      type: 'impute',
      field: model.fieldRef(fieldChannel),
      groupby: [model.fieldRef(stackProps.stackChannel)],
      orderby: [model.fieldRef(groupby)],
      method: 'value',
      value: 0
    });
  }

  const sortby = stackProps.config.sort === 'descending' ?
                   '-' + model.fieldRef(stackProps.stackChannel) :
                 stackProps.config.sort === 'ascending' ?
                   model.fieldRef(stackProps.stackChannel) :
                 util.isObject(stackProps.config.sort) ?
                   stackProps.config.sort :
                   '-' + model.fieldRef(stackProps.stackChannel); // default

  // add stack transform to mark
  var stackTransform: StackTransform = {
    type: 'stack',
    groupby: [model.fieldRef(groupby)],
    field: model.fieldRef(fieldChannel),
    sortby: sortby,
    output: {start: startField, end: endField}
  };

  if (stackProps.config.offset) {
    stackTransform.offset = stackProps.config.offset;
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
