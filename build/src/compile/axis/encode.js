import * as tslib_1 from "tslib";
import { isTimeFieldDef } from '../../fielddef';
import { ScaleType } from '../../scale';
import { keys } from '../../util';
import { timeFormatExpression } from '../common';
export function labels(model, channel, specifiedLabelsSpec, orient) {
    var fieldDef = model.fieldDef(channel) ||
        (channel === 'x' ? model.fieldDef('x2') : channel === 'y' ? model.fieldDef('y2') : undefined);
    var axis = model.axis(channel);
    var config = model.config;
    var labelsSpec = {};
    // Text
    if (isTimeFieldDef(fieldDef)) {
        var isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;
        var expr = timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, null, isUTCScale);
        if (expr) {
            labelsSpec.text = { signal: expr };
        }
    }
    labelsSpec = tslib_1.__assign({}, labelsSpec, specifiedLabelsSpec);
    return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
//# sourceMappingURL=encode.js.map