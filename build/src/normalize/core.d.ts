import { Field, FieldName } from '../channeldef';
import { FacetedUnitSpec, GenericSpec, LayerSpec, UnitSpec } from '../spec';
import { GenericConcatSpec } from '../spec/concat';
import { GenericFacetSpec, NormalizedFacetSpec } from '../spec/facet';
import { NormalizedSpec } from '../spec/index';
import { NormalizedLayerSpec } from '../spec/layer';
import { SpecMapper } from '../spec/map';
import { RepeatSpec } from '../spec/repeat';
import { NormalizedUnitSpec } from '../spec/unit';
import { NormalizerParams } from './base';
export declare class CoreNormalizer extends SpecMapper<NormalizerParams, FacetedUnitSpec<Field>, LayerSpec<Field>> {
    private nonFacetUnitNormalizers;
    map(spec: GenericSpec<FacetedUnitSpec<Field>, LayerSpec<Field>, RepeatSpec, Field>, params: NormalizerParams): NormalizedUnitSpec | NormalizedFacetSpec | import("../spec").GenericLayerSpec<NormalizedUnitSpec> | GenericConcatSpec<GenericSpec<NormalizedUnitSpec, import("../spec").GenericLayerSpec<NormalizedUnitSpec>, never, string>> | import("../spec").GenericVConcatSpec<GenericSpec<NormalizedUnitSpec, import("../spec").GenericLayerSpec<NormalizedUnitSpec>, never, string>> | import("../spec").GenericHConcatSpec<GenericSpec<NormalizedUnitSpec, import("../spec").GenericLayerSpec<NormalizedUnitSpec>, never, string>>;
    mapUnit(spec: UnitSpec<Field>, params: NormalizerParams): NormalizedUnitSpec | NormalizedLayerSpec;
    protected mapRepeat(spec: RepeatSpec, params: NormalizerParams): GenericConcatSpec<NormalizedSpec> | NormalizedLayerSpec;
    private mapLayerRepeat;
    private mapNonLayerRepeat;
    protected mapFacet(spec: GenericFacetSpec<UnitSpec<Field>, LayerSpec<Field>, Field>, params: NormalizerParams): GenericFacetSpec<NormalizedUnitSpec, NormalizedLayerSpec, FieldName>;
    private mapUnitWithParentEncodingOrProjection;
    private mapFacetedUnit;
    private getFacetMappingAndLayout;
    mapLayer(spec: LayerSpec<Field>, { parentEncoding, parentProjection, ...otherParams }: NormalizerParams): NormalizedLayerSpec;
}
//# sourceMappingURL=core.d.ts.map