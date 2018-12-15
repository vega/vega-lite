import {Binding, NewSignal, SignalRef} from 'vega';
import {selector as parseSelector} from 'vega-event-selector';
import {isString, stringValue} from 'vega-util';
import {Channel, ScaleChannel, SingleDefChannel, X, Y} from '../../channel';
import {warn} from '../../log';
import {LogicalOperand} from '../../logical';
import {BrushConfig, SELECTION_ID, SelectionDef, SelectionResolution, SelectionType} from '../../selection';
import {accessPathWithDatum, Dict, duplicate, keys, logicalExpr, varName} from '../../util';
import {VgData, VgEventStream} from '../../vega.schema';
import {DataFlowNode} from '../data/dataflow';
import {TimeUnitNode} from '../data/timeunit';
import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {isFacetModel, isUnitModel, Model} from '../model';
import {UnitModel} from '../unit';
import intervalCompiler from './interval';
import multiCompiler from './multi';
import {SelectionComponent} from './selection';
import singleCompiler from './single';
import {forEachTransform} from './transforms/transforms';

export const STORE = '_store';
export const TUPLE = '_tuple';
export const MODIFY = '_modify';
export const SELECTION_DOMAIN = '_selection_domain_';
export const VL_SELECTION_RESOLVE = 'vlSelectionResolve';

export interface SelectionComponent {
  name: string;
  type: SelectionType;
  events: VgEventStream;
  // predicate?: string;
  bind?: 'scales' | Binding | Dict<Binding>;
  resolve: SelectionResolution;
  empty: 'all' | 'none';
  mark?: BrushConfig;

  _signalNames: {};

  // Transforms
  project?: ProjectSelectionComponent[];
  fields?: {[c in SingleDefChannel]?: string};
  timeUnit?: TimeUnitNode;
  scales?: ScaleChannel[];
  toggle?: any;
  translate?: any;
  zoom?: any;
  nearest?: any;
}

// Do the selection tuples hold enumerated or ranged values for a field?
// Ranged values can be left-right inclusive (R) or left-inclusive, right-exclusive (R-LE).
export type TupleStoreType = 'E' | 'R' | 'R-RE';

export interface ProjectSelectionComponent {
  field?: string;
  channel?: SingleDefChannel;
  type: TupleStoreType;
}

export interface SelectionCompiler {
  signals: (model: UnitModel, selCmpt: SelectionComponent) => NewSignal[];
  topLevelSignals?: (model: Model, selCmpt: SelectionComponent, signals: NewSignal[]) => NewSignal[];
  modifyExpr: (model: UnitModel, selCmpt: SelectionComponent) => string;
  marks?: (model: UnitModel, selCmpt: SelectionComponent, marks: any[]) => any[];
}

export function parseUnitSelection(model: UnitModel, selDefs: Dict<SelectionDef>) {
  const selCmpts: Dict<SelectionComponent> = {};
  const selectionConfig = model.config.selection;

  if (selDefs) {
    selDefs = duplicate(selDefs); // duplicate to avoid side effects to original spec
  }

  for (let name in selDefs) {
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

      if (key === 'mark') {
        selDef[key] = {...cfg[key], ...selDef[key]};
      }

      if (selDef[key] === undefined || selDef[key] === true) {
        selDef[key] = cfg[key] || selDef[key];
      }
    }

    name = varName(name);
    const selCmpt = (selCmpts[name] = {
      ...selDef,
      name: name,
      events: isString(selDef.on) ? parseSelector(selDef.on, 'scope') : selDef.on
    } as any);

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

    signals.push(...selCompiler.signals(model, selCmpt));

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
      on: [
        {
          events: {signal: name + TUPLE},
          update: `modify(${stringValue(selCmpt.name + STORE)}, ${modifyExpr})`
        }
      ]
    });
  });

  return signals;
}

