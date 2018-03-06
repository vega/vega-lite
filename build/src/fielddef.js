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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRkZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9FQUFvRTtBQUNwRSx1Q0FBaUU7QUFDakUseUNBQThFO0FBRTlFLDZCQUEwRDtBQUMxRCxxQ0FBNkM7QUFJN0MsMkJBQTZCO0FBTTdCLHVDQUF5RTtBQUN6RSwrQkFBeUM7QUFDekMsK0JBQTZDO0FBK0I3QyxnQ0FBMEMsQ0FBaUI7SUFDekQsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBRkQsd0RBRUM7QUFnREQscUJBQTRCLEtBQVk7SUFDdEMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLG9CQUFRLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxJQUFJLEtBQUssQ0FBQztBQUN4RCxDQUFDO0FBRkQsa0NBRUM7QUE0SUQsMEJBQW9DLFVBQXlCO0lBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQ2hELENBQUM7QUFGRCw0Q0FFQztBQUVEOztHQUVHO0FBQ0gsZ0NBQTBDLFVBQXlCO0lBQ2pFLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxJQUFJLENBQUMsbUJBQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0SCxDQUFDO0FBRkQsd0RBRUM7QUFFRCxnQ0FBMEMsVUFBeUI7SUFDakUsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLElBQUksQ0FDL0MsbUJBQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMs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QUFRLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUM3RCxDQUFDO0FBRkQsd0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEZWNsYXJhdGlvbiBhbmQgdXRpbGl0eSBmb3IgdmFyaWFudHMgb2YgYSBmaWVsZCBkZWZpbml0aW9uIG9iamVjdFxuaW1wb3J0IHtpc0FycmF5LCBpc0Jvb2xlYW4sIGlzTnVtYmVyLCBpc1N0cmluZ30gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7QWdncmVnYXRlT3AsIGlzQWdncmVnYXRlT3AsIGlzQ291bnRpbmdBZ2dyZWdhdGVPcH0gZnJvbSAnLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtBeGlzfSBmcm9tICcuL2F4aXMnO1xuaW1wb3J0IHthdXRvTWF4QmlucywgQmluUGFyYW1zLCBiaW5Ub1N0cmluZ30gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDaGFubmVsLCByYW5nZVR5cGV9IGZyb20gJy4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbXBvc2l0ZUFnZ3JlZ2F0ZX0gZnJvbSAnLi9jb21wb3NpdGVtYXJrJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge0xlZ2VuZH0gZnJvbSAnLi9sZWdlbmQnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4vbG9nJztcbmltcG9ydCB7TG9naWNhbE9wZXJhbmR9IGZyb20gJy4vbG9naWNhbCc7XG5pbXBvcnQge1ByZWRpY2F0ZX0gZnJvbSAnLi9wcmVkaWNhdGUnO1xuaW1wb3J0IHtTY2FsZX0gZnJvbSAnLi9zY2FsZSc7XG5pbXBvcnQge1NvcnRGaWVsZCwgU29ydE9yZGVyfSBmcm9tICcuL3NvcnQnO1xuaW1wb3J0IHtTdGFja09mZnNldH0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge2dldFRpbWVVbml0UGFydHMsIG5vcm1hbGl6ZVRpbWVVbml0LCBUaW1lVW5pdH0gZnJvbSAnLi90aW1ldW5pdCc7XG5pbXBvcnQge2dldEZ1bGxOYW1lLCBUeXBlfSBmcm9tICcuL3R5cGUnO1xuaW1wb3J0IHthY2Nlc3NQYXRoLCB0aXRsZWNhc2V9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogRGVmaW5pdGlvbiBvYmplY3QgZm9yIGEgY29uc3RhbnQgdmFsdWUgb2YgYW4gZW5jb2RpbmcgY2hhbm5lbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWYWx1ZURlZiB7XG4gIC8qKlxuICAgKiBBIGNvbnN0YW50IHZhbHVlIGluIHZpc3VhbCBkb21haW4gKGUuZy4sIGBcInJlZFwiYCAvIFwiIzAwOTlmZlwiIGZvciBjb2xvciwgdmFsdWVzIGJldHdlZW4gYDBgIHRvIGAxYCBmb3Igb3BhY2l0eSkuXG4gICAqL1xuICB2YWx1ZTogbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBHZW5lcmljIHR5cGUgZm9yIGNvbmRpdGlvbmFsIGNoYW5uZWxEZWYuXG4gKiBGIGRlZmluZXMgdGhlIHVuZGVybHlpbmcgRmllbGREZWYgdHlwZS5cbiAqL1xuZXhwb3J0IHR5cGUgQ2hhbm5lbERlZldpdGhDb25kaXRpb248RiBleHRlbmRzIEZpZWxkRGVmPGFueT4+ID0gRmllbGREZWZXaXRoQ29uZGl0aW9uPEY+IHwgVmFsdWVEZWZXaXRoQ29uZGl0aW9uPEY+O1xuXG5leHBvcnQgdHlwZSBDb25kaXRpb25hbDxUPiA9IENvbmRpdGlvbmFsUHJlZGljYXRlPFQ+IHwgQ29uZGl0aW9uYWxTZWxlY3Rpb248VD47XG5cbmV4cG9ydCB0eXBlIENvbmRpdGlvbmFsUHJlZGljYXRlPFQ+ID0ge1xuICB0ZXN0OiBMb2dpY2FsT3BlcmFuZDxQcmVkaWNhdGU+O1xufSAmIFQ7XG5cbmV4cG9ydCB0eXBlIENvbmRpdGlvbmFsU2VsZWN0aW9uPFQ+ID0ge1xuICAvKipcbiAgICogQSBbc2VsZWN0aW9uIG5hbWVdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2VsZWN0aW9uLmh0bWwpLCBvciBhIHNlcmllcyBvZiBbY29tcG9zZWQgc2VsZWN0aW9uc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zZWxlY3Rpb24uaHRtbCNjb21wb3NlKS5cbiAgICovXG4gIHNlbGVjdGlvbjogTG9naWNhbE9wZXJhbmQ8c3RyaW5nPjtcbn0gJiBUO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNDb25kaXRpb25hbFNlbGVjdGlvbjxUPihjOiBDb25kaXRpb25hbDxUPik6IGMgaXMgQ29uZGl0aW9uYWxTZWxlY3Rpb248VD4ge1xuICByZXR1cm4gY1snc2VsZWN0aW9uJ107XG59XG5cbi8qKlxuICogQSBGaWVsZERlZiB3aXRoIENvbmRpdGlvbjxWYWx1ZURlZj5cbiAqIHtcbiAqICAgY29uZGl0aW9uOiB7dmFsdWU6IC4uLn0sXG4gKiAgIGZpZWxkOiAuLi4sXG4gKiAgIC4uLlxuICogfVxuICovXG5leHBvcnQgdHlwZSBGaWVsZERlZldpdGhDb25kaXRpb248RiBleHRlbmRzIEZpZWxkRGVmPGFueT4+ID0gRiAmIHtcbiAgLyoqXG4gICAqIE9uZSBvciBtb3JlIHZhbHVlIGRlZmluaXRpb24ocykgd2l0aCBhIHNlbGVjdGlvbiBwcmVkaWNhdGUuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBBIGZpZWxkIGRlZmluaXRpb24ncyBgY29uZGl0aW9uYCBwcm9wZXJ0eSBjYW4gb25seSBjb250YWluIFt2YWx1ZSBkZWZpbml0aW9uc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9lbmNvZGluZy5odG1sI3ZhbHVlLWRlZilcbiAgICogc2luY2UgVmVnYS1MaXRlIG9ubHkgYWxsb3dzIGF0IG1vc3Qgb25lIGVuY29kZWQgZmllbGQgcGVyIGVuY29kaW5nIGNoYW5uZWwuXG4gICAqL1xuICBjb25kaXRpb24/OiBDb25kaXRpb25hbDxWYWx1ZURlZj4gfCBDb25kaXRpb25hbDxWYWx1ZURlZj5bXTtcbn07XG5cbi8qKlxuICogQSBWYWx1ZURlZiB3aXRoIENvbmRpdGlvbjxWYWx1ZURlZiB8IEZpZWxkRGVmPlxuICoge1xuICogICBjb25kaXRpb246IHtmaWVsZDogLi4ufSB8IHt2YWx1ZTogLi4ufSxcbiAqICAgdmFsdWU6IC4uLixcbiAqIH1cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWYWx1ZURlZldpdGhDb25kaXRpb248RiBleHRlbmRzIEZpZWxkRGVmPGFueT4+IHtcbiAgLyoqXG4gICAqIEEgZmllbGQgZGVmaW5pdGlvbiBvciBvbmUgb3IgbW9yZSB2YWx1ZSBkZWZpbml0aW9uKHMpIHdpdGggYSBzZWxlY3Rpb24gcHJlZGljYXRlLlxuICAgKi9cbiAgY29uZGl0aW9uPzogQ29uZGl0aW9uYWw8Rj4gfCBDb25kaXRpb25hbDxWYWx1ZURlZj4gfCBDb25kaXRpb25hbDxWYWx1ZURlZj5bXTtcblxuICAvKipcbiAgICogQSBjb25zdGFudCB2YWx1ZSBpbiB2aXN1YWwgZG9tYWluLlxuICAgKi9cbiAgdmFsdWU/OiBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuO1xufVxuXG4vKipcbiAqIFJlZmVyZW5jZSB0byBhIHJlcGVhdGVkIHZhbHVlLlxuICovXG5leHBvcnQgdHlwZSBSZXBlYXRSZWYgPSB7XG4gIHJlcGVhdDogJ3JvdycgfCAnY29sdW1uJ1xufTtcblxuZXhwb3J0IHR5cGUgRmllbGQgPSBzdHJpbmcgfCBSZXBlYXRSZWY7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlcGVhdFJlZihmaWVsZDogRmllbGQpOiBmaWVsZCBpcyBSZXBlYXRSZWYge1xuICByZXR1cm4gZmllbGQgJiYgIWlzU3RyaW5nKGZpZWxkKSAmJiAncmVwZWF0JyBpbiBmaWVsZDtcbn1cblxuLyoqIEBoaWRlICovXG5leHBvcnQgdHlwZSBIaWRkZW5Db21wb3NpdGVBZ2dyZWdhdGUgPSBDb21wb3NpdGVBZ2dyZWdhdGU7XG5cbmV4cG9ydCB0eXBlIEFnZ3JlZ2F0ZSA9IEFnZ3JlZ2F0ZU9wIHwgSGlkZGVuQ29tcG9zaXRlQWdncmVnYXRlO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZpZWxkRGVmQmFzZTxGPiB7XG5cbiAgLyoqXG4gICAqIF9fUmVxdWlyZWQuX18gQSBzdHJpbmcgZGVmaW5pbmcgdGhlIG5hbWUgb2YgdGhlIGZpZWxkIGZyb20gd2hpY2ggdG8gcHVsbCBhIGRhdGEgdmFsdWVcbiAgICogb3IgYW4gb2JqZWN0IGRlZmluaW5nIGl0ZXJhdGVkIHZhbHVlcyBmcm9tIHRoZSBbYHJlcGVhdGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvcmVwZWF0Lmh0bWwpIG9wZXJhdG9yLlxuICAgKlxuICAgKiBfX05vdGU6X18gRG90cyAoYC5gKSBhbmQgYnJhY2tldHMgKGBbYCBhbmQgYF1gKSBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgbmVzdGVkIG9iamVjdHMgKGUuZy4sIGBcImZpZWxkXCI6IFwiZm9vLmJhclwiYCBhbmQgYFwiZmllbGRcIjogXCJmb29bJ2JhciddXCJgKS5cbiAgICogSWYgZmllbGQgbmFtZXMgY29udGFpbiBkb3RzIG9yIGJyYWNrZXRzIGJ1dCBhcmUgbm90IG5lc3RlZCwgeW91IGNhbiB1c2UgYFxcXFxgIHRvIGVzY2FwZSBkb3RzIGFuZCBicmFja2V0cyAoZS5nLiwgYFwiYVxcXFwuYlwiYCBhbmQgYFwiYVxcXFxbMFxcXFxdXCJgKS5cbiAgICogU2VlIG1vcmUgZGV0YWlscyBhYm91dCBlc2NhcGluZyBpbiB0aGUgW2ZpZWxkIGRvY3VtZW50YXRpb25dKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvZmllbGQuaHRtbCkuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBgZmllbGRgIGlzIG5vdCByZXF1aXJlZCBpZiBgYWdncmVnYXRlYCBpcyBgY291bnRgLlxuICAgKi9cbiAgZmllbGQ/OiBGO1xuXG4gIC8vIGZ1bmN0aW9uXG5cbiAgLyoqXG4gICAqIFRpbWUgdW5pdCAoZS5nLiwgYHllYXJgLCBgeWVhcm1vbnRoYCwgYG1vbnRoYCwgYGhvdXJzYCkgZm9yIGEgdGVtcG9yYWwgZmllbGQuXG4gICAqIG9yIFthIHRlbXBvcmFsIGZpZWxkIHRoYXQgZ2V0cyBjYXN0ZWQgYXMgb3JkaW5hbF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy90eXBlLmh0bWwjY2FzdCkuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgdW5kZWZpbmVkYCAoTm9uZSlcbiAgICovXG4gIHRpbWVVbml0PzogVGltZVVuaXQ7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBmb3IgYmlubmluZyBhIGBxdWFudGl0YXRpdmVgIGZpZWxkLCBvciBbYW4gb2JqZWN0IGRlZmluaW5nIGJpbm5pbmcgcGFyYW1ldGVyc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9iaW4uaHRtbCNwYXJhbXMpLlxuICAgKiBJZiBgdHJ1ZWAsIGRlZmF1bHQgW2Jpbm5pbmcgcGFyYW1ldGVyc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9iaW4uaHRtbCkgd2lsbCBiZSBhcHBsaWVkLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYGZhbHNlYFxuICAgKi9cbiAgYmluPzogYm9vbGVhbiB8IEJpblBhcmFtcztcblxuICAvKipcbiAgICogQWdncmVnYXRpb24gZnVuY3Rpb24gZm9yIHRoZSBmaWVsZFxuICAgKiAoZS5nLiwgYG1lYW5gLCBgc3VtYCwgYG1lZGlhbmAsIGBtaW5gLCBgbWF4YCwgYGNvdW50YCkuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgdW5kZWZpbmVkYCAoTm9uZSlcbiAgICovXG4gIGFnZ3JlZ2F0ZT86IEFnZ3JlZ2F0ZTtcbn1cblxuLyoqXG4gKiAgRGVmaW5pdGlvbiBvYmplY3QgZm9yIGEgZGF0YSBmaWVsZCwgaXRzIHR5cGUgYW5kIHRyYW5zZm9ybWF0aW9uIG9mIGFuIGVuY29kaW5nIGNoYW5uZWwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZkJhc2U8Rj4ge1xuICAvKipcbiAgICogVGhlIGVuY29kZWQgZmllbGQncyB0eXBlIG9mIG1lYXN1cmVtZW50IChgXCJxdWFudGl0YXRpdmVcImAsIGBcInRlbXBvcmFsXCJgLCBgXCJvcmRpbmFsXCJgLCBvciBgXCJub21pbmFsXCJgKS5cbiAgICogSXQgY2FuIGFsc28gYmUgYSBnZW8gdHlwZSAoYFwibGF0aXR1ZGVcImAsIGBcImxvbmdpdHVkZVwiYCwgYW5kIGBcImdlb2pzb25cImApIHdoZW4gYSBbZ2VvZ3JhcGhpYyBwcm9qZWN0aW9uXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3Byb2plY3Rpb24uaHRtbCkgaXMgYXBwbGllZC5cbiAgICovXG4gIC8vICogb3IgYW4gaW5pdGlhbCBjaGFyYWN0ZXIgb2YgdGhlIHR5cGUgbmFtZSAoYFwiUVwiYCwgYFwiVFwiYCwgYFwiT1wiYCwgYFwiTlwiYCkuXG4gIC8vICogVGhpcyBwcm9wZXJ0eSBpcyBjYXNlLWluc2Vuc2l0aXZlLlxuICB0eXBlOiBUeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjYWxlRmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiB0aGUgY2hhbm5lbCdzIHNjYWxlLCB3aGljaCBpcyB0aGUgZnVuY3Rpb24gdGhhdCB0cmFuc2Zvcm1zIHZhbHVlcyBpbiB0aGUgZGF0YSBkb21haW4gKG51bWJlcnMsIGRhdGVzLCBzdHJpbmdzLCBldGMpIHRvIHZpc3VhbCB2YWx1ZXMgKHBpeGVscywgY29sb3JzLCBzaXplcykgb2YgdGhlIGVuY29kaW5nIGNoYW5uZWxzLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gSWYgdW5kZWZpbmVkLCBkZWZhdWx0IFtzY2FsZSBwcm9wZXJ0aWVzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NjYWxlLmh0bWwpIGFyZSBhcHBsaWVkLlxuICAgKi9cbiAgc2NhbGU/OiBTY2FsZTtcblxuICAvKipcbiAgICogU29ydCBvcmRlciBmb3IgdGhlIGVuY29kZWQgZmllbGQuXG4gICAqIFN1cHBvcnRlZCBgc29ydGAgdmFsdWVzIGluY2x1ZGUgYFwiYXNjZW5kaW5nXCJgLCBgXCJkZXNjZW5kaW5nXCJgIGFuZCBgbnVsbGAgKG5vIHNvcnRpbmcpLlxuICAgKiBGb3IgZmllbGRzIHdpdGggZGlzY3JldGUgZG9tYWlucywgYHNvcnRgIGNhbiBhbHNvIGJlIGEgW3NvcnQgZmllbGQgZGVmaW5pdGlvbiBvYmplY3RdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc29ydC5odG1sI3NvcnQtZmllbGQpLlxuICAgKlxuICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gYFwiYXNjZW5kaW5nXCJgXG4gICAqL1xuICBzb3J0PzogU29ydE9yZGVyIHwgU29ydEZpZWxkPEY+IHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbkZpZWxkRGVmPEY+IGV4dGVuZHMgU2NhbGVGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiBheGlzJ3MgZ3JpZGxpbmVzLCB0aWNrcyBhbmQgbGFiZWxzLlxuICAgKiBJZiBgbnVsbGAsIHRoZSBheGlzIGZvciB0aGUgZW5jb2RpbmcgY2hhbm5lbCB3aWxsIGJlIHJlbW92ZWQuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBJZiB1bmRlZmluZWQsIGRlZmF1bHQgW2F4aXMgcHJvcGVydGllc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9heGlzLmh0bWwpIGFyZSBhcHBsaWVkLlxuICAgKi9cbiAgYXhpcz86IEF4aXMgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHN0YWNraW5nIG9mZnNldCBpZiB0aGUgZmllbGQgc2hvdWxkIGJlIHN0YWNrZWQuXG4gICAqIGBzdGFja2AgaXMgb25seSBhcHBsaWNhYmxlIGZvciBgeGAgYW5kIGB5YCBjaGFubmVscyB3aXRoIGNvbnRpbnVvdXMgZG9tYWlucy5cbiAgICogRm9yIGV4YW1wbGUsIGBzdGFja2Agb2YgYHlgIGNhbiBiZSB1c2VkIHRvIGN1c3RvbWl6ZSBzdGFja2luZyBmb3IgYSB2ZXJ0aWNhbCBiYXIgY2hhcnQuXG4gICAqXG4gICAqIGBzdGFja2AgY2FuIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiAgICogLSBgXCJ6ZXJvXCJgOiBzdGFja2luZyB3aXRoIGJhc2VsaW5lIG9mZnNldCBhdCB6ZXJvIHZhbHVlIG9mIHRoZSBzY2FsZSAoZm9yIGNyZWF0aW5nIHR5cGljYWwgc3RhY2tlZCBbYmFyXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3N0YWNrLmh0bWwjYmFyKSBhbmQgW2FyZWFdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3RhY2suaHRtbCNhcmVhKSBjaGFydCkuXG4gICAqIC0gYFwibm9ybWFsaXplXCJgIC0gc3RhY2tpbmcgd2l0aCBub3JtYWxpemVkIGRvbWFpbiAoZm9yIGNyZWF0aW5nIFtub3JtYWxpemVkIHN0YWNrZWQgYmFyIGFuZCBhcmVhIGNoYXJ0c10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zdGFjay5odG1sI25vcm1hbGl6ZWQpLiA8YnIvPlxuICAgKiAtYFwiY2VudGVyXCJgIC0gc3RhY2tpbmcgd2l0aCBjZW50ZXIgYmFzZWxpbmUgKGZvciBbc3RyZWFtZ3JhcGhdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3RhY2suaHRtbCNzdHJlYW1ncmFwaCkpLlxuICAgKiAtIGBudWxsYCAtIE5vLXN0YWNraW5nLiBUaGlzIHdpbGwgcHJvZHVjZSBsYXllcmVkIFtiYXJdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3RhY2suaHRtbCNsYXllcmVkLWJhci1jaGFydCkgYW5kIGFyZWEgY2hhcnQuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgemVyb2AgZm9yIHBsb3RzIHdpdGggYWxsIG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgdHJ1ZTpcbiAgICogKDEpIHRoZSBtYXJrIGlzIGBiYXJgIG9yIGBhcmVhYDtcbiAgICogKDIpIHRoZSBzdGFja2VkIG1lYXN1cmUgY2hhbm5lbCAoeCBvciB5KSBoYXMgYSBsaW5lYXIgc2NhbGU7XG4gICAqICgzKSBBdCBsZWFzdCBvbmUgb2Ygbm9uLXBvc2l0aW9uIGNoYW5uZWxzIG1hcHBlZCB0byBhbiB1bmFnZ3JlZ2F0ZWQgZmllbGQgdGhhdCBpcyBkaWZmZXJlbnQgZnJvbSB4IGFuZCB5LiAgT3RoZXJ3aXNlLCBgbnVsbGAgYnkgZGVmYXVsdC5cbiAgICovXG4gIHN0YWNrPzogU3RhY2tPZmZzZXQgfCBudWxsO1xufVxuXG4vKipcbiAqIEZpZWxkIGRlZmluaXRpb24gb2YgYSBtYXJrIHByb3BlcnR5LCB3aGljaCBjYW4gY29udGFpbiBhIGxlZ2VuZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXJrUHJvcEZpZWxkRGVmPEY+IGV4dGVuZHMgU2NhbGVGaWVsZERlZjxGPiB7XG4gICAvKipcbiAgICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIHRoZSBsZWdlbmQuXG4gICAgKiBJZiBgbnVsbGAsIHRoZSBsZWdlbmQgZm9yIHRoZSBlbmNvZGluZyBjaGFubmVsIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAqXG4gICAgKiBfX0RlZmF1bHQgdmFsdWU6X18gSWYgdW5kZWZpbmVkLCBkZWZhdWx0IFtsZWdlbmQgcHJvcGVydGllc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9sZWdlbmQuaHRtbCkgYXJlIGFwcGxpZWQuXG4gICAgKi9cbiAgbGVnZW5kPzogTGVnZW5kIHwgbnVsbDtcbn1cblxuLy8gRGV0YWlsXG5cbi8vIE9yZGVyIFBhdGggaGF2ZSBubyBzY2FsZVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyRmllbGREZWY8Rj4gZXh0ZW5kcyBGaWVsZERlZjxGPiB7XG4gIC8qKlxuICAgKiBUaGUgc29ydCBvcmRlci4gT25lIG9mIGBcImFzY2VuZGluZ1wiYCAoZGVmYXVsdCkgb3IgYFwiZGVzY2VuZGluZ1wiYC5cbiAgICovXG4gIHNvcnQ/OiBTb3J0T3JkZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGV4dEZpZWxkRGVmPEY+IGV4dGVuZHMgRmllbGREZWY8Rj4ge1xuICAvKipcbiAgICogVGhlIFtmb3JtYXR0aW5nIHBhdHRlcm5dKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvZm9ybWF0Lmh0bWwpIGZvciBhIHRleHQgZmllbGQuIElmIG5vdCBkZWZpbmVkLCB0aGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgZm9ybWF0Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBDaGFubmVsRGVmPEY+ID0gQ2hhbm5lbERlZldpdGhDb25kaXRpb248RmllbGREZWY8Rj4+O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNDb25kaXRpb25hbERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyBDaGFubmVsRGVmV2l0aENvbmRpdGlvbjxGaWVsZERlZjxGPj4ge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICEhY2hhbm5lbERlZi5jb25kaXRpb247XG59XG5cbi8qKlxuICogUmV0dXJuIGlmIGEgY2hhbm5lbERlZiBpcyBhIENvbmRpdGlvbmFsVmFsdWVEZWYgd2l0aCBDb25kaXRpb25GaWVsZERlZlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzQ29uZGl0aW9uYWxGaWVsZERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogY2hhbm5lbERlZiBpcyAoVmFsdWVEZWYgJiB7Y29uZGl0aW9uOiBDb25kaXRpb25hbDxGaWVsZERlZjxGPj59KSB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgISFjaGFubmVsRGVmLmNvbmRpdGlvbiAmJiAhaXNBcnJheShjaGFubmVsRGVmLmNvbmRpdGlvbikgJiYgaXNGaWVsZERlZihjaGFubmVsRGVmLmNvbmRpdGlvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDb25kaXRpb25hbFZhbHVlRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIChWYWx1ZURlZiAmIHtjb25kaXRpb246IENvbmRpdGlvbmFsPFZhbHVlRGVmPiB8IENvbmRpdGlvbmFsPFZhbHVlRGVmPltdfSkge1xuICByZXR1cm4gISFjaGFubmVsRGVmICYmICEhY2hhbm5lbERlZi5jb25kaXRpb24gJiYgKFxuICAgIGlzQXJyYXkoY2hhbm5lbERlZi5jb25kaXRpb24pIHx8IGlzVmFsdWVEZWYoY2hhbm5lbERlZi5jb25kaXRpb24pXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZpZWxkRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIEZpZWxkRGVmPEY+IHwgUG9zaXRpb25GaWVsZERlZjxGPiB8IFNjYWxlRmllbGREZWY8Rj4gfCBNYXJrUHJvcEZpZWxkRGVmPEY+IHwgT3JkZXJGaWVsZERlZjxGPiB8IFRleHRGaWVsZERlZjxGPiB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgKCEhY2hhbm5lbERlZlsnZmllbGQnXSB8fCBjaGFubmVsRGVmWydhZ2dyZWdhdGUnXSA9PT0gJ2NvdW50Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZ0ZpZWxkRGVmKGZpZWxkRGVmOiBDaGFubmVsRGVmPHN0cmluZ3xSZXBlYXRSZWY+KTogZmllbGREZWYgaXMgRmllbGREZWY8c3RyaW5nPiB7XG4gIHJldHVybiBpc0ZpZWxkRGVmKGZpZWxkRGVmKSAmJiBpc1N0cmluZyhmaWVsZERlZi5maWVsZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbHVlRGVmPEY+KGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8Rj4pOiBjaGFubmVsRGVmIGlzIFZhbHVlRGVmIHtcbiAgcmV0dXJuIGNoYW5uZWxEZWYgJiYgJ3ZhbHVlJyBpbiBjaGFubmVsRGVmICYmIGNoYW5uZWxEZWZbJ3ZhbHVlJ10gIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2NhbGVGaWVsZERlZihjaGFubmVsRGVmOiBDaGFubmVsRGVmPGFueT4pOiBjaGFubmVsRGVmIGlzIFNjYWxlRmllbGREZWY8YW55PiB7XG4gIHJldHVybiAhIWNoYW5uZWxEZWYgJiYgKCEhY2hhbm5lbERlZlsnc2NhbGUnXSB8fCAhIWNoYW5uZWxEZWZbJ3NvcnQnXSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGRSZWZPcHRpb24ge1xuICAvKiogZXhjbHVkZSBiaW4sIGFnZ3JlZ2F0ZSwgdGltZVVuaXQgKi9cbiAgbm9mbj86IGJvb2xlYW47XG4gIC8qKiBXcmFwIHRoZSBmaWVsZCB3aXRoIGRhdHVtIG9yIHBhcmVudCAoZS5nLiwgZGF0dW1bJy4uLiddIGZvciBWZWdhIEV4cHJlc3Npb24gKi9cbiAgZXhwcj86ICdkYXR1bScgfCAncGFyZW50JztcbiAgLyoqIHByZXBlbmQgZm4gd2l0aCBjdXN0b20gZnVuY3Rpb24gcHJlZml4ICovXG4gIHByZWZpeD86IHN0cmluZztcbiAgLyoqIGFwcGVuZCBzdWZmaXggdG8gdGhlIGZpZWxkIHJlZiBmb3IgYmluIChkZWZhdWx0PSdzdGFydCcpICovXG4gIGJpblN1ZmZpeD86ICdlbmQnIHwgJ3JhbmdlJyB8ICdtaWQnO1xuICAvKiogYXBwZW5kIHN1ZmZpeCB0byB0aGUgZmllbGQgcmVmIChnZW5lcmFsKSAqL1xuICBzdWZmaXg/OiBzdHJpbmc7XG4gIC8qKiBPdmVycnJpZGUgd2hpY2ggYWdncmVnYXRlIHRvIHVzZS4gTmVlZGVkIGZvciB1bmFnZ3JlZ2F0ZWQgZG9tYWluLiAqL1xuICBhZ2dyZWdhdGU/OiBBZ2dyZWdhdGVPcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZnRmllbGQoZmllbGREZWY6IEZpZWxkRGVmQmFzZTxzdHJpbmc+LCBvcHQ6IEZpZWxkUmVmT3B0aW9uID0ge30pOiBzdHJpbmcge1xuICBsZXQgZmllbGQgPSBmaWVsZERlZi5maWVsZDtcbiAgY29uc3QgcHJlZml4ID0gb3B0LnByZWZpeDtcbiAgbGV0IHN1ZmZpeCA9IG9wdC5zdWZmaXg7XG5cbiAgaWYgKGlzQ291bnQoZmllbGREZWYpKSB7XG4gICAgZmllbGQgPSAnY291bnRfKic7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGZuOiBzdHJpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIW9wdC5ub2ZuKSB7XG4gICAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICAgIGZuID0gYmluVG9TdHJpbmcoZmllbGREZWYuYmluKTtcbiAgICAgICAgc3VmZml4ID0gb3B0LmJpblN1ZmZpeCB8fCAnJztcbiAgICAgIH0gZWxzZSBpZiAoZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgIGZuID0gU3RyaW5nKG9wdC5hZ2dyZWdhdGUgfHwgZmllbGREZWYuYWdncmVnYXRlKTtcbiAgICAgIH0gZWxzZSBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgZm4gPSBTdHJpbmcoZmllbGREZWYudGltZVVuaXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmbikge1xuICAgICAgZmllbGQgPSBgJHtmbn1fJHtmaWVsZH1gO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdWZmaXgpIHtcbiAgICBmaWVsZCA9IGAke2ZpZWxkfV8ke3N1ZmZpeH1gO1xuICB9XG5cbiAgaWYgKHByZWZpeCkge1xuICAgIGZpZWxkID0gYCR7cHJlZml4fV8ke2ZpZWxkfWA7XG4gIH1cblxuICBpZiAob3B0LmV4cHIpIHtcbiAgICBmaWVsZCA9IGAke29wdC5leHByfSR7YWNjZXNzUGF0aChmaWVsZCl9YDtcbiAgfVxuXG4gIHJldHVybiBmaWVsZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlzY3JldGUoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPikge1xuICBzd2l0Y2ggKGZpZWxkRGVmLnR5cGUpIHtcbiAgICBjYXNlICdub21pbmFsJzpcbiAgICBjYXNlICdvcmRpbmFsJzpcbiAgICBjYXNlICdnZW9qc29uJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNhc2UgJ3F1YW50aXRhdGl2ZSc6XG4gICAgICByZXR1cm4gISFmaWVsZERlZi5iaW47XG4gICAgY2FzZSAnbGF0aXR1ZGUnOlxuICAgIGNhc2UgJ2xvbmdpdHVkZSc6XG4gICAgY2FzZSAndGVtcG9yYWwnOlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5pbnZhbGlkRmllbGRUeXBlKGZpZWxkRGVmLnR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29udGludW91cyhmaWVsZERlZjogRmllbGREZWY8RmllbGQ+KSB7XG4gIHJldHVybiAhaXNEaXNjcmV0ZShmaWVsZERlZik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvdW50KGZpZWxkRGVmOiBGaWVsZERlZkJhc2U8RmllbGQ+KSB7XG4gIHJldHVybiBmaWVsZERlZi5hZ2dyZWdhdGUgPT09ICdjb3VudCc7XG59XG5cbmV4cG9ydCB0eXBlIEZpZWxkVGl0bGVGb3JtYXR0ZXIgPSAoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSA9PiBzdHJpbmc7XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJiYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3Qge2ZpZWxkOiBmaWVsZCwgYmluLCB0aW1lVW5pdCwgYWdncmVnYXRlfSA9IGZpZWxkRGVmO1xuICBpZiAoYWdncmVnYXRlID09PSAnY291bnQnKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5jb3VudFRpdGxlO1xuICB9IGVsc2UgaWYgKGJpbikge1xuICAgIHJldHVybiBgJHtmaWVsZH0gKGJpbm5lZClgO1xuICB9IGVsc2UgaWYgKHRpbWVVbml0KSB7XG4gICAgY29uc3QgdW5pdHMgPSBnZXRUaW1lVW5pdFBhcnRzKHRpbWVVbml0KS5qb2luKCctJyk7XG4gICAgcmV0dXJuIGAke2ZpZWxkfSAoJHt1bml0c30pYDtcbiAgfSBlbHNlIGlmIChhZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4gYCR7dGl0bGVjYXNlKGFnZ3JlZ2F0ZSl9IG9mICR7ZmllbGR9YDtcbiAgfVxuICByZXR1cm4gZmllbGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmdW5jdGlvbmFsVGl0bGVGb3JtYXR0ZXIoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IGZuID0gZmllbGREZWYuYWdncmVnYXRlIHx8IGZpZWxkRGVmLnRpbWVVbml0IHx8IChmaWVsZERlZi5iaW4gJiYgJ2JpbicpO1xuICBpZiAoZm4pIHtcbiAgICByZXR1cm4gZm4udG9VcHBlckNhc2UoKSArICcoJyArIGZpZWxkRGVmLmZpZWxkICsgJyknO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmaWVsZERlZi5maWVsZDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZGVmYXVsdFRpdGxlRm9ybWF0dGVyOiBGaWVsZFRpdGxlRm9ybWF0dGVyID0gKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykgPT4ge1xuICBzd2l0Y2ggKGNvbmZpZy5maWVsZFRpdGxlKSB7XG4gICAgY2FzZSAncGxhaW4nOlxuICAgICAgcmV0dXJuIGZpZWxkRGVmLmZpZWxkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uYWwnOlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uYWxUaXRsZUZvcm1hdHRlcihmaWVsZERlZiwgY29uZmlnKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHZlcmJhbFRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xuICB9XG59O1xuXG5sZXQgdGl0bGVGb3JtYXR0ZXIgPSBkZWZhdWx0VGl0bGVGb3JtYXR0ZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRUaXRsZUZvcm1hdHRlcihmb3JtYXR0ZXI6IChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpID0+IHN0cmluZykge1xuICB0aXRsZUZvcm1hdHRlciA9IGZvcm1hdHRlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0VGl0bGVGb3JtYXR0ZXIoKSB7XG4gIHNldFRpdGxlRm9ybWF0dGVyKGRlZmF1bHRUaXRsZUZvcm1hdHRlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIHRpdGxlRm9ybWF0dGVyKGZpZWxkRGVmLCBjb25maWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFR5cGUoZmllbGREZWY6IEZpZWxkRGVmPEZpZWxkPiwgY2hhbm5lbDogQ2hhbm5lbCk6IFR5cGUge1xuICBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICByZXR1cm4gJ3RlbXBvcmFsJztcbiAgfVxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgcmV0dXJuICdxdWFudGl0YXRpdmUnO1xuICB9XG4gIHN3aXRjaCAocmFuZ2VUeXBlKGNoYW5uZWwpKSB7XG4gICAgY2FzZSAnY29udGludW91cyc6XG4gICAgICByZXR1cm4gJ3F1YW50aXRhdGl2ZSc7XG4gICAgY2FzZSAnZGlzY3JldGUnOlxuICAgICAgcmV0dXJuICdub21pbmFsJztcbiAgICBjYXNlICdmbGV4aWJsZSc6IC8vIGNvbG9yXG4gICAgICByZXR1cm4gJ25vbWluYWwnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJ3F1YW50aXRhdGl2ZSc7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaWVsZERlZiAtLSBlaXRoZXIgZnJvbSB0aGUgb3V0ZXIgY2hhbm5lbERlZiBvciBmcm9tIHRoZSBjb25kaXRpb24gb2YgY2hhbm5lbERlZi5cbiAqIEBwYXJhbSBjaGFubmVsRGVmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZERlZjxGPihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEY+KTogRmllbGREZWY8Rj4ge1xuICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiBjaGFubmVsRGVmO1xuICB9IGVsc2UgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICByZXR1cm4gY2hhbm5lbERlZi5jb25kaXRpb247XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IHR5cGUgdG8gZnVsbCwgbG93ZXJjYXNlIHR5cGUsIG9yIGF1Z21lbnQgdGhlIGZpZWxkRGVmIHdpdGggYSBkZWZhdWx0IHR5cGUgaWYgbWlzc2luZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShjaGFubmVsRGVmOiBDaGFubmVsRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpOiBDaGFubmVsRGVmPGFueT4ge1xuICBpZiAoaXNTdHJpbmcoY2hhbm5lbERlZikgfHwgaXNOdW1iZXIoY2hhbm5lbERlZikgfHwgaXNCb29sZWFuKGNoYW5uZWxEZWYpKSB7XG4gICAgY29uc3QgcHJpbWl0aXZlVHlwZSA9IGlzU3RyaW5nKGNoYW5uZWxEZWYpID8gJ3N0cmluZycgOlxuICAgICAgaXNOdW1iZXIoY2hhbm5lbERlZikgPyAnbnVtYmVyJyA6ICdib29sZWFuJztcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5wcmltaXRpdmVDaGFubmVsRGVmKGNoYW5uZWwsIHByaW1pdGl2ZVR5cGUsIGNoYW5uZWxEZWYpKTtcbiAgICByZXR1cm4ge3ZhbHVlOiBjaGFubmVsRGVmfTtcbiAgfVxuXG4gIC8vIElmIGEgZmllbGREZWYgY29udGFpbnMgYSBmaWVsZCwgd2UgbmVlZCB0eXBlLlxuICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIHJldHVybiBub3JtYWxpemVGaWVsZERlZihjaGFubmVsRGVmLCBjaGFubmVsKTtcbiAgfSBlbHNlIGlmIChoYXNDb25kaXRpb25hbEZpZWxkRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmNoYW5uZWxEZWYsXG4gICAgICAvLyBOZWVkIHRvIGNhc3QgYXMgbm9ybWFsaXplRmllbGREZWYgbm9ybWFsbHkgcmV0dXJuIEZpZWxkRGVmLCBidXQgaGVyZSB3ZSBrbm93IHRoYXQgaXQgaXMgZGVmaW5pdGVseSBDb25kaXRpb248RmllbGREZWY+XG4gICAgICBjb25kaXRpb246IG5vcm1hbGl6ZUZpZWxkRGVmKGNoYW5uZWxEZWYuY29uZGl0aW9uLCBjaGFubmVsKSBhcyBDb25kaXRpb25hbDxGaWVsZERlZjxzdHJpbmc+PlxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGNoYW5uZWxEZWY7XG59XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgLy8gRHJvcCBpbnZhbGlkIGFnZ3JlZ2F0ZVxuICBpZiAoZmllbGREZWYuYWdncmVnYXRlICYmICFpc0FnZ3JlZ2F0ZU9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpIHtcbiAgICBjb25zdCB7YWdncmVnYXRlLCAuLi5maWVsZERlZldpdGhvdXRBZ2dyZWdhdGV9ID0gZmllbGREZWY7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuaW52YWxpZEFnZ3JlZ2F0ZShmaWVsZERlZi5hZ2dyZWdhdGUpKTtcbiAgICBmaWVsZERlZiA9IGZpZWxkRGVmV2l0aG91dEFnZ3JlZ2F0ZTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBUaW1lIFVuaXRcbiAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgZmllbGREZWYgPSB7XG4gICAgICAuLi5maWVsZERlZixcbiAgICAgIHRpbWVVbml0OiBub3JtYWxpemVUaW1lVW5pdChmaWVsZERlZi50aW1lVW5pdClcbiAgICB9O1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJpblxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgZmllbGREZWYgPSB7XG4gICAgICAuLi5maWVsZERlZixcbiAgICAgIGJpbjogbm9ybWFsaXplQmluKGZpZWxkRGVmLmJpbiwgY2hhbm5lbClcbiAgICB9O1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIFR5cGVcbiAgaWYgKGZpZWxkRGVmLnR5cGUpIHtcbiAgICBjb25zdCBmdWxsVHlwZSA9IGdldEZ1bGxOYW1lKGZpZWxkRGVmLnR5cGUpO1xuICAgIGlmIChmaWVsZERlZi50eXBlICE9PSBmdWxsVHlwZSkge1xuICAgICAgLy8gY29udmVydCBzaG9ydCB0eXBlIHRvIGZ1bGwgdHlwZVxuICAgICAgZmllbGREZWYgPSB7XG4gICAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgICB0eXBlOiBmdWxsVHlwZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGZpZWxkRGVmLnR5cGUgIT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgICBpZiAoaXNDb3VudGluZ0FnZ3JlZ2F0ZU9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuaW52YWxpZEZpZWxkVHlwZUZvckNvdW50QWdncmVnYXRlKGZpZWxkRGVmLnR5cGUsIGZpZWxkRGVmLmFnZ3JlZ2F0ZSkpO1xuICAgICAgICBmaWVsZERlZiA9IHtcbiAgICAgICAgICAuLi5maWVsZERlZixcbiAgICAgICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJZiB0eXBlIGlzIGVtcHR5IC8gaW52YWxpZCwgdGhlbiBhdWdtZW50IHdpdGggZGVmYXVsdCB0eXBlXG4gICAgY29uc3QgbmV3VHlwZSA9IGRlZmF1bHRUeXBlKGZpZWxkRGVmLCBjaGFubmVsKTtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5lbXB0eU9ySW52YWxpZEZpZWxkVHlwZShmaWVsZERlZi50eXBlLCBjaGFubmVsLCBuZXdUeXBlKSk7XG4gICAgZmllbGREZWYgPSB7XG4gICAgICAgIC4uLmZpZWxkRGVmLFxuICAgICAgdHlwZTogbmV3VHlwZVxuICAgIH07XG4gIH1cblxuICBjb25zdCB7Y29tcGF0aWJsZSwgd2FybmluZ30gPSBjaGFubmVsQ29tcGF0aWJpbGl0eShmaWVsZERlZiwgY2hhbm5lbCk7XG4gIGlmICghY29tcGF0aWJsZSkge1xuICAgIGxvZy53YXJuKHdhcm5pbmcpO1xuICB9XG4gIHJldHVybiBmaWVsZERlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUJpbihiaW46IEJpblBhcmFtc3xib29sZWFuLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGlmIChpc0Jvb2xlYW4oYmluKSkge1xuICAgIHJldHVybiB7bWF4YmluczogYXV0b01heEJpbnMoY2hhbm5lbCl9O1xuICB9IGVsc2UgaWYgKCFiaW4ubWF4YmlucyAmJiAhYmluLnN0ZXApIHtcbiAgICByZXR1cm4gey4uLmJpbiwgbWF4YmluczogYXV0b01heEJpbnMoY2hhbm5lbCl9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBiaW47XG4gIH1cbn1cblxuY29uc3QgQ09NUEFUSUJMRSA9IHtjb21wYXRpYmxlOiB0cnVlfTtcbmV4cG9ydCBmdW5jdGlvbiBjaGFubmVsQ29tcGF0aWJpbGl0eShmaWVsZERlZjogRmllbGREZWY8RmllbGQ+LCBjaGFubmVsOiBDaGFubmVsKToge2NvbXBhdGlibGU6IGJvb2xlYW47IHdhcm5pbmc/OiBzdHJpbmc7fSB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgJ3Jvdyc6XG4gICAgY2FzZSAnY29sdW1uJzpcbiAgICAgIGlmIChpc0NvbnRpbnVvdXMoZmllbGREZWYpICYmICFmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICAvLyBUT0RPOihodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzIwMTEpOlxuICAgICAgICAvLyB3aXRoIHRpbWVVbml0IGl0J3Mgbm90IGFsd2F5cyBzdHJpY3RseSBjb250aW51b3VzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogbG9nLm1lc3NhZ2UuZmFjZXRDaGFubmVsU2hvdWxkQmVEaXNjcmV0ZShjaGFubmVsKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICd4JzpcbiAgICBjYXNlICd5JzpcbiAgICBjYXNlICdjb2xvcic6XG4gICAgY2FzZSAndGV4dCc6XG4gICAgY2FzZSAnZGV0YWlsJzpcbiAgICBjYXNlICd0b29sdGlwJzpcbiAgICBjYXNlICdocmVmJzpcbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuXG4gICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgY2FzZSAnc2l6ZSc6XG4gICAgY2FzZSAneDInOlxuICAgIGNhc2UgJ3kyJzpcbiAgICAgIGlmIChpc0Rpc2NyZXRlKGZpZWxkRGVmKSAmJiAhZmllbGREZWYuYmluKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogYENoYW5uZWwgJHtjaGFubmVsfSBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCBkaXNjcmV0ZSBmaWVsZC5gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gQ09NUEFUSUJMRTtcblxuICAgIGNhc2UgJ3NoYXBlJzpcbiAgICAgIGlmIChmaWVsZERlZi50eXBlICE9PSAnbm9taW5hbCcgJiYgZmllbGREZWYudHlwZSAhPT0gJ2dlb2pzb24nKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogJ1NoYXBlIGNoYW5uZWwgc2hvdWxkIGJlIHVzZWQgd2l0aCBub21pbmFsIGRhdGEgb3IgZ2VvanNvbiBvbmx5J1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIENPTVBBVElCTEU7XG5cbiAgICBjYXNlICdvcmRlcic6XG4gICAgICBpZiAoZmllbGREZWYudHlwZSA9PT0gJ25vbWluYWwnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29tcGF0aWJsZTogZmFsc2UsXG4gICAgICAgICAgd2FybmluZzogYENoYW5uZWwgb3JkZXIgaXMgaW5hcHByb3ByaWF0ZSBmb3Igbm9taW5hbCBmaWVsZCwgd2hpY2ggaGFzIG5vIGluaGVyZW50IG9yZGVyLmBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDT01QQVRJQkxFO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignY2hhbm5lbENvbXBhdGFiaWxpdHkgbm90IGltcGxlbWVudGVkIGZvciBjaGFubmVsICcgKyBjaGFubmVsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPGFueT4pIHtcbiAgcmV0dXJuIGZpZWxkRGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnIHx8ICEhZmllbGREZWYuYmluO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUaW1lRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmPGFueT4pIHtcbiAgcmV0dXJuIGZpZWxkRGVmLnR5cGUgPT09ICd0ZW1wb3JhbCcgfHwgISFmaWVsZERlZi50aW1lVW5pdDtcbn1cbiJdfQ==