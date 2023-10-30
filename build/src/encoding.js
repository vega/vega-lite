import { array, isArray } from 'vega-util';
import { isArgmaxDef, isArgminDef } from './aggregate';
import { isBinned, isBinning } from './bin';
import { ANGLE, CHANNELS, COLOR, DESCRIPTION, DETAIL, FILL, FILLOPACITY, getMainChannelFromOffsetChannel, getOffsetScaleChannel, HREF, isChannel, isNonPositionScaleChannel, isSecondaryRangeChannel, isXorY, isXorYOffset, KEY, LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2, OPACITY, ORDER, RADIUS, RADIUS2, SHAPE, SIZE, STROKE, STROKEDASH, STROKEOPACITY, STROKEWIDTH, supportMark, TEXT, THETA, THETA2, TOOLTIP, UNIT_CHANNELS, URL, X, X2, XOFFSET, Y, Y2, YOFFSET } from './channel';
import { binRequiresRange, getFieldDef, getGuide, hasConditionalFieldDef, hasConditionalFieldOrDatumDef, initChannelDef, initFieldDef, isConditionalDef, isDatumDef, isFieldDef, isOrderOnlyDef, isTypedFieldDef, isValueDef, title, vgField } from './channeldef';
import * as log from './log';
import { isContinuous, isDiscrete, QUANTITATIVE, TEMPORAL } from './type';
import { keys, some } from './util';
import { isSignalRef } from './vega.schema';
import { isBinnedTimeUnit } from './timeunit';
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
export function channelHasFieldOrDatum(encoding, channel) {
    const channelDef = encoding && encoding[channel];
    if (channelDef) {
        if (isArray(channelDef)) {
            return some(channelDef, fieldDef => !!fieldDef.field);
        }
        else {
            return isFieldDef(channelDef) || isDatumDef(channelDef) || hasConditionalFieldOrDatumDef(channelDef);
        }
    }
    return false;
}
export function channelHasNestedOffsetScale(encoding, channel) {
    if (isXorY(channel)) {
        const fieldDef = encoding[channel];
        if ((isFieldDef(fieldDef) || isDatumDef(fieldDef)) &&
            (isDiscrete(fieldDef.type) || (isFieldDef(fieldDef) && fieldDef.timeUnit))) {
            const offsetChannel = getOffsetScaleChannel(channel);
            return channelHasFieldOrDatum(encoding, offsetChannel);
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
            const { field, aggregate: aggOp, bin, timeUnit, ...remaining } = channelDef;
            if (aggOp || timeUnit || bin) {
                const guide = getGuide(channelDef);
                const isTitleDefined = guide?.title;
                let newField = vgField(channelDef, { forAs: true });
                const newFieldDef = {
                    // Only add title if it doesn't exist
                    ...(isTitleDefined ? [] : { title: title(channelDef, config, { allowDisabling: true }) }),
                    ...remaining,
                    // Always overwrite field
                    field: newField
                };
                if (aggOp) {
                    let op;
                    if (isArgmaxDef(aggOp)) {
                        op = 'argmax';
                        newField = vgField({ op: 'argmax', field: aggOp.argmax }, { forAs: true });
                        newFieldDef.field = `${newField}.${field}`;
                    }
                    else if (isArgminDef(aggOp)) {
                        op = 'argmin';
                        newField = vgField({ op: 'argmin', field: aggOp.argmin }, { forAs: true });
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
                        if (isXorY(channel)) {
                            const secondaryChannel = {
                                field: `${newField}_end`
                            };
                            encoding[`${channel}2`] = secondaryChannel;
                        }
                        newFieldDef.bin = 'binned';
                        if (!isSecondaryRangeChannel(channel)) {
                            newFieldDef['type'] = QUANTITATIVE;
                        }
                    }
                    else if (timeUnit && !isBinnedTimeUnit(timeUnit)) {
                        timeUnits.push({
                            timeUnit,
                            field,
                            as: newField
                        });
                        // define the format type for later compilation
                        const formatType = isTypedFieldDef(channelDef) && channelDef.type !== TEMPORAL && 'time';
                        if (formatType) {
                            if (channel === TEXT || channel === TOOLTIP) {
                                newFieldDef['formatType'] = formatType;
                            }
                            else if (isNonPositionScaleChannel(channel)) {
                                newFieldDef['legend'] = {
                                    formatType,
                                    ...newFieldDef['legend']
                                };
                            }
                            else if (isXorY(channel)) {
                                newFieldDef['axis'] = {
                                    formatType,
                                    ...newFieldDef['axis']
                                };
                            }
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
            // For value def / signal ref / datum def, just copy
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
        const primaryFieldDef = encoding[channel === X2 ? X : Y];
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
export function initEncoding(encoding, mark, filled, config) {
    const normalizedEncoding = {};
    for (const key of keys(encoding)) {
        if (!isChannel(key)) {
            // Drop invalid channel
            log.warn(log.message.invalidEncodingChannel(key));
        }
    }
    for (let channel of UNIT_CHANNELS) {
        if (!encoding[channel]) {
            continue;
        }
        const channelDef = encoding[channel];
        if (isXorYOffset(channel)) {
            const mainChannel = getMainChannelFromOffsetChannel(channel);
            const positionDef = normalizedEncoding[mainChannel];
            if (isFieldDef(positionDef)) {
                if (isContinuous(positionDef.type)) {
                    if (isFieldDef(channelDef) && !positionDef.timeUnit) {
                        // TODO: nesting continuous field instead continuous field should
                        // behave like offsetting the data in data domain
                        log.warn(log.message.offsetNestedInsideContinuousPositionScaleDropped(mainChannel));
                        continue;
                    }
                }
            }
        }
        if (channel === 'angle' && mark === 'arc' && !encoding.theta) {
            log.warn(log.message.REPLACE_ANGLE_WITH_THETA);
            channel = THETA;
        }
        if (!markChannelCompatible(encoding, channel, mark)) {
            // Drop unsupported channel
            log.warn(log.message.incompatibleChannel(channel, mark));
            continue;
        }
        // Drop line's size if the field is aggregated.
        if (channel === SIZE && mark === 'line') {
            const fieldDef = getFieldDef(encoding[channel]);
            if (fieldDef?.aggregate) {
                log.warn(log.message.LINE_WITH_VARYING_SIZE);
                continue;
            }
        }
        // Drop color if either fill or stroke is specified
        if (channel === COLOR && (filled ? 'fill' in encoding : 'stroke' in encoding)) {
            log.warn(log.message.droppingColor('encoding', { fill: 'fill' in encoding, stroke: 'stroke' in encoding }));
            continue;
        }
        if (channel === DETAIL ||
            (channel === ORDER && !isArray(channelDef) && !isValueDef(channelDef)) ||
            (channel === TOOLTIP && isArray(channelDef))) {
            if (channelDef) {
                if (channel === ORDER) {
                    const def = encoding[channel];
                    if (isOrderOnlyDef(def)) {
                        normalizedEncoding[channel] = def;
                        continue;
                    }
                }
                // Array of fieldDefs for detail channel (or production rule)
                normalizedEncoding[channel] = array(channelDef).reduce((defs, fieldDef) => {
                    if (!isFieldDef(fieldDef)) {
                        log.warn(log.message.emptyFieldDef(fieldDef, channel));
                    }
                    else {
                        defs.push(initFieldDef(fieldDef, channel));
                    }
                    return defs;
                }, []);
            }
        }
        else {
            if (channel === TOOLTIP && channelDef === null) {
                // Preserve null so we can use it to disable tooltip
                normalizedEncoding[channel] = null;
            }
            else if (!isFieldDef(channelDef) &&
                !isDatumDef(channelDef) &&
                !isValueDef(channelDef) &&
                !isConditionalDef(channelDef) &&
                !isSignalRef(channelDef)) {
                log.warn(log.message.emptyFieldDef(channelDef, channel));
                continue;
            }
            normalizedEncoding[channel] = initChannelDef(channelDef, channel, config);
        }
    }
    return normalizedEncoding;
}
/**
 * For composite marks, we have to call initChannelDef during init so we can infer types earlier.
 */
export function normalizeEncoding(encoding, config) {
    const normalizedEncoding = {};
    for (const channel of keys(encoding)) {
        const newChannelDef = initChannelDef(encoding[channel], channel, config, { compositeMark: true });
        normalizedEncoding[channel] = newChannelDef;
    }
    return normalizedEncoding;
}
export function fieldDefs(encoding) {
    const arr = [];
    for (const channel of keys(encoding)) {
        if (channelHasField(encoding, channel)) {
            const channelDef = encoding[channel];
            const channelDefArray = array(channelDef);
            for (const def of channelDefArray) {
                if (isFieldDef(def)) {
                    arr.push(def);
                }
                else if (hasConditionalFieldDef(def)) {
                    arr.push(def.condition);
                }
            }
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
            for (const channelDef of el) {
                f.call(thisArg, channelDef, channel);
            }
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
            // x, y, x2, y2, lat, long, lat1, long2, order, tooltip, href, aria label, cursor should not cause lines to group
            case X:
            case Y:
            case HREF:
            case DESCRIPTION:
            case URL:
            case X2:
            case Y2:
            case XOFFSET:
            case YOFFSET:
            case THETA:
            case THETA2:
            case RADIUS:
            case RADIUS2:
            // falls through
            case LATITUDE:
            case LONGITUDE:
            case LATITUDE2:
            case LONGITUDE2:
            // TODO: case 'cursor':
            // text, shape, shouldn't be a part of line/trail/area [falls through]
            case TEXT:
            case SHAPE:
            case ANGLE:
            // falls through
            // tooltip fields should not be added to group by [falls through]
            case TOOLTIP:
                return details;
            case ORDER:
                // order should not group line / trail
                if (mark === 'line' || mark === 'trail') {
                    return details;
                }
            // but order should group area for stacking (falls through)
            case DETAIL:
            case KEY: {
                const channelDef = encoding[channel];
                if (isArray(channelDef) || isFieldDef(channelDef)) {
                    for (const fieldDef of array(channelDef)) {
                        if (!fieldDef.aggregate) {
                            details.push(vgField(fieldDef, {}));
                        }
                    }
                }
                return details;
            }
            case SIZE:
                if (mark === 'trail') {
                    // For trail, size should not group trail lines.
                    return details;
                }
            // For line, size should group lines.
            // falls through
            case COLOR:
            case FILL:
            case STROKE:
            case OPACITY:
            case FILLOPACITY:
            case STROKEOPACITY:
            case STROKEDASH:
            case STROKEWIDTH: {
                // TODO strokeDashOffset:
                // falls through
                const fieldDef = getFieldDef(encoding[channel]);
                if (fieldDef && !fieldDef.aggregate) {
                    details.push(vgField(fieldDef, {}));
                }
                return details;
            }
        }
    }, []);
}
//# sourceMappingURL=encoding.js.map