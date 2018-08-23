import * as vlEncoding from './encoding';
import { isPrimitiveMark } from './mark';
import { stack } from './stack';
import { hash, vals } from './util';
/* Custom type guards */
export function isFacetSpec(spec) {
    return spec['facet'] !== undefined;
}
export function isUnitSpec(spec) {
    return !!spec['mark'];
}
export function isLayerSpec(spec) {
    return spec['layer'] !== undefined;
}
export function isRepeatSpec(spec) {
    return spec['repeat'] !== undefined;
}
export function isConcatSpec(spec) {
    return isVConcatSpec(spec) || isHConcatSpec(spec);
}
export function isVConcatSpec(spec) {
    return spec['vconcat'] !== undefined;
}
export function isHConcatSpec(spec) {
    return spec['hconcat'] !== undefined;
}
export { normalizeTopLevelSpec as normalize } from './normalize';
// TODO: add vl.spec.validate & move stuff from vl.validate to here
/* Accumulate non-duplicate fieldDefs in a dictionary */
function accumulate(dict, defs) {
    defs.forEach(function (fieldDef) {
        // Consider only pure fieldDef properties (ignoring scale, axis, legend)
        var pureFieldDef = ['field', 'type', 'value', 'timeUnit', 'bin', 'aggregate'].reduce(function (f, key) {
            if (fieldDef[key] !== undefined) {
                f[key] = fieldDef[key];
            }
            return f;
        }, {});
        var key = hash(pureFieldDef);
        dict[key] = dict[key] || fieldDef;
    });
    return dict;
}
/* Recursively get fieldDefs from a spec, returns a dictionary of fieldDefs */
function fieldDefIndex(spec, dict) {
    if (dict === void 0) { dict = {}; }
    // FIXME(https://github.com/vega/vega-lite/issues/2207): Support fieldDefIndex for repeat
    if (isLayerSpec(spec)) {
        spec.layer.forEach(function (layer) {
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
        var childSpec = isVConcatSpec(spec) ? spec.vconcat : spec.hconcat;
        childSpec.forEach(function (child) { return fieldDefIndex(child, dict); });
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
//# sourceMappingURL=spec.js.map