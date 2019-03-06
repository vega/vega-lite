import * as log from '../log';
import { isUnitSpec } from '../spec/unit';
export class RuleForRangedLineNormalizer {
    constructor() {
        this.name = 'RuleForRangedLine';
    }
    hasMatchingType(spec) {
        if (isUnitSpec(spec)) {
            const { encoding, mark } = spec;
            return mark === 'line' && (!!encoding['x2'] || !!encoding['y2']);
        }
        return false;
    }
    run(spec, params, normalize) {
        const { encoding } = spec;
        log.warn(log.message.lineWithRange(!!encoding.x2, !!encoding.y2));
        return normalize(Object.assign({}, spec, { mark: 'rule' }), params);
    }
}
//# sourceMappingURL=ruleforrangedline.js.map