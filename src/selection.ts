import {SingleDefChannel} from './channel';
import {VgBinding} from './vega.schema';

export type SelectionTypes = 'single' | 'multi' | 'interval';
export type SelectionResolutions = 'global' | 'independent' | 'union' |
  'union_others' | 'intersect' | 'intersect_others';

export interface BaseSelectionDef {
  /**
   * A Vega event stream (object or selector) that triggers the selection.
   */
  on?: any;
  /**
   * With layered and multi-view displays, a strategy that determines how
   * selections' data queries are resolved when applied in a filter transform,
   * conditional encoding rule, or scale domain. One of: "global", "union",
   * "intersect", "union_others", or "intersect_others".
   *
   * __global__: Only one instance of the selection exists across all
   * views. When a user interacts within a new view, any previous selections
   * are overridden.
   *
   * __union__: Each view contains its own selection, and a data value is
   * considered to be selected if it falls within _any_ of these selection
   * instances.
   *
   * __intersect__: Each view contains its own selection, and a data value is
   * considered to be selected if it falls within _all_ of these selection
   * instances.
   *
   * __union_others__: Each view contains its own selection, and a data value
   * is considered to be selected if it falls within _any_ of the selection
   * instances of _other_ views. Thus, a view's own selection is not considered
   * when evaluating its own data values.
   *
   * __intersect_others__: Each view contains its own selection, and a data value
   * is considered to be selected if it falls within _all_ of the selection
   * instances of _other_ views. Thus, a view's own selection is not considered
   * when evaluating its own data values.
   *
   */
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
  /**
   * The fill color of the interval mark.
   *
   * __Default value:__ `#333333`
   *
   */
  fill?: string;
  /**
   * The fill opacity of the interval mark (a value between 0 and 1).
   *
   * __Default value:__ `0.125`
   */
  fillOpacity?: number;
  /**
   * The stroke color of the interval mark.
   *
   * __Default value:__ `#ffffff`
   */
  stroke?: string;
  /**
   * The stroke opacity of the interval mark (a value between 0 and 1).
   */
  strokeOpacity?: number;
  /**
   * The stroke width of the interval mark.
   */
  strokeWidth?: number;
  /**
   * An array of alternating stroke and space lengths,
   * for creating dashed or dotted lines.
   */
  strokeDash?: number[];
  /**
   * The offset (in pixels) with which to begin drawing the stroke dash array.
   */
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
