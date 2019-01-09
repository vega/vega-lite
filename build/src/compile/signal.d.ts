/**
 * A class that wraps an expression with a list signal names in the expression. If they are renamed during parsing multi-views,   we can rename then signals in the assemble phase.
 */
export declare class SignalRefComponent {
    expr: string;
    signalNames: string[];
    constructor(expr: string, signalNames: string[]);
    static fromName(signalName: string): SignalRefComponent;
    /**
     * Generate new signal based on this signal
     */
    map(f: (expr: string) => string): SignalRefComponent;
}
export declare function evalOrMakeSignalRefComponent(expr: string, params: {
    [varname: string]: number | string | boolean | object | SignalRefComponent;
}): any;
