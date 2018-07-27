import { Legend as VgLegend } from 'vega';
import { NonPositionScaleChannel } from '../../channel';
import { Legend } from '../../legend';
import { Split } from '../split';
export declare class LegendComponent extends Split<VgLegend> {
}
export declare type LegendComponentIndex = {
    [P in NonPositionScaleChannel]?: LegendComponent;
};
export declare type LegendIndex = {
    [P in NonPositionScaleChannel]?: Legend;
};
