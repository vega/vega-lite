import {UnitModel} from './../../unit';
import {SelectionComponent, SelectionTypes} from '../../../selection';
import {X, Y} from '../../../channel';
import {stringValue} from '../../../util';
import {warn} from '../../../log';
import {TransformCompiler} from './';
import {projections as intervalProjections, NS as INTERVAL} from '../types/interval';

enum NS {
  ANCHOR = '_zoom_anchor' as any,
  DELTA  = '_zoom_delta' as any
}

const zoom:TransformCompiler = {
  signals: function(model: UnitModel, sel: SelectionComponent, signals: any[]) {
    if (sel.type !== SelectionTypes.INTERVAL) {
      warn('zoom is currently only supported for interval selections.');
      return signals;
    }

    let name = sel.name,
        delta = name + NS.DELTA,
        {x, y} = intervalProjections(sel);

    signals.push({
      name: name + NS.ANCHOR,
      on: [{
        events: 'wheel',
        update: '{x: invert(' + stringValue(model.scaleName(X)) + ', x(unit)), ' +
          'y: invert(' + stringValue(model.scaleName(Y)) + ', y(unit))}'
      }]
    }, {
      name: delta,
      on: [{
        events: 'wheel!',
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

function onDelta(model: UnitModel, sel: SelectionComponent, channel: string, size: string, signals: any[]) {
  let name = sel.name,
      signal:any = signals.filter((s:any) => s.name === name + '_' + channel)[0],
      anchor = name + NS.ANCHOR + '.' + channel,
      delta  = name + NS.DELTA,
      scale  = stringValue(model.scaleName(channel)),
      range  = '[' + anchor + ' + ' +
        '(' + signal.name + '[0] - ' + anchor + ') * ' + delta + ', ' +
        anchor + ' + (' + signal.name + '[1] - ' + anchor + ') * ' + delta + ']',
      lo = 'invert(' + scale + (channel === X ? ', 0' : ', unit.' + size) + ')',
      hi = 'invert(' + scale + (channel === X ? ', unit.' + size : ', 0') + ')';

  signal.on.push({
    events: {signal: delta},
    update: sel.bind && sel.bind.scales ? range :
      'clampRange(' + range + ', ' + lo + ', ' + hi + ')'
  });
}
