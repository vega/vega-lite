import { MarkDef } from '../../mark';
import { VgEncodeEntry, VgValueRef } from '../../vega.schema';
import { UnitModel } from '../unit';
import { NONSPATIAL_SCALE_CHANNELS } from '../../channel';
export declare function color(model: UnitModel): any;
export declare function markDefProperties(mark: MarkDef, props: (keyof MarkDef)[]): {};
export declare function valueIfDefined(prop: string, value: VgValueRef): VgEncodeEntry;
/**
 * Return mixins for non-positional channels with scales.  (Text doesn't have scale.)
 */
export declare function nonPosition(channel: typeof NONSPATIAL_SCALE_CHANNELS[0], model: UnitModel, opt?: {
    defaultValue?: number | string | boolean;
    vgChannel?: string;
    defaultRef?: VgValueRef;
}): VgEncodeEntry;
export declare function text(model: UnitModel): any;
export declare function bandPosition(channel: 'x' | 'y', model: UnitModel): {
    [x: string]: VgValueRef;
};
export declare function centeredBandPosition(channel: 'x' | 'y', model: UnitModel, defaultPosRef: VgValueRef, defaultSizeRef: VgValueRef): any;
export declare function binnedPosition(channel: 'x' | 'y', model: UnitModel, spacing: number): {
    x2: VgValueRef;
    x: VgValueRef;
} | {
    y2: VgValueRef;
    y: VgValueRef;
};
/**
 * Return mixins for point (non-band) position channels.
 */
export declare function pointPosition(channel: 'x' | 'y', model: UnitModel, defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax', vgChannel?: 'x' | 'y' | 'xc' | 'yc'): {
    [x: string]: VgValueRef;
};
/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
export declare function pointPosition2(model: UnitModel, defaultRef: 'zeroOrMin' | 'zeroOrMax', channel?: 'x2' | 'y2'): {
    [x: string]: VgValueRef;
};
