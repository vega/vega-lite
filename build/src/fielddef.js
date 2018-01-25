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
function isConditionalSelection(c) {
    return c['selection'];
}
exports.isConditionalSelection = isConditionalSelection;
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
        case 'href':
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRkZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9FQUFvRTtBQUNwRSx5Q0FBOEU7QUFFOUUsNkJBQTBEO0FBQzFELHFDQUE2QztBQUk3QywyQkFBNkI7QUFNN0IsdUNBQXlFO0FBQ3pFLCtCQUF5QztBQUN6QywrQkFBcUY7QUErQnJGLGdDQUEwQyxDQUFpQjtJQUN6RCxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCx3REFFQztBQWdERCxxQkFBNEIsS0FBWTtJQUN0QyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsZUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsSUFBSSxLQUFLLENBQUM7QUFDeEQsQ0FBQztBQUZELGtDQUVDO0FBNElELDBCQUFvQyxVQUF5QjtJQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztBQUNoRCxDQUFDO0FBRkQsNENBRUM7QUFFRDs7R0FFRztBQUNILGdDQUEwQyxVQUF5QjtJQUNqRSxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsSUFBSSxDQUFDLGNBQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0SCxDQUFDO0FBRkQsd0RBRUM7QUFFRCxnQ0FBMEMsVUFBeUI7SUFDakUsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLElBQUksQ0FDL0MsY0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUNsRSxDQUFDO0FBQ0os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QVUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUM3RCxDQUFDO0FBRkQsd0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEZWNsYXJhdGlvbiBhbmQgdXRpbGl0eSBmb3IgdmFyaWFudHMgb2YgYSBmaWVsZCBkZWZpbml0aW9uIG9iamVjdFxuaW1wb3J0IHtBZ2dyZWdhdGVPcCwgaXNBZ2dyZWdhdGVPcCwgaXNDb3VudGluZ0FnZ3JlZ2F0ZU9wfSBmcm9tICcuL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0F4aXN9IGZyb20gJy4vYXhpcyc7XG5pbXBvcnQge2F1dG9NYXhCaW5zLCBCaW5QYXJhbXMsIGJpblRvU3RyaW5nfSBmcm9tICcuL2Jpbic7XG5pbXBvcnQge0NoYW5uZWwsIHJhbmdlVHlwZX0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7Q29tcG9zaXRlQWdncmVnYXRlfSBmcm9tICcuL2NvbXBvc2l0ZW1hcmsnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2cnO1xuaW1wb3J0IHtMb2dpY2FsT3BlcmFuZH0gZnJvbSAnLi9sb2dpY2FsJztcbmltcG9ydCB7UHJlZGljYXRlfSBmcm9tICcuL3ByZWRpY2F0ZSc7XG5pbXBvcnQge1NjYWxlfSBmcm9tICcuL3NjYWxlJztcbmltcG9ydCB7U29ydEZpZWxkLCBTb3J0T3JkZXJ9IGZyb20gJy4vc29ydCc7XG5pbXBvcnQge1N0YWNrT2Zmc2V0fSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7Z2V0VGltZVVuaXRQYXJ0cywgbm9ybWFsaXplVGltZVVuaXQsIFRpbWVVbml0fSBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCB7Z2V0RnVsbE5hbWUsIFR5cGV9IGZyb20gJy4vdHlwZSc7XG5pbXBvcnQge2FjY2Vzc1BhdGgsIGlzQXJyYXksIGlzQm9vbGVhbiwgaXNOdW1iZXIsIGlzU3RyaW5nLCB0aXRsZWNhc2V9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogRGVmaW5pdGlvbiBvYmplY3QgZm9yIGEgY29uc3RhbnQgdmFsdWUgb2YgYW4gZW5jb2RpbmcgY2hhbm5lbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWYWx1ZURlZiB7XG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IHZhbHVlIGluIHZpc3VhbCBkb21haW4gKGUuZy4sIGBcInJlZFwiYCAvIFwiIzAwOTlmZlwiIGZvciBjb2xvciwgdmFsdWVzIGJldHdlZW4gYDBgIHRvIGAxYCBmb3Igb3BhY2l0eSkuXG4gICAqL1xuICB2YWx1ZTogbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBHZW5lcmljIHR5cGUgZm9yIGNvbmRpdGlvbmFsIGNoYW5uZWxEZWYuXG4gKiBGIGRlZmluZXMgdGhlIHVuZGVybHlpbmcgRmllbGREZWYgdHlwZS5cbiAqL1xuZXhwb3J0IHR5cGUgQ2hhbm5lbERlZldpdGhDb25kaXRpb248RiBleHRlbmRzIEZpZWxkRGVmPGFueT4+ID0gRmllbGREZWZXaXRoQ29uZGl0aW9uPEY+IHwgVmFsdWVEZWZXaXRoQ29uZGl0aW9uPEY+O1xuXG5leHBvcnQgdHlwZSBDb25kaXRpb25hbDxUPiA9IENvbmRpdGlvbmFsUHJlZGljYXRlPFQ+IHwgQ29uZGl0aW9uYWxTZWxlY3Rpb248VD47XG5cbmV4cG9ydCB0eXBlIENvbmRpdGlvbmFsUHJlZGljYXRlPFQ+ID0ge1xuICB0ZXN0OiBMb2dpY2FsT3BlcmFuZDxQcmVkaWNhdGU+O1xufSAmIFQ7XG5cbmV4cG9ydCB0eXBlIENvbmRpdGlvbmFsU2VsZWN0aW9uPFQ+ID0ge1xuICAvKipcbiAgICogQSBbc2VsZWN0aW9uIG5hbWVdKHNlbGVjdGlvbi5odG1sKSwgb3IgYSBzZXJpZXMgb2YgW2NvbXBvc2VkIHNlbGVjdGlvbnNdKHNlbGVjdGlvbi5odG1sI2NvbXBvc2UpLlxuICAgKi9cbiAgc2VsZWN0aW9uOiBMb2dpY2FsT3BlcmFuZDxzdHJpbmc+O1xufSAmIFQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmRpdGlvbmFsU2VsZWN0aW9uPFQ+KGM6IENvbmRpdGlvbmFsPFQ+KTogYyBpcyBDb25kaXRpb25hbFNlbGVjdGlvbjxUPiB7XG4gIHJldHVybiBjWydzZWxlY3Rpb24nXTtcbn1cblxuLyoqXG4gKiBBIEZpZWxkRGVmIHdpdGggQ29uZGl0aW9uPFZhbHVlRGVmPlxuICoge1xuICogICBjb25kaXRpb246IHt2YWx1ZTogLi4ufSxcbiAqICAgZmllbGQ6IC4uLixcbiAqICAgLi4uXG4gKiB9XG4gKi9cbmV4cG9ydCB0eXBlIEZpZWxkRGVmV2l0aENvbmRpdGlvbjxGIGV4dGVuZHMgRmllbGREZWY8YW55Pj4gPSBGICYge1xuICAvKipcbiAgICogT25lIG9yIG1vcmUgdmFsdWUgZGVmaW5pdGlvbihzKSB3aXRoIGEgc2VsZWN0aW9uIHByZWRpY2F0ZS5cbiAgICpcbiAgICogX19Ob3RlOl9fIEEgZmllbGQgZGVmaW5pdGlvbidzIGBjb25kaXRpb25gIHByb3BlcnR5IGNhbiBvbmx5IGNvbnRhaW4gW3ZhbHVlIGRlZmluaXRpb25zXShlbmNvZGluZy5odG1sI3ZhbHVlLWRlZilcbiAgICogc2luY2UgVmVnYS1MaXRlIG9ubHkgYWxsb3dzIGF0IG1vc3R5ICBvbmUgZW5jb2RlZCBmaWVsZCBwZXIgZW5jb2RpbmcgY2hhbm5lbC5cbiAgICovXG4gIGNvbmRpdGlvbj86IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdO1xufTtcblxuLyoqXG4gKiBBIFZhbHVlRGVmIHdpdGggQ29uZGl0aW9uPFZhbHVlRGVmIHwgRmllbGREZWY+XG4gKiB7XG4gKiAgIGNvbmRpdGlvbjoge2ZpZWxkOiAuLi59IHwge3ZhbHVlOiAuLi59LFxuICogICB2YWx1ZTogLi4uLFxuICogfVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbHVlRGVmV2l0aENvbmRpdGlvbjxGIGV4dGVuZHMgRmllbGREZWY8YW55Pj4ge1xuICAvKipcbiAgICogQSBmaWVsZCBkZWZpbml0aW9uIG9yIG9uZSBvciBtb3JlIHZhbHVlIGRlZmluaXRpb24ocykgd2l0aCBhIHNlbGVjdGlvbiBwcmVkaWNhdGUuXG4gICAqL1xuICBjb25kaXRpb24/OiBDb25kaXRpb25hbDxGPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdO1xuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IHZhbHVlIGluIHZpc3VhbCBkb21haW4uXG4gICAqL1xuICB2YWx1ZT86IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgcmVwZWF0ZWQgdmFsdWUuXG4gKi9cbmV4cG9ydCB0eXBlIFJlcGVhdFJlZiA9IHtcbiAgcmVwZWF0OiAncm93JyB8ICdjb2x1bW4nXG59O1xuXG5leHBvcnQgdHlwZSBGaWVsZCA9IHN0cmluZyB8IFJlcGVhdFJlZjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwZWF0UmVmKGZpZWxkOiBGaWVsZCk6IGZpZWxkIGlzIFJlcGVhdFJlZiB7XG4gIHJldHVybiBmaWVsZCAmJiAhaXNTdHJpbmcoZmllbGQpICYmICdyZXBlYXQnIGluIGZpZWxkO1xufVxuXG4vKiogQGhpZGUgKi9cbmV4cG9ydCB0eXBlIEhpZGRlbkNvbXBvc2l0ZUFnZ3JlZ2F0ZSA9IENvbXBvc2l0ZUFnZ3JlZ2F0ZTtcblxuZXhwb3J0IHR5cGUgQWdncmVnYXRlID0gQWdncmVnYXRlT3AgfCBIaWRkZW5Db21wb3NpdGVBZ2dyZWdhdGU7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGREZWZCYXNlPEY+IHtcblxuICAvKipcbiAgICogX19SZXF1aXJlZC5fXyBBIHN0cmluZyBkZWZpbmluZyB0aGUgbmFtZSBvZiB0aGUgZmllbGQgZnJvbSB3aGljaCB0byBwdWxsIGEgZGF0YSB2YWx1ZVxuICAgKiBvciBhbiBvYmplY3QgZGVmaW5pbmcgaXRlcmF0ZWQgdmFsdWVzIGZyb20gdGhlIFtgcmVwZWF0YF0ocmVwZWF0Lmh0bWwpIG9wZXJhdG9yLlxuICAgKlxuICAgKiBfX05vdGU6X18gRG90cyAoYC5gKSBhbmQgYnJhY2tldHMgKGBbYCBhbmQgYF1gKSBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgbmVzdGVkIG9iamVjdHMgKGUuZy4sIGBcImZpZWxkXCI6IFwiZm9vLmJhclwiYCBhbmQgYFwiZmllbGRcIjogXCJmb29bJ2JhciddXCJgKS5cbiAgICogSWYgZmllbGQgbmFtZXMgY29udGFpbiBkb3RzIG9yIGJyYWNrZXRzIGJ1dCBhcmUgbm90IG5lc3RlZCwgeW91IGNhbiB1c2UgYFxcXFxgIHRvIGVzY2FwZSBkb3RzIGFuZCBicmFja2V0cyAoZS5nLiwgYFwiYVxcXFwuYlwiYCBhbmQgYFwiYVxcXFxbMFxcXFxdXCJgKS5cbiAgICogU2VlIG1vcmUgZGV0YWlscyBhYm91dCBlc2NhcGluZyBpbiB0aGUgW2ZpZWxkIGRvY3VtZW50YXRpb25dKGZpZWxkLmh0bWwpLlxuICAgKlxuICAgKiBfX05vdGU6X18gYGZpZWxkYCBpcyBub3QgcmVxdWlyZWQgaWYgYGFnZ3JlZ2F0ZWAgaXMgYGNvdW50YC5cbiAgICovXG4gIGZpZWxkPzogRjtcblxuICAvLyBmdW5jdGlvblxuXG4gIC8qKlxuICAgKiBUaW1lIHVuaXQgKGUuZy4sIGB5ZWFyYCwgYHllYXJtb250aGAsIGBtb250aGAsIGBob3Vyc2ApIGZvciBhIHRlbXBvcmFsIGZpZWxkLlxuICAgKiBvciBbYSB0ZW1wb3JhbCBmaWVsZCB0aGF0IGdldHMgY2FzdGVkIGFzIG9yZGluYWxdKHR5cGUuaHRtbCNjYXN0KS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB1bmRlZmluZWRgIChOb25lKVxuICAgKi9cbiAgdGltZVVuaXQ/OiBUaW1lVW5pdDtcblxuICAvKipcbiAgICogQSBmbGFnIGZvciBiaW5uaW5nIGEgYHF1YW50aXRhdGl2ZWAgZmllbGQsIG9yIFthbiBvYmplY3QgZGVmaW5pbmcgYmlubmluZyBwYXJhbWV0ZXJzXShiaW4uaHRtbCNwYXJhbXMpLlxuICAgKiBJZiBgdHJ1ZWAsIGRlZmF1bHQgW2Jpbm5pbmcgcGFyYW1ldGVyc10oYmluLmh0bWwpIHdpbGwgYmUgYXBwbGllZC5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGBmYWxzZWBcbiAgICovXG4gIGJpbj86IGJvb2xlYW4gfCBCaW5QYXJhbXM7XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0aW9uIGZ1bmN0aW9uIGZvciB0aGUgZmllbGRcbiAgICogKGUuZy4sIGBtZWFuYCwgYHN1bWAsIGBtZWRpYW5gLCBgbWluYCwgYG1heGAsIGBjb3VudGApLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYHVuZGVmaW5lZGAgKE5vbmUpXG4gICAqL1xuICBhZ2dyZWdhdGU/OiBBZ2dyZWdhdGU7XG59XG5cbi8qKlxuICogIERlZmluaXRpb24gb2JqZWN0IGZvciBhIGRhdGEgZmllbGQsIGl0cyB0eXBlIGFuZCB0cmFuc2Zvcm1hdGlvbiBvZiBhbiBlbmNvZGluZyBjaGFubmVsLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpZWxkRGVmPEY+IGV4dGVuZHMgRmllbGREZWZCYXNlPEY+IHtcbiAgLyoqXG4gICAqIFRoZSBlbmNvZGVkIGZpZWxkJ3MgdHlwZSBvZiBtZWFzdXJlbWVudCAoYFwicXVhbnRpdGF0aXZlXCJgLCBgXCJ0ZW1wb3JhbFwiYCwgYFwib3JkaW5hbFwiYCwgb3IgYFwibm9taW5hbFwiYCkuXG4gICAqIEl0IGNhbiBhbHNvIGJlIGEgZ2VvIHR5cGUgKGBcImxhdGl0dWRlXCJgLCBgXCJsb25naXR1ZGVcImAsIGFuZCBgXCJnZW9qc29uXCJgKSB3aGVuIGEgW2dlb2dyYXBoaWMgcHJvamVjdGlvbl0ocHJvamVjdGlvbi5odG1sKSBpcyBhcHBsaWVkLlxuICAgKi9cbiAgLy8gKiBvciBhbiBpbml0aWFsIGNoYXJhY3RlciBvZiB0aGUgdHlwZSBuYW1lIChgXCJRXCJgLCBgXCJUXCJgLCBgXCJPXCJgLCBgXCJOXCJgKS5cbiAgLy8gKiBUaGlzIHByb3BlcnR5IGlzIGNhc2UtaW5zZW5zaXRpdmUuXG4gIHR5cGU6IFR5cGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NhbGVGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIHRoZSBjaGFubmVsJ3Mgc2NhbGUsIHdoaWNoIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHRyYW5zZm9ybXMgdmFsdWVzIGluIHRoZSBkYXRhIGRvbWFpbiAobnVtYmVycywgZGF0ZXMsIHN0cmluZ3MsIGV0YykgdG8gdmlzdWFsIHZhbHVlcyAocGl4ZWxzLCBjb2xvcnMsIHNpemVzKSBvZiB0aGUgZW5jb2RpbmcgY2hhbm5lbHMuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBJZiB1bmRlZmluZWQsIGRlZmF1bHQgW3NjYWxlIHByb3BlcnRpZXNdKHNjYWxlLmh0bWwpIGFyZSBhcHBsaWVkLlxuICAgKi9cbiAgc2NhbGU/OiBTY2FsZTtcblxuICAvKipcbiAgICogU29ydCBvcmRlciBmb3IgdGhlIGVuY29kZWQgZmllbGQuXG4gICAqIFN1cHBvcnRlZCBgc29ydGAgdmFsdWVzIGluY2x1ZGUgYFwiYXNjZW5kaW5nXCJgLCBgXCJkZXNjZW5kaW5nXCJgIGFuZCBgbnVsbGAgKG5vIHNvcnRpbmcpLlxuICAgKiBGb3IgZmllbGRzIHdpdGggZGlzY3JldGUgZG9tYWlucywgYHNvcnRgIGNhbiBhbHNvIGJlIGEgW3NvcnQgZmllbGQgZGVmaW5pdGlvbiBvYmplY3RdKHNvcnQuaHRtbCNzb3J0LWZpZWxkKS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGBcImFzY2VuZGluZ1wiYFxuICAgKi9cbiAgc29ydD86IFNvcnRPcmRlciB8IFNvcnRGaWVsZDxGPiB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9zaXRpb25GaWVsZERlZjxGPiBleHRlbmRzIFNjYWxlRmllbGREZWY8Rj4ge1xuICAvKipcbiAgICogQW4gb2JqZWN0IGRlZmluaW5nIHByb3BlcnRpZXMgb2YgYXhpcydzIGdyaWRsaW5lcywgdGlja3MgYW5kIGxhYmVscy5cbiAgICogSWYgYG51bGxgLCB0aGUgYXhpcyBmb3IgdGhlIGVuY29kaW5nIGNoYW5uZWwgd2lsbCBiZSByZW1vdmVkLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gSWYgdW5kZWZpbmVkLCBkZWZhdWx0IFtheGlzIHByb3BlcnRpZXNdKGF4aXMuaHRtbCkgYXJlIGFwcGxpZWQuXG4gICAqL1xuICBheGlzPzogQXhpcyB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2Ygc3RhY2tpbmcgb2Zmc2V0IGlmIHRoZSBmaWVsZCBzaG91bGQgYmUgc3RhY2tlZC5cbiAgICogYHN0YWNrYCBpcyBvbmx5IGFwcGxpY2FibGUgZm9yIGB4YCBhbmQgYHlgIGNoYW5uZWxzIHdpdGggY29udGludW91cyBkb21haW5zLlxuICAgKiBGb3IgZXhhbXBsZSwgYHN0YWNrYCBvZiBgeWAgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIHN0YWNraW5nIGZvciBhIHZlcnRpY2FsIGJhciBjaGFydC5cbiAgICpcbiAgICogYHN0YWNrYCBjYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICAgKiAtIGBcInplcm9cImA6IHN0YWNraW5nIHdpdGggYmFzZWxpbmUgb2Zmc2V0IGF0IHplcm8gdmFsdWUgb2YgdGhlIHNjYWxlIChmb3IgY3JlYXRpbmcgdHlwaWNhbCBzdGFja2VkIFtiYXJdKHN0YWNrLmh0bWwjYmFyKSBhbmQgW2FyZWFdKHN0YWNrLmh0bWwjYXJlYSkgY2hhcnQpLlxuICAgKiAtIGBcIm5vcm1hbGl6ZVwiYCAtIHN0YWNraW5nIHdpdGggbm9ybWFsaXplZCBkb21haW4gKGZvciBjcmVhdGluZyBbbm9ybWFsaXplZCBzdGFja2VkIGJhciBhbmQgYXJlYSBjaGFydHNdKHN0YWNrLmh0bWwjbm9ybWFsaXplZCkuIDxici8+XG4gICAqIC1gXCJjZW50ZXJcImAgLSBzdGFja2luZyB3aXRoIGNlbnRlciBiYXNlbGluZSAoZm9yIFtzdHJlYW1ncmFwaF0oc3RhY2suaHRtbCNzdHJlYW1ncmFwaCkpLlxuICAgKiAtIGBudWxsYCAtIE5vLXN0YWNraW5nLiBUaGlzIHdpbGwgcHJvZHVjZSBsYXllcmVkIFtiYXJdKHN0YWNrLmh0bWwjbGF5ZXJlZC1iYXItY2hhcnQpIGFuZCBhcmVhIGNoYXJ0LlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYHplcm9gIGZvciBwbG90cyB3aXRoIGFsbCBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIHRydWU6XG4gICAqICgxKSB0aGUgbWFyayBpcyBgYmFyYCBvciBgYXJlYWA7XG4gICAqICgyKSB0aGUgc3RhY2tlZCBtZWFzdXJlIGNoYW5uZWwgKHggb3IgeSkgaGFzIGEgbGluZWFyIHNjYWxlO1xuICAgKiAoMykgQXQgbGVhc3Qgb25lIG9mIG5vbi1wb3NpdGlvbiBjaGFubmVscyBtYXBwZWQgdG8gYW4gdW5hZ2dyZWdhdGVkIGZpZWxkIHRoYXQgaXMgZGlmZmVyZW50IGZyb20geCBhbmQgeS4gIE90aGVyd2lzZSwgYG51bGxgIGJ5IGRlZmF1bHQuXG4gICAqL1xuICBzdGFjaz86IFN0YWNrT2Zmc2V0IHwgbnVsbDtcbn1cblxuLyoqXG4gKiBGaWVsZCBkZWZpbml0aW9uIG9mIGEgbWFyayBwcm9wZXJ0eSwgd2hpY2ggY2FuIGNvbnRhaW4gYSBsZWdlbmQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWFya1Byb3BGaWVsZERlZjxGPiBleHRlbmRzIFNjYWxlRmllbGREZWY8Rj4ge1xuICAgLyoqXG4gICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiB0aGUgbGVnZW5kLlxuICAgICogSWYgYG51bGxgLCB0aGUgbGVnZW5kIGZvciB0aGUgZW5jb2RpbmcgY2hhbm5lbCB3aWxsIGJlIHJlbW92ZWQuXG4gICAgKlxuICAgICogX19EZWZhdWx0IHZhbHVlOl9fIElmIHVuZGVmaW5lZCwgZGVmYXVsdCBbbGVnZW5kIHByb3BlcnRpZXNdKGxlZ2VuZC5odG1sKSBhcmUgYXBwbGllZC5cbiAgICAqL1xuICBsZWdlbmQ/OiBMZWdlbmQgfCBudWxsO1xufVxuXG4vLyBEZXRhaWxcblxuLy8gT3JkZXIgUGF0aCBoYXZlIG5vIHNjYWxlXG5cbmV4cG9ydCBpbnRlcmZhY2UgT3JkZXJGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIFRoZSBzb3J0IG9yZGVyLiBPbmUgb2YgYFwiYXNjZW5kaW5nXCJgIChkZWZhdWx0KSBvciBgXCJkZXNjZW5kaW5nXCJgLlxuICAgKi9cbiAgc29ydD86IFNvcnRPcmRlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZXh0RmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBUaGUgW2Zvcm1hdHRpbmcgcGF0dGVybl0oZm9ybWF0Lmh0bWwpIGZvciBhIHRleHQgZmllbGQuIElmIG5vdCBkZWZpbmVkLCB0aGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgZm9ybWF0Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBDaGFubmVsRGVmPEY+ID0gQ2hhbm5lbERlZldpdGhDb25kaXRpb248RmllbGREZWY8Rj4+O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNDb25kaXRpb25hbERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyBDaGFubmVsRGVmV2l0aENvbmRpdGlvbjxGaWVsZERlZjxGPj4ge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICEhY2hhbm5lbERlZi5jb25kaXRpb247XG59XG5cbi8qKlxuICogUmV0dXJuIGlmIGEgY2hhbm5lbERlZiBpcyBhIENvbmRpdGlvbmFsVmFsdWVEZWYgd2l0aCBDb25kaXRpb25GaWVsZERlZlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzQ29uZGl0aW9uYWxGaWVsZERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyAoVmFsdWVEZWYgJiB7Y29uZGl0aW9uOiBDb25kaXRpb25hbDxGaWVsZERlZjxGPj59KSB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgISFjaGFubmVsRGVmLmNvbmRpdGlvbiAmJiAhaXNBcnJheShjaGFubmVsRGVmLmNvbmRpdGlvbikgJiYgaXNGaWVsZERlZihjaGFubmVsRGVmLmNvbmRpdGlvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDb25kaXRpb25hbFZhbHVlRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIChWYWx1ZURlZiAmIHtjb25kaXRpb246IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdfSkge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICEhY2hhbm5lbERlZi5jb25kaXRpb24gJiYgKFxuICAgIGlzQXJyYXkoY2hhbm5lbERlZi5jb25kaXRpb24pIHx8IGlzVmFsdWVEZWYoY2hhbm5lbERlZi5jb25kaXRpb24pXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZpZWxkRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIEZpZWxkRGVmPEY+IHwgUG9zaXRpb25GaWVsZERlZjxGPiB8IFNjYWxlRmllbGREZWY8Rj4gfCBNYXJrUHJvcEZpZWxkRGVmPEY+IHwgT3JkZXJGaWVsZERlZjxGPiB8IFRleHRGaWVsZERlZjxGPiB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgKCEhY2hhbm5lbERlZlsnZmllbGQnXSB8fCBjaGFubmVsRGVmWydhZ2dyZWdhdGUnXSA9PT0gJ2NvdW50Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZ0ZpZWxkRGVmKGZpZWxkRGVmOiBDaGFubmVsRGVmPHN0cmluZ3xSZXBlYXRSZWY+KTogZmllbGREZWYgaXMgRmllbGREZWY8c3RyaW5nPiB7XG4gIHJldHVybiBpc0ZpZWxkRGVmKGZpZWxkRGVmKSAmJiBpc1N0cmluZyhmaWVsZERlZi5maWVsZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbHVlRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIFZhbHVlRGVmIHtcbiAgcmV0dXJuIGNoYW5uZWxEZWYgJiYgJ3ZhbHVlJyBpbiBjaGFubmVsRGVmICYmIGNoYW5uZWxEZWZbJ3ZhbHVlJ10gIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2NhbGVGaWVsZERlZihjaGFubmVsRGVmOiBDaGFubmVsRGVmPGFueT4pOiBjaGFubmVsRGVmIGlzIFNjYWxlRmllbGREZWY8YW55PiB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgKCEhY2hhbm5lbERlZlsnc2NhbGUnXSB8fCAhIWNoYW5uZWxEZWZbJ3NvcnQnXSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGRSZWZPcHRpb24ge1xuICAvKiogZXhjbHVkZSBiaW4sIGFnZ3JlZ2F0ZSwgdGltZVVuaXQgKi9cbiAgbm9mbj86IGJvb2xlYW47XG4gIC8qKiBXcmFwIHRoZSBmaWVsZCB3aXRoIGRhdHVtIG9yIHBhcmVudCAoZS5nLiwgZGF0dW1bJy4uLiddIGZvciBWZWdhIEV4cHJlc3Npb24gKi9cbiAgZXhwcj86ICdkYXR1bScgfCAncGFyZW50JztcbiAgLyoqIHByZXBlbmQgZm4gd2l0aCBjdXN0b20gZnVuY3Rpb24gcHJlZml4ICovXG4gIHByZWZpeD86IHN0cmluZztcbiAgLyoqIGFwcGVuZCBzdWZmaXggdG8gdGhlIGZpZWxkIHJlZiBmb3IgYmluIChkZWZhdWx0PSdzdGFydCcpICovXG4gIGJpblN1ZmZpeD86ICdlbmQnIHwgJ3JhbmdlJyB8ICdtaWQnO1xuICAvKiogYXBwZW5kIHN1ZmZpeCB0byB0aGUgZmllbGQgcmVmIChnZW5lcmFsKSAqL1xuICBzdWZmaXg/OiBzdHJpbmc7XG4gIC8qKiBPdmVycnJpZGUgd2hpY2ggYWdncmVnYXRlIHRvIHVzZS4gTmVlZGVkIGZvciB1bmFnZ3JlZ2F0ZWQgZG9tYWluLiAqL1xuICBhZ2dyZWdhdGU/OiBBZ2dyZWdhdGVPcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZnRmllbGQoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxzdHJpbmc+LCBvcHQ6IEZpZWxkUmVmT3B0aW9uID0ge30pOiBzdHJpbmcge1xuICBsZXQgZmllbGQgPSBmaWVsZERlZi5maWVsZDtcbiAgY29uc3QgcHJlZml4ID0gb3B0LnByZWZpeDtcbiAgbGV0IHN1ZmZpeCA9IG9wdC5zdWZmaXg7XG5cbiAgaWYgKGlzQ291bnQoZmllbGREZWYpKSB7XG4gICAgZmllbGQgPSAnY291bnRfKic7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGZuOiBzdHJpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIW9wdC5ub2ZuKSB7XG4gICAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICAgIGZuID0gYmluVG9TdHJpbmcoZmllbGREZWYuYmluKTtcbiAgICAgICAgc3VmZml4ID0gb3B0LmJpblN1ZmZpeCB8fCAnJztcbiAgICAgIH0gZWxzZSBpZiAoZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgIGZuID0gU3RyaW5nKG9wdC5hZ2dyZWdhdGUgfHwgZmllbGREZWYuYWdncmVnYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgZm4gPSBTdHJpbmcoZmllbGREZWYudGltZVVuaXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmbikge1xuICAgICAgZmllbGQgPSBgJHtmbn1fJHtmaWVsZH1gO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdWZmaXgpIHtcbiAgICBmaWVsZCA9IGAke2ZpZWxkfV8ke3N1ZmZpeH1gO1xuICB9XG5cbiAgaWYgKHByZWZpeCkge1xuICAgIGZpZWxkID0gYCR7cHJlZml4fV8ke2ZpZWxkfWA7XG4gIH1cblxuICBpZiAob3B0LmV4cHIpIHtcbiAgICBmaWVsZCA9IGAke29wdC5leHByfSR7YWNjZXNzUGF0aChmaWVsZCl9YDtcbiAgfVxuXG4gIHJldHVybiBmaWVsZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlzY3JldGUoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPikge1xuICBzd2l0Y2ggKGZpZWxkRGVmLnR5cGUpIHtcbiAgICBjYXNlICdub21pbmFsJzpcbiAgICBjYXNlICdvcmRpbmFsJzpcbiAgICBjYXNlICdnZW9qc29uJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgJ3F1YW50aXRhdGl2ZSc6XG4gICAgICByZXR1cm4gISFmaWVsZERlZi5iaW47XG4gICAgY2FzZSAnbGF0aXR1ZGUnOlxuICAgIGNhc2UgJ2xvbmdpdHVkZSc6XG4gICAgY2FzZSAndGVtcG9yYWwnOlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5pbnZhbGlkRmllbGRUeXBlKGZpZWxkRGVmLnR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29udGludW91cyhmaWVsZERlZjogRmllbGREZWY8RmllbGQ+KSB7XG4gIHJldHVybiAhaXNEaXNjcmV0ZShmaWVsZERlZik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvdW50KGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8RmllbGQ+KSB7XG4gIHJldHVybiBmaWVsZERlZi5hZ2dyZWdhdGUgPT09ICdjb3VudCc7XG59XG5cbmV4cG9ydCB0eXBlIEZpZWxkVGl0bGVGb3JtYXR0ZXIgPSAoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSA9PiBzdHJpbmc7XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJiYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3Qge2ZpZWxkOiBmaWVsZCwgYmluLCB0aW1lVW5pdCwgYWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICBpZiAoYWdncmVnYXRlID09PSAnY291bnQnKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5jb3VudFRpdGxlO1xuICB9IGVsc2UgaWYgKGJpbikge1xuICAgIHJldHVybiBgJHtmaWVsZH0gKGJpbm5lZClgO1xuICB9IGVsc2UgaWYgKHRpbWVVbml0KSB7XG4gICAgY29uc3QgdW5pdHMgPSBnZXRUaW1lVW5pdFBhcnRzKHRpbWVVbml0KS5qb2luKCctJyk7XG4gICAgcmV0dXJuIGAke2ZpZWxkfSAoJHt1bml0c30pYDtcbiAgfSBlbHNlIGlmIChhZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4gYCR7dGl0bGVjYXNlKGFnZ3JlZ2F0ZSl9IG9mICR7ZmllbGR9YDtcbiAgfVxuICByZXR1cm4gZmllbGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmdW5jdGlvbmFsVGl0bGVGb3JtYXR0ZXIoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IGZuID0gZmllbGREZWYuYWdncmVnYXRlIHx8IGZpZWxkRGVmLnRpbWVVbml0IHx8IChmaWVsZERlZi5iaW4gJiYgJ2JpbicpO1xuICBpZiAoZm4pIHtcbiAgICByZXR1cm4gZm4udG9VcHBlckNhc2UoKSArICcoJyArIGZpZWxkRGVmLmZpZWxkICsgJyknO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmaWVsZERlZi5maWVsZDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZGVmYXVsdFRpdGxlRm9ybWF0dGVyOiBGaWVsZFRpdGxlRm9ybWF0dGVyID0gKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykgPT4ge1xuICBzd2l0Y2ggKGNvbmZpZy5maWVsZFRpdGxlKSB7XG4gICAgY2FzZSAncGxhaW4nOlxuICAgICAgcmV0dXJuIGZpZWxkRGVmLmZpZWxkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uYWwnOlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZiwgY29uZmlnKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHZlcmJhbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xuICB9XG59O1xuXG5sZXQgdGl0bGVGb3JtYXR0ZXIgPSBkZWZhdWx0VGl0bGVGb3JtYXR0ZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRUaXRsZUZvcm1hdHRlcihmb3JtYXR0ZXI6IChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpID0+IHN0cmluZykge1xuICB0aXRsZUZvcm1hdHRlciA9IGZvcm1hdHRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0VGl0bGVGb3JtYXR0ZXIoKSB7XG4gIHNldFRpdGxlRm9ybWF0dGVyKGRlZmF1bHRUaXRsZUZvcm1hdHRlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIHRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFR5cGUoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPiwgY2hhbm5lbDogQ2hhbm5lbCk6IFR5cGUge1xuICBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICByZXR1cm4gJ3RlbXBvcmFsJztcbiAgfVxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgcmV0dXJuICdxdWFudGl0YXRpdmUnO1xuICB9XG4gIHN3aXRjaCAocmFuZ2VUeXBlKGNoYW5uZWwpKSB7XG4gICAgY2FzZSAnY29udGludW91cyc6XG4gICAgICByZXR1cm4gJ3F1YW50aXRhdGl2ZSc7XG4gICAgY2FzZSAnZGlzY3JldGUnOlxuICAgICAgcmV0dXJuICdub21pbmFsJztcbiAgICBjYXNlICdmbGV4aWJsZSc6IC8vIGNvbG9yXG4gICAgICByZXR1cm4gJ25vbWluYWwnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJ3F1YW50aXRhdGl2ZSc7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaWVsZERlZiAtLSBlaXRoZXIgZnJvbSB0aGUgb3V0ZXIgY2hhbm5lbERlZiBvciBmcm9tIHRoZSBjb25kaXRpb24gb2YgY2hhbm5lbERlZi5cbiAqIEBwYXJhbSBjaGFubmVsRGVmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogRmllbGREZWY8Rj4ge1xuICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiBjaGFubmVsRGVmO1xuICB9IGVsc2UgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4gY2hhbm5lbERlZi5jb25kaXRpb247XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IHR5cGUgdG8gZnVsbCwgbG93ZXJjYXNlIHR5cGUsIG9yIGF1Z21lbnQgdGhlIGZpZWxkRGVmIHdpdGggYSBkZWZhdWx0IHR5cGUgaWYgbWlzc2luZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShjaGFubmVsRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpOiBDaGFubmVsRGVmPGFueT4ge1xuICBpZiAoaXNTdHJpbmcoY2hhbm5lbERlZikgfHwgaXNOdW1iZXIoY2hhbm5lbERlZikgfHwgaXNCb29sZWFuKGNoYW5uZWxEZWYpKSB7XG4gICAgY29uc3QgcHJpbWl0aXZlVHlwZSA9IGlzU3RyaW5nKGNoYW5uZWxEZWYpID8gJ3N0cmluZycgOlxuICAgICAgaXNOdW1iZXIoY2hhbm5lbERlZikgPyAnbnVtYmVyJyA6ICdib29sZWFuJztcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5wcmltaXRpdmVDaGFubmVsRGVmKGNoYW5uZWwsIHByaW1pdGl2ZVR5cGUsIGNoYW5uZWxEZWYpKTtcbiAgICByZXR1cm4ge3ZhbHVlOiBjaGFubmVsRGVmfTtcbiAgfVxuXG4gIC8vIElmIGEgZmllbGREZWYgY29udGFpbnMgYSBmaWVsZCwgd2UgbmVlZCB0eXBlLlxuICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiBub3JtYWxpemVGaWVsZERlZihjaGFubmVsRGVmLCBjaGFubmVsKTtcbiAgfSBlbHNlIGlmIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmNoYW5uZWxEZWYsXG4gICAgICAvLyBOZWVkIHRvIGNhc3QgYXMgbm9ybWFsaXplRmllbGREZWYgbm9ybWFsbHkgcmV0dXJuIEZpZWxkRGVmLCBidXQgaGVyZSB3ZSBrbm93IHRoYXQgaXQgaXMgZGVmaW5pdGVseSBDb25kaXRpb248RmllbGREZWY+XG4gICAgICBjb25kaXRpb246IG5vcm1hbGl6ZUZpZWxkRGVmKGNoYW5uZWxEZWYuY29uZGl0aW9uLCBjaGFubmVsKSBhcyBDb25kaXRpb25hbDxGaWVsZERlZjxzdHJpbmc+PlxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGNoYW5uZWxEZWY7XG59XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgLy8gRHJvcCBpbnZhbGlkIGFnZ3JlZ2F0ZVxuICBpZiAoZmllbGREZWYuYWdncmVnYXRlICYmICFpc0FnZ3JlZ2F0ZU9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpIHtcbiAgICBjb25zdCB7YWdncmVnYXRlLCAuLi5maWVsZERlZldpdGhvdXRBZ2dyZWdhdGV9ID0gZmllbGREZWY7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuaW52YWxpZEFnZ3JlZ2F0ZShmaWVsZERlZi5hZ2dyZWdhdGUpKTtcbiAgICBmaWVsZERlZiA9IGZpZWxkRGVmV2l0aG91dEFnZ3JlZ2F0ZTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBUaW1lIFVuaXRcbiAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgZmllbGREZWYgPSB7XG4gICAgICAuLi5maWVsZERlZixcbiAgICAgIHRpbWVVbml0OiBub3JtYWxpemVUaW1lVW5pdChmaWVsZERlZi50aW1lVW5pdClcbiAgICB9O1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJpblxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgZmllbGREZWYgPSB7XG4gICAgICAuLi5maWVsZERlZixcbiAgICAgIGJpbjogbm9ybWFsaXplQmluKGZpZWxkRGVmLmJpbiwgY2hhbm5lbClcbiAgICB9O1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIFR5cGVcbiAgaWYgKGZpZWxkRGVmLnR5cGUpIHtcbiAgICBjb25zdCBmdWxsVHlwZSA9IGdldEZ1bGxOYW1lKGZpZWxkRGVmLnR5cGUpO1xuICAgIGlmIChmaWVsZERlZi50eXBlICE9PSBmdWxsVHlwZSkge1xuICAgICAgLy8gY29udmVydCBzaG9ydCB0eXBlIHRvIGZ1bGwgdHlwZVxuICAgICAgZmllbGREZWYgPSB7XG4gICAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgICB0eXBlOiBmdWxsVHlwZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGZpZWxkRGVmLnR5cGUgIT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgICBpZiAoaXNDb3VudGluZ0FnZ3JlZ2F0ZU9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuaW52YWxpZEZpZWxkVHlwZUZvckNvdW50QWdncmVnYXRlKGZpZWxkRGVmLnR5cGUsIGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpO1xuICAgICAgICBmaWVsZERlZiA9IHtcbiAgICAgICAgICAuLi5maWVsZERlZixcbiAgICAgICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJZiB0eXBlIGlzIGVtcHR5IC8gaW52YWxpZCwgdGhlbiBhdWdtZW50IHdpdGggZGVmYXVsdCB0eXBlXG4gICAgY29uc3QgbmV3VHlwZSA9IGRlZmF1bHRUeXBlKGZpZWxkRGVmLCBjaGFubmVsKTtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5lbXB0eU9ySW52YWxpZEZpZWxkVHlwZShmaWVsZERlZi50eXBlLCBjaGFubmVsLCBuZXdUeXBlKSk7XG4gICAgZmllbGREZWYgPSB7XG4gICAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgdHlwZTogbmV3VHlwZVxuICAgIH07XG4gIH1cblxuICBjb25zdCB7Y29tcGF0aWJsZSwgd2FybmluZ30gPSBjaGFubmVsQ29tcGF0aWJpbGl0eShmaWVsZERlZiwgY2hhbm5lbCk7XG4gIGlmICghY29tcGF0aWJsZSkge1xuICAgIGxvZy53YXJuKHdhcm5pbmcpO1xuICB9XG4gIHJldHVybiBmaWVsZERlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUJpbihiaW46IEJpblBhcmFtc3xib29sZWFuLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGlmIChpc0Jvb2xlYW4oYmluKSkge1xuICAgIHJldHVybiB7bWF4YmluczogYXV0b01heEJpbnMoY2hhbm5lbCl9O1xuICB9IGVsc2UgaWYgKCFiaW4ubWF4YmlucyAmJiAhYmluLnN0ZXApIHtcbiAgICByZXR1cm4gey4uLmJpbiwgbWF4YmluczogYXV0b01heEJpbnMoY2hhbm5lbCl9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBiaW47XG4gIH1cbn1cblxuY29uc3QgQ09NUEFUSUJMRSA9IHtjb21wYXRpYmxlOiB0cnVlfTtcbmV4cG9ydCBmdW5jdGlvbiBjaGFubmVsQ29tcGF0aWJpbGl0eShmaWVsZERlZjogRmllbGREZWY8RmllbGQ+LCBjaGFubmVsOiBDaGFubmVsKToge2NvbXBhdGlibGU6IGJvb2xlYW47IHdhcm5pbmc/OiBzdHJpbmc7fSB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgJ3Jvdyc6XG4gICAgY2FzZSAnY29sdW1uJzpcbiAgICAgIGlmIChpc0NvbnRpbnVvdXMoZmllbGREZWYpICYmICFmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICAvLyBUT0RPOihodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzIwMTEpOlxuICAgICAgICAvLyB3aXRoIHRpbWVVbml0IGl0J3Mgbm90IGFsd2F5cyBzdHJpY3RseSBjb250aW51b3VzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogbG9nLm1lc3NhZ2UuZmFjZXRDaGFubmVsU2hvdWxkQmVEaXNjcmV0ZShjaGFubmVsKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICd4JzpcbiAgICBjYXNlICd5JzpcbiAgICBjYXNlICdjb2xvcic6XG4gICAgY2FzZSAndGV4dCc6XG4gICAgY2FzZSAnZGV0YWlsJzpcbiAgICBjYXNlICd0b29sdGlwJzpcbiAgICBjYXNlICdocmVmJzpcbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgY2FzZSAnc2l6ZSc6XG4gICAgY2FzZSAneDInOlxuICAgIGNhc2UgJ3kyJzpcbiAgICAgIGlmIChpc0Rpc2NyZXRlKGZpZWxkRGVmKSAmJiAhZmllbGREZWYuYmluKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogYENoYW5uZWwgJHtjaGFubmVsfSBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCBkaXNjcmV0ZSBmaWVsZC5gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ3NoYXBlJzpcbiAgICAgIGlmIChmaWVsZERlZi50eXBlICE9PSAnbm9taW5hbCcgJiYgZmllbGREZWYudHlwZSAhPT0gJ2dlb2pzb24nKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogJ1NoYXBlIGNoYW5uZWwgc2hvdWxkIGJlIHVzZWQgd2l0aCBub21pbmFsIGRhdGEgb3IgZ2VvanNvbiBvbmx5J1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICdvcmRlcic6XG4gICAgICBpZiAoZmllbGREZWYudHlwZSA9PT0gJ25vbWluYWwnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogYENoYW5uZWwgb3JkZXIgaXMgaW5hcHByb3ByaWF0ZSBmb3Igbm9taW5hbCBmaWVsZCwgd2hpY2ggaGFzIG5vIGluaGVyZW50IG9yZGVyLmBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignY2hhbm5lbENvbXBhdGFiaWxpdHkgbm90IGltcGxlbWVudGVkIGZvciBjaGFubmVsICcgKyBjaGFubmVsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPGFueT4pIHtcbiAgcmV0dXJuIGZpZWxkRGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnIHx8ICEhZmllbGREZWYuYmluO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUaW1lRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPGFueT4pIHtcbiAgcmV0dXJuIGZpZWxkRGVmLnR5cGUgPT09ICd0ZW1wb3JhbCcgfHwgISFmaWVsZERlZi50aW1lVW5pdDtcbn1cbiJdfQ==