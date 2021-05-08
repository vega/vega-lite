import {isArray, isObject, SignalRef} from 'vega';
import {Dict} from './util';
import {SubstituteType} from './vega.schema';

export interface ExprRef {
  /**
   * Vega expression (which can refer to Vega-Lite parameters).
   */
  expr: string;
}

export function isExprRef(o: any): o is ExprRef {
  return o && !!o['expr'];
}

export function deepReplaceExprRef<T>(o: T): SubstituteType<T, ExprRef, SignalRef> {
  if (isExprRef(o)) {
    const {expr, ...rest} = o;
    return {
      signal: expr,
      ...deepReplaceExprRef(rest)
    } as any;
  }

  if (isArray(o)) {
    return o.map(deepReplaceExprRef) as any;
  }

  if (isObject(o)) {
    const r: Dict<any> = {};
    for (const [k, v] of Object.entries(o)) {
      if (k === 'values') {
        // ignore iterating into data
        r[k] = v;
      } else {
        r[k] = deepReplaceExprRef(v);
      }
    }
    return r as any;
  }

  return o as any;
}
