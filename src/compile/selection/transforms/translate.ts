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
  ANCHOR: '_translate_anchor',
  DELTA: '_translate_delta'
};

const translate:TransformCompiler = {
  has: function(sel) {
    return sel.translate !== undefined && sel.translate !== false;
  },

  signals: function(model, sel, signals) {
    if (sel.type !== 'interval') {
      warn('translate is currently only supported for interval selections.');
      return signals;
    }

    let name = sel.name,
        scales = scalesCompiler.has(sel),
        size = scales ? 'unit' : name + INTERVAL.SIZE,
        anchor = name + NS.ANCHOR,
        mousedown = (scales ? '' : '@' + name + INTERVAL.BRUSH + ':') + 'mousedown',
        {x, y} = intervalProjections(sel);

    signals.push({
      name: anchor,
      value: {},
      on: [{
        events: parseSelector(mousedown, 'scope'),
        update: '{x: x(unit), y: y(unit), ' +
          'width: ' + size + '.width, height: ' + size + '.height, ' +

          (x !== null ? 'extent_x: ' + (scales ? domain(model, X) :
              'slice(' + name + '_x)') + ', ' : '') +

          (y !== null ? 'extent_y: ' + (scales ? domain(model, Y) :
              'slice(' + name + '_y)') + ', ' : '') + '}'
      }]
    }, {
      name: name + NS.DELTA,
      value: {},
      on: [{
        events: parseSelector('[' + mousedown + ', window:mouseup] > window:mousemove', 'scope'),
        update: '{x: x(unit) - ' + anchor + '.x, y: y(unit) - ' + anchor + '.y}'
      }]
    });

    if (x !== null) {
      onDelta(model, sel, X, 'width', signals);
    }

    if (y !== null) {
      onDelta(model, sel, Y, 'height', signals);
    }

    return signals;
  }
};

export {translate as default};

function getSign(sel: SelectionComponent, channel: Channel) {
  let s = channel === X ? '+' : '-';
  if (scalesCompiler.has(sel)) {
    s = s === '+' ? '-' : '+';
  }
  return ' ' + s + ' ';
}

function onDelta(model: UnitModel, sel: SelectionComponent, channel: Channel, size: string, signals: any[]) {
  let name = sel.name,
      signal:any = signals.filter((s:any) => s.name === name + '_' + channel)[0],
      anchor = name + NS.ANCHOR,
      delta  = name + NS.DELTA,
      scale  = stringValue(model.scaleName(channel)),
      extent = '.extent_' + channel,
      sign = getSign(sel, channel),
      offset = sign + 'abs(span(' + anchor + extent + ')) * ' +
        delta + '.' + channel + ' / ' + anchor + '.' + size,
      range = '[' + anchor + extent + '[0]' + offset + ', ' +
        anchor + extent + '[1]' + offset + ']',
      lo = 'invert(' + scale + (channel === X ? ', 0' : ', unit.' + size) + ')',
      hi = 'invert(' + scale + (channel === X ? ', unit.' + size : ', 0') + ')';

  signal.on.push({
    events: {signal: delta},
    update: scalesCompiler.has(sel) ? range :
      'clampRange(' + range + ', ' + lo + ', ' + hi + ')'
  });
}
