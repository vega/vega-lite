import {array} from 'vega-util';
import {isConditionalDef, isConditionalParameter} from '../../../channeldef.js';
import {expression} from '../../predicate.js';
import {parseSelectionPredicate} from '../../selection/parse.js';
/**
 * Return a VgEncodeEntry that includes a Vega production rule for a scale channel's encoding or guide encoding, which includes:
 * (1) the conditional rules (if provided as part of channelDef)
 * (2) invalidValueRef for handling invalid values (if provided as a parameter of this method)
 * (3) main reference for the encoded data.
 */
export function wrapCondition({model, channelDef, vgChannel, invalidValueRef, mainRefFn}) {
  const condition = isConditionalDef(channelDef) && channelDef.condition;
  let valueRefs = [];
  if (condition) {
    const conditions = array(condition);
    valueRefs = conditions.map((c) => {
      const conditionValueRef = mainRefFn(c);
      if (isConditionalParameter(c)) {
        const {param, empty} = c;
        const test = parseSelectionPredicate(model, {param, empty});
        return {test, ...conditionValueRef};
      } else {
        const test = expression(model, c.test); // FIXME: remove casting once TS is no longer dumb about it
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
//# sourceMappingURL=conditional.js.map
