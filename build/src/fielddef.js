import * as tslib_1 from "tslib";
import { isArray, isBoolean, isNumber, isString } from 'vega-util';
import { isAggregateOp, isCountingAggregateOp } from './aggregate';
import { autoMaxBins, binToString, isBinned, isBinning } from './bin';
import { isScaleChannel, isSecondaryRangeChannel, POSITION_SCALE_CHANNELS, rangeType } from './channel';
import { dateTimeExpr, isDateTime } from './datetime';
import * as log from './log';
import { isFacetFieldDef } from './spec/facet';
import { getLocalTimeUnit, getTimeUnitParts, isLocalSingleTimeUnit, isUtcSingleTimeUnit, normalizeTimeUnit } from './timeunit';
import { getFullName, QUANTITATIVE } from './type';
import { contains, flatAccessWithDatum, getFirstDefined, replacePathInField, titlecase } from './util';
export function isConditionalSelection(c) {
    return c['selection'];
}
export function isRepeatRef(field) {
    return field && !isString(field) && 'repeat' in field;
}
export function toFieldDefBase(fieldDef) {
    const { field, timeUnit, bin, aggregate } = fieldDef;
    return Object.assign({}, (timeUnit ? { timeUnit } : {}), (bin ? { bin } : {}), (aggregate ? { aggregate } : {}), { field });
}
export function isSortableFieldDef(fieldDef) {
    return isTypedFieldDef(fieldDef) && !!fieldDef['sort'];
}
export function isConditionalDef(channelDef) {
    return !!channelDef && !!channelDef.condition;
}
/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export function hasConditionalFieldDef(channelDef) {
    return !!channelDef && !!channelDef.condition && !isArray(channelDef.condition) && isFieldDef(channelDef.condition);
}
export function hasConditionalValueDef(channelDef) {
    return !!channelDef && !!channelDef.condition && (isArray(channelDef.condition) || isValueDef(channelDef.condition));
}
export function isFieldDef(channelDef) {
    return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}
export function isTypedFieldDef(channelDef) {
    return !!channelDef && ((!!channelDef['field'] && !!channelDef['type']) || channelDef['aggregate'] === 'count');
}
export function isStringFieldDef(channelDef) {
    return isFieldDef(channelDef) && isString(channelDef.field);
}
export function isValueDef(channelDef) {
    return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
}
export function isScaleFieldDef(channelDef) {
    return !!channelDef && (!!channelDef['scale'] || !!channelDef['sort']);
}
export function isPositionFieldDef(channelDef) {
    return !!channelDef && (!!channelDef['axis'] || !!channelDef['stack'] || !!channelDef['impute']);
}
export function isMarkPropFieldDef(channelDef) {
    return !!channelDef && !!channelDef['legend'];
}
export function isTextFieldDef(channelDef) {
    return !!channelDef && !!channelDef['format'];
}
function isOpFieldDef(fieldDef) {
    return !!fieldDef['op'];
}
/**
 * Get a Vega field reference from a Vega-Lite field def.
 */
