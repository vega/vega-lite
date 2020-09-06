import {isValueDef} from '../../../channeldef';
import {isPathMark} from '../../../mark';
import {signalOrValueRef} from '../../common';
import {UnitModel} from '../../unit';
import {wrapCondition} from './conditional';

export function zindex(model: UnitModel) {
  const {encoding, mark} = model;
  const order = encoding.order;

  if (!isPathMark(mark) && isValueDef(order)) {
    return wrapCondition(model, order, 'zindex', cd => signalOrValueRef(cd.value));
  }
  return {};
}
