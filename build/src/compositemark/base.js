import { getMarkType } from '../mark';
import { isUnitSpec } from '../spec/unit';
export class CompositeMarkNormalizer {
    constructor(name, run) {
        this.name = name;
        this.run = run;
    }
    hasMatchingType(spec) {
        if (isUnitSpec(spec)) {
            return getMarkType(spec.mark) === this.name;
        }
        return false;
    }
}
//# sourceMappingURL=base.js.map