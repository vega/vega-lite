import { vgField } from '../../channeldef';
import { duplicate, hash } from '../../util';
import { unique } from '../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for the join aggregate transform nodes.
 */
export class JoinAggregateTransformNode extends DataFlowNode {
    clone() {
        return new JoinAggregateTransformNode(null, duplicate(this.transform));
    }
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
    }
    addDimensions(fields) {
        this.transform.groupby = unique(this.transform.groupby.concat(fields), d => d);
    }
    dependentFields() {
        const out = new Set();
        if (this.transform.groupby) {
            this.transform.groupby.forEach(out.add, out);
        }
        this.transform.joinaggregate
            .map(w => w.field)
            .filter(f => f !== undefined)
            .forEach(out.add, out);
        return out;
    }
    producedFields() {
        return new Set(this.transform.joinaggregate.map(this.getDefaultName));
    }
    getDefaultName(joinAggregateFieldDef) {
        return joinAggregateFieldDef.as ?? vgField(joinAggregateFieldDef);
    }
    hash() {
        return `JoinAggregateTransform ${hash(this.transform)}`;
    }
    assemble() {
        const fields = [];
        const ops = [];
        const as = [];
        for (const joinaggregate of this.transform.joinaggregate) {
            ops.push(joinaggregate.op);
            as.push(this.getDefaultName(joinaggregate));
            fields.push(joinaggregate.field === undefined ? null : joinaggregate.field);
        }
        const groupby = this.transform.groupby;
        return {
            type: 'joinaggregate',
            as,
            ops,
            fields,
            ...(groupby !== undefined ? { groupby } : {})
        };
    }
}
//# sourceMappingURL=joinaggregate.js.map