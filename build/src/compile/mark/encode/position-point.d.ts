import { PolarPositionChannel, PositionChannel } from '../../../channel';
import { VgValueRef } from '../../../vega.schema';
import { ScaleComponent } from '../../scale/component';
import { UnitModel } from '../../unit';
import * as ref from './valueref';
/**
 * Return encode for point (non-band) position channels.
 */
export declare function pointPosition(channel: 'x' | 'y' | 'theta' | 'radius', model: UnitModel, { defaultPos, vgChannel }: {
    defaultPos: 'mid' | 'zeroOrMin' | 'zeroOrMax' | null;
    vgChannel?: 'x' | 'y' | 'xc' | 'yc';
}): {
    [x: string]: VgValueRef | VgValueRef[];
};
/**
 * @return Vega ValueRef for normal x- or y-position without projection
 */
export declare function positionRef(params: ref.MidPointParams & {
    channel: 'x' | 'y' | 'radius' | 'theta';
}): VgValueRef | VgValueRef[];
export declare function pointPositionDefaultRef({ model, defaultPos, channel, scaleName, scale }: {
    model: UnitModel;
    defaultPos: 'mid' | 'zeroOrMin' | 'zeroOrMax' | null;
    channel: PositionChannel | PolarPositionChannel;
    scaleName: string;
    scale: ScaleComponent;
}): () => VgValueRef;
//# sourceMappingURL=position-point.d.ts.map