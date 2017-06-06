import {selector as parseSelector} from 'vega-event-selector';
import {Channel, X, Y} from '../../../channel';
import {stringValue} from '../../../util';
import {BRUSH as INTERVAL_BRUSH, projections as intervalProjections} from '../interval';
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
        hasScales = scalesCompiler.has(selCmpt),
        anchor = name + ANCHOR,
        {x, y} = intervalProjections(selCmpt);
    let events = parseSelector(selCmpt.translate, 'scope');

    if (!hasScales) {
      events = events.map((e) => (e.between[0].markname = name + INTERVAL_BRUSH, e));
    }

    signals.push({
      name: anchor,
      value: {},
      on: [{
        events: events.map((e) => e.between[0]),
        update: '{x: x(unit), y: y(unit)' +
          (x !== null ? ', extent_x: ' + (hasScales ? domain(model, X) :
              `slice(${channelSignalName(selCmpt, 'x', 'visual')})`) : '') +

          (y !== null ? ', extent_y: ' + (hasScales ? domain(model, Y) :
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

function getSign(selCmpt: SelectionComponent, channel: Channel) {
  if (scalesCompiler.has(selCmpt)) {
    return channel === Y ? '+' : '-';
  }
  return '+';
}

function onDelta(model: UnitModel, selCmpt: SelectionComponent, channel: Channel, size: 'width' | 'height', signals: any[]) {
  const name = selCmpt.name,
      hasScales = scalesCompiler.has(selCmpt),
      signal:any = signals.filter((s:any) => {
        return s.name === channelSignalName(selCmpt, channel, hasScales ? 'data' : 'visual');
      })[0],
      anchor = name + ANCHOR,
      delta  = name + DELTA,
      sign = getSign(selCmpt, channel),
      offset = sign + (hasScales ?
        ` span(${anchor}.extent_${channel}) * ${delta}.${channel} / unit.${size}` :
        ` ${delta}.${channel}`),
      extent = `${anchor}.extent_${channel}`,
      range = `[${extent}[0] ${offset}, ${extent}[1] ${offset}]`;

  signal.on.push({
    events: {signal: delta},
    update: hasScales ? range : `clampRange(${range}, 0, unit.${size})`
  });
}
