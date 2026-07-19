import {SingleDefChannel} from '../../channel.js';
import {FieldRefOption, TypedFieldDef, vgField} from '../../channeldef.js';

export function sortArrayIndexField(
  fieldDef: TypedFieldDef<string>,
  channel: SingleDefChannel | 'order',
  optOrOrderIndex?: FieldRefOption | number,
  opt?: FieldRefOption,
) {
  const orderIndex = typeof optOrOrderIndex === 'number' ? optOrOrderIndex : undefined;
  const fieldRefOption = typeof optOrOrderIndex === 'number' ? opt : optOrOrderIndex;
  const suffix = orderIndex === undefined ? 'sort_index' : `${orderIndex}_sort_index`;
  return vgField(fieldDef, {prefix: channel, suffix, ...fieldRefOption});
}
