import { Field } from '../channeldef';
import { NormalizedLayerSpec, NormalizedSpec, NormalizedUnitSpec, TopLevel, UnitSpec } from '../spec';
import { SpecMapper } from '../spec/map';
import { NormalizerParams } from './base';
export declare class TopLevelSelectionsNormalizer extends SpecMapper<NormalizerParams, NormalizedUnitSpec> {
    map(spec: TopLevel<NormalizedSpec>, normParams: NormalizerParams): TopLevel<NormalizedSpec>;
    mapUnit(spec: UnitSpec<Field>, normParams: NormalizerParams): NormalizedUnitSpec | NormalizedLayerSpec;
}
//# sourceMappingURL=toplevelselection.d.ts.map