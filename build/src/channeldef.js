import { isArray, isBoolean, isNumber, isString } from 'vega-util';
import { isAggregateOp, isArgmaxDef, isArgminDef, isCountingAggregateOp } from './aggregate';
import { autoMaxBins, binToString, isBinned, isBinning } from './bin';
import { ANGLE, COLOR, COLUMN, DESCRIPTION, DETAIL, FACET, FILL, FILLOPACITY, getSizeChannel, HREF, isScaleChannel, isSecondaryRangeChannel, isXorY, KEY, LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2, OPACITY, ORDER, RADIUS, RADIUS2, ROW, SHAPE, SIZE, STROKE, STROKEDASH, STROKEOPACITY, STROKEWIDTH, TEXT, THETA, THETA2, TOOLTIP, URL, X, X2, XOFFSET, Y, Y2, YOFFSET } from './channel';
import { getMarkConfig, getMarkPropOrConfig } from './compile/common';
import { isCustomFormatType } from './compile/format';
import { dateTimeToExpr, isDateTime } from './datetime';
import { isExprRef } from './expr';
import * as log from './log';
import { isRectBasedMark } from './mark';
import { hasDiscreteDomain, isContinuousToDiscrete, SCALE_CATEGORY_INDEX } from './scale';
import { isSortByChannel } from './sort';
import { isFacetFieldDef } from './spec/facet';
import { getTimeUnitParts, isBinnedTimeUnit, isLocalSingleTimeUnit, normalizeTimeUnit, timeUnitToString } from './timeunit';
import { getFullName, QUANTITATIVE } from './type';
import { flatAccessWithDatum, getFirstDefined, internalField, omit, removePathFromField, replacePathInField, stringify, titleCase } from './util';
import { isSignalRef } from './vega.schema';
export function isConditionalParameter(c) {
    return c['param'];
}
export function isRepeatRef(field) {
    return field && !isString(field) && 'repeat' in field;
}
export function toFieldDefBase(fieldDef) {
    const { field, timeUnit, bin, aggregate } = fieldDef;
    return {
        ...(timeUnit ? { timeUnit } : {}),
        ...(bin ? { bin } : {}),
        ...(aggregate ? { aggregate } : {}),
        field
    };
}
export function isSortableFieldDef(fieldDef) {
    return 'sort' in fieldDef;
}
export function getBandPosition({ fieldDef, fieldDef2, markDef: mark, config }) {
    if (isFieldOrDatumDef(fieldDef) && fieldDef.bandPosition !== undefined) {
        return fieldDef.bandPosition;
    }
    if (isFieldDef(fieldDef)) {
        const { timeUnit, bin } = fieldDef;
        if (timeUnit && !fieldDef2) {
            return getMarkConfig('timeUnitBandPosition', mark, config);
        }
        else if (isBinning(bin)) {
            return 0.5;
        }
    }
    return undefined;
}
export function getBandSize({ channel, fieldDef, fieldDef2, markDef: mark, config, scaleType, useVlSizeChannel }) {
    const sizeChannel = getSizeChannel(channel);
    const size = getMarkPropOrConfig(useVlSizeChannel ? 'size' : sizeChannel, mark, config, {
        vgChannel: sizeChannel
    });
    if (size !== undefined) {
        return size;
    }
    if (isFieldDef(fieldDef)) {
        const { timeUnit, bin } = fieldDef;
        if (timeUnit && !fieldDef2) {
            return { band: getMarkConfig('timeUnitBandSize', mark, config) };
        }
        else if (isBinning(bin) && !hasDiscreteDomain(scaleType)) {
            return { band: 1 };
        }
    }
    if (isRectBasedMark(mark.type)) {
        if (scaleType) {
            if (hasDiscreteDomain(scaleType)) {
                return config[mark.type]?.discreteBandSize || { band: 1 };
            }
            else {
                return config[mark.type]?.continuousBandSize;
            }
        }
        return config[mark.type]?.discreteBandSize;
    }
    return undefined;
}
export function hasBandEnd(fieldDef, fieldDef2, markDef, config) {
    if (isBinning(fieldDef.bin) || (fieldDef.timeUnit && isTypedFieldDef(fieldDef) && fieldDef.type === 'temporal')) {
        // Need to check bandPosition because non-rect marks (e.g., point) with timeUnit
        // doesn't have to use bandEnd if there is no bandPosition.
        return getBandPosition({ fieldDef, fieldDef2, markDef, config }) !== undefined;
    }
    return false;
}
export function isOrderOnlyDef(orderDef) {
    return orderDef && !!orderDef.sort && !orderDef['field'];
}
export function isConditionalDef(channelDef) {
    return channelDef && 'condition' in channelDef;
}
/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export function hasConditionalFieldDef(channelDef) {
    const condition = channelDef?.['condition'];
    return !!condition && !isArray(condition) && isFieldDef(condition);
}
export function hasConditionalFieldOrDatumDef(channelDef) {
    const condition = channelDef?.['condition'];
    return !!condition && !isArray(condition) && isFieldOrDatumDef(condition);
}
export function hasConditionalValueDef(channelDef) {
    const condition = channelDef?.['condition'];
    return !!condition && (isArray(condition) || isValueDef(condition));
}
export function isFieldDef(channelDef) {
    // TODO: we can't use field in channelDef here as it's somehow failing runtime test
    return channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}
