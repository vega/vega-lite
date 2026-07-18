import {Projection as VgProjection, SignalRef} from 'vega';
import {Projection} from '../../projection.js';
import {Split} from '../split.js';

export class ProjectionComponent extends Split<VgProjection> {
  public merged = false;

  constructor(
    name: string,
    public specifiedProjection: Projection<SignalRef>,
    public size: SignalRef[],
    public data: (string | SignalRef)[],
  ) {
    super(
      {...specifiedProjection}, // all explicit properties of projection
      {name}, // name as initial implicit property
    );
  }

  /**
   * Whether the projection parameters should fit provided data.
   */
  public get isFit() {
    return !!this.data;
  }
}
