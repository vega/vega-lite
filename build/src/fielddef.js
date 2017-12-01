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
// Declaration and utility for variants of a field definition object
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var channel_1 = require("./channel");
var log = require("./log");
var timeunit_1 = require("./timeunit");
var type_1 = require("./type");
var util_1 = require("./util");
function isRepeatRef(field) {
    return field && !util_1.isString(field) && 'repeat' in field;
}
exports.isRepeatRef = isRepeatRef;
function isConditionalDef(channelDef) {
    return !!channelDef && !!channelDef.condition;
}
exports.isConditionalDef = isConditionalDef;
/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
function hasConditionalFieldDef(channelDef) {
    return !!channelDef && !!channelDef.condition && !util_1.isArray(channelDef.condition) && isFieldDef(channelDef.condition);
}
exports.hasConditionalFieldDef = hasConditionalFieldDef;
function hasConditionalValueDef(channelDef) {
    return !!channelDef && !!channelDef.condition && (util_1.isArray(channelDef.condition) || isValueDef(channelDef.condition));
}
exports.hasConditionalValueDef = hasConditionalValueDef;
function isFieldDef(channelDef) {
    return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}
exports.isFieldDef = isFieldDef;
function isStringFieldDef(fieldDef) {
    return isFieldDef(fieldDef) && util_1.isString(fieldDef.field);
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
function field(fieldDef, opt) {
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
exports.field = field;
function isDiscrete(fieldDef) {
    switch (fieldDef.type) {
        case 'nominal':
        case 'ordinal':
            return true;
        case 'quantitative':
            return !!fieldDef.bin;
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
    if (util_1.isString(channelDef) || util_1.isNumber(channelDef) || util_1.isBoolean(channelDef)) {
        var primitiveType = util_1.isString(channelDef) ? 'string' :
            util_1.isNumber(channelDef) ? 'number' : 'boolean';
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
    if (util_1.isBoolean(bin)) {
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
        case 'text':
        case 'detail':
        case 'tooltip':
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
            if (fieldDef.type !== 'nominal') {
                return {
                    compatible: false,
                    warning: 'Shape channel should be used with nominal data only'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRkZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9FQUFvRTtBQUNwRSx5Q0FBOEU7QUFFOUUsNkJBQTBEO0FBQzFELHFDQUE2QztBQUk3QywyQkFBNkI7QUFLN0IsdUNBQXlFO0FBQ3pFLCtCQUF5QztBQUN6QywrQkFBcUY7QUF5RXJGLHFCQUE0QixLQUFZO0lBQ3RDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxlQUFRLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxJQUFJLEtBQUssQ0FBQztBQUN4RCxDQUFDO0FBRkQsa0NBRUM7QUFrSkQsMEJBQW9DLFVBQXlCO0lBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQ2hELENBQUM7QUFGRCw0Q0FFQztBQUVEOztHQUVHO0FBQ0gsZ0NBQTBDLFVBQXlCO0lBQ2pFLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxJQUFJLENBQUMsY0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RILENBQUM7QUFGRCx3REFFQztBQUVELGdDQUEwQyxVQUF5QjtJQUNqRSxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsSUFBSSxDQUMvQyxjQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQ2xFLENBQUM7QUFDSixDQUFDO0FBSkQsd0RBSUM7QUFFRCxvQkFBOEIsVUFBeUI7SUFDckQsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLENB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QixPQUFPLEVBQUUsYUFBVyxPQUFPLDZDQUEwQztpQkFDdEUsQ0FBQztZQUNKLENBQUM7WUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO1FBRXBCLEtBQUssT0FBTztZQUNWLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDO29CQUNMLFVBQVUsRUFBRSxLQUFLO29CQUNqQixPQUFPLEVBQUUscURBQXFEO2lCQUMvRCxDQUFDO1lBQ0osQ0FBQztZQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFFcEIsS0FBSyxPQUFPO1lBQ1YsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxNQUFNLENBQUM7b0JBQ0wsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLE9BQU8sRUFBRSxnRkFBZ0Y7aUJBQzFGLENBQUM7WUFDSixDQUFDO1lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNqRixDQUFDO0FBckRELG9EQXFEQztBQUVELDBCQUFpQyxRQUF1QjtJQUN0RCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxjQUFjLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFDNUQsQ0FBQztBQUZELDRDQUVDO0FBRUQsd0JBQStCLFFBQXVCO0lBQ3BELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUM3RCxDQUFDO0FBRkQsd0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEZWNsYXJhdGlvbiBhbmQgdXRpbGl0eSBmb3IgdmFyaWFudHMgb2YgYSBmaWVsZCBkZWZpbml0aW9uIG9iamVjdFxuaW1wb3J0IHtBZ2dyZWdhdGVPcCwgaXNBZ2dyZWdhdGVPcCwgaXNDb3VudGluZ0FnZ3JlZ2F0ZU9wfSBmcm9tICcuL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0F4aXN9IGZyb20gJy4vYXhpcyc7XG5pbXBvcnQge2F1dG9NYXhCaW5zLCBCaW5QYXJhbXMsIGJpblRvU3RyaW5nfSBmcm9tICcuL2Jpbic7XG5pbXBvcnQge0NoYW5uZWwsIHJhbmdlVHlwZX0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7Q29tcG9zaXRlQWdncmVnYXRlfSBmcm9tICcuL2NvbXBvc2l0ZW1hcmsnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2cnO1xuaW1wb3J0IHtMb2dpY2FsT3BlcmFuZH0gZnJvbSAnLi9sb2dpY2FsJztcbmltcG9ydCB7U2NhbGV9IGZyb20gJy4vc2NhbGUnO1xuaW1wb3J0IHtTb3J0RmllbGQsIFNvcnRPcmRlcn0gZnJvbSAnLi9zb3J0JztcbmltcG9ydCB7U3RhY2tPZmZzZXR9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHtnZXRUaW1lVW5pdFBhcnRzLCBub3JtYWxpemVUaW1lVW5pdCwgVGltZVVuaXR9IGZyb20gJy4vdGltZXVuaXQnO1xuaW1wb3J0IHtnZXRGdWxsTmFtZSwgVHlwZX0gZnJvbSAnLi90eXBlJztcbmltcG9ydCB7YWNjZXNzUGF0aCwgaXNBcnJheSwgaXNCb29sZWFuLCBpc051bWJlciwgaXNTdHJpbmcsIHRpdGxlY2FzZX0gZnJvbSAnLi91dGlsJztcblxuXG4vKipcbiAqIERlZmluaXRpb24gb2JqZWN0IGZvciBhIGNvbnN0YW50IHZhbHVlIG9mIGFuIGVuY29kaW5nIGNoYW5uZWwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVEZWYge1xuICAvKipcbiAgICogQSBjb25zdGFudCB2YWx1ZSBpbiB2aXN1YWwgZG9tYWluIChlLmcuLCBgXCJyZWRcImAgLyBcIiMwMDk5ZmZcIiBmb3IgY29sb3IsIHZhbHVlcyBiZXR3ZWVuIGAwYCB0byBgMWAgZm9yIG9wYWNpdHkpLlxuICAgKi9cbiAgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW47XG59XG5cbi8qKlxuICogR2VuZXJpYyB0eXBlIGZvciBjb25kaXRpb25hbCBjaGFubmVsRGVmLlxuICogRiBkZWZpbmVzIHRoZSB1bmRlcmx5aW5nIEZpZWxkRGVmIHR5cGUuXG4gKi9cbmV4cG9ydCB0eXBlIENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiA9IEZpZWxkRGVmV2l0aENvbmRpdGlvbjxGPiB8IFZhbHVlRGVmV2l0aENvbmRpdGlvbjxGPjtcblxuXG5leHBvcnQgdHlwZSBDb25kaXRpb25hbDxUPiA9IHtcbiAgLyoqXG4gICAqIEEgW3NlbGVjdGlvbiBuYW1lXShzZWxlY3Rpb24uaHRtbCksIG9yIGEgc2VyaWVzIG9mIFtjb21wb3NlZCBzZWxlY3Rpb25zXShzZWxlY3Rpb24uaHRtbCNjb21wb3NlKS5cbiAgICovXG4gIHNlbGVjdGlvbjogTG9naWNhbE9wZXJhbmQ8c3RyaW5nPjtcbn0gJiBUO1xuXG4vKipcbiAqIEEgRmllbGREZWYgd2l0aCBDb25kaXRpb248VmFsdWVEZWY+XG4gKiB7XG4gKiAgIGNvbmRpdGlvbjoge3ZhbHVlOiAuLi59LFxuICogICBmaWVsZDogLi4uLFxuICogICAuLi5cbiAqIH1cbiAqL1xuZXhwb3J0IHR5cGUgRmllbGREZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiA9IEYgJiB7XG4gIC8qKlxuICAgKiBPbmUgb3IgbW9yZSB2YWx1ZSBkZWZpbml0aW9uKHMpIHdpdGggYSBzZWxlY3Rpb24gcHJlZGljYXRlLlxuICAgKlxuICAgKiBfX05vdGU6X18gQSBmaWVsZCBkZWZpbml0aW9uJ3MgYGNvbmRpdGlvbmAgcHJvcGVydHkgY2FuIG9ubHkgY29udGFpbiBbdmFsdWUgZGVmaW5pdGlvbnNdKGVuY29kaW5nLmh0bWwjdmFsdWUtZGVmKVxuICAgKiBzaW5jZSBWZWdhLUxpdGUgb25seSBhbGxvd3MgYXQgbW9zdHkgIG9uZSBlbmNvZGVkIGZpZWxkIHBlciBlbmNvZGluZyBjaGFubmVsLlxuICAgKi9cbiAgY29uZGl0aW9uPzogQ29uZGl0aW9uYWw8VmFsdWVEZWY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+W107XG59O1xuXG4vKipcbiAqIEEgVmFsdWVEZWYgd2l0aCBDb25kaXRpb248VmFsdWVEZWYgfCBGaWVsZERlZj5cbiAqIHtcbiAqICAgY29uZGl0aW9uOiB7ZmllbGQ6IC4uLn0gfCB7dmFsdWU6IC4uLn0sXG4gKiAgIHZhbHVlOiAuLi4sXG4gKiB9XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVEZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiB7XG4gIC8qKlxuICAgKiBBIGZpZWxkIGRlZmluaXRpb24gb3Igb25lIG9yIG1vcmUgdmFsdWUgZGVmaW5pdGlvbihzKSB3aXRoIGEgc2VsZWN0aW9uIHByZWRpY2F0ZS5cbiAgICovXG4gIGNvbmRpdGlvbj86IENvbmRpdGlvbmFsPEY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+W107XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgdmFsdWUgaW4gdmlzdWFsIGRvbWFpbi5cbiAgICovXG4gIHZhbHVlPzogbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gYSByZXBlYXRlZCB2YWx1ZS5cbiAqL1xuZXhwb3J0IHR5cGUgUmVwZWF0UmVmID0ge1xuICByZXBlYXQ6ICdyb3cnIHwgJ2NvbHVtbidcbn07XG5cbmV4cG9ydCB0eXBlIEZpZWxkID0gc3RyaW5nIHwgUmVwZWF0UmVmO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXBlYXRSZWYoZmllbGQ6IEZpZWxkKTogZmllbGQgaXMgUmVwZWF0UmVmIHtcbiAgcmV0dXJuIGZpZWxkICYmICFpc1N0cmluZyhmaWVsZCkgJiYgJ3JlcGVhdCcgaW4gZmllbGQ7XG59XG5cbi8qKiBAaGlkZSAqL1xuZXhwb3J0IHR5cGUgSGlkZGVuQ29tcG9zaXRlQWdncmVnYXRlID0gQ29tcG9zaXRlQWdncmVnYXRlO1xuXG5leHBvcnQgdHlwZSBBZ2dyZWdhdGUgPSBBZ2dyZWdhdGVPcCB8IEhpZGRlbkNvbXBvc2l0ZUFnZ3JlZ2F0ZTtcblxuZXhwb3J0IGludGVyZmFjZSBGaWVsZERlZkJhc2U8Rj4ge1xuXG4gIC8qKlxuICAgKiBfX1JlcXVpcmVkLl9fIEEgc3RyaW5nIGRlZmluaW5nIHRoZSBuYW1lIG9mIHRoZSBmaWVsZCBmcm9tIHdoaWNoIHRvIHB1bGwgYSBkYXRhIHZhbHVlXG4gICAqIG9yIGFuIG9iamVjdCBkZWZpbmluZyBpdGVyYXRlZCB2YWx1ZXMgZnJvbSB0aGUgW2ByZXBlYXRgXShyZXBlYXQuaHRtbCkgb3BlcmF0b3IuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBEb3RzIChgLmApIGFuZCBicmFja2V0cyAoYFtgIGFuZCBgXWApIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyBuZXN0ZWQgb2JqZWN0cyAoZS5nLiwgYFwiZmllbGRcIjogXCJmb28uYmFyXCJgIGFuZCBgXCJmaWVsZFwiOiBcImZvb1snYmFyJ11cImApLlxuICAgKiBJZiBmaWVsZCBuYW1lcyBjb250YWluIGRvdHMgb3IgYnJhY2tldHMgYnV0IGFyZSBub3QgbmVzdGVkLCB5b3UgY2FuIHVzZSBgXFxcXGAgdG8gZXNjYXBlIGRvdHMgYW5kIGJyYWNrZXRzIChlLmcuLCBgXCJhXFxcXC5iXCJgIGFuZCBgXCJhXFxcXFswXFxcXF1cImApLlxuICAgKiBTZWUgbW9yZSBkZXRhaWxzIGFib3V0IGVzY2FwaW5nIGluIHRoZSBbZmllbGQgZG9jdW1lbnRhdGlvbl0oZmllbGQuaHRtbCkuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBgZmllbGRgIGlzIG5vdCByZXF1aXJlZCBpZiBgYWdncmVnYXRlYCBpcyBgY291bnRgLlxuICAgKi9cbiAgZmllbGQ/OiBGO1xuXG4gIC8vIGZ1bmN0aW9uXG5cbiAgLyoqXG4gICAqIFRpbWUgdW5pdCAoZS5nLiwgYHllYXJgLCBgeWVhcm1vbnRoYCwgYG1vbnRoYCwgYGhvdXJzYCkgZm9yIGEgdGVtcG9yYWwgZmllbGQuXG4gICAqIG9yIFthIHRlbXBvcmFsIGZpZWxkIHRoYXQgZ2V0cyBjYXN0ZWQgYXMgb3JkaW5hbF0odHlwZS5odG1sI2Nhc3QpLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYHVuZGVmaW5lZGAgKE5vbmUpXG4gICAqL1xuICB0aW1lVW5pdD86IFRpbWVVbml0O1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgZm9yIGJpbm5pbmcgYSBgcXVhbnRpdGF0aXZlYCBmaWVsZCwgb3IgW2FuIG9iamVjdCBkZWZpbmluZyBiaW5uaW5nIHBhcmFtZXRlcnNdKGJpbi5odG1sI3BhcmFtcykuXG4gICAqIElmIGB0cnVlYCwgZGVmYXVsdCBbYmlubmluZyBwYXJhbWV0ZXJzXShiaW4uaHRtbCkgd2lsbCBiZSBhcHBsaWVkLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYGZhbHNlYFxuICAgKi9cbiAgYmluPzogYm9vbGVhbiB8IEJpblBhcmFtcztcblxuICAvKipcbiAgICogQWdncmVnYXRpb24gZnVuY3Rpb24gZm9yIHRoZSBmaWVsZFxuICAgKiAoZS5nLiwgYG1lYW5gLCBgc3VtYCwgYG1lZGlhbmAsIGBtaW5gLCBgbWF4YCwgYGNvdW50YCkuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgdW5kZWZpbmVkYCAoTm9uZSlcbiAgICpcbiAgICovXG4gIGFnZ3JlZ2F0ZT86IEFnZ3JlZ2F0ZTtcbn1cblxuLyoqXG4gKiAgRGVmaW5pdGlvbiBvYmplY3QgZm9yIGEgZGF0YSBmaWVsZCwgaXRzIHR5cGUgYW5kIHRyYW5zZm9ybWF0aW9uIG9mIGFuIGVuY29kaW5nIGNoYW5uZWwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZkJhc2U8Rj4ge1xuICAvKipcbiAgICogVGhlIGVuY29kZWQgZmllbGQncyB0eXBlIG9mIG1lYXN1cmVtZW50IChgXCJxdWFudGl0YXRpdmVcImAsIGBcInRlbXBvcmFsXCJgLCBgXCJvcmRpbmFsXCJgLCBvciBgXCJub21pbmFsXCJgKS5cbiAgICovXG4gIC8vICogb3IgYW4gaW5pdGlhbCBjaGFyYWN0ZXIgb2YgdGhlIHR5cGUgbmFtZSAoYFwiUVwiYCwgYFwiVFwiYCwgYFwiT1wiYCwgYFwiTlwiYCkuXG4gIC8vICogVGhpcyBwcm9wZXJ0eSBpcyBjYXNlLWluc2Vuc2l0aXZlLlxuICB0eXBlOiBUeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjYWxlRmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiB0aGUgY2hhbm5lbCdzIHNjYWxlLCB3aGljaCBpcyB0aGUgZnVuY3Rpb24gdGhhdCB0cmFuc2Zvcm1zIHZhbHVlcyBpbiB0aGUgZGF0YSBkb21haW4gKG51bWJlcnMsIGRhdGVzLCBzdHJpbmdzLCBldGMpIHRvIHZpc3VhbCB2YWx1ZXMgKHBpeGVscywgY29sb3JzLCBzaXplcykgb2YgdGhlIGVuY29kaW5nIGNoYW5uZWxzLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gSWYgdW5kZWZpbmVkLCBkZWZhdWx0IFtzY2FsZSBwcm9wZXJ0aWVzXShzY2FsZS5odG1sKSBhcmUgYXBwbGllZC5cbiAgICovXG4gIHNjYWxlPzogU2NhbGU7XG5cbiAgLyoqXG4gICAqIFNvcnQgb3JkZXIgZm9yIHRoZSBlbmNvZGVkIGZpZWxkLlxuICAgKiBTdXBwb3J0ZWQgYHNvcnRgIHZhbHVlcyBpbmNsdWRlIGBcImFzY2VuZGluZ1wiYCwgYFwiZGVzY2VuZGluZ1wiYCBhbmQgYG51bGxgIChubyBzb3J0aW5nKS5cbiAgICogRm9yIGZpZWxkcyB3aXRoIGRpc2NyZXRlIGRvbWFpbnMsIGBzb3J0YCBjYW4gYWxzbyBiZSBhIFtzb3J0IGZpZWxkIGRlZmluaXRpb24gb2JqZWN0XShzb3J0Lmh0bWwjc29ydC1maWVsZCkuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgXCJhc2NlbmRpbmdcImBcbiAgICpcbiAgICogQG51bGxhYmxlXG4gICAqL1xuICBzb3J0PzogU29ydE9yZGVyIHwgU29ydEZpZWxkPEY+IHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbkZpZWxkRGVmPEY+IGV4dGVuZHMgU2NhbGVGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiBheGlzJ3MgZ3JpZGxpbmVzLCB0aWNrcyBhbmQgbGFiZWxzLlxuICAgKiBJZiBgbnVsbGAsIHRoZSBheGlzIGZvciB0aGUgZW5jb2RpbmcgY2hhbm5lbCB3aWxsIGJlIHJlbW92ZWQuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBJZiB1bmRlZmluZWQsIGRlZmF1bHQgW2F4aXMgcHJvcGVydGllc10oYXhpcy5odG1sKSBhcmUgYXBwbGllZC5cbiAgICpcbiAgICogQG51bGxhYmxlXG4gICAqL1xuICBheGlzPzogQXhpcyB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2Ygc3RhY2tpbmcgb2Zmc2V0IGlmIHRoZSBmaWVsZCBzaG91bGQgYmUgc3RhY2tlZC5cbiAgICogYHN0YWNrYCBpcyBvbmx5IGFwcGxpY2FibGUgZm9yIGB4YCBhbmQgYHlgIGNoYW5uZWxzIHdpdGggY29udGludW91cyBkb21haW5zLlxuICAgKiBGb3IgZXhhbXBsZSwgYHN0YWNrYCBvZiBgeWAgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIHN0YWNraW5nIGZvciBhIHZlcnRpY2FsIGJhciBjaGFydC5cbiAgICpcbiAgICogYHN0YWNrYCBjYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICAgKiAtIGBcInplcm9cImA6IHN0YWNraW5nIHdpdGggYmFzZWxpbmUgb2Zmc2V0IGF0IHplcm8gdmFsdWUgb2YgdGhlIHNjYWxlIChmb3IgY3JlYXRpbmcgdHlwaWNhbCBzdGFja2VkIFtiYXJdKHN0YWNrLmh0bWwjYmFyKSBhbmQgW2FyZWFdKHN0YWNrLmh0bWwjYXJlYSkgY2hhcnQpLlxuICAgKiAtIGBcIm5vcm1hbGl6ZVwiYCAtIHN0YWNraW5nIHdpdGggbm9ybWFsaXplZCBkb21haW4gKGZvciBjcmVhdGluZyBbbm9ybWFsaXplZCBzdGFja2VkIGJhciBhbmQgYXJlYSBjaGFydHNdKHN0YWNrLmh0bWwjbm9ybWFsaXplZCkuIDxici8+XG4gICAqIC1gXCJjZW50ZXJcImAgLSBzdGFja2luZyB3aXRoIGNlbnRlciBiYXNlbGluZSAoZm9yIFtzdHJlYW1ncmFwaF0oc3RhY2suaHRtbCNzdHJlYW1ncmFwaCkpLlxuICAgKiAtIGBudWxsYCAtIE5vLXN0YWNraW5nLiBUaGlzIHdpbGwgcHJvZHVjZSBsYXllcmVkIFtiYXJdKHN0YWNrLmh0bWwjbGF5ZXJlZC1iYXItY2hhcnQpIGFuZCBhcmVhIGNoYXJ0LlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYHplcm9gIGZvciBwbG90cyB3aXRoIGFsbCBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIHRydWU6XG4gICAqICgxKSB0aGUgbWFyayBpcyBgYmFyYCBvciBgYXJlYWA7XG4gICAqICgyKSB0aGUgc3RhY2tlZCBtZWFzdXJlIGNoYW5uZWwgKHggb3IgeSkgaGFzIGEgbGluZWFyIHNjYWxlO1xuICAgKiAoMykgQXQgbGVhc3Qgb25lIG9mIG5vbi1wb3NpdGlvbiBjaGFubmVscyBtYXBwZWQgdG8gYW4gdW5hZ2dyZWdhdGVkIGZpZWxkIHRoYXQgaXMgZGlmZmVyZW50IGZyb20geCBhbmQgeS4gIE90aGVyd2lzZSwgYG51bGxgIGJ5IGRlZmF1bHQuXG4gICAqL1xuICBzdGFjaz86IFN0YWNrT2Zmc2V0IHwgbnVsbDtcbn1cblxuLyoqXG4gKiBGaWVsZCBkZWZpbml0aW9uIG9mIGEgbWFyayBwcm9wZXJ0eSwgd2hpY2ggY2FuIGNvbnRhaW4gYSBsZWdlbmQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWFya1Byb3BGaWVsZERlZjxGPiBleHRlbmRzIFNjYWxlRmllbGREZWY8Rj4ge1xuICAgLyoqXG4gICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiB0aGUgbGVnZW5kLlxuICAgICogSWYgYG51bGxgLCB0aGUgbGVnZW5kIGZvciB0aGUgZW5jb2RpbmcgY2hhbm5lbCB3aWxsIGJlIHJlbW92ZWQuXG4gICAgKlxuICAgICogX19EZWZhdWx0IHZhbHVlOl9fIElmIHVuZGVmaW5lZCwgZGVmYXVsdCBbbGVnZW5kIHByb3BlcnRpZXNdKGxlZ2VuZC5odG1sKSBhcmUgYXBwbGllZC5cbiAgICAqXG4gICAgKiBAbnVsbGFibGVcbiAgICAqL1xuICBsZWdlbmQ/OiBMZWdlbmQgfCBudWxsO1xufVxuXG4vLyBEZXRhaWxcblxuLy8gT3JkZXIgUGF0aCBoYXZlIG5vIHNjYWxlXG5cbmV4cG9ydCBpbnRlcmZhY2UgT3JkZXJGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIFRoZSBzb3J0IG9yZGVyLiBPbmUgb2YgYFwiYXNjZW5kaW5nXCJgIChkZWZhdWx0KSBvciBgXCJkZXNjZW5kaW5nXCJgLlxuICAgKi9cbiAgc29ydD86IFNvcnRPcmRlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZXh0RmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBUaGUgW2Zvcm1hdHRpbmcgcGF0dGVybl0oZm9ybWF0Lmh0bWwpIGZvciBhIHRleHQgZmllbGQuIElmIG5vdCBkZWZpbmVkLCB0aGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgZm9ybWF0Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBDaGFubmVsRGVmPEY+ID0gQ2hhbm5lbERlZldpdGhDb25kaXRpb248RmllbGREZWY8Rj4+O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNDb25kaXRpb25hbERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyBDaGFubmVsRGVmV2l0aENvbmRpdGlvbjxGaWVsZERlZjxGPj4ge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICEhY2hhbm5lbERlZi5jb25kaXRpb247XG59XG5cbi8qKlxuICogUmV0dXJuIGlmIGEgY2hhbm5lbERlZiBpcyBhIENvbmRpdGlvbmFsVmFsdWVEZWYgd2l0aCBDb25kaXRpb25GaWVsZERlZlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzQ29uZGl0aW9uYWxGaWVsZERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyAoVmFsdWVEZWYgJiB7Y29uZGl0aW9uOiBDb25kaXRpb25hbDxGaWVsZERlZjxGPj59KSB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgISFjaGFubmVsRGVmLmNvbmRpdGlvbiAmJiAhaXNBcnJheShjaGFubmVsRGVmLmNvbmRpdGlvbikgJiYgaXNGaWVsZERlZihjaGFubmVsRGVmLmNvbmRpdGlvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDb25kaXRpb25hbFZhbHVlRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIChWYWx1ZURlZiAmIHtjb25kaXRpb246IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdfSkge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICEhY2hhbm5lbERlZi5jb25kaXRpb24gJiYgKFxuICAgIGlzQXJyYXkoY2hhbm5lbERlZi5jb25kaXRpb24pIHx8IGlzVmFsdWVEZWYoY2hhbm5lbERlZi5jb25kaXRpb24pXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZpZWxkRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIEZpZWxkRGVmPEY+IHwgUG9zaXRpb25GaWVsZERlZjxGPiB8IE1hcmtQcm9wRmllbGREZWY8Rj4gfCBPcmRlckZpZWxkRGVmPEY+IHwgVGV4dEZpZWxkRGVmPEY+IHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAoISFjaGFubmVsRGVmWydmaWVsZCddIHx8IGNoYW5uZWxEZWZbJ2FnZ3JlZ2F0ZSddID09PSAnY291bnQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nRmllbGREZWYoZmllbGREZWY6IENoYW5uZWxEZWY8c3RyaW5nfFJlcGVhdFJlZj4pOiBmaWVsZERlZiBpcyBGaWVsZERlZjxzdHJpbmc+IHtcbiAgcmV0dXJuIGlzRmllbGREZWYoZmllbGREZWYpICYmIGlzU3RyaW5nKGZpZWxkRGVmLmZpZWxkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsdWVEZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgVmFsdWVEZWYge1xuICByZXR1cm4gY2hhbm5lbERlZiAmJiAndmFsdWUnIGluIGNoYW5uZWxEZWYgJiYgY2hhbm5lbERlZlsndmFsdWUnXSAhPT0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTY2FsZUZpZWxkRGVmKGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8YW55Pik6IGNoYW5uZWxEZWYgaXMgU2NhbGVGaWVsZERlZjxhbnk+IHtcbiAgICByZXR1cm4gISFjaGFubmVsRGVmICYmICghIWNoYW5uZWxEZWZbJ3NjYWxlJ10gfHwgISFjaGFubmVsRGVmWydzb3J0J10pO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZpZWxkUmVmT3B0aW9uIHtcbiAgLyoqIGV4Y2x1ZGUgYmluLCBhZ2dyZWdhdGUsIHRpbWVVbml0ICovXG4gIG5vZm4/OiBib29sZWFuO1xuICAvKiogV3JhcCB0aGUgZmllbGQgd2l0aCBkYXR1bSBvciBwYXJlbnQgKGUuZy4sIGRhdHVtWycuLi4nXSBmb3IgVmVnYSBFeHByZXNzaW9uICovXG4gIGV4cHI/OiAnZGF0dW0nIHwgJ3BhcmVudCc7XG4gIC8qKiBwcmVwZW5kIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeCAqL1xuICBwcmVmaXg/OiBzdHJpbmc7XG4gIC8qKiBhcHBlbmQgc3VmZml4IHRvIHRoZSBmaWVsZCByZWYgZm9yIGJpbiAoZGVmYXVsdD0nc3RhcnQnKSAqL1xuICBiaW5TdWZmaXg/OiAnZW5kJyB8ICdyYW5nZScgfCAnbWlkJztcbiAgLyoqIGFwcGVuZCBzdWZmaXggdG8gdGhlIGZpZWxkIHJlZiAoZ2VuZXJhbCkgKi9cbiAgc3VmZml4Pzogc3RyaW5nO1xuICAvKiogT3ZlcnJyaWRlIHdoaWNoIGFnZ3JlZ2F0ZSB0byB1c2UuIE5lZWRlZCBmb3IgdW5hZ2dyZWdhdGVkIGRvbWFpbi4gKi9cbiAgYWdncmVnYXRlPzogQWdncmVnYXRlT3A7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWVsZChmaWVsZERlZjogRmllbGREZWZCYXNlPHN0cmluZz4sIG9wdDogRmllbGRSZWZPcHRpb24gPSB7fSk6IHN0cmluZyB7XG4gIGxldCBmaWVsZCA9IGZpZWxkRGVmLmZpZWxkO1xuICBjb25zdCBwcmVmaXggPSBvcHQucHJlZml4O1xuICBsZXQgc3VmZml4ID0gb3B0LnN1ZmZpeDtcblxuICBpZiAoaXNDb3VudChmaWVsZERlZikpIHtcbiAgICBmaWVsZCA9ICdjb3VudF8qJztcbiAgfSBlbHNlIHtcbiAgICBsZXQgZm46IHN0cmluZyA9IHVuZGVmaW5lZDtcblxuICAgIGlmICghb3B0Lm5vZm4pIHtcbiAgICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgZm4gPSBiaW5Ub1N0cmluZyhmaWVsZERlZi5iaW4pO1xuICAgICAgICBzdWZmaXggPSBvcHQuYmluU3VmZml4IHx8ICcnO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgZm4gPSBTdHJpbmcob3B0LmFnZ3JlZ2F0ZSB8fCBmaWVsZERlZi5hZ2dyZWdhdGUpO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICBmbiA9IFN0cmluZyhmaWVsZERlZi50aW1lVW5pdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZuKSB7XG4gICAgICBmaWVsZCA9IGAke2ZufV8ke2ZpZWxkfWA7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN1ZmZpeCkge1xuICAgIGZpZWxkID0gYCR7ZmllbGR9XyR7c3VmZml4fWA7XG4gIH1cblxuICBpZiAocHJlZml4KSB7XG4gICAgZmllbGQgPSBgJHtwcmVmaXh9XyR7ZmllbGR9YDtcbiAgfVxuXG4gIGlmIChvcHQuZXhwcikge1xuICAgIGZpZWxkID0gYCR7b3B0LmV4cHJ9JHthY2Nlc3NQYXRoKGZpZWxkKX1gO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEaXNjcmV0ZShmaWVsZERlZjogRmllbGREZWY8RmllbGQ+KSB7XG4gIHN3aXRjaCAoZmllbGREZWYudHlwZSkge1xuICAgIGNhc2UgJ25vbWluYWwnOlxuICAgIGNhc2UgJ29yZGluYWwnOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSAncXVhbnRpdGF0aXZlJzpcbiAgICAgIHJldHVybiAhIWZpZWxkRGVmLmJpbjtcbiAgICBjYXNlICd0ZW1wb3JhbCc6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGxvZy5tZXNzYWdlLmludmFsaWRGaWVsZFR5cGUoZmllbGREZWYudHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb250aW51b3VzKGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4pIHtcbiAgcmV0dXJuICFpc0Rpc2NyZXRlKGZpZWxkRGVmKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ291bnQoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxGaWVsZD4pIHtcbiAgcmV0dXJuIGZpZWxkRGVmLmFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jztcbn1cblxuZXhwb3J0IHR5cGUgRmllbGRUaXRsZUZvcm1hdHRlciA9IChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpID0+IHN0cmluZztcblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmJhbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCB7ZmllbGQsIGJpbiwgdGltZVVuaXQsIGFnZ3JlZ2F0ZX0gPSBmaWVsZERlZjtcbiAgaWYgKGFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jykge1xuICAgIHJldHVybiBjb25maWcuY291bnRUaXRsZTtcbiAgfSBlbHNlIGlmIChiaW4pIHtcbiAgICByZXR1cm4gYCR7ZmllbGR9IChiaW5uZWQpYDtcbiAgfSBlbHNlIGlmICh0aW1lVW5pdCkge1xuICAgIGNvbnN0IHVuaXRzID0gZ2V0VGltZVVuaXRQYXJ0cyh0aW1lVW5pdCkuam9pbignLScpO1xuICAgIHJldHVybiBgJHtmaWVsZH0gKCR7dW5pdHN9KWA7XG4gIH0gZWxzZSBpZiAoYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIGAke3RpdGxlY2FzZShhZ2dyZWdhdGUpfSBvZiAke2ZpZWxkfWA7XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25hbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBmbiA9IGZpZWxkRGVmLmFnZ3JlZ2F0ZSB8fCBmaWVsZERlZi50aW1lVW5pdCB8fCAoZmllbGREZWYuYmluICYmICdiaW4nKTtcbiAgaWYgKGZuKSB7XG4gICAgcmV0dXJuIGZuLnRvVXBwZXJDYXNlKCkgKyAnKCcgKyBmaWVsZERlZi5maWVsZCArICcpJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmllbGREZWYuZmllbGQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRUaXRsZUZvcm1hdHRlcjogRmllbGRUaXRsZUZvcm1hdHRlciA9IChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpID0+IHtcbiAgc3dpdGNoIChjb25maWcuZmllbGRUaXRsZSkge1xuICAgIGNhc2UgJ3BsYWluJzpcbiAgICAgIHJldHVybiBmaWVsZERlZi5maWVsZDtcbiAgICBjYXNlICdmdW5jdGlvbmFsJzpcbiAgICAgIHJldHVybiBmdW5jdGlvbmFsVGl0bGVGb3JtYXR0ZXIoZmllbGREZWYsIGNvbmZpZyk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB2ZXJiYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZiwgY29uZmlnKTtcbiAgfVxufTtcblxubGV0IHRpdGxlRm9ybWF0dGVyID0gZGVmYXVsdFRpdGxlRm9ybWF0dGVyO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0VGl0bGVGb3JtYXR0ZXIoZm9ybWF0dGVyOiAoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSA9PiBzdHJpbmcpIHtcbiAgdGl0bGVGb3JtYXR0ZXIgPSBmb3JtYXR0ZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldFRpdGxlRm9ybWF0dGVyKCkge1xuICBzZXRUaXRsZUZvcm1hdHRlcihkZWZhdWx0VGl0bGVGb3JtYXR0ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIHJldHVybiB0aXRsZUZvcm1hdHRlcihmaWVsZERlZiwgY29uZmlnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRUeXBlKGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4sIGNoYW5uZWw6IENoYW5uZWwpOiBUeXBlIHtcbiAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgcmV0dXJuICd0ZW1wb3JhbCc7XG4gIH1cbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIHJldHVybiAncXVhbnRpdGF0aXZlJztcbiAgfVxuICBzd2l0Y2ggKHJhbmdlVHlwZShjaGFubmVsKSkge1xuICAgIGNhc2UgJ2NvbnRpbnVvdXMnOlxuICAgICAgcmV0dXJuICdxdWFudGl0YXRpdmUnO1xuICAgIGNhc2UgJ2Rpc2NyZXRlJzpcbiAgICAgIHJldHVybiAnbm9taW5hbCc7XG4gICAgY2FzZSAnZmxleGlibGUnOiAvLyBjb2xvclxuICAgICAgcmV0dXJuICdub21pbmFsJztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICdxdWFudGl0YXRpdmUnO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmllbGREZWYgLS0gZWl0aGVyIGZyb20gdGhlIG91dGVyIGNoYW5uZWxEZWYgb3IgZnJvbSB0aGUgY29uZGl0aW9uIG9mIGNoYW5uZWxEZWYuXG4gKiBAcGFyYW0gY2hhbm5lbERlZlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGREZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IEZpZWxkRGVmPEY+IHtcbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4gY2hhbm5lbERlZjtcbiAgfSBlbHNlIGlmIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ29udmVydCB0eXBlIHRvIGZ1bGwsIGxvd2VyY2FzZSB0eXBlLCBvciBhdWdtZW50IHRoZSBmaWVsZERlZiB3aXRoIGEgZGVmYXVsdCB0eXBlIGlmIG1pc3NpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUoY2hhbm5lbERlZjogQ2hhbm5lbERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKTogQ2hhbm5lbERlZjxhbnk+IHtcbiAgaWYgKGlzU3RyaW5nKGNoYW5uZWxEZWYpIHx8IGlzTnVtYmVyKGNoYW5uZWxEZWYpIHx8IGlzQm9vbGVhbihjaGFubmVsRGVmKSkge1xuICAgIGNvbnN0IHByaW1pdGl2ZVR5cGUgPSBpc1N0cmluZyhjaGFubmVsRGVmKSA/ICdzdHJpbmcnIDpcbiAgICAgIGlzTnVtYmVyKGNoYW5uZWxEZWYpID8gJ251bWJlcicgOiAnYm9vbGVhbic7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UucHJpbWl0aXZlQ2hhbm5lbERlZihjaGFubmVsLCBwcmltaXRpdmVUeXBlLCBjaGFubmVsRGVmKSk7XG4gICAgcmV0dXJuIHt2YWx1ZTogY2hhbm5lbERlZn07XG4gIH1cblxuICAvLyBJZiBhIGZpZWxkRGVmIGNvbnRhaW5zIGEgZmllbGQsIHdlIG5lZWQgdHlwZS5cbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplRmllbGREZWYoY2hhbm5lbERlZiwgY2hhbm5lbCk7XG4gIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5jaGFubmVsRGVmLFxuICAgICAgLy8gTmVlZCB0byBjYXN0IGFzIG5vcm1hbGl6ZUZpZWxkRGVmIG5vcm1hbGx5IHJldHVybiBGaWVsZERlZiwgYnV0IGhlcmUgd2Uga25vdyB0aGF0IGl0IGlzIGRlZmluaXRlbHkgQ29uZGl0aW9uPEZpZWxkRGVmPlxuICAgICAgY29uZGl0aW9uOiBub3JtYWxpemVGaWVsZERlZihjaGFubmVsRGVmLmNvbmRpdGlvbiwgY2hhbm5lbCkgYXMgQ29uZGl0aW9uYWw8RmllbGREZWY8c3RyaW5nPj5cbiAgICB9O1xuICB9XG4gIHJldHVybiBjaGFubmVsRGVmO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIC8vIERyb3AgaW52YWxpZCBhZ2dyZWdhdGVcbiAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSAmJiAhaXNBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgY29uc3Qge2FnZ3JlZ2F0ZSwgLi4uZmllbGREZWZXaXRob3V0QWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmludmFsaWRBZ2dyZWdhdGUoZmllbGREZWYuYWdncmVnYXRlKSk7XG4gICAgZmllbGREZWYgPSBmaWVsZERlZldpdGhvdXRBZ2dyZWdhdGU7XG4gIH1cblxuICAvLyBOb3JtYWxpemUgVGltZSBVbml0XG4gIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgLi4uZmllbGREZWYsXG4gICAgICB0aW1lVW5pdDogbm9ybWFsaXplVGltZVVuaXQoZmllbGREZWYudGltZVVuaXQpXG4gICAgfTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBiaW5cbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgLi4uZmllbGREZWYsXG4gICAgICBiaW46IG5vcm1hbGl6ZUJpbihmaWVsZERlZi5iaW4sIGNoYW5uZWwpXG4gICAgfTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBUeXBlXG4gIGlmIChmaWVsZERlZi50eXBlKSB7XG4gICAgY29uc3QgZnVsbFR5cGUgPSBnZXRGdWxsTmFtZShmaWVsZERlZi50eXBlKTtcbiAgICBpZiAoZmllbGREZWYudHlwZSAhPT0gZnVsbFR5cGUpIHtcbiAgICAgIC8vIGNvbnZlcnQgc2hvcnQgdHlwZSB0byBmdWxsIHR5cGVcbiAgICAgIGZpZWxkRGVmID0ge1xuICAgICAgICAuLi5maWVsZERlZixcbiAgICAgICAgdHlwZTogZnVsbFR5cGVcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChmaWVsZERlZi50eXBlICE9PSAncXVhbnRpdGF0aXZlJykge1xuICAgICAgaWYgKGlzQ291bnRpbmdBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmludmFsaWRGaWVsZFR5cGVGb3JDb3VudEFnZ3JlZ2F0ZShmaWVsZERlZi50eXBlLCBmaWVsZERlZi5hZ2dyZWdhdGUpKTtcbiAgICAgICAgZmllbGREZWYgPSB7XG4gICAgICAgICAgLi4uZmllbGREZWYsXG4gICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSWYgdHlwZSBpcyBlbXB0eSAvIGludmFsaWQsIHRoZW4gYXVnbWVudCB3aXRoIGRlZmF1bHQgdHlwZVxuICAgIGNvbnN0IG5ld1R5cGUgPSBkZWZhdWx0VHlwZShmaWVsZERlZiwgY2hhbm5lbCk7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZW1wdHlPckludmFsaWRGaWVsZFR5cGUoZmllbGREZWYudHlwZSwgY2hhbm5lbCwgbmV3VHlwZSkpO1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgICAuLi5maWVsZERlZixcbiAgICAgIHR5cGU6IG5ld1R5cGVcbiAgICB9O1xuICB9XG5cbiAgY29uc3Qge2NvbXBhdGlibGUsIHdhcm5pbmd9ID0gY2hhbm5lbENvbXBhdGliaWxpdHkoZmllbGREZWYsIGNoYW5uZWwpO1xuICBpZiAoIWNvbXBhdGlibGUpIHtcbiAgICBsb2cud2Fybih3YXJuaW5nKTtcbiAgfVxuICByZXR1cm4gZmllbGREZWY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVCaW4oYmluOiBCaW5QYXJhbXN8Ym9vbGVhbiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBpZiAoaXNCb29sZWFuKGJpbikpIHtcbiAgICByZXR1cm4ge21heGJpbnM6IGF1dG9NYXhCaW5zKGNoYW5uZWwpfTtcbiAgfSBlbHNlIGlmICghYmluLm1heGJpbnMgJiYgIWJpbi5zdGVwKSB7XG4gICAgcmV0dXJuIHsuLi5iaW4sIG1heGJpbnM6IGF1dG9NYXhCaW5zKGNoYW5uZWwpfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmluO1xuICB9XG59XG5cbmNvbnN0IENPTVBBVElCTEUgPSB7Y29tcGF0aWJsZTogdHJ1ZX07XG5leHBvcnQgZnVuY3Rpb24gY2hhbm5lbENvbXBhdGliaWxpdHkoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPiwgY2hhbm5lbDogQ2hhbm5lbCk6IHtjb21wYXRpYmxlOiBib29sZWFuOyB3YXJuaW5nPzogc3RyaW5nO30ge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlICdyb3cnOlxuICAgIGNhc2UgJ2NvbHVtbic6XG4gICAgICBpZiAoaXNDb250aW51b3VzKGZpZWxkRGVmKSAmJiAhZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgLy8gVE9ETzooaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yMDExKTpcbiAgICAgICAgLy8gd2l0aCB0aW1lVW5pdCBpdCdzIG5vdCBhbHdheXMgc3RyaWN0bHkgY29udGludW91c1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6IGxvZy5tZXNzYWdlLmZhY2V0Q2hhbm5lbFNob3VsZEJlRGlzY3JldGUoY2hhbm5lbClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAneCc6XG4gICAgY2FzZSAneSc6XG4gICAgY2FzZSAnY29sb3InOlxuICAgIGNhc2UgJ3RleHQnOlxuICAgIGNhc2UgJ2RldGFpbCc6XG4gICAgY2FzZSAndG9vbHRpcCc6XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ29wYWNpdHknOlxuICAgIGNhc2UgJ3NpemUnOlxuICAgIGNhc2UgJ3gyJzpcbiAgICBjYXNlICd5Mic6XG4gICAgICBpZiAoaXNEaXNjcmV0ZShmaWVsZERlZikgJiYgIWZpZWxkRGVmLmJpbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6IGBDaGFubmVsICR7Y2hhbm5lbH0gc2hvdWxkIG5vdCBiZSB1c2VkIHdpdGggZGlzY3JldGUgZmllbGQuYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICdzaGFwZSc6XG4gICAgICBpZiAoZmllbGREZWYudHlwZSAhPT0gJ25vbWluYWwnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogJ1NoYXBlIGNoYW5uZWwgc2hvdWxkIGJlIHVzZWQgd2l0aCBub21pbmFsIGRhdGEgb25seSdcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnb3JkZXInOlxuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgPT09ICdub21pbmFsJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6IGBDaGFubmVsIG9yZGVyIGlzIGluYXBwcm9wcmlhdGUgZm9yIG5vbWluYWwgZmllbGQsIHdoaWNoIGhhcyBubyBpbmhlcmVudCBvcmRlci5gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ2NoYW5uZWxDb21wYXRhYmlsaXR5IG5vdCBpbXBsZW1lbnRlZCBmb3IgY2hhbm5lbCAnICsgY2hhbm5lbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bWJlckZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZjxhbnk+KSB7XG4gIHJldHVybiBmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJyB8fCAhIWZpZWxkRGVmLmJpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZjxhbnk+KSB7XG4gIHJldHVybiBmaWVsZERlZi50eXBlID09PSAndGVtcG9yYWwnIHx8ICEhZmllbGREZWYudGltZVVuaXQ7XG59XG4iXX0=