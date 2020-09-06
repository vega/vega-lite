import {GuideEncodingEntry} from '../guide';
import {keys} from '../util';
import {VgEncodeChannel} from '../vega.schema';
import {signalOrValueRef} from './common';
import {wrapCondition} from './mark/encode';
import {UnitModel} from './unit';

export function guideEncodeEntry(encoding: GuideEncodingEntry, model: UnitModel) {
  return keys(encoding).reduce((encode, channel: VgEncodeChannel) => {
    const valueDef = encoding[channel];
    return {
      ...encode,
      ...wrapCondition(model, valueDef, channel, def => signalOrValueRef(def.value))
    };
  }, {});
}
