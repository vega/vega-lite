import { __rest } from "tslib";
import { duplicate, hash } from '../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for loess transform nodes
 */
export class LoessTransformNode extends DataFlowNode {
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
        this.transform = duplicate(transform); // duplicate to prevent side effects
        const specifiedAs = this.transform.as || [undefined, undefined];
        this.transform.as = [specifiedAs[0] || transform.on, specifiedAs[1] || transform.loess];
    }
    clone() {
        return new LoessTransformNode(null, duplicate(this.transform));
    }
    dependentFields() {
        return new Set([this.transform.loess, this.transform.on, ...(this.transform.groupby || [])]);
    }
    producedFields() {
        return new Set(this.transform.as);
    }
    hash() {
        return `LoessTransform ${hash(this.transform)}`;
    }
    assemble() {
        const _a = this.transform, { loess, on } = _a, rest = __rest(_a, ["loess", "on"]);
        const result = Object.assign({ type: 'loess', x: on, y: loess }, rest);
        return result;
    }
}
//# sourceMappingURL=loess.js.map