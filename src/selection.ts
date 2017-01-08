import {Channel} from './channel';
import {VgBinding} from './vega.schema';
import {Dict} from './util';

export type SelectionTypes = 'single' | 'multi' | 'interval';
export type SelectionDomain = 'data' | 'visual';
export type SelectionResolutions = 'single' | 'independent' | 'union' |
  'union_others' | 'intersect' | 'intersect_others';

export interface SelectionSpec {
  type: SelectionTypes;
  domain?: SelectionDomain;
  on?: any;
  predicate?: string;
  bind?: 'scales' | VgBinding | Dict<VgBinding>;

  // Transforms
  fields?: string[];
  encodings?: string[];
  toggle?: string | boolean;
  translate?: any;
  zoom?: any;
  nearest?: boolean;
}

export interface SelectionComponent {
  name: string;
  type: SelectionTypes;
  domain: SelectionDomain;
  events: any;
  predicate: string;
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
