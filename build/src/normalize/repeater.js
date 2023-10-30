import { hasOwnProperty, isArray } from 'vega-util';
import { hasConditionalFieldOrDatumDef, isConditionalDef, isFieldDef, isFieldOrDatumDef, isRepeatRef, isSortableFieldDef } from '../channeldef';
import * as log from '../log';
import { isSortField } from '../sort';
import { isFacetMapping } from '../spec/facet';
export function replaceRepeaterInFacet(facet, repeater) {
    if (!repeater) {
        return facet;
    }
    if (isFacetMapping(facet)) {
        return replaceRepeaterInMapping(facet, repeater);
    }
    return replaceRepeaterInFieldDef(facet, repeater);
}
export function replaceRepeaterInEncoding(encoding, repeater) {
    if (!repeater) {
        return encoding;
    }
    return replaceRepeaterInMapping(encoding, repeater);
}
/**
 * Replaces repeated value and returns if the repeated value is valid.
 */
function replaceRepeatInProp(prop, o, repeater) {
    const val = o[prop];
    if (isRepeatRef(val)) {
        if (val.repeat in repeater) {
            return { ...o, [prop]: repeater[val.repeat] };
        }
        else {
            log.warn(log.message.noSuchRepeatedValue(val.repeat));
            return undefined;
        }
    }
    return o;
}
/**
 * Replace repeater values in a field def with the concrete field name.
 */
function replaceRepeaterInFieldDef(fieldDef, repeater) {
    fieldDef = replaceRepeatInProp('field', fieldDef, repeater);
    if (fieldDef === undefined) {
        // the field def should be ignored
        return undefined;
    }
    else if (fieldDef === null) {
        return null;
    }
    if (isSortableFieldDef(fieldDef) && isSortField(fieldDef.sort)) {
        const sort = replaceRepeatInProp('field', fieldDef.sort, repeater);
        fieldDef = {
            ...fieldDef,
            ...(sort ? { sort } : {})
        };
    }
    return fieldDef;
}
function replaceRepeaterInFieldOrDatumDef(def, repeater) {
    if (isFieldDef(def)) {
        return replaceRepeaterInFieldDef(def, repeater);
    }
    else {
        const datumDef = replaceRepeatInProp('datum', def, repeater);
        if (datumDef !== def && !datumDef.type) {
            datumDef.type = 'nominal';
        }
        return datumDef;
    }
}
function replaceRepeaterInChannelDef(channelDef, repeater) {
    if (isFieldOrDatumDef(channelDef)) {
        const fd = replaceRepeaterInFieldOrDatumDef(channelDef, repeater);
        if (fd) {
            return fd;
        }
        else if (isConditionalDef(channelDef)) {
            return { condition: channelDef.condition };
        }
    }
    else {
        if (hasConditionalFieldOrDatumDef(channelDef)) {
            const fd = replaceRepeaterInFieldOrDatumDef(channelDef.condition, repeater);
            if (fd) {
                return {
                    ...channelDef,
                    condition: fd
                };
            }
            else {
                const { condition, ...channelDefWithoutCondition } = channelDef;
                return channelDefWithoutCondition;
            }
        }
        return channelDef;
    }
    return undefined;
}
function replaceRepeaterInMapping(mapping, repeater) {
    const out = {};
    for (const channel in mapping) {
        if (hasOwnProperty(mapping, channel)) {
            const channelDef = mapping[channel];
            if (isArray(channelDef)) {
                // array cannot have condition
                out[channel] = channelDef // somehow we need to cast it here
                    .map(cd => replaceRepeaterInChannelDef(cd, repeater))
                    .filter(cd => cd);
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