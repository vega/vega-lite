import { Field } from '../channeldef';
import { SharedCompositeEncoding } from '../compositemark';
import { ExprRef } from '../expr';
import { Projection } from '../projection';
import { BaseSpec, FrameMixins, ResolveMixins } from './base';
import { GenericUnitSpec, NormalizedUnitSpec, UnitSpec } from './unit';
/**
 * Base interface for a layer specification.
 */
export interface GenericLayerSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec, FrameMixins, ResolveMixins {
    /**
     * Layer or single view specifications to be layered.
     *
     * __Note__: Specifications inside `layer` cannot use `row` and `column` channels as layering facet specifications is not allowed. Instead, use the [facet operator](https://vega.github.io/vega-lite/docs/facet.html) and place a layer inside a facet.
     */
    layer: (GenericLayerSpec<U> | U)[];
}
/**
 * A full layered plot specification, which may contains `encoding` and `projection` properties that will be applied to underlying unit (single-view) specifications.
 */
export interface LayerSpec<F extends Field> extends BaseSpec, FrameMixins, ResolveMixins {
    /**
     * Layer or single view specifications to be layered.
     *
     * __Note__: Specifications inside `layer` cannot use `row` and `column` channels as layering facet specifications is not allowed. Instead, use the [facet operator](https://vega.github.io/vega-lite/docs/facet.html) and place a layer inside a facet.
     */
    layer: (LayerSpec<F> | UnitSpec<F>)[];
    /**
     * A shared key-value mapping between encoding channels and definition of fields in the underlying layers.
     */
    encoding?: SharedCompositeEncoding<F>;
    /**
     * An object defining properties of the geographic projection shared by underlying layers.
     */
    projection?: Projection<ExprRef>;
}
/**
 * A layered specification without any shortcut/expansion syntax.
 */
export type NormalizedLayerSpec = GenericLayerSpec<NormalizedUnitSpec>;
export declare function isLayerSpec(spec: BaseSpec): spec is GenericLayerSpec<any>;
//# sourceMappingURL=layer.d.ts.map