import { LabelOverlap, LegendType } from 'vega';
import { Channel } from '../../channel';
import { TypedFieldDef } from '../../fielddef';
import { Legend, LegendConfig } from '../../legend';
import { ScaleType } from '../../scale';
import { TimeUnit } from '../../timeunit';
import { Model } from '../model';
export declare function values(legend: Legend, fieldDef: TypedFieldDef<string>): (string | number | boolean | import("../../datetime").DateTime | {
    signal: string;
})[];
export declare function clipHeight(legendType: LegendType): number;
export declare function type(params: {
    legend: Legend;
    channel: Channel;
    timeUnit?: TimeUnit;
    scaleType: ScaleType;
    alwaysReturn: boolean;
}): LegendType;
export declare function defaultType({ channel, timeUnit, scaleType, alwaysReturn }: {
    channel: Channel;
    timeUnit?: TimeUnit;
    scaleType: ScaleType;
    alwaysReturn: boolean;
}): LegendType;
export declare function direction({ legend, legendConfig, timeUnit, channel, scaleType }: {
    legend: Legend;
    legendConfig: LegendConfig;
    timeUnit?: TimeUnit;
    channel: Channel;
    scaleType: ScaleType;
}): string;
export declare function defaultGradientLength({ legend, legendConfig, model, channel, scaleType }: {
    legend: Legend;
    legendConfig: LegendConfig;
    model: Model;
    channel: Channel;
    scaleType: ScaleType;
}): number | {
    signal: string;
};
export declare function defaultLabelOverlap(scaleType: ScaleType): LabelOverlap;
