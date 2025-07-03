import {array} from 'vega-util';
import {ChannelDef, ConditionalPredicate, isConditionalDef, isConditionalParameter} from '../../../channeldef.js';
import {GuideEncodingConditionalValueDef} from '../../../guide.js';
import {VgEncodeEntry, VgValueRef} from '../../../vega.schema.js';
import {expression} from '../../predicate.js';
import {parseSelectionPredicate} from '../../selection/parse.js';
import {UnitModel} from '../../unit.js';

/**
 * Return a VgEncodeEntry that includes a Vega production rule for a scale channel's encoding or guide encoding, which includes:
 * (1) the conditional rules (if provided as part of channelDef)
 * (2) invalidValueRef for handling invalid values (if provided as a parameter of this method)
 * (3) main reference for the encoded data.
 */
export function wrapCondition<CD extends ChannelDef | GuideEncodingConditionalValueDef>({
  model,
  channelDef,
  vgChannel,
  invalidValueRef,
  mainRefFn,
}: {
  model: UnitModel;
  channelDef: CD;
  vgChannel: string;

  /**
   * invalidValue for a scale channel if the invalidDataMode is include for the channel.
   * For scale channel with other invalidDataMode or non-scale channel, this value should be undefined.
   */
  invalidValueRef: VgValueRef | undefined;
  mainRefFn: (cDef: CD) => VgValueRef;
}): VgEncodeEntry {
  const condition = isConditionalDef<CD>(channelDef) && channelDef.condition;

  let valueRefs: VgValueRef[] = [];

  if (condition) {
    const conditions = array(condition);
    valueRefs = conditions.map((c) => {
      const conditionValueRef = mainRefFn(c);
      if (isConditionalParameter<any>(c)) {
        const {param, empty} = c;
        const test = parseSelectionPredicate(model, {param, empty});
        return {test, ...conditionValueRef};
      } else {
        const test = expression(model, (c as ConditionalPredicate<any>).test); // FIXME: remove casting once TS is no longer dumb about it
        return {test, ...conditionValueRef};
      }
    });
  }

  if (invalidValueRef !== undefined) {
    valueRefs.push(invalidValueRef);
  }

  const mainValueRef = mainRefFn(channelDef);
  if (mainValueRef !== undefined) {
    valueRefs.push(mainValueRef);
  }

  if (
    valueRefs.length > 1 ||
    (valueRefs.length === 1 && Boolean(valueRefs[0].test)) // We must use array form valueRefs if test exists, otherwise Vega won't execute the test.
  ) {
    return {[vgChannel]: valueRefs};
  } else if (valueRefs.length === 1) {
    return {[vgChannel]: valueRefs[0]};
  }
  return {};
}
