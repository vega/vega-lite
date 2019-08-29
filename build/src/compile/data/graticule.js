import { hash } from '../../util';
import { DataFlowNode } from './dataflow';
export class GraticuleNode extends DataFlowNode {
    constructor(parent, params) {
        super(parent);
        this.params = params;
    }
    clone() {
        return new GraticuleNode(null, this.params);
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
        return Object.assign({ type: 'graticule' }, (this.params === true ? {} : this.params));
    }
}
//# sourceMappingURL=graticule.js.map