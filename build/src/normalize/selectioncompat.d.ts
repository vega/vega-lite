import { Field } from '../channeldef';
import { FacetedUnitSpec, GenericSpec, LayerSpec, RepeatSpec, UnitSpec } from '../spec';
import { SpecMapper } from '../spec/map';
import { NormalizerParams } from './base';
export declare class SelectionCompatibilityNormalizer extends SpecMapper<NormalizerParams, FacetedUnitSpec<Field>, LayerSpec<Field>, UnitSpec<Field>> {
    map(spec: GenericSpec<FacetedUnitSpec<Field>, LayerSpec<Field>, RepeatSpec, Field>, normParams: NormalizerParams): GenericSpec<UnitSpec<Field>, import("../spec").GenericLayerSpec<UnitSpec<Field>>, never, string>;
    mapLayerOrUnit(spec: FacetedUnitSpec<Field> | LayerSpec<Field>, normParams: NormalizerParams): UnitSpec<Field> | import("../spec").GenericLayerSpec<UnitSpec<Field>>;
    mapUnit(spec: UnitSpec<Field>, normParams: NormalizerParams): any;
}
//# sourceMappingURL=selectioncompat.d.ts.map