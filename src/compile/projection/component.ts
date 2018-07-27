import {SignalRef} from 'vega';
import {Projection} from '../../projection';
import {VgProjection} from '../../vega.schema';
import {Split} from '../split';

export class ProjectionComponent extends Split<VgProjection> {
  public merged = false;

  constructor(
    name: string,
    public specifiedProjection: Projection,
    public size: SignalRef[],
    public data: (string | SignalRef)[]
  ) {
    super(
      {...specifiedProjection}, // all explicit properties of projection
      {name} // name as initial implicit property
    );
  }
}
