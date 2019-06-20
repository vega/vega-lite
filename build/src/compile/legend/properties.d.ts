import { Channel } from '../../channel';
import { FieldDef } from '../../fielddef';
import { Legend } from '../../legend';
import { ScaleType } from '../../scale';
import { Type } from '../../type';
export declare function values(legend: Legend, fieldDef: FieldDef<string>): (string | number | boolean | import("../../../../../../../../Users/domoritz/Developer/UW/vega-lite-2/src/datetime").DateTime | {
    signal: string;
})[];
export declare function type(t: Type, channel: Channel, scaleType: ScaleType): 'gradient';
