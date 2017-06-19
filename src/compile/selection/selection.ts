import {selector as parseSelector} from 'vega-event-selector';
import {Channel, ScaleChannel, SingleDefChannel} from '../../channel';
import {warn} from '../../log';
import {LogicalOperand} from '../../logical';
import {SelectionDomain} from '../../scale';
import {SelectionDef, SelectionResolutions, SelectionTypes} from '../../selection';
import {Dict, extend, isString, logicalExpr, stringValue} from '../../util';
import {isSignalRefDomain, VgBinding, VgData, VgDomain, VgEventStream, VgScale, VgSignalRef} from '../../vega.schema';
import {LayerModel} from '../layer';
import {Model} from '../model';
import {UnitModel} from '../unit';
import intervalCompiler from './interval';
import multiCompiler from './multi';
import {SelectionComponent} from './selection';
import singleCompiler from './single';
import {forEachTransform} from './transforms/transforms';


export const STORE = '_store';
export const TUPLE  = '_tuple';
export const MODIFY = '_modify';
export const SELECTION_DOMAIN = '_selection_domain_';

export interface SelectionComponent {
  name: string;
  type: SelectionTypes;
  events: VgEventStream;
  // predicate?: string;
  bind?: 'scales' | VgBinding | {[key: string]: VgBinding};
  resolve: SelectionResolutions;

  // Transforms
  project?: ProjectComponent[];
  fields?: any;
  scales?: Channel[];
  toggle?: any;
  translate?: any;
  zoom?: any;
  nearest?: any;
}

export interface ProjectComponent {
  field?: string;
  encoding?: ScaleChannel;
}

export interface SelectionCompiler {
  signals: (model: UnitModel, selCmpt: SelectionComponent) => any[];
  topLevelSignals?: (model: Model, selCmpt: SelectionComponent, signals: any[]) => any[];
  modifyExpr: (model: UnitModel, selCmpt: SelectionComponent) => string;
  marks?: (model: UnitModel, selCmpt:SelectionComponent, marks: any[]) => any[];
  predicate: string;  // Vega expr string to determine inclusion in selection.
  scaleDomain: string;  // Vega expr string to materialize a scale domain.
}

export function parseUnitSelection(model: UnitModel, selDefs: Dict<SelectionDef>) {
  const selCmpts: Dict<SelectionComponent> = {};
  const selectionConfig = model.config.selection;

  for (const name in selDefs) {
    if (!selDefs.hasOwnProperty(name)) {
      continue;
    }

    const selDef = selDefs[name];
    const cfg = selectionConfig[selDef.type];

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
      name: name,
      events: isString(selDef.on) ? parseSelector(selDef.on, 'scope') : selDef.on,
    }) as SelectionComponent;

    forEachTransform(selCmpt, txCompiler => {
      if (txCompiler.parse) {
        txCompiler.parse(model, selDef, selCmpt);
      }
    });
  }

  return selCmpts;
}

export function assembleUnitSelectionSignals(model: UnitModel, signals: any[]) {
  forEachSelection(model, (selCmpt, selCompiler) => {
    const name = selCmpt.name;
    let modifyExpr = selCompiler.modifyExpr(model, selCmpt);

    signals.push.apply(signals, selCompiler.signals(model, selCmpt));

    forEachTransform(selCmpt, txCompiler => {
      if (txCompiler.signals) {
        signals = txCompiler.signals(model, selCmpt, signals);
      }
      if (txCompiler.modifyExpr) {
        modifyExpr = txCompiler.modifyExpr(model, selCmpt, modifyExpr);
      }
    });

    signals.push({
      name: name + MODIFY,
      on: [{
        events: {signal: name + TUPLE},
        update: `modify(${stringValue(selCmpt.name + STORE)}, ${modifyExpr})`
      }]
    });
  });

  return signals;
}

export function assembleTopLevelSignals(model: UnitModel, signals: any[]) {
  let needsUnit = false;
  forEachSelection(model, (selCmpt, selCompiler) => {
    if (selCompiler.topLevelSignals) {
      signals = selCompiler.topLevelSignals(model, selCmpt, signals);
    }

    forEachTransform(selCmpt, txCompiler => {
      if (txCompiler.topLevelSignals) {
        signals = txCompiler.topLevelSignals(model, selCmpt, signals);
      }
    });

    needsUnit = true;
  });

  if (needsUnit) {
    const hasUnit = signals.filter((s) => s.name === 'unit');
    if (!(hasUnit.length)) {
      signals.unshift({
        name: 'unit',
        value: {},
        on: [{events: 'mousemove', update: 'group()._id ? group() : unit'}]
      });
    }
  }

  return signals;
}

