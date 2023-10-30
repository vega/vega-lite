import { hash } from '../../util';
import { DataFlowNode } from './dataflow';
export class GraticuleNode extends DataFlowNode {
    clone() {
        return new GraticuleNode(null, this.params);
    }
    constructor(parent, params) {
        super(parent);
        this.params = params;
    }
    dependentFields() {
        return new Set();
    }
    producedFields() {
        return undefined; // there should never be a node before graticule
    }
    hash() {
        return `Graticule ${hash(this.params)}`;
    }
    assemble() {
        return {
            type: 'graticule',
            ...(this.params === true ? {} : this.params)
        };
    }
}
//# sourceMappingURL=graticule.js.map