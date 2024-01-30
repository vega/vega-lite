import {GuideEncodingEntry} from '../guide.js';
import {keys} from '../util.js';
import {VgEncodeChannel} from '../vega.schema.js';
import {signalOrValueRef} from './common.js';
import {wrapCondition} from './mark/encode/index.js';
import {UnitModel} from './unit.js';

export function guideEncodeEntry(encoding: GuideEncodingEntry, model: UnitModel) {
  return keys(encoding).reduce((encode, channel: VgEncodeChannel) => {
    const valueDef = encoding[channel];
    return {
      ...encode,
      ...wrapCondition(model, valueDef, channel, def => signalOrValueRef(def.value))
    };
  }, {});
}
