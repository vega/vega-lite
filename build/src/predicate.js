import { isArray } from 'vega-util';
import { valueExpr, vgField } from './fielddef';
import { fieldExpr as timeUnitFieldExpr, normalizeTimeUnit } from './timeunit';
export function isSelectionPredicate(predicate) {
    return predicate && predicate['selection'];
}
export function isFieldEqualPredicate(predicate) {
    return predicate && !!predicate.field && predicate.equal !== undefined;
}
export function isFieldLTPredicate(predicate) {
    return predicate && !!predicate.field && predicate.lt !== undefined;
}
export function isFieldLTEPredicate(predicate) {
    return predicate && !!predicate.field && predicate.lte !== undefined;
}
export function isFieldGTPredicate(predicate) {
    return predicate && !!predicate.field && predicate.gt !== undefined;
}
export function isFieldGTEPredicate(predicate) {
    return predicate && !!predicate.field && predicate.gte !== undefined;
}
export function isFieldRangePredicate(predicate) {
    if (predicate && predicate.field) {
        if (isArray(predicate.range) && predicate.range.length === 2) {
            return true;
        }
    }
    return false;
}
export function isFieldOneOfPredicate(predicate) {
    return (predicate && !!predicate.field && (isArray(predicate.oneOf) || isArray(predicate.in)) // backward compatibility
    );
}
export function isFieldValidPredicate(predicate) {
    return predicate && !!predicate.field && predicate.valid !== undefined;
}
export function isFieldPredicate(predicate) {
    return (isFieldOneOfPredicate(predicate) ||
        isFieldEqualPredicate(predicate) ||
        isFieldRangePredicate(predicate) ||
        isFieldLTPredicate(predicate) ||
        isFieldGTPredicate(predicate) ||
        isFieldLTEPredicate(predicate) ||
        isFieldGTEPredicate(predicate));
}
function predicateValueExpr(v, timeUnit) {
    return valueExpr(v, { timeUnit, time: true });
}
function predicateValuesExpr(vals, timeUnit) {
    return vals.map(v => predicateValueExpr(v, timeUnit));
}
// This method is used by Voyager.  Do not change its behavior without changing Voyager.
export function fieldFilterExpression(predicate, useInRange = true) {
    const { field, timeUnit } = predicate;
    const fieldExpr = timeUnit
        ? // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
            // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
            // TODO: support utc
            'time(' + timeUnitFieldExpr(timeUnit, field) + ')'
        : vgField(predicate, { expr: 'datum' });
    if (isFieldEqualPredicate(predicate)) {
        return fieldExpr + '===' + predicateValueExpr(predicate.equal, timeUnit);
    }
    else if (isFieldLTPredicate(predicate)) {
        const upper = predicate.lt;
        return `${fieldExpr}<${predicateValueExpr(upper, timeUnit)}`;
    }
    else if (isFieldGTPredicate(predicate)) {
        const lower = predicate.gt;
        return `${fieldExpr}>${predicateValueExpr(lower, timeUnit)}`;
    }
    else if (isFieldLTEPredicate(predicate)) {
        const upper = predicate.lte;
        return `${fieldExpr}<=${predicateValueExpr(upper, timeUnit)}`;
    }
    else if (isFieldGTEPredicate(predicate)) {
        const lower = predicate.gte;
        return `${fieldExpr}>=${predicateValueExpr(lower, timeUnit)}`;
    }
    else if (isFieldOneOfPredicate(predicate)) {
        return `indexof([${predicateValuesExpr(predicate.oneOf, timeUnit).join(',')}], ${fieldExpr}) !== -1`;
    }
    else if (isFieldValidPredicate(predicate)) {
        return predicate.valid ? `${fieldExpr}!==null&&!isNaN(${fieldExpr})` : `${fieldExpr}===null||isNaN(${fieldExpr})`;
    }
    else if (isFieldRangePredicate(predicate)) {
        const lower = predicate.range[0];
        const upper = predicate.range[1];
        if (lower !== null && upper !== null && useInRange) {
            return ('inrange(' +
                fieldExpr +
                ', [' +
                predicateValueExpr(lower, timeUnit) +
                ', ' +
                predicateValueExpr(upper, timeUnit) +
                '])');
        }
        const exprs = [];
        if (lower !== null) {
            exprs.push(`${fieldExpr} >= ${predicateValueExpr(lower, timeUnit)}`);
        }
        if (upper !== null) {
            exprs.push(`${fieldExpr} <= ${predicateValueExpr(upper, timeUnit)}`);
        }
        return exprs.length > 0 ? exprs.join(' && ') : 'true';
    }
    /* istanbul ignore next: it should never reach here */
    throw new Error(`Invalid field predicate: ${JSON.stringify(predicate)}`);
}
export function normalizePredicate(f) {
    if (isFieldPredicate(f) && f.timeUnit) {
        return Object.assign({}, f, { timeUnit: normalizeTimeUnit(f.timeUnit) });
    }
    return f;
}
//# sourceMappingURL=predicate.js.map