import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { isAggregateOp } from './aggregate';
import { isBinning } from './bin';
import { Channel, CHANNELS, isChannel, isNonPositionScaleChannel, isSecondaryRangeChannel, supportMark } from './channel';
import { binRequiresRange, getFieldDef, getGuide, getTypedFieldDef, hasConditionalFieldDef, isConditionalDef, isFieldDef, isTypedFieldDef, isValueDef, normalize, normalizeFieldDef, title, vgField } from './fielddef';
import * as log from './log';
import { getDateTimeComponents } from './timeunit';
import { Type } from './type';
import { keys, some } from './util';
export function channelHasField(encoding, channel) {
    const channelDef = encoding && encoding[channel];
    if (channelDef) {
        if (isArray(channelDef)) {
            return some(channelDef, fieldDef => !!fieldDef.field);
        }
        else {
            return isFieldDef(channelDef) || hasConditionalFieldDef(channelDef);
        }
    }
    return false;
}
export function isAggregate(encoding) {
    return some(CHANNELS, channel => {
        if (channelHasField(encoding, channel)) {
            const channelDef = encoding[channel];
            if (isArray(channelDef)) {
                return some(channelDef, fieldDef => !!fieldDef.aggregate);
            }
            else {
                const fieldDef = getFieldDef(channelDef);
                return fieldDef && !!fieldDef.aggregate;
            }
        }
        return false;
    });
}
export function extractTransformsFromEncoding(oldEncoding, config) {
    const groupby = [];
    const bins = [];
    const timeUnits = [];
    const aggregate = [];
    const encoding = {};
    forEach(oldEncoding, (channelDef, channel) => {
        // Extract potential embedded transformations along with remaining properties
        if (isFieldDef(channelDef)) {
            const { field, aggregate: aggOp, timeUnit, bin } = channelDef, remaining = tslib_1.__rest(channelDef, ["field", "aggregate", "timeUnit", "bin"]);
            if (aggOp || timeUnit || bin) {
                const guide = getGuide(channelDef);
                const isTitleDefined = guide && guide.title;
                const newField = vgField(channelDef, { forAs: true });
                const newChannelDef = Object.assign({}, (isTitleDefined ? [] : { title: title(channelDef, config, { allowDisabling: true }) }), remaining, { 
                    // Always overwrite field
                    field: newField });
                const isPositionChannel = channel === Channel.X || channel === Channel.Y;
                if (aggOp && isAggregateOp(aggOp)) {
                    const aggregateEntry = {
                        op: aggOp,
                        as: newField
                    };
                    if (field) {
                        aggregateEntry.field = field;
                    }
                    aggregate.push(aggregateEntry);
                }
                else if (isTypedFieldDef(channelDef) && isBinning(bin)) {
                    bins.push({ bin, field, as: newField });
                    // Add additional groupbys for range and end of bins
                    groupby.push(vgField(channelDef, { binSuffix: 'end' }));
                    if (binRequiresRange(channelDef, channel)) {
                        groupby.push(vgField(channelDef, { binSuffix: 'range' }));
                    }
                    // Create accompanying 'x2' or 'y2' field if channel is 'x' or 'y' respectively
                    if (isPositionChannel) {
                        const secondaryChannel = {
                            field: newField + '_end',
                            type: Type.QUANTITATIVE
                        };
                        encoding[channel + '2'] = secondaryChannel;
                    }
                    newChannelDef['bin'] = 'binned';
                    if (!isSecondaryRangeChannel(channel)) {
                        newChannelDef['type'] = Type.QUANTITATIVE;
                    }
                }
                else if (timeUnit) {
                    timeUnits.push({ timeUnit, field, as: newField });
                    // Add formatting to appropriate property based on the type of channel we're processing
                    const format = getDateTimeComponents(timeUnit, config.axis.shortTimeLabels).join(' ');
                    if (isNonPositionScaleChannel(channel)) {
                        newChannelDef['legend'] = Object.assign({ format }, newChannelDef['legend']);
                    }
                    else if (isPositionChannel) {
                        newChannelDef['axis'] = Object.assign({ format }, newChannelDef['axis']);
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
            else {
                groupby.push(field);
                encoding[channel] = oldEncoding[channel];
            }
        }
        else {
            // For value def, just copy
            encoding[channel] = oldEncoding[channel];
        }
    });
    return {
        bins,
        timeUnits,
        aggregate,
        groupby,
        encoding
    };
}
export function markChannelCompatible(encoding, channel, mark) {
    const markSupported = supportMark(channel, mark);
    if (!markSupported) {
        return false;
    }
    else if (markSupported === 'binned') {
        const primaryFieldDef = encoding[channel === 'x2' ? 'x' : 'y'];
        // circle, point, square and tick only support x2/y2 when their corresponding x/y fieldDef
        // has "binned" data and thus need x2/y2 to specify the bin-end field.
        if (isFieldDef(primaryFieldDef) && isFieldDef(encoding[channel]) && primaryFieldDef.bin === 'binned') {
            return true;
        }
        else {
            return false;
        }
    }
    return true;
}
export function normalizeEncoding(encoding, mark) {
    return keys(encoding).reduce((normalizedEncoding, channel) => {
        if (!isChannel(channel)) {
            // Drop invalid channel
            log.warn(log.message.invalidEncodingChannel(channel));
            return normalizedEncoding;
        }
        if (!markChannelCompatible(encoding, channel, mark)) {
            // Drop unsupported channel
            log.warn(log.message.incompatibleChannel(channel, mark));
            return normalizedEncoding;
        }
        // Drop line's size if the field is aggregated.
        if (channel === 'size' && mark === 'line') {
            const fieldDef = getTypedFieldDef(encoding[channel]);
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
        const channelDef = encoding[channel];
        if (channel === 'detail' ||
            (channel === 'order' && !isArray(channelDef) && !isValueDef(channelDef)) ||
            (channel === 'tooltip' && isArray(channelDef))) {
            if (channelDef) {
                // Array of fieldDefs for detail channel (or production rule)
                normalizedEncoding[channel] = (isArray(channelDef) ? channelDef : [channelDef]).reduce((defs, fieldDef) => {
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
            if (channel === 'tooltip' && channelDef === null) {
                // Preserve null so we can use it to disable tooltip
                normalizedEncoding[channel] = null;
            }
            else if (!isFieldDef(channelDef) && !isValueDef(channelDef) && !isConditionalDef(channelDef)) {
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
    const arr = [];
    for (const channel of keys(encoding)) {
        if (channelHasField(encoding, channel)) {
            const channelDef = encoding[channel];
            (isArray(channelDef) ? channelDef : [channelDef]).forEach(def => {
                if (isFieldDef(def)) {
                    arr.push(def);
                }
                else if (hasConditionalFieldDef(def)) {
                    arr.push(def.condition);
                }
            });
        }
    }
    return arr;
}
export function forEach(mapping, f, thisArg) {
    if (!mapping) {
        return;
    }
    for (const channel of keys(mapping)) {
        if (isArray(mapping[channel])) {
            mapping[channel].forEach((channelDef) => {
                f.call(thisArg, channelDef, channel);
            });
        }
        else {
            f.call(thisArg, mapping[channel], channel);
        }
    }
}
export function reduce(mapping, f, init, thisArg) {
    if (!mapping) {
        return init;
    }
    return keys(mapping).reduce((r, channel) => {
        const map = mapping[channel];
        if (isArray(map)) {
            return map.reduce((r1, channelDef) => {
                return f.call(thisArg, r1, channelDef, channel);
            }, r);
        }
        else {
            return f.call(thisArg, r, map, channel);
        }
    }, init);
}
//# sourceMappingURL=encoding.js.map