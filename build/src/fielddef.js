"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var channel_1 = require("./channel");
var log = require("./log");
var timeunit_1 = require("./timeunit");
var type_1 = require("./type");
var util_1 = require("./util");
function isConditionalSelection(c) {
    return c['selection'];
}
exports.isConditionalSelection = isConditionalSelection;
function isRepeatRef(field) {
    return field && !vega_util_1.isString(field) && 'repeat' in field;
}
exports.isRepeatRef = isRepeatRef;
function toFieldDefBase(fieldDef) {
    var field = fieldDef.field, timeUnit = fieldDef.timeUnit, bin = fieldDef.bin, aggregate = fieldDef.aggregate;
    return __assign({}, (timeUnit ? { timeUnit: timeUnit } : {}), (bin ? { bin: bin } : {}), (aggregate ? { aggregate: aggregate } : {}), { field: field });
}
exports.toFieldDefBase = toFieldDefBase;
function isConditionalDef(channelDef) {
    return !!channelDef && !!channelDef.condition;
}
exports.isConditionalDef = isConditionalDef;
/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
function hasConditionalFieldDef(channelDef) {
    return !!channelDef && !!channelDef.condition && !vega_util_1.isArray(channelDef.condition) && isFieldDef(channelDef.condition);
}
exports.hasConditionalFieldDef = hasConditionalFieldDef;
function hasConditionalValueDef(channelDef) {
    return !!channelDef && !!channelDef.condition && (vega_util_1.isArray(channelDef.condition) || isValueDef(channelDef.condition));
}
exports.hasConditionalValueDef = hasConditionalValueDef;
function isFieldDef(channelDef) {
    return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}
