import { LabelOverlap, LegendType, SymbolShape } from 'vega';
import { Channel } from '../../channel';
import { FieldDefWithCondition, MarkPropFieldDef, TypedFieldDef, ValueDefWithCondition } from '../../channeldef';
import { Legend, LegendConfig } from '../../legend';
import { Mark } from '../../mark';
import { ScaleType } from '../../scale';
import { TimeUnit } from '../../timeunit';
import { Model } from '../model';
export declare function values(legend: Legend, fieldDef: TypedFieldDef<string>): (string | number | boolean | import("../../datetime").DateTime | {
    signal: string;
})[];
export declare function defaultSymbolType(mark: Mark, channel: Channel, shapeChannelDef: FieldDefWithCondition<MarkPropFieldDef<string>, SymbolShape> | ValueDefWithCondition<MarkPropFieldDef<string>, SymbolShape>, markShape: SymbolShape): SymbolShape;
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
//# sourceMappingURL=properties.d.ts.map