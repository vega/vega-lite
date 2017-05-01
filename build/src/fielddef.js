"use strict";
// utility for a field definition object
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
function isFieldDef(channelDef) {
    return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}
exports.isFieldDef = isFieldDef;
function isValueDef(channelDef) {
    return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
}
exports.isValueDef = isValueDef;
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
                suffix = opt.binSuffix;
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
        field = opt.expr + "[" + util_1.stringValue(field) + "]";
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
            // TODO: deal with custom scale type case.
            return timeunit_1.isDiscreteByDefault(fieldDef.timeUnit);
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
function title(fieldDef, config) {
    if (isCount(fieldDef)) {
        return config.countTitle;
    }
    var fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
    if (fn) {
        return fn.toUpperCase() + '(' + fieldDef.field + ')';
    }
    else {
        return fieldDef.field;
    }
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
        case 'flexible':
            return 'nominal';
        default:
            return 'quantitative';
    }
}
exports.defaultType = defaultType;
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
function normalize(channelDef, channel) {
    // If a fieldDef contains a field, we need type.
    if (isFieldDef(channelDef)) {
        var fieldDef = channelDef;
        // Drop invalid aggregate
        if (fieldDef.aggregate && !aggregate_1.AGGREGATE_OP_INDEX[fieldDef.aggregate]) {
            var aggregate = fieldDef.aggregate, fieldDefWithoutAggregate = tslib_1.__rest(fieldDef, ["aggregate"]);
            log.warn(log.message.invalidAggregate(fieldDef.aggregate));
            fieldDef = fieldDefWithoutAggregate;
        }
        // Normalize bin
        if (fieldDef.bin) {
            var bin = fieldDef.bin;
            if (util_1.isBoolean(bin)) {
                fieldDef = tslib_1.__assign({}, fieldDef, { bin: { maxbins: bin_1.autoMaxBins(channel) } });
            }
            else if (!bin.maxbins && !bin.step) {
                fieldDef = tslib_1.__assign({}, fieldDef, { bin: tslib_1.__assign({}, bin, { maxbins: bin_1.autoMaxBins(channel) }) });
            }
        }
        // Normalize Type
        if (fieldDef.type) {
            var fullType = type_1.getFullName(fieldDef.type);
            if (fieldDef.type !== fullType) {
                // convert short type to full type
                fieldDef = tslib_1.__assign({}, fieldDef, { type: fullType });
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
    return channelDef;
}
exports.normalize = normalize;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRkZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRkZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdDQUF3Qzs7O0FBRXhDLHlDQUE0RDtBQUU1RCw2QkFBb0Q7QUFDcEQscUNBQTZDO0FBSzdDLDJCQUE2QjtBQUk3Qix1Q0FBeUQ7QUFDekQsK0JBQXlDO0FBQ3pDLCtCQUF3RDtBQXlCeEQscUJBQTRCLEtBQVk7SUFDdEMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLGVBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxRQUFRLElBQUksS0FBSyxDQUFDO0FBQ3hELENBQUM7QUFGRCxrQ0FFQztBQTJHRCxvQkFBMkIsVUFBMkI7SUFDcEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQztBQUN4RixDQUFDO0FBRkQsZ0NBRUM7QUFFRCxvQkFBMkIsVUFBMkI7SUFDcEQsTUFBTSxDQUFDLFVBQVUsSUFBSSxPQUFPLElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDbEYsQ0FBQztBQUZELGdDQUVDO0FBaUJELGVBQXNCLFFBQTBCLEVBQUUsR0FBd0I7SUFBeEIsb0JBQUEsRUFBQSxRQUF3QjtJQUN4RSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQzNCLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDMUIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUV4QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEtBQUssR0FBRyxTQUFTLENBQUM7SUFDcEIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FB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