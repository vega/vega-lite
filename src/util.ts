/// <reference path="./typings/datalib.d.ts"/>

export * from 'datalib/src/util';
export * from 'datalib/src/generate';
export * from 'datalib/src/stats';

// https://github.com/Microsoft/TypeScript/issues/3612
import dlBin = require('datalib/src/bins/bins');

export var bin = dlBin;

export function isin(item: number, array: Array<any>):boolean {
  return array.indexOf(item) !== -1;
};

export function forEach(obj, f, thisArg) {
  if (obj.forEach) {
    obj.forEach.call(thisArg, f);
  } else {
    for (var k in obj) {
      f.call(thisArg, obj[k], k , obj);
    }
  }
};

export function reduce(obj, f, init, thisArg?) {
  if (obj.reduce) {
    return obj.reduce.call(thisArg, f, init);
  } else {
    for (var k in obj) {
      init = f.call(thisArg, init, obj[k], k, obj);
    }
    return init;
  }
};

export function map(obj, f, thisArg) {
  if (obj.map) {
    return obj.map.call(thisArg, f);
  } else {
    var output = [];
    for (var k in obj) {
      output.push( f.call(thisArg, obj[k], k, obj));
    }
  }
};

export function any(arr, f) {
  var i = 0, k;
  for (k in arr) {
    if (f(arr[k], k, i++)) return true;
  }
  return false;
};

export function all(arr, f) {
  var i = 0, k;
  for (k in arr) {
    if (!f(arr[k], k, i++)) return false;
  }
  return true;
};

export function getbins(stats, maxbins) {
  return dlBin({
    min: stats.min,
    max: stats.max,
    maxbins: maxbins
  });
};

/**
 * x[p[0]]...[p[n]] = val
 * @param noaugment determine whether new object should be added f
 * or non-existing properties along the path
 */
export function setter(x, p, val, noaugment = false) {
  for (var i=0; i<p.length-1; ++i) {
    if (!noaugment && !(p[i] in x)){
      x = x[p[i]] = {};
    } else {
      x = x[p[i]];
    }
  }
  x[p[i]] = val;
};

/**
 * returns x[p[0]]...[p[n]]
 * @param augment determine whether new object should be added f
 * or non-existing properties along the path
 */
export function getter(x, p, noaugment = false) {
  for (var i=0; i<p.length; ++i) {
    if (!noaugment && !(p[i] in x)){
      x = x[p[i]] = {};
    } else {
      x = x[p[i]];
    }
  }
  return x;
};

export function error(message) {
  console.log(message);
}
