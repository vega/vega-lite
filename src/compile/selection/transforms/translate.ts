import {selector as parseSelector} from 'vega-event-selector';
import {Channel, X, Y} from '../../../channel';
import {stringValue} from '../../../util';
import {BRUSH as INTERVAL_BRUSH, projections as intervalProjections, SIZE as INTERVAL_SIZE} from '../interval';
import {channelSignalName, SelectionComponent} from '../selection';
import {UnitModel} from './../../unit';
import {default as scalesCompiler, domain} from './scales';
import {TransformCompiler} from './transforms';

const ANCHOR = '_translate_anchor',
      DELTA  = '_translate_delta';

const translate:TransformCompiler = {
  has: function(selCmpt) {
    return selCmpt.type === 'interval' && selCmpt.translate !== undefined && selCmpt.translate !== false;
  },

  signals: function(model, selCmpt, signals) {
    const name = selCmpt.name,
        scales = scalesCompiler.has(selCmpt),
        size = scales ? 'unit' : name + INTERVAL_SIZE,
        anchor = name + ANCHOR,
        {x, y} = intervalProjections(selCmpt);
    let events = parseSelector(selCmpt.translate, 'scope');

    if (!scales) {
      events = events.map((e) => (e.between[0].markname = name + INTERVAL_BRUSH, e));
    }

    signals.push({
      name: anchor,
      value: {},
      on: [{
        events: events.map((e) => e.between[0]),
        update: '{x: x(unit), y: y(unit), ' +
          `width: ${size}.width, height: ${size}.height` +

          (x !== null ? ', extent_x: ' + (scales ? domain(model, X) :
              `slice(${channelSignalName(selCmpt, 'x', 'visual')})`) : '') +

          (y !== null ? ', extent_y: ' + (scales ? domain(model, Y) :
              `slice(${channelSignalName(selCmpt, 'y', 'visual')})`) : '') + '}'
      }]
    }, {
      name: name + DELTA,
      value: {},
      on: [{
        events: events,
        update: `{x: x(unit) - ${anchor}.x, y: y(unit) - ${anchor}.y}`
      }]
    });

    if (x !== null) {
      onDelta(model, selCmpt, X, 'width', signals);
    }

    if (y !== null) {
      onDelta(model, selCmpt, Y, 'height', signals);
    }

    return signals;
  }
};

export {translate as default};

function onDelta(model: UnitModel, selCmpt: SelectionComponent, channel: Channel, size: 'width' | 'height', signals: any[]) {
  const name = selCmpt.name,
      signal:any = signals.filter((s:any) => s.name === channelSignalName(selCmpt, channel, 'visual'))[0],
      anchor = name + ANCHOR,
      delta  = name + DELTA,
      extent = `${anchor}.extent_${channel}`,
      range = `[${extent}[0] + ${delta}.${channel}, ` +
        `${extent}[1] + ${delta}.${channel}]`;

  signal.on.push({
    events: {signal: delta},
    update: scalesCompiler.has(selCmpt) ? range : `clampRange(${range}, 0, unit.${size})`
  });
}
