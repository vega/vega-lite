import {Binding, SignalRef} from 'vega';
import {stringValue} from 'vega-util';
import {
  BrushConfig,
  SELECTION_ID,
  SelectionInit,
  SelectionInitArray,
  SelectionResolution,
  SelectionType
} from '../../selection';
import {accessPathWithDatum, Dict} from '../../util';
import {VgEventStream} from '../../vega.schema';
import {FacetModel} from '../facet';
import {isFacetModel, Model} from '../model';
import {UnitModel} from '../unit';
import interval from './interval';
import multi from './multi';
import single from './single';
import {SelectionProjection, SelectionProjectionComponent} from './transforms/project';

export const STORE = '_store';
export const TUPLE = '_tuple';
export const MODIFY = '_modify';
export const LEGEND_STORE = '_legend_store';
export const SELECTION_DOMAIN = '_selection_domain_';
export const VL_SELECTION_RESOLVE = 'vlSelectionResolve';

export interface SelectionComponent {
  name: string;
  type: SelectionType;
  init?: (SelectionInit | SelectionInitArray)[];
  events: VgEventStream;
  // predicate?: string;
  bind?: 'scales' | Binding | Dict<Binding>;
  resolve: SelectionResolution;
  empty: 'all' | 'none';
  mark?: BrushConfig;

  // Transforms
  project?: SelectionProjectionComponent;
  scales?: SelectionProjection[];
  toggle?: any;
  translate?: any;
  zoom?: any;
  nearest?: any;
  legend?: any;
}

export interface SelectionCompiler {
  signals: (model: UnitModel, selCmpt: SelectionComponent) => any[];
  topLevelSignals?: (model: Model, selCmpt: SelectionComponent, signals: any[]) => any[];
  modifyExpr: (model: UnitModel, selCmpt: SelectionComponent) => string;
  marks?: (model: UnitModel, selCmpt: SelectionComponent, marks: any[]) => any[];
}

const compilers: Dict<SelectionCompiler> = {single, multi, interval};

export function forEachSelection(
  model: Model,
  cb: (selCmpt: SelectionComponent, selCompiler: SelectionCompiler) => void
) {
  const selections = model.component.selection;
  for (const name in selections) {
    if (selections.hasOwnProperty(name)) {
      const sel = selections[name];
      cb(sel, compilers[sel.type]);
    }
  }
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

export function isRawSelectionDomain(domainRaw: SignalRef) {
  return domainRaw.signal.indexOf(SELECTION_DOMAIN) >= 0;
}
