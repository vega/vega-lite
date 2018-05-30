"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
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
function mergeEncoding(opt) {
    var parentEncoding = opt.parentEncoding, encoding = opt.encoding;
    if (parentEncoding && encoding) {
        var overriden = util_1.keys(parentEncoding).reduce(function (o, key) {
            if (encoding[key]) {
                o.push(key);
            }
            return o;
        }, []);
        if (overriden.length > 0) {
            log.warn(log.message.encodingOverridden(overriden));
        }
    }
    var merged = tslib_1.__assign({}, (parentEncoding || {}), (encoding || {}));
    return util_1.keys(merged).length > 0 ? merged : undefined;
}
function mergeProjection(opt) {
    var parentProjection = opt.parentProjection, projection = opt.projection;
    if (parentProjection && projection) {
        log.warn(log.message.projectionOverridden({ parentProjection: parentProjection, projection: projection }));
    }
    return projection || parentProjection;
}
function normalizeLayer(spec, config, parentEncoding, parentProjection) {
    var layer = spec.layer, encoding = spec.encoding, projection = spec.projection, rest = tslib_1.__rest(spec, ["layer", "encoding", "projection"]);
    var mergedEncoding = mergeEncoding({ parentEncoding: parentEncoding, encoding: encoding });
    var mergedProjection = mergeProjection({ parentProjection: parentProjection, projection: projection });
    return tslib_1.__assign({}, rest, { layer: layer.map(function (subspec) {
            if (isLayerSpec(subspec)) {
                return normalizeLayer(subspec, config, mergedEncoding, mergedProjection);
            }
            return normalizeNonFacetUnit(subspec, config, mergedEncoding, mergedProjection);
        }) });
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
    var mark = spec.mark, width = spec.width, projection = spec.projection, height = spec.height, selection = spec.selection, _ = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "width", "projection", "height", "selection", "encoding"]);
    return tslib_1.__assign({}, outerSpec, { facet: tslib_1.__assign({}, (row ? { row: row } : {}), (column ? { column: column } : {})), spec: normalizeNonFacetUnit(tslib_1.__assign({}, (projection ? { projection: projection } : {}), { mark: mark }, (width ? { width: width } : {}), (height ? { height: height } : {}), { encoding: encoding }, (selection ? { selection: selection } : {})), config) });
}
function isNonFacetUnitSpecWithPrimitiveMark(spec) {
    return mark_1.isPrimitiveMark(spec.mark);
}
function getPointOverlay(markDef, markConfig, encoding) {
    if (markDef.point === 'transparent') {
        return { opacity: 0 };
    }
    else if (markDef.point) { // truthy : true or object
        return vega_util_1.isObject(markDef.point) ? markDef.point : {};
    }
    else if (markDef.point !== undefined) { // false or null
        return null;
    }
    else { // undefined (not disabled)
        if (markConfig.point || encoding.shape) {
            // enable point overlay if config[mark].point is truthy or if encoding.shape is provided
            return vega_util_1.isObject(markConfig.point) ? markConfig.point : {};
        }
        // markDef.point is defined as falsy
        return null;
    }
}
function getLineOverlay(markDef, markConfig) {
    if (markDef.line) { // true or object
        return markDef.line === true ? {} : markDef.line;
    }
    else if (markDef.line !== undefined) { // false or null
        return null;
    }
    else { // undefined (not disabled)
        if (markConfig.line) {
            // enable line overlay if config[mark].line is truthy
            return markConfig.line === true ? {} : markConfig.line;
        }
        // markDef.point is defined as falsy
        return null;
    }
}
function normalizeNonFacetUnit(spec, config, parentEncoding, parentProjection) {
    var encoding = spec.encoding, projection = spec.projection;
    var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    // merge parent encoding / projection first
    if (parentEncoding || parentProjection) {
        var mergedProjection = mergeProjection({ parentProjection: parentProjection, projection: projection });
        var mergedEncoding = mergeEncoding({ parentEncoding: parentEncoding, encoding: encoding });
        return normalizeNonFacetUnit(tslib_1.__assign({}, spec, (mergedProjection ? { projection: mergedProjection } : {}), (mergedEncoding ? { encoding: mergedEncoding } : {})), config);
    }
    if (isNonFacetUnitSpecWithPrimitiveMark(spec)) {
        // TODO: thoroughly test
        if (encoding_1.isRanged(encoding)) {
            return normalizeRangedUnit(spec);
        }
        if (mark === 'line' && (encoding.x2 || encoding.y2)) {
            log.warn(log.message.lineWithRange(!!encoding.x2, !!encoding.y2));
            return normalizeNonFacetUnit(tslib_1.__assign({ mark: 'rule' }, spec), config, parentEncoding, parentProjection);
        }
        if (mark_1.isPathMark(mark)) {
            return normalizePathOverlay(spec, config);
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
function dropLineAndPoint(markDef) {
    var _point = markDef.point, _line = markDef.line, mark = tslib_1.__rest(markDef, ["point", "line"]);
    return util_1.keys(mark).length > 1 ? mark : mark.type;
}
function normalizePathOverlay(spec, config) {
    if (config === void 0) { config = {}; }
    // _ is used to denote a dropped property of the unit spec
    // which should not be carried over to the layer spec
    var selection = spec.selection, projection = spec.projection, encoding = spec.encoding, mark = spec.mark, outerSpec = tslib_1.__rest(spec, ["selection", "projection", "encoding", "mark"]);
    var markDef = mark_1.isMarkDef(mark) ? mark : { type: mark };
    var pointOverlay = getPointOverlay(markDef, config[markDef.type], encoding);
    var lineOverlay = markDef.type === 'area' && getLineOverlay(markDef, config[markDef.type]);
    if (!pointOverlay && !lineOverlay) {
        return tslib_1.__assign({}, spec, { 
            // Do not include point / line overlay in the normalize spec
            mark: dropLineAndPoint(markDef) });
    }
    var layer = [tslib_1.__assign({}, (selection ? { selection: selection } : {}), { 
            // Do not include point / line overlay in the normalize spec
            mark: dropLineAndPoint(tslib_1.__assign({}, markDef, (markDef.type === 'area' ? { opacity: 0.7 } : {}))), 
            // drop shape from encoding as this might be used to trigger point overlay
            encoding: util_1.omit(encoding, ['shape']) })];
    // FIXME: disable tooltip for the line layer if tooltip is not group-by field.
    // FIXME: determine rules for applying selections.
    // Need to copy stack config to overlayed layer
    var stackProps = stack_1.stack(markDef, encoding, config ? config.stack : undefined);
    var overlayEncoding = encoding;
    if (stackProps) {
        var stackFieldChannel = stackProps.fieldChannel, offset = stackProps.offset;
        overlayEncoding = tslib_1.__assign({}, encoding, (_a = {}, _a[stackFieldChannel] = tslib_1.__assign({}, encoding[stackFieldChannel], (offset ? { stack: offset } : {})), _a));
    }
    if (lineOverlay) {
        layer.push(tslib_1.__assign({}, (projection ? { projection: projection } : {}), { mark: tslib_1.__assign({ type: 'line' }, lineOverlay), encoding: overlayEncoding }));
    }
    if (pointOverlay) {
        layer.push(tslib_1.__assign({}, (projection ? { projection: projection } : {}), { mark: tslib_1.__assign({ type: 'point', opacity: 1, filled: true }, pointOverlay), encoding: overlayEncoding }));
    }
    return tslib_1.__assign({}, outerSpec, { layer: layer });
    var _a;
}
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
    else { // Unit Spec
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFtQztBQUNuQyxxQ0FBb0Q7QUFDcEQsK0NBQWlEO0FBR2pELHVDQUFrRjtBQUNsRix1Q0FBeUM7QUFHekMsMkJBQTZCO0FBQzdCLCtCQUEwSDtBQUsxSCxpQ0FBOEI7QUFJOUIsK0JBQStEO0FBbVAvRCx3QkFBd0I7QUFHeEIscUJBQTRCLElBQWM7SUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxDQUFDO0FBQ3JDLENBQUM7QUFGRCxrQ0FFQztBQUVELG9CQUEyQixJQUFjO0lBQ3ZDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBRkQsZ0NBRUM7QUFFRCxxQkFBNEIsSUFBYztJQUN4QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDckMsQ0FBQztBQUZELGtDQUVDO0FBRUQsc0JBQTZCLElBQWM7SUFDekMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxDQUFDO0FBQ3RDLENBQUM7QUFGRCxvQ0FFQztBQUVELHNCQUE2QixJQUFjO0lBR3pDLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBSkQsb0NBSUM7QUFFRCx1QkFBOEIsSUFBYztJQUMxQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDdkMsQ0FBQztBQUZELHNDQUVDO0FBRUQsdUJBQThCLElBQWM7SUFDMUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssU0FBUyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCxzQ0FFQztBQUVEOztHQUVHO0FBQ0gsdUZBQXVGO0FBQ3ZGLG1CQUEwQixJQUFpRyxFQUFFLE1BQWM7SUFD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JztcbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFgyLCBZLCBZMn0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCAqIGFzIGNvbXBvc2l0ZU1hcmsgZnJvbSAnLi9jb21wb3NpdGVtYXJrJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge0RhdGF9IGZyb20gJy4vZGF0YSc7XG5pbXBvcnQge2NoYW5uZWxIYXNGaWVsZCwgRW5jb2RpbmcsIEVuY29kaW5nV2l0aEZhY2V0LCBpc1JhbmdlZH0gZnJvbSAnLi9lbmNvZGluZyc7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4vZW5jb2RpbmcnO1xuaW1wb3J0IHtGYWNldE1hcHBpbmd9IGZyb20gJy4vZmFjZXQnO1xuaW1wb3J0IHtGaWVsZCwgRmllbGREZWYsIFJlcGVhdFJlZn0gZnJvbSAnLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi9sb2cnO1xuaW1wb3J0IHtBbnlNYXJrLCBBcmVhQ29uZmlnLCBpc01hcmtEZWYsIGlzUGF0aE1hcmssIGlzUHJpbWl0aXZlTWFyaywgTGluZUNvbmZpZywgTWFyaywgTWFya0NvbmZpZywgTWFya0RlZn0gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7UHJvamVjdGlvbn0gZnJvbSAnLi9wcm9qZWN0aW9uJztcbmltcG9ydCB7UmVwZWF0fSBmcm9tICcuL3JlcGVhdCc7XG5pbXBvcnQge1Jlc29sdmV9IGZyb20gJy4vcmVzb2x2ZSc7XG5pbXBvcnQge1NlbGVjdGlvbkRlZn0gZnJvbSAnLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtzdGFja30gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge1RpdGxlUGFyYW1zfSBmcm9tICcuL3RpdGxlJztcbmltcG9ydCB7VG9wTGV2ZWxQcm9wZXJ0aWVzfSBmcm9tICcuL3RvcGxldmVscHJvcHMnO1xuaW1wb3J0IHtUcmFuc2Zvcm19IGZyb20gJy4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwgZHVwbGljYXRlLCBoYXNoLCBrZXlzLCBvbWl0LCB2YWxzfSBmcm9tICcuL3V0aWwnO1xuXG5cbmV4cG9ydCB0eXBlIFRvcExldmVsPFMgZXh0ZW5kcyBCYXNlU3BlYz4gPSBTICYgVG9wTGV2ZWxQcm9wZXJ0aWVzICYge1xuICAvKipcbiAgICogVVJMIHRvIFtKU09OIHNjaGVtYV0oaHR0cDovL2pzb24tc2NoZW1hLm9yZy8pIGZvciBhIFZlZ2EtTGl0ZSBzcGVjaWZpY2F0aW9uLiBVbmxlc3MgeW91IGhhdmUgYSByZWFzb24gdG8gY2hhbmdlIHRoaXMsIHVzZSBgaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby9zY2hlbWEvdmVnYS1saXRlL3YyLmpzb25gLiBTZXR0aW5nIHRoZSBgJHNjaGVtYWAgcHJvcGVydHkgYWxsb3dzIGF1dG9tYXRpYyB2YWxpZGF0aW9uIGFuZCBhdXRvY29tcGxldGUgaW4gZWRpdG9ycyB0aGF0IHN1cHBvcnQgSlNPTiBzY2hlbWEuXG4gICAqIEBmb3JtYXQgdXJpXG4gICAqL1xuICAkc2NoZW1hPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBWZWdhLUxpdGUgY29uZmlndXJhdGlvbiBvYmplY3QuICBUaGlzIHByb3BlcnR5IGNhbiBvbmx5IGJlIGRlZmluZWQgYXQgdGhlIHRvcC1sZXZlbCBvZiBhIHNwZWNpZmljYXRpb24uXG4gICAqL1xuICBjb25maWc/OiBDb25maWc7XG59O1xuXG5leHBvcnQgdHlwZSBCYXNlU3BlYyA9IFBhcnRpYWw8RGF0YU1peGlucz4gJiB7XG4gIC8qKlxuICAgKiBUaXRsZSBmb3IgdGhlIHBsb3QuXG4gICAqL1xuICB0aXRsZT86IHN0cmluZyB8IFRpdGxlUGFyYW1zO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSB2aXN1YWxpemF0aW9uIGZvciBsYXRlciByZWZlcmVuY2UuXG4gICAqL1xuICBuYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZXNjcmlwdGlvbiBvZiB0aGlzIG1hcmsgZm9yIGNvbW1lbnRpbmcgcHVycG9zZS5cbiAgICovXG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVzY3JpYmluZyB0aGUgZGF0YSBzb3VyY2VcbiAgICovXG4gIGRhdGE/OiBEYXRhO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBkYXRhIHRyYW5zZm9ybWF0aW9ucyBzdWNoIGFzIGZpbHRlciBhbmQgbmV3IGZpZWxkIGNhbGN1bGF0aW9uLlxuICAgKi9cbiAgdHJhbnNmb3JtPzogVHJhbnNmb3JtW107XG59O1xuXG5leHBvcnQgdHlwZSBEYXRhTWl4aW5zID0ge1xuICAvKipcbiAgICogQW4gb2JqZWN0IGRlc2NyaWJpbmcgdGhlIGRhdGEgc291cmNlXG4gICAqL1xuICBkYXRhOiBEYXRhO1xufTtcblxuXG4vLyBUT0RPKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjUwMyk6IE1ha2UgdGhpcyBnZW5lcmljIHNvIHdlIGNhbiBzdXBwb3J0IHNvbWUgZm9ybSBvZiB0b3AtZG93biBzaXppbmcuXG5leHBvcnQgaW50ZXJmYWNlIExheW91dFNpemVNaXhpbnMge1xuICAvKipcbiAgICogVGhlIHdpZHRoIG9mIGEgdmlzdWFsaXphdGlvbi5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fIFRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGJ5IHRoZSBmb2xsb3dpbmcgcnVsZXM6XG4gICAqXG4gICAqIC0gSWYgYSB2aWV3J3MgW2BhdXRvc2l6ZWBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2l6ZS5odG1sI2F1dG9zaXplKSB0eXBlIGlzIGBcImZpdFwiYCBvciBpdHMgeC1jaGFubmVsIGhhcyBhIFtjb250aW51b3VzIHNjYWxlXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NjYWxlLmh0bWwjY29udGludW91cyksIHRoZSB3aWR0aCB3aWxsIGJlIHRoZSB2YWx1ZSBvZiBbYGNvbmZpZy52aWV3LndpZHRoYF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zcGVjLmh0bWwjY29uZmlnKS5cbiAgICogLSBGb3IgeC1heGlzIHdpdGggYSBiYW5kIG9yIHBvaW50IHNjYWxlOiBpZiBbYHJhbmdlU3RlcGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2NhbGUuaHRtbCNiYW5kKSBpcyBhIG51bWVyaWMgdmFsdWUgb3IgdW5zcGVjaWZpZWQsIHRoZSB3aWR0aCBpcyBbZGV0ZXJtaW5lZCBieSB0aGUgcmFuZ2Ugc3RlcCwgcGFkZGluZ3MsIGFuZCB0aGUgY2FyZGluYWxpdHkgb2YgdGhlIGZpZWxkIG1hcHBlZCB0byB4LWNoYW5uZWxdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2NhbGUuaHRtbCNiYW5kKS4gICBPdGhlcndpc2UsIGlmIHRoZSBgcmFuZ2VTdGVwYCBpcyBgbnVsbGAsIHRoZSB3aWR0aCB3aWxsIGJlIHRoZSB2YWx1ZSBvZiBbYGNvbmZpZy52aWV3LndpZHRoYF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zcGVjLmh0bWwjY29uZmlnKS5cbiAgICogLSBJZiBubyBmaWVsZCBpcyBtYXBwZWQgdG8gYHhgIGNoYW5uZWwsIHRoZSBgd2lkdGhgIHdpbGwgYmUgdGhlIHZhbHVlIG9mIFtgY29uZmlnLnNjYWxlLnRleHRYUmFuZ2VTdGVwYF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zaXplLmh0bWwjZGVmYXVsdC13aWR0aC1hbmQtaGVpZ2h0KSBmb3IgYHRleHRgIG1hcmsgYW5kIHRoZSB2YWx1ZSBvZiBgcmFuZ2VTdGVwYCBmb3Igb3RoZXIgbWFya3MuXG4gICAqXG4gICAqIF9fTm90ZTpfXyBGb3IgcGxvdHMgd2l0aCBbYHJvd2AgYW5kIGBjb2x1bW5gIGNoYW5uZWxzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2VuY29kaW5nLmh0bWwjZmFjZXQpLCB0aGlzIHJlcHJlc2VudHMgdGhlIHdpZHRoIG9mIGEgc2luZ2xlIHZpZXcuXG4gICAqXG4gICAqIF9fU2VlIGFsc286X18gVGhlIGRvY3VtZW50YXRpb24gZm9yIFt3aWR0aCBhbmQgaGVpZ2h0XShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NpemUuaHRtbCkgY29udGFpbnMgbW9yZSBleGFtcGxlcy5cbiAgICovXG4gIHdpZHRoPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgaGVpZ2h0IG9mIGEgdmlzdWFsaXphdGlvbi5cbiAgICpcbiAgICogX19EZWZhdWx0IHZhbHVlOl9fXG4gICAqIC0gSWYgYSB2aWV3J3MgW2BhdXRvc2l6ZWBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2l6ZS5odG1sI2F1dG9zaXplKSB0eXBlIGlzIGBcImZpdFwiYCBvciBpdHMgeS1jaGFubmVsIGhhcyBhIFtjb250aW51b3VzIHNjYWxlXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NjYWxlLmh0bWwjY29udGludW91cyksIHRoZSBoZWlnaHQgd2lsbCBiZSB0aGUgdmFsdWUgb2YgW2Bjb25maWcudmlldy5oZWlnaHRgXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NwZWMuaHRtbCNjb25maWcpLlxuICAgKiAtIEZvciB5LWF4aXMgd2l0aCBhIGJhbmQgb3IgcG9pbnQgc2NhbGU6IGlmIFtgcmFuZ2VTdGVwYF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zY2FsZS5odG1sI2JhbmQpIGlzIGEgbnVtZXJpYyB2YWx1ZSBvciB1bnNwZWNpZmllZCwgdGhlIGhlaWdodCBpcyBbZGV0ZXJtaW5lZCBieSB0aGUgcmFuZ2Ugc3RlcCwgcGFkZGluZ3MsIGFuZCB0aGUgY2FyZGluYWxpdHkgb2YgdGhlIGZpZWxkIG1hcHBlZCB0byB5LWNoYW5uZWxdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2NhbGUuaHRtbCNiYW5kKS4gT3RoZXJ3aXNlLCBpZiB0aGUgYHJhbmdlU3RlcGAgaXMgYG51bGxgLCB0aGUgaGVpZ2h0IHdpbGwgYmUgdGhlIHZhbHVlIG9mIFtgY29uZmlnLnZpZXcuaGVpZ2h0YF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zcGVjLmh0bWwjY29uZmlnKS5cbiAgICogLSBJZiBubyBmaWVsZCBpcyBtYXBwZWQgdG8gYHlgIGNoYW5uZWwsIHRoZSBgaGVpZ2h0YCB3aWxsIGJlIHRoZSB2YWx1ZSBvZiBgcmFuZ2VTdGVwYC5cbiAgICpcbiAgICogX19Ob3RlX186IEZvciBwbG90cyB3aXRoIFtgcm93YCBhbmQgYGNvbHVtbmAgY2hhbm5lbHNdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3MvZW5jb2RpbmcuaHRtbCNmYWNldCksIHRoaXMgcmVwcmVzZW50cyB0aGUgaGVpZ2h0IG9mIGEgc2luZ2xlIHZpZXcuXG4gICAqXG4gICAqIF9fU2VlIGFsc286X18gVGhlIGRvY3VtZW50YXRpb24gZm9yIFt3aWR0aCBhbmQgaGVpZ2h0XShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NpemUuaHRtbCkgY29udGFpbnMgbW9yZSBleGFtcGxlcy5cbiAgICovXG4gIGhlaWdodD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljVW5pdFNwZWM8RSBleHRlbmRzIEVuY29kaW5nPGFueT4sIE0+IGV4dGVuZHMgQmFzZVNwZWMsIExheW91dFNpemVNaXhpbnMge1xuXG4gIC8qKlxuICAgKiBBIHN0cmluZyBkZXNjcmliaW5nIHRoZSBtYXJrIHR5cGUgKG9uZSBvZiBgXCJiYXJcImAsIGBcImNpcmNsZVwiYCwgYFwic3F1YXJlXCJgLCBgXCJ0aWNrXCJgLCBgXCJsaW5lXCJgLFxuICAgKiBgXCJhcmVhXCJgLCBgXCJwb2ludFwiYCwgYFwicnVsZVwiYCwgYFwiZ2Vvc2hhcGVcImAsIGFuZCBgXCJ0ZXh0XCJgKSBvciBhIFttYXJrIGRlZmluaXRpb24gb2JqZWN0XShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL21hcmsuaHRtbCNtYXJrLWRlZikuXG4gICAqL1xuICBtYXJrOiBNO1xuXG4gIC8qKlxuICAgKiBBIGtleS12YWx1ZSBtYXBwaW5nIGJldHdlZW4gZW5jb2RpbmcgY2hhbm5lbHMgYW5kIGRlZmluaXRpb24gb2YgZmllbGRzLlxuICAgKi9cbiAgZW5jb2Rpbmc/OiBFO1xuXG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIGdlb2dyYXBoaWMgcHJvamVjdGlvbiwgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIGBzaGFwZWAgcGF0aCBmb3IgYFwiZ2Vvc2hhcGVcImAgbWFya3NcbiAgICogYW5kIHRvIGBsYXRpdHVkZWAgYW5kIGBcImxvbmdpdHVkZVwiYCBjaGFubmVscyBmb3Igb3RoZXIgbWFya3MuXG4gICAqL1xuICBwcm9qZWN0aW9uPzogUHJvamVjdGlvbjtcblxuICAvKipcbiAgICogQSBrZXktdmFsdWUgbWFwcGluZyBiZXR3ZWVuIHNlbGVjdGlvbiBuYW1lcyBhbmQgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBzZWxlY3Rpb24/OiB7W25hbWU6IHN0cmluZ106IFNlbGVjdGlvbkRlZn07XG59XG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRVbml0U3BlYyA9IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxzdHJpbmcgfCBSZXBlYXRSZWY+LCBNYXJrIHwgTWFya0RlZj47XG5cbi8qKlxuICogVW5pdCBzcGVjIHRoYXQgY2FuIGhhdmUgYSBjb21wb3NpdGUgbWFyay5cbiAqL1xuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVW5pdFNwZWMgPSBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nIHwgUmVwZWF0UmVmPiwgQW55TWFyaz47XG5cbi8qKlxuICogVW5pdCBzcGVjIHRoYXQgY2FuIGhhdmUgYSBjb21wb3NpdGUgbWFyayBhbmQgcm93IG9yIGNvbHVtbiBjaGFubmVscy5cbiAqL1xuZXhwb3J0IHR5cGUgRmFjZXRlZENvbXBvc2l0ZVVuaXRTcGVjID0gR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nV2l0aEZhY2V0PHN0cmluZyB8IFJlcGVhdFJlZj4sIEFueU1hcms+O1xuXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyaWNMYXllclNwZWM8VSBleHRlbmRzIEdlbmVyaWNVbml0U3BlYzxhbnksIGFueT4+IGV4dGVuZHMgQmFzZVNwZWMsIExheW91dFNpemVNaXhpbnMge1xuICAvKipcbiAgICogTGF5ZXIgb3Igc2luZ2xlIHZpZXcgc3BlY2lmaWNhdGlvbnMgdG8gYmUgbGF5ZXJlZC5cbiAgICpcbiAgICogX19Ob3RlX186IFNwZWNpZmljYXRpb25zIGluc2lkZSBgbGF5ZXJgIGNhbm5vdCB1c2UgYHJvd2AgYW5kIGBjb2x1bW5gIGNoYW5uZWxzIGFzIGxheWVyaW5nIGZhY2V0IHNwZWNpZmljYXRpb25zIGlzIG5vdCBhbGxvd2VkLlxuICAgKi9cbiAgbGF5ZXI6IChHZW5lcmljTGF5ZXJTcGVjPFU+IHwgVSlbXTtcblxuICAvKipcbiAgICogU2NhbGUsIGF4aXMsIGFuZCBsZWdlbmQgcmVzb2x1dGlvbnMgZm9yIGxheWVycy5cbiAgICovXG4gIHJlc29sdmU/OiBSZXNvbHZlO1xufVxuXG4vKipcbiAqIExheWVyIFNwZWMgd2l0aCBlbmNvZGluZyBhbmQgcHJvamVjdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4dGVuZGVkTGF5ZXJTcGVjIGV4dGVuZHMgR2VuZXJpY0xheWVyU3BlYzxDb21wb3NpdGVVbml0U3BlYz4ge1xuICAvKipcbiAgICogQSBzaGFyZWQga2V5LXZhbHVlIG1hcHBpbmcgYmV0d2VlbiBlbmNvZGluZyBjaGFubmVscyBhbmQgZGVmaW5pdGlvbiBvZiBmaWVsZHMgaW4gdGhlIHVuZGVybHlpbmcgbGF5ZXJzLlxuICAgKi9cbiAgZW5jb2Rpbmc/OiBFbmNvZGluZzxzdHJpbmcgfCBSZXBlYXRSZWY+O1xuXG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIHRoZSBnZW9ncmFwaGljIHByb2plY3Rpb24gc2hhcmVkIGJ5IHVuZGVybHlpbmcgbGF5ZXJzLlxuICAgKi9cbiAgcHJvamVjdGlvbj86IFByb2plY3Rpb247XG59XG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRMYXllclNwZWMgPSBHZW5lcmljTGF5ZXJTcGVjPE5vcm1hbGl6ZWRVbml0U3BlYz47XG5cblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljRmFjZXRTcGVjPFxuICBVIGV4dGVuZHMgR2VuZXJpY1VuaXRTcGVjPGFueSwgYW55PixcbiAgTCBleHRlbmRzIEdlbmVyaWNMYXllclNwZWM8YW55PlxuICA+IGV4dGVuZHMgQmFzZVNwZWMge1xuICAvKipcbiAgICogQW4gb2JqZWN0IHRoYXQgZGVzY3JpYmVzIG1hcHBpbmdzIGJldHdlZW4gYHJvd2AgYW5kIGBjb2x1bW5gIGNoYW5uZWxzIGFuZCB0aGVpciBmaWVsZCBkZWZpbml0aW9ucy5cbiAgICovXG4gIGZhY2V0OiBGYWNldE1hcHBpbmc8c3RyaW5nIHwgUmVwZWF0UmVmPjtcblxuICAvKipcbiAgICogQSBzcGVjaWZpY2F0aW9uIG9mIHRoZSB2aWV3IHRoYXQgZ2V0cyBmYWNldGVkLlxuICAgKi9cbiAgc3BlYzogTCB8IFU7XG4gIC8vIFRPRE86IHJlcGxhY2UgdGhpcyB3aXRoIEdlbmVyaWNTcGVjPFU+IG9uY2Ugd2Ugc3VwcG9ydCBhbGwgY2FzZXM7XG5cbiAgLyoqXG4gICAqIFNjYWxlLCBheGlzLCBhbmQgbGVnZW5kIHJlc29sdXRpb25zIGZvciBmYWNldHMuXG4gICAqL1xuICByZXNvbHZlPzogUmVzb2x2ZTtcbn1cblxuZXhwb3J0IHR5cGUgTm9ybWFsaXplZEZhY2V0U3BlYyA9IEdlbmVyaWNGYWNldFNwZWM8Tm9ybWFsaXplZFVuaXRTcGVjLCBOb3JtYWxpemVkTGF5ZXJTcGVjPjtcblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljUmVwZWF0U3BlYzxcbiAgVSBleHRlbmRzIEdlbmVyaWNVbml0U3BlYzxhbnksIGFueT4sXG4gIEwgZXh0ZW5kcyBHZW5lcmljTGF5ZXJTcGVjPGFueT5cbj4gZXh0ZW5kcyBCYXNlU3BlYyB7XG4gIC8qKlxuICAgKiBBbiBvYmplY3QgdGhhdCBkZXNjcmliZXMgd2hhdCBmaWVsZHMgc2hvdWxkIGJlIHJlcGVhdGVkIGludG8gdmlld3MgdGhhdCBhcmUgbGFpZCBvdXQgYXMgYSBgcm93YCBvciBgY29sdW1uYC5cbiAgICovXG4gIHJlcGVhdDogUmVwZWF0O1xuXG4gIHNwZWM6IEdlbmVyaWNTcGVjPFUsIEw+O1xuXG4gIC8qKlxuICAgKiBTY2FsZSBhbmQgbGVnZW5kIHJlc29sdXRpb25zIGZvciByZXBlYXRlZCBjaGFydHMuXG4gICAqL1xuICByZXNvbHZlPzogUmVzb2x2ZTtcbn1cblxuZXhwb3J0IHR5cGUgTm9ybWFsaXplZFJlcGVhdFNwZWMgPSBHZW5lcmljUmVwZWF0U3BlYzxOb3JtYWxpemVkVW5pdFNwZWMsIE5vcm1hbGl6ZWRMYXllclNwZWM+O1xuXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyaWNWQ29uY2F0U3BlYzxcbiAgVSBleHRlbmRzIEdlbmVyaWNVbml0U3BlYzxhbnksIGFueT4sXG4gIEwgZXh0ZW5kcyBHZW5lcmljTGF5ZXJTcGVjPGFueT5cbj4gZXh0ZW5kcyBCYXNlU3BlYyB7XG4gIC8qKlxuICAgKiBBIGxpc3Qgb2Ygdmlld3MgdGhhdCBzaG91bGQgYmUgY29uY2F0ZW5hdGVkIGFuZCBwdXQgaW50byBhIGNvbHVtbi5cbiAgICovXG4gIHZjb25jYXQ6IChHZW5lcmljU3BlYzxVLCBMPilbXTtcblxuICAvKipcbiAgICogU2NhbGUsIGF4aXMsIGFuZCBsZWdlbmQgcmVzb2x1dGlvbnMgZm9yIHZlcnRpY2FsbHkgY29uY2F0ZW5hdGVkIGNoYXJ0cy5cbiAgICovXG4gIHJlc29sdmU/OiBSZXNvbHZlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyaWNIQ29uY2F0U3BlYzxcbiAgVSBleHRlbmRzIEdlbmVyaWNVbml0U3BlYzxhbnksIGFueT4sXG4gIEwgZXh0ZW5kcyBHZW5lcmljTGF5ZXJTcGVjPGFueT5cbj4gZXh0ZW5kcyBCYXNlU3BlYyB7XG4gIC8qKlxuICAgKiBBIGxpc3Qgb2Ygdmlld3MgdGhhdCBzaG91bGQgYmUgY29uY2F0ZW5hdGVkIGFuZCBwdXQgaW50byBhIHJvdy5cbiAgICovXG4gIGhjb25jYXQ6IChHZW5lcmljU3BlYzxVLCBMPilbXTtcblxuICAvKipcbiAgICogU2NhbGUsIGF4aXMsIGFuZCBsZWdlbmQgcmVzb2x1dGlvbnMgZm9yIGhvcml6b250YWxseSBjb25jYXRlbmF0ZWQgY2hhcnRzLlxuICAgKi9cbiAgcmVzb2x2ZT86IFJlc29sdmU7XG59XG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRDb25jYXRTcGVjID1cbiAgR2VuZXJpY1ZDb25jYXRTcGVjPE5vcm1hbGl6ZWRVbml0U3BlYywgTm9ybWFsaXplZExheWVyU3BlYz4gfCBHZW5lcmljSENvbmNhdFNwZWM8Tm9ybWFsaXplZFVuaXRTcGVjLCBOb3JtYWxpemVkTGF5ZXJTcGVjPjtcblxuZXhwb3J0IHR5cGUgR2VuZXJpY1NwZWM8XG4gIFUgZXh0ZW5kcyBHZW5lcmljVW5pdFNwZWM8YW55LCBhbnk+LFxuICBMIGV4dGVuZHMgR2VuZXJpY0xheWVyU3BlYzxhbnk+XG4+ID0gVSB8IEwgfCBHZW5lcmljRmFjZXRTcGVjPFUsIEw+IHwgR2VuZXJpY1JlcGVhdFNwZWM8VSwgTD4gfFxuICBHZW5lcmljVkNvbmNhdFNwZWM8VSwgTD4gfEdlbmVyaWNIQ29uY2F0U3BlYzxVLCBMPjtcblxuZXhwb3J0IHR5cGUgTm9ybWFsaXplZFNwZWMgPSBHZW5lcmljU3BlYzxOb3JtYWxpemVkVW5pdFNwZWMsIE5vcm1hbGl6ZWRMYXllclNwZWM+O1xuXG5leHBvcnQgdHlwZSBUb3BMZXZlbEZhY2V0ZWRVbml0U3BlYyA9IFRvcExldmVsPEZhY2V0ZWRDb21wb3NpdGVVbml0U3BlYz4gJiBEYXRhTWl4aW5zO1xuZXhwb3J0IHR5cGUgVG9wTGV2ZWxGYWNldFNwZWMgPSBUb3BMZXZlbDxHZW5lcmljRmFjZXRTcGVjPENvbXBvc2l0ZVVuaXRTcGVjLCBFeHRlbmRlZExheWVyU3BlYz4+ICYgRGF0YU1peGlucztcblxuZXhwb3J0IHR5cGUgVG9wTGV2ZWxTcGVjID0gVG9wTGV2ZWxGYWNldGVkVW5pdFNwZWMgfCBUb3BMZXZlbEZhY2V0U3BlYyB8IFRvcExldmVsPEV4dGVuZGVkTGF5ZXJTcGVjPiB8XG5Ub3BMZXZlbDxHZW5lcmljUmVwZWF0U3BlYzxDb21wb3NpdGVVbml0U3BlYywgRXh0ZW5kZWRMYXllclNwZWM+PiB8IFRvcExldmVsPEdlbmVyaWNWQ29uY2F0U3BlYzxDb21wb3NpdGVVbml0U3BlYywgRXh0ZW5kZWRMYXllclNwZWM+PiB8IFRvcExldmVsPEdlbmVyaWNIQ29uY2F0U3BlYzxDb21wb3NpdGVVbml0U3BlYywgRXh0ZW5kZWRMYXllclNwZWM+PjtcblxuLyogQ3VzdG9tIHR5cGUgZ3VhcmRzICovXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmFjZXRTcGVjKHNwZWM6IEJhc2VTcGVjKTogc3BlYyBpcyBHZW5lcmljRmFjZXRTcGVjPGFueSwgYW55PiB7XG4gIHJldHVybiBzcGVjWydmYWNldCddICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1VuaXRTcGVjKHNwZWM6IEJhc2VTcGVjKTogc3BlYyBpcyBGYWNldGVkQ29tcG9zaXRlVW5pdFNwZWMgfCBOb3JtYWxpemVkVW5pdFNwZWMge1xuICByZXR1cm4gISFzcGVjWydtYXJrJ107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0xheWVyU3BlYyhzcGVjOiBCYXNlU3BlYyk6IHNwZWMgaXMgR2VuZXJpY0xheWVyU3BlYzxhbnk+IHtcbiAgcmV0dXJuIHNwZWNbJ2xheWVyJ10gIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVwZWF0U3BlYyhzcGVjOiBCYXNlU3BlYyk6IHNwZWMgaXMgR2VuZXJpY1JlcGVhdFNwZWM8YW55LCBhbnk+IHtcbiAgcmV0dXJuIHNwZWNbJ3JlcGVhdCddICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmNhdFNwZWMoc3BlYzogQmFzZVNwZWMpOlxuICBzcGVjIGlzIEdlbmVyaWNWQ29uY2F0U3BlYzxhbnksIGFueT4gfFxuICAgIEdlbmVyaWNIQ29uY2F0U3BlYzxhbnksIGFueT4ge1xuICByZXR1cm4gaXNWQ29uY2F0U3BlYyhzcGVjKSB8fCBpc0hDb25jYXRTcGVjKHNwZWMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWQ29uY2F0U3BlYyhzcGVjOiBCYXNlU3BlYyk6IHNwZWMgaXMgR2VuZXJpY1ZDb25jYXRTcGVjPGFueSwgYW55PiB7XG4gIHJldHVybiBzcGVjWyd2Y29uY2F0J10gIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSENvbmNhdFNwZWMoc3BlYzogQmFzZVNwZWMpOiBzcGVjIGlzIEdlbmVyaWNIQ29uY2F0U3BlYzxhbnksIGFueT4ge1xuICByZXR1cm4gc3BlY1snaGNvbmNhdCddICE9PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRGVjb21wb3NlIGV4dGVuZGVkIHVuaXQgc3BlY3MgaW50byBjb21wb3NpdGlvbiBvZiBwdXJlIHVuaXQgc3BlY3MuXG4gKi9cbi8vIFRPRE86IGNvbnNpZGVyIG1vdmluZyB0aGlzIHRvIGFub3RoZXIgZmlsZS4gIE1heWJlIHZsLnNwZWMubm9ybWFsaXplIG9yIHZsLm5vcm1hbGl6ZVxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShzcGVjOiBUb3BMZXZlbFNwZWMgfCBHZW5lcmljU3BlYzxDb21wb3NpdGVVbml0U3BlYywgRXh0ZW5kZWRMYXllclNwZWM+IHwgRmFjZXRlZENvbXBvc2l0ZVVuaXRTcGVjLCBjb25maWc6IENvbmZpZyk6IE5vcm1hbGl6ZWRTcGVjIHtcbiAgaWYgKGlzRmFjZXRTcGVjKHNwZWMpKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZUZhY2V0KHNwZWMsIGNvbmZpZyk7XG4gIH1cbiAgaWYgKGlzTGF5ZXJTcGVjKHNwZWMpKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZUxheWVyKHNwZWMsIGNvbmZpZyk7XG4gIH1cbiAgaWYgKGlzUmVwZWF0U3BlYyhzcGVjKSkge1xuICAgIHJldHVybiBub3JtYWxpemVSZXBlYXQoc3BlYywgY29uZmlnKTtcbiAgfVxuICBpZiAoaXNWQ29uY2F0U3BlYyhzcGVjKSkge1xuICAgIHJldHVybiBub3JtYWxpemVWQ29uY2F0KHNwZWMsIGNvbmZpZyk7XG4gIH1cbiAgaWYgKGlzSENvbmNhdFNwZWMoc3BlYykpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplSENvbmNhdChzcGVjLCBjb25maWcpO1xuICB9XG4gIGlmIChpc1VuaXRTcGVjKHNwZWMpKSB7XG4gICAgY29uc3QgaGFzUm93ID0gY2hhbm5lbEhhc0ZpZWxkKHNwZWMuZW5jb2RpbmcsIFJPVyk7XG4gICAgY29uc3QgaGFzQ29sdW1uID0gY2hhbm5lbEhhc0ZpZWxkKHNwZWMuZW5jb2RpbmcsIENPTFVNTik7XG5cbiAgICBpZiAoaGFzUm93IHx8IGhhc0NvbHVtbikge1xuICAgICAgcmV0dXJuIG5vcm1hbGl6ZUZhY2V0ZWRVbml0KHNwZWMsIGNvbmZpZyk7XG4gICAgfVxuICAgIHJldHVybiBub3JtYWxpemVOb25GYWNldFVuaXQoc3BlYywgY29uZmlnKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuSU5WQUxJRF9TUEVDKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRmFjZXQoc3BlYzogR2VuZXJpY0ZhY2V0U3BlYzxDb21wb3NpdGVVbml0U3BlYywgRXh0ZW5kZWRMYXllclNwZWM+LCBjb25maWc6IENvbmZpZyk6IE5vcm1hbGl6ZWRGYWNldFNwZWMge1xuICBjb25zdCB7c3BlYzogc3Vic3BlYywgLi4ucmVzdH0gPSBzcGVjO1xuICByZXR1cm4ge1xuICAgIC4uLnJlc3QsXG4gICAgLy8gVE9ETzogcmVtb3ZlIFwiYW55XCIgb25jZSB3ZSBzdXBwb3J0IGFsbCBmYWNldCBsaXN0ZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNzYwXG4gICAgc3BlYzogbm9ybWFsaXplKHN1YnNwZWMsIGNvbmZpZykgYXMgYW55XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1lcmdlRW5jb2Rpbmcob3B0OiB7cGFyZW50RW5jb2Rpbmc6IEVuY29kaW5nPGFueT4sIGVuY29kaW5nOiBFbmNvZGluZzxhbnk+fSk6IEVuY29kaW5nPGFueT4ge1xuICBjb25zdCB7cGFyZW50RW5jb2RpbmcsIGVuY29kaW5nfSA9IG9wdDtcbiAgaWYgKHBhcmVudEVuY29kaW5nICYmIGVuY29kaW5nKSB7XG4gICAgY29uc3Qgb3ZlcnJpZGVuID0ga2V5cyhwYXJlbnRFbmNvZGluZykucmVkdWNlKChvLCBrZXkpID0+IHtcbiAgICAgIGlmIChlbmNvZGluZ1trZXldKSB7XG4gICAgICAgIG8ucHVzaChrZXkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG87XG4gICAgfSwgW10pO1xuXG4gICAgaWYgKG92ZXJyaWRlbi5sZW5ndGggPiAwKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5lbmNvZGluZ092ZXJyaWRkZW4ob3ZlcnJpZGVuKSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbWVyZ2VkID0ge1xuICAgIC4uLihwYXJlbnRFbmNvZGluZyB8fCB7fSksXG4gICAgLi4uKGVuY29kaW5nIHx8IHt9KVxuICB9O1xuICByZXR1cm4ga2V5cyhtZXJnZWQpLmxlbmd0aCA+IDAgPyBtZXJnZWQgOiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIG1lcmdlUHJvamVjdGlvbihvcHQ6IHtwYXJlbnRQcm9qZWN0aW9uOiBQcm9qZWN0aW9uLCBwcm9qZWN0aW9uOiBQcm9qZWN0aW9ufSkge1xuICBjb25zdCB7cGFyZW50UHJvamVjdGlvbiwgcHJvamVjdGlvbn0gPSBvcHQ7XG4gIGlmIChwYXJlbnRQcm9qZWN0aW9uICYmIHByb2plY3Rpb24pIHtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5wcm9qZWN0aW9uT3ZlcnJpZGRlbih7cGFyZW50UHJvamVjdGlvbiwgcHJvamVjdGlvbn0pKTtcbiAgfVxuICByZXR1cm4gcHJvamVjdGlvbiB8fCBwYXJlbnRQcm9qZWN0aW9uO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVMYXllcihcbiAgc3BlYzogRXh0ZW5kZWRMYXllclNwZWMsXG4gIGNvbmZpZzogQ29uZmlnLFxuICBwYXJlbnRFbmNvZGluZz86IEVuY29kaW5nPHN0cmluZyB8IFJlcGVhdFJlZj4sXG4gIHBhcmVudFByb2plY3Rpb24/OiBQcm9qZWN0aW9uXG4pOiBOb3JtYWxpemVkTGF5ZXJTcGVjIHtcbiAgY29uc3Qge2xheWVyLCBlbmNvZGluZywgcHJvamVjdGlvbiwgLi4ucmVzdH0gPSBzcGVjO1xuICBjb25zdCBtZXJnZWRFbmNvZGluZyA9IG1lcmdlRW5jb2Rpbmcoe3BhcmVudEVuY29kaW5nLCBlbmNvZGluZ30pO1xuICBjb25zdCBtZXJnZWRQcm9qZWN0aW9uID0gbWVyZ2VQcm9qZWN0aW9uKHtwYXJlbnRQcm9qZWN0aW9uLCBwcm9qZWN0aW9ufSk7XG4gIHJldHVybiB7XG4gICAgLi4ucmVzdCxcbiAgICBsYXllcjogbGF5ZXIubWFwKChzdWJzcGVjKSA9PiB7XG4gICAgICBpZiAoaXNMYXllclNwZWMoc3Vic3BlYykpIHtcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZUxheWVyKHN1YnNwZWMsIGNvbmZpZywgbWVyZ2VkRW5jb2RpbmcsIG1lcmdlZFByb2plY3Rpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vcm1hbGl6ZU5vbkZhY2V0VW5pdChzdWJzcGVjLCBjb25maWcsIG1lcmdlZEVuY29kaW5nLCBtZXJnZWRQcm9qZWN0aW9uKTtcbiAgICB9KVxuICB9O1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVSZXBlYXQoc3BlYzogR2VuZXJpY1JlcGVhdFNwZWM8Q29tcG9zaXRlVW5pdFNwZWMsIEV4dGVuZGVkTGF5ZXJTcGVjPiwgY29uZmlnOiBDb25maWcpOiBOb3JtYWxpemVkUmVwZWF0U3BlYyB7XG4gIGNvbnN0IHtzcGVjOiBzdWJzcGVjLCAuLi5yZXN0fSA9IHNwZWM7XG4gIHJldHVybiB7XG4gICAgLi4ucmVzdCxcbiAgICBzcGVjOiBub3JtYWxpemUoc3Vic3BlYywgY29uZmlnKVxuICB9O1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVWQ29uY2F0KHNwZWM6IEdlbmVyaWNWQ29uY2F0U3BlYzxDb21wb3NpdGVVbml0U3BlYywgRXh0ZW5kZWRMYXllclNwZWM+LCBjb25maWc6IENvbmZpZyk6IE5vcm1hbGl6ZWRDb25jYXRTcGVjIHtcbiAgY29uc3Qge3Zjb25jYXQ6IHZjb25jYXQsIC4uLnJlc3R9ID0gc3BlYztcbiAgcmV0dXJuIHtcbiAgICAuLi5yZXN0LFxuICAgIHZjb25jYXQ6IHZjb25jYXQubWFwKChzdWJzcGVjKSA9PiBub3JtYWxpemUoc3Vic3BlYywgY29uZmlnKSlcbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplSENvbmNhdChzcGVjOiBHZW5lcmljSENvbmNhdFNwZWM8Q29tcG9zaXRlVW5pdFNwZWMsIEV4dGVuZGVkTGF5ZXJTcGVjPiwgY29uZmlnOiBDb25maWcpOiBOb3JtYWxpemVkQ29uY2F0U3BlYyB7XG4gIGNvbnN0IHtoY29uY2F0OiBoY29uY2F0LCAuLi5yZXN0fSA9IHNwZWM7XG4gIHJldHVybiB7XG4gICAgLi4ucmVzdCxcbiAgICBoY29uY2F0OiBoY29uY2F0Lm1hcCgoc3Vic3BlYykgPT4gbm9ybWFsaXplKHN1YnNwZWMsIGNvbmZpZykpXG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUZhY2V0ZWRVbml0KHNwZWM6IEZhY2V0ZWRDb21wb3NpdGVVbml0U3BlYywgY29uZmlnOiBDb25maWcpOiBOb3JtYWxpemVkRmFjZXRTcGVjIHtcbiAgLy8gTmV3IGVuY29kaW5nIGluIHRoZSBpbnNpZGUgc3BlYyBzaG91bGQgbm90IGNvbnRhaW4gcm93IC8gY29sdW1uXG4gIC8vIGFzIHJvdy9jb2x1bW4gc2hvdWxkIGJlIG1vdmVkIHRvIGZhY2V0XG4gIGNvbnN0IHtyb3c6IHJvdywgY29sdW1uOiBjb2x1bW4sIC4uLmVuY29kaW5nfSA9IHNwZWMuZW5jb2Rpbmc7XG5cbiAgLy8gTWFyayBhbmQgZW5jb2Rpbmcgc2hvdWxkIGJlIG1vdmVkIGludG8gdGhlIGlubmVyIHNwZWNcbiAgY29uc3Qge21hcmssIHdpZHRoLCBwcm9qZWN0aW9uLCBoZWlnaHQsIHNlbGVjdGlvbiwgZW5jb2Rpbmc6IF8sIC4uLm91dGVyU3BlY30gPSBzcGVjO1xuXG4gIHJldHVybiB7XG4gICAgLi4ub3V0ZXJTcGVjLFxuICAgIGZhY2V0OiB7XG4gICAgICAuLi4ocm93ID8ge3Jvd30gOiB7fSksXG4gICAgICAuLi4oY29sdW1uID8ge2NvbHVtbn06IHt9KSxcbiAgICB9LFxuICAgIHNwZWM6IG5vcm1hbGl6ZU5vbkZhY2V0VW5pdCh7XG4gICAgICAuLi4ocHJvamVjdGlvbiA/IHtwcm9qZWN0aW9ufSA6IHt9KSxcbiAgICAgIG1hcmssXG4gICAgICAuLi4od2lkdGggPyB7d2lkdGh9IDoge30pLFxuICAgICAgLi4uKGhlaWdodCA/IHtoZWlnaHR9IDoge30pLFxuICAgICAgZW5jb2RpbmcsXG4gICAgICAuLi4oc2VsZWN0aW9uID8ge3NlbGVjdGlvbn0gOiB7fSlcbiAgICB9LCBjb25maWcpXG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzTm9uRmFjZXRVbml0U3BlY1dpdGhQcmltaXRpdmVNYXJrKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIEFueU1hcms+KTpcbiAgc3BlYyBpcyBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8RmllbGQ+LCBNYXJrPiB7XG4gICAgcmV0dXJuIGlzUHJpbWl0aXZlTWFyayhzcGVjLm1hcmspO1xufVxuXG5mdW5jdGlvbiBnZXRQb2ludE92ZXJsYXkobWFya0RlZjogTWFya0RlZiwgbWFya0NvbmZpZzogTGluZUNvbmZpZywgZW5jb2Rpbmc6IEVuY29kaW5nPEZpZWxkPik6IE1hcmtDb25maWcge1xuICBpZiAobWFya0RlZi5wb2ludCA9PT0gJ3RyYW5zcGFyZW50Jykge1xuICAgIHJldHVybiB7b3BhY2l0eTogMH07XG4gIH0gZWxzZSBpZiAobWFya0RlZi5wb2ludCkgeyAvLyB0cnV0aHkgOiB0cnVlIG9yIG9iamVjdFxuICAgIHJldHVybiBpc09iamVjdChtYXJrRGVmLnBvaW50KSA/IG1hcmtEZWYucG9pbnQgOiB7fTtcbiAgfSBlbHNlIGlmIChtYXJrRGVmLnBvaW50ICE9PSB1bmRlZmluZWQpIHsgLy8gZmFsc2Ugb3IgbnVsbFxuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgeyAvLyB1bmRlZmluZWQgKG5vdCBkaXNhYmxlZClcbiAgICBpZiAobWFya0NvbmZpZy5wb2ludCB8fCBlbmNvZGluZy5zaGFwZSkge1xuICAgICAgLy8gZW5hYmxlIHBvaW50IG92ZXJsYXkgaWYgY29uZmlnW21hcmtdLnBvaW50IGlzIHRydXRoeSBvciBpZiBlbmNvZGluZy5zaGFwZSBpcyBwcm92aWRlZFxuICAgICAgcmV0dXJuIGlzT2JqZWN0KG1hcmtDb25maWcucG9pbnQpID8gbWFya0NvbmZpZy5wb2ludCA6IHt9O1xuICAgIH1cbiAgICAvLyBtYXJrRGVmLnBvaW50IGlzIGRlZmluZWQgYXMgZmFsc3lcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRMaW5lT3ZlcmxheShtYXJrRGVmOiBNYXJrRGVmLCBtYXJrQ29uZmlnOiBBcmVhQ29uZmlnKTogTWFya0NvbmZpZyB7XG4gIGlmIChtYXJrRGVmLmxpbmUpIHsgLy8gdHJ1ZSBvciBvYmplY3RcbiAgICByZXR1cm4gbWFya0RlZi5saW5lID09PSB0cnVlID8ge30gOiBtYXJrRGVmLmxpbmU7XG4gIH0gZWxzZSBpZiAobWFya0RlZi5saW5lICE9PSB1bmRlZmluZWQpIHsgLy8gZmFsc2Ugb3IgbnVsbFxuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgeyAvLyB1bmRlZmluZWQgKG5vdCBkaXNhYmxlZClcbiAgICBpZiAobWFya0NvbmZpZy5saW5lKSB7XG4gICAgICAvLyBlbmFibGUgbGluZSBvdmVybGF5IGlmIGNvbmZpZ1ttYXJrXS5saW5lIGlzIHRydXRoeVxuICAgICAgcmV0dXJuIG1hcmtDb25maWcubGluZSA9PT0gdHJ1ZSA/IHt9IDogbWFya0NvbmZpZy5saW5lO1xuICAgIH1cbiAgICAvLyBtYXJrRGVmLnBvaW50IGlzIGRlZmluZWQgYXMgZmFsc3lcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVOb25GYWNldFVuaXQoXG4gIHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIEFueU1hcms+LCBjb25maWc6IENvbmZpZyxcbiAgcGFyZW50RW5jb2Rpbmc/OiBFbmNvZGluZzxzdHJpbmcgfCBSZXBlYXRSZWY+LCBwYXJlbnRQcm9qZWN0aW9uPzogUHJvamVjdGlvblxuKTogTm9ybWFsaXplZFVuaXRTcGVjIHwgTm9ybWFsaXplZExheWVyU3BlYyB7XG4gIGNvbnN0IHtlbmNvZGluZywgcHJvamVjdGlvbn0gPSBzcGVjO1xuICBjb25zdCBtYXJrID0gaXNNYXJrRGVmKHNwZWMubWFyaykgPyBzcGVjLm1hcmsudHlwZSA6IHNwZWMubWFyaztcblxuXG4gIC8vIG1lcmdlIHBhcmVudCBlbmNvZGluZyAvIHByb2plY3Rpb24gZmlyc3RcbiAgaWYgKHBhcmVudEVuY29kaW5nIHx8IHBhcmVudFByb2plY3Rpb24pIHtcbiAgICBjb25zdCBtZXJnZWRQcm9qZWN0aW9uID0gbWVyZ2VQcm9qZWN0aW9uKHtwYXJlbnRQcm9qZWN0aW9uLCBwcm9qZWN0aW9ufSk7XG4gICAgY29uc3QgbWVyZ2VkRW5jb2RpbmcgPSBtZXJnZUVuY29kaW5nKHtwYXJlbnRFbmNvZGluZywgZW5jb2Rpbmd9KTtcbiAgICByZXR1cm4gbm9ybWFsaXplTm9uRmFjZXRVbml0KHtcbiAgICAgIC4uLnNwZWMsXG4gICAgICAuLi4obWVyZ2VkUHJvamVjdGlvbiA/IHtwcm9qZWN0aW9uOiBtZXJnZWRQcm9qZWN0aW9ufSA6IHt9KSxcbiAgICAgIC4uLihtZXJnZWRFbmNvZGluZyA/IHtlbmNvZGluZzogbWVyZ2VkRW5jb2Rpbmd9IDoge30pLFxuICAgIH0sIGNvbmZpZyk7XG4gIH1cblxuICBpZiAoaXNOb25GYWNldFVuaXRTcGVjV2l0aFByaW1pdGl2ZU1hcmsoc3BlYykpIHtcbiAgICAvLyBUT0RPOiB0aG9yb3VnaGx5IHRlc3RcbiAgICBpZiAoaXNSYW5nZWQoZW5jb2RpbmcpKSB7XG4gICAgICByZXR1cm4gbm9ybWFsaXplUmFuZ2VkVW5pdChzcGVjKTtcbiAgICB9XG5cbiAgICBpZiAobWFyayA9PT0gJ2xpbmUnICYmIChlbmNvZGluZy54MiB8fCBlbmNvZGluZy55MikpIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmxpbmVXaXRoUmFuZ2UoISFlbmNvZGluZy54MiwgISFlbmNvZGluZy55MikpO1xuXG4gICAgICByZXR1cm4gbm9ybWFsaXplTm9uRmFjZXRVbml0KHtcbiAgICAgICAgbWFyazogJ3J1bGUnLFxuICAgICAgICAuLi5zcGVjXG4gICAgICB9LCBjb25maWcsIHBhcmVudEVuY29kaW5nLCBwYXJlbnRQcm9qZWN0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAoaXNQYXRoTWFyayhtYXJrKSkge1xuICAgICAgcmV0dXJuIG5vcm1hbGl6ZVBhdGhPdmVybGF5KHNwZWMsIGNvbmZpZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwZWM7IC8vIE5vdGhpbmcgdG8gbm9ybWFsaXplXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGNvbXBvc2l0ZU1hcmsubm9ybWFsaXplKHNwZWMsIGNvbmZpZyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUmFuZ2VkVW5pdChzcGVjOiBOb3JtYWxpemVkVW5pdFNwZWMpIHtcbiAgY29uc3QgaGFzWCA9IGNoYW5uZWxIYXNGaWVsZChzcGVjLmVuY29kaW5nLCBYKTtcbiAgY29uc3QgaGFzWSA9IGNoYW5uZWxIYXNGaWVsZChzcGVjLmVuY29kaW5nLCBZKTtcbiAgY29uc3QgaGFzWDIgPSBjaGFubmVsSGFzRmllbGQoc3BlYy5lbmNvZGluZywgWDIpO1xuICBjb25zdCBoYXNZMiA9IGNoYW5uZWxIYXNGaWVsZChzcGVjLmVuY29kaW5nLCBZMik7XG4gIGlmICgoaGFzWDIgJiYgIWhhc1gpIHx8IChoYXNZMiAmJiAhaGFzWSkpIHtcbiAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IGR1cGxpY2F0ZShzcGVjKTtcbiAgICBpZiAoaGFzWDIgJiYgIWhhc1gpIHtcbiAgICAgIG5vcm1hbGl6ZWRTcGVjLmVuY29kaW5nLnggPSBub3JtYWxpemVkU3BlYy5lbmNvZGluZy54MjtcbiAgICAgIGRlbGV0ZSBub3JtYWxpemVkU3BlYy5lbmNvZGluZy54MjtcbiAgICB9XG4gICAgaWYgKGhhc1kyICYmICFoYXNZKSB7XG4gICAgICBub3JtYWxpemVkU3BlYy5lbmNvZGluZy55ID0gbm9ybWFsaXplZFNwZWMuZW5jb2RpbmcueTI7XG4gICAgICBkZWxldGUgbm9ybWFsaXplZFNwZWMuZW5jb2RpbmcueTI7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRTcGVjO1xuICB9XG4gIHJldHVybiBzcGVjO1xufVxuXG5mdW5jdGlvbiBkcm9wTGluZUFuZFBvaW50KG1hcmtEZWY6IE1hcmtEZWYpOiBNYXJrRGVmIHwgTWFyayB7XG4gIGNvbnN0IHtwb2ludDogX3BvaW50LCBsaW5lOiBfbGluZSwgLi4ubWFya30gPSBtYXJrRGVmO1xuXG4gIHJldHVybiBrZXlzKG1hcmspLmxlbmd0aCA+IDEgPyBtYXJrIDogbWFyay50eXBlO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQYXRoT3ZlcmxheShzcGVjOiBOb3JtYWxpemVkVW5pdFNwZWMsIGNvbmZpZzogQ29uZmlnID0ge30pOiBOb3JtYWxpemVkTGF5ZXJTcGVjIHwgTm9ybWFsaXplZFVuaXRTcGVjIHtcblxuICAvLyBfIGlzIHVzZWQgdG8gZGVub3RlIGEgZHJvcHBlZCBwcm9wZXJ0eSBvZiB0aGUgdW5pdCBzcGVjXG4gIC8vIHdoaWNoIHNob3VsZCBub3QgYmUgY2FycmllZCBvdmVyIHRvIHRoZSBsYXllciBzcGVjXG4gIGNvbnN0IHtzZWxlY3Rpb24sIHByb2plY3Rpb24sIGVuY29kaW5nLCBtYXJrLCAuLi5vdXRlclNwZWN9ID0gc3BlYztcbiAgY29uc3QgbWFya0RlZiA9IGlzTWFya0RlZihtYXJrKSA/IG1hcmsgOiB7dHlwZTogbWFya307XG5cbiAgY29uc3QgcG9pbnRPdmVybGF5ID0gZ2V0UG9pbnRPdmVybGF5KG1hcmtEZWYsIGNvbmZpZ1ttYXJrRGVmLnR5cGVdLCBlbmNvZGluZyk7XG4gIGNvbnN0IGxpbmVPdmVybGF5ID0gbWFya0RlZi50eXBlID09PSAnYXJlYScgJiYgZ2V0TGluZU92ZXJsYXkobWFya0RlZiwgY29uZmlnW21hcmtEZWYudHlwZV0pO1xuXG4gIGlmICghcG9pbnRPdmVybGF5ICYmICFsaW5lT3ZlcmxheSkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zcGVjLFxuICAgICAgLy8gRG8gbm90IGluY2x1ZGUgcG9pbnQgLyBsaW5lIG92ZXJsYXkgaW4gdGhlIG5vcm1hbGl6ZSBzcGVjXG4gICAgICBtYXJrOiBkcm9wTGluZUFuZFBvaW50KG1hcmtEZWYpXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IGxheWVyOiBOb3JtYWxpemVkVW5pdFNwZWNbXSA9IFt7XG4gICAgLi4uKHNlbGVjdGlvbiA/IHtzZWxlY3Rpb259IDoge30pLFxuICAgIC8vIERvIG5vdCBpbmNsdWRlIHBvaW50IC8gbGluZSBvdmVybGF5IGluIHRoZSBub3JtYWxpemUgc3BlY1xuICAgIG1hcms6IGRyb3BMaW5lQW5kUG9pbnQoe1xuICAgICAgLi4ubWFya0RlZixcbiAgICAgIC8vIG1ha2UgYXJlYSBtYXJrIHRyYW5zbHVjZW50IGJ5IGRlZmF1bHRcbiAgICAgIC8vIFRPRE86IGV4dHJhY3QgdGhpcyAwLjcgdG8gYmUgc2hhcmVkIHdpdGggZGVmYXVsdCBvcGFjaXR5IGZvciBwb2ludC90aWNrLy4uLlxuICAgICAgLi4uKG1hcmtEZWYudHlwZSA9PT0gJ2FyZWEnID8ge29wYWNpdHk6IDAuN30gOiB7fSksXG4gICAgfSksXG4gICAgLy8gZHJvcCBzaGFwZSBmcm9tIGVuY29kaW5nIGFzIHRoaXMgbWlnaHQgYmUgdXNlZCB0byB0cmlnZ2VyIHBvaW50IG92ZXJsYXlcbiAgICBlbmNvZGluZzogb21pdChlbmNvZGluZywgWydzaGFwZSddKVxuICB9XTtcblxuICAvLyBGSVhNRTogZGlzYWJsZSB0b29sdGlwIGZvciB0aGUgbGluZSBsYXllciBpZiB0b29sdGlwIGlzIG5vdCBncm91cC1ieSBmaWVsZC5cbiAgLy8gRklYTUU6IGRldGVybWluZSBydWxlcyBmb3IgYXBwbHlpbmcgc2VsZWN0aW9ucy5cblxuICAvLyBOZWVkIHRvIGNvcHkgc3RhY2sgY29uZmlnIHRvIG92ZXJsYXllZCBsYXllclxuICBjb25zdCBzdGFja1Byb3BzID0gc3RhY2sobWFya0RlZiwgZW5jb2RpbmcsIGNvbmZpZyA/IGNvbmZpZy5zdGFjayA6IHVuZGVmaW5lZCk7XG5cbiAgbGV0IG92ZXJsYXlFbmNvZGluZyA9IGVuY29kaW5nO1xuICBpZiAoc3RhY2tQcm9wcykge1xuICAgIGNvbnN0IHtmaWVsZENoYW5uZWw6IHN0YWNrRmllbGRDaGFubmVsLCBvZmZzZXR9ID0gc3RhY2tQcm9wcztcbiAgICBvdmVybGF5RW5jb2RpbmcgPSB7XG4gICAgICAuLi5lbmNvZGluZyxcbiAgICAgIFtzdGFja0ZpZWxkQ2hhbm5lbF06IHtcbiAgICAgICAgLi4uZW5jb2Rpbmdbc3RhY2tGaWVsZENoYW5uZWxdLFxuICAgICAgICAuLi4ob2Zmc2V0ID8ge3N0YWNrOiBvZmZzZXR9IDoge30pXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGlmIChsaW5lT3ZlcmxheSkge1xuICAgIGxheWVyLnB1c2goe1xuICAgICAgLi4uKHByb2plY3Rpb24gPyB7cHJvamVjdGlvbn0gOiB7fSksXG4gICAgICBtYXJrOiB7XG4gICAgICAgIHR5cGU6ICdsaW5lJyxcbiAgICAgICAgLi4ubGluZU92ZXJsYXlcbiAgICAgIH0sXG4gICAgICBlbmNvZGluZzogb3ZlcmxheUVuY29kaW5nXG4gICAgfSk7XG4gIH1cbiAgaWYgKHBvaW50T3ZlcmxheSkge1xuICAgIGxheWVyLnB1c2goe1xuICAgICAgLi4uKHByb2plY3Rpb24gPyB7cHJvamVjdGlvbn0gOiB7fSksXG4gICAgICBtYXJrOiB7XG4gICAgICAgIHR5cGU6ICdwb2ludCcsXG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIGZpbGxlZDogdHJ1ZSxcbiAgICAgICAgLi4ucG9pbnRPdmVybGF5XG4gICAgICB9LFxuICAgICAgZW5jb2Rpbmc6IG92ZXJsYXlFbmNvZGluZ1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vdXRlclNwZWMsXG4gICAgbGF5ZXJcbiAgfTtcbn1cblxuLy8gVE9ETzogYWRkIHZsLnNwZWMudmFsaWRhdGUgJiBtb3ZlIHN0dWZmIGZyb20gdmwudmFsaWRhdGUgdG8gaGVyZVxuXG4vKiBBY2N1bXVsYXRlIG5vbi1kdXBsaWNhdGUgZmllbGREZWZzIGluIGEgZGljdGlvbmFyeSAqL1xuZnVuY3Rpb24gYWNjdW11bGF0ZShkaWN0OiBhbnksIGRlZnM6IEZpZWxkRGVmPEZpZWxkPltdKTogYW55IHtcbiAgZGVmcy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkRGVmKSB7XG4gICAgLy8gQ29uc2lkZXIgb25seSBwdXJlIGZpZWxkRGVmIHByb3BlcnRpZXMgKGlnbm9yaW5nIHNjYWxlLCBheGlzLCBsZWdlbmQpXG4gICAgY29uc3QgcHVyZUZpZWxkRGVmID0gWydmaWVsZCcsICd0eXBlJywgJ3ZhbHVlJywgJ3RpbWVVbml0JywgJ2JpbicsICdhZ2dyZWdhdGUnXS5yZWR1Y2UoKGYsIGtleSkgPT4ge1xuICAgICAgaWYgKGZpZWxkRGVmW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmW2tleV0gPSBmaWVsZERlZltrZXldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGY7XG4gICAgfSwge30pO1xuICAgIGNvbnN0IGtleSA9IGhhc2gocHVyZUZpZWxkRGVmKTtcbiAgICBkaWN0W2tleV0gPSBkaWN0W2tleV0gfHwgZmllbGREZWY7XG4gIH0pO1xuICByZXR1cm4gZGljdDtcbn1cblxuLyogUmVjdXJzaXZlbHkgZ2V0IGZpZWxkRGVmcyBmcm9tIGEgc3BlYywgcmV0dXJucyBhIGRpY3Rpb25hcnkgb2YgZmllbGREZWZzICovXG5mdW5jdGlvbiBmaWVsZERlZkluZGV4PFQ+KHNwZWM6IEdlbmVyaWNTcGVjPGFueSwgYW55PiwgZGljdDogRGljdDxGaWVsZERlZjxUPj4gPSB7fSk6IERpY3Q8RmllbGREZWY8VD4+IHtcbiAgLy8gRklYTUUoaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yMjA3KTogU3VwcG9ydCBmaWVsZERlZkluZGV4IGZvciByZXBlYXRcbiAgaWYgKGlzTGF5ZXJTcGVjKHNwZWMpKSB7XG4gICAgc3BlYy5sYXllci5mb3JFYWNoKGxheWVyID0+IHtcbiAgICAgIGlmIChpc1VuaXRTcGVjKGxheWVyKSkge1xuICAgICAgICBhY2N1bXVsYXRlKGRpY3QsIHZsRW5jb2RpbmcuZmllbGREZWZzKGxheWVyLmVuY29kaW5nKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWVsZERlZkluZGV4KGxheWVyLCBkaWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChpc0ZhY2V0U3BlYyhzcGVjKSkge1xuICAgIGFjY3VtdWxhdGUoZGljdCwgdmxFbmNvZGluZy5maWVsZERlZnMoc3BlYy5mYWNldCkpO1xuICAgIGZpZWxkRGVmSW5kZXgoc3BlYy5zcGVjLCBkaWN0KTtcbiAgfSBlbHNlIGlmIChpc1JlcGVhdFNwZWMoc3BlYykpIHtcbiAgICBmaWVsZERlZkluZGV4KHNwZWMuc3BlYywgZGljdCk7XG4gIH0gZWxzZSBpZiAoaXNDb25jYXRTcGVjKHNwZWMpKSB7XG4gICAgY29uc3QgY2hpbGRTcGVjID0gaXNWQ29uY2F0U3BlYyhzcGVjKSA/IHNwZWMudmNvbmNhdCA6IHNwZWMuaGNvbmNhdDtcbiAgICBjaGlsZFNwZWMuZm9yRWFjaChjaGlsZCA9PiBmaWVsZERlZkluZGV4KGNoaWxkLCBkaWN0KSk7XG4gIH0gZWxzZSB7IC8vIFVuaXQgU3BlY1xuICAgIGFjY3VtdWxhdGUoZGljdCwgdmxFbmNvZGluZy5maWVsZERlZnMoc3BlYy5lbmNvZGluZykpO1xuICB9XG4gIHJldHVybiBkaWN0O1xufVxuXG4vKiBSZXR1cm5zIGFsbCBub24tZHVwbGljYXRlIGZpZWxkRGVmcyBpbiBhIHNwZWMgaW4gYSBmbGF0IGFycmF5ICovXG5leHBvcnQgZnVuY3Rpb24gZmllbGREZWZzKHNwZWM6IEdlbmVyaWNTcGVjPGFueSwgYW55Pik6IEZpZWxkRGVmPGFueT5bXSB7XG4gIHJldHVybiB2YWxzKGZpZWxkRGVmSW5kZXgoc3BlYykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdGFja2VkKHNwZWM6IFRvcExldmVsPEZhY2V0ZWRDb21wb3NpdGVVbml0U3BlYz4sIGNvbmZpZz86IENvbmZpZyk6IGJvb2xlYW4ge1xuICBjb25maWcgPSBjb25maWcgfHwgc3BlYy5jb25maWc7XG4gIGlmIChpc1ByaW1pdGl2ZU1hcmsoc3BlYy5tYXJrKSkge1xuICAgIHJldHVybiBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsXG4gICAgICAgICAgICBjb25maWcgPyBjb25maWcuc3RhY2sgOiB1bmRlZmluZWRcbiAgICAgICAgICApICE9PSBudWxsO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==