export function vgField(fieldDef, opt = {}) {
    let field = fieldDef.field;
    const prefix = opt.prefix;
    let suffix = opt.suffix;
    if (isCount(fieldDef)) {
        field = 'count_*';
    }
    else {
        let fn;
        if (!opt.nofn) {
            if (isOpFieldDef(fieldDef)) {
                fn = fieldDef.op;
            }
            else if (isBinning(fieldDef.bin)) {
                fn = binToString(fieldDef.bin);
                suffix = (opt.binSuffix || '') + (opt.suffix || '');
            }
            else if (fieldDef.aggregate) {
                fn = String(fieldDef.aggregate);
            }
            else if (fieldDef.timeUnit) {
                fn = String(fieldDef.timeUnit);
            }
        }
        if (fn) {
            field = field ? `${fn}_${field}` : fn;
        }
    }
    if (suffix) {
        field = `${field}_${suffix}`;
    }
    if (prefix) {
        field = `${prefix}_${field}`;
    }
    if (opt.forAs) {
        return field;
    }
    else if (opt.expr) {
        // Expression to access flattened field. No need to escape dots.
        return flatAccessWithDatum(field, opt.expr);
    }
    else {
        // We flattened all fields so paths should have become dot.
        return replacePathInField(field);
    }
}
export function isDiscrete(fieldDef) {
    switch (fieldDef.type) {
        case 'nominal':
        case 'ordinal':
        case 'geojson':
            return true;
        case 'quantitative':
            return !!fieldDef.bin;
        case 'temporal':
            return false;
    }
    throw new Error(log.message.invalidFieldType(fieldDef.type));
}
export function isContinuous(fieldDef) {
    return !isDiscrete(fieldDef);
}
export function isCount(fieldDef) {
    return fieldDef.aggregate === 'count';
}
export function verbalTitleFormatter(fieldDef, config) {
    const { field: field, bin, timeUnit, aggregate } = fieldDef;
    if (aggregate === 'count') {
        return config.countTitle;
    }
    else if (isBinning(bin)) {
        return `${field} (binned)`;
    }
    else if (timeUnit) {
        const units = getTimeUnitParts(timeUnit).join('-');
        return `${field} (${units})`;
    }
    else if (aggregate) {
        return `${titlecase(aggregate)} of ${field}`;
    }
    return field;
}
export function functionalTitleFormatter(fieldDef, config) {
    const fn = fieldDef.aggregate || fieldDef.timeUnit || (isBinning(fieldDef.bin) && 'bin');
    if (fn) {
        return fn.toUpperCase() + '(' + fieldDef.field + ')';
    }
    else {
        return fieldDef.field;
    }
}
export const defaultTitleFormatter = (fieldDef, config) => {
    switch (config.fieldTitle) {
        case 'plain':
            return fieldDef.field;
        case 'functional':
            return functionalTitleFormatter(fieldDef, config);
        default:
            return verbalTitleFormatter(fieldDef, config);
    }
};
let titleFormatter = defaultTitleFormatter;
export function setTitleFormatter(formatter) {
    titleFormatter = formatter;
}
export function resetTitleFormatter() {
    setTitleFormatter(defaultTitleFormatter);
}
export function title(fieldDef, config, { allowDisabling }) {
    const guide = getGuide(fieldDef) || {};
    const guideTitle = guide.title;
    if (allowDisabling) {
        return getFirstDefined(guideTitle, fieldDef.title, defaultTitle(fieldDef, config));
    }
    else {
        return guideTitle || fieldDef.title || defaultTitle(fieldDef, config);
    }
}
export function getGuide(fieldDef) {
    if (isPositionFieldDef(fieldDef) && fieldDef.axis) {
        return fieldDef.axis;
    }
    else if (isMarkPropFieldDef(fieldDef) && fieldDef.legend) {
        return fieldDef.legend;
    }
    else if (isFacetFieldDef(fieldDef) && fieldDef.header) {
        return fieldDef.header;
    }
    return undefined;
}
export function defaultTitle(fieldDef, config) {
    return titleFormatter(fieldDef, config);
}
export function format(fieldDef) {
    if (isTextFieldDef(fieldDef) && fieldDef.format) {
        return fieldDef.format;
    }
    else {
        const guide = getGuide(fieldDef) || {};
        return guide.format;
    }
}
export function defaultType(fieldDef, channel) {
    if (fieldDef.timeUnit) {
        return 'temporal';
    }
    if (isBinning(fieldDef.bin)) {
        return 'quantitative';
    }
    switch (rangeType(channel)) {
        case 'continuous':
            return 'quantitative';
        case 'discrete':
            return 'nominal';
        case 'flexible': // color
            return 'nominal';
        default:
            return 'quantitative';
    }
}
/**
 * Returns the fieldDef -- either from the outer channelDef or from the condition of channelDef.
 * @param channelDef
 */
