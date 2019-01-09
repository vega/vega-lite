import * as tslib_1 from "tslib";
import { isObject } from 'vega-util';
import { COLUMN, ROW } from './channel';
import * as compositeMark from './compositemark';
import { channelHasField } from './encoding';
import * as log from './log';
import { isMarkDef, isPathMark, isPrimitiveMark } from './mark';
import { isFacetSpec, isHConcatSpec, isLayerSpec, isRepeatSpec, isUnitSpec, isVConcatSpec } from './spec';
import { stack } from './stack';
import { keys, omit, pick } from './util';
export function normalizeTopLevelSpec(spec, config) {
    return normalize(spec, config);
}
/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
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
        const hasRow = channelHasField(spec.encoding, ROW);
        const hasColumn = channelHasField(spec.encoding, COLUMN);
        if (hasRow || hasColumn) {
            return normalizeFacetedUnit(spec, config);
        }
        return normalizeNonFacetUnit(spec, config);
    }
    throw new Error(log.message.INVALID_SPEC);
}
function normalizeFacet(spec, config) {
    const { spec: subspec } = spec, rest = tslib_1.__rest(spec, ["spec"]);
    return Object.assign({}, rest, { 
        // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
        spec: normalize(subspec, config) });
}
function mergeEncoding(opt) {
    const { parentEncoding, encoding } = opt;
    if (parentEncoding && encoding) {
        const overriden = keys(parentEncoding).reduce((o, key) => {
            if (encoding[key]) {
                o.push(key);
            }
            return o;
        }, []);
        if (overriden.length > 0) {
            log.warn(log.message.encodingOverridden(overriden));
        }
    }
    const merged = Object.assign({}, (parentEncoding || {}), (encoding || {}));
    return keys(merged).length > 0 ? merged : undefined;
}
function mergeProjection(opt) {
    const { parentProjection, projection } = opt;
    if (parentProjection && projection) {
        log.warn(log.message.projectionOverridden({ parentProjection, projection }));
    }
    return projection || parentProjection;
}
function normalizeLayer(spec, config, parentEncoding, parentProjection) {
    const { layer, encoding, projection } = spec, rest = tslib_1.__rest(spec, ["layer", "encoding", "projection"]);
    const mergedEncoding = mergeEncoding({ parentEncoding, encoding });
    const mergedProjection = mergeProjection({ parentProjection, projection });
    return Object.assign({}, rest, { layer: layer.map(subspec => {
            if (isLayerSpec(subspec)) {
                return normalizeLayer(subspec, config, mergedEncoding, mergedProjection);
            }
            return normalizeNonFacetUnit(subspec, config, mergedEncoding, mergedProjection);
        }) });
}
function normalizeRepeat(spec, config) {
    const { spec: subspec } = spec, rest = tslib_1.__rest(spec, ["spec"]);
    return Object.assign({}, rest, { spec: normalize(subspec, config) });
}
function normalizeVConcat(spec, config) {
    const { vconcat: vconcat } = spec, rest = tslib_1.__rest(spec, ["vconcat"]);
    return Object.assign({}, rest, { vconcat: vconcat.map(subspec => normalize(subspec, config)) });
}
function normalizeHConcat(spec, config) {
    const { hconcat: hconcat } = spec, rest = tslib_1.__rest(spec, ["hconcat"]);
    return Object.assign({}, rest, { hconcat: hconcat.map(subspec => normalize(subspec, config)) });
}
function normalizeFacetedUnit(spec, config) {
    // New encoding in the inside spec should not contain row / column
    // as row/column should be moved to facet
    const _a = spec.encoding, { row: row, column: column } = _a, encoding = tslib_1.__rest(_a, ["row", "column"]);
    // Mark and encoding should be moved into the inner spec
    const { mark, width, projection, height, selection, encoding: _ } = spec, outerSpec = tslib_1.__rest(spec, ["mark", "width", "projection", "height", "selection", "encoding"]);
    return Object.assign({}, outerSpec, { facet: Object.assign({}, (row ? { row } : {}), (column ? { column } : {})), spec: normalizeNonFacetUnit(Object.assign({}, (projection ? { projection } : {}), { mark }, (width ? { width } : {}), (height ? { height } : {}), { encoding }, (selection ? { selection } : {})), config) });
}
function isNonFacetUnitSpecWithPrimitiveMark(spec) {
    return isPrimitiveMark(spec.mark);
}
function getPointOverlay(markDef, markConfig, encoding) {
    if (markDef.point === 'transparent') {
        return { opacity: 0 };
    }
    else if (markDef.point) {
        // truthy : true or object
        return isObject(markDef.point) ? markDef.point : {};
    }
    else if (markDef.point !== undefined) {
        // false or null
        return null;
    }
    else {
        // undefined (not disabled)
        if (markConfig.point || encoding.shape) {
            // enable point overlay if config[mark].point is truthy or if encoding.shape is provided
            return isObject(markConfig.point) ? markConfig.point : {};
        }
        // markDef.point is defined as falsy
        return null;
    }
}
function getLineOverlay(markDef, markConfig) {
    if (markDef.line) {
        // true or object
        return markDef.line === true ? {} : markDef.line;
    }
    else if (markDef.line !== undefined) {
        // false or null
        return null;
    }
    else {
        // undefined (not disabled)
        if (markConfig.line) {
            // enable line overlay if config[mark].line is truthy
            return markConfig.line === true ? {} : markConfig.line;
        }
        // markDef.point is defined as falsy
        return null;
    }
}
function normalizeNonFacetUnit(spec, config, parentEncoding, parentProjection) {
    const { encoding, projection } = spec;
    const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    // merge parent encoding / projection first
    if (parentEncoding || parentProjection) {
        const mergedProjection = mergeProjection({ parentProjection, projection });
        const mergedEncoding = mergeEncoding({ parentEncoding, encoding });
        return normalizeNonFacetUnit(Object.assign({}, spec, (mergedProjection ? { projection: mergedProjection } : {}), (mergedEncoding ? { encoding: mergedEncoding } : {})), config);
    }
    if (isNonFacetUnitSpecWithPrimitiveMark(spec)) {
        // TODO: thoroughly test
        if (mark === 'line' && (encoding.x2 || encoding.y2)) {
            log.warn(log.message.lineWithRange(!!encoding.x2, !!encoding.y2));
            return normalizeNonFacetUnit(Object.assign({ mark: 'rule' }, spec), config, parentEncoding, parentProjection);
        }
        if (isPathMark(mark)) {
            return normalizePathOverlay(spec, config);
        }
        return spec; // Nothing to normalize
    }
    else {
        return compositeMark.normalize(spec, config);
    }
}
function dropLineAndPoint(markDef) {
    const { point: _point, line: _line } = markDef, mark = tslib_1.__rest(markDef, ["point", "line"]);
    return keys(mark).length > 1 ? mark : mark.type;
}
function normalizePathOverlay(spec, config = {}) {
    // _ is used to denote a dropped property of the unit spec
    // which should not be carried over to the layer spec
    const { selection, projection, encoding, mark } = spec, outerSpec = tslib_1.__rest(spec, ["selection", "projection", "encoding", "mark"]);
    const markDef = isMarkDef(mark) ? mark : { type: mark };
    const pointOverlay = getPointOverlay(markDef, config[markDef.type], encoding);
    const lineOverlay = markDef.type === 'area' && getLineOverlay(markDef, config[markDef.type]);
    if (!pointOverlay && !lineOverlay) {
        return Object.assign({}, spec, { 
            // Do not include point / line overlay in the normalize spec
            mark: dropLineAndPoint(markDef) });
    }
    const layer = [
        Object.assign({}, (selection ? { selection } : {}), { 
            // Do not include point / line overlay in the normalize spec
            mark: dropLineAndPoint(Object.assign({}, markDef, (markDef.type === 'area' ? { opacity: 0.7 } : {}))), 
            // drop shape from encoding as this might be used to trigger point overlay
            encoding: omit(encoding, ['shape']) })
    ];
    // FIXME: determine rules for applying selections.
    // Need to copy stack config to overlayed layer
    const stackProps = stack(markDef, encoding, config ? config.stack : undefined);
    let overlayEncoding = encoding;
    if (stackProps) {
        const { fieldChannel: stackFieldChannel, offset } = stackProps;
        overlayEncoding = Object.assign({}, encoding, { [stackFieldChannel]: Object.assign({}, encoding[stackFieldChannel], (offset ? { stack: offset } : {})) });
    }
    if (lineOverlay) {
        layer.push(Object.assign({}, (projection ? { projection } : {}), { mark: Object.assign({ type: 'line' }, pick(markDef, ['clip', 'interpolate', 'tension']), lineOverlay), encoding: overlayEncoding }));
    }
    if (pointOverlay) {
        layer.push(Object.assign({}, (projection ? { projection } : {}), { mark: Object.assign({ type: 'point', opacity: 1, filled: true }, pick(markDef, ['clip']), pointOverlay), encoding: overlayEncoding }));
    }
    return Object.assign({}, outerSpec, { layer });
}
//# sourceMappingURL=normalize.js.map