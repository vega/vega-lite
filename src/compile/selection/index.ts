import {Binding, NewSignal, SignalRef} from 'vega';
import {stringValue} from 'vega-util';
import {FACET_CHANNELS} from '../../channel';
import {
  BrushConfig,
  SELECTION_ID,
  SelectionInit,
  SelectionInitInterval,
  SelectionResolution,
  SelectionType
} from '../../selection';
import {accessPathWithDatum, Dict} from '../../util';
import {EventStream} from '../../vega.schema';
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
export const SELECTION_DOMAIN = '_selection_domain_';
export const VL_SELECTION_RESOLVE = 'vlSelectionResolve';

export interface SelectionComponent<T extends SelectionType = SelectionType> {
  name: string;
  type: T;

  // Use conditional typing (https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)
  // so we have stricter type of init (as the type of init depends on selection type)
  init?: (T extends 'interval'
    ? SelectionInitInterval
    : T extends 'single'
    ? SelectionInit
    : SelectionInit | SelectionInit[])[]; // multi
  events: EventStream;
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
  clear?: any;
}

export interface SelectionCompiler<T extends SelectionType = SelectionType> {
  signals: (model: UnitModel, selCmpt: SelectionComponent<T>) => NewSignal[];
  topLevelSignals?: (model: Model, selCmpt: SelectionComponent<T>, signals: NewSignal[]) => NewSignal[];
  modifyExpr: (model: UnitModel, selCmpt: SelectionComponent<T>) => string;
  marks?: (model: UnitModel, selCmpt: SelectionComponent<T>, marks: any[]) => any[];
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
  const facetModel = getFacetModel(model);
  if (facetModel) {
    const {facet} = facetModel;
    for (const channel of FACET_CHANNELS) {
      if (facet[channel]) {
        name += ` + '__facet_${channel}_' + (${accessPathWithDatum(facetModel.vgField(channel), 'facet')})`;
      }
    }
  }
  return name;
}

export function requiresSelectionId(model: Model) {
  let identifier = false;
  forEachSelection(model, selCmpt => {
    identifier = identifier || selCmpt.project.items.some(proj => proj.field === SELECTION_ID);
  });
  return identifier;
}

export function isRawSelectionDomain(domainRaw: SignalRef) {
  return domainRaw.signal.indexOf(SELECTION_DOMAIN) >= 0;
}
