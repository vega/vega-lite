import { SignalRef } from 'vega';
import { ScaleChannel } from '../../channel';
import { Config } from '../../config';
import { Domain, Scale } from '../../scale';
import { VgRange } from '../../vega.schema';
import { Explicit } from '../split';
import { UnitModel } from '../unit';
export declare const RANGE_PROPERTIES: (keyof Scale)[];
export declare function parseUnitScaleRange(model: UnitModel): void;
/**
 * Return mixins that includes one of the Vega range types (explicit range, range.step, range.scheme).
 */
export declare function parseRangeForChannel(channel: ScaleChannel, model: UnitModel): Explicit<VgRange>;
export declare function defaultContinuousToDiscreteCount(scaleType: 'quantile' | 'quantize' | 'threshold', config: Config, domain: Domain, channel: ScaleChannel): number;
/**
 * Returns the linear interpolation of the range according to the cardinality
 *
 * @param rangeMin start of the range
 * @param rangeMax end of the range
 * @param cardinality number of values in the output range
 */
export declare function interpolateRange(rangeMin: number | SignalRef, rangeMax: number | SignalRef, cardinality: number): SignalRef;
export declare const MAX_SIZE_RANGE_STEP_RATIO = 0.95;
//# sourceMappingURL=range.d.ts.map