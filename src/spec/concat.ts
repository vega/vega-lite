import {Resolve} from '../resolve';
import {BaseSpec} from './base';
import {GenericSpec} from './index';
import {GenericLayerSpec, NormalizedLayerSpec} from './layer';
import {ConcatLayout} from './toplevel';
import {GenericUnitSpec, NormalizedUnitSpec} from './unit';

/**
 * Base interface for a vertical concatenation specification.
 */
export interface GenericVConcatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    ConcatLayout {
  /**
   * A list of views that should be concatenated and put into a column.
   */
  vconcat: (GenericSpec<U, L>)[];

  /**
   * Scale, axis, and legend resolutions for vertically concatenated charts.
   */
  resolve?: Resolve;
}

/**
 * Base interface for a horizontal concatenation specification.
 */
export interface GenericHConcatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    ConcatLayout {
  /**
   * A list of views that should be concatenated and put into a row.
   */
  hconcat: (GenericSpec<U, L>)[];

  /**
   * Scale, axis, and legend resolutions for horizontally concatenated charts.
   */
  resolve?: Resolve;
}
/** A concat spec without any shortcut/expansion syntax */
export type NormalizedConcatSpec =
  | GenericVConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>
  | GenericHConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export function isConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any> | GenericHConcatSpec<any, any> {
  return isVConcatSpec(spec) || isHConcatSpec(spec);
}

export function isVConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any> {
  return spec['vconcat'] !== undefined;
}

export function isHConcatSpec(spec: BaseSpec): spec is GenericHConcatSpec<any, any> {
  return spec['hconcat'] !== undefined;
}
