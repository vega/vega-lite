import { getBandPosition, vgField } from '../../channeldef';
import { getDateTimePartAndStep, getSmallestTimeUnitPart, getTimeUnitParts, isBinnedTimeUnit, normalizeTimeUnit } from '../../timeunit';
import { duplicate, entries, hash, isEmpty, replacePathInField, vals } from '../../util';
import { isUnitModel } from '../model';
import { DataFlowNode } from './dataflow';
import { isRectBasedMark } from '../../mark';
import { isXorY } from '../../channel';
function isTimeUnitTransformComponent(timeUnitComponent) {
    return timeUnitComponent.as !== undefined;
}
function offsetAs(field) {
    return `${field}_end`;
}
export class TimeUnitNode extends DataFlowNode {
    clone() {
        return new TimeUnitNode(null, duplicate(this.timeUnits));
    }
    constructor(parent, timeUnits) {
        super(parent);
        this.timeUnits = timeUnits;
    }
    static makeFromEncoding(parent, model) {
        const formula = model.reduceFieldDef((timeUnitComponent, fieldDef, channel) => {
            const { field, timeUnit } = fieldDef;
            if (timeUnit) {
                let component;
                if (isBinnedTimeUnit(timeUnit)) {
                    // For binned time unit, only produce end if the mark is a rect-based mark (rect, bar, image, arc), which needs "range".
                    if (isUnitModel(model)) {
                        const { mark, markDef, config } = model;
                        const bandPosition = getBandPosition({ fieldDef, markDef, config });
                        if (isRectBasedMark(mark) || !!bandPosition) {
                            component = {
                                timeUnit: normalizeTimeUnit(timeUnit),
                                field
                            };
                        }
                    }
                }
                else {
                    component = {
                        as: vgField(fieldDef, { forAs: true }),
                        field,
                        timeUnit
                    };
                }
                if (isUnitModel(model)) {
                    const { mark, markDef, config } = model;
                    const bandPosition = getBandPosition({ fieldDef, markDef, config });
                    if (isRectBasedMark(mark) && isXorY(channel) && bandPosition !== 0.5) {
                        component.rectBandPosition = bandPosition;
                    }
                }
                if (component) {
                    timeUnitComponent[hash(component)] = component;
                }
            }
            return timeUnitComponent;
        }, {});
        if (isEmpty(formula)) {
            return null;
        }
        return new TimeUnitNode(parent, formula);
    }
    static makeFromTransform(parent, t) {
        const { timeUnit, ...other } = { ...t };
        const normalizedTimeUnit = normalizeTimeUnit(timeUnit);
        const component = {
            ...other,
            timeUnit: normalizedTimeUnit
        };
        return new TimeUnitNode(parent, {
            [hash(component)]: component
        });
    }
    /**
     * Merge together TimeUnitNodes assigning the children of `other` to `this`
     * and removing `other`.
     */
    merge(other) {
        this.timeUnits = { ...this.timeUnits };
        // if the same hash happen twice, merge
        for (const key in other.timeUnits) {
            if (!this.timeUnits[key]) {
                // copy if it's not a duplicate
                this.timeUnits[key] = other.timeUnits[key];
            }
        }
        for (const child of other.children) {
            other.removeChild(child);
            child.parent = this;
        }
        other.remove();
    }
    /**
     * Remove time units coming from the other node.
     */
    removeFormulas(fields) {
        const newFormula = {};
        for (const [key, timeUnitComponent] of entries(this.timeUnits)) {
            const fieldAs = isTimeUnitTransformComponent(timeUnitComponent)
                ? timeUnitComponent.as
                : `${timeUnitComponent.field}_end`;
            if (!fields.has(fieldAs)) {
                newFormula[key] = timeUnitComponent;
            }
        }
        this.timeUnits = newFormula;
    }
    producedFields() {
        return new Set(vals(this.timeUnits).map(f => {
            return isTimeUnitTransformComponent(f) ? f.as : offsetAs(f.field);
        }));
    }
    dependentFields() {
        return new Set(vals(this.timeUnits).map(f => f.field));
    }
    hash() {
        return `TimeUnit ${hash(this.timeUnits)}`;
    }
    assemble() {
        const transforms = [];
        for (const f of vals(this.timeUnits)) {
            const { rectBandPosition } = f;
            const normalizedTimeUnit = normalizeTimeUnit(f.timeUnit);
            if (isTimeUnitTransformComponent(f)) {
                const { field, as } = f;
                const { unit, utc, ...params } = normalizedTimeUnit;
                const startEnd = [as, `${as}_end`];
                transforms.push({
                    field: replacePathInField(field),
                    type: 'timeunit',
                    ...(unit ? { units: getTimeUnitParts(unit) } : {}),
                    ...(utc ? { timezone: 'utc' } : {}),
                    ...params,
                    as: startEnd
                });
                transforms.push(...offsetedRectFormulas(startEnd, rectBandPosition, normalizedTimeUnit));
            }
            else if (f) {
                const { field: escapedField } = f;
                // since this is a expression, we want the unescaped field name
                const field = escapedField.replaceAll('\\.', '.');
                const expr = offsetExpr({ timeUnit: normalizedTimeUnit, field });
                const endAs = offsetAs(field);
                transforms.push({
                    type: 'formula',
                    expr,
                    as: endAs
                });
                transforms.push(...offsetedRectFormulas([field, endAs], rectBandPosition, normalizedTimeUnit));
            }
        }
        return transforms;
    }
}
export const OFFSETTED_RECT_START_SUFFIX = 'offsetted_rect_start';
export const OFFSETTED_RECT_END_SUFFIX = 'offsetted_rect_end';
function offsetExpr({ timeUnit, field, reverse }) {
    const { unit, utc } = timeUnit;
    const smallestUnit = getSmallestTimeUnitPart(unit);
    const { part, step } = getDateTimePartAndStep(smallestUnit, timeUnit.step);
    const offsetFn = utc ? 'utcOffset' : 'timeOffset';
    const expr = `${offsetFn}('${part}', datum['${field}'], ${reverse ? -step : step})`;
    return expr;
}
function offsetedRectFormulas([startField, endField], rectBandPosition, timeUnit) {
    if (rectBandPosition !== undefined && rectBandPosition !== 0.5) {
        const startExpr = `datum['${startField}']`;
        const endExpr = `datum['${endField}']`;
        return [
            {
                type: 'formula',
                expr: interpolateExpr([
                    offsetExpr({
                        timeUnit,
                        field: startField,
                        reverse: true
                    }),
                    startExpr
                ], rectBandPosition + 0.5),
                as: `${startField}_${OFFSETTED_RECT_START_SUFFIX}`
            },
            {
                type: 'formula',
                expr: interpolateExpr([startExpr, endExpr], rectBandPosition + 0.5),
                as: `${startField}_${OFFSETTED_RECT_END_SUFFIX}`
            }
        ];
    }
    return [];
}
function interpolateExpr([start, end], fraction) {
    return `${1 - fraction} * ${start} + ${fraction} * ${end}`;
}
//# sourceMappingURL=timeunit.js.map