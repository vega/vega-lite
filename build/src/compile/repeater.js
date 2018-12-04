import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { hasConditionalFieldDef, isConditionalDef, isFieldDef, isRepeatRef } from '../fielddef';
import * as log from '../log';
import { isSortField } from '../sort';
export function replaceRepeaterInFacet(facet, repeater) {
    return replaceRepeater(facet, repeater);
}
export function replaceRepeaterInEncoding(encoding, repeater) {
    return replaceRepeater(encoding, repeater);
}
/**
 * Replaces repeated value and returns if the repeated value is valid.
 */
function replaceRepeat(o, repeater) {
    if (isRepeatRef(o.field)) {
        if (o.field.repeat in repeater) {
            // any needed to calm down ts compiler
            return tslib_1.__assign({}, o, { field: repeater[o.field.repeat] });
        }
        else {
            log.warn(log.message.noSuchRepeatedValue(o.field.repeat));
            return undefined;
        }
    }
    return o;
}
/**
 * Replace repeater values in a field def with the concrete field name.
 */
function replaceRepeaterInFieldDef(fieldDef, repeater) {
    fieldDef = replaceRepeat(fieldDef, repeater);
    if (fieldDef === undefined) {
        // the field def should be ignored
        return undefined;
    }
    if (fieldDef.sort && isSortField(fieldDef.sort)) {
        var sort = replaceRepeat(fieldDef.sort, repeater);
        fieldDef = tslib_1.__assign({}, fieldDef, (sort ? { sort: sort } : {}));
    }
    return fieldDef;
}
function replaceRepeaterInChannelDef(channelDef, repeater) {
    if (isFieldDef(channelDef)) {
        var fd = replaceRepeaterInFieldDef(channelDef, repeater);
        if (fd) {
            return fd;
        }
        else if (isConditionalDef(channelDef)) {
            return { condition: channelDef.condition };
        }
    }
    else {
        if (hasConditionalFieldDef(channelDef)) {
            var fd = replaceRepeaterInFieldDef(channelDef.condition, repeater);
            if (fd) {
                return tslib_1.__assign({}, channelDef, { condition: fd });
            }
            else {
                var condition = channelDef.condition, channelDefWithoutCondition = tslib_1.__rest(channelDef, ["condition"]);
                return channelDefWithoutCondition;
            }
        }
        return channelDef;
    }
    return undefined;
}
function replaceRepeater(mapping, repeater) {
    var out = {};
    for (var channel in mapping) {
        if (mapping.hasOwnProperty(channel)) {
            var channelDef = mapping[channel];
            if (isArray(channelDef)) {
                // array cannot have condition
                out[channel] = channelDef.map(function (cd) { return replaceRepeaterInChannelDef(cd, repeater); }).filter(function (cd) { return cd; });
            }
            else {
                var cd = replaceRepeaterInChannelDef(channelDef, repeater);
                if (cd) {
                    out[channel] = cd;
                }
            }
        }
    }
    return out;
}
//# sourceMappingURL=repeater.js.map