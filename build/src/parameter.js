import { isSelectionParameter } from './selection';
export function assembleParameterSignals(params) {
    const signals = [];
    for (const param of params || []) {
        // Selection parameters are handled separately via assembleSelectionTopLevelSignals
        // and assembleSignals methods registered on the Model.
        if (isSelectionParameter(param))
            continue;
        const { expr, bind, ...rest } = param;
        if (bind && expr) {
            // Vega's InitSignal -- apply expr to "init"
            const signal = {
                ...rest,
                bind,
                init: expr
            };
            signals.push(signal);
        }
        else {
            const signal = {
                ...rest,
                ...(expr ? { update: expr } : {}),
                ...(bind ? { bind } : {})
            };
            signals.push(signal);
        }
    }
    return signals;
}
//# sourceMappingURL=parameter.js.map