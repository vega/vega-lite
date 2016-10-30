declare module 'vega-util/src/logger' {
  export interface LoggerInterface {
    level: (_: number) => number | LoggerInterface;
    warn(...args): LoggerInterface;
    info(...args): LoggerInterface;
    debug(...args): LoggerInterface;
  }

  export const None: number;
  export const Warn: number;
  export const Info: number;
  export const Debug: number;

  export function log(...args);
  export default function(_: number): LoggerInterface;
}
