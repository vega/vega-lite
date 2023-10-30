import { duplicate, hash } from '../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for quantile transform nodes
 */
export class QuantileTransformNode extends DataFlowNode {
    clone() {
        return new QuantileTransformNode(null, duplicate(this.transform));
    }
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
        this.transform = duplicate(transform); // duplicate to prevent side effects
        const specifiedAs = this.transform.as ?? [undefined, undefined];
        this.transform.as = [specifiedAs[0] ?? 'prob', specifiedAs[1] ?? 'value'];
    }
    dependentFields() {
        return new Set([this.transform.quantile, ...(this.transform.groupby ?? [])]);
    }
    producedFields() {
        return new Set(this.transform.as);
    }
    hash() {
        return `QuantileTransform ${hash(this.transform)}`;
    }
    assemble() {
        const { quantile, ...rest } = this.transform;
        const result = {
            type: 'quantile',
            field: quantile,
            ...rest
        };
        return result;
    }
}
//# sourceMappingURL=quantile.js.map