import {Channel} from './channel';
import {VgBinding} from './vega.schema';
import {Dict} from './util';

export type SelectionTypes = 'single' | 'multi' | 'interval';
export type SelectionDomain = 'data' | 'visual';
export type SelectionResolutions = 'single' | 'independent' | 'union' |
  'union_others' | 'intersect' | 'intersect_others';

export interface BaseSelectionSpec {
  // domain?: SelectionDomain;
  on?: any;
  // predicate?: string;
  bind?: 'scales' | VgBinding | Dict<VgBinding>;

  // Transforms
  fields?: string[];
  encodings?: string[];
  toggle?: string | boolean;
  translate?: string | boolean;
  zoom?: string | boolean;
  nearest?: boolean;
}

export interface SelectionSpec extends BaseSelectionSpec {
  type: SelectionTypes;
}

export interface SelectionComponent {
  name: string;
  type: SelectionTypes;
  domain: SelectionDomain;
  events: any;
  // predicate?: string;
  bind?: 'scales' | VgBinding | Dict<VgBinding>;
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

export interface SelectionConfig {
  single: BaseSelectionSpec;
  multi: BaseSelectionSpec;
  interval: BaseSelectionSpec;
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
