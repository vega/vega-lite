import { ScaleChannel } from '../../channel';
import { Scale, ScaleType } from '../../scale';
import { Omit } from '../../util';
import { VgNonUnionDomain, VgScale } from '../../vega.schema';
import { Explicit, Split } from '../split';
/**
 * All VgDomain property except domain.
 * (We exclude domain as we have a special "domains" array that allow us merge them all at once in assemble.)
 */
export declare type ScaleComponentProps = Omit<VgScale, 'domain'> & {
    domains: VgNonUnionDomain[];
};
export declare class ScaleComponent extends Split<ScaleComponentProps> {
    merged: boolean;
    constructor(name: string, typeWithExplicit: Explicit<ScaleType>);
    /**
     * Whether the scale definitely includes zero in the domain
     */
    domainDefinitelyIncludesZero(): boolean;
}
export declare type ScaleComponentIndex = {
    [P in ScaleChannel]?: ScaleComponent;
};
export declare type ScaleIndex = {
    [P in ScaleChannel]?: Scale;
};
//# sourceMappingURL=component.d.ts.map