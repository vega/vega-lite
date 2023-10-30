import { Config } from '../config';
import { Encoding } from '../encoding';
import { Mark, MarkDef } from '../mark';
import { GenericUnitSpec, NormalizedUnitSpec } from '../spec';
import { NonFacetUnitNormalizer, NormalizeLayerOrUnit, NormalizerParams } from './base';
type UnitSpecWithPathOverlay = GenericUnitSpec<Encoding<string>, Mark | MarkDef<'line' | 'area' | 'rule' | 'trail'>>;
export declare class PathOverlayNormalizer implements NonFacetUnitNormalizer<UnitSpecWithPathOverlay> {
    name: string;
    hasMatchingType(spec: GenericUnitSpec<any, Mark | MarkDef>, config: Config): spec is UnitSpecWithPathOverlay;
    run(spec: UnitSpecWithPathOverlay, normParams: NormalizerParams, normalize: NormalizeLayerOrUnit): NormalizedUnitSpec | import("../spec").NormalizedLayerSpec;
}
export {};
//# sourceMappingURL=pathoverlay.d.ts.map