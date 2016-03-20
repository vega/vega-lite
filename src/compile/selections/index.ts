import {UnitModel} from '../unit';
import * as u from '../../util';
import * as tx from './transforms';
export {tx as transforms};
const transforms = u.keys(tx);

export enum Types {
  SINGLE = 'single' as any,
  MULTI  = 'multi' as any
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
}

export function storeName(sel: Selection) {
  return sel.name + (sel.type === Types.MULTI ? '_db' : '');
}

export function parse(spec, model: UnitModel) {
  return u.keys(spec).map(function(k) {
    var sel:Selection = spec[k];

    // Set default properties and instantiate default transforms.
    sel.name = k;
    sel.level = sel.level || Levels.DATA;

    if (!sel.on) {
      sel.on = sel.interval ?
        '[mousedown, window:mouseup] > window:mousemove' : 'click';
    }

    if (sel.type === Types.MULTI && !sel.scales && !sel.interval) {
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

export function assembleSignals(model: UnitModel, signals) {
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
    if (sel.type === Types.MULTI && clear.name) {
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
        expr: 'eventGroup(' + u.str(model.name('root')) + ')'
      }]
    });
  }

  return signals;
}

export function assembleData(model: UnitModel, data) {
  model.selection().forEach(function(sel: Selection) {
    if (sel.type !== Types.MULTI) return;
    var db = {
      name: storeName(sel),
      transform: [],
      modify: [
        {type: 'clear', test: sel.name+'_clear'}
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
  model.selection().forEach(function(sel: Selection) {
    transforms.forEach(function(k) {
      if (!tx[k].assembleMarks || !sel[k]) return;
      tx[k].assembleMarks(model, sel, marks);
    });
  });
}