var util = module.exports = {};

util.keys = function (obj) {
  var k = [], x;
  for (x in obj) k.push(x);
  return k;
}

util.vals = function (obj) {
  var v = [], x;
  for (x in obj) v.push(obj[x]);
  return v;
}

util.range = function (start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step == Infinity) throw new Error("infinite range");
  var range = [], i = -1, j;
  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
  else while ((j = start + step * ++i) < stop) range.push(j);
  return range;
}

util.find = function (list, pattern) {
  var l = list.filter(function(x) {
    return x[pattern.name] === pattern.value;
  });
  return l.length && l[0] || null;
}

util.uniq = function (data, field) {
  var map = {}, count = 0, i, k;
  for (i=0; i<data.length; ++i) {
    k = data[i][field];
    if (!map[k]) {
      map[k] = 1;
      count += 1;
    }
  }
  return count;
}

util.minmax = function (data, field) {
  var stats = {min: +Infinity, max: -Infinity};
  for (i=0; i<data.length; ++i) {
    var v = data[i][field];
    if (v > stats.max) stats.max = v;
    if (v < stats.min) stats.min = v;
  }
  return stats;
}

util.duplicate = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

util.any = function(arr, f){
  var i=0, k;
  for (k in arr) {
    if(f(arr[k], k, i++)) return true;
  }
  return false;
}

util.all = function(arr, f){
  var i=0, k;
  for (k in arr) {
    if(!f(arr[k], k, i++)) return false;
  }
  return true;
}

util.merge = function(dest, src){
  return util.keys(src).reduce(function(c, k){
    c[k] = src[k];
    return c;
  }, dest);
};

util.getbins = function (stats) {
  return vg.bins({
    min: stats.min,
    max: stats.max,
    maxbins: MAX_BINS
  });
}


util.error = function(msg){
  console.error("[VL Error]", msg);
}

