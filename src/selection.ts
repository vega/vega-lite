import {SingleDefChannel} from './channel';
import {VgBinding} from './vega.schema';

export type SelectionTypes = 'single' | 'multi' | 'interval';
export type SelectionResolutions = 'global' | 'independent' | 'union' |
  'union_others' | 'intersect' | 'intersect_others';

export interface BaseSelectionDef {
  on?: any;
  resolve?: SelectionResolutions;
  // predicate?: string;
  // domain?: SelectionDomain;

  // Transforms
  fields?: string[];
  encodings?: SingleDefChannel[];
}

export interface BaseSingleSelectionDef extends BaseSelectionDef {
  bind?: VgBinding | {[key: string]: VgBinding};
  nearest?: boolean;
}

export interface BaseMultiSelectionDef extends BaseSelectionDef {
  toggle?: string | boolean;
  nearest?: boolean;
}

export interface BaseIntervalSelectionDef extends BaseSelectionDef {
  translate?: string | boolean;
  zoom?: string | boolean;
  bind?: 'scales';
}

export interface SingleSelection extends BaseSingleSelectionDef {
  type: 'single';
}

export interface MultiSelection extends BaseMultiSelectionDef {
  type: 'multi';
}

export interface IntervalSelection extends BaseIntervalSelectionDef {
  type: 'interval';
}

export type SelectionDef = SingleSelection | MultiSelection | IntervalSelection;

export interface SelectionConfig {
  single: BaseSingleSelectionDef;
  multi: BaseMultiSelectionDef;
  interval: BaseIntervalSelectionDef;
}

export const defaultConfig:SelectionConfig = {
  single: {on: 'click', fields: ['_id'], resolve: 'global'},
  multi: {on: 'click', fields: ['_id'], toggle: 'event.shiftKey', resolve: 'global'},
  interval: {
    on: '[mousedown, window:mouseup] > window:mousemove!',
    encodings: ['x', 'y'],
    translate: '[mousedown, window:mouseup] > window:mousemove!',
    zoom: 'wheel',
    resolve: 'global'
  }
};