export function assembleFacetSignals(model: FacetModel, signals: any[]) {
  if (model.component.selection && keys(model.component.selection).length) {
    const name = stringValue(model.getName('cell'));
    signals.unshift({
      name: 'facet',
      value: {},
      on: [
        {
          events: parseSelector('mousemove', 'scope'),
          update: `isTuple(facet) ? facet : group(${name}).datum`
        }
      ]
    });
  }

  return signals;
}

export function assembleTopLevelSignals(model: UnitModel, signals: any[]) {
  let hasSelections = false;
  forEachSelection(model, (selCmpt, selCompiler) => {
    const name = selCmpt.name;
    const store = stringValue(name + STORE);
    const hasSg = signals.filter(s => s.name === name);
    if (!hasSg.length) {
      signals.push({
        name: selCmpt.name,
        update:
          `${VL_SELECTION_RESOLVE}(${store}` +
          (selCmpt.resolve === 'global' ? ')' : `, ${stringValue(selCmpt.resolve)})`)
      });
    }
    hasSelections = true;

    if (selCompiler.topLevelSignals) {
      signals = selCompiler.topLevelSignals(model, selCmpt, signals);
    }

    forEachTransform(selCmpt, txCompiler => {
      if (txCompiler.topLevelSignals) {
        signals = txCompiler.topLevelSignals(model, selCmpt, signals);
      }
    });
  });

  if (hasSelections) {
    const hasUnit = signals.filter(s => s.name === 'unit');
    if (!hasUnit.length) {
      signals.unshift({
        name: 'unit',
        value: {},
        on: [{events: 'mousemove', update: 'isTuple(group()) ? group() : unit'}]
      });
    }
  }

  return signals;
}

export function assembleUnitSelectionData(model: UnitModel, data: VgData[]): VgData[] {
  forEachSelection(model, selCmpt => {
    const contains = data.filter(d => d.name === selCmpt.name + STORE);
    if (!contains.length) {
      data.push({name: selCmpt.name + STORE});
    }
  });

  return data;
}

export function assembleUnitSelectionMarks(model: UnitModel, marks: any[]): any[] {
  forEachSelection(model, (selCmpt, selCompiler) => {
    marks = selCompiler.marks ? selCompiler.marks(model, selCmpt, marks) : marks;
    forEachTransform(selCmpt, txCompiler => {
      if (txCompiler.marks) {
        marks = txCompiler.marks(model, selCmpt, marks);
      }
    });
  });

  return marks;
}

export function assembleLayerSelectionMarks(model: LayerModel, marks: any[]): any[] {
  for (const child of model.children) {
    if (isUnitModel(child)) {
      marks = assembleUnitSelectionMarks(child, marks);
    }
  }

  return marks;
}

export function selectionPredicate(model: Model, selections: LogicalOperand<string>, dfnode?: DataFlowNode): string {
  const stores: string[] = [];
  function expr(name: string): string {
    const vname = varName(name);
    const selCmpt = model.getSelectionComponent(vname, name);
    const store = stringValue(vname + STORE);

    if (selCmpt.timeUnit) {
      const child = dfnode || model.component.data.raw;
      const tunode = selCmpt.timeUnit.clone();
      if (child.parent) {
        tunode.insertAsParentOf(child);
      } else {
        child.parent = tunode;
      }
    }

    if (selCmpt.empty !== 'none') {
      stores.push(store);
    }

    return (
      `vlSelectionTest(${store}, datum` + (selCmpt.resolve === 'global' ? ')' : `, ${stringValue(selCmpt.resolve)})`)
    );
  }

  const predicateStr = logicalExpr(selections, expr);
  return (
    (stores.length ? '!(' + stores.map(s => `length(data(${s}))`).join(' || ') + ') || ' : '') + `(${predicateStr})`
  );
}

