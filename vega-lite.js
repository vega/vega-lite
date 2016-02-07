(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vl = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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

},{"../time":5,"../util":6}],4:[function(require,module,exports){
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
},{"./util":6}],5:[function(require,module,exports){
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
},{"d3-time":2}],6:[function(require,module,exports){
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

},{"buffer":1}],7:[function(require,module,exports){
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

},{"datalib/src/bins/bins":3,"datalib/src/generate":4,"datalib/src/util":6}],55:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvbm9kZV9tb2R1bGVzL2QzLXRpbWUvYnVpbGQvZDMtdGltZS5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9iaW5zL2JpbnMuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvZ2VuZXJhdGUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvdGltZS5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy91dGlsLmpzIiwic3JjL2FnZ3JlZ2F0ZS50cyIsInNyYy9iaW4udHMiLCJzcmMvY2hhbm5lbC50cyIsInNyYy9jb21waWxlL01vZGVsLnRzIiwic3JjL2NvbXBpbGUvYXhpcy50cyIsInNyYy9jb21waWxlL2NvbXBpbGUudHMiLCJzcmMvY29tcGlsZS9jb25maWcudHMiLCJzcmMvY29tcGlsZS9kYXRhLnRzIiwic3JjL2NvbXBpbGUvZmFjZXQudHMiLCJzcmMvY29tcGlsZS9sYXlvdXQudHMiLCJzcmMvY29tcGlsZS9sZWdlbmQudHMiLCJzcmMvY29tcGlsZS9tYXJrLWFyZWEudHMiLCJzcmMvY29tcGlsZS9tYXJrLWJhci50cyIsInNyYy9jb21waWxlL21hcmstbGluZS50cyIsInNyYy9jb21waWxlL21hcmstcG9pbnQudHMiLCJzcmMvY29tcGlsZS9tYXJrLXRleHQudHMiLCJzcmMvY29tcGlsZS9tYXJrLXRpY2sudHMiLCJzcmMvY29tcGlsZS9tYXJrLnRzIiwic3JjL2NvbXBpbGUvc2NhbGUudHMiLCJzcmMvY29tcGlsZS9zdGFjay50cyIsInNyYy9jb21waWxlL3RpbWUudHMiLCJzcmMvY29tcGlsZS91dGlsLnRzIiwic3JjL2RhdGEudHMiLCJzcmMvZW5jb2RpbmcudHMiLCJzcmMvZmllbGRkZWYudHMiLCJzcmMvbWFyay50cyIsInNyYy9zY2hlbWEvYXhpcy5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL2Jpbi5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL2NvbmZpZy5jZWxsLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvY29uZmlnLm1hcmtzLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvY29uZmlnLnNjZW5lLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvY29uZmlnLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvY29uZmlnLnVuaXQuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9kYXRhLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvZW5jb2Rpbmcuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL2xlZ2VuZC5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL21hcmsuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9zY2FsZS5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL3NjaGVtYS50cyIsInNyYy9zY2hlbWEvc2NoZW1hdXRpbC50cyIsInNyYy9zY2hlbWEvc29ydC5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL3RyYW5zZm9ybS5zY2hlbWEudHMiLCJzcmMvc2hvcnRoYW5kLnRzIiwic3JjL3NwZWMudHMiLCJzcmMvdGltZXVuaXQudHMiLCJzcmMvdHlwZS50cyIsInNyYy91dGlsLnRzIiwic3JjL3ZhbGlkYXRlLnRzIiwic3JjL3ZsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFTYSxxQkFBYSxHQUFHO0lBQzNCLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFB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LENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixDQUFDLENBQUMsSUFBSSxHQUFHO2dCQUNQLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLGVBQUssQ0FBQztnQkFDN0IsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBSyxDQUFDO2FBQzFCLENBQUM7UUFDSixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hELENBQUM7SUFDSCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixDQUFDLENBQUMsTUFBTSxHQUFHO2dCQUNULEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLGVBQUssQ0FBQztnQkFDN0IsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBSyxDQUFDO2FBQzFCLENBQUM7UUFDSixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsTUFBTSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBSyxDQUFDLENBQUMs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QUFDLENBQUE7QUFDakMsSUFBWSxVQUFVLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFDekMsSUFBWSxNQUFNLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFFcEIsV0FBRyxHQUFHLEtBQUssQ0FBQztBQUNaLGVBQU8sR0FBRyxTQUFTLENBQUM7QUFDcEIsZUFBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7QUFDNUIsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLGdCQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ3RCLGdCQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ3RCLGNBQU0sR0FBRyxRQUFRLENBQUM7QUFDbEIsaUJBQVMsR0FBRyxXQUFXLENBQUM7QUFDeEIsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLGdCQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ3RCLFlBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFFdEIsZUFBTyxHQUFHLGFBQWEsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKCdkMy10aW1lJywgWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgZmFjdG9yeSgoZ2xvYmFsLmQzX3RpbWUgPSB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHQwID0gbmV3IERhdGU7XG4gIHZhciB0MSA9IG5ldyBEYXRlO1xuICBmdW5jdGlvbiBuZXdJbnRlcnZhbChmbG9vcmksIG9mZnNldGksIGNvdW50LCBmaWVsZCkge1xuXG4gICAgZnVuY3Rpb24gaW50ZXJ2YWwoZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoK2RhdGUpKSwgZGF0ZTtcbiAgICB9XG5cbiAgICBpbnRlcnZhbC5mbG9vciA9IGludGVydmFsO1xuXG4gICAgaW50ZXJ2YWwucm91bmQgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICB2YXIgZDAgPSBuZXcgRGF0ZSgrZGF0ZSksXG4gICAgICAgICAgZDEgPSBuZXcgRGF0ZShkYXRlIC0gMSk7XG4gICAgICBmbG9vcmkoZDApLCBmbG9vcmkoZDEpLCBvZmZzZXRpKGQxLCAxKTtcbiAgICAgIHJldHVybiBkYXRlIC0gZDAgPCBkMSAtIGRhdGUgPyBkMCA6IGQxO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5jZWlsID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoZGF0ZSAtIDEpKSwgb2Zmc2V0aShkYXRlLCAxKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwub2Zmc2V0ID0gZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgcmV0dXJuIG9mZnNldGkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSwgc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCkpLCBkYXRlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgICB2YXIgcmFuZ2UgPSBbXTtcbiAgICAgIHN0YXJ0ID0gbmV3IERhdGUoc3RhcnQgLSAxKTtcbiAgICAgIHN0b3AgPSBuZXcgRGF0ZSgrc3RvcCk7XG4gICAgICBzdGVwID0gc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICBpZiAoIShzdGFydCA8IHN0b3ApIHx8ICEoc3RlcCA+IDApKSByZXR1cm4gcmFuZ2U7IC8vIGFsc28gaGFuZGxlcyBJbnZhbGlkIERhdGVcbiAgICAgIG9mZnNldGkoc3RhcnQsIDEpLCBmbG9vcmkoc3RhcnQpO1xuICAgICAgaWYgKHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHdoaWxlIChvZmZzZXRpKHN0YXJ0LCBzdGVwKSwgZmxvb3JpKHN0YXJ0KSwgc3RhcnQgPCBzdG9wKSByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpO1xuICAgICAgcmV0dXJuIHJhbmdlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5maWx0ZXIgPSBmdW5jdGlvbih0ZXN0KSB7XG4gICAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB3aGlsZSAoZmxvb3JpKGRhdGUpLCAhdGVzdChkYXRlKSkgZGF0ZS5zZXRUaW1lKGRhdGUgLSAxKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgICAgd2hpbGUgKC0tc3RlcCA+PSAwKSB3aGlsZSAob2Zmc2V0aShkYXRlLCAxKSwgIXRlc3QoZGF0ZSkpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmIChjb3VudCkge1xuICAgICAgaW50ZXJ2YWwuY291bnQgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICAgIHQwLnNldFRpbWUoK3N0YXJ0KSwgdDEuc2V0VGltZSgrZW5kKTtcbiAgICAgICAgZmxvb3JpKHQwKSwgZmxvb3JpKHQxKTtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoY291bnQodDAsIHQxKSk7XG4gICAgICB9O1xuXG4gICAgICBpbnRlcnZhbC5ldmVyeSA9IGZ1bmN0aW9uKHN0ZXApIHtcbiAgICAgICAgc3RlcCA9IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICAgIHJldHVybiAhaXNGaW5pdGUoc3RlcCkgfHwgIShzdGVwID4gMCkgPyBudWxsXG4gICAgICAgICAgICA6ICEoc3RlcCA+IDEpID8gaW50ZXJ2YWxcbiAgICAgICAgICAgIDogaW50ZXJ2YWwuZmlsdGVyKGZpZWxkXG4gICAgICAgICAgICAgICAgPyBmdW5jdGlvbihkKSB7IHJldHVybiBmaWVsZChkKSAlIHN0ZXAgPT09IDA7IH1cbiAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGludGVydmFsLmNvdW50KDAsIGQpICUgc3RlcCA9PT0gMDsgfSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBpbnRlcnZhbDtcbiAgfTtcblxuICB2YXIgbWlsbGlzZWNvbmQgPSBuZXdJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAvLyBub29wXG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQgLSBzdGFydDtcbiAgfSk7XG5cbiAgLy8gQW4gb3B0aW1pemVkIGltcGxlbWVudGF0aW9uIGZvciB0aGlzIHNpbXBsZSBjYXNlLlxuICBtaWxsaXNlY29uZC5ldmVyeSA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gTWF0aC5mbG9vcihrKTtcbiAgICBpZiAoIWlzRmluaXRlKGspIHx8ICEoayA+IDApKSByZXR1cm4gbnVsbDtcbiAgICBpZiAoIShrID4gMSkpIHJldHVybiBtaWxsaXNlY29uZDtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRUaW1lKE1hdGguZmxvb3IoZGF0ZSAvIGspICogayk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIGspO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gaztcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgc2Vjb25kID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDFlMyk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDFlMztcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFNlY29uZHMoKTtcbiAgfSk7XG5cbiAgdmFyIG1pbnV0ZSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFNlY29uZHMoMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogNmU0KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNmU0O1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0TWludXRlcygpO1xuICB9KTtcblxuICB2YXIgaG91ciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldE1pbnV0ZXMoMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMzZlNSk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDM2ZTU7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRIb3VycygpO1xuICB9KTtcblxuICB2YXIgZGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIDZlNCkgLyA4NjRlNTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldERhdGUoKSAtIDE7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHdlZWtkYXkoaSkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gKGRhdGUuZ2V0RGF5KCkgKyA3IC0gaSkgJSA3KTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBzdGVwICogNyk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDYwNDhlNTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBzdW5kYXkgPSB3ZWVrZGF5KDApO1xuICB2YXIgbW9uZGF5ID0gd2Vla2RheSgxKTtcbiAgdmFyIHR1ZXNkYXkgPSB3ZWVrZGF5KDIpO1xuICB2YXIgd2VkbmVzZGF5ID0gd2Vla2RheSgzKTtcbiAgdmFyIHRodXJzZGF5ID0gd2Vla2RheSg0KTtcbiAgdmFyIGZyaWRheSA9IHdlZWtkYXkoNSk7XG4gIHZhciBzYXR1cmRheSA9IHdlZWtkYXkoNik7XG5cbiAgdmFyIG1vbnRoID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXREYXRlKDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0TW9udGgoKSAtIHN0YXJ0LmdldE1vbnRoKCkgKyAoZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpKSAqIDEyO1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0TW9udGgoKTtcbiAgfSk7XG5cbiAgdmFyIHllYXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICB9KTtcblxuICB2YXIgdXRjU2Vjb25kID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDTWlsbGlzZWNvbmRzKDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDFlMyk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDFlMztcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFVUQ1NlY29uZHMoKTtcbiAgfSk7XG5cbiAgdmFyIHV0Y01pbnV0ZSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ1NlY29uZHMoMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogNmU0KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNmU0O1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0VVRDTWludXRlcygpO1xuICB9KTtcblxuICB2YXIgdXRjSG91ciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ01pbnV0ZXMoMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMzZlNSk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDM2ZTU7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRVVENIb3VycygpO1xuICB9KTtcblxuICB2YXIgdXRjRGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gODY0ZTU7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRVVENEYXRlKCkgLSAxO1xuICB9KTtcblxuICBmdW5jdGlvbiB1dGNXZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSAtIChkYXRlLmdldFVUQ0RheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgc3RlcCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNjA0OGU1O1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHV0Y1N1bmRheSA9IHV0Y1dlZWtkYXkoMCk7XG4gIHZhciB1dGNNb25kYXkgPSB1dGNXZWVrZGF5KDEpO1xuICB2YXIgdXRjVHVlc2RheSA9IHV0Y1dlZWtkYXkoMik7XG4gIHZhciB1dGNXZWRuZXNkYXkgPSB1dGNXZWVrZGF5KDMpO1xuICB2YXIgdXRjVGh1cnNkYXkgPSB1dGNXZWVrZGF5KDQpO1xuICB2YXIgdXRjRnJpZGF5ID0gdXRjV2Vla2RheSg1KTtcbiAgdmFyIHV0Y1NhdHVyZGF5ID0gdXRjV2Vla2RheSg2KTtcblxuICB2YXIgdXRjTW9udGggPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldFVUQ0RhdGUoMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ01vbnRoKGRhdGUuZ2V0VVRDTW9udGgoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRVVENNb250aCgpIC0gc3RhcnQuZ2V0VVRDTW9udGgoKSArIChlbmQuZ2V0VVRDRnVsbFllYXIoKSAtIHN0YXJ0LmdldFVUQ0Z1bGxZZWFyKCkpICogMTI7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRVVENNb250aCgpO1xuICB9KTtcblxuICB2YXIgdXRjWWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0VVRDTW9udGgoMCwgMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIHZhciBtaWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZC5yYW5nZTtcbiAgdmFyIHNlY29uZHMgPSBzZWNvbmQucmFuZ2U7XG4gIHZhciBtaW51dGVzID0gbWludXRlLnJhbmdlO1xuICB2YXIgaG91cnMgPSBob3VyLnJhbmdlO1xuICB2YXIgZGF5cyA9IGRheS5yYW5nZTtcbiAgdmFyIHN1bmRheXMgPSBzdW5kYXkucmFuZ2U7XG4gIHZhciBtb25kYXlzID0gbW9uZGF5LnJhbmdlO1xuICB2YXIgdHVlc2RheXMgPSB0dWVzZGF5LnJhbmdlO1xuICB2YXIgd2VkbmVzZGF5cyA9IHdlZG5lc2RheS5yYW5nZTtcbiAgdmFyIHRodXJzZGF5cyA9IHRodXJzZGF5LnJhbmdlO1xuICB2YXIgZnJpZGF5cyA9IGZyaWRheS5yYW5nZTtcbiAgdmFyIHNhdHVyZGF5cyA9IHNhdHVyZGF5LnJhbmdlO1xuICB2YXIgd2Vla3MgPSBzdW5kYXkucmFuZ2U7XG4gIHZhciBtb250aHMgPSBtb250aC5yYW5nZTtcbiAgdmFyIHllYXJzID0geWVhci5yYW5nZTtcblxuICB2YXIgdXRjTWlsbGlzZWNvbmQgPSBtaWxsaXNlY29uZDtcbiAgdmFyIHV0Y01pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcztcbiAgdmFyIHV0Y1NlY29uZHMgPSB1dGNTZWNvbmQucmFuZ2U7XG4gIHZhciB1dGNNaW51dGVzID0gdXRjTWludXRlLnJhbmdlO1xuICB2YXIgdXRjSG91cnMgPSB1dGNIb3VyLnJhbmdlO1xuICB2YXIgdXRjRGF5cyA9IHV0Y0RheS5yYW5nZTtcbiAgdmFyIHV0Y1N1bmRheXMgPSB1dGNTdW5kYXkucmFuZ2U7XG4gIHZhciB1dGNNb25kYXlzID0gdXRjTW9uZGF5LnJhbmdlO1xuICB2YXIgdXRjVHVlc2RheXMgPSB1dGNUdWVzZGF5LnJhbmdlO1xuICB2YXIgdXRjV2VkbmVzZGF5cyA9IHV0Y1dlZG5lc2RheS5yYW5nZTtcbiAgdmFyIHV0Y1RodXJzZGF5cyA9IHV0Y1RodXJzZGF5LnJhbmdlO1xuICB2YXIgdXRjRnJpZGF5cyA9IHV0Y0ZyaWRheS5yYW5nZTtcbiAgdmFyIHV0Y1NhdHVyZGF5cyA9IHV0Y1NhdHVyZGF5LnJhbmdlO1xuICB2YXIgdXRjV2Vla3MgPSB1dGNTdW5kYXkucmFuZ2U7XG4gIHZhciB1dGNNb250aHMgPSB1dGNNb250aC5yYW5nZTtcbiAgdmFyIHV0Y1llYXJzID0gdXRjWWVhci5yYW5nZTtcblxuICB2YXIgdmVyc2lvbiA9IFwiMC4xLjFcIjtcblxuICBleHBvcnRzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICBleHBvcnRzLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcztcbiAgZXhwb3J0cy5zZWNvbmRzID0gc2Vjb25kcztcbiAgZXhwb3J0cy5taW51dGVzID0gbWludXRlcztcbiAgZXhwb3J0cy5ob3VycyA9IGhvdXJzO1xuICBleHBvcnRzLmRheXMgPSBkYXlzO1xuICBleHBvcnRzLnN1bmRheXMgPSBzdW5kYXlzO1xuICBleHBvcnRzLm1vbmRheXMgPSBtb25kYXlzO1xuICBleHBvcnRzLnR1ZXNkYXlzID0gdHVlc2RheXM7XG4gIGV4cG9ydHMud2VkbmVzZGF5cyA9IHdlZG5lc2RheXM7XG4gIGV4cG9ydHMudGh1cnNkYXlzID0gdGh1cnNkYXlzO1xuICBleHBvcnRzLmZyaWRheXMgPSBmcmlkYXlzO1xuICBleHBvcnRzLnNhdHVyZGF5cyA9IHNhdHVyZGF5cztcbiAgZXhwb3J0cy53ZWVrcyA9IHdlZWtzO1xuICBleHBvcnRzLm1vbnRocyA9IG1vbnRocztcbiAgZXhwb3J0cy55ZWFycyA9IHllYXJzO1xuICBleHBvcnRzLnV0Y01pbGxpc2Vjb25kID0gdXRjTWlsbGlzZWNvbmQ7XG4gIGV4cG9ydHMudXRjTWlsbGlzZWNvbmRzID0gdXRjTWlsbGlzZWNvbmRzO1xuICBleHBvcnRzLnV0Y1NlY29uZHMgPSB1dGNTZWNvbmRzO1xuICBleHBvcnRzLnV0Y01pbnV0ZXMgPSB1dGNNaW51dGVzO1xuICBleHBvcnRzLnV0Y0hvdXJzID0gdXRjSG91cnM7XG4gIGV4cG9ydHMudXRjRGF5cyA9IHV0Y0RheXM7XG4gIGV4cG9ydHMudXRjU3VuZGF5cyA9IHV0Y1N1bmRheXM7XG4gIGV4cG9ydHMudXRjTW9uZGF5cyA9IHV0Y01vbmRheXM7XG4gIGV4cG9ydHMudXRjVHVlc2RheXMgPSB1dGNUdWVzZGF5cztcbiAgZXhwb3J0cy51dGNXZWRuZXNkYXlzID0gdXRjV2VkbmVzZGF5cztcbiAgZXhwb3J0cy51dGNUaHVyc2RheXMgPSB1dGNUaHVyc2RheXM7XG4gIGV4cG9ydHMudXRjRnJpZGF5cyA9IHV0Y0ZyaWRheXM7XG4gIGV4cG9ydHMudXRjU2F0dXJkYXlzID0gdXRjU2F0dXJkYXlzO1xuICBleHBvcnRzLnV0Y1dlZWtzID0gdXRjV2Vla3M7XG4gIGV4cG9ydHMudXRjTW9udGhzID0gdXRjTW9udGhzO1xuICBleHBvcnRzLnV0Y1llYXJzID0gdXRjWWVhcnM7XG4gIGV4cG9ydHMubWlsbGlzZWNvbmQgPSBtaWxsaXNlY29uZDtcbiAgZXhwb3J0cy5zZWNvbmQgPSBzZWNvbmQ7XG4gIGV4cG9ydHMubWludXRlID0gbWludXRlO1xuICBleHBvcnRzLmhvdXIgPSBob3VyO1xuICBleHBvcnRzLmRheSA9IGRheTtcbiAgZXhwb3J0cy5zdW5kYXkgPSBzdW5kYXk7XG4gIGV4cG9ydHMubW9uZGF5ID0gbW9uZGF5O1xuICBleHBvcnRzLnR1ZXNkYXkgPSB0dWVzZGF5O1xuICBleHBvcnRzLndlZG5lc2RheSA9IHdlZG5lc2RheTtcbiAgZXhwb3J0cy50aHVyc2RheSA9IHRodXJzZGF5O1xuICBleHBvcnRzLmZyaWRheSA9IGZyaWRheTtcbiAgZXhwb3J0cy5zYXR1cmRheSA9IHNhdHVyZGF5O1xuICBleHBvcnRzLndlZWsgPSBzdW5kYXk7XG4gIGV4cG9ydHMubW9udGggPSBtb250aDtcbiAgZXhwb3J0cy55ZWFyID0geWVhcjtcbiAgZXhwb3J0cy51dGNTZWNvbmQgPSB1dGNTZWNvbmQ7XG4gIGV4cG9ydHMudXRjTWludXRlID0gdXRjTWludXRlO1xuICBleHBvcnRzLnV0Y0hvdXIgPSB1dGNIb3VyO1xuICBleHBvcnRzLnV0Y0RheSA9IHV0Y0RheTtcbiAgZXhwb3J0cy51dGNTdW5kYXkgPSB1dGNTdW5kYXk7XG4gIGV4cG9ydHMudXRjTW9uZGF5ID0gdXRjTW9uZGF5O1xuICBleHBvcnRzLnV0Y1R1ZXNkYXkgPSB1dGNUdWVzZGF5O1xuICBleHBvcnRzLnV0Y1dlZG5lc2RheSA9IHV0Y1dlZG5lc2RheTtcbiAgZXhwb3J0cy51dGNUaHVyc2RheSA9IHV0Y1RodXJzZGF5O1xuICBleHBvcnRzLnV0Y0ZyaWRheSA9IHV0Y0ZyaWRheTtcbiAgZXhwb3J0cy51dGNTYXR1cmRheSA9IHV0Y1NhdHVyZGF5O1xuICBleHBvcnRzLnV0Y1dlZWsgPSB1dGNTdW5kYXk7XG4gIGV4cG9ydHMudXRjTW9udGggPSB1dGNNb250aDtcbiAgZXhwb3J0cy51dGNZZWFyID0gdXRjWWVhcjtcbiAgZXhwb3J0cy5pbnRlcnZhbCA9IG5ld0ludGVydmFsO1xuXG59KSk7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gICAgdGltZSA9IHJlcXVpcmUoJy4uL3RpbWUnKSxcbiAgICBFUFNJTE9OID0gMWUtMTU7XG5cbmZ1bmN0aW9uIGJpbnMob3B0KSB7XG4gIGlmICghb3B0KSB7IHRocm93IEVycm9yKFwiTWlzc2luZyBiaW5uaW5nIG9wdGlvbnMuXCIpOyB9XG5cbiAgLy8gZGV0ZXJtaW5lIHJhbmdlXG4gIHZhciBtYXhiID0gb3B0Lm1heGJpbnMgfHwgMTUsXG4gICAgICBiYXNlID0gb3B0LmJhc2UgfHwgMTAsXG4gICAgICBsb2diID0gTWF0aC5sb2coYmFzZSksXG4gICAgICBkaXYgPSBvcHQuZGl2IHx8IFs1LCAyXSxcbiAgICAgIG1pbiA9IG9wdC5taW4sXG4gICAgICBtYXggPSBvcHQubWF4LFxuICAgICAgc3BhbiA9IG1heCAtIG1pbixcbiAgICAgIHN0ZXAsIGxldmVsLCBtaW5zdGVwLCBwcmVjaXNpb24sIHYsIGksIGVwcztcblxuICBpZiAob3B0LnN0ZXApIHtcbiAgICAvLyBpZiBzdGVwIHNpemUgaXMgZXhwbGljaXRseSBnaXZlbiwgdXNlIHRoYXRcbiAgICBzdGVwID0gb3B0LnN0ZXA7XG4gIH0gZWxzZSBpZiAob3B0LnN0ZXBzKSB7XG4gICAgLy8gaWYgcHJvdmlkZWQsIGxpbWl0IGNob2ljZSB0byBhY2NlcHRhYmxlIHN0ZXAgc2l6ZXNcbiAgICBzdGVwID0gb3B0LnN0ZXBzW01hdGgubWluKFxuICAgICAgb3B0LnN0ZXBzLmxlbmd0aCAtIDEsXG4gICAgICBiaXNlY3Qob3B0LnN0ZXBzLCBzcGFuL21heGIsIDAsIG9wdC5zdGVwcy5sZW5ndGgpXG4gICAgKV07XG4gIH0gZWxzZSB7XG4gICAgLy8gZWxzZSB1c2Ugc3BhbiB0byBkZXRlcm1pbmUgc3RlcCBzaXplXG4gICAgbGV2ZWwgPSBNYXRoLmNlaWwoTWF0aC5sb2cobWF4YikgLyBsb2diKTtcbiAgICBtaW5zdGVwID0gb3B0Lm1pbnN0ZXAgfHwgMDtcbiAgICBzdGVwID0gTWF0aC5tYXgoXG4gICAgICBtaW5zdGVwLFxuICAgICAgTWF0aC5wb3coYmFzZSwgTWF0aC5yb3VuZChNYXRoLmxvZyhzcGFuKSAvIGxvZ2IpIC0gbGV2ZWwpXG4gICAgKTtcblxuICAgIC8vIGluY3JlYXNlIHN0ZXAgc2l6ZSBpZiB0b28gbWFueSBiaW5zXG4gICAgd2hpbGUgKE1hdGguY2VpbChzcGFuL3N0ZXApID4gbWF4YikgeyBzdGVwICo9IGJhc2U7IH1cblxuICAgIC8vIGRlY3JlYXNlIHN0ZXAgc2l6ZSBpZiBhbGxvd2VkXG4gICAgZm9yIChpPTA7IGk8ZGl2Lmxlbmd0aDsgKytpKSB7XG4gICAgICB2ID0gc3RlcCAvIGRpdltpXTtcbiAgICAgIGlmICh2ID49IG1pbnN0ZXAgJiYgc3BhbiAvIHYgPD0gbWF4Yikgc3RlcCA9IHY7XG4gICAgfVxuICB9XG5cbiAgLy8gdXBkYXRlIHByZWNpc2lvbiwgbWluIGFuZCBtYXhcbiAgdiA9IE1hdGgubG9nKHN0ZXApO1xuICBwcmVjaXNpb24gPSB2ID49IDAgPyAwIDogfn4oLXYgLyBsb2diKSArIDE7XG4gIGVwcyA9IE1hdGgucG93KGJhc2UsIC1wcmVjaXNpb24gLSAxKTtcbiAgbWluID0gTWF0aC5taW4obWluLCBNYXRoLmZsb29yKG1pbiAvIHN0ZXAgKyBlcHMpICogc3RlcCk7XG4gIG1heCA9IE1hdGguY2VpbChtYXggLyBzdGVwKSAqIHN0ZXA7XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogbWluLFxuICAgIHN0b3A6ICBtYXgsXG4gICAgc3RlcDogIHN0ZXAsXG4gICAgdW5pdDogIHtwcmVjaXNpb246IHByZWNpc2lvbn0sXG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGluZGV4OiBpbmRleFxuICB9O1xufVxuXG5mdW5jdGlvbiBiaXNlY3QoYSwgeCwgbG8sIGhpKSB7XG4gIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgaWYgKHV0aWwuY21wKGFbbWlkXSwgeCkgPCAwKSB7IGxvID0gbWlkICsgMTsgfVxuICAgIGVsc2UgeyBoaSA9IG1pZDsgfVxuICB9XG4gIHJldHVybiBsbztcbn1cblxuZnVuY3Rpb24gdmFsdWUodikge1xuICByZXR1cm4gdGhpcy5zdGVwICogTWF0aC5mbG9vcih2IC8gdGhpcy5zdGVwICsgRVBTSUxPTik7XG59XG5cbmZ1bmN0aW9uIGluZGV4KHYpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoKHYgLSB0aGlzLnN0YXJ0KSAvIHRoaXMuc3RlcCArIEVQU0lMT04pO1xufVxuXG5mdW5jdGlvbiBkYXRlX3ZhbHVlKHYpIHtcbiAgcmV0dXJuIHRoaXMudW5pdC5kYXRlKHZhbHVlLmNhbGwodGhpcywgdikpO1xufVxuXG5mdW5jdGlvbiBkYXRlX2luZGV4KHYpIHtcbiAgcmV0dXJuIGluZGV4LmNhbGwodGhpcywgdGhpcy51bml0LnVuaXQodikpO1xufVxuXG5iaW5zLmRhdGUgPSBmdW5jdGlvbihvcHQpIHtcbiAgaWYgKCFvcHQpIHsgdGhyb3cgRXJyb3IoXCJNaXNzaW5nIGRhdGUgYmlubmluZyBvcHRpb25zLlwiKTsgfVxuXG4gIC8vIGZpbmQgdGltZSBzdGVwLCB0aGVuIGJpblxuICB2YXIgdW5pdHMgPSBvcHQudXRjID8gdGltZS51dGMgOiB0aW1lLFxuICAgICAgZG1pbiA9IG9wdC5taW4sXG4gICAgICBkbWF4ID0gb3B0Lm1heCxcbiAgICAgIG1heGIgPSBvcHQubWF4YmlucyB8fCAyMCxcbiAgICAgIG1pbmIgPSBvcHQubWluYmlucyB8fCA0LFxuICAgICAgc3BhbiA9ICgrZG1heCkgLSAoK2RtaW4pLFxuICAgICAgdW5pdCA9IG9wdC51bml0ID8gdW5pdHNbb3B0LnVuaXRdIDogdW5pdHMuZmluZChzcGFuLCBtaW5iLCBtYXhiKSxcbiAgICAgIHNwZWMgPSBiaW5zKHtcbiAgICAgICAgbWluOiAgICAgdW5pdC5taW4gIT0gbnVsbCA/IHVuaXQubWluIDogdW5pdC51bml0KGRtaW4pLFxuICAgICAgICBtYXg6ICAgICB1bml0Lm1heCAhPSBudWxsID8gdW5pdC5tYXggOiB1bml0LnVuaXQoZG1heCksXG4gICAgICAgIG1heGJpbnM6IG1heGIsXG4gICAgICAgIG1pbnN0ZXA6IHVuaXQubWluc3RlcCxcbiAgICAgICAgc3RlcHM6ICAgdW5pdC5zdGVwXG4gICAgICB9KTtcblxuICBzcGVjLnVuaXQgPSB1bml0O1xuICBzcGVjLmluZGV4ID0gZGF0ZV9pbmRleDtcbiAgaWYgKCFvcHQucmF3KSBzcGVjLnZhbHVlID0gZGF0ZV92YWx1ZTtcbiAgcmV0dXJuIHNwZWM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbnM7XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICAgIGdlbiA9IG1vZHVsZS5leHBvcnRzO1xuXG5nZW4ucmVwZWF0ID0gZnVuY3Rpb24odmFsLCBuKSB7XG4gIHZhciBhID0gQXJyYXkobiksIGk7XG4gIGZvciAoaT0wOyBpPG47ICsraSkgYVtpXSA9IHZhbDtcbiAgcmV0dXJuIGE7XG59O1xuXG5nZW4uemVyb3MgPSBmdW5jdGlvbihuKSB7XG4gIHJldHVybiBnZW4ucmVwZWF0KDAsIG4pO1xufTtcblxuZ2VuLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBzdG9wID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICB9XG4gIGlmICgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXAgPT0gSW5maW5pdHkpIHRocm93IG5ldyBFcnJvcignSW5maW5pdGUgcmFuZ2UnKTtcbiAgdmFyIHJhbmdlID0gW10sIGkgPSAtMSwgajtcbiAgaWYgKHN0ZXAgPCAwKSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpID4gc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgZWxzZSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpIDwgc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgcmV0dXJuIHJhbmdlO1xufTtcblxuZ2VuLnJhbmRvbSA9IHt9O1xuXG5nZW4ucmFuZG9tLnVuaWZvcm0gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICBpZiAobWF4ID09PSB1bmRlZmluZWQpIHtcbiAgICBtYXggPSBtaW4gPT09IHVuZGVmaW5lZCA/IDEgOiBtaW47XG4gICAgbWluID0gMDtcbiAgfVxuICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbWluICsgZCAqIE1hdGgucmFuZG9tKCk7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTtcbiAgfTtcbiAgZi5wZGYgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuICh4ID49IG1pbiAmJiB4IDw9IG1heCkgPyAxL2QgOiAwO1xuICB9O1xuICBmLmNkZiA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4geCA8IG1pbiA/IDAgOiB4ID4gbWF4ID8gMSA6ICh4IC0gbWluKSAvIGQ7XG4gIH07XG4gIGYuaWNkZiA9IGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gKHAgPj0gMCAmJiBwIDw9IDEpID8gbWluICsgcCpkIDogTmFOO1xuICB9O1xuICByZXR1cm4gZjtcbn07XG5cbmdlbi5yYW5kb20uaW50ZWdlciA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGIgPT09IHVuZGVmaW5lZCkge1xuICAgIGIgPSBhO1xuICAgIGEgPSAwO1xuICB9XG4gIHZhciBkID0gYiAtIGE7XG4gIHZhciBmID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGEgKyBNYXRoLmZsb29yKGQgKiBNYXRoLnJhbmRvbSgpKTtcbiAgfTtcbiAgZi5zYW1wbGVzID0gZnVuY3Rpb24obikge1xuICAgIHJldHVybiBnZW4uemVyb3MobikubWFwKGYpO1xuICB9O1xuICBmLnBkZiA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gKHggPT09IE1hdGguZmxvb3IoeCkgJiYgeCA+PSBhICYmIHggPCBiKSA/IDEvZCA6IDA7XG4gIH07XG4gIGYuY2RmID0gZnVuY3Rpb24oeCkge1xuICAgIHZhciB2ID0gTWF0aC5mbG9vcih4KTtcbiAgICByZXR1cm4gdiA8IGEgPyAwIDogdiA+PSBiID8gMSA6ICh2IC0gYSArIDEpIC8gZDtcbiAgfTtcbiAgZi5pY2RmID0gZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAocCA+PSAwICYmIHAgPD0gMSkgPyBhIC0gMSArIE1hdGguZmxvb3IocCpkKSA6IE5hTjtcbiAgfTtcbiAgcmV0dXJuIGY7XG59O1xuXG5nZW4ucmFuZG9tLm5vcm1hbCA9IGZ1bmN0aW9uKG1lYW4sIHN0ZGV2KSB7XG4gIG1lYW4gPSBtZWFuIHx8IDA7XG4gIHN0ZGV2ID0gc3RkZXYgfHwgMTtcbiAgdmFyIG5leHQ7XG4gIHZhciBmID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHggPSAwLCB5ID0gMCwgcmRzLCBjO1xuICAgIGlmIChuZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHggPSBuZXh0O1xuICAgICAgbmV4dCA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgICBkbyB7XG4gICAgICB4ID0gTWF0aC5yYW5kb20oKSoyLTE7XG4gICAgICB5ID0gTWF0aC5yYW5kb20oKSoyLTE7XG4gICAgICByZHMgPSB4KnggKyB5Knk7XG4gICAgfSB3aGlsZSAocmRzID09PSAwIHx8IHJkcyA+IDEpO1xuICAgIGMgPSBNYXRoLnNxcnQoLTIqTWF0aC5sb2cocmRzKS9yZHMpOyAvLyBCb3gtTXVsbGVyIHRyYW5zZm9ybVxuICAgIG5leHQgPSBtZWFuICsgeSpjKnN0ZGV2O1xuICAgIHJldHVybiBtZWFuICsgeCpjKnN0ZGV2O1xuICB9O1xuICBmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7XG4gIH07XG4gIGYucGRmID0gZnVuY3Rpb24oeCkge1xuICAgIHZhciBleHAgPSBNYXRoLmV4cChNYXRoLnBvdyh4LW1lYW4sIDIpIC8gKC0yICogTWF0aC5wb3coc3RkZXYsIDIpKSk7XG4gICAgcmV0dXJuICgxIC8gKHN0ZGV2ICogTWF0aC5zcXJ0KDIqTWF0aC5QSSkpKSAqIGV4cDtcbiAgfTtcbiAgZi5jZGYgPSBmdW5jdGlvbih4KSB7XG4gICAgLy8gQXBwcm94aW1hdGlvbiBmcm9tIFdlc3QgKDIwMDkpXG4gICAgLy8gQmV0dGVyIEFwcHJveGltYXRpb25zIHRvIEN1bXVsYXRpdmUgTm9ybWFsIEZ1bmN0aW9uc1xuICAgIHZhciBjZCxcbiAgICAgICAgeiA9ICh4IC0gbWVhbikgLyBzdGRldixcbiAgICAgICAgWiA9IE1hdGguYWJzKHopO1xuICAgIGlmIChaID4gMzcpIHtcbiAgICAgIGNkID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN1bSwgZXhwID0gTWF0aC5leHAoLVoqWi8yKTtcbiAgICAgIGlmIChaIDwgNy4wNzEwNjc4MTE4NjU0Nykge1xuICAgICAgICBzdW0gPSAzLjUyNjI0OTY1OTk4OTExZS0wMiAqIFogKyAwLjcwMDM4MzA2NDQ0MzY4ODtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDYuMzczOTYyMjAzNTMxNjU7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyAzMy45MTI4NjYwNzgzODM7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyAxMTIuMDc5MjkxNDk3ODcxO1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgMjIxLjIxMzU5NjE2OTkzMTtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDIyMC4yMDY4Njc5MTIzNzY7XG4gICAgICAgIGNkID0gZXhwICogc3VtO1xuICAgICAgICBzdW0gPSA4LjgzODgzNDc2NDgzMTg0ZS0wMiAqIFogKyAxLjc1NTY2NzE2MzE4MjY0O1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgMTYuMDY0MTc3NTc5MjA3O1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgODYuNzgwNzMyMjAyOTQ2MTtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDI5Ni41NjQyNDg3Nzk2NzQ7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyA2MzcuMzMzNjMzMzc4ODMxO1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgNzkzLjgyNjUxMjUxOTk0ODtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDQ0MC40MTM3MzU4MjQ3NTI7XG4gICAgICAgIGNkID0gY2QgLyBzdW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdW0gPSBaICsgMC42NTtcbiAgICAgICAgc3VtID0gWiArIDQgLyBzdW07XG4gICAgICAgIHN1bSA9IFogKyAzIC8gc3VtO1xuICAgICAgICBzdW0gPSBaICsgMiAvIHN1bTtcbiAgICAgICAgc3VtID0gWiArIDEgLyBzdW07XG4gICAgICAgIGNkID0gZXhwIC8gc3VtIC8gMi41MDY2MjgyNzQ2MzE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB6ID4gMCA/IDEgLSBjZCA6IGNkO1xuICB9O1xuICBmLmljZGYgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gQXBwcm94aW1hdGlvbiBvZiBQcm9iaXQgZnVuY3Rpb24gdXNpbmcgaW52ZXJzZSBlcnJvciBmdW5jdGlvbi5cbiAgICBpZiAocCA8PSAwIHx8IHAgPj0gMSkgcmV0dXJuIE5hTjtcbiAgICB2YXIgeCA9IDIqcCAtIDEsXG4gICAgICAgIHYgPSAoOCAqIChNYXRoLlBJIC0gMykpIC8gKDMgKiBNYXRoLlBJICogKDQtTWF0aC5QSSkpLFxuICAgICAgICBhID0gKDIgLyAoTWF0aC5QSSp2KSkgKyAoTWF0aC5sb2coMSAtIE1hdGgucG93KHgsMikpIC8gMiksXG4gICAgICAgIGIgPSBNYXRoLmxvZygxIC0gKHgqeCkpIC8gdixcbiAgICAgICAgcyA9ICh4ID4gMCA/IDEgOiAtMSkgKiBNYXRoLnNxcnQoTWF0aC5zcXJ0KChhKmEpIC0gYikgLSBhKTtcbiAgICByZXR1cm4gbWVhbiArIHN0ZGV2ICogTWF0aC5TUVJUMiAqIHM7XG4gIH07XG4gIHJldHVybiBmO1xufTtcblxuZ2VuLnJhbmRvbS5ib290c3RyYXAgPSBmdW5jdGlvbihkb21haW4sIHNtb290aCkge1xuICAvLyBHZW5lcmF0ZXMgYSBib290c3RyYXAgc2FtcGxlIGZyb20gYSBzZXQgb2Ygb2JzZXJ2YXRpb25zLlxuICAvLyBTbW9vdGggYm9vdHN0cmFwcGluZyBhZGRzIHJhbmRvbSB6ZXJvLWNlbnRlcmVkIG5vaXNlIHRvIHRoZSBzYW1wbGVzLlxuICB2YXIgdmFsID0gZG9tYWluLmZpbHRlcih1dGlsLmlzVmFsaWQpLFxuICAgICAgbGVuID0gdmFsLmxlbmd0aCxcbiAgICAgIGVyciA9IHNtb290aCA/IGdlbi5yYW5kb20ubm9ybWFsKDAsIHNtb290aCkgOiBudWxsO1xuICB2YXIgZiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWxbfn4oTWF0aC5yYW5kb20oKSpsZW4pXSArIChlcnIgPyBlcnIoKSA6IDApO1xuICB9O1xuICBmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7XG4gIH07XG4gIHJldHVybiBmO1xufTsiLCJ2YXIgZDNfdGltZSA9IHJlcXVpcmUoJ2QzLXRpbWUnKTtcblxudmFyIHRlbXBEYXRlID0gbmV3IERhdGUoKSxcbiAgICBiYXNlRGF0ZSA9IG5ldyBEYXRlKDAsIDAsIDEpLnNldEZ1bGxZZWFyKDApLCAvLyBKYW4gMSwgMCBBRFxuICAgIHV0Y0Jhc2VEYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoMCwgMCwgMSkpLnNldFVUQ0Z1bGxZZWFyKDApO1xuXG5mdW5jdGlvbiBkYXRlKGQpIHtcbiAgcmV0dXJuICh0ZW1wRGF0ZS5zZXRUaW1lKCtkKSwgdGVtcERhdGUpO1xufVxuXG4vLyBjcmVhdGUgYSB0aW1lIHVuaXQgZW50cnlcbmZ1bmN0aW9uIGVudHJ5KHR5cGUsIGRhdGUsIHVuaXQsIHN0ZXAsIG1pbiwgbWF4KSB7XG4gIHZhciBlID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0ZTogZGF0ZSxcbiAgICB1bml0OiB1bml0XG4gIH07XG4gIGlmIChzdGVwKSB7XG4gICAgZS5zdGVwID0gc3RlcDtcbiAgfSBlbHNlIHtcbiAgICBlLm1pbnN0ZXAgPSAxO1xuICB9XG4gIGlmIChtaW4gIT0gbnVsbCkgZS5taW4gPSBtaW47XG4gIGlmIChtYXggIT0gbnVsbCkgZS5tYXggPSBtYXg7XG4gIHJldHVybiBlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGUodHlwZSwgdW5pdCwgYmFzZSwgc3RlcCwgbWluLCBtYXgpIHtcbiAgcmV0dXJuIGVudHJ5KHR5cGUsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gdW5pdC5vZmZzZXQoYmFzZSwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gdW5pdC5jb3VudChiYXNlLCBkKTsgfSxcbiAgICBzdGVwLCBtaW4sIG1heCk7XG59XG5cbnZhciBsb2NhbGUgPSBbXG4gIGNyZWF0ZSgnc2Vjb25kJywgZDNfdGltZS5zZWNvbmQsIGJhc2VEYXRlKSxcbiAgY3JlYXRlKCdtaW51dGUnLCBkM190aW1lLm1pbnV0ZSwgYmFzZURhdGUpLFxuICBjcmVhdGUoJ2hvdXInLCAgIGQzX3RpbWUuaG91ciwgICBiYXNlRGF0ZSksXG4gIGNyZWF0ZSgnZGF5JywgICAgZDNfdGltZS5kYXksICAgIGJhc2VEYXRlLCBbMSwgN10pLFxuICBjcmVhdGUoJ21vbnRoJywgIGQzX3RpbWUubW9udGgsICBiYXNlRGF0ZSwgWzEsIDMsIDZdKSxcbiAgY3JlYXRlKCd5ZWFyJywgICBkM190aW1lLnllYXIsICAgYmFzZURhdGUpLFxuXG4gIC8vIHBlcmlvZGljIHVuaXRzXG4gIGVudHJ5KCdzZWNvbmRzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCAxLCAwLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFNlY29uZHMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnbWludXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgMSwgMCwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRNaW51dGVzKCk7IH0sXG4gICAgbnVsbCwgMCwgNTlcbiAgKSxcbiAgZW50cnkoJ2hvdXJzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCAxLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldEhvdXJzKCk7IH0sXG4gICAgbnVsbCwgMCwgMjNcbiAgKSxcbiAgZW50cnkoJ3dlZWtkYXlzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCA0K2QpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0RGF5KCk7IH0sXG4gICAgWzFdLCAwLCA2XG4gICksXG4gIGVudHJ5KCdkYXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXREYXRlKCk7IH0sXG4gICAgWzFdLCAxLCAzMVxuICApLFxuICBlbnRyeSgnbW9udGhzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCBkICUgMTIsIDEpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0TW9udGgoKTsgfSxcbiAgICBbMV0sIDAsIDExXG4gIClcbl07XG5cbnZhciB1dGMgPSBbXG4gIGNyZWF0ZSgnc2Vjb25kJywgZDNfdGltZS51dGNTZWNvbmQsIHV0Y0Jhc2VEYXRlKSxcbiAgY3JlYXRlKCdtaW51dGUnLCBkM190aW1lLnV0Y01pbnV0ZSwgdXRjQmFzZURhdGUpLFxuICBjcmVhdGUoJ2hvdXInLCAgIGQzX3RpbWUudXRjSG91ciwgICB1dGNCYXNlRGF0ZSksXG4gIGNyZWF0ZSgnZGF5JywgICAgZDNfdGltZS51dGNEYXksICAgIHV0Y0Jhc2VEYXRlLCBbMSwgN10pLFxuICBjcmVhdGUoJ21vbnRoJywgIGQzX3RpbWUudXRjTW9udGgsICB1dGNCYXNlRGF0ZSwgWzEsIDMsIDZdKSxcbiAgY3JlYXRlKCd5ZWFyJywgICBkM190aW1lLnV0Y1llYXIsICAgdXRjQmFzZURhdGUpLFxuXG4gIC8vIHBlcmlvZGljIHVuaXRzXG4gIGVudHJ5KCdzZWNvbmRzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCAxLCAwLCAwLCBkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENTZWNvbmRzKCk7IH0sXG4gICAgbnVsbCwgMCwgNTlcbiAgKSxcbiAgZW50cnkoJ21pbnV0ZXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDEsIDAsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ01pbnV0ZXMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnaG91cnMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDEsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ0hvdXJzKCk7IH0sXG4gICAgbnVsbCwgMCwgMjNcbiAgKSxcbiAgZW50cnkoJ3dlZWtkYXlzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCA0K2QpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ0RheSgpOyB9LFxuICAgIFsxXSwgMCwgNlxuICApLFxuICBlbnRyeSgnZGF0ZXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ0RhdGUoKTsgfSxcbiAgICBbMV0sIDEsIDMxXG4gICksXG4gIGVudHJ5KCdtb250aHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIGQgJSAxMiwgMSkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDTW9udGgoKTsgfSxcbiAgICBbMV0sIDAsIDExXG4gIClcbl07XG5cbnZhciBTVEVQUyA9IFtcbiAgWzMxNTM2ZTYsIDVdLCAgLy8gMS15ZWFyXG4gIFs3Nzc2ZTYsIDRdLCAgIC8vIDMtbW9udGhcbiAgWzI1OTJlNiwgNF0sICAgLy8gMS1tb250aFxuICBbMTIwOTZlNSwgM10sICAvLyAyLXdlZWtcbiAgWzYwNDhlNSwgM10sICAgLy8gMS13ZWVrXG4gIFsxNzI4ZTUsIDNdLCAgIC8vIDItZGF5XG4gIFs4NjRlNSwgM10sICAgIC8vIDEtZGF5XG4gIFs0MzJlNSwgMl0sICAgIC8vIDEyLWhvdXJcbiAgWzIxNmU1LCAyXSwgICAgLy8gNi1ob3VyXG4gIFsxMDhlNSwgMl0sICAgIC8vIDMtaG91clxuICBbMzZlNSwgMl0sICAgICAvLyAxLWhvdXJcbiAgWzE4ZTUsIDFdLCAgICAgLy8gMzAtbWludXRlXG4gIFs5ZTUsIDFdLCAgICAgIC8vIDE1LW1pbnV0ZVxuICBbM2U1LCAxXSwgICAgICAvLyA1LW1pbnV0ZVxuICBbNmU0LCAxXSwgICAgICAvLyAxLW1pbnV0ZVxuICBbM2U0LCAwXSwgICAgICAvLyAzMC1zZWNvbmRcbiAgWzE1ZTMsIDBdLCAgICAgLy8gMTUtc2Vjb25kXG4gIFs1ZTMsIDBdLCAgICAgIC8vIDUtc2Vjb25kXG4gIFsxZTMsIDBdICAgICAgIC8vIDEtc2Vjb25kXG5dO1xuXG5mdW5jdGlvbiBmaW5kKHVuaXRzLCBzcGFuLCBtaW5iLCBtYXhiKSB7XG4gIHZhciBzdGVwID0gU1RFUFNbMF0sIGksIG4sIGJpbnM7XG5cbiAgZm9yIChpPTEsIG49U1RFUFMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHN0ZXAgPSBTVEVQU1tpXTtcbiAgICBpZiAoc3BhbiA+IHN0ZXBbMF0pIHtcbiAgICAgIGJpbnMgPSBzcGFuIC8gc3RlcFswXTtcbiAgICAgIGlmIChiaW5zID4gbWF4Yikge1xuICAgICAgICByZXR1cm4gdW5pdHNbU1RFUFNbaS0xXVsxXV07XG4gICAgICB9XG4gICAgICBpZiAoYmlucyA+PSBtaW5iKSB7XG4gICAgICAgIHJldHVybiB1bml0c1tzdGVwWzFdXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuaXRzW1NURVBTW24tMV1bMV1dO1xufVxuXG5mdW5jdGlvbiB0b1VuaXRNYXAodW5pdHMpIHtcbiAgdmFyIG1hcCA9IHt9LCBpLCBuO1xuICBmb3IgKGk9MCwgbj11bml0cy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgbWFwW3VuaXRzW2ldLnR5cGVdID0gdW5pdHNbaV07XG4gIH1cbiAgbWFwLmZpbmQgPSBmdW5jdGlvbihzcGFuLCBtaW5iLCBtYXhiKSB7XG4gICAgcmV0dXJuIGZpbmQodW5pdHMsIHNwYW4sIG1pbmIsIG1heGIpO1xuICB9O1xuICByZXR1cm4gbWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvVW5pdE1hcChsb2NhbGUpO1xubW9kdWxlLmV4cG9ydHMudXRjID0gdG9Vbml0TWFwKHV0Yyk7IiwidmFyIHUgPSBtb2R1bGUuZXhwb3J0cztcblxuLy8gdXRpbGl0eSBmdW5jdGlvbnNcblxudmFyIEZOQU1FID0gJ19fbmFtZV9fJztcblxudS5uYW1lZGZ1bmMgPSBmdW5jdGlvbihuYW1lLCBmKSB7IHJldHVybiAoZltGTkFNRV0gPSBuYW1lLCBmKTsgfTtcblxudS5uYW1lID0gZnVuY3Rpb24oZikgeyByZXR1cm4gZj09bnVsbCA/IG51bGwgOiBmW0ZOQU1FXTsgfTtcblxudS5pZGVudGl0eSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHg7IH07XG5cbnUudHJ1ZSA9IHUubmFtZWRmdW5jKCd0cnVlJywgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9KTtcblxudS5mYWxzZSA9IHUubmFtZWRmdW5jKCdmYWxzZScsIGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH0pO1xuXG51LmR1cGxpY2F0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn07XG5cbnUuZXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShhKSA9PT0gSlNPTi5zdHJpbmdpZnkoYik7XG59O1xuXG51LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICBmb3IgKHZhciB4LCBuYW1lLCBpPTEsIGxlbj1hcmd1bWVudHMubGVuZ3RoOyBpPGxlbjsgKytpKSB7XG4gICAgeCA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKG5hbWUgaW4geCkgeyBvYmpbbmFtZV0gPSB4W25hbWVdOyB9XG4gIH1cbiAgcmV0dXJuIG9iajtcbn07XG5cbnUubGVuZ3RoID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4geCAhPSBudWxsICYmIHgubGVuZ3RoICE9IG51bGwgPyB4Lmxlbmd0aCA6IG51bGw7XG59O1xuXG51LmtleXMgPSBmdW5jdGlvbih4KSB7XG4gIHZhciBrZXlzID0gW10sIGs7XG4gIGZvciAoayBpbiB4KSBrZXlzLnB1c2goayk7XG4gIHJldHVybiBrZXlzO1xufTtcblxudS52YWxzID0gZnVuY3Rpb24oeCkge1xuICB2YXIgdmFscyA9IFtdLCBrO1xuICBmb3IgKGsgaW4geCkgdmFscy5wdXNoKHhba10pO1xuICByZXR1cm4gdmFscztcbn07XG5cbnUudG9NYXAgPSBmdW5jdGlvbihsaXN0LCBmKSB7XG4gIHJldHVybiAoZiA9IHUuJChmKSkgP1xuICAgIGxpc3QucmVkdWNlKGZ1bmN0aW9uKG9iaiwgeCkgeyByZXR1cm4gKG9ialtmKHgpXSA9IDEsIG9iaik7IH0sIHt9KSA6XG4gICAgbGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCB4KSB7IHJldHVybiAob2JqW3hdID0gMSwgb2JqKTsgfSwge30pO1xufTtcblxudS5rZXlzdHIgPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgLy8gdXNlIHRvIGVuc3VyZSBjb25zaXN0ZW50IGtleSBnZW5lcmF0aW9uIGFjcm9zcyBtb2R1bGVzXG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aDtcbiAgaWYgKCFuKSByZXR1cm4gJyc7XG4gIGZvciAodmFyIHM9U3RyaW5nKHZhbHVlc1swXSksIGk9MTsgaTxuOyArK2kpIHtcbiAgICBzICs9ICd8JyArIFN0cmluZyh2YWx1ZXNbaV0pO1xuICB9XG4gIHJldHVybiBzO1xufTtcblxuLy8gdHlwZSBjaGVja2luZyBmdW5jdGlvbnNcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudS5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn07XG5cbnUuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcblxudS5pc1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcblxudS5pc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbnUuaXNOdW1iZXIgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgTnVtYmVyXSc7XG59O1xuXG51LmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEJvb2xlYW5dJztcbn07XG5cbnUuaXNEYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcbn07XG5cbnUuaXNWYWxpZCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09PSBvYmo7XG59O1xuXG51LmlzQnVmZmVyID0gKHR5cGVvZiBCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgQnVmZmVyLmlzQnVmZmVyKSB8fCB1LmZhbHNlO1xuXG4vLyB0eXBlIGNvZXJjaW9uIGZ1bmN0aW9uc1xuXG51Lm51bWJlciA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMgPT0gbnVsbCB8fCBzID09PSAnJyA/IG51bGwgOiArcztcbn07XG5cbnUuYm9vbGVhbiA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMgPT0gbnVsbCB8fCBzID09PSAnJyA/IG51bGwgOiBzPT09J2ZhbHNlJyA/IGZhbHNlIDogISFzO1xufTtcblxuLy8gcGFyc2UgYSBkYXRlIHdpdGggb3B0aW9uYWwgZDMudGltZS1mb3JtYXQgZm9ybWF0XG51LmRhdGUgPSBmdW5jdGlvbihzLCBmb3JtYXQpIHtcbiAgdmFyIGQgPSBmb3JtYXQgPyBmb3JtYXQgOiBEYXRlO1xuICByZXR1cm4gcyA9PSBudWxsIHx8IHMgPT09ICcnID8gbnVsbCA6IGQucGFyc2Uocyk7XG59O1xuXG51LmFycmF5ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4geCAhPSBudWxsID8gKHUuaXNBcnJheSh4KSA/IHggOiBbeF0pIDogW107XG59O1xuXG51LnN0ciA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHUuaXNBcnJheSh4KSA/ICdbJyArIHgubWFwKHUuc3RyKSArICddJ1xuICAgIDogdS5pc09iamVjdCh4KSA/IEpTT04uc3RyaW5naWZ5KHgpXG4gICAgOiB1LmlzU3RyaW5nKHgpID8gKCdcXCcnK3V0aWxfZXNjYXBlX3N0cih4KSsnXFwnJykgOiB4O1xufTtcblxudmFyIGVzY2FwZV9zdHJfcmUgPSAvKF58W15cXFxcXSknL2c7XG5cbmZ1bmN0aW9uIHV0aWxfZXNjYXBlX3N0cih4KSB7XG4gIHJldHVybiB4LnJlcGxhY2UoZXNjYXBlX3N0cl9yZSwgJyQxXFxcXFxcJycpO1xufVxuXG4vLyBkYXRhIGFjY2VzcyBmdW5jdGlvbnNcblxudmFyIGZpZWxkX3JlID0gL1xcWyguKj8pXFxdfFteLlxcW10rL2c7XG5cbnUuZmllbGQgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBTdHJpbmcoZikubWF0Y2goZmllbGRfcmUpLm1hcChmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIGRbMF0gIT09ICdbJyA/IGQgOlxuICAgICAgZFsxXSAhPT0gXCInXCIgJiYgZFsxXSAhPT0gJ1wiJyA/IGQuc2xpY2UoMSwgLTEpIDpcbiAgICAgIGQuc2xpY2UoMiwgLTIpLnJlcGxhY2UoL1xcXFwoW1wiJ10pL2csICckMScpO1xuICB9KTtcbn07XG5cbnUuYWNjZXNzb3IgPSBmdW5jdGlvbihmKSB7XG4gIHZhciBzO1xuICByZXR1cm4gZj09bnVsbCB8fCB1LmlzRnVuY3Rpb24oZikgPyBmIDpcbiAgICB1Lm5hbWVkZnVuYyhmLCAocyA9IHUuZmllbGQoZikpLmxlbmd0aCA+IDEgP1xuICAgICAgZnVuY3Rpb24oeCkgeyByZXR1cm4gcy5yZWR1Y2UoZnVuY3Rpb24oeCxmKSB7IHJldHVybiB4W2ZdOyB9LCB4KTsgfSA6XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiB4W2ZdOyB9XG4gICAgKTtcbn07XG5cbi8vIHNob3J0LWN1dCBmb3IgYWNjZXNzb3JcbnUuJCA9IHUuYWNjZXNzb3I7XG5cbnUubXV0YXRvciA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIHM7XG4gIHJldHVybiB1LmlzU3RyaW5nKGYpICYmIChzPXUuZmllbGQoZikpLmxlbmd0aCA+IDEgP1xuICAgIGZ1bmN0aW9uKHgsIHYpIHtcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzLmxlbmd0aC0xOyArK2kpIHggPSB4W3NbaV1dO1xuICAgICAgeFtzW2ldXSA9IHY7XG4gICAgfSA6XG4gICAgZnVuY3Rpb24oeCwgdikgeyB4W2ZdID0gdjsgfTtcbn07XG5cblxudS4kZnVuYyA9IGZ1bmN0aW9uKG5hbWUsIG9wKSB7XG4gIHJldHVybiBmdW5jdGlvbihmKSB7XG4gICAgZiA9IHUuJChmKSB8fCB1LmlkZW50aXR5O1xuICAgIHZhciBuID0gbmFtZSArICh1Lm5hbWUoZikgPyAnXycrdS5uYW1lKGYpIDogJycpO1xuICAgIHJldHVybiB1Lm5hbWVkZnVuYyhuLCBmdW5jdGlvbihkKSB7IHJldHVybiBvcChmKGQpKTsgfSk7XG4gIH07XG59O1xuXG51LiR2YWxpZCAgPSB1LiRmdW5jKCd2YWxpZCcsIHUuaXNWYWxpZCk7XG51LiRsZW5ndGggPSB1LiRmdW5jKCdsZW5ndGgnLCB1Lmxlbmd0aCk7XG5cbnUuJGluID0gZnVuY3Rpb24oZiwgdmFsdWVzKSB7XG4gIGYgPSB1LiQoZik7XG4gIHZhciBtYXAgPSB1LmlzQXJyYXkodmFsdWVzKSA/IHUudG9NYXAodmFsdWVzKSA6IHZhbHVlcztcbiAgcmV0dXJuIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICEhbWFwW2YoZCldOyB9O1xufTtcblxuLy8gY29tcGFyaXNvbiAvIHNvcnRpbmcgZnVuY3Rpb25zXG5cbnUuY29tcGFyYXRvciA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgdmFyIHNpZ24gPSBbXTtcbiAgaWYgKHNvcnQgPT09IHVuZGVmaW5lZCkgc29ydCA9IFtdO1xuICBzb3J0ID0gdS5hcnJheShzb3J0KS5tYXAoZnVuY3Rpb24oZikge1xuICAgIHZhciBzID0gMTtcbiAgICBpZiAgICAgIChmWzBdID09PSAnLScpIHsgcyA9IC0xOyBmID0gZi5zbGljZSgxKTsgfVxuICAgIGVsc2UgaWYgKGZbMF0gPT09ICcrJykgeyBzID0gKzE7IGYgPSBmLnNsaWNlKDEpOyB9XG4gICAgc2lnbi5wdXNoKHMpO1xuICAgIHJldHVybiB1LmFjY2Vzc29yKGYpO1xuICB9KTtcbiAgcmV0dXJuIGZ1bmN0aW9uKGEsYikge1xuICAgIHZhciBpLCBuLCBmLCB4LCB5O1xuICAgIGZvciAoaT0wLCBuPXNvcnQubGVuZ3RoOyBpPG47ICsraSkge1xuICAgICAgZiA9IHNvcnRbaV07IHggPSBmKGEpOyB5ID0gZihiKTtcbiAgICAgIGlmICh4IDwgeSkgcmV0dXJuIC0xICogc2lnbltpXTtcbiAgICAgIGlmICh4ID4geSkgcmV0dXJuIHNpZ25baV07XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9O1xufTtcblxudS5jbXAgPSBmdW5jdGlvbihhLCBiKSB7XG4gIGlmIChhIDwgYikge1xuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmIChhID4gYikge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2UgaWYgKGEgPj0gYikge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2UgaWYgKGEgPT09IG51bGwpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSBpZiAoYiA9PT0gbnVsbCkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiBOYU47XG59O1xuXG51Lm51bWNtcCA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEgLSBiOyB9O1xuXG51LnN0YWJsZXNvcnQgPSBmdW5jdGlvbihhcnJheSwgc29ydEJ5LCBrZXlGbikge1xuICB2YXIgaW5kaWNlcyA9IGFycmF5LnJlZHVjZShmdW5jdGlvbihpZHgsIHYsIGkpIHtcbiAgICByZXR1cm4gKGlkeFtrZXlGbih2KV0gPSBpLCBpZHgpO1xuICB9LCB7fSk7XG5cbiAgYXJyYXkuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHNhID0gc29ydEJ5KGEpLFxuICAgICAgICBzYiA9IHNvcnRCeShiKTtcbiAgICByZXR1cm4gc2EgPCBzYiA/IC0xIDogc2EgPiBzYiA/IDFcbiAgICAgICAgIDogKGluZGljZXNba2V5Rm4oYSldIC0gaW5kaWNlc1trZXlGbihiKV0pO1xuICB9KTtcblxuICByZXR1cm4gYXJyYXk7XG59O1xuXG5cbi8vIHN0cmluZyBmdW5jdGlvbnNcblxudS5wYWQgPSBmdW5jdGlvbihzLCBsZW5ndGgsIHBvcywgcGFkY2hhcikge1xuICBwYWRjaGFyID0gcGFkY2hhciB8fCBcIiBcIjtcbiAgdmFyIGQgPSBsZW5ndGggLSBzLmxlbmd0aDtcbiAgaWYgKGQgPD0gMCkgcmV0dXJuIHM7XG4gIHN3aXRjaCAocG9zKSB7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICByZXR1cm4gc3RycmVwKGQsIHBhZGNoYXIpICsgcztcbiAgICBjYXNlICdtaWRkbGUnOlxuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICByZXR1cm4gc3RycmVwKE1hdGguZmxvb3IoZC8yKSwgcGFkY2hhcikgK1xuICAgICAgICAgcyArIHN0cnJlcChNYXRoLmNlaWwoZC8yKSwgcGFkY2hhcik7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzICsgc3RycmVwKGQsIHBhZGNoYXIpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBzdHJyZXAobiwgc3RyKSB7XG4gIHZhciBzID0gXCJcIiwgaTtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSBzICs9IHN0cjtcbiAgcmV0dXJuIHM7XG59XG5cbnUudHJ1bmNhdGUgPSBmdW5jdGlvbihzLCBsZW5ndGgsIHBvcywgd29yZCwgZWxsaXBzaXMpIHtcbiAgdmFyIGxlbiA9IHMubGVuZ3RoO1xuICBpZiAobGVuIDw9IGxlbmd0aCkgcmV0dXJuIHM7XG4gIGVsbGlwc2lzID0gZWxsaXBzaXMgIT09IHVuZGVmaW5lZCA/IFN0cmluZyhlbGxpcHNpcykgOiAnXFx1MjAyNic7XG4gIHZhciBsID0gTWF0aC5tYXgoMCwgbGVuZ3RoIC0gZWxsaXBzaXMubGVuZ3RoKTtcblxuICBzd2l0Y2ggKHBvcykge1xuICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgcmV0dXJuIGVsbGlwc2lzICsgKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwsMSkgOiBzLnNsaWNlKGxlbi1sKSk7XG4gICAgY2FzZSAnbWlkZGxlJzpcbiAgICBjYXNlICdjZW50ZXInOlxuICAgICAgdmFyIGwxID0gTWF0aC5jZWlsKGwvMiksIGwyID0gTWF0aC5mbG9vcihsLzIpO1xuICAgICAgcmV0dXJuICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsMSkgOiBzLnNsaWNlKDAsbDEpKSArXG4gICAgICAgIGVsbGlwc2lzICsgKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwyLDEpIDogcy5zbGljZShsZW4tbDIpKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsKSA6IHMuc2xpY2UoMCxsKSkgKyBlbGxpcHNpcztcbiAgfVxufTtcblxuZnVuY3Rpb24gdHJ1bmNhdGVPbldvcmQocywgbGVuLCByZXYpIHtcbiAgdmFyIGNudCA9IDAsIHRvayA9IHMuc3BsaXQodHJ1bmNhdGVfd29yZF9yZSk7XG4gIGlmIChyZXYpIHtcbiAgICBzID0gKHRvayA9IHRvay5yZXZlcnNlKCkpXG4gICAgICAuZmlsdGVyKGZ1bmN0aW9uKHcpIHsgY250ICs9IHcubGVuZ3RoOyByZXR1cm4gY250IDw9IGxlbjsgfSlcbiAgICAgIC5yZXZlcnNlKCk7XG4gIH0gZWxzZSB7XG4gICAgcyA9IHRvay5maWx0ZXIoZnVuY3Rpb24odykgeyBjbnQgKz0gdy5sZW5ndGg7IHJldHVybiBjbnQgPD0gbGVuOyB9KTtcbiAgfVxuICByZXR1cm4gcy5sZW5ndGggPyBzLmpvaW4oJycpLnRyaW0oKSA6IHRva1swXS5zbGljZSgwLCBsZW4pO1xufVxuXG52YXIgdHJ1bmNhdGVfd29yZF9yZSA9IC8oW1xcdTAwMDlcXHUwMDBBXFx1MDAwQlxcdTAwMENcXHUwMDBEXFx1MDAyMFxcdTAwQTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUyMDI4XFx1MjAyOVxcdTMwMDBcXHVGRUZGXSkvO1xuIiwiZXhwb3J0IGNvbnN0IEFHR1JFR0FURV9PUFMgPSBbXG4gICd2YWx1ZXMnLCAnY291bnQnLCAndmFsaWQnLCAnbWlzc2luZycsICdkaXN0aW5jdCcsXG4gICdzdW0nLCAnbWVhbicsICdhdmVyYWdlJywgJ3ZhcmlhbmNlJywgJ3ZhcmlhbmNlcCcsICdzdGRldicsXG4gICdzdGRldnAnLCAnbWVkaWFuJywgJ3ExJywgJ3EzJywgJ21vZGVza2V3JywgJ21pbicsICdtYXgnLFxuICAnYXJnbWluJywgJ2FyZ21heCdcbl07XG5cbmV4cG9ydCBjb25zdCBTSEFSRURfRE9NQUlOX09QUyA9IFtcbiAgJ21lYW4nLCAnYXZlcmFnZScsICdzdGRldicsICdzdGRldnAnLCAnbWVkaWFuJywgJ3ExJywgJ3EzJywgJ21pbicsICdtYXgnXG5dO1xuXG4vLyBUT0RPOiBtb3ZlIHN1cHBvcnRlZFR5cGVzLCBzdXBwb3J0ZWRFbnVtcyBmcm9tIHNjaGVtYSB0byBoZXJlXG4iLCJpbXBvcnQge0NoYW5uZWwsIFJPVywgQ09MVU1OLCBTSEFQRSwgU0laRX0gZnJvbSAnLi9jaGFubmVsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9NYXhCaW5zKGNoYW5uZWw6IENoYW5uZWwpOiBudW1iZXIge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTFVNTjpcbiAgICBjYXNlIFNJWkU6XG4gICAgICAvLyBGYWNldHMgYW5kIFNpemUgc2hvdWxkbid0IGhhdmUgdG9vIG1hbnkgYmluc1xuICAgICAgLy8gV2UgY2hvb3NlIDYgbGlrZSBzaGFwZSB0byBzaW1wbGlmeSB0aGUgcnVsZVxuICAgIGNhc2UgU0hBUEU6XG4gICAgICByZXR1cm4gNjsgLy8gVmVnYSdzIFwic2hhcGVcIiBoYXMgNiBkaXN0aW5jdCB2YWx1ZXNcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIDEwO1xuICB9XG59XG4iLCIvKlxuICogQ29uc3RhbnRzIGFuZCB1dGlsaXRpZXMgZm9yIGVuY29kaW5nIGNoYW5uZWxzIChWaXN1YWwgdmFyaWFibGVzKVxuICogc3VjaCBhcyAneCcsICd5JywgJ2NvbG9yJy5cbiAqL1xuXG5pbXBvcnQge01hcmt9IGZyb20gJy4vbWFyayc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgZW51bSBDaGFubmVsIHtcbiAgWCA9ICd4JyBhcyBhbnksXG4gIFkgPSAneScgYXMgYW55LFxuICBST1cgPSAncm93JyBhcyBhbnksXG4gIENPTFVNTiA9ICdjb2x1bW4nIGFzIGFueSxcbiAgU0hBUEUgPSAnc2hhcGUnIGFzIGFueSxcbiAgU0laRSA9ICdzaXplJyBhcyBhbnksXG4gIENPTE9SID0gJ2NvbG9yJyBhcyBhbnksXG4gIFRFWFQgPSAndGV4dCcgYXMgYW55LFxuICBERVRBSUwgPSAnZGV0YWlsJyBhcyBhbnksXG4gIExBQkVMID0gJ2xhYmVsJyBhcyBhbnksXG4gIFBBVEggPSAncGF0aCcgYXMgYW55LFxuICBPUkRFUiA9ICdvcmRlcicgYXMgYW55XG59XG5cbmV4cG9ydCBjb25zdCBYID0gQ2hhbm5lbC5YO1xuZXhwb3J0IGNvbnN0IFkgPSBDaGFubmVsLlk7XG5leHBvcnQgY29uc3QgUk9XID0gQ2hhbm5lbC5ST1c7XG5leHBvcnQgY29uc3QgQ09MVU1OID0gQ2hhbm5lbC5DT0xVTU47XG5leHBvcnQgY29uc3QgU0hBUEUgPSBDaGFubmVsLlNIQVBFO1xuZXhwb3J0IGNvbnN0IFNJWkUgPSBDaGFubmVsLlNJWkU7XG5leHBvcnQgY29uc3QgQ09MT1IgPSBDaGFubmVsLkNPTE9SO1xuZXhwb3J0IGNvbnN0IFRFWFQgPSBDaGFubmVsLlRFWFQ7XG5leHBvcnQgY29uc3QgREVUQUlMID0gQ2hhbm5lbC5ERVRBSUw7XG5leHBvcnQgY29uc3QgTEFCRUwgPSBDaGFubmVsLkxBQkVMO1xuZXhwb3J0IGNvbnN0IFBBVEggPSBDaGFubmVsLlBBVEg7XG5leHBvcnQgY29uc3QgT1JERVIgPSBDaGFubmVsLk9SREVSO1xuXG5leHBvcnQgY29uc3QgQ0hBTk5FTFMgPSBbWCwgWSwgUk9XLCBDT0xVTU4sIFNJWkUsIFNIQVBFLCBDT0xPUiwgUEFUSCwgT1JERVIsIFRFWFQsIERFVEFJTCwgTEFCRUxdO1xuXG5pbnRlcmZhY2UgU3VwcG9ydGVkTWFyayB7XG4gIHBvaW50PzogYm9vbGVhbjtcbiAgdGljaz86IGJvb2xlYW47XG4gIGNpcmNsZT86IGJvb2xlYW47XG4gIHNxdWFyZT86IGJvb2xlYW47XG4gIGJhcj86IGJvb2xlYW47XG4gIGxpbmU/OiBib29sZWFuO1xuICBhcmVhPzogYm9vbGVhbjtcbiAgdGV4dD86IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIGEgY2hhbm5lbCBzdXBwb3J0cyBhIHBhcnRpY3VsYXIgbWFyayB0eXBlLlxuICogQHBhcmFtIGNoYW5uZWwgIGNoYW5uZWwgbmFtZVxuICogQHBhcmFtIG1hcmsgdGhlIG1hcmsgdHlwZVxuICogQHJldHVybiB3aGV0aGVyIHRoZSBtYXJrIHN1cHBvcnRzIHRoZSBjaGFubmVsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdXBwb3J0TWFyayhjaGFubmVsOiBDaGFubmVsLCBtYXJrOiBNYXJrKSB7XG4gIHJldHVybiAhIWdldFN1cHBvcnRlZE1hcmsoY2hhbm5lbClbbWFya107XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZGljdGlvbmFyeSBzaG93aW5nIHdoZXRoZXIgYSBjaGFubmVsIHN1cHBvcnRzIG1hcmsgdHlwZS5cbiAqIEBwYXJhbSBjaGFubmVsXG4gKiBAcmV0dXJuIEEgZGljdGlvbmFyeSBtYXBwaW5nIG1hcmsgdHlwZXMgdG8gYm9vbGVhbiB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdXBwb3J0ZWRNYXJrKGNoYW5uZWw6IENoYW5uZWwpOiBTdXBwb3J0ZWRNYXJrIHtcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSBYOlxuICAgIGNhc2UgWTpcbiAgICBjYXNlIENPTE9SOlxuICAgIGNhc2UgREVUQUlMOlxuICAgIGNhc2UgT1JERVI6XG4gICAgY2FzZSBST1c6XG4gICAgY2FzZSBDT0xVTU46XG4gICAgICByZXR1cm4geyAvLyBhbGwgbWFya3NcbiAgICAgICAgcG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLFxuICAgICAgICBiYXI6IHRydWUsIGxpbmU6IHRydWUsIGFyZWE6IHRydWUsIHRleHQ6IHRydWVcbiAgICAgIH07XG4gICAgY2FzZSBTSVpFOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLFxuICAgICAgICBiYXI6IHRydWUsIHRleHQ6IHRydWVcbiAgICAgIH07XG4gICAgY2FzZSBTSEFQRTpcbiAgICAgIHJldHVybiB7cG9pbnQ6IHRydWV9O1xuICAgIGNhc2UgVEVYVDpcbiAgICAgIHJldHVybiB7dGV4dDogdHJ1ZX07XG4gICAgY2FzZSBQQVRIOlxuICAgICAgcmV0dXJuIHtsaW5lOiB0cnVlfTtcbiAgfVxuICByZXR1cm4ge307XG59XG5cbmludGVyZmFjZSBTdXBwb3J0ZWRSb2xlIHtcbiAgbWVhc3VyZTogYm9vbGVhbjtcbiAgZGltZW5zaW9uOiBib29sZWFuO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciBhIGNoYW5uZWwgc3VwcG9ydHMgZGltZW5zaW9uIC8gbWVhc3VyZSByb2xlXG4gKiBAcGFyYW0gIGNoYW5uZWxcbiAqIEByZXR1cm4gQSBkaWN0aW9uYXJ5IG1hcHBpbmcgcm9sZSB0byBib29sZWFuIHZhbHVlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN1cHBvcnRlZFJvbGUoY2hhbm5lbDogQ2hhbm5lbCk6IFN1cHBvcnRlZFJvbGUge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFg6XG4gICAgY2FzZSBZOlxuICAgIGNhc2UgQ09MT1I6XG4gICAgY2FzZSBMQUJFTDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lYXN1cmU6IHRydWUsXG4gICAgICAgIGRpbWVuc2lvbjogdHJ1ZVxuICAgICAgfTtcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTFVNTjpcbiAgICBjYXNlIFNIQVBFOlxuICAgIGNhc2UgREVUQUlMOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWVhc3VyZTogZmFsc2UsXG4gICAgICAgIGRpbWVuc2lvbjogdHJ1ZVxuICAgICAgfTtcbiAgICBjYXNlIFNJWkU6XG4gICAgY2FzZSBURVhUOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWVhc3VyZTogdHJ1ZSxcbiAgICAgICAgZGltZW5zaW9uOiBmYWxzZVxuICAgICAgfTtcbiAgICBjYXNlIFBBVEg6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZWFzdXJlOiBmYWxzZSxcbiAgICAgICAgZGltZW5zaW9uOiB0cnVlXG4gICAgICB9O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBlbmNvZGluZyBjaGFubmVsJyArIGNoYW5uZWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzU2NhbGUoY2hhbm5lbDogQ2hhbm5lbCkge1xuICByZXR1cm4gIWNvbnRhaW5zKFtERVRBSUwsIFBBVEgsIFRFWFQsIExBQkVMLCBPUkRFUl0sIGNoYW5uZWwpO1xufVxuIiwiaW1wb3J0IHtTcGVjfSBmcm9tICcuLi9zY2hlbWEvc2NoZW1hJztcbmltcG9ydCB7QXhpcywgYXhpcyBhcyBheGlzU2NoZW1hfSBmcm9tICcuLi9zY2hlbWEvYXhpcy5zY2hlbWEnO1xuaW1wb3J0IHtMZWdlbmQsIGxlZ2VuZCBhcyBsZWdlbmRTY2hlbWF9IGZyb20gJy4uL3NjaGVtYS9sZWdlbmQuc2NoZW1hJztcbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4uL3NjaGVtYS9lbmNvZGluZy5zY2hlbWEnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge2luc3RhbnRpYXRlfSBmcm9tICcuLi9zY2hlbWEvc2NoZW1hdXRpbCc7XG5pbXBvcnQgKiBhcyBzY2hlbWEgZnJvbSAnLi4vc2NoZW1hL3NjaGVtYSc7XG5pbXBvcnQgKiBhcyBzY2hlbWFVdGlsIGZyb20gJy4uL3NjaGVtYS9zY2hlbWF1dGlsJztcblxuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWSwgU0laRSwgVEVYVCwgUEFUSCwgT1JERVIsIENoYW5uZWwsIHN1cHBvcnRNYXJrfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7U09VUkNFLCBTVU1NQVJZfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCAqIGFzIHZsRmllbGREZWYgZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtGaWVsZFJlZk9wdGlvbn0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgdmxFbmNvZGluZyBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge01hcmssIEJBUiwgVElDSywgVEVYVCBhcyBURVhUTUFSS30gZnJvbSAnLi4vbWFyayc7XG5cbmltcG9ydCB7Z2V0RnVsbE5hbWUsIE5PTUlOQUwsIE9SRElOQUwsIFRFTVBPUkFMLCBRVUFOVElUQVRJVkV9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWlucywgZHVwbGljYXRlLCBleHRlbmR9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge2NvbXBpbGVNYXJrQ29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge2NvbXBpbGVMYXlvdXQsIExheW91dH0gZnJvbSAnLi9sYXlvdXQnO1xuaW1wb3J0IHtjb21waWxlU3RhY2tQcm9wZXJ0aWVzLCBTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHt0eXBlIGFzIHNjYWxlVHlwZX0gZnJvbSAnLi9zY2FsZSc7XG5cbi8qKlxuICogSW50ZXJuYWwgbW9kZWwgb2YgVmVnYS1MaXRlIHNwZWNpZmljYXRpb24gZm9yIHRoZSBjb21waWxlci5cbiAqL1xuZXhwb3J0IGNsYXNzIE1vZGVsIHtcbiAgcHJpdmF0ZSBfc3BlYzogU3BlYztcbiAgcHJpdmF0ZSBfc3RhY2s6IFN0YWNrUHJvcGVydGllcztcbiAgcHJpdmF0ZSBfbGF5b3V0OiBMYXlvdXQ7XG5cbiAgY29uc3RydWN0b3Ioc3BlYzogU3BlYykge1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xuICAgIHRoaXMuX3NwZWMgPSBzY2hlbWFVdGlsLm1lcmdlRGVlcChkZWZhdWx0cywgc3BlYyk7XG5cbiAgICB2bEVuY29kaW5nLmZvckVhY2godGhpcy5fc3BlYy5lbmNvZGluZywgZnVuY3Rpb24oZmllbGREZWY6IEZpZWxkRGVmLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBpZiAoIXN1cHBvcnRNYXJrKGNoYW5uZWwsIHRoaXMuX3NwZWMubWFyaykpIHtcbiAgICAgICAgLy8gRHJvcCB1bnN1cHBvcnRlZCBjaGFubmVsXG5cbiAgICAgICAgLy8gRklYTUUgY29uc29saWRhdGUgd2FybmluZyBtZXRob2RcbiAgICAgICAgY29uc29sZS53YXJuKGNoYW5uZWwsICdkcm9wcGVkIGFzIGl0IGlzIGluY29tcGF0aWJsZSB3aXRoJywgdGhpcy5fc3BlYy5tYXJrKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NwZWMuZW5jb2RpbmdbY2hhbm5lbF0uZmllbGQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWVsZERlZi50eXBlKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgc2hvcnQgdHlwZSB0byBmdWxsIHR5cGVcbiAgICAgICAgZmllbGREZWYudHlwZSA9IGdldEZ1bGxOYW1lKGZpZWxkRGVmLnR5cGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoKGNoYW5uZWwgPT09IFBBVEggfHwgY2hhbm5lbCA9PT0gT1JERVIpICYmICFmaWVsZERlZi5hZ2dyZWdhdGUgJiYgZmllbGREZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFKSB7XG4gICAgICAgIGZpZWxkRGVmLmFnZ3JlZ2F0ZSA9ICdtaW4nO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPIGluc3RhbnRpYXRlIGJpbiBoZXJlXG5cbiAgICAgIGlmIChmaWVsZERlZi5heGlzID09PSB0cnVlKSB7XG4gICAgICAgIGZpZWxkRGVmLmF4aXMgPSBpbnN0YW50aWF0ZShheGlzU2NoZW1hKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmLmxlZ2VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBmaWVsZERlZi5sZWdlbmQgPSBpbnN0YW50aWF0ZShsZWdlbmRTY2hlbWEpO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgZGVmYXVsdCBiYW5kV2lkdGggZm9yIFggYW5kIFlcbiAgICAgIGlmIChjaGFubmVsID09PSBYICYmIGZpZWxkRGVmLnNjYWxlLmJhbmRXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIHplcm8gZm9yIHRoZSBzYWtlIG9mIHRleHQgdGFibGUuXG4gICAgICAgIGZpZWxkRGVmLnNjYWxlLmJhbmRXaWR0aCA9IHRoaXMuaXNPcmRpbmFsU2NhbGUoWCkgJiYgdGhpcy5tYXJrKCkgPT09ICd0ZXh0JyA/XG4gICAgICAgICAgOTAgOiAvLyBUT0RPOiBjb25maWcuc2NhbGUudGV4dEJhbmRXaWR0aFxuICAgICAgICAgIDIxOyAvLyBUT0RPOiBjb25maWcuc2NhbGUuYmFuZFdpZHRoXG4gICAgICB9XG4gICAgICBpZiAoY2hhbm5lbCA9PT0gWSAmJiBmaWVsZERlZi5zY2FsZS5iYW5kV2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSB6ZXJvIGZvciB0aGUgc2FrZSBvZiB0ZXh0IHRhYmxlLlxuICAgICAgICBmaWVsZERlZi5zY2FsZS5iYW5kV2lkdGggPSAyMTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IGRlZmF1bHQgcGFkZGluZyBmb3IgUk9XIGFuZCBDT0xVTU5cbiAgICAgIGlmIChjaGFubmVsID09PSBST1cgJiYgZmllbGREZWYuc2NhbGUucGFkZGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIHplcm8gZm9yIHRoZSBzYWtlIG9mIHRleHQgdGFibGUuXG4gICAgICAgIGZpZWxkRGVmLnNjYWxlLnBhZGRpbmcgPSB0aGlzLmhhcyhZKSA/IDE2IDogMDtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFubmVsID09PSBDT0xVTU4gJiYgZmllbGREZWYuc2NhbGUucGFkZGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIHplcm8gZm9yIHRoZSBzYWtlIG9mIHRleHQgdGFibGUuXG4gICAgICAgIGZpZWxkRGVmLnNjYWxlLnBhZGRpbmcgPSB0aGlzLmhhcyhYKSA/IDE2IDogMDtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIGNhbGN1bGF0ZSBzdGFja1xuICAgIHRoaXMuX3N0YWNrID0gY29tcGlsZVN0YWNrUHJvcGVydGllcyh0aGlzLl9zcGVjKTtcbiAgICB0aGlzLl9zcGVjLmNvbmZpZy5tYXJrID0gY29tcGlsZU1hcmtDb25maWcodGhpcy5fc3BlYywgdGhpcy5fc3RhY2spO1xuICAgIHRoaXMuX2xheW91dCA9IGNvbXBpbGVMYXlvdXQodGhpcyk7XG5cbiAgfVxuXG4gIHB1YmxpYyBsYXlvdXQoKTogTGF5b3V0IHtcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0O1xuICB9XG5cbiAgcHVibGljIHN0YWNrKCk6IFN0YWNrUHJvcGVydGllcyB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YWNrO1xuICB9XG5cbiAgcHVibGljIHRvU3BlYyhleGNsdWRlQ29uZmlnPywgZXhjbHVkZURhdGE/KSB7XG4gICAgdmFyIGVuY29kaW5nID0gZHVwbGljYXRlKHRoaXMuX3NwZWMuZW5jb2RpbmcpLFxuICAgICAgc3BlYzogYW55O1xuXG4gICAgc3BlYyA9IHtcbiAgICAgIG1hcms6IHRoaXMuX3NwZWMubWFyayxcbiAgICAgIGVuY29kaW5nOiBlbmNvZGluZ1xuICAgIH07XG5cbiAgICBpZiAoIWV4Y2x1ZGVDb25maWcpIHtcbiAgICAgIHNwZWMuY29uZmlnID0gZHVwbGljYXRlKHRoaXMuX3NwZWMuY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZiAoIWV4Y2x1ZGVEYXRhKSB7XG4gICAgICBzcGVjLmRhdGEgPSBkdXBsaWNhdGUodGhpcy5fc3BlYy5kYXRhKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgZGVmYXVsdHNcbiAgICB2YXIgZGVmYXVsdHMgPSBzY2hlbWEuaW5zdGFudGlhdGUoKTtcbiAgICByZXR1cm4gc2NoZW1hVXRpbC5zdWJ0cmFjdChzcGVjLCBkZWZhdWx0cyk7XG4gIH1cblxuICBwdWJsaWMgbWFyaygpOiBNYXJrIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYy5tYXJrO1xuICB9XG5cbiAgcHVibGljIHNwZWMoKTogU3BlYyB7XG4gICAgcmV0dXJuIHRoaXMuX3NwZWM7XG4gIH1cblxuICBwdWJsaWMgaXMobWFyazogTWFyaykge1xuICAgIHJldHVybiB0aGlzLl9zcGVjLm1hcmsgPT09IG1hcms7XG4gIH1cblxuICBwdWJsaWMgaGFzKGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5oYXModGhpcy5fc3BlYy5lbmNvZGluZywgY2hhbm5lbCk7XG4gIH1cblxuICBwdWJsaWMgZmllbGREZWYoY2hhbm5lbDogQ2hhbm5lbCk6IEZpZWxkRGVmIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYy5lbmNvZGluZ1tjaGFubmVsXTtcbiAgfVxuXG4gIC8qKiBHZXQgXCJmaWVsZFwiIHJlZmVyZW5jZSBmb3IgdmVnYSAqL1xuICBwdWJsaWMgZmllbGQoY2hhbm5lbDogQ2hhbm5lbCwgb3B0OiBGaWVsZFJlZk9wdGlvbiA9IHt9KSB7XG4gICAgY29uc3QgZmllbGREZWYgPSB0aGlzLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgIGlmIChmaWVsZERlZi5iaW4pIHsgLy8gYmluIGhhcyBkZWZhdWx0IHN1ZmZpeCB0aGF0IGRlcGVuZHMgb24gc2NhbGVUeXBlXG4gICAgICBvcHQgPSBleHRlbmQoe1xuICAgICAgICBiaW5TdWZmaXg6IHNjYWxlVHlwZShmaWVsZERlZiwgY2hhbm5lbCwgdGhpcy5tYXJrKCkpID09PSAnb3JkaW5hbCcgPyAnX3JhbmdlJyA6ICdfc3RhcnQnXG4gICAgICB9LCBvcHQpO1xuICAgIH1cbiAgICByZXR1cm4gdmxGaWVsZERlZi5maWVsZChmaWVsZERlZiwgb3B0KTtcbiAgfVxuXG4gIHB1YmxpYyBmaWVsZFRpdGxlKGNoYW5uZWw6IENoYW5uZWwpOiBzdHJpbmcge1xuICAgIHJldHVybiB2bEZpZWxkRGVmLnRpdGxlKHRoaXMuX3NwZWMuZW5jb2RpbmdbY2hhbm5lbF0pO1xuICB9XG5cbiAgcHVibGljIGNoYW5uZWxzKCk6IENoYW5uZWxbXSB7XG4gICAgcmV0dXJuIHZsRW5jb2RpbmcuY2hhbm5lbHModGhpcy5fc3BlYy5lbmNvZGluZyk7XG4gIH1cblxuICBwdWJsaWMgbWFwKGY6IChmZDogRmllbGREZWYsIGM6IENoYW5uZWwsIGU6IEVuY29kaW5nKSA9PiBhbnksIHQ/OiBhbnkpIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5tYXAodGhpcy5fc3BlYy5lbmNvZGluZywgZiwgdCk7XG4gIH1cblxuICBwdWJsaWMgcmVkdWNlKGY6IChhY2M6IGFueSwgZmQ6IEZpZWxkRGVmLCBjOiBDaGFubmVsLCBlOiBFbmNvZGluZykgPT4gYW55LCBpbml0LCB0PzogYW55KSB7XG4gICAgcmV0dXJuIHZsRW5jb2RpbmcucmVkdWNlKHRoaXMuX3NwZWMuZW5jb2RpbmcsIGYsIGluaXQsIHQpO1xuICB9XG5cbiAgcHVibGljIGZvckVhY2goZjogKGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgaTpudW1iZXIpID0+IHZvaWQsIHQ/OiBhbnkpIHtcbiAgICB2bEVuY29kaW5nLmZvckVhY2godGhpcy5fc3BlYy5lbmNvZGluZywgZiwgdCk7XG4gIH1cblxuICBwdWJsaWMgaXNPcmRpbmFsU2NhbGUoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5maWVsZERlZihjaGFubmVsKTtcbiAgICByZXR1cm4gZmllbGREZWYgJiYgKFxuICAgICAgY29udGFpbnMoW05PTUlOQUwsIE9SRElOQUxdLCBmaWVsZERlZi50eXBlKSB8fFxuICAgICAgKCBmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJiBzY2FsZVR5cGUoZmllbGREZWYsIGNoYW5uZWwsIHRoaXMubWFyaygpKSA9PT0gJ29yZGluYWwnIClcbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgaXNEaW1lbnNpb24oY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiB2bEZpZWxkRGVmLmlzRGltZW5zaW9uKHRoaXMuZmllbGREZWYoY2hhbm5lbCkpO1xuICB9XG5cbiAgcHVibGljIGlzTWVhc3VyZShjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIHZsRmllbGREZWYuaXNNZWFzdXJlKHRoaXMuZmllbGREZWYoY2hhbm5lbCkpO1xuICB9XG5cbiAgcHVibGljIGlzQWdncmVnYXRlKCkge1xuICAgIHJldHVybiB2bEVuY29kaW5nLmlzQWdncmVnYXRlKHRoaXMuX3NwZWMuZW5jb2RpbmcpO1xuICB9XG5cbiAgcHVibGljIGlzRmFjZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKFJPVykgfHwgdGhpcy5oYXMoQ09MVU1OKTtcbiAgfVxuXG4gIHB1YmxpYyBkYXRhVGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBZ2dyZWdhdGUoKSA/IFNVTU1BUlkgOiBTT1VSQ0U7XG4gIH1cblxuICBwdWJsaWMgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYy5kYXRhO1xuICB9XG5cbiAgcHVibGljIHRyYW5zZm9ybSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYy50cmFuc2Zvcm07XG4gIH1cblxuICAvKiogcmV0dXJucyB3aGV0aGVyIHRoZSBlbmNvZGluZyBoYXMgdmFsdWVzIGVtYmVkZGVkICovXG4gIHB1YmxpYyBoYXNWYWx1ZXMoKSB7XG4gICAgdmFyIHZhbHMgPSB0aGlzLmRhdGEoKS52YWx1ZXM7XG4gICAgcmV0dXJuIHZhbHMgJiYgdmFscy5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzcGVjIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwdWJsaWMgY29uZmlnKCkge1xuICAgIHJldHVybiB0aGlzLl9zcGVjLmNvbmZpZztcbiAgfVxuXG4gIHB1YmxpYyBheGlzKGNoYW5uZWw6IENoYW5uZWwpOiBBeGlzIHtcbiAgICBjb25zdCBheGlzID0gdGhpcy5maWVsZERlZihjaGFubmVsKS5heGlzO1xuXG4gICAgLy8gVGhpcyBsaW5lIHNob3VsZCBhY3R1YWxseSBhbHdheXMgcmV0dXJuIGF4aXMgb2JqZWN0IHNpbmNlIHdlIGFscmVhZHlcbiAgICAvLyByZXBsYWNlIGJvb2xlYW4gYXhpcyB3aXRoIHByb3BlcnRpZXMuXG4gICAgcmV0dXJuIHR5cGVvZiBheGlzICE9PSAnYm9vbGVhbicgPyBheGlzIDoge307XG4gIH1cblxuICBwdWJsaWMgbGVnZW5kKGNoYW5uZWw6IENoYW5uZWwpOiBMZWdlbmQge1xuICAgIGNvbnN0IGxlZ2VuZCA9IHRoaXMuZmllbGREZWYoY2hhbm5lbCkubGVnZW5kO1xuXG4gICAgLy8gVGhpcyBsaW5lIHNob3VsZCBhY3R1YWxseSBhbHdheXMgcmV0dXJuIGxlZ2VuZCBvYmplY3Qgc2luY2Ugd2UgYWxyZWFkeVxuICAgIC8vIHJlcGxhY2UgYm9vbGVhbiBsZWdlbmQgd2l0aCBwcm9wZXJ0aWVzLlxuICAgIHJldHVybiB0eXBlb2YgbGVnZW5kICE9PSAnYm9vbGVhbicgPyBsZWdlbmQgOiB7fTtcbiAgfVxuXG4gIC8qKiByZXR1cm5zIHNjYWxlIG5hbWUgZm9yIGEgZ2l2ZW4gY2hhbm5lbCAqL1xuICBwdWJsaWMgc2NhbGVOYW1lKGNoYW5uZWw6IENoYW5uZWwpOiBzdHJpbmcge1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLnNwZWMoKS5uYW1lO1xuICAgIHJldHVybiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyBjaGFubmVsO1xuICB9XG5cbiAgcHVibGljIHNpemVWYWx1ZShjaGFubmVsOiBDaGFubmVsID0gU0laRSkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5maWVsZERlZihTSVpFKS52YWx1ZTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLm1hcmsoKSkge1xuICAgICAgY2FzZSBURVhUTUFSSzpcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnKCkubWFyay5mb250U2l6ZTsgLy8gZm9udCBzaXplIDEwIGJ5IGRlZmF1bHRcbiAgICAgIGNhc2UgQkFSOlxuICAgICAgICBpZiAodGhpcy5jb25maWcoKS5tYXJrLmJhcldpZHRoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnKCkubWFyay5iYXJXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICAvLyBCQVIncyBzaXplIGlzIGFwcGxpZWQgb24gZWl0aGVyIFggb3IgWVxuICAgICAgICByZXR1cm4gdGhpcy5pc09yZGluYWxTY2FsZShjaGFubmVsKSA/XG4gICAgICAgICAgICAvLyBGb3Igb3JkaW5hbCBzY2FsZSBvciBzaW5nbGUgYmFyLCB3ZSBjYW4gdXNlIGJhbmRXaWR0aCAtIDFcbiAgICAgICAgICAgIC8vICgtMSBzbyB0aGF0IHRoZSBib3JkZXIgb2YgdGhlIGJhciBmYWxscyBvbiBleGFjdCBwaXhlbClcbiAgICAgICAgICAgIHRoaXMuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUuYmFuZFdpZHRoIC0gMSA6XG4gICAgICAgICAgIXRoaXMuaGFzKGNoYW5uZWwpID9cbiAgICAgICAgICAgIDIxIDogLyogY29uZmlnLnNjYWxlLmJhbmRXaWR0aCAqL1xuICAgICAgICAgICAgMjsgLy8gb3RoZXJ3aXNlLCBzZXQgdG8gMiBieSBkZWZhdWx0XG4gICAgICBjYXNlIFRJQ0s6XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZygpLm1hcmsudGlja1dpZHRoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnKCkubWFyay50aWNrV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmFuZFdpZHRoID0gdGhpcy5oYXMoY2hhbm5lbCkgP1xuICAgICAgICAgIHRoaXMuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUuYmFuZFdpZHRoIDpcbiAgICAgICAgICAyMTsgLyogY29uZmlnLnNjYWxlLmJhbmRXaWR0aCAqL1xuICAgICAgICByZXR1cm4gYmFuZFdpZHRoIC8gMS41O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb25maWcoKS5tYXJrLnNpemU7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtjb250YWlucywgZXh0ZW5kLCB0cnVuY2F0ZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge05PTUlOQUwsIE9SRElOQUwsIFRFTVBPUkFMfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFksIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtmb3JtYXRNaXhpbnN9IGZyb20gJy4vdXRpbCc7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9ibG9iL21hc3Rlci9kb2Mvc3BlYy5tZCMxMS1hbWJpZW50LWRlY2xhcmF0aW9uc1xuZGVjbGFyZSBsZXQgZXhwb3J0cztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVBeGlzKGNoYW5uZWw6IENoYW5uZWwsIG1vZGVsOiBNb2RlbCkge1xuICBjb25zdCBpc0NvbCA9IGNoYW5uZWwgPT09IENPTFVNTixcbiAgICBpc1JvdyA9IGNoYW5uZWwgPT09IFJPVyxcbiAgICB0eXBlID0gaXNDb2wgPyAneCcgOiBpc1JvdyA/ICd5JzogY2hhbm5lbDtcblxuICAvLyBUT0RPOiByZXBsYWNlIGFueSB3aXRoIFZlZ2EgQXhpcyBJbnRlcmZhY2VcbiAgbGV0IGRlZjogYW55ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKVxuICB9O1xuXG4gIC8vIGZvcm1hdCBtaXhpbnMgKGFkZCBmb3JtYXQgYW5kIGZvcm1hdFR5cGUpXG4gIGV4dGVuZChkZWYsIGZvcm1hdE1peGlucyhtb2RlbCwgY2hhbm5lbCwgbW9kZWwuYXhpcyhjaGFubmVsKS5mb3JtYXQpKTtcblxuICAvLyAxLjIuIEFkZCBwcm9wZXJ0aWVzXG4gIFtcbiAgICAvLyBhKSBwcm9wZXJ0aWVzIHdpdGggc3BlY2lhbCBydWxlcyAoc28gaXQgaGFzIGF4aXNbcHJvcGVydHldIG1ldGhvZHMpIC0tIGNhbGwgcnVsZSBmdW5jdGlvbnNcbiAgICAnZ3JpZCcsICdsYXllcicsICdvcmllbnQnLCAndGlja1NpemUnLCAndGlja3MnLCAndGl0bGUnLFxuICAgIC8vIGIpIHByb3BlcnRpZXMgd2l0aG91dCBydWxlcywgb25seSBwcm9kdWNlIGRlZmF1bHQgdmFsdWVzIGluIHRoZSBzY2hlbWEsIG9yIGV4cGxpY2l0IHZhbHVlIGlmIHNwZWNpZmllZFxuICAgICdvZmZzZXQnLCAndGlja1BhZGRpbmcnLCAndGlja1NpemUnLCAndGlja1NpemVNYWpvcicsICd0aWNrU2l6ZU1pbm9yJywgJ3RpY2tTaXplRW5kJyxcbiAgICAndGl0bGVPZmZzZXQnLCAndmFsdWVzJywgJ3N1YmRpdmlkZSdcbiAgXS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgbGV0IG1ldGhvZDogKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgZGVmOmFueSk9PmFueTtcblxuICAgIGNvbnN0IHZhbHVlID0gKG1ldGhvZCA9IGV4cG9ydHNbcHJvcGVydHldKSA/XG4gICAgICAgICAgICAgICAgICAvLyBjYWxsaW5nIGF4aXMuZm9ybWF0LCBheGlzLmdyaWQsIC4uLlxuICAgICAgICAgICAgICAgICAgbWV0aG9kKG1vZGVsLCBjaGFubmVsLCBkZWYpIDpcbiAgICAgICAgICAgICAgICAgIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmF4aXNbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWZbcHJvcGVydHldID0gdmFsdWU7XG4gICAgfVxuICB9KTtcblxuICAvLyAyKSBBZGQgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9uIGdyb3Vwc1xuICBjb25zdCBwcm9wcyA9IG1vZGVsLmF4aXMoY2hhbm5lbCkucHJvcGVydGllcyB8fCB7fTtcblxuICBbXG4gICAgJ2F4aXMnLCAnbGFiZWxzJywgLy8gaGF2ZSBzcGVjaWFsIHJ1bGVzXG4gICAgJ2dyaWQnLCAndGl0bGUnLCAndGlja3MnLCAnbWFqb3JUaWNrcycsICdtaW5vclRpY2tzJyAvLyBvbmx5IGRlZmF1bHQgdmFsdWVzXG4gIF0uZm9yRWFjaChmdW5jdGlvbihncm91cCkge1xuICAgIGNvbnN0IHZhbHVlID0gcHJvcGVydGllc1tncm91cF0gP1xuICAgICAgcHJvcGVydGllc1tncm91cF0obW9kZWwsIGNoYW5uZWwsIHByb3BzW2dyb3VwXSwgZGVmKSA6XG4gICAgICBwcm9wc1tncm91cF07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlZi5wcm9wZXJ0aWVzID0gZGVmLnByb3BlcnRpZXMgfHwge307XG4gICAgICBkZWYucHJvcGVydGllc1tncm91cF0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBncmlkKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICBpZiAoY2hhbm5lbCA9PT0gUk9XIHx8IGNoYW5uZWwgPT09IENPTFVNTikge1xuICAgIC8vIG5ldmVyIGFwcGx5IGdyaWQgZm9yIFJPVyBhbmQgQ09MVU1OIHNpbmNlIHdlIG1hbnVhbGx5IGNyZWF0ZSBydWxlLWdyb3VwIGZvciB0aGVtXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGdyaWQgPSBtb2RlbC5heGlzKGNoYW5uZWwpLmdyaWQ7XG4gIGlmIChncmlkICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZ3JpZDtcbiAgfVxuXG4gIC8vIElmIGBncmlkYCBpcyB1bnNwZWNpZmllZCwgdGhlIGRlZmF1bHQgdmFsdWUgaXMgYHRydWVgIGZvciBvcmRpbmFsIHNjYWxlc1xuICAvLyB0aGF0IGFyZSBub3QgYmlubmVkXG4gIHJldHVybiAhbW9kZWwuaXNPcmRpbmFsU2NhbGUoY2hhbm5lbCkgJiYgIWZpZWxkRGVmLmJpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheWVyKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgZGVmKSB7XG4gIGNvbnN0IGxheWVyID0gbW9kZWwuYXhpcyhjaGFubmVsKS5sYXllcjtcbiAgaWYgKGxheWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbGF5ZXI7XG4gIH1cbiAgaWYgKGRlZi5ncmlkKSB7XG4gICAgLy8gaWYgZ3JpZCBpcyB0cnVlLCBuZWVkIHRvIHB1dCBsYXllciBvbiB0aGUgYmFjayBzbyB0aGF0IGdyaWQgaXMgYmVoaW5kIG1hcmtzXG4gICAgcmV0dXJuICdiYWNrJztcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkOyAvLyBvdGhlcndpc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgdXNlIFZlZ2EncyBkZWZhdWx0LlxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9yaWVudChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgY29uc3Qgb3JpZW50ID0gbW9kZWwuYXhpcyhjaGFubmVsKS5vcmllbnQ7XG4gIGlmIChvcmllbnQpIHtcbiAgICByZXR1cm4gb3JpZW50O1xuICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IENPTFVNTikge1xuICAgIC8vIEZJWE1FIHRlc3QgYW5kIGRlY2lkZVxuICAgIHJldHVybiAndG9wJztcbiAgfSBlbHNlIGlmIChjaGFubmVsID09PSBST1cpIHtcbiAgICBpZiAobW9kZWwuaGFzKFkpICYmIG1vZGVsLmF4aXMoWSkub3JpZW50ICE9PSAncmlnaHQnKSB7XG4gICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2tzKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBjb25zdCB0aWNrcyA9IG1vZGVsLmF4aXMoY2hhbm5lbCkudGlja3M7XG4gIGlmICh0aWNrcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHRpY2tzO1xuICB9XG5cbiAgLy8gRklYTUUgZGVwZW5kcyBvbiBzY2FsZSB0eXBlIHRvb1xuICBpZiAoY2hhbm5lbCA9PT0gWCAmJiAhbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuYmluKSB7XG4gICAgLy8gVmVnYSdzIGRlZmF1bHQgdGlja3Mgb2Z0ZW4gbGVhZCB0byBhIGxvdCBvZiBsYWJlbCBvY2NsdXNpb24gb24gWCB3aXRob3V0IDkwIGRlZ3JlZSByb3RhdGlvblxuICAgIHJldHVybiA1O1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2tTaXplKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBjb25zdCB0aWNrU2l6ZSA9IG1vZGVsLmF4aXMoY2hhbm5lbCkudGlja1NpemU7XG4gIGlmICh0aWNrU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHRpY2tTaXplO1xuICB9XG4gIGlmIChjaGFubmVsID09PSBST1cgfHwgY2hhbm5lbCA9PT0gQ09MVU1OKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGNvbnN0IGF4aXMgPSBtb2RlbC5heGlzKGNoYW5uZWwpO1xuICBpZiAoYXhpcy50aXRsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGF4aXMudGl0bGU7XG4gIH1cblxuICAvLyBpZiBub3QgZGVmaW5lZCwgYXV0b21hdGljYWxseSBkZXRlcm1pbmUgYXhpcyB0aXRsZSBmcm9tIGZpZWxkIGRlZlxuICBjb25zdCBmaWVsZFRpdGxlID0gbW9kZWwuZmllbGRUaXRsZShjaGFubmVsKTtcbiAgY29uc3QgbGF5b3V0ID0gbW9kZWwubGF5b3V0KCk7XG4gIGNvbnN0IGNlbGxXaWR0aCA9IGxheW91dC5jZWxsV2lkdGg7XG4gIGNvbnN0IGNlbGxIZWlnaHQgPSBsYXlvdXQuY2VsbEhlaWdodDtcblxuICBsZXQgbWF4TGVuZ3RoO1xuICBpZiAoYXhpcy50aXRsZU1heExlbmd0aCkge1xuICAgIG1heExlbmd0aCA9IGF4aXMudGl0bGVNYXhMZW5ndGg7XG4gIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gWCAmJiB0eXBlb2YgY2VsbFdpZHRoID09PSAnbnVtYmVyJykge1xuICAgIC8vIEd1ZXNzIG1heCBsZW5ndGggaWYgd2Uga25vdyBjZWxsIHNpemUgYXQgY29tcGlsZSB0aW1lXG4gICAgbWF4TGVuZ3RoID0gY2VsbFdpZHRoIC8gbW9kZWwuYXhpcyhYKS5jaGFyYWN0ZXJXaWR0aDtcbiAgfSBlbHNlIGlmIChjaGFubmVsID09PSBZICYmIHR5cGVvZiBjZWxsSGVpZ2h0ID09PSAnbnVtYmVyJykge1xuICAgIC8vIEd1ZXNzIG1heCBsZW5ndGggaWYgd2Uga25vdyBjZWxsIHNpemUgYXQgY29tcGlsZSB0aW1lXG4gICAgbWF4TGVuZ3RoID0gY2VsbEhlaWdodCAvIG1vZGVsLmF4aXMoWSkuY2hhcmFjdGVyV2lkdGg7XG4gIH1cbiAgLy8gRklYTUU6IHdlIHNob3VsZCB1c2UgdGVtcGxhdGUgdG8gdHJ1bmNhdGUgaW5zdGVhZFxuICByZXR1cm4gbWF4TGVuZ3RoID8gdHJ1bmNhdGUoZmllbGRUaXRsZSwgbWF4TGVuZ3RoKSA6IGZpZWxkVGl0bGU7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgcHJvcGVydGllcyB7XG4gIGV4cG9ydCBmdW5jdGlvbiBheGlzKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgYXhpc1Byb3BzU3BlYykge1xuICAgIGlmIChjaGFubmVsID09PSBST1cgfHwgY2hhbm5lbCA9PT0gQ09MVU1OKSB7XG4gICAgICAvLyBoaWRlIGF4aXMgZm9yIGZhY2V0c1xuICAgICAgcmV0dXJuIGV4dGVuZCh7XG4gICAgICAgIG9wYWNpdHk6IHt2YWx1ZTogMH1cbiAgICAgIH0sIGF4aXNQcm9wc1NwZWMgfHwge30pO1xuICAgIH1cbiAgICByZXR1cm4gYXhpc1Byb3BzU3BlYyB8fCB1bmRlZmluZWQ7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbGFiZWxzKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgbGFiZWxzU3BlYywgZGVmKSB7XG4gICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgICBjb25zdCBheGlzID0gbW9kZWwuYXhpcyhjaGFubmVsKTtcblxuICAgIGlmICghYXhpcy5sYWJlbHMpIHtcbiAgICAgIHJldHVybiBleHRlbmQoe1xuICAgICAgICB0ZXh0OiAnJ1xuICAgICAgfSwgbGFiZWxzU3BlYyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRhaW5zKFtOT01JTkFMLCBPUkRJTkFMXSwgZmllbGREZWYudHlwZSkgJiYgYXhpcy5sYWJlbE1heExlbmd0aCkge1xuICAgICAgLy8gVE9ETyByZXBsYWNlIHRoaXMgd2l0aCBWZWdhJ3MgbGFiZWxNYXhMZW5ndGggb25jZSBpdCBpcyBpbnRyb2R1Y2VkXG4gICAgICBsYWJlbHNTcGVjID0gZXh0ZW5kKHtcbiAgICAgICAgdGV4dDoge1xuICAgICAgICAgIHRlbXBsYXRlOiAne3sgZGF0dW0uZGF0YSB8IHRydW5jYXRlOicgKyBheGlzLmxhYmVsTWF4TGVuZ3RoICsgJ319J1xuICAgICAgICB9XG4gICAgICB9LCBsYWJlbHNTcGVjIHx8IHt9KTtcbiAgICB9XG5cbiAgICAgLy8gZm9yIHgtYXhpcywgc2V0IHRpY2tzIGZvciBRIG9yIHJvdGF0ZSBzY2FsZSBmb3Igb3JkaW5hbCBzY2FsZVxuICAgIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgICAgY2FzZSBYOlxuICAgICAgICBpZiAobW9kZWwuaXNEaW1lbnNpb24oWCkgfHwgZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICAgICAgICBsYWJlbHNTcGVjID0gZXh0ZW5kKHtcbiAgICAgICAgICAgIGFuZ2xlOiB7dmFsdWU6IDI3MH0sXG4gICAgICAgICAgICBhbGlnbjoge3ZhbHVlOiBkZWYub3JpZW50ID09PSAndG9wJyA/ICdsZWZ0JzogJ3JpZ2h0J30sXG4gICAgICAgICAgICBiYXNlbGluZToge3ZhbHVlOiAnbWlkZGxlJ31cbiAgICAgICAgICB9LCBsYWJlbHNTcGVjIHx8IHt9KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUk9XOlxuICAgICAgICBpZiAoZGVmLm9yaWVudCA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgIGxhYmVsc1NwZWMgPSBleHRlbmQoe1xuICAgICAgICAgICAgYW5nbGU6IHt2YWx1ZTogOTB9LFxuICAgICAgICAgICAgYWxpZ246IHt2YWx1ZTogJ2NlbnRlcid9LFxuICAgICAgICAgICAgYmFzZWxpbmU6IHt2YWx1ZTogJ2JvdHRvbSd9XG4gICAgICAgICAgfSwgbGFiZWxzU3BlYyB8fCB7fSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbGFiZWxzU3BlYyB8fCB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsIi8qKlxuICogTW9kdWxlIGZvciBjb21waWxpbmcgVmVnYS1saXRlIHNwZWMgaW50byBWZWdhIHNwZWMuXG4gKi9cbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuXG5pbXBvcnQge2NvbXBpbGVBeGlzfSBmcm9tICcuL2F4aXMnO1xuaW1wb3J0IHtjb21waWxlRGF0YX0gZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7ZmFjZXRNaXhpbnN9IGZyb20gJy4vZmFjZXQnO1xuaW1wb3J0IHtjb21waWxlTGVnZW5kc30gZnJvbSAnLi9sZWdlbmQnO1xuaW1wb3J0IHtjb21waWxlTWFya30gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7Y29tcGlsZVNjYWxlc30gZnJvbSAnLi9zY2FsZSc7XG5pbXBvcnQge2V4dGVuZCwga2V5c30gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7TEFZT1VUfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFl9IGZyb20gJy4uL2NoYW5uZWwnO1xuXG5leHBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUoc3BlYykge1xuICBjb25zdCBtb2RlbCA9IG5ldyBNb2RlbChzcGVjKTtcbiAgY29uc3QgbGF5b3V0ID0gbW9kZWwubGF5b3V0KCk7XG5cbiAgLy8gRklYTUUgcmVwbGFjZSBGSVQgd2l0aCBhcHByb3ByaWF0ZSBtZWNoYW5pc20gb25jZSBWZWdhIGhhcyBpdFxuICBjb25zdCBGSVQgPSAxO1xuXG4gIGNvbnN0IGNvbmZpZyA9IG1vZGVsLmNvbmZpZygpO1xuXG4gIC8vIFRPRE86IGNoYW5nZSB0eXBlIHRvIGJlY29tZSBWZ1NwZWNcbiAgY29uc3Qgb3V0cHV0ID0gZXh0ZW5kKFxuICAgIHNwZWMubmFtZSA/IHsgbmFtZTogc3BlYy5uYW1lIH0gOiB7fSxcbiAgICB7XG4gICAgICB3aWR0aDogdHlwZW9mIGxheW91dC53aWR0aCAhPT0gJ251bWJlcicgPyBGSVQgOiBsYXlvdXQud2lkdGgsXG4gICAgICBoZWlnaHQ6IHR5cGVvZiBsYXlvdXQuaGVpZ2h0ICE9PSAnbnVtYmVyJyA/IEZJVCA6IGxheW91dC5oZWlnaHQsXG4gICAgICBwYWRkaW5nOiAnYXV0bydcbiAgICB9LFxuICAgIGNvbmZpZy52aWV3cG9ydCA/IHsgdmlld3BvcnQ6IGNvbmZpZy52aWV3cG9ydCB9IDoge30sXG4gICAgY29uZmlnLmJhY2tncm91bmQgPyB7IGJhY2tncm91bmQ6IGNvbmZpZy5iYWNrZ3JvdW5kIH0gOiB7fSxcbiAgICBrZXlzKGNvbmZpZy5zY2VuZSkubGVuZ3RoID4gMCA/IHNjZW5lKGNvbmZpZykgOiB7fSxcbiAgICB7XG4gICAgICBkYXRhOiBjb21waWxlRGF0YShtb2RlbCksXG4gICAgICBtYXJrczogW2NvbXBpbGVSb290R3JvdXAobW9kZWwpXVxuICAgIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3BlYzogb3V0cHV0XG4gICAgLy8gVE9ETzogYWRkIHdhcm5pbmcgLyBlcnJvcnMgaGVyZVxuICB9O1xufVxuXG5mdW5jdGlvbiBzY2VuZShjb25maWcpIHtcbiAgcmV0dXJuIFsnZmlsbCcsICdmaWxsT3BhY2l0eScsICdzdHJva2UnLCAnc3Ryb2tlV2lkdGgnLFxuICAgICdzdHJva2VPcGFjaXR5JywgJ3N0cm9rZURhc2gnLCAnc3Ryb2tlRGFzaE9mZnNldCddLlxuICAgICAgcmVkdWNlKGZ1bmN0aW9uKHRvcExldmVsQ29uZmlnOiBhbnksIHByb3BlcnR5KSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbmZpZy5zY2VuZVtwcm9wZXJ0eV07XG4gICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0b3BMZXZlbENvbmZpZy5zY2VuZSA9IHRvcExldmVsQ29uZmlnLnNjZW5lIHx8IHt9O1xuICAgICAgICB0b3BMZXZlbENvbmZpZy5zY2VuZVtwcm9wZXJ0eV0gPSB7dmFsdWU6IHZhbHVlfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b3BMZXZlbENvbmZpZztcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVJvb3RHcm91cChtb2RlbDogTW9kZWwpIHtcbiAgY29uc3Qgc3BlYyA9IG1vZGVsLnNwZWMoKTtcbiAgY29uc3Qgd2lkdGggPSBtb2RlbC5sYXlvdXQoKS53aWR0aDtcbiAgY29uc3QgaGVpZ2h0ID0gbW9kZWwubGF5b3V0KCkuaGVpZ2h0O1xuXG4gIGxldCByb290R3JvdXA6YW55ID0gZXh0ZW5kKHtcbiAgICAgIG5hbWU6IHNwZWMubmFtZSA/IHNwZWMubmFtZSArICctcm9vdCcgOiAncm9vdCcsXG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIH0sXG4gICAgc3BlYy5kZXNjcmlwdGlvbiA/IHtkZXNjcmlwdGlvbjogc3BlYy5kZXNjcmlwdGlvbn0gOiB7fSxcbiAgICB7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiB0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInID9cbiAgICAgICAgICAgICAgICAge2ZpZWxkOiB3aWR0aC5maWVsZH0gOlxuICAgICAgICAgICAgICAgICB7dmFsdWU6IHdpZHRofSxcbiAgICAgICAgICBoZWlnaHQ6IHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInID9cbiAgICAgICAgICAgICAgICAgIHtmaWVsZDogaGVpZ2h0LmZpZWxkfSA6XG4gICAgICAgICAgICAgICAgICB7dmFsdWU6IGhlaWdodH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gIC8vIG9ubHkgYWRkIHJlZmVyZW5jZSB0byBsYXlvdXQgaWYgbmVlZGVkXG4gIGlmICh0eXBlb2Ygd2lkdGggIT09ICdudW1iZXInIHx8IHR5cGVvZiBoZWlnaHQgIT09ICdudW1iZXInKSB7XG4gICAgcm9vdEdyb3VwID0gZXh0ZW5kKHJvb3RHcm91cCwge1xuICAgICAgZnJvbToge2RhdGE6IExBWU9VVH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IG1hcmtzID0gY29tcGlsZU1hcmsobW9kZWwpO1xuXG4gIC8vIFNtYWxsIE11bHRpcGxlc1xuICBpZiAobW9kZWwuaGFzKFJPVykgfHwgbW9kZWwuaGFzKENPTFVNTikpIHtcbiAgICAvLyBwdXQgdGhlIG1hcmtzIGluc2lkZSBhIGZhY2V0IGNlbGwncyBncm91cFxuICAgIGV4dGVuZChyb290R3JvdXAsIGZhY2V0TWl4aW5zKG1vZGVsLCBtYXJrcykpO1xuICB9IGVsc2Uge1xuICAgIHJvb3RHcm91cC5tYXJrcyA9IG1hcmtzO1xuICAgIHJvb3RHcm91cC5zY2FsZXMgPSBjb21waWxlU2NhbGVzKG1vZGVsLmNoYW5uZWxzKCksIG1vZGVsKTtcblxuICAgIHZhciBheGVzID0gKG1vZGVsLmhhcyhYKSAmJiBtb2RlbC5maWVsZERlZihYKS5heGlzID8gW2NvbXBpbGVBeGlzKFgsIG1vZGVsKV0gOiBbXSlcbiAgICAgIC5jb25jYXQobW9kZWwuaGFzKFkpICYmIG1vZGVsLmZpZWxkRGVmKFkpLmF4aXMgPyBbY29tcGlsZUF4aXMoWSwgbW9kZWwpXSA6IFtdKTtcbiAgICBpZiAoYXhlcy5sZW5ndGggPiAwKSB7XG4gICAgICByb290R3JvdXAuYXhlcyA9IGF4ZXM7XG4gICAgfVxuICB9XG5cbiAgLy8gbGVnZW5kcyAoc2ltaWxhciBmb3IgZWl0aGVyIGZhY2V0cyBvciBub24tZmFjZXRzXG4gIHZhciBsZWdlbmRzID0gY29tcGlsZUxlZ2VuZHMobW9kZWwpO1xuICBpZiAobGVnZW5kcy5sZW5ndGggPiAwKSB7XG4gICAgcm9vdEdyb3VwLmxlZ2VuZHMgPSBsZWdlbmRzO1xuICB9XG4gIHJldHVybiByb290R3JvdXA7XG59XG4iLCJpbXBvcnQge1NwZWN9IGZyb20gJy4uL3NjaGVtYS9zY2hlbWEnO1xuaW1wb3J0IHtTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4vc3RhY2snO1xuXG5pbXBvcnQge1gsIFksIERFVEFJTH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2lzQWdncmVnYXRlLCBoYXN9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7aXNNZWFzdXJlfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge1BPSU5ULCBUSUNLLCBDSVJDTEUsIFNRVUFSRX0gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge2NvbnRhaW5zLCBleHRlbmR9IGZyb20gJy4uL3V0aWwnO1xuXG4vKipcbiAqIEF1Z21lbnQgY29uZmlnLm1hcmsgd2l0aCBydWxlLWJhc2VkIGRlZmF1bHQgdmFsdWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZU1hcmtDb25maWcoc3BlYzogU3BlYywgc3RhY2s6IFN0YWNrUHJvcGVydGllcykge1xuICAgcmV0dXJuIGV4dGVuZChcbiAgICAgWydmaWxsZWQnLCAnb3BhY2l0eScsICdvcmllbnQnLCAnYWxpZ24nXS5yZWR1Y2UoZnVuY3Rpb24oY2ZnLCBwcm9wZXJ0eTogc3RyaW5nKSB7XG4gICAgICAgY29uc3QgdmFsdWUgPSBzcGVjLmNvbmZpZy5tYXJrW3Byb3BlcnR5XTtcbiAgICAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgICAgICBjYXNlICdmaWxsZWQnOlxuICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgIC8vIG9ubHkgcG9pbnQgaXMgbm90IGZpbGxlZCBieSBkZWZhdWx0XG4gICAgICAgICAgICAgY2ZnW3Byb3BlcnR5XSA9IHNwZWMubWFyayAhPT0gUE9JTlQ7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgY29udGFpbnMoW1BPSU5ULCBUSUNLLCBDSVJDTEUsIFNRVUFSRV0sIHNwZWMubWFyaykpIHtcbiAgICAgICAgICAgICAvLyBwb2ludC1iYXNlZCBtYXJrcyBhbmQgYmFyXG4gICAgICAgICAgICAgaWYgKCFpc0FnZ3JlZ2F0ZShzcGVjLmVuY29kaW5nKSB8fCBoYXMoc3BlYy5lbmNvZGluZywgREVUQUlMKSkge1xuICAgICAgICAgICAgICAgY2ZnW3Byb3BlcnR5XSA9IDAuNztcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICBjYXNlICdvcmllbnQnOlxuICAgICAgICAgICBpZiAoc3RhY2spIHtcbiAgICAgICAgICAgICAvLyBGb3Igc3RhY2tlZCBjaGFydCwgZXhwbGljaXRseSBzcGVjaWZpZWQgb3JpZW50IHByb3BlcnR5IHdpbGwgYmUgaWdub3JlZC5cbiAgICAgICAgICAgICBjZmdbcHJvcGVydHldID0gc3RhY2suZ3JvdXBieUNoYW5uZWwgPT09IFkgPyAnaG9yaXpvbnRhbCcgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICBjZmdbcHJvcGVydHldID0gaXNNZWFzdXJlKHNwZWMuZW5jb2RpbmdbWF0pICYmICAhaXNNZWFzdXJlKHNwZWMuZW5jb2RpbmdbWV0pID9cbiAgICAgICAgICAgICAgIC8vIGhvcml6b250YWwgaWYgWCBpcyBtZWFzdXJlIGFuZCBZIGlzIGRpbWVuc2lvbiBvciB1bnNwZWNpZmllZFxuICAgICAgICAgICAgICAgJ2hvcml6b250YWwnIDpcbiAgICAgICAgICAgICAgIC8vIHZlcnRpY2FsICh1bmRlZmluZWQpIG90aGVyd2lzZS4gIFRoaXMgaW5jbHVkZXMgd2hlblxuICAgICAgICAgICAgICAgLy8gLSBZIGlzIG1lYXN1cmUgYW5kIFggaXMgZGltZW5zaW9uIG9yIHVuc3BlY2lmaWVkXG4gICAgICAgICAgICAgICAvLyAtIGJvdGggWCBhbmQgWSBhcmUgbWVhc3VyZXMgb3IgYm90aCBhcmUgZGltZW5zaW9uXG4gICAgICAgICAgICAgICB1bmRlZmluZWQ7ICAvL1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgLy8gdGV4dC1vbmx5XG4gICAgICAgICBjYXNlICdhbGlnbic6XG4gICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNmZ1twcm9wZXJ0eV0gPSBoYXMoc3BlYy5lbmNvZGluZywgWCkgPyAnY2VudGVyJyA6ICdyaWdodCc7XG4gICAgICAgICAgfVxuICAgICAgIH1cbiAgICAgICByZXR1cm4gY2ZnO1xuICAgICB9LCB7fSksXG4gICAgIHNwZWMuY29uZmlnLm1hcmtcbiAgICk7XG59XG4iLCJpbXBvcnQgKiBhcyB2bEZpZWxkRGVmIGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7ZXh0ZW5kLCBrZXlzLCB2YWxzLCByZWR1Y2V9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcbmltcG9ydCB7U3RhY2tQcm9wZXJ0aWVzfSBmcm9tICcuL3N0YWNrJztcblxuaW1wb3J0IHthdXRvTWF4Qmluc30gZnJvbSAnLi4vYmluJztcbmltcG9ydCB7Q2hhbm5lbCwgWCwgWSwgUk9XLCBDT0xVTU59IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtTT1VSQ0UsIFNUQUNLRURfU0NBTEUsIExBWU9VVCwgU1VNTUFSWX0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQge2ZpZWxkfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge1FVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHt0eXBlIGFzIHNjYWxlVHlwZX0gZnJvbSAnLi9zY2FsZSc7XG5pbXBvcnQge3BhcnNlRXhwcmVzc2lvbiwgcmF3RG9tYWlufSBmcm9tICcuL3RpbWUnO1xuXG5jb25zdCBERUZBVUxUX05VTExfRklMVEVSUyA9IHtcbiAgbm9taW5hbDogZmFsc2UsXG4gIG9yZGluYWw6IGZhbHNlLFxuICBxdWFudGl0YXRpdmU6IHRydWUsXG4gIHRlbXBvcmFsOiB0cnVlXG59O1xuXG4vKipcbiAqIENyZWF0ZSBWZWdhJ3MgZGF0YSBhcnJheSBmcm9tIGEgZ2l2ZW4gbW9kZWwuXG4gKlxuICogQHBhcmFtICBtb2RlbFxuICogQHJldHVybiBBcnJheSBvZiBWZWdhIGRhdGEuXG4gKiAgICAgICAgICAgICAgICAgVGhpcyBhbHdheXMgaW5jbHVkZXMgYSBcInNvdXJjZVwiIGRhdGEgdGFibGUuXG4gKiAgICAgICAgICAgICAgICAgSWYgdGhlIG1vZGVsIGNvbnRhaW5zIGFnZ3JlZ2F0ZSB2YWx1ZSwgdGhpcyB3aWxsIGFsc28gY3JlYXRlXG4gKiAgICAgICAgICAgICAgICAgYWdncmVnYXRlIHRhYmxlIGFzIHdlbGwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlRGF0YShtb2RlbDogTW9kZWwpOiBWZ0RhdGFbXSB7XG4gIGNvbnN0IGRlZiA9IFtzb3VyY2UuZGVmKG1vZGVsKV07XG5cbiAgY29uc3Qgc3VtbWFyeURlZiA9IHN1bW1hcnkuZGVmKG1vZGVsKTtcbiAgaWYgKHN1bW1hcnlEZWYpIHtcbiAgICBkZWYucHVzaChzdW1tYXJ5RGVmKTtcbiAgfVxuXG4gIC8vIGFwcGVuZCBub24tcG9zaXRpdmUgZmlsdGVyIGF0IHRoZSBlbmQgZm9yIHRoZSBkYXRhIHRhYmxlXG4gIGZpbHRlck5vblBvc2l0aXZlRm9yTG9nKGRlZltkZWYubGVuZ3RoIC0gMV0sIG1vZGVsKTtcblxuICAvLyBhZGQgc3RhdHMgZm9yIGxheW91dCBjYWxjdWxhdGlvblxuICBjb25zdCBsYXlvdXREZWYgPSBsYXlvdXQuZGVmKG1vZGVsKTtcbiAgaWYobGF5b3V0RGVmKSB7XG4gICAgZGVmLnB1c2gobGF5b3V0RGVmKTtcbiAgfVxuXG4gIC8vIFN0YWNrXG4gIGNvbnN0IHN0YWNrRGVmID0gbW9kZWwuc3RhY2soKTtcbiAgaWYgKHN0YWNrRGVmKSB7XG4gICAgZGVmLnB1c2goc3RhY2suZGVmKG1vZGVsLCBzdGFja0RlZikpO1xuICB9XG5cbiAgcmV0dXJuIGRlZi5jb25jYXQoXG4gICAgZGF0ZXMuZGVmcyhtb2RlbCkgLy8gVGltZSBkb21haW4gdGFibGVzXG4gICk7XG59XG5cbi8vIFRPRE86IENvbnNvbGlkYXRlIGFsbCBWZWdhIGludGVyZmFjZXNcbmludGVyZmFjZSBWZ0RhdGEge1xuICBuYW1lOiBzdHJpbmc7XG4gIHNvdXJjZT86IHN0cmluZztcbiAgdmFsdWVzPzogYW55O1xuICBmb3JtYXQ/OiBhbnk7XG4gIHVybD86IGFueTtcbiAgdHJhbnNmb3JtPzogYW55O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIHNvdXJjZSB7XG4gIGV4cG9ydCBmdW5jdGlvbiBkZWYobW9kZWw6IE1vZGVsKTogVmdEYXRhIHtcbiAgICB2YXIgc291cmNlOlZnRGF0YSA9IHtuYW1lOiBTT1VSQ0V9O1xuXG4gICAgLy8gRGF0YSBzb3VyY2UgKHVybCBvciBpbmxpbmUpXG4gICAgaWYgKG1vZGVsLmhhc1ZhbHVlcygpKSB7XG4gICAgICBzb3VyY2UudmFsdWVzID0gbW9kZWwuZGF0YSgpLnZhbHVlcztcbiAgICAgIHNvdXJjZS5mb3JtYXQgPSB7dHlwZTogJ2pzb24nfTtcbiAgICB9IGVsc2Uge1xuICAgICAgc291cmNlLnVybCA9IG1vZGVsLmRhdGEoKS51cmw7XG4gICAgICBzb3VyY2UuZm9ybWF0ID0ge3R5cGU6IG1vZGVsLmRhdGEoKS5mb3JtYXRUeXBlfTtcbiAgICB9XG5cbiAgICAvLyBTZXQgZGF0YSdzIGZvcm1hdC5wYXJzZSBpZiBuZWVkZWRcbiAgICB2YXIgcGFyc2UgPSBmb3JtYXRQYXJzZShtb2RlbCk7XG4gICAgaWYgKHBhcnNlKSB7XG4gICAgICBzb3VyY2UuZm9ybWF0LnBhcnNlID0gcGFyc2U7XG4gICAgfVxuXG4gICAgc291cmNlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybShtb2RlbCk7XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFBhcnNlKG1vZGVsOiBNb2RlbCkge1xuICAgIGNvbnN0IGNhbGNGaWVsZE1hcCA9IChtb2RlbC50cmFuc2Zvcm0oKS5jYWxjdWxhdGUgfHwgW10pLnJlZHVjZShmdW5jdGlvbihmaWVsZE1hcCwgZm9ybXVsYSkge1xuICAgICAgZmllbGRNYXBbZm9ybXVsYS5maWVsZF0gPSB0cnVlO1xuICAgICAgcmV0dXJuIGZpZWxkTWFwO1xuICAgIH0sIHt9KTtcblxuICAgIGxldCBwYXJzZTtcbiAgICAvLyB1c2UgZm9yRWFjaCByYXRoZXIgdGhhbiByZWR1Y2Ugc28gdGhhdCBpdCBjYW4gcmV0dXJuIHVuZGVmaW5lZFxuICAgIC8vIGlmIHRoZXJlIGlzIG5vIHBhcnNlIG5lZWRlZFxuICAgIG1vZGVsLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gICAgICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICAgICAgcGFyc2UgPSBwYXJzZSB8fCB7fTtcbiAgICAgICAgcGFyc2VbZmllbGREZWYuZmllbGRdID0gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICAgICAgaWYgKHZsRmllbGREZWYuaXNDb3VudChmaWVsZERlZikgfHwgY2FsY0ZpZWxkTWFwW2ZpZWxkRGVmLmZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwYXJzZSA9IHBhcnNlIHx8IHt9O1xuICAgICAgICBwYXJzZVtmaWVsZERlZi5maWVsZF0gPSAnbnVtYmVyJztcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGFyc2U7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgVmVnYSB0cmFuc2Zvcm1zIGZvciB0aGUgc291cmNlIGRhdGEgdGFibGUuICBUaGlzIGNhbiBpbmNsdWRlXG4gICAqIHRyYW5zZm9ybXMgZm9yIHRpbWUgdW5pdCwgYmlubmluZyBhbmQgZmlsdGVyaW5nLlxuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBudWxsIGZpbHRlciBjb21lcyBmaXJzdCBzbyB0cmFuc2Zvcm1zIGFyZSBub3QgcGVyZm9ybWVkIG9uIG51bGwgdmFsdWVzXG4gICAgLy8gdGltZSBhbmQgYmluIHNob3VsZCBjb21lIGJlZm9yZSBmaWx0ZXIgc28gd2UgY2FuIGZpbHRlciBieSB0aW1lIGFuZCBiaW5cbiAgICByZXR1cm4gbnVsbEZpbHRlclRyYW5zZm9ybShtb2RlbCkuY29uY2F0KFxuICAgICAgZm9ybXVsYVRyYW5zZm9ybShtb2RlbCksXG4gICAgICBmaWx0ZXJUcmFuc2Zvcm0obW9kZWwpLFxuICAgICAgYmluVHJhbnNmb3JtKG1vZGVsKSxcbiAgICAgIHRpbWVUcmFuc2Zvcm0obW9kZWwpXG4gICAgKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB0aW1lVHJhbnNmb3JtKG1vZGVsOiBNb2RlbCkge1xuICAgIHJldHVybiBtb2RlbC5yZWR1Y2UoZnVuY3Rpb24odHJhbnNmb3JtLCBmaWVsZERlZjogRmllbGREZWYsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICAgIGNvbnN0IHJlZiA9IGZpZWxkKGZpZWxkRGVmLCB7IG5vZm46IHRydWUsIGRhdHVtOiB0cnVlIH0pO1xuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMICYmIGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgICAgZmllbGQ6IGZpZWxkKGZpZWxkRGVmKSxcbiAgICAgICAgICBleHByOiBwYXJzZUV4cHJlc3Npb24oZmllbGREZWYudGltZVVuaXQsIHJlZilcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJhbnNmb3JtO1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBiaW5UcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIG1vZGVsLnJlZHVjZShmdW5jdGlvbih0cmFuc2Zvcm0sIGZpZWxkRGVmOiBGaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgICAgY29uc3QgYmluID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuYmluO1xuICAgICAgaWYgKGJpbikge1xuICAgICAgICBsZXQgYmluVHJhbnMgPSBleHRlbmQoe1xuICAgICAgICAgICAgdHlwZTogJ2JpbicsXG4gICAgICAgICAgICBmaWVsZDogZmllbGREZWYuZmllbGQsXG4gICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgc3RhcnQ6IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX3N0YXJ0J30pLFxuICAgICAgICAgICAgICBtaWQ6IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX21pZCd9KSxcbiAgICAgICAgICAgICAgZW5kOiBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19lbmQnfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIGlmIGJpbiBpcyBhbiBvYmplY3QsIGxvYWQgcGFyYW1ldGVyIGhlcmUhXG4gICAgICAgICAgdHlwZW9mIGJpbiA9PT0gJ2Jvb2xlYW4nID8ge30gOiBiaW5cbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoIWJpblRyYW5zLm1heGJpbnMgJiYgIWJpblRyYW5zLnN0ZXApIHtcbiAgICAgICAgICAvLyBpZiBib3RoIG1heGJpbnMgYW5kIHN0ZXAgYXJlIHNwZWNpZmllZCwgbmVlZCB0byBhdXRvbWF0aWNhbGx5IGRldGVybWluZSBiaW5cbiAgICAgICAgICBiaW5UcmFucy5tYXhiaW5zID0gYXV0b01heEJpbnMoY2hhbm5lbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc2Zvcm0ucHVzaChiaW5UcmFucyk7XG4gICAgICAgIGlmIChzY2FsZVR5cGUoZmllbGREZWYsIGNoYW5uZWwsIG1vZGVsLm1hcmsoKSkgPT09ICdvcmRpbmFsJykge1xuICAgICAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICAgIGZpZWxkOiBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19yYW5nZSd9KSxcbiAgICAgICAgICAgIGV4cHI6IGZpZWxkKGZpZWxkRGVmLCB7ZGF0dW06IHRydWUsIGJpblN1ZmZpeDogJ19zdGFydCd9KSArXG4gICAgICAgICAgICAgICAgICAnKyBcXCctXFwnICsnICtcbiAgICAgICAgICAgICAgICAgIGZpZWxkKGZpZWxkRGVmLCB7ZGF0dW06IHRydWUsIGJpblN1ZmZpeDogJ19lbmQnfSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgICB9LCBbXSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiBBbiBhcnJheSB0aGF0IG1pZ2h0IGNvbnRhaW4gYSBmaWx0ZXIgdHJhbnNmb3JtIGZvciBmaWx0ZXJpbmcgbnVsbCB2YWx1ZSBiYXNlZCBvbiBmaWx0ZXJOdWwgY29uZmlnXG4gICAqL1xuICBleHBvcnQgZnVuY3Rpb24gbnVsbEZpbHRlclRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgICBjb25zdCBmaWx0ZXJOdWxsID0gbW9kZWwudHJhbnNmb3JtKCkuZmlsdGVyTnVsbDtcbiAgICBjb25zdCBmaWx0ZXJlZEZpZWxkcyA9IGtleXMobW9kZWwucmVkdWNlKGZ1bmN0aW9uKGFnZ3JlZ2F0b3IsIGZpZWxkRGVmOiBGaWVsZERlZikge1xuICAgICAgaWYgKGZpbHRlck51bGwgfHxcbiAgICAgICAgKGZpbHRlck51bGwgPT09IHVuZGVmaW5lZCAmJiBmaWVsZERlZi5maWVsZCAmJiBmaWVsZERlZi5maWVsZCAhPT0gJyonICYmIERFRkFVTFRfTlVMTF9GSUxURVJTW2ZpZWxkRGVmLnR5cGVdKSkge1xuICAgICAgICBhZ2dyZWdhdG9yW2ZpZWxkRGVmLmZpZWxkXSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWdncmVnYXRvcjtcbiAgICB9LCB7fSkpO1xuXG4gICAgcmV0dXJuIGZpbHRlcmVkRmllbGRzLmxlbmd0aCA+IDAgP1xuICAgICAgW3tcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIHRlc3Q6IGZpbHRlcmVkRmllbGRzLm1hcChmdW5jdGlvbihmaWVsZE5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gJ2RhdHVtLicgKyBmaWVsZE5hbWUgKyAnIT09bnVsbCc7XG4gICAgICAgIH0pLmpvaW4oJyAmJiAnKVxuICAgICAgfV0gOiBbXTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gICAgdmFyIGZpbHRlciA9IG1vZGVsLnRyYW5zZm9ybSgpLmZpbHRlcjtcbiAgICByZXR1cm4gZmlsdGVyID8gW3tcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIHRlc3Q6IGZpbHRlclxuICAgIH1dIDogW107XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZm9ybXVsYVRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgICByZXR1cm4gKG1vZGVsLnRyYW5zZm9ybSgpLmNhbGN1bGF0ZSB8fCBbXSkucmVkdWNlKGZ1bmN0aW9uKHRyYW5zZm9ybSwgZm9ybXVsYSkge1xuICAgICAgdHJhbnNmb3JtLnB1c2goZXh0ZW5kKHt0eXBlOiAnZm9ybXVsYSd9LCBmb3JtdWxhKSk7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtO1xuICAgIH0sIFtdKTtcbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIGxheW91dCB7XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZihtb2RlbDogTW9kZWwpOiBWZ0RhdGEge1xuICAgIGxldCBzdW1tYXJpemUgPSBbXTtcbiAgICBsZXQgZm9ybXVsYXMgPSBbXTtcblxuICAgIC8vIFRPRE86IGhhbmRsZSBcImZpdFwiIG1vZGVcbiAgICBpZiAobW9kZWwuaGFzKFgpICYmIG1vZGVsLmlzT3JkaW5hbFNjYWxlKFgpKSB7XG4gICAgICBjb25zdCB4U2NhbGUgPSBtb2RlbC5maWVsZERlZihYKS5zY2FsZTtcbiAgICAgIGNvbnN0IHhIYXNEb21haW4gPSB4U2NhbGUuZG9tYWluIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgICBpZiAoIXhIYXNEb21haW4pIHtcbiAgICAgICAgc3VtbWFyaXplLnB1c2goe1xuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYKSxcbiAgICAgICAgICBvcHM6IFsnZGlzdGluY3QnXVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHhDYXJkaW5hbGl0eSA9IHhIYXNEb21haW4gPyB4U2NhbGUuZG9tYWluLmxlbmd0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmZpZWxkKFgsIHtkYXR1bTogdHJ1ZSwgcHJlZm46ICdkaXN0aW5jdF8nfSk7XG4gICAgICBmb3JtdWxhcy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBmaWVsZDogJ2NlbGxXaWR0aCcsXG4gICAgICAgIGV4cHI6ICcoJyArIHhDYXJkaW5hbGl0eSArICcgKyAnICsgeFNjYWxlLnBhZGRpbmcgKyAnKSAqICcgKyB4U2NhbGUuYmFuZFdpZHRoXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAobW9kZWwuaGFzKFkpICYmIG1vZGVsLmlzT3JkaW5hbFNjYWxlKFkpKSB7XG4gICAgICBjb25zdCB5U2NhbGUgPSBtb2RlbC5maWVsZERlZihZKS5zY2FsZTtcbiAgICAgIGNvbnN0IHlIYXNEb21haW4gPSB5U2NhbGUuZG9tYWluIGluc3RhbmNlb2YgQXJyYXk7XG5cbiAgICAgIGlmICgheUhhc0RvbWFpbikge1xuICAgICAgICBzdW1tYXJpemUucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCddXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB5Q2FyZGluYWxpdHkgPSB5SGFzRG9tYWluID8geVNjYWxlLmRvbWFpbi5sZW5ndGggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5maWVsZChZLCB7ZGF0dW06IHRydWUsIHByZWZuOiAnZGlzdGluY3RfJ30pO1xuICAgICAgZm9ybXVsYXMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgZmllbGQ6ICdjZWxsSGVpZ2h0JyxcbiAgICAgICAgZXhwcjogJygnICsgeUNhcmRpbmFsaXR5ICsgJyArICcgKyB5U2NhbGUucGFkZGluZyArICcpICogJyArIHlTY2FsZS5iYW5kV2lkdGhcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGxheW91dCA9IG1vZGVsLmxheW91dCgpO1xuXG4gICAgaWYgKG1vZGVsLmhhcyhDT0xVTU4pKSB7XG4gICAgICBjb25zdCBsYXlvdXRDZWxsV2lkdGggPSBsYXlvdXQuY2VsbFdpZHRoO1xuICAgICAgY29uc3QgY2VsbFdpZHRoID0gdHlwZW9mIGxheW91dENlbGxXaWR0aCAhPT0gJ251bWJlcicgP1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdHVtLicgKyBsYXlvdXRDZWxsV2lkdGguZmllbGQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0Q2VsbFdpZHRoO1xuICAgICAgY29uc3QgY29sU2NhbGUgPSBtb2RlbC5maWVsZERlZihDT0xVTU4pLnNjYWxlO1xuICAgICAgY29uc3QgY29sSGFzRG9tYWluID0gY29sU2NhbGUuZG9tYWluIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgICBpZiAoIWNvbEhhc0RvbWFpbikge1xuICAgICAgICBzdW1tYXJpemUucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKENPTFVNTiksXG4gICAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbENhcmRpbmFsaXR5ID0gY29sSGFzRG9tYWluID8gY29sU2NhbGUuZG9tYWluLmxlbmd0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZmllbGQoQ09MVU1OLCB7ZGF0dW06IHRydWUsIHByZWZuOiAnZGlzdGluY3RfJ30pO1xuICAgICAgZm9ybXVsYXMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgZmllbGQ6ICd3aWR0aCcsXG4gICAgICAgIGV4cHI6ICcoJyArIGNlbGxXaWR0aCArICcgKyAnICsgY29sU2NhbGUucGFkZGluZyArICcpJyArICcgKiAnICsgY29sQ2FyZGluYWxpdHlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChtb2RlbC5oYXMoUk9XKSkge1xuICAgICAgY29uc3QgbGF5b3V0Q2VsbEhlaWdodCA9IGxheW91dC5jZWxsSGVpZ2h0O1xuICAgICAgY29uc3QgY2VsbEhlaWdodCA9IHR5cGVvZiBsYXlvdXRDZWxsSGVpZ2h0ICE9PSAnbnVtYmVyJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0dW0uJyArIGxheW91dENlbGxIZWlnaHQuZmllbGQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0Q2VsbEhlaWdodDtcbiAgICAgIGNvbnN0IHJvd1NjYWxlID0gbW9kZWwuZmllbGREZWYoUk9XKS5zY2FsZTtcbiAgICAgIGNvbnN0IHJvd0hhc0RvbWFpbiA9IHJvd1NjYWxlLmRvbWFpbiBpbnN0YW5jZW9mIEFycmF5O1xuICAgICAgaWYgKCFyb3dIYXNEb21haW4pIHtcbiAgICAgICAgc3VtbWFyaXplLnB1c2goe1xuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChST1cpLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCddXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByb3dDYXJkaW5hbGl0eSA9IHJvd0hhc0RvbWFpbiA/IHJvd1NjYWxlLmRvbWFpbi5sZW5ndGggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmZpZWxkKFJPVywge2RhdHVtOiB0cnVlLCBwcmVmbjogJ2Rpc3RpbmN0Xyd9KTtcbiAgICAgIGZvcm11bGFzLnB1c2goe1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGZpZWxkOiAnaGVpZ2h0JyxcbiAgICAgICAgZXhwcjogJygnICsgY2VsbEhlaWdodCArICcrJyArIHJvd1NjYWxlLnBhZGRpbmcgKyAnKScgKyAnICogJyArIHJvd0NhcmRpbmFsaXR5XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybXVsYXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHN1bW1hcml6ZS5sZW5ndGggPiAwID8ge1xuICAgICAgICBuYW1lOiBMQVlPVVQsXG4gICAgICAgIHNvdXJjZTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgICAgc3VtbWFyaXplOiBzdW1tYXJpemVcbiAgICAgICAgICB9XS5jb25jYXQoZm9ybXVsYXMpXG4gICAgICB9IDoge1xuICAgICAgICBuYW1lOiBMQVlPVVQsXG4gICAgICAgIHZhbHVlczogW3t9XSxcbiAgICAgICAgdHJhbnNmb3JtOiBmb3JtdWxhc1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBzdW1tYXJ5IHtcbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZihtb2RlbDogTW9kZWwpOlZnRGF0YSB7XG4gICAgLyogZGljdCBzZXQgZm9yIGRpbWVuc2lvbnMgKi9cbiAgICB2YXIgZGltcyA9IHt9O1xuXG4gICAgLyogZGljdGlvbmFyeSBtYXBwaW5nIGZpZWxkIG5hbWUgPT4gZGljdCBzZXQgb2YgYWdncmVnYXRpb24gZnVuY3Rpb25zICovXG4gICAgdmFyIG1lYXMgPSB7fTtcblxuICAgIHZhciBoYXNBZ2dyZWdhdGUgPSBmYWxzZTtcblxuICAgIG1vZGVsLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWY6IEZpZWxkRGVmLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBpZiAoZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgIGhhc0FnZ3JlZ2F0ZSA9IHRydWU7XG4gICAgICAgIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICBtZWFzWycqJ10gPSBtZWFzWycqJ10gfHwge307XG4gICAgICAgICAgbWVhc1snKiddLmNvdW50ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXSA9IG1lYXNbZmllbGREZWYuZmllbGRdIHx8IHt9O1xuICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdW2ZpZWxkRGVmLmFnZ3JlZ2F0ZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICAgICAgZGltc1tmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19zdGFydCd9KV0gPSBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19zdGFydCd9KTtcbiAgICAgICAgICBkaW1zW2ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX21pZCd9KV0gPSBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19taWQnfSk7XG4gICAgICAgICAgZGltc1tmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19lbmQnfSldID0gZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdfZW5kJ30pO1xuXG4gICAgICAgICAgaWYgKHNjYWxlVHlwZShmaWVsZERlZiwgY2hhbm5lbCwgbW9kZWwubWFyaygpKSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICAgICAgICAvLyBhbHNvIHByb2R1Y2UgYmluX3JhbmdlIGlmIHRoZSBiaW5uZWQgZmllbGQgdXNlIG9yZGluYWwgc2NhbGVcbiAgICAgICAgICAgIGRpbXNbZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdfcmFuZ2UnfSldID0gZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdfcmFuZ2UnfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpbXNbZmllbGQoZmllbGREZWYpXSA9IGZpZWxkKGZpZWxkRGVmKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGdyb3VwYnkgPSB2YWxzKGRpbXMpO1xuXG4gICAgLy8gc2hvcnQtZm9ybWF0IHN1bW1hcml6ZSBvYmplY3QgZm9yIFZlZ2EncyBhZ2dyZWdhdGUgdHJhbnNmb3JtXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS93aWtpL0RhdGEtVHJhbnNmb3JtcyMtYWdncmVnYXRlXG4gICAgdmFyIHN1bW1hcml6ZSA9IHJlZHVjZShtZWFzLCBmdW5jdGlvbihhZ2dyZWdhdG9yLCBmbkRpY3RTZXQsIGZpZWxkKSB7XG4gICAgICBhZ2dyZWdhdG9yW2ZpZWxkXSA9IGtleXMoZm5EaWN0U2V0KTtcbiAgICAgIHJldHVybiBhZ2dyZWdhdG9yO1xuICAgIH0sIHt9KTtcblxuICAgIGlmIChoYXNBZ2dyZWdhdGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFNVTU1BUlksXG4gICAgICAgIHNvdXJjZTogU09VUkNFLFxuICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogZ3JvdXBieSxcbiAgICAgICAgICBzdW1tYXJpemU6IHN1bW1hcml6ZVxuICAgICAgICB9XVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBzdGFjayB7XG4gIC8qKlxuICAgKiBBZGQgc3RhY2tlZCBkYXRhIHNvdXJjZSwgZm9yIGZlZWRpbmcgdGhlIHNoYXJlZCBzY2FsZS5cbiAgICovXG4gIGV4cG9ydCBmdW5jdGlvbiBkZWYobW9kZWw6IE1vZGVsLCBzdGFja1Byb3BzOiBTdGFja1Byb3BlcnRpZXMpOlZnRGF0YSB7XG4gICAgdmFyIGdyb3VwYnlDaGFubmVsID0gc3RhY2tQcm9wcy5ncm91cGJ5Q2hhbm5lbDtcbiAgICB2YXIgZmllbGRDaGFubmVsID0gc3RhY2tQcm9wcy5maWVsZENoYW5uZWw7XG4gICAgdmFyIGZhY2V0RmllbGRzID0gKG1vZGVsLmhhcyhDT0xVTU4pID8gW21vZGVsLmZpZWxkKENPTFVNTildIDogW10pXG4gICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdCgobW9kZWwuaGFzKFJPVykgPyBbbW9kZWwuZmllbGQoUk9XKV0gOiBbXSkpO1xuXG4gICAgdmFyIHN0YWNrZWQ6VmdEYXRhID0ge1xuICAgICAgbmFtZTogU1RBQ0tFRF9TQ0FMRSxcbiAgICAgIHNvdXJjZTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAvLyBncm91cCBieSBjaGFubmVsIGFuZCBvdGhlciBmYWNldHNcbiAgICAgICAgZ3JvdXBieTogW21vZGVsLmZpZWxkKGdyb3VwYnlDaGFubmVsKV0uY29uY2F0KGZhY2V0RmllbGRzKSxcbiAgICAgICAgLy8gcHJvZHVjZSBzdW0gb2YgdGhlIGZpZWxkJ3MgdmFsdWUgZS5nLiwgc3VtIG9mIHN1bSwgc3VtIG9mIGRpc3RpbmN0XG4gICAgICAgIHN1bW1hcml6ZTogW3tvcHM6IFsnc3VtJ10sIGZpZWxkOiBtb2RlbC5maWVsZChmaWVsZENoYW5uZWwpfV1cbiAgICAgIH1dXG4gICAgfTtcblxuICAgIHJldHVybiBzdGFja2VkO1xuICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIGRhdGVzIHtcbiAgLyoqXG4gICAqIEFkZCBkYXRhIHNvdXJjZSBmb3Igd2l0aCBkYXRlcyBmb3IgYWxsIG1vbnRocywgZGF5cywgaG91cnMsIC4uLiBhcyBuZWVkZWQuXG4gICAqL1xuICBleHBvcnQgZnVuY3Rpb24gZGVmcyhtb2RlbDogTW9kZWwpIHtcbiAgICBsZXQgYWxyZWFkeUFkZGVkID0ge307XG5cbiAgICByZXR1cm4gbW9kZWwucmVkdWNlKGZ1bmN0aW9uKGFnZ3JlZ2F0b3IsIGZpZWxkRGVmOiBGaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgICAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIGNvbnN0IGRvbWFpbiA9IHJhd0RvbWFpbihmaWVsZERlZi50aW1lVW5pdCwgY2hhbm5lbCk7XG4gICAgICAgIGlmIChkb21haW4gJiYgIWFscmVhZHlBZGRlZFtmaWVsZERlZi50aW1lVW5pdF0pIHtcbiAgICAgICAgICBhbHJlYWR5QWRkZWRbZmllbGREZWYudGltZVVuaXRdID0gdHJ1ZTtcbiAgICAgICAgICBhZ2dyZWdhdG9yLnB1c2goe1xuICAgICAgICAgICAgbmFtZTogZmllbGREZWYudGltZVVuaXQsXG4gICAgICAgICAgICB2YWx1ZXM6IGRvbWFpbixcbiAgICAgICAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICAgICAgICBleHByOiBwYXJzZUV4cHJlc3Npb24oZmllbGREZWYudGltZVVuaXQsICdkYXR1bS5kYXRhJywgdHJ1ZSlcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhZ2dyZWdhdG9yO1xuICAgIH0sIFtdKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyTm9uUG9zaXRpdmVGb3JMb2coZGF0YVRhYmxlLCBtb2RlbDogTW9kZWwpIHtcbiAgbW9kZWwuZm9yRWFjaChmdW5jdGlvbihfLCBjaGFubmVsKSB7XG4gICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZTtcbiAgICBpZiAoc2NhbGUgJiYgc2NhbGUudHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIGRhdGFUYWJsZS50cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgICB0ZXN0OiBtb2RlbC5maWVsZChjaGFubmVsLCB7ZGF0dW06IHRydWV9KSArICcgPiAwJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge2V4dGVuZH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuXG5pbXBvcnQge2NvbXBpbGVBeGlzfSBmcm9tICcuL2F4aXMnO1xuaW1wb3J0IHtjb21waWxlU2NhbGVzfSBmcm9tICcuL3NjYWxlJztcblxuLyoqXG4gKiByZXR1cm4gbWl4aW5zIHRoYXQgY29udGFpbnMgbWFya3MsIHNjYWxlcywgYW5kIGF4ZXMgZm9yIHRoZSByb290R3JvdXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZhY2V0TWl4aW5zKG1vZGVsOiBNb2RlbCwgbWFya3MpIHtcbiAgY29uc3QgbGF5b3V0ID0gbW9kZWwubGF5b3V0KCk7XG4gIGNvbnN0IGNlbGxDb25maWcgPSBtb2RlbC5jb25maWcoKS5jZWxsO1xuICBjb25zdCBjZWxsV2lkdGg6IGFueSA9ICFtb2RlbC5oYXMoQ09MVU1OKSA/XG4gICAgICB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319IDogICAgIC8vIGNlbGxXaWR0aCA9IHdpZHRoIC0tIGp1c3QgdXNlIGdyb3VwJ3NcbiAgICB0eXBlb2YgbGF5b3V0LmNlbGxXaWR0aCAhPT0gJ251bWJlcicgP1xuICAgICAge3NjYWxlOiBtb2RlbC5zY2FsZU5hbWUoQ09MVU1OKSwgYmFuZDogdHJ1ZX0gOiAvLyBiYW5kU2l6ZSBvZiB0aGUgc2NhbGVcbiAgICAgIHt2YWx1ZTogbGF5b3V0LmNlbGxXaWR0aH07ICAgICAgLy8gc3RhdGljIHZhbHVlXG5cbiAgY29uc3QgY2VsbEhlaWdodDogYW55ID0gIW1vZGVsLmhhcyhST1cpID9cbiAgICAgIHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319IDogIC8vIGNlbGxIZWlnaHQgPSBoZWlnaHQgLS0ganVzdCB1c2UgZ3JvdXAnc1xuICAgIHR5cGVvZiBsYXlvdXQuY2VsbEhlaWdodCAhPT0gJ251bWJlcicgP1xuICAgICAge3NjYWxlOiBtb2RlbC5zY2FsZU5hbWUoUk9XKSwgYmFuZDogdHJ1ZX0gOiAgLy8gYmFuZFNpemUgb2YgdGhlIHNjYWxlXG4gICAgICB7dmFsdWU6IGxheW91dC5jZWxsSGVpZ2h0fTsgICAvLyBzdGF0aWMgdmFsdWVcblxuICBsZXQgZmFjZXRHcm91cFByb3BlcnRpZXM6IGFueSA9IHtcbiAgICB3aWR0aDogY2VsbFdpZHRoLFxuICAgIGhlaWdodDogY2VsbEhlaWdodFxuICB9O1xuXG4gIC8vIGFkZCBjb25maWdzIHRoYXQgYXJlIHRoZSByZXN1bHRpbmcgZ3JvdXAgbWFya3MgcHJvcGVydGllc1xuICBbJ2NsaXAnLCAnZmlsbCcsICdmaWxsT3BhY2l0eScsICdzdHJva2UnLCAnc3Ryb2tlV2lkdGgnLFxuICAgICdzdHJva2VPcGFjaXR5JywgJ3N0cm9rZURhc2gnLCAnc3Ryb2tlRGFzaE9mZnNldCddXG4gICAgLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY2VsbENvbmZpZ1twcm9wZXJ0eV07XG4gICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmYWNldEdyb3VwUHJvcGVydGllc1twcm9wZXJ0eV0gPSB7dmFsdWU6IHZhbHVlfTtcbiAgICAgIH1cbiAgICB9KTtcblxuICBsZXQgcm9vdE1hcmtzID0gW10sIHJvb3RBeGVzID0gW10sIGZhY2V0S2V5cyA9IFtdLCBjZWxsQXhlcyA9IFtdO1xuICBjb25zdCBoYXNSb3cgPSBtb2RlbC5oYXMoUk9XKSwgaGFzQ29sID0gbW9kZWwuaGFzKENPTFVNTik7XG5cbiAgLy8gVE9ETygjOTApOiBhZGQgcHJvcGVydHkgdG8ga2VlcCBheGVzIGluIGNlbGxzIGV2ZW4gaWYgcm93IGlzIGVuY29kZWRcbiAgaWYgKGhhc1Jvdykge1xuICAgIGlmICghbW9kZWwuaXNEaW1lbnNpb24oUk9XKSkge1xuICAgICAgLy8gVE9ETzogYWRkIGVycm9yIHRvIG1vZGVsIGluc3RlYWRcbiAgICAgIHV0aWwuZXJyb3IoJ1JvdyBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC4nKTtcbiAgICB9XG4gICAgZmFjZXRHcm91cFByb3BlcnRpZXMueSA9IHtcbiAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoUk9XKSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChST1cpLFxuICAgICAgb2Zmc2V0OiBtb2RlbC5maWVsZERlZihST1cpLnNjYWxlLnBhZGRpbmcgLyAyXG4gICAgfTtcblxuICAgIGZhY2V0S2V5cy5wdXNoKG1vZGVsLmZpZWxkKFJPVykpO1xuICAgIHJvb3RBeGVzLnB1c2goY29tcGlsZUF4aXMoUk9XLCBtb2RlbCkpO1xuICAgIGlmIChtb2RlbC5oYXMoWCkpIHtcbiAgICAgIC8vIElmIGhhcyBYLCBwcmVwZW5kIGEgZ3JvdXAgZm9yIHNoYXJlZCB4LWF4ZXMgaW4gdGhlIHJvb3QgZ3JvdXAncyBtYXJrc1xuICAgICAgcm9vdE1hcmtzLnB1c2goZ2V0WEF4ZXNHcm91cChtb2RlbCwgY2VsbFdpZHRoLCBoYXNDb2wpKTtcbiAgICB9XG4gICAgY29uc3Qgcm93QXhpcyA9IG1vZGVsLmZpZWxkRGVmKFJPVykuYXhpcztcbiAgICBpZiAodHlwZW9mIHJvd0F4aXMgPT09ICdib29sZWFuJyB8fCByb3dBeGlzLmdyaWQgIT09IGZhbHNlKSB7XG4gICAgICByb290TWFya3MucHVzaChnZXRSb3dHcmlkR3JvdXAobW9kZWwsIGNlbGxIZWlnaHQpKTtcbiAgICB9XG4gIH0gZWxzZSB7IC8vIGRvZXNuJ3QgaGF2ZSByb3dcbiAgICBpZiAobW9kZWwuaGFzKFgpICYmIG1vZGVsLmZpZWxkRGVmKFgpLmF4aXMpIHsgLy8ga2VlcCB4IGF4aXMgaW4gdGhlIGNlbGxcbiAgICAgIGNlbGxBeGVzLnB1c2goY29tcGlsZUF4aXMoWCwgbW9kZWwpKTtcbiAgICB9XG4gIH1cblxuICAvLyBUT0RPKCM5MCk6IGFkZCBwcm9wZXJ0eSB0byBrZWVwIGF4ZXMgaW4gY2VsbHMgZXZlbiBpZiBjb2x1bW4gaXMgZW5jb2RlZFxuICBpZiAoaGFzQ29sKSB7XG4gICAgaWYgKCFtb2RlbC5pc0RpbWVuc2lvbihDT0xVTU4pKSB7XG4gICAgICAvLyBUT0RPOiBhZGQgZXJyb3IgdG8gbW9kZWwgaW5zdGVhZFxuICAgICAgdXRpbC5lcnJvcignQ29sIGVuY29kaW5nIHNob3VsZCBiZSBvcmRpbmFsLicpO1xuICAgIH1cbiAgICBmYWNldEdyb3VwUHJvcGVydGllcy54ID0ge1xuICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xVTU4pLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKENPTFVNTiksXG4gICAgICBvZmZzZXQ6IG1vZGVsLmZpZWxkRGVmKENPTFVNTikuc2NhbGUucGFkZGluZyAvIDJcbiAgICB9O1xuXG4gICAgZmFjZXRLZXlzLnB1c2gobW9kZWwuZmllbGQoQ09MVU1OKSk7XG4gICAgcm9vdEF4ZXMucHVzaChjb21waWxlQXhpcyhDT0xVTU4sIG1vZGVsKSk7XG5cbiAgICBpZiAobW9kZWwuaGFzKFkpKSB7XG4gICAgICAvLyBJZiBoYXMgWSwgcHJlcGVuZCBhIGdyb3VwIGZvciBzaGFyZWQgeS1heGVzIGluIHRoZSByb290IGdyb3VwJ3MgbWFya3NcbiAgICAgIHJvb3RNYXJrcy5wdXNoKGdldFlBeGVzR3JvdXAobW9kZWwsIGNlbGxIZWlnaHQsIGhhc1JvdykpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbEF4aXMgPSBtb2RlbC5maWVsZERlZihDT0xVTU4pLmF4aXM7XG4gICAgaWYgKHR5cGVvZiBjb2xBeGlzID09PSAnYm9vbGVhbicgfHwgY29sQXhpcy5ncmlkICE9PSBmYWxzZSkge1xuICAgICAgcm9vdE1hcmtzLnB1c2goZ2V0Q29sdW1uR3JpZEdyb3VwKG1vZGVsLCBjZWxsV2lkdGgpKTtcbiAgICB9XG4gIH0gZWxzZSB7IC8vIGRvZXNuJ3QgaGF2ZSBjb2x1bW5cbiAgICBpZiAobW9kZWwuaGFzKFkpICYmIG1vZGVsLmZpZWxkRGVmKFkpLmF4aXMpIHsgLy8ga2VlcCB5IGF4aXMgaW4gdGhlIGNlbGxcbiAgICAgIGNlbGxBeGVzLnB1c2goY29tcGlsZUF4aXMoWSwgbW9kZWwpKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICBsZXQgZmFjZXRHcm91cDogYW55ID0ge1xuICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICdjZWxsJyxcbiAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIGZyb206IHtcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgdHJhbnNmb3JtOiBbe3R5cGU6ICdmYWNldCcsIGdyb3VwYnk6IGZhY2V0S2V5c31dXG4gICAgfSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB1cGRhdGU6IGZhY2V0R3JvdXBQcm9wZXJ0aWVzXG4gICAgfSxcbiAgICBtYXJrczogbWFya3NcbiAgfTtcbiAgaWYgKGNlbGxBeGVzLmxlbmd0aCA+IDApIHtcbiAgICBmYWNldEdyb3VwLmF4ZXMgPSBjZWxsQXhlcztcbiAgfVxuICByb290TWFya3MucHVzaChmYWNldEdyb3VwKTtcblxuICByZXR1cm4ge1xuICAgIG1hcmtzOiByb290TWFya3MsXG4gICAgYXhlczogcm9vdEF4ZXMsXG4gICAgLy8gYXNzdW1pbmcgZXF1YWwgY2VsbFdpZHRoIGhlcmVcbiAgICBzY2FsZXM6IGNvbXBpbGVTY2FsZXMoXG4gICAgICBtb2RlbC5jaGFubmVscygpLCAvLyBUT0RPOiB3aXRoIG5lc3RpbmcsIG5vdCBhbGwgc2NhbGUgbWlnaHQgYmUgYSByb290LWxldmVsXG4gICAgICBtb2RlbFxuICAgIClcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0WEF4ZXNHcm91cChtb2RlbDogTW9kZWwsIGNlbGxXaWR0aCwgaGFzQ29sOiBib29sZWFuKSB7IC8vIFRPRE86IFZnTWFya3NcbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICByZXR1cm4gZXh0ZW5kKHtcbiAgICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICd4LWF4ZXMnLFxuICAgICAgdHlwZTogJ2dyb3VwJ1xuICAgIH0sXG4gICAgaGFzQ29sID8ge1xuICAgICAgZnJvbToge1xuICAgICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFttb2RlbC5maWVsZChDT0xVTU4pXSxcbiAgICAgICAgICBzdW1tYXJpemU6IHsnKic6ICdjb3VudCd9IC8vIGp1c3QgYSBwbGFjZWhvbGRlciBhZ2dyZWdhdGlvblxuICAgICAgICB9XVxuICAgICAgfVxuICAgIH0gOiB7fSxcbiAgICB7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiBjZWxsV2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fSxcbiAgICAgICAgICB4OiBoYXNDb2wgPyB7c2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xVTU4pLCBmaWVsZDogbW9kZWwuZmllbGQoQ09MVU1OKX0gOiB7dmFsdWU6IDB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1vZGVsLmZpZWxkRGVmKFgpLmF4aXMgPyB7XG4gICAgICBheGVzOiBbY29tcGlsZUF4aXMoWCwgbW9kZWwpXVxuICAgIH06IHt9XG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldFlBeGVzR3JvdXAobW9kZWw6IE1vZGVsLCBjZWxsSGVpZ2h0LCBoYXNSb3c6IGJvb2xlYW4pIHsgLy8gVE9ETzogVmdNYXJrc1xuICBjb25zdCBuYW1lID0gbW9kZWwuc3BlYygpLm5hbWU7XG4gIHJldHVybiBleHRlbmQoe1xuICAgICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgJ3ktYXhlcycsXG4gICAgICB0eXBlOiAnZ3JvdXAnXG4gICAgfSxcbiAgICBoYXNSb3cgPyB7XG4gICAgICBmcm9tOiB7XG4gICAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogW21vZGVsLmZpZWxkKFJPVyldLFxuICAgICAgICAgIHN1bW1hcml6ZTogeycqJzogJ2NvdW50J30gLy8ganVzdCBhIHBsYWNlaG9sZGVyIGFnZ3JlZ2F0aW9uXG4gICAgICAgIH1dXG4gICAgICB9XG4gICAgfSA6IHt9LFxuICAgIHtcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgd2lkdGg6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX0sXG4gICAgICAgICAgaGVpZ2h0OiBjZWxsSGVpZ2h0LFxuICAgICAgICAgIHk6IGhhc1JvdyA/IHtzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFJPVyksIGZpZWxkOiBtb2RlbC5maWVsZChST1cpfSA6IHt2YWx1ZTogMH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICAgIG1vZGVsLmZpZWxkRGVmKFkpLmF4aXMgPyB7XG4gICAgICBheGVzOiBbY29tcGlsZUF4aXMoWSwgbW9kZWwpXVxuICAgIH06IHt9XG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldFJvd0dyaWRHcm91cChtb2RlbDogTW9kZWwsIGNlbGxIZWlnaHQpOiBhbnkgeyAvLyBUT0RPOiBWZ01hcmtzXG4gIGNvbnN0IG5hbWUgPSBtb2RlbC5zcGVjKCkubmFtZTtcbiAgY29uc3QgY2VsbENvbmZpZyA9IG1vZGVsLmNvbmZpZygpLmNlbGw7XG5cbiAgY29uc3Qgcm93R3JpZCA9IHtcbiAgICBuYW1lOiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyAncm93LWdyaWQnLFxuICAgIHR5cGU6ICdydWxlJyxcbiAgICBmcm9tOiB7XG4gICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIHRyYW5zZm9ybTogW3t0eXBlOiAnZmFjZXQnLCBncm91cGJ5OiBbbW9kZWwuZmllbGQoUk9XKV19XVxuICAgIH0sXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdXBkYXRlOiB7XG4gICAgICAgIHk6IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFJPVyksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFJPVylcbiAgICAgICAgfSxcbiAgICAgICAgeDoge3ZhbHVlOiAwLCBvZmZzZXQ6IC1jZWxsQ29uZmlnLmdyaWRPZmZzZXQgfSxcbiAgICAgICAgeDI6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfSwgb2Zmc2V0OiBjZWxsQ29uZmlnLmdyaWRPZmZzZXQgfSxcbiAgICAgICAgc3Ryb2tlOiB7IHZhbHVlOiBjZWxsQ29uZmlnLmdyaWRDb2xvciB9LFxuICAgICAgICBzdHJva2VPcGFjaXR5OiB7IHZhbHVlOiBjZWxsQ29uZmlnLmdyaWRPcGFjaXR5IH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgcm93R3JpZE9uVG9wID0gIW1vZGVsLmhhcyhYKSB8fCBtb2RlbC5heGlzKFgpLm9yaWVudCAhPT0gJ3RvcCc7XG4gIGlmIChyb3dHcmlkT25Ub3ApIHsgLy8gb24gdG9wIC0gbm8gbmVlZCB0byBhZGQgb2Zmc2V0XG4gICAgcmV0dXJuIHJvd0dyaWQ7XG4gIH0gLy8gb3RoZXJ3aXNlLCBuZWVkIHRvIG9mZnNldCBhbGwgZ3JpZCBieSBjZWxsSGVpZ2h0XG4gIHJldHVybiB7XG4gICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgJ3Jvdy1ncmlkLWdyb3VwJyxcbiAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHVwZGF0ZToge1xuICAgICAgICAvLyBhZGQgZ3JvdXAgb2Zmc2V0ID0gYGNlbGxIZWlnaHQgKyBwYWRkaW5nYCB0byBhdm9pZCBjbGFzaGluZyB3aXRoIGF4aXNcbiAgICAgICAgeTogY2VsbEhlaWdodC52YWx1ZSA/IHtcbiAgICAgICAgICAgIC8vIElmIGNlbGxIZWlnaHQgY29udGFpbnMgdmFsdWUsIGp1c3QgdXNlIGl0LlxuICAgICAgICAgICAgdmFsdWU6IGNlbGxIZWlnaHQsXG4gICAgICAgICAgICBvZmZzZXQ6IG1vZGVsLmZpZWxkRGVmKFJPVykuc2NhbGUucGFkZGluZ1xuICAgICAgICAgIH0gOiB7XG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIG5lZWQgdG8gZ2V0IGl0IGZyb20gbGF5b3V0IGRhdGEgaW4gdGhlIHJvb3QgZ3JvdXBcbiAgICAgICAgICAgIGZpZWxkOiB7cGFyZW50OiAnY2VsbEhlaWdodCd9LFxuICAgICAgICAgICAgb2Zmc2V0OiBtb2RlbC5maWVsZERlZihST1cpLnNjYWxlLnBhZGRpbmdcbiAgICAgICAgICB9LFxuICAgICAgICAvLyBpbmNsdWRlIHdpZHRoIHNvIGl0IGNhbiBiZSByZWZlcnJlZCBpbnNpZGUgcm93LWdyaWRcbiAgICAgICAgd2lkdGg6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1hcmtzOiBbcm93R3JpZF1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29sdW1uR3JpZEdyb3VwKG1vZGVsOiBNb2RlbCwgY2VsbFdpZHRoKTogYW55IHsgLy8gVE9ETzogVmdNYXJrc1xuICBjb25zdCBuYW1lID0gbW9kZWwuc3BlYygpLm5hbWU7XG4gIGNvbnN0IGNlbGxDb25maWcgPSBtb2RlbC5jb25maWcoKS5jZWxsO1xuXG4gIGNvbnN0IGNvbHVtbkdyaWQgPSB7XG4gICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgJ2NvbHVtbi1ncmlkJyxcbiAgICB0eXBlOiAncnVsZScsXG4gICAgZnJvbToge1xuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICB0cmFuc2Zvcm06IFt7dHlwZTogJ2ZhY2V0JywgZ3JvdXBieTogW21vZGVsLmZpZWxkKENPTFVNTildfV1cbiAgICB9LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHVwZGF0ZToge1xuICAgICAgICB4OiB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xVTU4pLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChDT0xVTU4pXG4gICAgICAgIH0sXG4gICAgICAgIHk6IHt2YWx1ZTogMCwgb2Zmc2V0OiAtY2VsbENvbmZpZy5ncmlkT2Zmc2V0fSxcbiAgICAgICAgeTI6IHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J30sIG9mZnNldDogY2VsbENvbmZpZy5ncmlkT2Zmc2V0IH0sXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogY2VsbENvbmZpZy5ncmlkQ29sb3IgfSxcbiAgICAgICAgc3Ryb2tlT3BhY2l0eTogeyB2YWx1ZTogY2VsbENvbmZpZy5ncmlkT3BhY2l0eSB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNvbHVtbkdyaWRPbkxlZnQgPSAhbW9kZWwuaGFzKFkpIHx8IG1vZGVsLmF4aXMoWSkub3JpZW50ID09PSAncmlnaHQnO1xuICBpZiAoY29sdW1uR3JpZE9uTGVmdCkgeyAvLyBvbiBsZWZ0LCBubyBuZWVkIHRvIGFkZCBnbG9iYWwgb2Zmc2V0XG4gICAgcmV0dXJuIGNvbHVtbkdyaWQ7XG4gIH0gLy8gb3RoZXJ3aXNlLCBuZWVkIHRvIG9mZnNldCBhbGwgZ3JpZCBieSBjZWxsV2lkdGhcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyAnY29sdW1uLWdyaWQtZ3JvdXAnLFxuICAgIHR5cGU6ICdncm91cCcsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdXBkYXRlOiB7XG4gICAgICAgIC8vIEFkZCBncm91cCBvZmZzZXQgPSBgY2VsbFdpZHRoICsgcGFkZGluZ2AgdG8gYXZvaWQgY2xhc2hpbmcgd2l0aCBheGlzXG4gICAgICAgIHg6IGNlbGxXaWR0aC52YWx1ZSA/IHtcbiAgICAgICAgICAgICAvLyBJZiBjZWxsV2lkdGggY29udGFpbnMgdmFsdWUsIGp1c3QgdXNlIGl0LlxuICAgICAgICAgICAgIHZhbHVlOiBjZWxsV2lkdGgsXG4gICAgICAgICAgICAgb2Zmc2V0OiBtb2RlbC5maWVsZERlZihDT0xVTU4pLnNjYWxlLnBhZGRpbmdcbiAgICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIG5lZWQgdG8gZ2V0IGl0IGZyb20gbGF5b3V0IGRhdGEgaW4gdGhlIHJvb3QgZ3JvdXBcbiAgICAgICAgICAgICBmaWVsZDoge3BhcmVudDogJ2NlbGxXaWR0aCd9LFxuICAgICAgICAgICAgIG9mZnNldDogbW9kZWwuZmllbGREZWYoQ09MVU1OKS5zY2FsZS5wYWRkaW5nXG4gICAgICAgICAgIH0sXG4gICAgICAgIC8vIGluY2x1ZGUgaGVpZ2h0IHNvIGl0IGNhbiBiZSByZWZlcnJlZCBpbnNpZGUgY29sdW1uLWdyaWRcbiAgICAgICAgaGVpZ2h0OiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fVxuICAgICAgfVxuICAgIH0sXG4gICAgbWFya3M6IFtjb2x1bW5HcmlkXVxuICB9O1xufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5cbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFksIFRFWFR9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtURVhUIGFzIFRFWFRfTUFSS30gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge0xBWU9VVH0gZnJvbSAnLi4vZGF0YSc7XG5cbmludGVyZmFjZSBEYXRhUmVmIHtcbiAgZGF0YT86IHN0cmluZztcbiAgZmllbGQ/OiBzdHJpbmc7XG4gIHZhbHVlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExheW91dCB7XG4gIGNlbGxXaWR0aDogTGF5b3V0VmFsdWU7XG4gIGNlbGxIZWlnaHQ6IExheW91dFZhbHVlO1xuICB3aWR0aDogTGF5b3V0VmFsdWU7XG4gIGhlaWdodDogTGF5b3V0VmFsdWU7XG59XG5cbi8vIHZhbHVlIHRoYXQgd2UgY2FuIHB1dCBpbiBzY2FsZSdzIGRvbWFpbi9yYW5nZSAoZWl0aGVyIGEgbnVtYmVyLCBvciBhIGRhdGEgcmVmKVxudHlwZSBMYXlvdXRWYWx1ZSA9IG51bWJlciB8IERhdGFSZWY7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTGF5b3V0KG1vZGVsOiBNb2RlbCk6IExheW91dCB7XG4gIGNvbnN0IGNlbGxXaWR0aCA9IGdldENlbGxXaWR0aChtb2RlbCk7XG4gIGNvbnN0IGNlbGxIZWlnaHQgPSBnZXRDZWxsSGVpZ2h0KG1vZGVsKTtcbiAgcmV0dXJuIHtcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB3aG9sZSBjZWxsXG4gICAgY2VsbFdpZHRoOiBjZWxsV2lkdGgsXG4gICAgY2VsbEhlaWdodDogY2VsbEhlaWdodCxcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjaGFydFxuICAgIHdpZHRoOiBnZXRXaWR0aChtb2RlbCwgY2VsbFdpZHRoKSxcbiAgICBoZWlnaHQ6IGdldEhlaWdodChtb2RlbCwgY2VsbEhlaWdodClcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbFdpZHRoKG1vZGVsOiBNb2RlbCk6IExheW91dFZhbHVlIHtcbiAgaWYgKG1vZGVsLmhhcyhYKSkge1xuICAgIGlmIChtb2RlbC5pc09yZGluYWxTY2FsZShYKSkgeyAvLyBjYWxjdWxhdGUgaW4gZGF0YVxuICAgICAgcmV0dXJuIHtkYXRhOiBMQVlPVVQsIGZpZWxkOiAnY2VsbFdpZHRoJ307XG4gICAgfVxuICAgIHJldHVybiBtb2RlbC5jb25maWcoKS51bml0LndpZHRoO1xuICB9XG4gIGlmIChtb2RlbC5tYXJrKCkgPT09IFRFWFRfTUFSSykge1xuICAgIHJldHVybiA5MDsgLy8gVE9ETzogY29uZmlnLnNjYWxlLnRleHRCYW5kV2lkdGhcbiAgfVxuICByZXR1cm4gMjE7IC8vIFRPRE86IGNvbmZpZy5zY2FsZS5iYW5kV2lkdGhcbn1cblxuZnVuY3Rpb24gZ2V0V2lkdGgobW9kZWw6IE1vZGVsLCBjZWxsV2lkdGg6IExheW91dFZhbHVlKTogTGF5b3V0VmFsdWUge1xuICBpZiAobW9kZWwuaGFzKENPTFVNTikpIHsgLy8gY2FsY3VsYXRlIGluIGRhdGFcbiAgICByZXR1cm4ge2RhdGE6IExBWU9VVCwgZmllbGQ6ICd3aWR0aCd9O1xuICB9XG4gIHJldHVybiBjZWxsV2lkdGg7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxIZWlnaHQobW9kZWw6IE1vZGVsKTogTGF5b3V0VmFsdWUge1xuICBpZiAobW9kZWwuaGFzKFkpKSB7XG4gICAgaWYgKG1vZGVsLmlzT3JkaW5hbFNjYWxlKFkpKSB7IC8vIGNhbGN1bGF0ZSBpbiBkYXRhXG4gICAgICByZXR1cm4ge2RhdGE6IExBWU9VVCwgZmllbGQ6ICdjZWxsSGVpZ2h0J307XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtb2RlbC5jb25maWcoKS51bml0LmhlaWdodDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi87XG59XG5cbmZ1bmN0aW9uIGdldEhlaWdodChtb2RlbDogTW9kZWwsIGNlbGxIZWlnaHQ6IExheW91dFZhbHVlKTogTGF5b3V0VmFsdWUge1xuICBpZiAobW9kZWwuaGFzKFJPVykpIHtcbiAgICByZXR1cm4ge2RhdGE6IExBWU9VVCwgZmllbGQ6ICdoZWlnaHQnfTtcbiAgfVxuICByZXR1cm4gY2VsbEhlaWdodDtcbn1cbiIsImltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuXG5pbXBvcnQge0NPTE9SLCBTSVpFLCBTSEFQRSwgQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge3RpdGxlIGFzIGZpZWxkVGl0bGV9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7QVJFQSwgQkFSLCBUSUNLLCBURVhULCBMSU5FLCBQT0lOVCwgQ0lSQ0xFLCBTUVVBUkV9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtleHRlbmQsIGtleXN9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge2FwcGx5TWFya0NvbmZpZywgRklMTF9TVFJPS0VfQ09ORklHLCBmb3JtYXRNaXhpbnMgYXMgdXRpbEZvcm1hdE1peGluc30gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVMZWdlbmRzKG1vZGVsOiBNb2RlbCkge1xuICB2YXIgZGVmcyA9IFtdO1xuXG4gIGlmIChtb2RlbC5oYXMoQ09MT1IpICYmIG1vZGVsLmZpZWxkRGVmKENPTE9SKS5sZWdlbmQpIHtcbiAgICBkZWZzLnB1c2goY29tcGlsZUxlZ2VuZChtb2RlbCwgQ09MT1IsIHtcbiAgICAgIGZpbGw6IG1vZGVsLnNjYWxlTmFtZShDT0xPUilcbiAgICAgIC8vIFRPRE86IGNvbnNpZGVyIGlmIHRoaXMgc2hvdWxkIGJlIHN0cm9rZSBmb3IgbGluZVxuICAgIH0pKTtcbiAgfVxuXG4gIGlmIChtb2RlbC5oYXMoU0laRSkgJiYgbW9kZWwuZmllbGREZWYoU0laRSkubGVnZW5kKSB7XG4gICAgZGVmcy5wdXNoKGNvbXBpbGVMZWdlbmQobW9kZWwsIFNJWkUsIHtcbiAgICAgIHNpemU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKVxuICAgIH0pKTtcbiAgfVxuXG4gIGlmIChtb2RlbC5oYXMoU0hBUEUpICYmIG1vZGVsLmZpZWxkRGVmKFNIQVBFKS5sZWdlbmQpIHtcbiAgICBkZWZzLnB1c2goY29tcGlsZUxlZ2VuZChtb2RlbCwgU0hBUEUsIHtcbiAgICAgIHNoYXBlOiBtb2RlbC5zY2FsZU5hbWUoU0hBUEUpXG4gICAgfSkpO1xuICB9XG4gIHJldHVybiBkZWZzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUxlZ2VuZChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIGRlZikge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICBjb25zdCBsZWdlbmQgPSBmaWVsZERlZi5sZWdlbmQ7XG5cbiAgLy8gMS4xIEFkZCBwcm9wZXJ0aWVzIHdpdGggc3BlY2lhbCBydWxlc1xuICBkZWYudGl0bGUgPSB0aXRsZShmaWVsZERlZik7XG5cbiAgZXh0ZW5kKGRlZiwgZm9ybWF0TWl4aW5zKG1vZGVsLCBjaGFubmVsKSk7XG5cbiAgLy8gMS4yIEFkZCBwcm9wZXJ0aWVzIHdpdGhvdXQgcnVsZXNcbiAgWydvcmllbnQnLCAndmFsdWVzJ10uZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIGNvbnN0IHZhbHVlID0gbGVnZW5kW3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gMikgQWRkIG1hcmsgcHJvcGVydHkgZGVmaW5pdGlvbiBncm91cHNcbiAgY29uc3QgcHJvcHMgPSAodHlwZW9mIGxlZ2VuZCAhPT0gJ2Jvb2xlYW4nICYmIGxlZ2VuZC5wcm9wZXJ0aWVzKSB8fCB7fTtcbiAgWyd0aXRsZScsICdzeW1ib2xzJywgJ2xlZ2VuZCddLmZvckVhY2goZnVuY3Rpb24oZ3JvdXApIHtcbiAgICBsZXQgdmFsdWUgPSBwcm9wZXJ0aWVzW2dyb3VwXSA/XG4gICAgICBwcm9wZXJ0aWVzW2dyb3VwXShmaWVsZERlZiwgcHJvcHNbZ3JvdXBdLCBtb2RlbCwgY2hhbm5lbCkgOiAvLyBhcHBseSBydWxlXG4gICAgICBwcm9wc1tncm91cF07IC8vIG5vIHJ1bGUgLS0ganVzdCBkZWZhdWx0IHZhbHVlc1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWYucHJvcGVydGllcyA9IGRlZi5wcm9wZXJ0aWVzIHx8IHt9O1xuICAgICAgZGVmLnByb3BlcnRpZXNbZ3JvdXBdID0gdmFsdWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUoZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIGNvbnN0IGxlZ2VuZCA9IGZpZWxkRGVmLmxlZ2VuZDtcbiAgaWYgKHR5cGVvZiBsZWdlbmQgIT09ICdib29sZWFuJyAmJiBsZWdlbmQudGl0bGUpIHtcbiAgICByZXR1cm4gbGVnZW5kLnRpdGxlO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkVGl0bGUoZmllbGREZWYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TWl4aW5zKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIC8vIElmIHRoZSBjaGFubmVsIGlzIGJpbm5lZCwgd2Ugc2hvdWxkIG5vdCBzZXQgdGhlIGZvcm1hdCBiZWNhdXNlIHdlIGhhdmUgYSByYW5nZSBsYWJlbFxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3QgbGVnZW5kID0gZmllbGREZWYubGVnZW5kO1xuICByZXR1cm4gdXRpbEZvcm1hdE1peGlucyhtb2RlbCwgY2hhbm5lbCwgdHlwZW9mIGxlZ2VuZCAhPT0gJ2Jvb2xlYW4nID8gbGVnZW5kLmZvcm1hdCA6IHVuZGVmaW5lZCk7XG59XG5cbm5hbWVzcGFjZSBwcm9wZXJ0aWVzIHtcbiAgZXhwb3J0IGZ1bmN0aW9uIHN5bWJvbHMoZmllbGREZWY6IEZpZWxkRGVmLCBzeW1ib2xzU3BlYywgbW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgbGV0IHN5bWJvbHM6YW55ID0ge307XG4gICAgY29uc3QgbWFyayA9IG1vZGVsLm1hcmsoKTtcblxuICAgIHN3aXRjaCAobWFyaykge1xuICAgICAgY2FzZSBCQVI6XG4gICAgICBjYXNlIFRJQ0s6XG4gICAgICBjYXNlIFRFWFQ6XG4gICAgICAgIHN5bWJvbHMuc2hhcGUgPSB7dmFsdWU6ICdzcXVhcmUnfTtcblxuICAgICAgICAvLyBzZXQgc3Ryb2tlIHRvIHRyYW5zcGFyZW50IGJ5IGRlZmF1bHQgdW5sZXNzIHRoZXJlIGlzIGEgY29uZmlnIGZvciBzdHJva2VcbiAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7dmFsdWU6ICd0cmFuc3BhcmVudCd9O1xuICAgICAgICBhcHBseU1hcmtDb25maWcoc3ltYm9scywgbW9kZWwsIEZJTExfU1RST0tFX0NPTkZJRyk7XG5cbiAgICAgICAgLy8gbm8gbmVlZCB0byBhcHBseSBjb2xvciB0byBmaWxsIGFzIHRoZXkgYXJlIHNldCBhdXRvbWF0aWNhbGx5XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIENJUkNMRTpcbiAgICAgIGNhc2UgU1FVQVJFOlxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1zd2l0Y2gtY2FzZS1mYWxsLXRocm91Z2ggKi9cbiAgICAgICAgc3ltYm9scy5zaGFwZSA9IHt2YWx1ZTogbWFya307XG4gICAgICAgIC8qIHRzbGludDplbmFibGU6bm8tc3dpdGNoLWNhc2UtZmFsbC10aHJvdWdoICovXG4gICAgICBjYXNlIFBPSU5UOlxuICAgICAgICAvLyBmaWxsIG9yIHN0cm9rZVxuICAgICAgICBpZiAobW9kZWwuY29uZmlnKCkubWFyay5maWxsZWQpIHsgLy8gZmlsbGVkXG4gICAgICAgICAgLy8gc2V0IHN0cm9rZSB0byB0cmFuc3BhcmVudCBieSBkZWZhdWx0IHVubGVzcyB0aGVyZSBpcyBhIGNvbmZpZyBmb3Igc3Ryb2tlXG4gICAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7dmFsdWU6ICd0cmFuc3BhcmVudCd9O1xuICAgICAgICAgIGFwcGx5TWFya0NvbmZpZyhzeW1ib2xzLCBtb2RlbCwgRklMTF9TVFJPS0VfQ09ORklHKTtcblxuICAgICAgICAgIGlmIChtb2RlbC5oYXMoQ09MT1IpICYmIGNoYW5uZWwgPT09IENPTE9SKSB7XG4gICAgICAgICAgICBzeW1ib2xzLmZpbGwgPSB7c2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xPUiksIGZpZWxkOiAnZGF0YSd9O1xuICAgICAgICAgIH0gZWxzZSBpZiAobW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlKSB7XG4gICAgICAgICAgICBzeW1ib2xzLmZpbGwgPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZX07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN5bWJvbHMuZmlsbCA9IHt2YWx1ZTogbW9kZWwuY29uZmlnKCkubWFyay5jb2xvcn07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBzdHJva2VkXG4gICAgICAgICAgLy8gc2V0IGZpbGwgdG8gdHJhbnNwYXJlbnQgYnkgZGVmYXVsdCB1bmxlc3MgdGhlcmUgaXMgYSBjb25maWcgZm9yIHN0cm9rZVxuICAgICAgICAgIHN5bWJvbHMuZmlsbCA9IHt2YWx1ZTogJ3RyYW5zcGFyZW50J307XG4gICAgICAgICAgYXBwbHlNYXJrQ29uZmlnKHN5bWJvbHMsIG1vZGVsLCBGSUxMX1NUUk9LRV9DT05GSUcpO1xuXG4gICAgICAgICAgaWYgKG1vZGVsLmhhcyhDT0xPUikgJiYgY2hhbm5lbCA9PT0gQ09MT1IpIHtcbiAgICAgICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3NjYWxlOiBtb2RlbC5zY2FsZU5hbWUoQ09MT1IpLCBmaWVsZDogJ2RhdGEnfTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZSkge1xuICAgICAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7dmFsdWU6IG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZX07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiBtb2RlbC5jb25maWcoKS5tYXJrLmNvbG9yfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTElORTpcbiAgICAgIGNhc2UgQVJFQTpcbiAgICAgICAgLy8gc2V0IHN0cm9rZSB0byB0cmFuc3BhcmVudCBieSBkZWZhdWx0IHVubGVzcyB0aGVyZSBpcyBhIGNvbmZpZyBmb3Igc3Ryb2tlXG4gICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcbiAgICAgICAgYXBwbHlNYXJrQ29uZmlnKHN5bWJvbHMsIG1vZGVsLCBGSUxMX1NUUk9LRV9DT05GSUcpO1xuXG4gICAgICAgIC8vIFRPRE8gdXNlIHNoYXBlIGhlcmUgYWZ0ZXIgaW1wbGVtZW50aW5nICM1MDhcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgc3ltYm9scyA9IGV4dGVuZChzeW1ib2xzLCBzeW1ib2xzU3BlYyB8fCB7fSk7XG5cbiAgICByZXR1cm4ga2V5cyhzeW1ib2xzKS5sZW5ndGggPiAwID8gc3ltYm9scyA6IHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge1gsIFl9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHthcHBseUNvbG9yQW5kT3BhY2l0eSwgYXBwbHlNYXJrQ29uZmlnfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgbmFtZXNwYWNlIGFyZWEge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdhcmVhJztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxuICAgIHZhciBwOiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IG9yaWVudCA9IG1vZGVsLmNvbmZpZygpLm1hcmsub3JpZW50O1xuICAgIGlmIChvcmllbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcC5vcmllbnQgPSB7IHZhbHVlOiBvcmllbnQgfTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFjayA9IG1vZGVsLnN0YWNrKCk7XG4gICAgLy8geFxuICAgIGlmIChzdGFjayAmJiBYID09PSBzdGFjay5maWVsZENoYW5uZWwpIHsgLy8gU3RhY2tlZCBNZWFzdXJlXG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IHN1ZmZpeDogJ19zdGFydCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5pc01lYXN1cmUoWCkpIHsgLy8gTWVhc3VyZVxuICAgICAgcC54ID0geyBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLCBmaWVsZDogbW9kZWwuZmllbGQoWCkgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmlzRGltZW5zaW9uKFgpKSB7XG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHgyXG4gICAgaWYgKG9yaWVudCA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBpZiAoc3RhY2sgJiYgWCA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XG4gICAgICAgIHAueDIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBzdWZmaXg6ICdfZW5kJyB9KVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcC54MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChzdGFjayAmJiBZID09PSBzdGFjay5maWVsZENoYW5uZWwpIHsgLy8gU3RhY2tlZCBNZWFzdXJlXG4gICAgICBwLnkgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IHN1ZmZpeDogJ19zdGFydCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5pc01lYXN1cmUoWSkpIHtcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobW9kZWwuaXNEaW1lbnNpb24oWSkpIHtcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKG9yaWVudCAhPT0gJ2hvcml6b250YWwnKSB7IC8vICd2ZXJ0aWNhbCcgb3IgdW5kZWZpbmVkIGFyZSB2ZXJ0aWNhbFxuICAgICAgaWYgKHN0YWNrICYmIFkgPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xuICAgICAgICBwLnkyID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgc3VmZml4OiAnX2VuZCcgfSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAueTIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsKTtcbiAgICBhcHBseU1hcmtDb25maWcocCwgbW9kZWwsIFsnaW50ZXJwb2xhdGUnLCAndGVuc2lvbiddKTtcbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBTSVpFfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlDb2xvckFuZE9wYWNpdHl9IGZyb20gJy4vdXRpbCc7XG5cblxuZXhwb3J0IG5hbWVzcGFjZSBiYXIge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdyZWN0JztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxuICAgIGxldCBwOiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IG9yaWVudCA9IG1vZGVsLmNvbmZpZygpLm1hcmsub3JpZW50O1xuXG4gICAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaygpO1xuICAgIC8vIHgsIHgyLCBhbmQgd2lkdGggLS0gd2UgbXVzdCBzcGVjaWZ5IHR3byBvZiB0aGVzZSBpbiBhbGwgY29uZGl0aW9uc1xuICAgIGlmIChzdGFjayAmJiBYID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcbiAgICAgIC8vICd4JyBpcyBhIHN0YWNrZWQgbWVhc3VyZSwgdGh1cyB1c2UgPGZpZWxkPl9zdGFydCBhbmQgPGZpZWxkPl9lbmQgZm9yIHgsIHgyLlxuICAgICAgcC54ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBzdWZmaXg6ICdfc3RhcnQnIH0pXG4gICAgICB9O1xuICAgICAgcC54MiA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgc3VmZml4OiAnX2VuZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5pc01lYXN1cmUoWCkpIHtcbiAgICAgIGlmIChvcmllbnQgPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICBwLnggPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWClcbiAgICAgICAgfTtcbiAgICAgICAgcC54MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgeyAvLyB2ZXJ0aWNhbFxuICAgICAgICBwLnhjID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpXG4gICAgICAgIH07XG4gICAgICAgIHAud2lkdGggPSB7dmFsdWU6IG1vZGVsLnNpemVWYWx1ZShYKX07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtb2RlbC5maWVsZERlZihYKS5iaW4pIHtcbiAgICAgIGlmIChtb2RlbC5oYXMoU0laRSkgJiYgb3JpZW50ICE9PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgLy8gRm9yIHZlcnRpY2FsIGNoYXJ0IHRoYXQgaGFzIGJpbm5lZCBYIGFuZCBzaXplLFxuICAgICAgICAvLyBjZW50ZXIgYmFyIGFuZCBhcHBseSBzaXplIHRvIHdpZHRoLlxuICAgICAgICBwLnhjID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgICAgfTtcbiAgICAgICAgcC53aWR0aCA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcC54ID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX3N0YXJ0JyB9KSxcbiAgICAgICAgICBvZmZzZXQ6IDFcbiAgICAgICAgfTtcbiAgICAgICAgcC54MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19lbmQnIH0pXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8geCBpcyBkaW1lbnNpb24gb3IgdW5zcGVjaWZpZWRcbiAgICAgIGlmIChtb2RlbC5oYXMoWCkpIHsgLy8gaXMgb3JkaW5hbFxuICAgICAgIHAueGMgPSB7XG4gICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpXG4gICAgICAgfTtcbiAgICAgfSBlbHNlIHsgLy8gbm8geFxuICAgICAgICBwLnggPSB7IHZhbHVlOiAwLCBvZmZzZXQ6IDIgfTtcbiAgICAgIH1cblxuICAgICAgcC53aWR0aCA9IG1vZGVsLmhhcyhTSVpFKSAmJiBvcmllbnQgIT09ICdob3Jpem9udGFsJyA/IHtcbiAgICAgICAgICAvLyBhcHBseSBzaXplIHNjYWxlIGlmIGhhcyBzaXplIGFuZCBpcyB2ZXJ0aWNhbCAoZXhwbGljaXQgXCJ2ZXJ0aWNhbFwiIG9yIHVuZGVmaW5lZClcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxuICAgICAgICB9IDoge1xuICAgICAgICAgIC8vIG90aGVyd2lzZSwgdXNlIGZpeGVkIHNpemVcbiAgICAgICAgICB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKFgpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8geSwgeTIgJiBoZWlnaHQgLS0gd2UgbXVzdCBzcGVjaWZ5IHR3byBvZiB0aGVzZSBpbiBhbGwgY29uZGl0aW9uc1xuICAgIGlmIChzdGFjayAmJiBZID09PSBzdGFjay5maWVsZENoYW5uZWwpIHsgLy8geSBpcyBzdGFja2VkIG1lYXN1cmVcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgc3VmZml4OiAnX3N0YXJ0JyB9KVxuICAgICAgfTtcbiAgICAgIHAueTIgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IHN1ZmZpeDogJ19lbmQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobW9kZWwuaXNNZWFzdXJlKFkpKSB7XG4gICAgICBpZiAob3JpZW50ICE9PSAnaG9yaXpvbnRhbCcpIHsgLy8gdmVydGljYWwgKGV4cGxpY2l0ICd2ZXJ0aWNhbCcgb3IgdW5kZWZpbmVkKVxuICAgICAgICBwLnkgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSlcbiAgICAgICAgfTtcbiAgICAgICAgcC55MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLnljID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpXG4gICAgICAgIH07XG4gICAgICAgIHAuaGVpZ2h0ID0geyB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKFkpIH07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtb2RlbC5maWVsZERlZihZKS5iaW4pIHtcbiAgICAgIGlmIChtb2RlbC5oYXMoU0laRSkgJiYgb3JpZW50ID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgLy8gRm9yIGhvcml6b250YWwgY2hhcnQgdGhhdCBoYXMgYmlubmVkIFkgYW5kIHNpemUsXG4gICAgICAgIC8vIGNlbnRlciBiYXIgYW5kIGFwcGx5IHNpemUgdG8gaGVpZ2h0LlxuICAgICAgICBwLnljID0ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgICAgfTtcbiAgICAgICAgcC5oZWlnaHQgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSwgc2ltcGx5IHVzZSA8ZmllbGQ+X3N0YXJ0LCA8ZmllbGQ+X2VuZFxuICAgICAgICBwLnkgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfc3RhcnQnIH0pXG4gICAgICAgIH07XG4gICAgICAgIHAueTIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfZW5kJyB9KSxcbiAgICAgICAgICBvZmZzZXQ6IDFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyB5IGlzIG9yZGluYWwgb3IgdW5zcGVjaWZpZWRcblxuICAgICAgaWYgKG1vZGVsLmhhcyhZKSkgeyAvLyBpcyBvcmRpbmFsXG4gICAgICAgIHAueWMgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7IC8vIE5vIFlcbiAgICAgICAgcC55MiA9IHtcbiAgICAgICAgICBmaWVsZDogeyBncm91cDogJ2hlaWdodCcgfSxcbiAgICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHAuaGVpZ2h0ID0gbW9kZWwuaGFzKFNJWkUpICAmJiBvcmllbnQgPT09ICdob3Jpem9udGFsJyA/IHtcbiAgICAgICAgICAvLyBhcHBseSBzaXplIHNjYWxlIGlmIGhhcyBzaXplIGFuZCBpcyBob3Jpem9udGFsXG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgICAgfSA6IHtcbiAgICAgICAgICB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKFkpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXBwbHlDb2xvckFuZE9wYWNpdHkocCwgbW9kZWwpO1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhYmVscyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPKCM2NCk6IGZpbGwgdGhpcyBtZXRob2RcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7WCwgWX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2FwcGx5Q29sb3JBbmRPcGFjaXR5LCBhcHBseU1hcmtDb25maWcsIENvbG9yTW9kZX0gZnJvbSAnLi91dGlsJztcblxuXG5leHBvcnQgbmFtZXNwYWNlIGxpbmUge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdsaW5lJztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxuICAgIHZhciBwOiBhbnkgPSB7fTtcblxuICAgIC8vIHhcbiAgICBpZiAobW9kZWwuaGFzKFgpKSB7XG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnggPSB7IHZhbHVlOiAwIH07XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChtb2RlbC5oYXMoWSkpIHtcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueSA9IHsgZmllbGQ6IHsgZ3JvdXA6ICdoZWlnaHQnIH0gfTtcbiAgICB9XG5cbiAgICBhcHBseUNvbG9yQW5kT3BhY2l0eShwLCBtb2RlbCwgQ29sb3JNb2RlLkFMV0FZU19TVFJPS0VEKTtcbiAgICBhcHBseU1hcmtDb25maWcocCwgbW9kZWwsIFsnaW50ZXJwb2xhdGUnLCAndGVuc2lvbiddKTtcbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBTSEFQRSwgU0laRX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2FwcGx5Q29sb3JBbmRPcGFjaXR5LCBDb2xvck1vZGV9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgcG9pbnQge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdzeW1ib2wnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsLCBmaXhlZFNoYXBlPzogc3RyaW5nKSB7XG4gICAgLy8gVE9ETyBVc2UgVmVnYSdzIG1hcmtzIHByb3BlcnRpZXMgaW50ZXJmYWNlXG4gICAgdmFyIHA6IGFueSA9IHt9O1xuXG4gICAgLy8geFxuICAgIGlmIChtb2RlbC5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueCA9IHsgdmFsdWU6IDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi8gLyAyIH07XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChtb2RlbC5oYXMoWSkpIHtcbiAgICAgIHAueSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFksIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueSA9IHsgdmFsdWU6IDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi8gLyAyIH07XG4gICAgfVxuXG4gICAgLy8gc2l6ZVxuICAgIGlmIChtb2RlbC5oYXMoU0laRSkpIHtcbiAgICAgIHAuc2l6ZSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnNpemUgPSB7IHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoKSB9O1xuICAgIH1cblxuICAgIC8vIHNoYXBlXG4gICAgaWYgKGZpeGVkU2hhcGUpIHsgLy8gc3F1YXJlIGFuZCBjaXJjbGUgbWFya3NcbiAgICAgIHAuc2hhcGUgPSB7IHZhbHVlOiBmaXhlZFNoYXBlIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5oYXMoU0hBUEUpKSB7XG4gICAgICBwLnNoYXBlID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNIQVBFKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNIQVBFKVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmZpZWxkRGVmKFNIQVBFKS52YWx1ZSkge1xuICAgICAgcC5zaGFwZSA9IHsgdmFsdWU6IG1vZGVsLmZpZWxkRGVmKFNIQVBFKS52YWx1ZSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnNoYXBlID0geyB2YWx1ZTogbW9kZWwuY29uZmlnKCkubWFyay5zaGFwZSB9O1xuICAgIH1cblxuICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsLFxuICAgICAgLy8gc3F1YXJlIGFuZCBjaXJjbGUgYXJlIGZpbGxlZCBieSBkZWZhdWx0LCBidXQgcG9pbnQgaXMgc3Ryb2tlZCBieSBkZWZhdWx0LlxuICAgICAgZml4ZWRTaGFwZSA/IENvbG9yTW9kZS5GSUxMRURfQllfREVGQVVMVCA6IENvbG9yTW9kZS5TVFJPS0VEX0JZX0RFRkFVTFRcbiAgICApO1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhYmVscyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPKCMyNDApOiBmaWxsIHRoaXMgbWV0aG9kXG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBjaXJjbGUge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdzeW1ib2wnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIHBvaW50LnByb3BlcnRpZXMobW9kZWwsICdjaXJjbGUnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBzcXVhcmUge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdzeW1ib2wnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIHBvaW50LnByb3BlcnRpZXMobW9kZWwsICdzcXVhcmUnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBDT0xPUiwgVEVYVCwgU0laRX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2FwcGx5TWFya0NvbmZpZywgYXBwbHlDb2xvckFuZE9wYWNpdHksIGZvcm1hdE1peGluc30gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7ZXh0ZW5kLCBjb250YWluc30gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge1FVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuXG5leHBvcnQgbmFtZXNwYWNlIHRleHQge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICd0ZXh0JztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBiYWNrZ3JvdW5kKG1vZGVsOiBNb2RlbCkge1xuICAgIHJldHVybiB7XG4gICAgICB4OiB7IHZhbHVlOiAwIH0sXG4gICAgICB5OiB7IHZhbHVlOiAwIH0sXG4gICAgICB3aWR0aDogeyBmaWVsZDogeyBncm91cDogJ3dpZHRoJyB9IH0sXG4gICAgICBoZWlnaHQ6IHsgZmllbGQ6IHsgZ3JvdXA6ICdoZWlnaHQnIH0gfSxcbiAgICAgIGZpbGw6IHsgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xPUiksIGZpZWxkOiBtb2RlbC5maWVsZChDT0xPUikgfVxuICAgIH07XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJvcGVydGllcyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPIFVzZSBWZWdhJ3MgbWFya3MgcHJvcGVydGllcyBpbnRlcmZhY2VcbiAgICBsZXQgcDogYW55ID0ge307XG4gICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihURVhUKTtcblxuICAgIC8vIHhcbiAgICBpZiAobW9kZWwuaGFzKFgpKSB7XG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7IC8vIFRPRE86IHN1cHBvcnQgeC52YWx1ZSwgeC5kYXR1bVxuICAgICAgaWYgKG1vZGVsLmhhcyhURVhUKSAmJiBtb2RlbC5maWVsZERlZihURVhUKS50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICAgICAgcC54ID0geyBmaWVsZDogeyBncm91cDogJ3dpZHRoJyB9LCBvZmZzZXQ6IC01IH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLnggPSB7IHZhbHVlOiA5MCAvIDIgfTsgLy8gVE9ETzogY29uZmlnLnNjYWxlLnRleHRCYW5kV2lkdGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKG1vZGVsLmhhcyhZKSkge1xuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC55ID0geyB2YWx1ZTogMjEgLyAyIH07IC8vIFRPRE86IGNvbmZpZy5zY2FsZS5iYW5kV2lkdGhcbiAgICB9XG5cbiAgICAvLyBzaXplXG4gICAgaWYgKG1vZGVsLmhhcyhTSVpFKSkge1xuICAgICAgcC5mb250U2l6ZSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLmZvbnRTaXplID0geyB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKCkgfTtcbiAgICB9XG5cbiAgICBpZiAobW9kZWwuY29uZmlnKCkubWFyay5hcHBseUNvbG9yVG9CYWNrZ3JvdW5kICYmICFtb2RlbC5oYXMoWCkgJiYgIW1vZGVsLmhhcyhZKSkge1xuICAgICAgcC5maWxsID0ge3ZhbHVlOiAnYmxhY2snfTsgLy8gVE9ETzogYWRkIHJ1bGVzIGZvciBzd2FwcGluZyBiZXR3ZWVuIGJsYWNrIGFuZCB3aGl0ZVxuXG4gICAgICAvLyBvcGFjaXR5XG4gICAgICBjb25zdCBvcGFjaXR5ID0gbW9kZWwuY29uZmlnKCkubWFyay5vcGFjaXR5O1xuICAgICAgaWYgKG9wYWNpdHkpIHsgcC5vcGFjaXR5ID0geyB2YWx1ZTogb3BhY2l0eSB9OyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHBseUNvbG9yQW5kT3BhY2l0eShwLCBtb2RlbCk7XG4gICAgfVxuXG5cbiAgICAvLyB0ZXh0XG4gICAgaWYgKG1vZGVsLmhhcyhURVhUKSkge1xuICAgICAgaWYgKGNvbnRhaW5zKFtRVUFOVElUQVRJVkUsIFRFTVBPUkFMXSwgbW9kZWwuZmllbGREZWYoVEVYVCkudHlwZSkpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0ID0gbW9kZWwuY29uZmlnKCkubWFyay5mb3JtYXQ7XG4gICAgICAgIGV4dGVuZChwLCBmb3JtYXRNaXhpbnMobW9kZWwsIFRFWFQsIGZvcm1hdCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcC50ZXh0ID0geyBmaWVsZDogbW9kZWwuZmllbGQoVEVYVCkgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcC50ZXh0ID0geyB2YWx1ZTogZmllbGREZWYudmFsdWUgfTtcbiAgICB9XG5cbiAgICBhcHBseU1hcmtDb25maWcocCwgbW9kZWwsXG4gICAgICBbJ2FuZ2xlJywgJ2FsaWduJywgJ2Jhc2VsaW5lJywgJ2R4JywgJ2R5JywgJ2ZvbnQnLCAnZm9udFdlaWdodCcsXG4gICAgICAgICdmb250U3R5bGUnLCAncmFkaXVzJywgJ3RoZXRhJ10pO1xuXG4gICAgcmV0dXJuIHA7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBTSVpFfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlDb2xvckFuZE9wYWNpdHksIENvbG9yTW9kZX0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IG5hbWVzcGFjZSB0aWNrIHtcbiAgZXhwb3J0IGZ1bmN0aW9uIG1hcmtUeXBlKCkge1xuICAgIHJldHVybiAncmVjdCc7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJvcGVydGllcyhtb2RlbDogTW9kZWwpIHtcbiAgICB2YXIgcDogYW55ID0ge307XG5cbiAgICAvLyB4XG4gICAgaWYgKG1vZGVsLmhhcyhYKSkge1xuICAgICAgcC54YyA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueGMgPSB7IHZhbHVlOiAyMSAvKiBjb25maWcuc2NhbGUuYmFuZFdpZHRoICovIC8gMiB9O1xuICAgIH1cblxuICAgIC8vIHlcbiAgICBpZiAobW9kZWwuaGFzKFkpKSB7XG4gICAgICBwLnljID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC55YyA9IHsgdmFsdWU6IDIxIC8qIGNvbmZpZy5zY2FsZS5iYW5kV2lkdGggKi8gLyAyIH07XG4gICAgfVxuXG4gICAgaWYgKG1vZGVsLmNvbmZpZygpLm1hcmsub3JpZW50ID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIHAud2lkdGggPSB7IHZhbHVlOiBtb2RlbC5jb25maWcoKS5tYXJrLnRoaWNrbmVzcyB9O1xuICAgICAgcC5oZWlnaHQgPSBtb2RlbC5oYXMoU0laRSk/IHtcbiAgICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoU0laRSksXG4gICAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgICAgfSA6IHtcbiAgICAgICAgICAgIHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoWSlcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC53aWR0aCA9IG1vZGVsLmhhcyhTSVpFKT8ge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoU0laRSksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXG4gICAgICAgIH0gOiB7XG4gICAgICAgICAgdmFsdWU6IG1vZGVsLnNpemVWYWx1ZShYKVxuICAgICAgICB9O1xuICAgICAgcC5oZWlnaHQgPSB7IHZhbHVlOiBtb2RlbC5jb25maWcoKS5tYXJrLnRoaWNrbmVzcyB9O1xuICAgIH1cblxuICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsLCBDb2xvck1vZGUuQUxXQVlTX0ZJTExFRCk7XG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbGFiZWxzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8oIzI0MCk6IGZpbGwgdGhpcyBtZXRob2RcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7WCwgWSwgQ09MT1IsIFRFWFQsIFNIQVBFLCBQQVRILCBPUkRFUiwgREVUQUlMLCBST1csIENPTFVNTiwgTEFCRUx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtBUkVBLCBMSU5FLCBURVhUIGFzIFRFWFRNQVJLfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7aW1wdXRlVHJhbnNmb3JtLCBzdGFja1RyYW5zZm9ybX0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge2NvbnRhaW5zLCBleHRlbmQsIGlzQXJyYXl9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHthcmVhfSBmcm9tICcuL21hcmstYXJlYSc7XG5pbXBvcnQge2Jhcn0gZnJvbSAnLi9tYXJrLWJhcic7XG5pbXBvcnQge2xpbmV9IGZyb20gJy4vbWFyay1saW5lJztcbmltcG9ydCB7cG9pbnQsIGNpcmNsZSwgc3F1YXJlfSBmcm9tICcuL21hcmstcG9pbnQnO1xuaW1wb3J0IHt0ZXh0fSBmcm9tICcuL21hcmstdGV4dCc7XG5pbXBvcnQge3RpY2t9IGZyb20gJy4vbWFyay10aWNrJztcbmltcG9ydCB7c29ydEZpZWxkfSBmcm9tICcuL3V0aWwnO1xuXG5cbmNvbnN0IG1hcmtDb21waWxlciA9IHtcbiAgYXJlYTogYXJlYSxcbiAgYmFyOiBiYXIsXG4gIGxpbmU6IGxpbmUsXG4gIHBvaW50OiBwb2ludCxcbiAgdGV4dDogdGV4dCxcbiAgdGljazogdGljayxcbiAgY2lyY2xlOiBjaXJjbGUsXG4gIHNxdWFyZTogc3F1YXJlXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZU1hcmsobW9kZWw6IE1vZGVsKTogYW55W10ge1xuICBpZiAoY29udGFpbnMoW0xJTkUsIEFSRUFdLCBtb2RlbC5tYXJrKCkpKSB7XG4gICAgcmV0dXJuIGNvbXBpbGVQYXRoTWFyayhtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGNvbXBpbGVOb25QYXRoTWFyayhtb2RlbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcGlsZVBhdGhNYXJrKG1vZGVsOiBNb2RlbCkgeyAvLyBUT0RPOiBleHRyYWN0IHRoaXMgaW50byBjb21waWxlUGF0aE1hcmtcbiAgY29uc3QgbWFyayA9IG1vZGVsLm1hcmsoKTtcbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICBjb25zdCBpc0ZhY2V0ZWQgPSBtb2RlbC5oYXMoUk9XKSB8fCBtb2RlbC5oYXMoQ09MVU1OKTtcbiAgY29uc3QgZGF0YUZyb20gPSB7ZGF0YTogbW9kZWwuZGF0YVRhYmxlKCl9O1xuICBjb25zdCBkZXRhaWxzID0gZGV0YWlsRmllbGRzKG1vZGVsKTtcblxuICBsZXQgcGF0aE1hcmtzOiBhbnkgPSBbZXh0ZW5kKFxuICAgIG5hbWUgPyB7IG5hbWU6IG5hbWUgKyAnLW1hcmtzJyB9IDoge30sXG4gICAge1xuICAgICAgdHlwZTogbWFya0NvbXBpbGVyW21hcmtdLm1hcmtUeXBlKCksXG4gICAgICBmcm9tOiBleHRlbmQoXG4gICAgICAgIC8vIElmIGhhcyBmYWNldCwgYGZyb20uZGF0YWAgd2lsbCBiZSBhZGRlZCBpbiB0aGUgY2VsbCBncm91cC5cbiAgICAgICAgLy8gSWYgaGFzIHN1YmZhY2V0IGZvciBsaW5lL2FyZWEgZ3JvdXAsIGBmcm9tLmRhdGFgIHdpbGwgYmUgYWRkZWQgaW4gdGhlIG91dGVyIHN1YmZhY2V0IGdyb3VwIGJlbG93LlxuICAgICAgICAvLyBJZiBoYXMgbm8gc3ViZmFjZXQsIGFkZCBmcm9tLmRhdGEuXG4gICAgICAgIGlzRmFjZXRlZCB8fCBkZXRhaWxzLmxlbmd0aCA+IDAgPyB7fSA6IGRhdGFGcm9tLFxuXG4gICAgICAgIC8vIHNvcnQgdHJhbnNmb3JtXG4gICAgICAgIHt0cmFuc2Zvcm06IFt7IHR5cGU6ICdzb3J0JywgYnk6IHNvcnRQYXRoQnkobW9kZWwpfV19XG4gICAgICApLFxuICAgICAgcHJvcGVydGllczogeyB1cGRhdGU6IG1hcmtDb21waWxlclttYXJrXS5wcm9wZXJ0aWVzKG1vZGVsKSB9XG4gICAgfVxuICApXTtcblxuICBpZiAoZGV0YWlscy5sZW5ndGggPiAwKSB7IC8vIGhhdmUgbGV2ZWwgb2YgZGV0YWlscyAtIG5lZWQgdG8gZmFjZXQgbGluZSBpbnRvIHN1Ymdyb3Vwc1xuICAgIGNvbnN0IGZhY2V0VHJhbnNmb3JtID0geyB0eXBlOiAnZmFjZXQnLCBncm91cGJ5OiBkZXRhaWxzIH07XG4gICAgY29uc3QgdHJhbnNmb3JtOiBhbnlbXSA9IG1hcmsgPT09IEFSRUEgJiYgbW9kZWwuc3RhY2soKSA/XG4gICAgICAvLyBGb3Igc3RhY2tlZCBhcmVhLCB3ZSBuZWVkIHRvIGltcHV0ZSBtaXNzaW5nIHR1cGxlcyBhbmQgc3RhY2sgdmFsdWVzXG4gICAgICAvLyAoTWFyayBsYXllciBvcmRlciBkb2VzIG5vdCBtYXR0ZXIgZm9yIHN0YWNrZWQgY2hhcnRzKVxuICAgICAgW2ltcHV0ZVRyYW5zZm9ybShtb2RlbCksIHN0YWNrVHJhbnNmb3JtKG1vZGVsKSwgZmFjZXRUcmFuc2Zvcm1dIDpcbiAgICAgIC8vIEZvciBub24tc3RhY2tlZCBwYXRoIChsaW5lL2FyZWEpLCB3ZSBuZWVkIHRvIGZhY2V0IGFuZCBwb3NzaWJseSBzb3J0XG4gICAgICBbXS5jb25jYXQoXG4gICAgICAgIGZhY2V0VHJhbnNmb3JtLFxuICAgICAgICAvLyBpZiBtb2RlbCBoYXMgYG9yZGVyYCwgdGhlbiBzb3J0IG1hcmsncyBsYXllciBvcmRlciBieSBgb3JkZXJgIGZpZWxkKHMpXG4gICAgICAgIG1vZGVsLmhhcyhPUkRFUikgPyBbe3R5cGU6J3NvcnQnLCBieTogc29ydEJ5KG1vZGVsKX1dIDogW11cbiAgICAgICk7XG5cbiAgICByZXR1cm4gW3tcbiAgICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArIG1hcmsgKyAnLWZhY2V0JyxcbiAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICBmcm9tOiBleHRlbmQoXG4gICAgICAgIC8vIElmIGhhcyBmYWNldCwgYGZyb20uZGF0YWAgd2lsbCBiZSBhZGRlZCBpbiB0aGUgY2VsbCBncm91cC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhZGQgaXQgaGVyZS5cbiAgICAgICAgaXNGYWNldGVkID8ge30gOiBkYXRhRnJvbSxcbiAgICAgICAge3RyYW5zZm9ybTogdHJhbnNmb3JtfVxuICAgICAgKSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgd2lkdGg6IHsgZmllbGQ6IHsgZ3JvdXA6ICd3aWR0aCcgfSB9LFxuICAgICAgICAgIGhlaWdodDogeyBmaWVsZDogeyBncm91cDogJ2hlaWdodCcgfSB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBtYXJrczogcGF0aE1hcmtzXG4gICAgfV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBhdGhNYXJrcztcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21waWxlTm9uUGF0aE1hcmsobW9kZWw6IE1vZGVsKSB7XG4gIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrKCk7XG4gIGNvbnN0IG5hbWUgPSBtb2RlbC5zcGVjKCkubmFtZTtcbiAgY29uc3QgaXNGYWNldGVkID0gbW9kZWwuaGFzKFJPVykgfHwgbW9kZWwuaGFzKENPTFVNTik7XG4gIGNvbnN0IGRhdGFGcm9tID0ge2RhdGE6IG1vZGVsLmRhdGFUYWJsZSgpfTtcblxuICBsZXQgbWFya3MgPSBbXTsgLy8gVE9ETzogdmdNYXJrc1xuICBpZiAobWFyayA9PT0gVEVYVE1BUksgJiZcbiAgICBtb2RlbC5oYXMoQ09MT1IpICYmXG4gICAgbW9kZWwuY29uZmlnKCkubWFyay5hcHBseUNvbG9yVG9CYWNrZ3JvdW5kICYmICFtb2RlbC5oYXMoWCkgJiYgIW1vZGVsLmhhcyhZKVxuICApIHtcbiAgICAvLyBhZGQgYmFja2dyb3VuZCB0byAndGV4dCcgbWFya3MgaWYgaGFzIGNvbG9yXG4gICAgbWFya3MucHVzaChleHRlbmQoXG4gICAgICBuYW1lID8geyBuYW1lOiBuYW1lICsgJy1iYWNrZ3JvdW5kJyB9IDoge30sXG4gICAgICB7IHR5cGU6ICdyZWN0JyB9LFxuICAgICAgLy8gSWYgaGFzIGZhY2V0LCBgZnJvbS5kYXRhYCB3aWxsIGJlIGFkZGVkIGluIHRoZSBjZWxsIGdyb3VwLlxuICAgICAgLy8gT3RoZXJ3aXNlLCBhZGQgaXQgaGVyZS5cbiAgICAgIGlzRmFjZXRlZCA/IHt9IDoge2Zyb206IGRhdGFGcm9tfSxcbiAgICAgIC8vIFByb3BlcnRpZXNcbiAgICAgIHsgcHJvcGVydGllczogeyB1cGRhdGU6IHRleHQuYmFja2dyb3VuZChtb2RlbCkgfSB9XG4gICAgKSk7XG4gIH1cblxuICBtYXJrcy5wdXNoKGV4dGVuZChcbiAgICBuYW1lID8geyBuYW1lOiBuYW1lICsgJy1tYXJrcycgfSA6IHt9LFxuICAgIHsgdHlwZTogbWFya0NvbXBpbGVyW21hcmtdLm1hcmtUeXBlKCkgfSxcbiAgICAvLyBBZGQgYGZyb21gIGlmIG5lZWRlZFxuICAgICghaXNGYWNldGVkIHx8IG1vZGVsLnN0YWNrKCkgfHwgbW9kZWwuaGFzKE9SREVSKSkgPyB7XG4gICAgICBmcm9tOiBleHRlbmQoXG4gICAgICAgIC8vIElmIGZhY2V0ZWQsIGBmcm9tLmRhdGFgIHdpbGwgYmUgYWRkZWQgaW4gdGhlIGNlbGwgZ3JvdXAuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgYWRkIGl0IGhlcmVcbiAgICAgICAgaXNGYWNldGVkID8ge30gOiBkYXRhRnJvbSxcbiAgICAgICAgLy8gYGZyb20udHJhbnNmb3JtYFxuICAgICAgICBtb2RlbC5zdGFjaygpID8gLy8gU3RhY2tlZCBDaGFydCBuZWVkIHN0YWNrIHRyYW5zZm9ybVxuICAgICAgICAgIHsgdHJhbnNmb3JtOiBbc3RhY2tUcmFuc2Zvcm0obW9kZWwpXSB9IDpcbiAgICAgICAgbW9kZWwuaGFzKE9SREVSKSA/XG4gICAgICAgICAgLy8gaWYgbm9uLXN0YWNrZWQsIGRldGFpbCBmaWVsZCBkZXRlcm1pbmVzIHRoZSBsYXllciBvcmRlciBvZiBlYWNoIG1hcmtcbiAgICAgICAgICB7IHRyYW5zZm9ybTogW3t0eXBlOidzb3J0JywgYnk6IHNvcnRCeShtb2RlbCl9XSB9IDpcbiAgICAgICAgICB7fVxuICAgICAgKVxuICAgIH0gOiB7fSxcbiAgICAvLyBwcm9wZXJ0aWVzIGdyb3Vwc1xuICAgIHsgcHJvcGVydGllczogeyB1cGRhdGU6IG1hcmtDb21waWxlclttYXJrXS5wcm9wZXJ0aWVzKG1vZGVsKSB9IH1cbiAgKSk7XG5cbiAgaWYgKG1vZGVsLmhhcyhMQUJFTCkgJiYgbWFya0NvbXBpbGVyW21hcmtdLmxhYmVscykge1xuICAgIGNvbnN0IGxhYmVsUHJvcGVydGllcyA9IG1hcmtDb21waWxlclttYXJrXS5sYWJlbHMobW9kZWwpO1xuXG4gICAgLy8gY2hlY2sgaWYgd2UgaGF2ZSBsYWJlbCBtZXRob2QgZm9yIGN1cnJlbnQgbWFyayB0eXBlLlxuICAgIGlmIChsYWJlbFByb3BlcnRpZXMgIT09IHVuZGVmaW5lZCkgeyAvLyBJZiBsYWJlbCBpcyBzdXBwb3J0ZWRcbiAgICAgIC8vIGFkZCBsYWJlbCBncm91cFxuICAgICAgbWFya3MucHVzaChleHRlbmQoXG4gICAgICAgIG5hbWUgPyB7IG5hbWU6IG5hbWUgKyAnLWxhYmVsJyB9IDoge30sXG4gICAgICAgIHt0eXBlOiAndGV4dCd9LFxuICAgICAgICAvLyBJZiBoYXMgZmFjZXQsIGBmcm9tLmRhdGFgIHdpbGwgYmUgYWRkZWQgaW4gdGhlIGNlbGwgZ3JvdXAuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgYWRkIGl0IGhlcmUuXG4gICAgICAgIGlzRmFjZXRlZCA/IHt9IDoge2Zyb206IGRhdGFGcm9tfSxcbiAgICAgICAgLy8gUHJvcGVydGllc1xuICAgICAgICB7IHByb3BlcnRpZXM6IHsgdXBkYXRlOiBsYWJlbFByb3BlcnRpZXMgfSB9XG4gICAgICApKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWFya3M7XG59XG5cbmZ1bmN0aW9uIHNvcnRCeShtb2RlbDogTW9kZWwpIHtcbiAgaWYgKG1vZGVsLmhhcyhPUkRFUikpIHtcbiAgICB2YXIgY2hhbm5lbEVuY29kaW5nID0gbW9kZWwuc3BlYygpLmVuY29kaW5nW09SREVSXTtcbiAgICByZXR1cm4gaXNBcnJheShjaGFubmVsRW5jb2RpbmcpID9cbiAgICAgIGNoYW5uZWxFbmNvZGluZy5tYXAoc29ydEZpZWxkKSA6IC8vIHNvcnQgYnkgbXVsdGlwbGUgZmllbGRzXG4gICAgICBzb3J0RmllbGQoY2hhbm5lbEVuY29kaW5nKTsgICAgICAvLyBzb3J0IGJ5IG9uZSBmaWVsZFxuICB9XG4gIHJldHVybiBudWxsOyAvLyB1c2UgZGVmYXVsdCBvcmRlclxufVxuXG4vKipcbiAqIFJldHVybiBwYXRoIG9yZGVyIGZvciBzb3J0IHRyYW5zZm9ybSdzIGJ5IHByb3BlcnR5XG4gKi9cbmZ1bmN0aW9uIHNvcnRQYXRoQnkobW9kZWw6IE1vZGVsKSB7XG4gIGlmIChtb2RlbC5tYXJrKCkgPT09IExJTkUgJiYgbW9kZWwuaGFzKFBBVEgpKSB7XG4gICAgLy8gRm9yIG9ubHkgbGluZSwgc29ydCBieSB0aGUgcGF0aCBmaWVsZCBpZiBpdCBpcyBzcGVjaWZpZWQuXG4gICAgY29uc3QgY2hhbm5lbEVuY29kaW5nID0gbW9kZWwuc3BlYygpLmVuY29kaW5nW1BBVEhdO1xuICAgIHJldHVybiBpc0FycmF5KGNoYW5uZWxFbmNvZGluZykgP1xuICAgICAgY2hhbm5lbEVuY29kaW5nLm1hcChzb3J0RmllbGQpIDogLy8gc29ydCBieSBtdWx0aXBsZSBmaWVsZHNcbiAgICAgIHNvcnRGaWVsZChjaGFubmVsRW5jb2RpbmcpO1xuICB9IGVsc2Uge1xuICAgIC8vIEZvciBib3RoIGxpbmUgYW5kIGFyZWEsIHdlIHNvcnQgdmFsdWVzIGJhc2VkIG9uIGRpbWVuc2lvbiBieSBkZWZhdWx0XG4gICAgcmV0dXJuICctJyArIG1vZGVsLmZpZWxkKG1vZGVsLmNvbmZpZygpLm1hcmsub3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyBZIDogWCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGxpc3Qgb2YgZGV0YWlsIGZpZWxkcyAoZm9yICdjb2xvcicsICdzaGFwZScsIG9yICdkZXRhaWwnIGNoYW5uZWxzKVxuICogdGhhdCB0aGUgbW9kZWwncyBzcGVjIGNvbnRhaW5zLlxuICovXG5mdW5jdGlvbiBkZXRhaWxGaWVsZHMobW9kZWw6IE1vZGVsKTogc3RyaW5nW10ge1xuICByZXR1cm4gW0NPTE9SLCBERVRBSUwsIFNIQVBFXS5yZWR1Y2UoZnVuY3Rpb24oZGV0YWlscywgY2hhbm5lbCkge1xuICAgIGlmIChtb2RlbC5oYXMoY2hhbm5lbCkgJiYgIW1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmFnZ3JlZ2F0ZSkge1xuICAgICAgZGV0YWlscy5wdXNoKG1vZGVsLmZpZWxkKGNoYW5uZWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH0sIFtdKTtcbn1cbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9ibG9iL21hc3Rlci9kb2Mvc3BlYy5tZCMxMS1hbWJpZW50LWRlY2xhcmF0aW9uc1xuZGVjbGFyZSB2YXIgZXhwb3J0cztcblxuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5cbmltcG9ydCB7Y29udGFpbnMsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7U0hBUkVEX0RPTUFJTl9PUFN9IGZyb20gJy4uL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZLCBTSEFQRSwgU0laRSwgQ09MT1IsIFRFWFQsIGhhc1NjYWxlLCBDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7U09VUkNFLCBTVEFDS0VEX1NDQUxFfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7Tk9NSU5BTCwgT1JESU5BTCwgUVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge01hcmssIEJBUiwgVEVYVCBhcyBURVhUX01BUkt9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtyYXdEb21haW59IGZyb20gJy4vdGltZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlU2NhbGVzKGNoYW5uZWxzOiBDaGFubmVsW10sIG1vZGVsOiBNb2RlbCkge1xuICByZXR1cm4gY2hhbm5lbHMuZmlsdGVyKGhhc1NjYWxlKVxuICAgIC5tYXAoZnVuY3Rpb24oY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICAgICAgdmFyIHNjYWxlRGVmOiBhbnkgPSB7XG4gICAgICAgIG5hbWU6IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKSxcbiAgICAgICAgdHlwZTogdHlwZShmaWVsZERlZiwgY2hhbm5lbCwgbW9kZWwubWFyaygpKSxcbiAgICAgIH07XG5cbiAgICAgIHNjYWxlRGVmLmRvbWFpbiA9IGRvbWFpbihtb2RlbCwgY2hhbm5lbCwgc2NhbGVEZWYudHlwZSk7XG4gICAgICBleHRlbmQoc2NhbGVEZWYsIHJhbmdlTWl4aW5zKG1vZGVsLCBjaGFubmVsLCBzY2FsZURlZi50eXBlKSk7XG5cbiAgICAgIC8vIEFkZCBvcHRpb25hbCBwcm9wZXJ0aWVzXG4gICAgICBbXG4gICAgICAgIC8vIGdlbmVyYWwgcHJvcGVydGllc1xuICAgICAgICAncmV2ZXJzZScsICdyb3VuZCcsXG4gICAgICAgIC8vIHF1YW50aXRhdGl2ZSAvIHRpbWVcbiAgICAgICAgJ2NsYW1wJywgJ25pY2UnLFxuICAgICAgICAvLyBxdWFudGl0YXRpdmVcbiAgICAgICAgJ2V4cG9uZW50JywgJ3plcm8nLFxuICAgICAgICAvLyBvcmRpbmFsXG4gICAgICAgICdvdXRlclBhZGRpbmcnLCAncGFkZGluZycsICdwb2ludHMnXG4gICAgICBdLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICAgICAgLy8gVE9ETyBpbmNsdWRlIGZpZWxkRGVmIGFzIHBhcnQgb2YgdGhlIHBhcmFtZXRlcnNcbiAgICAgICAgY29uc3QgdmFsdWUgPSBleHBvcnRzW3Byb3BlcnR5XShtb2RlbCwgY2hhbm5lbCwgc2NhbGVEZWYudHlwZSk7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc2NhbGVEZWZbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gc2NhbGVEZWY7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlKGZpZWxkRGVmOiBGaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCwgbWFyazogTWFyayk6IHN0cmluZyB7XG4gIGlmICghaGFzU2NhbGUoY2hhbm5lbCkpIHtcbiAgICAvLyBUaGVyZSBpcyBubyBzY2FsZSBmb3IgdGhlc2UgY2hhbm5lbHNcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFdlIGNhbid0IHVzZSBsaW5lYXIvdGltZSBmb3Igcm93LCBjb2x1bW4gb3Igc2hhcGVcbiAgaWYgKGNvbnRhaW5zKFtST1csIENPTFVNTiwgU0hBUEVdLCBjaGFubmVsKSkge1xuICAgIHJldHVybiAnb3JkaW5hbCc7XG4gIH1cblxuICBpZiAoZmllbGREZWYuc2NhbGUudHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZpZWxkRGVmLnNjYWxlLnR5cGU7XG4gIH1cblxuICBzd2l0Y2ggKGZpZWxkRGVmLnR5cGUpIHtcbiAgICBjYXNlIE5PTUlOQUw6XG4gICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgIGNhc2UgT1JESU5BTDpcbiAgICAgIHJldHVybiAnb3JkaW5hbCc7XG4gICAgY2FzZSBURU1QT1JBTDpcbiAgICAgIGlmIChjaGFubmVsID09PSBDT0xPUikge1xuICAgICAgICAvLyBGSVhNRSgjODkwKSBpZiB1c2VyIHNwZWNpZnkgc2NhbGUucmFuZ2UgYXMgb3JkaW5hbCBwcmVzZXRzLCB0aGVuIHRoaXMgc2hvdWxkIGJlIG9yZGluYWwuXG4gICAgICAgIC8vIEFsc28sIGlmIHdlIHN1cHBvcnQgY29sb3IgcmFtcCwgdGhpcyBzaG91bGQgYmUgb3JkaW5hbCB0b28uXG4gICAgICAgIHJldHVybiAndGltZSc7IC8vIHRpbWUgaGFzIG9yZGVyLCBzbyB1c2UgaW50ZXJwb2xhdGVkIG9yZGluYWwgY29sb3Igc2NhbGUuXG4gICAgICB9XG5cbiAgICAgIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICBzd2l0Y2ggKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgICAgY2FzZSAnaG91cnMnOlxuICAgICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgLy8gZGF0ZSwgeWVhciwgbWludXRlLCBzZWNvbmQsIHllYXJtb250aCwgbW9udGhkYXksIC4uLlxuICAgICAgICAgICAgcmV0dXJuICd0aW1lJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICd0aW1lJztcblxuICAgIGNhc2UgUVVBTlRJVEFUSVZFOlxuICAgICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgICAvLyBUT0RPKCM4OTApOiBJZGVhbGx5IGJpbm5lZCBDT0xPUiBzaG91bGQgYmUgYW4gb3JkaW5hbCBzY2FsZVxuICAgICAgICAvLyBIb3dldmVyLCBjdXJyZW50bHkgb3JkaW5hbCBzY2FsZSBkb2Vzbid0IHN1cHBvcnQgY29sb3IgcmFtcCB5ZXQuXG4gICAgICAgIHJldHVybiBjb250YWlucyhbWCwgWSwgQ09MT1JdLCBjaGFubmVsKSA/ICdsaW5lYXInIDogJ29yZGluYWwnO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdsaW5lYXInO1xuICB9XG5cbiAgLy8gc2hvdWxkIG5ldmVyIHJlYWNoIHRoaXNcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb21haW4obW9kZWw6IE1vZGVsLCBjaGFubmVsOkNoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIHZhciBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIGlmIChmaWVsZERlZi5zY2FsZS5kb21haW4pIHsgLy8gZXhwbGljaXQgdmFsdWVcbiAgICByZXR1cm4gZmllbGREZWYuc2NhbGUuZG9tYWluO1xuICB9XG5cbiAgLy8gc3BlY2lhbCBjYXNlIGZvciB0ZW1wb3JhbCBzY2FsZVxuICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICBpZiAocmF3RG9tYWluKGZpZWxkRGVmLnRpbWVVbml0LCBjaGFubmVsKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF0YTogZmllbGREZWYudGltZVVuaXQsXG4gICAgICAgIGZpZWxkOiAnZGF0ZSdcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwpLFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCksXG4gICAgICAgIG9wOiAnbWluJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBGb3Igc3RhY2ssIHVzZSBTVEFDS0VEIGRhdGEuXG4gIHZhciBzdGFjayA9IG1vZGVsLnN0YWNrKCk7XG4gIGlmIChzdGFjayAmJiBjaGFubmVsID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcbiAgICBpZihzdGFjay5vZmZzZXQgPT09ICdub3JtYWxpemUnKSB7XG4gICAgICByZXR1cm4gWzAsIDFdO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogU1RBQ0tFRF9TQ0FMRSxcbiAgICAgIC8vIFNUQUNLRURfU0NBTEUgcHJvZHVjZXMgc3VtIG9mIHRoZSBmaWVsZCdzIHZhbHVlIGUuZy4sIHN1bSBvZiBzdW0sIHN1bSBvZiBkaXN0aW5jdFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtwcmVmbjogJ3N1bV8nfSlcbiAgICB9O1xuICB9XG5cbiAgdmFyIHVzZVJhd0RvbWFpbiA9IF91c2VSYXdEb21haW4obW9kZWwsIGNoYW5uZWwsIHNjYWxlVHlwZSk7XG4gIHZhciBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgY2hhbm5lbCwgc2NhbGVUeXBlKTtcblxuICBpZiAodXNlUmF3RG9tYWluKSB7IC8vIHVzZVJhd0RvbWFpbiAtIG9ubHkgUS9UXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IFNPVVJDRSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7bm9BZ2dyZWdhdGU6IHRydWV9KVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYuYmluKSB7IC8vIGJpblxuICAgIHJldHVybiBzY2FsZVR5cGUgPT09ICdvcmRpbmFsJyA/IHtcbiAgICAgIC8vIG9yZGluYWwgYmluIHNjYWxlIHRha2VzIGRvbWFpbiBmcm9tIGJpbl9yYW5nZSwgb3JkZXJlZCBieSBiaW5fc3RhcnRcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHsgYmluU3VmZml4OiAnX3JhbmdlJyB9KSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHsgYmluU3VmZml4OiAnX3N0YXJ0JyB9KSxcbiAgICAgICAgb3A6ICdtaW4nIC8vIG1pbiBvciBtYXggZG9lc24ndCBtYXR0ZXIgc2luY2Ugc2FtZSBfcmFuZ2Ugd291bGQgaGF2ZSB0aGUgc2FtZSBfc3RhcnRcbiAgICAgIH1cbiAgICB9IDogY2hhbm5lbCA9PT0gQ09MT1IgPyB7XG4gICAgICAvLyBDdXJyZW50bHksIGJpbm5lZCBvbiBjb2xvciB1c2VzIGxpbmVhciBzY2FsZSBhbmQgdGh1cyB1c2UgX3N0YXJ0IHBvaW50XG4gICAgICAvLyBUT0RPOiBUaGlzIGlkZWFsbHkgc2hvdWxkIGJlY29tZSBvcmRpbmFsIHNjYWxlIG9uY2Ugb3JkaW5hbCBzY2FsZSBzdXBwb3J0cyBjb2xvciByYW1wLlxuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwgeyBiaW5TdWZmaXg6ICdfc3RhcnQnIH0pXG4gICAgfSA6IHtcbiAgICAgIC8vIG90aGVyIGxpbmVhciBiaW4gc2NhbGUgbWVyZ2VzIGJvdGggYmluX3N0YXJ0IGFuZCBiaW5fZW5kIGZvciBub24tb3JkaW5hbCBzY2FsZVxuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICBmaWVsZDogW1xuICAgICAgICBtb2RlbC5maWVsZChjaGFubmVsLCB7IGJpblN1ZmZpeDogJ19zdGFydCcgfSksXG4gICAgICAgIG1vZGVsLmZpZWxkKGNoYW5uZWwsIHsgYmluU3VmZml4OiAnX2VuZCcgfSlcbiAgICAgIF1cbiAgICB9O1xuICB9IGVsc2UgaWYgKHNvcnQpIHsgLy8gaGF2ZSBzb3J0IC0tIG9ubHkgZm9yIG9yZGluYWxcbiAgICByZXR1cm4ge1xuICAgICAgLy8gSWYgc29ydCBieSBhZ2dyZWdhdGlvbiBvZiBhIHNwZWNpZmllZCBzb3J0IGZpZWxkLCB3ZSBuZWVkIHRvIHVzZSBTT1VSQ0UgdGFibGUsXG4gICAgICAvLyBzbyB3ZSBjYW4gYWdncmVnYXRlIHZhbHVlcyBmb3IgdGhlIHNjYWxlIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgbWFpbiBhZ2dyZWdhdGlvbi5cbiAgICAgIGRhdGE6IHNvcnQub3AgPyBTT1VSQ0UgOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsKSxcbiAgICAgIHNvcnQ6IHNvcnRcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsKVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvbWFpblNvcnQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IHN0cmluZyk6IGFueSB7XG4gIHZhciBzb3J0ID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc29ydDtcbiAgaWYgKHNvcnQgPT09ICdhc2NlbmRpbmcnIHx8IHNvcnQgPT09ICdkZXNjZW5kaW5nJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gU29ydGVkIGJhc2VkIG9uIGFuIGFnZ3JlZ2F0ZSBjYWxjdWxhdGlvbiBvdmVyIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQgKG9ubHkgZm9yIG9yZGluYWwgc2NhbGUpXG4gIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJyAmJiB0eXBlb2Ygc29ydCAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3A6IHNvcnQub3AsXG4gICAgICBmaWVsZDogc29ydC5maWVsZFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldmVyc2UobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIHZhciBzb3J0ID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc29ydDtcbiAgcmV0dXJuIHNvcnQgJiYgKHR5cGVvZiBzb3J0ID09PSAnc3RyaW5nJyA/XG4gICAgICAgICAgICAgICAgICAgIHNvcnQgPT09ICdkZXNjZW5kaW5nJyA6XG4gICAgICAgICAgICAgICAgICAgIHNvcnQub3JkZXIgPT09ICdkZXNjZW5kaW5nJ1xuICAgICAgICAgICAgICAgICApID8gdHJ1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgdXNlUmF3RG9tYWluIHNob3VsZCBiZSBhY3RpdmF0ZWQgZm9yIHRoaXMgc2NhbGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIHRydWUgaWYgYWxsIG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0b25zIGFwcGxpZXM6XG4gKiAxLiBgdXNlUmF3RG9tYWluYCBpcyBlbmFibGVkIGVpdGhlciB0aHJvdWdoIHNjYWxlIG9yIGNvbmZpZ1xuICogMi4gQWdncmVnYXRpb24gZnVuY3Rpb24gaXMgbm90IGBjb3VudGAgb3IgYHN1bWBcbiAqIDMuIFRoZSBzY2FsZSBpcyBxdWFudGl0YXRpdmUgb3IgdGltZSBzY2FsZS5cbiAqL1xuZnVuY3Rpb24gX3VzZVJhd0RvbWFpbiAobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IHN0cmluZykge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIHJldHVybiBmaWVsZERlZi5zY2FsZS51c2VSYXdEb21haW4gJiYgLy8gIGlmIHVzZVJhd0RvbWFpbiBpcyBlbmFibGVkXG4gICAgLy8gb25seSBhcHBsaWVkIHRvIGFnZ3JlZ2F0ZSB0YWJsZVxuICAgIGZpZWxkRGVmLmFnZ3JlZ2F0ZSAmJlxuICAgIC8vIG9ubHkgYWN0aXZhdGVkIGlmIHVzZWQgd2l0aCBhZ2dyZWdhdGUgZnVuY3Rpb25zIHRoYXQgcHJvZHVjZXMgdmFsdWVzIHJhbmdpbmcgaW4gdGhlIGRvbWFpbiBvZiB0aGUgc291cmNlIGRhdGFcbiAgICBTSEFSRURfRE9NQUlOX09QUy5pbmRleE9mKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkgPj0gMCAmJlxuICAgIChcbiAgICAgIC8vIFEgYWx3YXlzIHVzZXMgcXVhbnRpdGF0aXZlIHNjYWxlIGV4Y2VwdCB3aGVuIGl0J3MgYmlubmVkLlxuICAgICAgLy8gQmlubmVkIGZpZWxkIGhhcyBzaW1pbGFyIHZhbHVlcyBpbiBib3RoIHRoZSBzb3VyY2UgdGFibGUgYW5kIHRoZSBzdW1tYXJ5IHRhYmxlXG4gICAgICAvLyBidXQgdGhlIHN1bW1hcnkgdGFibGUgaGFzIGZld2VyIHZhbHVlcywgdGhlcmVmb3JlIGJpbm5lZCBmaWVsZHMgZHJhd1xuICAgICAgLy8gZG9tYWluIHZhbHVlcyBmcm9tIHRoZSBzdW1tYXJ5IHRhYmxlLlxuICAgICAgKGZpZWxkRGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSAmJiAhZmllbGREZWYuYmluKSB8fFxuICAgICAgLy8gVCB1c2VzIG5vbi1vcmRpbmFsIHNjYWxlIHdoZW4gdGhlcmUncyBubyB1bml0IG9yIHdoZW4gdGhlIHVuaXQgaXMgbm90IG9yZGluYWwuXG4gICAgICAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwgJiYgc2NhbGVUeXBlID09PSAnbGluZWFyJylcbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFuZFdpZHRoKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpIHtcbiAgaWYgKHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLmJhbmRXaWR0aDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIC8vIG9ubHkgcmV0dXJuIHZhbHVlIGlmIGV4cGxpY2l0IHZhbHVlIGlzIHNwZWNpZmllZC5cbiAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLmNsYW1wO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhwb25lbnQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIC8vIG9ubHkgcmV0dXJuIHZhbHVlIGlmIGV4cGxpY2l0IHZhbHVlIGlzIHNwZWNpZmllZC5cbiAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLmV4cG9uZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmljZShtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIGlmIChtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5uaWNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBleHBsaWNpdCB2YWx1ZVxuICAgIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5uaWNlO1xuICB9XG5cbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSBYOiAvKiBmYWxsIHRocm91Z2ggKi9cbiAgICBjYXNlIFk6XG4gICAgICBpZiAoc2NhbGVUeXBlID09PSAndGltZScgfHwgc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgY2FzZSBST1c6IC8qIGZhbGwgdGhyb3VnaCAqL1xuICAgIGNhc2UgQ09MVU1OOlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG91dGVyUGFkZGluZyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgIGlmIChtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5vdXRlclBhZGRpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLm91dGVyUGFkZGluZzsgLy8gZXhwbGljaXQgdmFsdWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZGRpbmcobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IHN0cmluZykge1xuICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcgJiYgY2hhbm5lbCAhPT0gUk9XICYmIGNoYW5uZWwgIT09IENPTFVNTikge1xuICAgIHJldHVybiBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5wYWRkaW5nO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2ludHMobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IHN0cmluZykge1xuICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICAgIGNhc2UgWDpcbiAgICAgIGNhc2UgWTpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlTWl4aW5zKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpOiBhbnkge1xuICB2YXIgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcgJiYgZmllbGREZWYuc2NhbGUuYmFuZFdpZHRoKSB7XG4gICAgcmV0dXJuIHtiYW5kV2lkdGg6IGZpZWxkRGVmLnNjYWxlLmJhbmRXaWR0aH07XG4gIH1cblxuICBpZiAoZmllbGREZWYuc2NhbGUucmFuZ2UpIHsgLy8gZXhwbGljaXQgdmFsdWVcbiAgICByZXR1cm4ge3JhbmdlOiBmaWVsZERlZi5zY2FsZS5yYW5nZX07XG4gIH1cblxuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFg6XG4gICAgICAvLyB3ZSBjYW4ndCB1c2Uge3JhbmdlOiBcIndpZHRoXCJ9IGhlcmUgc2luY2Ugd2UgcHV0IHNjYWxlIGluIHRoZSByb290IGdyb3VwXG4gICAgICAvLyBub3QgaW5zaWRlIHRoZSBjZWxsLCBzbyBzY2FsZSBpcyByZXVzYWJsZSBmb3IgYXhlcyBncm91cFxuICAgICAgcmV0dXJuIHtyYW5nZU1pbjogMCwgcmFuZ2VNYXg6IG1vZGVsLmxheW91dCgpLmNlbGxXaWR0aH07XG4gICAgY2FzZSBZOlxuICAgICAgLy8gV2UgY2FuJ3QgdXNlIHtyYW5nZTogXCJoZWlnaHRcIn0gaGVyZSBmb3IgdGhlIHNhbWUgcmVhc29uXG4gICAgICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgcmV0dXJuIHtyYW5nZU1pbjogMCwgcmFuZ2VNYXg6IG1vZGVsLmxheW91dCgpLmNlbGxIZWlnaHR9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtyYW5nZU1pbjogbW9kZWwubGF5b3V0KCkuY2VsbEhlaWdodCwgcmFuZ2VNYXg6IDB9O1xuICAgIGNhc2UgU0laRTpcbiAgICAgIGlmIChtb2RlbC5pcyhCQVIpKSB7XG4gICAgICAgIC8vIFRPRE86IGRldGVybWluZSBiYW5kU2l6ZSBmb3IgYmluLCB3aGljaCBhY3R1YWxseSB1c2VzIGxpbmVhciBzY2FsZVxuICAgICAgICBjb25zdCBkaW1lbnNpb24gPSBtb2RlbC5jb25maWcoKS5tYXJrLm9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gWSA6IFg7XG4gICAgICAgIHJldHVybiB7cmFuZ2U6IFsyLCBtb2RlbC5maWVsZERlZihkaW1lbnNpb24pLnNjYWxlLmJhbmRXaWR0aF19O1xuICAgICAgfSBlbHNlIGlmIChtb2RlbC5pcyhURVhUX01BUkspKSB7XG4gICAgICAgIHJldHVybiB7cmFuZ2U6IFs4LCA0MF19O1xuICAgICAgfVxuICAgICAgLy8gZWxzZSAtLSBwb2ludCwgc3F1YXJlLCBjaXJjbGVcbiAgICAgIGNvbnN0IHhJc01lYXN1cmUgPSBtb2RlbC5pc01lYXN1cmUoWCk7XG4gICAgICBjb25zdCB5SXNNZWFzdXJlID0gbW9kZWwuaXNNZWFzdXJlKFkpO1xuXG4gICAgICBjb25zdCBiYW5kV2lkdGggPSB4SXNNZWFzdXJlICE9PSB5SXNNZWFzdXJlID9cbiAgICAgICAgbW9kZWwuZmllbGREZWYoeElzTWVhc3VyZSA/IFkgOiBYKS5zY2FsZS5iYW5kV2lkdGggOlxuICAgICAgICBNYXRoLm1pbihcbiAgICAgICAgICBtb2RlbC5maWVsZERlZihYKS5zY2FsZS5iYW5kV2lkdGggfHwgMjEgLyogY29uZmlnLnNjYWxlLmJhbmRXaWR0aCAqLyxcbiAgICAgICAgICBtb2RlbC5maWVsZERlZihZKS5zY2FsZS5iYW5kV2lkdGggfHwgMjEgLyogY29uZmlnLnNjYWxlLmJhbmRXaWR0aCAqL1xuICAgICAgICApO1xuXG4gICAgICByZXR1cm4ge3JhbmdlOiBbMTAsIChiYW5kV2lkdGggLSAyKSAqIChiYW5kV2lkdGggLSAyKV19O1xuICAgIGNhc2UgU0hBUEU6XG4gICAgICByZXR1cm4ge3JhbmdlOiAnc2hhcGVzJ307XG4gICAgY2FzZSBDT0xPUjpcbiAgICAgIGlmIChmaWVsZERlZi50eXBlID09PSBOT01JTkFMXG4gICAgICAgIHx8IGZpZWxkRGVmLnR5cGUgPT09IE9SRElOQUwgLy8gRklYTUUgcmVtb3ZlIHRoaXMgb25jZSB3ZSBzdXBwb3J0IGNvbG9yIHJhbXAgZm9yIG9yZGluYWxcbiAgICAgICkge1xuICAgICAgICByZXR1cm4ge3JhbmdlOiAnY2F0ZWdvcnkxMCd9O1xuICAgICAgfVxuICAgICAgLy8gZWxzZSAtLSB0aW1lIG9yIHF1YW50aXRhdGl2ZVxuICAgICAgcmV0dXJuIHtyYW5nZTogWycjQUZDNkEzJywgJyMwOTYyMkEnXX07IC8vIHRhYmxlYXUgZ3JlZW5zXG4gICAgY2FzZSBST1c6XG4gICAgICByZXR1cm4ge3JhbmdlOiAnaGVpZ2h0J307XG4gICAgY2FzZSBDT0xVTU46XG4gICAgICByZXR1cm4ge3JhbmdlOiAnd2lkdGgnfTtcbiAgfVxuICByZXR1cm4ge307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByb3VuZChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgaWYgKG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLnJvdW5kICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUucm91bmQ7XG4gIH1cblxuICAvLyBGSVhNRTogcmV2aXNlIGlmIHJvdW5kIGlzIGFscmVhZHkgdGhlIGRlZmF1bHQgdmFsdWVcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSBYOiAvKiBmYWxsIHRocm91Z2ggKi9cbiAgICBjYXNlIFk6XG4gICAgY2FzZSBST1c6XG4gICAgY2FzZSBDT0xVTU46XG4gICAgY2FzZSBTSVpFOlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHplcm8obW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIHZhciBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICB2YXIgdGltZVVuaXQgPSBmaWVsZERlZi50aW1lVW5pdDtcblxuICBpZiAoZmllbGREZWYuc2NhbGUuemVybyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gZXhwbGljaXQgdmFsdWVcbiAgICByZXR1cm4gZmllbGREZWYuc2NhbGUuemVybztcbiAgfVxuXG4gIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xuICAgIGlmICh0aW1lVW5pdCA9PT0gJ3llYXInKSB7XG4gICAgICAvLyB5ZWFyIGlzIHVzaW5nIGxpbmVhciBzY2FsZSwgYnV0IHNob3VsZCBub3QgaW5jbHVkZSB6ZXJvXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIElmIHRoZXJlIGlzIG5vIHRpbWVVbml0IG9yIHRoZSB0aW1lVW5pdCB1c2VzIG9yZGluYWwgc2NhbGUsXG4gICAgLy8gemVybyBwcm9wZXJ0eSBpcyBpZ25vcmVkIGJ5IHZlZ2Egc28gd2Ugc2hvdWxkIG5vdCBnZW5lcmF0ZSB0aGVtIGFueSB3YXlcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAvLyBSZXR1cm5zIGZhbHNlICh1bmRlZmluZWQpIGJ5IGRlZmF1bHQgb2YgYmluXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGNoYW5uZWwgPT09IFggfHwgY2hhbm5lbCA9PT0gWSA/XG4gICAgLy8gaWYgbm90IGJpbiAvIHRlbXBvcmFsLCByZXR1cm5zIHVuZGVmaW5lZCBmb3IgWCBhbmQgWSBlbmNvZGluZ1xuICAgIC8vIHNpbmNlIHplcm8gaXMgdHJ1ZSBieSBkZWZhdWx0IGluIHZlZ2EgZm9yIGxpbmVhciBzY2FsZVxuICAgIHVuZGVmaW5lZCA6XG4gICAgZmFsc2U7XG59XG4iLCJpbXBvcnQge1NwZWN9IGZyb20gJy4uL3NjaGVtYS9zY2hlbWEnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7Q2hhbm5lbCwgWCwgWSwgQ09MT1IsIERFVEFJTCwgT1JERVJ9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtCQVIsIEFSRUF9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtmaWVsZCwgaXNNZWFzdXJlfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge2hhcywgaXNBZ2dyZWdhdGV9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7aXNBcnJheSwgY29udGFpbnN9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtzb3J0RmllbGR9IGZyb20gJy4vdXRpbCc7XG5cbmltcG9ydCB7dHlwZSBhcyBzY2FsZVR5cGV9IGZyb20gJy4vc2NhbGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YWNrUHJvcGVydGllcyB7XG4gIC8qKiBEaW1lbnNpb24gYXhpcyBvZiB0aGUgc3RhY2sgKCd4JyBvciAneScpLiAqL1xuICBncm91cGJ5Q2hhbm5lbDogQ2hhbm5lbDtcbiAgLyoqIE1lYXN1cmUgYXhpcyBvZiB0aGUgc3RhY2sgKCd4JyBvciAneScpLiAqL1xuICBmaWVsZENoYW5uZWw6IENoYW5uZWw7XG5cbiAgLyoqIFN0YWNrLWJ5IGZpZWxkIG5hbWVzIChmcm9tICdjb2xvcicgYW5kICdkZXRhaWwnKSAqL1xuICBzdGFja0ZpZWxkczogc3RyaW5nW107XG5cbiAgLyoqIFN0YWNrIG9mZnNldCBwcm9wZXJ0eS4gKi9cbiAgb2Zmc2V0OiBzdHJpbmc7XG59XG5cbi8vIFRPRE86IHB1dCBhbGwgdmVnYSBpbnRlcmZhY2UgaW4gb25lIHBsYWNlXG5pbnRlcmZhY2UgU3RhY2tUcmFuc2Zvcm0ge1xuICB0eXBlOiBzdHJpbmc7XG4gIG9mZnNldD86IGFueTtcbiAgZ3JvdXBieTogYW55O1xuICBmaWVsZDogYW55O1xuICBzb3J0Ynk6IGFueTtcbiAgb3V0cHV0OiBhbnk7XG59XG5cbi8qKiBDb21waWxlIHN0YWNrIHByb3BlcnRpZXMgZnJvbSBhIGdpdmVuIHNwZWMgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlU3RhY2tQcm9wZXJ0aWVzKHNwZWM6IFNwZWMpIHtcbiAgY29uc3Qgc3RhY2tGaWVsZHMgPSBnZXRTdGFja0ZpZWxkcyhzcGVjKTtcblxuICBpZiAoc3RhY2tGaWVsZHMubGVuZ3RoID4gMCAmJlxuICAgICAgY29udGFpbnMoW0JBUiwgQVJFQV0sIHNwZWMubWFyaykgJiZcbiAgICAgIHNwZWMuY29uZmlnLm1hcmsuc3RhY2tlZCAhPT0gJ25vbmUnICYmXG4gICAgICBpc0FnZ3JlZ2F0ZShzcGVjLmVuY29kaW5nKSkge1xuXG4gICAgdmFyIGlzWE1lYXN1cmUgPSBoYXMoc3BlYy5lbmNvZGluZywgWCkgJiYgaXNNZWFzdXJlKHNwZWMuZW5jb2RpbmcueCk7XG4gICAgdmFyIGlzWU1lYXN1cmUgPSBoYXMoc3BlYy5lbmNvZGluZywgWSkgJiYgaXNNZWFzdXJlKHNwZWMuZW5jb2RpbmcueSk7XG5cbiAgICBpZiAoaXNYTWVhc3VyZSAmJiAhaXNZTWVhc3VyZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ3JvdXBieUNoYW5uZWw6IFksXG4gICAgICAgIGZpZWxkQ2hhbm5lbDogWCxcbiAgICAgICAgc3RhY2tGaWVsZHM6IHN0YWNrRmllbGRzLFxuICAgICAgICBvZmZzZXQ6IHNwZWMuY29uZmlnLm1hcmsuc3RhY2tlZFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGlzWU1lYXN1cmUgJiYgIWlzWE1lYXN1cmUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdyb3VwYnlDaGFubmVsOiBYLFxuICAgICAgICBmaWVsZENoYW5uZWw6IFksXG4gICAgICAgIHN0YWNrRmllbGRzOiBzdGFja0ZpZWxkcyxcbiAgICAgICAgb2Zmc2V0OiBzcGVjLmNvbmZpZy5tYXJrLnN0YWNrZWRcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKiogQ29tcGlsZSBzdGFjay1ieSBmaWVsZCBuYW1lcyBmcm9tIChmcm9tICdjb2xvcicgYW5kICdkZXRhaWwnKSAqL1xuZnVuY3Rpb24gZ2V0U3RhY2tGaWVsZHMoc3BlYzogU3BlYykge1xuICByZXR1cm4gW0NPTE9SLCBERVRBSUxdLnJlZHVjZShmdW5jdGlvbihmaWVsZHMsIGNoYW5uZWwpIHtcbiAgICBjb25zdCBjaGFubmVsRW5jb2RpbmcgPSBzcGVjLmVuY29kaW5nW2NoYW5uZWxdO1xuICAgIGlmIChoYXMoc3BlYy5lbmNvZGluZywgY2hhbm5lbCkpIHtcbiAgICAgIGlmIChpc0FycmF5KGNoYW5uZWxFbmNvZGluZykpIHtcbiAgICAgICAgY2hhbm5lbEVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWYpIHtcbiAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZChmaWVsZERlZikpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGZpZWxkRGVmOiBGaWVsZERlZiA9IGNoYW5uZWxFbmNvZGluZztcbiAgICAgICAgZmllbGRzLnB1c2goZmllbGQoZmllbGREZWYsIHtcbiAgICAgICAgICBiaW5TdWZmaXg6IHNjYWxlVHlwZShmaWVsZERlZiwgY2hhbm5lbCwgc3BlYy5tYXJrKSA9PT0gJ29yZGluYWwnID8gJ19yYW5nZScgOiAnX3N0YXJ0J1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHM7XG4gIH0sIFtdKTtcbn1cblxuLy8gaW1wdXRlIGRhdGEgZm9yIHN0YWNrZWQgYXJlYVxuZXhwb3J0IGZ1bmN0aW9uIGltcHV0ZVRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaygpO1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdpbXB1dGUnLFxuICAgIGZpZWxkOiBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpLFxuICAgIGdyb3VwYnk6IHN0YWNrLnN0YWNrRmllbGRzLFxuICAgIG9yZGVyYnk6IFttb2RlbC5maWVsZChzdGFjay5ncm91cGJ5Q2hhbm5lbCldLFxuICAgIG1ldGhvZDogJ3ZhbHVlJyxcbiAgICB2YWx1ZTogMFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhY2tUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2soKTtcbiAgY29uc3QgZW5jb2RpbmcgPSBtb2RlbC5zcGVjKCkuZW5jb2Rpbmc7XG4gIGNvbnN0IHNvcnRieSA9IG1vZGVsLmhhcyhPUkRFUikgP1xuICAgIChpc0FycmF5KGVuY29kaW5nW09SREVSXSkgPyBlbmNvZGluZ1tPUkRFUl0gOiBbZW5jb2RpbmdbT1JERVJdXSkubWFwKHNvcnRGaWVsZCkgOlxuICAgIC8vIGRlZmF1bHQgPSBkZXNjZW5kaW5nIGJ5IHN0YWNrRmllbGRzXG4gICAgc3RhY2suc3RhY2tGaWVsZHMubWFwKGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgIHJldHVybiAnLScgKyBmaWVsZDtcbiAgICB9KTtcblxuICBjb25zdCB2YWxOYW1lID0gbW9kZWwuZmllbGQoc3RhY2suZmllbGRDaGFubmVsKTtcblxuICAvLyBhZGQgc3RhY2sgdHJhbnNmb3JtIHRvIG1hcmtcbiAgdmFyIHRyYW5zZm9ybTogU3RhY2tUcmFuc2Zvcm0gPSB7XG4gICAgdHlwZTogJ3N0YWNrJyxcbiAgICBncm91cGJ5OiBbbW9kZWwuZmllbGQoc3RhY2suZ3JvdXBieUNoYW5uZWwpXSxcbiAgICBmaWVsZDogbW9kZWwuZmllbGQoc3RhY2suZmllbGRDaGFubmVsKSxcbiAgICBzb3J0Ynk6IHNvcnRieSxcbiAgICBvdXRwdXQ6IHtcbiAgICAgIHN0YXJ0OiB2YWxOYW1lICsgJ19zdGFydCcsXG4gICAgICBlbmQ6IHZhbE5hbWUgKyAnX2VuZCdcbiAgICB9XG4gIH07XG5cbiAgaWYgKHN0YWNrLm9mZnNldCkge1xuICAgIHRyYW5zZm9ybS5vZmZzZXQgPSBzdGFjay5vZmZzZXQ7XG4gIH1cbiAgcmV0dXJuIHRyYW5zZm9ybTtcbn1cbiIsImltcG9ydCB7Y29udGFpbnMsIHJhbmdlfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7Q09MVU1OLCBST1csIFNIQVBFLCBDT0xPUiwgQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5cbi8qKiByZXR1cm5zIHRoZSB0ZW1wbGF0ZSBuYW1lIHVzZWQgZm9yIGF4aXMgbGFiZWxzIGZvciBhIHRpbWUgdW5pdCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdCh0aW1lVW5pdCwgYWJicmV2aWF0ZWQgPSBmYWxzZSk6IHN0cmluZyB7XG4gIGlmICghdGltZVVuaXQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGV0IGRhdGVDb21wb25lbnRzID0gW107XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ3llYXInKSA+IC0xKSB7XG4gICAgZGF0ZUNvbXBvbmVudHMucHVzaChhYmJyZXZpYXRlZCA/ICcleScgOiAnJVknKTtcbiAgfVxuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdtb250aCcpID4gLTEpIHtcbiAgICBkYXRlQ29tcG9uZW50cy5wdXNoKGFiYnJldmlhdGVkID8gJyViJyA6ICclQicpO1xuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ2RheScpID4gLTEpIHtcbiAgICBkYXRlQ29tcG9uZW50cy5wdXNoKGFiYnJldmlhdGVkID8gJyVhJyA6ICclQScpO1xuICB9IGVsc2UgaWYgKHRpbWVVbml0LmluZGV4T2YoJ2RhdGUnKSA+IC0xKSB7XG4gICAgZGF0ZUNvbXBvbmVudHMucHVzaCgnJWQnKTtcbiAgfVxuXG4gIGxldCB0aW1lQ29tcG9uZW50cyA9IFtdO1xuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdob3VyJykgPiAtMSkge1xuICAgIHRpbWVDb21wb25lbnRzLnB1c2goJyVIJyk7XG4gIH1cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ21pbnV0ZScpID4gLTEpIHtcbiAgICB0aW1lQ29tcG9uZW50cy5wdXNoKCclTScpO1xuICB9XG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdzZWNvbmQnKSA+IC0xKSB7XG4gICAgdGltZUNvbXBvbmVudHMucHVzaCgnJVMnKTtcbiAgfVxuICBpZiAodGltZVVuaXQuaW5kZXhPZignbWlsbGlzZWNvbmRzJykgPiAtMSkge1xuICAgIHRpbWVDb21wb25lbnRzLnB1c2goJyVMJyk7XG4gIH1cblxuICBsZXQgb3V0ID0gW107XG4gIGlmIChkYXRlQ29tcG9uZW50cy5sZW5ndGggPiAwKSB7XG4gICAgb3V0LnB1c2goZGF0ZUNvbXBvbmVudHMuam9pbignLScpKTtcbiAgfVxuICBpZiAodGltZUNvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgIG91dC5wdXNoKHRpbWVDb21wb25lbnRzLmpvaW4oJzonKSk7XG4gIH1cblxuICByZXR1cm4gb3V0Lmxlbmd0aCA+IDAgPyBvdXQuam9pbignICcpIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKHRpbWVVbml0OiBzdHJpbmcsIGZpZWxkUmVmOiBzdHJpbmcsIG9ubHlSZWYgPSBmYWxzZSk6IHN0cmluZyB7XG4gIGxldCBvdXQgPSAnZGF0ZXRpbWUoJztcblxuICBmdW5jdGlvbiBnZXQoZnVuOiBzdHJpbmcsIGFkZENvbW1hID0gdHJ1ZSkge1xuICAgIGlmIChvbmx5UmVmKSB7XG4gICAgICByZXR1cm4gZmllbGRSZWYgKyAoYWRkQ29tbWEgPyAnLCAnIDogJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnVuICsgJygnICsgZmllbGRSZWYgKyAnKScgKyAoYWRkQ29tbWEgPyAnLCAnIDogJycpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCd5ZWFyJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ3llYXInKTtcbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJzIwMDYsICc7IC8vIEphbnVhcnkgMSAyMDA2IGlzIGEgU3VuZGF5XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignbW9udGgnKSA+IC0xKSB7XG4gICAgb3V0ICs9IGdldCgnbW9udGgnKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBtb250aCBzdGFydHMgYXQgMCBpbiBqYXZhc2NyaXB0XG4gICAgb3V0ICs9ICcwLCAnO1xuICB9XG5cbiAgLy8gbmVlZCB0byBhZGQgMSBiZWNhdXNlIGRheXMgc3RhcnQgYXQgMVxuICBpZiAodGltZVVuaXQuaW5kZXhPZignZGF5JykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ2RheScsIGZhbHNlKSArICcrMSwgJztcbiAgfSBlbHNlIGlmICh0aW1lVW5pdC5pbmRleE9mKCdkYXRlJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ2RhdGUnKTtcbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJzEsICc7XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignaG91cnMnKSA+IC0xKSB7XG4gICAgb3V0ICs9IGdldCgnaG91cnMnKTtcbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJzAsICc7XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignbWludXRlcycpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCdtaW51dGVzJyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcwLCAnO1xuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ3NlY29uZHMnKSA+IC0xKSB7XG4gICAgb3V0ICs9IGdldCgnc2Vjb25kcycpO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnMCwgJztcbiAgfVxuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdtaWxsaXNlY29uZHMnKSA+IC0xKSB7XG4gICAgb3V0ICs9IGdldCgnbWlsbGlzZWNvbmRzJywgZmFsc2UpO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnMCc7XG4gIH1cblxuICByZXR1cm4gb3V0ICsgJyknO1xufVxuXG4vKiogR2VuZXJhdGUgdGhlIGNvbXBsZXRlIHJhdyBkb21haW4uICovXG5leHBvcnQgZnVuY3Rpb24gcmF3RG9tYWluKHRpbWVVbml0OiBzdHJpbmcsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgaWYgKGNvbnRhaW5zKFtST1csIENPTFVNTiwgU0hBUEUsIENPTE9SXSwgY2hhbm5lbCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHN3aXRjaCAodGltZVVuaXQpIHtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICAgIHJldHVybiByYW5nZSgwLCA2MCk7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgICByZXR1cm4gcmFuZ2UoMCwgNjApO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICAgIHJldHVybiByYW5nZSgwLCAyNCk7XG4gICAgY2FzZSAnZGF5JzpcbiAgICAgIHJldHVybiByYW5nZSgwLCA3KTtcbiAgICBjYXNlICdkYXRlJzpcbiAgICAgIHJldHVybiByYW5nZSgxLCAzMik7XG4gICAgY2FzZSAnbW9udGgnOlxuICAgICAgcmV0dXJuIHJhbmdlKDAsIDEyKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcbmltcG9ydCB7Q09MVU1OLCBST1csIFgsIFksIFNJWkUsIENPTE9SLCBTSEFQRSwgVEVYVCwgTEFCRUwsIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtmaWVsZH0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtRVUFOVElUQVRJVkUsIFRFTVBPUkFMfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7Zm9ybWF0IGFzIHRpbWVGb3JtYXRFeHByfSBmcm9tICcuL3RpbWUnO1xuaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCBlbnVtIENvbG9yTW9kZSB7XG4gIEFMV0FZU19GSUxMRUQsXG4gIEFMV0FZU19TVFJPS0VELFxuICBGSUxMRURfQllfREVGQVVMVCxcbiAgU1RST0tFRF9CWV9ERUZBVUxUXG59XG5cbmV4cG9ydCBjb25zdCBGSUxMX1NUUk9LRV9DT05GSUcgPSBbJ2ZpbGwnLCAnZmlsbE9wYWNpdHknLFxuICAnc3Ryb2tlJywgJ3N0cm9rZVdpZHRoJywgJ3N0cm9rZURhc2gnLCAnc3Ryb2tlRGFzaE9mZnNldCcsICdzdHJva2VPcGFjaXR5JyxcbiAgJ29wYWNpdHknXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsOiBNb2RlbCwgY29sb3JNb2RlOiBDb2xvck1vZGUgPSBDb2xvck1vZGUuU1RST0tFRF9CWV9ERUZBVUxUKSB7XG4gIGNvbnN0IGZpbGxlZCA9IGNvbG9yTW9kZSA9PT0gQ29sb3JNb2RlLkFMV0FZU19GSUxMRUQgPyB0cnVlIDpcbiAgICBjb2xvck1vZGUgPT09IENvbG9yTW9kZS5BTFdBWVNfU1RST0tFRCA/IGZhbHNlIDpcbiAgICAgIG1vZGVsLmNvbmZpZygpLm1hcmsuZmlsbGVkICE9PSB1bmRlZmluZWQgPyBtb2RlbC5jb25maWcoKS5tYXJrLmZpbGxlZCA6XG4gICAgICAgIGNvbG9yTW9kZSA9PT0gQ29sb3JNb2RlLkZJTExFRF9CWV9ERUZBVUxUID8gdHJ1ZSA6XG4gICAgICAgICAgZmFsc2U7IC8vIENvbG9yTW9kZS5TVFJPS0VEX0JZX0RFRkFVTFRcblxuICBpZiAoZmlsbGVkKSB7XG4gICAgaWYgKG1vZGVsLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuZmlsbCA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xPUiksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChDT0xPUilcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWUpIHtcbiAgICAgIHAuZmlsbCA9IHsgdmFsdWU6IG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLmZpbGwgPSB7IHZhbHVlOiBtb2RlbC5jb25maWcoKS5tYXJrLmNvbG9yIH07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChtb2RlbC5oYXMoQ09MT1IpKSB7XG4gICAgICBwLnN0cm9rZSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xPUiksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChDT0xPUilcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWUpIHtcbiAgICAgIHAuc3Ryb2tlID0geyB2YWx1ZTogbW9kZWwuZmllbGREZWYoQ09MT1IpLnZhbHVlIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuc3Ryb2tlID0geyB2YWx1ZTogbW9kZWwuY29uZmlnKCkubWFyay5jb2xvciB9O1xuICAgIH1cbiAgfVxuXG4gIC8vIEFwcGx5IGZpbGwgYW5kIHN0cm9rZSBjb25maWcgbGF0ZXJcbiAgLy8gYGZpbGxgIGFuZCBgc3Ryb2tlYCBjb25maWcgY2FuIG92ZXJyaWRlIGBjb2xvcmAgY29uZmlnXG4gIGFwcGx5TWFya0NvbmZpZyhwLCBtb2RlbCwgRklMTF9TVFJPS0VfQ09ORklHKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5TWFya0NvbmZpZyhtYXJrc1Byb3BlcnRpZXMsIG1vZGVsOiBNb2RlbCwgcHJvcHNMaXN0OiBzdHJpbmdbXSkge1xuICBwcm9wc0xpc3QuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIGNvbnN0IHZhbHVlID0gbW9kZWwuY29uZmlnKCkubWFya1twcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1hcmtzUHJvcGVydGllc1twcm9wZXJ0eV0gPSB7IHZhbHVlOiB2YWx1ZSB9O1xuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4gKiBCdWlsZHMgYW4gb2JqZWN0IHdpdGggZm9ybWF0IGFuZCBmb3JtYXRUeXBlIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIGZvcm1hdCBleHBsaWNpdGx5IHNwZWNpZmllZCBmb3JtYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE1peGlucyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIGZvcm1hdDogc3RyaW5nKSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgaWYoIWNvbnRhaW5zKFtRVUFOVElUQVRJVkUsIFRFTVBPUkFMXSwgZmllbGREZWYudHlwZSkpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBsZXQgZGVmOiBhbnkgPSB7fTtcblxuICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICBkZWYuZm9ybWF0VHlwZSA9ICd0aW1lJztcbiAgfVxuXG4gIGlmIChmb3JtYXQgIT09IHVuZGVmaW5lZCkge1xuICAgIGRlZi5mb3JtYXQgPSBmb3JtYXQ7XG4gIH0gZWxzZSB7XG4gICAgc3dpdGNoIChmaWVsZERlZi50eXBlKSB7XG4gICAgICBjYXNlIFFVQU5USVRBVElWRTpcbiAgICAgICAgZGVmLmZvcm1hdCA9IG1vZGVsLmNvbmZpZygpLm51bWJlckZvcm1hdDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRFTVBPUkFMOlxuICAgICAgICBkZWYuZm9ybWF0ID0gdGltZUZvcm1hdChtb2RlbCwgY2hhbm5lbCkgfHwgbW9kZWwuY29uZmlnKCkudGltZUZvcm1hdDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNoYW5uZWwgPT09IFRFWFQpIHtcbiAgICAvLyB0ZXh0IGRvZXMgbm90IHN1cHBvcnQgZm9ybWF0IGFuZCBmb3JtYXRUeXBlXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS9pc3N1ZXMvNTA1XG5cbiAgICBjb25zdCBmaWx0ZXIgPSAoZGVmLmZvcm1hdFR5cGUgfHwgJ251bWJlcicpICsgKGRlZi5mb3JtYXQgPyAnOlxcJycgKyBkZWYuZm9ybWF0ICsgJ1xcJycgOiAnJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRleHQ6IHtcbiAgICAgICAgdGVtcGxhdGU6ICd7eycgKyBtb2RlbC5maWVsZChjaGFubmVsLCB7IGRhdHVtOiB0cnVlIH0pICsgJyB8ICcgKyBmaWx0ZXIgKyAnfX0nXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59XG5cbmZ1bmN0aW9uIGlzQWJicmV2aWF0ZWQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWYpIHtcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSBST1c6XG4gICAgY2FzZSBDT0xVTU46XG4gICAgY2FzZSBYOlxuICAgIGNhc2UgWTpcbiAgICAgIHJldHVybiBtb2RlbC5heGlzKGNoYW5uZWwpLnNob3J0VGltZUxhYmVscztcbiAgICBjYXNlIENPTE9SOlxuICAgIGNhc2UgU0hBUEU6XG4gICAgY2FzZSBTSVpFOlxuICAgICAgcmV0dXJuIG1vZGVsLmxlZ2VuZChjaGFubmVsKS5zaG9ydFRpbWVMYWJlbHM7XG4gICAgY2FzZSBURVhUOlxuICAgICAgcmV0dXJuIG1vZGVsLmNvbmZpZygpLm1hcmsuc2hvcnRUaW1lTGFiZWxzO1xuICAgIGNhc2UgTEFCRUw6XG4gICAgICAvLyBUT0RPKCM4OTcpOiBpbXBsZW1lbnQgd2hlbiB3ZSBoYXZlIGxhYmVsXG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5cblxuLyoqIFJldHVybiBmaWVsZCByZWZlcmVuY2Ugd2l0aCBwb3RlbnRpYWwgXCItXCIgcHJlZml4IGZvciBkZXNjZW5kaW5nIHNvcnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0RmllbGQoZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIHJldHVybiAoZmllbGREZWYuc29ydCA9PT0gJ2Rlc2NlbmRpbmcnID8gJy0nIDogJycpICsgZmllbGQoZmllbGREZWYpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHRpbWUgZm9ybWF0IHVzZWQgZm9yIGF4aXMgbGFiZWxzIGZvciBhIHRpbWUgdW5pdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVGb3JtYXQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKTogc3RyaW5nIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgcmV0dXJuIHRpbWVGb3JtYXRFeHByKGZpZWxkRGVmLnRpbWVVbml0LCBpc0FiYnJldmlhdGVkKG1vZGVsLCBjaGFubmVsLCBmaWVsZERlZikpO1xufVxuIiwiLypcbiAqIENvbnN0YW50cyBhbmQgdXRpbGl0aWVzIGZvciBkYXRhLlxuICovXG5cbmltcG9ydCB7Tk9NSU5BTCwgUVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi90eXBlJztcblxuZXhwb3J0IGNvbnN0IFNVTU1BUlkgPSAnc3VtbWFyeSc7XG5leHBvcnQgY29uc3QgU09VUkNFID0gJ3NvdXJjZSc7XG5leHBvcnQgY29uc3QgU1RBQ0tFRF9TQ0FMRSA9ICdzdGFja2VkX3NjYWxlJztcbmV4cG9ydCBjb25zdCBMQVlPVVQgPSAnbGF5b3V0JztcblxuLyoqIE1hcHBpbmcgZnJvbSBkYXRhbGliJ3MgaW5mZXJyZWQgdHlwZSB0byBWZWdhLWxpdGUncyB0eXBlICovXG4vLyBUT0RPOiBBTExfQ0FQU1xuZXhwb3J0IGNvbnN0IHR5cGVzID0ge1xuICAnYm9vbGVhbic6IE5PTUlOQUwsXG4gICdudW1iZXInOiBRVUFOVElUQVRJVkUsXG4gICdpbnRlZ2VyJzogUVVBTlRJVEFUSVZFLFxuICAnZGF0ZSc6IFRFTVBPUkFMLFxuICAnc3RyaW5nJzogTk9NSU5BTFxufTtcbiIsIi8vIHV0aWxpdHkgZm9yIGVuY29kaW5nIG1hcHBpbmdcbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4vc2NoZW1hL2VuY29kaW5nLnNjaGVtYSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtDaGFubmVsLCBDSEFOTkVMU30gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7aXNBcnJheSwgYW55IGFzIGFueUlufSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY291bnRSZXRpbmFsKGVuY29kaW5nOiBFbmNvZGluZykge1xuICB2YXIgY291bnQgPSAwO1xuICBpZiAoZW5jb2RpbmcuY29sb3IpIHsgY291bnQrKzsgfVxuICBpZiAoZW5jb2Rpbmcuc2l6ZSkgeyBjb3VudCsrOyB9XG4gIGlmIChlbmNvZGluZy5zaGFwZSkgeyBjb3VudCsrOyB9XG4gIHJldHVybiBjb3VudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5uZWxzKGVuY29kaW5nOiBFbmNvZGluZykge1xuICByZXR1cm4gQ0hBTk5FTFMuZmlsdGVyKGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICByZXR1cm4gaGFzKGVuY29kaW5nLCBjaGFubmVsKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXMoZW5jb2Rpbmc6IEVuY29kaW5nLCBjaGFubmVsOiBDaGFubmVsKTogYm9vbGVhbiB7XG4gIGNvbnN0IGNoYW5uZWxFbmNvZGluZyA9IGVuY29kaW5nICYmIGVuY29kaW5nW2NoYW5uZWxdO1xuICByZXR1cm4gY2hhbm5lbEVuY29kaW5nICYmIChcbiAgICBjaGFubmVsRW5jb2RpbmcuZmllbGQgIT09IHVuZGVmaW5lZCB8fFxuICAgIChpc0FycmF5KGNoYW5uZWxFbmNvZGluZykgJiYgY2hhbm5lbEVuY29kaW5nLmxlbmd0aCA+IDApXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FnZ3JlZ2F0ZShlbmNvZGluZzogRW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFueUluKENIQU5ORUxTLCAoY2hhbm5lbCkgPT4ge1xuICAgIGlmIChoYXMoZW5jb2RpbmcsIGNoYW5uZWwpICYmIGVuY29kaW5nW2NoYW5uZWxdLmFnZ3JlZ2F0ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWVsZERlZnMoZW5jb2Rpbmc6IEVuY29kaW5nKTogRmllbGREZWZbXSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgQ0hBTk5FTFMuZm9yRWFjaChmdW5jdGlvbihjaGFubmVsKSB7XG4gICAgaWYgKGhhcyhlbmNvZGluZywgY2hhbm5lbCkpIHtcbiAgICAgIGlmIChpc0FycmF5KGVuY29kaW5nW2NoYW5uZWxdKSkge1xuICAgICAgICBlbmNvZGluZ1tjaGFubmVsXS5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkRGVmKSB7XG4gICAgICAgICAgYXJyLnB1c2goZmllbGREZWYpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyci5wdXNoKGVuY29kaW5nW2NoYW5uZWxdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2goZW5jb2Rpbmc6IEVuY29kaW5nLFxuICAgIGY6IChmZDogRmllbGREZWYsIGM6IENoYW5uZWwsIGk6IG51bWJlcikgPT4gdm9pZCxcbiAgICB0aGlzQXJnPzogYW55KSB7XG4gIHZhciBpID0gMDtcbiAgQ0hBTk5FTFMuZm9yRWFjaChmdW5jdGlvbihjaGFubmVsKSB7XG4gICAgaWYgKGhhcyhlbmNvZGluZywgY2hhbm5lbCkpIHtcbiAgICAgIGlmIChpc0FycmF5KGVuY29kaW5nW2NoYW5uZWxdKSkge1xuICAgICAgICBlbmNvZGluZ1tjaGFubmVsXS5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkRGVmKSB7XG4gICAgICAgICAgICBmLmNhbGwodGhpc0FyZywgZmllbGREZWYsIGNoYW5uZWwsIGkrKyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZi5jYWxsKHRoaXNBcmcsIGVuY29kaW5nW2NoYW5uZWxdLCBjaGFubmVsLCBpKyspO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXAoZW5jb2Rpbmc6IEVuY29kaW5nLFxuICAgIGY6IChmZDogRmllbGREZWYsIGM6IENoYW5uZWwsIGU6IEVuY29kaW5nKSA9PiBhbnksXG4gICAgdGhpc0FyZz86IGFueSkge1xuICB2YXIgYXJyID0gW107XG4gIENIQU5ORUxTLmZvckVhY2goZnVuY3Rpb24oY2hhbm5lbCkge1xuICAgIGlmIChoYXMoZW5jb2RpbmcsIGNoYW5uZWwpKSB7XG4gICAgICBpZiAoaXNBcnJheShlbmNvZGluZ1tjaGFubmVsXSkpIHtcbiAgICAgICAgZW5jb2RpbmdbY2hhbm5lbF0uZm9yRWFjaChmdW5jdGlvbihmaWVsZERlZikge1xuICAgICAgICAgIGFyci5wdXNoKGYuY2FsbCh0aGlzQXJnLCBmaWVsZERlZiwgY2hhbm5lbCwgZW5jb2RpbmcpKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnIucHVzaChmLmNhbGwodGhpc0FyZywgZW5jb2RpbmdbY2hhbm5lbF0sIGNoYW5uZWwsIGVuY29kaW5nKSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZShlbmNvZGluZzogRW5jb2RpbmcsXG4gICAgZjogKGFjYzogYW55LCBmZDogRmllbGREZWYsIGM6IENoYW5uZWwsIGU6IEVuY29kaW5nKSA9PiBhbnksXG4gICAgaW5pdCxcbiAgICB0aGlzQXJnPzogYW55KSB7XG4gIHZhciByID0gaW5pdDtcbiAgQ0hBTk5FTFMuZm9yRWFjaChmdW5jdGlvbihjaGFubmVsKSB7XG4gICAgaWYgKGhhcyhlbmNvZGluZywgY2hhbm5lbCkpIHtcbiAgICAgIGlmIChpc0FycmF5KGVuY29kaW5nW2NoYW5uZWxdKSkge1xuICAgICAgICBlbmNvZGluZ1tjaGFubmVsXS5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkRGVmKSB7XG4gICAgICAgICAgICByID0gZi5jYWxsKHRoaXNBcmcsIHIsIGZpZWxkRGVmLCBjaGFubmVsLCBlbmNvZGluZyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgciA9IGYuY2FsbCh0aGlzQXJnLCByLCBlbmNvZGluZ1tjaGFubmVsXSwgY2hhbm5lbCwgZW5jb2RpbmcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiByO1xufVxuIiwiLy8gdXRpbGl0eSBmb3IgYSBmaWVsZCBkZWZpbml0aW9uIG9iamVjdFxuXG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtjb250YWlucywgZ2V0Ymluc30gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7Tk9NSU5BTCwgT1JESU5BTCwgUVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi90eXBlJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIEZpZWxkUmVmT3B0aW9uIHtcbiAgLyoqIGV4Y2x1ZGUgYmluLCBhZ2dyZWdhdGUsIHRpbWVVbml0ICovXG4gIG5vZm4/OiBib29sZWFuO1xuICAvKiogZXhjbHVkZSBhZ2dyZWdhdGlvbiBmdW5jdGlvbiAqL1xuICBub0FnZ3JlZ2F0ZT86IGJvb2xlYW47XG4gIC8qKiBpbmNsdWRlICdkYXR1bS4nICovXG4gIGRhdHVtPzogYm9vbGVhbjtcbiAgLyoqIHJlcGxhY2UgZm4gd2l0aCBjdXN0b20gZnVuY3Rpb24gcHJlZml4ICovXG4gIGZuPzogc3RyaW5nO1xuICAvKiogcHJlcGVuZCBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXggKi9cbiAgcHJlZm4/OiBzdHJpbmc7XG4gIC8qKiBhcHBlbmQgc3VmZml4IHRvIHRoZSBmaWVsZCByZWYgZm9yIGJpbiAoZGVmYXVsdD0nX3N0YXJ0JykgKi9cbiAgYmluU3VmZml4Pzogc3RyaW5nO1xuICAvKiogYXBwZW5kIHN1ZmZpeCB0byB0aGUgZmllbGQgcmVmIChnZW5lcmFsKSAqL1xuICBzdWZmaXg/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWVsZChmaWVsZERlZjogRmllbGREZWYsIG9wdDogRmllbGRSZWZPcHRpb24gPSB7fSkge1xuICBjb25zdCBwcmVmaXggPSAob3B0LmRhdHVtID8gJ2RhdHVtLicgOiAnJykgKyAob3B0LnByZWZuIHx8ICcnKTtcbiAgY29uc3Qgc3VmZml4ID0gb3B0LnN1ZmZpeCB8fCAnJztcbiAgY29uc3QgZmllbGQgPSBmaWVsZERlZi5maWVsZDtcblxuICBpZiAoaXNDb3VudChmaWVsZERlZikpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJ2NvdW50JyArIHN1ZmZpeDtcbiAgfSBlbHNlIGlmIChvcHQuZm4pIHtcbiAgICByZXR1cm4gcHJlZml4ICsgb3B0LmZuICsgJ18nICsgZmllbGQgKyBzdWZmaXg7XG4gIH0gZWxzZSBpZiAoIW9wdC5ub2ZuICYmIGZpZWxkRGVmLmJpbikge1xuICAgIHJldHVybiBwcmVmaXggKyAnYmluXycgKyBmaWVsZCArIChvcHQuYmluU3VmZml4IHx8IHN1ZmZpeCB8fCAnX3N0YXJ0Jyk7XG4gIH0gZWxzZSBpZiAoIW9wdC5ub2ZuICYmICFvcHQubm9BZ2dyZWdhdGUgJiYgZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIHByZWZpeCArIGZpZWxkRGVmLmFnZ3JlZ2F0ZSArICdfJyArIGZpZWxkICsgc3VmZml4O1xuICB9IGVsc2UgaWYgKCFvcHQubm9mbiAmJiBmaWVsZERlZi50aW1lVW5pdCkge1xuICAgIHJldHVybiBwcmVmaXggKyBmaWVsZERlZi50aW1lVW5pdCArICdfJyArIGZpZWxkICsgc3VmZml4O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmVmaXggKyBmaWVsZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaXNGaWVsZERpbWVuc2lvbihmaWVsZERlZjogRmllbGREZWYpIHtcbiAgcmV0dXJuIGNvbnRhaW5zKFtOT01JTkFMLCBPUkRJTkFMXSwgZmllbGREZWYudHlwZSkgfHwgISFmaWVsZERlZi5iaW4gfHxcbiAgICAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwgJiYgISFmaWVsZERlZi50aW1lVW5pdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RpbWVuc2lvbihmaWVsZERlZjogRmllbGREZWYpIHtcbiAgcmV0dXJuIGZpZWxkRGVmICYmIGZpZWxkRGVmLmZpZWxkICYmIF9pc0ZpZWxkRGltZW5zaW9uKGZpZWxkRGVmKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTWVhc3VyZShmaWVsZERlZjogRmllbGREZWYpIHtcbiAgcmV0dXJuIGZpZWxkRGVmICYmIGZpZWxkRGVmLmZpZWxkICYmICFfaXNGaWVsZERpbWVuc2lvbihmaWVsZERlZik7XG59XG5cbmV4cG9ydCBjb25zdCBDT1VOVF9ESVNQTEFZTkFNRSA9ICdOdW1iZXIgb2YgUmVjb3Jkcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3VudCgpOiBGaWVsZERlZiB7XG4gIHJldHVybiB7IGZpZWxkOiAnKicsIGFnZ3JlZ2F0ZTogJ2NvdW50JywgdHlwZTogUVVBTlRJVEFUSVZFLCBkaXNwbGF5TmFtZTogQ09VTlRfRElTUExBWU5BTUUgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ291bnQoZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIHJldHVybiBmaWVsZERlZi5hZ2dyZWdhdGUgPT09ICdjb3VudCc7XG59XG5cbi8vIEZJWE1FIHJlbW92ZSB0aGlzLCBhbmQgdGhlIGdldGJpbnMgbWV0aG9kXG4vLyBGSVhNRSB0aGlzIGRlcGVuZHMgb24gY2hhbm5lbFxuZXhwb3J0IGZ1bmN0aW9uIGNhcmRpbmFsaXR5KGZpZWxkRGVmOiBGaWVsZERlZiwgc3RhdHMsIGZpbHRlck51bGwgPSB7fSkge1xuICAvLyBGSVhNRSBuZWVkIHRvIHRha2UgZmlsdGVyIGludG8gYWNjb3VudFxuXG4gIHZhciBzdGF0ID0gc3RhdHNbZmllbGREZWYuZmllbGRdO1xuICB2YXIgdHlwZSA9IGZpZWxkRGVmLnR5cGU7XG5cbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIC8vIG5lZWQgdG8gcmVhc3NpZ24gYmluLCBvdGhlcndpc2UgY29tcGlsYXRpb24gd2lsbCBmYWlsIGR1ZSB0byBhIFRTIGJ1Zy5cbiAgICBjb25zdCBiaW4gPSBmaWVsZERlZi5iaW47XG4gICAgbGV0IG1heGJpbnMgPSAodHlwZW9mIGJpbiA9PT0gJ2Jvb2xlYW4nKSA/IHVuZGVmaW5lZCA6IGJpbi5tYXhiaW5zO1xuICAgIGlmIChtYXhiaW5zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG1heGJpbnMgPSAxMDtcbiAgICB9XG5cbiAgICB2YXIgYmlucyA9IGdldGJpbnMoc3RhdCwgbWF4Ymlucyk7XG4gICAgcmV0dXJuIChiaW5zLnN0b3AgLSBiaW5zLnN0YXJ0KSAvIGJpbnMuc3RlcDtcbiAgfVxuICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICB2YXIgdGltZVVuaXQgPSBmaWVsZERlZi50aW1lVW5pdDtcbiAgICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgICBjYXNlICdzZWNvbmRzJzogcmV0dXJuIDYwO1xuICAgICAgY2FzZSAnbWludXRlcyc6IHJldHVybiA2MDtcbiAgICAgIGNhc2UgJ2hvdXJzJzogcmV0dXJuIDI0O1xuICAgICAgY2FzZSAnZGF5JzogcmV0dXJuIDc7XG4gICAgICBjYXNlICdkYXRlJzogcmV0dXJuIDMxO1xuICAgICAgY2FzZSAnbW9udGgnOiByZXR1cm4gMTI7XG4gICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgdmFyIHllYXJzdGF0ID0gc3RhdHNbJ3llYXJfJyArIGZpZWxkRGVmLmZpZWxkXTtcblxuICAgICAgICBpZiAoIXllYXJzdGF0KSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAgICAgcmV0dXJuIHllYXJzdGF0LmRpc3RpbmN0IC1cbiAgICAgICAgICAoc3RhdC5taXNzaW5nID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xuICAgIH1cbiAgICAvLyBvdGhlcndpc2UgdXNlIGNhbGN1bGF0aW9uIGJlbG93XG4gIH1cbiAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgLy8gcmVtb3ZlIG51bGxcbiAgcmV0dXJuIHN0YXQuZGlzdGluY3QgLVxuICAgIChzdGF0Lm1pc3NpbmcgPiAwICYmIGZpbHRlck51bGxbdHlwZV0gPyAxIDogMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShmaWVsZERlZjogRmllbGREZWYpIHtcbiAgaWYgKGlzQ291bnQoZmllbGREZWYpKSB7XG4gICAgcmV0dXJuIENPVU5UX0RJU1BMQVlOQU1FO1xuICB9XG4gIHZhciBmbiA9IGZpZWxkRGVmLmFnZ3JlZ2F0ZSB8fCBmaWVsZERlZi50aW1lVW5pdCB8fCAoZmllbGREZWYuYmluICYmICdiaW4nKTtcbiAgaWYgKGZuKSB7XG4gICAgcmV0dXJuIGZuLnRvVXBwZXJDYXNlKCkgKyAnKCcgKyBmaWVsZERlZi5maWVsZCArICcpJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmllbGREZWYuZmllbGQ7XG4gIH1cbn1cbiIsImV4cG9ydCBlbnVtIE1hcmsge1xuICBBUkVBID0gJ2FyZWEnIGFzIGFueSxcbiAgQkFSID0gJ2JhcicgYXMgYW55LFxuICBMSU5FID0gJ2xpbmUnIGFzIGFueSxcbiAgUE9JTlQgPSAncG9pbnQnIGFzIGFueSxcbiAgVEVYVCA9ICd0ZXh0JyBhcyBhbnksXG4gIFRJQ0sgPSAndGljaycgYXMgYW55LFxuICBDSVJDTEUgPSAnY2lyY2xlJyBhcyBhbnksXG4gIFNRVUFSRSA9ICdzcXVhcmUnIGFzIGFueVxufVxuXG5leHBvcnQgY29uc3QgQVJFQSA9IE1hcmsuQVJFQTtcbmV4cG9ydCBjb25zdCBCQVIgPSBNYXJrLkJBUjtcbmV4cG9ydCBjb25zdCBMSU5FID0gTWFyay5MSU5FO1xuZXhwb3J0IGNvbnN0IFBPSU5UID0gTWFyay5QT0lOVDtcbmV4cG9ydCBjb25zdCBURVhUID0gTWFyay5URVhUO1xuZXhwb3J0IGNvbnN0IFRJQ0sgPSBNYXJrLlRJQ0s7XG5cbmV4cG9ydCBjb25zdCBDSVJDTEUgPSBNYXJrLkNJUkNMRTtcbmV4cG9ydCBjb25zdCBTUVVBUkUgPSBNYXJrLlNRVUFSRTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgQXhpcyB7XG4gIC8vIFZlZ2EgQXhpcyBQcm9wZXJ0aWVzXG4gIGZvcm1hdD86IHN0cmluZztcbiAgZ3JpZD86IGJvb2xlYW47XG4gIGxheWVyPzogc3RyaW5nO1xuICBvZmZzZXQ/OiBudW1iZXI7XG4gIG9yaWVudD86IHN0cmluZztcbiAgc3ViZGl2aWRlPzogbnVtYmVyO1xuICB0aWNrcz86IG51bWJlcjtcbiAgdGlja1BhZGRpbmc/OiBudW1iZXI7XG4gIHRpY2tTaXplPzogbnVtYmVyO1xuICB0aWNrU2l6ZU1ham9yPzogbnVtYmVyO1xuICB0aWNrU2l6ZU1pbm9yPzogbnVtYmVyO1xuICB0aWNrU2l6ZUVuZD86IG51bWJlcjtcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIHRpdGxlT2Zmc2V0PzogbnVtYmVyO1xuICB2YWx1ZXM/OiBudW1iZXJbXTtcbiAgcHJvcGVydGllcz86IGFueTsgLy8gVE9ETzogZGVjbGFyZSBWZ0F4aXNQcm9wZXJ0aWVzXG4gIC8vIFZlZ2EtTGl0ZSBvbmx5XG4gIGNoYXJhY3RlcldpZHRoPzogbnVtYmVyO1xuICBsYWJlbE1heExlbmd0aD86IG51bWJlcjtcbiAgbGFiZWxzPzogYm9vbGVhbjtcbiAgc2hvcnRUaW1lTGFiZWxzPzogYm9vbGVhbjtcbiAgdGl0bGVNYXhMZW5ndGg/OiBudW1iZXI7XG59XG5cbmV4cG9ydCB2YXIgYXhpcyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvKiBWZWdhIEF4aXMgUHJvcGVydGllcyAqL1xuICAgIGZvcm1hdDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb3JtYXR0aW5nIHBhdHRlcm4gZm9yIGF4aXMgbGFiZWxzLiBJZiB1bmRlZmluZWQsIGEgZ29vZCBmb3JtYXQgaXMgYXV0b21hdGljYWxseSBkZXRlcm1pbmVkLiBWZWdhLUxpdGUgdXNlcyBEM1xcJ3MgZm9ybWF0IHBhdHRlcm4gYW5kIGF1dG9tYXRpY2FsbHkgc3dpdGNoZXMgdG8gZGF0ZXRpbWUgZm9ybWF0dGVycy4nXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgZmxhZyBpbmRpY2F0ZSBpZiBncmlkbGluZXMgc2hvdWxkIGJlIGNyZWF0ZWQgaW4gYWRkaXRpb24gdG8gdGlja3MuIElmIGBncmlkYCBpcyB1bnNwZWNpZmllZCwgdGhlIGRlZmF1bHQgdmFsdWUgaXMgYHRydWVgIGZvciBST1cgYW5kIENPTC4gRm9yIFggYW5kIFksIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGB0cnVlYCBmb3IgcXVhbnRpdGF0aXZlIGFuZCB0aW1lIGZpZWxkcyBhbmQgYGZhbHNlYCBvdGhlcndpc2UuJ1xuICAgIH0sXG4gICAgbGF5ZXI6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdBIHN0cmluZyBpbmRpY2F0aW5nIGlmIHRoZSBheGlzIChhbmQgYW55IGdyaWRsaW5lcykgc2hvdWxkIGJlIHBsYWNlZCBhYm92ZSBvciBiZWxvdyB0aGUgZGF0YSBtYXJrcy4nXG4gICAgfSxcbiAgICBvZmZzZXQ6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgb2Zmc2V0LCBpbiBwaXhlbHMsIGJ5IHdoaWNoIHRvIGRpc3BsYWNlIHRoZSBheGlzIGZyb20gdGhlIGVkZ2Ugb2YgdGhlIGVuY2xvc2luZyBncm91cCBvciBkYXRhIHJlY3RhbmdsZS4nXG4gICAgfSxcbiAgICBvcmllbnQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZW51bTogWyd0b3AnLCAncmlnaHQnLCAnbGVmdCcsICdib3R0b20nXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBheGlzLiBPbmUgb2YgdG9wLCBib3R0b20sIGxlZnQgb3IgcmlnaHQuIFRoZSBvcmllbnRhdGlvbiBjYW4gYmUgdXNlZCB0byBmdXJ0aGVyIHNwZWNpYWxpemUgdGhlIGF4aXMgdHlwZSAoZS5nLiwgYSB5IGF4aXMgb3JpZW50ZWQgZm9yIHRoZSByaWdodCBlZGdlIG9mIHRoZSBjaGFydCkuJ1xuICAgIH0sXG4gICAgc3ViZGl2aWRlOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgcHJvdmlkZWQsIHNldHMgdGhlIG51bWJlciBvZiBtaW5vciB0aWNrcyBiZXR3ZWVuIG1ham9yIHRpY2tzICh0aGUgdmFsdWUgOSByZXN1bHRzIGluIGRlY2ltYWwgc3ViZGl2aXNpb24pLiBPbmx5IGFwcGxpY2FibGUgZm9yIGF4ZXMgdmlzdWFsaXppbmcgcXVhbnRpdGF0aXZlIHNjYWxlcy4nXG4gICAgfSxcbiAgICB0aWNrczoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBkZXNpcmVkIG51bWJlciBvZiB0aWNrcywgZm9yIGF4ZXMgdmlzdWFsaXppbmcgcXVhbnRpdGF0aXZlIHNjYWxlcy4gVGhlIHJlc3VsdGluZyBudW1iZXIgbWF5IGJlIGRpZmZlcmVudCBzbyB0aGF0IHZhbHVlcyBhcmUgXCJuaWNlXCIgKG11bHRpcGxlcyBvZiAyLCA1LCAxMCkgYW5kIGxpZSB3aXRoaW4gdGhlIHVuZGVybHlpbmcgc2NhbGVcXCdzIHJhbmdlLidcbiAgICB9LFxuICAgIHRpY2tQYWRkaW5nOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBwYWRkaW5nLCBpbiBwaXhlbHMsIGJldHdlZW4gdGlja3MgYW5kIHRleHQgbGFiZWxzLidcbiAgICB9LFxuICAgIHRpY2tTaXplOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgc2l6ZSwgaW4gcGl4ZWxzLCBvZiBtYWpvciwgbWlub3IgYW5kIGVuZCB0aWNrcy4nXG4gICAgfSxcbiAgICB0aWNrU2l6ZU1ham9yOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgc2l6ZSwgaW4gcGl4ZWxzLCBvZiBtYWpvciB0aWNrcy4nXG4gICAgfSxcbiAgICB0aWNrU2l6ZU1pbm9yOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgc2l6ZSwgaW4gcGl4ZWxzLCBvZiBtaW5vciB0aWNrcy4nXG4gICAgfSxcbiAgICB0aWNrU2l6ZUVuZDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHNpemUsIGluIHBpeGVscywgb2YgZW5kIHRpY2tzLidcbiAgICB9LFxuICAgIHRpdGxlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSB0aXRsZSBmb3IgdGhlIGF4aXMuIChTaG93cyBmaWVsZCBuYW1lIGFuZCBpdHMgZnVuY3Rpb24gYnkgZGVmYXVsdC4pJ1xuICAgIH0sXG4gICAgdGl0bGVPZmZzZXQ6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIGRlc2NyaXB0aW9uOiAnQSB0aXRsZSBvZmZzZXQgdmFsdWUgZm9yIHRoZSBheGlzLidcbiAgICB9LFxuICAgIHZhbHVlczoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgcHJvcGVydGllczoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ09wdGlvbmFsIG1hcmsgcHJvcGVydHkgZGVmaW5pdGlvbnMgZm9yIGN1c3RvbSBheGlzIHN0eWxpbmcuJ1xuICAgIH0sXG4gICAgLyogVmVnYS1saXRlIG9ubHkgKi9cbiAgICBjaGFyYWN0ZXJXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogNixcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2hhcmFjdGVyIHdpZHRoIGZvciBhdXRvbWF0aWNhbGx5IGRldGVybWluaW5nIHRpdGxlIG1heCBsZW5ndGguJ1xuICAgIH0sXG4gICAgbGFiZWxNYXhMZW5ndGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDI1LFxuICAgICAgbWluaW11bTogMSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVHJ1bmNhdGUgbGFiZWxzIHRoYXQgYXJlIHRvbyBsb25nLidcbiAgICB9LFxuICAgIGxhYmVsczoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5hYmxlIG9yIGRpc2FibGUgbGFiZWxzLidcbiAgICB9LFxuICAgIHNob3J0VGltZUxhYmVsczoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgbW9udGggYW5kIGRheSBuYW1lcyBzaG91bGQgYmUgYWJicmV2aWF0ZWQuJ1xuICAgIH0sXG4gICAgdGl0bGVNYXhMZW5ndGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZXNjcmlwdGlvbjogJ01heCBsZW5ndGggZm9yIGF4aXMgdGl0bGUgaWYgdGhlIHRpdGxlIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGZyb20gdGhlIGZpZWxkXFwncyBkZXNjcmlwdGlvbi4nICtcbiAgICAgICdCeSBkZWZhdWx0LCB0aGlzIGlzIGF1dG9tYXRpY2FsbHkgYmFzZWQgb24gY2VsbCBzaXplIGFuZCBjaGFyYWN0ZXJXaWR0aCBwcm9wZXJ0eS4nXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHtRVUFOVElUQVRJVkV9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHt0b01hcH0gZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmluIHtcbiAgbWluPzogbnVtYmVyO1xuICBtYXg/OiBudW1iZXI7XG4gIGJhc2U/OiBudW1iZXI7XG4gIHN0ZXA/OiBudW1iZXI7XG4gIHN0ZXBzPzogbnVtYmVyW107XG4gIG1pbnN0ZXA/OiBudW1iZXI7XG4gIGRpdj86IG51bWJlcltdO1xuICBtYXhiaW5zPzogbnVtYmVyO1xufVxuXG5leHBvcnQgdmFyIGJpbiA9IHtcbiAgdHlwZTogWydib29sZWFuJywgJ29iamVjdCddLFxuICBkZWZhdWx0OiBmYWxzZSxcbiAgcHJvcGVydGllczoge1xuICAgIG1pbjoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBtaW5pbXVtIGJpbiB2YWx1ZSB0byBjb25zaWRlci4gSWYgdW5zcGVjaWZpZWQsIHRoZSBtaW5pbXVtIHZhbHVlIG9mIHRoZSBzcGVjaWZpZWQgZmllbGQgaXMgdXNlZC4nXG4gICAgfSxcbiAgICBtYXg6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgbWF4aW11bSBiaW4gdmFsdWUgdG8gY29uc2lkZXIuIElmIHVuc3BlY2lmaWVkLCB0aGUgbWF4aW11bSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIGZpZWxkIGlzIHVzZWQuJ1xuICAgIH0sXG4gICAgYmFzZToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBudW1iZXIgYmFzZSB0byB1c2UgZm9yIGF1dG9tYXRpYyBiaW4gZGV0ZXJtaW5hdGlvbiAoZGVmYXVsdCBpcyBiYXNlIDEwKS4nXG4gICAgfSxcbiAgICBzdGVwOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQW4gZXhhY3Qgc3RlcCBzaXplIHRvIHVzZSBiZXR3ZWVuIGJpbnMuIElmIHByb3ZpZGVkLCBvcHRpb25zIHN1Y2ggYXMgbWF4YmlucyB3aWxsIGJlIGlnbm9yZWQuJ1xuICAgIH0sXG4gICAgc3RlcHM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FuIGFycmF5IG9mIGFsbG93YWJsZSBzdGVwIHNpemVzIHRvIGNob29zZSBmcm9tLidcbiAgICB9LFxuICAgIG1pbnN0ZXA6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdBIG1pbmltdW0gYWxsb3dhYmxlIHN0ZXAgc2l6ZSAocGFydGljdWxhcmx5IHVzZWZ1bCBmb3IgaW50ZWdlciB2YWx1ZXMpLidcbiAgICB9LFxuICAgIGRpdjoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2NhbGUgZmFjdG9ycyBpbmRpY2F0aW5nIGFsbG93YWJsZSBzdWJkaXZpc2lvbnMuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIFs1LCAyXSwgd2hpY2ggaW5kaWNhdGVzIHRoYXQgZm9yIGJhc2UgMTAgbnVtYmVycyAodGhlIGRlZmF1bHQgYmFzZSksIHRoZSBtZXRob2QgbWF5IGNvbnNpZGVyIGRpdmlkaW5nIGJpbiBzaXplcyBieSA1IGFuZC9vciAyLiBGb3IgZXhhbXBsZSwgZm9yIGFuIGluaXRpYWwgc3RlcCBzaXplIG9mIDEwLCB0aGUgbWV0aG9kIGNhbiBjaGVjayBpZiBiaW4gc2l6ZXMgb2YgMiAoPSAxMC81KSwgNSAoPSAxMC8yKSwgb3IgMSAoPSAxMC8oNSoyKSkgbWlnaHQgYWxzbyBzYXRpc2Z5IHRoZSBnaXZlbiBjb25zdHJhaW50cy4nXG4gICAgfSxcbiAgICBtYXhiaW5zOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBtaW5pbXVtOiAyLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXhpbXVtIG51bWJlciBvZiBiaW5zLidcbiAgICB9XG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUVVBTlRJVEFUSVZFXSkgLy8gVE9ETzogYWRkIE8gYWZ0ZXIgZmluaXNoaW5nICM4MVxufTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgQ2VsbENvbmZpZyB7XG4gIGdyaWRDb2xvcj86IHN0cmluZztcbiAgZ3JpZE9wYWNpdHk/OiBudW1iZXI7XG4gIGdyaWRPZmZzZXQ/OiBudW1iZXI7XG5cbiAgZmlsbD86IHN0cmluZztcbiAgZmlsbE9wYWNpdHk/OiBudW1iZXI7XG4gIHN0cm9rZT86IHN0cmluZztcbiAgc3Ryb2tlV2lkdGg/OiBudW1iZXI7XG4gIHN0cm9rZU9wYWNpdHk/IDpudW1iZXI7XG4gIHN0cm9rZURhc2g/OiBudW1iZXI7XG4gIHN0cm9rZURhc2hPZmZzZXQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjb25zdCBjZWxsQ29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGdyaWRDb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJyMwMDAwMDAnXG4gICAgfSxcbiAgICBncmlkT3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMSxcbiAgICAgIGRlZmF1bHQ6IDAuNFxuICAgIH0sXG4gICAgZ3JpZE9mZnNldDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfSxcblxuICAgIC8vIEdyb3VwIHByb3BlcnRpZXNcbiAgICBjbGlwOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgfSxcbiAgICBmaWxsOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAncmdiYSgwLDAsMCwwKSdcbiAgICB9LFxuICAgIGZpbGxPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICB9LFxuICAgIHN0cm9rZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgIH0sXG4gICAgc3Ryb2tlV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgIH0sXG4gICAgc3Ryb2tlT3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcidcbiAgICB9LFxuICAgIHN0cm9rZURhc2g6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHN0cm9rZURhc2hPZmZzZXQ6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9mZnNldCAoaW4gcGl4ZWxzKSBpbnRvIHdoaWNoIHRvIGJlZ2luIGRyYXdpbmcgd2l0aCB0aGUgc3Ryb2tlIGRhc2ggYXJyYXkuJ1xuICAgIH1cbiAgfVxufTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgTWFya0NvbmZpZyB7XG4gIC8vIFZlZ2EtTGl0ZSBTcGVjaWZpY1xuICBmaWxsZWQ/OiBib29sZWFuO1xuICBjb2xvcj86IHN0cmluZztcbiAgYmFyV2lkdGg/OiBudW1iZXI7XG4gIHRpY2tXaWR0aD86IG51bWJlcjtcbiAgc3RhY2tlZD86IHN0cmluZztcblxuICAvLyBHZW5lcmFsIFZlZ2FcbiAgb3BhY2l0eT86IG51bWJlcjtcbiAgc3Ryb2tlV2lkdGg/OiBudW1iZXI7XG4gIHN0cm9rZURhc2g/OiBudW1iZXJbXTtcbiAgc3Ryb2tlRGFzaE9mZnNldD86IG51bWJlcltdO1xuICBmaWxsPzogc3RyaW5nO1xuICBmaWxsT3BhY2l0eT86IG51bWJlcjtcbiAgc3Ryb2tlPzogc3RyaW5nO1xuICBzdHJva2VPcGFjaXR5PzogbnVtYmVyO1xuXG5cbiAgLy8gQmFyLCBUaWNrLCBMaW5lLCBBcmVhXG4gIG9yaWVudD86IHN0cmluZztcbiAgLy8gTGluZSAvIGFyZWFcbiAgaW50ZXJwb2xhdGU/OiBzdHJpbmc7XG4gIHRlbnNpb24/OiBudW1iZXI7XG5cbiAgLy8gUG9pbnQgLyBTcXVhcmUgLyBDaXJjbGVcbiAgc2hhcGU/OiBzdHJpbmc7XG4gIHNpemU/OiBudW1iZXI7XG5cbiAgLy8gVGljay1vbmx5XG4gIHRoaWNrbmVzcz86IG51bWJlcjtcblxuICAvLyBUZXh0LW9ubHlcbiAgYWxpZ24/OiBzdHJpbmc7XG4gIGFuZ2xlPzogbnVtYmVyO1xuICBiYXNlbGluZT86IHN0cmluZztcbiAgZHg/OiBudW1iZXI7XG4gIGR5PzogbnVtYmVyO1xuICByYWRpdXM/OiBudW1iZXI7XG4gIHRoZXRhPzogbnVtYmVyO1xuICBmb250Pzogc3RyaW5nO1xuICBmb250U2l6ZT86IG51bWJlcjtcbiAgZm9udFN0eWxlPzogc3RyaW5nO1xuICBmb250V2VpZ2h0Pzogc3RyaW5nO1xuICAvLyBWZWdhLUxpdGUgb25seSBmb3IgdGV4dCBvbmx5XG4gIGZvcm1hdD86IHN0cmluZztcbiAgc2hvcnRUaW1lTGFiZWxzPzogYm9vbGVhbjtcblxuICBhcHBseUNvbG9yVG9CYWNrZ3JvdW5kPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IG1hcmtDb25maWcgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gVmVnYS1MaXRlIHNwZWNpYWxcbiAgICBmaWxsZWQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0aGUgc2hhcGVcXCdzIGNvbG9yIHNob3VsZCBiZSB1c2VkIGFzIGZpbGwgY29sb3IgaW5zdGVhZCBvZiBzdHJva2UgY29sb3IuICcgK1xuICAgICAgICAnVGhpcyBpcyBvbmx5IGFwcGxpY2FibGUgZm9yIFwiYmFyXCIsIFwicG9pbnRcIiwgYW5kIFwiYXJlYVwiLiAnICtcbiAgICAgICAgJ0FsbCBtYXJrcyBleGNlcHQgXCJwb2ludFwiIG1hcmtzIGFyZSBmaWxsZWQgYnkgZGVmYXVsdC4nXG4gICAgfSxcbiAgICBjb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJyM0NjgyYjQnLFxuICAgICAgZGVzY3JpcHRpb246ICdEZWZhdWx0IGNvbG9yLidcbiAgICB9LFxuICAgIGJhcldpZHRoOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHdpZHRoIG9mIHRoZSBiYXJzLiAgSWYgdW5zcGVjaWZpZWQsIHRoZSBkZWZhdWx0IHdpZHRoIGlzICBgYmFuZFdpZHRoLTFgLCB3aGljaCBwcm92aWRlcyAxIHBpeGVsIG9mZnNldCBiZXR3ZWVuIGJhcnMuJ1xuICAgIH0sXG4gICAgdGlja1dpZHRoOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSB3aWR0aCBvZiB0aGUgdGlja3MuJ1xuICAgIH0sXG4gICAgc3RhY2tlZDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ3plcm8nLCAnY2VudGVyJywgJ25vcm1hbGl6ZScsICdub25lJ10sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICAgIC8vIFRPRE8oIzYyMCkgcmVmZXIgdG8gVmVnYSBzcGVjIG9uY2UgaXQgZG9lc24ndCB0aHJvdyBlcnJvclxuICAgICAgLy8gZW51bTogdmdTdGFja1NjaGVtYS5wcm9wZXJ0aWVzLm9mZnNldC5vbmVPZlswXS5lbnVtXG4gICAgfSxcbiAgICAvLyBHZW5lcmFsIFZlZ2FcbiAgICBmaWxsOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIGZpbGxPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxXG4gICAgfSxcbiAgICBzdHJva2U6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgc3Ryb2tlT3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMVxuICAgIH0sXG4gICAgb3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMVxuICAgIH0sXG4gICAgc3Ryb2tlV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMixcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIHN0cm9rZURhc2g6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FuIGFycmF5IG9mIGFsdGVybmF0aW5nIHN0cm9rZSwgc3BhY2UgbGVuZ3RocyBmb3IgY3JlYXRpbmcgZGFzaGVkIG9yIGRvdHRlZCBsaW5lcy4nXG4gICAgfSxcbiAgICBzdHJva2VEYXNoT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgb2Zmc2V0IChpbiBwaXhlbHMpIGludG8gd2hpY2ggdG8gYmVnaW4gZHJhd2luZyB3aXRoIHRoZSBzdHJva2UgZGFzaCBhcnJheS4nXG4gICAgfSxcblxuICAgIC8vIEJhciwgVGljaywgTGluZSwgQXJlYVxuICAgIG9yaWVudDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvcmllbnRhdGlvbiBvZiBhIG5vbi1zdGFja2VkIGJhciwgdGljaywgYXJlYSwgYW5kIGxpbmUgY2hhcnRzLicgK1xuICAgICAgICdUaGUgdmFsdWUgaXMgZWl0aGVyIGhvcml6b250YWwgKGRlZmF1bHQpIG9yIHZlcnRpY2FsLicgK1xuICAgICAgICdGb3IgYmFyIGFuZCB0aWNrLCB0aGlzIGRldGVybWluZXMgd2hldGhlciB0aGUgc2l6ZSBvZiB0aGUgYmFyIGFuZCB0aWNrIHNob3VsZCBiZSBhcHBsaWVkIHRvIHggb3IgeSBkaW1lbnNpb24uJyArXG4gICAgICAgJ0ZvciBhcmVhLCB0aGlzIHByb3BlcnR5IGRldGVybWluZXMgdGhlIG9yaWVudCBwcm9wZXJ0eSBvZiB0aGUgVmVnYSBvdXRwdXQuJyArXG4gICAgICAgJ0ZvciBsaW5lLCB0aGlzIHByb3BlcnR5IGRldGVybWluZXMgdGhlIHNvcnQgb3JkZXIgb2YgdGhlIHBvaW50cyBpbiB0aGUgbGluZSBpZiBgY29uZmlnLnNvcnRMaW5lQnlgIGlzIG5vdCBzcGVjaWZpZWQuJyArXG4gICAgICAgJ0ZvciBzdGFja2VkIGNoYXJ0cywgdGhpcyBpcyBhbHdheXMgZGV0ZXJtaW5lZCBieSB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHN0YWNrOyAnICtcbiAgICAgICAndGhlcmVmb3JlIGV4cGxpY2l0bHkgc3BlY2lmaWVkIHZhbHVlIHdpbGwgYmUgaWdub3JlZC4nXG4gICAgfSxcblxuICAgIC8vIGxpbmUgLyBhcmVhXG4gICAgaW50ZXJwb2xhdGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgLy8gVE9ETyBiZXR0ZXIgZGVzY3JpYmUgdGhhdCBzb21lIG9mIHRoZW0gaXNuJ3Qgc3VwcG9ydGVkIGluIGFyZWFcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGxpbmUgaW50ZXJwb2xhdGlvbiBtZXRob2QgdG8gdXNlLiBPbmUgb2YgbGluZWFyLCBzdGVwLWJlZm9yZSwgc3RlcC1hZnRlciwgYmFzaXMsIGJhc2lzLW9wZW4sIGJhc2lzLWNsb3NlZCwgYnVuZGxlLCBjYXJkaW5hbCwgY2FyZGluYWwtb3BlbiwgY2FyZGluYWwtY2xvc2VkLCBtb25vdG9uZS4nXG4gICAgfSxcbiAgICB0ZW5zaW9uOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVwZW5kaW5nIG9uIHRoZSBpbnRlcnBvbGF0aW9uIHR5cGUsIHNldHMgdGhlIHRlbnNpb24gcGFyYW1ldGVyLidcbiAgICB9LFxuXG4gICAgLy8gcG9pbnRcbiAgICBzaGFwZToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBlbnVtOiBbJ2NpcmNsZScsICdzcXVhcmUnLCAnY3Jvc3MnLCAnZGlhbW9uZCcsICd0cmlhbmdsZS11cCcsICd0cmlhbmdsZS1kb3duJ10sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBzeW1ib2wgc2hhcGUgdG8gdXNlLiBPbmUgb2YgY2lyY2xlIChkZWZhdWx0KSwgc3F1YXJlLCBjcm9zcywgZGlhbW9uZCwgdHJpYW5nbGUtdXAsIG9yIHRyaWFuZ2xlLWRvd24uJ1xuICAgIH0sXG4gICAgLy8gcG9pbnQgLyBjaXJjbGUgLyBzcXVhcmVcbiAgICBzaXplOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDMwLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgcGl4ZWwgYXJlYSBlYWNoIHRoZSBwb2ludC4gRm9yIGV4YW1wbGU6IGluIHRoZSBjYXNlIG9mIGNpcmNsZXMsIHRoZSByYWRpdXMgaXMgZGV0ZXJtaW5lZCBpbiBwYXJ0IGJ5IHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgc2l6ZSB2YWx1ZS4nXG4gICAgfSxcblxuICAgIC8vIFRpY2stb25seVxuICAgIHRoaWNrbmVzczoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAxLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGlja25lc3Mgb2YgdGhlIHRpY2sgbWFyay4nXG4gICAgfSxcblxuICAgIC8vIHRleHQtb25seVxuICAgIGFsaWduOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGVudW06IFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGhvcml6b250YWwgYWxpZ25tZW50IG9mIHRoZSB0ZXh0LiBPbmUgb2YgbGVmdCwgcmlnaHQsIGNlbnRlci4nXG4gICAgfSxcbiAgICBhbmdsZToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSByb3RhdGlvbiBhbmdsZSBvZiB0aGUgdGV4dCwgaW4gZGVncmVlcy4nXG4gICAgfSxcbiAgICBiYXNlbGluZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnbWlkZGxlJyxcbiAgICAgIGVudW06IFsndG9wJywgJ21pZGRsZScsICdib3R0b20nXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHZlcnRpY2FsIGFsaWdubWVudCBvZiB0aGUgdGV4dC4gT25lIG9mIHRvcCwgbWlkZGxlLCBib3R0b20uJ1xuICAgIH0sXG4gICAgZHg6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgaG9yaXpvbnRhbCBvZmZzZXQsIGluIHBpeGVscywgYmV0d2VlbiB0aGUgdGV4dCBsYWJlbCBhbmQgaXRzIGFuY2hvciBwb2ludC4gVGhlIG9mZnNldCBpcyBhcHBsaWVkIGFmdGVyIHJvdGF0aW9uIGJ5IHRoZSBhbmdsZSBwcm9wZXJ0eS4nXG4gICAgfSxcbiAgICBkeToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSB2ZXJ0aWNhbCBvZmZzZXQsIGluIHBpeGVscywgYmV0d2VlbiB0aGUgdGV4dCBsYWJlbCBhbmQgaXRzIGFuY2hvciBwb2ludC4gVGhlIG9mZnNldCBpcyBhcHBsaWVkIGFmdGVyIHJvdGF0aW9uIGJ5IHRoZSBhbmdsZSBwcm9wZXJ0eS4nXG4gICAgfSxcbiAgICBmb250OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIHJvbGU6ICdmb250JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHR5cGVmYWNlIHRvIHNldCB0aGUgdGV4dCBpbiAoZS5nLiwgSGVsdmV0aWNhIE5ldWUpLidcbiAgICB9LFxuICAgIGZvbnRTaXplOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9udCBzaXplLCBpbiBwaXhlbHMuJ1xuICAgIH0sXG4gICAgLy8gZm9udFNpemUgZXhjbHVkZWQgYXMgd2UgdXNlIHNpemUudmFsdWVcbiAgICBmb250U3R5bGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZW51bTogWydub3JtYWwnLCAnaXRhbGljJ10sXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb250IHN0eWxlIChlLmcuLCBpdGFsaWMpLidcbiAgICB9LFxuICAgIGZvbnRXZWlnaHQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydub3JtYWwnLCAnYm9sZCddLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9udCB3ZWlnaHQgKGUuZy4sIGJvbGQpLidcbiAgICB9LFxuICAgIHJhZGl1czoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1BvbGFyIGNvb3JkaW5hdGUgcmFkaWFsIG9mZnNldCwgaW4gcGl4ZWxzLCBvZiB0aGUgdGV4dCBsYWJlbCBmcm9tIHRoZSBvcmlnaW4gZGV0ZXJtaW5lZCBieSB0aGUgeCBhbmQgeSBwcm9wZXJ0aWVzLidcbiAgICB9LFxuICAgIHRoZXRhOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUG9sYXIgY29vcmRpbmF0ZSBhbmdsZSwgaW4gcmFkaWFucywgb2YgdGhlIHRleHQgbGFiZWwgZnJvbSB0aGUgb3JpZ2luIGRldGVybWluZWQgYnkgdGhlIHggYW5kIHkgcHJvcGVydGllcy4gVmFsdWVzIGZvciB0aGV0YSBmb2xsb3cgdGhlIHNhbWUgY29udmVudGlvbiBvZiBhcmMgbWFyayBzdGFydEFuZ2xlIGFuZCBlbmRBbmdsZSBwcm9wZXJ0aWVzOiBhbmdsZXMgYXJlIG1lYXN1cmVkIGluIHJhZGlhbnMsIHdpdGggMCBpbmRpY2F0aW5nIFwibm9ydGhcIi4nXG4gICAgfSxcbiAgICAvLyB0ZXh0LW9ubHkgJiBWTCBvbmx5XG4gICAgZm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgdGV4dCB2YWx1ZS4gSWYgbm90IGRlZmluZWQsIHRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGF1dG9tYXRpY2FsbHkuICdcbiAgICB9LFxuICAgIHNob3J0VGltZUxhYmVsczoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgbW9udGggbmFtZXMgYW5kIHdlZWtkYXkgbmFtZXMgc2hvdWxkIGJlIGFiYnJldmlhdGVkLidcbiAgICB9LFxuICAgIGFwcGx5Q29sb3JUb0JhY2tncm91bmQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdBcHBseSBjb2xvciBmaWVsZCB0byBiYWNrZ3JvdW5kIGNvbG9yIGluc3RlYWQgb2YgdGhlIHRleHQuJ1xuICAgIH1cbiAgfVxufTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgU2NlbmVDb25maWcge1xuICBmaWxsPzogc3RyaW5nO1xuICBmaWxsT3BhY2l0eT86IG51bWJlcjtcbiAgc3Ryb2tlPzogc3RyaW5nO1xuICBzdHJva2VXaWR0aD86IG51bWJlcjtcbiAgc3Ryb2tlT3BhY2l0eT8gOm51bWJlcjtcbiAgc3Ryb2tlRGFzaD86IG51bWJlcjtcbiAgc3Ryb2tlRGFzaE9mZnNldD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IHNjZW5lQ29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGZpbGw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJ1xuICAgIH0sXG4gICAgZmlsbE9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgIH0sXG4gICAgc3Ryb2tlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgfSxcbiAgICBzdHJva2VXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgfSxcbiAgICBzdHJva2VPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgIH0sXG4gICAgc3Ryb2tlRGFzaDoge1xuICAgICAgdHlwZTogJ2FycmF5J1xuICAgIH0sXG4gICAgc3Ryb2tlRGFzaE9mZnNldDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgb2Zmc2V0IChpbiBwaXhlbHMpIGludG8gd2hpY2ggdG8gYmVnaW4gZHJhd2luZyB3aXRoIHRoZSBzdHJva2UgZGFzaCBhcnJheS4nXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHtVbml0Q29uZmlnLCB1bml0Q29uZmlnfSBmcm9tICcuL2NvbmZpZy51bml0LnNjaGVtYSc7XG5pbXBvcnQge0NlbGxDb25maWcsIGNlbGxDb25maWd9IGZyb20gJy4vY29uZmlnLmNlbGwuc2NoZW1hJztcbmltcG9ydCB7TWFya0NvbmZpZywgbWFya0NvbmZpZ30gZnJvbSAnLi9jb25maWcubWFya3Muc2NoZW1hJztcbmltcG9ydCB7U2NlbmVDb25maWcsIHNjZW5lQ29uZmlnfSBmcm9tICcuL2NvbmZpZy5zY2VuZS5zY2hlbWEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gIC8vIFRPRE86IGFkZCB0aGlzIGJhY2sgb25jZSB3ZSBoYXZlIHRvcC1kb3duIGxheW91dCBhcHByb2FjaFxuICAvLyB3aWR0aD86IG51bWJlcjtcbiAgLy8gaGVpZ2h0PzogbnVtYmVyO1xuICAvLyBwYWRkaW5nPzogbnVtYmVyfHN0cmluZztcbiAgdmlld3BvcnQ/OiBudW1iZXI7XG4gIGJhY2tncm91bmQ/OiBzdHJpbmc7XG5cbiAgbnVtYmVyRm9ybWF0Pzogc3RyaW5nO1xuICB0aW1lRm9ybWF0Pzogc3RyaW5nO1xuXG4gIHVuaXQ/OiBVbml0Q29uZmlnO1xuICBjZWxsPzogQ2VsbENvbmZpZztcbiAgbWFyaz86IE1hcmtDb25maWc7XG4gIHNjZW5lPzogU2NlbmVDb25maWc7XG59XG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gdGVtcGxhdGVcbiAgICAvLyBUT0RPOiBhZGQgdGhpcyBiYWNrIG9uY2Ugd2UgaGF2ZSB0b3AtZG93biBsYXlvdXQgYXBwcm9hY2hcbiAgICAvLyB3aWR0aDoge1xuICAgIC8vICAgdHlwZTogJ2ludGVnZXInLFxuICAgIC8vICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgLy8gfSxcbiAgICAvLyBoZWlnaHQ6IHtcbiAgICAvLyAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAvLyAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIC8vIH0sXG4gICAgLy8gcGFkZGluZzoge1xuICAgIC8vICAgdHlwZTogWydudW1iZXInLCAnc3RyaW5nJ10sXG4gICAgLy8gICBkZWZhdWx0OiAnYXV0bydcbiAgICAvLyB9LFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgb24tc2NyZWVuIHZpZXdwb3J0LCBpbiBwaXhlbHMuIElmIG5lY2Vzc2FyeSwgY2xpcHBpbmcgYW5kIHNjcm9sbGluZyB3aWxsIGJlIGFwcGxpZWQuJ1xuICAgIH0sXG4gICAgYmFja2dyb3VuZDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdDU1MgY29sb3IgcHJvcGVydHkgdG8gdXNlIGFzIGJhY2tncm91bmQgb2YgdmlzdWFsaXphdGlvbi4gRGVmYXVsdCBpcyBgXCJ0cmFuc3BhcmVudFwiYC4nXG4gICAgfSxcblxuICAgIC8vIGZvcm1hdHNcbiAgICBudW1iZXJGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ3MnLFxuICAgICAgZGVzY3JpcHRpb246ICdEMyBOdW1iZXIgZm9ybWF0IGZvciBheGlzIGxhYmVscyBhbmQgdGV4dCB0YWJsZXMuIEZvciBleGFtcGxlIFwic1wiIGZvciBTSSB1bml0cy4nXG4gICAgfSxcbiAgICB0aW1lRm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICclWS0lbS0lZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0RlZmF1bHQgZGF0ZXRpbWUgZm9ybWF0IGZvciBheGlzIGFuZCBsZWdlbmQgbGFiZWxzLiBUaGUgZm9ybWF0IGNhbiBiZSBzZXQgZGlyZWN0bHkgb24gZWFjaCBheGlzIGFuZCBsZWdlbmQuJ1xuICAgIH0sXG5cbiAgICAvLyBuZXN0ZWRcbiAgICB1bml0OiB1bml0Q29uZmlnLFxuICAgIGNlbGw6IGNlbGxDb25maWcsXG4gICAgbWFyazogbWFya0NvbmZpZyxcbiAgICBzY2VuZTogc2NlbmVDb25maWdcbiAgfVxufTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgVW5pdENvbmZpZyB7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjb25zdCB1bml0Q29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDBcbiAgICB9LFxuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjAwXG4gICAgfVxuICB9XG59O1xuIiwiZXhwb3J0IGludGVyZmFjZSBEYXRhIHtcbiAgZm9ybWF0VHlwZT86IHN0cmluZztcbiAgdXJsPzogc3RyaW5nO1xuICB2YWx1ZXM/OiBhbnlbXTtcbn1cblxuZXhwb3J0IHZhciBkYXRhID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIC8vIGRhdGEgc291cmNlXG4gICAgZm9ybWF0VHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2pzb24nLCAnY3N2JywgJ3RzdiddLFxuICAgICAgZGVmYXVsdDogJ2pzb24nXG4gICAgfSxcbiAgICB1cmw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2YWx1ZXM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Bhc3MgYXJyYXkgb2Ygb2JqZWN0cyBpbnN0ZWFkIG9mIGEgdXJsIHRvIGEgZmlsZS4nLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHtGaWVsZERlZiwgZGV0YWlsRmllbGREZWZzLCBmYWNldEZpZWxkRGVmLCBvcmRlckZpZWxkRGVmcywgcG9zaXRpb25GaWVsZERlZiwgc2hhcGVGaWVsZERlZiwgc2l6ZUZpZWxkRGVmLCB0ZXh0RmllbGREZWYsIGNvbG9yRmllbGREZWZ9IGZyb20gJy4vZmllbGRkZWYuc2NoZW1hJztcblxuZXhwb3J0IGludGVyZmFjZSBFbmNvZGluZyB7XG4gIHg/OiBGaWVsZERlZjtcbiAgeT86IEZpZWxkRGVmO1xuICByb3c/OiBGaWVsZERlZjtcbiAgY29sdW1uPzogRmllbGREZWY7XG4gIGNvbG9yPzogRmllbGREZWY7XG4gIHNpemU/OiBGaWVsZERlZjtcbiAgc2hhcGU/OiBGaWVsZERlZjtcbiAgZGV0YWlsPzogRmllbGREZWYgfCBGaWVsZERlZltdO1xuICB0ZXh0PzogRmllbGREZWY7XG4gIGxhYmVsPzogRmllbGREZWY7XG5cbiAgcGF0aD86IEZpZWxkRGVmIHwgRmllbGREZWZbXTtcbiAgb3JkZXI/OiBGaWVsZERlZiB8IEZpZWxkRGVmW107XG59XG5cbmV4cG9ydCBjb25zdCBlbmNvZGluZyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICB4OiBwb3NpdGlvbkZpZWxkRGVmLFxuICAgIHk6IHBvc2l0aW9uRmllbGREZWYsXG4gICAgcm93OiBmYWNldEZpZWxkRGVmLFxuICAgIGNvbHVtbjogZmFjZXRGaWVsZERlZixcbiAgICBzaXplOiBzaXplRmllbGREZWYsXG4gICAgY29sb3I6IGNvbG9yRmllbGREZWYsXG4gICAgc2hhcGU6IHNoYXBlRmllbGREZWYsXG4gICAgdGV4dDogdGV4dEZpZWxkRGVmLFxuICAgIGRldGFpbDogZGV0YWlsRmllbGREZWZzLFxuICAgIGxhYmVsOiB0ZXh0RmllbGREZWYsXG4gICAgcGF0aDogb3JkZXJGaWVsZERlZnMsXG4gICAgb3JkZXI6IG9yZGVyRmllbGREZWZzXG4gIH1cbn07XG4iLCJpbXBvcnQge2F4aXMsIEF4aXN9IGZyb20gJy4vYXhpcy5zY2hlbWEnO1xuaW1wb3J0IHtiaW4sIEJpbn0gZnJvbSAnLi9iaW4uc2NoZW1hJztcbmltcG9ydCB7bGVnZW5kLCBMZWdlbmR9IGZyb20gJy4vbGVnZW5kLnNjaGVtYSc7XG5pbXBvcnQge3R5cGljYWxTY2FsZSwgb3JkaW5hbE9ubHlTY2FsZSwgU2NhbGV9IGZyb20gJy4vc2NhbGUuc2NoZW1hJztcbmltcG9ydCB7c29ydCwgc29ydEVudW0sIFNvcnR9IGZyb20gJy4vc29ydC5zY2hlbWEnO1xuXG5pbXBvcnQge0FHR1JFR0FURV9PUFN9IGZyb20gJy4uL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge3RvTWFwLCBkdXBsaWNhdGV9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHttZXJnZURlZXB9IGZyb20gJy4vc2NoZW1hdXRpbCc7XG5pbXBvcnQge1RJTUVVTklUU30gZnJvbSAnLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtOT01JTkFMLCBPUkRJTkFMLCBRVUFOVElUQVRJVkUsIFRFTVBPUkFMLCBUeXBlfSBmcm9tICcuLi90eXBlJztcblxuLyoqXG4gKiAgSW50ZXJmYWNlIGZvciBhbnkga2luZCBvZiBGaWVsZERlZjtcbiAqICBGb3Igc2ltcGxpY2l0eSwgd2UgZG8gbm90IGRlY2xhcmUgbXVsdGlwbGUgaW50ZXJmYWNlcyBvZiBGaWVsZERlZiBsaWtlXG4gKiAgd2UgZG8gZm9yIEpTT04gc2NoZW1hLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpZWxkRGVmIHtcbiAgZmllbGQ/OiBzdHJpbmc7XG4gIHR5cGU/OiBUeXBlO1xuICB2YWx1ZT86IGFueTtcblxuICAvLyBmdW5jdGlvblxuICB0aW1lVW5pdD86IHN0cmluZztcbiAgYmluPzogYm9vbGVhbiB8IEJpbjtcblxuICBhZ2dyZWdhdGU/OiBzdHJpbmc7XG4gIHNvcnQ/OiBTb3J0IHwgc3RyaW5nO1xuXG4gIC8vIG92ZXJyaWRlIHZlZ2EgY29tcG9uZW50c1xuICBheGlzPzogQXhpcyB8IGJvb2xlYW47XG4gIGxlZ2VuZD86IExlZ2VuZCB8IGJvb2xlYW47XG4gIHNjYWxlPzogU2NhbGU7XG5cbiAgLy8gVE9ETzogbWF5YmUgZXh0ZW5kIHRoaXMgaW4gb3RoZXIgYXBwP1xuICAvLyB1bnVzZWQgbWV0YWRhdGEgLS0gZm9yIG90aGVyIGFwcGxpY2F0aW9uXG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgYWdncmVnYXRlID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogQUdHUkVHQVRFX09QUyxcbiAgc3VwcG9ydGVkRW51bXM6IHtcbiAgICBxdWFudGl0YXRpdmU6IEFHR1JFR0FURV9PUFMsXG4gICAgb3JkaW5hbDogWydtZWRpYW4nLCdtaW4nLCdtYXgnXSxcbiAgICBub21pbmFsOiBbXSxcbiAgICB0ZW1wb3JhbDogWydtZWFuJywgJ21lZGlhbicsICdtaW4nLCAnbWF4J10sIC8vIFRPRE86IHJldmlzZSB3aGF0IHNob3VsZCB0aW1lIHN1cHBvcnRcbiAgICAnJzogWydjb3VudCddXG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUVVBTlRJVEFUSVZFLCBOT01JTkFMLCBPUkRJTkFMLCBURU1QT1JBTCwgJyddKVxufTtcblxuY29uc3QgZmllbGREZWYgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZmllbGQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogWydzdHJpbmcnLCAnbnVtYmVyJ11cbiAgICB9LFxuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogW05PTUlOQUwsIE9SRElOQUwsIFFVQU5USVRBVElWRSwgVEVNUE9SQUxdXG4gICAgfSxcbiAgICBiaW46IGJpbixcbiAgICB0aW1lVW5pdDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBUSU1FVU5JVFMsXG4gICAgICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1RFTVBPUkFMXSlcbiAgICB9LFxuICAgIGFnZ3JlZ2F0ZTogYWdncmVnYXRlLFxuICB9XG59O1xuXG5jb25zdCBmaWVsZERlZldpdGhTY2FsZSA9IG1lcmdlRGVlcChkdXBsaWNhdGUoZmllbGREZWYpLCB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBzY2FsZTogdHlwaWNhbFNjYWxlLFxuICAgIHNvcnQ6IHNvcnRcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBwb3NpdGlvbkZpZWxkRGVmID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShmaWVsZERlZldpdGhTY2FsZSksIHtcbiAgcmVxdWlyZWQ6IFsnZmllbGQnLCAndHlwZSddLCAvLyBUT0RPOiByZW1vdmUgaWYgcG9zc2libGVcbiAgcHJvcGVydGllczoge1xuICAgIHNjYWxlOiB7XG4gICAgICAvLyBUT0RPOiByZW1vdmVcbiAgICAgIC8vIHJlcGxhY2luZyBkZWZhdWx0IHZhbHVlcyBmb3IganVzdCB0aGVzZSB0d28gYXhlc1xuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBwYWRkaW5nOiB7ZGVmYXVsdDogMX1cbiAgICAgIH1cbiAgICB9LFxuICAgIGF4aXM6IGF4aXNcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBjb2xvckZpZWxkRGVmID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShmaWVsZERlZldpdGhTY2FsZSksIHtcbiAgcHJvcGVydGllczoge1xuICAgIGxlZ2VuZDogbGVnZW5kXG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3Qgc2l6ZUZpZWxkRGVmID0gY29sb3JGaWVsZERlZjtcblxuLy8gRGV0YWlsXG5cbmV4cG9ydCBjb25zdCBkZXRhaWxGaWVsZERlZnMgPSB7XG4gIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgb25lT2Y6IFtkdXBsaWNhdGUoZmllbGREZWYpLCB7XG4gICAgdHlwZTogJ2FycmF5JyxcbiAgICBpdGVtczogZHVwbGljYXRlKGZpZWxkRGVmKVxuICB9XVxufTtcblxuLy8gT3JkZXIgUGF0aCBoYXZlIG5vIHNjYWxlXG5cbmNvbnN0IG9yZGVyRmllbGREZWYgPSBtZXJnZURlZXAoZHVwbGljYXRlKGZpZWxkRGVmKSwge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgc29ydDogc29ydEVudW1cbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBvcmRlckZpZWxkRGVmcyA9IHtcbiAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICBvbmVPZjogW2R1cGxpY2F0ZShvcmRlckZpZWxkRGVmKSwge1xuICAgIHR5cGU6ICdhcnJheScsXG4gICAgaXRlbXM6IGR1cGxpY2F0ZShvcmRlckZpZWxkRGVmKVxuICB9XVxufTtcblxuLy8gVGV4dCBoYXMgZGVmYXVsdCB2YWx1ZSA9IGBBYmNgXG5cbmV4cG9ydCBjb25zdCB0ZXh0RmllbGREZWYgPSBtZXJnZURlZXAoZHVwbGljYXRlKGZpZWxkRGVmKSwge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ0FiYydcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBTaGFwZSAvIFJvdyAvIENvbHVtbiBvbmx5IHN1cHBvcnRzIG9yZGluYWwgc2NhbGVcblxuY29uc3QgZmllbGREZWZXaXRoT3JkaW5hbFNjYWxlID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShmaWVsZERlZiksIHtcbiAgcHJvcGVydGllczoge1xuICAgIHNjYWxlOiBvcmRpbmFsT25seVNjYWxlLFxuICAgIHNvcnQ6IHNvcnRcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBzaGFwZUZpZWxkRGVmID0gIG1lcmdlRGVlcChkdXBsaWNhdGUoZmllbGREZWZXaXRoT3JkaW5hbFNjYWxlKSwge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGVnZW5kOiBsZWdlbmRcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBmYWNldEZpZWxkRGVmID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShmaWVsZERlZldpdGhPcmRpbmFsU2NhbGUpLCB7XG4gIHJlcXVpcmVkOiBbJ2ZpZWxkJywgJ3R5cGUnXSxcbiAgcHJvcGVydGllczoge1xuICAgIGF4aXM6IGF4aXNcbiAgfVxufSk7XG4iLCJleHBvcnQgaW50ZXJmYWNlIExlZ2VuZCB7XG4gIG9yaWVudD86IHN0cmluZztcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIGZvcm1hdD86IHN0cmluZztcbiAgdmFsdWVzPzogQXJyYXk8YW55PjtcbiAgcHJvcGVydGllcz86IGFueTsgLy8gVE9ETyBkZWNsYXJlIFZnTGVnZW5kUHJvcGVydGllc1xuXG4gIC8vIFZlZ2EtTGl0ZSBvbmx5XG4gIHNob3J0VGltZUxhYmVscz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCB2YXIgbGVnZW5kID0ge1xuICBkZWZhdWx0OiB0cnVlLFxuICBkZXNjcmlwdGlvbjogJ1Byb3BlcnRpZXMgb2YgYSBsZWdlbmQgb3IgYm9vbGVhbiBmbGFnIGZvciBkZXRlcm1pbmluZyB3aGV0aGVyIHRvIHNob3cgaXQuJyxcbiAgb25lT2Y6IFt7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgb3JpZW50OiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBsZWdlbmQuIE9uZSBvZiBcImxlZnRcIiBvciBcInJpZ2h0XCIuIFRoaXMgZGV0ZXJtaW5lcyBob3cgdGhlIGxlZ2VuZCBpcyBwb3NpdGlvbmVkIHdpdGhpbiB0aGUgc2NlbmUuIFRoZSBkZWZhdWx0IGlzIFwicmlnaHRcIi4nXG4gICAgICB9LFxuICAgICAgdGl0bGU6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIGZvciB0aGUgbGVnZW5kLiAoU2hvd3MgZmllbGQgbmFtZSBhbmQgaXRzIGZ1bmN0aW9uIGJ5IGRlZmF1bHQuKSdcbiAgICAgIH0sXG4gICAgICBmb3JtYXQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdBbiBvcHRpb25hbCBmb3JtYXR0aW5nIHBhdHRlcm4gZm9yIGxlZ2VuZCBsYWJlbHMuIFZlZ2EgdXNlcyBEM1xcJ3MgZm9ybWF0IHBhdHRlcm4uJ1xuICAgICAgfSxcbiAgICAgIHZhbHVlczoge1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnRXhwbGljaXRseSBzZXQgdGhlIHZpc2libGUgbGVnZW5kIHZhbHVlcy4nXG4gICAgICB9LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ09wdGlvbmFsIG1hcmsgcHJvcGVydHkgZGVmaW5pdGlvbnMgZm9yIGN1c3RvbSBsZWdlbmQgc3R5bGluZy4gJ1xuICAgICAgfSxcblxuICAgICAgLyogVmVnYS1saXRlIG9ubHkgKi9cbiAgICAgIHNob3J0VGltZUxhYmVsczoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgbW9udGggbmFtZXMgYW5kIHdlZWtkYXkgbmFtZXMgc2hvdWxkIGJlIGFiYnJldmlhdGVkLidcbiAgICAgIH1cbiAgICB9LFxuICB9LCB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gIH1dXG59O1xuIiwiZXhwb3J0IHZhciBtYXJrID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogWydwb2ludCcsICd0aWNrJywgJ2JhcicsICdsaW5lJywgJ2FyZWEnLCAnY2lyY2xlJywgJ3NxdWFyZScsICd0ZXh0J11cbn07XG4iLCJpbXBvcnQge3RvTWFwLCBkdXBsaWNhdGUgYXMgY2xvbmV9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHttZXJnZURlZXB9IGZyb20gJy4vc2NoZW1hdXRpbCc7XG5pbXBvcnQge1FVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNjYWxlIHtcbiAgdHlwZT86IHN0cmluZztcbiAgZG9tYWluPzogYW55OyAvLyBUT0RPOiBkZWNsYXJlIHZnRGF0YURvbWFpblxuICByYW5nZT86IGFueTsgLy8gVE9ETzogZGVjbGFyZSB2Z1JhbmdlRG9tYWluXG4gIHJvdW5kPzogYm9vbGVhbjtcblxuICAvLyBvcmRpbmFsXG4gIGJhbmRXaWR0aD86IG51bWJlcjtcbiAgb3V0ZXJQYWRkaW5nPzogbnVtYmVyO1xuICBwYWRkaW5nPzogbnVtYmVyO1xuXG4gIC8vIHR5cGljYWxcbiAgY2xhbXA/OiBib29sZWFuO1xuICBuaWNlPzogYm9vbGVhbnxzdHJpbmc7XG4gIGV4cG9uZW50PzogbnVtYmVyO1xuICB6ZXJvPzogYm9vbGVhbjtcblxuICAvLyBWZWdhLUxpdGUgb25seVxuICB1c2VSYXdEb21haW4/OiBib29sZWFuO1xufVxuXG52YXIgc2NhbGUgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICAvLyBUT0RPOiByZWZlciB0byBWZWdhJ3Mgc2NhbGUgc2NoZW1hXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvKiBDb21tb24gU2NhbGUgUHJvcGVydGllcyAqL1xuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydsaW5lYXInLCAnbG9nJywgJ3BvdycsICdzcXJ0JywgJ3F1YW50aWxlJywgJ29yZGluYWwnXSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUVVBTlRJVEFUSVZFXSlcbiAgICB9LFxuICAgIGRvbWFpbjoge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgdHlwZTogWydhcnJheScsICdvYmplY3QnXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGRvbWFpbiBvZiB0aGUgc2NhbGUsIHJlcHJlc2VudGluZyB0aGUgc2V0IG9mIGRhdGEgdmFsdWVzLiBGb3IgcXVhbnRpdGF0aXZlIGRhdGEsIHRoaXMgY2FuIHRha2UgdGhlIGZvcm0gb2YgYSB0d28tZWxlbWVudCBhcnJheSB3aXRoIG1pbmltdW0gYW5kIG1heGltdW0gdmFsdWVzLiBGb3Igb3JkaW5hbC9jYXRlZ29yaWNhbCBkYXRhLCB0aGlzIG1heSBiZSBhbiBhcnJheSBvZiB2YWxpZCBpbnB1dCB2YWx1ZXMuIFRoZSBkb21haW4gbWF5IGFsc28gYmUgc3BlY2lmaWVkIGJ5IGEgcmVmZXJlbmNlIHRvIGEgZGF0YSBzb3VyY2UuJ1xuICAgIH0sXG4gICAgcmFuZ2U6IHtcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIHR5cGU6IFsnYXJyYXknLCAnb2JqZWN0JywgJ3N0cmluZyddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgcmFuZ2Ugb2YgdGhlIHNjYWxlLCByZXByZXNlbnRpbmcgdGhlIHNldCBvZiB2aXN1YWwgdmFsdWVzLiBGb3IgbnVtZXJpYyB2YWx1ZXMsIHRoZSByYW5nZSBjYW4gdGFrZSB0aGUgZm9ybSBvZiBhIHR3by1lbGVtZW50IGFycmF5IHdpdGggbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMuIEZvciBvcmRpbmFsIG9yIHF1YW50aXplZCBkYXRhLCB0aGUgcmFuZ2UgbWF5IGJ5IGFuIGFycmF5IG9mIGRlc2lyZWQgb3V0cHV0IHZhbHVlcywgd2hpY2ggYXJlIG1hcHBlZCB0byBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIGRvbWFpbi4gRm9yIG9yZGluYWwgc2NhbGVzIG9ubHksIHRoZSByYW5nZSBjYW4gYmUgZGVmaW5lZCB1c2luZyBhIERhdGFSZWY6IHRoZSByYW5nZSB2YWx1ZXMgYXJlIHRoZW4gZHJhd24gZHluYW1pY2FsbHkgZnJvbSBhIGJhY2tpbmcgZGF0YSBzZXQuJ1xuICAgIH0sXG4gICAgcm91bmQ6IHtcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgLy8gVE9ETzogcmV2aXNlIGRlZmF1bHRcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgdHJ1ZSwgcm91bmRzIG51bWVyaWMgb3V0cHV0IHZhbHVlcyB0byBpbnRlZ2Vycy4gVGhpcyBjYW4gYmUgaGVscGZ1bCBmb3Igc25hcHBpbmcgdG8gdGhlIHBpeGVsIGdyaWQuJ1xuICAgIH1cbiAgfVxufTtcblxuXG52YXIgb3JkaW5hbFNjYWxlTWl4aW4gPSB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBiYW5kV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIC8qIE9yZGluYWwgU2NhbGUgUHJvcGVydGllcyAqL1xuICAgIG91dGVyUGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICAgIC8vIFRPRE86IGFkZCBkZXNjcmlwdGlvbiBvbmNlIGl0IGlzIGRvY3VtZW50ZWQgaW4gVmVnYVxuICAgIH0sXG4gICAgcGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FwcGxpZXMgc3BhY2luZyBhbW9uZyBvcmRpbmFsIGVsZW1lbnRzIGluIHRoZSBzY2FsZSByYW5nZS4gVGhlIGFjdHVhbCBlZmZlY3QgZGVwZW5kcyBvbiBob3cgdGhlIHNjYWxlIGlzIGNvbmZpZ3VyZWQuIElmIHRoZSBfX3BvaW50c19fIHBhcmFtZXRlciBpcyBgdHJ1ZWAsIHRoZSBwYWRkaW5nIHZhbHVlIGlzIGludGVycHJldGVkIGFzIGEgbXVsdGlwbGUgb2YgdGhlIHNwYWNpbmcgYmV0d2VlbiBwb2ludHMuIEEgcmVhc29uYWJsZSB2YWx1ZSBpcyAxLjAsIHN1Y2ggdGhhdCB0aGUgZmlyc3QgYW5kIGxhc3QgcG9pbnQgd2lsbCBiZSBvZmZzZXQgZnJvbSB0aGUgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZSBieSBoYWxmIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHBvaW50cy4gT3RoZXJ3aXNlLCBwYWRkaW5nIGlzIHR5cGljYWxseSBpbiB0aGUgcmFuZ2UgWzAsIDFdIGFuZCBjb3JyZXNwb25kcyB0byB0aGUgZnJhY3Rpb24gb2Ygc3BhY2UgaW4gdGhlIHJhbmdlIGludGVydmFsIHRvIGFsbG9jYXRlIHRvIHBhZGRpbmcuIEEgdmFsdWUgb2YgMC41IG1lYW5zIHRoYXQgdGhlIHJhbmdlIGJhbmQgd2lkdGggd2lsbCBiZSBlcXVhbCB0byB0aGUgcGFkZGluZyB3aWR0aC4gRm9yIG1vcmUsIHNlZSB0aGUgW0QzIG9yZGluYWwgc2NhbGUgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9naXRodWIuY29tL21ib3N0b2NrL2QzL3dpa2kvT3JkaW5hbC1TY2FsZXMpLidcbiAgICB9XG4gIH1cbn07XG5cbnZhciB0eXBpY2FsU2NhbGVNaXhpbiA9IHtcbiAgcHJvcGVydGllczoge1xuICAgIC8qIFF1YW50aXRhdGl2ZSBhbmQgdGVtcG9yYWwgU2NhbGUgUHJvcGVydGllcyAqL1xuICAgIGNsYW1wOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgZGVzY3JpcHRpb246ICdJZiB0cnVlLCB2YWx1ZXMgdGhhdCBleGNlZWQgdGhlIGRhdGEgZG9tYWluIGFyZSBjbGFtcGVkIHRvIGVpdGhlciB0aGUgbWluaW11bSBvciBtYXhpbXVtIHJhbmdlIHZhbHVlJ1xuICAgIH0sXG4gICAgbmljZToge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgb25lT2Y6IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIHRydWUsIG1vZGlmaWVzIHRoZSBzY2FsZSBkb21haW4gdG8gdXNlIGEgbW9yZSBodW1hbi1mcmllbmRseSBudW1iZXIgcmFuZ2UgKGUuZy4sIDcgaW5zdGVhZCBvZiA2Ljk2KS4nXG4gICAgICAgIH0se1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IFsnc2Vjb25kJywgJ21pbnV0ZScsICdob3VyJywgJ2RheScsICd3ZWVrJywgJ21vbnRoJywgJ3llYXInXSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIHNwZWNpZmllZCwgbW9kaWZpZXMgdGhlIHNjYWxlIGRvbWFpbiB0byB1c2UgYSBtb3JlIGh1bWFuLWZyaWVuZGx5IHZhbHVlIHJhbmdlLiBGb3IgdGltZSBhbmQgdXRjIHNjYWxlIHR5cGVzIG9ubHksIHRoZSBuaWNlIHZhbHVlIHNob3VsZCBiZSBhIHN0cmluZyBpbmRpY2F0aW5nIHRoZSBkZXNpcmVkIHRpbWUgaW50ZXJ2YWw7IGxlZ2FsIHZhbHVlcyBhcmUgXCJzZWNvbmRcIiwgXCJtaW51dGVcIiwgXCJob3VyXCIsIFwiZGF5XCIsIFwid2Vla1wiLCBcIm1vbnRoXCIsIG9yIFwieWVhclwiLidcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIC8vIEZJWE1FIHRoaXMgcGFydCBtaWdodCBicmVhayBwb2xlc3RhclxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRVUFOVElUQVRJVkUsIFRFTVBPUkFMXSksXG4gICAgICBkZXNjcmlwdGlvbjogJydcbiAgICB9LFxuXG4gICAgLyogUXVhbnRpdGF0aXZlIFNjYWxlIFByb3BlcnRpZXMgKi9cbiAgICBleHBvbmVudDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NldHMgdGhlIGV4cG9uZW50IG9mIHRoZSBzY2FsZSB0cmFuc2Zvcm1hdGlvbi4gRm9yIHBvdyBzY2FsZSB0eXBlcyBvbmx5LCBvdGhlcndpc2UgaWdub3JlZC4nXG4gICAgfSxcbiAgICB6ZXJvOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHRydWUsIGVuc3VyZXMgdGhhdCBhIHplcm8gYmFzZWxpbmUgdmFsdWUgaXMgaW5jbHVkZWQgaW4gdGhlIHNjYWxlIGRvbWFpbi4gVGhpcyBvcHRpb24gaXMgaWdub3JlZCBmb3Igbm9uLXF1YW50aXRhdGl2ZSBzY2FsZXMuJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUVVBTlRJVEFUSVZFLCBURU1QT1JBTF0pXG4gICAgfSxcblxuICAgIC8qIFZlZ2EtbGl0ZSBvbmx5IFByb3BlcnRpZXMgKi9cbiAgICB1c2VSYXdEb21haW46IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdVc2VzIHRoZSBzb3VyY2UgZGF0YSByYW5nZSBhcyBzY2FsZSBkb21haW4gaW5zdGVhZCBvZiAnICtcbiAgICAgICAgICAgICAgICAgICAnYWdncmVnYXRlZCBkYXRhIGZvciBhZ2dyZWdhdGUgYXhpcy4gJyArXG4gICAgICAgICAgICAgICAgICAgJ1RoaXMgb3B0aW9uIGRvZXMgbm90IHdvcmsgd2l0aCBzdW0gb3IgY291bnQgYWdncmVnYXRlJyArXG4gICAgICAgICAgICAgICAgICAgJ2FzIHRoZXkgbWlnaHQgaGF2ZSBhIHN1YnN0YW50aWFsbHkgbGFyZ2VyIHNjYWxlIHJhbmdlLidcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgb3JkaW5hbE9ubHlTY2FsZSA9IG1lcmdlRGVlcChjbG9uZShzY2FsZSksIG9yZGluYWxTY2FsZU1peGluKTtcbmV4cG9ydCB2YXIgdHlwaWNhbFNjYWxlID0gbWVyZ2VEZWVwKGNsb25lKHNjYWxlKSwgb3JkaW5hbFNjYWxlTWl4aW4sIHR5cGljYWxTY2FsZU1peGluKTtcbiIsIi8vIFBhY2thZ2Ugb2YgZGVmaW5pbmcgVmVnYS1saXRlIFNwZWNpZmljYXRpb24ncyBqc29uIHNjaGVtYVxuXG5pbXBvcnQgKiBhcyBzY2hlbWFVdGlsIGZyb20gJy4vc2NoZW1hdXRpbCc7XG5pbXBvcnQge21hcmt9IGZyb20gJy4vbWFyay5zY2hlbWEnO1xuaW1wb3J0IHtjb25maWcsIENvbmZpZ30gZnJvbSAnLi9jb25maWcuc2NoZW1hJztcbmltcG9ydCB7ZGF0YSwgRGF0YX0gZnJvbSAnLi9kYXRhLnNjaGVtYSc7XG5pbXBvcnQge2VuY29kaW5nLCBFbmNvZGluZ30gZnJvbSAnLi9lbmNvZGluZy5zY2hlbWEnO1xuaW1wb3J0IHtNYXJrfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7dHJhbnNmb3JtLCBUcmFuc2Zvcm19IGZyb20gJy4vdHJhbnNmb3JtLnNjaGVtYSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3BlYyB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBkYXRhPzogRGF0YTtcbiAgdHJhbnNmb3JtPzogVHJhbnNmb3JtO1xuICBtYXJrPzogTWFyaztcbiAgZW5jb2Rpbmc/OiBFbmNvZGluZztcbiAgY29uZmlnPzogQ29uZmlnO1xufVxuXG4vLyBUT0RPIHJlbW92ZSB0aGlzXG5leHBvcnQge2FnZ3JlZ2F0ZX0gZnJvbSAnLi9maWVsZGRlZi5zY2hlbWEnO1xuXG5leHBvcnQgdmFyIHV0aWwgPSBzY2hlbWFVdGlsO1xuXG4vKiogQHR5cGUgT2JqZWN0IFNjaGVtYSBvZiBhIHZlZ2EtbGl0ZSBzcGVjaWZpY2F0aW9uICovXG5leHBvcnQgdmFyIHNjaGVtYSA9IHtcbiAgJHNjaGVtYTogJ2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hIycsXG4gIGRlc2NyaXB0aW9uOiAnU2NoZW1hIGZvciBWZWdhLUxpdGUgc3BlY2lmaWNhdGlvbicsXG4gIHR5cGU6ICdvYmplY3QnLFxuICByZXF1aXJlZDogWydtYXJrJywgJ2VuY29kaW5nJ10sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBuYW1lIGZvciB0aGUgc3BlY2lmaWNhdGlvbi4gVGhlIG5hbWUgaXMgdXNlZCB0byBhbm5vdGF0ZSBtYXJrcywgc2NhbGUgbmFtZXMsIGFuZCBtb3JlLidcbiAgICB9LFxuICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIH0sXG4gICAgZGF0YTogZGF0YSxcbiAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybSxcbiAgICBtYXJrOiBtYXJrLFxuICAgIGVuY29kaW5nOiBlbmNvZGluZyxcbiAgICBjb25maWc6IGNvbmZpZ1xuICB9XG59O1xuXG4vKiogSW5zdGFudGlhdGUgYSB2ZXJib3NlIHZsIHNwZWMgZnJvbSB0aGUgc2NoZW1hICovXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFudGlhdGUoKSB7XG4gIHJldHVybiBzY2hlbWFVdGlsLmluc3RhbnRpYXRlKHNjaGVtYSk7XG59O1xuIiwiaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcblxuZnVuY3Rpb24gaXNFbXB0eShvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChpbnN0YW5jZSwgc2NoZW1hKSB7XG4gIHJldHVybiBtZXJnZURlZXAoaW5zdGFudGlhdGUoc2NoZW1hKSwgaW5zdGFuY2UpO1xufTtcblxuLy8gaW5zdGFudGlhdGUgYSBzY2hlbWFcbmV4cG9ydCBmdW5jdGlvbiBpbnN0YW50aWF0ZShzY2hlbWEpIHtcbiAgdmFyIHZhbDtcbiAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICgnZGVmYXVsdCcgaW4gc2NoZW1hKSB7XG4gICAgdmFsID0gc2NoZW1hLmRlZmF1bHQ7XG4gICAgcmV0dXJuIHV0aWwuaXNPYmplY3QodmFsKSA/IHV0aWwuZHVwbGljYXRlKHZhbCkgOiB2YWw7XG4gIH0gZWxzZSBpZiAoc2NoZW1hLnR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIGluc3RhbmNlID0ge307XG4gICAgZm9yICh2YXIgbmFtZSBpbiBzY2hlbWEucHJvcGVydGllcykge1xuICAgICAgaWYgKHNjaGVtYS5wcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIHZhbCA9IGluc3RhbnRpYXRlKHNjaGVtYS5wcm9wZXJ0aWVzW25hbWVdKTtcbiAgICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaW5zdGFuY2VbbmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2UgaWYgKHNjaGVtYS50eXBlID09PSAnYXJyYXknKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuLy8gcmVtb3ZlIGFsbCBkZWZhdWx0cyBmcm9tIGFuIGluc3RhbmNlXG5leHBvcnQgZnVuY3Rpb24gc3VidHJhY3QoaW5zdGFuY2UsIGRlZmF1bHRzKSB7XG4gIHZhciBjaGFuZ2VzOiBhbnkgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBpbnN0YW5jZSkge1xuICAgIGlmIChpbnN0YW5jZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgdmFyIGRlZiA9IGRlZmF1bHRzW3Byb3BdO1xuICAgICAgdmFyIGlucyA9IGluc3RhbmNlW3Byb3BdO1xuICAgICAgLy8gTm90ZTogZG9lcyBub3QgcHJvcGVybHkgc3VidHJhY3QgYXJyYXlzXG4gICAgICBpZiAoIWRlZmF1bHRzIHx8IGRlZiAhPT0gaW5zKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5zID09PSAnb2JqZWN0JyAmJiAhdXRpbC5pc0FycmF5KGlucykgJiYgZGVmKSB7XG4gICAgICAgICAgdmFyIGMgPSBzdWJ0cmFjdChpbnMsIGRlZik7XG4gICAgICAgICAgaWYgKCFpc0VtcHR5KGMpKSB7XG4gICAgICAgICAgICBjaGFuZ2VzW3Byb3BdID0gYztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbC5pc0FycmF5KGlucykpIHtcbiAgICAgICAgICBpZiAodXRpbC5pc0FycmF5KGRlZikpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXlcbiAgICAgICAgICAgIGlmIChpbnMubGVuZ3RoID09PSBkZWYubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHZhciBlcXVhbCA9IHRydWU7XG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluc1tpXSAhPT0gZGVmW2ldKSB7XG4gICAgICAgICAgICAgICAgICBlcXVhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChlcXVhbCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBjb250aW51ZSB3aXRoIG5leHQgcHJvcGVydHlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjaGFuZ2VzW3Byb3BdID0gaW5zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBpbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoYW5nZXM7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEZWVwKGRlc3QsIC4uLnNyYzogYW55W10pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcmMubGVuZ3RoOyBpKyspIHtcbiAgICBkZXN0ID0gZGVlcE1lcmdlXyhkZXN0LCBzcmNbaV0pO1xuICB9XG4gIHJldHVybiBkZXN0O1xufTtcblxuLy8gcmVjdXJzaXZlbHkgbWVyZ2VzIHNyYyBpbnRvIGRlc3RcbmZ1bmN0aW9uIGRlZXBNZXJnZV8oZGVzdCwgc3JjKSB7XG4gIGlmICh0eXBlb2Ygc3JjICE9PSAnb2JqZWN0JyB8fCBzcmMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZGVzdDtcbiAgfVxuXG4gIGZvciAodmFyIHAgaW4gc3JjKSB7XG4gICAgaWYgKCFzcmMuaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoc3JjW3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNyY1twXSAhPT0gJ29iamVjdCcgfHwgc3JjW3BdID09PSBudWxsKSB7XG4gICAgICBkZXN0W3BdID0gc3JjW3BdO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlc3RbcF0gIT09ICdvYmplY3QnIHx8IGRlc3RbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBtZXJnZURlZXAoc3JjW3BdLmNvbnN0cnVjdG9yID09PSBBcnJheSA/IFtdIDoge30sIHNyY1twXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lcmdlRGVlcChkZXN0W3BdLCBzcmNbcF0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzdDtcbn1cbiIsImltcG9ydCB7QUdHUkVHQVRFX09QU30gZnJvbSAnLi4vYWdncmVnYXRlJztcbmltcG9ydCB7T1JESU5BTCwgUVVBTlRJVEFUSVZFfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7dG9NYXB9IGZyb20gJy4uL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNvcnQge1xuICBmaWVsZDogc3RyaW5nO1xuICBvcDogc3RyaW5nO1xuICBvcmRlcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IHNvcnRFbnVtID0ge1xuICBkZWZhdWx0OiAnYXNjZW5kaW5nJyxcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IFsnYXNjZW5kaW5nJywgJ2Rlc2NlbmRpbmcnLCAndW5zb3J0ZWQnXVxufTtcblxuZXhwb3J0IHZhciBzb3J0ID0ge1xuICBkZWZhdWx0OiAnYXNjZW5kaW5nJyxcbiAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRVUFOVElUQVRJVkUsIE9SRElOQUxdKSxcbiAgb25lT2Y6IFtcbiAgICBzb3J0RW51bSxcbiAgICB7IC8vIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYW5vdGhlciBmaWVsZFxuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICByZXF1aXJlZDogWydmaWVsZCcsICdvcCddLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBmaWVsZDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZpZWxkIG5hbWUgdG8gYWdncmVnYXRlIG92ZXIuJ1xuICAgICAgICB9LFxuICAgICAgICBvcDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IEFHR1JFR0FURV9PUFMsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgZmllbGQgbmFtZSB0byBhZ2dyZWdhdGUgb3Zlci4nXG4gICAgICAgIH0sXG4gICAgICAgIG9yZGVyOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydhc2NlbmRpbmcnLCAnZGVzY2VuZGluZyddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIF1cbn07XG4iLCJleHBvcnQgaW50ZXJmYWNlIFRyYW5zZm9ybSB7XG4gIGZpbHRlcj86IHN0cmluZztcbiAgZmlsdGVyTnVsbD86IGJvb2xlYW47XG4gIGNhbGN1bGF0ZT86IFZnRm9ybXVsYVtdO1xufVxuXG4vLyBUT0RPIG1vdmUgYWxsIFZlZ2EgaW50ZXJmYWNlcyB0byBvbmUgY2VudHJhbCBwb3NpdGlvblxuZXhwb3J0IGludGVyZmFjZSBWZ0Zvcm11bGEge1xuICBmaWVsZDogc3RyaW5nO1xuICBleHByOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm0gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZmlsdGVyTnVsbDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdGaWx0ZXIgbnVsbCB2YWx1ZXMgZnJvbSB0aGUgZGF0YS4gSWYgc2V0IHRvIHRydWUsIGFsbCByb3dzIHdpdGggbnVsbCB2YWx1ZXMgYXJlIGZpbHRlcmVkLiBJZiBmYWxzZSwgbm8gcm93cyBhcmUgZmlsdGVyZWQuIFNldCB0aGUgcHJvcGVydHkgdG8gdW5kZWZpbmVkIHRvIGZpbHRlciBvbmx5IHF1YW50aXRhdGl2ZSBhbmQgdGVtcG9yYWwgZmllbGRzLidcbiAgICB9LFxuICAgIGZpbHRlcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Egc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGZpbHRlciBWZWdhIGV4cHJlc3Npb24uIFVzZSBgZGF0dW1gIHRvIHJlZmVyIHRvIHRoZSBjdXJyZW50IGRhdGEgb2JqZWN0LidcbiAgICB9LFxuICAgIGNhbGN1bGF0ZToge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2FsY3VsYXRlIG5ldyBmaWVsZChzKSB1c2luZyB0aGUgcHJvdmlkZWQgZXhwcmVzc3Npb24ocykuIENhbGN1bGF0aW9uIGFyZSBhcHBsaWVkIGJlZm9yZSBmaWx0ZXIuJyxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZmllbGQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgZmllbGQgaW4gd2hpY2ggdG8gc3RvcmUgdGhlIGNvbXB1dGVkIGZvcm11bGEgdmFsdWUuJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhwcjoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Egc3RyaW5nIGNvbnRhaW5pbmcgYW4gZXhwcmVzc2lvbiBmb3IgdGhlIGZvcm11bGEuIFVzZSB0aGUgdmFyaWFibGUgYGRhdHVtYCB0byB0byByZWZlciB0byB0aGUgY3VycmVudCBkYXRhIG9iamVjdC4nXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiLyoqIG1vZHVsZSBmb3Igc2hvcnRoYW5kICovXG5cbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4vc2NoZW1hL2VuY29kaW5nLnNjaGVtYSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtTcGVjfSBmcm9tICcuL3NjaGVtYS9zY2hlbWEnO1xuXG5pbXBvcnQge0FHR1JFR0FURV9PUFN9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7VElNRVVOSVRTfSBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCB7U0hPUlRfVFlQRSwgVFlQRV9GUk9NX1NIT1JUX1RZUEV9IGZyb20gJy4vdHlwZSc7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4vZW5jb2RpbmcnO1xuaW1wb3J0IHtNYXJrfSBmcm9tICcuL21hcmsnO1xuXG5leHBvcnQgY29uc3QgREVMSU0gPSAnfCc7XG5leHBvcnQgY29uc3QgQVNTSUdOID0gJz0nO1xuZXhwb3J0IGNvbnN0IFRZUEUgPSAnLCc7XG5leHBvcnQgY29uc3QgRlVOQyA9ICdfJztcblxuXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRlbihzcGVjOiBTcGVjKTogc3RyaW5nIHtcbiAgcmV0dXJuICdtYXJrJyArIEFTU0lHTiArIHNwZWMubWFyayArXG4gICAgREVMSU0gKyBzaG9ydGVuRW5jb2Rpbmcoc3BlYy5lbmNvZGluZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShzaG9ydGhhbmQ6IHN0cmluZywgZGF0YT8sIGNvbmZpZz8pIHtcbiAgbGV0IHNwbGl0ID0gc2hvcnRoYW5kLnNwbGl0KERFTElNKSxcbiAgICBtYXJrID0gc3BsaXQuc2hpZnQoKS5zcGxpdChBU1NJR04pWzFdLnRyaW0oKSxcbiAgICBlbmNvZGluZyA9IHBhcnNlRW5jb2Rpbmcoc3BsaXQuam9pbihERUxJTSkpO1xuXG4gIGxldCBzcGVjOlNwZWMgPSB7XG4gICAgbWFyazogTWFya1ttYXJrXSxcbiAgICBlbmNvZGluZzogZW5jb2RpbmdcbiAgfTtcblxuICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3BlYy5kYXRhID0gZGF0YTtcbiAgfVxuICBpZiAoY29uZmlnICE9PSB1bmRlZmluZWQpIHtcbiAgICBzcGVjLmNvbmZpZyA9IGNvbmZpZztcbiAgfVxuICByZXR1cm4gc3BlYztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3J0ZW5FbmNvZGluZyhlbmNvZGluZzogRW5jb2RpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmxFbmNvZGluZy5tYXAoZW5jb2RpbmcsIGZ1bmN0aW9uKGZpZWxkRGVmLCBjaGFubmVsKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwgKyBBU1NJR04gKyBzaG9ydGVuRmllbGREZWYoZmllbGREZWYpO1xuICB9KS5qb2luKERFTElNKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRW5jb2RpbmcoZW5jb2RpbmdTaG9ydGhhbmQ6IHN0cmluZyk6IEVuY29kaW5nIHtcbiAgcmV0dXJuIGVuY29kaW5nU2hvcnRoYW5kLnNwbGl0KERFTElNKS5yZWR1Y2UoZnVuY3Rpb24obSwgZSkge1xuICAgIHZhciBzcGxpdCA9IGUuc3BsaXQoQVNTSUdOKSxcbiAgICAgICAgZW5jdHlwZSA9IHNwbGl0WzBdLnRyaW0oKSxcbiAgICAgICAgZmllbGREZWZTaG9ydGhhbmQgPSBzcGxpdFsxXTtcblxuICAgIG1bZW5jdHlwZV0gPSBwYXJzZUZpZWxkRGVmKGZpZWxkRGVmU2hvcnRoYW5kKTtcbiAgICByZXR1cm4gbTtcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRlbkZpZWxkRGVmKGZpZWxkRGVmOiBGaWVsZERlZik6IHN0cmluZyB7XG4gIHJldHVybiAoZmllbGREZWYuYWdncmVnYXRlID8gZmllbGREZWYuYWdncmVnYXRlICsgRlVOQyA6ICcnKSArXG4gICAgKGZpZWxkRGVmLnRpbWVVbml0ID8gZmllbGREZWYudGltZVVuaXQgKyBGVU5DIDogJycpICtcbiAgICAoZmllbGREZWYuYmluID8gJ2JpbicgKyBGVU5DIDogJycpICtcbiAgICAoZmllbGREZWYuZmllbGQgfHwgJycpICsgVFlQRSArIFNIT1JUX1RZUEVbZmllbGREZWYudHlwZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG9ydGVuRmllbGREZWZzKGZpZWxkRGVmczogRmllbGREZWZbXSwgZGVsaW0gPSBERUxJTSk6IHN0cmluZyB7XG4gIHJldHVybiBmaWVsZERlZnMubWFwKHNob3J0ZW5GaWVsZERlZikuam9pbihkZWxpbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpZWxkRGVmKGZpZWxkRGVmU2hvcnRoYW5kOiBzdHJpbmcpOiBGaWVsZERlZiB7XG4gIHZhciBzcGxpdCA9IGZpZWxkRGVmU2hvcnRoYW5kLnNwbGl0KFRZUEUpO1xuXG4gIHZhciBmaWVsZERlZjogRmllbGREZWYgPSB7XG4gICAgZmllbGQ6IHNwbGl0WzBdLnRyaW0oKSxcbiAgICB0eXBlOiBUWVBFX0ZST01fU0hPUlRfVFlQRVtzcGxpdFsxXS50cmltKCldXG4gIH07XG5cbiAgLy8gY2hlY2sgYWdncmVnYXRlIHR5cGVcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBBR0dSRUdBVEVfT1BTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGEgPSBBR0dSRUdBVEVfT1BTW2ldO1xuICAgIGlmIChmaWVsZERlZi5maWVsZC5pbmRleE9mKGEgKyAnXycpID09PSAwKSB7XG4gICAgICBmaWVsZERlZi5maWVsZCA9IGZpZWxkRGVmLmZpZWxkLnN1YnN0cihhLmxlbmd0aCArIDEpO1xuICAgICAgaWYgKGEgPT09ICdjb3VudCcgJiYgZmllbGREZWYuZmllbGQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZpZWxkRGVmLmZpZWxkID0gJyonO1xuICAgICAgfVxuICAgICAgZmllbGREZWYuYWdncmVnYXRlID0gYTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgVElNRVVOSVRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHR1ID0gVElNRVVOSVRTW2ldO1xuICAgIGlmIChmaWVsZERlZi5maWVsZCAmJiBmaWVsZERlZi5maWVsZC5pbmRleE9mKHR1ICsgJ18nKSA9PT0gMCkge1xuICAgICAgZmllbGREZWYuZmllbGQgPSBmaWVsZERlZi5maWVsZC5zdWJzdHIoZmllbGREZWYuZmllbGQubGVuZ3RoICsgMSk7XG4gICAgICBmaWVsZERlZi50aW1lVW5pdCA9IHR1O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gY2hlY2sgYmluXG4gIGlmIChmaWVsZERlZi5maWVsZCAmJiBmaWVsZERlZi5maWVsZC5pbmRleE9mKCdiaW5fJykgPT09IDApIHtcbiAgICBmaWVsZERlZi5maWVsZCA9IGZpZWxkRGVmLmZpZWxkLnN1YnN0cig0KTtcbiAgICBmaWVsZERlZi5iaW4gPSB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkRGVmO1xufVxuIiwiLyogVXRpbGl0aWVzIGZvciBhIFZlZ2EtTGl0ZSBzcGVjaWZpY2lhdGlvbiAqL1xuXG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtTcGVjfSBmcm9tICcuL3NjaGVtYS9zY2hlbWEnO1xuXG5pbXBvcnQge01vZGVsfSBmcm9tICcuL2NvbXBpbGUvTW9kZWwnO1xuaW1wb3J0IHtDT0xPUiwgU0hBUEV9IGZyb20gJy4vY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyB2bEVuY29kaW5nIGZyb20gJy4vZW5jb2RpbmcnO1xuaW1wb3J0IHtCQVIsIEFSRUF9IGZyb20gJy4vbWFyayc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi91dGlsJztcblxuLy8gVE9ETzogYWRkIHZsLnNwZWMudmFsaWRhdGUgJiBtb3ZlIHN0dWZmIGZyb20gdmwudmFsaWRhdGUgdG8gaGVyZVxuXG5leHBvcnQgZnVuY3Rpb24gYWx3YXlzTm9PY2NsdXNpb24oc3BlYzogU3BlYyk6IGJvb2xlYW4ge1xuICAvLyBGSVhNRSByYXcgT3hRIHdpdGggIyBvZiByb3dzID0gIyBvZiBPXG4gIHJldHVybiB2bEVuY29kaW5nLmlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmllbGREZWZzKHNwZWM6IFNwZWMpOiBGaWVsZERlZltdIHtcbiAgLy8gVE9ETzogcmVmYWN0b3IgdGhpcyBvbmNlIHdlIGhhdmUgY29tcG9zaXRpb25cbiAgcmV0dXJuIHZsRW5jb2RpbmcuZmllbGREZWZzKHNwZWMuZW5jb2RpbmcpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsZWFuU3BlYyhzcGVjOiBTcGVjKTogU3BlYyB7XG4gIC8vIFRPRE86IG1vdmUgdG9TcGVjIHRvIGhlcmUhXG4gIHJldHVybiBuZXcgTW9kZWwoc3BlYykudG9TcGVjKHRydWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdGFjayhzcGVjOiBTcGVjKTogYm9vbGVhbiB7XG4gIHJldHVybiAodmxFbmNvZGluZy5oYXMoc3BlYy5lbmNvZGluZywgQ09MT1IpIHx8IHZsRW5jb2RpbmcuaGFzKHNwZWMuZW5jb2RpbmcsIFNIQVBFKSkgJiZcbiAgICAoc3BlYy5tYXJrID09PSBCQVIgfHwgc3BlYy5tYXJrID09PSBBUkVBKSAmJlxuICAgICghc3BlYy5jb25maWcgfHwgIXNwZWMuY29uZmlnLm1hcmsuc3RhY2tlZCAhPT0gZmFsc2UpICYmXG4gICAgdmxFbmNvZGluZy5pc0FnZ3JlZ2F0ZShzcGVjLmVuY29kaW5nKTtcbn1cblxuLy8gVE9ETyByZXZpc2VcbmV4cG9ydCBmdW5jdGlvbiB0cmFuc3Bvc2Uoc3BlYzogU3BlYyk6IFNwZWMge1xuICB2YXIgb2xkZW5jID0gc3BlYy5lbmNvZGluZyxcbiAgICBlbmNvZGluZyA9IGR1cGxpY2F0ZShzcGVjLmVuY29kaW5nKTtcbiAgZW5jb2RpbmcueCA9IG9sZGVuYy55O1xuICBlbmNvZGluZy55ID0gb2xkZW5jLng7XG4gIGVuY29kaW5nLnJvdyA9IG9sZGVuYy5jb2x1bW47XG4gIGVuY29kaW5nLmNvbHVtbiA9IG9sZGVuYy5yb3c7XG4gIHNwZWMuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgcmV0dXJuIHNwZWM7XG59XG4iLCJleHBvcnQgY29uc3QgVElNRVVOSVRTID0gW1xuICAneWVhcicsICdtb250aCcsICdkYXknLCAnZGF0ZScsICdob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnLCAnbWlsbGlzZWNvbmRzJyxcbiAgJ3llYXJtb250aCcsICd5ZWFybW9udGhkYXknLCAneWVhcm1vbnRoZGF0ZScsICd5ZWFyZGF5JywgJ3llYXJkYXRlJyxcbiAgJ3llYXJtb250aGRheWhvdXJzJywgJ3llYXJtb250aGRheWhvdXJzbWludXRlcycsICdob3Vyc21pbnV0ZXMnLFxuICAnaG91cnNtaW51dGVzc2Vjb25kcycsICdtaW51dGVzc2Vjb25kcycsICdzZWNvbmRzbWlsbGlzZWNvbmRzJ1xuXTtcbiIsIi8qKiBDb25zdGFudHMgYW5kIHV0aWxpdGllcyBmb3IgZGF0YSB0eXBlICovXG5cbmV4cG9ydCBlbnVtIFR5cGUge1xuICBRVUFOVElUQVRJVkUgPSAncXVhbnRpdGF0aXZlJyBhcyBhbnksXG4gIE9SRElOQUwgPSAnb3JkaW5hbCcgYXMgYW55LFxuICBURU1QT1JBTCA9ICd0ZW1wb3JhbCcgYXMgYW55LFxuICBOT01JTkFMID0gJ25vbWluYWwnIGFzIGFueVxufVxuXG5leHBvcnQgY29uc3QgUVVBTlRJVEFUSVZFID0gVHlwZS5RVUFOVElUQVRJVkU7XG5leHBvcnQgY29uc3QgT1JESU5BTCA9IFR5cGUuT1JESU5BTDtcbmV4cG9ydCBjb25zdCBURU1QT1JBTCA9IFR5cGUuVEVNUE9SQUw7XG5leHBvcnQgY29uc3QgTk9NSU5BTCA9IFR5cGUuTk9NSU5BTDtcblxuLyoqXG4gKiBNYXBwaW5nIGZyb20gZnVsbCB0eXBlIG5hbWVzIHRvIHNob3J0IHR5cGUgbmFtZXMuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgU0hPUlRfVFlQRSA9IHtcbiAgcXVhbnRpdGF0aXZlOiAnUScsXG4gIHRlbXBvcmFsOiAnVCcsXG4gIG5vbWluYWw6ICdOJyxcbiAgb3JkaW5hbDogJ08nXG59O1xuLyoqXG4gKiBNYXBwaW5nIGZyb20gc2hvcnQgdHlwZSBuYW1lcyB0byBmdWxsIHR5cGUgbmFtZXMuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgVFlQRV9GUk9NX1NIT1JUX1RZUEUgPSB7XG4gIFE6IFFVQU5USVRBVElWRSxcbiAgVDogVEVNUE9SQUwsXG4gIE86IE9SRElOQUwsXG4gIE46IE5PTUlOQUxcbn07XG5cbi8qKlxuICogR2V0IGZ1bGwsIGxvd2VyY2FzZSB0eXBlIG5hbWUgZm9yIGEgZ2l2ZW4gdHlwZS5cbiAqIEBwYXJhbSAgdHlwZVxuICogQHJldHVybiBGdWxsIHR5cGUgbmFtZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bGxOYW1lKHR5cGU6IFR5cGUpOiBUeXBlIHtcbiAgY29uc3QgdHlwZVN0cmluZyA9IDxhbnk+dHlwZTsgIC8vIGZvcmNlIHR5cGUgYXMgc3RyaW5nIHNvIHdlIGNhbiB0cmFuc2xhdGUgc2hvcnQgdHlwZXNcbiAgcmV0dXJuIFRZUEVfRlJPTV9TSE9SVF9UWVBFW3R5cGVTdHJpbmcudG9VcHBlckNhc2UoKV0gfHwgLy8gc2hvcnQgdHlwZSBpcyB1cHBlcmNhc2UgYnkgZGVmYXVsdFxuICAgICAgICAgdHlwZVN0cmluZy50b0xvd2VyQ2FzZSgpO1xufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvZGF0YWxpYi5kLnRzXCIvPlxuXG5leHBvcnQge2tleXMsIGV4dGVuZCwgZHVwbGljYXRlLCBpc0FycmF5LCB2YWxzLCB0cnVuY2F0ZSwgdG9NYXAsIGlzT2JqZWN0fSBmcm9tICdkYXRhbGliL3NyYy91dGlsJztcbmV4cG9ydCB7cmFuZ2V9IGZyb20gJ2RhdGFsaWIvc3JjL2dlbmVyYXRlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5zPFQ+KGFycmF5OiBBcnJheTxUPiwgaXRlbTogVCkge1xuICByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtKSA+IC0xO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yRWFjaChvYmosIGY6IChhLCBkLCBrLCBvKSA9PiBhbnksIHRoaXNBcmcpIHtcbiAgaWYgKG9iai5mb3JFYWNoKSB7XG4gICAgb2JqLmZvckVhY2guY2FsbCh0aGlzQXJnLCBmKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICBmLmNhbGwodGhpc0FyZywgb2JqW2tdLCBrLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlKG9iaiwgZjogKGEsIGksIGQsIGssIG8pID0+IGFueSwgaW5pdCwgdGhpc0FyZz8pIHtcbiAgaWYgKG9iai5yZWR1Y2UpIHtcbiAgICByZXR1cm4gb2JqLnJlZHVjZS5jYWxsKHRoaXNBcmcsIGYsIGluaXQpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIGluaXQgPSBmLmNhbGwodGhpc0FyZywgaW5pdCwgb2JqW2tdLCBrLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5pdDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwKG9iaiwgZjogKGEsIGQsIGssIG8pID0+IGFueSwgdGhpc0FyZz8pIHtcbiAgaWYgKG9iai5tYXApIHtcbiAgICByZXR1cm4gb2JqLm1hcC5jYWxsKHRoaXNBcmcsIGYpO1xuICB9IGVsc2Uge1xuICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICBvdXRwdXQucHVzaChmLmNhbGwodGhpc0FyZywgb2JqW2tdLCBrLCBvYmopKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYW55PFQ+KGFycjogQXJyYXk8VD4sIGY6IChkOiBULCBrPywgaT8pID0+IGJvb2xlYW4pIHtcbiAgdmFyIGkgPSAwO1xuICBmb3IgKGxldCBrID0gMDsgazxhcnIubGVuZ3RoOyBrKyspIHtcbiAgICBpZiAoZihhcnJba10sIGssIGkrKykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGw8VD4oYXJyOiBBcnJheTxUPiwgZjogKGQ6IFQsIGs/LCBpPykgPT4gYm9vbGVhbikge1xuICB2YXIgaSA9IDA7XG4gIGZvciAobGV0IGsgPSAwOyBrPGFyci5sZW5ndGg7IGsrKykge1xuICAgIGlmICghZihhcnJba10sIGssIGkrKykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIEZJWE1FIHJlbW92ZSB0aGlzXG5pbXBvcnQgZGxCaW4gPSByZXF1aXJlKCdkYXRhbGliL3NyYy9iaW5zL2JpbnMnKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRiaW5zKHN0YXRzLCBtYXhiaW5zKSB7XG4gIHJldHVybiBkbEJpbih7XG4gICAgbWluOiBzdGF0cy5taW4sXG4gICAgbWF4OiBzdGF0cy5tYXgsXG4gICAgbWF4YmluczogbWF4Ymluc1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVycm9yKG1lc3NhZ2U6IGFueSkge1xuICBjb25zb2xlLmVycm9yKCdbVkwgRXJyb3JdJywgbWVzc2FnZSk7XG59XG4iLCJpbXBvcnQge1NwZWN9IGZyb20gJy4vc2NoZW1hL3NjaGVtYSc7XG5cbi8vIFRPRE86IG1vdmUgdG8gdmwuc3BlYy52YWxpZGF0b3I/XG5cbmltcG9ydCB7dG9NYXB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge0JBUn0gZnJvbSAnLi9tYXJrJztcblxuaW50ZXJmYWNlIFJlcXVpcmVkQ2hhbm5lbE1hcCB7XG4gIFttYXJrOiBzdHJpbmddOiBBcnJheTxzdHJpbmc+O1xufVxuXG4vKipcbiAqIFJlcXVpcmVkIEVuY29kaW5nIENoYW5uZWxzIGZvciBlYWNoIG1hcmsgdHlwZVxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUkVRVUlSRURfQ0hBTk5FTF9NQVA6IFJlcXVpcmVkQ2hhbm5lbE1hcCA9IHtcbiAgdGV4dDogWyd0ZXh0J10sXG4gIGxpbmU6IFsneCcsICd5J10sXG4gIGFyZWE6IFsneCcsICd5J11cbn07XG5cbmludGVyZmFjZSBTdXBwb3J0ZWRDaGFubmVsTWFwIHtcbiAgW21hcms6IHN0cmluZ106IHtcbiAgICBbY2hhbm5lbDogc3RyaW5nXTogbnVtYmVyXG4gIH07XG59XG5cbi8qKlxuICogU3VwcG9ydGVkIEVuY29kaW5nIENoYW5uZWwgZm9yIGVhY2ggbWFyayB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NVUFBPUlRFRF9DSEFOTkVMX1RZUEU6IFN1cHBvcnRlZENoYW5uZWxNYXAgPSB7XG4gIGJhcjogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdzaXplJywgJ2NvbG9yJywgJ2RldGFpbCddKSxcbiAgbGluZTogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdkZXRhaWwnXSksIC8vIFRPRE86IGFkZCBzaXplIHdoZW4gVmVnYSBzdXBwb3J0c1xuICBhcmVhOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2RldGFpbCddKSxcbiAgdGljazogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdkZXRhaWwnXSksXG4gIGNpcmNsZTogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdzaXplJywgJ2RldGFpbCddKSxcbiAgc3F1YXJlOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnLCAnZGV0YWlsJ10pLFxuICBwb2ludDogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdzaXplJywgJ2RldGFpbCcsICdzaGFwZSddKSxcbiAgdGV4dDogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3NpemUnLCAnY29sb3InLCAndGV4dCddKSAvLyBUT0RPKCM3MjQpIHJldmlzZVxufTtcblxuLy8gVE9ETzogY29uc2lkZXIgaWYgd2Ugc2hvdWxkIGFkZCB2YWxpZGF0ZSBtZXRob2QgYW5kXG4vLyByZXF1aXJlcyBaU2NoZW1hIGluIHRoZSBtYWluIHZlZ2EtbGl0ZSByZXBvXG5cbi8qKlxuICogRnVydGhlciBjaGVjayBpZiBlbmNvZGluZyBtYXBwaW5nIG9mIGEgc3BlYyBpcyBpbnZhbGlkIGFuZFxuICogcmV0dXJuIGVycm9yIGlmIGl0IGlzIGludmFsaWQuXG4gKlxuICogVGhpcyBjaGVja3MgaWZcbiAqICgxKSBhbGwgdGhlIHJlcXVpcmVkIGVuY29kaW5nIGNoYW5uZWxzIGZvciB0aGUgbWFyayB0eXBlIGFyZSBzcGVjaWZpZWRcbiAqICgyKSBhbGwgdGhlIHNwZWNpZmllZCBlbmNvZGluZyBjaGFubmVscyBhcmUgc3VwcG9ydGVkIGJ5IHRoZSBtYXJrIHR5cGVcbiAqIEBwYXJhbSAge1t0eXBlXX0gc3BlYyBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtSZXF1aXJlZENoYW5uZWxNYXAgID0gRGVmYXVsdFJlcXVpcmVkQ2hhbm5lbE1hcH0gIHJlcXVpcmVkQ2hhbm5lbE1hcFxuICogQHBhcmFtICB7U3VwcG9ydGVkQ2hhbm5lbE1hcCA9IERlZmF1bHRTdXBwb3J0ZWRDaGFubmVsTWFwfSBzdXBwb3J0ZWRDaGFubmVsTWFwXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFJldHVybiBvbmUgcmVhc29uIHdoeSB0aGUgZW5jb2RpbmcgaXMgaW52YWxpZCxcbiAqICAgICAgICAgICAgICAgICAgb3IgbnVsbCBpZiB0aGUgZW5jb2RpbmcgaXMgdmFsaWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbmNvZGluZ01hcHBpbmdFcnJvcihzcGVjOiBTcGVjLFxuICByZXF1aXJlZENoYW5uZWxNYXA6IFJlcXVpcmVkQ2hhbm5lbE1hcCA9IERFRkFVTFRfUkVRVUlSRURfQ0hBTk5FTF9NQVAsXG4gIHN1cHBvcnRlZENoYW5uZWxNYXA6IFN1cHBvcnRlZENoYW5uZWxNYXAgPSBERUZBVUxUX1NVUFBPUlRFRF9DSEFOTkVMX1RZUEVcbiAgKSB7XG4gIGxldCBtYXJrID0gc3BlYy5tYXJrO1xuICBsZXQgZW5jb2RpbmcgPSBzcGVjLmVuY29kaW5nO1xuICBsZXQgcmVxdWlyZWRDaGFubmVscyA9IHJlcXVpcmVkQ2hhbm5lbE1hcFttYXJrXTtcbiAgbGV0IHN1cHBvcnRlZENoYW5uZWxzID0gc3VwcG9ydGVkQ2hhbm5lbE1hcFttYXJrXTtcblxuICBmb3IgKGxldCBpIGluIHJlcXVpcmVkQ2hhbm5lbHMpIHsgLy8gYWxsIHJlcXVpcmVkIGNoYW5uZWxzIGFyZSBpbiBlbmNvZGluZ2BcbiAgICBpZiAoIShyZXF1aXJlZENoYW5uZWxzW2ldIGluIGVuY29kaW5nKSkge1xuICAgICAgcmV0dXJuICdNaXNzaW5nIGVuY29kaW5nIGNoYW5uZWwgXFxcIicgKyByZXF1aXJlZENoYW5uZWxzW2ldICtcbiAgICAgICAgJ1xcXCIgZm9yIG1hcmsgXFxcIicgKyBtYXJrICsgJ1xcXCInO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGNoYW5uZWwgaW4gZW5jb2RpbmcpIHsgLy8gYWxsIGNoYW5uZWxzIGluIGVuY29kaW5nIGFyZSBzdXBwb3J0ZWRcbiAgICBpZiAoIXN1cHBvcnRlZENoYW5uZWxzW2NoYW5uZWxdKSB7XG4gICAgICByZXR1cm4gJ0VuY29kaW5nIGNoYW5uZWwgXFxcIicgKyBjaGFubmVsICtcbiAgICAgICAgJ1xcXCIgaXMgbm90IHN1cHBvcnRlZCBieSBtYXJrIHR5cGUgXFxcIicgKyBtYXJrICsgJ1xcXCInO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtYXJrID09PSBCQVIgJiYgIWVuY29kaW5nLnggJiYgIWVuY29kaW5nLnkpIHtcbiAgICByZXR1cm4gJ01pc3NpbmcgYm90aCB4IGFuZCB5IGZvciBiYXInO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCJpbXBvcnQgKiBhcyB2bEJpbiBmcm9tICcuL2Jpbic7XG5pbXBvcnQgKiBhcyB2bENoYW5uZWwgZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCAqIGFzIHZsRGF0YSBmcm9tICcuL2RhdGEnO1xuaW1wb3J0ICogYXMgdmxFbmNvZGluZyBmcm9tICcuL2VuY29kaW5nJztcbmltcG9ydCAqIGFzIHZsRmllbGREZWYgZnJvbSAnLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyB2bENvbXBpbGUgZnJvbSAnLi9jb21waWxlL2NvbXBpbGUnO1xuaW1wb3J0ICogYXMgdmxTY2hlbWEgZnJvbSAnLi9zY2hlbWEvc2NoZW1hJztcbmltcG9ydCAqIGFzIHZsU2hvcnRoYW5kIGZyb20gJy4vc2hvcnRoYW5kJztcbmltcG9ydCAqIGFzIHZsU3BlYyBmcm9tICcuL3NwZWMnO1xuaW1wb3J0ICogYXMgdmxUaW1lVW5pdCBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCAqIGFzIHZsVHlwZSBmcm9tICcuL3R5cGUnO1xuaW1wb3J0ICogYXMgdmxWYWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCAqIGFzIHZsVXRpbCBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgYmluID0gdmxCaW47XG5leHBvcnQgY29uc3QgY2hhbm5lbCA9IHZsQ2hhbm5lbDtcbmV4cG9ydCBjb25zdCBjb21waWxlID0gdmxDb21waWxlLmNvbXBpbGU7XG5leHBvcnQgY29uc3QgZGF0YSA9IHZsRGF0YTtcbmV4cG9ydCBjb25zdCBlbmNvZGluZyA9IHZsRW5jb2Rpbmc7XG5leHBvcnQgY29uc3QgZmllbGREZWYgPSB2bEZpZWxkRGVmO1xuZXhwb3J0IGNvbnN0IHNjaGVtYSA9IHZsU2NoZW1hO1xuZXhwb3J0IGNvbnN0IHNob3J0aGFuZCA9IHZsU2hvcnRoYW5kO1xuZXhwb3J0IGNvbnN0IHNwZWMgPSB2bFNwZWM7XG5leHBvcnQgY29uc3QgdGltZVVuaXQgPSB2bFRpbWVVbml0O1xuZXhwb3J0IGNvbnN0IHR5cGUgPSB2bFR5cGU7XG5leHBvcnQgY29uc3QgdXRpbCA9IHZsVXRpbDtcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZSA9IHZsVmFsaWRhdGU7XG5cbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJ19fVkVSU0lPTl9fJztcbiJdfQ==