export function getFieldDef(channelDef) {
    if (isFieldDef(channelDef)) {
        return channelDef;
    }
    else if (hasConditionalFieldDef(channelDef)) {
        return channelDef.condition;
    }
    return undefined;
}
export function getTypedFieldDef(channelDef) {
    if (isFieldDef(channelDef)) {
        return channelDef;
    }
    else if (hasConditionalFieldDef(channelDef)) {
        return channelDef.condition;
    }
    return undefined;
}
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export function normalize(channelDef, channel) {
    if (isString(channelDef) || isNumber(channelDef) || isBoolean(channelDef)) {
        const primitiveType = isString(channelDef) ? 'string' : isNumber(channelDef) ? 'number' : 'boolean';
        log.warn(log.message.primitiveChannelDef(channel, primitiveType, channelDef));
        return { value: channelDef };
    }
    // If a fieldDef contains a field, we need type.
    if (isFieldDef(channelDef)) {
        return normalizeFieldDef(channelDef, channel);
    }
    else if (hasConditionalFieldDef(channelDef)) {
        return Object.assign({}, channelDef, { 
            // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
            condition: normalizeFieldDef(channelDef.condition, channel) });
    }
    return channelDef;
}
export function normalizeFieldDef(fieldDef, channel) {
    // Drop invalid aggregate
    if (fieldDef.aggregate && !isAggregateOp(fieldDef.aggregate)) {
        const { aggregate } = fieldDef, fieldDefWithoutAggregate = tslib_1.__rest(fieldDef, ["aggregate"]);
        log.warn(log.message.invalidAggregate(fieldDef.aggregate));
        fieldDef = fieldDefWithoutAggregate;
    }
    // Normalize Time Unit
    if (fieldDef.timeUnit) {
        fieldDef = Object.assign({}, fieldDef, { timeUnit: normalizeTimeUnit(fieldDef.timeUnit) });
    }
    // Normalize bin
    if (isBinning(fieldDef.bin)) {
        fieldDef = Object.assign({}, fieldDef, { bin: normalizeBin(fieldDef.bin, channel) });
    }
    if (isBinned(fieldDef.bin) && !contains(POSITION_SCALE_CHANNELS, channel)) {
        log.warn(`Channel ${channel} should not be used with "binned" bin`);
    }
    // Normalize Type
    if (isTypedFieldDef(fieldDef)) {
        const fullType = getFullName(fieldDef.type);
        if (fieldDef.type !== fullType) {
            // convert short type to full type
            fieldDef = Object.assign({}, fieldDef, { type: fullType });
        }
        if (fieldDef.type !== 'quantitative') {
            if (isCountingAggregateOp(fieldDef.aggregate)) {
                log.warn(log.message.invalidFieldTypeForCountAggregate(fieldDef.type, fieldDef.aggregate));
                fieldDef = Object.assign({}, fieldDef, { type: 'quantitative' });
            }
        }
    }
    else if (!isSecondaryRangeChannel(channel)) {
        // If type is empty / invalid, then augment with default type
        const newType = defaultType(fieldDef, channel);
        log.warn(log.message.missingFieldType(channel, newType));
        fieldDef = Object.assign({}, fieldDef, { type: newType });
    }
    if (isTypedFieldDef(fieldDef)) {
        const { compatible, warning } = channelCompatibility(fieldDef, channel);
        if (!compatible) {
            log.warn(warning);
        }
    }
    return fieldDef;
}
export function normalizeBin(bin, channel) {
    if (isBoolean(bin)) {
        return { maxbins: autoMaxBins(channel) };
    }
    else if (!bin.maxbins && !bin.step) {
        return Object.assign({}, bin, { maxbins: autoMaxBins(channel) });
    }
    else {
        return bin;
    }
}
const COMPATIBLE = { compatible: true };
export function channelCompatibility(fieldDef, channel) {
    const type = fieldDef.type;
    if (type === 'geojson' && channel !== 'shape') {
        return {
            compatible: false,
            warning: `Channel ${channel} should not be used with a geojson data.`
        };
    }
    switch (channel) {
        case 'row':
        case 'column':
            if (isContinuous(fieldDef)) {
                return {
                    compatible: false,
                    warning: log.message.facetChannelShouldBeDiscrete(channel)
                };
            }
            return COMPATIBLE;
        case 'x':
        case 'y':
        case 'color':
        case 'fill':
        case 'stroke':
        case 'text':
        case 'detail':
        case 'key':
        case 'tooltip':
        case 'href':
            return COMPATIBLE;
        case 'longitude':
        case 'longitude2':
        case 'latitude':
        case 'latitude2':
            if (type !== QUANTITATIVE) {
                return {
                    compatible: false,
                    warning: `Channel ${channel} should be used with a quantitative field only, not ${fieldDef.type} field.`
                };
            }
            return COMPATIBLE;
        case 'opacity':
        case 'fillOpacity':
        case 'strokeOpacity':
        case 'strokeWidth':
        case 'size':
        case 'x2':
        case 'y2':
            if (type === 'nominal' && !fieldDef['sort']) {
                return {
                    compatible: false,
                    warning: `Channel ${channel} should not be used with an unsorted discrete field.`
                };
            }
            return COMPATIBLE;
        case 'shape':
            if (!contains(['ordinal', 'nominal', 'geojson'], fieldDef.type)) {
                return {
                    compatible: false,
                    warning: 'Shape channel should be used with only either discrete or geojson data.'
                };
            }
            return COMPATIBLE;
        case 'order':
            if (fieldDef.type === 'nominal' && !('sort' in fieldDef)) {
                return {
                    compatible: false,
                    warning: `Channel order is inappropriate for nominal field, which has no inherent order.`
                };
            }
            return COMPATIBLE;
    }
    throw new Error('channelCompatability not implemented for channel ' + channel);
}
export function isNumberFieldDef(fieldDef) {
    return fieldDef.type === 'quantitative' || isBinning(fieldDef.bin);
}
export function isTimeFieldDef(fieldDef) {
    return fieldDef.type === 'temporal' || !!fieldDef.timeUnit;
}
/**
 * Getting a value associated with a fielddef.
 * Convert the value to Vega expression if applicable (for datetime object, or string if the field def is temporal or has timeUnit)
 */
