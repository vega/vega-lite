import {hasProperty} from './util.js';
export function isLogicalOr(op) {
  return hasProperty(op, 'or');
}
export function isLogicalAnd(op) {
  return hasProperty(op, 'and');
}
export function isLogicalNot(op) {
  return hasProperty(op, 'not');
}
export function forEachLeaf(op, fn) {
  if (isLogicalNot(op)) {
    forEachLeaf(op.not, fn);
  } else if (isLogicalAnd(op)) {
    for (const subop of op.and) {
      forEachLeaf(subop, fn);
    }
  } else if (isLogicalOr(op)) {
    for (const subop of op.or) {
      forEachLeaf(subop, fn);
    }
  } else {
    fn(op);
  }
}
export function normalizeLogicalComposition(op, normalizer) {
  if (isLogicalNot(op)) {
    return {not: normalizeLogicalComposition(op.not, normalizer)};
  } else if (isLogicalAnd(op)) {
    return {and: op.and.map((o) => normalizeLogicalComposition(o, normalizer))};
  } else if (isLogicalOr(op)) {
    return {or: op.or.map((o) => normalizeLogicalComposition(o, normalizer))};
  } else {
    return normalizer(op);
  }
}
//# sourceMappingURL=logical.js.map
