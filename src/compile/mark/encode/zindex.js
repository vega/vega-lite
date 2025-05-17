import {isValueDef} from '../../../channeldef.js';
import {isPathMark} from '../../../mark.js';
import {signalOrValueRef} from '../../common.js';
import {wrapCondition} from './conditional.js';
export function zindex(model) {
  const {encoding, mark} = model;
  const order = encoding.order;
  if (!isPathMark(mark) && isValueDef(order)) {
    return wrapCondition({
      model,
      channelDef: order,
      vgChannel: 'zindex',
      mainRefFn: (cd) => signalOrValueRef(cd.value),
      invalidValueRef: undefined, // zindex encoding doesn't have continuous scales and thus can't have invalid values
    });
  }
  return {};
}
//# sourceMappingURL=zindex.js.map
