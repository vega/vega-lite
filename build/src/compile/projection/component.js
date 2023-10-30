import { Split } from '../split';
export class ProjectionComponent extends Split {
    constructor(name, specifiedProjection, size, data) {
        super({ ...specifiedProjection }, // all explicit properties of projection
        { name } // name as initial implicit property
        );
        this.specifiedProjection = specifiedProjection;
        this.size = size;
        this.data = data;
        this.merged = false;
    }
    /**
     * Whether the projection parameters should fit provided data.
     */
    get isFit() {
        return !!this.data;
    }
}
//# sourceMappingURL=component.js.map