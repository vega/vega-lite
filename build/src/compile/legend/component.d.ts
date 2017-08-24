import { Legend } from '../..//legend';
import { NonspatialScaleChannel } from '../../channel';
import { VgLegend } from '../../vega.schema';
import { Split } from '../split';
export declare class LegendComponent extends Split<Partial<VgLegend>> {
}
export declare type LegendComponentIndex = {
    [P in NonspatialScaleChannel]?: LegendComponent;
};
export declare type LegendIndex = {
    [P in NonspatialScaleChannel]?: Legend;
};
