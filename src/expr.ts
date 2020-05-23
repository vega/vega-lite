import {SignalRef} from 'vega';
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
