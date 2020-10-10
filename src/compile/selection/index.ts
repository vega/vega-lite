import {Binding, isString, NewSignal, Signal, Stream} from 'vega';
import {stringValue} from 'vega-util';
import {FACET_CHANNELS} from '../../channel';
import {
  BrushConfig,
  LegendBinding,
  SelectionInit,
  SelectionInitInterval,
  SelectionResolution,
  SelectionType
} from '../../selection';
import {Dict, vals} from '../../util';
import {OutputNode} from '../data/dataflow';
import {FacetModel} from '../facet';
import {isFacetModel, Model} from '../model';
import {UnitModel} from '../unit';
import interval from './interval';
import point from './point';
import {SelectionProjection, SelectionProjectionComponent} from './project';
import {SelectionParameter} from '../../selection';
import clear from './clear';
import inputs from './inputs';
import nearest from './nearest';
import project from './project';
import scales from './scales';
import legends from './legends';
import toggle from './toggle';
import translate from './translate';
import zoom from './zoom';
import {ParameterName} from '../../parameter';

export const STORE = '_store';
export const TUPLE = '_tuple';
export const MODIFY = '_modify';
export const SELECTION_DOMAIN = '_selection_domain_';
export const VL_SELECTION_RESOLVE = 'vlSelectionResolve';

export interface SelectionComponent<T extends SelectionType = SelectionType> {
  name: ParameterName;
  type: T;
  // Use conditional types for stricter type of init (as the type of init depends on selection type).
  init?: (T extends 'interval' ? SelectionInitInterval : T extends 'point' ? SelectionInit : never)[][];
  events: Stream[];
  materialized: OutputNode;
  bind?: 'scales' | Binding | Dict<Binding> | LegendBinding;
  resolve: SelectionResolution;
  mark?: BrushConfig;
  project: SelectionProjectionComponent;
  scales?: SelectionProjection[];
  toggle?: string;
  translate?: any;
  zoom?: any;
  nearest?: any;
  clear?: any;
}

export interface SelectionCompiler<T extends SelectionType = SelectionType> {
  defined: (selCmpt: SelectionComponent) => boolean;
  parse?: (model: UnitModel, selCmpt: SelectionComponent<T>, def: SelectionParameter<T>) => void;
  signals?: (model: UnitModel, selCmpt: SelectionComponent<T>, signals: NewSignal[]) => Signal[]; // the output can be a new or a push signal
  topLevelSignals?: (model: Model, selCmpt: SelectionComponent<T>, signals: NewSignal[]) => NewSignal[];
  modifyExpr?: (model: UnitModel, selCmpt: SelectionComponent<T>, expr: string) => string;
  marks?: (model: UnitModel, selCmpt: SelectionComponent<T>, marks: any[]) => any[];
}

// Order matters for parsing and assembly.
export const selectionCompilers: SelectionCompiler[] = [
  point,
  interval,
  project,
  toggle,

  // Bindings may disable direct manipulation.
  inputs,
  scales,
  legends,

  clear,
  translate,
  zoom,
  nearest
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
    return identifier || selCmpt.project.hasSelectionId;
  }, false);
}

// Binding a point selection to query widgets or legends disables default direct manipulation interaction.
// A user can choose to re-enable it by explicitly specifying triggering input events.
export function disableDirectManipulation(selCmpt: SelectionComponent, selDef: SelectionParameter<'point'>) {
  if (isString(selDef.select) || !selDef.select.on) delete selCmpt.events;
  if (isString(selDef.select) || !selDef.select.clear) delete selCmpt.clear;
  if (isString(selDef.select) || !selDef.select.toggle) delete selCmpt.toggle;
}
