import {getFormatMixins, isFieldOrDatumDef, isValueDef} from '../../../channeldef.js';
import {Config} from '../../../config.js';
import {Encoding} from '../../../encoding.js';
import {VgValueRef} from '../../../vega.schema.js';
import {signalOrValueRef} from '../../common.js';
import {formatSignalRef} from '../../format.js';
import {UnitModel} from '../../unit.js';
import {wrapCondition} from './conditional.js';

export function text(model: UnitModel, channel: 'text' | 'href' | 'url' | 'description' = 'text') {
  const channelDef = model.encoding[channel];
  return wrapCondition({
    model,
    channelDef,
    vgChannel: channel,
    mainRefFn: (cDef) => textRef(cDef, model.config),
    invalidValueRef: undefined, // text encoding doesn't have continuous scales and thus can't have invalid values
  });
}

export function textRef(
  channelDef: Encoding<string>['text' | 'tooltip'],
  config: Config,
  expr: 'datum' | 'datum.datum' = 'datum',
): VgValueRef {
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
