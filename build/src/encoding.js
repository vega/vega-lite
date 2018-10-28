import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { isAggregateOp } from './aggregate';
import { isBinning } from './bin';
import { Channel, CHANNELS, isChannel, isNonPositionScaleChannel, supportMark } from './channel';
import { binRequiresRange } from './compile/common';
import { getFieldDef, getGuide, hasConditionalFieldDef, isConditionalDef, isFieldDef, isValueDef, normalize, normalizeFieldDef, title, vgField } from './fielddef';
import * as log from './log';
import { getDateTimeComponents } from './timeunit';
import { Type } from './type';
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
        // Extract potential embedded transformations along with remaining properties
        var field = channelDef.field, aggOp = channelDef.aggregate, timeUnit = channelDef.timeUnit, bin = channelDef.bin, remaining = tslib_1.__rest(channelDef, ["field", "aggregate", "timeUnit", "bin"]);
        if (isFieldDef(channelDef) && (aggOp || timeUnit || bin)) {
            var guide = getGuide(channelDef);
            var isTitleDefined = guide && guide.title;
            var newField = vgField(channelDef, { forAs: true });
            var newChannelDef = tslib_1.__assign({}, (isTitleDefined ? [] : { title: title(channelDef, config, { allowDisabling: true }) }), remaining, { 
                // Always overwrite field
                field: newField });
            var isPositionChannel = channel === Channel.X || channel === Channel.Y;
            if (aggOp && isAggregateOp(aggOp)) {
                var aggregateEntry = {
                    op: aggOp,
                    as: newField
                };
                if (field) {
                    aggregateEntry.field = field;
                }
                aggregate.push(aggregateEntry);
            }
            else if (isBinning(bin)) {
                bins.push({ bin: bin, field: field, as: newField });
                // Add additional groupbys for range and end of bins
                groupby.push(vgField(channelDef, { binSuffix: 'end' }));
                if (binRequiresRange(channelDef, channel)) {
                    groupby.push(vgField(channelDef, { binSuffix: 'range' }));
                }
                // Create accompanying 'x2' or 'y2' field if channel is 'x' or 'y' respectively
                if (isPositionChannel) {
                    var secondaryChannel = {
                        field: newField + '_end',
                        type: Type.QUANTITATIVE
                    };
                    encoding[channel + '2'] = secondaryChannel;
                }
                newChannelDef['bin'] = 'binned';
                newChannelDef.type = Type.QUANTITATIVE;
            }
            else if (timeUnit) {
                timeUnits.push({ timeUnit: timeUnit, field: field, as: newField });
                // Add formatting to appropriate property based on the type of channel we're processing
                var format = getDateTimeComponents(timeUnit, config.axis.shortTimeLabels).join(' ');
                if (isNonPositionScaleChannel(channel)) {
                    newChannelDef['legend'] = tslib_1.__assign({ format: format }, newChannelDef['legend']);
                }
                else if (isPositionChannel) {
                    newChannelDef['axis'] = tslib_1.__assign({ format: format }, newChannelDef['axis']);
                }
                else if (channel === 'text' || channel === 'tooltip') {
                    newChannelDef['format'] = newChannelDef['format'] || format;
                }
            }
            if (!aggOp) {
                groupby.push(newField);
            }
            // now the field should refer to post-transformed field instead
            encoding[channel] = newChannelDef;
        }
        else if (isFieldDef(channelDef)) {
            groupby.push(field);
            encoding[channel] = oldEncoding[channel];
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