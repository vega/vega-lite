import { ScaleChannel } from '../../channel';
import { Scale, ScaleType } from '../../scale';
import { VgScale } from '../../vega.schema';
import { Explicit, Split } from '../split';
export declare class ScaleComponent extends Split<Partial<VgScale>> {
    merged: boolean;
    constructor(name: string, typeWithExplicit: Explicit<ScaleType>);
}
export declare type ScaleComponentIndex = {
    [P in ScaleChannel]?: ScaleComponent;
};
export declare type ScaleIndex = {
    [P in ScaleChannel]?: Scale;
};
