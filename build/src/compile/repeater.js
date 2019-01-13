import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { hasConditionalFieldDef, isConditionalDef, isFieldDef, isRepeatRef, isSortableFieldDef } from '../fielddef';
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
            return Object.assign({}, o, { field: repeater[o.field.repeat] });
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
    else if (fieldDef === null) {
        return null;
    }
    if (isSortableFieldDef(fieldDef) && isSortField(fieldDef.sort)) {
        const sort = replaceRepeat(fieldDef.sort, repeater);
        fieldDef = Object.assign({}, fieldDef, (sort ? { sort } : {}));
    }
    return fieldDef;
}
function replaceRepeaterInChannelDef(channelDef, repeater) {
    if (isFieldDef(channelDef)) {
        const fd = replaceRepeaterInFieldDef(channelDef, repeater);
        if (fd) {
            return fd;
        }
        else if (isConditionalDef(channelDef)) {
            return { condition: channelDef.condition };
        }
    }
    else {
        if (hasConditionalFieldDef(channelDef)) {
            const fd = replaceRepeaterInFieldDef(channelDef.condition, repeater);
            if (fd) {
                return Object.assign({}, channelDef, { condition: fd });
            }
            else {
                const { condition } = channelDef, channelDefWithoutCondition = tslib_1.__rest(channelDef, ["condition"]);
                return channelDefWithoutCondition;
            }
        }
        return channelDef;
    }
    return undefined;
}
function replaceRepeater(mapping, repeater) {
    const out = {};
    for (const channel in mapping) {
        if (mapping.hasOwnProperty(channel)) {
            const channelDef = mapping[channel];
            if (isArray(channelDef)) {
                // array cannot have condition
                out[channel] = channelDef.map(cd => replaceRepeaterInChannelDef(cd, repeater)).filter(cd => cd);
            }
            else {
                const cd = replaceRepeaterInChannelDef(channelDef, repeater);
                if (cd !== undefined) {
                    out[channel] = cd;
                }
            }
        }
    }
    return out;
}
//# sourceMappingURL=repeater.js.map