import { isArray, isNumber } from 'vega-util';
import { some } from '../../util';
import { Split } from '../split';
export class ScaleComponent extends Split {
    constructor(name, typeWithExplicit) {
        super({}, // no initial explicit property
        { name } // name as initial implicit property
        );
        this.merged = false;
        this.setWithExplicit('type', typeWithExplicit);
    }
    /**
     * Whether the scale definitely includes zero in the domain
     */
    domainDefinitelyIncludesZero() {
        if (this.get('zero') !== false) {
            return true;
        }
        return some(this.get('domains'), d => isArray(d) && d.length === 2 && isNumber(d[0]) && d[0] <= 0 && isNumber(d[1]) && d[1] >= 0);
    }
}
//# sourceMappingURL=component.js.map