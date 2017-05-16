import { ScaleChannel } from '../../channel';
import { VgScale } from '../../vega.schema';
export declare type ScaleComponent = VgScale;
export declare type ScaleComponentIndex = {
    [P in ScaleChannel]?: ScaleComponent;
};
