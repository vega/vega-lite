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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRkZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9FQUFvRTtBQUNwRSx5Q0FBOEU7QUFFOUUsNkJBQTBEO0FBQzFELHFDQUE2QztBQUk3QywyQkFBNkI7QUFLN0IsdUNBQXlFO0FBQ3pFLCtCQUF5QztBQUN6QywrQkFBcUY7QUF5RXJGLHFCQUE0QixLQUFZO0lBQ3RDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxlQUFRLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxJQUFJLEtBQUssQ0FBQztBQUN4RCxDQUFDO0FBRkQsa0NBRUM7QUE0SUQsMEJBQW9DLFVBQXlCO0lBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQ2hELENBQUM7QUFGRCw0Q0FFQztBQUVEOztHQUVHO0FBQ0gsZ0NBQTBDLFVBQXlCO0lBQ2pFLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxJQUFJLENBQUMsY0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RILENBQUM7QUFGRCx3REFFQztBQUVELGdDQUEwQyxVQUF5QjtJQUNqRSxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsSUFBSSxDQUMvQyxjQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQ2xFLENBQUM7QUFDSixDQUFDO0FBSkQsd0RBSUM7QUFFRCxvQkFBOEIsVUFBeUI7SUFDckQsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLENB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QixPQUFPLEVBQUUsYUFBVyxPQUFPLDZDQUEwQztpQkFDdEUsQ0FBQztZQUNKLENBQUM7WUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO1FBRXBCLEtBQUssT0FBTztZQUNWLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDO29CQUNMLFVBQVUsRUFBRSxLQUFLO29CQUNqQixPQUFPLEVBQUUscURBQXFEO2lCQUMvRCxDQUFDO1lBQ0osQ0FBQztZQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFFcEIsS0FBSyxPQUFPO1lBQ1YsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxNQUFNLENBQUM7b0JBQ0wsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLE9BQU8sRUFBRSxnRkFBZ0Y7aUJBQzFGLENBQUM7WUFDSixDQUFDO1lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNqRixDQUFDO0FBckRELG9EQXFEQztBQUVELDBCQUFpQyxRQUF1QjtJQUN0RCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxjQUFjLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFDNUQsQ0FBQztBQUZELDRDQUVDO0FBRUQsd0JBQStCLFFBQXVCO0lBQ3BELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUM3RCxDQUFDO0FBRkQsd0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEZWNsYXJhdGlvbiBhbmQgdXRpbGl0eSBmb3IgdmFyaWFudHMgb2YgYSBmaWVsZCBkZWZpbml0aW9uIG9iamVjdFxuaW1wb3J0IHtBZ2dyZWdhdGVPcCwgaXNBZ2dyZWdhdGVPcCwgaXNDb3VudGluZ0FnZ3JlZ2F0ZU9wfSBmcm9tICcuL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0F4aXN9IGZyb20gJy4vYXhpcyc7XG5pbXBvcnQge2F1dG9NYXhCaW5zLCBCaW5QYXJhbXMsIGJpblRvU3RyaW5nfSBmcm9tICcuL2Jpbic7XG5pbXBvcnQge0NoYW5uZWwsIHJhbmdlVHlwZX0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7Q29tcG9zaXRlQWdncmVnYXRlfSBmcm9tICcuL2NvbXBvc2l0ZW1hcmsnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2cnO1xuaW1wb3J0IHtMb2dpY2FsT3BlcmFuZH0gZnJvbSAnLi9sb2dpY2FsJztcbmltcG9ydCB7U2NhbGV9IGZyb20gJy4vc2NhbGUnO1xuaW1wb3J0IHtTb3J0RmllbGQsIFNvcnRPcmRlcn0gZnJvbSAnLi9zb3J0JztcbmltcG9ydCB7U3RhY2tPZmZzZXR9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHtnZXRUaW1lVW5pdFBhcnRzLCBub3JtYWxpemVUaW1lVW5pdCwgVGltZVVuaXR9IGZyb20gJy4vdGltZXVuaXQnO1xuaW1wb3J0IHtnZXRGdWxsTmFtZSwgVHlwZX0gZnJvbSAnLi90eXBlJztcbmltcG9ydCB7YWNjZXNzUGF0aCwgaXNBcnJheSwgaXNCb29sZWFuLCBpc051bWJlciwgaXNTdHJpbmcsIHRpdGxlY2FzZX0gZnJvbSAnLi91dGlsJztcblxuXG4vKipcbiAqIERlZmluaXRpb24gb2JqZWN0IGZvciBhIGNvbnN0YW50IHZhbHVlIG9mIGFuIGVuY29kaW5nIGNoYW5uZWwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVEZWYge1xuICAvKipcbiAgICogQSBjb25zdGFudCB2YWx1ZSBpbiB2aXN1YWwgZG9tYWluIChlLmcuLCBgXCJyZWRcImAgLyBcIiMwMDk5ZmZcIiBmb3IgY29sb3IsIHZhbHVlcyBiZXR3ZWVuIGAwYCB0byBgMWAgZm9yIG9wYWNpdHkpLlxuICAgKi9cbiAgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW47XG59XG5cbi8qKlxuICogR2VuZXJpYyB0eXBlIGZvciBjb25kaXRpb25hbCBjaGFubmVsRGVmLlxuICogRiBkZWZpbmVzIHRoZSB1bmRlcmx5aW5nIEZpZWxkRGVmIHR5cGUuXG4gKi9cbmV4cG9ydCB0eXBlIENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiA9IEZpZWxkRGVmV2l0aENvbmRpdGlvbjxGPiB8IFZhbHVlRGVmV2l0aENvbmRpdGlvbjxGPjtcblxuXG5leHBvcnQgdHlwZSBDb25kaXRpb25hbDxUPiA9IHtcbiAgLyoqXG4gICAqIEEgW3NlbGVjdGlvbiBuYW1lXShzZWxlY3Rpb24uaHRtbCksIG9yIGEgc2VyaWVzIG9mIFtjb21wb3NlZCBzZWxlY3Rpb25zXShzZWxlY3Rpb24uaHRtbCNjb21wb3NlKS5cbiAgICovXG4gIHNlbGVjdGlvbjogTG9naWNhbE9wZXJhbmQ8c3RyaW5nPjtcbn0gJiBUO1xuXG4vKipcbiAqIEEgRmllbGREZWYgd2l0aCBDb25kaXRpb248VmFsdWVEZWY+XG4gKiB7XG4gKiAgIGNvbmRpdGlvbjoge3ZhbHVlOiAuLi59LFxuICogICBmaWVsZDogLi4uLFxuICogICAuLi5cbiAqIH1cbiAqL1xuZXhwb3J0IHR5cGUgRmllbGREZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiA9IEYgJiB7XG4gIC8qKlxuICAgKiBPbmUgb3IgbW9yZSB2YWx1ZSBkZWZpbml0aW9uKHMpIHdpdGggYSBzZWxlY3Rpb24gcHJlZGljYXRlLlxuICAgKlxuICAgKiBfX05vdGU6X18gQSBmaWVsZCBkZWZpbml0aW9uJ3MgYGNvbmRpdGlvbmAgcHJvcGVydHkgY2FuIG9ubHkgY29udGFpbiBbdmFsdWUgZGVmaW5pdGlvbnNdKGVuY29kaW5nLmh0bWwjdmFsdWUtZGVmKVxuICAgKiBzaW5jZSBWZWdhLUxpdGUgb25seSBhbGxvd3MgYXQgbW9zdHkgIG9uZSBlbmNvZGVkIGZpZWxkIHBlciBlbmNvZGluZyBjaGFubmVsLlxuICAgKi9cbiAgY29uZGl0aW9uPzogQ29uZGl0aW9uYWw8VmFsdWVEZWY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+W107XG59O1xuXG4vKipcbiAqIEEgVmFsdWVEZWYgd2l0aCBDb25kaXRpb248VmFsdWVEZWYgfCBGaWVsZERlZj5cbiAqIHtcbiAqICAgY29uZGl0aW9uOiB7ZmllbGQ6IC4uLn0gfCB7dmFsdWU6IC4uLn0sXG4gKiAgIHZhbHVlOiAuLi4sXG4gKiB9XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVEZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiB7XG4gIC8qKlxuICAgKiBBIGZpZWxkIGRlZmluaXRpb24gb3Igb25lIG9yIG1vcmUgdmFsdWUgZGVmaW5pdGlvbihzKSB3aXRoIGEgc2VsZWN0aW9uIHByZWRpY2F0ZS5cbiAgICovXG4gIGNvbmRpdGlvbj86IENvbmRpdGlvbmFsPEY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+W107XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgdmFsdWUgaW4gdmlzdWFsIGRvbWFpbi5cbiAgICovXG4gIHZhbHVlPzogbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gYSByZXBlYXRlZCB2YWx1ZS5cbiAqL1xuZXhwb3J0IHR5cGUgUmVwZWF0UmVmID0ge1xuICByZXBlYXQ6ICdyb3cnIHwgJ2NvbHVtbidcbn07XG5cbmV4cG9ydCB0eXBlIEZpZWxkID0gc3RyaW5nIHwgUmVwZWF0UmVmO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXBlYXRSZWYoZmllbGQ6IEZpZWxkKTogZmllbGQgaXMgUmVwZWF0UmVmIHtcbiAgcmV0dXJuIGZpZWxkICYmICFpc1N0cmluZyhmaWVsZCkgJiYgJ3JlcGVhdCcgaW4gZmllbGQ7XG59XG5cbi8qKiBAaGlkZSAqL1xuZXhwb3J0IHR5cGUgSGlkZGVuQ29tcG9zaXRlQWdncmVnYXRlID0gQ29tcG9zaXRlQWdncmVnYXRlO1xuXG5leHBvcnQgdHlwZSBBZ2dyZWdhdGUgPSBBZ2dyZWdhdGVPcCB8IEhpZGRlbkNvbXBvc2l0ZUFnZ3JlZ2F0ZTtcblxuZXhwb3J0IGludGVyZmFjZSBGaWVsZERlZkJhc2U8Rj4ge1xuXG4gIC8qKlxuICAgKiBfX1JlcXVpcmVkLl9fIEEgc3RyaW5nIGRlZmluaW5nIHRoZSBuYW1lIG9mIHRoZSBmaWVsZCBmcm9tIHdoaWNoIHRvIHB1bGwgYSBkYXRhIHZhbHVlXG4gICAqIG9yIGFuIG9iamVjdCBkZWZpbmluZyBpdGVyYXRlZCB2YWx1ZXMgZnJvbSB0aGUgW2ByZXBlYXRgXShyZXBlYXQuaHRtbCkgb3BlcmF0b3IuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBEb3RzIChgLmApIGFuZCBicmFja2V0cyAoYFtgIGFuZCBgXWApIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyBuZXN0ZWQgb2JqZWN0cyAoZS5nLiwgYFwiZmllbGRcIjogXCJmb28uYmFyXCJgIGFuZCBgXCJmaWVsZFwiOiBcImZvb1snYmFyJ11cImApLlxuICAgKiBJZiBmaWVsZCBuYW1lcyBjb250YWluIGRvdHMgb3IgYnJhY2tldHMgYnV0IGFyZSBub3QgbmVzdGVkLCB5b3UgY2FuIHVzZSBgXFxcXGAgdG8gZXNjYXBlIGRvdHMgYW5kIGJyYWNrZXRzIChlLmcuLCBgXCJhXFxcXC5iXCJgIGFuZCBgXCJhXFxcXFswXFxcXF1cImApLlxuICAgKiBTZWUgbW9yZSBkZXRhaWxzIGFib3V0IGVzY2FwaW5nIGluIHRoZSBbZmllbGQgZG9jdW1lbnRhdGlvbl0oZmllbGQuaHRtbCkuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBgZmllbGRgIGlzIG5vdCByZXF1aXJlZCBpZiBgYWdncmVnYXRlYCBpcyBgY291bnRgLlxuICAgKi9cbiAgZmllbGQ/OiBGO1xuXG4gIC8vIGZ1bmN0aW9uXG5cbiAgLyoqXG4gICAqIFRpbWUgdW5pdCAoZS5nLiwgYHllYXJgLCBgeWVhcm1vbnRoYCwgYG1vbnRoYCwgYGhvdXJzYCkgZm9yIGEgdGVtcG9yYWwgZmllbGQuXG4gICAqIG9yIFthIHRlbXBvcmFsIGZpZWxkIHRoYXQgZ2V0cyBjYXN0ZWQgYXMgb3JkaW5hbF0odHlwZS5odG1sI2Nhc3QpLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYHVuZGVmaW5lZGAgKE5vbmUpXG4gICAqL1xuICB0aW1lVW5pdD86IFRpbWVVbml0O1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgZm9yIGJpbm5pbmcgYSBgcXVhbnRpdGF0aXZlYCBmaWVsZCwgb3IgW2FuIG9iamVjdCBkZWZpbmluZyBiaW5uaW5nIHBhcmFtZXRlcnNdKGJpbi5odG1sI3BhcmFtcykuXG4gICAqIElmIGB0cnVlYCwgZGVmYXVsdCBbYmlubmluZyBwYXJhbWV0ZXJzXShiaW4uaHRtbCkgd2lsbCBiZSBhcHBsaWVkLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYGZhbHNlYFxuICAgKi9cbiAgYmluPzogYm9vbGVhbiB8IEJpblBhcmFtcztcblxuICAvKipcbiAgICogQWdncmVnYXRpb24gZnVuY3Rpb24gZm9yIHRoZSBmaWVsZFxuICAgKiAoZS5nLiwgYG1lYW5gLCBgc3VtYCwgYG1lZGlhbmAsIGBtaW5gLCBgbWF4YCwgYGNvdW50YCkuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgdW5kZWZpbmVkYCAoTm9uZSlcbiAgICpcbiAgICovXG4gIGFnZ3JlZ2F0ZT86IEFnZ3JlZ2F0ZTtcbn1cblxuLyoqXG4gKiAgRGVmaW5pdGlvbiBvYmplY3QgZm9yIGEgZGF0YSBmaWVsZCwgaXRzIHR5cGUgYW5kIHRyYW5zZm9ybWF0aW9uIG9mIGFuIGVuY29kaW5nIGNoYW5uZWwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZkJhc2U8Rj4ge1xuICAvKipcbiAgICogVGhlIGVuY29kZWQgZmllbGQncyB0eXBlIG9mIG1lYXN1cmVtZW50IChgXCJxdWFudGl0YXRpdmVcImAsIGBcInRlbXBvcmFsXCJgLCBgXCJvcmRpbmFsXCJgLCBvciBgXCJub21pbmFsXCJgKS5cbiAgICovXG4gIC8vICogb3IgYW4gaW5pdGlhbCBjaGFyYWN0ZXIgb2YgdGhlIHR5cGUgbmFtZSAoYFwiUVwiYCwgYFwiVFwiYCwgYFwiT1wiYCwgYFwiTlwiYCkuXG4gIC8vICogVGhpcyBwcm9wZXJ0eSBpcyBjYXNlLWluc2Vuc2l0aXZlLlxuICB0eXBlOiBUeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjYWxlRmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiB0aGUgY2hhbm5lbCdzIHNjYWxlLCB3aGljaCBpcyB0aGUgZnVuY3Rpb24gdGhhdCB0cmFuc2Zvcm1zIHZhbHVlcyBpbiB0aGUgZGF0YSBkb21haW4gKG51bWJlcnMsIGRhdGVzLCBzdHJpbmdzLCBldGMpIHRvIHZpc3VhbCB2YWx1ZXMgKHBpeGVscywgY29sb3JzLCBzaXplcykgb2YgdGhlIGVuY29kaW5nIGNoYW5uZWxzLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gSWYgdW5kZWZpbmVkLCBkZWZhdWx0IFtzY2FsZSBwcm9wZXJ0aWVzXShzY2FsZS5odG1sKSBhcmUgYXBwbGllZC5cbiAgICovXG4gIHNjYWxlPzogU2NhbGU7XG5cbiAgLyoqXG4gICAqIFNvcnQgb3JkZXIgZm9yIHRoZSBlbmNvZGVkIGZpZWxkLlxuICAgKiBTdXBwb3J0ZWQgYHNvcnRgIHZhbHVlcyBpbmNsdWRlIGBcImFzY2VuZGluZ1wiYCwgYFwiZGVzY2VuZGluZ1wiYCBhbmQgYG51bGxgIChubyBzb3J0aW5nKS5cbiAgICogRm9yIGZpZWxkcyB3aXRoIGRpc2NyZXRlIGRvbWFpbnMsIGBzb3J0YCBjYW4gYWxzbyBiZSBhIFtzb3J0IGZpZWxkIGRlZmluaXRpb24gb2JqZWN0XShzb3J0Lmh0bWwjc29ydC1maWVsZCkuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgXCJhc2NlbmRpbmdcImBcbiAgICovXG4gIHNvcnQ/OiBTb3J0T3JkZXIgfCBTb3J0RmllbGQ8Rj4gfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uRmllbGREZWY8Rj4gZXh0ZW5kcyBTY2FsZUZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIGF4aXMncyBncmlkbGluZXMsIHRpY2tzIGFuZCBsYWJlbHMuXG4gICAqIElmIGBudWxsYCwgdGhlIGF4aXMgZm9yIHRoZSBlbmNvZGluZyBjaGFubmVsIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIElmIHVuZGVmaW5lZCwgZGVmYXVsdCBbYXhpcyBwcm9wZXJ0aWVzXShheGlzLmh0bWwpIGFyZSBhcHBsaWVkLlxuICAgKi9cbiAgYXhpcz86IEF4aXMgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHN0YWNraW5nIG9mZnNldCBpZiB0aGUgZmllbGQgc2hvdWxkIGJlIHN0YWNrZWQuXG4gICAqIGBzdGFja2AgaXMgb25seSBhcHBsaWNhYmxlIGZvciBgeGAgYW5kIGB5YCBjaGFubmVscyB3aXRoIGNvbnRpbnVvdXMgZG9tYWlucy5cbiAgICogRm9yIGV4YW1wbGUsIGBzdGFja2Agb2YgYHlgIGNhbiBiZSB1c2VkIHRvIGN1c3RvbWl6ZSBzdGFja2luZyBmb3IgYSB2ZXJ0aWNhbCBiYXIgY2hhcnQuXG4gICAqXG4gICAqIGBzdGFja2AgY2FuIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiAgICogLSBgXCJ6ZXJvXCJgOiBzdGFja2luZyB3aXRoIGJhc2VsaW5lIG9mZnNldCBhdCB6ZXJvIHZhbHVlIG9mIHRoZSBzY2FsZSAoZm9yIGNyZWF0aW5nIHR5cGljYWwgc3RhY2tlZCBbYmFyXShzdGFjay5odG1sI2JhcikgYW5kIFthcmVhXShzdGFjay5odG1sI2FyZWEpIGNoYXJ0KS5cbiAgICogLSBgXCJub3JtYWxpemVcImAgLSBzdGFja2luZyB3aXRoIG5vcm1hbGl6ZWQgZG9tYWluIChmb3IgY3JlYXRpbmcgW25vcm1hbGl6ZWQgc3RhY2tlZCBiYXIgYW5kIGFyZWEgY2hhcnRzXShzdGFjay5odG1sI25vcm1hbGl6ZWQpLiA8YnIvPlxuICAgKiAtYFwiY2VudGVyXCJgIC0gc3RhY2tpbmcgd2l0aCBjZW50ZXIgYmFzZWxpbmUgKGZvciBbc3RyZWFtZ3JhcGhdKHN0YWNrLmh0bWwjc3RyZWFtZ3JhcGgpKS5cbiAgICogLSBgbnVsbGAgLSBOby1zdGFja2luZy4gVGhpcyB3aWxsIHByb2R1Y2UgbGF5ZXJlZCBbYmFyXShzdGFjay5odG1sI2xheWVyZWQtYmFyLWNoYXJ0KSBhbmQgYXJlYSBjaGFydC5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB6ZXJvYCBmb3IgcGxvdHMgd2l0aCBhbGwgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSB0cnVlOlxuICAgKiAoMSkgdGhlIG1hcmsgaXMgYGJhcmAgb3IgYGFyZWFgO1xuICAgKiAoMikgdGhlIHN0YWNrZWQgbWVhc3VyZSBjaGFubmVsICh4IG9yIHkpIGhhcyBhIGxpbmVhciBzY2FsZTtcbiAgICogKDMpIEF0IGxlYXN0IG9uZSBvZiBub24tcG9zaXRpb24gY2hhbm5lbHMgbWFwcGVkIHRvIGFuIHVuYWdncmVnYXRlZCBmaWVsZCB0aGF0IGlzIGRpZmZlcmVudCBmcm9tIHggYW5kIHkuICBPdGhlcndpc2UsIGBudWxsYCBieSBkZWZhdWx0LlxuICAgKi9cbiAgc3RhY2s/OiBTdGFja09mZnNldCB8IG51bGw7XG59XG5cbi8qKlxuICogRmllbGQgZGVmaW5pdGlvbiBvZiBhIG1hcmsgcHJvcGVydHksIHdoaWNoIGNhbiBjb250YWluIGEgbGVnZW5kLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtQcm9wRmllbGREZWY8Rj4gZXh0ZW5kcyBTY2FsZUZpZWxkRGVmPEY+IHtcbiAgIC8qKlxuICAgICogQW4gb2JqZWN0IGRlZmluaW5nIHByb3BlcnRpZXMgb2YgdGhlIGxlZ2VuZC5cbiAgICAqIElmIGBudWxsYCwgdGhlIGxlZ2VuZCBmb3IgdGhlIGVuY29kaW5nIGNoYW5uZWwgd2lsbCBiZSByZW1vdmVkLlxuICAgICpcbiAgICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBJZiB1bmRlZmluZWQsIGRlZmF1bHQgW2xlZ2VuZCBwcm9wZXJ0aWVzXShsZWdlbmQuaHRtbCkgYXJlIGFwcGxpZWQuXG4gICAgKi9cbiAgbGVnZW5kPzogTGVnZW5kIHwgbnVsbDtcbn1cblxuLy8gRGV0YWlsXG5cbi8vIE9yZGVyIFBhdGggaGF2ZSBubyBzY2FsZVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyRmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBUaGUgc29ydCBvcmRlci4gT25lIG9mIGBcImFzY2VuZGluZ1wiYCAoZGVmYXVsdCkgb3IgYFwiZGVzY2VuZGluZ1wiYC5cbiAgICovXG4gIHNvcnQ/OiBTb3J0T3JkZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGV4dEZpZWxkRGVmPEY+IGV4dGVuZHMgRmllbGREZWY8Rj4ge1xuICAvKipcbiAgICogVGhlIFtmb3JtYXR0aW5nIHBhdHRlcm5dKGZvcm1hdC5odG1sKSBmb3IgYSB0ZXh0IGZpZWxkLiBJZiBub3QgZGVmaW5lZCwgdGhpcyB3aWxsIGJlIGRldGVybWluZWQgYXV0b21hdGljYWxseS5cbiAgICovXG4gIGZvcm1hdD86IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgQ2hhbm5lbERlZjxGPiA9IENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uPEZpZWxkRGVmPEY+PjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29uZGl0aW9uYWxEZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgQ2hhbm5lbERlZldpdGhDb25kaXRpb248RmllbGREZWY8Rj4+IHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAhIWNoYW5uZWxEZWYuY29uZGl0aW9uO1xufVxuXG4vKipcbiAqIFJldHVybiBpZiBhIGNoYW5uZWxEZWYgaXMgYSBDb25kaXRpb25hbFZhbHVlRGVmIHdpdGggQ29uZGl0aW9uRmllbGREZWZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0NvbmRpdGlvbmFsRmllbGREZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgKFZhbHVlRGVmICYge2NvbmRpdGlvbjogQ29uZGl0aW9uYWw8RmllbGREZWY8Rj4+fSkge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICEhY2hhbm5lbERlZi5jb25kaXRpb24gJiYgIWlzQXJyYXkoY2hhbm5lbERlZi5jb25kaXRpb24pICYmIGlzRmllbGREZWYoY2hhbm5lbERlZi5jb25kaXRpb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzQ29uZGl0aW9uYWxWYWx1ZURlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyAoVmFsdWVEZWYgJiB7Y29uZGl0aW9uOiBDb25kaXRpb25hbDxWYWx1ZURlZj4gfCBDb25kaXRpb25hbDxWYWx1ZURlZj5bXX0pIHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAhIWNoYW5uZWxEZWYuY29uZGl0aW9uICYmIChcbiAgICBpc0FycmF5KGNoYW5uZWxEZWYuY29uZGl0aW9uKSB8fCBpc1ZhbHVlRGVmKGNoYW5uZWxEZWYuY29uZGl0aW9uKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGaWVsZERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyBGaWVsZERlZjxGPiB8IFBvc2l0aW9uRmllbGREZWY8Rj4gfCBNYXJrUHJvcEZpZWxkRGVmPEY+IHwgT3JkZXJGaWVsZERlZjxGPiB8IFRleHRGaWVsZERlZjxGPiB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgKCEhY2hhbm5lbERlZlsnZmllbGQnXSB8fCBjaGFubmVsRGVmWydhZ2dyZWdhdGUnXSA9PT0gJ2NvdW50Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZ0ZpZWxkRGVmKGZpZWxkRGVmOiBDaGFubmVsRGVmPHN0cmluZ3xSZXBlYXRSZWY+KTogZmllbGREZWYgaXMgRmllbGREZWY8c3RyaW5nPiB7XG4gIHJldHVybiBpc0ZpZWxkRGVmKGZpZWxkRGVmKSAmJiBpc1N0cmluZyhmaWVsZERlZi5maWVsZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbHVlRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIFZhbHVlRGVmIHtcbiAgcmV0dXJuIGNoYW5uZWxEZWYgJiYgJ3ZhbHVlJyBpbiBjaGFubmVsRGVmICYmIGNoYW5uZWxEZWZbJ3ZhbHVlJ10gIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2NhbGVGaWVsZERlZihjaGFubmVsRGVmOiBDaGFubmVsRGVmPGFueT4pOiBjaGFubmVsRGVmIGlzIFNjYWxlRmllbGREZWY8YW55PiB7XG4gICAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAoISFjaGFubmVsRGVmWydzY2FsZSddIHx8ICEhY2hhbm5lbERlZlsnc29ydCddKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGaWVsZFJlZk9wdGlvbiB7XG4gIC8qKiBleGNsdWRlIGJpbiwgYWdncmVnYXRlLCB0aW1lVW5pdCAqL1xuICBub2ZuPzogYm9vbGVhbjtcbiAgLyoqIFdyYXAgdGhlIGZpZWxkIHdpdGggZGF0dW0gb3IgcGFyZW50IChlLmcuLCBkYXR1bVsnLi4uJ10gZm9yIFZlZ2EgRXhwcmVzc2lvbiAqL1xuICBleHByPzogJ2RhdHVtJyB8ICdwYXJlbnQnO1xuICAvKiogcHJlcGVuZCBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXggKi9cbiAgcHJlZml4Pzogc3RyaW5nO1xuICAvKiogYXBwZW5kIHN1ZmZpeCB0byB0aGUgZmllbGQgcmVmIGZvciBiaW4gKGRlZmF1bHQ9J3N0YXJ0JykgKi9cbiAgYmluU3VmZml4PzogJ2VuZCcgfCAncmFuZ2UnIHwgJ21pZCc7XG4gIC8qKiBhcHBlbmQgc3VmZml4IHRvIHRoZSBmaWVsZCByZWYgKGdlbmVyYWwpICovXG4gIHN1ZmZpeD86IHN0cmluZztcbiAgLyoqIE92ZXJycmlkZSB3aGljaCBhZ2dyZWdhdGUgdG8gdXNlLiBOZWVkZWQgZm9yIHVuYWdncmVnYXRlZCBkb21haW4uICovXG4gIGFnZ3JlZ2F0ZT86IEFnZ3JlZ2F0ZU9wO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmllbGQoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxzdHJpbmc+LCBvcHQ6IEZpZWxkUmVmT3B0aW9uID0ge30pOiBzdHJpbmcge1xuICBsZXQgZmllbGQgPSBmaWVsZERlZi5maWVsZDtcbiAgY29uc3QgcHJlZml4ID0gb3B0LnByZWZpeDtcbiAgbGV0IHN1ZmZpeCA9IG9wdC5zdWZmaXg7XG5cbiAgaWYgKGlzQ291bnQoZmllbGREZWYpKSB7XG4gICAgZmllbGQgPSAnY291bnRfKic7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGZuOiBzdHJpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIW9wdC5ub2ZuKSB7XG4gICAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICAgIGZuID0gYmluVG9TdHJpbmcoZmllbGREZWYuYmluKTtcbiAgICAgICAgc3VmZml4ID0gb3B0LmJpblN1ZmZpeCB8fCAnJztcbiAgICAgIH0gZWxzZSBpZiAoZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgIGZuID0gU3RyaW5nKG9wdC5hZ2dyZWdhdGUgfHwgZmllbGREZWYuYWdncmVnYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgZm4gPSBTdHJpbmcoZmllbGREZWYudGltZVVuaXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmbikge1xuICAgICAgZmllbGQgPSBgJHtmbn1fJHtmaWVsZH1gO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdWZmaXgpIHtcbiAgICBmaWVsZCA9IGAke2ZpZWxkfV8ke3N1ZmZpeH1gO1xuICB9XG5cbiAgaWYgKHByZWZpeCkge1xuICAgIGZpZWxkID0gYCR7cHJlZml4fV8ke2ZpZWxkfWA7XG4gIH1cblxuICBpZiAob3B0LmV4cHIpIHtcbiAgICBmaWVsZCA9IGAke29wdC5leHByfSR7YWNjZXNzUGF0aChmaWVsZCl9YDtcbiAgfVxuXG4gIHJldHVybiBmaWVsZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlzY3JldGUoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPikge1xuICBzd2l0Y2ggKGZpZWxkRGVmLnR5cGUpIHtcbiAgICBjYXNlICdub21pbmFsJzpcbiAgICBjYXNlICdvcmRpbmFsJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgJ3F1YW50aXRhdGl2ZSc6XG4gICAgICByZXR1cm4gISFmaWVsZERlZi5iaW47XG4gICAgY2FzZSAndGVtcG9yYWwnOlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5pbnZhbGlkRmllbGRUeXBlKGZpZWxkRGVmLnR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29udGludW91cyhmaWVsZERlZjogRmllbGREZWY8RmllbGQ+KSB7XG4gIHJldHVybiAhaXNEaXNjcmV0ZShmaWVsZERlZik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvdW50KGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8RmllbGQ+KSB7XG4gIHJldHVybiBmaWVsZERlZi5hZ2dyZWdhdGUgPT09ICdjb3VudCc7XG59XG5cbmV4cG9ydCB0eXBlIEZpZWxkVGl0bGVGb3JtYXR0ZXIgPSAoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSA9PiBzdHJpbmc7XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJiYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3Qge2ZpZWxkLCBiaW4sIHRpbWVVbml0LCBhZ2dyZWdhdGV9ID0gZmllbGREZWY7XG4gIGlmIChhZ2dyZWdhdGUgPT09ICdjb3VudCcpIHtcbiAgICByZXR1cm4gY29uZmlnLmNvdW50VGl0bGU7XG4gIH0gZWxzZSBpZiAoYmluKSB7XG4gICAgcmV0dXJuIGAke2ZpZWxkfSAoYmlubmVkKWA7XG4gIH0gZWxzZSBpZiAodGltZVVuaXQpIHtcbiAgICBjb25zdCB1bml0cyA9IGdldFRpbWVVbml0UGFydHModGltZVVuaXQpLmpvaW4oJy0nKTtcbiAgICByZXR1cm4gYCR7ZmllbGR9ICgke3VuaXRzfSlgO1xuICB9IGVsc2UgaWYgKGFnZ3JlZ2F0ZSkge1xuICAgIHJldHVybiBgJHt0aXRsZWNhc2UoYWdncmVnYXRlKX0gb2YgJHtmaWVsZH1gO1xuICB9XG4gIHJldHVybiBmaWVsZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZ1bmN0aW9uYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgZm4gPSBmaWVsZERlZi5hZ2dyZWdhdGUgfHwgZmllbGREZWYudGltZVVuaXQgfHwgKGZpZWxkRGVmLmJpbiAmJiAnYmluJyk7XG4gIGlmIChmbikge1xuICAgIHJldHVybiBmbi50b1VwcGVyQ2FzZSgpICsgJygnICsgZmllbGREZWYuZmllbGQgKyAnKSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZpZWxkRGVmLmZpZWxkO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0VGl0bGVGb3JtYXR0ZXI6IEZpZWxkVGl0bGVGb3JtYXR0ZXIgPSAoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSA9PiB7XG4gIHN3aXRjaCAoY29uZmlnLmZpZWxkVGl0bGUpIHtcbiAgICBjYXNlICdwbGFpbic6XG4gICAgICByZXR1cm4gZmllbGREZWYuZmllbGQ7XG4gICAgY2FzZSAnZnVuY3Rpb25hbCc6XG4gICAgICByZXR1cm4gZnVuY3Rpb25hbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdmVyYmFsVGl0bGVGb3JtYXR0ZXIoZmllbGREZWYsIGNvbmZpZyk7XG4gIH1cbn07XG5cbmxldCB0aXRsZUZvcm1hdHRlciA9IGRlZmF1bHRUaXRsZUZvcm1hdHRlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFRpdGxlRm9ybWF0dGVyKGZvcm1hdHRlcjogKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykgPT4gc3RyaW5nKSB7XG4gIHRpdGxlRm9ybWF0dGVyID0gZm9ybWF0dGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRUaXRsZUZvcm1hdHRlcigpIHtcbiAgc2V0VGl0bGVGb3JtYXR0ZXIoZGVmYXVsdFRpdGxlRm9ybWF0dGVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpdGxlKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICByZXR1cm4gdGl0bGVGb3JtYXR0ZXIoZmllbGREZWYsIGNvbmZpZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0VHlwZShmaWVsZERlZjogRmllbGREZWY8RmllbGQ+LCBjaGFubmVsOiBDaGFubmVsKTogVHlwZSB7XG4gIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgIHJldHVybiAndGVtcG9yYWwnO1xuICB9XG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICByZXR1cm4gJ3F1YW50aXRhdGl2ZSc7XG4gIH1cbiAgc3dpdGNoIChyYW5nZVR5cGUoY2hhbm5lbCkpIHtcbiAgICBjYXNlICdjb250aW51b3VzJzpcbiAgICAgIHJldHVybiAncXVhbnRpdGF0aXZlJztcbiAgICBjYXNlICdkaXNjcmV0ZSc6XG4gICAgICByZXR1cm4gJ25vbWluYWwnO1xuICAgIGNhc2UgJ2ZsZXhpYmxlJzogLy8gY29sb3JcbiAgICAgIHJldHVybiAnbm9taW5hbCc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAncXVhbnRpdGF0aXZlJztcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpZWxkRGVmIC0tIGVpdGhlciBmcm9tIHRoZSBvdXRlciBjaGFubmVsRGVmIG9yIGZyb20gdGhlIGNvbmRpdGlvbiBvZiBjaGFubmVsRGVmLlxuICogQHBhcmFtIGNoYW5uZWxEZWZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpZWxkRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBGaWVsZERlZjxGPiB7XG4gIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIGNoYW5uZWxEZWY7XG4gIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiBjaGFubmVsRGVmLmNvbmRpdGlvbjtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENvbnZlcnQgdHlwZSB0byBmdWxsLCBsb3dlcmNhc2UgdHlwZSwgb3IgYXVnbWVudCB0aGUgZmllbGREZWYgd2l0aCBhIGRlZmF1bHQgdHlwZSBpZiBtaXNzaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCk6IENoYW5uZWxEZWY8YW55PiB7XG4gIGlmIChpc1N0cmluZyhjaGFubmVsRGVmKSB8fCBpc051bWJlcihjaGFubmVsRGVmKSB8fCBpc0Jvb2xlYW4oY2hhbm5lbERlZikpIHtcbiAgICBjb25zdCBwcmltaXRpdmVUeXBlID0gaXNTdHJpbmcoY2hhbm5lbERlZikgPyAnc3RyaW5nJyA6XG4gICAgICBpc051bWJlcihjaGFubmVsRGVmKSA/ICdudW1iZXInIDogJ2Jvb2xlYW4nO1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnByaW1pdGl2ZUNoYW5uZWxEZWYoY2hhbm5lbCwgcHJpbWl0aXZlVHlwZSwgY2hhbm5lbERlZikpO1xuICAgIHJldHVybiB7dmFsdWU6IGNoYW5uZWxEZWZ9O1xuICB9XG5cbiAgLy8gSWYgYSBmaWVsZERlZiBjb250YWlucyBhIGZpZWxkLCB3ZSBuZWVkIHR5cGUuXG4gIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZUZpZWxkRGVmKGNoYW5uZWxEZWYsIGNoYW5uZWwpO1xuICB9IGVsc2UgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uY2hhbm5lbERlZixcbiAgICAgIC8vIE5lZWQgdG8gY2FzdCBhcyBub3JtYWxpemVGaWVsZERlZiBub3JtYWxseSByZXR1cm4gRmllbGREZWYsIGJ1dCBoZXJlIHdlIGtub3cgdGhhdCBpdCBpcyBkZWZpbml0ZWx5IENvbmRpdGlvbjxGaWVsZERlZj5cbiAgICAgIGNvbmRpdGlvbjogbm9ybWFsaXplRmllbGREZWYoY2hhbm5lbERlZi5jb25kaXRpb24sIGNoYW5uZWwpIGFzIENvbmRpdGlvbmFsPEZpZWxkRGVmPHN0cmluZz4+XG4gICAgfTtcbiAgfVxuICByZXR1cm4gY2hhbm5lbERlZjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAvLyBEcm9wIGludmFsaWQgYWdncmVnYXRlXG4gIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUgJiYgIWlzQWdncmVnYXRlT3AoZmllbGREZWYuYWdncmVnYXRlKSkge1xuICAgIGNvbnN0IHthZ2dyZWdhdGUsIC4uLmZpZWxkRGVmV2l0aG91dEFnZ3JlZ2F0ZX0gPSBmaWVsZERlZjtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkQWdncmVnYXRlKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpO1xuICAgIGZpZWxkRGVmID0gZmllbGREZWZXaXRob3V0QWdncmVnYXRlO1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIFRpbWUgVW5pdFxuICBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICBmaWVsZERlZiA9IHtcbiAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgdGltZVVuaXQ6IG5vcm1hbGl6ZVRpbWVVbml0KGZpZWxkRGVmLnRpbWVVbml0KVxuICAgIH07XG4gIH1cblxuICAvLyBOb3JtYWxpemUgYmluXG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICBmaWVsZERlZiA9IHtcbiAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgYmluOiBub3JtYWxpemVCaW4oZmllbGREZWYuYmluLCBjaGFubmVsKVxuICAgIH07XG4gIH1cblxuICAvLyBOb3JtYWxpemUgVHlwZVxuICBpZiAoZmllbGREZWYudHlwZSkge1xuICAgIGNvbnN0IGZ1bGxUeXBlID0gZ2V0RnVsbE5hbWUoZmllbGREZWYudHlwZSk7XG4gICAgaWYgKGZpZWxkRGVmLnR5cGUgIT09IGZ1bGxUeXBlKSB7XG4gICAgICAvLyBjb252ZXJ0IHNob3J0IHR5cGUgdG8gZnVsbCB0eXBlXG4gICAgICBmaWVsZERlZiA9IHtcbiAgICAgICAgLi4uZmllbGREZWYsXG4gICAgICAgIHR5cGU6IGZ1bGxUeXBlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoZmllbGREZWYudHlwZSAhPT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICAgIGlmIChpc0NvdW50aW5nQWdncmVnYXRlT3AoZmllbGREZWYuYWdncmVnYXRlKSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkRmllbGRUeXBlRm9yQ291bnRBZ2dyZWdhdGUoZmllbGREZWYudHlwZSwgZmllbGREZWYuYWdncmVnYXRlKSk7XG4gICAgICAgIGZpZWxkRGVmID0ge1xuICAgICAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElmIHR5cGUgaXMgZW1wdHkgLyBpbnZhbGlkLCB0aGVuIGF1Z21lbnQgd2l0aCBkZWZhdWx0IHR5cGVcbiAgICBjb25zdCBuZXdUeXBlID0gZGVmYXVsdFR5cGUoZmllbGREZWYsIGNoYW5uZWwpO1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmVtcHR5T3JJbnZhbGlkRmllbGRUeXBlKGZpZWxkRGVmLnR5cGUsIGNoYW5uZWwsIG5ld1R5cGUpKTtcbiAgICBmaWVsZERlZiA9IHtcbiAgICAgICAgLi4uZmllbGREZWYsXG4gICAgICB0eXBlOiBuZXdUeXBlXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHtjb21wYXRpYmxlLCB3YXJuaW5nfSA9IGNoYW5uZWxDb21wYXRpYmlsaXR5KGZpZWxkRGVmLCBjaGFubmVsKTtcbiAgaWYgKCFjb21wYXRpYmxlKSB7XG4gICAgbG9nLndhcm4od2FybmluZyk7XG4gIH1cbiAgcmV0dXJuIGZpZWxkRGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQmluKGJpbjogQmluUGFyYW1zfGJvb2xlYW4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgaWYgKGlzQm9vbGVhbihiaW4pKSB7XG4gICAgcmV0dXJuIHttYXhiaW5zOiBhdXRvTWF4QmlucyhjaGFubmVsKX07XG4gIH0gZWxzZSBpZiAoIWJpbi5tYXhiaW5zICYmICFiaW4uc3RlcCkge1xuICAgIHJldHVybiB7Li4uYmluLCBtYXhiaW5zOiBhdXRvTWF4QmlucyhjaGFubmVsKX07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJpbjtcbiAgfVxufVxuXG5jb25zdCBDT01QQVRJQkxFID0ge2NvbXBhdGlibGU6IHRydWV9O1xuZXhwb3J0IGZ1bmN0aW9uIGNoYW5uZWxDb21wYXRpYmlsaXR5KGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4sIGNoYW5uZWw6IENoYW5uZWwpOiB7Y29tcGF0aWJsZTogYm9vbGVhbjsgd2FybmluZz86IHN0cmluZzt9IHtcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSAncm93JzpcbiAgICBjYXNlICdjb2x1bW4nOlxuICAgICAgaWYgKGlzQ29udGludW91cyhmaWVsZERlZikgJiYgIWZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIC8vIFRPRE86KGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjAxMSk6XG4gICAgICAgIC8vIHdpdGggdGltZVVuaXQgaXQncyBub3QgYWx3YXlzIHN0cmljdGx5IGNvbnRpbnVvdXNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBsb2cubWVzc2FnZS5mYWNldENoYW5uZWxTaG91bGRCZURpc2NyZXRlKGNoYW5uZWwpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ3gnOlxuICAgIGNhc2UgJ3knOlxuICAgIGNhc2UgJ2NvbG9yJzpcbiAgICBjYXNlICd0ZXh0JzpcbiAgICBjYXNlICdkZXRhaWwnOlxuICAgIGNhc2UgJ3Rvb2x0aXAnOlxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICdvcGFjaXR5JzpcbiAgICBjYXNlICdzaXplJzpcbiAgICBjYXNlICd4Mic6XG4gICAgY2FzZSAneTInOlxuICAgICAgaWYgKGlzRGlzY3JldGUoZmllbGREZWYpICYmICFmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBgQ2hhbm5lbCAke2NoYW5uZWx9IHNob3VsZCBub3QgYmUgdXNlZCB3aXRoIGRpc2NyZXRlIGZpZWxkLmBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnc2hhcGUnOlxuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgIT09ICdub21pbmFsJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6ICdTaGFwZSBjaGFubmVsIHNob3VsZCBiZSB1c2VkIHdpdGggbm9taW5hbCBkYXRhIG9ubHknXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ29yZGVyJzpcbiAgICAgIGlmIChmaWVsZERlZi50eXBlID09PSAnbm9taW5hbCcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBgQ2hhbm5lbCBvcmRlciBpcyBpbmFwcHJvcHJpYXRlIGZvciBub21pbmFsIGZpZWxkLCB3aGljaCBoYXMgbm8gaW5oZXJlbnQgb3JkZXIuYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdjaGFubmVsQ29tcGF0YWJpbGl0eSBub3QgaW1wbGVtZW50ZWQgZm9yIGNoYW5uZWwgJyArIGNoYW5uZWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXJGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8YW55Pikge1xuICByZXR1cm4gZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScgfHwgISFmaWVsZERlZi5iaW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RpbWVGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8YW55Pikge1xuICByZXR1cm4gZmllbGREZWYudHlwZSA9PT0gJ3RlbXBvcmFsJyB8fCAhIWZpZWxkRGVmLnRpbWVVbml0O1xufVxuIl19