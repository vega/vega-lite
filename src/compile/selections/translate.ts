/// <reference path="../../../typings/vega.d.ts"/>
import {UnitModel} from '../unit';
import * as s from './';
import * as u from '../../util';
import {parse as parseEvents} from 'vega-event-selector';

function anchorName(sel: s.Selection) {
  return sel.name + '_anchor';
}

function deltaName(sel: s.Selection) {
  return sel.name + '_delta';
}

function zeroName(sel: s.Selection) {
  return sel.name + '_zero';
}

export function parse(_, sel: s.Selection) {
  var trans = sel.translate,
      on = parseEvents(u.isString(trans) ? trans :
        '[mousedown, window:mouseup] > window:mousemove');
  sel.translate = {on: on[0]};

  // Unset scale properties to allow smooth panning.
  if (sel.scales) {
    sel.project.forEach(function(p) {
      u.extend(p.scale, {
        round: false,  // Rounded scales round inversions too.
        nice: false,   // Causes "snapped" panning.
        zero: false    // Otherwise only the max extent will vary.
      });
    });
  }
}

export function assembleSignals(model: UnitModel, sel: s.Selection, trigger, __, signals) {
  var on = sel.translate.on,
      anchor = anchorName(sel),
      delta = deltaName(sel);

  signals.push({
    name: delta,
    init: {x: 0, y: 0},
    streams: [
      {
        type: on.start.str,
        expr: '{x: 0, y: 0}'
      },
      {
        type: on.str,
        expr: '{x: '+anchor+'.x - eventX(), y: eventY() - '+anchor+'.y}'
      }
    ]
  });

  signals.push({
    name: anchor,
    init: {expr: '{unit: unit}'},
    verbose: true,
    streams: [
      {
        type: on.start.str,
        expr: '{unit: unit}'
      },
      {
        type: '('+on.start.str+'), ('+on.str+')',
        expr: '{x: eventX(), y: eventY(), unit: '+anchor+'.unit}'
      }
    ]
  });
}

export function assembleData(model: UnitModel, sel: s.Selection, db) {
  var tx = db.transform, anchor = anchorName(sel), delta = deltaName(sel);
  var DIMS = { x: anchor + '.unit.width', y: anchor + '.unit.height' };

  sel.project.forEach(function(p) {
    var field = p.field, channel = p.channel,
        min = 'datum._min_'+field, max = 'datum._max_'+field;

    // To prevent aspect ratio drift, capture the current extents
    // and use them in the offset calculation. We need to insert the
    // delta signal in there to force recomputation. Start scale at
    // zero if there's no anchor.
    var expr = 'datum.min_'+field+'*(('+delta+'.x/'+delta+'.x)||1)';
    if (sel.scales) {
      expr = anchor+'.x ? ' + expr + ' : 0';
      p.scale.zero = false;
      p.scale.nice = false;
    }

    tx.push.apply(tx, [
      {type: 'formula', field: '_min_'+field, expr: expr},
      {
        type: 'formula',
        field: '_max_'+field,
        expr: 'datum.max_'+field+'*(('+delta+'.x/'+delta+'.x)||1)'
      },
      {
        type: 'formula',
        field: 'min_'+field,
        expr: min + ' + (' + max+'-'+min + ')*'+delta+'.'+channel+'/'+DIMS[channel]
      },
      {
        type: 'formula',
        field: 'max_'+field,
        expr: max + ' + (' + max+'-'+min + ')*'+delta+'.'+channel+'/'+DIMS[channel]
      }
    ]);
  });
}

// Wrap our marks in a clipped group
export function assembleMarks(model: UnitModel, sel: s.Selection, marks: any[]) {
  var mark = marks[0];
  marks[0] = {
    type: 'group',
    properties: {
      update: {
        width: {field: {group: 'width'}},
        height: {field: {group: 'height'}},
        clip: {value: true}
      }
    },
    marks: [mark]
  };
}