import { Field } from '../channeldef';
import { Config } from '../config';
import { Encoding } from '../encoding';
import { Mark, MarkDef } from '../mark';
import { GenericUnitSpec } from '../spec';
import { NonFacetUnitNormalizer, NormalizeLayerOrUnit, NormalizerParams } from './base';
declare type UnitSpecWithPathOverlay = GenericUnitSpec<Encoding<string>, Mark | MarkDef<'line' | 'area' | 'rule' | 'trail'>>;
export declare class PathOverlayNormalizer implements NonFacetUnitNormalizer<UnitSpecWithPathOverlay> {
    name: string;
    hasMatchingType(spec: GenericUnitSpec<any, Mark | MarkDef>, config: Config): spec is UnitSpecWithPathOverlay;
    run(spec: UnitSpecWithPathOverlay, params: NormalizerParams, normalize: NormalizeLayerOrUnit): GenericUnitSpec<Encoding<Field>, "text" | "area" | "bar" | "line" | "trail" | "point" | "tick" | "rect" | "rule" | "circle" | "square" | "geoshape" | MarkDef<Mark>> | import("../spec").GenericLayerSpec<GenericUnitSpec<Encoding<Field>, "text" | "area" | "bar" | "line" | "trail" | "point" | "tick" | "rect" | "rule" | "circle" | "square" | "geoshape" | MarkDef<Mark>>>;
}
export {};
//# sourceMappingURL=pathoverlay.d.ts.map