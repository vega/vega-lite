import {UnitModel} from '../unit';
import {X, Y} from '../../channel';
import * as s from './';
import * as u from '../../util';
import {brushName, brushFilter} from './interval';

function anchorName(sel: s.Selection) {
  return sel.name + '_zoom_anchor';
}

function deltaName(sel: s.Selection) {
  return sel.name + '_zoom_delta';
}

export function assembleSignals(model: UnitModel, sel: s.Selection, trigger, _, signals) {
  var anchor = anchorName(sel),
      delta  = deltaName(sel),
      x = null, y = null;
  sel.project.forEach(function(p) {
    if (p.channel === X) {
      x = { scale: u.str(model.scaleName(X)), field: p.field };
    }

    if (p.channel === Y) {
      y = { scale: u.str(model.scaleName(Y)), field: p.field };
    }
  });

  var on = (sel.interval ? '@' + brushName(sel) + ':' : s.eventName(model)) + 'wheel' +
    (!sel.interval ? brushFilter() : '');

  signals.push({
    name: anchor,
    init: {expr: '{x: 0, y: 0, unit: unit}'},
    streams: [{
      type: on,
      expr: s.expr(model, 'unit', anchor, '{' +
       (x ? 'x: iscale(' + x.scale + ', eventX(unit), unit), ' : '') +
       (y ? 'y: iscale(' + y.scale + ', eventY(unit), unit)' : '') + ', unit: unit}')
    }]
  });

  signals.push({
    name: delta,
    init: 1.0,
    streams: [{
      type: on,
      expr: s.expr(model, 'unit', delta, 'pow(1.001, event.deltaY*pow(16, event.deltaMode))')
    }]
  });
}

export function assembleData(model: UnitModel, sel: s.Selection, db) {
  var tx = db.transform,
      anchor = anchorName(sel),
      delta  = deltaName(sel),
      unit = anchor + '.unit';

  sel.project.forEach(function(p) {
    var field = p.field,
      channel = p.channel,
      anch = anchor + '.' + channel;

    tx.push.apply(tx, [
      {
        type:  'formula',
        field: 'min_' + field,
        expr: s.expr(model, unit, 'datum.min_' + field,
          '(datum.min_' + field + ' - ' + anch + ') * ' + delta + ' + ' + anch)
      },
      {
        type:  'formula',
        field: 'max_' + field,
        expr: s.expr(model, unit, 'datum.max_' + field,
          '(datum.max_' + field + ' - ' + anch + ') * ' + delta + ' + ' + anch)
      },
    ]);
  });
}