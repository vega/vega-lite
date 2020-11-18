import {signalRefOrValue} from './compile/common';
import {Dict, keys} from './util';
import {MappedExclude} from './vega.schema';

export interface ExprRef {
  /**
   * Vega expression (which can refer to Vega-Lite parameters).
   */
  expr: string;
}

export function isExprRef(o: any): o is ExprRef {
  return o && !!o['expr'];
}

export function replaceExprRef<T extends Dict<any>>(index: T) {
  const props = keys(index || {});
  const newIndex: Dict<any> = {};
  for (const prop of props) {
    newIndex[prop] = signalRefOrValue(index[prop]);
  }
  return newIndex as MappedExclude<T, ExprRef>;
}
