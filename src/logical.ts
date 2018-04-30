export type LogicalOperand<T> = LogicalNot<T> | LogicalAnd<T> | LogicalOr<T> | T;

export interface LogicalOr<T> {
  or: LogicalOperand<T>[];
}

export interface LogicalAnd<T> {
  and: LogicalOperand<T>[];
}

export interface LogicalNot<T> {
  not: LogicalOperand<T>;
}

export function isLogicalOr(op: LogicalOperand<any>): op is LogicalOr<any> {
  return !!op.or;
}

export function isLogicalAnd(op: LogicalOperand<any>): op is LogicalAnd<any> {
  return !!op.and;
}

export function isLogicalNot(op: LogicalOperand<any>): op is LogicalNot<any> {
  return !!op.not;
}

export function forEachLeaf<T>(op: LogicalOperand<T>, fn: (op: T) => void) {
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

export function normalizeLogicalOperand<T>(op: LogicalOperand<T>, normalizer: (o: T) => T): LogicalOperand<T> {
  if (isLogicalNot(op)) {
    return {not: normalizeLogicalOperand(op.not, normalizer)};
  } else if (isLogicalAnd(op)) {
    return {and: op.and.map(o => normalizeLogicalOperand(o, normalizer))};
  } else if (isLogicalOr(op)) {
    return {or: op.or.map(o => normalizeLogicalOperand(o, normalizer))};
  } else {
    return normalizer(op);
  }
}