exports.isFieldDef = isFieldDef;
function isStringFieldDef(fieldDef) {
    return isFieldDef(fieldDef) && vega_util_1.isString(fieldDef.field);
}
exports.isStringFieldDef = isStringFieldDef;
function isValueDef(channelDef) {
    return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
}
exports.isValueDef = isValueDef;
function isScaleFieldDef(channelDef) {
    return !!channelDef && (!!channelDef['scale'] || !!channelDef['sort']);
}
exports.isScaleFieldDef = isScaleFieldDef;
function vgField(fieldDef, opt) {
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
            if (fieldDef.bin) {
                fn = bin_1.binToString(fieldDef.bin);
                suffix = opt.binSuffix || '';
            }
            else if (fieldDef.aggregate) {
                fn = String(opt.aggregate || fieldDef.aggregate);
            }
            else if (fieldDef.timeUnit) {
                fn = String(fieldDef.timeUnit);
            }
        }
        if (fn) {
            field = fn + "_" + field;
        }
    }
    if (suffix) {
        field = field + "_" + suffix;
    }
    if (prefix) {
        field = prefix + "_" + field;
    }
    if (opt.expr) {
        field = "" + opt.expr + util_1.accessPath(field);
    }
    return field;
}
exports.vgField = vgField;
function isDiscrete(fieldDef) {
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
exports.isDiscrete = isDiscrete;
function isContinuous(fieldDef) {
    return !isDiscrete(fieldDef);
}
exports.isContinuous = isContinuous;
function isCount(fieldDef) {
    return fieldDef.aggregate === 'count';
}
exports.isCount = isCount;
function verbalTitleFormatter(fieldDef, config) {
    var field = fieldDef.field, bin = fieldDef.bin, timeUnit = fieldDef.timeUnit, aggregate = fieldDef.aggregate;
    if (aggregate === 'count') {
        return config.countTitle;
    }
    else if (bin) {
        return field + " (binned)";
    }
    else if (timeUnit) {
        var units = timeunit_1.getTimeUnitParts(timeUnit).join('-');
        return field + " (" + units + ")";
    }
    else if (aggregate) {
        return util_1.titlecase(aggregate) + " of " + field;
    }
    return field;
}
exports.verbalTitleFormatter = verbalTitleFormatter;
function functionalTitleFormatter(fieldDef, config) {
    var fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
    if (fn) {
        return fn.toUpperCase() + '(' + fieldDef.field + ')';
    }
    else {
        return fieldDef.field;
    }
}
exports.functionalTitleFormatter = functionalTitleFormatter;
exports.defaultTitleFormatter = function (fieldDef, config) {
    switch (config.fieldTitle) {
        case 'plain':
            return fieldDef.field;
        case 'functional':
            return functionalTitleFormatter(fieldDef, config);
        default:
            return verbalTitleFormatter(fieldDef, config);
    }
};
var titleFormatter = exports.defaultTitleFormatter;
function setTitleFormatter(formatter) {
    titleFormatter = formatter;
}
exports.setTitleFormatter = setTitleFormatter;
function resetTitleFormatter() {
    setTitleFormatter(exports.defaultTitleFormatter);
}
exports.resetTitleFormatter = resetTitleFormatter;
function title(fieldDef, config) {
    return titleFormatter(fieldDef, config);
}
exports.title = title;
function defaultType(fieldDef, channel) {
    if (fieldDef.timeUnit) {
        return 'temporal';
    }
    if (fieldDef.bin) {
        return 'quantitative';
    }
    switch (channel_1.rangeType(channel)) {
        case 'continuous':
            return 'quantitative';
        case 'discrete':
            return 'nominal';
        case 'flexible':// color
            return 'nominal';
        default:
            return 'quantitative';
    }
}
exports.defaultType = defaultType;
/**
 * Returns the fieldDef -- either from the outer channelDef or from the condition of channelDef.
 * @param channelDef
 */
function getFieldDef(channelDef) {
    if (isFieldDef(channelDef)) {
        return channelDef;
    }
    else if (hasConditionalFieldDef(channelDef)) {
        return channelDef.condition;
    }
    return undefined;
}
exports.getFieldDef = getFieldDef;
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
function normalize(channelDef, channel) {
    if (vega_util_1.isString(channelDef) || vega_util_1.isNumber(channelDef) || vega_util_1.isBoolean(channelDef)) {
        var primitiveType = vega_util_1.isString(channelDef) ? 'string' :
            vega_util_1.isNumber(channelDef) ? 'number' : 'boolean';
        log.warn(log.message.primitiveChannelDef(channel, primitiveType, channelDef));
        return { value: channelDef };
    }
    // If a fieldDef contains a field, we need type.
    if (isFieldDef(channelDef)) {
        return normalizeFieldDef(channelDef, channel);
    }
    else if (hasConditionalFieldDef(channelDef)) {
        return __assign({}, channelDef, { 
            // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
            condition: normalizeFieldDef(channelDef.condition, channel) });
    }
    return channelDef;
}
exports.normalize = normalize;
function normalizeFieldDef(fieldDef, channel) {
    // Drop invalid aggregate
    if (fieldDef.aggregate && !aggregate_1.isAggregateOp(fieldDef.aggregate)) {
        var aggregate = fieldDef.aggregate, fieldDefWithoutAggregate = __rest(fieldDef, ["aggregate"]);
        log.warn(log.message.invalidAggregate(fieldDef.aggregate));
        fieldDef = fieldDefWithoutAggregate;
    }
    // Normalize Time Unit
    if (fieldDef.timeUnit) {
        fieldDef = __assign({}, fieldDef, { timeUnit: timeunit_1.normalizeTimeUnit(fieldDef.timeUnit) });
    }
    // Normalize bin
    if (fieldDef.bin) {
        fieldDef = __assign({}, fieldDef, { bin: normalizeBin(fieldDef.bin, channel) });
    }
    // Normalize Type
    if (fieldDef.type) {
        var fullType = type_1.getFullName(fieldDef.type);
        if (fieldDef.type !== fullType) {
            // convert short type to full type
            fieldDef = __assign({}, fieldDef, { type: fullType });
        }
        if (fieldDef.type !== 'quantitative') {
            if (aggregate_1.isCountingAggregateOp(fieldDef.aggregate)) {
                log.warn(log.message.invalidFieldTypeForCountAggregate(fieldDef.type, fieldDef.aggregate));
                fieldDef = __assign({}, fieldDef, { type: 'quantitative' });
            }
        }
    }
    else {
        // If type is empty / invalid, then augment with default type
        var newType = defaultType(fieldDef, channel);
        log.warn(log.message.emptyOrInvalidFieldType(fieldDef.type, channel, newType));
        fieldDef = __assign({}, fieldDef, { type: newType });
    }
    var _a = channelCompatibility(fieldDef, channel), compatible = _a.compatible, warning = _a.warning;
    if (!compatible) {
        log.warn(warning);
    }
    return fieldDef;
}
exports.normalizeFieldDef = normalizeFieldDef;
function normalizeBin(bin, channel) {
    if (vega_util_1.isBoolean(bin)) {
        return { maxbins: bin_1.autoMaxBins(channel) };
    }
    else if (!bin.maxbins && !bin.step) {
        return __assign({}, bin, { maxbins: bin_1.autoMaxBins(channel) });
    }
    else {
        return bin;
    }
}
exports.normalizeBin = normalizeBin;
var COMPATIBLE = { compatible: true };
function channelCompatibility(fieldDef, channel) {
    switch (channel) {
        case 'row':
        case 'column':
            if (isContinuous(fieldDef) && !fieldDef.timeUnit) {
                // TODO:(https://github.com/vega/vega-lite/issues/2011):
                // with timeUnit it's not always strictly continuous
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
            if (fieldDef.type !== type_1.QUANTITATIVE) {
                return {
                    compatible: false,
                    warning: "Channel " + channel + " should not be used with " + fieldDef.type + " field."
                };
            }
            return COMPATIBLE;
        case 'opacity':
        case 'size':
        case 'x2':
        case 'y2':
            if (isDiscrete(fieldDef) && !fieldDef.bin) {
                return {
                    compatible: false,
                    warning: "Channel " + channel + " should not be used with discrete field."
                };
            }
            return COMPATIBLE;
        case 'shape':
            if (fieldDef.type !== 'nominal' && fieldDef.type !== 'geojson') {
                return {
                    compatible: false,
                    warning: 'Shape channel should be used with nominal data or geojson only'
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
exports.channelCompatibility = channelCompatibility;
function isNumberFieldDef(fieldDef) {
    return fieldDef.type === 'quantitative' || !!fieldDef.bin;
}
exports.isNumberFieldDef = isNumberFieldDef;
function isTimeFieldDef(fieldDef) {
    return fieldDef.type === 'temporal' || !!fieldDef.timeUnit;
}
exports.isTimeFieldDef = isTimeFieldDef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRkZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLHVDQUFpRTtBQUNqRSx5Q0FBaUU7QUFFakUsNkJBQTBEO0FBQzFELHFDQUE2QztBQUk3QywyQkFBNkI7QUFNN0IsdUNBQXlFO0FBQ3pFLCtCQUF1RDtBQUN2RCwrQkFBNkM7QUErQjdDLGdDQUEwQyxDQUFpQjtJQUN6RCxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCx3REFFQztBQWdERCxxQkFBNEIsS0FBWTtJQUN0QyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsb0JBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxRQUFRLElBQUksS0FBSyxDQUFDO0FBQ3hELENBQUM7QUFGRCxrQ0FFQztBQWdERCx3QkFBK0IsUUFBMEI7SUFDaEQsSUFBQSxzQkFBSyxFQUFFLDRCQUFRLEVBQUUsa0JBQUcsRUFBRSw4QkFBUyxDQUFhO0lBQ25ELE1BQU0sY0FDRCxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxRQUFRLFVBQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDNUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxLQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ2xCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFDLFNBQVMsV0FBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUNqQyxLQUFLLE9BQUEsSUFDTDtBQUNKLENBQUM7QUFSRCx3Q0FRQztBQWdHRCwwQkFBb0MsVUFBeUI7SUFDM0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7QUFDaEQsQ0FBQztBQUZELDRDQUVDO0FBRUQ7O0dB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RSxDQUFDO1lBQ0osQ0FBQztZQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFFcEIsS0FBSyxPQUFPO1lBQ1YsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxNQUFNLENBQUM7b0JBQ0wsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLE9BQU8sRUFBRSxnRUFBZ0U7aUJBQzFFLENBQUM7WUFDSixDQUFDO1lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUVwQixLQUFLLE9BQU87WUFDVixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQztvQkFDTCxVQUFVLEVBQUUsS0FBSztvQkFDakIsT0FBTyxFQUFFLGdGQUFnRjtpQkFDMUYsQ0FBQztZQUNKLENBQUM7WUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLG1EQUFtRCxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ2pGLENBQUM7QUFyRUQsb0RBcUVDO0FBRUQsMEJBQWlDLFFBQXVCO0lBQ3RELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLGNBQWMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztBQUM1RCxDQUFDO0FBRkQsNENBRUM7QUFFRCx3QkFBK0IsUUFBdUI7SUFDcEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0FBQzdELENBQUM7QUFGRCx3Q0FFQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIERlY2xhcmF0aW9uIGFuZCB1dGlsaXR5IGZvciB2YXJpYW50cyBvZiBhIGZpZWxkIGRlZmluaXRpb24gb2JqZWN0XG5pbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcbmltcG9ydCB7aXNBcnJheSwgaXNCb29sZWFuLCBpc051bWJlciwgaXNTdHJpbmd9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge2lzQWdncmVnYXRlT3AsIGlzQ291bnRpbmdBZ2dyZWdhdGVPcH0gZnJvbSAnLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtBeGlzfSBmcm9tICcuL2F4aXMnO1xuaW1wb3J0IHthdXRvTWF4QmlucywgQmluUGFyYW1zLCBiaW5Ub1N0cmluZ30gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDaGFubmVsLCByYW5nZVR5cGV9IGZyb20gJy4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbXBvc2l0ZUFnZ3JlZ2F0ZX0gZnJvbSAnLi9jb21wb3NpdGVtYXJrJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge0xlZ2VuZH0gZnJvbSAnLi9sZWdlbmQnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4vbG9nJztcbmltcG9ydCB7TG9naWNhbE9wZXJhbmR9IGZyb20gJy4vbG9naWNhbCc7XG5pbXBvcnQge1ByZWRpY2F0ZX0gZnJvbSAnLi9wcmVkaWNhdGUnO1xuaW1wb3J0IHtTY2FsZX0gZnJvbSAnLi9zY2FsZSc7XG5pbXBvcnQge1NvcnRGaWVsZCwgU29ydE9yZGVyfSBmcm9tICcuL3NvcnQnO1xuaW1wb3J0IHtTdGFja09mZnNldH0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge2dldFRpbWVVbml0UGFydHMsIG5vcm1hbGl6ZVRpbWVVbml0LCBUaW1lVW5pdH0gZnJvbSAnLi90aW1ldW5pdCc7XG5pbXBvcnQge2dldEZ1bGxOYW1lLCBRVUFOVElUQVRJVkUsIFR5cGV9IGZyb20gJy4vdHlwZSc7XG5pbXBvcnQge2FjY2Vzc1BhdGgsIHRpdGxlY2FzZX0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBEZWZpbml0aW9uIG9iamVjdCBmb3IgYSBjb25zdGFudCB2YWx1ZSBvZiBhbiBlbmNvZGluZyBjaGFubmVsLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbHVlRGVmIHtcbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgdmFsdWUgaW4gdmlzdWFsIGRvbWFpbiAoZS5nLiwgYFwicmVkXCJgIC8gXCIjMDA5OWZmXCIgZm9yIGNvbG9yLCB2YWx1ZXMgYmV0d2VlbiBgMGAgdG8gYDFgIGZvciBvcGFjaXR5KS5cbiAgICovXG4gIHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuO1xufVxuXG4vKipcbiAqIEdlbmVyaWMgdHlwZSBmb3IgY29uZGl0aW9uYWwgY2hhbm5lbERlZi5cbiAqIEYgZGVmaW5lcyB0aGUgdW5kZXJseWluZyBGaWVsZERlZiB0eXBlLlxuICovXG5leHBvcnQgdHlwZSBDaGFubmVsRGVmV2l0aENvbmRpdGlvbjxGIGV4dGVuZHMgRmllbGREZWY8YW55Pj4gPSBGaWVsZERlZldpdGhDb25kaXRpb248Rj4gfCBWYWx1ZURlZldpdGhDb25kaXRpb248Rj47XG5cbmV4cG9ydCB0eXBlIENvbmRpdGlvbmFsPFQ+ID0gQ29uZGl0aW9uYWxQcmVkaWNhdGU8VD4gfCBDb25kaXRpb25hbFNlbGVjdGlvbjxUPjtcblxuZXhwb3J0IHR5cGUgQ29uZGl0aW9uYWxQcmVkaWNhdGU8VD4gPSB7XG4gIHRlc3Q6IExvZ2ljYWxPcGVyYW5kPFByZWRpY2F0ZT47XG59ICYgVDtcblxuZXhwb3J0IHR5cGUgQ29uZGl0aW9uYWxTZWxlY3Rpb248VD4gPSB7XG4gIC8qKlxuICAgKiBBIFtzZWxlY3Rpb24gbmFtZV0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zZWxlY3Rpb24uaHRtbCksIG9yIGEgc2VyaWVzIG9mIFtjb21wb3NlZCBzZWxlY3Rpb25zXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NlbGVjdGlvbi5odG1sI2NvbXBvc2UpLlxuICAgKi9cbiAgc2VsZWN0aW9uOiBMb2dpY2FsT3BlcmFuZDxzdHJpbmc+O1xufSAmIFQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmRpdGlvbmFsU2VsZWN0aW9uPFQ+KGM6IENvbmRpdGlvbmFsPFQ+KTogYyBpcyBDb25kaXRpb25hbFNlbGVjdGlvbjxUPiB7XG4gIHJldHVybiBjWydzZWxlY3Rpb24nXTtcbn1cblxuLyoqXG4gKiBBIEZpZWxkRGVmIHdpdGggQ29uZGl0aW9uPFZhbHVlRGVmPlxuICoge1xuICogICBjb25kaXRpb246IHt2YWx1ZTogLi4ufSxcbiAqICAgZmllbGQ6IC4uLixcbiAqICAgLi4uXG4gKiB9XG4gKi9cbmV4cG9ydCB0eXBlIEZpZWxkRGVmV2l0aENvbmRpdGlvbjxGIGV4dGVuZHMgRmllbGREZWY8YW55Pj4gPSBGICYge1xuICAvKipcbiAgICogT25lIG9yIG1vcmUgdmFsdWUgZGVmaW5pdGlvbihzKSB3aXRoIGEgc2VsZWN0aW9uIHByZWRpY2F0ZS5cbiAgICpcbiAgICogX19Ob3RlOl9fIEEgZmllbGQgZGVmaW5pdGlvbidzIGBjb25kaXRpb25gIHByb3BlcnR5IGNhbiBvbmx5IGNvbnRhaW4gW3ZhbHVlIGRlZmluaXRpb25zXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2VuY29kaW5nLmh0bWwjdmFsdWUtZGVmKVxuICAgKiBzaW5jZSBWZWdhLUxpdGUgb25seSBhbGxvd3MgYXQgbW9zdCBvbmUgZW5jb2RlZCBmaWVsZCBwZXIgZW5jb2RpbmcgY2hhbm5lbC5cbiAgICovXG4gIGNvbmRpdGlvbj86IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdO1xufTtcblxuLyoqXG4gKiBBIFZhbHVlRGVmIHdpdGggQ29uZGl0aW9uPFZhbHVlRGVmIHwgRmllbGREZWY+XG4gKiB7XG4gKiAgIGNvbmRpdGlvbjoge2ZpZWxkOiAuLi59IHwge3ZhbHVlOiAuLi59LFxuICogICB2YWx1ZTogLi4uLFxuICogfVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbHVlRGVmV2l0aENvbmRpdGlvbjxGIGV4dGVuZHMgRmllbGREZWY8YW55Pj4ge1xuICAvKipcbiAgICogQSBmaWVsZCBkZWZpbml0aW9uIG9yIG9uZSBvciBtb3JlIHZhbHVlIGRlZmluaXRpb24ocykgd2l0aCBhIHNlbGVjdGlvbiBwcmVkaWNhdGUuXG4gICAqL1xuICBjb25kaXRpb24/OiBDb25kaXRpb25hbDxGPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdO1xuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IHZhbHVlIGluIHZpc3VhbCBkb21haW4uXG4gICAqL1xuICB2YWx1ZT86IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgcmVwZWF0ZWQgdmFsdWUuXG4gKi9cbmV4cG9ydCB0eXBlIFJlcGVhdFJlZiA9IHtcbiAgcmVwZWF0OiAncm93JyB8ICdjb2x1bW4nXG59O1xuXG5leHBvcnQgdHlwZSBGaWVsZCA9IHN0cmluZyB8IFJlcGVhdFJlZjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwZWF0UmVmKGZpZWxkOiBGaWVsZCk6IGZpZWxkIGlzIFJlcGVhdFJlZiB7XG4gIHJldHVybiBmaWVsZCAmJiAhaXNTdHJpbmcoZmllbGQpICYmICdyZXBlYXQnIGluIGZpZWxkO1xufVxuXG4vKiogQGhpZGUgKi9cbmV4cG9ydCB0eXBlIEhpZGRlbkNvbXBvc2l0ZUFnZ3JlZ2F0ZSA9IENvbXBvc2l0ZUFnZ3JlZ2F0ZTtcblxuZXhwb3J0IHR5cGUgQWdncmVnYXRlID0gQWdncmVnYXRlT3AgfCBIaWRkZW5Db21wb3NpdGVBZ2dyZWdhdGU7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGREZWZCYXNlPEY+IHtcblxuICAvKipcbiAgICogX19SZXF1aXJlZC5fXyBBIHN0cmluZyBkZWZpbmluZyB0aGUgbmFtZSBvZiB0aGUgZmllbGQgZnJvbSB3aGljaCB0byBwdWxsIGEgZGF0YSB2YWx1ZVxuICAgKiBvciBhbiBvYmplY3QgZGVmaW5pbmcgaXRlcmF0ZWQgdmFsdWVzIGZyb20gdGhlIFtgcmVwZWF0YF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9yZXBlYXQuaHRtbCkgb3BlcmF0b3IuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBEb3RzIChgLmApIGFuZCBicmFja2V0cyAoYFtgIGFuZCBgXWApIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyBuZXN0ZWQgb2JqZWN0cyAoZS5nLiwgYFwiZmllbGRcIjogXCJmb28uYmFyXCJgIGFuZCBgXCJmaWVsZFwiOiBcImZvb1snYmFyJ11cImApLlxuICAgKiBJZiBmaWVsZCBuYW1lcyBjb250YWluIGRvdHMgb3IgYnJhY2tldHMgYnV0IGFyZSBub3QgbmVzdGVkLCB5b3UgY2FuIHVzZSBgXFxcXGAgdG8gZXNjYXBlIGRvdHMgYW5kIGJyYWNrZXRzIChlLmcuLCBgXCJhXFxcXC5iXCJgIGFuZCBgXCJhXFxcXFswXFxcXF1cImApLlxuICAgKiBTZWUgbW9yZSBkZXRhaWxzIGFib3V0IGVzY2FwaW5nIGluIHRoZSBbZmllbGQgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9maWVsZC5odG1sKS5cbiAgICpcbiAgICogX19Ob3RlOl9fIGBmaWVsZGAgaXMgbm90IHJlcXVpcmVkIGlmIGBhZ2dyZWdhdGVgIGlzIGBjb3VudGAuXG4gICAqL1xuICBmaWVsZD86IEY7XG5cbiAgLy8gZnVuY3Rpb25cblxuICAvKipcbiAgICogVGltZSB1bml0IChlLmcuLCBgeWVhcmAsIGB5ZWFybW9udGhgLCBgbW9udGhgLCBgaG91cnNgKSBmb3IgYSB0ZW1wb3JhbCBmaWVsZC5cbiAgICogb3IgW2EgdGVtcG9yYWwgZmllbGQgdGhhdCBnZXRzIGNhc3RlZCBhcyBvcmRpbmFsXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3R5cGUuaHRtbCNjYXN0KS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB1bmRlZmluZWRgIChOb25lKVxuICAgKi9cbiAgdGltZVVuaXQ/OiBUaW1lVW5pdDtcblxuICAvKipcbiAgICogQSBmbGFnIGZvciBiaW5uaW5nIGEgYHF1YW50aXRhdGl2ZWAgZmllbGQsIG9yIFthbiBvYmplY3QgZGVmaW5pbmcgYmlubmluZyBwYXJhbWV0ZXJzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2Jpbi5odG1sI3BhcmFtcykuXG4gICAqIElmIGB0cnVlYCwgZGVmYXVsdCBbYmlubmluZyBwYXJhbWV0ZXJzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2Jpbi5odG1sKSB3aWxsIGJlIGFwcGxpZWQuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgZmFsc2VgXG4gICAqL1xuICBiaW4/OiBib29sZWFuIHwgQmluUGFyYW1zO1xuXG4gIC8qKlxuICAgKiBBZ2dyZWdhdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGZpZWxkXG4gICAqIChlLmcuLCBgbWVhbmAsIGBzdW1gLCBgbWVkaWFuYCwgYG1pbmAsIGBtYXhgLCBgY291bnRgKS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB1bmRlZmluZWRgIChOb25lKVxuICAgKi9cbiAgYWdncmVnYXRlPzogQWdncmVnYXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9GaWVsZERlZkJhc2UoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pOiBGaWVsZERlZkJhc2U8c3RyaW5nPiB7XG4gIGNvbnN0IHtmaWVsZCwgdGltZVVuaXQsIGJpbiwgYWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICByZXR1cm4ge1xuICAgIC4uLih0aW1lVW5pdCA/IHt0aW1lVW5pdH0gOiB7fSksXG4gICAgLi4uKGJpbiA/IHtiaW59IDoge30pLFxuICAgIC4uLihhZ2dyZWdhdGUgPyB7YWdncmVnYXRlfSA6IHt9KSxcbiAgICBmaWVsZFxuICB9O1xufVxuXG4vKipcbiAqICBEZWZpbml0aW9uIG9iamVjdCBmb3IgYSBkYXRhIGZpZWxkLCBpdHMgdHlwZSBhbmQgdHJhbnNmb3JtYXRpb24gb2YgYW4gZW5jb2RpbmcgY2hhbm5lbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmQmFzZTxGPiB7XG4gIC8qKlxuICAgKiBUaGUgZW5jb2RlZCBmaWVsZCdzIHR5cGUgb2YgbWVhc3VyZW1lbnQgKGBcInF1YW50aXRhdGl2ZVwiYCwgYFwidGVtcG9yYWxcImAsIGBcIm9yZGluYWxcImAsIG9yIGBcIm5vbWluYWxcImApLlxuICAgKiBJdCBjYW4gYWxzbyBiZSBhIGdlbyB0eXBlIChgXCJsYXRpdHVkZVwiYCwgYFwibG9uZ2l0dWRlXCJgLCBhbmQgYFwiZ2VvanNvblwiYCkgd2hlbiBhIFtnZW9ncmFwaGljIHByb2plY3Rpb25dKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvcHJvamVjdGlvbi5odG1sKSBpcyBhcHBsaWVkLlxuICAgKi9cbiAgLy8gKiBvciBhbiBpbml0aWFsIGNoYXJhY3RlciBvZiB0aGUgdHlwZSBuYW1lIChgXCJRXCJgLCBgXCJUXCJgLCBgXCJPXCJgLCBgXCJOXCJgKS5cbiAgLy8gKiBUaGlzIHByb3BlcnR5IGlzIGNhc2UtaW5zZW5zaXRpdmUuXG4gIHR5cGU6IFR5cGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NhbGVGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIHRoZSBjaGFubmVsJ3Mgc2NhbGUsIHdoaWNoIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHRyYW5zZm9ybXMgdmFsdWVzIGluIHRoZSBkYXRhIGRvbWFpbiAobnVtYmVycywgZGF0ZXMsIHN0cmluZ3MsIGV0YykgdG8gdmlzdWFsIHZhbHVlcyAocGl4ZWxzLCBjb2xvcnMsIHNpemVzKSBvZiB0aGUgZW5jb2RpbmcgY2hhbm5lbHMuXG4gICAqXG4gICAqIElmIGBudWxsYCwgdGhlIHNjYWxlIHdpbGwgYmUgW2Rpc2FibGVkIGFuZCB0aGUgZGF0YSB2YWx1ZSB3aWxsIGJlIGRpcmVjdGx5IGVuY29kZWRdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2NhbGUuaHRtbCNkaXNhYmxlKS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIElmIHVuZGVmaW5lZCwgZGVmYXVsdCBbc2NhbGUgcHJvcGVydGllc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zY2FsZS5odG1sKSBhcmUgYXBwbGllZC5cbiAgICovXG4gIHNjYWxlPzogU2NhbGUgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBTb3J0IG9yZGVyIGZvciB0aGUgZW5jb2RlZCBmaWVsZC5cbiAgICogU3VwcG9ydGVkIGBzb3J0YCB2YWx1ZXMgaW5jbHVkZSBgXCJhc2NlbmRpbmdcImAsIGBcImRlc2NlbmRpbmdcImAgYW5kIGBudWxsYCAobm8gc29ydGluZykuXG4gICAqIEZvciBmaWVsZHMgd2l0aCBkaXNjcmV0ZSBkb21haW5zLCBgc29ydGAgY2FuIGFsc28gYmUgYSBbc29ydCBmaWVsZCBkZWZpbml0aW9uIG9iamVjdF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zb3J0Lmh0bWwjc29ydC1maWVsZCkuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgXCJhc2NlbmRpbmdcImBcbiAgICovXG4gIHNvcnQ/OiBTb3J0T3JkZXIgfCBTb3J0RmllbGQ8Rj4gfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uRmllbGREZWY8Rj4gZXh0ZW5kcyBTY2FsZUZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIGF4aXMncyBncmlkbGluZXMsIHRpY2tzIGFuZCBsYWJlbHMuXG4gICAqIElmIGBudWxsYCwgdGhlIGF4aXMgZm9yIHRoZSBlbmNvZGluZyBjaGFubmVsIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIElmIHVuZGVmaW5lZCwgZGVmYXVsdCBbYXhpcyBwcm9wZXJ0aWVzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2F4aXMuaHRtbCkgYXJlIGFwcGxpZWQuXG4gICAqL1xuICBheGlzPzogQXhpcyB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2Ygc3RhY2tpbmcgb2Zmc2V0IGlmIHRoZSBmaWVsZCBzaG91bGQgYmUgc3RhY2tlZC5cbiAgICogYHN0YWNrYCBpcyBvbmx5IGFwcGxpY2FibGUgZm9yIGB4YCBhbmQgYHlgIGNoYW5uZWxzIHdpdGggY29udGludW91cyBkb21haW5zLlxuICAgKiBGb3IgZXhhbXBsZSwgYHN0YWNrYCBvZiBgeWAgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIHN0YWNraW5nIGZvciBhIHZlcnRpY2FsIGJhciBjaGFydC5cbiAgICpcbiAgICogYHN0YWNrYCBjYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICAgKiAtIGBcInplcm9cImA6IHN0YWNraW5nIHdpdGggYmFzZWxpbmUgb2Zmc2V0IGF0IHplcm8gdmFsdWUgb2YgdGhlIHNjYWxlIChmb3IgY3JlYXRpbmcgdHlwaWNhbCBzdGFja2VkIFtiYXJdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3RhY2suaHRtbCNiYXIpIGFuZCBbYXJlYV0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zdGFjay5odG1sI2FyZWEpIGNoYXJ0KS5cbiAgICogLSBgXCJub3JtYWxpemVcImAgLSBzdGFja2luZyB3aXRoIG5vcm1hbGl6ZWQgZG9tYWluIChmb3IgY3JlYXRpbmcgW25vcm1hbGl6ZWQgc3RhY2tlZCBiYXIgYW5kIGFyZWEgY2hhcnRzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3N0YWNrLmh0bWwjbm9ybWFsaXplZCkuIDxici8+XG4gICAqIC1gXCJjZW50ZXJcImAgLSBzdGFja2luZyB3aXRoIGNlbnRlciBiYXNlbGluZSAoZm9yIFtzdHJlYW1ncmFwaF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zdGFjay5odG1sI3N0cmVhbWdyYXBoKSkuXG4gICAqIC0gYG51bGxgIC0gTm8tc3RhY2tpbmcuIFRoaXMgd2lsbCBwcm9kdWNlIGxheWVyZWQgW2Jhcl0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zdGFjay5odG1sI2xheWVyZWQtYmFyLWNoYXJ0KSBhbmQgYXJlYSBjaGFydC5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB6ZXJvYCBmb3IgcGxvdHMgd2l0aCBhbGwgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSB0cnVlOlxuICAgKiAoMSkgdGhlIG1hcmsgaXMgYGJhcmAgb3IgYGFyZWFgO1xuICAgKiAoMikgdGhlIHN0YWNrZWQgbWVhc3VyZSBjaGFubmVsICh4IG9yIHkpIGhhcyBhIGxpbmVhciBzY2FsZTtcbiAgICogKDMpIEF0IGxlYXN0IG9uZSBvZiBub24tcG9zaXRpb24gY2hhbm5lbHMgbWFwcGVkIHRvIGFuIHVuYWdncmVnYXRlZCBmaWVsZCB0aGF0IGlzIGRpZmZlcmVudCBmcm9tIHggYW5kIHkuICBPdGhlcndpc2UsIGBudWxsYCBieSBkZWZhdWx0LlxuICAgKi9cbiAgc3RhY2s/OiBTdGFja09mZnNldCB8IG51bGw7XG59XG5cbi8qKlxuICogRmllbGQgZGVmaW5pdGlvbiBvZiBhIG1hcmsgcHJvcGVydHksIHdoaWNoIGNhbiBjb250YWluIGEgbGVnZW5kLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtQcm9wRmllbGREZWY8Rj4gZXh0ZW5kcyBTY2FsZUZpZWxkRGVmPEY+IHtcbiAgIC8qKlxuICAgICogQW4gb2JqZWN0IGRlZmluaW5nIHByb3BlcnRpZXMgb2YgdGhlIGxlZ2VuZC5cbiAgICAqIElmIGBudWxsYCwgdGhlIGxlZ2VuZCBmb3IgdGhlIGVuY29kaW5nIGNoYW5uZWwgd2lsbCBiZSByZW1vdmVkLlxuICAgICpcbiAgICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBJZiB1bmRlZmluZWQsIGRlZmF1bHQgW2xlZ2VuZCBwcm9wZXJ0aWVzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2xlZ2VuZC5odG1sKSBhcmUgYXBwbGllZC5cbiAgICAqL1xuICBsZWdlbmQ/OiBMZWdlbmQgfCBudWxsO1xufVxuXG4vLyBEZXRhaWxcblxuLy8gT3JkZXIgUGF0aCBoYXZlIG5vIHNjYWxlXG5cbmV4cG9ydCBpbnRlcmZhY2UgT3JkZXJGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIFRoZSBzb3J0IG9yZGVyLiBPbmUgb2YgYFwiYXNjZW5kaW5nXCJgIChkZWZhdWx0KSBvciBgXCJkZXNjZW5kaW5nXCJgLlxuICAgKi9cbiAgc29ydD86IFNvcnRPcmRlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZXh0RmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBUaGUgW2Zvcm1hdHRpbmcgcGF0dGVybl0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9mb3JtYXQuaHRtbCkgZm9yIGEgdGV4dCBmaWVsZC4gSWYgbm90IGRlZmluZWQsIHRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBmb3JtYXQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIENoYW5uZWxEZWY8Rj4gPSBDaGFubmVsRGVmV2l0aENvbmRpdGlvbjxGaWVsZERlZjxGPj47XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmRpdGlvbmFsRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uPEZpZWxkRGVmPEY+PiB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgISFjaGFubmVsRGVmLmNvbmRpdGlvbjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gaWYgYSBjaGFubmVsRGVmIGlzIGEgQ29uZGl0aW9uYWxWYWx1ZURlZiB3aXRoIENvbmRpdGlvbkZpZWxkRGVmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNDb25kaXRpb25hbEZpZWxkRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIChWYWx1ZURlZiAmIHtjb25kaXRpb246IENvbmRpdGlvbmFsPEZpZWxkRGVmPEY+Pn0pIHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAhIWNoYW5uZWxEZWYuY29uZGl0aW9uICYmICFpc0FycmF5KGNoYW5uZWxEZWYuY29uZGl0aW9uKSAmJiBpc0ZpZWxkRGVmKGNoYW5uZWxEZWYuY29uZGl0aW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0NvbmRpdGlvbmFsVmFsdWVEZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgKFZhbHVlRGVmICYge2NvbmRpdGlvbjogQ29uZGl0aW9uYWw8VmFsdWVEZWY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+W119KSB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgISFjaGFubmVsRGVmLmNvbmRpdGlvbiAmJiAoXG4gICAgaXNBcnJheShjaGFubmVsRGVmLmNvbmRpdGlvbikgfHwgaXNWYWx1ZURlZihjaGFubmVsRGVmLmNvbmRpdGlvbilcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmllbGREZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgRmllbGREZWY8Rj4gfCBQb3NpdGlvbkZpZWxkRGVmPEY+IHwgU2NhbGVGaWVsZERlZjxGPiB8IE1hcmtQcm9wRmllbGREZWY8Rj4gfCBPcmRlckZpZWxkRGVmPEY+IHwgVGV4dEZpZWxkRGVmPEY+IHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAoISFjaGFubmVsRGVmWydmaWVsZCddIHx8IGNoYW5uZWxEZWZbJ2FnZ3JlZ2F0ZSddID09PSAnY291bnQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nRmllbGREZWYoZmllbGREZWY6IENoYW5uZWxEZWY8c3RyaW5nfFJlcGVhdFJlZj4pOiBmaWVsZERlZiBpcyBGaWVsZERlZjxzdHJpbmc+IHtcbiAgcmV0dXJuIGlzRmllbGREZWYoZmllbGREZWYpICYmIGlzU3RyaW5nKGZpZWxkRGVmLmZpZWxkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsdWVEZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgVmFsdWVEZWYge1xuICByZXR1cm4gY2hhbm5lbERlZiAmJiAndmFsdWUnIGluIGNoYW5uZWxEZWYgJiYgY2hhbm5lbERlZlsndmFsdWUnXSAhPT0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTY2FsZUZpZWxkRGVmKGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8YW55Pik6IGNoYW5uZWxEZWYgaXMgU2NhbGVGaWVsZERlZjxhbnk+IHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAoISFjaGFubmVsRGVmWydzY2FsZSddIHx8ICEhY2hhbm5lbERlZlsnc29ydCddKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGaWVsZFJlZk9wdGlvbiB7XG4gIC8qKiBleGNsdWRlIGJpbiwgYWdncmVnYXRlLCB0aW1lVW5pdCAqL1xuICBub2ZuPzogYm9vbGVhbjtcbiAgLyoqIFdyYXAgdGhlIGZpZWxkIHdpdGggZGF0dW0gb3IgcGFyZW50IChlLmcuLCBkYXR1bVsnLi4uJ10gZm9yIFZlZ2EgRXhwcmVzc2lvbiAqL1xuICBleHByPzogJ2RhdHVtJyB8ICdwYXJlbnQnO1xuICAvKiogcHJlcGVuZCBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXggKi9cbiAgcHJlZml4Pzogc3RyaW5nO1xuICAvKiogYXBwZW5kIHN1ZmZpeCB0byB0aGUgZmllbGQgcmVmIGZvciBiaW4gKGRlZmF1bHQ9J3N0YXJ0JykgKi9cbiAgYmluU3VmZml4PzogJ2VuZCcgfCAncmFuZ2UnIHwgJ21pZCc7XG4gIC8qKiBhcHBlbmQgc3VmZml4IHRvIHRoZSBmaWVsZCByZWYgKGdlbmVyYWwpICovXG4gIHN1ZmZpeD86IHN0cmluZztcbiAgLyoqIE92ZXJycmlkZSB3aGljaCBhZ2dyZWdhdGUgdG8gdXNlLiBOZWVkZWQgZm9yIHVuYWdncmVnYXRlZCBkb21haW4uICovXG4gIGFnZ3JlZ2F0ZT86IEFnZ3JlZ2F0ZU9wO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmdGaWVsZChmaWVsZERlZjogRmllbGREZWZCYXNlPHN0cmluZz4sIG9wdDogRmllbGRSZWZPcHRpb24gPSB7fSk6IHN0cmluZyB7XG4gIGxldCBmaWVsZCA9IGZpZWxkRGVmLmZpZWxkO1xuICBjb25zdCBwcmVmaXggPSBvcHQucHJlZml4O1xuICBsZXQgc3VmZml4ID0gb3B0LnN1ZmZpeDtcblxuICBpZiAoaXNDb3VudChmaWVsZERlZikpIHtcbiAgICBmaWVsZCA9ICdjb3VudF8qJztcbiAgfSBlbHNlIHtcbiAgICBsZXQgZm46IHN0cmluZyA9IHVuZGVmaW5lZDtcblxuICAgIGlmICghb3B0Lm5vZm4pIHtcbiAgICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgZm4gPSBiaW5Ub1N0cmluZyhmaWVsZERlZi5iaW4pO1xuICAgICAgICBzdWZmaXggPSBvcHQuYmluU3VmZml4IHx8ICcnO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgZm4gPSBTdHJpbmcob3B0LmFnZ3JlZ2F0ZSB8fCBmaWVsZERlZi5hZ2dyZWdhdGUpO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICBmbiA9IFN0cmluZyhmaWVsZERlZi50aW1lVW5pdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZuKSB7XG4gICAgICBmaWVsZCA9IGAke2ZufV8ke2ZpZWxkfWA7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1ZmZpeCkge1xuICAgIGZpZWxkID0gYCR7ZmllbGR9XyR7c3VmZml4fWA7XG4gIH1cblxuICBpZiAocHJlZml4KSB7XG4gICAgZmllbGQgPSBgJHtwcmVmaXh9XyR7ZmllbGR9YDtcbiAgfVxuXG4gIGlmIChvcHQuZXhwcikge1xuICAgIGZpZWxkID0gYCR7b3B0LmV4cHJ9JHthY2Nlc3NQYXRoKGZpZWxkKX1gO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEaXNjcmV0ZShmaWVsZERlZjogRmllbGREZWY8RmllbGQ+KSB7XG4gIHN3aXRjaCAoZmllbGREZWYudHlwZSkge1xuICAgIGNhc2UgJ25vbWluYWwnOlxuICAgIGNhc2UgJ29yZGluYWwnOlxuICAgIGNhc2UgJ2dlb2pzb24nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSAncXVhbnRpdGF0aXZlJzpcbiAgICAgIHJldHVybiAhIWZpZWxkRGVmLmJpbjtcbiAgICBjYXNlICdsYXRpdHVkZSc6XG4gICAgY2FzZSAnbG9uZ2l0dWRlJzpcbiAgICBjYXNlICd0ZW1wb3JhbCc6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGxvZy5tZXNzYWdlLmludmFsaWRGaWVsZFR5cGUoZmllbGREZWYudHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb250aW51b3VzKGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4pIHtcbiAgcmV0dXJuICFpc0Rpc2NyZXRlKGZpZWxkRGVmKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ291bnQoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxGaWVsZD4pIHtcbiAgcmV0dXJuIGZpZWxkRGVmLmFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jztcbn1cblxuZXhwb3J0IHR5cGUgRmllbGRUaXRsZUZvcm1hdHRlciA9IChmaWVsZERlZjogRmllbGREZWZCYXNlPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSA9PiBzdHJpbmc7XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJiYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZjogRmllbGREZWZCYXNlPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IHtmaWVsZDogZmllbGQsIGJpbiwgdGltZVVuaXQsIGFnZ3JlZ2F0ZX0gPSBmaWVsZERlZjtcbiAgaWYgKGFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jykge1xuICAgIHJldHVybiBjb25maWcuY291bnRUaXRsZTtcbiAgfSBlbHNlIGlmIChiaW4pIHtcbiAgICByZXR1cm4gYCR7ZmllbGR9IChiaW5uZWQpYDtcbiAgfSBlbHNlIGlmICh0aW1lVW5pdCkge1xuICAgIGNvbnN0IHVuaXRzID0gZ2V0VGltZVVuaXRQYXJ0cyh0aW1lVW5pdCkuam9pbignLScpO1xuICAgIHJldHVybiBgJHtmaWVsZH0gKCR7dW5pdHN9KWA7XG4gIH0gZWxzZSBpZiAoYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIGAke3RpdGxlY2FzZShhZ2dyZWdhdGUpfSBvZiAke2ZpZWxkfWA7XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25hbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgZm4gPSBmaWVsZERlZi5hZ2dyZWdhdGUgfHwgZmllbGREZWYudGltZVVuaXQgfHwgKGZpZWxkRGVmLmJpbiAmJiAnYmluJyk7XG4gIGlmIChmbikge1xuICAgIHJldHVybiBmbi50b1VwcGVyQ2FzZSgpICsgJygnICsgZmllbGREZWYuZmllbGQgKyAnKSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZpZWxkRGVmLmZpZWxkO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0VGl0bGVGb3JtYXR0ZXI6IEZpZWxkVGl0bGVGb3JtYXR0ZXIgPSAoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxzdHJpbmc+LCBjb25maWc6IENvbmZpZykgPT4ge1xuICBzd2l0Y2ggKGNvbmZpZy5maWVsZFRpdGxlKSB7XG4gICAgY2FzZSAncGxhaW4nOlxuICAgICAgcmV0dXJuIGZpZWxkRGVmLmZpZWxkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uYWwnOlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZiwgY29uZmlnKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHZlcmJhbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xuICB9XG59O1xuXG5sZXQgdGl0bGVGb3JtYXR0ZXIgPSBkZWZhdWx0VGl0bGVGb3JtYXR0ZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRUaXRsZUZvcm1hdHRlcihmb3JtYXR0ZXI6IEZpZWxkVGl0bGVGb3JtYXR0ZXIpIHtcbiAgdGl0bGVGb3JtYXR0ZXIgPSBmb3JtYXR0ZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldFRpdGxlRm9ybWF0dGVyKCkge1xuICBzZXRUaXRsZUZvcm1hdHRlcihkZWZhdWx0VGl0bGVGb3JtYXR0ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICByZXR1cm4gdGl0bGVGb3JtYXR0ZXIoZmllbGREZWYsIGNvbmZpZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0VHlwZShmaWVsZERlZjogRmllbGREZWY8RmllbGQ+LCBjaGFubmVsOiBDaGFubmVsKTogVHlwZSB7XG4gIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgIHJldHVybiAndGVtcG9yYWwnO1xuICB9XG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICByZXR1cm4gJ3F1YW50aXRhdGl2ZSc7XG4gIH1cbiAgc3dpdGNoIChyYW5nZVR5cGUoY2hhbm5lbCkpIHtcbiAgICBjYXNlICdjb250aW51b3VzJzpcbiAgICAgIHJldHVybiAncXVhbnRpdGF0aXZlJztcbiAgICBjYXNlICdkaXNjcmV0ZSc6XG4gICAgICByZXR1cm4gJ25vbWluYWwnO1xuICAgIGNhc2UgJ2ZsZXhpYmxlJzogLy8gY29sb3JcbiAgICAgIHJldHVybiAnbm9taW5hbCc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAncXVhbnRpdGF0aXZlJztcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpZWxkRGVmIC0tIGVpdGhlciBmcm9tIHRoZSBvdXRlciBjaGFubmVsRGVmIG9yIGZyb20gdGhlIGNvbmRpdGlvbiBvZiBjaGFubmVsRGVmLlxuICogQHBhcmFtIGNoYW5uZWxEZWZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpZWxkRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBGaWVsZERlZjxGPiB7XG4gIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIGNoYW5uZWxEZWY7XG4gIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiBjaGFubmVsRGVmLmNvbmRpdGlvbjtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENvbnZlcnQgdHlwZSB0byBmdWxsLCBsb3dlcmNhc2UgdHlwZSwgb3IgYXVnbWVudCB0aGUgZmllbGREZWYgd2l0aCBhIGRlZmF1bHQgdHlwZSBpZiBtaXNzaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCk6IENoYW5uZWxEZWY8YW55PiB7XG4gIGlmIChpc1N0cmluZyhjaGFubmVsRGVmKSB8fCBpc051bWJlcihjaGFubmVsRGVmKSB8fCBpc0Jvb2xlYW4oY2hhbm5lbERlZikpIHtcbiAgICBjb25zdCBwcmltaXRpdmVUeXBlID0gaXNTdHJpbmcoY2hhbm5lbERlZikgPyAnc3RyaW5nJyA6XG4gICAgICBpc051bWJlcihjaGFubmVsRGVmKSA/ICdudW1iZXInIDogJ2Jvb2xlYW4nO1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnByaW1pdGl2ZUNoYW5uZWxEZWYoY2hhbm5lbCwgcHJpbWl0aXZlVHlwZSwgY2hhbm5lbERlZikpO1xuICAgIHJldHVybiB7dmFsdWU6IGNoYW5uZWxEZWZ9O1xuICB9XG5cbiAgLy8gSWYgYSBmaWVsZERlZiBjb250YWlucyBhIGZpZWxkLCB3ZSBuZWVkIHR5cGUuXG4gIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZUZpZWxkRGVmKGNoYW5uZWxEZWYsIGNoYW5uZWwpO1xuICB9IGVsc2UgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uY2hhbm5lbERlZixcbiAgICAgIC8vIE5lZWQgdG8gY2FzdCBhcyBub3JtYWxpemVGaWVsZERlZiBub3JtYWxseSByZXR1cm4gRmllbGREZWYsIGJ1dCBoZXJlIHdlIGtub3cgdGhhdCBpdCBpcyBkZWZpbml0ZWx5IENvbmRpdGlvbjxGaWVsZERlZj5cbiAgICAgIGNvbmRpdGlvbjogbm9ybWFsaXplRmllbGREZWYoY2hhbm5lbERlZi5jb25kaXRpb24sIGNoYW5uZWwpIGFzIENvbmRpdGlvbmFsPEZpZWxkRGVmPHN0cmluZz4+XG4gICAgfTtcbiAgfVxuICByZXR1cm4gY2hhbm5lbERlZjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAvLyBEcm9wIGludmFsaWQgYWdncmVnYXRlXG4gIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUgJiYgIWlzQWdncmVnYXRlT3AoZmllbGREZWYuYWdncmVnYXRlKSkge1xuICAgIGNvbnN0IHthZ2dyZWdhdGUsIC4uLmZpZWxkRGVmV2l0aG91dEFnZ3JlZ2F0ZX0gPSBmaWVsZERlZjtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkQWdncmVnYXRlKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpO1xuICAgIGZpZWxkRGVmID0gZmllbGREZWZXaXRob3V0QWdncmVnYXRlO1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIFRpbWUgVW5pdFxuICBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICBmaWVsZERlZiA9IHtcbiAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgdGltZVVuaXQ6IG5vcm1hbGl6ZVRpbWVVbml0KGZpZWxkRGVmLnRpbWVVbml0KVxuICAgIH07XG4gIH1cblxuICAvLyBOb3JtYWxpemUgYmluXG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICBmaWVsZERlZiA9IHtcbiAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgYmluOiBub3JtYWxpemVCaW4oZmllbGREZWYuYmluLCBjaGFubmVsKVxuICAgIH07XG4gIH1cblxuICAvLyBOb3JtYWxpemUgVHlwZVxuICBpZiAoZmllbGREZWYudHlwZSkge1xuICAgIGNvbnN0IGZ1bGxUeXBlID0gZ2V0RnVsbE5hbWUoZmllbGREZWYudHlwZSk7XG4gICAgaWYgKGZpZWxkRGVmLnR5cGUgIT09IGZ1bGxUeXBlKSB7XG4gICAgICAvLyBjb252ZXJ0IHNob3J0IHR5cGUgdG8gZnVsbCB0eXBlXG4gICAgICBmaWVsZERlZiA9IHtcbiAgICAgICAgLi4uZmllbGREZWYsXG4gICAgICAgIHR5cGU6IGZ1bGxUeXBlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoZmllbGREZWYudHlwZSAhPT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICAgIGlmIChpc0NvdW50aW5nQWdncmVnYXRlT3AoZmllbGREZWYuYWdncmVnYXRlKSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkRmllbGRUeXBlRm9yQ291bnRBZ2dyZWdhdGUoZmllbGREZWYudHlwZSwgZmllbGREZWYuYWdncmVnYXRlKSk7XG4gICAgICAgIGZpZWxkRGVmID0ge1xuICAgICAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElmIHR5cGUgaXMgZW1wdHkgLyBpbnZhbGlkLCB0aGVuIGF1Z21lbnQgd2l0aCBkZWZhdWx0IHR5cGVcbiAgICBjb25zdCBuZXdUeXBlID0gZGVmYXVsdFR5cGUoZmllbGREZWYsIGNoYW5uZWwpO1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmVtcHR5T3JJbnZhbGlkRmllbGRUeXBlKGZpZWxkRGVmLnR5cGUsIGNoYW5uZWwsIG5ld1R5cGUpKTtcbiAgICBmaWVsZERlZiA9IHtcbiAgICAgICAgLi4uZmllbGREZWYsXG4gICAgICB0eXBlOiBuZXdUeXBlXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHtjb21wYXRpYmxlLCB3YXJuaW5nfSA9IGNoYW5uZWxDb21wYXRpYmlsaXR5KGZpZWxkRGVmLCBjaGFubmVsKTtcbiAgaWYgKCFjb21wYXRpYmxlKSB7XG4gICAgbG9nLndhcm4od2FybmluZyk7XG4gIH1cbiAgcmV0dXJuIGZpZWxkRGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQmluKGJpbjogQmluUGFyYW1zfGJvb2xlYW4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgaWYgKGlzQm9vbGVhbihiaW4pKSB7XG4gICAgcmV0dXJuIHttYXhiaW5zOiBhdXRvTWF4QmlucyhjaGFubmVsKX07XG4gIH0gZWxzZSBpZiAoIWJpbi5tYXhiaW5zICYmICFiaW4uc3RlcCkge1xuICAgIHJldHVybiB7Li4uYmluLCBtYXhiaW5zOiBhdXRvTWF4QmlucyhjaGFubmVsKX07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJpbjtcbiAgfVxufVxuXG5jb25zdCBDT01QQVRJQkxFID0ge2NvbXBhdGlibGU6IHRydWV9O1xuZXhwb3J0IGZ1bmN0aW9uIGNoYW5uZWxDb21wYXRpYmlsaXR5KGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4sIGNoYW5uZWw6IENoYW5uZWwpOiB7Y29tcGF0aWJsZTogYm9vbGVhbjsgd2FybmluZz86IHN0cmluZzt9IHtcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSAncm93JzpcbiAgICBjYXNlICdjb2x1bW4nOlxuICAgICAgaWYgKGlzQ29udGludW91cyhmaWVsZERlZikgJiYgIWZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIC8vIFRPRE86KGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjAxMSk6XG4gICAgICAgIC8vIHdpdGggdGltZVVuaXQgaXQncyBub3QgYWx3YXlzIHN0cmljdGx5IGNvbnRpbnVvdXNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBsb2cubWVzc2FnZS5mYWNldENoYW5uZWxTaG91bGRCZURpc2NyZXRlKGNoYW5uZWwpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ3gnOlxuICAgIGNhc2UgJ3knOlxuICAgIGNhc2UgJ2NvbG9yJzpcbiAgICBjYXNlICdmaWxsJzpcbiAgICBjYXNlICdzdHJva2UnOlxuICAgIGNhc2UgJ3RleHQnOlxuICAgIGNhc2UgJ2RldGFpbCc6XG4gICAgY2FzZSAna2V5JzpcbiAgICBjYXNlICd0b29sdGlwJzpcbiAgICBjYXNlICdocmVmJzpcbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnbG9uZ2l0dWRlJzpcbiAgICBjYXNlICdsb25naXR1ZGUyJzpcbiAgICBjYXNlICdsYXRpdHVkZSc6XG4gICAgY2FzZSAnbGF0aXR1ZGUyJzpcbiAgICAgIGlmIChmaWVsZERlZi50eXBlICE9PSBRVUFOVElUQVRJVkUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBgQ2hhbm5lbCAke2NoYW5uZWx9IHNob3VsZCBub3QgYmUgdXNlZCB3aXRoICR7ZmllbGREZWYudHlwZX0gZmllbGQuYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICdvcGFjaXR5JzpcbiAgICBjYXNlICdzaXplJzpcbiAgICBjYXNlICd4Mic6XG4gICAgY2FzZSAneTInOlxuICAgICAgaWYgKGlzRGlzY3JldGUoZmllbGREZWYpICYmICFmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBgQ2hhbm5lbCAke2NoYW5uZWx9IHNob3VsZCBub3QgYmUgdXNlZCB3aXRoIGRpc2NyZXRlIGZpZWxkLmBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnc2hhcGUnOlxuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgIT09ICdub21pbmFsJyAmJiBmaWVsZERlZi50eXBlICE9PSAnZ2VvanNvbicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiAnU2hhcGUgY2hhbm5lbCBzaG91bGQgYmUgdXNlZCB3aXRoIG5vbWluYWwgZGF0YSBvciBnZW9qc29uIG9ubHknXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ29yZGVyJzpcbiAgICAgIGlmIChmaWVsZERlZi50eXBlID09PSAnbm9taW5hbCcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBgQ2hhbm5lbCBvcmRlciBpcyBpbmFwcHJvcHJpYXRlIGZvciBub21pbmFsIGZpZWxkLCB3aGljaCBoYXMgbm8gaW5oZXJlbnQgb3JkZXIuYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdjaGFubmVsQ29tcGF0YWJpbGl0eSBub3QgaW1wbGVtZW50ZWQgZm9yIGNoYW5uZWwgJyArIGNoYW5uZWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXJGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8YW55Pikge1xuICByZXR1cm4gZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScgfHwgISFmaWVsZERlZi5iaW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RpbWVGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8YW55Pikge1xuICByZXR1cm4gZmllbGREZWYudHlwZSA9PT0gJ3RlbXBvcmFsJyB8fCAhIWZpZWxkRGVmLnRpbWVVbml0O1xufVxuIl19