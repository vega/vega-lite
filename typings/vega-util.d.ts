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

  export function extend<T, U, V, W>(a: T, b: U, c: V, d: W): T & U & V & W;
  export function extend<T, U, V>(a: T, b: U, c: V): T & U & V;
  export function extend<T, U>(a: T, b: U): T & U;
  export function extend(...all: any[]): any;

  export function truncate(a: string, length: number): string;

  export function isArray<T>(a: any | T[]): a is T[];
  export function isObject(a: any): a is object;
  export function isString(a: any): a is string;
  export function isNumber(a: any): a is number;

  export function toSet<T>(array: T[]): {[T: string]: boolean}
  export function stringValue(a: any): string;
}
