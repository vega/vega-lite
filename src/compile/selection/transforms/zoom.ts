import {selector as parseSelector} from 'vega-parser';
import {UnitModel} from './../../unit';
import {SelectionComponent} from '../../../selection';
import {X, Y, Channel} from '../../../channel';
import {stringValue} from '../../../util';
import {warn} from '../../../log';
import {TransformCompiler} from './';
import {default as scalesCompiler, domain} from './scales';
import {projections as intervalProjections, NS as INTERVAL} from '../types/interval';

const NS = {
  ANCHOR: '_zoom_anchor',
  DELTA: '_zoom_delta'
};

const zoom:TransformCompiler = {
  has: function(sel) {
    return sel.zoom !== undefined && sel.zoom !== false;
  },

  signals: function(model, sel, signals) {
    if (sel.type !== 'interval') {
      warn('zoom is currently only supported for interval selections.');
      return signals;
    }

    let name = sel.name,
        delta = name + NS.DELTA,
        events = parseSelector(sel.zoom, 'scope'),
        {x, y} = intervalProjections(sel);

    if (!scalesCompiler.has(sel)) {
      events = events.map((e) => (e.markname = name + INTERVAL.BRUSH, e));
    }

    signals.push({
      name: name + NS.ANCHOR,
      on: [{
        events: events,
        update: '{x: invert(' + stringValue(model.scaleName(X)) + ', x(unit)), ' +
          'y: invert(' + stringValue(model.scaleName(Y)) + ', y(unit))}'
      }]
    }, {
      name: delta,
      on: [{
        events: events,
        force: true,
        update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
      }]
    });

    if (x !== null) {
      onDelta(model, sel, 'x', 'width', signals);
    }

    if (y !== null) {
      onDelta(model, sel, 'y', 'height', signals);
    }

    let size = signals.filter((s:any) => s.name === name + INTERVAL.SIZE);
    if (size.length) {
      let sname = size[0].name;
      size[0].on.push({
        events: {signal: delta},
        update: '{x: ' + sname + '.x, y: ' + sname + '.y, ' +
          'width: '  + sname + '.width * ' + delta + ', ' +
          'height: ' + sname + '.height * ' + delta + '}'
      });
    }

    return signals;
  }
};

export {zoom as default};

function onDelta(model: UnitModel, sel: SelectionComponent, channel: Channel, size: string, signals: any[]) {
  let name = sel.name,
      signal:any = signals.filter((s:any) => s.name === name + '_' + channel)[0],
      scales = scalesCompiler.has(sel),
      base = scales ? domain(model, channel) : signal.name,
      anchor = name + NS.ANCHOR + '.' + channel,
      delta  = name + NS.DELTA,
      scale  = stringValue(model.scaleName(channel)),
      range  = '[' + anchor + ' + ' +
        '(' + base + '[0] - ' + anchor + ') * ' + delta + ', ' +
        anchor + ' + (' + base + '[1] - ' + anchor + ') * ' + delta + ']',
      lo = 'invert(' + scale + (channel === X ? ', 0' : ', unit.' + size) + ')',
      hi = 'invert(' + scale + (channel === X ? ', unit.' + size : ', 0') + ')';

  signal.on.push({
    events: {signal: delta},
    update: scales ? range : 'clampRange(' + range + ', ' + lo + ', ' + hi + ')'
  });
}
