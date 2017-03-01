import { MarkDef } from './mark';
import { GenericUnitSpec, LayerSpec } from './spec';
export declare const ERRORBAR: 'error-bar';
export declare type ERRORBAR = typeof ERRORBAR;
export declare type UnitNormalizer = (spec: GenericUnitSpec<any, any>) => LayerSpec;
export declare function add(mark: string, normalizer: UnitNormalizer): void;
export declare function remove(mark: string): void;
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export declare function normalize(spec: GenericUnitSpec<string | MarkDef, any>): LayerSpec;
