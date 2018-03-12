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
Object.defineProperty(exports, "__esModule", { value: true });
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
    var subspec = spec.spec, rest = __rest(spec, ["spec"]);
    return __assign({}, rest, { 
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
    var merged = __assign({}, (parentEncoding || {}), (encoding || {}));
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
    var layer = spec.layer, encoding = spec.encoding, projection = spec.projection, rest = __rest(spec, ["layer", "encoding", "projection"]);
    var mergedEncoding = mergeEncoding({ parentEncoding: parentEncoding, encoding: encoding });
    var mergedProjection = mergeProjection({ parentProjection: parentProjection, projection: projection });
    return __assign({}, rest, { layer: layer.map(function (subspec) {
            if (isLayerSpec(subspec)) {
                return normalizeLayer(subspec, config, mergedEncoding, mergedProjection);
            }
            return normalizeNonFacetUnit(subspec, config, mergedEncoding, mergedProjection);
        }) });
}
function normalizeRepeat(spec, config) {
    var subspec = spec.spec, rest = __rest(spec, ["spec"]);
    return __assign({}, rest, { spec: normalize(subspec, config) });
}
function normalizeVConcat(spec, config) {
    var vconcat = spec.vconcat, rest = __rest(spec, ["vconcat"]);
    return __assign({}, rest, { vconcat: vconcat.map(function (subspec) { return normalize(subspec, config); }) });
}
function normalizeHConcat(spec, config) {
    var hconcat = spec.hconcat, rest = __rest(spec, ["hconcat"]);
    return __assign({}, rest, { hconcat: hconcat.map(function (subspec) { return normalize(subspec, config); }) });
}
function normalizeFacetedUnit(spec, config) {
    // New encoding in the inside spec should not contain row / column
    // as row/column should be moved to facet
    var _a = spec.encoding, row = _a.row, column = _a.column, encoding = __rest(_a, ["row", "column"]);
    // Mark and encoding should be moved into the inner spec
    var mark = spec.mark, width = spec.width, projection = spec.projection, height = spec.height, selection = spec.selection, _ = spec.encoding, outerSpec = __rest(spec, ["mark", "width", "projection", "height", "selection", "encoding"]);
    return __assign({}, outerSpec, { facet: __assign({}, (row ? { row: row } : {}), (column ? { column: column } : {})), spec: normalizeNonFacetUnit(__assign({}, (projection ? { projection: projection } : {}), { mark: mark }, (width ? { width: width } : {}), (height ? { height: height } : {}), { encoding: encoding }, (selection ? { selection: selection } : {})), config) });
}
function isNonFacetUnitSpecWithPrimitiveMark(spec) {
    return mark_1.isPrimitiveMark(spec.mark);
}
function normalizeNonFacetUnit(spec, config, parentEncoding, parentProjection) {
    var encoding = spec.encoding, projection = spec.projection;
    // merge parent encoding / projection first
    if (parentEncoding || parentProjection) {
        var mergedProjection = mergeProjection({ parentProjection: parentProjection, projection: projection });
        var mergedEncoding = mergeEncoding({ parentEncoding: parentEncoding, encoding: encoding });
        return normalizeNonFacetUnit(__assign({}, spec, (mergedProjection ? { projection: mergedProjection } : {}), (mergedEncoding ? { encoding: mergedEncoding } : {})), config);
    }
    if (isNonFacetUnitSpecWithPrimitiveMark(spec)) {
        // TODO: thoroughly test
        if (encoding_1.isRanged(encoding)) {
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
    // _ is used to denote a dropped property of the unit spec
    // which should not be carried over to the layer spec
    var mark = spec.mark, selection = spec.selection, projection = spec.projection, encoding = spec.encoding, outerSpec = __rest(spec, ["mark", "selection", "projection", "encoding"]);
    var layer = [{ mark: mark, encoding: encoding }];
    // Need to copy stack config to overlayed layer
    var stackProps = stack_1.stack(mark, encoding, config ? config.stack : undefined);
    var overlayEncoding = encoding;
    if (stackProps) {
        var stackFieldChannel = stackProps.fieldChannel, offset = stackProps.offset;
        overlayEncoding = __assign({}, encoding, (_a = {}, _a[stackFieldChannel] = __assign({}, encoding[stackFieldChannel], (offset ? { stack: offset } : {})), _a));
    }
    if (overlayWithLine) {
        layer.push(__assign({}, (projection ? { projection: projection } : {}), { mark: {
                type: 'line',
                style: 'lineOverlay'
            } }, (selection ? { selection: selection } : {}), { encoding: overlayEncoding }));
    }
    if (overlayWithPoint) {
        layer.push(__assign({}, (projection ? { projection: projection } : {}), { mark: {
                type: 'point',
                filled: true,
                style: 'pointOverlay'
            } }, (selection ? { selection: selection } : {}), { encoding: overlayEncoding }));
    }
    return __assign({}, outerSpec, { layer: layer });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBb0Q7QUFDcEQsK0NBQWlEO0FBR2pELHVDQUFrRjtBQUNsRix1Q0FBeUM7QUFHekMsMkJBQTZCO0FBQzdCLCtCQUEyRTtBQUszRSxpQ0FBOEI7QUFJOUIsK0JBQW1FO0FBb1BuRSx3QkFBd0I7QUFHeEIscUJBQTRCLElBQWM7SUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDckMsQ0FBQztBQUZELGtDQUVDO0FBRUQsb0JBQTJCLElBQWM7SUFDdkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUZELGdDQUVDO0FBRUQscUJBQTRCLElBQWM7SUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDckMsQ0FBQztBQUZELGtDQUVDO0FBRUQsc0JBQTZCLElBQWM7SUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDdEMsQ0FBQztBQUZELG9DQUVDO0FBRUQsc0JBQTZCLElBQWM7SUFHekMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUpELG9DQUlDO0FBRUQsdUJBQThCLElBQWM7SUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDdkMsQ0FBQztBQUZELHNDQUVDO0FBRUQsdUJBQThCLElBQWM7SUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDdkMsQ0FBQztBQUZELHNDQUVDO0FBRUQ7O0dBRUc7QUFDSCx1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O0lBQ25CLENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVJELDhCQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWDIsIFksIFkyfSBmcm9tICcuL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgY29tcG9zaXRlTWFyayBmcm9tICcuL2NvbXBvc2l0ZW1hcmsnO1xuaW1wb3J0IHtDb25maWcsIE92ZXJsYXlDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7RGF0YX0gZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7Y2hhbm5lbEhhc0ZpZWxkLCBFbmNvZGluZywgRW5jb2RpbmdXaXRoRmFjZXQsIGlzUmFuZ2VkfSBmcm9tICcuL2VuY29kaW5nJztcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZhY2V0TWFwcGluZ30gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0ZpZWxkLCBGaWVsZERlZiwgUmVwZWF0UmVmfSBmcm9tICcuL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuL2xvZyc7XG5pbXBvcnQge0FueU1hcmssIEFSRUEsIGlzUHJpbWl0aXZlTWFyaywgTElORSwgTWFyaywgTWFya0RlZn0gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7UHJvamVjdGlvbn0gZnJvbSAnLi9wcm9qZWN0aW9uJztcbmltcG9ydCB7UmVwZWF0fSBmcm9tICcuL3JlcGVhdCc7XG5pbXBvcnQge1Jlc29sdmV9IGZyb20gJy4vcmVzb2x2ZSc7XG5pbXBvcnQge1NlbGVjdGlvbkRlZn0gZnJvbSAnLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtzdGFja30gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge1RpdGxlUGFyYW1zfSBmcm9tICcuL3RpdGxlJztcbmltcG9ydCB7VG9wTGV2ZWxQcm9wZXJ0aWVzfSBmcm9tICcuL3RvcGxldmVscHJvcHMnO1xuaW1wb3J0IHtUcmFuc2Zvcm19IGZyb20gJy4vdHJhbnNmb3JtJztcbmltcG9ydCB7Y29udGFpbnMsIERpY3QsIGR1cGxpY2F0ZSwgaGFzaCwga2V5cywgdmFsc30gZnJvbSAnLi91dGlsJztcblxuXG5leHBvcnQgdHlwZSBUb3BMZXZlbDxTIGV4dGVuZHMgQmFzZVNwZWM+ID0gUyAmIFRvcExldmVsUHJvcGVydGllcyAmIHtcbiAgLyoqXG4gICAqIFVSTCB0byBbSlNPTiBzY2hlbWFdKGh0dHA6Ly9qc29uLXNjaGVtYS5vcmcvKSBmb3IgYSBWZWdhLUxpdGUgc3BlY2lmaWNhdGlvbi4gVW5sZXNzIHlvdSBoYXZlIGEgcmVhc29uIHRvIGNoYW5nZSB0aGlzLCB1c2UgYGh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uYC4gU2V0dGluZyB0aGUgYCRzY2hlbWFgIHByb3BlcnR5IGFsbG93cyBhdXRvbWF0aWMgdmFsaWRhdGlvbiBhbmQgYXV0b2NvbXBsZXRlIGluIGVkaXRvcnMgdGhhdCBzdXBwb3J0IEpTT04gc2NoZW1hLlxuICAgKiBAZm9ybWF0IHVyaVxuICAgKi9cbiAgJHNjaGVtYT86IHN0cmluZztcblxuICAvKipcbiAgICogVmVnYS1MaXRlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiAgVGhpcyBwcm9wZXJ0eSBjYW4gb25seSBiZSBkZWZpbmVkIGF0IHRoZSB0b3AtbGV2ZWwgb2YgYSBzcGVjaWZpY2F0aW9uLlxuICAgKi9cbiAgY29uZmlnPzogQ29uZmlnO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBCYXNlU3BlYyB7XG4gIC8qKlxuICAgKiBUaXRsZSBmb3IgdGhlIHBsb3QuXG4gICAqL1xuICB0aXRsZT86IHN0cmluZyB8IFRpdGxlUGFyYW1zO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSB2aXN1YWxpemF0aW9uIGZvciBsYXRlciByZWZlcmVuY2UuXG4gICAqL1xuICBuYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZXNjcmlwdGlvbiBvZiB0aGlzIG1hcmsgZm9yIGNvbW1lbnRpbmcgcHVycG9zZS5cbiAgICovXG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVzY3JpYmluZyB0aGUgZGF0YSBzb3VyY2VcbiAgICovXG4gIGRhdGE/OiBEYXRhO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBkYXRhIHRyYW5zZm9ybWF0aW9ucyBzdWNoIGFzIGZpbHRlciBhbmQgbmV3IGZpZWxkIGNhbGN1bGF0aW9uLlxuICAgKi9cbiAgdHJhbnNmb3JtPzogVHJhbnNmb3JtW107XG59XG5cbmV4cG9ydCB0eXBlIERhdGFSZXF1aXJlZCA9IHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZXNjcmliaW5nIHRoZSBkYXRhIHNvdXJjZVxuICAgKi9cbiAgZGF0YTogRGF0YTtcbn07XG5cblxuLy8gVE9ETyhodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI1MDMpOiBNYWtlIHRoaXMgZ2VuZXJpYyBzbyB3ZSBjYW4gc3VwcG9ydCBzb21lIGZvcm0gb2YgdG9wLWRvd24gc2l6aW5nLlxuZXhwb3J0IGludGVyZmFjZSBMYXlvdXRTaXplTWl4aW5zIHtcbiAgLyoqXG4gICAqIFRoZSB3aWR0aCBvZiBhIHZpc3VhbGl6YXRpb24uXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBUaGlzIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSB0aGUgZm9sbG93aW5nIHJ1bGVzOlxuICAgKlxuICAgKiAtIElmIGEgdmlldydzIFtgYXV0b3NpemVgXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NpemUuaHRtbCNhdXRvc2l6ZSkgdHlwZSBpcyBgXCJmaXRcImAgb3IgaXRzIHgtY2hhbm5lbCBoYXMgYSBbY29udGludW91cyBzY2FsZV0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zY2FsZS5odG1sI2NvbnRpbnVvdXMpLCB0aGUgd2lkdGggd2lsbCBiZSB0aGUgdmFsdWUgb2YgW2Bjb25maWcudmlldy53aWR0aGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3BlYy5odG1sI2NvbmZpZykuXG4gICAqIC0gRm9yIHgtYXhpcyB3aXRoIGEgYmFuZCBvciBwb2ludCBzY2FsZTogaWYgW2ByYW5nZVN0ZXBgXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NjYWxlLmh0bWwjYmFuZCkgaXMgYSBudW1lcmljIHZhbHVlIG9yIHVuc3BlY2lmaWVkLCB0aGUgd2lkdGggaXMgW2RldGVybWluZWQgYnkgdGhlIHJhbmdlIHN0ZXAsIHBhZGRpbmdzLCBhbmQgdGhlIGNhcmRpbmFsaXR5IG9mIHRoZSBmaWVsZCBtYXBwZWQgdG8geC1jaGFubmVsXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NjYWxlLmh0bWwjYmFuZCkuICAgT3RoZXJ3aXNlLCBpZiB0aGUgYHJhbmdlU3RlcGAgaXMgYG51bGxgLCB0aGUgd2lkdGggd2lsbCBiZSB0aGUgdmFsdWUgb2YgW2Bjb25maWcudmlldy53aWR0aGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3BlYy5odG1sI2NvbmZpZykuXG4gICAqIC0gSWYgbm8gZmllbGQgaXMgbWFwcGVkIHRvIGB4YCBjaGFubmVsLCB0aGUgYHdpZHRoYCB3aWxsIGJlIHRoZSB2YWx1ZSBvZiBbYGNvbmZpZy5zY2FsZS50ZXh0WFJhbmdlU3RlcGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2l6ZS5odG1sI2RlZmF1bHQtd2lkdGgtYW5kLWhlaWdodCkgZm9yIGB0ZXh0YCBtYXJrIGFuZCB0aGUgdmFsdWUgb2YgYHJhbmdlU3RlcGAgZm9yIG90aGVyIG1hcmtzLlxuICAgKlxuICAgKiBfX05vdGU6X18gRm9yIHBsb3RzIHdpdGggW2Byb3dgIGFuZCBgY29sdW1uYCBjaGFubmVsc10oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9lbmNvZGluZy5odG1sI2ZhY2V0KSwgdGhpcyByZXByZXNlbnRzIHRoZSB3aWR0aCBvZiBhIHNpbmdsZSB2aWV3LlxuICAgKlxuICAgKiBfX1NlZSBhbHNvOl9fIFRoZSBkb2N1bWVudGF0aW9uIGZvciBbd2lkdGggYW5kIGhlaWdodF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zaXplLmh0bWwpIGNvbnRhaW5zIG1vcmUgZXhhbXBsZXMuXG4gICAqL1xuICB3aWR0aD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGhlaWdodCBvZiBhIHZpc3VhbGl6YXRpb24uXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfX1xuICAgKiAtIElmIGEgdmlldydzIFtgYXV0b3NpemVgXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NpemUuaHRtbCNhdXRvc2l6ZSkgdHlwZSBpcyBgXCJmaXRcImAgb3IgaXRzIHktY2hhbm5lbCBoYXMgYSBbY29udGludW91cyBzY2FsZV0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zY2FsZS5odG1sI2NvbnRpbnVvdXMpLCB0aGUgaGVpZ2h0IHdpbGwgYmUgdGhlIHZhbHVlIG9mIFtgY29uZmlnLnZpZXcuaGVpZ2h0YF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zcGVjLmh0bWwjY29uZmlnKS5cbiAgICogLSBGb3IgeS1heGlzIHdpdGggYSBiYW5kIG9yIHBvaW50IHNjYWxlOiBpZiBbYHJhbmdlU3RlcGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc2NhbGUuaHRtbCNiYW5kKSBpcyBhIG51bWVyaWMgdmFsdWUgb3IgdW5zcGVjaWZpZWQsIHRoZSBoZWlnaHQgaXMgW2RldGVybWluZWQgYnkgdGhlIHJhbmdlIHN0ZXAsIHBhZGRpbmdzLCBhbmQgdGhlIGNhcmRpbmFsaXR5IG9mIHRoZSBmaWVsZCBtYXBwZWQgdG8geS1jaGFubmVsXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL3NjYWxlLmh0bWwjYmFuZCkuIE90aGVyd2lzZSwgaWYgdGhlIGByYW5nZVN0ZXBgIGlzIGBudWxsYCwgdGhlIGhlaWdodCB3aWxsIGJlIHRoZSB2YWx1ZSBvZiBbYGNvbmZpZy52aWV3LmhlaWdodGBdKGh0dHBzOi8vdmVnYS5naXRodWIuaW8vdmVnYS1saXRlL2RvY3Mvc3BlYy5odG1sI2NvbmZpZykuXG4gICAqIC0gSWYgbm8gZmllbGQgaXMgbWFwcGVkIHRvIGB5YCBjaGFubmVsLCB0aGUgYGhlaWdodGAgd2lsbCBiZSB0aGUgdmFsdWUgb2YgYHJhbmdlU3RlcGAuXG4gICAqXG4gICAqIF9fTm90ZV9fOiBGb3IgcGxvdHMgd2l0aCBbYHJvd2AgYW5kIGBjb2x1bW5gIGNoYW5uZWxzXShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL2VuY29kaW5nLmh0bWwjZmFjZXQpLCB0aGlzIHJlcHJlc2VudHMgdGhlIGhlaWdodCBvZiBhIHNpbmdsZSB2aWV3LlxuICAgKlxuICAgKiBfX1NlZSBhbHNvOl9fIFRoZSBkb2N1bWVudGF0aW9uIGZvciBbd2lkdGggYW5kIGhlaWdodF0oaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby92ZWdhLWxpdGUvZG9jcy9zaXplLmh0bWwpIGNvbnRhaW5zIG1vcmUgZXhhbXBsZXMuXG4gICAqL1xuICBoZWlnaHQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY1VuaXRTcGVjPEUgZXh0ZW5kcyBFbmNvZGluZzxhbnk+LCBNPiBleHRlbmRzIEJhc2VTcGVjLCBMYXlvdXRTaXplTWl4aW5zIHtcblxuICAvKipcbiAgICogQSBzdHJpbmcgZGVzY3JpYmluZyB0aGUgbWFyayB0eXBlIChvbmUgb2YgYFwiYmFyXCJgLCBgXCJjaXJjbGVcImAsIGBcInNxdWFyZVwiYCwgYFwidGlja1wiYCwgYFwibGluZVwiYCxcbiAgICogKiBgXCJhcmVhXCJgLCBgXCJwb2ludFwiYCwgYFwicnVsZVwiYCwgYFwiZ2Vvc2hhcGVcImAsIGFuZCBgXCJ0ZXh0XCJgKSBvciBhIFttYXJrIGRlZmluaXRpb24gb2JqZWN0XShodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL21hcmsuaHRtbCNtYXJrLWRlZikuXG4gICAqL1xuICBtYXJrOiBNO1xuXG4gIC8qKlxuICAgKiBBIGtleS12YWx1ZSBtYXBwaW5nIGJldHdlZW4gZW5jb2RpbmcgY2hhbm5lbHMgYW5kIGRlZmluaXRpb24gb2YgZmllbGRzLlxuICAgKi9cbiAgZW5jb2Rpbmc/OiBFO1xuXG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBkZWZpbmluZyBwcm9wZXJ0aWVzIG9mIGdlb2dyYXBoaWMgcHJvamVjdGlvbi5cbiAgICpcbiAgICogV29ya3Mgd2l0aCBgXCJnZW9zaGFwZVwiYCBtYXJrcyBhbmQgYFwicG9pbnRcImAgb3IgYFwibGluZVwiYCBtYXJrcyB0aGF0IGhhdmUgYGxhdGl0dWRlYCBhbmQgYFwibG9uZ2l0dWRlXCJgIGNoYW5uZWxzLlxuICAgKi9cbiAgcHJvamVjdGlvbj86IFByb2plY3Rpb247XG5cbiAgLyoqXG4gICAqIEEga2V5LXZhbHVlIG1hcHBpbmcgYmV0d2VlbiBzZWxlY3Rpb24gbmFtZXMgYW5kIGRlZmluaXRpb25zLlxuICAgKi9cbiAgc2VsZWN0aW9uPzoge1tuYW1lOiBzdHJpbmddOiBTZWxlY3Rpb25EZWZ9O1xufVxuXG5leHBvcnQgdHlwZSBOb3JtYWxpemVkVW5pdFNwZWMgPSBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8c3RyaW5nIHwgUmVwZWF0UmVmPiwgTWFyayB8IE1hcmtEZWY+O1xuXG4vKipcbiAqIFVuaXQgc3BlYyB0aGF0IGNhbiBoYXZlIGEgY29tcG9zaXRlIG1hcmsuXG4gKi9cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVVuaXRTcGVjID0gR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPHN0cmluZyB8IFJlcGVhdFJlZj4sIEFueU1hcms+O1xuXG4vKipcbiAqIFVuaXQgc3BlYyB0aGF0IGNhbiBoYXZlIGEgY29tcG9zaXRlIG1hcmsgYW5kIHJvdyBvciBjb2x1bW4gY2hhbm5lbHMuXG4gKi9cbmV4cG9ydCB0eXBlIEZhY2V0ZWRDb21wb3NpdGVVbml0U3BlYyA9IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZ1dpdGhGYWNldDxzdHJpbmcgfCBSZXBlYXRSZWY+LCBBbnlNYXJrPjtcblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljTGF5ZXJTcGVjPFUgZXh0ZW5kcyBHZW5lcmljVW5pdFNwZWM8YW55LCBhbnk+PiBleHRlbmRzIEJhc2VTcGVjLCBMYXlvdXRTaXplTWl4aW5zIHtcbiAgLyoqXG4gICAqIExheWVyIG9yIHNpbmdsZSB2aWV3IHNwZWNpZmljYXRpb25zIHRvIGJlIGxheWVyZWQuXG4gICAqXG4gICAqIF9fTm90ZV9fOiBTcGVjaWZpY2F0aW9ucyBpbnNpZGUgYGxheWVyYCBjYW5ub3QgdXNlIGByb3dgIGFuZCBgY29sdW1uYCBjaGFubmVscyBhcyBsYXllcmluZyBmYWNldCBzcGVjaWZpY2F0aW9ucyBpcyBub3QgYWxsb3dlZC5cbiAgICovXG4gIGxheWVyOiAoR2VuZXJpY0xheWVyU3BlYzxVPiB8IFUpW107XG5cbiAgLyoqXG4gICAqIFNjYWxlLCBheGlzLCBhbmQgbGVnZW5kIHJlc29sdXRpb25zIGZvciBsYXllcnMuXG4gICAqL1xuICByZXNvbHZlPzogUmVzb2x2ZTtcbn1cblxuLyoqXG4gKiBMYXllciBTcGVjIHdpdGggZW5jb2RpbmcgYW5kIHByb2plY3Rpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFeHRlbmRlZExheWVyU3BlYyBleHRlbmRzIEdlbmVyaWNMYXllclNwZWM8Q29tcG9zaXRlVW5pdFNwZWM+IHtcbiAgLyoqXG4gICAqIEEgc2hhcmVkIGtleS12YWx1ZSBtYXBwaW5nIGJldHdlZW4gZW5jb2RpbmcgY2hhbm5lbHMgYW5kIGRlZmluaXRpb24gb2YgZmllbGRzIGluIHRoZSB1bmRlcmx5aW5nIGxheWVycy5cbiAgICovXG4gIGVuY29kaW5nPzogRW5jb2Rpbmc8c3RyaW5nIHwgUmVwZWF0UmVmPjtcblxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgZGVmaW5pbmcgcHJvcGVydGllcyBvZiB0aGUgZ2VvZ3JhcGhpYyBwcm9qZWN0aW9uIHNoYXJlZCBieSB1bmRlcmx5aW5nIGxheWVycy5cbiAgICovXG4gIHByb2plY3Rpb24/OiBQcm9qZWN0aW9uO1xufVxuXG5leHBvcnQgdHlwZSBOb3JtYWxpemVkTGF5ZXJTcGVjID0gR2VuZXJpY0xheWVyU3BlYzxOb3JtYWxpemVkVW5pdFNwZWM+O1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY0ZhY2V0U3BlYzxcbiAgVSBleHRlbmRzIEdlbmVyaWNVbml0U3BlYzxhbnksIGFueT4sXG4gIEwgZXh0ZW5kcyBHZW5lcmljTGF5ZXJTcGVjPGFueT5cbiAgPiBleHRlbmRzIEJhc2VTcGVjIHtcbiAgLyoqXG4gICAqIEFuIG9iamVjdCB0aGF0IGRlc2NyaWJlcyBtYXBwaW5ncyBiZXR3ZWVuIGByb3dgIGFuZCBgY29sdW1uYCBjaGFubmVscyBhbmQgdGhlaXIgZmllbGQgZGVmaW5pdGlvbnMuXG4gICAqL1xuICBmYWNldDogRmFjZXRNYXBwaW5nPHN0cmluZyB8IFJlcGVhdFJlZj47XG5cbiAgLyoqXG4gICAqIEEgc3BlY2lmaWNhdGlvbiBvZiB0aGUgdmlldyB0aGF0IGdldHMgZmFjZXRlZC5cbiAgICovXG4gIHNwZWM6IEwgfCBVO1xuICAvLyBUT0RPOiByZXBsYWNlIHRoaXMgd2l0aCBHZW5lcmljU3BlYzxVPiBvbmNlIHdlIHN1cHBvcnQgYWxsIGNhc2VzO1xuXG4gIC8qKlxuICAgKiBTY2FsZSwgYXhpcywgYW5kIGxlZ2VuZCByZXNvbHV0aW9ucyBmb3IgZmFjZXRzLlxuICAgKi9cbiAgcmVzb2x2ZT86IFJlc29sdmU7XG59XG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRGYWNldFNwZWMgPSBHZW5lcmljRmFjZXRTcGVjPE5vcm1hbGl6ZWRVbml0U3BlYywgTm9ybWFsaXplZExheWVyU3BlYz47XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY1JlcGVhdFNwZWM8XG4gIFUgZXh0ZW5kcyBHZW5lcmljVW5pdFNwZWM8YW55LCBhbnk+LFxuICBMIGV4dGVuZHMgR2VuZXJpY0xheWVyU3BlYzxhbnk+XG4+IGV4dGVuZHMgQmFzZVNwZWMge1xuICAvKipcbiAgICogQW4gb2JqZWN0IHRoYXQgZGVzY3JpYmVzIHdoYXQgZmllbGRzIHNob3VsZCBiZSByZXBlYXRlZCBpbnRvIHZpZXdzIHRoYXQgYXJlIGxhaWQgb3V0IGFzIGEgYHJvd2Agb3IgYGNvbHVtbmAuXG4gICAqL1xuICByZXBlYXQ6IFJlcGVhdDtcblxuICBzcGVjOiBHZW5lcmljU3BlYzxVLCBMPjtcblxuICAvKipcbiAgICogU2NhbGUgYW5kIGxlZ2VuZCByZXNvbHV0aW9ucyBmb3IgcmVwZWF0ZWQgY2hhcnRzLlxuICAgKi9cbiAgcmVzb2x2ZT86IFJlc29sdmU7XG59XG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRSZXBlYXRTcGVjID0gR2VuZXJpY1JlcGVhdFNwZWM8Tm9ybWFsaXplZFVuaXRTcGVjLCBOb3JtYWxpemVkTGF5ZXJTcGVjPjtcblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljVkNvbmNhdFNwZWM8XG4gIFUgZXh0ZW5kcyBHZW5lcmljVW5pdFNwZWM8YW55LCBhbnk+LFxuICBMIGV4dGVuZHMgR2VuZXJpY0xheWVyU3BlYzxhbnk+XG4+IGV4dGVuZHMgQmFzZVNwZWMge1xuICAvKipcbiAgICogQSBsaXN0IG9mIHZpZXdzIHRoYXQgc2hvdWxkIGJlIGNvbmNhdGVuYXRlZCBhbmQgcHV0IGludG8gYSBjb2x1bW4uXG4gICAqL1xuICB2Y29uY2F0OiAoR2VuZXJpY1NwZWM8VSwgTD4pW107XG5cbiAgLyoqXG4gICAqIFNjYWxlLCBheGlzLCBhbmQgbGVnZW5kIHJlc29sdXRpb25zIGZvciB2ZXJ0aWNhbGx5IGNvbmNhdGVuYXRlZCBjaGFydHMuXG4gICAqL1xuICByZXNvbHZlPzogUmVzb2x2ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljSENvbmNhdFNwZWM8XG4gIFUgZXh0ZW5kcyBHZW5lcmljVW5pdFNwZWM8YW55LCBhbnk+LFxuICBMIGV4dGVuZHMgR2VuZXJpY0xheWVyU3BlYzxhbnk+XG4+IGV4dGVuZHMgQmFzZVNwZWMge1xuICAvKipcbiAgICogQSBsaXN0IG9mIHZpZXdzIHRoYXQgc2hvdWxkIGJlIGNvbmNhdGVuYXRlZCBhbmQgcHV0IGludG8gYSByb3cuXG4gICAqL1xuICBoY29uY2F0OiAoR2VuZXJpY1NwZWM8VSwgTD4pW107XG5cbiAgLyoqXG4gICAqIFNjYWxlLCBheGlzLCBhbmQgbGVnZW5kIHJlc29sdXRpb25zIGZvciBob3Jpem9udGFsbHkgY29uY2F0ZW5hdGVkIGNoYXJ0cy5cbiAgICovXG4gIHJlc29sdmU/OiBSZXNvbHZlO1xufVxuXG5leHBvcnQgdHlwZSBOb3JtYWxpemVkQ29uY2F0U3BlYyA9XG4gIEdlbmVyaWNWQ29uY2F0U3BlYzxOb3JtYWxpemVkVW5pdFNwZWMsIE5vcm1hbGl6ZWRMYXllclNwZWM+IHwgR2VuZXJpY0hDb25jYXRTcGVjPE5vcm1hbGl6ZWRVbml0U3BlYywgTm9ybWFsaXplZExheWVyU3BlYz47XG5cbmV4cG9ydCB0eXBlIEdlbmVyaWNTcGVjPFxuICBVIGV4dGVuZHMgR2VuZXJpY1VuaXRTcGVjPGFueSwgYW55PixcbiAgTCBleHRlbmRzIEdlbmVyaWNMYXllclNwZWM8YW55PlxuPiA9IFUgfCBMIHwgR2VuZXJpY0ZhY2V0U3BlYzxVLCBMPiB8IEdlbmVyaWNSZXBlYXRTcGVjPFUsIEw+IHxcbiAgR2VuZXJpY1ZDb25jYXRTcGVjPFUsIEw+IHxHZW5lcmljSENvbmNhdFNwZWM8VSwgTD47XG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRTcGVjID0gR2VuZXJpY1NwZWM8Tm9ybWFsaXplZFVuaXRTcGVjLCBOb3JtYWxpemVkTGF5ZXJTcGVjPjtcblxuZXhwb3J0IHR5cGUgVG9wTGV2ZWxGYWNldGVkVW5pdFNwZWMgPSBUb3BMZXZlbDxGYWNldGVkQ29tcG9zaXRlVW5pdFNwZWM+ICYgRGF0YVJlcXVpcmVkO1xuZXhwb3J0IHR5cGUgVG9wTGV2ZWxGYWNldFNwZWMgPSBUb3BMZXZlbDxHZW5lcmljRmFjZXRTcGVjPENvbXBvc2l0ZVVuaXRTcGVjLCBFeHRlbmRlZExheWVyU3BlYz4+ICYgRGF0YVJlcXVpcmVkO1xuXG5leHBvcnQgdHlwZSBUb3BMZXZlbFNwZWMgPSBUb3BMZXZlbEZhY2V0ZWRVbml0U3BlYyB8IFRvcExldmVsRmFjZXRTcGVjIHwgVG9wTGV2ZWw8RXh0ZW5kZWRMYXllclNwZWM+IHxcblRvcExldmVsPEdlbmVyaWNSZXBlYXRTcGVjPENvbXBvc2l0ZVVuaXRTcGVjLCBFeHRlbmRlZExheWVyU3BlYz4+IHwgVG9wTGV2ZWw8R2VuZXJpY1ZDb25jYXRTcGVjPENvbXBvc2l0ZVVuaXRTcGVjLCBFeHRlbmRlZExheWVyU3BlYz4+IHwgVG9wTGV2ZWw8R2VuZXJpY0hDb25jYXRTcGVjPENvbXBvc2l0ZVVuaXRTcGVjLCBFeHRlbmRlZExheWVyU3BlYz4+O1xuXG4vKiBDdXN0b20gdHlwZSBndWFyZHMgKi9cblxuXG5leHBvcnQgZnVuY3Rpb24gaXNGYWNldFNwZWMoc3BlYzogQmFzZVNwZWMpOiBzcGVjIGlzIEdlbmVyaWNGYWNldFNwZWM8YW55LCBhbnk+IHtcbiAgcmV0dXJuIHNwZWNbJ2ZhY2V0J10gIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVW5pdFNwZWMoc3BlYzogQmFzZVNwZWMpOiBzcGVjIGlzIEZhY2V0ZWRDb21wb3NpdGVVbml0U3BlYyB8IE5vcm1hbGl6ZWRVbml0U3BlYyB7XG4gIHJldHVybiAhIXNwZWNbJ21hcmsnXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTGF5ZXJTcGVjKHNwZWM6IEJhc2VTcGVjKTogc3BlYyBpcyBHZW5lcmljTGF5ZXJTcGVjPGFueT4ge1xuICByZXR1cm4gc3BlY1snbGF5ZXInXSAhPT0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXBlYXRTcGVjKHNwZWM6IEJhc2VTcGVjKTogc3BlYyBpcyBHZW5lcmljUmVwZWF0U3BlYzxhbnksIGFueT4ge1xuICByZXR1cm4gc3BlY1sncmVwZWF0J10gIT09IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29uY2F0U3BlYyhzcGVjOiBCYXNlU3BlYyk6XG4gIHNwZWMgaXMgR2VuZXJpY1ZDb25jYXRTcGVjPGFueSwgYW55PiB8XG4gICAgR2VuZXJpY0hDb25jYXRTcGVjPGFueSwgYW55PiB7XG4gIHJldHVybiBpc1ZDb25jYXRTcGVjKHNwZWMpIHx8IGlzSENvbmNhdFNwZWMoc3BlYyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZDb25jYXRTcGVjKHNwZWM6IEJhc2VTcGVjKTogc3BlYyBpcyBHZW5lcmljVkNvbmNhdFNwZWM8YW55LCBhbnk+IHtcbiAgcmV0dXJuIHNwZWNbJ3Zjb25jYXQnXSAhPT0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNIQ29uY2F0U3BlYyhzcGVjOiBCYXNlU3BlYyk6IHNwZWMgaXMgR2VuZXJpY0hDb25jYXRTcGVjPGFueSwgYW55PiB7XG4gIHJldHVybiBzcGVjWydoY29uY2F0J10gIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBEZWNvbXBvc2UgZXh0ZW5kZWQgdW5pdCBzcGVjcyBpbnRvIGNvbXBvc2l0aW9uIG9mIHB1cmUgdW5pdCBzcGVjcy5cbiAqL1xuLy8gVE9ETzogY29uc2lkZXIgbW92aW5nIHRoaXMgdG8gYW5vdGhlciBmaWxlLiAgTWF5YmUgdmwuc3BlYy5ub3JtYWxpemUgb3Igdmwubm9ybWFsaXplXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKHNwZWM6IFRvcExldmVsU3BlYyB8IEdlbmVyaWNTcGVjPENvbXBvc2l0ZVVuaXRTcGVjLCBFeHRlbmRlZExheWVyU3BlYz4gfCBGYWNldGVkQ29tcG9zaXRlVW5pdFNwZWMsIGNvbmZpZzogQ29uZmlnKTogTm9ybWFsaXplZFNwZWMge1xuICBpZiAoaXNGYWNldFNwZWMoc3BlYykpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplRmFjZXQoc3BlYywgY29uZmlnKTtcbiAgfVxuICBpZiAoaXNMYXllclNwZWMoc3BlYykpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplTGF5ZXIoc3BlYywgY29uZmlnKTtcbiAgfVxuICBpZiAoaXNSZXBlYXRTcGVjKHNwZWMpKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZVJlcGVhdChzcGVjLCBjb25maWcpO1xuICB9XG4gIGlmIChpc1ZDb25jYXRTcGVjKHNwZWMpKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZVZDb25jYXQoc3BlYywgY29uZmlnKTtcbiAgfVxuICBpZiAoaXNIQ29uY2F0U3BlYyhzcGVjKSkge1xuICAgIHJldHVybiBub3JtYWxpemVIQ29uY2F0KHNwZWMsIGNvbmZpZyk7XG4gIH1cbiAgaWYgKGlzVW5pdFNwZWMoc3BlYykpIHtcbiAgICBjb25zdCBoYXNSb3cgPSBjaGFubmVsSGFzRmllbGQoc3BlYy5lbmNvZGluZywgUk9XKTtcbiAgICBjb25zdCBoYXNDb2x1bW4gPSBjaGFubmVsSGFzRmllbGQoc3BlYy5lbmNvZGluZywgQ09MVU1OKTtcblxuICAgIGlmIChoYXNSb3cgfHwgaGFzQ29sdW1uKSB7XG4gICAgICByZXR1cm4gbm9ybWFsaXplRmFjZXRlZFVuaXQoc3BlYywgY29uZmlnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vcm1hbGl6ZU5vbkZhY2V0VW5pdChzcGVjLCBjb25maWcpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5JTlZBTElEX1NQRUMpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVGYWNldChzcGVjOiBHZW5lcmljRmFjZXRTcGVjPENvbXBvc2l0ZVVuaXRTcGVjLCBFeHRlbmRlZExheWVyU3BlYz4sIGNvbmZpZzogQ29uZmlnKTogTm9ybWFsaXplZEZhY2V0U3BlYyB7XG4gIGNvbnN0IHtzcGVjOiBzdWJzcGVjLCAuLi5yZXN0fSA9IHNwZWM7XG4gIHJldHVybiB7XG4gICAgLi4ucmVzdCxcbiAgICAvLyBUT0RPOiByZW1vdmUgXCJhbnlcIiBvbmNlIHdlIHN1cHBvcnQgYWxsIGZhY2V0IGxpc3RlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI3NjBcbiAgICBzcGVjOiBub3JtYWxpemUoc3Vic3BlYywgY29uZmlnKSBhcyBhbnlcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VFbmNvZGluZyhvcHQ6IHtwYXJlbnRFbmNvZGluZzogRW5jb2Rpbmc8YW55PiwgZW5jb2Rpbmc6IEVuY29kaW5nPGFueT59KTogRW5jb2Rpbmc8YW55PiB7XG4gIGNvbnN0IHtwYXJlbnRFbmNvZGluZywgZW5jb2Rpbmd9ID0gb3B0O1xuICBpZiAocGFyZW50RW5jb2RpbmcgJiYgZW5jb2RpbmcpIHtcbiAgICBjb25zdCBvdmVycmlkZW4gPSBrZXlzKHBhcmVudEVuY29kaW5nKS5yZWR1Y2UoKG8sIGtleSkgPT4ge1xuICAgICAgaWYgKGVuY29kaW5nW2tleV0pIHtcbiAgICAgICAgby5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbztcbiAgICB9LCBbXSk7XG5cbiAgICBpZiAob3ZlcnJpZGVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmVuY29kaW5nT3ZlcnJpZGRlbihvdmVycmlkZW4pKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBtZXJnZWQgPSB7XG4gICAgLi4uKHBhcmVudEVuY29kaW5nIHx8IHt9KSxcbiAgICAuLi4oZW5jb2RpbmcgfHwge30pXG4gIH07XG4gIHJldHVybiBrZXlzKG1lcmdlZCkubGVuZ3RoID4gMCA/IG1lcmdlZCA6IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbWVyZ2VQcm9qZWN0aW9uKG9wdDoge3BhcmVudFByb2plY3Rpb246IFByb2plY3Rpb24sIHByb2plY3Rpb246IFByb2plY3Rpb259KSB7XG4gIGNvbnN0IHtwYXJlbnRQcm9qZWN0aW9uLCBwcm9qZWN0aW9ufSA9IG9wdDtcbiAgaWYgKHBhcmVudFByb2plY3Rpb24gJiYgcHJvamVjdGlvbikge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnByb2plY3Rpb25PdmVycmlkZGVuKHtwYXJlbnRQcm9qZWN0aW9uLCBwcm9qZWN0aW9ufSkpO1xuICB9XG4gIHJldHVybiBwcm9qZWN0aW9uIHx8IHBhcmVudFByb2plY3Rpb247XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUxheWVyKFxuICBzcGVjOiBFeHRlbmRlZExheWVyU3BlYyxcbiAgY29uZmlnOiBDb25maWcsXG4gIHBhcmVudEVuY29kaW5nPzogRW5jb2Rpbmc8c3RyaW5nIHwgUmVwZWF0UmVmPixcbiAgcGFyZW50UHJvamVjdGlvbj86IFByb2plY3Rpb25cbik6IE5vcm1hbGl6ZWRMYXllclNwZWMge1xuICBjb25zdCB7bGF5ZXIsIGVuY29kaW5nLCBwcm9qZWN0aW9uLCAuLi5yZXN0fSA9IHNwZWM7XG4gIGNvbnN0IG1lcmdlZEVuY29kaW5nID0gbWVyZ2VFbmNvZGluZyh7cGFyZW50RW5jb2RpbmcsIGVuY29kaW5nfSk7XG4gIGNvbnN0IG1lcmdlZFByb2plY3Rpb24gPSBtZXJnZVByb2plY3Rpb24oe3BhcmVudFByb2plY3Rpb24sIHByb2plY3Rpb259KTtcbiAgcmV0dXJuIHtcbiAgICAuLi5yZXN0LFxuICAgIGxheWVyOiBsYXllci5tYXAoKHN1YnNwZWMpID0+IHtcbiAgICAgIGlmIChpc0xheWVyU3BlYyhzdWJzcGVjKSkge1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplTGF5ZXIoc3Vic3BlYywgY29uZmlnLCBtZXJnZWRFbmNvZGluZywgbWVyZ2VkUHJvamVjdGlvbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbm9ybWFsaXplTm9uRmFjZXRVbml0KHN1YnNwZWMsIGNvbmZpZywgbWVyZ2VkRW5jb2RpbmcsIG1lcmdlZFByb2plY3Rpb24pO1xuICAgIH0pXG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVJlcGVhdChzcGVjOiBHZW5lcmljUmVwZWF0U3BlYzxDb21wb3NpdGVVbml0U3BlYywgRXh0ZW5kZWRMYXllclNwZWM+LCBjb25maWc6IENvbmZpZyk6IE5vcm1hbGl6ZWRSZXBlYXRTcGVjIHtcbiAgY29uc3Qge3NwZWM6IHN1YnNwZWMsIC4uLnJlc3R9ID0gc3BlYztcbiAgcmV0dXJuIHtcbiAgICAuLi5yZXN0LFxuICAgIHNwZWM6IG5vcm1hbGl6ZShzdWJzcGVjLCBjb25maWcpXG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZDb25jYXQoc3BlYzogR2VuZXJpY1ZDb25jYXRTcGVjPENvbXBvc2l0ZVVuaXRTcGVjLCBFeHRlbmRlZExheWVyU3BlYz4sIGNvbmZpZzogQ29uZmlnKTogTm9ybWFsaXplZENvbmNhdFNwZWMge1xuICBjb25zdCB7dmNvbmNhdDogdmNvbmNhdCwgLi4ucmVzdH0gPSBzcGVjO1xuICByZXR1cm4ge1xuICAgIC4uLnJlc3QsXG4gICAgdmNvbmNhdDogdmNvbmNhdC5tYXAoKHN1YnNwZWMpID0+IG5vcm1hbGl6ZShzdWJzcGVjLCBjb25maWcpKVxuICB9O1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVIQ29uY2F0KHNwZWM6IEdlbmVyaWNIQ29uY2F0U3BlYzxDb21wb3NpdGVVbml0U3BlYywgRXh0ZW5kZWRMYXllclNwZWM+LCBjb25maWc6IENvbmZpZyk6IE5vcm1hbGl6ZWRDb25jYXRTcGVjIHtcbiAgY29uc3Qge2hjb25jYXQ6IGhjb25jYXQsIC4uLnJlc3R9ID0gc3BlYztcbiAgcmV0dXJuIHtcbiAgICAuLi5yZXN0LFxuICAgIGhjb25jYXQ6IGhjb25jYXQubWFwKChzdWJzcGVjKSA9PiBub3JtYWxpemUoc3Vic3BlYywgY29uZmlnKSlcbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRmFjZXRlZFVuaXQoc3BlYzogRmFjZXRlZENvbXBvc2l0ZVVuaXRTcGVjLCBjb25maWc6IENvbmZpZyk6IE5vcm1hbGl6ZWRGYWNldFNwZWMge1xuICAvLyBOZXcgZW5jb2RpbmcgaW4gdGhlIGluc2lkZSBzcGVjIHNob3VsZCBub3QgY29udGFpbiByb3cgLyBjb2x1bW5cbiAgLy8gYXMgcm93L2NvbHVtbiBzaG91bGQgYmUgbW92ZWQgdG8gZmFjZXRcbiAgY29uc3Qge3Jvdzogcm93LCBjb2x1bW46IGNvbHVtbiwgLi4uZW5jb2Rpbmd9ID0gc3BlYy5lbmNvZGluZztcblxuICAvLyBNYXJrIGFuZCBlbmNvZGluZyBzaG91bGQgYmUgbW92ZWQgaW50byB0aGUgaW5uZXIgc3BlY1xuICBjb25zdCB7bWFyaywgd2lkdGgsIHByb2plY3Rpb24sIGhlaWdodCwgc2VsZWN0aW9uLCBlbmNvZGluZzogXywgLi4ub3V0ZXJTcGVjfSA9IHNwZWM7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vdXRlclNwZWMsXG4gICAgZmFjZXQ6IHtcbiAgICAgIC4uLihyb3cgPyB7cm93fSA6IHt9KSxcbiAgICAgIC4uLihjb2x1bW4gPyB7Y29sdW1ufToge30pLFxuICAgIH0sXG4gICAgc3BlYzogbm9ybWFsaXplTm9uRmFjZXRVbml0KHtcbiAgICAgIC4uLihwcm9qZWN0aW9uID8ge3Byb2plY3Rpb259IDoge30pLFxuICAgICAgbWFyayxcbiAgICAgIC4uLih3aWR0aCA/IHt3aWR0aH0gOiB7fSksXG4gICAgICAuLi4oaGVpZ2h0ID8ge2hlaWdodH0gOiB7fSksXG4gICAgICBlbmNvZGluZyxcbiAgICAgIC4uLihzZWxlY3Rpb24gPyB7c2VsZWN0aW9ufSA6IHt9KVxuICAgIH0sIGNvbmZpZylcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNOb25GYWNldFVuaXRTcGVjV2l0aFByaW1pdGl2ZU1hcmsoc3BlYzogR2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgQW55TWFyaz4pOlxuICBzcGVjIGlzIEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIE1hcms+IHtcbiAgICByZXR1cm4gaXNQcmltaXRpdmVNYXJrKHNwZWMubWFyayk7XG59XG5cblxuZnVuY3Rpb24gbm9ybWFsaXplTm9uRmFjZXRVbml0KFxuICBzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8RmllbGQ+LCBBbnlNYXJrPiwgY29uZmlnOiBDb25maWcsXG4gIHBhcmVudEVuY29kaW5nPzogRW5jb2Rpbmc8c3RyaW5nIHwgUmVwZWF0UmVmPiwgcGFyZW50UHJvamVjdGlvbj86IFByb2plY3Rpb25cbik6IE5vcm1hbGl6ZWRVbml0U3BlYyB8IE5vcm1hbGl6ZWRMYXllclNwZWMge1xuICBjb25zdCB7ZW5jb2RpbmcsIHByb2plY3Rpb259ID0gc3BlYztcblxuICAvLyBtZXJnZSBwYXJlbnQgZW5jb2RpbmcgLyBwcm9qZWN0aW9uIGZpcnN0XG4gIGlmIChwYXJlbnRFbmNvZGluZyB8fCBwYXJlbnRQcm9qZWN0aW9uKSB7XG4gICAgY29uc3QgbWVyZ2VkUHJvamVjdGlvbiA9IG1lcmdlUHJvamVjdGlvbih7cGFyZW50UHJvamVjdGlvbiwgcHJvamVjdGlvbn0pO1xuICAgIGNvbnN0IG1lcmdlZEVuY29kaW5nID0gbWVyZ2VFbmNvZGluZyh7cGFyZW50RW5jb2RpbmcsIGVuY29kaW5nfSk7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZU5vbkZhY2V0VW5pdCh7XG4gICAgICAuLi5zcGVjLFxuICAgICAgLi4uKG1lcmdlZFByb2plY3Rpb24gPyB7cHJvamVjdGlvbjogbWVyZ2VkUHJvamVjdGlvbn0gOiB7fSksXG4gICAgICAuLi4obWVyZ2VkRW5jb2RpbmcgPyB7ZW5jb2Rpbmc6IG1lcmdlZEVuY29kaW5nfSA6IHt9KSxcbiAgICB9LCBjb25maWcpO1xuICB9XG5cbiAgaWYgKGlzTm9uRmFjZXRVbml0U3BlY1dpdGhQcmltaXRpdmVNYXJrKHNwZWMpKSB7XG4gICAgLy8gVE9ETzogdGhvcm91Z2hseSB0ZXN0XG4gICAgaWYgKGlzUmFuZ2VkKGVuY29kaW5nKSkge1xuICAgICAgcmV0dXJuIG5vcm1hbGl6ZVJhbmdlZFVuaXQoc3BlYyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3ZlcmxheUNvbmZpZzogT3ZlcmxheUNvbmZpZyA9IGNvbmZpZyAmJiBjb25maWcub3ZlcmxheTtcbiAgICBjb25zdCBvdmVybGF5V2l0aExpbmUgPSBvdmVybGF5Q29uZmlnICYmIHNwZWMubWFyayA9PT0gQVJFQSAmJlxuICAgICAgY29udGFpbnMoWydsaW5lcG9pbnQnLCAnbGluZSddLCBvdmVybGF5Q29uZmlnLmFyZWEpO1xuICAgIGNvbnN0IG92ZXJsYXlXaXRoUG9pbnQgPSBvdmVybGF5Q29uZmlnICYmIChcbiAgICAgIChvdmVybGF5Q29uZmlnLmxpbmUgJiYgc3BlYy5tYXJrID09PSBMSU5FKSB8fFxuICAgICAgKG92ZXJsYXlDb25maWcuYXJlYSA9PT0gJ2xpbmVwb2ludCcgJiYgc3BlYy5tYXJrID09PSBBUkVBKVxuICAgICk7XG4gICAgLy8gVE9ETzogY29uc2lkZXIgbW92aW5nIHRoaXMgdG8gYmVjb21lIGFub3RoZXIgY2FzZSBvZiBjb21wb3NpdGVNYXJrXG4gICAgaWYgKG92ZXJsYXlXaXRoUG9pbnQgfHwgb3ZlcmxheVdpdGhMaW5lKSB7XG4gICAgICByZXR1cm4gbm9ybWFsaXplT3ZlcmxheShzcGVjLCBvdmVybGF5V2l0aFBvaW50LCBvdmVybGF5V2l0aExpbmUsIGNvbmZpZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwZWM7IC8vIE5vdGhpbmcgdG8gbm9ybWFsaXplXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGNvbXBvc2l0ZU1hcmsubm9ybWFsaXplKHNwZWMsIGNvbmZpZyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUmFuZ2VkVW5pdChzcGVjOiBOb3JtYWxpemVkVW5pdFNwZWMpIHtcbiAgY29uc3QgaGFzWCA9IGNoYW5uZWxIYXNGaWVsZChzcGVjLmVuY29kaW5nLCBYKTtcbiAgY29uc3QgaGFzWSA9IGNoYW5uZWxIYXNGaWVsZChzcGVjLmVuY29kaW5nLCBZKTtcbiAgY29uc3QgaGFzWDIgPSBjaGFubmVsSGFzRmllbGQoc3BlYy5lbmNvZGluZywgWDIpO1xuICBjb25zdCBoYXNZMiA9IGNoYW5uZWxIYXNGaWVsZChzcGVjLmVuY29kaW5nLCBZMik7XG4gIGlmICgoaGFzWDIgJiYgIWhhc1gpIHx8IChoYXNZMiAmJiAhaGFzWSkpIHtcbiAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IGR1cGxpY2F0ZShzcGVjKTtcbiAgICBpZiAoaGFzWDIgJiYgIWhhc1gpIHtcbiAgICAgIG5vcm1hbGl6ZWRTcGVjLmVuY29kaW5nLnggPSBub3JtYWxpemVkU3BlYy5lbmNvZGluZy54MjtcbiAgICAgIGRlbGV0ZSBub3JtYWxpemVkU3BlYy5lbmNvZGluZy54MjtcbiAgICB9XG4gICAgaWYgKGhhc1kyICYmICFoYXNZKSB7XG4gICAgICBub3JtYWxpemVkU3BlYy5lbmNvZGluZy55ID0gbm9ybWFsaXplZFNwZWMuZW5jb2RpbmcueTI7XG4gICAgICBkZWxldGUgbm9ybWFsaXplZFNwZWMuZW5jb2RpbmcueTI7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRTcGVjO1xuICB9XG4gIHJldHVybiBzcGVjO1xufVxuXG5cbi8vIEZJWE1FKCMxODA0KTogcmUtZGVzaWduIHRoaXNcbmZ1bmN0aW9uIG5vcm1hbGl6ZU92ZXJsYXkoc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjLCBvdmVybGF5V2l0aFBvaW50OiBib29sZWFuLCBvdmVybGF5V2l0aExpbmU6IGJvb2xlYW4sIGNvbmZpZzogQ29uZmlnKTogTm9ybWFsaXplZExheWVyU3BlYyB7XG4gIC8vIF8gaXMgdXNlZCB0byBkZW5vdGUgYSBkcm9wcGVkIHByb3BlcnR5IG9mIHRoZSB1bml0IHNwZWNcbiAgLy8gd2hpY2ggc2hvdWxkIG5vdCBiZSBjYXJyaWVkIG92ZXIgdG8gdGhlIGxheWVyIHNwZWNcbiAgY29uc3Qge21hcmssIHNlbGVjdGlvbiwgcHJvamVjdGlvbiwgZW5jb2RpbmcsIC4uLm91dGVyU3BlY30gPSBzcGVjO1xuICBjb25zdCBsYXllciA9IFt7bWFyaywgZW5jb2Rpbmd9IGFzIE5vcm1hbGl6ZWRVbml0U3BlY107XG5cbiAgLy8gTmVlZCB0byBjb3B5IHN0YWNrIGNvbmZpZyB0byBvdmVybGF5ZWQgbGF5ZXJcbiAgY29uc3Qgc3RhY2tQcm9wcyA9IHN0YWNrKG1hcmssIGVuY29kaW5nLCBjb25maWcgPyBjb25maWcuc3RhY2sgOiB1bmRlZmluZWQpO1xuXG4gIGxldCBvdmVybGF5RW5jb2RpbmcgPSBlbmNvZGluZztcbiAgaWYgKHN0YWNrUHJvcHMpIHtcbiAgICBjb25zdCB7ZmllbGRDaGFubmVsOiBzdGFja0ZpZWxkQ2hhbm5lbCwgb2Zmc2V0fSA9IHN0YWNrUHJvcHM7XG4gICAgb3ZlcmxheUVuY29kaW5nID0ge1xuICAgICAgLi4uZW5jb2RpbmcsXG4gICAgICBbc3RhY2tGaWVsZENoYW5uZWxdOiB7XG4gICAgICAgIC4uLmVuY29kaW5nW3N0YWNrRmllbGRDaGFubmVsXSxcbiAgICAgICAgLi4uKG9mZnNldCA/IHtzdGFjazogb2Zmc2V0fSA6IHt9KVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBpZiAob3ZlcmxheVdpdGhMaW5lKSB7XG4gICAgbGF5ZXIucHVzaCh7XG4gICAgICAuLi4ocHJvamVjdGlvbiA/IHtwcm9qZWN0aW9ufSA6IHt9KSxcbiAgICAgIG1hcms6IHtcbiAgICAgICAgdHlwZTogJ2xpbmUnLFxuICAgICAgICBzdHlsZTogJ2xpbmVPdmVybGF5J1xuICAgICAgfSxcbiAgICAgIC4uLihzZWxlY3Rpb24gPyB7c2VsZWN0aW9ufSA6IHt9KSxcbiAgICAgIGVuY29kaW5nOiBvdmVybGF5RW5jb2RpbmdcbiAgICB9KTtcbiAgfVxuICBpZiAob3ZlcmxheVdpdGhQb2ludCkge1xuICAgIGxheWVyLnB1c2goe1xuICAgICAgLi4uKHByb2plY3Rpb24gPyB7cHJvamVjdGlvbn0gOiB7fSksXG4gICAgICBtYXJrOiB7XG4gICAgICAgIHR5cGU6ICdwb2ludCcsXG4gICAgICAgIGZpbGxlZDogdHJ1ZSxcbiAgICAgICAgc3R5bGU6ICdwb2ludE92ZXJsYXknXG4gICAgICB9LFxuICAgICAgLi4uKHNlbGVjdGlvbiA/IHtzZWxlY3Rpb259IDoge30pLFxuICAgICAgZW5jb2Rpbmc6IG92ZXJsYXlFbmNvZGluZ1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vdXRlclNwZWMsXG4gICAgbGF5ZXJcbiAgfTtcbn1cblxuLy8gVE9ETzogYWRkIHZsLnNwZWMudmFsaWRhdGUgJiBtb3ZlIHN0dWZmIGZyb20gdmwudmFsaWRhdGUgdG8gaGVyZVxuXG4vKiBBY2N1bXVsYXRlIG5vbi1kdXBsaWNhdGUgZmllbGREZWZzIGluIGEgZGljdGlvbmFyeSAqL1xuZnVuY3Rpb24gYWNjdW11bGF0ZShkaWN0OiBhbnksIGRlZnM6IEZpZWxkRGVmPEZpZWxkPltdKTogYW55IHtcbiAgZGVmcy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkRGVmKSB7XG4gICAgLy8gQ29uc2lkZXIgb25seSBwdXJlIGZpZWxkRGVmIHByb3BlcnRpZXMgKGlnbm9yaW5nIHNjYWxlLCBheGlzLCBsZWdlbmQpXG4gICAgY29uc3QgcHVyZUZpZWxkRGVmID0gWydmaWVsZCcsICd0eXBlJywgJ3ZhbHVlJywgJ3RpbWVVbml0JywgJ2JpbicsICdhZ2dyZWdhdGUnXS5yZWR1Y2UoKGYsIGtleSkgPT4ge1xuICAgICAgaWYgKGZpZWxkRGVmW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmW2tleV0gPSBmaWVsZERlZltrZXldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGY7XG4gICAgfSwge30pO1xuICAgIGNvbnN0IGtleSA9IGhhc2gocHVyZUZpZWxkRGVmKTtcbiAgICBkaWN0W2tleV0gPSBkaWN0W2tleV0gfHwgZmllbGREZWY7XG4gIH0pO1xuICByZXR1cm4gZGljdDtcbn1cblxuLyogUmVjdXJzaXZlbHkgZ2V0IGZpZWxkRGVmcyBmcm9tIGEgc3BlYywgcmV0dXJucyBhIGRpY3Rpb25hcnkgb2YgZmllbGREZWZzICovXG5mdW5jdGlvbiBmaWVsZERlZkluZGV4PFQ+KHNwZWM6IEdlbmVyaWNTcGVjPGFueSwgYW55PiwgZGljdDogRGljdDxGaWVsZERlZjxUPj4gPSB7fSk6IERpY3Q8RmllbGREZWY8VD4+IHtcbiAgLy8gRklYTUUoaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yMjA3KTogU3VwcG9ydCBmaWVsZERlZkluZGV4IGZvciByZXBlYXRcbiAgaWYgKGlzTGF5ZXJTcGVjKHNwZWMpKSB7XG4gICAgc3BlYy5sYXllci5mb3JFYWNoKGxheWVyID0+IHtcbiAgICAgIGlmIChpc1VuaXRTcGVjKGxheWVyKSkge1xuICAgICAgICBhY2N1bXVsYXRlKGRpY3QsIHZsRW5jb2RpbmcuZmllbGREZWZzKGxheWVyLmVuY29kaW5nKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWVsZERlZkluZGV4KGxheWVyLCBkaWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChpc0ZhY2V0U3BlYyhzcGVjKSkge1xuICAgIGFjY3VtdWxhdGUoZGljdCwgdmxFbmNvZGluZy5maWVsZERlZnMoc3BlYy5mYWNldCkpO1xuICAgIGZpZWxkRGVmSW5kZXgoc3BlYy5zcGVjLCBkaWN0KTtcbiAgfSBlbHNlIGlmIChpc1JlcGVhdFNwZWMoc3BlYykpIHtcbiAgICBmaWVsZERlZkluZGV4KHNwZWMuc3BlYywgZGljdCk7XG4gIH0gZWxzZSBpZiAoaXNDb25jYXRTcGVjKHNwZWMpKSB7XG4gICAgY29uc3QgY2hpbGRTcGVjID0gaXNWQ29uY2F0U3BlYyhzcGVjKSA/IHNwZWMudmNvbmNhdCA6IHNwZWMuaGNvbmNhdDtcbiAgICBjaGlsZFNwZWMuZm9yRWFjaChjaGlsZCA9PiBmaWVsZERlZkluZGV4KGNoaWxkLCBkaWN0KSk7XG4gIH0gZWxzZSB7IC8vIFVuaXQgU3BlY1xuICAgIGFjY3VtdWxhdGUoZGljdCwgdmxFbmNvZGluZy5maWVsZERlZnMoc3BlYy5lbmNvZGluZykpO1xuICB9XG4gIHJldHVybiBkaWN0O1xufVxuXG4vKiBSZXR1cm5zIGFsbCBub24tZHVwbGljYXRlIGZpZWxkRGVmcyBpbiBhIHNwZWMgaW4gYSBmbGF0IGFycmF5ICovXG5leHBvcnQgZnVuY3Rpb24gZmllbGREZWZzKHNwZWM6IEdlbmVyaWNTcGVjPGFueSwgYW55Pik6IEZpZWxkRGVmPGFueT5bXSB7XG4gIHJldHVybiB2YWxzKGZpZWxkRGVmSW5kZXgoc3BlYykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdGFja2VkKHNwZWM6IFRvcExldmVsPEZhY2V0ZWRDb21wb3NpdGVVbml0U3BlYz4sIGNvbmZpZz86IENvbmZpZyk6IGJvb2xlYW4ge1xuICBjb25maWcgPSBjb25maWcgfHwgc3BlYy5jb25maWc7XG4gIGlmIChpc1ByaW1pdGl2ZU1hcmsoc3BlYy5tYXJrKSkge1xuICAgIHJldHVybiBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsXG4gICAgICAgICAgICBjb25maWcgPyBjb25maWcuc3RhY2sgOiB1bmRlZmluZWRcbiAgICAgICAgICApICE9PSBudWxsO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==