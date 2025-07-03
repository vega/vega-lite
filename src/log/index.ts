/**
 * Vega-Lite's singleton logger utility.
 */

import {Debug, Error as ErrorLevel, Info, logger, LoggerInterface, Warn} from 'vega-util';
export * as message from './message.js';

/**
 * Main (default) Vega Logger instance for Vega-Lite.
 */
const main = logger(Warn);
let current: LoggerInterface = main;

/**
 * Logger tool for checking if the code throws correct warning.
 */
export class LocalLogger implements LoggerInterface {
  public warns: any[] = [];
  public infos: any[] = [];
  public debugs: any[] = [];

  #level: number = Warn;

  public level(): number;
  public level(_: number): this;
  public level(_?: number) {
    if (_) {
      this.#level = _;
      return this;
    }
    return this.#level;
  }

  public warn(...args: readonly any[]) {
    if (this.#level >= Warn) this.warns.push(...args);
    return this;
  }

  public info(...args: readonly any[]) {
    if (this.#level >= Info) this.infos.push(...args);
    return this;
  }

  public debug(...args: readonly any[]) {
    if (this.#level >= Debug) this.debugs.push(...args);
    return this;
  }

  public error(...args: readonly any[]): this {
    if (this.#level >= ErrorLevel) throw Error(...args);
    return this;
  }
}

export function wrap(f: (logger: LocalLogger) => void) {
  return () => {
    current = new LocalLogger();
    f(current as LocalLogger);
    reset();
  };
}

/**
 * Set the singleton logger to be a custom logger.
 */
export function set(newLogger: LoggerInterface) {
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

export function error(...args: readonly any[]) {
  current.error(...args);
}

export function warn(...args: readonly any[]) {
  current.warn(...args);
}

export function info(...args: readonly any[]) {
  current.info(...args);
}

export function debug(...args: readonly any[]) {
  current.debug(...args);
}
