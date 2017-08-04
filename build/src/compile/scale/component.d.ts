import { ScaleChannel } from '../../channel';
import { Scale, ScaleType } from '../../scale';
import { VgNonUnionDomain, VgScale } from '../../vega.schema';
import { Explicit, Split } from '../split';
export declare type ScaleComponentProps = Partial<Pick<VgScale, 'name' | 'type' | 'domainRaw' | 'range' | 'clamp' | 'exponent' | 'interpolate' | 'nice' | 'padding' | 'paddingInner' | 'paddingOuter' | 'reverse' | 'round' | 'zero'>>;
export declare class ScaleComponent extends Split<ScaleComponentProps> {
    merged: boolean;
    domains: VgNonUnionDomain[];
    constructor(name: string, typeWithExplicit: Explicit<ScaleType>);
}
export declare type ScaleComponentIndex = {
    [P in ScaleChannel]?: ScaleComponent;
};
export declare type ScaleIndex = {
    [P in ScaleChannel]?: Scale;
};
