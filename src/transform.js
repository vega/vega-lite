import {normalizeLogicalComposition} from './logical.js';
import {normalizePredicate} from './predicate.js';
import {hasProperty} from './util.js';
export function isFilter(t) {
  return hasProperty(t, 'filter');
}
export function isImputeSequence(t) {
  return hasProperty(t, 'stop');
}
export function isLookup(t) {
  return hasProperty(t, 'lookup');
}
export function isLookupData(from) {
  return hasProperty(from, 'data');
}
export function isLookupSelection(from) {
  return hasProperty(from, 'param');
}
export function isPivot(t) {
  return hasProperty(t, 'pivot');
}
export function isDensity(t) {
  return hasProperty(t, 'density');
}
export function isQuantile(t) {
  return hasProperty(t, 'quantile');
}
export function isRegression(t) {
  return hasProperty(t, 'regression');
}
export function isLoess(t) {
  return hasProperty(t, 'loess');
}
export function isSample(t) {
  return hasProperty(t, 'sample');
}
export function isWindow(t) {
  return hasProperty(t, 'window');
}
export function isJoinAggregate(t) {
  return hasProperty(t, 'joinaggregate');
}
export function isFlatten(t) {
  return hasProperty(t, 'flatten');
}
export function isCalculate(t) {
  return hasProperty(t, 'calculate');
}
export function isBin(t) {
  return hasProperty(t, 'bin');
}
export function isImpute(t) {
  return hasProperty(t, 'impute');
}
export function isTimeUnit(t) {
  return hasProperty(t, 'timeUnit');
}
export function isAggregate(t) {
  return hasProperty(t, 'aggregate');
}
export function isStack(t) {
  return hasProperty(t, 'stack');
}
export function isFold(t) {
  return hasProperty(t, 'fold');
}
export function isExtent(t) {
  return hasProperty(t, 'extent') && !hasProperty(t, 'density') && !hasProperty(t, 'regression');
}
export function normalizeTransform(transform) {
  return transform.map((t) => {
    if (isFilter(t)) {
      return {
        filter: normalizeLogicalComposition(t.filter, normalizePredicate),
      };
    }
    return t;
  });
}
//# sourceMappingURL=transform.js.map