export function valueExpr(v, { timeUnit, type, time, undefinedIfExprNotRequired }) {
    let expr;
    if (isDateTime(v)) {
        expr = dateTimeExpr(v, true);
    }
    else if (isString(v) || isNumber(v)) {
        if (timeUnit || type === 'temporal') {
            if (isLocalSingleTimeUnit(timeUnit)) {
                expr = dateTimeExpr({ [timeUnit]: v }, true);
            }
            else if (isUtcSingleTimeUnit(timeUnit)) {
                // FIXME is this really correct?
                expr = valueExpr(v, { timeUnit: getLocalTimeUnit(timeUnit) });
            }
            else {
                // just pass the string to date function (which will call JS Date.parse())
                expr = `datetime(${JSON.stringify(v)})`;
            }
        }
    }
    if (expr) {
        return time ? `time(${expr})` : expr;
    }
    // number or boolean or normal string
    return undefinedIfExprNotRequired ? undefined : JSON.stringify(v);
}
/**
 * Standardize value array -- convert each value to Vega expression if applicable
 */
export function valueArray(fieldDef, values) {
    const { timeUnit, type } = fieldDef;
    return values.map(v => {
        const expr = valueExpr(v, { timeUnit, type, undefinedIfExprNotRequired: true });
        // return signal for the expression if we need an expression
        if (expr !== undefined) {
            return { signal: expr };
        }
        // otherwise just return the original value
        return v;
    });
}
/**
 * Checks whether a fieldDef for a particular channel requires a computed bin range.
 */
export function binRequiresRange(fieldDef, channel) {
    if (!isBinning(fieldDef.bin)) {
        console.warn('Only use this method with binned field defs');
        return false;
    }
    // We need the range only when the user explicitly forces a binned field to be use discrete scale. In this case, bin range is used in axis and legend labels.
    // We could check whether the axis or legend exists (not disabled) but that seems overkill.
    return isScaleChannel(channel) && contains(['ordinal', 'nominal'], fieldDef.type);
}
//# sourceMappingURL=fielddef.js.map