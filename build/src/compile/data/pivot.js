import { duplicate, hash, unique } from '../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for pivot transform nodes.
 */
export class PivotTransformNode extends DataFlowNode {
    clone() {
        return new PivotTransformNode(null, duplicate(this.transform));
    }
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
    }
    addDimensions(fields) {
        this.transform.groupby = unique((this.transform.groupby ?? []).concat(fields), d => d);
    }
    producedFields() {
        return undefined; // return undefined so that potentially everything can depend on the pivot
    }
    dependentFields() {
        return new Set([this.transform.pivot, this.transform.value, ...(this.transform.groupby ?? [])]);
    }
    hash() {
        return `PivotTransform ${hash(this.transform)}`;
    }
    assemble() {
        const { pivot, value, groupby, limit, op } = this.transform;
        return {
            type: 'pivot',
            field: pivot,
            value,
            ...(limit !== undefined ? { limit } : {}),
            ...(op !== undefined ? { op } : {}),
            ...(groupby !== undefined ? { groupby } : {})
        };
    }
}
//# sourceMappingURL=pivot.js.map