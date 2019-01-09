import { codegen, parse } from 'vega-expression';
import { stringValue } from 'vega-util';
import { globalWholeWordRegExp, keys } from '../util';
/**
 * A class that wraps an expression with a list signal names in the expression. If they are renamed during parsing multi-views,   we can rename then signals in the assemble phase.
 */
export class SignalRefComponent {
    constructor(expr, signalNames) {
        this.expr = expr;
        this.signalNames = signalNames;
    }
    static fromName(signalName) {
        return new SignalRefComponent(signalName, [signalName]);
    }
    /**
     * Generate new signal based on this signal
     */
    map(f) {
        return new SignalRefComponent(f(this.expr), this.signalNames);
    }
}
const generate = codegen({ globalvar: 'global' });
export function evalOrMakeSignalRefComponent(expr, params) {
    const varNames = keys(params);
    const signalNames = [];
    for (const varName of varNames) {
        const param = params[varName];
        if (param instanceof SignalRefComponent) {
            for (const name of param.signalNames) {
                signalNames.push(name);
            }
            expr = expr.replace(globalWholeWordRegExp(varName), param.expr);
        }
        else {
            // primitive value
            expr = expr.replace(globalWholeWordRegExp(varName), stringValue(param));
        }
    }
    if (signalNames.length > 0) {
        return new SignalRefComponent(expr, signalNames);
    }
    else {
        try {
            // Try to evaluate the expression and return the value if we succeed.
            const ast = parse(expr);
            const { code } = generate(ast);
            const f = new Function('global', `return ${code};`); // tslint:disable-line:function-constructor
            return f(params);
        }
        catch (error) {
            if (error.message.indexOf('Unrecognized function') === 0) {
                // This expression contains a function that needs to be evaluated at runtime, so let's keep it as a SignalRefComponent.
                return new SignalRefComponent(expr, []);
            }
            throw error;
        }
    }
}
//# sourceMappingURL=signal.js.map