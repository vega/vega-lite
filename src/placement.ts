import type {LabelAnchor} from 'vega';
import type {Mark} from './mark.js';
import type {SortOrder} from './sort.js';
import {hasProperty, isBoolean} from './util.js';

/**
 * Selects marks by their mark type.
 */
export interface PlacementMarkSelector {
  /**
   * A mark type or an array of mark types. Layers whose mark (after normalization) has one of these types are avoided.
   * For example, `"point": true` on a line creates a separate point layer, which matches `"point"`.
   */
  mark: Mark | Mark[];
}

/**
 * Selects layers by their name.
 */
export interface PlacementViewsSelector {
  /**
   * Names of layers to avoid, as set by the layer's `name`. A named layer that contains other layers selects all of them.
   */
  views: string[];
}

export type PlacementAvoidSelector = PlacementMarkSelector | PlacementViewsSelector;

export function isPlacementMarkSelector(s: PlacementAvoidSelector): s is PlacementMarkSelector {
  return hasProperty(s, 'mark');
}

export interface PlacementSort {
  /**
   * The data field to sort labels by. Labels placed earlier win when two labels compete for the same space.
   */
  field: string;

  /**
   * The sort order. One of `"ascending"` (default) or `"descending"`.
   */
  order?: SortOrder;
}

export interface TextPlacement {
  /**
   * Candidate positions of a label around its data point, tried in order. A label that collides at every position is hidden.
   * One of `"top-left"`, `"left"`, `"bottom-left"`, `"top"`, `"bottom"`, `"top-right"`, `"right"`, `"bottom-right"`, or `"middle"`.
   *
   * __Default value:__ The default anchors of the Vega label transform.
   */
  anchor?: LabelAnchor[];

  /**
   * Distance in pixels from the data point to the label, either one value for every anchor or one value per anchor.
   *
   * __Default value:__ The default offset of the Vega label transform.
   */
  offset?: number | number[];

  /**
   * Marks in the same view that labels must not overlap. Labels always avoid the labels placed by earlier placement layers in the same view.
   *
   * __Default value:__ `[]`
   */
  avoid?: PlacementAvoidSelector[];

  /**
   * The order in which labels of this layer are placed.
   *
   * __Default value:__ Data order.
   */
  sort?: PlacementSort;

  /**
   * How far, in pixels, labels may extend past the plot. If `null`, there is no limit.
   *
   * __Default value:__ `0`
   */
  padding?: number | null;
}

export interface TextPlacementMixins {
  /**
   * Places each label of a text mark around its data point so that it does not overlap other labels or the marks listed in `avoid`. Labels that fit nowhere are hidden.
   *
   * - If `true`, the default placement properties are used.
   * - In `config.text`, this only provides defaults for text marks that set `placement`. It does not turn placement on.
   *
   * __Default value:__ `undefined` (no placement)
   */
  placement?: boolean | TextPlacement;
}

export function isTextPlacementEnabled(placement: boolean | TextPlacement | undefined): boolean {
  return isBoolean(placement) ? placement : placement !== undefined && placement !== null;
}
