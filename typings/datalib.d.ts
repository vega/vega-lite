declare module "datalib/src/util" {
  export function keys(a);
  export function extend(a, b, ...rest);
  export function duplicate(a);
  export function isArray(a);
  export function vals(a);
  export function truncate(a:string, length: number);
  export function toMap(a);
  export function isObject(a);
}

declare module "datalib/src/generate" {
  export function range(a, b?);
}

declare module "datalib/src/stats" {
  export function summary(a: Array<Array<any>>);
}

declare module "datalib/src/bins/bins" {
  function bin(a);
  export = bin;
}
