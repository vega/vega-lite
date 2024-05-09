import type {SignalRef} from 'vega';
import {isArray, isNumber} from 'vega-util';
import {ScaleChannel} from '../../channel';
import {Scale, ScaleType} from '../../scale';
import {ParameterExtent} from '../../selection';
import {contains, some} from '../../util';
import {VgNonUnionDomain, VgScale} from '../../vega.schema';
import {Explicit, Split} from '../split';

/**
 * All VgDomain property except domain.
 * (We exclude domain as we have a special "domains" array that allow us merge them all at once in assemble.)
 */
export type ScaleComponentProps = Omit<VgScale, 'domain' | 'reverse'> & {
  domains: VgNonUnionDomain[];
  selectionExtent?: ParameterExtent;
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
   * Whether the scale definitely includes or not include zero in the domain
   */
  public domainHasZero(): 'definitely' | 'definitely-not' | 'maybe' {
    const scaleType = this.get('type');
    if (contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scaleType)) {
      // Log scales cannot have zero.
      // Zero in time scale is arbitrary, and does not affect ratio.
      // (Time is an interval level of measurement, not ratio).
      // See https://en.wikipedia.org/wiki/Level_of_measurement for more info.
      return 'definitely-not';
    }

    const scaleZero = this.get('zero');
    if (
      scaleZero === true ||
      // If zero is undefined, linear/sqrt/pow scales have zero by default.
      (scaleType === undefined && contains([ScaleType.LINEAR, ScaleType.SQRT, ScaleType.POW], scaleType))
    ) {
      return 'definitely';
    }

    const domains = this.get('domains');

    if (domains.length > 0) {
      const hasDomainWithZero = some(
        domains,
        d => isArray(d) && d.length === 2 && isNumber(d[0]) && d[0] <= 0 && isNumber(d[1]) && d[1] >= 0
      );
      return hasDomainWithZero ? 'definitely' : 'definitely-not';
    }
    return 'maybe';
  }
}

export type ScaleComponentIndex = Partial<Record<ScaleChannel, ScaleComponent>>;

export type ScaleIndex = Partial<Record<ScaleChannel, Scale<SignalRef>>>;
