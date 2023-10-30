import { duplicate, hash } from '../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for flatten transform nodes
 */
export class ExtentTransformNode extends DataFlowNode {
    clone() {
        return new ExtentTransformNode(null, duplicate(this.transform));
    }
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
        this.transform = duplicate(transform);
    }
    dependentFields() {
        return new Set([this.transform.extent]);
    }
    producedFields() {
        return new Set([]);
    }
    hash() {
        return `ExtentTransform ${hash(this.transform)}`;
    }
    assemble() {
        const { extent, param } = this.transform;
        const result = {
            type: 'extent',
            field: extent,
            signal: param
        };
        return result;
    }
}
//# sourceMappingURL=extent.js.map