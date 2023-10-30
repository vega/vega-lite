import { Projection as VgProjection, SignalRef } from 'vega';
import { Projection } from '../../projection';
import { Split } from '../split';
export declare class ProjectionComponent extends Split<VgProjection> {
    specifiedProjection: Projection<SignalRef>;
    size: SignalRef[];
    data: (string | SignalRef)[];
    merged: boolean;
    constructor(name: string, specifiedProjection: Projection<SignalRef>, size: SignalRef[], data: (string | SignalRef)[]);
    /**
     * Whether the projection parameters should fit provided data.
     */
    get isFit(): boolean;
}
//# sourceMappingURL=component.d.ts.map