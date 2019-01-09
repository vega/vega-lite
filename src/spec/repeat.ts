import {Resolve} from '../resolve';
import {BaseSpec} from './base';
import {GenericSpec} from './index';
import {GenericLayerSpec, NormalizedLayerSpec} from './layer';
import {Repeat} from './repeat';
import {GenericCompositionLayout} from './toplevel';
import {GenericUnitSpec, NormalizedUnitSpec} from './unit';

export interface Repeat {
  /**
   * Vertical repeated views.
   */
  row?: string[];

  /**
   * Horizontal repeated views.
   */
  column?: string[];
}

/**
 * Base interface for a repeat specification.
 */
export interface GenericRepeatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    GenericCompositionLayout {
  /**
   * An object that describes what fields should be repeated into views that are laid out as a `row` or `column`.
   */
  repeat: Repeat;

  spec: GenericSpec<U, L>;

  /**
   * Scale and legend resolutions for repeated charts.
   */
  resolve?: Resolve;
}

/**
 * A repeat specification without any shortcut/expansion syntax.
 */
export type NormalizedRepeatSpec = GenericRepeatSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export function isRepeatSpec(spec: BaseSpec): spec is GenericRepeatSpec<any, any> {
  return spec['repeat'] !== undefined;
}
