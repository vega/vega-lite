/**
 * Utility files for producing Vega ValueRef for marks
 */
import type { SignalRef } from 'vega';
import { PolarPositionChannel, PositionChannel } from '../../../channel';
import { Encoding } from '../../../encoding';
import { Mark, MarkDef } from '../../../mark';
import { VgValueRef } from '../../../vega.schema';
import { UnitModel } from '../../unit';
export interface Offset {
    offsetType?: 'visual' | 'encoding';
    offset?: number | VgValueRef;
}
export declare function positionOffset({ channel: baseChannel, markDef, encoding, model, bandPosition }: {
    channel: PositionChannel | PolarPositionChannel;
    markDef: MarkDef<Mark, SignalRef>;
    encoding?: Encoding<string>;
    model?: UnitModel;
    bandPosition?: number;
}): Offset;
//# sourceMappingURL=offset.d.ts.map