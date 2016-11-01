declare module 'vega-util' {
  export interface LoggerInterface {
    level: (_: number) => number | LoggerInterface;
    warn(...args: any[]): LoggerInterface;
    info(...args: any[]): LoggerInterface;
    debug(...args: any[]): LoggerInterface;
  }

  export const None: number;
  export const Warn: number;
  export const Info: number;
  export const Debug: number;

  export function log(...args: any[]): void;
  export function logger(_: number): LoggerInterface;
}
