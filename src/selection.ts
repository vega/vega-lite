import {VgBinding} from './vega.schema';

export type SelectionTypes = 'single' | 'multi' | 'interval';
export type SelectionDomain = 'data' | 'visual';
export type SelectionResolutions = 'single' | 'independent' | 'union' |
  'union_others' | 'intersect' | 'intersect_others';

export interface BaseSelectionDef {
  // domain?: SelectionDomain;
  on?: any;
  // predicate?: string;
  bind?: 'scales' | VgBinding | {[key: string]: VgBinding};

  // Transforms
  fields?: string[];
  encodings?: string[];
  toggle?: string | boolean;
  translate?: string | boolean;
  zoom?: string | boolean;
  nearest?: boolean;
}

export interface SelectionDef extends BaseSelectionDef {
  type: SelectionTypes;
}

export interface SelectionConfig {
  single: BaseSelectionDef;
  multi: BaseSelectionDef;
  interval: BaseSelectionDef;
}

export const defaultConfig:SelectionConfig = {
  single: {on: 'click', fields: ['_id']},
  multi: {on: 'click', fields: ['_id'], toggle: 'event.shiftKey'},
  interval: {
    on: '[mousedown, window:mouseup] > window:mousemove!',
    encodings: ['x', 'y'],
    translate: '[mousedown, window:mouseup] > window:mousemove!',
    zoom: 'wheel'
  }
};
