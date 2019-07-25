import { vgField } from '../../channeldef';
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
            const { timeUnit, field } = fieldDef;
            if (timeUnit) {
                const as = vgField(fieldDef, { forAs: true });
                const component = { as, timeUnit, field };
                timeUnitComponent[hash(component)] = component;
            }
            return timeUnitComponent;
        }, {});
        if (keys(formula).length === 0) {
            return null;
        }
        return new TimeUnitNode(parent, formula);
    }
    static makeFromTransform(parent, t) {
        const component = Object.assign({}, t);
        return new TimeUnitNode(parent, {
            [hash(component)]: component
        });
    }
    /**
     * Merge together TimeUnitNodes assigning the children of `other` to `this`
     * and removing `other`.
     */
    merge(other) {
        this.formula = Object.assign({}, this.formula, other.formula);
        for (const child of other.children) {
            other.removeChild(child);
            child.parent = this;
        }
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