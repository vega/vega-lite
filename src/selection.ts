import {SingleDefChannel} from './channel';
import {VgBinding} from './vega.schema';

export type SelectionTypes = 'single' | 'multi' | 'interval';
export type SelectionResolutions = 'global' | 'independent' | 'union' |
  'union_others' | 'intersect' | 'intersect_others';

export interface BaseSelectionDef {
  on?: any;
  resolve?: SelectionResolutions;
  // TODO(https://github.com/vega/vega-lite/issues/2596).
  // predicate?: string;
  // domain?: SelectionDomain;

  // Transforms
  fields?: string[];
  encodings?: SingleDefChannel[];
}

export interface SingleSelectionConfig extends BaseSelectionDef {
  bind?: VgBinding | {[key: string]: VgBinding};
  nearest?: boolean;
}

export interface MultiSelectionConfig extends BaseSelectionDef {
  toggle?: string | boolean;
  nearest?: boolean;
}

export interface BrushConfig {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  strokeDash?: number[];
  strokeDashOffset?: number;
}

export interface IntervalSelectionConfig extends BaseSelectionDef {
  translate?: string | boolean;
  zoom?: string | boolean;
  bind?: 'scales';
  mark?: BrushConfig;
}

export interface SingleSelection extends SingleSelectionConfig {
  type: 'single';
}

export interface MultiSelection extends MultiSelectionConfig {
  type: 'multi';
}

export interface IntervalSelection extends IntervalSelectionConfig {
  type: 'interval';
}

export type SelectionDef = SingleSelection | MultiSelection | IntervalSelection;

export interface SelectionConfig {
  single: SingleSelectionConfig;
  multi: MultiSelectionConfig;
  interval: IntervalSelectionConfig;
}

export const defaultConfig:SelectionConfig = {
  single: {on: 'click', fields: ['_id'], resolve: 'global'},
  multi: {on: 'click', fields: ['_id'], toggle: 'event.shiftKey', resolve: 'global'},
  interval: {
    on: '[mousedown, window:mouseup] > window:mousemove!',
    encodings: ['x', 'y'],
    translate: '[mousedown, window:mouseup] > window:mousemove!',
    zoom: 'wheel!',
    mark: {fill: '#333', fillOpacity: 0.125, stroke: 'white'},
    resolve: 'global'
  }
};
