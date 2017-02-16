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

export const STORE = '_store',
  TUPLE  = '_tuple',
  MODIFY = '_modify';

export function parseUnitSelection(model: UnitModel, spec: Dict<SelectionSpec>) {
  let selections: Dict<SelectionComponent> = {},
      config = model.config().selection;

  for (let name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    let def = spec[name],
        cfg = config[def.type];

    // Set default values from config if a property hasn't been specified,
    // or if it is true. E.g., "translate": true should use the default
    // event handlers for translate. However, true may be a valid value for
    // a property (e.g., "nearest": true).
    for (let key in cfg) {
      if ((key === 'encodings' && def.fields) || (key === 'fields' && def.encodings)) {
        continue;
      }

      if (def[key] === undefined || def[key] === true) {
        def[key] = cfg[key] || def[key];
      }
    }

    let sel = selections[name] = extend(def, {
      name: model.name(name),
      events: isString(def.on) ? parseSelector(def.on, 'scope') : def.on,
      domain: 'data' as SelectionDomain, // TODO: Support def.domain
      resolve: 'single' as SelectionResolutions
    }) as SelectionComponent;

    transforms(sel, function(tx) {
      if (tx.parse) {
        tx.parse(model, def, sel);
      }
    });
  }

  return selections;
}

export function assembleUnitSignals(model: UnitModel, signals: any[]) {
  selections(model, function(sel, type) {
    let name = sel.name,
        tupleExpr = type.tupleExpr(model, sel),
        modifyExpr = type.modifyExpr(model, sel);

    signals.push.apply(signals, type.signals(model, sel));

    transforms(sel, function(tx) {
      if (tx.signals) {
        signals = tx.signals(model, sel, signals);
      }
      if (tx.modifyExpr) {
        modifyExpr = tx.modifyExpr(model, sel, modifyExpr);
      }
    });

    signals.push({
      name: name + TUPLE,
      on: [{
        events: {signal: name},
        update: `{unit: unit.datum && unit.datum._id, ${tupleExpr}}`
      }]
    }, {
      name: name + MODIFY,
      on: [{
        events: {signal: name},
        update: `modify(${stringValue(name + STORE)}, ${modifyExpr})`
      }]
    });
  });

  return signals;
}

export function assembleTopLevelSignals(model: Model) {
  let signals:any[] = [{
    name: 'unit',
    value: {},
    on: [{events: 'mousemove', update: 'group()._id ? group() : unit'}]
  }];

  selections(model, function(sel, type) {
    if (type.topLevelSignals) {
      signals.push.apply(signals, type.topLevelSignals(model, sel));
    }

    transforms(sel, function(tx) {
      if (tx.topLevelSignals) {
        signals = tx.topLevelSignals(model, sel, signals);
      }
    });
  });

  return signals;
}

export function assembleUnitData(model: UnitModel, data: VgData[]): VgData[] {
  return data
    .concat(Object.keys(model.component.selection)
      .map(function(k: string) {
        return {name: k + STORE};
      }));
}

export function assembleUnitMarks(model: UnitModel, marks: any[]): any[] {
  let clippedGroup = false,
      selMarks = marks;
  selections(model, function(sel, type) {
    selMarks = type.marks ? type.marks(model, sel, selMarks) : selMarks;
    transforms(sel, function(tx) {
      clippedGroup = clippedGroup || tx.clippedGroup;
      if (tx.marks) {
        selMarks = tx.marks(model, sel, marks, selMarks);
      }
    });
  });

  if (clippedGroup) {
    selMarks = [{
      type: 'group',
      encode: {
        enter: {
          width: {field: {group: 'width'}},
          height: {field: {group: 'height'}},
          fill: {value: 'transparent'},
          clip: {value: true}
        }
      },
      marks: selMarks
    }];
  }

  return selMarks;
}

let PREDICATES_OPS = {
  'single': '"intersect", "all"',
  'independent': '"intersect", "unit"',
  'union': '"union", "all"',
  'union_others': '"union", "others"',
  'intersect': '"intersect", "all"',
  'intersect_others': '"intersect", "others'
};

export function predicate(sel: SelectionComponent, datum?: string): string {
  const store = stringValue(sel.name + STORE),
        op = PREDICATES_OPS[sel.resolve];
  datum = datum || 'datum';
  return type(sel).predicate + `(${store}, parent._id, ${datum}, ${op})`;
}

// Utility functions

function selections(model: Model, cb: (sel: SelectionComponent, type: TypeCompiler) => void) {
  let selections = model.component.selection;
  for (let name in selections) {
    if (selections.hasOwnProperty(name)) {
      let sel = selections[name];
      cb(sel, type(sel));
    }
  }
}

function type(sel: SelectionComponent): TypeCompiler {
  return types[sel.type];
}

export function invert(model: UnitModel, sel: SelectionComponent, channel: Channel, expr: string) {
  let scale = stringValue(model.scaleName(channel));
  return sel.domain === 'data' ? `invert(${scale}, ${expr})` : expr;
}

export function channelSignalName(sel: SelectionComponent, channel: Channel) {
  return sel.name + '_' + channel;
}
