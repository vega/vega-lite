import {Channel} from './channel';

export type SelectionTypes = 'single' | 'multi' | 'interval';
export type SelectionDomain = 'data' | 'visual';
export type SelectionResolutions = 'single' | 'independent' | 'union' |
  'union_others' | 'intersect' | 'intersect_others';

export interface SelectionSpec {
  type: SelectionTypes;
  domain?: SelectionDomain;
  on?: any;
  predicate?: string;
  bind?: any;

  // Transforms
  project?: ProjectSpec;
  toggle?: string | boolean;
  translate?: any;
  zoom?: any;
  nearest?: any;
}

export interface SelectionComponent {
  name: string;
  type: SelectionTypes;
  domain: SelectionDomain;
  events: any;
  predicate: string;
  bind: any;
  resolve: SelectionResolutions;

  // Transforms
  project?: ProjectComponent[];
  toggle?: any;
  translate?: any;
  zoom?: any;
  nearest?: any;
}

export interface ProjectSpec {
  fields?: string[];
  encodings?: string[];
}

export interface ProjectComponent {
  field?: string;
  encoding?: Channel;
}
