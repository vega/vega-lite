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
  var x = null, y = null;
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
    name: anchorName(sel),
    init: {x: 0, y: 0},
    streams: [{
      type: on,
      expr: '{' +
       (x ? 'x: iscale(' + x.scale + ', eventX(), unit), ' : '') +
       (y ? 'y: iscale(' + y.scale + ', eventY(), unit)' : '') + '}'
    }]
  });

  signals.push({
    name: deltaName(sel),
    init: 1.0,
    streams: [{
      type: on,
      expr: 'pow(1.001, event.deltaY*pow(16, event.deltaMode))'
    }]
  });
}

export function assembleData(model: UnitModel, sel: s.Selection, db) {
  var tx = db.transform,
      anchor = anchorName(sel),
      delta  = deltaName(sel);

  sel.project.forEach(function(p) {
    var field = p.field,
      channel = p.channel,
      anch = anchor + '.' + channel;

    tx.push.apply(tx, [
      {
        type:  'formula',
        field: 'min_' + field,
        expr: '(datum.min_' + field + ' - ' + anch + ') * ' + delta + ' + ' + anch
      },
      {
        type:  'formula',
        field: 'max_' + field,
        expr: '(datum.max_' + field + ' - ' + anch + ') * ' + delta + ' + ' + anch
      },
    ]);
  });
}