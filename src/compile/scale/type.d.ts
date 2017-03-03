import { Channel } from '../../channel';
import { Mark } from '../../mark';
import { ScaleType, ScaleConfig } from '../../scale';
import { TimeUnit } from '../../timeunit';
import { Type } from '../../type';
export declare type RangeType = 'continuous' | 'discrete' | 'flexible' | undefined;
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
export default function type(specifiedType: ScaleType, type: Type, channel: Channel, timeUnit: TimeUnit, mark: Mark, hasTopLevelSize: boolean, specifiedRangeStep: number, scaleConfig: ScaleConfig): ScaleType;
