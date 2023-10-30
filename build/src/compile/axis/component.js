import { COMMON_AXIS_PROPERTIES_INDEX } from '../../axis';
import { duplicate, keys } from '../../util';
import { isSignalRef } from '../../vega.schema';
import { Split } from '../split';
function isFalseOrNull(v) {
    return v === false || v === null;
}
const AXIS_COMPONENT_PROPERTIES_INDEX = {
    disable: 1,
    gridScale: 1,
    scale: 1,
    ...COMMON_AXIS_PROPERTIES_INDEX,
    labelExpr: 1,
    encode: 1
};
export const AXIS_COMPONENT_PROPERTIES = keys(AXIS_COMPONENT_PROPERTIES_INDEX);
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
    hasOrientSignalRef() {
        return isSignalRef(this.explicit.orient);
    }
}
//# sourceMappingURL=component.js.map