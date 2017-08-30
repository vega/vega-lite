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
    return tslib_1.__assign({}, rest, { spec: normalize(subspec, config) });
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