import { Channel } from '../../channel';
import { TypedFieldDef } from '../../channeldef';
import { Mark } from '../../mark';
import { Scale, ScaleType } from '../../scale';
export declare type RangeType = 'continuous' | 'discrete' | 'flexible' | undefined;
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
export declare function scaleType(specifiedScale: Scale, channel: Channel, fieldDef: TypedFieldDef<string>, mark: Mark): ScaleType;
//# sourceMappingURL=type.d.ts.map