import {isObject} from 'vega-util';
import {isBinned} from '../bin.js';
import {getMainRangeChannel, SECONDARY_RANGE_CHANNEL} from '../channel.js';
import {isDatumDef, isFieldDef} from '../channeldef.js';
import * as log from '../log/index.js';
import {isMarkDef} from '../mark.js';
import {isUnitSpec} from '../spec/unit.js';
export class RuleForRangedLineNormalizer {
  name = 'RuleForRangedLine';
  hasMatchingType(spec) {
    if (isUnitSpec(spec)) {
      const {encoding, mark} = spec;
      if (mark === 'line' || (isMarkDef(mark) && mark.type === 'line')) {
        for (const channel of SECONDARY_RANGE_CHANNEL) {
          const mainChannel = getMainRangeChannel(channel);
          const mainChannelDef = encoding[mainChannel];
          if (encoding[channel]) {
            if ((isFieldDef(mainChannelDef) && !isBinned(mainChannelDef.bin)) || isDatumDef(mainChannelDef)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  run(spec, params, normalize) {
    const {encoding, mark} = spec;
    log.warn(log.message.lineWithRange(!!encoding.x2, !!encoding.y2));
    return normalize(
      {
        ...spec,
        mark: isObject(mark) ? {...mark, type: 'rule'} : 'rule',
      },
      params,
    );
  }
}
//# sourceMappingURL=ruleforrangedline.js.map
