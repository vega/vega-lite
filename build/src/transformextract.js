import * as tslib_1 from "tslib";
import { extractTransformsFromEncoding } from './encoding';
import * as log from './log';
import { isFacetSpec, isHConcatSpec, isLayerSpec, isRepeatSpec, isUnitSpec, isVConcatSpec } from './spec';
/**
 * Modifies spec extracting transformations from encoding and moving them to the transforms array
 */
export function extractTransforms(spec, config) {
    if (isFacetSpec(spec) || isRepeatSpec(spec)) {
        return extractTransformsSingle(spec, config);
    }
    if (isLayerSpec(spec)) {
        return extractTransformsLayered(spec, config);
    }
    if (isUnitSpec(spec)) {
        return extractTransformsUnit(spec, config);
    }
    if (isVConcatSpec(spec)) {
        return extractTransformsVConcat(spec, config);
    }
    if (isHConcatSpec(spec)) {
        return extractTransformsHConcat(spec, config);
    }
    throw new Error(log.message.INVALID_SPEC);
}
function extractTransformsUnit(spec, config) {
    if (spec.encoding) {
        var oldEncoding = spec.encoding, oldTransforms = spec.transform, rest = tslib_1.__rest(spec, ["encoding", "transform"]);
        var _a = extractTransformsFromEncoding(oldEncoding, config), bins = _a.bins, timeUnits = _a.timeUnits, aggregate = _a.aggregate, groupby = _a.groupby, newEncoding = _a.encoding;
        return tslib_1.__assign({ transform: (oldTransforms ? oldTransforms : []).concat(bins, timeUnits, (!aggregate.length ? [] : [{ aggregate: aggregate, groupby: groupby }])) }, rest, { encoding: newEncoding });
    }
    else {
        return spec;
    }
}
function extractTransformsSingle(spec, config) {
    var subspec = spec.spec, rest = tslib_1.__rest(spec, ["spec"]);
    return tslib_1.__assign({}, rest, { spec: extractTransforms(subspec, config) });
}
function extractTransformsLayered(spec, config) {
    var layer = spec.layer, rest = tslib_1.__rest(spec, ["layer"]);
    return tslib_1.__assign({}, rest, { layer: layer.map(function (subspec) {
            return extractTransforms(subspec, config);
        }) });
}
function extractTransformsVConcat(spec, config) {
    var vconcat = spec.vconcat, rest = tslib_1.__rest(spec, ["vconcat"]);
    return tslib_1.__assign({}, rest, { vconcat: vconcat.map(function (subspec) {
            return extractTransforms(subspec, config);
        }) });
}
function extractTransformsHConcat(spec, config) {
    var hconcat = spec.hconcat, rest = tslib_1.__rest(spec, ["hconcat"]);
    return tslib_1.__assign({}, rest, { hconcat: hconcat.map(function (subspec) {
            return extractTransforms(subspec, config);
        }) });
}
//# sourceMappingURL=transformextract.js.map