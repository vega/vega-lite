import { duplicate, hash } from '../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for density transform nodes
 */
export class DensityTransformNode extends DataFlowNode {
    clone() {
        return new DensityTransformNode(null, duplicate(this.transform));
    }
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
        this.transform = duplicate(transform); // duplicate to prevent side effects
        const specifiedAs = this.transform.as ?? [undefined, undefined];
        this.transform.as = [specifiedAs[0] ?? 'value', specifiedAs[1] ?? 'density'];
    }
    dependentFields() {
        return new Set([this.transform.density, ...(this.transform.groupby ?? [])]);
    }
    producedFields() {
        return new Set(this.transform.as);
    }
    hash() {
        return `DensityTransform ${hash(this.transform)}`;
    }
    assemble() {
        const { density, ...rest } = this.transform;
        const result = {
            type: 'kde',
            field: density,
            ...rest
        };
        if (this.transform.groupby) {
            result.resolve = 'shared';
        }
        return result;
    }
}
//# sourceMappingURL=density.js.map