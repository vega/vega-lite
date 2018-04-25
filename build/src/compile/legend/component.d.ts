import { Legend } from '../..//legend';
import { NonPositionScaleChannel } from '../../channel';
import { VgLegend } from '../../vega.schema';
import { Split } from '../split';
export declare class LegendComponent extends Split<VgLegend> {
}
export declare type LegendComponentIndex = {
    [P in NonPositionScaleChannel]?: LegendComponent;
};
export declare type LegendIndex = {
    [P in NonPositionScaleChannel]?: Legend;
};
