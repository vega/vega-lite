import { GenericConcatSpec, GenericHConcatSpec, GenericVConcatSpec } from './concat';
import { GenericFacetSpec } from './facet';
import { GenericSpec } from './index';
import { GenericLayerSpec } from './layer';
import { GenericRepeatSpec } from './repeat';
import { GenericUnitSpec, NormalizedUnitSpec } from './unit';
export declare abstract class SpecMapper<P, UI extends GenericUnitSpec<any, any>, LI extends GenericLayerSpec<any> = GenericLayerSpec<UI>, UO extends GenericUnitSpec<any, any> = NormalizedUnitSpec> {
    map(spec: GenericSpec<UI, LI>, params: P): GenericSpec<UO, GenericLayerSpec<UO>>;
    mapLayerOrUnit(spec: UI | LI, params: P): UO | GenericLayerSpec<UO>;
    abstract mapUnit(spec: UI, params: P): UO | GenericLayerSpec<UO>;
    protected mapLayer(spec: LI, params: P): GenericLayerSpec<UO>;
    protected mapHConcat(spec: GenericHConcatSpec<UI, LI>, params: P): GenericHConcatSpec<UO, GenericLayerSpec<UO>>;
    protected mapVConcat(spec: GenericVConcatSpec<UI, LI>, params: P): GenericVConcatSpec<UO, GenericLayerSpec<UO>>;
    protected mapConcat(spec: GenericConcatSpec<UI, LI>, params: P): GenericConcatSpec<UO, GenericLayerSpec<UO>>;
    protected mapFacet(spec: GenericFacetSpec<UI, LI>, params: P): GenericFacetSpec<UO, GenericLayerSpec<UO>>;
    protected mapRepeat(spec: GenericRepeatSpec<UI, LI>, params: P): GenericRepeatSpec<UO, GenericLayerSpec<UO>>;
}
//# sourceMappingURL=map.d.ts.map