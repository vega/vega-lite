import { Channel } from '../../channel';
import { Config } from '../../config';
import { Mark } from '../../mark';
import { Domain, Range, Scale, ScaleType, Scheme } from '../../scale';
import { Type } from '../../type';
import { VgRange } from '../../vega.schema';
import { Model } from '../model';
import { Explicit } from '../split';
export declare type RangeMixins = {
    range: Range;
} | {
    rangeStep: number;
} | {
    scheme: Scheme;
};
export declare const RANGE_PROPERTIES: (keyof Scale)[];
export declare function parseScaleRange(model: Model): void;
/**
 * Return mixins that includes one of the range properties (range, rangeStep, scheme).
 */
export declare function parseRangeForChannel(channel: Channel, scaleType: ScaleType, type: Type, specifiedScale: Scale, config: Config, zero: boolean, mark: Mark, sizeSpecified: boolean, sizeSignal: string, xyRangeSteps: number[]): Explicit<VgRange>;
export declare function defaultRange(channel: Channel, scaleType: ScaleType, type: Type, config: Config, zero: boolean, mark: Mark, sizeSignal: string, xyRangeSteps: number[], noRangeStep: boolean, domain: Domain): VgRange;
export declare function defaultContinuousToDiscreteCount(scaleType: 'quantile' | 'quantize' | 'threshold', config: Config, domain: Domain, channel: Channel): number;
/**
 * Returns the linear interpolation of the range according to the cardinality
 *
 * @param rangeMin start of the range
 * @param rangeMax end of the range
 * @param cardinality number of values in the output range
 */
export declare function interpolateRange(rangeMin: number, rangeMax: number, cardinality: number): number[];
