import {Model} from './Model';

export default function(model: Model, mdef, stack) {
  var groupby = stack.groupby;
  var fieldChannel = stack.value;

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

  // TODO: put all vega interface in one place
  interface StackTransform {
    type: string;
    offset?: any;
    groupby: any;
    field: any;
    sortby: any;
    output: any;
  }

  // add stack transform to mark
  var stackTransform: StackTransform = {
    type: 'stack',
    groupby: [model.fieldRef(groupby)],
    field: model.fieldRef(fieldChannel),
    sortby: [(stack.properties.reverse ? '-' : '') + model.fieldRef(stack.stack)],
    output: {start: startField, end: endField}
  };

  if (stack.properties.offset) {
    stackTransform.offset = stack.properties.offset;
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