// Selections are parsed _after_ scales. If a scale domain is set to
// use a selection, the SELECTION_DOMAIN constant is used as the
// domainRaw.signal during scale.parse and then replaced with the necessary
// selection expression function during scale.assemble. To not pollute the
// type signatures to account for this setup, the selection domain definition
// is coerced to a string and appended to SELECTION_DOMAIN.
export function isRawSelectionDomain(domainRaw: SignalRef) {
  return domainRaw.signal.indexOf(SELECTION_DOMAIN) >= 0;
}
export function selectionScaleDomain(model: Model, domainRaw: SignalRef): SignalRef {
  const selDomain = JSON.parse(domainRaw.signal.replace(SELECTION_DOMAIN, ''));
  const name = varName(selDomain.selection);
  const encoding = selDomain.encoding;
  let field = selDomain.field;

  let selCmpt = model.component.selection && model.component.selection[name];
  if (selCmpt) {
    warn('Use "bind": "scales" to setup a binding for scales and selections within the same view.');
  } else {
    selCmpt = model.getSelectionComponent(name, selDomain.selection);
    if (!encoding && !field) {
      field = selCmpt.project[0].field;
      if (selCmpt.project.length > 1) {
        warn(
          'A "field" or "encoding" must be specified when using a selection as a scale domain. ' +
            `Using "field": ${stringValue(field)}.`
        );
      }
    } else if (encoding && !field) {
      const encodings = selCmpt.project.filter(p => p.channel === encoding);
      if (!encodings.length || encodings.length > 1) {
        field = selCmpt.project[0].field;
        warn(
          (!encodings.length ? 'No ' : 'Multiple ') +
            `matching ${stringValue(encoding)} encoding found for selection ${stringValue(selDomain.selection)}. ` +
            `Using "field": ${stringValue(field)}.`
        );
      } else {
        field = encodings[0].field;
      }
    }

    return {signal: accessPathWithDatum(field, name)};
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

function compiler(type: SelectionType): SelectionCompiler {
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

function getFacetModel(model: Model): FacetModel {
  let parent = model.parent;
  while (parent) {
    if (isFacetModel(parent)) {
      break;
    }
    parent = parent.parent;
  }

  return parent as FacetModel;
}

export function unitName(model: Model) {
  let name = stringValue(model.name);
  const facet = getFacetModel(model);
  if (facet) {
    name +=
      (facet.facet.row ? ` + '_' + (${accessPathWithDatum(facet.vgField('row'), 'facet')})` : '') +
      (facet.facet.column ? ` + '_' + (${accessPathWithDatum(facet.vgField('column'), 'facet')})` : '');
  }
  return name;
}

export function requiresSelectionId(model: Model) {
  let identifier = false;
  forEachSelection(model, selCmpt => {
    identifier = identifier || selCmpt.project.some(proj => proj.field === SELECTION_ID);
  });
  return identifier;
}

export function channelSignalName(selCmpt: SelectionComponent, channel: Channel, range: 'visual' | 'data') {
  const sgNames = selCmpt._signalNames || (selCmpt._signalNames = {});
  if (sgNames[channel] && sgNames[channel][range]) {
    return sgNames[channel][range];
  }

  sgNames[channel] = sgNames[channel] || {};
  const basename = varName(selCmpt.name + '_' + (range === 'visual' ? channel : selCmpt.fields[channel]));
  let name = basename;
  let counter = 1;
  while (sgNames[name]) {
    name = `${basename}_${counter++}`;
  }

  return (sgNames[name] = sgNames[channel][range] = name);
}

export function positionalProjections(selCmpt: SelectionComponent) {
  let x: ProjectSelectionComponent = null;
  let xi: number = null;
  let y: ProjectSelectionComponent = null;
  let yi: number = null;

  selCmpt.project.forEach((p, i) => {
    if (p.channel === X) {
      x = p;
      xi = i;
    } else if (p.channel === Y) {
      y = p;
      yi = i;
    }
  });
  return {x, xi, y, yi};
}
