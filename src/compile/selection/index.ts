import {SelectionDef, SelectionComponent, SelectionDomain,
        SelectionResolutions} from '../../selection';
import {Model} from '../model';
import {UnitModel} from '../unit';
import {Channel} from '../../channel';
import {Dict, extend, stringValue, isString} from '../../util';
import * as types from './types';
import {TypeCompiler} from './types';
import {forEachTransform} from './transforms';
import {selector as parseSelector} from 'vega-parser';
import {VgData} from '../../vega.schema';

export const STORE = '_store',
  TUPLE  = '_tuple',
  MODIFY = '_modify';

export function parseUnitSelection(model: UnitModel, selDefs: Dict<SelectionDef>) {
  let selCmpts: Dict<SelectionComponent> = {},
      selectionConfig = model.config().selection;

  for (let name in selDefs) {
    if (!selDefs.hasOwnProperty(name)) {
      continue;
    }

    let selDef = selDefs[name],
        cfg = selectionConfig[selDef.type];

    // Set default values from config if a property hasn't been specified,
    // or if it is true. E.g., "translate": true should use the default
    // event handlers for translate. However, true may be a valid value for
    // a property (e.g., "nearest": true).
    for (let key in cfg) {
      // A selection should contain either `encodings` or `fields`, only use
      // default values for these two values if neither of them is specified.
      if ((key === 'encodings' && selDef.fields) || (key === 'fields' && selDef.encodings)) {
        continue;
      }

      if (selDef[key] === undefined || selDef[key] === true) {
        selDef[key] = cfg[key] || selDef[key];
      }
    }

    let selCmpt = selCmpts[name] = extend({}, selDef, {
      name: model.name(name),
      events: isString(selDef.on) ? parseSelector(selDef.on, 'scope') : selDef.on,
      domain: 'data' as SelectionDomain, // TODO: Support def.domain
      resolve: 'single' as SelectionResolutions
    }) as SelectionComponent;

    forEachTransform(selCmpt, function(txCompiler) {
      if (txCompiler.parse) {
        txCompiler.parse(model, selDef, selCmpt);
      }
    });
  }

  return selCmpts;
}

export function assembleUnitSignals(model: UnitModel, signals: any[]) {
  forEachSelection(model, function(selCmpt, typeCompiler) {
    let name = selCmpt.name,
        tupleExpr = typeCompiler.tupleExpr(model, selCmpt),
        modifyExpr = typeCompiler.modifyExpr(model, selCmpt);

    signals.push.apply(signals, typeCompiler.signals(model, selCmpt));

    forEachTransform(selCmpt, function(txCompiler) {
      if (txCompiler.signals) {
        signals = txCompiler.signals(model, selCmpt, signals);
      }
      if (txCompiler.modifyExpr) {
        modifyExpr = txCompiler.modifyExpr(model, selCmpt, modifyExpr);
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

  forEachSelection(model, function(selCmpt, typeCompiler) {
    if (typeCompiler.topLevelSignals) {
      signals.push.apply(signals, typeCompiler.topLevelSignals(model, selCmpt));
    }

    forEachTransform(selCmpt, function(txCompiler) {
      if (txCompiler.topLevelSignals) {
        signals = txCompiler.topLevelSignals(model, selCmpt, signals);
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
  forEachSelection(model, function(selCmpt, typeCompiler) {
    selMarks = typeCompiler.marks ? typeCompiler.marks(model, selCmpt, selMarks) : selMarks;
    forEachTransform(selCmpt, function(txCompiler) {
      clippedGroup = clippedGroup || txCompiler.clippedGroup;
      if (txCompiler.marks) {
        selMarks = txCompiler.marks(model, selCmpt, marks, selMarks);
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

export function predicate(selCmpt: SelectionComponent, datum?: string): string {
  const store = stringValue(selCmpt.name + STORE),
        op = PREDICATES_OPS[selCmpt.resolve];
  datum = datum || 'datum';
  return type(selCmpt).predicate + `(${store}, parent._id, ${datum}, ${op})`;
}

// Utility functions

function forEachSelection(model: Model, cb: (selCmpt: SelectionComponent, typeCompiler: TypeCompiler) => void) {
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

export function invert(model: UnitModel, selCmpt: SelectionComponent, channel: Channel, expr: string) {
  let scale = stringValue(model.scaleName(channel));
  return selCmpt.domain === 'data' ? `invert(${scale}, ${expr})` : expr;
}

export function channelSignalName(selCmpt: SelectionComponent, channel: Channel) {
  return selCmpt.name + '_' + channel;
}
