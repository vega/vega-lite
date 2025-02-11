import type {SignalRef} from 'vega';
import {isArray, isNumber} from 'vega-util';
import {ScaleChannel} from '../../channel.js';
import {Scale, ScaleType} from '../../scale.js';
import {ParameterExtent} from '../../selection.js';
import {contains} from '../../util.js';
import {VgNonUnionDomain, VgScale} from '../../vega.schema.js';
import {Explicit, Split} from '../split.js';

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
      {name}, // name as initial implicit property
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
      (scaleZero === undefined && contains([ScaleType.LINEAR, ScaleType.SQRT, ScaleType.POW], scaleType))
    ) {
      return 'definitely';
    }

    const domains = this.get('domains');

    if (domains.length > 0) {
      let hasExplicitDomainWithZero = false;
      let hasExplicitDomainWithoutZero = false;
      let hasDomainBasedOnField = false;
      for (const d of domains) {
        if (isArray(d)) {
          const first = d[0];
          const last = d[d.length - 1];
          if (isNumber(first) && isNumber(last)) {
            if (first <= 0 && last >= 0) {
              hasExplicitDomainWithZero = true;
              continue;
            } else {
              hasExplicitDomainWithoutZero = true;
              continue;
            }
          }
        }
        hasDomainBasedOnField = true;
      }
      if (hasExplicitDomainWithZero) {
        return 'definitely';
      } else if (hasExplicitDomainWithoutZero && !hasDomainBasedOnField) {
        return 'definitely-not';
      }
    }
    return 'maybe';
  }
}

export type ScaleComponentIndex = Partial<Record<ScaleChannel, ScaleComponent>>;

export type ScaleIndex = Partial<Record<ScaleChannel, Scale<SignalRef>>>;
