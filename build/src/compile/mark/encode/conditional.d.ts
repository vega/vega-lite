import { ChannelDef } from '../../../channeldef';
import { GuideEncodingConditionalValueDef } from '../../../guide';
import { VgEncodeEntry, VgValueRef } from '../../../vega.schema';
import { UnitModel } from '../../unit';
/**
 * Return a mixin that includes a Vega production rule for a Vega-Lite conditional channel definition
 * or a simple mixin if channel def has no condition.
 */
export declare function wrapCondition<CD extends ChannelDef | GuideEncodingConditionalValueDef>(model: UnitModel, channelDef: CD, vgChannel: string, refFn: (cDef: CD) => VgValueRef): VgEncodeEntry;
//# sourceMappingURL=conditional.d.ts.map