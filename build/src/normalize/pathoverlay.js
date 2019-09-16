import { __rest } from "tslib";
import { isObject } from 'vega-util';
import { isMarkDef } from '../mark';
import { isUnitSpec } from '../spec/unit';
import { stack } from '../stack';
import { keys, omit, pick } from '../util';
function dropLineAndPoint(markDef) {
    const { point: _point, line: _line } = markDef, mark = __rest(markDef, ["point", "line"]);
    return keys(mark).length > 1 ? mark : mark.type;
}
function dropLineAndPointFromConfig(config) {
    for (const mark of ['line', 'area', 'rule', 'trail']) {
        if (config[mark]) {
            config = Object.assign(Object.assign({}, config), { 
                // TODO: remove as any
                [mark]: omit(config[mark], ['point', 'line']) });
        }
    }
    return config;
}
function getPointOverlay(markDef, markConfig = {}, encoding) {
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
        return undefined;
    }
}
function getLineOverlay(markDef, markConfig = {}) {
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
        return undefined;
    }
}
export class PathOverlayNormalizer {
    constructor() {
        this.name = 'path-overlay';
    }
    hasMatchingType(spec, config) {
        if (isUnitSpec(spec)) {
            const { mark, encoding } = spec;
            const markDef = isMarkDef(mark) ? mark : { type: mark };
            switch (markDef.type) {
                case 'line':
                case 'rule':
                case 'trail':
                    return !!getPointOverlay(markDef, config[markDef.type], encoding);
                case 'area':
                    return (
                    // false / null are also included as we want to remove the properties
                    !!getPointOverlay(markDef, config[markDef.type], encoding) ||
                        !!getLineOverlay(markDef, config[markDef.type]));
            }
        }
        return false;
    }
    run(spec, params, normalize) {
        const { config } = params;
        const { selection, projection, encoding, mark } = spec, outerSpec = __rest(spec, ["selection", "projection", "encoding", "mark"]);
        const markDef = isMarkDef(mark) ? mark : { type: mark };
        const pointOverlay = getPointOverlay(markDef, config[markDef.type], encoding);
        const lineOverlay = markDef.type === 'area' && getLineOverlay(markDef, config[markDef.type]);
        const layer = [
            Object.assign(Object.assign({}, (selection ? { selection } : {})), { 
                // Do not include point / line overlay in the normalize spec
                mark: dropLineAndPoint(Object.assign(Object.assign({}, markDef), (markDef.type === 'area' ? { opacity: 0.7 } : {}))), 
                // drop shape from encoding as this might be used to trigger point overlay
                encoding: omit(encoding, ['shape']) })
        ];
        // FIXME: determine rules for applying selections.
        // Need to copy stack config to overlayed layer
        const stackProps = stack(markDef, encoding);
        let overlayEncoding = encoding;
        if (stackProps) {
            const { fieldChannel: stackFieldChannel, offset } = stackProps;
            overlayEncoding = Object.assign(Object.assign({}, encoding), { [stackFieldChannel]: Object.assign(Object.assign({}, encoding[stackFieldChannel]), (offset ? { stack: offset } : {})) });
        }
        if (lineOverlay) {
            layer.push(Object.assign(Object.assign({}, (projection ? { projection } : {})), { mark: Object.assign(Object.assign({ type: 'line' }, pick(markDef, ['clip', 'interpolate', 'tension', 'tooltip'])), lineOverlay), encoding: overlayEncoding }));
        }
        if (pointOverlay) {
            layer.push(Object.assign(Object.assign({}, (projection ? { projection } : {})), { mark: Object.assign(Object.assign({ type: 'point', opacity: 1, filled: true }, pick(markDef, ['clip', 'tooltip'])), pointOverlay), encoding: overlayEncoding }));
        }
        return normalize(Object.assign(Object.assign({}, outerSpec), { layer }), Object.assign(Object.assign({}, params), { config: dropLineAndPointFromConfig(config) }));
    }
}
//# sourceMappingURL=pathoverlay.js.map