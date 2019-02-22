import {SignalRef} from 'vega';
import {codegen, parse} from 'vega-expression';

export type Rename = (oldSignalName: string) => string;

/**
 * A class that behaves like a SignalRef but lazily generates the signal.
 * The provided generator function should use `Model.getSignalName` to use the correct signal name.
 */
export class SignalRefWrapper implements SignalRef {
  constructor(private exprGenerator: () => string) {}

  public get signal() {
    return this.exprGenerator();
  }

  public toJSON() {
    return {signal: this.signal};
  }

  public static fromName(rename: Rename, signalName: string) {
    return new SignalRefWrapper(() => rename(signalName));
  }
}

const generate = codegen({globalvar: 'global'});

export function evalExpression(expr: string) {
  const ast = parse(expr);
  const {code} = generate(ast);
  const f = new Function('global', `return ${code};`); // tslint:disable-line:function-constructor
  return f();
}
