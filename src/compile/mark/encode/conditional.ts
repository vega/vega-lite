import {array} from 'vega-util';
import {ChannelDef, ConditionalPredicate, isConditionalDef, isConditionalParameter} from '../../../channeldef';
import {GuideEncodingConditionalValueDef} from '../../../guide';
import {VgEncodeEntry, VgValueRef} from '../../../vega.schema';
import {expression} from '../../predicate';
import {parseSelectionPredicate} from '../../selection/parse';
import {UnitModel} from '../../unit';

/**
 * Return a mixin that includes a Vega production rule for a Vega-Lite conditional channel definition
 * or a simple mixin if channel def has no condition.
 */
export function wrapCondition<CD extends ChannelDef | GuideEncodingConditionalValueDef>(
  model: UnitModel,
  channelDef: CD,
  vgChannel: string,
  refFn: (cDef: CD) => VgValueRef
): VgEncodeEntry {
  const condition = isConditionalDef<CD>(channelDef) && channelDef.condition;
  const valueRef = refFn(channelDef);
  if (condition) {
    const conditions = array(condition);
    const vgConditions = conditions.map(c => {
      const conditionValueRef = refFn(c);
      if (isConditionalParameter<any>(c)) {
        const {param, empty} = c;
        const test = parseSelectionPredicate(model, {param, empty});
        return {test, ...conditionValueRef};
      } else {
        const test = expression(model, (c as ConditionalPredicate<any>).test); // FIXME: remove casting once TS is no longer dumb about it
        return {test, ...conditionValueRef};
      }
    });
    return {
      [vgChannel]: [...vgConditions, ...(valueRef !== undefined ? [valueRef] : [])]
    };
  } else {
    return valueRef !== undefined ? {[vgChannel]: valueRef} : {};
  }
}
