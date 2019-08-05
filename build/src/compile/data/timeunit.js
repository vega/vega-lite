import { getSecondaryRangeChannel } from '../../channel';
import { hasBand, vgField } from '../../channeldef';
import { fieldExpr } from '../../timeunit';
import { duplicate, hash, keys, vals } from '../../util';
import { isUnitModel } from '../model';
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
        const formula = model.reduceFieldDef((timeUnitComponent, fieldDef, channel) => {
            const { timeUnit, field } = fieldDef;
            const channelDef2 = isUnitModel(model) ? model.encoding[getSecondaryRangeChannel(channel)] : undefined;
            const band = isUnitModel(model) && hasBand(channel, fieldDef, channelDef2, model.markDef, model.config);
            if (timeUnit) {
                const as = vgField(fieldDef, { forAs: true });
                timeUnitComponent[hash({ as, timeUnit, field })] = Object.assign({ as,
                    timeUnit,
                    field }, (band ? { band: true } : {}));
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
        this.formula = Object.assign({}, this.formula);
        // if the same hash happen twice, merge "band"
        for (const key in other.formula) {
            if (!this.formula[key] || other.formula[key].band) {
                // copy if it's not a duplicate or if we need to include copy band over
                this.formula[key] = other.formula[key];
            }
        }
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
        const transforms = [];
        for (const f of vals(this.formula)) {
            const { timeUnit, field, as, band } = f;
            transforms.push({
                type: 'formula',
                as,
                expr: fieldExpr(timeUnit, field)
            });
            if (band) {
                transforms.push({
                    type: 'formula',
                    as: as + '_end',
                    expr: fieldExpr(timeUnit, field, { end: true })
                });
            }
        }
        return transforms;
    }
}
//# sourceMappingURL=timeunit.js.map