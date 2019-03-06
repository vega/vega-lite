import { duplicate } from '../../util';
import { Split } from '../split';
function isFalseOrNull(v) {
    return v === false || v === null;
}
export class AxisComponent extends Split {
    constructor(explicit = {}, implicit = {}, mainExtracted = false) {
        super();
        this.explicit = explicit;
        this.implicit = implicit;
        this.mainExtracted = mainExtracted;
    }
    clone() {
        return new AxisComponent(duplicate(this.explicit), duplicate(this.implicit), this.mainExtracted);
    }
    hasAxisPart(part) {
        // FIXME(https://github.com/vega/vega-lite/issues/2552) this method can be wrong if users use a Vega theme.
        if (part === 'axis') {
            // always has the axis container part
            return true;
        }
        if (part === 'grid' || part === 'title') {
            return !!this.get(part);
        }
        // Other parts are enabled by default, so they should not be false or null.
        return !isFalseOrNull(this.get(part));
    }
}
//# sourceMappingURL=component.js.map