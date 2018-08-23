import { isArray } from 'vega-util';
import { isAggregateOp } from './aggregate';
import { isBinning } from './bin';
import { CHANNELS, isChannel, supportMark } from './channel';
import { getFieldDef, hasConditionalFieldDef, isConditionalDef, isFieldDef, isValueDef, normalize, normalizeFieldDef, title, vgField } from './fielddef';
import * as log from './log';
import { keys, some } from './util';
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
export function extractTransformsFromEncoding(oldEncoding, config) {
    var groupby = [];
    var bins = [];
    var timeUnits = [];
    var aggregate = [];
    var encoding = {};
    forEach(oldEncoding, function (channelDef, channel) {
        if (isFieldDef(channelDef)) {
            var transformedField = vgField(channelDef, { forAs: true });
            if (channelDef.aggregate && isAggregateOp(channelDef.aggregate)) {
                aggregate.push({
                    op: channelDef.aggregate,
                    field: channelDef.field,
                    as: transformedField
                });
            }
            else {
                // Add bin or timeUnit transform if applicable
                var bin = channelDef.bin;
                if (isBinning(bin)) {
                    var field = channelDef.field;
                    bins.push({ bin: bin, field: field, as: transformedField });
                }
                else if (channelDef.timeUnit) {
                    var timeUnit = channelDef.timeUnit, field = channelDef.field;
                    timeUnits.push({ timeUnit: timeUnit, field: field, as: transformedField });
                }
                // TODO(@alanbanh): make bin correct
                groupby.push(transformedField);
            }
            // now the field should refer to post-transformed field instead
            encoding[channel] = {
                field: vgField(channelDef),
                type: channelDef.type,
                title: title(channelDef, config, { allowDisabling: true })
            };
        }
        else {
            // For value def, just copy
            encoding[channel] = oldEncoding[channel];
        }
    });
    return {
        bins: bins,
        timeUnits: timeUnits,
        aggregate: aggregate,
        groupby: groupby,
        encoding: encoding
    };
}
export function normalizeEncoding(encoding, mark) {
    return keys(encoding).reduce(function (normalizedEncoding, channel) {
        if (!isChannel(channel)) {
            // Drop invalid channel
            log.warn(log.message.invalidEncodingChannel(channel));
            return normalizedEncoding;
        }
        if (!supportMark(encoding, channel, mark)) {
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
                normalizedEncoding[channel] = (isArray(channelDef) ? channelDef : [channelDef]).reduce(function (defs, fieldDef) {
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