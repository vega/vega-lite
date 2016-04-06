/// <reference path="../typings/datalib.d.ts"/>

export {keys, extend, duplicate, isArray, vals, truncate, toMap, isObject} from 'datalib/src/util';
export {range} from 'datalib/src/generate';

export function contains<T>(array: Array<T>, item: T) {
  return array.indexOf(item) > -1;
}

/** Returns the array without the elements in item */
export function without<T>(array: Array<T>, items: Array<T>) {
  return array.filter(function(item) {
    return !contains(items, item);
  });
}

export function forEach(obj, f: (a, d, k, o) => any, thisArg) {
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

export function reduce(obj, f: (a, i, d, k, o) => any, init, thisArg?) {
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

export function map(obj, f: (a, d, k, o) => any, thisArg?) {
  if (obj.map) {
    return obj.map.call(thisArg, f);
  } else {
    let output = [];
    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        output.push(f.call(thisArg, obj[k], k, obj));
      }
    }
    return output;
  }
}

export function any<T>(arr: Array<T>, f: (d: T, k?, i?) => boolean) {
  let i = 0;
  for (let k = 0; k<arr.length; k++) {
    if (f(arr[k], k, i++)) {
      return true;
    }
  }
  return false;
}

export function all<T>(arr: Array<T>, f: (d: T, k?, i?) => boolean) {
  let i = 0;
  for (let k = 0; k<arr.length; k++) {
    if (!f(arr[k], k, i++)) {
      return false;
    }
  }
  return true;
}

export function mergeDeep(dest, ...src: any[]) {
  for (let i = 0; i < src.length; i++) {
    dest = deepMerge_(dest, src[i]);
  }
  return dest;
};

// recursively merges src into dest
function deepMerge_(dest, src) {
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

// FIXME remove this
import * as dlBin from 'datalib/src/bins/bins';
export function getbins(stats, maxbins) {
  return dlBin({
    min: stats.min,
    max: stats.max,
    maxbins: maxbins
  });
}

export function error(message: any) {
  console.error('[VL Error]', message);
}
