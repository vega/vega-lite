import {getFormatMixins, isFieldOrDatumDef, isValueDef} from '../../../channeldef';
import {Config} from '../../../config';
import {Encoding} from '../../../encoding';
import {VgValueRef} from '../../../vega.schema';
import {signalOrValueRef} from '../../common';
import {formatSignalRef} from '../../format';
import {UnitModel} from '../../unit';
import {wrapCondition} from './conditional';

export function text(model: UnitModel, channel: 'text' | 'href' | 'url' | 'description' = 'text') {
  const channelDef = model.encoding[channel];
  return wrapCondition(model, channelDef, channel, cDef => textRef(cDef, model.config));
}

export function textRef(
  channelDef: Encoding<string>['text' | 'tooltip'],
  config: Config,
  expr: 'datum' | 'datum.datum' = 'datum'
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
