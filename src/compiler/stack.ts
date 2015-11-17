import Encoding from '../Encoding';

export default function(encoding: Encoding, mdef, stack) {
  var groupby = stack.groupby;
  var fieldChannel = stack.value;

  var valName = encoding.fieldRef(fieldChannel);
  var startField = valName + '_start';
  var endField = valName + '_end';

  var transforms = [];

  if (encoding.marktype() === 'area') {
    // Add impute transform to ensure we have all values for each series
    transforms.push({
      type: 'impute',
      field: encoding.fieldRef(fieldChannel),
      groupby: [encoding.fieldRef(stack.stack)],
      orderby: [encoding.fieldRef(groupby)],
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
    groupby: [encoding.fieldRef(groupby)],
    field: encoding.fieldRef(fieldChannel),
    sortby: [(stack.properties.reverse ? '-' : '') + encoding.fieldRef(stack.stack)],
    output: {start: startField, end: endField}
  };

  if (stack.properties.offset) {
    stackTransform.offset = stack.properties.offset;
  }

  transforms.push(stackTransform);

  mdef.from.transform = transforms;

  // TODO(#276): This is super hack-ish -- consolidate into modular mark properties?
  mdef.properties.update[fieldChannel] = mdef.properties.enter[fieldChannel] = {
    scale: fieldChannel,
    field: startField
  };
  mdef.properties.update[fieldChannel + '2'] = mdef.properties.enter[fieldChannel + '2'] = {
    scale: fieldChannel,
    field: endField
  };
}
