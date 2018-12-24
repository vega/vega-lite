/**
 * A class that wraps an expression with a list signal names in the expression. If they are renamed during parsing multi-views,   we can rename then signals in the assemble phase.
 */
export class SignalRefComponent {
  constructor(public expr: string, public signalNames: string[]) {}

  public static fromName(signalName: string) {
    return new SignalRefComponent(signalName, [signalName]);
  }

  /**
   * Generate new signal based on this signal
   */
  public map(f: (expr: string) => string) {
    return new SignalRefComponent(f(this.expr), this.signalNames);
  }
}
