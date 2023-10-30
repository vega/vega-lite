import { isObject } from 'vega-util';
import { isBinned } from '../bin';
import { getMainRangeChannel, SECONDARY_RANGE_CHANNEL } from '../channel';
import { isDatumDef, isFieldDef } from '../channeldef';
import * as log from '../log';
import { isMarkDef } from '../mark';
import { isUnitSpec } from '../spec/unit';
export class RuleForRangedLineNormalizer {
    constructor() {
        this.name = 'RuleForRangedLine';
    }
    hasMatchingType(spec) {
        if (isUnitSpec(spec)) {
            const { encoding, mark } = spec;
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
        const { encoding, mark } = spec;
        log.warn(log.message.lineWithRange(!!encoding.x2, !!encoding.y2));
        return normalize({
            ...spec,
            mark: isObject(mark) ? { ...mark, type: 'rule' } : 'rule'
        }, params);
    }
}
//# sourceMappingURL=ruleforrangedline.js.map