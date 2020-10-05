import {Binding, NewSignal, Signal, Stream} from 'vega';
import {stringValue} from 'vega-util';
import {FACET_CHANNELS} from '../../channel';
import {
  BrushConfig,
  LegendBinding,
  SelectionInit,
  SelectionInitInterval,
  SelectionResolution,
  SelectionType,
  SELECTION_ID
} from '../../selection';
import {Dict, vals} from '../../util';
import {OutputNode} from '../data/dataflow';
import {FacetModel} from '../facet';
import {isFacetModel, Model} from '../model';
import {UnitModel} from '../unit';
import interval from './interval';
import multi from './multi';
import single from './single';
import {SelectionProjection, SelectionProjectionComponent} from './project';
import {SelectionDef} from '../../selection';
import clear from './clear';
import inputs from './inputs';
import nearest from './nearest';
import project from './project';
import scales from './scales';
import legends from './legends';
import toggle from './toggle';
import translate from './translate';
import zoom from './zoom';

export const STORE = '_store';
export const TUPLE = '_tuple';
export const MODIFY = '_modify';
export const SELECTION_DOMAIN = '_selection_domain_';
export const VL_SELECTION_RESOLVE = 'vlSelectionResolve';

export interface SelectionComponent<T extends SelectionType = SelectionType> {
  name: string;
  type: T;
  // Use conditional types for stricter type of init (as the type of init depends on selection type).
  init?: (T extends 'interval'
    ? SelectionInitInterval
    : T extends 'single'
    ? SelectionInit
    : T extends 'multi'
    ? SelectionInit | SelectionInit[]
    : never)[];
  events: Stream[];
  materialized: OutputNode;
  bind?: 'scales' | Binding | Dict<Binding> | LegendBinding;
  resolve: SelectionResolution;
  empty: 'all' | 'none';
  mark?: BrushConfig;

  // Transforms
  project: SelectionProjectionComponent;
  scales?: SelectionProjection[];
  toggle?: any;
  translate?: any;
  zoom?: any;
  nearest?: any;
  clear?: any;
}

export interface SelectionCompiler<T extends SelectionType = SelectionType> {
  defined: (selCmpt: SelectionComponent<T>) => boolean;
  parse?: (model: UnitModel, selCmpt: SelectionComponent<T>, def: SelectionDef) => void;
  signals?: (model: UnitModel, selCmpt: SelectionComponent<T>, signals: NewSignal[]) => Signal[]; // the output can be a new or a push signal
  topLevelSignals?: (model: Model, selCmpt: SelectionComponent<T>, signals: NewSignal[]) => NewSignal[];
  modifyExpr?: (model: UnitModel, selCmpt: SelectionComponent<T>, expr: string) => string;
  marks?: (model: UnitModel, selCmpt: SelectionComponent<T>, marks: any[]) => any[];
}

export const selectionCompilers: SelectionCompiler[] = [
  single,
  multi,
  interval,
  project,
  toggle,
  scales,
  legends,
  translate,
  zoom,
  inputs,
  nearest,
  clear
];

function getFacetModel(model: Model): FacetModel {
  let parent = model.parent;
  while (parent) {
    if (isFacetModel(parent)) break;
    parent = parent.parent;
  }

  return parent as FacetModel;
}

export function unitName(model: Model, {escape} = {escape: true}) {
  let name = escape ? stringValue(model.name) : model.name;
  const facetModel = getFacetModel(model);
  if (facetModel) {
    const {facet} = facetModel;
    for (const channel of FACET_CHANNELS) {
      if (facet[channel]) {
        name += ` + '__facet_${channel}_' + (facet[${stringValue(facetModel.vgField(channel))}])`;
      }
    }
  }
  return name;
}

export function requiresSelectionId(model: Model) {
  return vals(model.component.selection ?? {}).reduce((identifier, selCmpt) => {
    return identifier || selCmpt.project.items.some(proj => proj.field === SELECTION_ID);
  }, false);
}
