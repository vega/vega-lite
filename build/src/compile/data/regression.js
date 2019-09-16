import { __rest } from "tslib";
import { duplicate, hash } from '../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for regression transform nodes
 */
export class RegressionTransformNode extends DataFlowNode {
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
        this.transform = duplicate(transform); // duplicate to prevent side effects
        const specifiedAs = this.transform.as || [undefined, undefined];
        this.transform.as = [specifiedAs[0] || transform.on, specifiedAs[1] || transform.regression];
    }
    clone() {
        return new RegressionTransformNode(null, duplicate(this.transform));
    }
    dependentFields() {
        return new Set([this.transform.regression, this.transform.on, ...(this.transform.groupby || [])]);
    }
    producedFields() {
        return new Set(this.transform.as);
    }
    hash() {
        return `RegressionTransform ${hash(this.transform)}`;
    }
    assemble() {
        const _a = this.transform, { regression, on } = _a, rest = __rest(_a, ["regression", "on"]);
        const result = Object.assign({ type: 'regression', x: on, y: regression }, rest);
        return result;
    }
}
//# sourceMappingURL=regression.js.map