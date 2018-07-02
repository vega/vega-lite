import * as tslib_1 from "tslib";
import { X } from '../../channel';
import { isTimeFieldDef } from '../../fielddef';
import { ScaleType } from '../../scale';
import { NOMINAL, ORDINAL } from '../../type';
import { contains, keys } from '../../util';
import { timeFormatExpression } from '../common';
import { getAxisConfig } from './config';
export function labels(model, channel, specifiedLabelsSpec, orient) {
    var fieldDef = model.fieldDef(channel) ||
        (channel === 'x' ? model.fieldDef('x2') :
            channel === 'y' ? model.fieldDef('y2') :
                undefined);
    var axis = model.axis(channel);
    var config = model.config;
    var labelsSpec = {};
    // Text
    if (isTimeFieldDef(fieldDef)) {
        var isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;
        var expr = timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, config.timeFormat, isUTCScale);
        if (expr) {
            labelsSpec.text = { signal: expr };
        }
    }
    // Label Angle
    var angle = getAxisConfig('labelAngle', model.config, channel, orient, model.getScaleComponent(channel).get('type'));
    if (angle === undefined) {
        angle = labelAngle(axis, channel, fieldDef);
        if (angle) {
            labelsSpec.angle = { value: angle };
        }
    }
    if (angle !== undefined) {
        var align = labelAlign(angle, orient);
        if (align) {
            labelsSpec.align = { value: align };
        }
        labelsSpec.baseline = labelBaseline(angle, orient);
    }
    labelsSpec = tslib_1.__assign({}, labelsSpec, specifiedLabelsSpec);
    return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
export function labelBaseline(angle, orient) {
    if (orient === 'top' || orient === 'bottom') {
        if (angle <= 45 || 315 <= angle) {
            return { value: orient === 'top' ? 'bottom' : 'top' };
        }
        else if (135 <= angle && angle <= 225) {
            return { value: orient === 'top' ? 'top' : 'bottom' };
        }
        else {
            return { value: 'middle' };
        }
    }
    else {
        if ((angle <= 45 || 315 <= angle) || (135 <= angle && angle <= 225)) {
            return { value: 'middle' };
        }
        else if (45 <= angle && angle <= 135) {
            return { value: orient === 'left' ? 'top' : 'bottom' };
        }
        else {
            return { value: orient === 'left' ? 'bottom' : 'top' };
        }
    }
}
export function labelAngle(axis, channel, fieldDef) {
    if (axis.labelAngle !== undefined) {
        // Make angle within [0,360)
        return ((axis.labelAngle % 360) + 360) % 360;
    }
    else {
        if (channel === X && contains([NOMINAL, ORDINAL], fieldDef.type)) {
            return 270;
        }
    }
    return undefined;
}
export function labelAlign(angle, orient) {
    angle = ((angle % 360) + 360) % 360;
    if (orient === 'top' || orient === 'bottom') {
        if (angle % 180 === 0) {
            return 'center';
        }
        else if (0 < angle && angle < 180) {
            return orient === 'top' ? 'right' : 'left';
        }
        else {
            return orient === 'top' ? 'left' : 'right';
        }
    }
    else {
        if ((angle + 90) % 180 === 0) {
            return 'center';
        }
        else if (90 <= angle && angle < 270) {
            return orient === 'left' ? 'left' : 'right';
        }
        else {
            return orient === 'left' ? 'right' : 'left';
        }
    }
}
//# sourceMappingURL=encode.js.map