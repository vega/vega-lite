/**
 * Vega-Lite's singleton logger utility.
 */
import {Debug, Error as ErrorLevel, Info, logger, Warn} from 'vega-util';
export * as message from './message.js';
/**
 * Main (default) Vega Logger instance for Vega-Lite.
 */
const main = logger(Warn);
let current = main;
/**
 * Logger tool for checking if the code throws correct warning.
 */
export class LocalLogger {
  warns = [];
  infos = [];
  debugs = [];
  #level = Warn;
  level(_) {
    if (_) {
      this.#level = _;
      return this;
    }
    return this.#level;
  }
  warn(...args) {
    if (this.#level >= Warn) this.warns.push(...args);
    return this;
  }
  info(...args) {
    if (this.#level >= Info) this.infos.push(...args);
    return this;
  }
  debug(...args) {
    if (this.#level >= Debug) this.debugs.push(...args);
    return this;
  }
  error(...args) {
    if (this.#level >= ErrorLevel) throw Error(...args);
    return this;
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
