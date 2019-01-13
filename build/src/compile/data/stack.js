import { isArray, isString } from 'vega-util';
import { getTypedFieldDef, isFieldDef, vgField } from '../../fielddef';
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
            normalizedAs = [as, as + '_end'];
        }
        else {
            normalizedAs = [stackTransform.stack + '_start', stackTransform.stack + '_end'];
        }
        return new StackNode(parent, {
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
        let dimensionFieldDef;
        if (stackProperties.groupbyChannel) {
            const cDef = encoding[stackProperties.groupbyChannel];
            dimensionFieldDef = getTypedFieldDef(cDef);
        }
        const stackby = getStackByFields(model);
        const orderDef = model.encoding.order;
        let sort;
        if (isArray(orderDef) || isFieldDef(orderDef)) {
            sort = sortParams(orderDef);
        }
        else {
            // default = descending by stackFields
            // FIXME is the default here correct for binned fields?
            sort = stackby.reduce((s, field) => {
                s.field.push(field);
                s.order.push('descending');
                return s;
            }, { field: [], order: [] });
        }
        return new StackNode(parent, {
            dimensionFieldDef,
            stackField: model.vgField(stackProperties.fieldChannel),
            facetby: [],
            stackby,
            sort,
            offset: stackProperties.offset,
            impute: stackProperties.impute,
            as: [
                model.vgField(stackProperties.fieldChannel, { suffix: 'start', forAs: true }),
                model.vgField(stackProperties.fieldChannel, { suffix: 'end', forAs: true })
            ]
        });
    }
    get stack() {
        return this._stack;
    }
    addDimensions(fields) {
        this._stack.facetby = this._stack.facetby.concat(fields);
    }
    dependentFields() {
        const out = new Set();
        out.add(this._stack.stackField);
        this.getGroupbyFields().forEach(f => out.add(f));
        this._stack.facetby.forEach(f => out.add(f));
        const field = this._stack.sort.field;
        isArray(field) ? field.forEach(f => out.add(f)) : out.add(field);
        return out;
    }
    producedFields() {
        return new Set(this._stack.as);
    }
    hash() {
        return `Stack ${hash(this._stack)}`;
    }
    getGroupbyFields() {
        const { dimensionFieldDef, impute, groupby } = this._stack;
        if (dimensionFieldDef) {
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
        }
        return groupby || [];
    }
    assemble() {
        const transform = [];
        const { facetby, dimensionFieldDef, stackField: field, stackby, sort, offset, impute, as } = this._stack;
        // Impute
        if (impute && dimensionFieldDef) {
            if (dimensionFieldDef.bin) {
                // As we can only impute one field at a time, we need to calculate
                // mid point for a binned field
                transform.push({
                    type: 'formula',
                    expr: '(' +
                        vgField(dimensionFieldDef, { expr: 'datum' }) +
                        '+' +
                        vgField(dimensionFieldDef, { expr: 'datum', binSuffix: 'end' }) +
                        ')/2',
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
        // Stack
        transform.push({
            type: 'stack',
            groupby: this.getGroupbyFields().concat(facetby),
            field,
            sort,
            as,
            offset
        });
        return transform;
    }
}
//# sourceMappingURL=stack.js.map