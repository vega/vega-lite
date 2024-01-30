import {isValueDef} from '../../../channeldef.js';
import {isPathMark} from '../../../mark.js';
import {signalOrValueRef} from '../../common.js';
import {UnitModel} from '../../unit.js';
import {wrapCondition} from './conditional.js';

export function zindex(model: UnitModel) {
  const {encoding, mark} = model;
  const order = encoding.order;

  if (!isPathMark(mark) && isValueDef(order)) {
    return wrapCondition(model, order, 'zindex', cd => signalOrValueRef(cd.value));
  }
  return {};
}
