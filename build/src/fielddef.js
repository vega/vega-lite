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
        // Expression to access flattened field. No need to escape dots.
        return util_1.flatAccessWithDatum(field, opt.expr);
    }
    else {
        // We flattened all fields so paths should have become dot.
        return util_1.replacePathInField(field);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRkZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsdUNBQWlFO0FBRWpFLHlDQUFpRTtBQUVqRSw2QkFBMEQ7QUFDMUQscUNBQTZDO0FBSzdDLDJCQUE2QjtBQU03Qix1Q0FBeUU7QUFDekUsK0JBQXVEO0FBQ3ZELCtCQUEwRTtBQStCMUUsZ0NBQTBDLENBQWlCO0lBQ3pELE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCx3REFFQztBQWdERCxxQkFBNEIsS0FBWTtJQUN0QyxPQUFPLEtBQUssSUFBSSxDQUFDLG9CQUFRLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxJQUFJLEtBQUssQ0FBQztBQUN4RCxDQUFDO0FBRkQsa0NBRUM7QUFnREQsd0JBQStCLFFBQTBCO0lBQ2hELElBQUEsc0JBQUssRUFBRSw0QkFBUSxFQUFFLGtCQUFHLEVBQUUsOEJBQVMsQ0FBYTtJQUNuRCw0QkFDSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxRQUFRLFVBQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDNUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxLQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ2xCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFDLFNBQVMsV0FBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUNqQyxLQUFLLE9BQUEsSUFDTDtBQUNKLENBQUM7QUFSRCx3Q0FRQztBQWlHRCwwQkFBb0MsVUFBeUI7SUFDM0QsT0FBTyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQ2hELENBQUM7QUFGRCw0Q0FFQztBQUVEOztHQUVHO0FBQ0gsZ0NBQTBDLFVBQXlCO0lBQ2pFLE9BQU8sQ0FB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QztBQUNqRixDQUFDO0FBckVELG9EQXFFQztBQUVELDBCQUFpQyxRQUF1QjtJQUN0RCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEtBQUssY0FBYyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQzVELENBQUM7QUFGRCw0Q0FFQztBQUVELHdCQUErQixRQUF1QjtJQUNwRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0FBQzdELENBQUM7QUFGRCx3Q0FFQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIERlY2xhcmF0aW9uIGFuZCB1dGlsaXR5IGZvciB2YXJpYW50cyBvZiBhIGZpZWxkIGRlZmluaXRpb24gb2JqZWN0XG5pbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcbmltcG9ydCB7aXNBcnJheSwgaXNCb29sZWFuLCBpc051bWJlciwgaXNTdHJpbmd9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5cbmltcG9ydCB7aXNBZ2dyZWdhdGVPcCwgaXNDb3VudGluZ0FnZ3JlZ2F0ZU9wfSBmcm9tICcuL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0F4aXN9IGZyb20gJy4vYXhpcyc7XG5pbXBvcnQge2F1dG9NYXhCaW5zLCBCaW5QYXJhbXMsIGJpblRvU3RyaW5nfSBmcm9tICcuL2Jpbic7XG5pbXBvcnQge0NoYW5uZWwsIHJhbmdlVHlwZX0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7Q29tcG9zaXRlQWdncmVnYXRlfSBmcm9tICcuL2NvbXBvc2l0ZW1hcmsnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7VGl0bGVNaXhpbnN9IGZyb20gJy4vZ3VpZGUnO1xuaW1wb3J0IHtMZWdlbmR9IGZyb20gJy4vbGVnZW5kJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuL2xvZyc7XG5pbXBvcnQge0xvZ2ljYWxPcGVyYW5kfSBmcm9tICcuL2xvZ2ljYWwnO1xuaW1wb3J0IHtQcmVkaWNhdGV9IGZyb20gJy4vcHJlZGljYXRlJztcbmltcG9ydCB7U2NhbGV9IGZyb20gJy4vc2NhbGUnO1xuaW1wb3J0IHtTb3J0RmllbGQsIFNvcnRPcmRlcn0gZnJvbSAnLi9zb3J0JztcbmltcG9ydCB7U3RhY2tPZmZzZXR9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHtnZXRUaW1lVW5pdFBhcnRzLCBub3JtYWxpemVUaW1lVW5pdCwgVGltZVVuaXR9IGZyb20gJy4vdGltZXVuaXQnO1xuaW1wb3J0IHtnZXRGdWxsTmFtZSwgUVVBTlRJVEFUSVZFLCBUeXBlfSBmcm9tICcuL3R5cGUnO1xuaW1wb3J0IHtmbGF0QWNjZXNzV2l0aERhdHVtLCByZXBsYWNlUGF0aEluRmllbGQsIHRpdGxlY2FzZX0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBEZWZpbml0aW9uIG9iamVjdCBmb3IgYSBjb25zdGFudCB2YWx1ZSBvZiBhbiBlbmNvZGluZyBjaGFubmVsLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbHVlRGVmIHtcbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgdmFsdWUgaW4gdmlzdWFsIGRvbWFpbiAoZS5nLiwgYFwicmVkXCJgIC8gXCIjMDA5OWZmXCIgZm9yIGNvbG9yLCB2YWx1ZXMgYmV0d2VlbiBgMGAgdG8gYDFgIGZvciBvcGFjaXR5KS5cbiAgICovXG4gIHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuO1xufVxuXG4vKipcbiAqIEdlbmVyaWMgdHlwZSBmb3IgY29uZGl0aW9uYWwgY2hhbm5lbERlZi5cbiAqIEYgZGVmaW5lcyB0aGUgdW5kZXJseWluZyBGaWVsZERlZiB0eXBlLlxuICovXG5leHBvcnQgdHlwZSBDaGFubmVsRGVmV2l0aENvbmRpdGlvbjxGIGV4dGVuZHMgRmllbGREZWY8YW55Pj4gPSBGaWVsZERlZldpdGhDb25kaXRpb248Rj4gfCBWYWx1ZURlZldpdGhDb25kaXRpb248Rj47XG5cbmV4cG9ydCB0eXBlIENvbmRpdGlvbmFsPFQ+ID0gQ29uZGl0aW9uYWxQcmVkaWNhdGU8VD4gfCBDb25kaXRpb25hbFNlbGVjdGlvbjxUPjtcblxuZXhwb3J0IHR5cGUgQ29uZGl0aW9uYWxQcmVkaWNhdGU8VD4gPSB7XG4gIHRlc3Q6IExvZ2ljYWxPcGVyYW5kPFByZWRpY2F0ZT47XG59ICYgVDtcblxuZXhwb3J0IHR5cGUgQ29uZGl0aW9uYWxTZWxlY3Rpb248VD4gPSB7XG4gIC8qKlxuICAgKiBBIFtzZWxlY3Rpb24gbmFtZV0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zZWxlY3Rpb24uaHRtbCksIG9yIGEgc2VyaWVzIG9mIFtjb21wb3NlZCBzZWxlY3Rpb25zXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NlbGVjdGlvbi5odG1sI2NvbXBvc2UpLlxuICAgKi9cbiAgc2VsZWN0aW9uOiBMb2dpY2FsT3BlcmFuZDxzdHJpbmc+O1xufSAmIFQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmRpdGlvbmFsU2VsZWN0aW9uPFQ+KGM6IENvbmRpdGlvbmFsPFQ+KTogYyBpcyBDb25kaXRpb25hbFNlbGVjdGlvbjxUPiB7XG4gIHJldHVybiBjWydzZWxlY3Rpb24nXTtcbn1cblxuLyoqXG4gKiBBIEZpZWxkRGVmIHdpdGggQ29uZGl0aW9uPFZhbHVlRGVmPlxuICoge1xuICogICBjb25kaXRpb246IHt2YWx1ZTogLi4ufSxcbiAqICAgZmllbGQ6IC4uLixcbiAqICAgLi4uXG4gKiB9XG4gKi9cbmV4cG9ydCB0eXBlIEZpZWxkRGVmV2l0aENvbmRpdGlvbjxGIGV4dGVuZHMgRmllbGREZWY8YW55Pj4gPSBGICYge1xuICAvKipcbiAgICogT25lIG9yIG1vcmUgdmFsdWUgZGVmaW5pdGlvbihzKSB3aXRoIGEgc2VsZWN0aW9uIHByZWRpY2F0ZS5cbiAgICpcbiAgICogX19Ob3RlOl9fIEEgZmllbGQgZGVmaW5pdGlvbidzIGBjb25kaXRpb25gIHByb3BlcnR5IGNhbiBvbmx5IGNvbnRhaW4gW3ZhbHVlIGRlZmluaXRpb25zXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2VuY29kaW5nLmh0bWwjdmFsdWUtZGVmKVxuICAgKiBzaW5jZSBWZWdhLUxpdGUgb25seSBhbGxvd3MgYXQgbW9zdCBvbmUgZW5jb2RlZCBmaWVsZCBwZXIgZW5jb2RpbmcgY2hhbm5lbC5cbiAgICovXG4gIGNvbmRpdGlvbj86IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdO1xufTtcblxuLyoqXG4gKiBBIFZhbHVlRGVmIHdpdGggQ29uZGl0aW9uPFZhbHVlRGVmIHwgRmllbGREZWY+XG4gKiB7XG4gKiAgIGNvbmRpdGlvbjoge2ZpZWxkOiAuLi59IHwge3ZhbHVlOiAuLi59LFxuICogICB2YWx1ZTogLi4uLFxuICogfVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbHVlRGVmV2l0aENvbmRpdGlvbjxGIGV4dGVuZHMgRmllbGREZWY8YW55Pj4ge1xuICAvKipcbiAgICogQSBmaWVsZCBkZWZpbml0aW9uIG9yIG9uZSBvciBtb3JlIHZhbHVlIGRlZmluaXRpb24ocykgd2l0aCBhIHNlbGVjdGlvbiBwcmVkaWNhdGUuXG4gICAqL1xuICBjb25kaXRpb24/OiBDb25kaXRpb25hbDxGPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdO1xuXG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IHZhbHVlIGluIHZpc3VhbCBkb21haW4uXG4gICAqL1xuICB2YWx1ZT86IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgcmVwZWF0ZWQgdmFsdWUuXG4gKi9cbmV4cG9ydCB0eXBlIFJlcGVhdFJlZiA9IHtcbiAgcmVwZWF0OiAncm93JyB8ICdjb2x1bW4nXG59O1xuXG5leHBvcnQgdHlwZSBGaWVsZCA9IHN0cmluZyB8IFJlcGVhdFJlZjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwZWF0UmVmKGZpZWxkOiBGaWVsZCk6IGZpZWxkIGlzIFJlcGVhdFJlZiB7XG4gIHJldHVybiBmaWVsZCAmJiAhaXNTdHJpbmcoZmllbGQpICYmICdyZXBlYXQnIGluIGZpZWxkO1xufVxuXG4vKiogQGhpZGUgKi9cbmV4cG9ydCB0eXBlIEhpZGRlbkNvbXBvc2l0ZUFnZ3JlZ2F0ZSA9IENvbXBvc2l0ZUFnZ3JlZ2F0ZTtcblxuZXhwb3J0IHR5cGUgQWdncmVnYXRlID0gQWdncmVnYXRlT3AgfCBIaWRkZW5Db21wb3NpdGVBZ2dyZWdhdGU7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGREZWZCYXNlPEY+IHtcblxuICAvKipcbiAgICogX19SZXF1aXJlZC5fXyBBIHN0cmluZyBkZWZpbmluZyB0aGUgbmFtZSBvZiB0aGUgZmllbGQgZnJvbSB3aGljaCB0byBwdWxsIGEgZGF0YSB2YWx1ZVxuICAgKiBvciBhbiBvYmplY3QgZGVmaW5pbmcgaXRlcmF0ZWQgdmFsdWVzIGZyb20gdGhlIFtgcmVwZWF0YF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9yZXBlYXQuaHRtbCkgb3BlcmF0b3IuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBEb3RzIChgLmApIGFuZCBicmFja2V0cyAoYFtgIGFuZCBgXWApIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyBuZXN0ZWQgb2JqZWN0cyAoZS5nLiwgYFwiZmllbGRcIjogXCJmb28uYmFyXCJgIGFuZCBgXCJmaWVsZFwiOiBcImZvb1snYmFyJ11cImApLlxuICAgKiBJZiBmaWVsZCBuYW1lcyBjb250YWluIGRvdHMgb3IgYnJhY2tldHMgYnV0IGFyZSBub3QgbmVzdGVkLCB5b3UgY2FuIHVzZSBgXFxcXGAgdG8gZXNjYXBlIGRvdHMgYW5kIGJyYWNrZXRzIChlLmcuLCBgXCJhXFxcXC5iXCJgIGFuZCBgXCJhXFxcXFswXFxcXF1cImApLlxuICAgKiBTZWUgbW9yZSBkZXRhaWxzIGFib3V0IGVzY2FwaW5nIGluIHRoZSBbZmllbGQgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9maWVsZC5odG1sKS5cbiAgICpcbiAgICogX19Ob3RlOl9fIGBmaWVsZGAgaXMgbm90IHJlcXVpcmVkIGlmIGBhZ2dyZWdhdGVgIGlzIGBjb3VudGAuXG4gICAqL1xuICBmaWVsZD86IEY7XG5cbiAgLy8gZnVuY3Rpb25cblxuICAvKipcbiAgICogVGltZSB1bml0IChlLmcuLCBgeWVhcmAsIGB5ZWFybW9udGhgLCBgbW9udGhgLCBgaG91cnNgKSBmb3IgYSB0ZW1wb3JhbCBmaWVsZC5cbiAgICogb3IgW2EgdGVtcG9yYWwgZmllbGQgdGhhdCBnZXRzIGNhc3RlZCBhcyBvcmRpbmFsXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3R5cGUuaHRtbCNjYXN0KS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB1bmRlZmluZWRgIChOb25lKVxuICAgKi9cbiAgdGltZVVuaXQ/OiBUaW1lVW5pdDtcblxuICAvKipcbiAgICogQSBmbGFnIGZvciBiaW5uaW5nIGEgYHF1YW50aXRhdGl2ZWAgZmllbGQsIG9yIFthbiBvYmplY3QgZGVmaW5pbmcgYmlubmluZyBwYXJhbWV0ZXJzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2Jpbi5odG1sI3BhcmFtcykuXG4gICAqIElmIGB0cnVlYCwgZGVmYXVsdCBbYmlubmluZyBwYXJhbWV0ZXJzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2Jpbi5odG1sKSB3aWxsIGJlIGFwcGxpZWQuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgZmFsc2VgXG4gICAqL1xuICBiaW4/OiBib29sZWFuIHwgQmluUGFyYW1zO1xuXG4gIC8qKlxuICAgKiBBZ2dyZWdhdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGZpZWxkXG4gICAqIChlLmcuLCBgbWVhbmAsIGBzdW1gLCBgbWVkaWFuYCwgYG1pbmAsIGBtYXhgLCBgY291bnRgKS5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB1bmRlZmluZWRgIChOb25lKVxuICAgKi9cbiAgYWdncmVnYXRlPzogQWdncmVnYXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9GaWVsZERlZkJhc2UoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pOiBGaWVsZERlZkJhc2U8c3RyaW5nPiB7XG4gIGNvbnN0IHtmaWVsZCwgdGltZVVuaXQsIGJpbiwgYWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICByZXR1cm4ge1xuICAgIC4uLih0aW1lVW5pdCA/IHt0aW1lVW5pdH0gOiB7fSksXG4gICAgLi4uKGJpbiA/IHtiaW59IDoge30pLFxuICAgIC4uLihhZ2dyZWdhdGUgPyB7YWdncmVnYXRlfSA6IHt9KSxcbiAgICBmaWVsZFxuICB9O1xufVxuXG4vKipcbiAqICBEZWZpbml0aW9uIG9iamVjdCBmb3IgYSBkYXRhIGZpZWxkLCBpdHMgdHlwZSBhbmQgdHJhbnNmb3JtYXRpb24gb2YgYW4gZW5jb2RpbmcgY2hhbm5lbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmQmFzZTxGPiwgVGl0bGVNaXhpbnMge1xuICAvKipcbiAgICogVGhlIGVuY29kZWQgZmllbGQncyB0eXBlIG9mIG1lYXN1cmVtZW50IChgXCJxdWFudGl0YXRpdmVcImAsIGBcInRlbXBvcmFsXCJgLCBgXCJvcmRpbmFsXCJgLCBvciBgXCJub21pbmFsXCJgKS5cbiAgICogSXQgY2FuIGFsc28gYmUgYSBgXCJnZW9qc29uXCJgIHR5cGUgZm9yIGVuY29kaW5nIFsnZ2Vvc2hhcGUnXShnZW9zaGFwZS5odG1sKS5cbiAgICovXG4gIC8vICogb3IgYW4gaW5pdGlhbCBjaGFyYWN0ZXIgb2YgdGhlIHR5cGUgbmFtZSAoYFwiUVwiYCwgYFwiVFwiYCwgYFwiT1wiYCwgYFwiTlwiYCkuXG4gIC8vICogVGhpcyBwcm9wZXJ0eSBpcyBjYXNlLWluc2Vuc2l0aXZlLlxuICB0eXBlOiBUeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjYWxlRmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiB0aGUgY2hhbm5lbCdzIHNjYWxlLCB3aGljaCBpcyB0aGUgZnVuY3Rpb24gdGhhdCB0cmFuc2Zvcm1zIHZhbHVlcyBpbiB0aGUgZGF0YSBkb21haW4gKG51bWJlcnMsIGRhdGVzLCBzdHJpbmdzLCBldGMpIHRvIHZpc3VhbCB2YWx1ZXMgKHBpeGVscywgY29sb3JzLCBzaXplcykgb2YgdGhlIGVuY29kaW5nIGNoYW5uZWxzLlxuICAgKlxuICAgKiBJZiBgbnVsbGAsIHRoZSBzY2FsZSB3aWxsIGJlIFtkaXNhYmxlZCBhbmQgdGhlIGRhdGEgdmFsdWUgd2lsbCBiZSBkaXJlY3RseSBlbmNvZGVkXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NjYWxlLmh0bWwjZGlzYWJsZSkuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBJZiB1bmRlZmluZWQsIGRlZmF1bHQgW3NjYWxlIHByb3BlcnRpZXNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2NhbGUuaHRtbCkgYXJlIGFwcGxpZWQuXG4gICAqL1xuICBzY2FsZT86IFNjYWxlIHwgbnVsbDtcblxuICAvKipcbiAgICogU29ydCBvcmRlciBmb3IgdGhlIGVuY29kZWQgZmllbGQuXG4gICAqIFN1cHBvcnRlZCBgc29ydGAgdmFsdWVzIGluY2x1ZGUgYFwiYXNjZW5kaW5nXCJgLCBgXCJkZXNjZW5kaW5nXCJgLCBgbnVsbGAgKG5vIHNvcnRpbmcpLCBvciBhbiBhcnJheSBzcGVjaWZ5aW5nIHRoZSBwcmVmZXJyZWQgb3JkZXIgb2YgdmFsdWVzLlxuICAgKiBGb3IgZmllbGRzIHdpdGggZGlzY3JldGUgZG9tYWlucywgYHNvcnRgIGNhbiBhbHNvIGJlIGEgW3NvcnQgZmllbGQgZGVmaW5pdGlvbiBvYmplY3RdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc29ydC5odG1sI3NvcnQtZmllbGQpLlxuICAgKiBGb3IgYHNvcnRgIGFzIGFuIFthcnJheSBzcGVjaWZ5aW5nIHRoZSBwcmVmZXJyZWQgb3JkZXIgb2YgdmFsdWVzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NvcnQuaHRtbCNzb3J0LWFycmF5KSwgdGhlIHNvcnQgb3JkZXIgd2lsbCBvYmV5IHRoZSB2YWx1ZXMgaW4gdGhlIGFycmF5LCBmb2xsb3dlZCBieSBhbnkgdW5zcGVjaWZpZWQgdmFsdWVzIGluIHRoZWlyIG9yaWdpbmFsIG9yZGVyLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYFwiYXNjZW5kaW5nXCJgXG4gICAqL1xuICBzb3J0Pzogc3RyaW5nW10gfCBTb3J0T3JkZXIgfCBTb3J0RmllbGQ8Rj4gfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uRmllbGREZWY8Rj4gZXh0ZW5kcyBTY2FsZUZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIGF4aXMncyBncmlkbGluZXMsIHRpY2tzIGFuZCBsYWJlbHMuXG4gICAqIElmIGBudWxsYCwgdGhlIGF4aXMgZm9yIHRoZSBlbmNvZGluZyBjaGFubmVsIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIElmIHVuZGVmaW5lZCwgZGVmYXVsdCBbYXhpcyBwcm9wZXJ0aWVzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2F4aXMuaHRtbCkgYXJlIGFwcGxpZWQuXG4gICAqL1xuICBheGlzPzogQXhpcyB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2Ygc3RhY2tpbmcgb2Zmc2V0IGlmIHRoZSBmaWVsZCBzaG91bGQgYmUgc3RhY2tlZC5cbiAgICogYHN0YWNrYCBpcyBvbmx5IGFwcGxpY2FibGUgZm9yIGB4YCBhbmQgYHlgIGNoYW5uZWxzIHdpdGggY29udGludW91cyBkb21haW5zLlxuICAgKiBGb3IgZXhhbXBsZSwgYHN0YWNrYCBvZiBgeWAgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIHN0YWNraW5nIGZvciBhIHZlcnRpY2FsIGJhciBjaGFydC5cbiAgICpcbiAgICogYHN0YWNrYCBjYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICAgKiAtIGBcInplcm9cImA6IHN0YWNraW5nIHdpdGggYmFzZWxpbmUgb2Zmc2V0IGF0IHplcm8gdmFsdWUgb2YgdGhlIHNjYWxlIChmb3IgY3JlYXRpbmcgdHlwaWNhbCBzdGFja2VkIFtiYXJdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3RhY2suaHRtbCNiYXIpIGFuZCBbYXJlYV0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zdGFjay5odG1sI2FyZWEpIGNoYXJ0KS5cbiAgICogLSBgXCJub3JtYWxpemVcImAgLSBzdGFja2luZyB3aXRoIG5vcm1hbGl6ZWQgZG9tYWluIChmb3IgY3JlYXRpbmcgW25vcm1hbGl6ZWQgc3RhY2tlZCBiYXIgYW5kIGFyZWEgY2hhcnRzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3N0YWNrLmh0bWwjbm9ybWFsaXplZCkuIDxici8+XG4gICAqIC1gXCJjZW50ZXJcImAgLSBzdGFja2luZyB3aXRoIGNlbnRlciBiYXNlbGluZSAoZm9yIFtzdHJlYW1ncmFwaF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zdGFjay5odG1sI3N0cmVhbWdyYXBoKSkuXG4gICAqIC0gYG51bGxgIC0gTm8tc3RhY2tpbmcuIFRoaXMgd2lsbCBwcm9kdWNlIGxheWVyZWQgW2Jhcl0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zdGFjay5odG1sI2xheWVyZWQtYmFyLWNoYXJ0KSBhbmQgYXJlYSBjaGFydC5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIGB6ZXJvYCBmb3IgcGxvdHMgd2l0aCBhbGwgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSB0cnVlOlxuICAgKiAoMSkgdGhlIG1hcmsgaXMgYGJhcmAgb3IgYGFyZWFgO1xuICAgKiAoMikgdGhlIHN0YWNrZWQgbWVhc3VyZSBjaGFubmVsICh4IG9yIHkpIGhhcyBhIGxpbmVhciBzY2FsZTtcbiAgICogKDMpIEF0IGxlYXN0IG9uZSBvZiBub24tcG9zaXRpb24gY2hhbm5lbHMgbWFwcGVkIHRvIGFuIHVuYWdncmVnYXRlZCBmaWVsZCB0aGF0IGlzIGRpZmZlcmVudCBmcm9tIHggYW5kIHkuICBPdGhlcndpc2UsIGBudWxsYCBieSBkZWZhdWx0LlxuICAgKi9cbiAgc3RhY2s/OiBTdGFja09mZnNldCB8IG51bGw7XG59XG5cbi8qKlxuICogRmllbGQgZGVmaW5pdGlvbiBvZiBhIG1hcmsgcHJvcGVydHksIHdoaWNoIGNhbiBjb250YWluIGEgbGVnZW5kLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtQcm9wRmllbGREZWY8Rj4gZXh0ZW5kcyBTY2FsZUZpZWxkRGVmPEY+IHtcbiAgIC8qKlxuICAgICogQW4gb2JqZWN0IGRlZmluaW5nIHByb3BlcnRpZXMgb2YgdGhlIGxlZ2VuZC5cbiAgICAqIElmIGBudWxsYCwgdGhlIGxlZ2VuZCBmb3IgdGhlIGVuY29kaW5nIGNoYW5uZWwgd2lsbCBiZSByZW1vdmVkLlxuICAgICpcbiAgICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBJZiB1bmRlZmluZWQsIGRlZmF1bHQgW2xlZ2VuZCBwcm9wZXJ0aWVzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2xlZ2VuZC5odG1sKSBhcmUgYXBwbGllZC5cbiAgICAqL1xuICBsZWdlbmQ/OiBMZWdlbmQgfCBudWxsO1xufVxuXG4vLyBEZXRhaWxcblxuLy8gT3JkZXIgUGF0aCBoYXZlIG5vIHNjYWxlXG5cbmV4cG9ydCBpbnRlcmZhY2UgT3JkZXJGaWVsZERlZjxGPiBleHRlbmRzIEZpZWxkRGVmPEY+IHtcbiAgLyoqXG4gICAqIFRoZSBzb3J0IG9yZGVyLiBPbmUgb2YgYFwiYXNjZW5kaW5nXCJgIChkZWZhdWx0KSBvciBgXCJkZXNjZW5kaW5nXCJgLlxuICAgKi9cbiAgc29ydD86IFNvcnRPcmRlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZXh0RmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBUaGUgW2Zvcm1hdHRpbmcgcGF0dGVybl0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9mb3JtYXQuaHRtbCkgZm9yIGEgdGV4dCBmaWVsZC4gSWYgbm90IGRlZmluZWQsIHRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBmb3JtYXQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIENoYW5uZWxEZWY8Rj4gPSBDaGFubmVsRGVmV2l0aENvbmRpdGlvbjxGaWVsZERlZjxGPj47XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmRpdGlvbmFsRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIENoYW5uZWxEZWZXaXRoQ29uZGl0aW9uPEZpZWxkRGVmPEY+PiB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgISFjaGFubmVsRGVmLmNvbmRpdGlvbjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gaWYgYSBjaGFubmVsRGVmIGlzIGEgQ29uZGl0aW9uYWxWYWx1ZURlZiB3aXRoIENvbmRpdGlvbkZpZWxkRGVmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNDb25kaXRpb25hbEZpZWxkRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIChWYWx1ZURlZiAmIHtjb25kaXRpb246IENvbmRpdGlvbmFsPEZpZWxkRGVmPEY+Pn0pIHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAhIWNoYW5uZWxEZWYuY29uZGl0aW9uICYmICFpc0FycmF5KGNoYW5uZWxEZWYuY29uZGl0aW9uKSAmJiBpc0ZpZWxkRGVmKGNoYW5uZWxEZWYuY29uZGl0aW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0NvbmRpdGlvbmFsVmFsdWVEZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgKFZhbHVlRGVmICYge2NvbmRpdGlvbjogQ29uZGl0aW9uYWw8VmFsdWVEZWY+IHwgQ29uZGl0aW9uYWw8VmFsdWVEZWY+W119KSB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgISFjaGFubmVsRGVmLmNvbmRpdGlvbiAmJiAoXG4gICAgaXNBcnJheShjaGFubmVsRGVmLmNvbmRpdGlvbikgfHwgaXNWYWx1ZURlZihjaGFubmVsRGVmLmNvbmRpdGlvbilcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmllbGREZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgRmllbGREZWY8Rj4gfCBQb3NpdGlvbkZpZWxkRGVmPEY+IHwgU2NhbGVGaWVsZERlZjxGPiB8IE1hcmtQcm9wRmllbGREZWY8Rj4gfCBPcmRlckZpZWxkRGVmPEY+IHwgVGV4dEZpZWxkRGVmPEY+IHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAoISFjaGFubmVsRGVmWydmaWVsZCddIHx8IGNoYW5uZWxEZWZbJ2FnZ3JlZ2F0ZSddID09PSAnY291bnQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nRmllbGREZWYoZmllbGREZWY6IENoYW5uZWxEZWY8c3RyaW5nfFJlcGVhdFJlZj4pOiBmaWVsZERlZiBpcyBGaWVsZERlZjxzdHJpbmc+IHtcbiAgcmV0dXJuIGlzRmllbGREZWYoZmllbGREZWYpICYmIGlzU3RyaW5nKGZpZWxkRGVmLmZpZWxkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsdWVEZWY8Rj4oY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGPik6IGNoYW5uZWxEZWYgaXMgVmFsdWVEZWYge1xuICByZXR1cm4gY2hhbm5lbERlZiAmJiAndmFsdWUnIGluIGNoYW5uZWxEZWYgJiYgY2hhbm5lbERlZlsndmFsdWUnXSAhPT0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTY2FsZUZpZWxkRGVmKGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8YW55Pik6IGNoYW5uZWxEZWYgaXMgU2NhbGVGaWVsZERlZjxhbnk+IHtcbiAgcmV0dXJuICEhY2hhbm5lbERlZiAmJiAoISFjaGFubmVsRGVmWydzY2FsZSddIHx8ICEhY2hhbm5lbERlZlsnc29ydCddKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGaWVsZFJlZk9wdGlvbiB7XG4gIC8qKiBleGNsdWRlIGJpbiwgYWdncmVnYXRlLCB0aW1lVW5pdCAqL1xuICBub2ZuPzogYm9vbGVhbjtcbiAgLyoqIFdyYXAgdGhlIGZpZWxkIHdpdGggZGF0dW0gb3IgcGFyZW50IChlLmcuLCBkYXR1bVsnLi4uJ10gZm9yIFZlZ2EgRXhwcmVzc2lvbiAqL1xuICBleHByPzogJ2RhdHVtJyB8ICdwYXJlbnQnO1xuICAvKiogcHJlcGVuZCBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXggKi9cbiAgcHJlZml4Pzogc3RyaW5nO1xuICAvKiogYXBwZW5kIHN1ZmZpeCB0byB0aGUgZmllbGQgcmVmIGZvciBiaW4gKGRlZmF1bHQ9J3N0YXJ0JykgKi9cbiAgYmluU3VmZml4PzogJ2VuZCcgfCAncmFuZ2UnIHwgJ21pZCc7XG4gIC8qKiBhcHBlbmQgc3VmZml4IHRvIHRoZSBmaWVsZCByZWYgKGdlbmVyYWwpICovXG4gIHN1ZmZpeD86IHN0cmluZztcbiAgLyoqIE92ZXJyaWRlIHdoaWNoIGFnZ3JlZ2F0ZSB0byB1c2UuIE5lZWRlZCBmb3IgdW5hZ2dyZWdhdGVkIGRvbWFpbi4gKi9cbiAgYWdncmVnYXRlPzogQWdncmVnYXRlT3A7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2Z0ZpZWxkKGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8c3RyaW5nPiwgb3B0OiBGaWVsZFJlZk9wdGlvbiA9IHt9KTogc3RyaW5nIHtcbiAgbGV0IGZpZWxkID0gZmllbGREZWYuZmllbGQ7XG4gIGNvbnN0IHByZWZpeCA9IG9wdC5wcmVmaXg7XG4gIGxldCBzdWZmaXggPSBvcHQuc3VmZml4O1xuXG4gIGlmIChpc0NvdW50KGZpZWxkRGVmKSkge1xuICAgIGZpZWxkID0gJ2NvdW50XyonO1xuICB9IGVsc2Uge1xuICAgIGxldCBmbjogc3RyaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFvcHQubm9mbikge1xuICAgICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgICBmbiA9IGJpblRvU3RyaW5nKGZpZWxkRGVmLmJpbik7XG4gICAgICAgIHN1ZmZpeCA9IG9wdC5iaW5TdWZmaXggfHwgJyc7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICBmbiA9IFN0cmluZyhvcHQuYWdncmVnYXRlIHx8IGZpZWxkRGVmLmFnZ3JlZ2F0ZSk7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIGZuID0gU3RyaW5nKGZpZWxkRGVmLnRpbWVVbml0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm4pIHtcbiAgICAgIGZpZWxkID0gYCR7Zm59XyR7ZmllbGR9YDtcbiAgICB9XG4gIH1cblxuICBpZiAoc3VmZml4KSB7XG4gICAgZmllbGQgPSBgJHtmaWVsZH1fJHtzdWZmaXh9YDtcbiAgfVxuXG4gIGlmIChwcmVmaXgpIHtcbiAgICBmaWVsZCA9IGAke3ByZWZpeH1fJHtmaWVsZH1gO1xuICB9XG5cbiAgaWYgKG9wdC5leHByKSB7XG4gICAgLy8gRXhwcmVzc2lvbiB0byBhY2Nlc3MgZmxhdHRlbmVkIGZpZWxkLiBObyBuZWVkIHRvIGVzY2FwZSBkb3RzLlxuICAgIHJldHVybiBmbGF0QWNjZXNzV2l0aERhdHVtKGZpZWxkLCBvcHQuZXhwcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gV2UgZmxhdHRlbmVkIGFsbCBmaWVsZHMgc28gcGF0aHMgc2hvdWxkIGhhdmUgYmVjb21lIGRvdC5cbiAgICByZXR1cm4gcmVwbGFjZVBhdGhJbkZpZWxkKGZpZWxkKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEaXNjcmV0ZShmaWVsZERlZjogRmllbGREZWY8RmllbGQ+KSB7XG4gIHN3aXRjaCAoZmllbGREZWYudHlwZSkge1xuICAgIGNhc2UgJ25vbWluYWwnOlxuICAgIGNhc2UgJ29yZGluYWwnOlxuICAgIGNhc2UgJ2dlb2pzb24nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSAncXVhbnRpdGF0aXZlJzpcbiAgICAgIHJldHVybiAhIWZpZWxkRGVmLmJpbjtcbiAgICBjYXNlICdsYXRpdHVkZSc6XG4gICAgY2FzZSAnbG9uZ2l0dWRlJzpcbiAgICBjYXNlICd0ZW1wb3JhbCc6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGxvZy5tZXNzYWdlLmludmFsaWRGaWVsZFR5cGUoZmllbGREZWYudHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb250aW51b3VzKGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4pIHtcbiAgcmV0dXJuICFpc0Rpc2NyZXRlKGZpZWxkRGVmKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ291bnQoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxGaWVsZD4pIHtcbiAgcmV0dXJuIGZpZWxkRGVmLmFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jztcbn1cblxuZXhwb3J0IHR5cGUgRmllbGRUaXRsZUZvcm1hdHRlciA9IChmaWVsZERlZjogRmllbGREZWZCYXNlPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSA9PiBzdHJpbmc7XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJiYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZjogRmllbGREZWZCYXNlPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IHtmaWVsZDogZmllbGQsIGJpbiwgdGltZVVuaXQsIGFnZ3JlZ2F0ZX0gPSBmaWVsZERlZjtcbiAgaWYgKGFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jykge1xuICAgIHJldHVybiBjb25maWcuY291bnRUaXRsZTtcbiAgfSBlbHNlIGlmIChiaW4pIHtcbiAgICByZXR1cm4gYCR7ZmllbGR9IChiaW5uZWQpYDtcbiAgfSBlbHNlIGlmICh0aW1lVW5pdCkge1xuICAgIGNvbnN0IHVuaXRzID0gZ2V0VGltZVVuaXRQYXJ0cyh0aW1lVW5pdCkuam9pbignLScpO1xuICAgIHJldHVybiBgJHtmaWVsZH0gKCR7dW5pdHN9KWA7XG4gIH0gZWxzZSBpZiAoYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIGAke3RpdGxlY2FzZShhZ2dyZWdhdGUpfSBvZiAke2ZpZWxkfWA7XG4gIH1cbiAgcmV0dXJuIGZpZWxkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25hbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgZm4gPSBmaWVsZERlZi5hZ2dyZWdhdGUgfHwgZmllbGREZWYudGltZVVuaXQgfHwgKGZpZWxkRGVmLmJpbiAmJiAnYmluJyk7XG4gIGlmIChmbikge1xuICAgIHJldHVybiBmbi50b1VwcGVyQ2FzZSgpICsgJygnICsgZmllbGREZWYuZmllbGQgKyAnKSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZpZWxkRGVmLmZpZWxkO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0VGl0bGVGb3JtYXR0ZXI6IEZpZWxkVGl0bGVGb3JtYXR0ZXIgPSAoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxzdHJpbmc+LCBjb25maWc6IENvbmZpZykgPT4ge1xuICBzd2l0Y2ggKGNvbmZpZy5maWVsZFRpdGxlKSB7XG4gICAgY2FzZSAncGxhaW4nOlxuICAgICAgcmV0dXJuIGZpZWxkRGVmLmZpZWxkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uYWwnOlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZiwgY29uZmlnKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHZlcmJhbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xuICB9XG59O1xuXG5sZXQgdGl0bGVGb3JtYXR0ZXIgPSBkZWZhdWx0VGl0bGVGb3JtYXR0ZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRUaXRsZUZvcm1hdHRlcihmb3JtYXR0ZXI6IEZpZWxkVGl0bGVGb3JtYXR0ZXIpIHtcbiAgdGl0bGVGb3JtYXR0ZXIgPSBmb3JtYXR0ZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldFRpdGxlRm9ybWF0dGVyKCkge1xuICBzZXRUaXRsZUZvcm1hdHRlcihkZWZhdWx0VGl0bGVGb3JtYXR0ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICByZXR1cm4gdGl0bGVGb3JtYXR0ZXIoZmllbGREZWYsIGNvbmZpZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0VHlwZShmaWVsZERlZjogRmllbGREZWY8RmllbGQ+LCBjaGFubmVsOiBDaGFubmVsKTogVHlwZSB7XG4gIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgIHJldHVybiAndGVtcG9yYWwnO1xuICB9XG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICByZXR1cm4gJ3F1YW50aXRhdGl2ZSc7XG4gIH1cbiAgc3dpdGNoIChyYW5nZVR5cGUoY2hhbm5lbCkpIHtcbiAgICBjYXNlICdjb250aW51b3VzJzpcbiAgICAgIHJldHVybiAncXVhbnRpdGF0aXZlJztcbiAgICBjYXNlICdkaXNjcmV0ZSc6XG4gICAgICByZXR1cm4gJ25vbWluYWwnO1xuICAgIGNhc2UgJ2ZsZXhpYmxlJzogLy8gY29sb3JcbiAgICAgIHJldHVybiAnbm9taW5hbCc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAncXVhbnRpdGF0aXZlJztcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpZWxkRGVmIC0tIGVpdGhlciBmcm9tIHRoZSBvdXRlciBjaGFubmVsRGVmIG9yIGZyb20gdGhlIGNvbmRpdGlvbiBvZiBjaGFubmVsRGVmLlxuICogQHBhcmFtIGNoYW5uZWxEZWZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpZWxkRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBGaWVsZERlZjxGPiB7XG4gIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIGNoYW5uZWxEZWY7XG4gIH0gZWxzZSBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiBjaGFubmVsRGVmLmNvbmRpdGlvbjtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENvbnZlcnQgdHlwZSB0byBmdWxsLCBsb3dlcmNhc2UgdHlwZSwgb3IgYXVnbWVudCB0aGUgZmllbGREZWYgd2l0aCBhIGRlZmF1bHQgdHlwZSBpZiBtaXNzaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCk6IENoYW5uZWxEZWY8YW55PiB7XG4gIGlmIChpc1N0cmluZyhjaGFubmVsRGVmKSB8fCBpc051bWJlcihjaGFubmVsRGVmKSB8fCBpc0Jvb2xlYW4oY2hhbm5lbERlZikpIHtcbiAgICBjb25zdCBwcmltaXRpdmVUeXBlID0gaXNTdHJpbmcoY2hhbm5lbERlZikgPyAnc3RyaW5nJyA6XG4gICAgICBpc051bWJlcihjaGFubmVsRGVmKSA/ICdudW1iZXInIDogJ2Jvb2xlYW4nO1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnByaW1pdGl2ZUNoYW5uZWxEZWYoY2hhbm5lbCwgcHJpbWl0aXZlVHlwZSwgY2hhbm5lbERlZikpO1xuICAgIHJldHVybiB7dmFsdWU6IGNoYW5uZWxEZWZ9O1xuICB9XG5cbiAgLy8gSWYgYSBmaWVsZERlZiBjb250YWlucyBhIGZpZWxkLCB3ZSBuZWVkIHR5cGUuXG4gIGlmIChpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZUZpZWxkRGVmKGNoYW5uZWxEZWYsIGNoYW5uZWwpO1xuICB9IGVsc2UgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uY2hhbm5lbERlZixcbiAgICAgIC8vIE5lZWQgdG8gY2FzdCBhcyBub3JtYWxpemVGaWVsZERlZiBub3JtYWxseSByZXR1cm4gRmllbGREZWYsIGJ1dCBoZXJlIHdlIGtub3cgdGhhdCBpdCBpcyBkZWZpbml0ZWx5IENvbmRpdGlvbjxGaWVsZERlZj5cbiAgICAgIGNvbmRpdGlvbjogbm9ybWFsaXplRmllbGREZWYoY2hhbm5lbERlZi5jb25kaXRpb24sIGNoYW5uZWwpIGFzIENvbmRpdGlvbmFsPEZpZWxkRGVmPHN0cmluZz4+XG4gICAgfTtcbiAgfVxuICByZXR1cm4gY2hhbm5lbERlZjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAvLyBEcm9wIGludmFsaWQgYWdncmVnYXRlXG4gIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUgJiYgIWlzQWdncmVnYXRlT3AoZmllbGREZWYuYWdncmVnYXRlKSkge1xuICAgIGNvbnN0IHthZ2dyZWdhdGUsIC4uLmZpZWxkRGVmV2l0aG91dEFnZ3JlZ2F0ZX0gPSBmaWVsZERlZjtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkQWdncmVnYXRlKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpO1xuICAgIGZpZWxkRGVmID0gZmllbGREZWZXaXRob3V0QWdncmVnYXRlO1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIFRpbWUgVW5pdFxuICBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICBmaWVsZERlZiA9IHtcbiAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgdGltZVVuaXQ6IG5vcm1hbGl6ZVRpbWVVbml0KGZpZWxkRGVmLnRpbWVVbml0KVxuICAgIH07XG4gIH1cblxuICAvLyBOb3JtYWxpemUgYmluXG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICBmaWVsZERlZiA9IHtcbiAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgYmluOiBub3JtYWxpemVCaW4oZmllbGREZWYuYmluLCBjaGFubmVsKVxuICAgIH07XG4gIH1cblxuICAvLyBOb3JtYWxpemUgVHlwZVxuICBpZiAoZmllbGREZWYudHlwZSkge1xuICAgIGNvbnN0IGZ1bGxUeXBlID0gZ2V0RnVsbE5hbWUoZmllbGREZWYudHlwZSk7XG4gICAgaWYgKGZpZWxkRGVmLnR5cGUgIT09IGZ1bGxUeXBlKSB7XG4gICAgICAvLyBjb252ZXJ0IHNob3J0IHR5cGUgdG8gZnVsbCB0eXBlXG4gICAgICBmaWVsZERlZiA9IHtcbiAgICAgICAgLi4uZmllbGREZWYsXG4gICAgICAgIHR5cGU6IGZ1bGxUeXBlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoZmllbGREZWYudHlwZSAhPT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICAgIGlmIChpc0NvdW50aW5nQWdncmVnYXRlT3AoZmllbGREZWYuYWdncmVnYXRlKSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkRmllbGRUeXBlRm9yQ291bnRBZ2dyZWdhdGUoZmllbGREZWYudHlwZSwgZmllbGREZWYuYWdncmVnYXRlKSk7XG4gICAgICAgIGZpZWxkRGVmID0ge1xuICAgICAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElmIHR5cGUgaXMgZW1wdHkgLyBpbnZhbGlkLCB0aGVuIGF1Z21lbnQgd2l0aCBkZWZhdWx0IHR5cGVcbiAgICBjb25zdCBuZXdUeXBlID0gZGVmYXVsdFR5cGUoZmllbGREZWYsIGNoYW5uZWwpO1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmVtcHR5T3JJbnZhbGlkRmllbGRUeXBlKGZpZWxkRGVmLnR5cGUsIGNoYW5uZWwsIG5ld1R5cGUpKTtcbiAgICBmaWVsZERlZiA9IHtcbiAgICAgICAgLi4uZmllbGREZWYsXG4gICAgICB0eXBlOiBuZXdUeXBlXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHtjb21wYXRpYmxlLCB3YXJuaW5nfSA9IGNoYW5uZWxDb21wYXRpYmlsaXR5KGZpZWxkRGVmLCBjaGFubmVsKTtcbiAgaWYgKCFjb21wYXRpYmxlKSB7XG4gICAgbG9nLndhcm4od2FybmluZyk7XG4gIH1cbiAgcmV0dXJuIGZpZWxkRGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQmluKGJpbjogQmluUGFyYW1zfGJvb2xlYW4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgaWYgKGlzQm9vbGVhbihiaW4pKSB7XG4gICAgcmV0dXJuIHttYXhiaW5zOiBhdXRvTWF4QmlucyhjaGFubmVsKX07XG4gIH0gZWxzZSBpZiAoIWJpbi5tYXhiaW5zICYmICFiaW4uc3RlcCkge1xuICAgIHJldHVybiB7Li4uYmluLCBtYXhiaW5zOiBhdXRvTWF4QmlucyhjaGFubmVsKX07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJpbjtcbiAgfVxufVxuXG5jb25zdCBDT01QQVRJQkxFID0ge2NvbXBhdGlibGU6IHRydWV9O1xuZXhwb3J0IGZ1bmN0aW9uIGNoYW5uZWxDb21wYXRpYmlsaXR5KGZpZWxkRGVmOiBGaWVsZERlZjxGaWVsZD4sIGNoYW5uZWw6IENoYW5uZWwpOiB7Y29tcGF0aWJsZTogYm9vbGVhbjsgd2FybmluZz86IHN0cmluZzt9IHtcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSAncm93JzpcbiAgICBjYXNlICdjb2x1bW4nOlxuICAgICAgaWYgKGlzQ29udGludW91cyhmaWVsZERlZikgJiYgIWZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIC8vIFRPRE86KGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjAxMSk6XG4gICAgICAgIC8vIHdpdGggdGltZVVuaXQgaXQncyBub3QgYWx3YXlzIHN0cmljdGx5IGNvbnRpbnVvdXNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBsb2cubWVzc2FnZS5mYWNldENoYW5uZWxTaG91bGRCZURpc2NyZXRlKGNoYW5uZWwpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ3gnOlxuICAgIGNhc2UgJ3knOlxuICAgIGNhc2UgJ2NvbG9yJzpcbiAgICBjYXNlICdmaWxsJzpcbiAgICBjYXNlICdzdHJva2UnOlxuICAgIGNhc2UgJ3RleHQnOlxuICAgIGNhc2UgJ2RldGFpbCc6XG4gICAgY2FzZSAna2V5JzpcbiAgICBjYXNlICd0b29sdGlwJzpcbiAgICBjYXNlICdocmVmJzpcbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnbG9uZ2l0dWRlJzpcbiAgICBjYXNlICdsb25naXR1ZGUyJzpcbiAgICBjYXNlICdsYXRpdHVkZSc6XG4gICAgY2FzZSAnbGF0aXR1ZGUyJzpcbiAgICAgIGlmIChmaWVsZERlZi50eXBlICE9PSBRVUFOVElUQVRJVkUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBgQ2hhbm5lbCAke2NoYW5uZWx9IHNob3VsZCBub3QgYmUgdXNlZCB3aXRoICR7ZmllbGREZWYudHlwZX0gZmllbGQuYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICdvcGFjaXR5JzpcbiAgICBjYXNlICdzaXplJzpcbiAgICBjYXNlICd4Mic6XG4gICAgY2FzZSAneTInOlxuICAgICAgaWYgKGlzRGlzY3JldGUoZmllbGREZWYpICYmICFmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBgQ2hhbm5lbCAke2NoYW5uZWx9IHNob3VsZCBub3QgYmUgdXNlZCB3aXRoIGRpc2NyZXRlIGZpZWxkLmBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnc2hhcGUnOlxuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgIT09ICdub21pbmFsJyAmJiBmaWVsZERlZi50eXBlICE9PSAnZ2VvanNvbicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiAnU2hhcGUgY2hhbm5lbCBzaG91bGQgYmUgdXNlZCB3aXRoIG5vbWluYWwgZGF0YSBvciBnZW9qc29uIG9ubHknXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ29yZGVyJzpcbiAgICAgIGlmIChmaWVsZERlZi50eXBlID09PSAnbm9taW5hbCcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb21wYXRpYmxlOiBmYWxzZSxcbiAgICAgICAgICB3YXJuaW5nOiBgQ2hhbm5lbCBvcmRlciBpcyBpbmFwcHJvcHJpYXRlIGZvciBub21pbmFsIGZpZWxkLCB3aGljaCBoYXMgbm8gaW5oZXJlbnQgb3JkZXIuYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdjaGFubmVsQ29tcGF0YWJpbGl0eSBub3QgaW1wbGVtZW50ZWQgZm9yIGNoYW5uZWwgJyArIGNoYW5uZWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXJGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8YW55Pikge1xuICByZXR1cm4gZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScgfHwgISFmaWVsZERlZi5iaW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RpbWVGaWVsZERlZihmaWVsZERlZjogRmllbGREZWY8YW55Pikge1xuICByZXR1cm4gZmllbGREZWYudHlwZSA9PT0gJ3RlbXBvcmFsJyB8fCAhIWZpZWxkRGVmLnRpbWVVbml0O1xufVxuIl19