import * as tslib_1 from "tslib";
import * as log from '../log';
import { isMarkDef } from '../mark';
import { keys } from '../util';
import { partLayerMixins } from './common';
export var CALLOUT = 'callout';
var CALLOUT_PART_INDEX = {
    line: 1,
    label: 1
};
export var CALLOUT_PARTS = keys(CALLOUT_PART_INDEX);
export var DEFAULT_CALLOUT_CONFIG = {
    angle: -45,
    lineOffset: 0,
    lineLength: 30,
    labelOffset: 2,
    label: {
        align: 'left',
        baseline: 'middle'
    },
    line: {}
};
export function isCalloutDef(markDef) {
    return markDef.type === 'callout';
}
export function normalizeCallout(spec, config) {
    // TODO:  determine what's the general rule for applying selection for composite marks
    var mark = spec.mark, _sel = spec.selection, _p = spec.projection, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "selection", "projection", "encoding"]);
    var markDef = tslib_1.__assign({}, config.callout, isMarkDef(mark) ? mark : { type: mark });
    var angle = markDef.angle, lineOffset = markDef.lineOffset, lineLength = markDef.lineLength, labelOffset = markDef.labelOffset;
    var calloutOffsetCoor1 = getCoordinateFromAngleAndLength(angle, lineOffset);
    var calloutOffsetCoor2 = getCoordinateFromAngleAndLength(angle, lineOffset + lineLength);
    var labelTotalOffsetCoor = getCoordinateFromAngleAndLength(angle, lineOffset + lineLength + labelOffset);
    var text = encoding.text, size = encoding.size, encodingWithoutTextAndSize = tslib_1.__rest(encoding, ["text", "size"]);
    if (!text) {
        log.warn('callout mark should have text encoding');
    }
    return tslib_1.__assign({}, outerSpec, { layer: partLayerMixins(markDef, 'line', config.callout, {
            mark: {
                type: 'rule',
                xOffset: calloutOffsetCoor1.x,
                yOffset: calloutOffsetCoor1.y,
                x2Offset: calloutOffsetCoor2.x,
                y2Offset: calloutOffsetCoor2.y
            },
            encoding: tslib_1.__assign({ x2: encoding.x, y2: encoding.y }, encodingWithoutTextAndSize)
        }).concat(partLayerMixins(markDef, 'label', config.callout, {
            mark: {
                type: 'text',
                xOffset: labelTotalOffsetCoor.x,
                yOffset: labelTotalOffsetCoor.y,
            },
            encoding: encoding
        })) });
}
function getCoordinateFromAngleAndLength(angle, length) {
    var radian = angle * Math.PI / 180;
    return { x: length * Math.cos(radian), y: length * Math.sin(radian) };
}
//# sourceMappingURL=callout.js.map