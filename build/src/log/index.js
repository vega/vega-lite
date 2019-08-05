/**
 * Vega-Lite's singleton logger utility.
 */
import { logger, Warn } from 'vega-util';
import * as message_ from './message';
export const message = message_;
/**
 * Main (default) Vega Logger instance for Vega-Lite
 */
const main = logger(Warn);
let current = main;
/**
 * Logger tool for checking if the code throws correct warning
 */
export class LocalLogger {
    constructor() {
        this.warns = [];
        this.infos = [];
        this.debugs = [];
    }
    level() {
        return this;
    }
    warn(...args) {
        this.warns.push(...args);
        return this;
    }
    info(...args) {
        this.infos.push(...args);
        return this;
    }
    debug(...args) {
        this.debugs.push(...args);
        return this;
    }
    error(...args) {
        throw Error(...args);
        return this; // @ts-ignore
    }
}
export function wrap(f) {
    return () => {
        current = new LocalLogger();
        f(current);
        reset();
    };
}
/**
 * Set the singleton logger to be a custom logger
 */
export function set(newLogger) {
    current = newLogger;
    return current;
}
/**
 * Reset the main logger to use the default Vega Logger
 */
export function reset() {
    current = main;
    return current;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function warn(..._) {
    current.warn.apply(current, arguments);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function info(..._) {
    current.info.apply(current, arguments);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function debug(..._) {
    current.debug.apply(current, arguments);
}
//# sourceMappingURL=index.js.map