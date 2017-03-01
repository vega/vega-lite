// utility for a field definition object
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
var log = require("./log");
var type_1 = require("./type");
var util_1 = require("./util");
;
function isFieldDef(channelDef) {
    return channelDef && !!channelDef['field'];
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
                fn = 'bin';
                suffix = opt.binSuffix;
            }
            else if (fieldDef.aggregate) {
                fn = String(opt.aggregate || fieldDef.aggregate);
            }
            else if (fieldDef.timeUnit) {
                fn = String(fieldDef.timeUnit);
            }
        }
        if (!!fn) {
            field = fn + "_" + field;
        }
    }
    if (!!suffix) {
        field = field + "_" + suffix;
    }
    if (!!prefix) {
        field = prefix + "_" + field;
    }
    if (opt.datum) {
        field = "datum[\"" + field + "\"]";
    }
    return field;
}
exports.field = field;
function _isFieldDimension(fieldDef) {
    if (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type)) {
        return true;
    }
    else if (!!fieldDef.bin) {
        return true;
    }
    else if (fieldDef.type === type_1.TEMPORAL) {
        return !!fieldDef.timeUnit;
    }
    return false;
}
function isDimension(fieldDef) {
    return fieldDef && isFieldDef(fieldDef) && _isFieldDimension(fieldDef);
}
exports.isDimension = isDimension;
function isMeasure(fieldDef) {
    return fieldDef && isFieldDef(fieldDef) && !_isFieldDimension(fieldDef);
}
exports.isMeasure = isMeasure;
function count() {
    return { field: '*', aggregate: 'count', type: type_1.QUANTITATIVE };
}
exports.count = count;
function isCount(fieldDef) {
    return fieldDef.aggregate === 'count';
}
exports.isCount = isCount;
function title(fieldDef, config) {
    if (fieldDef.title != null) {
        return fieldDef.title;
    }
    if (isCount(fieldDef)) {
        return config.countTitle;
    }
    var fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
    if (fn) {
        return fn.toString().toUpperCase() + '(' + fieldDef.field + ')';
    }
    else {
        return fieldDef.field;
    }
}
exports.title = title;
function defaultType(fieldDef, channel) {
    if (!!fieldDef.timeUnit) {
        return 'temporal';
    }
    if (!!fieldDef.bin) {
        return 'quantitative';
    }
    var canBeMeasure = channel_1.getSupportedRole(channel).measure;
    return canBeMeasure ? 'quantitative' : 'nominal';
}
exports.defaultType = defaultType;
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
function normalize(fieldDef, channel) {
    // If a fieldDef contains a field, we need type.
    if (fieldDef.field) {
        // convert short type to full type
        var fullType = type_1.getFullName(fieldDef.type);
        if (fullType) {
            fieldDef.type = fullType;
        }
        else {
            // If type is empty / invalid, then augment with default type
            var newType = defaultType(fieldDef, channel);
            log.warn(log.message.emptyOrInvalidFieldType(fieldDef.type, channel, newType));
            fieldDef.type = newType;
        }
    }
    return fieldDef;
}
exports.normalize = normalize;
//# sourceMappingURL=fielddef.js.map