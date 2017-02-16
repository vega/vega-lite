import {TransformCompiler} from './';
import {warn} from '../../../log';
import {hasContinuousDomain} from '../../../scale';
import {Channel} from '../../../channel';
import {TUPLE, MODIFY, channelSignalName} from '../';
import {UnitModel} from '../../unit';
import {SIZE as INTERVAL_SIZE} from '../types/interval';
import {stringValue} from '../../../util';

const scaleBindings:TransformCompiler = {
  clippedGroup: true,

  has: function(sel) {
    return sel.bind && sel.bind === 'scales';
  },

  parse: function(model, def, sel) {
    if (sel.type !== 'interval') {
      warn('Scale bindings are currently only supported for interval selections.');
      return;
    }

    let scales = model.component.scale,
        bound:Channel[] = sel.scales = [];

    sel.project.forEach(function(p) {
      let channel = p.encoding,
          scale = scales[channel] && scales[channel].main;

      if (!scale || !hasContinuousDomain(scale.type)) {
        warn('Scale bindings are currently only supported for scales with continuous domains.');
        return;
      }

      scale.domainRaw = {signal: channelSignalName(sel, channel)};
      bound.push(channel);
    });
  },

  topLevelSignals: function(model, sel, signals) {
    return signals.concat(sel.scales.map((channel) => {
      return {name: channelSignalName(sel, channel)};
    }));
  },

  signals: function(model, sel, signals) {
    let name = sel.name;
    signals = signals.filter(function(s) {
      return s.name !== name + INTERVAL_SIZE &&
        s.name !== name + TUPLE && s.name !== MODIFY;
    });

    sel.scales.forEach(function(channel) {
      let signal = signals.filter((s) => s.name === name + '_' + channel)[0];
      signal.push = 'outer';
      delete signal.value;
      delete signal.update;
    });

    return signals;
  }
};

export {scaleBindings as default};

export function domain(model: UnitModel, channel: Channel) {
  let scale = stringValue(model.scaleName(channel));
  return `domain(${scale})`;
}
