import { Split } from '../split';
/**
 * Class to track interesting properties (see https://15721.courses.cs.cmu.edu/spring2016/papers/graefe-ieee1995.pdf)
 * about how fields have been parsed or whether they have been derived in a transform. We use this to not parse the
 * same field again (or differently).
 */
export class AncestorParse extends Split {
    constructor(explicit = {}, implicit = {}, parseNothing = false) {
        super(explicit, implicit);
        this.explicit = explicit;
        this.implicit = implicit;
        this.parseNothing = parseNothing;
    }
    clone() {
        const clone = super.clone();
        clone.parseNothing = this.parseNothing;
        return clone;
    }
}
//# sourceMappingURL=index.js.map