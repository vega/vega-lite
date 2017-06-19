import { Legend } from '../..//legend';
import { NonspatialScaleChannel } from '../../channel';
import { VgLegend } from '../../vega.schema';
export declare type LegendComponent = VgLegend;
export declare type LegendComponentIndex = {
    [P in NonspatialScaleChannel]?: LegendComponent;
};
export declare type LegendIndex = {
    [P in NonspatialScaleChannel]?: Legend;
};
