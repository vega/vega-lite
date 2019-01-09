import { isArray } from 'vega-util';
import { isBinning } from '../../bin';
import { COLUMN, ROW } from '../../channel';
import { vgField } from '../../fielddef';
import * as log from '../../log';
import { hasDiscreteDomain } from '../../scale';
import { isSortField } from '../../sort';
import { hash } from '../../util';
import { isVgRangeStep } from '../../vega.schema';
import { assembleDomain, getFieldFromDomain } from '../scale/domain';
import { sortArrayIndexField } from './calculate';
import { DataFlowNode } from './dataflow';
/**
 * A node that helps us track what fields we are faceting by.
 */
export class FacetNode extends DataFlowNode {
    /**
     * @param model The facet model.
     * @param name The name that this facet source will have.
     * @param data The source data for this facet data.
     */
    constructor(parent, model, name, data) {
        super(parent);
        this.model = model;
        this.name = name;
        this.data = data;
        for (const channel of [COLUMN, ROW]) {
            const fieldDef = model.facet[channel];
            if (fieldDef) {
                const { bin, sort } = fieldDef;
                this[channel] = Object.assign({ name: model.getName(`${channel}_domain`), fields: [vgField(fieldDef), ...(isBinning(bin) ? [vgField(fieldDef, { binSuffix: 'end' })] : [])] }, (isSortField(sort)
                    ? { sortField: sort }
                    : isArray(sort)
                        ? { sortIndexField: sortArrayIndexField(fieldDef, channel) }
                        : {}));
            }
        }
        this.childModel = model.child;
    }
    hash() {
        let out = `Facet`;
        if (this.column) {
            out += ` c:${hash(this.column)}`;
        }
        if (this.row) {
            out += ` r:${hash(this.row)}`;
        }
        return out;
    }
    get fields() {
        return [...((this.column && this.column.fields) || []), ...((this.row && this.row.fields) || [])];
    }
    /**
     * The name to reference this source is its name.
     */
    getSource() {
        return this.name;
    }
    getChildIndependentFieldsWithStep() {
        const childIndependentFieldsWithStep = {};
        for (const channel of ['x', 'y']) {
            const childScaleComponent = this.childModel.component.scales[channel];
            if (childScaleComponent && !childScaleComponent.merged) {
                const type = childScaleComponent.get('type');
                const range = childScaleComponent.get('range');
                if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
                    const domain = assembleDomain(this.childModel, channel);
                    const field = getFieldFromDomain(domain);
                    if (field) {
                        childIndependentFieldsWithStep[channel] = field;
                    }
                    else {
                        log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
                    }
                }
            }
        }
        return childIndependentFieldsWithStep;
    }
    assembleRowColumnData(channel, crossedDataName, childIndependentFieldsWithStep) {
        const childChannel = channel === 'row' ? 'y' : 'x';
        const fields = [];
        const ops = [];
        const as = [];
        if (childIndependentFieldsWithStep[childChannel]) {
            if (crossedDataName) {
                // If there is a crossed data, calculate max
                fields.push(`distinct_${childIndependentFieldsWithStep[childChannel]}`);
                ops.push('max');
            }
            else {
                // If there is no crossed data, just calculate distinct
                fields.push(childIndependentFieldsWithStep[childChannel]);
                ops.push('distinct');
            }
            // Although it is technically a max, just name it distinct so it's easier to refer to it
            as.push(`distinct_${childIndependentFieldsWithStep[childChannel]}`);
        }
        const { sortField, sortIndexField } = this[channel];
        if (sortField) {
            const { op, field } = sortField;
            fields.push(field);
            ops.push(op);
            as.push(vgField(sortField, { forAs: true }));
        }
        else if (sortIndexField) {
            fields.push(sortIndexField);
            ops.push('max');
            as.push(sortIndexField);
        }
        return {
            name: this[channel].name,
            // Use data from the crossed one if it exist
            source: crossedDataName || this.data,
            transform: [
                Object.assign({ type: 'aggregate', groupby: this[channel].fields }, (fields.length
                    ? {
                        fields,
                        ops,
                        as
                    }
                    : {}))
            ]
        };
    }
    assemble() {
        const data = [];
        let crossedDataName = null;
        const childIndependentFieldsWithStep = this.getChildIndependentFieldsWithStep();
        if (this.column && this.row && (childIndependentFieldsWithStep.x || childIndependentFieldsWithStep.y)) {
            // Need to create a cross dataset to correctly calculate cardinality
            crossedDataName = `cross_${this.column.name}_${this.row.name}`;
            const fields = [].concat(childIndependentFieldsWithStep.x ? [childIndependentFieldsWithStep.x] : [], childIndependentFieldsWithStep.y ? [childIndependentFieldsWithStep.y] : []);
            const ops = fields.map(() => 'distinct');
            data.push({
                name: crossedDataName,
                source: this.data,
                transform: [
                    {
                        type: 'aggregate',
                        groupby: [...this.column.fields, ...this.row.fields],
                        fields,
                        ops
                    }
                ]
            });
        }
        for (const channel of [COLUMN, ROW]) {
            if (this[channel]) {
                data.push(this.assembleRowColumnData(channel, crossedDataName, childIndependentFieldsWithStep));
            }
        }
        return data;
    }
}
//# sourceMappingURL=facet.js.map