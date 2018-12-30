import {ScaleChannel} from '../../channel';
import {Scale, ScaleType} from '../../scale';
import {Omit} from '../../util';
import {VgNonUnionDomain, VgRange, VgScale} from '../../vega.schema';
import {SignalRefComponent} from '../signal';
import {Explicit, Split} from '../split';

/**
 * All VgDomain property except domain.
 * (We exclude domain as we have a special "domains" array that allow us merge them all at once in assemble.)
 */
// TODO: also exclude domainRaw and property implement the right scaleComponent for selection domain

export type ScaleComponentProps = Omit<VgScale, 'domain' | 'range'> & {
  range: VgRange<SignalRefComponent>;
};

export class ScaleComponent extends Split<ScaleComponentProps> {
  public merged = false;

  public domains: VgNonUnionDomain[] = [];

  constructor(name: string, typeWithExplicit: Explicit<ScaleType>) {
    super(
      {}, // no initial explicit property
      {name} // name as initial implicit property
    );
    this.setWithExplicit('type', typeWithExplicit);
  }
}

// Using Mapped Type to declare type (https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types)
export type ScaleComponentIndex = {[P in ScaleChannel]?: ScaleComponent};

export type ScaleIndex = {[P in ScaleChannel]?: Scale};
