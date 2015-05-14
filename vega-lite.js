!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.vl=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./globals');

var util = require('./util'),
    consts = require('./consts');

var vl = {};

util.extend(vl, consts, util);

vl.Encoding = require('./Encoding');
vl.compile = require('./compile/compile');
vl.data = require('./data');
vl.field = require('./field');
vl.enc = require('./enc');
vl.schema = require('./schema/schema');
vl.toShorthand = vl.Encoding.shorthand;

module.exports = vl;
},{"./Encoding":10,"./compile/compile":14,"./consts":28,"./data":29,"./enc":30,"./field":31,"./globals":32,"./schema/schema":33,"./util":35}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
var util = require('./util');
var units = require('./date-units');
var EPSILON = 1e-15;

function bin(opt) {
  opt = opt || {};

  // determine range
  var maxb = opt.maxbins || 15,
      base = opt.base || 10,
      logb = Math.log(base),
      div = opt.div || [5, 2],      
      min = opt.min,
      max = opt.max,
      span = max - min,
      step, logb, level, minstep, precision, v, i, eps;

  if (opt.step != null) {
    // if step size is explicitly given, use that
    step = opt.step;
  } else if (opt.steps) {
    // if provided, limit choice to acceptable step sizes
    step = opt.steps[Math.min(
      opt.steps.length - 1,
      bisect(opt.steps, span/maxb, 0, opt.steps.length)
    )];
  } else {
    // else use span to determine step size
    level = Math.ceil(Math.log(maxb) / logb);
    minstep = opt.minstep || 0;
    step = Math.max(
      minstep,
      Math.pow(base, Math.round(Math.log(span) / logb) - level)
    );
    
    // increase step size if too many bins
    do { step *= base; } while (Math.ceil(span/step) > maxb);

    // decrease step size if allowed
    for (i=0; i<div.length; ++i) {
      v = step / div[i];
      if (v >= minstep && span / v <= maxb) step = v;
    }
  }

  // update precision, min and max
  v = Math.log(step);
  precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
  eps = Math.pow(base, -precision - 1);
  min = Math.min(min, Math.floor(min / step + eps) * step);
  max = Math.ceil(max / step) * step;

  return {
    start: min,
    stop:  max,
    step:  step,
    unit:  {precision: precision},
    value: value,
    index: index
  };
};

function bisect(a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (util.cmp(a[mid], x) < 0) { lo = mid + 1; }
    else { hi = mid; }
  }
  return lo;
};

function value(v) {
  return this.step * Math.floor(v / this.step + EPSILON);
}

function index(v) {
  return Math.floor((v - this.start) / this.step + EPSILON);
}

function date_value(v) {
  return this.unit.date(value.call(this, v));
}

function date_index(v) {
  return index.call(this, this.unit.unit(v));
}

bin.date = function(opt) {
  opt = opt || {};

  // find time step, then bin
  var dmin = opt.min,
      dmax = opt.max,
      maxb = opt.maxbins || 20,
      minb = opt.minbins || 4,
      span = (+dmax) - (+dmin);
      unit = opt.unit ? units[opt.unit] : units.find(span, minb, maxb),
      bins = bin({
        min:     unit.min != null ? unit.min : unit.unit(dmin),
        max:     unit.max != null ? unit.max : unit.unit(dmax),
        maxbins: maxb,
        minstep: unit.minstep,
        steps:   unit.step
      });

  bins.unit = unit;
  bins.index = date_index;
  if (!opt.raw) bins.value = date_value;
  return bins;
};

module.exports = bin;

},{"./date-units":5,"./util":9}],5:[function(require,module,exports){
var util = require('./util');

var STEPS = [
  [31536e6, 5],  // 1-year
  [7776e6, 4],   // 3-month
  [2592e6, 4],   // 1-month
  [12096e5, 3],  // 2-week
  [6048e5, 3],   // 1-week
  [1728e5, 3],   // 2-day
  [864e5, 3],    // 1-day
  [432e5, 2],    // 12-hour
  [216e5, 2],    // 6-hour
  [108e5, 2],    // 3-hour
  [36e5, 2],     // 1-hour
  [18e5, 1],     // 30-minute
  [9e5, 1],      // 15-minute
  [3e5, 1],      // 5-minute
  [6e4, 1],      // 1-minute
  [3e4, 0],      // 30-second
  [15e3, 0],     // 15-second
  [5e3, 0],      // 5-second
  [1e3, 0]       // 1-second
];

var entries = [
  {
    type: "second",
    minstep: 1,
    format: "%Y %b %-d %H:%M:%S.%L",
    date: function(d) {
      return new Date(d * 1e3);
    },
    unit: function(d) {
      return (+d / 1e3);
    }
  },
  {
    type: "minute",
    minstep: 1,
    format: "%Y %b %-d %H:%M",
    date: function(d) {
      return new Date(d * 6e4);
    },
    unit: function(d) {
      return ~~(+d / 6e4);
    }
  },
  {
    type: "hour",
    minstep: 1,
    format: "%Y %b %-d %H:00",
    date: function(d) {
      return new Date(d * 36e5);
    },
    unit: function(d) {
      return ~~(+d / 36e5);
    }
  },
  {
    type: "day",
    minstep: 1,
    step: [1, 7],
    format: "%Y %b %-d",
    date: function(d) {
      return new Date(d * 864e5);
    },
    unit: function(d) {
      return ~~(+d / 864e5);
    }
  },
  {
    type: "month",
    minstep: 1,
    step: [1, 3, 6],
    format: "%b %Y",
    date: function(d) {
      return new Date(Date.UTC(~~(d / 12), d % 12, 1));
    },
    unit: function(d) {
      if (util.isNumber(d)) d = new Date(d);
      return 12 * d.getUTCFullYear() + d.getUTCMonth();
    }
  },
  {
    type: "year",
    minstep: 1,
    format: "%Y",
    date: function(d) {
      return new Date(Date.UTC(d, 0, 1));
    },
    unit: function(d) {
      return (util.isNumber(d) ? new Date(d) : d).getUTCFullYear();
    }
  }
];

var minuteOfHour = {
  type: "minuteOfHour",
  min: 0,
  max: 59,
  minstep: 1,
  format: "%M",
  date: function(d) {
    return new Date(Date.UTC(1970, 0, 1, 0, d));
  },
  unit: function(d) {
    return (util.isNumber(d) ? new Date(d) : d).getUTCMinutes();
  }
};

var hourOfDay = {
  type: "hourOfDay",
  min: 0,
  max: 23,
  minstep: 1,
  format: "%H",
  date: function(d) {
    return new Date(Date.UTC(1970, 0, 1, d));
  },
  unit: function(d) {
    return (util.isNumber(d) ? new Date(d) : d).getUTCHours();
  }
};

var dayOfWeek = {
  type: "dayOfWeek",
  min: 0,
  max: 6,
  step: [1],
  format: "%a",
  date: function(d) {
    return new Date(Date.UTC(1970, 0, 4 + d));
  },
  unit: function(d) {
    return (util.isNumber(d) ? new Date(d) : d).getUTCDay();
  }
};

var dayOfMonth = {
  type: "dayOfMonth",
  min: 1,
  max: 31,
  step: [1],
  format: "%-d",
  date: function(d) {
    return new Date(Date.UTC(1970, 0, d));
  },
  unit: function(d) {
    return (util.isNumber(d) ? new Date(d) : d).getUTCDate();
  }
};

var monthOfYear = {
  type: "monthOfYear",
  min: 0,
  max: 11,
  step: [1],
  format: "%b",
  date: function(d) {
    return new Date(Date.UTC(1970, d % 12, 1));
  },
  unit: function(d) {
    return (util.isNumber(d) ? new Date(d) : d).getUTCMonth();
  }
};

var units = {
  "second":       entries[0],
  "minute":       entries[1],
  "hour":         entries[2],
  "day":          entries[3],
  "month":        entries[4],
  "year":         entries[5],
  "minuteOfHour": minuteOfHour,
  "hourOfDay":    hourOfDay,
  "dayOfWeek":    dayOfWeek,
  "dayOfMonth":   dayOfMonth,
  "monthOfYear":  monthOfYear,
  "timesteps":    entries
};

units.find = function(span, minb, maxb) {
  var i, len, bins, step = STEPS[0];

  for (i = 1, len = STEPS.length; i < len; ++i) {
    step = STEPS[i];
    if (span > step[0]) {
      bins = span / step[0];
      if (bins > maxb) {
        return entries[STEPS[i - 1][1]];
      }
      if (bins >= minb) {
        return entries[step[1]];
      }
    }
  }
  return entries[STEPS[STEPS.length - 1][1]];
};

module.exports = units;

},{"./util":9}],6:[function(require,module,exports){
var gen = module.exports = {};

gen.repeat = function(val, n) {
  var a = Array(n), i;
  for (i=0; i<n; ++i) a[i] = val;
  return a;
};

gen.zeros = function(n) {
  return gen.repeat(0, n);
};

gen.range = function(start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step == Infinity) throw new Error('Infinite range');
  var range = [], i = -1, j;
  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
  else while ((j = start + step * ++i) < stop) range.push(j);
  return range;
};

gen.random = {};

gen.random.uniform = function(min, max) {
  if (max === undefined) {
		max = min;
		min = 0;
	}
	var d = max - min;
	var f = function() {
		return min + d * Math.random();
	};
	f.samples = function(n) { return gen.zeros(n).map(f); };
	return f;
};

gen.random.integer = function(a, b) {
	if (b === undefined) {
		b = a;
		a = 0;
	}
  var d = b - a;
	var f = function() {
		return a + Math.floor(d * Math.random());
	};
	f.samples = function(n) { return gen.zeros(n).map(f); };
	return f;
};

gen.random.normal = function(mean, stdev) {
	mean = mean || 0;
	stdev = stdev || 1;
	var next = undefined;
	var f = function() {
		var x = 0, y = 0, rds, c;
		if (next !== undefined) {
			x = next;
			next = undefined;
			return x;
		}
		do {
			x = Math.random()*2-1;
			y = Math.random()*2-1;
			rds = x*x + y*y;
		} while (rds == 0 || rds > 1);
		c = Math.sqrt(-2*Math.log(rds)/rds); // Box-Muller transform
		next = mean + y*c*stdev;
		return mean + x*c*stdev;
	};
	f.samples = function(n) { return gen.zeros(n).map(f); };
	return f;
};
},{}],7:[function(require,module,exports){
var util = require('./util');
var gen = require('./generate');
var stats = {};

// Collect unique values and associated counts.
// Output: an array of unique values, in observed order
// The array includes an additional 'counts' property,
// which is a hash from unique values to occurrence counts.
stats.unique = function(values, f, results) {
  if (!util.isArray(values) || values.length===0) return [];
  results = results || [];
  var u = {}, v, i;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) {
      u[v] += 1;
    } else {
      u[v] = 1;
      results.push(v);
    }
  }
  results.counts = u;
  return results;
};

// Count the number of non-null values.
stats.count = function(values, f) {
  if (!util.isArray(values) || values.length===0) return 0;
  var v, i, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v != null) count += 1;
  }
  return count;
};

// Count the number of distinct values.
stats.count.distinct = function(values, f) {
  if (!util.isArray(values) || values.length===0) return 0;
  var u = {}, v, i, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    count += 1;
  }
  return count;
};

// Count the number of null or undefined values.
stats.count.nulls = function(values, f) {
  if (!util.isArray(values) || values.length===0) return 0;
  var v, i, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v == null) count += 1;
  }
  return count;
};

// Compute the median of an array of numbers.
stats.median = function(values, f) {
  if (!util.isArray(values) || values.length===0) return 0;
  if (f) values = values.map(f);
  values = values.filter(util.isNotNull).sort(util.cmp);
  var half = Math.floor(values.length/2);
  if (values.length % 2) {
    return values[half];
  } else {
    return (values[half-1] + values[half]) / 2.0;
  }
};

// Compute the quantile of a sorted array of numbers.
// Adapted from the D3.js implementation.
stats.quantile = function(values, f, p) {
  if (p === undefined) { p = f; f = util.identity; }
  var H = (values.length - 1) * p + 1,
      h = Math.floor(H),
      v = +f(values[h - 1]),
      e = H - h;
  return e ? v + e * (f(values[h]) - v) : v;
};

// Compute the mean (average) of an array of numbers.
stats.mean = function(values, f) {
  if (!util.isArray(values) || values.length===0) return 0;
  var mean = 0, delta, i, c, v;
  for (i=0, c=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v != null && !isNaN(v)) {
      delta = v - mean;
      mean = mean + delta / (++c);
    }
  }
  return mean;
};

// Compute the sample variance of an array of numbers.
stats.variance = function(values, f) {
  if (!util.isArray(values) || values.length===0) return 0;
  var mean = 0, M2 = 0, delta, i, c, v;
  for (i=0, c=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v != null && !isNaN(v)) {
      delta = v - mean;
      mean = mean + delta / (++c);
      M2 = M2 + delta * (v - mean);
    }
  }
  M2 = M2 / (c - 1);
  return M2;
};

// Compute the sample standard deviation of an array of numbers.
stats.stdev = function(values, f) {
  return Math.sqrt(stats.variance(values, f));
};

// Compute the Pearson mode skewness ((median-mean)/stdev) of an array of numbers.
stats.modeskew = function(values, f) {
  var avg = stats.mean(values, f),
      med = stats.median(values, f),
      std = stats.stdev(values, f);
  return std === 0 ? 0 : (avg - med) / std;
};

// Find the minimum and maximum of an array of values.
stats.extent = function(values, f) {
  var a, b, v, i, n = values.length;
  for (i=0; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isNotNull(v)) { a = b = v; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isNotNull(v)) {
      if (v < a) a = v;
      if (v > b) b = v;
    }
  }
  return [a, b];
};

// Find the integer indices of the minimum and maximum values.
stats.extent.index = function(values, f) {
  var a, b, x, y, v, i, n = values.length;
  for (i=0; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isNotNull(v)) { a = b = v; x = y = i; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isNotNull(v)) {
      if (v < a) { a = v; x = i; }
      if (v > b) { b = v; y = i; }
    }
  }
  return [x, y];
};

// Compute the dot product of two arrays of numbers.
stats.dot = function(values, a, b) {
  var sum = 0, i, v;
  if (!b) {
    if (values.length !== a.length) {
      throw Error("Array lengths must match.");
    }
    for (i=0; i<values.length; ++i) {
      v = values[i] * a[i];
      if (!isNaN(v)) sum += v;
    }
  } else {  
    for (i=0; i<values.length; ++i) {
      v = a(values[i]) * b(values[i]);
      if (!isNaN(v)) sum += v;
    }
  }
  return sum;
};

// Compute ascending rank scores for an array of values.
// Ties are assigned their collective mean rank.
stats.rank = function(values, f) {
  var a = values.map(function(v, i) {
      return {
        idx: i,
        val: (f ? f(v) : v)
      };
    })
    .sort(util.comparator("val"));

  var n = values.length,
      r = Array(n),
      tie = -1, p = {}, i, v, mu;

  for (i=0; i<n; ++i) {
    v = a[i].val;
    if (tie < 0 && p === v) {
      tie = i - 1;
    } else if (tie > -1 && p !== v) {
      mu = 1 + (i-1 + tie) / 2;
      for (; tie<i; ++tie) r[a[tie].idx] = mu;
      tie = -1;
    }
    r[a[i].idx] = i + 1;
    p = v;
  }

  if (tie > -1) {
    mu = 1 + (n-1 + tie) / 2;
    for (; tie<n; ++tie) r[a[tie].idx] = mu;
  }

  return r;
};

// Compute the sample Pearson product-moment correlation of two arrays of numbers.
stats.cor = function(values, a, b) {
  var fn = b;
  b = fn ? values.map(b) : a,
  a = fn ? values.map(a) : values;

  var dot = stats.dot(a, b),
      mua = stats.mean(a),
      mub = stats.mean(b),
      sda = stats.stdev(a),
      sdb = stats.stdev(b),
      n = values.length;

  return (dot - n*mua*mub) / ((n-1) * sda * sdb);
};

// Compute the Spearman rank correlation of two arrays of values.
stats.cor.rank = function(values, a, b) {
  var ra = b ? stats.rank(values, a) : stats.rank(values),
      rb = b ? stats.rank(values, b) : stats.rank(a),
      n = values.length, i, s, d;

  for (i=0, s=0; i<n; ++i) {
    d = ra[i] - rb[i];
    s += d * d;
  }

  return 1 - 6*s / (n * (n*n-1));
};

// Compute the distance correlation of two arrays of numbers.
// http://en.wikipedia.org/wiki/Distance_correlation
stats.cor.dist = function(values, a, b) {
  var X = b ? values.map(a) : values,
      Y = b ? values.map(b) : a;

  var A = stats.dist.mat(X),
      B = stats.dist.mat(Y),
      n = A.length,
      i, aa, bb, ab;

  for (i=0, aa=0, bb=0, ab=0; i<n; ++i) {
    aa += A[i]*A[i];
    bb += B[i]*B[i];
    ab += A[i]*B[i];
  }

  return Math.sqrt(ab / Math.sqrt(aa*bb));
};

// Compute the vector distance between two arrays of numbers.
// Default is Euclidean (exp=2) distance, configurable via exp argument.
stats.dist = function(values, a, b, exp) {
  var f = util.isFunction(b),
      X = values,
      Y = f ? values : a,
      e = f ? exp : b,
      n = values.length, s = 0, d, i;

  if (e === 2 || e === undefined) {
    for (i=0; i<n; ++i) {
      d = f ? (a(X[i])-b(Y[i])) : (X[i]-Y[i]);
      s += d*d;
    }
    return Math.sqrt(s); 
  } else {
    for (i=0; i<n; ++i) {
      d = Math.abs(f ? (a(X[i])-b(Y[i])) : (X[i]-Y[i]));
      s += Math.pow(d, e);
    }
    return Math.pow(s, 1/e);
  }
};

// Construct a mean-centered distance matrix for an array of numbers.
stats.dist.mat = function(X) {
  var n = X.length,
      m = n*n,
      A = Array(m),
      R = gen.zeros(n),
      M = 0, v, i, j;

  for (i=0; i<n; ++i) {
    A[i*n+i] = 0;
    for (j=i+1; j<n; ++j) {
      A[i*n+j] = (v = Math.abs(X[i] - X[j]));
      A[j*n+i] = v;
      R[i] += v;
      R[j] += v;
    }
  }

  for (i=0; i<n; ++i) {
    M += R[i];
    R[i] /= n;
  }
  M /= m;

  for (i=0; i<n; ++i) {
    for (j=i; j<n; ++j) {
      A[i*n+j] += M - R[i] - R[j];
      A[j*n+i] = A[i*n+j];
    }
  }

  return A;
};

// Compute the Shannon entropy (log base 2) of an array of counts.
stats.entropy = function(counts, f) {
  var i, p, s = 0, H = 0, N = counts.length;
  for (i=0; i<N; ++i) {
    s += (f ? f(counts[i]) : counts[i]);
  }
  if (s === 0) return 0;
  for (i=0; i<N; ++i) {
    p = (f ? f(counts[i]) : counts[i]) / s;
    if (p > 0) H += p * Math.log(p) / Math.LN2;
  }
  return -H;
};

// Compute the normalized Shannon entropy (log base 2) of an array of counts.
stats.entropy.normalized = function(counts, f) {
  var H = stats.entropy(counts, f);
  return H===0 ? 0 : H * Math.LN2 / Math.log(counts.length);
};

// Compute the mutual information between two discrete variables.
// http://en.wikipedia.org/wiki/Mutual_information
stats.entropy.mutual = function(values, a, b, counts) {
  var x = counts ? values.map(a) : values,
      y = counts ? values.map(b) : a,
      z = counts ? values.map(counts) : b;

  var px = {},
	    py = {},
	    i, xx, yy, zz, s = 0, t, N = z.length, p, I = 0;

	for (i=0; i<N; ++i) {
	  px[x[i]] = 0;
	  py[y[i]] = 0;
  }

	for (i=0; i<N; ++i) {
		px[x[i]] += z[i];
		py[y[i]] += z[i];
		s += z[i];
	}

	t = 1 / (s * Math.LN2);
	for (i=0; i<N; ++i) {
		if (z[i] === 0) continue;
		p = (s * z[i]) / (px[x[i]] * py[y[i]]);
		I += z[i] * t * Math.log(p);
	}

	return I;
};

// Compute a profile of summary statistics for a variable.
stats.profile = function(values, f) {
  var p = {},
      mean = 0,
      count = 0,
      distinct = 0,
      min = null,
      max = null,
      M2 = 0,
      vals = [],
      u = {}, delta, sd, i, v, x, half, h, h2;

  // compute summary stats
  for (i=0, c=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];

    // update unique values
    u[v] = (v in u) ? u[v] + 1 : (distinct += 1, 1);

    if (util.isNotNull(v)) {
      // update min/max
      if (min===null || v < min) min = v;
      if (max===null || v > max) max = v;
      // update stats
      x = (typeof v === 'string') ? v.length : v;
      delta = x - mean;
      mean = mean + delta / (++count);
      M2 = M2 + delta * (x - mean);
      vals.push(x);
    }
  }
  M2 = M2 / (count - 1);
  sd = Math.sqrt(M2);

  // sort values for median and iqr
  vals.sort(util.cmp);

  return {
    unique:   u,
    count:    count,
    nulls:    values.length - count,
    distinct: distinct,
    min:      min,
    max:      max,
    mean:     mean,
    stdev:    sd,
    median:   (v = stats.quantile(vals, 0.5)),
    modeskew: sd === 0 ? 0 : (mean - v) / sd,
    iqr:      [stats.quantile(vals, 0.25), stats.quantile(vals, 0.75)]
  };
};

module.exports = stats;
},{"./generate":6,"./util":9}],8:[function(require,module,exports){
var util = require('./util');
var stats = require('./stats');

// Compute profiles for all variables in a data set.
module.exports = function(data, fields) {
  if (data == null || data.length === 0) return null;
  fields = fields || util.keys(data[0]);

  var profiles = fields.map(function(f) {
    var p = stats.profile(data, util.accessor(f));
    return (p.field = f, p);
  });
  
  profiles.toString = printSummary;
  return profiles;
};

function printSummary() {
  var profiles = this;
  var str = [];
  profiles.forEach(function(p) {
    str.push("----- Field: '" + p.field + "' -----");
    if (typeof p.min === 'string' || p.distinct < 10) {
      str.push(printCategoricalProfile(p));
    } else {
      str.push(printQuantitativeProfile(p));
    }
    str.push("");
  });
  return str.join("\n");
}

function printQuantitativeProfile(p) {
  return [
    "distinct: " + p.distinct,
    "nulls:    " + p.nulls,
    "min:      " + p.min,
    "max:      " + p.max,
    "median:   " + p.median,
    "mean:     " + p.mean,
    "stdev:    " + p.stdev,
    "modeskew: " + p.modeskew
  ].join("\n");
}

function printCategoricalProfile(p) {
  var list = [
    "distinct: " + p.distinct,
    "nulls:    " + p.nulls,
    "top values: "
  ];
  var u = p.unique;
  var top = util.keys(u)
    .sort(function(a,b) { return u[b] - u[a]; })
    .slice(0, 6)
    .map(function(v) { return " '" + v + "' (" + u[v] + ")"; });
  return list.concat(top).join("\n");
}
},{"./stats":7,"./util":9}],9:[function(require,module,exports){
(function (process){
var Buffer = require('buffer').Buffer;
var u = module.exports = {};

// where are we?

u.isNode = typeof process !== 'undefined'
        && typeof process.stderr !== 'undefined';

// type checking functions

var toString = Object.prototype.toString;

u.isObject = function(obj) {
  return obj === Object(obj);
};

u.isFunction = function(obj) {
  return toString.call(obj) == '[object Function]';
};

u.isString = function(obj) {
  return toString.call(obj) == '[object String]';
};

u.isArray = Array.isArray || function(obj) {
  return toString.call(obj) == '[object Array]';
};

u.isNumber = function(obj) {
  return !isNaN(parseFloat(obj)) && isFinite(obj);
};

u.isBoolean = function(obj) {
  return toString.call(obj) == '[object Boolean]';
};

u.isDate = function(obj) {
  return toString.call(obj) == '[object Date]';
};

u.isNotNull = function(obj) {
  return obj != null && (typeof obj !== 'number' ? true : !isNaN(obj));
};

u.isBuffer = (Buffer && Buffer.isBuffer) || u.false;

// type coercion functions

u.number = function(s) { return s == null ? null : +s; };

u.boolean = function(s) { return s == null ? null : s==='false' ? false : !!s; };

u.date = function(s) { return s == null ? null : Date.parse(s); }

u.array = function(x) { return x != null ? (u.isArray(x) ? x : [x]) : []; };

u.str = function(x) {
  return u.isArray(x) ? "[" + x.map(u.str) + "]"
    : u.isObject(x) ? JSON.stringify(x)
    : u.isString(x) ? ("'"+util_escape_str(x)+"'") : x;
};

var escape_str_re = /(^|[^\\])'/g;

function util_escape_str(x) {
  return x.replace(escape_str_re, "$1\\'");
}

// utility functions

u.identity = function(x) { return x; };

u.true = function() { return true; };

u.false = function() { return false; };

u.duplicate = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

u.equal = function(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};

u.extend = function(obj) {
  for (var x, name, i=1, len=arguments.length; i<len; ++i) {
    x = arguments[i];
    for (name in x) { obj[name] = x[name]; }
  }
  return obj;
};

u.keys = function(x) {
  var keys = [], k;
  for (k in x) keys.push(k);
  return keys;
};

u.vals = function(x) {
  var vals = [], k;
  for (k in x) vals.push(x[k]);
  return vals;
};

u.toMap = function(list) {
  return list.reduce(function(obj, x) {
    return (obj[x] = 1, obj);
  }, {});
};

u.keystr = function(values) {
  // use to ensure consistent key generation across modules
  return values.join("|");
};

// data access functions

u.field = function(f) {
  return f.split("\\.")
    .map(function(d) { return d.split("."); })
    .reduce(function(a, b) {
      if (a.length) { a[a.length-1] += "." + b.shift(); }
      a.push.apply(a, b);
      return a;
    }, []);
};

u.accessor = function(f) {
  var s;
  return (u.isFunction(f) || f==null)
    ? f : u.isString(f) && (s=u.field(f)).length > 1
    ? function(x) { return s.reduce(function(x,f) {
          return x[f];
        }, x);
      }
    : function(x) { return x[f]; };
};

u.mutator = function(f) {
  var s;
  return u.isString(f) && (s=u.field(f)).length > 1
    ? function(x, v) {
        for (var i=0; i<s.length-1; ++i) x = x[s[i]];
        x[s[i]] = v;
      }
    : function(x, v) { x[f] = v; };
};


// comparison / sorting functions

u.comparator = function(sort) {
  var sign = [];
  if (sort === undefined) sort = [];
  sort = u.array(sort).map(function(f) {
    var s = 1;
    if      (f[0] === "-") { s = -1; f = f.slice(1); }
    else if (f[0] === "+") { s = +1; f = f.slice(1); }
    sign.push(s);
    return u.accessor(f);
  });
  return function(a,b) {
    var i, n, f, x, y;
    for (i=0, n=sort.length; i<n; ++i) {
      f = sort[i]; x = f(a); y = f(b);
      if (x < y) return -1 * sign[i];
      if (x > y) return sign[i];
    }
    return 0;
  };
};

u.cmp = function(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else if (a >= b) {
    return 0;
  } else if (a === null && b === null) {
    return 0;
  } else if (a === null) {
    return -1;
  } else if (b === null) {
    return 1;
  }
  return NaN;
};

u.numcmp = function(a, b) { return a - b; };

u.stablesort = function(array, sortBy, keyFn) {
  var indices = array.reduce(function(idx, v, i) {
    return (idx[keyFn(v)] = i, idx);
  }, {});

  array.sort(function(a, b) {
    var sa = sortBy(a),
        sb = sortBy(b);
    return sa < sb ? -1 : sa > sb ? 1
         : (indices[keyFn(a)] - indices[keyFn(b)]);
  });

  return array;
};


// string functions

// ES6 compatibility per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
// We could have used the polyfill code, but lets wait until ES6 becomes a standard first
u.startsWith = String.prototype.startsWith
  ? function(string, searchString) {
    return string.startsWith(searchString);
  }
  : function(string, searchString) {
    return string.lastIndexOf(searchString, 0) === 0;
  };

u.truncate = function(s, length, pos, word, ellipsis) {
  var len = s.length;
  if (len <= length) return s;
  ellipsis = ellipsis !== undefined ? String(ellipsis) : "…";
  var l = Math.max(0, length - ellipsis.length);

  switch (pos) {
    case "left":
      return ellipsis + (word ? truncateOnWord(s,l,1) : s.slice(len-l));
    case "middle":
    case "center":
      var l1 = Math.ceil(l/2), l2 = Math.floor(l/2);
      return (word ? truncateOnWord(s,l1) : s.slice(0,l1)) + ellipsis
        + (word ? truncateOnWord(s,l2,1) : s.slice(len-l2));
    default:
      return (word ? truncateOnWord(s,l) : s.slice(0,l)) + ellipsis;
  }
};

function truncateOnWord(s, len, rev) {
  var cnt = 0, tok = s.split(truncate_word_re);
  if (rev) {
    s = (tok = tok.reverse())
      .filter(function(w) { cnt += w.length; return cnt <= len; })
      .reverse();
  } else {
    s = tok.filter(function(w) { cnt += w.length; return cnt <= len; });
  }
  return s.length ? s.join("").trim() : tok[0].slice(0, len);
}

var truncate_word_re = /([\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF])/;

}).call(this,require('_process'))

},{"_process":3,"buffer":2}],10:[function(require,module,exports){
'use strict';

require('./globals');

var consts = require('./consts'),
  util = require('./util'),
  vlfield = require('./field'),
  vlenc = require('./enc'),
  schema = require('./schema/schema');

module.exports = (function() {
  function Encoding(marktype, enc, data, config, filter, theme) {
    var defaults = schema.instantiate();

    var spec = {
      data: data,
      marktype: marktype,
      enc: enc,
      config: config,
      filter: filter || []
    };

    // type to bitcode
    for (var e in defaults.enc) {
      defaults.enc[e].type = consts.dataTypes[defaults.enc[e].type];
    }

    var specExtended = schema.util.merge(defaults, theme || {}, spec) ;

    this._data = specExtended.data;
    this._marktype = specExtended.marktype;
    this._enc = specExtended.enc;
    this._config = specExtended.config;
    this._filter = specExtended.filter;
  }

  var proto = Encoding.prototype;

  proto.marktype = function() {
    return this._marktype;
  };

  proto.is = function(m) {
    return this._marktype === m;
  };

  proto.has = function(encType) {
    // equivalent to calling vlenc.has(this._enc, encType)
    return this._enc[encType].name !== undefined;
  };

  proto.enc = function(et) {
    return this._enc[et];
  };

  proto.filter = function() {
    var filterNull = [],
      fields = this.fields(),
      self = this;

    util.forEach(fields, function(fieldList, fieldName) {
      if (fieldName === '*') return; //count

      if ((self.config('filterNull').Q && fieldList.containsType[Q]) ||
          (self.config('filterNull').T && fieldList.containsType[T]) ||
          (self.config('filterNull').O && fieldList.containsType[O])) {
        filterNull.push({
          operands: [fieldName],
          operator: 'notNull'
        });
      }
    });

    return filterNull.concat(this._filter);
  };

  // get "field" property for vega
  proto.field = function(et, nodata, nofn) {
    if (!this.has(et)) return null;

    var f = (nodata ? '' : 'data.');

    if (vlfield.isCount(this._enc[et])) {
      return f + 'count';
    } else if (!nofn && this._enc[et].bin) {
      return f + 'bin_' + this._enc[et].name;
    } else if (!nofn && this._enc[et].aggr) {
      return f + this._enc[et].aggr + '_' + this._enc[et].name;
    } else if (!nofn && this._enc[et].fn) {
      return f + this._enc[et].fn + '_' + this._enc[et].name;
    } else {
      return f + this._enc[et].name;
    }
  };

  proto.fieldName = function(et) {
    return this._enc[et].name;
  };

  /*
   * return key-value pairs of field name and list of fields of that field name
   */
  proto.fields = function() {
    return vlenc.fields(this._enc);
  };

  proto.fieldTitle = function(et) {
    if (vlfield.isCount(this._enc[et])) {
      return vlfield.count.displayName;
    }
    var fn = this._enc[et].aggr || this._enc[et].fn || (this._enc[et].bin && "bin");
    if (fn) {
      return fn.toUpperCase() + '(' + this._enc[et].name + ')';
    } else {
      return this._enc[et].name;
    }
  };

  proto.scale = function(et) {
    return this._enc[et].scale || {};
  };

  proto.axis = function(et) {
    return this._enc[et].axis || {};
  };

  proto.band = function(et) {
    return this._enc[et].band || {};
  };

  proto.bandSize = function(encType, useSmallBand) {
    useSmallBand = useSmallBand ||
      //isBandInSmallMultiples
      (encType === Y && this.has(ROW) && this.has(Y)) ||
      (encType === X && this.has(COL) && this.has(X));

    // if band.size is explicitly specified, follow the specification, otherwise draw value from config.
    return this.band(encType).size ||
      this.config(useSmallBand ? 'smallBandSize' : 'largeBandSize');
  };

  proto.aggr = function(et) {
    return this._enc[et].aggr;
  };

  // returns false if binning is disabled, otherwise an object with binning properties
  proto.bin = function(et) {
    var bin = this._enc[et].bin;
    if (bin === {})
      return false;
    if (bin === true)
      return {
        maxbins: schema.MAXBINS_DEFAULT
      };
    return bin;
  };

  proto.legend = function(et) {
    return this._enc[et].legend;
  };

  proto.value = function(et) {
    return this._enc[et].value;
  };

  proto.fn = function(et) {
    return this._enc[et].fn;
  };

  proto.sort = function(et, stats) {
    var sort = this._enc[et].sort,
      enc = this._enc,
      isType = vlfield.isType.byCode;

    // console.log('sort:', sort, 'support:', Encoding.toggleSort.support({enc:this._enc}, stats) , 'toggle:', this.config('toggleSort'))

    if ((!sort || sort.length===0) &&
        Encoding.toggleSort.support({enc:this._enc}, stats, true) && //HACK
        this.config('toggleSort') === 'Q'
      ) {
      var qField = isType(enc.x, O) ? enc.y : enc.x;

      if (isType(enc[et], O)) {
        sort = [{
          name: qField.name,
          aggr: qField.aggr,
          type: qField.type,
          reverse: true
        }];
      }
    }

    return sort;
  };

  proto.length = function() {
    return util.keys(this._enc).length;
  };

  proto.map = function(f) {
    return vlenc.map(this._enc, f);
  };

  proto.reduce = function(f, init) {
    return vlenc.reduce(this._enc, f, init);
  };

  proto.forEach = function(f) {
    return vlenc.forEach(this._enc, f);
  };

  proto.type = function(et) {
    return this.has(et) ? this._enc[et].type : null;
  };

  proto.role = function(et) {
    return this.has(et) ? vlfield.role(this._enc[et]) : null;
  };

  proto.text = function(prop) {
    var text = this._enc[TEXT].text;
    return prop ? text[prop] : text;
  };

  proto.font = function(prop) {
    var font = this._enc[TEXT].font;
    return prop ? font[prop] : font;
  };

  proto.isType = function(et, type) {
    var field = this.enc(et);
    return field && Encoding.isType(field, type);
  };

  Encoding.isType = function (fieldDef, type) {
    // FIXME vlfield.isType
    return (fieldDef.type & type) > 0;
  };

  Encoding.isOrdinalScale = function(encoding, encType) {
    return vlfield.isOrdinalScale(encoding.enc(encType), true);
  };

  Encoding.isDimension = function(encoding, encType) {
    return vlfield.isDimension(encoding.enc(encType), true);
  };

  Encoding.isMeasure = function(encoding, encType) {
    return vlfield.isMeasure(encoding.enc(encType), true);
  };

  proto.isOrdinalScale = function(encType) {
    return this.has(encType) && Encoding.isOrdinalScale(this, encType);
  };

  proto.isDimension = function(encType) {
    return this.has(encType) && Encoding.isDimension(this, encType);
  };

  proto.isMeasure = function(encType) {
    return this.has(encType) && Encoding.isMeasure(this, encType);
  };

  proto.isAggregate = function() {
    return vlenc.isAggregate(this._enc);
  };

  Encoding.isAggregate = function(spec) {
    return vlenc.isAggregate(spec.enc);
  };

  Encoding.alwaysNoOcclusion = function(spec) {
    // FIXME raw OxQ with # of rows = # of O
    return vlenc.isAggregate(spec.enc);
  };

  Encoding.isStack = function(spec) {
    // FIXME update this once we have control for stack ...
    return (spec.marktype === 'bar' || spec.marktype === 'area') &&
      spec.enc.color;
  };

  proto.isStack = function() {
    // FIXME update this once we have control for stack ...
    return (this.is('bar') || this.is('area')) && this.has('color');
  };

  proto.cardinality = function(encType, stats) {
    return vlfield.cardinality(this.enc(encType), stats, this.config('filterNull'), true);
  };

  proto.isRaw = function() {
    return !this.isAggregate();
  };

  proto.data = function(name) {
    return this._data[name];
  };

   // returns whether the encoding has values embedded
  proto.hasValues = function() {
    var vals = this.data('values');
    return vals && vals.length;
  };

  proto.config = function(name) {
    return this._config[name];
  };

  proto.toSpec = function(excludeConfig, excludeData) {
    var enc = util.duplicate(this._enc),
      spec;

    // convert type's bitcode to type name
    for (var e in enc) {
      enc[e].type = consts.dataTypeNames[enc[e].type];
    }

    spec = {
      marktype: this._marktype,
      enc: enc,
      filter: this._filter
    };

    if (!excludeConfig) {
      spec.config = util.duplicate(this._config);
    }

    if (!excludeData) {
      spec.data = util.duplicate(this._data);
    }

    // remove defaults
    var defaults = schema.instantiate();
    return schema.util.subtract(spec, defaults);
  };

  proto.toShorthand = function() {
    var c = consts.shorthand;
    return 'mark' + c.assign + this._marktype +
      c.delim + vlenc.shorthand(this._enc);
  };

  Encoding.shorthand = function (spec) {
    var c = consts.shorthand;
    return 'mark' + c.assign + spec.marktype +
      c.delim + vlenc.shorthand(spec.enc);
  };

  Encoding.fromShorthand = function(shorthand, data, config, theme) {
    var c = consts.shorthand,
        split = shorthand.split(c.delim),
        marktype = split.shift().split(c.assign)[1].trim(),
        enc = vlenc.fromShorthand(split, true);

    return new Encoding(marktype, enc, data, config, null, theme);
  };

  Encoding.specFromShorthand = function(shorthand, data, config, excludeConfig) {
    return Encoding.fromShorthand(shorthand, data, config).toSpec(excludeConfig);
  };

  Encoding.fromSpec = function(spec, theme) {
    var enc = util.duplicate(spec.enc || {});

    //convert type from string to bitcode (e.g, O=1)
    for (var e in enc) {
      enc[e].type = consts.dataTypes[enc[e].type];
    }

    return new Encoding(spec.marktype, enc, spec.data, spec.config, spec.filter, theme);
  };

  Encoding.transpose = function(spec) {
    var oldenc = spec.enc,
      enc = util.duplicate(spec.enc);
    enc.x = oldenc.y;
    enc.y = oldenc.x;
    enc.row = oldenc.col;
    enc.col = oldenc.row;
    spec.enc = enc;
    return spec;
  };

  Encoding.toggleSort = function(spec) {
    spec.config = spec.config || {};
    spec.config.toggleSort = spec.config.toggleSort === 'Q' ? 'O' :'Q';
    return spec;
  };


  Encoding.toggleSort.direction = function(spec, useTypeCode) {
    if (!Encoding.toggleSort.support(spec, useTypeCode)) { return; }
    var enc = spec.enc;
    return enc.x.type === 'O' ? 'x' :  'y';
  };

  Encoding.toggleSort.mode = function(spec) {
    return spec.config.toggleSort;
  };

  Encoding.toggleSort.support = function(spec, stats, useTypeCode) {
    var enc = spec.enc,
      isType = vlfield.isType.get(useTypeCode);

    if (vlenc.has(enc, ROW) || vlenc.has(enc, COL) ||
      !vlenc.has(enc, X) || !vlenc.has(enc, Y) ||
      !Encoding.alwaysNoOcclusion(spec, stats)) {
      return false;
    }

    return ( isType(enc.x, O) && vlfield.isMeasure(enc.y, useTypeCode)) ? 'x' :
      ( isType(enc.y, O) && vlfield.isMeasure(enc.x, useTypeCode)) ? 'y' : false;
  };

  Encoding.toggleFilterNullO = function(spec) {
    spec.config = spec.config || {};
    spec.config.filterNull = spec.config.filterNull || { //FIXME
      T: true,
      Q: true
    };
    spec.config.filterNull.O = !spec.config.filterNull.O;
    return spec;
  };

  Encoding.toggleFilterNullO.support = function(spec, stats) {
    var fields = vlenc.fields(spec.enc);
    for (var fieldName in fields) {
      var fieldList = fields[fieldName];
      if (fieldList.containsType.O && fieldName in stats && stats[fieldName].nulls > 0) {
        return true;
      }
    }
    return false;
  };

  return Encoding;
})();

},{"./consts":28,"./enc":30,"./field":31,"./globals":32,"./schema/schema":33,"./util":35}],11:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util');

module.exports = aggregates;

function aggregates(spec, encoding, opt) {
  opt = opt || {};

  var dims = {}, meas = {}, detail = {}, facets = {},
    data = spec.data[1]; // currently data[0] is raw and data[1] is table

  encoding.forEach(function(field, encType) {
    if (field.aggr) {
      if (field.aggr === 'count') {
        meas.count = {op: 'count', field: '*'};
      }else {
        meas[field.aggr + '|'+ field.name] = {
          op: field.aggr,
          field: 'data.'+ field.name
        };
      }
    } else {
      dims[field.name] = encoding.field(encType);
      if (encType == ROW || encType == COL) {
        facets[field.name] = dims[field.name];
      }else if (encType !== X && encType !== Y) {
        detail[field.name] = dims[field.name];
      }
    }
  });
  dims = util.vals(dims);
  meas = util.vals(meas);

  if (meas.length > 0) {
    if (!data.transform) data.transform = [];
    data.transform.push({
      type: 'aggregate',
      groupby: dims,
      fields: meas
    });
  }
  return {
    details: util.vals(detail),
    dims: dims,
    facets: util.vals(facets),
    aggregated: meas.length > 0
  };
}

},{"../globals":32,"../util":35}],12:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util'),
  setter = util.setter,
  getter = util.getter,
  time = require('./time');

var axis = module.exports = {};

axis.names = function(props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    var s = props[x].scale;
    if (s === X || s === Y) a[props[x].scale] = 1;
    return a;
  }, {}));
};

axis.defs = function(names, encoding, layout, stats, opt) {
  return names.reduce(function(a, name) {
    a.push(axis.def(name, encoding, layout, stats, opt));
    return a;
  }, []);
};

axis.def = function(name, encoding, layout, stats, opt) {
  var type = name;
  var isCol = name == COL, isRow = name == ROW;
  var rowOffset = axisTitleOffset(encoding, layout, Y) + 20,
    cellPadding = layout.cellPadding;


  if (isCol) type = 'x';
  if (isRow) type = 'y';

  var def = {
    type: type,
    scale: name
  };

  if (encoding.axis(name).grid) {
    def.grid = true;
    def.layer = (isRow || isCol) ? 'front' :  'back';

    if (isCol) {
      // set grid property -- put the lines on the right the cell
      setter(def, ['properties', 'grid'], {
        x: {
          offset: layout.cellWidth * (1+ cellPadding/2.0),
          // default value(s) -- vega doesn't do recursive merge
          scale: 'col'
        },
        y: {
          value: -layout.cellHeight * (cellPadding/2),
        },
        stroke: { value: encoding.config('cellGridColor') },
        opacity: { value: encoding.config('cellGridOpacity') }
      });
    } else if (isRow) {
      // set grid property -- put the lines on the top
      setter(def, ['properties', 'grid'], {
        y: {
          offset: -layout.cellHeight * (cellPadding/2),
          // default value(s) -- vega doesn't do recursive merge
          scale: 'row'
        },
        x: {
          value: rowOffset
        },
        x2: {
          offset: rowOffset + (layout.cellWidth * 0.05),
          // default value(s) -- vega doesn't do recursive merge
          group: "mark.group.width",
          mult: 1
        },
        stroke: { value: encoding.config('cellGridColor') },
        opacity: { value: encoding.config('cellGridOpacity') }
      });
    } else {
      setter(def, ['properties', 'grid'], {
        stroke: { value: encoding.config('gridColor') },
        opacity: { value: encoding.config('gridOpacity') }
      });
    }
  }

  if (encoding.axis(name).title) {
    def = axis_title(def, name, encoding, layout, opt);
  }

  if (isRow || isCol) {
    setter(def, ['properties', 'ticks'], {
      opacity: {value: 0}
    });
    setter(def, ['properties', 'majorTicks'], {
      opacity: {value: 0}
    });
    setter(def, ['properties', 'axis'], {
      opacity: {value: 0}
    });
  }

  if (isCol) {
    def.orient = 'top';
  }

  if (isRow) {
    def.offset = rowOffset;
  }

  if (name == X) {
    if (encoding.has(Y) && encoding.isOrdinalScale(Y) && encoding.cardinality(Y, stats) > 30) {
      def.orient = 'top';
    }

    if (encoding.isDimension(X) || encoding.isType(X, T)) {
      setter(def, ['properties','labels'], {
        angle: {value: 270},
        align: {value: 'right'},
        baseline: {value: 'middle'}
      });
    } else { // Q
      def.ticks = 5;
    }
  }

  def = axis_labels(def, name, encoding, layout, opt);

  return def;
};

function axis_title(def, name, encoding, layout, opt) {
  // jshint unused:false

  var maxlength = null,
    fieldTitle = encoding.fieldTitle(name);
  if (name===X) {
    maxlength = layout.cellWidth / encoding.config('characterWidth');
  } else if (name === Y) {
    maxlength = layout.cellHeight / encoding.config('characterWidth');
  }

  def.title = maxlength ? util.truncate(fieldTitle, maxlength) : fieldTitle;

  if (name === ROW) {
    setter(def, ['properties','title'], {
      angle: {value: 0},
      align: {value: 'right'},
      baseline: {value: 'middle'},
      dy: {value: (-layout.height/2) -20}
    });
  }

  def.titleOffset = axisTitleOffset(encoding, layout, name);
  return def;
}

function axis_labels(def, name, encoding, layout, opt) {
  // jshint unused:false

  var fn;
  // add custom label for time type
  if (encoding.isType(name, T) && (fn = encoding.fn(name)) && (time.hasScale(fn))) {
    setter(def, ['properties','labels','text','scale'], 'time-'+ fn);
  }

  var textTemplatePath = ['properties','labels','text','template'];
  if (encoding.axis(name).format) {
    def.format = encoding.axis(name).format;
  } else if (encoding.isType(name, Q)) {
    setter(def, textTemplatePath, "{{data | number:'.3s'}}");
  } else if (encoding.isType(name, T) && !encoding.fn(name)) {
    setter(def, textTemplatePath, "{{data | time:'%Y-%m-%d'}}");
  } else if (encoding.isType(name, T) && encoding.fn(name) === 'year') {
    setter(def, textTemplatePath, "{{data | number:'d'}}");
  } else if (encoding.isType(name, O) && encoding.axis(name).maxLabelLength) {
    setter(def, textTemplatePath, '{{data | truncate:' + encoding.axis(name).maxLabelLength + '}}');
  }

  return def;
}

function axisTitleOffset(encoding, layout, name) {
  var value = encoding.axis(name).titleOffset;
  if (value) {
    return value;
  }
  switch (name) {
    case ROW: return 0;
    case COL: return 35;
  }
  return getter(layout, [name, 'axisTitleOffset']);
}

},{"../globals":32,"../util":35,"./time":27}],13:[function(require,module,exports){
'use strict';

require('../globals');

module.exports = binning;

function binning(spec, encoding, opt) {
  opt = opt || {};

  if (!spec.transform) spec.transform = [];

  encoding.forEach(function(field, encType) {
    if (encoding.bin(encType)) {
      spec.transform.push({
        type: 'bin',
        field: 'data.' + field.name,
        output: 'data.bin_' + field.name,
        maxbins: encoding.bin(encType).maxbins
      });
    }
  });
}

},{"../globals":32}],14:[function(require,module,exports){
'use strict';

var summary = module.exports = require('datalib/src/summary');

require('../globals');

module.exports = compile;

var Encoding = require('../Encoding'),
  axis = compile.axis = require('./axis'),
  filter = compile.filter = require('./filter'),
  legend = compile.legend = require('./legend'),
  marks = compile.marks = require('./marks'),
  scale = compile.scale = require('./scale');

compile.aggregate = require('./aggregate');
compile.bin = require('./bin');
compile.facet = require('./facet');
compile.group = require('./group');
compile.layout = require('./layout');
compile.sort = require('./sort');
compile.stack = require('./stack');
compile.style = require('./style');
compile.subfacet = require('./subfacet');
compile.template = require('./template');
compile.time = require('./time');

function compile(spec, stats, theme) {
  return compile.encoding(Encoding.fromSpec(spec, theme), stats);
}

compile.shorthand = function (shorthand, stats, config, theme) {
  return compile.encoding(Encoding.fromShorthand(shorthand, config, theme), stats);
};

compile.encoding = function (encoding, stats) {
  // no need to pass stats if you pass in the data
  if (!stats && encoding.hasValues()) {
    stats = summary(encoding.data('values')).reduce(function(s, p) {
      s[p.field] = p;
      return s;
    }, {});
  }

  var layout = compile.layout(encoding, stats),
    style = compile.style(encoding, stats),
    spec = compile.template(encoding, layout, stats),
    group = spec.marks[0],
    mark = marks[encoding.marktype()],
    mdefs = marks.def(mark, encoding, layout, style),
    mdef = mdefs[0];  // TODO: remove this dirty hack by refactoring the whole flow

  filter.addFilters(spec, encoding);
  var sorting = compile.sort(spec, encoding, stats);

  var hasRow = encoding.has(ROW), hasCol = encoding.has(COL);

  for (var i = 0; i < mdefs.length; i++) {
    group.marks.push(mdefs[i]);
  }

  compile.bin(spec.data[1], encoding);

  var lineType = marks[encoding.marktype()].line;

  spec = compile.time(spec, encoding);

  // handle subfacets
  var aggResult = compile.aggregate(spec, encoding),
    details = aggResult.details,
    hasDetails = details && details.length > 0,
    stack = hasDetails && compile.stack(spec, encoding, mdef, aggResult.facets);

  if (hasDetails && (stack || lineType)) {
    //subfacet to group stack / line together in one group
    compile.subfacet(group, mdef, details, stack, encoding);
  }

  // auto-sort line/area values
  //TODO(kanitw): have some config to turn off auto-sort for line (for line chart that encodes temporal information)
  if (lineType) {
    var f = (encoding.isMeasure(X) && encoding.isDimension(Y)) ? Y : X;
    if (!mdef.from) mdef.from = {};
    // TODO: why - ?
    mdef.from.transform = [{type: 'sort', by: '-' + encoding.field(f)}];
  }

  // Small Multiples
  if (hasRow || hasCol) {
    spec = compile.facet(group, encoding, layout, style, sorting, spec, mdef, stack, stats);
    spec.legends = legend.defs(encoding);
  } else {
    group.scales = scale.defs(scale.names(mdef.properties.update), encoding, layout, style, sorting,
      {stack: stack, stats: stats});
    group.axes = axis.defs(axis.names(mdef.properties.update), encoding, layout, stats);
    group.legends = legend.defs(encoding);
  }

  filter.filterLessThanZero(spec, encoding);

  return spec;
};


},{"../Encoding":10,"../globals":32,"./aggregate":11,"./axis":12,"./bin":13,"./facet":15,"./filter":16,"./group":17,"./layout":18,"./legend":19,"./marks":20,"./scale":21,"./sort":22,"./stack":23,"./style":24,"./subfacet":25,"./template":26,"./time":27,"datalib/src/summary":8}],15:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util');

var axis = require('./axis'),
  groupdef = require('./group').def,
  scale = require('./scale');

module.exports = faceting;

function faceting(group, encoding, layout, style, sorting, spec, mdef, stack, stats) {
  var enter = group.properties.enter;
  var facetKeys = [], cellAxes = [], from, axesGrp;

  var hasRow = encoding.has(ROW), hasCol = encoding.has(COL);

  enter.fill = {value: encoding.config('cellBackgroundColor')};

  //move "from" to cell level and add facet transform
  group.from = {data: group.marks[0].from.data};

  // Hack, this needs to be refactored
  for (var i = 0; i < group.marks.length; i++) {
    var mark = group.marks[i];
    if (mark.from.transform) {
      delete mark.from.data; //need to keep transform for subfacetting case
    } else {
      delete mark.from;
    }
  }

  if (hasRow) {
    if (!encoding.isDimension(ROW)) {
      util.error('Row encoding should be ordinal.');
    }
    enter.y = {scale: ROW, field: 'keys.' + facetKeys.length};
    enter.height = {'value': layout.cellHeight}; // HACK

    facetKeys.push(encoding.field(ROW));

    if (hasCol) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', keys: [encoding.field(COL)]});
    }

    axesGrp = groupdef('x-axes', {
        axes: encoding.has(X) ? axis.defs(['x'], encoding, layout, stats) : undefined,
        x: hasCol ? {scale: COL, field: 'keys.0'} : {value: 0},
        width: hasCol && {'value': layout.cellWidth}, //HACK?
        from: from
      });

    spec.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (spec.axes = spec.axes || []);
    spec.axes.push.apply(spec.axes, axis.defs(['row'], encoding, layout, stats));
  } else { // doesn't have row
    if (encoding.has(X)) {
      //keep x axis in the cell
      cellAxes.push.apply(cellAxes, axis.defs(['x'], encoding, layout, stats));
    }
  }

  if (hasCol) {
    if (!encoding.isDimension(COL)) {
      util.error('Col encoding should be ordinal.');
    }
    enter.x = {scale: COL, field: 'keys.' + facetKeys.length};
    enter.width = {'value': layout.cellWidth}; // HACK

    facetKeys.push(encoding.field(COL));

    if (hasRow) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', keys: [encoding.field(ROW)]});
    }

    axesGrp = groupdef('y-axes', {
      axes: encoding.has(Y) ? axis.defs(['y'], encoding, layout, stats) : undefined,
      y: hasRow && {scale: ROW, field: 'keys.0'},
      x: hasRow && {value: 0},
      height: hasRow && {'value': layout.cellHeight}, //HACK?
      from: from
    });

    spec.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (spec.axes = spec.axes || []);
    spec.axes.push.apply(spec.axes, axis.defs(['col'], encoding, layout, stats));
  } else { // doesn't have col
    if (encoding.has(Y)) {
      cellAxes.push.apply(cellAxes, axis.defs(['y'], encoding, layout, stats));
    }
  }

  // assuming equal cellWidth here
  // TODO: support heterogenous cellWidth (maybe by using multiple scales?)
  spec.scales = (spec.scales || []).concat(scale.defs(
    scale.names(enter).concat(scale.names(mdef.properties.update)),
    encoding,
    layout,
    style,
    sorting,
    {stack: stack, facet: true, stats: stats}
  )); // row/col scales + cell scales

  if (cellAxes.length > 0) {
    group.axes = cellAxes;
  }

  // add facet transform
  var trans = (group.from.transform || (group.from.transform = []));
  trans.unshift({type: 'facet', keys: facetKeys});

  return spec;
}

},{"../globals":32,"../util":35,"./axis":12,"./group":17,"./scale":21}],16:[function(require,module,exports){
'use strict';

require('../globals');

var filter = module.exports = {};

var BINARY = {
  '>':  true,
  '>=': true,
  '=':  true,
  '!=': true,
  '<':  true,
  '<=': true
};

filter.addFilters = function(spec, encoding) {
  var filters = encoding.filter(),
    data = spec.data[0];  // apply filters to raw data before aggregation

  if (!data.transform)
    data.transform = [];

  // add custom filters
  for (var i in filters) {
    var filter = filters[i];

    var condition = '';
    var operator = filter.operator;
    var operands = filter.operands;

    if (BINARY[operator]) {
      // expects a field and a value
      if (operator === '=') {
        operator = '==';
      }

      var op1 = operands[0];
      var op2 = operands[1];
      condition = 'd.data.' + op1 + operator + op2;
    } else if (operator === 'notNull') {
      // expects a number of fields
      for (var j in operands) {
        condition += 'd.data.' + operands[j] + '!==null';
        if (j < operands.length - 1) {
          condition += ' && ';
        }
      }
    } else {
      console.warn('Unsupported operator: ', operator);
    }

    data.transform.push({
      type: 'filter',
      test: condition
    });
  }
};

// remove less than 0 values if we use log function
filter.filterLessThanZero = function(spec, encoding) {
  encoding.forEach(function(field, encType) {
    if (encoding.scale(encType).type === 'log') {
      spec.data[1].transform.push({
        type: 'filter',
        test: 'd.' + encoding.field(encType) + '>0'
      });
    }
  });
};


},{"../globals":32}],17:[function(require,module,exports){
'use strict';

module.exports = {
  def: groupdef
};

function groupdef(name, opt) {
  opt = opt || {};
  return {
    _name: name || undefined,
    type: 'group',
    from: opt.from,
    properties: {
      enter: {
        x: opt.x || undefined,
        y: opt.y || undefined,
        width: opt.width || {group: 'width'},
        height: opt.height || {group: 'height'}
      }
    },
    scales: opt.scales || undefined,
    axes: opt.axes || undefined,
    marks: opt.marks || []
  };
}

},{}],18:[function(require,module,exports){
'use strict';

require('../globals');

var util = require('../util'),
  setter = util.setter;

module.exports = vllayout;

function vllayout(encoding, stats) {
  var layout = box(encoding, stats);
  layout = offset(encoding, stats, layout);
  return layout;
}

/*
  HACK to set chart size
  NOTE: this fails for plots driven by derived values (e.g., aggregates)
  One solution is to update Vega to support auto-sizing
  In the meantime, auto-padding (mostly) does the trick
 */
function box(encoding, stats) {
  var hasRow = encoding.has(ROW),
      hasCol = encoding.has(COL),
      hasX = encoding.has(X),
      hasY = encoding.has(Y),
      marktype = encoding.marktype();

  // FIXME/HACK we need to take filter into account
  var xCardinality = hasX && encoding.isDimension(X) ? encoding.cardinality(X, stats) : 1,
    yCardinality = hasY && encoding.isDimension(Y) ? encoding.cardinality(Y, stats) : 1;

  var useSmallBand = xCardinality > encoding.config('largeBandMaxCardinality') ||
    yCardinality > encoding.config('largeBandMaxCardinality');

  var cellWidth, cellHeight, cellPadding = encoding.config('cellPadding');

  // set cellWidth
  if (hasX) {
    if (encoding.isOrdinalScale(X)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellWidth = (xCardinality + encoding.band(X).padding) * encoding.bandSize(X, useSmallBand);
    } else {
      cellWidth = hasCol || hasRow ? encoding.enc(COL).width :  encoding.config("singleWidth");
    }
  } else {
    if (marktype === TEXT) {
      cellWidth = encoding.config('textCellWidth');
    } else {
      cellWidth = encoding.bandSize(X);
    }
  }

  // set cellHeight
  if (hasY) {
    if (encoding.isOrdinalScale(Y)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellHeight = (yCardinality + encoding.band(Y).padding) * encoding.bandSize(Y, useSmallBand);
    } else {
      cellHeight = hasCol || hasRow ? encoding.enc(ROW).height :  encoding.config("singleHeight");
    }
  } else {
    cellHeight = encoding.bandSize(Y);
  }

  // Cell bands use rangeBands(). There are n-1 padding.  Outerpadding = 0 for cells

  var width = cellWidth, height = cellHeight;
  if (hasCol) {
    var colCardinality = encoding.cardinality(COL, stats);
    width = cellWidth * ((1 + cellPadding) * (colCardinality - 1) + 1);
  }
  if (hasRow) {
    var rowCardinality =  encoding.cardinality(ROW, stats);
    height = cellHeight * ((1 + cellPadding) * (rowCardinality - 1) + 1);
  }

  return {
    // width and height of the whole cell
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    cellPadding: cellPadding,
    // width and height of the chart
    width: width,
    height: height,
    // information about x and y, such as band size
    x: {useSmallBand: useSmallBand},
    y: {useSmallBand: useSmallBand}
  };
}

function getMaxLength(encoding, stats, et) {
  // FIXME determine constant for Q and T in a nicer way
  return encoding.isType(et, Q) ? 20 :
    encoding.isType(et, T) ? 20 :
    stats[encoding.fieldName(et)].max;
}

function offset(encoding, stats, layout) {
  [X, Y].forEach(function (x) {
    var maxLength;
    if (encoding.isDimension(x) || encoding.isType(x, T)) {
      maxLength =  getMaxLength(encoding, stats, x);
    } else if (encoding.aggr(x) === 'count') {
      //assign default value for count as it won't have stats
      maxLength =  3;
    } else if (encoding.isType(x, Q)) {
      if (x===X) {
        maxLength = 3;
      } else { // Y
        //assume that default formating is always shorter than 7
        maxLength = Math.min(getMaxLength(encoding, stats, x), 7);
      }
    }
    setter(layout,[x, 'axisTitleOffset'], encoding.config('characterWidth') *  maxLength + 20);
  });
  return layout;
}

},{"../globals":32,"../util":35}],19:[function(require,module,exports){
'use strict';

require('../globals');

var time = require('./time');

var legend = module.exports = {};

legend.defs = function(encoding) {
  var defs = [];
  // TODO: support alpha

  if (encoding.has(COLOR) && encoding.legend(COLOR)) {
    defs.push(legend.def(COLOR, encoding, {
      fill: COLOR,
      orient: 'right'
    }));
  }

  if (encoding.has(SIZE) && encoding.legend(SIZE)) {
    defs.push(legend.def(SIZE, encoding, {
      size: SIZE,
      orient: defs.length === 1 ? 'left' : 'right'
    }));
  }

  if (encoding.has(SHAPE) && encoding.legend(SHAPE)) {
    if (defs.length === 2) {
      // TODO: fix this
      console.error('Vega-lite currently only supports two legends');
      return defs;
    }
    defs.push(legend.def(SHAPE, encoding, {
      shape: SHAPE,
      orient: defs.length === 1 ? 'left' : 'right'
    }));
  }

  return defs;
};

legend.def = function(name, encoding, props) {
  var def = props, fn;

  def.title = encoding.fieldTitle(name);

  if (encoding.isType(name, T) && (fn = encoding.fn(name)) &&
    time.hasScale(fn)) {
    var properties = def.properties = def.properties || {},
      labels = properties.labels = properties.labels || {},
      text = labels.text = labels.text || {};

    text.scale = 'time-'+ fn;
  }

  return def;
};

},{"../globals":32,"./time":27}],20:[function(require,module,exports){
'use strict';

require('../globals');

var marks = module.exports = {};

marks.def = function(mark, encoding, layout, style) {
  var defs = [];

  // to add a background to text, we need to add it before the text
  if (encoding.marktype() === TEXT && encoding.has(COLOR)) {
    var bg = {
      x: {value: 0},
      y: {value: 0},
      x2: {value: layout.cellWidth},
      y2: {value: layout.cellHeight},
      fill: {scale: COLOR, field: encoding.field(COLOR)}
    };
    defs.push({
      type: 'rect',
      from: {data: TABLE},
      properties: {enter: bg, update: bg}
    });
  }

  // add the mark def for the main thing
  var p = mark.prop(encoding, layout, style);
  defs.push({
    type: mark.type,
    from: {data: TABLE},
    properties: {enter: p, update: p}
  });

  return defs;
};

marks.bar = {
  type: 'rect',
  stack: true,
  prop: bar_props,
  requiredEncoding: ['x', 'y'],
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, size: 1, color: 1, alpha: 1}
};

marks.line = {
  type: 'line',
  line: true,
  prop: line_props,
  requiredEncoding: ['x', 'y'],
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, color: 1, alpha: 1, detail:1}
};

marks.area = {
  type: 'area',
  stack: true,
  line: true,
  requiredEncoding: ['x', 'y'],
  prop: area_props,
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, color: 1, alpha: 1}
};

marks.tick = {
  type: 'rect',
  prop: tick_props,
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, color: 1, alpha: 1, detail: 1}
};

marks.circle = {
  type: 'symbol',
  prop: filled_point_props('circle'),
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, size: 1, color: 1, alpha: 1, detail: 1}
};

marks.square = {
  type: 'symbol',
  prop: filled_point_props('square'),
  supportedEncoding: marks.circle.supportedEncoding
};

marks.point = {
  type: 'symbol',
  prop: point_props,
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, size: 1, color: 1, alpha: 1, shape: 1, detail: 1}
};

marks.text = {
  type: 'text',
  prop: text_props,
  requiredEncoding: ['text'],
  supportedEncoding: {row: 1, col: 1, size: 1, color: 1, alpha: 1, text: 1}
};

function bar_props(e, layout, style) {
  // jshint unused:false

  var p = {};

  // x
  if (e.isMeasure(X)) {
    p.x = {scale: X, field: e.field(X)};
    if (e.isDimension(Y)) {
      p.x2 = {scale: X, value: e.scale(X).type === 'log' ? 1 : 0};
    }
  } else if (e.has(X)) { // is ordinal
    p.xc = {scale: X, field: e.field(X)};
  } else {
    // TODO add single bar offset
    p.xc = {value: 0};
  }

  // y
  if (e.isMeasure(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
    p.y2 = {scale: Y, value: e.scale(Y).type === 'log' ? 1 : 0};
  } else if (e.has(Y)) { // is ordinal
    p.yc = {scale: Y, field: e.field(Y)};
  } else {
    // TODO add single bar offset
    p.yc = {group: 'height'};
  }

  // width
  if (!e.has(X) || e.isOrdinalScale(X)) { // no X or X is ordinal
    if (e.has(SIZE)) {
      p.width = {scale: SIZE, field: e.field(SIZE)};
    } else {
      p.width = {
        value: e.bandSize(X, layout.x.useSmallBand),
        offset: -1
      };
    }
  } else { // X is Quant or Time Scale
    p.width = {value: 2};
  }

  // height
  if (!e.has(Y) || e.isOrdinalScale(Y)) { // no Y or Y is ordinal
    if (e.has(SIZE)) {
      p.height = {scale: SIZE, field: e.field(SIZE)};
    } else {
      p.height = {
        value: e.bandSize(Y, layout.y.useSmallBand),
        offset: -1
      };
    }
  } else { // Y is Quant or Time Scale
    p.height = {value: 2};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else {
    p.fill = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  }

  return p;
}

function point_props(e, layout, style) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: e.bandSize(X, layout.x.useSmallBand) / 2};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {value: e.bandSize(Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (e.has(SIZE)) {
    p.size = {scale: SIZE, field: e.field(SIZE)};
  } else if (!e.has(SIZE)) {
    p.size = {value: e.value(SIZE)};
  }

  // shape
  if (e.has(SHAPE)) {
    p.shape = {scale: SHAPE, field: e.field(SHAPE)};
  } else if (!e.has(SHAPE)) {
    p.shape = {value: e.value(SHAPE)};
  }

  // stroke
  if (e.has(COLOR)) {
    p.stroke = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.stroke = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  } else if (!e.has(COLOR)) {
    p.opacity = {value: style.opacity};
  }

  p.strokeWidth = {value: e.config('strokeWidth')};

  return p;
}

function line_props(e,layout, style) {
  // jshint unused:false
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {group: 'height'};
  }

  // stroke
  if (e.has(COLOR)) {
    p.stroke = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.stroke = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  }

  p.strokeWidth = {value: e.config('strokeWidth')};

  return p;
}

function area_props(e, layout, style) {
  // jshint unused:false
  var p = {};

  // x
  if (e.isMeasure(X)) {
    p.x = {scale: X, field: e.field(X)};
    if (e.isDimension(Y)) {
      p.x2 = {scale: X, value: 0};
      p.orient = {value: 'horizontal'};
    }
  } else if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else {
    p.x = {value: 0};
  }

  // y
  if (e.isMeasure(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
    p.y2 = {scale: Y, value: 0};
  } else if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else {
    p.y = {group: 'height'};
  }

  // stroke
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.fill = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  }

  return p;
}

function tick_props(e, layout, style) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
    if (e.isDimension(X)) {
      p.x.offset = -e.bandSize(X, layout.x.useSmallBand) / 3;
    }
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
    if (e.isDimension(Y)) {
      p.y.offset = -e.bandSize(Y, layout.y.useSmallBand) / 3;
    }
  } else if (!e.has(Y)) {
    p.y = {value: 0};
  }

  // width
  if (!e.has(X) || e.isDimension(X)) {
    p.width = {value: e.bandSize(X, layout.y.useSmallBand) / 1.5};
  } else {
    p.width = {value: 1};
  }

  // height
  if (!e.has(Y) || e.isDimension(Y)) {
    p.height = {value: e.bandSize(Y, layout.y.useSmallBand) / 1.5};
  } else {
    p.height = {value: 1};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else {
    p.fill = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  } else if (!e.has(COLOR)) {
    p.opacity = {value: style.opacity};
  }

  return p;
}

function filled_point_props(shape) {
  return function(e, layout, style) {
    var p = {};

    // x
    if (e.has(X)) {
      p.x = {scale: X, field: e.field(X)};
    } else if (!e.has(X)) {
      p.x = {value: e.bandSize(X, layout.x.useSmallBand) / 2};
    }

    // y
    if (e.has(Y)) {
      p.y = {scale: Y, field: e.field(Y)};
    } else if (!e.has(Y)) {
      p.y = {value: e.bandSize(Y, layout.y.useSmallBand) / 2};
    }

    // size
    if (e.has(SIZE)) {
      p.size = {scale: SIZE, field: e.field(SIZE)};
    } else if (!e.has(X)) {
      p.size = {value: e.value(SIZE)};
    }

    // shape
    p.shape = {value: shape};

    // fill
    if (e.has(COLOR)) {
      p.fill = {scale: COLOR, field: e.field(COLOR)};
    } else if (!e.has(COLOR)) {
      p.fill = {value: e.value(COLOR)};
    }

    // alpha
    if (e.has(ALPHA)) {
      p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
    } else if (e.value(ALPHA) !== undefined) {
      p.opacity = {value: e.value(ALPHA)};
    } else if (!e.has(COLOR)) {
      p.opacity = {value: style.opacity};
    }

    return p;
  };
}

function text_props(e, layout, style) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    if (e.has(TEXT) && e.isType(TEXT, Q)) {
      p.x = {value: layout.cellWidth-5};
    } else {
      p.x = {value: e.bandSize(X, layout.x.useSmallBand) / 2};
    }
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {value: e.bandSize(Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (e.has(SIZE)) {
    p.fontSize = {scale: SIZE, field: e.field(SIZE)};
  } else if (!e.has(SIZE)) {
    p.fontSize = {value: e.font('size')};
  }

  // fill
  // color should be set to background
  p.fill = {value: 'black'};

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  } else {
    p.opacity = {value: style.opacity};
  }

  // text
  if (e.has(TEXT)) {
    if (e.isType(TEXT, Q)) {
      p.text = {template: "{{" + e.field(TEXT) + " | number:'.3s'}}"};
      p.align = {value: 'right'};
    } else {
      p.text = {field: e.field(TEXT)};
    }
  } else {
    p.text = {value: 'Abc'};
  }

  p.font = {value: e.font('family')};
  p.fontWeight = {value: e.font('weight')};
  p.fontStyle = {value: e.font('style')};
  p.baseline = {value: e.text('baseline')};

  return p;
}

},{"../globals":32}],21:[function(require,module,exports){
'use strict';
require('../globals');
var util = require('../util'),
  time = require('./time');

var scale = module.exports = {};

scale.names = function(props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    if (props[x] && props[x].scale) a[props[x].scale] = 1;
    return a;
  }, {}));
};

scale.defs = function(names, encoding, layout, style, sorting, opt) {
  opt = opt || {};

  return names.reduce(function(a, name) {
    var s = {
      name: name,
      type: scale.type(name, encoding),
      domain: scale_domain(name, encoding, sorting, opt)
    };
    if (s.type === 'ordinal' && !encoding.bin(name) && encoding.sort(name).length === 0) {
      s.sort = true;
    }

    scale_range(s, encoding, layout, style, opt);

    return (a.push(s), a);
  }, []);
};

scale.type = function(name, encoding) {

  switch (encoding.type(name)) {
    case O: return 'ordinal';
    case T:
      var fn = encoding.fn(name);
      return (fn && time.scale.type(fn, name)) || 'time';
    case Q:
      if (encoding.bin(name)) {
        return name === COLOR ? 'linear' : 'ordinal';
      }
      return encoding.scale(name).type;
  }
};

function scale_domain(name, encoding, sorting, opt) {
  if (encoding.isType(name, T)) {
    var range = time.scale.domain(encoding.fn(name), name);
    if(range) return range;
  }

  if (encoding.bin(name)) {
    // TODO: add includeEmptyConfig here
    if (opt.stats) {
      var bins = util.getbins(opt.stats[encoding.fieldName(name)], encoding.bin(name).maxbins);
      var domain = util.range(bins.start, bins.stop, bins.step);
      return name === Y ? domain.reverse() : domain;
    }
  }

  return name == opt.stack ?
    {
      data: STACKED,
      field: 'data.' + (opt.facet ? 'max_' : '') + 'sum_' + encoding.field(name, true)
    } :
    {data: sorting.getDataset(name), field: encoding.field(name)};
}

function scale_range(s, encoding, layout, style, opt) {
  // jshint unused:false
  var spec = encoding.scale(s.name);
  switch (s.name) {
    case X:
      if (s.type === 'ordinal') {
        s.bandWidth = encoding.bandSize(X, layout.x.useSmallBand);
      } else {
        s.range = layout.cellWidth ? [0, layout.cellWidth] : 'width';

        if (encoding.isType(s.name,T) && encoding.fn(s.name) === 'year') {
          s.zero = false;
        } else {
          s.zero = spec.zero === undefined ? true : spec.zero;
        }

        s.reverse = spec.reverse;
      }
      s.round = true;
      if (s.type === 'time') {
        s.nice = encoding.fn(s.name);
      }else {
        s.nice = true;
      }
      break;
    case Y:
      if (s.type === 'ordinal') {
        s.bandWidth = encoding.bandSize(Y, layout.y.useSmallBand);
      } else {
        s.range = layout.cellHeight ? [layout.cellHeight, 0] : 'height';

        if (encoding.isType(s.name,T) && encoding.fn(s.name) === 'year') {
          s.zero = false;
        } else {
          s.zero = spec.zero === undefined ? true : spec.zero;
        }

        s.reverse = spec.reverse;
      }

      s.round = true;

      if (s.type === 'time') {
        s.nice = encoding.fn(s.name) || encoding.config('timeScaleNice');
      }else {
        s.nice = true;
      }
      break;
    case ROW: // support only ordinal
      s.bandWidth = layout.cellHeight;
      s.round = true;
      s.nice = true;
      break;
    case COL: // support only ordinal
      s.bandWidth = layout.cellWidth;
      s.round = true;
      s.nice = true;
      break;
    case SIZE:
      if (encoding.is('bar')) {
        // FIXME this is definitely incorrect
        // but let's fix it later since bar size is a bad encoding anyway
        s.range = [3, Math.max(encoding.bandSize(X), encoding.bandSize(Y))];
      } else if (encoding.is(TEXT)) {
        s.range = [8, 40];
      } else { //point
        var bandSize = Math.min(encoding.bandSize(X), encoding.bandSize(Y)) - 1;
        s.range = [10, 0.8 * bandSize*bandSize];
      }
      s.round = true;
      s.zero = false;
      break;
    case SHAPE:
      s.range = 'shapes';
      break;
    case COLOR:
      var range = encoding.scale(COLOR).range;
      if (range === undefined) {
        if (s.type === 'ordinal') {
          // FIXME
          range = style.colorRange;
        } else {
          range = ['#A9DB9F', '#0D5C21'];
          s.zero = false;
        }
      }
      s.range = range;
      break;
    case ALPHA:
      s.range = [0.2, 1.0];
      break;
    default:
      throw new Error('Unknown encoding name: '+ s.name);
  }

  switch (s.name) {
    case ROW:
    case COL:
      s.padding = encoding.config('cellPadding');
      s.outerPadding = 0;
      break;
    case X:
    case Y:
      if (s.type === 'ordinal') { //&& !s.bandWidth
        s.points = true;
        s.padding = encoding.band(s.name).padding;
      }
  }
}

},{"../globals":32,"../util":35,"./time":27}],22:[function(require,module,exports){
'use strict';

require('../globals');

module.exports = addSortTransforms;

// adds new transforms that produce sorted fields
function addSortTransforms(spec, encoding, stats, opt) {
  // jshint unused:false

  var datasetMapping = {};
  var counter = 0;

  encoding.forEach(function(field, encType) {
    var sortBy = encoding.sort(encType, stats);
    if (sortBy.length > 0) {
      var fields = sortBy.map(function(d) {
        return {
          op: d.aggr,
          field: 'data.' + d.name
        };
      });

      var byClause = sortBy.map(function(d) {
        var reverse = (d.reverse ? '-' : '');
        return reverse + 'data.' + (d.aggr==='count' ? 'count' : (d.aggr + '_' + d.name));
      });

      var dataName = 'sorted' + counter++;

      var transforms = [
        {
          type: 'aggregate',
          groupby: ['data.' + field.name],
          fields: fields
        },
        {
          type: 'sort',
          by: byClause
        }
      ];

      spec.data.push({
        name: dataName,
        source: RAW,
        transform: transforms
      });

      datasetMapping[encType] = dataName;
    }
  });

  return {
    spec: spec,
    getDataset: function(encType) {
      var data = datasetMapping[encType];
      if (!data) {
        return TABLE;
      }
      return data;
    }
  };
}

},{"../globals":32}],23:[function(require,module,exports){
"use strict";

require('../globals');

var  marks = require('./marks');

module.exports = stacking;

function stacking(spec, encoding, mdef, facets) {
  if (!marks[encoding.marktype()].stack) return false;

  // TODO: add || encoding.has(LOD) here once LOD is implemented
  if (!encoding.has(COLOR)) return false;

  var dim=null, val=null, idx =null,
    isXMeasure = encoding.isMeasure(X),
    isYMeasure = encoding.isMeasure(Y);

  if (isXMeasure && !isYMeasure) {
    dim = Y;
    val = X;
    idx = 0;
  } else if (isYMeasure && !isXMeasure) {
    dim = X;
    val = Y;
    idx = 1;
  } else {
    return null; // no stack encoding
  }

  // add transform to compute sums for scale
  var stacked = {
    name: STACKED,
    source: TABLE,
    transform: [{
      type: 'aggregate',
      groupby: [encoding.field(dim)].concat(facets), // dim and other facets
      fields: [{op: 'sum', field: encoding.field(val)}] // TODO check if field with aggr is correct?
    }]
  };

  if (facets && facets.length > 0) {
    stacked.transform.push({ //calculate max for each facet
      type: 'aggregate',
      groupby: facets,
      fields: [{op: 'max', field: 'data.sum_' + encoding.field(val, true)}]
    });
  }

  spec.data.push(stacked);

  // add stack transform to mark
  mdef.from.transform = [{
    type: 'stack',
    point: encoding.field(dim),
    height: encoding.field(val),
    output: {y1: val, y0: val + '2'}
  }];

  // TODO: This is super hack-ish -- consolidate into modular mark properties?
  mdef.properties.update[val] = mdef.properties.enter[val] = {scale: val, field: val};
  mdef.properties.update[val + '2'] = mdef.properties.enter[val + '2'] = {scale: val, field: val + '2'};

  return val; //return stack encoding
}

},{"../globals":32,"./marks":20}],24:[function(require,module,exports){
'use strict';

require('../globals');

var vlfield = require('../field');

module.exports = function(encoding, stats) {
  return {
    opacity: estimateOpacity(encoding, stats),
    colorRange: colorRange(encoding, stats)
  };
};

function colorRange(encoding, stats){
  if (encoding.has(COLOR) && encoding.isDimension(COLOR)) {
    var cardinality = encoding.cardinality(COLOR, stats);
    if (cardinality <= 10) {
      return "category10";
    } else {
      return "category20";
    }
    // TODO can vega interpolate range for ordinal scale?
  }
  return null;
}

function estimateOpacity(encoding,stats) {
  if (!stats) {
    return 1;
  }

  var numPoints = 0;

  if (encoding.isAggregate()) { // aggregate plot
    numPoints = 1;

    //  get number of points in each "cell"
    //  by calculating product of cardinality
    //  for each non faceting and non-ordinal X / Y fields
    //  note that ordinal x,y are not include since we can
    //  consider that ordinal x are subdividing the cell into subcells anyway
    encoding.forEach(function(field, encType) {

      if (encType !== ROW && encType !== COL &&
          !((encType === X || encType === Y) &&
          vlfield.isOrdinalScale(field, true))
        ) {
        numPoints *= encoding.cardinality(encType, stats);
      }
    });

  } else { // raw plot
    numPoints = stats.count;

    // small multiples divide number of points
    var numMultiples = 1;
    if (encoding.has(ROW)) {
      numMultiples *= encoding.cardinality(ROW, stats);
    }
    if (encoding.has(COL)) {
      numMultiples *= encoding.cardinality(COL, stats);
    }
    numPoints /= numMultiples;
  }

  var opacity = 0;
  if (numPoints < 20) {
    opacity = 1;
  } else if (numPoints < 200) {
    opacity = 0.7;
  } else if (numPoints < 1000 || encoding.is('tick')) {
    opacity = 0.6;
  } else {
    opacity = 0.3;
  }

  return opacity;
}


},{"../field":31,"../globals":32}],25:[function(require,module,exports){
'use strict';

require('../globals');

var groupdef = require('./group').def;

module.exports = subfaceting;

function subfaceting(group, mdef, details, stack, encoding) {
  var m = group.marks,
    g = groupdef('subfacet', {marks: m});

  group.marks = [g];
  g.from = mdef.from;
  delete mdef.from;

  //TODO test LOD -- we should support stack / line without color (LOD) field
  var trans = (g.from.transform || (g.from.transform = []));
  trans.unshift({type: 'facet', keys: details});

  if (stack && encoding.has(COLOR)) {
    trans.unshift({type: 'sort', by: encoding.field(COLOR)});
  }
}

},{"../globals":32,"./group":17}],26:[function(require,module,exports){
'use strict';

require('../globals');

var groupdef = require('./group').def,
  vlfield = require('../field');

module.exports = template;

function template(encoding, layout, stats) {
  // jshint unused:false

  var data = {name: RAW, format: {}},
    table = {name: TABLE, source: RAW},
    dataUrl = encoding.data('url'),
    dataType = encoding.data('formatType'),
    values = encoding.data('values');

  if (encoding.hasValues()) {
    data.values = values;
  } else {
    data.url = dataUrl;
    data.format.type = dataType;
  }

  encoding.forEach(function(field, encType) {
    var name;
    if (field.type == T) {
      data.format.parse = data.format.parse || {};
      data.format.parse[field.name] = 'date';
    } else if (field.type == Q) {
      data.format.parse = data.format.parse || {};
      if (vlfield.isCount(field)) {
        name = 'count';
      } else {
        name = field.name;
      }
      data.format.parse[name] = 'number';
    }
  });

  return {
    width: layout.width,
    height: layout.height,
    padding: 'auto',
    data: [data, table],
    marks: [groupdef('cell', {
      width: layout.cellWidth ? {value: layout.cellWidth} : undefined,
      height: layout.cellHeight ? {value: layout.cellHeight} : undefined
    })]
  };
}

},{"../field":31,"../globals":32,"./group":17}],27:[function(require,module,exports){
'use strict';

var util = require('../util');

module.exports = time;

function time(spec, encoding, opt) {
  // jshint unused:false
  var timeFields = {}, timeFn = {};

  // find unique formula transformation and bin function
  encoding.forEach(function(field, encType) {
    if (field.type === T && field.fn) {
      timeFields[encoding.field(encType)] = {
        field: field,
        encType: encType
      };
      timeFn[field.fn] = true;
    }
  });

  // add formula transform
  var data = spec.data[1],
    transform = data.transform = data.transform || [];

  for (var f in timeFields) {
    var tf = timeFields[f];
    time.transform(transform, encoding, tf.encType, tf.field);
  }

  // add scales
  var scales = spec.scales = spec.scales || [];
  for (var fn in timeFn) {
    time.scale(scales, fn, encoding);
  }
  return spec;
}

time.cardinality = function(field, stats, filterNull, type) {
  var fn = field.fn;
  switch (fn) {
    case 'seconds': return 60;
    case 'minutes': return 60;
    case 'hours': return 24;
    case 'day': return 7;
    case 'date': return 31;
    case 'month': return 12;
    case 'year':
      var stat = stats[field.name],
        yearstat = stats['year_'+field.name];

      if (!yearstat) { return null; }

      return yearstat.distinct -
        (stat.nulls > 0 && filterNull[type] ? 1 : 0);
  }

  return null;
};

function fieldFn(func, field) {
  return 'utc' + func + '(d.data.'+ field.name +')';
}

/**
 * @return {String} date binning formula of the given field
 */
time.formula = function(field) {
  return fieldFn(field.fn, field);
};

/** add formula transforms to data */
time.transform = function(transform, encoding, encType, field) {
  transform.push({
    type: 'formula',
    field: encoding.field(encType),
    expr: time.formula(field)
  });
};

/** append custom time scales for axis label */
time.scale = function(scales, fn, encoding) {
  var labelLength = encoding.config('timeScaleLabelLength');
  // TODO add option for shorter scale / custom range
  switch (fn) {
    case 'day':
      scales.push({
        name: 'time-'+fn,
        type: 'ordinal',
        domain: util.range(0, 7),
        range: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
          function(s) { return s.substr(0, labelLength);}
        )
      });
      break;
    case 'month':
      scales.push({
        name: 'time-'+fn,
        type: 'ordinal',
        domain: util.range(0, 12),
        range: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
            function(s) { return s.substr(0, labelLength);}
          )
      });
      break;
  }
};

time.isOrdinalFn = function(fn) {
  switch (fn) {
    case 'seconds':
    case 'minutes':
    case 'hours':
    case 'day':
    case 'date':
    case 'month':
      return true;
  }
  return false;
};

time.scale.type = function(fn, name) {
  if (name === COLOR) {
    return 'linear'; // this has order
  }

  return time.isOrdinalFn(fn) || name === COL || name === ROW ? 'ordinal' : 'linear';
};

time.scale.domain = function(fn, name) {
  var isColor = name === COLOR;
  switch (fn) {
    case 'seconds':
    case 'minutes': return isColor ? [0,59] : util.range(0, 60);
    case 'hours': return isColor ? [0,23] : util.range(0, 24);
    case 'day': return isColor ? [0,6] : util.range(0, 7);
    case 'date': return isColor ? [1,31] : util.range(1, 32);
    case 'month': return isColor ? [0,11] : util.range(0, 12);
  }
  return null;
};

/** whether a particular time function has custom scale for labels implemented in time.scale */
time.hasScale = function(fn) {
  switch (fn) {
    case 'day':
    case 'month':
      return true;
  }
  return false;
};



},{"../util":35}],28:[function(require,module,exports){
'use strict';

require('./globals');

var consts = module.exports = {};

consts.encodingTypes = [X, Y, ROW, COL, SIZE, SHAPE, COLOR, ALPHA, TEXT, DETAIL];

consts.dataTypes = {'O': O, 'Q': Q, 'T': T};

consts.dataTypeNames = ['O', 'Q', 'T'].reduce(function(r, x) {
  r[consts.dataTypes[x]] = x;
  return r;
},{});

consts.shorthand = {
  delim:  '|',
  assign: '=',
  type:   ',',
  func:   '_'
};

},{"./globals":32}],29:[function(require,module,exports){
'use strict';

var vldata = module.exports = {};

/** Mapping from datalib's inferred type to Vega-lite's type */
vldata.types = {
  'boolean': 'O',
  'number': 'Q',
  'integer': 'Q',
  'date': 'T',
  'string': 'O'
};


},{}],30:[function(require,module,exports){
// utility for enc

'use strict';

var consts = require('./consts'),
  c = consts.shorthand,
  vlfield = require('./field'),
  util = require('./util'),
  schema = require('./schema/schema'),
  encTypes = schema.encTypes;

var vlenc = module.exports = {};

vlenc.countRetinal = function(enc) {
  var count = 0;
  if (enc.color) count++;
  if (enc.alpha) count++;
  if (enc.size) count++;
  if (enc.shape) count++;
  return count;
};

vlenc.has = function(enc, encType) {
  var fieldDef = enc && enc[encType];
  return fieldDef && fieldDef.name;
};

vlenc.isAggregate = function(enc) {
  for (var k in enc) {
    if (vlenc.has(enc, k) && enc[k].aggr) {
      return true;
    }
  }
  return false;
};

vlenc.forEach = function(enc, f) {
  var i = 0;
  encTypes.forEach(function(k) {
    if (vlenc.has(enc, k)) {
      f(enc[k], k, i++);
    }
  });
};

vlenc.map = function(enc, f) {
  var arr = [];
  encTypes.forEach(function(k) {
    if (vlenc.has(enc, k)) {
      arr.push(f(enc[k], k, enc));
    }
  });
  return arr;
};

vlenc.reduce = function(enc, f, init) {
  var r = init;
  encTypes.forEach(function(k) {
    if (vlenc.has(enc, k)) {
      r = f(r, enc[k], k,  enc);
    }
  });
  return r;
};

/*
 * return key-value pairs of field name and list of fields of that field name
 */
vlenc.fields = function(enc) {
  return vlenc.reduce(enc, function (m, field) {
    var fieldList = m[field.name] = m[field.name] || [],
      containsType = fieldList.containsType = fieldList.containsType || {};

    if (fieldList.indexOf(field) === -1) {
      fieldList.push(field);
      // augment the array with containsType.Q / O / T
      containsType[field.type] = true;
    }
    return m;
  }, {});
};

vlenc.shorthand = function(enc) {
  return vlenc.map(enc, function(field, et) {
    return et + c.assign + vlfield.shorthand(field);
  }).join(c.delim);
};

vlenc.fromShorthand = function(shorthand, convertType) {
  var enc = util.isArray(shorthand) ? shorthand : shorthand.split(c.delim);
  return enc.reduce(function(m, e) {
    var split = e.split(c.assign),
        enctype = split[0].trim(),
        field = split[1];

    m[enctype] = vlfield.fromShorthand(field, convertType);
    return m;
  }, {});
};
},{"./consts":28,"./field":31,"./schema/schema":33,"./util":35}],31:[function(require,module,exports){
'use strict';

// utility for field

var consts = require('./consts'),
  c = consts.shorthand,
  time = require('./compile/time'),
  util = require('./util'),
  schema = require('./schema/schema');

var vlfield = module.exports = {};

vlfield.shorthand = function(f) {
  var c = consts.shorthand;
  return (f.aggr ? f.aggr + c.func : '') +
    (f.fn ? f.fn + c.func : '') +
    (f.bin ? 'bin' + c.func : '') +
    (f.name || '') + c.type +
    (consts.dataTypeNames[f.type] || f.type);
};

vlfield.shorthands = function(fields, delim) {
  delim = delim || c.delim;
  return fields.map(vlfield.shorthand).join(delim);
};

vlfield.fromShorthand = function(shorthand, convertType) {
  var split = shorthand.split(c.type), i;
  var o = {
    name: split[0].trim(),
    type: convertType ? consts.dataTypes[split[1].trim()] : split[1].trim()
  };

  // check aggregate type
  for (i in schema.aggr.enum) {
    var a = schema.aggr.enum[i];
    if (o.name.indexOf(a + '_') === 0) {
      o.name = o.name.substr(a.length + 1);
      if (a == 'count' && o.name.length === 0) o.name = '*';
      o.aggr = a;
      break;
    }
  }

  // check time fn
  for (i in schema.timefns) {
    var f = schema.timefns[i];
    if (o.name && o.name.indexOf(f + '_') === 0) {
      o.name = o.name.substr(o.length + 1);
      o.fn = f;
      break;
    }
  }

  // check bin
  if (o.name && o.name.indexOf('bin_') === 0) {
    o.name = o.name.substr(4);
    o.bin = true;
  }

  return o;
};

var typeOrder = {
  O: 0,
  G: 1,
  T: 2,
  Q: 3
};

vlfield.order = {};

vlfield.order.type = function(field) {
  if (field.aggr==='count') return 4;
  return typeOrder[field.type];
};

vlfield.order.typeThenName = function(field) {
  return vlfield.order.type(field) + '_' + field.name.toLowerCase();
};

vlfield.order.original = function() {
  return 0; // no swap will occur
};

vlfield.order.name = function(field) {
  return field.name;
};

vlfield.order.typeThenCardinality = function(field, stats){
  return stats[field.name].distinct;
};

// FIXME refactor
vlfield.isType = function (fieldDef, type) {
  return (fieldDef.type & type) > 0;
};

vlfield.isType.byCode = vlfield.isType;

vlfield.isType.byName = function (field, type) {
  return field.type === consts.dataTypeNames[type];
};


function getIsType(useTypeCode) {
  return useTypeCode ? vlfield.isType.byCode : vlfield.isType.byName;
}

vlfield.isType.get = getIsType; //FIXME

/*
 * Most fields that use ordinal scale are dimensions.
 * However, YEAR(T), YEARMONTH(T) use time scale, not ordinal but are dimensions too.
 */
vlfield.isOrdinalScale = function(field, useTypeCode /*optional*/) {
  var isType = getIsType(useTypeCode);
  return  isType(field, O) || field.bin ||
    ( isType(field, T) && field.fn && time.isOrdinalFn(field.fn) );
};

function isDimension(field, useTypeCode /*optional*/) {
  var isType = getIsType(useTypeCode);
  return  isType(field, O) || !!field.bin ||
    ( isType(field, T) && !!field.fn );
}

/**
 * For encoding, use encoding.isDimension() to avoid confusion.
 * Or use Encoding.isType if your field is from Encoding (and thus have numeric data type).
 * otherwise, do not specific isType so we can use the default isTypeName here.
 */
vlfield.isDimension = function(field, useTypeCode /*optional*/) {
  return field && isDimension(field, useTypeCode);
};

vlfield.isMeasure = function(field, useTypeCode) {
  return field && !isDimension(field, useTypeCode);
};

vlfield.role = function(field) {
  return isDimension(field) ? 'dimension' : 'measure';
};

vlfield.count = function() {
  return {name:'*', aggr: 'count', type:'Q', displayName: vlfield.count.displayName};
};

vlfield.count.displayName = 'Number of Records';

vlfield.isCount = function(field) {
  return field.aggr === 'count';
};

/**
 * For encoding, use encoding.cardinality() to avoid confusion.  Or use Encoding.isType if your field is from Encoding (and thus have numeric data type).
 * otherwise, do not specific isType so we can use the default isTypeName here.
 */
vlfield.cardinality = function(field, stats, filterNull, useTypeCode) {
  // FIXME need to take filter into account

  var stat = stats[field.name];
  var isType = getIsType(useTypeCode),
    type = useTypeCode ? consts.dataTypeNames[field.type] : field.type;

  filterNull = filterNull || {};

  if (field.bin) {
    var bins = util.getbins(stat, field.bin.maxbins || schema.MAXBINS_DEFAULT);
    return (bins.stop - bins.start) / bins.step;
  }
  if (isType(field, T)) {
    var cardinality = time.cardinality(field, stats, filterNull, type);
    if(cardinality !== null) return cardinality;
    //otherwise use calculation below
  }
  if (field.aggr) {
    return 1;
  }

  // remove null
  return stat.distinct -
    (stat.nulls > 0 && filterNull[type] ? 1 : 0);
};

},{"./compile/time":27,"./consts":28,"./schema/schema":33,"./util":35}],32:[function(require,module,exports){
(function (global){
'use strict';

// declare global constant
var g = global || window;

g.TABLE = 'table';
g.RAW = 'raw';
g.STACKED = 'stacked';
g.INDEX = 'index';

g.X = 'x';
g.Y = 'y';
g.ROW = 'row';
g.COL = 'col';
g.SIZE = 'size';
g.SHAPE = 'shape';
g.COLOR = 'color';
g.ALPHA = 'alpha';
g.TEXT = 'text';
g.DETAIL = 'detail';

g.O = 1;
g.Q = 2;
g.T = 4;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],33:[function(require,module,exports){
// Package of defining Vega-lite Specification's json schema
"use strict";

var schema = module.exports = {},
  util = require('../util');

schema.util = require('./schemautil');

schema.marktype = {
  type: 'string',
  enum: ['point', 'tick', 'bar', 'line', 'area', 'circle', 'square', 'text']
};

schema.aggr = {
  type: 'string',
  enum: ['avg', 'sum', 'min', 'max', 'count'],
  supportedEnums: {
    Q: ['avg', 'sum', 'min', 'max', 'count'],
    O: [],
    T: ['avg', 'min', 'max'],
    '': ['count']
  },
  supportedTypes: {'Q': true, 'O': true, 'T': true, '': true}
};
schema.band = {
  type: 'object',
  properties: {
    size: {
      type: 'integer',
      minimum: 0
    },
    padding: {
      type: 'integer',
      minimum: 0,
      default: 1
    }
  }
};

schema.getSupportedRole = function(encType) {
  return schema.schema.properties.enc.properties[encType].supportedRole;
};

schema.timefns = ['year', 'month', 'day', 'date', 'hours', 'minutes', 'seconds'];

schema.defaultTimeFn = 'month';

schema.fn = {
  type: 'string',
  enum: schema.timefns,
  supportedTypes: {'T': true}
};

//TODO(kanitw): add other type of function here

schema.scale_type = {
  type: 'string',
  enum: ['linear', 'log', 'pow', 'sqrt', 'quantile'],
  default: 'linear',
  supportedTypes: {'Q': true}
};

schema.field = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  }
};

var clone = util.duplicate;
var merge = schema.util.merge;

schema.MAXBINS_DEFAULT = 15;

var bin = {
  type: ['boolean', 'object'],
  default: false,
  properties: {
    maxbins: {
      type: 'integer',
      default: schema.MAXBINS_DEFAULT,
      minimum: 2
    }
  },
  supportedTypes: {'Q': true} // TODO: add 'O' after finishing #81
};

var typicalField = merge(clone(schema.field), {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['O', 'Q', 'T']
    },
    aggr: schema.aggr,
    fn: schema.fn,
    bin: bin,
    scale: {
      type: 'object',
      properties: {
        type: schema.scale_type,
        reverse: {
          type: 'boolean',
          default: false,
          supportedTypes: {'Q': true, 'T': true}
        },
        zero: {
          type: 'boolean',
          description: 'Include zero',
          default: true,
          supportedTypes: {'Q': true, 'T': true}
        },
        nice: {
          type: 'string',
          enum: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'],
          supportedTypes: {'T': true}
        }
      }
    }
  }
});

var onlyOrdinalField = merge(clone(schema.field), {
  type: 'object',
  supportedRole: {
    dimension: true
  },
  properties: {
    type: {
      type: 'string',
      enum: ['O','Q', 'T'] // ordinal-only field supports Q when bin is applied and T when fn is applied.
    },
    fn: schema.fn,
    bin: bin,
    aggr: {
      type: 'string',
      enum: ['count'],
      supportedTypes: {'O': true}
    }
  }
});

var axisMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true},
  properties: {
    axis: {
      type: 'object',
      properties: {
        grid: {
          type: 'boolean',
          default: true,
          description: 'A flag indicate if gridlines should be created in addition to ticks.'
        },
        title: {
          type: 'boolean',
          default: true,
          description: 'A title for the axis.'
        },
        titleOffset: {
          type: 'integer',
          default: undefined,  // auto
          description: 'A title offset value for the axis.'
        },
        format: {
          type: 'string',
          default: undefined,  // auto
          description: 'The formatting pattern for axis labels.'
        },
        maxLabelLength: {
          type: 'integer',
          default: 25,
          minimum: 0,
          description: 'Truncate labels that are too long.'
        }
      }
    }
  }
};

var sortMixin = {
  type: 'object',
  properties: {
    sort: {
      type: 'array',
      default: [],
      items: {
        type: 'object',
        supportedTypes: {'O': true},
        required: ['name', 'aggr'],
        name: {
          type: 'string'
        },
        aggr: {
          type: 'string',
          enum: ['avg', 'sum', 'min', 'max', 'count']
        },
        reverse: {
          type: 'boolean',
          default: false
        }
      }
    }
  }
};

var bandMixin = {
  type: 'object',
  properties: {
    band: schema.band
  }
};

var legendMixin = {
  type: 'object',
  properties: {
    legend: {
      type: 'boolean',
      default: true
    }
  }
};

var textMixin = {
  type: 'object',
  supportedMarktypes: {'text': true},
  properties: {
    text: {
      type: 'object',
      properties: {
        align: {
          type: 'string',
          default: 'left'
        },
        baseline: {
          type: 'string',
          default: 'middle'
        },
        margin: {
          type: 'integer',
          default: 4,
          minimum: 0
        }
      }
    },
    font: {
      type: 'object',
      properties: {
        weight: {
          type: 'string',
          enum: ['normal', 'bold'],
          default: 'normal'
        },
        size: {
          type: 'integer',
          default: 10,
          minimum: 0
        },
        family: {
          type: 'string',
          default: 'Helvetica Neue'
        },
        style: {
          type: 'string',
          default: 'normal',
          enum: ['normal', 'italic']
        }
      }
    }
  }
};

var sizeMixin = {
  type: 'object',
  supportedMarktypes: {point: true, bar: true, circle: true, square: true, text: true},
  properties: {
    value: {
      type: 'integer',
      default: 30,
      minimum: 0
    }
  }
};

var colorMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, 'text': true},
  properties: {
    value: {
      type: 'string',
      role: 'color',
      default: 'steelblue'
    },
    scale: {
      type: 'object',
      properties: {
        range: {
          type: ['string', 'array']
        }
      }
    }
  }
};

var alphaMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, 'text': true},
  properties: {
    value: {
      type: 'number',
      default: undefined,  // auto
      minimum: 0,
      maximum: 1
    }
  }
};

var shapeMixin = {
  type: 'object',
  supportedMarktypes: {point: true, circle: true, square: true},
  properties: {
    value: {
      type: 'string',
      enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
      default: 'circle'
    }
  }
};

var detailMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, line: true, circle: true, square: true}
};

var rowMixin = {
  properties: {
    height: {
      type: 'number',
      minimum: 0,
      default: 150
    },
    grid: {
      type: 'boolean',
      default: true,
      description: 'A flag indicate if gridlines should be created in addition to ticks.'
    },
  }
};

var colMixin = {
  properties: {
    width: {
      type: 'number',
      minimum: 0,
      default: 150
    },
    axis: {
      properties: {
        maxLabelLength: {
          type: 'integer',
          default: 12,
          minimum: 0,
          description: 'Truncate labels that are too long.'
        }
      }
    }
  }
};

var facetMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, text: true},
  properties: {
    padding: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.1
    }
  }
};

var requiredNameType = {
  required: ['name', 'type']
};

var multiRoleField = merge(clone(typicalField), {
  supportedRole: {
    measure: true,
    dimension: true
  }
});

var quantitativeField = merge(clone(typicalField), {
  supportedRole: {
    measure: true,
    dimension: 'ordinal-only' // using alpha / size to encoding category lead to order interpretation
  }
});

var onlyQuantitativeField = merge(clone(typicalField), {
  supportedRole: {
    measure: true
  }
});

var x = merge(clone(multiRoleField), axisMixin, bandMixin, requiredNameType, sortMixin);
var y = clone(x);

var facet = merge(clone(onlyOrdinalField), requiredNameType, facetMixin, sortMixin);
var row = merge(clone(facet), axisMixin, rowMixin);
var col = merge(clone(facet), axisMixin, colMixin);

var size = merge(clone(quantitativeField), legendMixin, sizeMixin, sortMixin);
var color = merge(clone(multiRoleField), legendMixin, colorMixin, sortMixin);
var alpha = merge(clone(quantitativeField), alphaMixin, sortMixin);
var shape = merge(clone(onlyOrdinalField), legendMixin, shapeMixin, sortMixin);
var detail = merge(clone(onlyOrdinalField), detailMixin, sortMixin);

// we only put aggregated measure in pivot table
var text = merge(clone(onlyQuantitativeField), textMixin, sortMixin);

// TODO add label

var filter = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      operands: {
        type: 'array',
        items: {
          type: ['string', 'boolean', 'integer', 'number']
        }
      },
      operator: {
        type: 'string',
        enum: ['>', '>=', '=', '!=', '<', '<=', 'notNull']
      }
    }
  }
};

var data = {
  type: 'object',
  properties: {
    // data source
    formatType: {
      type: 'string',
      enum: ['json', 'csv'],
      default: 'json'
    },
    url: {
      type: 'string',
      default: undefined
    },
    values: {
      type: 'array',
      description: 'Pass array of objects instead of a url to a file.',
      items: {
        type: 'object',
        additionalProperties: true
      }
    }
  }
};

var config = {
  type: 'object',
  properties: {
    // template
    width: {
      type: 'integer',
      default: undefined
    },
    height: {
      type: 'integer',
      default: undefined
    },
    viewport: {
      type: 'array',
      items: {
        type: 'integer'
      },
      default: undefined
    },
    gridColor: {
      type: 'string',
      role: 'color',
      default: 'black'
    },
    gridOpacity: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.08
    },

    // filter null
    filterNull: {
      type: 'object',
      properties: {
        O: {type:'boolean', default: false},
        Q: {type:'boolean', default: true},
        T: {type:'boolean', default: true}
      }
    },
    toggleSort: {
      type: 'string',
      default: 'O'
    },

    // single plot
    singleHeight: {
      // will be overwritten by bandWidth * (cardinality + padding)
      type: 'integer',
      default: 200,
      minimum: 0
    },
    singleWidth: {
      // will be overwritten by bandWidth * (cardinality + padding)
      type: 'integer',
      default: 200,
      minimum: 0
    },
    // band size
    largeBandSize: {
      type: 'integer',
      default: 21,
      minimum: 0
    },
    smallBandSize: {
      //small multiples or single plot with high cardinality
      type: 'integer',
      default: 12,
      minimum: 0
    },
    largeBandMaxCardinality: {
      type: 'integer',
      default: 10
    },
    // small multiples
    cellPadding: {
      type: 'number',
      default: 0.1
    },
    cellGridColor: {
      type: 'string',
      role: 'color',
      default: 'black'
    },
    cellGridOpacity: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.15
    },
    cellBackgroundColor: {
      type: 'string',
      role: 'color',
      default: 'transparent'
    },
    textCellWidth: {
      type: 'integer',
      default: 90,
      minimum: 0
    },

    // marks
    strokeWidth: {
      type: 'integer',
      default: 2,
      minimum: 0
    },

    // scales
    timeScaleLabelLength: {
      type: 'integer',
      default: 3,
      minimum: 0
    },
    // other
    characterWidth: {
      type: 'integer',
      default: 6
    }
  }
};

/** @type Object Schema of a vega-lite specification */
schema.schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: 'Schema for Vega-lite specification',
  type: 'object',
  required: ['marktype', 'enc', 'data'],
  properties: {
    data: data,
    marktype: schema.marktype,
    enc: {
      type: 'object',
      properties: {
        x: x,
        y: y,
        row: row,
        col: col,
        size: size,
        color: color,
        alpha: alpha,
        shape: shape,
        text: text,
        detail: detail
      }
    },
    filter: filter,
    config: config
  }
};

schema.encTypes = util.keys(schema.schema.properties.enc.properties);

/** Instantiate a verbose vl spec from the schema */
schema.instantiate = function() {
  return schema.util.instantiate(schema.schema);
};

},{"../util":35,"./schemautil":34}],34:[function(require,module,exports){
'use strict';

var schemautil = module.exports = {},
  util = require('../util');

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
};

schemautil.extend = function(instance, schema) {
  return schemautil.merge(schemautil.instantiate(schema), instance);
};

// instantiate a schema
schemautil.instantiate = function(schema) {
  var val;
  if (schema === undefined) {
    return undefined;
  } else if ('default' in schema) {
    val = schema.default;
    return util.isObject(val) ? util.duplicate(val) : val;
  } else if (schema.type === 'object') {
    var instance = {};
    for (var name in schema.properties) {
      val = schemautil.instantiate(schema.properties[name]);
      if (val !== undefined) {
        instance[name] = val;
      }
    }
    return instance;
  } else if (schema.type === 'array') {
    return [];
  }
  return undefined;
};

// remove all defaults from an instance
schemautil.subtract = function(instance, defaults) {
  var changes = {};
  for (var prop in instance) {
    var def = defaults[prop];
    var ins = instance[prop];
    // Note: does not properly subtract arrays
    if (!defaults || def !== ins) {
      if (typeof ins === 'object' && !util.isArray(ins) && def) {
        var c = schemautil.subtract(ins, def);
        if (!isEmpty(c))
          changes[prop] = c;
      } else if (!util.isArray(ins) || ins.length > 0) {
        changes[prop] = ins;
      }
    }
  }
  return changes;
};

schemautil.merge = function(/*dest*, src0, src1, ...*/){
  var dest = arguments[0];
  for (var i=1 ; i<arguments.length; i++) {
    dest = merge(dest, arguments[i]);
  }
  return dest;
};

// recursively merges src into dest
function merge(dest, src) {
  if (typeof src !== 'object' || src === null) {
    return dest;
  }

  for (var p in src) {
    if (!src.hasOwnProperty(p)) {
      continue;
    }
    if (src[p] === undefined) {
      continue;
    }
    if (typeof src[p] !== 'object' || src[p] === null) {
      dest[p] = src[p];
    } else if (typeof dest[p] !== 'object' || dest[p] === null) {
      dest[p] = merge(src[p].constructor === Array ? [] : {}, src[p]);
    } else {
      merge(dest[p], src[p]);
    }
  }
  return dest;
}
},{"../util":35}],35:[function(require,module,exports){
'use strict';

var util = module.exports = require('datalib/src/util');

util.extend(util, require('datalib/src/generate'));
util.bin = require('datalib/src/bin');

util.isin = function(item, array) {
  return array.indexOf(item) !== -1;
};

util.forEach = function(obj, f, thisArg) {
  if (obj.forEach) {
    obj.forEach.call(thisArg, f);
  } else {
    for (var k in obj) {
      f.call(thisArg, obj[k], k , obj);
    }
  }
};

util.reduce = function(obj, f, init, thisArg) {
  if (obj.reduce) {
    return obj.reduce.call(thisArg, f, init);
  } else {
    for (var k in obj) {
      init = f.call(thisArg, init, obj[k], k, obj);
    }
    return init;
  }
};

util.map = function(obj, f, thisArg) {
  if (obj.map) {
    return obj.map.call(thisArg, f);
  } else {
    var output = [];
    for (var k in obj) {
      output.push( f.call(thisArg, obj[k], k, obj));
    }
  }
};

util.any = function(arr, f) {
  var i = 0, k;
  for (k in arr) {
    if (f(arr[k], k, i++)) return true;
  }
  return false;
};

util.all = function(arr, f) {
  var i = 0, k;
  for (k in arr) {
    if (!f(arr[k], k, i++)) return false;
  }
  return true;
};

util.getbins = function(stats, maxbins) {
  return util.bin({
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
util.setter = function(x, p, val, noaugment) {
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
util.getter = function(x, p, noaugment) {
  for (var i=0; i<p.length; ++i) {
    if (!noaugment && !(p[i] in x)){
      x = x[p[i]] = {};
    } else {
      x = x[p[i]];
    }
  }
  return x;
};

util.error = function(msg) {
  console.error('[VL Error]', msg);
};


},{"datalib/src/bin":4,"datalib/src/generate":6,"datalib/src/util":9}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdmwiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9iaW4uanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvZGF0ZS11bml0cy5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9nZW5lcmF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9zdGF0cy5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9zdW1tYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL3V0aWwuanMiLCJzcmMvRW5jb2RpbmcuanMiLCJzcmMvY29tcGlsZS9hZ2dyZWdhdGUuanMiLCJzcmMvY29tcGlsZS9heGlzLmpzIiwic3JjL2NvbXBpbGUvYmluLmpzIiwic3JjL2NvbXBpbGUvY29tcGlsZS5qcyIsInNyYy9jb21waWxlL2ZhY2V0LmpzIiwic3JjL2NvbXBpbGUvZmlsdGVyLmpzIiwic3JjL2NvbXBpbGUvZ3JvdXAuanMiLCJzcmMvY29tcGlsZS9sYXlvdXQuanMiLCJzcmMvY29tcGlsZS9sZWdlbmQuanMiLCJzcmMvY29tcGlsZS9tYXJrcy5qcyIsInNyYy9jb21waWxlL3NjYWxlLmpzIiwic3JjL2NvbXBpbGUvc29ydC5qcyIsInNyYy9jb21waWxlL3N0YWNrLmpzIiwic3JjL2NvbXBpbGUvc3R5bGUuanMiLCJzcmMvY29tcGlsZS9zdWJmYWNldC5qcyIsInNyYy9jb21waWxlL3RlbXBsYXRlLmpzIiwic3JjL2NvbXBpbGUvdGltZS5qcyIsInNyYy9jb25zdHMuanMiLCJzcmMvZGF0YS5qcyIsInNyYy9lbmMuanMiLCJzcmMvZmllbGQuanMiLCJzcmMvZ2xvYmFscy5qcyIsInNyYy9zY2hlbWEvc2NoZW1hLmpzIiwic3JjL3NjaGVtYS9zY2hlbWF1dGlsLmpzIiwic3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuL2dsb2JhbHMnKTtcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgICBjb25zdHMgPSByZXF1aXJlKCcuL2NvbnN0cycpO1xuXG52YXIgdmwgPSB7fTtcblxudXRpbC5leHRlbmQodmwsIGNvbnN0cywgdXRpbCk7XG5cbnZsLkVuY29kaW5nID0gcmVxdWlyZSgnLi9FbmNvZGluZycpO1xudmwuY29tcGlsZSA9IHJlcXVpcmUoJy4vY29tcGlsZS9jb21waWxlJyk7XG52bC5kYXRhID0gcmVxdWlyZSgnLi9kYXRhJyk7XG52bC5maWVsZCA9IHJlcXVpcmUoJy4vZmllbGQnKTtcbnZsLmVuYyA9IHJlcXVpcmUoJy4vZW5jJyk7XG52bC5zY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKTtcbnZsLnRvU2hvcnRoYW5kID0gdmwuRW5jb2Rpbmcuc2hvcnRoYW5kO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZsOyIsbnVsbCwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgdW5pdHMgPSByZXF1aXJlKCcuL2RhdGUtdW5pdHMnKTtcbnZhciBFUFNJTE9OID0gMWUtMTU7XG5cbmZ1bmN0aW9uIGJpbihvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIC8vIGRldGVybWluZSByYW5nZVxuICB2YXIgbWF4YiA9IG9wdC5tYXhiaW5zIHx8IDE1LFxuICAgICAgYmFzZSA9IG9wdC5iYXNlIHx8IDEwLFxuICAgICAgbG9nYiA9IE1hdGgubG9nKGJhc2UpLFxuICAgICAgZGl2ID0gb3B0LmRpdiB8fCBbNSwgMl0sICAgICAgXG4gICAgICBtaW4gPSBvcHQubWluLFxuICAgICAgbWF4ID0gb3B0Lm1heCxcbiAgICAgIHNwYW4gPSBtYXggLSBtaW4sXG4gICAgICBzdGVwLCBsb2diLCBsZXZlbCwgbWluc3RlcCwgcHJlY2lzaW9uLCB2LCBpLCBlcHM7XG5cbiAgaWYgKG9wdC5zdGVwICE9IG51bGwpIHtcbiAgICAvLyBpZiBzdGVwIHNpemUgaXMgZXhwbGljaXRseSBnaXZlbiwgdXNlIHRoYXRcbiAgICBzdGVwID0gb3B0LnN0ZXA7XG4gIH0gZWxzZSBpZiAob3B0LnN0ZXBzKSB7XG4gICAgLy8gaWYgcHJvdmlkZWQsIGxpbWl0IGNob2ljZSB0byBhY2NlcHRhYmxlIHN0ZXAgc2l6ZXNcbiAgICBzdGVwID0gb3B0LnN0ZXBzW01hdGgubWluKFxuICAgICAgb3B0LnN0ZXBzLmxlbmd0aCAtIDEsXG4gICAgICBiaXNlY3Qob3B0LnN0ZXBzLCBzcGFuL21heGIsIDAsIG9wdC5zdGVwcy5sZW5ndGgpXG4gICAgKV07XG4gIH0gZWxzZSB7XG4gICAgLy8gZWxzZSB1c2Ugc3BhbiB0byBkZXRlcm1pbmUgc3RlcCBzaXplXG4gICAgbGV2ZWwgPSBNYXRoLmNlaWwoTWF0aC5sb2cobWF4YikgLyBsb2diKTtcbiAgICBtaW5zdGVwID0gb3B0Lm1pbnN0ZXAgfHwgMDtcbiAgICBzdGVwID0gTWF0aC5tYXgoXG4gICAgICBtaW5zdGVwLFxuICAgICAgTWF0aC5wb3coYmFzZSwgTWF0aC5yb3VuZChNYXRoLmxvZyhzcGFuKSAvIGxvZ2IpIC0gbGV2ZWwpXG4gICAgKTtcbiAgICBcbiAgICAvLyBpbmNyZWFzZSBzdGVwIHNpemUgaWYgdG9vIG1hbnkgYmluc1xuICAgIGRvIHsgc3RlcCAqPSBiYXNlOyB9IHdoaWxlIChNYXRoLmNlaWwoc3Bhbi9zdGVwKSA+IG1heGIpO1xuXG4gICAgLy8gZGVjcmVhc2Ugc3RlcCBzaXplIGlmIGFsbG93ZWRcbiAgICBmb3IgKGk9MDsgaTxkaXYubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSBzdGVwIC8gZGl2W2ldO1xuICAgICAgaWYgKHYgPj0gbWluc3RlcCAmJiBzcGFuIC8gdiA8PSBtYXhiKSBzdGVwID0gdjtcbiAgICB9XG4gIH1cblxuICAvLyB1cGRhdGUgcHJlY2lzaW9uLCBtaW4gYW5kIG1heFxuICB2ID0gTWF0aC5sb2coc3RlcCk7XG4gIHByZWNpc2lvbiA9IHYgPj0gMCA/IDAgOiB+figtdiAvIGxvZ2IpICsgMTtcbiAgZXBzID0gTWF0aC5wb3coYmFzZSwgLXByZWNpc2lvbiAtIDEpO1xuICBtaW4gPSBNYXRoLm1pbihtaW4sIE1hdGguZmxvb3IobWluIC8gc3RlcCArIGVwcykgKiBzdGVwKTtcbiAgbWF4ID0gTWF0aC5jZWlsKG1heCAvIHN0ZXApICogc3RlcDtcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBtaW4sXG4gICAgc3RvcDogIG1heCxcbiAgICBzdGVwOiAgc3RlcCxcbiAgICB1bml0OiAge3ByZWNpc2lvbjogcHJlY2lzaW9ufSxcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgaW5kZXg6IGluZGV4XG4gIH07XG59O1xuXG5mdW5jdGlvbiBiaXNlY3QoYSwgeCwgbG8sIGhpKSB7XG4gIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgaWYgKHV0aWwuY21wKGFbbWlkXSwgeCkgPCAwKSB7IGxvID0gbWlkICsgMTsgfVxuICAgIGVsc2UgeyBoaSA9IG1pZDsgfVxuICB9XG4gIHJldHVybiBsbztcbn07XG5cbmZ1bmN0aW9uIHZhbHVlKHYpIHtcbiAgcmV0dXJuIHRoaXMuc3RlcCAqIE1hdGguZmxvb3IodiAvIHRoaXMuc3RlcCArIEVQU0lMT04pO1xufVxuXG5mdW5jdGlvbiBpbmRleCh2KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKCh2IC0gdGhpcy5zdGFydCkgLyB0aGlzLnN0ZXAgKyBFUFNJTE9OKTtcbn1cblxuZnVuY3Rpb24gZGF0ZV92YWx1ZSh2KSB7XG4gIHJldHVybiB0aGlzLnVuaXQuZGF0ZSh2YWx1ZS5jYWxsKHRoaXMsIHYpKTtcbn1cblxuZnVuY3Rpb24gZGF0ZV9pbmRleCh2KSB7XG4gIHJldHVybiBpbmRleC5jYWxsKHRoaXMsIHRoaXMudW5pdC51bml0KHYpKTtcbn1cblxuYmluLmRhdGUgPSBmdW5jdGlvbihvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIC8vIGZpbmQgdGltZSBzdGVwLCB0aGVuIGJpblxuICB2YXIgZG1pbiA9IG9wdC5taW4sXG4gICAgICBkbWF4ID0gb3B0Lm1heCxcbiAgICAgIG1heGIgPSBvcHQubWF4YmlucyB8fCAyMCxcbiAgICAgIG1pbmIgPSBvcHQubWluYmlucyB8fCA0LFxuICAgICAgc3BhbiA9ICgrZG1heCkgLSAoK2RtaW4pO1xuICAgICAgdW5pdCA9IG9wdC51bml0ID8gdW5pdHNbb3B0LnVuaXRdIDogdW5pdHMuZmluZChzcGFuLCBtaW5iLCBtYXhiKSxcbiAgICAgIGJpbnMgPSBiaW4oe1xuICAgICAgICBtaW46ICAgICB1bml0Lm1pbiAhPSBudWxsID8gdW5pdC5taW4gOiB1bml0LnVuaXQoZG1pbiksXG4gICAgICAgIG1heDogICAgIHVuaXQubWF4ICE9IG51bGwgPyB1bml0Lm1heCA6IHVuaXQudW5pdChkbWF4KSxcbiAgICAgICAgbWF4YmluczogbWF4YixcbiAgICAgICAgbWluc3RlcDogdW5pdC5taW5zdGVwLFxuICAgICAgICBzdGVwczogICB1bml0LnN0ZXBcbiAgICAgIH0pO1xuXG4gIGJpbnMudW5pdCA9IHVuaXQ7XG4gIGJpbnMuaW5kZXggPSBkYXRlX2luZGV4O1xuICBpZiAoIW9wdC5yYXcpIGJpbnMudmFsdWUgPSBkYXRlX3ZhbHVlO1xuICByZXR1cm4gYmlucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmluO1xuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIFNURVBTID0gW1xuICBbMzE1MzZlNiwgNV0sICAvLyAxLXllYXJcbiAgWzc3NzZlNiwgNF0sICAgLy8gMy1tb250aFxuICBbMjU5MmU2LCA0XSwgICAvLyAxLW1vbnRoXG4gIFsxMjA5NmU1LCAzXSwgIC8vIDItd2Vla1xuICBbNjA0OGU1LCAzXSwgICAvLyAxLXdlZWtcbiAgWzE3MjhlNSwgM10sICAgLy8gMi1kYXlcbiAgWzg2NGU1LCAzXSwgICAgLy8gMS1kYXlcbiAgWzQzMmU1LCAyXSwgICAgLy8gMTItaG91clxuICBbMjE2ZTUsIDJdLCAgICAvLyA2LWhvdXJcbiAgWzEwOGU1LCAyXSwgICAgLy8gMy1ob3VyXG4gIFszNmU1LCAyXSwgICAgIC8vIDEtaG91clxuICBbMThlNSwgMV0sICAgICAvLyAzMC1taW51dGVcbiAgWzllNSwgMV0sICAgICAgLy8gMTUtbWludXRlXG4gIFszZTUsIDFdLCAgICAgIC8vIDUtbWludXRlXG4gIFs2ZTQsIDFdLCAgICAgIC8vIDEtbWludXRlXG4gIFszZTQsIDBdLCAgICAgIC8vIDMwLXNlY29uZFxuICBbMTVlMywgMF0sICAgICAvLyAxNS1zZWNvbmRcbiAgWzVlMywgMF0sICAgICAgLy8gNS1zZWNvbmRcbiAgWzFlMywgMF0gICAgICAgLy8gMS1zZWNvbmRcbl07XG5cbnZhciBlbnRyaWVzID0gW1xuICB7XG4gICAgdHlwZTogXCJzZWNvbmRcIixcbiAgICBtaW5zdGVwOiAxLFxuICAgIGZvcm1hdDogXCIlWSAlYiAlLWQgJUg6JU06JVMuJUxcIixcbiAgICBkYXRlOiBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoZCAqIDFlMyk7XG4gICAgfSxcbiAgICB1bml0OiBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gKCtkIC8gMWUzKTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICB0eXBlOiBcIm1pbnV0ZVwiLFxuICAgIG1pbnN0ZXA6IDEsXG4gICAgZm9ybWF0OiBcIiVZICViICUtZCAlSDolTVwiLFxuICAgIGRhdGU6IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZShkICogNmU0KTtcbiAgICB9LFxuICAgIHVuaXQ6IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiB+figrZCAvIDZlNCk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgdHlwZTogXCJob3VyXCIsXG4gICAgbWluc3RlcDogMSxcbiAgICBmb3JtYXQ6IFwiJVkgJWIgJS1kICVIOjAwXCIsXG4gICAgZGF0ZTogZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKGQgKiAzNmU1KTtcbiAgICB9LFxuICAgIHVuaXQ6IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiB+figrZCAvIDM2ZTUpO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIHR5cGU6IFwiZGF5XCIsXG4gICAgbWluc3RlcDogMSxcbiAgICBzdGVwOiBbMSwgN10sXG4gICAgZm9ybWF0OiBcIiVZICViICUtZFwiLFxuICAgIGRhdGU6IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZShkICogODY0ZTUpO1xuICAgIH0sXG4gICAgdW5pdDogZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIH5+KCtkIC8gODY0ZTUpO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIHR5cGU6IFwibW9udGhcIixcbiAgICBtaW5zdGVwOiAxLFxuICAgIHN0ZXA6IFsxLCAzLCA2XSxcbiAgICBmb3JtYXQ6IFwiJWIgJVlcIixcbiAgICBkYXRlOiBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMofn4oZCAvIDEyKSwgZCAlIDEyLCAxKSk7XG4gICAgfSxcbiAgICB1bml0OiBmdW5jdGlvbihkKSB7XG4gICAgICBpZiAodXRpbC5pc051bWJlcihkKSkgZCA9IG5ldyBEYXRlKGQpO1xuICAgICAgcmV0dXJuIDEyICogZC5nZXRVVENGdWxsWWVhcigpICsgZC5nZXRVVENNb250aCgpO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIHR5cGU6IFwieWVhclwiLFxuICAgIG1pbnN0ZXA6IDEsXG4gICAgZm9ybWF0OiBcIiVZXCIsXG4gICAgZGF0ZTogZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKGQsIDAsIDEpKTtcbiAgICB9LFxuICAgIHVuaXQ6IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiAodXRpbC5pc051bWJlcihkKSA/IG5ldyBEYXRlKGQpIDogZCkuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICB9XG4gIH1cbl07XG5cbnZhciBtaW51dGVPZkhvdXIgPSB7XG4gIHR5cGU6IFwibWludXRlT2ZIb3VyXCIsXG4gIG1pbjogMCxcbiAgbWF4OiA1OSxcbiAgbWluc3RlcDogMSxcbiAgZm9ybWF0OiBcIiVNXCIsXG4gIGRhdGU6IGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgMCwgZCkpO1xuICB9LFxuICB1bml0OiBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuICh1dGlsLmlzTnVtYmVyKGQpID8gbmV3IERhdGUoZCkgOiBkKS5nZXRVVENNaW51dGVzKCk7XG4gIH1cbn07XG5cbnZhciBob3VyT2ZEYXkgPSB7XG4gIHR5cGU6IFwiaG91ck9mRGF5XCIsXG4gIG1pbjogMCxcbiAgbWF4OiAyMyxcbiAgbWluc3RlcDogMSxcbiAgZm9ybWF0OiBcIiVIXCIsXG4gIGRhdGU6IGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgZCkpO1xuICB9LFxuICB1bml0OiBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuICh1dGlsLmlzTnVtYmVyKGQpID8gbmV3IERhdGUoZCkgOiBkKS5nZXRVVENIb3VycygpO1xuICB9XG59O1xuXG52YXIgZGF5T2ZXZWVrID0ge1xuICB0eXBlOiBcImRheU9mV2Vla1wiLFxuICBtaW46IDAsXG4gIG1heDogNixcbiAgc3RlcDogWzFdLFxuICBmb3JtYXQ6IFwiJWFcIixcbiAgZGF0ZTogZnVuY3Rpb24oZCkge1xuICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCA0ICsgZCkpO1xuICB9LFxuICB1bml0OiBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuICh1dGlsLmlzTnVtYmVyKGQpID8gbmV3IERhdGUoZCkgOiBkKS5nZXRVVENEYXkoKTtcbiAgfVxufTtcblxudmFyIGRheU9mTW9udGggPSB7XG4gIHR5cGU6IFwiZGF5T2ZNb250aFwiLFxuICBtaW46IDEsXG4gIG1heDogMzEsXG4gIHN0ZXA6IFsxXSxcbiAgZm9ybWF0OiBcIiUtZFwiLFxuICBkYXRlOiBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIGQpKTtcbiAgfSxcbiAgdW5pdDogZnVuY3Rpb24oZCkge1xuICAgIHJldHVybiAodXRpbC5pc051bWJlcihkKSA/IG5ldyBEYXRlKGQpIDogZCkuZ2V0VVRDRGF0ZSgpO1xuICB9XG59O1xuXG52YXIgbW9udGhPZlllYXIgPSB7XG4gIHR5cGU6IFwibW9udGhPZlllYXJcIixcbiAgbWluOiAwLFxuICBtYXg6IDExLFxuICBzdGVwOiBbMV0sXG4gIGZvcm1hdDogXCIlYlwiLFxuICBkYXRlOiBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIGQgJSAxMiwgMSkpO1xuICB9LFxuICB1bml0OiBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuICh1dGlsLmlzTnVtYmVyKGQpID8gbmV3IERhdGUoZCkgOiBkKS5nZXRVVENNb250aCgpO1xuICB9XG59O1xuXG52YXIgdW5pdHMgPSB7XG4gIFwic2Vjb25kXCI6ICAgICAgIGVudHJpZXNbMF0sXG4gIFwibWludXRlXCI6ICAgICAgIGVudHJpZXNbMV0sXG4gIFwiaG91clwiOiAgICAgICAgIGVudHJpZXNbMl0sXG4gIFwiZGF5XCI6ICAgICAgICAgIGVudHJpZXNbM10sXG4gIFwibW9udGhcIjogICAgICAgIGVudHJpZXNbNF0sXG4gIFwieWVhclwiOiAgICAgICAgIGVudHJpZXNbNV0sXG4gIFwibWludXRlT2ZIb3VyXCI6IG1pbnV0ZU9mSG91cixcbiAgXCJob3VyT2ZEYXlcIjogICAgaG91ck9mRGF5LFxuICBcImRheU9mV2Vla1wiOiAgICBkYXlPZldlZWssXG4gIFwiZGF5T2ZNb250aFwiOiAgIGRheU9mTW9udGgsXG4gIFwibW9udGhPZlllYXJcIjogIG1vbnRoT2ZZZWFyLFxuICBcInRpbWVzdGVwc1wiOiAgICBlbnRyaWVzXG59O1xuXG51bml0cy5maW5kID0gZnVuY3Rpb24oc3BhbiwgbWluYiwgbWF4Yikge1xuICB2YXIgaSwgbGVuLCBiaW5zLCBzdGVwID0gU1RFUFNbMF07XG5cbiAgZm9yIChpID0gMSwgbGVuID0gU1RFUFMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBzdGVwID0gU1RFUFNbaV07XG4gICAgaWYgKHNwYW4gPiBzdGVwWzBdKSB7XG4gICAgICBiaW5zID0gc3BhbiAvIHN0ZXBbMF07XG4gICAgICBpZiAoYmlucyA+IG1heGIpIHtcbiAgICAgICAgcmV0dXJuIGVudHJpZXNbU1RFUFNbaSAtIDFdWzFdXTtcbiAgICAgIH1cbiAgICAgIGlmIChiaW5zID49IG1pbmIpIHtcbiAgICAgICAgcmV0dXJuIGVudHJpZXNbc3RlcFsxXV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBlbnRyaWVzW1NURVBTW1NURVBTLmxlbmd0aCAtIDFdWzFdXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdW5pdHM7XG4iLCJ2YXIgZ2VuID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuZ2VuLnJlcGVhdCA9IGZ1bmN0aW9uKHZhbCwgbikge1xuICB2YXIgYSA9IEFycmF5KG4pLCBpO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIGFbaV0gPSB2YWw7XG4gIHJldHVybiBhO1xufTtcblxuZ2VuLnplcm9zID0gZnVuY3Rpb24obikge1xuICByZXR1cm4gZ2VuLnJlcGVhdCgwLCBuKTtcbn07XG5cbmdlbi5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgIHN0ZXAgPSAxO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgc3RvcCA9IHN0YXJ0O1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgfVxuICBpZiAoKHN0b3AgLSBzdGFydCkgLyBzdGVwID09IEluZmluaXR5KSB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIHJhbmdlJyk7XG4gIHZhciByYW5nZSA9IFtdLCBpID0gLTEsIGo7XG4gIGlmIChzdGVwIDwgMCkgd2hpbGUgKChqID0gc3RhcnQgKyBzdGVwICogKytpKSA+IHN0b3ApIHJhbmdlLnB1c2goaik7XG4gIGVsc2Ugd2hpbGUgKChqID0gc3RhcnQgKyBzdGVwICogKytpKSA8IHN0b3ApIHJhbmdlLnB1c2goaik7XG4gIHJldHVybiByYW5nZTtcbn07XG5cbmdlbi5yYW5kb20gPSB7fTtcblxuZ2VuLnJhbmRvbS51bmlmb3JtID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgaWYgKG1heCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0bWF4ID0gbWluO1xuXHRcdG1pbiA9IDA7XG5cdH1cblx0dmFyIGQgPSBtYXggLSBtaW47XG5cdHZhciBmID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIG1pbiArIGQgKiBNYXRoLnJhbmRvbSgpO1xuXHR9O1xuXHRmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7IHJldHVybiBnZW4uemVyb3MobikubWFwKGYpOyB9O1xuXHRyZXR1cm4gZjtcbn07XG5cbmdlbi5yYW5kb20uaW50ZWdlciA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0aWYgKGIgPT09IHVuZGVmaW5lZCkge1xuXHRcdGIgPSBhO1xuXHRcdGEgPSAwO1xuXHR9XG4gIHZhciBkID0gYiAtIGE7XG5cdHZhciBmID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGEgKyBNYXRoLmZsb29yKGQgKiBNYXRoLnJhbmRvbSgpKTtcblx0fTtcblx0Zi5zYW1wbGVzID0gZnVuY3Rpb24obikgeyByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTsgfTtcblx0cmV0dXJuIGY7XG59O1xuXG5nZW4ucmFuZG9tLm5vcm1hbCA9IGZ1bmN0aW9uKG1lYW4sIHN0ZGV2KSB7XG5cdG1lYW4gPSBtZWFuIHx8IDA7XG5cdHN0ZGV2ID0gc3RkZXYgfHwgMTtcblx0dmFyIG5leHQgPSB1bmRlZmluZWQ7XG5cdHZhciBmID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHggPSAwLCB5ID0gMCwgcmRzLCBjO1xuXHRcdGlmIChuZXh0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHggPSBuZXh0O1xuXHRcdFx0bmV4dCA9IHVuZGVmaW5lZDtcblx0XHRcdHJldHVybiB4O1xuXHRcdH1cblx0XHRkbyB7XG5cdFx0XHR4ID0gTWF0aC5yYW5kb20oKSoyLTE7XG5cdFx0XHR5ID0gTWF0aC5yYW5kb20oKSoyLTE7XG5cdFx0XHRyZHMgPSB4KnggKyB5Knk7XG5cdFx0fSB3aGlsZSAocmRzID09IDAgfHwgcmRzID4gMSk7XG5cdFx0YyA9IE1hdGguc3FydCgtMipNYXRoLmxvZyhyZHMpL3Jkcyk7IC8vIEJveC1NdWxsZXIgdHJhbnNmb3JtXG5cdFx0bmV4dCA9IG1lYW4gKyB5KmMqc3RkZXY7XG5cdFx0cmV0dXJuIG1lYW4gKyB4KmMqc3RkZXY7XG5cdH07XG5cdGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7IH07XG5cdHJldHVybiBmO1xufTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGdlbiA9IHJlcXVpcmUoJy4vZ2VuZXJhdGUnKTtcbnZhciBzdGF0cyA9IHt9O1xuXG4vLyBDb2xsZWN0IHVuaXF1ZSB2YWx1ZXMgYW5kIGFzc29jaWF0ZWQgY291bnRzLlxuLy8gT3V0cHV0OiBhbiBhcnJheSBvZiB1bmlxdWUgdmFsdWVzLCBpbiBvYnNlcnZlZCBvcmRlclxuLy8gVGhlIGFycmF5IGluY2x1ZGVzIGFuIGFkZGl0aW9uYWwgJ2NvdW50cycgcHJvcGVydHksXG4vLyB3aGljaCBpcyBhIGhhc2ggZnJvbSB1bmlxdWUgdmFsdWVzIHRvIG9jY3VycmVuY2UgY291bnRzLlxuc3RhdHMudW5pcXVlID0gZnVuY3Rpb24odmFsdWVzLCBmLCByZXN1bHRzKSB7XG4gIGlmICghdXRpbC5pc0FycmF5KHZhbHVlcykgfHwgdmFsdWVzLmxlbmd0aD09PTApIHJldHVybiBbXTtcbiAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG4gIHZhciB1ID0ge30sIHYsIGk7XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgaW4gdSkge1xuICAgICAgdVt2XSArPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICB1W3ZdID0gMTtcbiAgICAgIHJlc3VsdHMucHVzaCh2KTtcbiAgICB9XG4gIH1cbiAgcmVzdWx0cy5jb3VudHMgPSB1O1xuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbi8vIENvdW50IHRoZSBudW1iZXIgb2Ygbm9uLW51bGwgdmFsdWVzLlxuc3RhdHMuY291bnQgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgaWYgKCF1dGlsLmlzQXJyYXkodmFsdWVzKSB8fCB2YWx1ZXMubGVuZ3RoPT09MCkgcmV0dXJuIDA7XG4gIHZhciB2LCBpLCBjb3VudCA9IDA7XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgIT0gbnVsbCkgY291bnQgKz0gMTtcbiAgfVxuICByZXR1cm4gY291bnQ7XG59O1xuXG4vLyBDb3VudCB0aGUgbnVtYmVyIG9mIGRpc3RpbmN0IHZhbHVlcy5cbnN0YXRzLmNvdW50LmRpc3RpbmN0ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGlmICghdXRpbC5pc0FycmF5KHZhbHVlcykgfHwgdmFsdWVzLmxlbmd0aD09PTApIHJldHVybiAwO1xuICB2YXIgdSA9IHt9LCB2LCBpLCBjb3VudCA9IDA7XG4gIGZvciAoaT0wLCBuPXZhbHVlcy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgaW4gdSkgY29udGludWU7XG4gICAgdVt2XSA9IDE7XG4gICAgY291bnQgKz0gMTtcbiAgfVxuICByZXR1cm4gY291bnQ7XG59O1xuXG4vLyBDb3VudCB0aGUgbnVtYmVyIG9mIG51bGwgb3IgdW5kZWZpbmVkIHZhbHVlcy5cbnN0YXRzLmNvdW50Lm51bGxzID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGlmICghdXRpbC5pc0FycmF5KHZhbHVlcykgfHwgdmFsdWVzLmxlbmd0aD09PTApIHJldHVybiAwO1xuICB2YXIgdiwgaSwgY291bnQgPSAwO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh2ID09IG51bGwpIGNvdW50ICs9IDE7XG4gIH1cbiAgcmV0dXJuIGNvdW50O1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgbWVkaWFuIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5tZWRpYW4gPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgaWYgKCF1dGlsLmlzQXJyYXkodmFsdWVzKSB8fCB2YWx1ZXMubGVuZ3RoPT09MCkgcmV0dXJuIDA7XG4gIGlmIChmKSB2YWx1ZXMgPSB2YWx1ZXMubWFwKGYpO1xuICB2YWx1ZXMgPSB2YWx1ZXMuZmlsdGVyKHV0aWwuaXNOb3ROdWxsKS5zb3J0KHV0aWwuY21wKTtcbiAgdmFyIGhhbGYgPSBNYXRoLmZsb29yKHZhbHVlcy5sZW5ndGgvMik7XG4gIGlmICh2YWx1ZXMubGVuZ3RoICUgMikge1xuICAgIHJldHVybiB2YWx1ZXNbaGFsZl07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICh2YWx1ZXNbaGFsZi0xXSArIHZhbHVlc1toYWxmXSkgLyAyLjA7XG4gIH1cbn07XG5cbi8vIENvbXB1dGUgdGhlIHF1YW50aWxlIG9mIGEgc29ydGVkIGFycmF5IG9mIG51bWJlcnMuXG4vLyBBZGFwdGVkIGZyb20gdGhlIEQzLmpzIGltcGxlbWVudGF0aW9uLlxuc3RhdHMucXVhbnRpbGUgPSBmdW5jdGlvbih2YWx1ZXMsIGYsIHApIHtcbiAgaWYgKHAgPT09IHVuZGVmaW5lZCkgeyBwID0gZjsgZiA9IHV0aWwuaWRlbnRpdHk7IH1cbiAgdmFyIEggPSAodmFsdWVzLmxlbmd0aCAtIDEpICogcCArIDEsXG4gICAgICBoID0gTWF0aC5mbG9vcihIKSxcbiAgICAgIHYgPSArZih2YWx1ZXNbaCAtIDFdKSxcbiAgICAgIGUgPSBIIC0gaDtcbiAgcmV0dXJuIGUgPyB2ICsgZSAqIChmKHZhbHVlc1toXSkgLSB2KSA6IHY7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBtZWFuIChhdmVyYWdlKSBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMubWVhbiA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBpZiAoIXV0aWwuaXNBcnJheSh2YWx1ZXMpIHx8IHZhbHVlcy5sZW5ndGg9PT0wKSByZXR1cm4gMDtcbiAgdmFyIG1lYW4gPSAwLCBkZWx0YSwgaSwgYywgdjtcbiAgZm9yIChpPTAsIGM9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodiAhPSBudWxsICYmICFpc05hTih2KSkge1xuICAgICAgZGVsdGEgPSB2IC0gbWVhbjtcbiAgICAgIG1lYW4gPSBtZWFuICsgZGVsdGEgLyAoKytjKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1lYW47XG59O1xuXG4vLyBDb21wdXRlIHRoZSBzYW1wbGUgdmFyaWFuY2Ugb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLnZhcmlhbmNlID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGlmICghdXRpbC5pc0FycmF5KHZhbHVlcykgfHwgdmFsdWVzLmxlbmd0aD09PTApIHJldHVybiAwO1xuICB2YXIgbWVhbiA9IDAsIE0yID0gMCwgZGVsdGEsIGksIGMsIHY7XG4gIGZvciAoaT0wLCBjPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgIT0gbnVsbCAmJiAhaXNOYU4odikpIHtcbiAgICAgIGRlbHRhID0gdiAtIG1lYW47XG4gICAgICBtZWFuID0gbWVhbiArIGRlbHRhIC8gKCsrYyk7XG4gICAgICBNMiA9IE0yICsgZGVsdGEgKiAodiAtIG1lYW4pO1xuICAgIH1cbiAgfVxuICBNMiA9IE0yIC8gKGMgLSAxKTtcbiAgcmV0dXJuIE0yO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMuc3RkZXYgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgcmV0dXJuIE1hdGguc3FydChzdGF0cy52YXJpYW5jZSh2YWx1ZXMsIGYpKTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIFBlYXJzb24gbW9kZSBza2V3bmVzcyAoKG1lZGlhbi1tZWFuKS9zdGRldikgb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLm1vZGVza2V3ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHZhciBhdmcgPSBzdGF0cy5tZWFuKHZhbHVlcywgZiksXG4gICAgICBtZWQgPSBzdGF0cy5tZWRpYW4odmFsdWVzLCBmKSxcbiAgICAgIHN0ZCA9IHN0YXRzLnN0ZGV2KHZhbHVlcywgZik7XG4gIHJldHVybiBzdGQgPT09IDAgPyAwIDogKGF2ZyAtIG1lZCkgLyBzdGQ7XG59O1xuXG4vLyBGaW5kIHRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtIG9mIGFuIGFycmF5IG9mIHZhbHVlcy5cbnN0YXRzLmV4dGVudCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICB2YXIgYSwgYiwgdiwgaSwgbiA9IHZhbHVlcy5sZW5ndGg7XG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzTm90TnVsbCh2KSkgeyBhID0gYiA9IHY7IGJyZWFrOyB9XG4gIH1cbiAgZm9yICg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNOb3ROdWxsKHYpKSB7XG4gICAgICBpZiAodiA8IGEpIGEgPSB2O1xuICAgICAgaWYgKHYgPiBiKSBiID0gdjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFthLCBiXTtcbn07XG5cbi8vIEZpbmQgdGhlIGludGVnZXIgaW5kaWNlcyBvZiB0aGUgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMuXG5zdGF0cy5leHRlbnQuaW5kZXggPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgdmFyIGEsIGIsIHgsIHksIHYsIGksIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodXRpbC5pc05vdE51bGwodikpIHsgYSA9IGIgPSB2OyB4ID0geSA9IGk7IGJyZWFrOyB9XG4gIH1cbiAgZm9yICg7IGk8bjsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHV0aWwuaXNOb3ROdWxsKHYpKSB7XG4gICAgICBpZiAodiA8IGEpIHsgYSA9IHY7IHggPSBpOyB9XG4gICAgICBpZiAodiA+IGIpIHsgYiA9IHY7IHkgPSBpOyB9XG4gICAgfVxuICB9XG4gIHJldHVybiBbeCwgeV07XG59O1xuXG4vLyBDb21wdXRlIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gYXJyYXlzIG9mIG51bWJlcnMuXG5zdGF0cy5kb3QgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIpIHtcbiAgdmFyIHN1bSA9IDAsIGksIHY7XG4gIGlmICghYikge1xuICAgIGlmICh2YWx1ZXMubGVuZ3RoICE9PSBhLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJBcnJheSBsZW5ndGhzIG11c3QgbWF0Y2guXCIpO1xuICAgIH1cbiAgICBmb3IgKGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSB2YWx1ZXNbaV0gKiBhW2ldO1xuICAgICAgaWYgKCFpc05hTih2KSkgc3VtICs9IHY7XG4gICAgfVxuICB9IGVsc2UgeyAgXG4gICAgZm9yIChpPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2ID0gYSh2YWx1ZXNbaV0pICogYih2YWx1ZXNbaV0pO1xuICAgICAgaWYgKCFpc05hTih2KSkgc3VtICs9IHY7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdW07XG59O1xuXG4vLyBDb21wdXRlIGFzY2VuZGluZyByYW5rIHNjb3JlcyBmb3IgYW4gYXJyYXkgb2YgdmFsdWVzLlxuLy8gVGllcyBhcmUgYXNzaWduZWQgdGhlaXIgY29sbGVjdGl2ZSBtZWFuIHJhbmsuXG5zdGF0cy5yYW5rID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHZhciBhID0gdmFsdWVzLm1hcChmdW5jdGlvbih2LCBpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZHg6IGksXG4gICAgICAgIHZhbDogKGYgPyBmKHYpIDogdilcbiAgICAgIH07XG4gICAgfSlcbiAgICAuc29ydCh1dGlsLmNvbXBhcmF0b3IoXCJ2YWxcIikpO1xuXG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIHIgPSBBcnJheShuKSxcbiAgICAgIHRpZSA9IC0xLCBwID0ge30sIGksIHYsIG11O1xuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHYgPSBhW2ldLnZhbDtcbiAgICBpZiAodGllIDwgMCAmJiBwID09PSB2KSB7XG4gICAgICB0aWUgPSBpIC0gMTtcbiAgICB9IGVsc2UgaWYgKHRpZSA+IC0xICYmIHAgIT09IHYpIHtcbiAgICAgIG11ID0gMSArIChpLTEgKyB0aWUpIC8gMjtcbiAgICAgIGZvciAoOyB0aWU8aTsgKyt0aWUpIHJbYVt0aWVdLmlkeF0gPSBtdTtcbiAgICAgIHRpZSA9IC0xO1xuICAgIH1cbiAgICByW2FbaV0uaWR4XSA9IGkgKyAxO1xuICAgIHAgPSB2O1xuICB9XG5cbiAgaWYgKHRpZSA+IC0xKSB7XG4gICAgbXUgPSAxICsgKG4tMSArIHRpZSkgLyAyO1xuICAgIGZvciAoOyB0aWU8bjsgKyt0aWUpIHJbYVt0aWVdLmlkeF0gPSBtdTtcbiAgfVxuXG4gIHJldHVybiByO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIFBlYXJzb24gcHJvZHVjdC1tb21lbnQgY29ycmVsYXRpb24gb2YgdHdvIGFycmF5cyBvZiBudW1iZXJzLlxuc3RhdHMuY29yID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciBmbiA9IGI7XG4gIGIgPSBmbiA/IHZhbHVlcy5tYXAoYikgOiBhLFxuICBhID0gZm4gPyB2YWx1ZXMubWFwKGEpIDogdmFsdWVzO1xuXG4gIHZhciBkb3QgPSBzdGF0cy5kb3QoYSwgYiksXG4gICAgICBtdWEgPSBzdGF0cy5tZWFuKGEpLFxuICAgICAgbXViID0gc3RhdHMubWVhbihiKSxcbiAgICAgIHNkYSA9IHN0YXRzLnN0ZGV2KGEpLFxuICAgICAgc2RiID0gc3RhdHMuc3RkZXYoYiksXG4gICAgICBuID0gdmFsdWVzLmxlbmd0aDtcblxuICByZXR1cm4gKGRvdCAtIG4qbXVhKm11YikgLyAoKG4tMSkgKiBzZGEgKiBzZGIpO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgU3BlYXJtYW4gcmFuayBjb3JyZWxhdGlvbiBvZiB0d28gYXJyYXlzIG9mIHZhbHVlcy5cbnN0YXRzLmNvci5yYW5rID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciByYSA9IGIgPyBzdGF0cy5yYW5rKHZhbHVlcywgYSkgOiBzdGF0cy5yYW5rKHZhbHVlcyksXG4gICAgICByYiA9IGIgPyBzdGF0cy5yYW5rKHZhbHVlcywgYikgOiBzdGF0cy5yYW5rKGEpLFxuICAgICAgbiA9IHZhbHVlcy5sZW5ndGgsIGksIHMsIGQ7XG5cbiAgZm9yIChpPTAsIHM9MDsgaTxuOyArK2kpIHtcbiAgICBkID0gcmFbaV0gLSByYltpXTtcbiAgICBzICs9IGQgKiBkO1xuICB9XG5cbiAgcmV0dXJuIDEgLSA2KnMgLyAobiAqIChuKm4tMSkpO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgZGlzdGFuY2UgY29ycmVsYXRpb24gb2YgdHdvIGFycmF5cyBvZiBudW1iZXJzLlxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EaXN0YW5jZV9jb3JyZWxhdGlvblxuc3RhdHMuY29yLmRpc3QgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIpIHtcbiAgdmFyIFggPSBiID8gdmFsdWVzLm1hcChhKSA6IHZhbHVlcyxcbiAgICAgIFkgPSBiID8gdmFsdWVzLm1hcChiKSA6IGE7XG5cbiAgdmFyIEEgPSBzdGF0cy5kaXN0Lm1hdChYKSxcbiAgICAgIEIgPSBzdGF0cy5kaXN0Lm1hdChZKSxcbiAgICAgIG4gPSBBLmxlbmd0aCxcbiAgICAgIGksIGFhLCBiYiwgYWI7XG5cbiAgZm9yIChpPTAsIGFhPTAsIGJiPTAsIGFiPTA7IGk8bjsgKytpKSB7XG4gICAgYWEgKz0gQVtpXSpBW2ldO1xuICAgIGJiICs9IEJbaV0qQltpXTtcbiAgICBhYiArPSBBW2ldKkJbaV07XG4gIH1cblxuICByZXR1cm4gTWF0aC5zcXJ0KGFiIC8gTWF0aC5zcXJ0KGFhKmJiKSk7XG59O1xuXG4vLyBDb21wdXRlIHRoZSB2ZWN0b3IgZGlzdGFuY2UgYmV0d2VlbiB0d28gYXJyYXlzIG9mIG51bWJlcnMuXG4vLyBEZWZhdWx0IGlzIEV1Y2xpZGVhbiAoZXhwPTIpIGRpc3RhbmNlLCBjb25maWd1cmFibGUgdmlhIGV4cCBhcmd1bWVudC5cbnN0YXRzLmRpc3QgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIsIGV4cCkge1xuICB2YXIgZiA9IHV0aWwuaXNGdW5jdGlvbihiKSxcbiAgICAgIFggPSB2YWx1ZXMsXG4gICAgICBZID0gZiA/IHZhbHVlcyA6IGEsXG4gICAgICBlID0gZiA/IGV4cCA6IGIsXG4gICAgICBuID0gdmFsdWVzLmxlbmd0aCwgcyA9IDAsIGQsIGk7XG5cbiAgaWYgKGUgPT09IDIgfHwgZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgICBkID0gZiA/IChhKFhbaV0pLWIoWVtpXSkpIDogKFhbaV0tWVtpXSk7XG4gICAgICBzICs9IGQqZDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguc3FydChzKTsgXG4gIH0gZWxzZSB7XG4gICAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgICBkID0gTWF0aC5hYnMoZiA/IChhKFhbaV0pLWIoWVtpXSkpIDogKFhbaV0tWVtpXSkpO1xuICAgICAgcyArPSBNYXRoLnBvdyhkLCBlKTtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgucG93KHMsIDEvZSk7XG4gIH1cbn07XG5cbi8vIENvbnN0cnVjdCBhIG1lYW4tY2VudGVyZWQgZGlzdGFuY2UgbWF0cml4IGZvciBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMuZGlzdC5tYXQgPSBmdW5jdGlvbihYKSB7XG4gIHZhciBuID0gWC5sZW5ndGgsXG4gICAgICBtID0gbipuLFxuICAgICAgQSA9IEFycmF5KG0pLFxuICAgICAgUiA9IGdlbi56ZXJvcyhuKSxcbiAgICAgIE0gPSAwLCB2LCBpLCBqO1xuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIEFbaSpuK2ldID0gMDtcbiAgICBmb3IgKGo9aSsxOyBqPG47ICsraikge1xuICAgICAgQVtpKm4ral0gPSAodiA9IE1hdGguYWJzKFhbaV0gLSBYW2pdKSk7XG4gICAgICBBW2oqbitpXSA9IHY7XG4gICAgICBSW2ldICs9IHY7XG4gICAgICBSW2pdICs9IHY7XG4gICAgfVxuICB9XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgTSArPSBSW2ldO1xuICAgIFJbaV0gLz0gbjtcbiAgfVxuICBNIC89IG07XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgZm9yIChqPWk7IGo8bjsgKytqKSB7XG4gICAgICBBW2kqbitqXSArPSBNIC0gUltpXSAtIFJbal07XG4gICAgICBBW2oqbitpXSA9IEFbaSpuK2pdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBBO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgU2hhbm5vbiBlbnRyb3B5IChsb2cgYmFzZSAyKSBvZiBhbiBhcnJheSBvZiBjb3VudHMuXG5zdGF0cy5lbnRyb3B5ID0gZnVuY3Rpb24oY291bnRzLCBmKSB7XG4gIHZhciBpLCBwLCBzID0gMCwgSCA9IDAsIE4gPSBjb3VudHMubGVuZ3RoO1xuICBmb3IgKGk9MDsgaTxOOyArK2kpIHtcbiAgICBzICs9IChmID8gZihjb3VudHNbaV0pIDogY291bnRzW2ldKTtcbiAgfVxuICBpZiAocyA9PT0gMCkgcmV0dXJuIDA7XG4gIGZvciAoaT0wOyBpPE47ICsraSkge1xuICAgIHAgPSAoZiA/IGYoY291bnRzW2ldKSA6IGNvdW50c1tpXSkgLyBzO1xuICAgIGlmIChwID4gMCkgSCArPSBwICogTWF0aC5sb2cocCkgLyBNYXRoLkxOMjtcbiAgfVxuICByZXR1cm4gLUg7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBub3JtYWxpemVkIFNoYW5ub24gZW50cm9weSAobG9nIGJhc2UgMikgb2YgYW4gYXJyYXkgb2YgY291bnRzLlxuc3RhdHMuZW50cm9weS5ub3JtYWxpemVkID0gZnVuY3Rpb24oY291bnRzLCBmKSB7XG4gIHZhciBIID0gc3RhdHMuZW50cm9weShjb3VudHMsIGYpO1xuICByZXR1cm4gSD09PTAgPyAwIDogSCAqIE1hdGguTE4yIC8gTWF0aC5sb2coY291bnRzLmxlbmd0aCk7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBtdXR1YWwgaW5mb3JtYXRpb24gYmV0d2VlbiB0d28gZGlzY3JldGUgdmFyaWFibGVzLlxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NdXR1YWxfaW5mb3JtYXRpb25cbnN0YXRzLmVudHJvcHkubXV0dWFsID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiLCBjb3VudHMpIHtcbiAgdmFyIHggPSBjb3VudHMgPyB2YWx1ZXMubWFwKGEpIDogdmFsdWVzLFxuICAgICAgeSA9IGNvdW50cyA/IHZhbHVlcy5tYXAoYikgOiBhLFxuICAgICAgeiA9IGNvdW50cyA/IHZhbHVlcy5tYXAoY291bnRzKSA6IGI7XG5cbiAgdmFyIHB4ID0ge30sXG5cdCAgICBweSA9IHt9LFxuXHQgICAgaSwgeHgsIHl5LCB6eiwgcyA9IDAsIHQsIE4gPSB6Lmxlbmd0aCwgcCwgSSA9IDA7XG5cblx0Zm9yIChpPTA7IGk8TjsgKytpKSB7XG5cdCAgcHhbeFtpXV0gPSAwO1xuXHQgIHB5W3lbaV1dID0gMDtcbiAgfVxuXG5cdGZvciAoaT0wOyBpPE47ICsraSkge1xuXHRcdHB4W3hbaV1dICs9IHpbaV07XG5cdFx0cHlbeVtpXV0gKz0geltpXTtcblx0XHRzICs9IHpbaV07XG5cdH1cblxuXHR0ID0gMSAvIChzICogTWF0aC5MTjIpO1xuXHRmb3IgKGk9MDsgaTxOOyArK2kpIHtcblx0XHRpZiAoeltpXSA9PT0gMCkgY29udGludWU7XG5cdFx0cCA9IChzICogeltpXSkgLyAocHhbeFtpXV0gKiBweVt5W2ldXSk7XG5cdFx0SSArPSB6W2ldICogdCAqIE1hdGgubG9nKHApO1xuXHR9XG5cblx0cmV0dXJuIEk7XG59O1xuXG4vLyBDb21wdXRlIGEgcHJvZmlsZSBvZiBzdW1tYXJ5IHN0YXRpc3RpY3MgZm9yIGEgdmFyaWFibGUuXG5zdGF0cy5wcm9maWxlID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHZhciBwID0ge30sXG4gICAgICBtZWFuID0gMCxcbiAgICAgIGNvdW50ID0gMCxcbiAgICAgIGRpc3RpbmN0ID0gMCxcbiAgICAgIG1pbiA9IG51bGwsXG4gICAgICBtYXggPSBudWxsLFxuICAgICAgTTIgPSAwLFxuICAgICAgdmFscyA9IFtdLFxuICAgICAgdSA9IHt9LCBkZWx0YSwgc2QsIGksIHYsIHgsIGhhbGYsIGgsIGgyO1xuXG4gIC8vIGNvbXB1dGUgc3VtbWFyeSBzdGF0c1xuICBmb3IgKGk9MCwgYz0wOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuXG4gICAgLy8gdXBkYXRlIHVuaXF1ZSB2YWx1ZXNcbiAgICB1W3ZdID0gKHYgaW4gdSkgPyB1W3ZdICsgMSA6IChkaXN0aW5jdCArPSAxLCAxKTtcblxuICAgIGlmICh1dGlsLmlzTm90TnVsbCh2KSkge1xuICAgICAgLy8gdXBkYXRlIG1pbi9tYXhcbiAgICAgIGlmIChtaW49PT1udWxsIHx8IHYgPCBtaW4pIG1pbiA9IHY7XG4gICAgICBpZiAobWF4PT09bnVsbCB8fCB2ID4gbWF4KSBtYXggPSB2O1xuICAgICAgLy8gdXBkYXRlIHN0YXRzXG4gICAgICB4ID0gKHR5cGVvZiB2ID09PSAnc3RyaW5nJykgPyB2Lmxlbmd0aCA6IHY7XG4gICAgICBkZWx0YSA9IHggLSBtZWFuO1xuICAgICAgbWVhbiA9IG1lYW4gKyBkZWx0YSAvICgrK2NvdW50KTtcbiAgICAgIE0yID0gTTIgKyBkZWx0YSAqICh4IC0gbWVhbik7XG4gICAgICB2YWxzLnB1c2goeCk7XG4gICAgfVxuICB9XG4gIE0yID0gTTIgLyAoY291bnQgLSAxKTtcbiAgc2QgPSBNYXRoLnNxcnQoTTIpO1xuXG4gIC8vIHNvcnQgdmFsdWVzIGZvciBtZWRpYW4gYW5kIGlxclxuICB2YWxzLnNvcnQodXRpbC5jbXApO1xuXG4gIHJldHVybiB7XG4gICAgdW5pcXVlOiAgIHUsXG4gICAgY291bnQ6ICAgIGNvdW50LFxuICAgIG51bGxzOiAgICB2YWx1ZXMubGVuZ3RoIC0gY291bnQsXG4gICAgZGlzdGluY3Q6IGRpc3RpbmN0LFxuICAgIG1pbjogICAgICBtaW4sXG4gICAgbWF4OiAgICAgIG1heCxcbiAgICBtZWFuOiAgICAgbWVhbixcbiAgICBzdGRldjogICAgc2QsXG4gICAgbWVkaWFuOiAgICh2ID0gc3RhdHMucXVhbnRpbGUodmFscywgMC41KSksXG4gICAgbW9kZXNrZXc6IHNkID09PSAwID8gMCA6IChtZWFuIC0gdikgLyBzZCxcbiAgICBpcXI6ICAgICAgW3N0YXRzLnF1YW50aWxlKHZhbHMsIDAuMjUpLCBzdGF0cy5xdWFudGlsZSh2YWxzLCAwLjc1KV1cbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhdHM7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBzdGF0cyA9IHJlcXVpcmUoJy4vc3RhdHMnKTtcblxuLy8gQ29tcHV0ZSBwcm9maWxlcyBmb3IgYWxsIHZhcmlhYmxlcyBpbiBhIGRhdGEgc2V0LlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhLCBmaWVsZHMpIHtcbiAgaWYgKGRhdGEgPT0gbnVsbCB8fCBkYXRhLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gIGZpZWxkcyA9IGZpZWxkcyB8fCB1dGlsLmtleXMoZGF0YVswXSk7XG5cbiAgdmFyIHByb2ZpbGVzID0gZmllbGRzLm1hcChmdW5jdGlvbihmKSB7XG4gICAgdmFyIHAgPSBzdGF0cy5wcm9maWxlKGRhdGEsIHV0aWwuYWNjZXNzb3IoZikpO1xuICAgIHJldHVybiAocC5maWVsZCA9IGYsIHApO1xuICB9KTtcbiAgXG4gIHByb2ZpbGVzLnRvU3RyaW5nID0gcHJpbnRTdW1tYXJ5O1xuICByZXR1cm4gcHJvZmlsZXM7XG59O1xuXG5mdW5jdGlvbiBwcmludFN1bW1hcnkoKSB7XG4gIHZhciBwcm9maWxlcyA9IHRoaXM7XG4gIHZhciBzdHIgPSBbXTtcbiAgcHJvZmlsZXMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgc3RyLnB1c2goXCItLS0tLSBGaWVsZDogJ1wiICsgcC5maWVsZCArIFwiJyAtLS0tLVwiKTtcbiAgICBpZiAodHlwZW9mIHAubWluID09PSAnc3RyaW5nJyB8fCBwLmRpc3RpbmN0IDwgMTApIHtcbiAgICAgIHN0ci5wdXNoKHByaW50Q2F0ZWdvcmljYWxQcm9maWxlKHApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyLnB1c2gocHJpbnRRdWFudGl0YXRpdmVQcm9maWxlKHApKTtcbiAgICB9XG4gICAgc3RyLnB1c2goXCJcIik7XG4gIH0pO1xuICByZXR1cm4gc3RyLmpvaW4oXCJcXG5cIik7XG59XG5cbmZ1bmN0aW9uIHByaW50UXVhbnRpdGF0aXZlUHJvZmlsZShwKSB7XG4gIHJldHVybiBbXG4gICAgXCJkaXN0aW5jdDogXCIgKyBwLmRpc3RpbmN0LFxuICAgIFwibnVsbHM6ICAgIFwiICsgcC5udWxscyxcbiAgICBcIm1pbjogICAgICBcIiArIHAubWluLFxuICAgIFwibWF4OiAgICAgIFwiICsgcC5tYXgsXG4gICAgXCJtZWRpYW46ICAgXCIgKyBwLm1lZGlhbixcbiAgICBcIm1lYW46ICAgICBcIiArIHAubWVhbixcbiAgICBcInN0ZGV2OiAgICBcIiArIHAuc3RkZXYsXG4gICAgXCJtb2Rlc2tldzogXCIgKyBwLm1vZGVza2V3XG4gIF0uam9pbihcIlxcblwiKTtcbn1cblxuZnVuY3Rpb24gcHJpbnRDYXRlZ29yaWNhbFByb2ZpbGUocCkge1xuICB2YXIgbGlzdCA9IFtcbiAgICBcImRpc3RpbmN0OiBcIiArIHAuZGlzdGluY3QsXG4gICAgXCJudWxsczogICAgXCIgKyBwLm51bGxzLFxuICAgIFwidG9wIHZhbHVlczogXCJcbiAgXTtcbiAgdmFyIHUgPSBwLnVuaXF1ZTtcbiAgdmFyIHRvcCA9IHV0aWwua2V5cyh1KVxuICAgIC5zb3J0KGZ1bmN0aW9uKGEsYikgeyByZXR1cm4gdVtiXSAtIHVbYV07IH0pXG4gICAgLnNsaWNlKDAsIDYpXG4gICAgLm1hcChmdW5jdGlvbih2KSB7IHJldHVybiBcIiAnXCIgKyB2ICsgXCInIChcIiArIHVbdl0gKyBcIilcIjsgfSk7XG4gIHJldHVybiBsaXN0LmNvbmNhdCh0b3ApLmpvaW4oXCJcXG5cIik7XG59IiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbnZhciB1ID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gd2hlcmUgYXJlIHdlP1xuXG51LmlzTm9kZSA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAmJiB0eXBlb2YgcHJvY2Vzcy5zdGRlcnIgIT09ICd1bmRlZmluZWQnO1xuXG4vLyB0eXBlIGNoZWNraW5nIGZ1bmN0aW9uc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG51LmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xufTtcblxudS5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn07XG5cbnUuaXNTdHJpbmcgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBTdHJpbmddJztcbn07XG5cbnUuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbnUuaXNOdW1iZXIgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG9iaikpICYmIGlzRmluaXRlKG9iaik7XG59O1xuXG51LmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEJvb2xlYW5dJztcbn07XG5cbnUuaXNEYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgRGF0ZV0nO1xufTtcblxudS5pc05vdE51bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmICh0eXBlb2Ygb2JqICE9PSAnbnVtYmVyJyA/IHRydWUgOiAhaXNOYU4ob2JqKSk7XG59O1xuXG51LmlzQnVmZmVyID0gKEJ1ZmZlciAmJiBCdWZmZXIuaXNCdWZmZXIpIHx8IHUuZmFsc2U7XG5cbi8vIHR5cGUgY29lcmNpb24gZnVuY3Rpb25zXG5cbnUubnVtYmVyID0gZnVuY3Rpb24ocykgeyByZXR1cm4gcyA9PSBudWxsID8gbnVsbCA6ICtzOyB9O1xuXG51LmJvb2xlYW4gPSBmdW5jdGlvbihzKSB7IHJldHVybiBzID09IG51bGwgPyBudWxsIDogcz09PSdmYWxzZScgPyBmYWxzZSA6ICEhczsgfTtcblxudS5kYXRlID0gZnVuY3Rpb24ocykgeyByZXR1cm4gcyA9PSBudWxsID8gbnVsbCA6IERhdGUucGFyc2Uocyk7IH1cblxudS5hcnJheSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggIT0gbnVsbCA/ICh1LmlzQXJyYXkoeCkgPyB4IDogW3hdKSA6IFtdOyB9O1xuXG51LnN0ciA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHUuaXNBcnJheSh4KSA/IFwiW1wiICsgeC5tYXAodS5zdHIpICsgXCJdXCJcbiAgICA6IHUuaXNPYmplY3QoeCkgPyBKU09OLnN0cmluZ2lmeSh4KVxuICAgIDogdS5pc1N0cmluZyh4KSA/IChcIidcIit1dGlsX2VzY2FwZV9zdHIoeCkrXCInXCIpIDogeDtcbn07XG5cbnZhciBlc2NhcGVfc3RyX3JlID0gLyhefFteXFxcXF0pJy9nO1xuXG5mdW5jdGlvbiB1dGlsX2VzY2FwZV9zdHIoeCkge1xuICByZXR1cm4geC5yZXBsYWNlKGVzY2FwZV9zdHJfcmUsIFwiJDFcXFxcJ1wiKTtcbn1cblxuLy8gdXRpbGl0eSBmdW5jdGlvbnNcblxudS5pZGVudGl0eSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHg7IH07XG5cbnUudHJ1ZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTsgfTtcblxudS5mYWxzZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH07XG5cbnUuZHVwbGljYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufTtcblxudS5lcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGEpID09PSBKU09OLnN0cmluZ2lmeShiKTtcbn07XG5cbnUuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gIGZvciAodmFyIHgsIG5hbWUsIGk9MSwgbGVuPWFyZ3VtZW50cy5sZW5ndGg7IGk8bGVuOyArK2kpIHtcbiAgICB4ID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAobmFtZSBpbiB4KSB7IG9ialtuYW1lXSA9IHhbbmFtZV07IH1cbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxudS5rZXlzID0gZnVuY3Rpb24oeCkge1xuICB2YXIga2V5cyA9IFtdLCBrO1xuICBmb3IgKGsgaW4geCkga2V5cy5wdXNoKGspO1xuICByZXR1cm4ga2V5cztcbn07XG5cbnUudmFscyA9IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIHZhbHMgPSBbXSwgaztcbiAgZm9yIChrIGluIHgpIHZhbHMucHVzaCh4W2tdKTtcbiAgcmV0dXJuIHZhbHM7XG59O1xuXG51LnRvTWFwID0gZnVuY3Rpb24obGlzdCkge1xuICByZXR1cm4gbGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCB4KSB7XG4gICAgcmV0dXJuIChvYmpbeF0gPSAxLCBvYmopO1xuICB9LCB7fSk7XG59O1xuXG51LmtleXN0ciA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICAvLyB1c2UgdG8gZW5zdXJlIGNvbnNpc3RlbnQga2V5IGdlbmVyYXRpb24gYWNyb3NzIG1vZHVsZXNcbiAgcmV0dXJuIHZhbHVlcy5qb2luKFwifFwiKTtcbn07XG5cbi8vIGRhdGEgYWNjZXNzIGZ1bmN0aW9uc1xuXG51LmZpZWxkID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gZi5zcGxpdChcIlxcXFwuXCIpXG4gICAgLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBkLnNwbGl0KFwiLlwiKTsgfSlcbiAgICAucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmIChhLmxlbmd0aCkgeyBhW2EubGVuZ3RoLTFdICs9IFwiLlwiICsgYi5zaGlmdCgpOyB9XG4gICAgICBhLnB1c2guYXBwbHkoYSwgYik7XG4gICAgICByZXR1cm4gYTtcbiAgICB9LCBbXSk7XG59O1xuXG51LmFjY2Vzc29yID0gZnVuY3Rpb24oZikge1xuICB2YXIgcztcbiAgcmV0dXJuICh1LmlzRnVuY3Rpb24oZikgfHwgZj09bnVsbClcbiAgICA/IGYgOiB1LmlzU3RyaW5nKGYpICYmIChzPXUuZmllbGQoZikpLmxlbmd0aCA+IDFcbiAgICA/IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHMucmVkdWNlKGZ1bmN0aW9uKHgsZikge1xuICAgICAgICAgIHJldHVybiB4W2ZdO1xuICAgICAgICB9LCB4KTtcbiAgICAgIH1cbiAgICA6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHhbZl07IH07XG59O1xuXG51Lm11dGF0b3IgPSBmdW5jdGlvbihmKSB7XG4gIHZhciBzO1xuICByZXR1cm4gdS5pc1N0cmluZyhmKSAmJiAocz11LmZpZWxkKGYpKS5sZW5ndGggPiAxXG4gICAgPyBmdW5jdGlvbih4LCB2KSB7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxzLmxlbmd0aC0xOyArK2kpIHggPSB4W3NbaV1dO1xuICAgICAgICB4W3NbaV1dID0gdjtcbiAgICAgIH1cbiAgICA6IGZ1bmN0aW9uKHgsIHYpIHsgeFtmXSA9IHY7IH07XG59O1xuXG5cbi8vIGNvbXBhcmlzb24gLyBzb3J0aW5nIGZ1bmN0aW9uc1xuXG51LmNvbXBhcmF0b3IgPSBmdW5jdGlvbihzb3J0KSB7XG4gIHZhciBzaWduID0gW107XG4gIGlmIChzb3J0ID09PSB1bmRlZmluZWQpIHNvcnQgPSBbXTtcbiAgc29ydCA9IHUuYXJyYXkoc29ydCkubWFwKGZ1bmN0aW9uKGYpIHtcbiAgICB2YXIgcyA9IDE7XG4gICAgaWYgICAgICAoZlswXSA9PT0gXCItXCIpIHsgcyA9IC0xOyBmID0gZi5zbGljZSgxKTsgfVxuICAgIGVsc2UgaWYgKGZbMF0gPT09IFwiK1wiKSB7IHMgPSArMTsgZiA9IGYuc2xpY2UoMSk7IH1cbiAgICBzaWduLnB1c2gocyk7XG4gICAgcmV0dXJuIHUuYWNjZXNzb3IoZik7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oYSxiKSB7XG4gICAgdmFyIGksIG4sIGYsIHgsIHk7XG4gICAgZm9yIChpPTAsIG49c29ydC5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgICBmID0gc29ydFtpXTsgeCA9IGYoYSk7IHkgPSBmKGIpO1xuICAgICAgaWYgKHggPCB5KSByZXR1cm4gLTEgKiBzaWduW2ldO1xuICAgICAgaWYgKHggPiB5KSByZXR1cm4gc2lnbltpXTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH07XG59O1xuXG51LmNtcCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGEgPiBiKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSBpZiAoYSA+PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAoYSA9PT0gbnVsbCAmJiBiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAoYSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmIChiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIE5hTjtcbn07XG5cbnUubnVtY21wID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYSAtIGI7IH07XG5cbnUuc3RhYmxlc29ydCA9IGZ1bmN0aW9uKGFycmF5LCBzb3J0QnksIGtleUZuKSB7XG4gIHZhciBpbmRpY2VzID0gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKGlkeCwgdiwgaSkge1xuICAgIHJldHVybiAoaWR4W2tleUZuKHYpXSA9IGksIGlkeCk7XG4gIH0sIHt9KTtcblxuICBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgc2EgPSBzb3J0QnkoYSksXG4gICAgICAgIHNiID0gc29ydEJ5KGIpO1xuICAgIHJldHVybiBzYSA8IHNiID8gLTEgOiBzYSA+IHNiID8gMVxuICAgICAgICAgOiAoaW5kaWNlc1trZXlGbihhKV0gLSBpbmRpY2VzW2tleUZuKGIpXSk7XG4gIH0pO1xuXG4gIHJldHVybiBhcnJheTtcbn07XG5cblxuLy8gc3RyaW5nIGZ1bmN0aW9uc1xuXG4vLyBFUzYgY29tcGF0aWJpbGl0eSBwZXIgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3RyaW5nL3N0YXJ0c1dpdGgjUG9seWZpbGxcbi8vIFdlIGNvdWxkIGhhdmUgdXNlZCB0aGUgcG9seWZpbGwgY29kZSwgYnV0IGxldHMgd2FpdCB1bnRpbCBFUzYgYmVjb21lcyBhIHN0YW5kYXJkIGZpcnN0XG51LnN0YXJ0c1dpdGggPSBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGhcbiAgPyBmdW5jdGlvbihzdHJpbmcsIHNlYXJjaFN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcpO1xuICB9XG4gIDogZnVuY3Rpb24oc3RyaW5nLCBzZWFyY2hTdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxhc3RJbmRleE9mKHNlYXJjaFN0cmluZywgMCkgPT09IDA7XG4gIH07XG5cbnUudHJ1bmNhdGUgPSBmdW5jdGlvbihzLCBsZW5ndGgsIHBvcywgd29yZCwgZWxsaXBzaXMpIHtcbiAgdmFyIGxlbiA9IHMubGVuZ3RoO1xuICBpZiAobGVuIDw9IGxlbmd0aCkgcmV0dXJuIHM7XG4gIGVsbGlwc2lzID0gZWxsaXBzaXMgIT09IHVuZGVmaW5lZCA/IFN0cmluZyhlbGxpcHNpcykgOiBcIuKAplwiO1xuICB2YXIgbCA9IE1hdGgubWF4KDAsIGxlbmd0aCAtIGVsbGlwc2lzLmxlbmd0aCk7XG5cbiAgc3dpdGNoIChwb3MpIHtcbiAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgcmV0dXJuIGVsbGlwc2lzICsgKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwsMSkgOiBzLnNsaWNlKGxlbi1sKSk7XG4gICAgY2FzZSBcIm1pZGRsZVwiOlxuICAgIGNhc2UgXCJjZW50ZXJcIjpcbiAgICAgIHZhciBsMSA9IE1hdGguY2VpbChsLzIpLCBsMiA9IE1hdGguZmxvb3IobC8yKTtcbiAgICAgIHJldHVybiAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbDEpIDogcy5zbGljZSgwLGwxKSkgKyBlbGxpcHNpc1xuICAgICAgICArICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsMiwxKSA6IHMuc2xpY2UobGVuLWwyKSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbCkgOiBzLnNsaWNlKDAsbCkpICsgZWxsaXBzaXM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHRydW5jYXRlT25Xb3JkKHMsIGxlbiwgcmV2KSB7XG4gIHZhciBjbnQgPSAwLCB0b2sgPSBzLnNwbGl0KHRydW5jYXRlX3dvcmRfcmUpO1xuICBpZiAocmV2KSB7XG4gICAgcyA9ICh0b2sgPSB0b2sucmV2ZXJzZSgpKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbih3KSB7IGNudCArPSB3Lmxlbmd0aDsgcmV0dXJuIGNudCA8PSBsZW47IH0pXG4gICAgICAucmV2ZXJzZSgpO1xuICB9IGVsc2Uge1xuICAgIHMgPSB0b2suZmlsdGVyKGZ1bmN0aW9uKHcpIHsgY250ICs9IHcubGVuZ3RoOyByZXR1cm4gY250IDw9IGxlbjsgfSk7XG4gIH1cbiAgcmV0dXJuIHMubGVuZ3RoID8gcy5qb2luKFwiXCIpLnRyaW0oKSA6IHRva1swXS5zbGljZSgwLCBsZW4pO1xufVxuXG52YXIgdHJ1bmNhdGVfd29yZF9yZSA9IC8oW1xcdTAwMDlcXHUwMDBBXFx1MDAwQlxcdTAwMENcXHUwMDBEXFx1MDAyMFxcdTAwQTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUyMDI4XFx1MjAyOVxcdTMwMDBcXHVGRUZGXSkvO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuL2dsb2JhbHMnKTtcblxudmFyIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgdmxmaWVsZCA9IHJlcXVpcmUoJy4vZmllbGQnKSxcbiAgdmxlbmMgPSByZXF1aXJlKCcuL2VuYycpLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEVuY29kaW5nKG1hcmt0eXBlLCBlbmMsIGRhdGEsIGNvbmZpZywgZmlsdGVyLCB0aGVtZSkge1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xuXG4gICAgdmFyIHNwZWMgPSB7XG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgbWFya3R5cGU6IG1hcmt0eXBlLFxuICAgICAgZW5jOiBlbmMsXG4gICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgIGZpbHRlcjogZmlsdGVyIHx8IFtdXG4gICAgfTtcblxuICAgIC8vIHR5cGUgdG8gYml0Y29kZVxuICAgIGZvciAodmFyIGUgaW4gZGVmYXVsdHMuZW5jKSB7XG4gICAgICBkZWZhdWx0cy5lbmNbZV0udHlwZSA9IGNvbnN0cy5kYXRhVHlwZXNbZGVmYXVsdHMuZW5jW2VdLnR5cGVdO1xuICAgIH1cblxuICAgIHZhciBzcGVjRXh0ZW5kZWQgPSBzY2hlbWEudXRpbC5tZXJnZShkZWZhdWx0cywgdGhlbWUgfHwge30sIHNwZWMpIDtcblxuICAgIHRoaXMuX2RhdGEgPSBzcGVjRXh0ZW5kZWQuZGF0YTtcbiAgICB0aGlzLl9tYXJrdHlwZSA9IHNwZWNFeHRlbmRlZC5tYXJrdHlwZTtcbiAgICB0aGlzLl9lbmMgPSBzcGVjRXh0ZW5kZWQuZW5jO1xuICAgIHRoaXMuX2NvbmZpZyA9IHNwZWNFeHRlbmRlZC5jb25maWc7XG4gICAgdGhpcy5fZmlsdGVyID0gc3BlY0V4dGVuZGVkLmZpbHRlcjtcbiAgfVxuXG4gIHZhciBwcm90byA9IEVuY29kaW5nLnByb3RvdHlwZTtcblxuICBwcm90by5tYXJrdHlwZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXJrdHlwZTtcbiAgfTtcblxuICBwcm90by5pcyA9IGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya3R5cGUgPT09IG07XG4gIH07XG5cbiAgcHJvdG8uaGFzID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICAgIC8vIGVxdWl2YWxlbnQgdG8gY2FsbGluZyB2bGVuYy5oYXModGhpcy5fZW5jLCBlbmNUeXBlKVxuICAgIHJldHVybiB0aGlzLl9lbmNbZW5jVHlwZV0ubmFtZSAhPT0gdW5kZWZpbmVkO1xuICB9O1xuXG4gIHByb3RvLmVuYyA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF07XG4gIH07XG5cbiAgcHJvdG8uZmlsdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlck51bGwgPSBbXSxcbiAgICAgIGZpZWxkcyA9IHRoaXMuZmllbGRzKCksXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIHV0aWwuZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkTGlzdCwgZmllbGROYW1lKSB7XG4gICAgICBpZiAoZmllbGROYW1lID09PSAnKicpIHJldHVybjsgLy9jb3VudFxuXG4gICAgICBpZiAoKHNlbGYuY29uZmlnKCdmaWx0ZXJOdWxsJykuUSAmJiBmaWVsZExpc3QuY29udGFpbnNUeXBlW1FdKSB8fFxuICAgICAgICAgIChzZWxmLmNvbmZpZygnZmlsdGVyTnVsbCcpLlQgJiYgZmllbGRMaXN0LmNvbnRhaW5zVHlwZVtUXSkgfHxcbiAgICAgICAgICAoc2VsZi5jb25maWcoJ2ZpbHRlck51bGwnKS5PICYmIGZpZWxkTGlzdC5jb250YWluc1R5cGVbT10pKSB7XG4gICAgICAgIGZpbHRlck51bGwucHVzaCh7XG4gICAgICAgICAgb3BlcmFuZHM6IFtmaWVsZE5hbWVdLFxuICAgICAgICAgIG9wZXJhdG9yOiAnbm90TnVsbCdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmlsdGVyTnVsbC5jb25jYXQodGhpcy5fZmlsdGVyKTtcbiAgfTtcblxuICAvLyBnZXQgXCJmaWVsZFwiIHByb3BlcnR5IGZvciB2ZWdhXG4gIHByb3RvLmZpZWxkID0gZnVuY3Rpb24oZXQsIG5vZGF0YSwgbm9mbikge1xuICAgIGlmICghdGhpcy5oYXMoZXQpKSByZXR1cm4gbnVsbDtcblxuICAgIHZhciBmID0gKG5vZGF0YSA/ICcnIDogJ2RhdGEuJyk7XG5cbiAgICBpZiAodmxmaWVsZC5pc0NvdW50KHRoaXMuX2VuY1tldF0pKSB7XG4gICAgICByZXR1cm4gZiArICdjb3VudCc7XG4gICAgfSBlbHNlIGlmICghbm9mbiAmJiB0aGlzLl9lbmNbZXRdLmJpbikge1xuICAgICAgcmV0dXJuIGYgKyAnYmluXycgKyB0aGlzLl9lbmNbZXRdLm5hbWU7XG4gICAgfSBlbHNlIGlmICghbm9mbiAmJiB0aGlzLl9lbmNbZXRdLmFnZ3IpIHtcbiAgICAgIHJldHVybiBmICsgdGhpcy5fZW5jW2V0XS5hZ2dyICsgJ18nICsgdGhpcy5fZW5jW2V0XS5uYW1lO1xuICAgIH0gZWxzZSBpZiAoIW5vZm4gJiYgdGhpcy5fZW5jW2V0XS5mbikge1xuICAgICAgcmV0dXJuIGYgKyB0aGlzLl9lbmNbZXRdLmZuICsgJ18nICsgdGhpcy5fZW5jW2V0XS5uYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZiArIHRoaXMuX2VuY1tldF0ubmFtZTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdG8uZmllbGROYW1lID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5uYW1lO1xuICB9O1xuXG4gIC8qXG4gICAqIHJldHVybiBrZXktdmFsdWUgcGFpcnMgb2YgZmllbGQgbmFtZSBhbmQgbGlzdCBvZiBmaWVsZHMgb2YgdGhhdCBmaWVsZCBuYW1lXG4gICAqL1xuICBwcm90by5maWVsZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmxlbmMuZmllbGRzKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgcHJvdG8uZmllbGRUaXRsZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgaWYgKHZsZmllbGQuaXNDb3VudCh0aGlzLl9lbmNbZXRdKSkge1xuICAgICAgcmV0dXJuIHZsZmllbGQuY291bnQuZGlzcGxheU5hbWU7XG4gICAgfVxuICAgIHZhciBmbiA9IHRoaXMuX2VuY1tldF0uYWdnciB8fCB0aGlzLl9lbmNbZXRdLmZuIHx8ICh0aGlzLl9lbmNbZXRdLmJpbiAmJiBcImJpblwiKTtcbiAgICBpZiAoZm4pIHtcbiAgICAgIHJldHVybiBmbi50b1VwcGVyQ2FzZSgpICsgJygnICsgdGhpcy5fZW5jW2V0XS5uYW1lICsgJyknO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5uYW1lO1xuICAgIH1cbiAgfTtcblxuICBwcm90by5zY2FsZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uc2NhbGUgfHwge307XG4gIH07XG5cbiAgcHJvdG8uYXhpcyA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uYXhpcyB8fCB7fTtcbiAgfTtcblxuICBwcm90by5iYW5kID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5iYW5kIHx8IHt9O1xuICB9O1xuXG4gIHByb3RvLmJhbmRTaXplID0gZnVuY3Rpb24oZW5jVHlwZSwgdXNlU21hbGxCYW5kKSB7XG4gICAgdXNlU21hbGxCYW5kID0gdXNlU21hbGxCYW5kIHx8XG4gICAgICAvL2lzQmFuZEluU21hbGxNdWx0aXBsZXNcbiAgICAgIChlbmNUeXBlID09PSBZICYmIHRoaXMuaGFzKFJPVykgJiYgdGhpcy5oYXMoWSkpIHx8XG4gICAgICAoZW5jVHlwZSA9PT0gWCAmJiB0aGlzLmhhcyhDT0wpICYmIHRoaXMuaGFzKFgpKTtcblxuICAgIC8vIGlmIGJhbmQuc2l6ZSBpcyBleHBsaWNpdGx5IHNwZWNpZmllZCwgZm9sbG93IHRoZSBzcGVjaWZpY2F0aW9uLCBvdGhlcndpc2UgZHJhdyB2YWx1ZSBmcm9tIGNvbmZpZy5cbiAgICByZXR1cm4gdGhpcy5iYW5kKGVuY1R5cGUpLnNpemUgfHxcbiAgICAgIHRoaXMuY29uZmlnKHVzZVNtYWxsQmFuZCA/ICdzbWFsbEJhbmRTaXplJyA6ICdsYXJnZUJhbmRTaXplJyk7XG4gIH07XG5cbiAgcHJvdG8uYWdnciA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uYWdncjtcbiAgfTtcblxuICAvLyByZXR1cm5zIGZhbHNlIGlmIGJpbm5pbmcgaXMgZGlzYWJsZWQsIG90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBiaW5uaW5nIHByb3BlcnRpZXNcbiAgcHJvdG8uYmluID0gZnVuY3Rpb24oZXQpIHtcbiAgICB2YXIgYmluID0gdGhpcy5fZW5jW2V0XS5iaW47XG4gICAgaWYgKGJpbiA9PT0ge30pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGJpbiA9PT0gdHJ1ZSlcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1heGJpbnM6IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFRcbiAgICAgIH07XG4gICAgcmV0dXJuIGJpbjtcbiAgfTtcblxuICBwcm90by5sZWdlbmQgPSBmdW5jdGlvbihldCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbZXRdLmxlZ2VuZDtcbiAgfTtcblxuICBwcm90by52YWx1ZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0udmFsdWU7XG4gIH07XG5cbiAgcHJvdG8uZm4gPSBmdW5jdGlvbihldCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbZXRdLmZuO1xuICB9O1xuXG4gIHByb3RvLnNvcnQgPSBmdW5jdGlvbihldCwgc3RhdHMpIHtcbiAgICB2YXIgc29ydCA9IHRoaXMuX2VuY1tldF0uc29ydCxcbiAgICAgIGVuYyA9IHRoaXMuX2VuYyxcbiAgICAgIGlzVHlwZSA9IHZsZmllbGQuaXNUeXBlLmJ5Q29kZTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdzb3J0OicsIHNvcnQsICdzdXBwb3J0OicsIEVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydCh7ZW5jOnRoaXMuX2VuY30sIHN0YXRzKSAsICd0b2dnbGU6JywgdGhpcy5jb25maWcoJ3RvZ2dsZVNvcnQnKSlcblxuICAgIGlmICgoIXNvcnQgfHwgc29ydC5sZW5ndGg9PT0wKSAmJlxuICAgICAgICBFbmNvZGluZy50b2dnbGVTb3J0LnN1cHBvcnQoe2VuYzp0aGlzLl9lbmN9LCBzdGF0cywgdHJ1ZSkgJiYgLy9IQUNLXG4gICAgICAgIHRoaXMuY29uZmlnKCd0b2dnbGVTb3J0JykgPT09ICdRJ1xuICAgICAgKSB7XG4gICAgICB2YXIgcUZpZWxkID0gaXNUeXBlKGVuYy54LCBPKSA/IGVuYy55IDogZW5jLng7XG5cbiAgICAgIGlmIChpc1R5cGUoZW5jW2V0XSwgTykpIHtcbiAgICAgICAgc29ydCA9IFt7XG4gICAgICAgICAgbmFtZTogcUZpZWxkLm5hbWUsXG4gICAgICAgICAgYWdncjogcUZpZWxkLmFnZ3IsXG4gICAgICAgICAgdHlwZTogcUZpZWxkLnR5cGUsXG4gICAgICAgICAgcmV2ZXJzZTogdHJ1ZVxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc29ydDtcbiAgfTtcblxuICBwcm90by5sZW5ndGggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdXRpbC5rZXlzKHRoaXMuX2VuYykubGVuZ3RoO1xuICB9O1xuXG4gIHByb3RvLm1hcCA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gdmxlbmMubWFwKHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8ucmVkdWNlID0gZnVuY3Rpb24oZiwgaW5pdCkge1xuICAgIHJldHVybiB2bGVuYy5yZWR1Y2UodGhpcy5fZW5jLCBmLCBpbml0KTtcbiAgfTtcblxuICBwcm90by5mb3JFYWNoID0gZnVuY3Rpb24oZikge1xuICAgIHJldHVybiB2bGVuYy5mb3JFYWNoKHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8udHlwZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGV0KSA/IHRoaXMuX2VuY1tldF0udHlwZSA6IG51bGw7XG4gIH07XG5cbiAgcHJvdG8ucm9sZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGV0KSA/IHZsZmllbGQucm9sZSh0aGlzLl9lbmNbZXRdKSA6IG51bGw7XG4gIH07XG5cbiAgcHJvdG8udGV4dCA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMuX2VuY1tURVhUXS50ZXh0O1xuICAgIHJldHVybiBwcm9wID8gdGV4dFtwcm9wXSA6IHRleHQ7XG4gIH07XG5cbiAgcHJvdG8uZm9udCA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgICB2YXIgZm9udCA9IHRoaXMuX2VuY1tURVhUXS5mb250O1xuICAgIHJldHVybiBwcm9wID8gZm9udFtwcm9wXSA6IGZvbnQ7XG4gIH07XG5cbiAgcHJvdG8uaXNUeXBlID0gZnVuY3Rpb24oZXQsIHR5cGUpIHtcbiAgICB2YXIgZmllbGQgPSB0aGlzLmVuYyhldCk7XG4gICAgcmV0dXJuIGZpZWxkICYmIEVuY29kaW5nLmlzVHlwZShmaWVsZCwgdHlwZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNUeXBlID0gZnVuY3Rpb24gKGZpZWxkRGVmLCB0eXBlKSB7XG4gICAgLy8gRklYTUUgdmxmaWVsZC5pc1R5cGVcbiAgICByZXR1cm4gKGZpZWxkRGVmLnR5cGUgJiB0eXBlKSA+IDA7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUgPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzT3JkaW5hbFNjYWxlKGVuY29kaW5nLmVuYyhlbmNUeXBlKSwgdHJ1ZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzRGltZW5zaW9uKGVuY29kaW5nLmVuYyhlbmNUeXBlKSwgdHJ1ZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNNZWFzdXJlID0gZnVuY3Rpb24oZW5jb2RpbmcsIGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5pc01lYXN1cmUoZW5jb2RpbmcuZW5jKGVuY1R5cGUpLCB0cnVlKTtcbiAgfTtcblxuICBwcm90by5pc09yZGluYWxTY2FsZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoZW5jVHlwZSkgJiYgRW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUodGhpcywgZW5jVHlwZSk7XG4gIH07XG5cbiAgcHJvdG8uaXNEaW1lbnNpb24gPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzRGltZW5zaW9uKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzTWVhc3VyZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoZW5jVHlwZSkgJiYgRW5jb2RpbmcuaXNNZWFzdXJlKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzQWdncmVnYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNBZ2dyZWdhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHNwZWMuZW5jKTtcbiAgfTtcblxuICBFbmNvZGluZy5hbHdheXNOb09jY2x1c2lvbiA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICAvLyBGSVhNRSByYXcgT3hRIHdpdGggIyBvZiByb3dzID0gIyBvZiBPXG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHNwZWMuZW5jKTtcbiAgfTtcblxuICBFbmNvZGluZy5pc1N0YWNrID0gZnVuY3Rpb24oc3BlYykge1xuICAgIC8vIEZJWE1FIHVwZGF0ZSB0aGlzIG9uY2Ugd2UgaGF2ZSBjb250cm9sIGZvciBzdGFjayAuLi5cbiAgICByZXR1cm4gKHNwZWMubWFya3R5cGUgPT09ICdiYXInIHx8IHNwZWMubWFya3R5cGUgPT09ICdhcmVhJykgJiZcbiAgICAgIHNwZWMuZW5jLmNvbG9yO1xuICB9O1xuXG4gIHByb3RvLmlzU3RhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBGSVhNRSB1cGRhdGUgdGhpcyBvbmNlIHdlIGhhdmUgY29udHJvbCBmb3Igc3RhY2sgLi4uXG4gICAgcmV0dXJuICh0aGlzLmlzKCdiYXInKSB8fCB0aGlzLmlzKCdhcmVhJykpICYmIHRoaXMuaGFzKCdjb2xvcicpO1xuICB9O1xuXG4gIHByb3RvLmNhcmRpbmFsaXR5ID0gZnVuY3Rpb24oZW5jVHlwZSwgc3RhdHMpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5jYXJkaW5hbGl0eSh0aGlzLmVuYyhlbmNUeXBlKSwgc3RhdHMsIHRoaXMuY29uZmlnKCdmaWx0ZXJOdWxsJyksIHRydWUpO1xuICB9O1xuXG4gIHByb3RvLmlzUmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzQWdncmVnYXRlKCk7XG4gIH07XG5cbiAgcHJvdG8uZGF0YSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YVtuYW1lXTtcbiAgfTtcblxuICAgLy8gcmV0dXJucyB3aGV0aGVyIHRoZSBlbmNvZGluZyBoYXMgdmFsdWVzIGVtYmVkZGVkXG4gIHByb3RvLmhhc1ZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWxzID0gdGhpcy5kYXRhKCd2YWx1ZXMnKTtcbiAgICByZXR1cm4gdmFscyAmJiB2YWxzLmxlbmd0aDtcbiAgfTtcblxuICBwcm90by5jb25maWcgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZ1tuYW1lXTtcbiAgfTtcblxuICBwcm90by50b1NwZWMgPSBmdW5jdGlvbihleGNsdWRlQ29uZmlnLCBleGNsdWRlRGF0YSkge1xuICAgIHZhciBlbmMgPSB1dGlsLmR1cGxpY2F0ZSh0aGlzLl9lbmMpLFxuICAgICAgc3BlYztcblxuICAgIC8vIGNvbnZlcnQgdHlwZSdzIGJpdGNvZGUgdG8gdHlwZSBuYW1lXG4gICAgZm9yICh2YXIgZSBpbiBlbmMpIHtcbiAgICAgIGVuY1tlXS50eXBlID0gY29uc3RzLmRhdGFUeXBlTmFtZXNbZW5jW2VdLnR5cGVdO1xuICAgIH1cblxuICAgIHNwZWMgPSB7XG4gICAgICBtYXJrdHlwZTogdGhpcy5fbWFya3R5cGUsXG4gICAgICBlbmM6IGVuYyxcbiAgICAgIGZpbHRlcjogdGhpcy5fZmlsdGVyXG4gICAgfTtcblxuICAgIGlmICghZXhjbHVkZUNvbmZpZykge1xuICAgICAgc3BlYy5jb25maWcgPSB1dGlsLmR1cGxpY2F0ZSh0aGlzLl9jb25maWcpO1xuICAgIH1cblxuICAgIGlmICghZXhjbHVkZURhdGEpIHtcbiAgICAgIHNwZWMuZGF0YSA9IHV0aWwuZHVwbGljYXRlKHRoaXMuX2RhdGEpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBkZWZhdWx0c1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xuICAgIHJldHVybiBzY2hlbWEudXRpbC5zdWJ0cmFjdChzcGVjLCBkZWZhdWx0cyk7XG4gIH07XG5cbiAgcHJvdG8udG9TaG9ydGhhbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQ7XG4gICAgcmV0dXJuICdtYXJrJyArIGMuYXNzaWduICsgdGhpcy5fbWFya3R5cGUgK1xuICAgICAgYy5kZWxpbSArIHZsZW5jLnNob3J0aGFuZCh0aGlzLl9lbmMpO1xuICB9O1xuXG4gIEVuY29kaW5nLnNob3J0aGFuZCA9IGZ1bmN0aW9uIChzcGVjKSB7XG4gICAgdmFyIGMgPSBjb25zdHMuc2hvcnRoYW5kO1xuICAgIHJldHVybiAnbWFyaycgKyBjLmFzc2lnbiArIHNwZWMubWFya3R5cGUgK1xuICAgICAgYy5kZWxpbSArIHZsZW5jLnNob3J0aGFuZChzcGVjLmVuYyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuZnJvbVNob3J0aGFuZCA9IGZ1bmN0aW9uKHNob3J0aGFuZCwgZGF0YSwgY29uZmlnLCB0aGVtZSkge1xuICAgIHZhciBjID0gY29uc3RzLnNob3J0aGFuZCxcbiAgICAgICAgc3BsaXQgPSBzaG9ydGhhbmQuc3BsaXQoYy5kZWxpbSksXG4gICAgICAgIG1hcmt0eXBlID0gc3BsaXQuc2hpZnQoKS5zcGxpdChjLmFzc2lnbilbMV0udHJpbSgpLFxuICAgICAgICBlbmMgPSB2bGVuYy5mcm9tU2hvcnRoYW5kKHNwbGl0LCB0cnVlKTtcblxuICAgIHJldHVybiBuZXcgRW5jb2RpbmcobWFya3R5cGUsIGVuYywgZGF0YSwgY29uZmlnLCBudWxsLCB0aGVtZSk7XG4gIH07XG5cbiAgRW5jb2Rpbmcuc3BlY0Zyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGRhdGEsIGNvbmZpZywgZXhjbHVkZUNvbmZpZykge1xuICAgIHJldHVybiBFbmNvZGluZy5mcm9tU2hvcnRoYW5kKHNob3J0aGFuZCwgZGF0YSwgY29uZmlnKS50b1NwZWMoZXhjbHVkZUNvbmZpZyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuZnJvbVNwZWMgPSBmdW5jdGlvbihzcGVjLCB0aGVtZSkge1xuICAgIHZhciBlbmMgPSB1dGlsLmR1cGxpY2F0ZShzcGVjLmVuYyB8fCB7fSk7XG5cbiAgICAvL2NvbnZlcnQgdHlwZSBmcm9tIHN0cmluZyB0byBiaXRjb2RlIChlLmcsIE89MSlcbiAgICBmb3IgKHZhciBlIGluIGVuYykge1xuICAgICAgZW5jW2VdLnR5cGUgPSBjb25zdHMuZGF0YVR5cGVzW2VuY1tlXS50eXBlXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEVuY29kaW5nKHNwZWMubWFya3R5cGUsIGVuYywgc3BlYy5kYXRhLCBzcGVjLmNvbmZpZywgc3BlYy5maWx0ZXIsIHRoZW1lKTtcbiAgfTtcblxuICBFbmNvZGluZy50cmFuc3Bvc2UgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgdmFyIG9sZGVuYyA9IHNwZWMuZW5jLFxuICAgICAgZW5jID0gdXRpbC5kdXBsaWNhdGUoc3BlYy5lbmMpO1xuICAgIGVuYy54ID0gb2xkZW5jLnk7XG4gICAgZW5jLnkgPSBvbGRlbmMueDtcbiAgICBlbmMucm93ID0gb2xkZW5jLmNvbDtcbiAgICBlbmMuY29sID0gb2xkZW5jLnJvdztcbiAgICBzcGVjLmVuYyA9IGVuYztcbiAgICByZXR1cm4gc3BlYztcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVTb3J0ID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHNwZWMuY29uZmlnID0gc3BlYy5jb25maWcgfHwge307XG4gICAgc3BlYy5jb25maWcudG9nZ2xlU29ydCA9IHNwZWMuY29uZmlnLnRvZ2dsZVNvcnQgPT09ICdRJyA/ICdPJyA6J1EnO1xuICAgIHJldHVybiBzcGVjO1xuICB9O1xuXG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5kaXJlY3Rpb24gPSBmdW5jdGlvbihzcGVjLCB1c2VUeXBlQ29kZSkge1xuICAgIGlmICghRW5jb2RpbmcudG9nZ2xlU29ydC5zdXBwb3J0KHNwZWMsIHVzZVR5cGVDb2RlKSkgeyByZXR1cm47IH1cbiAgICB2YXIgZW5jID0gc3BlYy5lbmM7XG4gICAgcmV0dXJuIGVuYy54LnR5cGUgPT09ICdPJyA/ICd4JyA6ICAneSc7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5tb2RlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBzcGVjLmNvbmZpZy50b2dnbGVTb3J0O1xuICB9O1xuXG4gIEVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydCA9IGZ1bmN0aW9uKHNwZWMsIHN0YXRzLCB1c2VUeXBlQ29kZSkge1xuICAgIHZhciBlbmMgPSBzcGVjLmVuYyxcbiAgICAgIGlzVHlwZSA9IHZsZmllbGQuaXNUeXBlLmdldCh1c2VUeXBlQ29kZSk7XG5cbiAgICBpZiAodmxlbmMuaGFzKGVuYywgUk9XKSB8fCB2bGVuYy5oYXMoZW5jLCBDT0wpIHx8XG4gICAgICAhdmxlbmMuaGFzKGVuYywgWCkgfHwgIXZsZW5jLmhhcyhlbmMsIFkpIHx8XG4gICAgICAhRW5jb2RpbmcuYWx3YXlzTm9PY2NsdXNpb24oc3BlYywgc3RhdHMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuICggaXNUeXBlKGVuYy54LCBPKSAmJiB2bGZpZWxkLmlzTWVhc3VyZShlbmMueSwgdXNlVHlwZUNvZGUpKSA/ICd4JyA6XG4gICAgICAoIGlzVHlwZShlbmMueSwgTykgJiYgdmxmaWVsZC5pc01lYXN1cmUoZW5jLngsIHVzZVR5cGVDb2RlKSkgPyAneScgOiBmYWxzZTtcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVGaWx0ZXJOdWxsTyA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICBzcGVjLmNvbmZpZyA9IHNwZWMuY29uZmlnIHx8IHt9O1xuICAgIHNwZWMuY29uZmlnLmZpbHRlck51bGwgPSBzcGVjLmNvbmZpZy5maWx0ZXJOdWxsIHx8IHsgLy9GSVhNRVxuICAgICAgVDogdHJ1ZSxcbiAgICAgIFE6IHRydWVcbiAgICB9O1xuICAgIHNwZWMuY29uZmlnLmZpbHRlck51bGwuTyA9ICFzcGVjLmNvbmZpZy5maWx0ZXJOdWxsLk87XG4gICAgcmV0dXJuIHNwZWM7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlRmlsdGVyTnVsbE8uc3VwcG9ydCA9IGZ1bmN0aW9uKHNwZWMsIHN0YXRzKSB7XG4gICAgdmFyIGZpZWxkcyA9IHZsZW5jLmZpZWxkcyhzcGVjLmVuYyk7XG4gICAgZm9yICh2YXIgZmllbGROYW1lIGluIGZpZWxkcykge1xuICAgICAgdmFyIGZpZWxkTGlzdCA9IGZpZWxkc1tmaWVsZE5hbWVdO1xuICAgICAgaWYgKGZpZWxkTGlzdC5jb250YWluc1R5cGUuTyAmJiBmaWVsZE5hbWUgaW4gc3RhdHMgJiYgc3RhdHNbZmllbGROYW1lXS5udWxscyA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZXR1cm4gRW5jb2Rpbmc7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFnZ3JlZ2F0ZXM7XG5cbmZ1bmN0aW9uIGFnZ3JlZ2F0ZXMoc3BlYywgZW5jb2RpbmcsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG5cbiAgdmFyIGRpbXMgPSB7fSwgbWVhcyA9IHt9LCBkZXRhaWwgPSB7fSwgZmFjZXRzID0ge30sXG4gICAgZGF0YSA9IHNwZWMuZGF0YVsxXTsgLy8gY3VycmVudGx5IGRhdGFbMF0gaXMgcmF3IGFuZCBkYXRhWzFdIGlzIHRhYmxlXG5cbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChmaWVsZC5hZ2dyKSB7XG4gICAgICBpZiAoZmllbGQuYWdnciA9PT0gJ2NvdW50Jykge1xuICAgICAgICBtZWFzLmNvdW50ID0ge29wOiAnY291bnQnLCBmaWVsZDogJyonfTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgbWVhc1tmaWVsZC5hZ2dyICsgJ3wnKyBmaWVsZC5uYW1lXSA9IHtcbiAgICAgICAgICBvcDogZmllbGQuYWdncixcbiAgICAgICAgICBmaWVsZDogJ2RhdGEuJysgZmllbGQubmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkaW1zW2ZpZWxkLm5hbWVdID0gZW5jb2RpbmcuZmllbGQoZW5jVHlwZSk7XG4gICAgICBpZiAoZW5jVHlwZSA9PSBST1cgfHwgZW5jVHlwZSA9PSBDT0wpIHtcbiAgICAgICAgZmFjZXRzW2ZpZWxkLm5hbWVdID0gZGltc1tmaWVsZC5uYW1lXTtcbiAgICAgIH1lbHNlIGlmIChlbmNUeXBlICE9PSBYICYmIGVuY1R5cGUgIT09IFkpIHtcbiAgICAgICAgZGV0YWlsW2ZpZWxkLm5hbWVdID0gZGltc1tmaWVsZC5uYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBkaW1zID0gdXRpbC52YWxzKGRpbXMpO1xuICBtZWFzID0gdXRpbC52YWxzKG1lYXMpO1xuXG4gIGlmIChtZWFzLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoIWRhdGEudHJhbnNmb3JtKSBkYXRhLnRyYW5zZm9ybSA9IFtdO1xuICAgIGRhdGEudHJhbnNmb3JtLnB1c2goe1xuICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICBncm91cGJ5OiBkaW1zLFxuICAgICAgZmllbGRzOiBtZWFzXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBkZXRhaWxzOiB1dGlsLnZhbHMoZGV0YWlsKSxcbiAgICBkaW1zOiBkaW1zLFxuICAgIGZhY2V0czogdXRpbC52YWxzKGZhY2V0cyksXG4gICAgYWdncmVnYXRlZDogbWVhcy5sZW5ndGggPiAwXG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHNldHRlciA9IHV0aWwuc2V0dGVyLFxuICBnZXR0ZXIgPSB1dGlsLmdldHRlcixcbiAgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG52YXIgYXhpcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmF4aXMubmFtZXMgPSBmdW5jdGlvbihwcm9wcykge1xuICByZXR1cm4gdXRpbC5rZXlzKHV0aWwua2V5cyhwcm9wcykucmVkdWNlKGZ1bmN0aW9uKGEsIHgpIHtcbiAgICB2YXIgcyA9IHByb3BzW3hdLnNjYWxlO1xuICAgIGlmIChzID09PSBYIHx8IHMgPT09IFkpIGFbcHJvcHNbeF0uc2NhbGVdID0gMTtcbiAgICByZXR1cm4gYTtcbiAgfSwge30pKTtcbn07XG5cbmF4aXMuZGVmcyA9IGZ1bmN0aW9uKG5hbWVzLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KSB7XG4gIHJldHVybiBuYW1lcy5yZWR1Y2UoZnVuY3Rpb24oYSwgbmFtZSkge1xuICAgIGEucHVzaChheGlzLmRlZihuYW1lLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KSk7XG4gICAgcmV0dXJuIGE7XG4gIH0sIFtdKTtcbn07XG5cbmF4aXMuZGVmID0gZnVuY3Rpb24obmFtZSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMsIG9wdCkge1xuICB2YXIgdHlwZSA9IG5hbWU7XG4gIHZhciBpc0NvbCA9IG5hbWUgPT0gQ09MLCBpc1JvdyA9IG5hbWUgPT0gUk9XO1xuICB2YXIgcm93T2Zmc2V0ID0gYXhpc1RpdGxlT2Zmc2V0KGVuY29kaW5nLCBsYXlvdXQsIFkpICsgMjAsXG4gICAgY2VsbFBhZGRpbmcgPSBsYXlvdXQuY2VsbFBhZGRpbmc7XG5cblxuICBpZiAoaXNDb2wpIHR5cGUgPSAneCc7XG4gIGlmIChpc1JvdykgdHlwZSA9ICd5JztcblxuICB2YXIgZGVmID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgc2NhbGU6IG5hbWVcbiAgfTtcblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS5ncmlkKSB7XG4gICAgZGVmLmdyaWQgPSB0cnVlO1xuICAgIGRlZi5sYXllciA9IChpc1JvdyB8fCBpc0NvbCkgPyAnZnJvbnQnIDogICdiYWNrJztcblxuICAgIGlmIChpc0NvbCkge1xuICAgICAgLy8gc2V0IGdyaWQgcHJvcGVydHkgLS0gcHV0IHRoZSBsaW5lcyBvbiB0aGUgcmlnaHQgdGhlIGNlbGxcbiAgICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsICdncmlkJ10sIHtcbiAgICAgICAgeDoge1xuICAgICAgICAgIG9mZnNldDogbGF5b3V0LmNlbGxXaWR0aCAqICgxKyBjZWxsUGFkZGluZy8yLjApLFxuICAgICAgICAgIC8vIGRlZmF1bHQgdmFsdWUocykgLS0gdmVnYSBkb2Vzbid0IGRvIHJlY3Vyc2l2ZSBtZXJnZVxuICAgICAgICAgIHNjYWxlOiAnY29sJ1xuICAgICAgICB9LFxuICAgICAgICB5OiB7XG4gICAgICAgICAgdmFsdWU6IC1sYXlvdXQuY2VsbEhlaWdodCAqIChjZWxsUGFkZGluZy8yKSxcbiAgICAgICAgfSxcbiAgICAgICAgc3Ryb2tlOiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxHcmlkQ29sb3InKSB9LFxuICAgICAgICBvcGFjaXR5OiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxHcmlkT3BhY2l0eScpIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoaXNSb3cpIHtcbiAgICAgIC8vIHNldCBncmlkIHByb3BlcnR5IC0tIHB1dCB0aGUgbGluZXMgb24gdGhlIHRvcFxuICAgICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ2dyaWQnXSwge1xuICAgICAgICB5OiB7XG4gICAgICAgICAgb2Zmc2V0OiAtbGF5b3V0LmNlbGxIZWlnaHQgKiAoY2VsbFBhZGRpbmcvMiksXG4gICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZShzKSAtLSB2ZWdhIGRvZXNuJ3QgZG8gcmVjdXJzaXZlIG1lcmdlXG4gICAgICAgICAgc2NhbGU6ICdyb3cnXG4gICAgICAgIH0sXG4gICAgICAgIHg6IHtcbiAgICAgICAgICB2YWx1ZTogcm93T2Zmc2V0XG4gICAgICAgIH0sXG4gICAgICAgIHgyOiB7XG4gICAgICAgICAgb2Zmc2V0OiByb3dPZmZzZXQgKyAobGF5b3V0LmNlbGxXaWR0aCAqIDAuMDUpLFxuICAgICAgICAgIC8vIGRlZmF1bHQgdmFsdWUocykgLS0gdmVnYSBkb2Vzbid0IGRvIHJlY3Vyc2l2ZSBtZXJnZVxuICAgICAgICAgIGdyb3VwOiBcIm1hcmsuZ3JvdXAud2lkdGhcIixcbiAgICAgICAgICBtdWx0OiAxXG4gICAgICAgIH0sXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZENvbG9yJykgfSxcbiAgICAgICAgb3BhY2l0eTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZE9wYWNpdHknKSB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ2dyaWQnXSwge1xuICAgICAgICBzdHJva2U6IHsgdmFsdWU6IGVuY29kaW5nLmNvbmZpZygnZ3JpZENvbG9yJykgfSxcbiAgICAgICAgb3BhY2l0eTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdncmlkT3BhY2l0eScpIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbmNvZGluZy5heGlzKG5hbWUpLnRpdGxlKSB7XG4gICAgZGVmID0gYXhpc190aXRsZShkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIG9wdCk7XG4gIH1cblxuICBpZiAoaXNSb3cgfHwgaXNDb2wpIHtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAndGlja3MnXSwge1xuICAgICAgb3BhY2l0eToge3ZhbHVlOiAwfVxuICAgIH0pO1xuICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsICdtYWpvclRpY2tzJ10sIHtcbiAgICAgIG9wYWNpdHk6IHt2YWx1ZTogMH1cbiAgICB9KTtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnYXhpcyddLCB7XG4gICAgICBvcGFjaXR5OiB7dmFsdWU6IDB9XG4gICAgfSk7XG4gIH1cblxuICBpZiAoaXNDb2wpIHtcbiAgICBkZWYub3JpZW50ID0gJ3RvcCc7XG4gIH1cblxuICBpZiAoaXNSb3cpIHtcbiAgICBkZWYub2Zmc2V0ID0gcm93T2Zmc2V0O1xuICB9XG5cbiAgaWYgKG5hbWUgPT0gWCkge1xuICAgIGlmIChlbmNvZGluZy5oYXMoWSkgJiYgZW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUoWSkgJiYgZW5jb2RpbmcuY2FyZGluYWxpdHkoWSwgc3RhdHMpID4gMzApIHtcbiAgICAgIGRlZi5vcmllbnQgPSAndG9wJztcbiAgICB9XG5cbiAgICBpZiAoZW5jb2RpbmcuaXNEaW1lbnNpb24oWCkgfHwgZW5jb2RpbmcuaXNUeXBlKFgsIFQpKSB7XG4gICAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCdsYWJlbHMnXSwge1xuICAgICAgICBhbmdsZToge3ZhbHVlOiAyNzB9LFxuICAgICAgICBhbGlnbjoge3ZhbHVlOiAncmlnaHQnfSxcbiAgICAgICAgYmFzZWxpbmU6IHt2YWx1ZTogJ21pZGRsZSd9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgeyAvLyBRXG4gICAgICBkZWYudGlja3MgPSA1O1xuICAgIH1cbiAgfVxuXG4gIGRlZiA9IGF4aXNfbGFiZWxzKGRlZiwgbmFtZSwgZW5jb2RpbmcsIGxheW91dCwgb3B0KTtcblxuICByZXR1cm4gZGVmO1xufTtcblxuZnVuY3Rpb24gYXhpc190aXRsZShkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIG9wdCkge1xuICAvLyBqc2hpbnQgdW51c2VkOmZhbHNlXG5cbiAgdmFyIG1heGxlbmd0aCA9IG51bGwsXG4gICAgZmllbGRUaXRsZSA9IGVuY29kaW5nLmZpZWxkVGl0bGUobmFtZSk7XG4gIGlmIChuYW1lPT09WCkge1xuICAgIG1heGxlbmd0aCA9IGxheW91dC5jZWxsV2lkdGggLyBlbmNvZGluZy5jb25maWcoJ2NoYXJhY3RlcldpZHRoJyk7XG4gIH0gZWxzZSBpZiAobmFtZSA9PT0gWSkge1xuICAgIG1heGxlbmd0aCA9IGxheW91dC5jZWxsSGVpZ2h0IC8gZW5jb2RpbmcuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpO1xuICB9XG5cbiAgZGVmLnRpdGxlID0gbWF4bGVuZ3RoID8gdXRpbC50cnVuY2F0ZShmaWVsZFRpdGxlLCBtYXhsZW5ndGgpIDogZmllbGRUaXRsZTtcblxuICBpZiAobmFtZSA9PT0gUk9XKSB7XG4gICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywndGl0bGUnXSwge1xuICAgICAgYW5nbGU6IHt2YWx1ZTogMH0sXG4gICAgICBhbGlnbjoge3ZhbHVlOiAncmlnaHQnfSxcbiAgICAgIGJhc2VsaW5lOiB7dmFsdWU6ICdtaWRkbGUnfSxcbiAgICAgIGR5OiB7dmFsdWU6ICgtbGF5b3V0LmhlaWdodC8yKSAtMjB9XG4gICAgfSk7XG4gIH1cblxuICBkZWYudGl0bGVPZmZzZXQgPSBheGlzVGl0bGVPZmZzZXQoZW5jb2RpbmcsIGxheW91dCwgbmFtZSk7XG4gIHJldHVybiBkZWY7XG59XG5cbmZ1bmN0aW9uIGF4aXNfbGFiZWxzKGRlZiwgbmFtZSwgZW5jb2RpbmcsIGxheW91dCwgb3B0KSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcblxuICB2YXIgZm47XG4gIC8vIGFkZCBjdXN0b20gbGFiZWwgZm9yIHRpbWUgdHlwZVxuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmIChmbiA9IGVuY29kaW5nLmZuKG5hbWUpKSAmJiAodGltZS5oYXNTY2FsZShmbikpKSB7XG4gICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywnbGFiZWxzJywndGV4dCcsJ3NjYWxlJ10sICd0aW1lLScrIGZuKTtcbiAgfVxuXG4gIHZhciB0ZXh0VGVtcGxhdGVQYXRoID0gWydwcm9wZXJ0aWVzJywnbGFiZWxzJywndGV4dCcsJ3RlbXBsYXRlJ107XG4gIGlmIChlbmNvZGluZy5heGlzKG5hbWUpLmZvcm1hdCkge1xuICAgIGRlZi5mb3JtYXQgPSBlbmNvZGluZy5heGlzKG5hbWUpLmZvcm1hdDtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGUobmFtZSwgUSkpIHtcbiAgICBzZXR0ZXIoZGVmLCB0ZXh0VGVtcGxhdGVQYXRoLCBcInt7ZGF0YSB8IG51bWJlcjonLjNzJ319XCIpO1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJiAhZW5jb2RpbmcuZm4obmFtZSkpIHtcbiAgICBzZXR0ZXIoZGVmLCB0ZXh0VGVtcGxhdGVQYXRoLCBcInt7ZGF0YSB8IHRpbWU6JyVZLSVtLSVkJ319XCIpO1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJiBlbmNvZGluZy5mbihuYW1lKSA9PT0gJ3llYXInKSB7XG4gICAgc2V0dGVyKGRlZiwgdGV4dFRlbXBsYXRlUGF0aCwgXCJ7e2RhdGEgfCBudW1iZXI6J2QnfX1cIik7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIE8pICYmIGVuY29kaW5nLmF4aXMobmFtZSkubWF4TGFiZWxMZW5ndGgpIHtcbiAgICBzZXR0ZXIoZGVmLCB0ZXh0VGVtcGxhdGVQYXRoLCAne3tkYXRhIHwgdHJ1bmNhdGU6JyArIGVuY29kaW5nLmF4aXMobmFtZSkubWF4TGFiZWxMZW5ndGggKyAnfX0nKTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59XG5cbmZ1bmN0aW9uIGF4aXNUaXRsZU9mZnNldChlbmNvZGluZywgbGF5b3V0LCBuYW1lKSB7XG4gIHZhciB2YWx1ZSA9IGVuY29kaW5nLmF4aXMobmFtZSkudGl0bGVPZmZzZXQ7XG4gIGlmICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICBjYXNlIFJPVzogcmV0dXJuIDA7XG4gICAgY2FzZSBDT0w6IHJldHVybiAzNTtcbiAgfVxuICByZXR1cm4gZ2V0dGVyKGxheW91dCwgW25hbWUsICdheGlzVGl0bGVPZmZzZXQnXSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiaW5uaW5nO1xuXG5mdW5jdGlvbiBiaW5uaW5nKHNwZWMsIGVuY29kaW5nLCBvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIGlmICghc3BlYy50cmFuc2Zvcm0pIHNwZWMudHJhbnNmb3JtID0gW107XG5cbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChlbmNvZGluZy5iaW4oZW5jVHlwZSkpIHtcbiAgICAgIHNwZWMudHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnYmluJyxcbiAgICAgICAgZmllbGQ6ICdkYXRhLicgKyBmaWVsZC5uYW1lLFxuICAgICAgICBvdXRwdXQ6ICdkYXRhLmJpbl8nICsgZmllbGQubmFtZSxcbiAgICAgICAgbWF4YmluczogZW5jb2RpbmcuYmluKGVuY1R5cGUpLm1heGJpbnNcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdW1tYXJ5ID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdkYXRhbGliL3NyYy9zdW1tYXJ5Jyk7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlO1xuXG52YXIgRW5jb2RpbmcgPSByZXF1aXJlKCcuLi9FbmNvZGluZycpLFxuICBheGlzID0gY29tcGlsZS5heGlzID0gcmVxdWlyZSgnLi9heGlzJyksXG4gIGZpbHRlciA9IGNvbXBpbGUuZmlsdGVyID0gcmVxdWlyZSgnLi9maWx0ZXInKSxcbiAgbGVnZW5kID0gY29tcGlsZS5sZWdlbmQgPSByZXF1aXJlKCcuL2xlZ2VuZCcpLFxuICBtYXJrcyA9IGNvbXBpbGUubWFya3MgPSByZXF1aXJlKCcuL21hcmtzJyksXG4gIHNjYWxlID0gY29tcGlsZS5zY2FsZSA9IHJlcXVpcmUoJy4vc2NhbGUnKTtcblxuY29tcGlsZS5hZ2dyZWdhdGUgPSByZXF1aXJlKCcuL2FnZ3JlZ2F0ZScpO1xuY29tcGlsZS5iaW4gPSByZXF1aXJlKCcuL2JpbicpO1xuY29tcGlsZS5mYWNldCA9IHJlcXVpcmUoJy4vZmFjZXQnKTtcbmNvbXBpbGUuZ3JvdXAgPSByZXF1aXJlKCcuL2dyb3VwJyk7XG5jb21waWxlLmxheW91dCA9IHJlcXVpcmUoJy4vbGF5b3V0Jyk7XG5jb21waWxlLnNvcnQgPSByZXF1aXJlKCcuL3NvcnQnKTtcbmNvbXBpbGUuc3RhY2sgPSByZXF1aXJlKCcuL3N0YWNrJyk7XG5jb21waWxlLnN0eWxlID0gcmVxdWlyZSgnLi9zdHlsZScpO1xuY29tcGlsZS5zdWJmYWNldCA9IHJlcXVpcmUoJy4vc3ViZmFjZXQnKTtcbmNvbXBpbGUudGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlJyk7XG5jb21waWxlLnRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxuZnVuY3Rpb24gY29tcGlsZShzcGVjLCBzdGF0cywgdGhlbWUpIHtcbiAgcmV0dXJuIGNvbXBpbGUuZW5jb2RpbmcoRW5jb2RpbmcuZnJvbVNwZWMoc3BlYywgdGhlbWUpLCBzdGF0cyk7XG59XG5cbmNvbXBpbGUuc2hvcnRoYW5kID0gZnVuY3Rpb24gKHNob3J0aGFuZCwgc3RhdHMsIGNvbmZpZywgdGhlbWUpIHtcbiAgcmV0dXJuIGNvbXBpbGUuZW5jb2RpbmcoRW5jb2RpbmcuZnJvbVNob3J0aGFuZChzaG9ydGhhbmQsIGNvbmZpZywgdGhlbWUpLCBzdGF0cyk7XG59O1xuXG5jb21waWxlLmVuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGF0cykge1xuICAvLyBubyBuZWVkIHRvIHBhc3Mgc3RhdHMgaWYgeW91IHBhc3MgaW4gdGhlIGRhdGFcbiAgaWYgKCFzdGF0cyAmJiBlbmNvZGluZy5oYXNWYWx1ZXMoKSkge1xuICAgIHN0YXRzID0gc3VtbWFyeShlbmNvZGluZy5kYXRhKCd2YWx1ZXMnKSkucmVkdWNlKGZ1bmN0aW9uKHMsIHApIHtcbiAgICAgIHNbcC5maWVsZF0gPSBwO1xuICAgICAgcmV0dXJuIHM7XG4gICAgfSwge30pO1xuICB9XG5cbiAgdmFyIGxheW91dCA9IGNvbXBpbGUubGF5b3V0KGVuY29kaW5nLCBzdGF0cyksXG4gICAgc3R5bGUgPSBjb21waWxlLnN0eWxlKGVuY29kaW5nLCBzdGF0cyksXG4gICAgc3BlYyA9IGNvbXBpbGUudGVtcGxhdGUoZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpLFxuICAgIGdyb3VwID0gc3BlYy5tYXJrc1swXSxcbiAgICBtYXJrID0gbWFya3NbZW5jb2RpbmcubWFya3R5cGUoKV0sXG4gICAgbWRlZnMgPSBtYXJrcy5kZWYobWFyaywgZW5jb2RpbmcsIGxheW91dCwgc3R5bGUpLFxuICAgIG1kZWYgPSBtZGVmc1swXTsgIC8vIFRPRE86IHJlbW92ZSB0aGlzIGRpcnR5IGhhY2sgYnkgcmVmYWN0b3JpbmcgdGhlIHdob2xlIGZsb3dcblxuICBmaWx0ZXIuYWRkRmlsdGVycyhzcGVjLCBlbmNvZGluZyk7XG4gIHZhciBzb3J0aW5nID0gY29tcGlsZS5zb3J0KHNwZWMsIGVuY29kaW5nLCBzdGF0cyk7XG5cbiAgdmFyIGhhc1JvdyA9IGVuY29kaW5nLmhhcyhST1cpLCBoYXNDb2wgPSBlbmNvZGluZy5oYXMoQ09MKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG1kZWZzLmxlbmd0aDsgaSsrKSB7XG4gICAgZ3JvdXAubWFya3MucHVzaChtZGVmc1tpXSk7XG4gIH1cblxuICBjb21waWxlLmJpbihzcGVjLmRhdGFbMV0sIGVuY29kaW5nKTtcblxuICB2YXIgbGluZVR5cGUgPSBtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXS5saW5lO1xuXG4gIHNwZWMgPSBjb21waWxlLnRpbWUoc3BlYywgZW5jb2RpbmcpO1xuXG4gIC8vIGhhbmRsZSBzdWJmYWNldHNcbiAgdmFyIGFnZ1Jlc3VsdCA9IGNvbXBpbGUuYWdncmVnYXRlKHNwZWMsIGVuY29kaW5nKSxcbiAgICBkZXRhaWxzID0gYWdnUmVzdWx0LmRldGFpbHMsXG4gICAgaGFzRGV0YWlscyA9IGRldGFpbHMgJiYgZGV0YWlscy5sZW5ndGggPiAwLFxuICAgIHN0YWNrID0gaGFzRGV0YWlscyAmJiBjb21waWxlLnN0YWNrKHNwZWMsIGVuY29kaW5nLCBtZGVmLCBhZ2dSZXN1bHQuZmFjZXRzKTtcblxuICBpZiAoaGFzRGV0YWlscyAmJiAoc3RhY2sgfHwgbGluZVR5cGUpKSB7XG4gICAgLy9zdWJmYWNldCB0byBncm91cCBzdGFjayAvIGxpbmUgdG9nZXRoZXIgaW4gb25lIGdyb3VwXG4gICAgY29tcGlsZS5zdWJmYWNldChncm91cCwgbWRlZiwgZGV0YWlscywgc3RhY2ssIGVuY29kaW5nKTtcbiAgfVxuXG4gIC8vIGF1dG8tc29ydCBsaW5lL2FyZWEgdmFsdWVzXG4gIC8vVE9ETyhrYW5pdHcpOiBoYXZlIHNvbWUgY29uZmlnIHRvIHR1cm4gb2ZmIGF1dG8tc29ydCBmb3IgbGluZSAoZm9yIGxpbmUgY2hhcnQgdGhhdCBlbmNvZGVzIHRlbXBvcmFsIGluZm9ybWF0aW9uKVxuICBpZiAobGluZVR5cGUpIHtcbiAgICB2YXIgZiA9IChlbmNvZGluZy5pc01lYXN1cmUoWCkgJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oWSkpID8gWSA6IFg7XG4gICAgaWYgKCFtZGVmLmZyb20pIG1kZWYuZnJvbSA9IHt9O1xuICAgIC8vIFRPRE86IHdoeSAtID9cbiAgICBtZGVmLmZyb20udHJhbnNmb3JtID0gW3t0eXBlOiAnc29ydCcsIGJ5OiAnLScgKyBlbmNvZGluZy5maWVsZChmKX1dO1xuICB9XG5cbiAgLy8gU21hbGwgTXVsdGlwbGVzXG4gIGlmIChoYXNSb3cgfHwgaGFzQ29sKSB7XG4gICAgc3BlYyA9IGNvbXBpbGUuZmFjZXQoZ3JvdXAsIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlLCBzb3J0aW5nLCBzcGVjLCBtZGVmLCBzdGFjaywgc3RhdHMpO1xuICAgIHNwZWMubGVnZW5kcyA9IGxlZ2VuZC5kZWZzKGVuY29kaW5nKTtcbiAgfSBlbHNlIHtcbiAgICBncm91cC5zY2FsZXMgPSBzY2FsZS5kZWZzKHNjYWxlLm5hbWVzKG1kZWYucHJvcGVydGllcy51cGRhdGUpLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc29ydGluZyxcbiAgICAgIHtzdGFjazogc3RhY2ssIHN0YXRzOiBzdGF0c30pO1xuICAgIGdyb3VwLmF4ZXMgPSBheGlzLmRlZnMoYXhpcy5uYW1lcyhtZGVmLnByb3BlcnRpZXMudXBkYXRlKSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpO1xuICAgIGdyb3VwLmxlZ2VuZHMgPSBsZWdlbmQuZGVmcyhlbmNvZGluZyk7XG4gIH1cblxuICBmaWx0ZXIuZmlsdGVyTGVzc1RoYW5aZXJvKHNwZWMsIGVuY29kaW5nKTtcblxuICByZXR1cm4gc3BlYztcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIGF4aXMgPSByZXF1aXJlKCcuL2F4aXMnKSxcbiAgZ3JvdXBkZWYgPSByZXF1aXJlKCcuL2dyb3VwJykuZGVmLFxuICBzY2FsZSA9IHJlcXVpcmUoJy4vc2NhbGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWNldGluZztcblxuZnVuY3Rpb24gZmFjZXRpbmcoZ3JvdXAsIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlLCBzb3J0aW5nLCBzcGVjLCBtZGVmLCBzdGFjaywgc3RhdHMpIHtcbiAgdmFyIGVudGVyID0gZ3JvdXAucHJvcGVydGllcy5lbnRlcjtcbiAgdmFyIGZhY2V0S2V5cyA9IFtdLCBjZWxsQXhlcyA9IFtdLCBmcm9tLCBheGVzR3JwO1xuXG4gIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSwgaGFzQ29sID0gZW5jb2RpbmcuaGFzKENPTCk7XG5cbiAgZW50ZXIuZmlsbCA9IHt2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsQmFja2dyb3VuZENvbG9yJyl9O1xuXG4gIC8vbW92ZSBcImZyb21cIiB0byBjZWxsIGxldmVsIGFuZCBhZGQgZmFjZXQgdHJhbnNmb3JtXG4gIGdyb3VwLmZyb20gPSB7ZGF0YTogZ3JvdXAubWFya3NbMF0uZnJvbS5kYXRhfTtcblxuICAvLyBIYWNrLCB0aGlzIG5lZWRzIHRvIGJlIHJlZmFjdG9yZWRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cC5tYXJrcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtYXJrID0gZ3JvdXAubWFya3NbaV07XG4gICAgaWYgKG1hcmsuZnJvbS50cmFuc2Zvcm0pIHtcbiAgICAgIGRlbGV0ZSBtYXJrLmZyb20uZGF0YTsgLy9uZWVkIHRvIGtlZXAgdHJhbnNmb3JtIGZvciBzdWJmYWNldHRpbmcgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbWFyay5mcm9tO1xuICAgIH1cbiAgfVxuXG4gIGlmIChoYXNSb3cpIHtcbiAgICBpZiAoIWVuY29kaW5nLmlzRGltZW5zaW9uKFJPVykpIHtcbiAgICAgIHV0aWwuZXJyb3IoJ1JvdyBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC4nKTtcbiAgICB9XG4gICAgZW50ZXIueSA9IHtzY2FsZTogUk9XLCBmaWVsZDogJ2tleXMuJyArIGZhY2V0S2V5cy5sZW5ndGh9O1xuICAgIGVudGVyLmhlaWdodCA9IHsndmFsdWUnOiBsYXlvdXQuY2VsbEhlaWdodH07IC8vIEhBQ0tcblxuICAgIGZhY2V0S2V5cy5wdXNoKGVuY29kaW5nLmZpZWxkKFJPVykpO1xuXG4gICAgaWYgKGhhc0NvbCkge1xuICAgICAgZnJvbSA9IHV0aWwuZHVwbGljYXRlKGdyb3VwLmZyb20pO1xuICAgICAgZnJvbS50cmFuc2Zvcm0gPSBmcm9tLnRyYW5zZm9ybSB8fCBbXTtcbiAgICAgIGZyb20udHJhbnNmb3JtLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IFtlbmNvZGluZy5maWVsZChDT0wpXX0pO1xuICAgIH1cblxuICAgIGF4ZXNHcnAgPSBncm91cGRlZigneC1heGVzJywge1xuICAgICAgICBheGVzOiBlbmNvZGluZy5oYXMoWCkgPyBheGlzLmRlZnMoWyd4J10sIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgeDogaGFzQ29sID8ge3NjYWxlOiBDT0wsIGZpZWxkOiAna2V5cy4wJ30gOiB7dmFsdWU6IDB9LFxuICAgICAgICB3aWR0aDogaGFzQ29sICYmIHsndmFsdWUnOiBsYXlvdXQuY2VsbFdpZHRofSwgLy9IQUNLP1xuICAgICAgICBmcm9tOiBmcm9tXG4gICAgICB9KTtcblxuICAgIHNwZWMubWFya3MudW5zaGlmdChheGVzR3JwKTsgLy8gbmVlZCB0byBwcmVwZW5kIHNvIGl0IGFwcGVhcnMgdW5kZXIgdGhlIHBsb3RzXG4gICAgKHNwZWMuYXhlcyA9IHNwZWMuYXhlcyB8fCBbXSk7XG4gICAgc3BlYy5heGVzLnB1c2guYXBwbHkoc3BlYy5heGVzLCBheGlzLmRlZnMoWydyb3cnXSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIHJvd1xuICAgIGlmIChlbmNvZGluZy5oYXMoWCkpIHtcbiAgICAgIC8va2VlcCB4IGF4aXMgaW4gdGhlIGNlbGxcbiAgICAgIGNlbGxBeGVzLnB1c2guYXBwbHkoY2VsbEF4ZXMsIGF4aXMuZGVmcyhbJ3gnXSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaGFzQ29sKSB7XG4gICAgaWYgKCFlbmNvZGluZy5pc0RpbWVuc2lvbihDT0wpKSB7XG4gICAgICB1dGlsLmVycm9yKCdDb2wgZW5jb2Rpbmcgc2hvdWxkIGJlIG9yZGluYWwuJyk7XG4gICAgfVxuICAgIGVudGVyLnggPSB7c2NhbGU6IENPTCwgZmllbGQ6ICdrZXlzLicgKyBmYWNldEtleXMubGVuZ3RofTtcbiAgICBlbnRlci53aWR0aCA9IHsndmFsdWUnOiBsYXlvdXQuY2VsbFdpZHRofTsgLy8gSEFDS1xuXG4gICAgZmFjZXRLZXlzLnB1c2goZW5jb2RpbmcuZmllbGQoQ09MKSk7XG5cbiAgICBpZiAoaGFzUm93KSB7XG4gICAgICBmcm9tID0gdXRpbC5kdXBsaWNhdGUoZ3JvdXAuZnJvbSk7XG4gICAgICBmcm9tLnRyYW5zZm9ybSA9IGZyb20udHJhbnNmb3JtIHx8IFtdO1xuICAgICAgZnJvbS50cmFuc2Zvcm0udW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogW2VuY29kaW5nLmZpZWxkKFJPVyldfSk7XG4gICAgfVxuXG4gICAgYXhlc0dycCA9IGdyb3VwZGVmKCd5LWF4ZXMnLCB7XG4gICAgICBheGVzOiBlbmNvZGluZy5oYXMoWSkgPyBheGlzLmRlZnMoWyd5J10sIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSA6IHVuZGVmaW5lZCxcbiAgICAgIHk6IGhhc1JvdyAmJiB7c2NhbGU6IFJPVywgZmllbGQ6ICdrZXlzLjAnfSxcbiAgICAgIHg6IGhhc1JvdyAmJiB7dmFsdWU6IDB9LFxuICAgICAgaGVpZ2h0OiBoYXNSb3cgJiYgeyd2YWx1ZSc6IGxheW91dC5jZWxsSGVpZ2h0fSwgLy9IQUNLP1xuICAgICAgZnJvbTogZnJvbVxuICAgIH0pO1xuXG4gICAgc3BlYy5tYXJrcy51bnNoaWZ0KGF4ZXNHcnApOyAvLyBuZWVkIHRvIHByZXBlbmQgc28gaXQgYXBwZWFycyB1bmRlciB0aGUgcGxvdHNcbiAgICAoc3BlYy5heGVzID0gc3BlYy5heGVzIHx8IFtdKTtcbiAgICBzcGVjLmF4ZXMucHVzaC5hcHBseShzcGVjLmF4ZXMsIGF4aXMuZGVmcyhbJ2NvbCddLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgY29sXG4gICAgaWYgKGVuY29kaW5nLmhhcyhZKSkge1xuICAgICAgY2VsbEF4ZXMucHVzaC5hcHBseShjZWxsQXhlcywgYXhpcy5kZWZzKFsneSddLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFzc3VtaW5nIGVxdWFsIGNlbGxXaWR0aCBoZXJlXG4gIC8vIFRPRE86IHN1cHBvcnQgaGV0ZXJvZ2Vub3VzIGNlbGxXaWR0aCAobWF5YmUgYnkgdXNpbmcgbXVsdGlwbGUgc2NhbGVzPylcbiAgc3BlYy5zY2FsZXMgPSAoc3BlYy5zY2FsZXMgfHwgW10pLmNvbmNhdChzY2FsZS5kZWZzKFxuICAgIHNjYWxlLm5hbWVzKGVudGVyKS5jb25jYXQoc2NhbGUubmFtZXMobWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZSkpLFxuICAgIGVuY29kaW5nLFxuICAgIGxheW91dCxcbiAgICBzdHlsZSxcbiAgICBzb3J0aW5nLFxuICAgIHtzdGFjazogc3RhY2ssIGZhY2V0OiB0cnVlLCBzdGF0czogc3RhdHN9XG4gICkpOyAvLyByb3cvY29sIHNjYWxlcyArIGNlbGwgc2NhbGVzXG5cbiAgaWYgKGNlbGxBeGVzLmxlbmd0aCA+IDApIHtcbiAgICBncm91cC5heGVzID0gY2VsbEF4ZXM7XG4gIH1cblxuICAvLyBhZGQgZmFjZXQgdHJhbnNmb3JtXG4gIHZhciB0cmFucyA9IChncm91cC5mcm9tLnRyYW5zZm9ybSB8fCAoZ3JvdXAuZnJvbS50cmFuc2Zvcm0gPSBbXSkpO1xuICB0cmFucy51bnNoaWZ0KHt0eXBlOiAnZmFjZXQnLCBrZXlzOiBmYWNldEtleXN9KTtcblxuICByZXR1cm4gc3BlYztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgZmlsdGVyID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmFyIEJJTkFSWSA9IHtcbiAgJz4nOiAgdHJ1ZSxcbiAgJz49JzogdHJ1ZSxcbiAgJz0nOiAgdHJ1ZSxcbiAgJyE9JzogdHJ1ZSxcbiAgJzwnOiAgdHJ1ZSxcbiAgJzw9JzogdHJ1ZVxufTtcblxuZmlsdGVyLmFkZEZpbHRlcnMgPSBmdW5jdGlvbihzcGVjLCBlbmNvZGluZykge1xuICB2YXIgZmlsdGVycyA9IGVuY29kaW5nLmZpbHRlcigpLFxuICAgIGRhdGEgPSBzcGVjLmRhdGFbMF07ICAvLyBhcHBseSBmaWx0ZXJzIHRvIHJhdyBkYXRhIGJlZm9yZSBhZ2dyZWdhdGlvblxuXG4gIGlmICghZGF0YS50cmFuc2Zvcm0pXG4gICAgZGF0YS50cmFuc2Zvcm0gPSBbXTtcblxuICAvLyBhZGQgY3VzdG9tIGZpbHRlcnNcbiAgZm9yICh2YXIgaSBpbiBmaWx0ZXJzKSB7XG4gICAgdmFyIGZpbHRlciA9IGZpbHRlcnNbaV07XG5cbiAgICB2YXIgY29uZGl0aW9uID0gJyc7XG4gICAgdmFyIG9wZXJhdG9yID0gZmlsdGVyLm9wZXJhdG9yO1xuICAgIHZhciBvcGVyYW5kcyA9IGZpbHRlci5vcGVyYW5kcztcblxuICAgIGlmIChCSU5BUllbb3BlcmF0b3JdKSB7XG4gICAgICAvLyBleHBlY3RzIGEgZmllbGQgYW5kIGEgdmFsdWVcbiAgICAgIGlmIChvcGVyYXRvciA9PT0gJz0nKSB7XG4gICAgICAgIG9wZXJhdG9yID0gJz09JztcbiAgICAgIH1cblxuICAgICAgdmFyIG9wMSA9IG9wZXJhbmRzWzBdO1xuICAgICAgdmFyIG9wMiA9IG9wZXJhbmRzWzFdO1xuICAgICAgY29uZGl0aW9uID0gJ2QuZGF0YS4nICsgb3AxICsgb3BlcmF0b3IgKyBvcDI7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRvciA9PT0gJ25vdE51bGwnKSB7XG4gICAgICAvLyBleHBlY3RzIGEgbnVtYmVyIG9mIGZpZWxkc1xuICAgICAgZm9yICh2YXIgaiBpbiBvcGVyYW5kcykge1xuICAgICAgICBjb25kaXRpb24gKz0gJ2QuZGF0YS4nICsgb3BlcmFuZHNbal0gKyAnIT09bnVsbCc7XG4gICAgICAgIGlmIChqIDwgb3BlcmFuZHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGNvbmRpdGlvbiArPSAnICYmICc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdVbnN1cHBvcnRlZCBvcGVyYXRvcjogJywgb3BlcmF0b3IpO1xuICAgIH1cblxuICAgIGRhdGEudHJhbnNmb3JtLnB1c2goe1xuICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICB0ZXN0OiBjb25kaXRpb25cbiAgICB9KTtcbiAgfVxufTtcblxuLy8gcmVtb3ZlIGxlc3MgdGhhbiAwIHZhbHVlcyBpZiB3ZSB1c2UgbG9nIGZ1bmN0aW9uXG5maWx0ZXIuZmlsdGVyTGVzc1RoYW5aZXJvID0gZnVuY3Rpb24oc3BlYywgZW5jb2RpbmcpIHtcbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChlbmNvZGluZy5zY2FsZShlbmNUeXBlKS50eXBlID09PSAnbG9nJykge1xuICAgICAgc3BlYy5kYXRhWzFdLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIHRlc3Q6ICdkLicgKyBlbmNvZGluZy5maWVsZChlbmNUeXBlKSArICc+MCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWY6IGdyb3VwZGVmXG59O1xuXG5mdW5jdGlvbiBncm91cGRlZihuYW1lLCBvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuICByZXR1cm4ge1xuICAgIF9uYW1lOiBuYW1lIHx8IHVuZGVmaW5lZCxcbiAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIGZyb206IG9wdC5mcm9tLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIGVudGVyOiB7XG4gICAgICAgIHg6IG9wdC54IHx8IHVuZGVmaW5lZCxcbiAgICAgICAgeTogb3B0LnkgfHwgdW5kZWZpbmVkLFxuICAgICAgICB3aWR0aDogb3B0LndpZHRoIHx8IHtncm91cDogJ3dpZHRoJ30sXG4gICAgICAgIGhlaWdodDogb3B0LmhlaWdodCB8fCB7Z3JvdXA6ICdoZWlnaHQnfVxuICAgICAgfVxuICAgIH0sXG4gICAgc2NhbGVzOiBvcHQuc2NhbGVzIHx8IHVuZGVmaW5lZCxcbiAgICBheGVzOiBvcHQuYXhlcyB8fCB1bmRlZmluZWQsXG4gICAgbWFya3M6IG9wdC5tYXJrcyB8fCBbXVxuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICBzZXR0ZXIgPSB1dGlsLnNldHRlcjtcblxubW9kdWxlLmV4cG9ydHMgPSB2bGxheW91dDtcblxuZnVuY3Rpb24gdmxsYXlvdXQoZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBsYXlvdXQgPSBib3goZW5jb2RpbmcsIHN0YXRzKTtcbiAgbGF5b3V0ID0gb2Zmc2V0KGVuY29kaW5nLCBzdGF0cywgbGF5b3V0KTtcbiAgcmV0dXJuIGxheW91dDtcbn1cblxuLypcbiAgSEFDSyB0byBzZXQgY2hhcnQgc2l6ZVxuICBOT1RFOiB0aGlzIGZhaWxzIGZvciBwbG90cyBkcml2ZW4gYnkgZGVyaXZlZCB2YWx1ZXMgKGUuZy4sIGFnZ3JlZ2F0ZXMpXG4gIE9uZSBzb2x1dGlvbiBpcyB0byB1cGRhdGUgVmVnYSB0byBzdXBwb3J0IGF1dG8tc2l6aW5nXG4gIEluIHRoZSBtZWFudGltZSwgYXV0by1wYWRkaW5nIChtb3N0bHkpIGRvZXMgdGhlIHRyaWNrXG4gKi9cbmZ1bmN0aW9uIGJveChlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGhhc1JvdyA9IGVuY29kaW5nLmhhcyhST1cpLFxuICAgICAgaGFzQ29sID0gZW5jb2RpbmcuaGFzKENPTCksXG4gICAgICBoYXNYID0gZW5jb2RpbmcuaGFzKFgpLFxuICAgICAgaGFzWSA9IGVuY29kaW5nLmhhcyhZKSxcbiAgICAgIG1hcmt0eXBlID0gZW5jb2RpbmcubWFya3R5cGUoKTtcblxuICAvLyBGSVhNRS9IQUNLIHdlIG5lZWQgdG8gdGFrZSBmaWx0ZXIgaW50byBhY2NvdW50XG4gIHZhciB4Q2FyZGluYWxpdHkgPSBoYXNYICYmIGVuY29kaW5nLmlzRGltZW5zaW9uKFgpID8gZW5jb2RpbmcuY2FyZGluYWxpdHkoWCwgc3RhdHMpIDogMSxcbiAgICB5Q2FyZGluYWxpdHkgPSBoYXNZICYmIGVuY29kaW5nLmlzRGltZW5zaW9uKFkpID8gZW5jb2RpbmcuY2FyZGluYWxpdHkoWSwgc3RhdHMpIDogMTtcblxuICB2YXIgdXNlU21hbGxCYW5kID0geENhcmRpbmFsaXR5ID4gZW5jb2RpbmcuY29uZmlnKCdsYXJnZUJhbmRNYXhDYXJkaW5hbGl0eScpIHx8XG4gICAgeUNhcmRpbmFsaXR5ID4gZW5jb2RpbmcuY29uZmlnKCdsYXJnZUJhbmRNYXhDYXJkaW5hbGl0eScpO1xuXG4gIHZhciBjZWxsV2lkdGgsIGNlbGxIZWlnaHQsIGNlbGxQYWRkaW5nID0gZW5jb2RpbmcuY29uZmlnKCdjZWxsUGFkZGluZycpO1xuXG4gIC8vIHNldCBjZWxsV2lkdGhcbiAgaWYgKGhhc1gpIHtcbiAgICBpZiAoZW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUoWCkpIHtcbiAgICAgIC8vIGZvciBvcmRpbmFsLCBoYXNDb2wgb3Igbm90IGRvZXNuJ3QgbWF0dGVyIC0tIHdlIHNjYWxlIGJhc2VkIG9uIGNhcmRpbmFsaXR5XG4gICAgICBjZWxsV2lkdGggPSAoeENhcmRpbmFsaXR5ICsgZW5jb2RpbmcuYmFuZChYKS5wYWRkaW5nKSAqIGVuY29kaW5nLmJhbmRTaXplKFgsIHVzZVNtYWxsQmFuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGxXaWR0aCA9IGhhc0NvbCB8fCBoYXNSb3cgPyBlbmNvZGluZy5lbmMoQ09MKS53aWR0aCA6ICBlbmNvZGluZy5jb25maWcoXCJzaW5nbGVXaWR0aFwiKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKG1hcmt0eXBlID09PSBURVhUKSB7XG4gICAgICBjZWxsV2lkdGggPSBlbmNvZGluZy5jb25maWcoJ3RleHRDZWxsV2lkdGgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbFdpZHRoID0gZW5jb2RpbmcuYmFuZFNpemUoWCk7XG4gICAgfVxuICB9XG5cbiAgLy8gc2V0IGNlbGxIZWlnaHRcbiAgaWYgKGhhc1kpIHtcbiAgICBpZiAoZW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUoWSkpIHtcbiAgICAgIC8vIGZvciBvcmRpbmFsLCBoYXNDb2wgb3Igbm90IGRvZXNuJ3QgbWF0dGVyIC0tIHdlIHNjYWxlIGJhc2VkIG9uIGNhcmRpbmFsaXR5XG4gICAgICBjZWxsSGVpZ2h0ID0gKHlDYXJkaW5hbGl0eSArIGVuY29kaW5nLmJhbmQoWSkucGFkZGluZykgKiBlbmNvZGluZy5iYW5kU2l6ZShZLCB1c2VTbWFsbEJhbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsSGVpZ2h0ID0gaGFzQ29sIHx8IGhhc1JvdyA/IGVuY29kaW5nLmVuYyhST1cpLmhlaWdodCA6ICBlbmNvZGluZy5jb25maWcoXCJzaW5nbGVIZWlnaHRcIik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNlbGxIZWlnaHQgPSBlbmNvZGluZy5iYW5kU2l6ZShZKTtcbiAgfVxuXG4gIC8vIENlbGwgYmFuZHMgdXNlIHJhbmdlQmFuZHMoKS4gVGhlcmUgYXJlIG4tMSBwYWRkaW5nLiAgT3V0ZXJwYWRkaW5nID0gMCBmb3IgY2VsbHNcblxuICB2YXIgd2lkdGggPSBjZWxsV2lkdGgsIGhlaWdodCA9IGNlbGxIZWlnaHQ7XG4gIGlmIChoYXNDb2wpIHtcbiAgICB2YXIgY29sQ2FyZGluYWxpdHkgPSBlbmNvZGluZy5jYXJkaW5hbGl0eShDT0wsIHN0YXRzKTtcbiAgICB3aWR0aCA9IGNlbGxXaWR0aCAqICgoMSArIGNlbGxQYWRkaW5nKSAqIChjb2xDYXJkaW5hbGl0eSAtIDEpICsgMSk7XG4gIH1cbiAgaWYgKGhhc1Jvdykge1xuICAgIHZhciByb3dDYXJkaW5hbGl0eSA9ICBlbmNvZGluZy5jYXJkaW5hbGl0eShST1csIHN0YXRzKTtcbiAgICBoZWlnaHQgPSBjZWxsSGVpZ2h0ICogKCgxICsgY2VsbFBhZGRpbmcpICogKHJvd0NhcmRpbmFsaXR5IC0gMSkgKyAxKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLy8gd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgd2hvbGUgY2VsbFxuICAgIGNlbGxXaWR0aDogY2VsbFdpZHRoLFxuICAgIGNlbGxIZWlnaHQ6IGNlbGxIZWlnaHQsXG4gICAgY2VsbFBhZGRpbmc6IGNlbGxQYWRkaW5nLFxuICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGNoYXJ0XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIC8vIGluZm9ybWF0aW9uIGFib3V0IHggYW5kIHksIHN1Y2ggYXMgYmFuZCBzaXplXG4gICAgeDoge3VzZVNtYWxsQmFuZDogdXNlU21hbGxCYW5kfSxcbiAgICB5OiB7dXNlU21hbGxCYW5kOiB1c2VTbWFsbEJhbmR9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldE1heExlbmd0aChlbmNvZGluZywgc3RhdHMsIGV0KSB7XG4gIC8vIEZJWE1FIGRldGVybWluZSBjb25zdGFudCBmb3IgUSBhbmQgVCBpbiBhIG5pY2VyIHdheVxuICByZXR1cm4gZW5jb2RpbmcuaXNUeXBlKGV0LCBRKSA/IDIwIDpcbiAgICBlbmNvZGluZy5pc1R5cGUoZXQsIFQpID8gMjAgOlxuICAgIHN0YXRzW2VuY29kaW5nLmZpZWxkTmFtZShldCldLm1heDtcbn1cblxuZnVuY3Rpb24gb2Zmc2V0KGVuY29kaW5nLCBzdGF0cywgbGF5b3V0KSB7XG4gIFtYLCBZXS5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XG4gICAgdmFyIG1heExlbmd0aDtcbiAgICBpZiAoZW5jb2RpbmcuaXNEaW1lbnNpb24oeCkgfHwgZW5jb2RpbmcuaXNUeXBlKHgsIFQpKSB7XG4gICAgICBtYXhMZW5ndGggPSAgZ2V0TWF4TGVuZ3RoKGVuY29kaW5nLCBzdGF0cywgeCk7XG4gICAgfSBlbHNlIGlmIChlbmNvZGluZy5hZ2dyKHgpID09PSAnY291bnQnKSB7XG4gICAgICAvL2Fzc2lnbiBkZWZhdWx0IHZhbHVlIGZvciBjb3VudCBhcyBpdCB3b24ndCBoYXZlIHN0YXRzXG4gICAgICBtYXhMZW5ndGggPSAgMztcbiAgICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZSh4LCBRKSkge1xuICAgICAgaWYgKHg9PT1YKSB7XG4gICAgICAgIG1heExlbmd0aCA9IDM7XG4gICAgICB9IGVsc2UgeyAvLyBZXG4gICAgICAgIC8vYXNzdW1lIHRoYXQgZGVmYXVsdCBmb3JtYXRpbmcgaXMgYWx3YXlzIHNob3J0ZXIgdGhhbiA3XG4gICAgICAgIG1heExlbmd0aCA9IE1hdGgubWluKGdldE1heExlbmd0aChlbmNvZGluZywgc3RhdHMsIHgpLCA3KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2V0dGVyKGxheW91dCxbeCwgJ2F4aXNUaXRsZU9mZnNldCddLCBlbmNvZGluZy5jb25maWcoJ2NoYXJhY3RlcldpZHRoJykgKiAgbWF4TGVuZ3RoICsgMjApO1xuICB9KTtcbiAgcmV0dXJuIGxheW91dDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG52YXIgbGVnZW5kID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxubGVnZW5kLmRlZnMgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICB2YXIgZGVmcyA9IFtdO1xuICAvLyBUT0RPOiBzdXBwb3J0IGFscGhhXG5cbiAgaWYgKGVuY29kaW5nLmhhcyhDT0xPUikgJiYgZW5jb2RpbmcubGVnZW5kKENPTE9SKSkge1xuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKENPTE9SLCBlbmNvZGluZywge1xuICAgICAgZmlsbDogQ09MT1IsXG4gICAgICBvcmllbnQ6ICdyaWdodCdcbiAgICB9KSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNJWkUpICYmIGVuY29kaW5nLmxlZ2VuZChTSVpFKSkge1xuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKFNJWkUsIGVuY29kaW5nLCB7XG4gICAgICBzaXplOiBTSVpFLFxuICAgICAgb3JpZW50OiBkZWZzLmxlbmd0aCA9PT0gMSA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB9KSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNIQVBFKSAmJiBlbmNvZGluZy5sZWdlbmQoU0hBUEUpKSB7XG4gICAgaWYgKGRlZnMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBUT0RPOiBmaXggdGhpc1xuICAgICAgY29uc29sZS5lcnJvcignVmVnYS1saXRlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIHR3byBsZWdlbmRzJyk7XG4gICAgICByZXR1cm4gZGVmcztcbiAgICB9XG4gICAgZGVmcy5wdXNoKGxlZ2VuZC5kZWYoU0hBUEUsIGVuY29kaW5nLCB7XG4gICAgICBzaGFwZTogU0hBUEUsXG4gICAgICBvcmllbnQ6IGRlZnMubGVuZ3RoID09PSAxID8gJ2xlZnQnIDogJ3JpZ2h0J1xuICAgIH0pKTtcbiAgfVxuXG4gIHJldHVybiBkZWZzO1xufTtcblxubGVnZW5kLmRlZiA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nLCBwcm9wcykge1xuICB2YXIgZGVmID0gcHJvcHMsIGZuO1xuXG4gIGRlZi50aXRsZSA9IGVuY29kaW5nLmZpZWxkVGl0bGUobmFtZSk7XG5cbiAgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJiAoZm4gPSBlbmNvZGluZy5mbihuYW1lKSkgJiZcbiAgICB0aW1lLmhhc1NjYWxlKGZuKSkge1xuICAgIHZhciBwcm9wZXJ0aWVzID0gZGVmLnByb3BlcnRpZXMgPSBkZWYucHJvcGVydGllcyB8fCB7fSxcbiAgICAgIGxhYmVscyA9IHByb3BlcnRpZXMubGFiZWxzID0gcHJvcGVydGllcy5sYWJlbHMgfHwge30sXG4gICAgICB0ZXh0ID0gbGFiZWxzLnRleHQgPSBsYWJlbHMudGV4dCB8fCB7fTtcblxuICAgIHRleHQuc2NhbGUgPSAndGltZS0nKyBmbjtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciBtYXJrcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbm1hcmtzLmRlZiA9IGZ1bmN0aW9uKG1hcmssIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBkZWZzID0gW107XG5cbiAgLy8gdG8gYWRkIGEgYmFja2dyb3VuZCB0byB0ZXh0LCB3ZSBuZWVkIHRvIGFkZCBpdCBiZWZvcmUgdGhlIHRleHRcbiAgaWYgKGVuY29kaW5nLm1hcmt0eXBlKCkgPT09IFRFWFQgJiYgZW5jb2RpbmcuaGFzKENPTE9SKSkge1xuICAgIHZhciBiZyA9IHtcbiAgICAgIHg6IHt2YWx1ZTogMH0sXG4gICAgICB5OiB7dmFsdWU6IDB9LFxuICAgICAgeDI6IHt2YWx1ZTogbGF5b3V0LmNlbGxXaWR0aH0sXG4gICAgICB5Mjoge3ZhbHVlOiBsYXlvdXQuY2VsbEhlaWdodH0sXG4gICAgICBmaWxsOiB7c2NhbGU6IENPTE9SLCBmaWVsZDogZW5jb2RpbmcuZmllbGQoQ09MT1IpfVxuICAgIH07XG4gICAgZGVmcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdyZWN0JyxcbiAgICAgIGZyb206IHtkYXRhOiBUQUJMRX0sXG4gICAgICBwcm9wZXJ0aWVzOiB7ZW50ZXI6IGJnLCB1cGRhdGU6IGJnfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gYWRkIHRoZSBtYXJrIGRlZiBmb3IgdGhlIG1haW4gdGhpbmdcbiAgdmFyIHAgPSBtYXJrLnByb3AoZW5jb2RpbmcsIGxheW91dCwgc3R5bGUpO1xuICBkZWZzLnB1c2goe1xuICAgIHR5cGU6IG1hcmsudHlwZSxcbiAgICBmcm9tOiB7ZGF0YTogVEFCTEV9LFxuICAgIHByb3BlcnRpZXM6IHtlbnRlcjogcCwgdXBkYXRlOiBwfVxuICB9KTtcblxuICByZXR1cm4gZGVmcztcbn07XG5cbm1hcmtzLmJhciA9IHtcbiAgdHlwZTogJ3JlY3QnLFxuICBzdGFjazogdHJ1ZSxcbiAgcHJvcDogYmFyX3Byb3BzLFxuICByZXF1aXJlZEVuY29kaW5nOiBbJ3gnLCAneSddLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBzaXplOiAxLCBjb2xvcjogMSwgYWxwaGE6IDF9XG59O1xuXG5tYXJrcy5saW5lID0ge1xuICB0eXBlOiAnbGluZScsXG4gIGxpbmU6IHRydWUsXG4gIHByb3A6IGxpbmVfcHJvcHMsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFsneCcsICd5J10sXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIGNvbG9yOiAxLCBhbHBoYTogMSwgZGV0YWlsOjF9XG59O1xuXG5tYXJrcy5hcmVhID0ge1xuICB0eXBlOiAnYXJlYScsXG4gIHN0YWNrOiB0cnVlLFxuICBsaW5lOiB0cnVlLFxuICByZXF1aXJlZEVuY29kaW5nOiBbJ3gnLCAneSddLFxuICBwcm9wOiBhcmVhX3Byb3BzLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBjb2xvcjogMSwgYWxwaGE6IDF9XG59O1xuXG5tYXJrcy50aWNrID0ge1xuICB0eXBlOiAncmVjdCcsXG4gIHByb3A6IHRpY2tfcHJvcHMsXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIGNvbG9yOiAxLCBhbHBoYTogMSwgZGV0YWlsOiAxfVxufTtcblxubWFya3MuY2lyY2xlID0ge1xuICB0eXBlOiAnc3ltYm9sJyxcbiAgcHJvcDogZmlsbGVkX3BvaW50X3Byb3BzKCdjaXJjbGUnKSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgc2l6ZTogMSwgY29sb3I6IDEsIGFscGhhOiAxLCBkZXRhaWw6IDF9XG59O1xuXG5tYXJrcy5zcXVhcmUgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBmaWxsZWRfcG9pbnRfcHJvcHMoJ3NxdWFyZScpLFxuICBzdXBwb3J0ZWRFbmNvZGluZzogbWFya3MuY2lyY2xlLnN1cHBvcnRlZEVuY29kaW5nXG59O1xuXG5tYXJrcy5wb2ludCA9IHtcbiAgdHlwZTogJ3N5bWJvbCcsXG4gIHByb3A6IHBvaW50X3Byb3BzLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBzaXplOiAxLCBjb2xvcjogMSwgYWxwaGE6IDEsIHNoYXBlOiAxLCBkZXRhaWw6IDF9XG59O1xuXG5tYXJrcy50ZXh0ID0ge1xuICB0eXBlOiAndGV4dCcsXG4gIHByb3A6IHRleHRfcHJvcHMsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFsndGV4dCddLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCBzaXplOiAxLCBjb2xvcjogMSwgYWxwaGE6IDEsIHRleHQ6IDF9XG59O1xuXG5mdW5jdGlvbiBiYXJfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSkge1xuICAvLyBqc2hpbnQgdW51c2VkOmZhbHNlXG5cbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmlzTWVhc3VyZShYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICAgIGlmIChlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3NjYWxlOiBYLCB2YWx1ZTogZS5zY2FsZShYKS50eXBlID09PSAnbG9nJyA/IDEgOiAwfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZS5oYXMoWCkpIHsgLy8gaXMgb3JkaW5hbFxuICAgIHAueGMgPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUT0RPIGFkZCBzaW5nbGUgYmFyIG9mZnNldFxuICAgIHAueGMgPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5pc01lYXN1cmUoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICBwLnkyID0ge3NjYWxlOiBZLCB2YWx1ZTogZS5zY2FsZShZKS50eXBlID09PSAnbG9nJyA/IDEgOiAwfTtcbiAgfSBlbHNlIGlmIChlLmhhcyhZKSkgeyAvLyBpcyBvcmRpbmFsXG4gICAgcC55YyA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICB9IGVsc2Uge1xuICAgIC8vIFRPRE8gYWRkIHNpbmdsZSBiYXIgb2Zmc2V0XG4gICAgcC55YyA9IHtncm91cDogJ2hlaWdodCd9O1xuICB9XG5cbiAgLy8gd2lkdGhcbiAgaWYgKCFlLmhhcyhYKSB8fCBlLmlzT3JkaW5hbFNjYWxlKFgpKSB7IC8vIG5vIFggb3IgWCBpcyBvcmRpbmFsXG4gICAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgICBwLndpZHRoID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZChTSVpFKX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAud2lkdGggPSB7XG4gICAgICAgIHZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCksXG4gICAgICAgIG9mZnNldDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9IGVsc2UgeyAvLyBYIGlzIFF1YW50IG9yIFRpbWUgU2NhbGVcbiAgICBwLndpZHRoID0ge3ZhbHVlOiAyfTtcbiAgfVxuXG4gIC8vIGhlaWdodFxuICBpZiAoIWUuaGFzKFkpIHx8IGUuaXNPcmRpbmFsU2NhbGUoWSkpIHsgLy8gbm8gWSBvciBZIGlzIG9yZGluYWxcbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAuaGVpZ2h0ID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZChTSVpFKX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuaGVpZ2h0ID0ge1xuICAgICAgICB2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpLFxuICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIHsgLy8gWSBpcyBRdWFudCBvciBUaW1lIFNjYWxlXG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6IDJ9O1xuICB9XG5cbiAgLy8gZmlsbFxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IGUudmFsdWUoQUxQSEEpfTtcbiAgfVxuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBwb2ludF9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LngudXNlU21hbGxCYW5kKSAvIDJ9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDJ9O1xuICB9XG5cbiAgLy8gc2l6ZVxuICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICBwLnNpemUgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoU0laRSkpIHtcbiAgICBwLnNpemUgPSB7dmFsdWU6IGUudmFsdWUoU0laRSl9O1xuICB9XG5cbiAgLy8gc2hhcGVcbiAgaWYgKGUuaGFzKFNIQVBFKSkge1xuICAgIHAuc2hhcGUgPSB7c2NhbGU6IFNIQVBFLCBmaWVsZDogZS5maWVsZChTSEFQRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSEFQRSkpIHtcbiAgICBwLnNoYXBlID0ge3ZhbHVlOiBlLnZhbHVlKFNIQVBFKX07XG4gIH1cblxuICAvLyBzdHJva2VcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IGUudmFsdWUoQUxQSEEpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBzdHlsZS5vcGFjaXR5fTtcbiAgfVxuXG4gIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gbGluZV9wcm9wcyhlLGxheW91dCwgc3R5bGUpIHtcbiAgLy8ganNoaW50IHVudXNlZDpmYWxzZVxuICB2YXIgcCA9IHt9O1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge2dyb3VwOiAnaGVpZ2h0J307XG4gIH1cblxuICAvLyBzdHJva2VcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IGUudmFsdWUoQUxQSEEpfTtcbiAgfVxuXG4gIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gYXJlYV9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmlzTWVhc3VyZShYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICAgIGlmIChlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3NjYWxlOiBYLCB2YWx1ZTogMH07XG4gICAgICBwLm9yaWVudCA9IHt2YWx1ZTogJ2hvcml6b250YWwnfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5pc01lYXN1cmUoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICBwLnkyID0ge3NjYWxlOiBZLCB2YWx1ZTogMH07XG4gIH0gZWxzZSBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIHtcbiAgICBwLnkgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfVxuXG4gIC8vIHN0cm9rZVxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gIH1cblxuICAvLyBhbHBoYVxuICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3NjYWxlOiBBTFBIQSwgZmllbGQ6IGUuZmllbGQoQUxQSEEpfTtcbiAgfSBlbHNlIGlmIChlLnZhbHVlKEFMUEhBKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBlLnZhbHVlKEFMUEhBKX07XG4gIH1cblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gdGlja19wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihYKSkge1xuICAgICAgcC54Lm9mZnNldCA9IC1lLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAzO1xuICAgIH1cbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC55Lm9mZnNldCA9IC1lLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAzO1xuICAgIH1cbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8gd2lkdGhcbiAgaWYgKCFlLmhhcyhYKSB8fCBlLmlzRGltZW5zaW9uKFgpKSB7XG4gICAgcC53aWR0aCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMS41fTtcbiAgfSBlbHNlIHtcbiAgICBwLndpZHRoID0ge3ZhbHVlOiAxfTtcbiAgfVxuXG4gIC8vIGhlaWdodFxuICBpZiAoIWUuaGFzKFkpIHx8IGUuaXNEaW1lbnNpb24oWSkpIHtcbiAgICBwLmhlaWdodCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMS41fTtcbiAgfSBlbHNlIHtcbiAgICBwLmhlaWdodCA9IHt2YWx1ZTogMX07XG4gIH1cblxuICAvLyBmaWxsXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICB9IGVsc2Uge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogZS52YWx1ZShBTFBIQSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IHN0eWxlLm9wYWNpdHl9O1xuICB9XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGZpbGxlZF9wb2ludF9wcm9wcyhzaGFwZSkge1xuICByZXR1cm4gZnVuY3Rpb24oZSwgbGF5b3V0LCBzdHlsZSkge1xuICAgIHZhciBwID0ge307XG5cbiAgICAvLyB4XG4gICAgaWYgKGUuaGFzKFgpKSB7XG4gICAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgICAgcC54ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKGUuaGFzKFkpKSB7XG4gICAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgICAgcC55ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgICB9XG5cbiAgICAvLyBzaXplXG4gICAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgICBwLnNpemUgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgICAgcC5zaXplID0ge3ZhbHVlOiBlLnZhbHVlKFNJWkUpfTtcbiAgICB9XG5cbiAgICAvLyBzaGFwZVxuICAgIHAuc2hhcGUgPSB7dmFsdWU6IHNoYXBlfTtcblxuICAgIC8vIGZpbGxcbiAgICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gICAgfVxuXG4gICAgLy8gYWxwaGFcbiAgICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICAgIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBlLnZhbHVlKEFMUEhBKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IHN0eWxlLm9wYWNpdHl9O1xuICAgIH1cblxuICAgIHJldHVybiBwO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0X3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIGlmIChlLmhhcyhURVhUKSAmJiBlLmlzVHlwZShURVhULCBRKSkge1xuICAgICAgcC54ID0ge3ZhbHVlOiBsYXlvdXQuY2VsbFdpZHRoLTV9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LngudXNlU21hbGxCYW5kKSAvIDJ9O1xuICAgIH1cbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgfVxuXG4gIC8vIHNpemVcbiAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgcC5mb250U2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGQoU0laRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSVpFKSkge1xuICAgIHAuZm9udFNpemUgPSB7dmFsdWU6IGUuZm9udCgnc2l6ZScpfTtcbiAgfVxuXG4gIC8vIGZpbGxcbiAgLy8gY29sb3Igc2hvdWxkIGJlIHNldCB0byBiYWNrZ3JvdW5kXG4gIHAuZmlsbCA9IHt2YWx1ZTogJ2JsYWNrJ307XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogZS52YWx1ZShBTFBIQSl9O1xuICB9IGVsc2Uge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogc3R5bGUub3BhY2l0eX07XG4gIH1cblxuICAvLyB0ZXh0XG4gIGlmIChlLmhhcyhURVhUKSkge1xuICAgIGlmIChlLmlzVHlwZShURVhULCBRKSkge1xuICAgICAgcC50ZXh0ID0ge3RlbXBsYXRlOiBcInt7XCIgKyBlLmZpZWxkKFRFWFQpICsgXCIgfCBudW1iZXI6Jy4zcyd9fVwifTtcbiAgICAgIHAuYWxpZ24gPSB7dmFsdWU6ICdyaWdodCd9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnRleHQgPSB7ZmllbGQ6IGUuZmllbGQoVEVYVCl9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwLnRleHQgPSB7dmFsdWU6ICdBYmMnfTtcbiAgfVxuXG4gIHAuZm9udCA9IHt2YWx1ZTogZS5mb250KCdmYW1pbHknKX07XG4gIHAuZm9udFdlaWdodCA9IHt2YWx1ZTogZS5mb250KCd3ZWlnaHQnKX07XG4gIHAuZm9udFN0eWxlID0ge3ZhbHVlOiBlLmZvbnQoJ3N0eWxlJyl9O1xuICBwLmJhc2VsaW5lID0ge3ZhbHVlOiBlLnRleHQoJ2Jhc2VsaW5lJyl9O1xuXG4gIHJldHVybiBwO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xucmVxdWlyZSgnLi4vZ2xvYmFscycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxudmFyIHNjYWxlID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuc2NhbGUubmFtZXMgPSBmdW5jdGlvbihwcm9wcykge1xuICByZXR1cm4gdXRpbC5rZXlzKHV0aWwua2V5cyhwcm9wcykucmVkdWNlKGZ1bmN0aW9uKGEsIHgpIHtcbiAgICBpZiAocHJvcHNbeF0gJiYgcHJvcHNbeF0uc2NhbGUpIGFbcHJvcHNbeF0uc2NhbGVdID0gMTtcbiAgICByZXR1cm4gYTtcbiAgfSwge30pKTtcbn07XG5cbnNjYWxlLmRlZnMgPSBmdW5jdGlvbihuYW1lcywgZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIHNvcnRpbmcsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG5cbiAgcmV0dXJuIG5hbWVzLnJlZHVjZShmdW5jdGlvbihhLCBuYW1lKSB7XG4gICAgdmFyIHMgPSB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdHlwZTogc2NhbGUudHlwZShuYW1lLCBlbmNvZGluZyksXG4gICAgICBkb21haW46IHNjYWxlX2RvbWFpbihuYW1lLCBlbmNvZGluZywgc29ydGluZywgb3B0KVxuICAgIH07XG4gICAgaWYgKHMudHlwZSA9PT0gJ29yZGluYWwnICYmICFlbmNvZGluZy5iaW4obmFtZSkgJiYgZW5jb2Rpbmcuc29ydChuYW1lKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHMuc29ydCA9IHRydWU7XG4gICAgfVxuXG4gICAgc2NhbGVfcmFuZ2UocywgZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIG9wdCk7XG5cbiAgICByZXR1cm4gKGEucHVzaChzKSwgYSk7XG4gIH0sIFtdKTtcbn07XG5cbnNjYWxlLnR5cGUgPSBmdW5jdGlvbihuYW1lLCBlbmNvZGluZykge1xuXG4gIHN3aXRjaCAoZW5jb2RpbmcudHlwZShuYW1lKSkge1xuICAgIGNhc2UgTzogcmV0dXJuICdvcmRpbmFsJztcbiAgICBjYXNlIFQ6XG4gICAgICB2YXIgZm4gPSBlbmNvZGluZy5mbihuYW1lKTtcbiAgICAgIHJldHVybiAoZm4gJiYgdGltZS5zY2FsZS50eXBlKGZuLCBuYW1lKSkgfHwgJ3RpbWUnO1xuICAgIGNhc2UgUTpcbiAgICAgIGlmIChlbmNvZGluZy5iaW4obmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgPT09IENPTE9SID8gJ2xpbmVhcicgOiAnb3JkaW5hbCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gZW5jb2Rpbmcuc2NhbGUobmFtZSkudHlwZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gc2NhbGVfZG9tYWluKG5hbWUsIGVuY29kaW5nLCBzb3J0aW5nLCBvcHQpIHtcbiAgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSkge1xuICAgIHZhciByYW5nZSA9IHRpbWUuc2NhbGUuZG9tYWluKGVuY29kaW5nLmZuKG5hbWUpLCBuYW1lKTtcbiAgICBpZihyYW5nZSkgcmV0dXJuIHJhbmdlO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmJpbihuYW1lKSkge1xuICAgIC8vIFRPRE86IGFkZCBpbmNsdWRlRW1wdHlDb25maWcgaGVyZVxuICAgIGlmIChvcHQuc3RhdHMpIHtcbiAgICAgIHZhciBiaW5zID0gdXRpbC5nZXRiaW5zKG9wdC5zdGF0c1tlbmNvZGluZy5maWVsZE5hbWUobmFtZSldLCBlbmNvZGluZy5iaW4obmFtZSkubWF4Ymlucyk7XG4gICAgICB2YXIgZG9tYWluID0gdXRpbC5yYW5nZShiaW5zLnN0YXJ0LCBiaW5zLnN0b3AsIGJpbnMuc3RlcCk7XG4gICAgICByZXR1cm4gbmFtZSA9PT0gWSA/IGRvbWFpbi5yZXZlcnNlKCkgOiBkb21haW47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgPT0gb3B0LnN0YWNrID9cbiAgICB7XG4gICAgICBkYXRhOiBTVEFDS0VELFxuICAgICAgZmllbGQ6ICdkYXRhLicgKyAob3B0LmZhY2V0ID8gJ21heF8nIDogJycpICsgJ3N1bV8nICsgZW5jb2RpbmcuZmllbGQobmFtZSwgdHJ1ZSlcbiAgICB9IDpcbiAgICB7ZGF0YTogc29ydGluZy5nZXREYXRhc2V0KG5hbWUpLCBmaWVsZDogZW5jb2RpbmcuZmllbGQobmFtZSl9O1xufVxuXG5mdW5jdGlvbiBzY2FsZV9yYW5nZShzLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgb3B0KSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcbiAgdmFyIHNwZWMgPSBlbmNvZGluZy5zY2FsZShzLm5hbWUpO1xuICBzd2l0Y2ggKHMubmFtZSkge1xuICAgIGNhc2UgWDpcbiAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICBzLmJhbmRXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzLnJhbmdlID0gbGF5b3V0LmNlbGxXaWR0aCA/IFswLCBsYXlvdXQuY2VsbFdpZHRoXSA6ICd3aWR0aCc7XG5cbiAgICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsVCkgJiYgZW5jb2RpbmcuZm4ocy5uYW1lKSA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvID09PSB1bmRlZmluZWQgPyB0cnVlIDogc3BlYy56ZXJvO1xuICAgICAgICB9XG5cbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBpZiAocy50eXBlID09PSAndGltZScpIHtcbiAgICAgICAgcy5uaWNlID0gZW5jb2RpbmcuZm4ocy5uYW1lKTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgcy5uaWNlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgWTpcbiAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICBzLmJhbmRXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzLnJhbmdlID0gbGF5b3V0LmNlbGxIZWlnaHQgPyBbbGF5b3V0LmNlbGxIZWlnaHQsIDBdIDogJ2hlaWdodCc7XG5cbiAgICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsVCkgJiYgZW5jb2RpbmcuZm4ocy5uYW1lKSA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvID09PSB1bmRlZmluZWQgPyB0cnVlIDogc3BlYy56ZXJvO1xuICAgICAgICB9XG5cbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlO1xuICAgICAgfVxuXG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcblxuICAgICAgaWYgKHMudHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICAgIHMubmljZSA9IGVuY29kaW5nLmZuKHMubmFtZSkgfHwgZW5jb2RpbmcuY29uZmlnKCd0aW1lU2NhbGVOaWNlJyk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFJPVzogLy8gc3VwcG9ydCBvbmx5IG9yZGluYWxcbiAgICAgIHMuYmFuZFdpZHRoID0gbGF5b3V0LmNlbGxIZWlnaHQ7XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIENPTDogLy8gc3VwcG9ydCBvbmx5IG9yZGluYWxcbiAgICAgIHMuYmFuZFdpZHRoID0gbGF5b3V0LmNlbGxXaWR0aDtcbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgcy5uaWNlID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU0laRTpcbiAgICAgIGlmIChlbmNvZGluZy5pcygnYmFyJykpIHtcbiAgICAgICAgLy8gRklYTUUgdGhpcyBpcyBkZWZpbml0ZWx5IGluY29ycmVjdFxuICAgICAgICAvLyBidXQgbGV0J3MgZml4IGl0IGxhdGVyIHNpbmNlIGJhciBzaXplIGlzIGEgYmFkIGVuY29kaW5nIGFueXdheVxuICAgICAgICBzLnJhbmdlID0gWzMsIE1hdGgubWF4KGVuY29kaW5nLmJhbmRTaXplKFgpLCBlbmNvZGluZy5iYW5kU2l6ZShZKSldO1xuICAgICAgfSBlbHNlIGlmIChlbmNvZGluZy5pcyhURVhUKSkge1xuICAgICAgICBzLnJhbmdlID0gWzgsIDQwXTtcbiAgICAgIH0gZWxzZSB7IC8vcG9pbnRcbiAgICAgICAgdmFyIGJhbmRTaXplID0gTWF0aC5taW4oZW5jb2RpbmcuYmFuZFNpemUoWCksIGVuY29kaW5nLmJhbmRTaXplKFkpKSAtIDE7XG4gICAgICAgIHMucmFuZ2UgPSBbMTAsIDAuOCAqIGJhbmRTaXplKmJhbmRTaXplXTtcbiAgICAgIH1cbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNIQVBFOlxuICAgICAgcy5yYW5nZSA9ICdzaGFwZXMnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDT0xPUjpcbiAgICAgIHZhciByYW5nZSA9IGVuY29kaW5nLnNjYWxlKENPTE9SKS5yYW5nZTtcbiAgICAgIGlmIChyYW5nZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICAgIC8vIEZJWE1FXG4gICAgICAgICAgcmFuZ2UgPSBzdHlsZS5jb2xvclJhbmdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJhbmdlID0gWycjQTlEQjlGJywgJyMwRDVDMjEnXTtcbiAgICAgICAgICBzLnplcm8gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcy5yYW5nZSA9IHJhbmdlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBBTFBIQTpcbiAgICAgIHMucmFuZ2UgPSBbMC4yLCAxLjBdO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZyBuYW1lOiAnKyBzLm5hbWUpO1xuICB9XG5cbiAgc3dpdGNoIChzLm5hbWUpIHtcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTDpcbiAgICAgIHMucGFkZGluZyA9IGVuY29kaW5nLmNvbmZpZygnY2VsbFBhZGRpbmcnKTtcbiAgICAgIHMub3V0ZXJQYWRkaW5nID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgWDpcbiAgICBjYXNlIFk6XG4gICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHsgLy8mJiAhcy5iYW5kV2lkdGhcbiAgICAgICAgcy5wb2ludHMgPSB0cnVlO1xuICAgICAgICBzLnBhZGRpbmcgPSBlbmNvZGluZy5iYW5kKHMubmFtZSkucGFkZGluZztcbiAgICAgIH1cbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkU29ydFRyYW5zZm9ybXM7XG5cbi8vIGFkZHMgbmV3IHRyYW5zZm9ybXMgdGhhdCBwcm9kdWNlIHNvcnRlZCBmaWVsZHNcbmZ1bmN0aW9uIGFkZFNvcnRUcmFuc2Zvcm1zKHNwZWMsIGVuY29kaW5nLCBzdGF0cywgb3B0KSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcblxuICB2YXIgZGF0YXNldE1hcHBpbmcgPSB7fTtcbiAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICB2YXIgc29ydEJ5ID0gZW5jb2Rpbmcuc29ydChlbmNUeXBlLCBzdGF0cyk7XG4gICAgaWYgKHNvcnRCeS5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgZmllbGRzID0gc29ydEJ5Lm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgb3A6IGQuYWdncixcbiAgICAgICAgICBmaWVsZDogJ2RhdGEuJyArIGQubmFtZVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBieUNsYXVzZSA9IHNvcnRCeS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICB2YXIgcmV2ZXJzZSA9IChkLnJldmVyc2UgPyAnLScgOiAnJyk7XG4gICAgICAgIHJldHVybiByZXZlcnNlICsgJ2RhdGEuJyArIChkLmFnZ3I9PT0nY291bnQnID8gJ2NvdW50JyA6IChkLmFnZ3IgKyAnXycgKyBkLm5hbWUpKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgZGF0YU5hbWUgPSAnc29ydGVkJyArIGNvdW50ZXIrKztcblxuICAgICAgdmFyIHRyYW5zZm9ybXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgICBncm91cGJ5OiBbJ2RhdGEuJyArIGZpZWxkLm5hbWVdLFxuICAgICAgICAgIGZpZWxkczogZmllbGRzXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnc29ydCcsXG4gICAgICAgICAgYnk6IGJ5Q2xhdXNlXG4gICAgICAgIH1cbiAgICAgIF07XG5cbiAgICAgIHNwZWMuZGF0YS5wdXNoKHtcbiAgICAgICAgbmFtZTogZGF0YU5hbWUsXG4gICAgICAgIHNvdXJjZTogUkFXLFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybXNcbiAgICAgIH0pO1xuXG4gICAgICBkYXRhc2V0TWFwcGluZ1tlbmNUeXBlXSA9IGRhdGFOYW1lO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBzcGVjOiBzcGVjLFxuICAgIGdldERhdGFzZXQ6IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICAgIHZhciBkYXRhID0gZGF0YXNldE1hcHBpbmdbZW5jVHlwZV07XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgcmV0dXJuIFRBQkxFO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICB9O1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyICBtYXJrcyA9IHJlcXVpcmUoJy4vbWFya3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja2luZztcblxuZnVuY3Rpb24gc3RhY2tpbmcoc3BlYywgZW5jb2RpbmcsIG1kZWYsIGZhY2V0cykge1xuICBpZiAoIW1hcmtzW2VuY29kaW5nLm1hcmt0eXBlKCldLnN0YWNrKSByZXR1cm4gZmFsc2U7XG5cbiAgLy8gVE9ETzogYWRkIHx8IGVuY29kaW5nLmhhcyhMT0QpIGhlcmUgb25jZSBMT0QgaXMgaW1wbGVtZW50ZWRcbiAgaWYgKCFlbmNvZGluZy5oYXMoQ09MT1IpKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGRpbT1udWxsLCB2YWw9bnVsbCwgaWR4ID1udWxsLFxuICAgIGlzWE1lYXN1cmUgPSBlbmNvZGluZy5pc01lYXN1cmUoWCksXG4gICAgaXNZTWVhc3VyZSA9IGVuY29kaW5nLmlzTWVhc3VyZShZKTtcblxuICBpZiAoaXNYTWVhc3VyZSAmJiAhaXNZTWVhc3VyZSkge1xuICAgIGRpbSA9IFk7XG4gICAgdmFsID0gWDtcbiAgICBpZHggPSAwO1xuICB9IGVsc2UgaWYgKGlzWU1lYXN1cmUgJiYgIWlzWE1lYXN1cmUpIHtcbiAgICBkaW0gPSBYO1xuICAgIHZhbCA9IFk7XG4gICAgaWR4ID0gMTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDsgLy8gbm8gc3RhY2sgZW5jb2RpbmdcbiAgfVxuXG4gIC8vIGFkZCB0cmFuc2Zvcm0gdG8gY29tcHV0ZSBzdW1zIGZvciBzY2FsZVxuICB2YXIgc3RhY2tlZCA9IHtcbiAgICBuYW1lOiBTVEFDS0VELFxuICAgIHNvdXJjZTogVEFCTEUsXG4gICAgdHJhbnNmb3JtOiBbe1xuICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICBncm91cGJ5OiBbZW5jb2RpbmcuZmllbGQoZGltKV0uY29uY2F0KGZhY2V0cyksIC8vIGRpbSBhbmQgb3RoZXIgZmFjZXRzXG4gICAgICBmaWVsZHM6IFt7b3A6ICdzdW0nLCBmaWVsZDogZW5jb2RpbmcuZmllbGQodmFsKX1dIC8vIFRPRE8gY2hlY2sgaWYgZmllbGQgd2l0aCBhZ2dyIGlzIGNvcnJlY3Q/XG4gICAgfV1cbiAgfTtcblxuICBpZiAoZmFjZXRzICYmIGZhY2V0cy5sZW5ndGggPiAwKSB7XG4gICAgc3RhY2tlZC50cmFuc2Zvcm0ucHVzaCh7IC8vY2FsY3VsYXRlIG1heCBmb3IgZWFjaCBmYWNldFxuICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICBncm91cGJ5OiBmYWNldHMsXG4gICAgICBmaWVsZHM6IFt7b3A6ICdtYXgnLCBmaWVsZDogJ2RhdGEuc3VtXycgKyBlbmNvZGluZy5maWVsZCh2YWwsIHRydWUpfV1cbiAgICB9KTtcbiAgfVxuXG4gIHNwZWMuZGF0YS5wdXNoKHN0YWNrZWQpO1xuXG4gIC8vIGFkZCBzdGFjayB0cmFuc2Zvcm0gdG8gbWFya1xuICBtZGVmLmZyb20udHJhbnNmb3JtID0gW3tcbiAgICB0eXBlOiAnc3RhY2snLFxuICAgIHBvaW50OiBlbmNvZGluZy5maWVsZChkaW0pLFxuICAgIGhlaWdodDogZW5jb2RpbmcuZmllbGQodmFsKSxcbiAgICBvdXRwdXQ6IHt5MTogdmFsLCB5MDogdmFsICsgJzInfVxuICB9XTtcblxuICAvLyBUT0RPOiBUaGlzIGlzIHN1cGVyIGhhY2staXNoIC0tIGNvbnNvbGlkYXRlIGludG8gbW9kdWxhciBtYXJrIHByb3BlcnRpZXM/XG4gIG1kZWYucHJvcGVydGllcy51cGRhdGVbdmFsXSA9IG1kZWYucHJvcGVydGllcy5lbnRlclt2YWxdID0ge3NjYWxlOiB2YWwsIGZpZWxkOiB2YWx9O1xuICBtZGVmLnByb3BlcnRpZXMudXBkYXRlW3ZhbCArICcyJ10gPSBtZGVmLnByb3BlcnRpZXMuZW50ZXJbdmFsICsgJzInXSA9IHtzY2FsZTogdmFsLCBmaWVsZDogdmFsICsgJzInfTtcblxuICByZXR1cm4gdmFsOyAvL3JldHVybiBzdGFjayBlbmNvZGluZ1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciB2bGZpZWxkID0gcmVxdWlyZSgnLi4vZmllbGQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbmNvZGluZywgc3RhdHMpIHtcbiAgcmV0dXJuIHtcbiAgICBvcGFjaXR5OiBlc3RpbWF0ZU9wYWNpdHkoZW5jb2RpbmcsIHN0YXRzKSxcbiAgICBjb2xvclJhbmdlOiBjb2xvclJhbmdlKGVuY29kaW5nLCBzdGF0cylcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGNvbG9yUmFuZ2UoZW5jb2RpbmcsIHN0YXRzKXtcbiAgaWYgKGVuY29kaW5nLmhhcyhDT0xPUikgJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oQ09MT1IpKSB7XG4gICAgdmFyIGNhcmRpbmFsaXR5ID0gZW5jb2RpbmcuY2FyZGluYWxpdHkoQ09MT1IsIHN0YXRzKTtcbiAgICBpZiAoY2FyZGluYWxpdHkgPD0gMTApIHtcbiAgICAgIHJldHVybiBcImNhdGVnb3J5MTBcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiY2F0ZWdvcnkyMFwiO1xuICAgIH1cbiAgICAvLyBUT0RPIGNhbiB2ZWdhIGludGVycG9sYXRlIHJhbmdlIGZvciBvcmRpbmFsIHNjYWxlP1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBlc3RpbWF0ZU9wYWNpdHkoZW5jb2Rpbmcsc3RhdHMpIHtcbiAgaWYgKCFzdGF0cykge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgdmFyIG51bVBvaW50cyA9IDA7XG5cbiAgaWYgKGVuY29kaW5nLmlzQWdncmVnYXRlKCkpIHsgLy8gYWdncmVnYXRlIHBsb3RcbiAgICBudW1Qb2ludHMgPSAxO1xuXG4gICAgLy8gIGdldCBudW1iZXIgb2YgcG9pbnRzIGluIGVhY2ggXCJjZWxsXCJcbiAgICAvLyAgYnkgY2FsY3VsYXRpbmcgcHJvZHVjdCBvZiBjYXJkaW5hbGl0eVxuICAgIC8vICBmb3IgZWFjaCBub24gZmFjZXRpbmcgYW5kIG5vbi1vcmRpbmFsIFggLyBZIGZpZWxkc1xuICAgIC8vICBub3RlIHRoYXQgb3JkaW5hbCB4LHkgYXJlIG5vdCBpbmNsdWRlIHNpbmNlIHdlIGNhblxuICAgIC8vICBjb25zaWRlciB0aGF0IG9yZGluYWwgeCBhcmUgc3ViZGl2aWRpbmcgdGhlIGNlbGwgaW50byBzdWJjZWxscyBhbnl3YXlcbiAgICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG5cbiAgICAgIGlmIChlbmNUeXBlICE9PSBST1cgJiYgZW5jVHlwZSAhPT0gQ09MICYmXG4gICAgICAgICAgISgoZW5jVHlwZSA9PT0gWCB8fCBlbmNUeXBlID09PSBZKSAmJlxuICAgICAgICAgIHZsZmllbGQuaXNPcmRpbmFsU2NhbGUoZmllbGQsIHRydWUpKVxuICAgICAgICApIHtcbiAgICAgICAgbnVtUG9pbnRzICo9IGVuY29kaW5nLmNhcmRpbmFsaXR5KGVuY1R5cGUsIHN0YXRzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9IGVsc2UgeyAvLyByYXcgcGxvdFxuICAgIG51bVBvaW50cyA9IHN0YXRzLmNvdW50O1xuXG4gICAgLy8gc21hbGwgbXVsdGlwbGVzIGRpdmlkZSBudW1iZXIgb2YgcG9pbnRzXG4gICAgdmFyIG51bU11bHRpcGxlcyA9IDE7XG4gICAgaWYgKGVuY29kaW5nLmhhcyhST1cpKSB7XG4gICAgICBudW1NdWx0aXBsZXMgKj0gZW5jb2RpbmcuY2FyZGluYWxpdHkoUk9XLCBzdGF0cyk7XG4gICAgfVxuICAgIGlmIChlbmNvZGluZy5oYXMoQ09MKSkge1xuICAgICAgbnVtTXVsdGlwbGVzICo9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTCwgc3RhdHMpO1xuICAgIH1cbiAgICBudW1Qb2ludHMgLz0gbnVtTXVsdGlwbGVzO1xuICB9XG5cbiAgdmFyIG9wYWNpdHkgPSAwO1xuICBpZiAobnVtUG9pbnRzIDwgMjApIHtcbiAgICBvcGFjaXR5ID0gMTtcbiAgfSBlbHNlIGlmIChudW1Qb2ludHMgPCAyMDApIHtcbiAgICBvcGFjaXR5ID0gMC43O1xuICB9IGVsc2UgaWYgKG51bVBvaW50cyA8IDEwMDAgfHwgZW5jb2RpbmcuaXMoJ3RpY2snKSkge1xuICAgIG9wYWNpdHkgPSAwLjY7XG4gIH0gZWxzZSB7XG4gICAgb3BhY2l0eSA9IDAuMztcbiAgfVxuXG4gIHJldHVybiBvcGFjaXR5O1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIGdyb3VwZGVmID0gcmVxdWlyZSgnLi9ncm91cCcpLmRlZjtcblxubW9kdWxlLmV4cG9ydHMgPSBzdWJmYWNldGluZztcblxuZnVuY3Rpb24gc3ViZmFjZXRpbmcoZ3JvdXAsIG1kZWYsIGRldGFpbHMsIHN0YWNrLCBlbmNvZGluZykge1xuICB2YXIgbSA9IGdyb3VwLm1hcmtzLFxuICAgIGcgPSBncm91cGRlZignc3ViZmFjZXQnLCB7bWFya3M6IG19KTtcblxuICBncm91cC5tYXJrcyA9IFtnXTtcbiAgZy5mcm9tID0gbWRlZi5mcm9tO1xuICBkZWxldGUgbWRlZi5mcm9tO1xuXG4gIC8vVE9ETyB0ZXN0IExPRCAtLSB3ZSBzaG91bGQgc3VwcG9ydCBzdGFjayAvIGxpbmUgd2l0aG91dCBjb2xvciAoTE9EKSBmaWVsZFxuICB2YXIgdHJhbnMgPSAoZy5mcm9tLnRyYW5zZm9ybSB8fCAoZy5mcm9tLnRyYW5zZm9ybSA9IFtdKSk7XG4gIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IGRldGFpbHN9KTtcblxuICBpZiAoc3RhY2sgJiYgZW5jb2RpbmcuaGFzKENPTE9SKSkge1xuICAgIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdzb3J0JywgYnk6IGVuY29kaW5nLmZpZWxkKENPTE9SKX0pO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIGdyb3VwZGVmID0gcmVxdWlyZSgnLi9ncm91cCcpLmRlZixcbiAgdmxmaWVsZCA9IHJlcXVpcmUoJy4uL2ZpZWxkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcblxuICB2YXIgZGF0YSA9IHtuYW1lOiBSQVcsIGZvcm1hdDoge319LFxuICAgIHRhYmxlID0ge25hbWU6IFRBQkxFLCBzb3VyY2U6IFJBV30sXG4gICAgZGF0YVVybCA9IGVuY29kaW5nLmRhdGEoJ3VybCcpLFxuICAgIGRhdGFUeXBlID0gZW5jb2RpbmcuZGF0YSgnZm9ybWF0VHlwZScpLFxuICAgIHZhbHVlcyA9IGVuY29kaW5nLmRhdGEoJ3ZhbHVlcycpO1xuXG4gIGlmIChlbmNvZGluZy5oYXNWYWx1ZXMoKSkge1xuICAgIGRhdGEudmFsdWVzID0gdmFsdWVzO1xuICB9IGVsc2Uge1xuICAgIGRhdGEudXJsID0gZGF0YVVybDtcbiAgICBkYXRhLmZvcm1hdC50eXBlID0gZGF0YVR5cGU7XG4gIH1cblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgdmFyIG5hbWU7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT0gVCkge1xuICAgICAgZGF0YS5mb3JtYXQucGFyc2UgPSBkYXRhLmZvcm1hdC5wYXJzZSB8fCB7fTtcbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlW2ZpZWxkLm5hbWVdID0gJ2RhdGUnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PSBRKSB7XG4gICAgICBkYXRhLmZvcm1hdC5wYXJzZSA9IGRhdGEuZm9ybWF0LnBhcnNlIHx8IHt9O1xuICAgICAgaWYgKHZsZmllbGQuaXNDb3VudChmaWVsZCkpIHtcbiAgICAgICAgbmFtZSA9ICdjb3VudCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuYW1lID0gZmllbGQubmFtZTtcbiAgICAgIH1cbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlW25hbWVdID0gJ251bWJlcic7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiBsYXlvdXQud2lkdGgsXG4gICAgaGVpZ2h0OiBsYXlvdXQuaGVpZ2h0LFxuICAgIHBhZGRpbmc6ICdhdXRvJyxcbiAgICBkYXRhOiBbZGF0YSwgdGFibGVdLFxuICAgIG1hcmtzOiBbZ3JvdXBkZWYoJ2NlbGwnLCB7XG4gICAgICB3aWR0aDogbGF5b3V0LmNlbGxXaWR0aCA/IHt2YWx1ZTogbGF5b3V0LmNlbGxXaWR0aH0gOiB1bmRlZmluZWQsXG4gICAgICBoZWlnaHQ6IGxheW91dC5jZWxsSGVpZ2h0ID8ge3ZhbHVlOiBsYXlvdXQuY2VsbEhlaWdodH0gOiB1bmRlZmluZWRcbiAgICB9KV1cbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGltZTtcblxuZnVuY3Rpb24gdGltZShzcGVjLCBlbmNvZGluZywgb3B0KSB7XG4gIC8vIGpzaGludCB1bnVzZWQ6ZmFsc2VcbiAgdmFyIHRpbWVGaWVsZHMgPSB7fSwgdGltZUZuID0ge307XG5cbiAgLy8gZmluZCB1bmlxdWUgZm9ybXVsYSB0cmFuc2Zvcm1hdGlvbiBhbmQgYmluIGZ1bmN0aW9uXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gVCAmJiBmaWVsZC5mbikge1xuICAgICAgdGltZUZpZWxkc1tlbmNvZGluZy5maWVsZChlbmNUeXBlKV0gPSB7XG4gICAgICAgIGZpZWxkOiBmaWVsZCxcbiAgICAgICAgZW5jVHlwZTogZW5jVHlwZVxuICAgICAgfTtcbiAgICAgIHRpbWVGbltmaWVsZC5mbl0gPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gYWRkIGZvcm11bGEgdHJhbnNmb3JtXG4gIHZhciBkYXRhID0gc3BlYy5kYXRhWzFdLFxuICAgIHRyYW5zZm9ybSA9IGRhdGEudHJhbnNmb3JtID0gZGF0YS50cmFuc2Zvcm0gfHwgW107XG5cbiAgZm9yICh2YXIgZiBpbiB0aW1lRmllbGRzKSB7XG4gICAgdmFyIHRmID0gdGltZUZpZWxkc1tmXTtcbiAgICB0aW1lLnRyYW5zZm9ybSh0cmFuc2Zvcm0sIGVuY29kaW5nLCB0Zi5lbmNUeXBlLCB0Zi5maWVsZCk7XG4gIH1cblxuICAvLyBhZGQgc2NhbGVzXG4gIHZhciBzY2FsZXMgPSBzcGVjLnNjYWxlcyA9IHNwZWMuc2NhbGVzIHx8IFtdO1xuICBmb3IgKHZhciBmbiBpbiB0aW1lRm4pIHtcbiAgICB0aW1lLnNjYWxlKHNjYWxlcywgZm4sIGVuY29kaW5nKTtcbiAgfVxuICByZXR1cm4gc3BlYztcbn1cblxudGltZS5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSkge1xuICB2YXIgZm4gPSBmaWVsZC5mbjtcbiAgc3dpdGNoIChmbikge1xuICAgIGNhc2UgJ3NlY29uZHMnOiByZXR1cm4gNjA7XG4gICAgY2FzZSAnbWludXRlcyc6IHJldHVybiA2MDtcbiAgICBjYXNlICdob3Vycyc6IHJldHVybiAyNDtcbiAgICBjYXNlICdkYXknOiByZXR1cm4gNztcbiAgICBjYXNlICdkYXRlJzogcmV0dXJuIDMxO1xuICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIDEyO1xuICAgIGNhc2UgJ3llYXInOlxuICAgICAgdmFyIHN0YXQgPSBzdGF0c1tmaWVsZC5uYW1lXSxcbiAgICAgICAgeWVhcnN0YXQgPSBzdGF0c1sneWVhcl8nK2ZpZWxkLm5hbWVdO1xuXG4gICAgICBpZiAoIXllYXJzdGF0KSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAgIHJldHVybiB5ZWFyc3RhdC5kaXN0aW5jdCAtXG4gICAgICAgIChzdGF0Lm51bGxzID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5mdW5jdGlvbiBmaWVsZEZuKGZ1bmMsIGZpZWxkKSB7XG4gIHJldHVybiAndXRjJyArIGZ1bmMgKyAnKGQuZGF0YS4nKyBmaWVsZC5uYW1lICsnKSc7XG59XG5cbi8qKlxuICogQHJldHVybiB7U3RyaW5nfSBkYXRlIGJpbm5pbmcgZm9ybXVsYSBvZiB0aGUgZ2l2ZW4gZmllbGRcbiAqL1xudGltZS5mb3JtdWxhID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGZpZWxkRm4oZmllbGQuZm4sIGZpZWxkKTtcbn07XG5cbi8qKiBhZGQgZm9ybXVsYSB0cmFuc2Zvcm1zIHRvIGRhdGEgKi9cbnRpbWUudHJhbnNmb3JtID0gZnVuY3Rpb24odHJhbnNmb3JtLCBlbmNvZGluZywgZW5jVHlwZSwgZmllbGQpIHtcbiAgdHJhbnNmb3JtLnB1c2goe1xuICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICBmaWVsZDogZW5jb2RpbmcuZmllbGQoZW5jVHlwZSksXG4gICAgZXhwcjogdGltZS5mb3JtdWxhKGZpZWxkKVxuICB9KTtcbn07XG5cbi8qKiBhcHBlbmQgY3VzdG9tIHRpbWUgc2NhbGVzIGZvciBheGlzIGxhYmVsICovXG50aW1lLnNjYWxlID0gZnVuY3Rpb24oc2NhbGVzLCBmbiwgZW5jb2RpbmcpIHtcbiAgdmFyIGxhYmVsTGVuZ3RoID0gZW5jb2RpbmcuY29uZmlnKCd0aW1lU2NhbGVMYWJlbExlbmd0aCcpO1xuICAvLyBUT0RPIGFkZCBvcHRpb24gZm9yIHNob3J0ZXIgc2NhbGUgLyBjdXN0b20gcmFuZ2VcbiAgc3dpdGNoIChmbikge1xuICAgIGNhc2UgJ2RheSc6XG4gICAgICBzY2FsZXMucHVzaCh7XG4gICAgICAgIG5hbWU6ICd0aW1lLScrZm4sXG4gICAgICAgIHR5cGU6ICdvcmRpbmFsJyxcbiAgICAgICAgZG9tYWluOiB1dGlsLnJhbmdlKDAsIDcpLFxuICAgICAgICByYW5nZTogWydNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5JywgJ1N1bmRheSddLm1hcChcbiAgICAgICAgICBmdW5jdGlvbihzKSB7IHJldHVybiBzLnN1YnN0cigwLCBsYWJlbExlbmd0aCk7fVxuICAgICAgICApXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHNjYWxlcy5wdXNoKHtcbiAgICAgICAgbmFtZTogJ3RpbWUtJytmbixcbiAgICAgICAgdHlwZTogJ29yZGluYWwnLFxuICAgICAgICBkb21haW46IHV0aWwucmFuZ2UoMCwgMTIpLFxuICAgICAgICByYW5nZTogWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ10ubWFwKFxuICAgICAgICAgICAgZnVuY3Rpb24ocykgeyByZXR1cm4gcy5zdWJzdHIoMCwgbGFiZWxMZW5ndGgpO31cbiAgICAgICAgICApXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG50aW1lLmlzT3JkaW5hbEZuID0gZnVuY3Rpb24oZm4pIHtcbiAgc3dpdGNoIChmbikge1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2RhdGUnOlxuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnRpbWUuc2NhbGUudHlwZSA9IGZ1bmN0aW9uKGZuLCBuYW1lKSB7XG4gIGlmIChuYW1lID09PSBDT0xPUikge1xuICAgIHJldHVybiAnbGluZWFyJzsgLy8gdGhpcyBoYXMgb3JkZXJcbiAgfVxuXG4gIHJldHVybiB0aW1lLmlzT3JkaW5hbEZuKGZuKSB8fCBuYW1lID09PSBDT0wgfHwgbmFtZSA9PT0gUk9XID8gJ29yZGluYWwnIDogJ2xpbmVhcic7XG59O1xuXG50aW1lLnNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKGZuLCBuYW1lKSB7XG4gIHZhciBpc0NvbG9yID0gbmFtZSA9PT0gQ09MT1I7XG4gIHN3aXRjaCAoZm4pIHtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdtaW51dGVzJzogcmV0dXJuIGlzQ29sb3IgPyBbMCw1OV0gOiB1dGlsLnJhbmdlKDAsIDYwKTtcbiAgICBjYXNlICdob3Vycyc6IHJldHVybiBpc0NvbG9yID8gWzAsMjNdIDogdXRpbC5yYW5nZSgwLCAyNCk7XG4gICAgY2FzZSAnZGF5JzogcmV0dXJuIGlzQ29sb3IgPyBbMCw2XSA6IHV0aWwucmFuZ2UoMCwgNyk7XG4gICAgY2FzZSAnZGF0ZSc6IHJldHVybiBpc0NvbG9yID8gWzEsMzFdIDogdXRpbC5yYW5nZSgxLCAzMik7XG4gICAgY2FzZSAnbW9udGgnOiByZXR1cm4gaXNDb2xvciA/IFswLDExXSA6IHV0aWwucmFuZ2UoMCwgMTIpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqIHdoZXRoZXIgYSBwYXJ0aWN1bGFyIHRpbWUgZnVuY3Rpb24gaGFzIGN1c3RvbSBzY2FsZSBmb3IgbGFiZWxzIGltcGxlbWVudGVkIGluIHRpbWUuc2NhbGUgKi9cbnRpbWUuaGFzU2NhbGUgPSBmdW5jdGlvbihmbikge1xuICBzd2l0Y2ggKGZuKSB7XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdtb250aCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciBjb25zdHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5jb25zdHMuZW5jb2RpbmdUeXBlcyA9IFtYLCBZLCBST1csIENPTCwgU0laRSwgU0hBUEUsIENPTE9SLCBBTFBIQSwgVEVYVCwgREVUQUlMXTtcblxuY29uc3RzLmRhdGFUeXBlcyA9IHsnTyc6IE8sICdRJzogUSwgJ1QnOiBUfTtcblxuY29uc3RzLmRhdGFUeXBlTmFtZXMgPSBbJ08nLCAnUScsICdUJ10ucmVkdWNlKGZ1bmN0aW9uKHIsIHgpIHtcbiAgcltjb25zdHMuZGF0YVR5cGVzW3hdXSA9IHg7XG4gIHJldHVybiByO1xufSx7fSk7XG5cbmNvbnN0cy5zaG9ydGhhbmQgPSB7XG4gIGRlbGltOiAgJ3wnLFxuICBhc3NpZ246ICc9JyxcbiAgdHlwZTogICAnLCcsXG4gIGZ1bmM6ICAgJ18nXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdmxkYXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLyoqIE1hcHBpbmcgZnJvbSBkYXRhbGliJ3MgaW5mZXJyZWQgdHlwZSB0byBWZWdhLWxpdGUncyB0eXBlICovXG52bGRhdGEudHlwZXMgPSB7XG4gICdib29sZWFuJzogJ08nLFxuICAnbnVtYmVyJzogJ1EnLFxuICAnaW50ZWdlcic6ICdRJyxcbiAgJ2RhdGUnOiAnVCcsXG4gICdzdHJpbmcnOiAnTydcbn07XG5cbiIsIi8vIHV0aWxpdHkgZm9yIGVuY1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjb25zdHMgPSByZXF1aXJlKCcuL2NvbnN0cycpLFxuICBjID0gY29uc3RzLnNob3J0aGFuZCxcbiAgdmxmaWVsZCA9IHJlcXVpcmUoJy4vZmllbGQnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKSxcbiAgZW5jVHlwZXMgPSBzY2hlbWEuZW5jVHlwZXM7XG5cbnZhciB2bGVuYyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZsZW5jLmNvdW50UmV0aW5hbCA9IGZ1bmN0aW9uKGVuYykge1xuICB2YXIgY291bnQgPSAwO1xuICBpZiAoZW5jLmNvbG9yKSBjb3VudCsrO1xuICBpZiAoZW5jLmFscGhhKSBjb3VudCsrO1xuICBpZiAoZW5jLnNpemUpIGNvdW50Kys7XG4gIGlmIChlbmMuc2hhcGUpIGNvdW50Kys7XG4gIHJldHVybiBjb3VudDtcbn07XG5cbnZsZW5jLmhhcyA9IGZ1bmN0aW9uKGVuYywgZW5jVHlwZSkge1xuICB2YXIgZmllbGREZWYgPSBlbmMgJiYgZW5jW2VuY1R5cGVdO1xuICByZXR1cm4gZmllbGREZWYgJiYgZmllbGREZWYubmFtZTtcbn07XG5cbnZsZW5jLmlzQWdncmVnYXRlID0gZnVuY3Rpb24oZW5jKSB7XG4gIGZvciAodmFyIGsgaW4gZW5jKSB7XG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIGspICYmIGVuY1trXS5hZ2dyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxudmxlbmMuZm9yRWFjaCA9IGZ1bmN0aW9uKGVuYywgZikge1xuICB2YXIgaSA9IDA7XG4gIGVuY1R5cGVzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGlmICh2bGVuYy5oYXMoZW5jLCBrKSkge1xuICAgICAgZihlbmNba10sIGssIGkrKyk7XG4gICAgfVxuICB9KTtcbn07XG5cbnZsZW5jLm1hcCA9IGZ1bmN0aW9uKGVuYywgZikge1xuICB2YXIgYXJyID0gW107XG4gIGVuY1R5cGVzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGlmICh2bGVuYy5oYXMoZW5jLCBrKSkge1xuICAgICAgYXJyLnB1c2goZihlbmNba10sIGssIGVuYykpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcnI7XG59O1xuXG52bGVuYy5yZWR1Y2UgPSBmdW5jdGlvbihlbmMsIGYsIGluaXQpIHtcbiAgdmFyIHIgPSBpbml0O1xuICBlbmNUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykpIHtcbiAgICAgIHIgPSBmKHIsIGVuY1trXSwgaywgIGVuYyk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHI7XG59O1xuXG4vKlxuICogcmV0dXJuIGtleS12YWx1ZSBwYWlycyBvZiBmaWVsZCBuYW1lIGFuZCBsaXN0IG9mIGZpZWxkcyBvZiB0aGF0IGZpZWxkIG5hbWVcbiAqL1xudmxlbmMuZmllbGRzID0gZnVuY3Rpb24oZW5jKSB7XG4gIHJldHVybiB2bGVuYy5yZWR1Y2UoZW5jLCBmdW5jdGlvbiAobSwgZmllbGQpIHtcbiAgICB2YXIgZmllbGRMaXN0ID0gbVtmaWVsZC5uYW1lXSA9IG1bZmllbGQubmFtZV0gfHwgW10sXG4gICAgICBjb250YWluc1R5cGUgPSBmaWVsZExpc3QuY29udGFpbnNUeXBlID0gZmllbGRMaXN0LmNvbnRhaW5zVHlwZSB8fCB7fTtcblxuICAgIGlmIChmaWVsZExpc3QuaW5kZXhPZihmaWVsZCkgPT09IC0xKSB7XG4gICAgICBmaWVsZExpc3QucHVzaChmaWVsZCk7XG4gICAgICAvLyBhdWdtZW50IHRoZSBhcnJheSB3aXRoIGNvbnRhaW5zVHlwZS5RIC8gTyAvIFRcbiAgICAgIGNvbnRhaW5zVHlwZVtmaWVsZC50eXBlXSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBtO1xuICB9LCB7fSk7XG59O1xuXG52bGVuYy5zaG9ydGhhbmQgPSBmdW5jdGlvbihlbmMpIHtcbiAgcmV0dXJuIHZsZW5jLm1hcChlbmMsIGZ1bmN0aW9uKGZpZWxkLCBldCkge1xuICAgIHJldHVybiBldCArIGMuYXNzaWduICsgdmxmaWVsZC5zaG9ydGhhbmQoZmllbGQpO1xuICB9KS5qb2luKGMuZGVsaW0pO1xufTtcblxudmxlbmMuZnJvbVNob3J0aGFuZCA9IGZ1bmN0aW9uKHNob3J0aGFuZCwgY29udmVydFR5cGUpIHtcbiAgdmFyIGVuYyA9IHV0aWwuaXNBcnJheShzaG9ydGhhbmQpID8gc2hvcnRoYW5kIDogc2hvcnRoYW5kLnNwbGl0KGMuZGVsaW0pO1xuICByZXR1cm4gZW5jLnJlZHVjZShmdW5jdGlvbihtLCBlKSB7XG4gICAgdmFyIHNwbGl0ID0gZS5zcGxpdChjLmFzc2lnbiksXG4gICAgICAgIGVuY3R5cGUgPSBzcGxpdFswXS50cmltKCksXG4gICAgICAgIGZpZWxkID0gc3BsaXRbMV07XG5cbiAgICBtW2VuY3R5cGVdID0gdmxmaWVsZC5mcm9tU2hvcnRoYW5kKGZpZWxkLCBjb252ZXJ0VHlwZSk7XG4gICAgcmV0dXJuIG07XG4gIH0sIHt9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB1dGlsaXR5IGZvciBmaWVsZFxuXG52YXIgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gIHRpbWUgPSByZXF1aXJlKCcuL2NvbXBpbGUvdGltZScpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpO1xuXG52YXIgdmxmaWVsZCA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZsZmllbGQuc2hvcnRoYW5kID0gZnVuY3Rpb24oZikge1xuICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQ7XG4gIHJldHVybiAoZi5hZ2dyID8gZi5hZ2dyICsgYy5mdW5jIDogJycpICtcbiAgICAoZi5mbiA/IGYuZm4gKyBjLmZ1bmMgOiAnJykgK1xuICAgIChmLmJpbiA/ICdiaW4nICsgYy5mdW5jIDogJycpICtcbiAgICAoZi5uYW1lIHx8ICcnKSArIGMudHlwZSArXG4gICAgKGNvbnN0cy5kYXRhVHlwZU5hbWVzW2YudHlwZV0gfHwgZi50eXBlKTtcbn07XG5cbnZsZmllbGQuc2hvcnRoYW5kcyA9IGZ1bmN0aW9uKGZpZWxkcywgZGVsaW0pIHtcbiAgZGVsaW0gPSBkZWxpbSB8fCBjLmRlbGltO1xuICByZXR1cm4gZmllbGRzLm1hcCh2bGZpZWxkLnNob3J0aGFuZCkuam9pbihkZWxpbSk7XG59O1xuXG52bGZpZWxkLmZyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGNvbnZlcnRUeXBlKSB7XG4gIHZhciBzcGxpdCA9IHNob3J0aGFuZC5zcGxpdChjLnR5cGUpLCBpO1xuICB2YXIgbyA9IHtcbiAgICBuYW1lOiBzcGxpdFswXS50cmltKCksXG4gICAgdHlwZTogY29udmVydFR5cGUgPyBjb25zdHMuZGF0YVR5cGVzW3NwbGl0WzFdLnRyaW0oKV0gOiBzcGxpdFsxXS50cmltKClcbiAgfTtcblxuICAvLyBjaGVjayBhZ2dyZWdhdGUgdHlwZVxuICBmb3IgKGkgaW4gc2NoZW1hLmFnZ3IuZW51bSkge1xuICAgIHZhciBhID0gc2NoZW1hLmFnZ3IuZW51bVtpXTtcbiAgICBpZiAoby5uYW1lLmluZGV4T2YoYSArICdfJykgPT09IDApIHtcbiAgICAgIG8ubmFtZSA9IG8ubmFtZS5zdWJzdHIoYS5sZW5ndGggKyAxKTtcbiAgICAgIGlmIChhID09ICdjb3VudCcgJiYgby5uYW1lLmxlbmd0aCA9PT0gMCkgby5uYW1lID0gJyonO1xuICAgICAgby5hZ2dyID0gYTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoZWNrIHRpbWUgZm5cbiAgZm9yIChpIGluIHNjaGVtYS50aW1lZm5zKSB7XG4gICAgdmFyIGYgPSBzY2hlbWEudGltZWZuc1tpXTtcbiAgICBpZiAoby5uYW1lICYmIG8ubmFtZS5pbmRleE9mKGYgKyAnXycpID09PSAwKSB7XG4gICAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKG8ubGVuZ3RoICsgMSk7XG4gICAgICBvLmZuID0gZjtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoZWNrIGJpblxuICBpZiAoby5uYW1lICYmIG8ubmFtZS5pbmRleE9mKCdiaW5fJykgPT09IDApIHtcbiAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKDQpO1xuICAgIG8uYmluID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBvO1xufTtcblxudmFyIHR5cGVPcmRlciA9IHtcbiAgTzogMCxcbiAgRzogMSxcbiAgVDogMixcbiAgUTogM1xufTtcblxudmxmaWVsZC5vcmRlciA9IHt9O1xuXG52bGZpZWxkLm9yZGVyLnR5cGUgPSBmdW5jdGlvbihmaWVsZCkge1xuICBpZiAoZmllbGQuYWdncj09PSdjb3VudCcpIHJldHVybiA0O1xuICByZXR1cm4gdHlwZU9yZGVyW2ZpZWxkLnR5cGVdO1xufTtcblxudmxmaWVsZC5vcmRlci50eXBlVGhlbk5hbWUgPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gdmxmaWVsZC5vcmRlci50eXBlKGZpZWxkKSArICdfJyArIGZpZWxkLm5hbWUudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZsZmllbGQub3JkZXIub3JpZ2luYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIDA7IC8vIG5vIHN3YXAgd2lsbCBvY2N1clxufTtcblxudmxmaWVsZC5vcmRlci5uYW1lID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGZpZWxkLm5hbWU7XG59O1xuXG52bGZpZWxkLm9yZGVyLnR5cGVUaGVuQ2FyZGluYWxpdHkgPSBmdW5jdGlvbihmaWVsZCwgc3RhdHMpe1xuICByZXR1cm4gc3RhdHNbZmllbGQubmFtZV0uZGlzdGluY3Q7XG59O1xuXG4vLyBGSVhNRSByZWZhY3RvclxudmxmaWVsZC5pc1R5cGUgPSBmdW5jdGlvbiAoZmllbGREZWYsIHR5cGUpIHtcbiAgcmV0dXJuIChmaWVsZERlZi50eXBlICYgdHlwZSkgPiAwO1xufTtcblxudmxmaWVsZC5pc1R5cGUuYnlDb2RlID0gdmxmaWVsZC5pc1R5cGU7XG5cbnZsZmllbGQuaXNUeXBlLmJ5TmFtZSA9IGZ1bmN0aW9uIChmaWVsZCwgdHlwZSkge1xuICByZXR1cm4gZmllbGQudHlwZSA9PT0gY29uc3RzLmRhdGFUeXBlTmFtZXNbdHlwZV07XG59O1xuXG5cbmZ1bmN0aW9uIGdldElzVHlwZSh1c2VUeXBlQ29kZSkge1xuICByZXR1cm4gdXNlVHlwZUNvZGUgPyB2bGZpZWxkLmlzVHlwZS5ieUNvZGUgOiB2bGZpZWxkLmlzVHlwZS5ieU5hbWU7XG59XG5cbnZsZmllbGQuaXNUeXBlLmdldCA9IGdldElzVHlwZTsgLy9GSVhNRVxuXG4vKlxuICogTW9zdCBmaWVsZHMgdGhhdCB1c2Ugb3JkaW5hbCBzY2FsZSBhcmUgZGltZW5zaW9ucy5cbiAqIEhvd2V2ZXIsIFlFQVIoVCksIFlFQVJNT05USChUKSB1c2UgdGltZSBzY2FsZSwgbm90IG9yZGluYWwgYnV0IGFyZSBkaW1lbnNpb25zIHRvby5cbiAqL1xudmxmaWVsZC5pc09yZGluYWxTY2FsZSA9IGZ1bmN0aW9uKGZpZWxkLCB1c2VUeXBlQ29kZSAvKm9wdGlvbmFsKi8pIHtcbiAgdmFyIGlzVHlwZSA9IGdldElzVHlwZSh1c2VUeXBlQ29kZSk7XG4gIHJldHVybiAgaXNUeXBlKGZpZWxkLCBPKSB8fCBmaWVsZC5iaW4gfHxcbiAgICAoIGlzVHlwZShmaWVsZCwgVCkgJiYgZmllbGQuZm4gJiYgdGltZS5pc09yZGluYWxGbihmaWVsZC5mbikgKTtcbn07XG5cbmZ1bmN0aW9uIGlzRGltZW5zaW9uKGZpZWxkLCB1c2VUeXBlQ29kZSAvKm9wdGlvbmFsKi8pIHtcbiAgdmFyIGlzVHlwZSA9IGdldElzVHlwZSh1c2VUeXBlQ29kZSk7XG4gIHJldHVybiAgaXNUeXBlKGZpZWxkLCBPKSB8fCAhIWZpZWxkLmJpbiB8fFxuICAgICggaXNUeXBlKGZpZWxkLCBUKSAmJiAhIWZpZWxkLmZuICk7XG59XG5cbi8qKlxuICogRm9yIGVuY29kaW5nLCB1c2UgZW5jb2RpbmcuaXNEaW1lbnNpb24oKSB0byBhdm9pZCBjb25mdXNpb24uXG4gKiBPciB1c2UgRW5jb2RpbmcuaXNUeXBlIGlmIHlvdXIgZmllbGQgaXMgZnJvbSBFbmNvZGluZyAoYW5kIHRodXMgaGF2ZSBudW1lcmljIGRhdGEgdHlwZSkuXG4gKiBvdGhlcndpc2UsIGRvIG5vdCBzcGVjaWZpYyBpc1R5cGUgc28gd2UgY2FuIHVzZSB0aGUgZGVmYXVsdCBpc1R5cGVOYW1lIGhlcmUuXG4gKi9cbnZsZmllbGQuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihmaWVsZCwgdXNlVHlwZUNvZGUgLypvcHRpb25hbCovKSB7XG4gIHJldHVybiBmaWVsZCAmJiBpc0RpbWVuc2lvbihmaWVsZCwgdXNlVHlwZUNvZGUpO1xufTtcblxudmxmaWVsZC5pc01lYXN1cmUgPSBmdW5jdGlvbihmaWVsZCwgdXNlVHlwZUNvZGUpIHtcbiAgcmV0dXJuIGZpZWxkICYmICFpc0RpbWVuc2lvbihmaWVsZCwgdXNlVHlwZUNvZGUpO1xufTtcblxudmxmaWVsZC5yb2xlID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGlzRGltZW5zaW9uKGZpZWxkKSA/ICdkaW1lbnNpb24nIDogJ21lYXN1cmUnO1xufTtcblxudmxmaWVsZC5jb3VudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge25hbWU6JyonLCBhZ2dyOiAnY291bnQnLCB0eXBlOidRJywgZGlzcGxheU5hbWU6IHZsZmllbGQuY291bnQuZGlzcGxheU5hbWV9O1xufTtcblxudmxmaWVsZC5jb3VudC5kaXNwbGF5TmFtZSA9ICdOdW1iZXIgb2YgUmVjb3Jkcyc7XG5cbnZsZmllbGQuaXNDb3VudCA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiBmaWVsZC5hZ2dyID09PSAnY291bnQnO1xufTtcblxuLyoqXG4gKiBGb3IgZW5jb2RpbmcsIHVzZSBlbmNvZGluZy5jYXJkaW5hbGl0eSgpIHRvIGF2b2lkIGNvbmZ1c2lvbi4gIE9yIHVzZSBFbmNvZGluZy5pc1R5cGUgaWYgeW91ciBmaWVsZCBpcyBmcm9tIEVuY29kaW5nIChhbmQgdGh1cyBoYXZlIG51bWVyaWMgZGF0YSB0eXBlKS5cbiAqIG90aGVyd2lzZSwgZG8gbm90IHNwZWNpZmljIGlzVHlwZSBzbyB3ZSBjYW4gdXNlIHRoZSBkZWZhdWx0IGlzVHlwZU5hbWUgaGVyZS5cbiAqL1xudmxmaWVsZC5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdXNlVHlwZUNvZGUpIHtcbiAgLy8gRklYTUUgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcblxuICB2YXIgc3RhdCA9IHN0YXRzW2ZpZWxkLm5hbWVdO1xuICB2YXIgaXNUeXBlID0gZ2V0SXNUeXBlKHVzZVR5cGVDb2RlKSxcbiAgICB0eXBlID0gdXNlVHlwZUNvZGUgPyBjb25zdHMuZGF0YVR5cGVOYW1lc1tmaWVsZC50eXBlXSA6IGZpZWxkLnR5cGU7XG5cbiAgZmlsdGVyTnVsbCA9IGZpbHRlck51bGwgfHwge307XG5cbiAgaWYgKGZpZWxkLmJpbikge1xuICAgIHZhciBiaW5zID0gdXRpbC5nZXRiaW5zKHN0YXQsIGZpZWxkLmJpbi5tYXhiaW5zIHx8IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQpO1xuICAgIHJldHVybiAoYmlucy5zdG9wIC0gYmlucy5zdGFydCkgLyBiaW5zLnN0ZXA7XG4gIH1cbiAgaWYgKGlzVHlwZShmaWVsZCwgVCkpIHtcbiAgICB2YXIgY2FyZGluYWxpdHkgPSB0aW1lLmNhcmRpbmFsaXR5KGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSk7XG4gICAgaWYoY2FyZGluYWxpdHkgIT09IG51bGwpIHJldHVybiBjYXJkaW5hbGl0eTtcbiAgICAvL290aGVyd2lzZSB1c2UgY2FsY3VsYXRpb24gYmVsb3dcbiAgfVxuICBpZiAoZmllbGQuYWdncikge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgLy8gcmVtb3ZlIG51bGxcbiAgcmV0dXJuIHN0YXQuZGlzdGluY3QgLVxuICAgIChzdGF0Lm51bGxzID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gZGVjbGFyZSBnbG9iYWwgY29uc3RhbnRcbnZhciBnID0gZ2xvYmFsIHx8IHdpbmRvdztcblxuZy5UQUJMRSA9ICd0YWJsZSc7XG5nLlJBVyA9ICdyYXcnO1xuZy5TVEFDS0VEID0gJ3N0YWNrZWQnO1xuZy5JTkRFWCA9ICdpbmRleCc7XG5cbmcuWCA9ICd4JztcbmcuWSA9ICd5JztcbmcuUk9XID0gJ3Jvdyc7XG5nLkNPTCA9ICdjb2wnO1xuZy5TSVpFID0gJ3NpemUnO1xuZy5TSEFQRSA9ICdzaGFwZSc7XG5nLkNPTE9SID0gJ2NvbG9yJztcbmcuQUxQSEEgPSAnYWxwaGEnO1xuZy5URVhUID0gJ3RleHQnO1xuZy5ERVRBSUwgPSAnZGV0YWlsJztcblxuZy5PID0gMTtcbmcuUSA9IDI7XG5nLlQgPSA0O1xuIiwiLy8gUGFja2FnZSBvZiBkZWZpbmluZyBWZWdhLWxpdGUgU3BlY2lmaWNhdGlvbidzIGpzb24gc2NoZW1hXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHNjaGVtYSA9IG1vZHVsZS5leHBvcnRzID0ge30sXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnNjaGVtYS51dGlsID0gcmVxdWlyZSgnLi9zY2hlbWF1dGlsJyk7XG5cbnNjaGVtYS5tYXJrdHlwZSA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IFsncG9pbnQnLCAndGljaycsICdiYXInLCAnbGluZScsICdhcmVhJywgJ2NpcmNsZScsICdzcXVhcmUnLCAndGV4dCddXG59O1xuXG5zY2hlbWEuYWdnciA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IFsnYXZnJywgJ3N1bScsICdtaW4nLCAnbWF4JywgJ2NvdW50J10sXG4gIHN1cHBvcnRlZEVudW1zOiB7XG4gICAgUTogWydhdmcnLCAnc3VtJywgJ21pbicsICdtYXgnLCAnY291bnQnXSxcbiAgICBPOiBbXSxcbiAgICBUOiBbJ2F2ZycsICdtaW4nLCAnbWF4J10sXG4gICAgJyc6IFsnY291bnQnXVxuICB9LFxuICBzdXBwb3J0ZWRUeXBlczogeydRJzogdHJ1ZSwgJ08nOiB0cnVlLCAnVCc6IHRydWUsICcnOiB0cnVlfVxufTtcbnNjaGVtYS5iYW5kID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHNpemU6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIHBhZGRpbmc6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZWZhdWx0OiAxXG4gICAgfVxuICB9XG59O1xuXG5zY2hlbWEuZ2V0U3VwcG9ydGVkUm9sZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgcmV0dXJuIHNjaGVtYS5zY2hlbWEucHJvcGVydGllcy5lbmMucHJvcGVydGllc1tlbmNUeXBlXS5zdXBwb3J0ZWRSb2xlO1xufTtcblxuc2NoZW1hLnRpbWVmbnMgPSBbJ3llYXInLCAnbW9udGgnLCAnZGF5JywgJ2RhdGUnLCAnaG91cnMnLCAnbWludXRlcycsICdzZWNvbmRzJ107XG5cbnNjaGVtYS5kZWZhdWx0VGltZUZuID0gJ21vbnRoJztcblxuc2NoZW1hLmZuID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogc2NoZW1hLnRpbWVmbnMsXG4gIHN1cHBvcnRlZFR5cGVzOiB7J1QnOiB0cnVlfVxufTtcblxuLy9UT0RPKGthbml0dyk6IGFkZCBvdGhlciB0eXBlIG9mIGZ1bmN0aW9uIGhlcmVcblxuc2NoZW1hLnNjYWxlX3R5cGUgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBbJ2xpbmVhcicsICdsb2cnLCAncG93JywgJ3NxcnQnLCAncXVhbnRpbGUnXSxcbiAgZGVmYXVsdDogJ2xpbmVhcicsXG4gIHN1cHBvcnRlZFR5cGVzOiB7J1EnOiB0cnVlfVxufTtcblxuc2NoZW1hLmZpZWxkID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgfVxuICB9XG59O1xuXG52YXIgY2xvbmUgPSB1dGlsLmR1cGxpY2F0ZTtcbnZhciBtZXJnZSA9IHNjaGVtYS51dGlsLm1lcmdlO1xuXG5zY2hlbWEuTUFYQklOU19ERUZBVUxUID0gMTU7XG5cbnZhciBiaW4gPSB7XG4gIHR5cGU6IFsnYm9vbGVhbicsICdvYmplY3QnXSxcbiAgZGVmYXVsdDogZmFsc2UsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBtYXhiaW5zOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiBzY2hlbWEuTUFYQklOU19ERUZBVUxULFxuICAgICAgbWluaW11bTogMlxuICAgIH1cbiAgfSxcbiAgc3VwcG9ydGVkVHlwZXM6IHsnUSc6IHRydWV9IC8vIFRPRE86IGFkZCAnTycgYWZ0ZXIgZmluaXNoaW5nICM4MVxufTtcblxudmFyIHR5cGljYWxGaWVsZCA9IG1lcmdlKGNsb25lKHNjaGVtYS5maWVsZCksIHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnTycsICdRJywgJ1QnXVxuICAgIH0sXG4gICAgYWdncjogc2NoZW1hLmFnZ3IsXG4gICAgZm46IHNjaGVtYS5mbixcbiAgICBiaW46IGJpbixcbiAgICBzY2FsZToge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHR5cGU6IHNjaGVtYS5zY2FsZV90eXBlLFxuICAgICAgICByZXZlcnNlOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgIHN1cHBvcnRlZFR5cGVzOiB7J1EnOiB0cnVlLCAnVCc6IHRydWV9XG4gICAgICAgIH0sXG4gICAgICAgIHplcm86IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdJbmNsdWRlIHplcm8nLFxuICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHsnUSc6IHRydWUsICdUJzogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgICAgbmljZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IFsnc2Vjb25kJywgJ21pbnV0ZScsICdob3VyJywgJ2RheScsICd3ZWVrJywgJ21vbnRoJywgJ3llYXInXSxcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczogeydUJzogdHJ1ZX1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBvbmx5T3JkaW5hbEZpZWxkID0gbWVyZ2UoY2xvbmUoc2NoZW1hLmZpZWxkKSwge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkUm9sZToge1xuICAgIGRpbWVuc2lvbjogdHJ1ZVxuICB9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ08nLCdRJywgJ1QnXSAvLyBvcmRpbmFsLW9ubHkgZmllbGQgc3VwcG9ydHMgUSB3aGVuIGJpbiBpcyBhcHBsaWVkIGFuZCBUIHdoZW4gZm4gaXMgYXBwbGllZC5cbiAgICB9LFxuICAgIGZuOiBzY2hlbWEuZm4sXG4gICAgYmluOiBiaW4sXG4gICAgYWdncjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2NvdW50J10sXG4gICAgICBzdXBwb3J0ZWRUeXBlczogeydPJzogdHJ1ZX1cbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgYXhpc01peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGJhcjogdHJ1ZSwgbGluZTogdHJ1ZSwgYXJlYTogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYXhpczoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgZmxhZyBpbmRpY2F0ZSBpZiBncmlkbGluZXMgc2hvdWxkIGJlIGNyZWF0ZWQgaW4gYWRkaXRpb24gdG8gdGlja3MuJ1xuICAgICAgICB9LFxuICAgICAgICB0aXRsZToge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSB0aXRsZSBmb3IgdGhlIGF4aXMuJ1xuICAgICAgICB9LFxuICAgICAgICB0aXRsZU9mZnNldDoge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIG9mZnNldCB2YWx1ZSBmb3IgdGhlIGF4aXMuJ1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9ybWF0dGluZyBwYXR0ZXJuIGZvciBheGlzIGxhYmVscy4nXG4gICAgICAgIH0sXG4gICAgICAgIG1heExhYmVsTGVuZ3RoOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDI1LFxuICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUcnVuY2F0ZSBsYWJlbHMgdGhhdCBhcmUgdG9vIGxvbmcuJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgc29ydE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHNvcnQ6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiBbXSxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBzdXBwb3J0ZWRUeXBlczogeydPJzogdHJ1ZX0sXG4gICAgICAgIHJlcXVpcmVkOiBbJ25hbWUnLCAnYWdnciddLFxuICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgYWdncjoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IFsnYXZnJywgJ3N1bScsICdtaW4nLCAnbWF4JywgJ2NvdW50J11cbiAgICAgICAgfSxcbiAgICAgICAgcmV2ZXJzZToge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgYmFuZE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGJhbmQ6IHNjaGVtYS5iYW5kXG4gIH1cbn07XG5cbnZhciBsZWdlbmRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBsZWdlbmQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG5cbnZhciB0ZXh0TWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHsndGV4dCc6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdGV4dDoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGFsaWduOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ2xlZnQnXG4gICAgICAgIH0sXG4gICAgICAgIGJhc2VsaW5lOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ21pZGRsZSdcbiAgICAgICAgfSxcbiAgICAgICAgbWFyZ2luOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDQsXG4gICAgICAgICAgbWluaW11bTogMFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBmb250OiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgd2VpZ2h0OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydub3JtYWwnLCAnYm9sZCddLFxuICAgICAgICAgIGRlZmF1bHQ6ICdub3JtYWwnXG4gICAgICAgIH0sXG4gICAgICAgIHNpemU6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogMTAsXG4gICAgICAgICAgbWluaW11bTogMFxuICAgICAgICB9LFxuICAgICAgICBmYW1pbHk6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnSGVsdmV0aWNhIE5ldWUnXG4gICAgICAgIH0sXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ25vcm1hbCcsXG4gICAgICAgICAgZW51bTogWydub3JtYWwnLCAnaXRhbGljJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIHNpemVNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCBiYXI6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLCB0ZXh0OiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAzMCxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9XG4gIH1cbn07XG5cbnZhciBjb2xvck1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGJhcjogdHJ1ZSwgbGluZTogdHJ1ZSwgYXJlYTogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsICd0ZXh0JzogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJ3N0ZWVsYmx1ZSdcbiAgICB9LFxuICAgIHNjYWxlOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICB0eXBlOiBbJ3N0cmluZycsICdhcnJheSddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBhbHBoYU1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGJhcjogdHJ1ZSwgbGluZTogdHJ1ZSwgYXJlYTogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsICd0ZXh0JzogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMVxuICAgIH1cbiAgfVxufTtcblxudmFyIHNoYXBlTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydjaXJjbGUnLCAnc3F1YXJlJywgJ2Nyb3NzJywgJ2RpYW1vbmQnLCAndHJpYW5nbGUtdXAnLCAndHJpYW5nbGUtZG93biddLFxuICAgICAgZGVmYXVsdDogJ2NpcmNsZSdcbiAgICB9XG4gIH1cbn07XG5cbnZhciBkZXRhaWxNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBsaW5lOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX1cbn07XG5cbnZhciByb3dNaXhpbiA9IHtcbiAgcHJvcGVydGllczoge1xuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVmYXVsdDogMTUwXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgZGVzY3JpcHRpb246ICdBIGZsYWcgaW5kaWNhdGUgaWYgZ3JpZGxpbmVzIHNob3VsZCBiZSBjcmVhdGVkIGluIGFkZGl0aW9uIHRvIHRpY2tzLidcbiAgICB9LFxuICB9XG59O1xuXG52YXIgY29sTWl4aW4gPSB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICB3aWR0aDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVmYXVsdDogMTUwXG4gICAgfSxcbiAgICBheGlzOiB7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1heExhYmVsTGVuZ3RoOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDEyLFxuICAgICAgICAgIG1pbmltdW06IDAsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUcnVuY2F0ZSBsYWJlbHMgdGhhdCBhcmUgdG9vIGxvbmcuJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgZmFjZXRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBiYXI6IHRydWUsIGxpbmU6IHRydWUsIGFyZWE6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLCB0ZXh0OiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHBhZGRpbmc6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDEsXG4gICAgICBkZWZhdWx0OiAwLjFcbiAgICB9XG4gIH1cbn07XG5cbnZhciByZXF1aXJlZE5hbWVUeXBlID0ge1xuICByZXF1aXJlZDogWyduYW1lJywgJ3R5cGUnXVxufTtcblxudmFyIG11bHRpUm9sZUZpZWxkID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwge1xuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgbWVhc3VyZTogdHJ1ZSxcbiAgICBkaW1lbnNpb246IHRydWVcbiAgfVxufSk7XG5cbnZhciBxdWFudGl0YXRpdmVGaWVsZCA9IG1lcmdlKGNsb25lKHR5cGljYWxGaWVsZCksIHtcbiAgc3VwcG9ydGVkUm9sZToge1xuICAgIG1lYXN1cmU6IHRydWUsXG4gICAgZGltZW5zaW9uOiAnb3JkaW5hbC1vbmx5JyAvLyB1c2luZyBhbHBoYSAvIHNpemUgdG8gZW5jb2RpbmcgY2F0ZWdvcnkgbGVhZCB0byBvcmRlciBpbnRlcnByZXRhdGlvblxuICB9XG59KTtcblxudmFyIG9ubHlRdWFudGl0YXRpdmVGaWVsZCA9IG1lcmdlKGNsb25lKHR5cGljYWxGaWVsZCksIHtcbiAgc3VwcG9ydGVkUm9sZToge1xuICAgIG1lYXN1cmU6IHRydWVcbiAgfVxufSk7XG5cbnZhciB4ID0gbWVyZ2UoY2xvbmUobXVsdGlSb2xlRmllbGQpLCBheGlzTWl4aW4sIGJhbmRNaXhpbiwgcmVxdWlyZWROYW1lVHlwZSwgc29ydE1peGluKTtcbnZhciB5ID0gY2xvbmUoeCk7XG5cbnZhciBmYWNldCA9IG1lcmdlKGNsb25lKG9ubHlPcmRpbmFsRmllbGQpLCByZXF1aXJlZE5hbWVUeXBlLCBmYWNldE1peGluLCBzb3J0TWl4aW4pO1xudmFyIHJvdyA9IG1lcmdlKGNsb25lKGZhY2V0KSwgYXhpc01peGluLCByb3dNaXhpbik7XG52YXIgY29sID0gbWVyZ2UoY2xvbmUoZmFjZXQpLCBheGlzTWl4aW4sIGNvbE1peGluKTtcblxudmFyIHNpemUgPSBtZXJnZShjbG9uZShxdWFudGl0YXRpdmVGaWVsZCksIGxlZ2VuZE1peGluLCBzaXplTWl4aW4sIHNvcnRNaXhpbik7XG52YXIgY29sb3IgPSBtZXJnZShjbG9uZShtdWx0aVJvbGVGaWVsZCksIGxlZ2VuZE1peGluLCBjb2xvck1peGluLCBzb3J0TWl4aW4pO1xudmFyIGFscGhhID0gbWVyZ2UoY2xvbmUocXVhbnRpdGF0aXZlRmllbGQpLCBhbHBoYU1peGluLCBzb3J0TWl4aW4pO1xudmFyIHNoYXBlID0gbWVyZ2UoY2xvbmUob25seU9yZGluYWxGaWVsZCksIGxlZ2VuZE1peGluLCBzaGFwZU1peGluLCBzb3J0TWl4aW4pO1xudmFyIGRldGFpbCA9IG1lcmdlKGNsb25lKG9ubHlPcmRpbmFsRmllbGQpLCBkZXRhaWxNaXhpbiwgc29ydE1peGluKTtcblxuLy8gd2Ugb25seSBwdXQgYWdncmVnYXRlZCBtZWFzdXJlIGluIHBpdm90IHRhYmxlXG52YXIgdGV4dCA9IG1lcmdlKGNsb25lKG9ubHlRdWFudGl0YXRpdmVGaWVsZCksIHRleHRNaXhpbiwgc29ydE1peGluKTtcblxuLy8gVE9ETyBhZGQgbGFiZWxcblxudmFyIGZpbHRlciA9IHtcbiAgdHlwZTogJ2FycmF5JyxcbiAgaXRlbXM6IHtcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBvcGVyYW5kczoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ2Jvb2xlYW4nLCAnaW50ZWdlcicsICdudW1iZXInXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlcmF0b3I6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGVudW06IFsnPicsICc+PScsICc9JywgJyE9JywgJzwnLCAnPD0nLCAnbm90TnVsbCddXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgZGF0YSA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvLyBkYXRhIHNvdXJjZVxuICAgIGZvcm1hdFR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydqc29uJywgJ2NzdiddLFxuICAgICAgZGVmYXVsdDogJ2pzb24nXG4gICAgfSxcbiAgICB1cmw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2YWx1ZXM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Bhc3MgYXJyYXkgb2Ygb2JqZWN0cyBpbnN0ZWFkIG9mIGEgdXJsIHRvIGEgZmlsZS4nLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgY29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIC8vIHRlbXBsYXRlXG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBncmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICdibGFjaydcbiAgICB9LFxuICAgIGdyaWRPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxLFxuICAgICAgZGVmYXVsdDogMC4wOFxuICAgIH0sXG5cbiAgICAvLyBmaWx0ZXIgbnVsbFxuICAgIGZpbHRlck51bGw6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBPOiB7dHlwZTonYm9vbGVhbicsIGRlZmF1bHQ6IGZhbHNlfSxcbiAgICAgICAgUToge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlfSxcbiAgICAgICAgVDoge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiB0cnVlfVxuICAgICAgfVxuICAgIH0sXG4gICAgdG9nZ2xlU29ydDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnTydcbiAgICB9LFxuXG4gICAgLy8gc2luZ2xlIHBsb3RcbiAgICBzaW5nbGVIZWlnaHQ6IHtcbiAgICAgIC8vIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYnkgYmFuZFdpZHRoICogKGNhcmRpbmFsaXR5ICsgcGFkZGluZylcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDIwMCxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIHNpbmdsZVdpZHRoOiB7XG4gICAgICAvLyB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IGJhbmRXaWR0aCAqIChjYXJkaW5hbGl0eSArIHBhZGRpbmcpXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICAvLyBiYW5kIHNpemVcbiAgICBsYXJnZUJhbmRTaXplOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMSxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIHNtYWxsQmFuZFNpemU6IHtcbiAgICAgIC8vc21hbGwgbXVsdGlwbGVzIG9yIHNpbmdsZSBwbG90IHdpdGggaGlnaCBjYXJkaW5hbGl0eVxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMTIsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBsYXJnZUJhbmRNYXhDYXJkaW5hbGl0eToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMTBcbiAgICB9LFxuICAgIC8vIHNtYWxsIG11bHRpcGxlc1xuICAgIGNlbGxQYWRkaW5nOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDAuMVxuICAgIH0sXG4gICAgY2VsbEdyaWRDb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJ2JsYWNrJ1xuICAgIH0sXG4gICAgY2VsbEdyaWRPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxLFxuICAgICAgZGVmYXVsdDogMC4xNVxuICAgIH0sXG4gICAgY2VsbEJhY2tncm91bmRDb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJ3RyYW5zcGFyZW50J1xuICAgIH0sXG4gICAgdGV4dENlbGxXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogOTAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcblxuICAgIC8vIG1hcmtzXG4gICAgc3Ryb2tlV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDIsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcblxuICAgIC8vIHNjYWxlc1xuICAgIHRpbWVTY2FsZUxhYmVsTGVuZ3RoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAzLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gb3RoZXJcbiAgICBjaGFyYWN0ZXJXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogNlxuICAgIH1cbiAgfVxufTtcblxuLyoqIEB0eXBlIE9iamVjdCBTY2hlbWEgb2YgYSB2ZWdhLWxpdGUgc3BlY2lmaWNhdGlvbiAqL1xuc2NoZW1hLnNjaGVtYSA9IHtcbiAgJHNjaGVtYTogJ2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hIycsXG4gIGRlc2NyaXB0aW9uOiAnU2NoZW1hIGZvciBWZWdhLWxpdGUgc3BlY2lmaWNhdGlvbicsXG4gIHR5cGU6ICdvYmplY3QnLFxuICByZXF1aXJlZDogWydtYXJrdHlwZScsICdlbmMnLCAnZGF0YSddLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZGF0YTogZGF0YSxcbiAgICBtYXJrdHlwZTogc2NoZW1hLm1hcmt0eXBlLFxuICAgIGVuYzoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIHJvdzogcm93LFxuICAgICAgICBjb2w6IGNvbCxcbiAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBhbHBoYTogYWxwaGEsXG4gICAgICAgIHNoYXBlOiBzaGFwZSxcbiAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgZGV0YWlsOiBkZXRhaWxcbiAgICAgIH1cbiAgICB9LFxuICAgIGZpbHRlcjogZmlsdGVyLFxuICAgIGNvbmZpZzogY29uZmlnXG4gIH1cbn07XG5cbnNjaGVtYS5lbmNUeXBlcyA9IHV0aWwua2V5cyhzY2hlbWEuc2NoZW1hLnByb3BlcnRpZXMuZW5jLnByb3BlcnRpZXMpO1xuXG4vKiogSW5zdGFudGlhdGUgYSB2ZXJib3NlIHZsIHNwZWMgZnJvbSB0aGUgc2NoZW1hICovXG5zY2hlbWEuaW5zdGFudGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHNjaGVtYS51dGlsLmluc3RhbnRpYXRlKHNjaGVtYS5zY2hlbWEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNjaGVtYXV0aWwgPSBtb2R1bGUuZXhwb3J0cyA9IHt9LFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG5zY2hlbWF1dGlsLmV4dGVuZCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBzY2hlbWEpIHtcbiAgcmV0dXJuIHNjaGVtYXV0aWwubWVyZ2Uoc2NoZW1hdXRpbC5pbnN0YW50aWF0ZShzY2hlbWEpLCBpbnN0YW5jZSk7XG59O1xuXG4vLyBpbnN0YW50aWF0ZSBhIHNjaGVtYVxuc2NoZW1hdXRpbC5pbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgdmFsO1xuICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKCdkZWZhdWx0JyBpbiBzY2hlbWEpIHtcbiAgICB2YWwgPSBzY2hlbWEuZGVmYXVsdDtcbiAgICByZXR1cm4gdXRpbC5pc09iamVjdCh2YWwpID8gdXRpbC5kdXBsaWNhdGUodmFsKSA6IHZhbDtcbiAgfSBlbHNlIGlmIChzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB7fTtcbiAgICBmb3IgKHZhciBuYW1lIGluIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICB2YWwgPSBzY2hlbWF1dGlsLmluc3RhbnRpYXRlKHNjaGVtYS5wcm9wZXJ0aWVzW25hbWVdKTtcbiAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpbnN0YW5jZVtuYW1lXSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2UgaWYgKHNjaGVtYS50eXBlID09PSAnYXJyYXknKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG4vLyByZW1vdmUgYWxsIGRlZmF1bHRzIGZyb20gYW4gaW5zdGFuY2VcbnNjaGVtYXV0aWwuc3VidHJhY3QgPSBmdW5jdGlvbihpbnN0YW5jZSwgZGVmYXVsdHMpIHtcbiAgdmFyIGNoYW5nZXMgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBpbnN0YW5jZSkge1xuICAgIHZhciBkZWYgPSBkZWZhdWx0c1twcm9wXTtcbiAgICB2YXIgaW5zID0gaW5zdGFuY2VbcHJvcF07XG4gICAgLy8gTm90ZTogZG9lcyBub3QgcHJvcGVybHkgc3VidHJhY3QgYXJyYXlzXG4gICAgaWYgKCFkZWZhdWx0cyB8fCBkZWYgIT09IGlucykge1xuICAgICAgaWYgKHR5cGVvZiBpbnMgPT09ICdvYmplY3QnICYmICF1dGlsLmlzQXJyYXkoaW5zKSAmJiBkZWYpIHtcbiAgICAgICAgdmFyIGMgPSBzY2hlbWF1dGlsLnN1YnRyYWN0KGlucywgZGVmKTtcbiAgICAgICAgaWYgKCFpc0VtcHR5KGMpKVxuICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBjO1xuICAgICAgfSBlbHNlIGlmICghdXRpbC5pc0FycmF5KGlucykgfHwgaW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2hhbmdlc1twcm9wXSA9IGlucztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoYW5nZXM7XG59O1xuXG5zY2hlbWF1dGlsLm1lcmdlID0gZnVuY3Rpb24oLypkZXN0Kiwgc3JjMCwgc3JjMSwgLi4uKi8pe1xuICB2YXIgZGVzdCA9IGFyZ3VtZW50c1swXTtcbiAgZm9yICh2YXIgaT0xIDsgaTxhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBkZXN0ID0gbWVyZ2UoZGVzdCwgYXJndW1lbnRzW2ldKTtcbiAgfVxuICByZXR1cm4gZGVzdDtcbn07XG5cbi8vIHJlY3Vyc2l2ZWx5IG1lcmdlcyBzcmMgaW50byBkZXN0XG5mdW5jdGlvbiBtZXJnZShkZXN0LCBzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgZm9yICh2YXIgcCBpbiBzcmMpIHtcbiAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzcmNbcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc3JjW3BdICE9PSAnb2JqZWN0JyB8fCBzcmNbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBzcmNbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdFtwXSAhPT0gJ29iamVjdCcgfHwgZGVzdFtwXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IG1lcmdlKHNyY1twXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgPyBbXSA6IHt9LCBzcmNbcF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXJnZShkZXN0W3BdLCBzcmNbcF0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzdDtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdkYXRhbGliL3NyYy91dGlsJyk7XG5cbnV0aWwuZXh0ZW5kKHV0aWwsIHJlcXVpcmUoJ2RhdGFsaWIvc3JjL2dlbmVyYXRlJykpO1xudXRpbC5iaW4gPSByZXF1aXJlKCdkYXRhbGliL3NyYy9iaW4nKTtcblxudXRpbC5pc2luID0gZnVuY3Rpb24oaXRlbSwgYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSkgIT09IC0xO1xufTtcblxudXRpbC5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBmLCB0aGlzQXJnKSB7XG4gIGlmIChvYmouZm9yRWFjaCkge1xuICAgIG9iai5mb3JFYWNoLmNhbGwodGhpc0FyZywgZik7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGsgLCBvYmopO1xuICAgIH1cbiAgfVxufTtcblxudXRpbC5yZWR1Y2UgPSBmdW5jdGlvbihvYmosIGYsIGluaXQsIHRoaXNBcmcpIHtcbiAgaWYgKG9iai5yZWR1Y2UpIHtcbiAgICByZXR1cm4gb2JqLnJlZHVjZS5jYWxsKHRoaXNBcmcsIGYsIGluaXQpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpbml0ID0gZi5jYWxsKHRoaXNBcmcsIGluaXQsIG9ialtrXSwgaywgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIGluaXQ7XG4gIH1cbn07XG5cbnV0aWwubWFwID0gZnVuY3Rpb24ob2JqLCBmLCB0aGlzQXJnKSB7XG4gIGlmIChvYmoubWFwKSB7XG4gICAgcmV0dXJuIG9iai5tYXAuY2FsbCh0aGlzQXJnLCBmKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIG91dHB1dC5wdXNoKCBmLmNhbGwodGhpc0FyZywgb2JqW2tdLCBrLCBvYmopKTtcbiAgICB9XG4gIH1cbn07XG5cbnV0aWwuYW55ID0gZnVuY3Rpb24oYXJyLCBmKSB7XG4gIHZhciBpID0gMCwgaztcbiAgZm9yIChrIGluIGFycikge1xuICAgIGlmIChmKGFycltrXSwgaywgaSsrKSkgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxudXRpbC5hbGwgPSBmdW5jdGlvbihhcnIsIGYpIHtcbiAgdmFyIGkgPSAwLCBrO1xuICBmb3IgKGsgaW4gYXJyKSB7XG4gICAgaWYgKCFmKGFycltrXSwgaywgaSsrKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxudXRpbC5nZXRiaW5zID0gZnVuY3Rpb24oc3RhdHMsIG1heGJpbnMpIHtcbiAgcmV0dXJuIHV0aWwuYmluKHtcbiAgICBtaW46IHN0YXRzLm1pbixcbiAgICBtYXg6IHN0YXRzLm1heCxcbiAgICBtYXhiaW5zOiBtYXhiaW5zXG4gIH0pO1xufTtcblxuLyoqXG4gKiB4W3BbMF1dLi4uW3Bbbl1dID0gdmFsXG4gKiBAcGFyYW0gbm9hdWdtZW50IGRldGVybWluZSB3aGV0aGVyIG5ldyBvYmplY3Qgc2hvdWxkIGJlIGFkZGVkIGZcbiAqIG9yIG5vbi1leGlzdGluZyBwcm9wZXJ0aWVzIGFsb25nIHRoZSBwYXRoXG4gKi9cbnV0aWwuc2V0dGVyID0gZnVuY3Rpb24oeCwgcCwgdmFsLCBub2F1Z21lbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPHAubGVuZ3RoLTE7ICsraSkge1xuICAgIGlmICghbm9hdWdtZW50ICYmICEocFtpXSBpbiB4KSl7XG4gICAgICB4ID0geFtwW2ldXSA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0geFtwW2ldXTtcbiAgICB9XG4gIH1cbiAgeFtwW2ldXSA9IHZhbDtcbn07XG5cblxuLyoqXG4gKiByZXR1cm5zIHhbcFswXV0uLi5bcFtuXV1cbiAqIEBwYXJhbSBhdWdtZW50IGRldGVybWluZSB3aGV0aGVyIG5ldyBvYmplY3Qgc2hvdWxkIGJlIGFkZGVkIGZcbiAqIG9yIG5vbi1leGlzdGluZyBwcm9wZXJ0aWVzIGFsb25nIHRoZSBwYXRoXG4gKi9cbnV0aWwuZ2V0dGVyID0gZnVuY3Rpb24oeCwgcCwgbm9hdWdtZW50KSB7XG4gIGZvciAodmFyIGk9MDsgaTxwLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCFub2F1Z21lbnQgJiYgIShwW2ldIGluIHgpKXtcbiAgICAgIHggPSB4W3BbaV1dID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSB4W3BbaV1dO1xuICAgIH1cbiAgfVxuICByZXR1cm4geDtcbn07XG5cbnV0aWwuZXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcbiAgY29uc29sZS5lcnJvcignW1ZMIEVycm9yXScsIG1zZyk7XG59O1xuXG4iXX0=