export function channelDefType(channelDef) {
    return channelDef?.['type'];
}
export function isDatumDef(channelDef) {
    return channelDef && 'datum' in channelDef;
}
export function isContinuousFieldOrDatumDef(cd) {
    // TODO: make datum support DateTime object
    return (isTypedFieldDef(cd) && !isDiscrete(cd)) || isNumericDataDef(cd);
}
export function isUnbinnedQuantitativeFieldOrDatumDef(cd) {
    // TODO: make datum support DateTime object
    return (isTypedFieldDef(cd) && cd.type === 'quantitative' && !cd.bin) || isNumericDataDef(cd);
}
export function isNumericDataDef(cd) {
    return isDatumDef(cd) && isNumber(cd.datum);
}
export function isFieldOrDatumDef(channelDef) {
    return isFieldDef(channelDef) || isDatumDef(channelDef);
}
export function isTypedFieldDef(channelDef) {
    return channelDef && ('field' in channelDef || channelDef['aggregate'] === 'count') && 'type' in channelDef;
}
export function isValueDef(channelDef) {
    return channelDef && 'value' in channelDef && 'value' in channelDef;
}
export function isScaleFieldDef(channelDef) {
    return channelDef && ('scale' in channelDef || 'sort' in channelDef);
}
export function isPositionFieldOrDatumDef(channelDef) {
    return channelDef && ('axis' in channelDef || 'stack' in channelDef || 'impute' in channelDef);
}
export function isMarkPropFieldOrDatumDef(channelDef) {
    return channelDef && 'legend' in channelDef;
}
export function isStringFieldOrDatumDef(channelDef) {
    return channelDef && ('format' in channelDef || 'formatType' in channelDef);
}
export function toStringFieldDef(fieldDef) {
    // omit properties that don't exist in string field defs
    return omit(fieldDef, ['legend', 'axis', 'header', 'scale']);
}
function isOpFieldDef(fieldDef) {
    return 'op' in fieldDef;
}
/**
 * Get a Vega field reference from a Vega-Lite field def.
 */
