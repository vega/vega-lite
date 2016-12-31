import {SelectionSpec, SelectionComponent, SelectionDomain,
        SelectionResolutions} from '../../selection';
import {Model} from '../model';
import {UnitModel} from '../unit';
import {Channel} from '../../channel';
import {Dict, extend, stringValue, isString} from '../../util';
import * as types from './types';
import {TypeCompiler} from './types';
import {transforms} from './transforms';
import {selector as parseSelector} from 'vega-parser';
import {VgData} from '../../vega.schema';

export const NS = {
  STORE: '_store',
  TUPLE: '_tuple',
  MODIFY: '_modify'
};

export function parseUnitSelection(model: UnitModel, spec: Dict<SelectionSpec>) {
  let selections: Dict<SelectionComponent> = {};
  for (let name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    let def = spec[name],
        type:TypeCompiler = types[def.type],
        domain:SelectionDomain = 'data',
        resolve:SelectionResolutions = 'single';

    extend(def, type.parse(model, def));
    let sel = selections[name] = extend(def, {
      name: name,
      domain: def.domain || domain,
      resolve: resolve
    }) as SelectionComponent;

    if (isString(sel.events)) {
      // TODO: Scope source.
      sel.events = parseSelector(sel.events);
    }

    for (let t in transforms) {
      if (transforms[t].has(sel) && transforms[t].parse) {
        transforms[t].parse(model, def, sel);
      }
    }
  }

  return selections;
}

export function assembleUnitSignals(model: UnitModel, signals: any[]) {
  let selections = model.component.selection;
  for (let name in selections) {
    if (!selections.hasOwnProperty(name)) {
      continue;
    }

    let sel = selections[name],
        type = compiler(sel),
        tupleExpr = type.tupleExpr(model, sel),
        modifyExpr = type.modifyExpr(model, sel);

    signals.push.apply(signals, type.signals(model, sel));

    for (let t in transforms) {
      if (!transforms[t].has(sel)) {
        continue;
      }

      let tx = transforms[t];
      if (tx.signals) {
        signals = tx.signals(model, sel, signals);
      }
      if (tx.modifyExpr) {
        modifyExpr = tx.modifyExpr(model, sel, modifyExpr);
      }
    }

    signals.push({
      name: name + NS.TUPLE,
      on: [{
        events: {signal: name},
        update: '{unit: unit.datum && unit.datum._id, ' + tupleExpr + '}'
      }]
    }, {
      name: name + NS.MODIFY,
      on: [{
        events: {signal: name},
        update: 'modify(' + stringValue(name + NS.STORE) + ', ' +
          modifyExpr + ')'
      }]
    });
  }

  return signals;
}

export function assembleTopLevelSignals(model: Model) {
  let selections = model.component.selection,
      signals:any[] = [{
        name: 'unit',
        value: {},
        on: [{events: 'mousemove', update: 'group()'}]
      }];

  for (let name in selections) {
    if (selections[name].type === 'single') {
      signals.push({
        name: name,
        update: 'tuples(' + stringValue(name + NS.STORE) + ')[0]'
      });
    }
  }

  return signals;
}

export function assembleUnitData(model: UnitModel, data: VgData[]): VgData[] {
  return data
    .concat(Object.keys(model.component.selection)
      .map(function(k: string) {
        return {name: k + NS.STORE};
      }));
}

export function assembleUnitMarks(model: UnitModel, marks: any[]): any[] {
  let selections = model.component.selection;
  for (let name in selections) {
    if (selections.hasOwnProperty(name)) {
      let sel = selections[name], type = compiler(sel);
      marks = type.marks ? type.marks(model, sel, marks) : marks;
    }
  }

  return marks;
}

export function predicate(sel: SelectionComponent): string {
  const store = stringValue(sel.name + NS.STORE);
  return '!tuples(' + store + ').length || ' +
    compiler(sel).predicate + '(' + store + ', parent._id, datum, ' +
    stringValue(sel.resolve) + ')';
}

// Utility functions

function compiler(sel: SelectionComponent): TypeCompiler {
  return types[sel.type];
}

// TODO: Remove this function in favour of config.
export function defaultValue(def: any, value: any) {
  return def !== undefined && def !== true ? def : value;
}

export function invert(model: UnitModel, sel: SelectionComponent, channel: Channel, expr: string) {
  return sel.domain === 'data' ?
    'invert(' + stringValue(model.scaleName(channel)) + ', ' + expr + ')' : expr;
}
