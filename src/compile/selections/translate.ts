/// <reference path="../../../typings/vega.d.ts"/>
import {UnitModel} from '../unit';
import * as s from './';
import * as u from '../../util';
import {parse as parseEvents} from 'vega-event-selector';
import {brushName, brushFilter} from './interval';

function anchorName(sel: s.Selection) {
  return sel.name + '_translate_anchor';
}

function deltaName(sel: s.Selection) {
  return sel.name + '_translate_delta';
}

function zeroName(sel: s.Selection) {
  return sel.name + '_translate_zero';
}

export function parse(model: UnitModel, sel: s.Selection) {
  var md = sel.interval ? '@' + brushName(sel) + ':mousedown' :
    s.eventName(model, 'mousedown') + brushFilter();

  var trans = sel.translate,
      on = parseEvents(u.isString(trans) ? trans :
        '[' + md + ', window:mouseup] > window:mousemove')[0];

  if (!sel.interval && on.start.str.indexOf(brushFilter()) < 0) {
    on.start.str += brushFilter();
  }

  on.start.str = s.eventName(model, on.start.str);
  on.str = '[' + on.start.str + ', ' + on.end.str + '] > ' + on.middle.str;
  sel.translate = {on: on};

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

export function assembleSignals(model: UnitModel, sel: s.Selection, _, __, signals) {
  var on = sel.translate.on,
      anchor = anchorName(sel),
      delta = deltaName(sel),
      unit = 'unit';

  signals.push({
    name: delta,
    init: {x: 0, y: 0},
    streams: [
      {
        type: on.start.str,
        expr: s.expr(model, unit, delta, '{x: 0, y: 0}')
      },
      {
        type: '[' + on.start.str + ', ' + on.end.str + '] > ' + on.middle.str,
        expr: s.expr(model, unit, delta, '{x: '+anchor+'.x - eventX(), y: eventY() - '+anchor+'.y}')
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
        expr: s.expr(model, unit, anchor, '{x: eventX(), y: eventY(), unit: unit}')
      },
      {
        type: '[' + on.start.str + ', ' + on.end.str + '] > ' + on.middle.str,
        expr: s.expr(model, unit, anchor, '{x: eventX(), y: eventY(), unit: '+anchor+'.unit}')
      }
    ]
  });
}

export function assembleData(model: UnitModel, sel: s.Selection, db) {
  var tx = db.transform,
      name = sel.name,
      anchor = anchorName(sel),
      delta = deltaName(sel),
      unit = anchor + '.unit';

  // The delta is relative to what dimension?
  var DIMS = {
    x: unit + '.width',
    y: unit + '.height'
  };

  // Translating scales/viewport and brush work in opposite directions.
  var DIR = {
    min: sel.scales ? 'min' : 'max',
    max: sel.scales ? 'max' : 'min'
  };

  sel.project.forEach(function(p) {
    var field = p.field,
      channel = p.channel,
      n = 'min_' + field,
      x = 'max_' + field,
      dmin = 'datum.' + n,
      dmax = 'datum.' + x,
      _dmin = 'datum._' + n,
      _dmax = 'datum._' + x;

    // We need to shim in the delta or brush signals to trigger a reeval
    var reeval = '((' + delta + '.ts/' + delta + '.ts) || ' +
      (sel.interval ? '(' + sel.name + '.ts/' + sel.name + '.ts) || ' : '') +
      '1)';

    var init = '(datum.min_' + field + ', datum.max_' + field + ') * ' + reeval;

    // For intervals, the delta should be interpretted based on the brush size.
    if (sel.interval) {
      DIMS[channel] = name + '.size_' + field
    }

    // To prevent aspect ratio drift, capture the current extents (dmin, dmax)
    // and use them in the offset calculation (_dmin, _dmax).
    tx.push.apply(tx, [
      {
        type: 'formula',
        field: '_' + n,
        expr: s.expr(model, unit, 'datum._' + n, (sel.scales) ? // Start scale at zero if there's no anchor.
          anchor + '.x ? ' + DIR.min + init + ' : 0' :
          DIR.min + init)
      },
      {
        type: 'formula',
        field: '_' + x,
        expr: s.expr(model, unit, 'datum._' + x,
          DIR.max + '(datum.max_' + field + ', datum.min_' + field + ') * ' + reeval)
      },
      {
        type: 'formula',
        field: n,
        expr: s.expr(model, unit, 'datum.' + n,
          _dmin + ' + (' + _dmax+'-'+_dmin + ')*'+delta+'.'+channel+'/'+DIMS[channel])
      },
      {
        type: 'formula',
        field: x,
        expr: s.expr(model, unit, 'datum.' + x,
          _dmax + ' + (' + _dmax+'-'+_dmin + ')*'+delta+'.'+channel+'/'+DIMS[channel])
      }
    ]);
  });
}

// Wrap our marks in a clipped group
export function assembleMarks(model: UnitModel, sel: s.Selection, marks: any[], _) {
  var mark = marks[0],
    props = mark && mark.properties,
    up = props && props.update,
    clip = up && up.clip;

  if (clip) return _;

  var children = marks.splice(0);
  marks.push({
    name: model.name('cell'),
    type: 'group',
    properties: {
      enter: {
        unitName: {value: model.name()}
      },
      update: {
        width: {field: {group: 'width'}},
        height: {field: {group: 'height'}},
        fill: {value: 'transparent'},
        clip: {value: true}
      }
    },
    marks: children
  });
  return children;
}