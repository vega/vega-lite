import { Field } from '../channeldef';
import { Encoding } from '../encoding';
import { GenericSpec } from '../spec';
import { GenericUnitSpec } from '../spec/unit';
import { NonFacetUnitNormalizer, NormalizeLayerOrUnit, NormalizerParams } from './base';
interface EncodingX2Mixins {
    x2: Encoding<Field>['x2'];
}
interface EncodingY2Mixins {
    y2: Encoding<Field>['y2'];
}
type RangedLineSpec = GenericUnitSpec<Encoding<Field> & (EncodingX2Mixins | EncodingY2Mixins), 'line' | {
    mark: 'line';
}>;
export declare class RuleForRangedLineNormalizer implements NonFacetUnitNormalizer<RangedLineSpec> {
    name: string;
    hasMatchingType(spec: GenericSpec<any, any, any, any>): spec is RangedLineSpec;
    run(spec: RangedLineSpec, params: NormalizerParams, normalize: NormalizeLayerOrUnit): import("../spec").NormalizedUnitSpec | import("../spec").NormalizedLayerSpec;
}
export {};
//# sourceMappingURL=ruleforrangedline.d.ts.map