import { GenericMarkDef } from '../mark';
import { NonFacetUnitNormalizer, Normalize, NormalizerParams } from '../normalize/base';
import { GenericSpec } from '../spec/index';
import { GenericLayerSpec, NormalizedLayerSpec } from '../spec/layer';
import { GenericUnitSpec, NormalizedUnitSpec } from '../spec/unit';
export declare type CompositeMarkUnitSpec<M extends string> = GenericUnitSpec<any, M | GenericMarkDef<M>>;
export declare class CompositeMarkNormalizer<M extends string> implements NonFacetUnitNormalizer<CompositeMarkUnitSpec<M>> {
    name: string;
    run: (spec: CompositeMarkUnitSpec<M>, params: NormalizerParams, normalize: Normalize<GenericUnitSpec<any, any> | GenericLayerSpec<any>, NormalizedLayerSpec | NormalizedUnitSpec>) => NormalizedLayerSpec;
    constructor(name: string, run: (spec: CompositeMarkUnitSpec<M>, params: NormalizerParams, normalize: Normalize<GenericUnitSpec<any, any> | GenericLayerSpec<any>, NormalizedLayerSpec | NormalizedUnitSpec>) => NormalizedLayerSpec);
    hasMatchingType(spec: GenericSpec<any, any>): spec is CompositeMarkUnitSpec<M>;
}
//# sourceMappingURL=base.d.ts.map