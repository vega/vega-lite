import { LabelOverlap } from 'vega';
import { FieldDef } from '../../fielddef';
import { Legend } from '../../legend';
import { ScaleType } from '../../scale';
export declare function values(legend: Legend, fieldDef: FieldDef<string>): (string | number | boolean | import("../../../../../../../../Users/domoritz/Developer/UW/vega-lite/src/datetime").DateTime | {
    signal: string;
})[];
export declare function clipHeight(scaleType: ScaleType): number;
export declare function labelOverlap(scaleType: ScaleType): LabelOverlap;
