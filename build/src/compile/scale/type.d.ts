import { Channel } from '../../channel';
import { FieldDef } from '../../fielddef';
import { Mark } from '../../mark';
import { ScaleConfig, ScaleType } from '../../scale';
export declare type RangeType = 'continuous' | 'discrete' | 'flexible' | undefined;
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
export declare function scaleType(specifiedType: ScaleType, channel: Channel, fieldDef: FieldDef<string>, mark: Mark, scaleConfig: ScaleConfig): ScaleType;
