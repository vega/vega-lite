import {TransformCompiler} from './';
import {SelectionComponent} from '../../../selection';
import {warn} from '../../../log';
import {hasContinuousDomain} from '../../../scale';
import {Channel} from '../../../channel';
import {NS as NAMES} from '../';
import {NS as INTERVAL} from '../types/interval';
import {VgExtentTransform} from '../../../vega.schema';

export const NS = '_ext';

const scaleBindings:TransformCompiler = {
  has: function(sel) {
    return sel.bind && sel.bind === 'scales';
  },

  parse: function(model, def, sel) {
    if (sel.type !== 'interval') {
      warn('Scale bindings are currently only supported for interval selections.');
      return;
    }

    let data = model.component.data,
        scales = model.component.scale,
        bound:Channel[] = [];

    sel.project.forEach(function(p) {
      let channel = p.encoding,
          scale = scales[channel] && scales[channel].main;

      if (!scale) {
        return;
      }

      if (!hasContinuousDomain(scale.type)) {
        warn('Scale bindings are currently only supported for scales with continuous domains.');
        return;
      }

      let domain:any = scale.domain,
          table = domain.data,
          extents = data.extents || (data.extents = {}),
          signal = extentSignal(sel, channel),
          extent:VgExtentTransform;

      extents[table] = extents[table] || [];
      extents[table].push(extent = {
        type: 'extent',
        field: domain.field || domain.fields,
        signal: signal
      });

      scale.domain = {signal: signal};
      bound.push(channel);
    });
  },

  signals: function(model, sel, signals) {
    let name = sel.name;
    return signals.filter(function(s) {
      return s.name !== name + INTERVAL.SIZE &&
        s.name !== name + NAMES.TUPLE && s.name !== NAMES.MODIFY;
    });
  }
};

export {scaleBindings as default};

export function extentSignal(sel: SelectionComponent, channel: Channel) {
  return sel.name + NS + '_' + channel;
}
