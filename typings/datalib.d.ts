declare module 'datalib/src/util' {
  export function keys(a): Array<string>;
  export function extend(a, b, ...rest);
  export function duplicate<T>(a: T): T;
  export function isArray(a: any | any[]): a is any[];
  export function vals(a);
  export function truncate(a: string, length: number): string;
  export function toMap(a);
  export function isObject(a): boolean;
}

declare module 'datalib/src/generate' {
  export function range(a: number, b?: number, step?: number): Array<number>;
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
