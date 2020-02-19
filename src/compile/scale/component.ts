import {SignalRef} from 'vega-typings/types';
import {isArray} from 'vega-util';
import {ScaleChannel} from '../../channel';
import {Scale, ScaleType} from '../../scale';
import {SelectionExtent} from '../../selection';
import {some} from '../../util';
import {VgNonUnionDomain, VgScale} from '../../vega.schema';
import {Explicit, Split} from '../split';

/**
 * All VgDomain property except domain.
 * (We exclude domain as we have a special "domains" array that allow us merge them all at once in assemble.)
 */
export type ScaleComponentProps = Omit<VgScale, 'domain' | 'domainRaw' | 'reverse'> & {
  domains: VgNonUnionDomain[];
  selectionExtent?: SelectionExtent;
  reverse?: boolean | SignalRef; // Need override since Vega doesn't official support scale reverse yet (though it does in practice)
};

export type Range = ScaleComponentProps['range'];

export class ScaleComponent extends Split<ScaleComponentProps> {
  public merged = false;

  constructor(name: string, typeWithExplicit: Explicit<ScaleType>) {
    super(
      {}, // no initial explicit property
      {name} // name as initial implicit property
    );
    this.setWithExplicit('type', typeWithExplicit);
  }

  /**
   * Whether the scale definitely includes zero in the domain
   */
  public domainDefinitelyIncludesZero() {
    if (this.get('zero') !== false) {
      return true;
    }
    return some(this.get('domains'), d => isArray(d) && d.length === 2 && d[0] <= 0 && d[1] >= 0);
  }
}

export type ScaleComponentIndex = Partial<Record<ScaleChannel, ScaleComponent>>;

export type ScaleIndex = Partial<Record<ScaleChannel, Scale>>;
