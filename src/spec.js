/* Package of defining Vega-lite Specification's json schema at its utility functions */
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var config_1 = require("./config");
var encoding_1 = require("./encoding");
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
    return spec['mark'] !== undefined;
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
    return normalizeNonFacetUnit(spec);
}
exports.normalize = normalize;
function normalizeNonFacet(spec) {
    if (isLayerSpec(spec)) {
        return normalizeLayer(spec);
    }
    return normalizeNonFacetUnit(spec);
}
function normalizeFacet(spec) {
    var subspec = spec.spec, rest = __rest(spec, ["spec"]);
    return __assign({}, rest, { spec: normalizeNonFacet(subspec) });
}
function normalizeLayer(spec) {
    var layer = spec.layer, rest = __rest(spec, ["layer"]);
    return __assign({}, rest, { layer: layer.map(normalizeNonFacet) });
}
function normalizeFacetedUnit(spec) {
    // New encoding in the inside spec should not contain row / column
    // as row/column should be moved to facet
    var _a = spec.encoding, row = _a.row, column = _a.column, encoding = __rest(_a, ["row", "column"]);
    // Mark and encoding should be moved into the inner spec
    var mark = spec.mark, _ = spec.encoding, outerSpec = __rest(spec, ["mark", "encoding"]);
    return __assign({}, outerSpec, { facet: __assign({}, (row ? { row: row } : {}), (column ? { column: column } : {})), spec: normalizeNonFacetUnit({
            mark: mark,
            encoding: encoding
        }) });
}
function isNormalUnitSpec(spec) {
    return !util_1.contains(mark_1.COMPOSITE_MARKS, spec.mark);
}
function normalizeNonFacetUnit(spec) {
    var config = spec.config;
    var overlayConfig = config && config.overlay;
    var overlayWithLine = overlayConfig && spec.mark === mark_1.AREA &&
        util_1.contains(['linepoint', 'line'], overlayConfig.area);
    var overlayWithPoint = overlayConfig && ((overlayConfig.line && spec.mark === mark_1.LINE) ||
        (overlayConfig.area === 'linepoint' && spec.mark === mark_1.AREA));
    if (isNormalUnitSpec(spec)) {
        // TODO: thoroughly test
        if (encoding_1.isRanged(spec.encoding)) {
            return normalizeRangedUnit(spec);
        }
        if (overlayWithPoint || overlayWithLine) {
            return normalizeOverlay(spec, overlayWithPoint, overlayWithLine);
        }
        return spec;
    }
    else {
        /* istanbul ignore else */
        if (spec.mark === mark_1.ERRORBAR) {
            return normalizeErrorBar(spec);
        }
        else {
            throw new Error("unsupported composite mark " + spec.mark);
        }
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
function normalizeErrorBar(spec) {
    var _m = spec.mark, encoding = spec.encoding, outerSpec = __rest(spec, ["mark", "encoding"]);
    var _s = encoding.size, encodingWithoutSize = __rest(encoding, ["size"]);
    var _x2 = encoding.x2, _y2 = encoding.y2, encodingWithoutX2Y2 = __rest(encoding, ["x2", "y2"]);
    return __assign({}, outerSpec, { layer: [
            {
                mark: 'rule',
                encoding: encodingWithoutSize
            }, {
                mark: 'tick',
                encoding: encodingWithoutX2Y2
            }, {
                mark: 'tick',
                encoding: __assign({}, encodingWithoutX2Y2, (encoding.x2 ? { x: encoding.x2 } : {}), (encoding.y2 ? { y: encoding.y2 } : {}))
            }
        ] });
}
// FIXME(#1804): rewrite this
function normalizeOverlay(spec, overlayWithPoint, overlayWithLine) {
    var outerProps = ['name', 'description', 'data', 'transform'];
    var baseSpec = util_1.omit(spec, outerProps.concat('config'));
    var baseConfig = util_1.duplicate(spec.config);
    delete baseConfig.overlay;
    // TODO: remove shape, size
    // Need to copy stack config to overlayed layer
    var stacked = stack_1.stack(spec.mark, spec.encoding, spec.config && spec.config.mark ? spec.config.mark.stacked : undefined);
    var layerSpec = __assign({}, util_1.pick(spec, outerProps), { layer: [baseSpec] }, (util_1.keys(baseConfig).length > 0 ? { config: baseConfig } : {}));
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
    if (mark_1.isCompositeMark(spec.mark)) {
        return false;
    }
    return stack_1.stack(spec.mark, spec.encoding, (spec.config && spec.config.mark) ? spec.config.mark.stacked : undefined) !== null;
}
exports.isStacked = isStacked;
//# sourceMappingURL=spec.js.map