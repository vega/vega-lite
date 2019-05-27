/**
 * Vega-Lite's singleton logger utility.
 */

import {logger, LoggerInterface, Warn} from 'vega-util';
import * as message_ from './message';

export const message = message_;

/**
 * Main (default) Vega Logger instance for Vega-Lite
 */
const main = logger(Warn);
let current: LoggerInterface = main;

/**
 * Logger tool for checking if the code throws correct warning
 */
export class LocalLogger implements LoggerInterface {
  public warns: any[] = [];
  public infos: any[] = [];
  public debugs: any[] = [];

  public level() {
    return this;
  }

  public warn(...args: any[]) {
    this.warns.push(...args);
    return this;
  }

  public info(...args: any[]) {
    this.infos.push(...args);
    return this;
  }

  public debug(...args: any[]) {
    this.debugs.push(...args);
    return this;
  }

  public error(...args: any[]) {
    throw Error(...args);
    return this; // @ts-ignore
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
 * Set the singleton logger to be a custom logger
 */
export function set(newLogger: LoggerInterface) {
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
export function warn(..._: any[]) {
  current.warn.apply(current, arguments);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function info(..._: any[]) {
  current.info.apply(current, arguments);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function debug(..._: any[]) {
  current.debug.apply(current, arguments);
}
