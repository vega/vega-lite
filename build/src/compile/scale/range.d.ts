import { Channel } from '../../channel';
import { Config } from '../../config';
import { Mark } from '../../mark';
import { Domain, Scale, ScaleType } from '../../scale';
import { Type } from '../../type';
import { VgRange } from '../../vega.schema';
import { SignalRefComponent } from '../signal';
import { Explicit } from '../split';
import { UnitModel } from '../unit';
export declare const RANGE_PROPERTIES: (keyof Scale)[];
export declare function parseUnitScaleRange(model: UnitModel): void;
/**
 * Return mixins that includes one of the range properties (range, rangeStep, scheme).
 */
export declare function parseRangeForChannel(channel: Channel, scaleType: ScaleType, type: Type, specifiedScale: Scale, config: Config, zero: boolean, mark: Mark, sizeSpecified: boolean, sizeSignal: string, xyRangeSteps: (number | SignalRefComponent)[]): Explicit<VgRange<SignalRefComponent>>;
export declare function defaultContinuousToDiscreteCount(scaleType: 'quantile' | 'quantize' | 'threshold', config: Config, domain: Domain, channel: Channel): number;
/**
 * Returns the linear interpolation of the range according to the cardinality
 *
 * @param rangeMin start of the range
 * @param rangeMax end of the range
 * @param cardinality number of values in the output range
 */
export declare function interpolateRange(rangeMin: number, rangeMax: number | SignalRefComponent, cardinality: number): SignalRefComponent;
export declare const MAX_SIZE_RANGE_STEP_RATIO = 0.95;
