import { SignalRef } from 'vega';
import { Projection } from '../../projection';
import { VgProjection } from '../../vega.schema';
import { Split } from '../split';
export declare class ProjectionComponent extends Split<VgProjection> {
    specifiedProjection: Projection;
    size: SignalRef[];
    data: (string | SignalRef)[];
    merged: boolean;
    constructor(name: string, specifiedProjection: Projection, size: SignalRef[], data: (string | SignalRef)[]);
}