export function assembleUnitSelectionData(model: UnitModel, data: VgData[]): VgData[] {
  forEachSelection(model, selCmpt => {
    const contains = data.filter((d) => d.name === selCmpt.name + STORE);
    if (!contains.length) {
      data.push({name: selCmpt.name + STORE});
    }
  });

  return data;
}

export function assembleUnitSelectionMarks(model: UnitModel, marks: any[]): any[] {
  let clipGroup = false;
  let selMarks = marks;
  forEachSelection(model, (selCmpt, selCompiler) => {
    selMarks = selCompiler.marks ? selCompiler.marks(model, selCmpt, selMarks) : selMarks;
    forEachTransform(selCmpt, (txCompiler) => {
      clipGroup = clipGroup || txCompiler.clipGroup;
      if (txCompiler.marks) {
        selMarks = txCompiler.marks(model, selCmpt, marks, selMarks);
      }
    });
  });

  // In a layered spec, we want to clip all layers together rather than
  // only the layer within which the selection is defined. Propagate
  // our assembled state up and let the LayerModel make the right call.
  if (model.parent && model.parent instanceof LayerModel) {
    return [selMarks, clipMarks];
  } else {
    return clipGroup ? clipMarks(selMarks) : selMarks;
  }
}

export function assembleLayerSelectionMarks(model: LayerModel, marks: any[]): any[] {
  let clipGroup = false;
  model.children.forEach(child => {
    if (child instanceof UnitModel) {
      const unit = assembleUnitSelectionMarks(child, marks);
      marks = unit[0];
      clipGroup = clipGroup || unit[1];
    }
  });
  return clipGroup ? clipMarks(marks) : marks;
}

const PREDICATES_OPS = {
  global: '"union", "all"',
  independent: '"intersect", "unit"',
  union: '"union", "all"',
  union_others: '"union", "others"',
  intersect: '"intersect", "all"',
  intersect_others: '"intersect", "others"'
};

export function predicate(model: Model, selections: LogicalOperand<string>): string {
  function expr(name: string): string {
    const selCmpt = model.getSelectionComponent(name);
    const store = stringValue(name + STORE);
    const op = PREDICATES_OPS[selCmpt.resolve];

    return compiler(selCmpt.type).predicate +
      `(${store}, ${stringValue(model.getName(''))}, datum, ${op})`;
  }

  return logicalExpr(selections, expr);
}

// Selections are parsed _after_ scales. If a scale domain is set to
// use a selection, the SELECTION_DOMAIN constant is used as the
// domainRaw.signal during scale.parse and then replaced with the necessary
// selection expression function during scale.assemble. To not pollute the
// type signatures to account for this setup, the selection domain definition
// is coerced to a string and appended to SELECTION_DOMAIN.
export function isRawSelectionDomain(domainRaw: VgSignalRef) {
  return domainRaw.signal.indexOf(SELECTION_DOMAIN) >= 0;
}
export function selectionScaleDomain(model: Model, domainRaw: VgSignalRef): VgSignalRef {
  const selDomain = JSON.parse(domainRaw.signal.replace(SELECTION_DOMAIN, ''));
  const name = selDomain.selection;

  let selCmpt = model.component.selection && model.component.selection[name];
  if (selCmpt) {
    warn('Use "bind": "scales" to setup a binding for scales and selections within the same view.');
  } else if (!selDomain.encoding && !selDomain.field) {
    warn('A "field" or "encoding" must be specified when using a selection as a scale domain.');
  } else {
    selCmpt = model.getSelectionComponent(name);
    return {
      signal: compiler(selCmpt.type).scaleDomain +
        `(${stringValue(name + STORE)}, ${stringValue(selDomain.encoding || null)}, ` +
          `${stringValue(selDomain.field || null)}, ${PREDICATES_OPS[selCmpt.resolve]})`
    };
  }

  return {signal: 'null'};
}

// Utility functions

function forEachSelection(model: Model, cb: (selCmpt: SelectionComponent, selCompiler: SelectionCompiler) => void) {
  const selections = model.component.selection;
  for (const name in selections) {
    if (selections.hasOwnProperty(name)) {
      const sel = selections[name];
      cb(sel, compiler(sel.type));
    }
  }
}

function compiler(type: SelectionTypes): SelectionCompiler {
  switch (type) {
    case 'single':
      return singleCompiler;
    case 'multi':
      return multiCompiler;
    case 'interval':
      return intervalCompiler;
  }
  return null;
}

export function channelSignalName(selCmpt: SelectionComponent, channel: Channel, range: 'visual' | 'data') {
  return selCmpt.name + '_' + (range === 'visual' ? channel : selCmpt.fields[channel]);
}

function clipMarks(marks: any[]): any[] {
  return marks.map((m) => (m.clip = true, m));
}
