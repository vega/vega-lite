import { Encoding } from '../encoding';
import { ExtendedLayerSpec, ExtendedUnitSpec, FacetedExtendedUnitSpec, GenericSpec } from '../spec';
import { GenericLayerSpec, NormalizedLayerSpec } from '../spec/layer';
import { SpecMapper } from '../spec/map';
import { NormalizedUnitSpec } from '../spec/unit';
import { NormalizerParams } from './base';
export declare class CoreNormalizer extends SpecMapper<NormalizerParams, FacetedExtendedUnitSpec, ExtendedLayerSpec> {
    private nonFacetUnitNormalizers;
    map(spec: GenericSpec<FacetedExtendedUnitSpec, ExtendedLayerSpec>, params: NormalizerParams): GenericSpec<import("../spec").GenericUnitSpec<Encoding<import("../fielddef").Field>, "square" | "area" | "circle" | "line" | "rect" | "text" | "rule" | "trail" | "point" | "geoshape" | "bar" | "tick" | import("../mark").MarkDef<import("../mark").Mark>>, GenericLayerSpec<import("../spec").GenericUnitSpec<Encoding<import("../fielddef").Field>, "square" | "area" | "circle" | "line" | "rect" | "text" | "rule" | "trail" | "point" | "geoshape" | "bar" | "tick" | import("../mark").MarkDef<import("../mark").Mark>>>>;
    mapUnit(spec: ExtendedUnitSpec, params: NormalizerParams): NormalizedUnitSpec | NormalizedLayerSpec;
    private mapUnitWithParentEncodingOrProjection;
    private mapFacetedUnit;
    mapLayer(spec: ExtendedLayerSpec, { parentEncoding, parentProjection, ...otherParams }: NormalizerParams): GenericLayerSpec<NormalizedUnitSpec>;
}
