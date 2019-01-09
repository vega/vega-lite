import { Encoding, EncodingWithFacet } from '../encoding';
import { RepeatRef } from '../fielddef';
import { AnyMark, Mark, MarkDef } from '../mark';
import { Projection } from '../projection';
import { SelectionDef } from '../selection';
import { BaseSpec, LayoutSizeMixins } from './base';
export { normalizeTopLevelSpec as normalize } from '../normalize';
export { BaseSpec, DataMixins, LayoutSizeMixins } from './base';
export { TopLevel } from './toplevel';
/**
 * Base interface for a unit (single-view) specification.
 */
export interface GenericUnitSpec<E extends Encoding<any>, M> extends BaseSpec, LayoutSizeMixins {
    /**
     * A string describing the mark type (one of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
     * `"area"`, `"point"`, `"rule"`, `"geoshape"`, and `"text"`) or a [mark definition object](https://vega.github.io/vega-lite/docs/mark.html#mark-def).
     */
    mark: M;
    /**
     * A key-value mapping between encoding channels and definition of fields.
     */
    encoding?: E;
    /**
     * An object defining properties of geographic projection, which will be applied to `shape` path for `"geoshape"` marks
     * and to `latitude` and `"longitude"` channels for other marks.
     */
    projection?: Projection;
    /**
     * A key-value mapping between selection names and definitions.
     */
    selection?: {
        [name: string]: SelectionDef;
    };
}
/**
 * A unit specification without any shortcut/expansion syntax.
 */
export declare type NormalizedUnitSpec = GenericUnitSpec<Encoding<string | RepeatRef>, Mark | MarkDef>;
/**
 * Unit spec that can have a composite mark.
 */
export declare type CompositeUnitSpec = GenericUnitSpec<Encoding<string | RepeatRef>, AnyMark>;
/**
 * Unit spec that can have a composite mark and row or column channels.
 */
export declare type FacetedCompositeUnitSpec = GenericUnitSpec<EncodingWithFacet<string | RepeatRef>, AnyMark>;
export declare function isUnitSpec(spec: BaseSpec): spec is FacetedCompositeUnitSpec | NormalizedUnitSpec;
