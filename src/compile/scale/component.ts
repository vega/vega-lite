import {ScaleChannel} from '../../channel';
import {Scale, ScaleType} from '../../scale';
import {VgScale} from '../../vega.schema';
import {Explicit, Split} from '../split';


export class ScaleComponent extends Split<Partial<VgScale>> {
  public merged = false;

  constructor(name: string, typeWithExplicit: Explicit<ScaleType>) {
    super(
      {},     // no initial explicit property
      {name}  // name as initial implicit property
    );
    this.setWithExplicit('type', typeWithExplicit);
  }

  // TODO: add additional scale property here like domains, domainRaw
}

export type ScaleComponentIndex = {[P in ScaleChannel]?: ScaleComponent};

export type ScaleIndex = {[P in ScaleChannel]?: Split<Scale>};
