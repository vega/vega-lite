import {signalRefOrValue} from './compile/common.js';
import {Dict, keys} from './util.js';
import {MappedExclude} from './vega.schema.js';

export interface ExprRef {
  /**
   * Vega expression (which can refer to Vega-Lite parameters).
   */
  expr: string;
}

export function isExprRef(o: any): o is ExprRef {
  return !!o?.expr;
}

export function replaceExprRef<T extends Dict<any>>(index: T) {
  const props = keys(index || {});
  const newIndex: Dict<any> = {};
  for (const prop of props) {
    newIndex[prop] = signalRefOrValue(index[prop]);
  }
  return newIndex as MappedExclude<T, ExprRef>;
}
