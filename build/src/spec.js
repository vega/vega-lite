"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("./channel");
var compositeMark = require("./compositemark");
var encoding_1 = require("./encoding");
var vlEncoding = require("./encoding");
var log = require("./log");
var mark_1 = require("./mark");
var stack_1 = require("./stack");
var util_1 = require("./util");
/* Custom type guards */
function isFacetSpec(spec) {
    return spec['facet'] !== undefined;
}
exports.isFacetSpec = isFacetSpec;
function isUnitSpec(spec) {
    return !!spec['mark'];
}
exports.isUnitSpec = isUnitSpec;
function isLayerSpec(spec) {
    return spec['layer'] !== undefined;
}
exports.isLayerSpec = isLayerSpec;
function isRepeatSpec(spec) {
    return spec['repeat'] !== undefined;
}
exports.isRepeatSpec = isRepeatSpec;
function isConcatSpec(spec) {
    return isVConcatSpec(spec) || isHConcatSpec(spec);
}
exports.isConcatSpec = isConcatSpec;
function isVConcatSpec(spec) {
    return spec['vconcat'] !== undefined;
}
exports.isVConcatSpec = isVConcatSpec;
function isHConcatSpec(spec) {
    return spec['hconcat'] !== undefined;
}
exports.isHConcatSpec = isHConcatSpec;
/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
// TODO: consider moving this to another file.  Maybe vl.spec.normalize or vl.normalize
function normalize(spec, config) {
    if (isFacetSpec(spec)) {
        return normalizeFacet(spec, config);
    }
    if (isLayerSpec(spec)) {
        return normalizeLayer(spec, config);
    }
    if (isRepeatSpec(spec)) {
        return normalizeRepeat(spec, config);
    }
    if (isVConcatSpec(spec)) {
        return normalizeVConcat(spec, config);
    }
    if (isHConcatSpec(spec)) {
        return normalizeHConcat(spec, config);
    }
    if (isUnitSpec(spec)) {
        var hasRow = encoding_1.channelHasField(spec.encoding, channel_1.ROW);
        var hasColumn = encoding_1.channelHasField(spec.encoding, channel_1.COLUMN);
        if (hasRow || hasColumn) {
            return normalizeFacetedUnit(spec, config);
        }
        return normalizeNonFacetUnit(spec, config);
    }
    throw new Error(log.message.INVALID_SPEC);
}
exports.normalize = normalize;
function normalizeFacet(spec, config) {
    var subspec = spec.spec, rest = tslib_1.__rest(spec, ["spec"]);
    return tslib_1.__assign({}, rest, { 
        // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
        spec: normalize(subspec, config) });
}
function normalizeLayer(spec, config) {
    var layer = spec.layer, rest = tslib_1.__rest(spec, ["layer"]);
    return tslib_1.__assign({}, rest, { layer: layer.map(function (subspec) { return isLayerSpec(subspec) ? normalizeLayer(subspec, config) : normalizeNonFacetUnit(subspec, config); }) });
}
function normalizeRepeat(spec, config) {
    var subspec = spec.spec, rest = tslib_1.__rest(spec, ["spec"]);
    return tslib_1.__assign({}, rest, { spec: normalize(subspec, config) });
}
function normalizeVConcat(spec, config) {
    var vconcat = spec.vconcat, rest = tslib_1.__rest(spec, ["vconcat"]);
    return tslib_1.__assign({}, rest, { vconcat: vconcat.map(function (subspec) { return normalize(subspec, config); }) });
}
function normalizeHConcat(spec, config) {
    var hconcat = spec.hconcat, rest = tslib_1.__rest(spec, ["hconcat"]);
    return tslib_1.__assign({}, rest, { hconcat: hconcat.map(function (subspec) { return normalize(subspec, config); }) });
}
function normalizeFacetedUnit(spec, config) {
    // New encoding in the inside spec should not contain row / column
    // as row/column should be moved to facet
    var _a = spec.encoding, row = _a.row, column = _a.column, encoding = tslib_1.__rest(_a, ["row", "column"]);
    // Mark and encoding should be moved into the inner spec
    var mark = spec.mark, width = spec.width, height = spec.height, selection = spec.selection, _ = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "width", "height", "selection", "encoding"]);
    return tslib_1.__assign({}, outerSpec, { facet: tslib_1.__assign({}, (row ? { row: row } : {}), (column ? { column: column } : {})), spec: normalizeNonFacetUnit(tslib_1.__assign({ mark: mark }, (width ? { width: width } : {}), (height ? { height: height } : {}), { encoding: encoding }, (selection ? { selection: selection } : {})), config) });
}
function isNonFacetUnitSpecWithPrimitiveMark(spec) {
    return mark_1.isPrimitiveMark(spec.mark);
}
function normalizeNonFacetUnit(spec, config) {
    if (isNonFacetUnitSpecWithPrimitiveMark(spec)) {
        // TODO: thoroughly test
        if (encoding_1.isRanged(spec.encoding)) {
            return normalizeRangedUnit(spec);
        }
        var overlayConfig = config && config.overlay;
        var overlayWithLine = overlayConfig && spec.mark === mark_1.AREA &&
            util_1.contains(['linepoint', 'line'], overlayConfig.area);
        var overlayWithPoint = overlayConfig && ((overlayConfig.line && spec.mark === mark_1.LINE) ||
            (overlayConfig.area === 'linepoint' && spec.mark === mark_1.AREA));
        // TODO: consider moving this to become another case of compositeMark
        if (overlayWithPoint || overlayWithLine) {
            return normalizeOverlay(spec, overlayWithPoint, overlayWithLine, config);
        }
        return spec; // Nothing to normalize
    }
    else {
        return compositeMark.normalize(spec, config);
    }
}
function normalizeRangedUnit(spec) {
    var hasX = encoding_1.channelHasField(spec.encoding, channel_1.X);
    var hasY = encoding_1.channelHasField(spec.encoding, channel_1.Y);
    var hasX2 = encoding_1.channelHasField(spec.encoding, channel_1.X2);
    var hasY2 = encoding_1.channelHasField(spec.encoding, channel_1.Y2);
    if ((hasX2 && !hasX) || (hasY2 && !hasY)) {
        var normalizedSpec = util_1.duplicate(spec);
        if (hasX2 && !hasX) {
            normalizedSpec.encoding.x = normalizedSpec.encoding.x2;
            delete normalizedSpec.encoding.x2;
        }
        if (hasY2 && !hasY) {
            normalizedSpec.encoding.y = normalizedSpec.encoding.y2;
            delete normalizedSpec.encoding.y2;
        }
        return normalizedSpec;
    }
    return spec;
}
// FIXME(#1804): re-design this
function normalizeOverlay(spec, overlayWithPoint, overlayWithLine, config) {
    var mark = spec.mark, selection = spec.selection, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "selection", "encoding"]);
    var layer = [{ mark: mark, encoding: encoding }];
    // Need to copy stack config to overlayed layer
    var stackProps = stack_1.stack(mark, encoding, config ? config.stack : undefined);
    var overlayEncoding = encoding;
    if (stackProps) {
        var stackFieldChannel = stackProps.fieldChannel, offset = stackProps.offset;
        overlayEncoding = tslib_1.__assign({}, encoding, (_a = {}, _a[stackFieldChannel] = tslib_1.__assign({}, encoding[stackFieldChannel], (offset ? { stack: offset } : {})), _a));
    }
    if (overlayWithLine) {
        layer.push(tslib_1.__assign({ mark: {
                type: 'line',
                style: 'lineOverlay'
            } }, (selection ? { selection: selection } : {}), { encoding: overlayEncoding }));
    }
    if (overlayWithPoint) {
        layer.push(tslib_1.__assign({ mark: {
                type: 'point',
                filled: true,
                style: 'pointOverlay'
            } }, (selection ? { selection: selection } : {}), { encoding: overlayEncoding }));
    }
    return tslib_1.__assign({}, outerSpec, { layer: layer });
    var _a;
}
// TODO: add vl.spec.validate & move stuff from vl.validate to here
/* Accumulate non-duplicate fieldDefs in a dictionary */
function accumulate(dict, fieldDefs) {
    fieldDefs.forEach(function (fieldDef) {
        // Consider only pure fieldDef properties (ignoring scale, axis, legend)
        var pureFieldDef = ['field', 'type', 'value', 'timeUnit', 'bin', 'aggregate'].reduce(function (f, key) {
            if (fieldDef[key] !== undefined) {
                f[key] = fieldDef[key];
            }
            return f;
        }, {});
        var key = util_1.hash(pureFieldDef);
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
        accumulate(dict, vlEncoding.fieldDefs(spec.encoding));
    }
    return dict;
}
/* Returns all non-duplicate fieldDefs in a spec in a flat array */
function fieldDefs(spec) {
    return util_1.vals(fieldDefIndex(spec));
}
exports.fieldDefs = fieldDefs;
function isStacked(spec, config) {
    config = config || spec.config;
    if (mark_1.isPrimitiveMark(spec.mark)) {
        return stack_1.stack(spec.mark, spec.encoding, config ? config.stack : undefined) !== null;
    }
    return false;
}
exports.isStacked = isStacked;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFvRDtBQUNwRCwrQ0FBaUQ7QUFHakQsdUNBQWtGO0FBQ2xGLHVDQUF5QztBQUd6QywyQkFBNkI7QUFDN0IsK0JBQTJFO0FBSTNFLGlDQUE4QjtBQUk5QiwrQkFBNkQ7QUFnSzdELHdCQUF3QjtBQUd4QixxQkFBNEIsSUFBNEM7SUFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDckMsQ0FBQztBQUZELGtDQUVDO0FBRUQsb0JBQTJCLElBQTRDO0lBQ3JFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFGRCxnQ0FFQztBQUVELHFCQUE0QixJQUE0QztJQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsQ0FBQztBQUNyQyxDQUFDO0FBRkQsa0NBRUM7QUFFRCxzQkFBNkIsSUFBNEM7SUFDdkUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDdEMsQ0FBQztBQUZELG9DQUVDO0FBRUQsc0JBQTZCLElBQTRDO0lBQ3ZFLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFGRCxvQ0FFQztBQUVELHVCQUE4QixJQUE0QztJQUN4RSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFNBQVMsQ0FBQztBQUN2QyxDQUFDO0FBRkQsc0NBRUM7QUFFRCx1QkFBOEIsSUFBNEM7SUFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDdkMsQ0FBQztBQUZELHNDQUVDO0FBRUQ7O0dBRUc7QUFDSCx1RkFBdUY7QUFD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