import {UnitModel} from '../unit';
import {X, Y} from '../../channel';
import * as s from './';
import * as u from '../../util';
import {parse as parseEvents} from 'vega-event-selector';

function startName(sel: s.Selection) {
  return sel.name + '_start';
}

function endName(sel: s.Selection) {
  return sel.name + '_end';
}

// TODO: resolve arg.
export function parse(model: UnitModel, sel: s.Selection) {
  sel.predicate = 'inrangeselection(' + u.str(s.storeName(sel)) + ', datum, "union", group._id)';
}

export function assembleSignals(model: UnitModel, sel: s.Selection, trigger, clear, signals) {
  var on = parseEvents(sel.on)[0],
    start = startName(sel), end = endName(sel),
    expr = '{x: clamp(eventX(unit), 0, unit.width), ' +
      'y: clamp(eventY(unit), 0, unit.height), unit: unit}',
    x = false, y = false;

  sel.project.forEach(function(p) {
    if (p.channel === X) x = true;
    if (p.channel === Y) y = true;
  });

  signals.push({
    name: start,
    init: { expr: '{unit: unit}' },
    streams: [{ type: on.start.str, expr: expr }]
  });

  signals.push({
    name: end,
    init: {},
    streams: [
      { type: start, expr: start },
      { type: on.str, expr: expr }
    ]
  });

  // Trigger will now contain the data extents of the brush
  trigger.streams[0] = {
    type: start + ', ' + end,
    expr: '{' +
    'start_x: iscale("x", ' + start + '.x, unit), ' +
    'start_y: iscale("y", ' + start + '.y, unit), ' +
    'end_x: iscale("x", ' + end + '.x, unit), ' +
    'end_y: iscale("y", ' + end + '.y, unit), ' +
    (x ? 'x: ' + u.str(model.field(X)) + ', ' : '') +
    (y ? 'y: ' + u.str(model.field(Y)) + ', ' : '') +
    '_unitID: ' + start + '.unit._id}'
  };

  clear.name = null;  // Brushes are upserted.
}

export function assembleData(model: UnitModel, sel: s.Selection, db) {
  db.modify = [{ type: 'upsert', signal: sel.name, field: '_unitID' }];
}
