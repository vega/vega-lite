import { Channel } from '../../channel';
import { FieldDef } from '../../fielddef';
import { Legend } from '../../legend';
import { ScaleType } from '../../scale';
import { Type } from '../../type';
export declare function values(legend: Legend, fieldDef: FieldDef<string>): (string | number | boolean | import("../../../../../../../../../../Users/kanitw/Documents/_code/_idl/_visrec/vega-lite/src/datetime").DateTime | {
    signal: string;
})[];
export declare function type(t: Type, channel: Channel, scaleType: ScaleType): 'gradient';
