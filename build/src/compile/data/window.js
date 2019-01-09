import { vgField } from '../../fielddef';
import { duplicate, hash } from '../../util';
import { unique } from './../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for the window transform nodes
 */
export class WindowTransformNode extends DataFlowNode {
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
    }
    clone() {
        return new WindowTransformNode(null, duplicate(this.transform));
    }
    addDimensions(fields) {
        this.transform.groupby = unique(this.transform.groupby.concat(fields), d => d);
    }
    dependentFields() {
        const out = new Set();
        this.transform.groupby.forEach(f => out.add(f));
        this.transform.sort.forEach(m => out.add(m.field));
        this.transform.window
            .map(w => w.field)
            .filter(f => f !== undefined)
            .forEach(f => out.add(f));
        return out;
    }
    producedFields() {
        return new Set(this.transform.window.map(this.getDefaultName));
    }
    getDefaultName(windowFieldDef) {
        return windowFieldDef.as || vgField(windowFieldDef);
    }
    hash() {
        return `WindowTransform ${hash(this.transform)}`;
    }
    assemble() {
        const fields = [];
        const ops = [];
        const as = [];
        const params = [];
        for (const window of this.transform.window) {
            ops.push(window.op);
            as.push(this.getDefaultName(window));
            params.push(window.param === undefined ? null : window.param);
            fields.push(window.field === undefined ? null : window.field);
        }
        const frame = this.transform.frame;
        const groupby = this.transform.groupby;
        const sortFields = [];
        const sortOrder = [];
        if (this.transform.sort !== undefined) {
            for (const sortField of this.transform.sort) {
                sortFields.push(sortField.field);
                sortOrder.push(sortField.order || 'ascending');
            }
        }
        const sort = {
            field: sortFields,
            order: sortOrder
        };
        const ignorePeers = this.transform.ignorePeers;
        const result = {
            type: 'window',
            params,
            as,
            ops,
            fields,
            sort
        };
        if (ignorePeers !== undefined) {
            result.ignorePeers = ignorePeers;
        }
        if (groupby !== undefined) {
            result.groupby = groupby;
        }
        if (frame !== undefined) {
            result.frame = frame;
        }
        return result;
    }
}
//# sourceMappingURL=window.js.map