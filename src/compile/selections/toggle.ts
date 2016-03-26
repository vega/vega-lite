import {UnitModel} from '../unit';
import * as s from './';
import * as u from '../../util';
import {fieldName} from './project';

export function parse(_, sel: s.Selection) {
  if (sel.type !== s.Types.SET || sel.scales || sel.interval) {
    return (sel.toggle = null);
  }
}

export function assembleSignals(model: UnitModel, sel: s.Selection, trigger, clear, signals) {
  // Trigger contains the initial "on", which restarts the selections.
  // Toggle should append an additional stream for toggling.
  var streams = trigger.streams, expr = streams[0].expr;
  var on = u.isString(sel.toggle) ?
    s.eventName(sel.toggle) : s.assembleEvent(model, sel) + '[event.shiftKey]';

  streams.push({ type: on, expr: expr });
  clear.streams.push({ type: on, expr: 'false' });
}

export function assembleData(_, sel: s.Selection, db) {
  var toggle = { type: 'toggle', signal: sel.name, field: undefined };
  if (sel.resolve === s.Resolutions.SINGLE) {
    toggle.field = sel.project.map(function(p) {
      return fieldName(p);
    });
  }
  db.modify.push(toggle);
}