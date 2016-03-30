import {UnitModel} from '../unit';
import * as u from '../../util';
import * as tx from './transforms';
import {parse as parseEvtSelector} from 'vega-event-selector';
import {Model, isLayerModel} from '../model';
import {AREA, LINE} from '../../mark';
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

export enum Resolutions {
  SINGLE = 'single' as any,
  SELF = 'self' as any,
  UNION  = 'union'  as any,
  INTERSECT = 'intersect' as any,
  UNION_OTHERS = 'union_others' as any,
  INTERSECT_OTHERS = 'intersect_others' as any
}

export interface Selection {
  name:  string;
  _name: string;
  _model: Model;
  _marks: Model;  // HACK to assembleMark for O+D detail unit.
  type:  Types;
  level: Levels;
  on: string;
  predicate: string;
  resolve?: Resolutions;

  // Transforms
  project?: any;
  toggle?: any;
  scales?: any;
  interval?: any;
  translate?: any;
  zoom?: any;
  nearest?: any;
}

export function modelName(model: UnitModel) {
  var parent = model.parent(),
      mark = model.mark();
  return parent && isLayerModel(parent) && /*mark !== AREA && */mark !== LINE ?
    parent.name.bind(parent) : model.name.bind(model);
}

export function storeName(sel: Selection) {
  return sel.name + (sel.type === Types.SET ? '_db' : '');
}

// Namespace triggering events to occur in a specific unit
export function eventName(model: UnitModel, event?) {
  event = event || '';
  var mark = model.mark(),
    cell = model.parent() ?
      /*mark === AREA || */mark === LINE ? 'pathgroup' : 'cell' :
      'root';

  return event.indexOf(':') < 0 ?
    '@' + modelName(model)(cell) + ':' + event : event;
}

// "Namespace" expressions such that they're only evaluated in a specific unit
export function expr(model, datum, name, expr) {
  return 'if(' + datum + '.unitName === ' + u.str(modelName(model)()) + ', ' +
    expr + ', ' + name + ')';
}

export function parse(model: UnitModel, spec) {
  return u.keys(spec).map(function(k) {
    var sel:Selection = spec[k];
    if (sel.name) return sel;

    // Set default properties and instantiate default transforms.
    // We don't namespace the selection to facilitate merging during assembly.
    sel.resolve = sel.resolve || Resolutions.SINGLE;
    sel.level = sel.level || Levels.DATA;
    sel.name  = sel.resolve === Resolutions.SINGLE ? k : model.name(k);
    sel._name = k;
    sel._model = model;
    parseSelectionType(model, sel);

    // Parse transformations.
    transforms.forEach(function(k) {
      if (!tx[k].parse || !sel[k]) return;
      tx[k].parse(model, sel);
    });

    return sel;
  });
}

// HACK FOR INFOVIS: Maps new syntax to old syntax.
// TODO: Migrate selections codebase to new syntax entirely.
function parseSelectionType(model: Model, sel) {
  if (sel.type === 'list') {
    sel.type = Types.SET;
    sel.toggle = sel.toggle || true;
  } else if (sel.type === 'interval') {
    sel.type = Types.SET;
    if (sel.init && sel.init.scales) {
      sel.scales = true;
    } else {
      sel.interval = true;
    }
  }

  if (!sel.project) {
    sel.project = (sel.scales || sel.interval) ?
      { channels: ['x', 'y'] } : { fields: ['_id'] };
  }
}

export function assembleEvent(model: UnitModel, sel: Selection) {
  if (sel.on) {
    var on = parseEvtSelector(sel.on);
    return on.map(function(s) {
      if (s.event) {
        return eventName(model, s.event);
      } else if (s.start && s.start.event) {
        return '[' + eventName(model, s.start.str) + ', ' + s.end.str + '] > ' + s.middle.str;
      }
    }).join(', ');
  } else {
    return eventName(model, 'click');
  }
}

export function assembleUnitSignals(model: UnitModel, signals) {
  var unit = !signals.length;

  model.selection().forEach(function(sel: Selection) {
    if (sel._model !== model) return;
    var on = assembleEvent(model, sel);

    var trigger = {
      name: sel.name,
      verbose: true,  // TODO: how do we do better than this?
      init: {},
      streams: [{type: on, expr: ''}]
    };

    var clear = {
      name: sel.name + '_clear',
      verbose: true,
      init: true,
      streams: [
        {type: on, expr: 'true'}
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
  var signals = {}, registry = {}, h;

  units.forEach(function(unit) {
    var s = signals[unit.name],
        r = registry[unit.name] || (registry[unit.name] = {});
    if (s && s.name !== 'unit') {
      unit.streams.forEach(function(stream) {
        if (!r[h=u.hash(stream)]) {
          s.streams.push(stream);
          r[h] = true;
        }
      });
    } else {
      signals[unit.name] = unit;
      unit.streams.forEach((stream) => r[u.hash(stream)] = true);
    }
  });

  return u.vals(signals);
}

export function assembleUnitData(model: UnitModel, data, pre) {
  model.selection().forEach(function(sel: Selection) {
    if (sel.type !== Types.SET) return;
    if (sel._model !== model) return;

    // Compile scales selections after source data
    if ((pre && sel.scales) || (!pre && !sel.scales)) return;
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

export function assembleCompositeData(model, units) {
  var data = {}, registry = {};

  units.forEach(function(unit) {
    var d = data[unit.name],
        r = registry[unit.name] || (registry[unit.name] = {}),
        h;


    function mergeTransforms(t) {
      if (t.type === 'aggregate') {
        if (!r.aggregate) {
          d.transform.push(r.aggregate = t);
        }

        u.extend(r.aggregate.summarize, t.summarize);
      } else if (!r[h=u.hash(t)]) {
        d.transform.push(t);
        r[h] = true;
      }
    };

    function populateRegistry(t) {
      if (t.type === 'aggregate') r.aggregate = t;
      else r[u.hash(t)] = true;
    }

    if (!d) {
      unit.transform.forEach(populateRegistry);
      unit.modify.forEach(populateRegistry);
      return (data[unit.name] = unit);
    } else {
      unit.transform.forEach(mergeTransforms);
      unit.modify.forEach(mergeTransforms);
    }
  });

  return u.vals(data);
}

export function assembleMarks(model: UnitModel, marks: any[]) {
  var children = marks;
  model.selection().forEach(function(sel: Selection) {
    if (sel._model !== model && sel._marks !== model) return;
    transforms.forEach(function(k) {
      if (!tx[k].assembleMarks || !sel[k]) return;
      children = tx[k].assembleMarks(model, sel, marks, children);
    });
  });
  return marks;
}