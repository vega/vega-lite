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
        const { encoding: oldEncoding, transform: oldTransforms } = spec, rest = tslib_1.__rest(spec, ["encoding", "transform"]);
        const { bins, timeUnits, aggregate, groupby, encoding: newEncoding } = extractTransformsFromEncoding(oldEncoding, config);
        return Object.assign({ transform: [
                ...(oldTransforms ? oldTransforms : []),
                ...bins,
                ...timeUnits,
                ...(!aggregate.length ? [] : [{ aggregate, groupby }])
            ] }, rest, { encoding: newEncoding });
    }
    else {
        return spec;
    }
}
function extractTransformsSingle(spec, config) {
    const { spec: subspec } = spec, rest = tslib_1.__rest(spec, ["spec"]);
    return Object.assign({}, rest, { spec: extractTransforms(subspec, config) });
}
function extractTransformsLayered(spec, config) {
    const { layer } = spec, rest = tslib_1.__rest(spec, ["layer"]);
    return Object.assign({}, rest, { layer: layer.map(subspec => {
            return extractTransforms(subspec, config);
        }) });
}
function extractTransformsVConcat(spec, config) {
    const { vconcat } = spec, rest = tslib_1.__rest(spec, ["vconcat"]);
    return Object.assign({}, rest, { vconcat: vconcat.map(subspec => {
            return extractTransforms(subspec, config);
        }) });
}
function extractTransformsHConcat(spec, config) {
    const { hconcat } = spec, rest = tslib_1.__rest(spec, ["hconcat"]);
    return Object.assign({}, rest, { hconcat: hconcat.map(subspec => {
            return extractTransforms(subspec, config);
        }) });
}
//# sourceMappingURL=transformextract.js.map