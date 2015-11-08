declare module "datalib/src/util" {
  export function keys(a);
  export function extend(a, b, c);
  export function duplicate(a);
  export function isArray(a);
  export function range(a, b?);
  export function vals(a);
  export function truncate(a:string, length: number);
  export function toMap(a);
  export function isObject(a);
}

declare module "datalib/src/generate" {
}

declare module "datalib/src/stats" {
  export function summary(a: Array<Array<any>>);
}

declare module "datalib/src/bins/bins" {
  export default function bin(a);
}
