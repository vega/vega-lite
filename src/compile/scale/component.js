import {isArray, isNumber} from 'vega-util';
import {ScaleType} from '../../scale.js';
import {contains} from '../../util.js';
import {Split} from '../split.js';
export class ScaleComponent extends Split {
  merged = false;
  constructor(name, typeWithExplicit) {
    super(
      {}, // no initial explicit property
      {name},
    );
    this.setWithExplicit('type', typeWithExplicit);
  }
  /**
   * Whether the scale definitely includes or not include zero in the domain
   */
  domainHasZero() {
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
//# sourceMappingURL=component.js.map
