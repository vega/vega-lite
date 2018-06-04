import { Projection } from '../../projection';
import { VgProjection, VgSignalRef } from '../../vega.schema';
import { Split } from '../split';
export declare class ProjectionComponent extends Split<VgProjection> {
    specifiedProjection: Projection;
    size: VgSignalRef[];
    data: (string | VgSignalRef)[];
    merged: boolean;
    constructor(name: string, specifiedProjection: Projection, size: VgSignalRef[], data: (string | VgSignalRef)[]);
}
