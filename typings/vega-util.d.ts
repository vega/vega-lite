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

  export function truncate(a: string, length: number): string;

  export function isArray<T>(a: any | T[]): a is T[];
  export function isObject(a: any): a is object;
  export function isString(a: any): a is string;
  export function isNumber(a: any): a is number;

  export function toSet<T>(array: T[]): {[T: string]: boolean}
  export function stringValue(a: any): string;
  export function splitAccessPath(path: string): string[];
}
