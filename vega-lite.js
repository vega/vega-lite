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
    Channel[Channel["TEXT"] = 'text'] = "TEXT";
    Channel[Channel["DETAIL"] = 'detail'] = "DETAIL";
    Channel[Channel["LABEL"] = 'label'] = "LABEL";
    Channel[Channel["PATH"] = 'path'] = "PATH";
    Channel[Channel["ORDER"] = 'order'] = "ORDER";
})(exports.Channel || (exports.Channel = {}));
var Channel = exports.Channel;
exports.X = Channel.X;
exports.Y = Channel.Y;
exports.ROW = Channel.ROW;
exports.COLUMN = Channel.COLUMN;
exports.SHAPE = Channel.SHAPE;
exports.SIZE = Channel.SIZE;
exports.COLOR = Channel.COLOR;
exports.TEXT = Channel.TEXT;
exports.DETAIL = Channel.DETAIL;
exports.LABEL = Channel.LABEL;
exports.PATH = Channel.PATH;
exports.ORDER = Channel.ORDER;
exports.CHANNELS = [exports.X, exports.Y, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.PATH, exports.ORDER, exports.TEXT, exports.DETAIL, exports.LABEL];
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
        case exports.ORDER:
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
    return !util_1.contains([exports.DETAIL, exports.PATH, exports.TEXT, exports.LABEL, exports.ORDER], channel);
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
            if ((channel === channel_1.PATH || channel === channel_1.ORDER) && !fieldDef.aggregate && fieldDef.type === type_1.QUANTITATIVE) {
                fieldDef.aggregate = 'min';
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
                return this.isOrdinalScale(channel) ?
                    this.fieldDef(channel).scale.bandWidth - 1 :
                    !this.has(channel) ?
                        21 :
                        2;
            case mark_1.TICK:
                if (this.config().mark.tickWidth) {
                    return this.config().mark.tickWidth;
                }
                var bandWidth = this.has(channel) ?
                    this.fieldDef(channel).scale.bandWidth :
                    21;
                return bandWidth / 1.5;
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
        return model.config().unit.width;
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
            return model.config().unit.height;
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
var mark_1 = require('../mark');
var stack_1 = require('./stack');
var util_1 = require('../util');
var mark_area_1 = require('./mark-area');
var mark_bar_1 = require('./mark-bar');
var mark_line_1 = require('./mark-line');
var mark_point_1 = require('./mark-point');
var mark_text_1 = require('./mark-text');
var mark_tick_1 = require('./mark-tick');
var util_2 = require('./util');
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
            [].concat(facetTransform, model.has(channel_1.ORDER) ? [{ type: 'sort', by: sortBy(model) }] : []);
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
    marks.push(util_1.extend(name ? { name: name + '-marks' } : {}, { type: markCompiler[mark].markType() }, (!isFaceted || model.stack() || model.has(channel_1.ORDER)) ? {
        from: util_1.extend(isFaceted ? {} : dataFrom, model.stack() ?
            { transform: [stack_1.stackTransform(model)] } :
            model.has(channel_1.ORDER) ?
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
    if (model.has(channel_1.ORDER)) {
        var channelEncoding = model.spec().encoding[channel_1.ORDER];
        return util_1.isArray(channelEncoding) ?
            channelEncoding.map(util_2.sortField) :
            util_2.sortField(channelEncoding);
    }
    return null;
}
function sortPathBy(model) {
    if (model.mark() === mark_1.LINE && model.has(channel_1.PATH)) {
        var channelEncoding = model.spec().encoding[channel_1.PATH];
        return util_1.isArray(channelEncoding) ?
            channelEncoding.map(util_2.sortField) :
            util_2.sortField(channelEncoding);
    }
    else {
        return '-' + model.field(model.config().mark.orient === 'horizontal' ? channel_1.Y : channel_1.X);
    }
}
function detailFields(model) {
    return [channel_1.COLOR, channel_1.DETAIL, channel_1.SHAPE].reduce(function (details, channel) {
        if (model.has(channel) && !model.fieldDef(channel).aggregate) {
            details.push(model.field(channel));
        }
        return details;
    }, []);
}

},{"../channel":9,"../mark":32,"../util":54,"./mark-area":18,"./mark-bar":19,"./mark-line":20,"./mark-point":21,"./mark-text":22,"./mark-tick":23,"./stack":26,"./util":28}],25:[function(require,module,exports){
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
        if (stack.offset === 'normalize') {
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
var channel_1 = require('../channel');
var mark_1 = require('../mark');
var fielddef_1 = require('../fielddef');
var encoding_1 = require('../encoding');
var util_1 = require('../util');
var util_2 = require('./util');
var scale_1 = require('./scale');
function compileStackProperties(spec) {
    var stackFields = getStackFields(spec);
    if (stackFields.length > 0 &&
        util_1.contains([mark_1.BAR, mark_1.AREA], spec.mark) &&
        spec.config.mark.stacked !== 'none' &&
        encoding_1.isAggregate(spec.encoding)) {
        var isXMeasure = encoding_1.has(spec.encoding, channel_1.X) && fielddef_1.isMeasure(spec.encoding.x);
        var isYMeasure = encoding_1.has(spec.encoding, channel_1.Y) && fielddef_1.isMeasure(spec.encoding.y);
        if (isXMeasure && !isYMeasure) {
            return {
                groupbyChannel: channel_1.Y,
                fieldChannel: channel_1.X,
                stackFields: stackFields,
                offset: spec.config.mark.stacked
            };
        }
        else if (isYMeasure && !isXMeasure) {
            return {
                groupbyChannel: channel_1.X,
                fieldChannel: channel_1.Y,
                stackFields: stackFields,
                offset: spec.config.mark.stacked
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
    var encoding = model.spec().encoding;
    var sortby = model.has(channel_1.ORDER) ?
        (util_1.isArray(encoding[channel_1.ORDER]) ? encoding[channel_1.ORDER] : [encoding[channel_1.ORDER]]).map(util_2.sortField) :
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
    if (stack.offset) {
        transform.offset = stack.offset;
    }
    return transform;
}
exports.stackTransform = stackTransform;

},{"../channel":9,"../encoding":30,"../fielddef":31,"../mark":32,"../util":54,"./scale":25,"./util":28}],27:[function(require,module,exports){
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
var fielddef_1 = require('../fielddef');
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
function sortField(fieldDef) {
    return (fieldDef.sort === 'descending' ? '-' : '') + fielddef_1.field(fieldDef);
}
exports.sortField = sortField;
function timeFormat(model, channel) {
    var fieldDef = model.fieldDef(channel);
    return time_1.format(fieldDef.timeUnit, isAbbreviated(model, channel, fieldDef));
}
exports.timeFormat = timeFormat;

},{"../channel":9,"../fielddef":31,"../type":53,"../util":54,"./time":27}],29:[function(require,module,exports){
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
        stacked: {
            type: 'string',
            enum: ['zero', 'center', 'normalize', 'none'],
            default: undefined
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
var config_unit_schema_1 = require('./config.unit.schema');
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
        unit: config_unit_schema_1.unitConfig,
        cell: config_cell_schema_1.cellConfig,
        mark: config_marks_schema_1.markConfig,
        scene: config_scene_schema_1.sceneConfig
    }
};

},{"./config.cell.schema":35,"./config.marks.schema":36,"./config.scene.schema":37,"./config.unit.schema":39}],39:[function(require,module,exports){
exports.unitConfig = {
    type: 'object',
    properties: {
        width: {
            type: 'integer',
            default: 200
        },
        height: {
            type: 'integer',
            default: 200
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
        text: fielddef_schema_1.textFieldDef,
        detail: fielddef_schema_1.detailFieldDefs,
        label: fielddef_schema_1.textFieldDef,
        path: fielddef_schema_1.orderFieldDefs,
        order: fielddef_schema_1.orderFieldDefs
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
    }
};
var fieldDefWithScale = schemautil_1.mergeDeep(util_1.duplicate(fieldDef), {
    properties: {
        scale: scale_schema_1.typicalScale,
        sort: sort_schema_1.sort
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
exports.detailFieldDefs = {
    default: undefined,
    oneOf: [util_1.duplicate(fieldDef), {
            type: 'array',
            items: util_1.duplicate(fieldDef)
        }]
};
var orderFieldDef = schemautil_1.mergeDeep(util_1.duplicate(fieldDef), {
    properties: {
        sort: sort_schema_1.sortEnum
    }
});
exports.orderFieldDefs = {
    default: undefined,
    oneOf: [util_1.duplicate(orderFieldDef), {
            type: 'array',
            items: util_1.duplicate(orderFieldDef)
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
        scale: scale_schema_1.ordinalOnlyScale,
        sort: sort_schema_1.sort
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
exports.sortEnum = {
    default: 'ascending',
    type: 'string',
    enum: ['ascending', 'descending', 'unsorted']
};
exports.sort = {
    default: 'ascending',
    supportedTypes: util_1.toMap([type_1.QUANTITATIVE, type_1.ORDINAL]),
    oneOf: [
        exports.sortEnum,
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
        (!spec.config || !spec.config.mark.stacked !== false) &&
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9kYXRhbGliL25vZGVfbW9kdWxlcy9kMy10aW1lL2J1aWxkL2QzLXRpbWUuanMiLCIuLi9kYXRhbGliL3NyYy9iaW5zL2JpbnMuanMiLCIuLi9kYXRhbGliL3NyYy9nZW5lcmF0ZS5qcyIsIi4uL2RhdGFsaWIvc3JjL3RpbWUuanMiLCIuLi9kYXRhbGliL3NyYy9ub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXJlc29sdmUvZW1wdHkuanMiLCJzcmMvYWdncmVnYXRlLnRzIiwic3JjL2Jpbi50cyIsInNyYy9jaGFubmVsLnRzIiwic3JjL2NvbXBpbGUvTW9kZWwudHMiLCJzcmMvY29tcGlsZS9heGlzLnRzIiwic3JjL2NvbXBpbGUvY29tcGlsZS50cyIsInNyYy9jb21waWxlL2NvbmZpZy50cyIsInNyYy9jb21waWxlL2RhdGEudHMiLCJzcmMvY29tcGlsZS9mYWNldC50cyIsInNyYy9jb21waWxlL2xheW91dC50cyIsInNyYy9jb21waWxlL2xlZ2VuZC50cyIsInNyYy9jb21waWxlL21hcmstYXJlYS50cyIsInNyYy9jb21waWxlL21hcmstYmFyLnRzIiwic3JjL2NvbXBpbGUvbWFyay1saW5lLnRzIiwic3JjL2NvbXBpbGUvbWFyay1wb2ludC50cyIsInNyYy9jb21waWxlL21hcmstdGV4dC50cyIsInNyYy9jb21waWxlL21hcmstdGljay50cyIsInNyYy9jb21waWxlL21hcmsudHMiLCJzcmMvY29tcGlsZS9zY2FsZS50cyIsInNyYy9jb21waWxlL3N0YWNrLnRzIiwic3JjL2NvbXBpbGUvdGltZS50cyIsInNyYy9jb21waWxlL3V0aWwudHMiLCJzcmMvZGF0YS50cyIsInNyYy9lbmNvZGluZy50cyIsInNyYy9maWVsZGRlZi50cyIsInNyYy9tYXJrLnRzIiwic3JjL3NjaGVtYS9heGlzLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvYmluLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvY29uZmlnLmNlbGwuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9jb25maWcubWFya3Muc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9jb25maWcuc2NlbmUuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9jb25maWcuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9jb25maWcudW5pdC5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL2RhdGEuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9lbmNvZGluZy5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvbGVnZW5kLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvbWFyay5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL3NjYWxlLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9zY2hlbWF1dGlsLnRzIiwic3JjL3NjaGVtYS9zb3J0LnNjaGVtYS50cyIsInNyYy9zY2hlbWEvdHJhbnNmb3JtLnNjaGVtYS50cyIsInNyYy9zaG9ydGhhbmQudHMiLCJzcmMvc3BlYy50cyIsInNyYy90aW1ldW5pdC50cyIsInNyYy90eXBlLnRzIiwic3JjL3V0aWwudHMiLCJzcmMvdmFsaWRhdGUudHMiLCJzcmMvdmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMVNBOztBQ0FhLHFCQUFhLEdBQUc7SUFDM0IsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVU7SUFDakQsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsVUFBVSxF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QUksUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFdkMsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLEVBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLENBQUMsRUFBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNoQixLQUFLLFdBQUM7WUFHSixNQUFNLENBQUMsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsU0FBUyxFQUFDLENBQUM7UUFDM0QsS0FBSyxXQUFDO1lBRUosRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxFQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUMsQ0FBQztZQUM1RCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBQyxDQUFDO1FBQzVELEtBQUssY0FBSTtZQUNQLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVsQixJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxZQUFZ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LGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUV4QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJ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QyxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxJQUFJLEdBQUc7Z0JBQ1AsS0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsZUFBSyxDQUFDO2dCQUM3QixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFLLENBQUM7YUFDMUIsQ0FBQztRQUNKLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNsRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEQsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxNQUFNLEdBQUc7Z0JBQ1QsS0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsZUFBSyxDQUFDO2dCQUM3QixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFLLENBQUM7YUFDMUIsQ0FBQztRQUNKLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFD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QyxJQUFZLE1BQU0sV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUVwQixXQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osZUFBTyxHQUFHLFNBQVMsQ0FBQztBQUNwQixlQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUM1QixZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFDdEIsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFDdEIsY0FBTSxHQUFHLFFBQVEsQ0FBQztBQUNsQixpQkFBUyxHQUFHLFdBQVcsQ0FBQztBQUN4QixZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFDdEIsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLFlBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxnQkFBUSxHQUFHLFVBQVUsQ0FBQztBQUV0QixlQUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoJ2QzLXRpbWUnLCBbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICBmYWN0b3J5KChnbG9iYWwuZDNfdGltZSA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICB2YXIgdDAgPSBuZXcgRGF0ZTtcbiAgdmFyIHQxID0gbmV3IERhdGU7XG4gIGZ1bmN0aW9uIG5ld0ludGVydmFsKGZsb29yaSwgb2Zmc2V0aSwgY291bnQsIGZpZWxkKSB7XG5cbiAgICBmdW5jdGlvbiBpbnRlcnZhbChkYXRlKSB7XG4gICAgICByZXR1cm4gZmxvb3JpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSkpLCBkYXRlO1xuICAgIH1cblxuICAgIGludGVydmFsLmZsb29yID0gaW50ZXJ2YWw7XG5cbiAgICBpbnRlcnZhbC5yb3VuZCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIHZhciBkMCA9IG5ldyBEYXRlKCtkYXRlKSxcbiAgICAgICAgICBkMSA9IG5ldyBEYXRlKGRhdGUgLSAxKTtcbiAgICAgIGZsb29yaShkMCksIGZsb29yaShkMSksIG9mZnNldGkoZDEsIDEpO1xuICAgICAgcmV0dXJuIGRhdGUgLSBkMCA8IGQxIC0gZGF0ZSA/IGQwIDogZDE7XG4gICAgfTtcblxuICAgIGludGVydmFsLmNlaWwgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICByZXR1cm4gZmxvb3JpKGRhdGUgPSBuZXcgRGF0ZShkYXRlIC0gMSkpLCBvZmZzZXRpKGRhdGUsIDEpLCBkYXRlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5vZmZzZXQgPSBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICByZXR1cm4gb2Zmc2V0aShkYXRlID0gbmV3IERhdGUoK2RhdGUpLCBzdGVwID09IG51bGwgPyAxIDogTWF0aC5mbG9vcihzdGVwKSksIGRhdGU7XG4gICAgfTtcblxuICAgIGludGVydmFsLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICAgIHZhciByYW5nZSA9IFtdO1xuICAgICAgc3RhcnQgPSBuZXcgRGF0ZShzdGFydCAtIDEpO1xuICAgICAgc3RvcCA9IG5ldyBEYXRlKCtzdG9wKTtcbiAgICAgIHN0ZXAgPSBzdGVwID09IG51bGwgPyAxIDogTWF0aC5mbG9vcihzdGVwKTtcbiAgICAgIGlmICghKHN0YXJ0IDwgc3RvcCkgfHwgIShzdGVwID4gMCkpIHJldHVybiByYW5nZTsgLy8gYWxzbyBoYW5kbGVzIEludmFsaWQgRGF0ZVxuICAgICAgb2Zmc2V0aShzdGFydCwgMSksIGZsb29yaShzdGFydCk7XG4gICAgICBpZiAoc3RhcnQgPCBzdG9wKSByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpO1xuICAgICAgd2hpbGUgKG9mZnNldGkoc3RhcnQsIHN0ZXApLCBmbG9vcmkoc3RhcnQpLCBzdGFydCA8IHN0b3ApIHJhbmdlLnB1c2gobmV3IERhdGUoK3N0YXJ0KSk7XG4gICAgICByZXR1cm4gcmFuZ2U7XG4gICAgfTtcblxuICAgIGludGVydmFsLmZpbHRlciA9IGZ1bmN0aW9uKHRlc3QpIHtcbiAgICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIHdoaWxlIChmbG9vcmkoZGF0ZSksICF0ZXN0KGRhdGUpKSBkYXRlLnNldFRpbWUoZGF0ZSAtIDEpO1xuICAgICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgICB3aGlsZSAoLS1zdGVwID49IDApIHdoaWxlIChvZmZzZXRpKGRhdGUsIDEpLCAhdGVzdChkYXRlKSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKGNvdW50KSB7XG4gICAgICBpbnRlcnZhbC5jb3VudCA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgdDAuc2V0VGltZSgrc3RhcnQpLCB0MS5zZXRUaW1lKCtlbmQpO1xuICAgICAgICBmbG9vcmkodDApLCBmbG9vcmkodDEpO1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihjb3VudCh0MCwgdDEpKTtcbiAgICAgIH07XG5cbiAgICAgIGludGVydmFsLmV2ZXJ5ID0gZnVuY3Rpb24oc3RlcCkge1xuICAgICAgICBzdGVwID0gTWF0aC5mbG9vcihzdGVwKTtcbiAgICAgICAgcmV0dXJuICFpc0Zpbml0ZShzdGVwKSB8fCAhKHN0ZXAgPiAwKSA/IG51bGxcbiAgICAgICAgICAgIDogIShzdGVwID4gMSkgPyBpbnRlcnZhbFxuICAgICAgICAgICAgOiBpbnRlcnZhbC5maWx0ZXIoZmllbGRcbiAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGZpZWxkKGQpICUgc3RlcCA9PT0gMDsgfVxuICAgICAgICAgICAgICAgIDogZnVuY3Rpb24oZCkgeyByZXR1cm4gaW50ZXJ2YWwuY291bnQoMCwgZCkgJSBzdGVwID09PSAwOyB9KTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVydmFsO1xuICB9O1xuXG4gIHZhciBtaWxsaXNlY29uZCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIC8vIG5vb3BcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZCAtIHN0YXJ0O1xuICB9KTtcblxuICAvLyBBbiBvcHRpbWl6ZWQgaW1wbGVtZW50YXRpb24gZm9yIHRoaXMgc2ltcGxlIGNhc2UuXG4gIG1pbGxpc2Vjb25kLmV2ZXJ5ID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBNYXRoLmZsb29yKGspO1xuICAgIGlmICghaXNGaW5pdGUoaykgfHwgIShrID4gMCkpIHJldHVybiBudWxsO1xuICAgIGlmICghKGsgPiAxKSkgcmV0dXJuIG1pbGxpc2Vjb25kO1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldFRpbWUoTWF0aC5mbG9vcihkYXRlIC8gaykgKiBrKTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogayk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyBrO1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBzZWNvbmQgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRNaWxsaXNlY29uZHMoMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMWUzKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMWUzO1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0U2Vjb25kcygpO1xuICB9KTtcblxuICB2YXIgbWludXRlID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0U2Vjb25kcygwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiA2ZTQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2ZTQ7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRNaW51dGVzKCk7XG4gIH0pO1xuXG4gIHZhciBob3VyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0TWludXRlcygwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAzNmU1KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMzZlNTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldEhvdXJzKCk7XG4gIH0pO1xuXG4gIHZhciBkYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDg2NGU1O1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0RGF0ZSgpIC0gMTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gd2Vla2RheShpKSB7XG4gICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAoZGF0ZS5nZXREYXkoKSArIDcgLSBpKSAlIDcpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXAgKiA3KTtcbiAgICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICByZXR1cm4gKGVuZCAtIHN0YXJ0IC0gKGVuZC5nZXRUaW1lem9uZU9mZnNldCgpIC0gc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgKiA2ZTQpIC8gNjA0OGU1O1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHN1bmRheSA9IHdlZWtkYXkoMCk7XG4gIHZhciBtb25kYXkgPSB3ZWVrZGF5KDEpO1xuICB2YXIgdHVlc2RheSA9IHdlZWtkYXkoMik7XG4gIHZhciB3ZWRuZXNkYXkgPSB3ZWVrZGF5KDMpO1xuICB2YXIgdGh1cnNkYXkgPSB3ZWVrZGF5KDQpO1xuICB2YXIgZnJpZGF5ID0gd2Vla2RheSg1KTtcbiAgdmFyIHNhdHVyZGF5ID0gd2Vla2RheSg2KTtcblxuICB2YXIgbW9udGggPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldERhdGUoMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRNb250aCgpIC0gc3RhcnQuZ2V0TW9udGgoKSArIChlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCkpICogMTI7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRNb250aCgpO1xuICB9KTtcblxuICB2YXIgeWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0TW9udGgoMCwgMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRGdWxsWWVhcigpIC0gc3RhcnQuZ2V0RnVsbFllYXIoKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIHZhciB1dGNTZWNvbmQgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENNaWxsaXNlY29uZHMoMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMWUzKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMWUzO1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0VVRDU2Vjb25kcygpO1xuICB9KTtcblxuICB2YXIgdXRjTWludXRlID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDU2Vjb25kcygwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiA2ZTQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2ZTQ7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRVVENNaW51dGVzKCk7XG4gIH0pO1xuXG4gIHZhciB1dGNIb3VyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDTWludXRlcygwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAzNmU1KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMzZlNTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFVUQ0hvdXJzKCk7XG4gIH0pO1xuXG4gIHZhciB1dGNEYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA4NjRlNTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFVUQ0RhdGUoKSAtIDE7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHV0Y1dlZWtkYXkoaSkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpIC0gKGRhdGUuZ2V0VVRDRGF5KCkgKyA3IC0gaSkgJSA3KTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBzdGVwICogNyk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2MDQ4ZTU7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgdXRjU3VuZGF5ID0gdXRjV2Vla2RheSgwKTtcbiAgdmFyIHV0Y01vbmRheSA9IHV0Y1dlZWtkYXkoMSk7XG4gIHZhciB1dGNUdWVzZGF5ID0gdXRjV2Vla2RheSgyKTtcbiAgdmFyIHV0Y1dlZG5lc2RheSA9IHV0Y1dlZWtkYXkoMyk7XG4gIHZhciB1dGNUaHVyc2RheSA9IHV0Y1dlZWtkYXkoNCk7XG4gIHZhciB1dGNGcmlkYXkgPSB1dGNXZWVrZGF5KDUpO1xuICB2YXIgdXRjU2F0dXJkYXkgPSB1dGNXZWVrZGF5KDYpO1xuXG4gIHZhciB1dGNNb250aCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0VVRDRGF0ZSgxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDTW9udGgoZGF0ZS5nZXRVVENNb250aCgpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldFVUQ01vbnRoKCkgLSBzdGFydC5nZXRVVENNb250aCgpICsgKGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKSkgKiAxMjtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFVUQ01vbnRoKCk7XG4gIH0pO1xuXG4gIHZhciB1dGNZZWFyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldFVUQ0Z1bGxZZWFyKCkgLSBzdGFydC5nZXRVVENGdWxsWWVhcigpO1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgfSk7XG5cbiAgdmFyIG1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kLnJhbmdlO1xuICB2YXIgc2Vjb25kcyA9IHNlY29uZC5yYW5nZTtcbiAgdmFyIG1pbnV0ZXMgPSBtaW51dGUucmFuZ2U7XG4gIHZhciBob3VycyA9IGhvdXIucmFuZ2U7XG4gIHZhciBkYXlzID0gZGF5LnJhbmdlO1xuICB2YXIgc3VuZGF5cyA9IHN1bmRheS5yYW5nZTtcbiAgdmFyIG1vbmRheXMgPSBtb25kYXkucmFuZ2U7XG4gIHZhciB0dWVzZGF5cyA9IHR1ZXNkYXkucmFuZ2U7XG4gIHZhciB3ZWRuZXNkYXlzID0gd2VkbmVzZGF5LnJhbmdlO1xuICB2YXIgdGh1cnNkYXlzID0gdGh1cnNkYXkucmFuZ2U7XG4gIHZhciBmcmlkYXlzID0gZnJpZGF5LnJhbmdlO1xuICB2YXIgc2F0dXJkYXlzID0gc2F0dXJkYXkucmFuZ2U7XG4gIHZhciB3ZWVrcyA9IHN1bmRheS5yYW5nZTtcbiAgdmFyIG1vbnRocyA9IG1vbnRoLnJhbmdlO1xuICB2YXIgeWVhcnMgPSB5ZWFyLnJhbmdlO1xuXG4gIHZhciB1dGNNaWxsaXNlY29uZCA9IG1pbGxpc2Vjb25kO1xuICB2YXIgdXRjTWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzO1xuICB2YXIgdXRjU2Vjb25kcyA9IHV0Y1NlY29uZC5yYW5nZTtcbiAgdmFyIHV0Y01pbnV0ZXMgPSB1dGNNaW51dGUucmFuZ2U7XG4gIHZhciB1dGNIb3VycyA9IHV0Y0hvdXIucmFuZ2U7XG4gIHZhciB1dGNEYXlzID0gdXRjRGF5LnJhbmdlO1xuICB2YXIgdXRjU3VuZGF5cyA9IHV0Y1N1bmRheS5yYW5nZTtcbiAgdmFyIHV0Y01vbmRheXMgPSB1dGNNb25kYXkucmFuZ2U7XG4gIHZhciB1dGNUdWVzZGF5cyA9IHV0Y1R1ZXNkYXkucmFuZ2U7XG4gIHZhciB1dGNXZWRuZXNkYXlzID0gdXRjV2VkbmVzZGF5LnJhbmdlO1xuICB2YXIgdXRjVGh1cnNkYXlzID0gdXRjVGh1cnNkYXkucmFuZ2U7XG4gIHZhciB1dGNGcmlkYXlzID0gdXRjRnJpZGF5LnJhbmdlO1xuICB2YXIgdXRjU2F0dXJkYXlzID0gdXRjU2F0dXJkYXkucmFuZ2U7XG4gIHZhciB1dGNXZWVrcyA9IHV0Y1N1bmRheS5yYW5nZTtcbiAgdmFyIHV0Y01vbnRocyA9IHV0Y01vbnRoLnJhbmdlO1xuICB2YXIgdXRjWWVhcnMgPSB1dGNZZWFyLnJhbmdlO1xuXG4gIHZhciB2ZXJzaW9uID0gXCIwLjEuMVwiO1xuXG4gIGV4cG9ydHMudmVyc2lvbiA9IHZlcnNpb247XG4gIGV4cG9ydHMubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzO1xuICBleHBvcnRzLnNlY29uZHMgPSBzZWNvbmRzO1xuICBleHBvcnRzLm1pbnV0ZXMgPSBtaW51dGVzO1xuICBleHBvcnRzLmhvdXJzID0gaG91cnM7XG4gIGV4cG9ydHMuZGF5cyA9IGRheXM7XG4gIGV4cG9ydHMuc3VuZGF5cyA9IHN1bmRheXM7XG4gIGV4cG9ydHMubW9uZGF5cyA9IG1vbmRheXM7XG4gIGV4cG9ydHMudHVlc2RheXMgPSB0dWVzZGF5cztcbiAgZXhwb3J0cy53ZWRuZXNkYXlzID0gd2VkbmVzZGF5cztcbiAgZXhwb3J0cy50aHVyc2RheXMgPSB0aHVyc2RheXM7XG4gIGV4cG9ydHMuZnJpZGF5cyA9IGZyaWRheXM7XG4gIGV4cG9ydHMuc2F0dXJkYXlzID0gc2F0dXJkYXlzO1xuICBleHBvcnRzLndlZWtzID0gd2Vla3M7XG4gIGV4cG9ydHMubW9udGhzID0gbW9udGhzO1xuICBleHBvcnRzLnllYXJzID0geWVhcnM7XG4gIGV4cG9ydHMudXRjTWlsbGlzZWNvbmQgPSB1dGNNaWxsaXNlY29uZDtcbiAgZXhwb3J0cy51dGNNaWxsaXNlY29uZHMgPSB1dGNNaWxsaXNlY29uZHM7XG4gIGV4cG9ydHMudXRjU2Vjb25kcyA9IHV0Y1NlY29uZHM7XG4gIGV4cG9ydHMudXRjTWludXRlcyA9IHV0Y01pbnV0ZXM7XG4gIGV4cG9ydHMudXRjSG91cnMgPSB1dGNIb3VycztcbiAgZXhwb3J0cy51dGNEYXlzID0gdXRjRGF5cztcbiAgZXhwb3J0cy51dGNTdW5kYXlzID0gdXRjU3VuZGF5cztcbiAgZXhwb3J0cy51dGNNb25kYXlzID0gdXRjTW9uZGF5cztcbiAgZXhwb3J0cy51dGNUdWVzZGF5cyA9IHV0Y1R1ZXNkYXlzO1xuICBleHBvcnRzLnV0Y1dlZG5lc2RheXMgPSB1dGNXZWRuZXNkYXlzO1xuICBleHBvcnRzLnV0Y1RodXJzZGF5cyA9IHV0Y1RodXJzZGF5cztcbiAgZXhwb3J0cy51dGNGcmlkYXlzID0gdXRjRnJpZGF5cztcbiAgZXhwb3J0cy51dGNTYXR1cmRheXMgPSB1dGNTYXR1cmRheXM7XG4gIGV4cG9ydHMudXRjV2Vla3MgPSB1dGNXZWVrcztcbiAgZXhwb3J0cy51dGNNb250aHMgPSB1dGNNb250aHM7XG4gIGV4cG9ydHMudXRjWWVhcnMgPSB1dGNZZWFycztcbiAgZXhwb3J0cy5taWxsaXNlY29uZCA9IG1pbGxpc2Vjb25kO1xuICBleHBvcnRzLnNlY29uZCA9IHNlY29uZDtcbiAgZXhwb3J0cy5taW51dGUgPSBtaW51dGU7XG4gIGV4cG9ydHMuaG91ciA9IGhvdXI7XG4gIGV4cG9ydHMuZGF5ID0gZGF5O1xuICBleHBvcnRzLnN1bmRheSA9IHN1bmRheTtcbiAgZXhwb3J0cy5tb25kYXkgPSBtb25kYXk7XG4gIGV4cG9ydHMudHVlc2RheSA9IHR1ZXNkYXk7XG4gIGV4cG9ydHMud2VkbmVzZGF5ID0gd2VkbmVzZGF5O1xuICBleHBvcnRzLnRodXJzZGF5ID0gdGh1cnNkYXk7XG4gIGV4cG9ydHMuZnJpZGF5ID0gZnJpZGF5O1xuICBleHBvcnRzLnNhdHVyZGF5ID0gc2F0dXJkYXk7XG4gIGV4cG9ydHMud2VlayA9IHN1bmRheTtcbiAgZXhwb3J0cy5tb250aCA9IG1vbnRoO1xuICBleHBvcnRzLnllYXIgPSB5ZWFyO1xuICBleHBvcnRzLnV0Y1NlY29uZCA9IHV0Y1NlY29uZDtcbiAgZXhwb3J0cy51dGNNaW51dGUgPSB1dGNNaW51dGU7XG4gIGV4cG9ydHMudXRjSG91ciA9IHV0Y0hvdXI7XG4gIGV4cG9ydHMudXRjRGF5ID0gdXRjRGF5O1xuICBleHBvcnRzLnV0Y1N1bmRheSA9IHV0Y1N1bmRheTtcbiAgZXhwb3J0cy51dGNNb25kYXkgPSB1dGNNb25kYXk7XG4gIGV4cG9ydHMudXRjVHVlc2RheSA9IHV0Y1R1ZXNkYXk7XG4gIGV4cG9ydHMudXRjV2VkbmVzZGF5ID0gdXRjV2VkbmVzZGF5O1xuICBleHBvcnRzLnV0Y1RodXJzZGF5ID0gdXRjVGh1cnNkYXk7XG4gIGV4cG9ydHMudXRjRnJpZGF5ID0gdXRjRnJpZGF5O1xuICBleHBvcnRzLnV0Y1NhdHVyZGF5ID0gdXRjU2F0dXJkYXk7XG4gIGV4cG9ydHMudXRjV2VlayA9IHV0Y1N1bmRheTtcbiAgZXhwb3J0cy51dGNNb250aCA9IHV0Y01vbnRoO1xuICBleHBvcnRzLnV0Y1llYXIgPSB1dGNZZWFyO1xuICBleHBvcnRzLmludGVydmFsID0gbmV3SW50ZXJ2YWw7XG5cbn0pKTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgICB0aW1lID0gcmVxdWlyZSgnLi4vdGltZScpLFxuICAgIEVQU0lMT04gPSAxZS0xNTtcblxuZnVuY3Rpb24gYmlucyhvcHQpIHtcbiAgaWYgKCFvcHQpIHsgdGhyb3cgRXJyb3IoXCJNaXNzaW5nIGJpbm5pbmcgb3B0aW9ucy5cIik7IH1cblxuICAvLyBkZXRlcm1pbmUgcmFuZ2VcbiAgdmFyIG1heGIgPSBvcHQubWF4YmlucyB8fCAxNSxcbiAgICAgIGJhc2UgPSBvcHQuYmFzZSB8fCAxMCxcbiAgICAgIGxvZ2IgPSBNYXRoLmxvZyhiYXNlKSxcbiAgICAgIGRpdiA9IG9wdC5kaXYgfHwgWzUsIDJdLFxuICAgICAgbWluID0gb3B0Lm1pbixcbiAgICAgIG1heCA9IG9wdC5tYXgsXG4gICAgICBzcGFuID0gbWF4IC0gbWluLFxuICAgICAgc3RlcCwgbGV2ZWwsIG1pbnN0ZXAsIHByZWNpc2lvbiwgdiwgaSwgZXBzO1xuXG4gIGlmIChvcHQuc3RlcCkge1xuICAgIC8vIGlmIHN0ZXAgc2l6ZSBpcyBleHBsaWNpdGx5IGdpdmVuLCB1c2UgdGhhdFxuICAgIHN0ZXAgPSBvcHQuc3RlcDtcbiAgfSBlbHNlIGlmIChvcHQuc3RlcHMpIHtcbiAgICAvLyBpZiBwcm92aWRlZCwgbGltaXQgY2hvaWNlIHRvIGFjY2VwdGFibGUgc3RlcCBzaXplc1xuICAgIHN0ZXAgPSBvcHQuc3RlcHNbTWF0aC5taW4oXG4gICAgICBvcHQuc3RlcHMubGVuZ3RoIC0gMSxcbiAgICAgIGJpc2VjdChvcHQuc3RlcHMsIHNwYW4vbWF4YiwgMCwgb3B0LnN0ZXBzLmxlbmd0aClcbiAgICApXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBlbHNlIHVzZSBzcGFuIHRvIGRldGVybWluZSBzdGVwIHNpemVcbiAgICBsZXZlbCA9IE1hdGguY2VpbChNYXRoLmxvZyhtYXhiKSAvIGxvZ2IpO1xuICAgIG1pbnN0ZXAgPSBvcHQubWluc3RlcCB8fCAwO1xuICAgIHN0ZXAgPSBNYXRoLm1heChcbiAgICAgIG1pbnN0ZXAsXG4gICAgICBNYXRoLnBvdyhiYXNlLCBNYXRoLnJvdW5kKE1hdGgubG9nKHNwYW4pIC8gbG9nYikgLSBsZXZlbClcbiAgICApO1xuXG4gICAgLy8gaW5jcmVhc2Ugc3RlcCBzaXplIGlmIHRvbyBtYW55IGJpbnNcbiAgICB3aGlsZSAoTWF0aC5jZWlsKHNwYW4vc3RlcCkgPiBtYXhiKSB7IHN0ZXAgKj0gYmFzZTsgfVxuXG4gICAgLy8gZGVjcmVhc2Ugc3RlcCBzaXplIGlmIGFsbG93ZWRcbiAgICBmb3IgKGk9MDsgaTxkaXYubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSBzdGVwIC8gZGl2W2ldO1xuICAgICAgaWYgKHYgPj0gbWluc3RlcCAmJiBzcGFuIC8gdiA8PSBtYXhiKSBzdGVwID0gdjtcbiAgICB9XG4gIH1cblxuICAvLyB1cGRhdGUgcHJlY2lzaW9uLCBtaW4gYW5kIG1heFxuICB2ID0gTWF0aC5sb2coc3RlcCk7XG4gIHByZWNpc2lvbiA9IHYgPj0gMCA/IDAgOiB+figtdiAvIGxvZ2IpICsgMTtcbiAgZXBzID0gTWF0aC5wb3coYmFzZSwgLXByZWNpc2lvbiAtIDEpO1xuICBtaW4gPSBNYXRoLm1pbihtaW4sIE1hdGguZmxvb3IobWluIC8gc3RlcCArIGVwcykgKiBzdGVwKTtcbiAgbWF4ID0gTWF0aC5jZWlsKG1heCAvIHN0ZXApICogc3RlcDtcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBtaW4sXG4gICAgc3RvcDogIG1heCxcbiAgICBzdGVwOiAgc3RlcCxcbiAgICB1bml0OiAge3ByZWNpc2lvbjogcHJlY2lzaW9ufSxcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgaW5kZXg6IGluZGV4XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJpc2VjdChhLCB4LCBsbywgaGkpIHtcbiAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICBpZiAodXRpbC5jbXAoYVttaWRdLCB4KSA8IDApIHsgbG8gPSBtaWQgKyAxOyB9XG4gICAgZWxzZSB7IGhpID0gbWlkOyB9XG4gIH1cbiAgcmV0dXJuIGxvO1xufVxuXG5mdW5jdGlvbiB2YWx1ZSh2KSB7XG4gIHJldHVybiB0aGlzLnN0ZXAgKiBNYXRoLmZsb29yKHYgLyB0aGlzLnN0ZXAgKyBFUFNJTE9OKTtcbn1cblxuZnVuY3Rpb24gaW5kZXgodikge1xuICByZXR1cm4gTWF0aC5mbG9vcigodiAtIHRoaXMuc3RhcnQpIC8gdGhpcy5zdGVwICsgRVBTSUxPTik7XG59XG5cbmZ1bmN0aW9uIGRhdGVfdmFsdWUodikge1xuICByZXR1cm4gdGhpcy51bml0LmRhdGUodmFsdWUuY2FsbCh0aGlzLCB2KSk7XG59XG5cbmZ1bmN0aW9uIGRhdGVfaW5kZXgodikge1xuICByZXR1cm4gaW5kZXguY2FsbCh0aGlzLCB0aGlzLnVuaXQudW5pdCh2KSk7XG59XG5cbmJpbnMuZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBpZiAoIW9wdCkgeyB0aHJvdyBFcnJvcihcIk1pc3NpbmcgZGF0ZSBiaW5uaW5nIG9wdGlvbnMuXCIpOyB9XG5cbiAgLy8gZmluZCB0aW1lIHN0ZXAsIHRoZW4gYmluXG4gIHZhciB1bml0cyA9IG9wdC51dGMgPyB0aW1lLnV0YyA6IHRpbWUsXG4gICAgICBkbWluID0gb3B0Lm1pbixcbiAgICAgIGRtYXggPSBvcHQubWF4LFxuICAgICAgbWF4YiA9IG9wdC5tYXhiaW5zIHx8IDIwLFxuICAgICAgbWluYiA9IG9wdC5taW5iaW5zIHx8IDQsXG4gICAgICBzcGFuID0gKCtkbWF4KSAtICgrZG1pbiksXG4gICAgICB1bml0ID0gb3B0LnVuaXQgPyB1bml0c1tvcHQudW5pdF0gOiB1bml0cy5maW5kKHNwYW4sIG1pbmIsIG1heGIpLFxuICAgICAgc3BlYyA9IGJpbnMoe1xuICAgICAgICBtaW46ICAgICB1bml0Lm1pbiAhPSBudWxsID8gdW5pdC5taW4gOiB1bml0LnVuaXQoZG1pbiksXG4gICAgICAgIG1heDogICAgIHVuaXQubWF4ICE9IG51bGwgPyB1bml0Lm1heCA6IHVuaXQudW5pdChkbWF4KSxcbiAgICAgICAgbWF4YmluczogbWF4YixcbiAgICAgICAgbWluc3RlcDogdW5pdC5taW5zdGVwLFxuICAgICAgICBzdGVwczogICB1bml0LnN0ZXBcbiAgICAgIH0pO1xuXG4gIHNwZWMudW5pdCA9IHVuaXQ7XG4gIHNwZWMuaW5kZXggPSBkYXRlX2luZGV4O1xuICBpZiAoIW9wdC5yYXcpIHNwZWMudmFsdWUgPSBkYXRlX3ZhbHVlO1xuICByZXR1cm4gc3BlYztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmlucztcbiIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gICAgZ2VuID0gbW9kdWxlLmV4cG9ydHM7XG5cbmdlbi5yZXBlYXQgPSBmdW5jdGlvbih2YWwsIG4pIHtcbiAgdmFyIGEgPSBBcnJheShuKSwgaTtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSBhW2ldID0gdmFsO1xuICByZXR1cm4gYTtcbn07XG5cbmdlbi56ZXJvcyA9IGZ1bmN0aW9uKG4pIHtcbiAgcmV0dXJuIGdlbi5yZXBlYXQoMCwgbik7XG59O1xuXG5nZW4ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICBzdGVwID0gMTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHN0b3AgPSBzdGFydDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gIH1cbiAgaWYgKChzdG9wIC0gc3RhcnQpIC8gc3RlcCA9PSBJbmZpbml0eSkgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSByYW5nZScpO1xuICB2YXIgcmFuZ2UgPSBbXSwgaSA9IC0xLCBqO1xuICBpZiAoc3RlcCA8IDApIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPiBzdG9wKSByYW5nZS5wdXNoKGopO1xuICBlbHNlIHdoaWxlICgoaiA9IHN0YXJ0ICsgc3RlcCAqICsraSkgPCBzdG9wKSByYW5nZS5wdXNoKGopO1xuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5nZW4ucmFuZG9tID0ge307XG5cbmdlbi5yYW5kb20udW5pZm9ybSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xuICAgIG1heCA9IG1pbiA9PT0gdW5kZWZpbmVkID8gMSA6IG1pbjtcbiAgICBtaW4gPSAwO1xuICB9XG4gIHZhciBkID0gbWF4IC0gbWluO1xuICB2YXIgZiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtaW4gKyBkICogTWF0aC5yYW5kb20oKTtcbiAgfTtcbiAgZi5zYW1wbGVzID0gZnVuY3Rpb24obikge1xuICAgIHJldHVybiBnZW4uemVyb3MobikubWFwKGYpO1xuICB9O1xuICBmLnBkZiA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gKHggPj0gbWluICYmIHggPD0gbWF4KSA/IDEvZCA6IDA7XG4gIH07XG4gIGYuY2RmID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB4IDwgbWluID8gMCA6IHggPiBtYXggPyAxIDogKHggLSBtaW4pIC8gZDtcbiAgfTtcbiAgZi5pY2RmID0gZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAocCA+PSAwICYmIHAgPD0gMSkgPyBtaW4gKyBwKmQgOiBOYU47XG4gIH07XG4gIHJldHVybiBmO1xufTtcblxuZ2VuLnJhbmRvbS5pbnRlZ2VyID0gZnVuY3Rpb24oYSwgYikge1xuICBpZiAoYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYiA9IGE7XG4gICAgYSA9IDA7XG4gIH1cbiAgdmFyIGQgPSBiIC0gYTtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYSArIE1hdGguZmxvb3IoZCAqIE1hdGgucmFuZG9tKCkpO1xuICB9O1xuICBmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7XG4gIH07XG4gIGYucGRmID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiAoeCA9PT0gTWF0aC5mbG9vcih4KSAmJiB4ID49IGEgJiYgeCA8IGIpID8gMS9kIDogMDtcbiAgfTtcbiAgZi5jZGYgPSBmdW5jdGlvbih4KSB7XG4gICAgdmFyIHYgPSBNYXRoLmZsb29yKHgpO1xuICAgIHJldHVybiB2IDwgYSA/IDAgOiB2ID49IGIgPyAxIDogKHYgLSBhICsgMSkgLyBkO1xuICB9O1xuICBmLmljZGYgPSBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuIChwID49IDAgJiYgcCA8PSAxKSA/IGEgLSAxICsgTWF0aC5mbG9vcihwKmQpIDogTmFOO1xuICB9O1xuICByZXR1cm4gZjtcbn07XG5cbmdlbi5yYW5kb20ubm9ybWFsID0gZnVuY3Rpb24obWVhbiwgc3RkZXYpIHtcbiAgbWVhbiA9IG1lYW4gfHwgMDtcbiAgc3RkZXYgPSBzdGRldiB8fCAxO1xuICB2YXIgbmV4dDtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IDAsIHkgPSAwLCByZHMsIGM7XG4gICAgaWYgKG5leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgeCA9IG5leHQ7XG4gICAgICBuZXh0ID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICAgIGRvIHtcbiAgICAgIHggPSBNYXRoLnJhbmRvbSgpKjItMTtcbiAgICAgIHkgPSBNYXRoLnJhbmRvbSgpKjItMTtcbiAgICAgIHJkcyA9IHgqeCArIHkqeTtcbiAgICB9IHdoaWxlIChyZHMgPT09IDAgfHwgcmRzID4gMSk7XG4gICAgYyA9IE1hdGguc3FydCgtMipNYXRoLmxvZyhyZHMpL3Jkcyk7IC8vIEJveC1NdWxsZXIgdHJhbnNmb3JtXG4gICAgbmV4dCA9IG1lYW4gKyB5KmMqc3RkZXY7XG4gICAgcmV0dXJuIG1lYW4gKyB4KmMqc3RkZXY7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTtcbiAgfTtcbiAgZi5wZGYgPSBmdW5jdGlvbih4KSB7XG4gICAgdmFyIGV4cCA9IE1hdGguZXhwKE1hdGgucG93KHgtbWVhbiwgMikgLyAoLTIgKiBNYXRoLnBvdyhzdGRldiwgMikpKTtcbiAgICByZXR1cm4gKDEgLyAoc3RkZXYgKiBNYXRoLnNxcnQoMipNYXRoLlBJKSkpICogZXhwO1xuICB9O1xuICBmLmNkZiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAvLyBBcHByb3hpbWF0aW9uIGZyb20gV2VzdCAoMjAwOSlcbiAgICAvLyBCZXR0ZXIgQXBwcm94aW1hdGlvbnMgdG8gQ3VtdWxhdGl2ZSBOb3JtYWwgRnVuY3Rpb25zXG4gICAgdmFyIGNkLFxuICAgICAgICB6ID0gKHggLSBtZWFuKSAvIHN0ZGV2LFxuICAgICAgICBaID0gTWF0aC5hYnMoeik7XG4gICAgaWYgKFogPiAzNykge1xuICAgICAgY2QgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3VtLCBleHAgPSBNYXRoLmV4cCgtWipaLzIpO1xuICAgICAgaWYgKFogPCA3LjA3MTA2NzgxMTg2NTQ3KSB7XG4gICAgICAgIHN1bSA9IDMuNTI2MjQ5NjU5OTg5MTFlLTAyICogWiArIDAuNzAwMzgzMDY0NDQzNjg4O1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgNi4zNzM5NjIyMDM1MzE2NTtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDMzLjkxMjg2NjA3ODM4MztcbiAgICAgICAgc3VtID0gc3VtICogWiArIDExMi4wNzkyOTE0OTc4NzE7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyAyMjEuMjEzNTk2MTY5OTMxO1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgMjIwLjIwNjg2NzkxMjM3NjtcbiAgICAgICAgY2QgPSBleHAgKiBzdW07XG4gICAgICAgIHN1bSA9IDguODM4ODM0NzY0ODMxODRlLTAyICogWiArIDEuNzU1NjY3MTYzMTgyNjQ7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyAxNi4wNjQxNzc1NzkyMDc7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyA4Ni43ODA3MzIyMDI5NDYxO1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgMjk2LjU2NDI0ODc3OTY3NDtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDYzNy4zMzM2MzMzNzg4MzE7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyA3OTMuODI2NTEyNTE5OTQ4O1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgNDQwLjQxMzczNTgyNDc1MjtcbiAgICAgICAgY2QgPSBjZCAvIHN1bTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1bSA9IFogKyAwLjY1O1xuICAgICAgICBzdW0gPSBaICsgNCAvIHN1bTtcbiAgICAgICAgc3VtID0gWiArIDMgLyBzdW07XG4gICAgICAgIHN1bSA9IFogKyAyIC8gc3VtO1xuICAgICAgICBzdW0gPSBaICsgMSAvIHN1bTtcbiAgICAgICAgY2QgPSBleHAgLyBzdW0gLyAyLjUwNjYyODI3NDYzMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHogPiAwID8gMSAtIGNkIDogY2Q7XG4gIH07XG4gIGYuaWNkZiA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBBcHByb3hpbWF0aW9uIG9mIFByb2JpdCBmdW5jdGlvbiB1c2luZyBpbnZlcnNlIGVycm9yIGZ1bmN0aW9uLlxuICAgIGlmIChwIDw9IDAgfHwgcCA+PSAxKSByZXR1cm4gTmFOO1xuICAgIHZhciB4ID0gMipwIC0gMSxcbiAgICAgICAgdiA9ICg4ICogKE1hdGguUEkgLSAzKSkgLyAoMyAqIE1hdGguUEkgKiAoNC1NYXRoLlBJKSksXG4gICAgICAgIGEgPSAoMiAvIChNYXRoLlBJKnYpKSArIChNYXRoLmxvZygxIC0gTWF0aC5wb3coeCwyKSkgLyAyKSxcbiAgICAgICAgYiA9IE1hdGgubG9nKDEgLSAoeCp4KSkgLyB2LFxuICAgICAgICBzID0gKHggPiAwID8gMSA6IC0xKSAqIE1hdGguc3FydChNYXRoLnNxcnQoKGEqYSkgLSBiKSAtIGEpO1xuICAgIHJldHVybiBtZWFuICsgc3RkZXYgKiBNYXRoLlNRUlQyICogcztcbiAgfTtcbiAgcmV0dXJuIGY7XG59O1xuXG5nZW4ucmFuZG9tLmJvb3RzdHJhcCA9IGZ1bmN0aW9uKGRvbWFpbiwgc21vb3RoKSB7XG4gIC8vIEdlbmVyYXRlcyBhIGJvb3RzdHJhcCBzYW1wbGUgZnJvbSBhIHNldCBvZiBvYnNlcnZhdGlvbnMuXG4gIC8vIFNtb290aCBib290c3RyYXBwaW5nIGFkZHMgcmFuZG9tIHplcm8tY2VudGVyZWQgbm9pc2UgdG8gdGhlIHNhbXBsZXMuXG4gIHZhciB2YWwgPSBkb21haW4uZmlsdGVyKHV0aWwuaXNWYWxpZCksXG4gICAgICBsZW4gPSB2YWwubGVuZ3RoLFxuICAgICAgZXJyID0gc21vb3RoID8gZ2VuLnJhbmRvbS5ub3JtYWwoMCwgc21vb3RoKSA6IG51bGw7XG4gIHZhciBmID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbFt+fihNYXRoLnJhbmRvbSgpKmxlbildICsgKGVyciA/IGVycigpIDogMCk7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTtcbiAgfTtcbiAgcmV0dXJuIGY7XG59OyIsInZhciBkM190aW1lID0gcmVxdWlyZSgnZDMtdGltZScpO1xuXG52YXIgdGVtcERhdGUgPSBuZXcgRGF0ZSgpLFxuICAgIGJhc2VEYXRlID0gbmV3IERhdGUoMCwgMCwgMSkuc2V0RnVsbFllYXIoMCksIC8vIEphbiAxLCAwIEFEXG4gICAgdXRjQmFzZURhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQygwLCAwLCAxKSkuc2V0VVRDRnVsbFllYXIoMCk7XG5cbmZ1bmN0aW9uIGRhdGUoZCkge1xuICByZXR1cm4gKHRlbXBEYXRlLnNldFRpbWUoK2QpLCB0ZW1wRGF0ZSk7XG59XG5cbi8vIGNyZWF0ZSBhIHRpbWUgdW5pdCBlbnRyeVxuZnVuY3Rpb24gZW50cnkodHlwZSwgZGF0ZSwgdW5pdCwgc3RlcCwgbWluLCBtYXgpIHtcbiAgdmFyIGUgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRlOiBkYXRlLFxuICAgIHVuaXQ6IHVuaXRcbiAgfTtcbiAgaWYgKHN0ZXApIHtcbiAgICBlLnN0ZXAgPSBzdGVwO1xuICB9IGVsc2Uge1xuICAgIGUubWluc3RlcCA9IDE7XG4gIH1cbiAgaWYgKG1pbiAhPSBudWxsKSBlLm1pbiA9IG1pbjtcbiAgaWYgKG1heCAhPSBudWxsKSBlLm1heCA9IG1heDtcbiAgcmV0dXJuIGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSh0eXBlLCB1bml0LCBiYXNlLCBzdGVwLCBtaW4sIG1heCkge1xuICByZXR1cm4gZW50cnkodHlwZSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiB1bml0Lm9mZnNldChiYXNlLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiB1bml0LmNvdW50KGJhc2UsIGQpOyB9LFxuICAgIHN0ZXAsIG1pbiwgbWF4KTtcbn1cblxudmFyIGxvY2FsZSA9IFtcbiAgY3JlYXRlKCdzZWNvbmQnLCBkM190aW1lLnNlY29uZCwgYmFzZURhdGUpLFxuICBjcmVhdGUoJ21pbnV0ZScsIGQzX3RpbWUubWludXRlLCBiYXNlRGF0ZSksXG4gIGNyZWF0ZSgnaG91cicsICAgZDNfdGltZS5ob3VyLCAgIGJhc2VEYXRlKSxcbiAgY3JlYXRlKCdkYXknLCAgICBkM190aW1lLmRheSwgICAgYmFzZURhdGUsIFsxLCA3XSksXG4gIGNyZWF0ZSgnbW9udGgnLCAgZDNfdGltZS5tb250aCwgIGJhc2VEYXRlLCBbMSwgMywgNl0pLFxuICBjcmVhdGUoJ3llYXInLCAgIGQzX3RpbWUueWVhciwgICBiYXNlRGF0ZSksXG5cbiAgLy8gcGVyaW9kaWMgdW5pdHNcbiAgZW50cnkoJ3NlY29uZHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDEsIDAsIDAsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0U2Vjb25kcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdtaW51dGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCAxLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldE1pbnV0ZXMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnaG91cnMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDEsIGQpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0SG91cnMoKTsgfSxcbiAgICBudWxsLCAwLCAyM1xuICApLFxuICBlbnRyeSgnd2Vla2RheXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIDAsIDQrZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXREYXkoKTsgfSxcbiAgICBbMV0sIDAsIDZcbiAgKSxcbiAgZW50cnkoJ2RhdGVzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldERhdGUoKTsgfSxcbiAgICBbMV0sIDEsIDMxXG4gICksXG4gIGVudHJ5KCdtb250aHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKDE5NzAsIGQgJSAxMiwgMSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRNb250aCgpOyB9LFxuICAgIFsxXSwgMCwgMTFcbiAgKVxuXTtcblxudmFyIHV0YyA9IFtcbiAgY3JlYXRlKCdzZWNvbmQnLCBkM190aW1lLnV0Y1NlY29uZCwgdXRjQmFzZURhdGUpLFxuICBjcmVhdGUoJ21pbnV0ZScsIGQzX3RpbWUudXRjTWludXRlLCB1dGNCYXNlRGF0ZSksXG4gIGNyZWF0ZSgnaG91cicsICAgZDNfdGltZS51dGNIb3VyLCAgIHV0Y0Jhc2VEYXRlKSxcbiAgY3JlYXRlKCdkYXknLCAgICBkM190aW1lLnV0Y0RheSwgICAgdXRjQmFzZURhdGUsIFsxLCA3XSksXG4gIGNyZWF0ZSgnbW9udGgnLCAgZDNfdGltZS51dGNNb250aCwgIHV0Y0Jhc2VEYXRlLCBbMSwgMywgNl0pLFxuICBjcmVhdGUoJ3llYXInLCAgIGQzX3RpbWUudXRjWWVhciwgICB1dGNCYXNlRGF0ZSksXG5cbiAgLy8gcGVyaW9kaWMgdW5pdHNcbiAgZW50cnkoJ3NlY29uZHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDEsIDAsIDAsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ1NlY29uZHMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnbWludXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgMCwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDTWludXRlcygpOyB9LFxuICAgIG51bGwsIDAsIDU5XG4gICksXG4gIGVudHJ5KCdob3VycycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgMSwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDSG91cnMoKTsgfSxcbiAgICBudWxsLCAwLCAyM1xuICApLFxuICBlbnRyeSgnd2Vla2RheXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDQrZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDRGF5KCk7IH0sXG4gICAgWzFdLCAwLCA2XG4gICksXG4gIGVudHJ5KCdkYXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgZCkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDRGF0ZSgpOyB9LFxuICAgIFsxXSwgMSwgMzFcbiAgKSxcbiAgZW50cnkoJ21vbnRocycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgZCAlIDEyLCAxKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENNb250aCgpOyB9LFxuICAgIFsxXSwgMCwgMTFcbiAgKVxuXTtcblxudmFyIFNURVBTID0gW1xuICBbMzE1MzZlNiwgNV0sICAvLyAxLXllYXJcbiAgWzc3NzZlNiwgNF0sICAgLy8gMy1tb250aFxuICBbMjU5MmU2LCA0XSwgICAvLyAxLW1vbnRoXG4gIFsxMjA5NmU1LCAzXSwgIC8vIDItd2Vla1xuICBbNjA0OGU1LCAzXSwgICAvLyAxLXdlZWtcbiAgWzE3MjhlNSwgM10sICAgLy8gMi1kYXlcbiAgWzg2NGU1LCAzXSwgICAgLy8gMS1kYXlcbiAgWzQzMmU1LCAyXSwgICAgLy8gMTItaG91clxuICBbMjE2ZTUsIDJdLCAgICAvLyA2LWhvdXJcbiAgWzEwOGU1LCAyXSwgICAgLy8gMy1ob3VyXG4gIFszNmU1LCAyXSwgICAgIC8vIDEtaG91clxuICBbMThlNSwgMV0sICAgICAvLyAzMC1taW51dGVcbiAgWzllNSwgMV0sICAgICAgLy8gMTUtbWludXRlXG4gIFszZTUsIDFdLCAgICAgIC8vIDUtbWludXRlXG4gIFs2ZTQsIDFdLCAgICAgIC8vIDEtbWludXRlXG4gIFszZTQsIDBdLCAgICAgIC8vIDMwLXNlY29uZFxuICBbMTVlMywgMF0sICAgICAvLyAxNS1zZWNvbmRcbiAgWzVlMywgMF0sICAgICAgLy8gNS1zZWNvbmRcbiAgWzFlMywgMF0gICAgICAgLy8gMS1zZWNvbmRcbl07XG5cbmZ1bmN0aW9uIGZpbmQodW5pdHMsIHNwYW4sIG1pbmIsIG1heGIpIHtcbiAgdmFyIHN0ZXAgPSBTVEVQU1swXSwgaSwgbiwgYmlucztcblxuICBmb3IgKGk9MSwgbj1TVEVQUy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgc3RlcCA9IFNURVBTW2ldO1xuICAgIGlmIChzcGFuID4gc3RlcFswXSkge1xuICAgICAgYmlucyA9IHNwYW4gLyBzdGVwWzBdO1xuICAgICAgaWYgKGJpbnMgPiBtYXhiKSB7XG4gICAgICAgIHJldHVybiB1bml0c1tTVEVQU1tpLTFdWzFdXTtcbiAgICAgIH1cbiAgICAgIGlmIChiaW5zID49IG1pbmIpIHtcbiAgICAgICAgcmV0dXJuIHVuaXRzW3N0ZXBbMV1dO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdW5pdHNbU1RFUFNbbi0xXVsxXV07XG59XG5cbmZ1bmN0aW9uIHRvVW5pdE1hcCh1bml0cykge1xuICB2YXIgbWFwID0ge30sIGksIG47XG4gIGZvciAoaT0wLCBuPXVuaXRzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICBtYXBbdW5pdHNbaV0udHlwZV0gPSB1bml0c1tpXTtcbiAgfVxuICBtYXAuZmluZCA9IGZ1bmN0aW9uKHNwYW4sIG1pbmIsIG1heGIpIHtcbiAgICByZXR1cm4gZmluZCh1bml0cywgc3BhbiwgbWluYiwgbWF4Yik7XG4gIH07XG4gIHJldHVybiBtYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Vbml0TWFwKGxvY2FsZSk7XG5tb2R1bGUuZXhwb3J0cy51dGMgPSB0b1VuaXRNYXAodXRjKTsiLCJ2YXIgdSA9IG1vZHVsZS5leHBvcnRzO1xuXG4vLyB1dGlsaXR5IGZ1bmN0aW9uc1xuXG52YXIgRk5BTUUgPSAnX19uYW1lX18nO1xuXG51Lm5hbWVkZnVuYyA9IGZ1bmN0aW9uKG5hbWUsIGYpIHsgcmV0dXJuIChmW0ZOQU1FXSA9IG5hbWUsIGYpOyB9O1xuXG51Lm5hbWUgPSBmdW5jdGlvbihmKSB7IHJldHVybiBmPT1udWxsID8gbnVsbCA6IGZbRk5BTUVdOyB9O1xuXG51LmlkZW50aXR5ID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geDsgfTtcblxudS50cnVlID0gdS5uYW1lZGZ1bmMoJ3RydWUnLCBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWU7IH0pO1xuXG51LmZhbHNlID0gdS5uYW1lZGZ1bmMoJ2ZhbHNlJywgZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZTsgfSk7XG5cbnUuZHVwbGljYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufTtcblxudS5lcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGEpID09PSBKU09OLnN0cmluZ2lmeShiKTtcbn07XG5cbnUuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gIGZvciAodmFyIHgsIG5hbWUsIGk9MSwgbGVuPWFyZ3VtZW50cy5sZW5ndGg7IGk8bGVuOyArK2kpIHtcbiAgICB4ID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAobmFtZSBpbiB4KSB7IG9ialtuYW1lXSA9IHhbbmFtZV07IH1cbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxudS5sZW5ndGggPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4ICE9IG51bGwgJiYgeC5sZW5ndGggIT0gbnVsbCA/IHgubGVuZ3RoIDogbnVsbDtcbn07XG5cbnUua2V5cyA9IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIGtleXMgPSBbXSwgaztcbiAgZm9yIChrIGluIHgpIGtleXMucHVzaChrKTtcbiAgcmV0dXJuIGtleXM7XG59O1xuXG51LnZhbHMgPSBmdW5jdGlvbih4KSB7XG4gIHZhciB2YWxzID0gW10sIGs7XG4gIGZvciAoayBpbiB4KSB2YWxzLnB1c2goeFtrXSk7XG4gIHJldHVybiB2YWxzO1xufTtcblxudS50b01hcCA9IGZ1bmN0aW9uKGxpc3QsIGYpIHtcbiAgcmV0dXJuIChmID0gdS4kKGYpKSA/XG4gICAgbGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCB4KSB7IHJldHVybiAob2JqW2YoeCldID0gMSwgb2JqKTsgfSwge30pIDpcbiAgICBsaXN0LnJlZHVjZShmdW5jdGlvbihvYmosIHgpIHsgcmV0dXJuIChvYmpbeF0gPSAxLCBvYmopOyB9LCB7fSk7XG59O1xuXG51LmtleXN0ciA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICAvLyB1c2UgdG8gZW5zdXJlIGNvbnNpc3RlbnQga2V5IGdlbmVyYXRpb24gYWNyb3NzIG1vZHVsZXNcbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICBpZiAoIW4pIHJldHVybiAnJztcbiAgZm9yICh2YXIgcz1TdHJpbmcodmFsdWVzWzBdKSwgaT0xOyBpPG47ICsraSkge1xuICAgIHMgKz0gJ3wnICsgU3RyaW5nKHZhbHVlc1tpXSk7XG4gIH1cbiAgcmV0dXJuIHM7XG59O1xuXG4vLyB0eXBlIGNoZWNraW5nIGZ1bmN0aW9uc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG51LmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xufTtcblxudS5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59O1xuXG51LmlzU3RyaW5nID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG59O1xuXG51LmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudS5pc051bWJlciA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBOdW1iZXJdJztcbn07XG5cbnUuaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufTtcblxudS5pc0RhdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufTtcblxudS5pc1ZhbGlkID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiBvYmogPT09IG9iajtcbn07XG5cbnUuaXNCdWZmZXIgPSAodHlwZW9mIEJ1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBCdWZmZXIuaXNCdWZmZXIpIHx8IHUuZmFsc2U7XG5cbi8vIHR5cGUgY29lcmNpb24gZnVuY3Rpb25zXG5cbnUubnVtYmVyID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gcyA9PSBudWxsIHx8IHMgPT09ICcnID8gbnVsbCA6ICtzO1xufTtcblxudS5ib29sZWFuID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gcyA9PSBudWxsIHx8IHMgPT09ICcnID8gbnVsbCA6IHM9PT0nZmFsc2UnID8gZmFsc2UgOiAhIXM7XG59O1xuXG4vLyBwYXJzZSBhIGRhdGUgd2l0aCBvcHRpb25hbCBkMy50aW1lLWZvcm1hdCBmb3JtYXRcbnUuZGF0ZSA9IGZ1bmN0aW9uKHMsIGZvcm1hdCkge1xuICB2YXIgZCA9IGZvcm1hdCA/IGZvcm1hdCA6IERhdGU7XG4gIHJldHVybiBzID09IG51bGwgfHwgcyA9PT0gJycgPyBudWxsIDogZC5wYXJzZShzKTtcbn07XG5cbnUuYXJyYXkgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4ICE9IG51bGwgPyAodS5pc0FycmF5KHgpID8geCA6IFt4XSkgOiBbXTtcbn07XG5cbnUuc3RyID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gdS5pc0FycmF5KHgpID8gJ1snICsgeC5tYXAodS5zdHIpICsgJ10nXG4gICAgOiB1LmlzT2JqZWN0KHgpID8gSlNPTi5zdHJpbmdpZnkoeClcbiAgICA6IHUuaXNTdHJpbmcoeCkgPyAoJ1xcJycrdXRpbF9lc2NhcGVfc3RyKHgpKydcXCcnKSA6IHg7XG59O1xuXG52YXIgZXNjYXBlX3N0cl9yZSA9IC8oXnxbXlxcXFxdKScvZztcblxuZnVuY3Rpb24gdXRpbF9lc2NhcGVfc3RyKHgpIHtcbiAgcmV0dXJuIHgucmVwbGFjZShlc2NhcGVfc3RyX3JlLCAnJDFcXFxcXFwnJyk7XG59XG5cbi8vIGRhdGEgYWNjZXNzIGZ1bmN0aW9uc1xuXG52YXIgZmllbGRfcmUgPSAvXFxbKC4qPylcXF18W14uXFxbXSsvZztcblxudS5maWVsZCA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIFN0cmluZyhmKS5tYXRjaChmaWVsZF9yZSkubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gZFswXSAhPT0gJ1snID8gZCA6XG4gICAgICBkWzFdICE9PSBcIidcIiAmJiBkWzFdICE9PSAnXCInID8gZC5zbGljZSgxLCAtMSkgOlxuICAgICAgZC5zbGljZSgyLCAtMikucmVwbGFjZSgvXFxcXChbXCInXSkvZywgJyQxJyk7XG4gIH0pO1xufTtcblxudS5hY2Nlc3NvciA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIHM7XG4gIHJldHVybiBmPT1udWxsIHx8IHUuaXNGdW5jdGlvbihmKSA/IGYgOlxuICAgIHUubmFtZWRmdW5jKGYsIChzID0gdS5maWVsZChmKSkubGVuZ3RoID4gMSA/XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiBzLnJlZHVjZShmdW5jdGlvbih4LGYpIHsgcmV0dXJuIHhbZl07IH0sIHgpOyB9IDpcbiAgICAgIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHhbZl07IH1cbiAgICApO1xufTtcblxuLy8gc2hvcnQtY3V0IGZvciBhY2Nlc3NvclxudS4kID0gdS5hY2Nlc3NvcjtcblxudS5tdXRhdG9yID0gZnVuY3Rpb24oZikge1xuICB2YXIgcztcbiAgcmV0dXJuIHUuaXNTdHJpbmcoZikgJiYgKHM9dS5maWVsZChmKSkubGVuZ3RoID4gMSA/XG4gICAgZnVuY3Rpb24oeCwgdikge1xuICAgICAgZm9yICh2YXIgaT0wOyBpPHMubGVuZ3RoLTE7ICsraSkgeCA9IHhbc1tpXV07XG4gICAgICB4W3NbaV1dID0gdjtcbiAgICB9IDpcbiAgICBmdW5jdGlvbih4LCB2KSB7IHhbZl0gPSB2OyB9O1xufTtcblxuXG51LiRmdW5jID0gZnVuY3Rpb24obmFtZSwgb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGYpIHtcbiAgICBmID0gdS4kKGYpIHx8IHUuaWRlbnRpdHk7XG4gICAgdmFyIG4gPSBuYW1lICsgKHUubmFtZShmKSA/ICdfJyt1Lm5hbWUoZikgOiAnJyk7XG4gICAgcmV0dXJuIHUubmFtZWRmdW5jKG4sIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG9wKGYoZCkpOyB9KTtcbiAgfTtcbn07XG5cbnUuJHZhbGlkICA9IHUuJGZ1bmMoJ3ZhbGlkJywgdS5pc1ZhbGlkKTtcbnUuJGxlbmd0aCA9IHUuJGZ1bmMoJ2xlbmd0aCcsIHUubGVuZ3RoKTtcblxudS4kaW4gPSBmdW5jdGlvbihmLCB2YWx1ZXMpIHtcbiAgZiA9IHUuJChmKTtcbiAgdmFyIG1hcCA9IHUuaXNBcnJheSh2YWx1ZXMpID8gdS50b01hcCh2YWx1ZXMpIDogdmFsdWVzO1xuICByZXR1cm4gZnVuY3Rpb24oZCkgeyByZXR1cm4gISFtYXBbZihkKV07IH07XG59O1xuXG4vLyBjb21wYXJpc29uIC8gc29ydGluZyBmdW5jdGlvbnNcblxudS5jb21wYXJhdG9yID0gZnVuY3Rpb24oc29ydCkge1xuICB2YXIgc2lnbiA9IFtdO1xuICBpZiAoc29ydCA9PT0gdW5kZWZpbmVkKSBzb3J0ID0gW107XG4gIHNvcnQgPSB1LmFycmF5KHNvcnQpLm1hcChmdW5jdGlvbihmKSB7XG4gICAgdmFyIHMgPSAxO1xuICAgIGlmICAgICAgKGZbMF0gPT09ICctJykgeyBzID0gLTE7IGYgPSBmLnNsaWNlKDEpOyB9XG4gICAgZWxzZSBpZiAoZlswXSA9PT0gJysnKSB7IHMgPSArMTsgZiA9IGYuc2xpY2UoMSk7IH1cbiAgICBzaWduLnB1c2gocyk7XG4gICAgcmV0dXJuIHUuYWNjZXNzb3IoZik7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oYSxiKSB7XG4gICAgdmFyIGksIG4sIGYsIHgsIHk7XG4gICAgZm9yIChpPTAsIG49c29ydC5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgICBmID0gc29ydFtpXTsgeCA9IGYoYSk7IHkgPSBmKGIpO1xuICAgICAgaWYgKHggPCB5KSByZXR1cm4gLTEgKiBzaWduW2ldO1xuICAgICAgaWYgKHggPiB5KSByZXR1cm4gc2lnbltpXTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH07XG59O1xuXG51LmNtcCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGEgPiBiKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSBpZiAoYSA+PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAoYSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmIChiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIE5hTjtcbn07XG5cbnUubnVtY21wID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYSAtIGI7IH07XG5cbnUuc3RhYmxlc29ydCA9IGZ1bmN0aW9uKGFycmF5LCBzb3J0QnksIGtleUZuKSB7XG4gIHZhciBpbmRpY2VzID0gYXJyYXkucmVkdWNlKGZ1bmN0aW9uKGlkeCwgdiwgaSkge1xuICAgIHJldHVybiAoaWR4W2tleUZuKHYpXSA9IGksIGlkeCk7XG4gIH0sIHt9KTtcblxuICBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgc2EgPSBzb3J0QnkoYSksXG4gICAgICAgIHNiID0gc29ydEJ5KGIpO1xuICAgIHJldHVybiBzYSA8IHNiID8gLTEgOiBzYSA+IHNiID8gMVxuICAgICAgICAgOiAoaW5kaWNlc1trZXlGbihhKV0gLSBpbmRpY2VzW2tleUZuKGIpXSk7XG4gIH0pO1xuXG4gIHJldHVybiBhcnJheTtcbn07XG5cblxuLy8gc3RyaW5nIGZ1bmN0aW9uc1xuXG51LnBhZCA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCBwYWRjaGFyKSB7XG4gIHBhZGNoYXIgPSBwYWRjaGFyIHx8IFwiIFwiO1xuICB2YXIgZCA9IGxlbmd0aCAtIHMubGVuZ3RoO1xuICBpZiAoZCA8PSAwKSByZXR1cm4gcztcbiAgc3dpdGNoIChwb3MpIHtcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIHJldHVybiBzdHJyZXAoZCwgcGFkY2hhcikgKyBzO1xuICAgIGNhc2UgJ21pZGRsZSc6XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIHJldHVybiBzdHJyZXAoTWF0aC5mbG9vcihkLzIpLCBwYWRjaGFyKSArXG4gICAgICAgICBzICsgc3RycmVwKE1hdGguY2VpbChkLzIpLCBwYWRjaGFyKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHMgKyBzdHJyZXAoZCwgcGFkY2hhcik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHN0cnJlcChuLCBzdHIpIHtcbiAgdmFyIHMgPSBcIlwiLCBpO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHMgKz0gc3RyO1xuICByZXR1cm4gcztcbn1cblxudS50cnVuY2F0ZSA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCB3b3JkLCBlbGxpcHNpcykge1xuICB2YXIgbGVuID0gcy5sZW5ndGg7XG4gIGlmIChsZW4gPD0gbGVuZ3RoKSByZXR1cm4gcztcbiAgZWxsaXBzaXMgPSBlbGxpcHNpcyAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKGVsbGlwc2lzKSA6ICdcXHUyMDI2JztcbiAgdmFyIGwgPSBNYXRoLm1heCgwLCBsZW5ndGggLSBlbGxpcHNpcy5sZW5ndGgpO1xuXG4gIHN3aXRjaCAocG9zKSB7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICByZXR1cm4gZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbCwxKSA6IHMuc2xpY2UobGVuLWwpKTtcbiAgICBjYXNlICdtaWRkbGUnOlxuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICB2YXIgbDEgPSBNYXRoLmNlaWwobC8yKSwgbDIgPSBNYXRoLmZsb29yKGwvMik7XG4gICAgICByZXR1cm4gKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwxKSA6IHMuc2xpY2UoMCxsMSkpICtcbiAgICAgICAgZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbDIsMSkgOiBzLnNsaWNlKGxlbi1sMikpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwpIDogcy5zbGljZSgwLGwpKSArIGVsbGlwc2lzO1xuICB9XG59O1xuXG5mdW5jdGlvbiB0cnVuY2F0ZU9uV29yZChzLCBsZW4sIHJldikge1xuICB2YXIgY250ID0gMCwgdG9rID0gcy5zcGxpdCh0cnVuY2F0ZV93b3JkX3JlKTtcbiAgaWYgKHJldikge1xuICAgIHMgPSAodG9rID0gdG9rLnJldmVyc2UoKSlcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24odykgeyBjbnQgKz0gdy5sZW5ndGg7IHJldHVybiBjbnQgPD0gbGVuOyB9KVxuICAgICAgLnJldmVyc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBzID0gdG9rLmZpbHRlcihmdW5jdGlvbih3KSB7IGNudCArPSB3Lmxlbmd0aDsgcmV0dXJuIGNudCA8PSBsZW47IH0pO1xuICB9XG4gIHJldHVybiBzLmxlbmd0aCA/IHMuam9pbignJykudHJpbSgpIDogdG9rWzBdLnNsaWNlKDAsIGxlbik7XG59XG5cbnZhciB0cnVuY2F0ZV93b3JkX3JlID0gLyhbXFx1MDAwOVxcdTAwMEFcXHUwMDBCXFx1MDAwQ1xcdTAwMERcXHUwMDIwXFx1MDBBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTIwMjhcXHUyMDI5XFx1MzAwMFxcdUZFRkZdKS87XG4iLCIiLCJleHBvcnQgY29uc3QgQUdHUkVHQVRFX09QUyA9IFtcbiAgJ3ZhbHVlcycsICdjb3VudCcsICd2YWxpZCcsICdtaXNzaW5nJywgJ2Rpc3RpbmN0JyxcbiAgJ3N1bScsICdtZWFuJywgJ2F2ZXJhZ2UnLCAndmFyaWFuY2UnLCAndmFyaWFuY2VwJywgJ3N0ZGV2JyxcbiAgJ3N0ZGV2cCcsICdtZWRpYW4nLCAncTEnLCAncTMnLCAnbW9kZXNrZXcnLCAnbWluJywgJ21heCcsXG4gICdhcmdtaW4nLCAnYXJnbWF4J1xuXTtcblxuZXhwb3J0IGNvbnN0IFNIQVJFRF9ET01BSU5fT1BTID0gW1xuICAnbWVhbicsICdhdmVyYWdlJywgJ3N0ZGV2JywgJ3N0ZGV2cCcsICdtZWRpYW4nLCAncTEnLCAncTMnLCAnbWluJywgJ21heCdcbl07XG5cbi8vIFRPRE86IG1vdmUgc3VwcG9ydGVkVHlwZXMsIHN1cHBvcnRlZEVudW1zIGZyb20gc2NoZW1hIHRvIGhlcmVcbiIsImltcG9ydCB7Q2hhbm5lbCwgUk9XLCBDT0xVTU4sIFNIQVBFLCBTSVpFfSBmcm9tICcuL2NoYW5uZWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXV0b01heEJpbnMoY2hhbm5lbDogQ2hhbm5lbCk6IG51bWJlciB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MVU1OOlxuICAgIGNhc2UgU0laRTpcbiAgICAgIC8vIEZhY2V0cyBhbmQgU2l6ZSBzaG91bGRuJ3QgaGF2ZSB0b28gbWFueSBiaW5zXG4gICAgICAvLyBXZSBjaG9vc2UgNiBsaWtlIHNoYXBlIHRvIHNpbXBsaWZ5IHRoZSBydWxlXG4gICAgY2FzZSBTSEFQRTpcbiAgICAgIHJldHVybiA2OyAvLyBWZWdhJ3MgXCJzaGFwZVwiIGhhcyA2IGRpc3RpbmN0IHZhbHVlc1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gMTA7XG4gIH1cbn1cbiIsIi8qXG4gKiBDb25zdGFudHMgYW5kIHV0aWxpdGllcyBmb3IgZW5jb2RpbmcgY2hhbm5lbHMgKFZpc3VhbCB2YXJpYWJsZXMpXG4gKiBzdWNoIGFzICd4JywgJ3knLCAnY29sb3InLlxuICovXG5cbmltcG9ydCB7TWFya30gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBlbnVtIENoYW5uZWwge1xuICBYID0gJ3gnIGFzIGFueSxcbiAgWSA9ICd5JyBhcyBhbnksXG4gIFJPVyA9ICdyb3cnIGFzIGFueSxcbiAgQ09MVU1OID0gJ2NvbHVtbicgYXMgYW55LFxuICBTSEFQRSA9ICdzaGFwZScgYXMgYW55LFxuICBTSVpFID0gJ3NpemUnIGFzIGFueSxcbiAgQ09MT1IgPSAnY29sb3InIGFzIGFueSxcbiAgVEVYVCA9ICd0ZXh0JyBhcyBhbnksXG4gIERFVEFJTCA9ICdkZXRhaWwnIGFzIGFueSxcbiAgTEFCRUwgPSAnbGFiZWwnIGFzIGFueSxcbiAgUEFUSCA9ICdwYXRoJyBhcyBhbnksXG4gIE9SREVSID0gJ29yZGVyJyBhcyBhbnlcbn1cblxuZXhwb3J0IGNvbnN0IFggPSBDaGFubmVsLlg7XG5leHBvcnQgY29uc3QgWSA9IENoYW5uZWwuWTtcbmV4cG9ydCBjb25zdCBST1cgPSBDaGFubmVsLlJPVztcbmV4cG9ydCBjb25zdCBDT0xVTU4gPSBDaGFubmVsLkNPTFVNTjtcbmV4cG9ydCBjb25zdCBTSEFQRSA9IENoYW5uZWwuU0hBUEU7XG5leHBvcnQgY29uc3QgU0laRSA9IENoYW5uZWwuU0laRTtcbmV4cG9ydCBjb25zdCBDT0xPUiA9IENoYW5uZWwuQ09MT1I7XG5leHBvcnQgY29uc3QgVEVYVCA9IENoYW5uZWwuVEVYVDtcbmV4cG9ydCBjb25zdCBERVRBSUwgPSBDaGFubmVsLkRFVEFJTDtcbmV4cG9ydCBjb25zdCBMQUJFTCA9IENoYW5uZWwuTEFCRUw7XG5leHBvcnQgY29uc3QgUEFUSCA9IENoYW5uZWwuUEFUSDtcbmV4cG9ydCBjb25zdCBPUkRFUiA9IENoYW5uZWwuT1JERVI7XG5cbmV4cG9ydCBjb25zdCBDSEFOTkVMUyA9IFtYLCBZLCBST1csIENPTFVNTiwgU0laRSwgU0hBUEUsIENPTE9SLCBQQVRILCBPUkRFUiwgVEVYVCwgREVUQUlMLCBMQUJFTF07XG5cbmludGVyZmFjZSBTdXBwb3J0ZWRNYXJrIHtcbiAgcG9pbnQ/OiBib29sZWFuO1xuICB0aWNrPzogYm9vbGVhbjtcbiAgY2lyY2xlPzogYm9vbGVhbjtcbiAgc3F1YXJlPzogYm9vbGVhbjtcbiAgYmFyPzogYm9vbGVhbjtcbiAgbGluZT86IGJvb2xlYW47XG4gIGFyZWE/OiBib29sZWFuO1xuICB0ZXh0PzogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogUmV0dXJuIHdoZXRoZXIgYSBjaGFubmVsIHN1cHBvcnRzIGEgcGFydGljdWxhciBtYXJrIHR5cGUuXG4gKiBAcGFyYW0gY2hhbm5lbCAgY2hhbm5lbCBuYW1lXG4gKiBAcGFyYW0gbWFyayB0aGUgbWFyayB0eXBlXG4gKiBAcmV0dXJuIHdoZXRoZXIgdGhlIG1hcmsgc3VwcG9ydHMgdGhlIGNoYW5uZWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1cHBvcnRNYXJrKGNoYW5uZWw6IENoYW5uZWwsIG1hcms6IE1hcmspIHtcbiAgcmV0dXJuICEhZ2V0U3VwcG9ydGVkTWFyayhjaGFubmVsKVttYXJrXTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBkaWN0aW9uYXJ5IHNob3dpbmcgd2hldGhlciBhIGNoYW5uZWwgc3VwcG9ydHMgbWFyayB0eXBlLlxuICogQHBhcmFtIGNoYW5uZWxcbiAqIEByZXR1cm4gQSBkaWN0aW9uYXJ5IG1hcHBpbmcgbWFyayB0eXBlcyB0byBib29sZWFuIHZhbHVlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN1cHBvcnRlZE1hcmsoY2hhbm5lbDogQ2hhbm5lbCk6IFN1cHBvcnRlZE1hcmsge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFg6XG4gICAgY2FzZSBZOlxuICAgIGNhc2UgQ09MT1I6XG4gICAgY2FzZSBERVRBSUw6XG4gICAgY2FzZSBPUkRFUjpcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTFVNTjpcbiAgICAgIHJldHVybiB7IC8vIGFsbCBtYXJrc1xuICAgICAgICBwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsXG4gICAgICAgIGJhcjogdHJ1ZSwgbGluZTogdHJ1ZSwgYXJlYTogdHJ1ZSwgdGV4dDogdHJ1ZVxuICAgICAgfTtcbiAgICBjYXNlIFNJWkU6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsXG4gICAgICAgIGJhcjogdHJ1ZSwgdGV4dDogdHJ1ZVxuICAgICAgfTtcbiAgICBjYXNlIFNIQVBFOlxuICAgICAgcmV0dXJuIHtwb2ludDogdHJ1ZX07XG4gICAgY2FzZSBURVhUOlxuICAgICAgcmV0dXJuIHt0ZXh0OiB0cnVlfTtcbiAgICBjYXNlIFBBVEg6XG4gICAgICByZXR1cm4ge2xpbmU6IHRydWV9O1xuICB9XG4gIHJldHVybiB7fTtcbn1cblxuaW50ZXJmYWNlIFN1cHBvcnRlZFJvbGUge1xuICBtZWFzdXJlOiBib29sZWFuO1xuICBkaW1lbnNpb246IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIGEgY2hhbm5lbCBzdXBwb3J0cyBkaW1lbnNpb24gLyBtZWFzdXJlIHJvbGVcbiAqIEBwYXJhbSAgY2hhbm5lbFxuICogQHJldHVybiBBIGRpY3Rpb25hcnkgbWFwcGluZyByb2xlIHRvIGJvb2xlYW4gdmFsdWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3VwcG9ydGVkUm9sZShjaGFubmVsOiBDaGFubmVsKTogU3VwcG9ydGVkUm9sZSB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgWDpcbiAgICBjYXNlIFk6XG4gICAgY2FzZSBDT0xPUjpcbiAgICBjYXNlIExBQkVMOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWVhc3VyZTogdHJ1ZSxcbiAgICAgICAgZGltZW5zaW9uOiB0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MVU1OOlxuICAgIGNhc2UgU0hBUEU6XG4gICAgY2FzZSBERVRBSUw6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZWFzdXJlOiBmYWxzZSxcbiAgICAgICAgZGltZW5zaW9uOiB0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgU0laRTpcbiAgICBjYXNlIFRFWFQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZWFzdXJlOiB0cnVlLFxuICAgICAgICBkaW1lbnNpb246IGZhbHNlXG4gICAgICB9O1xuICAgIGNhc2UgUEFUSDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lYXN1cmU6IGZhbHNlLFxuICAgICAgICBkaW1lbnNpb246IHRydWVcbiAgICAgIH07XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGVuY29kaW5nIGNoYW5uZWwnICsgY2hhbm5lbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNTY2FsZShjaGFubmVsOiBDaGFubmVsKSB7XG4gIHJldHVybiAhY29udGFpbnMoW0RFVEFJTCwgUEFUSCwgVEVYVCwgTEFCRUwsIE9SREVSXSwgY2hhbm5lbCk7XG59XG4iLCJpbXBvcnQge1NwZWN9IGZyb20gJy4uL3NjaGVtYS9zY2hlbWEnO1xuaW1wb3J0IHtBeGlzLCBheGlzIGFzIGF4aXNTY2hlbWF9IGZyb20gJy4uL3NjaGVtYS9heGlzLnNjaGVtYSc7XG5pbXBvcnQge0xlZ2VuZCwgbGVnZW5kIGFzIGxlZ2VuZFNjaGVtYX0gZnJvbSAnLi4vc2NoZW1hL2xlZ2VuZC5zY2hlbWEnO1xuaW1wb3J0IHtFbmNvZGluZ30gZnJvbSAnLi4vc2NoZW1hL2VuY29kaW5nLnNjaGVtYSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcbmltcG9ydCB7aW5zdGFudGlhdGV9IGZyb20gJy4uL3NjaGVtYS9zY2hlbWF1dGlsJztcbmltcG9ydCAqIGFzIHNjaGVtYSBmcm9tICcuLi9zY2hlbWEvc2NoZW1hJztcbmltcG9ydCAqIGFzIHNjaGVtYVV0aWwgZnJvbSAnLi4vc2NoZW1hL3NjaGVtYXV0aWwnO1xuXG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZLCBTSVpFLCBURVhULCBQQVRILCBPUkRFUiwgQ2hhbm5lbCwgc3VwcG9ydE1hcmt9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtTT1VSQ0UsIFNVTU1BUll9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0ICogYXMgdmxGaWVsZERlZiBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge0ZpZWxkUmVmT3B0aW9ufSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7TWFyaywgQkFSLCBUSUNLLCBURVhUIGFzIFRFWFRNQVJLfSBmcm9tICcuLi9tYXJrJztcblxuaW1wb3J0IHtnZXRGdWxsTmFtZSwgTk9NSU5BTCwgT1JESU5BTCwgVEVNUE9SQUwsIFFVQU5USVRBVElWRX0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zLCBkdXBsaWNhdGUsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7Y29tcGlsZU1hcmtDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7Y29tcGlsZUxheW91dCwgTGF5b3V0fSBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQge2NvbXBpbGVTdGFja1Byb3BlcnRpZXMsIFN0YWNrUHJvcGVydGllc30gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge3R5cGUgYXMgc2NhbGVUeXBlfSBmcm9tICcuL3NjYWxlJztcblxuLyoqXG4gKiBJbnRlcm5hbCBtb2RlbCBvZiBWZWdhLUxpdGUgc3BlY2lmaWNhdGlvbiBmb3IgdGhlIGNvbXBpbGVyLlxuICovXG5leHBvcnQgY2xhc3MgTW9kZWwge1xuICBwcml2YXRlIF9zcGVjOiBTcGVjO1xuICBwcml2YXRlIF9zdGFjazogU3RhY2tQcm9wZXJ0aWVzO1xuICBwcml2YXRlIF9sYXlvdXQ6IExheW91dDtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBTcGVjKSB7XG4gICAgdmFyIGRlZmF1bHRzID0gc2NoZW1hLmluc3RhbnRpYXRlKCk7XG4gICAgdGhpcy5fc3BlYyA9IHNjaGVtYVV0aWwubWVyZ2VEZWVwKGRlZmF1bHRzLCBzcGVjKTtcblxuICAgIHZsRW5jb2RpbmcuZm9yRWFjaCh0aGlzLl9zcGVjLmVuY29kaW5nLCBmdW5jdGlvbihmaWVsZERlZjogRmllbGREZWYsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICAgIGlmICghc3VwcG9ydE1hcmsoY2hhbm5lbCwgdGhpcy5fc3BlYy5tYXJrKSkge1xuICAgICAgICAvLyBEcm9wIHVuc3VwcG9ydGVkIGNoYW5uZWxcblxuICAgICAgICAvLyBGSVhNRSBjb25zb2xpZGF0ZSB3YXJuaW5nIG1ldGhvZFxuICAgICAgICBjb25zb2xlLndhcm4oY2hhbm5lbCwgJ2Ryb3BwZWQgYXMgaXQgaXMgaW5jb21wYXRpYmxlIHdpdGgnLCB0aGlzLl9zcGVjLm1hcmspO1xuICAgICAgICBkZWxldGUgdGhpcy5fc3BlYy5lbmNvZGluZ1tjaGFubmVsXS5maWVsZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUpIHtcbiAgICAgICAgLy8gY29udmVydCBzaG9ydCB0eXBlIHRvIGZ1bGwgdHlwZVxuICAgICAgICBmaWVsZERlZi50eXBlID0gZ2V0RnVsbE5hbWUoZmllbGREZWYudHlwZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgoY2hhbm5lbCA9PT0gUEFUSCB8fCBjaGFubmVsID09PSBPUkRFUikgJiYgIWZpZWxkRGVmLmFnZ3JlZ2F0ZSAmJiBmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICAgICAgZmllbGREZWYuYWdncmVnYXRlID0gJ21pbic7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE8gaW5zdGFudGlhdGUgYmluIGhlcmVcblxuICAgICAgaWYgKGZpZWxkRGVmLmF4aXMgPT09IHRydWUpIHtcbiAgICAgICAgZmllbGREZWYuYXhpcyA9IGluc3RhbnRpYXRlKGF4aXNTY2hlbWEpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmllbGREZWYubGVnZW5kID09PSB0cnVlKSB7XG4gICAgICAgIGZpZWxkRGVmLmxlZ2VuZCA9IGluc3RhbnRpYXRlKGxlZ2VuZFNjaGVtYSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCBkZWZhdWx0IGJhbmRXaWR0aCBmb3IgWCBhbmQgWVxuICAgICAgaWYgKGNoYW5uZWwgPT09IFggJiYgZmllbGREZWYuc2NhbGUuYmFuZFdpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgemVybyBmb3IgdGhlIHNha2Ugb2YgdGV4dCB0YWJsZS5cbiAgICAgICAgZmllbGREZWYuc2NhbGUuYmFuZFdpZHRoID0gdGhpcy5pc09yZGluYWxTY2FsZShYKSAmJiB0aGlzLm1hcmsoKSA9PT0gJ3RleHQnID9cbiAgICAgICAgICA5MCA6IC8vIFRPRE86IGNvbmZpZy5zY2FsZS50ZXh0QmFuZFdpZHRoXG4gICAgICAgICAgMjE7IC8vIFRPRE86IGNvbmZpZy5zY2FsZS5iYW5kV2lkdGhcbiAgICAgIH1cbiAgICAgIGlmIChjaGFubmVsID09PSBZICYmIGZpZWxkRGVmLnNjYWxlLmJhbmRXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIHplcm8gZm9yIHRoZSBzYWtlIG9mIHRleHQgdGFibGUuXG4gICAgICAgIGZpZWxkRGVmLnNjYWxlLmJhbmRXaWR0aCA9IDIxO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgZGVmYXVsdCBwYWRkaW5nIGZvciBST1cgYW5kIENPTFVNTlxuICAgICAgaWYgKGNoYW5uZWwgPT09IFJPVyAmJiBmaWVsZERlZi5zY2FsZS5wYWRkaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgemVybyBmb3IgdGhlIHNha2Ugb2YgdGV4dCB0YWJsZS5cbiAgICAgICAgZmllbGREZWYuc2NhbGUucGFkZGluZyA9IHRoaXMuaGFzKFkpID8gMTYgOiAwO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5uZWwgPT09IENPTFVNTiAmJiBmaWVsZERlZi5zY2FsZS5wYWRkaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgemVybyBmb3IgdGhlIHNha2Ugb2YgdGV4dCB0YWJsZS5cbiAgICAgICAgZmllbGREZWYuc2NhbGUucGFkZGluZyA9IHRoaXMuaGFzKFgpID8gMTYgOiAwO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuXG4gICAgLy8gY2FsY3VsYXRlIHN0YWNrXG4gICAgdGhpcy5fc3RhY2sgPSBjb21waWxlU3RhY2tQcm9wZXJ0aWVzKHRoaXMuX3NwZWMpO1xuICAgIHRoaXMuX3NwZWMuY29uZmlnLm1hcmsgPSBjb21waWxlTWFya0NvbmZpZyh0aGlzLl9zcGVjLCB0aGlzLl9zdGFjayk7XG4gICAgdGhpcy5fbGF5b3V0ID0gY29tcGlsZUxheW91dCh0aGlzKTtcblxuICB9XG5cbiAgcHVibGljIGxheW91dCgpOiBMYXlvdXQge1xuICAgIHJldHVybiB0aGlzLl9sYXlvdXQ7XG4gIH1cblxuICBwdWJsaWMgc3RhY2soKTogU3RhY2tQcm9wZXJ0aWVzIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhY2s7XG4gIH1cblxuICBwdWJsaWMgdG9TcGVjKGV4Y2x1ZGVDb25maWc/LCBleGNsdWRlRGF0YT8pIHtcbiAgICB2YXIgZW5jb2RpbmcgPSBkdXBsaWNhdGUodGhpcy5fc3BlYy5lbmNvZGluZyksXG4gICAgICBzcGVjOiBhbnk7XG5cbiAgICBzcGVjID0ge1xuICAgICAgbWFyazogdGhpcy5fc3BlYy5tYXJrLFxuICAgICAgZW5jb2Rpbmc6IGVuY29kaW5nXG4gICAgfTtcblxuICAgIGlmICghZXhjbHVkZUNvbmZpZykge1xuICAgICAgc3BlYy5jb25maWcgPSBkdXBsaWNhdGUodGhpcy5fc3BlYy5jb25maWcpO1xuICAgIH1cblxuICAgIGlmICghZXhjbHVkZURhdGEpIHtcbiAgICAgIHNwZWMuZGF0YSA9IGR1cGxpY2F0ZSh0aGlzLl9zcGVjLmRhdGEpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBkZWZhdWx0c1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xuICAgIHJldHVybiBzY2hlbWFVdGlsLnN1YnRyYWN0KHNwZWMsIGRlZmF1bHRzKTtcbiAgfVxuXG4gIHB1YmxpYyBtYXJrKCk6IE1hcmsge1xuICAgIHJldHVybiB0aGlzLl9zcGVjLm1hcms7XG4gIH1cblxuICBwdWJsaWMgc3BlYygpOiBTcGVjIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYztcbiAgfVxuXG4gIHB1YmxpYyBpcyhtYXJrOiBNYXJrKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NwZWMubWFyayA9PT0gbWFyaztcbiAgfVxuXG4gIHB1YmxpYyBoYXMoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiB2bEVuY29kaW5nLmhhcyh0aGlzLl9zcGVjLmVuY29kaW5nLCBjaGFubmVsKTtcbiAgfVxuXG4gIHB1YmxpYyBmaWVsZERlZihjaGFubmVsOiBDaGFubmVsKTogRmllbGREZWYge1xuICAgIHJldHVybiB0aGlzLl9zcGVjLmVuY29kaW5nW2NoYW5uZWxdO1xuICB9XG5cbiAgLyoqIEdldCBcImZpZWxkXCIgcmVmZXJlbmNlIGZvciB2ZWdhICovXG4gIHB1YmxpYyBmaWVsZChjaGFubmVsOiBDaGFubmVsLCBvcHQ6IEZpZWxkUmVmT3B0aW9uID0ge30pIHtcbiAgICBjb25zdCBmaWVsZERlZiA9IHRoaXMuZmllbGREZWYoY2hhbm5lbCk7XG4gICAgaWYgKGZpZWxkRGVmLmJpbikgeyAvLyBiaW4gaGFzIGRlZmF1bHQgc3VmZml4IHRoYXQgZGVwZW5kcyBvbiBzY2FsZVR5cGVcbiAgICAgIG9wdCA9IGV4dGVuZCh7XG4gICAgICAgIGJpblN1ZmZpeDogc2NhbGVUeXBlKGZpZWxkRGVmLCBjaGFubmVsLCB0aGlzLm1hcmsoKSkgPT09ICdvcmRpbmFsJyA/ICdfcmFuZ2UnIDogJ19zdGFydCdcbiAgICAgIH0sIG9wdCk7XG4gICAgfVxuICAgIHJldHVybiB2bEZpZWxkRGVmLmZpZWxkKGZpZWxkRGVmLCBvcHQpO1xuICB9XG5cbiAgcHVibGljIGZpZWxkVGl0bGUoY2hhbm5lbDogQ2hhbm5lbCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHZsRmllbGREZWYudGl0bGUodGhpcy5fc3BlYy5lbmNvZGluZ1tjaGFubmVsXSk7XG4gIH1cblxuICBwdWJsaWMgY2hhbm5lbHMoKTogQ2hhbm5lbFtdIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5jaGFubmVscyh0aGlzLl9zcGVjLmVuY29kaW5nKTtcbiAgfVxuXG4gIHB1YmxpYyBtYXAoZjogKGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgZTogRW5jb2RpbmcpID0+IGFueSwgdD86IGFueSkge1xuICAgIHJldHVybiB2bEVuY29kaW5nLm1hcCh0aGlzLl9zcGVjLmVuY29kaW5nLCBmLCB0KTtcbiAgfVxuXG4gIHB1YmxpYyByZWR1Y2UoZjogKGFjYzogYW55LCBmZDogRmllbGREZWYsIGM6IENoYW5uZWwsIGU6IEVuY29kaW5nKSA9PiBhbnksIGluaXQsIHQ/OiBhbnkpIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5yZWR1Y2UodGhpcy5fc3BlYy5lbmNvZGluZywgZiwgaW5pdCwgdCk7XG4gIH1cblxuICBwdWJsaWMgZm9yRWFjaChmOiAoZmQ6IEZpZWxkRGVmLCBjOiBDaGFubmVsLCBpOm51bWJlcikgPT4gdm9pZCwgdD86IGFueSkge1xuICAgIHZsRW5jb2RpbmcuZm9yRWFjaCh0aGlzLl9zcGVjLmVuY29kaW5nLCBmLCB0KTtcbiAgfVxuXG4gIHB1YmxpYyBpc09yZGluYWxTY2FsZShjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgY29uc3QgZmllbGREZWYgPSB0aGlzLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgIHJldHVybiBmaWVsZERlZiAmJiAoXG4gICAgICBjb250YWlucyhbTk9NSU5BTCwgT1JESU5BTF0sIGZpZWxkRGVmLnR5cGUpIHx8XG4gICAgICAoIGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMICYmIHNjYWxlVHlwZShmaWVsZERlZiwgY2hhbm5lbCwgdGhpcy5tYXJrKCkpID09PSAnb3JkaW5hbCcgKVxuICAgICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBpc0RpbWVuc2lvbihjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIHZsRmllbGREZWYuaXNEaW1lbnNpb24odGhpcy5maWVsZERlZihjaGFubmVsKSk7XG4gIH1cblxuICBwdWJsaWMgaXNNZWFzdXJlKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gdmxGaWVsZERlZi5pc01lYXN1cmUodGhpcy5maWVsZERlZihjaGFubmVsKSk7XG4gIH1cblxuICBwdWJsaWMgaXNBZ2dyZWdhdGUoKSB7XG4gICAgcmV0dXJuIHZsRW5jb2RpbmcuaXNBZ2dyZWdhdGUodGhpcy5fc3BlYy5lbmNvZGluZyk7XG4gIH1cblxuICBwdWJsaWMgaXNGYWNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoUk9XKSB8fCB0aGlzLmhhcyhDT0xVTU4pO1xuICB9XG5cbiAgcHVibGljIGRhdGFUYWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0FnZ3JlZ2F0ZSgpID8gU1VNTUFSWSA6IFNPVVJDRTtcbiAgfVxuXG4gIHB1YmxpYyBkYXRhKCkge1xuICAgIHJldHVybiB0aGlzLl9zcGVjLmRhdGE7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNmb3JtKCkge1xuICAgIHJldHVybiB0aGlzLl9zcGVjLnRyYW5zZm9ybTtcbiAgfVxuXG4gIC8qKiByZXR1cm5zIHdoZXRoZXIgdGhlIGVuY29kaW5nIGhhcyB2YWx1ZXMgZW1iZWRkZWQgKi9cbiAgcHVibGljIGhhc1ZhbHVlcygpIHtcbiAgICB2YXIgdmFscyA9IHRoaXMuZGF0YSgpLnZhbHVlcztcbiAgICByZXR1cm4gdmFscyAmJiB2YWxzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHNwZWMgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHB1YmxpYyBjb25maWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NwZWMuY29uZmlnO1xuICB9XG5cbiAgcHVibGljIGF4aXMoY2hhbm5lbDogQ2hhbm5lbCk6IEF4aXMge1xuICAgIGNvbnN0IGF4aXMgPSB0aGlzLmZpZWxkRGVmKGNoYW5uZWwpLmF4aXM7XG5cbiAgICAvLyBUaGlzIGxpbmUgc2hvdWxkIGFjdHVhbGx5IGFsd2F5cyByZXR1cm4gYXhpcyBvYmplY3Qgc2luY2Ugd2UgYWxyZWFkeVxuICAgIC8vIHJlcGxhY2UgYm9vbGVhbiBheGlzIHdpdGggcHJvcGVydGllcy5cbiAgICByZXR1cm4gdHlwZW9mIGF4aXMgIT09ICdib29sZWFuJyA/IGF4aXMgOiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBsZWdlbmQoY2hhbm5lbDogQ2hhbm5lbCk6IExlZ2VuZCB7XG4gICAgY29uc3QgbGVnZW5kID0gdGhpcy5maWVsZERlZihjaGFubmVsKS5sZWdlbmQ7XG5cbiAgICAvLyBUaGlzIGxpbmUgc2hvdWxkIGFjdHVhbGx5IGFsd2F5cyByZXR1cm4gbGVnZW5kIG9iamVjdCBzaW5jZSB3ZSBhbHJlYWR5XG4gICAgLy8gcmVwbGFjZSBib29sZWFuIGxlZ2VuZCB3aXRoIHByb3BlcnRpZXMuXG4gICAgcmV0dXJuIHR5cGVvZiBsZWdlbmQgIT09ICdib29sZWFuJyA/IGxlZ2VuZCA6IHt9O1xuICB9XG5cbiAgLyoqIHJldHVybnMgc2NhbGUgbmFtZSBmb3IgYSBnaXZlbiBjaGFubmVsICovXG4gIHB1YmxpYyBzY2FsZU5hbWUoY2hhbm5lbDogQ2hhbm5lbCk6IHN0cmluZyB7XG4gICAgY29uc3QgbmFtZSA9IHRoaXMuc3BlYygpLm5hbWU7XG4gICAgcmV0dXJuIChuYW1lID8gbmFtZSArICctJyA6ICcnKSArIGNoYW5uZWw7XG4gIH1cblxuICBwdWJsaWMgc2l6ZVZhbHVlKGNoYW5uZWw6IENoYW5uZWwgPSBTSVpFKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmZpZWxkRGVmKFNJWkUpLnZhbHVlO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMubWFyaygpKSB7XG4gICAgICBjYXNlIFRFWFRNQVJLOlxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcoKS5tYXJrLmZvbnRTaXplOyAvLyBmb250IHNpemUgMTAgYnkgZGVmYXVsdFxuICAgICAgY2FzZSBCQVI6XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZygpLm1hcmsuYmFyV2lkdGgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWcoKS5tYXJrLmJhcldpZHRoO1xuICAgICAgICB9XG4gICAgICAgIC8vIEJBUidzIHNpemUgaXMgYXBwbGllZCBvbiBlaXRoZXIgWCBvciBZXG4gICAgICAgIHJldHVybiB0aGlzLmlzT3JkaW5hbFNjYWxlKGNoYW5uZWwpID9cbiAgICAgICAgICAgIC8vIEZvciBvcmRpbmFsIHNjYWxlIG9yIHNpbmdsZSBiYXIsIHdlIGNhbiB1c2UgYmFuZFdpZHRoIC0gMVxuICAgICAgICAgICAgLy8gKC0xIHNvIHRoYXQgdGhlIGJvcmRlciBvZiB0aGUgYmFyIGZhbGxzIG9uIGV4YWN0IHBpeGVsKVxuICAgICAgICAgICAgdGhpcy5maWVsZERlZihjaGFubmVsKS5zY2FsZS5iYW5kV2lkdGggLSAxIDpcbiAgICAgICAgICAhdGhpcy5oYXMoY2hhbm5lbCkgP1xuICAgICAgICAgICAgMjEgOiAvKiBjb25maWcuc2NhbGUuYmFuZFdpZHRoICovXG4gICAgICAgICAgICAyOyAvLyBvdGhlcndpc2UsIHNldCB0byAyIGJ5IGRlZmF1bHRcbiAgICAgIGNhc2UgVElDSzpcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnKCkubWFyay50aWNrV2lkdGgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWcoKS5tYXJrLnRpY2tXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiYW5kV2lkdGggPSB0aGlzLmhhcyhjaGFubmVsKSA/XG4gICAgICAgICAgdGhpcy5maWVsZERlZihjaGFubmVsKS5zY2FsZS5iYW5kV2lkdGggOlxuICAgICAgICAgIDIxOyAvKiBjb25maWcuc2NhbGUuYmFuZFdpZHRoICovXG4gICAgICAgIHJldHVybiBiYW5kV2lkdGggLyAxLjU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbmZpZygpLm1hcmsuc2l6ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge2NvbnRhaW5zLCBleHRlbmQsIHRydW5jYXRlfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7Tk9NSU5BTCwgT1JESU5BTCwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWSwgQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2Zvcm1hdE1peGluc30gZnJvbSAnLi91dGlsJztcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvbWFzdGVyL2RvYy9zcGVjLm1kIzExLWFtYmllbnQtZGVjbGFyYXRpb25zXG5kZWNsYXJlIGxldCBleHBvcnRzO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUF4aXMoY2hhbm5lbDogQ2hhbm5lbCwgbW9kZWw6IE1vZGVsKSB7XG4gIGNvbnN0IGlzQ29sID0gY2hhbm5lbCA9PT0gQ09MVU1OLFxuICAgIGlzUm93ID0gY2hhbm5lbCA9PT0gUk9XLFxuICAgIHR5cGUgPSBpc0NvbCA/ICd4JyA6IGlzUm93ID8gJ3knOiBjaGFubmVsO1xuXG4gIC8vIFRPRE86IHJlcGxhY2UgYW55IHdpdGggVmVnYSBBeGlzIEludGVyZmFjZVxuICBsZXQgZGVmOiBhbnkgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpXG4gIH07XG5cbiAgLy8gZm9ybWF0IG1peGlucyAoYWRkIGZvcm1hdCBhbmQgZm9ybWF0VHlwZSlcbiAgZXh0ZW5kKGRlZiwgZm9ybWF0TWl4aW5zKG1vZGVsLCBjaGFubmVsLCBtb2RlbC5heGlzKGNoYW5uZWwpLmZvcm1hdCkpO1xuXG4gIC8vIDEuMi4gQWRkIHByb3BlcnRpZXNcbiAgW1xuICAgIC8vIGEpIHByb3BlcnRpZXMgd2l0aCBzcGVjaWFsIHJ1bGVzIChzbyBpdCBoYXMgYXhpc1twcm9wZXJ0eV0gbWV0aG9kcykgLS0gY2FsbCBydWxlIGZ1bmN0aW9uc1xuICAgICdncmlkJywgJ2xheWVyJywgJ29yaWVudCcsICd0aWNrU2l6ZScsICd0aWNrcycsICd0aXRsZScsXG4gICAgLy8gYikgcHJvcGVydGllcyB3aXRob3V0IHJ1bGVzLCBvbmx5IHByb2R1Y2UgZGVmYXVsdCB2YWx1ZXMgaW4gdGhlIHNjaGVtYSwgb3IgZXhwbGljaXQgdmFsdWUgaWYgc3BlY2lmaWVkXG4gICAgJ29mZnNldCcsICd0aWNrUGFkZGluZycsICd0aWNrU2l6ZScsICd0aWNrU2l6ZU1ham9yJywgJ3RpY2tTaXplTWlub3InLCAndGlja1NpemVFbmQnLFxuICAgICd0aXRsZU9mZnNldCcsICd2YWx1ZXMnLCAnc3ViZGl2aWRlJ1xuICBdLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICBsZXQgbWV0aG9kOiAobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBkZWY6YW55KT0+YW55O1xuXG4gICAgY29uc3QgdmFsdWUgPSAobWV0aG9kID0gZXhwb3J0c1twcm9wZXJ0eV0pID9cbiAgICAgICAgICAgICAgICAgIC8vIGNhbGxpbmcgYXhpcy5mb3JtYXQsIGF4aXMuZ3JpZCwgLi4uXG4gICAgICAgICAgICAgICAgICBtZXRob2QobW9kZWwsIGNoYW5uZWwsIGRlZikgOlxuICAgICAgICAgICAgICAgICAgbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuYXhpc1twcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlZltwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIDIpIEFkZCBtYXJrIHByb3BlcnR5IGRlZmluaXRpb24gZ3JvdXBzXG4gIGNvbnN0IHByb3BzID0gbW9kZWwuYXhpcyhjaGFubmVsKS5wcm9wZXJ0aWVzIHx8IHt9O1xuXG4gIFtcbiAgICAnYXhpcycsICdsYWJlbHMnLCAvLyBoYXZlIHNwZWNpYWwgcnVsZXNcbiAgICAnZ3JpZCcsICd0aXRsZScsICd0aWNrcycsICdtYWpvclRpY2tzJywgJ21pbm9yVGlja3MnIC8vIG9ubHkgZGVmYXVsdCB2YWx1ZXNcbiAgXS5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgY29uc3QgdmFsdWUgPSBwcm9wZXJ0aWVzW2dyb3VwXSA/XG4gICAgICBwcm9wZXJ0aWVzW2dyb3VwXShtb2RlbCwgY2hhbm5lbCwgcHJvcHNbZ3JvdXBdLCBkZWYpIDpcbiAgICAgIHByb3BzW2dyb3VwXTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmLnByb3BlcnRpZXMgPSBkZWYucHJvcGVydGllcyB8fCB7fTtcbiAgICAgIGRlZi5wcm9wZXJ0aWVzW2dyb3VwXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdyaWQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gIGlmIChjaGFubmVsID09PSBST1cgfHwgY2hhbm5lbCA9PT0gQ09MVU1OKSB7XG4gICAgLy8gbmV2ZXIgYXBwbHkgZ3JpZCBmb3IgUk9XIGFuZCBDT0xVTU4gc2luY2Ugd2UgbWFudWFsbHkgY3JlYXRlIHJ1bGUtZ3JvdXAgZm9yIHRoZW1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgZ3JpZCA9IG1vZGVsLmF4aXMoY2hhbm5lbCkuZ3JpZDtcbiAgaWYgKGdyaWQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBncmlkO1xuICB9XG5cbiAgLy8gSWYgYGdyaWRgIGlzIHVuc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAgZm9yIG9yZGluYWwgc2NhbGVzXG4gIC8vIHRoYXQgYXJlIG5vdCBiaW5uZWRcbiAgcmV0dXJuICFtb2RlbC5pc09yZGluYWxTY2FsZShjaGFubmVsKSAmJiAhZmllbGREZWYuYmluO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXIobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBkZWYpIHtcbiAgY29uc3QgbGF5ZXIgPSBtb2RlbC5heGlzKGNoYW5uZWwpLmxheWVyO1xuICBpZiAobGF5ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBsYXllcjtcbiAgfVxuICBpZiAoZGVmLmdyaWQpIHtcbiAgICAvLyBpZiBncmlkIGlzIHRydWUsIG5lZWQgdG8gcHV0IGxheWVyIG9uIHRoZSBiYWNrIHNvIHRoYXQgZ3JpZCBpcyBiZWhpbmQgbWFya3NcbiAgICByZXR1cm4gJ2JhY2snO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7IC8vIG90aGVyd2lzZSByZXR1cm4gdW5kZWZpbmVkIGFuZCB1c2UgVmVnYSdzIGRlZmF1bHQuXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gb3JpZW50KG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBjb25zdCBvcmllbnQgPSBtb2RlbC5heGlzKGNoYW5uZWwpLm9yaWVudDtcbiAgaWYgKG9yaWVudCkge1xuICAgIHJldHVybiBvcmllbnQ7XG4gIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gQ09MVU1OKSB7XG4gICAgLy8gRklYTUUgdGVzdCBhbmQgZGVjaWRlXG4gICAgcmV0dXJuICd0b3AnO1xuICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IFJPVykge1xuICAgIGlmIChtb2RlbC5oYXMoWSkgJiYgbW9kZWwuYXhpcyhZKS5vcmllbnQgIT09ICdyaWdodCcpIHtcbiAgICAgIHJldHVybiAncmlnaHQnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlja3MobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGNvbnN0IHRpY2tzID0gbW9kZWwuYXhpcyhjaGFubmVsKS50aWNrcztcbiAgaWYgKHRpY2tzICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdGlja3M7XG4gIH1cblxuICAvLyBGSVhNRSBkZXBlbmRzIG9uIHNjYWxlIHR5cGUgdG9vXG4gIGlmIChjaGFubmVsID09PSBYICYmICFtb2RlbC5maWVsZERlZihjaGFubmVsKS5iaW4pIHtcbiAgICAvLyBWZWdhJ3MgZGVmYXVsdCB0aWNrcyBvZnRlbiBsZWFkIHRvIGEgbG90IG9mIGxhYmVsIG9jY2x1c2lvbiBvbiBYIHdpdGhvdXQgOTAgZGVncmVlIHJvdGF0aW9uXG4gICAgcmV0dXJuIDU7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlja1NpemUobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGNvbnN0IHRpY2tTaXplID0gbW9kZWwuYXhpcyhjaGFubmVsKS50aWNrU2l6ZTtcbiAgaWYgKHRpY2tTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdGlja1NpemU7XG4gIH1cbiAgaWYgKGNoYW5uZWwgPT09IFJPVyB8fCBjaGFubmVsID09PSBDT0xVTU4pIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgY29uc3QgYXhpcyA9IG1vZGVsLmF4aXMoY2hhbm5lbCk7XG4gIGlmIChheGlzLnRpdGxlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYXhpcy50aXRsZTtcbiAgfVxuXG4gIC8vIGlmIG5vdCBkZWZpbmVkLCBhdXRvbWF0aWNhbGx5IGRldGVybWluZSBheGlzIHRpdGxlIGZyb20gZmllbGQgZGVmXG4gIGNvbnN0IGZpZWxkVGl0bGUgPSBtb2RlbC5maWVsZFRpdGxlKGNoYW5uZWwpO1xuICBjb25zdCBsYXlvdXQgPSBtb2RlbC5sYXlvdXQoKTtcbiAgY29uc3QgY2VsbFdpZHRoID0gbGF5b3V0LmNlbGxXaWR0aDtcbiAgY29uc3QgY2VsbEhlaWdodCA9IGxheW91dC5jZWxsSGVpZ2h0O1xuXG4gIGxldCBtYXhMZW5ndGg7XG4gIGlmIChheGlzLnRpdGxlTWF4TGVuZ3RoKSB7XG4gICAgbWF4TGVuZ3RoID0gYXhpcy50aXRsZU1heExlbmd0aDtcbiAgfSBlbHNlIGlmIChjaGFubmVsID09PSBYICYmIHR5cGVvZiBjZWxsV2lkdGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gR3Vlc3MgbWF4IGxlbmd0aCBpZiB3ZSBrbm93IGNlbGwgc2l6ZSBhdCBjb21waWxlIHRpbWVcbiAgICBtYXhMZW5ndGggPSBjZWxsV2lkdGggLyBtb2RlbC5heGlzKFgpLmNoYXJhY3RlcldpZHRoO1xuICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IFkgJiYgdHlwZW9mIGNlbGxIZWlnaHQgPT09ICdudW1iZXInKSB7XG4gICAgLy8gR3Vlc3MgbWF4IGxlbmd0aCBpZiB3ZSBrbm93IGNlbGwgc2l6ZSBhdCBjb21waWxlIHRpbWVcbiAgICBtYXhMZW5ndGggPSBjZWxsSGVpZ2h0IC8gbW9kZWwuYXhpcyhZKS5jaGFyYWN0ZXJXaWR0aDtcbiAgfVxuICAvLyBGSVhNRTogd2Ugc2hvdWxkIHVzZSB0ZW1wbGF0ZSB0byB0cnVuY2F0ZSBpbnN0ZWFkXG4gIHJldHVybiBtYXhMZW5ndGggPyB0cnVuY2F0ZShmaWVsZFRpdGxlLCBtYXhMZW5ndGgpIDogZmllbGRUaXRsZTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBwcm9wZXJ0aWVzIHtcbiAgZXhwb3J0IGZ1bmN0aW9uIGF4aXMobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBheGlzUHJvcHNTcGVjKSB7XG4gICAgaWYgKGNoYW5uZWwgPT09IFJPVyB8fCBjaGFubmVsID09PSBDT0xVTU4pIHtcbiAgICAgIC8vIGhpZGUgYXhpcyBmb3IgZmFjZXRzXG4gICAgICByZXR1cm4gZXh0ZW5kKHtcbiAgICAgICAgb3BhY2l0eToge3ZhbHVlOiAwfVxuICAgICAgfSwgYXhpc1Byb3BzU3BlYyB8fCB7fSk7XG4gICAgfVxuICAgIHJldHVybiBheGlzUHJvcHNTcGVjIHx8IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBsYWJlbHNTcGVjLCBkZWYpIHtcbiAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgIGNvbnN0IGF4aXMgPSBtb2RlbC5heGlzKGNoYW5uZWwpO1xuXG4gICAgaWYgKCFheGlzLmxhYmVscykge1xuICAgICAgcmV0dXJuIGV4dGVuZCh7XG4gICAgICAgIHRleHQ6ICcnXG4gICAgICB9LCBsYWJlbHNTcGVjKTtcbiAgICB9XG5cbiAgICBpZiAoY29udGFpbnMoW05PTUlOQUwsIE9SRElOQUxdLCBmaWVsZERlZi50eXBlKSAmJiBheGlzLmxhYmVsTWF4TGVuZ3RoKSB7XG4gICAgICAvLyBUT0RPIHJlcGxhY2UgdGhpcyB3aXRoIFZlZ2EncyBsYWJlbE1heExlbmd0aCBvbmNlIGl0IGlzIGludHJvZHVjZWRcbiAgICAgIGxhYmVsc1NwZWMgPSBleHRlbmQoe1xuICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgdGVtcGxhdGU6ICd7eyBkYXR1bS5kYXRhIHwgdHJ1bmNhdGU6JyArIGF4aXMubGFiZWxNYXhMZW5ndGggKyAnfX0nXG4gICAgICAgIH1cbiAgICAgIH0sIGxhYmVsc1NwZWMgfHwge30pO1xuICAgIH1cblxuICAgICAvLyBmb3IgeC1heGlzLCBzZXQgdGlja3MgZm9yIFEgb3Igcm90YXRlIHNjYWxlIGZvciBvcmRpbmFsIHNjYWxlXG4gICAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgICBjYXNlIFg6XG4gICAgICAgIGlmIChtb2RlbC5pc0RpbWVuc2lvbihYKSB8fCBmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xuICAgICAgICAgIGxhYmVsc1NwZWMgPSBleHRlbmQoe1xuICAgICAgICAgICAgYW5nbGU6IHt2YWx1ZTogMjcwfSxcbiAgICAgICAgICAgIGFsaWduOiB7dmFsdWU6IGRlZi5vcmllbnQgPT09ICd0b3AnID8gJ2xlZnQnOiAncmlnaHQnfSxcbiAgICAgICAgICAgIGJhc2VsaW5lOiB7dmFsdWU6ICdtaWRkbGUnfVxuICAgICAgICAgIH0sIGxhYmVsc1NwZWMgfHwge30pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBST1c6XG4gICAgICAgIGlmIChkZWYub3JpZW50ID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgbGFiZWxzU3BlYyA9IGV4dGVuZCh7XG4gICAgICAgICAgICBhbmdsZToge3ZhbHVlOiA5MH0sXG4gICAgICAgICAgICBhbGlnbjoge3ZhbHVlOiAnY2VudGVyJ30sXG4gICAgICAgICAgICBiYXNlbGluZToge3ZhbHVlOiAnYm90dG9tJ31cbiAgICAgICAgICB9LCBsYWJlbHNTcGVjIHx8IHt9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsYWJlbHNTcGVjIHx8IHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiLyoqXG4gKiBNb2R1bGUgZm9yIGNvbXBpbGluZyBWZWdhLWxpdGUgc3BlYyBpbnRvIFZlZ2Egc3BlYy5cbiAqL1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5cbmltcG9ydCB7Y29tcGlsZUF4aXN9IGZyb20gJy4vYXhpcyc7XG5pbXBvcnQge2NvbXBpbGVEYXRhfSBmcm9tICcuL2RhdGEnO1xuaW1wb3J0IHtmYWNldE1peGluc30gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge2NvbXBpbGVMZWdlbmRzfSBmcm9tICcuL2xlZ2VuZCc7XG5pbXBvcnQge2NvbXBpbGVNYXJrfSBmcm9tICcuL21hcmsnO1xuaW1wb3J0IHtjb21waWxlU2NhbGVzfSBmcm9tICcuL3NjYWxlJztcbmltcG9ydCB7ZXh0ZW5kLCBrZXlzfSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtMQVlPVVR9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5cbmV4cG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZShzcGVjKSB7XG4gIGNvbnN0IG1vZGVsID0gbmV3IE1vZGVsKHNwZWMpO1xuICBjb25zdCBsYXlvdXQgPSBtb2RlbC5sYXlvdXQoKTtcblxuICAvLyBGSVhNRSByZXBsYWNlIEZJVCB3aXRoIGFwcHJvcHJpYXRlIG1lY2hhbmlzbSBvbmNlIFZlZ2EgaGFzIGl0XG4gIGNvbnN0IEZJVCA9IDE7XG5cbiAgY29uc3QgY29uZmlnID0gbW9kZWwuY29uZmlnKCk7XG5cbiAgLy8gVE9ETzogY2hhbmdlIHR5cGUgdG8gYmVjb21lIFZnU3BlY1xuICBjb25zdCBvdXRwdXQgPSBleHRlbmQoXG4gICAgc3BlYy5uYW1lID8geyBuYW1lOiBzcGVjLm5hbWUgfSA6IHt9LFxuICAgIHtcbiAgICAgIHdpZHRoOiB0eXBlb2YgbGF5b3V0LndpZHRoICE9PSAnbnVtYmVyJyA/IEZJVCA6IGxheW91dC53aWR0aCxcbiAgICAgIGhlaWdodDogdHlwZW9mIGxheW91dC5oZWlnaHQgIT09ICdudW1iZXInID8gRklUIDogbGF5b3V0LmhlaWdodCxcbiAgICAgIHBhZGRpbmc6ICdhdXRvJ1xuICAgIH0sXG4gICAgY29uZmlnLnZpZXdwb3J0ID8geyB2aWV3cG9ydDogY29uZmlnLnZpZXdwb3J0IH0gOiB7fSxcbiAgICBjb25maWcuYmFja2dyb3VuZCA/IHsgYmFja2dyb3VuZDogY29uZmlnLmJhY2tncm91bmQgfSA6IHt9LFxuICAgIGtleXMoY29uZmlnLnNjZW5lKS5sZW5ndGggPiAwID8gc2NlbmUoY29uZmlnKSA6IHt9LFxuICAgIHtcbiAgICAgIGRhdGE6IGNvbXBpbGVEYXRhKG1vZGVsKSxcbiAgICAgIG1hcmtzOiBbY29tcGlsZVJvb3RHcm91cChtb2RlbCldXG4gICAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBzcGVjOiBvdXRwdXRcbiAgICAvLyBUT0RPOiBhZGQgd2FybmluZyAvIGVycm9ycyBoZXJlXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNjZW5lKGNvbmZpZykge1xuICByZXR1cm4gWydmaWxsJywgJ2ZpbGxPcGFjaXR5JywgJ3N0cm9rZScsICdzdHJva2VXaWR0aCcsXG4gICAgJ3N0cm9rZU9wYWNpdHknLCAnc3Ryb2tlRGFzaCcsICdzdHJva2VEYXNoT2Zmc2V0J10uXG4gICAgICByZWR1Y2UoZnVuY3Rpb24odG9wTGV2ZWxDb25maWc6IGFueSwgcHJvcGVydHkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29uZmlnLnNjZW5lW3Byb3BlcnR5XTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRvcExldmVsQ29uZmlnLnNjZW5lID0gdG9wTGV2ZWxDb25maWcuc2NlbmUgfHwge307XG4gICAgICAgIHRvcExldmVsQ29uZmlnLnNjZW5lW3Byb3BlcnR5XSA9IHt2YWx1ZTogdmFsdWV9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRvcExldmVsQ29uZmlnO1xuICB9LCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlUm9vdEdyb3VwKG1vZGVsOiBNb2RlbCkge1xuICBjb25zdCBzcGVjID0gbW9kZWwuc3BlYygpO1xuICBjb25zdCB3aWR0aCA9IG1vZGVsLmxheW91dCgpLndpZHRoO1xuICBjb25zdCBoZWlnaHQgPSBtb2RlbC5sYXlvdXQoKS5oZWlnaHQ7XG5cbiAgbGV0IHJvb3RHcm91cDphbnkgPSBleHRlbmQoe1xuICAgICAgbmFtZTogc3BlYy5uYW1lID8gc3BlYy5uYW1lICsgJy1yb290JyA6ICdyb290JyxcbiAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgfSxcbiAgICBzcGVjLmRlc2NyaXB0aW9uID8ge2Rlc2NyaXB0aW9uOiBzcGVjLmRlc2NyaXB0aW9ufSA6IHt9LFxuICAgIHtcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgd2lkdGg6IHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgP1xuICAgICAgICAgICAgICAgICB7ZmllbGQ6IHdpZHRoLmZpZWxkfSA6XG4gICAgICAgICAgICAgICAgIHt2YWx1ZTogd2lkdGh9LFxuICAgICAgICAgIGhlaWdodDogdHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgP1xuICAgICAgICAgICAgICAgICAge2ZpZWxkOiBoZWlnaHQuZmllbGR9IDpcbiAgICAgICAgICAgICAgICAgIHt2YWx1ZTogaGVpZ2h0fVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgLy8gb25seSBhZGQgcmVmZXJlbmNlIHRvIGxheW91dCBpZiBuZWVkZWRcbiAgaWYgKHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgfHwgdHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicpIHtcbiAgICByb290R3JvdXAgPSBleHRlbmQocm9vdEdyb3VwLCB7XG4gICAgICBmcm9tOiB7ZGF0YTogTEFZT1VUfVxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgbWFya3MgPSBjb21waWxlTWFyayhtb2RlbCk7XG5cbiAgLy8gU21hbGwgTXVsdGlwbGVzXG4gIGlmIChtb2RlbC5oYXMoUk9XKSB8fCBtb2RlbC5oYXMoQ09MVU1OKSkge1xuICAgIC8vIHB1dCB0aGUgbWFya3MgaW5zaWRlIGEgZmFjZXQgY2VsbCdzIGdyb3VwXG4gICAgZXh0ZW5kKHJvb3RHcm91cCwgZmFjZXRNaXhpbnMobW9kZWwsIG1hcmtzKSk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdEdyb3VwLm1hcmtzID0gbWFya3M7XG4gICAgcm9vdEdyb3VwLnNjYWxlcyA9IGNvbXBpbGVTY2FsZXMobW9kZWwuY2hhbm5lbHMoKSwgbW9kZWwpO1xuXG4gICAgdmFyIGF4ZXMgPSAobW9kZWwuaGFzKFgpICYmIG1vZGVsLmZpZWxkRGVmKFgpLmF4aXMgPyBbY29tcGlsZUF4aXMoWCwgbW9kZWwpXSA6IFtdKVxuICAgICAgLmNvbmNhdChtb2RlbC5oYXMoWSkgJiYgbW9kZWwuZmllbGREZWYoWSkuYXhpcyA/IFtjb21waWxlQXhpcyhZLCBtb2RlbCldIDogW10pO1xuICAgIGlmIChheGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJvb3RHcm91cC5heGVzID0gYXhlcztcbiAgICB9XG4gIH1cblxuICAvLyBsZWdlbmRzIChzaW1pbGFyIGZvciBlaXRoZXIgZmFjZXRzIG9yIG5vbi1mYWNldHNcbiAgdmFyIGxlZ2VuZHMgPSBjb21waWxlTGVnZW5kcyhtb2RlbCk7XG4gIGlmIChsZWdlbmRzLmxlbmd0aCA+IDApIHtcbiAgICByb290R3JvdXAubGVnZW5kcyA9IGxlZ2VuZHM7XG4gIH1cbiAgcmV0dXJuIHJvb3RHcm91cDtcbn1cbiIsImltcG9ydCB7U3BlY30gZnJvbSAnLi4vc2NoZW1hL3NjaGVtYSc7XG5pbXBvcnQge1N0YWNrUHJvcGVydGllc30gZnJvbSAnLi9zdGFjayc7XG5cbmltcG9ydCB7WCwgWSwgREVUQUlMfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7aXNBZ2dyZWdhdGUsIGhhc30gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtpc01lYXN1cmV9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7UE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7Y29udGFpbnMsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbCc7XG5cbi8qKlxuICogQXVnbWVudCBjb25maWcubWFyayB3aXRoIHJ1bGUtYmFzZWQgZGVmYXVsdCB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTWFya0NvbmZpZyhzcGVjOiBTcGVjLCBzdGFjazogU3RhY2tQcm9wZXJ0aWVzKSB7XG4gICByZXR1cm4gZXh0ZW5kKFxuICAgICBbJ2ZpbGxlZCcsICdvcGFjaXR5JywgJ29yaWVudCcsICdhbGlnbiddLnJlZHVjZShmdW5jdGlvbihjZmcsIHByb3BlcnR5OiBzdHJpbmcpIHtcbiAgICAgICBjb25zdCB2YWx1ZSA9IHNwZWMuY29uZmlnLm1hcmtbcHJvcGVydHldO1xuICAgICAgIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICAgICAgIGNhc2UgJ2ZpbGxlZCc6XG4gICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgLy8gb25seSBwb2ludCBpcyBub3QgZmlsbGVkIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgICBjZmdbcHJvcGVydHldID0gc3BlYy5tYXJrICE9PSBQT0lOVDtcbiAgICAgICAgICAgfVxuICAgICAgICAgICBicmVhaztcbiAgICAgICAgIGNhc2UgJ29wYWNpdHknOlxuICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBjb250YWlucyhbUE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFXSwgc3BlYy5tYXJrKSkge1xuICAgICAgICAgICAgIC8vIHBvaW50LWJhc2VkIG1hcmtzIGFuZCBiYXJcbiAgICAgICAgICAgICBpZiAoIWlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpIHx8IGhhcyhzcGVjLmVuY29kaW5nLCBERVRBSUwpKSB7XG4gICAgICAgICAgICAgICBjZmdbcHJvcGVydHldID0gMC43O1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuICAgICAgICAgICBicmVhaztcbiAgICAgICAgIGNhc2UgJ29yaWVudCc6XG4gICAgICAgICAgIGlmIChzdGFjaykge1xuICAgICAgICAgICAgIC8vIEZvciBzdGFja2VkIGNoYXJ0LCBleHBsaWNpdGx5IHNwZWNpZmllZCBvcmllbnQgcHJvcGVydHkgd2lsbCBiZSBpZ25vcmVkLlxuICAgICAgICAgICAgIGNmZ1twcm9wZXJ0eV0gPSBzdGFjay5ncm91cGJ5Q2hhbm5lbCA9PT0gWSA/ICdob3Jpem9udGFsJyA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgfVxuICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgIGNmZ1twcm9wZXJ0eV0gPSBpc01lYXN1cmUoc3BlYy5lbmNvZGluZ1tYXSkgJiYgICFpc01lYXN1cmUoc3BlYy5lbmNvZGluZ1tZXSkgP1xuICAgICAgICAgICAgICAgLy8gaG9yaXpvbnRhbCBpZiBYIGlzIG1lYXN1cmUgYW5kIFkgaXMgZGltZW5zaW9uIG9yIHVuc3BlY2lmaWVkXG4gICAgICAgICAgICAgICAnaG9yaXpvbnRhbCcgOlxuICAgICAgICAgICAgICAgLy8gdmVydGljYWwgKHVuZGVmaW5lZCkgb3RoZXJ3aXNlLiAgVGhpcyBpbmNsdWRlcyB3aGVuXG4gICAgICAgICAgICAgICAvLyAtIFkgaXMgbWVhc3VyZSBhbmQgWCBpcyBkaW1lbnNpb24gb3IgdW5zcGVjaWZpZWRcbiAgICAgICAgICAgICAgIC8vIC0gYm90aCBYIGFuZCBZIGFyZSBtZWFzdXJlcyBvciBib3RoIGFyZSBkaW1lbnNpb25cbiAgICAgICAgICAgICAgIHVuZGVmaW5lZDsgIC8vXG4gICAgICAgICAgIH1cbiAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAvLyB0ZXh0LW9ubHlcbiAgICAgICAgIGNhc2UgJ2FsaWduJzpcbiAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2ZnW3Byb3BlcnR5XSA9IGhhcyhzcGVjLmVuY29kaW5nLCBYKSA/ICdjZW50ZXInIDogJ3JpZ2h0JztcbiAgICAgICAgICB9XG4gICAgICAgfVxuICAgICAgIHJldHVybiBjZmc7XG4gICAgIH0sIHt9KSxcbiAgICAgc3BlYy5jb25maWcubWFya1xuICAgKTtcbn1cbiIsImltcG9ydCAqIGFzIHZsRmllbGREZWYgZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtleHRlbmQsIGtleXMsIHZhbHMsIHJlZHVjZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4vc3RhY2snO1xuXG5pbXBvcnQge2F1dG9NYXhCaW5zfSBmcm9tICcuLi9iaW4nO1xuaW1wb3J0IHtDaGFubmVsLCBYLCBZLCBST1csIENPTFVNTn0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge1NPVVJDRSwgU1RBQ0tFRF9TQ0FMRSwgTEFZT1VULCBTVU1NQVJZfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7ZmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge3R5cGUgYXMgc2NhbGVUeXBlfSBmcm9tICcuL3NjYWxlJztcbmltcG9ydCB7cGFyc2VFeHByZXNzaW9uLCByYXdEb21haW59IGZyb20gJy4vdGltZSc7XG5cbmNvbnN0IERFRkFVTFRfTlVMTF9GSUxURVJTID0ge1xuICBub21pbmFsOiBmYWxzZSxcbiAgb3JkaW5hbDogZmFsc2UsXG4gIHF1YW50aXRhdGl2ZTogdHJ1ZSxcbiAgdGVtcG9yYWw6IHRydWVcbn07XG5cbi8qKlxuICogQ3JlYXRlIFZlZ2EncyBkYXRhIGFycmF5IGZyb20gYSBnaXZlbiBtb2RlbC5cbiAqXG4gKiBAcGFyYW0gIG1vZGVsXG4gKiBAcmV0dXJuIEFycmF5IG9mIFZlZ2EgZGF0YS5cbiAqICAgICAgICAgICAgICAgICBUaGlzIGFsd2F5cyBpbmNsdWRlcyBhIFwic291cmNlXCIgZGF0YSB0YWJsZS5cbiAqICAgICAgICAgICAgICAgICBJZiB0aGUgbW9kZWwgY29udGFpbnMgYWdncmVnYXRlIHZhbHVlLCB0aGlzIHdpbGwgYWxzbyBjcmVhdGVcbiAqICAgICAgICAgICAgICAgICBhZ2dyZWdhdGUgdGFibGUgYXMgd2VsbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVEYXRhKG1vZGVsOiBNb2RlbCk6IFZnRGF0YVtdIHtcbiAgY29uc3QgZGVmID0gW3NvdXJjZS5kZWYobW9kZWwpXTtcblxuICBjb25zdCBzdW1tYXJ5RGVmID0gc3VtbWFyeS5kZWYobW9kZWwpO1xuICBpZiAoc3VtbWFyeURlZikge1xuICAgIGRlZi5wdXNoKHN1bW1hcnlEZWYpO1xuICB9XG5cbiAgLy8gYXBwZW5kIG5vbi1wb3NpdGl2ZSBmaWx0ZXIgYXQgdGhlIGVuZCBmb3IgdGhlIGRhdGEgdGFibGVcbiAgZmlsdGVyTm9uUG9zaXRpdmVGb3JMb2coZGVmW2RlZi5sZW5ndGggLSAxXSwgbW9kZWwpO1xuXG4gIC8vIGFkZCBzdGF0cyBmb3IgbGF5b3V0IGNhbGN1bGF0aW9uXG4gIGNvbnN0IGxheW91dERlZiA9IGxheW91dC5kZWYobW9kZWwpO1xuICBpZihsYXlvdXREZWYpIHtcbiAgICBkZWYucHVzaChsYXlvdXREZWYpO1xuICB9XG5cbiAgLy8gU3RhY2tcbiAgY29uc3Qgc3RhY2tEZWYgPSBtb2RlbC5zdGFjaygpO1xuICBpZiAoc3RhY2tEZWYpIHtcbiAgICBkZWYucHVzaChzdGFjay5kZWYobW9kZWwsIHN0YWNrRGVmKSk7XG4gIH1cblxuICByZXR1cm4gZGVmLmNvbmNhdChcbiAgICBkYXRlcy5kZWZzKG1vZGVsKSAvLyBUaW1lIGRvbWFpbiB0YWJsZXNcbiAgKTtcbn1cblxuLy8gVE9ETzogQ29uc29saWRhdGUgYWxsIFZlZ2EgaW50ZXJmYWNlc1xuaW50ZXJmYWNlIFZnRGF0YSB7XG4gIG5hbWU6IHN0cmluZztcbiAgc291cmNlPzogc3RyaW5nO1xuICB2YWx1ZXM/OiBhbnk7XG4gIGZvcm1hdD86IGFueTtcbiAgdXJsPzogYW55O1xuICB0cmFuc2Zvcm0/OiBhbnk7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2Ugc291cmNlIHtcbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZihtb2RlbDogTW9kZWwpOiBWZ0RhdGEge1xuICAgIHZhciBzb3VyY2U6VmdEYXRhID0ge25hbWU6IFNPVVJDRX07XG5cbiAgICAvLyBEYXRhIHNvdXJjZSAodXJsIG9yIGlubGluZSlcbiAgICBpZiAobW9kZWwuaGFzVmFsdWVzKCkpIHtcbiAgICAgIHNvdXJjZS52YWx1ZXMgPSBtb2RlbC5kYXRhKCkudmFsdWVzO1xuICAgICAgc291cmNlLmZvcm1hdCA9IHt0eXBlOiAnanNvbid9O1xuICAgIH0gZWxzZSB7XG4gICAgICBzb3VyY2UudXJsID0gbW9kZWwuZGF0YSgpLnVybDtcbiAgICAgIHNvdXJjZS5mb3JtYXQgPSB7dHlwZTogbW9kZWwuZGF0YSgpLmZvcm1hdFR5cGV9O1xuICAgIH1cblxuICAgIC8vIFNldCBkYXRhJ3MgZm9ybWF0LnBhcnNlIGlmIG5lZWRlZFxuICAgIHZhciBwYXJzZSA9IGZvcm1hdFBhcnNlKG1vZGVsKTtcbiAgICBpZiAocGFyc2UpIHtcbiAgICAgIHNvdXJjZS5mb3JtYXQucGFyc2UgPSBwYXJzZTtcbiAgICB9XG5cbiAgICBzb3VyY2UudHJhbnNmb3JtID0gdHJhbnNmb3JtKG1vZGVsKTtcbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0UGFyc2UobW9kZWw6IE1vZGVsKSB7XG4gICAgY29uc3QgY2FsY0ZpZWxkTWFwID0gKG1vZGVsLnRyYW5zZm9ybSgpLmNhbGN1bGF0ZSB8fCBbXSkucmVkdWNlKGZ1bmN0aW9uKGZpZWxkTWFwLCBmb3JtdWxhKSB7XG4gICAgICBmaWVsZE1hcFtmb3JtdWxhLmZpZWxkXSA9IHRydWU7XG4gICAgICByZXR1cm4gZmllbGRNYXA7XG4gICAgfSwge30pO1xuXG4gICAgbGV0IHBhcnNlO1xuICAgIC8vIHVzZSBmb3JFYWNoIHJhdGhlciB0aGFuIHJlZHVjZSBzbyB0aGF0IGl0IGNhbiByZXR1cm4gdW5kZWZpbmVkXG4gICAgLy8gaWYgdGhlcmUgaXMgbm8gcGFyc2UgbmVlZGVkXG4gICAgbW9kZWwuZm9yRWFjaChmdW5jdGlvbihmaWVsZERlZjogRmllbGREZWYpIHtcbiAgICAgIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xuICAgICAgICBwYXJzZSA9IHBhcnNlIHx8IHt9O1xuICAgICAgICBwYXJzZVtmaWVsZERlZi5maWVsZF0gPSAnZGF0ZSc7XG4gICAgICB9IGVsc2UgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xuICAgICAgICBpZiAodmxGaWVsZERlZi5pc0NvdW50KGZpZWxkRGVmKSB8fCBjYWxjRmllbGRNYXBbZmllbGREZWYuZmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBhcnNlID0gcGFyc2UgfHwge307XG4gICAgICAgIHBhcnNlW2ZpZWxkRGVmLmZpZWxkXSA9ICdudW1iZXInO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwYXJzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBWZWdhIHRyYW5zZm9ybXMgZm9yIHRoZSBzb3VyY2UgZGF0YSB0YWJsZS4gIFRoaXMgY2FuIGluY2x1ZGVcbiAgICogdHJhbnNmb3JtcyBmb3IgdGltZSB1bml0LCBiaW5uaW5nIGFuZCBmaWx0ZXJpbmcuXG4gICAqL1xuICBleHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIG51bGwgZmlsdGVyIGNvbWVzIGZpcnN0IHNvIHRyYW5zZm9ybXMgYXJlIG5vdCBwZXJmb3JtZWQgb24gbnVsbCB2YWx1ZXNcbiAgICAvLyB0aW1lIGFuZCBiaW4gc2hvdWxkIGNvbWUgYmVmb3JlIGZpbHRlciBzbyB3ZSBjYW4gZmlsdGVyIGJ5IHRpbWUgYW5kIGJpblxuICAgIHJldHVybiBudWxsRmlsdGVyVHJhbnNmb3JtKG1vZGVsKS5jb25jYXQoXG4gICAgICBmb3JtdWxhVHJhbnNmb3JtKG1vZGVsKSxcbiAgICAgIGZpbHRlclRyYW5zZm9ybShtb2RlbCksXG4gICAgICBiaW5UcmFuc2Zvcm0obW9kZWwpLFxuICAgICAgdGltZVRyYW5zZm9ybShtb2RlbClcbiAgICApO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHRpbWVUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIG1vZGVsLnJlZHVjZShmdW5jdGlvbih0cmFuc2Zvcm0sIGZpZWxkRGVmOiBGaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgICAgY29uc3QgcmVmID0gZmllbGQoZmllbGREZWYsIHsgbm9mbjogdHJ1ZSwgZGF0dW06IHRydWUgfSk7XG4gICAgICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwgJiYgZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICBmaWVsZDogZmllbGQoZmllbGREZWYpLFxuICAgICAgICAgIGV4cHI6IHBhcnNlRXhwcmVzc2lvbihmaWVsZERlZi50aW1lVW5pdCwgcmVmKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cmFuc2Zvcm07XG4gICAgfSwgW10pO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJpblRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgICByZXR1cm4gbW9kZWwucmVkdWNlKGZ1bmN0aW9uKHRyYW5zZm9ybSwgZmllbGREZWY6IEZpZWxkRGVmLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBjb25zdCBiaW4gPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5iaW47XG4gICAgICBpZiAoYmluKSB7XG4gICAgICAgIGxldCBiaW5UcmFucyA9IGV4dGVuZCh7XG4gICAgICAgICAgICB0eXBlOiAnYmluJyxcbiAgICAgICAgICAgIGZpZWxkOiBmaWVsZERlZi5maWVsZCxcbiAgICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgICBzdGFydDogZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdfc3RhcnQnfSksXG4gICAgICAgICAgICAgIG1pZDogZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdfbWlkJ30pLFxuICAgICAgICAgICAgICBlbmQ6IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX2VuZCd9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLy8gaWYgYmluIGlzIGFuIG9iamVjdCwgbG9hZCBwYXJhbWV0ZXIgaGVyZSFcbiAgICAgICAgICB0eXBlb2YgYmluID09PSAnYm9vbGVhbicgPyB7fSA6IGJpblxuICAgICAgICApO1xuXG4gICAgICAgIGlmICghYmluVHJhbnMubWF4YmlucyAmJiAhYmluVHJhbnMuc3RlcCkge1xuICAgICAgICAgIC8vIGlmIGJvdGggbWF4YmlucyBhbmQgc3RlcCBhcmUgc3BlY2lmaWVkLCBuZWVkIHRvIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lIGJpblxuICAgICAgICAgIGJpblRyYW5zLm1heGJpbnMgPSBhdXRvTWF4QmlucyhjaGFubmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyYW5zZm9ybS5wdXNoKGJpblRyYW5zKTtcbiAgICAgICAgaWYgKHNjYWxlVHlwZShmaWVsZERlZiwgY2hhbm5lbCwgbW9kZWwubWFyaygpKSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICAgICAgZmllbGQ6IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX3JhbmdlJ30pLFxuICAgICAgICAgICAgZXhwcjogZmllbGQoZmllbGREZWYsIHtkYXR1bTogdHJ1ZSwgYmluU3VmZml4OiAnX3N0YXJ0J30pICtcbiAgICAgICAgICAgICAgICAgICcrIFxcJy1cXCcgKycgK1xuICAgICAgICAgICAgICAgICAgZmllbGQoZmllbGREZWYsIHtkYXR1bTogdHJ1ZSwgYmluU3VmZml4OiAnX2VuZCd9KVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJhbnNmb3JtO1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIEFuIGFycmF5IHRoYXQgbWlnaHQgY29udGFpbiBhIGZpbHRlciB0cmFuc2Zvcm0gZm9yIGZpbHRlcmluZyBudWxsIHZhbHVlIGJhc2VkIG9uIGZpbHRlck51bCBjb25maWdcbiAgICovXG4gIGV4cG9ydCBmdW5jdGlvbiBudWxsRmlsdGVyVHJhbnNmb3JtKG1vZGVsOiBNb2RlbCkge1xuICAgIGNvbnN0IGZpbHRlck51bGwgPSBtb2RlbC50cmFuc2Zvcm0oKS5maWx0ZXJOdWxsO1xuICAgIGNvbnN0IGZpbHRlcmVkRmllbGRzID0ga2V5cyhtb2RlbC5yZWR1Y2UoZnVuY3Rpb24oYWdncmVnYXRvciwgZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gICAgICBpZiAoZmlsdGVyTnVsbCB8fFxuICAgICAgICAoZmlsdGVyTnVsbCA9PT0gdW5kZWZpbmVkICYmIGZpZWxkRGVmLmZpZWxkICYmIGZpZWxkRGVmLmZpZWxkICE9PSAnKicgJiYgREVGQVVMVF9OVUxMX0ZJTFRFUlNbZmllbGREZWYudHlwZV0pKSB7XG4gICAgICAgIGFnZ3JlZ2F0b3JbZmllbGREZWYuZmllbGRdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhZ2dyZWdhdG9yO1xuICAgIH0sIHt9KSk7XG5cbiAgICByZXR1cm4gZmlsdGVyZWRGaWVsZHMubGVuZ3RoID4gMCA/XG4gICAgICBbe1xuICAgICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgICAgdGVzdDogZmlsdGVyZWRGaWVsZHMubWFwKGZ1bmN0aW9uKGZpZWxkTmFtZSkge1xuICAgICAgICAgIHJldHVybiAnZGF0dW0uJyArIGZpZWxkTmFtZSArICchPT1udWxsJztcbiAgICAgICAgfSkuam9pbignICYmICcpXG4gICAgICB9XSA6IFtdO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGZpbHRlclRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgICB2YXIgZmlsdGVyID0gbW9kZWwudHJhbnNmb3JtKCkuZmlsdGVyO1xuICAgIHJldHVybiBmaWx0ZXIgPyBbe1xuICAgICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgICAgdGVzdDogZmlsdGVyXG4gICAgfV0gOiBbXTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBmb3JtdWxhVHJhbnNmb3JtKG1vZGVsOiBNb2RlbCkge1xuICAgIHJldHVybiAobW9kZWwudHJhbnNmb3JtKCkuY2FsY3VsYXRlIHx8IFtdKS5yZWR1Y2UoZnVuY3Rpb24odHJhbnNmb3JtLCBmb3JtdWxhKSB7XG4gICAgICB0cmFuc2Zvcm0ucHVzaChleHRlbmQoe3R5cGU6ICdmb3JtdWxhJ30sIGZvcm11bGEpKTtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm07XG4gICAgfSwgW10pO1xuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgbGF5b3V0IHtcblxuICBleHBvcnQgZnVuY3Rpb24gZGVmKG1vZGVsOiBNb2RlbCk6IFZnRGF0YSB7XG4gICAgbGV0IHN1bW1hcml6ZSA9IFtdO1xuICAgIGxldCBmb3JtdWxhcyA9IFtdO1xuXG4gICAgLy8gVE9ETzogaGFuZGxlIFwiZml0XCIgbW9kZVxuICAgIGlmIChtb2RlbC5oYXMoWCkgJiYgbW9kZWwuaXNPcmRpbmFsU2NhbGUoWCkpIHtcbiAgICAgIGNvbnN0IHhTY2FsZSA9IG1vZGVsLmZpZWxkRGVmKFgpLnNjYWxlO1xuICAgICAgY29uc3QgeEhhc0RvbWFpbiA9IHhTY2FsZS5kb21haW4gaW5zdGFuY2VvZiBBcnJheTtcbiAgICAgIGlmICgheEhhc0RvbWFpbikge1xuICAgICAgICBzdW1tYXJpemUucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCddXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeENhcmRpbmFsaXR5ID0geEhhc0RvbWFpbiA/IHhTY2FsZS5kb21haW4ubGVuZ3RoIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZmllbGQoWCwge2RhdHVtOiB0cnVlLCBwcmVmbjogJ2Rpc3RpbmN0Xyd9KTtcbiAgICAgIGZvcm11bGFzLnB1c2goe1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGZpZWxkOiAnY2VsbFdpZHRoJyxcbiAgICAgICAgZXhwcjogJygnICsgeENhcmRpbmFsaXR5ICsgJyArICcgKyB4U2NhbGUucGFkZGluZyArICcpICogJyArIHhTY2FsZS5iYW5kV2lkdGhcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChtb2RlbC5oYXMoWSkgJiYgbW9kZWwuaXNPcmRpbmFsU2NhbGUoWSkpIHtcbiAgICAgIGNvbnN0IHlTY2FsZSA9IG1vZGVsLmZpZWxkRGVmKFkpLnNjYWxlO1xuICAgICAgY29uc3QgeUhhc0RvbWFpbiA9IHlTY2FsZS5kb21haW4gaW5zdGFuY2VvZiBBcnJheTtcblxuICAgICAgaWYgKCF5SGFzRG9tYWluKSB7XG4gICAgICAgIHN1bW1hcml6ZS5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSksXG4gICAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHlDYXJkaW5hbGl0eSA9IHlIYXNEb21haW4gPyB5U2NhbGUuZG9tYWluLmxlbmd0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmZpZWxkKFksIHtkYXR1bTogdHJ1ZSwgcHJlZm46ICdkaXN0aW5jdF8nfSk7XG4gICAgICBmb3JtdWxhcy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBmaWVsZDogJ2NlbGxIZWlnaHQnLFxuICAgICAgICBleHByOiAnKCcgKyB5Q2FyZGluYWxpdHkgKyAnICsgJyArIHlTY2FsZS5wYWRkaW5nICsgJykgKiAnICsgeVNjYWxlLmJhbmRXaWR0aFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgbGF5b3V0ID0gbW9kZWwubGF5b3V0KCk7XG5cbiAgICBpZiAobW9kZWwuaGFzKENPTFVNTikpIHtcbiAgICAgIGNvbnN0IGxheW91dENlbGxXaWR0aCA9IGxheW91dC5jZWxsV2lkdGg7XG4gICAgICBjb25zdCBjZWxsV2lkdGggPSB0eXBlb2YgbGF5b3V0Q2VsbFdpZHRoICE9PSAnbnVtYmVyJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0dW0uJyArIGxheW91dENlbGxXaWR0aC5maWVsZCA6XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXRDZWxsV2lkdGg7XG4gICAgICBjb25zdCBjb2xTY2FsZSA9IG1vZGVsLmZpZWxkRGVmKENPTFVNTikuc2NhbGU7XG4gICAgICBjb25zdCBjb2xIYXNEb21haW4gPSBjb2xTY2FsZS5kb21haW4gaW5zdGFuY2VvZiBBcnJheTtcbiAgICAgIGlmICghY29sSGFzRG9tYWluKSB7XG4gICAgICAgIHN1bW1hcml6ZS5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoQ09MVU1OKSxcbiAgICAgICAgICBvcHM6IFsnZGlzdGluY3QnXVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29sQ2FyZGluYWxpdHkgPSBjb2xIYXNEb21haW4gPyBjb2xTY2FsZS5kb21haW4ubGVuZ3RoIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5maWVsZChDT0xVTU4sIHtkYXR1bTogdHJ1ZSwgcHJlZm46ICdkaXN0aW5jdF8nfSk7XG4gICAgICBmb3JtdWxhcy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBmaWVsZDogJ3dpZHRoJyxcbiAgICAgICAgZXhwcjogJygnICsgY2VsbFdpZHRoICsgJyArICcgKyBjb2xTY2FsZS5wYWRkaW5nICsgJyknICsgJyAqICcgKyBjb2xDYXJkaW5hbGl0eVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG1vZGVsLmhhcyhST1cpKSB7XG4gICAgICBjb25zdCBsYXlvdXRDZWxsSGVpZ2h0ID0gbGF5b3V0LmNlbGxIZWlnaHQ7XG4gICAgICBjb25zdCBjZWxsSGVpZ2h0ID0gdHlwZW9mIGxheW91dENlbGxIZWlnaHQgIT09ICdudW1iZXInID9cbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXR1bS4nICsgbGF5b3V0Q2VsbEhlaWdodC5maWVsZCA6XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXRDZWxsSGVpZ2h0O1xuICAgICAgY29uc3Qgcm93U2NhbGUgPSBtb2RlbC5maWVsZERlZihST1cpLnNjYWxlO1xuICAgICAgY29uc3Qgcm93SGFzRG9tYWluID0gcm93U2NhbGUuZG9tYWluIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgICBpZiAoIXJvd0hhc0RvbWFpbikge1xuICAgICAgICBzdW1tYXJpemUucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFJPVyksXG4gICAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJvd0NhcmRpbmFsaXR5ID0gcm93SGFzRG9tYWluID8gcm93U2NhbGUuZG9tYWluLmxlbmd0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZmllbGQoUk9XLCB7ZGF0dW06IHRydWUsIHByZWZuOiAnZGlzdGluY3RfJ30pO1xuICAgICAgZm9ybXVsYXMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgZmllbGQ6ICdoZWlnaHQnLFxuICAgICAgICBleHByOiAnKCcgKyBjZWxsSGVpZ2h0ICsgJysnICsgcm93U2NhbGUucGFkZGluZyArICcpJyArICcgKiAnICsgcm93Q2FyZGluYWxpdHlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChmb3JtdWxhcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gc3VtbWFyaXplLmxlbmd0aCA+IDAgPyB7XG4gICAgICAgIG5hbWU6IExBWU9VVCxcbiAgICAgICAgc291cmNlOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgICBzdW1tYXJpemU6IHN1bW1hcml6ZVxuICAgICAgICAgIH1dLmNvbmNhdChmb3JtdWxhcylcbiAgICAgIH0gOiB7XG4gICAgICAgIG5hbWU6IExBWU9VVCxcbiAgICAgICAgdmFsdWVzOiBbe31dLFxuICAgICAgICB0cmFuc2Zvcm06IGZvcm11bGFzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIHN1bW1hcnkge1xuICBleHBvcnQgZnVuY3Rpb24gZGVmKG1vZGVsOiBNb2RlbCk6VmdEYXRhIHtcbiAgICAvKiBkaWN0IHNldCBmb3IgZGltZW5zaW9ucyAqL1xuICAgIHZhciBkaW1zID0ge307XG5cbiAgICAvKiBkaWN0aW9uYXJ5IG1hcHBpbmcgZmllbGQgbmFtZSA9PiBkaWN0IHNldCBvZiBhZ2dyZWdhdGlvbiBmdW5jdGlvbnMgKi9cbiAgICB2YXIgbWVhcyA9IHt9O1xuXG4gICAgdmFyIGhhc0FnZ3JlZ2F0ZSA9IGZhbHNlO1xuXG4gICAgbW9kZWwuZm9yRWFjaChmdW5jdGlvbihmaWVsZERlZjogRmllbGREZWYsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICAgIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgaGFzQWdncmVnYXRlID0gdHJ1ZTtcbiAgICAgICAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jykge1xuICAgICAgICAgIG1lYXNbJyonXSA9IG1lYXNbJyonXSB8fCB7fTtcbiAgICAgICAgICBtZWFzWycqJ10uY291bnQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdID0gbWVhc1tmaWVsZERlZi5maWVsZF0gfHwge307XG4gICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF1bZmllbGREZWYuYWdncmVnYXRlXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgICBkaW1zW2ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX3N0YXJ0J30pXSA9IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX3N0YXJ0J30pO1xuICAgICAgICAgIGRpbXNbZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdfbWlkJ30pXSA9IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX21pZCd9KTtcbiAgICAgICAgICBkaW1zW2ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX2VuZCd9KV0gPSBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19lbmQnfSk7XG5cbiAgICAgICAgICBpZiAoc2NhbGVUeXBlKGZpZWxkRGVmLCBjaGFubmVsLCBtb2RlbC5tYXJrKCkpID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgICAgIC8vIGFsc28gcHJvZHVjZSBiaW5fcmFuZ2UgaWYgdGhlIGJpbm5lZCBmaWVsZCB1c2Ugb3JkaW5hbCBzY2FsZVxuICAgICAgICAgICAgZGltc1tmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19yYW5nZSd9KV0gPSBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19yYW5nZSd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGltc1tmaWVsZChmaWVsZERlZildID0gZmllbGQoZmllbGREZWYpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgZ3JvdXBieSA9IHZhbHMoZGltcyk7XG5cbiAgICAvLyBzaG9ydC1mb3JtYXQgc3VtbWFyaXplIG9iamVjdCBmb3IgVmVnYSdzIGFnZ3JlZ2F0ZSB0cmFuc2Zvcm1cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhL3dpa2kvRGF0YS1UcmFuc2Zvcm1zIy1hZ2dyZWdhdGVcbiAgICB2YXIgc3VtbWFyaXplID0gcmVkdWNlKG1lYXMsIGZ1bmN0aW9uKGFnZ3JlZ2F0b3IsIGZuRGljdFNldCwgZmllbGQpIHtcbiAgICAgIGFnZ3JlZ2F0b3JbZmllbGRdID0ga2V5cyhmbkRpY3RTZXQpO1xuICAgICAgcmV0dXJuIGFnZ3JlZ2F0b3I7XG4gICAgfSwge30pO1xuXG4gICAgaWYgKGhhc0FnZ3JlZ2F0ZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogU1VNTUFSWSxcbiAgICAgICAgc291cmNlOiBTT1VSQ0UsXG4gICAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgICBncm91cGJ5OiBncm91cGJ5LFxuICAgICAgICAgIHN1bW1hcml6ZTogc3VtbWFyaXplXG4gICAgICAgIH1dXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIHN0YWNrIHtcbiAgLyoqXG4gICAqIEFkZCBzdGFja2VkIGRhdGEgc291cmNlLCBmb3IgZmVlZGluZyB0aGUgc2hhcmVkIHNjYWxlLlxuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZihtb2RlbDogTW9kZWwsIHN0YWNrUHJvcHM6IFN0YWNrUHJvcGVydGllcyk6VmdEYXRhIHtcbiAgICB2YXIgZ3JvdXBieUNoYW5uZWwgPSBzdGFja1Byb3BzLmdyb3VwYnlDaGFubmVsO1xuICAgIHZhciBmaWVsZENoYW5uZWwgPSBzdGFja1Byb3BzLmZpZWxkQ2hhbm5lbDtcbiAgICB2YXIgZmFjZXRGaWVsZHMgPSAobW9kZWwuaGFzKENPTFVNTikgPyBbbW9kZWwuZmllbGQoQ09MVU1OKV0gOiBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KChtb2RlbC5oYXMoUk9XKSA/IFttb2RlbC5maWVsZChST1cpXSA6IFtdKSk7XG5cbiAgICB2YXIgc3RhY2tlZDpWZ0RhdGEgPSB7XG4gICAgICBuYW1lOiBTVEFDS0VEX1NDQUxFLFxuICAgICAgc291cmNlOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIC8vIGdyb3VwIGJ5IGNoYW5uZWwgYW5kIG90aGVyIGZhY2V0c1xuICAgICAgICBncm91cGJ5OiBbbW9kZWwuZmllbGQoZ3JvdXBieUNoYW5uZWwpXS5jb25jYXQoZmFjZXRGaWVsZHMpLFxuICAgICAgICAvLyBwcm9kdWNlIHN1bSBvZiB0aGUgZmllbGQncyB2YWx1ZSBlLmcuLCBzdW0gb2Ygc3VtLCBzdW0gb2YgZGlzdGluY3RcbiAgICAgICAgc3VtbWFyaXplOiBbe29wczogWydzdW0nXSwgZmllbGQ6IG1vZGVsLmZpZWxkKGZpZWxkQ2hhbm5lbCl9XVxuICAgICAgfV1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHN0YWNrZWQ7XG4gIH07XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgZGF0ZXMge1xuICAvKipcbiAgICogQWRkIGRhdGEgc291cmNlIGZvciB3aXRoIGRhdGVzIGZvciBhbGwgbW9udGhzLCBkYXlzLCBob3VycywgLi4uIGFzIG5lZWRlZC5cbiAgICovXG4gIGV4cG9ydCBmdW5jdGlvbiBkZWZzKG1vZGVsOiBNb2RlbCkge1xuICAgIGxldCBhbHJlYWR5QWRkZWQgPSB7fTtcblxuICAgIHJldHVybiBtb2RlbC5yZWR1Y2UoZnVuY3Rpb24oYWdncmVnYXRvciwgZmllbGREZWY6IEZpZWxkRGVmLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgY29uc3QgZG9tYWluID0gcmF3RG9tYWluKGZpZWxkRGVmLnRpbWVVbml0LCBjaGFubmVsKTtcbiAgICAgICAgaWYgKGRvbWFpbiAmJiAhYWxyZWFkeUFkZGVkW2ZpZWxkRGVmLnRpbWVVbml0XSkge1xuICAgICAgICAgIGFscmVhZHlBZGRlZFtmaWVsZERlZi50aW1lVW5pdF0gPSB0cnVlO1xuICAgICAgICAgIGFnZ3JlZ2F0b3IucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBmaWVsZERlZi50aW1lVW5pdCxcbiAgICAgICAgICAgIHZhbHVlczogZG9tYWluLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgICAgICAgIGZpZWxkOiAnZGF0ZScsXG4gICAgICAgICAgICAgIGV4cHI6IHBhcnNlRXhwcmVzc2lvbihmaWVsZERlZi50aW1lVW5pdCwgJ2RhdHVtLmRhdGEnLCB0cnVlKVxuICAgICAgICAgICAgfV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGFnZ3JlZ2F0b3I7XG4gICAgfSwgW10pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJOb25Qb3NpdGl2ZUZvckxvZyhkYXRhVGFibGUsIG1vZGVsOiBNb2RlbCkge1xuICBtb2RlbC5mb3JFYWNoKGZ1bmN0aW9uKF8sIGNoYW5uZWwpIHtcbiAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlO1xuICAgIGlmIChzY2FsZSAmJiBzY2FsZS50eXBlID09PSAnbG9nJykge1xuICAgICAgZGF0YVRhYmxlLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIHRlc3Q6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtkYXR1bTogdHJ1ZX0pICsgJyA+IDAnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7ZXh0ZW5kfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFl9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5cbmltcG9ydCB7Y29tcGlsZUF4aXN9IGZyb20gJy4vYXhpcyc7XG5pbXBvcnQge2NvbXBpbGVTY2FsZXN9IGZyb20gJy4vc2NhbGUnO1xuXG4vKipcbiAqIHJldHVybiBtaXhpbnMgdGhhdCBjb250YWlucyBtYXJrcywgc2NhbGVzLCBhbmQgYXhlcyBmb3IgdGhlIHJvb3RHcm91cFxuICovXG5leHBvcnQgZnVuY3Rpb24gZmFjZXRNaXhpbnMobW9kZWw6IE1vZGVsLCBtYXJrcykge1xuICBjb25zdCBsYXlvdXQgPSBtb2RlbC5sYXlvdXQoKTtcbiAgY29uc3QgY2VsbENvbmZpZyA9IG1vZGVsLmNvbmZpZygpLmNlbGw7XG4gIGNvbnN0IGNlbGxXaWR0aDogYW55ID0gIW1vZGVsLmhhcyhDT0xVTU4pID9cbiAgICAgIHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX0gOiAgICAgLy8gY2VsbFdpZHRoID0gd2lkdGggLS0ganVzdCB1c2UgZ3JvdXAnc1xuICAgIHR5cGVvZiBsYXlvdXQuY2VsbFdpZHRoICE9PSAnbnVtYmVyJyA/XG4gICAgICB7c2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xVTU4pLCBiYW5kOiB0cnVlfSA6IC8vIGJhbmRTaXplIG9mIHRoZSBzY2FsZVxuICAgICAge3ZhbHVlOiBsYXlvdXQuY2VsbFdpZHRofTsgICAgICAvLyBzdGF0aWMgdmFsdWVcblxuICBjb25zdCBjZWxsSGVpZ2h0OiBhbnkgPSAhbW9kZWwuaGFzKFJPVykgP1xuICAgICAge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX0gOiAgLy8gY2VsbEhlaWdodCA9IGhlaWdodCAtLSBqdXN0IHVzZSBncm91cCdzXG4gICAgdHlwZW9mIGxheW91dC5jZWxsSGVpZ2h0ICE9PSAnbnVtYmVyJyA/XG4gICAgICB7c2NhbGU6IG1vZGVsLnNjYWxlTmFtZShST1cpLCBiYW5kOiB0cnVlfSA6ICAvLyBiYW5kU2l6ZSBvZiB0aGUgc2NhbGVcbiAgICAgIHt2YWx1ZTogbGF5b3V0LmNlbGxIZWlnaHR9OyAgIC8vIHN0YXRpYyB2YWx1ZVxuXG4gIGxldCBmYWNldEdyb3VwUHJvcGVydGllczogYW55ID0ge1xuICAgIHdpZHRoOiBjZWxsV2lkdGgsXG4gICAgaGVpZ2h0OiBjZWxsSGVpZ2h0XG4gIH07XG5cbiAgLy8gYWRkIGNvbmZpZ3MgdGhhdCBhcmUgdGhlIHJlc3VsdGluZyBncm91cCBtYXJrcyBwcm9wZXJ0aWVzXG4gIFsnY2xpcCcsICdmaWxsJywgJ2ZpbGxPcGFjaXR5JywgJ3N0cm9rZScsICdzdHJva2VXaWR0aCcsXG4gICAgJ3N0cm9rZU9wYWNpdHknLCAnc3Ryb2tlRGFzaCcsICdzdHJva2VEYXNoT2Zmc2V0J11cbiAgICAuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjZWxsQ29uZmlnW3Byb3BlcnR5XTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGZhY2V0R3JvdXBQcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IHt2YWx1ZTogdmFsdWV9O1xuICAgICAgfVxuICAgIH0pO1xuXG4gIGxldCByb290TWFya3MgPSBbXSwgcm9vdEF4ZXMgPSBbXSwgZmFjZXRLZXlzID0gW10sIGNlbGxBeGVzID0gW107XG4gIGNvbnN0IGhhc1JvdyA9IG1vZGVsLmhhcyhST1cpLCBoYXNDb2wgPSBtb2RlbC5oYXMoQ09MVU1OKTtcblxuICAvLyBUT0RPKCM5MCk6IGFkZCBwcm9wZXJ0eSB0byBrZWVwIGF4ZXMgaW4gY2VsbHMgZXZlbiBpZiByb3cgaXMgZW5jb2RlZFxuICBpZiAoaGFzUm93KSB7XG4gICAgaWYgKCFtb2RlbC5pc0RpbWVuc2lvbihST1cpKSB7XG4gICAgICAvLyBUT0RPOiBhZGQgZXJyb3IgdG8gbW9kZWwgaW5zdGVhZFxuICAgICAgdXRpbC5lcnJvcignUm93IGVuY29kaW5nIHNob3VsZCBiZSBvcmRpbmFsLicpO1xuICAgIH1cbiAgICBmYWNldEdyb3VwUHJvcGVydGllcy55ID0ge1xuICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShST1cpLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFJPVyksXG4gICAgICBvZmZzZXQ6IG1vZGVsLmZpZWxkRGVmKFJPVykuc2NhbGUucGFkZGluZyAvIDJcbiAgICB9O1xuXG4gICAgZmFjZXRLZXlzLnB1c2gobW9kZWwuZmllbGQoUk9XKSk7XG4gICAgcm9vdEF4ZXMucHVzaChjb21waWxlQXhpcyhST1csIG1vZGVsKSk7XG4gICAgaWYgKG1vZGVsLmhhcyhYKSkge1xuICAgICAgLy8gSWYgaGFzIFgsIHByZXBlbmQgYSBncm91cCBmb3Igc2hhcmVkIHgtYXhlcyBpbiB0aGUgcm9vdCBncm91cCdzIG1hcmtzXG4gICAgICByb290TWFya3MucHVzaChnZXRYQXhlc0dyb3VwKG1vZGVsLCBjZWxsV2lkdGgsIGhhc0NvbCkpO1xuICAgIH1cbiAgICBjb25zdCByb3dBeGlzID0gbW9kZWwuZmllbGREZWYoUk9XKS5heGlzO1xuICAgIGlmICh0eXBlb2Ygcm93QXhpcyA9PT0gJ2Jvb2xlYW4nIHx8IHJvd0F4aXMuZ3JpZCAhPT0gZmFsc2UpIHtcbiAgICAgIHJvb3RNYXJrcy5wdXNoKGdldFJvd0dyaWRHcm91cChtb2RlbCwgY2VsbEhlaWdodCkpO1xuICAgIH1cbiAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIHJvd1xuICAgIGlmIChtb2RlbC5oYXMoWCkgJiYgbW9kZWwuZmllbGREZWYoWCkuYXhpcykgeyAvLyBrZWVwIHggYXhpcyBpbiB0aGUgY2VsbFxuICAgICAgY2VsbEF4ZXMucHVzaChjb21waWxlQXhpcyhYLCBtb2RlbCkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE8oIzkwKTogYWRkIHByb3BlcnR5IHRvIGtlZXAgYXhlcyBpbiBjZWxscyBldmVuIGlmIGNvbHVtbiBpcyBlbmNvZGVkXG4gIGlmIChoYXNDb2wpIHtcbiAgICBpZiAoIW1vZGVsLmlzRGltZW5zaW9uKENPTFVNTikpIHtcbiAgICAgIC8vIFRPRE86IGFkZCBlcnJvciB0byBtb2RlbCBpbnN0ZWFkXG4gICAgICB1dGlsLmVycm9yKCdDb2wgZW5jb2Rpbmcgc2hvdWxkIGJlIG9yZGluYWwuJyk7XG4gICAgfVxuICAgIGZhY2V0R3JvdXBQcm9wZXJ0aWVzLnggPSB7XG4gICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKENPTFVNTiksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoQ09MVU1OKSxcbiAgICAgIG9mZnNldDogbW9kZWwuZmllbGREZWYoQ09MVU1OKS5zY2FsZS5wYWRkaW5nIC8gMlxuICAgIH07XG5cbiAgICBmYWNldEtleXMucHVzaChtb2RlbC5maWVsZChDT0xVTU4pKTtcbiAgICByb290QXhlcy5wdXNoKGNvbXBpbGVBeGlzKENPTFVNTiwgbW9kZWwpKTtcblxuICAgIGlmIChtb2RlbC5oYXMoWSkpIHtcbiAgICAgIC8vIElmIGhhcyBZLCBwcmVwZW5kIGEgZ3JvdXAgZm9yIHNoYXJlZCB5LWF4ZXMgaW4gdGhlIHJvb3QgZ3JvdXAncyBtYXJrc1xuICAgICAgcm9vdE1hcmtzLnB1c2goZ2V0WUF4ZXNHcm91cChtb2RlbCwgY2VsbEhlaWdodCwgaGFzUm93KSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29sQXhpcyA9IG1vZGVsLmZpZWxkRGVmKENPTFVNTikuYXhpcztcbiAgICBpZiAodHlwZW9mIGNvbEF4aXMgPT09ICdib29sZWFuJyB8fCBjb2xBeGlzLmdyaWQgIT09IGZhbHNlKSB7XG4gICAgICByb290TWFya3MucHVzaChnZXRDb2x1bW5HcmlkR3JvdXAobW9kZWwsIGNlbGxXaWR0aCkpO1xuICAgIH1cbiAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIGNvbHVtblxuICAgIGlmIChtb2RlbC5oYXMoWSkgJiYgbW9kZWwuZmllbGREZWYoWSkuYXhpcykgeyAvLyBrZWVwIHkgYXhpcyBpbiB0aGUgY2VsbFxuICAgICAgY2VsbEF4ZXMucHVzaChjb21waWxlQXhpcyhZLCBtb2RlbCkpO1xuICAgIH1cbiAgfVxuICBjb25zdCBuYW1lID0gbW9kZWwuc3BlYygpLm5hbWU7XG4gIGxldCBmYWNldEdyb3VwOiBhbnkgPSB7XG4gICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgJ2NlbGwnLFxuICAgIHR5cGU6ICdncm91cCcsXG4gICAgZnJvbToge1xuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICB0cmFuc2Zvcm06IFt7dHlwZTogJ2ZhY2V0JywgZ3JvdXBieTogZmFjZXRLZXlzfV1cbiAgICB9LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHVwZGF0ZTogZmFjZXRHcm91cFByb3BlcnRpZXNcbiAgICB9LFxuICAgIG1hcmtzOiBtYXJrc1xuICB9O1xuICBpZiAoY2VsbEF4ZXMubGVuZ3RoID4gMCkge1xuICAgIGZhY2V0R3JvdXAuYXhlcyA9IGNlbGxBeGVzO1xuICB9XG4gIHJvb3RNYXJrcy5wdXNoKGZhY2V0R3JvdXApO1xuXG4gIHJldHVybiB7XG4gICAgbWFya3M6IHJvb3RNYXJrcyxcbiAgICBheGVzOiByb290QXhlcyxcbiAgICAvLyBhc3N1bWluZyBlcXVhbCBjZWxsV2lkdGggaGVyZVxuICAgIHNjYWxlczogY29tcGlsZVNjYWxlcyhcbiAgICAgIG1vZGVsLmNoYW5uZWxzKCksIC8vIFRPRE86IHdpdGggbmVzdGluZywgbm90IGFsbCBzY2FsZSBtaWdodCBiZSBhIHJvb3QtbGV2ZWxcbiAgICAgIG1vZGVsXG4gICAgKVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRYQXhlc0dyb3VwKG1vZGVsOiBNb2RlbCwgY2VsbFdpZHRoLCBoYXNDb2w6IGJvb2xlYW4pIHsgLy8gVE9ETzogVmdNYXJrc1xuICBjb25zdCBuYW1lID0gbW9kZWwuc3BlYygpLm5hbWU7XG4gIHJldHVybiBleHRlbmQoe1xuICAgICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgJ3gtYXhlcycsXG4gICAgICB0eXBlOiAnZ3JvdXAnXG4gICAgfSxcbiAgICBoYXNDb2wgPyB7XG4gICAgICBmcm9tOiB7XG4gICAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogW21vZGVsLmZpZWxkKENPTFVNTildLFxuICAgICAgICAgIHN1bW1hcml6ZTogeycqJzogJ2NvdW50J30gLy8ganVzdCBhIHBsYWNlaG9sZGVyIGFnZ3JlZ2F0aW9uXG4gICAgICAgIH1dXG4gICAgICB9XG4gICAgfSA6IHt9LFxuICAgIHtcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgd2lkdGg6IGNlbGxXaWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319LFxuICAgICAgICAgIHg6IGhhc0NvbCA/IHtzY2FsZTogbW9kZWwuc2NhbGVOYW1lKENPTFVNTiksIGZpZWxkOiBtb2RlbC5maWVsZChDT0xVTU4pfSA6IHt2YWx1ZTogMH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbW9kZWwuZmllbGREZWYoWCkuYXhpcyA/IHtcbiAgICAgIGF4ZXM6IFtjb21waWxlQXhpcyhYLCBtb2RlbCldXG4gICAgfToge31cbiAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0WUF4ZXNHcm91cChtb2RlbDogTW9kZWwsIGNlbGxIZWlnaHQsIGhhc1JvdzogYm9vbGVhbikgeyAvLyBUT0RPOiBWZ01hcmtzXG4gIGNvbnN0IG5hbWUgPSBtb2RlbC5zcGVjKCkubmFtZTtcbiAgcmV0dXJuIGV4dGVuZCh7XG4gICAgICBuYW1lOiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyAneS1heGVzJyxcbiAgICAgIHR5cGU6ICdncm91cCdcbiAgICB9LFxuICAgIGhhc1JvdyA/IHtcbiAgICAgIGZyb206IHtcbiAgICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgICBncm91cGJ5OiBbbW9kZWwuZmllbGQoUk9XKV0sXG4gICAgICAgICAgc3VtbWFyaXplOiB7JyonOiAnY291bnQnfSAvLyBqdXN0IGEgcGxhY2Vob2xkZXIgYWdncmVnYXRpb25cbiAgICAgICAgfV1cbiAgICAgIH1cbiAgICB9IDoge30sXG4gICAge1xuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICB3aWR0aDoge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9fSxcbiAgICAgICAgICBoZWlnaHQ6IGNlbGxIZWlnaHQsXG4gICAgICAgICAgeTogaGFzUm93ID8ge3NjYWxlOiBtb2RlbC5zY2FsZU5hbWUoUk9XKSwgZmllbGQ6IG1vZGVsLmZpZWxkKFJPVyl9IDoge3ZhbHVlOiAwfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gICAgbW9kZWwuZmllbGREZWYoWSkuYXhpcyA/IHtcbiAgICAgIGF4ZXM6IFtjb21waWxlQXhpcyhZLCBtb2RlbCldXG4gICAgfToge31cbiAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0Um93R3JpZEdyb3VwKG1vZGVsOiBNb2RlbCwgY2VsbEhlaWdodCk6IGFueSB7IC8vIFRPRE86IFZnTWFya3NcbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICBjb25zdCBjZWxsQ29uZmlnID0gbW9kZWwuY29uZmlnKCkuY2VsbDtcblxuICBjb25zdCByb3dHcmlkID0ge1xuICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICdyb3ctZ3JpZCcsXG4gICAgdHlwZTogJ3J1bGUnLFxuICAgIGZyb206IHtcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgdHJhbnNmb3JtOiBbe3R5cGU6ICdmYWNldCcsIGdyb3VwYnk6IFttb2RlbC5maWVsZChST1cpXX1dXG4gICAgfSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB1cGRhdGU6IHtcbiAgICAgICAgeToge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoUk9XKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoUk9XKVxuICAgICAgICB9LFxuICAgICAgICB4OiB7dmFsdWU6IDAsIG9mZnNldDogLWNlbGxDb25maWcuZ3JpZE9mZnNldCB9LFxuICAgICAgICB4Mjoge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9LCBvZmZzZXQ6IGNlbGxDb25maWcuZ3JpZE9mZnNldCB9LFxuICAgICAgICBzdHJva2U6IHsgdmFsdWU6IGNlbGxDb25maWcuZ3JpZENvbG9yIH0sXG4gICAgICAgIHN0cm9rZU9wYWNpdHk6IHsgdmFsdWU6IGNlbGxDb25maWcuZ3JpZE9wYWNpdHkgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCByb3dHcmlkT25Ub3AgPSAhbW9kZWwuaGFzKFgpIHx8IG1vZGVsLmF4aXMoWCkub3JpZW50ICE9PSAndG9wJztcbiAgaWYgKHJvd0dyaWRPblRvcCkgeyAvLyBvbiB0b3AgLSBubyBuZWVkIHRvIGFkZCBvZmZzZXRcbiAgICByZXR1cm4gcm93R3JpZDtcbiAgfSAvLyBvdGhlcndpc2UsIG5lZWQgdG8gb2Zmc2V0IGFsbCBncmlkIGJ5IGNlbGxIZWlnaHRcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyAncm93LWdyaWQtZ3JvdXAnLFxuICAgIHR5cGU6ICdncm91cCcsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdXBkYXRlOiB7XG4gICAgICAgIC8vIGFkZCBncm91cCBvZmZzZXQgPSBgY2VsbEhlaWdodCArIHBhZGRpbmdgIHRvIGF2b2lkIGNsYXNoaW5nIHdpdGggYXhpc1xuICAgICAgICB5OiBjZWxsSGVpZ2h0LnZhbHVlID8ge1xuICAgICAgICAgICAgLy8gSWYgY2VsbEhlaWdodCBjb250YWlucyB2YWx1ZSwganVzdCB1c2UgaXQuXG4gICAgICAgICAgICB2YWx1ZTogY2VsbEhlaWdodCxcbiAgICAgICAgICAgIG9mZnNldDogbW9kZWwuZmllbGREZWYoUk9XKS5zY2FsZS5wYWRkaW5nXG4gICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgbmVlZCB0byBnZXQgaXQgZnJvbSBsYXlvdXQgZGF0YSBpbiB0aGUgcm9vdCBncm91cFxuICAgICAgICAgICAgZmllbGQ6IHtwYXJlbnQ6ICdjZWxsSGVpZ2h0J30sXG4gICAgICAgICAgICBvZmZzZXQ6IG1vZGVsLmZpZWxkRGVmKFJPVykuc2NhbGUucGFkZGluZ1xuICAgICAgICAgIH0sXG4gICAgICAgIC8vIGluY2x1ZGUgd2lkdGggc28gaXQgY2FuIGJlIHJlZmVycmVkIGluc2lkZSByb3ctZ3JpZFxuICAgICAgICB3aWR0aDoge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9fVxuICAgICAgfVxuICAgIH0sXG4gICAgbWFya3M6IFtyb3dHcmlkXVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDb2x1bW5HcmlkR3JvdXAobW9kZWw6IE1vZGVsLCBjZWxsV2lkdGgpOiBhbnkgeyAvLyBUT0RPOiBWZ01hcmtzXG4gIGNvbnN0IG5hbWUgPSBtb2RlbC5zcGVjKCkubmFtZTtcbiAgY29uc3QgY2VsbENvbmZpZyA9IG1vZGVsLmNvbmZpZygpLmNlbGw7XG5cbiAgY29uc3QgY29sdW1uR3JpZCA9IHtcbiAgICBuYW1lOiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyAnY29sdW1uLWdyaWQnLFxuICAgIHR5cGU6ICdydWxlJyxcbiAgICBmcm9tOiB7XG4gICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIHRyYW5zZm9ybTogW3t0eXBlOiAnZmFjZXQnLCBncm91cGJ5OiBbbW9kZWwuZmllbGQoQ09MVU1OKV19XVxuICAgIH0sXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdXBkYXRlOiB7XG4gICAgICAgIHg6IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKENPTFVNTiksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKENPTFVNTilcbiAgICAgICAgfSxcbiAgICAgICAgeToge3ZhbHVlOiAwLCBvZmZzZXQ6IC1jZWxsQ29uZmlnLmdyaWRPZmZzZXR9LFxuICAgICAgICB5Mjoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfSwgb2Zmc2V0OiBjZWxsQ29uZmlnLmdyaWRPZmZzZXQgfSxcbiAgICAgICAgc3Ryb2tlOiB7IHZhbHVlOiBjZWxsQ29uZmlnLmdyaWRDb2xvciB9LFxuICAgICAgICBzdHJva2VPcGFjaXR5OiB7IHZhbHVlOiBjZWxsQ29uZmlnLmdyaWRPcGFjaXR5IH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY29sdW1uR3JpZE9uTGVmdCA9ICFtb2RlbC5oYXMoWSkgfHwgbW9kZWwuYXhpcyhZKS5vcmllbnQgPT09ICdyaWdodCc7XG4gIGlmIChjb2x1bW5HcmlkT25MZWZ0KSB7IC8vIG9uIGxlZnQsIG5vIG5lZWQgdG8gYWRkIGdsb2JhbCBvZmZzZXRcbiAgICByZXR1cm4gY29sdW1uR3JpZDtcbiAgfSAvLyBvdGhlcndpc2UsIG5lZWQgdG8gb2Zmc2V0IGFsbCBncmlkIGJ5IGNlbGxXaWR0aFxuICByZXR1cm4ge1xuICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICdjb2x1bW4tZ3JpZC1ncm91cCcsXG4gICAgdHlwZTogJ2dyb3VwJyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB1cGRhdGU6IHtcbiAgICAgICAgLy8gQWRkIGdyb3VwIG9mZnNldCA9IGBjZWxsV2lkdGggKyBwYWRkaW5nYCB0byBhdm9pZCBjbGFzaGluZyB3aXRoIGF4aXNcbiAgICAgICAgeDogY2VsbFdpZHRoLnZhbHVlID8ge1xuICAgICAgICAgICAgIC8vIElmIGNlbGxXaWR0aCBjb250YWlucyB2YWx1ZSwganVzdCB1c2UgaXQuXG4gICAgICAgICAgICAgdmFsdWU6IGNlbGxXaWR0aCxcbiAgICAgICAgICAgICBvZmZzZXQ6IG1vZGVsLmZpZWxkRGVmKENPTFVNTikuc2NhbGUucGFkZGluZ1xuICAgICAgICAgICB9IDoge1xuICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgbmVlZCB0byBnZXQgaXQgZnJvbSBsYXlvdXQgZGF0YSBpbiB0aGUgcm9vdCBncm91cFxuICAgICAgICAgICAgIGZpZWxkOiB7cGFyZW50OiAnY2VsbFdpZHRoJ30sXG4gICAgICAgICAgICAgb2Zmc2V0OiBtb2RlbC5maWVsZERlZihDT0xVTU4pLnNjYWxlLnBhZGRpbmdcbiAgICAgICAgICAgfSxcbiAgICAgICAgLy8gaW5jbHVkZSBoZWlnaHQgc28gaXQgY2FuIGJlIHJlZmVycmVkIGluc2lkZSBjb2x1bW4tZ3JpZFxuICAgICAgICBoZWlnaHQ6IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319XG4gICAgICB9XG4gICAgfSxcbiAgICBtYXJrczogW2NvbHVtbkdyaWRdXG4gIH07XG59XG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcblxuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWSwgVEVYVH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge1RFWFQgYXMgVEVYVF9NQVJLfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7TEFZT1VUfSBmcm9tICcuLi9kYXRhJztcblxuaW50ZXJmYWNlIERhdGFSZWYge1xuICBkYXRhPzogc3RyaW5nO1xuICBmaWVsZD86IHN0cmluZztcbiAgdmFsdWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGF5b3V0IHtcbiAgY2VsbFdpZHRoOiBMYXlvdXRWYWx1ZTtcbiAgY2VsbEhlaWdodDogTGF5b3V0VmFsdWU7XG4gIHdpZHRoOiBMYXlvdXRWYWx1ZTtcbiAgaGVpZ2h0OiBMYXlvdXRWYWx1ZTtcbn1cblxuLy8gdmFsdWUgdGhhdCB3ZSBjYW4gcHV0IGluIHNjYWxlJ3MgZG9tYWluL3JhbmdlIChlaXRoZXIgYSBudW1iZXIsIG9yIGEgZGF0YSByZWYpXG50eXBlIExheW91dFZhbHVlID0gbnVtYmVyIHwgRGF0YVJlZjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVMYXlvdXQobW9kZWw6IE1vZGVsKTogTGF5b3V0IHtcbiAgY29uc3QgY2VsbFdpZHRoID0gZ2V0Q2VsbFdpZHRoKG1vZGVsKTtcbiAgY29uc3QgY2VsbEhlaWdodCA9IGdldENlbGxIZWlnaHQobW9kZWwpO1xuICByZXR1cm4ge1xuICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHdob2xlIGNlbGxcbiAgICBjZWxsV2lkdGg6IGNlbGxXaWR0aCxcbiAgICBjZWxsSGVpZ2h0OiBjZWxsSGVpZ2h0LFxuICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGNoYXJ0XG4gICAgd2lkdGg6IGdldFdpZHRoKG1vZGVsLCBjZWxsV2lkdGgpLFxuICAgIGhlaWdodDogZ2V0SGVpZ2h0KG1vZGVsLCBjZWxsSGVpZ2h0KVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDZWxsV2lkdGgobW9kZWw6IE1vZGVsKTogTGF5b3V0VmFsdWUge1xuICBpZiAobW9kZWwuaGFzKFgpKSB7XG4gICAgaWYgKG1vZGVsLmlzT3JkaW5hbFNjYWxlKFgpKSB7IC8vIGNhbGN1bGF0ZSBpbiBkYXRhXG4gICAgICByZXR1cm4ge2RhdGE6IExBWU9VVCwgZmllbGQ6ICdjZWxsV2lkdGgnfTtcbiAgICB9XG4gICAgcmV0dXJuIG1vZGVsLmNvbmZpZygpLnVuaXQud2lkdGg7XG4gIH1cbiAgaWYgKG1vZGVsLm1hcmsoKSA9PT0gVEVYVF9NQVJLKSB7XG4gICAgcmV0dXJuIDkwOyAvLyBUT0RPOiBjb25maWcuc2NhbGUudGV4dEJhbmRXaWR0aFxuICB9XG4gIHJldHVybiAyMTsgLy8gVE9ETzogY29uZmlnLnNjYWxlLmJhbmRXaWR0aFxufVxuXG5mdW5jdGlvbiBnZXRXaWR0aChtb2RlbDogTW9kZWwsIGNlbGxXaWR0aDogTGF5b3V0VmFsdWUpOiBMYXlvdXRWYWx1ZSB7XG4gIGlmIChtb2RlbC5oYXMoQ09MVU1OKSkgeyAvLyBjYWxjdWxhdGUgaW4gZGF0YVxuICAgIHJldHVybiB7ZGF0YTogTEFZT1VULCBmaWVsZDogJ3dpZHRoJ307XG4gIH1cbiAgcmV0dXJuIGNlbGxXaWR0aDtcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbEhlaWdodChtb2RlbDogTW9kZWwpOiBMYXlvdXRWYWx1ZSB7XG4gIGlmIChtb2RlbC5oYXMoWSkpIHtcbiAgICBpZiAobW9kZWwuaXNPcmRpbmFsU2NhbGUoWSkpIHsgLy8gY2FsY3VsYXRlIGluIGRhdGFcbiAgICAgIHJldHVybiB7ZGF0YTogTEFZT1VULCBmaWVsZDogJ2NlbGxIZWlnaHQnfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG1vZGVsLmNvbmZpZygpLnVuaXQuaGVpZ2h0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gMjEgLyogY29uZmlnLnNjYWxlLmJhbmRXaWR0aCAqLztcbn1cblxuZnVuY3Rpb24gZ2V0SGVpZ2h0KG1vZGVsOiBNb2RlbCwgY2VsbEhlaWdodDogTGF5b3V0VmFsdWUpOiBMYXlvdXRWYWx1ZSB7XG4gIGlmIChtb2RlbC5oYXMoUk9XKSkge1xuICAgIHJldHVybiB7ZGF0YTogTEFZT1VULCBmaWVsZDogJ2hlaWdodCd9O1xuICB9XG4gIHJldHVybiBjZWxsSGVpZ2h0O1xufVxuIiwiaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5cbmltcG9ydCB7Q09MT1IsIFNJWkUsIFNIQVBFLCBDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7dGl0bGUgYXMgZmllbGRUaXRsZX0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtBUkVBLCBCQVIsIFRJQ0ssIFRFWFQsIExJTkUsIFBPSU5ULCBDSVJDTEUsIFNRVUFSRX0gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge2V4dGVuZCwga2V5c30gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7YXBwbHlNYXJrQ29uZmlnLCBGSUxMX1NUUk9LRV9DT05GSUcsIGZvcm1hdE1peGlucyBhcyB1dGlsRm9ybWF0TWl4aW5zfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUxlZ2VuZHMobW9kZWw6IE1vZGVsKSB7XG4gIHZhciBkZWZzID0gW107XG5cbiAgaWYgKG1vZGVsLmhhcyhDT0xPUikgJiYgbW9kZWwuZmllbGREZWYoQ09MT1IpLmxlZ2VuZCkge1xuICAgIGRlZnMucHVzaChjb21waWxlTGVnZW5kKG1vZGVsLCBDT0xPUiwge1xuICAgICAgZmlsbDogbW9kZWwuc2NhbGVOYW1lKENPTE9SKVxuICAgICAgLy8gVE9ETzogY29uc2lkZXIgaWYgdGhpcyBzaG91bGQgYmUgc3Ryb2tlIGZvciBsaW5lXG4gICAgfSkpO1xuICB9XG5cbiAgaWYgKG1vZGVsLmhhcyhTSVpFKSAmJiBtb2RlbC5maWVsZERlZihTSVpFKS5sZWdlbmQpIHtcbiAgICBkZWZzLnB1c2goY29tcGlsZUxlZ2VuZChtb2RlbCwgU0laRSwge1xuICAgICAgc2l6ZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpXG4gICAgfSkpO1xuICB9XG5cbiAgaWYgKG1vZGVsLmhhcyhTSEFQRSkgJiYgbW9kZWwuZmllbGREZWYoU0hBUEUpLmxlZ2VuZCkge1xuICAgIGRlZnMucHVzaChjb21waWxlTGVnZW5kKG1vZGVsLCBTSEFQRSwge1xuICAgICAgc2hhcGU6IG1vZGVsLnNjYWxlTmFtZShTSEFQRSlcbiAgICB9KSk7XG4gIH1cbiAgcmV0dXJuIGRlZnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTGVnZW5kKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgZGVmKSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gIGNvbnN0IGxlZ2VuZCA9IGZpZWxkRGVmLmxlZ2VuZDtcblxuICAvLyAxLjEgQWRkIHByb3BlcnRpZXMgd2l0aCBzcGVjaWFsIHJ1bGVzXG4gIGRlZi50aXRsZSA9IHRpdGxlKGZpZWxkRGVmKTtcblxuICBleHRlbmQoZGVmLCBmb3JtYXRNaXhpbnMobW9kZWwsIGNoYW5uZWwpKTtcblxuICAvLyAxLjIgQWRkIHByb3BlcnRpZXMgd2l0aG91dCBydWxlc1xuICBbJ29yaWVudCcsICd2YWx1ZXMnXS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgY29uc3QgdmFsdWUgPSBsZWdlbmRbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWZbcHJvcGVydHldID0gdmFsdWU7XG4gICAgfVxuICB9KTtcblxuICAvLyAyKSBBZGQgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9uIGdyb3Vwc1xuICBjb25zdCBwcm9wcyA9ICh0eXBlb2YgbGVnZW5kICE9PSAnYm9vbGVhbicgJiYgbGVnZW5kLnByb3BlcnRpZXMpIHx8IHt9O1xuICBbJ3RpdGxlJywgJ3N5bWJvbHMnLCAnbGVnZW5kJ10uZm9yRWFjaChmdW5jdGlvbihncm91cCkge1xuICAgIGxldCB2YWx1ZSA9IHByb3BlcnRpZXNbZ3JvdXBdID9cbiAgICAgIHByb3BlcnRpZXNbZ3JvdXBdKGZpZWxkRGVmLCBwcm9wc1tncm91cF0sIG1vZGVsLCBjaGFubmVsKSA6IC8vIGFwcGx5IHJ1bGVcbiAgICAgIHByb3BzW2dyb3VwXTsgLy8gbm8gcnVsZSAtLSBqdXN0IGRlZmF1bHQgdmFsdWVzXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlZi5wcm9wZXJ0aWVzID0gZGVmLnByb3BlcnRpZXMgfHwge307XG4gICAgICBkZWYucHJvcGVydGllc1tncm91cF0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShmaWVsZERlZjogRmllbGREZWYpIHtcbiAgY29uc3QgbGVnZW5kID0gZmllbGREZWYubGVnZW5kO1xuICBpZiAodHlwZW9mIGxlZ2VuZCAhPT0gJ2Jvb2xlYW4nICYmIGxlZ2VuZC50aXRsZSkge1xuICAgIHJldHVybiBsZWdlbmQudGl0bGU7XG4gIH1cblxuICByZXR1cm4gZmllbGRUaXRsZShmaWVsZERlZik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRNaXhpbnMobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgLy8gSWYgdGhlIGNoYW5uZWwgaXMgYmlubmVkLCB3ZSBzaG91bGQgbm90IHNldCB0aGUgZm9ybWF0IGJlY2F1c2Ugd2UgaGF2ZSBhIHJhbmdlIGxhYmVsXG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBjb25zdCBsZWdlbmQgPSBmaWVsZERlZi5sZWdlbmQ7XG4gIHJldHVybiB1dGlsRm9ybWF0TWl4aW5zKG1vZGVsLCBjaGFubmVsLCB0eXBlb2YgbGVnZW5kICE9PSAnYm9vbGVhbicgPyBsZWdlbmQuZm9ybWF0IDogdW5kZWZpbmVkKTtcbn1cblxubmFtZXNwYWNlIHByb3BlcnRpZXMge1xuICBleHBvcnQgZnVuY3Rpb24gc3ltYm9scyhmaWVsZERlZjogRmllbGREZWYsIHN5bWJvbHNTcGVjLCBtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICBsZXQgc3ltYm9sczphbnkgPSB7fTtcbiAgICBjb25zdCBtYXJrID0gbW9kZWwubWFyaygpO1xuXG4gICAgc3dpdGNoIChtYXJrKSB7XG4gICAgICBjYXNlIEJBUjpcbiAgICAgIGNhc2UgVElDSzpcbiAgICAgIGNhc2UgVEVYVDpcbiAgICAgICAgc3ltYm9scy5zaGFwZSA9IHt2YWx1ZTogJ3NxdWFyZSd9O1xuXG4gICAgICAgIC8vIHNldCBzdHJva2UgdG8gdHJhbnNwYXJlbnQgYnkgZGVmYXVsdCB1bmxlc3MgdGhlcmUgaXMgYSBjb25maWcgZm9yIHN0cm9rZVxuICAgICAgICBzeW1ib2xzLnN0cm9rZSA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XG4gICAgICAgIGFwcGx5TWFya0NvbmZpZyhzeW1ib2xzLCBtb2RlbCwgRklMTF9TVFJPS0VfQ09ORklHKTtcblxuICAgICAgICAvLyBubyBuZWVkIHRvIGFwcGx5IGNvbG9yIHRvIGZpbGwgYXMgdGhleSBhcmUgc2V0IGF1dG9tYXRpY2FsbHlcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQ0lSQ0xFOlxuICAgICAgY2FzZSBTUVVBUkU6XG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXN3aXRjaC1jYXNlLWZhbGwtdGhyb3VnaCAqL1xuICAgICAgICBzeW1ib2xzLnNoYXBlID0ge3ZhbHVlOiBtYXJrfTtcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby1zd2l0Y2gtY2FzZS1mYWxsLXRocm91Z2ggKi9cbiAgICAgIGNhc2UgUE9JTlQ6XG4gICAgICAgIC8vIGZpbGwgb3Igc3Ryb2tlXG4gICAgICAgIGlmIChtb2RlbC5jb25maWcoKS5tYXJrLmZpbGxlZCkgeyAvLyBmaWxsZWRcbiAgICAgICAgICAvLyBzZXQgc3Ryb2tlIHRvIHRyYW5zcGFyZW50IGJ5IGRlZmF1bHQgdW5sZXNzIHRoZXJlIGlzIGEgY29uZmlnIGZvciBzdHJva2VcbiAgICAgICAgICBzeW1ib2xzLnN0cm9rZSA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XG4gICAgICAgICAgYXBwbHlNYXJrQ29uZmlnKHN5bWJvbHMsIG1vZGVsLCBGSUxMX1NUUk9LRV9DT05GSUcpO1xuXG4gICAgICAgICAgaWYgKG1vZGVsLmhhcyhDT0xPUikgJiYgY2hhbm5lbCA9PT0gQ09MT1IpIHtcbiAgICAgICAgICAgIHN5bWJvbHMuZmlsbCA9IHtzY2FsZTogbW9kZWwuc2NhbGVOYW1lKENPTE9SKSwgZmllbGQ6ICdkYXRhJ307XG4gICAgICAgICAgfSBlbHNlIGlmIChtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWUpIHtcbiAgICAgICAgICAgIHN5bWJvbHMuZmlsbCA9IHt2YWx1ZTogbW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3ltYm9scy5maWxsID0ge3ZhbHVlOiBtb2RlbC5jb25maWcoKS5tYXJrLmNvbG9yfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIHN0cm9rZWRcbiAgICAgICAgICAvLyBzZXQgZmlsbCB0byB0cmFuc3BhcmVudCBieSBkZWZhdWx0IHVubGVzcyB0aGVyZSBpcyBhIGNvbmZpZyBmb3Igc3Ryb2tlXG4gICAgICAgICAgc3ltYm9scy5maWxsID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcbiAgICAgICAgICBhcHBseU1hcmtDb25maWcoc3ltYm9scywgbW9kZWwsIEZJTExfU1RST0tFX0NPTkZJRyk7XG5cbiAgICAgICAgICBpZiAobW9kZWwuaGFzKENPTE9SKSAmJiBjaGFubmVsID09PSBDT0xPUikge1xuICAgICAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7c2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xPUiksIGZpZWxkOiAnZGF0YSd9O1xuICAgICAgICAgIH0gZWxzZSBpZiAobW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlKSB7XG4gICAgICAgICAgICBzeW1ib2xzLnN0cm9rZSA9IHt2YWx1ZTogbW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7dmFsdWU6IG1vZGVsLmNvbmZpZygpLm1hcmsuY29sb3J9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMSU5FOlxuICAgICAgY2FzZSBBUkVBOlxuICAgICAgICAvLyBzZXQgc3Ryb2tlIHRvIHRyYW5zcGFyZW50IGJ5IGRlZmF1bHQgdW5sZXNzIHRoZXJlIGlzIGEgY29uZmlnIGZvciBzdHJva2VcbiAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7dmFsdWU6ICd0cmFuc3BhcmVudCd9O1xuICAgICAgICBhcHBseU1hcmtDb25maWcoc3ltYm9scywgbW9kZWwsIEZJTExfU1RST0tFX0NPTkZJRyk7XG5cbiAgICAgICAgLy8gVE9ETyB1c2Ugc2hhcGUgaGVyZSBhZnRlciBpbXBsZW1lbnRpbmcgIzUwOFxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBzeW1ib2xzID0gZXh0ZW5kKHN5bWJvbHMsIHN5bWJvbHNTcGVjIHx8IHt9KTtcblxuICAgIHJldHVybiBrZXlzKHN5bWJvbHMpLmxlbmd0aCA+IDAgPyBzeW1ib2xzIDogdW5kZWZpbmVkO1xuICB9XG59XG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7WCwgWX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2FwcGx5Q29sb3JBbmRPcGFjaXR5LCBhcHBseU1hcmtDb25maWd9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgYXJlYSB7XG4gIGV4cG9ydCBmdW5jdGlvbiBtYXJrVHlwZSgpIHtcbiAgICByZXR1cm4gJ2FyZWEnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETyBVc2UgVmVnYSdzIG1hcmtzIHByb3BlcnRpZXMgaW50ZXJmYWNlXG4gICAgdmFyIHA6IGFueSA9IHt9O1xuXG4gICAgY29uc3Qgb3JpZW50ID0gbW9kZWwuY29uZmlnKCkubWFyay5vcmllbnQ7XG4gICAgaWYgKG9yaWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwLm9yaWVudCA9IHsgdmFsdWU6IG9yaWVudCB9O1xuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2soKTtcbiAgICAvLyB4XG4gICAgaWYgKHN0YWNrICYmIFggPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkgeyAvLyBTdGFja2VkIE1lYXN1cmVcbiAgICAgIHAueCA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgc3VmZml4OiAnX3N0YXJ0JyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmlzTWVhc3VyZShYKSkgeyAvLyBNZWFzdXJlXG4gICAgICBwLnggPSB7IHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksIGZpZWxkOiBtb2RlbC5maWVsZChYKSB9O1xuICAgIH0gZWxzZSBpZiAobW9kZWwuaXNEaW1lbnNpb24oWCkpIHtcbiAgICAgIHAueCA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8geDJcbiAgICBpZiAob3JpZW50ID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGlmIChzdGFjayAmJiBYID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcbiAgICAgICAgcC54MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IHN1ZmZpeDogJ19lbmQnIH0pXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLngyID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKHN0YWNrICYmIFkgPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkgeyAvLyBTdGFja2VkIE1lYXN1cmVcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgc3VmZml4OiAnX3N0YXJ0JyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmlzTWVhc3VyZShZKSkge1xuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSlcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAob3JpZW50ICE9PSAnaG9yaXpvbnRhbCcpIHsgLy8gJ3ZlcnRpY2FsJyBvciB1bmRlZmluZWQgYXJlIHZlcnRpY2FsXG4gICAgICBpZiAoc3RhY2sgJiYgWSA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XG4gICAgICAgIHAueTIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBzdWZmaXg6ICdfZW5kJyB9KVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcC55MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlDb2xvckFuZE9wYWNpdHkocCwgbW9kZWwpO1xuICAgIGFwcGx5TWFya0NvbmZpZyhwLCBtb2RlbCwgWydpbnRlcnBvbGF0ZScsICd0ZW5zaW9uJ10pO1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhYmVscyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPKCMyNDApOiBmaWxsIHRoaXMgbWV0aG9kXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge1gsIFksIFNJWkV9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHthcHBseUNvbG9yQW5kT3BhY2l0eX0gZnJvbSAnLi91dGlsJztcblxuXG5leHBvcnQgbmFtZXNwYWNlIGJhciB7XG4gIGV4cG9ydCBmdW5jdGlvbiBtYXJrVHlwZSgpIHtcbiAgICByZXR1cm4gJ3JlY3QnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETyBVc2UgVmVnYSdzIG1hcmtzIHByb3BlcnRpZXMgaW50ZXJmYWNlXG4gICAgbGV0IHA6IGFueSA9IHt9O1xuXG4gICAgY29uc3Qgb3JpZW50ID0gbW9kZWwuY29uZmlnKCkubWFyay5vcmllbnQ7XG5cbiAgICBjb25zdCBzdGFjayA9IG1vZGVsLnN0YWNrKCk7XG4gICAgLy8geCwgeDIsIGFuZCB3aWR0aCAtLSB3ZSBtdXN0IHNwZWNpZnkgdHdvIG9mIHRoZXNlIGluIGFsbCBjb25kaXRpb25zXG4gICAgaWYgKHN0YWNrICYmIFggPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xuICAgICAgLy8gJ3gnIGlzIGEgc3RhY2tlZCBtZWFzdXJlLCB0aHVzIHVzZSA8ZmllbGQ+X3N0YXJ0IGFuZCA8ZmllbGQ+X2VuZCBmb3IgeCwgeDIuXG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IHN1ZmZpeDogJ19zdGFydCcgfSlcbiAgICAgIH07XG4gICAgICBwLngyID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBzdWZmaXg6ICdfZW5kJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmlzTWVhc3VyZShYKSkge1xuICAgICAgaWYgKG9yaWVudCA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIHAueCA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYKVxuICAgICAgICB9O1xuICAgICAgICBwLngyID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7IC8vIHZlcnRpY2FsXG4gICAgICAgIHAueGMgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWClcbiAgICAgICAgfTtcbiAgICAgICAgcC53aWR0aCA9IHt2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKFgpfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1vZGVsLmZpZWxkRGVmKFgpLmJpbikge1xuICAgICAgaWYgKG1vZGVsLmhhcyhTSVpFKSAmJiBvcmllbnQgIT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAvLyBGb3IgdmVydGljYWwgY2hhcnQgdGhhdCBoYXMgYmlubmVkIFggYW5kIHNpemUsXG4gICAgICAgIC8vIGNlbnRlciBiYXIgYW5kIGFwcGx5IHNpemUgdG8gd2lkdGguXG4gICAgICAgIHAueGMgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgICB9O1xuICAgICAgICBwLndpZHRoID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoU0laRSksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLnggPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBiaW5TdWZmaXg6ICdfc3RhcnQnIH0pLFxuICAgICAgICAgIG9mZnNldDogMVxuICAgICAgICB9O1xuICAgICAgICBwLngyID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX2VuZCcgfSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyB4IGlzIGRpbWVuc2lvbiBvciB1bnNwZWNpZmllZFxuICAgICAgaWYgKG1vZGVsLmhhcyhYKSkgeyAvLyBpcyBvcmRpbmFsXG4gICAgICAgcC54YyA9IHtcbiAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWClcbiAgICAgICB9O1xuICAgICB9IGVsc2UgeyAvLyBubyB4XG4gICAgICAgIHAueCA9IHsgdmFsdWU6IDAsIG9mZnNldDogMiB9O1xuICAgICAgfVxuXG4gICAgICBwLndpZHRoID0gbW9kZWwuaGFzKFNJWkUpICYmIG9yaWVudCAhPT0gJ2hvcml6b250YWwnID8ge1xuICAgICAgICAgIC8vIGFwcGx5IHNpemUgc2NhbGUgaWYgaGFzIHNpemUgYW5kIGlzIHZlcnRpY2FsIChleHBsaWNpdCBcInZlcnRpY2FsXCIgb3IgdW5kZWZpbmVkKVxuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoU0laRSksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXG4gICAgICAgIH0gOiB7XG4gICAgICAgICAgLy8gb3RoZXJ3aXNlLCB1c2UgZml4ZWQgc2l6ZVxuICAgICAgICAgIHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoWClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyB5LCB5MiAmIGhlaWdodCAtLSB3ZSBtdXN0IHNwZWNpZnkgdHdvIG9mIHRoZXNlIGluIGFsbCBjb25kaXRpb25zXG4gICAgaWYgKHN0YWNrICYmIFkgPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkgeyAvLyB5IGlzIHN0YWNrZWQgbWVhc3VyZVxuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBzdWZmaXg6ICdfc3RhcnQnIH0pXG4gICAgICB9O1xuICAgICAgcC55MiA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgc3VmZml4OiAnX2VuZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5pc01lYXN1cmUoWSkpIHtcbiAgICAgIGlmIChvcmllbnQgIT09ICdob3Jpem9udGFsJykgeyAvLyB2ZXJ0aWNhbCAoZXhwbGljaXQgJ3ZlcnRpY2FsJyBvciB1bmRlZmluZWQpXG4gICAgICAgIHAueSA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZKVxuICAgICAgICB9O1xuICAgICAgICBwLnkyID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAueWMgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSlcbiAgICAgICAgfTtcbiAgICAgICAgcC5oZWlnaHQgPSB7IHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoWSkgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1vZGVsLmZpZWxkRGVmKFkpLmJpbikge1xuICAgICAgaWYgKG1vZGVsLmhhcyhTSVpFKSAmJiBvcmllbnQgPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAvLyBGb3IgaG9yaXpvbnRhbCBjaGFydCB0aGF0IGhhcyBiaW5uZWQgWSBhbmQgc2l6ZSxcbiAgICAgICAgLy8gY2VudGVyIGJhciBhbmQgYXBwbHkgc2l6ZSB0byBoZWlnaHQuXG4gICAgICAgIHAueWMgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgICB9O1xuICAgICAgICBwLmhlaWdodCA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBzaW1wbHkgdXNlIDxmaWVsZD5fc3RhcnQsIDxmaWVsZD5fZW5kXG4gICAgICAgIHAueSA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IGJpblN1ZmZpeDogJ19zdGFydCcgfSlcbiAgICAgICAgfTtcbiAgICAgICAgcC55MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IGJpblN1ZmZpeDogJ19lbmQnIH0pLFxuICAgICAgICAgIG9mZnNldDogMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIHkgaXMgb3JkaW5hbCBvciB1bnNwZWNpZmllZFxuXG4gICAgICBpZiAobW9kZWwuaGFzKFkpKSB7IC8vIGlzIG9yZGluYWxcbiAgICAgICAgcC55YyA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHsgLy8gTm8gWVxuICAgICAgICBwLnkyID0ge1xuICAgICAgICAgIGZpZWxkOiB7IGdyb3VwOiAnaGVpZ2h0JyB9LFxuICAgICAgICAgIG9mZnNldDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcC5oZWlnaHQgPSBtb2RlbC5oYXMoU0laRSkgICYmIG9yaWVudCA9PT0gJ2hvcml6b250YWwnID8ge1xuICAgICAgICAgIC8vIGFwcGx5IHNpemUgc2NhbGUgaWYgaGFzIHNpemUgYW5kIGlzIGhvcml6b250YWxcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxuICAgICAgICB9IDoge1xuICAgICAgICAgIHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoWSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhcHBseUNvbG9yQW5kT3BhY2l0eShwLCBtb2RlbCk7XG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbGFiZWxzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8oIzY0KTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlDb2xvckFuZE9wYWNpdHksIGFwcGx5TWFya0NvbmZpZywgQ29sb3JNb2RlfSBmcm9tICcuL3V0aWwnO1xuXG5cbmV4cG9ydCBuYW1lc3BhY2UgbGluZSB7XG4gIGV4cG9ydCBmdW5jdGlvbiBtYXJrVHlwZSgpIHtcbiAgICByZXR1cm4gJ2xpbmUnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETyBVc2UgVmVnYSdzIG1hcmtzIHByb3BlcnRpZXMgaW50ZXJmYWNlXG4gICAgdmFyIHA6IGFueSA9IHt9O1xuXG4gICAgLy8geFxuICAgIGlmIChtb2RlbC5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueCA9IHsgdmFsdWU6IDAgfTtcbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKG1vZGVsLmhhcyhZKSkge1xuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC55ID0geyBmaWVsZDogeyBncm91cDogJ2hlaWdodCcgfSB9O1xuICAgIH1cblxuICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsLCBDb2xvck1vZGUuQUxXQVlTX1NUUk9LRUQpO1xuICAgIGFwcGx5TWFya0NvbmZpZyhwLCBtb2RlbCwgWydpbnRlcnBvbGF0ZScsICd0ZW5zaW9uJ10pO1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhYmVscyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPKCMyNDApOiBmaWxsIHRoaXMgbWV0aG9kXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge1gsIFksIFNIQVBFLCBTSVpFfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlDb2xvckFuZE9wYWNpdHksIENvbG9yTW9kZX0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IG5hbWVzcGFjZSBwb2ludCB7XG4gIGV4cG9ydCBmdW5jdGlvbiBtYXJrVHlwZSgpIHtcbiAgICByZXR1cm4gJ3N5bWJvbCc7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJvcGVydGllcyhtb2RlbDogTW9kZWwsIGZpeGVkU2hhcGU/OiBzdHJpbmcpIHtcbiAgICAvLyBUT0RPIFVzZSBWZWdhJ3MgbWFya3MgcHJvcGVydGllcyBpbnRlcmZhY2VcbiAgICB2YXIgcDogYW55ID0ge307XG5cbiAgICAvLyB4XG4gICAgaWYgKG1vZGVsLmhhcyhYKSkge1xuICAgICAgcC54ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC54ID0geyB2YWx1ZTogMjEgLyogY29uZmlnLnNjYWxlLmJhbmRXaWR0aCAqLyAvIDIgfTtcbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKG1vZGVsLmhhcyhZKSkge1xuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC55ID0geyB2YWx1ZTogMjEgLyogY29uZmlnLnNjYWxlLmJhbmRXaWR0aCAqLyAvIDIgfTtcbiAgICB9XG5cbiAgICAvLyBzaXplXG4gICAgaWYgKG1vZGVsLmhhcyhTSVpFKSkge1xuICAgICAgcC5zaXplID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuc2l6ZSA9IHsgdmFsdWU6IG1vZGVsLnNpemVWYWx1ZSgpIH07XG4gICAgfVxuXG4gICAgLy8gc2hhcGVcbiAgICBpZiAoZml4ZWRTaGFwZSkgeyAvLyBzcXVhcmUgYW5kIGNpcmNsZSBtYXJrc1xuICAgICAgcC5zaGFwZSA9IHsgdmFsdWU6IGZpeGVkU2hhcGUgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmhhcyhTSEFQRSkpIHtcbiAgICAgIHAuc2hhcGUgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoU0hBUEUpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0hBUEUpXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobW9kZWwuZmllbGREZWYoU0hBUEUpLnZhbHVlKSB7XG4gICAgICBwLnNoYXBlID0geyB2YWx1ZTogbW9kZWwuZmllbGREZWYoU0hBUEUpLnZhbHVlIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuc2hhcGUgPSB7IHZhbHVlOiBtb2RlbC5jb25maWcoKS5tYXJrLnNoYXBlIH07XG4gICAgfVxuXG4gICAgYXBwbHlDb2xvckFuZE9wYWNpdHkocCwgbW9kZWwsXG4gICAgICAvLyBzcXVhcmUgYW5kIGNpcmNsZSBhcmUgZmlsbGVkIGJ5IGRlZmF1bHQsIGJ1dCBwb2ludCBpcyBzdHJva2VkIGJ5IGRlZmF1bHQuXG4gICAgICBmaXhlZFNoYXBlID8gQ29sb3JNb2RlLkZJTExFRF9CWV9ERUZBVUxUIDogQ29sb3JNb2RlLlNUUk9LRURfQllfREVGQVVMVFxuICAgICk7XG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbGFiZWxzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8oIzI0MCk6IGZpbGwgdGhpcyBtZXRob2RcbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIGNpcmNsZSB7XG4gIGV4cG9ydCBmdW5jdGlvbiBtYXJrVHlwZSgpIHtcbiAgICByZXR1cm4gJ3N5bWJvbCc7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJvcGVydGllcyhtb2RlbDogTW9kZWwpIHtcbiAgICByZXR1cm4gcG9pbnQucHJvcGVydGllcyhtb2RlbCwgJ2NpcmNsZScpO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhYmVscyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPKCMyNDApOiBmaWxsIHRoaXMgbWV0aG9kXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIHNxdWFyZSB7XG4gIGV4cG9ydCBmdW5jdGlvbiBtYXJrVHlwZSgpIHtcbiAgICByZXR1cm4gJ3N5bWJvbCc7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJvcGVydGllcyhtb2RlbDogTW9kZWwpIHtcbiAgICByZXR1cm4gcG9pbnQucHJvcGVydGllcyhtb2RlbCwgJ3NxdWFyZScpO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhYmVscyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPKCMyNDApOiBmaWxsIHRoaXMgbWV0aG9kXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge1gsIFksIENPTE9SLCBURVhULCBTSVpFfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlNYXJrQ29uZmlnLCBhcHBseUNvbG9yQW5kT3BhY2l0eSwgZm9ybWF0TWl4aW5zfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtleHRlbmQsIGNvbnRhaW5zfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgdGV4dCB7XG4gIGV4cG9ydCBmdW5jdGlvbiBtYXJrVHlwZSgpIHtcbiAgICByZXR1cm4gJ3RleHQnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJhY2tncm91bmQobW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHsgdmFsdWU6IDAgfSxcbiAgICAgIHk6IHsgdmFsdWU6IDAgfSxcbiAgICAgIHdpZHRoOiB7IGZpZWxkOiB7IGdyb3VwOiAnd2lkdGgnIH0gfSxcbiAgICAgIGhlaWdodDogeyBmaWVsZDogeyBncm91cDogJ2hlaWdodCcgfSB9LFxuICAgICAgZmlsbDogeyBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKENPTE9SKSwgZmllbGQ6IG1vZGVsLmZpZWxkKENPTE9SKSB9XG4gICAgfTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxuICAgIGxldCBwOiBhbnkgPSB7fTtcbiAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKFRFWFQpO1xuXG4gICAgLy8geFxuICAgIGlmIChtb2RlbC5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHsgLy8gVE9ETzogc3VwcG9ydCB4LnZhbHVlLCB4LmRhdHVtXG4gICAgICBpZiAobW9kZWwuaGFzKFRFWFQpICYmIG1vZGVsLmZpZWxkRGVmKFRFWFQpLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xuICAgICAgICBwLnggPSB7IGZpZWxkOiB7IGdyb3VwOiAnd2lkdGgnIH0sIG9mZnNldDogLTUgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAueCA9IHsgdmFsdWU6IDkwIC8gMiB9OyAvLyBUT0RPOiBjb25maWcuc2NhbGUudGV4dEJhbmRXaWR0aFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHlcbiAgICBpZiAobW9kZWwuaGFzKFkpKSB7XG4gICAgICBwLnkgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnkgPSB7IHZhbHVlOiAyMSAvIDIgfTsgLy8gVE9ETzogY29uZmlnLnNjYWxlLmJhbmRXaWR0aFxuICAgIH1cblxuICAgIC8vIHNpemVcbiAgICBpZiAobW9kZWwuaGFzKFNJWkUpKSB7XG4gICAgICBwLmZvbnRTaXplID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuZm9udFNpemUgPSB7IHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoKSB9O1xuICAgIH1cblxuICAgIGlmIChtb2RlbC5jb25maWcoKS5tYXJrLmFwcGx5Q29sb3JUb0JhY2tncm91bmQgJiYgIW1vZGVsLmhhcyhYKSAmJiAhbW9kZWwuaGFzKFkpKSB7XG4gICAgICBwLmZpbGwgPSB7dmFsdWU6ICdibGFjayd9OyAvLyBUT0RPOiBhZGQgcnVsZXMgZm9yIHN3YXBwaW5nIGJldHdlZW4gYmxhY2sgYW5kIHdoaXRlXG5cbiAgICAgIC8vIG9wYWNpdHlcbiAgICAgIGNvbnN0IG9wYWNpdHkgPSBtb2RlbC5jb25maWcoKS5tYXJrLm9wYWNpdHk7XG4gICAgICBpZiAob3BhY2l0eSkgeyBwLm9wYWNpdHkgPSB7IHZhbHVlOiBvcGFjaXR5IH07IH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsKTtcbiAgICB9XG5cblxuICAgIC8vIHRleHRcbiAgICBpZiAobW9kZWwuaGFzKFRFWFQpKSB7XG4gICAgICBpZiAoY29udGFpbnMoW1FVQU5USVRBVElWRSwgVEVNUE9SQUxdLCBtb2RlbC5maWVsZERlZihURVhUKS50eXBlKSkge1xuICAgICAgICBjb25zdCBmb3JtYXQgPSBtb2RlbC5jb25maWcoKS5tYXJrLmZvcm1hdDtcbiAgICAgICAgZXh0ZW5kKHAsIGZvcm1hdE1peGlucyhtb2RlbCwgVEVYVCwgZm9ybWF0KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLnRleHQgPSB7IGZpZWxkOiBtb2RlbC5maWVsZChURVhUKSB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwLnRleHQgPSB7IHZhbHVlOiBmaWVsZERlZi52YWx1ZSB9O1xuICAgIH1cblxuICAgIGFwcGx5TWFya0NvbmZpZyhwLCBtb2RlbCxcbiAgICAgIFsnYW5nbGUnLCAnYWxpZ24nLCAnYmFzZWxpbmUnLCAnZHgnLCAnZHknLCAnZm9udCcsICdmb250V2VpZ2h0JyxcbiAgICAgICAgJ2ZvbnRTdHlsZScsICdyYWRpdXMnLCAndGhldGEnXSk7XG5cbiAgICByZXR1cm4gcDtcbiAgfVxufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge1gsIFksIFNJWkV9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHthcHBseUNvbG9yQW5kT3BhY2l0eSwgQ29sb3JNb2RlfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgbmFtZXNwYWNlIHRpY2sge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdyZWN0JztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkge1xuICAgIHZhciBwOiBhbnkgPSB7fTtcblxuICAgIC8vIHhcbiAgICBpZiAobW9kZWwuaGFzKFgpKSB7XG4gICAgICBwLnhjID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC54YyA9IHsgdmFsdWU6IDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi8gLyAyIH07XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChtb2RlbC5oYXMoWSkpIHtcbiAgICAgIHAueWMgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnljID0geyB2YWx1ZTogMjEgLyogY29uZmlnLnNjYWxlLmJhbmRXaWR0aCAqLyAvIDIgfTtcbiAgICB9XG5cbiAgICBpZiAobW9kZWwuY29uZmlnKCkubWFyay5vcmllbnQgPT09ICdob3Jpem9udGFsJykge1xuICAgICAgcC53aWR0aCA9IHsgdmFsdWU6IG1vZGVsLmNvbmZpZygpLm1hcmsudGhpY2tuZXNzIH07XG4gICAgICBwLmhlaWdodCA9IG1vZGVsLmhhcyhTSVpFKT8ge1xuICAgICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxuICAgICAgICB9IDoge1xuICAgICAgICAgICAgdmFsdWU6IG1vZGVsLnNpemVWYWx1ZShZKVxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLndpZHRoID0gbW9kZWwuaGFzKFNJWkUpPyB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgICAgfSA6IHtcbiAgICAgICAgICB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKFgpXG4gICAgICAgIH07XG4gICAgICBwLmhlaWdodCA9IHsgdmFsdWU6IG1vZGVsLmNvbmZpZygpLm1hcmsudGhpY2tuZXNzIH07XG4gICAgfVxuXG4gICAgYXBwbHlDb2xvckFuZE9wYWNpdHkocCwgbW9kZWwsIENvbG9yTW9kZS5BTFdBWVNfRklMTEVEKTtcbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBDT0xPUiwgVEVYVCwgU0hBUEUsIFBBVEgsIE9SREVSLCBERVRBSUwsIFJPVywgQ09MVU1OLCBMQUJFTH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0FSRUEsIExJTkUsIFRFWFQgYXMgVEVYVE1BUkt9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtpbXB1dGVUcmFuc2Zvcm0sIHN0YWNrVHJhbnNmb3JtfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7Y29udGFpbnMsIGV4dGVuZCwgaXNBcnJheX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge2FyZWF9IGZyb20gJy4vbWFyay1hcmVhJztcbmltcG9ydCB7YmFyfSBmcm9tICcuL21hcmstYmFyJztcbmltcG9ydCB7bGluZX0gZnJvbSAnLi9tYXJrLWxpbmUnO1xuaW1wb3J0IHtwb2ludCwgY2lyY2xlLCBzcXVhcmV9IGZyb20gJy4vbWFyay1wb2ludCc7XG5pbXBvcnQge3RleHR9IGZyb20gJy4vbWFyay10ZXh0JztcbmltcG9ydCB7dGlja30gZnJvbSAnLi9tYXJrLXRpY2snO1xuaW1wb3J0IHtzb3J0RmllbGR9IGZyb20gJy4vdXRpbCc7XG5cblxuY29uc3QgbWFya0NvbXBpbGVyID0ge1xuICBhcmVhOiBhcmVhLFxuICBiYXI6IGJhcixcbiAgbGluZTogbGluZSxcbiAgcG9pbnQ6IHBvaW50LFxuICB0ZXh0OiB0ZXh0LFxuICB0aWNrOiB0aWNrLFxuICBjaXJjbGU6IGNpcmNsZSxcbiAgc3F1YXJlOiBzcXVhcmVcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTWFyayhtb2RlbDogTW9kZWwpOiBhbnlbXSB7XG4gIGlmIChjb250YWlucyhbTElORSwgQVJFQV0sIG1vZGVsLm1hcmsoKSkpIHtcbiAgICByZXR1cm4gY29tcGlsZVBhdGhNYXJrKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29tcGlsZU5vblBhdGhNYXJrKG1vZGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21waWxlUGF0aE1hcmsobW9kZWw6IE1vZGVsKSB7IC8vIFRPRE86IGV4dHJhY3QgdGhpcyBpbnRvIGNvbXBpbGVQYXRoTWFya1xuICBjb25zdCBtYXJrID0gbW9kZWwubWFyaygpO1xuICBjb25zdCBuYW1lID0gbW9kZWwuc3BlYygpLm5hbWU7XG4gIGNvbnN0IGlzRmFjZXRlZCA9IG1vZGVsLmhhcyhST1cpIHx8IG1vZGVsLmhhcyhDT0xVTU4pO1xuICBjb25zdCBkYXRhRnJvbSA9IHtkYXRhOiBtb2RlbC5kYXRhVGFibGUoKX07XG4gIGNvbnN0IGRldGFpbHMgPSBkZXRhaWxGaWVsZHMobW9kZWwpO1xuXG4gIGxldCBwYXRoTWFya3M6IGFueSA9IFtleHRlbmQoXG4gICAgbmFtZSA/IHsgbmFtZTogbmFtZSArICctbWFya3MnIH0gOiB7fSxcbiAgICB7XG4gICAgICB0eXBlOiBtYXJrQ29tcGlsZXJbbWFya10ubWFya1R5cGUoKSxcbiAgICAgIGZyb206IGV4dGVuZChcbiAgICAgICAgLy8gSWYgaGFzIGZhY2V0LCBgZnJvbS5kYXRhYCB3aWxsIGJlIGFkZGVkIGluIHRoZSBjZWxsIGdyb3VwLlxuICAgICAgICAvLyBJZiBoYXMgc3ViZmFjZXQgZm9yIGxpbmUvYXJlYSBncm91cCwgYGZyb20uZGF0YWAgd2lsbCBiZSBhZGRlZCBpbiB0aGUgb3V0ZXIgc3ViZmFjZXQgZ3JvdXAgYmVsb3cuXG4gICAgICAgIC8vIElmIGhhcyBubyBzdWJmYWNldCwgYWRkIGZyb20uZGF0YS5cbiAgICAgICAgaXNGYWNldGVkIHx8IGRldGFpbHMubGVuZ3RoID4gMCA/IHt9IDogZGF0YUZyb20sXG5cbiAgICAgICAgLy8gc29ydCB0cmFuc2Zvcm1cbiAgICAgICAge3RyYW5zZm9ybTogW3sgdHlwZTogJ3NvcnQnLCBieTogc29ydFBhdGhCeShtb2RlbCl9XX1cbiAgICAgICksXG4gICAgICBwcm9wZXJ0aWVzOiB7IHVwZGF0ZTogbWFya0NvbXBpbGVyW21hcmtdLnByb3BlcnRpZXMobW9kZWwpIH1cbiAgICB9XG4gICldO1xuXG4gIGlmIChkZXRhaWxzLmxlbmd0aCA+IDApIHsgLy8gaGF2ZSBsZXZlbCBvZiBkZXRhaWxzIC0gbmVlZCB0byBmYWNldCBsaW5lIGludG8gc3ViZ3JvdXBzXG4gICAgY29uc3QgZmFjZXRUcmFuc2Zvcm0gPSB7IHR5cGU6ICdmYWNldCcsIGdyb3VwYnk6IGRldGFpbHMgfTtcbiAgICBjb25zdCB0cmFuc2Zvcm06IGFueVtdID0gbWFyayA9PT0gQVJFQSAmJiBtb2RlbC5zdGFjaygpID9cbiAgICAgIC8vIEZvciBzdGFja2VkIGFyZWEsIHdlIG5lZWQgdG8gaW1wdXRlIG1pc3NpbmcgdHVwbGVzIGFuZCBzdGFjayB2YWx1ZXNcbiAgICAgIC8vIChNYXJrIGxheWVyIG9yZGVyIGRvZXMgbm90IG1hdHRlciBmb3Igc3RhY2tlZCBjaGFydHMpXG4gICAgICBbaW1wdXRlVHJhbnNmb3JtKG1vZGVsKSwgc3RhY2tUcmFuc2Zvcm0obW9kZWwpLCBmYWNldFRyYW5zZm9ybV0gOlxuICAgICAgLy8gRm9yIG5vbi1zdGFja2VkIHBhdGggKGxpbmUvYXJlYSksIHdlIG5lZWQgdG8gZmFjZXQgYW5kIHBvc3NpYmx5IHNvcnRcbiAgICAgIFtdLmNvbmNhdChcbiAgICAgICAgZmFjZXRUcmFuc2Zvcm0sXG4gICAgICAgIC8vIGlmIG1vZGVsIGhhcyBgb3JkZXJgLCB0aGVuIHNvcnQgbWFyaydzIGxheWVyIG9yZGVyIGJ5IGBvcmRlcmAgZmllbGQocylcbiAgICAgICAgbW9kZWwuaGFzKE9SREVSKSA/IFt7dHlwZTonc29ydCcsIGJ5OiBzb3J0QnkobW9kZWwpfV0gOiBbXVxuICAgICAgKTtcblxuICAgIHJldHVybiBbe1xuICAgICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgbWFyayArICctZmFjZXQnLFxuICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgIGZyb206IGV4dGVuZChcbiAgICAgICAgLy8gSWYgaGFzIGZhY2V0LCBgZnJvbS5kYXRhYCB3aWxsIGJlIGFkZGVkIGluIHRoZSBjZWxsIGdyb3VwLlxuICAgICAgICAvLyBPdGhlcndpc2UsIGFkZCBpdCBoZXJlLlxuICAgICAgICBpc0ZhY2V0ZWQgPyB7fSA6IGRhdGFGcm9tLFxuICAgICAgICB7dHJhbnNmb3JtOiB0cmFuc2Zvcm19XG4gICAgICApLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICB3aWR0aDogeyBmaWVsZDogeyBncm91cDogJ3dpZHRoJyB9IH0sXG4gICAgICAgICAgaGVpZ2h0OiB7IGZpZWxkOiB7IGdyb3VwOiAnaGVpZ2h0JyB9IH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1hcmtzOiBwYXRoTWFya3NcbiAgICB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGF0aE1hcmtzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVOb25QYXRoTWFyayhtb2RlbDogTW9kZWwpIHtcbiAgY29uc3QgbWFyayA9IG1vZGVsLm1hcmsoKTtcbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICBjb25zdCBpc0ZhY2V0ZWQgPSBtb2RlbC5oYXMoUk9XKSB8fCBtb2RlbC5oYXMoQ09MVU1OKTtcbiAgY29uc3QgZGF0YUZyb20gPSB7ZGF0YTogbW9kZWwuZGF0YVRhYmxlKCl9O1xuXG4gIGxldCBtYXJrcyA9IFtdOyAvLyBUT0RPOiB2Z01hcmtzXG4gIGlmIChtYXJrID09PSBURVhUTUFSSyAmJlxuICAgIG1vZGVsLmhhcyhDT0xPUikgJiZcbiAgICBtb2RlbC5jb25maWcoKS5tYXJrLmFwcGx5Q29sb3JUb0JhY2tncm91bmQgJiYgIW1vZGVsLmhhcyhYKSAmJiAhbW9kZWwuaGFzKFkpXG4gICkge1xuICAgIC8vIGFkZCBiYWNrZ3JvdW5kIHRvICd0ZXh0JyBtYXJrcyBpZiBoYXMgY29sb3JcbiAgICBtYXJrcy5wdXNoKGV4dGVuZChcbiAgICAgIG5hbWUgPyB7IG5hbWU6IG5hbWUgKyAnLWJhY2tncm91bmQnIH0gOiB7fSxcbiAgICAgIHsgdHlwZTogJ3JlY3QnIH0sXG4gICAgICAvLyBJZiBoYXMgZmFjZXQsIGBmcm9tLmRhdGFgIHdpbGwgYmUgYWRkZWQgaW4gdGhlIGNlbGwgZ3JvdXAuXG4gICAgICAvLyBPdGhlcndpc2UsIGFkZCBpdCBoZXJlLlxuICAgICAgaXNGYWNldGVkID8ge30gOiB7ZnJvbTogZGF0YUZyb219LFxuICAgICAgLy8gUHJvcGVydGllc1xuICAgICAgeyBwcm9wZXJ0aWVzOiB7IHVwZGF0ZTogdGV4dC5iYWNrZ3JvdW5kKG1vZGVsKSB9IH1cbiAgICApKTtcbiAgfVxuXG4gIG1hcmtzLnB1c2goZXh0ZW5kKFxuICAgIG5hbWUgPyB7IG5hbWU6IG5hbWUgKyAnLW1hcmtzJyB9IDoge30sXG4gICAgeyB0eXBlOiBtYXJrQ29tcGlsZXJbbWFya10ubWFya1R5cGUoKSB9LFxuICAgIC8vIEFkZCBgZnJvbWAgaWYgbmVlZGVkXG4gICAgKCFpc0ZhY2V0ZWQgfHwgbW9kZWwuc3RhY2soKSB8fCBtb2RlbC5oYXMoT1JERVIpKSA/IHtcbiAgICAgIGZyb206IGV4dGVuZChcbiAgICAgICAgLy8gSWYgZmFjZXRlZCwgYGZyb20uZGF0YWAgd2lsbCBiZSBhZGRlZCBpbiB0aGUgY2VsbCBncm91cC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhZGQgaXQgaGVyZVxuICAgICAgICBpc0ZhY2V0ZWQgPyB7fSA6IGRhdGFGcm9tLFxuICAgICAgICAvLyBgZnJvbS50cmFuc2Zvcm1gXG4gICAgICAgIG1vZGVsLnN0YWNrKCkgPyAvLyBTdGFja2VkIENoYXJ0IG5lZWQgc3RhY2sgdHJhbnNmb3JtXG4gICAgICAgICAgeyB0cmFuc2Zvcm06IFtzdGFja1RyYW5zZm9ybShtb2RlbCldIH0gOlxuICAgICAgICBtb2RlbC5oYXMoT1JERVIpID9cbiAgICAgICAgICAvLyBpZiBub24tc3RhY2tlZCwgZGV0YWlsIGZpZWxkIGRldGVybWluZXMgdGhlIGxheWVyIG9yZGVyIG9mIGVhY2ggbWFya1xuICAgICAgICAgIHsgdHJhbnNmb3JtOiBbe3R5cGU6J3NvcnQnLCBieTogc29ydEJ5KG1vZGVsKX1dIH0gOlxuICAgICAgICAgIHt9XG4gICAgICApXG4gICAgfSA6IHt9LFxuICAgIC8vIHByb3BlcnRpZXMgZ3JvdXBzXG4gICAgeyBwcm9wZXJ0aWVzOiB7IHVwZGF0ZTogbWFya0NvbXBpbGVyW21hcmtdLnByb3BlcnRpZXMobW9kZWwpIH0gfVxuICApKTtcblxuICBpZiAobW9kZWwuaGFzKExBQkVMKSAmJiBtYXJrQ29tcGlsZXJbbWFya10ubGFiZWxzKSB7XG4gICAgY29uc3QgbGFiZWxQcm9wZXJ0aWVzID0gbWFya0NvbXBpbGVyW21hcmtdLmxhYmVscyhtb2RlbCk7XG5cbiAgICAvLyBjaGVjayBpZiB3ZSBoYXZlIGxhYmVsIG1ldGhvZCBmb3IgY3VycmVudCBtYXJrIHR5cGUuXG4gICAgaWYgKGxhYmVsUHJvcGVydGllcyAhPT0gdW5kZWZpbmVkKSB7IC8vIElmIGxhYmVsIGlzIHN1cHBvcnRlZFxuICAgICAgLy8gYWRkIGxhYmVsIGdyb3VwXG4gICAgICBtYXJrcy5wdXNoKGV4dGVuZChcbiAgICAgICAgbmFtZSA/IHsgbmFtZTogbmFtZSArICctbGFiZWwnIH0gOiB7fSxcbiAgICAgICAge3R5cGU6ICd0ZXh0J30sXG4gICAgICAgIC8vIElmIGhhcyBmYWNldCwgYGZyb20uZGF0YWAgd2lsbCBiZSBhZGRlZCBpbiB0aGUgY2VsbCBncm91cC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhZGQgaXQgaGVyZS5cbiAgICAgICAgaXNGYWNldGVkID8ge30gOiB7ZnJvbTogZGF0YUZyb219LFxuICAgICAgICAvLyBQcm9wZXJ0aWVzXG4gICAgICAgIHsgcHJvcGVydGllczogeyB1cGRhdGU6IGxhYmVsUHJvcGVydGllcyB9IH1cbiAgICAgICkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXJrcztcbn1cblxuZnVuY3Rpb24gc29ydEJ5KG1vZGVsOiBNb2RlbCkge1xuICBpZiAobW9kZWwuaGFzKE9SREVSKSkge1xuICAgIHZhciBjaGFubmVsRW5jb2RpbmcgPSBtb2RlbC5zcGVjKCkuZW5jb2RpbmdbT1JERVJdO1xuICAgIHJldHVybiBpc0FycmF5KGNoYW5uZWxFbmNvZGluZykgP1xuICAgICAgY2hhbm5lbEVuY29kaW5nLm1hcChzb3J0RmllbGQpIDogLy8gc29ydCBieSBtdWx0aXBsZSBmaWVsZHNcbiAgICAgIHNvcnRGaWVsZChjaGFubmVsRW5jb2RpbmcpOyAgICAgIC8vIHNvcnQgYnkgb25lIGZpZWxkXG4gIH1cbiAgcmV0dXJuIG51bGw7IC8vIHVzZSBkZWZhdWx0IG9yZGVyXG59XG5cbi8qKlxuICogUmV0dXJuIHBhdGggb3JkZXIgZm9yIHNvcnQgdHJhbnNmb3JtJ3MgYnkgcHJvcGVydHlcbiAqL1xuZnVuY3Rpb24gc29ydFBhdGhCeShtb2RlbDogTW9kZWwpIHtcbiAgaWYgKG1vZGVsLm1hcmsoKSA9PT0gTElORSAmJiBtb2RlbC5oYXMoUEFUSCkpIHtcbiAgICAvLyBGb3Igb25seSBsaW5lLCBzb3J0IGJ5IHRoZSBwYXRoIGZpZWxkIGlmIGl0IGlzIHNwZWNpZmllZC5cbiAgICBjb25zdCBjaGFubmVsRW5jb2RpbmcgPSBtb2RlbC5zcGVjKCkuZW5jb2RpbmdbUEFUSF07XG4gICAgcmV0dXJuIGlzQXJyYXkoY2hhbm5lbEVuY29kaW5nKSA/XG4gICAgICBjaGFubmVsRW5jb2RpbmcubWFwKHNvcnRGaWVsZCkgOiAvLyBzb3J0IGJ5IG11bHRpcGxlIGZpZWxkc1xuICAgICAgc29ydEZpZWxkKGNoYW5uZWxFbmNvZGluZyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIGJvdGggbGluZSBhbmQgYXJlYSwgd2Ugc29ydCB2YWx1ZXMgYmFzZWQgb24gZGltZW5zaW9uIGJ5IGRlZmF1bHRcbiAgICByZXR1cm4gJy0nICsgbW9kZWwuZmllbGQobW9kZWwuY29uZmlnKCkubWFyay5vcmllbnQgPT09ICdob3Jpem9udGFsJyA/IFkgOiBYKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgbGlzdCBvZiBkZXRhaWwgZmllbGRzIChmb3IgJ2NvbG9yJywgJ3NoYXBlJywgb3IgJ2RldGFpbCcgY2hhbm5lbHMpXG4gKiB0aGF0IHRoZSBtb2RlbCdzIHNwZWMgY29udGFpbnMuXG4gKi9cbmZ1bmN0aW9uIGRldGFpbEZpZWxkcyhtb2RlbDogTW9kZWwpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbQ09MT1IsIERFVEFJTCwgU0hBUEVdLnJlZHVjZShmdW5jdGlvbihkZXRhaWxzLCBjaGFubmVsKSB7XG4gICAgaWYgKG1vZGVsLmhhcyhjaGFubmVsKSAmJiAhbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuYWdncmVnYXRlKSB7XG4gICAgICBkZXRhaWxzLnB1c2gobW9kZWwuZmllbGQoY2hhbm5lbCkpO1xuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfSwgW10pO1xufVxuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvbWFzdGVyL2RvYy9zcGVjLm1kIzExLWFtYmllbnQtZGVjbGFyYXRpb25zXG5kZWNsYXJlIHZhciBleHBvcnRzO1xuXG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcblxuaW1wb3J0IHtjb250YWlucywgZXh0ZW5kfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtTSEFSRURfRE9NQUlOX09QU30gZnJvbSAnLi4vYWdncmVnYXRlJztcbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFksIFNIQVBFLCBTSVpFLCBDT0xPUiwgVEVYVCwgaGFzU2NhbGUsIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtTT1VSQ0UsIFNUQUNLRURfU0NBTEV9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHtOT01JTkFMLCBPUkRJTkFMLCBRVUFOVElUQVRJVkUsIFRFTVBPUkFMfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7TWFyaywgQkFSLCBURVhUIGFzIFRFWFRfTUFSS30gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge3Jhd0RvbWFpbn0gZnJvbSAnLi90aW1lJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVTY2FsZXMoY2hhbm5lbHM6IENoYW5uZWxbXSwgbW9kZWw6IE1vZGVsKSB7XG4gIHJldHVybiBjaGFubmVscy5maWx0ZXIoaGFzU2NhbGUpXG4gICAgLm1hcChmdW5jdGlvbihjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gICAgICB2YXIgc2NhbGVEZWY6IGFueSA9IHtcbiAgICAgICAgbmFtZTogbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpLFxuICAgICAgICB0eXBlOiB0eXBlKGZpZWxkRGVmLCBjaGFubmVsLCBtb2RlbC5tYXJrKCkpLFxuICAgICAgfTtcblxuICAgICAgc2NhbGVEZWYuZG9tYWluID0gZG9tYWluKG1vZGVsLCBjaGFubmVsLCBzY2FsZURlZi50eXBlKTtcbiAgICAgIGV4dGVuZChzY2FsZURlZiwgcmFuZ2VNaXhpbnMobW9kZWwsIGNoYW5uZWwsIHNjYWxlRGVmLnR5cGUpKTtcblxuICAgICAgLy8gQWRkIG9wdGlvbmFsIHByb3BlcnRpZXNcbiAgICAgIFtcbiAgICAgICAgLy8gZ2VuZXJhbCBwcm9wZXJ0aWVzXG4gICAgICAgICdyZXZlcnNlJywgJ3JvdW5kJyxcbiAgICAgICAgLy8gcXVhbnRpdGF0aXZlIC8gdGltZVxuICAgICAgICAnY2xhbXAnLCAnbmljZScsXG4gICAgICAgIC8vIHF1YW50aXRhdGl2ZVxuICAgICAgICAnZXhwb25lbnQnLCAnemVybycsXG4gICAgICAgIC8vIG9yZGluYWxcbiAgICAgICAgJ291dGVyUGFkZGluZycsICdwYWRkaW5nJywgJ3BvaW50cydcbiAgICAgIF0uZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAvLyBUT0RPIGluY2x1ZGUgZmllbGREZWYgYXMgcGFydCBvZiB0aGUgcGFyYW1ldGVyc1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGV4cG9ydHNbcHJvcGVydHldKG1vZGVsLCBjaGFubmVsLCBzY2FsZURlZi50eXBlKTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzY2FsZURlZltwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBzY2FsZURlZjtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGUoZmllbGREZWY6IEZpZWxkRGVmLCBjaGFubmVsOiBDaGFubmVsLCBtYXJrOiBNYXJrKTogc3RyaW5nIHtcbiAgaWYgKCFoYXNTY2FsZShjaGFubmVsKSkge1xuICAgIC8vIFRoZXJlIGlzIG5vIHNjYWxlIGZvciB0aGVzZSBjaGFubmVsc1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gV2UgY2FuJ3QgdXNlIGxpbmVhci90aW1lIGZvciByb3csIGNvbHVtbiBvciBzaGFwZVxuICBpZiAoY29udGFpbnMoW1JPVywgQ09MVU1OLCBTSEFQRV0sIGNoYW5uZWwpKSB7XG4gICAgcmV0dXJuICdvcmRpbmFsJztcbiAgfVxuXG4gIGlmIChmaWVsZERlZi5zY2FsZS50eXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmllbGREZWYuc2NhbGUudHlwZTtcbiAgfVxuXG4gIHN3aXRjaCAoZmllbGREZWYudHlwZSkge1xuICAgIGNhc2UgTk9NSU5BTDpcbiAgICAgIHJldHVybiAnb3JkaW5hbCc7XG4gICAgY2FzZSBPUkRJTkFMOlxuICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICBjYXNlIFRFTVBPUkFMOlxuICAgICAgaWYgKGNoYW5uZWwgPT09IENPTE9SKSB7XG4gICAgICAgIC8vIEZJWE1FKCM4OTApIGlmIHVzZXIgc3BlY2lmeSBzY2FsZS5yYW5nZSBhcyBvcmRpbmFsIHByZXNldHMsIHRoZW4gdGhpcyBzaG91bGQgYmUgb3JkaW5hbC5cbiAgICAgICAgLy8gQWxzbywgaWYgd2Ugc3VwcG9ydCBjb2xvciByYW1wLCB0aGlzIHNob3VsZCBiZSBvcmRpbmFsIHRvby5cbiAgICAgICAgcmV0dXJuICd0aW1lJzsgLy8gdGltZSBoYXMgb3JkZXIsIHNvIHVzZSBpbnRlcnBvbGF0ZWQgb3JkaW5hbCBjb2xvciBzY2FsZS5cbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIHN3aXRjaCAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgICBjYXNlICdob3Vycyc6XG4gICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAvLyBkYXRlLCB5ZWFyLCBtaW51dGUsIHNlY29uZCwgeWVhcm1vbnRoLCBtb250aGRheSwgLi4uXG4gICAgICAgICAgICByZXR1cm4gJ3RpbWUnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gJ3RpbWUnO1xuXG4gICAgY2FzZSBRVUFOVElUQVRJVkU6XG4gICAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICAgIC8vIFRPRE8oIzg5MCk6IElkZWFsbHkgYmlubmVkIENPTE9SIHNob3VsZCBiZSBhbiBvcmRpbmFsIHNjYWxlXG4gICAgICAgIC8vIEhvd2V2ZXIsIGN1cnJlbnRseSBvcmRpbmFsIHNjYWxlIGRvZXNuJ3Qgc3VwcG9ydCBjb2xvciByYW1wIHlldC5cbiAgICAgICAgcmV0dXJuIGNvbnRhaW5zKFtYLCBZLCBDT0xPUl0sIGNoYW5uZWwpID8gJ2xpbmVhcicgOiAnb3JkaW5hbCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gJ2xpbmVhcic7XG4gIH1cblxuICAvLyBzaG91bGQgbmV2ZXIgcmVhY2ggdGhpc1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvbWFpbihtb2RlbDogTW9kZWwsIGNoYW5uZWw6Q2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpIHtcbiAgdmFyIGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgaWYgKGZpZWxkRGVmLnNjYWxlLmRvbWFpbikgeyAvLyBleHBsaWNpdCB2YWx1ZVxuICAgIHJldHVybiBmaWVsZERlZi5zY2FsZS5kb21haW47XG4gIH1cblxuICAvLyBzcGVjaWFsIGNhc2UgZm9yIHRlbXBvcmFsIHNjYWxlXG4gIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xuICAgIGlmIChyYXdEb21haW4oZmllbGREZWYudGltZVVuaXQsIGNoYW5uZWwpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRhOiBmaWVsZERlZi50aW1lVW5pdCxcbiAgICAgICAgZmllbGQ6ICdkYXRlJ1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCksXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsKSxcbiAgICAgICAgb3A6ICdtaW4nXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIEZvciBzdGFjaywgdXNlIFNUQUNLRUQgZGF0YS5cbiAgdmFyIHN0YWNrID0gbW9kZWwuc3RhY2soKTtcbiAgaWYgKHN0YWNrICYmIGNoYW5uZWwgPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xuICAgIGlmKHN0YWNrLm9mZnNldCA9PT0gJ25vcm1hbGl6ZScpIHtcbiAgICAgIHJldHVybiBbMCwgMV07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBTVEFDS0VEX1NDQUxFLFxuICAgICAgLy8gU1RBQ0tFRF9TQ0FMRSBwcm9kdWNlcyBzdW0gb2YgdGhlIGZpZWxkJ3MgdmFsdWUgZS5nLiwgc3VtIG9mIHN1bSwgc3VtIG9mIGRpc3RpbmN0XG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwge3ByZWZuOiAnc3VtXyd9KVxuICAgIH07XG4gIH1cblxuICB2YXIgdXNlUmF3RG9tYWluID0gX3VzZVJhd0RvbWFpbihtb2RlbCwgY2hhbm5lbCwgc2NhbGVUeXBlKTtcbiAgdmFyIHNvcnQgPSBkb21haW5Tb3J0KG1vZGVsLCBjaGFubmVsLCBzY2FsZVR5cGUpO1xuXG4gIGlmICh1c2VSYXdEb21haW4pIHsgLy8gdXNlUmF3RG9tYWluIC0gb25seSBRL1RcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogU09VUkNFLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtub0FnZ3JlZ2F0ZTogdHJ1ZX0pXG4gICAgfTtcbiAgfSBlbHNlIGlmIChmaWVsZERlZi5iaW4pIHsgLy8gYmluXG4gICAgcmV0dXJuIHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnID8ge1xuICAgICAgLy8gb3JkaW5hbCBiaW4gc2NhbGUgdGFrZXMgZG9tYWluIGZyb20gYmluX3JhbmdlLCBvcmRlcmVkIGJ5IGJpbl9zdGFydFxuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwgeyBiaW5TdWZmaXg6ICdfcmFuZ2UnIH0pLFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwgeyBiaW5TdWZmaXg6ICdfc3RhcnQnIH0pLFxuICAgICAgICBvcDogJ21pbicgLy8gbWluIG9yIG1heCBkb2Vzbid0IG1hdHRlciBzaW5jZSBzYW1lIF9yYW5nZSB3b3VsZCBoYXZlIHRoZSBzYW1lIF9zdGFydFxuICAgICAgfVxuICAgIH0gOiBjaGFubmVsID09PSBDT0xPUiA/IHtcbiAgICAgIC8vIEN1cnJlbnRseSwgYmlubmVkIG9uIGNvbG9yIHVzZXMgbGluZWFyIHNjYWxlIGFuZCB0aHVzIHVzZSBfc3RhcnQgcG9pbnRcbiAgICAgIC8vIFRPRE86IFRoaXMgaWRlYWxseSBzaG91bGQgYmVjb21lIG9yZGluYWwgc2NhbGUgb25jZSBvcmRpbmFsIHNjYWxlIHN1cHBvcnRzIGNvbG9yIHJhbXAuXG4gICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7IGJpblN1ZmZpeDogJ19zdGFydCcgfSlcbiAgICB9IDoge1xuICAgICAgLy8gb3RoZXIgbGluZWFyIGJpbiBzY2FsZSBtZXJnZXMgYm90aCBiaW5fc3RhcnQgYW5kIGJpbl9lbmQgZm9yIG5vbi1vcmRpbmFsIHNjYWxlXG4gICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIGZpZWxkOiBbXG4gICAgICAgIG1vZGVsLmZpZWxkKGNoYW5uZWwsIHsgYmluU3VmZml4OiAnX3N0YXJ0JyB9KSxcbiAgICAgICAgbW9kZWwuZmllbGQoY2hhbm5lbCwgeyBiaW5TdWZmaXg6ICdfZW5kJyB9KVxuICAgICAgXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoc29ydCkgeyAvLyBoYXZlIHNvcnQgLS0gb25seSBmb3Igb3JkaW5hbFxuICAgIHJldHVybiB7XG4gICAgICAvLyBJZiBzb3J0IGJ5IGFnZ3JlZ2F0aW9uIG9mIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQsIHdlIG5lZWQgdG8gdXNlIFNPVVJDRSB0YWJsZSxcbiAgICAgIC8vIHNvIHdlIGNhbiBhZ2dyZWdhdGUgdmFsdWVzIGZvciB0aGUgc2NhbGUgaW5kZXBlbmRlbnRseSBmcm9tIHRoZSBtYWluIGFnZ3JlZ2F0aW9uLlxuICAgICAgZGF0YTogc29ydC5vcCA/IFNPVVJDRSA6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwpLFxuICAgICAgc29ydDogc29ydFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwpXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9tYWluU29ydChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKTogYW55IHtcbiAgdmFyIHNvcnQgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zb3J0O1xuICBpZiAoc29ydCA9PT0gJ2FzY2VuZGluZycgfHwgc29ydCA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBTb3J0ZWQgYmFzZWQgb24gYW4gYWdncmVnYXRlIGNhbGN1bGF0aW9uIG92ZXIgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCAob25seSBmb3Igb3JkaW5hbCBzY2FsZSlcbiAgaWYgKHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnICYmIHR5cGVvZiBzb3J0ICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB7XG4gICAgICBvcDogc29ydC5vcCxcbiAgICAgIGZpZWxkOiBzb3J0LmZpZWxkXG4gICAgfTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmV2ZXJzZShtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgdmFyIHNvcnQgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zb3J0O1xuICByZXR1cm4gc29ydCAmJiAodHlwZW9mIHNvcnQgPT09ICdzdHJpbmcnID9cbiAgICAgICAgICAgICAgICAgICAgc29ydCA9PT0gJ2Rlc2NlbmRpbmcnIDpcbiAgICAgICAgICAgICAgICAgICAgc29ydC5vcmRlciA9PT0gJ2Rlc2NlbmRpbmcnXG4gICAgICAgICAgICAgICAgICkgPyB0cnVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB1c2VSYXdEb21haW4gc2hvdWxkIGJlIGFjdGl2YXRlZCBmb3IgdGhpcyBzY2FsZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBhbGwgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRvbnMgYXBwbGllczpcbiAqIDEuIGB1c2VSYXdEb21haW5gIGlzIGVuYWJsZWQgZWl0aGVyIHRocm91Z2ggc2NhbGUgb3IgY29uZmlnXG4gKiAyLiBBZ2dyZWdhdGlvbiBmdW5jdGlvbiBpcyBub3QgYGNvdW50YCBvciBgc3VtYFxuICogMy4gVGhlIHNjYWxlIGlzIHF1YW50aXRhdGl2ZSBvciB0aW1lIHNjYWxlLlxuICovXG5mdW5jdGlvbiBfdXNlUmF3RG9tYWluIChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgcmV0dXJuIGZpZWxkRGVmLnNjYWxlLnVzZVJhd0RvbWFpbiAmJiAvLyAgaWYgdXNlUmF3RG9tYWluIGlzIGVuYWJsZWRcbiAgICAvLyBvbmx5IGFwcGxpZWQgdG8gYWdncmVnYXRlIHRhYmxlXG4gICAgZmllbGREZWYuYWdncmVnYXRlICYmXG4gICAgLy8gb25seSBhY3RpdmF0ZWQgaWYgdXNlZCB3aXRoIGFnZ3JlZ2F0ZSBmdW5jdGlvbnMgdGhhdCBwcm9kdWNlcyB2YWx1ZXMgcmFuZ2luZyBpbiB0aGUgZG9tYWluIG9mIHRoZSBzb3VyY2UgZGF0YVxuICAgIFNIQVJFRF9ET01BSU5fT1BTLmluZGV4T2YoZmllbGREZWYuYWdncmVnYXRlKSA+PSAwICYmXG4gICAgKFxuICAgICAgLy8gUSBhbHdheXMgdXNlcyBxdWFudGl0YXRpdmUgc2NhbGUgZXhjZXB0IHdoZW4gaXQncyBiaW5uZWQuXG4gICAgICAvLyBCaW5uZWQgZmllbGQgaGFzIHNpbWlsYXIgdmFsdWVzIGluIGJvdGggdGhlIHNvdXJjZSB0YWJsZSBhbmQgdGhlIHN1bW1hcnkgdGFibGVcbiAgICAgIC8vIGJ1dCB0aGUgc3VtbWFyeSB0YWJsZSBoYXMgZmV3ZXIgdmFsdWVzLCB0aGVyZWZvcmUgYmlubmVkIGZpZWxkcyBkcmF3XG4gICAgICAvLyBkb21haW4gdmFsdWVzIGZyb20gdGhlIHN1bW1hcnkgdGFibGUuXG4gICAgICAoZmllbGREZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFICYmICFmaWVsZERlZi5iaW4pIHx8XG4gICAgICAvLyBUIHVzZXMgbm9uLW9yZGluYWwgc2NhbGUgd2hlbiB0aGVyZSdzIG5vIHVuaXQgb3Igd2hlbiB0aGUgdW5pdCBpcyBub3Qgb3JkaW5hbC5cbiAgICAgIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJiBzY2FsZVR5cGUgPT09ICdsaW5lYXInKVxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYW5kV2lkdGgobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IHN0cmluZykge1xuICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUuYmFuZFdpZHRoO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFtcChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgLy8gb25seSByZXR1cm4gdmFsdWUgaWYgZXhwbGljaXQgdmFsdWUgaXMgc3BlY2lmaWVkLlxuICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUuY2xhbXA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHBvbmVudChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgLy8gb25seSByZXR1cm4gdmFsdWUgaWYgZXhwbGljaXQgdmFsdWUgaXMgc3BlY2lmaWVkLlxuICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUuZXhwb25lbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuaWNlKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpIHtcbiAgaWYgKG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLm5pY2UgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIGV4cGxpY2l0IHZhbHVlXG4gICAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLm5pY2U7XG4gIH1cblxuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFg6IC8qIGZhbGwgdGhyb3VnaCAqL1xuICAgIGNhc2UgWTpcbiAgICAgIGlmIChzY2FsZVR5cGUgPT09ICd0aW1lJyB8fCBzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjYXNlIFJPVzogLyogZmFsbCB0aHJvdWdoICovXG4gICAgY2FzZSBDT0xVTU46XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3V0ZXJQYWRkaW5nKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpIHtcbiAgaWYgKHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgaWYgKG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLm91dGVyUGFkZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUub3V0ZXJQYWRkaW5nOyAvLyBleHBsaWNpdCB2YWx1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkZGluZyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJyAmJiBjaGFubmVsICE9PSBST1cgJiYgY2hhbm5lbCAhPT0gQ09MVU1OKSB7XG4gICAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLnBhZGRpbmc7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvaW50cyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgICAgY2FzZSBYOlxuICAgICAgY2FzZSBZOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VNaXhpbnMobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IHN0cmluZyk6IGFueSB7XG4gIHZhciBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJyAmJiBmaWVsZERlZi5zY2FsZS5iYW5kV2lkdGgpIHtcbiAgICByZXR1cm4ge2JhbmRXaWR0aDogZmllbGREZWYuc2NhbGUuYmFuZFdpZHRofTtcbiAgfVxuXG4gIGlmIChmaWVsZERlZi5zY2FsZS5yYW5nZSkgeyAvLyBleHBsaWNpdCB2YWx1ZVxuICAgIHJldHVybiB7cmFuZ2U6IGZpZWxkRGVmLnNjYWxlLnJhbmdlfTtcbiAgfVxuXG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgWDpcbiAgICAgIC8vIHdlIGNhbid0IHVzZSB7cmFuZ2U6IFwid2lkdGhcIn0gaGVyZSBzaW5jZSB3ZSBwdXQgc2NhbGUgaW4gdGhlIHJvb3QgZ3JvdXBcbiAgICAgIC8vIG5vdCBpbnNpZGUgdGhlIGNlbGwsIHNvIHNjYWxlIGlzIHJldXNhYmxlIGZvciBheGVzIGdyb3VwXG4gICAgICByZXR1cm4ge3JhbmdlTWluOiAwLCByYW5nZU1heDogbW9kZWwubGF5b3V0KCkuY2VsbFdpZHRofTtcbiAgICBjYXNlIFk6XG4gICAgICAvLyBXZSBjYW4ndCB1c2Uge3JhbmdlOiBcImhlaWdodFwifSBoZXJlIGZvciB0aGUgc2FtZSByZWFzb25cbiAgICAgIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICByZXR1cm4ge3JhbmdlTWluOiAwLCByYW5nZU1heDogbW9kZWwubGF5b3V0KCkuY2VsbEhlaWdodH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge3JhbmdlTWluOiBtb2RlbC5sYXlvdXQoKS5jZWxsSGVpZ2h0LCByYW5nZU1heDogMH07XG4gICAgY2FzZSBTSVpFOlxuICAgICAgaWYgKG1vZGVsLmlzKEJBUikpIHtcbiAgICAgICAgLy8gVE9ETzogZGV0ZXJtaW5lIGJhbmRTaXplIGZvciBiaW4sIHdoaWNoIGFjdHVhbGx5IHVzZXMgbGluZWFyIHNjYWxlXG4gICAgICAgIGNvbnN0IGRpbWVuc2lvbiA9IG1vZGVsLmNvbmZpZygpLm1hcmsub3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyBZIDogWDtcbiAgICAgICAgcmV0dXJuIHtyYW5nZTogWzIsIG1vZGVsLmZpZWxkRGVmKGRpbWVuc2lvbikuc2NhbGUuYmFuZFdpZHRoXX07XG4gICAgICB9IGVsc2UgaWYgKG1vZGVsLmlzKFRFWFRfTUFSSykpIHtcbiAgICAgICAgcmV0dXJuIHtyYW5nZTogWzgsIDQwXX07XG4gICAgICB9XG4gICAgICAvLyBlbHNlIC0tIHBvaW50LCBzcXVhcmUsIGNpcmNsZVxuICAgICAgY29uc3QgeElzTWVhc3VyZSA9IG1vZGVsLmlzTWVhc3VyZShYKTtcbiAgICAgIGNvbnN0IHlJc01lYXN1cmUgPSBtb2RlbC5pc01lYXN1cmUoWSk7XG5cbiAgICAgIGNvbnN0IGJhbmRXaWR0aCA9IHhJc01lYXN1cmUgIT09IHlJc01lYXN1cmUgP1xuICAgICAgICBtb2RlbC5maWVsZERlZih4SXNNZWFzdXJlID8gWSA6IFgpLnNjYWxlLmJhbmRXaWR0aCA6XG4gICAgICAgIE1hdGgubWluKFxuICAgICAgICAgIG1vZGVsLmZpZWxkRGVmKFgpLnNjYWxlLmJhbmRXaWR0aCB8fCAyMSAvKiBjb25maWcuc2NhbGUuYmFuZFdpZHRoICovLFxuICAgICAgICAgIG1vZGVsLmZpZWxkRGVmKFkpLnNjYWxlLmJhbmRXaWR0aCB8fCAyMSAvKiBjb25maWcuc2NhbGUuYmFuZFdpZHRoICovXG4gICAgICAgICk7XG5cbiAgICAgIHJldHVybiB7cmFuZ2U6IFsxMCwgKGJhbmRXaWR0aCAtIDIpICogKGJhbmRXaWR0aCAtIDIpXX07XG4gICAgY2FzZSBTSEFQRTpcbiAgICAgIHJldHVybiB7cmFuZ2U6ICdzaGFwZXMnfTtcbiAgICBjYXNlIENPTE9SOlxuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IE5PTUlOQUxcbiAgICAgICAgfHwgZmllbGREZWYudHlwZSA9PT0gT1JESU5BTCAvLyBGSVhNRSByZW1vdmUgdGhpcyBvbmNlIHdlIHN1cHBvcnQgY29sb3IgcmFtcCBmb3Igb3JkaW5hbFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB7cmFuZ2U6ICdjYXRlZ29yeTEwJ307XG4gICAgICB9XG4gICAgICAvLyBlbHNlIC0tIHRpbWUgb3IgcXVhbnRpdGF0aXZlXG4gICAgICByZXR1cm4ge3JhbmdlOiBbJyNBRkM2QTMnLCAnIzA5NjIyQSddfTsgLy8gdGFibGVhdSBncmVlbnNcbiAgICBjYXNlIFJPVzpcbiAgICAgIHJldHVybiB7cmFuZ2U6ICdoZWlnaHQnfTtcbiAgICBjYXNlIENPTFVNTjpcbiAgICAgIHJldHVybiB7cmFuZ2U6ICd3aWR0aCd9O1xuICB9XG4gIHJldHVybiB7fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBpZiAobW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUucm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5yb3VuZDtcbiAgfVxuXG4gIC8vIEZJWE1FOiByZXZpc2UgaWYgcm91bmQgaXMgYWxyZWFkeSB0aGUgZGVmYXVsdCB2YWx1ZVxuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFg6IC8qIGZhbGwgdGhyb3VnaCAqL1xuICAgIGNhc2UgWTpcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTFVNTjpcbiAgICBjYXNlIFNJWkU6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gemVybyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgdmFyIGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gIHZhciB0aW1lVW5pdCA9IGZpZWxkRGVmLnRpbWVVbml0O1xuXG4gIGlmIChmaWVsZERlZi5zY2FsZS56ZXJvICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBleHBsaWNpdCB2YWx1ZVxuICAgIHJldHVybiBmaWVsZERlZi5zY2FsZS56ZXJvO1xuICB9XG5cbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMKSB7XG4gICAgaWYgKHRpbWVVbml0ID09PSAneWVhcicpIHtcbiAgICAgIC8vIHllYXIgaXMgdXNpbmcgbGluZWFyIHNjYWxlLCBidXQgc2hvdWxkIG5vdCBpbmNsdWRlIHplcm9cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gdGltZVVuaXQgb3IgdGhlIHRpbWVVbml0IHVzZXMgb3JkaW5hbCBzY2FsZSxcbiAgICAvLyB6ZXJvIHByb3BlcnR5IGlzIGlnbm9yZWQgYnkgdmVnYSBzbyB3ZSBzaG91bGQgbm90IGdlbmVyYXRlIHRoZW0gYW55IHdheVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIC8vIFJldHVybnMgZmFsc2UgKHVuZGVmaW5lZCkgYnkgZGVmYXVsdCBvZiBiaW5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gY2hhbm5lbCA9PT0gWCB8fCBjaGFubmVsID09PSBZID9cbiAgICAvLyBpZiBub3QgYmluIC8gdGVtcG9yYWwsIHJldHVybnMgdW5kZWZpbmVkIGZvciBYIGFuZCBZIGVuY29kaW5nXG4gICAgLy8gc2luY2UgemVybyBpcyB0cnVlIGJ5IGRlZmF1bHQgaW4gdmVnYSBmb3IgbGluZWFyIHNjYWxlXG4gICAgdW5kZWZpbmVkIDpcbiAgICBmYWxzZTtcbn1cbiIsImltcG9ydCB7U3BlY30gZnJvbSAnLi4vc2NoZW1hL3NjaGVtYSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtDaGFubmVsLCBYLCBZLCBDT0xPUiwgREVUQUlMLCBPUkRFUn0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0JBUiwgQVJFQX0gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge2ZpZWxkLCBpc01lYXN1cmV9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7aGFzLCBpc0FnZ3JlZ2F0ZX0gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtpc0FycmF5LCBjb250YWluc30gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge3NvcnRGaWVsZH0gZnJvbSAnLi91dGlsJztcblxuaW1wb3J0IHt0eXBlIGFzIHNjYWxlVHlwZX0gZnJvbSAnLi9zY2FsZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhY2tQcm9wZXJ0aWVzIHtcbiAgLyoqIERpbWVuc2lvbiBheGlzIG9mIHRoZSBzdGFjayAoJ3gnIG9yICd5JykuICovXG4gIGdyb3VwYnlDaGFubmVsOiBDaGFubmVsO1xuICAvKiogTWVhc3VyZSBheGlzIG9mIHRoZSBzdGFjayAoJ3gnIG9yICd5JykuICovXG4gIGZpZWxkQ2hhbm5lbDogQ2hhbm5lbDtcblxuICAvKiogU3RhY2stYnkgZmllbGQgbmFtZXMgKGZyb20gJ2NvbG9yJyBhbmQgJ2RldGFpbCcpICovXG4gIHN0YWNrRmllbGRzOiBzdHJpbmdbXTtcblxuICAvKiogU3RhY2sgb2Zmc2V0IHByb3BlcnR5LiAqL1xuICBvZmZzZXQ6IHN0cmluZztcbn1cblxuLy8gVE9ETzogcHV0IGFsbCB2ZWdhIGludGVyZmFjZSBpbiBvbmUgcGxhY2VcbmludGVyZmFjZSBTdGFja1RyYW5zZm9ybSB7XG4gIHR5cGU6IHN0cmluZztcbiAgb2Zmc2V0PzogYW55O1xuICBncm91cGJ5OiBhbnk7XG4gIGZpZWxkOiBhbnk7XG4gIHNvcnRieTogYW55O1xuICBvdXRwdXQ6IGFueTtcbn1cblxuLyoqIENvbXBpbGUgc3RhY2sgcHJvcGVydGllcyBmcm9tIGEgZ2l2ZW4gc3BlYyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVTdGFja1Byb3BlcnRpZXMoc3BlYzogU3BlYykge1xuICBjb25zdCBzdGFja0ZpZWxkcyA9IGdldFN0YWNrRmllbGRzKHNwZWMpO1xuXG4gIGlmIChzdGFja0ZpZWxkcy5sZW5ndGggPiAwICYmXG4gICAgICBjb250YWlucyhbQkFSLCBBUkVBXSwgc3BlYy5tYXJrKSAmJlxuICAgICAgc3BlYy5jb25maWcubWFyay5zdGFja2VkICE9PSAnbm9uZScgJiZcbiAgICAgIGlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpKSB7XG5cbiAgICB2YXIgaXNYTWVhc3VyZSA9IGhhcyhzcGVjLmVuY29kaW5nLCBYKSAmJiBpc01lYXN1cmUoc3BlYy5lbmNvZGluZy54KTtcbiAgICB2YXIgaXNZTWVhc3VyZSA9IGhhcyhzcGVjLmVuY29kaW5nLCBZKSAmJiBpc01lYXN1cmUoc3BlYy5lbmNvZGluZy55KTtcblxuICAgIGlmIChpc1hNZWFzdXJlICYmICFpc1lNZWFzdXJlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBncm91cGJ5Q2hhbm5lbDogWSxcbiAgICAgICAgZmllbGRDaGFubmVsOiBYLFxuICAgICAgICBzdGFja0ZpZWxkczogc3RhY2tGaWVsZHMsXG4gICAgICAgIG9mZnNldDogc3BlYy5jb25maWcubWFyay5zdGFja2VkXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoaXNZTWVhc3VyZSAmJiAhaXNYTWVhc3VyZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ3JvdXBieUNoYW5uZWw6IFgsXG4gICAgICAgIGZpZWxkQ2hhbm5lbDogWSxcbiAgICAgICAgc3RhY2tGaWVsZHM6IHN0YWNrRmllbGRzLFxuICAgICAgICBvZmZzZXQ6IHNwZWMuY29uZmlnLm1hcmsuc3RhY2tlZFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKiBDb21waWxlIHN0YWNrLWJ5IGZpZWxkIG5hbWVzIGZyb20gKGZyb20gJ2NvbG9yJyBhbmQgJ2RldGFpbCcpICovXG5mdW5jdGlvbiBnZXRTdGFja0ZpZWxkcyhzcGVjOiBTcGVjKSB7XG4gIHJldHVybiBbQ09MT1IsIERFVEFJTF0ucmVkdWNlKGZ1bmN0aW9uKGZpZWxkcywgY2hhbm5lbCkge1xuICAgIGNvbnN0IGNoYW5uZWxFbmNvZGluZyA9IHNwZWMuZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgaWYgKGhhcyhzcGVjLmVuY29kaW5nLCBjaGFubmVsKSkge1xuICAgICAgaWYgKGlzQXJyYXkoY2hhbm5lbEVuY29kaW5nKSkge1xuICAgICAgICBjaGFubmVsRW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZERlZikge1xuICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKGZpZWxkRGVmKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmllbGREZWY6IEZpZWxkRGVmID0gY2hhbm5lbEVuY29kaW5nO1xuICAgICAgICBmaWVsZHMucHVzaChmaWVsZChmaWVsZERlZiwge1xuICAgICAgICAgIGJpblN1ZmZpeDogc2NhbGVUeXBlKGZpZWxkRGVmLCBjaGFubmVsLCBzcGVjLm1hcmspID09PSAnb3JkaW5hbCcgPyAnX3JhbmdlJyA6ICdfc3RhcnQnXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkcztcbiAgfSwgW10pO1xufVxuXG4vLyBpbXB1dGUgZGF0YSBmb3Igc3RhY2tlZCBhcmVhXG5leHBvcnQgZnVuY3Rpb24gaW1wdXRlVHJhbnNmb3JtKG1vZGVsOiBNb2RlbCkge1xuICBjb25zdCBzdGFjayA9IG1vZGVsLnN0YWNrKCk7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ2ltcHV0ZScsXG4gICAgZmllbGQ6IG1vZGVsLmZpZWxkKHN0YWNrLmZpZWxkQ2hhbm5lbCksXG4gICAgZ3JvdXBieTogc3RhY2suc3RhY2tGaWVsZHMsXG4gICAgb3JkZXJieTogW21vZGVsLmZpZWxkKHN0YWNrLmdyb3VwYnlDaGFubmVsKV0sXG4gICAgbWV0aG9kOiAndmFsdWUnLFxuICAgIHZhbHVlOiAwXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFja1RyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaygpO1xuICBjb25zdCBlbmNvZGluZyA9IG1vZGVsLnNwZWMoKS5lbmNvZGluZztcbiAgY29uc3Qgc29ydGJ5ID0gbW9kZWwuaGFzKE9SREVSKSA/XG4gICAgKGlzQXJyYXkoZW5jb2RpbmdbT1JERVJdKSA/IGVuY29kaW5nW09SREVSXSA6IFtlbmNvZGluZ1tPUkRFUl1dKS5tYXAoc29ydEZpZWxkKSA6XG4gICAgLy8gZGVmYXVsdCA9IGRlc2NlbmRpbmcgYnkgc3RhY2tGaWVsZHNcbiAgICBzdGFjay5zdGFja0ZpZWxkcy5tYXAoZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgcmV0dXJuICctJyArIGZpZWxkO1xuICAgIH0pO1xuXG4gIGNvbnN0IHZhbE5hbWUgPSBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpO1xuXG4gIC8vIGFkZCBzdGFjayB0cmFuc2Zvcm0gdG8gbWFya1xuICB2YXIgdHJhbnNmb3JtOiBTdGFja1RyYW5zZm9ybSA9IHtcbiAgICB0eXBlOiAnc3RhY2snLFxuICAgIGdyb3VwYnk6IFttb2RlbC5maWVsZChzdGFjay5ncm91cGJ5Q2hhbm5lbCldLFxuICAgIGZpZWxkOiBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpLFxuICAgIHNvcnRieTogc29ydGJ5LFxuICAgIG91dHB1dDoge1xuICAgICAgc3RhcnQ6IHZhbE5hbWUgKyAnX3N0YXJ0JyxcbiAgICAgIGVuZDogdmFsTmFtZSArICdfZW5kJ1xuICAgIH1cbiAgfTtcblxuICBpZiAoc3RhY2sub2Zmc2V0KSB7XG4gICAgdHJhbnNmb3JtLm9mZnNldCA9IHN0YWNrLm9mZnNldDtcbiAgfVxuICByZXR1cm4gdHJhbnNmb3JtO1xufVxuIiwiaW1wb3J0IHtjb250YWlucywgcmFuZ2V9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtDT0xVTU4sIFJPVywgU0hBUEUsIENPTE9SLCBDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcblxuLyoqIHJldHVybnMgdGhlIHRlbXBsYXRlIG5hbWUgdXNlZCBmb3IgYXhpcyBsYWJlbHMgZm9yIGEgdGltZSB1bml0ICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0KHRpbWVVbml0LCBhYmJyZXZpYXRlZCA9IGZhbHNlKTogc3RyaW5nIHtcbiAgaWYgKCF0aW1lVW5pdCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBsZXQgZGF0ZUNvbXBvbmVudHMgPSBbXTtcblxuICBpZiAodGltZVVuaXQuaW5kZXhPZigneWVhcicpID4gLTEpIHtcbiAgICBkYXRlQ29tcG9uZW50cy5wdXNoKGFiYnJldmlhdGVkID8gJyV5JyA6ICclWScpO1xuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ21vbnRoJykgPiAtMSkge1xuICAgIGRhdGVDb21wb25lbnRzLnB1c2goYWJicmV2aWF0ZWQgPyAnJWInIDogJyVCJyk7XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignZGF5JykgPiAtMSkge1xuICAgIGRhdGVDb21wb25lbnRzLnB1c2goYWJicmV2aWF0ZWQgPyAnJWEnIDogJyVBJyk7XG4gIH0gZWxzZSBpZiAodGltZVVuaXQuaW5kZXhPZignZGF0ZScpID4gLTEpIHtcbiAgICBkYXRlQ29tcG9uZW50cy5wdXNoKCclZCcpO1xuICB9XG5cbiAgbGV0IHRpbWVDb21wb25lbnRzID0gW107XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ2hvdXInKSA+IC0xKSB7XG4gICAgdGltZUNvbXBvbmVudHMucHVzaCgnJUgnKTtcbiAgfVxuICBpZiAodGltZVVuaXQuaW5kZXhPZignbWludXRlJykgPiAtMSkge1xuICAgIHRpbWVDb21wb25lbnRzLnB1c2goJyVNJyk7XG4gIH1cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ3NlY29uZCcpID4gLTEpIHtcbiAgICB0aW1lQ29tcG9uZW50cy5wdXNoKCclUycpO1xuICB9XG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdtaWxsaXNlY29uZHMnKSA+IC0xKSB7XG4gICAgdGltZUNvbXBvbmVudHMucHVzaCgnJUwnKTtcbiAgfVxuXG4gIGxldCBvdXQgPSBbXTtcbiAgaWYgKGRhdGVDb21wb25lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBvdXQucHVzaChkYXRlQ29tcG9uZW50cy5qb2luKCctJykpO1xuICB9XG4gIGlmICh0aW1lQ29tcG9uZW50cy5sZW5ndGggPiAwKSB7XG4gICAgb3V0LnB1c2godGltZUNvbXBvbmVudHMuam9pbignOicpKTtcbiAgfVxuXG4gIHJldHVybiBvdXQubGVuZ3RoID4gMCA/IG91dC5qb2luKCcgJykgOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUV4cHJlc3Npb24odGltZVVuaXQ6IHN0cmluZywgZmllbGRSZWY6IHN0cmluZywgb25seVJlZiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgbGV0IG91dCA9ICdkYXRldGltZSgnO1xuXG4gIGZ1bmN0aW9uIGdldChmdW46IHN0cmluZywgYWRkQ29tbWEgPSB0cnVlKSB7XG4gICAgaWYgKG9ubHlSZWYpIHtcbiAgICAgIHJldHVybiBmaWVsZFJlZiArIChhZGRDb21tYSA/ICcsICcgOiAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmdW4gKyAnKCcgKyBmaWVsZFJlZiArICcpJyArIChhZGRDb21tYSA/ICcsICcgOiAnJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ3llYXInKSA+IC0xKSB7XG4gICAgb3V0ICs9IGdldCgneWVhcicpO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnMjAwNiwgJzsgLy8gSmFudWFyeSAxIDIwMDYgaXMgYSBTdW5kYXlcbiAgfVxuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdtb250aCcpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCdtb250aCcpO1xuICB9IGVsc2Uge1xuICAgIC8vIG1vbnRoIHN0YXJ0cyBhdCAwIGluIGphdmFzY3JpcHRcbiAgICBvdXQgKz0gJzAsICc7XG4gIH1cblxuICAvLyBuZWVkIHRvIGFkZCAxIGJlY2F1c2UgZGF5cyBzdGFydCBhdCAxXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdkYXknKSA+IC0xKSB7XG4gICAgb3V0ICs9IGdldCgnZGF5JywgZmFsc2UpICsgJysxLCAnO1xuICB9IGVsc2UgaWYgKHRpbWVVbml0LmluZGV4T2YoJ2RhdGUnKSA+IC0xKSB7XG4gICAgb3V0ICs9IGdldCgnZGF0ZScpO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnMSwgJztcbiAgfVxuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdob3VycycpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCdob3VycycpO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnMCwgJztcbiAgfVxuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdtaW51dGVzJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ21pbnV0ZXMnKTtcbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJzAsICc7XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignc2Vjb25kcycpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCdzZWNvbmRzJyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcwLCAnO1xuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ21pbGxpc2Vjb25kcycpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCdtaWxsaXNlY29uZHMnLCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcwJztcbiAgfVxuXG4gIHJldHVybiBvdXQgKyAnKSc7XG59XG5cbi8qKiBHZW5lcmF0ZSB0aGUgY29tcGxldGUgcmF3IGRvbWFpbi4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYXdEb21haW4odGltZVVuaXQ6IHN0cmluZywgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBpZiAoY29udGFpbnMoW1JPVywgQ09MVU1OLCBTSEFQRSwgQ09MT1JdLCBjaGFubmVsKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc3dpdGNoICh0aW1lVW5pdCkge1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgICAgcmV0dXJuIHJhbmdlKDAsIDYwKTtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICAgIHJldHVybiByYW5nZSgwLCA2MCk7XG4gICAgY2FzZSAnaG91cnMnOlxuICAgICAgcmV0dXJuIHJhbmdlKDAsIDI0KTtcbiAgICBjYXNlICdkYXknOlxuICAgICAgcmV0dXJuIHJhbmdlKDAsIDcpO1xuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIHJhbmdlKDEsIDMyKTtcbiAgICBjYXNlICdtb250aCc6XG4gICAgICByZXR1cm4gcmFuZ2UoMCwgMTIpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWSwgU0laRSwgQ09MT1IsIFNIQVBFLCBURVhULCBMQUJFTCwgQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2ZpZWxkfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge1FVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHtmb3JtYXQgYXMgdGltZUZvcm1hdEV4cHJ9IGZyb20gJy4vdGltZSc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi91dGlsJztcblxuZXhwb3J0IGVudW0gQ29sb3JNb2RlIHtcbiAgQUxXQVlTX0ZJTExFRCxcbiAgQUxXQVlTX1NUUk9LRUQsXG4gIEZJTExFRF9CWV9ERUZBVUxULFxuICBTVFJPS0VEX0JZX0RFRkFVTFRcbn1cblxuZXhwb3J0IGNvbnN0IEZJTExfU1RST0tFX0NPTkZJRyA9IFsnZmlsbCcsICdmaWxsT3BhY2l0eScsXG4gICdzdHJva2UnLCAnc3Ryb2tlV2lkdGgnLCAnc3Ryb2tlRGFzaCcsICdzdHJva2VEYXNoT2Zmc2V0JywgJ3N0cm9rZU9wYWNpdHknLFxuICAnb3BhY2l0eSddO1xuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlDb2xvckFuZE9wYWNpdHkocCwgbW9kZWw6IE1vZGVsLCBjb2xvck1vZGU6IENvbG9yTW9kZSA9IENvbG9yTW9kZS5TVFJPS0VEX0JZX0RFRkFVTFQpIHtcbiAgY29uc3QgZmlsbGVkID0gY29sb3JNb2RlID09PSBDb2xvck1vZGUuQUxXQVlTX0ZJTExFRCA/IHRydWUgOlxuICAgIGNvbG9yTW9kZSA9PT0gQ29sb3JNb2RlLkFMV0FZU19TVFJPS0VEID8gZmFsc2UgOlxuICAgICAgbW9kZWwuY29uZmlnKCkubWFyay5maWxsZWQgIT09IHVuZGVmaW5lZCA/IG1vZGVsLmNvbmZpZygpLm1hcmsuZmlsbGVkIDpcbiAgICAgICAgY29sb3JNb2RlID09PSBDb2xvck1vZGUuRklMTEVEX0JZX0RFRkFVTFQgPyB0cnVlIDpcbiAgICAgICAgICBmYWxzZTsgLy8gQ29sb3JNb2RlLlNUUk9LRURfQllfREVGQVVMVFxuXG4gIGlmIChmaWxsZWQpIHtcbiAgICBpZiAobW9kZWwuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKENPTE9SKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKENPTE9SKVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZSkge1xuICAgICAgcC5maWxsID0geyB2YWx1ZTogbW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuZmlsbCA9IHsgdmFsdWU6IG1vZGVsLmNvbmZpZygpLm1hcmsuY29sb3IgfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKG1vZGVsLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuc3Ryb2tlID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKENPTE9SKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKENPTE9SKVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZSkge1xuICAgICAgcC5zdHJva2UgPSB7IHZhbHVlOiBtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWUgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC5zdHJva2UgPSB7IHZhbHVlOiBtb2RlbC5jb25maWcoKS5tYXJrLmNvbG9yIH07XG4gICAgfVxuICB9XG5cbiAgLy8gQXBwbHkgZmlsbCBhbmQgc3Ryb2tlIGNvbmZpZyBsYXRlclxuICAvLyBgZmlsbGAgYW5kIGBzdHJva2VgIGNvbmZpZyBjYW4gb3ZlcnJpZGUgYGNvbG9yYCBjb25maWdcbiAgYXBwbHlNYXJrQ29uZmlnKHAsIG1vZGVsLCBGSUxMX1NUUk9LRV9DT05GSUcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlNYXJrQ29uZmlnKG1hcmtzUHJvcGVydGllcywgbW9kZWw6IE1vZGVsLCBwcm9wc0xpc3Q6IHN0cmluZ1tdKSB7XG4gIHByb3BzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgY29uc3QgdmFsdWUgPSBtb2RlbC5jb25maWcoKS5tYXJrW3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbWFya3NQcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IHsgdmFsdWU6IHZhbHVlIH07XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiAqIEJ1aWxkcyBhbiBvYmplY3Qgd2l0aCBmb3JtYXQgYW5kIGZvcm1hdFR5cGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0gZm9ybWF0IGV4cGxpY2l0bHkgc3BlY2lmaWVkIGZvcm1hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TWl4aW5zKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgZm9ybWF0OiBzdHJpbmcpIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICBpZighY29udGFpbnMoW1FVQU5USVRBVElWRSwgVEVNUE9SQUxdLCBmaWVsZERlZi50eXBlKSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGxldCBkZWY6IGFueSA9IHt9O1xuXG4gIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xuICAgIGRlZi5mb3JtYXRUeXBlID0gJ3RpbWUnO1xuICB9XG5cbiAgaWYgKGZvcm1hdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZGVmLmZvcm1hdCA9IGZvcm1hdDtcbiAgfSBlbHNlIHtcbiAgICBzd2l0Y2ggKGZpZWxkRGVmLnR5cGUpIHtcbiAgICAgIGNhc2UgUVVBTlRJVEFUSVZFOlxuICAgICAgICBkZWYuZm9ybWF0ID0gbW9kZWwuY29uZmlnKCkubnVtYmVyRm9ybWF0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVEVNUE9SQUw6XG4gICAgICAgIGRlZi5mb3JtYXQgPSB0aW1lRm9ybWF0KG1vZGVsLCBjaGFubmVsKSB8fCBtb2RlbC5jb25maWcoKS50aW1lRm9ybWF0O1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoY2hhbm5lbCA9PT0gVEVYVCkge1xuICAgIC8vIHRleHQgZG9lcyBub3Qgc3VwcG9ydCBmb3JtYXQgYW5kIGZvcm1hdFR5cGVcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhL2lzc3Vlcy81MDVcblxuICAgIGNvbnN0IGZpbHRlciA9IChkZWYuZm9ybWF0VHlwZSB8fCAnbnVtYmVyJykgKyAoZGVmLmZvcm1hdCA/ICc6XFwnJyArIGRlZi5mb3JtYXQgKyAnXFwnJyA6ICcnKTtcbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDoge1xuICAgICAgICB0ZW1wbGF0ZTogJ3t7JyArIG1vZGVsLmZpZWxkKGNoYW5uZWwsIHsgZGF0dW06IHRydWUgfSkgKyAnIHwgJyArIGZpbHRlciArICd9fSdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGRlZjtcbn1cblxuZnVuY3Rpb24gaXNBYmJyZXZpYXRlZChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZikge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTFVNTjpcbiAgICBjYXNlIFg6XG4gICAgY2FzZSBZOlxuICAgICAgcmV0dXJuIG1vZGVsLmF4aXMoY2hhbm5lbCkuc2hvcnRUaW1lTGFiZWxzO1xuICAgIGNhc2UgQ09MT1I6XG4gICAgY2FzZSBTSEFQRTpcbiAgICBjYXNlIFNJWkU6XG4gICAgICByZXR1cm4gbW9kZWwubGVnZW5kKGNoYW5uZWwpLnNob3J0VGltZUxhYmVscztcbiAgICBjYXNlIFRFWFQ6XG4gICAgICByZXR1cm4gbW9kZWwuY29uZmlnKCkubWFyay5zaG9ydFRpbWVMYWJlbHM7XG4gICAgY2FzZSBMQUJFTDpcbiAgICAgIC8vIFRPRE8oIzg5Nyk6IGltcGxlbWVudCB3aGVuIHdlIGhhdmUgbGFiZWxcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cblxuXG4vKiogUmV0dXJuIGZpZWxkIHJlZmVyZW5jZSB3aXRoIHBvdGVudGlhbCBcIi1cIiBwcmVmaXggZm9yIGRlc2NlbmRpbmcgc29ydCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRGaWVsZChmaWVsZERlZjogRmllbGREZWYpIHtcbiAgcmV0dXJuIChmaWVsZERlZi5zb3J0ID09PSAnZGVzY2VuZGluZycgPyAnLScgOiAnJykgKyBmaWVsZChmaWVsZERlZik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdGltZSBmb3JtYXQgdXNlZCBmb3IgYXhpcyBsYWJlbHMgZm9yIGEgdGltZSB1bml0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZUZvcm1hdChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpOiBzdHJpbmcge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICByZXR1cm4gdGltZUZvcm1hdEV4cHIoZmllbGREZWYudGltZVVuaXQsIGlzQWJicmV2aWF0ZWQobW9kZWwsIGNoYW5uZWwsIGZpZWxkRGVmKSk7XG59XG4iLCIvKlxuICogQ29uc3RhbnRzIGFuZCB1dGlsaXRpZXMgZm9yIGRhdGEuXG4gKi9cblxuaW1wb3J0IHtOT01JTkFMLCBRVUFOVElUQVRJVkUsIFRFTVBPUkFMfSBmcm9tICcuL3R5cGUnO1xuXG5leHBvcnQgY29uc3QgU1VNTUFSWSA9ICdzdW1tYXJ5JztcbmV4cG9ydCBjb25zdCBTT1VSQ0UgPSAnc291cmNlJztcbmV4cG9ydCBjb25zdCBTVEFDS0VEX1NDQUxFID0gJ3N0YWNrZWRfc2NhbGUnO1xuZXhwb3J0IGNvbnN0IExBWU9VVCA9ICdsYXlvdXQnO1xuXG4vKiogTWFwcGluZyBmcm9tIGRhdGFsaWIncyBpbmZlcnJlZCB0eXBlIHRvIFZlZ2EtbGl0ZSdzIHR5cGUgKi9cbi8vIFRPRE86IEFMTF9DQVBTXG5leHBvcnQgY29uc3QgdHlwZXMgPSB7XG4gICdib29sZWFuJzogTk9NSU5BTCxcbiAgJ251bWJlcic6IFFVQU5USVRBVElWRSxcbiAgJ2ludGVnZXInOiBRVUFOVElUQVRJVkUsXG4gICdkYXRlJzogVEVNUE9SQUwsXG4gICdzdHJpbmcnOiBOT01JTkFMXG59O1xuIiwiLy8gdXRpbGl0eSBmb3IgZW5jb2RpbmcgbWFwcGluZ1xuaW1wb3J0IHtFbmNvZGluZ30gZnJvbSAnLi9zY2hlbWEvZW5jb2Rpbmcuc2NoZW1hJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge0NoYW5uZWwsIENIQU5ORUxTfSBmcm9tICcuL2NoYW5uZWwnO1xuaW1wb3J0IHtpc0FycmF5LCBhbnkgYXMgYW55SW59IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3VudFJldGluYWwoZW5jb2Rpbmc6IEVuY29kaW5nKSB7XG4gIHZhciBjb3VudCA9IDA7XG4gIGlmIChlbmNvZGluZy5jb2xvcikgeyBjb3VudCsrOyB9XG4gIGlmIChlbmNvZGluZy5zaXplKSB7IGNvdW50Kys7IH1cbiAgaWYgKGVuY29kaW5nLnNoYXBlKSB7IGNvdW50Kys7IH1cbiAgcmV0dXJuIGNvdW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hhbm5lbHMoZW5jb2Rpbmc6IEVuY29kaW5nKSB7XG4gIHJldHVybiBDSEFOTkVMUy5maWx0ZXIoZnVuY3Rpb24oY2hhbm5lbCkge1xuICAgIHJldHVybiBoYXMoZW5jb2RpbmcsIGNoYW5uZWwpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhcyhlbmNvZGluZzogRW5jb2RpbmcsIGNoYW5uZWw6IENoYW5uZWwpOiBib29sZWFuIHtcbiAgY29uc3QgY2hhbm5lbEVuY29kaW5nID0gZW5jb2RpbmcgJiYgZW5jb2RpbmdbY2hhbm5lbF07XG4gIHJldHVybiBjaGFubmVsRW5jb2RpbmcgJiYgKFxuICAgIGNoYW5uZWxFbmNvZGluZy5maWVsZCAhPT0gdW5kZWZpbmVkIHx8XG4gICAgKGlzQXJyYXkoY2hhbm5lbEVuY29kaW5nKSAmJiBjaGFubmVsRW5jb2RpbmcubGVuZ3RoID4gMClcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWdncmVnYXRlKGVuY29kaW5nOiBFbmNvZGluZykge1xuICByZXR1cm4gYW55SW4oQ0hBTk5FTFMsIChjaGFubmVsKSA9PiB7XG4gICAgaWYgKGhhcyhlbmNvZGluZywgY2hhbm5lbCkgJiYgZW5jb2RpbmdbY2hhbm5lbF0uYWdncmVnYXRlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkRGVmcyhlbmNvZGluZzogRW5jb2RpbmcpOiBGaWVsZERlZltdIHtcbiAgdmFyIGFyciA9IFtdO1xuICBDSEFOTkVMUy5mb3JFYWNoKGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICBpZiAoaGFzKGVuY29kaW5nLCBjaGFubmVsKSkge1xuICAgICAgaWYgKGlzQXJyYXkoZW5jb2RpbmdbY2hhbm5lbF0pKSB7XG4gICAgICAgIGVuY29kaW5nW2NoYW5uZWxdLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWYpIHtcbiAgICAgICAgICBhcnIucHVzaChmaWVsZERlZik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyLnB1c2goZW5jb2RpbmdbY2hhbm5lbF0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcnI7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZm9yRWFjaChlbmNvZGluZzogRW5jb2RpbmcsXG4gICAgZjogKGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgaTogbnVtYmVyKSA9PiB2b2lkLFxuICAgIHRoaXNBcmc/OiBhbnkpIHtcbiAgdmFyIGkgPSAwO1xuICBDSEFOTkVMUy5mb3JFYWNoKGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICBpZiAoaGFzKGVuY29kaW5nLCBjaGFubmVsKSkge1xuICAgICAgaWYgKGlzQXJyYXkoZW5jb2RpbmdbY2hhbm5lbF0pKSB7XG4gICAgICAgIGVuY29kaW5nW2NoYW5uZWxdLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWYpIHtcbiAgICAgICAgICAgIGYuY2FsbCh0aGlzQXJnLCBmaWVsZERlZiwgY2hhbm5lbCwgaSsrKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmLmNhbGwodGhpc0FyZywgZW5jb2RpbmdbY2hhbm5lbF0sIGNoYW5uZWwsIGkrKyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcChlbmNvZGluZzogRW5jb2RpbmcsXG4gICAgZjogKGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgZTogRW5jb2RpbmcpID0+IGFueSxcbiAgICB0aGlzQXJnPzogYW55KSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgQ0hBTk5FTFMuZm9yRWFjaChmdW5jdGlvbihjaGFubmVsKSB7XG4gICAgaWYgKGhhcyhlbmNvZGluZywgY2hhbm5lbCkpIHtcbiAgICAgIGlmIChpc0FycmF5KGVuY29kaW5nW2NoYW5uZWxdKSkge1xuICAgICAgICBlbmNvZGluZ1tjaGFubmVsXS5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkRGVmKSB7XG4gICAgICAgICAgYXJyLnB1c2goZi5jYWxsKHRoaXNBcmcsIGZpZWxkRGVmLCBjaGFubmVsLCBlbmNvZGluZykpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyci5wdXNoKGYuY2FsbCh0aGlzQXJnLCBlbmNvZGluZ1tjaGFubmVsXSwgY2hhbm5lbCwgZW5jb2RpbmcpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlKGVuY29kaW5nOiBFbmNvZGluZyxcbiAgICBmOiAoYWNjOiBhbnksIGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgZTogRW5jb2RpbmcpID0+IGFueSxcbiAgICBpbml0LFxuICAgIHRoaXNBcmc/OiBhbnkpIHtcbiAgdmFyIHIgPSBpbml0O1xuICBDSEFOTkVMUy5mb3JFYWNoKGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICBpZiAoaGFzKGVuY29kaW5nLCBjaGFubmVsKSkge1xuICAgICAgaWYgKGlzQXJyYXkoZW5jb2RpbmdbY2hhbm5lbF0pKSB7XG4gICAgICAgIGVuY29kaW5nW2NoYW5uZWxdLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWYpIHtcbiAgICAgICAgICAgIHIgPSBmLmNhbGwodGhpc0FyZywgciwgZmllbGREZWYsIGNoYW5uZWwsIGVuY29kaW5nKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByID0gZi5jYWxsKHRoaXNBcmcsIHIsIGVuY29kaW5nW2NoYW5uZWxdLCBjaGFubmVsLCBlbmNvZGluZyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHI7XG59XG4iLCIvLyB1dGlsaXR5IGZvciBhIGZpZWxkIGRlZmluaXRpb24gb2JqZWN0XG5cbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge2NvbnRhaW5zLCBnZXRiaW5zfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtOT01JTkFMLCBPUkRJTkFMLCBRVUFOVElUQVRJVkUsIFRFTVBPUkFMfSBmcm9tICcuL3R5cGUnO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGRSZWZPcHRpb24ge1xuICAvKiogZXhjbHVkZSBiaW4sIGFnZ3JlZ2F0ZSwgdGltZVVuaXQgKi9cbiAgbm9mbj86IGJvb2xlYW47XG4gIC8qKiBleGNsdWRlIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9uICovXG4gIG5vQWdncmVnYXRlPzogYm9vbGVhbjtcbiAgLyoqIGluY2x1ZGUgJ2RhdHVtLicgKi9cbiAgZGF0dW0/OiBib29sZWFuO1xuICAvKiogcmVwbGFjZSBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXggKi9cbiAgZm4/OiBzdHJpbmc7XG4gIC8qKiBwcmVwZW5kIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeCAqL1xuICBwcmVmbj86IHN0cmluZztcbiAgLyoqIGFwcGVuZCBzdWZmaXggdG8gdGhlIGZpZWxkIHJlZiBmb3IgYmluIChkZWZhdWx0PSdfc3RhcnQnKSAqL1xuICBiaW5TdWZmaXg/OiBzdHJpbmc7XG4gIC8qKiBhcHBlbmQgc3VmZml4IHRvIHRoZSBmaWVsZCByZWYgKGdlbmVyYWwpICovXG4gIHN1ZmZpeD86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkKGZpZWxkRGVmOiBGaWVsZERlZiwgb3B0OiBGaWVsZFJlZk9wdGlvbiA9IHt9KSB7XG4gIGNvbnN0IHByZWZpeCA9IChvcHQuZGF0dW0gPyAnZGF0dW0uJyA6ICcnKSArIChvcHQucHJlZm4gfHwgJycpO1xuICBjb25zdCBzdWZmaXggPSBvcHQuc3VmZml4IHx8ICcnO1xuICBjb25zdCBmaWVsZCA9IGZpZWxkRGVmLmZpZWxkO1xuXG4gIGlmIChpc0NvdW50KGZpZWxkRGVmKSkge1xuICAgIHJldHVybiBwcmVmaXggKyAnY291bnQnICsgc3VmZml4O1xuICB9IGVsc2UgaWYgKG9wdC5mbikge1xuICAgIHJldHVybiBwcmVmaXggKyBvcHQuZm4gKyAnXycgKyBmaWVsZCArIHN1ZmZpeDtcbiAgfSBlbHNlIGlmICghb3B0Lm5vZm4gJiYgZmllbGREZWYuYmluKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICdiaW5fJyArIGZpZWxkICsgKG9wdC5iaW5TdWZmaXggfHwgc3VmZml4IHx8ICdfc3RhcnQnKTtcbiAgfSBlbHNlIGlmICghb3B0Lm5vZm4gJiYgIW9wdC5ub0FnZ3JlZ2F0ZSAmJiBmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgZmllbGREZWYuYWdncmVnYXRlICsgJ18nICsgZmllbGQgKyBzdWZmaXg7XG4gIH0gZWxzZSBpZiAoIW9wdC5ub2ZuICYmIGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgcmV0dXJuIHByZWZpeCArIGZpZWxkRGVmLnRpbWVVbml0ICsgJ18nICsgZmllbGQgKyBzdWZmaXg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByZWZpeCArIGZpZWxkO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pc0ZpZWxkRGltZW5zaW9uKGZpZWxkRGVmOiBGaWVsZERlZikge1xuICByZXR1cm4gY29udGFpbnMoW05PTUlOQUwsIE9SRElOQUxdLCBmaWVsZERlZi50eXBlKSB8fCAhIWZpZWxkRGVmLmJpbiB8fFxuICAgIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJiAhIWZpZWxkRGVmLnRpbWVVbml0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGltZW5zaW9uKGZpZWxkRGVmOiBGaWVsZERlZikge1xuICByZXR1cm4gZmllbGREZWYgJiYgZmllbGREZWYuZmllbGQgJiYgX2lzRmllbGREaW1lbnNpb24oZmllbGREZWYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNNZWFzdXJlKGZpZWxkRGVmOiBGaWVsZERlZikge1xuICByZXR1cm4gZmllbGREZWYgJiYgZmllbGREZWYuZmllbGQgJiYgIV9pc0ZpZWxkRGltZW5zaW9uKGZpZWxkRGVmKTtcbn1cblxuZXhwb3J0IGNvbnN0IENPVU5UX0RJU1BMQVlOQU1FID0gJ051bWJlciBvZiBSZWNvcmRzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvdW50KCk6IEZpZWxkRGVmIHtcbiAgcmV0dXJuIHsgZmllbGQ6ICcqJywgYWdncmVnYXRlOiAnY291bnQnLCB0eXBlOiBRVUFOVElUQVRJVkUsIGRpc3BsYXlOYW1lOiBDT1VOVF9ESVNQTEFZTkFNRSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb3VudChmaWVsZERlZjogRmllbGREZWYpIHtcbiAgcmV0dXJuIGZpZWxkRGVmLmFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jztcbn1cblxuLy8gRklYTUUgcmVtb3ZlIHRoaXMsIGFuZCB0aGUgZ2V0YmlucyBtZXRob2Rcbi8vIEZJWE1FIHRoaXMgZGVwZW5kcyBvbiBjaGFubmVsXG5leHBvcnQgZnVuY3Rpb24gY2FyZGluYWxpdHkoZmllbGREZWY6IEZpZWxkRGVmLCBzdGF0cywgZmlsdGVyTnVsbCA9IHt9KSB7XG4gIC8vIEZJWE1FIG5lZWQgdG8gdGFrZSBmaWx0ZXIgaW50byBhY2NvdW50XG5cbiAgdmFyIHN0YXQgPSBzdGF0c1tmaWVsZERlZi5maWVsZF07XG4gIHZhciB0eXBlID0gZmllbGREZWYudHlwZTtcblxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgLy8gbmVlZCB0byByZWFzc2lnbiBiaW4sIG90aGVyd2lzZSBjb21waWxhdGlvbiB3aWxsIGZhaWwgZHVlIHRvIGEgVFMgYnVnLlxuICAgIGNvbnN0IGJpbiA9IGZpZWxkRGVmLmJpbjtcbiAgICBsZXQgbWF4YmlucyA9ICh0eXBlb2YgYmluID09PSAnYm9vbGVhbicpID8gdW5kZWZpbmVkIDogYmluLm1heGJpbnM7XG4gICAgaWYgKG1heGJpbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbWF4YmlucyA9IDEwO1xuICAgIH1cblxuICAgIHZhciBiaW5zID0gZ2V0YmlucyhzdGF0LCBtYXhiaW5zKTtcbiAgICByZXR1cm4gKGJpbnMuc3RvcCAtIGJpbnMuc3RhcnQpIC8gYmlucy5zdGVwO1xuICB9XG4gIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xuICAgIHZhciB0aW1lVW5pdCA9IGZpZWxkRGVmLnRpbWVVbml0O1xuICAgIHN3aXRjaCAodGltZVVuaXQpIHtcbiAgICAgIGNhc2UgJ3NlY29uZHMnOiByZXR1cm4gNjA7XG4gICAgICBjYXNlICdtaW51dGVzJzogcmV0dXJuIDYwO1xuICAgICAgY2FzZSAnaG91cnMnOiByZXR1cm4gMjQ7XG4gICAgICBjYXNlICdkYXknOiByZXR1cm4gNztcbiAgICAgIGNhc2UgJ2RhdGUnOiByZXR1cm4gMzE7XG4gICAgICBjYXNlICdtb250aCc6IHJldHVybiAxMjtcbiAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICB2YXIgeWVhcnN0YXQgPSBzdGF0c1sneWVhcl8nICsgZmllbGREZWYuZmllbGRdO1xuXG4gICAgICAgIGlmICgheWVhcnN0YXQpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgICAgICByZXR1cm4geWVhcnN0YXQuZGlzdGluY3QgLVxuICAgICAgICAgIChzdGF0Lm1pc3NpbmcgPiAwICYmIGZpbHRlck51bGxbdHlwZV0gPyAxIDogMCk7XG4gICAgfVxuICAgIC8vIG90aGVyd2lzZSB1c2UgY2FsY3VsYXRpb24gYmVsb3dcbiAgfVxuICBpZiAoZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICAvLyByZW1vdmUgbnVsbFxuICByZXR1cm4gc3RhdC5kaXN0aW5jdCAtXG4gICAgKHN0YXQubWlzc2luZyA+IDAgJiYgZmlsdGVyTnVsbFt0eXBlXSA/IDEgOiAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpdGxlKGZpZWxkRGVmOiBGaWVsZERlZikge1xuICBpZiAoaXNDb3VudChmaWVsZERlZikpIHtcbiAgICByZXR1cm4gQ09VTlRfRElTUExBWU5BTUU7XG4gIH1cbiAgdmFyIGZuID0gZmllbGREZWYuYWdncmVnYXRlIHx8IGZpZWxkRGVmLnRpbWVVbml0IHx8IChmaWVsZERlZi5iaW4gJiYgJ2JpbicpO1xuICBpZiAoZm4pIHtcbiAgICByZXR1cm4gZm4udG9VcHBlckNhc2UoKSArICcoJyArIGZpZWxkRGVmLmZpZWxkICsgJyknO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmaWVsZERlZi5maWVsZDtcbiAgfVxufVxuIiwiZXhwb3J0IGVudW0gTWFyayB7XG4gIEFSRUEgPSAnYXJlYScgYXMgYW55LFxuICBCQVIgPSAnYmFyJyBhcyBhbnksXG4gIExJTkUgPSAnbGluZScgYXMgYW55LFxuICBQT0lOVCA9ICdwb2ludCcgYXMgYW55LFxuICBURVhUID0gJ3RleHQnIGFzIGFueSxcbiAgVElDSyA9ICd0aWNrJyBhcyBhbnksXG4gIENJUkNMRSA9ICdjaXJjbGUnIGFzIGFueSxcbiAgU1FVQVJFID0gJ3NxdWFyZScgYXMgYW55XG59XG5cbmV4cG9ydCBjb25zdCBBUkVBID0gTWFyay5BUkVBO1xuZXhwb3J0IGNvbnN0IEJBUiA9IE1hcmsuQkFSO1xuZXhwb3J0IGNvbnN0IExJTkUgPSBNYXJrLkxJTkU7XG5leHBvcnQgY29uc3QgUE9JTlQgPSBNYXJrLlBPSU5UO1xuZXhwb3J0IGNvbnN0IFRFWFQgPSBNYXJrLlRFWFQ7XG5leHBvcnQgY29uc3QgVElDSyA9IE1hcmsuVElDSztcblxuZXhwb3J0IGNvbnN0IENJUkNMRSA9IE1hcmsuQ0lSQ0xFO1xuZXhwb3J0IGNvbnN0IFNRVUFSRSA9IE1hcmsuU1FVQVJFO1xuIiwiZXhwb3J0IGludGVyZmFjZSBBeGlzIHtcbiAgLy8gVmVnYSBBeGlzIFByb3BlcnRpZXNcbiAgZm9ybWF0Pzogc3RyaW5nO1xuICBncmlkPzogYm9vbGVhbjtcbiAgbGF5ZXI/OiBzdHJpbmc7XG4gIG9mZnNldD86IG51bWJlcjtcbiAgb3JpZW50Pzogc3RyaW5nO1xuICBzdWJkaXZpZGU/OiBudW1iZXI7XG4gIHRpY2tzPzogbnVtYmVyO1xuICB0aWNrUGFkZGluZz86IG51bWJlcjtcbiAgdGlja1NpemU/OiBudW1iZXI7XG4gIHRpY2tTaXplTWFqb3I/OiBudW1iZXI7XG4gIHRpY2tTaXplTWlub3I/OiBudW1iZXI7XG4gIHRpY2tTaXplRW5kPzogbnVtYmVyO1xuICB0aXRsZT86IHN0cmluZztcbiAgdGl0bGVPZmZzZXQ/OiBudW1iZXI7XG4gIHZhbHVlcz86IG51bWJlcltdO1xuICBwcm9wZXJ0aWVzPzogYW55OyAvLyBUT0RPOiBkZWNsYXJlIFZnQXhpc1Byb3BlcnRpZXNcbiAgLy8gVmVnYS1MaXRlIG9ubHlcbiAgY2hhcmFjdGVyV2lkdGg/OiBudW1iZXI7XG4gIGxhYmVsTWF4TGVuZ3RoPzogbnVtYmVyO1xuICBsYWJlbHM/OiBib29sZWFuO1xuICBzaG9ydFRpbWVMYWJlbHM/OiBib29sZWFuO1xuICB0aXRsZU1heExlbmd0aD86IG51bWJlcjtcbn1cblxuZXhwb3J0IHZhciBheGlzID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIC8qIFZlZ2EgQXhpcyBQcm9wZXJ0aWVzICovXG4gICAgZm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgYXhpcyBsYWJlbHMuIElmIHVuZGVmaW5lZCwgYSBnb29kIGZvcm1hdCBpcyBhdXRvbWF0aWNhbGx5IGRldGVybWluZWQuIFZlZ2EtTGl0ZSB1c2VzIEQzXFwncyBmb3JtYXQgcGF0dGVybiBhbmQgYXV0b21hdGljYWxseSBzd2l0Y2hlcyB0byBkYXRldGltZSBmb3JtYXR0ZXJzLidcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBmbGFnIGluZGljYXRlIGlmIGdyaWRsaW5lcyBzaG91bGQgYmUgY3JlYXRlZCBpbiBhZGRpdGlvbiB0byB0aWNrcy4gSWYgYGdyaWRgIGlzIHVuc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAgZm9yIFJPVyBhbmQgQ09MLiBGb3IgWCBhbmQgWSwgdGhlIGRlZmF1bHQgdmFsdWUgaXMgYHRydWVgIGZvciBxdWFudGl0YXRpdmUgYW5kIHRpbWUgZmllbGRzIGFuZCBgZmFsc2VgIG90aGVyd2lzZS4nXG4gICAgfSxcbiAgICBsYXllcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Egc3RyaW5nIGluZGljYXRpbmcgaWYgdGhlIGF4aXMgKGFuZCBhbnkgZ3JpZGxpbmVzKSBzaG91bGQgYmUgcGxhY2VkIGFib3ZlIG9yIGJlbG93IHRoZSBkYXRhIG1hcmtzLidcbiAgICB9LFxuICAgIG9mZnNldDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvZmZzZXQsIGluIHBpeGVscywgYnkgd2hpY2ggdG8gZGlzcGxhY2UgdGhlIGF4aXMgZnJvbSB0aGUgZWRnZSBvZiB0aGUgZW5jbG9zaW5nIGdyb3VwIG9yIGRhdGEgcmVjdGFuZ2xlLidcbiAgICB9LFxuICAgIG9yaWVudDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBlbnVtOiBbJ3RvcCcsICdyaWdodCcsICdsZWZ0JywgJ2JvdHRvbSddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgb3JpZW50YXRpb24gb2YgdGhlIGF4aXMuIE9uZSBvZiB0b3AsIGJvdHRvbSwgbGVmdCBvciByaWdodC4gVGhlIG9yaWVudGF0aW9uIGNhbiBiZSB1c2VkIHRvIGZ1cnRoZXIgc3BlY2lhbGl6ZSB0aGUgYXhpcyB0eXBlIChlLmcuLCBhIHkgYXhpcyBvcmllbnRlZCBmb3IgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIGNoYXJ0KS4nXG4gICAgfSxcbiAgICBzdWJkaXZpZGU6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdJZiBwcm92aWRlZCwgc2V0cyB0aGUgbnVtYmVyIG9mIG1pbm9yIHRpY2tzIGJldHdlZW4gbWFqb3IgdGlja3MgKHRoZSB2YWx1ZSA5IHJlc3VsdHMgaW4gZGVjaW1hbCBzdWJkaXZpc2lvbikuIE9ubHkgYXBwbGljYWJsZSBmb3IgYXhlcyB2aXN1YWxpemluZyBxdWFudGl0YXRpdmUgc2NhbGVzLidcbiAgICB9LFxuICAgIHRpY2tzOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdBIGRlc2lyZWQgbnVtYmVyIG9mIHRpY2tzLCBmb3IgYXhlcyB2aXN1YWxpemluZyBxdWFudGl0YXRpdmUgc2NhbGVzLiBUaGUgcmVzdWx0aW5nIG51bWJlciBtYXkgYmUgZGlmZmVyZW50IHNvIHRoYXQgdmFsdWVzIGFyZSBcIm5pY2VcIiAobXVsdGlwbGVzIG9mIDIsIDUsIDEwKSBhbmQgbGllIHdpdGhpbiB0aGUgdW5kZXJseWluZyBzY2FsZVxcJ3MgcmFuZ2UuJ1xuICAgIH0sXG4gICAgdGlja1BhZGRpbmc6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHBhZGRpbmcsIGluIHBpeGVscywgYmV0d2VlbiB0aWNrcyBhbmQgdGV4dCBsYWJlbHMuJ1xuICAgIH0sXG4gICAgdGlja1NpemU6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBzaXplLCBpbiBwaXhlbHMsIG9mIG1ham9yLCBtaW5vciBhbmQgZW5kIHRpY2tzLidcbiAgICB9LFxuICAgIHRpY2tTaXplTWFqb3I6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBzaXplLCBpbiBwaXhlbHMsIG9mIG1ham9yIHRpY2tzLidcbiAgICB9LFxuICAgIHRpY2tTaXplTWlub3I6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBzaXplLCBpbiBwaXhlbHMsIG9mIG1pbm9yIHRpY2tzLidcbiAgICB9LFxuICAgIHRpY2tTaXplRW5kOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgc2l6ZSwgaW4gcGl4ZWxzLCBvZiBlbmQgdGlja3MuJ1xuICAgIH0sXG4gICAgdGl0bGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIGZvciB0aGUgYXhpcy4gKFNob3dzIGZpZWxkIG5hbWUgYW5kIGl0cyBmdW5jdGlvbiBieSBkZWZhdWx0LiknXG4gICAgfSxcbiAgICB0aXRsZU9mZnNldDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIG9mZnNldCB2YWx1ZSBmb3IgdGhlIGF4aXMuJ1xuICAgIH0sXG4gICAgdmFsdWVzOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnT3B0aW9uYWwgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9ucyBmb3IgY3VzdG9tIGF4aXMgc3R5bGluZy4nXG4gICAgfSxcbiAgICAvKiBWZWdhLWxpdGUgb25seSAqL1xuICAgIGNoYXJhY3RlcldpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiA2LFxuICAgICAgZGVzY3JpcHRpb246ICdDaGFyYWN0ZXIgd2lkdGggZm9yIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5pbmcgdGl0bGUgbWF4IGxlbmd0aC4nXG4gICAgfSxcbiAgICBsYWJlbE1heExlbmd0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjUsXG4gICAgICBtaW5pbXVtOiAxLFxuICAgICAgZGVzY3JpcHRpb246ICdUcnVuY2F0ZSBsYWJlbHMgdGhhdCBhcmUgdG9vIGxvbmcuJ1xuICAgIH0sXG4gICAgbGFiZWxzOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgZGVzY3JpcHRpb246ICdFbmFibGUgb3IgZGlzYWJsZSBsYWJlbHMuJ1xuICAgIH0sXG4gICAgc2hvcnRUaW1lTGFiZWxzOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciBtb250aCBhbmQgZGF5IG5hbWVzIHNob3VsZCBiZSBhYmJyZXZpYXRlZC4nXG4gICAgfSxcbiAgICB0aXRsZU1heExlbmd0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWF4IGxlbmd0aCBmb3IgYXhpcyB0aXRsZSBpZiB0aGUgdGl0bGUgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgZnJvbSB0aGUgZmllbGRcXCdzIGRlc2NyaXB0aW9uLicgK1xuICAgICAgJ0J5IGRlZmF1bHQsIHRoaXMgaXMgYXV0b21hdGljYWxseSBiYXNlZCBvbiBjZWxsIHNpemUgYW5kIGNoYXJhY3RlcldpZHRoIHByb3BlcnR5LidcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge3RvTWFwfSBmcm9tICcuLi91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBCaW4ge1xuICBtaW4/OiBudW1iZXI7XG4gIG1heD86IG51bWJlcjtcbiAgYmFzZT86IG51bWJlcjtcbiAgc3RlcD86IG51bWJlcjtcbiAgc3RlcHM/OiBudW1iZXJbXTtcbiAgbWluc3RlcD86IG51bWJlcjtcbiAgZGl2PzogbnVtYmVyW107XG4gIG1heGJpbnM/OiBudW1iZXI7XG59XG5cbmV4cG9ydCB2YXIgYmluID0ge1xuICB0eXBlOiBbJ2Jvb2xlYW4nLCAnb2JqZWN0J10sXG4gIGRlZmF1bHQ6IGZhbHNlLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbWluOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG1pbmltdW0gYmluIHZhbHVlIHRvIGNvbnNpZGVyLiBJZiB1bnNwZWNpZmllZCwgdGhlIG1pbmltdW0gdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBmaWVsZCBpcyB1c2VkLidcbiAgICB9LFxuICAgIG1heDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBtYXhpbXVtIGJpbiB2YWx1ZSB0byBjb25zaWRlci4gSWYgdW5zcGVjaWZpZWQsIHRoZSBtYXhpbXVtIHZhbHVlIG9mIHRoZSBzcGVjaWZpZWQgZmllbGQgaXMgdXNlZC4nXG4gICAgfSxcbiAgICBiYXNlOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG51bWJlciBiYXNlIHRvIHVzZSBmb3IgYXV0b21hdGljIGJpbiBkZXRlcm1pbmF0aW9uIChkZWZhdWx0IGlzIGJhc2UgMTApLidcbiAgICB9LFxuICAgIHN0ZXA6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdBbiBleGFjdCBzdGVwIHNpemUgdG8gdXNlIGJldHdlZW4gYmlucy4gSWYgcHJvdmlkZWQsIG9wdGlvbnMgc3VjaCBhcyBtYXhiaW5zIHdpbGwgYmUgaWdub3JlZC4nXG4gICAgfSxcbiAgICBzdGVwczoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQW4gYXJyYXkgb2YgYWxsb3dhYmxlIHN0ZXAgc2l6ZXMgdG8gY2hvb3NlIGZyb20uJ1xuICAgIH0sXG4gICAgbWluc3RlcDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgbWluaW11bSBhbGxvd2FibGUgc3RlcCBzaXplIChwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBpbnRlZ2VyIHZhbHVlcykuJ1xuICAgIH0sXG4gICAgZGl2OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdTY2FsZSBmYWN0b3JzIGluZGljYXRpbmcgYWxsb3dhYmxlIHN1YmRpdmlzaW9ucy4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgWzUsIDJdLCB3aGljaCBpbmRpY2F0ZXMgdGhhdCBmb3IgYmFzZSAxMCBudW1iZXJzICh0aGUgZGVmYXVsdCBiYXNlKSwgdGhlIG1ldGhvZCBtYXkgY29uc2lkZXIgZGl2aWRpbmcgYmluIHNpemVzIGJ5IDUgYW5kL29yIDIuIEZvciBleGFtcGxlLCBmb3IgYW4gaW5pdGlhbCBzdGVwIHNpemUgb2YgMTAsIHRoZSBtZXRob2QgY2FuIGNoZWNrIGlmIGJpbiBzaXplcyBvZiAyICg9IDEwLzUpLCA1ICg9IDEwLzIpLCBvciAxICg9IDEwLyg1KjIpKSBtaWdodCBhbHNvIHNhdGlzZnkgdGhlIGdpdmVuIGNvbnN0cmFpbnRzLidcbiAgICB9LFxuICAgIG1heGJpbnM6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIG1pbmltdW06IDIsXG4gICAgICBkZXNjcmlwdGlvbjogJ01heGltdW0gbnVtYmVyIG9mIGJpbnMuJ1xuICAgIH1cbiAgfSxcbiAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRVUFOVElUQVRJVkVdKSAvLyBUT0RPOiBhZGQgTyBhZnRlciBmaW5pc2hpbmcgIzgxXG59O1xuIiwiZXhwb3J0IGludGVyZmFjZSBDZWxsQ29uZmlnIHtcbiAgZ3JpZENvbG9yPzogc3RyaW5nO1xuICBncmlkT3BhY2l0eT86IG51bWJlcjtcbiAgZ3JpZE9mZnNldD86IG51bWJlcjtcblxuICBmaWxsPzogc3RyaW5nO1xuICBmaWxsT3BhY2l0eT86IG51bWJlcjtcbiAgc3Ryb2tlPzogc3RyaW5nO1xuICBzdHJva2VXaWR0aD86IG51bWJlcjtcbiAgc3Ryb2tlT3BhY2l0eT8gOm51bWJlcjtcbiAgc3Ryb2tlRGFzaD86IG51bWJlcjtcbiAgc3Ryb2tlRGFzaE9mZnNldD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IGNlbGxDb25maWcgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZ3JpZENvbG9yOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnIzAwMDAwMCdcbiAgICB9LFxuICAgIGdyaWRPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxLFxuICAgICAgZGVmYXVsdDogMC40XG4gICAgfSxcbiAgICBncmlkT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICB9LFxuXG4gICAgLy8gR3JvdXAgcHJvcGVydGllc1xuICAgIGNsaXA6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICB9LFxuICAgIGZpbGw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICdyZ2JhKDAsMCwwLDApJ1xuICAgIH0sXG4gICAgZmlsbE9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgIH0sXG4gICAgc3Ryb2tlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgfSxcbiAgICBzdHJva2VXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgfSxcbiAgICBzdHJva2VPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgIH0sXG4gICAgc3Ryb2tlRGFzaDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgc3Ryb2tlRGFzaE9mZnNldDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgb2Zmc2V0IChpbiBwaXhlbHMpIGludG8gd2hpY2ggdG8gYmVnaW4gZHJhd2luZyB3aXRoIHRoZSBzdHJva2UgZGFzaCBhcnJheS4nXG4gICAgfVxuICB9XG59O1xuIiwiZXhwb3J0IGludGVyZmFjZSBNYXJrQ29uZmlnIHtcbiAgLy8gVmVnYS1MaXRlIFNwZWNpZmljXG4gIGZpbGxlZD86IGJvb2xlYW47XG4gIGNvbG9yPzogc3RyaW5nO1xuICBiYXJXaWR0aD86IG51bWJlcjtcbiAgdGlja1dpZHRoPzogbnVtYmVyO1xuICBzdGFja2VkPzogc3RyaW5nO1xuXG4gIC8vIEdlbmVyYWwgVmVnYVxuICBvcGFjaXR5PzogbnVtYmVyO1xuICBzdHJva2VXaWR0aD86IG51bWJlcjtcbiAgc3Ryb2tlRGFzaD86IG51bWJlcltdO1xuICBzdHJva2VEYXNoT2Zmc2V0PzogbnVtYmVyW107XG4gIGZpbGw/OiBzdHJpbmc7XG4gIGZpbGxPcGFjaXR5PzogbnVtYmVyO1xuICBzdHJva2U/OiBzdHJpbmc7XG4gIHN0cm9rZU9wYWNpdHk/OiBudW1iZXI7XG5cblxuICAvLyBCYXIsIFRpY2ssIExpbmUsIEFyZWFcbiAgb3JpZW50Pzogc3RyaW5nO1xuICAvLyBMaW5lIC8gYXJlYVxuICBpbnRlcnBvbGF0ZT86IHN0cmluZztcbiAgdGVuc2lvbj86IG51bWJlcjtcblxuICAvLyBQb2ludCAvIFNxdWFyZSAvIENpcmNsZVxuICBzaGFwZT86IHN0cmluZztcbiAgc2l6ZT86IG51bWJlcjtcblxuICAvLyBUaWNrLW9ubHlcbiAgdGhpY2tuZXNzPzogbnVtYmVyO1xuXG4gIC8vIFRleHQtb25seVxuICBhbGlnbj86IHN0cmluZztcbiAgYW5nbGU/OiBudW1iZXI7XG4gIGJhc2VsaW5lPzogc3RyaW5nO1xuICBkeD86IG51bWJlcjtcbiAgZHk/OiBudW1iZXI7XG4gIHJhZGl1cz86IG51bWJlcjtcbiAgdGhldGE/OiBudW1iZXI7XG4gIGZvbnQ/OiBzdHJpbmc7XG4gIGZvbnRTaXplPzogbnVtYmVyO1xuICBmb250U3R5bGU/OiBzdHJpbmc7XG4gIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XG4gIC8vIFZlZ2EtTGl0ZSBvbmx5IGZvciB0ZXh0IG9ubHlcbiAgZm9ybWF0Pzogc3RyaW5nO1xuICBzaG9ydFRpbWVMYWJlbHM/OiBib29sZWFuO1xuXG4gIGFwcGx5Q29sb3JUb0JhY2tncm91bmQ/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgbWFya0NvbmZpZyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvLyBWZWdhLUxpdGUgc3BlY2lhbFxuICAgIGZpbGxlZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRoZSBzaGFwZVxcJ3MgY29sb3Igc2hvdWxkIGJlIHVzZWQgYXMgZmlsbCBjb2xvciBpbnN0ZWFkIG9mIHN0cm9rZSBjb2xvci4gJyArXG4gICAgICAgICdUaGlzIGlzIG9ubHkgYXBwbGljYWJsZSBmb3IgXCJiYXJcIiwgXCJwb2ludFwiLCBhbmQgXCJhcmVhXCIuICcgK1xuICAgICAgICAnQWxsIG1hcmtzIGV4Y2VwdCBcInBvaW50XCIgbWFya3MgYXJlIGZpbGxlZCBieSBkZWZhdWx0LidcbiAgICB9LFxuICAgIGNvbG9yOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnIzQ2ODJiNCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0RlZmF1bHQgY29sb3IuJ1xuICAgIH0sXG4gICAgYmFyV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgd2lkdGggb2YgdGhlIGJhcnMuICBJZiB1bnNwZWNpZmllZCwgdGhlIGRlZmF1bHQgd2lkdGggaXMgIGBiYW5kV2lkdGgtMWAsIHdoaWNoIHByb3ZpZGVzIDEgcGl4ZWwgb2Zmc2V0IGJldHdlZW4gYmFycy4nXG4gICAgfSxcbiAgICB0aWNrV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHdpZHRoIG9mIHRoZSB0aWNrcy4nXG4gICAgfSxcbiAgICBzdGFja2VkOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnemVybycsICdjZW50ZXInLCAnbm9ybWFsaXplJywgJ25vbmUnXSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgICAgLy8gVE9ETygjNjIwKSByZWZlciB0byBWZWdhIHNwZWMgb25jZSBpdCBkb2Vzbid0IHRocm93IGVycm9yXG4gICAgICAvLyBlbnVtOiB2Z1N0YWNrU2NoZW1hLnByb3BlcnRpZXMub2Zmc2V0Lm9uZU9mWzBdLmVudW1cbiAgICB9LFxuICAgIC8vIEdlbmVyYWwgVmVnYVxuICAgIGZpbGw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgZmlsbE9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDFcbiAgICB9LFxuICAgIHN0cm9rZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBzdHJva2VPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxXG4gICAgfSxcbiAgICBvcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxXG4gICAgfSxcbiAgICBzdHJva2VXaWR0aDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgc3Ryb2tlRGFzaDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQW4gYXJyYXkgb2YgYWx0ZXJuYXRpbmcgc3Ryb2tlLCBzcGFjZSBsZW5ndGhzIGZvciBjcmVhdGluZyBkYXNoZWQgb3IgZG90dGVkIGxpbmVzLidcbiAgICB9LFxuICAgIHN0cm9rZURhc2hPZmZzZXQ6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvZmZzZXQgKGluIHBpeGVscykgaW50byB3aGljaCB0byBiZWdpbiBkcmF3aW5nIHdpdGggdGhlIHN0cm9rZSBkYXNoIGFycmF5LidcbiAgICB9LFxuXG4gICAgLy8gQmFyLCBUaWNrLCBMaW5lLCBBcmVhXG4gICAgb3JpZW50OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9yaWVudGF0aW9uIG9mIGEgbm9uLXN0YWNrZWQgYmFyLCB0aWNrLCBhcmVhLCBhbmQgbGluZSBjaGFydHMuJyArXG4gICAgICAgJ1RoZSB2YWx1ZSBpcyBlaXRoZXIgaG9yaXpvbnRhbCAoZGVmYXVsdCkgb3IgdmVydGljYWwuJyArXG4gICAgICAgJ0ZvciBiYXIgYW5kIHRpY2ssIHRoaXMgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzaXplIG9mIHRoZSBiYXIgYW5kIHRpY2sgc2hvdWxkIGJlIGFwcGxpZWQgdG8geCBvciB5IGRpbWVuc2lvbi4nICtcbiAgICAgICAnRm9yIGFyZWEsIHRoaXMgcHJvcGVydHkgZGV0ZXJtaW5lcyB0aGUgb3JpZW50IHByb3BlcnR5IG9mIHRoZSBWZWdhIG91dHB1dC4nICtcbiAgICAgICAnRm9yIGxpbmUsIHRoaXMgcHJvcGVydHkgZGV0ZXJtaW5lcyB0aGUgc29ydCBvcmRlciBvZiB0aGUgcG9pbnRzIGluIHRoZSBsaW5lIGlmIGBjb25maWcuc29ydExpbmVCeWAgaXMgbm90IHNwZWNpZmllZC4nICtcbiAgICAgICAnRm9yIHN0YWNrZWQgY2hhcnRzLCB0aGlzIGlzIGFsd2F5cyBkZXRlcm1pbmVkIGJ5IHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc3RhY2s7ICcgK1xuICAgICAgICd0aGVyZWZvcmUgZXhwbGljaXRseSBzcGVjaWZpZWQgdmFsdWUgd2lsbCBiZSBpZ25vcmVkLidcbiAgICB9LFxuXG4gICAgLy8gbGluZSAvIGFyZWFcbiAgICBpbnRlcnBvbGF0ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAvLyBUT0RPIGJldHRlciBkZXNjcmliZSB0aGF0IHNvbWUgb2YgdGhlbSBpc24ndCBzdXBwb3J0ZWQgaW4gYXJlYVxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgbGluZSBpbnRlcnBvbGF0aW9uIG1ldGhvZCB0byB1c2UuIE9uZSBvZiBsaW5lYXIsIHN0ZXAtYmVmb3JlLCBzdGVwLWFmdGVyLCBiYXNpcywgYmFzaXMtb3BlbiwgYmFzaXMtY2xvc2VkLCBidW5kbGUsIGNhcmRpbmFsLCBjYXJkaW5hbC1vcGVuLCBjYXJkaW5hbC1jbG9zZWQsIG1vbm90b25lLidcbiAgICB9LFxuICAgIHRlbnNpb246IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdEZXBlbmRpbmcgb24gdGhlIGludGVycG9sYXRpb24gdHlwZSwgc2V0cyB0aGUgdGVuc2lvbiBwYXJhbWV0ZXIuJ1xuICAgIH0sXG5cbiAgICAvLyBwb2ludFxuICAgIHNoYXBlOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGVudW06IFsnY2lyY2xlJywgJ3NxdWFyZScsICdjcm9zcycsICdkaWFtb25kJywgJ3RyaWFuZ2xlLXVwJywgJ3RyaWFuZ2xlLWRvd24nXSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHN5bWJvbCBzaGFwZSB0byB1c2UuIE9uZSBvZiBjaXJjbGUgKGRlZmF1bHQpLCBzcXVhcmUsIGNyb3NzLCBkaWFtb25kLCB0cmlhbmdsZS11cCwgb3IgdHJpYW5nbGUtZG93bi4nXG4gICAgfSxcbiAgICAvLyBwb2ludCAvIGNpcmNsZSAvIHNxdWFyZVxuICAgIHNpemU6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMzAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBwaXhlbCBhcmVhIGVhY2ggdGhlIHBvaW50LiBGb3IgZXhhbXBsZTogaW4gdGhlIGNhc2Ugb2YgY2lyY2xlcywgdGhlIHJhZGl1cyBpcyBkZXRlcm1pbmVkIGluIHBhcnQgYnkgdGhlIHNxdWFyZSByb290IG9mIHRoZSBzaXplIHZhbHVlLidcbiAgICB9LFxuXG4gICAgLy8gVGljay1vbmx5XG4gICAgdGhpY2tuZXNzOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaWNrbmVzcyBvZiB0aGUgdGljayBtYXJrLidcbiAgICB9LFxuXG4gICAgLy8gdGV4dC1vbmx5XG4gICAgYWxpZ246IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZW51bTogWydsZWZ0JywgJ3JpZ2h0JywgJ2NlbnRlciddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgaG9yaXpvbnRhbCBhbGlnbm1lbnQgb2YgdGhlIHRleHQuIE9uZSBvZiBsZWZ0LCByaWdodCwgY2VudGVyLidcbiAgICB9LFxuICAgIGFuZ2xlOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHJvdGF0aW9uIGFuZ2xlIG9mIHRoZSB0ZXh0LCBpbiBkZWdyZWVzLidcbiAgICB9LFxuICAgIGJhc2VsaW5lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdtaWRkbGUnLFxuICAgICAgZW51bTogWyd0b3AnLCAnbWlkZGxlJywgJ2JvdHRvbSddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgdmVydGljYWwgYWxpZ25tZW50IG9mIHRoZSB0ZXh0LiBPbmUgb2YgdG9wLCBtaWRkbGUsIGJvdHRvbS4nXG4gICAgfSxcbiAgICBkeDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBob3Jpem9udGFsIG9mZnNldCwgaW4gcGl4ZWxzLCBiZXR3ZWVuIHRoZSB0ZXh0IGxhYmVsIGFuZCBpdHMgYW5jaG9yIHBvaW50LiBUaGUgb2Zmc2V0IGlzIGFwcGxpZWQgYWZ0ZXIgcm90YXRpb24gYnkgdGhlIGFuZ2xlIHByb3BlcnR5LidcbiAgICB9LFxuICAgIGR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHZlcnRpY2FsIG9mZnNldCwgaW4gcGl4ZWxzLCBiZXR3ZWVuIHRoZSB0ZXh0IGxhYmVsIGFuZCBpdHMgYW5jaG9yIHBvaW50LiBUaGUgb2Zmc2V0IGlzIGFwcGxpZWQgYWZ0ZXIgcm90YXRpb24gYnkgdGhlIGFuZ2xlIHByb3BlcnR5LidcbiAgICB9LFxuICAgIGZvbnQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgcm9sZTogJ2ZvbnQnLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgdHlwZWZhY2UgdG8gc2V0IHRoZSB0ZXh0IGluIChlLmcuLCBIZWx2ZXRpY2EgTmV1ZSkuJ1xuICAgIH0sXG4gICAgZm9udFNpemU6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMTAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb250IHNpemUsIGluIHBpeGVscy4nXG4gICAgfSxcbiAgICAvLyBmb250U2l6ZSBleGNsdWRlZCBhcyB3ZSB1c2Ugc2l6ZS52YWx1ZVxuICAgIGZvbnRTdHlsZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBlbnVtOiBbJ25vcm1hbCcsICdpdGFsaWMnXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvbnQgc3R5bGUgKGUuZy4sIGl0YWxpYykuJ1xuICAgIH0sXG4gICAgZm9udFdlaWdodDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ25vcm1hbCcsICdib2xkJ10sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb250IHdlaWdodCAoZS5nLiwgYm9sZCkuJ1xuICAgIH0sXG4gICAgcmFkaXVzOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUG9sYXIgY29vcmRpbmF0ZSByYWRpYWwgb2Zmc2V0LCBpbiBwaXhlbHMsIG9mIHRoZSB0ZXh0IGxhYmVsIGZyb20gdGhlIG9yaWdpbiBkZXRlcm1pbmVkIGJ5IHRoZSB4IGFuZCB5IHByb3BlcnRpZXMuJ1xuICAgIH0sXG4gICAgdGhldGE6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdQb2xhciBjb29yZGluYXRlIGFuZ2xlLCBpbiByYWRpYW5zLCBvZiB0aGUgdGV4dCBsYWJlbCBmcm9tIHRoZSBvcmlnaW4gZGV0ZXJtaW5lZCBieSB0aGUgeCBhbmQgeSBwcm9wZXJ0aWVzLiBWYWx1ZXMgZm9yIHRoZXRhIGZvbGxvdyB0aGUgc2FtZSBjb252ZW50aW9uIG9mIGFyYyBtYXJrIHN0YXJ0QW5nbGUgYW5kIGVuZEFuZ2xlIHByb3BlcnRpZXM6IGFuZ2xlcyBhcmUgbWVhc3VyZWQgaW4gcmFkaWFucywgd2l0aCAwIGluZGljYXRpbmcgXCJub3J0aFwiLidcbiAgICB9LFxuICAgIC8vIHRleHQtb25seSAmIFZMIG9ubHlcbiAgICBmb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9ybWF0dGluZyBwYXR0ZXJuIGZvciB0ZXh0IHZhbHVlLiBJZiBub3QgZGVmaW5lZCwgdGhpcyB3aWxsIGJlIGRldGVybWluZWQgYXV0b21hdGljYWxseS4gJ1xuICAgIH0sXG4gICAgc2hvcnRUaW1lTGFiZWxzOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciBtb250aCBuYW1lcyBhbmQgd2Vla2RheSBuYW1lcyBzaG91bGQgYmUgYWJicmV2aWF0ZWQuJ1xuICAgIH0sXG4gICAgYXBwbHlDb2xvclRvQmFja2dyb3VuZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FwcGx5IGNvbG9yIGZpZWxkIHRvIGJhY2tncm91bmQgY29sb3IgaW5zdGVhZCBvZiB0aGUgdGV4dC4nXG4gICAgfVxuICB9XG59O1xuIiwiZXhwb3J0IGludGVyZmFjZSBTY2VuZUNvbmZpZyB7XG4gIGZpbGw/OiBzdHJpbmc7XG4gIGZpbGxPcGFjaXR5PzogbnVtYmVyO1xuICBzdHJva2U/OiBzdHJpbmc7XG4gIHN0cm9rZVdpZHRoPzogbnVtYmVyO1xuICBzdHJva2VPcGFjaXR5PyA6bnVtYmVyO1xuICBzdHJva2VEYXNoPzogbnVtYmVyO1xuICBzdHJva2VEYXNoT2Zmc2V0PzogbnVtYmVyO1xufVxuXG5leHBvcnQgY29uc3Qgc2NlbmVDb25maWcgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZmlsbDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InXG4gICAgfSxcbiAgICBmaWxsT3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgfSxcbiAgICBzdHJva2U6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICB9LFxuICAgIHN0cm9rZVdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICB9LFxuICAgIHN0cm9rZU9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgfSxcbiAgICBzdHJva2VEYXNoOiB7XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgfSxcbiAgICBzdHJva2VEYXNoT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvZmZzZXQgKGluIHBpeGVscykgaW50byB3aGljaCB0byBiZWdpbiBkcmF3aW5nIHdpdGggdGhlIHN0cm9rZSBkYXNoIGFycmF5LidcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQge1VuaXRDb25maWcsIHVuaXRDb25maWd9IGZyb20gJy4vY29uZmlnLnVuaXQuc2NoZW1hJztcbmltcG9ydCB7Q2VsbENvbmZpZywgY2VsbENvbmZpZ30gZnJvbSAnLi9jb25maWcuY2VsbC5zY2hlbWEnO1xuaW1wb3J0IHtNYXJrQ29uZmlnLCBtYXJrQ29uZmlnfSBmcm9tICcuL2NvbmZpZy5tYXJrcy5zY2hlbWEnO1xuaW1wb3J0IHtTY2VuZUNvbmZpZywgc2NlbmVDb25maWd9IGZyb20gJy4vY29uZmlnLnNjZW5lLnNjaGVtYSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgLy8gVE9ETzogYWRkIHRoaXMgYmFjayBvbmNlIHdlIGhhdmUgdG9wLWRvd24gbGF5b3V0IGFwcHJvYWNoXG4gIC8vIHdpZHRoPzogbnVtYmVyO1xuICAvLyBoZWlnaHQ/OiBudW1iZXI7XG4gIC8vIHBhZGRpbmc/OiBudW1iZXJ8c3RyaW5nO1xuICB2aWV3cG9ydD86IG51bWJlcjtcbiAgYmFja2dyb3VuZD86IHN0cmluZztcblxuICBudW1iZXJGb3JtYXQ/OiBzdHJpbmc7XG4gIHRpbWVGb3JtYXQ/OiBzdHJpbmc7XG5cbiAgdW5pdD86IFVuaXRDb25maWc7XG4gIGNlbGw/OiBDZWxsQ29uZmlnO1xuICBtYXJrPzogTWFya0NvbmZpZztcbiAgc2NlbmU/OiBTY2VuZUNvbmZpZztcbn1cblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvLyB0ZW1wbGF0ZVxuICAgIC8vIFRPRE86IGFkZCB0aGlzIGJhY2sgb25jZSB3ZSBoYXZlIHRvcC1kb3duIGxheW91dCBhcHByb2FjaFxuICAgIC8vIHdpZHRoOiB7XG4gICAgLy8gICB0eXBlOiAnaW50ZWdlcicsXG4gICAgLy8gICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICAvLyB9LFxuICAgIC8vIGhlaWdodDoge1xuICAgIC8vICAgdHlwZTogJ2ludGVnZXInLFxuICAgIC8vICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgLy8gfSxcbiAgICAvLyBwYWRkaW5nOiB7XG4gICAgLy8gICB0eXBlOiBbJ251bWJlcicsICdzdHJpbmcnXSxcbiAgICAvLyAgIGRlZmF1bHQ6ICdhdXRvJ1xuICAgIC8vIH0sXG4gICAgdmlld3BvcnQ6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBvbi1zY3JlZW4gdmlld3BvcnQsIGluIHBpeGVscy4gSWYgbmVjZXNzYXJ5LCBjbGlwcGluZyBhbmQgc2Nyb2xsaW5nIHdpbGwgYmUgYXBwbGllZC4nXG4gICAgfSxcbiAgICBiYWNrZ3JvdW5kOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NTUyBjb2xvciBwcm9wZXJ0eSB0byB1c2UgYXMgYmFja2dyb3VuZCBvZiB2aXN1YWxpemF0aW9uLiBEZWZhdWx0IGlzIGBcInRyYW5zcGFyZW50XCJgLidcbiAgICB9LFxuXG4gICAgLy8gZm9ybWF0c1xuICAgIG51bWJlckZvcm1hdDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAncycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0QzIE51bWJlciBmb3JtYXQgZm9yIGF4aXMgbGFiZWxzIGFuZCB0ZXh0IHRhYmxlcy4gRm9yIGV4YW1wbGUgXCJzXCIgZm9yIFNJIHVuaXRzLidcbiAgICB9LFxuICAgIHRpbWVGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJyVZLSVtLSVkJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVmYXVsdCBkYXRldGltZSBmb3JtYXQgZm9yIGF4aXMgYW5kIGxlZ2VuZCBsYWJlbHMuIFRoZSBmb3JtYXQgY2FuIGJlIHNldCBkaXJlY3RseSBvbiBlYWNoIGF4aXMgYW5kIGxlZ2VuZC4nXG4gICAgfSxcblxuICAgIC8vIG5lc3RlZFxuICAgIHVuaXQ6IHVuaXRDb25maWcsXG4gICAgY2VsbDogY2VsbENvbmZpZyxcbiAgICBtYXJrOiBtYXJrQ29uZmlnLFxuICAgIHNjZW5lOiBzY2VuZUNvbmZpZ1xuICB9XG59O1xuIiwiZXhwb3J0IGludGVyZmFjZSBVbml0Q29uZmlnIHtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IHVuaXRDb25maWcgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDIwMFxuICAgIH0sXG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDBcbiAgICB9XG4gIH1cbn07XG4iLCJleHBvcnQgaW50ZXJmYWNlIERhdGEge1xuICBmb3JtYXRUeXBlPzogc3RyaW5nO1xuICB1cmw/OiBzdHJpbmc7XG4gIHZhbHVlcz86IGFueVtdO1xufVxuXG5leHBvcnQgdmFyIGRhdGEgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gZGF0YSBzb3VyY2VcbiAgICBmb3JtYXRUeXBlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnanNvbicsICdjc3YnLCAndHN2J10sXG4gICAgICBkZWZhdWx0OiAnanNvbidcbiAgICB9LFxuICAgIHVybDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHZhbHVlczoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGFzcyBhcnJheSBvZiBvYmplY3RzIGluc3RlYWQgb2YgYSB1cmwgdG8gYSBmaWxlLicsXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQge0ZpZWxkRGVmLCBkZXRhaWxGaWVsZERlZnMsIGZhY2V0RmllbGREZWYsIG9yZGVyRmllbGREZWZzLCBwb3NpdGlvbkZpZWxkRGVmLCBzaGFwZUZpZWxkRGVmLCBzaXplRmllbGREZWYsIHRleHRGaWVsZERlZiwgY29sb3JGaWVsZERlZn0gZnJvbSAnLi9maWVsZGRlZi5zY2hlbWEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVuY29kaW5nIHtcbiAgeD86IEZpZWxkRGVmO1xuICB5PzogRmllbGREZWY7XG4gIHJvdz86IEZpZWxkRGVmO1xuICBjb2x1bW4/OiBGaWVsZERlZjtcbiAgY29sb3I/OiBGaWVsZERlZjtcbiAgc2l6ZT86IEZpZWxkRGVmO1xuICBzaGFwZT86IEZpZWxkRGVmO1xuICBkZXRhaWw/OiBGaWVsZERlZiB8IEZpZWxkRGVmW107XG4gIHRleHQ/OiBGaWVsZERlZjtcbiAgbGFiZWw/OiBGaWVsZERlZjtcblxuICBwYXRoPzogRmllbGREZWYgfCBGaWVsZERlZltdO1xuICBvcmRlcj86IEZpZWxkRGVmIHwgRmllbGREZWZbXTtcbn1cblxuZXhwb3J0IGNvbnN0IGVuY29kaW5nID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHg6IHBvc2l0aW9uRmllbGREZWYsXG4gICAgeTogcG9zaXRpb25GaWVsZERlZixcbiAgICByb3c6IGZhY2V0RmllbGREZWYsXG4gICAgY29sdW1uOiBmYWNldEZpZWxkRGVmLFxuICAgIHNpemU6IHNpemVGaWVsZERlZixcbiAgICBjb2xvcjogY29sb3JGaWVsZERlZixcbiAgICBzaGFwZTogc2hhcGVGaWVsZERlZixcbiAgICB0ZXh0OiB0ZXh0RmllbGREZWYsXG4gICAgZGV0YWlsOiBkZXRhaWxGaWVsZERlZnMsXG4gICAgbGFiZWw6IHRleHRGaWVsZERlZixcbiAgICBwYXRoOiBvcmRlckZpZWxkRGVmcyxcbiAgICBvcmRlcjogb3JkZXJGaWVsZERlZnNcbiAgfVxufTtcbiIsImltcG9ydCB7YXhpcywgQXhpc30gZnJvbSAnLi9heGlzLnNjaGVtYSc7XG5pbXBvcnQge2JpbiwgQmlufSBmcm9tICcuL2Jpbi5zY2hlbWEnO1xuaW1wb3J0IHtsZWdlbmQsIExlZ2VuZH0gZnJvbSAnLi9sZWdlbmQuc2NoZW1hJztcbmltcG9ydCB7dHlwaWNhbFNjYWxlLCBvcmRpbmFsT25seVNjYWxlLCBTY2FsZX0gZnJvbSAnLi9zY2FsZS5zY2hlbWEnO1xuaW1wb3J0IHtzb3J0LCBzb3J0RW51bSwgU29ydH0gZnJvbSAnLi9zb3J0LnNjaGVtYSc7XG5cbmltcG9ydCB7QUdHUkVHQVRFX09QU30gZnJvbSAnLi4vYWdncmVnYXRlJztcbmltcG9ydCB7dG9NYXAsIGR1cGxpY2F0ZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge21lcmdlRGVlcH0gZnJvbSAnLi9zY2hlbWF1dGlsJztcbmltcG9ydCB7VElNRVVOSVRTfSBmcm9tICcuLi90aW1ldW5pdCc7XG5pbXBvcnQge05PTUlOQUwsIE9SRElOQUwsIFFVQU5USVRBVElWRSwgVEVNUE9SQUwsIFR5cGV9IGZyb20gJy4uL3R5cGUnO1xuXG4vKipcbiAqICBJbnRlcmZhY2UgZm9yIGFueSBraW5kIG9mIEZpZWxkRGVmO1xuICogIEZvciBzaW1wbGljaXR5LCB3ZSBkbyBub3QgZGVjbGFyZSBtdWx0aXBsZSBpbnRlcmZhY2VzIG9mIEZpZWxkRGVmIGxpa2VcbiAqICB3ZSBkbyBmb3IgSlNPTiBzY2hlbWEuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGREZWYge1xuICBmaWVsZD86IHN0cmluZztcbiAgdHlwZT86IFR5cGU7XG4gIHZhbHVlPzogYW55O1xuXG4gIC8vIGZ1bmN0aW9uXG4gIHRpbWVVbml0Pzogc3RyaW5nO1xuICBiaW4/OiBib29sZWFuIHwgQmluO1xuXG4gIGFnZ3JlZ2F0ZT86IHN0cmluZztcbiAgc29ydD86IFNvcnQgfCBzdHJpbmc7XG5cbiAgLy8gb3ZlcnJpZGUgdmVnYSBjb21wb25lbnRzXG4gIGF4aXM/OiBBeGlzIHwgYm9vbGVhbjtcbiAgbGVnZW5kPzogTGVnZW5kIHwgYm9vbGVhbjtcbiAgc2NhbGU/OiBTY2FsZTtcblxuICAvLyBUT0RPOiBtYXliZSBleHRlbmQgdGhpcyBpbiBvdGhlciBhcHA/XG4gIC8vIHVudXNlZCBtZXRhZGF0YSAtLSBmb3Igb3RoZXIgYXBwbGljYXRpb25cbiAgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBhZ2dyZWdhdGUgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBBR0dSRUdBVEVfT1BTLFxuICBzdXBwb3J0ZWRFbnVtczoge1xuICAgIHF1YW50aXRhdGl2ZTogQUdHUkVHQVRFX09QUyxcbiAgICBvcmRpbmFsOiBbJ21lZGlhbicsJ21pbicsJ21heCddLFxuICAgIG5vbWluYWw6IFtdLFxuICAgIHRlbXBvcmFsOiBbJ21lYW4nLCAnbWVkaWFuJywgJ21pbicsICdtYXgnXSwgLy8gVE9ETzogcmV2aXNlIHdoYXQgc2hvdWxkIHRpbWUgc3VwcG9ydFxuICAgICcnOiBbJ2NvdW50J11cbiAgfSxcbiAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRVUFOVElUQVRJVkUsIE5PTUlOQUwsIE9SRElOQUwsIFRFTVBPUkFMLCAnJ10pXG59O1xuXG5jb25zdCBmaWVsZERlZiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBmaWVsZDoge1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICB9LFxuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiBbJ3N0cmluZycsICdudW1iZXInXVxuICAgIH0sXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbTk9NSU5BTCwgT1JESU5BTCwgUVVBTlRJVEFUSVZFLCBURU1QT1JBTF1cbiAgICB9LFxuICAgIGJpbjogYmluLFxuICAgIHRpbWVVbml0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFRJTUVVTklUUyxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbVEVNUE9SQUxdKVxuICAgIH0sXG4gICAgYWdncmVnYXRlOiBhZ2dyZWdhdGUsXG4gIH1cbn07XG5cbmNvbnN0IGZpZWxkRGVmV2l0aFNjYWxlID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShmaWVsZERlZiksIHtcbiAgcHJvcGVydGllczoge1xuICAgIHNjYWxlOiB0eXBpY2FsU2NhbGUsXG4gICAgc29ydDogc29ydFxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHBvc2l0aW9uRmllbGREZWYgPSBtZXJnZURlZXAoZHVwbGljYXRlKGZpZWxkRGVmV2l0aFNjYWxlKSwge1xuICByZXF1aXJlZDogWydmaWVsZCcsICd0eXBlJ10sIC8vIFRPRE86IHJlbW92ZSBpZiBwb3NzaWJsZVxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc2NhbGU6IHtcbiAgICAgIC8vIFRPRE86IHJlbW92ZVxuICAgICAgLy8gcmVwbGFjaW5nIGRlZmF1bHQgdmFsdWVzIGZvciBqdXN0IHRoZXNlIHR3byBheGVzXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBhZGRpbmc6IHtkZWZhdWx0OiAxfVxuICAgICAgfVxuICAgIH0sXG4gICAgYXhpczogYXhpc1xuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IGNvbG9yRmllbGREZWYgPSBtZXJnZURlZXAoZHVwbGljYXRlKGZpZWxkRGVmV2l0aFNjYWxlKSwge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGVnZW5kOiBsZWdlbmRcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBzaXplRmllbGREZWYgPSBjb2xvckZpZWxkRGVmO1xuXG4vLyBEZXRhaWxcblxuZXhwb3J0IGNvbnN0IGRldGFpbEZpZWxkRGVmcyA9IHtcbiAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICBvbmVPZjogW2R1cGxpY2F0ZShmaWVsZERlZiksIHtcbiAgICB0eXBlOiAnYXJyYXknLFxuICAgIGl0ZW1zOiBkdXBsaWNhdGUoZmllbGREZWYpXG4gIH1dXG59O1xuXG4vLyBPcmRlciBQYXRoIGhhdmUgbm8gc2NhbGVcblxuY29uc3Qgb3JkZXJGaWVsZERlZiA9IG1lcmdlRGVlcChkdXBsaWNhdGUoZmllbGREZWYpLCB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBzb3J0OiBzb3J0RW51bVxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IG9yZGVyRmllbGREZWZzID0ge1xuICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gIG9uZU9mOiBbZHVwbGljYXRlKG9yZGVyRmllbGREZWYpLCB7XG4gICAgdHlwZTogJ2FycmF5JyxcbiAgICBpdGVtczogZHVwbGljYXRlKG9yZGVyRmllbGREZWYpXG4gIH1dXG59O1xuXG4vLyBUZXh0IGhhcyBkZWZhdWx0IHZhbHVlID0gYEFiY2BcblxuZXhwb3J0IGNvbnN0IHRleHRGaWVsZERlZiA9IG1lcmdlRGVlcChkdXBsaWNhdGUoZmllbGREZWYpLCB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnQWJjJ1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIFNoYXBlIC8gUm93IC8gQ29sdW1uIG9ubHkgc3VwcG9ydHMgb3JkaW5hbCBzY2FsZVxuXG5jb25zdCBmaWVsZERlZldpdGhPcmRpbmFsU2NhbGUgPSBtZXJnZURlZXAoZHVwbGljYXRlKGZpZWxkRGVmKSwge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgc2NhbGU6IG9yZGluYWxPbmx5U2NhbGUsXG4gICAgc29ydDogc29ydFxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHNoYXBlRmllbGREZWYgPSAgbWVyZ2VEZWVwKGR1cGxpY2F0ZShmaWVsZERlZldpdGhPcmRpbmFsU2NhbGUpLCB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBsZWdlbmQ6IGxlZ2VuZFxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IGZhY2V0RmllbGREZWYgPSBtZXJnZURlZXAoZHVwbGljYXRlKGZpZWxkRGVmV2l0aE9yZGluYWxTY2FsZSksIHtcbiAgcmVxdWlyZWQ6IFsnZmllbGQnLCAndHlwZSddLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYXhpczogYXhpc1xuICB9XG59KTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgTGVnZW5kIHtcbiAgb3JpZW50Pzogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgZm9ybWF0Pzogc3RyaW5nO1xuICB2YWx1ZXM/OiBBcnJheTxhbnk+O1xuICBwcm9wZXJ0aWVzPzogYW55OyAvLyBUT0RPIGRlY2xhcmUgVmdMZWdlbmRQcm9wZXJ0aWVzXG5cbiAgLy8gVmVnYS1MaXRlIG9ubHlcbiAgc2hvcnRUaW1lTGFiZWxzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IHZhciBsZWdlbmQgPSB7XG4gIGRlZmF1bHQ6IHRydWUsXG4gIGRlc2NyaXB0aW9uOiAnUHJvcGVydGllcyBvZiBhIGxlZ2VuZCBvciBib29sZWFuIGZsYWcgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgdG8gc2hvdyBpdC4nLFxuICBvbmVPZjogW3tcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBvcmllbnQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgb3JpZW50YXRpb24gb2YgdGhlIGxlZ2VuZC4gT25lIG9mIFwibGVmdFwiIG9yIFwicmlnaHRcIi4gVGhpcyBkZXRlcm1pbmVzIGhvdyB0aGUgbGVnZW5kIGlzIHBvc2l0aW9uZWQgd2l0aGluIHRoZSBzY2VuZS4gVGhlIGRlZmF1bHQgaXMgXCJyaWdodFwiLidcbiAgICAgIH0sXG4gICAgICB0aXRsZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgZm9yIHRoZSBsZWdlbmQuIChTaG93cyBmaWVsZCBuYW1lIGFuZCBpdHMgZnVuY3Rpb24gYnkgZGVmYXVsdC4pJ1xuICAgICAgfSxcbiAgICAgIGZvcm1hdDoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0FuIG9wdGlvbmFsIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgbGVnZW5kIGxhYmVscy4gVmVnYSB1c2VzIEQzXFwncyBmb3JtYXQgcGF0dGVybi4nXG4gICAgICB9LFxuICAgICAgdmFsdWVzOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFeHBsaWNpdGx5IHNldCB0aGUgdmlzaWJsZSBsZWdlbmQgdmFsdWVzLidcbiAgICAgIH0sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnT3B0aW9uYWwgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9ucyBmb3IgY3VzdG9tIGxlZ2VuZCBzdHlsaW5nLiAnXG4gICAgICB9LFxuXG4gICAgICAvKiBWZWdhLWxpdGUgb25seSAqL1xuICAgICAgc2hvcnRUaW1lTGFiZWxzOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciBtb250aCBuYW1lcyBhbmQgd2Vla2RheSBuYW1lcyBzaG91bGQgYmUgYWJicmV2aWF0ZWQuJ1xuICAgICAgfVxuICAgIH0sXG4gIH0sIHtcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgfV1cbn07XG4iLCJleHBvcnQgdmFyIG1hcmsgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBbJ3BvaW50JywgJ3RpY2snLCAnYmFyJywgJ2xpbmUnLCAnYXJlYScsICdjaXJjbGUnLCAnc3F1YXJlJywgJ3RleHQnXVxufTtcbiIsImltcG9ydCB7dG9NYXAsIGR1cGxpY2F0ZSBhcyBjbG9uZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge21lcmdlRGVlcH0gZnJvbSAnLi9zY2hlbWF1dGlsJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NhbGUge1xuICB0eXBlPzogc3RyaW5nO1xuICBkb21haW4/OiBhbnk7IC8vIFRPRE86IGRlY2xhcmUgdmdEYXRhRG9tYWluXG4gIHJhbmdlPzogYW55OyAvLyBUT0RPOiBkZWNsYXJlIHZnUmFuZ2VEb21haW5cbiAgcm91bmQ/OiBib29sZWFuO1xuXG4gIC8vIG9yZGluYWxcbiAgYmFuZFdpZHRoPzogbnVtYmVyO1xuICBvdXRlclBhZGRpbmc/OiBudW1iZXI7XG4gIHBhZGRpbmc/OiBudW1iZXI7XG5cbiAgLy8gdHlwaWNhbFxuICBjbGFtcD86IGJvb2xlYW47XG4gIG5pY2U/OiBib29sZWFufHN0cmluZztcbiAgZXhwb25lbnQ/OiBudW1iZXI7XG4gIHplcm8/OiBib29sZWFuO1xuXG4gIC8vIFZlZ2EtTGl0ZSBvbmx5XG4gIHVzZVJhd0RvbWFpbj86IGJvb2xlYW47XG59XG5cbnZhciBzY2FsZSA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIC8vIFRPRE86IHJlZmVyIHRvIFZlZ2EncyBzY2FsZSBzY2hlbWFcbiAgcHJvcGVydGllczoge1xuICAgIC8qIENvbW1vbiBTY2FsZSBQcm9wZXJ0aWVzICovXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2xpbmVhcicsICdsb2cnLCAncG93JywgJ3NxcnQnLCAncXVhbnRpbGUnLCAnb3JkaW5hbCddLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRVUFOVElUQVRJVkVdKVxuICAgIH0sXG4gICAgZG9tYWluOiB7XG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICB0eXBlOiBbJ2FycmF5JywgJ29iamVjdCddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZG9tYWluIG9mIHRoZSBzY2FsZSwgcmVwcmVzZW50aW5nIHRoZSBzZXQgb2YgZGF0YSB2YWx1ZXMuIEZvciBxdWFudGl0YXRpdmUgZGF0YSwgdGhpcyBjYW4gdGFrZSB0aGUgZm9ybSBvZiBhIHR3by1lbGVtZW50IGFycmF5IHdpdGggbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMuIEZvciBvcmRpbmFsL2NhdGVnb3JpY2FsIGRhdGEsIHRoaXMgbWF5IGJlIGFuIGFycmF5IG9mIHZhbGlkIGlucHV0IHZhbHVlcy4gVGhlIGRvbWFpbiBtYXkgYWxzbyBiZSBzcGVjaWZpZWQgYnkgYSByZWZlcmVuY2UgdG8gYSBkYXRhIHNvdXJjZS4nXG4gICAgfSxcbiAgICByYW5nZToge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgdHlwZTogWydhcnJheScsICdvYmplY3QnLCAnc3RyaW5nJ10sXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSByYW5nZSBvZiB0aGUgc2NhbGUsIHJlcHJlc2VudGluZyB0aGUgc2V0IG9mIHZpc3VhbCB2YWx1ZXMuIEZvciBudW1lcmljIHZhbHVlcywgdGhlIHJhbmdlIGNhbiB0YWtlIHRoZSBmb3JtIG9mIGEgdHdvLWVsZW1lbnQgYXJyYXkgd2l0aCBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlcy4gRm9yIG9yZGluYWwgb3IgcXVhbnRpemVkIGRhdGEsIHRoZSByYW5nZSBtYXkgYnkgYW4gYXJyYXkgb2YgZGVzaXJlZCBvdXRwdXQgdmFsdWVzLCB3aGljaCBhcmUgbWFwcGVkIHRvIGVsZW1lbnRzIGluIHRoZSBzcGVjaWZpZWQgZG9tYWluLiBGb3Igb3JkaW5hbCBzY2FsZXMgb25seSwgdGhlIHJhbmdlIGNhbiBiZSBkZWZpbmVkIHVzaW5nIGEgRGF0YVJlZjogdGhlIHJhbmdlIHZhbHVlcyBhcmUgdGhlbiBkcmF3biBkeW5hbWljYWxseSBmcm9tIGEgYmFja2luZyBkYXRhIHNldC4nXG4gICAgfSxcbiAgICByb3VuZDoge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAvLyBUT0RPOiByZXZpc2UgZGVmYXVsdFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdJZiB0cnVlLCByb3VuZHMgbnVtZXJpYyBvdXRwdXQgdmFsdWVzIHRvIGludGVnZXJzLiBUaGlzIGNhbiBiZSBoZWxwZnVsIGZvciBzbmFwcGluZyB0byB0aGUgcGl4ZWwgZ3JpZC4nXG4gICAgfVxuICB9XG59O1xuXG5cbnZhciBvcmRpbmFsU2NhbGVNaXhpbiA9IHtcbiAgcHJvcGVydGllczoge1xuICAgIGJhbmRXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgLyogT3JkaW5hbCBTY2FsZSBQcm9wZXJ0aWVzICovXG4gICAgb3V0ZXJQYWRkaW5nOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgICAgLy8gVE9ETzogYWRkIGRlc2NyaXB0aW9uIG9uY2UgaXQgaXMgZG9jdW1lbnRlZCBpbiBWZWdhXG4gICAgfSxcbiAgICBwYWRkaW5nOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXBwbGllcyBzcGFjaW5nIGFtb25nIG9yZGluYWwgZWxlbWVudHMgaW4gdGhlIHNjYWxlIHJhbmdlLiBUaGUgYWN0dWFsIGVmZmVjdCBkZXBlbmRzIG9uIGhvdyB0aGUgc2NhbGUgaXMgY29uZmlndXJlZC4gSWYgdGhlIF9fcG9pbnRzX18gcGFyYW1ldGVyIGlzIGB0cnVlYCwgdGhlIHBhZGRpbmcgdmFsdWUgaXMgaW50ZXJwcmV0ZWQgYXMgYSBtdWx0aXBsZSBvZiB0aGUgc3BhY2luZyBiZXR3ZWVuIHBvaW50cy4gQSByZWFzb25hYmxlIHZhbHVlIGlzIDEuMCwgc3VjaCB0aGF0IHRoZSBmaXJzdCBhbmQgbGFzdCBwb2ludCB3aWxsIGJlIG9mZnNldCBmcm9tIHRoZSBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlIGJ5IGhhbGYgdGhlIGRpc3RhbmNlIGJldHdlZW4gcG9pbnRzLiBPdGhlcndpc2UsIHBhZGRpbmcgaXMgdHlwaWNhbGx5IGluIHRoZSByYW5nZSBbMCwgMV0gYW5kIGNvcnJlc3BvbmRzIHRvIHRoZSBmcmFjdGlvbiBvZiBzcGFjZSBpbiB0aGUgcmFuZ2UgaW50ZXJ2YWwgdG8gYWxsb2NhdGUgdG8gcGFkZGluZy4gQSB2YWx1ZSBvZiAwLjUgbWVhbnMgdGhhdCB0aGUgcmFuZ2UgYmFuZCB3aWR0aCB3aWxsIGJlIGVxdWFsIHRvIHRoZSBwYWRkaW5nIHdpZHRoLiBGb3IgbW9yZSwgc2VlIHRoZSBbRDMgb3JkaW5hbCBzY2FsZSBkb2N1bWVudGF0aW9uXShodHRwczovL2dpdGh1Yi5jb20vbWJvc3RvY2svZDMvd2lraS9PcmRpbmFsLVNjYWxlcykuJ1xuICAgIH1cbiAgfVxufTtcblxudmFyIHR5cGljYWxTY2FsZU1peGluID0ge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgLyogUXVhbnRpdGF0aXZlIGFuZCB0ZW1wb3JhbCBTY2FsZSBQcm9wZXJ0aWVzICovXG4gICAgY2xhbXA6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHRydWUsIHZhbHVlcyB0aGF0IGV4Y2VlZCB0aGUgZGF0YSBkb21haW4gYXJlIGNsYW1wZWQgdG8gZWl0aGVyIHRoZSBtaW5pbXVtIG9yIG1heGltdW0gcmFuZ2UgdmFsdWUnXG4gICAgfSxcbiAgICBuaWNlOiB7XG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBvbmVPZjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgdHJ1ZSwgbW9kaWZpZXMgdGhlIHNjYWxlIGRvbWFpbiB0byB1c2UgYSBtb3JlIGh1bWFuLWZyaWVuZGx5IG51bWJlciByYW5nZSAoZS5nLiwgNyBpbnN0ZWFkIG9mIDYuOTYpLidcbiAgICAgICAgfSx7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydzZWNvbmQnLCAnbWludXRlJywgJ2hvdXInLCAnZGF5JywgJ3dlZWsnLCAnbW9udGgnLCAneWVhciddLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgc3BlY2lmaWVkLCBtb2RpZmllcyB0aGUgc2NhbGUgZG9tYWluIHRvIHVzZSBhIG1vcmUgaHVtYW4tZnJpZW5kbHkgdmFsdWUgcmFuZ2UuIEZvciB0aW1lIGFuZCB1dGMgc2NhbGUgdHlwZXMgb25seSwgdGhlIG5pY2UgdmFsdWUgc2hvdWxkIGJlIGEgc3RyaW5nIGluZGljYXRpbmcgdGhlIGRlc2lyZWQgdGltZSBpbnRlcnZhbDsgbGVnYWwgdmFsdWVzIGFyZSBcInNlY29uZFwiLCBcIm1pbnV0ZVwiLCBcImhvdXJcIiwgXCJkYXlcIiwgXCJ3ZWVrXCIsIFwibW9udGhcIiwgb3IgXCJ5ZWFyXCIuJ1xuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgLy8gRklYTUUgdGhpcyBwYXJ0IG1pZ2h0IGJyZWFrIHBvbGVzdGFyXG4gICAgICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRSwgVEVNUE9SQUxdKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnJ1xuICAgIH0sXG5cbiAgICAvKiBRdWFudGl0YXRpdmUgU2NhbGUgUHJvcGVydGllcyAqL1xuICAgIGV4cG9uZW50OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2V0cyB0aGUgZXhwb25lbnQgb2YgdGhlIHNjYWxlIHRyYW5zZm9ybWF0aW9uLiBGb3IgcG93IHNjYWxlIHR5cGVzIG9ubHksIG90aGVyd2lzZSBpZ25vcmVkLidcbiAgICB9LFxuICAgIHplcm86IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgdHJ1ZSwgZW5zdXJlcyB0aGF0IGEgemVybyBiYXNlbGluZSB2YWx1ZSBpcyBpbmNsdWRlZCBpbiB0aGUgc2NhbGUgZG9tYWluLiBUaGlzIG9wdGlvbiBpcyBpZ25vcmVkIGZvciBub24tcXVhbnRpdGF0aXZlIHNjYWxlcy4nLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRVUFOVElUQVRJVkUsIFRFTVBPUkFMXSlcbiAgICB9LFxuXG4gICAgLyogVmVnYS1saXRlIG9ubHkgUHJvcGVydGllcyAqL1xuICAgIHVzZVJhd0RvbWFpbjoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VzZXMgdGhlIHNvdXJjZSBkYXRhIHJhbmdlIGFzIHNjYWxlIGRvbWFpbiBpbnN0ZWFkIG9mICcgK1xuICAgICAgICAgICAgICAgICAgICdhZ2dyZWdhdGVkIGRhdGEgZm9yIGFnZ3JlZ2F0ZSBheGlzLiAnICtcbiAgICAgICAgICAgICAgICAgICAnVGhpcyBvcHRpb24gZG9lcyBub3Qgd29yayB3aXRoIHN1bSBvciBjb3VudCBhZ2dyZWdhdGUnICtcbiAgICAgICAgICAgICAgICAgICAnYXMgdGhleSBtaWdodCBoYXZlIGEgc3Vic3RhbnRpYWxseSBsYXJnZXIgc2NhbGUgcmFuZ2UuJ1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHZhciBvcmRpbmFsT25seVNjYWxlID0gbWVyZ2VEZWVwKGNsb25lKHNjYWxlKSwgb3JkaW5hbFNjYWxlTWl4aW4pO1xuZXhwb3J0IHZhciB0eXBpY2FsU2NhbGUgPSBtZXJnZURlZXAoY2xvbmUoc2NhbGUpLCBvcmRpbmFsU2NhbGVNaXhpbiwgdHlwaWNhbFNjYWxlTWl4aW4pO1xuIiwiLy8gUGFja2FnZSBvZiBkZWZpbmluZyBWZWdhLWxpdGUgU3BlY2lmaWNhdGlvbidzIGpzb24gc2NoZW1hXG5cbmltcG9ydCAqIGFzIHNjaGVtYVV0aWwgZnJvbSAnLi9zY2hlbWF1dGlsJztcbmltcG9ydCB7bWFya30gZnJvbSAnLi9tYXJrLnNjaGVtYSc7XG5pbXBvcnQge2NvbmZpZywgQ29uZmlnfSBmcm9tICcuL2NvbmZpZy5zY2hlbWEnO1xuaW1wb3J0IHtkYXRhLCBEYXRhfSBmcm9tICcuL2RhdGEuc2NoZW1hJztcbmltcG9ydCB7ZW5jb2RpbmcsIEVuY29kaW5nfSBmcm9tICcuL2VuY29kaW5nLnNjaGVtYSc7XG5pbXBvcnQge01hcmt9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHt0cmFuc2Zvcm0sIFRyYW5zZm9ybX0gZnJvbSAnLi90cmFuc2Zvcm0uc2NoZW1hJztcblxuZXhwb3J0IGludGVyZmFjZSBTcGVjIHtcbiAgbmFtZT86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIGRhdGE/OiBEYXRhO1xuICB0cmFuc2Zvcm0/OiBUcmFuc2Zvcm07XG4gIG1hcms/OiBNYXJrO1xuICBlbmNvZGluZz86IEVuY29kaW5nO1xuICBjb25maWc/OiBDb25maWc7XG59XG5cbi8vIFRPRE8gcmVtb3ZlIHRoaXNcbmV4cG9ydCB7YWdncmVnYXRlfSBmcm9tICcuL2ZpZWxkZGVmLnNjaGVtYSc7XG5cbmV4cG9ydCB2YXIgdXRpbCA9IHNjaGVtYVV0aWw7XG5cbi8qKiBAdHlwZSBPYmplY3QgU2NoZW1hIG9mIGEgdmVnYS1saXRlIHNwZWNpZmljYXRpb24gKi9cbmV4cG9ydCB2YXIgc2NoZW1hID0ge1xuICAkc2NoZW1hOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgZGVzY3JpcHRpb246ICdTY2hlbWEgZm9yIFZlZ2EtTGl0ZSBzcGVjaWZpY2F0aW9uJyxcbiAgdHlwZTogJ29iamVjdCcsXG4gIHJlcXVpcmVkOiBbJ21hcmsnLCAnZW5jb2RpbmcnXSxcbiAgcHJvcGVydGllczoge1xuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVzY3JpcHRpb246ICdBIG5hbWUgZm9yIHRoZSBzcGVjaWZpY2F0aW9uLiBUaGUgbmFtZSBpcyB1c2VkIHRvIGFubm90YXRlIG1hcmtzLCBzY2FsZSBuYW1lcywgYW5kIG1vcmUuJ1xuICAgIH0sXG4gICAgZGVzY3JpcHRpb246IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgfSxcbiAgICBkYXRhOiBkYXRhLFxuICAgIHRyYW5zZm9ybTogdHJhbnNmb3JtLFxuICAgIG1hcms6IG1hcmssXG4gICAgZW5jb2Rpbmc6IGVuY29kaW5nLFxuICAgIGNvbmZpZzogY29uZmlnXG4gIH1cbn07XG5cbi8qKiBJbnN0YW50aWF0ZSBhIHZlcmJvc2Ugdmwgc3BlYyBmcm9tIHRoZSBzY2hlbWEgKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnN0YW50aWF0ZSgpIHtcbiAgcmV0dXJuIHNjaGVtYVV0aWwuaW5zdGFudGlhdGUoc2NoZW1hKTtcbn07XG4iLCJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKGluc3RhbmNlLCBzY2hlbWEpIHtcbiAgcmV0dXJuIG1lcmdlRGVlcChpbnN0YW50aWF0ZShzY2hlbWEpLCBpbnN0YW5jZSk7XG59O1xuXG4vLyBpbnN0YW50aWF0ZSBhIHNjaGVtYVxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbnRpYXRlKHNjaGVtYSkge1xuICB2YXIgdmFsO1xuICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKCdkZWZhdWx0JyBpbiBzY2hlbWEpIHtcbiAgICB2YWwgPSBzY2hlbWEuZGVmYXVsdDtcbiAgICByZXR1cm4gdXRpbC5pc09iamVjdCh2YWwpID8gdXRpbC5kdXBsaWNhdGUodmFsKSA6IHZhbDtcbiAgfSBlbHNlIGlmIChzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB7fTtcbiAgICBmb3IgKHZhciBuYW1lIGluIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAoc2NoZW1hLnByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgdmFsID0gaW5zdGFudGlhdGUoc2NoZW1hLnByb3BlcnRpZXNbbmFtZV0pO1xuICAgICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpbnN0YW5jZVtuYW1lXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSBpZiAoc2NoZW1hLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG4vLyByZW1vdmUgYWxsIGRlZmF1bHRzIGZyb20gYW4gaW5zdGFuY2VcbmV4cG9ydCBmdW5jdGlvbiBzdWJ0cmFjdChpbnN0YW5jZSwgZGVmYXVsdHMpIHtcbiAgdmFyIGNoYW5nZXM6IGFueSA9IHt9O1xuICBmb3IgKHZhciBwcm9wIGluIGluc3RhbmNlKSB7XG4gICAgaWYgKGluc3RhbmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICB2YXIgZGVmID0gZGVmYXVsdHNbcHJvcF07XG4gICAgICB2YXIgaW5zID0gaW5zdGFuY2VbcHJvcF07XG4gICAgICAvLyBOb3RlOiBkb2VzIG5vdCBwcm9wZXJseSBzdWJ0cmFjdCBhcnJheXNcbiAgICAgIGlmICghZGVmYXVsdHMgfHwgZGVmICE9PSBpbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnMgPT09ICdvYmplY3QnICYmICF1dGlsLmlzQXJyYXkoaW5zKSAmJiBkZWYpIHtcbiAgICAgICAgICB2YXIgYyA9IHN1YnRyYWN0KGlucywgZGVmKTtcbiAgICAgICAgICBpZiAoIWlzRW1wdHkoYykpIHtcbiAgICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBjO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh1dGlsLmlzQXJyYXkoaW5zKSkge1xuICAgICAgICAgIGlmICh1dGlsLmlzQXJyYXkoZGVmKSkge1xuICAgICAgICAgICAgLy8gY2hlY2sgZWFjaCBpdGVtIGluIHRoZSBhcnJheVxuICAgICAgICAgICAgaWYgKGlucy5sZW5ndGggPT09IGRlZi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdmFyIGVxdWFsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5zW2ldICE9PSBkZWZbaV0pIHtcbiAgICAgICAgICAgICAgICAgIGVxdWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGVxdWFsKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7IC8vIGNvbnRpbnVlIHdpdGggbmV4dCBwcm9wZXJ0eVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBpbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hhbmdlc1twcm9wXSA9IGlucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY2hhbmdlcztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlZXAoZGVzdCwgLi4uc3JjOiBhbnlbXSkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNyYy5sZW5ndGg7IGkrKykge1xuICAgIGRlc3QgPSBkZWVwTWVyZ2VfKGRlc3QsIHNyY1tpXSk7XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59O1xuXG4vLyByZWN1cnNpdmVseSBtZXJnZXMgc3JjIGludG8gZGVzdFxuZnVuY3Rpb24gZGVlcE1lcmdlXyhkZXN0LCBzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgZm9yICh2YXIgcCBpbiBzcmMpIHtcbiAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzcmNbcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc3JjW3BdICE9PSAnb2JqZWN0JyB8fCBzcmNbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBzcmNbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdFtwXSAhPT0gJ29iamVjdCcgfHwgZGVzdFtwXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IG1lcmdlRGVlcChzcmNbcF0uY29uc3RydWN0b3IgPT09IEFycmF5ID8gW10gOiB7fSwgc3JjW3BdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2VEZWVwKGRlc3RbcF0sIHNyY1twXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXN0O1xufVxuIiwiaW1wb3J0IHtBR0dSRUdBVEVfT1BTfSBmcm9tICcuLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtPUkRJTkFMLCBRVUFOVElUQVRJVkV9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHt0b01hcH0gZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ydCB7XG4gIGZpZWxkOiBzdHJpbmc7XG4gIG9wOiBzdHJpbmc7XG4gIG9yZGVyPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3Qgc29ydEVudW0gPSB7XG4gIGRlZmF1bHQ6ICdhc2NlbmRpbmcnLFxuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogWydhc2NlbmRpbmcnLCAnZGVzY2VuZGluZycsICd1bnNvcnRlZCddXG59O1xuXG5leHBvcnQgdmFyIHNvcnQgPSB7XG4gIGRlZmF1bHQ6ICdhc2NlbmRpbmcnLFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRSwgT1JESU5BTF0pLFxuICBvbmVPZjogW1xuICAgIHNvcnRFbnVtLFxuICAgIHsgLy8gc29ydCBieSBhZ2dyZWdhdGlvbiBvZiBhbm90aGVyIGZpZWxkXG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHJlcXVpcmVkOiBbJ2ZpZWxkJywgJ29wJ10sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGZpZWxkOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgZmllbGQgbmFtZSB0byBhZ2dyZWdhdGUgb3Zlci4nXG4gICAgICAgIH0sXG4gICAgICAgIG9wOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogQUdHUkVHQVRFX09QUyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmaWVsZCBuYW1lIHRvIGFnZ3JlZ2F0ZSBvdmVyLidcbiAgICAgICAgfSxcbiAgICAgICAgb3JkZXI6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBbJ2FzY2VuZGluZycsICdkZXNjZW5kaW5nJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgXVxufTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgVHJhbnNmb3JtIHtcbiAgZmlsdGVyPzogc3RyaW5nO1xuICBmaWx0ZXJOdWxsPzogYm9vbGVhbjtcbiAgY2FsY3VsYXRlPzogVmdGb3JtdWxhW107XG59XG5cbi8vIFRPRE8gbW92ZSBhbGwgVmVnYSBpbnRlcmZhY2VzIHRvIG9uZSBjZW50cmFsIHBvc2l0aW9uXG5leHBvcnQgaW50ZXJmYWNlIFZnRm9ybXVsYSB7XG4gIGZpZWxkOiBzdHJpbmc7XG4gIGV4cHI6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybSA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBmaWx0ZXJOdWxsOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZpbHRlciBudWxsIHZhbHVlcyBmcm9tIHRoZSBkYXRhLiBJZiBzZXQgdG8gdHJ1ZSwgYWxsIHJvd3Mgd2l0aCBudWxsIHZhbHVlcyBhcmUgZmlsdGVyZWQuIElmIGZhbHNlLCBubyByb3dzIGFyZSBmaWx0ZXJlZC4gU2V0IHRoZSBwcm9wZXJ0eSB0byB1bmRlZmluZWQgdG8gZmlsdGVyIG9ubHkgcXVhbnRpdGF0aXZlIGFuZCB0ZW1wb3JhbCBmaWVsZHMuJ1xuICAgIH0sXG4gICAgZmlsdGVyOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBzdHJpbmcgY29udGFpbmluZyB0aGUgZmlsdGVyIFZlZ2EgZXhwcmVzc2lvbi4gVXNlIGBkYXR1bWAgdG8gcmVmZXIgdG8gdGhlIGN1cnJlbnQgZGF0YSBvYmplY3QuJ1xuICAgIH0sXG4gICAgY2FsY3VsYXRlOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdDYWxjdWxhdGUgbmV3IGZpZWxkKHMpIHVzaW5nIHRoZSBwcm92aWRlZCBleHByZXNzc2lvbihzKS4gQ2FsY3VsYXRpb24gYXJlIGFwcGxpZWQgYmVmb3JlIGZpbHRlci4nLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBmaWVsZDoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmaWVsZCBpbiB3aGljaCB0byBzdG9yZSB0aGUgY29tcHV0ZWQgZm9ybXVsYSB2YWx1ZS4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBleHByOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBzdHJpbmcgY29udGFpbmluZyBhbiBleHByZXNzaW9uIGZvciB0aGUgZm9ybXVsYS4gVXNlIHRoZSB2YXJpYWJsZSBgZGF0dW1gIHRvIHRvIHJlZmVyIHRvIHRoZSBjdXJyZW50IGRhdGEgb2JqZWN0LidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCIvKiogbW9kdWxlIGZvciBzaG9ydGhhbmQgKi9cblxuaW1wb3J0IHtFbmNvZGluZ30gZnJvbSAnLi9zY2hlbWEvZW5jb2Rpbmcuc2NoZW1hJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge1NwZWN9IGZyb20gJy4vc2NoZW1hL3NjaGVtYSc7XG5cbmltcG9ydCB7QUdHUkVHQVRFX09QU30gZnJvbSAnLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtUSU1FVU5JVFN9IGZyb20gJy4vdGltZXVuaXQnO1xuaW1wb3J0IHtTSE9SVF9UWVBFLCBUWVBFX0ZST01fU0hPUlRfVFlQRX0gZnJvbSAnLi90eXBlJztcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi9lbmNvZGluZyc7XG5pbXBvcnQge01hcmt9IGZyb20gJy4vbWFyayc7XG5cbmV4cG9ydCBjb25zdCBERUxJTSA9ICd8JztcbmV4cG9ydCBjb25zdCBBU1NJR04gPSAnPSc7XG5leHBvcnQgY29uc3QgVFlQRSA9ICcsJztcbmV4cG9ydCBjb25zdCBGVU5DID0gJ18nO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBzaG9ydGVuKHNwZWM6IFNwZWMpOiBzdHJpbmcge1xuICByZXR1cm4gJ21hcmsnICsgQVNTSUdOICsgc3BlYy5tYXJrICtcbiAgICBERUxJTSArIHNob3J0ZW5FbmNvZGluZyhzcGVjLmVuY29kaW5nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKHNob3J0aGFuZDogc3RyaW5nLCBkYXRhPywgY29uZmlnPykge1xuICBsZXQgc3BsaXQgPSBzaG9ydGhhbmQuc3BsaXQoREVMSU0pLFxuICAgIG1hcmsgPSBzcGxpdC5zaGlmdCgpLnNwbGl0KEFTU0lHTilbMV0udHJpbSgpLFxuICAgIGVuY29kaW5nID0gcGFyc2VFbmNvZGluZyhzcGxpdC5qb2luKERFTElNKSk7XG5cbiAgbGV0IHNwZWM6U3BlYyA9IHtcbiAgICBtYXJrOiBNYXJrW21hcmtdLFxuICAgIGVuY29kaW5nOiBlbmNvZGluZ1xuICB9O1xuXG4gIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICBzcGVjLmRhdGEgPSBkYXRhO1xuICB9XG4gIGlmIChjb25maWcgIT09IHVuZGVmaW5lZCkge1xuICAgIHNwZWMuY29uZmlnID0gY29uZmlnO1xuICB9XG4gIHJldHVybiBzcGVjO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRlbkVuY29kaW5nKGVuY29kaW5nOiBFbmNvZGluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2bEVuY29kaW5nLm1hcChlbmNvZGluZywgZnVuY3Rpb24oZmllbGREZWYsIGNoYW5uZWwpIHtcbiAgICByZXR1cm4gY2hhbm5lbCArIEFTU0lHTiArIHNob3J0ZW5GaWVsZERlZihmaWVsZERlZik7XG4gIH0pLmpvaW4oREVMSU0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VFbmNvZGluZyhlbmNvZGluZ1Nob3J0aGFuZDogc3RyaW5nKTogRW5jb2Rpbmcge1xuICByZXR1cm4gZW5jb2RpbmdTaG9ydGhhbmQuc3BsaXQoREVMSU0pLnJlZHVjZShmdW5jdGlvbihtLCBlKSB7XG4gICAgdmFyIHNwbGl0ID0gZS5zcGxpdChBU1NJR04pLFxuICAgICAgICBlbmN0eXBlID0gc3BsaXRbMF0udHJpbSgpLFxuICAgICAgICBmaWVsZERlZlNob3J0aGFuZCA9IHNwbGl0WzFdO1xuXG4gICAgbVtlbmN0eXBlXSA9IHBhcnNlRmllbGREZWYoZmllbGREZWZTaG9ydGhhbmQpO1xuICAgIHJldHVybiBtO1xuICB9LCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG9ydGVuRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmKTogc3RyaW5nIHtcbiAgcmV0dXJuIChmaWVsZERlZi5hZ2dyZWdhdGUgPyBmaWVsZERlZi5hZ2dyZWdhdGUgKyBGVU5DIDogJycpICtcbiAgICAoZmllbGREZWYudGltZVVuaXQgPyBmaWVsZERlZi50aW1lVW5pdCArIEZVTkMgOiAnJykgK1xuICAgIChmaWVsZERlZi5iaW4gPyAnYmluJyArIEZVTkMgOiAnJykgK1xuICAgIChmaWVsZERlZi5maWVsZCB8fCAnJykgKyBUWVBFICsgU0hPUlRfVFlQRVtmaWVsZERlZi50eXBlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3J0ZW5GaWVsZERlZnMoZmllbGREZWZzOiBGaWVsZERlZltdLCBkZWxpbSA9IERFTElNKTogc3RyaW5nIHtcbiAgcmV0dXJuIGZpZWxkRGVmcy5tYXAoc2hvcnRlbkZpZWxkRGVmKS5qb2luKGRlbGltKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRmllbGREZWYoZmllbGREZWZTaG9ydGhhbmQ6IHN0cmluZyk6IEZpZWxkRGVmIHtcbiAgdmFyIHNwbGl0ID0gZmllbGREZWZTaG9ydGhhbmQuc3BsaXQoVFlQRSk7XG5cbiAgdmFyIGZpZWxkRGVmOiBGaWVsZERlZiA9IHtcbiAgICBmaWVsZDogc3BsaXRbMF0udHJpbSgpLFxuICAgIHR5cGU6IFRZUEVfRlJPTV9TSE9SVF9UWVBFW3NwbGl0WzFdLnRyaW0oKV1cbiAgfTtcblxuICAvLyBjaGVjayBhZ2dyZWdhdGUgdHlwZVxuICBmb3IgKGxldCBpID0gMDsgaSA8IEFHR1JFR0FURV9PUFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYSA9IEFHR1JFR0FURV9PUFNbaV07XG4gICAgaWYgKGZpZWxkRGVmLmZpZWxkLmluZGV4T2YoYSArICdfJykgPT09IDApIHtcbiAgICAgIGZpZWxkRGVmLmZpZWxkID0gZmllbGREZWYuZmllbGQuc3Vic3RyKGEubGVuZ3RoICsgMSk7XG4gICAgICBpZiAoYSA9PT0gJ2NvdW50JyAmJiBmaWVsZERlZi5maWVsZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZmllbGREZWYuZmllbGQgPSAnKic7XG4gICAgICB9XG4gICAgICBmaWVsZERlZi5hZ2dyZWdhdGUgPSBhO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBUSU1FVU5JVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdHUgPSBUSU1FVU5JVFNbaV07XG4gICAgaWYgKGZpZWxkRGVmLmZpZWxkICYmIGZpZWxkRGVmLmZpZWxkLmluZGV4T2YodHUgKyAnXycpID09PSAwKSB7XG4gICAgICBmaWVsZERlZi5maWVsZCA9IGZpZWxkRGVmLmZpZWxkLnN1YnN0cihmaWVsZERlZi5maWVsZC5sZW5ndGggKyAxKTtcbiAgICAgIGZpZWxkRGVmLnRpbWVVbml0ID0gdHU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBjaGVjayBiaW5cbiAgaWYgKGZpZWxkRGVmLmZpZWxkICYmIGZpZWxkRGVmLmZpZWxkLmluZGV4T2YoJ2Jpbl8nKSA9PT0gMCkge1xuICAgIGZpZWxkRGVmLmZpZWxkID0gZmllbGREZWYuZmllbGQuc3Vic3RyKDQpO1xuICAgIGZpZWxkRGVmLmJpbiA9IHRydWU7XG4gIH1cblxuICByZXR1cm4gZmllbGREZWY7XG59XG4iLCIvKiBVdGlsaXRpZXMgZm9yIGEgVmVnYS1MaXRlIHNwZWNpZmljaWF0aW9uICovXG5cbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge1NwZWN9IGZyb20gJy4vc2NoZW1hL3NjaGVtYSc7XG5cbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vY29tcGlsZS9Nb2RlbCc7XG5pbXBvcnQge0NPTE9SLCBTSEFQRX0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi9lbmNvZGluZyc7XG5pbXBvcnQge0JBUiwgQVJFQX0gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7ZHVwbGljYXRlfSBmcm9tICcuL3V0aWwnO1xuXG4vLyBUT0RPOiBhZGQgdmwuc3BlYy52YWxpZGF0ZSAmIG1vdmUgc3R1ZmYgZnJvbSB2bC52YWxpZGF0ZSB0byBoZXJlXG5cbmV4cG9ydCBmdW5jdGlvbiBhbHdheXNOb09jY2x1c2lvbihzcGVjOiBTcGVjKTogYm9vbGVhbiB7XG4gIC8vIEZJWE1FIHJhdyBPeFEgd2l0aCAjIG9mIHJvd3MgPSAjIG9mIE9cbiAgcmV0dXJuIHZsRW5jb2RpbmcuaXNBZ2dyZWdhdGUoc3BlYy5lbmNvZGluZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWVsZERlZnMoc3BlYzogU3BlYyk6IEZpZWxkRGVmW10ge1xuICAvLyBUT0RPOiByZWZhY3RvciB0aGlzIG9uY2Ugd2UgaGF2ZSBjb21wb3NpdGlvblxuICByZXR1cm4gdmxFbmNvZGluZy5maWVsZERlZnMoc3BlYy5lbmNvZGluZyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xlYW5TcGVjKHNwZWM6IFNwZWMpOiBTcGVjIHtcbiAgLy8gVE9ETzogbW92ZSB0b1NwZWMgdG8gaGVyZSFcbiAgcmV0dXJuIG5ldyBNb2RlbChzcGVjKS50b1NwZWModHJ1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0YWNrKHNwZWM6IFNwZWMpOiBib29sZWFuIHtcbiAgcmV0dXJuICh2bEVuY29kaW5nLmhhcyhzcGVjLmVuY29kaW5nLCBDT0xPUikgfHwgdmxFbmNvZGluZy5oYXMoc3BlYy5lbmNvZGluZywgU0hBUEUpKSAmJlxuICAgIChzcGVjLm1hcmsgPT09IEJBUiB8fCBzcGVjLm1hcmsgPT09IEFSRUEpICYmXG4gICAgKCFzcGVjLmNvbmZpZyB8fCAhc3BlYy5jb25maWcubWFyay5zdGFja2VkICE9PSBmYWxzZSkgJiZcbiAgICB2bEVuY29kaW5nLmlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpO1xufVxuXG4vLyBUT0RPIHJldmlzZVxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zcG9zZShzcGVjOiBTcGVjKTogU3BlYyB7XG4gIHZhciBvbGRlbmMgPSBzcGVjLmVuY29kaW5nLFxuICAgIGVuY29kaW5nID0gZHVwbGljYXRlKHNwZWMuZW5jb2RpbmcpO1xuICBlbmNvZGluZy54ID0gb2xkZW5jLnk7XG4gIGVuY29kaW5nLnkgPSBvbGRlbmMueDtcbiAgZW5jb2Rpbmcucm93ID0gb2xkZW5jLmNvbHVtbjtcbiAgZW5jb2RpbmcuY29sdW1uID0gb2xkZW5jLnJvdztcbiAgc3BlYy5lbmNvZGluZyA9IGVuY29kaW5nO1xuICByZXR1cm4gc3BlYztcbn1cbiIsImV4cG9ydCBjb25zdCBUSU1FVU5JVFMgPSBbXG4gICd5ZWFyJywgJ21vbnRoJywgJ2RheScsICdkYXRlJywgJ2hvdXJzJywgJ21pbnV0ZXMnLCAnc2Vjb25kcycsICdtaWxsaXNlY29uZHMnLFxuICAneWVhcm1vbnRoJywgJ3llYXJtb250aGRheScsICd5ZWFybW9udGhkYXRlJywgJ3llYXJkYXknLCAneWVhcmRhdGUnLFxuICAneWVhcm1vbnRoZGF5aG91cnMnLCAneWVhcm1vbnRoZGF5aG91cnNtaW51dGVzJywgJ2hvdXJzbWludXRlcycsXG4gICdob3Vyc21pbnV0ZXNzZWNvbmRzJywgJ21pbnV0ZXNzZWNvbmRzJywgJ3NlY29uZHNtaWxsaXNlY29uZHMnXG5dO1xuIiwiLyoqIENvbnN0YW50cyBhbmQgdXRpbGl0aWVzIGZvciBkYXRhIHR5cGUgKi9cblxuZXhwb3J0IGVudW0gVHlwZSB7XG4gIFFVQU5USVRBVElWRSA9ICdxdWFudGl0YXRpdmUnIGFzIGFueSxcbiAgT1JESU5BTCA9ICdvcmRpbmFsJyBhcyBhbnksXG4gIFRFTVBPUkFMID0gJ3RlbXBvcmFsJyBhcyBhbnksXG4gIE5PTUlOQUwgPSAnbm9taW5hbCcgYXMgYW55XG59XG5cbmV4cG9ydCBjb25zdCBRVUFOVElUQVRJVkUgPSBUeXBlLlFVQU5USVRBVElWRTtcbmV4cG9ydCBjb25zdCBPUkRJTkFMID0gVHlwZS5PUkRJTkFMO1xuZXhwb3J0IGNvbnN0IFRFTVBPUkFMID0gVHlwZS5URU1QT1JBTDtcbmV4cG9ydCBjb25zdCBOT01JTkFMID0gVHlwZS5OT01JTkFMO1xuXG4vKipcbiAqIE1hcHBpbmcgZnJvbSBmdWxsIHR5cGUgbmFtZXMgdG8gc2hvcnQgdHlwZSBuYW1lcy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBTSE9SVF9UWVBFID0ge1xuICBxdWFudGl0YXRpdmU6ICdRJyxcbiAgdGVtcG9yYWw6ICdUJyxcbiAgbm9taW5hbDogJ04nLFxuICBvcmRpbmFsOiAnTydcbn07XG4vKipcbiAqIE1hcHBpbmcgZnJvbSBzaG9ydCB0eXBlIG5hbWVzIHRvIGZ1bGwgdHlwZSBuYW1lcy5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBUWVBFX0ZST01fU0hPUlRfVFlQRSA9IHtcbiAgUTogUVVBTlRJVEFUSVZFLFxuICBUOiBURU1QT1JBTCxcbiAgTzogT1JESU5BTCxcbiAgTjogTk9NSU5BTFxufTtcblxuLyoqXG4gKiBHZXQgZnVsbCwgbG93ZXJjYXNlIHR5cGUgbmFtZSBmb3IgYSBnaXZlbiB0eXBlLlxuICogQHBhcmFtICB0eXBlXG4gKiBAcmV0dXJuIEZ1bGwgdHlwZSBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVsbE5hbWUodHlwZTogVHlwZSk6IFR5cGUge1xuICBjb25zdCB0eXBlU3RyaW5nID0gPGFueT50eXBlOyAgLy8gZm9yY2UgdHlwZSBhcyBzdHJpbmcgc28gd2UgY2FuIHRyYW5zbGF0ZSBzaG9ydCB0eXBlc1xuICByZXR1cm4gVFlQRV9GUk9NX1NIT1JUX1RZUEVbdHlwZVN0cmluZy50b1VwcGVyQ2FzZSgpXSB8fCAvLyBzaG9ydCB0eXBlIGlzIHVwcGVyY2FzZSBieSBkZWZhdWx0XG4gICAgICAgICB0eXBlU3RyaW5nLnRvTG93ZXJDYXNlKCk7XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9kYXRhbGliLmQudHNcIi8+XG5cbmV4cG9ydCB7a2V5cywgZXh0ZW5kLCBkdXBsaWNhdGUsIGlzQXJyYXksIHZhbHMsIHRydW5jYXRlLCB0b01hcCwgaXNPYmplY3R9IGZyb20gJ2RhdGFsaWIvc3JjL3V0aWwnO1xuZXhwb3J0IHtyYW5nZX0gZnJvbSAnZGF0YWxpYi9zcmMvZ2VuZXJhdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnM8VD4oYXJyYXk6IEFycmF5PFQ+LCBpdGVtOiBUKSB7XG4gIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pID4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoKG9iaiwgZjogKGEsIGQsIGssIG8pID0+IGFueSwgdGhpc0FyZykge1xuICBpZiAob2JqLmZvckVhY2gpIHtcbiAgICBvYmouZm9yRWFjaC5jYWxsKHRoaXNBcmcsIGYpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGssIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2Uob2JqLCBmOiAoYSwgaSwgZCwgaywgbykgPT4gYW55LCBpbml0LCB0aGlzQXJnPykge1xuICBpZiAob2JqLnJlZHVjZSkge1xuICAgIHJldHVybiBvYmoucmVkdWNlLmNhbGwodGhpc0FyZywgZiwgaW5pdCk7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgaW5pdCA9IGYuY2FsbCh0aGlzQXJnLCBpbml0LCBvYmpba10sIGssIG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbml0O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXAob2JqLCBmOiAoYSwgZCwgaywgbykgPT4gYW55LCB0aGlzQXJnPykge1xuICBpZiAob2JqLm1hcCkge1xuICAgIHJldHVybiBvYmoubWFwLmNhbGwodGhpc0FyZywgZik7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG91dHB1dCA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGssIG9iaikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbnk8VD4oYXJyOiBBcnJheTxUPiwgZjogKGQ6IFQsIGs/LCBpPykgPT4gYm9vbGVhbikge1xuICB2YXIgaSA9IDA7XG4gIGZvciAobGV0IGsgPSAwOyBrPGFyci5sZW5ndGg7IGsrKykge1xuICAgIGlmIChmKGFycltrXSwgaywgaSsrKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFsbDxUPihhcnI6IEFycmF5PFQ+LCBmOiAoZDogVCwgaz8sIGk/KSA9PiBib29sZWFuKSB7XG4gIHZhciBpID0gMDtcbiAgZm9yIChsZXQgayA9IDA7IGs8YXJyLmxlbmd0aDsgaysrKSB7XG4gICAgaWYgKCFmKGFycltrXSwgaywgaSsrKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gRklYTUUgcmVtb3ZlIHRoaXNcbmltcG9ydCBkbEJpbiA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL2JpbnMvYmlucycpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldGJpbnMoc3RhdHMsIG1heGJpbnMpIHtcbiAgcmV0dXJuIGRsQmluKHtcbiAgICBtaW46IHN0YXRzLm1pbixcbiAgICBtYXg6IHN0YXRzLm1heCxcbiAgICBtYXhiaW5zOiBtYXhiaW5zXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXJyb3IobWVzc2FnZTogYW55KSB7XG4gIGNvbnNvbGUuZXJyb3IoJ1tWTCBFcnJvcl0nLCBtZXNzYWdlKTtcbn1cbiIsImltcG9ydCB7U3BlY30gZnJvbSAnLi9zY2hlbWEvc2NoZW1hJztcblxuLy8gVE9ETzogbW92ZSB0byB2bC5zcGVjLnZhbGlkYXRvcj9cblxuaW1wb3J0IHt0b01hcH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7QkFSfSBmcm9tICcuL21hcmsnO1xuXG5pbnRlcmZhY2UgUmVxdWlyZWRDaGFubmVsTWFwIHtcbiAgW21hcms6IHN0cmluZ106IEFycmF5PHN0cmluZz47XG59XG5cbi8qKlxuICogUmVxdWlyZWQgRW5jb2RpbmcgQ2hhbm5lbHMgZm9yIGVhY2ggbWFyayB0eXBlXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9SRVFVSVJFRF9DSEFOTkVMX01BUDogUmVxdWlyZWRDaGFubmVsTWFwID0ge1xuICB0ZXh0OiBbJ3RleHQnXSxcbiAgbGluZTogWyd4JywgJ3knXSxcbiAgYXJlYTogWyd4JywgJ3knXVxufTtcblxuaW50ZXJmYWNlIFN1cHBvcnRlZENoYW5uZWxNYXAge1xuICBbbWFyazogc3RyaW5nXToge1xuICAgIFtjaGFubmVsOiBzdHJpbmddOiBudW1iZXJcbiAgfTtcbn1cblxuLyoqXG4gKiBTdXBwb3J0ZWQgRW5jb2RpbmcgQ2hhbm5lbCBmb3IgZWFjaCBtYXJrIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfU1VQUE9SVEVEX0NIQU5ORUxfVFlQRTogU3VwcG9ydGVkQ2hhbm5lbE1hcCA9IHtcbiAgYmFyOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ3NpemUnLCAnY29sb3InLCAnZGV0YWlsJ10pLFxuICBsaW5lOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2RldGFpbCddKSwgLy8gVE9ETzogYWRkIHNpemUgd2hlbiBWZWdhIHN1cHBvcnRzXG4gIGFyZWE6IHRvTWFwKFsncm93JywgJ2NvbHVtbicsICd4JywgJ3knLCAnY29sb3InLCAnZGV0YWlsJ10pLFxuICB0aWNrOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2RldGFpbCddKSxcbiAgY2lyY2xlOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnLCAnZGV0YWlsJ10pLFxuICBzcXVhcmU6IHRvTWFwKFsncm93JywgJ2NvbHVtbicsICd4JywgJ3knLCAnY29sb3InLCAnc2l6ZScsICdkZXRhaWwnXSksXG4gIHBvaW50OiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnLCAnZGV0YWlsJywgJ3NoYXBlJ10pLFxuICB0ZXh0OiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAnc2l6ZScsICdjb2xvcicsICd0ZXh0J10pIC8vIFRPRE8oIzcyNCkgcmV2aXNlXG59O1xuXG4vLyBUT0RPOiBjb25zaWRlciBpZiB3ZSBzaG91bGQgYWRkIHZhbGlkYXRlIG1ldGhvZCBhbmRcbi8vIHJlcXVpcmVzIFpTY2hlbWEgaW4gdGhlIG1haW4gdmVnYS1saXRlIHJlcG9cblxuLyoqXG4gKiBGdXJ0aGVyIGNoZWNrIGlmIGVuY29kaW5nIG1hcHBpbmcgb2YgYSBzcGVjIGlzIGludmFsaWQgYW5kXG4gKiByZXR1cm4gZXJyb3IgaWYgaXQgaXMgaW52YWxpZC5cbiAqXG4gKiBUaGlzIGNoZWNrcyBpZlxuICogKDEpIGFsbCB0aGUgcmVxdWlyZWQgZW5jb2RpbmcgY2hhbm5lbHMgZm9yIHRoZSBtYXJrIHR5cGUgYXJlIHNwZWNpZmllZFxuICogKDIpIGFsbCB0aGUgc3BlY2lmaWVkIGVuY29kaW5nIGNoYW5uZWxzIGFyZSBzdXBwb3J0ZWQgYnkgdGhlIG1hcmsgdHlwZVxuICogQHBhcmFtICB7W3R5cGVdfSBzcGVjIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1JlcXVpcmVkQ2hhbm5lbE1hcCAgPSBEZWZhdWx0UmVxdWlyZWRDaGFubmVsTWFwfSAgcmVxdWlyZWRDaGFubmVsTWFwXG4gKiBAcGFyYW0gIHtTdXBwb3J0ZWRDaGFubmVsTWFwID0gRGVmYXVsdFN1cHBvcnRlZENoYW5uZWxNYXB9IHN1cHBvcnRlZENoYW5uZWxNYXBcbiAqIEByZXR1cm4ge1N0cmluZ30gUmV0dXJuIG9uZSByZWFzb24gd2h5IHRoZSBlbmNvZGluZyBpcyBpbnZhbGlkLFxuICogICAgICAgICAgICAgICAgICBvciBudWxsIGlmIHRoZSBlbmNvZGluZyBpcyB2YWxpZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVuY29kaW5nTWFwcGluZ0Vycm9yKHNwZWM6IFNwZWMsXG4gIHJlcXVpcmVkQ2hhbm5lbE1hcDogUmVxdWlyZWRDaGFubmVsTWFwID0gREVGQVVMVF9SRVFVSVJFRF9DSEFOTkVMX01BUCxcbiAgc3VwcG9ydGVkQ2hhbm5lbE1hcDogU3VwcG9ydGVkQ2hhbm5lbE1hcCA9IERFRkFVTFRfU1VQUE9SVEVEX0NIQU5ORUxfVFlQRVxuICApIHtcbiAgbGV0IG1hcmsgPSBzcGVjLm1hcms7XG4gIGxldCBlbmNvZGluZyA9IHNwZWMuZW5jb2Rpbmc7XG4gIGxldCByZXF1aXJlZENoYW5uZWxzID0gcmVxdWlyZWRDaGFubmVsTWFwW21hcmtdO1xuICBsZXQgc3VwcG9ydGVkQ2hhbm5lbHMgPSBzdXBwb3J0ZWRDaGFubmVsTWFwW21hcmtdO1xuXG4gIGZvciAobGV0IGkgaW4gcmVxdWlyZWRDaGFubmVscykgeyAvLyBhbGwgcmVxdWlyZWQgY2hhbm5lbHMgYXJlIGluIGVuY29kaW5nYFxuICAgIGlmICghKHJlcXVpcmVkQ2hhbm5lbHNbaV0gaW4gZW5jb2RpbmcpKSB7XG4gICAgICByZXR1cm4gJ01pc3NpbmcgZW5jb2RpbmcgY2hhbm5lbCBcXFwiJyArIHJlcXVpcmVkQ2hhbm5lbHNbaV0gK1xuICAgICAgICAnXFxcIiBmb3IgbWFyayBcXFwiJyArIG1hcmsgKyAnXFxcIic7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgY2hhbm5lbCBpbiBlbmNvZGluZykgeyAvLyBhbGwgY2hhbm5lbHMgaW4gZW5jb2RpbmcgYXJlIHN1cHBvcnRlZFxuICAgIGlmICghc3VwcG9ydGVkQ2hhbm5lbHNbY2hhbm5lbF0pIHtcbiAgICAgIHJldHVybiAnRW5jb2RpbmcgY2hhbm5lbCBcXFwiJyArIGNoYW5uZWwgK1xuICAgICAgICAnXFxcIiBpcyBub3Qgc3VwcG9ydGVkIGJ5IG1hcmsgdHlwZSBcXFwiJyArIG1hcmsgKyAnXFxcIic7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1hcmsgPT09IEJBUiAmJiAhZW5jb2RpbmcueCAmJiAhZW5jb2RpbmcueSkge1xuICAgIHJldHVybiAnTWlzc2luZyBib3RoIHggYW5kIHkgZm9yIGJhcic7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsImltcG9ydCAqIGFzIHZsQmluIGZyb20gJy4vYmluJztcbmltcG9ydCAqIGFzIHZsQ2hhbm5lbCBmcm9tICcuL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgdmxEYXRhIGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4vZW5jb2RpbmcnO1xuaW1wb3J0ICogYXMgdmxGaWVsZERlZiBmcm9tICcuL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIHZsQ29tcGlsZSBmcm9tICcuL2NvbXBpbGUvY29tcGlsZSc7XG5pbXBvcnQgKiBhcyB2bFNjaGVtYSBmcm9tICcuL3NjaGVtYS9zY2hlbWEnO1xuaW1wb3J0ICogYXMgdmxTaG9ydGhhbmQgZnJvbSAnLi9zaG9ydGhhbmQnO1xuaW1wb3J0ICogYXMgdmxTcGVjIGZyb20gJy4vc3BlYyc7XG5pbXBvcnQgKiBhcyB2bFRpbWVVbml0IGZyb20gJy4vdGltZXVuaXQnO1xuaW1wb3J0ICogYXMgdmxUeXBlIGZyb20gJy4vdHlwZSc7XG5pbXBvcnQgKiBhcyB2bFZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0ICogYXMgdmxVdGlsIGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBiaW4gPSB2bEJpbjtcbmV4cG9ydCBjb25zdCBjaGFubmVsID0gdmxDaGFubmVsO1xuZXhwb3J0IGNvbnN0IGNvbXBpbGUgPSB2bENvbXBpbGUuY29tcGlsZTtcbmV4cG9ydCBjb25zdCBkYXRhID0gdmxEYXRhO1xuZXhwb3J0IGNvbnN0IGVuY29kaW5nID0gdmxFbmNvZGluZztcbmV4cG9ydCBjb25zdCBmaWVsZERlZiA9IHZsRmllbGREZWY7XG5leHBvcnQgY29uc3Qgc2NoZW1hID0gdmxTY2hlbWE7XG5leHBvcnQgY29uc3Qgc2hvcnRoYW5kID0gdmxTaG9ydGhhbmQ7XG5leHBvcnQgY29uc3Qgc3BlYyA9IHZsU3BlYztcbmV4cG9ydCBjb25zdCB0aW1lVW5pdCA9IHZsVGltZVVuaXQ7XG5leHBvcnQgY29uc3QgdHlwZSA9IHZsVHlwZTtcbmV4cG9ydCBjb25zdCB1dGlsID0gdmxVdGlsO1xuZXhwb3J0IGNvbnN0IHZhbGlkYXRlID0gdmxWYWxpZGF0ZTtcblxuZXhwb3J0IGNvbnN0IHZlcnNpb24gPSAnX19WRVJTSU9OX18nO1xuIl19
