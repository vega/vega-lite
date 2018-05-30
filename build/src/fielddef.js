import * as tslib_1 from "tslib";
import { isArray, isBoolean, isNumber, isString } from 'vega-util';
import { isAggregateOp, isCountingAggregateOp } from './aggregate';
import { autoMaxBins, binToString } from './bin';
import { rangeType } from './channel';
import * as log from './log';
import { getTimeUnitParts, normalizeTimeUnit } from './timeunit';
import { getFullName, QUANTITATIVE } from './type';
import { flatAccessWithDatum, replacePathInField, titlecase } from './util';
export function isConditionalSelection(c) {
    return c['selection'];
}
export function isRepeatRef(field) {
    return field && !isString(field) && 'repeat' in field;
}
export function toFieldDefBase(fieldDef) {
    var field = fieldDef.field, timeUnit = fieldDef.timeUnit, bin = fieldDef.bin, aggregate = fieldDef.aggregate;
    return tslib_1.__assign({}, (timeUnit ? { timeUnit: timeUnit } : {}), (bin ? { bin: bin } : {}), (aggregate ? { aggregate: aggregate } : {}), { field: field });
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
export function isStringFieldDef(fieldDef) {
    return isFieldDef(fieldDef) && isString(fieldDef.field);
}
export function isValueDef(channelDef) {
    return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
}
export function isScaleFieldDef(channelDef) {
    return !!channelDef && (!!channelDef['scale'] || !!channelDef['sort']);
}
function isOpFieldDef(fieldDef) {
    return !!fieldDef['op'];
}
export function vgField(fieldDef, opt) {
    if (opt === void 0) { opt = {}; }
    var field = fieldDef.field;
    var prefix = opt.prefix;
    var suffix = opt.suffix;
    if (isCount(fieldDef)) {
        field = 'count_*';
    }
    else {
        var fn = undefined;
        if (!opt.nofn) {
            if (isOpFieldDef(fieldDef)) {
                fn = fieldDef.op;
            }
            else if (fieldDef.bin) {
                fn = binToString(fieldDef.bin);
                suffix = opt.binSuffix || '';
            }
            else if (fieldDef.aggregate) {
                fn = String(fieldDef.aggregate);
            }
            else if (fieldDef.timeUnit) {
                fn = String(fieldDef.timeUnit);
            }
        }
        if (fn) {
            field = field ? fn + "_" + field : fn;
        }
    }
    if (suffix) {
        field = field + "_" + suffix;
    }
    if (prefix) {
        field = prefix + "_" + field;
    }
    if (opt.expr) {
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
        case 'latitude':
        case 'longitude':
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
    var field = fieldDef.field, bin = fieldDef.bin, timeUnit = fieldDef.timeUnit, aggregate = fieldDef.aggregate;
    if (aggregate === 'count') {
        return config.countTitle;
    }
    else if (bin) {
        return field + " (binned)";
    }
    else if (timeUnit) {
        var units = getTimeUnitParts(timeUnit).join('-');
        return field + " (" + units + ")";
    }
    else if (aggregate) {
        return titlecase(aggregate) + " of " + field;
    }
    return field;
}
export function functionalTitleFormatter(fieldDef, config) {
    var fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
    if (fn) {
        return fn.toUpperCase() + '(' + fieldDef.field + ')';
    }
    else {
        return fieldDef.field;
    }
}
export var defaultTitleFormatter = function (fieldDef, config) {
    switch (config.fieldTitle) {
        case 'plain':
            return fieldDef.field;
        case 'functional':
            return functionalTitleFormatter(fieldDef, config);
        default:
            return verbalTitleFormatter(fieldDef, config);
    }
};
var titleFormatter = defaultTitleFormatter;
export function setTitleFormatter(formatter) {
    titleFormatter = formatter;
}
export function resetTitleFormatter() {
    setTitleFormatter(defaultTitleFormatter);
}
export function title(fieldDef, config) {
    return titleFormatter(fieldDef, config);
}
export function defaultType(fieldDef, channel) {
    if (fieldDef.timeUnit) {
        return 'temporal';
    }
    if (fieldDef.bin) {
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
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export function normalize(channelDef, channel) {
    if (isString(channelDef) || isNumber(channelDef) || isBoolean(channelDef)) {
        var primitiveType = isString(channelDef) ? 'string' :
            isNumber(channelDef) ? 'number' : 'boolean';
        log.warn(log.message.primitiveChannelDef(channel, primitiveType, channelDef));
        return { value: channelDef };
    }
    // If a fieldDef contains a field, we need type.
    if (isFieldDef(channelDef)) {
        return normalizeFieldDef(channelDef, channel);
    }
    else if (hasConditionalFieldDef(channelDef)) {
        return tslib_1.__assign({}, channelDef, { 
            // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
            condition: normalizeFieldDef(channelDef.condition, channel) });
    }
    return channelDef;
}
export function normalizeFieldDef(fieldDef, channel) {
    // Drop invalid aggregate
    if (fieldDef.aggregate && !isAggregateOp(fieldDef.aggregate)) {
        var aggregate = fieldDef.aggregate, fieldDefWithoutAggregate = tslib_1.__rest(fieldDef, ["aggregate"]);
        log.warn(log.message.invalidAggregate(fieldDef.aggregate));
        fieldDef = fieldDefWithoutAggregate;
    }
    // Normalize Time Unit
    if (fieldDef.timeUnit) {
        fieldDef = tslib_1.__assign({}, fieldDef, { timeUnit: normalizeTimeUnit(fieldDef.timeUnit) });
    }
    // Normalize bin
    if (fieldDef.bin) {
        fieldDef = tslib_1.__assign({}, fieldDef, { bin: normalizeBin(fieldDef.bin, channel) });
    }
    // Normalize Type
    if (fieldDef.type) {
        var fullType = getFullName(fieldDef.type);
        if (fieldDef.type !== fullType) {
            // convert short type to full type
            fieldDef = tslib_1.__assign({}, fieldDef, { type: fullType });
        }
        if (fieldDef.type !== 'quantitative') {
            if (isCountingAggregateOp(fieldDef.aggregate)) {
                log.warn(log.message.invalidFieldTypeForCountAggregate(fieldDef.type, fieldDef.aggregate));
                fieldDef = tslib_1.__assign({}, fieldDef, { type: 'quantitative' });
            }
        }
    }
    else {
        // If type is empty / invalid, then augment with default type
        var newType = defaultType(fieldDef, channel);
        log.warn(log.message.emptyOrInvalidFieldType(fieldDef.type, channel, newType));
        fieldDef = tslib_1.__assign({}, fieldDef, { type: newType });
    }
    var _a = channelCompatibility(fieldDef, channel), compatible = _a.compatible, warning = _a.warning;
    if (!compatible) {
        log.warn(warning);
    }
    return fieldDef;
}
export function normalizeBin(bin, channel) {
    if (isBoolean(bin)) {
        return { maxbins: autoMaxBins(channel) };
    }
    else if (!bin.maxbins && !bin.step) {
        return tslib_1.__assign({}, bin, { maxbins: autoMaxBins(channel) });
    }
    else {
        return bin;
    }
}
var COMPATIBLE = { compatible: true };
export function channelCompatibility(fieldDef, channel) {
    var type = fieldDef.type;
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
                    warning: "Channel " + channel + " should be used with a quantitative field only, not " + fieldDef.type + " field."
                };
            }
            return COMPATIBLE;
        case 'opacity':
        case 'size':
        case 'x2':
        case 'y2':
            if ((type === 'nominal' && !fieldDef['sort']) || type === 'geojson') {
                return {
                    compatible: false,
                    warning: "Channel " + channel + " should not be used with an unsorted discrete field."
                };
            }
            return COMPATIBLE;
        case 'shape':
            if (fieldDef.type !== 'nominal' && fieldDef.type !== 'geojson') {
                return {
                    compatible: false,
                    warning: 'Shape channel should be used with only either nominal or geojson data'
                };
            }
            return COMPATIBLE;
        case 'order':
            if (fieldDef.type === 'nominal') {
                return {
                    compatible: false,
                    warning: "Channel order is inappropriate for nominal field, which has no inherent order."
                };
            }
            return COMPATIBLE;
    }
    throw new Error('channelCompatability not implemented for channel ' + channel);
}
export function isNumberFieldDef(fieldDef) {
    return fieldDef.type === 'quantitative' || !!fieldDef.bin;
}
export function isTimeFieldDef(fieldDef) {
    return fieldDef.type === 'temporal' || !!fieldDef.timeUnit;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRkZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakUsT0FBTyxFQUFDLGFBQWEsRUFBRSxxQkFBcUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVqRSxPQUFPLEVBQUMsV0FBVyxFQUFhLFdBQVcsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUMxRCxPQUFPLEVBQVUsU0FBUyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBSzdDLE9BQU8sS0FBSyxHQUFHLE1BQU0sT0FBTyxDQUFDO0FBTTdCLE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBVyxNQUFNLFlBQVksQ0FBQztBQUV6RSxPQUFPLEVBQUMsV0FBVyxFQUFFLFlBQVksRUFBTyxNQUFNLFFBQVEsQ0FBQztBQUN2RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBZ0MxRSxNQUFNLGlDQUFvQyxDQUFpQjtJQUN6RCxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBbURELE1BQU0sc0JBQXNCLEtBQVk7SUFDdEMsT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxJQUFJLEtBQUssQ0FBQztBQUN4RCxDQUFDO0FBZ0RELE1BQU0seUJBQXlCLFFBQTBCO0lBQ2hELElBQUEsc0JBQUssRUFBRSw0QkFBUSxFQUFFLGtCQUFHLEVBQUUsOEJBQVMsQ0FBYTtJQUNuRCw0QkFDSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxRQUFRLFVBQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDNUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFD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QUFLLFNBQVMsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDOUQsT0FBTztvQkFDTCxVQUFVLEVBQUUsS0FBSztvQkFDakIsT0FBTyxFQUFFLHVFQUF1RTtpQkFDakYsQ0FBQzthQUNIO1lBQ0QsT0FBTyxVQUFVLENBQUM7UUFFcEIsS0FBSyxPQUFPO1lBQ1YsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDL0IsT0FBTztvQkFDTCxVQUFVLEVBQUUsS0FBSztvQkFDakIsT0FBTyxFQUFFLGdGQUFnRjtpQkFDMUYsQ0FBQzthQUNIO1lBQ0QsT0FBTyxVQUFVLENBQUM7S0FDckI7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLG1EQUFtRCxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ2pGLENBQUM7QUFFRCxNQUFNLDJCQUEyQixRQUF1QjtJQUN0RCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEtBQUssY0FBYyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQzVELENBQUM7QUFFRCxNQUFNLHlCQUF5QixRQUF1QjtJQUNwRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0FBQzdELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEZWNsYXJhdGlvbiBhbmQgdXRpbGl0eSBmb3IgdmFyaWFudHMgb2YgYSBmaWVsZCBkZWZpbml0aW9uIG9iamVjdFxuaW1wb3J0IHtBZ2dyZWdhdGVPcH0gZnJvbSAndmVnYSc7XG5pbXBvcnQge2lzQXJyYXksIGlzQm9vbGVhbiwgaXNOdW1iZXIsIGlzU3RyaW5nfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtpc0FnZ3JlZ2F0ZU9wLCBpc0NvdW50aW5nQWdncmVnYXRlT3B9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7QXhpc30gZnJvbSAnLi9heGlzJztcbmltcG9ydCB7YXV0b01heEJpbnMsIEJpblBhcmFtcywgYmluVG9TdHJpbmd9IGZyb20gJy4vYmluJztcbmltcG9ydCB7Q2hhbm5lbCwgcmFuZ2VUeXBlfSBmcm9tICcuL2NoYW5uZWwnO1xuaW1wb3J0IHtDb21wb3NpdGVBZ2dyZWdhdGV9IGZyb20gJy4vY29tcG9zaXRlbWFyayc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtUaXRsZU1peGluc30gZnJvbSAnLi9ndWlkZSc7XG5pbXBvcnQge0xlZ2VuZH0gZnJvbSAnLi9sZWdlbmQnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4vbG9nJztcbmltcG9ydCB7TG9naWNhbE9wZXJhbmR9IGZyb20gJy4vbG9naWNhbCc7XG5pbXBvcnQge1ByZWRpY2F0ZX0gZnJvbSAnLi9wcmVkaWNhdGUnO1xuaW1wb3J0IHtTY2FsZX0gZnJvbSAnLi9zY2FsZSc7XG5pbXBvcnQge0VuY29kaW5nU29ydEZpZWxkLCBTb3J0T3JkZXJ9IGZyb20gJy4vc29ydCc7XG5pbXBvcnQge1N0YWNrT2Zmc2V0fSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7Z2V0VGltZVVuaXRQYXJ0cywgbm9ybWFsaXplVGltZVVuaXQsIFRpbWVVbml0fSBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCB7QWdncmVnYXRlZEZpZWxkRGVmLCBXaW5kb3dGaWVsZERlZn0gZnJvbSAnLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtnZXRGdWxsTmFtZSwgUVVBTlRJVEFUSVZFLCBUeXBlfSBmcm9tICcuL3R5cGUnO1xuaW1wb3J0IHtmbGF0QWNjZXNzV2l0aERhdHVtLCByZXBsYWNlUGF0aEluRmllbGQsIHRpdGxlY2FzZX0gZnJvbSAnLi91dGlsJztcblxuXG4vKipcbiAqIERlZmluaXRpb24gb2JqZWN0IGZvciBhIGNvbnN0YW50IHZhbHVlIG9mIGFuIGVuY29kaW5nIGNoYW5uZWwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVEZWYge1xuICAvKipcbiAgICogQSBjb25zdGFudCB2YWx1ZSBpbiB2aXN1YWwgZG9tYWluIChlLmcuLCBgXCJyZWRcImAgLyBcIiMwMDk5ZmZcIiBmb3IgY29sb3IsIHZhbHVlcyBiZXR3ZWVuIGAwYCB0byBgMWAgZm9yIG9wYWNpdHkpLlxuICAgKi9cbiAgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW47XG59XG5cbi8qKlxuICogR2VuZXJpYyB0eXBlIGZvciBjb25kaXRpb25hbCBjaGFubmVsRGVmLlxuICogRiBkZWZpbmVzIHRoZSB1bmRlcmx5aW5nIEZpZWxkRGVmIHR5cGUuXG4gKi9cbmV4cG9ydCB0eXBlIENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiA9IEZpZWxkRGVmV2l0aENvbmRpdGlvbjxGPiB8IFZhbHVlRGVmV2l0aENvbmRpdGlvbjxGPjtcblxuZXhwb3J0IHR5cGUgQ29uZGl0aW9uYWw8VD4gPSBDb25kaXRpb25hbFByZWRpY2F0ZTxUPiB8IENvbmRpdGlvbmFsU2VsZWN0aW9uPFQ+O1xuXG5leHBvcnQgdHlwZSBDb25kaXRpb25hbFByZWRpY2F0ZTxUPiA9IHtcbiAgdGVzdDogTG9naWNhbE9wZXJhbmQ8UHJlZGljYXRlPjtcbn0gJiBUO1xuXG5leHBvcnQgdHlwZSBDb25kaXRpb25hbFNlbGVjdGlvbjxUPiA9IHtcbiAgLyoqXG4gICAqIEEgW3NlbGVjdGlvbiBuYW1lXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NlbGVjdGlvbi5odG1sKSwgb3IgYSBzZXJpZXMgb2YgW2NvbXBvc2VkIHNlbGVjdGlvbnNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2VsZWN0aW9uLmh0bWwjY29tcG9zZSkuXG4gICAqL1xuICBzZWxlY3Rpb246IExvZ2ljYWxPcGVyYW5kPHN0cmluZz47XG59ICYgVDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29uZGl0aW9uYWxTZWxlY3Rpb248VD4oYzogQ29uZGl0aW9uYWw8VD4pOiBjIGlzIENvbmRpdGlvbmFsU2VsZWN0aW9uPFQ+IHtcbiAgcmV0dXJuIGNbJ3NlbGVjdGlvbiddO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmRpdGlvblZhbHVlRGVmTWl4aW5zIHtcbiAgLyoqXG4gICAqIE9uZSBvciBtb3JlIHZhbHVlIGRlZmluaXRpb24ocykgd2l0aCBhIHNlbGVjdGlvbiBwcmVkaWNhdGUuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBBIGZpZWxkIGRlZmluaXRpb24ncyBgY29uZGl0aW9uYCBwcm9wZXJ0eSBjYW4gb25seSBjb250YWluIFt2YWx1ZSBkZWZpbml0aW9uc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9lbmNvZGluZy5odG1sI3ZhbHVlLWRlZilcbiAgICogc2luY2UgVmVnYS1MaXRlIG9ubHkgYWxsb3dzIGF0IG1vc3Qgb25lIGVuY29kZWQgZmllbGQgcGVyIGVuY29kaW5nIGNoYW5uZWwuXG4gICAqL1xuICBjb25kaXRpb24/OiBDb25kaXRpb25hbDxWYWx1ZURlZj4gfCBDb25kaXRpb25hbDxWYWx1ZURlZj5bXTtcbn1cblxuLyoqXG4gKiBBIEZpZWxkRGVmIHdpdGggQ29uZGl0aW9uPFZhbHVlRGVmPlxuICoge1xuICogICBjb25kaXRpb246IHt2YWx1ZTogLi4ufSxcbiAqICAgZmllbGQ6IC4uLixcbiAqICAgLi4uXG4gKiB9XG4gKi9cblxuZXhwb3J0IHR5cGUgRmllbGREZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiA9IEYgJiBDb25kaXRpb25WYWx1ZURlZk1peGlucztcblxuLyoqXG4gKiBBIFZhbHVlRGVmIHdpdGggQ29uZGl0aW9uPFZhbHVlRGVmIHwgRmllbGREZWY+XG4gKiB7XG4gKiAgIGNvbmRpdGlvbjoge2ZpZWxkOiAuLi59IHwge3ZhbHVlOiAuLi59LFxuICogICB2YWx1ZTogLi4uLFxuICogfVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbHVlRGVmV2l0aENvbmRpdGlvbjxGIGV4dGVuZHMgRmllbGREZWY8YW55Pj4ge1xuICAvKipcbiAgICogQSBmaWVsZCBkZWZpbml0aW9uIG9yIG9uZSBvciBtb3JlIHZhbHVlIGRlZmluaXRpb24ocykgd2l0aCBhIHNlbGVjdGlvbiBwcmVkaWNhdGUuXG4gICAqL1xuICBjb25kaXRpb24/OiBDb25kaXRpb25hbDxGPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdO1xuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IHZhbHVlIGluIHZpc3VhbCBkb21haW4uXG4gICAqL1xuICB2YWx1ZT86IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgcmVwZWF0ZWQgdmFsdWUuXG4gKi9cbmV4cG9ydCB0eXBlIFJlcGVhdFJlZiA9IHtcbiAgcmVwZWF0OiAncm93JyB8ICdjb2x1bW4nXG59O1xuXG5leHBvcnQgdHlwZSBGaWVsZCA9IHN0cmluZyB8IFJlcGVhdFJlZjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwZWF0UmVmKGZpZWxkOiBGaWVsZCk6IGZpZWxkIGlzIFJlcGVhdFJlZiB7XG4gIHJldHVybiBmaWVsZCAmJiAhaXNTdHJpbmcoZmllbGQpICYmICdyZXBlYXQnIGluIGZpZWxkO1xufVxuXG4vKiogQGhpZGUgKi9cbmV4cG9ydCB0eXBlIEhpZGRlbkNvbXBvc2l0ZUFnZ3JlZ2F0ZSA9IENvbXBvc2l0ZUFnZ3JlZ2F0ZTtcblxuZXhwb3J0IHR5cGUgQWdncmVnYXRlID0gQWdncmVnYXRlT3AgfCBIaWRkZW5Db21wb3NpdGVBZ2dyZWdhdGU7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGREZWZCYXNlPEY+IHtcblxuICAvKipcbiAgICogX19SZXF1aXJlZC5fXyBBIHN0cmluZyBkZWZpbmluZyB0aGUgbmFtZSBvZiB0aGUgZmllbGQgZnJvbSB3aGljaCB0byBwdWxsIGEgZGF0YSB2YWx1ZVxuICAgKiBvciBhbiBvYmplY3QgZGVmaW5pbmcgaXRlcmF0ZWQgdmFsdWVzIGZyb20gdGhlIFtgcmVwZWF0YF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9yZXBlYXQuaHRtbCkgb3BlcmF0b3IuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBEb3RzIChgLmApIGFuZCBicmFja2V0cyAoYFtgIGFuZCBgXWApIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyBuZXN0ZWQgb2JqZWN0cyAoZS5nLiwgYFwiZmllbGRcIjogXCJmb28uYmFyXCJgIGFuZCBgXCJmaWVsZFwiOiBcImZvb1snYmFyJ11cImApLlxuICAgKiBJZiBmaWVsZCBuYW1lcyBjb250YWluIGRvdHMgb3IgYnJhY2tldHMgYnV0IGFyZSBub3QgbmVzdGVkLCB5b3UgY2FuIHVzZSBgXFxcXGAgdG8gZXNjYXBlIGRvdHMgYW5kIGJyYWNrZXRzIChlLmcuLCBgXCJhXFxcXC5iXCJgIGFuZCBgXCJhXFxcXFswXFxcXF1cImApLlxuICAgKiBTZWUgbW9yZSBkZXRhaWxzIGFib3V0IGVzY2FwaW5nIGluIHRoZSBbZmllbGQgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9maWVsZC5odG1sKS5cbiAgICpcbiAgICogX19Ob3RlOl9fIGBmaWVsZGAgaXMgbm90IHJlcXVpcmVkIGlmIGBhZ2dyZWdhdGVgIGlzIGBjb3VudGAuXG4gICAqL1xuICBmaWVsZD86IEY7XG5cbiAgLy8gZnVuY3Rpb25cblxuICAvKipcbiAgICogVGltZSB1bml0IChlLmcuLCBgeWVhcmAsIGB5ZWFybW9udGhgLCBgbW9udGhgLCBgaG91cnNgKSBmb3IgYSB0ZW1wb3JhbCBmaWVsZC5cbiAgICogb3IgW2EgdGVtcG9yYWwgZmllbGQgdGhhdCBnZXRzIGNhc3RlZCBhcyBvcmRpbmFsXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3R5cGUuaHRtbCNjYXN0KS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB1bmRlZmluZWRgIChOb25lKVxuICAgKi9cbiAgdGltZVVuaXQ/OiBUaW1lVW5pdDtcblxuICAvKipcbiAgICogQSBmbGFnIGZvciBiaW5uaW5nIGEgYHF1YW50aXRhdGl2ZWAgZmllbGQsIG9yIFthbiBvYmplY3QgZGVmaW5pbmcgYmlubmluZyBwYXJhbWV0ZXJzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2Jpbi5odG1sI3BhcmFtcykuXG4gICAqIElmIGB0cnVlYCwgZGVmYXVsdCBbYmlubmluZyBwYXJhbWV0ZXJzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2Jpbi5odG1sKSB3aWxsIGJlIGFwcGxpZWQuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgZmFsc2VgXG4gICAqL1xuICBiaW4/OiBib29sZWFuIHwgQmluUGFyYW1zO1xuXG4gIC8qKlxuICAgKiBBZ2dyZWdhdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGZpZWxkXG4gICAqIChlLmcuLCBgbWVhbmAsIGBzdW1gLCBgbWVkaWFuYCwgYG1pbmAsIGBtYXhgLCBgY291bnRgKS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB1bmRlZmluZWRgIChOb25lKVxuICAgKi9cbiAgYWdncmVnYXRlPzogQWdncmVnYXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9GaWVsZERlZkJhc2UoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pOiBGaWVsZERlZkJhc2U8c3RyaW5nPiB7XG4gIGNvbnN0IHtmaWVsZCwgdGltZVVuaXQsIGJpbiwgYWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICByZXR1cm4ge1xuICAgIC4uLih0aW1lVW5pdCA/IHt0aW1lVW5pdH0gOiB7fSksXG4gICAgLi4uKGJpbiA/IHtiaW59IDoge30pLFxuICAgIC4uLihhZ2dyZWdhdGUgPyB7YWdncmVnYXRlfSA6IHt9KSxcbiAgICBmaWVsZFxuICB9O1xufVxuXG4vKipcbiAqICBEZWZpbml0aW9uIG9iamVjdCBmb3IgYSBkYXRhIGZpZWxkLCBpdHMgdHlwZSBhbmQgdHJhbnNmb3JtYXRpb24gb2YgYW4gZW5jb2RpbmcgY2hhbm5lbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmQmFzZTxGPiwgVGl0bGVNaXhpbnMge1xuICAvKipcbiAgICogVGhlIGVuY29kZWQgZmllbGQncyB0eXBlIG9mIG1lYXN1cmVtZW50IChgXCJxdWFudGl0YXRpdmVcImAsIGBcInRlbXBvcmFsXCJgLCBgXCJvcmRpbmFsXCJgLCBvciBgXCJub21pbmFsXCJgKS5cbiAgICogSXQgY2FuIGFsc28gYmUgYSBgXCJnZW9qc29uXCJgIHR5cGUgZm9yIGVuY29kaW5nIFsnZ2Vvc2hhcGUnXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2dlb3NoYXBlLmh0bWwpLlxuICAgKi9cbiAgLy8gKiBvciBhbiBpbml0aWFsIGNoYXJhY3RlciBvZiB0aGUgdHlwZSBuYW1lIChgXCJRXCJgLCBgXCJUXCJgLCBgXCJPXCJgLCBgXCJOXCJgKS5cbiAgLy8gKiBUaGlzIHByb3BlcnR5IGlzIGNhc2UtaW5zZW5zaXRpdmUuXG4gIHR5cGU6IFR5cGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NhbGVGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIHRoZSBjaGFubmVsJ3Mgc2NhbGUsIHdoaWNoIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHRyYW5zZm9ybXMgdmFsdWVzIGluIHRoZSBkYXRhIGRvbWFpbiAobnVtYmVycywgZGF0ZXMsIHN0cmluZ3MsIGV0YykgdG8gdmlzdWFsIHZhbHVlcyAocGl4ZWxzLCBjb2xvcnMsIHNpemVzKSBvZiB0aGUgZW5jb2RpbmcgY2hhbm5lbHMuXG4gICAqXG4gICAqIElmIGBudWxsYCwgdGhlIHNjYWxlIHdpbGwgYmUgW2Rpc2FibGVkIGFuZCB0aGUgZGF0YSB2YWx1ZSB3aWxsIGJlIGRpcmVjdGx5IGVuY29kZWRdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2NhbGUuaHRtbCNkaXNhYmxlKS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIElmIHVuZGVmaW5lZCwgZGVmYXVsdCBbc2NhbGUgcHJvcGVydGllc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zY2FsZS5odG1sKSBhcmUgYXBwbGllZC5cbiAgICovXG4gIHNjYWxlPzogU2NhbGUgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBTb3J0IG9yZGVyIGZvciB0aGUgZW5jb2RlZCBmaWVsZC5cbiAgICogU3VwcG9ydGVkIGBzb3J0YCB2YWx1ZXMgaW5jbHVkZSBgXCJhc2NlbmRpbmdcImAsIGBcImRlc2NlbmRpbmdcImAsIGBudWxsYCAobm8gc29ydGluZyksIG9yIGFuIGFycmF5IHNwZWNpZnlpbmcgdGhlIHByZWZlcnJlZCBvcmRlciBvZiB2YWx1ZXMuXG4gICAqIEZvciBmaWVsZHMgd2l0aCBkaXNjcmV0ZSBkb21haW5zLCBgc29ydGAgY2FuIGFsc28gYmUgYSBbc29ydCBmaWVsZCBkZWZpbml0aW9uIG9iamVjdF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zb3J0Lmh0bWwjc29ydC1maWVsZCkuXG4gICAqIEZvciBgc29ydGAgYXMgYW4gW2FycmF5IHNwZWNpZnlpbmcgdGhlIHByZWZlcnJlZCBvcmRlciBvZiB2YWx1ZXNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc29ydC5odG1sI3NvcnQtYXJyYXkpLCB0aGUgc29ydCBvcmRlciB3aWxsIG9iZXkgdGhlIHZhbHVlcyBpbiB0aGUgYXJyYXksIGZvbGxvd2VkIGJ5IGFueSB1bnNwZWNpZmllZCB2YWx1ZXMgaW4gdGhlaXIgb3JpZ2luYWwgb3JkZXIuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgXCJhc2NlbmRpbmdcImBcbiAgICovXG4gIHNvcnQ/OiBzdHJpbmdbXSB8IFNvcnRPcmRlciB8IEVuY29kaW5nU29ydEZpZWxkPEY+IHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbkZpZWxkRGVmPEY+IGV4dGVuZHMgU2NhbGVGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiBheGlzJ3MgZ3JpZGxpbmVzLCB0aWNrcyBhbmQgbGFiZWxzLlxuICAgKiBJZiBgbnVsbGAsIHRoZSBheGlzIGZvciB0aGUgZW5jb2RpbmcgY2hhbm5lbCB3aWxsIGJlIHJlbW92ZWQuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBJZiB1bmRlZmluZWQsIGRlZmF1bHQgW2F4aXMgcHJvcGVydGllc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9heGlzLmh0bWwpIGFyZSBhcHBsaWVkLlxuICAgKi9cbiAgYXhpcz86IEF4aXMgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHN0YWNraW5nIG9mZnNldCBpZiB0aGUgZmllbGQgc2hvdWxkIGJlIHN0YWNrZWQuXG4gICAqIGBzdGFja2AgaXMgb25seSBhcHBsaWNhYmxlIGZvciBgeGAgYW5kIGB5YCBjaGFubmVscyB3aXRoIGNvbnRpbnVvdXMgZG9tYWlucy5cbiAgICogRm9yIGV4YW1wbGUsIGBzdGFja2Agb2YgYHlgIGNhbiBiZSB1c2VkIHRvIGN1c3RvbWl6ZSBzdGFja2luZyBmb3IgYSB2ZXJ0aWNhbCBiYXIgY2hhcnQuXG4gICAqXG4gICAqIGBzdGFja2AgY2FuIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiAgICogLSBgXCJ6ZXJvXCJgOiBzdGFja2luZyB3aXRoIGJhc2VsaW5lIG9mZnNldCBhdCB6ZXJvIHZhbHVlIG9mIHRoZSBzY2FsZSAoZm9yIGNyZWF0aW5nIHR5cGljYWwgc3RhY2tlZCBbYmFyXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3N0YWNrLmh0bWwjYmFyKSBhbmQgW2FyZWFdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3RhY2suaHRtbCNhcmVhKSBjaGFydCkuXG4gICAqIC0gYFwibm9ybWFsaXplXCJgIC0gc3RhY2tpbmcgd2l0aCBub3JtYWxpemVkIGRvbWFpbiAoZm9yIGNyZWF0aW5nIFtub3JtYWxpemVkIHN0YWNrZWQgYmFyIGFuZCBhcmVhIGNoYXJ0c10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zdGFjay5odG1sI25vcm1hbGl6ZWQpLiA8YnIvPlxuICAgKiAtYFwiY2VudGVyXCJgIC0gc3RhY2tpbmcgd2l0aCBjZW50ZXIgYmFzZWxpbmUgKGZvciBbc3RyZWFtZ3JhcGhdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3RhY2suaHRtbCNzdHJlYW1ncmFwaCkpLlxuICAgKiAtIGBudWxsYCAtIE5vLXN0YWNraW5nLiBUaGlzIHdpbGwgcHJvZHVjZSBsYXllcmVkIFtiYXJdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3RhY2suaHRtbCNsYXllcmVkLWJhci1jaGFydCkgYW5kIGFyZWEgY2hhcnQuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgemVyb2AgZm9yIHBsb3RzIHdpdGggYWxsIG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgdHJ1ZTpcbiAgICogKDEpIHRoZSBtYXJrIGlzIGBiYXJgIG9yIGBhcmVhYDtcbiAgICogKDIpIHRoZSBzdGFja2VkIG1lYXN1cmUgY2hhbm5lbCAoeCBvciB5KSBoYXMgYSBsaW5lYXIgc2NhbGU7XG4gICAqICgzKSBBdCBsZWFzdCBvbmUgb2Ygbm9uLXBvc2l0aW9uIGNoYW5uZWxzIG1hcHBlZCB0byBhbiB1bmFnZ3JlZ2F0ZWQgZmllbGQgdGhhdCBpcyBkaWZmZXJlbnQgZnJvbSB4IGFuZCB5LiAgT3RoZXJ3aXNlLCBgbnVsbGAgYnkgZGVmYXVsdC5cbiAgICovXG4gIHN0YWNrPzogU3RhY2tPZmZzZXQgfCBudWxsO1xufVxuXG4vKipcbiAqIEZpZWxkIGRlZmluaXRpb24gb2YgYSBtYXJrIHByb3BlcnR5LCB3aGljaCBjYW4gY29udGFpbiBhIGxlZ2VuZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXJrUHJvcEZpZWxkRGVmPEY+IGV4dGVuZHMgU2NhbGVGaWVsZERlZjxGPiB7XG4gICAvKipcbiAgICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIHRoZSBsZWdlbmQuXG4gICAgKiBJZiBgbnVsbGAsIHRoZSBsZWdlbmQgZm9yIHRoZSBlbmNvZGluZyBjaGFubmVsIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAqXG4gICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gSWYgdW5kZWZpbmVkLCBkZWZhdWx0IFtsZWdlbmQgcHJvcGVydGllc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9sZWdlbmQuaHRtbCkgYXJlIGFwcGxpZWQuXG4gICAgKi9cbiAgbGVnZW5kPzogTGVnZW5kIHwgbnVsbDtcbn1cblxuLy8gRGV0YWlsXG5cbi8vIE9yZGVyIFBhdGggaGF2ZSBubyBzY2FsZVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyRmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBUaGUgc29ydCBvcmRlci4gT25lIG9mIGBcImFzY2VuZGluZ1wiYCAoZGVmYXVsdCkgb3IgYFwiZGVzY2VuZGluZ1wiYC5cbiAgICovXG4gIHNvcnQ/OiBTb3J0T3JkZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGV4dEZpZWxkRGVmPEY+IGV4dGVuZHMgRmllbGREZWY8Rj4ge1xuICAvKipcbiAgICogVGhlIFtmb3JtYXR0aW5nIHBhdHRlcm5dKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvZm9ybWF0Lmh0bWwpIGZvciBhIHRleHQgZmllbGQuIElmIG5vdCBkZWZpbmVkLCB0aGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgZm9ybWF0Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBDaGFubmVsRGVmPEY+ID0gQ2hhbm5lbERlZldpdGhDb25kaXRpb248RmllbGREZWY8Rj4+O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNDb25kaXRpb25hbERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyBDaGFubmVsRGVmV2l0aENvbmRpdGlvbjxGaWVsZERlZjxGPj4ge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICEhY2hhbm5lbERlZi5jb25kaXRpb247XG59XG5cbi8qKlxuICogUmV0dXJuIGlmIGEgY2hhbm5lbERlZiBpcyBhIENvbmRpdGlvbmFsVmFsdWVEZWYgd2l0aCBDb25kaXRpb25GaWVsZERlZlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzQ29uZGl0aW9uYWxGaWVsZERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyAoVmFsdWVEZWYgJiB7Y29uZGl0aW9uOiBDb25kaXRpb25hbDxGaWVsZERlZjxGPj59KSB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgISFjaGFubmVsRGVmLmNvbmRpdGlvbiAmJiAhaXNBcnJheShjaGFubmVsRGVmLmNvbmRpdGlvbikgJiYgaXNGaWVsZERlZihjaGFubmVsRGVmLmNvbmRpdGlvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDb25kaXRpb25hbFZhbHVlRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIChWYWx1ZURlZiAmIHtjb25kaXRpb246IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdfSkge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICEhY2hhbm5lbERlZi5jb25kaXRpb24gJiYgKFxuICAgIGlzQXJyYXkoY2hhbm5lbERlZi5jb25kaXRpb24pIHx8IGlzVmFsdWVEZWYoY2hhbm5lbERlZi5jb25kaXRpb24pXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZpZWxkRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIEZpZWxkRGVmPEY+IHwgUG9zaXRpb25GaWVsZERlZjxGPiB8IFNjYWxlRmllbGREZWY8Rj4gfCBNYXJrUHJvcEZpZWxkRGVmPEY+IHwgT3JkZXJGaWVsZERlZjxGPiB8IFRleHRGaWVsZERlZjxGPiB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgKCEhY2hhbm5lbERlZlsnZmllbGQnXSB8fCBjaGFubmVsRGVmWydhZ2dyZWdhdGUnXSA9PT0gJ2NvdW50Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZ0ZpZWxkRGVmKGZpZWxkRGVmOiBDaGFubmVsRGVmPHN0cmluZ3xSZXBlYXRSZWY+KTogZmllbGREZWYgaXMgRmllbGREZWY8c3RyaW5nPiB7XG4gIHJldHVybiBpc0ZpZWxkRGVmKGZpZWxkRGVmKSAmJiBpc1N0cmluZyhmaWVsZERlZi5maWVsZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbHVlRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIFZhbHVlRGVmIHtcbiAgcmV0dXJuIGNoYW5uZWxEZWYgJiYgJ3ZhbHVlJyBpbiBjaGFubmVsRGVmICYmIGNoYW5uZWxEZWZbJ3ZhbHVlJ10gIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2NhbGVGaWVsZERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyBTY2FsZUZpZWxkRGVmPEY+IHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAoISFjaGFubmVsRGVmWydzY2FsZSddIHx8ICEhY2hhbm5lbERlZlsnc29ydCddKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGaWVsZFJlZk9wdGlvbiB7XG4gIC8qKiBleGNsdWRlIGJpbiwgYWdncmVnYXRlLCB0aW1lVW5pdCAqL1xuICBub2ZuPzogYm9vbGVhbjtcbiAgLyoqIFdyYXAgdGhlIGZpZWxkIHdpdGggZGF0dW0gb3IgcGFyZW50IChlLmcuLCBkYXR1bVsnLi4uJ10gZm9yIFZlZ2EgRXhwcmVzc2lvbiAqL1xuICBleHByPzogJ2RhdHVtJyB8ICdwYXJlbnQnO1xuICAvKiogcHJlcGVuZCBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXggKi9cbiAgcHJlZml4Pzogc3RyaW5nO1xuICAvKiogYXBwZW5kIHN1ZmZpeCB0byB0aGUgZmllbGQgcmVmIGZvciBiaW4gKGRlZmF1bHQ9J3N0YXJ0JykgKi9cbiAgYmluU3VmZml4PzogJ2VuZCcgfCAncmFuZ2UnIHwgJ21pZCc7XG4gIC8qKiBhcHBlbmQgc3VmZml4IHRvIHRoZSBmaWVsZCByZWYgKGdlbmVyYWwpICovXG4gIHN1ZmZpeD86IHN0cmluZztcbn1cblxuZnVuY3Rpb24gaXNPcEZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8c3RyaW5nPiB8IFdpbmRvd0ZpZWxkRGVmIHwgQWdncmVnYXRlZEZpZWxkRGVmKTogZmllbGREZWYgaXMgV2luZG93RmllbGREZWYgfCBBZ2dyZWdhdGVkRmllbGREZWYge1xuICByZXR1cm4gISFmaWVsZERlZlsnb3AnXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZnRmllbGQoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxzdHJpbmc+IHwgV2luZG93RmllbGREZWYgfCBBZ2dyZWdhdGVkRmllbGREZWYsIG9wdDogRmllbGRSZWZPcHRpb24gPSB7fSk6IHN0cmluZyB7XG4gIGxldCBmaWVsZCA9IGZpZWxkRGVmLmZpZWxkO1xuICBjb25zdCBwcmVmaXggPSBvcHQucHJlZml4O1xuICBsZXQgc3VmZml4ID0gb3B0LnN1ZmZpeDtcblxuICBpZiAoaXNDb3VudChmaWVsZERlZikpIHtcbiAgICBmaWVsZCA9ICdjb3VudF8qJztcbiAgfSBlbHNlIHtcbiAgICBsZXQgZm46IHN0cmluZyA9IHVuZGVmaW5lZDtcblxuICAgIGlmICghb3B0Lm5vZm4pIHtcbiAgICAgIGlmIChpc09wRmllbGREZWYoZmllbGREZWYpKSB7XG4gICAgICAgIGZuID0gZmllbGREZWYub3A7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgICBmbiA9IGJpblRvU3RyaW5nKGZpZWxkRGVmLmJpbik7XG4gICAgICAgIHN1ZmZpeCA9IG9wdC5iaW5TdWZmaXggfHwgJyc7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICBmbiA9IFN0cmluZyhmaWVsZERlZi5hZ2dyZWdhdGUpO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICBmbiA9IFN0cmluZyhmaWVsZERlZi50aW1lVW5pdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZuKSB7XG4gICAgICBmaWVsZCA9IGZpZWxkID8gYCR7Zm59XyR7ZmllbGR9YCA6IGZuO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdWZmaXgpIHtcbiAgICBmaWVsZCA9IGAke2ZpZWxkfV8ke3N1ZmZpeH1gO1xuICB9XG5cbiAgaWYgKHByZWZpeCkge1xuICAgIGZpZWxkID0gYCR7cHJlZml4fV8ke2ZpZWxkfWA7XG4gIH1cblxuICBpZiAob3B0LmV4cHIpIHtcbiAgICAvLyBFeHByZXNzaW9uIHRvIGFjY2VzcyBmbGF0dGVuZWQgZmllbGQuIE5vIG5lZWQgdG8gZXNjYXBlIGRvdHMuXG4gICAgcmV0dXJuIGZsYXRBY2Nlc3NXaXRoRGF0dW0oZmllbGQsIG9wdC5leHByKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBXZSBmbGF0dGVuZWQgYWxsIGZpZWxkcyBzbyBwYXRocyBzaG91bGQgaGF2ZSBiZWNvbWUgZG90LlxuICAgIHJldHVybiByZXBsYWNlUGF0aEluRmllbGQoZmllbGQpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc2NyZXRlKGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4pIHtcbiAgc3dpdGNoIChmaWVsZERlZi50eXBlKSB7XG4gICAgY2FzZSAnbm9taW5hbCc6XG4gICAgY2FzZSAnb3JkaW5hbCc6XG4gICAgY2FzZSAnZ2VvanNvbic6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlICdxdWFudGl0YXRpdmUnOlxuICAgICAgcmV0dXJuICEhZmllbGREZWYuYmluO1xuICAgIGNhc2UgJ2xhdGl0dWRlJzpcbiAgICBjYXNlICdsb25naXR1ZGUnOlxuICAgIGNhc2UgJ3RlbXBvcmFsJzpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuaW52YWxpZEZpZWxkVHlwZShmaWVsZERlZi50eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbnRpbnVvdXMoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPikge1xuICByZXR1cm4gIWlzRGlzY3JldGUoZmllbGREZWYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb3VudChmaWVsZERlZjogRmllbGREZWZCYXNlPEZpZWxkPikge1xuICByZXR1cm4gZmllbGREZWYuYWdncmVnYXRlID09PSAnY291bnQnO1xufVxuXG5leHBvcnQgdHlwZSBGaWVsZFRpdGxlRm9ybWF0dGVyID0gKGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpID0+IHN0cmluZztcblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmJhbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3Qge2ZpZWxkOiBmaWVsZCwgYmluLCB0aW1lVW5pdCwgYWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICBpZiAoYWdncmVnYXRlID09PSAnY291bnQnKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5jb3VudFRpdGxlO1xuICB9IGVsc2UgaWYgKGJpbikge1xuICAgIHJldHVybiBgJHtmaWVsZH0gKGJpbm5lZClgO1xuICB9IGVsc2UgaWYgKHRpbWVVbml0KSB7XG4gICAgY29uc3QgdW5pdHMgPSBnZXRUaW1lVW5pdFBhcnRzKHRpbWVVbml0KS5qb2luKCctJyk7XG4gICAgcmV0dXJuIGAke2ZpZWxkfSAoJHt1bml0c30pYDtcbiAgfSBlbHNlIGlmIChhZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4gYCR7dGl0bGVjYXNlKGFnZ3JlZ2F0ZSl9IG9mICR7ZmllbGR9YDtcbiAgfVxuICByZXR1cm4gZmllbGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmdW5jdGlvbmFsVGl0bGVGb3JtYXR0ZXIoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBmbiA9IGZpZWxkRGVmLmFnZ3JlZ2F0ZSB8fCBmaWVsZERlZi50aW1lVW5pdCB8fCAoZmllbGREZWYuYmluICYmICdiaW4nKTtcbiAgaWYgKGZuKSB7XG4gICAgcmV0dXJuIGZuLnRvVXBwZXJDYXNlKCkgKyAnKCcgKyBmaWVsZERlZi5maWVsZCArICcpJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmllbGREZWYuZmllbGQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRUaXRsZUZvcm1hdHRlcjogRmllbGRUaXRsZUZvcm1hdHRlciA9IChmaWVsZERlZjogRmllbGREZWZCYXNlPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSA9PiB7XG4gIHN3aXRjaCAoY29uZmlnLmZpZWxkVGl0bGUpIHtcbiAgICBjYXNlICdwbGFpbic6XG4gICAgICByZXR1cm4gZmllbGREZWYuZmllbGQ7XG4gICAgY2FzZSAnZnVuY3Rpb25hbCc6XG4gICAgICByZXR1cm4gZnVuY3Rpb25hbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdmVyYmFsVGl0bGVGb3JtYXR0ZXIoZmllbGREZWYsIGNvbmZpZyk7XG4gIH1cbn07XG5cbmxldCB0aXRsZUZvcm1hdHRlciA9IGRlZmF1bHRUaXRsZUZvcm1hdHRlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFRpdGxlRm9ybWF0dGVyKGZvcm1hdHRlcjogRmllbGRUaXRsZUZvcm1hdHRlcikge1xuICB0aXRsZUZvcm1hdHRlciA9IGZvcm1hdHRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0VGl0bGVGb3JtYXR0ZXIoKSB7XG4gIHNldFRpdGxlRm9ybWF0dGVyKGRlZmF1bHRUaXRsZUZvcm1hdHRlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShmaWVsZERlZjogRmllbGREZWZCYXNlPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIHJldHVybiB0aXRsZUZvcm1hdHRlcihmaWVsZERlZiwgY29uZmlnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRUeXBlKGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4sIGNoYW5uZWw6IENoYW5uZWwpOiBUeXBlIHtcbiAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgcmV0dXJuICd0ZW1wb3JhbCc7XG4gIH1cbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIHJldHVybiAncXVhbnRpdGF0aXZlJztcbiAgfVxuICBzd2l0Y2ggKHJhbmdlVHlwZShjaGFubmVsKSkge1xuICAgIGNhc2UgJ2NvbnRpbnVvdXMnOlxuICAgICAgcmV0dXJuICdxdWFudGl0YXRpdmUnO1xuICAgIGNhc2UgJ2Rpc2NyZXRlJzpcbiAgICAgIHJldHVybiAnbm9taW5hbCc7XG4gICAgY2FzZSAnZmxleGlibGUnOiAvLyBjb2xvclxuICAgICAgcmV0dXJuICdub21pbmFsJztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICdxdWFudGl0YXRpdmUnO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmllbGREZWYgLS0gZWl0aGVyIGZyb20gdGhlIG91dGVyIGNoYW5uZWxEZWYgb3IgZnJvbSB0aGUgY29uZGl0aW9uIG9mIGNoYW5uZWxEZWYuXG4gKiBAcGFyYW0gY2hhbm5lbERlZlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGREZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IEZpZWxkRGVmPEY+IHtcbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4gY2hhbm5lbERlZjtcbiAgfSBlbHNlIGlmIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ29udmVydCB0eXBlIHRvIGZ1bGwsIGxvd2VyY2FzZSB0eXBlLCBvciBhdWdtZW50IHRoZSBmaWVsZERlZiB3aXRoIGEgZGVmYXVsdCB0eXBlIGlmIG1pc3NpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUoY2hhbm5lbERlZjogQ2hhbm5lbERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKTogQ2hhbm5lbERlZjxhbnk+IHtcbiAgaWYgKGlzU3RyaW5nKGNoYW5uZWxEZWYpIHx8IGlzTnVtYmVyKGNoYW5uZWxEZWYpIHx8IGlzQm9vbGVhbihjaGFubmVsRGVmKSkge1xuICAgIGNvbnN0IHByaW1pdGl2ZVR5cGUgPSBpc1N0cmluZyhjaGFubmVsRGVmKSA/ICdzdHJpbmcnIDpcbiAgICAgIGlzTnVtYmVyKGNoYW5uZWxEZWYpID8gJ251bWJlcicgOiAnYm9vbGVhbic7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UucHJpbWl0aXZlQ2hhbm5lbERlZihjaGFubmVsLCBwcmltaXRpdmVUeXBlLCBjaGFubmVsRGVmKSk7XG4gICAgcmV0dXJuIHt2YWx1ZTogY2hhbm5lbERlZn07XG4gIH1cblxuICAvLyBJZiBhIGZpZWxkRGVmIGNvbnRhaW5zIGEgZmllbGQsIHdlIG5lZWQgdHlwZS5cbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplRmllbGREZWYoY2hhbm5lbERlZiwgY2hhbm5lbCk7XG4gIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5jaGFubmVsRGVmLFxuICAgICAgLy8gTmVlZCB0byBjYXN0IGFzIG5vcm1hbGl6ZUZpZWxkRGVmIG5vcm1hbGx5IHJldHVybiBGaWVsZERlZiwgYnV0IGhlcmUgd2Uga25vdyB0aGF0IGl0IGlzIGRlZmluaXRlbHkgQ29uZGl0aW9uPEZpZWxkRGVmPlxuICAgICAgY29uZGl0aW9uOiBub3JtYWxpemVGaWVsZERlZihjaGFubmVsRGVmLmNvbmRpdGlvbiwgY2hhbm5lbCkgYXMgQ29uZGl0aW9uYWw8RmllbGREZWY8c3RyaW5nPj5cbiAgICB9O1xuICB9XG4gIHJldHVybiBjaGFubmVsRGVmO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIC8vIERyb3AgaW52YWxpZCBhZ2dyZWdhdGVcbiAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSAmJiAhaXNBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgY29uc3Qge2FnZ3JlZ2F0ZSwgLi4uZmllbGREZWZXaXRob3V0QWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmludmFsaWRBZ2dyZWdhdGUoZmllbGREZWYuYWdncmVnYXRlKSk7XG4gICAgZmllbGREZWYgPSBmaWVsZERlZldpdGhvdXRBZ2dyZWdhdGU7XG4gIH1cblxuICAvLyBOb3JtYWxpemUgVGltZSBVbml0XG4gIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgLi4uZmllbGREZWYsXG4gICAgICB0aW1lVW5pdDogbm9ybWFsaXplVGltZVVuaXQoZmllbGREZWYudGltZVVuaXQpXG4gICAgfTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBiaW5cbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgLi4uZmllbGREZWYsXG4gICAgICBiaW46IG5vcm1hbGl6ZUJpbihmaWVsZERlZi5iaW4sIGNoYW5uZWwpXG4gICAgfTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBUeXBlXG4gIGlmIChmaWVsZERlZi50eXBlKSB7XG4gICAgY29uc3QgZnVsbFR5cGUgPSBnZXRGdWxsTmFtZShmaWVsZERlZi50eXBlKTtcbiAgICBpZiAoZmllbGREZWYudHlwZSAhPT0gZnVsbFR5cGUpIHtcbiAgICAgIC8vIGNvbnZlcnQgc2hvcnQgdHlwZSB0byBmdWxsIHR5cGVcbiAgICAgIGZpZWxkRGVmID0ge1xuICAgICAgICAuLi5maWVsZERlZixcbiAgICAgICAgdHlwZTogZnVsbFR5cGVcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChmaWVsZERlZi50eXBlICE9PSAncXVhbnRpdGF0aXZlJykge1xuICAgICAgaWYgKGlzQ291bnRpbmdBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmludmFsaWRGaWVsZFR5cGVGb3JDb3VudEFnZ3JlZ2F0ZShmaWVsZERlZi50eXBlLCBmaWVsZERlZi5hZ2dyZWdhdGUpKTtcbiAgICAgICAgZmllbGREZWYgPSB7XG4gICAgICAgICAgLi4uZmllbGREZWYsXG4gICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSWYgdHlwZSBpcyBlbXB0eSAvIGludmFsaWQsIHRoZW4gYXVnbWVudCB3aXRoIGRlZmF1bHQgdHlwZVxuICAgIGNvbnN0IG5ld1R5cGUgPSBkZWZhdWx0VHlwZShmaWVsZERlZiwgY2hhbm5lbCk7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZW1wdHlPckludmFsaWRGaWVsZFR5cGUoZmllbGREZWYudHlwZSwgY2hhbm5lbCwgbmV3VHlwZSkpO1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgICAuLi5maWVsZERlZixcbiAgICAgIHR5cGU6IG5ld1R5cGVcbiAgICB9O1xuICB9XG5cbiAgY29uc3Qge2NvbXBhdGlibGUsIHdhcm5pbmd9ID0gY2hhbm5lbENvbXBhdGliaWxpdHkoZmllbGREZWYsIGNoYW5uZWwpO1xuICBpZiAoIWNvbXBhdGlibGUpIHtcbiAgICBsb2cud2Fybih3YXJuaW5nKTtcbiAgfVxuICByZXR1cm4gZmllbGREZWY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVCaW4oYmluOiBCaW5QYXJhbXN8Ym9vbGVhbiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBpZiAoaXNCb29sZWFuKGJpbikpIHtcbiAgICByZXR1cm4ge21heGJpbnM6IGF1dG9NYXhCaW5zKGNoYW5uZWwpfTtcbiAgfSBlbHNlIGlmICghYmluLm1heGJpbnMgJiYgIWJpbi5zdGVwKSB7XG4gICAgcmV0dXJuIHsuLi5iaW4sIG1heGJpbnM6IGF1dG9NYXhCaW5zKGNoYW5uZWwpfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmluO1xuICB9XG59XG5cbmNvbnN0IENPTVBBVElCTEUgPSB7Y29tcGF0aWJsZTogdHJ1ZX07XG5leHBvcnQgZnVuY3Rpb24gY2hhbm5lbENvbXBhdGliaWxpdHkoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPiwgY2hhbm5lbDogQ2hhbm5lbCk6IHtjb21wYXRpYmxlOiBib29sZWFuOyB3YXJuaW5nPzogc3RyaW5nO30ge1xuICBjb25zdCB0eXBlID0gZmllbGREZWYudHlwZTtcblxuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlICdyb3cnOlxuICAgIGNhc2UgJ2NvbHVtbic6XG4gICAgICBpZiAoaXNDb250aW51b3VzKGZpZWxkRGVmKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6IGxvZy5tZXNzYWdlLmZhY2V0Q2hhbm5lbFNob3VsZEJlRGlzY3JldGUoY2hhbm5lbClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAneCc6XG4gICAgY2FzZSAneSc6XG4gICAgY2FzZSAnY29sb3InOlxuICAgIGNhc2UgJ2ZpbGwnOlxuICAgIGNhc2UgJ3N0cm9rZSc6XG4gICAgY2FzZSAndGV4dCc6XG4gICAgY2FzZSAnZGV0YWlsJzpcbiAgICBjYXNlICdrZXknOlxuICAgIGNhc2UgJ3Rvb2x0aXAnOlxuICAgIGNhc2UgJ2hyZWYnOlxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICdsb25naXR1ZGUnOlxuICAgIGNhc2UgJ2xvbmdpdHVkZTInOlxuICAgIGNhc2UgJ2xhdGl0dWRlJzpcbiAgICBjYXNlICdsYXRpdHVkZTInOlxuICAgICAgaWYgKHR5cGUgIT09IFFVQU5USVRBVElWRSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6IGBDaGFubmVsICR7Y2hhbm5lbH0gc2hvdWxkIGJlIHVzZWQgd2l0aCBhIHF1YW50aXRhdGl2ZSBmaWVsZCBvbmx5LCBub3QgJHtmaWVsZERlZi50eXBlfSBmaWVsZC5gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ29wYWNpdHknOlxuICAgIGNhc2UgJ3NpemUnOlxuICAgIGNhc2UgJ3gyJzpcbiAgICBjYXNlICd5Mic6XG4gICAgICBpZiAoKHR5cGUgPT09ICdub21pbmFsJyAmJiAhZmllbGREZWZbJ3NvcnQnXSkgfHwgdHlwZSA9PT0gJ2dlb2pzb24nKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogYENoYW5uZWwgJHtjaGFubmVsfSBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCBhbiB1bnNvcnRlZCBkaXNjcmV0ZSBmaWVsZC5gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ3NoYXBlJzpcbiAgICAgIGlmIChmaWVsZERlZi50eXBlICE9PSAnbm9taW5hbCcgJiYgZmllbGREZWYudHlwZSAhPT0gJ2dlb2pzb24nKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogJ1NoYXBlIGNoYW5uZWwgc2hvdWxkIGJlIHVzZWQgd2l0aCBvbmx5IGVpdGhlciBub21pbmFsIG9yIGdlb2pzb24gZGF0YSdcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnb3JkZXInOlxuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgPT09ICdub21pbmFsJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6IGBDaGFubmVsIG9yZGVyIGlzIGluYXBwcm9wcmlhdGUgZm9yIG5vbWluYWwgZmllbGQsIHdoaWNoIGhhcyBubyBpbmhlcmVudCBvcmRlci5gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ2NoYW5uZWxDb21wYXRhYmlsaXR5IG5vdCBpbXBsZW1lbnRlZCBmb3IgY2hhbm5lbCAnICsgY2hhbm5lbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bWJlckZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZjxhbnk+KSB7XG4gIHJldHVybiBmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJyB8fCAhIWZpZWxkRGVmLmJpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZjxhbnk+KSB7XG4gIHJldHVybiBmaWVsZERlZi50eXBlID09PSAndGVtcG9yYWwnIHx8ICEhZmllbGREZWYudGltZVVuaXQ7XG59XG4iXX0=