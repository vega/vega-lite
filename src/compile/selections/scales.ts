import {UnitModel} from '../unit';
import * as s from './';
import * as u from '../../util';
import {domain as scaleDomain, scaleType} from '../scale';
import {ScaleType} from '../../scale';

// TODO: Support ordinal scales.
export function parse(model: UnitModel, sel: s.Selection) {
  sel.project.forEach(function(p, i) {
    var channel  = p.channel,
        fieldDef = model.fieldDef(channel),
        scale  = model.scale(channel),
        type   = scaleType(scale, fieldDef, channel, model.mark()),
        domain = scaleDomain(scale, model, channel),
        fieldName = domain.field;

    if (type === ScaleType.ORDINAL) return;
    u.extend(scale, {
      domain: {
        data: s.storeName(sel),
        field: ['min_'+fieldName, 'max_'+fieldName]
      }
    });

    sel.project[i].scale = scale;
  });

  if (sel.translate === undefined) sel.translate = true;
}

export function assembleSignals(_, sel: s.Selection, trigger, clear) {
  // Domain initialized selections don't need any signals.
  trigger.name = clear.name = null;
}

export function assembleData(_, sel: s.Selection, db) {
  var summarize = sel.project.reduce(function(obj, d) {
    return (obj[d.field] = ['min', 'max'], obj);
  }, {});

  db.source = 'source';  // TODO: should ref the enclosing unit's datasource.
  db.transform.push({ type: 'aggregate', summarize: summarize });
  db.modify.splice(0);   // Domain initialized selections don't need any modifiers.
}

