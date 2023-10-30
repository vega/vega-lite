import { POSITION_SCALE_CHANNELS } from '../../../channel';
import { hasContinuousDomain } from '../../../scale';
import { keys } from '../../../util';
import { getMarkPropOrConfig, signalOrValueRef } from '../../common';
import { fieldInvalidPredicate } from './valueref';
export function defined(model) {
    const { config, markDef } = model;
    const invalid = getMarkPropOrConfig('invalid', markDef, config);
    if (invalid) {
        const signal = allFieldsInvalidPredicate(model, { channels: POSITION_SCALE_CHANNELS });
        if (signal) {
            return { defined: { signal } };
        }
    }
    return {};
}
function allFieldsInvalidPredicate(model, { invalid = false, channels }) {
    const filterIndex = channels.reduce((aggregator, channel) => {
        const scaleComponent = model.getScaleComponent(channel);
        if (scaleComponent) {
            const scaleType = scaleComponent.get('type');
            const field = model.vgField(channel, { expr: 'datum', binSuffix: model.stack?.impute ? 'mid' : undefined });
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
export function valueIfDefined(prop, value) {
    if (value !== undefined) {
        return { [prop]: signalOrValueRef(value) };
    }
    return undefined;
}
//# sourceMappingURL=defined.js.map