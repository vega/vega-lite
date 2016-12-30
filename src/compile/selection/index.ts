import {SelectionSpec, SelectionComponent, SelectionDomain,
        SelectionResolutions, SelectionNames} from '../../selection';
import {UnitModel} from '../unit';
import {Channel} from '../../channel';
import {Dict, extend, stringValue, isString} from '../../util';
import * as types from './type';
import {SelectionCompiler} from './type';
import {selector as parseSelector} from 'vega-parser';
import {VgData} from '../../vega.schema';

export const UNIT_SIGNAL:any = {
  name: 'unit',
  value: {},
  on: [{events: 'mousemove', update: 'group()'}]
};

export function parseUnitSelection(model: UnitModel, spec: Dict<SelectionSpec>) {
  let selections: Dict<SelectionComponent> = {};
  for (let name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    let def = spec[name], type = def.type;
    let sel = selections[name] = extend({
      name: name,
      type: type,
      domain: def.domain || SelectionDomain.DATA,
      predicate: def.predicate,
      bind: def.bind,
      resolve: SelectionResolutions.SINGLE
    }, types[type].parse(model, def));

    if (isString(sel.events)) {
      // TODO: Scope source.
      sel.events = parseSelector(sel.events);
    }

    // Fold project definition:
    // {fields: [], encodings: []} --> [{encoding: }, {field: }]
    // TODO: map from field to channel?
    sel.project = (sel.project.fields || [])
      .map(function(f: string) { return {field: f}; })
      .concat((sel.project.encodings || [])
        .map(function(c: Channel) { return {encoding: c, field: model.field(c)}; }));
  }

  return selections;
}

export function assembleUnitSignals(model: UnitModel, signals: any[]) {
  let selections = model.component.selection;
  for (let name in selections) {
    if (!selections.hasOwnProperty(name)) {
      continue;
    }

    let sel = selections[name], type = compiler(sel);
    signals.push.apply(signals, type.signals(model, sel));
    signals.push({
      name: name + SelectionNames.TUPLE,
      on: [{
        events: {signal: name},
        update: '{unit: unit.datum && unit.datum._id, ' +
          type.tupleExpr(model, sel) + '}'
      }]
    }, {
      name: name + SelectionNames.MODIFY,
      on: [{
        events: {signal: name},
        update: 'modify(' + stringValue(name + SelectionNames.STORE) + ', ' +
          type.modifyExpr(model, sel) + ')'
      }]
    });
  }

  return signals;
}

export function assembleUnitData(model: UnitModel, data: VgData[]): VgData[] {
  return data
    .concat(Object.keys(model.component.selection)
      .map(function(k: string) {
        return {name: k + SelectionNames.STORE};
      }));
}

export function assembleUnitMarks(model: UnitModel, marks: any[]): any[] {
  let selections = model.component.selection;
  for (let name in selections) {
    if (selections.hasOwnProperty(name)) {
      let sel = selections[name];
      marks = compiler(sel).marks(model, sel, marks);
    }
  }

  return marks;
}

export function predicate(sel: SelectionComponent): string {
  const store = stringValue(sel.name + SelectionNames.STORE);
  return '!tuples(' + store + ').length || ' +
    compiler(sel).predicate + '(' + store + ', parent._id, datum, ' +
    stringValue(sel.resolve) + ')';
}

// Utility functions

function compiler(sel: SelectionComponent): SelectionCompiler {
  return types[sel.type];
}

// TODO: Remove this function in favour of config.
export function defaultValue(def: any, value: any) {
  return def !== undefined ? def : value;
}

export function invert(model: UnitModel, sel: SelectionComponent, channel: Channel, expr: string) {
  return sel.domain === SelectionDomain.DATA ?
    'invert(' + stringValue(model.scaleName(channel)) + ', ' + expr + ')' : expr;
}
