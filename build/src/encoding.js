"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// utility for encoding mapping
var channel_1 = require("./channel");
var fielddef_1 = require("./fielddef");
var log = require("./log");
var util_1 = require("./util");
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
            var channelDef = encoding[channel];
            if (!fielddef_1.isFieldDef(channelDef) && !fielddef_1.isValueDef(channelDef)) {
                log.warn(log.message.emptyFieldDef(channelDef, channel));
                delete encoding[channel];
                return;
            }
            fielddef_1.normalize(channelDef, channel);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW5jb2RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBK0I7QUFDL0IscUNBQXlEO0FBRXpELHVDQUFpTDtBQUNqTCwyQkFBNkI7QUFFN0IsK0JBQWdEO0FBMkVoRCx5QkFBZ0MsUUFBMkIsRUFBRSxPQUFnQjtJQUMzRSxJQUFNLFVBQVUsR0FBRyxRQUFRLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDZixFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxXQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsUUFBUSxJQUFLLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQWhCLENBQWdCLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMscUJBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoQyxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBVkQsMENBVUM7QUFFRCxxQkFBNEIsUUFBMkI7SUFDckQsTUFBTSxDQUFDLFdBQUksQ0FBQyxrQkFBUSxFQUFFLFVBQUMsT0FBTztRQUM1QixFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLFdBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQyxRQUFRLElBQUssT0FBQSxDQUFDLENBQUMs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