/**
 * A class that behaves like a SignalRef but lazily generates the signal.
 * The provided generator function should use `Model.getSignalName` to use the correct signal name.
 */
export class SignalRefWrapper {
    constructor(exprGenerator) {
        Object.defineProperty(this, 'signal', {
            enumerable: true,
            get: exprGenerator
        });
    }
    static fromName(rename, signalName) {
        return new SignalRefWrapper(() => rename(signalName));
    }
}
//# sourceMappingURL=signal.js.map