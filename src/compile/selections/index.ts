import {UnitModel} from '../unit';
import * as u from '../../util';
import * as tx from './transforms';
import {parse as parseEvents} from 'vega-event-selector';
export {tx as transforms};
const transforms = u.keys(tx);

export enum Types {
  POINT = 'point' as any,
  SET = 'set' as any
}

export enum Levels {
  DATA   = 'data'   as any,
  VISUAL = 'visual' as any
}

export interface Selection {
  name:  string;
  type:  Types;
  level: Levels;
  on: string;
  predicate: string;

  // Transforms
  project?: any;
  toggle?: any;
  scales?: any;
  interval?: any;
  translate?: any;
  zoom?: any;
  nearest?: any;
}

export function storeName(sel: Selection) {
  return sel.name + (sel.type === Types.SET ? '_db' : '');
}

// Namespace triggering events to occur in a specific unit
export function eventName(model: UnitModel, event?) {
  event = event || '';
  var cell = model.parent() ? 'cell' : 'root';
  return event.indexOf(':') < 0 ?
    '@' + model.name(cell) + ':' + event : event;
}

// "Namespace" expressions such that they're only evaluated in a specific unit
export function expr(model, datum, name, expr) {
  return 'if(' + datum + '.unitName === ' + u.str(model.name()) + ', ' +
    expr + ', ' + name + ')';
}

export function parse(model: UnitModel, spec) {
  return u.keys(spec).map(function(k) {
    var sel:Selection = spec[k];

    // Set default properties and instantiate default transforms.
    // We don't namespace the selection to facilitate merging during assembly.
    sel.name = k;
    sel.level = sel.level || Levels.DATA;

    if (sel.on) {
      var on = parseEvents(sel.on);
      sel.on = on.map(function(s) {
        if (s.event) {
          return eventName(model, s.event);
        } else if (s.start && s.start.event) {
          return '[' + eventName(model, s.start.str) + ', ' + s.end.str + '] > ' + s.middle.str;
        }
      }).join(', ');
    } else {
      sel.on = eventName(model, 'click');
    }

    if (sel.type === Types.SET && !sel.scales && !sel.interval) {
      sel.toggle = sel.toggle || true;
    }

    if (!sel.project) {
      sel.project = (sel.scales || sel.interval) ?
        { channels: ['x', 'y'] } : { fields: ['_id'] };
    }

    // Parse transformations.
    transforms.forEach(function(k) {
      if (!tx[k].parse || !sel[k]) return;
      tx[k].parse(model, sel);
    });

    return sel;
  });
}

export function assembleUnitSignals(model: UnitModel, signals) {
  var unit = !signals.length;

  model.selection().forEach(function(sel: Selection) {
    var trigger = {
      name: sel.name,
      verbose: true,  // TODO: how do we do better than this?
      init: {},
      streams: [{type: sel.on, expr: ''}]
    };

    var clear = {
      name: sel.name + '_clear',
      verbose: true,
      init: true,
      streams: [
        {type: sel.on, expr: 'true'}
      ]
    };

    transforms.forEach(function(k) {
      if (!tx[k].assembleSignals || !sel[k]) return;
      tx[k].assembleSignals(model, sel, trigger, clear, signals);
    });

    if (trigger.name) signals.push(trigger);

    // We only need the clear signal if we're using a points store.
    // Transforms can clear out signal names to not have them added.
    if (sel.type === Types.SET && clear.name) {
      signals.push(clear);
    }
  });

  // TODO: Get correct name for unit's enclosing group (where scales are defined).
  if (unit) {
    signals.unshift({
      name: 'unit',
      init: { _id: -1, width: 1, height: 1 },
      streams: [{
        type: 'mousemove',
        expr: 'eventGroup()'
      }]
    });
  }

  return signals;
}

export function assembleCompositeSignals(model, units) {
  var signals = {};

  units.forEach(function(sg) {
    var s = signals[sg.name];
    if (s && s.name !== 'unit') {
      s.streams.push.apply(s.streams, sg.streams);
    } else {
      signals[sg.name] = sg;
    }
  });

  return u.vals(signals);
}

export function assembleData(model: UnitModel, data) {
  model.selection().forEach(function(sel: Selection) {
    if (sel.type !== Types.SET) return;
    var db = {
      name: storeName(sel),
      transform: [],
      modify: [
        {type: 'clear', test: sel.name + '_clear'}
      ]
    };

    transforms.forEach(function(k) {
      if (!tx[k].assembleData || !sel[k]) return;
      tx[k].assembleData(model, sel, db, data);
    });

    data.unshift(db);
  });
  return data;
}

export function assembleMarks(model: UnitModel, marks: any[]) {
  var children = marks;
  model.selection().forEach(function(sel: Selection) {
    transforms.forEach(function(k) {
      if (!tx[k].assembleMarks || !sel[k]) return;
      children = tx[k].assembleMarks(model, sel, marks, children);
    });
  });
  return marks;
}