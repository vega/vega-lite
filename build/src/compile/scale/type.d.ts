import { ScaleChannel } from '../../channel';
import { DatumDef, TypedFieldDef } from '../../channeldef';
import { MarkDef } from '../../mark';
import { Scale, ScaleType } from '../../scale';
export type RangeType = 'continuous' | 'discrete' | 'flexible' | undefined;
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
export declare function scaleType(specifiedScale: Scale, channel: ScaleChannel, fieldDef: TypedFieldDef<string> | DatumDef, mark: MarkDef, hasNestedOffsetScale?: boolean): ScaleType;
//# sourceMappingURL=type.d.ts.map