import { duplicate, hash } from '../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for the sample transform nodes
 */
export class SampleTransformNode extends DataFlowNode {
    clone() {
        return new SampleTransformNode(null, duplicate(this.transform));
    }
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
    }
    dependentFields() {
        return new Set();
    }
    producedFields() {
        return new Set();
    }
    hash() {
        return `SampleTransform ${hash(this.transform)}`;
    }
    assemble() {
        return {
            type: 'sample',
            size: this.transform.sample
        };
    }
}
//# sourceMappingURL=sample.js.map