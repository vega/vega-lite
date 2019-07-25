import { DataFlowNode } from './dataflow';
export class GraticuleNode extends DataFlowNode {
    constructor(parent, params) {
        super(parent);
        this.params = params;
    }
    clone() {
        return new GraticuleNode(null, this.params);
    }
    assemble() {
        return Object.assign({ type: 'graticule' }, (this.params === true ? {} : this.params));
    }
}
//# sourceMappingURL=graticule.js.map