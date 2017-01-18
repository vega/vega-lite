/// <reference path="../typings/datalib.d.ts"/>

import * as stringify from 'json-stable-stringify';
export {keys, extend, duplicate, isArray, vals, truncate, toMap, isObject, isString, isNumber, isBoolean} from 'datalib/src/util';
import {duplicate as _duplicate, keys} from 'datalib/src/util';
import {isString, isNumber, isBoolean} from 'datalib/src/util';

/**
 * Creates an object composed of the picked object properties.
 *
 * Example:  (from lodash)
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 * pick(object, ['a', 'c']);
 * // → { 'a': 1, 'c': 3 }
 *
 */
export function pick(obj: any, props: string[]) {
  let copy = {};
  props.forEach((prop) => {
    if (obj.hasOwnProperty(prop)) {
      copy[prop] = obj[prop];
    }
  });
  return copy;
}

// Copied from datalib
export function range(start: number, stop?: number, step?: number): Array<number> {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step === Infinity) {
    throw new Error('Infinite range');
  }
  var range: number[] = [], i = -1, j: number;
  if (step < 0) {
    /* tslint:disable */
    while ((j = start + step * ++i) > stop) {
      range.push(j);
    }
  } else {
    while ((j = start + step * ++i) < stop) {
      range.push(j);
    }
    /* tslint:enable */
  }
  return range;
};

/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
export function omit(obj: any, props: string[]) {
  let copy = _duplicate(obj);
  props.forEach((prop) => {
    delete copy[prop];
  });
  return copy;
}

export function hash(a: any) {
  if (isString(a) || isNumber(a) || isBoolean(a)) {
    return String(a);
  }
  return stringify(a);
}

export function contains<T>(array: Array<T>, item: T) {
  return array.indexOf(item) > -1;
}

/** Returns the array without the elements in item */
export function without<T>(array: Array<T>, excludedItems: Array<T>) {
  return array.filter(function(item) {
    return !contains(excludedItems, item);
  });
}

export function union<T>(array: Array<T>, other: Array<T>) {
  return array.concat(without(other, array));
}

export function forEach(obj: any, f: (a: any, d: string, k: any, o: any) => any, thisArg?: any) {
  if (obj.forEach) {
    obj.forEach.call(thisArg, f);
  } else {
    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        f.call(thisArg, obj[k], k, obj);
      }
    }
  }
}

export function reduce(obj: any, f: (a: any, i: any, d: any, k: any, o: any) => any, init: any, thisArg?: any) {
  if (obj.reduce) {
    return obj.reduce.call(thisArg, f, init);
  } else {
    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        init = f.call(thisArg, init, obj[k], k, obj);
      }
    }
    return init;
  }
}

export function map(obj: any, f: (a: any, d: any, k: any, o: any) => any, thisArg?: any) {
  if (obj.map) {
    return obj.map.call(thisArg, f);
  } else {
    let output: any[] = [];
    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        output.push(f.call(thisArg, obj[k], k, obj));
      }
    }
    return output;
  }
}

export function some<T>(arr: Array<T>, f: (d: T, k?: any, i?: any) => boolean) {
  let i = 0;
  for (let k = 0; k<arr.length; k++) {
    if (f(arr[k], k, i++)) {
      return true;
    }
  }
  return false;
}

export function every<T>(arr: Array<T>, f: (d: T, k?: any, i?: any) => boolean) {
  let i = 0;
  for (let k = 0; k<arr.length; k++) {
    if (!f(arr[k], k, i++)) {
      return false;
    }
  }
  return true;
}

export function flatten(arrays: any[]) {
  return [].concat.apply([], arrays);
}

export function mergeDeep(dest: any, ...src: any[]) {
  for (let i = 0; i < src.length; i++) {
    dest = deepMerge_(dest, src[i]);
  }
  return dest;
};

// recursively merges src into dest
function deepMerge_(dest: any, src: any) {
  if (typeof src !== 'object' || src === null) {
    return dest;
  }

  for (let p in src) {
    if (!src.hasOwnProperty(p)) {
      continue;
    }
    if (src[p] === undefined) {
      continue;
    }
    if (typeof src[p] !== 'object' || src[p] === null) {
      dest[p] = src[p];
    } else if (typeof dest[p] !== 'object' || dest[p] === null) {
      dest[p] = mergeDeep(src[p].constructor === Array ? [] : {}, src[p]);
    } else {
      mergeDeep(dest[p], src[p]);
    }
  }
  return dest;
}

export function unique<T>(values: T[], f: (item: T) => string) {
  let results: any[] = [];
  var u = {}, v: string, i: number, n: number;
  for (i = 0, n = values.length; i < n; ++i) {
    v = f(values[i]);
    if (v in u) {
      continue;
    }
    u[v] = 1;
    results.push(values[i]);
  }
  return results;
};

export interface Dict<T> {
  [key: string]: T;
}

export type StringSet = Dict<boolean>;

/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
export function differ<T>(dict: Dict<T>, other: Dict<T>) {
  for (let key in dict) {
    if (dict.hasOwnProperty(key)) {
      if (other[key] && dict[key] && other[key] !== dict[key]) {
        return true;
      }
    }
  }
  return false;
}

export function prosSpecMapping(prosSpec) {
  var newSpec = keys(prosSpec).reduce(function(a, k) {
      a[k] = {value: prosSpec[k]};
      return a;
    }, {});
  return newSpec;
}
