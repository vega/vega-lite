import {FieldName} from '../channeldef';
import {GenericSpec, LayerSpec} from '.';
import {FacetedUnitSpec} from './unit';
import {BaseSpec, GenericCompositionLayoutWithColumns, ResolveMixins} from './base';

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

/**
 * Base interface for a repeat specification.
 */
export interface RepeatSpec extends BaseSpec, GenericCompositionLayoutWithColumns, ResolveMixins {
  /**
   * Definition for fields to be repeated. One of:
   * 1) An array of fields to be repeated. If `"repeat"` is an array, the field can be referred using `{"repeat": "repeat"}`
   * 2) An object that mapped `"row"` and/or `"column"` to the listed of fields to be repeated along the particular orientations. The objects `{"repeat": "row"}` and `{"repeat": "column"}` can be used to refer to the repeated field respectively.
   */
  repeat: string[] | RepeatMapping;

  /**
   * A specification of the view that gets repeated.
   */
  spec: GenericSpec<FacetedUnitSpec, LayerSpec, RepeatSpec, FieldName>;
}

export function isRepeatSpec(spec: BaseSpec): spec is RepeatSpec {
  return spec['repeat'] !== undefined;
}
