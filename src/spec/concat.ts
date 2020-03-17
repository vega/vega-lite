import {GenericSpec, NormalizedSpec} from '.';
import {BaseSpec, BoundsMixins, GenericCompositionLayoutWithColumns, ResolveMixins} from './base';

/**
 * Base layout mixins for V/HConcatSpec, which should not have RowCol<T> generic fo its property.
 */
export interface OneDirectionalConcatLayout extends BoundsMixins, ResolveMixins {
  /**
   * Boolean flag indicating if subviews should be centered relative to their respective rows or columns.
   *
   * __Default value:__ `false`
   */
  center?: boolean;

  /**
   * The spacing in pixels between sub-views of the concat operator.
   *
   * __Default value__: `10`
   */
  spacing?: number;
}

/**
 * Base interface for a generalized concatenation specification.
 */
export interface GenericConcatSpec<S extends GenericSpec<any, any, any, any>>
  extends BaseSpec,
    GenericCompositionLayoutWithColumns,
    ResolveMixins {
  /**
   * A list of views to be concatenated.
   */
  concat: S[];
}

/**
 * Base interface for a vertical concatenation specification.
 */
export interface GenericVConcatSpec<S extends GenericSpec<any, any, any, any>>
  extends BaseSpec,
    OneDirectionalConcatLayout {
  /**
   * A list of views to be concatenated and put into a column.
   */
  vconcat: S[];
}

/**
 * Base interface for a horizontal concatenation specification.
 */
export interface GenericHConcatSpec<S extends GenericSpec<any, any, any, any>>
  extends BaseSpec,
    OneDirectionalConcatLayout {
  /**
   * A list of views to be concatenated and put into a row.
   */
  hconcat: S[];
}

/** A concat spec without any shortcut/expansion syntax */
export type NormalizedConcatSpec =
  | GenericConcatSpec<NormalizedSpec>
  | GenericVConcatSpec<NormalizedSpec>
  | GenericHConcatSpec<NormalizedSpec>;

export function isAnyConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any> | GenericHConcatSpec<any> {
  return isVConcatSpec(spec) || isHConcatSpec(spec) || isConcatSpec(spec);
}

export function isConcatSpec(spec: BaseSpec): spec is GenericConcatSpec<any> {
  return 'concat' in spec;
}

export function isVConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any> {
  return 'vconcat' in spec;
}

export function isHConcatSpec(spec: BaseSpec): spec is GenericHConcatSpec<any> {
  return 'hconcat' in spec;
}
