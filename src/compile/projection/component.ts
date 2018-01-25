import {Projection} from '../../projection';
import {VgProjection, VgSignalRef} from '../../vega.schema';
import {Split} from '../split';

export class ProjectionComponent extends Split<Partial<VgProjection>> {
  public merged = false;

  constructor(name: string, public specifiedProjection: Projection, public size: VgSignalRef[], public data: (string | VgSignalRef)[]) {
    super(
      {...specifiedProjection},  // all explicit properties of projection
      {name}  // name as initial implicit property
    );
  }
}
