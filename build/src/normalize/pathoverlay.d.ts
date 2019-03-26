import { Config } from '../config';
import { Encoding } from '../encoding';
import { Field } from '../fielddef';
import { Mark, MarkDef } from '../mark';
import { GenericUnitSpec } from '../spec';
import { NonFacetUnitNormalizer, NormalizeLayerOrUnit, NormalizerParams } from './base';
declare type UnitSpecWithPathOverlay = GenericUnitSpec<Encoding<string>, Mark | MarkDef<'line' | 'area' | 'rule' | 'trail'>>;
export declare class PathOverlayNormalizer implements NonFacetUnitNormalizer<UnitSpecWithPathOverlay> {
    name: string;
    hasMatchingType(spec: GenericUnitSpec<any, Mark | MarkDef>, config: Config): spec is UnitSpecWithPathOverlay;
    run(spec: UnitSpecWithPathOverlay, params: NormalizerParams, normalize: NormalizeLayerOrUnit): GenericUnitSpec<Encoding<Field>, "square" | "area" | "circle" | "line" | "rect" | "text" | "rule" | "trail" | "point" | "geoshape" | "bar" | "tick" | MarkDef<Mark>> | import("../spec").GenericLayerSpec<GenericUnitSpec<Encoding<Field>, "square" | "area" | "circle" | "line" | "rect" | "text" | "rule" | "trail" | "point" | "geoshape" | "bar" | "tick" | MarkDef<Mark>>>;
}
export {};
