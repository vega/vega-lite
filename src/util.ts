/// <reference path="../typings/datalib.d.ts"/>

export {keys, extend, duplicate, isArray, vals, truncate, toMap, isObject} from 'datalib/src/util';
export {range} from 'datalib/src/generate';

export function contains(array: Array<any>, item: any) {
  return array.indexOf(item) > -1;
}

export function forEach(obj, f: (a, d, k, o) => any, thisArg) {
  if (obj.forEach) {
    obj.forEach.call(thisArg, f);
  } else {
    for (var k in obj) {
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
    for (var k in obj) {
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
    var output = [];
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        output.push(f.call(thisArg, obj[k], k, obj));
      }
    }
    return output;
  }
}

export function any(arr: Array<any>, f: (d, k?, i?) => boolean) {
  var i = 0;
  for (let k = 0; k<arr.length; k++) {
    if (f(arr[k], k, i++)) {
      return true;
    }
  }
  return false;
}

export function all(arr: Array<any>, f: (d, k?, i?) => boolean) {
  var i = 0;
  for (let k = 0; k<arr.length; k++) {
    if (!f(arr[k], k, i++)) {
      return false;
    }
  }
  return true;
}

// FIXME remove this
import dlBin = require('datalib/src/bins/bins');
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
