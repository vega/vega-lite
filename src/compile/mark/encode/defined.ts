import {POSITION_SCALE_CHANNELS} from '../../../channel.js';
import {ScaleChannel} from '../../../channel.js';
import {Value} from '../../../channeldef.js';
import {hasContinuousDomain} from '../../../scale.js';
import {Dict, keys} from '../../../util.js';
import {VgEncodeEntry} from '../../../vega.schema.js';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common.js';
import {UnitModel} from '../../unit.js';
import {fieldInvalidPredicate} from './valueref.js';

export function defined(model: UnitModel): VgEncodeEntry {
  const {config, markDef} = model;

  const invalid = getMarkPropOrConfig('invalid', markDef, config);
  if (invalid) {
    const signal = allFieldsInvalidPredicate(model, {channels: POSITION_SCALE_CHANNELS});

    if (signal) {
      return {defined: {signal}};
    }
  }
  return {};
}

function allFieldsInvalidPredicate(
  model: UnitModel,
  {invalid = false, channels}: {invalid?: boolean; channels: ScaleChannel[]}
) {
  const filterIndex = channels.reduce((aggregator: Dict<true>, channel) => {
    const scaleComponent = model.getScaleComponent(channel);
    if (scaleComponent) {
      const scaleType = scaleComponent.get('type');
      const field = model.vgField(channel, {expr: 'datum', binSuffix: model.stack?.impute ? 'mid' : undefined});

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

export function valueIfDefined(prop: string, value: Value): VgEncodeEntry {
  if (value !== undefined) {
    return {[prop]: signalOrValueRef(value)};
  }
  return undefined;
}
