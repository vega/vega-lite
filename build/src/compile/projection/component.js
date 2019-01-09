import { Split } from '../split';
export class ProjectionComponent extends Split {
    constructor(name, specifiedProjection, size, data) {
        super(Object.assign({}, specifiedProjection), // all explicit properties of projection
        { name } // name as initial implicit property
        );
        this.specifiedProjection = specifiedProjection;
        this.size = size;
        this.data = data;
        this.merged = false;
    }
}
//# sourceMappingURL=component.js.map