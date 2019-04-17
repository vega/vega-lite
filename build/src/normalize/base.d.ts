import { Config } from '../config';
import { Encoding } from '../encoding';
import { Projection } from '../projection';
import { GenericSpec, NormalizedSpec } from '../spec/index';
import { GenericLayerSpec, NormalizedLayerSpec } from '../spec/layer';
import { GenericUnitSpec, NormalizedUnitSpec } from '../spec/unit';
export declare type Normalize<S extends GenericSpec<any, any>, NS extends NormalizedSpec> = (spec: S, params: NormalizerParams) => NS;
export interface ExtraNormalizer<S extends GenericSpec<any, any>, // Input type
O extends NormalizedSpec, // Output Type
SN extends GenericSpec<any, any> = S> {
    name: string;
    hasMatchingType: (spec: GenericSpec<any, any>, config: Config) => spec is S;
    run(spec: S, params: NormalizerParams, normalize: Normalize<SN, O>): O;
}
export declare type NonFacetUnitNormalizer<S extends GenericUnitSpec<any, any>> = ExtraNormalizer<S, NormalizedUnitSpec | NormalizedLayerSpec, GenericUnitSpec<any, any> | GenericLayerSpec<any>>;
export declare type NormalizeLayerOrUnit = Normalize<GenericUnitSpec<any, any> | GenericLayerSpec<any>, NormalizedUnitSpec | NormalizedLayerSpec>;
export interface NormalizerParams {
    config: Config;
    parentEncoding?: Encoding<any>;
    parentProjection?: Projection;
}
//# sourceMappingURL=base.d.ts.map