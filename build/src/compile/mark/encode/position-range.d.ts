import { VgEncodeEntry, VgValueRef } from '../../../vega.schema';
import { UnitModel } from '../../unit';
import * as ref from './valueref';
/**
 * Utility for area/rule position, which can be either point or range.
 * (One of the axes should be point and the other should be range.)
 */
export declare function pointOrRangePosition(channel: 'x' | 'y', model: UnitModel, { defaultPos, defaultPos2, range }: {
    defaultPos: 'zeroOrMin' | 'zeroOrMax' | 'mid';
    defaultPos2: 'zeroOrMin' | 'zeroOrMax';
    range: boolean;
}): Partial<Record<import("../../../vega.schema").VgEncodeChannel, VgValueRef | (VgValueRef & {
    test?: string;
})[]>> | {
    [x: string]: VgValueRef | VgValueRef[];
};
export declare function rangePosition(channel: 'x' | 'y' | 'theta' | 'radius', model: UnitModel, { defaultPos, defaultPos2 }: {
    defaultPos: 'zeroOrMin' | 'zeroOrMax' | 'mid';
    defaultPos2: 'zeroOrMin' | 'zeroOrMax';
}): VgEncodeEntry;
export declare function position2Ref({ channel, channelDef, channel2Def, markDef, config, scaleName, scale, stack, offset, defaultRef }: ref.MidPointParams & {
    channel: 'x2' | 'y2' | 'radius2' | 'theta2';
}): VgValueRef | VgValueRef[];
//# sourceMappingURL=position-range.d.ts.map