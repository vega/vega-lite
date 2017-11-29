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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRkZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9FQUFvRTtBQUNwRSx5Q0FBOEU7QUFFOUUsNkJBQTBEO0FBQzFELHFDQUE2QztBQUk3QywyQkFBNkI7QUFLN0IsdUNBQXlFO0FBQ3pFLCtCQUF5QztBQUN6QywrQkFBcUY7QUF5RXJGLHFCQUE0QixLQUFZO0lBQ3RDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxlQUFRLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxJQUFJLEtBQUssQ0FBQztBQUN4RCxDQUFDO0FBRkQsa0NBRUM7QUFrSkQsMEJBQW9DLFVBQXlCO0lBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQ2hELENBQUM7QUFGRCw0Q0FFQztBQUVEOztHQUVHO0FBQ0gsZ0NBQTBDLFVBQXlCO0lBQ2pFLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxJQUFJLENBQUMsY0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RILENBQUM7QUFGRCx3REFFQztBQUVELGdDQUEwQyxVQUF5QjtJQUNqRSxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsSUFBSSxDQUMvQyxjQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQ2xFLENBQUM7QUFDSixDQUFDO0FBSkQsd0RBSUM7QUFFRCxvQkFBOEIsVUFBeUI7SUFDckQsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLENB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QixPQUFPLEVBQUUsYUFBVyxPQUFPLDZDQUEwQztpQkFDdEUsQ0FBQztZQUNKLENBQUM7WUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO1FBRXBCLEtBQUssT0FBTztZQUNWLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDO29CQUNMLFVBQVUsRUFBRSxLQUFLO29CQUNqQixPQUFPLEVBQUUscURBQXFEO2lCQUMvRCxDQUFDO1lBQ0osQ0FBQztZQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFFcEIsS0FBSyxPQUFPO1lBQ1YsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxNQUFNLENBQUM7b0JBQ0wsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLE9BQU8sRUFBRSxnRkFBZ0Y7aUJBQzFGLENBQUM7WUFDSixDQUFDO1lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNqRixDQUFDO0FBckRELG9EQXFEQztBQUVELDBCQUFpQyxRQUF1QjtJQUN0RCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxjQUFjLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFDNUQsQ0FBQztBQUZELDRDQUVDO0FBRUQsd0JBQStCLFFBQXVCO0lBQ3BELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUM3RCxDQUFDO0FBRkQsd0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEZWNsYXJhdGlvbiBhbmQgdXRpbGl0eSBmb3IgdmFyaWFudHMgb2YgYSBmaWVsZCBkZWZpbml0aW9uIG9iamVjdFxuaW1wb3J0IHtBZ2dyZWdhdGVPcCwgaXNBZ2dyZWdhdGVPcCwgaXNDb3VudGluZ0FnZ3JlZ2F0ZU9wfSBmcm9tICcuL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0F4aXN9IGZyb20gJy4vYXhpcyc7XG5pbXBvcnQge2F1dG9NYXhCaW5zLCBCaW5QYXJhbXMsIGJpblRvU3RyaW5nfSBmcm9tICcuL2Jpbic7XG5pbXBvcnQge0NoYW5uZWwsIHJhbmdlVHlwZX0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7Q29tcG9zaXRlQWdncmVnYXRlfSBmcm9tICcuL2NvbXBvc2l0ZW1hcmsnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2cnO1xuaW1wb3J0IHtMb2dpY2FsT3BlcmFuZH0gZnJvbSAnLi9sb2dpY2FsJztcbmltcG9ydCB7U2NhbGV9IGZyb20gJy4vc2NhbGUnO1xuaW1wb3J0IHtTb3J0RmllbGQsIFNvcnRPcmRlcn0gZnJvbSAnLi9zb3J0JztcbmltcG9ydCB7U3RhY2tPZmZzZXR9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHtnZXRUaW1lVW5pdFBhcnRzLCBub3JtYWxpemVUaW1lVW5pdCwgVGltZVVuaXR9IGZyb20gJy4vdGltZXVuaXQnO1xuaW1wb3J0IHtnZXRGdWxsTmFtZSwgVHlwZX0gZnJvbSAnLi90eXBlJztcbmltcG9ydCB7YWNjZXNzUGF0aCwgaXNBcnJheSwgaXNCb29sZWFuLCBpc051bWJlciwgaXNTdHJpbmcsIHRpdGxlY2FzZX0gZnJvbSAnLi91dGlsJztcblxuXG4vKipcbiAqIERlZmluaXRpb24gb2JqZWN0IGZvciBhIGNvbnN0YW50IHZhbHVlIG9mIGFuIGVuY29kaW5nIGNoYW5uZWwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVEZWYge1xuICAvKipcbiAgICogQSBjb25zdGFudCB2YWx1ZSBpbiB2aXN1YWwgZG9tYWluIChlLmcuLCBgXCJyZWRcImAgLyBcIiMwMDk5ZmZcIiBmb3IgY29sb3IsIHZhbHVlcyBiZXR3ZWVuIGAwYCB0byBgMWAgZm9yIG9wYWNpdHkpLlxuICAgKi9cbiAgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW47XG59XG5cbi8qKlxuICogR2VuZXJpYyB0eXBlIGZvciBjb25kaXRpb25hbCBjaGFubmVsRGVmLlxuICogRiBkZWZpbmVzIHRoZSB1bmRlcmx5aW5nIEZpZWxkRGVmIHR5cGUuXG4gKi9cbmV4cG9ydCB0eXBlIENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiA9IEZpZWxkRGVmV2l0aENvbmRpdGlvbjxGPiB8IFZhbHVlRGVmV2l0aENvbmRpdGlvbjxGPjtcblxuXG5leHBvcnQgdHlwZSBDb25kaXRpb25hbDxUPiA9IHtcbiAgLyoqXG4gICAqIEEgW3NlbGVjdGlvbiBuYW1lXShzZWxlY3Rpb24uaHRtbCksIG9yIGEgc2VyaWVzIG9mIFtjb21wb3NlZCBzZWxlY3Rpb25zXShzZWxlY3Rpb24uaHRtbCNjb21wb3NlKS5cbiAgICovXG4gIHNlbGVjdGlvbjogTG9naWNhbE9wZXJhbmQ8c3RyaW5nPjtcbn0gJiBUO1xuXG4vKipcbiAqIEEgRmllbGREZWYgd2l0aCBDb25kaXRpb248VmFsdWVEZWY+XG4gKiB7XG4gKiAgIGNvbmRpdGlvbjoge3ZhbHVlOiAuLi59LFxuICogICBmaWVsZDogLi4uLFxuICogICAuLi5cbiAqIH1cbiAqL1xuZXhwb3J0IHR5cGUgRmllbGREZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiA9IEYgJiB7XG4gIC8qKlxuICAgKiBPbmUgb3IgbW9yZSB2YWx1ZSBkZWZpbml0aW9uKHMpIHdpdGggYSBzZWxlY3Rpb24gcHJlZGljYXRlLlxuICAgKlxuICAgKiBfX05vdGU6X18gQSBmaWVsZCBkZWZpbml0aW9uJ3MgYGNvbmRpdGlvbmAgcHJvcGVydHkgY2FuIG9ubHkgY29udGFpbiBbdmFsdWUgZGVmaW5pdGlvbnNdKGVuY29kaW5nLmh0bWwjdmFsdWUpXG4gICAqIHNpbmNlIFZlZ2EtTGl0ZSBvbmx5IGFsbG93cyBhdCBtb3N0eSAgb25lIGVuY29kZWQgZmllbGQgcGVyIGVuY29kaW5nIGNoYW5uZWwuXG4gICAqL1xuICBjb25kaXRpb24/OiBDb25kaXRpb25hbDxWYWx1ZURlZj4gfCBDb25kaXRpb25hbDxWYWx1ZURlZj5bXTtcbn07XG5cbi8qKlxuICogQSBWYWx1ZURlZiB3aXRoIENvbmRpdGlvbjxWYWx1ZURlZiB8IEZpZWxkRGVmPlxuICoge1xuICogICBjb25kaXRpb246IHtmaWVsZDogLi4ufSB8IHt2YWx1ZTogLi4ufSxcbiAqICAgdmFsdWU6IC4uLixcbiAqIH1cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWYWx1ZURlZldpdGhDb25kaXRpb248RiBleHRlbmRzIEZpZWxkRGVmPGFueT4+IHtcbiAgLyoqXG4gICAqIEEgZmllbGQgZGVmaW5pdGlvbiBvciBvbmUgb3IgbW9yZSB2YWx1ZSBkZWZpbml0aW9uKHMpIHdpdGggYSBzZWxlY3Rpb24gcHJlZGljYXRlLlxuICAgKi9cbiAgY29uZGl0aW9uPzogQ29uZGl0aW9uYWw8Rj4gfCBDb25kaXRpb25hbDxWYWx1ZURlZj4gfCBDb25kaXRpb25hbDxWYWx1ZURlZj5bXTtcblxuICAvKipcbiAgICogQSBjb25zdGFudCB2YWx1ZSBpbiB2aXN1YWwgZG9tYWluLlxuICAgKi9cbiAgdmFsdWU/OiBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuO1xufVxuXG4vKipcbiAqIFJlZmVyZW5jZSB0byBhIHJlcGVhdGVkIHZhbHVlLlxuICovXG5leHBvcnQgdHlwZSBSZXBlYXRSZWYgPSB7XG4gIHJlcGVhdDogJ3JvdycgfCAnY29sdW1uJ1xufTtcblxuZXhwb3J0IHR5cGUgRmllbGQgPSBzdHJpbmcgfCBSZXBlYXRSZWY7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlcGVhdFJlZihmaWVsZDogRmllbGQpOiBmaWVsZCBpcyBSZXBlYXRSZWYge1xuICByZXR1cm4gZmllbGQgJiYgIWlzU3RyaW5nKGZpZWxkKSAmJiAncmVwZWF0JyBpbiBmaWVsZDtcbn1cblxuLyoqIEBoaWRlICovXG5leHBvcnQgdHlwZSBIaWRkZW5Db21wb3NpdGVBZ2dyZWdhdGUgPSBDb21wb3NpdGVBZ2dyZWdhdGU7XG5cbmV4cG9ydCB0eXBlIEFnZ3JlZ2F0ZSA9IEFnZ3JlZ2F0ZU9wIHwgSGlkZGVuQ29tcG9zaXRlQWdncmVnYXRlO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZpZWxkRGVmQmFzZTxGPiB7XG5cbiAgLyoqXG4gICAqIF9fUmVxdWlyZWQuX18gQSBzdHJpbmcgZGVmaW5pbmcgdGhlIG5hbWUgb2YgdGhlIGZpZWxkIGZyb20gd2hpY2ggdG8gcHVsbCBhIGRhdGEgdmFsdWVcbiAgICogb3IgYW4gb2JqZWN0IGRlZmluaW5nIGl0ZXJhdGVkIHZhbHVlcyBmcm9tIHRoZSBbYHJlcGVhdGBdKHJlcGVhdC5odG1sKSBvcGVyYXRvci5cbiAgICpcbiAgICogX19Ob3RlOl9fIERvdHMgKGAuYCkgYW5kIGJyYWNrZXRzIChgW2AgYW5kIGBdYCkgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIG5lc3RlZCBvYmplY3RzIChlLmcuLCBgXCJmaWVsZFwiOiBcImZvby5iYXJcImAgYW5kIGBcImZpZWxkXCI6IFwiZm9vWydiYXInXVwiYCkuXG4gICAqIElmIGZpZWxkIG5hbWVzIGNvbnRhaW4gZG90cyBvciBicmFja2V0cyBidXQgYXJlIG5vdCBuZXN0ZWQsIHlvdSBjYW4gdXNlIGBcXFxcYCB0byBlc2NhcGUgZG90cyBhbmQgYnJhY2tldHMgKGUuZy4sIGBcImFcXFxcLmJcImAgYW5kIGBcImFcXFxcWzBcXFxcXVwiYCkuXG4gICAqIFNlZSBtb3JlIGRldGFpbHMgYWJvdXQgZXNjYXBpbmcgaW4gdGhlIFtmaWVsZCBkb2N1bWVudGF0aW9uXShmaWVsZC5odG1sKS5cbiAgICpcbiAgICogX19Ob3RlOl9fIGBmaWVsZGAgaXMgbm90IHJlcXVpcmVkIGlmIGBhZ2dyZWdhdGVgIGlzIGBjb3VudGAuXG4gICAqL1xuICBmaWVsZD86IEY7XG5cbiAgLy8gZnVuY3Rpb25cblxuICAvKipcbiAgICogVGltZSB1bml0IChlLmcuLCBgeWVhcmAsIGB5ZWFybW9udGhgLCBgbW9udGhgLCBgaG91cnNgKSBmb3IgYSB0ZW1wb3JhbCBmaWVsZC5cbiAgICogb3IgW2EgdGVtcG9yYWwgZmllbGQgdGhhdCBnZXRzIGNhc3RlZCBhcyBvcmRpbmFsXSh0eXBlLmh0bWwjY2FzdCkuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgdW5kZWZpbmVkYCAoTm9uZSlcbiAgICovXG4gIHRpbWVVbml0PzogVGltZVVuaXQ7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBmb3IgYmlubmluZyBhIGBxdWFudGl0YXRpdmVgIGZpZWxkLCBvciBbYW4gb2JqZWN0IGRlZmluaW5nIGJpbm5pbmcgcGFyYW1ldGVyc10oYmluLmh0bWwjcGFyYW1zKS5cbiAgICogSWYgYHRydWVgLCBkZWZhdWx0IFtiaW5uaW5nIHBhcmFtZXRlcnNdKGJpbi5odG1sKSB3aWxsIGJlIGFwcGxpZWQuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgZmFsc2VgXG4gICAqL1xuICBiaW4/OiBib29sZWFuIHwgQmluUGFyYW1zO1xuXG4gIC8qKlxuICAgKiBBZ2dyZWdhdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGZpZWxkXG4gICAqIChlLmcuLCBgbWVhbmAsIGBzdW1gLCBgbWVkaWFuYCwgYG1pbmAsIGBtYXhgLCBgY291bnRgKS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB1bmRlZmluZWRgIChOb25lKVxuICAgKlxuICAgKi9cbiAgYWdncmVnYXRlPzogQWdncmVnYXRlO1xufVxuXG4vKipcbiAqICBEZWZpbml0aW9uIG9iamVjdCBmb3IgYSBkYXRhIGZpZWxkLCBpdHMgdHlwZSBhbmQgdHJhbnNmb3JtYXRpb24gb2YgYW4gZW5jb2RpbmcgY2hhbm5lbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmQmFzZTxGPiB7XG4gIC8qKlxuICAgKiBUaGUgZW5jb2RlZCBmaWVsZCdzIHR5cGUgb2YgbWVhc3VyZW1lbnQgKGBcInF1YW50aXRhdGl2ZVwiYCwgYFwidGVtcG9yYWxcImAsIGBcIm9yZGluYWxcImAsIG9yIGBcIm5vbWluYWxcImApLlxuICAgKi9cbiAgLy8gKiBvciBhbiBpbml0aWFsIGNoYXJhY3RlciBvZiB0aGUgdHlwZSBuYW1lIChgXCJRXCJgLCBgXCJUXCJgLCBgXCJPXCJgLCBgXCJOXCJgKS5cbiAgLy8gKiBUaGlzIHByb3BlcnR5IGlzIGNhc2UtaW5zZW5zaXRpdmUuXG4gIHR5cGU6IFR5cGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NhbGVGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIHRoZSBjaGFubmVsJ3Mgc2NhbGUsIHdoaWNoIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHRyYW5zZm9ybXMgdmFsdWVzIGluIHRoZSBkYXRhIGRvbWFpbiAobnVtYmVycywgZGF0ZXMsIHN0cmluZ3MsIGV0YykgdG8gdmlzdWFsIHZhbHVlcyAocGl4ZWxzLCBjb2xvcnMsIHNpemVzKSBvZiB0aGUgZW5jb2RpbmcgY2hhbm5lbHMuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBJZiB1bmRlZmluZWQsIGRlZmF1bHQgW3NjYWxlIHByb3BlcnRpZXNdKHNjYWxlLmh0bWwpIGFyZSBhcHBsaWVkLlxuICAgKi9cbiAgc2NhbGU/OiBTY2FsZTtcblxuICAvKipcbiAgICogU29ydCBvcmRlciBmb3IgdGhlIGVuY29kZWQgZmllbGQuXG4gICAqIFN1cHBvcnRlZCBgc29ydGAgdmFsdWVzIGluY2x1ZGUgYFwiYXNjZW5kaW5nXCJgLCBgXCJkZXNjZW5kaW5nXCJgIGFuZCBgbnVsbGAgKG5vIHNvcnRpbmcpLlxuICAgKiBGb3IgZmllbGRzIHdpdGggZGlzY3JldGUgZG9tYWlucywgYHNvcnRgIGNhbiBhbHNvIGJlIGEgW3NvcnQgZmllbGQgZGVmaW5pdGlvbiBvYmplY3RdKHNvcnQuaHRtbCNzb3J0LWZpZWxkKS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGBcImFzY2VuZGluZ1wiYFxuICAgKlxuICAgKiBAbnVsbGFibGVcbiAgICovXG4gIHNvcnQ/OiBTb3J0T3JkZXIgfCBTb3J0RmllbGQ8Rj4gfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uRmllbGREZWY8Rj4gZXh0ZW5kcyBTY2FsZUZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIGF4aXMncyBncmlkbGluZXMsIHRpY2tzIGFuZCBsYWJlbHMuXG4gICAqIElmIGBudWxsYCwgdGhlIGF4aXMgZm9yIHRoZSBlbmNvZGluZyBjaGFubmVsIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIElmIHVuZGVmaW5lZCwgZGVmYXVsdCBbYXhpcyBwcm9wZXJ0aWVzXShheGlzLmh0bWwpIGFyZSBhcHBsaWVkLlxuICAgKlxuICAgKiBAbnVsbGFibGVcbiAgICovXG4gIGF4aXM/OiBBeGlzIHwgbnVsbDtcblxuICAvKipcbiAgICogVHlwZSBvZiBzdGFja2luZyBvZmZzZXQgaWYgdGhlIGZpZWxkIHNob3VsZCBiZSBzdGFja2VkLlxuICAgKiBgc3RhY2tgIGlzIG9ubHkgYXBwbGljYWJsZSBmb3IgYHhgIGFuZCBgeWAgY2hhbm5lbHMgd2l0aCBjb250aW51b3VzIGRvbWFpbnMuXG4gICAqIEZvciBleGFtcGxlLCBgc3RhY2tgIG9mIGB5YCBjYW4gYmUgdXNlZCB0byBjdXN0b21pemUgc3RhY2tpbmcgZm9yIGEgdmVydGljYWwgYmFyIGNoYXJ0LlxuICAgKlxuICAgKiBgc3RhY2tgIGNhbiBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6XG4gICAqIC0gYFwiemVyb1wiYDogc3RhY2tpbmcgd2l0aCBiYXNlbGluZSBvZmZzZXQgYXQgemVybyB2YWx1ZSBvZiB0aGUgc2NhbGUgKGZvciBjcmVhdGluZyB0eXBpY2FsIHN0YWNrZWQgW2Jhcl0oc3RhY2suaHRtbCNiYXIpIGFuZCBbYXJlYV0oc3RhY2suaHRtbCNhcmVhKSBjaGFydCkuXG4gICAqIC0gYFwibm9ybWFsaXplXCJgIC0gc3RhY2tpbmcgd2l0aCBub3JtYWxpemVkIGRvbWFpbiAoZm9yIGNyZWF0aW5nIFtub3JtYWxpemVkIHN0YWNrZWQgYmFyIGFuZCBhcmVhIGNoYXJ0c10oc3RhY2suaHRtbCNub3JtYWxpemVkKS4gPGJyLz5cbiAgICogLWBcImNlbnRlclwiYCAtIHN0YWNraW5nIHdpdGggY2VudGVyIGJhc2VsaW5lIChmb3IgW3N0cmVhbWdyYXBoXShzdGFjay5odG1sI3N0cmVhbWdyYXBoKSkuXG4gICAqIC0gYG51bGxgIC0gTm8tc3RhY2tpbmcuIFRoaXMgd2lsbCBwcm9kdWNlIGxheWVyZWQgW2Jhcl0oc3RhY2suaHRtbCNsYXllcmVkLWJhci1jaGFydCkgYW5kIGFyZWEgY2hhcnQuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgemVyb2AgZm9yIHBsb3RzIHdpdGggYWxsIG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgdHJ1ZTpcbiAgICogKDEpIHRoZSBtYXJrIGlzIGBiYXJgIG9yIGBhcmVhYDtcbiAgICogKDIpIHRoZSBzdGFja2VkIG1lYXN1cmUgY2hhbm5lbCAoeCBvciB5KSBoYXMgYSBsaW5lYXIgc2NhbGU7XG4gICAqICgzKSBBdCBsZWFzdCBvbmUgb2Ygbm9uLXBvc2l0aW9uIGNoYW5uZWxzIG1hcHBlZCB0byBhbiB1bmFnZ3JlZ2F0ZWQgZmllbGQgdGhhdCBpcyBkaWZmZXJlbnQgZnJvbSB4IGFuZCB5LiAgT3RoZXJ3aXNlLCBgbnVsbGAgYnkgZGVmYXVsdC5cbiAgICovXG4gIHN0YWNrPzogU3RhY2tPZmZzZXQgfCBudWxsO1xufVxuXG4vKipcbiAqIEZpZWxkIGRlZmluaXRpb24gb2YgYSBtYXJrIHByb3BlcnR5LCB3aGljaCBjYW4gY29udGFpbiBhIGxlZ2VuZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXJrUHJvcEZpZWxkRGVmPEY+IGV4dGVuZHMgU2NhbGVGaWVsZERlZjxGPiB7XG4gICAvKipcbiAgICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIHRoZSBsZWdlbmQuXG4gICAgKiBJZiBgbnVsbGAsIHRoZSBsZWdlbmQgZm9yIHRoZSBlbmNvZGluZyBjaGFubmVsIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAqXG4gICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gSWYgdW5kZWZpbmVkLCBkZWZhdWx0IFtsZWdlbmQgcHJvcGVydGllc10obGVnZW5kLmh0bWwpIGFyZSBhcHBsaWVkLlxuICAgICpcbiAgICAqIEBudWxsYWJsZVxuICAgICovXG4gIGxlZ2VuZD86IExlZ2VuZCB8IG51bGw7XG59XG5cbi8vIERldGFpbFxuXG4vLyBPcmRlciBQYXRoIGhhdmUgbm8gc2NhbGVcblxuZXhwb3J0IGludGVyZmFjZSBPcmRlckZpZWxkRGVmPEY+IGV4dGVuZHMgRmllbGREZWY8Rj4ge1xuICAvKipcbiAgICogVGhlIHNvcnQgb3JkZXIuIE9uZSBvZiBgXCJhc2NlbmRpbmdcImAgKGRlZmF1bHQpIG9yIGBcImRlc2NlbmRpbmdcImAuXG4gICAqL1xuICBzb3J0PzogU29ydE9yZGVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRleHRGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIFRoZSBbZm9ybWF0dGluZyBwYXR0ZXJuXShmb3JtYXQuaHRtbCkgZm9yIGEgdGV4dCBmaWVsZC4gSWYgbm90IGRlZmluZWQsIHRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBmb3JtYXQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIENoYW5uZWxEZWY8Rj4gPSBDaGFubmVsRGVmV2l0aENvbmRpdGlvbjxGaWVsZERlZjxGPj47XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmRpdGlvbmFsRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uPEZpZWxkRGVmPEY+PiB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgISFjaGFubmVsRGVmLmNvbmRpdGlvbjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gaWYgYSBjaGFubmVsRGVmIGlzIGEgQ29uZGl0aW9uYWxWYWx1ZURlZiB3aXRoIENvbmRpdGlvbkZpZWxkRGVmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNDb25kaXRpb25hbEZpZWxkRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIChWYWx1ZURlZiAmIHtjb25kaXRpb246IENvbmRpdGlvbmFsPEZpZWxkRGVmPEY+Pn0pIHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAhIWNoYW5uZWxEZWYuY29uZGl0aW9uICYmICFpc0FycmF5KGNoYW5uZWxEZWYuY29uZGl0aW9uKSAmJiBpc0ZpZWxkRGVmKGNoYW5uZWxEZWYuY29uZGl0aW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0NvbmRpdGlvbmFsVmFsdWVEZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgKFZhbHVlRGVmICYge2NvbmRpdGlvbjogQ29uZGl0aW9uYWw8VmFsdWVEZWY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+W119KSB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgISFjaGFubmVsRGVmLmNvbmRpdGlvbiAmJiAoXG4gICAgaXNBcnJheShjaGFubmVsRGVmLmNvbmRpdGlvbikgfHwgaXNWYWx1ZURlZihjaGFubmVsRGVmLmNvbmRpdGlvbilcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmllbGREZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgRmllbGREZWY8Rj4gfCBQb3NpdGlvbkZpZWxkRGVmPEY+IHwgTWFya1Byb3BGaWVsZERlZjxGPiB8IE9yZGVyRmllbGREZWY8Rj4gfCBUZXh0RmllbGREZWY8Rj4ge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICghIWNoYW5uZWxEZWZbJ2ZpZWxkJ10gfHwgY2hhbm5lbERlZlsnYWdncmVnYXRlJ10gPT09ICdjb3VudCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmdGaWVsZERlZihmaWVsZERlZjogQ2hhbm5lbERlZjxzdHJpbmd8UmVwZWF0UmVmPik6IGZpZWxkRGVmIGlzIEZpZWxkRGVmPHN0cmluZz4ge1xuICByZXR1cm4gaXNGaWVsZERlZihmaWVsZERlZikgJiYgaXNTdHJpbmcoZmllbGREZWYuZmllbGQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWx1ZURlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyBWYWx1ZURlZiB7XG4gIHJldHVybiBjaGFubmVsRGVmICYmICd2YWx1ZScgaW4gY2hhbm5lbERlZiAmJiBjaGFubmVsRGVmWyd2YWx1ZSddICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NjYWxlRmllbGREZWYoY2hhbm5lbERlZjogQ2hhbm5lbERlZjxhbnk+KTogY2hhbm5lbERlZiBpcyBTY2FsZUZpZWxkRGVmPGFueT4ge1xuICAgIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgKCEhY2hhbm5lbERlZlsnc2NhbGUnXSB8fCAhIWNoYW5uZWxEZWZbJ3NvcnQnXSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGRSZWZPcHRpb24ge1xuICAvKiogZXhjbHVkZSBiaW4sIGFnZ3JlZ2F0ZSwgdGltZVVuaXQgKi9cbiAgbm9mbj86IGJvb2xlYW47XG4gIC8qKiBXcmFwIHRoZSBmaWVsZCB3aXRoIGRhdHVtIG9yIHBhcmVudCAoZS5nLiwgZGF0dW1bJy4uLiddIGZvciBWZWdhIEV4cHJlc3Npb24gKi9cbiAgZXhwcj86ICdkYXR1bScgfCAncGFyZW50JztcbiAgLyoqIHByZXBlbmQgZm4gd2l0aCBjdXN0b20gZnVuY3Rpb24gcHJlZml4ICovXG4gIHByZWZpeD86IHN0cmluZztcbiAgLyoqIGFwcGVuZCBzdWZmaXggdG8gdGhlIGZpZWxkIHJlZiBmb3IgYmluIChkZWZhdWx0PSdzdGFydCcpICovXG4gIGJpblN1ZmZpeD86ICdlbmQnIHwgJ3JhbmdlJyB8ICdtaWQnO1xuICAvKiogYXBwZW5kIHN1ZmZpeCB0byB0aGUgZmllbGQgcmVmIChnZW5lcmFsKSAqL1xuICBzdWZmaXg/OiBzdHJpbmc7XG4gIC8qKiBPdmVycnJpZGUgd2hpY2ggYWdncmVnYXRlIHRvIHVzZS4gTmVlZGVkIGZvciB1bmFnZ3JlZ2F0ZWQgZG9tYWluLiAqL1xuICBhZ2dyZWdhdGU/OiBBZ2dyZWdhdGVPcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkKGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8c3RyaW5nPiwgb3B0OiBGaWVsZFJlZk9wdGlvbiA9IHt9KTogc3RyaW5nIHtcbiAgbGV0IGZpZWxkID0gZmllbGREZWYuZmllbGQ7XG4gIGNvbnN0IHByZWZpeCA9IG9wdC5wcmVmaXg7XG4gIGxldCBzdWZmaXggPSBvcHQuc3VmZml4O1xuXG4gIGlmIChpc0NvdW50KGZpZWxkRGVmKSkge1xuICAgIGZpZWxkID0gJ2NvdW50XyonO1xuICB9IGVsc2Uge1xuICAgIGxldCBmbjogc3RyaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFvcHQubm9mbikge1xuICAgICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgICBmbiA9IGJpblRvU3RyaW5nKGZpZWxkRGVmLmJpbik7XG4gICAgICAgIHN1ZmZpeCA9IG9wdC5iaW5TdWZmaXggfHwgJyc7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICBmbiA9IFN0cmluZyhvcHQuYWdncmVnYXRlIHx8IGZpZWxkRGVmLmFnZ3JlZ2F0ZSk7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIGZuID0gU3RyaW5nKGZpZWxkRGVmLnRpbWVVbml0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm4pIHtcbiAgICAgIGZpZWxkID0gYCR7Zm59XyR7ZmllbGR9YDtcbiAgICB9XG4gIH1cblxuICBpZiAoc3VmZml4KSB7XG4gICAgZmllbGQgPSBgJHtmaWVsZH1fJHtzdWZmaXh9YDtcbiAgfVxuXG4gIGlmIChwcmVmaXgpIHtcbiAgICBmaWVsZCA9IGAke3ByZWZpeH1fJHtmaWVsZH1gO1xuICB9XG5cbiAgaWYgKG9wdC5leHByKSB7XG4gICAgZmllbGQgPSBgJHtvcHQuZXhwcn0ke2FjY2Vzc1BhdGgoZmllbGQpfWA7XG4gIH1cblxuICByZXR1cm4gZmllbGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc2NyZXRlKGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4pIHtcbiAgc3dpdGNoIChmaWVsZERlZi50eXBlKSB7XG4gICAgY2FzZSAnbm9taW5hbCc6XG4gICAgY2FzZSAnb3JkaW5hbCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlICdxdWFudGl0YXRpdmUnOlxuICAgICAgcmV0dXJuICEhZmllbGREZWYuYmluO1xuICAgIGNhc2UgJ3RlbXBvcmFsJzpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuaW52YWxpZEZpZWxkVHlwZShmaWVsZERlZi50eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbnRpbnVvdXMoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPikge1xuICByZXR1cm4gIWlzRGlzY3JldGUoZmllbGREZWYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb3VudChmaWVsZERlZjogRmllbGREZWZCYXNlPEZpZWxkPikge1xuICByZXR1cm4gZmllbGREZWYuYWdncmVnYXRlID09PSAnY291bnQnO1xufVxuXG5leHBvcnQgdHlwZSBGaWVsZFRpdGxlRm9ybWF0dGVyID0gKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykgPT4gc3RyaW5nO1xuXG5leHBvcnQgZnVuY3Rpb24gdmVyYmFsVGl0bGVGb3JtYXR0ZXIoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IHtmaWVsZCwgYmluLCB0aW1lVW5pdCwgYWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICBpZiAoYWdncmVnYXRlID09PSAnY291bnQnKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5jb3VudFRpdGxlO1xuICB9IGVsc2UgaWYgKGJpbikge1xuICAgIHJldHVybiBgJHtmaWVsZH0gKGJpbm5lZClgO1xuICB9IGVsc2UgaWYgKHRpbWVVbml0KSB7XG4gICAgY29uc3QgdW5pdHMgPSBnZXRUaW1lVW5pdFBhcnRzKHRpbWVVbml0KS5qb2luKCctJyk7XG4gICAgcmV0dXJuIGAke2ZpZWxkfSAoJHt1bml0c30pYDtcbiAgfSBlbHNlIGlmIChhZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4gYCR7dGl0bGVjYXNlKGFnZ3JlZ2F0ZSl9IG9mICR7ZmllbGR9YDtcbiAgfVxuICByZXR1cm4gZmllbGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmdW5jdGlvbmFsVGl0bGVGb3JtYXR0ZXIoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IGZuID0gZmllbGREZWYuYWdncmVnYXRlIHx8IGZpZWxkRGVmLnRpbWVVbml0IHx8IChmaWVsZERlZi5iaW4gJiYgJ2JpbicpO1xuICBpZiAoZm4pIHtcbiAgICByZXR1cm4gZm4udG9VcHBlckNhc2UoKSArICcoJyArIGZpZWxkRGVmLmZpZWxkICsgJyknO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmaWVsZERlZi5maWVsZDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZGVmYXVsdFRpdGxlRm9ybWF0dGVyOiBGaWVsZFRpdGxlRm9ybWF0dGVyID0gKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykgPT4ge1xuICBzd2l0Y2ggKGNvbmZpZy5maWVsZFRpdGxlKSB7XG4gICAgY2FzZSAncGxhaW4nOlxuICAgICAgcmV0dXJuIGZpZWxkRGVmLmZpZWxkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uYWwnOlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZiwgY29uZmlnKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHZlcmJhbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xuICB9XG59O1xuXG5sZXQgdGl0bGVGb3JtYXR0ZXIgPSBkZWZhdWx0VGl0bGVGb3JtYXR0ZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRUaXRsZUZvcm1hdHRlcihmb3JtYXR0ZXI6IChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpID0+IHN0cmluZykge1xuICB0aXRsZUZvcm1hdHRlciA9IGZvcm1hdHRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0VGl0bGVGb3JtYXR0ZXIoKSB7XG4gIHNldFRpdGxlRm9ybWF0dGVyKGRlZmF1bHRUaXRsZUZvcm1hdHRlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIHRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFR5cGUoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPiwgY2hhbm5lbDogQ2hhbm5lbCk6IFR5cGUge1xuICBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICByZXR1cm4gJ3RlbXBvcmFsJztcbiAgfVxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgcmV0dXJuICdxdWFudGl0YXRpdmUnO1xuICB9XG4gIHN3aXRjaCAocmFuZ2VUeXBlKGNoYW5uZWwpKSB7XG4gICAgY2FzZSAnY29udGludW91cyc6XG4gICAgICByZXR1cm4gJ3F1YW50aXRhdGl2ZSc7XG4gICAgY2FzZSAnZGlzY3JldGUnOlxuICAgICAgcmV0dXJuICdub21pbmFsJztcbiAgICBjYXNlICdmbGV4aWJsZSc6IC8vIGNvbG9yXG4gICAgICByZXR1cm4gJ25vbWluYWwnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJ3F1YW50aXRhdGl2ZSc7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaWVsZERlZiAtLSBlaXRoZXIgZnJvbSB0aGUgb3V0ZXIgY2hhbm5lbERlZiBvciBmcm9tIHRoZSBjb25kaXRpb24gb2YgY2hhbm5lbERlZi5cbiAqIEBwYXJhbSBjaGFubmVsRGVmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogRmllbGREZWY8Rj4ge1xuICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiBjaGFubmVsRGVmO1xuICB9IGVsc2UgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4gY2hhbm5lbERlZi5jb25kaXRpb247XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IHR5cGUgdG8gZnVsbCwgbG93ZXJjYXNlIHR5cGUsIG9yIGF1Z21lbnQgdGhlIGZpZWxkRGVmIHdpdGggYSBkZWZhdWx0IHR5cGUgaWYgbWlzc2luZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShjaGFubmVsRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpOiBDaGFubmVsRGVmPGFueT4ge1xuICBpZiAoaXNTdHJpbmcoY2hhbm5lbERlZikgfHwgaXNOdW1iZXIoY2hhbm5lbERlZikgfHwgaXNCb29sZWFuKGNoYW5uZWxEZWYpKSB7XG4gICAgY29uc3QgcHJpbWl0aXZlVHlwZSA9IGlzU3RyaW5nKGNoYW5uZWxEZWYpID8gJ3N0cmluZycgOlxuICAgICAgaXNOdW1iZXIoY2hhbm5lbERlZikgPyAnbnVtYmVyJyA6ICdib29sZWFuJztcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5wcmltaXRpdmVDaGFubmVsRGVmKGNoYW5uZWwsIHByaW1pdGl2ZVR5cGUsIGNoYW5uZWxEZWYpKTtcbiAgICByZXR1cm4ge3ZhbHVlOiBjaGFubmVsRGVmfTtcbiAgfVxuXG4gIC8vIElmIGEgZmllbGREZWYgY29udGFpbnMgYSBmaWVsZCwgd2UgbmVlZCB0eXBlLlxuICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiBub3JtYWxpemVGaWVsZERlZihjaGFubmVsRGVmLCBjaGFubmVsKTtcbiAgfSBlbHNlIGlmIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmNoYW5uZWxEZWYsXG4gICAgICAvLyBOZWVkIHRvIGNhc3QgYXMgbm9ybWFsaXplRmllbGREZWYgbm9ybWFsbHkgcmV0dXJuIEZpZWxkRGVmLCBidXQgaGVyZSB3ZSBrbm93IHRoYXQgaXQgaXMgZGVmaW5pdGVseSBDb25kaXRpb248RmllbGREZWY+XG4gICAgICBjb25kaXRpb246IG5vcm1hbGl6ZUZpZWxkRGVmKGNoYW5uZWxEZWYuY29uZGl0aW9uLCBjaGFubmVsKSBhcyBDb25kaXRpb25hbDxGaWVsZERlZjxzdHJpbmc+PlxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGNoYW5uZWxEZWY7XG59XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgLy8gRHJvcCBpbnZhbGlkIGFnZ3JlZ2F0ZVxuICBpZiAoZmllbGREZWYuYWdncmVnYXRlICYmICFpc0FnZ3JlZ2F0ZU9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpIHtcbiAgICBjb25zdCB7YWdncmVnYXRlLCAuLi5maWVsZERlZldpdGhvdXRBZ2dyZWdhdGV9ID0gZmllbGREZWY7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuaW52YWxpZEFnZ3JlZ2F0ZShmaWVsZERlZi5hZ2dyZWdhdGUpKTtcbiAgICBmaWVsZERlZiA9IGZpZWxkRGVmV2l0aG91dEFnZ3JlZ2F0ZTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBUaW1lIFVuaXRcbiAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgZmllbGREZWYgPSB7XG4gICAgICAuLi5maWVsZERlZixcbiAgICAgIHRpbWVVbml0OiBub3JtYWxpemVUaW1lVW5pdChmaWVsZERlZi50aW1lVW5pdClcbiAgICB9O1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJpblxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgZmllbGREZWYgPSB7XG4gICAgICAuLi5maWVsZERlZixcbiAgICAgIGJpbjogbm9ybWFsaXplQmluKGZpZWxkRGVmLmJpbiwgY2hhbm5lbClcbiAgICB9O1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIFR5cGVcbiAgaWYgKGZpZWxkRGVmLnR5cGUpIHtcbiAgICBjb25zdCBmdWxsVHlwZSA9IGdldEZ1bGxOYW1lKGZpZWxkRGVmLnR5cGUpO1xuICAgIGlmIChmaWVsZERlZi50eXBlICE9PSBmdWxsVHlwZSkge1xuICAgICAgLy8gY29udmVydCBzaG9ydCB0eXBlIHRvIGZ1bGwgdHlwZVxuICAgICAgZmllbGREZWYgPSB7XG4gICAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgICB0eXBlOiBmdWxsVHlwZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGZpZWxkRGVmLnR5cGUgIT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgICBpZiAoaXNDb3VudGluZ0FnZ3JlZ2F0ZU9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuaW52YWxpZEZpZWxkVHlwZUZvckNvdW50QWdncmVnYXRlKGZpZWxkRGVmLnR5cGUsIGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpO1xuICAgICAgICBmaWVsZERlZiA9IHtcbiAgICAgICAgICAuLi5maWVsZERlZixcbiAgICAgICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJZiB0eXBlIGlzIGVtcHR5IC8gaW52YWxpZCwgdGhlbiBhdWdtZW50IHdpdGggZGVmYXVsdCB0eXBlXG4gICAgY29uc3QgbmV3VHlwZSA9IGRlZmF1bHRUeXBlKGZpZWxkRGVmLCBjaGFubmVsKTtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5lbXB0eU9ySW52YWxpZEZpZWxkVHlwZShmaWVsZERlZi50eXBlLCBjaGFubmVsLCBuZXdUeXBlKSk7XG4gICAgZmllbGREZWYgPSB7XG4gICAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgdHlwZTogbmV3VHlwZVxuICAgIH07XG4gIH1cblxuICBjb25zdCB7Y29tcGF0aWJsZSwgd2FybmluZ30gPSBjaGFubmVsQ29tcGF0aWJpbGl0eShmaWVsZERlZiwgY2hhbm5lbCk7XG4gIGlmICghY29tcGF0aWJsZSkge1xuICAgIGxvZy53YXJuKHdhcm5pbmcpO1xuICB9XG4gIHJldHVybiBmaWVsZERlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUJpbihiaW46IEJpblBhcmFtc3xib29sZWFuLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGlmIChpc0Jvb2xlYW4oYmluKSkge1xuICAgIHJldHVybiB7bWF4YmluczogYXV0b01heEJpbnMoY2hhbm5lbCl9O1xuICB9IGVsc2UgaWYgKCFiaW4ubWF4YmlucyAmJiAhYmluLnN0ZXApIHtcbiAgICByZXR1cm4gey4uLmJpbiwgbWF4YmluczogYXV0b01heEJpbnMoY2hhbm5lbCl9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBiaW47XG4gIH1cbn1cblxuY29uc3QgQ09NUEFUSUJMRSA9IHtjb21wYXRpYmxlOiB0cnVlfTtcbmV4cG9ydCBmdW5jdGlvbiBjaGFubmVsQ29tcGF0aWJpbGl0eShmaWVsZERlZjogRmllbGREZWY8RmllbGQ+LCBjaGFubmVsOiBDaGFubmVsKToge2NvbXBhdGlibGU6IGJvb2xlYW47IHdhcm5pbmc/OiBzdHJpbmc7fSB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgJ3Jvdyc6XG4gICAgY2FzZSAnY29sdW1uJzpcbiAgICAgIGlmIChpc0NvbnRpbnVvdXMoZmllbGREZWYpICYmICFmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICAvLyBUT0RPOihodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzIwMTEpOlxuICAgICAgICAvLyB3aXRoIHRpbWVVbml0IGl0J3Mgbm90IGFsd2F5cyBzdHJpY3RseSBjb250aW51b3VzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogbG9nLm1lc3NhZ2UuZmFjZXRDaGFubmVsU2hvdWxkQmVEaXNjcmV0ZShjaGFubmVsKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICd4JzpcbiAgICBjYXNlICd5JzpcbiAgICBjYXNlICdjb2xvcic6XG4gICAgY2FzZSAndGV4dCc6XG4gICAgY2FzZSAnZGV0YWlsJzpcbiAgICBjYXNlICd0b29sdGlwJzpcbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgY2FzZSAnc2l6ZSc6XG4gICAgY2FzZSAneDInOlxuICAgIGNhc2UgJ3kyJzpcbiAgICAgIGlmIChpc0Rpc2NyZXRlKGZpZWxkRGVmKSAmJiAhZmllbGREZWYuYmluKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogYENoYW5uZWwgJHtjaGFubmVsfSBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCBkaXNjcmV0ZSBmaWVsZC5gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ3NoYXBlJzpcbiAgICAgIGlmIChmaWVsZERlZi50eXBlICE9PSAnbm9taW5hbCcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiAnU2hhcGUgY2hhbm5lbCBzaG91bGQgYmUgdXNlZCB3aXRoIG5vbWluYWwgZGF0YSBvbmx5J1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICdvcmRlcic6XG4gICAgICBpZiAoZmllbGREZWYudHlwZSA9PT0gJ25vbWluYWwnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogYENoYW5uZWwgb3JkZXIgaXMgaW5hcHByb3ByaWF0ZSBmb3Igbm9taW5hbCBmaWVsZCwgd2hpY2ggaGFzIG5vIGluaGVyZW50IG9yZGVyLmBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignY2hhbm5lbENvbXBhdGFiaWxpdHkgbm90IGltcGxlbWVudGVkIGZvciBjaGFubmVsICcgKyBjaGFubmVsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPGFueT4pIHtcbiAgcmV0dXJuIGZpZWxkRGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnIHx8ICEhZmllbGREZWYuYmluO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUaW1lRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPGFueT4pIHtcbiAgcmV0dXJuIGZpZWxkRGVmLnR5cGUgPT09ICd0ZW1wb3JhbCcgfHwgISFmaWVsZERlZi50aW1lVW5pdDtcbn1cbiJdfQ==