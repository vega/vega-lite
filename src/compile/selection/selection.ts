import {selector as parseSelector} from 'vega-event-selector';
import {Channel} from '../../channel';
import {SelectionDef, SelectionDomain, SelectionResolutions, SelectionTypes} from '../../selection';
import {Dict, extend, isString, stringValue} from '../../util';
import {VgBinding, VgData} from '../../vega.schema';
import {Model} from '../model';
import {UnitModel} from '../unit';
import intervalCompiler from './interval';
import multiCompiler from './multi';
import {SelectionComponent} from './selection';
import singleCompiler from './single';
import {forEachTransform} from './transforms/transforms';

export const STORE = '_store',
  TUPLE  = '_tuple',
  MODIFY = '_modify';

export interface SelectionComponent {
  name: string;
  type: SelectionTypes;
  domain: SelectionDomain;
  events: any;
  // predicate?: string;
  bind?: 'scales' | VgBinding | {[key: string]: VgBinding};
  resolve: SelectionResolutions;

  // Transforms
  project?: ProjectComponent[];
  scales?: Channel[];
  toggle?: any;
  translate?: any;
  zoom?: any;
  nearest?: any;
}

export interface ProjectComponent {
  field?: string;
  encoding?: Channel;
}

export interface SelectionCompiler {
  signals: (model: UnitModel, selCmpt: SelectionComponent) => any[];
  topLevelSignals?: (model: Model, selCmpt: SelectionComponent) => any[];
  tupleExpr: (model: UnitModel, selCmpt: SelectionComponent) => string;
  modifyExpr: (model: UnitModel, selCmpt: SelectionComponent) => string;
  marks?: (model: UnitModel, selCmpt:SelectionComponent, marks: any[]) => any[];
  predicate: string;  // Vega expr string to determine inclusion in selection.
}

export function parseUnitSelection(model: UnitModel, selDefs: Dict<SelectionDef>) {
  const selCmpts: Dict<SelectionComponent> = {},
      selectionConfig = model.config.selection;

  for (const name in selDefs) {
    if (!selDefs.hasOwnProperty(name)) {
      continue;
    }

    const selDef = selDefs[name],
        cfg = selectionConfig[selDef.type];

    // Set default values from config if a property hasn't been specified,
    // or if it is true. E.g., "translate": true should use the default
    // event handlers for translate. However, true may be a valid value for
    // a property (e.g., "nearest": true).
    for (const key in cfg) {
      // A selection should contain either `encodings` or `fields`, only use
      // default values for these two values if neither of them is specified.
      if ((key === 'encodings' && selDef.fields) || (key === 'fields' && selDef.encodings)) {
        continue;
      }

      if (selDef[key] === undefined || selDef[key] === true) {
        selDef[key] = cfg[key] || selDef[key];
      }
    }

    const selCmpt = selCmpts[name] = extend({}, selDef, {
      name: model.getName(name),
      events: isString(selDef.on) ? parseSelector(selDef.on, 'scope') : selDef.on,
      domain: 'data' as SelectionDomain, // TODO: Support def.domain
      resolve: 'union' as SelectionResolutions
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
  forEachSelection(model, function(selCmpt, selCompiler) {
    const name = selCmpt.name,
        tupleExpr = selCompiler.tupleExpr(model, selCmpt);
    let modifyExpr = selCompiler.modifyExpr(model, selCmpt);

    signals.push.apply(signals, selCompiler.signals(model, selCmpt));

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

  forEachSelection(model, function(selCmpt, selCompiler) {
    if (selCompiler.topLevelSignals) {
      signals.push.apply(signals, selCompiler.topLevelSignals(model, selCmpt));
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
  forEachSelection(model, function(selCmpt, selCompiler) {
    selMarks = selCompiler.marks ? selCompiler.marks(model, selCmpt, selMarks) : selMarks;
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
      marks: selMarks.map(model.correctDataNames)
    }];
  }

  return selMarks;
}

const PREDICATES_OPS = {
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
  return compiler(selCmpt).predicate + `(${store}, parent._id, ${datum}, ${op})`;
}

// Utility functions

function forEachSelection(model: Model, cb: (selCmpt: SelectionComponent, selCompiler: SelectionCompiler) => void) {
  const selections = model.component.selection;
  for (const name in selections) {
    if (selections.hasOwnProperty(name)) {
      const sel = selections[name];
      cb(sel, compiler(sel));
    }
  }
}

function compiler(selCmpt: SelectionComponent): SelectionCompiler {
  switch (selCmpt.type) {
    case 'single':
      return singleCompiler;
    case 'multi':
      return multiCompiler;
    case 'interval':
      return intervalCompiler;
  }
  return null;
}

export function invert(model: UnitModel, selCmpt: SelectionComponent, channel: Channel, expr: string) {
  const scale = stringValue(model.scaleName(channel));
  return selCmpt.domain === 'data' ? `invert(${scale}, ${expr})` : expr;
}

export function channelSignalName(selCmpt: SelectionComponent, channel: Channel) {
  return selCmpt.name + '_' + channel;
}
