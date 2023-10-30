import { array } from 'vega-util';
import { SCALE_CHANNELS } from '../../../channel';
import { isPathMark } from '../../../mark';
import { hasContinuousDomain } from '../../../scale';
import { keys } from '../../../util';
import { VG_MARK_CONFIGS } from '../../../vega.schema';
import { getMarkPropOrConfig, signalOrValueRef } from '../../common';
import { aria } from './aria';
import { color } from './color';
import { nonPosition } from './nonposition';
import { text } from './text';
import { tooltip } from './tooltip';
import { fieldInvalidPredicate } from './valueref';
import { zindex } from './zindex';
export { color } from './color';
export { wrapCondition } from './conditional';
export { nonPosition } from './nonposition';
export { pointPosition } from './position-point';
export { pointOrRangePosition, rangePosition } from './position-range';
export { rectPosition } from './position-rect';
export { text } from './text';
export { tooltip } from './tooltip';
const ALWAYS_IGNORE = new Set(['aria', 'width', 'height']);
export function baseEncodeEntry(model, ignore) {
    const { fill = undefined, stroke = undefined } = ignore.color === 'include' ? color(model) : {};
    return {
        ...markDefProperties(model.markDef, ignore),
        ...wrapAllFieldsInvalid(model, 'fill', fill),
        ...wrapAllFieldsInvalid(model, 'stroke', stroke),
        ...nonPosition('opacity', model),
        ...nonPosition('fillOpacity', model),
        ...nonPosition('strokeOpacity', model),
        ...nonPosition('strokeWidth', model),
        ...nonPosition('strokeDash', model),
        ...zindex(model),
        ...tooltip(model),
        ...text(model, 'href'),
        ...aria(model)
    };
}
// TODO: mark VgValueRef[] as readonly after https://github.com/vega/vega/pull/1987
function wrapAllFieldsInvalid(model, channel, valueRef) {
    const { config, mark, markDef } = model;
    const invalid = getMarkPropOrConfig('invalid', markDef, config);
    if (invalid === 'hide' && valueRef && !isPathMark(mark)) {
        // For non-path marks, we have to exclude invalid values (null and NaN) for scales with continuous domains.
        // For path marks, we will use "defined" property and skip these values instead.
        const test = allFieldsInvalidPredicate(model, { invalid: true, channels: SCALE_CHANNELS });
        if (test) {
            return {
                [channel]: [
                    // prepend the invalid case
                    // TODO: support custom value
                    { test, value: null },
                    ...array(valueRef)
                ]
            };
        }
    }
    return valueRef ? { [channel]: valueRef } : {};
}
function markDefProperties(mark, ignore) {
    return VG_MARK_CONFIGS.reduce((m, prop) => {
        if (!ALWAYS_IGNORE.has(prop) && mark[prop] !== undefined && ignore[prop] !== 'ignore') {
            m[prop] = signalOrValueRef(mark[prop]);
        }
        return m;
    }, {});
}
function allFieldsInvalidPredicate(model, { invalid = false, channels }) {
    const filterIndex = channels.reduce((aggregator, channel) => {
        const scaleComponent = model.getScaleComponent(channel);
        if (scaleComponent) {
            const scaleType = scaleComponent.get('type');
            const field = model.vgField(channel, { expr: 'datum' });
            // While discrete domain scales can handle invalid values, continuous scales can't.
            if (field && hasContinuousDomain(scaleType)) {
                aggregator[field] = true;
            }
        }
        return aggregator;
    }, {});
    const fields = keys(filterIndex);
    if (fields.length > 0) {
        const op = invalid ? '||' : '&&';
        return fields.map(field => fieldInvalidPredicate(field, invalid)).join(` ${op} `);
    }
    return undefined;
}
//# sourceMappingURL=base.js.map