import { isScaleFieldDef, vgField } from '../../fielddef';
import { fieldFilterExpression } from '../../predicate';
import { isSortArray } from '../../sort';
import { duplicate, hash } from '../../util';
import { DataFlowNode } from './dataflow';
import { getDependentFields } from './expressions';
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
export class CalculateNode extends DataFlowNode {
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
        this._dependentFields = getDependentFields(this.transform.calculate);
    }
    clone() {
        return new CalculateNode(null, duplicate(this.transform));
    }
    static parseAllForSortIndex(parent, model) {
        // get all the encoding with sort fields from model
        model.forEachFieldDef((fieldDef, channel) => {
            if (!isScaleFieldDef(fieldDef)) {
                return;
            }
            if (isSortArray(fieldDef.sort)) {
                const { field, timeUnit } = fieldDef;
                const sort = fieldDef.sort;
                // generate `datum["a"] === val0 ? 0 : datum["a"] === val1 ? 1 : ... : n` via FieldEqualPredicate
                const calculate = sort
                    .map((sortValue, i) => {
                    return `${fieldFilterExpression({ field, timeUnit, equal: sortValue })} ? ${i} : `;
                })
                    .join('') + sort.length;
                parent = new CalculateNode(parent, {
                    calculate,
                    as: sortArrayIndexField(fieldDef, channel, { forAs: true })
                });
            }
        });
        return parent;
    }
    producedFields() {
        return new Set([this.transform.as]);
    }
    dependentFields() {
        return this._dependentFields;
    }
    assemble() {
        return {
            type: 'formula',
            expr: this.transform.calculate,
            as: this.transform.as
        };
    }
    hash() {
        return `Calculate ${hash(this.transform)}`;
    }
}
export function sortArrayIndexField(fieldDef, channel, opt) {
    return vgField(fieldDef, Object.assign({ prefix: channel, suffix: 'sort_index' }, (opt || {})));
}
//# sourceMappingURL=calculate.js.map