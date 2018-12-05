import { LabelOverlap } from 'vega';
import { FieldDef } from '../../fielddef';
import { Legend, LegendConfig } from '../../legend';
import { ScaleType } from '../../scale';
import { Model } from '../model';
export declare function values(legend: Legend, fieldDef: FieldDef<string>): (string | number | boolean | import("../../datetime").DateTime | {
    signal: string;
})[];
export declare function clipHeight(scaleType: ScaleType): number;
export declare function defaultGradientLength(model: Model, legend: Legend, legendConfig: LegendConfig): number | {
    signal: string;
};
export declare function labelOverlap(scaleType: ScaleType): LabelOverlap;
