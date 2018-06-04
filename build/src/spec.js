"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var channel_1 = require("./channel");
var compositeMark = tslib_1.__importStar(require("./compositemark"));
var encoding_1 = require("./encoding");
var vlEncoding = tslib_1.__importStar(require("./encoding"));
var log = tslib_1.__importStar(require("./log"));
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
    var _a;
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
        var interpolate = markDef.interpolate;
        layer.push(tslib_1.__assign({}, (projection ? { projection: projection } : {}), { mark: tslib_1.__assign({ type: 'line' }, lineOverlay, (interpolate ? { interpolate: interpolate } : {})), encoding: overlayEncoding }));
    }
    if (pointOverlay) {
        layer.push(tslib_1.__assign({}, (projection ? { projection: projection } : {}), { mark: tslib_1.__assign({ type: 'point', opacity: 1, filled: true }, pointOverlay), encoding: overlayEncoding }));
    }
    return tslib_1.__assign({}, outerSpec, { layer: layer });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFtQztBQUNuQyxxQ0FBb0Q7QUFDcEQscUVBQWlEO0FBR2pELHVDQUFrRjtBQUNsRiw2REFBeUM7QUFHekMsaURBQTZCO0FBQzdCLCtCQUEwSDtBQUsxSCxpQ0FBOEI7QUFJOUIsK0JBQStEO0FBbVAvRCx3QkFBd0I7QUFHeEIscUJBQTRCLElBQWM7SUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxDQUFDO0FBQ3JDLENBQUM7QUFGRCxrQ0FFQztBQUVELG9CQUEyQixJQUFjO0lBQ3ZDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBRkQsZ0NBRUM7QUFFRCxxQkFBNEIsSUFBYztJQUN4QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDckMsQ0FBQztBQUZELGtDQUVDO0FBRUQsc0JBQTZCLElBQWM7SUFDekMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxDQUFDO0FBQ3RDLENBQUM7QUFGRCxvQ0FFQztBQUVELHNCQUE2QixJQUFjO0lBR3pDLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBSkQsb0NBSUM7QUFFRCx1QkFBOEIsSUFBYztJQUMxQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDdkMsQ0FBQztBQUZELHNDQUVDO0FBRUQsdUJBQThCLElBQWM7SUFDMUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssU0FBUyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCxzQ0FFQztBQUVEOztHQUVHO0FBQ0gsdUZBQXVGO0FBQ3ZGLG1CQUEwQixJQUFpRyxFQUFFLE1BQWM7SUFD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bEI7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFSRCw4QkFRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNPYmplY3R9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBYMiwgWSwgWTJ9IGZyb20gJy4vY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyBjb21wb3NpdGVNYXJrIGZyb20gJy4vY29tcG9zaXRlbWFyayc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtEYXRhfSBmcm9tICcuL2RhdGEnO1xuaW1wb3J0IHtjaGFubmVsSGFzRmllbGQsIEVuY29kaW5nLCBFbmNvZGluZ1dpdGhGYWNldCwgaXNSYW5nZWR9IGZyb20gJy4vZW5jb2RpbmcnO1xuaW1wb3J0ICogYXMgdmxFbmNvZGluZyBmcm9tICcuL2VuY29kaW5nJztcbmltcG9ydCB7RmFjZXRNYXBwaW5nfSBmcm9tICcuL2ZhY2V0JztcbmltcG9ydCB7RmllbGQsIEZpZWxkRGVmLCBSZXBlYXRSZWZ9IGZyb20gJy4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4vbG9nJztcbmltcG9ydCB7QW55TWFyaywgQXJlYUNvbmZpZywgaXNNYXJrRGVmLCBpc1BhdGhNYXJrLCBpc1ByaW1pdGl2ZU1hcmssIExpbmVDb25maWcsIE1hcmssIE1hcmtDb25maWcsIE1hcmtEZWZ9IGZyb20gJy4vbWFyayc7XG5pbXBvcnQge1Byb2plY3Rpb259IGZyb20gJy4vcHJvamVjdGlvbic7XG5pbXBvcnQge1JlcGVhdH0gZnJvbSAnLi9yZXBlYXQnO1xuaW1wb3J0IHtSZXNvbHZlfSBmcm9tICcuL3Jlc29sdmUnO1xuaW1wb3J0IHtTZWxlY3Rpb25EZWZ9IGZyb20gJy4vc2VsZWN0aW9uJztcbmltcG9ydCB7c3RhY2t9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHtUaXRsZVBhcmFtc30gZnJvbSAnLi90aXRsZSc7XG5pbXBvcnQge1RvcExldmVsUHJvcGVydGllc30gZnJvbSAnLi90b3BsZXZlbHByb3BzJztcbmltcG9ydCB7VHJhbnNmb3JtfSBmcm9tICcuL3RyYW5zZm9ybSc7XG5pbXBvcnQge0RpY3QsIGR1cGxpY2F0ZSwgaGFzaCwga2V5cywgb21pdCwgdmFsc30gZnJvbSAnLi91dGlsJztcblxuXG5leHBvcnQgdHlwZSBUb3BMZXZlbDxTIGV4dGVuZHMgQmFzZVNwZWM+ID0gUyAmIFRvcExldmVsUHJvcGVydGllcyAmIHtcbiAgLyoqXG4gICAqIFVSTCB0byBbSlNPTiBzY2hlbWFdKGh0dHA6Ly9qc29uLXNjaGVtYS5vcmcvKSBmb3IgYSBWZWdhLUxpdGUgc3BlY2lmaWNhdGlvbi4gVW5sZXNzIHlvdSBoYXZlIGEgcmVhc29uIHRvIGNoYW5nZSB0aGlzLCB1c2UgYGh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uYC4gU2V0dGluZyB0aGUgYCRzY2hlbWFgIHByb3BlcnR5IGFsbG93cyBhdXRvbWF0aWMgdmFsaWRhdGlvbiBhbmQgYXV0b2NvbXBsZXRlIGluIGVkaXRvcnMgdGhhdCBzdXBwb3J0IEpTT04gc2NoZW1hLlxuICAgKiBAZm9ybWF0IHVyaVxuICAgKi9cbiAgJHNjaGVtYT86IHN0cmluZztcblxuICAvKipcbiAgICogVmVnYS1MaXRlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiAgVGhpcyBwcm9wZXJ0eSBjYW4gb25seSBiZSBkZWZpbmVkIGF0IHRoZSB0b3AtbGV2ZWwgb2YgYSBzcGVjaWZpY2F0aW9uLlxuICAgKi9cbiAgY29uZmlnPzogQ29uZmlnO1xufTtcblxuZXhwb3J0IHR5cGUgQmFzZVNwZWMgPSBQYXJ0aWFsPERhdGFNaXhpbnM+ICYge1xuICAvKipcbiAgICogVGl0bGUgZm9yIHRoZSBwbG90LlxuICAgKi9cbiAgdGl0bGU/OiBzdHJpbmcgfCBUaXRsZVBhcmFtcztcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgdmlzdWFsaXphdGlvbiBmb3IgbGF0ZXIgcmVmZXJlbmNlLlxuICAgKi9cbiAgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogRGVzY3JpcHRpb24gb2YgdGhpcyBtYXJrIGZvciBjb21tZW50aW5nIHB1cnBvc2UuXG4gICAqL1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogQW4gb2JqZWN0IGRlc2NyaWJpbmcgdGhlIGRhdGEgc291cmNlXG4gICAqL1xuICBkYXRhPzogRGF0YTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZGF0YSB0cmFuc2Zvcm1hdGlvbnMgc3VjaCBhcyBmaWx0ZXIgYW5kIG5ldyBmaWVsZCBjYWxjdWxhdGlvbi5cbiAgICovXG4gIHRyYW5zZm9ybT86IFRyYW5zZm9ybVtdO1xufTtcblxuZXhwb3J0IHR5cGUgRGF0YU1peGlucyA9IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZXNjcmliaW5nIHRoZSBkYXRhIHNvdXJjZVxuICAgKi9cbiAgZGF0YTogRGF0YTtcbn07XG5cblxuLy8gVE9ETyhodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI1MDMpOiBNYWtlIHRoaXMgZ2VuZXJpYyBzbyB3ZSBjYW4gc3VwcG9ydCBzb21lIGZvcm0gb2YgdG9wLWRvd24gc2l6aW5nLlxuZXhwb3J0IGludGVyZmFjZSBMYXlvdXRTaXplTWl4aW5zIHtcbiAgLyoqXG4gICAqIFRoZSB3aWR0aCBvZiBhIHZpc3VhbGl6YXRpb24uXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBUaGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSB0aGUgZm9sbG93aW5nIHJ1bGVzOlxuICAgKlxuICAgKiAtIElmIGEgdmlldydzIFtgYXV0b3NpemVgXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NpemUuaHRtbCNhdXRvc2l6ZSkgdHlwZSBpcyBgXCJmaXRcImAgb3IgaXRzIHgtY2hhbm5lbCBoYXMgYSBbY29udGludW91cyBzY2FsZV0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zY2FsZS5odG1sI2NvbnRpbnVvdXMpLCB0aGUgd2lkdGggd2lsbCBiZSB0aGUgdmFsdWUgb2YgW2Bjb25maWcudmlldy53aWR0aGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3BlYy5odG1sI2NvbmZpZykuXG4gICAqIC0gRm9yIHgtYXhpcyB3aXRoIGEgYmFuZCBvciBwb2ludCBzY2FsZTogaWYgW2ByYW5nZVN0ZXBgXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NjYWxlLmh0bWwjYmFuZCkgaXMgYSBudW1lcmljIHZhbHVlIG9yIHVuc3BlY2lmaWVkLCB0aGUgd2lkdGggaXMgW2RldGVybWluZWQgYnkgdGhlIHJhbmdlIHN0ZXAsIHBhZGRpbmdzLCBhbmQgdGhlIGNhcmRpbmFsaXR5IG9mIHRoZSBmaWVsZCBtYXBwZWQgdG8geC1jaGFubmVsXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NjYWxlLmh0bWwjYmFuZCkuICAgT3RoZXJ3aXNlLCBpZiB0aGUgYHJhbmdlU3RlcGAgaXMgYG51bGxgLCB0aGUgd2lkdGggd2lsbCBiZSB0aGUgdmFsdWUgb2YgW2Bjb25maWcudmlldy53aWR0aGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3BlYy5odG1sI2NvbmZpZykuXG4gICAqIC0gSWYgbm8gZmllbGQgaXMgbWFwcGVkIHRvIGB4YCBjaGFubmVsLCB0aGUgYHdpZHRoYCB3aWxsIGJlIHRoZSB2YWx1ZSBvZiBbYGNvbmZpZy5zY2FsZS50ZXh0WFJhbmdlU3RlcGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2l6ZS5odG1sI2RlZmF1bHQtd2lkdGgtYW5kLWhlaWdodCkgZm9yIGB0ZXh0YCBtYXJrIGFuZCB0aGUgdmFsdWUgb2YgYHJhbmdlU3RlcGAgZm9yIG90aGVyIG1hcmtzLlxuICAgKlxuICAgKiBfX05vdGU6X18gRm9yIHBsb3RzIHdpdGggW2Byb3dgIGFuZCBgY29sdW1uYCBjaGFubmVsc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9lbmNvZGluZy5odG1sI2ZhY2V0KSwgdGhpcyByZXByZXNlbnRzIHRoZSB3aWR0aCBvZiBhIHNpbmdsZSB2aWV3LlxuICAgKlxuICAgKiBfX1NlZSBhbHNvOl9fIFRoZSBkb2N1bWVudGF0aW9uIGZvciBbd2lkdGggYW5kIGhlaWdodF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zaXplLmh0bWwpIGNvbnRhaW5zIG1vcmUgZXhhbXBsZXMuXG4gICAqL1xuICB3aWR0aD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGhlaWdodCBvZiBhIHZpc3VhbGl6YXRpb24uXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfX1xuICAgKiAtIElmIGEgdmlldydzIFtgYXV0b3NpemVgXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NpemUuaHRtbCNhdXRvc2l6ZSkgdHlwZSBpcyBgXCJmaXRcImAgb3IgaXRzIHktY2hhbm5lbCBoYXMgYSBbY29udGludW91cyBzY2FsZV0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zY2FsZS5odG1sI2NvbnRpbnVvdXMpLCB0aGUgaGVpZ2h0IHdpbGwgYmUgdGhlIHZhbHVlIG9mIFtgY29uZmlnLnZpZXcuaGVpZ2h0YF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zcGVjLmh0bWwjY29uZmlnKS5cbiAgICogLSBGb3IgeS1heGlzIHdpdGggYSBiYW5kIG9yIHBvaW50IHNjYWxlOiBpZiBbYHJhbmdlU3RlcGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2NhbGUuaHRtbCNiYW5kKSBpcyBhIG51bWVyaWMgdmFsdWUgb3IgdW5zcGVjaWZpZWQsIHRoZSBoZWlnaHQgaXMgW2RldGVybWluZWQgYnkgdGhlIHJhbmdlIHN0ZXAsIHBhZGRpbmdzLCBhbmQgdGhlIGNhcmRpbmFsaXR5IG9mIHRoZSBmaWVsZCBtYXBwZWQgdG8geS1jaGFubmVsXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NjYWxlLmh0bWwjYmFuZCkuIE90aGVyd2lzZSwgaWYgdGhlIGByYW5nZVN0ZXBgIGlzIGBudWxsYCwgdGhlIGhlaWdodCB3aWxsIGJlIHRoZSB2YWx1ZSBvZiBbYGNvbmZpZy52aWV3LmhlaWdodGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3BlYy5odG1sI2NvbmZpZykuXG4gICAqIC0gSWYgbm8gZmllbGQgaXMgbWFwcGVkIHRvIGB5YCBjaGFubmVsLCB0aGUgYGhlaWdodGAgd2lsbCBiZSB0aGUgdmFsdWUgb2YgYHJhbmdlU3RlcGAuXG4gICAqXG4gICAqIF9fTm90ZV9fOiBGb3IgcGxvdHMgd2l0aCBbYHJvd2AgYW5kIGBjb2x1bW5gIGNoYW5uZWxzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2VuY29kaW5nLmh0bWwjZmFjZXQpLCB0aGlzIHJlcHJlc2VudHMgdGhlIGhlaWdodCBvZiBhIHNpbmdsZSB2aWV3LlxuICAgKlxuICAgKiBfX1NlZSBhbHNvOl9fIFRoZSBkb2N1bWVudGF0aW9uIGZvciBbd2lkdGggYW5kIGhlaWdodF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zaXplLmh0bWwpIGNvbnRhaW5zIG1vcmUgZXhhbXBsZXMuXG4gICAqL1xuICBoZWlnaHQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY1VuaXRTcGVjPEUgZXh0ZW5kcyBFbmNvZGluZzxhbnk+LCBNPiBleHRlbmRzIEJhc2VTcGVjLCBMYXlvdXRTaXplTWl4aW5zIHtcblxuICAvKipcbiAgICogQSBzdHJpbmcgZGVzY3JpYmluZyB0aGUgbWFyayB0eXBlIChvbmUgb2YgYFwiYmFyXCJgLCBgXCJjaXJjbGVcImAsIGBcInNxdWFyZVwiYCwgYFwidGlja1wiYCwgYFwibGluZVwiYCxcbiAgICogYFwiYXJlYVwiYCwgYFwicG9pbnRcImAsIGBcInJ1bGVcImAsIGBcImdlb3NoYXBlXCJgLCBhbmQgYFwidGV4dFwiYCkgb3IgYSBbbWFyayBkZWZpbml0aW9uIG9iamVjdF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9tYXJrLmh0bWwjbWFyay1kZWYpLlxuICAgKi9cbiAgbWFyazogTTtcblxuICAvKipcbiAgICogQSBrZXktdmFsdWUgbWFwcGluZyBiZXR3ZWVuIGVuY29kaW5nIGNoYW5uZWxzIGFuZCBkZWZpbml0aW9uIG9mIGZpZWxkcy5cbiAgICovXG4gIGVuY29kaW5nPzogRTtcblxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiBnZW9ncmFwaGljIHByb2plY3Rpb24sIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byBgc2hhcGVgIHBhdGggZm9yIGBcImdlb3NoYXBlXCJgIG1hcmtzXG4gICAqIGFuZCB0byBgbGF0aXR1ZGVgIGFuZCBgXCJsb25naXR1ZGVcImAgY2hhbm5lbHMgZm9yIG90aGVyIG1hcmtzLlxuICAgKi9cbiAgcHJvamVjdGlvbj86IFByb2plY3Rpb247XG5cbiAgLyoqXG4gICAqIEEga2V5LXZhbHVlIG1hcHBpbmcgYmV0d2VlbiBzZWxlY3Rpb24gbmFtZXMgYW5kIGRlZmluaXRpb25zLlxuICAgKi9cbiAgc2VsZWN0aW9uPzoge1tuYW1lOiBzdHJpbmddOiBTZWxlY3Rpb25EZWZ9O1xufVxuXG5leHBvcnQgdHlwZSBOb3JtYWxpemVkVW5pdFNwZWMgPSBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nIHwgUmVwZWF0UmVmPiwgTWFyayB8IE1hcmtEZWY+O1xuXG4vKipcbiAqIFVuaXQgc3BlYyB0aGF0IGNhbiBoYXZlIGEgY29tcG9zaXRlIG1hcmsuXG4gKi9cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVVuaXRTcGVjID0gR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZyB8IFJlcGVhdFJlZj4sIEFueU1hcms+O1xuXG4vKipcbiAqIFVuaXQgc3BlYyB0aGF0IGNhbiBoYXZlIGEgY29tcG9zaXRlIG1hcmsgYW5kIHJvdyBvciBjb2x1bW4gY2hhbm5lbHMuXG4gKi9cbmV4cG9ydCB0eXBlIEZhY2V0ZWRDb21wb3NpdGVVbml0U3BlYyA9IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZ1dpdGhGYWNldDxzdHJpbmcgfCBSZXBlYXRSZWY+LCBBbnlNYXJrPjtcblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljTGF5ZXJTcGVjPFUgZXh0ZW5kcyBHZW5lcmljVW5pdFNwZWM8YW55LCBhbnk+PiBleHRlbmRzIEJhc2VTcGVjLCBMYXlvdXRTaXplTWl4aW5zIHtcbiAgLyoqXG4gICAqIExheWVyIG9yIHNpbmdsZSB2aWV3IHNwZWNpZmljYXRpb25zIHRvIGJlIGxheWVyZWQuXG4gICAqXG4gICAqIF9fTm90ZV9fOiBTcGVjaWZpY2F0aW9ucyBpbnNpZGUgYGxheWVyYCBjYW5ub3QgdXNlIGByb3dgIGFuZCBgY29sdW1uYCBjaGFubmVscyBhcyBsYXllcmluZyBmYWNldCBzcGVjaWZpY2F0aW9ucyBpcyBub3QgYWxsb3dlZC5cbiAgICovXG4gIGxheWVyOiAoR2VuZXJpY0xheWVyU3BlYzxVPiB8IFUpW107XG5cbiAgLyoqXG4gICAqIFNjYWxlLCBheGlzLCBhbmQgbGVnZW5kIHJlc29sdXRpb25zIGZvciBsYXllcnMuXG4gICAqL1xuICByZXNvbHZlPzogUmVzb2x2ZTtcbn1cblxuLyoqXG4gKiBMYXllciBTcGVjIHdpdGggZW5jb2RpbmcgYW5kIHByb2plY3Rpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFeHRlbmRlZExheWVyU3BlYyBleHRlbmRzIEdlbmVyaWNMYXllclNwZWM8Q29tcG9zaXRlVW5pdFNwZWM+IHtcbiAgLyoqXG4gICAqIEEgc2hhcmVkIGtleS12YWx1ZSBtYXBwaW5nIGJldHdlZW4gZW5jb2RpbmcgY2hhbm5lbHMgYW5kIGRlZmluaXRpb24gb2YgZmllbGRzIGluIHRoZSB1bmRlcmx5aW5nIGxheWVycy5cbiAgICovXG4gIGVuY29kaW5nPzogRW5jb2Rpbmc8c3RyaW5nIHwgUmVwZWF0UmVmPjtcblxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiB0aGUgZ2VvZ3JhcGhpYyBwcm9qZWN0aW9uIHNoYXJlZCBieSB1bmRlcmx5aW5nIGxheWVycy5cbiAgICovXG4gIHByb2plY3Rpb24/OiBQcm9qZWN0aW9uO1xufVxuXG5leHBvcnQgdHlwZSBOb3JtYWxpemVkTGF5ZXJTcGVjID0gR2VuZXJpY0xheWVyU3BlYzxOb3JtYWxpemVkVW5pdFNwZWM+O1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY0ZhY2V0U3BlYzxcbiAgVSBleHRlbmRzIEdlbmVyaWNVbml0U3BlYzxhbnksIGFueT4sXG4gIEwgZXh0ZW5kcyBHZW5lcmljTGF5ZXJTcGVjPGFueT5cbiAgPiBleHRlbmRzIEJhc2VTcGVjIHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCB0aGF0IGRlc2NyaWJlcyBtYXBwaW5ncyBiZXR3ZWVuIGByb3dgIGFuZCBgY29sdW1uYCBjaGFubmVscyBhbmQgdGhlaXIgZmllbGQgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBmYWNldDogRmFjZXRNYXBwaW5nPHN0cmluZyB8IFJlcGVhdFJlZj47XG5cbiAgLyoqXG4gICAqIEEgc3BlY2lmaWNhdGlvbiBvZiB0aGUgdmlldyB0aGF0IGdldHMgZmFjZXRlZC5cbiAgICovXG4gIHNwZWM6IEwgfCBVO1xuICAvLyBUT0RPOiByZXBsYWNlIHRoaXMgd2l0aCBHZW5lcmljU3BlYzxVPiBvbmNlIHdlIHN1cHBvcnQgYWxsIGNhc2VzO1xuXG4gIC8qKlxuICAgKiBTY2FsZSwgYXhpcywgYW5kIGxlZ2VuZCByZXNvbHV0aW9ucyBmb3IgZmFjZXRzLlxuICAgKi9cbiAgcmVzb2x2ZT86IFJlc29sdmU7XG59XG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRGYWNldFNwZWMgPSBHZW5lcmljRmFjZXRTcGVjPE5vcm1hbGl6ZWRVbml0U3BlYywgTm9ybWFsaXplZExheWVyU3BlYz47XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY1JlcGVhdFNwZWM8XG4gIFUgZXh0ZW5kcyBHZW5lcmljVW5pdFNwZWM8YW55LCBhbnk+LFxuICBMIGV4dGVuZHMgR2VuZXJpY0xheWVyU3BlYzxhbnk+XG4+IGV4dGVuZHMgQmFzZVNwZWMge1xuICAvKipcbiAgICogQW4gb2JqZWN0IHRoYXQgZGVzY3JpYmVzIHdoYXQgZmllbGRzIHNob3VsZCBiZSByZXBlYXRlZCBpbnRvIHZpZXdzIHRoYXQgYXJlIGxhaWQgb3V0IGFzIGEgYHJvd2Agb3IgYGNvbHVtbmAuXG4gICAqL1xuICByZXBlYXQ6IFJlcGVhdDtcblxuICBzcGVjOiBHZW5lcmljU3BlYzxVLCBMPjtcblxuICAvKipcbiAgICogU2NhbGUgYW5kIGxlZ2VuZCByZXNvbHV0aW9ucyBmb3IgcmVwZWF0ZWQgY2hhcnRzLlxuICAgKi9cbiAgcmVzb2x2ZT86IFJlc29sdmU7XG59XG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRSZXBlYXRTcGVjID0gR2VuZXJpY1JlcGVhdFNwZWM8Tm9ybWFsaXplZFVuaXRTcGVjLCBOb3JtYWxpemVkTGF5ZXJTcGVjPjtcblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljVkNvbmNhdFNwZWM8XG4gIFUgZXh0ZW5kcyBHZW5lcmljVW5pdFNwZWM8YW55LCBhbnk+LFxuICBMIGV4dGVuZHMgR2VuZXJpY0xheWVyU3BlYzxhbnk+XG4+IGV4dGVuZHMgQmFzZVNwZWMge1xuICAvKipcbiAgICogQSBsaXN0IG9mIHZpZXdzIHRoYXQgc2hvdWxkIGJlIGNvbmNhdGVuYXRlZCBhbmQgcHV0IGludG8gYSBjb2x1bW4uXG4gICAqL1xuICB2Y29uY2F0OiAoR2VuZXJpY1NwZWM8VSwgTD4pW107XG5cbiAgLyoqXG4gICAqIFNjYWxlLCBheGlzLCBhbmQgbGVnZW5kIHJlc29sdXRpb25zIGZvciB2ZXJ0aWNhbGx5IGNvbmNhdGVuYXRlZCBjaGFydHMuXG4gICAqL1xuICByZXNvbHZlPzogUmVzb2x2ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljSENvbmNhdFNwZWM8XG4gIFUgZXh0ZW5kcyBHZW5lcmljVW5pdFNwZWM8YW55LCBhbnk+LFxuICBMIGV4dGVuZHMgR2VuZXJpY0xheWVyU3BlYzxhbnk+XG4+IGV4dGVuZHMgQmFzZVNwZWMge1xuICAvKipcbiAgICogQSBsaXN0IG9mIHZpZXdzIHRoYXQgc2hvdWxkIGJlIGNvbmNhdGVuYXRlZCBhbmQgcHV0IGludG8gYSByb3cuXG4gICAqL1xuICBoY29uY2F0OiAoR2VuZXJpY1NwZWM8VSwgTD4pW107XG5cbiAgLyoqXG4gICAqIFNjYWxlLCBheGlzLCBhbmQgbGVnZW5kIHJlc29sdXRpb25zIGZvciBob3Jpem9udGFsbHkgY29uY2F0ZW5hdGVkIGNoYXJ0cy5cbiAgICovXG4gIHJlc29sdmU/OiBSZXNvbHZlO1xufVxuXG5leHBvcnQgdHlwZSBOb3JtYWxpemVkQ29uY2F0U3BlYyA9XG4gIEdlbmVyaWNWQ29uY2F0U3BlYzxOb3JtYWxpemVkVW5pdFNwZWMsIE5vcm1hbGl6ZWRMYXllclNwZWM+IHwgR2VuZXJpY0hDb25jYXRTcGVjPE5vcm1hbGl6ZWRVbml0U3BlYywgTm9ybWFsaXplZExheWVyU3BlYz47XG5cbmV4cG9ydCB0eXBlIEdlbmVyaWNTcGVjPFxuICBVIGV4dGVuZHMgR2VuZXJpY1VuaXRTcGVjPGFueSwgYW55PixcbiAgTCBleHRlbmRzIEdlbmVyaWNMYXllclNwZWM8YW55PlxuPiA9IFUgfCBMIHwgR2VuZXJpY0ZhY2V0U3BlYzxVLCBMPiB8IEdlbmVyaWNSZXBlYXRTcGVjPFUsIEw+IHxcbiAgR2VuZXJpY1ZDb25jYXRTcGVjPFUsIEw+IHxHZW5lcmljSENvbmNhdFNwZWM8VSwgTD47XG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRTcGVjID0gR2VuZXJpY1NwZWM8Tm9ybWFsaXplZFVuaXRTcGVjLCBOb3JtYWxpemVkTGF5ZXJTcGVjPjtcblxuZXhwb3J0IHR5cGUgVG9wTGV2ZWxGYWNldGVkVW5pdFNwZWMgPSBUb3BMZXZlbDxGYWNldGVkQ29tcG9zaXRlVW5pdFNwZWM+ICYgRGF0YU1peGlucztcbmV4cG9ydCB0eXBlIFRvcExldmVsRmFjZXRTcGVjID0gVG9wTGV2ZWw8R2VuZXJpY0ZhY2V0U3BlYzxDb21wb3NpdGVVbml0U3BlYywgRXh0ZW5kZWRMYXllclNwZWM+PiAmIERhdGFNaXhpbnM7XG5cbmV4cG9ydCB0eXBlIFRvcExldmVsU3BlYyA9IFRvcExldmVsRmFjZXRlZFVuaXRTcGVjIHwgVG9wTGV2ZWxGYWNldFNwZWMgfCBUb3BMZXZlbDxFeHRlbmRlZExheWVyU3BlYz4gfFxuVG9wTGV2ZWw8R2VuZXJpY1JlcGVhdFNwZWM8Q29tcG9zaXRlVW5pdFNwZWMsIEV4dGVuZGVkTGF5ZXJTcGVjPj4gfCBUb3BMZXZlbDxHZW5lcmljVkNvbmNhdFNwZWM8Q29tcG9zaXRlVW5pdFNwZWMsIEV4dGVuZGVkTGF5ZXJTcGVjPj4gfCBUb3BMZXZlbDxHZW5lcmljSENvbmNhdFNwZWM8Q29tcG9zaXRlVW5pdFNwZWMsIEV4dGVuZGVkTGF5ZXJTcGVjPj47XG5cbi8qIEN1c3RvbSB0eXBlIGd1YXJkcyAqL1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZhY2V0U3BlYyhzcGVjOiBCYXNlU3BlYyk6IHNwZWMgaXMgR2VuZXJpY0ZhY2V0U3BlYzxhbnksIGFueT4ge1xuICByZXR1cm4gc3BlY1snZmFjZXQnXSAhPT0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNVbml0U3BlYyhzcGVjOiBCYXNlU3BlYyk6IHNwZWMgaXMgRmFjZXRlZENvbXBvc2l0ZVVuaXRTcGVjIHwgTm9ybWFsaXplZFVuaXRTcGVjIHtcbiAgcmV0dXJuICEhc3BlY1snbWFyayddO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNMYXllclNwZWMoc3BlYzogQmFzZVNwZWMpOiBzcGVjIGlzIEdlbmVyaWNMYXllclNwZWM8YW55PiB7XG4gIHJldHVybiBzcGVjWydsYXllciddICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlcGVhdFNwZWMoc3BlYzogQmFzZVNwZWMpOiBzcGVjIGlzIEdlbmVyaWNSZXBlYXRTcGVjPGFueSwgYW55PiB7XG4gIHJldHVybiBzcGVjWydyZXBlYXQnXSAhPT0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb25jYXRTcGVjKHNwZWM6IEJhc2VTcGVjKTpcbiAgc3BlYyBpcyBHZW5lcmljVkNvbmNhdFNwZWM8YW55LCBhbnk+IHxcbiAgICBHZW5lcmljSENvbmNhdFNwZWM8YW55LCBhbnk+IHtcbiAgcmV0dXJuIGlzVkNvbmNhdFNwZWMoc3BlYykgfHwgaXNIQ29uY2F0U3BlYyhzcGVjKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVkNvbmNhdFNwZWMoc3BlYzogQmFzZVNwZWMpOiBzcGVjIGlzIEdlbmVyaWNWQ29uY2F0U3BlYzxhbnksIGFueT4ge1xuICByZXR1cm4gc3BlY1sndmNvbmNhdCddICE9PSB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0hDb25jYXRTcGVjKHNwZWM6IEJhc2VTcGVjKTogc3BlYyBpcyBHZW5lcmljSENvbmNhdFNwZWM8YW55LCBhbnk+IHtcbiAgcmV0dXJuIHNwZWNbJ2hjb25jYXQnXSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIERlY29tcG9zZSBleHRlbmRlZCB1bml0IHNwZWNzIGludG8gY29tcG9zaXRpb24gb2YgcHVyZSB1bml0IHNwZWNzLlxuICovXG4vLyBUT0RPOiBjb25zaWRlciBtb3ZpbmcgdGhpcyB0byBhbm90aGVyIGZpbGUuICBNYXliZSB2bC5zcGVjLm5vcm1hbGl6ZSBvciB2bC5ub3JtYWxpemVcbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUoc3BlYzogVG9wTGV2ZWxTcGVjIHwgR2VuZXJpY1NwZWM8Q29tcG9zaXRlVW5pdFNwZWMsIEV4dGVuZGVkTGF5ZXJTcGVjPiB8IEZhY2V0ZWRDb21wb3NpdGVVbml0U3BlYywgY29uZmlnOiBDb25maWcpOiBOb3JtYWxpemVkU3BlYyB7XG4gIGlmIChpc0ZhY2V0U3BlYyhzcGVjKSkge1xuICAgIHJldHVybiBub3JtYWxpemVGYWNldChzcGVjLCBjb25maWcpO1xuICB9XG4gIGlmIChpc0xheWVyU3BlYyhzcGVjKSkge1xuICAgIHJldHVybiBub3JtYWxpemVMYXllcihzcGVjLCBjb25maWcpO1xuICB9XG4gIGlmIChpc1JlcGVhdFNwZWMoc3BlYykpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplUmVwZWF0KHNwZWMsIGNvbmZpZyk7XG4gIH1cbiAgaWYgKGlzVkNvbmNhdFNwZWMoc3BlYykpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplVkNvbmNhdChzcGVjLCBjb25maWcpO1xuICB9XG4gIGlmIChpc0hDb25jYXRTcGVjKHNwZWMpKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZUhDb25jYXQoc3BlYywgY29uZmlnKTtcbiAgfVxuICBpZiAoaXNVbml0U3BlYyhzcGVjKSkge1xuICAgIGNvbnN0IGhhc1JvdyA9IGNoYW5uZWxIYXNGaWVsZChzcGVjLmVuY29kaW5nLCBST1cpO1xuICAgIGNvbnN0IGhhc0NvbHVtbiA9IGNoYW5uZWxIYXNGaWVsZChzcGVjLmVuY29kaW5nLCBDT0xVTU4pO1xuXG4gICAgaWYgKGhhc1JvdyB8fCBoYXNDb2x1bW4pIHtcbiAgICAgIHJldHVybiBub3JtYWxpemVGYWNldGVkVW5pdChzcGVjLCBjb25maWcpO1xuICAgIH1cbiAgICByZXR1cm4gbm9ybWFsaXplTm9uRmFjZXRVbml0KHNwZWMsIGNvbmZpZyk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGxvZy5tZXNzYWdlLklOVkFMSURfU1BFQyk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUZhY2V0KHNwZWM6IEdlbmVyaWNGYWNldFNwZWM8Q29tcG9zaXRlVW5pdFNwZWMsIEV4dGVuZGVkTGF5ZXJTcGVjPiwgY29uZmlnOiBDb25maWcpOiBOb3JtYWxpemVkRmFjZXRTcGVjIHtcbiAgY29uc3Qge3NwZWM6IHN1YnNwZWMsIC4uLnJlc3R9ID0gc3BlYztcbiAgcmV0dXJuIHtcbiAgICAuLi5yZXN0LFxuICAgIC8vIFRPRE86IHJlbW92ZSBcImFueVwiIG9uY2Ugd2Ugc3VwcG9ydCBhbGwgZmFjZXQgbGlzdGVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjc2MFxuICAgIHNwZWM6IG5vcm1hbGl6ZShzdWJzcGVjLCBjb25maWcpIGFzIGFueVxuICB9O1xufVxuXG5mdW5jdGlvbiBtZXJnZUVuY29kaW5nKG9wdDoge3BhcmVudEVuY29kaW5nOiBFbmNvZGluZzxhbnk+LCBlbmNvZGluZzogRW5jb2Rpbmc8YW55Pn0pOiBFbmNvZGluZzxhbnk+IHtcbiAgY29uc3Qge3BhcmVudEVuY29kaW5nLCBlbmNvZGluZ30gPSBvcHQ7XG4gIGlmIChwYXJlbnRFbmNvZGluZyAmJiBlbmNvZGluZykge1xuICAgIGNvbnN0IG92ZXJyaWRlbiA9IGtleXMocGFyZW50RW5jb2RpbmcpLnJlZHVjZSgobywga2V5KSA9PiB7XG4gICAgICBpZiAoZW5jb2Rpbmdba2V5XSkge1xuICAgICAgICBvLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvO1xuICAgIH0sIFtdKTtcblxuICAgIGlmIChvdmVycmlkZW4ubGVuZ3RoID4gMCkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZW5jb2RpbmdPdmVycmlkZGVuKG92ZXJyaWRlbikpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG1lcmdlZCA9IHtcbiAgICAuLi4ocGFyZW50RW5jb2RpbmcgfHwge30pLFxuICAgIC4uLihlbmNvZGluZyB8fCB7fSlcbiAgfTtcbiAgcmV0dXJuIGtleXMobWVyZ2VkKS5sZW5ndGggPiAwID8gbWVyZ2VkIDogdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBtZXJnZVByb2plY3Rpb24ob3B0OiB7cGFyZW50UHJvamVjdGlvbjogUHJvamVjdGlvbiwgcHJvamVjdGlvbjogUHJvamVjdGlvbn0pIHtcbiAgY29uc3Qge3BhcmVudFByb2plY3Rpb24sIHByb2plY3Rpb259ID0gb3B0O1xuICBpZiAocGFyZW50UHJvamVjdGlvbiAmJiBwcm9qZWN0aW9uKSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UucHJvamVjdGlvbk92ZXJyaWRkZW4oe3BhcmVudFByb2plY3Rpb24sIHByb2plY3Rpb259KSk7XG4gIH1cbiAgcmV0dXJuIHByb2plY3Rpb24gfHwgcGFyZW50UHJvamVjdGlvbjtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTGF5ZXIoXG4gIHNwZWM6IEV4dGVuZGVkTGF5ZXJTcGVjLFxuICBjb25maWc6IENvbmZpZyxcbiAgcGFyZW50RW5jb2Rpbmc/OiBFbmNvZGluZzxzdHJpbmcgfCBSZXBlYXRSZWY+LFxuICBwYXJlbnRQcm9qZWN0aW9uPzogUHJvamVjdGlvblxuKTogTm9ybWFsaXplZExheWVyU3BlYyB7XG4gIGNvbnN0IHtsYXllciwgZW5jb2RpbmcsIHByb2plY3Rpb24sIC4uLnJlc3R9ID0gc3BlYztcbiAgY29uc3QgbWVyZ2VkRW5jb2RpbmcgPSBtZXJnZUVuY29kaW5nKHtwYXJlbnRFbmNvZGluZywgZW5jb2Rpbmd9KTtcbiAgY29uc3QgbWVyZ2VkUHJvamVjdGlvbiA9IG1lcmdlUHJvamVjdGlvbih7cGFyZW50UHJvamVjdGlvbiwgcHJvamVjdGlvbn0pO1xuICByZXR1cm4ge1xuICAgIC4uLnJlc3QsXG4gICAgbGF5ZXI6IGxheWVyLm1hcCgoc3Vic3BlYykgPT4ge1xuICAgICAgaWYgKGlzTGF5ZXJTcGVjKHN1YnNwZWMpKSB7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVMYXllcihzdWJzcGVjLCBjb25maWcsIG1lcmdlZEVuY29kaW5nLCBtZXJnZWRQcm9qZWN0aW9uKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBub3JtYWxpemVOb25GYWNldFVuaXQoc3Vic3BlYywgY29uZmlnLCBtZXJnZWRFbmNvZGluZywgbWVyZ2VkUHJvamVjdGlvbik7XG4gICAgfSlcbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUmVwZWF0KHNwZWM6IEdlbmVyaWNSZXBlYXRTcGVjPENvbXBvc2l0ZVVuaXRTcGVjLCBFeHRlbmRlZExheWVyU3BlYz4sIGNvbmZpZzogQ29uZmlnKTogTm9ybWFsaXplZFJlcGVhdFNwZWMge1xuICBjb25zdCB7c3BlYzogc3Vic3BlYywgLi4ucmVzdH0gPSBzcGVjO1xuICByZXR1cm4ge1xuICAgIC4uLnJlc3QsXG4gICAgc3BlYzogbm9ybWFsaXplKHN1YnNwZWMsIGNvbmZpZylcbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVkNvbmNhdChzcGVjOiBHZW5lcmljVkNvbmNhdFNwZWM8Q29tcG9zaXRlVW5pdFNwZWMsIEV4dGVuZGVkTGF5ZXJTcGVjPiwgY29uZmlnOiBDb25maWcpOiBOb3JtYWxpemVkQ29uY2F0U3BlYyB7XG4gIGNvbnN0IHt2Y29uY2F0OiB2Y29uY2F0LCAuLi5yZXN0fSA9IHNwZWM7XG4gIHJldHVybiB7XG4gICAgLi4ucmVzdCxcbiAgICB2Y29uY2F0OiB2Y29uY2F0Lm1hcCgoc3Vic3BlYykgPT4gbm9ybWFsaXplKHN1YnNwZWMsIGNvbmZpZykpXG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUhDb25jYXQoc3BlYzogR2VuZXJpY0hDb25jYXRTcGVjPENvbXBvc2l0ZVVuaXRTcGVjLCBFeHRlbmRlZExheWVyU3BlYz4sIGNvbmZpZzogQ29uZmlnKTogTm9ybWFsaXplZENvbmNhdFNwZWMge1xuICBjb25zdCB7aGNvbmNhdDogaGNvbmNhdCwgLi4ucmVzdH0gPSBzcGVjO1xuICByZXR1cm4ge1xuICAgIC4uLnJlc3QsXG4gICAgaGNvbmNhdDogaGNvbmNhdC5tYXAoKHN1YnNwZWMpID0+IG5vcm1hbGl6ZShzdWJzcGVjLCBjb25maWcpKVxuICB9O1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVGYWNldGVkVW5pdChzcGVjOiBGYWNldGVkQ29tcG9zaXRlVW5pdFNwZWMsIGNvbmZpZzogQ29uZmlnKTogTm9ybWFsaXplZEZhY2V0U3BlYyB7XG4gIC8vIE5ldyBlbmNvZGluZyBpbiB0aGUgaW5zaWRlIHNwZWMgc2hvdWxkIG5vdCBjb250YWluIHJvdyAvIGNvbHVtblxuICAvLyBhcyByb3cvY29sdW1uIHNob3VsZCBiZSBtb3ZlZCB0byBmYWNldFxuICBjb25zdCB7cm93OiByb3csIGNvbHVtbjogY29sdW1uLCAuLi5lbmNvZGluZ30gPSBzcGVjLmVuY29kaW5nO1xuXG4gIC8vIE1hcmsgYW5kIGVuY29kaW5nIHNob3VsZCBiZSBtb3ZlZCBpbnRvIHRoZSBpbm5lciBzcGVjXG4gIGNvbnN0IHttYXJrLCB3aWR0aCwgcHJvamVjdGlvbiwgaGVpZ2h0LCBzZWxlY3Rpb24sIGVuY29kaW5nOiBfLCAuLi5vdXRlclNwZWN9ID0gc3BlYztcblxuICByZXR1cm4ge1xuICAgIC4uLm91dGVyU3BlYyxcbiAgICBmYWNldDoge1xuICAgICAgLi4uKHJvdyA/IHtyb3d9IDoge30pLFxuICAgICAgLi4uKGNvbHVtbiA/IHtjb2x1bW59OiB7fSksXG4gICAgfSxcbiAgICBzcGVjOiBub3JtYWxpemVOb25GYWNldFVuaXQoe1xuICAgICAgLi4uKHByb2plY3Rpb24gPyB7cHJvamVjdGlvbn0gOiB7fSksXG4gICAgICBtYXJrLFxuICAgICAgLi4uKHdpZHRoID8ge3dpZHRofSA6IHt9KSxcbiAgICAgIC4uLihoZWlnaHQgPyB7aGVpZ2h0fSA6IHt9KSxcbiAgICAgIGVuY29kaW5nLFxuICAgICAgLi4uKHNlbGVjdGlvbiA/IHtzZWxlY3Rpb259IDoge30pXG4gICAgfSwgY29uZmlnKVxuICB9O1xufVxuXG5mdW5jdGlvbiBpc05vbkZhY2V0VW5pdFNwZWNXaXRoUHJpbWl0aXZlTWFyayhzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8RmllbGQ+LCBBbnlNYXJrPik6XG4gIHNwZWMgaXMgR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgTWFyaz4ge1xuICAgIHJldHVybiBpc1ByaW1pdGl2ZU1hcmsoc3BlYy5tYXJrKTtcbn1cblxuZnVuY3Rpb24gZ2V0UG9pbnRPdmVybGF5KG1hcmtEZWY6IE1hcmtEZWYsIG1hcmtDb25maWc6IExpbmVDb25maWcsIGVuY29kaW5nOiBFbmNvZGluZzxGaWVsZD4pOiBNYXJrQ29uZmlnIHtcbiAgaWYgKG1hcmtEZWYucG9pbnQgPT09ICd0cmFuc3BhcmVudCcpIHtcbiAgICByZXR1cm4ge29wYWNpdHk6IDB9O1xuICB9IGVsc2UgaWYgKG1hcmtEZWYucG9pbnQpIHsgLy8gdHJ1dGh5IDogdHJ1ZSBvciBvYmplY3RcbiAgICByZXR1cm4gaXNPYmplY3QobWFya0RlZi5wb2ludCkgPyBtYXJrRGVmLnBvaW50IDoge307XG4gIH0gZWxzZSBpZiAobWFya0RlZi5wb2ludCAhPT0gdW5kZWZpbmVkKSB7IC8vIGZhbHNlIG9yIG51bGxcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIHsgLy8gdW5kZWZpbmVkIChub3QgZGlzYWJsZWQpXG4gICAgaWYgKG1hcmtDb25maWcucG9pbnQgfHwgZW5jb2Rpbmcuc2hhcGUpIHtcbiAgICAgIC8vIGVuYWJsZSBwb2ludCBvdmVybGF5IGlmIGNvbmZpZ1ttYXJrXS5wb2ludCBpcyB0cnV0aHkgb3IgaWYgZW5jb2Rpbmcuc2hhcGUgaXMgcHJvdmlkZWRcbiAgICAgIHJldHVybiBpc09iamVjdChtYXJrQ29uZmlnLnBvaW50KSA/IG1hcmtDb25maWcucG9pbnQgOiB7fTtcbiAgICB9XG4gICAgLy8gbWFya0RlZi5wb2ludCBpcyBkZWZpbmVkIGFzIGZhbHN5XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TGluZU92ZXJsYXkobWFya0RlZjogTWFya0RlZiwgbWFya0NvbmZpZzogQXJlYUNvbmZpZyk6IE1hcmtDb25maWcge1xuICBpZiAobWFya0RlZi5saW5lKSB7IC8vIHRydWUgb3Igb2JqZWN0XG4gICAgcmV0dXJuIG1hcmtEZWYubGluZSA9PT0gdHJ1ZSA/IHt9IDogbWFya0RlZi5saW5lO1xuICB9IGVsc2UgaWYgKG1hcmtEZWYubGluZSAhPT0gdW5kZWZpbmVkKSB7IC8vIGZhbHNlIG9yIG51bGxcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIHsgLy8gdW5kZWZpbmVkIChub3QgZGlzYWJsZWQpXG4gICAgaWYgKG1hcmtDb25maWcubGluZSkge1xuICAgICAgLy8gZW5hYmxlIGxpbmUgb3ZlcmxheSBpZiBjb25maWdbbWFya10ubGluZSBpcyB0cnV0aHlcbiAgICAgIHJldHVybiBtYXJrQ29uZmlnLmxpbmUgPT09IHRydWUgPyB7fSA6IG1hcmtDb25maWcubGluZTtcbiAgICB9XG4gICAgLy8gbWFya0RlZi5wb2ludCBpcyBkZWZpbmVkIGFzIGZhbHN5XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplTm9uRmFjZXRVbml0KFxuICBzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8RmllbGQ+LCBBbnlNYXJrPiwgY29uZmlnOiBDb25maWcsXG4gIHBhcmVudEVuY29kaW5nPzogRW5jb2Rpbmc8c3RyaW5nIHwgUmVwZWF0UmVmPiwgcGFyZW50UHJvamVjdGlvbj86IFByb2plY3Rpb25cbik6IE5vcm1hbGl6ZWRVbml0U3BlYyB8IE5vcm1hbGl6ZWRMYXllclNwZWMge1xuICBjb25zdCB7ZW5jb2RpbmcsIHByb2plY3Rpb259ID0gc3BlYztcbiAgY29uc3QgbWFyayA9IGlzTWFya0RlZihzcGVjLm1hcmspID8gc3BlYy5tYXJrLnR5cGUgOiBzcGVjLm1hcms7XG5cblxuICAvLyBtZXJnZSBwYXJlbnQgZW5jb2RpbmcgLyBwcm9qZWN0aW9uIGZpcnN0XG4gIGlmIChwYXJlbnRFbmNvZGluZyB8fCBwYXJlbnRQcm9qZWN0aW9uKSB7XG4gICAgY29uc3QgbWVyZ2VkUHJvamVjdGlvbiA9IG1lcmdlUHJvamVjdGlvbih7cGFyZW50UHJvamVjdGlvbiwgcHJvamVjdGlvbn0pO1xuICAgIGNvbnN0IG1lcmdlZEVuY29kaW5nID0gbWVyZ2VFbmNvZGluZyh7cGFyZW50RW5jb2RpbmcsIGVuY29kaW5nfSk7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZU5vbkZhY2V0VW5pdCh7XG4gICAgICAuLi5zcGVjLFxuICAgICAgLi4uKG1lcmdlZFByb2plY3Rpb24gPyB7cHJvamVjdGlvbjogbWVyZ2VkUHJvamVjdGlvbn0gOiB7fSksXG4gICAgICAuLi4obWVyZ2VkRW5jb2RpbmcgPyB7ZW5jb2Rpbmc6IG1lcmdlZEVuY29kaW5nfSA6IHt9KSxcbiAgICB9LCBjb25maWcpO1xuICB9XG5cbiAgaWYgKGlzTm9uRmFjZXRVbml0U3BlY1dpdGhQcmltaXRpdmVNYXJrKHNwZWMpKSB7XG4gICAgLy8gVE9ETzogdGhvcm91Z2hseSB0ZXN0XG4gICAgaWYgKGlzUmFuZ2VkKGVuY29kaW5nKSkge1xuICAgICAgcmV0dXJuIG5vcm1hbGl6ZVJhbmdlZFVuaXQoc3BlYyk7XG4gICAgfVxuXG4gICAgaWYgKG1hcmsgPT09ICdsaW5lJyAmJiAoZW5jb2RpbmcueDIgfHwgZW5jb2RpbmcueTIpKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5saW5lV2l0aFJhbmdlKCEhZW5jb2RpbmcueDIsICEhZW5jb2RpbmcueTIpKTtcblxuICAgICAgcmV0dXJuIG5vcm1hbGl6ZU5vbkZhY2V0VW5pdCh7XG4gICAgICAgIG1hcms6ICdydWxlJyxcbiAgICAgICAgLi4uc3BlY1xuICAgICAgfSwgY29uZmlnLCBwYXJlbnRFbmNvZGluZywgcGFyZW50UHJvamVjdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKGlzUGF0aE1hcmsobWFyaykpIHtcbiAgICAgIHJldHVybiBub3JtYWxpemVQYXRoT3ZlcmxheShzcGVjLCBjb25maWcpO1xuICAgIH1cblxuICAgIHJldHVybiBzcGVjOyAvLyBOb3RoaW5nIHRvIG5vcm1hbGl6ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb21wb3NpdGVNYXJrLm5vcm1hbGl6ZShzcGVjLCBjb25maWcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVJhbmdlZFVuaXQoc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjKSB7XG4gIGNvbnN0IGhhc1ggPSBjaGFubmVsSGFzRmllbGQoc3BlYy5lbmNvZGluZywgWCk7XG4gIGNvbnN0IGhhc1kgPSBjaGFubmVsSGFzRmllbGQoc3BlYy5lbmNvZGluZywgWSk7XG4gIGNvbnN0IGhhc1gyID0gY2hhbm5lbEhhc0ZpZWxkKHNwZWMuZW5jb2RpbmcsIFgyKTtcbiAgY29uc3QgaGFzWTIgPSBjaGFubmVsSGFzRmllbGQoc3BlYy5lbmNvZGluZywgWTIpO1xuICBpZiAoKGhhc1gyICYmICFoYXNYKSB8fCAoaGFzWTIgJiYgIWhhc1kpKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZFNwZWMgPSBkdXBsaWNhdGUoc3BlYyk7XG4gICAgaWYgKGhhc1gyICYmICFoYXNYKSB7XG4gICAgICBub3JtYWxpemVkU3BlYy5lbmNvZGluZy54ID0gbm9ybWFsaXplZFNwZWMuZW5jb2RpbmcueDI7XG4gICAgICBkZWxldGUgbm9ybWFsaXplZFNwZWMuZW5jb2RpbmcueDI7XG4gICAgfVxuICAgIGlmIChoYXNZMiAmJiAhaGFzWSkge1xuICAgICAgbm9ybWFsaXplZFNwZWMuZW5jb2RpbmcueSA9IG5vcm1hbGl6ZWRTcGVjLmVuY29kaW5nLnkyO1xuICAgICAgZGVsZXRlIG5vcm1hbGl6ZWRTcGVjLmVuY29kaW5nLnkyO1xuICAgIH1cblxuICAgIHJldHVybiBub3JtYWxpemVkU3BlYztcbiAgfVxuICByZXR1cm4gc3BlYztcbn1cblxuZnVuY3Rpb24gZHJvcExpbmVBbmRQb2ludChtYXJrRGVmOiBNYXJrRGVmKTogTWFya0RlZiB8IE1hcmsge1xuICBjb25zdCB7cG9pbnQ6IF9wb2ludCwgbGluZTogX2xpbmUsIC4uLm1hcmt9ID0gbWFya0RlZjtcblxuICByZXR1cm4ga2V5cyhtYXJrKS5sZW5ndGggPiAxID8gbWFyayA6IG1hcmsudHlwZTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUGF0aE92ZXJsYXkoc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjLCBjb25maWc6IENvbmZpZyA9IHt9KTogTm9ybWFsaXplZExheWVyU3BlYyB8IE5vcm1hbGl6ZWRVbml0U3BlYyB7XG5cbiAgLy8gXyBpcyB1c2VkIHRvIGRlbm90ZSBhIGRyb3BwZWQgcHJvcGVydHkgb2YgdGhlIHVuaXQgc3BlY1xuICAvLyB3aGljaCBzaG91bGQgbm90IGJlIGNhcnJpZWQgb3ZlciB0byB0aGUgbGF5ZXIgc3BlY1xuICBjb25zdCB7c2VsZWN0aW9uLCBwcm9qZWN0aW9uLCBlbmNvZGluZywgbWFyaywgLi4ub3V0ZXJTcGVjfSA9IHNwZWM7XG4gIGNvbnN0IG1hcmtEZWYgPSBpc01hcmtEZWYobWFyaykgPyBtYXJrIDoge3R5cGU6IG1hcmt9O1xuXG4gIGNvbnN0IHBvaW50T3ZlcmxheSA9IGdldFBvaW50T3ZlcmxheShtYXJrRGVmLCBjb25maWdbbWFya0RlZi50eXBlXSwgZW5jb2RpbmcpO1xuICBjb25zdCBsaW5lT3ZlcmxheSA9IG1hcmtEZWYudHlwZSA9PT0gJ2FyZWEnICYmIGdldExpbmVPdmVybGF5KG1hcmtEZWYsIGNvbmZpZ1ttYXJrRGVmLnR5cGVdKTtcblxuICBpZiAoIXBvaW50T3ZlcmxheSAmJiAhbGluZU92ZXJsYXkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3BlYyxcbiAgICAgIC8vIERvIG5vdCBpbmNsdWRlIHBvaW50IC8gbGluZSBvdmVybGF5IGluIHRoZSBub3JtYWxpemUgc3BlY1xuICAgICAgbWFyazogZHJvcExpbmVBbmRQb2ludChtYXJrRGVmKVxuICAgIH07XG4gIH1cblxuICBjb25zdCBsYXllcjogTm9ybWFsaXplZFVuaXRTcGVjW10gPSBbe1xuICAgIC4uLihzZWxlY3Rpb24gPyB7c2VsZWN0aW9ufSA6IHt9KSxcbiAgICAvLyBEbyBub3QgaW5jbHVkZSBwb2ludCAvIGxpbmUgb3ZlcmxheSBpbiB0aGUgbm9ybWFsaXplIHNwZWNcbiAgICBtYXJrOiBkcm9wTGluZUFuZFBvaW50KHtcbiAgICAgIC4uLm1hcmtEZWYsXG4gICAgICAvLyBtYWtlIGFyZWEgbWFyayB0cmFuc2x1Y2VudCBieSBkZWZhdWx0XG4gICAgICAvLyBUT0RPOiBleHRyYWN0IHRoaXMgMC43IHRvIGJlIHNoYXJlZCB3aXRoIGRlZmF1bHQgb3BhY2l0eSBmb3IgcG9pbnQvdGljay8uLi5cbiAgICAgIC4uLihtYXJrRGVmLnR5cGUgPT09ICdhcmVhJyA/IHtvcGFjaXR5OiAwLjd9IDoge30pLFxuICAgIH0pLFxuICAgIC8vIGRyb3Agc2hhcGUgZnJvbSBlbmNvZGluZyBhcyB0aGlzIG1pZ2h0IGJlIHVzZWQgdG8gdHJpZ2dlciBwb2ludCBvdmVybGF5XG4gICAgZW5jb2Rpbmc6IG9taXQoZW5jb2RpbmcsIFsnc2hhcGUnXSlcbiAgfV07XG5cbiAgLy8gRklYTUU6IGRpc2FibGUgdG9vbHRpcCBmb3IgdGhlIGxpbmUgbGF5ZXIgaWYgdG9vbHRpcCBpcyBub3QgZ3JvdXAtYnkgZmllbGQuXG4gIC8vIEZJWE1FOiBkZXRlcm1pbmUgcnVsZXMgZm9yIGFwcGx5aW5nIHNlbGVjdGlvbnMuXG5cbiAgLy8gTmVlZCB0byBjb3B5IHN0YWNrIGNvbmZpZyB0byBvdmVybGF5ZWQgbGF5ZXJcbiAgY29uc3Qgc3RhY2tQcm9wcyA9IHN0YWNrKG1hcmtEZWYsIGVuY29kaW5nLCBjb25maWcgPyBjb25maWcuc3RhY2sgOiB1bmRlZmluZWQpO1xuXG4gIGxldCBvdmVybGF5RW5jb2RpbmcgPSBlbmNvZGluZztcbiAgaWYgKHN0YWNrUHJvcHMpIHtcbiAgICBjb25zdCB7ZmllbGRDaGFubmVsOiBzdGFja0ZpZWxkQ2hhbm5lbCwgb2Zmc2V0fSA9IHN0YWNrUHJvcHM7XG4gICAgb3ZlcmxheUVuY29kaW5nID0ge1xuICAgICAgLi4uZW5jb2RpbmcsXG4gICAgICBbc3RhY2tGaWVsZENoYW5uZWxdOiB7XG4gICAgICAgIC4uLmVuY29kaW5nW3N0YWNrRmllbGRDaGFubmVsXSxcbiAgICAgICAgLi4uKG9mZnNldCA/IHtzdGFjazogb2Zmc2V0fSA6IHt9KVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBpZiAobGluZU92ZXJsYXkpIHtcbiAgICBjb25zdCB7aW50ZXJwb2xhdGV9ID0gbWFya0RlZjtcbiAgICBsYXllci5wdXNoKHtcbiAgICAgIC4uLihwcm9qZWN0aW9uID8ge3Byb2plY3Rpb259IDoge30pLFxuICAgICAgbWFyazoge1xuICAgICAgICB0eXBlOiAnbGluZScsXG4gICAgICAgIC4uLmxpbmVPdmVybGF5LFxuICAgICAgICAuLi4oaW50ZXJwb2xhdGUgPyB7aW50ZXJwb2xhdGV9IDoge30pXG4gICAgICB9LFxuICAgICAgZW5jb2Rpbmc6IG92ZXJsYXlFbmNvZGluZ1xuICAgIH0pO1xuICB9XG4gIGlmIChwb2ludE92ZXJsYXkpIHtcbiAgICBsYXllci5wdXNoKHtcbiAgICAgIC4uLihwcm9qZWN0aW9uID8ge3Byb2plY3Rpb259IDoge30pLFxuICAgICAgbWFyazoge1xuICAgICAgICB0eXBlOiAncG9pbnQnLFxuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICBmaWxsZWQ6IHRydWUsXG4gICAgICAgIC4uLnBvaW50T3ZlcmxheVxuICAgICAgfSxcbiAgICAgIGVuY29kaW5nOiBvdmVybGF5RW5jb2RpbmdcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub3V0ZXJTcGVjLFxuICAgIGxheWVyXG4gIH07XG59XG5cbi8vIFRPRE86IGFkZCB2bC5zcGVjLnZhbGlkYXRlICYgbW92ZSBzdHVmZiBmcm9tIHZsLnZhbGlkYXRlIHRvIGhlcmVcblxuLyogQWNjdW11bGF0ZSBub24tZHVwbGljYXRlIGZpZWxkRGVmcyBpbiBhIGRpY3Rpb25hcnkgKi9cbmZ1bmN0aW9uIGFjY3VtdWxhdGUoZGljdDogYW55LCBkZWZzOiBGaWVsZERlZjxGaWVsZD5bXSk6IGFueSB7XG4gIGRlZnMuZm9yRWFjaChmdW5jdGlvbihmaWVsZERlZikge1xuICAgIC8vIENvbnNpZGVyIG9ubHkgcHVyZSBmaWVsZERlZiBwcm9wZXJ0aWVzIChpZ25vcmluZyBzY2FsZSwgYXhpcywgbGVnZW5kKVxuICAgIGNvbnN0IHB1cmVGaWVsZERlZiA9IFsnZmllbGQnLCAndHlwZScsICd2YWx1ZScsICd0aW1lVW5pdCcsICdiaW4nLCAnYWdncmVnYXRlJ10ucmVkdWNlKChmLCBrZXkpID0+IHtcbiAgICAgIGlmIChmaWVsZERlZltrZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZltrZXldID0gZmllbGREZWZba2V5XTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmO1xuICAgIH0sIHt9KTtcbiAgICBjb25zdCBrZXkgPSBoYXNoKHB1cmVGaWVsZERlZik7XG4gICAgZGljdFtrZXldID0gZGljdFtrZXldIHx8IGZpZWxkRGVmO1xuICB9KTtcbiAgcmV0dXJuIGRpY3Q7XG59XG5cbi8qIFJlY3Vyc2l2ZWx5IGdldCBmaWVsZERlZnMgZnJvbSBhIHNwZWMsIHJldHVybnMgYSBkaWN0aW9uYXJ5IG9mIGZpZWxkRGVmcyAqL1xuZnVuY3Rpb24gZmllbGREZWZJbmRleDxUPihzcGVjOiBHZW5lcmljU3BlYzxhbnksIGFueT4sIGRpY3Q6IERpY3Q8RmllbGREZWY8VD4+ID0ge30pOiBEaWN0PEZpZWxkRGVmPFQ+PiB7XG4gIC8vIEZJWE1FKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjIwNyk6IFN1cHBvcnQgZmllbGREZWZJbmRleCBmb3IgcmVwZWF0XG4gIGlmIChpc0xheWVyU3BlYyhzcGVjKSkge1xuICAgIHNwZWMubGF5ZXIuZm9yRWFjaChsYXllciA9PiB7XG4gICAgICBpZiAoaXNVbml0U3BlYyhsYXllcikpIHtcbiAgICAgICAgYWNjdW11bGF0ZShkaWN0LCB2bEVuY29kaW5nLmZpZWxkRGVmcyhsYXllci5lbmNvZGluZykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmllbGREZWZJbmRleChsYXllciwgZGljdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoaXNGYWNldFNwZWMoc3BlYykpIHtcbiAgICBhY2N1bXVsYXRlKGRpY3QsIHZsRW5jb2RpbmcuZmllbGREZWZzKHNwZWMuZmFjZXQpKTtcbiAgICBmaWVsZERlZkluZGV4KHNwZWMuc3BlYywgZGljdCk7XG4gIH0gZWxzZSBpZiAoaXNSZXBlYXRTcGVjKHNwZWMpKSB7XG4gICAgZmllbGREZWZJbmRleChzcGVjLnNwZWMsIGRpY3QpO1xuICB9IGVsc2UgaWYgKGlzQ29uY2F0U3BlYyhzcGVjKSkge1xuICAgIGNvbnN0IGNoaWxkU3BlYyA9IGlzVkNvbmNhdFNwZWMoc3BlYykgPyBzcGVjLnZjb25jYXQgOiBzcGVjLmhjb25jYXQ7XG4gICAgY2hpbGRTcGVjLmZvckVhY2goY2hpbGQgPT4gZmllbGREZWZJbmRleChjaGlsZCwgZGljdCkpO1xuICB9IGVsc2UgeyAvLyBVbml0IFNwZWNcbiAgICBhY2N1bXVsYXRlKGRpY3QsIHZsRW5jb2RpbmcuZmllbGREZWZzKHNwZWMuZW5jb2RpbmcpKTtcbiAgfVxuICByZXR1cm4gZGljdDtcbn1cblxuLyogUmV0dXJucyBhbGwgbm9uLWR1cGxpY2F0ZSBmaWVsZERlZnMgaW4gYSBzcGVjIGluIGEgZmxhdCBhcnJheSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkRGVmcyhzcGVjOiBHZW5lcmljU3BlYzxhbnksIGFueT4pOiBGaWVsZERlZjxhbnk+W10ge1xuICByZXR1cm4gdmFscyhmaWVsZERlZkluZGV4KHNwZWMpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RhY2tlZChzcGVjOiBUb3BMZXZlbDxGYWNldGVkQ29tcG9zaXRlVW5pdFNwZWM+LCBjb25maWc/OiBDb25maWcpOiBib29sZWFuIHtcbiAgY29uZmlnID0gY29uZmlnIHx8IHNwZWMuY29uZmlnO1xuICBpZiAoaXNQcmltaXRpdmVNYXJrKHNwZWMubWFyaykpIHtcbiAgICByZXR1cm4gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLFxuICAgICAgICAgICAgY29uZmlnID8gY29uZmlnLnN0YWNrIDogdW5kZWZpbmVkXG4gICAgICAgICAgKSAhPT0gbnVsbDtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iXX0=