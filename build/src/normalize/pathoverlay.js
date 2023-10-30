import { isObject } from 'vega-util';
import { normalizeEncoding } from '../encoding';
import { isMarkDef } from '../mark';
import { isUnitSpec } from '../spec/unit';
import { stack } from '../stack';
import { keys, omit, pick } from '../util';
import { initMarkdef } from '../compile/mark/init';
function dropLineAndPoint(markDef) {
    const { point: _point, line: _line, ...mark } = markDef;
    return keys(mark).length > 1 ? mark : mark.type;
}
function dropLineAndPointFromConfig(config) {
    for (const mark of ['line', 'area', 'rule', 'trail']) {
        if (config[mark]) {
            config = {
                ...config,
                // TODO: remove as any
                [mark]: omit(config[mark], ['point', 'line'])
            };
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
    run(spec, normParams, normalize) {
        const { config } = normParams;
        const { params, projection, mark, name, encoding: e, ...outerSpec } = spec;
        // Need to call normalizeEncoding because we need the inferred types to correctly determine stack
        const encoding = normalizeEncoding(e, config);
        const markDef = isMarkDef(mark) ? mark : { type: mark };
        const pointOverlay = getPointOverlay(markDef, config[markDef.type], encoding);
        const lineOverlay = markDef.type === 'area' && getLineOverlay(markDef, config[markDef.type]);
        const layer = [
            {
                name,
                ...(params ? { params } : {}),
                mark: dropLineAndPoint({
                    // TODO: extract this 0.7 to be shared with default opacity for point/tick/...
                    ...(markDef.type === 'area' && markDef.opacity === undefined && markDef.fillOpacity === undefined
                        ? { opacity: 0.7 }
                        : {}),
                    ...markDef
                }),
                // drop shape from encoding as this might be used to trigger point overlay
                encoding: omit(encoding, ['shape'])
            }
        ];
        // FIXME: determine rules for applying selections.
        // Need to copy stack config to overlayed layer
        // FIXME: normalizer shouldn't call `initMarkdef`, a method from an init phase.
        const stackProps = stack(initMarkdef(markDef, encoding, config), encoding);
        let overlayEncoding = encoding;
        if (stackProps) {
            const { fieldChannel: stackFieldChannel, offset } = stackProps;
            overlayEncoding = {
                ...encoding,
                [stackFieldChannel]: {
                    ...encoding[stackFieldChannel],
                    ...(offset ? { stack: offset } : {})
                }
            };
        }
        // overlay line layer should be on the edge of area but passing y2/x2 makes
        // it as "rule" mark so that it draws unwanted vertical/horizontal lines.
        // point overlay also should not have y2/x2 as it does not support.
        overlayEncoding = omit(overlayEncoding, ['y2', 'x2']);
        if (lineOverlay) {
            layer.push({
                ...(projection ? { projection } : {}),
                mark: {
                    type: 'line',
                    ...pick(markDef, ['clip', 'interpolate', 'tension', 'tooltip']),
                    ...lineOverlay
                },
                encoding: overlayEncoding
            });
        }
        if (pointOverlay) {
            layer.push({
                ...(projection ? { projection } : {}),
                mark: {
                    type: 'point',
                    opacity: 1,
                    filled: true,
                    ...pick(markDef, ['clip', 'tooltip']),
                    ...pointOverlay
                },
                encoding: overlayEncoding
            });
        }
        return normalize({
            ...outerSpec,
            layer
        }, {
            ...normParams,
            config: dropLineAndPointFromConfig(config)
        });
    }
}
//# sourceMappingURL=pathoverlay.js.map