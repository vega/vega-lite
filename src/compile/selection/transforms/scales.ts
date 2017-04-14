import {Channel} from '../../../channel';
import {warn} from '../../../log';
import {hasContinuousDomain} from '../../../scale';
import {stringValue} from '../../../util';
import {UnitModel} from '../../unit';
import {SIZE as INTERVAL_SIZE} from '../interval';
import {channelSignalName, MODIFY, TUPLE} from '../selection';
import {TransformCompiler} from './transforms';

const scaleBindings:TransformCompiler = {
  clippedGroup: true,

  has: function(selCmpt) {
    return selCmpt.type === 'interval' && selCmpt.bind && selCmpt.bind === 'scales';
  },

  parse: function(model, selDef, selCmpt) {
    const scales = model.component.scales;
    const bound:Channel[] = selCmpt.scales = [];

    selCmpt.project.forEach(function(p) {
      const channel = p.encoding;
      const scale = scales[channel];

      if (!scale || !hasContinuousDomain(scale.type)) {
        warn('Scale bindings are currently only supported for scales with continuous domains.');
        return;
      }

      scale.domainRaw = {signal: channelSignalName(selCmpt, channel)};
      bound.push(channel);
    });
  },

  topLevelSignals: function(model, selCmpt, signals) {
    return signals.concat(selCmpt.scales.map((channel) => {
      return {name: channelSignalName(selCmpt, channel)};
    }));
  },

  signals: function(model, selCmpt, signals) {
    const name = selCmpt.name;
    signals = signals.filter(function(s) {
      return s.name !== name + INTERVAL_SIZE &&
        s.name !== name + TUPLE && s.name !== MODIFY;
    });

    selCmpt.scales.forEach(function(channel) {
      const signal = signals.filter((s) => s.name === name + '_' + channel)[0];
      signal.push = 'outer';
      delete signal.value;
      delete signal.update;
    });

    return signals;
  }
};

export {scaleBindings as default};

export function domain(model: UnitModel, channel: Channel) {
  const scale = stringValue(model.scaleName(channel));
  return `domain(${scale})`;
}
