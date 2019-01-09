import * as vlEncoding from '../encoding';
import { forEach } from '../encoding';
import { isFieldDef } from '../fielddef';
import * as log from '../log';
import { isPrimitiveMark } from '../mark';
import { stack } from '../stack';
import { hash, vals } from '../util';
import { isConcatSpec, isVConcatSpec } from './concat';
import { isFacetSpec } from './facet';
import { isLayerSpec } from './layer';
import { isRepeatSpec } from './repeat';
import { isUnitSpec } from './unit';
export { normalizeTopLevelSpec as normalize } from '../normalize';
export { isConcatSpec, isHConcatSpec, isVConcatSpec } from './concat';
export { isFacetSpec } from './facet';
export { isLayerSpec } from './layer';
export { isRepeatSpec } from './repeat';
export { isUnitSpec } from './unit';
/* Custom type guards */
// TODO: add vl.spec.validate & move stuff from vl.validate to here
/* Accumulate non-duplicate fieldDefs in a dictionary */
function accumulate(dict, defs) {
    defs.forEach(fieldDef => {
        // Consider only pure fieldDef properties (ignoring scale, axis, legend)
        const pureFieldDef = ['field', 'type', 'value', 'timeUnit', 'bin', 'aggregate'].reduce((f, key) => {
            if (fieldDef[key] !== undefined) {
                f[key] = fieldDef[key];
            }
            return f;
        }, {});
        const key = hash(pureFieldDef);
        dict[key] = dict[key] || fieldDef;
    });
    return dict;
}
/* Recursively get fieldDefs from a spec, returns a dictionary of fieldDefs */
function fieldDefIndex(spec, dict = {}) {
    // FIXME(https://github.com/vega/vega-lite/issues/2207): Support fieldDefIndex for repeat
    if (isLayerSpec(spec)) {
        spec.layer.forEach(layer => {
            if (isUnitSpec(layer)) {
                accumulate(dict, vlEncoding.fieldDefs(layer.encoding));
            }
            else {
                fieldDefIndex(layer, dict);
            }
        });
    }
    else if (isFacetSpec(spec)) {
        accumulate(dict, vlEncoding.fieldDefs(spec.facet));
        fieldDefIndex(spec.spec, dict);
    }
    else if (isRepeatSpec(spec)) {
        fieldDefIndex(spec.spec, dict);
    }
    else if (isConcatSpec(spec)) {
        const childSpec = isVConcatSpec(spec) ? spec.vconcat : spec.hconcat;
        childSpec.forEach(child => fieldDefIndex(child, dict));
    }
    else {
        // Unit Spec
        accumulate(dict, vlEncoding.fieldDefs(spec.encoding));
    }
    return dict;
}
/* Returns all non-duplicate fieldDefs in a spec in a flat array */
export function fieldDefs(spec) {
    return vals(fieldDefIndex(spec));
}
export function isStacked(spec, config) {
    config = config || spec.config;
    if (isPrimitiveMark(spec.mark)) {
        return stack(spec.mark, spec.encoding, config ? config.stack : undefined) !== null;
    }
    return false;
}
/**
 * Takes a spec and returns a list of fields used in encoding
 */
export function usedFields(spec) {
    if (isFacetSpec(spec) || isRepeatSpec(spec)) {
        return usedFieldsSingle(spec);
    }
    if (isLayerSpec(spec)) {
        return usedFieldsLayered(spec);
    }
    if (isUnitSpec(spec)) {
        return usedFieldsUnit(spec);
    }
    throw new Error(log.message.INVALID_SPEC);
}
function usedFieldsUnit(spec) {
    const fields = [];
    forEach(spec.encoding, (channelDef, channel) => {
        if (isFieldDef(channelDef)) {
            fields.push(channelDef.field);
        }
    });
    return fields;
}
function usedFieldsLayered(spec) {
    let fields = [];
    spec.layer.map(subspec => {
        fields = fields.concat(usedFields(subspec));
    });
    return fields;
}
function usedFieldsSingle(spec) {
    return usedFields(spec.spec);
}
//# sourceMappingURL=index.js.map