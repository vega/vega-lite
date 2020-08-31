import {SignalRef} from 'vega';
import {signalRefOrValue} from './compile/common';
import {keys} from './util';
import {isSignalRef} from './vega.schema';

export interface ExprRef {
  /**
   * Vega expression (which can refer to Vega-Lite parameters).
   */
  expr: string;
}

export function isExprRef(o: any): o is ExprRef {
  return o && !!o['expr'];
}

export function isExprOrSignalRef(o: any): o is ExprRef | SignalRef {
  return isExprRef(o) || isSignalRef(o);
}

export type ExprOrSignalRef = ExprRef | SignalRef;

export function replaceExprRefInIndex(index: {[key: string]: any | ExprOrSignalRef}) {
  const props = keys(index || {});
  const newIndex: {[key: string]: any | SignalRef} = {};
  for (const prop of props) {
    newIndex[prop as any] = signalRefOrValue(index[prop]);
  }
  return newIndex;
}
