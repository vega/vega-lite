import { isBinning } from '../../bin';
import { isScaleChannel } from '../../channel';
import { binRequiresRange, isTypedFieldDef, vgField } from '../../fielddef';
import * as log from '../../log';
import { duplicate, hash, keys, replacePathInField, setEqual } from '../../util';
import { DataFlowNode } from './dataflow';
function addDimension(dims, channel, fieldDef) {
    if (isTypedFieldDef(fieldDef) && isBinning(fieldDef.bin)) {
        dims.add(vgField(fieldDef, {}));
        dims.add(vgField(fieldDef, { binSuffix: 'end' }));
        if (binRequiresRange(fieldDef, channel)) {
            dims.add(vgField(fieldDef, { binSuffix: 'range' }));
        }
    }
    else {
        dims.add(vgField(fieldDef));
    }
    return dims;
}
function mergeMeasures(parentMeasures, childMeasures) {
    for (const field of keys(childMeasures)) {
        // when we merge a measure, we either have to add an aggregation operator or even a new field
        const ops = childMeasures[field];
        for (const op of keys(ops)) {
            if (field in parentMeasures) {
                // add operator to existing measure field
                parentMeasures[field][op] = new Set([...(parentMeasures[field][op] || []), ...ops[op]]);
            }
            else {
                parentMeasures[field] = { [op]: ops[op] };
            }
        }
    }
}
export class AggregateNode extends DataFlowNode {
    /**
     * @param dimensions string set for dimensions
     * @param measures dictionary mapping field name => dict of aggregation functions and names to use
     */
    constructor(parent, dimensions, measures) {
        super(parent);
        this.dimensions = dimensions;
        this.measures = measures;
    }
    clone() {
        return new AggregateNode(null, new Set(this.dimensions), duplicate(this.measures));
    }
    get groupBy() {
        return this.dimensions;
    }
    static makeFromEncoding(parent, model) {
        let isAggregate = false;
        model.forEachFieldDef(fd => {
            if (fd.aggregate) {
                isAggregate = true;
            }
        });
        const meas = {};
        const dims = new Set();
        if (!isAggregate) {
            // no need to create this node if the model has no aggregation
            return null;
        }
        model.forEachFieldDef((fieldDef, channel) => {
            const { aggregate, field } = fieldDef;
            if (aggregate) {
                if (aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = new Set([vgField(fieldDef, { forAs: true })]);
                }
                else {
                    meas[field] = meas[field] || {};
                    meas[field][aggregate] = new Set([vgField(fieldDef, { forAs: true })]);
                    // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
                    if (isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
                        meas[field]['min'] = new Set([vgField({ field, aggregate: 'min' }, { forAs: true })]);
                        meas[field]['max'] = new Set([vgField({ field, aggregate: 'max' }, { forAs: true })]);
                    }
                }
            }
            else {
                addDimension(dims, channel, fieldDef);
            }
        });
        if (dims.size + keys(meas).length === 0) {
            return null;
        }
        return new AggregateNode(parent, dims, meas);
    }
    static makeFromTransform(parent, t) {
        const dims = new Set();
        const meas = {};
        for (const s of t.aggregate) {
            const { op, field, as } = s;
            if (op) {
                if (op === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = new Set([as ? as : vgField(s, { forAs: true })]);
                }
                else {
                    meas[field] = meas[field] || {};
                    meas[field][op] = new Set([as ? as : vgField(s, { forAs: true })]);
                }
            }
        }
        for (const s of t.groupby || []) {
            dims.add(s);
        }
        if (dims.size + keys(meas).length === 0) {
            return null;
        }
        return new AggregateNode(parent, dims, meas);
    }
    merge(other) {
        if (setEqual(this.dimensions, other.dimensions)) {
            mergeMeasures(this.measures, other.measures);
            return true;
        }
        else {
            log.debug('different dimensions, cannot merge');
            return false;
        }
    }
    addDimensions(fields) {
        fields.forEach(this.dimensions.add, this.dimensions);
    }
    dependentFields() {
        return new Set([...this.dimensions, ...keys(this.measures)]);
    }
    producedFields() {
        const out = new Set();
        for (const field of keys(this.measures)) {
            for (const op of keys(this.measures[field])) {
                const m = this.measures[field][op];
                if (m.size === 0) {
                    out.add(`${op}_${field}`);
                }
                else {
                    m.forEach(out.add, out);
                }
            }
        }
        return out;
    }
    hash() {
        return `Aggregate ${hash({ dimensions: this.dimensions, measures: this.measures })}`;
    }
    assemble() {
        const ops = [];
        const fields = [];
        const as = [];
        for (const field of keys(this.measures)) {
            for (const op of keys(this.measures[field])) {
                for (const alias of this.measures[field][op]) {
                    as.push(alias);
                    ops.push(op);
                    fields.push(replacePathInField(field));
                }
            }
        }
        const result = {
            type: 'aggregate',
            groupby: [...this.dimensions],
            ops,
            fields,
            as
        };
        return result;
    }
}
//# sourceMappingURL=aggregate.js.map