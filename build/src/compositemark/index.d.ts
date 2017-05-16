import { Config } from './../config';
import { MarkDef } from './../mark';
import { GenericUnitSpec, LayerSpec } from './../spec';
import { BOXPLOT } from './boxplot';
import { ERRORBAR } from './errorbar';
export { BoxPlotConfig } from './boxplot';
export declare type UnitNormalizer = (spec: GenericUnitSpec<any, any>, config: Config) => LayerSpec;
export declare function add(mark: string, normalizer: UnitNormalizer): void;
export declare function remove(mark: string): void;
export declare type CompositeMark = BOXPLOT | ERRORBAR;
export declare type CompositeAggregate = BOXPLOT;
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export declare function normalize(spec: GenericUnitSpec<any, string | MarkDef>, config: Config): LayerSpec;
