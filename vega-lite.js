(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vl = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('d3-time', ['exports'], factory) :
  factory((global.d3_time = {}));
}(this, function (exports) { 'use strict';

  var t0 = new Date;
  var t1 = new Date;
  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.round = function(date) {
      var d0 = new Date(+date),
          d1 = new Date(date - 1);
      floori(d0), floori(d1), offseti(d1, 1);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), date;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [];
      start = new Date(start - 1);
      stop = new Date(+stop);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      offseti(start, 1), floori(start);
      if (start < stop) range.push(new Date(+start));
      while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        while (--step >= 0) while (offseti(date, 1), !test(date));
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0.setTime(+start), t1.setTime(+end);
        floori(t0), floori(t1);
        return Math.floor(count(t0, t1));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  };

  var millisecond = newInterval(function() {
    // noop
  }, function(date, step) {
    date.setTime(+date + step);
  }, function(start, end) {
    return end - start;
  });

  // An optimized implementation for this simple case.
  millisecond.every = function(k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function(date) {
      date.setTime(Math.floor(date / k) * k);
    }, function(date, step) {
      date.setTime(+date + step * k);
    }, function(start, end) {
      return (end - start) / k;
    });
  };

  var second = newInterval(function(date) {
    date.setMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  }, function(date) {
    return date.getSeconds();
  });

  var minute = newInterval(function(date) {
    date.setSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  }, function(date) {
    return date.getMinutes();
  });

  var hour = newInterval(function(date) {
    date.setMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  }, function(date) {
    return date.getHours();
  });

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
  }, function(date) {
    return date.getDate() - 1;
  });

  function weekday(i) {
    return newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var month = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setDate(1);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function(date) {
    return date.getMonth();
  });

  var year = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setMonth(0, 1);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  var utcSecond = newInterval(function(date) {
    date.setUTCMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  }, function(date) {
    return date.getUTCSeconds();
  });

  var utcMinute = newInterval(function(date) {
    date.setUTCSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  }, function(date) {
    return date.getUTCMinutes();
  });

  var utcHour = newInterval(function(date) {
    date.setUTCMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  }, function(date) {
    return date.getUTCHours();
  });

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / 864e5;
  }, function(date) {
    return date.getUTCDate() - 1;
  });

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / 6048e5;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcMonth = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(1);
  }, function(date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
  }, function(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  }, function(date) {
    return date.getUTCMonth();
  });

  var utcYear = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCMonth(0, 1);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  var milliseconds = millisecond.range;
  var seconds = second.range;
  var minutes = minute.range;
  var hours = hour.range;
  var days = day.range;
  var sundays = sunday.range;
  var mondays = monday.range;
  var tuesdays = tuesday.range;
  var wednesdays = wednesday.range;
  var thursdays = thursday.range;
  var fridays = friday.range;
  var saturdays = saturday.range;
  var weeks = sunday.range;
  var months = month.range;
  var years = year.range;

  var utcMillisecond = millisecond;
  var utcMilliseconds = milliseconds;
  var utcSeconds = utcSecond.range;
  var utcMinutes = utcMinute.range;
  var utcHours = utcHour.range;
  var utcDays = utcDay.range;
  var utcSundays = utcSunday.range;
  var utcMondays = utcMonday.range;
  var utcTuesdays = utcTuesday.range;
  var utcWednesdays = utcWednesday.range;
  var utcThursdays = utcThursday.range;
  var utcFridays = utcFriday.range;
  var utcSaturdays = utcSaturday.range;
  var utcWeeks = utcSunday.range;
  var utcMonths = utcMonth.range;
  var utcYears = utcYear.range;

  var version = "0.1.1";

  exports.version = version;
  exports.milliseconds = milliseconds;
  exports.seconds = seconds;
  exports.minutes = minutes;
  exports.hours = hours;
  exports.days = days;
  exports.sundays = sundays;
  exports.mondays = mondays;
  exports.tuesdays = tuesdays;
  exports.wednesdays = wednesdays;
  exports.thursdays = thursdays;
  exports.fridays = fridays;
  exports.saturdays = saturdays;
  exports.weeks = weeks;
  exports.months = months;
  exports.years = years;
  exports.utcMillisecond = utcMillisecond;
  exports.utcMilliseconds = utcMilliseconds;
  exports.utcSeconds = utcSeconds;
  exports.utcMinutes = utcMinutes;
  exports.utcHours = utcHours;
  exports.utcDays = utcDays;
  exports.utcSundays = utcSundays;
  exports.utcMondays = utcMondays;
  exports.utcTuesdays = utcTuesdays;
  exports.utcWednesdays = utcWednesdays;
  exports.utcThursdays = utcThursdays;
  exports.utcFridays = utcFridays;
  exports.utcSaturdays = utcSaturdays;
  exports.utcWeeks = utcWeeks;
  exports.utcMonths = utcMonths;
  exports.utcYears = utcYears;
  exports.millisecond = millisecond;
  exports.second = second;
  exports.minute = minute;
  exports.hour = hour;
  exports.day = day;
  exports.sunday = sunday;
  exports.monday = monday;
  exports.tuesday = tuesday;
  exports.wednesday = wednesday;
  exports.thursday = thursday;
  exports.friday = friday;
  exports.saturday = saturday;
  exports.week = sunday;
  exports.month = month;
  exports.year = year;
  exports.utcSecond = utcSecond;
  exports.utcMinute = utcMinute;
  exports.utcHour = utcHour;
  exports.utcDay = utcDay;
  exports.utcSunday = utcSunday;
  exports.utcMonday = utcMonday;
  exports.utcTuesday = utcTuesday;
  exports.utcWednesday = utcWednesday;
  exports.utcThursday = utcThursday;
  exports.utcFriday = utcFriday;
  exports.utcSaturday = utcSaturday;
  exports.utcWeek = utcSunday;
  exports.utcMonth = utcMonth;
  exports.utcYear = utcYear;
  exports.interval = newInterval;

}));
},{}],2:[function(require,module,exports){
var util = require('../util'),
    time = require('../time'),
    EPSILON = 1e-15;

function bins(opt) {
  if (!opt) { throw Error("Missing binning options."); }

  // determine range
  var maxb = opt.maxbins || 15,
      base = opt.base || 10,
      logb = Math.log(base),
      div = opt.div || [5, 2],
      min = opt.min,
      max = opt.max,
      span = max - min,
      step, level, minstep, precision, v, i, eps;

  if (opt.step) {
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
    while (Math.ceil(span/step) > maxb) { step *= base; }

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
}

function bisect(a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (util.cmp(a[mid], x) < 0) { lo = mid + 1; }
    else { hi = mid; }
  }
  return lo;
}

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

bins.date = function(opt) {
  if (!opt) { throw Error("Missing date binning options."); }

  // find time step, then bin
  var units = opt.utc ? time.utc : time,
      dmin = opt.min,
      dmax = opt.max,
      maxb = opt.maxbins || 20,
      minb = opt.minbins || 4,
      span = (+dmax) - (+dmin),
      unit = opt.unit ? units[opt.unit] : units.find(span, minb, maxb),
      spec = bins({
        min:     unit.min != null ? unit.min : unit.unit(dmin),
        max:     unit.max != null ? unit.max : unit.unit(dmax),
        maxbins: maxb,
        minstep: unit.minstep,
        steps:   unit.step
      });

  spec.unit = unit;
  spec.index = date_index;
  if (!opt.raw) spec.value = date_value;
  return spec;
};

module.exports = bins;

},{"../time":4,"../util":5}],3:[function(require,module,exports){
var util = require('./util'),
    gen = module.exports;

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
    max = min === undefined ? 1 : min;
    min = 0;
  }
  var d = max - min;
  var f = function() {
    return min + d * Math.random();
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  f.pdf = function(x) {
    return (x >= min && x <= max) ? 1/d : 0;
  };
  f.cdf = function(x) {
    return x < min ? 0 : x > max ? 1 : (x - min) / d;
  };
  f.icdf = function(p) {
    return (p >= 0 && p <= 1) ? min + p*d : NaN;
  };
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
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  f.pdf = function(x) {
    return (x === Math.floor(x) && x >= a && x < b) ? 1/d : 0;
  };
  f.cdf = function(x) {
    var v = Math.floor(x);
    return v < a ? 0 : v >= b ? 1 : (v - a + 1) / d;
  };
  f.icdf = function(p) {
    return (p >= 0 && p <= 1) ? a - 1 + Math.floor(p*d) : NaN;
  };
  return f;
};

gen.random.normal = function(mean, stdev) {
  mean = mean || 0;
  stdev = stdev || 1;
  var next;
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
    } while (rds === 0 || rds > 1);
    c = Math.sqrt(-2*Math.log(rds)/rds); // Box-Muller transform
    next = mean + y*c*stdev;
    return mean + x*c*stdev;
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  f.pdf = function(x) {
    var exp = Math.exp(Math.pow(x-mean, 2) / (-2 * Math.pow(stdev, 2)));
    return (1 / (stdev * Math.sqrt(2*Math.PI))) * exp;
  };
  f.cdf = function(x) {
    // Approximation from West (2009)
    // Better Approximations to Cumulative Normal Functions
    var cd,
        z = (x - mean) / stdev,
        Z = Math.abs(z);
    if (Z > 37) {
      cd = 0;
    } else {
      var sum, exp = Math.exp(-Z*Z/2);
      if (Z < 7.07106781186547) {
        sum = 3.52624965998911e-02 * Z + 0.700383064443688;
        sum = sum * Z + 6.37396220353165;
        sum = sum * Z + 33.912866078383;
        sum = sum * Z + 112.079291497871;
        sum = sum * Z + 221.213596169931;
        sum = sum * Z + 220.206867912376;
        cd = exp * sum;
        sum = 8.83883476483184e-02 * Z + 1.75566716318264;
        sum = sum * Z + 16.064177579207;
        sum = sum * Z + 86.7807322029461;
        sum = sum * Z + 296.564248779674;
        sum = sum * Z + 637.333633378831;
        sum = sum * Z + 793.826512519948;
        sum = sum * Z + 440.413735824752;
        cd = cd / sum;
      } else {
        sum = Z + 0.65;
        sum = Z + 4 / sum;
        sum = Z + 3 / sum;
        sum = Z + 2 / sum;
        sum = Z + 1 / sum;
        cd = exp / sum / 2.506628274631;
      }
    }
    return z > 0 ? 1 - cd : cd;
  };
  f.icdf = function(p) {
    // Approximation of Probit function using inverse error function.
    if (p <= 0 || p >= 1) return NaN;
    var x = 2*p - 1,
        v = (8 * (Math.PI - 3)) / (3 * Math.PI * (4-Math.PI)),
        a = (2 / (Math.PI*v)) + (Math.log(1 - Math.pow(x,2)) / 2),
        b = Math.log(1 - (x*x)) / v,
        s = (x > 0 ? 1 : -1) * Math.sqrt(Math.sqrt((a*a) - b) - a);
    return mean + stdev * Math.SQRT2 * s;
  };
  return f;
};

gen.random.bootstrap = function(domain, smooth) {
  // Generates a bootstrap sample from a set of observations.
  // Smooth bootstrapping adds random zero-centered noise to the samples.
  var val = domain.filter(util.isValid),
      len = val.length,
      err = smooth ? gen.random.normal(0, smooth) : null;
  var f = function() {
    return val[~~(Math.random()*len)] + (err ? err() : 0);
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  return f;
};
},{"./util":5}],4:[function(require,module,exports){
var d3_time = require('d3-time');

var tempDate = new Date(),
    baseDate = new Date(0, 0, 1).setFullYear(0), // Jan 1, 0 AD
    utcBaseDate = new Date(Date.UTC(0, 0, 1)).setUTCFullYear(0);

function date(d) {
  return (tempDate.setTime(+d), tempDate);
}

// create a time unit entry
function entry(type, date, unit, step, min, max) {
  var e = {
    type: type,
    date: date,
    unit: unit
  };
  if (step) {
    e.step = step;
  } else {
    e.minstep = 1;
  }
  if (min != null) e.min = min;
  if (max != null) e.max = max;
  return e;
}

function create(type, unit, base, step, min, max) {
  return entry(type,
    function(d) { return unit.offset(base, d); },
    function(d) { return unit.count(base, d); },
    step, min, max);
}

var locale = [
  create('second', d3_time.second, baseDate),
  create('minute', d3_time.minute, baseDate),
  create('hour',   d3_time.hour,   baseDate),
  create('day',    d3_time.day,    baseDate, [1, 7]),
  create('month',  d3_time.month,  baseDate, [1, 3, 6]),
  create('year',   d3_time.year,   baseDate),

  // periodic units
  entry('seconds',
    function(d) { return new Date(1970, 0, 1, 0, 0, d); },
    function(d) { return date(d).getSeconds(); },
    null, 0, 59
  ),
  entry('minutes',
    function(d) { return new Date(1970, 0, 1, 0, d); },
    function(d) { return date(d).getMinutes(); },
    null, 0, 59
  ),
  entry('hours',
    function(d) { return new Date(1970, 0, 1, d); },
    function(d) { return date(d).getHours(); },
    null, 0, 23
  ),
  entry('weekdays',
    function(d) { return new Date(1970, 0, 4+d); },
    function(d) { return date(d).getDay(); },
    [1], 0, 6
  ),
  entry('dates',
    function(d) { return new Date(1970, 0, d); },
    function(d) { return date(d).getDate(); },
    [1], 1, 31
  ),
  entry('months',
    function(d) { return new Date(1970, d % 12, 1); },
    function(d) { return date(d).getMonth(); },
    [1], 0, 11
  )
];

var utc = [
  create('second', d3_time.utcSecond, utcBaseDate),
  create('minute', d3_time.utcMinute, utcBaseDate),
  create('hour',   d3_time.utcHour,   utcBaseDate),
  create('day',    d3_time.utcDay,    utcBaseDate, [1, 7]),
  create('month',  d3_time.utcMonth,  utcBaseDate, [1, 3, 6]),
  create('year',   d3_time.utcYear,   utcBaseDate),

  // periodic units
  entry('seconds',
    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, 0, d)); },
    function(d) { return date(d).getUTCSeconds(); },
    null, 0, 59
  ),
  entry('minutes',
    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, d)); },
    function(d) { return date(d).getUTCMinutes(); },
    null, 0, 59
  ),
  entry('hours',
    function(d) { return new Date(Date.UTC(1970, 0, 1, d)); },
    function(d) { return date(d).getUTCHours(); },
    null, 0, 23
  ),
  entry('weekdays',
    function(d) { return new Date(Date.UTC(1970, 0, 4+d)); },
    function(d) { return date(d).getUTCDay(); },
    [1], 0, 6
  ),
  entry('dates',
    function(d) { return new Date(Date.UTC(1970, 0, d)); },
    function(d) { return date(d).getUTCDate(); },
    [1], 1, 31
  ),
  entry('months',
    function(d) { return new Date(Date.UTC(1970, d % 12, 1)); },
    function(d) { return date(d).getUTCMonth(); },
    [1], 0, 11
  )
];

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

function find(units, span, minb, maxb) {
  var step = STEPS[0], i, n, bins;

  for (i=1, n=STEPS.length; i<n; ++i) {
    step = STEPS[i];
    if (span > step[0]) {
      bins = span / step[0];
      if (bins > maxb) {
        return units[STEPS[i-1][1]];
      }
      if (bins >= minb) {
        return units[step[1]];
      }
    }
  }
  return units[STEPS[n-1][1]];
}

function toUnitMap(units) {
  var map = {}, i, n;
  for (i=0, n=units.length; i<n; ++i) {
    map[units[i].type] = units[i];
  }
  map.find = function(span, minb, maxb) {
    return find(units, span, minb, maxb);
  };
  return map;
}

module.exports = toUnitMap(locale);
module.exports.utc = toUnitMap(utc);
},{"d3-time":1}],5:[function(require,module,exports){
(function (Buffer){
var u = module.exports;

// utility functions

var FNAME = '__name__';

u.namedfunc = function(name, f) { return (f[FNAME] = name, f); };

u.name = function(f) { return f==null ? null : f[FNAME]; };

u.identity = function(x) { return x; };

u.true = u.namedfunc('true', function() { return true; });

u.false = u.namedfunc('false', function() { return false; });

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

u.length = function(x) {
  return x != null && x.length != null ? x.length : null;
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

u.toMap = function(list, f) {
  return (f = u.$(f)) ?
    list.reduce(function(obj, x) { return (obj[f(x)] = 1, obj); }, {}) :
    list.reduce(function(obj, x) { return (obj[x] = 1, obj); }, {});
};

u.keystr = function(values) {
  // use to ensure consistent key generation across modules
  var n = values.length;
  if (!n) return '';
  for (var s=String(values[0]), i=1; i<n; ++i) {
    s += '|' + String(values[i]);
  }
  return s;
};

// type checking functions

var toString = Object.prototype.toString;

u.isObject = function(obj) {
  return obj === Object(obj);
};

u.isFunction = function(obj) {
  return toString.call(obj) === '[object Function]';
};

u.isString = function(obj) {
  return typeof value === 'string' || toString.call(obj) === '[object String]';
};

u.isArray = Array.isArray || function(obj) {
  return toString.call(obj) === '[object Array]';
};

u.isNumber = function(obj) {
  return typeof obj === 'number' || toString.call(obj) === '[object Number]';
};

u.isBoolean = function(obj) {
  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};

u.isDate = function(obj) {
  return toString.call(obj) === '[object Date]';
};

u.isValid = function(obj) {
  return obj != null && obj === obj;
};

u.isBuffer = (typeof Buffer === 'function' && Buffer.isBuffer) || u.false;

// type coercion functions

u.number = function(s) {
  return s == null || s === '' ? null : +s;
};

u.boolean = function(s) {
  return s == null || s === '' ? null : s==='false' ? false : !!s;
};

// parse a date with optional d3.time-format format
u.date = function(s, format) {
  var d = format ? format : Date;
  return s == null || s === '' ? null : d.parse(s);
};

u.array = function(x) {
  return x != null ? (u.isArray(x) ? x : [x]) : [];
};

u.str = function(x) {
  return u.isArray(x) ? '[' + x.map(u.str) + ']'
    : u.isObject(x) ? JSON.stringify(x)
    : u.isString(x) ? ('\''+util_escape_str(x)+'\'') : x;
};

var escape_str_re = /(^|[^\\])'/g;

function util_escape_str(x) {
  return x.replace(escape_str_re, '$1\\\'');
}

// data access functions

var field_re = /\[(.*?)\]|[^.\[]+/g;

u.field = function(f) {
  return String(f).match(field_re).map(function(d) {
    return d[0] !== '[' ? d :
      d[1] !== "'" && d[1] !== '"' ? d.slice(1, -1) :
      d.slice(2, -2).replace(/\\(["'])/g, '$1');
  });
};

u.accessor = function(f) {
  var s;
  return f==null || u.isFunction(f) ? f :
    u.namedfunc(f, (s = u.field(f)).length > 1 ?
      function(x) { return s.reduce(function(x,f) { return x[f]; }, x); } :
      function(x) { return x[f]; }
    );
};

// short-cut for accessor
u.$ = u.accessor;

u.mutator = function(f) {
  var s;
  return u.isString(f) && (s=u.field(f)).length > 1 ?
    function(x, v) {
      for (var i=0; i<s.length-1; ++i) x = x[s[i]];
      x[s[i]] = v;
    } :
    function(x, v) { x[f] = v; };
};


u.$func = function(name, op) {
  return function(f) {
    f = u.$(f) || u.identity;
    var n = name + (u.name(f) ? '_'+u.name(f) : '');
    return u.namedfunc(n, function(d) { return op(f(d)); });
  };
};

u.$valid  = u.$func('valid', u.isValid);
u.$length = u.$func('length', u.length);

u.$in = function(f, values) {
  f = u.$(f);
  var map = u.isArray(values) ? u.toMap(values) : values;
  return function(d) { return !!map[f(d)]; };
};

// comparison / sorting functions

u.comparator = function(sort) {
  var sign = [];
  if (sort === undefined) sort = [];
  sort = u.array(sort).map(function(f) {
    var s = 1;
    if      (f[0] === '-') { s = -1; f = f.slice(1); }
    else if (f[0] === '+') { s = +1; f = f.slice(1); }
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

u.pad = function(s, length, pos, padchar) {
  padchar = padchar || " ";
  var d = length - s.length;
  if (d <= 0) return s;
  switch (pos) {
    case 'left':
      return strrep(d, padchar) + s;
    case 'middle':
    case 'center':
      return strrep(Math.floor(d/2), padchar) +
         s + strrep(Math.ceil(d/2), padchar);
    default:
      return s + strrep(d, padchar);
  }
};

function strrep(n, str) {
  var s = "", i;
  for (i=0; i<n; ++i) s += str;
  return s;
}

u.truncate = function(s, length, pos, word, ellipsis) {
  var len = s.length;
  if (len <= length) return s;
  ellipsis = ellipsis !== undefined ? String(ellipsis) : '\u2026';
  var l = Math.max(0, length - ellipsis.length);

  switch (pos) {
    case 'left':
      return ellipsis + (word ? truncateOnWord(s,l,1) : s.slice(len-l));
    case 'middle':
    case 'center':
      var l1 = Math.ceil(l/2), l2 = Math.floor(l/2);
      return (word ? truncateOnWord(s,l1) : s.slice(0,l1)) +
        ellipsis + (word ? truncateOnWord(s,l2,1) : s.slice(len-l2));
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
  return s.length ? s.join('').trim() : tok[0].slice(0, len);
}

var truncate_word_re = /([\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF])/;

}).call(this,require("buffer").Buffer)

},{"buffer":6}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
exports.AGGREGATE_OPS = [
    'values', 'count', 'valid', 'missing', 'distinct',
    'sum', 'mean', 'average', 'variance', 'variancep', 'stdev',
    'stdevp', 'median', 'q1', 'q3', 'modeskew', 'min', 'max',
    'argmin', 'argmax'
];
exports.SHARED_DOMAIN_OPS = [
    'mean', 'average', 'stdev', 'stdevp', 'median', 'q1', 'q3', 'min', 'max'
];

},{}],8:[function(require,module,exports){
var channel_1 = require('./channel');
function autoMaxBins(channel) {
    switch (channel) {
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.SIZE:
        case channel_1.SHAPE:
            return 6;
        default:
            return 10;
    }
}
exports.autoMaxBins = autoMaxBins;

},{"./channel":9}],9:[function(require,module,exports){
var util_1 = require('./util');
(function (Channel) {
    Channel[Channel["X"] = 'x'] = "X";
    Channel[Channel["Y"] = 'y'] = "Y";
    Channel[Channel["ROW"] = 'row'] = "ROW";
    Channel[Channel["COLUMN"] = 'column'] = "COLUMN";
    Channel[Channel["SHAPE"] = 'shape'] = "SHAPE";
    Channel[Channel["SIZE"] = 'size'] = "SIZE";
    Channel[Channel["COLOR"] = 'color'] = "COLOR";
    Channel[Channel["PATH"] = 'path'] = "PATH";
    Channel[Channel["TEXT"] = 'text'] = "TEXT";
    Channel[Channel["DETAIL"] = 'detail'] = "DETAIL";
    Channel[Channel["LABEL"] = 'label'] = "LABEL";
})(exports.Channel || (exports.Channel = {}));
var Channel = exports.Channel;
exports.X = Channel.X;
exports.Y = Channel.Y;
exports.ROW = Channel.ROW;
exports.COLUMN = Channel.COLUMN;
exports.SHAPE = Channel.SHAPE;
exports.SIZE = Channel.SIZE;
exports.COLOR = Channel.COLOR;
exports.PATH = Channel.PATH;
exports.TEXT = Channel.TEXT;
exports.DETAIL = Channel.DETAIL;
exports.LABEL = Channel.LABEL;
exports.CHANNELS = [exports.X, exports.Y, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.PATH, exports.TEXT, exports.DETAIL, exports.LABEL];
;
function supportMark(channel, mark) {
    return !!getSupportedMark(channel)[mark];
}
exports.supportMark = supportMark;
function getSupportedMark(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.DETAIL:
        case exports.ROW:
        case exports.COLUMN:
            return {
                point: true, tick: true, circle: true, square: true,
                bar: true, line: true, area: true, text: true
            };
        case exports.SIZE:
            return {
                point: true, tick: true, circle: true, square: true,
                bar: true, text: true
            };
        case exports.SHAPE:
            return { point: true };
        case exports.TEXT:
            return { text: true };
        case exports.PATH:
            return { line: true };
    }
    return {};
}
exports.getSupportedMark = getSupportedMark;
;
function getSupportedRole(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.LABEL:
            return {
                measure: true,
                dimension: true
            };
        case exports.ROW:
        case exports.COLUMN:
        case exports.SHAPE:
        case exports.DETAIL:
            return {
                measure: false,
                dimension: true
            };
        case exports.SIZE:
        case exports.TEXT:
            return {
                measure: true,
                dimension: false
            };
        case exports.PATH:
            return {
                measure: false,
                dimension: true
            };
    }
    throw new Error('Invalid encoding channel' + channel);
}
exports.getSupportedRole = getSupportedRole;
function hasScale(channel) {
    return !util_1.contains([exports.DETAIL, exports.PATH, exports.TEXT, exports.LABEL], channel);
}
exports.hasScale = hasScale;

},{"./util":54}],10:[function(require,module,exports){
var axis_schema_1 = require('../schema/axis.schema');
var legend_schema_1 = require('../schema/legend.schema');
var schemautil_1 = require('../schema/schemautil');
var schema = require('../schema/schema');
var schemaUtil = require('../schema/schemautil');
var channel_1 = require('../channel');
var data_1 = require('../data');
var vlFieldDef = require('../fielddef');
var vlEncoding = require('../encoding');
var mark_1 = require('../mark');
var type_1 = require('../type');
var util_1 = require('../util');
var config_1 = require('./config');
var layout_1 = require('./layout');
var stack_1 = require('./stack');
var scale_1 = require('./scale');
var Model = (function () {
    function Model(spec) {
        var defaults = schema.instantiate();
        this._spec = schemaUtil.mergeDeep(defaults, spec);
        vlEncoding.forEach(this._spec.encoding, function (fieldDef, channel) {
            if (!channel_1.supportMark(channel, this._spec.mark)) {
                console.warn(channel, 'dropped as it is incompatible with', this._spec.mark);
                delete this._spec.encoding[channel].field;
            }
            if (fieldDef.type) {
                fieldDef.type = type_1.getFullName(fieldDef.type);
            }
            if (fieldDef.axis === true) {
                fieldDef.axis = schemautil_1.instantiate(axis_schema_1.axis);
            }
            if (fieldDef.legend === true) {
                fieldDef.legend = schemautil_1.instantiate(legend_schema_1.legend);
            }
            if (channel === channel_1.X && fieldDef.scale.bandWidth === undefined) {
                fieldDef.scale.bandWidth = this.isOrdinalScale(channel_1.X) && this.mark() === 'text' ?
                    90 :
                    21;
            }
            if (channel === channel_1.Y && fieldDef.scale.bandWidth === undefined) {
                fieldDef.scale.bandWidth = 21;
            }
            if (channel === channel_1.ROW && fieldDef.scale.padding === undefined) {
                fieldDef.scale.padding = this.has(channel_1.Y) ? 16 : 0;
            }
            if (channel === channel_1.COLUMN && fieldDef.scale.padding === undefined) {
                fieldDef.scale.padding = this.has(channel_1.X) ? 16 : 0;
            }
        }, this);
        this._stack = stack_1.compileStackProperties(this._spec);
        this._spec.config.mark = config_1.compileMarkConfig(this._spec, this._stack);
        this._layout = layout_1.compileLayout(this);
    }
    Model.prototype.layout = function () {
        return this._layout;
    };
    Model.prototype.stack = function () {
        return this._stack;
    };
    Model.prototype.toSpec = function (excludeConfig, excludeData) {
        var encoding = util_1.duplicate(this._spec.encoding), spec;
        spec = {
            mark: this._spec.mark,
            encoding: encoding
        };
        if (!excludeConfig) {
            spec.config = util_1.duplicate(this._spec.config);
        }
        if (!excludeData) {
            spec.data = util_1.duplicate(this._spec.data);
        }
        var defaults = schema.instantiate();
        return schemaUtil.subtract(spec, defaults);
    };
    Model.prototype.mark = function () {
        return this._spec.mark;
    };
    Model.prototype.spec = function () {
        return this._spec;
    };
    Model.prototype.is = function (mark) {
        return this._spec.mark === mark;
    };
    Model.prototype.has = function (channel) {
        return vlEncoding.has(this._spec.encoding, channel);
    };
    Model.prototype.fieldDef = function (channel) {
        return this._spec.encoding[channel];
    };
    Model.prototype.field = function (channel, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel);
        if (fieldDef.bin) {
            opt = util_1.extend({
                binSuffix: scale_1.type(fieldDef, channel, this.mark()) === 'ordinal' ? '_range' : '_start'
            }, opt);
        }
        return vlFieldDef.field(fieldDef, opt);
    };
    Model.prototype.fieldTitle = function (channel) {
        return vlFieldDef.title(this._spec.encoding[channel]);
    };
    Model.prototype.channels = function () {
        return vlEncoding.channels(this._spec.encoding);
    };
    Model.prototype.map = function (f, t) {
        return vlEncoding.map(this._spec.encoding, f, t);
    };
    Model.prototype.reduce = function (f, init, t) {
        return vlEncoding.reduce(this._spec.encoding, f, init, t);
    };
    Model.prototype.forEach = function (f, t) {
        vlEncoding.forEach(this._spec.encoding, f, t);
    };
    Model.prototype.isOrdinalScale = function (channel) {
        var fieldDef = this.fieldDef(channel);
        return fieldDef && (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) ||
            (fieldDef.type === type_1.TEMPORAL && scale_1.type(fieldDef, channel, this.mark()) === 'ordinal'));
    };
    Model.prototype.isDimension = function (channel) {
        return vlFieldDef.isDimension(this.fieldDef(channel));
    };
    Model.prototype.isMeasure = function (channel) {
        return vlFieldDef.isMeasure(this.fieldDef(channel));
    };
    Model.prototype.isAggregate = function () {
        return vlEncoding.isAggregate(this._spec.encoding);
    };
    Model.prototype.isFacet = function () {
        return this.has(channel_1.ROW) || this.has(channel_1.COLUMN);
    };
    Model.prototype.dataTable = function () {
        return this.isAggregate() ? data_1.SUMMARY : data_1.SOURCE;
    };
    Model.prototype.data = function () {
        return this._spec.data;
    };
    Model.prototype.transform = function () {
        return this._spec.transform;
    };
    Model.prototype.hasValues = function () {
        var vals = this.data().values;
        return vals && vals.length;
    };
    Model.prototype.config = function () {
        return this._spec.config;
    };
    Model.prototype.axis = function (channel) {
        var axis = this.fieldDef(channel).axis;
        return typeof axis !== 'boolean' ? axis : {};
    };
    Model.prototype.legend = function (channel) {
        var legend = this.fieldDef(channel).legend;
        return typeof legend !== 'boolean' ? legend : {};
    };
    Model.prototype.scaleName = function (channel) {
        var name = this.spec().name;
        return (name ? name + '-' : '') + channel;
    };
    Model.prototype.sizeValue = function (channel) {
        if (channel === void 0) { channel = channel_1.SIZE; }
        var value = this.fieldDef(channel_1.SIZE).value;
        if (value !== undefined) {
            return value;
        }
        switch (this.mark()) {
            case mark_1.TEXT:
                return this.config().mark.fontSize;
            case mark_1.BAR:
                if (this.config().mark.barWidth) {
                    return this.config().mark.barWidth;
                }
                return !this.has(channel) || this.isOrdinalScale(channel) ?
                    this.fieldDef(channel).scale.bandWidth - 1 :
                    2;
            case mark_1.TICK:
                if (this.config().mark.tickWidth) {
                    return this.config().mark.tickWidth;
                }
                return this.fieldDef(channel).scale.bandWidth / 1.5;
        }
        return this.config().mark.size;
    };
    return Model;
})();
exports.Model = Model;

},{"../channel":9,"../data":29,"../encoding":30,"../fielddef":31,"../mark":32,"../schema/axis.schema":33,"../schema/legend.schema":43,"../schema/schema":46,"../schema/schemautil":47,"../type":53,"../util":54,"./config":13,"./layout":16,"./scale":25,"./stack":26}],11:[function(require,module,exports){
var util_1 = require('../util');
var type_1 = require('../type');
var channel_1 = require('../channel');
var util_2 = require('./util');
function compileAxis(channel, model) {
    var isCol = channel === channel_1.COLUMN, isRow = channel === channel_1.ROW, type = isCol ? 'x' : isRow ? 'y' : channel;
    var def = {
        type: type,
        scale: model.scaleName(channel)
    };
    util_1.extend(def, util_2.formatMixins(model, channel, model.axis(channel).format));
    [
        'grid', 'layer', 'orient', 'tickSize', 'ticks', 'title',
        'offset', 'tickPadding', 'tickSize', 'tickSizeMajor', 'tickSizeMinor', 'tickSizeEnd',
        'titleOffset', 'values', 'subdivide'
    ].forEach(function (property) {
        var method;
        var value = (method = exports[property]) ?
            method(model, channel, def) :
            model.fieldDef(channel).axis[property];
        if (value !== undefined) {
            def[property] = value;
        }
    });
    var props = model.axis(channel).properties || {};
    [
        'axis', 'labels',
        'grid', 'title', 'ticks', 'majorTicks', 'minorTicks'
    ].forEach(function (group) {
        var value = properties[group] ?
            properties[group](model, channel, props[group], def) :
            props[group];
        if (value !== undefined) {
            def.properties = def.properties || {};
            def.properties[group] = value;
        }
    });
    return def;
}
exports.compileAxis = compileAxis;
function grid(model, channel) {
    var fieldDef = model.fieldDef(channel);
    if (channel === channel_1.ROW || channel === channel_1.COLUMN) {
        return undefined;
    }
    var grid = model.axis(channel).grid;
    if (grid !== undefined) {
        return grid;
    }
    return !model.isOrdinalScale(channel) && !fieldDef.bin;
}
exports.grid = grid;
function layer(model, channel, def) {
    var layer = model.axis(channel).layer;
    if (layer !== undefined) {
        return layer;
    }
    if (def.grid) {
        return 'back';
    }
    return undefined;
}
exports.layer = layer;
;
function orient(model, channel) {
    var orient = model.axis(channel).orient;
    if (orient) {
        return orient;
    }
    else if (channel === channel_1.COLUMN) {
        return 'top';
    }
    else if (channel === channel_1.ROW) {
        if (model.has(channel_1.Y) && model.axis(channel_1.Y).orient !== 'right') {
            return 'right';
        }
    }
    return undefined;
}
exports.orient = orient;
function ticks(model, channel) {
    var ticks = model.axis(channel).ticks;
    if (ticks !== undefined) {
        return ticks;
    }
    if (channel === channel_1.X && !model.fieldDef(channel).bin) {
        return 5;
    }
    return undefined;
}
exports.ticks = ticks;
function tickSize(model, channel) {
    var tickSize = model.axis(channel).tickSize;
    if (tickSize !== undefined) {
        return tickSize;
    }
    if (channel === channel_1.ROW || channel === channel_1.COLUMN) {
        return 0;
    }
    return undefined;
}
exports.tickSize = tickSize;
function title(model, channel) {
    var axis = model.axis(channel);
    if (axis.title !== undefined) {
        return axis.title;
    }
    var fieldTitle = model.fieldTitle(channel);
    var layout = model.layout();
    var cellWidth = layout.cellWidth;
    var cellHeight = layout.cellHeight;
    var maxLength;
    if (axis.titleMaxLength) {
        maxLength = axis.titleMaxLength;
    }
    else if (channel === channel_1.X && typeof cellWidth === 'number') {
        maxLength = cellWidth / model.axis(channel_1.X).characterWidth;
    }
    else if (channel === channel_1.Y && typeof cellHeight === 'number') {
        maxLength = cellHeight / model.axis(channel_1.Y).characterWidth;
    }
    return maxLength ? util_1.truncate(fieldTitle, maxLength) : fieldTitle;
}
exports.title = title;
var properties;
(function (properties) {
    function axis(model, channel, axisPropsSpec) {
        if (channel === channel_1.ROW || channel === channel_1.COLUMN) {
            return util_1.extend({
                opacity: { value: 0 }
            }, axisPropsSpec || {});
        }
        return axisPropsSpec || undefined;
    }
    properties.axis = axis;
    function labels(model, channel, labelsSpec, def) {
        var fieldDef = model.fieldDef(channel);
        var axis = model.axis(channel);
        if (!axis.labels) {
            return util_1.extend({
                text: ''
            }, labelsSpec);
        }
        if (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) && axis.labelMaxLength) {
            labelsSpec = util_1.extend({
                text: {
                    template: '{{ datum.data | truncate:' + axis.labelMaxLength + '}}'
                }
            }, labelsSpec || {});
        }
        switch (channel) {
            case channel_1.X:
                if (model.isDimension(channel_1.X) || fieldDef.type === type_1.TEMPORAL) {
                    labelsSpec = util_1.extend({
                        angle: { value: 270 },
                        align: { value: def.orient === 'top' ? 'left' : 'right' },
                        baseline: { value: 'middle' }
                    }, labelsSpec || {});
                }
                break;
            case channel_1.ROW:
                if (def.orient === 'right') {
                    labelsSpec = util_1.extend({
                        angle: { value: 90 },
                        align: { value: 'center' },
                        baseline: { value: 'bottom' }
                    }, labelsSpec || {});
                }
        }
        return labelsSpec || undefined;
    }
    properties.labels = labels;
})(properties = exports.properties || (exports.properties = {}));

},{"../channel":9,"../type":53,"../util":54,"./util":28}],12:[function(require,module,exports){
var Model_1 = require('./Model');
var axis_1 = require('./axis');
var data_1 = require('./data');
var facet_1 = require('./facet');
var legend_1 = require('./legend');
var mark_1 = require('./mark');
var scale_1 = require('./scale');
var util_1 = require('../util');
var data_2 = require('../data');
var channel_1 = require('../channel');
var Model_2 = require('./Model');
exports.Model = Model_2.Model;
function compile(spec) {
    var model = new Model_1.Model(spec);
    var layout = model.layout();
    var FIT = 1;
    var config = model.config();
    var output = util_1.extend(spec.name ? { name: spec.name } : {}, {
        width: typeof layout.width !== 'number' ? FIT : layout.width,
        height: typeof layout.height !== 'number' ? FIT : layout.height,
        padding: 'auto'
    }, config.viewport ? { viewport: config.viewport } : {}, config.background ? { background: config.background } : {}, util_1.keys(config.scene).length > 0 ? scene(config) : {}, {
        data: data_1.compileData(model),
        marks: [compileRootGroup(model)]
    });
    return {
        spec: output
    };
}
exports.compile = compile;
function scene(config) {
    return ['fill', 'fillOpacity', 'stroke', 'strokeWidth',
        'strokeOpacity', 'strokeDash', 'strokeDashOffset'].
        reduce(function (topLevelConfig, property) {
        var value = config.scene[property];
        if (value !== undefined) {
            topLevelConfig.scene = topLevelConfig.scene || {};
            topLevelConfig.scene[property] = { value: value };
        }
        return topLevelConfig;
    }, {});
}
function compileRootGroup(model) {
    var spec = model.spec();
    var width = model.layout().width;
    var height = model.layout().height;
    var rootGroup = util_1.extend({
        name: spec.name ? spec.name + '-root' : 'root',
        type: 'group',
    }, spec.description ? { description: spec.description } : {}, {
        properties: {
            update: {
                width: typeof width !== 'number' ?
                    { field: width.field } :
                    { value: width },
                height: typeof height !== 'number' ?
                    { field: height.field } :
                    { value: height }
            }
        }
    });
    if (typeof width !== 'number' || typeof height !== 'number') {
        rootGroup = util_1.extend(rootGroup, {
            from: { data: data_2.LAYOUT }
        });
    }
    var marks = mark_1.compileMark(model);
    if (model.has(channel_1.ROW) || model.has(channel_1.COLUMN)) {
        util_1.extend(rootGroup, facet_1.facetMixins(model, marks));
    }
    else {
        rootGroup.marks = marks;
        rootGroup.scales = scale_1.compileScales(model.channels(), model);
        var axes = (model.has(channel_1.X) && model.fieldDef(channel_1.X).axis ? [axis_1.compileAxis(channel_1.X, model)] : [])
            .concat(model.has(channel_1.Y) && model.fieldDef(channel_1.Y).axis ? [axis_1.compileAxis(channel_1.Y, model)] : []);
        if (axes.length > 0) {
            rootGroup.axes = axes;
        }
    }
    var legends = legend_1.compileLegends(model);
    if (legends.length > 0) {
        rootGroup.legends = legends;
    }
    return rootGroup;
}
exports.compileRootGroup = compileRootGroup;

},{"../channel":9,"../data":29,"../util":54,"./Model":10,"./axis":11,"./data":14,"./facet":15,"./legend":17,"./mark":24,"./scale":25}],13:[function(require,module,exports){
var channel_1 = require('../channel');
var encoding_1 = require('../encoding');
var fielddef_1 = require('../fielddef');
var mark_1 = require('../mark');
var util_1 = require('../util');
function compileMarkConfig(spec, stack) {
    return util_1.extend(['filled', 'opacity', 'orient', 'align'].reduce(function (cfg, property) {
        var value = spec.config.mark[property];
        switch (property) {
            case 'filled':
                if (value === undefined) {
                    cfg[property] = spec.mark !== mark_1.POINT;
                }
                break;
            case 'opacity':
                if (value === undefined && util_1.contains([mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE], spec.mark)) {
                    if (!encoding_1.isAggregate(spec.encoding) || encoding_1.has(spec.encoding, channel_1.DETAIL)) {
                        cfg[property] = 0.7;
                    }
                }
                break;
            case 'orient':
                if (stack) {
                    cfg[property] = stack.groupbyChannel === channel_1.Y ? 'horizontal' : undefined;
                }
                if (value === undefined) {
                    cfg[property] = fielddef_1.isMeasure(spec.encoding[channel_1.X]) && !fielddef_1.isMeasure(spec.encoding[channel_1.Y]) ?
                        'horizontal' :
                        undefined;
                }
                break;
            case 'align':
                if (value === undefined) {
                    cfg[property] = encoding_1.has(spec.encoding, channel_1.X) ? 'center' : 'right';
                }
        }
        return cfg;
    }, {}), spec.config.mark);
}
exports.compileMarkConfig = compileMarkConfig;

},{"../channel":9,"../encoding":30,"../fielddef":31,"../mark":32,"../util":54}],14:[function(require,module,exports){
var vlFieldDef = require('../fielddef');
var util_1 = require('../util');
var bin_1 = require('../bin');
var channel_1 = require('../channel');
var data_1 = require('../data');
var fielddef_1 = require('../fielddef');
var type_1 = require('../type');
var scale_1 = require('./scale');
var time_1 = require('./time');
var DEFAULT_NULL_FILTERS = {
    nominal: false,
    ordinal: false,
    quantitative: true,
    temporal: true
};
function compileData(model) {
    var def = [source.def(model)];
    var summaryDef = summary.def(model);
    if (summaryDef) {
        def.push(summaryDef);
    }
    filterNonPositiveForLog(def[def.length - 1], model);
    var layoutDef = layout.def(model);
    if (layoutDef) {
        def.push(layoutDef);
    }
    var stackDef = model.stack();
    if (stackDef) {
        def.push(stack.def(model, stackDef));
    }
    return def.concat(dates.defs(model));
}
exports.compileData = compileData;
var source;
(function (source_1) {
    function def(model) {
        var source = { name: data_1.SOURCE };
        if (model.hasValues()) {
            source.values = model.data().values;
            source.format = { type: 'json' };
        }
        else {
            source.url = model.data().url;
            source.format = { type: model.data().formatType };
        }
        var parse = formatParse(model);
        if (parse) {
            source.format.parse = parse;
        }
        source.transform = transform(model);
        return source;
    }
    source_1.def = def;
    function formatParse(model) {
        var calcFieldMap = (model.transform().calculate || []).reduce(function (fieldMap, formula) {
            fieldMap[formula.field] = true;
            return fieldMap;
        }, {});
        var parse;
        model.forEach(function (fieldDef) {
            if (fieldDef.type === type_1.TEMPORAL) {
                parse = parse || {};
                parse[fieldDef.field] = 'date';
            }
            else if (fieldDef.type === type_1.QUANTITATIVE) {
                if (vlFieldDef.isCount(fieldDef) || calcFieldMap[fieldDef.field]) {
                    return;
                }
                parse = parse || {};
                parse[fieldDef.field] = 'number';
            }
        });
        return parse;
    }
    function transform(model) {
        return nullFilterTransform(model).concat(formulaTransform(model), filterTransform(model), binTransform(model), timeTransform(model));
    }
    source_1.transform = transform;
    function timeTransform(model) {
        return model.reduce(function (transform, fieldDef, channel) {
            var ref = fielddef_1.field(fieldDef, { nofn: true, datum: true });
            if (fieldDef.type === type_1.TEMPORAL && fieldDef.timeUnit) {
                transform.push({
                    type: 'formula',
                    field: fielddef_1.field(fieldDef),
                    expr: time_1.parseExpression(fieldDef.timeUnit, ref)
                });
            }
            return transform;
        }, []);
    }
    source_1.timeTransform = timeTransform;
    function binTransform(model) {
        return model.reduce(function (transform, fieldDef, channel) {
            var bin = model.fieldDef(channel).bin;
            if (bin) {
                var binTrans = util_1.extend({
                    type: 'bin',
                    field: fieldDef.field,
                    output: {
                        start: fielddef_1.field(fieldDef, { binSuffix: '_start' }),
                        mid: fielddef_1.field(fieldDef, { binSuffix: '_mid' }),
                        end: fielddef_1.field(fieldDef, { binSuffix: '_end' })
                    }
                }, typeof bin === 'boolean' ? {} : bin);
                if (!binTrans.maxbins && !binTrans.step) {
                    binTrans.maxbins = bin_1.autoMaxBins(channel);
                }
                transform.push(binTrans);
                if (scale_1.type(fieldDef, channel, model.mark()) === 'ordinal') {
                    transform.push({
                        type: 'formula',
                        field: fielddef_1.field(fieldDef, { binSuffix: '_range' }),
                        expr: fielddef_1.field(fieldDef, { datum: true, binSuffix: '_start' }) +
                            '+ \'-\' +' +
                            fielddef_1.field(fieldDef, { datum: true, binSuffix: '_end' })
                    });
                }
            }
            return transform;
        }, []);
    }
    source_1.binTransform = binTransform;
    function nullFilterTransform(model) {
        var filterNull = model.transform().filterNull;
        var filteredFields = util_1.keys(model.reduce(function (aggregator, fieldDef) {
            if (filterNull ||
                (filterNull === undefined && fieldDef.field && fieldDef.field !== '*' && DEFAULT_NULL_FILTERS[fieldDef.type])) {
                aggregator[fieldDef.field] = true;
            }
            return aggregator;
        }, {}));
        return filteredFields.length > 0 ?
            [{
                    type: 'filter',
                    test: filteredFields.map(function (fieldName) {
                        return 'datum.' + fieldName + '!==null';
                    }).join(' && ')
                }] : [];
    }
    source_1.nullFilterTransform = nullFilterTransform;
    function filterTransform(model) {
        var filter = model.transform().filter;
        return filter ? [{
                type: 'filter',
                test: filter
            }] : [];
    }
    source_1.filterTransform = filterTransform;
    function formulaTransform(model) {
        return (model.transform().calculate || []).reduce(function (transform, formula) {
            transform.push(util_1.extend({ type: 'formula' }, formula));
            return transform;
        }, []);
    }
    source_1.formulaTransform = formulaTransform;
})(source = exports.source || (exports.source = {}));
var layout;
(function (layout_1) {
    function def(model) {
        var summarize = [];
        var formulas = [];
        if (model.has(channel_1.X) && model.isOrdinalScale(channel_1.X)) {
            var xScale = model.fieldDef(channel_1.X).scale;
            var xHasDomain = xScale.domain instanceof Array;
            if (!xHasDomain) {
                summarize.push({
                    field: model.field(channel_1.X),
                    ops: ['distinct']
                });
            }
            var xCardinality = xHasDomain ? xScale.domain.length :
                model.field(channel_1.X, { datum: true, prefn: 'distinct_' });
            formulas.push({
                type: 'formula',
                field: 'cellWidth',
                expr: '(' + xCardinality + ' + ' + xScale.padding + ') * ' + xScale.bandWidth
            });
        }
        if (model.has(channel_1.Y) && model.isOrdinalScale(channel_1.Y)) {
            var yScale = model.fieldDef(channel_1.Y).scale;
            var yHasDomain = yScale.domain instanceof Array;
            if (!yHasDomain) {
                summarize.push({
                    field: model.field(channel_1.Y),
                    ops: ['distinct']
                });
            }
            var yCardinality = yHasDomain ? yScale.domain.length :
                model.field(channel_1.Y, { datum: true, prefn: 'distinct_' });
            formulas.push({
                type: 'formula',
                field: 'cellHeight',
                expr: '(' + yCardinality + ' + ' + yScale.padding + ') * ' + yScale.bandWidth
            });
        }
        var layout = model.layout();
        if (model.has(channel_1.COLUMN)) {
            var layoutCellWidth = layout.cellWidth;
            var cellWidth = typeof layoutCellWidth !== 'number' ?
                'datum.' + layoutCellWidth.field :
                layoutCellWidth;
            var colScale = model.fieldDef(channel_1.COLUMN).scale;
            var colHasDomain = colScale.domain instanceof Array;
            if (!colHasDomain) {
                summarize.push({
                    field: model.field(channel_1.COLUMN),
                    ops: ['distinct']
                });
            }
            var colCardinality = colHasDomain ? colScale.domain.length :
                model.field(channel_1.COLUMN, { datum: true, prefn: 'distinct_' });
            formulas.push({
                type: 'formula',
                field: 'width',
                expr: '(' + cellWidth + ' + ' + colScale.padding + ')' + ' * ' + colCardinality
            });
        }
        if (model.has(channel_1.ROW)) {
            var layoutCellHeight = layout.cellHeight;
            var cellHeight = typeof layoutCellHeight !== 'number' ?
                'datum.' + layoutCellHeight.field :
                layoutCellHeight;
            var rowScale = model.fieldDef(channel_1.ROW).scale;
            var rowHasDomain = rowScale.domain instanceof Array;
            if (!rowHasDomain) {
                summarize.push({
                    field: model.field(channel_1.ROW),
                    ops: ['distinct']
                });
            }
            var rowCardinality = rowHasDomain ? rowScale.domain.length :
                model.field(channel_1.ROW, { datum: true, prefn: 'distinct_' });
            formulas.push({
                type: 'formula',
                field: 'height',
                expr: '(' + cellHeight + '+' + rowScale.padding + ')' + ' * ' + rowCardinality
            });
        }
        if (formulas.length > 0) {
            return summarize.length > 0 ? {
                name: data_1.LAYOUT,
                source: model.dataTable(),
                transform: [{
                        type: 'aggregate',
                        summarize: summarize
                    }].concat(formulas)
            } : {
                name: data_1.LAYOUT,
                values: [{}],
                transform: formulas
            };
        }
        return null;
    }
    layout_1.def = def;
})(layout = exports.layout || (exports.layout = {}));
var summary;
(function (summary) {
    function def(model) {
        var dims = {};
        var meas = {};
        var hasAggregate = false;
        model.forEach(function (fieldDef, channel) {
            if (fieldDef.aggregate) {
                hasAggregate = true;
                if (fieldDef.aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*'].count = true;
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = true;
                }
            }
            else {
                if (fieldDef.bin) {
                    dims[fielddef_1.field(fieldDef, { binSuffix: '_start' })] = fielddef_1.field(fieldDef, { binSuffix: '_start' });
                    dims[fielddef_1.field(fieldDef, { binSuffix: '_mid' })] = fielddef_1.field(fieldDef, { binSuffix: '_mid' });
                    dims[fielddef_1.field(fieldDef, { binSuffix: '_end' })] = fielddef_1.field(fieldDef, { binSuffix: '_end' });
                    if (scale_1.type(fieldDef, channel, model.mark()) === 'ordinal') {
                        dims[fielddef_1.field(fieldDef, { binSuffix: '_range' })] = fielddef_1.field(fieldDef, { binSuffix: '_range' });
                    }
                }
                else {
                    dims[fielddef_1.field(fieldDef)] = fielddef_1.field(fieldDef);
                }
            }
        });
        var groupby = util_1.vals(dims);
        var summarize = util_1.reduce(meas, function (aggregator, fnDictSet, field) {
            aggregator[field] = util_1.keys(fnDictSet);
            return aggregator;
        }, {});
        if (hasAggregate) {
            return {
                name: data_1.SUMMARY,
                source: data_1.SOURCE,
                transform: [{
                        type: 'aggregate',
                        groupby: groupby,
                        summarize: summarize
                    }]
            };
        }
        return null;
    }
    summary.def = def;
    ;
})(summary = exports.summary || (exports.summary = {}));
var stack;
(function (stack) {
    function def(model, stackProps) {
        var groupbyChannel = stackProps.groupbyChannel;
        var fieldChannel = stackProps.fieldChannel;
        var facetFields = (model.has(channel_1.COLUMN) ? [model.field(channel_1.COLUMN)] : [])
            .concat((model.has(channel_1.ROW) ? [model.field(channel_1.ROW)] : []));
        var stacked = {
            name: data_1.STACKED_SCALE,
            source: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(groupbyChannel)].concat(facetFields),
                    summarize: [{ ops: ['sum'], field: model.field(fieldChannel) }]
                }]
        };
        return stacked;
    }
    stack.def = def;
    ;
})(stack = exports.stack || (exports.stack = {}));
var dates;
(function (dates) {
    function defs(model) {
        var alreadyAdded = {};
        return model.reduce(function (aggregator, fieldDef, channel) {
            if (fieldDef.timeUnit) {
                var domain = time_1.rawDomain(fieldDef.timeUnit, channel);
                if (domain && !alreadyAdded[fieldDef.timeUnit]) {
                    alreadyAdded[fieldDef.timeUnit] = true;
                    aggregator.push({
                        name: fieldDef.timeUnit,
                        values: domain,
                        transform: [{
                                type: 'formula',
                                field: 'date',
                                expr: time_1.parseExpression(fieldDef.timeUnit, 'datum.data', true)
                            }]
                    });
                }
            }
            return aggregator;
        }, []);
    }
    dates.defs = defs;
})(dates = exports.dates || (exports.dates = {}));
function filterNonPositiveForLog(dataTable, model) {
    model.forEach(function (_, channel) {
        var scale = model.fieldDef(channel).scale;
        if (scale && scale.type === 'log') {
            dataTable.transform.push({
                type: 'filter',
                test: model.field(channel, { datum: true }) + ' > 0'
            });
        }
    });
}
exports.filterNonPositiveForLog = filterNonPositiveForLog;

},{"../bin":8,"../channel":9,"../data":29,"../fielddef":31,"../type":53,"../util":54,"./scale":25,"./time":27}],15:[function(require,module,exports){
var util = require('../util');
var util_1 = require('../util');
var channel_1 = require('../channel');
var axis_1 = require('./axis');
var scale_1 = require('./scale');
function facetMixins(model, marks) {
    var layout = model.layout();
    var cellConfig = model.config().cell;
    var cellWidth = !model.has(channel_1.COLUMN) ?
        { field: { group: 'width' } } :
        typeof layout.cellWidth !== 'number' ?
            { scale: model.scaleName(channel_1.COLUMN), band: true } :
            { value: layout.cellWidth };
    var cellHeight = !model.has(channel_1.ROW) ?
        { field: { group: 'height' } } :
        typeof layout.cellHeight !== 'number' ?
            { scale: model.scaleName(channel_1.ROW), band: true } :
            { value: layout.cellHeight };
    var facetGroupProperties = {
        width: cellWidth,
        height: cellHeight
    };
    ['clip', 'fill', 'fillOpacity', 'stroke', 'strokeWidth',
        'strokeOpacity', 'strokeDash', 'strokeDashOffset']
        .forEach(function (property) {
        var value = cellConfig[property];
        if (value !== undefined) {
            facetGroupProperties[property] = { value: value };
        }
    });
    var rootMarks = [], rootAxes = [], facetKeys = [], cellAxes = [];
    var hasRow = model.has(channel_1.ROW), hasCol = model.has(channel_1.COLUMN);
    if (hasRow) {
        if (!model.isDimension(channel_1.ROW)) {
            util.error('Row encoding should be ordinal.');
        }
        facetGroupProperties.y = {
            scale: model.scaleName(channel_1.ROW),
            field: model.field(channel_1.ROW),
            offset: model.fieldDef(channel_1.ROW).scale.padding / 2
        };
        facetKeys.push(model.field(channel_1.ROW));
        rootAxes.push(axis_1.compileAxis(channel_1.ROW, model));
        if (model.has(channel_1.X)) {
            rootMarks.push(getXAxesGroup(model, cellWidth, hasCol));
        }
        var rowAxis = model.fieldDef(channel_1.ROW).axis;
        if (typeof rowAxis === 'boolean' || rowAxis.grid !== false) {
            rootMarks.push(getRowGridGroup(model, cellHeight));
        }
    }
    else {
        if (model.has(channel_1.X) && model.fieldDef(channel_1.X).axis) {
            cellAxes.push(axis_1.compileAxis(channel_1.X, model));
        }
    }
    if (hasCol) {
        if (!model.isDimension(channel_1.COLUMN)) {
            util.error('Col encoding should be ordinal.');
        }
        facetGroupProperties.x = {
            scale: model.scaleName(channel_1.COLUMN),
            field: model.field(channel_1.COLUMN),
            offset: model.fieldDef(channel_1.COLUMN).scale.padding / 2
        };
        facetKeys.push(model.field(channel_1.COLUMN));
        rootAxes.push(axis_1.compileAxis(channel_1.COLUMN, model));
        if (model.has(channel_1.Y)) {
            rootMarks.push(getYAxesGroup(model, cellHeight, hasRow));
        }
        var colAxis = model.fieldDef(channel_1.COLUMN).axis;
        if (typeof colAxis === 'boolean' || colAxis.grid !== false) {
            rootMarks.push(getColumnGridGroup(model, cellWidth));
        }
    }
    else {
        if (model.has(channel_1.Y) && model.fieldDef(channel_1.Y).axis) {
            cellAxes.push(axis_1.compileAxis(channel_1.Y, model));
        }
    }
    var name = model.spec().name;
    var facetGroup = {
        name: (name ? name + '-' : '') + 'cell',
        type: 'group',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: facetKeys }]
        },
        properties: {
            update: facetGroupProperties
        },
        marks: marks
    };
    if (cellAxes.length > 0) {
        facetGroup.axes = cellAxes;
    }
    rootMarks.push(facetGroup);
    return {
        marks: rootMarks,
        axes: rootAxes,
        scales: scale_1.compileScales(model.channels(), model)
    };
}
exports.facetMixins = facetMixins;
function getXAxesGroup(model, cellWidth, hasCol) {
    var name = model.spec().name;
    return util_1.extend({
        name: (name ? name + '-' : '') + 'x-axes',
        type: 'group'
    }, hasCol ? {
        from: {
            data: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(channel_1.COLUMN)],
                    summarize: { '*': 'count' }
                }]
        }
    } : {}, {
        properties: {
            update: {
                width: cellWidth,
                height: { field: { group: 'height' } },
                x: hasCol ? { scale: model.scaleName(channel_1.COLUMN), field: model.field(channel_1.COLUMN) } : { value: 0 }
            }
        }
    }, model.fieldDef(channel_1.X).axis ? {
        axes: [axis_1.compileAxis(channel_1.X, model)]
    } : {});
}
function getYAxesGroup(model, cellHeight, hasRow) {
    var name = model.spec().name;
    return util_1.extend({
        name: (name ? name + '-' : '') + 'y-axes',
        type: 'group'
    }, hasRow ? {
        from: {
            data: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(channel_1.ROW)],
                    summarize: { '*': 'count' }
                }]
        }
    } : {}, {
        properties: {
            update: {
                width: { field: { group: 'width' } },
                height: cellHeight,
                y: hasRow ? { scale: model.scaleName(channel_1.ROW), field: model.field(channel_1.ROW) } : { value: 0 }
            }
        },
    }, model.fieldDef(channel_1.Y).axis ? {
        axes: [axis_1.compileAxis(channel_1.Y, model)]
    } : {});
}
function getRowGridGroup(model, cellHeight) {
    var name = model.spec().name;
    var cellConfig = model.config().cell;
    var rowGrid = {
        name: (name ? name + '-' : '') + 'row-grid',
        type: 'rule',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: [model.field(channel_1.ROW)] }]
        },
        properties: {
            update: {
                y: {
                    scale: model.scaleName(channel_1.ROW),
                    field: model.field(channel_1.ROW)
                },
                x: { value: 0, offset: -cellConfig.gridOffset },
                x2: { field: { group: 'width' }, offset: cellConfig.gridOffset },
                stroke: { value: cellConfig.gridColor },
                strokeOpacity: { value: cellConfig.gridOpacity }
            }
        }
    };
    var rowGridOnTop = !model.has(channel_1.X) || model.axis(channel_1.X).orient !== 'top';
    if (rowGridOnTop) {
        return rowGrid;
    }
    return {
        name: (name ? name + '-' : '') + 'row-grid-group',
        type: 'group',
        properties: {
            update: {
                y: cellHeight.value ? {
                    value: cellHeight,
                    offset: model.fieldDef(channel_1.ROW).scale.padding
                } : {
                    field: { parent: 'cellHeight' },
                    offset: model.fieldDef(channel_1.ROW).scale.padding
                },
                width: { field: { group: 'width' } }
            }
        },
        marks: [rowGrid]
    };
}
function getColumnGridGroup(model, cellWidth) {
    var name = model.spec().name;
    var cellConfig = model.config().cell;
    var columnGrid = {
        name: (name ? name + '-' : '') + 'column-grid',
        type: 'rule',
        from: {
            data: model.dataTable(),
            transform: [{ type: 'facet', groupby: [model.field(channel_1.COLUMN)] }]
        },
        properties: {
            update: {
                x: {
                    scale: model.scaleName(channel_1.COLUMN),
                    field: model.field(channel_1.COLUMN)
                },
                y: { value: 0, offset: -cellConfig.gridOffset },
                y2: { field: { group: 'height' }, offset: cellConfig.gridOffset },
                stroke: { value: cellConfig.gridColor },
                strokeOpacity: { value: cellConfig.gridOpacity }
            }
        }
    };
    var columnGridOnLeft = !model.has(channel_1.Y) || model.axis(channel_1.Y).orient === 'right';
    if (columnGridOnLeft) {
        return columnGrid;
    }
    return {
        name: (name ? name + '-' : '') + 'column-grid-group',
        type: 'group',
        properties: {
            update: {
                x: cellWidth.value ? {
                    value: cellWidth,
                    offset: model.fieldDef(channel_1.COLUMN).scale.padding
                } : {
                    field: { parent: 'cellWidth' },
                    offset: model.fieldDef(channel_1.COLUMN).scale.padding
                },
                height: { field: { group: 'height' } }
            }
        },
        marks: [columnGrid]
    };
}

},{"../channel":9,"../util":54,"./axis":11,"./scale":25}],16:[function(require,module,exports){
var channel_1 = require('../channel');
var mark_1 = require('../mark');
var data_1 = require('../data');
function compileLayout(model) {
    var cellWidth = getCellWidth(model);
    var cellHeight = getCellHeight(model);
    return {
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        width: getWidth(model, cellWidth),
        height: getHeight(model, cellHeight)
    };
}
exports.compileLayout = compileLayout;
function getCellWidth(model) {
    if (model.has(channel_1.X)) {
        if (model.isOrdinalScale(channel_1.X)) {
            return { data: data_1.LAYOUT, field: 'cellWidth' };
        }
        return model.config().cell.width;
    }
    if (model.mark() === mark_1.TEXT) {
        return 90;
    }
    return 21;
}
function getWidth(model, cellWidth) {
    if (model.has(channel_1.COLUMN)) {
        return { data: data_1.LAYOUT, field: 'width' };
    }
    return cellWidth;
}
function getCellHeight(model) {
    if (model.has(channel_1.Y)) {
        if (model.isOrdinalScale(channel_1.Y)) {
            return { data: data_1.LAYOUT, field: 'cellHeight' };
        }
        else {
            return model.config().cell.height;
        }
    }
    return 21;
}
function getHeight(model, cellHeight) {
    if (model.has(channel_1.ROW)) {
        return { data: data_1.LAYOUT, field: 'height' };
    }
    return cellHeight;
}

},{"../channel":9,"../data":29,"../mark":32}],17:[function(require,module,exports){
var channel_1 = require('../channel');
var fielddef_1 = require('../fielddef');
var mark_1 = require('../mark');
var util_1 = require('../util');
var util_2 = require('./util');
function compileLegends(model) {
    var defs = [];
    if (model.has(channel_1.COLOR) && model.fieldDef(channel_1.COLOR).legend) {
        defs.push(compileLegend(model, channel_1.COLOR, {
            fill: model.scaleName(channel_1.COLOR)
        }));
    }
    if (model.has(channel_1.SIZE) && model.fieldDef(channel_1.SIZE).legend) {
        defs.push(compileLegend(model, channel_1.SIZE, {
            size: model.scaleName(channel_1.SIZE)
        }));
    }
    if (model.has(channel_1.SHAPE) && model.fieldDef(channel_1.SHAPE).legend) {
        defs.push(compileLegend(model, channel_1.SHAPE, {
            shape: model.scaleName(channel_1.SHAPE)
        }));
    }
    return defs;
}
exports.compileLegends = compileLegends;
function compileLegend(model, channel, def) {
    var fieldDef = model.fieldDef(channel);
    var legend = fieldDef.legend;
    def.title = title(fieldDef);
    util_1.extend(def, formatMixins(model, channel));
    ['orient', 'values'].forEach(function (property) {
        var value = legend[property];
        if (value !== undefined) {
            def[property] = value;
        }
    });
    var props = (typeof legend !== 'boolean' && legend.properties) || {};
    ['title', 'symbols', 'legend'].forEach(function (group) {
        var value = properties[group] ?
            properties[group](fieldDef, props[group], model, channel) :
            props[group];
        if (value !== undefined) {
            def.properties = def.properties || {};
            def.properties[group] = value;
        }
    });
    return def;
}
exports.compileLegend = compileLegend;
function title(fieldDef) {
    var legend = fieldDef.legend;
    if (typeof legend !== 'boolean' && legend.title) {
        return legend.title;
    }
    return fielddef_1.title(fieldDef);
}
exports.title = title;
function formatMixins(model, channel) {
    var fieldDef = model.fieldDef(channel);
    if (fieldDef.bin) {
        return {};
    }
    var legend = fieldDef.legend;
    return util_2.formatMixins(model, channel, typeof legend !== 'boolean' ? legend.format : undefined);
}
exports.formatMixins = formatMixins;
var properties;
(function (properties) {
    function symbols(fieldDef, symbolsSpec, model, channel) {
        var symbols = {};
        var mark = model.mark();
        switch (mark) {
            case mark_1.BAR:
            case mark_1.TICK:
            case mark_1.TEXT:
                symbols.shape = { value: 'square' };
                symbols.stroke = { value: 'transparent' };
                util_2.applyMarkConfig(symbols, model, util_2.FILL_STROKE_CONFIG);
                break;
            case mark_1.CIRCLE:
            case mark_1.SQUARE:
                symbols.shape = { value: mark };
            case mark_1.POINT:
                if (model.config().mark.filled) {
                    symbols.stroke = { value: 'transparent' };
                    util_2.applyMarkConfig(symbols, model, util_2.FILL_STROKE_CONFIG);
                    if (model.has(channel_1.COLOR) && channel === channel_1.COLOR) {
                        symbols.fill = { scale: model.scaleName(channel_1.COLOR), field: 'data' };
                    }
                    else if (model.fieldDef(channel_1.COLOR).value) {
                        symbols.fill = { value: model.fieldDef(channel_1.COLOR).value };
                    }
                    else {
                        symbols.fill = { value: model.config().mark.color };
                    }
                }
                else {
                    symbols.fill = { value: 'transparent' };
                    util_2.applyMarkConfig(symbols, model, util_2.FILL_STROKE_CONFIG);
                    if (model.has(channel_1.COLOR) && channel === channel_1.COLOR) {
                        symbols.stroke = { scale: model.scaleName(channel_1.COLOR), field: 'data' };
                    }
                    else if (model.fieldDef(channel_1.COLOR).value) {
                        symbols.stroke = { value: model.fieldDef(channel_1.COLOR).value };
                    }
                    else {
                        symbols.stroke = { value: model.config().mark.color };
                    }
                }
                break;
            case mark_1.LINE:
            case mark_1.AREA:
                symbols.stroke = { value: 'transparent' };
                util_2.applyMarkConfig(symbols, model, util_2.FILL_STROKE_CONFIG);
                break;
        }
        symbols = util_1.extend(symbols, symbolsSpec || {});
        return util_1.keys(symbols).length > 0 ? symbols : undefined;
    }
    properties.symbols = symbols;
})(properties || (properties = {}));

},{"../channel":9,"../fielddef":31,"../mark":32,"../util":54,"./util":28}],18:[function(require,module,exports){
var channel_1 = require('../channel');
var util_1 = require('./util');
var area;
(function (area) {
    function markType() {
        return 'area';
    }
    area.markType = markType;
    function properties(model) {
        var p = {};
        var orient = model.config().mark.orient;
        if (orient !== undefined) {
            p.orient = { value: orient };
        }
        var stack = model.stack();
        if (stack && channel_1.X === stack.fieldChannel) {
            p.x = {
                scale: model.scaleName(channel_1.X),
                field: model.field(channel_1.X, { suffix: '_start' })
            };
        }
        else if (model.isMeasure(channel_1.X)) {
            p.x = { scale: model.scaleName(channel_1.X), field: model.field(channel_1.X) };
        }
        else if (model.isDimension(channel_1.X)) {
            p.x = {
                scale: model.scaleName(channel_1.X),
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        if (orient === 'horizontal') {
            if (stack && channel_1.X === stack.fieldChannel) {
                p.x2 = {
                    scale: model.scaleName(channel_1.X),
                    field: model.field(channel_1.X, { suffix: '_end' })
                };
            }
            else {
                p.x2 = {
                    scale: model.scaleName(channel_1.X),
                    value: 0
                };
            }
        }
        if (stack && channel_1.Y === stack.fieldChannel) {
            p.y = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { suffix: '_start' })
            };
        }
        else if (model.isMeasure(channel_1.Y)) {
            p.y = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y)
            };
        }
        else if (model.isDimension(channel_1.Y)) {
            p.y = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        if (orient !== 'horizontal') {
            if (stack && channel_1.Y === stack.fieldChannel) {
                p.y2 = {
                    scale: model.scaleName(channel_1.Y),
                    field: model.field(channel_1.Y, { suffix: '_end' })
                };
            }
            else {
                p.y2 = {
                    scale: model.scaleName(channel_1.Y),
                    value: 0
                };
            }
        }
        util_1.applyColorAndOpacity(p, model);
        util_1.applyMarkConfig(p, model, ['interpolate', 'tension']);
        return p;
    }
    area.properties = properties;
    function labels(model) {
        return undefined;
    }
    area.labels = labels;
})(area = exports.area || (exports.area = {}));

},{"../channel":9,"./util":28}],19:[function(require,module,exports){
var channel_1 = require('../channel');
var util_1 = require('./util');
var bar;
(function (bar) {
    function markType() {
        return 'rect';
    }
    bar.markType = markType;
    function properties(model) {
        var p = {};
        var orient = model.config().mark.orient;
        var stack = model.stack();
        if (stack && channel_1.X === stack.fieldChannel) {
            p.x = {
                scale: model.scaleName(channel_1.X),
                field: model.field(channel_1.X, { suffix: '_start' })
            };
            p.x2 = {
                scale: model.scaleName(channel_1.X),
                field: model.field(channel_1.X, { suffix: '_end' })
            };
        }
        else if (model.isMeasure(channel_1.X)) {
            if (orient === 'horizontal') {
                p.x = {
                    scale: model.scaleName(channel_1.X),
                    field: model.field(channel_1.X)
                };
                p.x2 = {
                    scale: model.scaleName(channel_1.X),
                    value: 0
                };
            }
            else {
                p.xc = {
                    scale: model.scaleName(channel_1.X),
                    field: model.field(channel_1.X)
                };
                p.width = { value: model.sizeValue(channel_1.X) };
            }
        }
        else if (model.fieldDef(channel_1.X).bin) {
            if (model.has(channel_1.SIZE) && orient !== 'horizontal') {
                p.xc = {
                    scale: model.scaleName(channel_1.X),
                    field: model.field(channel_1.X, { binSuffix: '_mid' })
                };
                p.width = {
                    scale: model.scaleName(channel_1.SIZE),
                    field: model.field(channel_1.SIZE)
                };
            }
            else {
                p.x = {
                    scale: model.scaleName(channel_1.X),
                    field: model.field(channel_1.X, { binSuffix: '_start' }),
                    offset: 1
                };
                p.x2 = {
                    scale: model.scaleName(channel_1.X),
                    field: model.field(channel_1.X, { binSuffix: '_end' })
                };
            }
        }
        else {
            if (model.has(channel_1.X)) {
                p.xc = {
                    scale: model.scaleName(channel_1.X),
                    field: model.field(channel_1.X)
                };
            }
            else {
                p.x = { value: 0, offset: 2 };
            }
            p.width = model.has(channel_1.SIZE) && orient !== 'horizontal' ? {
                scale: model.scaleName(channel_1.SIZE),
                field: model.field(channel_1.SIZE)
            } : {
                value: model.sizeValue(channel_1.X)
            };
        }
        if (stack && channel_1.Y === stack.fieldChannel) {
            p.y = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { suffix: '_start' })
            };
            p.y2 = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { suffix: '_end' })
            };
        }
        else if (model.isMeasure(channel_1.Y)) {
            if (orient !== 'horizontal') {
                p.y = {
                    scale: model.scaleName(channel_1.Y),
                    field: model.field(channel_1.Y)
                };
                p.y2 = {
                    scale: model.scaleName(channel_1.Y),
                    value: 0
                };
            }
            else {
                p.yc = {
                    scale: model.scaleName(channel_1.Y),
                    field: model.field(channel_1.Y)
                };
                p.height = { value: model.sizeValue(channel_1.Y) };
            }
        }
        else if (model.fieldDef(channel_1.Y).bin) {
            if (model.has(channel_1.SIZE) && orient === 'horizontal') {
                p.yc = {
                    scale: model.scaleName(channel_1.Y),
                    field: model.field(channel_1.Y, { binSuffix: '_mid' })
                };
                p.height = {
                    scale: model.scaleName(channel_1.SIZE),
                    field: model.field(channel_1.SIZE)
                };
            }
            else {
                p.y = {
                    scale: model.scaleName(channel_1.Y),
                    field: model.field(channel_1.Y, { binSuffix: '_start' })
                };
                p.y2 = {
                    scale: model.scaleName(channel_1.Y),
                    field: model.field(channel_1.Y, { binSuffix: '_end' }),
                    offset: 1
                };
            }
        }
        else {
            if (model.has(channel_1.Y)) {
                p.yc = {
                    scale: model.scaleName(channel_1.Y),
                    field: model.field(channel_1.Y)
                };
            }
            else {
                p.y2 = {
                    field: { group: 'height' },
                    offset: -1
                };
            }
            p.height = model.has(channel_1.SIZE) && orient === 'horizontal' ? {
                scale: model.scaleName(channel_1.SIZE),
                field: model.field(channel_1.SIZE)
            } : {
                value: model.sizeValue(channel_1.Y)
            };
        }
        util_1.applyColorAndOpacity(p, model);
        return p;
    }
    bar.properties = properties;
    function labels(model) {
        return undefined;
    }
    bar.labels = labels;
})(bar = exports.bar || (exports.bar = {}));

},{"../channel":9,"./util":28}],20:[function(require,module,exports){
var channel_1 = require('../channel');
var util_1 = require('./util');
var line;
(function (line) {
    function markType() {
        return 'line';
    }
    line.markType = markType;
    function properties(model) {
        var p = {};
        if (model.has(channel_1.X)) {
            p.x = {
                scale: model.scaleName(channel_1.X),
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else {
            p.x = { value: 0 };
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else {
            p.y = { field: { group: 'height' } };
        }
        util_1.applyColorAndOpacity(p, model, util_1.ColorMode.ALWAYS_STROKED);
        util_1.applyMarkConfig(p, model, ['interpolate', 'tension']);
        return p;
    }
    line.properties = properties;
    function labels(model) {
        return undefined;
    }
    line.labels = labels;
})(line = exports.line || (exports.line = {}));

},{"../channel":9,"./util":28}],21:[function(require,module,exports){
var channel_1 = require('../channel');
var util_1 = require('./util');
var point;
(function (point) {
    function markType() {
        return 'symbol';
    }
    point.markType = markType;
    function properties(model, fixedShape) {
        var p = {};
        if (model.has(channel_1.X)) {
            p.x = {
                scale: model.scaleName(channel_1.X),
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else {
            p.x = { value: 21 / 2 };
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else {
            p.y = { value: 21 / 2 };
        }
        if (model.has(channel_1.SIZE)) {
            p.size = {
                scale: model.scaleName(channel_1.SIZE),
                field: model.field(channel_1.SIZE)
            };
        }
        else {
            p.size = { value: model.sizeValue() };
        }
        if (fixedShape) {
            p.shape = { value: fixedShape };
        }
        else if (model.has(channel_1.SHAPE)) {
            p.shape = {
                scale: model.scaleName(channel_1.SHAPE),
                field: model.field(channel_1.SHAPE)
            };
        }
        else if (model.fieldDef(channel_1.SHAPE).value) {
            p.shape = { value: model.fieldDef(channel_1.SHAPE).value };
        }
        else {
            p.shape = { value: model.config().mark.shape };
        }
        util_1.applyColorAndOpacity(p, model, fixedShape ? util_1.ColorMode.FILLED_BY_DEFAULT : util_1.ColorMode.STROKED_BY_DEFAULT);
        return p;
    }
    point.properties = properties;
    function labels(model) {
    }
    point.labels = labels;
})(point = exports.point || (exports.point = {}));
var circle;
(function (circle) {
    function markType() {
        return 'symbol';
    }
    circle.markType = markType;
    function properties(model) {
        return point.properties(model, 'circle');
    }
    circle.properties = properties;
    function labels(model) {
        return undefined;
    }
    circle.labels = labels;
})(circle = exports.circle || (exports.circle = {}));
var square;
(function (square) {
    function markType() {
        return 'symbol';
    }
    square.markType = markType;
    function properties(model) {
        return point.properties(model, 'square');
    }
    square.properties = properties;
    function labels(model) {
        return undefined;
    }
    square.labels = labels;
})(square = exports.square || (exports.square = {}));

},{"../channel":9,"./util":28}],22:[function(require,module,exports){
var channel_1 = require('../channel');
var util_1 = require('./util');
var util_2 = require('../util');
var type_1 = require('../type');
var text;
(function (text) {
    function markType() {
        return 'text';
    }
    text.markType = markType;
    function background(model) {
        return {
            x: { value: 0 },
            y: { value: 0 },
            width: { field: { group: 'width' } },
            height: { field: { group: 'height' } },
            fill: { scale: model.scaleName(channel_1.COLOR), field: model.field(channel_1.COLOR) }
        };
    }
    text.background = background;
    function properties(model) {
        var p = {};
        var fieldDef = model.fieldDef(channel_1.TEXT);
        if (model.has(channel_1.X)) {
            p.x = {
                scale: model.scaleName(channel_1.X),
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else {
            if (model.has(channel_1.TEXT) && model.fieldDef(channel_1.TEXT).type === type_1.QUANTITATIVE) {
                p.x = { field: { group: 'width' }, offset: -5 };
            }
            else {
                p.x = { value: 90 / 2 };
            }
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else {
            p.y = { value: 21 / 2 };
        }
        if (model.has(channel_1.SIZE)) {
            p.fontSize = {
                scale: model.scaleName(channel_1.SIZE),
                field: model.field(channel_1.SIZE)
            };
        }
        else {
            p.fontSize = { value: model.sizeValue() };
        }
        if (model.config().mark.applyColorToBackground && !model.has(channel_1.X) && !model.has(channel_1.Y)) {
            p.fill = { value: 'black' };
            var opacity = model.config().mark.opacity;
            if (opacity) {
                p.opacity = { value: opacity };
            }
            ;
        }
        else {
            util_1.applyColorAndOpacity(p, model);
        }
        if (model.has(channel_1.TEXT)) {
            if (util_2.contains([type_1.QUANTITATIVE, type_1.TEMPORAL], model.fieldDef(channel_1.TEXT).type)) {
                var format = model.config().mark.format;
                util_2.extend(p, util_1.formatMixins(model, channel_1.TEXT, format));
            }
            else {
                p.text = { field: model.field(channel_1.TEXT) };
            }
        }
        else {
            p.text = { value: fieldDef.value };
        }
        util_1.applyMarkConfig(p, model, ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
            'fontStyle', 'radius', 'theta']);
        return p;
    }
    text.properties = properties;
})(text = exports.text || (exports.text = {}));

},{"../channel":9,"../type":53,"../util":54,"./util":28}],23:[function(require,module,exports){
var channel_1 = require('../channel');
var util_1 = require('./util');
var tick;
(function (tick) {
    function markType() {
        return 'rect';
    }
    tick.markType = markType;
    function properties(model) {
        var p = {};
        if (model.has(channel_1.X)) {
            p.xc = {
                scale: model.scaleName(channel_1.X),
                field: model.field(channel_1.X, { binSuffix: '_mid' })
            };
        }
        else {
            p.xc = { value: 21 / 2 };
        }
        if (model.has(channel_1.Y)) {
            p.yc = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else {
            p.yc = { value: 21 / 2 };
        }
        if (model.config().mark.orient === 'horizontal') {
            p.width = { value: model.config().mark.thickness };
            p.height = model.has(channel_1.SIZE) ? {
                scale: model.scaleName(channel_1.SIZE),
                field: model.field(channel_1.SIZE)
            } : {
                value: model.sizeValue(channel_1.Y)
            };
        }
        else {
            p.width = model.has(channel_1.SIZE) ? {
                scale: model.scaleName(channel_1.SIZE),
                field: model.field(channel_1.SIZE)
            } : {
                value: model.sizeValue(channel_1.X)
            };
            p.height = { value: model.config().mark.thickness };
        }
        util_1.applyColorAndOpacity(p, model, util_1.ColorMode.ALWAYS_FILLED);
        return p;
    }
    tick.properties = properties;
    function labels(model) {
        return undefined;
    }
    tick.labels = labels;
})(tick = exports.tick || (exports.tick = {}));

},{"../channel":9,"./util":28}],24:[function(require,module,exports){
var channel_1 = require('../channel');
var fielddef_1 = require('../fielddef');
var mark_1 = require('../mark');
var stack_1 = require('./stack');
var util_1 = require('../util');
var mark_area_1 = require('./mark-area');
var mark_bar_1 = require('./mark-bar');
var mark_line_1 = require('./mark-line');
var mark_point_1 = require('./mark-point');
var mark_text_1 = require('./mark-text');
var mark_tick_1 = require('./mark-tick');
var markCompiler = {
    area: mark_area_1.area,
    bar: mark_bar_1.bar,
    line: mark_line_1.line,
    point: mark_point_1.point,
    text: mark_text_1.text,
    tick: mark_tick_1.tick,
    circle: mark_point_1.circle,
    square: mark_point_1.square
};
function compileMark(model) {
    if (util_1.contains([mark_1.LINE, mark_1.AREA], model.mark())) {
        return compilePathMark(model);
    }
    else {
        return compileNonPathMark(model);
    }
}
exports.compileMark = compileMark;
function compilePathMark(model) {
    var mark = model.mark();
    var name = model.spec().name;
    var isFaceted = model.has(channel_1.ROW) || model.has(channel_1.COLUMN);
    var dataFrom = { data: model.dataTable() };
    var details = detailFields(model);
    var pathMarks = [util_1.extend(name ? { name: name + '-marks' } : {}, {
            type: markCompiler[mark].markType(),
            from: util_1.extend(isFaceted || details.length > 0 ? {} : dataFrom, { transform: [{ type: 'sort', by: sortPathBy(model) }] }),
            properties: { update: markCompiler[mark].properties(model) }
        })];
    if (details.length > 0) {
        var facetTransform = { type: 'facet', groupby: details };
        var transform = mark === mark_1.AREA && model.stack() ?
            [stack_1.imputeTransform(model), stack_1.stackTransform(model), facetTransform] :
            [].concat(facetTransform, model.has(channel_1.DETAIL) ? [{ type: 'sort', by: sortBy(model) }] : []);
        return [{
                name: (name ? name + '-' : '') + mark + '-facet',
                type: 'group',
                from: util_1.extend(isFaceted ? {} : dataFrom, { transform: transform }),
                properties: {
                    update: {
                        width: { field: { group: 'width' } },
                        height: { field: { group: 'height' } }
                    }
                },
                marks: pathMarks
            }];
    }
    else {
        return pathMarks;
    }
}
function compileNonPathMark(model) {
    var mark = model.mark();
    var name = model.spec().name;
    var isFaceted = model.has(channel_1.ROW) || model.has(channel_1.COLUMN);
    var dataFrom = { data: model.dataTable() };
    var marks = [];
    if (mark === mark_1.TEXT &&
        model.has(channel_1.COLOR) &&
        model.config().mark.applyColorToBackground && !model.has(channel_1.X) && !model.has(channel_1.Y)) {
        marks.push(util_1.extend(name ? { name: name + '-background' } : {}, { type: 'rect' }, isFaceted ? {} : { from: dataFrom }, { properties: { update: mark_text_1.text.background(model) } }));
    }
    marks.push(util_1.extend(name ? { name: name + '-marks' } : {}, { type: markCompiler[mark].markType() }, (!isFaceted || model.stack() || model.has(channel_1.DETAIL)) ? {
        from: util_1.extend(isFaceted ? {} : dataFrom, model.stack() ?
            { transform: [stack_1.stackTransform(model)] } :
            model.has(channel_1.DETAIL) ?
                { transform: [{ type: 'sort', by: sortBy(model) }] } :
                {})
    } : {}, { properties: { update: markCompiler[mark].properties(model) } }));
    if (model.has(channel_1.LABEL) && markCompiler[mark].labels) {
        var labelProperties = markCompiler[mark].labels(model);
        if (labelProperties !== undefined) {
            marks.push(util_1.extend(name ? { name: name + '-label' } : {}, { type: 'text' }, isFaceted ? {} : { from: dataFrom }, { properties: { update: labelProperties } }));
        }
    }
    return marks;
}
function sortBy(model) {
    if (model.has(channel_1.DETAIL)) {
        var channelEncoding = model.spec().encoding[channel_1.DETAIL];
        return util_1.isArray(channelEncoding) ?
            channelEncoding.map(sortField) :
            sortField(channelEncoding);
    }
    return null;
}
function sortPathBy(model) {
    if (model.mark() === mark_1.LINE && model.has(channel_1.PATH)) {
        var channelEncoding = model.spec().encoding[channel_1.PATH];
        return util_1.isArray(channelEncoding) ?
            channelEncoding.map(sortField) :
            sortField(channelEncoding);
    }
    else {
        return '-' + model.field(model.config().mark.orient === 'horizontal' ? channel_1.Y : channel_1.X);
    }
}
function sortField(fieldDef) {
    return (fieldDef.sort === 'descending' ? '-' : '') + fielddef_1.field(fieldDef);
}
function detailFields(model) {
    return [channel_1.COLOR, channel_1.DETAIL, channel_1.SHAPE].reduce(function (details, channel) {
        if (model.has(channel) && !model.fieldDef(channel).aggregate) {
            details.push(model.field(channel));
        }
        return details;
    }, []);
}

},{"../channel":9,"../fielddef":31,"../mark":32,"../util":54,"./mark-area":18,"./mark-bar":19,"./mark-line":20,"./mark-point":21,"./mark-text":22,"./mark-tick":23,"./stack":26}],25:[function(require,module,exports){
var util_1 = require('../util');
var aggregate_1 = require('../aggregate');
var channel_1 = require('../channel');
var data_1 = require('../data');
var type_1 = require('../type');
var mark_1 = require('../mark');
var time_1 = require('./time');
function compileScales(channels, model) {
    return channels.filter(channel_1.hasScale)
        .map(function (channel) {
        var fieldDef = model.fieldDef(channel);
        var scaleDef = {
            name: model.scaleName(channel),
            type: type(fieldDef, channel, model.mark()),
        };
        scaleDef.domain = domain(model, channel, scaleDef.type);
        util_1.extend(scaleDef, rangeMixins(model, channel, scaleDef.type));
        [
            'reverse', 'round',
            'clamp', 'nice',
            'exponent', 'zero',
            'outerPadding', 'padding', 'points'
        ].forEach(function (property) {
            var value = exports[property](model, channel, scaleDef.type);
            if (value !== undefined) {
                scaleDef[property] = value;
            }
        });
        return scaleDef;
    });
}
exports.compileScales = compileScales;
function type(fieldDef, channel, mark) {
    if (!channel_1.hasScale(channel)) {
        return null;
    }
    if (util_1.contains([channel_1.ROW, channel_1.COLUMN, channel_1.SHAPE], channel)) {
        return 'ordinal';
    }
    if (fieldDef.scale.type !== undefined) {
        return fieldDef.scale.type;
    }
    switch (fieldDef.type) {
        case type_1.NOMINAL:
            return 'ordinal';
        case type_1.ORDINAL:
            return 'ordinal';
        case type_1.TEMPORAL:
            if (channel === channel_1.COLOR) {
                return 'time';
            }
            if (fieldDef.timeUnit) {
                switch (fieldDef.timeUnit) {
                    case 'hours':
                    case 'day':
                    case 'month':
                        return 'ordinal';
                    default:
                        return 'time';
                }
            }
            return 'time';
        case type_1.QUANTITATIVE:
            if (fieldDef.bin) {
                return util_1.contains([channel_1.X, channel_1.Y, channel_1.COLOR], channel) ? 'linear' : 'ordinal';
            }
            return 'linear';
    }
    return null;
}
exports.type = type;
function domain(model, channel, scaleType) {
    var fieldDef = model.fieldDef(channel);
    if (fieldDef.scale.domain) {
        return fieldDef.scale.domain;
    }
    if (fieldDef.type === type_1.TEMPORAL) {
        if (time_1.rawDomain(fieldDef.timeUnit, channel)) {
            return {
                data: fieldDef.timeUnit,
                field: 'date'
            };
        }
        return {
            data: model.dataTable(),
            field: model.field(channel),
            sort: {
                field: model.field(channel),
                op: 'min'
            }
        };
    }
    var stack = model.stack();
    if (stack && channel === stack.fieldChannel) {
        if (stack.config.offset === 'normalize') {
            return [0, 1];
        }
        return {
            data: data_1.STACKED_SCALE,
            field: model.field(channel, { prefn: 'sum_' })
        };
    }
    var useRawDomain = _useRawDomain(model, channel, scaleType);
    var sort = domainSort(model, channel, scaleType);
    if (useRawDomain) {
        return {
            data: data_1.SOURCE,
            field: model.field(channel, { noAggregate: true })
        };
    }
    else if (fieldDef.bin) {
        return scaleType === 'ordinal' ? {
            data: model.dataTable(),
            field: model.field(channel, { binSuffix: '_range' }),
            sort: {
                field: model.field(channel, { binSuffix: '_start' }),
                op: 'min'
            }
        } : channel === channel_1.COLOR ? {
            data: model.dataTable(),
            field: model.field(channel, { binSuffix: '_start' })
        } : {
            data: model.dataTable(),
            field: [
                model.field(channel, { binSuffix: '_start' }),
                model.field(channel, { binSuffix: '_end' })
            ]
        };
    }
    else if (sort) {
        return {
            data: sort.op ? data_1.SOURCE : model.dataTable(),
            field: model.field(channel),
            sort: sort
        };
    }
    else {
        return {
            data: model.dataTable(),
            field: model.field(channel)
        };
    }
}
exports.domain = domain;
function domainSort(model, channel, scaleType) {
    var sort = model.fieldDef(channel).sort;
    if (sort === 'ascending' || sort === 'descending') {
        return true;
    }
    if (scaleType === 'ordinal' && typeof sort !== 'string') {
        return {
            op: sort.op,
            field: sort.field
        };
    }
    return undefined;
}
exports.domainSort = domainSort;
function reverse(model, channel) {
    var sort = model.fieldDef(channel).sort;
    return sort && (typeof sort === 'string' ?
        sort === 'descending' :
        sort.order === 'descending') ? true : undefined;
}
exports.reverse = reverse;
function _useRawDomain(model, channel, scaleType) {
    var fieldDef = model.fieldDef(channel);
    return fieldDef.scale.useRawDomain &&
        fieldDef.aggregate &&
        aggregate_1.SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate) >= 0 &&
        ((fieldDef.type === type_1.QUANTITATIVE && !fieldDef.bin) ||
            (fieldDef.type === type_1.TEMPORAL && scaleType === 'linear'));
}
function bandWidth(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        return model.fieldDef(channel).scale.bandWidth;
    }
    return undefined;
}
exports.bandWidth = bandWidth;
function clamp(model, channel) {
    return model.fieldDef(channel).scale.clamp;
}
exports.clamp = clamp;
function exponent(model, channel) {
    return model.fieldDef(channel).scale.exponent;
}
exports.exponent = exponent;
function nice(model, channel, scaleType) {
    if (model.fieldDef(channel).scale.nice !== undefined) {
        return model.fieldDef(channel).scale.nice;
    }
    switch (channel) {
        case channel_1.X:
        case channel_1.Y:
            if (scaleType === 'time' || scaleType === 'ordinal') {
                return undefined;
            }
            return true;
        case channel_1.ROW:
        case channel_1.COLUMN:
            return true;
    }
    return undefined;
}
exports.nice = nice;
function outerPadding(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        if (model.fieldDef(channel).scale.outerPadding !== undefined) {
            return model.fieldDef(channel).scale.outerPadding;
        }
    }
    return undefined;
}
exports.outerPadding = outerPadding;
function padding(model, channel, scaleType) {
    if (scaleType === 'ordinal' && channel !== channel_1.ROW && channel !== channel_1.COLUMN) {
        return model.fieldDef(channel).scale.padding;
    }
    return undefined;
}
exports.padding = padding;
function points(model, channel, scaleType) {
    if (scaleType === 'ordinal') {
        switch (channel) {
            case channel_1.X:
            case channel_1.Y:
                return true;
        }
    }
    return undefined;
}
exports.points = points;
function rangeMixins(model, channel, scaleType) {
    var fieldDef = model.fieldDef(channel);
    if (scaleType === 'ordinal' && fieldDef.scale.bandWidth) {
        return { bandWidth: fieldDef.scale.bandWidth };
    }
    if (fieldDef.scale.range) {
        return { range: fieldDef.scale.range };
    }
    switch (channel) {
        case channel_1.X:
            return { rangeMin: 0, rangeMax: model.layout().cellWidth };
        case channel_1.Y:
            if (scaleType === 'ordinal') {
                return { rangeMin: 0, rangeMax: model.layout().cellHeight };
            }
            return { rangeMin: model.layout().cellHeight, rangeMax: 0 };
        case channel_1.SIZE:
            if (model.is(mark_1.BAR)) {
                var dimension = model.config().mark.orient === 'horizontal' ? channel_1.Y : channel_1.X;
                return { range: [2, model.fieldDef(dimension).scale.bandWidth] };
            }
            else if (model.is(mark_1.TEXT)) {
                return { range: [8, 40] };
            }
            var xIsMeasure = model.isMeasure(channel_1.X);
            var yIsMeasure = model.isMeasure(channel_1.Y);
            var bandWidth_1 = xIsMeasure !== yIsMeasure ?
                model.fieldDef(xIsMeasure ? channel_1.Y : channel_1.X).scale.bandWidth :
                Math.min(model.fieldDef(channel_1.X).scale.bandWidth || 21, model.fieldDef(channel_1.Y).scale.bandWidth || 21);
            return { range: [10, (bandWidth_1 - 2) * (bandWidth_1 - 2)] };
        case channel_1.SHAPE:
            return { range: 'shapes' };
        case channel_1.COLOR:
            if (fieldDef.type === type_1.NOMINAL
                || fieldDef.type === type_1.ORDINAL) {
                return { range: 'category10' };
            }
            return { range: ['#AFC6A3', '#09622A'] };
        case channel_1.ROW:
            return { range: 'height' };
        case channel_1.COLUMN:
            return { range: 'width' };
    }
    return {};
}
exports.rangeMixins = rangeMixins;
function round(model, channel) {
    if (model.fieldDef(channel).scale.round !== undefined) {
        return model.fieldDef(channel).scale.round;
    }
    switch (channel) {
        case channel_1.X:
        case channel_1.Y:
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.SIZE:
            return true;
    }
    return undefined;
}
exports.round = round;
function zero(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var timeUnit = fieldDef.timeUnit;
    if (fieldDef.scale.zero !== undefined) {
        return fieldDef.scale.zero;
    }
    if (fieldDef.type === type_1.TEMPORAL) {
        if (timeUnit === 'year') {
            return false;
        }
        return undefined;
    }
    if (fieldDef.bin) {
        return false;
    }
    return channel === channel_1.X || channel === channel_1.Y ?
        undefined :
        false;
}
exports.zero = zero;

},{"../aggregate":7,"../channel":9,"../data":29,"../mark":32,"../type":53,"../util":54,"./time":27}],26:[function(require,module,exports){
var config_stack_schema_1 = require('../schema/config.stack.schema');
var schemautil_1 = require('../schema/schemautil');
var channel_1 = require('../channel');
var mark_1 = require('../mark');
var fielddef_1 = require('../fielddef');
var encoding_1 = require('../encoding');
var util_1 = require('../util');
var scale_1 = require('./scale');
function compileStackProperties(spec) {
    var stackFields = getStackFields(spec);
    if (stackFields.length > 0 &&
        util_1.contains([mark_1.BAR, mark_1.AREA], spec.mark) &&
        spec.config.stack !== false &&
        encoding_1.isAggregate(spec.encoding)) {
        var isXMeasure = encoding_1.has(spec.encoding, channel_1.X) && fielddef_1.isMeasure(spec.encoding.x);
        var isYMeasure = encoding_1.has(spec.encoding, channel_1.Y) && fielddef_1.isMeasure(spec.encoding.y);
        if (isXMeasure && !isYMeasure) {
            return {
                groupbyChannel: channel_1.Y,
                fieldChannel: channel_1.X,
                stackFields: stackFields,
                config: spec.config.stack === true ? schemautil_1.instantiate(config_stack_schema_1.stackConfig) : spec.config.stack
            };
        }
        else if (isYMeasure && !isXMeasure) {
            return {
                groupbyChannel: channel_1.X,
                fieldChannel: channel_1.Y,
                stackFields: stackFields,
                config: spec.config.stack === true ? schemautil_1.instantiate(config_stack_schema_1.stackConfig) : spec.config.stack
            };
        }
    }
    return null;
}
exports.compileStackProperties = compileStackProperties;
function getStackFields(spec) {
    return [channel_1.COLOR, channel_1.DETAIL].reduce(function (fields, channel) {
        var channelEncoding = spec.encoding[channel];
        if (encoding_1.has(spec.encoding, channel)) {
            if (util_1.isArray(channelEncoding)) {
                channelEncoding.forEach(function (fieldDef) {
                    fields.push(fielddef_1.field(fieldDef));
                });
            }
            else {
                var fieldDef = channelEncoding;
                fields.push(fielddef_1.field(fieldDef, {
                    binSuffix: scale_1.type(fieldDef, channel, spec.mark) === 'ordinal' ? '_range' : '_start'
                }));
            }
        }
        return fields;
    }, []);
}
function imputeTransform(model) {
    var stack = model.stack();
    return {
        type: 'impute',
        field: model.field(stack.fieldChannel),
        groupby: stack.stackFields,
        orderby: [model.field(stack.groupbyChannel)],
        method: 'value',
        value: 0
    };
}
exports.imputeTransform = imputeTransform;
function stackTransform(model) {
    var stack = model.stack();
    var sortby = stack.config.sort === 'ascending' ?
        stack.stackFields :
        util_1.isArray(stack.config.sort) ?
            stack.config.sort :
            stack.stackFields.map(function (field) {
                return '-' + field;
            });
    var valName = model.field(stack.fieldChannel);
    var transform = {
        type: 'stack',
        groupby: [model.field(stack.groupbyChannel)],
        field: model.field(stack.fieldChannel),
        sortby: sortby,
        output: {
            start: valName + '_start',
            end: valName + '_end'
        }
    };
    if (stack.config.offset) {
        transform.offset = stack.config.offset;
    }
    return transform;
}
exports.stackTransform = stackTransform;

},{"../channel":9,"../encoding":30,"../fielddef":31,"../mark":32,"../schema/config.stack.schema":39,"../schema/schemautil":47,"../util":54,"./scale":25}],27:[function(require,module,exports){
var util_1 = require('../util');
var channel_1 = require('../channel');
function format(timeUnit, abbreviated) {
    if (abbreviated === void 0) { abbreviated = false; }
    if (!timeUnit) {
        return undefined;
    }
    var dateComponents = [];
    if (timeUnit.indexOf('year') > -1) {
        dateComponents.push(abbreviated ? '%y' : '%Y');
    }
    if (timeUnit.indexOf('month') > -1) {
        dateComponents.push(abbreviated ? '%b' : '%B');
    }
    if (timeUnit.indexOf('day') > -1) {
        dateComponents.push(abbreviated ? '%a' : '%A');
    }
    else if (timeUnit.indexOf('date') > -1) {
        dateComponents.push('%d');
    }
    var timeComponents = [];
    if (timeUnit.indexOf('hour') > -1) {
        timeComponents.push('%H');
    }
    if (timeUnit.indexOf('minute') > -1) {
        timeComponents.push('%M');
    }
    if (timeUnit.indexOf('second') > -1) {
        timeComponents.push('%S');
    }
    if (timeUnit.indexOf('milliseconds') > -1) {
        timeComponents.push('%L');
    }
    var out = [];
    if (dateComponents.length > 0) {
        out.push(dateComponents.join('-'));
    }
    if (timeComponents.length > 0) {
        out.push(timeComponents.join(':'));
    }
    return out.length > 0 ? out.join(' ') : undefined;
}
exports.format = format;
function parseExpression(timeUnit, fieldRef, onlyRef) {
    if (onlyRef === void 0) { onlyRef = false; }
    var out = 'datetime(';
    function get(fun, addComma) {
        if (addComma === void 0) { addComma = true; }
        if (onlyRef) {
            return fieldRef + (addComma ? ', ' : '');
        }
        else {
            return fun + '(' + fieldRef + ')' + (addComma ? ', ' : '');
        }
    }
    if (timeUnit.indexOf('year') > -1) {
        out += get('year');
    }
    else {
        out += '2006, ';
    }
    if (timeUnit.indexOf('month') > -1) {
        out += get('month');
    }
    else {
        out += '0, ';
    }
    if (timeUnit.indexOf('day') > -1) {
        out += get('day', false) + '+1, ';
    }
    else if (timeUnit.indexOf('date') > -1) {
        out += get('date');
    }
    else {
        out += '1, ';
    }
    if (timeUnit.indexOf('hours') > -1) {
        out += get('hours');
    }
    else {
        out += '0, ';
    }
    if (timeUnit.indexOf('minutes') > -1) {
        out += get('minutes');
    }
    else {
        out += '0, ';
    }
    if (timeUnit.indexOf('seconds') > -1) {
        out += get('seconds');
    }
    else {
        out += '0, ';
    }
    if (timeUnit.indexOf('milliseconds') > -1) {
        out += get('milliseconds', false);
    }
    else {
        out += '0';
    }
    return out + ')';
}
exports.parseExpression = parseExpression;
function rawDomain(timeUnit, channel) {
    if (util_1.contains([channel_1.ROW, channel_1.COLUMN, channel_1.SHAPE, channel_1.COLOR], channel)) {
        return null;
    }
    switch (timeUnit) {
        case 'seconds':
            return util_1.range(0, 60);
        case 'minutes':
            return util_1.range(0, 60);
        case 'hours':
            return util_1.range(0, 24);
        case 'day':
            return util_1.range(0, 7);
        case 'date':
            return util_1.range(1, 32);
        case 'month':
            return util_1.range(0, 12);
    }
    return null;
}
exports.rawDomain = rawDomain;

},{"../channel":9,"../util":54}],28:[function(require,module,exports){
var channel_1 = require('../channel');
var type_1 = require('../type');
var time_1 = require('./time');
var util_1 = require('../util');
(function (ColorMode) {
    ColorMode[ColorMode["ALWAYS_FILLED"] = 0] = "ALWAYS_FILLED";
    ColorMode[ColorMode["ALWAYS_STROKED"] = 1] = "ALWAYS_STROKED";
    ColorMode[ColorMode["FILLED_BY_DEFAULT"] = 2] = "FILLED_BY_DEFAULT";
    ColorMode[ColorMode["STROKED_BY_DEFAULT"] = 3] = "STROKED_BY_DEFAULT";
})(exports.ColorMode || (exports.ColorMode = {}));
var ColorMode = exports.ColorMode;
exports.FILL_STROKE_CONFIG = ['fill', 'fillOpacity',
    'stroke', 'strokeWidth', 'strokeDash', 'strokeDashOffset', 'strokeOpacity',
    'opacity'];
function applyColorAndOpacity(p, model, colorMode) {
    if (colorMode === void 0) { colorMode = ColorMode.STROKED_BY_DEFAULT; }
    var filled = colorMode === ColorMode.ALWAYS_FILLED ? true :
        colorMode === ColorMode.ALWAYS_STROKED ? false :
            model.config().mark.filled !== undefined ? model.config().mark.filled :
                colorMode === ColorMode.FILLED_BY_DEFAULT ? true :
                    false;
    if (filled) {
        if (model.has(channel_1.COLOR)) {
            p.fill = {
                scale: model.scaleName(channel_1.COLOR),
                field: model.field(channel_1.COLOR)
            };
        }
        else if (model.fieldDef(channel_1.COLOR).value) {
            p.fill = { value: model.fieldDef(channel_1.COLOR).value };
        }
        else {
            p.fill = { value: model.config().mark.color };
        }
    }
    else {
        if (model.has(channel_1.COLOR)) {
            p.stroke = {
                scale: model.scaleName(channel_1.COLOR),
                field: model.field(channel_1.COLOR)
            };
        }
        else if (model.fieldDef(channel_1.COLOR).value) {
            p.stroke = { value: model.fieldDef(channel_1.COLOR).value };
        }
        else {
            p.stroke = { value: model.config().mark.color };
        }
    }
    applyMarkConfig(p, model, exports.FILL_STROKE_CONFIG);
}
exports.applyColorAndOpacity = applyColorAndOpacity;
function applyMarkConfig(marksProperties, model, propsList) {
    propsList.forEach(function (property) {
        var value = model.config().mark[property];
        if (value !== undefined) {
            marksProperties[property] = { value: value };
        }
    });
}
exports.applyMarkConfig = applyMarkConfig;
function formatMixins(model, channel, format) {
    var fieldDef = model.fieldDef(channel);
    if (!util_1.contains([type_1.QUANTITATIVE, type_1.TEMPORAL], fieldDef.type)) {
        return {};
    }
    var def = {};
    if (fieldDef.type === type_1.TEMPORAL) {
        def.formatType = 'time';
    }
    if (format !== undefined) {
        def.format = format;
    }
    else {
        switch (fieldDef.type) {
            case type_1.QUANTITATIVE:
                def.format = model.config().numberFormat;
                break;
            case type_1.TEMPORAL:
                def.format = timeFormat(model, channel) || model.config().timeFormat;
                break;
        }
    }
    if (channel === channel_1.TEXT) {
        var filter = (def.formatType || 'number') + (def.format ? ':\'' + def.format + '\'' : '');
        return {
            text: {
                template: '{{' + model.field(channel, { datum: true }) + ' | ' + filter + '}}'
            }
        };
    }
    return def;
}
exports.formatMixins = formatMixins;
function isAbbreviated(model, channel, fieldDef) {
    switch (channel) {
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.X:
        case channel_1.Y:
            return model.axis(channel).shortTimeLabels;
        case channel_1.COLOR:
        case channel_1.SHAPE:
        case channel_1.SIZE:
            return model.legend(channel).shortTimeLabels;
        case channel_1.TEXT:
            return model.config().mark.shortTimeLabels;
        case channel_1.LABEL:
    }
    return false;
}
function timeFormat(model, channel) {
    var fieldDef = model.fieldDef(channel);
    return time_1.format(fieldDef.timeUnit, isAbbreviated(model, channel, fieldDef));
}
exports.timeFormat = timeFormat;

},{"../channel":9,"../type":53,"../util":54,"./time":27}],29:[function(require,module,exports){
var type_1 = require('./type');
exports.SUMMARY = 'summary';
exports.SOURCE = 'source';
exports.STACKED_SCALE = 'stacked_scale';
exports.LAYOUT = 'layout';
exports.types = {
    'boolean': type_1.NOMINAL,
    'number': type_1.QUANTITATIVE,
    'integer': type_1.QUANTITATIVE,
    'date': type_1.TEMPORAL,
    'string': type_1.NOMINAL
};

},{"./type":53}],30:[function(require,module,exports){
var channel_1 = require('./channel');
var util_1 = require('./util');
function countRetinal(encoding) {
    var count = 0;
    if (encoding.color) {
        count++;
    }
    if (encoding.size) {
        count++;
    }
    if (encoding.shape) {
        count++;
    }
    return count;
}
exports.countRetinal = countRetinal;
function channels(encoding) {
    return channel_1.CHANNELS.filter(function (channel) {
        return has(encoding, channel);
    });
}
exports.channels = channels;
function has(encoding, channel) {
    var channelEncoding = encoding && encoding[channel];
    return channelEncoding && (channelEncoding.field !== undefined ||
        (util_1.isArray(channelEncoding) && channelEncoding.length > 0));
}
exports.has = has;
function isAggregate(encoding) {
    return util_1.any(channel_1.CHANNELS, function (channel) {
        if (has(encoding, channel) && encoding[channel].aggregate) {
            return true;
        }
        return false;
    });
}
exports.isAggregate = isAggregate;
function fieldDefs(encoding) {
    var arr = [];
    channel_1.CHANNELS.forEach(function (channel) {
        if (has(encoding, channel)) {
            if (util_1.isArray(encoding[channel])) {
                encoding[channel].forEach(function (fieldDef) {
                    arr.push(fieldDef);
                });
            }
            else {
                arr.push(encoding[channel]);
            }
        }
    });
    return arr;
}
exports.fieldDefs = fieldDefs;
;
function forEach(encoding, f, thisArg) {
    var i = 0;
    channel_1.CHANNELS.forEach(function (channel) {
        if (has(encoding, channel)) {
            if (util_1.isArray(encoding[channel])) {
                encoding[channel].forEach(function (fieldDef) {
                    f.call(thisArg, fieldDef, channel, i++);
                });
            }
            else {
                f.call(thisArg, encoding[channel], channel, i++);
            }
        }
    });
}
exports.forEach = forEach;
function map(encoding, f, thisArg) {
    var arr = [];
    channel_1.CHANNELS.forEach(function (channel) {
        if (has(encoding, channel)) {
            if (util_1.isArray(encoding[channel])) {
                encoding[channel].forEach(function (fieldDef) {
                    arr.push(f.call(thisArg, fieldDef, channel, encoding));
                });
            }
            else {
                arr.push(f.call(thisArg, encoding[channel], channel, encoding));
            }
        }
    });
    return arr;
}
exports.map = map;
function reduce(encoding, f, init, thisArg) {
    var r = init;
    channel_1.CHANNELS.forEach(function (channel) {
        if (has(encoding, channel)) {
            if (util_1.isArray(encoding[channel])) {
                encoding[channel].forEach(function (fieldDef) {
                    r = f.call(thisArg, r, fieldDef, channel, encoding);
                });
            }
            else {
                r = f.call(thisArg, r, encoding[channel], channel, encoding);
            }
        }
    });
    return r;
}
exports.reduce = reduce;

},{"./channel":9,"./util":54}],31:[function(require,module,exports){
var util_1 = require('./util');
var type_1 = require('./type');
function field(fieldDef, opt) {
    if (opt === void 0) { opt = {}; }
    var prefix = (opt.datum ? 'datum.' : '') + (opt.prefn || '');
    var suffix = opt.suffix || '';
    var field = fieldDef.field;
    if (isCount(fieldDef)) {
        return prefix + 'count' + suffix;
    }
    else if (opt.fn) {
        return prefix + opt.fn + '_' + field + suffix;
    }
    else if (!opt.nofn && fieldDef.bin) {
        return prefix + 'bin_' + field + (opt.binSuffix || suffix || '_start');
    }
    else if (!opt.nofn && !opt.noAggregate && fieldDef.aggregate) {
        return prefix + fieldDef.aggregate + '_' + field + suffix;
    }
    else if (!opt.nofn && fieldDef.timeUnit) {
        return prefix + fieldDef.timeUnit + '_' + field + suffix;
    }
    else {
        return prefix + field;
    }
}
exports.field = field;
function _isFieldDimension(fieldDef) {
    return util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) || !!fieldDef.bin ||
        (fieldDef.type === type_1.TEMPORAL && !!fieldDef.timeUnit);
}
function isDimension(fieldDef) {
    return fieldDef && fieldDef.field && _isFieldDimension(fieldDef);
}
exports.isDimension = isDimension;
function isMeasure(fieldDef) {
    return fieldDef && fieldDef.field && !_isFieldDimension(fieldDef);
}
exports.isMeasure = isMeasure;
exports.COUNT_DISPLAYNAME = 'Number of Records';
function count() {
    return { field: '*', aggregate: 'count', type: type_1.QUANTITATIVE, displayName: exports.COUNT_DISPLAYNAME };
}
exports.count = count;
function isCount(fieldDef) {
    return fieldDef.aggregate === 'count';
}
exports.isCount = isCount;
function cardinality(fieldDef, stats, filterNull) {
    if (filterNull === void 0) { filterNull = {}; }
    var stat = stats[fieldDef.field];
    var type = fieldDef.type;
    if (fieldDef.bin) {
        var bin = fieldDef.bin;
        var maxbins = (typeof bin === 'boolean') ? undefined : bin.maxbins;
        if (maxbins === undefined) {
            maxbins = 10;
        }
        var bins = util_1.getbins(stat, maxbins);
        return (bins.stop - bins.start) / bins.step;
    }
    if (fieldDef.type === type_1.TEMPORAL) {
        var timeUnit = fieldDef.timeUnit;
        switch (timeUnit) {
            case 'seconds': return 60;
            case 'minutes': return 60;
            case 'hours': return 24;
            case 'day': return 7;
            case 'date': return 31;
            case 'month': return 12;
            case 'year':
                var yearstat = stats['year_' + fieldDef.field];
                if (!yearstat) {
                    return null;
                }
                return yearstat.distinct -
                    (stat.missing > 0 && filterNull[type] ? 1 : 0);
        }
    }
    if (fieldDef.aggregate) {
        return 1;
    }
    return stat.distinct -
        (stat.missing > 0 && filterNull[type] ? 1 : 0);
}
exports.cardinality = cardinality;
function title(fieldDef) {
    if (isCount(fieldDef)) {
        return exports.COUNT_DISPLAYNAME;
    }
    var fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
    if (fn) {
        return fn.toUpperCase() + '(' + fieldDef.field + ')';
    }
    else {
        return fieldDef.field;
    }
}
exports.title = title;

},{"./type":53,"./util":54}],32:[function(require,module,exports){
(function (Mark) {
    Mark[Mark["AREA"] = 'area'] = "AREA";
    Mark[Mark["BAR"] = 'bar'] = "BAR";
    Mark[Mark["LINE"] = 'line'] = "LINE";
    Mark[Mark["POINT"] = 'point'] = "POINT";
    Mark[Mark["TEXT"] = 'text'] = "TEXT";
    Mark[Mark["TICK"] = 'tick'] = "TICK";
    Mark[Mark["CIRCLE"] = 'circle'] = "CIRCLE";
    Mark[Mark["SQUARE"] = 'square'] = "SQUARE";
})(exports.Mark || (exports.Mark = {}));
var Mark = exports.Mark;
exports.AREA = Mark.AREA;
exports.BAR = Mark.BAR;
exports.LINE = Mark.LINE;
exports.POINT = Mark.POINT;
exports.TEXT = Mark.TEXT;
exports.TICK = Mark.TICK;
exports.CIRCLE = Mark.CIRCLE;
exports.SQUARE = Mark.SQUARE;

},{}],33:[function(require,module,exports){
exports.axis = {
    type: 'object',
    properties: {
        format: {
            type: 'string',
            default: undefined,
            description: 'The formatting pattern for axis labels. If undefined, a good format is automatically determined. Vega-Lite uses D3\'s format pattern and automatically switches to datetime formatters.'
        },
        grid: {
            type: 'boolean',
            default: undefined,
            description: 'A flag indicate if gridlines should be created in addition to ticks. If `grid` is unspecified, the default value is `true` for ROW and COL. For X and Y, the default value is `true` for quantitative and time fields and `false` otherwise.'
        },
        layer: {
            type: 'string',
            default: undefined,
            description: 'A string indicating if the axis (and any gridlines) should be placed above or below the data marks.'
        },
        offset: {
            type: 'number',
            default: undefined,
            description: 'The offset, in pixels, by which to displace the axis from the edge of the enclosing group or data rectangle.'
        },
        orient: {
            type: 'string',
            default: undefined,
            enum: ['top', 'right', 'left', 'bottom'],
            description: 'The orientation of the axis. One of top, bottom, left or right. The orientation can be used to further specialize the axis type (e.g., a y axis oriented for the right edge of the chart).'
        },
        subdivide: {
            type: 'number',
            default: undefined,
            description: 'If provided, sets the number of minor ticks between major ticks (the value 9 results in decimal subdivision). Only applicable for axes visualizing quantitative scales.'
        },
        ticks: {
            type: 'integer',
            default: undefined,
            minimum: 0,
            description: 'A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale\'s range.'
        },
        tickPadding: {
            type: 'integer',
            default: undefined,
            description: 'The padding, in pixels, between ticks and text labels.'
        },
        tickSize: {
            type: 'integer',
            default: undefined,
            minimum: 0,
            description: 'The size, in pixels, of major, minor and end ticks.'
        },
        tickSizeMajor: {
            type: 'integer',
            default: undefined,
            minimum: 0,
            description: 'The size, in pixels, of major ticks.'
        },
        tickSizeMinor: {
            type: 'integer',
            default: undefined,
            minimum: 0,
            description: 'The size, in pixels, of minor ticks.'
        },
        tickSizeEnd: {
            type: 'integer',
            default: undefined,
            minimum: 0,
            description: 'The size, in pixels, of end ticks.'
        },
        title: {
            type: 'string',
            default: undefined,
            description: 'A title for the axis. (Shows field name and its function by default.)'
        },
        titleOffset: {
            type: 'integer',
            default: undefined,
            description: 'A title offset value for the axis.'
        },
        values: {
            type: 'array',
            default: undefined
        },
        properties: {
            type: 'object',
            description: 'Optional mark property definitions for custom axis styling.'
        },
        characterWidth: {
            type: 'integer',
            default: 6,
            description: 'Character width for automatically determining title max length.'
        },
        labelMaxLength: {
            type: 'integer',
            default: 25,
            minimum: 1,
            description: 'Truncate labels that are too long.'
        },
        labels: {
            type: 'boolean',
            default: true,
            description: 'Enable or disable labels.'
        },
        shortTimeLabels: {
            type: 'boolean',
            default: false,
            description: 'Whether month and day names should be abbreviated.'
        },
        titleMaxLength: {
            type: 'integer',
            default: undefined,
            minimum: 0,
            description: 'Max length for axis title if the title is automatically generated from the field\'s description.' +
                'By default, this is automatically based on cell size and characterWidth property.'
        }
    }
};

},{}],34:[function(require,module,exports){
var type_1 = require('../type');
var util_1 = require('../util');
exports.bin = {
    type: ['boolean', 'object'],
    default: false,
    properties: {
        min: {
            type: 'number',
            default: undefined,
            description: 'The minimum bin value to consider. If unspecified, the minimum value of the specified field is used.'
        },
        max: {
            type: 'number',
            default: undefined,
            description: 'The maximum bin value to consider. If unspecified, the maximum value of the specified field is used.'
        },
        base: {
            type: 'number',
            default: undefined,
            description: 'The number base to use for automatic bin determination (default is base 10).'
        },
        step: {
            type: 'number',
            default: undefined,
            description: 'An exact step size to use between bins. If provided, options such as maxbins will be ignored.'
        },
        steps: {
            type: 'array',
            default: undefined,
            description: 'An array of allowable step sizes to choose from.'
        },
        minstep: {
            type: 'number',
            default: undefined,
            description: 'A minimum allowable step size (particularly useful for integer values).'
        },
        div: {
            type: 'array',
            default: undefined,
            description: 'Scale factors indicating allowable subdivisions. The default value is [5, 2], which indicates that for base 10 numbers (the default base), the method may consider dividing bin sizes by 5 and/or 2. For example, for an initial step size of 10, the method can check if bin sizes of 2 (= 10/5), 5 (= 10/2), or 1 (= 10/(5*2)) might also satisfy the given constraints.'
        },
        maxbins: {
            type: 'integer',
            default: undefined,
            minimum: 2,
            description: 'Maximum number of bins.'
        }
    },
    supportedTypes: util_1.toMap([type_1.QUANTITATIVE])
};

},{"../type":53,"../util":54}],35:[function(require,module,exports){
exports.cellConfig = {
    type: 'object',
    properties: {
        width: {
            type: 'integer',
            default: 200
        },
        height: {
            type: 'integer',
            default: 200
        },
        gridColor: {
            type: 'string',
            role: 'color',
            default: '#000000'
        },
        gridOpacity: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            default: 0.4
        },
        gridOffset: {
            type: 'number',
            default: 0
        },
        clip: {
            type: 'boolean',
        },
        fill: {
            type: 'string',
            role: 'color',
            default: 'rgba(0,0,0,0)'
        },
        fillOpacity: {
            type: 'number',
        },
        stroke: {
            type: 'string',
            role: 'color',
        },
        strokeWidth: {
            type: 'integer'
        },
        strokeOpacity: {
            type: 'number'
        },
        strokeDash: {
            type: 'array',
            default: undefined
        },
        strokeDashOffset: {
            type: 'integer',
            description: 'The offset (in pixels) into which to begin drawing with the stroke dash array.'
        }
    }
};

},{}],36:[function(require,module,exports){
exports.markConfig = {
    type: 'object',
    properties: {
        filled: {
            type: 'boolean',
            default: undefined,
            description: 'Whether the shape\'s color should be used as fill color instead of stroke color. ' +
                'This is only applicable for "bar", "point", and "area". ' +
                'All marks except "point" marks are filled by default.'
        },
        color: {
            type: 'string',
            role: 'color',
            default: '#4682b4',
            description: 'Default color.'
        },
        barWidth: {
            type: 'number',
            default: undefined,
            description: 'The width of the bars.  If unspecified, the default width is  `bandWidth-1`, which provides 1 pixel offset between bars.'
        },
        tickWidth: {
            type: 'string',
            role: 'color',
            default: undefined,
            description: 'The width of the ticks.'
        },
        fill: {
            type: 'string',
            role: 'color',
            default: undefined
        },
        fillOpacity: {
            type: 'number',
            default: undefined,
            minimum: 0,
            maximum: 1
        },
        stroke: {
            type: 'string',
            role: 'color',
            default: undefined
        },
        strokeOpacity: {
            type: 'number',
            default: undefined,
            minimum: 0,
            maximum: 1
        },
        opacity: {
            type: 'number',
            default: undefined,
            minimum: 0,
            maximum: 1
        },
        strokeWidth: {
            type: 'number',
            default: 2,
            minimum: 0
        },
        strokeDash: {
            type: 'array',
            default: undefined,
            description: 'An array of alternating stroke, space lengths for creating dashed or dotted lines.'
        },
        strokeDashOffset: {
            type: 'array',
            default: undefined,
            description: 'The offset (in pixels) into which to begin drawing with the stroke dash array.'
        },
        orient: {
            type: 'string',
            default: undefined,
            description: 'The orientation of a non-stacked bar, tick, area, and line charts.' +
                'The value is either horizontal (default) or vertical.' +
                'For bar and tick, this determines whether the size of the bar and tick should be applied to x or y dimension.' +
                'For area, this property determines the orient property of the Vega output.' +
                'For line, this property determines the sort order of the points in the line if `config.sortLineBy` is not specified.' +
                'For stacked charts, this is always determined by the orientation of the stack; ' +
                'therefore explicitly specified value will be ignored.'
        },
        interpolate: {
            type: 'string',
            default: undefined,
            description: 'The line interpolation method to use. One of linear, step-before, step-after, basis, basis-open, basis-closed, bundle, cardinal, cardinal-open, cardinal-closed, monotone.'
        },
        tension: {
            type: 'number',
            default: undefined,
            description: 'Depending on the interpolation type, sets the tension parameter.'
        },
        shape: {
            type: 'number',
            enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
            default: undefined,
            description: 'The symbol shape to use. One of circle (default), square, cross, diamond, triangle-up, or triangle-down.'
        },
        size: {
            type: 'number',
            default: 30,
            description: 'The pixel area each the point. For example: in the case of circles, the radius is determined in part by the square root of the size value.'
        },
        thickness: {
            type: 'number',
            default: 1,
            description: 'Thickness of the tick mark.'
        },
        align: {
            type: 'string',
            default: undefined,
            enum: ['left', 'right', 'center'],
            description: 'The horizontal alignment of the text. One of left, right, center.'
        },
        angle: {
            type: 'number',
            default: undefined,
            description: 'The rotation angle of the text, in degrees.'
        },
        baseline: {
            type: 'string',
            default: 'middle',
            enum: ['top', 'middle', 'bottom'],
            description: 'The vertical alignment of the text. One of top, middle, bottom.'
        },
        dx: {
            type: 'number',
            default: undefined,
            description: 'The horizontal offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the angle property.'
        },
        dy: {
            type: 'number',
            default: undefined,
            description: 'The vertical offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the angle property.'
        },
        font: {
            type: 'string',
            default: undefined,
            role: 'font',
            description: 'The typeface to set the text in (e.g., Helvetica Neue).'
        },
        fontSize: {
            type: 'number',
            default: 10,
            description: 'The font size, in pixels.'
        },
        fontStyle: {
            type: 'string',
            default: undefined,
            enum: ['normal', 'italic'],
            description: 'The font style (e.g., italic).'
        },
        fontWeight: {
            type: 'string',
            enum: ['normal', 'bold'],
            default: undefined,
            description: 'The font weight (e.g., bold).'
        },
        radius: {
            type: 'number',
            default: undefined,
            description: 'Polar coordinate radial offset, in pixels, of the text label from the origin determined by the x and y properties.'
        },
        theta: {
            type: 'number',
            default: undefined,
            description: 'Polar coordinate angle, in radians, of the text label from the origin determined by the x and y properties. Values for theta follow the same convention of arc mark startAngle and endAngle properties: angles are measured in radians, with 0 indicating "north".'
        },
        format: {
            type: 'string',
            default: undefined,
            description: 'The formatting pattern for text value. If not defined, this will be determined automatically. '
        },
        shortTimeLabels: {
            type: 'boolean',
            default: false,
            description: 'Whether month names and weekday names should be abbreviated.'
        },
        applyColorToBackground: {
            type: 'boolean',
            default: false,
            description: 'Apply color field to background color instead of the text.'
        }
    }
};

},{}],37:[function(require,module,exports){
exports.sceneConfig = {
    type: 'object',
    properties: {
        fill: {
            type: 'string',
            role: 'color'
        },
        fillOpacity: {
            type: 'number',
        },
        stroke: {
            type: 'string',
            role: 'color',
        },
        strokeWidth: {
            type: 'integer'
        },
        strokeOpacity: {
            type: 'number'
        },
        strokeDash: {
            type: 'array'
        },
        strokeDashOffset: {
            type: 'integer',
            description: 'The offset (in pixels) into which to begin drawing with the stroke dash array.'
        }
    }
};

},{}],38:[function(require,module,exports){
var config_stack_schema_1 = require('./config.stack.schema');
var config_cell_schema_1 = require('./config.cell.schema');
var config_marks_schema_1 = require('./config.marks.schema');
var config_scene_schema_1 = require('./config.scene.schema');
exports.config = {
    type: 'object',
    properties: {
        viewport: {
            type: 'array',
            items: {
                type: 'integer'
            },
            default: undefined,
            description: 'The width and height of the on-screen viewport, in pixels. If necessary, clipping and scrolling will be applied.'
        },
        background: {
            type: 'string',
            role: 'color',
            default: undefined,
            description: 'CSS color property to use as background of visualization. Default is `"transparent"`.'
        },
        numberFormat: {
            type: 'string',
            default: 's',
            description: 'D3 Number format for axis labels and text tables. For example "s" for SI units.'
        },
        timeFormat: {
            type: 'string',
            default: '%Y-%m-%d',
            description: 'Default datetime format for axis and legend labels. The format can be set directly on each axis and legend.'
        },
        stack: config_stack_schema_1.stackConfig,
        cell: config_cell_schema_1.cellConfig,
        mark: config_marks_schema_1.markConfig,
        scene: config_scene_schema_1.sceneConfig
    }
};

},{"./config.cell.schema":35,"./config.marks.schema":36,"./config.scene.schema":37,"./config.stack.schema":39}],39:[function(require,module,exports){
exports.stackConfig = {
    type: ['boolean', 'object'],
    default: {},
    description: 'Enable stacking (for bar and area marks only).',
    properties: {
        sort: {
            oneOf: [{
                    type: 'string',
                    enum: ['ascending', 'descending']
                }, {
                    type: 'array',
                    items: { type: 'string' },
                }],
            description: 'Order of the stack. ' +
                'This can be either a string (either "descending" or "ascending")' +
                'or a list of fields to determine the order of stack layers.' +
                'By default, stack uses descending order.'
        },
        offset: {
            type: 'string',
            enum: ['zero', 'center', 'normalize']
        }
    }
};

},{}],40:[function(require,module,exports){
exports.data = {
    type: 'object',
    properties: {
        formatType: {
            type: 'string',
            enum: ['json', 'csv', 'tsv'],
            default: 'json'
        },
        url: {
            type: 'string',
            default: undefined
        },
        values: {
            type: 'array',
            default: undefined,
            description: 'Pass array of objects instead of a url to a file.',
            items: {
                type: 'object',
                additionalProperties: true
            }
        }
    }
};

},{}],41:[function(require,module,exports){
var fielddef_schema_1 = require('./fielddef.schema');
exports.encoding = {
    type: 'object',
    properties: {
        x: fielddef_schema_1.positionFieldDef,
        y: fielddef_schema_1.positionFieldDef,
        row: fielddef_schema_1.facetFieldDef,
        column: fielddef_schema_1.facetFieldDef,
        size: fielddef_schema_1.sizeFieldDef,
        color: fielddef_schema_1.colorFieldDef,
        shape: fielddef_schema_1.shapeFieldDef,
        path: fielddef_schema_1.orderFieldDefs,
        text: fielddef_schema_1.textFieldDef,
        detail: fielddef_schema_1.orderFieldDefs,
        label: fielddef_schema_1.textFieldDef
    }
};

},{"./fielddef.schema":42}],42:[function(require,module,exports){
var axis_schema_1 = require('./axis.schema');
var bin_schema_1 = require('./bin.schema');
var legend_schema_1 = require('./legend.schema');
var scale_schema_1 = require('./scale.schema');
var sort_schema_1 = require('./sort.schema');
var aggregate_1 = require('../aggregate');
var util_1 = require('../util');
var schemautil_1 = require('./schemautil');
var timeunit_1 = require('../timeunit');
var type_1 = require('../type');
exports.aggregate = {
    type: 'string',
    enum: aggregate_1.AGGREGATE_OPS,
    supportedEnums: {
        quantitative: aggregate_1.AGGREGATE_OPS,
        ordinal: ['median', 'min', 'max'],
        nominal: [],
        temporal: ['mean', 'median', 'min', 'max'],
        '': ['count']
    },
    supportedTypes: util_1.toMap([type_1.QUANTITATIVE, type_1.NOMINAL, type_1.ORDINAL, type_1.TEMPORAL, ''])
};
var fieldDef = {
    type: 'object',
    properties: {
        field: {
            type: 'string'
        },
        value: {
            type: ['string', 'number']
        },
        type: {
            type: 'string',
            enum: [type_1.NOMINAL, type_1.ORDINAL, type_1.QUANTITATIVE, type_1.TEMPORAL]
        },
        bin: bin_schema_1.bin,
        timeUnit: {
            type: 'string',
            enum: timeunit_1.TIMEUNITS,
            supportedTypes: util_1.toMap([type_1.TEMPORAL])
        },
        aggregate: exports.aggregate,
        sort: sort_schema_1.sort
    }
};
var fieldDefWithScale = schemautil_1.mergeDeep(util_1.duplicate(fieldDef), {
    properties: {
        scale: scale_schema_1.typicalScale
    }
});
exports.positionFieldDef = schemautil_1.mergeDeep(util_1.duplicate(fieldDefWithScale), {
    required: ['field', 'type'],
    properties: {
        scale: {
            properties: {
                padding: { default: 1 }
            }
        },
        axis: axis_schema_1.axis
    }
});
exports.colorFieldDef = schemautil_1.mergeDeep(util_1.duplicate(fieldDefWithScale), {
    properties: {
        legend: legend_schema_1.legend
    }
});
exports.sizeFieldDef = exports.colorFieldDef;
exports.orderFieldDefs = {
    default: undefined,
    oneOf: [util_1.duplicate(fieldDef), {
            type: 'array',
            items: util_1.duplicate(fieldDef)
        }]
};
exports.textFieldDef = schemautil_1.mergeDeep(util_1.duplicate(fieldDef), {
    properties: {
        value: {
            type: 'string',
            default: 'Abc'
        }
    }
});
var fieldDefWithOrdinalScale = schemautil_1.mergeDeep(util_1.duplicate(fieldDef), {
    properties: {
        scale: scale_schema_1.ordinalOnlyScale
    }
});
exports.shapeFieldDef = schemautil_1.mergeDeep(util_1.duplicate(fieldDefWithOrdinalScale), {
    properties: {
        legend: legend_schema_1.legend
    }
});
exports.facetFieldDef = schemautil_1.mergeDeep(util_1.duplicate(fieldDefWithOrdinalScale), {
    required: ['field', 'type'],
    properties: {
        axis: axis_schema_1.axis
    }
});

},{"../aggregate":7,"../timeunit":52,"../type":53,"../util":54,"./axis.schema":33,"./bin.schema":34,"./legend.schema":43,"./scale.schema":45,"./schemautil":47,"./sort.schema":48}],43:[function(require,module,exports){
exports.legend = {
    default: true,
    description: 'Properties of a legend or boolean flag for determining whether to show it.',
    oneOf: [{
            type: 'object',
            properties: {
                orient: {
                    type: 'string',
                    default: undefined,
                    description: 'The orientation of the legend. One of "left" or "right". This determines how the legend is positioned within the scene. The default is "right".'
                },
                title: {
                    type: 'string',
                    default: undefined,
                    description: 'A title for the legend. (Shows field name and its function by default.)'
                },
                format: {
                    type: 'string',
                    default: undefined,
                    description: 'An optional formatting pattern for legend labels. Vega uses D3\'s format pattern.'
                },
                values: {
                    type: 'array',
                    default: undefined,
                    description: 'Explicitly set the visible legend values.'
                },
                properties: {
                    type: 'object',
                    default: undefined,
                    description: 'Optional mark property definitions for custom legend styling. '
                },
                shortTimeLabels: {
                    type: 'boolean',
                    default: false,
                    description: 'Whether month names and weekday names should be abbreviated.'
                }
            },
        }, {
            type: 'boolean'
        }]
};

},{}],44:[function(require,module,exports){
exports.mark = {
    type: 'string',
    enum: ['point', 'tick', 'bar', 'line', 'area', 'circle', 'square', 'text']
};

},{}],45:[function(require,module,exports){
var util_1 = require('../util');
var schemautil_1 = require('./schemautil');
var type_1 = require('../type');
var scale = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: ['linear', 'log', 'pow', 'sqrt', 'quantile', 'ordinal'],
            default: undefined,
            supportedTypes: util_1.toMap([type_1.QUANTITATIVE])
        },
        domain: {
            default: undefined,
            type: ['array', 'object'],
            description: 'The domain of the scale, representing the set of data values. For quantitative data, this can take the form of a two-element array with minimum and maximum values. For ordinal/categorical data, this may be an array of valid input values. The domain may also be specified by a reference to a data source.'
        },
        range: {
            default: undefined,
            type: ['array', 'object', 'string'],
            description: 'The range of the scale, representing the set of visual values. For numeric values, the range can take the form of a two-element array with minimum and maximum values. For ordinal or quantized data, the range may by an array of desired output values, which are mapped to elements in the specified domain. For ordinal scales only, the range can be defined using a DataRef: the range values are then drawn dynamically from a backing data set.'
        },
        round: {
            default: undefined,
            type: 'boolean',
            description: 'If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.'
        }
    }
};
var ordinalScaleMixin = {
    properties: {
        bandWidth: {
            type: 'integer',
            minimum: 0,
            default: undefined
        },
        outerPadding: {
            type: 'number',
            default: undefined
        },
        padding: {
            type: 'number',
            default: undefined,
            description: 'Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).'
        }
    }
};
var typicalScaleMixin = {
    properties: {
        clamp: {
            type: 'boolean',
            default: true,
            description: 'If true, values that exceed the data domain are clamped to either the minimum or maximum range value'
        },
        nice: {
            default: undefined,
            oneOf: [
                {
                    type: 'boolean',
                    description: 'If true, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96).'
                }, {
                    type: 'string',
                    enum: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'],
                    description: 'If specified, modifies the scale domain to use a more human-friendly value range. For time and utc scale types only, the nice value should be a string indicating the desired time interval; legal values are "second", "minute", "hour", "day", "week", "month", or "year".'
                }
            ],
            supportedTypes: util_1.toMap([type_1.QUANTITATIVE, type_1.TEMPORAL]),
            description: ''
        },
        exponent: {
            type: 'number',
            default: undefined,
            description: 'Sets the exponent of the scale transformation. For pow scale types only, otherwise ignored.'
        },
        zero: {
            type: 'boolean',
            description: 'If true, ensures that a zero baseline value is included in the scale domain. This option is ignored for non-quantitative scales.',
            default: undefined,
            supportedTypes: util_1.toMap([type_1.QUANTITATIVE, type_1.TEMPORAL])
        },
        useRawDomain: {
            type: 'boolean',
            default: false,
            description: 'Uses the source data range as scale domain instead of ' +
                'aggregated data for aggregate axis. ' +
                'This option does not work with sum or count aggregate' +
                'as they might have a substantially larger scale range.'
        }
    }
};
exports.ordinalOnlyScale = schemautil_1.mergeDeep(util_1.duplicate(scale), ordinalScaleMixin);
exports.typicalScale = schemautil_1.mergeDeep(util_1.duplicate(scale), ordinalScaleMixin, typicalScaleMixin);

},{"../type":53,"../util":54,"./schemautil":47}],46:[function(require,module,exports){
var schemaUtil = require('./schemautil');
var mark_schema_1 = require('./mark.schema');
var config_schema_1 = require('./config.schema');
var data_schema_1 = require('./data.schema');
var encoding_schema_1 = require('./encoding.schema');
var transform_schema_1 = require('./transform.schema');
var fielddef_schema_1 = require('./fielddef.schema');
exports.aggregate = fielddef_schema_1.aggregate;
exports.util = schemaUtil;
exports.schema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    description: 'Schema for Vega-Lite specification',
    type: 'object',
    required: ['mark', 'encoding'],
    properties: {
        name: {
            type: 'string',
            description: 'A name for the specification. The name is used to annotate marks, scale names, and more.'
        },
        description: {
            type: 'string'
        },
        data: data_schema_1.data,
        transform: transform_schema_1.transform,
        mark: mark_schema_1.mark,
        encoding: encoding_schema_1.encoding,
        config: config_schema_1.config
    }
};
function instantiate() {
    return schemaUtil.instantiate(exports.schema);
}
exports.instantiate = instantiate;
;

},{"./config.schema":38,"./data.schema":40,"./encoding.schema":41,"./fielddef.schema":42,"./mark.schema":44,"./schemautil":47,"./transform.schema":49}],47:[function(require,module,exports){
var util = require('../util');
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
;
function extend(instance, schema) {
    return mergeDeep(instantiate(schema), instance);
}
exports.extend = extend;
;
function instantiate(schema) {
    var val;
    if (schema === undefined) {
        return undefined;
    }
    else if ('default' in schema) {
        val = schema.default;
        return util.isObject(val) ? util.duplicate(val) : val;
    }
    else if (schema.type === 'object') {
        var instance = {};
        for (var name in schema.properties) {
            if (schema.properties.hasOwnProperty(name)) {
                val = instantiate(schema.properties[name]);
                if (val !== undefined) {
                    instance[name] = val;
                }
            }
        }
        return instance;
    }
    else if (schema.type === 'array') {
        return undefined;
    }
    return undefined;
}
exports.instantiate = instantiate;
;
function subtract(instance, defaults) {
    var changes = {};
    for (var prop in instance) {
        if (instance.hasOwnProperty(prop)) {
            var def = defaults[prop];
            var ins = instance[prop];
            if (!defaults || def !== ins) {
                if (typeof ins === 'object' && !util.isArray(ins) && def) {
                    var c = subtract(ins, def);
                    if (!isEmpty(c)) {
                        changes[prop] = c;
                    }
                }
                else if (util.isArray(ins)) {
                    if (util.isArray(def)) {
                        if (ins.length === def.length) {
                            var equal = true;
                            for (var i = 0; i < ins.length; i++) {
                                if (ins[i] !== def[i]) {
                                    equal = false;
                                    break;
                                }
                            }
                            if (equal) {
                                continue;
                            }
                        }
                    }
                    changes[prop] = ins;
                }
                else {
                    changes[prop] = ins;
                }
            }
        }
    }
    return changes;
}
exports.subtract = subtract;
;
function mergeDeep(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < src.length; i++) {
        dest = deepMerge_(dest, src[i]);
    }
    return dest;
}
exports.mergeDeep = mergeDeep;
;
function deepMerge_(dest, src) {
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
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = mergeDeep(src[p].constructor === Array ? [] : {}, src[p]);
        }
        else {
            mergeDeep(dest[p], src[p]);
        }
    }
    return dest;
}

},{"../util":54}],48:[function(require,module,exports){
var aggregate_1 = require('../aggregate');
var type_1 = require('../type');
var util_1 = require('../util');
exports.sort = {
    default: 'ascending',
    supportedTypes: util_1.toMap([type_1.QUANTITATIVE, type_1.ORDINAL]),
    oneOf: [
        {
            type: 'string',
            enum: ['ascending', 'descending', 'unsorted']
        },
        {
            type: 'object',
            required: ['field', 'op'],
            properties: {
                field: {
                    type: 'string',
                    description: 'The field name to aggregate over.'
                },
                op: {
                    type: 'string',
                    enum: aggregate_1.AGGREGATE_OPS,
                    description: 'The field name to aggregate over.'
                },
                order: {
                    type: 'string',
                    enum: ['ascending', 'descending']
                }
            }
        }
    ]
};

},{"../aggregate":7,"../type":53,"../util":54}],49:[function(require,module,exports){
exports.transform = {
    type: 'object',
    properties: {
        filterNull: {
            type: 'boolean',
            default: undefined,
            description: 'Filter null values from the data. If set to true, all rows with null values are filtered. If false, no rows are filtered. Set the property to undefined to filter only quantitative and temporal fields.'
        },
        filter: {
            type: 'string',
            default: undefined,
            description: 'A string containing the filter Vega expression. Use `datum` to refer to the current data object.'
        },
        calculate: {
            type: 'array',
            default: undefined,
            description: 'Calculate new field(s) using the provided expresssion(s). Calculation are applied before filter.',
            items: {
                type: 'object',
                properties: {
                    field: {
                        type: 'string',
                        description: 'The field in which to store the computed formula value.'
                    },
                    expr: {
                        type: 'string',
                        description: 'A string containing an expression for the formula. Use the variable `datum` to to refer to the current data object.'
                    }
                }
            }
        }
    }
};

},{}],50:[function(require,module,exports){
var aggregate_1 = require('./aggregate');
var timeunit_1 = require('./timeunit');
var type_1 = require('./type');
var vlEncoding = require('./encoding');
var mark_1 = require('./mark');
exports.DELIM = '|';
exports.ASSIGN = '=';
exports.TYPE = ',';
exports.FUNC = '_';
function shorten(spec) {
    return 'mark' + exports.ASSIGN + spec.mark +
        exports.DELIM + shortenEncoding(spec.encoding);
}
exports.shorten = shorten;
function parse(shorthand, data, config) {
    var split = shorthand.split(exports.DELIM), mark = split.shift().split(exports.ASSIGN)[1].trim(), encoding = parseEncoding(split.join(exports.DELIM));
    var spec = {
        mark: mark_1.Mark[mark],
        encoding: encoding
    };
    if (data !== undefined) {
        spec.data = data;
    }
    if (config !== undefined) {
        spec.config = config;
    }
    return spec;
}
exports.parse = parse;
function shortenEncoding(encoding) {
    return vlEncoding.map(encoding, function (fieldDef, channel) {
        return channel + exports.ASSIGN + shortenFieldDef(fieldDef);
    }).join(exports.DELIM);
}
exports.shortenEncoding = shortenEncoding;
function parseEncoding(encodingShorthand) {
    return encodingShorthand.split(exports.DELIM).reduce(function (m, e) {
        var split = e.split(exports.ASSIGN), enctype = split[0].trim(), fieldDefShorthand = split[1];
        m[enctype] = parseFieldDef(fieldDefShorthand);
        return m;
    }, {});
}
exports.parseEncoding = parseEncoding;
function shortenFieldDef(fieldDef) {
    return (fieldDef.aggregate ? fieldDef.aggregate + exports.FUNC : '') +
        (fieldDef.timeUnit ? fieldDef.timeUnit + exports.FUNC : '') +
        (fieldDef.bin ? 'bin' + exports.FUNC : '') +
        (fieldDef.field || '') + exports.TYPE + type_1.SHORT_TYPE[fieldDef.type];
}
exports.shortenFieldDef = shortenFieldDef;
function shortenFieldDefs(fieldDefs, delim) {
    if (delim === void 0) { delim = exports.DELIM; }
    return fieldDefs.map(shortenFieldDef).join(delim);
}
exports.shortenFieldDefs = shortenFieldDefs;
function parseFieldDef(fieldDefShorthand) {
    var split = fieldDefShorthand.split(exports.TYPE);
    var fieldDef = {
        field: split[0].trim(),
        type: type_1.TYPE_FROM_SHORT_TYPE[split[1].trim()]
    };
    for (var i = 0; i < aggregate_1.AGGREGATE_OPS.length; i++) {
        var a = aggregate_1.AGGREGATE_OPS[i];
        if (fieldDef.field.indexOf(a + '_') === 0) {
            fieldDef.field = fieldDef.field.substr(a.length + 1);
            if (a === 'count' && fieldDef.field.length === 0) {
                fieldDef.field = '*';
            }
            fieldDef.aggregate = a;
            break;
        }
    }
    for (var i = 0; i < timeunit_1.TIMEUNITS.length; i++) {
        var tu = timeunit_1.TIMEUNITS[i];
        if (fieldDef.field && fieldDef.field.indexOf(tu + '_') === 0) {
            fieldDef.field = fieldDef.field.substr(fieldDef.field.length + 1);
            fieldDef.timeUnit = tu;
            break;
        }
    }
    if (fieldDef.field && fieldDef.field.indexOf('bin_') === 0) {
        fieldDef.field = fieldDef.field.substr(4);
        fieldDef.bin = true;
    }
    return fieldDef;
}
exports.parseFieldDef = parseFieldDef;

},{"./aggregate":7,"./encoding":30,"./mark":32,"./timeunit":52,"./type":53}],51:[function(require,module,exports){
var Model_1 = require('./compile/Model');
var channel_1 = require('./channel');
var vlEncoding = require('./encoding');
var mark_1 = require('./mark');
var util_1 = require('./util');
function alwaysNoOcclusion(spec) {
    return vlEncoding.isAggregate(spec.encoding);
}
exports.alwaysNoOcclusion = alwaysNoOcclusion;
function fieldDefs(spec) {
    return vlEncoding.fieldDefs(spec.encoding);
}
exports.fieldDefs = fieldDefs;
;
function getCleanSpec(spec) {
    return new Model_1.Model(spec).toSpec(true);
}
exports.getCleanSpec = getCleanSpec;
function isStack(spec) {
    return (vlEncoding.has(spec.encoding, channel_1.COLOR) || vlEncoding.has(spec.encoding, channel_1.SHAPE)) &&
        (spec.mark === mark_1.BAR || spec.mark === mark_1.AREA) &&
        (!spec.config || !spec.config.stack !== false) &&
        vlEncoding.isAggregate(spec.encoding);
}
exports.isStack = isStack;
function transpose(spec) {
    var oldenc = spec.encoding, encoding = util_1.duplicate(spec.encoding);
    encoding.x = oldenc.y;
    encoding.y = oldenc.x;
    encoding.row = oldenc.column;
    encoding.column = oldenc.row;
    spec.encoding = encoding;
    return spec;
}
exports.transpose = transpose;

},{"./channel":9,"./compile/Model":10,"./encoding":30,"./mark":32,"./util":54}],52:[function(require,module,exports){
exports.TIMEUNITS = [
    'year', 'month', 'day', 'date', 'hours', 'minutes', 'seconds', 'milliseconds',
    'yearmonth', 'yearmonthday', 'yearmonthdate', 'yearday', 'yeardate',
    'yearmonthdayhours', 'yearmonthdayhoursminutes', 'hoursminutes',
    'hoursminutesseconds', 'minutesseconds', 'secondsmilliseconds'
];

},{}],53:[function(require,module,exports){
(function (Type) {
    Type[Type["QUANTITATIVE"] = 'quantitative'] = "QUANTITATIVE";
    Type[Type["ORDINAL"] = 'ordinal'] = "ORDINAL";
    Type[Type["TEMPORAL"] = 'temporal'] = "TEMPORAL";
    Type[Type["NOMINAL"] = 'nominal'] = "NOMINAL";
})(exports.Type || (exports.Type = {}));
var Type = exports.Type;
exports.QUANTITATIVE = Type.QUANTITATIVE;
exports.ORDINAL = Type.ORDINAL;
exports.TEMPORAL = Type.TEMPORAL;
exports.NOMINAL = Type.NOMINAL;
exports.SHORT_TYPE = {
    quantitative: 'Q',
    temporal: 'T',
    nominal: 'N',
    ordinal: 'O'
};
exports.TYPE_FROM_SHORT_TYPE = {
    Q: exports.QUANTITATIVE,
    T: exports.TEMPORAL,
    O: exports.ORDINAL,
    N: exports.NOMINAL
};
function getFullName(type) {
    var typeString = type;
    return exports.TYPE_FROM_SHORT_TYPE[typeString.toUpperCase()] ||
        typeString.toLowerCase();
}
exports.getFullName = getFullName;

},{}],54:[function(require,module,exports){
var util_1 = require('datalib/src/util');
exports.keys = util_1.keys;
exports.extend = util_1.extend;
exports.duplicate = util_1.duplicate;
exports.isArray = util_1.isArray;
exports.vals = util_1.vals;
exports.truncate = util_1.truncate;
exports.toMap = util_1.toMap;
exports.isObject = util_1.isObject;
var generate_1 = require('datalib/src/generate');
exports.range = generate_1.range;
function contains(array, item) {
    return array.indexOf(item) > -1;
}
exports.contains = contains;
function forEach(obj, f, thisArg) {
    if (obj.forEach) {
        obj.forEach.call(thisArg, f);
    }
    else {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                f.call(thisArg, obj[k], k, obj);
            }
        }
    }
}
exports.forEach = forEach;
function reduce(obj, f, init, thisArg) {
    if (obj.reduce) {
        return obj.reduce.call(thisArg, f, init);
    }
    else {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                init = f.call(thisArg, init, obj[k], k, obj);
            }
        }
        return init;
    }
}
exports.reduce = reduce;
function map(obj, f, thisArg) {
    if (obj.map) {
        return obj.map.call(thisArg, f);
    }
    else {
        var output = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                output.push(f.call(thisArg, obj[k], k, obj));
            }
        }
        return output;
    }
}
exports.map = map;
function any(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
exports.any = any;
function all(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
exports.all = all;
var dlBin = require('datalib/src/bins/bins');
function getbins(stats, maxbins) {
    return dlBin({
        min: stats.min,
        max: stats.max,
        maxbins: maxbins
    });
}
exports.getbins = getbins;
function error(message) {
    console.error('[VL Error]', message);
}
exports.error = error;

},{"datalib/src/bins/bins":2,"datalib/src/generate":3,"datalib/src/util":5}],55:[function(require,module,exports){
var util_1 = require('./util');
var mark_1 = require('./mark');
exports.DEFAULT_REQUIRED_CHANNEL_MAP = {
    text: ['text'],
    line: ['x', 'y'],
    area: ['x', 'y']
};
exports.DEFAULT_SUPPORTED_CHANNEL_TYPE = {
    bar: util_1.toMap(['row', 'column', 'x', 'y', 'size', 'color', 'detail']),
    line: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
    area: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
    tick: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
    circle: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail']),
    square: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail']),
    point: util_1.toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail', 'shape']),
    text: util_1.toMap(['row', 'column', 'size', 'color', 'text'])
};
function getEncodingMappingError(spec, requiredChannelMap, supportedChannelMap) {
    if (requiredChannelMap === void 0) { requiredChannelMap = exports.DEFAULT_REQUIRED_CHANNEL_MAP; }
    if (supportedChannelMap === void 0) { supportedChannelMap = exports.DEFAULT_SUPPORTED_CHANNEL_TYPE; }
    var mark = spec.mark;
    var encoding = spec.encoding;
    var requiredChannels = requiredChannelMap[mark];
    var supportedChannels = supportedChannelMap[mark];
    for (var i in requiredChannels) {
        if (!(requiredChannels[i] in encoding)) {
            return 'Missing encoding channel \"' + requiredChannels[i] +
                '\" for mark \"' + mark + '\"';
        }
    }
    for (var channel in encoding) {
        if (!supportedChannels[channel]) {
            return 'Encoding channel \"' + channel +
                '\" is not supported by mark type \"' + mark + '\"';
        }
    }
    if (mark === mark_1.BAR && !encoding.x && !encoding.y) {
        return 'Missing both x and y for bar';
    }
    return null;
}
exports.getEncodingMappingError = getEncodingMappingError;

},{"./mark":32,"./util":54}],56:[function(require,module,exports){
var vlBin = require('./bin');
var vlChannel = require('./channel');
var vlData = require('./data');
var vlEncoding = require('./encoding');
var vlFieldDef = require('./fielddef');
var vlCompile = require('./compile/compile');
var vlSchema = require('./schema/schema');
var vlShorthand = require('./shorthand');
var vlSpec = require('./spec');
var vlTimeUnit = require('./timeunit');
var vlType = require('./type');
var vlValidate = require('./validate');
var vlUtil = require('./util');
exports.bin = vlBin;
exports.channel = vlChannel;
exports.compile = vlCompile.compile;
exports.data = vlData;
exports.encoding = vlEncoding;
exports.fieldDef = vlFieldDef;
exports.schema = vlSchema;
exports.shorthand = vlShorthand;
exports.spec = vlSpec;
exports.timeUnit = vlTimeUnit;
exports.type = vlType;
exports.util = vlUtil;
exports.validate = vlValidate;
exports.version = '0.9.3';

},{"./bin":8,"./channel":9,"./compile/compile":12,"./data":29,"./encoding":30,"./fielddef":31,"./schema/schema":46,"./shorthand":50,"./spec":51,"./timeunit":52,"./type":53,"./util":54,"./validate":55}]},{},[56])(56)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9kYXRhbGliL25vZGVfbW9kdWxlcy9kMy10aW1lL2J1aWxkL2QzLXRpbWUuanMiLCIuLi9kYXRhbGliL3NyYy9iaW5zL2JpbnMuanMiLCIuLi9kYXRhbGliL3NyYy9nZW5lcmF0ZS5qcyIsIi4uL2RhdGFsaWIvc3JjL3RpbWUuanMiLCIuLi9kYXRhbGliL3NyYy9ub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXJlc29sdmUvZW1wdHkuanMiLCJzcmMvYWdncmVnYXRlLnRzIiwic3JjL2Jpbi50cyIsInNyYy9jaGFubmVsLnRzIiwic3JjL2NvbXBpbGUvTW9kZWwudHMiLCJzcmMvY29tcGlsZS9heGlzLnRzIiwic3JjL2NvbXBpbGUvY29tcGlsZS50cyIsInNyYy9jb21waWxlL2NvbmZpZy50cyIsInNyYy9jb21waWxlL2RhdGEudHMiLCJzcmMvY29tcGlsZS9mYWNldC50cyIsInNyYy9jb21waWxlL2xheW91dC50cyIsInNyYy9jb21waWxlL2xlZ2VuZC50cyIsInNyYy9jb21waWxlL21hcmstYXJlYS50cyIsInNyYy9jb21waWxlL21hcmstYmFyLnRzIiwic3JjL2NvbXBpbGUvbWFyay1saW5lLnRzIiwic3JjL2NvbXBpbGUvbWFyay1wb2ludC50cyIsInNyYy9jb21waWxlL21hcmstdGV4dC50cyIsInNyYy9jb21waWxlL21hcmstdGljay50cyIsInNyYy9jb21waWxlL21hcmsudHMiLCJzcmMvY29tcGlsZS9zY2FsZS50cyIsInNyYy9jb21waWxlL3N0YWNrLnRzIiwic3JjL2NvbXBpbGUvdGltZS50cyIsInNyYy9jb21waWxlL3V0aWwudHMiLCJzcmMvZGF0YS50cyIsInNyYy9lbmNvZGluZy50cyIsInNyYy9maWVsZGRlZi50cyIsInNyYy9tYXJrLnRzIiwic3JjL3NjaGVtYS9heGlzLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvYmluLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvY29uZmlnLmNlbGwuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9jb25maWcubWFya3Muc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9jb25maWcuc2NlbmUuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9jb25maWcuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9jb25maWcuc3RhY2suc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9kYXRhLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvZW5jb2Rpbmcuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL2xlZ2VuZC5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL21hcmsuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9zY2FsZS5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL3NjaGVtYS50cyIsInNyYy9zY2hlbWEvc2NoZW1hdXRpbC50cyIsInNyYy9zY2hlbWEvc29ydC5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL3RyYW5zZm9ybS5zY2hlbWEudHMiLCJzcmMvc2hvcnRoYW5kLnRzIiwic3JjL3NwZWMudHMiLCJzcmMvdGltZXVuaXQudHMiLCJzcmMvdHlwZS50cyIsInNyYy91dGlsLnRzIiwic3JjL3ZhbGlkYXRlLnRzIiwic3JjL3ZsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFTQTs7QUNBYSxxQkFBYSxHQUFHO0lBQzNCLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVO0lBQ2pELEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQVUs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QU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFFN0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDbkMsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUM7SUFDaEQsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxNQUFNLElBQUksUUFBUSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQztJQUM1RCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUM7SUFDM0QsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztBQUNILENBQUM7QUFsQmUsYUFBSyxRQWtCcEIsQ0FBQTtBQUVELDJCQUEyQixRQUFrQjtJQUMzQyxNQUFNLENBQUMsZUFBUSxDQUFDLENBQUMsY0FBTyxFQUFFLGNBQU8sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUc7UUFDbEUsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLGVBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFFRCxxQkFBNEIsUUFBa0I7SUFDNUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsS0FBSyxJQUFJLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFGZSxtQkFBVyxjQUUxQixDQUFBO0FBRUQsbUJBQTBCLFFBQWtCO0lBQzFDLE1BQU0sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFGZSxpQkFBUyxZQUV4QixDQUFBO0FBRVkseUJBQWlCLEdBQUcsbUJBQW1CLENBQUM7QUFFckQ7SUFDRSxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLG1CQUFZLEVBQUUsV0FBVyxFQUFFLHlCQUFpQixFQUFFLENBQUM7QUFDaEcsQ0FBQztBQUZlLGFBQUssUUFFcEIsQ0FBQTtBQUVELGlCQUF3QixRQUFrQjtJQUN4QyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsS0FBSyxPQUFPLENBQUM7QUFDeEMsQ0FBQztBQUZlLGVBQU8sVUFFdEIsQ0FBQTtBQUlELHFCQUE0QixRQUFrQixFQUFFLEtBQUssRUFBRSxVQUFlO0lBQWYsMEJBQWUsR0FBZixlQUFlO0lBR3BFLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUV6QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVqQixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ3pCLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxHQUFHLEtBQUssU0FBUyxDQUFDLEdBQUcsU0FBUyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDbkUsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFFRCxJQUFJLElBQUksR0FBRyxjQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDOUMsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssZUFBUSxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakIsS0FBSyxTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUMxQixLQUFLLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQzFCLEtBQUssT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDeEIsS0FBSyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyQixLQUFLLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLEtBQUssT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDeEIsS0FBSyxNQUFNO2dCQUNULElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUUvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFBQyxDQUFDO2dCQUUvQixNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVE7b0JBQ3RCLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBRUgsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBR0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRO1FBQ2xCLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBM0NlLG1CQUFXLGNBMkMxQixDQUFBO0FBRUQsZUFBc0IsUUFBa0I7SUFDdEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMseUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUNELElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxTQUFTLElBQUksUUFBUSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUM7SUFDNUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNQLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0lBQ3ZELENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQ3hCLENBQUM7QUFDSCxDQUFDO0FBVmUsYUFBSyxRQVVwQixDQUFBOzs7QUM1SEQsV0FBWSxJQUFJO0lBQ2Qsb0JBQU8sTUFBYSxVQUFBLENBQUE7SUFDcEIsbUJBQU0sS0FBWSxTQUFBLENBQUE7SUFDbEIsb0JBQU8sTUFBYSxVQUFBLENBQUE7SUFDcEIscUJBQVEsT0FBYyxXQUFBLENBQUE7SUFDdEIsb0JBQU8sTUFBYSxVQUFBLENBQUE7SUFDcEIsb0JBQU8sTUFBYSxVQUFBLENBQUE7SUFDcEIsc0JBQVMsUUFBZSxZQUFBLENBQUE7SUFDeEIsc0JBQVMsUUFBZSxZQUFBLENBQUE7QUFDMUIsQ0FBQyxFQVRXLFlBQUksS0FBSixZQUFJLFFBU2Y7QUFURCxJQUFZLElBQUksR0FBSixZQVNYLENBQUE7QUFFWSxZQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNqQixXQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNmLFlBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2pCLGFBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ25CLFlBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2pCLFlBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBRWpCLGNBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3JCLGNBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOzs7QUNPdkIsWUFBSSxHQUFHO0lBQ2hCLElBQUksRUFBRSxRQUFRO0lBQ2QsVUFBVSxFQUFFO1FBRVYsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUseUxBQXlMO1NBQ3ZNO1FBQ0QsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsOE9BQThPO1NBQzVQO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUscUdBQXFHO1NBQ25IO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsOEdBQThHO1NBQzVIO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztZQUNsQixJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUM7WUFDeEMsV0FBVyxFQUFFLDRMQUE0TDtTQUMxTTtRQUNELFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLHlLQUF5SztTQUN2TDtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLENBQUM7WUFDVixXQUFXLEVBQUUsNE1BQTRNO1NBQzFOO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsd0RBQXdEO1NBQ3RFO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsU0FBUztZQUNsQixPQUFPLEVBQUUsQ0FBQztZQUNWLFdBQVcsRUFBRSxxREFBcUQ7U0FDbkU7UUFDRCxhQUFhLEVBQUU7WUFDYixJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSxDQUFDO1lBQ1YsV0FBVyxFQUFFLHNDQUFzQztTQUNwRDtRQUNELGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLENBQUM7WUFDVixXQUFXLEVBQUUsc0NBQXNDO1NBQ3BEO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsU0FBUztZQUNsQixPQUFPLEVBQUUsQ0FBQztZQUNWLFdBQVcsRUFBRSxvQ0FBb0M7U0FDbEQ7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSx1RUFBdUU7U0FDckY7UUFDRCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxvQ0FBb0M7U0FDbEQ7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLFFBQVE7WUFDZCxXQUFXLEVBQUUsNkRBQTZEO1NBQzNFO1FBRUQsY0FBYyxFQUFFO1lBQ2QsSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsQ0FBQztZQUNWLFdBQVcsRUFBRSxpRUFBaUU7U0FDL0U7UUFDRCxjQUFjLEVBQUU7WUFDZCxJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRSxFQUFFO1lBQ1gsT0FBTyxFQUFFLENBQUM7WUFDVixXQUFXLEVBQUUsb0NBQW9DO1NBQ2xEO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSwyQkFBMkI7U0FDekM7UUFDRCxlQUFlLEVBQUU7WUFDZixJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRSxLQUFLO1lBQ2QsV0FBVyxFQUFFLG9EQUFvRDtTQUNsRTtRQUNELGNBQWMsRUFBRTtZQUNkLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLENBQUM7WUFDVixXQUFXLEVBQUUsa0dBQWtHO2dCQUMvRyxtRkFBbUY7U0FDcEY7S0FDRjtDQUNGLENBQUM7OztBQ2hKRixxQkFBMkIsU0FBUyxDQUFDLENBQUE7QUFDckMscUJBQW9CLFNBQVMsQ0FBQyxDQUFBO0FBYW5CLFdBQUcsR0FBRztJQUNmLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7SUFDM0IsT0FBTyxFQUFFLEtBQUs7SUFDZCxVQUFVLEVBQUU7UUFDVixHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxzR0FBc0c7U0FDcEg7UUFDRCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxzR0FBc0c7U0FDcEg7UUFDRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSw4RUFBOEU7U0FDNUY7UUFDRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSwrRkFBK0Y7U0FDN0c7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxrREFBa0Q7U0FDaEU7UUFDRCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSx5RUFBeUU7U0FDdkY7UUFDRCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSw0V0FBNFc7U0FDMVg7UUFDRCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSxDQUFDO1lBQ1YsV0FBVyxFQUFFLHlCQUF5QjtTQUN2QztLQUNGO0lBQ0QsY0FBYyxFQUFFLFlBQUssQ0FBQyxDQUFDLG1CQUFZLENBQUMsQ0FBQztDQUN0QyxDQUFDOzs7QUM1Q1csa0JBQVUsR0FBRztJQUN4QixJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRTtRQUNWLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLEdBQUc7U0FDYjtRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLEdBQUc7U0FDYjtRQUNELFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsU0FBUztTQUNuQjtRQUNELFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLENBQUM7WUFDVixPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU8sRUFBRSxHQUFHO1NBQ2I7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFHRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsU0FBUztTQUNoQjtRQUNELElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsZUFBZTtTQUN6QjtRQUNELFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxRQUFRO1NBQ2Y7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxPQUFPO1NBQ2Q7UUFDRCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsU0FBUztTQUNoQjtRQUNELGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRSxRQUFRO1NBQ2Y7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsZ0JBQWdCLEVBQUU7WUFDaEIsSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUsZ0ZBQWdGO1NBQzlGO0tBQ0Y7Q0FDRixDQUFDOzs7QUN6Qlcsa0JBQVUsR0FBRztJQUN4QixJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRTtRQUVWLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLG1GQUFtRjtnQkFDOUYsMERBQTBEO2dCQUMxRCx1REFBdUQ7U0FDMUQ7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLGdCQUFnQjtTQUM5QjtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLDBIQUEwSDtTQUN4STtRQUNELFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUseUJBQXlCO1NBQ3ZDO1FBRUQsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztZQUNsQixPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLFNBQVM7U0FDbkI7UUFDRCxhQUFhLEVBQUU7WUFDYixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSxDQUFDO1lBQ1YsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLENBQUM7WUFDVixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxvRkFBb0Y7U0FDbEc7UUFDRCxnQkFBZ0IsRUFBRTtZQUNoQixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxnRkFBZ0Y7U0FDOUY7UUFHRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxvRUFBb0U7Z0JBQ2hGLHVEQUF1RDtnQkFDdkQsK0dBQStHO2dCQUMvRyw0RUFBNEU7Z0JBQzVFLHNIQUFzSDtnQkFDdEgsaUZBQWlGO2dCQUNqRix1REFBdUQ7U0FDekQ7UUFHRCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBRWxCLFdBQVcsRUFBRSw0S0FBNEs7U0FDMUw7UUFDRCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxrRUFBa0U7U0FDaEY7UUFHRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsZUFBZSxDQUFDO1lBQzlFLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSwwR0FBMEc7U0FDeEg7UUFFRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxFQUFFO1lBQ1gsV0FBVyxFQUFFLDRJQUE0STtTQUMxSjtRQUdELFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLENBQUM7WUFDVixXQUFXLEVBQUUsNkJBQTZCO1NBQzNDO1FBR0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztZQUNsQixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztZQUNqQyxXQUFXLEVBQUUsbUVBQW1FO1NBQ2pGO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsNkNBQTZDO1NBQzNEO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsUUFBUTtZQUNqQixJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztZQUNqQyxXQUFXLEVBQUUsaUVBQWlFO1NBQy9FO1FBQ0QsRUFBRSxFQUFFO1lBQ0YsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsNElBQTRJO1NBQzFKO1FBQ0QsRUFBRSxFQUFFO1lBQ0YsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsMElBQTBJO1NBQ3hKO1FBQ0QsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztZQUNsQixJQUFJLEVBQUUsTUFBTTtZQUNaLFdBQVcsRUFBRSx5REFBeUQ7U0FDdkU7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxFQUFFO1lBQ1gsV0FBVyxFQUFFLDJCQUEyQjtTQUN6QztRQUVELFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLFNBQVM7WUFDbEIsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztZQUMxQixXQUFXLEVBQUUsZ0NBQWdDO1NBQzlDO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO1lBQ3hCLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSwrQkFBK0I7U0FDN0M7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxvSEFBb0g7U0FDbEk7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxvUUFBb1E7U0FDbFI7UUFFRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxnR0FBZ0c7U0FDOUc7UUFDRCxlQUFlLEVBQUU7WUFDZixJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRSxLQUFLO1lBQ2QsV0FBVyxFQUFFLDhEQUE4RDtTQUM1RTtRQUNELHNCQUFzQixFQUFFO1lBQ3RCLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLEtBQUs7WUFDZCxXQUFXLEVBQUUsNERBQTREO1NBQzFFO0tBQ0Y7Q0FDRixDQUFDOzs7QUMvT1csbUJBQVcsR0FBRztJQUN6QixJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLE9BQU87U0FDZDtRQUNELFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxRQUFRO1NBQ2Y7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxPQUFPO1NBQ2Q7UUFDRCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsU0FBUztTQUNoQjtRQUNELGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRSxRQUFRO1NBQ2Y7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsT0FBTztTQUNkO1FBQ0QsZ0JBQWdCLEVBQUU7WUFDaEIsSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUsZ0ZBQWdGO1NBQzlGO0tBQ0Y7Q0FDRixDQUFDOzs7QUN0Q0Ysb0NBQXVDLHVCQUF1QixDQUFDLENBQUE7QUFDL0QsbUNBQXFDLHNCQUFzQixDQUFDLENBQUE7QUFDNUQsb0NBQXFDLHVCQUF1QixDQUFDLENBQUE7QUFDN0Qsb0NBQXVDLHVCQUF1QixDQUFDLENBQUE7QUFrQmxELGNBQU0sR0FBRztJQUNwQixJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRTtRQWVWLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxPQUFPO1lBQ2IsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRSxTQUFTO2FBQ2hCO1lBQ0QsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLGtIQUFrSDtTQUNoSTtRQUNELFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsdUZBQXVGO1NBQ3JHO1FBR0QsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsR0FBRztZQUNaLFdBQVcsRUFBRSxpRkFBaUY7U0FDL0Y7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFdBQVcsRUFBRSw2R0FBNkc7U0FDM0g7UUFHRCxLQUFLLEVBQUUsaUNBQVc7UUFDbEIsSUFBSSxFQUFFLCtCQUFVO1FBQ2hCLElBQUksRUFBRSxnQ0FBVTtRQUNoQixLQUFLLEVBQUUsaUNBQVc7S0FDbkI7Q0FDRixDQUFDOzs7QUNsRVcsbUJBQVcsR0FBRztJQUN6QixJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO0lBQzNCLE9BQU8sRUFBRSxFQUFFO0lBQ1gsV0FBVyxFQUFFLGdEQUFnRDtJQUM3RCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixLQUFLLEVBQUUsQ0FBQztvQkFDTixJQUFJLEVBQUUsUUFBUTtvQkFDZCxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDO2lCQUNsQyxFQUFDO29CQUNBLElBQUksRUFBRSxPQUFPO29CQUNiLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUM7aUJBQ3hCLENBQUM7WUFDRixXQUFXLEVBQUUsc0JBQXNCO2dCQUNqQyxrRUFBa0U7Z0JBQ2xFLDZEQUE2RDtnQkFDN0QsMENBQTBDO1NBQzdDO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQztTQUd0QztLQUNGO0NBQ0YsQ0FBQzs7O0FDeEJTLFlBQUksR0FBRztJQUNoQixJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRTtRQUVWLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7WUFDNUIsT0FBTyxFQUFFLE1BQU07U0FDaEI7UUFDRCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsbURBQW1EO1lBQ2hFLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxvQkFBb0IsRUFBRSxJQUFJO2FBQzNCO1NBQ0Y7S0FDRjtDQUNGLENBQUM7OztBQzdCRixnQ0FBa0ksbUJBQW1CLENBQUMsQ0FBQTtBQWdCekksZ0JBQVEsR0FBRztJQUN0QixJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRTtRQUNWLENBQUMsRUFBRSxrQ0FBZ0I7UUFDbkIsQ0FBQyxFQUFFLGtDQUFnQjtRQUNuQixHQUFHLEVBQUUsK0JBQWE7UUFDbEIsTUFBTSxFQUFFLCtCQUFhO1FBQ3JCLElBQUksRUFBRSw4QkFBWTtRQUNsQixLQUFLLEVBQUUsK0JBQWE7UUFDcEIsS0FBSyxFQUFFLCtCQUFhO1FBQ3BCLElBQUksRUFBRSxnQ0FBYztRQUNwQixJQUFJLEVBQUUsOEJBQVk7UUFDbEIsTUFBTSxFQUFFLGdDQUFjO1FBQ3RCLEtBQUssRUFBRSw4QkFBWTtLQUNwQjtDQUNGLENBQUM7OztBQy9CRiw0QkFBeUIsZUFBZSxDQUFDLENBQUE7QUFDekMsMkJBQXVCLGNBQWMsQ0FBQyxDQUFBO0FBQ3RDLDhCQUE2QixpQkFBaUIsQ0FBQyxDQUFBO0FBQy9DLDZCQUFvRCxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3JFLDRCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUV6QywwQkFBNEIsY0FBYyxDQUFDLENBQUE7QUFDM0MscUJBQStCLFNBQVMsQ0FBQyxDQUFBO0FBQ3pDLDJCQUF3QixjQUFjLENBQUMsQ0FBQTtBQUN2Qyx5QkFBd0IsYUFBYSxDQUFDLENBQUE7QUFDdEMscUJBQTZELFNBQVMsQ0FBQyxDQUFBO0FBNkIxRCxpQkFBUyxHQUFHO0lBQ3ZCLElBQUksRUFBRSxRQUFRO0lBQ2QsSUFBSSxFQUFFLHlCQUFhO0lBQ25CLGNBQWMsRUFBRTtRQUNkLFlBQVksRUFBRSx5QkFBYTtRQUMzQixPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUMsS0FBSyxFQUFDLEtBQUssQ0FBQztRQUMvQixPQUFPLEVBQUUsRUFBRTtRQUNYLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUMxQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7S0FDZDtJQUNELGNBQWMsRUFBRSxZQUFLLENBQUMsQ0FBQyxtQkFBWSxFQUFFLGNBQU8sRUFBRSxjQUFPLEVBQUUsZUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0NBQ3RFLENBQUM7QUFFRixJQUFNLFFBQVEsR0FBRztJQUNmLElBQUksRUFBRSxRQUFRO0lBQ2QsVUFBVSxFQUFFO1FBQ1YsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLFFBQVE7U0FDZjtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7U0FDM0I7UUFDRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxDQUFDLGNBQU8sRUFBRSxjQUFPLEVBQUUsbUJBQVksRUFBRSxlQUFRLENBQUM7U0FDakQ7UUFDRCxHQUFHLEVBQUUsZ0JBQUc7UUFDUixRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxvQkFBUztZQUNmLGNBQWMsRUFBRSxZQUFLLENBQUMsQ0FBQyxlQUFRLENBQUMsQ0FBQztTQUNsQztRQUNELFNBQVMsRUFBRSxpQkFBUztRQUNwQixJQUFJLEVBQUUsa0JBQUk7S0FDWDtDQUNGLENBQUM7QUFFRixJQUFNLGlCQUFpQixHQUFHLHNCQUFTLENBQUMsZ0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUN2RCxVQUFVLEVBQUU7UUFDVixLQUFLLEVBQUUsMkJBQVk7S0FDcEI7Q0FDRixDQUFDLENBQUM7QUFFVSx3QkFBZ0IsR0FBRyxzQkFBUyxDQUFDLGdCQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRTtJQUN0RSxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO0lBQzNCLFVBQVUsRUFBRTtRQUNWLEtBQUssRUFBRTtZQUVMLFVBQVUsRUFBRTtnQkFDVixPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO2FBQ3RCO1NBQ0Y7UUFDRCxJQUFJLEVBQUUsa0JBQUk7S0FDWDtDQUNGLENBQUMsQ0FBQztBQUVVLHFCQUFhLEdBQUcsc0JBQVMsQ0FBQyxnQkFBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7SUFDbkUsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLHNCQUFNO0tBQ2Y7Q0FDRixDQUFDLENBQUM7QUFFVSxvQkFBWSxHQUFHLHFCQUFhLENBQUM7QUFJN0Isc0JBQWMsR0FBRztJQUM1QixPQUFPLEVBQUUsU0FBUztJQUNsQixLQUFLLEVBQUUsQ0FBQyxnQkFBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzNCLElBQUksRUFBRSxPQUFPO1lBQ2IsS0FBSyxFQUFFLGdCQUFTLENBQUMsUUFBUSxDQUFDO1NBQzNCLENBQUM7Q0FDSCxDQUFDO0FBSVcsb0JBQVksR0FBRyxzQkFBUyxDQUFDLGdCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7SUFDekQsVUFBVSxFQUFFO1FBQ1YsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsS0FBSztTQUNmO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFJSCxJQUFNLHdCQUF3QixHQUFHLHNCQUFTLENBQUMsZ0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUM5RCxVQUFVLEVBQUU7UUFDVixLQUFLLEVBQUUsK0JBQWdCO0tBQ3hCO0NBQ0YsQ0FBQyxDQUFDO0FBRVUscUJBQWEsR0FBSSxzQkFBUyxDQUFDLGdCQUFTLENBQUMsd0JBQXdCLENBQUMsRUFBRTtJQUMzRSxVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsc0JBQU07S0FDZjtDQUNGLENBQUMsQ0FBQztBQUVVLHFCQUFhLEdBQUcsc0JBQVMsQ0FBQyxnQkFBUyxDQUFDLHdCQUF3QixDQUFDLEVBQUU7SUFDMUUsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztJQUMzQixVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsa0JBQUk7S0FDWDtDQUNGLENBQUMsQ0FBQzs7O0FDcElRLGNBQU0sR0FBRztJQUNsQixPQUFPLEVBQUUsSUFBSTtJQUNiLFdBQVcsRUFBRSw0RUFBNEU7SUFDekYsS0FBSyxFQUFFLENBQUM7WUFDTixJQUFJLEVBQUUsUUFBUTtZQUNkLFVBQVUsRUFBRTtnQkFDVixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLFFBQVE7b0JBQ2QsT0FBTyxFQUFFLFNBQVM7b0JBQ2xCLFdBQVcsRUFBRSxpSkFBaUo7aUJBQy9KO2dCQUNELEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxPQUFPLEVBQUUsU0FBUztvQkFDbEIsV0FBVyxFQUFFLHlFQUF5RTtpQkFDdkY7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRO29CQUNkLE9BQU8sRUFBRSxTQUFTO29CQUNsQixXQUFXLEVBQUUsbUZBQW1GO2lCQUNqRztnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLFNBQVM7b0JBQ2xCLFdBQVcsRUFBRSwyQ0FBMkM7aUJBQ3pEO2dCQUNELFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsUUFBUTtvQkFDZCxPQUFPLEVBQUUsU0FBUztvQkFDbEIsV0FBVyxFQUFFLGdFQUFnRTtpQkFDOUU7Z0JBR0QsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxTQUFTO29CQUNmLE9BQU8sRUFBRSxLQUFLO29CQUNkLFdBQVcsRUFBRSw4REFBOEQ7aUJBQzVFO2FBQ0Y7U0FDRixFQUFFO1lBQ0QsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQztDQUNILENBQUM7OztBQ3JEUyxZQUFJLEdBQUc7SUFDaEIsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDO0NBQzNFLENBQUM7OztBQ0hGLHFCQUF3QyxTQUFTLENBQUMsQ0FBQTtBQUNsRCwyQkFBd0IsY0FBYyxDQUFDLENBQUE7QUFDdkMscUJBQXFDLFNBQVMsQ0FBQyxDQUFBO0FBdUIvQyxJQUFJLEtBQUssR0FBRztJQUNWLElBQUksRUFBRSxRQUFRO0lBRWQsVUFBVSxFQUFFO1FBRVYsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQztZQUM3RCxPQUFPLEVBQUUsU0FBUztZQUNsQixjQUFjLEVBQUUsWUFBSyxDQUFDLENBQUMsbUJBQVksQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsTUFBTSxFQUFFO1lBQ04sT0FBTyxFQUFFLFNBQVM7WUFDbEIsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztZQUN6QixXQUFXLEVBQUUsaVRBQWlUO1NBQy9UO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLFNBQVM7WUFDbEIsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUM7WUFDbkMsV0FBVyxFQUFFLHliQUF5YjtTQUN2YztRQUNELEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUFFLHdHQUF3RztTQUN0SDtLQUNGO0NBQ0YsQ0FBQztBQUdGLElBQUksaUJBQWlCLEdBQUc7SUFDdEIsVUFBVSxFQUFFO1FBQ1YsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBRUQsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsU0FBUztTQUVuQjtRQUNELE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLHNzQkFBc3NCO1NBQ3B0QjtLQUNGO0NBQ0YsQ0FBQztBQUVGLElBQUksaUJBQWlCLEdBQUc7SUFDdEIsVUFBVSxFQUFFO1FBRVYsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSxzR0FBc0c7U0FDcEg7UUFDRCxJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsU0FBUztZQUNsQixLQUFLLEVBQUU7Z0JBQ0w7b0JBQ0UsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsV0FBVyxFQUFFLHlHQUF5RztpQkFDdkgsRUFBQztvQkFDQSxJQUFJLEVBQUUsUUFBUTtvQkFDZCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7b0JBQ2xFLFdBQVcsRUFBRSw4UUFBOFE7aUJBQzVSO2FBQ0Y7WUFFRCxjQUFjLEVBQUUsWUFBSyxDQUFDLENBQUMsbUJBQVksRUFBRSxlQUFRLENBQUMsQ0FBQztZQUMvQyxXQUFXLEVBQUUsRUFBRTtTQUNoQjtRQUdELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLDZGQUE2RjtTQUMzRztRQUNELElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUFFLGtJQUFrSTtZQUMvSSxPQUFPLEVBQUUsU0FBUztZQUNsQixjQUFjLEVBQUUsWUFBSyxDQUFDLENBQUMsbUJBQVksRUFBRSxlQUFRLENBQUMsQ0FBQztTQUNoRDtRQUdELFlBQVksRUFBRTtZQUNaLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLEtBQUs7WUFDZCxXQUFXLEVBQUUsd0RBQXdEO2dCQUN4RCxzQ0FBc0M7Z0JBQ3RDLHVEQUF1RDtnQkFDdkQsd0RBQXdEO1NBQ3RFO0tBQ0Y7Q0FDRixDQUFDO0FBRVMsd0JBQWdCLEdBQUcsc0JBQVMsQ0FBQyxnQkFBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDOUQsb0JBQVksR0FBRyxzQkFBUyxDQUFDLGdCQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQzs7O0FDN0h4RixJQUFZLFVBQVUsV0FBTSxjQUFjLENBQUMsQ0FBQTtBQUMzQyw0QkFBbUIsZUFBZSxDQUFDLENBQUE7QUFDbkMsOEJBQTZCLGlCQUFpQixDQUFDLENBQUE7QUFDL0MsNEJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLGdDQUFpQyxtQkFBbUIsQ0FBQyxDQUFBO0FBRXJELGlDQUFtQyxvQkFBb0IsQ0FBQyxDQUFBO0FBYXhELGdDQUF3QixtQkFBbUIsQ0FBQztBQUFwQyxnREFBb0M7QUFFakMsWUFBSSxHQUFHLFVBQVUsQ0FBQztBQUdsQixjQUFNLEdBQUc7SUFDbEIsT0FBTyxFQUFFLHlDQUF5QztJQUNsRCxXQUFXLEVBQUUsb0NBQW9DO0lBQ2pELElBQUksRUFBRSxRQUFRO0lBQ2QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQztJQUM5QixVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsUUFBUTtZQUNkLFdBQVcsRUFBRSwwRkFBMEY7U0FDeEc7UUFDRCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsUUFBUTtTQUNmO1FBQ0QsSUFBSSxFQUFFLGtCQUFJO1FBQ1YsU0FBUyxFQUFFLDRCQUFTO1FBQ3BCLElBQUksRUFBRSxrQkFBSTtRQUNWLFFBQVEsRUFBRSwwQkFBUTtRQUNsQixNQUFNLEVBQUUsc0JBQU07S0FDZjtDQUNGLENBQUM7QUFHRjtJQUNFLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGNBQU0sQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFGZSxtQkFBVyxjQUUxQixDQUFBO0FBQUEsQ0FBQzs7O0FDbERGLElBQVksSUFBSSxXQUFNLFNBQVMsQ0FBQyxDQUFBO0FBRWhDLGlCQUFpQixHQUFHO0lBQ2xCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUFBLENBQUM7QUFFRixnQkFBdUIsUUFBUSxFQUFFLE1BQU07SUFDckMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUZlLGNBQU0sU0FFckIsQ0FBQTtBQUFBLENBQUM7QUFHRixxQkFBNEIsTUFBTTtJQUNoQyxJQUFJLEdBQUcsQ0FBQztJQUNSLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMvQixHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN4RCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNwQyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLEdBQUcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDdkIsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUM7QUF0QmUsbUJBQVcsY0FzQjFCLENBQUE7QUFBQSxDQUFDO0FBR0Ysa0JBQXlCLFFBQVEsRUFBRSxRQUFRO0lBQ3pDLElBQUksT0FBTyxHQUFRLEVBQUUsQ0FBQztJQUN0QixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDMUIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV6QixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN6RCxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3BCLENBQUM7Z0JBQ0gsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUV0QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUM5QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7NEJBQ2pCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0NBQ3BDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUN0QixLQUFLLEdBQUcsS0FBSyxDQUFDO29DQUNkLEtBQUssQ0FBQztnQ0FDUixDQUFDOzRCQUNILENBQUM7NEJBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQ0FDVixRQUFRLENBQUM7NEJBQ1gsQ0FBQzt3QkFDSCxDQUFDO29CQUNILENBQUM7b0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDdEIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUN0QixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBckNlLGdCQUFRLFdBcUN2QixDQUFBO0FBQUEsQ0FBQztBQUVGLG1CQUEwQixJQUFJO0lBQUUsYUFBYTtTQUFiLFdBQWEsQ0FBYixzQkFBYSxDQUFiLElBQWE7UUFBYiw0QkFBYTs7SUFDM0MsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNwQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFMZSxpQkFBUyxZQUt4QixDQUFBO0FBQUEsQ0FBQztBQUdGLG9CQUFvQixJQUFJLEVBQUUsR0FBRztJQUMzQixFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixRQUFRLENBQUM7UUFDWCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDekIsUUFBUSxDQUFDO1FBQ1gsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7OztBQ3hHRCwwQkFBNEIsY0FBYyxDQUFDLENBQUE7QUFDM0MscUJBQW9DLFNBQVMsQ0FBQyxDQUFBO0FBQzlDLHFCQUFvQixTQUFTLENBQUMsQ0FBQTtBQVFuQixZQUFJLEdBQUc7SUFDaEIsT0FBTyxFQUFFLFdBQVc7SUFDcEIsY0FBYyxFQUFFLFlBQUssQ0FBQyxDQUFDLG1CQUFZLEVBQUUsY0FBTyxDQUFDLENBQUM7SUFDOUMsS0FBSyxFQUFFO1FBQ0w7WUFDRSxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDO1NBQzlDO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsUUFBUTtZQUNkLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7WUFDekIsVUFBVSxFQUFFO2dCQUNWLEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxXQUFXLEVBQUUsbUNBQW1DO2lCQUNqRDtnQkFDRCxFQUFFLEVBQUU7b0JBQ0YsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsSUFBSSxFQUFFLHlCQUFhO29CQUNuQixXQUFXLEVBQUUsbUNBQW1DO2lCQUNqRDtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQztpQkFDbEM7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDOzs7QUMxQlcsaUJBQVMsR0FBRztJQUN2QixJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRTtRQUNWLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLDBNQUEwTTtTQUN4TjtRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLGtHQUFrRztTQUNoSDtRQUNELFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLGtHQUFrRztZQUMvRyxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsVUFBVSxFQUFFO29CQUNWLEtBQUssRUFBRTt3QkFDTCxJQUFJLEVBQUUsUUFBUTt3QkFDZCxXQUFXLEVBQUUseURBQXlEO3FCQUN2RTtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLFFBQVE7d0JBQ2QsV0FBVyxFQUFFLHFIQUFxSDtxQkFDbkk7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDOzs7QUN0Q0YsMEJBQTRCLGFBQWEsQ0FBQyxDQUFBO0FBQzFDLHlCQUF3QixZQUFZLENBQUMsQ0FBQTtBQUNyQyxxQkFBK0MsUUFBUSxDQUFDLENBQUE7QUFDeEQsSUFBWSxVQUFVLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFDekMscUJBQW1CLFFBQVEsQ0FBQyxDQUFBO0FBRWYsYUFBSyxHQUFHLEdBQUcsQ0FBQztBQUNaLGNBQU0sR0FBRyxHQUFHLENBQUM7QUFDYixZQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ1gsWUFBSSxHQUFHLEdBQUcsQ0FBQztBQUd4QixpQkFBd0IsSUFBVTtJQUNoQyxNQUFNLENBQUMsTUFBTSxHQUFHLGNBQU0sR0FBRyxJQUFJLENBQUMsSUFBSTtRQUNoQyxhQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBSGUsZUFBTyxVQUd0QixDQUFBO0FBRUQsZUFBc0IsU0FBaUIsRUFBRSxJQUFLLEVBQUUsTUFBTztJQUNyRCxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLGFBQUssQ0FBQyxFQUNoQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFDNUMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxDQUFDLENBQUM7SUFFOUMsSUFBSSxJQUFJLEdBQVE7UUFDZCxJQUFJLEVBQUUsV0FBSSxDQUFDLElBQUksQ0FBQztRQUNoQixRQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDO0lBRUYsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQWpCZSxhQUFLLFFBaUJwQixDQUFBO0FBRUQseUJBQWdDLFFBQWtCO0lBQ2hELE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFTLFFBQVEsRUFBRSxPQUFPO1FBQ3hELE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBTSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLENBQUM7QUFDakIsQ0FBQztBQUplLHVCQUFlLGtCQUk5QixDQUFBO0FBRUQsdUJBQThCLGlCQUF5QjtJQUNyRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGFBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFTLENBQUMsRUFBRSxDQUFDO1FBQ3hELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLEVBQ3ZCLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQ3pCLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUM7QUFUZSxxQkFBYSxnQkFTNUIsQ0FBQTtBQUVELHlCQUFnQyxRQUFrQjtJQUNoRCxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLEdBQUcsWUFBSSxHQUFHLEVBQUUsQ0FBQztRQUMxRCxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsR0FBRyxZQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ25ELENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsWUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNsQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEdBQUcsWUFBSSxHQUFHLGlCQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFMZSx1QkFBZSxrQkFLOUIsQ0FBQTtBQUVELDBCQUFpQyxTQUFxQixFQUFFLEtBQWE7SUFBYixxQkFBYSxHQUFiLHFCQUFhO0lBQ25FLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRmUsd0JBQWdCLG1CQUUvQixDQUFBO0FBRUQsdUJBQThCLGlCQUF5QjtJQUNyRCxJQUFJLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsWUFBSSxDQUFDLENBQUM7SUFFMUMsSUFBSSxRQUFRLEdBQWE7UUFDdkIsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7UUFDdEIsSUFBSSxFQUFFLDJCQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUM1QyxDQUFDO0lBR0YsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHlCQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLEdBQUcseUJBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxRQUFRLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxRQUFRLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUN2QixDQUFDO1lBQ0QsUUFBUSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDdkIsS0FBSyxDQUFDO1FBQ1IsQ0FBQztJQUNILENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsb0JBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMxQyxJQUFJLEVBQUUsR0FBRyxvQkFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0QsUUFBUSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsRSxRQUFRLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUM7UUFDUixDQUFDO0lBQ0gsQ0FBQztJQUdELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxRQUFRLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFyQ2UscUJBQWEsZ0JBcUM1QixDQUFBOzs7QUN0R0Qsc0JBQW9CLGlCQUFpQixDQUFDLENBQUE7QUFDdEMsd0JBQTJCLFdBQVcsQ0FBQyxDQUFBO0FBQ3ZDLElBQVksVUFBVSxXQUFNLFlBQVksQ0FBQyxDQUFBO0FBQ3pDLHFCQUF3QixRQUFRLENBQUMsQ0FBQTtBQUNqQyxxQkFBd0IsUUFBUSxDQUFDLENBQUE7QUFJakMsMkJBQWtDLElBQVU7SUFFMUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFIZSx5QkFBaUIsb0JBR2hDLENBQUE7QUFFRCxtQkFBMEIsSUFBVTtJQUVsQyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUhlLGlCQUFTLFlBR3hCLENBQUE7QUFBQSxDQUFDO0FBRUYsc0JBQTZCLElBQVU7SUFFckMsTUFBTSxDQUFDLElBQUksYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBSGUsb0JBQVksZUFHM0IsQ0FBQTtBQUVELGlCQUF3QixJQUFVO0lBQ2hDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxlQUFLLENBQUMsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsZUFBSyxDQUFDLENBQUM7UUFDbkYsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFVBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQUksQ0FBQztRQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQztRQUM5QyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBTGUsZUFBTyxVQUt0QixDQUFBO0FBR0QsbUJBQTBCLElBQVU7SUFDbEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFDeEIsUUFBUSxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN0QixRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdEIsUUFBUSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQzdCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVRlLGlCQUFTLFlBU3hCLENBQUE7OztBQzdDWSxpQkFBUyxHQUFHO0lBQ3ZCLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxjQUFjO0lBQzdFLFdBQVcsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxVQUFVO0lBQ25FLG1CQUFtQixFQUFFLDBCQUEwQixFQUFFLGNBQWM7SUFDL0QscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUscUJBQXFCO0NBQy9ELENBQUM7OztBQ0hGLFdBQVksSUFBSTtJQUNkLDRCQUFlLGNBQXFCLGtCQUFBLENBQUE7SUFDcEMsdUJBQVUsU0FBZ0IsYUFBQSxDQUFBO0lBQzFCLHdCQUFXLFVBQWlCLGNBQUEsQ0FBQTtJQUM1Qix1QkFBVSxTQUFnQixhQUFBLENBQUE7QUFDNUIsQ0FBQyxFQUxXLFlBQUksS0FBSixZQUFJLFFBS2Y7QUFMRCxJQUFZLElBQUksR0FBSixZQUtYLENBQUE7QUFFWSxvQkFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDakMsZUFBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDdkIsZ0JBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3pCLGVBQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBTXZCLGtCQUFVLEdBQUc7SUFDeEIsWUFBWSxFQUFFLEdBQUc7SUFDakIsUUFBUSxFQUFFLEdBQUc7SUFDYixPQUFPLEVBQUUsR0FBRztJQUNaLE9BQU8sRUFBRSxHQUFHO0NBQ2IsQ0FBQztBQUtXLDRCQUFvQixHQUFHO0lBQ2xDLENBQUMsRUFBRSxvQkFBWTtJQUNmLENBQUMsRUFBRSxnQkFBUTtJQUNYLENBQUMsRUFBRSxlQUFPO0lBQ1YsQ0FBQyxFQUFFLGVBQU87Q0FDWCxDQUFDO0FBT0YscUJBQTRCLElBQVU7SUFDcEMsSUFBTSxVQUFVLEdBQVEsSUFBSSxDQUFDO0lBQzdCLE1BQU0sQ0FBQyw0QkFBb0IsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDOUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ2xDLENBQUM7QUFKZSxtQkFBVyxjQUkxQixDQUFBOzs7QUMxQ0QscUJBQWdGLGtCQUFrQixDQUFDO0FBQTNGLDJCQUFJO0FBQUUsK0JBQU07QUFBRSxxQ0FBUztBQUFFLGlDQUFPO0FBQUUsMkJBQUk7QUFBRSxtQ0FBUTtBQUFFLDZCQUFLO0FBQUUsbUNBQWtDO0FBQ25HLHlCQUFvQixzQkFBc0IsQ0FBQztBQUFuQyxpQ0FBbUM7QUFFM0Msa0JBQTRCLEtBQWUsRUFBRSxJQUFPO0lBQ2xELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFGZSxnQkFBUSxXQUV2QixDQUFBO0FBRUQsaUJBQXdCLEdBQUcsRUFBRSxDQUFzQixFQUFFLE9BQU87SUFDMUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDaEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsQyxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBVmUsZUFBTyxVQVV0QixDQUFBO0FBRUQsZ0JBQXVCLEdBQUcsRUFBRSxDQUF5QixFQUFFLElBQUksRUFBRSxPQUFRO0lBQ25FLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDL0MsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUFYZSxjQUFNLFNBV3JCLENBQUE7QUFFRCxhQUFvQixHQUFHLEVBQUUsQ0FBc0IsRUFBRSxPQUFRO0lBQ3ZELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvQyxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztBQUNILENBQUM7QUFaZSxXQUFHLE1BWWxCLENBQUE7QUFFRCxhQUF1QixHQUFhLEVBQUUsQ0FBNEI7SUFDaEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVJlLFdBQUcsTUFRbEIsQ0FBQTtBQUVELGFBQXVCLEdBQWEsRUFBRSxDQUE0QjtJQUNoRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDVixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFSZSxXQUFHLE1BUWxCLENBQUE7QUFHRCxJQUFPLEtBQUssV0FBVyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hELGlCQUF3QixLQUFLLEVBQUUsT0FBTztJQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ1gsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1FBQ2QsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1FBQ2QsT0FBTyxFQUFFLE9BQU87S0FDakIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQU5lLGVBQU8sVUFNdEIsQ0FBQTtBQUVELGVBQXNCLE9BQVk7SUFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZlLGFBQUssUUFFcEIsQ0FBQTs7O0FDNUVELHFCQUFvQixRQUFRLENBQUMsQ0FBQTtBQUM3QixxQkFBa0IsUUFBUSxDQUFDLENBQUE7QUFVZCxvQ0FBNEIsR0FBdUI7SUFDOUQsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQ2QsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNoQixJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0NBQ2pCLENBQUM7QUFXVyxzQ0FBOEIsR0FBd0I7SUFDakUsR0FBRyxFQUFFLFlBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xFLElBQUksRUFBRSxZQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNELElBQUksRUFBRSxZQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNELElBQUksRUFBRSxZQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNELE1BQU0sRUFBRSxZQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRSxNQUFNLEVBQUUsWUFBSyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDckUsS0FBSyxFQUFFLFlBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3RSxJQUFJLEVBQUUsWUFBSyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0NBQ3hELENBQUM7QUFrQkYsaUNBQXdDLElBQVUsRUFDaEQsa0JBQXFFLEVBQ3JFLG1CQUF5RTtJQUR6RSxrQ0FBcUUsR0FBckUseURBQXFFO0lBQ3JFLG1DQUF5RSxHQUF6RSw0REFBeUU7SUFFekUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzdCLElBQUksZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsSUFBSSxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVsRCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyw2QkFBNkIsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELGdCQUFnQixHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbkMsQ0FBQztJQUNILENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLHFCQUFxQixHQUFHLE9BQU87Z0JBQ3BDLHFDQUFxQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7UUFDeEQsQ0FBQztJQUNILENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssVUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQztJQUN4QyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUE1QmUsK0JBQXVCLDBCQTRCdEMsQ0FBQTs7O0FDckZELElBQVksS0FBSyxXQUFNLE9BQU8sQ0FBQyxDQUFBO0FBQy9CLElBQVksU0FBUyxXQUFNLFdBQVcsQ0FBQyxDQUFBO0FBQ3ZDLElBQVksTUFBTSxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQ2pDLElBQVksVUFBVSxXQUFNLFlBQVksQ0FBQyxDQUFBO0FBQ3pDLElBQVksVUFBVSxXQUFNLFlBQVksQ0FBQyxDQUFBO0FBQ3pDLElBQVksU0FBUyxXQUFNLG1CQUFtQixDQUFDLENBQUE7QUFDL0MsSUFBWSxRQUFRLFdBQU0saUJBQWlCLENBQUMsQ0FBQTtBQUM1QyxJQUFZLFdBQVcsV0FBTSxhQUFhLENBQUMsQ0FBQTtBQUMzQyxJQUFZLE1BQU0sV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUNqQyxJQUFZLFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUN6QyxJQUFZLE1BQU0sV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUNqQyxJQUFZLFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUN6QyxJQUFZLE1BQU0sV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUVwQixXQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osZUFBTyxHQUFHLFNBQVMsQ0FBQztBQUNwQixlQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUM1QixZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFDdEIsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFDdEIsY0FBTSxHQUFHLFFBQVEsQ0FBQztBQUNsQixpQkFBUyxHQUFHLFdBQVcsQ0FBQztBQUN4QixZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFDdEIsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLFlBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxnQkFBUSxHQUFHLFVBQVUsQ0FBQztBQUV0QixlQUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoJ2QzLXRpbWUnLCBbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICBmYWN0b3J5KChnbG9iYWwuZDNfdGltZSA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICB2YXIgdDAgPSBuZXcgRGF0ZTtcbiAgdmFyIHQxID0gbmV3IERhdGU7XG4gIGZ1bmN0aW9uIG5ld0ludGVydmFsKGZsb29yaSwgb2Zmc2V0aSwgY291bnQsIGZpZWxkKSB7XG5cbiAgICBmdW5jdGlvbiBpbnRlcnZhbChkYXRlKSB7XG4gICAgICByZXR1cm4gZmxvb3JpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSkpLCBkYXRlO1xuICAgIH1cblxuICAgIGludGVydmFsLmZsb29yID0gaW50ZXJ2YWw7XG5cbiAgICBpbnRlcnZhbC5yb3VuZCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHZhciBkMCA9IG5ldyBEYXRlKCtkYXRlKSxcbiAgICAgICAgICBkMSA9IG5ldyBEYXRlKGRhdGUgLSAxKTtcbiAgICAgIGZsb29yaShkMCksIGZsb29yaShkMSksIG9mZnNldGkoZDEsIDEpO1xuICAgICAgcmV0dXJuIGRhdGUgLSBkMCA8IGQxIC0gZGF0ZSA/IGQwIDogZDE7XG4gICAgfTtcblxuICAgIGludGVydmFsLmNlaWwgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICByZXR1cm4gZmxvb3JpKGRhdGUgPSBuZXcgRGF0ZShkYXRlIC0gMSkpLCBvZmZzZXRpKGRhdGUsIDEpLCBkYXRlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5vZmZzZXQgPSBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICByZXR1cm4gb2Zmc2V0aShkYXRlID0gbmV3IERhdGUoK2RhdGUpLCBzdGVwID09IG51bGwgPyAxIDogTWF0aC5mbG9vcihzdGVwKSksIGRhdGU7XG4gICAgfTtcblxuICAgIGludGVydmFsLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICAgIHZhciByYW5nZSA9IFtdO1xuICAgICAgc3RhcnQgPSBuZXcgRGF0ZShzdGFydCAtIDEpO1xuICAgICAgc3RvcCA9IG5ldyBEYXRlKCtzdG9wKTtcbiAgICAgIHN0ZXAgPSBzdGVwID09IG51bGwgPyAxIDogTWF0aC5mbG9vcihzdGVwKTtcbiAgICAgIGlmICghKHN0YXJ0IDwgc3RvcCkgfHwgIShzdGVwID4gMCkpIHJldHVybiByYW5nZTsgLy8gYWxzbyBoYW5kbGVzIEludmFsaWQgRGF0ZVxuICAgICAgb2Zmc2V0aShzdGFydCwgMSksIGZsb29yaShzdGFydCk7XG4gICAgICBpZiAoc3RhcnQgPCBzdG9wKSByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpO1xuICAgICAgd2hpbGUgKG9mZnNldGkoc3RhcnQsIHN0ZXApLCBmbG9vcmkoc3RhcnQpLCBzdGFydCA8IHN0b3ApIHJhbmdlLnB1c2gobmV3IERhdGUoK3N0YXJ0KSk7XG4gICAgICByZXR1cm4gcmFuZ2U7XG4gICAgfTtcblxuICAgIGludGVydmFsLmZpbHRlciA9IGZ1bmN0aW9uKHRlc3QpIHtcbiAgICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIHdoaWxlIChmbG9vcmkoZGF0ZSksICF0ZXN0KGRhdGUpKSBkYXRlLnNldFRpbWUoZGF0ZSAtIDEpO1xuICAgICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgICB3aGlsZSAoLS1zdGVwID49IDApIHdoaWxlIChvZmZzZXRpKGRhdGUsIDEpLCAhdGVzdChkYXRlKSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKGNvdW50KSB7XG4gICAgICBpbnRlcnZhbC5jb3VudCA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgdDAuc2V0VGltZSgrc3RhcnQpLCB0MS5zZXRUaW1lKCtlbmQpO1xuICAgICAgICBmbG9vcmkodDApLCBmbG9vcmkodDEpO1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihjb3VudCh0MCwgdDEpKTtcbiAgICAgIH07XG5cbiAgICAgIGludGVydmFsLmV2ZXJ5ID0gZnVuY3Rpb24oc3RlcCkge1xuICAgICAgICBzdGVwID0gTWF0aC5mbG9vcihzdGVwKTtcbiAgICAgICAgcmV0dXJuICFpc0Zpbml0ZShzdGVwKSB8fCAhKHN0ZXAgPiAwKSA/IG51bGxcbiAgICAgICAgICAgIDogIShzdGVwID4gMSkgPyBpbnRlcnZhbFxuICAgICAgICAgICAgOiBpbnRlcnZhbC5maWx0ZXIoZmllbGRcbiAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGZpZWxkKGQpICUgc3RlcCA9PT0gMDsgfVxuICAgICAgICAgICAgICAgIDogZnVuY3Rpb24oZCkgeyByZXR1cm4gaW50ZXJ2YWwuY291bnQoMCwgZCkgJSBzdGVwID09PSAwOyB9KTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVydmFsO1xuICB9O1xuXG4gIHZhciBtaWxsaXNlY29uZCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIC8vIG5vb3BcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZCAtIHN0YXJ0O1xuICB9KTtcblxuICAvLyBBbiBvcHRpbWl6ZWQgaW1wbGVtZW50YXRpb24gZm9yIHRoaXMgc2ltcGxlIGNhc2UuXG4gIG1pbGxpc2Vjb25kLmV2ZXJ5ID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBNYXRoLmZsb29yKGspO1xuICAgIGlmICghaXNGaW5pdGUoaykgfHwgIShrID4gMCkpIHJldHVybiBudWxsO1xuICAgIGlmICghKGsgPiAxKSkgcmV0dXJuIG1pbGxpc2Vjb25kO1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldFRpbWUoTWF0aC5mbG9vcihkYXRlIC8gaykgKiBrKTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogayk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyBrO1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBzZWNvbmQgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRNaWxsaXNlY29uZHMoMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMWUzKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMWUzO1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0U2Vjb25kcygpO1xuICB9KTtcblxuICB2YXIgbWludXRlID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0U2Vjb25kcygwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiA2ZTQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2ZTQ7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRNaW51dGVzKCk7XG4gIH0pO1xuXG4gIHZhciBob3VyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0TWludXRlcygwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAzNmU1KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMzZlNTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldEhvdXJzKCk7XG4gIH0pO1xuXG4gIHZhciBkYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDg2NGU1O1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0RGF0ZSgpIC0gMTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gd2Vla2RheShpKSB7XG4gICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAoZGF0ZS5nZXREYXkoKSArIDcgLSBpKSAlIDcpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXAgKiA3KTtcbiAgICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICByZXR1cm4gKGVuZCAtIHN0YXJ0IC0gKGVuZC5nZXRUaW1lem9uZU9mZnNldCgpIC0gc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgKiA2ZTQpIC8gNjA0OGU1O1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHN1bmRheSA9IHdlZWtkYXkoMCk7XG4gIHZhciBtb25kYXkgPSB3ZWVrZGF5KDEpO1xuICB2YXIgdHVlc2RheSA9IHdlZWtkYXkoMik7XG4gIHZhciB3ZWRuZXNkYXkgPSB3ZWVrZGF5KDMpO1xuICB2YXIgdGh1cnNkYXkgPSB3ZWVrZGF5KDQpO1xuICB2YXIgZnJpZGF5ID0gd2Vla2RheSg1KTtcbiAgdmFyIHNhdHVyZGF5ID0gd2Vla2RheSg2KTtcblxuICB2YXIgbW9udGggPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldERhdGUoMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRNb250aCgpIC0gc3RhcnQuZ2V0TW9udGgoKSArIChlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCkpICogMTI7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRNb250aCgpO1xuICB9KTtcblxuICB2YXIgeWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0TW9udGgoMCwgMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRGdWxsWWVhcigpIC0gc3RhcnQuZ2V0RnVsbFllYXIoKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIHZhciB1dGNTZWNvbmQgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENNaWxsaXNlY29uZHMoMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMWUzKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMWUzO1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0VVRDU2Vjb25kcygpO1xuICB9KTtcblxuICB2YXIgdXRjTWludXRlID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDU2Vjb25kcygwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiA2ZTQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2ZTQ7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRVVENNaW51dGVzKCk7XG4gIH0pO1xuXG4gIHZhciB1dGNIb3VyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDTWludXRlcygwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAzNmU1KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMzZlNTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFVUQ0hvdXJzKCk7XG4gIH0pO1xuXG4gIHZhciB1dGNEYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA4NjRlNTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFVUQ0RhdGUoKSAtIDE7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHV0Y1dlZWtkYXkoaSkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpIC0gKGRhdGUuZ2V0VVRDRGF5KCkgKyA3IC0gaSkgJSA3KTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBzdGVwICogNyk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2MDQ4ZTU7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgdXRjU3VuZGF5ID0gdXRjV2Vla2RheSgwKTtcbiAgdmFyIHV0Y01vbmRheSA9IHV0Y1dlZWtkYXkoMSk7XG4gIHZhciB1dGNUdWVzZGF5ID0gdXRjV2Vla2RheSgyKTtcbiAgdmFyIHV0Y1dlZG5lc2RheSA9IHV0Y1dlZWtkYXkoMyk7XG4gIHZhciB1dGNUaHVyc2RheSA9IHV0Y1dlZWtkYXkoNCk7XG4gIHZhciB1dGNGcmlkYXkgPSB1dGNXZWVrZGF5KDUpO1xuICB2YXIgdXRjU2F0dXJkYXkgPSB1dGNXZWVrZGF5KDYpO1xuXG4gIHZhciB1dGNNb250aCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0VVRDRGF0ZSgxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDTW9udGgoZGF0ZS5nZXRVVENNb250aCgpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldFVUQ01vbnRoKCkgLSBzdGFydC5nZXRVVENNb250aCgpICsgKGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKSkgKiAxMjtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFVUQ01vbnRoKCk7XG4gIH0pO1xuXG4gIHZhciB1dGNZZWFyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldFVUQ0Z1bGxZZWFyKCkgLSBzdGFydC5nZXRVVENGdWxsWWVhcigpO1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgfSk7XG5cbiAgdmFyIG1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kLnJhbmdlO1xuICB2YXIgc2Vjb25kcyA9IHNlY29uZC5yYW5nZTtcbiAgdmFyIG1pbnV0ZXMgPSBtaW51dGUucmFuZ2U7XG4gIHZhciBob3VycyA9IGhvdXIucmFuZ2U7XG4gIHZhciBkYXlzID0gZGF5LnJhbmdlO1xuICB2YXIgc3VuZGF5cyA9IHN1bmRheS5yYW5nZTtcbiAgdmFyIG1vbmRheXMgPSBtb25kYXkucmFuZ2U7XG4gIHZhciB0dWVzZGF5cyA9IHR1ZXNkYXkucmFuZ2U7XG4gIHZhciB3ZWRuZXNkYXlzID0gd2VkbmVzZGF5LnJhbmdlO1xuICB2YXIgdGh1cnNkYXlzID0gdGh1cnNkYXkucmFuZ2U7XG4gIHZhciBmcmlkYXlzID0gZnJpZGF5LnJhbmdlO1xuICB2YXIgc2F0dXJkYXlzID0gc2F0dXJkYXkucmFuZ2U7XG4gIHZhciB3ZWVrcyA9IHN1bmRheS5yYW5nZTtcbiAgdmFyIG1vbnRocyA9IG1vbnRoLnJhbmdlO1xuICB2YXIgeWVhcnMgPSB5ZWFyLnJhbmdlO1xuXG4gIHZhciB1dGNNaWxsaXNlY29uZCA9IG1pbGxpc2Vjb25kO1xuICB2YXIgdXRjTWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzO1xuICB2YXIgdXRjU2Vjb25kcyA9IHV0Y1NlY29uZC5yYW5nZTtcbiAgdmFyIHV0Y01pbnV0ZXMgPSB1dGNNaW51dGUucmFuZ2U7XG4gIHZhciB1dGNIb3VycyA9IHV0Y0hvdXIucmFuZ2U7XG4gIHZhciB1dGNEYXlzID0gdXRjRGF5LnJhbmdlO1xuICB2YXIgdXRjU3VuZGF5cyA9IHV0Y1N1bmRheS5yYW5nZTtcbiAgdmFyIHV0Y01vbmRheXMgPSB1dGNNb25kYXkucmFuZ2U7XG4gIHZhciB1dGNUdWVzZGF5cyA9IHV0Y1R1ZXNkYXkucmFuZ2U7XG4gIHZhciB1dGNXZWRuZXNkYXlzID0gdXRjV2VkbmVzZGF5LnJhbmdlO1xuICB2YXIgdXRjVGh1cnNkYXlzID0gdXRjVGh1cnNkYXkucmFuZ2U7XG4gIHZhciB1dGNGcmlkYXlzID0gdXRjRnJpZGF5LnJhbmdlO1xuICB2YXIgdXRjU2F0dXJkYXlzID0gdXRjU2F0dXJkYXkucmFuZ2U7XG4gIHZhciB1dGNXZWVrcyA9IHV0Y1N1bmRheS5yYW5nZTtcbiAgdmFyIHV0Y01vbnRocyA9IHV0Y01vbnRoLnJhbmdlO1xuICB2YXIgdXRjWWVhcnMgPSB1dGNZZWFyLnJhbmdlO1xuXG4gIHZhciB2ZXJzaW9uID0gXCIwLjEuMVwiO1xuXG4gIGV4cG9ydHMudmVyc2lvbiA9IHZlcnNpb247XG4gIGV4cG9ydHMubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzO1xuICBleHBvcnRzLnNlY29uZHMgPSBzZWNvbmRzO1xuICBleHBvcnRzLm1pbnV0ZXMgPSBtaW51dGVzO1xuICBleHBvcnRzLmhvdXJzID0gaG91cnM7XG4gIGV4cG9ydHMuZGF5cyA9IGRheXM7XG4gIGV4cG9ydHMuc3VuZGF5cyA9IHN1bmRheXM7XG4gIGV4cG9ydHMubW9uZGF5cyA9IG1vbmRheXM7XG4gIGV4cG9ydHMudHVlc2RheXMgPSB0dWVzZGF5cztcbiAgZXhwb3J0cy53ZWRuZXNkYXlzID0gd2VkbmVzZGF5cztcbiAgZXhwb3J0cy50aHVyc2RheXMgPSB0aHVyc2RheXM7XG4gIGV4cG9ydHMuZnJpZGF5cyA9IGZyaWRheXM7XG4gIGV4cG9ydHMuc2F0dXJkYXlzID0gc2F0dXJkYXlzO1xuICBleHBvcnRzLndlZWtzID0gd2Vla3M7XG4gIGV4cG9ydHMubW9udGhzID0gbW9udGhzO1xuICBleHBvcnRzLnllYXJzID0geWVhcnM7XG4gIGV4cG9ydHMudXRjTWlsbGlzZWNvbmQgPSB1dGNNaWxsaXNlY29uZDtcbiAgZXhwb3J0cy51dGNNaWxsaXNlY29uZHMgPSB1dGNNaWxsaXNlY29uZHM7XG4gIGV4cG9ydHMudXRjU2Vjb25kcyA9IHV0Y1NlY29uZHM7XG4gIGV4cG9ydHMudXRjTWludXRlcyA9IHV0Y01pbnV0ZXM7XG4gIGV4cG9ydHMudXRjSG91cnMgPSB1dGNIb3VycztcbiAgZXhwb3J0cy51dGNEYXlzID0gdXRjRGF5cztcbiAgZXhwb3J0cy51dGNTdW5kYXlzID0gdXRjU3VuZGF5cztcbiAgZXhwb3J0cy51dGNNb25kYXlzID0gdXRjTW9uZGF5cztcbiAgZXhwb3J0cy51dGNUdWVzZGF5cyA9IHV0Y1R1ZXNkYXlzO1xuICBleHBvcnRzLnV0Y1dlZG5lc2RheXMgPSB1dGNXZWRuZXNkYXlzO1xuICBleHBvcnRzLnV0Y1RodXJzZGF5cyA9IHV0Y1RodXJzZGF5cztcbiAgZXhwb3J0cy51dGNGcmlkYXlzID0gdXRjRnJpZGF5cztcbiAgZXhwb3J0cy51dGNTYXR1cmRheXMgPSB1dGNTYXR1cmRheXM7XG4gIGV4cG9ydHMudXRjV2Vla3MgPSB1dGNXZWVrcztcbiAgZXhwb3J0cy51dGNNb250aHMgPSB1dGNNb250aHM7XG4gIGV4cG9ydHMudXRjWWVhcnMgPSB1dGNZZWFycztcbiAgZXhwb3J0cy5taWxsaXNlY29uZCA9IG1pbGxpc2Vjb25kO1xuICBleHBvcnRzLnNlY29uZCA9IHNlY29uZDtcbiAgZXhwb3J0cy5taW51dGUgPSBtaW51dGU7XG4gIGV4cG9ydHMuaG91ciA9IGhvdXI7XG4gIGV4cG9ydHMuZGF5ID0gZGF5O1xuICBleHBvcnRzLnN1bmRheSA9IHN1bmRheTtcbiAgZXhwb3J0cy5tb25kYXkgPSBtb25kYXk7XG4gIGV4cG9ydHMudHVlc2RheSA9IHR1ZXNkYXk7XG4gIGV4cG9ydHMud2VkbmVzZGF5ID0gd2VkbmVzZGF5O1xuICBleHBvcnRzLnRodXJzZGF5ID0gdGh1cnNkYXk7XG4gIGV4cG9ydHMuZnJpZGF5ID0gZnJpZGF5O1xuICBleHBvcnRzLnNhdHVyZGF5ID0gc2F0dXJkYXk7XG4gIGV4cG9ydHMud2VlayA9IHN1bmRheTtcbiAgZXhwb3J0cy5tb250aCA9IG1vbnRoO1xuICBleHBvcnRzLnllYXIgPSB5ZWFyO1xuICBleHBvcnRzLnV0Y1NlY29uZCA9IHV0Y1NlY29uZDtcbiAgZXhwb3J0cy51dGNNaW51dGUgPSB1dGNNaW51dGU7XG4gIGV4cG9ydHMudXRjSG91ciA9IHV0Y0hvdXI7XG4gIGV4cG9ydHMudXRjRGF5ID0gdXRjRGF5O1xuICBleHBvcnRzLnV0Y1N1bmRheSA9IHV0Y1N1bmRheTtcbiAgZXhwb3J0cy51dGNNb25kYXkgPSB1dGNNb25kYXk7XG4gIGV4cG9ydHMudXRjVHVlc2RheSA9IHV0Y1R1ZXNkYXk7XG4gIGV4cG9ydHMudXRjV2VkbmVzZGF5ID0gdXRjV2VkbmVzZGF5O1xuICBleHBvcnRzLnV0Y1RodXJzZGF5ID0gdXRjVGh1cnNkYXk7XG4gIGV4cG9ydHMudXRjRnJpZGF5ID0gdXRjRnJpZGF5O1xuICBleHBvcnRzLnV0Y1NhdHVyZGF5ID0gdXRjU2F0dXJkYXk7XG4gIGV4cG9ydHMudXRjV2VlayA9IHV0Y1N1bmRheTtcbiAgZXhwb3J0cy51dGNNb250aCA9IHV0Y01vbnRoO1xuICBleHBvcnRzLnV0Y1llYXIgPSB1dGNZZWFyO1xuICBleHBvcnRzLmludGVydmFsID0gbmV3SW50ZXJ2YWw7XG5cbn0pKTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgICB0aW1lID0gcmVxdWlyZSgnLi4vdGltZScpLFxuICAgIEVQU0lMT04gPSAxZS0xNTtcblxuZnVuY3Rpb24gYmlucyhvcHQpIHtcbiAgaWYgKCFvcHQpIHsgdGhyb3cgRXJyb3IoXCJNaXNzaW5nIGJpbm5pbmcgb3B0aW9ucy5cIik7IH1cblxuICAvLyBkZXRlcm1pbmUgcmFuZ2VcbiAgdmFyIG1heGIgPSBvcHQubWF4YmlucyB8fCAxNSxcbiAgICAgIGJhc2UgPSBvcHQuYmFzZSB8fCAxMCxcbiAgICAgIGxvZ2IgPSBNYXRoLmxvZyhiYXNlKSxcbiAgICAgIGRpdiA9IG9wdC5kaXYgfHwgWzUsIDJdLFxuICAgICAgbWluID0gb3B0Lm1pbixcbiAgICAgIG1heCA9IG9wdC5tYXgsXG4gICAgICBzcGFuID0gbWF4IC0gbWluLFxuICAgICAgc3RlcCwgbGV2ZWwsIG1pbnN0ZXAsIHByZWNpc2lvbiwgdiwgaSwgZXBzO1xuXG4gIGlmIChvcHQuc3RlcCkge1xuICAgIC8vIGlmIHN0ZXAgc2l6ZSBpcyBleHBsaWNpdGx5IGdpdmVuLCB1c2UgdGhhdFxuICAgIHN0ZXAgPSBvcHQuc3RlcDtcbiAgfSBlbHNlIGlmIChvcHQuc3RlcHMpIHtcbiAgICAvLyBpZiBwcm92aWRlZCwgbGltaXQgY2hvaWNlIHRvIGFjY2VwdGFibGUgc3RlcCBzaXplc1xuICAgIHN0ZXAgPSBvcHQuc3RlcHNbTWF0aC5taW4oXG4gICAgICBvcHQuc3RlcHMubGVuZ3RoIC0gMSxcbiAgICAgIGJpc2VjdChvcHQuc3RlcHMsIHNwYW4vbWF4YiwgMCwgb3B0LnN0ZXBzLmxlbmd0aClcbiAgICApXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBlbHNlIHVzZSBzcGFuIHRvIGRldGVybWluZSBzdGVwIHNpemVcbiAgICBsZXZlbCA9IE1hdGguY2VpbChNYXRoLmxvZyhtYXhiKSAvIGxvZ2IpO1xuICAgIG1pbnN0ZXAgPSBvcHQubWluc3RlcCB8fCAwO1xuICAgIHN0ZXAgPSBNYXRoLm1heChcbiAgICAgIG1pbnN0ZXAsXG4gICAgICBNYXRoLnBvdyhiYXNlLCBNYXRoLnJvdW5kKE1hdGgubG9nKHNwYW4pIC8gbG9nYikgLSBsZXZlbClcbiAgICApO1xuXG4gICAgLy8gaW5jcmVhc2Ugc3RlcCBzaXplIGlmIHRvbyBtYW55IGJpbnNcbiAgICB3aGlsZSAoTWF0aC5jZWlsKHNwYW4vc3RlcCkgPiBtYXhiKSB7IHN0ZXAgKj0gYmFzZTsgfVxuXG4gICAgLy8gZGVjcmVhc2Ugc3RlcCBzaXplIGlmIGFsbG93ZWRcbiAgICBmb3IgKGk9MDsgaTxkaXYubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSBzdGVwIC8gZGl2W2ldO1xuICAgICAgaWYgKHYgPj0gbWluc3RlcCAmJiBzcGFuIC8gdiA8PSBtYXhiKSBzdGVwID0gdjtcbiAgICB9XG4gIH1cblxuICAvLyB1cGRhdGUgcHJlY2lzaW9uLCBtaW4gYW5kIG1heFxuICB2ID0gTWF0aC5sb2coc3RlcCk7XG4gIHByZWNpc2lvbiA9IHYgPj0gMCA/IDAgOiB+figtdiAvIGxvZ2IpICsgMTtcbiAgZXBzID0gTWF0aC5wb3coYmFzZSwgLXByZWNpc2lvbiAtIDEpO1xuICBtaW4gPSBNYXRoLm1pbihtaW4sIE1hdGguZmxvb3IobWluIC8gc3RlcCArIGVwcykgKiBzdGVwKTtcbiAgbWF4ID0gTWF0aC5jZWlsKG1heCAvIHN0ZXApICogc3RlcDtcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBtaW4sXG4gICAgc3RvcDogIG1heCxcbiAgICBzdGVwOiAgc3RlcCxcbiAgICB1bml0OiAge3ByZWNpc2lvbjogcHJlY2lzaW9ufSxcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgaW5kZXg6IGluZGV4XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJpc2VjdChhLCB4LCBsbywgaGkpIHtcbiAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICBpZiAodXRpbC5jbXAoYVttaWRdLCB4KSA8IDApIHsgbG8gPSBtaWQgKyAxOyB9XG4gICAgZWxzZSB7IGhpID0gbWlkOyB9XG4gIH1cbiAgcmV0dXJuIGxvO1xufVxuXG5mdW5jdGlvbiB2YWx1ZSh2KSB7XG4gIHJldHVybiB0aGlzLnN0ZXAgKiBNYXRoLmZsb29yKHYgLyB0aGlzLnN0ZXAgKyBFUFNJTE9OKTtcbn1cblxuZnVuY3Rpb24gaW5kZXgodikge1xuICByZXR1cm4gTWF0aC5mbG9vcigodiAtIHRoaXMuc3RhcnQpIC8gdGhpcy5zdGVwICsgRVBTSUxPTik7XG59XG5cbmZ1bmN0aW9uIGRhdGVfdmFsdWUodikge1xuICByZXR1cm4gdGhpcy51bml0LmRhdGUodmFsdWUuY2FsbCh0aGlzLCB2KSk7XG59XG5cbmZ1bmN0aW9uIGRhdGVfaW5kZXgodikge1xuICByZXR1cm4gaW5kZXguY2FsbCh0aGlzLCB0aGlzLnVuaXQudW5pdCh2KSk7XG59XG5cbmJpbnMuZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBpZiAoIW9wdCkgeyB0aHJvdyBFcnJvcihcIk1pc3NpbmcgZGF0ZSBiaW5uaW5nIG9wdGlvbnMuXCIpOyB9XG5cbiAgLy8gZmluZCB0aW1lIHN0ZXAsIHRoZW4gYmluXG4gIHZhciB1bml0cyA9IG9wdC51dGMgPyB0aW1lLnV0YyA6IHRpbWUsXG4gICAgICBkbWluID0gb3B0Lm1pbixcbiAgICAgIGRtYXggPSBvcHQubWF4LFxuICAgICAgbWF4YiA9IG9wdC5tYXhiaW5zIHx8IDIwLFxuICAgICAgbWluYiA9IG9wdC5taW5iaW5zIHx8IDQsXG4gICAgICBzcGFuID0gKCtkbWF4KSAtICgrZG1pbiksXG4gICAgICB1bml0ID0gb3B0LnVuaXQgPyB1bml0c1tvcHQudW5pdF0gOiB1bml0cy5maW5kKHNwYW4sIG1pbmIsIG1heGIpLFxuICAgICAgc3BlYyA9IGJpbnMoe1xuICAgICAgICBtaW46ICAgICB1bml0Lm1pbiAhPSBudWxsID8gdW5pdC5taW4gOiB1bml0LnVuaXQoZG1pbiksXG4gICAgICAgIG1heDogICAgIHVuaXQubWF4ICE9IG51bGwgPyB1bml0Lm1heCA6IHVuaXQudW5pdChkbWF4KSxcbiAgICAgICAgbWF4YmluczogbWF4YixcbiAgICAgICAgbWluc3RlcDogdW5pdC5taW5zdGVwLFxuICAgICAgICBzdGVwczogICB1bml0LnN0ZXBcbiAgICAgIH0pO1xuXG4gIHNwZWMudW5pdCA9IHVuaXQ7XG4gIHNwZWMuaW5kZXggPSBkYXRlX2luZGV4O1xuICBpZiAoIW9wdC5yYXcpIHNwZWMudmFsdWUgPSBkYXRlX3ZhbHVlO1xuICByZXR1cm4gc3BlYztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmlucztcbiIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gICAgZ2VuID0gbW9kdWxlLmV4cG9ydHM7XG5cbmdlbi5yZXBlYXQgPSBmdW5jdGlvbih2YWwsIG4pIHtcbiAgdmFyIGEgPSBBcnJheShuKSwgaTtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSBhW2ldID0gdmFsO1xuICByZXR1cm4gYTtcbn07XG5cbmdlbi56ZXJvcyA9IGZ1bmN0aW9uKG4pIHtcbiAgcmV0dXJuIGdlbi5yZXBlYXQoMCwgbik7XG59O1xuXG5nZW4ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICBzdGVwID0gMTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHN0b3AgPSBzdGFydDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gIH1cbiAgaWYgKChzdG9wIC0gc3RhcnQpIC8gc3RlcCA9PSBJbmZpbml0eSkgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSByYW5nZScpO1xuICB2YXIgcmFuZ2UgPSBbXSwgaSA9IC0xLCBqO1xuICBpZiAoc3RlcCA8IDApIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPiBzdG9wKSByYW5nZS5wdXNoKGopO1xuICBlbHNlIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPCBzdG9wKSByYW5nZS5wdXNoKGopO1xuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5nZW4ucmFuZG9tID0ge307XG5cbmdlbi5yYW5kb20udW5pZm9ybSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xuICAgIG1heCA9IG1pbiA9PT0gdW5kZWZpbmVkID8gMSA6IG1pbjtcbiAgICBtaW4gPSAwO1xuICB9XG4gIHZhciBkID0gbWF4IC0gbWluO1xuICB2YXIgZiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtaW4gKyBkICogTWF0aC5yYW5kb20oKTtcbiAgfTtcbiAgZi5zYW1wbGVzID0gZnVuY3Rpb24obikge1xuICAgIHJldHVybiBnZW4uemVyb3MobikubWFwKGYpO1xuICB9O1xuICBmLnBkZiA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gKHggPj0gbWluICYmIHggPD0gbWF4KSA/IDEvZCA6IDA7XG4gIH07XG4gIGYuY2RmID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB4IDwgbWluID8gMCA6IHggPiBtYXggPyAxIDogKHggLSBtaW4pIC8gZDtcbiAgfTtcbiAgZi5pY2RmID0gZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAocCA+PSAwICYmIHAgPD0gMSkgPyBtaW4gKyBwKmQgOiBOYU47XG4gIH07XG4gIHJldHVybiBmO1xufTtcblxuZ2VuLnJhbmRvbS5pbnRlZ2VyID0gZnVuY3Rpb24oYSwgYikge1xuICBpZiAoYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYiA9IGE7XG4gICAgYSA9IDA7XG4gIH1cbiAgdmFyIGQgPSBiIC0gYTtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYSArIE1hdGguZmxvb3IoZCAqIE1hdGgucmFuZG9tKCkpO1xuICB9O1xuICBmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7XG4gIH07XG4gIGYucGRmID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiAoeCA9PT0gTWF0aC5mbG9vcih4KSAmJiB4ID49IGEgJiYgeCA8IGIpID8gMS9kIDogMDtcbiAgfTtcbiAgZi5jZGYgPSBmdW5jdGlvbih4KSB7XG4gICAgdmFyIHYgPSBNYXRoLmZsb29yKHgpO1xuICAgIHJldHVybiB2IDwgYSA/IDAgOiB2ID49IGIgPyAxIDogKHYgLSBhICsgMSkgLyBkO1xuICB9O1xuICBmLmljZGYgPSBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuIChwID49IDAgJiYgcCA8PSAxKSA/IGEgLSAxICsgTWF0aC5mbG9vcihwKmQpIDogTmFOO1xuICB9O1xuICByZXR1cm4gZjtcbn07XG5cbmdlbi5yYW5kb20ubm9ybWFsID0gZnVuY3Rpb24obWVhbiwgc3RkZXYpIHtcbiAgbWVhbiA9IG1lYW4gfHwgMDtcbiAgc3RkZXYgPSBzdGRldiB8fCAxO1xuICB2YXIgbmV4dDtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IDAsIHkgPSAwLCByZHMsIGM7XG4gICAgaWYgKG5leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgeCA9IG5leHQ7XG4gICAgICBuZXh0ID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICAgIGRvIHtcbiAgICAgIHggPSBNYXRoLnJhbmRvbSgpKjItMTtcbiAgICAgIHkgPSBNYXRoLnJhbmRvbSgpKjItMTtcbiAgICAgIHJkcyA9IHgqeCArIHkqeTtcbiAgICB9IHdoaWxlIChyZHMgPT09IDAgfHwgcmRzID4gMSk7XG4gICAgYyA9IE1hdGguc3FydCgtMipNYXRoLmxvZyhyZHMpL3Jkcyk7IC8vIEJveC1NdWxsZXIgdHJhbnNmb3JtXG4gICAgbmV4dCA9IG1lYW4gKyB5KmMqc3RkZXY7XG4gICAgcmV0dXJuIG1lYW4gKyB4KmMqc3RkZXY7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTtcbiAgfTtcbiAgZi5wZGYgPSBmdW5jdGlvbih4KSB7XG4gICAgdmFyIGV4cCA9IE1hdGguZXhwKE1hdGgucG93KHgtbWVhbiwgMikgLyAoLTIgKiBNYXRoLnBvdyhzdGRldiwgMikpKTtcbiAgICByZXR1cm4gKDEgLyAoc3RkZXYgKiBNYXRoLnNxcnQoMipNYXRoLlBJKSkpICogZXhwO1xuICB9O1xuICBmLmNkZiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAvLyBBcHByb3hpbWF0aW9uIGZyb20gV2VzdCAoMjAwOSlcbiAgICAvLyBCZXR0ZXIgQXBwcm94aW1hdGlvbnMgdG8gQ3VtdWxhdGl2ZSBOb3JtYWwgRnVuY3Rpb25zXG4gICAgdmFyIGNkLFxuICAgICAgICB6ID0gKHggLSBtZWFuKSAvIHN0ZGV2LFxuICAgICAgICBaID0gTWF0aC5hYnMoeik7XG4gICAgaWYgKFogPiAzNykge1xuICAgICAgY2QgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3VtLCBleHAgPSBNYXRoLmV4cCgtWipaLzIpO1xuICAgICAgaWYgKFogPCA3LjA3MTA2NzgxMTg2NTQ3KSB7XG4gICAgICAgIHN1bSA9IDMuNTI2MjQ5NjU5OTg5MTFlLTAyICogWiArIDAuNzAwMzgzMDY0NDQzNjg4O1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgNi4zNzM5NjIyMDM1MzE2NTtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDMzLjkxMjg2NjA3ODM4MztcbiAgICAgICAgc3VtID0gc3VtICogWiArIDExMi4wNzkyOTE0OTc4NzE7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyAyMjEuMjEzNTk2MTY5OTMxO1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgMjIwLjIwNjg2NzkxMjM3NjtcbiAgICAgICAgY2QgPSBleHAgKiBzdW07XG4gICAgICAgIHN1bSA9IDguODM4ODM0NzY0ODMxODRlLTAyICogWiArIDEuNzU1NjY3MTYzMTgyNjQ7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyAxNi4wNjQxNzc1NzkyMDc7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyA4Ni43ODA3MzIyMDI5NDYxO1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgMjk2LjU2NDI0ODc3OTY3NDtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDYzNy4zMzM2MzMzNzg4MzE7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyA3OTMuODI2NTEyNTE5OTQ4O1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgNDQwLjQxMzczNTgyNDc1MjtcbiAgICAgICAgY2QgPSBjZCAvIHN1bTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1bSA9IFogKyAwLjY1O1xuICAgICAgICBzdW0gPSBaICsgNCAvIHN1bTtcbiAgICAgICAgc3VtID0gWiArIDMgLyBzdW07XG4gICAgICAgIHN1bSA9IFogKyAyIC8gc3VtO1xuICAgICAgICBzdW0gPSBaICsgMSAvIHN1bTtcbiAgICAgICAgY2QgPSBleHAgLyBzdW0gLyAyLjUwNjYyODI3NDYzMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHogPiAwID8gMSAtIGNkIDogY2Q7XG4gIH07XG4gIGYuaWNkZiA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBBcHByb3hpbWF0aW9uIG9mIFByb2JpdCBmdW5jdGlvbiB1c2luZyBpbnZlcnNlIGVycm9yIGZ1bmN0aW9uLlxuICAgIGlmIChwIDw9IDAgfHwgcCA+PSAxKSByZXR1cm4gTmFOO1xuICAgIHZhciB4ID0gMipwIC0gMSxcbiAgICAgICAgdiA9ICg4ICogKE1hdGguUEkgLSAzKSkgLyAoMyAqIE1hdGguUEkgKiAoNC1NYXRoLlBJKSksXG4gICAgICAgIGEgPSAoMiAvIChNYXRoLlBJKnYpKSArIChNYXRoLmxvZygxIC0gTWF0aC5wb3coeCwyKSkgLyAyKSxcbiAgICAgICAgYiA9IE1hdGgubG9nKDEgLSAoeCp4KSkgLyB2LFxuICAgICAgICBzID0gKHggPiAwID8gMSA6IC0xKSAqIE1hdGguc3FydChNYXRoLnNxcnQoKGEqYSkgLSBiKSAtIGEpO1xuICAgIHJldHVybiBtZWFuICsgc3RkZXYgKiBNYXRoLlNRUlQyICogcztcbiAgfTtcbiAgcmV0dXJuIGY7XG59O1xuXG5nZW4ucmFuZG9tLmJvb3RzdHJhcCA9IGZ1bmN0aW9uKGRvbWFpbiwgc21vb3RoKSB7XG4gIC8vIEdlbmVyYXRlcyBhIGJvb3RzdHJhcCBzYW1wbGUgZnJvbSBhIHNldCBvZiBvYnNlcnZhdGlvbnMuXG4gIC8vIFNtb290aCBib290c3RyYXBwaW5nIGFkZHMgcmFuZG9tIHplcm8tY2VudGVyZWQgbm9pc2UgdG8gdGhlIHNhbXBsZXMuXG4gIHZhciB2YWwgPSBkb21haW4uZmlsdGVyKHV0aWwuaXNWYWxpZCksXG4gICAgICBsZW4gPSB2YWwubGVuZ3RoLFxuICAgICAgZXJyID0gc21vb3RoID8gZ2VuLnJhbmRvbS5ub3JtYWwoMCwgc21vb3RoKSA6IG51bGw7XG4gIHZhciBmID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbFt+fihNYXRoLnJhbmRvbSgpKmxlbildICsgKGVyciA/IGVycigpIDogMCk7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTtcbiAgfTtcbiAgcmV0dXJuIGY7XG59OyIsInZhciBkM190aW1lID0gcmVxdWlyZSgnZDMtdGltZScpO1xuXG52YXIgdGVtcERhdGUgPSBuZXcgRGF0ZSgpLFxuICAgIGJhc2VEYXRlID0gbmV3IERhdGUoMCwgMCwgMSkuc2V0RnVsbFllYXIoMCksIC8vIEphbiAxLCAwIEFEXG4gICAgdXRjQmFzZURhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQygwLCAwLCAxKSkuc2V0VVRDRnVsbFllYXIoMCk7XG5cbmZ1bmN0aW9uIGRhdGUoZCkge1xuICByZXR1cm4gKHRlbXBEYXRlLnNldFRpbWUoK2QpLCB0ZW1wRGF0ZSk7XG59XG5cbi8vIGNyZWF0ZSBhIHRpbWUgdW5pdCBlbnRyeVxuZnVuY3Rpb24gZW50cnkodHlwZSwgZGF0ZSwgdW5pdCwgc3RlcCwgbWluLCBtYXgpIHtcbiAgdmFyIGUgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRlOiBkYXRlLFxuICAgIHVuaXQ6IHVuaXRcbiAgfTtcbiAgaWYgKHN0ZXApIHtcbiAgICBlLnN0ZXAgPSBzdGVwO1xuICB9IGVsc2Uge1xuICAgIGUubWluc3RlcCA9IDE7XG4gIH1cbiAgaWYgKG1pbiAhPSBudWxsKSBlLm1pbiA9IG1pbjtcbiAgaWYgKG1heCAhPSBudWxsKSBlLm1heCA9IG1heDtcbiAgcmV0dXJuIGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSh0eXBlLCB1bml0LCBiYXNlLCBzdGVwLCBtaW4sIG1heCkge1xuICByZXR1cm4gZW50cnkodHlwZSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiB1bml0Lm9mZnNldChiYXNlLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiB1bml0LmNvdW50KGJhc2UsIGQpOyB9LFxuICAgIHN0ZXAsIG1pbiwgbWF4KTtcbn1cblxudmFyIGxvY2FsZSA9IFtcbiAgY3JlYXRlKCdzZWNvbmQnLCBkM190aW1lLnNlY29uZCwgYmFzZURhdGUpLFxuICBjcmVhdGUoJ21pbnV0ZScsIGQzX3RpbWUubWludXRlLCBiYXNlRGF0ZSksXG4gIGNyZWF0ZSgnaG91cicsICAgZDNfdGltZS5ob3VyLCAgIGJhc2VEYXRlKSxcbiAgY3JlYXRlKCdkYXknLCAgICBkM190aW1lLmRheSwgICAgYmFzZURhdGUsIFsxLCA3XSksXG4gIGNyZWF0ZSgnbW9udGgnLCAgZDNfdGltZS5tb250aCwgIGJhc2VEYXRlLCBbMSwgMywgNl0pLFxuICBjcmVhdGUoJ3llYXInLCAgIGQzX3RpbWUueWVhciwgICBiYXNlRGF0ZSksXG5cbiAgLy8gcGVyaW9kaWMgdW5pdHNcbiAgZW50cnkoJ3NlY29uZHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDEsIDAsIDAsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0U2Vjb25kcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdtaW51dGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCAxLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldE1pbnV0ZXMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnaG91cnMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDEsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0SG91cnMoKTsgfSxcbiAgICBudWxsLCAwLCAyM1xuICApLFxuICBlbnRyeSgnd2Vla2RheXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDQrZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXREYXkoKTsgfSxcbiAgICBbMV0sIDAsIDZcbiAgKSxcbiAgZW50cnkoJ2RhdGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldERhdGUoKTsgfSxcbiAgICBbMV0sIDEsIDMxXG4gICksXG4gIGVudHJ5KCdtb250aHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIGQgJSAxMiwgMSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRNb250aCgpOyB9LFxuICAgIFsxXSwgMCwgMTFcbiAgKVxuXTtcblxudmFyIHV0YyA9IFtcbiAgY3JlYXRlKCdzZWNvbmQnLCBkM190aW1lLnV0Y1NlY29uZCwgdXRjQmFzZURhdGUpLFxuICBjcmVhdGUoJ21pbnV0ZScsIGQzX3RpbWUudXRjTWludXRlLCB1dGNCYXNlRGF0ZSksXG4gIGNyZWF0ZSgnaG91cicsICAgZDNfdGltZS51dGNIb3VyLCAgIHV0Y0Jhc2VEYXRlKSxcbiAgY3JlYXRlKCdkYXknLCAgICBkM190aW1lLnV0Y0RheSwgICAgdXRjQmFzZURhdGUsIFsxLCA3XSksXG4gIGNyZWF0ZSgnbW9udGgnLCAgZDNfdGltZS51dGNNb250aCwgIHV0Y0Jhc2VEYXRlLCBbMSwgMywgNl0pLFxuICBjcmVhdGUoJ3llYXInLCAgIGQzX3RpbWUudXRjWWVhciwgICB1dGNCYXNlRGF0ZSksXG5cbiAgLy8gcGVyaW9kaWMgdW5pdHNcbiAgZW50cnkoJ3NlY29uZHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDEsIDAsIDAsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ1NlY29uZHMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnbWludXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgMCwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDTWludXRlcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdob3VycycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDSG91cnMoKTsgfSxcbiAgICBudWxsLCAwLCAyM1xuICApLFxuICBlbnRyeSgnd2Vla2RheXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDQrZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDRGF5KCk7IH0sXG4gICAgWzFdLCAwLCA2XG4gICksXG4gIGVudHJ5KCdkYXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDRGF0ZSgpOyB9LFxuICAgIFsxXSwgMSwgMzFcbiAgKSxcbiAgZW50cnkoJ21vbnRocycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgZCAlIDEyLCAxKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENNb250aCgpOyB9LFxuICAgIFsxXSwgMCwgMTFcbiAgKVxuXTtcblxudmFyIFNURVBTID0gW1xuICBbMzE1MzZlNiwgNV0sICAvLyAxLXllYXJcbiAgWzc3NzZlNiwgNF0sICAgLy8gMy1tb250aFxuICBbMjU5MmU2LCA0XSwgICAvLyAxLW1vbnRoXG4gIFsxMjA5NmU1LCAzXSwgIC8vIDItd2Vla1xuICBbNjA0OGU1LCAzXSwgICAvLyAxLXdlZWtcbiAgWzE3MjhlNSwgM10sICAgLy8gMi1kYXlcbiAgWzg2NGU1LCAzXSwgICAgLy8gMS1kYXlcbiAgWzQzMmU1LCAyXSwgICAgLy8gMTItaG91clxuICBbMjE2ZTUsIDJdLCAgICAvLyA2LWhvdXJcbiAgWzEwOGU1LCAyXSwgICAgLy8gMy1ob3VyXG4gIFszNmU1LCAyXSwgICAgIC8vIDEtaG91clxuICBbMThlNSwgMV0sICAgICAvLyAzMC1taW51dGVcbiAgWzllNSwgMV0sICAgICAgLy8gMTUtbWludXRlXG4gIFszZTUsIDFdLCAgICAgIC8vIDUtbWludXRlXG4gIFs2ZTQsIDFdLCAgICAgIC8vIDEtbWludXRlXG4gIFszZTQsIDBdLCAgICAgIC8vIDMwLXNlY29uZFxuICBbMTVlMywgMF0sICAgICAvLyAxNS1zZWNvbmRcbiAgWzVlMywgMF0sICAgICAgLy8gNS1zZWNvbmRcbiAgWzFlMywgMF0gICAgICAgLy8gMS1zZWNvbmRcbl07XG5cbmZ1bmN0aW9uIGZpbmQodW5pdHMsIHNwYW4sIG1pbmIsIG1heGIpIHtcbiAgdmFyIHN0ZXAgPSBTVEVQU1swXSwgaSwgbiwgYmlucztcblxuICBmb3IgKGk9MSwgbj1TVEVQUy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgc3RlcCA9IFNURVBTW2ldO1xuICAgIGlmIChzcGFuID4gc3RlcFswXSkge1xuICAgICAgYmlucyA9IHNwYW4gLyBzdGVwWzBdO1xuICAgICAgaWYgKGJpbnMgPiBtYXhiKSB7XG4gICAgICAgIHJldHVybiB1bml0c1tTVEVQU1tpLTFdWzFdXTtcbiAgICAgIH1cbiAgICAgIGlmIChiaW5zID49IG1pbmIpIHtcbiAgICAgICAgcmV0dXJuIHVuaXRzW3N0ZXBbMV1dO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdW5pdHNbU1RFUFNbbi0xXVsxXV07XG59XG5cbmZ1bmN0aW9uIHRvVW5pdE1hcCh1bml0cykge1xuICB2YXIgbWFwID0ge30sIGksIG47XG4gIGZvciAoaT0wLCBuPXVuaXRzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICBtYXBbdW5pdHNbaV0udHlwZV0gPSB1bml0c1tpXTtcbiAgfVxuICBtYXAuZmluZCA9IGZ1bmN0aW9uKHNwYW4sIG1pbmIsIG1heGIpIHtcbiAgICByZXR1cm4gZmluZCh1bml0cywgc3BhbiwgbWluYiwgbWF4Yik7XG4gIH07XG4gIHJldHVybiBtYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Vbml0TWFwKGxvY2FsZSk7XG5tb2R1bGUuZXhwb3J0cy51dGMgPSB0b1VuaXRNYXAodXRjKTsiLCJ2YXIgdSA9IG1vZHVsZS5leHBvcnRzO1xuXG4vLyB1dGlsaXR5IGZ1bmN0aW9uc1xuXG52YXIgRk5BTUUgPSAnX19uYW1lX18nO1xuXG51Lm5hbWVkZnVuYyA9IGZ1bmN0aW9uKG5hbWUsIGYpIHsgcmV0dXJuIChmW0ZOQU1FXSA9IG5hbWUsIGYpOyB9O1xuXG51Lm5hbWUgPSBmdW5jdGlvbihmKSB7IHJldHVybiBmPT1udWxsID8gbnVsbCA6IGZbRk5BTUVdOyB9O1xuXG51LmlkZW50aXR5ID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geDsgfTtcblxudS50cnVlID0gdS5uYW1lZGZ1bmMoJ3RydWUnLCBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWU7IH0pO1xuXG51LmZhbHNlID0gdS5uYW1lZGZ1bmMoJ2ZhbHNlJywgZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZTsgfSk7XG5cbnUuZHVwbGljYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufTtcblxudS5lcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGEpID09PSBKU09OLnN0cmluZ2lmeShiKTtcbn07XG5cbnUuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gIGZvciAodmFyIHgsIG5hbWUsIGk9MSwgbGVuPWFyZ3VtZW50cy5sZW5ndGg7IGk8bGVuOyArK2kpIHtcbiAgICB4ID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAobmFtZSBpbiB4KSB7IG9ialtuYW1lXSA9IHhbbmFtZV07IH1cbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxudS5sZW5ndGggPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4ICE9IG51bGwgJiYgeC5sZW5ndGggIT0gbnVsbCA/IHgubGVuZ3RoIDogbnVsbDtcbn07XG5cbnUua2V5cyA9IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIGtleXMgPSBbXSwgaztcbiAgZm9yIChrIGluIHgpIGtleXMucHVzaChrKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG51LnZhbHMgPSBmdW5jdGlvbih4KSB7XG4gIHZhciB2YWxzID0gW10sIGs7XG4gIGZvciAoayBpbiB4KSB2YWxzLnB1c2goeFtrXSk7XG4gIHJldHVybiB2YWxzO1xufTtcblxudS50b01hcCA9IGZ1bmN0aW9uKGxpc3QsIGYpIHtcbiAgcmV0dXJuIChmID0gdS4kKGYpKSA/XG4gICAgbGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCB4KSB7IHJldHVybiAob2JqW2YoeCldID0gMSwgb2JqKTsgfSwge30pIDpcbiAgICBsaXN0LnJlZHVjZShmdW5jdGlvbihvYmosIHgpIHsgcmV0dXJuIChvYmpbeF0gPSAxLCBvYmopOyB9LCB7fSk7XG59O1xuXG51LmtleXN0ciA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICAvLyB1c2UgdG8gZW5zdXJlIGNvbnNpc3RlbnQga2V5IGdlbmVyYXRpb24gYWNyb3NzIG1vZHVsZXNcbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICBpZiAoIW4pIHJldHVybiAnJztcbiAgZm9yICh2YXIgcz1TdHJpbmcodmFsdWVzWzBdKSwgaT0xOyBpPG47ICsraSkge1xuICAgIHMgKz0gJ3wnICsgU3RyaW5nKHZhbHVlc1tpXSk7XG4gIH1cbiAgcmV0dXJuIHM7XG59O1xuXG4vLyB0eXBlIGNoZWNraW5nIGZ1bmN0aW9uc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG51LmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xufTtcblxudS5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59O1xuXG51LmlzU3RyaW5nID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG59O1xuXG51LmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudS5pc051bWJlciA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBOdW1iZXJdJztcbn07XG5cbnUuaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufTtcblxudS5pc0RhdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufTtcblxudS5pc1ZhbGlkID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiBvYmogPT09IG9iajtcbn07XG5cbnUuaXNCdWZmZXIgPSAodHlwZW9mIEJ1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBCdWZmZXIuaXNCdWZmZXIpIHx8IHUuZmFsc2U7XG5cbi8vIHR5cGUgY29lcmNpb24gZnVuY3Rpb25zXG5cbnUubnVtYmVyID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gcyA9PSBudWxsIHx8IHMgPT09ICcnID8gbnVsbCA6ICtzO1xufTtcblxudS5ib29sZWFuID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gcyA9PSBudWxsIHx8IHMgPT09ICcnID8gbnVsbCA6IHM9PT0nZmFsc2UnID8gZmFsc2UgOiAhIXM7XG59O1xuXG4vLyBwYXJzZSBhIGRhdGUgd2l0aCBvcHRpb25hbCBkMy50aW1lLWZvcm1hdCBmb3JtYXRcbnUuZGF0ZSA9IGZ1bmN0aW9uKHMsIGZvcm1hdCkge1xuICB2YXIgZCA9IGZvcm1hdCA/IGZvcm1hdCA6IERhdGU7XG4gIHJldHVybiBzID09IG51bGwgfHwgcyA9PT0gJycgPyBudWxsIDogZC5wYXJzZShzKTtcbn07XG5cbnUuYXJyYXkgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4ICE9IG51bGwgPyAodS5pc0FycmF5KHgpID8geCA6IFt4XSkgOiBbXTtcbn07XG5cbnUuc3RyID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gdS5pc0FycmF5KHgpID8gJ1snICsgeC5tYXAodS5zdHIpICsgJ10nXG4gICAgOiB1LmlzT2JqZWN0KHgpID8gSlNPTi5zdHJpbmdpZnkoeClcbiAgICA6IHUuaXNTdHJpbmcoeCkgPyAoJ1xcJycrdXRpbF9lc2NhcGVfc3RyKHgpKydcXCcnKSA6IHg7XG59O1xuXG52YXIgZXNjYXBlX3N0cl9yZSA9IC8oXnxbXlxcXFxdKScvZztcblxuZnVuY3Rpb24gdXRpbF9lc2NhcGVfc3RyKHgpIHtcbiAgcmV0dXJuIHgucmVwbGFjZShlc2NhcGVfc3RyX3JlLCAnJDFcXFxcXFwnJyk7XG59XG5cbi8vIGRhdGEgYWNjZXNzIGZ1bmN0aW9uc1xuXG52YXIgZmllbGRfcmUgPSAvXFxbKC4qPylcXF18W14uXFxbXSsvZztcblxudS5maWVsZCA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIFN0cmluZyhmKS5tYXRjaChmaWVsZF9yZSkubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gZFswXSAhPT0gJ1snID8gZCA6XG4gICAgICBkWzFdICE9PSBcIidcIiAmJiBkWzFdICE9PSAnXCInID8gZC5zbGljZSgxLCAtMSkgOlxuICAgICAgZC5zbGljZSgyLCAtMikucmVwbGFjZSgvXFxcXChbXCInXSkvZywgJyQxJyk7XG4gIH0pO1xufTtcblxudS5hY2Nlc3NvciA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIHM7XG4gIHJldHVybiBmPT1udWxsIHx8IHUuaXNGdW5jdGlvbihmKSA/IGYgOlxuICAgIHUubmFtZWRmdW5jKGYsIChzID0gdS5maWVsZChmKSkubGVuZ3RoID4gMSA/XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiBzLnJlZHVjZShmdW5jdGlvbih4LGYpIHsgcmV0dXJuIHhbZl07IH0sIHgpOyB9IDpcbiAgICAgIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHhbZl07IH1cbiAgICApO1xufTtcblxuLy8gc2hvcnQtY3V0IGZvciBhY2Nlc3NvclxudS4kID0gdS5hY2Nlc3NvcjtcblxudS5tdXRhdG9yID0gZnVuY3Rpb24oZikge1xuICB2YXIgcztcbiAgcmV0dXJuIHUuaXNTdHJpbmcoZikgJiYgKHM9dS5maWVsZChmKSkubGVuZ3RoID4gMSA/XG4gICAgZnVuY3Rpb24oeCwgdikge1xuICAgICAgZm9yICh2YXIgaT0wOyBpPHMubGVuZ3RoLTE7ICsraSkgeCA9IHhbc1tpXV07XG4gICAgICB4W3NbaV1dID0gdjtcbiAgICB9IDpcbiAgICBmdW5jdGlvbih4LCB2KSB7IHhbZl0gPSB2OyB9O1xufTtcblxuXG51LiRmdW5jID0gZnVuY3Rpb24obmFtZSwgb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGYpIHtcbiAgICBmID0gdS4kKGYpIHx8IHUuaWRlbnRpdHk7XG4gICAgdmFyIG4gPSBuYW1lICsgKHUubmFtZShmKSA/ICdfJyt1Lm5hbWUoZikgOiAnJyk7XG4gICAgcmV0dXJuIHUubmFtZWRmdW5jKG4sIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG9wKGYoZCkpOyB9KTtcbiAgfTtcbn07XG5cbnUuJHZhbGlkICA9IHUuJGZ1bmMoJ3ZhbGlkJywgdS5pc1ZhbGlkKTtcbnUuJGxlbmd0aCA9IHUuJGZ1bmMoJ2xlbmd0aCcsIHUubGVuZ3RoKTtcblxudS4kaW4gPSBmdW5jdGlvbihmLCB2YWx1ZXMpIHtcbiAgZiA9IHUuJChmKTtcbiAgdmFyIG1hcCA9IHUuaXNBcnJheSh2YWx1ZXMpID8gdS50b01hcCh2YWx1ZXMpIDogdmFsdWVzO1xuICByZXR1cm4gZnVuY3Rpb24oZCkgeyByZXR1cm4gISFtYXBbZihkKV07IH07XG59O1xuXG4vLyBjb21wYXJpc29uIC8gc29ydGluZyBmdW5jdGlvbnNcblxudS5jb21wYXJhdG9yID0gZnVuY3Rpb24oc29ydCkge1xuICB2YXIgc2lnbiA9IFtdO1xuICBpZiAoc29ydCA9PT0gdW5kZWZpbmVkKSBzb3J0ID0gW107XG4gIHNvcnQgPSB1LmFycmF5KHNvcnQpLm1hcChmdW5jdGlvbihmKSB7XG4gICAgdmFyIHMgPSAxO1xuICAgIGlmICAgICAgKGZbMF0gPT09ICctJykgeyBzID0gLTE7IGYgPSBmLnNsaWNlKDEpOyB9XG4gICAgZWxzZSBpZiAoZlswXSA9PT0gJysnKSB7IHMgPSArMTsgZiA9IGYuc2xpY2UoMSk7IH1cbiAgICBzaWduLnB1c2gocyk7XG4gICAgcmV0dXJuIHUuYWNjZXNzb3IoZik7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oYSxiKSB7XG4gICAgdmFyIGksIG4sIGYsIHgsIHk7XG4gICAgZm9yIChpPTAsIG49c29ydC5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgICBmID0gc29ydFtpXTsgeCA9IGYoYSk7IHkgPSBmKGIpO1xuICAgICAgaWYgKHggPCB5KSByZXR1cm4gLTEgKiBzaWduW2ldO1xuICAgICAgaWYgKHggPiB5KSByZXR1cm4gc2lnbltpXTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH07XG59O1xuXG51LmNtcCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGEgPiBiKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSBpZiAoYSA+PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAoYSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmIChiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIE5hTjtcbn07XG5cbnUubnVtY21wID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYSAtIGI7IH07XG5cbnUuc3RhYmxlc29ydCA9IGZ1bmN0aW9uKGFycmF5LCBzb3J0QnksIGtleUZuKSB7XG4gIHZhciBpbmRpY2VzID0gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKGlkeCwgdiwgaSkge1xuICAgIHJldHVybiAoaWR4W2tleUZuKHYpXSA9IGksIGlkeCk7XG4gIH0sIHt9KTtcblxuICBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgc2EgPSBzb3J0QnkoYSksXG4gICAgICAgIHNiID0gc29ydEJ5KGIpO1xuICAgIHJldHVybiBzYSA8IHNiID8gLTEgOiBzYSA+IHNiID8gMVxuICAgICAgICAgOiAoaW5kaWNlc1trZXlGbihhKV0gLSBpbmRpY2VzW2tleUZuKGIpXSk7XG4gIH0pO1xuXG4gIHJldHVybiBhcnJheTtcbn07XG5cblxuLy8gc3RyaW5nIGZ1bmN0aW9uc1xuXG51LnBhZCA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCBwYWRjaGFyKSB7XG4gIHBhZGNoYXIgPSBwYWRjaGFyIHx8IFwiIFwiO1xuICB2YXIgZCA9IGxlbmd0aCAtIHMubGVuZ3RoO1xuICBpZiAoZCA8PSAwKSByZXR1cm4gcztcbiAgc3dpdGNoIChwb3MpIHtcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIHJldHVybiBzdHJyZXAoZCwgcGFkY2hhcikgKyBzO1xuICAgIGNhc2UgJ21pZGRsZSc6XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIHJldHVybiBzdHJyZXAoTWF0aC5mbG9vcihkLzIpLCBwYWRjaGFyKSArXG4gICAgICAgICBzICsgc3RycmVwKE1hdGguY2VpbChkLzIpLCBwYWRjaGFyKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHMgKyBzdHJyZXAoZCwgcGFkY2hhcik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHN0cnJlcChuLCBzdHIpIHtcbiAgdmFyIHMgPSBcIlwiLCBpO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHMgKz0gc3RyO1xuICByZXR1cm4gcztcbn1cblxudS50cnVuY2F0ZSA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCB3b3JkLCBlbGxpcHNpcykge1xuICB2YXIgbGVuID0gcy5sZW5ndGg7XG4gIGlmIChsZW4gPD0gbGVuZ3RoKSByZXR1cm4gcztcbiAgZWxsaXBzaXMgPSBlbGxpcHNpcyAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKGVsbGlwc2lzKSA6ICdcXHUyMDI2JztcbiAgdmFyIGwgPSBNYXRoLm1heCgwLCBsZW5ndGggLSBlbGxpcHNpcy5sZW5ndGgpO1xuXG4gIHN3aXRjaCAocG9zKSB7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICByZXR1cm4gZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbCwxKSA6IHMuc2xpY2UobGVuLWwpKTtcbiAgICBjYXNlICdtaWRkbGUnOlxuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICB2YXIgbDEgPSBNYXRoLmNlaWwobC8yKSwgbDIgPSBNYXRoLmZsb29yKGwvMik7XG4gICAgICByZXR1cm4gKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwxKSA6IHMuc2xpY2UoMCxsMSkpICtcbiAgICAgICAgZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbDIsMSkgOiBzLnNsaWNlKGxlbi1sMikpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwpIDogcy5zbGljZSgwLGwpKSArIGVsbGlwc2lzO1xuICB9XG59O1xuXG5mdW5jdGlvbiB0cnVuY2F0ZU9uV29yZChzLCBsZW4sIHJldikge1xuICB2YXIgY250ID0gMCwgdG9rID0gcy5zcGxpdCh0cnVuY2F0ZV93b3JkX3JlKTtcbiAgaWYgKHJldikge1xuICAgIHMgPSAodG9rID0gdG9rLnJldmVyc2UoKSlcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24odykgeyBjbnQgKz0gdy5sZW5ndGg7IHJldHVybiBjbnQgPD0gbGVuOyB9KVxuICAgICAgLnJldmVyc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBzID0gdG9rLmZpbHRlcihmdW5jdGlvbih3KSB7IGNudCArPSB3Lmxlbmd0aDsgcmV0dXJuIGNudCA8PSBsZW47IH0pO1xuICB9XG4gIHJldHVybiBzLmxlbmd0aCA/IHMuam9pbignJykudHJpbSgpIDogdG9rWzBdLnNsaWNlKDAsIGxlbik7XG59XG5cbnZhciB0cnVuY2F0ZV93b3JkX3JlID0gLyhbXFx1MDAwOVxcdTAwMEFcXHUwMDBCXFx1MDAwQ1xcdTAwMERcXHUwMDIwXFx1MDBBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTIwMjhcXHUyMDI5XFx1MzAwMFxcdUZFRkZdKS87XG4iLCIiLCJleHBvcnQgY29uc3QgQUdHUkVHQVRFX09QUyA9IFtcbiAgJ3ZhbHVlcycsICdjb3VudCcsICd2YWxpZCcsICdtaXNzaW5nJywgJ2Rpc3RpbmN0JyxcbiAgJ3N1bScsICdtZWFuJywgJ2F2ZXJhZ2UnLCAndmFyaWFuY2UnLCAndmFyaWFuY2VwJywgJ3N0ZGV2JyxcbiAgJ3N0ZGV2cCcsICdtZWRpYW4nLCAncTEnLCAncTMnLCAnbW9kZXNrZXcnLCAnbWluJywgJ21heCcsXG4gICdhcmdtaW4nLCAnYXJnbWF4J1xuXTtcblxuZXhwb3J0IGNvbnN0IFNIQVJFRF9ET01BSU5fT1BTID0gW1xuICAnbWVhbicsICdhdmVyYWdlJywgJ3N0ZGV2JywgJ3N0ZGV2cCcsICdtZWRpYW4nLCAncTEnLCAncTMnLCAnbWluJywgJ21heCdcbl07XG5cbi8vIFRPRE86IG1vdmUgc3VwcG9ydGVkVHlwZXMsIHN1cHBvcnRlZEVudW1zIGZyb20gc2NoZW1hIHRvIGhlcmVcbiIsImltcG9ydCB7Q2hhbm5lbCwgUk9XLCBDT0xVTU4sIFNIQVBFLCBTSVpFfSBmcm9tICcuL2NoYW5uZWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXV0b01heEJpbnMoY2hhbm5lbDogQ2hhbm5lbCk6IG51bWJlciB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MVU1OOlxuICAgIGNhc2UgU0laRTpcbiAgICAgIC8vIEZhY2V0cyBhbmQgU2l6ZSBzaG91bGRuJ3QgaGF2ZSB0b28gbWFueSBiaW5zXG4gICAgICAvLyBXZSBjaG9vc2UgNiBsaWtlIHNoYXBlIHRvIHNpbXBsaWZ5IHRoZSBydWxlXG4gICAgY2FzZSBTSEFQRTpcbiAgICAgIHJldHVybiA2OyAvLyBWZWdhJ3MgXCJzaGFwZVwiIGhhcyA2IGRpc3RpbmN0IHZhbHVlc1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gMTA7XG4gIH1cbn1cbiIsIi8qXG4gKiBDb25zdGFudHMgYW5kIHV0aWxpdGllcyBmb3IgZW5jb2RpbmcgY2hhbm5lbHMgKFZpc3VhbCB2YXJpYWJsZXMpXG4gKiBzdWNoIGFzICd4JywgJ3knLCAnY29sb3InLlxuICovXG5cbmltcG9ydCB7TWFya30gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBlbnVtIENoYW5uZWwge1xuICBYID0gJ3gnIGFzIGFueSxcbiAgWSA9ICd5JyBhcyBhbnksXG4gIFJPVyA9ICdyb3cnIGFzIGFueSxcbiAgQ09MVU1OID0gJ2NvbHVtbicgYXMgYW55LFxuICBTSEFQRSA9ICdzaGFwZScgYXMgYW55LFxuICBTSVpFID0gJ3NpemUnIGFzIGFueSxcbiAgQ09MT1IgPSAnY29sb3InIGFzIGFueSxcbiAgUEFUSCA9ICdwYXRoJyBhcyBhbnksXG4gIFRFWFQgPSAndGV4dCcgYXMgYW55LFxuICBERVRBSUwgPSAnZGV0YWlsJyBhcyBhbnksXG4gIExBQkVMID0gJ2xhYmVsJyBhcyBhbnlcbn1cblxuZXhwb3J0IGNvbnN0IFggPSBDaGFubmVsLlg7XG5leHBvcnQgY29uc3QgWSA9IENoYW5uZWwuWTtcbmV4cG9ydCBjb25zdCBST1cgPSBDaGFubmVsLlJPVztcbmV4cG9ydCBjb25zdCBDT0xVTU4gPSBDaGFubmVsLkNPTFVNTjtcbmV4cG9ydCBjb25zdCBTSEFQRSA9IENoYW5uZWwuU0hBUEU7XG5leHBvcnQgY29uc3QgU0laRSA9IENoYW5uZWwuU0laRTtcbmV4cG9ydCBjb25zdCBDT0xPUiA9IENoYW5uZWwuQ09MT1I7XG5leHBvcnQgY29uc3QgUEFUSCA9IENoYW5uZWwuUEFUSDtcbmV4cG9ydCBjb25zdCBURVhUID0gQ2hhbm5lbC5URVhUO1xuZXhwb3J0IGNvbnN0IERFVEFJTCA9IENoYW5uZWwuREVUQUlMO1xuZXhwb3J0IGNvbnN0IExBQkVMID0gQ2hhbm5lbC5MQUJFTDtcblxuZXhwb3J0IGNvbnN0IENIQU5ORUxTID0gW1gsIFksIFJPVywgQ09MVU1OLCBTSVpFLCBTSEFQRSwgQ09MT1IsIFBBVEgsIFRFWFQsIERFVEFJTCwgTEFCRUxdO1xuXG5pbnRlcmZhY2UgU3VwcG9ydGVkTWFyayB7XG4gIHBvaW50PzogYm9vbGVhbjtcbiAgdGljaz86IGJvb2xlYW47XG4gIGNpcmNsZT86IGJvb2xlYW47XG4gIHNxdWFyZT86IGJvb2xlYW47XG4gIGJhcj86IGJvb2xlYW47XG4gIGxpbmU/OiBib29sZWFuO1xuICBhcmVhPzogYm9vbGVhbjtcbiAgdGV4dD86IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIGEgY2hhbm5lbCBzdXBwb3J0cyBhIHBhcnRpY3VsYXIgbWFyayB0eXBlLlxuICogQHBhcmFtIGNoYW5uZWwgIGNoYW5uZWwgbmFtZVxuICogQHBhcmFtIG1hcmsgdGhlIG1hcmsgdHlwZVxuICogQHJldHVybiB3aGV0aGVyIHRoZSBtYXJrIHN1cHBvcnRzIHRoZSBjaGFubmVsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdXBwb3J0TWFyayhjaGFubmVsOiBDaGFubmVsLCBtYXJrOiBNYXJrKSB7XG4gIHJldHVybiAhIWdldFN1cHBvcnRlZE1hcmsoY2hhbm5lbClbbWFya107XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZGljdGlvbmFyeSBzaG93aW5nIHdoZXRoZXIgYSBjaGFubmVsIHN1cHBvcnRzIG1hcmsgdHlwZS5cbiAqIEBwYXJhbSBjaGFubmVsXG4gKiBAcmV0dXJuIEEgZGljdGlvbmFyeSBtYXBwaW5nIG1hcmsgdHlwZXMgdG8gYm9vbGVhbiB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdXBwb3J0ZWRNYXJrKGNoYW5uZWw6IENoYW5uZWwpOiBTdXBwb3J0ZWRNYXJrIHtcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSBYOlxuICAgIGNhc2UgWTpcbiAgICBjYXNlIENPTE9SOlxuICAgIGNhc2UgREVUQUlMOlxuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MVU1OOlxuICAgICAgcmV0dXJuIHsgLy8gYWxsIG1hcmtzXG4gICAgICAgIHBvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSxcbiAgICAgICAgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCB0ZXh0OiB0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgU0laRTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSxcbiAgICAgICAgYmFyOiB0cnVlLCB0ZXh0OiB0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgU0hBUEU6XG4gICAgICByZXR1cm4ge3BvaW50OiB0cnVlfTtcbiAgICBjYXNlIFRFWFQ6XG4gICAgICByZXR1cm4ge3RleHQ6IHRydWV9O1xuICAgIGNhc2UgUEFUSDpcbiAgICAgIHJldHVybiB7bGluZTogdHJ1ZX07XG4gIH1cbiAgcmV0dXJuIHt9O1xufVxuXG5pbnRlcmZhY2UgU3VwcG9ydGVkUm9sZSB7XG4gIG1lYXN1cmU6IGJvb2xlYW47XG4gIGRpbWVuc2lvbjogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogUmV0dXJuIHdoZXRoZXIgYSBjaGFubmVsIHN1cHBvcnRzIGRpbWVuc2lvbiAvIG1lYXN1cmUgcm9sZVxuICogQHBhcmFtICBjaGFubmVsXG4gKiBAcmV0dXJuIEEgZGljdGlvbmFyeSBtYXBwaW5nIHJvbGUgdG8gYm9vbGVhbiB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdXBwb3J0ZWRSb2xlKGNoYW5uZWw6IENoYW5uZWwpOiBTdXBwb3J0ZWRSb2xlIHtcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSBYOlxuICAgIGNhc2UgWTpcbiAgICBjYXNlIENPTE9SOlxuICAgIGNhc2UgTEFCRUw6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZWFzdXJlOiB0cnVlLFxuICAgICAgICBkaW1lbnNpb246IHRydWVcbiAgICAgIH07XG4gICAgY2FzZSBST1c6XG4gICAgY2FzZSBDT0xVTU46XG4gICAgY2FzZSBTSEFQRTpcbiAgICBjYXNlIERFVEFJTDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lYXN1cmU6IGZhbHNlLFxuICAgICAgICBkaW1lbnNpb246IHRydWVcbiAgICAgIH07XG4gICAgY2FzZSBTSVpFOlxuICAgIGNhc2UgVEVYVDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lYXN1cmU6IHRydWUsXG4gICAgICAgIGRpbWVuc2lvbjogZmFsc2VcbiAgICAgIH07XG4gICAgY2FzZSBQQVRIOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWVhc3VyZTogZmFsc2UsXG4gICAgICAgIGRpbWVuc2lvbjogdHJ1ZVxuICAgICAgfTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZW5jb2RpbmcgY2hhbm5lbCcgKyBjaGFubmVsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1NjYWxlKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgcmV0dXJuICFjb250YWlucyhbREVUQUlMLCBQQVRILCBURVhULCBMQUJFTF0sIGNoYW5uZWwpO1xufVxuIiwiaW1wb3J0IHtTcGVjfSBmcm9tICcuLi9zY2hlbWEvc2NoZW1hJztcbmltcG9ydCB7QXhpcywgYXhpcyBhcyBheGlzU2NoZW1hfSBmcm9tICcuLi9zY2hlbWEvYXhpcy5zY2hlbWEnO1xuaW1wb3J0IHtMZWdlbmQsIGxlZ2VuZCBhcyBsZWdlbmRTY2hlbWF9IGZyb20gJy4uL3NjaGVtYS9sZWdlbmQuc2NoZW1hJztcbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4uL3NjaGVtYS9lbmNvZGluZy5zY2hlbWEnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge2luc3RhbnRpYXRlfSBmcm9tICcuLi9zY2hlbWEvc2NoZW1hdXRpbCc7XG5pbXBvcnQgKiBhcyBzY2hlbWEgZnJvbSAnLi4vc2NoZW1hL3NjaGVtYSc7XG5pbXBvcnQgKiBhcyBzY2hlbWFVdGlsIGZyb20gJy4uL3NjaGVtYS9zY2hlbWF1dGlsJztcblxuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWSwgU0laRSwgVEVYVCwgQ2hhbm5lbCwgc3VwcG9ydE1hcmt9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtTT1VSQ0UsIFNVTU1BUll9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0ICogYXMgdmxGaWVsZERlZiBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge0ZpZWxkUmVmT3B0aW9ufSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7TWFyaywgQkFSLCBUSUNLLCBURVhUIGFzIFRFWFRNQVJLfSBmcm9tICcuLi9tYXJrJztcblxuaW1wb3J0IHtnZXRGdWxsTmFtZSwgTk9NSU5BTCwgT1JESU5BTCwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWlucywgZHVwbGljYXRlLCBleHRlbmR9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge2NvbXBpbGVNYXJrQ29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge2NvbXBpbGVMYXlvdXQsIExheW91dH0gZnJvbSAnLi9sYXlvdXQnO1xuaW1wb3J0IHtjb21waWxlU3RhY2tQcm9wZXJ0aWVzLCBTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHt0eXBlIGFzIHNjYWxlVHlwZX0gZnJvbSAnLi9zY2FsZSc7XG5cbi8qKlxuICogSW50ZXJuYWwgbW9kZWwgb2YgVmVnYS1MaXRlIHNwZWNpZmljYXRpb24gZm9yIHRoZSBjb21waWxlci5cbiAqL1xuZXhwb3J0IGNsYXNzIE1vZGVsIHtcbiAgcHJpdmF0ZSBfc3BlYzogU3BlYztcbiAgcHJpdmF0ZSBfc3RhY2s6IFN0YWNrUHJvcGVydGllcztcbiAgcHJpdmF0ZSBfbGF5b3V0OiBMYXlvdXQ7XG5cbiAgY29uc3RydWN0b3Ioc3BlYzogU3BlYykge1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xuICAgIHRoaXMuX3NwZWMgPSBzY2hlbWFVdGlsLm1lcmdlRGVlcChkZWZhdWx0cywgc3BlYyk7XG5cbiAgICB2bEVuY29kaW5nLmZvckVhY2godGhpcy5fc3BlYy5lbmNvZGluZywgZnVuY3Rpb24oZmllbGREZWY6IEZpZWxkRGVmLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBpZiAoIXN1cHBvcnRNYXJrKGNoYW5uZWwsIHRoaXMuX3NwZWMubWFyaykpIHtcbiAgICAgICAgLy8gRHJvcCB1bnN1cHBvcnRlZCBjaGFubmVsXG5cbiAgICAgICAgLy8gRklYTUUgY29uc29saWRhdGUgd2FybmluZyBtZXRob2RcbiAgICAgICAgY29uc29sZS53YXJuKGNoYW5uZWwsICdkcm9wcGVkIGFzIGl0IGlzIGluY29tcGF0aWJsZSB3aXRoJywgdGhpcy5fc3BlYy5tYXJrKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NwZWMuZW5jb2RpbmdbY2hhbm5lbF0uZmllbGQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWVsZERlZi50eXBlKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgc2hvcnQgdHlwZSB0byBmdWxsIHR5cGVcbiAgICAgICAgZmllbGREZWYudHlwZSA9IGdldEZ1bGxOYW1lKGZpZWxkRGVmLnR5cGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPIGluc3RhbnRpYXRlIGJpbiBoZXJlXG5cbiAgICAgIGlmIChmaWVsZERlZi5heGlzID09PSB0cnVlKSB7XG4gICAgICAgIGZpZWxkRGVmLmF4aXMgPSBpbnN0YW50aWF0ZShheGlzU2NoZW1hKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmLmxlZ2VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBmaWVsZERlZi5sZWdlbmQgPSBpbnN0YW50aWF0ZShsZWdlbmRTY2hlbWEpO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgZGVmYXVsdCBiYW5kV2lkdGggZm9yIFggYW5kIFlcbiAgICAgIGlmIChjaGFubmVsID09PSBYICYmIGZpZWxkRGVmLnNjYWxlLmJhbmRXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIHplcm8gZm9yIHRoZSBzYWtlIG9mIHRleHQgdGFibGUuXG4gICAgICAgIGZpZWxkRGVmLnNjYWxlLmJhbmRXaWR0aCA9IHRoaXMuaXNPcmRpbmFsU2NhbGUoWCkgJiYgdGhpcy5tYXJrKCkgPT09ICd0ZXh0JyA/XG4gICAgICAgICAgOTAgOiAvLyBUT0RPOiBjb25maWcuc2NhbGUudGV4dEJhbmRXaWR0aFxuICAgICAgICAgIDIxOyAvLyBUT0RPOiBjb25maWcuc2NhbGUuYmFuZFdpZHRoXG4gICAgICB9XG4gICAgICBpZiAoY2hhbm5lbCA9PT0gWSAmJiBmaWVsZERlZi5zY2FsZS5iYW5kV2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSB6ZXJvIGZvciB0aGUgc2FrZSBvZiB0ZXh0IHRhYmxlLlxuICAgICAgICBmaWVsZERlZi5zY2FsZS5iYW5kV2lkdGggPSAyMTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IGRlZmF1bHQgcGFkZGluZyBmb3IgUk9XIGFuZCBDT0xVTU5cbiAgICAgIGlmIChjaGFubmVsID09PSBST1cgJiYgZmllbGREZWYuc2NhbGUucGFkZGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIHplcm8gZm9yIHRoZSBzYWtlIG9mIHRleHQgdGFibGUuXG4gICAgICAgIGZpZWxkRGVmLnNjYWxlLnBhZGRpbmcgPSB0aGlzLmhhcyhZKSA/IDE2IDogMDtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFubmVsID09PSBDT0xVTU4gJiYgZmllbGREZWYuc2NhbGUucGFkZGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIHplcm8gZm9yIHRoZSBzYWtlIG9mIHRleHQgdGFibGUuXG4gICAgICAgIGZpZWxkRGVmLnNjYWxlLnBhZGRpbmcgPSB0aGlzLmhhcyhYKSA/IDE2IDogMDtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIGNhbGN1bGF0ZSBzdGFja1xuICAgIHRoaXMuX3N0YWNrID0gY29tcGlsZVN0YWNrUHJvcGVydGllcyh0aGlzLl9zcGVjKTtcbiAgICB0aGlzLl9zcGVjLmNvbmZpZy5tYXJrID0gY29tcGlsZU1hcmtDb25maWcodGhpcy5fc3BlYywgdGhpcy5fc3RhY2spO1xuICAgIHRoaXMuX2xheW91dCA9IGNvbXBpbGVMYXlvdXQodGhpcyk7XG5cbiAgfVxuXG4gIHB1YmxpYyBsYXlvdXQoKTogTGF5b3V0IHtcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0O1xuICB9XG5cbiAgcHVibGljIHN0YWNrKCk6IFN0YWNrUHJvcGVydGllcyB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YWNrO1xuICB9XG5cbiAgcHVibGljIHRvU3BlYyhleGNsdWRlQ29uZmlnPywgZXhjbHVkZURhdGE/KSB7XG4gICAgdmFyIGVuY29kaW5nID0gZHVwbGljYXRlKHRoaXMuX3NwZWMuZW5jb2RpbmcpLFxuICAgICAgc3BlYzogYW55O1xuXG4gICAgc3BlYyA9IHtcbiAgICAgIG1hcms6IHRoaXMuX3NwZWMubWFyayxcbiAgICAgIGVuY29kaW5nOiBlbmNvZGluZ1xuICAgIH07XG5cbiAgICBpZiAoIWV4Y2x1ZGVDb25maWcpIHtcbiAgICAgIHNwZWMuY29uZmlnID0gZHVwbGljYXRlKHRoaXMuX3NwZWMuY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZiAoIWV4Y2x1ZGVEYXRhKSB7XG4gICAgICBzcGVjLmRhdGEgPSBkdXBsaWNhdGUodGhpcy5fc3BlYy5kYXRhKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgZGVmYXVsdHNcbiAgICB2YXIgZGVmYXVsdHMgPSBzY2hlbWEuaW5zdGFudGlhdGUoKTtcbiAgICByZXR1cm4gc2NoZW1hVXRpbC5zdWJ0cmFjdChzcGVjLCBkZWZhdWx0cyk7XG4gIH1cblxuICBwdWJsaWMgbWFyaygpOiBNYXJrIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYy5tYXJrO1xuICB9XG5cbiAgcHVibGljIHNwZWMoKTogU3BlYyB7XG4gICAgcmV0dXJuIHRoaXMuX3NwZWM7XG4gIH1cblxuICBwdWJsaWMgaXMobWFyazogTWFyaykge1xuICAgIHJldHVybiB0aGlzLl9zcGVjLm1hcmsgPT09IG1hcms7XG4gIH1cblxuICBwdWJsaWMgaGFzKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5oYXModGhpcy5fc3BlYy5lbmNvZGluZywgY2hhbm5lbCk7XG4gIH1cblxuICBwdWJsaWMgZmllbGREZWYoY2hhbm5lbDogQ2hhbm5lbCk6IEZpZWxkRGVmIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYy5lbmNvZGluZ1tjaGFubmVsXTtcbiAgfVxuXG4gIC8qKiBHZXQgXCJmaWVsZFwiIHJlZmVyZW5jZSBmb3IgdmVnYSAqL1xuICBwdWJsaWMgZmllbGQoY2hhbm5lbDogQ2hhbm5lbCwgb3B0OiBGaWVsZFJlZk9wdGlvbiA9IHt9KSB7XG4gICAgY29uc3QgZmllbGREZWYgPSB0aGlzLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgIGlmIChmaWVsZERlZi5iaW4pIHsgLy8gYmluIGhhcyBkZWZhdWx0IHN1ZmZpeCB0aGF0IGRlcGVuZHMgb24gc2NhbGVUeXBlXG4gICAgICBvcHQgPSBleHRlbmQoe1xuICAgICAgICBiaW5TdWZmaXg6IHNjYWxlVHlwZShmaWVsZERlZiwgY2hhbm5lbCwgdGhpcy5tYXJrKCkpID09PSAnb3JkaW5hbCcgPyAnX3JhbmdlJyA6ICdfc3RhcnQnXG4gICAgICB9LCBvcHQpO1xuICAgIH1cbiAgICByZXR1cm4gdmxGaWVsZERlZi5maWVsZChmaWVsZERlZiwgb3B0KTtcbiAgfVxuXG4gIHB1YmxpYyBmaWVsZFRpdGxlKGNoYW5uZWw6IENoYW5uZWwpOiBzdHJpbmcge1xuICAgIHJldHVybiB2bEZpZWxkRGVmLnRpdGxlKHRoaXMuX3NwZWMuZW5jb2RpbmdbY2hhbm5lbF0pO1xuICB9XG5cbiAgcHVibGljIGNoYW5uZWxzKCk6IENoYW5uZWxbXSB7XG4gICAgcmV0dXJuIHZsRW5jb2RpbmcuY2hhbm5lbHModGhpcy5fc3BlYy5lbmNvZGluZyk7XG4gIH1cblxuICBwdWJsaWMgbWFwKGY6IChmZDogRmllbGREZWYsIGM6IENoYW5uZWwsIGU6IEVuY29kaW5nKSA9PiBhbnksIHQ/OiBhbnkpIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5tYXAodGhpcy5fc3BlYy5lbmNvZGluZywgZiwgdCk7XG4gIH1cblxuICBwdWJsaWMgcmVkdWNlKGY6IChhY2M6IGFueSwgZmQ6IEZpZWxkRGVmLCBjOiBDaGFubmVsLCBlOiBFbmNvZGluZykgPT4gYW55LCBpbml0LCB0PzogYW55KSB7XG4gICAgcmV0dXJuIHZsRW5jb2RpbmcucmVkdWNlKHRoaXMuX3NwZWMuZW5jb2RpbmcsIGYsIGluaXQsIHQpO1xuICB9XG5cbiAgcHVibGljIGZvckVhY2goZjogKGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgaTpudW1iZXIpID0+IHZvaWQsIHQ/OiBhbnkpIHtcbiAgICB2bEVuY29kaW5nLmZvckVhY2godGhpcy5fc3BlYy5lbmNvZGluZywgZiwgdCk7XG4gIH1cblxuICBwdWJsaWMgaXNPcmRpbmFsU2NhbGUoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5maWVsZERlZihjaGFubmVsKTtcbiAgICByZXR1cm4gZmllbGREZWYgJiYgKFxuICAgICAgY29udGFpbnMoW05PTUlOQUwsIE9SRElOQUxdLCBmaWVsZERlZi50eXBlKSB8fFxuICAgICAgKCBmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJiBzY2FsZVR5cGUoZmllbGREZWYsIGNoYW5uZWwsIHRoaXMubWFyaygpKSA9PT0gJ29yZGluYWwnIClcbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgaXNEaW1lbnNpb24oY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiB2bEZpZWxkRGVmLmlzRGltZW5zaW9uKHRoaXMuZmllbGREZWYoY2hhbm5lbCkpO1xuICB9XG5cbiAgcHVibGljIGlzTWVhc3VyZShjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIHZsRmllbGREZWYuaXNNZWFzdXJlKHRoaXMuZmllbGREZWYoY2hhbm5lbCkpO1xuICB9XG5cbiAgcHVibGljIGlzQWdncmVnYXRlKCkge1xuICAgIHJldHVybiB2bEVuY29kaW5nLmlzQWdncmVnYXRlKHRoaXMuX3NwZWMuZW5jb2RpbmcpO1xuICB9XG5cbiAgcHVibGljIGlzRmFjZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKFJPVykgfHwgdGhpcy5oYXMoQ09MVU1OKTtcbiAgfVxuXG4gIHB1YmxpYyBkYXRhVGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBZ2dyZWdhdGUoKSA/IFNVTU1BUlkgOiBTT1VSQ0U7XG4gIH1cblxuICBwdWJsaWMgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYy5kYXRhO1xuICB9XG5cbiAgcHVibGljIHRyYW5zZm9ybSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYy50cmFuc2Zvcm07XG4gIH1cblxuICAvKiogcmV0dXJucyB3aGV0aGVyIHRoZSBlbmNvZGluZyBoYXMgdmFsdWVzIGVtYmVkZGVkICovXG4gIHB1YmxpYyBoYXNWYWx1ZXMoKSB7XG4gICAgdmFyIHZhbHMgPSB0aGlzLmRhdGEoKS52YWx1ZXM7XG4gICAgcmV0dXJuIHZhbHMgJiYgdmFscy5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzcGVjIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwdWJsaWMgY29uZmlnKCkge1xuICAgIHJldHVybiB0aGlzLl9zcGVjLmNvbmZpZztcbiAgfVxuXG4gIHB1YmxpYyBheGlzKGNoYW5uZWw6IENoYW5uZWwpOiBBeGlzIHtcbiAgICBjb25zdCBheGlzID0gdGhpcy5maWVsZERlZihjaGFubmVsKS5heGlzO1xuXG4gICAgLy8gVGhpcyBsaW5lIHNob3VsZCBhY3R1YWxseSBhbHdheXMgcmV0dXJuIGF4aXMgb2JqZWN0IHNpbmNlIHdlIGFscmVhZHlcbiAgICAvLyByZXBsYWNlIGJvb2xlYW4gYXhpcyB3aXRoIHByb3BlcnRpZXMuXG4gICAgcmV0dXJuIHR5cGVvZiBheGlzICE9PSAnYm9vbGVhbicgPyBheGlzIDoge307XG4gIH1cblxuICBwdWJsaWMgbGVnZW5kKGNoYW5uZWw6IENoYW5uZWwpOiBMZWdlbmQge1xuICAgIGNvbnN0IGxlZ2VuZCA9IHRoaXMuZmllbGREZWYoY2hhbm5lbCkubGVnZW5kO1xuXG4gICAgLy8gVGhpcyBsaW5lIHNob3VsZCBhY3R1YWxseSBhbHdheXMgcmV0dXJuIGxlZ2VuZCBvYmplY3Qgc2luY2Ugd2UgYWxyZWFkeVxuICAgIC8vIHJlcGxhY2UgYm9vbGVhbiBsZWdlbmQgd2l0aCBwcm9wZXJ0aWVzLlxuICAgIHJldHVybiB0eXBlb2YgbGVnZW5kICE9PSAnYm9vbGVhbicgPyBsZWdlbmQgOiB7fTtcbiAgfVxuXG4gIC8qKiByZXR1cm5zIHNjYWxlIG5hbWUgZm9yIGEgZ2l2ZW4gY2hhbm5lbCAqL1xuICBwdWJsaWMgc2NhbGVOYW1lKGNoYW5uZWw6IENoYW5uZWwpOiBzdHJpbmcge1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLnNwZWMoKS5uYW1lO1xuICAgIHJldHVybiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyBjaGFubmVsO1xuICB9XG5cbiAgcHVibGljIHNpemVWYWx1ZShjaGFubmVsOiBDaGFubmVsID0gU0laRSkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5maWVsZERlZihTSVpFKS52YWx1ZTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLm1hcmsoKSkge1xuICAgICAgY2FzZSBURVhUTUFSSzpcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnKCkubWFyay5mb250U2l6ZTsgLy8gZm9udCBzaXplIDEwIGJ5IGRlZmF1bHRcbiAgICAgIGNhc2UgQkFSOlxuICAgICAgICBpZiAodGhpcy5jb25maWcoKS5tYXJrLmJhcldpZHRoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnKCkubWFyay5iYXJXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICAvLyBCQVIncyBzaXplIGlzIGFwcGxpZWQgb24gZWl0aGVyIFggb3IgWVxuICAgICAgICByZXR1cm4gIXRoaXMuaGFzKGNoYW5uZWwpIHx8IHRoaXMuaXNPcmRpbmFsU2NhbGUoY2hhbm5lbCkgP1xuICAgICAgICAgIC8vIEZvciBvcmRpbmFsIHNjYWxlIG9yIHNpbmdsZSBiYXIsIHdlIGNhbiB1c2UgYmFuZFdpZHRoIC0gMVxuICAgICAgICAgIC8vICgtMSBzbyB0aGF0IHRoZSBib3JkZXIgb2YgdGhlIGJhciBmYWxscyBvbiBleGFjdCBwaXhlbClcbiAgICAgICAgICB0aGlzLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLmJhbmRXaWR0aCAtIDEgOlxuICAgICAgICAgIC8vIG90aGVyd2lzZSwgc2V0IHRvIDIgYnkgZGVmYXVsdFxuICAgICAgICAgIDI7XG4gICAgICBjYXNlIFRJQ0s6XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZygpLm1hcmsudGlja1dpZHRoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnKCkubWFyay50aWNrV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUuYmFuZFdpZHRoIC8gMS41O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb25maWcoKS5tYXJrLnNpemU7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtjb250YWlucywgZXh0ZW5kLCB0cnVuY2F0ZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge05PTUlOQUwsIE9SRElOQUwsIFRFTVBPUkFMfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFksIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtmb3JtYXRNaXhpbnN9IGZyb20gJy4vdXRpbCc7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9ibG9iL21hc3Rlci9kb2Mvc3BlYy5tZCMxMS1hbWJpZW50LWRlY2xhcmF0aW9uc1xuZGVjbGFyZSBsZXQgZXhwb3J0cztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVBeGlzKGNoYW5uZWw6IENoYW5uZWwsIG1vZGVsOiBNb2RlbCkge1xuICBjb25zdCBpc0NvbCA9IGNoYW5uZWwgPT09IENPTFVNTixcbiAgICBpc1JvdyA9IGNoYW5uZWwgPT09IFJPVyxcbiAgICB0eXBlID0gaXNDb2wgPyAneCcgOiBpc1JvdyA/ICd5JzogY2hhbm5lbDtcblxuICAvLyBUT0RPOiByZXBsYWNlIGFueSB3aXRoIFZlZ2EgQXhpcyBJbnRlcmZhY2VcbiAgbGV0IGRlZjogYW55ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKVxuICB9O1xuXG4gIC8vIGZvcm1hdCBtaXhpbnMgKGFkZCBmb3JtYXQgYW5kIGZvcm1hdFR5cGUpXG4gIGV4dGVuZChkZWYsIGZvcm1hdE1peGlucyhtb2RlbCwgY2hhbm5lbCwgbW9kZWwuYXhpcyhjaGFubmVsKS5mb3JtYXQpKTtcblxuICAvLyAxLjIuIEFkZCBwcm9wZXJ0aWVzXG4gIFtcbiAgICAvLyBhKSBwcm9wZXJ0aWVzIHdpdGggc3BlY2lhbCBydWxlcyAoc28gaXQgaGFzIGF4aXNbcHJvcGVydHldIG1ldGhvZHMpIC0tIGNhbGwgcnVsZSBmdW5jdGlvbnNcbiAgICAnZ3JpZCcsICdsYXllcicsICdvcmllbnQnLCAndGlja1NpemUnLCAndGlja3MnLCAndGl0bGUnLFxuICAgIC8vIGIpIHByb3BlcnRpZXMgd2l0aG91dCBydWxlcywgb25seSBwcm9kdWNlIGRlZmF1bHQgdmFsdWVzIGluIHRoZSBzY2hlbWEsIG9yIGV4cGxpY2l0IHZhbHVlIGlmIHNwZWNpZmllZFxuICAgICdvZmZzZXQnLCAndGlja1BhZGRpbmcnLCAndGlja1NpemUnLCAndGlja1NpemVNYWpvcicsICd0aWNrU2l6ZU1pbm9yJywgJ3RpY2tTaXplRW5kJyxcbiAgICAndGl0bGVPZmZzZXQnLCAndmFsdWVzJywgJ3N1YmRpdmlkZSdcbiAgXS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgbGV0IG1ldGhvZDogKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgZGVmOmFueSk9PmFueTtcblxuICAgIGNvbnN0IHZhbHVlID0gKG1ldGhvZCA9IGV4cG9ydHNbcHJvcGVydHldKSA/XG4gICAgICAgICAgICAgICAgICAvLyBjYWxsaW5nIGF4aXMuZm9ybWF0LCBheGlzLmdyaWQsIC4uLlxuICAgICAgICAgICAgICAgICAgbWV0aG9kKG1vZGVsLCBjaGFubmVsLCBkZWYpIDpcbiAgICAgICAgICAgICAgICAgIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmF4aXNbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWZbcHJvcGVydHldID0gdmFsdWU7XG4gICAgfVxuICB9KTtcblxuICAvLyAyKSBBZGQgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9uIGdyb3Vwc1xuICBjb25zdCBwcm9wcyA9IG1vZGVsLmF4aXMoY2hhbm5lbCkucHJvcGVydGllcyB8fCB7fTtcblxuICBbXG4gICAgJ2F4aXMnLCAnbGFiZWxzJywgLy8gaGF2ZSBzcGVjaWFsIHJ1bGVzXG4gICAgJ2dyaWQnLCAndGl0bGUnLCAndGlja3MnLCAnbWFqb3JUaWNrcycsICdtaW5vclRpY2tzJyAvLyBvbmx5IGRlZmF1bHQgdmFsdWVzXG4gIF0uZm9yRWFjaChmdW5jdGlvbihncm91cCkge1xuICAgIGNvbnN0IHZhbHVlID0gcHJvcGVydGllc1tncm91cF0gP1xuICAgICAgcHJvcGVydGllc1tncm91cF0obW9kZWwsIGNoYW5uZWwsIHByb3BzW2dyb3VwXSwgZGVmKSA6XG4gICAgICBwcm9wc1tncm91cF07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlZi5wcm9wZXJ0aWVzID0gZGVmLnByb3BlcnRpZXMgfHwge307XG4gICAgICBkZWYucHJvcGVydGllc1tncm91cF0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBncmlkKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICBpZiAoY2hhbm5lbCA9PT0gUk9XIHx8IGNoYW5uZWwgPT09IENPTFVNTikge1xuICAgIC8vIG5ldmVyIGFwcGx5IGdyaWQgZm9yIFJPVyBhbmQgQ09MVU1OIHNpbmNlIHdlIG1hbnVhbGx5IGNyZWF0ZSBydWxlLWdyb3VwIGZvciB0aGVtXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGdyaWQgPSBtb2RlbC5heGlzKGNoYW5uZWwpLmdyaWQ7XG4gIGlmIChncmlkICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gIC8vIElmIGBncmlkYCBpcyB1bnNwZWNpZmllZCwgdGhlIGRlZmF1bHQgdmFsdWUgaXMgYHRydWVgIGZvciBvcmRpbmFsIHNjYWxlc1xuICAvLyB0aGF0IGFyZSBub3QgYmlubmVkXG4gIHJldHVybiAhbW9kZWwuaXNPcmRpbmFsU2NhbGUoY2hhbm5lbCkgJiYgIWZpZWxkRGVmLmJpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheWVyKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgZGVmKSB7XG4gIGNvbnN0IGxheWVyID0gbW9kZWwuYXhpcyhjaGFubmVsKS5sYXllcjtcbiAgaWYgKGxheWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbGF5ZXI7XG4gIH1cbiAgaWYgKGRlZi5ncmlkKSB7XG4gICAgLy8gaWYgZ3JpZCBpcyB0cnVlLCBuZWVkIHRvIHB1dCBsYXllciBvbiB0aGUgYmFjayBzbyB0aGF0IGdyaWQgaXMgYmVoaW5kIG1hcmtzXG4gICAgcmV0dXJuICdiYWNrJztcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkOyAvLyBvdGhlcndpc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgdXNlIFZlZ2EncyBkZWZhdWx0LlxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9yaWVudChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgY29uc3Qgb3JpZW50ID0gbW9kZWwuYXhpcyhjaGFubmVsKS5vcmllbnQ7XG4gIGlmIChvcmllbnQpIHtcbiAgICByZXR1cm4gb3JpZW50O1xuICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IENPTFVNTikge1xuICAgIC8vIEZJWE1FIHRlc3QgYW5kIGRlY2lkZVxuICAgIHJldHVybiAndG9wJztcbiAgfSBlbHNlIGlmIChjaGFubmVsID09PSBST1cpIHtcbiAgICBpZiAobW9kZWwuaGFzKFkpICYmIG1vZGVsLmF4aXMoWSkub3JpZW50ICE9PSAncmlnaHQnKSB7XG4gICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2tzKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBjb25zdCB0aWNrcyA9IG1vZGVsLmF4aXMoY2hhbm5lbCkudGlja3M7XG4gIGlmICh0aWNrcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHRpY2tzO1xuICB9XG5cbiAgLy8gRklYTUUgZGVwZW5kcyBvbiBzY2FsZSB0eXBlIHRvb1xuICBpZiAoY2hhbm5lbCA9PT0gWCAmJiAhbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuYmluKSB7XG4gICAgLy8gVmVnYSdzIGRlZmF1bHQgdGlja3Mgb2Z0ZW4gbGVhZCB0byBhIGxvdCBvZiBsYWJlbCBvY2NsdXNpb24gb24gWCB3aXRob3V0IDkwIGRlZ3JlZSByb3RhdGlvblxuICAgIHJldHVybiA1O1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2tTaXplKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBjb25zdCB0aWNrU2l6ZSA9IG1vZGVsLmF4aXMoY2hhbm5lbCkudGlja1NpemU7XG4gIGlmICh0aWNrU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHRpY2tTaXplO1xuICB9XG4gIGlmIChjaGFubmVsID09PSBST1cgfHwgY2hhbm5lbCA9PT0gQ09MVU1OKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGNvbnN0IGF4aXMgPSBtb2RlbC5heGlzKGNoYW5uZWwpO1xuICBpZiAoYXhpcy50aXRsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGF4aXMudGl0bGU7XG4gIH1cblxuICAvLyBpZiBub3QgZGVmaW5lZCwgYXV0b21hdGljYWxseSBkZXRlcm1pbmUgYXhpcyB0aXRsZSBmcm9tIGZpZWxkIGRlZlxuICBjb25zdCBmaWVsZFRpdGxlID0gbW9kZWwuZmllbGRUaXRsZShjaGFubmVsKTtcbiAgY29uc3QgbGF5b3V0ID0gbW9kZWwubGF5b3V0KCk7XG4gIGNvbnN0IGNlbGxXaWR0aCA9IGxheW91dC5jZWxsV2lkdGg7XG4gIGNvbnN0IGNlbGxIZWlnaHQgPSBsYXlvdXQuY2VsbEhlaWdodDtcblxuICBsZXQgbWF4TGVuZ3RoO1xuICBpZiAoYXhpcy50aXRsZU1heExlbmd0aCkge1xuICAgIG1heExlbmd0aCA9IGF4aXMudGl0bGVNYXhMZW5ndGg7XG4gIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gWCAmJiB0eXBlb2YgY2VsbFdpZHRoID09PSAnbnVtYmVyJykge1xuICAgIC8vIEd1ZXNzIG1heCBsZW5ndGggaWYgd2Uga25vdyBjZWxsIHNpemUgYXQgY29tcGlsZSB0aW1lXG4gICAgbWF4TGVuZ3RoID0gY2VsbFdpZHRoIC8gbW9kZWwuYXhpcyhYKS5jaGFyYWN0ZXJXaWR0aDtcbiAgfSBlbHNlIGlmIChjaGFubmVsID09PSBZICYmIHR5cGVvZiBjZWxsSGVpZ2h0ID09PSAnbnVtYmVyJykge1xuICAgIC8vIEd1ZXNzIG1heCBsZW5ndGggaWYgd2Uga25vdyBjZWxsIHNpemUgYXQgY29tcGlsZSB0aW1lXG4gICAgbWF4TGVuZ3RoID0gY2VsbEhlaWdodCAvIG1vZGVsLmF4aXMoWSkuY2hhcmFjdGVyV2lkdGg7XG4gIH1cbiAgLy8gRklYTUU6IHdlIHNob3VsZCB1c2UgdGVtcGxhdGUgdG8gdHJ1bmNhdGUgaW5zdGVhZFxuICByZXR1cm4gbWF4TGVuZ3RoID8gdHJ1bmNhdGUoZmllbGRUaXRsZSwgbWF4TGVuZ3RoKSA6IGZpZWxkVGl0bGU7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgcHJvcGVydGllcyB7XG4gIGV4cG9ydCBmdW5jdGlvbiBheGlzKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgYXhpc1Byb3BzU3BlYykge1xuICAgIGlmIChjaGFubmVsID09PSBST1cgfHwgY2hhbm5lbCA9PT0gQ09MVU1OKSB7XG4gICAgICAvLyBoaWRlIGF4aXMgZm9yIGZhY2V0c1xuICAgICAgcmV0dXJuIGV4dGVuZCh7XG4gICAgICAgIG9wYWNpdHk6IHt2YWx1ZTogMH1cbiAgICAgIH0sIGF4aXNQcm9wc1NwZWMgfHwge30pO1xuICAgIH1cbiAgICByZXR1cm4gYXhpc1Byb3BzU3BlYyB8fCB1bmRlZmluZWQ7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbGFiZWxzKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgbGFiZWxzU3BlYywgZGVmKSB7XG4gICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgICBjb25zdCBheGlzID0gbW9kZWwuYXhpcyhjaGFubmVsKTtcblxuICAgIGlmICghYXhpcy5sYWJlbHMpIHtcbiAgICAgIHJldHVybiBleHRlbmQoe1xuICAgICAgICB0ZXh0OiAnJ1xuICAgICAgfSwgbGFiZWxzU3BlYyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRhaW5zKFtOT01JTkFMLCBPUkRJTkFMXSwgZmllbGREZWYudHlwZSkgJiYgYXhpcy5sYWJlbE1heExlbmd0aCkge1xuICAgICAgLy8gVE9ETyByZXBsYWNlIHRoaXMgd2l0aCBWZWdhJ3MgbGFiZWxNYXhMZW5ndGggb25jZSBpdCBpcyBpbnRyb2R1Y2VkXG4gICAgICBsYWJlbHNTcGVjID0gZXh0ZW5kKHtcbiAgICAgICAgdGV4dDoge1xuICAgICAgICAgIHRlbXBsYXRlOiAne3sgZGF0dW0uZGF0YSB8IHRydW5jYXRlOicgKyBheGlzLmxhYmVsTWF4TGVuZ3RoICsgJ319J1xuICAgICAgICB9XG4gICAgICB9LCBsYWJlbHNTcGVjIHx8IHt9KTtcbiAgICB9XG5cbiAgICAgLy8gZm9yIHgtYXhpcywgc2V0IHRpY2tzIGZvciBRIG9yIHJvdGF0ZSBzY2FsZSBmb3Igb3JkaW5hbCBzY2FsZVxuICAgIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgICAgY2FzZSBYOlxuICAgICAgICBpZiAobW9kZWwuaXNEaW1lbnNpb24oWCkgfHwgZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICAgICAgICBsYWJlbHNTcGVjID0gZXh0ZW5kKHtcbiAgICAgICAgICAgIGFuZ2xlOiB7dmFsdWU6IDI3MH0sXG4gICAgICAgICAgICBhbGlnbjoge3ZhbHVlOiBkZWYub3JpZW50ID09PSAndG9wJyA/ICdsZWZ0JzogJ3JpZ2h0J30sXG4gICAgICAgICAgICBiYXNlbGluZToge3ZhbHVlOiAnbWlkZGxlJ31cbiAgICAgICAgICB9LCBsYWJlbHNTcGVjIHx8IHt9KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUk9XOlxuICAgICAgICBpZiAoZGVmLm9yaWVudCA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgIGxhYmVsc1NwZWMgPSBleHRlbmQoe1xuICAgICAgICAgICAgYW5nbGU6IHt2YWx1ZTogOTB9LFxuICAgICAgICAgICAgYWxpZ246IHt2YWx1ZTogJ2NlbnRlcid9LFxuICAgICAgICAgICAgYmFzZWxpbmU6IHt2YWx1ZTogJ2JvdHRvbSd9XG4gICAgICAgICAgfSwgbGFiZWxzU3BlYyB8fCB7fSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbGFiZWxzU3BlYyB8fCB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsIi8qKlxuICogTW9kdWxlIGZvciBjb21waWxpbmcgVmVnYS1saXRlIHNwZWMgaW50byBWZWdhIHNwZWMuXG4gKi9cbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuXG5pbXBvcnQge2NvbXBpbGVBeGlzfSBmcm9tICcuL2F4aXMnO1xuaW1wb3J0IHtjb21waWxlRGF0YX0gZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7ZmFjZXRNaXhpbnN9IGZyb20gJy4vZmFjZXQnO1xuaW1wb3J0IHtjb21waWxlTGVnZW5kc30gZnJvbSAnLi9sZWdlbmQnO1xuaW1wb3J0IHtjb21waWxlTWFya30gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7Y29tcGlsZVNjYWxlc30gZnJvbSAnLi9zY2FsZSc7XG5pbXBvcnQge2V4dGVuZCwga2V5c30gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7TEFZT1VUfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFl9IGZyb20gJy4uL2NoYW5uZWwnO1xuXG5leHBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUoc3BlYykge1xuICBjb25zdCBtb2RlbCA9IG5ldyBNb2RlbChzcGVjKTtcbiAgY29uc3QgbGF5b3V0ID0gbW9kZWwubGF5b3V0KCk7XG5cbiAgLy8gRklYTUUgcmVwbGFjZSBGSVQgd2l0aCBhcHByb3ByaWF0ZSBtZWNoYW5pc20gb25jZSBWZWdhIGhhcyBpdFxuICBjb25zdCBGSVQgPSAxO1xuXG4gIGNvbnN0IGNvbmZpZyA9IG1vZGVsLmNvbmZpZygpO1xuXG4gIC8vIFRPRE86IGNoYW5nZSB0eXBlIHRvIGJlY29tZSBWZ1NwZWNcbiAgY29uc3Qgb3V0cHV0ID0gZXh0ZW5kKFxuICAgIHNwZWMubmFtZSA/IHsgbmFtZTogc3BlYy5uYW1lIH0gOiB7fSxcbiAgICB7XG4gICAgICB3aWR0aDogdHlwZW9mIGxheW91dC53aWR0aCAhPT0gJ251bWJlcicgPyBGSVQgOiBsYXlvdXQud2lkdGgsXG4gICAgICBoZWlnaHQ6IHR5cGVvZiBsYXlvdXQuaGVpZ2h0ICE9PSAnbnVtYmVyJyA/IEZJVCA6IGxheW91dC5oZWlnaHQsXG4gICAgICBwYWRkaW5nOiAnYXV0bydcbiAgICB9LFxuICAgIGNvbmZpZy52aWV3cG9ydCA/IHsgdmlld3BvcnQ6IGNvbmZpZy52aWV3cG9ydCB9IDoge30sXG4gICAgY29uZmlnLmJhY2tncm91bmQgPyB7IGJhY2tncm91bmQ6IGNvbmZpZy5iYWNrZ3JvdW5kIH0gOiB7fSxcbiAgICBrZXlzKGNvbmZpZy5zY2VuZSkubGVuZ3RoID4gMCA/IHNjZW5lKGNvbmZpZykgOiB7fSxcbiAgICB7XG4gICAgICBkYXRhOiBjb21waWxlRGF0YShtb2RlbCksXG4gICAgICBtYXJrczogW2NvbXBpbGVSb290R3JvdXAobW9kZWwpXVxuICAgIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3BlYzogb3V0cHV0XG4gICAgLy8gVE9ETzogYWRkIHdhcm5pbmcgLyBlcnJvcnMgaGVyZVxuICB9O1xufVxuXG5mdW5jdGlvbiBzY2VuZShjb25maWcpIHtcbiAgcmV0dXJuIFsnZmlsbCcsICdmaWxsT3BhY2l0eScsICdzdHJva2UnLCAnc3Ryb2tlV2lkdGgnLFxuICAgICdzdHJva2VPcGFjaXR5JywgJ3N0cm9rZURhc2gnLCAnc3Ryb2tlRGFzaE9mZnNldCddLlxuICAgICAgcmVkdWNlKGZ1bmN0aW9uKHRvcExldmVsQ29uZmlnOiBhbnksIHByb3BlcnR5KSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbmZpZy5zY2VuZVtwcm9wZXJ0eV07XG4gICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0b3BMZXZlbENvbmZpZy5zY2VuZSA9IHRvcExldmVsQ29uZmlnLnNjZW5lIHx8IHt9O1xuICAgICAgICB0b3BMZXZlbENvbmZpZy5zY2VuZVtwcm9wZXJ0eV0gPSB7dmFsdWU6IHZhbHVlfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b3BMZXZlbENvbmZpZztcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVJvb3RHcm91cChtb2RlbDogTW9kZWwpIHtcbiAgY29uc3Qgc3BlYyA9IG1vZGVsLnNwZWMoKTtcbiAgY29uc3Qgd2lkdGggPSBtb2RlbC5sYXlvdXQoKS53aWR0aDtcbiAgY29uc3QgaGVpZ2h0ID0gbW9kZWwubGF5b3V0KCkuaGVpZ2h0O1xuXG4gIGxldCByb290R3JvdXA6YW55ID0gZXh0ZW5kKHtcbiAgICAgIG5hbWU6IHNwZWMubmFtZSA/IHNwZWMubmFtZSArICctcm9vdCcgOiAncm9vdCcsXG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIH0sXG4gICAgc3BlYy5kZXNjcmlwdGlvbiA/IHtkZXNjcmlwdGlvbjogc3BlYy5kZXNjcmlwdGlvbn0gOiB7fSxcbiAgICB7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiB0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInID9cbiAgICAgICAgICAgICAgICAge2ZpZWxkOiB3aWR0aC5maWVsZH0gOlxuICAgICAgICAgICAgICAgICB7dmFsdWU6IHdpZHRofSxcbiAgICAgICAgICBoZWlnaHQ6IHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInID9cbiAgICAgICAgICAgICAgICAgIHtmaWVsZDogaGVpZ2h0LmZpZWxkfSA6XG4gICAgICAgICAgICAgICAgICB7dmFsdWU6IGhlaWdodH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gIC8vIG9ubHkgYWRkIHJlZmVyZW5jZSB0byBsYXlvdXQgaWYgbmVlZGVkXG4gIGlmICh0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8IHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInKSB7XG4gICAgcm9vdEdyb3VwID0gZXh0ZW5kKHJvb3RHcm91cCwge1xuICAgICAgZnJvbToge2RhdGE6IExBWU9VVH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IG1hcmtzID0gY29tcGlsZU1hcmsobW9kZWwpO1xuXG4gIC8vIFNtYWxsIE11bHRpcGxlc1xuICBpZiAobW9kZWwuaGFzKFJPVykgfHwgbW9kZWwuaGFzKENPTFVNTikpIHtcbiAgICAvLyBwdXQgdGhlIG1hcmtzIGluc2lkZSBhIGZhY2V0IGNlbGwncyBncm91cFxuICAgIGV4dGVuZChyb290R3JvdXAsIGZhY2V0TWl4aW5zKG1vZGVsLCBtYXJrcykpO1xuICB9IGVsc2Uge1xuICAgIHJvb3RHcm91cC5tYXJrcyA9IG1hcmtzO1xuICAgIHJvb3RHcm91cC5zY2FsZXMgPSBjb21waWxlU2NhbGVzKG1vZGVsLmNoYW5uZWxzKCksIG1vZGVsKTtcblxuICAgIHZhciBheGVzID0gKG1vZGVsLmhhcyhYKSAmJiBtb2RlbC5maWVsZERlZihYKS5heGlzID8gW2NvbXBpbGVBeGlzKFgsIG1vZGVsKV0gOiBbXSlcbiAgICAgIC5jb25jYXQobW9kZWwuaGFzKFkpICYmIG1vZGVsLmZpZWxkRGVmKFkpLmF4aXMgPyBbY29tcGlsZUF4aXMoWSwgbW9kZWwpXSA6IFtdKTtcbiAgICBpZiAoYXhlcy5sZW5ndGggPiAwKSB7XG4gICAgICByb290R3JvdXAuYXhlcyA9IGF4ZXM7XG4gICAgfVxuICB9XG5cbiAgLy8gbGVnZW5kcyAoc2ltaWxhciBmb3IgZWl0aGVyIGZhY2V0cyBvciBub24tZmFjZXRzXG4gIHZhciBsZWdlbmRzID0gY29tcGlsZUxlZ2VuZHMobW9kZWwpO1xuICBpZiAobGVnZW5kcy5sZW5ndGggPiAwKSB7XG4gICAgcm9vdEdyb3VwLmxlZ2VuZHMgPSBsZWdlbmRzO1xuICB9XG4gIHJldHVybiByb290R3JvdXA7XG59XG4iLCJpbXBvcnQge1NwZWN9IGZyb20gJy4uL3NjaGVtYS9zY2hlbWEnO1xuaW1wb3J0IHtTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4vc3RhY2snO1xuXG5pbXBvcnQge1gsIFksIERFVEFJTH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2lzQWdncmVnYXRlLCBoYXN9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7aXNNZWFzdXJlfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge1BPSU5ULCBUSUNLLCBDSVJDTEUsIFNRVUFSRX0gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge2NvbnRhaW5zLCBleHRlbmR9IGZyb20gJy4uL3V0aWwnO1xuXG4vKipcbiAqIEF1Z21lbnQgY29uZmlnLm1hcmsgd2l0aCBydWxlLWJhc2VkIGRlZmF1bHQgdmFsdWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZU1hcmtDb25maWcoc3BlYzogU3BlYywgc3RhY2s6IFN0YWNrUHJvcGVydGllcykge1xuICAgcmV0dXJuIGV4dGVuZChcbiAgICAgWydmaWxsZWQnLCAnb3BhY2l0eScsICdvcmllbnQnLCAnYWxpZ24nXS5yZWR1Y2UoZnVuY3Rpb24oY2ZnLCBwcm9wZXJ0eTogc3RyaW5nKSB7XG4gICAgICAgY29uc3QgdmFsdWUgPSBzcGVjLmNvbmZpZy5tYXJrW3Byb3BlcnR5XTtcbiAgICAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgICAgICBjYXNlICdmaWxsZWQnOlxuICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgIC8vIG9ubHkgcG9pbnQgaXMgbm90IGZpbGxlZCBieSBkZWZhdWx0XG4gICAgICAgICAgICAgY2ZnW3Byb3BlcnR5XSA9IHNwZWMubWFyayAhPT0gUE9JTlQ7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgY29udGFpbnMoW1BPSU5ULCBUSUNLLCBDSVJDTEUsIFNRVUFSRV0sIHNwZWMubWFyaykpIHtcbiAgICAgICAgICAgICAvLyBwb2ludC1iYXNlZCBtYXJrcyBhbmQgYmFyXG4gICAgICAgICAgICAgaWYgKCFpc0FnZ3JlZ2F0ZShzcGVjLmVuY29kaW5nKSB8fCBoYXMoc3BlYy5lbmNvZGluZywgREVUQUlMKSkge1xuICAgICAgICAgICAgICAgY2ZnW3Byb3BlcnR5XSA9IDAuNztcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICBjYXNlICdvcmllbnQnOlxuICAgICAgICAgICBpZiAoc3RhY2spIHtcbiAgICAgICAgICAgICAvLyBGb3Igc3RhY2tlZCBjaGFydCwgZXhwbGljaXRseSBzcGVjaWZpZWQgb3JpZW50IHByb3BlcnR5IHdpbGwgYmUgaWdub3JlZC5cbiAgICAgICAgICAgICBjZmdbcHJvcGVydHldID0gc3RhY2suZ3JvdXBieUNoYW5uZWwgPT09IFkgPyAnaG9yaXpvbnRhbCcgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICBjZmdbcHJvcGVydHldID0gaXNNZWFzdXJlKHNwZWMuZW5jb2RpbmdbWF0pICYmICAhaXNNZWFzdXJlKHNwZWMuZW5jb2RpbmdbWV0pID9cbiAgICAgICAgICAgICAgIC8vIGhvcml6b250YWwgaWYgWCBpcyBtZWFzdXJlIGFuZCBZIGlzIGRpbWVuc2lvbiBvciB1bnNwZWNpZmllZFxuICAgICAgICAgICAgICAgJ2hvcml6b250YWwnIDpcbiAgICAgICAgICAgICAgIC8vIHZlcnRpY2FsICh1bmRlZmluZWQpIG90aGVyd2lzZS4gIFRoaXMgaW5jbHVkZXMgd2hlblxuICAgICAgICAgICAgICAgLy8gLSBZIGlzIG1lYXN1cmUgYW5kIFggaXMgZGltZW5zaW9uIG9yIHVuc3BlY2lmaWVkXG4gICAgICAgICAgICAgICAvLyAtIGJvdGggWCBhbmQgWSBhcmUgbWVhc3VyZXMgb3IgYm90aCBhcmUgZGltZW5zaW9uXG4gICAgICAgICAgICAgICB1bmRlZmluZWQ7ICAvL1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgLy8gdGV4dC1vbmx5XG4gICAgICAgICBjYXNlICdhbGlnbic6XG4gICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNmZ1twcm9wZXJ0eV0gPSBoYXMoc3BlYy5lbmNvZGluZywgWCkgPyAnY2VudGVyJyA6ICdyaWdodCc7XG4gICAgICAgICAgfVxuICAgICAgIH1cbiAgICAgICByZXR1cm4gY2ZnO1xuICAgICB9LCB7fSksXG4gICAgIHNwZWMuY29uZmlnLm1hcmtcbiAgICk7XG59XG4iLCJpbXBvcnQgKiBhcyB2bEZpZWxkRGVmIGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7ZXh0ZW5kLCBrZXlzLCB2YWxzLCByZWR1Y2V9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcbmltcG9ydCB7U3RhY2tQcm9wZXJ0aWVzfSBmcm9tICcuL3N0YWNrJztcblxuaW1wb3J0IHthdXRvTWF4Qmluc30gZnJvbSAnLi4vYmluJztcbmltcG9ydCB7Q2hhbm5lbCwgWCwgWSwgUk9XLCBDT0xVTU59IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtTT1VSQ0UsIFNUQUNLRURfU0NBTEUsIExBWU9VVCwgU1VNTUFSWX0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQge2ZpZWxkfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge1FVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHt0eXBlIGFzIHNjYWxlVHlwZX0gZnJvbSAnLi9zY2FsZSc7XG5pbXBvcnQge3BhcnNlRXhwcmVzc2lvbiwgcmF3RG9tYWlufSBmcm9tICcuL3RpbWUnO1xuXG5jb25zdCBERUZBVUxUX05VTExfRklMVEVSUyA9IHtcbiAgbm9taW5hbDogZmFsc2UsXG4gIG9yZGluYWw6IGZhbHNlLFxuICBxdWFudGl0YXRpdmU6IHRydWUsXG4gIHRlbXBvcmFsOiB0cnVlXG59O1xuXG4vKipcbiAqIENyZWF0ZSBWZWdhJ3MgZGF0YSBhcnJheSBmcm9tIGEgZ2l2ZW4gbW9kZWwuXG4gKlxuICogQHBhcmFtICBtb2RlbFxuICogQHJldHVybiBBcnJheSBvZiBWZWdhIGRhdGEuXG4gKiAgICAgICAgICAgICAgICAgVGhpcyBhbHdheXMgaW5jbHVkZXMgYSBcInNvdXJjZVwiIGRhdGEgdGFibGUuXG4gKiAgICAgICAgICAgICAgICAgSWYgdGhlIG1vZGVsIGNvbnRhaW5zIGFnZ3JlZ2F0ZSB2YWx1ZSwgdGhpcyB3aWxsIGFsc28gY3JlYXRlXG4gKiAgICAgICAgICAgICAgICAgYWdncmVnYXRlIHRhYmxlIGFzIHdlbGwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlRGF0YShtb2RlbDogTW9kZWwpOiBWZ0RhdGFbXSB7XG4gIGNvbnN0IGRlZiA9IFtzb3VyY2UuZGVmKG1vZGVsKV07XG5cbiAgY29uc3Qgc3VtbWFyeURlZiA9IHN1bW1hcnkuZGVmKG1vZGVsKTtcbiAgaWYgKHN1bW1hcnlEZWYpIHtcbiAgICBkZWYucHVzaChzdW1tYXJ5RGVmKTtcbiAgfVxuXG4gIC8vIGFwcGVuZCBub24tcG9zaXRpdmUgZmlsdGVyIGF0IHRoZSBlbmQgZm9yIHRoZSBkYXRhIHRhYmxlXG4gIGZpbHRlck5vblBvc2l0aXZlRm9yTG9nKGRlZltkZWYubGVuZ3RoIC0gMV0sIG1vZGVsKTtcblxuICAvLyBhZGQgc3RhdHMgZm9yIGxheW91dCBjYWxjdWxhdGlvblxuICBjb25zdCBsYXlvdXREZWYgPSBsYXlvdXQuZGVmKG1vZGVsKTtcbiAgaWYobGF5b3V0RGVmKSB7XG4gICAgZGVmLnB1c2gobGF5b3V0RGVmKTtcbiAgfVxuXG4gIC8vIFN0YWNrXG4gIGNvbnN0IHN0YWNrRGVmID0gbW9kZWwuc3RhY2soKTtcbiAgaWYgKHN0YWNrRGVmKSB7XG4gICAgZGVmLnB1c2goc3RhY2suZGVmKG1vZGVsLCBzdGFja0RlZikpO1xuICB9XG5cbiAgcmV0dXJuIGRlZi5jb25jYXQoXG4gICAgZGF0ZXMuZGVmcyhtb2RlbCkgLy8gVGltZSBkb21haW4gdGFibGVzXG4gICk7XG59XG5cbi8vIFRPRE86IENvbnNvbGlkYXRlIGFsbCBWZWdhIGludGVyZmFjZXNcbmludGVyZmFjZSBWZ0RhdGEge1xuICBuYW1lOiBzdHJpbmc7XG4gIHNvdXJjZT86IHN0cmluZztcbiAgdmFsdWVzPzogYW55O1xuICBmb3JtYXQ/OiBhbnk7XG4gIHVybD86IGFueTtcbiAgdHJhbnNmb3JtPzogYW55O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIHNvdXJjZSB7XG4gIGV4cG9ydCBmdW5jdGlvbiBkZWYobW9kZWw6IE1vZGVsKTogVmdEYXRhIHtcbiAgICB2YXIgc291cmNlOlZnRGF0YSA9IHtuYW1lOiBTT1VSQ0V9O1xuXG4gICAgLy8gRGF0YSBzb3VyY2UgKHVybCBvciBpbmxpbmUpXG4gICAgaWYgKG1vZGVsLmhhc1ZhbHVlcygpKSB7XG4gICAgICBzb3VyY2UudmFsdWVzID0gbW9kZWwuZGF0YSgpLnZhbHVlcztcbiAgICAgIHNvdXJjZS5mb3JtYXQgPSB7dHlwZTogJ2pzb24nfTtcbiAgICB9IGVsc2Uge1xuICAgICAgc291cmNlLnVybCA9IG1vZGVsLmRhdGEoKS51cmw7XG4gICAgICBzb3VyY2UuZm9ybWF0ID0ge3R5cGU6IG1vZGVsLmRhdGEoKS5mb3JtYXRUeXBlfTtcbiAgICB9XG5cbiAgICAvLyBTZXQgZGF0YSdzIGZvcm1hdC5wYXJzZSBpZiBuZWVkZWRcbiAgICB2YXIgcGFyc2UgPSBmb3JtYXRQYXJzZShtb2RlbCk7XG4gICAgaWYgKHBhcnNlKSB7XG4gICAgICBzb3VyY2UuZm9ybWF0LnBhcnNlID0gcGFyc2U7XG4gICAgfVxuXG4gICAgc291cmNlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybShtb2RlbCk7XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFBhcnNlKG1vZGVsOiBNb2RlbCkge1xuICAgIGNvbnN0IGNhbGNGaWVsZE1hcCA9IChtb2RlbC50cmFuc2Zvcm0oKS5jYWxjdWxhdGUgfHwgW10pLnJlZHVjZShmdW5jdGlvbihmaWVsZE1hcCwgZm9ybXVsYSkge1xuICAgICAgZmllbGRNYXBbZm9ybXVsYS5maWVsZF0gPSB0cnVlO1xuICAgICAgcmV0dXJuIGZpZWxkTWFwO1xuICAgIH0sIHt9KTtcblxuICAgIGxldCBwYXJzZTtcbiAgICAvLyB1c2UgZm9yRWFjaCByYXRoZXIgdGhhbiByZWR1Y2Ugc28gdGhhdCBpdCBjYW4gcmV0dXJuIHVuZGVmaW5lZFxuICAgIC8vIGlmIHRoZXJlIGlzIG5vIHBhcnNlIG5lZWRlZFxuICAgIG1vZGVsLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gICAgICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICAgICAgcGFyc2UgPSBwYXJzZSB8fCB7fTtcbiAgICAgICAgcGFyc2VbZmllbGREZWYuZmllbGRdID0gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICAgICAgaWYgKHZsRmllbGREZWYuaXNDb3VudChmaWVsZERlZikgfHwgY2FsY0ZpZWxkTWFwW2ZpZWxkRGVmLmZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwYXJzZSA9IHBhcnNlIHx8IHt9O1xuICAgICAgICBwYXJzZVtmaWVsZERlZi5maWVsZF0gPSAnbnVtYmVyJztcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGFyc2U7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgVmVnYSB0cmFuc2Zvcm1zIGZvciB0aGUgc291cmNlIGRhdGEgdGFibGUuICBUaGlzIGNhbiBpbmNsdWRlXG4gICAqIHRyYW5zZm9ybXMgZm9yIHRpbWUgdW5pdCwgYmlubmluZyBhbmQgZmlsdGVyaW5nLlxuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBudWxsIGZpbHRlciBjb21lcyBmaXJzdCBzbyB0cmFuc2Zvcm1zIGFyZSBub3QgcGVyZm9ybWVkIG9uIG51bGwgdmFsdWVzXG4gICAgLy8gdGltZSBhbmQgYmluIHNob3VsZCBjb21lIGJlZm9yZSBmaWx0ZXIgc28gd2UgY2FuIGZpbHRlciBieSB0aW1lIGFuZCBiaW5cbiAgICByZXR1cm4gbnVsbEZpbHRlclRyYW5zZm9ybShtb2RlbCkuY29uY2F0KFxuICAgICAgZm9ybXVsYVRyYW5zZm9ybShtb2RlbCksXG4gICAgICBmaWx0ZXJUcmFuc2Zvcm0obW9kZWwpLFxuICAgICAgYmluVHJhbnNmb3JtKG1vZGVsKSxcbiAgICAgIHRpbWVUcmFuc2Zvcm0obW9kZWwpXG4gICAgKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB0aW1lVHJhbnNmb3JtKG1vZGVsOiBNb2RlbCkge1xuICAgIHJldHVybiBtb2RlbC5yZWR1Y2UoZnVuY3Rpb24odHJhbnNmb3JtLCBmaWVsZERlZjogRmllbGREZWYsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICAgIGNvbnN0IHJlZiA9IGZpZWxkKGZpZWxkRGVmLCB7IG5vZm46IHRydWUsIGRhdHVtOiB0cnVlIH0pO1xuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMICYmIGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgICAgZmllbGQ6IGZpZWxkKGZpZWxkRGVmKSxcbiAgICAgICAgICBleHByOiBwYXJzZUV4cHJlc3Npb24oZmllbGREZWYudGltZVVuaXQsIHJlZilcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJhbnNmb3JtO1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBiaW5UcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIG1vZGVsLnJlZHVjZShmdW5jdGlvbih0cmFuc2Zvcm0sIGZpZWxkRGVmOiBGaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgICAgY29uc3QgYmluID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuYmluO1xuICAgICAgaWYgKGJpbikge1xuICAgICAgICBsZXQgYmluVHJhbnMgPSBleHRlbmQoe1xuICAgICAgICAgICAgdHlwZTogJ2JpbicsXG4gICAgICAgICAgICBmaWVsZDogZmllbGREZWYuZmllbGQsXG4gICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgc3RhcnQ6IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX3N0YXJ0J30pLFxuICAgICAgICAgICAgICBtaWQ6IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX21pZCd9KSxcbiAgICAgICAgICAgICAgZW5kOiBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19lbmQnfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIGlmIGJpbiBpcyBhbiBvYmplY3QsIGxvYWQgcGFyYW1ldGVyIGhlcmUhXG4gICAgICAgICAgdHlwZW9mIGJpbiA9PT0gJ2Jvb2xlYW4nID8ge30gOiBiaW5cbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoIWJpblRyYW5zLm1heGJpbnMgJiYgIWJpblRyYW5zLnN0ZXApIHtcbiAgICAgICAgICAvLyBpZiBib3RoIG1heGJpbnMgYW5kIHN0ZXAgYXJlIHNwZWNpZmllZCwgbmVlZCB0byBhdXRvbWF0aWNhbGx5IGRldGVybWluZSBiaW5cbiAgICAgICAgICBiaW5UcmFucy5tYXhiaW5zID0gYXV0b01heEJpbnMoY2hhbm5lbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc2Zvcm0ucHVzaChiaW5UcmFucyk7XG4gICAgICAgIGlmIChzY2FsZVR5cGUoZmllbGREZWYsIGNoYW5uZWwsIG1vZGVsLm1hcmsoKSkgPT09ICdvcmRpbmFsJykge1xuICAgICAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICAgIGZpZWxkOiBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19yYW5nZSd9KSxcbiAgICAgICAgICAgIGV4cHI6IGZpZWxkKGZpZWxkRGVmLCB7ZGF0dW06IHRydWUsIGJpblN1ZmZpeDogJ19zdGFydCd9KSArXG4gICAgICAgICAgICAgICAgICAnKyBcXCctXFwnICsnICtcbiAgICAgICAgICAgICAgICAgIGZpZWxkKGZpZWxkRGVmLCB7ZGF0dW06IHRydWUsIGJpblN1ZmZpeDogJ19lbmQnfSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgICB9LCBbXSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiBBbiBhcnJheSB0aGF0IG1pZ2h0IGNvbnRhaW4gYSBmaWx0ZXIgdHJhbnNmb3JtIGZvciBmaWx0ZXJpbmcgbnVsbCB2YWx1ZSBiYXNlZCBvbiBmaWx0ZXJOdWwgY29uZmlnXG4gICAqL1xuICBleHBvcnQgZnVuY3Rpb24gbnVsbEZpbHRlclRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgICBjb25zdCBmaWx0ZXJOdWxsID0gbW9kZWwudHJhbnNmb3JtKCkuZmlsdGVyTnVsbDtcbiAgICBjb25zdCBmaWx0ZXJlZEZpZWxkcyA9IGtleXMobW9kZWwucmVkdWNlKGZ1bmN0aW9uKGFnZ3JlZ2F0b3IsIGZpZWxkRGVmOiBGaWVsZERlZikge1xuICAgICAgaWYgKGZpbHRlck51bGwgfHxcbiAgICAgICAgKGZpbHRlck51bGwgPT09IHVuZGVmaW5lZCAmJiBmaWVsZERlZi5maWVsZCAmJiBmaWVsZERlZi5maWVsZCAhPT0gJyonICYmIERFRkFVTFRfTlVMTF9GSUxURVJTW2ZpZWxkRGVmLnR5cGVdKSkge1xuICAgICAgICBhZ2dyZWdhdG9yW2ZpZWxkRGVmLmZpZWxkXSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWdncmVnYXRvcjtcbiAgICB9LCB7fSkpO1xuXG4gICAgcmV0dXJuIGZpbHRlcmVkRmllbGRzLmxlbmd0aCA+IDAgP1xuICAgICAgW3tcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIHRlc3Q6IGZpbHRlcmVkRmllbGRzLm1hcChmdW5jdGlvbihmaWVsZE5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gJ2RhdHVtLicgKyBmaWVsZE5hbWUgKyAnIT09bnVsbCc7XG4gICAgICAgIH0pLmpvaW4oJyAmJiAnKVxuICAgICAgfV0gOiBbXTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gICAgdmFyIGZpbHRlciA9IG1vZGVsLnRyYW5zZm9ybSgpLmZpbHRlcjtcbiAgICByZXR1cm4gZmlsdGVyID8gW3tcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIHRlc3Q6IGZpbHRlclxuICAgIH1dIDogW107XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZm9ybXVsYVRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgICByZXR1cm4gKG1vZGVsLnRyYW5zZm9ybSgpLmNhbGN1bGF0ZSB8fCBbXSkucmVkdWNlKGZ1bmN0aW9uKHRyYW5zZm9ybSwgZm9ybXVsYSkge1xuICAgICAgdHJhbnNmb3JtLnB1c2goZXh0ZW5kKHt0eXBlOiAnZm9ybXVsYSd9LCBmb3JtdWxhKSk7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtO1xuICAgIH0sIFtdKTtcbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIGxheW91dCB7XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZihtb2RlbDogTW9kZWwpOiBWZ0RhdGEge1xuICAgIGxldCBzdW1tYXJpemUgPSBbXTtcbiAgICBsZXQgZm9ybXVsYXMgPSBbXTtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBcImZpdFwiIG1vZGVcbiAgICBpZiAobW9kZWwuaGFzKFgpICYmIG1vZGVsLmlzT3JkaW5hbFNjYWxlKFgpKSB7XG4gICAgICBjb25zdCB4U2NhbGUgPSBtb2RlbC5maWVsZERlZihYKS5zY2FsZTtcbiAgICAgIGNvbnN0IHhIYXNEb21haW4gPSB4U2NhbGUuZG9tYWluIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgICBpZiAoIXhIYXNEb21haW4pIHtcbiAgICAgICAgc3VtbWFyaXplLnB1c2goe1xuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYKSxcbiAgICAgICAgICBvcHM6IFsnZGlzdGluY3QnXVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHhDYXJkaW5hbGl0eSA9IHhIYXNEb21haW4gPyB4U2NhbGUuZG9tYWluLmxlbmd0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmZpZWxkKFgsIHtkYXR1bTogdHJ1ZSwgcHJlZm46ICdkaXN0aW5jdF8nfSk7XG4gICAgICBmb3JtdWxhcy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBmaWVsZDogJ2NlbGxXaWR0aCcsXG4gICAgICAgIGV4cHI6ICcoJyArIHhDYXJkaW5hbGl0eSArICcgKyAnICsgeFNjYWxlLnBhZGRpbmcgKyAnKSAqICcgKyB4U2NhbGUuYmFuZFdpZHRoXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAobW9kZWwuaGFzKFkpICYmIG1vZGVsLmlzT3JkaW5hbFNjYWxlKFkpKSB7XG4gICAgICBjb25zdCB5U2NhbGUgPSBtb2RlbC5maWVsZERlZihZKS5zY2FsZTtcbiAgICAgIGNvbnN0IHlIYXNEb21haW4gPSB5U2NhbGUuZG9tYWluIGluc3RhbmNlb2YgQXJyYXk7XG5cbiAgICAgIGlmICgheUhhc0RvbWFpbikge1xuICAgICAgICBzdW1tYXJpemUucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCddXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB5Q2FyZGluYWxpdHkgPSB5SGFzRG9tYWluID8geVNjYWxlLmRvbWFpbi5sZW5ndGggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5maWVsZChZLCB7ZGF0dW06IHRydWUsIHByZWZuOiAnZGlzdGluY3RfJ30pO1xuICAgICAgZm9ybXVsYXMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgZmllbGQ6ICdjZWxsSGVpZ2h0JyxcbiAgICAgICAgZXhwcjogJygnICsgeUNhcmRpbmFsaXR5ICsgJyArICcgKyB5U2NhbGUucGFkZGluZyArICcpICogJyArIHlTY2FsZS5iYW5kV2lkdGhcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGxheW91dCA9IG1vZGVsLmxheW91dCgpO1xuXG4gICAgaWYgKG1vZGVsLmhhcyhDT0xVTU4pKSB7XG4gICAgICBjb25zdCBsYXlvdXRDZWxsV2lkdGggPSBsYXlvdXQuY2VsbFdpZHRoO1xuICAgICAgY29uc3QgY2VsbFdpZHRoID0gdHlwZW9mIGxheW91dENlbGxXaWR0aCAhPT0gJ251bWJlcicgP1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdHVtLicgKyBsYXlvdXRDZWxsV2lkdGguZmllbGQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0Q2VsbFdpZHRoO1xuICAgICAgY29uc3QgY29sU2NhbGUgPSBtb2RlbC5maWVsZERlZihDT0xVTU4pLnNjYWxlO1xuICAgICAgY29uc3QgY29sSGFzRG9tYWluID0gY29sU2NhbGUuZG9tYWluIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgICBpZiAoIWNvbEhhc0RvbWFpbikge1xuICAgICAgICBzdW1tYXJpemUucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKENPTFVNTiksXG4gICAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbENhcmRpbmFsaXR5ID0gY29sSGFzRG9tYWluID8gY29sU2NhbGUuZG9tYWluLmxlbmd0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZmllbGQoQ09MVU1OLCB7ZGF0dW06IHRydWUsIHByZWZuOiAnZGlzdGluY3RfJ30pO1xuICAgICAgZm9ybXVsYXMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgZmllbGQ6ICd3aWR0aCcsXG4gICAgICAgIGV4cHI6ICcoJyArIGNlbGxXaWR0aCArICcgKyAnICsgY29sU2NhbGUucGFkZGluZyArICcpJyArICcgKiAnICsgY29sQ2FyZGluYWxpdHlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChtb2RlbC5oYXMoUk9XKSkge1xuICAgICAgY29uc3QgbGF5b3V0Q2VsbEhlaWdodCA9IGxheW91dC5jZWxsSGVpZ2h0O1xuICAgICAgY29uc3QgY2VsbEhlaWdodCA9IHR5cGVvZiBsYXlvdXRDZWxsSGVpZ2h0ICE9PSAnbnVtYmVyJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0dW0uJyArIGxheW91dENlbGxIZWlnaHQuZmllbGQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0Q2VsbEhlaWdodDtcbiAgICAgIGNvbnN0IHJvd1NjYWxlID0gbW9kZWwuZmllbGREZWYoUk9XKS5zY2FsZTtcbiAgICAgIGNvbnN0IHJvd0hhc0RvbWFpbiA9IHJvd1NjYWxlLmRvbWFpbiBpbnN0YW5jZW9mIEFycmF5O1xuICAgICAgaWYgKCFyb3dIYXNEb21haW4pIHtcbiAgICAgICAgc3VtbWFyaXplLnB1c2goe1xuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChST1cpLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCddXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByb3dDYXJkaW5hbGl0eSA9IHJvd0hhc0RvbWFpbiA/IHJvd1NjYWxlLmRvbWFpbi5sZW5ndGggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmZpZWxkKFJPVywge2RhdHVtOiB0cnVlLCBwcmVmbjogJ2Rpc3RpbmN0Xyd9KTtcbiAgICAgIGZvcm11bGFzLnB1c2goe1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGZpZWxkOiAnaGVpZ2h0JyxcbiAgICAgICAgZXhwcjogJygnICsgY2VsbEhlaWdodCArICcrJyArIHJvd1NjYWxlLnBhZGRpbmcgKyAnKScgKyAnICogJyArIHJvd0NhcmRpbmFsaXR5XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybXVsYXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHN1bW1hcml6ZS5sZW5ndGggPiAwID8ge1xuICAgICAgICBuYW1lOiBMQVlPVVQsXG4gICAgICAgIHNvdXJjZTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgICAgc3VtbWFyaXplOiBzdW1tYXJpemVcbiAgICAgICAgICB9XS5jb25jYXQoZm9ybXVsYXMpXG4gICAgICB9IDoge1xuICAgICAgICBuYW1lOiBMQVlPVVQsXG4gICAgICAgIHZhbHVlczogW3t9XSxcbiAgICAgICAgdHJhbnNmb3JtOiBmb3JtdWxhc1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBzdW1tYXJ5IHtcbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZihtb2RlbDogTW9kZWwpOlZnRGF0YSB7XG4gICAgLyogZGljdCBzZXQgZm9yIGRpbWVuc2lvbnMgKi9cbiAgICB2YXIgZGltcyA9IHt9O1xuXG4gICAgLyogZGljdGlvbmFyeSBtYXBwaW5nIGZpZWxkIG5hbWUgPT4gZGljdCBzZXQgb2YgYWdncmVnYXRpb24gZnVuY3Rpb25zICovXG4gICAgdmFyIG1lYXMgPSB7fTtcblxuICAgIHZhciBoYXNBZ2dyZWdhdGUgPSBmYWxzZTtcblxuICAgIG1vZGVsLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWY6IEZpZWxkRGVmLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBpZiAoZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgIGhhc0FnZ3JlZ2F0ZSA9IHRydWU7XG4gICAgICAgIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICBtZWFzWycqJ10gPSBtZWFzWycqJ10gfHwge307XG4gICAgICAgICAgbWVhc1snKiddLmNvdW50ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXSA9IG1lYXNbZmllbGREZWYuZmllbGRdIHx8IHt9O1xuICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdW2ZpZWxkRGVmLmFnZ3JlZ2F0ZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICAgICAgZGltc1tmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19zdGFydCd9KV0gPSBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19zdGFydCd9KTtcbiAgICAgICAgICBkaW1zW2ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX21pZCd9KV0gPSBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19taWQnfSk7XG4gICAgICAgICAgZGltc1tmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19lbmQnfSldID0gZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdfZW5kJ30pO1xuXG4gICAgICAgICAgaWYgKHNjYWxlVHlwZShmaWVsZERlZiwgY2hhbm5lbCwgbW9kZWwubWFyaygpKSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICAgICAgICAvLyBhbHNvIHByb2R1Y2UgYmluX3JhbmdlIGlmIHRoZSBiaW5uZWQgZmllbGQgdXNlIG9yZGluYWwgc2NhbGVcbiAgICAgICAgICAgIGRpbXNbZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdfcmFuZ2UnfSldID0gZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdfcmFuZ2UnfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpbXNbZmllbGQoZmllbGREZWYpXSA9IGZpZWxkKGZpZWxkRGVmKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGdyb3VwYnkgPSB2YWxzKGRpbXMpO1xuXG4gICAgLy8gc2hvcnQtZm9ybWF0IHN1bW1hcml6ZSBvYmplY3QgZm9yIFZlZ2EncyBhZ2dyZWdhdGUgdHJhbnNmb3JtXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS93aWtpL0RhdGEtVHJhbnNmb3JtcyMtYWdncmVnYXRlXG4gICAgdmFyIHN1bW1hcml6ZSA9IHJlZHVjZShtZWFzLCBmdW5jdGlvbihhZ2dyZWdhdG9yLCBmbkRpY3RTZXQsIGZpZWxkKSB7XG4gICAgICBhZ2dyZWdhdG9yW2ZpZWxkXSA9IGtleXMoZm5EaWN0U2V0KTtcbiAgICAgIHJldHVybiBhZ2dyZWdhdG9yO1xuICAgIH0sIHt9KTtcblxuICAgIGlmIChoYXNBZ2dyZWdhdGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFNVTU1BUlksXG4gICAgICAgIHNvdXJjZTogU09VUkNFLFxuICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogZ3JvdXBieSxcbiAgICAgICAgICBzdW1tYXJpemU6IHN1bW1hcml6ZVxuICAgICAgICB9XVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBzdGFjayB7XG4gIC8qKlxuICAgKiBBZGQgc3RhY2tlZCBkYXRhIHNvdXJjZSwgZm9yIGZlZWRpbmcgdGhlIHNoYXJlZCBzY2FsZS5cbiAgICovXG4gIGV4cG9ydCBmdW5jdGlvbiBkZWYobW9kZWw6IE1vZGVsLCBzdGFja1Byb3BzOiBTdGFja1Byb3BlcnRpZXMpOlZnRGF0YSB7XG4gICAgdmFyIGdyb3VwYnlDaGFubmVsID0gc3RhY2tQcm9wcy5ncm91cGJ5Q2hhbm5lbDtcbiAgICB2YXIgZmllbGRDaGFubmVsID0gc3RhY2tQcm9wcy5maWVsZENoYW5uZWw7XG4gICAgdmFyIGZhY2V0RmllbGRzID0gKG1vZGVsLmhhcyhDT0xVTU4pID8gW21vZGVsLmZpZWxkKENPTFVNTildIDogW10pXG4gICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdCgobW9kZWwuaGFzKFJPVykgPyBbbW9kZWwuZmllbGQoUk9XKV0gOiBbXSkpO1xuXG4gICAgdmFyIHN0YWNrZWQ6VmdEYXRhID0ge1xuICAgICAgbmFtZTogU1RBQ0tFRF9TQ0FMRSxcbiAgICAgIHNvdXJjZTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAvLyBncm91cCBieSBjaGFubmVsIGFuZCBvdGhlciBmYWNldHNcbiAgICAgICAgZ3JvdXBieTogW21vZGVsLmZpZWxkKGdyb3VwYnlDaGFubmVsKV0uY29uY2F0KGZhY2V0RmllbGRzKSxcbiAgICAgICAgLy8gcHJvZHVjZSBzdW0gb2YgdGhlIGZpZWxkJ3MgdmFsdWUgZS5nLiwgc3VtIG9mIHN1bSwgc3VtIG9mIGRpc3RpbmN0XG4gICAgICAgIHN1bW1hcml6ZTogW3tvcHM6IFsnc3VtJ10sIGZpZWxkOiBtb2RlbC5maWVsZChmaWVsZENoYW5uZWwpfV1cbiAgICAgIH1dXG4gICAgfTtcblxuICAgIHJldHVybiBzdGFja2VkO1xuICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIGRhdGVzIHtcbiAgLyoqXG4gICAqIEFkZCBkYXRhIHNvdXJjZSBmb3Igd2l0aCBkYXRlcyBmb3IgYWxsIG1vbnRocywgZGF5cywgaG91cnMsIC4uLiBhcyBuZWVkZWQuXG4gICAqL1xuICBleHBvcnQgZnVuY3Rpb24gZGVmcyhtb2RlbDogTW9kZWwpIHtcbiAgICBsZXQgYWxyZWFkeUFkZGVkID0ge307XG5cbiAgICByZXR1cm4gbW9kZWwucmVkdWNlKGZ1bmN0aW9uKGFnZ3JlZ2F0b3IsIGZpZWxkRGVmOiBGaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgICAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIGNvbnN0IGRvbWFpbiA9IHJhd0RvbWFpbihmaWVsZERlZi50aW1lVW5pdCwgY2hhbm5lbCk7XG4gICAgICAgIGlmIChkb21haW4gJiYgIWFscmVhZHlBZGRlZFtmaWVsZERlZi50aW1lVW5pdF0pIHtcbiAgICAgICAgICBhbHJlYWR5QWRkZWRbZmllbGREZWYudGltZVVuaXRdID0gdHJ1ZTtcbiAgICAgICAgICBhZ2dyZWdhdG9yLnB1c2goe1xuICAgICAgICAgICAgbmFtZTogZmllbGREZWYudGltZVVuaXQsXG4gICAgICAgICAgICB2YWx1ZXM6IGRvbWFpbixcbiAgICAgICAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICAgICAgICBleHByOiBwYXJzZUV4cHJlc3Npb24oZmllbGREZWYudGltZVVuaXQsICdkYXR1bS5kYXRhJywgdHJ1ZSlcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhZ2dyZWdhdG9yO1xuICAgIH0sIFtdKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyTm9uUG9zaXRpdmVGb3JMb2coZGF0YVRhYmxlLCBtb2RlbDogTW9kZWwpIHtcbiAgbW9kZWwuZm9yRWFjaChmdW5jdGlvbihfLCBjaGFubmVsKSB7XG4gICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZTtcbiAgICBpZiAoc2NhbGUgJiYgc2NhbGUudHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIGRhdGFUYWJsZS50cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgICB0ZXN0OiBtb2RlbC5maWVsZChjaGFubmVsLCB7ZGF0dW06IHRydWV9KSArICcgPiAwJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge2V4dGVuZH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuXG5pbXBvcnQge2NvbXBpbGVBeGlzfSBmcm9tICcuL2F4aXMnO1xuaW1wb3J0IHtjb21waWxlU2NhbGVzfSBmcm9tICcuL3NjYWxlJztcblxuLyoqXG4gKiByZXR1cm4gbWl4aW5zIHRoYXQgY29udGFpbnMgbWFya3MsIHNjYWxlcywgYW5kIGF4ZXMgZm9yIHRoZSByb290R3JvdXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZhY2V0TWl4aW5zKG1vZGVsOiBNb2RlbCwgbWFya3MpIHtcbiAgY29uc3QgbGF5b3V0ID0gbW9kZWwubGF5b3V0KCk7XG4gIGNvbnN0IGNlbGxDb25maWcgPSBtb2RlbC5jb25maWcoKS5jZWxsO1xuICBjb25zdCBjZWxsV2lkdGg6IGFueSA9ICFtb2RlbC5oYXMoQ09MVU1OKSA/XG4gICAgICB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319IDogICAgIC8vIGNlbGxXaWR0aCA9IHdpZHRoIC0tIGp1c3QgdXNlIGdyb3VwJ3NcbiAgICB0eXBlb2YgbGF5b3V0LmNlbGxXaWR0aCAhPT0gJ251bWJlcicgP1xuICAgICAge3NjYWxlOiBtb2RlbC5zY2FsZU5hbWUoQ09MVU1OKSwgYmFuZDogdHJ1ZX0gOiAvLyBiYW5kU2l6ZSBvZiB0aGUgc2NhbGVcbiAgICAgIHt2YWx1ZTogbGF5b3V0LmNlbGxXaWR0aH07ICAgICAgLy8gc3RhdGljIHZhbHVlXG5cbiAgY29uc3QgY2VsbEhlaWdodDogYW55ID0gIW1vZGVsLmhhcyhST1cpID9cbiAgICAgIHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319IDogIC8vIGNlbGxIZWlnaHQgPSBoZWlnaHQgLS0ganVzdCB1c2UgZ3JvdXAnc1xuICAgIHR5cGVvZiBsYXlvdXQuY2VsbEhlaWdodCAhPT0gJ251bWJlcicgP1xuICAgICAge3NjYWxlOiBtb2RlbC5zY2FsZU5hbWUoUk9XKSwgYmFuZDogdHJ1ZX0gOiAgLy8gYmFuZFNpemUgb2YgdGhlIHNjYWxlXG4gICAgICB7dmFsdWU6IGxheW91dC5jZWxsSGVpZ2h0fTsgICAvLyBzdGF0aWMgdmFsdWVcblxuICBsZXQgZmFjZXRHcm91cFByb3BlcnRpZXM6IGFueSA9IHtcbiAgICB3aWR0aDogY2VsbFdpZHRoLFxuICAgIGhlaWdodDogY2VsbEhlaWdodFxuICB9O1xuXG4gIC8vIGFkZCBjb25maWdzIHRoYXQgYXJlIHRoZSByZXN1bHRpbmcgZ3JvdXAgbWFya3MgcHJvcGVydGllc1xuICBbJ2NsaXAnLCAnZmlsbCcsICdmaWxsT3BhY2l0eScsICdzdHJva2UnLCAnc3Ryb2tlV2lkdGgnLFxuICAgICdzdHJva2VPcGFjaXR5JywgJ3N0cm9rZURhc2gnLCAnc3Ryb2tlRGFzaE9mZnNldCddXG4gICAgLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY2VsbENvbmZpZ1twcm9wZXJ0eV07XG4gICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmYWNldEdyb3VwUHJvcGVydGllc1twcm9wZXJ0eV0gPSB7dmFsdWU6IHZhbHVlfTtcbiAgICAgIH1cbiAgICB9KTtcblxuICBsZXQgcm9vdE1hcmtzID0gW10sIHJvb3RBeGVzID0gW10sIGZhY2V0S2V5cyA9IFtdLCBjZWxsQXhlcyA9IFtdO1xuICBjb25zdCBoYXNSb3cgPSBtb2RlbC5oYXMoUk9XKSwgaGFzQ29sID0gbW9kZWwuaGFzKENPTFVNTik7XG5cbiAgLy8gVE9ETygjOTApOiBhZGQgcHJvcGVydHkgdG8ga2VlcCBheGVzIGluIGNlbGxzIGV2ZW4gaWYgcm93IGlzIGVuY29kZWRcbiAgaWYgKGhhc1Jvdykge1xuICAgIGlmICghbW9kZWwuaXNEaW1lbnNpb24oUk9XKSkge1xuICAgICAgLy8gVE9ETzogYWRkIGVycm9yIHRvIG1vZGVsIGluc3RlYWRcbiAgICAgIHV0aWwuZXJyb3IoJ1JvdyBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC4nKTtcbiAgICB9XG4gICAgZmFjZXRHcm91cFByb3BlcnRpZXMueSA9IHtcbiAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoUk9XKSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChST1cpLFxuICAgICAgb2Zmc2V0OiBtb2RlbC5maWVsZERlZihST1cpLnNjYWxlLnBhZGRpbmcgLyAyXG4gICAgfTtcblxuICAgIGZhY2V0S2V5cy5wdXNoKG1vZGVsLmZpZWxkKFJPVykpO1xuICAgIHJvb3RBeGVzLnB1c2goY29tcGlsZUF4aXMoUk9XLCBtb2RlbCkpO1xuICAgIGlmIChtb2RlbC5oYXMoWCkpIHtcbiAgICAgIC8vIElmIGhhcyBYLCBwcmVwZW5kIGEgZ3JvdXAgZm9yIHNoYXJlZCB4LWF4ZXMgaW4gdGhlIHJvb3QgZ3JvdXAncyBtYXJrc1xuICAgICAgcm9vdE1hcmtzLnB1c2goZ2V0WEF4ZXNHcm91cChtb2RlbCwgY2VsbFdpZHRoLCBoYXNDb2wpKTtcbiAgICB9XG4gICAgY29uc3Qgcm93QXhpcyA9IG1vZGVsLmZpZWxkRGVmKFJPVykuYXhpcztcbiAgICBpZiAodHlwZW9mIHJvd0F4aXMgPT09ICdib29sZWFuJyB8fCByb3dBeGlzLmdyaWQgIT09IGZhbHNlKSB7XG4gICAgICByb290TWFya3MucHVzaChnZXRSb3dHcmlkR3JvdXAobW9kZWwsIGNlbGxIZWlnaHQpKTtcbiAgICB9XG4gIH0gZWxzZSB7IC8vIGRvZXNuJ3QgaGF2ZSByb3dcbiAgICBpZiAobW9kZWwuaGFzKFgpICYmIG1vZGVsLmZpZWxkRGVmKFgpLmF4aXMpIHsgLy8ga2VlcCB4IGF4aXMgaW4gdGhlIGNlbGxcbiAgICAgIGNlbGxBeGVzLnB1c2goY29tcGlsZUF4aXMoWCwgbW9kZWwpKTtcbiAgICB9XG4gIH1cblxuICAvLyBUT0RPKCM5MCk6IGFkZCBwcm9wZXJ0eSB0byBrZWVwIGF4ZXMgaW4gY2VsbHMgZXZlbiBpZiBjb2x1bW4gaXMgZW5jb2RlZFxuICBpZiAoaGFzQ29sKSB7XG4gICAgaWYgKCFtb2RlbC5pc0RpbWVuc2lvbihDT0xVTU4pKSB7XG4gICAgICAvLyBUT0RPOiBhZGQgZXJyb3IgdG8gbW9kZWwgaW5zdGVhZFxuICAgICAgdXRpbC5lcnJvcignQ29sIGVuY29kaW5nIHNob3VsZCBiZSBvcmRpbmFsLicpO1xuICAgIH1cbiAgICBmYWNldEdyb3VwUHJvcGVydGllcy54ID0ge1xuICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xVTU4pLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKENPTFVNTiksXG4gICAgICBvZmZzZXQ6IG1vZGVsLmZpZWxkRGVmKENPTFVNTikuc2NhbGUucGFkZGluZyAvIDJcbiAgICB9O1xuXG4gICAgZmFjZXRLZXlzLnB1c2gobW9kZWwuZmllbGQoQ09MVU1OKSk7XG4gICAgcm9vdEF4ZXMucHVzaChjb21waWxlQXhpcyhDT0xVTU4sIG1vZGVsKSk7XG5cbiAgICBpZiAobW9kZWwuaGFzKFkpKSB7XG4gICAgICAvLyBJZiBoYXMgWSwgcHJlcGVuZCBhIGdyb3VwIGZvciBzaGFyZWQgeS1heGVzIGluIHRoZSByb290IGdyb3VwJ3MgbWFya3NcbiAgICAgIHJvb3RNYXJrcy5wdXNoKGdldFlBeGVzR3JvdXAobW9kZWwsIGNlbGxIZWlnaHQsIGhhc1JvdykpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbEF4aXMgPSBtb2RlbC5maWVsZERlZihDT0xVTU4pLmF4aXM7XG4gICAgaWYgKHR5cGVvZiBjb2xBeGlzID09PSAnYm9vbGVhbicgfHwgY29sQXhpcy5ncmlkICE9PSBmYWxzZSkge1xuICAgICAgcm9vdE1hcmtzLnB1c2goZ2V0Q29sdW1uR3JpZEdyb3VwKG1vZGVsLCBjZWxsV2lkdGgpKTtcbiAgICB9XG4gIH0gZWxzZSB7IC8vIGRvZXNuJ3QgaGF2ZSBjb2x1bW5cbiAgICBpZiAobW9kZWwuaGFzKFkpICYmIG1vZGVsLmZpZWxkRGVmKFkpLmF4aXMpIHsgLy8ga2VlcCB5IGF4aXMgaW4gdGhlIGNlbGxcbiAgICAgIGNlbGxBeGVzLnB1c2goY29tcGlsZUF4aXMoWSwgbW9kZWwpKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICBsZXQgZmFjZXRHcm91cDogYW55ID0ge1xuICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICdjZWxsJyxcbiAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIGZyb206IHtcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgdHJhbnNmb3JtOiBbe3R5cGU6ICdmYWNldCcsIGdyb3VwYnk6IGZhY2V0S2V5c31dXG4gICAgfSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB1cGRhdGU6IGZhY2V0R3JvdXBQcm9wZXJ0aWVzXG4gICAgfSxcbiAgICBtYXJrczogbWFya3NcbiAgfTtcbiAgaWYgKGNlbGxBeGVzLmxlbmd0aCA+IDApIHtcbiAgICBmYWNldEdyb3VwLmF4ZXMgPSBjZWxsQXhlcztcbiAgfVxuICByb290TWFya3MucHVzaChmYWNldEdyb3VwKTtcblxuICByZXR1cm4ge1xuICAgIG1hcmtzOiByb290TWFya3MsXG4gICAgYXhlczogcm9vdEF4ZXMsXG4gICAgLy8gYXNzdW1pbmcgZXF1YWwgY2VsbFdpZHRoIGhlcmVcbiAgICBzY2FsZXM6IGNvbXBpbGVTY2FsZXMoXG4gICAgICBtb2RlbC5jaGFubmVscygpLCAvLyBUT0RPOiB3aXRoIG5lc3RpbmcsIG5vdCBhbGwgc2NhbGUgbWlnaHQgYmUgYSByb290LWxldmVsXG4gICAgICBtb2RlbFxuICAgIClcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0WEF4ZXNHcm91cChtb2RlbDogTW9kZWwsIGNlbGxXaWR0aCwgaGFzQ29sOiBib29sZWFuKSB7IC8vIFRPRE86IFZnTWFya3NcbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICByZXR1cm4gZXh0ZW5kKHtcbiAgICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICd4LWF4ZXMnLFxuICAgICAgdHlwZTogJ2dyb3VwJ1xuICAgIH0sXG4gICAgaGFzQ29sID8ge1xuICAgICAgZnJvbToge1xuICAgICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFttb2RlbC5maWVsZChDT0xVTU4pXSxcbiAgICAgICAgICBzdW1tYXJpemU6IHsnKic6ICdjb3VudCd9IC8vIGp1c3QgYSBwbGFjZWhvbGRlciBhZ2dyZWdhdGlvblxuICAgICAgICB9XVxuICAgICAgfVxuICAgIH0gOiB7fSxcbiAgICB7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiBjZWxsV2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fSxcbiAgICAgICAgICB4OiBoYXNDb2wgPyB7c2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xVTU4pLCBmaWVsZDogbW9kZWwuZmllbGQoQ09MVU1OKX0gOiB7dmFsdWU6IDB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vZGVsLmZpZWxkRGVmKFgpLmF4aXMgPyB7XG4gICAgICBheGVzOiBbY29tcGlsZUF4aXMoWCwgbW9kZWwpXVxuICAgIH06IHt9XG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldFlBeGVzR3JvdXAobW9kZWw6IE1vZGVsLCBjZWxsSGVpZ2h0LCBoYXNSb3c6IGJvb2xlYW4pIHsgLy8gVE9ETzogVmdNYXJrc1xuICBjb25zdCBuYW1lID0gbW9kZWwuc3BlYygpLm5hbWU7XG4gIHJldHVybiBleHRlbmQoe1xuICAgICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgJ3ktYXhlcycsXG4gICAgICB0eXBlOiAnZ3JvdXAnXG4gICAgfSxcbiAgICBoYXNSb3cgPyB7XG4gICAgICBmcm9tOiB7XG4gICAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogW21vZGVsLmZpZWxkKFJPVyldLFxuICAgICAgICAgIHN1bW1hcml6ZTogeycqJzogJ2NvdW50J30gLy8ganVzdCBhIHBsYWNlaG9sZGVyIGFnZ3JlZ2F0aW9uXG4gICAgICAgIH1dXG4gICAgICB9XG4gICAgfSA6IHt9LFxuICAgIHtcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgd2lkdGg6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX0sXG4gICAgICAgICAgaGVpZ2h0OiBjZWxsSGVpZ2h0LFxuICAgICAgICAgIHk6IGhhc1JvdyA/IHtzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFJPVyksIGZpZWxkOiBtb2RlbC5maWVsZChST1cpfSA6IHt2YWx1ZTogMH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICAgIG1vZGVsLmZpZWxkRGVmKFkpLmF4aXMgPyB7XG4gICAgICBheGVzOiBbY29tcGlsZUF4aXMoWSwgbW9kZWwpXVxuICAgIH06IHt9XG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldFJvd0dyaWRHcm91cChtb2RlbDogTW9kZWwsIGNlbGxIZWlnaHQpOiBhbnkgeyAvLyBUT0RPOiBWZ01hcmtzXG4gIGNvbnN0IG5hbWUgPSBtb2RlbC5zcGVjKCkubmFtZTtcbiAgY29uc3QgY2VsbENvbmZpZyA9IG1vZGVsLmNvbmZpZygpLmNlbGw7XG5cbiAgY29uc3Qgcm93R3JpZCA9IHtcbiAgICBuYW1lOiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyAncm93LWdyaWQnLFxuICAgIHR5cGU6ICdydWxlJyxcbiAgICBmcm9tOiB7XG4gICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIHRyYW5zZm9ybTogW3t0eXBlOiAnZmFjZXQnLCBncm91cGJ5OiBbbW9kZWwuZmllbGQoUk9XKV19XVxuICAgIH0sXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdXBkYXRlOiB7XG4gICAgICAgIHk6IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFJPVyksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFJPVylcbiAgICAgICAgfSxcbiAgICAgICAgeDoge3ZhbHVlOiAwLCBvZmZzZXQ6IC1jZWxsQ29uZmlnLmdyaWRPZmZzZXQgfSxcbiAgICAgICAgeDI6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfSwgb2Zmc2V0OiBjZWxsQ29uZmlnLmdyaWRPZmZzZXQgfSxcbiAgICAgICAgc3Ryb2tlOiB7IHZhbHVlOiBjZWxsQ29uZmlnLmdyaWRDb2xvciB9LFxuICAgICAgICBzdHJva2VPcGFjaXR5OiB7IHZhbHVlOiBjZWxsQ29uZmlnLmdyaWRPcGFjaXR5IH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgcm93R3JpZE9uVG9wID0gIW1vZGVsLmhhcyhYKSB8fCBtb2RlbC5heGlzKFgpLm9yaWVudCAhPT0gJ3RvcCc7XG4gIGlmIChyb3dHcmlkT25Ub3ApIHsgLy8gb24gdG9wIC0gbm8gbmVlZCB0byBhZGQgb2Zmc2V0XG4gICAgcmV0dXJuIHJvd0dyaWQ7XG4gIH0gLy8gb3RoZXJ3aXNlLCBuZWVkIHRvIG9mZnNldCBhbGwgZ3JpZCBieSBjZWxsSGVpZ2h0XG4gIHJldHVybiB7XG4gICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgJ3Jvdy1ncmlkLWdyb3VwJyxcbiAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHVwZGF0ZToge1xuICAgICAgICAvLyBhZGQgZ3JvdXAgb2Zmc2V0ID0gYGNlbGxIZWlnaHQgKyBwYWRkaW5nYCB0byBhdm9pZCBjbGFzaGluZyB3aXRoIGF4aXNcbiAgICAgICAgeTogY2VsbEhlaWdodC52YWx1ZSA/IHtcbiAgICAgICAgICAgIC8vIElmIGNlbGxIZWlnaHQgY29udGFpbnMgdmFsdWUsIGp1c3QgdXNlIGl0LlxuICAgICAgICAgICAgdmFsdWU6IGNlbGxIZWlnaHQsXG4gICAgICAgICAgICBvZmZzZXQ6IG1vZGVsLmZpZWxkRGVmKFJPVykuc2NhbGUucGFkZGluZ1xuICAgICAgICAgIH0gOiB7XG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIG5lZWQgdG8gZ2V0IGl0IGZyb20gbGF5b3V0IGRhdGEgaW4gdGhlIHJvb3QgZ3JvdXBcbiAgICAgICAgICAgIGZpZWxkOiB7cGFyZW50OiAnY2VsbEhlaWdodCd9LFxuICAgICAgICAgICAgb2Zmc2V0OiBtb2RlbC5maWVsZERlZihST1cpLnNjYWxlLnBhZGRpbmdcbiAgICAgICAgICB9LFxuICAgICAgICAvLyBpbmNsdWRlIHdpZHRoIHNvIGl0IGNhbiBiZSByZWZlcnJlZCBpbnNpZGUgcm93LWdyaWRcbiAgICAgICAgd2lkdGg6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1hcmtzOiBbcm93R3JpZF1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29sdW1uR3JpZEdyb3VwKG1vZGVsOiBNb2RlbCwgY2VsbFdpZHRoKTogYW55IHsgLy8gVE9ETzogVmdNYXJrc1xuICBjb25zdCBuYW1lID0gbW9kZWwuc3BlYygpLm5hbWU7XG4gIGNvbnN0IGNlbGxDb25maWcgPSBtb2RlbC5jb25maWcoKS5jZWxsO1xuXG4gIGNvbnN0IGNvbHVtbkdyaWQgPSB7XG4gICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgJ2NvbHVtbi1ncmlkJyxcbiAgICB0eXBlOiAncnVsZScsXG4gICAgZnJvbToge1xuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICB0cmFuc2Zvcm06IFt7dHlwZTogJ2ZhY2V0JywgZ3JvdXBieTogW21vZGVsLmZpZWxkKENPTFVNTildfV1cbiAgICB9LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHVwZGF0ZToge1xuICAgICAgICB4OiB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xVTU4pLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChDT0xVTU4pXG4gICAgICAgIH0sXG4gICAgICAgIHk6IHt2YWx1ZTogMCwgb2Zmc2V0OiAtY2VsbENvbmZpZy5ncmlkT2Zmc2V0fSxcbiAgICAgICAgeTI6IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J30sIG9mZnNldDogY2VsbENvbmZpZy5ncmlkT2Zmc2V0IH0sXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogY2VsbENvbmZpZy5ncmlkQ29sb3IgfSxcbiAgICAgICAgc3Ryb2tlT3BhY2l0eTogeyB2YWx1ZTogY2VsbENvbmZpZy5ncmlkT3BhY2l0eSB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNvbHVtbkdyaWRPbkxlZnQgPSAhbW9kZWwuaGFzKFkpIHx8IG1vZGVsLmF4aXMoWSkub3JpZW50ID09PSAncmlnaHQnO1xuICBpZiAoY29sdW1uR3JpZE9uTGVmdCkgeyAvLyBvbiBsZWZ0LCBubyBuZWVkIHRvIGFkZCBnbG9iYWwgb2Zmc2V0XG4gICAgcmV0dXJuIGNvbHVtbkdyaWQ7XG4gIH0gLy8gb3RoZXJ3aXNlLCBuZWVkIHRvIG9mZnNldCBhbGwgZ3JpZCBieSBjZWxsV2lkdGhcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyAnY29sdW1uLWdyaWQtZ3JvdXAnLFxuICAgIHR5cGU6ICdncm91cCcsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdXBkYXRlOiB7XG4gICAgICAgIC8vIEFkZCBncm91cCBvZmZzZXQgPSBgY2VsbFdpZHRoICsgcGFkZGluZ2AgdG8gYXZvaWQgY2xhc2hpbmcgd2l0aCBheGlzXG4gICAgICAgIHg6IGNlbGxXaWR0aC52YWx1ZSA/IHtcbiAgICAgICAgICAgICAvLyBJZiBjZWxsV2lkdGggY29udGFpbnMgdmFsdWUsIGp1c3QgdXNlIGl0LlxuICAgICAgICAgICAgIHZhbHVlOiBjZWxsV2lkdGgsXG4gICAgICAgICAgICAgb2Zmc2V0OiBtb2RlbC5maWVsZERlZihDT0xVTU4pLnNjYWxlLnBhZGRpbmdcbiAgICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIG5lZWQgdG8gZ2V0IGl0IGZyb20gbGF5b3V0IGRhdGEgaW4gdGhlIHJvb3QgZ3JvdXBcbiAgICAgICAgICAgICBmaWVsZDoge3BhcmVudDogJ2NlbGxXaWR0aCd9LFxuICAgICAgICAgICAgIG9mZnNldDogbW9kZWwuZmllbGREZWYoQ09MVU1OKS5zY2FsZS5wYWRkaW5nXG4gICAgICAgICAgIH0sXG4gICAgICAgIC8vIGluY2x1ZGUgaGVpZ2h0IHNvIGl0IGNhbiBiZSByZWZlcnJlZCBpbnNpZGUgY29sdW1uLWdyaWRcbiAgICAgICAgaGVpZ2h0OiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fVxuICAgICAgfVxuICAgIH0sXG4gICAgbWFya3M6IFtjb2x1bW5HcmlkXVxuICB9O1xufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5cbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFksIFRFWFR9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtURVhUIGFzIFRFWFRfTUFSS30gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge0xBWU9VVH0gZnJvbSAnLi4vZGF0YSc7XG5cbmludGVyZmFjZSBEYXRhUmVmIHtcbiAgZGF0YT86IHN0cmluZztcbiAgZmllbGQ/OiBzdHJpbmc7XG4gIHZhbHVlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExheW91dCB7XG4gIGNlbGxXaWR0aDogTGF5b3V0VmFsdWU7XG4gIGNlbGxIZWlnaHQ6IExheW91dFZhbHVlO1xuICB3aWR0aDogTGF5b3V0VmFsdWU7XG4gIGhlaWdodDogTGF5b3V0VmFsdWU7XG59XG5cbi8vIHZhbHVlIHRoYXQgd2UgY2FuIHB1dCBpbiBzY2FsZSdzIGRvbWFpbi9yYW5nZSAoZWl0aGVyIGEgbnVtYmVyLCBvciBhIGRhdGEgcmVmKVxudHlwZSBMYXlvdXRWYWx1ZSA9IG51bWJlciB8IERhdGFSZWY7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTGF5b3V0KG1vZGVsOiBNb2RlbCk6IExheW91dCB7XG4gIGNvbnN0IGNlbGxXaWR0aCA9IGdldENlbGxXaWR0aChtb2RlbCk7XG4gIGNvbnN0IGNlbGxIZWlnaHQgPSBnZXRDZWxsSGVpZ2h0KG1vZGVsKTtcbiAgcmV0dXJuIHtcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB3aG9sZSBjZWxsXG4gICAgY2VsbFdpZHRoOiBjZWxsV2lkdGgsXG4gICAgY2VsbEhlaWdodDogY2VsbEhlaWdodCxcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjaGFydFxuICAgIHdpZHRoOiBnZXRXaWR0aChtb2RlbCwgY2VsbFdpZHRoKSxcbiAgICBoZWlnaHQ6IGdldEhlaWdodChtb2RlbCwgY2VsbEhlaWdodClcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbFdpZHRoKG1vZGVsOiBNb2RlbCk6IExheW91dFZhbHVlIHtcbiAgaWYgKG1vZGVsLmhhcyhYKSkge1xuICAgIGlmIChtb2RlbC5pc09yZGluYWxTY2FsZShYKSkgeyAvLyBjYWxjdWxhdGUgaW4gZGF0YVxuICAgICAgcmV0dXJuIHtkYXRhOiBMQVlPVVQsIGZpZWxkOiAnY2VsbFdpZHRoJ307XG4gICAgfVxuICAgIHJldHVybiBtb2RlbC5jb25maWcoKS5jZWxsLndpZHRoO1xuICB9XG4gIGlmIChtb2RlbC5tYXJrKCkgPT09IFRFWFRfTUFSSykge1xuICAgIHJldHVybiA5MDsgLy8gVE9ETzogY29uZmlnLnNjYWxlLnRleHRCYW5kV2lkdGhcbiAgfVxuICByZXR1cm4gMjE7IC8vIFRPRE86IGNvbmZpZy5zY2FsZS5iYW5kV2lkdGhcbn1cblxuZnVuY3Rpb24gZ2V0V2lkdGgobW9kZWw6IE1vZGVsLCBjZWxsV2lkdGg6IExheW91dFZhbHVlKTogTGF5b3V0VmFsdWUge1xuICBpZiAobW9kZWwuaGFzKENPTFVNTikpIHsgLy8gY2FsY3VsYXRlIGluIGRhdGFcbiAgICByZXR1cm4ge2RhdGE6IExBWU9VVCwgZmllbGQ6ICd3aWR0aCd9O1xuICB9XG4gIHJldHVybiBjZWxsV2lkdGg7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxIZWlnaHQobW9kZWw6IE1vZGVsKTogTGF5b3V0VmFsdWUge1xuICBpZiAobW9kZWwuaGFzKFkpKSB7XG4gICAgaWYgKG1vZGVsLmlzT3JkaW5hbFNjYWxlKFkpKSB7IC8vIGNhbGN1bGF0ZSBpbiBkYXRhXG4gICAgICByZXR1cm4ge2RhdGE6IExBWU9VVCwgZmllbGQ6ICdjZWxsSGVpZ2h0J307XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtb2RlbC5jb25maWcoKS5jZWxsLmhlaWdodDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi87XG59XG5cbmZ1bmN0aW9uIGdldEhlaWdodChtb2RlbDogTW9kZWwsIGNlbGxIZWlnaHQ6IExheW91dFZhbHVlKTogTGF5b3V0VmFsdWUge1xuICBpZiAobW9kZWwuaGFzKFJPVykpIHtcbiAgICByZXR1cm4ge2RhdGE6IExBWU9VVCwgZmllbGQ6ICdoZWlnaHQnfTtcbiAgfVxuICByZXR1cm4gY2VsbEhlaWdodDtcbn1cbiIsImltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuXG5pbXBvcnQge0NPTE9SLCBTSVpFLCBTSEFQRSwgQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge3RpdGxlIGFzIGZpZWxkVGl0bGV9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7QVJFQSwgQkFSLCBUSUNLLCBURVhULCBMSU5FLCBQT0lOVCwgQ0lSQ0xFLCBTUVVBUkV9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtleHRlbmQsIGtleXN9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge2FwcGx5TWFya0NvbmZpZywgRklMTF9TVFJPS0VfQ09ORklHLCBmb3JtYXRNaXhpbnMgYXMgdXRpbEZvcm1hdE1peGluc30gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVMZWdlbmRzKG1vZGVsOiBNb2RlbCkge1xuICB2YXIgZGVmcyA9IFtdO1xuXG4gIGlmIChtb2RlbC5oYXMoQ09MT1IpICYmIG1vZGVsLmZpZWxkRGVmKENPTE9SKS5sZWdlbmQpIHtcbiAgICBkZWZzLnB1c2goY29tcGlsZUxlZ2VuZChtb2RlbCwgQ09MT1IsIHtcbiAgICAgIGZpbGw6IG1vZGVsLnNjYWxlTmFtZShDT0xPUilcbiAgICAgIC8vIFRPRE86IGNvbnNpZGVyIGlmIHRoaXMgc2hvdWxkIGJlIHN0cm9rZSBmb3IgbGluZVxuICAgIH0pKTtcbiAgfVxuXG4gIGlmIChtb2RlbC5oYXMoU0laRSkgJiYgbW9kZWwuZmllbGREZWYoU0laRSkubGVnZW5kKSB7XG4gICAgZGVmcy5wdXNoKGNvbXBpbGVMZWdlbmQobW9kZWwsIFNJWkUsIHtcbiAgICAgIHNpemU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKVxuICAgIH0pKTtcbiAgfVxuXG4gIGlmIChtb2RlbC5oYXMoU0hBUEUpICYmIG1vZGVsLmZpZWxkRGVmKFNIQVBFKS5sZWdlbmQpIHtcbiAgICBkZWZzLnB1c2goY29tcGlsZUxlZ2VuZChtb2RlbCwgU0hBUEUsIHtcbiAgICAgIHNoYXBlOiBtb2RlbC5zY2FsZU5hbWUoU0hBUEUpXG4gICAgfSkpO1xuICB9XG4gIHJldHVybiBkZWZzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUxlZ2VuZChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIGRlZikge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICBjb25zdCBsZWdlbmQgPSBmaWVsZERlZi5sZWdlbmQ7XG5cbiAgLy8gMS4xIEFkZCBwcm9wZXJ0aWVzIHdpdGggc3BlY2lhbCBydWxlc1xuICBkZWYudGl0bGUgPSB0aXRsZShmaWVsZERlZik7XG5cbiAgZXh0ZW5kKGRlZiwgZm9ybWF0TWl4aW5zKG1vZGVsLCBjaGFubmVsKSk7XG5cbiAgLy8gMS4yIEFkZCBwcm9wZXJ0aWVzIHdpdGhvdXQgcnVsZXNcbiAgWydvcmllbnQnLCAndmFsdWVzJ10uZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIGNvbnN0IHZhbHVlID0gbGVnZW5kW3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gMikgQWRkIG1hcmsgcHJvcGVydHkgZGVmaW5pdGlvbiBncm91cHNcbiAgY29uc3QgcHJvcHMgPSAodHlwZW9mIGxlZ2VuZCAhPT0gJ2Jvb2xlYW4nICYmIGxlZ2VuZC5wcm9wZXJ0aWVzKSB8fCB7fTtcbiAgWyd0aXRsZScsICdzeW1ib2xzJywgJ2xlZ2VuZCddLmZvckVhY2goZnVuY3Rpb24oZ3JvdXApIHtcbiAgICBsZXQgdmFsdWUgPSBwcm9wZXJ0aWVzW2dyb3VwXSA/XG4gICAgICBwcm9wZXJ0aWVzW2dyb3VwXShmaWVsZERlZiwgcHJvcHNbZ3JvdXBdLCBtb2RlbCwgY2hhbm5lbCkgOiAvLyBhcHBseSBydWxlXG4gICAgICBwcm9wc1tncm91cF07IC8vIG5vIHJ1bGUgLS0ganVzdCBkZWZhdWx0IHZhbHVlc1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWYucHJvcGVydGllcyA9IGRlZi5wcm9wZXJ0aWVzIHx8IHt9O1xuICAgICAgZGVmLnByb3BlcnRpZXNbZ3JvdXBdID0gdmFsdWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUoZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIGNvbnN0IGxlZ2VuZCA9IGZpZWxkRGVmLmxlZ2VuZDtcbiAgaWYgKHR5cGVvZiBsZWdlbmQgIT09ICdib29sZWFuJyAmJiBsZWdlbmQudGl0bGUpIHtcbiAgICByZXR1cm4gbGVnZW5kLnRpdGxlO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkVGl0bGUoZmllbGREZWYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TWl4aW5zKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIC8vIElmIHRoZSBjaGFubmVsIGlzIGJpbm5lZCwgd2Ugc2hvdWxkIG5vdCBzZXQgdGhlIGZvcm1hdCBiZWNhdXNlIHdlIGhhdmUgYSByYW5nZSBsYWJlbFxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3QgbGVnZW5kID0gZmllbGREZWYubGVnZW5kO1xuICByZXR1cm4gdXRpbEZvcm1hdE1peGlucyhtb2RlbCwgY2hhbm5lbCwgdHlwZW9mIGxlZ2VuZCAhPT0gJ2Jvb2xlYW4nID8gbGVnZW5kLmZvcm1hdCA6IHVuZGVmaW5lZCk7XG59XG5cbm5hbWVzcGFjZSBwcm9wZXJ0aWVzIHtcbiAgZXhwb3J0IGZ1bmN0aW9uIHN5bWJvbHMoZmllbGREZWY6IEZpZWxkRGVmLCBzeW1ib2xzU3BlYywgbW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgbGV0IHN5bWJvbHM6YW55ID0ge307XG4gICAgY29uc3QgbWFyayA9IG1vZGVsLm1hcmsoKTtcblxuICAgIHN3aXRjaCAobWFyaykge1xuICAgICAgY2FzZSBCQVI6XG4gICAgICBjYXNlIFRJQ0s6XG4gICAgICBjYXNlIFRFWFQ6XG4gICAgICAgIHN5bWJvbHMuc2hhcGUgPSB7dmFsdWU6ICdzcXVhcmUnfTtcblxuICAgICAgICAvLyBzZXQgc3Ryb2tlIHRvIHRyYW5zcGFyZW50IGJ5IGRlZmF1bHQgdW5sZXNzIHRoZXJlIGlzIGEgY29uZmlnIGZvciBzdHJva2VcbiAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7dmFsdWU6ICd0cmFuc3BhcmVudCd9O1xuICAgICAgICBhcHBseU1hcmtDb25maWcoc3ltYm9scywgbW9kZWwsIEZJTExfU1RST0tFX0NPTkZJRyk7XG5cbiAgICAgICAgLy8gbm8gbmVlZCB0byBhcHBseSBjb2xvciB0byBmaWxsIGFzIHRoZXkgYXJlIHNldCBhdXRvbWF0aWNhbGx5XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIENJUkNMRTpcbiAgICAgIGNhc2UgU1FVQVJFOlxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1zd2l0Y2gtY2FzZS1mYWxsLXRocm91Z2ggKi9cbiAgICAgICAgc3ltYm9scy5zaGFwZSA9IHt2YWx1ZTogbWFya307XG4gICAgICAgIC8qIHRzbGludDplbmFibGU6bm8tc3dpdGNoLWNhc2UtZmFsbC10aHJvdWdoICovXG4gICAgICBjYXNlIFBPSU5UOlxuICAgICAgICAvLyBmaWxsIG9yIHN0cm9rZVxuICAgICAgICBpZiAobW9kZWwuY29uZmlnKCkubWFyay5maWxsZWQpIHsgLy8gZmlsbGVkXG4gICAgICAgICAgLy8gc2V0IHN0cm9rZSB0byB0cmFuc3BhcmVudCBieSBkZWZhdWx0IHVubGVzcyB0aGVyZSBpcyBhIGNvbmZpZyBmb3Igc3Ryb2tlXG4gICAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7dmFsdWU6ICd0cmFuc3BhcmVudCd9O1xuICAgICAgICAgIGFwcGx5TWFya0NvbmZpZyhzeW1ib2xzLCBtb2RlbCwgRklMTF9TVFJPS0VfQ09ORklHKTtcblxuICAgICAgICAgIGlmIChtb2RlbC5oYXMoQ09MT1IpICYmIGNoYW5uZWwgPT09IENPTE9SKSB7XG4gICAgICAgICAgICBzeW1ib2xzLmZpbGwgPSB7c2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xPUiksIGZpZWxkOiAnZGF0YSd9O1xuICAgICAgICAgIH0gZWxzZSBpZiAobW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlKSB7XG4gICAgICAgICAgICBzeW1ib2xzLmZpbGwgPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZX07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN5bWJvbHMuZmlsbCA9IHt2YWx1ZTogbW9kZWwuY29uZmlnKCkubWFyay5jb2xvcn07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBzdHJva2VkXG4gICAgICAgICAgLy8gc2V0IGZpbGwgdG8gdHJhbnNwYXJlbnQgYnkgZGVmYXVsdCB1bmxlc3MgdGhlcmUgaXMgYSBjb25maWcgZm9yIHN0cm9rZVxuICAgICAgICAgIHN5bWJvbHMuZmlsbCA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XG4gICAgICAgICAgYXBwbHlNYXJrQ29uZmlnKHN5bWJvbHMsIG1vZGVsLCBGSUxMX1NUUk9LRV9DT05GSUcpO1xuXG4gICAgICAgICAgaWYgKG1vZGVsLmhhcyhDT0xPUikgJiYgY2hhbm5lbCA9PT0gQ09MT1IpIHtcbiAgICAgICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3NjYWxlOiBtb2RlbC5zY2FsZU5hbWUoQ09MT1IpLCBmaWVsZDogJ2RhdGEnfTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZSkge1xuICAgICAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZX07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiBtb2RlbC5jb25maWcoKS5tYXJrLmNvbG9yfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTElORTpcbiAgICAgIGNhc2UgQVJFQTpcbiAgICAgICAgLy8gc2V0IHN0cm9rZSB0byB0cmFuc3BhcmVudCBieSBkZWZhdWx0IHVubGVzcyB0aGVyZSBpcyBhIGNvbmZpZyBmb3Igc3Ryb2tlXG4gICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcbiAgICAgICAgYXBwbHlNYXJrQ29uZmlnKHN5bWJvbHMsIG1vZGVsLCBGSUxMX1NUUk9LRV9DT05GSUcpO1xuXG4gICAgICAgIC8vIFRPRE8gdXNlIHNoYXBlIGhlcmUgYWZ0ZXIgaW1wbGVtZW50aW5nICM1MDhcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgc3ltYm9scyA9IGV4dGVuZChzeW1ib2xzLCBzeW1ib2xzU3BlYyB8fCB7fSk7XG5cbiAgICByZXR1cm4ga2V5cyhzeW1ib2xzKS5sZW5ndGggPiAwID8gc3ltYm9scyA6IHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge1gsIFl9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHthcHBseUNvbG9yQW5kT3BhY2l0eSwgYXBwbHlNYXJrQ29uZmlnfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgbmFtZXNwYWNlIGFyZWEge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdhcmVhJztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxuICAgIHZhciBwOiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IG9yaWVudCA9IG1vZGVsLmNvbmZpZygpLm1hcmsub3JpZW50O1xuICAgIGlmIChvcmllbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcC5vcmllbnQgPSB7IHZhbHVlOiBvcmllbnQgfTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFjayA9IG1vZGVsLnN0YWNrKCk7XG4gICAgLy8geFxuICAgIGlmIChzdGFjayAmJiBYID09PSBzdGFjay5maWVsZENoYW5uZWwpIHsgLy8gU3RhY2tlZCBNZWFzdXJlXG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IHN1ZmZpeDogJ19zdGFydCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5pc01lYXN1cmUoWCkpIHsgLy8gTWVhc3VyZVxuICAgICAgcC54ID0geyBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLCBmaWVsZDogbW9kZWwuZmllbGQoWCkgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmlzRGltZW5zaW9uKFgpKSB7XG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHgyXG4gICAgaWYgKG9yaWVudCA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBpZiAoc3RhY2sgJiYgWCA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XG4gICAgICAgIHAueDIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBzdWZmaXg6ICdfZW5kJyB9KVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcC54MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChzdGFjayAmJiBZID09PSBzdGFjay5maWVsZENoYW5uZWwpIHsgLy8gU3RhY2tlZCBNZWFzdXJlXG4gICAgICBwLnkgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IHN1ZmZpeDogJ19zdGFydCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5pc01lYXN1cmUoWSkpIHtcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobW9kZWwuaXNEaW1lbnNpb24oWSkpIHtcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKG9yaWVudCAhPT0gJ2hvcml6b250YWwnKSB7IC8vICd2ZXJ0aWNhbCcgb3IgdW5kZWZpbmVkIGFyZSB2ZXJ0aWNhbFxuICAgICAgaWYgKHN0YWNrICYmIFkgPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xuICAgICAgICBwLnkyID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgc3VmZml4OiAnX2VuZCcgfSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAueTIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsKTtcbiAgICBhcHBseU1hcmtDb25maWcocCwgbW9kZWwsIFsnaW50ZXJwb2xhdGUnLCAndGVuc2lvbiddKTtcbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBTSVpFfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlDb2xvckFuZE9wYWNpdHl9IGZyb20gJy4vdXRpbCc7XG5cblxuZXhwb3J0IG5hbWVzcGFjZSBiYXIge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdyZWN0JztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxuICAgIGxldCBwOiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IG9yaWVudCA9IG1vZGVsLmNvbmZpZygpLm1hcmsub3JpZW50O1xuXG4gICAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaygpO1xuICAgIC8vIHgsIHgyLCBhbmQgd2lkdGggLS0gd2UgbXVzdCBzcGVjaWZ5IHR3byBvZiB0aGVzZSBpbiBhbGwgY29uZGl0aW9uc1xuICAgIGlmIChzdGFjayAmJiBYID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcbiAgICAgIC8vICd4JyBpcyBhIHN0YWNrZWQgbWVhc3VyZSwgdGh1cyB1c2UgPGZpZWxkPl9zdGFydCBhbmQgPGZpZWxkPl9lbmQgZm9yIHgsIHgyLlxuICAgICAgcC54ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBzdWZmaXg6ICdfc3RhcnQnIH0pXG4gICAgICB9O1xuICAgICAgcC54MiA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgc3VmZml4OiAnX2VuZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5pc01lYXN1cmUoWCkpIHtcbiAgICAgIGlmIChvcmllbnQgPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBwLnggPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWClcbiAgICAgICAgfTtcbiAgICAgICAgcC54MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgeyAvLyB2ZXJ0aWNhbFxuICAgICAgICBwLnhjID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpXG4gICAgICAgIH07XG4gICAgICAgIHAud2lkdGggPSB7dmFsdWU6IG1vZGVsLnNpemVWYWx1ZShYKX07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtb2RlbC5maWVsZERlZihYKS5iaW4pIHtcbiAgICAgIGlmIChtb2RlbC5oYXMoU0laRSkgJiYgb3JpZW50ICE9PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgLy8gRm9yIHZlcnRpY2FsIGNoYXJ0IHRoYXQgaGFzIGJpbm5lZCBYIGFuZCBzaXplLFxuICAgICAgICAvLyBjZW50ZXIgYmFyIGFuZCBhcHBseSBzaXplIHRvIHdpZHRoLlxuICAgICAgICBwLnhjID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgICAgfTtcbiAgICAgICAgcC53aWR0aCA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcC54ID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX3N0YXJ0JyB9KSxcbiAgICAgICAgICBvZmZzZXQ6IDFcbiAgICAgICAgfTtcbiAgICAgICAgcC54MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19lbmQnIH0pXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8geCBpcyBkaW1lbnNpb24gb3IgdW5zcGVjaWZpZWRcbiAgICAgIGlmIChtb2RlbC5oYXMoWCkpIHsgLy8gaXMgb3JkaW5hbFxuICAgICAgIHAueGMgPSB7XG4gICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpXG4gICAgICAgfTtcbiAgICAgfSBlbHNlIHsgLy8gbm8geFxuICAgICAgICBwLnggPSB7IHZhbHVlOiAwLCBvZmZzZXQ6IDIgfTtcbiAgICAgIH1cblxuICAgICAgcC53aWR0aCA9IG1vZGVsLmhhcyhTSVpFKSAmJiBvcmllbnQgIT09ICdob3Jpem9udGFsJyA/IHtcbiAgICAgICAgICAvLyBhcHBseSBzaXplIHNjYWxlIGlmIGhhcyBzaXplIGFuZCBpcyB2ZXJ0aWNhbCAoZXhwbGljaXQgXCJ2ZXJ0aWNhbFwiIG9yIHVuZGVmaW5lZClcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxuICAgICAgICB9IDoge1xuICAgICAgICAgIC8vIG90aGVyd2lzZSwgdXNlIGZpeGVkIHNpemVcbiAgICAgICAgICB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKFgpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8geSwgeTIgJiBoZWlnaHQgLS0gd2UgbXVzdCBzcGVjaWZ5IHR3byBvZiB0aGVzZSBpbiBhbGwgY29uZGl0aW9uc1xuICAgIGlmIChzdGFjayAmJiBZID09PSBzdGFjay5maWVsZENoYW5uZWwpIHsgLy8geSBpcyBzdGFja2VkIG1lYXN1cmVcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgc3VmZml4OiAnX3N0YXJ0JyB9KVxuICAgICAgfTtcbiAgICAgIHAueTIgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IHN1ZmZpeDogJ19lbmQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobW9kZWwuaXNNZWFzdXJlKFkpKSB7XG4gICAgICBpZiAob3JpZW50ICE9PSAnaG9yaXpvbnRhbCcpIHsgLy8gdmVydGljYWwgKGV4cGxpY2l0ICd2ZXJ0aWNhbCcgb3IgdW5kZWZpbmVkKVxuICAgICAgICBwLnkgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSlcbiAgICAgICAgfTtcbiAgICAgICAgcC55MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLnljID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpXG4gICAgICAgIH07XG4gICAgICAgIHAuaGVpZ2h0ID0geyB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKFkpIH07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtb2RlbC5maWVsZERlZihZKS5iaW4pIHtcbiAgICAgIGlmIChtb2RlbC5oYXMoU0laRSkgJiYgb3JpZW50ID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgLy8gRm9yIGhvcml6b250YWwgY2hhcnQgdGhhdCBoYXMgYmlubmVkIFkgYW5kIHNpemUsXG4gICAgICAgIC8vIGNlbnRlciBiYXIgYW5kIGFwcGx5IHNpemUgdG8gaGVpZ2h0LlxuICAgICAgICBwLnljID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgICAgfTtcbiAgICAgICAgcC5oZWlnaHQgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSwgc2ltcGx5IHVzZSA8ZmllbGQ+X3N0YXJ0LCA8ZmllbGQ+X2VuZFxuICAgICAgICBwLnkgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfc3RhcnQnIH0pXG4gICAgICAgIH07XG4gICAgICAgIHAueTIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfZW5kJyB9KSxcbiAgICAgICAgICBvZmZzZXQ6IDFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyB5IGlzIG9yZGluYWwgb3IgdW5zcGVjaWZpZWRcblxuICAgICAgaWYgKG1vZGVsLmhhcyhZKSkgeyAvLyBpcyBvcmRpbmFsXG4gICAgICAgIHAueWMgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7IC8vIE5vIFlcbiAgICAgICAgcC55MiA9IHtcbiAgICAgICAgICBmaWVsZDogeyBncm91cDogJ2hlaWdodCcgfSxcbiAgICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHAuaGVpZ2h0ID0gbW9kZWwuaGFzKFNJWkUpICAmJiBvcmllbnQgPT09ICdob3Jpem9udGFsJyA/IHtcbiAgICAgICAgICAvLyBhcHBseSBzaXplIHNjYWxlIGlmIGhhcyBzaXplIGFuZCBpcyBob3Jpem9udGFsXG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgICAgfSA6IHtcbiAgICAgICAgICB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKFkpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXBwbHlDb2xvckFuZE9wYWNpdHkocCwgbW9kZWwpO1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhYmVscyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPKCM2NCk6IGZpbGwgdGhpcyBtZXRob2RcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7WCwgWX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2FwcGx5Q29sb3JBbmRPcGFjaXR5LCBhcHBseU1hcmtDb25maWcsIENvbG9yTW9kZX0gZnJvbSAnLi91dGlsJztcblxuXG5leHBvcnQgbmFtZXNwYWNlIGxpbmUge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdsaW5lJztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxuICAgIHZhciBwOiBhbnkgPSB7fTtcblxuICAgIC8vIHhcbiAgICBpZiAobW9kZWwuaGFzKFgpKSB7XG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnggPSB7IHZhbHVlOiAwIH07XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChtb2RlbC5oYXMoWSkpIHtcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueSA9IHsgZmllbGQ6IHsgZ3JvdXA6ICdoZWlnaHQnIH0gfTtcbiAgICB9XG5cbiAgICBhcHBseUNvbG9yQW5kT3BhY2l0eShwLCBtb2RlbCwgQ29sb3JNb2RlLkFMV0FZU19TVFJPS0VEKTtcbiAgICBhcHBseU1hcmtDb25maWcocCwgbW9kZWwsIFsnaW50ZXJwb2xhdGUnLCAndGVuc2lvbiddKTtcbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBTSEFQRSwgU0laRX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2FwcGx5Q29sb3JBbmRPcGFjaXR5LCBDb2xvck1vZGV9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgcG9pbnQge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdzeW1ib2wnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsLCBmaXhlZFNoYXBlPzogc3RyaW5nKSB7XG4gICAgLy8gVE9ETyBVc2UgVmVnYSdzIG1hcmtzIHByb3BlcnRpZXMgaW50ZXJmYWNlXG4gICAgdmFyIHA6IGFueSA9IHt9O1xuXG4gICAgLy8geFxuICAgIGlmIChtb2RlbC5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueCA9IHsgdmFsdWU6IDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi8gLyAyIH07XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChtb2RlbC5oYXMoWSkpIHtcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueSA9IHsgdmFsdWU6IDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi8gLyAyIH07XG4gICAgfVxuXG4gICAgLy8gc2l6ZVxuICAgIGlmIChtb2RlbC5oYXMoU0laRSkpIHtcbiAgICAgIHAuc2l6ZSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnNpemUgPSB7IHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoKSB9O1xuICAgIH1cblxuICAgIC8vIHNoYXBlXG4gICAgaWYgKGZpeGVkU2hhcGUpIHsgLy8gc3F1YXJlIGFuZCBjaXJjbGUgbWFya3NcbiAgICAgIHAuc2hhcGUgPSB7IHZhbHVlOiBmaXhlZFNoYXBlIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5oYXMoU0hBUEUpKSB7XG4gICAgICBwLnNoYXBlID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNIQVBFKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNIQVBFKVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmZpZWxkRGVmKFNIQVBFKS52YWx1ZSkge1xuICAgICAgcC5zaGFwZSA9IHsgdmFsdWU6IG1vZGVsLmZpZWxkRGVmKFNIQVBFKS52YWx1ZSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnNoYXBlID0geyB2YWx1ZTogbW9kZWwuY29uZmlnKCkubWFyay5zaGFwZSB9O1xuICAgIH1cblxuICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsLFxuICAgICAgLy8gc3F1YXJlIGFuZCBjaXJjbGUgYXJlIGZpbGxlZCBieSBkZWZhdWx0LCBidXQgcG9pbnQgaXMgc3Ryb2tlZCBieSBkZWZhdWx0LlxuICAgICAgZml4ZWRTaGFwZSA/IENvbG9yTW9kZS5GSUxMRURfQllfREVGQVVMVCA6IENvbG9yTW9kZS5TVFJPS0VEX0JZX0RFRkFVTFRcbiAgICApO1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhYmVscyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPKCMyNDApOiBmaWxsIHRoaXMgbWV0aG9kXG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBjaXJjbGUge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdzeW1ib2wnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIHBvaW50LnByb3BlcnRpZXMobW9kZWwsICdjaXJjbGUnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBzcXVhcmUge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdzeW1ib2wnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIHBvaW50LnByb3BlcnRpZXMobW9kZWwsICdzcXVhcmUnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBDT0xPUiwgVEVYVCwgU0laRX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2FwcGx5TWFya0NvbmZpZywgYXBwbHlDb2xvckFuZE9wYWNpdHksIGZvcm1hdE1peGluc30gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7ZXh0ZW5kLCBjb250YWluc30gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge1FVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuXG5leHBvcnQgbmFtZXNwYWNlIHRleHQge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICd0ZXh0JztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBiYWNrZ3JvdW5kKG1vZGVsOiBNb2RlbCkge1xuICAgIHJldHVybiB7XG4gICAgICB4OiB7IHZhbHVlOiAwIH0sXG4gICAgICB5OiB7IHZhbHVlOiAwIH0sXG4gICAgICB3aWR0aDogeyBmaWVsZDogeyBncm91cDogJ3dpZHRoJyB9IH0sXG4gICAgICBoZWlnaHQ6IHsgZmllbGQ6IHsgZ3JvdXA6ICdoZWlnaHQnIH0gfSxcbiAgICAgIGZpbGw6IHsgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xPUiksIGZpZWxkOiBtb2RlbC5maWVsZChDT0xPUikgfVxuICAgIH07XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJvcGVydGllcyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPIFVzZSBWZWdhJ3MgbWFya3MgcHJvcGVydGllcyBpbnRlcmZhY2VcbiAgICBsZXQgcDogYW55ID0ge307XG4gICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihURVhUKTtcblxuICAgIC8vIHhcbiAgICBpZiAobW9kZWwuaGFzKFgpKSB7XG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7IC8vIFRPRE86IHN1cHBvcnQgeC52YWx1ZSwgeC5kYXR1bVxuICAgICAgaWYgKG1vZGVsLmhhcyhURVhUKSAmJiBtb2RlbC5maWVsZERlZihURVhUKS50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICAgICAgcC54ID0geyBmaWVsZDogeyBncm91cDogJ3dpZHRoJyB9LCBvZmZzZXQ6IC01IH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLnggPSB7IHZhbHVlOiA5MCAvIDIgfTsgLy8gVE9ETzogY29uZmlnLnNjYWxlLnRleHRCYW5kV2lkdGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKG1vZGVsLmhhcyhZKSkge1xuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC55ID0geyB2YWx1ZTogMjEgLyAyIH07IC8vIFRPRE86IGNvbmZpZy5zY2FsZS5iYW5kV2lkdGhcbiAgICB9XG5cbiAgICAvLyBzaXplXG4gICAgaWYgKG1vZGVsLmhhcyhTSVpFKSkge1xuICAgICAgcC5mb250U2l6ZSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLmZvbnRTaXplID0geyB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKCkgfTtcbiAgICB9XG5cbiAgICBpZiAobW9kZWwuY29uZmlnKCkubWFyay5hcHBseUNvbG9yVG9CYWNrZ3JvdW5kICYmICFtb2RlbC5oYXMoWCkgJiYgIW1vZGVsLmhhcyhZKSkge1xuICAgICAgcC5maWxsID0ge3ZhbHVlOiAnYmxhY2snfTsgLy8gVE9ETzogYWRkIHJ1bGVzIGZvciBzd2FwcGluZyBiZXR3ZWVuIGJsYWNrIGFuZCB3aGl0ZVxuXG4gICAgICAvLyBvcGFjaXR5XG4gICAgICBjb25zdCBvcGFjaXR5ID0gbW9kZWwuY29uZmlnKCkubWFyay5vcGFjaXR5O1xuICAgICAgaWYgKG9wYWNpdHkpIHsgcC5vcGFjaXR5ID0geyB2YWx1ZTogb3BhY2l0eSB9OyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHBseUNvbG9yQW5kT3BhY2l0eShwLCBtb2RlbCk7XG4gICAgfVxuXG5cbiAgICAvLyB0ZXh0XG4gICAgaWYgKG1vZGVsLmhhcyhURVhUKSkge1xuICAgICAgaWYgKGNvbnRhaW5zKFtRVUFOVElUQVRJVkUsIFRFTVBPUkFMXSwgbW9kZWwuZmllbGREZWYoVEVYVCkudHlwZSkpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0ID0gbW9kZWwuY29uZmlnKCkubWFyay5mb3JtYXQ7XG4gICAgICAgIGV4dGVuZChwLCBmb3JtYXRNaXhpbnMobW9kZWwsIFRFWFQsIGZvcm1hdCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcC50ZXh0ID0geyBmaWVsZDogbW9kZWwuZmllbGQoVEVYVCkgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcC50ZXh0ID0geyB2YWx1ZTogZmllbGREZWYudmFsdWUgfTtcbiAgICB9XG5cbiAgICBhcHBseU1hcmtDb25maWcocCwgbW9kZWwsXG4gICAgICBbJ2FuZ2xlJywgJ2FsaWduJywgJ2Jhc2VsaW5lJywgJ2R4JywgJ2R5JywgJ2ZvbnQnLCAnZm9udFdlaWdodCcsXG4gICAgICAgICdmb250U3R5bGUnLCAncmFkaXVzJywgJ3RoZXRhJ10pO1xuXG4gICAgcmV0dXJuIHA7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBTSVpFfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlDb2xvckFuZE9wYWNpdHksIENvbG9yTW9kZX0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IG5hbWVzcGFjZSB0aWNrIHtcbiAgZXhwb3J0IGZ1bmN0aW9uIG1hcmtUeXBlKCkge1xuICAgIHJldHVybiAncmVjdCc7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJvcGVydGllcyhtb2RlbDogTW9kZWwpIHtcbiAgICB2YXIgcDogYW55ID0ge307XG5cbiAgICAvLyB4XG4gICAgaWYgKG1vZGVsLmhhcyhYKSkge1xuICAgICAgcC54YyA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueGMgPSB7IHZhbHVlOiAyMSAvKiBjb25maWcuc2NhbGUuYmFuZFdpZHRoICovIC8gMiB9O1xuICAgIH1cblxuICAgIC8vIHlcbiAgICBpZiAobW9kZWwuaGFzKFkpKSB7XG4gICAgICBwLnljID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC55YyA9IHsgdmFsdWU6IDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi8gLyAyIH07XG4gICAgfVxuXG4gICAgaWYgKG1vZGVsLmNvbmZpZygpLm1hcmsub3JpZW50ID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIHAud2lkdGggPSB7IHZhbHVlOiBtb2RlbC5jb25maWcoKS5tYXJrLnRoaWNrbmVzcyB9O1xuICAgICAgcC5oZWlnaHQgPSBtb2RlbC5oYXMoU0laRSk/IHtcbiAgICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoU0laRSksXG4gICAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgICAgfSA6IHtcbiAgICAgICAgICAgIHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoWSlcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC53aWR0aCA9IG1vZGVsLmhhcyhTSVpFKT8ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoU0laRSksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXG4gICAgICAgIH0gOiB7XG4gICAgICAgICAgdmFsdWU6IG1vZGVsLnNpemVWYWx1ZShYKVxuICAgICAgICB9O1xuICAgICAgcC5oZWlnaHQgPSB7IHZhbHVlOiBtb2RlbC5jb25maWcoKS5tYXJrLnRoaWNrbmVzcyB9O1xuICAgIH1cblxuICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsLCBDb2xvck1vZGUuQUxXQVlTX0ZJTExFRCk7XG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbGFiZWxzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8oIzI0MCk6IGZpbGwgdGhpcyBtZXRob2RcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7WCwgWSwgQ09MT1IsIFRFWFQsIFNIQVBFLCBQQVRILCBERVRBSUwsIFJPVywgQ09MVU1OLCBMQUJFTH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2ZpZWxkfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge0FSRUEsIExJTkUsIFRFWFQgYXMgVEVYVE1BUkt9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtpbXB1dGVUcmFuc2Zvcm0sIHN0YWNrVHJhbnNmb3JtfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7Y29udGFpbnMsIGV4dGVuZCwgaXNBcnJheX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge2FyZWF9IGZyb20gJy4vbWFyay1hcmVhJztcbmltcG9ydCB7YmFyfSBmcm9tICcuL21hcmstYmFyJztcbmltcG9ydCB7bGluZX0gZnJvbSAnLi9tYXJrLWxpbmUnO1xuaW1wb3J0IHtwb2ludCwgY2lyY2xlLCBzcXVhcmV9IGZyb20gJy4vbWFyay1wb2ludCc7XG5pbXBvcnQge3RleHR9IGZyb20gJy4vbWFyay10ZXh0JztcbmltcG9ydCB7dGlja30gZnJvbSAnLi9tYXJrLXRpY2snO1xuXG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcblxuY29uc3QgbWFya0NvbXBpbGVyID0ge1xuICBhcmVhOiBhcmVhLFxuICBiYXI6IGJhcixcbiAgbGluZTogbGluZSxcbiAgcG9pbnQ6IHBvaW50LFxuICB0ZXh0OiB0ZXh0LFxuICB0aWNrOiB0aWNrLFxuICBjaXJjbGU6IGNpcmNsZSxcbiAgc3F1YXJlOiBzcXVhcmVcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTWFyayhtb2RlbDogTW9kZWwpOiBhbnlbXSB7XG4gIGlmIChjb250YWlucyhbTElORSwgQVJFQV0sIG1vZGVsLm1hcmsoKSkpIHtcbiAgICByZXR1cm4gY29tcGlsZVBhdGhNYXJrKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29tcGlsZU5vblBhdGhNYXJrKG1vZGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21waWxlUGF0aE1hcmsobW9kZWw6IE1vZGVsKSB7IC8vIFRPRE86IGV4dHJhY3QgdGhpcyBpbnRvIGNvbXBpbGVQYXRoTWFya1xuICBjb25zdCBtYXJrID0gbW9kZWwubWFyaygpO1xuICBjb25zdCBuYW1lID0gbW9kZWwuc3BlYygpLm5hbWU7XG4gIGNvbnN0IGlzRmFjZXRlZCA9IG1vZGVsLmhhcyhST1cpIHx8IG1vZGVsLmhhcyhDT0xVTU4pO1xuICBjb25zdCBkYXRhRnJvbSA9IHtkYXRhOiBtb2RlbC5kYXRhVGFibGUoKX07XG4gIGNvbnN0IGRldGFpbHMgPSBkZXRhaWxGaWVsZHMobW9kZWwpO1xuXG4gIGxldCBwYXRoTWFya3M6IGFueSA9IFtleHRlbmQoXG4gICAgbmFtZSA/IHsgbmFtZTogbmFtZSArICctbWFya3MnIH0gOiB7fSxcbiAgICB7XG4gICAgICB0eXBlOiBtYXJrQ29tcGlsZXJbbWFya10ubWFya1R5cGUoKSxcbiAgICAgIGZyb206IGV4dGVuZChcbiAgICAgICAgLy8gSWYgaGFzIGZhY2V0LCBgZnJvbS5kYXRhYCB3aWxsIGJlIGFkZGVkIGluIHRoZSBjZWxsIGdyb3VwLlxuICAgICAgICAvLyBJZiBoYXMgc3ViZmFjZXQgZm9yIGxpbmUvYXJlYSBncm91cCwgYGZyb20uZGF0YWAgd2lsbCBiZSBhZGRlZCBpbiB0aGUgb3V0ZXIgc3ViZmFjZXQgZ3JvdXAgYmVsb3cuXG4gICAgICAgIC8vIElmIGhhcyBubyBzdWJmYWNldCwgYWRkIGZyb20uZGF0YS5cbiAgICAgICAgaXNGYWNldGVkIHx8IGRldGFpbHMubGVuZ3RoID4gMCA/IHt9IDogZGF0YUZyb20sXG5cbiAgICAgICAgLy8gc29ydCB0cmFuc2Zvcm1cbiAgICAgICAge3RyYW5zZm9ybTogW3sgdHlwZTogJ3NvcnQnLCBieTogc29ydFBhdGhCeShtb2RlbCl9XX1cbiAgICAgICksXG4gICAgICBwcm9wZXJ0aWVzOiB7IHVwZGF0ZTogbWFya0NvbXBpbGVyW21hcmtdLnByb3BlcnRpZXMobW9kZWwpIH1cbiAgICB9XG4gICldO1xuXG4gIGlmIChkZXRhaWxzLmxlbmd0aCA+IDApIHsgLy8gaGF2ZSBsZXZlbCBvZiBkZXRhaWxzIC0gbmVlZCB0byBmYWNldCBsaW5lIGludG8gc3ViZ3JvdXBzXG4gICAgY29uc3QgZmFjZXRUcmFuc2Zvcm0gPSB7IHR5cGU6ICdmYWNldCcsIGdyb3VwYnk6IGRldGFpbHMgfTtcbiAgICBjb25zdCB0cmFuc2Zvcm06IGFueVtdID0gbWFyayA9PT0gQVJFQSAmJiBtb2RlbC5zdGFjaygpID9cbiAgICAgIC8vIEZvciBzdGFja2VkIGFyZWEsIHdlIG5lZWQgdG8gaW1wdXRlIG1pc3NpbmcgdHVwbGVzIGFuZCBzdGFjayB2YWx1ZXNcbiAgICAgIC8vIChNYXJrIGxheWVyIG9yZGVyIGRvZXMgbm90IG1hdHRlciBmb3Igc3RhY2tlZCBjaGFydHMpXG4gICAgICBbaW1wdXRlVHJhbnNmb3JtKG1vZGVsKSwgc3RhY2tUcmFuc2Zvcm0obW9kZWwpLCBmYWNldFRyYW5zZm9ybV0gOlxuICAgICAgLy8gRm9yIG5vbi1zdGFja2VkIHBhdGggKGxpbmUvYXJlYSksIHdlIG5lZWQgdG8gZmFjZXQgYW5kIHBvc3NpYmx5IHNvcnRcbiAgICAgIFtdLmNvbmNhdChcbiAgICAgICAgZmFjZXRUcmFuc2Zvcm0sXG4gICAgICAgIC8vIGlmIG1vZGVsIGhhcyBkZXRhaWwsIHRoZW4gc29ydCBtYXJrJ3MgbGF5ZXIgb3JkZXIgYnkgZGV0YWlsIGZpZWxkKHMpXG4gICAgICAgIG1vZGVsLmhhcyhERVRBSUwpID8gW3t0eXBlOidzb3J0JywgYnk6IHNvcnRCeShtb2RlbCl9XSA6IFtdXG4gICAgICApO1xuXG4gICAgcmV0dXJuIFt7XG4gICAgICBuYW1lOiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyBtYXJrICsgJy1mYWNldCcsXG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgZnJvbTogZXh0ZW5kKFxuICAgICAgICAvLyBJZiBoYXMgZmFjZXQsIGBmcm9tLmRhdGFgIHdpbGwgYmUgYWRkZWQgaW4gdGhlIGNlbGwgZ3JvdXAuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgYWRkIGl0IGhlcmUuXG4gICAgICAgIGlzRmFjZXRlZCA/IHt9IDogZGF0YUZyb20sXG4gICAgICAgIHt0cmFuc2Zvcm06IHRyYW5zZm9ybX1cbiAgICAgICksXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiB7IGZpZWxkOiB7IGdyb3VwOiAnd2lkdGgnIH0gfSxcbiAgICAgICAgICBoZWlnaHQ6IHsgZmllbGQ6IHsgZ3JvdXA6ICdoZWlnaHQnIH0gfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbWFya3M6IHBhdGhNYXJrc1xuICAgIH1dO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwYXRoTWFya3M7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcGlsZU5vblBhdGhNYXJrKG1vZGVsOiBNb2RlbCkge1xuICBjb25zdCBtYXJrID0gbW9kZWwubWFyaygpO1xuICBjb25zdCBuYW1lID0gbW9kZWwuc3BlYygpLm5hbWU7XG4gIGNvbnN0IGlzRmFjZXRlZCA9IG1vZGVsLmhhcyhST1cpIHx8IG1vZGVsLmhhcyhDT0xVTU4pO1xuICBjb25zdCBkYXRhRnJvbSA9IHtkYXRhOiBtb2RlbC5kYXRhVGFibGUoKX07XG5cbiAgbGV0IG1hcmtzID0gW107IC8vIFRPRE86IHZnTWFya3NcbiAgaWYgKG1hcmsgPT09IFRFWFRNQVJLICYmXG4gICAgbW9kZWwuaGFzKENPTE9SKSAmJlxuICAgIG1vZGVsLmNvbmZpZygpLm1hcmsuYXBwbHlDb2xvclRvQmFja2dyb3VuZCAmJiAhbW9kZWwuaGFzKFgpICYmICFtb2RlbC5oYXMoWSlcbiAgKSB7XG4gICAgLy8gYWRkIGJhY2tncm91bmQgdG8gJ3RleHQnIG1hcmtzIGlmIGhhcyBjb2xvclxuICAgIG1hcmtzLnB1c2goZXh0ZW5kKFxuICAgICAgbmFtZSA/IHsgbmFtZTogbmFtZSArICctYmFja2dyb3VuZCcgfSA6IHt9LFxuICAgICAgeyB0eXBlOiAncmVjdCcgfSxcbiAgICAgIC8vIElmIGhhcyBmYWNldCwgYGZyb20uZGF0YWAgd2lsbCBiZSBhZGRlZCBpbiB0aGUgY2VsbCBncm91cC5cbiAgICAgIC8vIE90aGVyd2lzZSwgYWRkIGl0IGhlcmUuXG4gICAgICBpc0ZhY2V0ZWQgPyB7fSA6IHtmcm9tOiBkYXRhRnJvbX0sXG4gICAgICAvLyBQcm9wZXJ0aWVzXG4gICAgICB7IHByb3BlcnRpZXM6IHsgdXBkYXRlOiB0ZXh0LmJhY2tncm91bmQobW9kZWwpIH0gfVxuICAgICkpO1xuICB9XG5cbiAgbWFya3MucHVzaChleHRlbmQoXG4gICAgbmFtZSA/IHsgbmFtZTogbmFtZSArICctbWFya3MnIH0gOiB7fSxcbiAgICB7IHR5cGU6IG1hcmtDb21waWxlclttYXJrXS5tYXJrVHlwZSgpIH0sXG4gICAgLy8gQWRkIGBmcm9tYCBpZiBuZWVkZWRcbiAgICAoIWlzRmFjZXRlZCB8fCBtb2RlbC5zdGFjaygpIHx8IG1vZGVsLmhhcyhERVRBSUwpKSA/IHtcbiAgICAgIGZyb206IGV4dGVuZChcbiAgICAgICAgLy8gSWYgZmFjZXRlZCwgYGZyb20uZGF0YWAgd2lsbCBiZSBhZGRlZCBpbiB0aGUgY2VsbCBncm91cC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhZGQgaXQgaGVyZVxuICAgICAgICBpc0ZhY2V0ZWQgPyB7fSA6IGRhdGFGcm9tLFxuICAgICAgICAvLyBgZnJvbS50cmFuc2Zvcm1gXG4gICAgICAgIG1vZGVsLnN0YWNrKCkgPyAvLyBTdGFja2VkIENoYXJ0IG5lZWQgc3RhY2sgdHJhbnNmb3JtXG4gICAgICAgICAgeyB0cmFuc2Zvcm06IFtzdGFja1RyYW5zZm9ybShtb2RlbCldIH0gOlxuICAgICAgICBtb2RlbC5oYXMoREVUQUlMKSA/XG4gICAgICAgICAgLy8gaWYgbm9uLXN0YWNrZWQsIGRldGFpbCBmaWVsZCBkZXRlcm1pbmVzIHRoZSBsYXllciBvcmRlciBvZiBlYWNoIG1hcmtcbiAgICAgICAgICB7IHRyYW5zZm9ybTogW3t0eXBlOidzb3J0JywgYnk6IHNvcnRCeShtb2RlbCl9XSB9IDpcbiAgICAgICAgICB7fVxuICAgICAgKVxuICAgIH0gOiB7fSxcbiAgICAvLyBwcm9wZXJ0aWVzIGdyb3Vwc1xuICAgIHsgcHJvcGVydGllczogeyB1cGRhdGU6IG1hcmtDb21waWxlclttYXJrXS5wcm9wZXJ0aWVzKG1vZGVsKSB9IH1cbiAgKSk7XG5cbiAgaWYgKG1vZGVsLmhhcyhMQUJFTCkgJiYgbWFya0NvbXBpbGVyW21hcmtdLmxhYmVscykge1xuICAgIGNvbnN0IGxhYmVsUHJvcGVydGllcyA9IG1hcmtDb21waWxlclttYXJrXS5sYWJlbHMobW9kZWwpO1xuXG4gICAgLy8gY2hlY2sgaWYgd2UgaGF2ZSBsYWJlbCBtZXRob2QgZm9yIGN1cnJlbnQgbWFyayB0eXBlLlxuICAgIGlmIChsYWJlbFByb3BlcnRpZXMgIT09IHVuZGVmaW5lZCkgeyAvLyBJZiBsYWJlbCBpcyBzdXBwb3J0ZWRcbiAgICAgIC8vIGFkZCBsYWJlbCBncm91cFxuICAgICAgbWFya3MucHVzaChleHRlbmQoXG4gICAgICAgIG5hbWUgPyB7IG5hbWU6IG5hbWUgKyAnLWxhYmVsJyB9IDoge30sXG4gICAgICAgIHt0eXBlOiAndGV4dCd9LFxuICAgICAgICAvLyBJZiBoYXMgZmFjZXQsIGBmcm9tLmRhdGFgIHdpbGwgYmUgYWRkZWQgaW4gdGhlIGNlbGwgZ3JvdXAuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgYWRkIGl0IGhlcmUuXG4gICAgICAgIGlzRmFjZXRlZCA/IHt9IDoge2Zyb206IGRhdGFGcm9tfSxcbiAgICAgICAgLy8gUHJvcGVydGllc1xuICAgICAgICB7IHByb3BlcnRpZXM6IHsgdXBkYXRlOiBsYWJlbFByb3BlcnRpZXMgfSB9XG4gICAgICApKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWFya3M7XG59XG5cbmZ1bmN0aW9uIHNvcnRCeShtb2RlbDogTW9kZWwpIHtcbiAgaWYgKG1vZGVsLmhhcyhERVRBSUwpKSB7XG4gICAgdmFyIGNoYW5uZWxFbmNvZGluZyA9IG1vZGVsLnNwZWMoKS5lbmNvZGluZ1tERVRBSUxdO1xuICAgIHJldHVybiBpc0FycmF5KGNoYW5uZWxFbmNvZGluZykgP1xuICAgICAgY2hhbm5lbEVuY29kaW5nLm1hcChzb3J0RmllbGQpIDogLy8gc29ydCBieSBtdWx0aXBsZSBmaWVsZHNcbiAgICAgIHNvcnRGaWVsZChjaGFubmVsRW5jb2RpbmcpOyAgICAgIC8vIHNvcnQgYnkgb25lIGZpZWxkXG4gIH1cbiAgcmV0dXJuIG51bGw7IC8vIHVzZSBkZWZhdWx0IG9yZGVyXG59XG5cbi8qKlxuICogUmV0dXJuIHBhdGggb3JkZXIgZm9yIHNvcnQgdHJhbnNmb3JtJ3MgYnkgcHJvcGVydHlcbiAqL1xuZnVuY3Rpb24gc29ydFBhdGhCeShtb2RlbDogTW9kZWwpIHtcbiAgaWYgKG1vZGVsLm1hcmsoKSA9PT0gTElORSAmJiBtb2RlbC5oYXMoUEFUSCkpIHtcbiAgICAvLyBGb3Igb25seSBsaW5lLCBzb3J0IGJ5IHRoZSBwYXRoIGZpZWxkIGlmIGl0IGlzIHNwZWNpZmllZC5cbiAgICBjb25zdCBjaGFubmVsRW5jb2RpbmcgPSBtb2RlbC5zcGVjKCkuZW5jb2RpbmdbUEFUSF07XG4gICAgcmV0dXJuIGlzQXJyYXkoY2hhbm5lbEVuY29kaW5nKSA/XG4gICAgICBjaGFubmVsRW5jb2RpbmcubWFwKHNvcnRGaWVsZCkgOiAvLyBzb3J0IGJ5IG11bHRpcGxlIGZpZWxkc1xuICAgICAgc29ydEZpZWxkKGNoYW5uZWxFbmNvZGluZyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIGJvdGggbGluZSBhbmQgYXJlYSwgd2Ugc29ydCB2YWx1ZXMgYmFzZWQgb24gZGltZW5zaW9uIGJ5IGRlZmF1bHRcbiAgICByZXR1cm4gJy0nICsgbW9kZWwuZmllbGQobW9kZWwuY29uZmlnKCkubWFyay5vcmllbnQgPT09ICdob3Jpem9udGFsJyA/IFkgOiBYKTtcbiAgfVxufVxuXG4vKiogQWRkIFwiLVwiIHByZWZpeCBmb3IgZGVzY2VuZGluZyAqL1xuZnVuY3Rpb24gc29ydEZpZWxkKGZpZWxkRGVmOiBGaWVsZERlZikge1xuICByZXR1cm4gKGZpZWxkRGVmLnNvcnQgPT09ICdkZXNjZW5kaW5nJyA/ICctJyA6ICcnKSArIGZpZWxkKGZpZWxkRGVmKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGxpc3Qgb2YgZGV0YWlsIGZpZWxkcyAoZm9yICdjb2xvcicsICdzaGFwZScsIG9yICdkZXRhaWwnIGNoYW5uZWxzKVxuICogdGhhdCB0aGUgbW9kZWwncyBzcGVjIGNvbnRhaW5zLlxuICovXG5mdW5jdGlvbiBkZXRhaWxGaWVsZHMobW9kZWw6IE1vZGVsKTogc3RyaW5nW10ge1xuICByZXR1cm4gW0NPTE9SLCBERVRBSUwsIFNIQVBFXS5yZWR1Y2UoZnVuY3Rpb24oZGV0YWlscywgY2hhbm5lbCkge1xuICAgIGlmIChtb2RlbC5oYXMoY2hhbm5lbCkgJiYgIW1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmFnZ3JlZ2F0ZSkge1xuICAgICAgZGV0YWlscy5wdXNoKG1vZGVsLmZpZWxkKGNoYW5uZWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH0sIFtdKTtcbn1cbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9ibG9iL21hc3Rlci9kb2Mvc3BlYy5tZCMxMS1hbWJpZW50LWRlY2xhcmF0aW9uc1xuZGVjbGFyZSB2YXIgZXhwb3J0cztcblxuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5cbmltcG9ydCB7Y29udGFpbnMsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7U0hBUkVEX0RPTUFJTl9PUFN9IGZyb20gJy4uL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZLCBTSEFQRSwgU0laRSwgQ09MT1IsIFRFWFQsIGhhc1NjYWxlLCBDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7U09VUkNFLCBTVEFDS0VEX1NDQUxFfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7Tk9NSU5BTCwgT1JESU5BTCwgUVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge01hcmssIEJBUiwgVEVYVCBhcyBURVhUX01BUkt9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtyYXdEb21haW59IGZyb20gJy4vdGltZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlU2NhbGVzKGNoYW5uZWxzOiBDaGFubmVsW10sIG1vZGVsOiBNb2RlbCkge1xuICByZXR1cm4gY2hhbm5lbHMuZmlsdGVyKGhhc1NjYWxlKVxuICAgIC5tYXAoZnVuY3Rpb24oY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICAgICAgdmFyIHNjYWxlRGVmOiBhbnkgPSB7XG4gICAgICAgIG5hbWU6IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKSxcbiAgICAgICAgdHlwZTogdHlwZShmaWVsZERlZiwgY2hhbm5lbCwgbW9kZWwubWFyaygpKSxcbiAgICAgIH07XG5cbiAgICAgIHNjYWxlRGVmLmRvbWFpbiA9IGRvbWFpbihtb2RlbCwgY2hhbm5lbCwgc2NhbGVEZWYudHlwZSk7XG4gICAgICBleHRlbmQoc2NhbGVEZWYsIHJhbmdlTWl4aW5zKG1vZGVsLCBjaGFubmVsLCBzY2FsZURlZi50eXBlKSk7XG5cbiAgICAgIC8vIEFkZCBvcHRpb25hbCBwcm9wZXJ0aWVzXG4gICAgICBbXG4gICAgICAgIC8vIGdlbmVyYWwgcHJvcGVydGllc1xuICAgICAgICAncmV2ZXJzZScsICdyb3VuZCcsXG4gICAgICAgIC8vIHF1YW50aXRhdGl2ZSAvIHRpbWVcbiAgICAgICAgJ2NsYW1wJywgJ25pY2UnLFxuICAgICAgICAvLyBxdWFudGl0YXRpdmVcbiAgICAgICAgJ2V4cG9uZW50JywgJ3plcm8nLFxuICAgICAgICAvLyBvcmRpbmFsXG4gICAgICAgICdvdXRlclBhZGRpbmcnLCAncGFkZGluZycsICdwb2ludHMnXG4gICAgICBdLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgLy8gVE9ETyBpbmNsdWRlIGZpZWxkRGVmIGFzIHBhcnQgb2YgdGhlIHBhcmFtZXRlcnNcbiAgICAgICAgY29uc3QgdmFsdWUgPSBleHBvcnRzW3Byb3BlcnR5XShtb2RlbCwgY2hhbm5lbCwgc2NhbGVEZWYudHlwZSk7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc2NhbGVEZWZbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gc2NhbGVEZWY7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlKGZpZWxkRGVmOiBGaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCwgbWFyazogTWFyayk6IHN0cmluZyB7XG4gIGlmICghaGFzU2NhbGUoY2hhbm5lbCkpIHtcbiAgICAvLyBUaGVyZSBpcyBubyBzY2FsZSBmb3IgdGhlc2UgY2hhbm5lbHNcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFdlIGNhbid0IHVzZSBsaW5lYXIvdGltZSBmb3Igcm93LCBjb2x1bW4gb3Igc2hhcGVcbiAgaWYgKGNvbnRhaW5zKFtST1csIENPTFVNTiwgU0hBUEVdLCBjaGFubmVsKSkge1xuICAgIHJldHVybiAnb3JkaW5hbCc7XG4gIH1cblxuICBpZiAoZmllbGREZWYuc2NhbGUudHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZpZWxkRGVmLnNjYWxlLnR5cGU7XG4gIH1cblxuICBzd2l0Y2ggKGZpZWxkRGVmLnR5cGUpIHtcbiAgICBjYXNlIE5PTUlOQUw6XG4gICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgIGNhc2UgT1JESU5BTDpcbiAgICAgIHJldHVybiAnb3JkaW5hbCc7XG4gICAgY2FzZSBURU1QT1JBTDpcbiAgICAgIGlmIChjaGFubmVsID09PSBDT0xPUikge1xuICAgICAgICAvLyBGSVhNRSgjODkwKSBpZiB1c2VyIHNwZWNpZnkgc2NhbGUucmFuZ2UgYXMgb3JkaW5hbCBwcmVzZXRzLCB0aGVuIHRoaXMgc2hvdWxkIGJlIG9yZGluYWwuXG4gICAgICAgIC8vIEFsc28sIGlmIHdlIHN1cHBvcnQgY29sb3IgcmFtcCwgdGhpcyBzaG91bGQgYmUgb3JkaW5hbCB0b28uXG4gICAgICAgIHJldHVybiAndGltZSc7IC8vIHRpbWUgaGFzIG9yZGVyLCBzbyB1c2UgaW50ZXJwb2xhdGVkIG9yZGluYWwgY29sb3Igc2NhbGUuXG4gICAgICB9XG5cbiAgICAgIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICBzd2l0Y2ggKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgICAgY2FzZSAnaG91cnMnOlxuICAgICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgLy8gZGF0ZSwgeWVhciwgbWludXRlLCBzZWNvbmQsIHllYXJtb250aCwgbW9udGhkYXksIC4uLlxuICAgICAgICAgICAgcmV0dXJuICd0aW1lJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICd0aW1lJztcblxuICAgIGNhc2UgUVVBTlRJVEFUSVZFOlxuICAgICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgICAvLyBUT0RPKCM4OTApOiBJZGVhbGx5IGJpbm5lZCBDT0xPUiBzaG91bGQgYmUgYW4gb3JkaW5hbCBzY2FsZVxuICAgICAgICAvLyBIb3dldmVyLCBjdXJyZW50bHkgb3JkaW5hbCBzY2FsZSBkb2Vzbid0IHN1cHBvcnQgY29sb3IgcmFtcCB5ZXQuXG4gICAgICAgIHJldHVybiBjb250YWlucyhbWCwgWSwgQ09MT1JdLCBjaGFubmVsKSA/ICdsaW5lYXInIDogJ29yZGluYWwnO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdsaW5lYXInO1xuICB9XG5cbiAgLy8gc2hvdWxkIG5ldmVyIHJlYWNoIHRoaXNcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb21haW4obW9kZWw6IE1vZGVsLCBjaGFubmVsOkNoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIHZhciBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIGlmIChmaWVsZERlZi5zY2FsZS5kb21haW4pIHsgLy8gZXhwbGljaXQgdmFsdWVcbiAgICByZXR1cm4gZmllbGREZWYuc2NhbGUuZG9tYWluO1xuICB9XG5cbiAgLy8gc3BlY2lhbCBjYXNlIGZvciB0ZW1wb3JhbCBzY2FsZVxuICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICBpZiAocmF3RG9tYWluKGZpZWxkRGVmLnRpbWVVbml0LCBjaGFubmVsKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF0YTogZmllbGREZWYudGltZVVuaXQsXG4gICAgICAgIGZpZWxkOiAnZGF0ZSdcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwpLFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCksXG4gICAgICAgIG9wOiAnbWluJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBGb3Igc3RhY2ssIHVzZSBTVEFDS0VEIGRhdGEuXG4gIHZhciBzdGFjayA9IG1vZGVsLnN0YWNrKCk7XG4gIGlmIChzdGFjayAmJiBjaGFubmVsID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcbiAgICBpZihzdGFjay5jb25maWcub2Zmc2V0ID09PSAnbm9ybWFsaXplJykge1xuICAgICAgcmV0dXJuIFswLCAxXTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IFNUQUNLRURfU0NBTEUsXG4gICAgICAvLyBTVEFDS0VEX1NDQUxFIHByb2R1Y2VzIHN1bSBvZiB0aGUgZmllbGQncyB2YWx1ZSBlLmcuLCBzdW0gb2Ygc3VtLCBzdW0gb2YgZGlzdGluY3RcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7cHJlZm46ICdzdW1fJ30pXG4gICAgfTtcbiAgfVxuXG4gIHZhciB1c2VSYXdEb21haW4gPSBfdXNlUmF3RG9tYWluKG1vZGVsLCBjaGFubmVsLCBzY2FsZVR5cGUpO1xuICB2YXIgc29ydCA9IGRvbWFpblNvcnQobW9kZWwsIGNoYW5uZWwsIHNjYWxlVHlwZSk7XG5cbiAgaWYgKHVzZVJhd0RvbWFpbikgeyAvLyB1c2VSYXdEb21haW4gLSBvbmx5IFEvVFxuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBTT1VSQ0UsXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwge25vQWdncmVnYXRlOiB0cnVlfSlcbiAgICB9O1xuICB9IGVsc2UgaWYgKGZpZWxkRGVmLmJpbikgeyAvLyBiaW5cbiAgICByZXR1cm4gc2NhbGVUeXBlID09PSAnb3JkaW5hbCcgPyB7XG4gICAgICAvLyBvcmRpbmFsIGJpbiBzY2FsZSB0YWtlcyBkb21haW4gZnJvbSBiaW5fcmFuZ2UsIG9yZGVyZWQgYnkgYmluX3N0YXJ0XG4gICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7IGJpblN1ZmZpeDogJ19yYW5nZScgfSksXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7IGJpblN1ZmZpeDogJ19zdGFydCcgfSksXG4gICAgICAgIG9wOiAnbWluJyAvLyBtaW4gb3IgbWF4IGRvZXNuJ3QgbWF0dGVyIHNpbmNlIHNhbWUgX3JhbmdlIHdvdWxkIGhhdmUgdGhlIHNhbWUgX3N0YXJ0XG4gICAgICB9XG4gICAgfSA6IGNoYW5uZWwgPT09IENPTE9SID8ge1xuICAgICAgLy8gQ3VycmVudGx5LCBiaW5uZWQgb24gY29sb3IgdXNlcyBsaW5lYXIgc2NhbGUgYW5kIHRodXMgdXNlIF9zdGFydCBwb2ludFxuICAgICAgLy8gVE9ETzogVGhpcyBpZGVhbGx5IHNob3VsZCBiZWNvbWUgb3JkaW5hbCBzY2FsZSBvbmNlIG9yZGluYWwgc2NhbGUgc3VwcG9ydHMgY29sb3IgcmFtcC5cbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHsgYmluU3VmZml4OiAnX3N0YXJ0JyB9KVxuICAgIH0gOiB7XG4gICAgICAvLyBvdGhlciBsaW5lYXIgYmluIHNjYWxlIG1lcmdlcyBib3RoIGJpbl9zdGFydCBhbmQgYmluX2VuZCBmb3Igbm9uLW9yZGluYWwgc2NhbGVcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgZmllbGQ6IFtcbiAgICAgICAgbW9kZWwuZmllbGQoY2hhbm5lbCwgeyBiaW5TdWZmaXg6ICdfc3RhcnQnIH0pLFxuICAgICAgICBtb2RlbC5maWVsZChjaGFubmVsLCB7IGJpblN1ZmZpeDogJ19lbmQnIH0pXG4gICAgICBdXG4gICAgfTtcbiAgfSBlbHNlIGlmIChzb3J0KSB7IC8vIGhhdmUgc29ydCAtLSBvbmx5IGZvciBvcmRpbmFsXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIElmIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCwgd2UgbmVlZCB0byB1c2UgU09VUkNFIHRhYmxlLFxuICAgICAgLy8gc28gd2UgY2FuIGFnZ3JlZ2F0ZSB2YWx1ZXMgZm9yIHRoZSBzY2FsZSBpbmRlcGVuZGVudGx5IGZyb20gdGhlIG1haW4gYWdncmVnYXRpb24uXG4gICAgICBkYXRhOiBzb3J0Lm9wID8gU09VUkNFIDogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCksXG4gICAgICBzb3J0OiBzb3J0XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbClcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb21haW5Tb3J0KG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpOiBhbnkge1xuICB2YXIgc29ydCA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNvcnQ7XG4gIGlmIChzb3J0ID09PSAnYXNjZW5kaW5nJyB8fCBzb3J0ID09PSAnZGVzY2VuZGluZycpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFNvcnRlZCBiYXNlZCBvbiBhbiBhZ2dyZWdhdGUgY2FsY3VsYXRpb24gb3ZlciBhIHNwZWNpZmllZCBzb3J0IGZpZWxkIChvbmx5IGZvciBvcmRpbmFsIHNjYWxlKVxuICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcgJiYgdHlwZW9mIHNvcnQgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wOiBzb3J0Lm9wLFxuICAgICAgZmllbGQ6IHNvcnQuZmllbGRcbiAgICB9O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXZlcnNlKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICB2YXIgc29ydCA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNvcnQ7XG4gIHJldHVybiBzb3J0ICYmICh0eXBlb2Ygc29ydCA9PT0gJ3N0cmluZycgP1xuICAgICAgICAgICAgICAgICAgICBzb3J0ID09PSAnZGVzY2VuZGluZycgOlxuICAgICAgICAgICAgICAgICAgICBzb3J0Lm9yZGVyID09PSAnZGVzY2VuZGluZydcbiAgICAgICAgICAgICAgICAgKSA/IHRydWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHVzZVJhd0RvbWFpbiBzaG91bGQgYmUgYWN0aXZhdGVkIGZvciB0aGlzIHNjYWxlLlxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFsbCBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdG9ucyBhcHBsaWVzOlxuICogMS4gYHVzZVJhd0RvbWFpbmAgaXMgZW5hYmxlZCBlaXRoZXIgdGhyb3VnaCBzY2FsZSBvciBjb25maWdcbiAqIDIuIEFnZ3JlZ2F0aW9uIGZ1bmN0aW9uIGlzIG5vdCBgY291bnRgIG9yIGBzdW1gXG4gKiAzLiBUaGUgc2NhbGUgaXMgcXVhbnRpdGF0aXZlIG9yIHRpbWUgc2NhbGUuXG4gKi9cbmZ1bmN0aW9uIF91c2VSYXdEb21haW4gKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICByZXR1cm4gZmllbGREZWYuc2NhbGUudXNlUmF3RG9tYWluICYmIC8vICBpZiB1c2VSYXdEb21haW4gaXMgZW5hYmxlZFxuICAgIC8vIG9ubHkgYXBwbGllZCB0byBhZ2dyZWdhdGUgdGFibGVcbiAgICBmaWVsZERlZi5hZ2dyZWdhdGUgJiZcbiAgICAvLyBvbmx5IGFjdGl2YXRlZCBpZiB1c2VkIHdpdGggYWdncmVnYXRlIGZ1bmN0aW9ucyB0aGF0IHByb2R1Y2VzIHZhbHVlcyByYW5naW5nIGluIHRoZSBkb21haW4gb2YgdGhlIHNvdXJjZSBkYXRhXG4gICAgU0hBUkVEX0RPTUFJTl9PUFMuaW5kZXhPZihmaWVsZERlZi5hZ2dyZWdhdGUpID49IDAgJiZcbiAgICAoXG4gICAgICAvLyBRIGFsd2F5cyB1c2VzIHF1YW50aXRhdGl2ZSBzY2FsZSBleGNlcHQgd2hlbiBpdCdzIGJpbm5lZC5cbiAgICAgIC8vIEJpbm5lZCBmaWVsZCBoYXMgc2ltaWxhciB2YWx1ZXMgaW4gYm90aCB0aGUgc291cmNlIHRhYmxlIGFuZCB0aGUgc3VtbWFyeSB0YWJsZVxuICAgICAgLy8gYnV0IHRoZSBzdW1tYXJ5IHRhYmxlIGhhcyBmZXdlciB2YWx1ZXMsIHRoZXJlZm9yZSBiaW5uZWQgZmllbGRzIGRyYXdcbiAgICAgIC8vIGRvbWFpbiB2YWx1ZXMgZnJvbSB0aGUgc3VtbWFyeSB0YWJsZS5cbiAgICAgIChmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUgJiYgIWZpZWxkRGVmLmJpbikgfHxcbiAgICAgIC8vIFQgdXNlcyBub24tb3JkaW5hbCBzY2FsZSB3aGVuIHRoZXJlJ3Mgbm8gdW5pdCBvciB3aGVuIHRoZSB1bml0IGlzIG5vdCBvcmRpbmFsLlxuICAgICAgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMICYmIHNjYWxlVHlwZSA9PT0gJ2xpbmVhcicpXG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJhbmRXaWR0aChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5iYW5kV2lkdGg7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAvLyBvbmx5IHJldHVybiB2YWx1ZSBpZiBleHBsaWNpdCB2YWx1ZSBpcyBzcGVjaWZpZWQuXG4gIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5jbGFtcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9uZW50KG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAvLyBvbmx5IHJldHVybiB2YWx1ZSBpZiBleHBsaWNpdCB2YWx1ZSBpcyBzcGVjaWZpZWQuXG4gIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5leHBvbmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5pY2UobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IHN0cmluZykge1xuICBpZiAobW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUubmljZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gZXhwbGljaXQgdmFsdWVcbiAgICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUubmljZTtcbiAgfVxuXG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgWDogLyogZmFsbCB0aHJvdWdoICovXG4gICAgY2FzZSBZOlxuICAgICAgaWYgKHNjYWxlVHlwZSA9PT0gJ3RpbWUnIHx8IHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgUk9XOiAvKiBmYWxsIHRocm91Z2ggKi9cbiAgICBjYXNlIENPTFVNTjpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvdXRlclBhZGRpbmcobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IHN0cmluZykge1xuICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICBpZiAobW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUub3V0ZXJQYWRkaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5vdXRlclBhZGRpbmc7IC8vIGV4cGxpY2l0IHZhbHVlXG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWRkaW5nKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpIHtcbiAgaWYgKHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnICYmIGNoYW5uZWwgIT09IFJPVyAmJiBjaGFubmVsICE9PSBDT0xVTU4pIHtcbiAgICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUucGFkZGluZztcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9pbnRzKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpIHtcbiAgaWYgKHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgICBjYXNlIFg6XG4gICAgICBjYXNlIFk6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiByYW5nZU1peGlucyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKTogYW55IHtcbiAgdmFyIGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgaWYgKHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnICYmIGZpZWxkRGVmLnNjYWxlLmJhbmRXaWR0aCkge1xuICAgIHJldHVybiB7YmFuZFdpZHRoOiBmaWVsZERlZi5zY2FsZS5iYW5kV2lkdGh9O1xuICB9XG5cbiAgaWYgKGZpZWxkRGVmLnNjYWxlLnJhbmdlKSB7IC8vIGV4cGxpY2l0IHZhbHVlXG4gICAgcmV0dXJuIHtyYW5nZTogZmllbGREZWYuc2NhbGUucmFuZ2V9O1xuICB9XG5cbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSBYOlxuICAgICAgLy8gd2UgY2FuJ3QgdXNlIHtyYW5nZTogXCJ3aWR0aFwifSBoZXJlIHNpbmNlIHdlIHB1dCBzY2FsZSBpbiB0aGUgcm9vdCBncm91cFxuICAgICAgLy8gbm90IGluc2lkZSB0aGUgY2VsbCwgc28gc2NhbGUgaXMgcmV1c2FibGUgZm9yIGF4ZXMgZ3JvdXBcbiAgICAgIHJldHVybiB7cmFuZ2VNaW46IDAsIHJhbmdlTWF4OiBtb2RlbC5sYXlvdXQoKS5jZWxsV2lkdGh9O1xuICAgIGNhc2UgWTpcbiAgICAgIC8vIFdlIGNhbid0IHVzZSB7cmFuZ2U6IFwiaGVpZ2h0XCJ9IGhlcmUgZm9yIHRoZSBzYW1lIHJlYXNvblxuICAgICAgaWYgKHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICAgIHJldHVybiB7cmFuZ2VNaW46IDAsIHJhbmdlTWF4OiBtb2RlbC5sYXlvdXQoKS5jZWxsSGVpZ2h0fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7cmFuZ2VNaW46IG1vZGVsLmxheW91dCgpLmNlbGxIZWlnaHQsIHJhbmdlTWF4OiAwfTtcbiAgICBjYXNlIFNJWkU6XG4gICAgICBpZiAobW9kZWwuaXMoQkFSKSkge1xuICAgICAgICAvLyBUT0RPOiBkZXRlcm1pbmUgYmFuZFNpemUgZm9yIGJpbiwgd2hpY2ggYWN0dWFsbHkgdXNlcyBsaW5lYXIgc2NhbGVcbiAgICAgICAgY29uc3QgZGltZW5zaW9uID0gbW9kZWwuY29uZmlnKCkubWFyay5vcmllbnQgPT09ICdob3Jpem9udGFsJyA/IFkgOiBYO1xuICAgICAgICByZXR1cm4ge3JhbmdlOiBbMiwgbW9kZWwuZmllbGREZWYoZGltZW5zaW9uKS5zY2FsZS5iYW5kV2lkdGhdfTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZWwuaXMoVEVYVF9NQVJLKSkge1xuICAgICAgICByZXR1cm4ge3JhbmdlOiBbOCwgNDBdfTtcbiAgICAgIH1cbiAgICAgIC8vIGVsc2UgLS0gcG9pbnQsIHNxdWFyZSwgY2lyY2xlXG4gICAgICBjb25zdCB4SXNNZWFzdXJlID0gbW9kZWwuaXNNZWFzdXJlKFgpO1xuICAgICAgY29uc3QgeUlzTWVhc3VyZSA9IG1vZGVsLmlzTWVhc3VyZShZKTtcblxuICAgICAgY29uc3QgYmFuZFdpZHRoID0geElzTWVhc3VyZSAhPT0geUlzTWVhc3VyZSA/XG4gICAgICAgIG1vZGVsLmZpZWxkRGVmKHhJc01lYXN1cmUgPyBZIDogWCkuc2NhbGUuYmFuZFdpZHRoIDpcbiAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgbW9kZWwuZmllbGREZWYoWCkuc2NhbGUuYmFuZFdpZHRoIHx8IDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi8sXG4gICAgICAgICAgbW9kZWwuZmllbGREZWYoWSkuc2NhbGUuYmFuZFdpZHRoIHx8IDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi9cbiAgICAgICAgKTtcblxuICAgICAgcmV0dXJuIHtyYW5nZTogWzEwLCAoYmFuZFdpZHRoIC0gMikgKiAoYmFuZFdpZHRoIC0gMildfTtcbiAgICBjYXNlIFNIQVBFOlxuICAgICAgcmV0dXJuIHtyYW5nZTogJ3NoYXBlcyd9O1xuICAgIGNhc2UgQ09MT1I6XG4gICAgICBpZiAoZmllbGREZWYudHlwZSA9PT0gTk9NSU5BTFxuICAgICAgICB8fCBmaWVsZERlZi50eXBlID09PSBPUkRJTkFMIC8vIEZJWE1FIHJlbW92ZSB0aGlzIG9uY2Ugd2Ugc3VwcG9ydCBjb2xvciByYW1wIGZvciBvcmRpbmFsXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHtyYW5nZTogJ2NhdGVnb3J5MTAnfTtcbiAgICAgIH1cbiAgICAgIC8vIGVsc2UgLS0gdGltZSBvciBxdWFudGl0YXRpdmVcbiAgICAgIHJldHVybiB7cmFuZ2U6IFsnI0FGQzZBMycsICcjMDk2MjJBJ119OyAvLyB0YWJsZWF1IGdyZWVuc1xuICAgIGNhc2UgUk9XOlxuICAgICAgcmV0dXJuIHtyYW5nZTogJ2hlaWdodCd9O1xuICAgIGNhc2UgQ09MVU1OOlxuICAgICAgcmV0dXJuIHtyYW5nZTogJ3dpZHRoJ307XG4gIH1cbiAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcm91bmQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGlmIChtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5yb3VuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLnJvdW5kO1xuICB9XG5cbiAgLy8gRklYTUU6IHJldmlzZSBpZiByb3VuZCBpcyBhbHJlYWR5IHRoZSBkZWZhdWx0IHZhbHVlXG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgWDogLyogZmFsbCB0aHJvdWdoICovXG4gICAgY2FzZSBZOlxuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MVU1OOlxuICAgIGNhc2UgU0laRTpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICB2YXIgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgdmFyIHRpbWVVbml0ID0gZmllbGREZWYudGltZVVuaXQ7XG5cbiAgaWYgKGZpZWxkRGVmLnNjYWxlLnplcm8gIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIGV4cGxpY2l0IHZhbHVlXG4gICAgcmV0dXJuIGZpZWxkRGVmLnNjYWxlLnplcm87XG4gIH1cblxuICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICBpZiAodGltZVVuaXQgPT09ICd5ZWFyJykge1xuICAgICAgLy8geWVhciBpcyB1c2luZyBsaW5lYXIgc2NhbGUsIGJ1dCBzaG91bGQgbm90IGluY2x1ZGUgemVyb1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBJZiB0aGVyZSBpcyBubyB0aW1lVW5pdCBvciB0aGUgdGltZVVuaXQgdXNlcyBvcmRpbmFsIHNjYWxlLFxuICAgIC8vIHplcm8gcHJvcGVydHkgaXMgaWdub3JlZCBieSB2ZWdhIHNvIHdlIHNob3VsZCBub3QgZ2VuZXJhdGUgdGhlbSBhbnkgd2F5XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgLy8gUmV0dXJucyBmYWxzZSAodW5kZWZpbmVkKSBieSBkZWZhdWx0IG9mIGJpblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBjaGFubmVsID09PSBYIHx8IGNoYW5uZWwgPT09IFkgP1xuICAgIC8vIGlmIG5vdCBiaW4gLyB0ZW1wb3JhbCwgcmV0dXJucyB1bmRlZmluZWQgZm9yIFggYW5kIFkgZW5jb2RpbmdcbiAgICAvLyBzaW5jZSB6ZXJvIGlzIHRydWUgYnkgZGVmYXVsdCBpbiB2ZWdhIGZvciBsaW5lYXIgc2NhbGVcbiAgICB1bmRlZmluZWQgOlxuICAgIGZhbHNlO1xufVxuIiwiaW1wb3J0IHtTcGVjfSBmcm9tICcuLi9zY2hlbWEvc2NoZW1hJztcbmltcG9ydCB7c3RhY2tDb25maWcgYXMgc3RhY2tDb25maWdTY2hlbWF9IGZyb20gJy4uL3NjaGVtYS9jb25maWcuc3RhY2suc2NoZW1hJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtpbnN0YW50aWF0ZX0gZnJvbSAnLi4vc2NoZW1hL3NjaGVtYXV0aWwnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge0NoYW5uZWwsIFgsIFksIENPTE9SLCBERVRBSUx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtCQVIsIEFSRUF9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtmaWVsZCwgaXNNZWFzdXJlfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge2hhcywgaXNBZ2dyZWdhdGV9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7aXNBcnJheSwgY29udGFpbnN9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge3R5cGUgYXMgc2NhbGVUeXBlfSBmcm9tICcuL3NjYWxlJztcblxuZXhwb3J0IGludGVyZmFjZSBTdGFja1Byb3BlcnRpZXMge1xuICAvKiogRGltZW5zaW9uIGF4aXMgb2YgdGhlIHN0YWNrICgneCcgb3IgJ3knKS4gKi9cbiAgZ3JvdXBieUNoYW5uZWw6IENoYW5uZWw7XG4gIC8qKiBNZWFzdXJlIGF4aXMgb2YgdGhlIHN0YWNrICgneCcgb3IgJ3knKS4gKi9cbiAgZmllbGRDaGFubmVsOiBDaGFubmVsO1xuXG4gIC8qKiBTdGFjay1ieSBmaWVsZCBuYW1lcyAoZnJvbSAnY29sb3InIGFuZCAnZGV0YWlsJykgKi9cbiAgc3RhY2tGaWVsZHM6IHN0cmluZ1tdO1xuXG4gIC8qKiBTdGFjayBjb25maWcgZm9yIHRoZSBzdGFjayB0cmFuc2Zvcm0uICovXG4gIGNvbmZpZzogYW55O1xufVxuXG4vLyBUT0RPOiBwdXQgYWxsIHZlZ2EgaW50ZXJmYWNlIGluIG9uZSBwbGFjZVxuaW50ZXJmYWNlIFN0YWNrVHJhbnNmb3JtIHtcbiAgdHlwZTogc3RyaW5nO1xuICBvZmZzZXQ/OiBhbnk7XG4gIGdyb3VwYnk6IGFueTtcbiAgZmllbGQ6IGFueTtcbiAgc29ydGJ5OiBhbnk7XG4gIG91dHB1dDogYW55O1xufVxuXG4vKiogQ29tcGlsZSBzdGFjayBwcm9wZXJ0aWVzIGZyb20gYSBnaXZlbiBzcGVjICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVN0YWNrUHJvcGVydGllcyhzcGVjOiBTcGVjKSB7XG4gIGNvbnN0IHN0YWNrRmllbGRzID0gZ2V0U3RhY2tGaWVsZHMoc3BlYyk7XG5cbiAgaWYgKHN0YWNrRmllbGRzLmxlbmd0aCA+IDAgJiZcbiAgICAgIGNvbnRhaW5zKFtCQVIsIEFSRUFdLCBzcGVjLm1hcmspICYmXG4gICAgICBzcGVjLmNvbmZpZy5zdGFjayAhPT0gZmFsc2UgJiZcbiAgICAgIGlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpKSB7XG5cbiAgICB2YXIgaXNYTWVhc3VyZSA9IGhhcyhzcGVjLmVuY29kaW5nLCBYKSAmJiBpc01lYXN1cmUoc3BlYy5lbmNvZGluZy54KTtcbiAgICB2YXIgaXNZTWVhc3VyZSA9IGhhcyhzcGVjLmVuY29kaW5nLCBZKSAmJiBpc01lYXN1cmUoc3BlYy5lbmNvZGluZy55KTtcblxuICAgIGlmIChpc1hNZWFzdXJlICYmICFpc1lNZWFzdXJlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBncm91cGJ5Q2hhbm5lbDogWSxcbiAgICAgICAgZmllbGRDaGFubmVsOiBYLFxuICAgICAgICBzdGFja0ZpZWxkczogc3RhY2tGaWVsZHMsXG4gICAgICAgIGNvbmZpZzogc3BlYy5jb25maWcuc3RhY2sgPT09IHRydWUgID8gaW5zdGFudGlhdGUoc3RhY2tDb25maWdTY2hlbWEpIDogc3BlYy5jb25maWcuc3RhY2tcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChpc1lNZWFzdXJlICYmICFpc1hNZWFzdXJlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBncm91cGJ5Q2hhbm5lbDogWCxcbiAgICAgICAgZmllbGRDaGFubmVsOiBZLFxuICAgICAgICBzdGFja0ZpZWxkczogc3RhY2tGaWVsZHMsXG4gICAgICAgIGNvbmZpZzogc3BlYy5jb25maWcuc3RhY2sgPT09IHRydWUgID8gaW5zdGFudGlhdGUoc3RhY2tDb25maWdTY2hlbWEpIDogc3BlYy5jb25maWcuc3RhY2tcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKiogQ29tcGlsZSBzdGFjay1ieSBmaWVsZCBuYW1lcyBmcm9tIChmcm9tICdjb2xvcicgYW5kICdkZXRhaWwnKSAqL1xuZnVuY3Rpb24gZ2V0U3RhY2tGaWVsZHMoc3BlYzogU3BlYykge1xuICByZXR1cm4gW0NPTE9SLCBERVRBSUxdLnJlZHVjZShmdW5jdGlvbihmaWVsZHMsIGNoYW5uZWwpIHtcbiAgICBjb25zdCBjaGFubmVsRW5jb2RpbmcgPSBzcGVjLmVuY29kaW5nW2NoYW5uZWxdO1xuICAgIGlmIChoYXMoc3BlYy5lbmNvZGluZywgY2hhbm5lbCkpIHtcbiAgICAgIGlmIChpc0FycmF5KGNoYW5uZWxFbmNvZGluZykpIHtcbiAgICAgICAgY2hhbm5lbEVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWYpIHtcbiAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZChmaWVsZERlZikpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGZpZWxkRGVmOiBGaWVsZERlZiA9IGNoYW5uZWxFbmNvZGluZztcbiAgICAgICAgZmllbGRzLnB1c2goZmllbGQoZmllbGREZWYsIHtcbiAgICAgICAgICBiaW5TdWZmaXg6IHNjYWxlVHlwZShmaWVsZERlZiwgY2hhbm5lbCwgc3BlYy5tYXJrKSA9PT0gJ29yZGluYWwnID8gJ19yYW5nZScgOiAnX3N0YXJ0J1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHM7XG4gIH0sIFtdKTtcbn1cblxuLy8gaW1wdXRlIGRhdGEgZm9yIHN0YWNrZWQgYXJlYVxuZXhwb3J0IGZ1bmN0aW9uIGltcHV0ZVRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaygpO1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdpbXB1dGUnLFxuICAgIGZpZWxkOiBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpLFxuICAgIGdyb3VwYnk6IHN0YWNrLnN0YWNrRmllbGRzLFxuICAgIG9yZGVyYnk6IFttb2RlbC5maWVsZChzdGFjay5ncm91cGJ5Q2hhbm5lbCldLFxuICAgIG1ldGhvZDogJ3ZhbHVlJyxcbiAgICB2YWx1ZTogMFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhY2tUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2soKTtcbiAgY29uc3Qgc29ydGJ5ID0gc3RhY2suY29uZmlnLnNvcnQgPT09ICdhc2NlbmRpbmcnID9cbiAgICAgICAgICAgICAgICAgICBzdGFjay5zdGFja0ZpZWxkcyA6XG4gICAgICAgICAgICAgICAgIGlzQXJyYXkoc3RhY2suY29uZmlnLnNvcnQpID9cbiAgICAgICAgICAgICAgICAgICBzdGFjay5jb25maWcuc29ydCA6XG4gICAgICAgICAgICAgICAgICAgLy8gZGVzY2VuZGluZywgb3IgZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgIHN0YWNrLnN0YWNrRmllbGRzLm1hcChmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICctJyArIGZpZWxkO1xuICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gIGNvbnN0IHZhbE5hbWUgPSBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpO1xuXG4gIC8vIGFkZCBzdGFjayB0cmFuc2Zvcm0gdG8gbWFya1xuICB2YXIgdHJhbnNmb3JtOiBTdGFja1RyYW5zZm9ybSA9IHtcbiAgICB0eXBlOiAnc3RhY2snLFxuICAgIGdyb3VwYnk6IFttb2RlbC5maWVsZChzdGFjay5ncm91cGJ5Q2hhbm5lbCldLFxuICAgIGZpZWxkOiBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpLFxuICAgIHNvcnRieTogc29ydGJ5LFxuICAgIG91dHB1dDoge1xuICAgICAgc3RhcnQ6IHZhbE5hbWUgKyAnX3N0YXJ0JyxcbiAgICAgIGVuZDogdmFsTmFtZSArICdfZW5kJ1xuICAgIH1cbiAgfTtcblxuICBpZiAoc3RhY2suY29uZmlnLm9mZnNldCkge1xuICAgIHRyYW5zZm9ybS5vZmZzZXQgPSBzdGFjay5jb25maWcub2Zmc2V0O1xuICB9XG4gIHJldHVybiB0cmFuc2Zvcm07XG59XG4iLCJpbXBvcnQge2NvbnRhaW5zLCByYW5nZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBTSEFQRSwgQ09MT1IsIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuXG4vKiogcmV0dXJucyB0aGUgdGVtcGxhdGUgbmFtZSB1c2VkIGZvciBheGlzIGxhYmVscyBmb3IgYSB0aW1lIHVuaXQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXQodGltZVVuaXQsIGFiYnJldmlhdGVkID0gZmFsc2UpOiBzdHJpbmcge1xuICBpZiAoIXRpbWVVbml0KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxldCBkYXRlQ29tcG9uZW50cyA9IFtdO1xuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCd5ZWFyJykgPiAtMSkge1xuICAgIGRhdGVDb21wb25lbnRzLnB1c2goYWJicmV2aWF0ZWQgPyAnJXknIDogJyVZJyk7XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignbW9udGgnKSA+IC0xKSB7XG4gICAgZGF0ZUNvbXBvbmVudHMucHVzaChhYmJyZXZpYXRlZCA/ICclYicgOiAnJUInKTtcbiAgfVxuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdkYXknKSA+IC0xKSB7XG4gICAgZGF0ZUNvbXBvbmVudHMucHVzaChhYmJyZXZpYXRlZCA/ICclYScgOiAnJUEnKTtcbiAgfSBlbHNlIGlmICh0aW1lVW5pdC5pbmRleE9mKCdkYXRlJykgPiAtMSkge1xuICAgIGRhdGVDb21wb25lbnRzLnB1c2goJyVkJyk7XG4gIH1cblxuICBsZXQgdGltZUNvbXBvbmVudHMgPSBbXTtcblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignaG91cicpID4gLTEpIHtcbiAgICB0aW1lQ29tcG9uZW50cy5wdXNoKCclSCcpO1xuICB9XG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdtaW51dGUnKSA+IC0xKSB7XG4gICAgdGltZUNvbXBvbmVudHMucHVzaCgnJU0nKTtcbiAgfVxuICBpZiAodGltZVVuaXQuaW5kZXhPZignc2Vjb25kJykgPiAtMSkge1xuICAgIHRpbWVDb21wb25lbnRzLnB1c2goJyVTJyk7XG4gIH1cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ21pbGxpc2Vjb25kcycpID4gLTEpIHtcbiAgICB0aW1lQ29tcG9uZW50cy5wdXNoKCclTCcpO1xuICB9XG5cbiAgbGV0IG91dCA9IFtdO1xuICBpZiAoZGF0ZUNvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgIG91dC5wdXNoKGRhdGVDb21wb25lbnRzLmpvaW4oJy0nKSk7XG4gIH1cbiAgaWYgKHRpbWVDb21wb25lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBvdXQucHVzaCh0aW1lQ29tcG9uZW50cy5qb2luKCc6JykpO1xuICB9XG5cbiAgcmV0dXJuIG91dC5sZW5ndGggPiAwID8gb3V0LmpvaW4oJyAnKSA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbih0aW1lVW5pdDogc3RyaW5nLCBmaWVsZFJlZjogc3RyaW5nLCBvbmx5UmVmID0gZmFsc2UpOiBzdHJpbmcge1xuICBsZXQgb3V0ID0gJ2RhdGV0aW1lKCc7XG5cbiAgZnVuY3Rpb24gZ2V0KGZ1bjogc3RyaW5nLCBhZGRDb21tYSA9IHRydWUpIHtcbiAgICBpZiAob25seVJlZikge1xuICAgICAgcmV0dXJuIGZpZWxkUmVmICsgKGFkZENvbW1hID8gJywgJyA6ICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZ1biArICcoJyArIGZpZWxkUmVmICsgJyknICsgKGFkZENvbW1hID8gJywgJyA6ICcnKTtcbiAgICB9XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZigneWVhcicpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCd5ZWFyJyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcyMDA2LCAnOyAvLyBKYW51YXJ5IDEgMjAwNiBpcyBhIFN1bmRheVxuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ21vbnRoJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ21vbnRoJyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gbW9udGggc3RhcnRzIGF0IDAgaW4gamF2YXNjcmlwdFxuICAgIG91dCArPSAnMCwgJztcbiAgfVxuXG4gIC8vIG5lZWQgdG8gYWRkIDEgYmVjYXVzZSBkYXlzIHN0YXJ0IGF0IDFcbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ2RheScpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCdkYXknLCBmYWxzZSkgKyAnKzEsICc7XG4gIH0gZWxzZSBpZiAodGltZVVuaXQuaW5kZXhPZignZGF0ZScpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCdkYXRlJyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcxLCAnO1xuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ2hvdXJzJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ2hvdXJzJyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcwLCAnO1xuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ21pbnV0ZXMnKSA+IC0xKSB7XG4gICAgb3V0ICs9IGdldCgnbWludXRlcycpO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnMCwgJztcbiAgfVxuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdzZWNvbmRzJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ3NlY29uZHMnKTtcbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJzAsICc7XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignbWlsbGlzZWNvbmRzJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ21pbGxpc2Vjb25kcycsIGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJzAnO1xuICB9XG5cbiAgcmV0dXJuIG91dCArICcpJztcbn1cblxuLyoqIEdlbmVyYXRlIHRoZSBjb21wbGV0ZSByYXcgZG9tYWluLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhd0RvbWFpbih0aW1lVW5pdDogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGlmIChjb250YWlucyhbUk9XLCBDT0xVTU4sIFNIQVBFLCBDT0xPUl0sIGNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgICByZXR1cm4gcmFuZ2UoMCwgNjApO1xuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgICAgcmV0dXJuIHJhbmdlKDAsIDYwKTtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgICByZXR1cm4gcmFuZ2UoMCwgMjQpO1xuICAgIGNhc2UgJ2RheSc6XG4gICAgICByZXR1cm4gcmFuZ2UoMCwgNyk7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gcmFuZ2UoMSwgMzIpO1xuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHJldHVybiByYW5nZSgwLCAxMik7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZLCBTSVpFLCBDT0xPUiwgU0hBUEUsIFRFWFQsIExBQkVMLCBDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge2Zvcm1hdCBhcyB0aW1lRm9ybWF0RXhwcn0gZnJvbSAnLi90aW1lJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uL3V0aWwnO1xuXG5leHBvcnQgZW51bSBDb2xvck1vZGUge1xuICBBTFdBWVNfRklMTEVELFxuICBBTFdBWVNfU1RST0tFRCxcbiAgRklMTEVEX0JZX0RFRkFVTFQsXG4gIFNUUk9LRURfQllfREVGQVVMVFxufVxuXG5leHBvcnQgY29uc3QgRklMTF9TVFJPS0VfQ09ORklHID0gWydmaWxsJywgJ2ZpbGxPcGFjaXR5JyxcbiAgJ3N0cm9rZScsICdzdHJva2VXaWR0aCcsICdzdHJva2VEYXNoJywgJ3N0cm9rZURhc2hPZmZzZXQnLCAnc3Ryb2tlT3BhY2l0eScsXG4gICdvcGFjaXR5J107XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUNvbG9yQW5kT3BhY2l0eShwLCBtb2RlbDogTW9kZWwsIGNvbG9yTW9kZTogQ29sb3JNb2RlID0gQ29sb3JNb2RlLlNUUk9LRURfQllfREVGQVVMVCkge1xuICBjb25zdCBmaWxsZWQgPSBjb2xvck1vZGUgPT09IENvbG9yTW9kZS5BTFdBWVNfRklMTEVEID8gdHJ1ZSA6XG4gICAgY29sb3JNb2RlID09PSBDb2xvck1vZGUuQUxXQVlTX1NUUk9LRUQgPyBmYWxzZSA6XG4gICAgICBtb2RlbC5jb25maWcoKS5tYXJrLmZpbGxlZCAhPT0gdW5kZWZpbmVkID8gbW9kZWwuY29uZmlnKCkubWFyay5maWxsZWQgOlxuICAgICAgICBjb2xvck1vZGUgPT09IENvbG9yTW9kZS5GSUxMRURfQllfREVGQVVMVCA/IHRydWUgOlxuICAgICAgICAgIGZhbHNlOyAvLyBDb2xvck1vZGUuU1RST0tFRF9CWV9ERUZBVUxUXG5cbiAgaWYgKGZpbGxlZCkge1xuICAgIGlmIChtb2RlbC5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoQ09MT1IpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoQ09MT1IpXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlKSB7XG4gICAgICBwLmZpbGwgPSB7IHZhbHVlOiBtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWUgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC5maWxsID0geyB2YWx1ZTogbW9kZWwuY29uZmlnKCkubWFyay5jb2xvciB9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAobW9kZWwuaGFzKENPTE9SKSkge1xuICAgICAgcC5zdHJva2UgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoQ09MT1IpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoQ09MT1IpXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlKSB7XG4gICAgICBwLnN0cm9rZSA9IHsgdmFsdWU6IG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnN0cm9rZSA9IHsgdmFsdWU6IG1vZGVsLmNvbmZpZygpLm1hcmsuY29sb3IgfTtcbiAgICB9XG4gIH1cblxuICAvLyBBcHBseSBmaWxsIGFuZCBzdHJva2UgY29uZmlnIGxhdGVyXG4gIC8vIGBmaWxsYCBhbmQgYHN0cm9rZWAgY29uZmlnIGNhbiBvdmVycmlkZSBgY29sb3JgIGNvbmZpZ1xuICBhcHBseU1hcmtDb25maWcocCwgbW9kZWwsIEZJTExfU1RST0tFX0NPTkZJRyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseU1hcmtDb25maWcobWFya3NQcm9wZXJ0aWVzLCBtb2RlbDogTW9kZWwsIHByb3BzTGlzdDogc3RyaW5nW10pIHtcbiAgcHJvcHNMaXN0LmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IG1vZGVsLmNvbmZpZygpLm1hcmtbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBtYXJrc1Byb3BlcnRpZXNbcHJvcGVydHldID0geyB2YWx1ZTogdmFsdWUgfTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuICogQnVpbGRzIGFuIG9iamVjdCB3aXRoIGZvcm1hdCBhbmQgZm9ybWF0VHlwZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSBmb3JtYXQgZXhwbGljaXRseSBzcGVjaWZpZWQgZm9ybWF0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRNaXhpbnMobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBmb3JtYXQ6IHN0cmluZykge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIGlmKCFjb250YWlucyhbUVVBTlRJVEFUSVZFLCBURU1QT1JBTF0sIGZpZWxkRGVmLnR5cGUpKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgbGV0IGRlZjogYW55ID0ge307XG5cbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMKSB7XG4gICAgZGVmLmZvcm1hdFR5cGUgPSAndGltZSc7XG4gIH1cblxuICBpZiAoZm9ybWF0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBkZWYuZm9ybWF0ID0gZm9ybWF0O1xuICB9IGVsc2Uge1xuICAgIHN3aXRjaCAoZmllbGREZWYudHlwZSkge1xuICAgICAgY2FzZSBRVUFOVElUQVRJVkU6XG4gICAgICAgIGRlZi5mb3JtYXQgPSBtb2RlbC5jb25maWcoKS5udW1iZXJGb3JtYXQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBURU1QT1JBTDpcbiAgICAgICAgZGVmLmZvcm1hdCA9IHRpbWVGb3JtYXQobW9kZWwsIGNoYW5uZWwpIHx8IG1vZGVsLmNvbmZpZygpLnRpbWVGb3JtYXQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjaGFubmVsID09PSBURVhUKSB7XG4gICAgLy8gdGV4dCBkb2VzIG5vdCBzdXBwb3J0IGZvcm1hdCBhbmQgZm9ybWF0VHlwZVxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EvaXNzdWVzLzUwNVxuXG4gICAgY29uc3QgZmlsdGVyID0gKGRlZi5mb3JtYXRUeXBlIHx8ICdudW1iZXInKSArIChkZWYuZm9ybWF0ID8gJzpcXCcnICsgZGVmLmZvcm1hdCArICdcXCcnIDogJycpO1xuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiB7XG4gICAgICAgIHRlbXBsYXRlOiAne3snICsgbW9kZWwuZmllbGQoY2hhbm5lbCwgeyBkYXR1bTogdHJ1ZSB9KSArICcgfCAnICsgZmlsdGVyICsgJ319J1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gZGVmO1xufVxuXG5mdW5jdGlvbiBpc0FiYnJldmlhdGVkKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MVU1OOlxuICAgIGNhc2UgWDpcbiAgICBjYXNlIFk6XG4gICAgICByZXR1cm4gbW9kZWwuYXhpcyhjaGFubmVsKS5zaG9ydFRpbWVMYWJlbHM7XG4gICAgY2FzZSBDT0xPUjpcbiAgICBjYXNlIFNIQVBFOlxuICAgIGNhc2UgU0laRTpcbiAgICAgIHJldHVybiBtb2RlbC5sZWdlbmQoY2hhbm5lbCkuc2hvcnRUaW1lTGFiZWxzO1xuICAgIGNhc2UgVEVYVDpcbiAgICAgIHJldHVybiBtb2RlbC5jb25maWcoKS5tYXJrLnNob3J0VGltZUxhYmVscztcbiAgICBjYXNlIExBQkVMOlxuICAgICAgLy8gVE9ETygjODk3KTogaW1wbGVtZW50IHdoZW4gd2UgaGF2ZSBsYWJlbFxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0aW1lIGZvcm1hdCB1c2VkIGZvciBheGlzIGxhYmVscyBmb3IgYSB0aW1lIHVuaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lRm9ybWF0KG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCk6IHN0cmluZyB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gIHJldHVybiB0aW1lRm9ybWF0RXhwcihmaWVsZERlZi50aW1lVW5pdCwgaXNBYmJyZXZpYXRlZChtb2RlbCwgY2hhbm5lbCwgZmllbGREZWYpKTtcbn1cbiIsIi8qXG4gKiBDb25zdGFudHMgYW5kIHV0aWxpdGllcyBmb3IgZGF0YS5cbiAqL1xuXG5pbXBvcnQge05PTUlOQUwsIFFVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4vdHlwZSc7XG5cbmV4cG9ydCBjb25zdCBTVU1NQVJZID0gJ3N1bW1hcnknO1xuZXhwb3J0IGNvbnN0IFNPVVJDRSA9ICdzb3VyY2UnO1xuZXhwb3J0IGNvbnN0IFNUQUNLRURfU0NBTEUgPSAnc3RhY2tlZF9zY2FsZSc7XG5leHBvcnQgY29uc3QgTEFZT1VUID0gJ2xheW91dCc7XG5cbi8qKiBNYXBwaW5nIGZyb20gZGF0YWxpYidzIGluZmVycmVkIHR5cGUgdG8gVmVnYS1saXRlJ3MgdHlwZSAqL1xuLy8gVE9ETzogQUxMX0NBUFNcbmV4cG9ydCBjb25zdCB0eXBlcyA9IHtcbiAgJ2Jvb2xlYW4nOiBOT01JTkFMLFxuICAnbnVtYmVyJzogUVVBTlRJVEFUSVZFLFxuICAnaW50ZWdlcic6IFFVQU5USVRBVElWRSxcbiAgJ2RhdGUnOiBURU1QT1JBTCxcbiAgJ3N0cmluZyc6IE5PTUlOQUxcbn07XG4iLCIvLyB1dGlsaXR5IGZvciBlbmNvZGluZyBtYXBwaW5nXG5pbXBvcnQge0VuY29kaW5nfSBmcm9tICcuL3NjaGVtYS9lbmNvZGluZy5zY2hlbWEnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcbmltcG9ydCB7Q2hhbm5lbCwgQ0hBTk5FTFN9IGZyb20gJy4vY2hhbm5lbCc7XG5pbXBvcnQge2lzQXJyYXksIGFueSBhcyBhbnlJbn0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvdW50UmV0aW5hbChlbmNvZGluZzogRW5jb2RpbmcpIHtcbiAgdmFyIGNvdW50ID0gMDtcbiAgaWYgKGVuY29kaW5nLmNvbG9yKSB7IGNvdW50Kys7IH1cbiAgaWYgKGVuY29kaW5nLnNpemUpIHsgY291bnQrKzsgfVxuICBpZiAoZW5jb2Rpbmcuc2hhcGUpIHsgY291bnQrKzsgfVxuICByZXR1cm4gY291bnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFubmVscyhlbmNvZGluZzogRW5jb2RpbmcpIHtcbiAgcmV0dXJuIENIQU5ORUxTLmZpbHRlcihmdW5jdGlvbihjaGFubmVsKSB7XG4gICAgcmV0dXJuIGhhcyhlbmNvZGluZywgY2hhbm5lbCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzKGVuY29kaW5nOiBFbmNvZGluZywgY2hhbm5lbDogQ2hhbm5lbCk6IGJvb2xlYW4ge1xuICBjb25zdCBjaGFubmVsRW5jb2RpbmcgPSBlbmNvZGluZyAmJiBlbmNvZGluZ1tjaGFubmVsXTtcbiAgcmV0dXJuIGNoYW5uZWxFbmNvZGluZyAmJiAoXG4gICAgY2hhbm5lbEVuY29kaW5nLmZpZWxkICE9PSB1bmRlZmluZWQgfHxcbiAgICAoaXNBcnJheShjaGFubmVsRW5jb2RpbmcpICYmIGNoYW5uZWxFbmNvZGluZy5sZW5ndGggPiAwKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBZ2dyZWdhdGUoZW5jb2Rpbmc6IEVuY29kaW5nKSB7XG4gIHJldHVybiBhbnlJbihDSEFOTkVMUywgKGNoYW5uZWwpID0+IHtcbiAgICBpZiAoaGFzKGVuY29kaW5nLCBjaGFubmVsKSAmJiBlbmNvZGluZ1tjaGFubmVsXS5hZ2dyZWdhdGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmllbGREZWZzKGVuY29kaW5nOiBFbmNvZGluZyk6IEZpZWxkRGVmW10ge1xuICB2YXIgYXJyID0gW107XG4gIENIQU5ORUxTLmZvckVhY2goZnVuY3Rpb24oY2hhbm5lbCkge1xuICAgIGlmIChoYXMoZW5jb2RpbmcsIGNoYW5uZWwpKSB7XG4gICAgICBpZiAoaXNBcnJheShlbmNvZGluZ1tjaGFubmVsXSkpIHtcbiAgICAgICAgZW5jb2RpbmdbY2hhbm5lbF0uZm9yRWFjaChmdW5jdGlvbihmaWVsZERlZikge1xuICAgICAgICAgIGFyci5wdXNoKGZpZWxkRGVmKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnIucHVzaChlbmNvZGluZ1tjaGFubmVsXSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFycjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoKGVuY29kaW5nOiBFbmNvZGluZyxcbiAgICBmOiAoZmQ6IEZpZWxkRGVmLCBjOiBDaGFubmVsLCBpOiBudW1iZXIpID0+IHZvaWQsXG4gICAgdGhpc0FyZz86IGFueSkge1xuICB2YXIgaSA9IDA7XG4gIENIQU5ORUxTLmZvckVhY2goZnVuY3Rpb24oY2hhbm5lbCkge1xuICAgIGlmIChoYXMoZW5jb2RpbmcsIGNoYW5uZWwpKSB7XG4gICAgICBpZiAoaXNBcnJheShlbmNvZGluZ1tjaGFubmVsXSkpIHtcbiAgICAgICAgZW5jb2RpbmdbY2hhbm5lbF0uZm9yRWFjaChmdW5jdGlvbihmaWVsZERlZikge1xuICAgICAgICAgICAgZi5jYWxsKHRoaXNBcmcsIGZpZWxkRGVmLCBjaGFubmVsLCBpKyspO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGYuY2FsbCh0aGlzQXJnLCBlbmNvZGluZ1tjaGFubmVsXSwgY2hhbm5lbCwgaSsrKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwKGVuY29kaW5nOiBFbmNvZGluZyxcbiAgICBmOiAoZmQ6IEZpZWxkRGVmLCBjOiBDaGFubmVsLCBlOiBFbmNvZGluZykgPT4gYW55LFxuICAgIHRoaXNBcmc/OiBhbnkpIHtcbiAgdmFyIGFyciA9IFtdO1xuICBDSEFOTkVMUy5mb3JFYWNoKGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICBpZiAoaGFzKGVuY29kaW5nLCBjaGFubmVsKSkge1xuICAgICAgaWYgKGlzQXJyYXkoZW5jb2RpbmdbY2hhbm5lbF0pKSB7XG4gICAgICAgIGVuY29kaW5nW2NoYW5uZWxdLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWYpIHtcbiAgICAgICAgICBhcnIucHVzaChmLmNhbGwodGhpc0FyZywgZmllbGREZWYsIGNoYW5uZWwsIGVuY29kaW5nKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyLnB1c2goZi5jYWxsKHRoaXNBcmcsIGVuY29kaW5nW2NoYW5uZWxdLCBjaGFubmVsLCBlbmNvZGluZykpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2UoZW5jb2Rpbmc6IEVuY29kaW5nLFxuICAgIGY6IChhY2M6IGFueSwgZmQ6IEZpZWxkRGVmLCBjOiBDaGFubmVsLCBlOiBFbmNvZGluZykgPT4gYW55LFxuICAgIGluaXQsXG4gICAgdGhpc0FyZz86IGFueSkge1xuICB2YXIgciA9IGluaXQ7XG4gIENIQU5ORUxTLmZvckVhY2goZnVuY3Rpb24oY2hhbm5lbCkge1xuICAgIGlmIChoYXMoZW5jb2RpbmcsIGNoYW5uZWwpKSB7XG4gICAgICBpZiAoaXNBcnJheShlbmNvZGluZ1tjaGFubmVsXSkpIHtcbiAgICAgICAgZW5jb2RpbmdbY2hhbm5lbF0uZm9yRWFjaChmdW5jdGlvbihmaWVsZERlZikge1xuICAgICAgICAgICAgciA9IGYuY2FsbCh0aGlzQXJnLCByLCBmaWVsZERlZiwgY2hhbm5lbCwgZW5jb2RpbmcpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHIgPSBmLmNhbGwodGhpc0FyZywgciwgZW5jb2RpbmdbY2hhbm5lbF0sIGNoYW5uZWwsIGVuY29kaW5nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcjtcbn1cbiIsIi8vIHV0aWxpdHkgZm9yIGEgZmllbGQgZGVmaW5pdGlvbiBvYmplY3RcblxuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcbmltcG9ydCB7Y29udGFpbnMsIGdldGJpbnN9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge05PTUlOQUwsIE9SRElOQUwsIFFVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4vdHlwZSc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBGaWVsZFJlZk9wdGlvbiB7XG4gIC8qKiBleGNsdWRlIGJpbiwgYWdncmVnYXRlLCB0aW1lVW5pdCAqL1xuICBub2ZuPzogYm9vbGVhbjtcbiAgLyoqIGV4Y2x1ZGUgYWdncmVnYXRpb24gZnVuY3Rpb24gKi9cbiAgbm9BZ2dyZWdhdGU/OiBib29sZWFuO1xuICAvKiogaW5jbHVkZSAnZGF0dW0uJyAqL1xuICBkYXR1bT86IGJvb2xlYW47XG4gIC8qKiByZXBsYWNlIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeCAqL1xuICBmbj86IHN0cmluZztcbiAgLyoqIHByZXBlbmQgZm4gd2l0aCBjdXN0b20gZnVuY3Rpb24gcHJlZml4ICovXG4gIHByZWZuPzogc3RyaW5nO1xuICAvKiogYXBwZW5kIHN1ZmZpeCB0byB0aGUgZmllbGQgcmVmIGZvciBiaW4gKGRlZmF1bHQ9J19zdGFydCcpICovXG4gIGJpblN1ZmZpeD86IHN0cmluZztcbiAgLyoqIGFwcGVuZCBzdWZmaXggdG8gdGhlIGZpZWxkIHJlZiAoZ2VuZXJhbCkgKi9cbiAgc3VmZml4Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmllbGQoZmllbGREZWY6IEZpZWxkRGVmLCBvcHQ6IEZpZWxkUmVmT3B0aW9uID0ge30pIHtcbiAgY29uc3QgcHJlZml4ID0gKG9wdC5kYXR1bSA/ICdkYXR1bS4nIDogJycpICsgKG9wdC5wcmVmbiB8fCAnJyk7XG4gIGNvbnN0IHN1ZmZpeCA9IG9wdC5zdWZmaXggfHwgJyc7XG4gIGNvbnN0IGZpZWxkID0gZmllbGREZWYuZmllbGQ7XG5cbiAgaWYgKGlzQ291bnQoZmllbGREZWYpKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICdjb3VudCcgKyBzdWZmaXg7XG4gIH0gZWxzZSBpZiAob3B0LmZuKSB7XG4gICAgcmV0dXJuIHByZWZpeCArIG9wdC5mbiArICdfJyArIGZpZWxkICsgc3VmZml4O1xuICB9IGVsc2UgaWYgKCFvcHQubm9mbiAmJiBmaWVsZERlZi5iaW4pIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJ2Jpbl8nICsgZmllbGQgKyAob3B0LmJpblN1ZmZpeCB8fCBzdWZmaXggfHwgJ19zdGFydCcpO1xuICB9IGVsc2UgaWYgKCFvcHQubm9mbiAmJiAhb3B0Lm5vQWdncmVnYXRlICYmIGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgIHJldHVybiBwcmVmaXggKyBmaWVsZERlZi5hZ2dyZWdhdGUgKyAnXycgKyBmaWVsZCArIHN1ZmZpeDtcbiAgfSBlbHNlIGlmICghb3B0Lm5vZm4gJiYgZmllbGREZWYudGltZVVuaXQpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgZmllbGREZWYudGltZVVuaXQgKyAnXycgKyBmaWVsZCArIHN1ZmZpeDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJlZml4ICsgZmllbGQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2lzRmllbGREaW1lbnNpb24oZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIHJldHVybiBjb250YWlucyhbTk9NSU5BTCwgT1JESU5BTF0sIGZpZWxkRGVmLnR5cGUpIHx8ICEhZmllbGREZWYuYmluIHx8XG4gICAgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMICYmICEhZmllbGREZWYudGltZVVuaXQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEaW1lbnNpb24oZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIHJldHVybiBmaWVsZERlZiAmJiBmaWVsZERlZi5maWVsZCAmJiBfaXNGaWVsZERpbWVuc2lvbihmaWVsZERlZik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc01lYXN1cmUoZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIHJldHVybiBmaWVsZERlZiAmJiBmaWVsZERlZi5maWVsZCAmJiAhX2lzRmllbGREaW1lbnNpb24oZmllbGREZWYpO1xufVxuXG5leHBvcnQgY29uc3QgQ09VTlRfRElTUExBWU5BTUUgPSAnTnVtYmVyIG9mIFJlY29yZHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY291bnQoKTogRmllbGREZWYge1xuICByZXR1cm4geyBmaWVsZDogJyonLCBhZ2dyZWdhdGU6ICdjb3VudCcsIHR5cGU6IFFVQU5USVRBVElWRSwgZGlzcGxheU5hbWU6IENPVU5UX0RJU1BMQVlOQU1FIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvdW50KGZpZWxkRGVmOiBGaWVsZERlZikge1xuICByZXR1cm4gZmllbGREZWYuYWdncmVnYXRlID09PSAnY291bnQnO1xufVxuXG4vLyBGSVhNRSByZW1vdmUgdGhpcywgYW5kIHRoZSBnZXRiaW5zIG1ldGhvZFxuLy8gRklYTUUgdGhpcyBkZXBlbmRzIG9uIGNoYW5uZWxcbmV4cG9ydCBmdW5jdGlvbiBjYXJkaW5hbGl0eShmaWVsZERlZjogRmllbGREZWYsIHN0YXRzLCBmaWx0ZXJOdWxsID0ge30pIHtcbiAgLy8gRklYTUUgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcblxuICB2YXIgc3RhdCA9IHN0YXRzW2ZpZWxkRGVmLmZpZWxkXTtcbiAgdmFyIHR5cGUgPSBmaWVsZERlZi50eXBlO1xuXG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAvLyBuZWVkIHRvIHJlYXNzaWduIGJpbiwgb3RoZXJ3aXNlIGNvbXBpbGF0aW9uIHdpbGwgZmFpbCBkdWUgdG8gYSBUUyBidWcuXG4gICAgY29uc3QgYmluID0gZmllbGREZWYuYmluO1xuICAgIGxldCBtYXhiaW5zID0gKHR5cGVvZiBiaW4gPT09ICdib29sZWFuJykgPyB1bmRlZmluZWQgOiBiaW4ubWF4YmlucztcbiAgICBpZiAobWF4YmlucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtYXhiaW5zID0gMTA7XG4gICAgfVxuXG4gICAgdmFyIGJpbnMgPSBnZXRiaW5zKHN0YXQsIG1heGJpbnMpO1xuICAgIHJldHVybiAoYmlucy5zdG9wIC0gYmlucy5zdGFydCkgLyBiaW5zLnN0ZXA7XG4gIH1cbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMKSB7XG4gICAgdmFyIHRpbWVVbml0ID0gZmllbGREZWYudGltZVVuaXQ7XG4gICAgc3dpdGNoICh0aW1lVW5pdCkge1xuICAgICAgY2FzZSAnc2Vjb25kcyc6IHJldHVybiA2MDtcbiAgICAgIGNhc2UgJ21pbnV0ZXMnOiByZXR1cm4gNjA7XG4gICAgICBjYXNlICdob3Vycyc6IHJldHVybiAyNDtcbiAgICAgIGNhc2UgJ2RheSc6IHJldHVybiA3O1xuICAgICAgY2FzZSAnZGF0ZSc6IHJldHVybiAzMTtcbiAgICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIDEyO1xuICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgIHZhciB5ZWFyc3RhdCA9IHN0YXRzWyd5ZWFyXycgKyBmaWVsZERlZi5maWVsZF07XG5cbiAgICAgICAgaWYgKCF5ZWFyc3RhdCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICAgIHJldHVybiB5ZWFyc3RhdC5kaXN0aW5jdCAtXG4gICAgICAgICAgKHN0YXQubWlzc2luZyA+IDAgJiYgZmlsdGVyTnVsbFt0eXBlXSA/IDEgOiAwKTtcbiAgICB9XG4gICAgLy8gb3RoZXJ3aXNlIHVzZSBjYWxjdWxhdGlvbiBiZWxvd1xuICB9XG4gIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIC8vIHJlbW92ZSBudWxsXG4gIHJldHVybiBzdGF0LmRpc3RpbmN0IC1cbiAgICAoc3RhdC5taXNzaW5nID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUoZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIGlmIChpc0NvdW50KGZpZWxkRGVmKSkge1xuICAgIHJldHVybiBDT1VOVF9ESVNQTEFZTkFNRTtcbiAgfVxuICB2YXIgZm4gPSBmaWVsZERlZi5hZ2dyZWdhdGUgfHwgZmllbGREZWYudGltZVVuaXQgfHwgKGZpZWxkRGVmLmJpbiAmJiAnYmluJyk7XG4gIGlmIChmbikge1xuICAgIHJldHVybiBmbi50b1VwcGVyQ2FzZSgpICsgJygnICsgZmllbGREZWYuZmllbGQgKyAnKSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZpZWxkRGVmLmZpZWxkO1xuICB9XG59XG4iLCJleHBvcnQgZW51bSBNYXJrIHtcbiAgQVJFQSA9ICdhcmVhJyBhcyBhbnksXG4gIEJBUiA9ICdiYXInIGFzIGFueSxcbiAgTElORSA9ICdsaW5lJyBhcyBhbnksXG4gIFBPSU5UID0gJ3BvaW50JyBhcyBhbnksXG4gIFRFWFQgPSAndGV4dCcgYXMgYW55LFxuICBUSUNLID0gJ3RpY2snIGFzIGFueSxcbiAgQ0lSQ0xFID0gJ2NpcmNsZScgYXMgYW55LFxuICBTUVVBUkUgPSAnc3F1YXJlJyBhcyBhbnlcbn1cblxuZXhwb3J0IGNvbnN0IEFSRUEgPSBNYXJrLkFSRUE7XG5leHBvcnQgY29uc3QgQkFSID0gTWFyay5CQVI7XG5leHBvcnQgY29uc3QgTElORSA9IE1hcmsuTElORTtcbmV4cG9ydCBjb25zdCBQT0lOVCA9IE1hcmsuUE9JTlQ7XG5leHBvcnQgY29uc3QgVEVYVCA9IE1hcmsuVEVYVDtcbmV4cG9ydCBjb25zdCBUSUNLID0gTWFyay5USUNLO1xuXG5leHBvcnQgY29uc3QgQ0lSQ0xFID0gTWFyay5DSVJDTEU7XG5leHBvcnQgY29uc3QgU1FVQVJFID0gTWFyay5TUVVBUkU7XG4iLCJleHBvcnQgaW50ZXJmYWNlIEF4aXMge1xuICAvLyBWZWdhIEF4aXMgUHJvcGVydGllc1xuICBmb3JtYXQ/OiBzdHJpbmc7XG4gIGdyaWQ/OiBib29sZWFuO1xuICBsYXllcj86IHN0cmluZztcbiAgb2Zmc2V0PzogbnVtYmVyO1xuICBvcmllbnQ/OiBzdHJpbmc7XG4gIHN1YmRpdmlkZT86IG51bWJlcjtcbiAgdGlja3M/OiBudW1iZXI7XG4gIHRpY2tQYWRkaW5nPzogbnVtYmVyO1xuICB0aWNrU2l6ZT86IG51bWJlcjtcbiAgdGlja1NpemVNYWpvcj86IG51bWJlcjtcbiAgdGlja1NpemVNaW5vcj86IG51bWJlcjtcbiAgdGlja1NpemVFbmQ/OiBudW1iZXI7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB0aXRsZU9mZnNldD86IG51bWJlcjtcbiAgdmFsdWVzPzogbnVtYmVyW107XG4gIHByb3BlcnRpZXM/OiBhbnk7IC8vIFRPRE86IGRlY2xhcmUgVmdBeGlzUHJvcGVydGllc1xuICAvLyBWZWdhLUxpdGUgb25seVxuICBjaGFyYWN0ZXJXaWR0aD86IG51bWJlcjtcbiAgbGFiZWxNYXhMZW5ndGg/OiBudW1iZXI7XG4gIGxhYmVscz86IGJvb2xlYW47XG4gIHNob3J0VGltZUxhYmVscz86IGJvb2xlYW47XG4gIHRpdGxlTWF4TGVuZ3RoPzogbnVtYmVyO1xufVxuXG5leHBvcnQgdmFyIGF4aXMgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLyogVmVnYSBBeGlzIFByb3BlcnRpZXMgKi9cbiAgICBmb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9ybWF0dGluZyBwYXR0ZXJuIGZvciBheGlzIGxhYmVscy4gSWYgdW5kZWZpbmVkLCBhIGdvb2QgZm9ybWF0IGlzIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lZC4gVmVnYS1MaXRlIHVzZXMgRDNcXCdzIGZvcm1hdCBwYXR0ZXJuIGFuZCBhdXRvbWF0aWNhbGx5IHN3aXRjaGVzIHRvIGRhdGV0aW1lIGZvcm1hdHRlcnMuJ1xuICAgIH0sXG4gICAgZ3JpZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdBIGZsYWcgaW5kaWNhdGUgaWYgZ3JpZGxpbmVzIHNob3VsZCBiZSBjcmVhdGVkIGluIGFkZGl0aW9uIHRvIHRpY2tzLiBJZiBgZ3JpZGAgaXMgdW5zcGVjaWZpZWQsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGB0cnVlYCBmb3IgUk9XIGFuZCBDT0wuIEZvciBYIGFuZCBZLCB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAgZm9yIHF1YW50aXRhdGl2ZSBhbmQgdGltZSBmaWVsZHMgYW5kIGBmYWxzZWAgb3RoZXJ3aXNlLidcbiAgICB9LFxuICAgIGxheWVyOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBzdHJpbmcgaW5kaWNhdGluZyBpZiB0aGUgYXhpcyAoYW5kIGFueSBncmlkbGluZXMpIHNob3VsZCBiZSBwbGFjZWQgYWJvdmUgb3IgYmVsb3cgdGhlIGRhdGEgbWFya3MuJ1xuICAgIH0sXG4gICAgb2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9mZnNldCwgaW4gcGl4ZWxzLCBieSB3aGljaCB0byBkaXNwbGFjZSB0aGUgYXhpcyBmcm9tIHRoZSBlZGdlIG9mIHRoZSBlbmNsb3NpbmcgZ3JvdXAgb3IgZGF0YSByZWN0YW5nbGUuJ1xuICAgIH0sXG4gICAgb3JpZW50OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGVudW06IFsndG9wJywgJ3JpZ2h0JywgJ2xlZnQnLCAnYm90dG9tJ10sXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXhpcy4gT25lIG9mIHRvcCwgYm90dG9tLCBsZWZ0IG9yIHJpZ2h0LiBUaGUgb3JpZW50YXRpb24gY2FuIGJlIHVzZWQgdG8gZnVydGhlciBzcGVjaWFsaXplIHRoZSBheGlzIHR5cGUgKGUuZy4sIGEgeSBheGlzIG9yaWVudGVkIGZvciB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgY2hhcnQpLidcbiAgICB9LFxuICAgIHN1YmRpdmlkZToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHByb3ZpZGVkLCBzZXRzIHRoZSBudW1iZXIgb2YgbWlub3IgdGlja3MgYmV0d2VlbiBtYWpvciB0aWNrcyAodGhlIHZhbHVlIDkgcmVzdWx0cyBpbiBkZWNpbWFsIHN1YmRpdmlzaW9uKS4gT25seSBhcHBsaWNhYmxlIGZvciBheGVzIHZpc3VhbGl6aW5nIHF1YW50aXRhdGl2ZSBzY2FsZXMuJ1xuICAgIH0sXG4gICAgdGlja3M6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgZGVzaXJlZCBudW1iZXIgb2YgdGlja3MsIGZvciBheGVzIHZpc3VhbGl6aW5nIHF1YW50aXRhdGl2ZSBzY2FsZXMuIFRoZSByZXN1bHRpbmcgbnVtYmVyIG1heSBiZSBkaWZmZXJlbnQgc28gdGhhdCB2YWx1ZXMgYXJlIFwibmljZVwiIChtdWx0aXBsZXMgb2YgMiwgNSwgMTApIGFuZCBsaWUgd2l0aGluIHRoZSB1bmRlcmx5aW5nIHNjYWxlXFwncyByYW5nZS4nXG4gICAgfSxcbiAgICB0aWNrUGFkZGluZzoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgcGFkZGluZywgaW4gcGl4ZWxzLCBiZXR3ZWVuIHRpY2tzIGFuZCB0ZXh0IGxhYmVscy4nXG4gICAgfSxcbiAgICB0aWNrU2l6ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHNpemUsIGluIHBpeGVscywgb2YgbWFqb3IsIG1pbm9yIGFuZCBlbmQgdGlja3MuJ1xuICAgIH0sXG4gICAgdGlja1NpemVNYWpvcjoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHNpemUsIGluIHBpeGVscywgb2YgbWFqb3IgdGlja3MuJ1xuICAgIH0sXG4gICAgdGlja1NpemVNaW5vcjoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHNpemUsIGluIHBpeGVscywgb2YgbWlub3IgdGlja3MuJ1xuICAgIH0sXG4gICAgdGlja1NpemVFbmQ6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBzaXplLCBpbiBwaXhlbHMsIG9mIGVuZCB0aWNrcy4nXG4gICAgfSxcbiAgICB0aXRsZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgZm9yIHRoZSBheGlzLiAoU2hvd3MgZmllbGQgbmFtZSBhbmQgaXRzIGZ1bmN0aW9uIGJ5IGRlZmF1bHQuKSdcbiAgICB9LFxuICAgIHRpdGxlT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgb2Zmc2V0IHZhbHVlIGZvciB0aGUgYXhpcy4nXG4gICAgfSxcbiAgICB2YWx1ZXM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgZGVzY3JpcHRpb246ICdPcHRpb25hbCBtYXJrIHByb3BlcnR5IGRlZmluaXRpb25zIGZvciBjdXN0b20gYXhpcyBzdHlsaW5nLidcbiAgICB9LFxuICAgIC8qIFZlZ2EtbGl0ZSBvbmx5ICovXG4gICAgY2hhcmFjdGVyV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDYsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NoYXJhY3RlciB3aWR0aCBmb3IgYXV0b21hdGljYWxseSBkZXRlcm1pbmluZyB0aXRsZSBtYXggbGVuZ3RoLidcbiAgICB9LFxuICAgIGxhYmVsTWF4TGVuZ3RoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyNSxcbiAgICAgIG1pbmltdW06IDEsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RydW5jYXRlIGxhYmVscyB0aGF0IGFyZSB0b28gbG9uZy4nXG4gICAgfSxcbiAgICBsYWJlbHM6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuYWJsZSBvciBkaXNhYmxlIGxhYmVscy4nXG4gICAgfSxcbiAgICBzaG9ydFRpbWVMYWJlbHM6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIG1vbnRoIGFuZCBkYXkgbmFtZXMgc2hvdWxkIGJlIGFiYnJldmlhdGVkLidcbiAgICB9LFxuICAgIHRpdGxlTWF4TGVuZ3RoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXggbGVuZ3RoIGZvciBheGlzIHRpdGxlIGlmIHRoZSB0aXRsZSBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBmcm9tIHRoZSBmaWVsZFxcJ3MgZGVzY3JpcHRpb24uJyArXG4gICAgICAnQnkgZGVmYXVsdCwgdGhpcyBpcyBhdXRvbWF0aWNhbGx5IGJhc2VkIG9uIGNlbGwgc2l6ZSBhbmQgY2hhcmFjdGVyV2lkdGggcHJvcGVydHkuJ1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7UVVBTlRJVEFUSVZFfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7dG9NYXB9IGZyb20gJy4uL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJpbiB7XG4gIG1pbj86IG51bWJlcjtcbiAgbWF4PzogbnVtYmVyO1xuICBiYXNlPzogbnVtYmVyO1xuICBzdGVwPzogbnVtYmVyO1xuICBzdGVwcz86IG51bWJlcltdO1xuICBtaW5zdGVwPzogbnVtYmVyO1xuICBkaXY/OiBudW1iZXJbXTtcbiAgbWF4Ymlucz86IG51bWJlcjtcbn1cblxuZXhwb3J0IHZhciBiaW4gPSB7XG4gIHR5cGU6IFsnYm9vbGVhbicsICdvYmplY3QnXSxcbiAgZGVmYXVsdDogZmFsc2UsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBtaW46IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgbWluaW11bSBiaW4gdmFsdWUgdG8gY29uc2lkZXIuIElmIHVuc3BlY2lmaWVkLCB0aGUgbWluaW11bSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIGZpZWxkIGlzIHVzZWQuJ1xuICAgIH0sXG4gICAgbWF4OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG1heGltdW0gYmluIHZhbHVlIHRvIGNvbnNpZGVyLiBJZiB1bnNwZWNpZmllZCwgdGhlIG1heGltdW0gdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBmaWVsZCBpcyB1c2VkLidcbiAgICB9LFxuICAgIGJhc2U6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgbnVtYmVyIGJhc2UgdG8gdXNlIGZvciBhdXRvbWF0aWMgYmluIGRldGVybWluYXRpb24gKGRlZmF1bHQgaXMgYmFzZSAxMCkuJ1xuICAgIH0sXG4gICAgc3RlcDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FuIGV4YWN0IHN0ZXAgc2l6ZSB0byB1c2UgYmV0d2VlbiBiaW5zLiBJZiBwcm92aWRlZCwgb3B0aW9ucyBzdWNoIGFzIG1heGJpbnMgd2lsbCBiZSBpZ25vcmVkLidcbiAgICB9LFxuICAgIHN0ZXBzOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdBbiBhcnJheSBvZiBhbGxvd2FibGUgc3RlcCBzaXplcyB0byBjaG9vc2UgZnJvbS4nXG4gICAgfSxcbiAgICBtaW5zdGVwOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBtaW5pbXVtIGFsbG93YWJsZSBzdGVwIHNpemUgKHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIGludGVnZXIgdmFsdWVzKS4nXG4gICAgfSxcbiAgICBkaXY6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NjYWxlIGZhY3RvcnMgaW5kaWNhdGluZyBhbGxvd2FibGUgc3ViZGl2aXNpb25zLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBbNSwgMl0sIHdoaWNoIGluZGljYXRlcyB0aGF0IGZvciBiYXNlIDEwIG51bWJlcnMgKHRoZSBkZWZhdWx0IGJhc2UpLCB0aGUgbWV0aG9kIG1heSBjb25zaWRlciBkaXZpZGluZyBiaW4gc2l6ZXMgYnkgNSBhbmQvb3IgMi4gRm9yIGV4YW1wbGUsIGZvciBhbiBpbml0aWFsIHN0ZXAgc2l6ZSBvZiAxMCwgdGhlIG1ldGhvZCBjYW4gY2hlY2sgaWYgYmluIHNpemVzIG9mIDIgKD0gMTAvNSksIDUgKD0gMTAvMiksIG9yIDEgKD0gMTAvKDUqMikpIG1pZ2h0IGFsc28gc2F0aXNmeSB0aGUgZ2l2ZW4gY29uc3RyYWludHMuJ1xuICAgIH0sXG4gICAgbWF4Ymluczoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMixcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWF4aW11bSBudW1iZXIgb2YgYmlucy4nXG4gICAgfVxuICB9LFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRV0pIC8vIFRPRE86IGFkZCBPIGFmdGVyIGZpbmlzaGluZyAjODFcbn07XG4iLCJleHBvcnQgaW50ZXJmYWNlIENlbGxDb25maWcge1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuXG4gIGdyaWRDb2xvcj86IHN0cmluZztcbiAgZ3JpZE9wYWNpdHk/OiBudW1iZXI7XG4gIGdyaWRPZmZzZXQ/OiBudW1iZXI7XG5cbiAgZmlsbD86IHN0cmluZztcbiAgZmlsbE9wYWNpdHk/OiBudW1iZXI7XG4gIHN0cm9rZT86IHN0cmluZztcbiAgc3Ryb2tlV2lkdGg/OiBudW1iZXI7XG4gIHN0cm9rZU9wYWNpdHk/IDpudW1iZXI7XG4gIHN0cm9rZURhc2g/OiBudW1iZXI7XG4gIHN0cm9rZURhc2hPZmZzZXQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjb25zdCBjZWxsQ29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDBcbiAgICB9LFxuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjAwXG4gICAgfSxcbiAgICBncmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICcjMDAwMDAwJ1xuICAgIH0sXG4gICAgZ3JpZE9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDEsXG4gICAgICBkZWZhdWx0OiAwLjRcbiAgICB9LFxuICAgIGdyaWRPZmZzZXQ6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH0sXG5cbiAgICAvLyBHcm91cCBwcm9wZXJ0aWVzXG4gICAgY2xpcDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIH0sXG4gICAgZmlsbDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJ3JnYmEoMCwwLDAsMCknXG4gICAgfSxcbiAgICBmaWxsT3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgfSxcbiAgICBzdHJva2U6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICB9LFxuICAgIHN0cm9rZVdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICB9LFxuICAgIHN0cm9rZU9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgfSxcbiAgICBzdHJva2VEYXNoOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBzdHJva2VEYXNoT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvZmZzZXQgKGluIHBpeGVscykgaW50byB3aGljaCB0byBiZWdpbiBkcmF3aW5nIHdpdGggdGhlIHN0cm9rZSBkYXNoIGFycmF5LidcbiAgICB9XG4gIH1cbn07XG4iLCJleHBvcnQgaW50ZXJmYWNlIE1hcmtDb25maWcge1xuICAvLyBWZWdhLUxpdGUgU3BlY2lmaWNcbiAgZmlsbGVkPzogYm9vbGVhbjtcbiAgY29sb3I/OiBzdHJpbmc7XG4gIGJhcldpZHRoPzogbnVtYmVyO1xuICB0aWNrV2lkdGg/OiBudW1iZXI7XG5cbiAgLy8gR2VuZXJhbCBWZWdhXG4gIG9wYWNpdHk/OiBudW1iZXI7XG4gIHN0cm9rZVdpZHRoPzogbnVtYmVyO1xuICBzdHJva2VEYXNoPzogbnVtYmVyW107XG4gIHN0cm9rZURhc2hPZmZzZXQ/OiBudW1iZXJbXTtcbiAgZmlsbD86IHN0cmluZztcbiAgZmlsbE9wYWNpdHk/OiBudW1iZXI7XG4gIHN0cm9rZT86IHN0cmluZztcbiAgc3Ryb2tlT3BhY2l0eT86IG51bWJlcjtcblxuXG4gIC8vIEJhciwgVGljaywgTGluZSwgQXJlYVxuICBvcmllbnQ/OiBzdHJpbmc7XG4gIC8vIExpbmUgLyBhcmVhXG4gIGludGVycG9sYXRlPzogc3RyaW5nO1xuICB0ZW5zaW9uPzogbnVtYmVyO1xuXG4gIC8vIFBvaW50IC8gU3F1YXJlIC8gQ2lyY2xlXG4gIHNoYXBlPzogc3RyaW5nO1xuICBzaXplPzogbnVtYmVyO1xuXG4gIC8vIFRpY2stb25seVxuICB0aGlja25lc3M/OiBudW1iZXI7XG5cbiAgLy8gVGV4dC1vbmx5XG4gIGFsaWduPzogc3RyaW5nO1xuICBhbmdsZT86IG51bWJlcjtcbiAgYmFzZWxpbmU/OiBzdHJpbmc7XG4gIGR4PzogbnVtYmVyO1xuICBkeT86IG51bWJlcjtcbiAgcmFkaXVzPzogbnVtYmVyO1xuICB0aGV0YT86IG51bWJlcjtcbiAgZm9udD86IHN0cmluZztcbiAgZm9udFNpemU/OiBudW1iZXI7XG4gIGZvbnRTdHlsZT86IHN0cmluZztcbiAgZm9udFdlaWdodD86IHN0cmluZztcbiAgLy8gVmVnYS1MaXRlIG9ubHkgZm9yIHRleHQgb25seVxuICBmb3JtYXQ/OiBzdHJpbmc7XG4gIHNob3J0VGltZUxhYmVscz86IGJvb2xlYW47XG5cbiAgYXBwbHlDb2xvclRvQmFja2dyb3VuZD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBtYXJrQ29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIC8vIFZlZ2EtTGl0ZSBzcGVjaWFsXG4gICAgZmlsbGVkOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdGhlIHNoYXBlXFwncyBjb2xvciBzaG91bGQgYmUgdXNlZCBhcyBmaWxsIGNvbG9yIGluc3RlYWQgb2Ygc3Ryb2tlIGNvbG9yLiAnICtcbiAgICAgICAgJ1RoaXMgaXMgb25seSBhcHBsaWNhYmxlIGZvciBcImJhclwiLCBcInBvaW50XCIsIGFuZCBcImFyZWFcIi4gJyArXG4gICAgICAgICdBbGwgbWFya3MgZXhjZXB0IFwicG9pbnRcIiBtYXJrcyBhcmUgZmlsbGVkIGJ5IGRlZmF1bHQuJ1xuICAgIH0sXG4gICAgY29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICcjNDY4MmI0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVmYXVsdCBjb2xvci4nXG4gICAgfSxcbiAgICBiYXJXaWR0aDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSB3aWR0aCBvZiB0aGUgYmFycy4gIElmIHVuc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCB3aWR0aCBpcyAgYGJhbmRXaWR0aC0xYCwgd2hpY2ggcHJvdmlkZXMgMSBwaXhlbCBvZmZzZXQgYmV0d2VlbiBiYXJzLidcbiAgICB9LFxuICAgIHRpY2tXaWR0aDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgd2lkdGggb2YgdGhlIHRpY2tzLidcbiAgICB9LFxuICAgIC8vIEdlbmVyYWwgVmVnYVxuICAgIGZpbGw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgZmlsbE9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDFcbiAgICB9LFxuICAgIHN0cm9rZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBzdHJva2VPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxXG4gICAgfSxcbiAgICBvcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxXG4gICAgfSxcbiAgICBzdHJva2VXaWR0aDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgc3Ryb2tlRGFzaDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQW4gYXJyYXkgb2YgYWx0ZXJuYXRpbmcgc3Ryb2tlLCBzcGFjZSBsZW5ndGhzIGZvciBjcmVhdGluZyBkYXNoZWQgb3IgZG90dGVkIGxpbmVzLidcbiAgICB9LFxuICAgIHN0cm9rZURhc2hPZmZzZXQ6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvZmZzZXQgKGluIHBpeGVscykgaW50byB3aGljaCB0byBiZWdpbiBkcmF3aW5nIHdpdGggdGhlIHN0cm9rZSBkYXNoIGFycmF5LidcbiAgICB9LFxuXG4gICAgLy8gQmFyLCBUaWNrLCBMaW5lLCBBcmVhXG4gICAgb3JpZW50OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9yaWVudGF0aW9uIG9mIGEgbm9uLXN0YWNrZWQgYmFyLCB0aWNrLCBhcmVhLCBhbmQgbGluZSBjaGFydHMuJyArXG4gICAgICAgJ1RoZSB2YWx1ZSBpcyBlaXRoZXIgaG9yaXpvbnRhbCAoZGVmYXVsdCkgb3IgdmVydGljYWwuJyArXG4gICAgICAgJ0ZvciBiYXIgYW5kIHRpY2ssIHRoaXMgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzaXplIG9mIHRoZSBiYXIgYW5kIHRpY2sgc2hvdWxkIGJlIGFwcGxpZWQgdG8geCBvciB5IGRpbWVuc2lvbi4nICtcbiAgICAgICAnRm9yIGFyZWEsIHRoaXMgcHJvcGVydHkgZGV0ZXJtaW5lcyB0aGUgb3JpZW50IHByb3BlcnR5IG9mIHRoZSBWZWdhIG91dHB1dC4nICtcbiAgICAgICAnRm9yIGxpbmUsIHRoaXMgcHJvcGVydHkgZGV0ZXJtaW5lcyB0aGUgc29ydCBvcmRlciBvZiB0aGUgcG9pbnRzIGluIHRoZSBsaW5lIGlmIGBjb25maWcuc29ydExpbmVCeWAgaXMgbm90IHNwZWNpZmllZC4nICtcbiAgICAgICAnRm9yIHN0YWNrZWQgY2hhcnRzLCB0aGlzIGlzIGFsd2F5cyBkZXRlcm1pbmVkIGJ5IHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc3RhY2s7ICcgK1xuICAgICAgICd0aGVyZWZvcmUgZXhwbGljaXRseSBzcGVjaWZpZWQgdmFsdWUgd2lsbCBiZSBpZ25vcmVkLidcbiAgICB9LFxuXG4gICAgLy8gbGluZSAvIGFyZWFcbiAgICBpbnRlcnBvbGF0ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAvLyBUT0RPIGJldHRlciBkZXNjcmliZSB0aGF0IHNvbWUgb2YgdGhlbSBpc24ndCBzdXBwb3J0ZWQgaW4gYXJlYVxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgbGluZSBpbnRlcnBvbGF0aW9uIG1ldGhvZCB0byB1c2UuIE9uZSBvZiBsaW5lYXIsIHN0ZXAtYmVmb3JlLCBzdGVwLWFmdGVyLCBiYXNpcywgYmFzaXMtb3BlbiwgYmFzaXMtY2xvc2VkLCBidW5kbGUsIGNhcmRpbmFsLCBjYXJkaW5hbC1vcGVuLCBjYXJkaW5hbC1jbG9zZWQsIG1vbm90b25lLidcbiAgICB9LFxuICAgIHRlbnNpb246IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdEZXBlbmRpbmcgb24gdGhlIGludGVycG9sYXRpb24gdHlwZSwgc2V0cyB0aGUgdGVuc2lvbiBwYXJhbWV0ZXIuJ1xuICAgIH0sXG5cbiAgICAvLyBwb2ludFxuICAgIHNoYXBlOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGVudW06IFsnY2lyY2xlJywgJ3NxdWFyZScsICdjcm9zcycsICdkaWFtb25kJywgJ3RyaWFuZ2xlLXVwJywgJ3RyaWFuZ2xlLWRvd24nXSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHN5bWJvbCBzaGFwZSB0byB1c2UuIE9uZSBvZiBjaXJjbGUgKGRlZmF1bHQpLCBzcXVhcmUsIGNyb3NzLCBkaWFtb25kLCB0cmlhbmdsZS11cCwgb3IgdHJpYW5nbGUtZG93bi4nXG4gICAgfSxcbiAgICAvLyBwb2ludCAvIGNpcmNsZSAvIHNxdWFyZVxuICAgIHNpemU6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMzAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBwaXhlbCBhcmVhIGVhY2ggdGhlIHBvaW50LiBGb3IgZXhhbXBsZTogaW4gdGhlIGNhc2Ugb2YgY2lyY2xlcywgdGhlIHJhZGl1cyBpcyBkZXRlcm1pbmVkIGluIHBhcnQgYnkgdGhlIHNxdWFyZSByb290IG9mIHRoZSBzaXplIHZhbHVlLidcbiAgICB9LFxuXG4gICAgLy8gVGljay1vbmx5XG4gICAgdGhpY2tuZXNzOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaWNrbmVzcyBvZiB0aGUgdGljayBtYXJrLidcbiAgICB9LFxuXG4gICAgLy8gdGV4dC1vbmx5XG4gICAgYWxpZ246IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZW51bTogWydsZWZ0JywgJ3JpZ2h0JywgJ2NlbnRlciddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgaG9yaXpvbnRhbCBhbGlnbm1lbnQgb2YgdGhlIHRleHQuIE9uZSBvZiBsZWZ0LCByaWdodCwgY2VudGVyLidcbiAgICB9LFxuICAgIGFuZ2xlOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHJvdGF0aW9uIGFuZ2xlIG9mIHRoZSB0ZXh0LCBpbiBkZWdyZWVzLidcbiAgICB9LFxuICAgIGJhc2VsaW5lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdtaWRkbGUnLFxuICAgICAgZW51bTogWyd0b3AnLCAnbWlkZGxlJywgJ2JvdHRvbSddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgdmVydGljYWwgYWxpZ25tZW50IG9mIHRoZSB0ZXh0LiBPbmUgb2YgdG9wLCBtaWRkbGUsIGJvdHRvbS4nXG4gICAgfSxcbiAgICBkeDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBob3Jpem9udGFsIG9mZnNldCwgaW4gcGl4ZWxzLCBiZXR3ZWVuIHRoZSB0ZXh0IGxhYmVsIGFuZCBpdHMgYW5jaG9yIHBvaW50LiBUaGUgb2Zmc2V0IGlzIGFwcGxpZWQgYWZ0ZXIgcm90YXRpb24gYnkgdGhlIGFuZ2xlIHByb3BlcnR5LidcbiAgICB9LFxuICAgIGR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHZlcnRpY2FsIG9mZnNldCwgaW4gcGl4ZWxzLCBiZXR3ZWVuIHRoZSB0ZXh0IGxhYmVsIGFuZCBpdHMgYW5jaG9yIHBvaW50LiBUaGUgb2Zmc2V0IGlzIGFwcGxpZWQgYWZ0ZXIgcm90YXRpb24gYnkgdGhlIGFuZ2xlIHByb3BlcnR5LidcbiAgICB9LFxuICAgIGZvbnQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgcm9sZTogJ2ZvbnQnLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgdHlwZWZhY2UgdG8gc2V0IHRoZSB0ZXh0IGluIChlLmcuLCBIZWx2ZXRpY2EgTmV1ZSkuJ1xuICAgIH0sXG4gICAgZm9udFNpemU6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMTAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb250IHNpemUsIGluIHBpeGVscy4nXG4gICAgfSxcbiAgICAvLyBmb250U2l6ZSBleGNsdWRlZCBhcyB3ZSB1c2Ugc2l6ZS52YWx1ZVxuICAgIGZvbnRTdHlsZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBlbnVtOiBbJ25vcm1hbCcsICdpdGFsaWMnXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvbnQgc3R5bGUgKGUuZy4sIGl0YWxpYykuJ1xuICAgIH0sXG4gICAgZm9udFdlaWdodDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ25vcm1hbCcsICdib2xkJ10sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb250IHdlaWdodCAoZS5nLiwgYm9sZCkuJ1xuICAgIH0sXG4gICAgcmFkaXVzOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUG9sYXIgY29vcmRpbmF0ZSByYWRpYWwgb2Zmc2V0LCBpbiBwaXhlbHMsIG9mIHRoZSB0ZXh0IGxhYmVsIGZyb20gdGhlIG9yaWdpbiBkZXRlcm1pbmVkIGJ5IHRoZSB4IGFuZCB5IHByb3BlcnRpZXMuJ1xuICAgIH0sXG4gICAgdGhldGE6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdQb2xhciBjb29yZGluYXRlIGFuZ2xlLCBpbiByYWRpYW5zLCBvZiB0aGUgdGV4dCBsYWJlbCBmcm9tIHRoZSBvcmlnaW4gZGV0ZXJtaW5lZCBieSB0aGUgeCBhbmQgeSBwcm9wZXJ0aWVzLiBWYWx1ZXMgZm9yIHRoZXRhIGZvbGxvdyB0aGUgc2FtZSBjb252ZW50aW9uIG9mIGFyYyBtYXJrIHN0YXJ0QW5nbGUgYW5kIGVuZEFuZ2xlIHByb3BlcnRpZXM6IGFuZ2xlcyBhcmUgbWVhc3VyZWQgaW4gcmFkaWFucywgd2l0aCAwIGluZGljYXRpbmcgXCJub3J0aFwiLidcbiAgICB9LFxuICAgIC8vIHRleHQtb25seSAmIFZMIG9ubHlcbiAgICBmb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9ybWF0dGluZyBwYXR0ZXJuIGZvciB0ZXh0IHZhbHVlLiBJZiBub3QgZGVmaW5lZCwgdGhpcyB3aWxsIGJlIGRldGVybWluZWQgYXV0b21hdGljYWxseS4gJ1xuICAgIH0sXG4gICAgc2hvcnRUaW1lTGFiZWxzOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciBtb250aCBuYW1lcyBhbmQgd2Vla2RheSBuYW1lcyBzaG91bGQgYmUgYWJicmV2aWF0ZWQuJ1xuICAgIH0sXG4gICAgYXBwbHlDb2xvclRvQmFja2dyb3VuZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FwcGx5IGNvbG9yIGZpZWxkIHRvIGJhY2tncm91bmQgY29sb3IgaW5zdGVhZCBvZiB0aGUgdGV4dC4nXG4gICAgfVxuICB9XG59O1xuIiwiZXhwb3J0IGludGVyZmFjZSBTY2VuZUNvbmZpZyB7XG4gIGZpbGw/OiBzdHJpbmc7XG4gIGZpbGxPcGFjaXR5PzogbnVtYmVyO1xuICBzdHJva2U/OiBzdHJpbmc7XG4gIHN0cm9rZVdpZHRoPzogbnVtYmVyO1xuICBzdHJva2VPcGFjaXR5PyA6bnVtYmVyO1xuICBzdHJva2VEYXNoPzogbnVtYmVyO1xuICBzdHJva2VEYXNoT2Zmc2V0PzogbnVtYmVyO1xufVxuXG5leHBvcnQgY29uc3Qgc2NlbmVDb25maWcgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZmlsbDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InXG4gICAgfSxcbiAgICBmaWxsT3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgfSxcbiAgICBzdHJva2U6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICB9LFxuICAgIHN0cm9rZVdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICB9LFxuICAgIHN0cm9rZU9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgfSxcbiAgICBzdHJva2VEYXNoOiB7XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgfSxcbiAgICBzdHJva2VEYXNoT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvZmZzZXQgKGluIHBpeGVscykgaW50byB3aGljaCB0byBiZWdpbiBkcmF3aW5nIHdpdGggdGhlIHN0cm9rZSBkYXNoIGFycmF5LidcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQge1N0YWNrQ29uZmlnLCBzdGFja0NvbmZpZ30gZnJvbSAnLi9jb25maWcuc3RhY2suc2NoZW1hJztcbmltcG9ydCB7Q2VsbENvbmZpZywgY2VsbENvbmZpZ30gZnJvbSAnLi9jb25maWcuY2VsbC5zY2hlbWEnO1xuaW1wb3J0IHtNYXJrQ29uZmlnLCBtYXJrQ29uZmlnfSBmcm9tICcuL2NvbmZpZy5tYXJrcy5zY2hlbWEnO1xuaW1wb3J0IHtTY2VuZUNvbmZpZywgc2NlbmVDb25maWd9IGZyb20gJy4vY29uZmlnLnNjZW5lLnNjaGVtYSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgcGFkZGluZz86IG51bWJlcnxzdHJpbmc7XG4gIHZpZXdwb3J0PzogbnVtYmVyO1xuICBiYWNrZ3JvdW5kPzogc3RyaW5nO1xuXG4gIG51bWJlckZvcm1hdD86IHN0cmluZztcbiAgdGltZUZvcm1hdD86IHN0cmluZztcblxuICBjZWxsPzogQ2VsbENvbmZpZztcbiAgbWFyaz86IE1hcmtDb25maWc7XG4gIHNjZW5lPzogU2NlbmVDb25maWc7XG4gIHN0YWNrPzogU3RhY2tDb25maWc7XG59XG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gdGVtcGxhdGVcbiAgICAvLyBUT0RPOiBhZGQgdGhpcyBiYWNrIG9uY2Ugd2UgaGF2ZSB0b3AtZG93biBsYXlvdXQgYXBwcm9hY2hcbiAgICAvLyB3aWR0aDoge1xuICAgIC8vICAgdHlwZTogJ2ludGVnZXInLFxuICAgIC8vICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgLy8gfSxcbiAgICAvLyBoZWlnaHQ6IHtcbiAgICAvLyAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAvLyAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIC8vIH0sXG4gICAgLy8gcGFkZGluZzoge1xuICAgIC8vICAgdHlwZTogWydudW1iZXInLCAnc3RyaW5nJ10sXG4gICAgLy8gICBkZWZhdWx0OiAnYXV0bydcbiAgICAvLyB9LFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgb24tc2NyZWVuIHZpZXdwb3J0LCBpbiBwaXhlbHMuIElmIG5lY2Vzc2FyeSwgY2xpcHBpbmcgYW5kIHNjcm9sbGluZyB3aWxsIGJlIGFwcGxpZWQuJ1xuICAgIH0sXG4gICAgYmFja2dyb3VuZDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdDU1MgY29sb3IgcHJvcGVydHkgdG8gdXNlIGFzIGJhY2tncm91bmQgb2YgdmlzdWFsaXphdGlvbi4gRGVmYXVsdCBpcyBgXCJ0cmFuc3BhcmVudFwiYC4nXG4gICAgfSxcblxuICAgIC8vIGZvcm1hdHNcbiAgICBudW1iZXJGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdEMyBOdW1iZXIgZm9ybWF0IGZvciBheGlzIGxhYmVscyBhbmQgdGV4dCB0YWJsZXMuIEZvciBleGFtcGxlIFwic1wiIGZvciBTSSB1bml0cy4nXG4gICAgfSxcbiAgICB0aW1lRm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICclWS0lbS0lZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0RlZmF1bHQgZGF0ZXRpbWUgZm9ybWF0IGZvciBheGlzIGFuZCBsZWdlbmQgbGFiZWxzLiBUaGUgZm9ybWF0IGNhbiBiZSBzZXQgZGlyZWN0bHkgb24gZWFjaCBheGlzIGFuZCBsZWdlbmQuJ1xuICAgIH0sXG5cbiAgICAvLyBuZXN0ZWRcbiAgICBzdGFjazogc3RhY2tDb25maWcsXG4gICAgY2VsbDogY2VsbENvbmZpZyxcbiAgICBtYXJrOiBtYXJrQ29uZmlnLFxuICAgIHNjZW5lOiBzY2VuZUNvbmZpZ1xuICB9XG59O1xuIiwiZXhwb3J0IGludGVyZmFjZSBTdGFja0NvbmZpZyB7XG4gIHNvcnQ/OiBzdHJpbmd8c3RyaW5nW107XG4gIG9mZnNldD86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IHN0YWNrQ29uZmlnID0ge1xuICB0eXBlOiBbJ2Jvb2xlYW4nLCAnb2JqZWN0J10sXG4gIGRlZmF1bHQ6IHt9LFxuICBkZXNjcmlwdGlvbjogJ0VuYWJsZSBzdGFja2luZyAoZm9yIGJhciBhbmQgYXJlYSBtYXJrcyBvbmx5KS4nLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc29ydDoge1xuICAgICAgb25lT2Y6IFt7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBlbnVtOiBbJ2FzY2VuZGluZycsICdkZXNjZW5kaW5nJ11cbiAgICAgIH0se1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBpdGVtczoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgIH1dLFxuICAgICAgZGVzY3JpcHRpb246ICdPcmRlciBvZiB0aGUgc3RhY2suICcgK1xuICAgICAgICAnVGhpcyBjYW4gYmUgZWl0aGVyIGEgc3RyaW5nIChlaXRoZXIgXCJkZXNjZW5kaW5nXCIgb3IgXCJhc2NlbmRpbmdcIiknICtcbiAgICAgICAgJ29yIGEgbGlzdCBvZiBmaWVsZHMgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBvZiBzdGFjayBsYXllcnMuJyArXG4gICAgICAgICdCeSBkZWZhdWx0LCBzdGFjayB1c2VzIGRlc2NlbmRpbmcgb3JkZXIuJ1xuICAgIH0sXG4gICAgb2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnemVybycsICdjZW50ZXInLCAnbm9ybWFsaXplJ11cbiAgICAgIC8vIFRPRE8oIzYyMCkgcmVmZXIgdG8gVmVnYSBzcGVjIG9uY2UgaXQgZG9lc24ndCB0aHJvdyBlcnJvclxuICAgICAgLy8gZW51bTogdmdTdGFja1NjaGVtYS5wcm9wZXJ0aWVzLm9mZnNldC5vbmVPZlswXS5lbnVtXG4gICAgfVxuICB9XG59O1xuIiwiZXhwb3J0IGludGVyZmFjZSBEYXRhIHtcbiAgZm9ybWF0VHlwZT86IHN0cmluZztcbiAgdXJsPzogc3RyaW5nO1xuICB2YWx1ZXM/OiBhbnlbXTtcbn1cblxuZXhwb3J0IHZhciBkYXRhID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIC8vIGRhdGEgc291cmNlXG4gICAgZm9ybWF0VHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2pzb24nLCAnY3N2JywgJ3RzdiddLFxuICAgICAgZGVmYXVsdDogJ2pzb24nXG4gICAgfSxcbiAgICB1cmw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2YWx1ZXM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Bhc3MgYXJyYXkgb2Ygb2JqZWN0cyBpbnN0ZWFkIG9mIGEgdXJsIHRvIGEgZmlsZS4nLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHtGaWVsZERlZiwgZmFjZXRGaWVsZERlZiwgb3JkZXJGaWVsZERlZnMsIHBvc2l0aW9uRmllbGREZWYsIHNoYXBlRmllbGREZWYsIHNpemVGaWVsZERlZiwgdGV4dEZpZWxkRGVmLCBjb2xvckZpZWxkRGVmfSBmcm9tICcuL2ZpZWxkZGVmLnNjaGVtYSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW5jb2Rpbmcge1xuICB4PzogRmllbGREZWY7XG4gIHk/OiBGaWVsZERlZjtcbiAgcm93PzogRmllbGREZWY7XG4gIGNvbHVtbj86IEZpZWxkRGVmO1xuICBjb2xvcj86IEZpZWxkRGVmO1xuICBzaXplPzogRmllbGREZWY7XG4gIHNoYXBlPzogRmllbGREZWY7XG4gIHBhdGg/OiBGaWVsZERlZiB8IEZpZWxkRGVmW107XG4gIGRldGFpbD86IEZpZWxkRGVmIHwgRmllbGREZWZbXTtcbiAgdGV4dD86IEZpZWxkRGVmO1xuICBsYWJlbD86IEZpZWxkRGVmO1xufVxuXG5leHBvcnQgY29uc3QgZW5jb2RpbmcgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgeDogcG9zaXRpb25GaWVsZERlZixcbiAgICB5OiBwb3NpdGlvbkZpZWxkRGVmLFxuICAgIHJvdzogZmFjZXRGaWVsZERlZixcbiAgICBjb2x1bW46IGZhY2V0RmllbGREZWYsXG4gICAgc2l6ZTogc2l6ZUZpZWxkRGVmLFxuICAgIGNvbG9yOiBjb2xvckZpZWxkRGVmLFxuICAgIHNoYXBlOiBzaGFwZUZpZWxkRGVmLFxuICAgIHBhdGg6IG9yZGVyRmllbGREZWZzLFxuICAgIHRleHQ6IHRleHRGaWVsZERlZixcbiAgICBkZXRhaWw6IG9yZGVyRmllbGREZWZzLFxuICAgIGxhYmVsOiB0ZXh0RmllbGREZWZcbiAgfVxufTtcbiIsImltcG9ydCB7YXhpcywgQXhpc30gZnJvbSAnLi9heGlzLnNjaGVtYSc7XG5pbXBvcnQge2JpbiwgQmlufSBmcm9tICcuL2Jpbi5zY2hlbWEnO1xuaW1wb3J0IHtsZWdlbmQsIExlZ2VuZH0gZnJvbSAnLi9sZWdlbmQuc2NoZW1hJztcbmltcG9ydCB7dHlwaWNhbFNjYWxlLCBvcmRpbmFsT25seVNjYWxlLCBTY2FsZX0gZnJvbSAnLi9zY2FsZS5zY2hlbWEnO1xuaW1wb3J0IHtzb3J0LCBTb3J0fSBmcm9tICcuL3NvcnQuc2NoZW1hJztcblxuaW1wb3J0IHtBR0dSRUdBVEVfT1BTfSBmcm9tICcuLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHt0b01hcCwgZHVwbGljYXRlfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7bWVyZ2VEZWVwfSBmcm9tICcuL3NjaGVtYXV0aWwnO1xuaW1wb3J0IHtUSU1FVU5JVFN9IGZyb20gJy4uL3RpbWV1bml0JztcbmltcG9ydCB7Tk9NSU5BTCwgT1JESU5BTCwgUVVBTlRJVEFUSVZFLCBURU1QT1JBTCwgVHlwZX0gZnJvbSAnLi4vdHlwZSc7XG5cbi8qKlxuICogIEludGVyZmFjZSBmb3IgYW55IGtpbmQgb2YgRmllbGREZWY7XG4gKiAgRm9yIHNpbXBsaWNpdHksIHdlIGRvIG5vdCBkZWNsYXJlIG11bHRpcGxlIGludGVyZmFjZXMgb2YgRmllbGREZWYgbGlrZVxuICogIHdlIGRvIGZvciBKU09OIHNjaGVtYS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGaWVsZERlZiB7XG4gIGZpZWxkPzogc3RyaW5nO1xuICB0eXBlPzogVHlwZTtcbiAgdmFsdWU/OiBhbnk7XG5cbiAgLy8gZnVuY3Rpb25cbiAgdGltZVVuaXQ/OiBzdHJpbmc7XG4gIGJpbj86IGJvb2xlYW4gfCBCaW47XG5cbiAgYWdncmVnYXRlPzogc3RyaW5nO1xuICBzb3J0PzogU29ydCB8IHN0cmluZztcblxuICAvLyBvdmVycmlkZSB2ZWdhIGNvbXBvbmVudHNcbiAgYXhpcz86IEF4aXMgfCBib29sZWFuO1xuICBsZWdlbmQ/OiBMZWdlbmQgfCBib29sZWFuO1xuICBzY2FsZT86IFNjYWxlO1xuXG4gIC8vIFRPRE86IG1heWJlIGV4dGVuZCB0aGlzIGluIG90aGVyIGFwcD9cbiAgLy8gdW51c2VkIG1ldGFkYXRhIC0tIGZvciBvdGhlciBhcHBsaWNhdGlvblxuICBkaXNwbGF5TmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IGFnZ3JlZ2F0ZSA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IEFHR1JFR0FURV9PUFMsXG4gIHN1cHBvcnRlZEVudW1zOiB7XG4gICAgcXVhbnRpdGF0aXZlOiBBR0dSRUdBVEVfT1BTLFxuICAgIG9yZGluYWw6IFsnbWVkaWFuJywnbWluJywnbWF4J10sXG4gICAgbm9taW5hbDogW10sXG4gICAgdGVtcG9yYWw6IFsnbWVhbicsICdtZWRpYW4nLCAnbWluJywgJ21heCddLCAvLyBUT0RPOiByZXZpc2Ugd2hhdCBzaG91bGQgdGltZSBzdXBwb3J0XG4gICAgJyc6IFsnY291bnQnXVxuICB9LFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRSwgTk9NSU5BTCwgT1JESU5BTCwgVEVNUE9SQUwsICcnXSlcbn07XG5cbmNvbnN0IGZpZWxkRGVmID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGZpZWxkOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ251bWJlciddXG4gICAgfSxcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFtOT01JTkFMLCBPUkRJTkFMLCBRVUFOVElUQVRJVkUsIFRFTVBPUkFMXVxuICAgIH0sXG4gICAgYmluOiBiaW4sXG4gICAgdGltZVVuaXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogVElNRVVOSVRTLFxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtURU1QT1JBTF0pXG4gICAgfSxcbiAgICBhZ2dyZWdhdGU6IGFnZ3JlZ2F0ZSxcbiAgICBzb3J0OiBzb3J0XG4gIH1cbn07XG5cbmNvbnN0IGZpZWxkRGVmV2l0aFNjYWxlID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShmaWVsZERlZiksIHtcbiAgcHJvcGVydGllczoge1xuICAgIHNjYWxlOiB0eXBpY2FsU2NhbGVcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBwb3NpdGlvbkZpZWxkRGVmID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShmaWVsZERlZldpdGhTY2FsZSksIHtcbiAgcmVxdWlyZWQ6IFsnZmllbGQnLCAndHlwZSddLCAvLyBUT0RPOiByZW1vdmUgaWYgcG9zc2libGVcbiAgcHJvcGVydGllczoge1xuICAgIHNjYWxlOiB7XG4gICAgICAvLyByZXBsYWNpbmcgZGVmYXVsdCB2YWx1ZXMgZm9yIGp1c3QgdGhlc2UgdHdvIGF4ZXNcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcGFkZGluZzoge2RlZmF1bHQ6IDF9XG4gICAgICB9XG4gICAgfSxcbiAgICBheGlzOiBheGlzXG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgY29sb3JGaWVsZERlZiA9IG1lcmdlRGVlcChkdXBsaWNhdGUoZmllbGREZWZXaXRoU2NhbGUpLCB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBsZWdlbmQ6IGxlZ2VuZFxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHNpemVGaWVsZERlZiA9IGNvbG9yRmllbGREZWY7XG5cbi8vIERldGFpbCAmIFBhdGggaGF2ZSBubyBzY2FsZVxuXG5leHBvcnQgY29uc3Qgb3JkZXJGaWVsZERlZnMgPSB7XG4gIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgb25lT2Y6IFtkdXBsaWNhdGUoZmllbGREZWYpLCB7XG4gICAgdHlwZTogJ2FycmF5JyxcbiAgICBpdGVtczogZHVwbGljYXRlKGZpZWxkRGVmKVxuICB9XVxufTtcblxuLy8gVGV4dCBoYXMgZGVmYXVsdCB2YWx1ZSA9IGBBYmNgXG5cbmV4cG9ydCBjb25zdCB0ZXh0RmllbGREZWYgPSBtZXJnZURlZXAoZHVwbGljYXRlKGZpZWxkRGVmKSwge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ0FiYydcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBTaGFwZSAvIFJvdyAvIENvbHVtbiBvbmx5IHN1cHBvcnRzIG9yZGluYWwgc2NhbGUgXG5cbmNvbnN0IGZpZWxkRGVmV2l0aE9yZGluYWxTY2FsZSA9IG1lcmdlRGVlcChkdXBsaWNhdGUoZmllbGREZWYpLCB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBzY2FsZTogb3JkaW5hbE9ubHlTY2FsZVxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHNoYXBlRmllbGREZWYgPSAgbWVyZ2VEZWVwKGR1cGxpY2F0ZShmaWVsZERlZldpdGhPcmRpbmFsU2NhbGUpLCB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBsZWdlbmQ6IGxlZ2VuZFxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IGZhY2V0RmllbGREZWYgPSBtZXJnZURlZXAoZHVwbGljYXRlKGZpZWxkRGVmV2l0aE9yZGluYWxTY2FsZSksIHtcbiAgcmVxdWlyZWQ6IFsnZmllbGQnLCAndHlwZSddLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYXhpczogYXhpc1xuICB9XG59KTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgTGVnZW5kIHtcbiAgb3JpZW50Pzogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgZm9ybWF0Pzogc3RyaW5nO1xuICB2YWx1ZXM/OiBBcnJheTxhbnk+O1xuICBwcm9wZXJ0aWVzPzogYW55OyAvLyBUT0RPIGRlY2xhcmUgVmdMZWdlbmRQcm9wZXJ0aWVzXG5cbiAgLy8gVmVnYS1MaXRlIG9ubHlcbiAgc2hvcnRUaW1lTGFiZWxzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IHZhciBsZWdlbmQgPSB7XG4gIGRlZmF1bHQ6IHRydWUsXG4gIGRlc2NyaXB0aW9uOiAnUHJvcGVydGllcyBvZiBhIGxlZ2VuZCBvciBib29sZWFuIGZsYWcgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgdG8gc2hvdyBpdC4nLFxuICBvbmVPZjogW3tcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBvcmllbnQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgb3JpZW50YXRpb24gb2YgdGhlIGxlZ2VuZC4gT25lIG9mIFwibGVmdFwiIG9yIFwicmlnaHRcIi4gVGhpcyBkZXRlcm1pbmVzIGhvdyB0aGUgbGVnZW5kIGlzIHBvc2l0aW9uZWQgd2l0aGluIHRoZSBzY2VuZS4gVGhlIGRlZmF1bHQgaXMgXCJyaWdodFwiLidcbiAgICAgIH0sXG4gICAgICB0aXRsZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgZm9yIHRoZSBsZWdlbmQuIChTaG93cyBmaWVsZCBuYW1lIGFuZCBpdHMgZnVuY3Rpb24gYnkgZGVmYXVsdC4pJ1xuICAgICAgfSxcbiAgICAgIGZvcm1hdDoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0FuIG9wdGlvbmFsIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgbGVnZW5kIGxhYmVscy4gVmVnYSB1c2VzIEQzXFwncyBmb3JtYXQgcGF0dGVybi4nXG4gICAgICB9LFxuICAgICAgdmFsdWVzOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFeHBsaWNpdGx5IHNldCB0aGUgdmlzaWJsZSBsZWdlbmQgdmFsdWVzLidcbiAgICAgIH0sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnT3B0aW9uYWwgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9ucyBmb3IgY3VzdG9tIGxlZ2VuZCBzdHlsaW5nLiAnXG4gICAgICB9LFxuXG4gICAgICAvKiBWZWdhLWxpdGUgb25seSAqL1xuICAgICAgc2hvcnRUaW1lTGFiZWxzOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciBtb250aCBuYW1lcyBhbmQgd2Vla2RheSBuYW1lcyBzaG91bGQgYmUgYWJicmV2aWF0ZWQuJ1xuICAgICAgfVxuICAgIH0sXG4gIH0sIHtcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgfV1cbn07XG4iLCJleHBvcnQgdmFyIG1hcmsgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBbJ3BvaW50JywgJ3RpY2snLCAnYmFyJywgJ2xpbmUnLCAnYXJlYScsICdjaXJjbGUnLCAnc3F1YXJlJywgJ3RleHQnXVxufTtcbiIsImltcG9ydCB7dG9NYXAsIGR1cGxpY2F0ZSBhcyBjbG9uZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge21lcmdlRGVlcH0gZnJvbSAnLi9zY2hlbWF1dGlsJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NhbGUge1xuICB0eXBlPzogc3RyaW5nO1xuICBkb21haW4/OiBhbnk7IC8vIFRPRE86IGRlY2xhcmUgdmdEYXRhRG9tYWluXG4gIHJhbmdlPzogYW55OyAvLyBUT0RPOiBkZWNsYXJlIHZnUmFuZ2VEb21haW5cbiAgcm91bmQ/OiBib29sZWFuO1xuXG4gIC8vIG9yZGluYWxcbiAgYmFuZFdpZHRoPzogbnVtYmVyO1xuICBvdXRlclBhZGRpbmc/OiBudW1iZXI7XG4gIHBhZGRpbmc/OiBudW1iZXI7XG5cbiAgLy8gdHlwaWNhbFxuICBjbGFtcD86IGJvb2xlYW47XG4gIG5pY2U/OiBib29sZWFufHN0cmluZztcbiAgZXhwb25lbnQ/OiBudW1iZXI7XG4gIHplcm8/OiBib29sZWFuO1xuXG4gIC8vIFZlZ2EtTGl0ZSBvbmx5XG4gIHVzZVJhd0RvbWFpbj86IGJvb2xlYW47XG59XG5cbnZhciBzY2FsZSA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIC8vIFRPRE86IHJlZmVyIHRvIFZlZ2EncyBzY2FsZSBzY2hlbWFcbiAgcHJvcGVydGllczoge1xuICAgIC8qIENvbW1vbiBTY2FsZSBQcm9wZXJ0aWVzICovXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2xpbmVhcicsICdsb2cnLCAncG93JywgJ3NxcnQnLCAncXVhbnRpbGUnLCAnb3JkaW5hbCddLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRVUFOVElUQVRJVkVdKVxuICAgIH0sXG4gICAgZG9tYWluOiB7XG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICB0eXBlOiBbJ2FycmF5JywgJ29iamVjdCddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZG9tYWluIG9mIHRoZSBzY2FsZSwgcmVwcmVzZW50aW5nIHRoZSBzZXQgb2YgZGF0YSB2YWx1ZXMuIEZvciBxdWFudGl0YXRpdmUgZGF0YSwgdGhpcyBjYW4gdGFrZSB0aGUgZm9ybSBvZiBhIHR3by1lbGVtZW50IGFycmF5IHdpdGggbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMuIEZvciBvcmRpbmFsL2NhdGVnb3JpY2FsIGRhdGEsIHRoaXMgbWF5IGJlIGFuIGFycmF5IG9mIHZhbGlkIGlucHV0IHZhbHVlcy4gVGhlIGRvbWFpbiBtYXkgYWxzbyBiZSBzcGVjaWZpZWQgYnkgYSByZWZlcmVuY2UgdG8gYSBkYXRhIHNvdXJjZS4nXG4gICAgfSxcbiAgICByYW5nZToge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgdHlwZTogWydhcnJheScsICdvYmplY3QnLCAnc3RyaW5nJ10sXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSByYW5nZSBvZiB0aGUgc2NhbGUsIHJlcHJlc2VudGluZyB0aGUgc2V0IG9mIHZpc3VhbCB2YWx1ZXMuIEZvciBudW1lcmljIHZhbHVlcywgdGhlIHJhbmdlIGNhbiB0YWtlIHRoZSBmb3JtIG9mIGEgdHdvLWVsZW1lbnQgYXJyYXkgd2l0aCBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlcy4gRm9yIG9yZGluYWwgb3IgcXVhbnRpemVkIGRhdGEsIHRoZSByYW5nZSBtYXkgYnkgYW4gYXJyYXkgb2YgZGVzaXJlZCBvdXRwdXQgdmFsdWVzLCB3aGljaCBhcmUgbWFwcGVkIHRvIGVsZW1lbnRzIGluIHRoZSBzcGVjaWZpZWQgZG9tYWluLiBGb3Igb3JkaW5hbCBzY2FsZXMgb25seSwgdGhlIHJhbmdlIGNhbiBiZSBkZWZpbmVkIHVzaW5nIGEgRGF0YVJlZjogdGhlIHJhbmdlIHZhbHVlcyBhcmUgdGhlbiBkcmF3biBkeW5hbWljYWxseSBmcm9tIGEgYmFja2luZyBkYXRhIHNldC4nXG4gICAgfSxcbiAgICByb3VuZDoge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAvLyBUT0RPOiByZXZpc2UgZGVmYXVsdFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdJZiB0cnVlLCByb3VuZHMgbnVtZXJpYyBvdXRwdXQgdmFsdWVzIHRvIGludGVnZXJzLiBUaGlzIGNhbiBiZSBoZWxwZnVsIGZvciBzbmFwcGluZyB0byB0aGUgcGl4ZWwgZ3JpZC4nXG4gICAgfVxuICB9XG59O1xuXG5cbnZhciBvcmRpbmFsU2NhbGVNaXhpbiA9IHtcbiAgcHJvcGVydGllczoge1xuICAgIGJhbmRXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgLyogT3JkaW5hbCBTY2FsZSBQcm9wZXJ0aWVzICovXG4gICAgb3V0ZXJQYWRkaW5nOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgICAgLy8gVE9ETzogYWRkIGRlc2NyaXB0aW9uIG9uY2UgaXQgaXMgZG9jdW1lbnRlZCBpbiBWZWdhXG4gICAgfSxcbiAgICBwYWRkaW5nOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXBwbGllcyBzcGFjaW5nIGFtb25nIG9yZGluYWwgZWxlbWVudHMgaW4gdGhlIHNjYWxlIHJhbmdlLiBUaGUgYWN0dWFsIGVmZmVjdCBkZXBlbmRzIG9uIGhvdyB0aGUgc2NhbGUgaXMgY29uZmlndXJlZC4gSWYgdGhlIF9fcG9pbnRzX18gcGFyYW1ldGVyIGlzIGB0cnVlYCwgdGhlIHBhZGRpbmcgdmFsdWUgaXMgaW50ZXJwcmV0ZWQgYXMgYSBtdWx0aXBsZSBvZiB0aGUgc3BhY2luZyBiZXR3ZWVuIHBvaW50cy4gQSByZWFzb25hYmxlIHZhbHVlIGlzIDEuMCwgc3VjaCB0aGF0IHRoZSBmaXJzdCBhbmQgbGFzdCBwb2ludCB3aWxsIGJlIG9mZnNldCBmcm9tIHRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlIGJ5IGhhbGYgdGhlIGRpc3RhbmNlIGJldHdlZW4gcG9pbnRzLiBPdGhlcndpc2UsIHBhZGRpbmcgaXMgdHlwaWNhbGx5IGluIHRoZSByYW5nZSBbMCwgMV0gYW5kIGNvcnJlc3BvbmRzIHRvIHRoZSBmcmFjdGlvbiBvZiBzcGFjZSBpbiB0aGUgcmFuZ2UgaW50ZXJ2YWwgdG8gYWxsb2NhdGUgdG8gcGFkZGluZy4gQSB2YWx1ZSBvZiAwLjUgbWVhbnMgdGhhdCB0aGUgcmFuZ2UgYmFuZCB3aWR0aCB3aWxsIGJlIGVxdWFsIHRvIHRoZSBwYWRkaW5nIHdpZHRoLiBGb3IgbW9yZSwgc2VlIHRoZSBbRDMgb3JkaW5hbCBzY2FsZSBkb2N1bWVudGF0aW9uXShodHRwczovL2dpdGh1Yi5jb20vbWJvc3RvY2svZDMvd2lraS9PcmRpbmFsLVNjYWxlcykuJ1xuICAgIH1cbiAgfVxufTtcblxudmFyIHR5cGljYWxTY2FsZU1peGluID0ge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgLyogUXVhbnRpdGF0aXZlIGFuZCB0ZW1wb3JhbCBTY2FsZSBQcm9wZXJ0aWVzICovXG4gICAgY2xhbXA6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHRydWUsIHZhbHVlcyB0aGF0IGV4Y2VlZCB0aGUgZGF0YSBkb21haW4gYXJlIGNsYW1wZWQgdG8gZWl0aGVyIHRoZSBtaW5pbXVtIG9yIG1heGltdW0gcmFuZ2UgdmFsdWUnXG4gICAgfSxcbiAgICBuaWNlOiB7XG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBvbmVPZjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgdHJ1ZSwgbW9kaWZpZXMgdGhlIHNjYWxlIGRvbWFpbiB0byB1c2UgYSBtb3JlIGh1bWFuLWZyaWVuZGx5IG51bWJlciByYW5nZSAoZS5nLiwgNyBpbnN0ZWFkIG9mIDYuOTYpLidcbiAgICAgICAgfSx7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydzZWNvbmQnLCAnbWludXRlJywgJ2hvdXInLCAnZGF5JywgJ3dlZWsnLCAnbW9udGgnLCAneWVhciddLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgc3BlY2lmaWVkLCBtb2RpZmllcyB0aGUgc2NhbGUgZG9tYWluIHRvIHVzZSBhIG1vcmUgaHVtYW4tZnJpZW5kbHkgdmFsdWUgcmFuZ2UuIEZvciB0aW1lIGFuZCB1dGMgc2NhbGUgdHlwZXMgb25seSwgdGhlIG5pY2UgdmFsdWUgc2hvdWxkIGJlIGEgc3RyaW5nIGluZGljYXRpbmcgdGhlIGRlc2lyZWQgdGltZSBpbnRlcnZhbDsgbGVnYWwgdmFsdWVzIGFyZSBcInNlY29uZFwiLCBcIm1pbnV0ZVwiLCBcImhvdXJcIiwgXCJkYXlcIiwgXCJ3ZWVrXCIsIFwibW9udGhcIiwgb3IgXCJ5ZWFyXCIuJ1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgLy8gRklYTUUgdGhpcyBwYXJ0IG1pZ2h0IGJyZWFrIHBvbGVzdGFyXG4gICAgICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRSwgVEVNUE9SQUxdKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnJ1xuICAgIH0sXG5cbiAgICAvKiBRdWFudGl0YXRpdmUgU2NhbGUgUHJvcGVydGllcyAqL1xuICAgIGV4cG9uZW50OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2V0cyB0aGUgZXhwb25lbnQgb2YgdGhlIHNjYWxlIHRyYW5zZm9ybWF0aW9uLiBGb3IgcG93IHNjYWxlIHR5cGVzIG9ubHksIG90aGVyd2lzZSBpZ25vcmVkLidcbiAgICB9LFxuICAgIHplcm86IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgdHJ1ZSwgZW5zdXJlcyB0aGF0IGEgemVybyBiYXNlbGluZSB2YWx1ZSBpcyBpbmNsdWRlZCBpbiB0aGUgc2NhbGUgZG9tYWluLiBUaGlzIG9wdGlvbiBpcyBpZ25vcmVkIGZvciBub24tcXVhbnRpdGF0aXZlIHNjYWxlcy4nLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRVUFOVElUQVRJVkUsIFRFTVBPUkFMXSlcbiAgICB9LFxuXG4gICAgLyogVmVnYS1saXRlIG9ubHkgUHJvcGVydGllcyAqL1xuICAgIHVzZVJhd0RvbWFpbjoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VzZXMgdGhlIHNvdXJjZSBkYXRhIHJhbmdlIGFzIHNjYWxlIGRvbWFpbiBpbnN0ZWFkIG9mICcgK1xuICAgICAgICAgICAgICAgICAgICdhZ2dyZWdhdGVkIGRhdGEgZm9yIGFnZ3JlZ2F0ZSBheGlzLiAnICtcbiAgICAgICAgICAgICAgICAgICAnVGhpcyBvcHRpb24gZG9lcyBub3Qgd29yayB3aXRoIHN1bSBvciBjb3VudCBhZ2dyZWdhdGUnICtcbiAgICAgICAgICAgICAgICAgICAnYXMgdGhleSBtaWdodCBoYXZlIGEgc3Vic3RhbnRpYWxseSBsYXJnZXIgc2NhbGUgcmFuZ2UuJ1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHZhciBvcmRpbmFsT25seVNjYWxlID0gbWVyZ2VEZWVwKGNsb25lKHNjYWxlKSwgb3JkaW5hbFNjYWxlTWl4aW4pO1xuZXhwb3J0IHZhciB0eXBpY2FsU2NhbGUgPSBtZXJnZURlZXAoY2xvbmUoc2NhbGUpLCBvcmRpbmFsU2NhbGVNaXhpbiwgdHlwaWNhbFNjYWxlTWl4aW4pO1xuIiwiLy8gUGFja2FnZSBvZiBkZWZpbmluZyBWZWdhLWxpdGUgU3BlY2lmaWNhdGlvbidzIGpzb24gc2NoZW1hXG5cbmltcG9ydCAqIGFzIHNjaGVtYVV0aWwgZnJvbSAnLi9zY2hlbWF1dGlsJztcbmltcG9ydCB7bWFya30gZnJvbSAnLi9tYXJrLnNjaGVtYSc7XG5pbXBvcnQge2NvbmZpZywgQ29uZmlnfSBmcm9tICcuL2NvbmZpZy5zY2hlbWEnO1xuaW1wb3J0IHtkYXRhLCBEYXRhfSBmcm9tICcuL2RhdGEuc2NoZW1hJztcbmltcG9ydCB7ZW5jb2RpbmcsIEVuY29kaW5nfSBmcm9tICcuL2VuY29kaW5nLnNjaGVtYSc7XG5pbXBvcnQge01hcmt9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHt0cmFuc2Zvcm0sIFRyYW5zZm9ybX0gZnJvbSAnLi90cmFuc2Zvcm0uc2NoZW1hJztcblxuZXhwb3J0IGludGVyZmFjZSBTcGVjIHtcbiAgbmFtZT86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIGRhdGE/OiBEYXRhO1xuICB0cmFuc2Zvcm0/OiBUcmFuc2Zvcm07XG4gIG1hcms/OiBNYXJrO1xuICBlbmNvZGluZz86IEVuY29kaW5nO1xuICBjb25maWc/OiBDb25maWc7XG59XG5cbi8vIFRPRE8gcmVtb3ZlIHRoaXNcbmV4cG9ydCB7YWdncmVnYXRlfSBmcm9tICcuL2ZpZWxkZGVmLnNjaGVtYSc7XG5cbmV4cG9ydCB2YXIgdXRpbCA9IHNjaGVtYVV0aWw7XG5cbi8qKiBAdHlwZSBPYmplY3QgU2NoZW1hIG9mIGEgdmVnYS1saXRlIHNwZWNpZmljYXRpb24gKi9cbmV4cG9ydCB2YXIgc2NoZW1hID0ge1xuICAkc2NoZW1hOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgZGVzY3JpcHRpb246ICdTY2hlbWEgZm9yIFZlZ2EtTGl0ZSBzcGVjaWZpY2F0aW9uJyxcbiAgdHlwZTogJ29iamVjdCcsXG4gIHJlcXVpcmVkOiBbJ21hcmsnLCAnZW5jb2RpbmcnXSxcbiAgcHJvcGVydGllczoge1xuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVzY3JpcHRpb246ICdBIG5hbWUgZm9yIHRoZSBzcGVjaWZpY2F0aW9uLiBUaGUgbmFtZSBpcyB1c2VkIHRvIGFubm90YXRlIG1hcmtzLCBzY2FsZSBuYW1lcywgYW5kIG1vcmUuJ1xuICAgIH0sXG4gICAgZGVzY3JpcHRpb246IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgfSxcbiAgICBkYXRhOiBkYXRhLFxuICAgIHRyYW5zZm9ybTogdHJhbnNmb3JtLFxuICAgIG1hcms6IG1hcmssXG4gICAgZW5jb2Rpbmc6IGVuY29kaW5nLFxuICAgIGNvbmZpZzogY29uZmlnXG4gIH1cbn07XG5cbi8qKiBJbnN0YW50aWF0ZSBhIHZlcmJvc2Ugdmwgc3BlYyBmcm9tIHRoZSBzY2hlbWEgKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnN0YW50aWF0ZSgpIHtcbiAgcmV0dXJuIHNjaGVtYVV0aWwuaW5zdGFudGlhdGUoc2NoZW1hKTtcbn07XG4iLCJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKGluc3RhbmNlLCBzY2hlbWEpIHtcbiAgcmV0dXJuIG1lcmdlRGVlcChpbnN0YW50aWF0ZShzY2hlbWEpLCBpbnN0YW5jZSk7XG59O1xuXG4vLyBpbnN0YW50aWF0ZSBhIHNjaGVtYVxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbnRpYXRlKHNjaGVtYSkge1xuICB2YXIgdmFsO1xuICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKCdkZWZhdWx0JyBpbiBzY2hlbWEpIHtcbiAgICB2YWwgPSBzY2hlbWEuZGVmYXVsdDtcbiAgICByZXR1cm4gdXRpbC5pc09iamVjdCh2YWwpID8gdXRpbC5kdXBsaWNhdGUodmFsKSA6IHZhbDtcbiAgfSBlbHNlIGlmIChzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB7fTtcbiAgICBmb3IgKHZhciBuYW1lIGluIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAoc2NoZW1hLnByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgdmFsID0gaW5zdGFudGlhdGUoc2NoZW1hLnByb3BlcnRpZXNbbmFtZV0pO1xuICAgICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpbnN0YW5jZVtuYW1lXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSBpZiAoc2NoZW1hLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG4vLyByZW1vdmUgYWxsIGRlZmF1bHRzIGZyb20gYW4gaW5zdGFuY2VcbmV4cG9ydCBmdW5jdGlvbiBzdWJ0cmFjdChpbnN0YW5jZSwgZGVmYXVsdHMpIHtcbiAgdmFyIGNoYW5nZXM6IGFueSA9IHt9O1xuICBmb3IgKHZhciBwcm9wIGluIGluc3RhbmNlKSB7XG4gICAgaWYgKGluc3RhbmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICB2YXIgZGVmID0gZGVmYXVsdHNbcHJvcF07XG4gICAgICB2YXIgaW5zID0gaW5zdGFuY2VbcHJvcF07XG4gICAgICAvLyBOb3RlOiBkb2VzIG5vdCBwcm9wZXJseSBzdWJ0cmFjdCBhcnJheXNcbiAgICAgIGlmICghZGVmYXVsdHMgfHwgZGVmICE9PSBpbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnMgPT09ICdvYmplY3QnICYmICF1dGlsLmlzQXJyYXkoaW5zKSAmJiBkZWYpIHtcbiAgICAgICAgICB2YXIgYyA9IHN1YnRyYWN0KGlucywgZGVmKTtcbiAgICAgICAgICBpZiAoIWlzRW1wdHkoYykpIHtcbiAgICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBjO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh1dGlsLmlzQXJyYXkoaW5zKSkge1xuICAgICAgICAgIGlmICh1dGlsLmlzQXJyYXkoZGVmKSkge1xuICAgICAgICAgICAgLy8gY2hlY2sgZWFjaCBpdGVtIGluIHRoZSBhcnJheVxuICAgICAgICAgICAgaWYgKGlucy5sZW5ndGggPT09IGRlZi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdmFyIGVxdWFsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5zW2ldICE9PSBkZWZbaV0pIHtcbiAgICAgICAgICAgICAgICAgIGVxdWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGVxdWFsKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7IC8vIGNvbnRpbnVlIHdpdGggbmV4dCBwcm9wZXJ0eVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBpbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hhbmdlc1twcm9wXSA9IGlucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY2hhbmdlcztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlZXAoZGVzdCwgLi4uc3JjOiBhbnlbXSkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNyYy5sZW5ndGg7IGkrKykge1xuICAgIGRlc3QgPSBkZWVwTWVyZ2VfKGRlc3QsIHNyY1tpXSk7XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59O1xuXG4vLyByZWN1cnNpdmVseSBtZXJnZXMgc3JjIGludG8gZGVzdFxuZnVuY3Rpb24gZGVlcE1lcmdlXyhkZXN0LCBzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgZm9yICh2YXIgcCBpbiBzcmMpIHtcbiAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzcmNbcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc3JjW3BdICE9PSAnb2JqZWN0JyB8fCBzcmNbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBzcmNbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdFtwXSAhPT0gJ29iamVjdCcgfHwgZGVzdFtwXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IG1lcmdlRGVlcChzcmNbcF0uY29uc3RydWN0b3IgPT09IEFycmF5ID8gW10gOiB7fSwgc3JjW3BdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2VEZWVwKGRlc3RbcF0sIHNyY1twXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXN0O1xufVxuIiwiaW1wb3J0IHtBR0dSRUdBVEVfT1BTfSBmcm9tICcuLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtPUkRJTkFMLCBRVUFOVElUQVRJVkV9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHt0b01hcH0gZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ydCB7XG4gIGZpZWxkOiBzdHJpbmc7XG4gIG9wOiBzdHJpbmc7XG4gIG9yZGVyPzogc3RyaW5nO1xufVxuXG5leHBvcnQgdmFyIHNvcnQgPSB7XG4gIGRlZmF1bHQ6ICdhc2NlbmRpbmcnLFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRSwgT1JESU5BTF0pLFxuICBvbmVPZjogW1xuICAgIHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydhc2NlbmRpbmcnLCAnZGVzY2VuZGluZycsICd1bnNvcnRlZCddXG4gICAgfSxcbiAgICB7IC8vIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYW5vdGhlciBmaWVsZFxuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICByZXF1aXJlZDogWydmaWVsZCcsICdvcCddLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBmaWVsZDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZpZWxkIG5hbWUgdG8gYWdncmVnYXRlIG92ZXIuJ1xuICAgICAgICB9LFxuICAgICAgICBvcDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IEFHR1JFR0FURV9PUFMsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgZmllbGQgbmFtZSB0byBhZ2dyZWdhdGUgb3Zlci4nXG4gICAgICAgIH0sXG4gICAgICAgIG9yZGVyOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydhc2NlbmRpbmcnLCAnZGVzY2VuZGluZyddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIF1cbn07XG4iLCJleHBvcnQgaW50ZXJmYWNlIFRyYW5zZm9ybSB7XG4gIGZpbHRlcj86IHN0cmluZztcbiAgZmlsdGVyTnVsbD86IGJvb2xlYW47XG4gIGNhbGN1bGF0ZT86IFZnRm9ybXVsYVtdO1xufVxuXG4vLyBUT0RPIG1vdmUgYWxsIFZlZ2EgaW50ZXJmYWNlcyB0byBvbmUgY2VudHJhbCBwb3NpdGlvblxuZXhwb3J0IGludGVyZmFjZSBWZ0Zvcm11bGEge1xuICBmaWVsZDogc3RyaW5nO1xuICBleHByOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm0gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZmlsdGVyTnVsbDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdGaWx0ZXIgbnVsbCB2YWx1ZXMgZnJvbSB0aGUgZGF0YS4gSWYgc2V0IHRvIHRydWUsIGFsbCByb3dzIHdpdGggbnVsbCB2YWx1ZXMgYXJlIGZpbHRlcmVkLiBJZiBmYWxzZSwgbm8gcm93cyBhcmUgZmlsdGVyZWQuIFNldCB0aGUgcHJvcGVydHkgdG8gdW5kZWZpbmVkIHRvIGZpbHRlciBvbmx5IHF1YW50aXRhdGl2ZSBhbmQgdGVtcG9yYWwgZmllbGRzLidcbiAgICB9LFxuICAgIGZpbHRlcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Egc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGZpbHRlciBWZWdhIGV4cHJlc3Npb24uIFVzZSBgZGF0dW1gIHRvIHJlZmVyIHRvIHRoZSBjdXJyZW50IGRhdGEgb2JqZWN0LidcbiAgICB9LFxuICAgIGNhbGN1bGF0ZToge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2FsY3VsYXRlIG5ldyBmaWVsZChzKSB1c2luZyB0aGUgcHJvdmlkZWQgZXhwcmVzc3Npb24ocykuIENhbGN1bGF0aW9uIGFyZSBhcHBsaWVkIGJlZm9yZSBmaWx0ZXIuJyxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZmllbGQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgZmllbGQgaW4gd2hpY2ggdG8gc3RvcmUgdGhlIGNvbXB1dGVkIGZvcm11bGEgdmFsdWUuJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhwcjoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Egc3RyaW5nIGNvbnRhaW5pbmcgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIGZvcm11bGEuIFVzZSB0aGUgdmFyaWFibGUgYGRhdHVtYCB0byB0byByZWZlciB0byB0aGUgY3VycmVudCBkYXRhIG9iamVjdC4nXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiLyoqIG1vZHVsZSBmb3Igc2hvcnRoYW5kICovXG5cbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4vc2NoZW1hL2VuY29kaW5nLnNjaGVtYSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtTcGVjfSBmcm9tICcuL3NjaGVtYS9zY2hlbWEnO1xuXG5pbXBvcnQge0FHR1JFR0FURV9PUFN9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7VElNRVVOSVRTfSBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCB7U0hPUlRfVFlQRSwgVFlQRV9GUk9NX1NIT1JUX1RZUEV9IGZyb20gJy4vdHlwZSc7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4vZW5jb2RpbmcnO1xuaW1wb3J0IHtNYXJrfSBmcm9tICcuL21hcmsnO1xuXG5leHBvcnQgY29uc3QgREVMSU0gPSAnfCc7XG5leHBvcnQgY29uc3QgQVNTSUdOID0gJz0nO1xuZXhwb3J0IGNvbnN0IFRZUEUgPSAnLCc7XG5leHBvcnQgY29uc3QgRlVOQyA9ICdfJztcblxuXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRlbihzcGVjOiBTcGVjKTogc3RyaW5nIHtcbiAgcmV0dXJuICdtYXJrJyArIEFTU0lHTiArIHNwZWMubWFyayArXG4gICAgREVMSU0gKyBzaG9ydGVuRW5jb2Rpbmcoc3BlYy5lbmNvZGluZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShzaG9ydGhhbmQ6IHN0cmluZywgZGF0YT8sIGNvbmZpZz8pIHtcbiAgbGV0IHNwbGl0ID0gc2hvcnRoYW5kLnNwbGl0KERFTElNKSxcbiAgICBtYXJrID0gc3BsaXQuc2hpZnQoKS5zcGxpdChBU1NJR04pWzFdLnRyaW0oKSxcbiAgICBlbmNvZGluZyA9IHBhcnNlRW5jb2Rpbmcoc3BsaXQuam9pbihERUxJTSkpO1xuXG4gIGxldCBzcGVjOlNwZWMgPSB7XG4gICAgbWFyazogTWFya1ttYXJrXSxcbiAgICBlbmNvZGluZzogZW5jb2RpbmdcbiAgfTtcblxuICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3BlYy5kYXRhID0gZGF0YTtcbiAgfVxuICBpZiAoY29uZmlnICE9PSB1bmRlZmluZWQpIHtcbiAgICBzcGVjLmNvbmZpZyA9IGNvbmZpZztcbiAgfVxuICByZXR1cm4gc3BlYztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3J0ZW5FbmNvZGluZyhlbmNvZGluZzogRW5jb2RpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmxFbmNvZGluZy5tYXAoZW5jb2RpbmcsIGZ1bmN0aW9uKGZpZWxkRGVmLCBjaGFubmVsKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwgKyBBU1NJR04gKyBzaG9ydGVuRmllbGREZWYoZmllbGREZWYpO1xuICB9KS5qb2luKERFTElNKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRW5jb2RpbmcoZW5jb2RpbmdTaG9ydGhhbmQ6IHN0cmluZyk6IEVuY29kaW5nIHtcbiAgcmV0dXJuIGVuY29kaW5nU2hvcnRoYW5kLnNwbGl0KERFTElNKS5yZWR1Y2UoZnVuY3Rpb24obSwgZSkge1xuICAgIHZhciBzcGxpdCA9IGUuc3BsaXQoQVNTSUdOKSxcbiAgICAgICAgZW5jdHlwZSA9IHNwbGl0WzBdLnRyaW0oKSxcbiAgICAgICAgZmllbGREZWZTaG9ydGhhbmQgPSBzcGxpdFsxXTtcblxuICAgIG1bZW5jdHlwZV0gPSBwYXJzZUZpZWxkRGVmKGZpZWxkRGVmU2hvcnRoYW5kKTtcbiAgICByZXR1cm4gbTtcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRlbkZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZik6IHN0cmluZyB7XG4gIHJldHVybiAoZmllbGREZWYuYWdncmVnYXRlID8gZmllbGREZWYuYWdncmVnYXRlICsgRlVOQyA6ICcnKSArXG4gICAgKGZpZWxkRGVmLnRpbWVVbml0ID8gZmllbGREZWYudGltZVVuaXQgKyBGVU5DIDogJycpICtcbiAgICAoZmllbGREZWYuYmluID8gJ2JpbicgKyBGVU5DIDogJycpICtcbiAgICAoZmllbGREZWYuZmllbGQgfHwgJycpICsgVFlQRSArIFNIT1JUX1RZUEVbZmllbGREZWYudHlwZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG9ydGVuRmllbGREZWZzKGZpZWxkRGVmczogRmllbGREZWZbXSwgZGVsaW0gPSBERUxJTSk6IHN0cmluZyB7XG4gIHJldHVybiBmaWVsZERlZnMubWFwKHNob3J0ZW5GaWVsZERlZikuam9pbihkZWxpbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpZWxkRGVmKGZpZWxkRGVmU2hvcnRoYW5kOiBzdHJpbmcpOiBGaWVsZERlZiB7XG4gIHZhciBzcGxpdCA9IGZpZWxkRGVmU2hvcnRoYW5kLnNwbGl0KFRZUEUpO1xuXG4gIHZhciBmaWVsZERlZjogRmllbGREZWYgPSB7XG4gICAgZmllbGQ6IHNwbGl0WzBdLnRyaW0oKSxcbiAgICB0eXBlOiBUWVBFX0ZST01fU0hPUlRfVFlQRVtzcGxpdFsxXS50cmltKCldXG4gIH07XG5cbiAgLy8gY2hlY2sgYWdncmVnYXRlIHR5cGVcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBBR0dSRUdBVEVfT1BTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGEgPSBBR0dSRUdBVEVfT1BTW2ldO1xuICAgIGlmIChmaWVsZERlZi5maWVsZC5pbmRleE9mKGEgKyAnXycpID09PSAwKSB7XG4gICAgICBmaWVsZERlZi5maWVsZCA9IGZpZWxkRGVmLmZpZWxkLnN1YnN0cihhLmxlbmd0aCArIDEpO1xuICAgICAgaWYgKGEgPT09ICdjb3VudCcgJiYgZmllbGREZWYuZmllbGQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZpZWxkRGVmLmZpZWxkID0gJyonO1xuICAgICAgfVxuICAgICAgZmllbGREZWYuYWdncmVnYXRlID0gYTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgVElNRVVOSVRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHR1ID0gVElNRVVOSVRTW2ldO1xuICAgIGlmIChmaWVsZERlZi5maWVsZCAmJiBmaWVsZERlZi5maWVsZC5pbmRleE9mKHR1ICsgJ18nKSA9PT0gMCkge1xuICAgICAgZmllbGREZWYuZmllbGQgPSBmaWVsZERlZi5maWVsZC5zdWJzdHIoZmllbGREZWYuZmllbGQubGVuZ3RoICsgMSk7XG4gICAgICBmaWVsZERlZi50aW1lVW5pdCA9IHR1O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gY2hlY2sgYmluXG4gIGlmIChmaWVsZERlZi5maWVsZCAmJiBmaWVsZERlZi5maWVsZC5pbmRleE9mKCdiaW5fJykgPT09IDApIHtcbiAgICBmaWVsZERlZi5maWVsZCA9IGZpZWxkRGVmLmZpZWxkLnN1YnN0cig0KTtcbiAgICBmaWVsZERlZi5iaW4gPSB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkRGVmO1xufVxuIiwiLyogVXRpbGl0aWVzIGZvciBhIFZlZ2EtTGl0ZSBzcGVjaWZpY2lhdGlvbiAqL1xuXG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtTcGVjfSBmcm9tICcuL3NjaGVtYS9zY2hlbWEnO1xuXG5pbXBvcnQge01vZGVsfSBmcm9tICcuL2NvbXBpbGUvTW9kZWwnO1xuaW1wb3J0IHtDT0xPUiwgU0hBUEV9IGZyb20gJy4vY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4vZW5jb2RpbmcnO1xuaW1wb3J0IHtCQVIsIEFSRUF9IGZyb20gJy4vbWFyayc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi91dGlsJztcblxuLy8gVE9ETzogYWRkIHZsLnNwZWMudmFsaWRhdGUgJiBtb3ZlIHN0dWZmIGZyb20gdmwudmFsaWRhdGUgdG8gaGVyZVxuXG5leHBvcnQgZnVuY3Rpb24gYWx3YXlzTm9PY2NsdXNpb24oc3BlYzogU3BlYyk6IGJvb2xlYW4ge1xuICAvLyBGSVhNRSByYXcgT3hRIHdpdGggIyBvZiByb3dzID0gIyBvZiBPXG4gIHJldHVybiB2bEVuY29kaW5nLmlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmllbGREZWZzKHNwZWM6IFNwZWMpOiBGaWVsZERlZltdIHtcbiAgLy8gVE9ETzogcmVmYWN0b3IgdGhpcyBvbmNlIHdlIGhhdmUgY29tcG9zaXRpb25cbiAgcmV0dXJuIHZsRW5jb2RpbmcuZmllbGREZWZzKHNwZWMuZW5jb2RpbmcpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsZWFuU3BlYyhzcGVjOiBTcGVjKTogU3BlYyB7XG4gIC8vIFRPRE86IG1vdmUgdG9TcGVjIHRvIGhlcmUhXG4gIHJldHVybiBuZXcgTW9kZWwoc3BlYykudG9TcGVjKHRydWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdGFjayhzcGVjOiBTcGVjKTogYm9vbGVhbiB7XG4gIHJldHVybiAodmxFbmNvZGluZy5oYXMoc3BlYy5lbmNvZGluZywgQ09MT1IpIHx8IHZsRW5jb2RpbmcuaGFzKHNwZWMuZW5jb2RpbmcsIFNIQVBFKSkgJiZcbiAgICAoc3BlYy5tYXJrID09PSBCQVIgfHwgc3BlYy5tYXJrID09PSBBUkVBKSAmJlxuICAgICghc3BlYy5jb25maWcgfHwgIXNwZWMuY29uZmlnLnN0YWNrICE9PSBmYWxzZSkgJiZcbiAgICB2bEVuY29kaW5nLmlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpO1xufVxuXG4vLyBUT0RPIHJldmlzZVxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zcG9zZShzcGVjOiBTcGVjKTogU3BlYyB7XG4gIHZhciBvbGRlbmMgPSBzcGVjLmVuY29kaW5nLFxuICAgIGVuY29kaW5nID0gZHVwbGljYXRlKHNwZWMuZW5jb2RpbmcpO1xuICBlbmNvZGluZy54ID0gb2xkZW5jLnk7XG4gIGVuY29kaW5nLnkgPSBvbGRlbmMueDtcbiAgZW5jb2Rpbmcucm93ID0gb2xkZW5jLmNvbHVtbjtcbiAgZW5jb2RpbmcuY29sdW1uID0gb2xkZW5jLnJvdztcbiAgc3BlYy5lbmNvZGluZyA9IGVuY29kaW5nO1xuICByZXR1cm4gc3BlYztcbn1cbiIsImV4cG9ydCBjb25zdCBUSU1FVU5JVFMgPSBbXG4gICd5ZWFyJywgJ21vbnRoJywgJ2RheScsICdkYXRlJywgJ2hvdXJzJywgJ21pbnV0ZXMnLCAnc2Vjb25kcycsICdtaWxsaXNlY29uZHMnLFxuICAneWVhcm1vbnRoJywgJ3llYXJtb250aGRheScsICd5ZWFybW9udGhkYXRlJywgJ3llYXJkYXknLCAneWVhcmRhdGUnLFxuICAneWVhcm1vbnRoZGF5aG91cnMnLCAneWVhcm1vbnRoZGF5aG91cnNtaW51dGVzJywgJ2hvdXJzbWludXRlcycsXG4gICdob3Vyc21pbnV0ZXNzZWNvbmRzJywgJ21pbnV0ZXNzZWNvbmRzJywgJ3NlY29uZHNtaWxsaXNlY29uZHMnXG5dO1xuIiwiLyoqIENvbnN0YW50cyBhbmQgdXRpbGl0aWVzIGZvciBkYXRhIHR5cGUgKi9cblxuZXhwb3J0IGVudW0gVHlwZSB7XG4gIFFVQU5USVRBVElWRSA9ICdxdWFudGl0YXRpdmUnIGFzIGFueSxcbiAgT1JESU5BTCA9ICdvcmRpbmFsJyBhcyBhbnksXG4gIFRFTVBPUkFMID0gJ3RlbXBvcmFsJyBhcyBhbnksXG4gIE5PTUlOQUwgPSAnbm9taW5hbCcgYXMgYW55XG59XG5cbmV4cG9ydCBjb25zdCBRVUFOVElUQVRJVkUgPSBUeXBlLlFVQU5USVRBVElWRTtcbmV4cG9ydCBjb25zdCBPUkRJTkFMID0gVHlwZS5PUkRJTkFMO1xuZXhwb3J0IGNvbnN0IFRFTVBPUkFMID0gVHlwZS5URU1QT1JBTDtcbmV4cG9ydCBjb25zdCBOT01JTkFMID0gVHlwZS5OT01JTkFMO1xuXG4vKipcbiAqIE1hcHBpbmcgZnJvbSBmdWxsIHR5cGUgbmFtZXMgdG8gc2hvcnQgdHlwZSBuYW1lcy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBTSE9SVF9UWVBFID0ge1xuICBxdWFudGl0YXRpdmU6ICdRJyxcbiAgdGVtcG9yYWw6ICdUJyxcbiAgbm9taW5hbDogJ04nLFxuICBvcmRpbmFsOiAnTydcbn07XG4vKipcbiAqIE1hcHBpbmcgZnJvbSBzaG9ydCB0eXBlIG5hbWVzIHRvIGZ1bGwgdHlwZSBuYW1lcy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBUWVBFX0ZST01fU0hPUlRfVFlQRSA9IHtcbiAgUTogUVVBTlRJVEFUSVZFLFxuICBUOiBURU1QT1JBTCxcbiAgTzogT1JESU5BTCxcbiAgTjogTk9NSU5BTFxufTtcblxuLyoqXG4gKiBHZXQgZnVsbCwgbG93ZXJjYXNlIHR5cGUgbmFtZSBmb3IgYSBnaXZlbiB0eXBlLlxuICogQHBhcmFtICB0eXBlXG4gKiBAcmV0dXJuIEZ1bGwgdHlwZSBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVsbE5hbWUodHlwZTogVHlwZSk6IFR5cGUge1xuICBjb25zdCB0eXBlU3RyaW5nID0gPGFueT50eXBlOyAgLy8gZm9yY2UgdHlwZSBhcyBzdHJpbmcgc28gd2UgY2FuIHRyYW5zbGF0ZSBzaG9ydCB0eXBlc1xuICByZXR1cm4gVFlQRV9GUk9NX1NIT1JUX1RZUEVbdHlwZVN0cmluZy50b1VwcGVyQ2FzZSgpXSB8fCAvLyBzaG9ydCB0eXBlIGlzIHVwcGVyY2FzZSBieSBkZWZhdWx0XG4gICAgICAgICB0eXBlU3RyaW5nLnRvTG93ZXJDYXNlKCk7XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9kYXRhbGliLmQudHNcIi8+XG5cbmV4cG9ydCB7a2V5cywgZXh0ZW5kLCBkdXBsaWNhdGUsIGlzQXJyYXksIHZhbHMsIHRydW5jYXRlLCB0b01hcCwgaXNPYmplY3R9IGZyb20gJ2RhdGFsaWIvc3JjL3V0aWwnO1xuZXhwb3J0IHtyYW5nZX0gZnJvbSAnZGF0YWxpYi9zcmMvZ2VuZXJhdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnM8VD4oYXJyYXk6IEFycmF5PFQ+LCBpdGVtOiBUKSB7XG4gIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pID4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoKG9iaiwgZjogKGEsIGQsIGssIG8pID0+IGFueSwgdGhpc0FyZykge1xuICBpZiAob2JqLmZvckVhY2gpIHtcbiAgICBvYmouZm9yRWFjaC5jYWxsKHRoaXNBcmcsIGYpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGssIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2Uob2JqLCBmOiAoYSwgaSwgZCwgaywgbykgPT4gYW55LCBpbml0LCB0aGlzQXJnPykge1xuICBpZiAob2JqLnJlZHVjZSkge1xuICAgIHJldHVybiBvYmoucmVkdWNlLmNhbGwodGhpc0FyZywgZiwgaW5pdCk7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgaW5pdCA9IGYuY2FsbCh0aGlzQXJnLCBpbml0LCBvYmpba10sIGssIG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbml0O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXAob2JqLCBmOiAoYSwgZCwgaywgbykgPT4gYW55LCB0aGlzQXJnPykge1xuICBpZiAob2JqLm1hcCkge1xuICAgIHJldHVybiBvYmoubWFwLmNhbGwodGhpc0FyZywgZik7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG91dHB1dCA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGssIG9iaikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbnk8VD4oYXJyOiBBcnJheTxUPiwgZjogKGQ6IFQsIGs/LCBpPykgPT4gYm9vbGVhbikge1xuICB2YXIgaSA9IDA7XG4gIGZvciAobGV0IGsgPSAwOyBrPGFyci5sZW5ndGg7IGsrKykge1xuICAgIGlmIChmKGFycltrXSwgaywgaSsrKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFsbDxUPihhcnI6IEFycmF5PFQ+LCBmOiAoZDogVCwgaz8sIGk/KSA9PiBib29sZWFuKSB7XG4gIHZhciBpID0gMDtcbiAgZm9yIChsZXQgayA9IDA7IGs8YXJyLmxlbmd0aDsgaysrKSB7XG4gICAgaWYgKCFmKGFycltrXSwgaywgaSsrKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gRklYTUUgcmVtb3ZlIHRoaXNcbmltcG9ydCBkbEJpbiA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL2JpbnMvYmlucycpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldGJpbnMoc3RhdHMsIG1heGJpbnMpIHtcbiAgcmV0dXJuIGRsQmluKHtcbiAgICBtaW46IHN0YXRzLm1pbixcbiAgICBtYXg6IHN0YXRzLm1heCxcbiAgICBtYXhiaW5zOiBtYXhiaW5zXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXJyb3IobWVzc2FnZTogYW55KSB7XG4gIGNvbnNvbGUuZXJyb3IoJ1tWTCBFcnJvcl0nLCBtZXNzYWdlKTtcbn1cbiIsImltcG9ydCB7U3BlY30gZnJvbSAnLi9zY2hlbWEvc2NoZW1hJztcblxuLy8gVE9ETzogbW92ZSB0byB2bC5zcGVjLnZhbGlkYXRvcj9cblxuaW1wb3J0IHt0b01hcH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7QkFSfSBmcm9tICcuL21hcmsnO1xuXG5pbnRlcmZhY2UgUmVxdWlyZWRDaGFubmVsTWFwIHtcbiAgW21hcms6IHN0cmluZ106IEFycmF5PHN0cmluZz47XG59XG5cbi8qKlxuICogUmVxdWlyZWQgRW5jb2RpbmcgQ2hhbm5lbHMgZm9yIGVhY2ggbWFyayB0eXBlXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9SRVFVSVJFRF9DSEFOTkVMX01BUDogUmVxdWlyZWRDaGFubmVsTWFwID0ge1xuICB0ZXh0OiBbJ3RleHQnXSxcbiAgbGluZTogWyd4JywgJ3knXSxcbiAgYXJlYTogWyd4JywgJ3knXVxufTtcblxuaW50ZXJmYWNlIFN1cHBvcnRlZENoYW5uZWxNYXAge1xuICBbbWFyazogc3RyaW5nXToge1xuICAgIFtjaGFubmVsOiBzdHJpbmddOiBudW1iZXJcbiAgfTtcbn1cblxuLyoqXG4gKiBTdXBwb3J0ZWQgRW5jb2RpbmcgQ2hhbm5lbCBmb3IgZWFjaCBtYXJrIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfU1VQUE9SVEVEX0NIQU5ORUxfVFlQRTogU3VwcG9ydGVkQ2hhbm5lbE1hcCA9IHtcbiAgYmFyOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ3NpemUnLCAnY29sb3InLCAnZGV0YWlsJ10pLFxuICBsaW5lOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2RldGFpbCddKSwgLy8gVE9ETzogYWRkIHNpemUgd2hlbiBWZWdhIHN1cHBvcnRzXG4gIGFyZWE6IHRvTWFwKFsncm93JywgJ2NvbHVtbicsICd4JywgJ3knLCAnY29sb3InLCAnZGV0YWlsJ10pLFxuICB0aWNrOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2RldGFpbCddKSxcbiAgY2lyY2xlOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnLCAnZGV0YWlsJ10pLFxuICBzcXVhcmU6IHRvTWFwKFsncm93JywgJ2NvbHVtbicsICd4JywgJ3knLCAnY29sb3InLCAnc2l6ZScsICdkZXRhaWwnXSksXG4gIHBvaW50OiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnLCAnZGV0YWlsJywgJ3NoYXBlJ10pLFxuICB0ZXh0OiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAnc2l6ZScsICdjb2xvcicsICd0ZXh0J10pIC8vIFRPRE8oIzcyNCkgcmV2aXNlXG59O1xuXG4vLyBUT0RPOiBjb25zaWRlciBpZiB3ZSBzaG91bGQgYWRkIHZhbGlkYXRlIG1ldGhvZCBhbmRcbi8vIHJlcXVpcmVzIFpTY2hlbWEgaW4gdGhlIG1haW4gdmVnYS1saXRlIHJlcG9cblxuLyoqXG4gKiBGdXJ0aGVyIGNoZWNrIGlmIGVuY29kaW5nIG1hcHBpbmcgb2YgYSBzcGVjIGlzIGludmFsaWQgYW5kXG4gKiByZXR1cm4gZXJyb3IgaWYgaXQgaXMgaW52YWxpZC5cbiAqXG4gKiBUaGlzIGNoZWNrcyBpZlxuICogKDEpIGFsbCB0aGUgcmVxdWlyZWQgZW5jb2RpbmcgY2hhbm5lbHMgZm9yIHRoZSBtYXJrIHR5cGUgYXJlIHNwZWNpZmllZFxuICogKDIpIGFsbCB0aGUgc3BlY2lmaWVkIGVuY29kaW5nIGNoYW5uZWxzIGFyZSBzdXBwb3J0ZWQgYnkgdGhlIG1hcmsgdHlwZVxuICogQHBhcmFtICB7W3R5cGVdfSBzcGVjIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1JlcXVpcmVkQ2hhbm5lbE1hcCAgPSBEZWZhdWx0UmVxdWlyZWRDaGFubmVsTWFwfSAgcmVxdWlyZWRDaGFubmVsTWFwXG4gKiBAcGFyYW0gIHtTdXBwb3J0ZWRDaGFubmVsTWFwID0gRGVmYXVsdFN1cHBvcnRlZENoYW5uZWxNYXB9IHN1cHBvcnRlZENoYW5uZWxNYXBcbiAqIEByZXR1cm4ge1N0cmluZ30gUmV0dXJuIG9uZSByZWFzb24gd2h5IHRoZSBlbmNvZGluZyBpcyBpbnZhbGlkLFxuICogICAgICAgICAgICAgICAgICBvciBudWxsIGlmIHRoZSBlbmNvZGluZyBpcyB2YWxpZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVuY29kaW5nTWFwcGluZ0Vycm9yKHNwZWM6IFNwZWMsXG4gIHJlcXVpcmVkQ2hhbm5lbE1hcDogUmVxdWlyZWRDaGFubmVsTWFwID0gREVGQVVMVF9SRVFVSVJFRF9DSEFOTkVMX01BUCxcbiAgc3VwcG9ydGVkQ2hhbm5lbE1hcDogU3VwcG9ydGVkQ2hhbm5lbE1hcCA9IERFRkFVTFRfU1VQUE9SVEVEX0NIQU5ORUxfVFlQRVxuICApIHtcbiAgbGV0IG1hcmsgPSBzcGVjLm1hcms7XG4gIGxldCBlbmNvZGluZyA9IHNwZWMuZW5jb2Rpbmc7XG4gIGxldCByZXF1aXJlZENoYW5uZWxzID0gcmVxdWlyZWRDaGFubmVsTWFwW21hcmtdO1xuICBsZXQgc3VwcG9ydGVkQ2hhbm5lbHMgPSBzdXBwb3J0ZWRDaGFubmVsTWFwW21hcmtdO1xuXG4gIGZvciAobGV0IGkgaW4gcmVxdWlyZWRDaGFubmVscykgeyAvLyBhbGwgcmVxdWlyZWQgY2hhbm5lbHMgYXJlIGluIGVuY29kaW5nYFxuICAgIGlmICghKHJlcXVpcmVkQ2hhbm5lbHNbaV0gaW4gZW5jb2RpbmcpKSB7XG4gICAgICByZXR1cm4gJ01pc3NpbmcgZW5jb2RpbmcgY2hhbm5lbCBcXFwiJyArIHJlcXVpcmVkQ2hhbm5lbHNbaV0gK1xuICAgICAgICAnXFxcIiBmb3IgbWFyayBcXFwiJyArIG1hcmsgKyAnXFxcIic7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgY2hhbm5lbCBpbiBlbmNvZGluZykgeyAvLyBhbGwgY2hhbm5lbHMgaW4gZW5jb2RpbmcgYXJlIHN1cHBvcnRlZFxuICAgIGlmICghc3VwcG9ydGVkQ2hhbm5lbHNbY2hhbm5lbF0pIHtcbiAgICAgIHJldHVybiAnRW5jb2RpbmcgY2hhbm5lbCBcXFwiJyArIGNoYW5uZWwgK1xuICAgICAgICAnXFxcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IG1hcmsgdHlwZSBcXFwiJyArIG1hcmsgKyAnXFxcIic7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1hcmsgPT09IEJBUiAmJiAhZW5jb2RpbmcueCAmJiAhZW5jb2RpbmcueSkge1xuICAgIHJldHVybiAnTWlzc2luZyBib3RoIHggYW5kIHkgZm9yIGJhcic7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsImltcG9ydCAqIGFzIHZsQmluIGZyb20gJy4vYmluJztcbmltcG9ydCAqIGFzIHZsQ2hhbm5lbCBmcm9tICcuL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgdmxEYXRhIGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4vZW5jb2RpbmcnO1xuaW1wb3J0ICogYXMgdmxGaWVsZERlZiBmcm9tICcuL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIHZsQ29tcGlsZSBmcm9tICcuL2NvbXBpbGUvY29tcGlsZSc7XG5pbXBvcnQgKiBhcyB2bFNjaGVtYSBmcm9tICcuL3NjaGVtYS9zY2hlbWEnO1xuaW1wb3J0ICogYXMgdmxTaG9ydGhhbmQgZnJvbSAnLi9zaG9ydGhhbmQnO1xuaW1wb3J0ICogYXMgdmxTcGVjIGZyb20gJy4vc3BlYyc7XG5pbXBvcnQgKiBhcyB2bFRpbWVVbml0IGZyb20gJy4vdGltZXVuaXQnO1xuaW1wb3J0ICogYXMgdmxUeXBlIGZyb20gJy4vdHlwZSc7XG5pbXBvcnQgKiBhcyB2bFZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0ICogYXMgdmxVdGlsIGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBiaW4gPSB2bEJpbjtcbmV4cG9ydCBjb25zdCBjaGFubmVsID0gdmxDaGFubmVsO1xuZXhwb3J0IGNvbnN0IGNvbXBpbGUgPSB2bENvbXBpbGUuY29tcGlsZTtcbmV4cG9ydCBjb25zdCBkYXRhID0gdmxEYXRhO1xuZXhwb3J0IGNvbnN0IGVuY29kaW5nID0gdmxFbmNvZGluZztcbmV4cG9ydCBjb25zdCBmaWVsZERlZiA9IHZsRmllbGREZWY7XG5leHBvcnQgY29uc3Qgc2NoZW1hID0gdmxTY2hlbWE7XG5leHBvcnQgY29uc3Qgc2hvcnRoYW5kID0gdmxTaG9ydGhhbmQ7XG5leHBvcnQgY29uc3Qgc3BlYyA9IHZsU3BlYztcbmV4cG9ydCBjb25zdCB0aW1lVW5pdCA9IHZsVGltZVVuaXQ7XG5leHBvcnQgY29uc3QgdHlwZSA9IHZsVHlwZTtcbmV4cG9ydCBjb25zdCB1dGlsID0gdmxVdGlsO1xuZXhwb3J0IGNvbnN0IHZhbGlkYXRlID0gdmxWYWxpZGF0ZTtcblxuZXhwb3J0IGNvbnN0IHZlcnNpb24gPSAnX19WRVJTSU9OX18nO1xuIl19
