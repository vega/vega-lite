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
}
//# sourceMappingURL=component.js.map