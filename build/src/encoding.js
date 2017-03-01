"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// utility for encoding mapping
var fielddef_1 = require("./fielddef");
var channel_1 = require("./channel");
var util_1 = require("./util");
var log = require("./log");
function channelHasField(encoding, channel) {
    var channelDef = encoding && encoding[channel];
    if (channelDef) {
        if (util_1.isArray(channelDef)) {
            return util_1.some(channelDef, function (fieldDef) { return !!fieldDef.field; });
        }
        else {
            return fielddef_1.isFieldDef(channelDef);
        }
    }
    return false;
}
exports.channelHasField = channelHasField;
function isAggregate(encoding) {
    return util_1.some(channel_1.CHANNELS, function (channel) {
        if (channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            if (util_1.isArray(channelDef)) {
                return util_1.some(channelDef, function (fieldDef) { return !!fieldDef.aggregate; });
            }
            else {
                return fielddef_1.isFieldDef(channelDef) && !!channelDef.aggregate;
            }
        }
        return false;
    });
}
exports.isAggregate = isAggregate;
function dropInvalidFieldDefs(mark, encoding) {
    // clone to prevent side effect to the original spec
    encoding = util_1.duplicate(encoding);
    Object.keys(encoding).forEach(function (channel) {
        if (!channel_1.supportMark(channel, mark)) {
            // Drop unsupported channel
            log.warn(log.message.incompatibleChannel(channel, mark));
            delete encoding[channel];
            return;
        }
        // Drop line's size if the field is aggregated.
        if (channel === 'size' && mark === 'line') {
            var channelDef = encoding[channel];
            if (fielddef_1.isFieldDef(channelDef) && channelDef.aggregate) {
                log.warn(log.message.incompatibleChannel(channel, mark, 'when the field is aggregated.'));
                delete encoding[channel];
            }
            return;
        }
        if (util_1.isArray(encoding[channel])) {
            // Array of fieldDefs for detail channel (or production rule)
            encoding[channel] = encoding[channel].reduce(function (channelDefs, channelDef) {
                if (!fielddef_1.isFieldDef(channelDef) && !fielddef_1.isValueDef(channelDef)) {
                    log.warn(log.message.emptyFieldDef(channelDef, channel));
                }
                else {
                    channelDefs.push(fielddef_1.normalize(channelDef, channel));
                }
                return channelDefs;
            }, []);
        }
        else {
            var fieldDef = encoding[channel];
            if (fieldDef.field === undefined && fieldDef.value === undefined) {
                log.warn(log.message.emptyFieldDef(fieldDef, channel));
                delete encoding[channel];
                return;
            }
            fielddef_1.normalize(fieldDef, channel);
        }
    });
    return encoding;
}
exports.dropInvalidFieldDefs = dropInvalidFieldDefs;
function isRanged(encoding) {
    return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
}
exports.isRanged = isRanged;
function fieldDefs(encoding) {
    var arr = [];
    channel_1.CHANNELS.forEach(function (channel) {
        if (channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            (util_1.isArray(channelDef) ? channelDef : [channelDef]).forEach(function (fieldDef) {
                arr.push(fieldDef);
            });
        }
    });
    return arr;
}
exports.fieldDefs = fieldDefs;
;
function forEach(mapping, f, thisArg) {
    if (!mapping) {
        return;
    }
    Object.keys(mapping).forEach(function (c) {
        var channel = c;
        if (util_1.isArray(mapping[channel])) {
            mapping[channel].forEach(function (channelDef) {
                f.call(thisArg, channelDef, channel);
            });
        }
        else {
            f.call(thisArg, mapping[channel], channel);
        }
    });
}
exports.forEach = forEach;
function reduce(mapping, f, init, thisArg) {
    if (!mapping) {
        return init;
    }
    return Object.keys(mapping).reduce(function (r, c) {
        var channel = c;
        if (util_1.isArray(mapping[channel])) {
            return mapping[channel].reduce(function (r1, channelDef) {
                return f.call(thisArg, r1, channelDef, channel);
            }, r);
        }
        else {
            return f.call(thisArg, r, mapping[channel], channel);
        }
    }, init);
}
exports.reduce = reduce;
//# sourceMappingURL=encoding.js.map