import {getFormatMixins, isFieldOrDatumDef, isValueDef} from '../../../channeldef.js';
import {signalOrValueRef} from '../../common.js';
import {formatSignalRef} from '../../format.js';
import {wrapCondition} from './conditional.js';
export function text(model, channel = 'text') {
  const channelDef = model.encoding[channel];
  return wrapCondition({
    model,
    channelDef,
    vgChannel: channel,
    mainRefFn: (cDef) => textRef(cDef, model.config),
    invalidValueRef: undefined, // text encoding doesn't have continuous scales and thus can't have invalid values
  });
}
export function textRef(channelDef, config, expr = 'datum') {
  // text
  if (channelDef) {
    if (isValueDef(channelDef)) {
      return signalOrValueRef(channelDef.value);
    }
    if (isFieldOrDatumDef(channelDef)) {
      const {format, formatType} = getFormatMixins(channelDef);
      return formatSignalRef({fieldOrDatumDef: channelDef, format, formatType, expr, config});
    }
  }
  return undefined;
}
//# sourceMappingURL=text.js.map
