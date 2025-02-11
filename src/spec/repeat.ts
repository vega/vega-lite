import {isArray} from 'vega-util';
import {LayerSpec, NonNormalizedSpec} from './index.js';
import {Field} from '../channeldef.js';
import {BaseSpec, GenericCompositionLayoutWithColumns, ResolveMixins} from './base.js';
import {UnitSpecWithFrame} from './unit.js';
import {hasProperty} from '../util.js';

export interface RepeatMapping {
  /**
   * An array of fields to be repeated vertically.
   */
  row?: string[];

  /**
   * An array of fields to be repeated horizontally.
   */
  column?: string[];
}

export interface LayerRepeatMapping extends RepeatMapping {
  /**
   * An array of fields to be repeated as layers.
   */
  layer: string[];
}

export type RepeatSpec = NonLayerRepeatSpec | LayerRepeatSpec;

/**
 * Base interface for a repeat specification.
 */
export interface NonLayerRepeatSpec extends BaseSpec, GenericCompositionLayoutWithColumns, ResolveMixins {
  /**
   * Definition for fields to be repeated. One of:
   * 1) An array of fields to be repeated. If `"repeat"` is an array, the field can be referred to as `{"repeat": "repeat"}`. The repeated views are laid out in a wrapped row. You can set the number of columns to control the wrapping.
   * 2) An object that maps `"row"` and/or `"column"` to the listed fields to be repeated along the particular orientations. The objects `{"repeat": "row"}` and `{"repeat": "column"}` can be used to refer to the repeated field respectively.
   */
  repeat: string[] | RepeatMapping;

  /**
   * A specification of the view that gets repeated.
   */
  spec: NonNormalizedSpec;
}

export interface LayerRepeatSpec extends BaseSpec, GenericCompositionLayoutWithColumns, ResolveMixins {
  /**
   * Definition for fields to be repeated. One of:
   * 1) An array of fields to be repeated. If `"repeat"` is an array, the field can be referred to as `{"repeat": "repeat"}`. The repeated views are laid out in a wrapped row. You can set the number of columns to control the wrapping.
   * 2) An object that maps `"row"` and/or `"column"` to the listed fields to be repeated along the particular orientations. The objects `{"repeat": "row"}` and `{"repeat": "column"}` can be used to refer to the repeated field respectively.
   */
  repeat: LayerRepeatMapping;

  /**
   * A specification of the view that gets repeated.
   */
  spec: LayerSpec<Field> | UnitSpecWithFrame<Field>;
}

export function isRepeatSpec(spec: BaseSpec): spec is RepeatSpec {
  return hasProperty(spec, 'repeat');
}

export function isLayerRepeatSpec(spec: RepeatSpec): spec is LayerRepeatSpec {
  return !isArray(spec.repeat) && hasProperty(spec.repeat, 'layer');
}
