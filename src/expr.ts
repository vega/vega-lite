import {signalRefOrValue} from './compile/common.js';
import {Dict, hasProperty, keys} from './util.js';
import {MappedExclude} from './vega.schema.js';

export interface ExprRef {
  /**
   * Vega expression (which can refer to Vega-Lite parameters).
   */
  expr: string;
}

export function isExprRef(o: any): o is ExprRef {
  return hasProperty(o, 'expr');
}

export function replaceExprRef<T extends Dict<any>>(index: T, {level}: {level: number} = {level: 0}) {
  const props = keys(index || {});
  const newIndex: Dict<any> = {};
  for (const prop of props) {
    newIndex[prop] = level === 0 ? signalRefOrValue(index[prop]) : replaceExprRef(index[prop], {level: level - 1});
  }
  return newIndex as MappedExclude<T, ExprRef>;
}
