import { Resolve } from '../resolve';
import { BaseSpec, BoundsMixins } from './base';
import { GenericSpec } from './index';
import { GenericLayerSpec, NormalizedLayerSpec } from './layer';
import { GenericUnitSpec, NormalizedUnitSpec } from './unit';
/**
 * Base layout mixins for V/HConcatSpec.
 * Concat layout should not have RowCol<T> generic fo its property.
 */
export interface ConcatLayout extends BoundsMixins {
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
 * Base interface for a vertical concatenation specification.
 */
export interface GenericVConcatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> extends BaseSpec, ConcatLayout {
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
export interface GenericHConcatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> extends BaseSpec, ConcatLayout {
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
export declare type NormalizedConcatSpec = GenericVConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec> | GenericHConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>;
export declare function isConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any> | GenericHConcatSpec<any, any>;
export declare function isVConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any>;
export declare function isHConcatSpec(spec: BaseSpec): spec is GenericHConcatSpec<any, any>;
