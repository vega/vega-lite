import {UnitModel} from '../unit';
import * as s from './';
import * as u from '../../util';

// _id should be exported as __id to prevent conflicts with Vega tuples.
export function fieldName(p) {
  return p.field === '_id' ? '__id' : p.field;
}

// TODO: Support s.Levels.VISUAL
export function parse(model:UnitModel, sel: s.Selection) {
  // Fold project definition:
  // {fields: [], channels: []} --> [{channel: }, {field: }]
  sel.project = (sel.project.fields || []).map(function(f) { return { field: f }; })
    .concat((sel.project.channels || []).map(function(c) {
      return { channel: c, field: model.field(c) };
    }));

  if (sel.type === s.Types.SINGLE) {
    sel.predicate = sel.project.map(function(p) {
      return 'datum.' + p.field + ' === ' + sel.name + '.' + fieldName(p)
    }).join(' && ');
  } else if (sel.type === s.Types.MULTI) {
    sel.predicate = sel.project.map(function(p) {
      return 'indata(' + u.str(s.storeName(sel)) + ', datum.' + p.field +
        ', ' + u.str(fieldName(p)) + ')';
    }).join(' && ');
  }
}

export function assembleSignals(_, sel: s.Selection, trigger) {
  var datum = '(eventItem().isVoronoi ? datum.datum : datum)';

  var expr = sel.project.map(function(p) {
    return fieldName(p) + ': ' + datum + '.' + p.field;
  }).join(', ');

  trigger.streams[0].expr = '{_unitID: unit._id, ' + expr + ', ts: now()}';
}