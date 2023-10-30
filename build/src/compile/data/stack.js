import { isArray, isString } from 'vega-util';
import { getFieldDef, isFieldDef, isOrderOnlyDef, vgField } from '../../channeldef';
import { duplicate, getFirstDefined, hash } from '../../util';
import { sortParams } from '../common';
import { DataFlowNode } from './dataflow';
function getStackByFields(model) {
    return model.stack.stackBy.reduce((fields, by) => {
        const fieldDef = by.fieldDef;
        const _field = vgField(fieldDef);
        if (_field) {
            fields.push(_field);
        }
        return fields;
    }, []);
}
function isValidAsArray(as) {
    return isArray(as) && as.every(s => isString(s)) && as.length > 1;
}
export class StackNode extends DataFlowNode {
    clone() {
        return new StackNode(null, duplicate(this._stack));
    }
    constructor(parent, stack) {
        super(parent);
        this._stack = stack;
    }
    static makeFromTransform(parent, stackTransform) {
        const { stack, groupby, as, offset = 'zero' } = stackTransform;
        const sortFields = [];
        const sortOrder = [];
        if (stackTransform.sort !== undefined) {
            for (const sortField of stackTransform.sort) {
                sortFields.push(sortField.field);
                sortOrder.push(getFirstDefined(sortField.order, 'ascending'));
            }
        }
        const sort = {
            field: sortFields,
            order: sortOrder
        };
        let normalizedAs;
        if (isValidAsArray(as)) {
            normalizedAs = as;
        }
        else if (isString(as)) {
            normalizedAs = [as, `${as}_end`];
        }
        else {
            normalizedAs = [`${stackTransform.stack}_start`, `${stackTransform.stack}_end`];
        }
        return new StackNode(parent, {
            dimensionFieldDefs: [],
            stackField: stack,
            groupby,
            offset,
            sort,
            facetby: [],
            as: normalizedAs
        });
    }
    static makeFromEncoding(parent, model) {
        const stackProperties = model.stack;
        const { encoding } = model;
        if (!stackProperties) {
            return null;
        }
        const { groupbyChannels, fieldChannel, offset, impute } = stackProperties;
        const dimensionFieldDefs = groupbyChannels
            .map(groupbyChannel => {
            const cDef = encoding[groupbyChannel];
            return getFieldDef(cDef);
        })
            .filter(def => !!def);
        const stackby = getStackByFields(model);
        const orderDef = model.encoding.order;
        let sort;
        if (isArray(orderDef) || isFieldDef(orderDef)) {
            sort = sortParams(orderDef);
        }
        else {
            const sortOrder = isOrderOnlyDef(orderDef) ? orderDef.sort : fieldChannel === 'y' ? 'descending' : 'ascending';
            // default = descending by stackFields
            // FIXME is the default here correct for binned fields?
            sort = stackby.reduce((s, field) => {
                s.field.push(field);
                s.order.push(sortOrder);
                return s;
            }, { field: [], order: [] });
        }
        return new StackNode(parent, {
            dimensionFieldDefs,
            stackField: model.vgField(fieldChannel),
            facetby: [],
            stackby,
            sort,
            offset,
            impute,
            as: [
                model.vgField(fieldChannel, { suffix: 'start', forAs: true }),
                model.vgField(fieldChannel, { suffix: 'end', forAs: true })
            ]
        });
    }
    get stack() {
        return this._stack;
    }
    addDimensions(fields) {
        this._stack.facetby.push(...fields);
    }
    dependentFields() {
        const out = new Set();
        out.add(this._stack.stackField);
        this.getGroupbyFields().forEach(out.add, out);
        this._stack.facetby.forEach(out.add, out);
        this._stack.sort.field.forEach(out.add, out);
        return out;
    }
    producedFields() {
        return new Set(this._stack.as);
    }
    hash() {
        return `Stack ${hash(this._stack)}`;
    }
    getGroupbyFields() {
        const { dimensionFieldDefs, impute, groupby } = this._stack;
        if (dimensionFieldDefs.length > 0) {
            return dimensionFieldDefs
                .map(dimensionFieldDef => {
                if (dimensionFieldDef.bin) {
                    if (impute) {
                        // For binned group by field with impute, we calculate bin_mid
                        // as we cannot impute two fields simultaneously
                        return [vgField(dimensionFieldDef, { binSuffix: 'mid' })];
                    }
                    return [
                        // For binned group by field without impute, we need both bin (start) and bin_end
                        vgField(dimensionFieldDef, {}),
                        vgField(dimensionFieldDef, { binSuffix: 'end' })
                    ];
                }
                return [vgField(dimensionFieldDef)];
            })
                .flat();
        }
        return groupby ?? [];
    }
    assemble() {
        const transform = [];
        const { facetby, dimensionFieldDefs, stackField: field, stackby, sort, offset, impute, as } = this._stack;
        // Impute
        if (impute) {
            for (const dimensionFieldDef of dimensionFieldDefs) {
                const { bandPosition = 0.5, bin } = dimensionFieldDef;
                if (bin) {
                    // As we can only impute one field at a time, we need to calculate
                    // mid point for a binned field
                    const binStart = vgField(dimensionFieldDef, { expr: 'datum' });
                    const binEnd = vgField(dimensionFieldDef, { expr: 'datum', binSuffix: 'end' });
                    transform.push({
                        type: 'formula',
                        expr: `${bandPosition}*${binStart}+${1 - bandPosition}*${binEnd}`,
                        as: vgField(dimensionFieldDef, { binSuffix: 'mid', forAs: true })
                    });
                }
                transform.push({
                    type: 'impute',
                    field,
                    groupby: [...stackby, ...facetby],
                    key: vgField(dimensionFieldDef, { binSuffix: 'mid' }),
                    method: 'value',
                    value: 0
                });
            }
        }
        // Stack
        transform.push({
            type: 'stack',
            groupby: [...this.getGroupbyFields(), ...facetby],
            field,
            sort,
            as,
            offset
        });
        return transform;
    }
}
//# sourceMappingURL=stack.js.map