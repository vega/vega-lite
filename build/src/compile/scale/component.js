import { isArray } from 'vega-util';
import { some } from '../../util';
import { Split } from '../split';
export class ScaleComponent extends Split {
    constructor(name, typeWithExplicit) {
        super({}, // no initial explicit property
        { name } // name as initial implicit property
        );
        this.merged = false;
        this.domains = [];
        this.setWithExplicit('type', typeWithExplicit);
    }
    /**
     * Whether the scale definitely includes zero in the domain
     */
    get domainDefinitelyIncludesZero() {
        if (this.get('zero') !== false) {
            return true;
        }
        const domains = this.domains;
        if (isArray(domains)) {
            return some(domains, d => isArray(d) && d.length === 2 && d[0] <= 0 && d[1] >= 0);
        }
        return false;
    }
}
//# sourceMappingURL=component.js.map