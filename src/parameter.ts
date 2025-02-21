import type {Binding, Expr, InitSignal, NewSignal} from 'vega';
import {isSelectionParameter, TopLevelSelectionParameter} from './selection.js';

export type ParameterName = string;

export interface VariableParameter {
  /**
   * A unique name for the variable parameter. Parameter names should be valid JavaScript identifiers: they should contain only alphanumeric characters (or "$", or "_") and may not start with a digit. Reserved keywords that may not be used as parameter names are "datum", "event", "item", and "parent".
   */
  name: ParameterName;

  /**
   * The [initial value](http://vega.github.io/vega-lite/docs/value.html) of the parameter.
   *
   * __Default value:__ `undefined`
   */
  value?: any;

  /**
   * An expression for the value of the parameter. This expression may include other parameters, in which case the parameter will automatically update in response to upstream parameter changes.
   */
  expr?: Expr;

  /**
   * Binds the parameter to an external input element such as a slider, selection list or radio button group.
   */
  bind?: Binding;

  /**
   *A boolean flag (default `true`) indicating if the update expression should be automatically re-evaluated when any upstream signal dependencies update. If `false`, the update expression will not register any dependencies on other signals, even for initialization.
   *
   * __Default value:__ `true`
   */
  react?: boolean;
}

export function assembleParameterSignals(params: (VariableParameter | TopLevelSelectionParameter)[]) {
  const signals: (NewSignal | InitSignal)[] = [];
  for (const param of params || []) {
    // Selection parameters are handled separately via assembleSelectionTopLevelSignals
    // and assembleSignals methods registered on the Model.
    if (isSelectionParameter(param)) continue;
    const {expr, bind, ...rest} = param;

    if (bind && expr) {
      // Vega's InitSignal -- apply expr to "init"
      const signal: InitSignal = {
        ...rest,
        bind,
        init: expr,
      };
      signals.push(signal);
    } else {
      const signal: NewSignal = {
        ...rest,
        ...(expr ? {update: expr} : {}),
        ...(bind ? {bind} : {}),
      };
      signals.push(signal);
    }
  }
  return signals;
}
