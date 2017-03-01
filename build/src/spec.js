/* Package of defining Vega-lite Specification's json schema at its utility functions */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = require("./config");
var compositeMark = require("./compositemark");
var encoding_1 = require("./encoding");
var log = require("./log");
var mark_1 = require("./mark");
var stack_1 = require("./stack");
var channel_1 = require("./channel");
var vlEncoding = require("./encoding");
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
//# sourceMappingURL=spec.js.map