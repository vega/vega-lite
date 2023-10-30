/**
 * Vega-Lite's singleton logger utility.
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LocalLogger_level;
import { Debug, Error as ErrorLevel, Info, logger, Warn } from 'vega-util';
export * as message from './message';
/**
 * Main (default) Vega Logger instance for Vega-Lite.
 */
const main = logger(Warn);
let current = main;
/**
 * Logger tool for checking if the code throws correct warning.
 */
export class LocalLogger {
    constructor() {
        this.warns = [];
        this.infos = [];
        this.debugs = [];
        _LocalLogger_level.set(this, Warn);
    }
    level(_) {
        if (_) {
            __classPrivateFieldSet(this, _LocalLogger_level, _, "f");
            return this;
        }
        return __classPrivateFieldGet(this, _LocalLogger_level, "f");
    }
    warn(...args) {
        if (__classPrivateFieldGet(this, _LocalLogger_level, "f") >= Warn)
            this.warns.push(...args);
        return this;
    }
    info(...args) {
        if (__classPrivateFieldGet(this, _LocalLogger_level, "f") >= Info)
            this.infos.push(...args);
        return this;
    }
    debug(...args) {
        if (__classPrivateFieldGet(this, _LocalLogger_level, "f") >= Debug)
            this.debugs.push(...args);
        return this;
    }
    error(...args) {
        if (__classPrivateFieldGet(this, _LocalLogger_level, "f") >= ErrorLevel)
            throw Error(...args);
        return this;
    }
}
_LocalLogger_level = new WeakMap();
export function wrap(f) {
    return () => {
        current = new LocalLogger();
        f(current);
        reset();
    };
}
/**
 * Set the singleton logger to be a custom logger.
 */
export function set(newLogger) {
    current = newLogger;
    return current;
}
/**
 * Reset the main logger to use the default Vega Logger.
 */
export function reset() {
    current = main;
    return current;
}
export function error(...args) {
    current.error(...args);
}
export function warn(...args) {
    current.warn(...args);
}
export function info(...args) {
    current.info(...args);
}
export function debug(...args) {
    current.debug(...args);
}
//# sourceMappingURL=index.js.map