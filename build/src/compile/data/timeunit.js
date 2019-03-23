import { vgField } from '../../fielddef';
import { fieldExpr } from '../../timeunit';
import { duplicate, hash, keys, vals } from '../../util';
import { DataFlowNode } from './dataflow';
export class TimeUnitNode extends DataFlowNode {
    constructor(parent, formula) {
        super(parent);
        this.formula = formula;
    }
    clone() {
        return new TimeUnitNode(null, duplicate(this.formula));
    }
    static makeFromEncoding(parent, model) {
        const formula = model.reduceFieldDef((timeUnitComponent, fieldDef) => {
            if (fieldDef.timeUnit) {
                const f = vgField(fieldDef, { forAs: true });
                timeUnitComponent[f] = {
                    as: f,
                    timeUnit: fieldDef.timeUnit,
                    field: fieldDef.field
                };
            }
            return timeUnitComponent;
        }, {});
        if (keys(formula).length === 0) {
            return null;
        }
        return new TimeUnitNode(parent, formula);
    }
    static makeFromTransform(parent, t) {
        return new TimeUnitNode(parent, {
            [t.field]: {
                as: t.as,
                timeUnit: t.timeUnit,
                field: t.field
            }
        });
    }
    merge(other) {
        this.formula = Object.assign({}, this.formula, other.formula);
        other.remove();
    }
    producedFields() {
        return new Set(vals(this.formula).map(f => f.as));
    }
    dependentFields() {
        return new Set(vals(this.formula).map(f => f.field));
    }
    hash() {
        return `TimeUnit ${hash(this.formula)}`;
    }
    assemble() {
        return vals(this.formula).map(c => {
            return {
                type: 'formula',
                as: c.as,
                expr: fieldExpr(c.timeUnit, c.field)
            };
        });
    }
}
//# sourceMappingURL=timeunit.js.map