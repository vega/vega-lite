import { Channel } from '../../channel';
import { Mark } from '../../mark';
import { ScaleType, ScaleConfig } from '../../scale';
import { FieldDef } from '../../fielddef';
export declare type RangeType = 'continuous' | 'discrete' | 'flexible' | undefined;
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
export default function type(specifiedType: ScaleType, channel: Channel, fieldDef: FieldDef, mark: Mark, hasTopLevelSize: boolean, specifiedRangeStep: number, scaleConfig: ScaleConfig): ScaleType;
