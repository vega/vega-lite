import {getMarkType} from '../mark.js';
import {isUnitSpec} from '../spec/unit.js';
export class CompositeMarkNormalizer {
  name;
  run;
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
