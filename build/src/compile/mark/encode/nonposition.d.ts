import type { SignalRef } from 'vega';
import { NonPositionScaleChannel } from '../../../channel';
import { Value } from '../../../channeldef';
import { VgEncodeChannel, VgEncodeEntry, VgValueRef } from '../../../vega.schema';
import { UnitModel } from '../../unit';
/**
 * Return encode for non-positional channels with scales. (Text doesn't have scale.)
 */
export declare function nonPosition(channel: NonPositionScaleChannel, model: UnitModel, opt?: {
    defaultValue?: Value | SignalRef;
    vgChannel?: VgEncodeChannel;
    defaultRef?: VgValueRef;
}): VgEncodeEntry;
//# sourceMappingURL=nonposition.d.ts.map