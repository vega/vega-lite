import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { isArgmaxDef, isArgminDef } from './aggregate';
import { isBinned, isBinning } from './bin';
import { CHANNELS, isChannel, isNonPositionScaleChannel, isSecondaryRangeChannel, supportMark } from './channel';
import { binRequiresRange, getFieldDef, getGuide, getTypedFieldDef, hasConditionalFieldDef, isConditionalDef, isFieldDef, isTypedFieldDef, isValueDef, normalize, normalizeFieldDef, title, vgField } from './channeldef';
import * as log from './log';
import { getDateTimeComponents } from './timeunit';
import { TEMPORAL } from './type';
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
                let newField = vgField(channelDef, { forAs: true });
                const newFieldDef = Object.assign({}, (isTitleDefined ? [] : { title: title(channelDef, config, { allowDisabling: true }) }), remaining, { 
                    // Always overwrite field
                    field: newField });
                const isPositionChannel = channel === 'x' || channel === 'y';
                if (aggOp) {
                    let op;
                    if (isArgmaxDef(aggOp)) {
                        op = 'argmax';
                        newField = vgField({ aggregate: 'argmax', field: aggOp.argmax }, { forAs: true });
                        newFieldDef.field = `${newField}.${field}`;
                    }
                    else if (isArgminDef(aggOp)) {
                        op = 'argmin';
                        newField = vgField({ aggregate: 'argmin', field: aggOp.argmin }, { forAs: true });
                        newFieldDef.field = `${newField}.${field}`;
                    }
                    else if (aggOp !== 'boxplot' && aggOp !== 'errorbar' && aggOp !== 'errorband') {
                        op = aggOp;
                    }
                    if (op) {
                        const aggregateEntry = {
                            op,
                            as: newField
                        };
                        if (field) {
                            aggregateEntry.field = field;
                        }
                        aggregate.push(aggregateEntry);
                    }
                }
                else {
                    groupby.push(newField);
                    if (isTypedFieldDef(channelDef) && isBinning(bin)) {
                        bins.push({ bin, field, as: newField });
                        // Add additional groupbys for range and end of bins
                        groupby.push(vgField(channelDef, { binSuffix: 'end' }));
                        if (binRequiresRange(channelDef, channel)) {
                            groupby.push(vgField(channelDef, { binSuffix: 'range' }));
                        }
                        // Create accompanying 'x2' or 'y2' field if channel is 'x' or 'y' respectively
                        if (isPositionChannel) {
                            const secondaryChannel = {
                                field: newField + '_end'
                            };
                            encoding[channel + '2'] = secondaryChannel;
                        }
                        newFieldDef.bin = 'binned';
                        if (!isSecondaryRangeChannel(channel)) {
                            newFieldDef['type'] = 'quantitative';
                        }
                    }
                    else if (timeUnit) {
                        timeUnits.push({ timeUnit, field, as: newField });
                        // Add formatting to appropriate property based on the type of channel we're processing
                        const format = getDateTimeComponents(timeUnit, config.axis.shortTimeLabels).join(' ');
                        const formatType = isTypedFieldDef(channelDef) && channelDef.type !== TEMPORAL && 'time';
                        if (channel === 'text' || channel === 'tooltip') {
                            newFieldDef['format'] = newFieldDef['format'] || format;
                            if (formatType) {
                                newFieldDef['formatType'] = formatType;
                            }
                        }
                        else if (isNonPositionScaleChannel(channel)) {
                            newFieldDef['legend'] = Object.assign({ format }, (formatType ? { formatType } : {}), newFieldDef['legend']);
                        }
                        else if (isPositionChannel) {
                            newFieldDef['axis'] = Object.assign({ format }, (formatType ? { formatType } : {}), newFieldDef['axis']);
                        }
                    }
                }
                // now the field should refer to post-transformed field instead
                encoding[channel] = newFieldDef;
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
        if (isFieldDef(primaryFieldDef) && isFieldDef(encoding[channel]) && isBinned(primaryFieldDef.bin)) {
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
        const el = mapping[channel];
        if (isArray(el)) {
            el.forEach((channelDef) => {
                f.call(thisArg, channelDef, channel);
            });
        }
        else {
            f.call(thisArg, el, channel);
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
/**
 * Returns list of path grouping fields for the given encoding
 */
export function pathGroupingFields(mark, encoding) {
    return keys(encoding).reduce((details, channel) => {
        switch (channel) {
            // x, y, x2, y2, lat, long, lat1, long2, order, tooltip, href, cursor should not cause lines to group
            case 'x':
            case 'y':
            case 'href':
            case 'x2':
            case 'y2':
            // falls through
            case 'latitude':
            case 'longitude':
            case 'latitude2':
            case 'longitude2':
            // TODO: case 'cursor':
            // text, shape, shouldn't be a part of line/trail/area [falls through]
            case 'text':
            case 'shape':
            // falls through
            // tooltip fields should not be added to group by [falls through]
            case 'tooltip':
                return details;
            case 'order':
                // order should not group line / trail
                if (mark === 'line' || mark === 'trail') {
                    return details;
                }
            // but order should group area for stacking (falls through)
            case 'detail':
            case 'key': {
                const channelDef = encoding[channel];
                if (isArray(channelDef) || isFieldDef(channelDef)) {
                    (isArray(channelDef) ? channelDef : [channelDef]).forEach(fieldDef => {
                        if (!fieldDef.aggregate) {
                            details.push(vgField(fieldDef, {}));
                        }
                    });
                }
                return details;
            }
            case 'size':
                if (mark === 'trail') {
                    // For trail, size should not group trail lines.
                    return details;
                }
            // For line, size should group lines.
            // falls through
            case 'color':
            case 'fill':
            case 'stroke':
            case 'opacity':
            case 'fillOpacity':
            case 'strokeOpacity':
            case 'strokeWidth': {
                // TODO strokeDashOffset:
                // falls through
                const fieldDef = getTypedFieldDef(encoding[channel]);
                if (fieldDef && !fieldDef.aggregate) {
                    details.push(vgField(fieldDef, {}));
                }
                return details;
            }
        }
    }, []);
}
//# sourceMappingURL=encoding.js.map