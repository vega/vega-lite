import { isTimeFieldDef } from '../../fielddef';
import { ScaleType } from '../../scale';
import { keys } from '../../util';
import { timeFormatExpression } from '../common';
export function labels(model, channel, specifiedLabelsSpec, orient) {
    const fieldDef = model.fieldDef(channel) ||
        (channel === 'x' ? model.fieldDef('x2') : channel === 'y' ? model.fieldDef('y2') : undefined);
    const axis = model.axis(channel);
    const config = model.config;
    let labelsSpec = {};
    // Text
    if (isTimeFieldDef(fieldDef)) {
        const isUTCScale = model.getScaleComponent(channel).get('type') === ScaleType.UTC;
        const expr = timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, null, isUTCScale);
        if (expr) {
            labelsSpec.text = { signal: expr };
        }
    }
    labelsSpec = Object.assign({}, labelsSpec, specifiedLabelsSpec);
    return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
//# sourceMappingURL=encode.js.map