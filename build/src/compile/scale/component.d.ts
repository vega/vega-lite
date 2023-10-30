import type { SignalRef } from 'vega';
import { ScaleChannel } from '../../channel';
import { Scale, ScaleType } from '../../scale';
import { ParameterExtent } from '../../selection';
import { VgNonUnionDomain, VgScale } from '../../vega.schema';
import { Explicit, Split } from '../split';
/**
 * All VgDomain property except domain.
 * (We exclude domain as we have a special "domains" array that allow us merge them all at once in assemble.)
 */
export type ScaleComponentProps = Omit<VgScale, 'domain' | 'reverse'> & {
    domains: VgNonUnionDomain[];
    selectionExtent?: ParameterExtent;
    reverse?: boolean | SignalRef;
};
export type Range = ScaleComponentProps['range'];
export declare class ScaleComponent extends Split<ScaleComponentProps> {
    merged: boolean;
    constructor(name: string, typeWithExplicit: Explicit<ScaleType>);
    /**
     * Whether the scale definitely includes zero in the domain
     */
    domainDefinitelyIncludesZero(): boolean;
}
export type ScaleComponentIndex = Partial<Record<ScaleChannel, ScaleComponent>>;
export type ScaleIndex = Partial<Record<ScaleChannel, Scale<SignalRef>>>;
//# sourceMappingURL=component.d.ts.map