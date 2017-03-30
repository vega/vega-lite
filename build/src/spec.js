/* Package of defining Vega-lite Specification's json schema at its utility functions */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var compositeMark = require("./compositemark");
var config_1 = require("./config");
var encoding_1 = require("./encoding");
var channel_1 = require("./channel");
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
function isFacetedUnitSpec(spec) {
    if (isUnitSpec(spec)) {
        var hasRow = encoding_1.channelHasField(spec.encoding, channel_1.ROW);
        var hasColumn = encoding_1.channelHasField(spec.encoding, channel_1.COLUMN);
        return hasRow || hasColumn;
    }
    return false;
}
exports.isFacetedUnitSpec = isFacetedUnitSpec;
function isUnitSpec(spec) {
    return !!spec['mark'];
}
exports.isUnitSpec = isUnitSpec;
function isLayerSpec(spec) {
    return spec['layer'] !== undefined;
}
exports.isLayerSpec = isLayerSpec;
/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
// TODO: consider moving this to another file.  Maybe vl.spec.normalize or vl.normalize
function normalize(spec) {
    if (isFacetSpec(spec)) {
        return normalizeFacet(spec);
    }
    if (isLayerSpec(spec)) {
        return normalizeLayer(spec);
    }
    if (isFacetedUnitSpec(spec)) {
        return normalizeFacetedUnit(spec);
    }
    if (isUnitSpec(spec)) {
        return normalizeNonFacetUnit(spec);
    }
    throw new Error(log.message.INVALID_SPEC);
}
exports.normalize = normalize;
function normalizeNonFacet(spec) {
    if (isLayerSpec(spec)) {
        return normalizeLayer(spec);
    }
    return normalizeNonFacetUnit(spec);
}
function normalizeFacet(spec) {
    var subspec = spec.spec, rest = tslib_1.__rest(spec, ["spec"]);
    return tslib_1.__assign({}, rest, { spec: normalizeNonFacet(subspec) });
}
function normalizeLayer(spec) {
    var layer = spec.layer, rest = tslib_1.__rest(spec, ["layer"]);
    return tslib_1.__assign({}, rest, { layer: layer.map(normalizeNonFacet) });
}
function normalizeFacetedUnit(spec) {
    // New encoding in the inside spec should not contain row / column
    // as row/column should be moved to facet
    var _a = spec.encoding, row = _a.row, column = _a.column, encoding = tslib_1.__rest(_a, ["row", "column"]);
    // Mark and encoding should be moved into the inner spec
    var mark = spec.mark, _ = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    return tslib_1.__assign({}, outerSpec, { facet: tslib_1.__assign({}, (row ? { row: row } : {}), (column ? { column: column } : {})), spec: normalizeNonFacetUnit({
            mark: mark,
            encoding: encoding
        }) });
}
function isNonFacetUnitSpecWithPrimitiveMark(spec) {
    return mark_1.isPrimitiveMark(spec.mark);
}
function normalizeNonFacetUnit(spec) {
    var config = spec.config;
    var overlayConfig = config && config.overlay;
    var overlayWithLine = overlayConfig && spec.mark === mark_1.AREA &&
        util_1.contains(['linepoint', 'line'], overlayConfig.area);
    var overlayWithPoint = overlayConfig && ((overlayConfig.line && spec.mark === mark_1.LINE) ||
        (overlayConfig.area === 'linepoint' && spec.mark === mark_1.AREA));
    if (isNonFacetUnitSpecWithPrimitiveMark(spec)) {
        // TODO: thoroughly test
        if (encoding_1.isRanged(spec.encoding)) {
            return normalizeRangedUnit(spec);
        }
        // TODO: consider moving this to become another case of compositeMark
        if (overlayWithPoint || overlayWithLine) {
            return normalizeOverlay(spec, overlayWithPoint, overlayWithLine);
        }
        return spec; // Nothing to normalize
    }
    else {
        return compositeMark.normalize(spec);
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
// FIXME(#1804): rewrite this
function normalizeOverlay(spec, overlayWithPoint, overlayWithLine) {
    var outerProps = ['name', 'description', 'data', 'transform'];
    var baseSpec = util_1.omit(spec, outerProps.concat('config'));
    var baseConfig = util_1.duplicate(spec.config);
    delete baseConfig.overlay;
    // TODO: remove shape, size
    // Need to copy stack config to overlayed layer
    var stacked = stack_1.stack(spec.mark, spec.encoding, spec.config ? spec.config.stack : undefined);
    var layerSpec = tslib_1.__assign({}, util_1.pick(spec, outerProps), { layer: [baseSpec] }, (util_1.keys(baseConfig).length > 0 ? { config: baseConfig } : {}));
    if (overlayWithLine) {
        // TODO: add name with suffix
        var lineSpec = util_1.duplicate(baseSpec);
        lineSpec.mark = mark_1.LINE;
        // TODO: remove shape, size
        var markConfig = util_1.extend({}, config_1.defaultOverlayConfig.lineStyle, spec.config.overlay.lineStyle, stacked ? { stacked: stacked.offset } : null);
        if (util_1.keys(markConfig).length > 0) {
            lineSpec.config = { mark: markConfig };
        }
        layerSpec.layer.push(lineSpec);
    }
    if (overlayWithPoint) {
        // TODO: add name with suffix
        var pointSpec = util_1.duplicate(baseSpec);
        pointSpec.mark = mark_1.POINT;
        var markConfig = util_1.extend({}, config_1.defaultOverlayConfig.pointStyle, spec.config.overlay.pointStyle, stacked ? { stacked: stacked.offset } : null);
        if (util_1.keys(markConfig).length > 0) {
            pointSpec.config = { mark: markConfig };
        }
        layerSpec.layer.push(pointSpec);
    }
    return layerSpec;
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
    // TODO: Support repeat and concat
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
;
function isStacked(spec) {
    if (mark_1.isPrimitiveMark(spec.mark)) {
        return stack_1.stack(spec.mark, spec.encoding, spec.config ? spec.config.stack : undefined) !== null;
    }
    return false;
}
exports.isStacked = isStacked;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHdGQUF3Rjs7OztBQUV4RiwrQ0FBaUQ7QUFDakQsbUNBQXNEO0FBRXRELHVDQUFrRjtBQUlsRixxQ0FBb0Q7QUFDcEQsdUNBQXlDO0FBQ3pDLDJCQUE2QjtBQUM3QiwrQkFBeUU7QUFFekUsaUNBQThCO0FBRTlCLCtCQUFpRjtBQThHakYsd0JBQXdCO0FBR3hCLHFCQUE0QixJQUE0QztJQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsQ0FBQztBQUNyQyxDQUFDO0FBRkQsa0NBRUM7QUFFRCwyQkFBa0MsSUFBa0I7SUFDbEQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFNLE1BQU0sR0FBRywwQkFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBRyxDQUFDLENBQUM7UUFDbkQsSUFBTSxTQUFTLEdBQUcsMEJBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGdCQUFNLENBQUMsQ0FBQztRQUV6RCxNQUFNLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFURCw4Q0FTQztBQUVELG9CQUEyQixJQUF5QjtJQUNsRCxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBRkQsZ0NBRUM7QUFFRCxxQkFBNEIsSUFBeUI7SUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDckMsQ0FBQztBQUZELGtDQUVDO0FBRUQ7O0dBRUc7QUFDSCx1RkFBdUY7QUFDdkYsbUJBQTBCLElBQWtCO0lBQzFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJ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