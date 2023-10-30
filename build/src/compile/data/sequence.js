import { hash } from '../../util';
import { DataFlowNode } from './dataflow';
export class SequenceNode extends DataFlowNode {
    clone() {
        return new SequenceNode(null, this.params);
    }
    constructor(parent, params) {
        super(parent);
        this.params = params;
    }
    dependentFields() {
        return new Set();
    }
    producedFields() {
        return new Set([this.params.as ?? 'data']);
    }
    hash() {
        return `Hash ${hash(this.params)}`;
    }
    assemble() {
        return {
            type: 'sequence',
            ...this.params
        };
    }
}
//# sourceMappingURL=sequence.js.map