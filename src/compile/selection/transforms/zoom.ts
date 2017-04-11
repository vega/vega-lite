import {selector as parseSelector} from 'vega-event-selector';
import {Channel, X, Y} from '../../../channel';
import {stringValue} from '../../../util';
import {BRUSH as INTERVAL_BRUSH, projections as intervalProjections, SIZE as INTERVAL_SIZE} from '../interval';
import {SelectionComponent} from '../selection';
import {UnitModel} from './../../unit';
import {default as scalesCompiler, domain} from './scales';
import {TransformCompiler} from './transforms';

const ANCHOR = '_zoom_anchor',
      DELTA  = '_zoom_delta';

const zoom:TransformCompiler = {
  has: function(selCmpt) {
    return selCmpt.type === 'interval' && selCmpt.zoom !== undefined && selCmpt.zoom !== false;
  },

  signals: function(model, selCmpt, signals) {
    const name = selCmpt.name,
        delta = name + DELTA,
        {x, y} = intervalProjections(selCmpt),
        sx = stringValue(model.scaleName(X)),
        sy = stringValue(model.scaleName(Y));

    let events = parseSelector(selCmpt.zoom, 'scope');

    if (!scalesCompiler.has(selCmpt)) {
      events = events.map((e) => (e.markname = name + INTERVAL_BRUSH, e));
    }

    signals.push({
      name: name + ANCHOR,
      on: [{
        events: events,
        update: `{x: invert(${sx}, x(unit)), y: invert(${sy}, y(unit))}`
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
      onDelta(model, selCmpt, 'x', 'width', signals);
    }

    if (y !== null) {
      onDelta(model, selCmpt, 'y', 'height', signals);
    }

    const size = signals.filter((s:any) => s.name === name + INTERVAL_SIZE);
    if (size.length) {
      const sname = size[0].name;
      size[0].on.push({
        events: {signal: delta},
        update: `{x: ${sname}.x, y: ${sname}.y, ` +
          `width: ${sname}.width * ${delta} , ` +
          `height: ${sname}.height * ${delta}}`
      });
    }

    return signals;
  }
};

export {zoom as default};

function onDelta(model: UnitModel, selCmpt: SelectionComponent, channel: Channel, size: string, signals: any[]) {
  const name = selCmpt.name,
      signal:any = signals.filter((s:any) => s.name === name + '_' + channel)[0],
      scales = scalesCompiler.has(selCmpt),
      base = scales ? domain(model, channel) : signal.name,
      anchor = `${name}${ANCHOR}.${channel}`,
      delta  = name + DELTA,
      scale  = stringValue(model.scaleName(channel)),
      range  = `[${anchor} + (${base}[0] - ${anchor}) * ${delta}, ` +
        `${anchor} + (${base}[1] - ${anchor}) * ${delta}]`,
      lo = `invert(${scale}` + (channel === X ? ', 0' : `, unit.${size}`) + ')',
      hi = `invert(${scale}` + (channel === X ? `, unit.${size}` : ', 0') + ')';

  signal.on.push({
    events: {signal: delta},
    update: scales ? range : `clampRange(${range}, ${lo}, ${hi})`
  });
}