export function vgField(fieldDef, opt = {}) {
    let field = fieldDef.field;
    const prefix = opt.prefix;
    let suffix = opt.suffix;
    let argAccessor = ''; // for accessing argmin/argmax field at the end without getting escaped
    if (isCount(fieldDef)) {
        field = internalField('count');
    }
    else {
        let fn;
        if (!opt.nofn) {
            if (isOpFieldDef(fieldDef)) {
                fn = fieldDef.op;
            }
            else {
                const { bin, aggregate, timeUnit } = fieldDef;
                if (isBinning(bin)) {
                    fn = binToString(bin);
                    suffix = (opt.binSuffix ?? '') + (opt.suffix ?? '');
                }
                else if (aggregate) {
                    if (isArgmaxDef(aggregate)) {
                        argAccessor = `["${field}"]`;
                        field = `argmax_${aggregate.argmax}`;
                    }
                    else if (isArgminDef(aggregate)) {
                        argAccessor = `["${field}"]`;
                        field = `argmin_${aggregate.argmin}`;
                    }
                    else {
                        fn = String(aggregate);
                    }
                }
                else if (timeUnit && !isBinnedTimeUnit(timeUnit)) {
                    fn = timeUnitToString(timeUnit);
                    suffix = ((!['range', 'mid'].includes(opt.binSuffix) && opt.binSuffix) || '') + (opt.suffix ?? '');
                }
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
        return removePathFromField(field);
    }
    else if (opt.expr) {
        // Expression to access flattened field. No need to escape dots.
        return flatAccessWithDatum(field, opt.expr) + argAccessor;
    }
    else {
        // We flattened all fields so paths should have become dot.
        return replacePathInField(field) + argAccessor;
    }
}
export function isDiscrete(def) {
    switch (def.type) {
        case 'nominal':
        case 'ordinal':
        case 'geojson':
            return true;
        case 'quantitative':
            return isFieldDef(def) && !!def.bin;
        case 'temporal':
            return false;
    }
    throw new Error(log.message.invalidFieldType(def.type));
}
export function isDiscretizing(def) {
    return isScaleFieldDef(def) && isContinuousToDiscrete(def.scale?.type);
}
export function isCount(fieldDef) {
    return fieldDef.aggregate === 'count';
}
export function verbalTitleFormatter(fieldDef, config) {
    const { field, bin, timeUnit, aggregate } = fieldDef;
    if (aggregate === 'count') {
        return config.countTitle;
    }
    else if (isBinning(bin)) {
        return `${field} (binned)`;
    }
    else if (timeUnit && !isBinnedTimeUnit(timeUnit)) {
        const unit = normalizeTimeUnit(timeUnit)?.unit;
        if (unit) {
            return `${field} (${getTimeUnitParts(unit).join('-')})`;
        }
    }
    else if (aggregate) {
        if (isArgmaxDef(aggregate)) {
            return `${field} for max ${aggregate.argmax}`;
        }
        else if (isArgminDef(aggregate)) {
            return `${field} for min ${aggregate.argmin}`;
        }
        else {
            return `${titleCase(aggregate)} of ${field}`;
        }
    }
    return field;
}
export function functionalTitleFormatter(fieldDef) {
    const { aggregate, bin, timeUnit, field } = fieldDef;
    if (isArgmaxDef(aggregate)) {
        return `${field} for argmax(${aggregate.argmax})`;
    }
    else if (isArgminDef(aggregate)) {
        return `${field} for argmin(${aggregate.argmin})`;
    }
    const timeUnitParams = timeUnit && !isBinnedTimeUnit(timeUnit) ? normalizeTimeUnit(timeUnit) : undefined;
    const fn = aggregate || timeUnitParams?.unit || (timeUnitParams?.maxbins && 'timeunit') || (isBinning(bin) && 'bin');
    if (fn) {
        return `${fn.toUpperCase()}(${field})`;
    }
    else {
        return field;
    }
}
export const defaultTitleFormatter = (fieldDef, config) => {
    switch (config.fieldTitle) {
        case 'plain':
            return fieldDef.field;
        case 'functional':
            return functionalTitleFormatter(fieldDef);
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
export function title(fieldOrDatumDef, config, { allowDisabling, includeDefault = true }) {
    const guideTitle = getGuide(fieldOrDatumDef)?.title;
    if (!isFieldDef(fieldOrDatumDef)) {
        return guideTitle ?? fieldOrDatumDef.title;
    }
    const fieldDef = fieldOrDatumDef;
    const def = includeDefault ? defaultTitle(fieldDef, config) : undefined;
    if (allowDisabling) {
        return getFirstDefined(guideTitle, fieldDef.title, def);
    }
    else {
        return guideTitle ?? fieldDef.title ?? def;
    }
}
export function getGuide(fieldDef) {
    if (isPositionFieldOrDatumDef(fieldDef) && fieldDef.axis) {
        return fieldDef.axis;
    }
    else if (isMarkPropFieldOrDatumDef(fieldDef) && fieldDef.legend) {
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
export function getFormatMixins(fieldDef) {
    if (isStringFieldOrDatumDef(fieldDef)) {
        const { format, formatType } = fieldDef;
        return { format, formatType };
    }
    else {
        const guide = getGuide(fieldDef) ?? {};
        const { format, formatType } = guide;
        return { format, formatType };
    }
}
export function defaultType(fieldDef, channel) {
    switch (channel) {
        case 'latitude':
        case 'longitude':
            return 'quantitative';
        case 'row':
        case 'column':
        case 'facet':
        case 'shape':
        case 'strokeDash':
            return 'nominal';
        case 'order':
            return 'ordinal';
    }
    if (isSortableFieldDef(fieldDef) && isArray(fieldDef.sort)) {
        return 'ordinal';
    }
    const { aggregate, bin, timeUnit } = fieldDef;
    if (timeUnit) {
        return 'temporal';
    }
    if (bin || (aggregate && !isArgmaxDef(aggregate) && !isArgminDef(aggregate))) {
        return 'quantitative';
    }
    if (isScaleFieldDef(fieldDef) && fieldDef.scale?.type) {
        switch (SCALE_CATEGORY_INDEX[fieldDef.scale.type]) {
            case 'numeric':
            case 'discretizing':
                return 'quantitative';
            case 'time':
                return 'temporal';
        }
    }
    return 'nominal';
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
export function getFieldOrDatumDef(channelDef) {
    if (isFieldOrDatumDef(channelDef)) {
        return channelDef;
    }
    else if (hasConditionalFieldOrDatumDef(channelDef)) {
        return channelDef.condition;
    }
    return undefined;
}
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export function initChannelDef(channelDef, channel, config, opt = {}) {
    if (isString(channelDef) || isNumber(channelDef) || isBoolean(channelDef)) {
        const primitiveType = isString(channelDef) ? 'string' : isNumber(channelDef) ? 'number' : 'boolean';
        log.warn(log.message.primitiveChannelDef(channel, primitiveType, channelDef));
        return { value: channelDef };
    }
    // If a fieldDef contains a field, we need type.
    if (isFieldOrDatumDef(channelDef)) {
        return initFieldOrDatumDef(channelDef, channel, config, opt);
    }
    else if (hasConditionalFieldOrDatumDef(channelDef)) {
        return {
            ...channelDef,
            // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
            condition: initFieldOrDatumDef(channelDef.condition, channel, config, opt)
        };
    }
    return channelDef;
}
export function initFieldOrDatumDef(fd, channel, config, opt) {
    if (isStringFieldOrDatumDef(fd)) {
        const { format, formatType, ...rest } = fd;
        if (isCustomFormatType(formatType) && !config.customFormatTypes) {
            log.warn(log.message.customFormatTypeNotAllowed(channel));
            return initFieldOrDatumDef(rest, channel, config, opt);
        }
    }
    else {
        const guideType = isPositionFieldOrDatumDef(fd)
            ? 'axis'
            : isMarkPropFieldOrDatumDef(fd)
                ? 'legend'
                : isFacetFieldDef(fd)
                    ? 'header'
                    : null;
        if (guideType && fd[guideType]) {
            const { format, formatType, ...newGuide } = fd[guideType];
            if (isCustomFormatType(formatType) && !config.customFormatTypes) {
                log.warn(log.message.customFormatTypeNotAllowed(channel));
                return initFieldOrDatumDef({ ...fd, [guideType]: newGuide }, channel, config, opt);
            }
        }
    }
    if (isFieldDef(fd)) {
        return initFieldDef(fd, channel, opt);
    }
    return initDatumDef(fd);
}
function initDatumDef(datumDef) {
    let type = datumDef['type'];
    if (type) {
        return datumDef;
    }
    const { datum } = datumDef;
    type = isNumber(datum) ? 'quantitative' : isString(datum) ? 'nominal' : isDateTime(datum) ? 'temporal' : undefined;
    return { ...datumDef, type };
}
export function initFieldDef(fd, channel, { compositeMark = false } = {}) {
    const { aggregate, timeUnit, bin, field } = fd;
    const fieldDef = { ...fd };
    // Drop invalid aggregate
    if (!compositeMark && aggregate && !isAggregateOp(aggregate) && !isArgmaxDef(aggregate) && !isArgminDef(aggregate)) {
        log.warn(log.message.invalidAggregate(aggregate));
        delete fieldDef.aggregate;
    }
    // Normalize Time Unit
    if (timeUnit) {
        fieldDef.timeUnit = normalizeTimeUnit(timeUnit);
    }
    if (field) {
        fieldDef.field = `${field}`;
    }
    // Normalize bin
    if (isBinning(bin)) {
        fieldDef.bin = normalizeBin(bin, channel);
    }
    if (isBinned(bin) && !isXorY(channel)) {
        log.warn(log.message.channelShouldNotBeUsedForBinned(channel));
    }
    // Normalize Type
    if (isTypedFieldDef(fieldDef)) {
        const { type } = fieldDef;
        const fullType = getFullName(type);
        if (type !== fullType) {
            // convert short type to full type
            fieldDef.type = fullType;
        }
        if (type !== 'quantitative') {
            if (isCountingAggregateOp(aggregate)) {
                log.warn(log.message.invalidFieldTypeForCountAggregate(type, aggregate));
                fieldDef.type = 'quantitative';
            }
        }
    }
    else if (!isSecondaryRangeChannel(channel)) {
        // If type is empty / invalid, then augment with default type
        const newType = defaultType(fieldDef, channel);
        fieldDef['type'] = newType;
    }
    if (isTypedFieldDef(fieldDef)) {
        const { compatible, warning } = channelCompatibility(fieldDef, channel) || {};
        if (compatible === false) {
            log.warn(warning);
        }
    }
    if (isSortableFieldDef(fieldDef) && isString(fieldDef.sort)) {
        const { sort } = fieldDef;
        if (isSortByChannel(sort)) {
            return {
                ...fieldDef,
                sort: { encoding: sort }
            };
        }
        const sub = sort.substr(1);
        if (sort.charAt(0) === '-' && isSortByChannel(sub)) {
            return {
                ...fieldDef,
                sort: { encoding: sub, order: 'descending' }
            };
        }
    }
    if (isFacetFieldDef(fieldDef)) {
        const { header } = fieldDef;
        if (header) {
            const { orient, ...rest } = header;
            if (orient) {
                return {
                    ...fieldDef,
                    header: {
                        ...rest,
                        labelOrient: header.labelOrient || orient,
                        titleOrient: header.titleOrient || orient
                    }
                };
            }
        }
    }
    return fieldDef;
}
export function normalizeBin(bin, channel) {
    if (isBoolean(bin)) {
        return { maxbins: autoMaxBins(channel) };
    }
    else if (bin === 'binned') {
        return {
            binned: true
        };
    }
    else if (!bin.maxbins && !bin.step) {
        return { ...bin, maxbins: autoMaxBins(channel) };
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
        case ROW:
        case COLUMN:
        case FACET:
            if (!isDiscrete(fieldDef)) {
                return {
                    compatible: false,
                    warning: log.message.channelShouldBeDiscrete(channel)
                };
            }
            return COMPATIBLE;
        case X:
        case Y:
        case XOFFSET:
        case YOFFSET:
        case COLOR:
        case FILL:
        case STROKE:
        case TEXT:
        case DETAIL:
        case KEY:
        case TOOLTIP:
        case HREF:
        case URL:
        case ANGLE:
        case THETA:
        case RADIUS:
        case DESCRIPTION:
            return COMPATIBLE;
        case LONGITUDE:
        case LONGITUDE2:
        case LATITUDE:
        case LATITUDE2:
            if (type !== QUANTITATIVE) {
                return {
                    compatible: false,
                    warning: `Channel ${channel} should be used with a quantitative field only, not ${fieldDef.type} field.`
                };
            }
            return COMPATIBLE;
        case OPACITY:
        case FILLOPACITY:
        case STROKEOPACITY:
        case STROKEWIDTH:
        case SIZE:
        case THETA2:
        case RADIUS2:
        case X2:
        case Y2:
            if (type === 'nominal' && !fieldDef['sort']) {
                return {
                    compatible: false,
                    warning: `Channel ${channel} should not be used with an unsorted discrete field.`
                };
            }
            return COMPATIBLE;
        case SHAPE:
        case STROKEDASH:
            if (!isDiscrete(fieldDef) && !isDiscretizing(fieldDef)) {
                return {
                    compatible: false,
                    warning: log.message.channelShouldBeDiscreteOrDiscretizing(channel)
                };
            }
            return COMPATIBLE;
        case ORDER:
            if (fieldDef.type === 'nominal' && !('sort' in fieldDef)) {
                return {
                    compatible: false,
                    warning: `Channel order is inappropriate for nominal field, which has no inherent order.`
                };
            }
            return COMPATIBLE;
    }
}
/**
 * Check if the field def uses a time format or does not use any format but is temporal
 * (this does not cover field defs that are temporal but use a number format).
 */
export function isFieldOrDatumDefForTimeFormat(fieldOrDatumDef) {
    const { formatType } = getFormatMixins(fieldOrDatumDef);
    return formatType === 'time' || (!formatType && isTimeFieldDef(fieldOrDatumDef));
}
/**
 * Check if field def has type `temporal`. If you want to also cover field defs that use a time format, use `isTimeFormatFieldDef`.
 */
export function isTimeFieldDef(def) {
    return def && (def['type'] === 'temporal' || (isFieldDef(def) && !!def.timeUnit));
}
/**
 * Getting a value associated with a fielddef.
 * Convert the value to Vega expression if applicable (for datetime object, or string if the field def is temporal or has timeUnit)
 */
export function valueExpr(v, { timeUnit, type, wrapTime, undefinedIfExprNotRequired }) {
    const unit = timeUnit && normalizeTimeUnit(timeUnit)?.unit;
    let isTime = unit || type === 'temporal';
    let expr;
    if (isExprRef(v)) {
        expr = v.expr;
    }
    else if (isSignalRef(v)) {
        expr = v.signal;
    }
    else if (isDateTime(v)) {
        isTime = true;
        expr = dateTimeToExpr(v);
    }
    else if (isString(v) || isNumber(v)) {
        if (isTime) {
            expr = `datetime(${stringify(v)})`;
            if (isLocalSingleTimeUnit(unit)) {
                // for single timeUnit, we will use dateTimeToExpr to convert number/string to match the timeUnit
                if ((isNumber(v) && v < 10000) || (isString(v) && isNaN(Date.parse(v)))) {
                    expr = dateTimeToExpr({ [unit]: v });
                }
            }
        }
    }
    if (expr) {
        return wrapTime && isTime ? `time(${expr})` : expr;
    }
    // number or boolean or normal string
    return undefinedIfExprNotRequired ? undefined : stringify(v);
}
/**
 * Standardize value array -- convert each value to Vega expression if applicable
 */
export function valueArray(fieldOrDatumDef, values) {
    const { type } = fieldOrDatumDef;
    return values.map(v => {
        const timeUnit = isFieldDef(fieldOrDatumDef) && !isBinnedTimeUnit(fieldOrDatumDef.timeUnit) ? fieldOrDatumDef.timeUnit : undefined;
        const expr = valueExpr(v, {
            timeUnit,
            type,
            undefinedIfExprNotRequired: true
        });
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
        console.warn('Only call this method for binned field defs.');
        return false;
    }
    // We need the range only when the user explicitly forces a binned field to be use discrete scale. In this case, bin range is used in axis and legend labels.
    // We could check whether the axis or legend exists (not disabled) but that seems overkill.
    return isScaleChannel(channel) && ['ordinal', 'nominal'].includes(fieldDef.type);
}
//# sourceMappingURL=channeldef.js.map