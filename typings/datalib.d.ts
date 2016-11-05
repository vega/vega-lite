declare module 'datalib/src/util' {
  export function keys(a: any): string[];
  export function vals(a: any): any[];
  export function extend<T, U, V, W>(a: T, b: U, c: V, d: W): T & U & V & W;
  export function extend<T, U, V>(a: T, b: U, c: V): T & U & V;
  export function extend<T, U>(a: T, b: U): T & U;
  export function extend(...all: any[]): any;
  export function duplicate<T>(a: T): T;
  export function isArray(a: any | any[]): a is any[];
  export function truncate(a: string, length: number): string;
  export function toMap<T>(a: T[]): any;
  export function isObject(a: any): a is any;
  export function isString(a: any): a is string;
  export function isNumber(a: any): a is number;
  export function isBoolean(a: any): a is boolean;
}

interface BinFunc {
  (o: any): {
    stop: number;
    start: number;
    step: number;
  };
}
declare var bin: BinFunc;
declare module 'datalib/src/bins/bins' {
  export = bin;
}
