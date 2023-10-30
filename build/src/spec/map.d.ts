import { GenericSpec } from '.';
import { Field, FieldName } from '../channeldef';
import { GenericConcatSpec, GenericHConcatSpec, GenericVConcatSpec } from './concat';
import { GenericFacetSpec } from './facet';
import { GenericLayerSpec } from './layer';
import { RepeatSpec } from './repeat';
import { GenericUnitSpec, NormalizedUnitSpec } from './unit';
export declare abstract class SpecMapper<P, UI extends GenericUnitSpec<any, any>, LI extends GenericLayerSpec<any> = GenericLayerSpec<UI>, UO extends GenericUnitSpec<any, any> = NormalizedUnitSpec, RO extends RepeatSpec = never, FO extends Field = FieldName> {
    map(spec: GenericSpec<UI, LI, RepeatSpec, Field>, params: P): GenericSpec<UO, GenericLayerSpec<UO>, RO, FO>;
    mapLayerOrUnit(spec: UI | LI, params: P): UO | GenericLayerSpec<UO>;
    abstract mapUnit(spec: UI, params: P): UO | GenericLayerSpec<UO>;
    protected mapLayer(spec: LI, params: P): GenericLayerSpec<UO>;
    protected mapHConcat(spec: GenericHConcatSpec<GenericSpec<UI, LI, RepeatSpec, Field>>, params: P): GenericHConcatSpec<GenericSpec<UO, GenericLayerSpec<UO>, RO, FO>>;
    protected mapVConcat(spec: GenericVConcatSpec<GenericSpec<UI, LI, RepeatSpec, Field>>, params: P): GenericVConcatSpec<GenericSpec<UO, GenericLayerSpec<UO>, RO, FO>>;
    protected mapConcat(spec: GenericConcatSpec<GenericSpec<UI, LI, RepeatSpec, Field>>, params: P): GenericConcatSpec<GenericSpec<UO, GenericLayerSpec<UO>, RO, FO>>;
    protected mapFacet(spec: GenericFacetSpec<UI, LI, Field>, params: P): GenericFacetSpec<UO, GenericLayerSpec<UO>, FO>;
    protected mapRepeat(spec: RepeatSpec, params: P): GenericSpec<UO, any, RO, FO>;
}
//# sourceMappingURL=map.d.ts.map