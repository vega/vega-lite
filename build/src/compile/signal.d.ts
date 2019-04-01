import { SignalRef } from 'vega';
export declare type Rename = (oldSignalName: string) => string;
/**
 * A class that behaves like a SignalRef but lazily generates the signal.
 * The provided generator function should use `Model.getSignalName` to use the correct signal name.
 */
export declare class SignalRefWrapper implements SignalRef {
    constructor(exprGenerator: () => string);
    signal: string;
    static fromName(rename: Rename, signalName: string): SignalRefWrapper;
}
//# sourceMappingURL=signal.d.ts.map