"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
    return tslib_1.__assign({}, (timeUnit ? { timeUnit: timeUnit } : {}), (bin ? { bin: bin } : {}), (aggregate ? { aggregate: aggregate } : {}), { field: field });
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
        case 'flexible': // color
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
        return tslib_1.__assign({}, channelDef, { 
            // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
            condition: normalizeFieldDef(channelDef.condition, channel) });
    }
    return channelDef;
}
exports.normalize = normalize;
function normalizeFieldDef(fieldDef, channel) {
    // Drop invalid aggregate
    if (fieldDef.aggregate && !aggregate_1.isAggregateOp(fieldDef.aggregate)) {
        var aggregate = fieldDef.aggregate, fieldDefWithoutAggregate = tslib_1.__rest(fieldDef, ["aggregate"]);
        log.warn(log.message.invalidAggregate(fieldDef.aggregate));
        fieldDef = fieldDefWithoutAggregate;
    }
    // Normalize Time Unit
    if (fieldDef.timeUnit) {
        fieldDef = tslib_1.__assign({}, fieldDef, { timeUnit: timeunit_1.normalizeTimeUnit(fieldDef.timeUnit) });
    }
    // Normalize bin
    if (fieldDef.bin) {
        fieldDef = tslib_1.__assign({}, fieldDef, { bin: normalizeBin(fieldDef.bin, channel) });
    }
    // Normalize Type
    if (fieldDef.type) {
        var fullType = type_1.getFullName(fieldDef.type);
        if (fieldDef.type !== fullType) {
            // convert short type to full type
            fieldDef = tslib_1.__assign({}, fieldDef, { type: fullType });
        }
        if (fieldDef.type !== 'quantitative') {
            if (aggregate_1.isCountingAggregateOp(fieldDef.aggregate)) {
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
exports.normalizeFieldDef = normalizeFieldDef;
function normalizeBin(bin, channel) {
    if (vega_util_1.isBoolean(bin)) {
        return { maxbins: bin_1.autoMaxBins(channel) };
    }
    else if (!bin.maxbins && !bin.step) {
        return tslib_1.__assign({}, bin, { maxbins: bin_1.autoMaxBins(channel) });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRkZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsdUNBQWlFO0FBQ2pFLHlDQUFpRTtBQUVqRSw2QkFBMEQ7QUFDMUQscUNBQTZDO0FBSzdDLDJCQUE2QjtBQU03Qix1Q0FBeUU7QUFDekUsK0JBQXVEO0FBQ3ZELCtCQUE2QztBQStCN0MsZ0NBQTBDLENBQWlCO0lBQ3pELE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCx3REFFQztBQWdERCxxQkFBNEIsS0FBWTtJQUN0QyxPQUFPLEtBQUssSUFBSSxDQUFDLG9CQUFRLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxJQUFJLEtBQUssQ0FBQztBQUN4RCxDQUFDO0FBRkQsa0NBRUM7QUFnREQsd0JBQStCLFFBQTBCO0lBQ2hELElBQUEsc0JBQUssRUFBRSw0QkFBUSxFQUFFLGtCQUFHLEVBQUUsOEJBQVMsQ0FBYTtJQUNuRCw0QkFDSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxRQUFRLFVBQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDNUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxLQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ2xCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFDLFNBQVMsV0FBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUNqQyxLQUFLLE9BQUEsSUFDTDtBQUNKLENBQUM7QUFSRCx3Q0FRQztBQWlHRCwwQkFBb0MsVUFBeUI7SUFDM0QsT0FBTyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQ2hELENBQUM7QUFGRCw0Q0FFQztBQUVEOztHQUVHO0FBQ0gsZ0NBQTBDLFVBQXlCO0lBQ2pFLE9BQU8sQ0FB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QUN0RCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEtBQUssY0FBYyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQzVELENBQUM7QUFGRCw0Q0FFQztBQUVELHdCQUErQixRQUF1QjtJQUNwRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0FBQzdELENBQUM7QUFGRCx3Q0FFQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIERlY2xhcmF0aW9uIGFuZCB1dGlsaXR5IGZvciB2YXJpYW50cyBvZiBhIGZpZWxkIGRlZmluaXRpb24gb2JqZWN0XG5pbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcbmltcG9ydCB7aXNBcnJheSwgaXNCb29sZWFuLCBpc051bWJlciwgaXNTdHJpbmd9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge2lzQWdncmVnYXRlT3AsIGlzQ291bnRpbmdBZ2dyZWdhdGVPcH0gZnJvbSAnLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtBeGlzfSBmcm9tICcuL2F4aXMnO1xuaW1wb3J0IHthdXRvTWF4QmlucywgQmluUGFyYW1zLCBiaW5Ub1N0cmluZ30gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDaGFubmVsLCByYW5nZVR5cGV9IGZyb20gJy4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbXBvc2l0ZUFnZ3JlZ2F0ZX0gZnJvbSAnLi9jb21wb3NpdGVtYXJrJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge1RpdGxlTWl4aW5zfSBmcm9tICcuL2d1aWRlJztcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2cnO1xuaW1wb3J0IHtMb2dpY2FsT3BlcmFuZH0gZnJvbSAnLi9sb2dpY2FsJztcbmltcG9ydCB7UHJlZGljYXRlfSBmcm9tICcuL3ByZWRpY2F0ZSc7XG5pbXBvcnQge1NjYWxlfSBmcm9tICcuL3NjYWxlJztcbmltcG9ydCB7U29ydEZpZWxkLCBTb3J0T3JkZXJ9IGZyb20gJy4vc29ydCc7XG5pbXBvcnQge1N0YWNrT2Zmc2V0fSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7Z2V0VGltZVVuaXRQYXJ0cywgbm9ybWFsaXplVGltZVVuaXQsIFRpbWVVbml0fSBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCB7Z2V0RnVsbE5hbWUsIFFVQU5USVRBVElWRSwgVHlwZX0gZnJvbSAnLi90eXBlJztcbmltcG9ydCB7YWNjZXNzUGF0aCwgdGl0bGVjYXNlfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIERlZmluaXRpb24gb2JqZWN0IGZvciBhIGNvbnN0YW50IHZhbHVlIG9mIGFuIGVuY29kaW5nIGNoYW5uZWwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVEZWYge1xuICAvKipcbiAgICogQSBjb25zdGFudCB2YWx1ZSBpbiB2aXN1YWwgZG9tYWluIChlLmcuLCBgXCJyZWRcImAgLyBcIiMwMDk5ZmZcIiBmb3IgY29sb3IsIHZhbHVlcyBiZXR3ZWVuIGAwYCB0byBgMWAgZm9yIG9wYWNpdHkpLlxuICAgKi9cbiAgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW47XG59XG5cbi8qKlxuICogR2VuZXJpYyB0eXBlIGZvciBjb25kaXRpb25hbCBjaGFubmVsRGVmLlxuICogRiBkZWZpbmVzIHRoZSB1bmRlcmx5aW5nIEZpZWxkRGVmIHR5cGUuXG4gKi9cbmV4cG9ydCB0eXBlIENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiA9IEZpZWxkRGVmV2l0aENvbmRpdGlvbjxGPiB8IFZhbHVlRGVmV2l0aENvbmRpdGlvbjxGPjtcblxuZXhwb3J0IHR5cGUgQ29uZGl0aW9uYWw8VD4gPSBDb25kaXRpb25hbFByZWRpY2F0ZTxUPiB8IENvbmRpdGlvbmFsU2VsZWN0aW9uPFQ+O1xuXG5leHBvcnQgdHlwZSBDb25kaXRpb25hbFByZWRpY2F0ZTxUPiA9IHtcbiAgdGVzdDogTG9naWNhbE9wZXJhbmQ8UHJlZGljYXRlPjtcbn0gJiBUO1xuXG5leHBvcnQgdHlwZSBDb25kaXRpb25hbFNlbGVjdGlvbjxUPiA9IHtcbiAgLyoqXG4gICAqIEEgW3NlbGVjdGlvbiBuYW1lXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NlbGVjdGlvbi5odG1sKSwgb3IgYSBzZXJpZXMgb2YgW2NvbXBvc2VkIHNlbGVjdGlvbnNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2VsZWN0aW9uLmh0bWwjY29tcG9zZSkuXG4gICAqL1xuICBzZWxlY3Rpb246IExvZ2ljYWxPcGVyYW5kPHN0cmluZz47XG59ICYgVDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29uZGl0aW9uYWxTZWxlY3Rpb248VD4oYzogQ29uZGl0aW9uYWw8VD4pOiBjIGlzIENvbmRpdGlvbmFsU2VsZWN0aW9uPFQ+IHtcbiAgcmV0dXJuIGNbJ3NlbGVjdGlvbiddO1xufVxuXG4vKipcbiAqIEEgRmllbGREZWYgd2l0aCBDb25kaXRpb248VmFsdWVEZWY+XG4gKiB7XG4gKiAgIGNvbmRpdGlvbjoge3ZhbHVlOiAuLi59LFxuICogICBmaWVsZDogLi4uLFxuICogICAuLi5cbiAqIH1cbiAqL1xuZXhwb3J0IHR5cGUgRmllbGREZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiA9IEYgJiB7XG4gIC8qKlxuICAgKiBPbmUgb3IgbW9yZSB2YWx1ZSBkZWZpbml0aW9uKHMpIHdpdGggYSBzZWxlY3Rpb24gcHJlZGljYXRlLlxuICAgKlxuICAgKiBfX05vdGU6X18gQSBmaWVsZCBkZWZpbml0aW9uJ3MgYGNvbmRpdGlvbmAgcHJvcGVydHkgY2FuIG9ubHkgY29udGFpbiBbdmFsdWUgZGVmaW5pdGlvbnNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvZW5jb2RpbmcuaHRtbCN2YWx1ZS1kZWYpXG4gICAqIHNpbmNlIFZlZ2EtTGl0ZSBvbmx5IGFsbG93cyBhdCBtb3N0IG9uZSBlbmNvZGVkIGZpZWxkIHBlciBlbmNvZGluZyBjaGFubmVsLlxuICAgKi9cbiAgY29uZGl0aW9uPzogQ29uZGl0aW9uYWw8VmFsdWVEZWY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+W107XG59O1xuXG4vKipcbiAqIEEgVmFsdWVEZWYgd2l0aCBDb25kaXRpb248VmFsdWVEZWYgfCBGaWVsZERlZj5cbiAqIHtcbiAqICAgY29uZGl0aW9uOiB7ZmllbGQ6IC4uLn0gfCB7dmFsdWU6IC4uLn0sXG4gKiAgIHZhbHVlOiAuLi4sXG4gKiB9XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsdWVEZWZXaXRoQ29uZGl0aW9uPEYgZXh0ZW5kcyBGaWVsZERlZjxhbnk+PiB7XG4gIC8qKlxuICAgKiBBIGZpZWxkIGRlZmluaXRpb24gb3Igb25lIG9yIG1vcmUgdmFsdWUgZGVmaW5pdGlvbihzKSB3aXRoIGEgc2VsZWN0aW9uIHByZWRpY2F0ZS5cbiAgICovXG4gIGNvbmRpdGlvbj86IENvbmRpdGlvbmFsPEY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+W107XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgdmFsdWUgaW4gdmlzdWFsIGRvbWFpbi5cbiAgICovXG4gIHZhbHVlPzogbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gYSByZXBlYXRlZCB2YWx1ZS5cbiAqL1xuZXhwb3J0IHR5cGUgUmVwZWF0UmVmID0ge1xuICByZXBlYXQ6ICdyb3cnIHwgJ2NvbHVtbidcbn07XG5cbmV4cG9ydCB0eXBlIEZpZWxkID0gc3RyaW5nIHwgUmVwZWF0UmVmO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXBlYXRSZWYoZmllbGQ6IEZpZWxkKTogZmllbGQgaXMgUmVwZWF0UmVmIHtcbiAgcmV0dXJuIGZpZWxkICYmICFpc1N0cmluZyhmaWVsZCkgJiYgJ3JlcGVhdCcgaW4gZmllbGQ7XG59XG5cbi8qKiBAaGlkZSAqL1xuZXhwb3J0IHR5cGUgSGlkZGVuQ29tcG9zaXRlQWdncmVnYXRlID0gQ29tcG9zaXRlQWdncmVnYXRlO1xuXG5leHBvcnQgdHlwZSBBZ2dyZWdhdGUgPSBBZ2dyZWdhdGVPcCB8IEhpZGRlbkNvbXBvc2l0ZUFnZ3JlZ2F0ZTtcblxuZXhwb3J0IGludGVyZmFjZSBGaWVsZERlZkJhc2U8Rj4ge1xuXG4gIC8qKlxuICAgKiBfX1JlcXVpcmVkLl9fIEEgc3RyaW5nIGRlZmluaW5nIHRoZSBuYW1lIG9mIHRoZSBmaWVsZCBmcm9tIHdoaWNoIHRvIHB1bGwgYSBkYXRhIHZhbHVlXG4gICAqIG9yIGFuIG9iamVjdCBkZWZpbmluZyBpdGVyYXRlZCB2YWx1ZXMgZnJvbSB0aGUgW2ByZXBlYXRgXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3JlcGVhdC5odG1sKSBvcGVyYXRvci5cbiAgICpcbiAgICogX19Ob3RlOl9fIERvdHMgKGAuYCkgYW5kIGJyYWNrZXRzIChgW2AgYW5kIGBdYCkgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIG5lc3RlZCBvYmplY3RzIChlLmcuLCBgXCJmaWVsZFwiOiBcImZvby5iYXJcImAgYW5kIGBcImZpZWxkXCI6IFwiZm9vWydiYXInXVwiYCkuXG4gICAqIElmIGZpZWxkIG5hbWVzIGNvbnRhaW4gZG90cyBvciBicmFja2V0cyBidXQgYXJlIG5vdCBuZXN0ZWQsIHlvdSBjYW4gdXNlIGBcXFxcYCB0byBlc2NhcGUgZG90cyBhbmQgYnJhY2tldHMgKGUuZy4sIGBcImFcXFxcLmJcImAgYW5kIGBcImFcXFxcWzBcXFxcXVwiYCkuXG4gICAqIFNlZSBtb3JlIGRldGFpbHMgYWJvdXQgZXNjYXBpbmcgaW4gdGhlIFtmaWVsZCBkb2N1bWVudGF0aW9uXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2ZpZWxkLmh0bWwpLlxuICAgKlxuICAgKiBfX05vdGU6X18gYGZpZWxkYCBpcyBub3QgcmVxdWlyZWQgaWYgYGFnZ3JlZ2F0ZWAgaXMgYGNvdW50YC5cbiAgICovXG4gIGZpZWxkPzogRjtcblxuICAvLyBmdW5jdGlvblxuXG4gIC8qKlxuICAgKiBUaW1lIHVuaXQgKGUuZy4sIGB5ZWFyYCwgYHllYXJtb250aGAsIGBtb250aGAsIGBob3Vyc2ApIGZvciBhIHRlbXBvcmFsIGZpZWxkLlxuICAgKiBvciBbYSB0ZW1wb3JhbCBmaWVsZCB0aGF0IGdldHMgY2FzdGVkIGFzIG9yZGluYWxdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvdHlwZS5odG1sI2Nhc3QpLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYHVuZGVmaW5lZGAgKE5vbmUpXG4gICAqL1xuICB0aW1lVW5pdD86IFRpbWVVbml0O1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgZm9yIGJpbm5pbmcgYSBgcXVhbnRpdGF0aXZlYCBmaWVsZCwgb3IgW2FuIG9iamVjdCBkZWZpbmluZyBiaW5uaW5nIHBhcmFtZXRlcnNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvYmluLmh0bWwjcGFyYW1zKS5cbiAgICogSWYgYHRydWVgLCBkZWZhdWx0IFtiaW5uaW5nIHBhcmFtZXRlcnNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvYmluLmh0bWwpIHdpbGwgYmUgYXBwbGllZC5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGBmYWxzZWBcbiAgICovXG4gIGJpbj86IGJvb2xlYW4gfCBCaW5QYXJhbXM7XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0aW9uIGZ1bmN0aW9uIGZvciB0aGUgZmllbGRcbiAgICogKGUuZy4sIGBtZWFuYCwgYHN1bWAsIGBtZWRpYW5gLCBgbWluYCwgYG1heGAsIGBjb3VudGApLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYHVuZGVmaW5lZGAgKE5vbmUpXG4gICAqL1xuICBhZ2dyZWdhdGU/OiBBZ2dyZWdhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0ZpZWxkRGVmQmFzZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPik6IEZpZWxkRGVmQmFzZTxzdHJpbmc+IHtcbiAgY29uc3Qge2ZpZWxkLCB0aW1lVW5pdCwgYmluLCBhZ2dyZWdhdGV9ID0gZmllbGREZWY7XG4gIHJldHVybiB7XG4gICAgLi4uKHRpbWVVbml0ID8ge3RpbWVVbml0fSA6IHt9KSxcbiAgICAuLi4oYmluID8ge2Jpbn0gOiB7fSksXG4gICAgLi4uKGFnZ3JlZ2F0ZSA/IHthZ2dyZWdhdGV9IDoge30pLFxuICAgIGZpZWxkXG4gIH07XG59XG5cbi8qKlxuICogIERlZmluaXRpb24gb2JqZWN0IGZvciBhIGRhdGEgZmllbGQsIGl0cyB0eXBlIGFuZCB0cmFuc2Zvcm1hdGlvbiBvZiBhbiBlbmNvZGluZyBjaGFubmVsLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpZWxkRGVmPEY+IGV4dGVuZHMgRmllbGREZWZCYXNlPEY+LCBUaXRsZU1peGlucyB7XG4gIC8qKlxuICAgKiBUaGUgZW5jb2RlZCBmaWVsZCdzIHR5cGUgb2YgbWVhc3VyZW1lbnQgKGBcInF1YW50aXRhdGl2ZVwiYCwgYFwidGVtcG9yYWxcImAsIGBcIm9yZGluYWxcImAsIG9yIGBcIm5vbWluYWxcImApLlxuICAgKiBJdCBjYW4gYWxzbyBiZSBhIGBcImdlb2pzb25cImAgdHlwZSBmb3IgZW5jb2RpbmcgWydnZW9zaGFwZSddKGdlb3NoYXBlLmh0bWwpLlxuICAgKi9cbiAgLy8gKiBvciBhbiBpbml0aWFsIGNoYXJhY3RlciBvZiB0aGUgdHlwZSBuYW1lIChgXCJRXCJgLCBgXCJUXCJgLCBgXCJPXCJgLCBgXCJOXCJgKS5cbiAgLy8gKiBUaGlzIHByb3BlcnR5IGlzIGNhc2UtaW5zZW5zaXRpdmUuXG4gIHR5cGU6IFR5cGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NhbGVGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIHRoZSBjaGFubmVsJ3Mgc2NhbGUsIHdoaWNoIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHRyYW5zZm9ybXMgdmFsdWVzIGluIHRoZSBkYXRhIGRvbWFpbiAobnVtYmVycywgZGF0ZXMsIHN0cmluZ3MsIGV0YykgdG8gdmlzdWFsIHZhbHVlcyAocGl4ZWxzLCBjb2xvcnMsIHNpemVzKSBvZiB0aGUgZW5jb2RpbmcgY2hhbm5lbHMuXG4gICAqXG4gICAqIElmIGBudWxsYCwgdGhlIHNjYWxlIHdpbGwgYmUgW2Rpc2FibGVkIGFuZCB0aGUgZGF0YSB2YWx1ZSB3aWxsIGJlIGRpcmVjdGx5IGVuY29kZWRdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2NhbGUuaHRtbCNkaXNhYmxlKS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIElmIHVuZGVmaW5lZCwgZGVmYXVsdCBbc2NhbGUgcHJvcGVydGllc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zY2FsZS5odG1sKSBhcmUgYXBwbGllZC5cbiAgICovXG4gIHNjYWxlPzogU2NhbGUgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBTb3J0IG9yZGVyIGZvciB0aGUgZW5jb2RlZCBmaWVsZC5cbiAgICogU3VwcG9ydGVkIGBzb3J0YCB2YWx1ZXMgaW5jbHVkZSBgXCJhc2NlbmRpbmdcImAsIGBcImRlc2NlbmRpbmdcImAsIGBudWxsYCAobm8gc29ydGluZyksIG9yIGFuIGFycmF5IHNwZWNpZnlpbmcgdGhlIHByZWZlcnJlZCBvcmRlciBvZiB2YWx1ZXMuXG4gICAqIEZvciBmaWVsZHMgd2l0aCBkaXNjcmV0ZSBkb21haW5zLCBgc29ydGAgY2FuIGFsc28gYmUgYSBbc29ydCBmaWVsZCBkZWZpbml0aW9uIG9iamVjdF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zb3J0Lmh0bWwjc29ydC1maWVsZCkuXG4gICAqIEZvciBgc29ydGAgYXMgYW4gW2FycmF5IHNwZWNpZnlpbmcgdGhlIHByZWZlcnJlZCBvcmRlciBvZiB2YWx1ZXNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc29ydC5odG1sI3NvcnQtYXJyYXkpLCB0aGUgc29ydCBvcmRlciB3aWxsIG9iZXkgdGhlIHZhbHVlcyBpbiB0aGUgYXJyYXksIGZvbGxvd2VkIGJ5IGFueSB1bnNwZWNpZmllZCB2YWx1ZXMgaW4gdGhlaXIgb3JpZ2luYWwgb3JkZXIuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgXCJhc2NlbmRpbmdcImBcbiAgICovXG4gIHNvcnQ/OiBzdHJpbmdbXSB8IFNvcnRPcmRlciB8IFNvcnRGaWVsZDxGPiB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9zaXRpb25GaWVsZERlZjxGPiBleHRlbmRzIFNjYWxlRmllbGREZWY8Rj4ge1xuICAvKipcbiAgICogQW4gb2JqZWN0IGRlZmluaW5nIHByb3BlcnRpZXMgb2YgYXhpcydzIGdyaWRsaW5lcywgdGlja3MgYW5kIGxhYmVscy5cbiAgICogSWYgYG51bGxgLCB0aGUgYXhpcyBmb3IgdGhlIGVuY29kaW5nIGNoYW5uZWwgd2lsbCBiZSByZW1vdmVkLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gSWYgdW5kZWZpbmVkLCBkZWZhdWx0IFtheGlzIHByb3BlcnRpZXNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvYXhpcy5odG1sKSBhcmUgYXBwbGllZC5cbiAgICovXG4gIGF4aXM/OiBBeGlzIHwgbnVsbDtcblxuICAvKipcbiAgICogVHlwZSBvZiBzdGFja2luZyBvZmZzZXQgaWYgdGhlIGZpZWxkIHNob3VsZCBiZSBzdGFja2VkLlxuICAgKiBgc3RhY2tgIGlzIG9ubHkgYXBwbGljYWJsZSBmb3IgYHhgIGFuZCBgeWAgY2hhbm5lbHMgd2l0aCBjb250aW51b3VzIGRvbWFpbnMuXG4gICAqIEZvciBleGFtcGxlLCBgc3RhY2tgIG9mIGB5YCBjYW4gYmUgdXNlZCB0byBjdXN0b21pemUgc3RhY2tpbmcgZm9yIGEgdmVydGljYWwgYmFyIGNoYXJ0LlxuICAgKlxuICAgKiBgc3RhY2tgIGNhbiBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXM6XG4gICAqIC0gYFwiemVyb1wiYDogc3RhY2tpbmcgd2l0aCBiYXNlbGluZSBvZmZzZXQgYXQgemVybyB2YWx1ZSBvZiB0aGUgc2NhbGUgKGZvciBjcmVhdGluZyB0eXBpY2FsIHN0YWNrZWQgW2Jhcl0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zdGFjay5odG1sI2JhcikgYW5kIFthcmVhXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3N0YWNrLmh0bWwjYXJlYSkgY2hhcnQpLlxuICAgKiAtIGBcIm5vcm1hbGl6ZVwiYCAtIHN0YWNraW5nIHdpdGggbm9ybWFsaXplZCBkb21haW4gKGZvciBjcmVhdGluZyBbbm9ybWFsaXplZCBzdGFja2VkIGJhciBhbmQgYXJlYSBjaGFydHNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3RhY2suaHRtbCNub3JtYWxpemVkKS4gPGJyLz5cbiAgICogLWBcImNlbnRlclwiYCAtIHN0YWNraW5nIHdpdGggY2VudGVyIGJhc2VsaW5lIChmb3IgW3N0cmVhbWdyYXBoXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3N0YWNrLmh0bWwjc3RyZWFtZ3JhcGgpKS5cbiAgICogLSBgbnVsbGAgLSBOby1zdGFja2luZy4gVGhpcyB3aWxsIHByb2R1Y2UgbGF5ZXJlZCBbYmFyXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3N0YWNrLmh0bWwjbGF5ZXJlZC1iYXItY2hhcnQpIGFuZCBhcmVhIGNoYXJ0LlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYHplcm9gIGZvciBwbG90cyB3aXRoIGFsbCBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIHRydWU6XG4gICAqICgxKSB0aGUgbWFyayBpcyBgYmFyYCBvciBgYXJlYWA7XG4gICAqICgyKSB0aGUgc3RhY2tlZCBtZWFzdXJlIGNoYW5uZWwgKHggb3IgeSkgaGFzIGEgbGluZWFyIHNjYWxlO1xuICAgKiAoMykgQXQgbGVhc3Qgb25lIG9mIG5vbi1wb3NpdGlvbiBjaGFubmVscyBtYXBwZWQgdG8gYW4gdW5hZ2dyZWdhdGVkIGZpZWxkIHRoYXQgaXMgZGlmZmVyZW50IGZyb20geCBhbmQgeS4gIE90aGVyd2lzZSwgYG51bGxgIGJ5IGRlZmF1bHQuXG4gICAqL1xuICBzdGFjaz86IFN0YWNrT2Zmc2V0IHwgbnVsbDtcbn1cblxuLyoqXG4gKiBGaWVsZCBkZWZpbml0aW9uIG9mIGEgbWFyayBwcm9wZXJ0eSwgd2hpY2ggY2FuIGNvbnRhaW4gYSBsZWdlbmQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWFya1Byb3BGaWVsZERlZjxGPiBleHRlbmRzIFNjYWxlRmllbGREZWY8Rj4ge1xuICAgLyoqXG4gICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiB0aGUgbGVnZW5kLlxuICAgICogSWYgYG51bGxgLCB0aGUgbGVnZW5kIGZvciB0aGUgZW5jb2RpbmcgY2hhbm5lbCB3aWxsIGJlIHJlbW92ZWQuXG4gICAgKlxuICAgICogX19EZWZhdWx0IHZhbHVlOl9fIElmIHVuZGVmaW5lZCwgZGVmYXVsdCBbbGVnZW5kIHByb3BlcnRpZXNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvbGVnZW5kLmh0bWwpIGFyZSBhcHBsaWVkLlxuICAgICovXG4gIGxlZ2VuZD86IExlZ2VuZCB8IG51bGw7XG59XG5cbi8vIERldGFpbFxuXG4vLyBPcmRlciBQYXRoIGhhdmUgbm8gc2NhbGVcblxuZXhwb3J0IGludGVyZmFjZSBPcmRlckZpZWxkRGVmPEY+IGV4dGVuZHMgRmllbGREZWY8Rj4ge1xuICAvKipcbiAgICogVGhlIHNvcnQgb3JkZXIuIE9uZSBvZiBgXCJhc2NlbmRpbmdcImAgKGRlZmF1bHQpIG9yIGBcImRlc2NlbmRpbmdcImAuXG4gICAqL1xuICBzb3J0PzogU29ydE9yZGVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRleHRGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIFRoZSBbZm9ybWF0dGluZyBwYXR0ZXJuXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2Zvcm1hdC5odG1sKSBmb3IgYSB0ZXh0IGZpZWxkLiBJZiBub3QgZGVmaW5lZCwgdGhpcyB3aWxsIGJlIGRldGVybWluZWQgYXV0b21hdGljYWxseS5cbiAgICovXG4gIGZvcm1hdD86IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgQ2hhbm5lbERlZjxGPiA9IENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uPEZpZWxkRGVmPEY+PjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29uZGl0aW9uYWxEZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgQ2hhbm5lbERlZldpdGhDb25kaXRpb248RmllbGREZWY8Rj4+IHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAhIWNoYW5uZWxEZWYuY29uZGl0aW9uO1xufVxuXG4vKipcbiAqIFJldHVybiBpZiBhIGNoYW5uZWxEZWYgaXMgYSBDb25kaXRpb25hbFZhbHVlRGVmIHdpdGggQ29uZGl0aW9uRmllbGREZWZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0NvbmRpdGlvbmFsRmllbGREZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgKFZhbHVlRGVmICYge2NvbmRpdGlvbjogQ29uZGl0aW9uYWw8RmllbGREZWY8Rj4+fSkge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICEhY2hhbm5lbERlZi5jb25kaXRpb24gJiYgIWlzQXJyYXkoY2hhbm5lbERlZi5jb25kaXRpb24pICYmIGlzRmllbGREZWYoY2hhbm5lbERlZi5jb25kaXRpb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzQ29uZGl0aW9uYWxWYWx1ZURlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyAoVmFsdWVEZWYgJiB7Y29uZGl0aW9uOiBDb25kaXRpb25hbDxWYWx1ZURlZj4gfCBDb25kaXRpb25hbDxWYWx1ZURlZj5bXX0pIHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAhIWNoYW5uZWxEZWYuY29uZGl0aW9uICYmIChcbiAgICBpc0FycmF5KGNoYW5uZWxEZWYuY29uZGl0aW9uKSB8fCBpc1ZhbHVlRGVmKGNoYW5uZWxEZWYuY29uZGl0aW9uKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGaWVsZERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyBGaWVsZERlZjxGPiB8IFBvc2l0aW9uRmllbGREZWY8Rj4gfCBTY2FsZUZpZWxkRGVmPEY+IHwgTWFya1Byb3BGaWVsZERlZjxGPiB8IE9yZGVyRmllbGREZWY8Rj4gfCBUZXh0RmllbGREZWY8Rj4ge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICghIWNoYW5uZWxEZWZbJ2ZpZWxkJ10gfHwgY2hhbm5lbERlZlsnYWdncmVnYXRlJ10gPT09ICdjb3VudCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmdGaWVsZERlZihmaWVsZERlZjogQ2hhbm5lbERlZjxzdHJpbmd8UmVwZWF0UmVmPik6IGZpZWxkRGVmIGlzIEZpZWxkRGVmPHN0cmluZz4ge1xuICByZXR1cm4gaXNGaWVsZERlZihmaWVsZERlZikgJiYgaXNTdHJpbmcoZmllbGREZWYuZmllbGQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWx1ZURlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyBWYWx1ZURlZiB7XG4gIHJldHVybiBjaGFubmVsRGVmICYmICd2YWx1ZScgaW4gY2hhbm5lbERlZiAmJiBjaGFubmVsRGVmWyd2YWx1ZSddICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NjYWxlRmllbGREZWYoY2hhbm5lbERlZjogQ2hhbm5lbERlZjxhbnk+KTogY2hhbm5lbERlZiBpcyBTY2FsZUZpZWxkRGVmPGFueT4ge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICghIWNoYW5uZWxEZWZbJ3NjYWxlJ10gfHwgISFjaGFubmVsRGVmWydzb3J0J10pO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZpZWxkUmVmT3B0aW9uIHtcbiAgLyoqIGV4Y2x1ZGUgYmluLCBhZ2dyZWdhdGUsIHRpbWVVbml0ICovXG4gIG5vZm4/OiBib29sZWFuO1xuICAvKiogV3JhcCB0aGUgZmllbGQgd2l0aCBkYXR1bSBvciBwYXJlbnQgKGUuZy4sIGRhdHVtWycuLi4nXSBmb3IgVmVnYSBFeHByZXNzaW9uICovXG4gIGV4cHI/OiAnZGF0dW0nIHwgJ3BhcmVudCc7XG4gIC8qKiBwcmVwZW5kIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeCAqL1xuICBwcmVmaXg/OiBzdHJpbmc7XG4gIC8qKiBhcHBlbmQgc3VmZml4IHRvIHRoZSBmaWVsZCByZWYgZm9yIGJpbiAoZGVmYXVsdD0nc3RhcnQnKSAqL1xuICBiaW5TdWZmaXg/OiAnZW5kJyB8ICdyYW5nZScgfCAnbWlkJztcbiAgLyoqIGFwcGVuZCBzdWZmaXggdG8gdGhlIGZpZWxkIHJlZiAoZ2VuZXJhbCkgKi9cbiAgc3VmZml4Pzogc3RyaW5nO1xuICAvKiogT3ZlcnJyaWRlIHdoaWNoIGFnZ3JlZ2F0ZSB0byB1c2UuIE5lZWRlZCBmb3IgdW5hZ2dyZWdhdGVkIGRvbWFpbi4gKi9cbiAgYWdncmVnYXRlPzogQWdncmVnYXRlT3A7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2Z0ZpZWxkKGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8c3RyaW5nPiwgb3B0OiBGaWVsZFJlZk9wdGlvbiA9IHt9KTogc3RyaW5nIHtcbiAgbGV0IGZpZWxkID0gZmllbGREZWYuZmllbGQ7XG4gIGNvbnN0IHByZWZpeCA9IG9wdC5wcmVmaXg7XG4gIGxldCBzdWZmaXggPSBvcHQuc3VmZml4O1xuXG4gIGlmIChpc0NvdW50KGZpZWxkRGVmKSkge1xuICAgIGZpZWxkID0gJ2NvdW50XyonO1xuICB9IGVsc2Uge1xuICAgIGxldCBmbjogc3RyaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFvcHQubm9mbikge1xuICAgICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgICBmbiA9IGJpblRvU3RyaW5nKGZpZWxkRGVmLmJpbik7XG4gICAgICAgIHN1ZmZpeCA9IG9wdC5iaW5TdWZmaXggfHwgJyc7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICBmbiA9IFN0cmluZyhvcHQuYWdncmVnYXRlIHx8IGZpZWxkRGVmLmFnZ3JlZ2F0ZSk7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIGZuID0gU3RyaW5nKGZpZWxkRGVmLnRpbWVVbml0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm4pIHtcbiAgICAgIGZpZWxkID0gYCR7Zm59XyR7ZmllbGR9YDtcbiAgICB9XG4gIH1cblxuICBpZiAoc3VmZml4KSB7XG4gICAgZmllbGQgPSBgJHtmaWVsZH1fJHtzdWZmaXh9YDtcbiAgfVxuXG4gIGlmIChwcmVmaXgpIHtcbiAgICBmaWVsZCA9IGAke3ByZWZpeH1fJHtmaWVsZH1gO1xuICB9XG5cbiAgaWYgKG9wdC5leHByKSB7XG4gICAgZmllbGQgPSBgJHtvcHQuZXhwcn0ke2FjY2Vzc1BhdGgoZmllbGQpfWA7XG4gIH1cblxuICByZXR1cm4gZmllbGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Rpc2NyZXRlKGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4pIHtcbiAgc3dpdGNoIChmaWVsZERlZi50eXBlKSB7XG4gICAgY2FzZSAnbm9taW5hbCc6XG4gICAgY2FzZSAnb3JkaW5hbCc6XG4gICAgY2FzZSAnZ2VvanNvbic6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlICdxdWFudGl0YXRpdmUnOlxuICAgICAgcmV0dXJuICEhZmllbGREZWYuYmluO1xuICAgIGNhc2UgJ2xhdGl0dWRlJzpcbiAgICBjYXNlICdsb25naXR1ZGUnOlxuICAgIGNhc2UgJ3RlbXBvcmFsJzpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuaW52YWxpZEZpZWxkVHlwZShmaWVsZERlZi50eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbnRpbnVvdXMoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPikge1xuICByZXR1cm4gIWlzRGlzY3JldGUoZmllbGREZWYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb3VudChmaWVsZERlZjogRmllbGREZWZCYXNlPEZpZWxkPikge1xuICByZXR1cm4gZmllbGREZWYuYWdncmVnYXRlID09PSAnY291bnQnO1xufVxuXG5leHBvcnQgdHlwZSBGaWVsZFRpdGxlRm9ybWF0dGVyID0gKGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpID0+IHN0cmluZztcblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmJhbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3Qge2ZpZWxkOiBmaWVsZCwgYmluLCB0aW1lVW5pdCwgYWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICBpZiAoYWdncmVnYXRlID09PSAnY291bnQnKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5jb3VudFRpdGxlO1xuICB9IGVsc2UgaWYgKGJpbikge1xuICAgIHJldHVybiBgJHtmaWVsZH0gKGJpbm5lZClgO1xuICB9IGVsc2UgaWYgKHRpbWVVbml0KSB7XG4gICAgY29uc3QgdW5pdHMgPSBnZXRUaW1lVW5pdFBhcnRzKHRpbWVVbml0KS5qb2luKCctJyk7XG4gICAgcmV0dXJuIGAke2ZpZWxkfSAoJHt1bml0c30pYDtcbiAgfSBlbHNlIGlmIChhZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4gYCR7dGl0bGVjYXNlKGFnZ3JlZ2F0ZSl9IG9mICR7ZmllbGR9YDtcbiAgfVxuICByZXR1cm4gZmllbGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmdW5jdGlvbmFsVGl0bGVGb3JtYXR0ZXIoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBmbiA9IGZpZWxkRGVmLmFnZ3JlZ2F0ZSB8fCBmaWVsZERlZi50aW1lVW5pdCB8fCAoZmllbGREZWYuYmluICYmICdiaW4nKTtcbiAgaWYgKGZuKSB7XG4gICAgcmV0dXJuIGZuLnRvVXBwZXJDYXNlKCkgKyAnKCcgKyBmaWVsZERlZi5maWVsZCArICcpJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmllbGREZWYuZmllbGQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRUaXRsZUZvcm1hdHRlcjogRmllbGRUaXRsZUZvcm1hdHRlciA9IChmaWVsZERlZjogRmllbGREZWZCYXNlPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSA9PiB7XG4gIHN3aXRjaCAoY29uZmlnLmZpZWxkVGl0bGUpIHtcbiAgICBjYXNlICdwbGFpbic6XG4gICAgICByZXR1cm4gZmllbGREZWYuZmllbGQ7XG4gICAgY2FzZSAnZnVuY3Rpb25hbCc6XG4gICAgICByZXR1cm4gZnVuY3Rpb25hbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdmVyYmFsVGl0bGVGb3JtYXR0ZXIoZmllbGREZWYsIGNvbmZpZyk7XG4gIH1cbn07XG5cbmxldCB0aXRsZUZvcm1hdHRlciA9IGRlZmF1bHRUaXRsZUZvcm1hdHRlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFRpdGxlRm9ybWF0dGVyKGZvcm1hdHRlcjogRmllbGRUaXRsZUZvcm1hdHRlcikge1xuICB0aXRsZUZvcm1hdHRlciA9IGZvcm1hdHRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0VGl0bGVGb3JtYXR0ZXIoKSB7XG4gIHNldFRpdGxlRm9ybWF0dGVyKGRlZmF1bHRUaXRsZUZvcm1hdHRlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShmaWVsZERlZjogRmllbGREZWZCYXNlPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIHJldHVybiB0aXRsZUZvcm1hdHRlcihmaWVsZERlZiwgY29uZmlnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRUeXBlKGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4sIGNoYW5uZWw6IENoYW5uZWwpOiBUeXBlIHtcbiAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgcmV0dXJuICd0ZW1wb3JhbCc7XG4gIH1cbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIHJldHVybiAncXVhbnRpdGF0aXZlJztcbiAgfVxuICBzd2l0Y2ggKHJhbmdlVHlwZShjaGFubmVsKSkge1xuICAgIGNhc2UgJ2NvbnRpbnVvdXMnOlxuICAgICAgcmV0dXJuICdxdWFudGl0YXRpdmUnO1xuICAgIGNhc2UgJ2Rpc2NyZXRlJzpcbiAgICAgIHJldHVybiAnbm9taW5hbCc7XG4gICAgY2FzZSAnZmxleGlibGUnOiAvLyBjb2xvclxuICAgICAgcmV0dXJuICdub21pbmFsJztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICdxdWFudGl0YXRpdmUnO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmllbGREZWYgLS0gZWl0aGVyIGZyb20gdGhlIG91dGVyIGNoYW5uZWxEZWYgb3IgZnJvbSB0aGUgY29uZGl0aW9uIG9mIGNoYW5uZWxEZWYuXG4gKiBAcGFyYW0gY2hhbm5lbERlZlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGREZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IEZpZWxkRGVmPEY+IHtcbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4gY2hhbm5lbERlZjtcbiAgfSBlbHNlIGlmIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIGNoYW5uZWxEZWYuY29uZGl0aW9uO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ29udmVydCB0eXBlIHRvIGZ1bGwsIGxvd2VyY2FzZSB0eXBlLCBvciBhdWdtZW50IHRoZSBmaWVsZERlZiB3aXRoIGEgZGVmYXVsdCB0eXBlIGlmIG1pc3NpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUoY2hhbm5lbERlZjogQ2hhbm5lbERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKTogQ2hhbm5lbERlZjxhbnk+IHtcbiAgaWYgKGlzU3RyaW5nKGNoYW5uZWxEZWYpIHx8IGlzTnVtYmVyKGNoYW5uZWxEZWYpIHx8IGlzQm9vbGVhbihjaGFubmVsRGVmKSkge1xuICAgIGNvbnN0IHByaW1pdGl2ZVR5cGUgPSBpc1N0cmluZyhjaGFubmVsRGVmKSA/ICdzdHJpbmcnIDpcbiAgICAgIGlzTnVtYmVyKGNoYW5uZWxEZWYpID8gJ251bWJlcicgOiAnYm9vbGVhbic7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UucHJpbWl0aXZlQ2hhbm5lbERlZihjaGFubmVsLCBwcmltaXRpdmVUeXBlLCBjaGFubmVsRGVmKSk7XG4gICAgcmV0dXJuIHt2YWx1ZTogY2hhbm5lbERlZn07XG4gIH1cblxuICAvLyBJZiBhIGZpZWxkRGVmIGNvbnRhaW5zIGEgZmllbGQsIHdlIG5lZWQgdHlwZS5cbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplRmllbGREZWYoY2hhbm5lbERlZiwgY2hhbm5lbCk7XG4gIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5jaGFubmVsRGVmLFxuICAgICAgLy8gTmVlZCB0byBjYXN0IGFzIG5vcm1hbGl6ZUZpZWxkRGVmIG5vcm1hbGx5IHJldHVybiBGaWVsZERlZiwgYnV0IGhlcmUgd2Uga25vdyB0aGF0IGl0IGlzIGRlZmluaXRlbHkgQ29uZGl0aW9uPEZpZWxkRGVmPlxuICAgICAgY29uZGl0aW9uOiBub3JtYWxpemVGaWVsZERlZihjaGFubmVsRGVmLmNvbmRpdGlvbiwgY2hhbm5lbCkgYXMgQ29uZGl0aW9uYWw8RmllbGREZWY8c3RyaW5nPj5cbiAgICB9O1xuICB9XG4gIHJldHVybiBjaGFubmVsRGVmO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIC8vIERyb3AgaW52YWxpZCBhZ2dyZWdhdGVcbiAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSAmJiAhaXNBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgY29uc3Qge2FnZ3JlZ2F0ZSwgLi4uZmllbGREZWZXaXRob3V0QWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmludmFsaWRBZ2dyZWdhdGUoZmllbGREZWYuYWdncmVnYXRlKSk7XG4gICAgZmllbGREZWYgPSBmaWVsZERlZldpdGhvdXRBZ2dyZWdhdGU7XG4gIH1cblxuICAvLyBOb3JtYWxpemUgVGltZSBVbml0XG4gIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgLi4uZmllbGREZWYsXG4gICAgICB0aW1lVW5pdDogbm9ybWFsaXplVGltZVVuaXQoZmllbGREZWYudGltZVVuaXQpXG4gICAgfTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBiaW5cbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgLi4uZmllbGREZWYsXG4gICAgICBiaW46IG5vcm1hbGl6ZUJpbihmaWVsZERlZi5iaW4sIGNoYW5uZWwpXG4gICAgfTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBUeXBlXG4gIGlmIChmaWVsZERlZi50eXBlKSB7XG4gICAgY29uc3QgZnVsbFR5cGUgPSBnZXRGdWxsTmFtZShmaWVsZERlZi50eXBlKTtcbiAgICBpZiAoZmllbGREZWYudHlwZSAhPT0gZnVsbFR5cGUpIHtcbiAgICAgIC8vIGNvbnZlcnQgc2hvcnQgdHlwZSB0byBmdWxsIHR5cGVcbiAgICAgIGZpZWxkRGVmID0ge1xuICAgICAgICAuLi5maWVsZERlZixcbiAgICAgICAgdHlwZTogZnVsbFR5cGVcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChmaWVsZERlZi50eXBlICE9PSAncXVhbnRpdGF0aXZlJykge1xuICAgICAgaWYgKGlzQ291bnRpbmdBZ2dyZWdhdGVPcChmaWVsZERlZi5hZ2dyZWdhdGUpKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmludmFsaWRGaWVsZFR5cGVGb3JDb3VudEFnZ3JlZ2F0ZShmaWVsZERlZi50eXBlLCBmaWVsZERlZi5hZ2dyZWdhdGUpKTtcbiAgICAgICAgZmllbGREZWYgPSB7XG4gICAgICAgICAgLi4uZmllbGREZWYsXG4gICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSWYgdHlwZSBpcyBlbXB0eSAvIGludmFsaWQsIHRoZW4gYXVnbWVudCB3aXRoIGRlZmF1bHQgdHlwZVxuICAgIGNvbnN0IG5ld1R5cGUgPSBkZWZhdWx0VHlwZShmaWVsZERlZiwgY2hhbm5lbCk7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZW1wdHlPckludmFsaWRGaWVsZFR5cGUoZmllbGREZWYudHlwZSwgY2hhbm5lbCwgbmV3VHlwZSkpO1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgICAuLi5maWVsZERlZixcbiAgICAgIHR5cGU6IG5ld1R5cGVcbiAgICB9O1xuICB9XG5cbiAgY29uc3Qge2NvbXBhdGlibGUsIHdhcm5pbmd9ID0gY2hhbm5lbENvbXBhdGliaWxpdHkoZmllbGREZWYsIGNoYW5uZWwpO1xuICBpZiAoIWNvbXBhdGlibGUpIHtcbiAgICBsb2cud2Fybih3YXJuaW5nKTtcbiAgfVxuICByZXR1cm4gZmllbGREZWY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVCaW4oYmluOiBCaW5QYXJhbXN8Ym9vbGVhbiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBpZiAoaXNCb29sZWFuKGJpbikpIHtcbiAgICByZXR1cm4ge21heGJpbnM6IGF1dG9NYXhCaW5zKGNoYW5uZWwpfTtcbiAgfSBlbHNlIGlmICghYmluLm1heGJpbnMgJiYgIWJpbi5zdGVwKSB7XG4gICAgcmV0dXJuIHsuLi5iaW4sIG1heGJpbnM6IGF1dG9NYXhCaW5zKGNoYW5uZWwpfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmluO1xuICB9XG59XG5cbmNvbnN0IENPTVBBVElCTEUgPSB7Y29tcGF0aWJsZTogdHJ1ZX07XG5leHBvcnQgZnVuY3Rpb24gY2hhbm5lbENvbXBhdGliaWxpdHkoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPiwgY2hhbm5lbDogQ2hhbm5lbCk6IHtjb21wYXRpYmxlOiBib29sZWFuOyB3YXJuaW5nPzogc3RyaW5nO30ge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlICdyb3cnOlxuICAgIGNhc2UgJ2NvbHVtbic6XG4gICAgICBpZiAoaXNDb250aW51b3VzKGZpZWxkRGVmKSAmJiAhZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgLy8gVE9ETzooaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yMDExKTpcbiAgICAgICAgLy8gd2l0aCB0aW1lVW5pdCBpdCdzIG5vdCBhbHdheXMgc3RyaWN0bHkgY29udGludW91c1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6IGxvZy5tZXNzYWdlLmZhY2V0Q2hhbm5lbFNob3VsZEJlRGlzY3JldGUoY2hhbm5lbClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAneCc6XG4gICAgY2FzZSAneSc6XG4gICAgY2FzZSAnY29sb3InOlxuICAgIGNhc2UgJ2ZpbGwnOlxuICAgIGNhc2UgJ3N0cm9rZSc6XG4gICAgY2FzZSAndGV4dCc6XG4gICAgY2FzZSAnZGV0YWlsJzpcbiAgICBjYXNlICdrZXknOlxuICAgIGNhc2UgJ3Rvb2x0aXAnOlxuICAgIGNhc2UgJ2hyZWYnOlxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICdsb25naXR1ZGUnOlxuICAgIGNhc2UgJ2xvbmdpdHVkZTInOlxuICAgIGNhc2UgJ2xhdGl0dWRlJzpcbiAgICBjYXNlICdsYXRpdHVkZTInOlxuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgIT09IFFVQU5USVRBVElWRSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6IGBDaGFubmVsICR7Y2hhbm5lbH0gc2hvdWxkIG5vdCBiZSB1c2VkIHdpdGggJHtmaWVsZERlZi50eXBlfSBmaWVsZC5gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ29wYWNpdHknOlxuICAgIGNhc2UgJ3NpemUnOlxuICAgIGNhc2UgJ3gyJzpcbiAgICBjYXNlICd5Mic6XG4gICAgICBpZiAoaXNEaXNjcmV0ZShmaWVsZERlZikgJiYgIWZpZWxkRGVmLmJpbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6IGBDaGFubmVsICR7Y2hhbm5lbH0gc2hvdWxkIG5vdCBiZSB1c2VkIHdpdGggZGlzY3JldGUgZmllbGQuYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICdzaGFwZSc6XG4gICAgICBpZiAoZmllbGREZWYudHlwZSAhPT0gJ25vbWluYWwnICYmIGZpZWxkRGVmLnR5cGUgIT09ICdnZW9qc29uJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6ICdTaGFwZSBjaGFubmVsIHNob3VsZCBiZSB1c2VkIHdpdGggbm9taW5hbCBkYXRhIG9yIGdlb2pzb24gb25seSdcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnb3JkZXInOlxuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgPT09ICdub21pbmFsJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvbXBhdGlibGU6IGZhbHNlLFxuICAgICAgICAgIHdhcm5pbmc6IGBDaGFubmVsIG9yZGVyIGlzIGluYXBwcm9wcmlhdGUgZm9yIG5vbWluYWwgZmllbGQsIHdoaWNoIGhhcyBubyBpbmhlcmVudCBvcmRlci5gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ2NoYW5uZWxDb21wYXRhYmlsaXR5IG5vdCBpbXBsZW1lbnRlZCBmb3IgY2hhbm5lbCAnICsgY2hhbm5lbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bWJlckZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZjxhbnk+KSB7XG4gIHJldHVybiBmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJyB8fCAhIWZpZWxkRGVmLmJpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZjxhbnk+KSB7XG4gIHJldHVybiBmaWVsZERlZi50eXBlID09PSAndGVtcG9yYWwnIHx8ICEhZmllbGREZWYudGltZVVuaXQ7XG59XG4iXX0=