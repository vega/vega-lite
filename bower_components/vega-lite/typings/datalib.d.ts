declare module 'datalib/src/util' {
  export function keys(a): Array<string>;
  export function extend(a, b, ...rest);
  export function duplicate(a);
  export function isArray(a): boolean;
  export function vals(a);
  export function truncate(a: string, length: number): string;
  export function toMap(a);
  export function isObject(a): boolean;
}

declare module 'datalib/src/generate' {
  export function range(a: number, b?: number): Array<number>;
}

declare module 'datalib/src/stats' {
  export function summary(a: Array<Array<any>>);
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
