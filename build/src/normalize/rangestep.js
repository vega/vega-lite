import * as tslib_1 from "tslib";
import { getSizeType, POSITION_SCALE_CHANNELS } from '../channel';
import { isFieldDef } from '../channeldef';
import * as log from '../log';
import { isUnitSpec } from '../spec/unit';
import { keys } from '../util';
export class RangeStepNormalizer {
    constructor() {
        this.name = 'RangeStep';
    }
    hasMatchingType(spec) {
        if (isUnitSpec(spec) && spec.encoding) {
            for (const channel of POSITION_SCALE_CHANNELS) {
                const def = spec.encoding[channel];
                if (def && isFieldDef(def)) {
                    if (def && def.scale && def.scale['rangeStep']) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    run(spec) {
        const sizeMixins = {};
        let encoding = Object.assign({}, spec.encoding);
        for (const channel of POSITION_SCALE_CHANNELS) {
            const sizeType = getSizeType(channel);
            const def = encoding[channel];
            if (def && isFieldDef(def)) {
                if (def && def.scale && def.scale['rangeStep']) {
                    const { scale } = def, defWithoutScale = tslib_1.__rest(def, ["scale"]);
                    const _a = scale, { rangeStep } = _a, scaleWithoutRangeStep = tslib_1.__rest(_a, ["rangeStep"]);
                    sizeMixins[sizeType] = { step: scale['rangeStep'] };
                    log.warn(log.message.RANGE_STEP_DEPRECATED);
                    encoding = Object.assign({}, encoding, { [channel]: Object.assign({}, defWithoutScale, (keys(scaleWithoutRangeStep).length ? { scale: scaleWithoutRangeStep } : {})) });
                }
            }
        }
        return Object.assign({}, sizeMixins, spec, { encoding });
    }
}
//# sourceMappingURL=rangestep.js.map