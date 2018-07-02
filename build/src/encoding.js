import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { CHANNELS, isChannel, supportMark } from './channel';
import { getFieldDef, hasConditionalFieldDef, isConditionalDef, isFieldDef, isValueDef, normalize, normalizeFieldDef } from './fielddef';
import * as log from './log';
import { Type } from './type';
import { contains, keys, some } from './util';
export function channelHasField(encoding, channel) {
    var channelDef = encoding && encoding[channel];
    if (channelDef) {
        if (isArray(channelDef)) {
            return some(channelDef, function (fieldDef) { return !!fieldDef.field; });
        }
        else {
            return isFieldDef(channelDef) || hasConditionalFieldDef(channelDef);
        }
    }
    return false;
}
export function isAggregate(encoding) {
    return some(CHANNELS, function (channel) {
        if (channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            if (isArray(channelDef)) {
                return some(channelDef, function (fieldDef) { return !!fieldDef.aggregate; });
            }
            else {
                var fieldDef = getFieldDef(channelDef);
                return fieldDef && !!fieldDef.aggregate;
            }
        }
        return false;
    });
}
export function normalizeEncoding(encoding, mark) {
    return keys(encoding).reduce(function (normalizedEncoding, channel) {
        var _a;
        if (!isChannel(channel)) {
            // Drop invalid channel
            log.warn(log.message.invalidEncodingChannel(channel));
            return normalizedEncoding;
        }
        if (!supportMark(channel, mark)) {
            // Drop unsupported channel
            log.warn(log.message.incompatibleChannel(channel, mark));
            return normalizedEncoding;
        }
        // Drop line's size if the field is aggregated.
        if (channel === 'size' && mark === 'line') {
            var fieldDef = getFieldDef(encoding[channel]);
            if (fieldDef && fieldDef.aggregate) {
                log.warn(log.message.LINE_WITH_VARYING_SIZE);
                return normalizedEncoding;
            }
        }
        // Drop color if either fill or stroke is specified
        if (channel === 'color' && ('fill' in encoding || 'stroke' in encoding)) {
            log.warn(log.message.droppingColor('encoding', { fill: 'fill' in encoding, stroke: 'stroke' in encoding }));
            return normalizedEncoding;
        }
        var channelDef = encoding[channel];
        if (channel === 'detail' ||
            (channel === 'order' && !isArray(channelDef) && !isValueDef(channelDef)) ||
            (channel === 'tooltip' && isArray(channelDef))) {
            if (channelDef) {
                // Array of fieldDefs for detail channel (or production rule)
                normalizedEncoding[channel] = (isArray(channelDef) ? channelDef : [channelDef])
                    .reduce(function (defs, fieldDef) {
                    if (!isFieldDef(fieldDef)) {
                        log.warn(log.message.emptyFieldDef(fieldDef, channel));
                    }
                    else {
                        defs.push(normalizeFieldDef(fieldDef, channel));
                    }
                    return defs;
                }, []);
            }
        }
        else {
            var fieldDef = getFieldDef(encoding[channel]);
            if (fieldDef && contains([Type.LATITUDE, Type.LONGITUDE], fieldDef.type)) {
                var _b = channel, _ = normalizedEncoding[_b], newEncoding = tslib_1.__rest(normalizedEncoding, [typeof _b === "symbol" ? _b : _b + ""]);
                var newChannel = channel === 'x' ? 'longitude' :
                    channel === 'y' ? 'latitude' :
                        channel === 'x2' ? 'longitude2' :
                            channel === 'y2' ? 'latitude2' : undefined;
                log.warn(log.message.latLongDeprecated(channel, fieldDef.type, newChannel));
                return tslib_1.__assign({}, newEncoding, (_a = {}, _a[newChannel] = tslib_1.__assign({}, normalize(fieldDef, channel), { type: 'quantitative' }), _a));
            }
            if (!isFieldDef(channelDef) && !isValueDef(channelDef) && !isConditionalDef(channelDef)) {
                log.warn(log.message.emptyFieldDef(channelDef, channel));
                return normalizedEncoding;
            }
            normalizedEncoding[channel] = normalize(channelDef, channel);
        }
        return normalizedEncoding;
    }, {});
}
export function isRanged(encoding) {
    return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
}
export function fieldDefs(encoding) {
    var arr = [];
    CHANNELS.forEach(function (channel) {
        if (channelHasField(encoding, channel)) {
            var channelDef = encoding[channel];
            (isArray(channelDef) ? channelDef : [channelDef]).forEach(function (def) {
                if (isFieldDef(def)) {
                    arr.push(def);
                }
                else if (hasConditionalFieldDef(def)) {
                    arr.push(def.condition);
                }
            });
        }
    });
    return arr;
}
export function forEach(mapping, f, thisArg) {
    if (!mapping) {
        return;
    }
    var _loop_1 = function (channel) {
        if (isArray(mapping[channel])) {
            mapping[channel].forEach(function (channelDef) {
                f.call(thisArg, channelDef, channel);
            });
        }
        else {
            f.call(thisArg, mapping[channel], channel);
        }
    };
    for (var _i = 0, _a = keys(mapping); _i < _a.length; _i++) {
        var channel = _a[_i];
        _loop_1(channel);
    }
}
export function reduce(mapping, f, init, thisArg) {
    if (!mapping) {
        return init;
    }
    return keys(mapping).reduce(function (r, channel) {
        var map = mapping[channel];
        if (isArray(map)) {
            return map.reduce(function (r1, channelDef) {
                return f.call(thisArg, r1, channelDef, channel);
            }, r);
        }
        else {
            return f.call(thisArg, r, map, channel);
        }
    }, init);
}
//# sourceMappingURL=encoding.js.map