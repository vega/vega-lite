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
exports.CHANNELS = [exports.X, exports.Y, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.TEXT, exports.DETAIL, exports.LABEL];
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
    }
    throw new Error('Invalid encoding channel' + channel);
}
exports.getSupportedRole = getSupportedRole;

},{}],10:[function(require,module,exports){
var axis_schema_1 = require('../schema/axis.schema');
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
    function Model(spec, theme) {
        var defaults = schema.instantiate();
        this._spec = schemaUtil.mergeDeep(defaults, theme || {}, spec);
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
        return vlEncoding.forEach(this._spec.encoding, f, t);
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
                return 10;
            case mark_1.BAR:
                return !this.has(channel) || this.isOrdinalScale(channel) ?
                    this.fieldDef(channel).scale.bandWidth - 1 :
                    2;
            case mark_1.TICK:
                return this.fieldDef(channel).scale.bandWidth / 1.5;
        }
        return 30;
    };
    return Model;
})();
exports.Model = Model;

},{"../channel":9,"../data":29,"../encoding":30,"../fielddef":31,"../mark":32,"../schema/axis.schema":33,"../schema/schema":46,"../schema/schemautil":47,"../type":52,"../util":53,"./config":13,"./layout":16,"./scale":25,"./stack":26}],11:[function(require,module,exports){
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

},{"../channel":9,"../type":52,"../util":53,"./util":28}],12:[function(require,module,exports){
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
function compile(spec, theme) {
    var model = new Model_1.Model(spec, theme);
    var layout = model.layout();
    var FIT = 1;
    var config = model.config();
    var output = util_1.extend(spec.name ? { name: spec.name } : {}, {
        width: typeof layout.width !== 'number' ? FIT : layout.width,
        height: typeof layout.height !== 'number' ? FIT : layout.height,
        padding: 'auto'
    }, ['viewport', 'background'].reduce(function (topLevelConfig, property) {
        var value = config[property];
        if (value !== undefined) {
            topLevelConfig[property] = value;
        }
        return topLevelConfig;
    }, {}), util_1.keys(config.scene).length > 0 ? ['fill', 'fillOpacity', 'stroke', 'strokeWidth',
        'strokeOpacity', 'strokeDash', 'strokeDashOffset'].reduce(function (topLevelConfig, property) {
        var value = config.scene[property];
        if (value !== undefined) {
            topLevelConfig.scene = topLevelConfig.scene || {};
            topLevelConfig.scene[property] = { value: value };
        }
        return topLevelConfig;
    }, {}) : {}, {
        data: data_1.compileData(model),
        marks: [compileRootGroup(model)]
    });
    return {
        spec: output
    };
}
exports.compile = compile;
function compileRootGroup(model) {
    var spec = model.spec();
    var width = model.layout().width;
    var height = model.layout().height;
    var rootGroup = util_1.extend({
        name: spec.name ? spec.name + '-root' : 'root',
        type: 'group',
    }, spec.description ? { description: spec.description } : {}, {
        from: { data: data_2.LAYOUT },
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

},{"../channel":9,"../data":29,"../util":53,"./Model":10,"./axis":11,"./data":14,"./facet":15,"./legend":17,"./mark":24,"./scale":25}],13:[function(require,module,exports){
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

},{"../channel":9,"../encoding":30,"../fielddef":31,"../mark":32,"../util":53}],14:[function(require,module,exports){
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
        var calcFieldMap = (model.data().calculate || []).reduce(function (fieldMap, formula) {
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
        return nullFilterTransform(model).concat(formulaTransform(model), timeTransform(model), binTransform(model), filterTransform(model));
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
        var filterNull = model.config().filterNull;
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
        var filter = model.data().filter;
        return filter ? [{
                type: 'filter',
                test: filter
            }] : [];
    }
    source_1.filterTransform = filterTransform;
    function formulaTransform(model) {
        return (model.data().calculate || []).reduce(function (transform, formula) {
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

},{"../bin":8,"../channel":9,"../data":29,"../fielddef":31,"../type":52,"../util":53,"./scale":25,"./time":27}],15:[function(require,module,exports){
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
        if (model.has(channel_1.X)) {
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
        if (model.has(channel_1.Y)) {
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
        },
        axes: [axis_1.compileAxis(channel_1.X, model)]
    });
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
        axes: [axis_1.compileAxis(channel_1.Y, model)]
    });
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

},{"../channel":9,"../util":53,"./axis":11,"./scale":25}],16:[function(require,module,exports){
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
        return model.config().textCellWidth;
    }
    return model.fieldDef(channel_1.X).scale.bandWidth;
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
    return model.fieldDef(channel_1.Y).scale.bandWidth;
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
                    else {
                        symbols.fill = { value: model.fieldDef(channel_1.COLOR).value };
                    }
                }
                else {
                    symbols.fill = { value: 'transparent' };
                    util_2.applyMarkConfig(symbols, model, util_2.FILL_STROKE_CONFIG);
                    if (model.has(channel_1.COLOR) && channel === channel_1.COLOR) {
                        symbols.stroke = { scale: model.scaleName(channel_1.COLOR), field: 'data' };
                    }
                    else {
                        symbols.stroke = { value: model.fieldDef(channel_1.COLOR).value };
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

},{"../channel":9,"../fielddef":31,"../mark":32,"../util":53,"./util":28}],18:[function(require,module,exports){
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
                field: model.field(channel_1.X) + '_start'
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
                    field: model.field(channel_1.X) + '_end'
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
                field: model.field(channel_1.Y) + '_start'
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
                    field: model.field(channel_1.Y) + '_end'
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
                field: model.field(channel_1.X) + '_start'
            };
            p.x2 = {
                scale: model.scaleName(channel_1.X),
                field: model.field(channel_1.X) + '_end'
            };
        }
        else if (model.isMeasure(channel_1.X)) {
            if (orient === 'horizontal') {
                p.x = {
                    scale: model.scaleName(channel_1.X),
                    field: model.field(channel_1.X)
                };
                p.x2 = { value: 0 };
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
                field: model.field(channel_1.Y) + '_start'
            };
            p.y2 = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y) + '_end'
            };
        }
        else if (model.isMeasure(channel_1.Y)) {
            if (orient !== 'horizontal') {
                p.y = {
                    scale: model.scaleName(channel_1.Y),
                    field: model.field(channel_1.Y)
                };
                p.y2 = { field: { group: 'height' } };
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
            p.x = { value: model.fieldDef(channel_1.X).scale.bandWidth / 2 };
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else {
            p.y = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 2 };
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
        else {
            p.shape = { value: model.fieldDef(channel_1.SHAPE).value };
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
    function markType(model) {
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
    function markType(model) {
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
                p.x = { value: model.fieldDef(channel_1.X).scale.bandWidth / 2 };
            }
        }
        if (model.has(channel_1.Y)) {
            p.y = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else {
            p.y = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 2 };
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

},{"../channel":9,"../type":52,"../util":53,"./util":28}],23:[function(require,module,exports){
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
            p.xc = { value: model.fieldDef(channel_1.X).scale.bandWidth / 2 };
        }
        if (model.has(channel_1.Y)) {
            p.yc = {
                scale: model.scaleName(channel_1.Y),
                field: model.field(channel_1.Y, { binSuffix: '_mid' })
            };
        }
        else {
            p.yc = { value: model.fieldDef(channel_1.Y).scale.bandWidth / 2 };
        }
        if (model.config().mark.orient === 'horizontal') {
            p.width = { value: model.config().mark.thickness };
            p.height = { value: model.sizeValue(channel_1.Y) };
        }
        else {
            p.width = { value: model.sizeValue(channel_1.X) };
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
    var mark = model.mark();
    var name = model.spec().name;
    var isFaceted = model.has(channel_1.ROW) || model.has(channel_1.COLUMN);
    var dataFrom = { data: model.dataTable() };
    var markConfig = model.config().mark;
    var sortBy = markConfig.sortBy;
    if (mark === mark_1.LINE || mark === mark_1.AREA) {
        var details = detailFields(model);
        var sortLineBy = mark === mark_1.LINE ? markConfig.sortLineBy : undefined;
        if (!sortLineBy) {
            sortLineBy = '-' + model.field(markConfig.orient === 'horizontal' ? channel_1.Y : channel_1.X);
        }
        var pathMarks = util_1.extend(name ? { name: name + '-marks' } : {}, {
            type: markCompiler[mark].markType(model),
            from: util_1.extend(isFaceted || details.length > 0 ? {} : dataFrom, { transform: [{ type: 'sort', by: sortLineBy }] }),
            properties: { update: markCompiler[mark].properties(model) }
        });
        if (details.length > 0) {
            var facetTransform = { type: 'facet', groupby: details };
            var transform = [].concat((sortBy ? [{ type: 'sort', by: sortBy }] : []), mark === mark_1.AREA && model.stack() ?
                [stack_1.imputeTransform(model), stack_1.stackTransform(model), facetTransform] :
                [facetTransform]);
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
                    marks: [pathMarks]
                }];
        }
        else {
            return [pathMarks];
        }
    }
    else {
        var marks = [];
        if (mark === mark_1.TEXT &&
            model.has(channel_1.COLOR) &&
            model.config().mark.applyColorToBackground && !model.has(channel_1.X) && !model.has(channel_1.Y)) {
            marks.push(util_1.extend(name ? { name: name + '-background' } : {}, { type: 'rect' }, isFaceted ? {} : { from: dataFrom }, { properties: { update: mark_text_1.text.background(model) } }));
        }
        marks.push(util_1.extend(name ? { name: name + '-marks' } : {}, { type: markCompiler[mark].markType(model) }, (!isFaceted || model.stack() || sortBy) ? {
            from: util_1.extend(isFaceted ? {} : dataFrom, model.stack() || sortBy ? { transform: [].concat((model.stack() ? [stack_1.stackTransform(model)] : []), sortBy ? [{ type: 'sort', by: sortBy }] : []) } : {})
        } : {}, { properties: { update: markCompiler[mark].properties(model) } }));
        if (model.has(channel_1.LABEL) && markCompiler[mark].labels) {
            var labelProperties = markCompiler[mark].labels(model);
            if (labelProperties !== undefined) {
                marks.push(util_1.extend(name ? { name: name + '-label' } : {}, { type: 'text' }, isFaceted ? {} : { from: dataFrom }, { properties: { update: labelProperties } }));
            }
        }
        return marks;
    }
}
exports.compileMark = compileMark;
function detailFields(model) {
    return [channel_1.COLOR, channel_1.DETAIL, channel_1.SHAPE].reduce(function (details, channel) {
        if (model.has(channel) && !model.fieldDef(channel).aggregate) {
            details.push(model.field(channel));
        }
        return details;
    }, []);
}

},{"../channel":9,"../mark":32,"../util":53,"./mark-area":18,"./mark-bar":19,"./mark-line":20,"./mark-point":21,"./mark-text":22,"./mark-tick":23,"./stack":26}],25:[function(require,module,exports){
var util_1 = require('../util');
var aggregate_1 = require('../aggregate');
var channel_1 = require('../channel');
var data_1 = require('../data');
var fielddef_1 = require('../fielddef');
var type_1 = require('../type');
var mark_1 = require('../mark');
var time_1 = require('./time');
function compileScales(channels, model) {
    return channels.filter(function (channel) {
        return channel !== channel_1.DETAIL;
    })
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
    switch (fieldDef.type) {
        case type_1.NOMINAL:
            return 'ordinal';
        case type_1.ORDINAL:
            return 'ordinal';
        case type_1.TEMPORAL:
            if (channel === channel_1.COLOR) {
                return 'time';
            }
            if (util_1.contains([channel_1.ROW, channel_1.COLUMN, channel_1.SHAPE], channel)) {
                return 'ordinal';
            }
            if (fieldDef.scale.type !== undefined) {
                return fieldDef.scale.type;
            }
            if (fieldDef.timeUnit) {
                switch (fieldDef.timeUnit) {
                    case 'hours':
                    case 'day':
                    case 'month':
                        return 'ordinal';
                    case 'date':
                    case 'year':
                    case 'second':
                    case 'minute':
                        return util_1.contains([mark_1.BAR, mark_1.TICK], mark) &&
                            fielddef_1.isDimension(fieldDef) ? 'ordinal' : 'time';
                    default:
                        return 'ordinal';
                }
            }
            return 'time';
        case type_1.QUANTITATIVE:
            if (fieldDef.bin) {
                return util_1.contains([channel_1.X, channel_1.Y, channel_1.COLOR], channel) ? 'linear' : 'ordinal';
            }
            if (fieldDef.scale.type !== undefined) {
                return fieldDef.scale.type;
            }
            return 'linear';
    }
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
        return {
            data: data_1.STACKED_SCALE,
            field: model.field(channel, {
                prefn: 'sum_'
            })
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
            else {
                var xIsMeasure = model.isMeasure(channel_1.X);
                var yIsMeasure = model.isMeasure(channel_1.Y);
                var bandWidth_1 = xIsMeasure !== yIsMeasure ?
                    model.fieldDef(xIsMeasure ? channel_1.Y : channel_1.X).scale.bandWidth :
                    Math.min(model.fieldDef(channel_1.X).scale.bandWidth, model.fieldDef(channel_1.Y).scale.bandWidth);
                return { range: [10, (bandWidth_1 - 2) * (bandWidth_1 - 2)] };
            }
        case channel_1.SHAPE:
            return { range: 'shapes' };
        case channel_1.COLOR:
            if (fieldDef.type === type_1.NOMINAL) {
                return { range: 'category10' };
            }
            else {
                return { range: ['#AFC6A3', '#09622A'] };
            }
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

},{"../aggregate":7,"../channel":9,"../data":29,"../fielddef":31,"../mark":32,"../type":52,"../util":53,"./time":27}],26:[function(require,module,exports){
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

},{"../channel":9,"../encoding":30,"../fielddef":31,"../mark":32,"../schema/config.stack.schema":39,"../schema/schemautil":47,"../util":53,"./scale":25}],27:[function(require,module,exports){
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

},{"../channel":9,"../util":53}],28:[function(require,module,exports){
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
    applyMarkConfig(p, model, exports.FILL_STROKE_CONFIG);
    if (filled) {
        if (model.has(channel_1.COLOR)) {
            p.fill = {
                scale: model.scaleName(channel_1.COLOR),
                field: model.field(channel_1.COLOR)
            };
        }
        else {
            p.fill = { value: model.fieldDef(channel_1.COLOR).value };
        }
    }
    else {
        if (model.has(channel_1.COLOR)) {
            p.stroke = {
                scale: model.scaleName(channel_1.COLOR),
                field: model.field(channel_1.COLOR)
            };
        }
        else {
            p.stroke = { value: model.fieldDef(channel_1.COLOR).value };
        }
    }
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
            var axis = fieldDef.axis;
            return (typeof axis !== 'boolean' ? axis.shortTimeLabels : false);
        case channel_1.COLOR:
        case channel_1.SHAPE:
        case channel_1.SIZE:
            var legend = fieldDef.legend;
            return (typeof legend !== 'boolean' ? legend.shortTimeLabels : false);
        case channel_1.TEXT:
            return model.config().mark.shortTimeLabels;
        case channel_1.LABEL:
    }
}
function timeFormat(model, channel) {
    var fieldDef = model.fieldDef(channel);
    return time_1.format(fieldDef.timeUnit, isAbbreviated(model, channel, fieldDef));
}
exports.timeFormat = timeFormat;

},{"../channel":9,"../type":52,"../util":53,"./time":27}],29:[function(require,module,exports){
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

},{"./type":52}],30:[function(require,module,exports){
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
    for (var k in encoding) {
        if (has(encoding, k) && encoding[k].aggregate) {
            return true;
        }
    }
    return false;
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

},{"./channel":9,"./util":53}],31:[function(require,module,exports){
var util_1 = require('./util');
var type_1 = require('./type');
function field(fieldDef, opt) {
    if (opt === void 0) { opt = {}; }
    var f = (opt.datum ? 'datum.' : '') + (opt.prefn || ''), field = fieldDef.field;
    if (isCount(fieldDef)) {
        return f + 'count';
    }
    else if (opt.fn) {
        return f + opt.fn + '_' + field;
    }
    else if (!opt.nofn && fieldDef.bin) {
        return f + 'bin_' + field + opt.binSuffix || '_start';
    }
    else if (!opt.nofn && !opt.noAggregate && fieldDef.aggregate) {
        return f + fieldDef.aggregate + '_' + field;
    }
    else if (!opt.nofn && fieldDef.timeUnit) {
        return f + fieldDef.timeUnit + '_' + field;
    }
    else {
        return f + field;
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

},{"./type":52,"./util":53}],32:[function(require,module,exports){
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

},{"../type":52,"../util":53}],35:[function(require,module,exports){
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
        sortBy: {
            default: undefined,
            oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
            ],
            description: 'Sort layer of marks by a given field or fields.'
        },
        sortLineBy: {
            default: undefined,
            oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
            ],
            description: 'Sort layer of marks by a given field or fields.'
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
            description: 'The orientation of a non-stacked bar, area, and line charts.' +
                'The value is either horizontal (default) or vertical.' +
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
        filterNull: {
            type: 'boolean',
            default: undefined,
            description: 'Filter null values from the data. If set to true, all rows with null values are filtered. If false, no rows are filtered. Set the property to undefined to filter only quantitative and temporal fields.'
        },
        numberFormat: {
            type: 'string',
            default: undefined,
            description: 'D3 Number format for axis labels and text tables. For example "s" for SI units.'
        },
        timeFormat: {
            type: 'string',
            default: '%Y-%m-%d',
            description: 'Default datetime format for axis and legend labels. The format can be set directly on each axis and legend.'
        },
        textCellWidth: {
            type: 'integer',
            default: 90,
            minimum: 0
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

},{}],41:[function(require,module,exports){
var schemautil_1 = require('./schemautil');
var util_1 = require('../util');
var axis_schema_1 = require('./axis.schema');
var fielddef_schema_1 = require('./fielddef.schema');
var legend_schema_1 = require('./legend.schema');
var sort_schema_1 = require('./sort.schema');
var x = schemautil_1.mergeDeep(util_1.duplicate(fielddef_schema_1.typicalField), {
    required: ['field', 'type'],
    properties: {
        scale: {
            properties: {
                padding: { default: 1 },
                bandWidth: { default: 21 }
            }
        },
        axis: axis_schema_1.axis,
        sort: sort_schema_1.sort
    }
});
var y = util_1.duplicate(x);
var row = schemautil_1.mergeDeep(util_1.duplicate(fielddef_schema_1.facetField));
var column = schemautil_1.mergeDeep(util_1.duplicate(fielddef_schema_1.facetField));
var size = schemautil_1.mergeDeep(util_1.duplicate(fielddef_schema_1.typicalField), {
    properties: {
        legend: legend_schema_1.legend,
        sort: sort_schema_1.sort,
        value: {
            type: 'integer',
            default: undefined,
            minimum: 0,
            description: 'Size of marks. By default, this is 30 for point, square, and circle, and 10 for text.'
        }
    }
});
var color = schemautil_1.mergeDeep(util_1.duplicate(fielddef_schema_1.typicalField), {
    properties: {
        legend: legend_schema_1.legend,
        sort: sort_schema_1.sort,
        value: {
            type: 'string',
            role: 'color',
            default: '#4682b4',
            description: 'Color to be used for marks.'
        },
        scale: {
            type: 'object',
            properties: {
                quantitativeRange: {
                    type: 'array',
                    default: ['#AFC6A3', '#09622A'],
                    description: 'Color range to encode quantitative variables.',
                    minItems: 2,
                    maxItems: 2,
                    items: {
                        type: 'string',
                        role: 'color'
                    }
                }
            }
        }
    }
});
var shape = schemautil_1.mergeDeep(util_1.duplicate(fielddef_schema_1.onlyOrdinalField), {
    properties: {
        legend: legend_schema_1.legend,
        sort: sort_schema_1.sort,
        value: {
            type: 'string',
            enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
            default: 'circle',
            description: 'Mark to be used.'
        }
    }
});
var detail = {
    default: undefined,
    oneOf: [util_1.duplicate(fielddef_schema_1.fieldDef), {
            type: 'array',
            items: util_1.duplicate(fielddef_schema_1.fieldDef)
        }]
};
var text = schemautil_1.mergeDeep(util_1.duplicate(fielddef_schema_1.typicalField), {
    properties: {
        sort: sort_schema_1.sort,
        value: {
            type: 'string',
            default: 'Abc'
        }
    }
});
var label = schemautil_1.mergeDeep(util_1.duplicate(fielddef_schema_1.typicalField), {
    properies: {
        sort: sort_schema_1.sort
    }
});
exports.encoding = {
    type: 'object',
    properties: {
        x: x,
        y: y,
        row: row,
        column: column,
        size: size,
        color: color,
        shape: shape,
        text: text,
        detail: detail,
        label: label
    }
};

},{"../util":53,"./axis.schema":33,"./fielddef.schema":42,"./legend.schema":43,"./schemautil":47,"./sort.schema":48}],42:[function(require,module,exports){
var axis_schema_1 = require('./axis.schema');
var bin_schema_1 = require('./bin.schema');
var scale_schema_1 = require('./scale.schema');
var sort_schema_1 = require('./sort.schema');
var aggregate_1 = require('../aggregate');
var util_1 = require('../util');
var schemautil_1 = require('./schemautil');
var timeunit_1 = require('../timeunit');
var type_1 = require('../type');
exports.fieldDef = {
    type: 'object',
    properties: {
        field: {
            type: 'string'
        },
        type: {
            type: 'string',
            enum: [type_1.NOMINAL, type_1.ORDINAL, type_1.QUANTITATIVE, type_1.TEMPORAL]
        },
        timeUnit: {
            type: 'string',
            enum: timeunit_1.TIMEUNITS,
            supportedTypes: util_1.toMap([type_1.TEMPORAL])
        },
        bin: bin_schema_1.bin,
    }
};
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
exports.typicalField = schemautil_1.mergeDeep(util_1.duplicate(exports.fieldDef), {
    properties: {
        aggregate: exports.aggregate,
        scale: scale_schema_1.typicalScale
    }
});
exports.onlyOrdinalField = schemautil_1.mergeDeep(util_1.duplicate(exports.fieldDef), {
    properties: {
        scale: scale_schema_1.ordinalOnlyScale
    }
});
exports.facetField = schemautil_1.mergeDeep(util_1.duplicate(exports.onlyOrdinalField), {
    required: ['field', 'type'],
    properties: {
        axis: axis_schema_1.axis,
        sort: sort_schema_1.sort
    }
});

},{"../aggregate":7,"../timeunit":51,"../type":52,"../util":53,"./axis.schema":33,"./bin.schema":34,"./scale.schema":45,"./schemautil":47,"./sort.schema":48}],43:[function(require,module,exports){
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

},{"../type":52,"../util":53,"./schemautil":47}],46:[function(require,module,exports){
var schemaUtil = require('./schemautil');
var mark_schema_1 = require('./mark.schema');
var config_schema_1 = require('./config.schema');
var data_schema_1 = require('./data.schema');
var encoding_schema_1 = require('./encoding.schema');
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
            type: 'string'
        },
        description: {
            type: 'string'
        },
        data: data_schema_1.data,
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

},{"./config.schema":38,"./data.schema":40,"./encoding.schema":41,"./fielddef.schema":42,"./mark.schema":44,"./schemautil":47}],47:[function(require,module,exports){
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

},{"../util":53}],48:[function(require,module,exports){
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

},{"../aggregate":7,"../type":52,"../util":53}],49:[function(require,module,exports){
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

},{"./aggregate":7,"./encoding":30,"./mark":32,"./timeunit":51,"./type":52}],50:[function(require,module,exports){
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

},{"./channel":9,"./compile/Model":10,"./encoding":30,"./mark":32,"./util":53}],51:[function(require,module,exports){
exports.TIMEUNITS = [
    'year', 'month', 'day', 'date', 'hours', 'minutes', 'seconds', 'milliseconds',
    'yearmonth', 'yearmonthday', 'yearmonthdate', 'yearday', 'yeardate', 'yearmonthdayhours', 'yearmonthdayhoursminutes', 'hoursminutes', 'hoursminutesseconds', 'minutesseconds', 'secondsmilliseconds'
];

},{}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
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

},{"datalib/src/bins/bins":3,"datalib/src/generate":4,"datalib/src/util":6}],54:[function(require,module,exports){
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

},{"./mark":32,"./util":53}],55:[function(require,module,exports){
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
exports.version = '0.9.2';

},{"./bin":8,"./channel":9,"./compile/compile":12,"./data":29,"./encoding":30,"./fielddef":31,"./schema/schema":46,"./shorthand":49,"./spec":50,"./timeunit":51,"./type":52,"./util":53,"./validate":54}]},{},[55])(55)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvbm9kZV9tb2R1bGVzL2QzLXRpbWUvYnVpbGQvZDMtdGltZS5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9iaW5zL2JpbnMuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvZ2VuZXJhdGUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvdGltZS5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy91dGlsLmpzIiwic3JjL2FnZ3JlZ2F0ZS50cyIsInNyYy9iaW4udHMiLCJzcmMvY2hhbm5lbC50cyIsInNyYy9jb21waWxlL01vZGVsLnRzIiwic3JjL2NvbXBpbGUvYXhpcy50cyIsInNyYy9jb21waWxlL2NvbXBpbGUudHMiLCJzcmMvY29tcGlsZS9jb25maWcudHMiLCJzcmMvY29tcGlsZS9kYXRhLnRzIiwic3JjL2NvbXBpbGUvZmFjZXQudHMiLCJzcmMvY29tcGlsZS9sYXlvdXQudHMiLCJzcmMvY29tcGlsZS9sZWdlbmQudHMiLCJzcmMvY29tcGlsZS9tYXJrLWFyZWEudHMiLCJzcmMvY29tcGlsZS9tYXJrLWJhci50cyIsInNyYy9jb21waWxlL21hcmstbGluZS50cyIsInNyYy9jb21waWxlL21hcmstcG9pbnQudHMiLCJzcmMvY29tcGlsZS9tYXJrLXRleHQudHMiLCJzcmMvY29tcGlsZS9tYXJrLXRpY2sudHMiLCJzcmMvY29tcGlsZS9tYXJrLnRzIiwic3JjL2NvbXBpbGUvc2NhbGUudHMiLCJzcmMvY29tcGlsZS9zdGFjay50cyIsInNyYy9jb21waWxlL3RpbWUudHMiLCJzcmMvY29tcGlsZS91dGlsLnRzIiwic3JjL2RhdGEudHMiLCJzcmMvZW5jb2RpbmcudHMiLCJzcmMvZmllbGRkZWYudHMiLCJzcmMvbWFyay50cyIsInNyYy9zY2hlbWEvYXhpcy5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL2Jpbi5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL2NvbmZpZy5jZWxsLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvY29uZmlnLm1hcmtzLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvY29uZmlnLnNjZW5lLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvY29uZmlnLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvY29uZmlnLnN0YWNrLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvZGF0YS5zY2hlbWEudHMiLCJzcmMvc2NoZW1hL2VuY29kaW5nLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvZmllbGRkZWYuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9sZWdlbmQuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9tYXJrLnNjaGVtYS50cyIsInNyYy9zY2hlbWEvc2NhbGUuc2NoZW1hLnRzIiwic3JjL3NjaGVtYS9zY2hlbWEudHMiLCJzcmMvc2NoZW1hL3NjaGVtYXV0aWwudHMiLCJzcmMvc2NoZW1hL3NvcnQuc2NoZW1hLnRzIiwic3JjL3Nob3J0aGFuZC50cyIsInNyYy9zcGVjLnRzIiwic3JjL3RpbWV1bml0LnRzIiwic3JjL3R5cGUudHMiLCJzcmMvdXRpbC50cyIsInNyYy92YWxpZGF0ZS50cyIsInNyYy92bC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxU2EscUJBQWEsR0FBRztJQUMzQixRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVTtJQUNqRCxLQUFLLEVBQUUsTUFBTSxFQUFF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LFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUN6QyxJQUFZLFVBQVUsV0FBTSxZQUFZLENBQUMsQ0FBQTtBQUN6QyxJQUFZLFNBQVMsV0FBTSxtQkFBbUIsQ0FBQyxDQUFBO0FBQy9DLElBQVksUUFBUSxXQUFNLGlCQUFpQixDQUFDLENBQUE7QUFDNUMsSUFBWSxXQUFXLFdBQU0sYUFBYSxDQUFDLENBQUE7QUFDM0MsSUFBWSxNQUFNLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDakMsSUFBWSxVQUFVLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFDekMsSUFBWSxNQUFNLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDakMsSUFBWSxVQUFVLFdBQU0sWUFBWSxDQUFDLENBQUE7QUFDekMsSUFBWSxNQUFNLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFFcEIsV0FBRyxHQUFHLEtBQUssQ0FBQztBQUNaLGVBQU8sR0FBRyxTQUFTLENBQUM7QUFDcEIsZUFBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7QUFDNUIsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLGdCQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ3RCLGdCQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ3RCLGNBQU0sR0FBRyxRQUFRLENBQUM7QUFDbEIsaUJBQVMsR0FBRyxXQUFXLENBQUM7QUFDeEIsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLGdCQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ3RCLFlBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZ0JBQVEsR0FBRyxVQUFVLENBQUM7QUFFdEIsZUFBTyxHQUFHLGFBQWEsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKCdkMy10aW1lJywgWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgZmFjdG9yeSgoZ2xvYmFsLmQzX3RpbWUgPSB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHQwID0gbmV3IERhdGU7XG4gIHZhciB0MSA9IG5ldyBEYXRlO1xuICBmdW5jdGlvbiBuZXdJbnRlcnZhbChmbG9vcmksIG9mZnNldGksIGNvdW50LCBmaWVsZCkge1xuXG4gICAgZnVuY3Rpb24gaW50ZXJ2YWwoZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoK2RhdGUpKSwgZGF0ZTtcbiAgICB9XG5cbiAgICBpbnRlcnZhbC5mbG9vciA9IGludGVydmFsO1xuXG4gICAgaW50ZXJ2YWwucm91bmQgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICB2YXIgZDAgPSBuZXcgRGF0ZSgrZGF0ZSksXG4gICAgICAgICAgZDEgPSBuZXcgRGF0ZShkYXRlIC0gMSk7XG4gICAgICBmbG9vcmkoZDApLCBmbG9vcmkoZDEpLCBvZmZzZXRpKGQxLCAxKTtcbiAgICAgIHJldHVybiBkYXRlIC0gZDAgPCBkMSAtIGRhdGUgPyBkMCA6IGQxO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5jZWlsID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoZGF0ZSAtIDEpKSwgb2Zmc2V0aShkYXRlLCAxKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwub2Zmc2V0ID0gZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgcmV0dXJuIG9mZnNldGkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSwgc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCkpLCBkYXRlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgICB2YXIgcmFuZ2UgPSBbXTtcbiAgICAgIHN0YXJ0ID0gbmV3IERhdGUoc3RhcnQgLSAxKTtcbiAgICAgIHN0b3AgPSBuZXcgRGF0ZSgrc3RvcCk7XG4gICAgICBzdGVwID0gc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICBpZiAoIShzdGFydCA8IHN0b3ApIHx8ICEoc3RlcCA+IDApKSByZXR1cm4gcmFuZ2U7IC8vIGFsc28gaGFuZGxlcyBJbnZhbGlkIERhdGVcbiAgICAgIG9mZnNldGkoc3RhcnQsIDEpLCBmbG9vcmkoc3RhcnQpO1xuICAgICAgaWYgKHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHdoaWxlIChvZmZzZXRpKHN0YXJ0LCBzdGVwKSwgZmxvb3JpKHN0YXJ0KSwgc3RhcnQgPCBzdG9wKSByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpO1xuICAgICAgcmV0dXJuIHJhbmdlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5maWx0ZXIgPSBmdW5jdGlvbih0ZXN0KSB7XG4gICAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB3aGlsZSAoZmxvb3JpKGRhdGUpLCAhdGVzdChkYXRlKSkgZGF0ZS5zZXRUaW1lKGRhdGUgLSAxKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgICAgd2hpbGUgKC0tc3RlcCA+PSAwKSB3aGlsZSAob2Zmc2V0aShkYXRlLCAxKSwgIXRlc3QoZGF0ZSkpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmIChjb3VudCkge1xuICAgICAgaW50ZXJ2YWwuY291bnQgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICAgIHQwLnNldFRpbWUoK3N0YXJ0KSwgdDEuc2V0VGltZSgrZW5kKTtcbiAgICAgICAgZmxvb3JpKHQwKSwgZmxvb3JpKHQxKTtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoY291bnQodDAsIHQxKSk7XG4gICAgICB9O1xuXG4gICAgICBpbnRlcnZhbC5ldmVyeSA9IGZ1bmN0aW9uKHN0ZXApIHtcbiAgICAgICAgc3RlcCA9IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICAgIHJldHVybiAhaXNGaW5pdGUoc3RlcCkgfHwgIShzdGVwID4gMCkgPyBudWxsXG4gICAgICAgICAgICA6ICEoc3RlcCA+IDEpID8gaW50ZXJ2YWxcbiAgICAgICAgICAgIDogaW50ZXJ2YWwuZmlsdGVyKGZpZWxkXG4gICAgICAgICAgICAgICAgPyBmdW5jdGlvbihkKSB7IHJldHVybiBmaWVsZChkKSAlIHN0ZXAgPT09IDA7IH1cbiAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGludGVydmFsLmNvdW50KDAsIGQpICUgc3RlcCA9PT0gMDsgfSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBpbnRlcnZhbDtcbiAgfTtcblxuICB2YXIgbWlsbGlzZWNvbmQgPSBuZXdJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAvLyBub29wXG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQgLSBzdGFydDtcbiAgfSk7XG5cbiAgLy8gQW4gb3B0aW1pemVkIGltcGxlbWVudGF0aW9uIGZvciB0aGlzIHNpbXBsZSBjYXNlLlxuICBtaWxsaXNlY29uZC5ldmVyeSA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gTWF0aC5mbG9vcihrKTtcbiAgICBpZiAoIWlzRmluaXRlKGspIHx8ICEoayA+IDApKSByZXR1cm4gbnVsbDtcbiAgICBpZiAoIShrID4gMSkpIHJldHVybiBtaWxsaXNlY29uZDtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRUaW1lKE1hdGguZmxvb3IoZGF0ZSAvIGspICogayk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIGspO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gaztcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgc2Vjb25kID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDFlMyk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDFlMztcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFNlY29uZHMoKTtcbiAgfSk7XG5cbiAgdmFyIG1pbnV0ZSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFNlY29uZHMoMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogNmU0KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNmU0O1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0TWludXRlcygpO1xuICB9KTtcblxuICB2YXIgaG91ciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldE1pbnV0ZXMoMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMzZlNSk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDM2ZTU7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRIb3VycygpO1xuICB9KTtcblxuICB2YXIgZGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIDZlNCkgLyA4NjRlNTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldERhdGUoKSAtIDE7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHdlZWtkYXkoaSkge1xuICAgIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gKGRhdGUuZ2V0RGF5KCkgKyA3IC0gaSkgJSA3KTtcbiAgICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBzdGVwICogNyk7XG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDYwNDhlNTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBzdW5kYXkgPSB3ZWVrZGF5KDApO1xuICB2YXIgbW9uZGF5ID0gd2Vla2RheSgxKTtcbiAgdmFyIHR1ZXNkYXkgPSB3ZWVrZGF5KDIpO1xuICB2YXIgd2VkbmVzZGF5ID0gd2Vla2RheSgzKTtcbiAgdmFyIHRodXJzZGF5ID0gd2Vla2RheSg0KTtcbiAgdmFyIGZyaWRheSA9IHdlZWtkYXkoNSk7XG4gIHZhciBzYXR1cmRheSA9IHdlZWtkYXkoNik7XG5cbiAgdmFyIG1vbnRoID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXREYXRlKDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0TW9udGgoKSAtIHN0YXJ0LmdldE1vbnRoKCkgKyAoZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpKSAqIDEyO1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0TW9udGgoKTtcbiAgfSk7XG5cbiAgdmFyIHllYXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldE1vbnRoKDAsIDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRGdWxsWWVhcihkYXRlLmdldEZ1bGxZZWFyKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICB9KTtcblxuICB2YXIgdXRjU2Vjb25kID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDTWlsbGlzZWNvbmRzKDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDFlMyk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDFlMztcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFVUQ1NlY29uZHMoKTtcbiAgfSk7XG5cbiAgdmFyIHV0Y01pbnV0ZSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ1NlY29uZHMoMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogNmU0KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNmU0O1xuICB9LCBmdW5jdGlvbihkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUuZ2V0VVRDTWludXRlcygpO1xuICB9KTtcblxuICB2YXIgdXRjSG91ciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ01pbnV0ZXMoMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMzZlNSk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDM2ZTU7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRVVENIb3VycygpO1xuICB9KTtcblxuICB2YXIgdXRjRGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gODY0ZTU7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRVVENEYXRlKCkgLSAxO1xuICB9KTtcblxuICBmdW5jdGlvbiB1dGNXZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSAtIChkYXRlLmdldFVUQ0RheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgc3RlcCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNjA0OGU1O1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHV0Y1N1bmRheSA9IHV0Y1dlZWtkYXkoMCk7XG4gIHZhciB1dGNNb25kYXkgPSB1dGNXZWVrZGF5KDEpO1xuICB2YXIgdXRjVHVlc2RheSA9IHV0Y1dlZWtkYXkoMik7XG4gIHZhciB1dGNXZWRuZXNkYXkgPSB1dGNXZWVrZGF5KDMpO1xuICB2YXIgdXRjVGh1cnNkYXkgPSB1dGNXZWVrZGF5KDQpO1xuICB2YXIgdXRjRnJpZGF5ID0gdXRjV2Vla2RheSg1KTtcbiAgdmFyIHV0Y1NhdHVyZGF5ID0gdXRjV2Vla2RheSg2KTtcblxuICB2YXIgdXRjTW9udGggPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldFVUQ0RhdGUoMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ01vbnRoKGRhdGUuZ2V0VVRDTW9udGgoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRVVENNb250aCgpIC0gc3RhcnQuZ2V0VVRDTW9udGgoKSArIChlbmQuZ2V0VVRDRnVsbFllYXIoKSAtIHN0YXJ0LmdldFVUQ0Z1bGxZZWFyKCkpICogMTI7XG4gIH0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgICByZXR1cm4gZGF0ZS5nZXRVVENNb250aCgpO1xuICB9KTtcblxuICB2YXIgdXRjWWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICAgIGRhdGUuc2V0VVRDTW9udGgoMCwgMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gIH0pO1xuXG4gIHZhciBtaWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZC5yYW5nZTtcbiAgdmFyIHNlY29uZHMgPSBzZWNvbmQucmFuZ2U7XG4gIHZhciBtaW51dGVzID0gbWludXRlLnJhbmdlO1xuICB2YXIgaG91cnMgPSBob3VyLnJhbmdlO1xuICB2YXIgZGF5cyA9IGRheS5yYW5nZTtcbiAgdmFyIHN1bmRheXMgPSBzdW5kYXkucmFuZ2U7XG4gIHZhciBtb25kYXlzID0gbW9uZGF5LnJhbmdlO1xuICB2YXIgdHVlc2RheXMgPSB0dWVzZGF5LnJhbmdlO1xuICB2YXIgd2VkbmVzZGF5cyA9IHdlZG5lc2RheS5yYW5nZTtcbiAgdmFyIHRodXJzZGF5cyA9IHRodXJzZGF5LnJhbmdlO1xuICB2YXIgZnJpZGF5cyA9IGZyaWRheS5yYW5nZTtcbiAgdmFyIHNhdHVyZGF5cyA9IHNhdHVyZGF5LnJhbmdlO1xuICB2YXIgd2Vla3MgPSBzdW5kYXkucmFuZ2U7XG4gIHZhciBtb250aHMgPSBtb250aC5yYW5nZTtcbiAgdmFyIHllYXJzID0geWVhci5yYW5nZTtcblxuICB2YXIgdXRjTWlsbGlzZWNvbmQgPSBtaWxsaXNlY29uZDtcbiAgdmFyIHV0Y01pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcztcbiAgdmFyIHV0Y1NlY29uZHMgPSB1dGNTZWNvbmQucmFuZ2U7XG4gIHZhciB1dGNNaW51dGVzID0gdXRjTWludXRlLnJhbmdlO1xuICB2YXIgdXRjSG91cnMgPSB1dGNIb3VyLnJhbmdlO1xuICB2YXIgdXRjRGF5cyA9IHV0Y0RheS5yYW5nZTtcbiAgdmFyIHV0Y1N1bmRheXMgPSB1dGNTdW5kYXkucmFuZ2U7XG4gIHZhciB1dGNNb25kYXlzID0gdXRjTW9uZGF5LnJhbmdlO1xuICB2YXIgdXRjVHVlc2RheXMgPSB1dGNUdWVzZGF5LnJhbmdlO1xuICB2YXIgdXRjV2VkbmVzZGF5cyA9IHV0Y1dlZG5lc2RheS5yYW5nZTtcbiAgdmFyIHV0Y1RodXJzZGF5cyA9IHV0Y1RodXJzZGF5LnJhbmdlO1xuICB2YXIgdXRjRnJpZGF5cyA9IHV0Y0ZyaWRheS5yYW5nZTtcbiAgdmFyIHV0Y1NhdHVyZGF5cyA9IHV0Y1NhdHVyZGF5LnJhbmdlO1xuICB2YXIgdXRjV2Vla3MgPSB1dGNTdW5kYXkucmFuZ2U7XG4gIHZhciB1dGNNb250aHMgPSB1dGNNb250aC5yYW5nZTtcbiAgdmFyIHV0Y1llYXJzID0gdXRjWWVhci5yYW5nZTtcblxuICB2YXIgdmVyc2lvbiA9IFwiMC4xLjFcIjtcblxuICBleHBvcnRzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICBleHBvcnRzLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcztcbiAgZXhwb3J0cy5zZWNvbmRzID0gc2Vjb25kcztcbiAgZXhwb3J0cy5taW51dGVzID0gbWludXRlcztcbiAgZXhwb3J0cy5ob3VycyA9IGhvdXJzO1xuICBleHBvcnRzLmRheXMgPSBkYXlzO1xuICBleHBvcnRzLnN1bmRheXMgPSBzdW5kYXlzO1xuICBleHBvcnRzLm1vbmRheXMgPSBtb25kYXlzO1xuICBleHBvcnRzLnR1ZXNkYXlzID0gdHVlc2RheXM7XG4gIGV4cG9ydHMud2VkbmVzZGF5cyA9IHdlZG5lc2RheXM7XG4gIGV4cG9ydHMudGh1cnNkYXlzID0gdGh1cnNkYXlzO1xuICBleHBvcnRzLmZyaWRheXMgPSBmcmlkYXlzO1xuICBleHBvcnRzLnNhdHVyZGF5cyA9IHNhdHVyZGF5cztcbiAgZXhwb3J0cy53ZWVrcyA9IHdlZWtzO1xuICBleHBvcnRzLm1vbnRocyA9IG1vbnRocztcbiAgZXhwb3J0cy55ZWFycyA9IHllYXJzO1xuICBleHBvcnRzLnV0Y01pbGxpc2Vjb25kID0gdXRjTWlsbGlzZWNvbmQ7XG4gIGV4cG9ydHMudXRjTWlsbGlzZWNvbmRzID0gdXRjTWlsbGlzZWNvbmRzO1xuICBleHBvcnRzLnV0Y1NlY29uZHMgPSB1dGNTZWNvbmRzO1xuICBleHBvcnRzLnV0Y01pbnV0ZXMgPSB1dGNNaW51dGVzO1xuICBleHBvcnRzLnV0Y0hvdXJzID0gdXRjSG91cnM7XG4gIGV4cG9ydHMudXRjRGF5cyA9IHV0Y0RheXM7XG4gIGV4cG9ydHMudXRjU3VuZGF5cyA9IHV0Y1N1bmRheXM7XG4gIGV4cG9ydHMudXRjTW9uZGF5cyA9IHV0Y01vbmRheXM7XG4gIGV4cG9ydHMudXRjVHVlc2RheXMgPSB1dGNUdWVzZGF5cztcbiAgZXhwb3J0cy51dGNXZWRuZXNkYXlzID0gdXRjV2VkbmVzZGF5cztcbiAgZXhwb3J0cy51dGNUaHVyc2RheXMgPSB1dGNUaHVyc2RheXM7XG4gIGV4cG9ydHMudXRjRnJpZGF5cyA9IHV0Y0ZyaWRheXM7XG4gIGV4cG9ydHMudXRjU2F0dXJkYXlzID0gdXRjU2F0dXJkYXlzO1xuICBleHBvcnRzLnV0Y1dlZWtzID0gdXRjV2Vla3M7XG4gIGV4cG9ydHMudXRjTW9udGhzID0gdXRjTW9udGhzO1xuICBleHBvcnRzLnV0Y1llYXJzID0gdXRjWWVhcnM7XG4gIGV4cG9ydHMubWlsbGlzZWNvbmQgPSBtaWxsaXNlY29uZDtcbiAgZXhwb3J0cy5zZWNvbmQgPSBzZWNvbmQ7XG4gIGV4cG9ydHMubWludXRlID0gbWludXRlO1xuICBleHBvcnRzLmhvdXIgPSBob3VyO1xuICBleHBvcnRzLmRheSA9IGRheTtcbiAgZXhwb3J0cy5zdW5kYXkgPSBzdW5kYXk7XG4gIGV4cG9ydHMubW9uZGF5ID0gbW9uZGF5O1xuICBleHBvcnRzLnR1ZXNkYXkgPSB0dWVzZGF5O1xuICBleHBvcnRzLndlZG5lc2RheSA9IHdlZG5lc2RheTtcbiAgZXhwb3J0cy50aHVyc2RheSA9IHRodXJzZGF5O1xuICBleHBvcnRzLmZyaWRheSA9IGZyaWRheTtcbiAgZXhwb3J0cy5zYXR1cmRheSA9IHNhdHVyZGF5O1xuICBleHBvcnRzLndlZWsgPSBzdW5kYXk7XG4gIGV4cG9ydHMubW9udGggPSBtb250aDtcbiAgZXhwb3J0cy55ZWFyID0geWVhcjtcbiAgZXhwb3J0cy51dGNTZWNvbmQgPSB1dGNTZWNvbmQ7XG4gIGV4cG9ydHMudXRjTWludXRlID0gdXRjTWludXRlO1xuICBleHBvcnRzLnV0Y0hvdXIgPSB1dGNIb3VyO1xuICBleHBvcnRzLnV0Y0RheSA9IHV0Y0RheTtcbiAgZXhwb3J0cy51dGNTdW5kYXkgPSB1dGNTdW5kYXk7XG4gIGV4cG9ydHMudXRjTW9uZGF5ID0gdXRjTW9uZGF5O1xuICBleHBvcnRzLnV0Y1R1ZXNkYXkgPSB1dGNUdWVzZGF5O1xuICBleHBvcnRzLnV0Y1dlZG5lc2RheSA9IHV0Y1dlZG5lc2RheTtcbiAgZXhwb3J0cy51dGNUaHVyc2RheSA9IHV0Y1RodXJzZGF5O1xuICBleHBvcnRzLnV0Y0ZyaWRheSA9IHV0Y0ZyaWRheTtcbiAgZXhwb3J0cy51dGNTYXR1cmRheSA9IHV0Y1NhdHVyZGF5O1xuICBleHBvcnRzLnV0Y1dlZWsgPSB1dGNTdW5kYXk7XG4gIGV4cG9ydHMudXRjTW9udGggPSB1dGNNb250aDtcbiAgZXhwb3J0cy51dGNZZWFyID0gdXRjWWVhcjtcbiAgZXhwb3J0cy5pbnRlcnZhbCA9IG5ld0ludGVydmFsO1xuXG59KSk7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gICAgdGltZSA9IHJlcXVpcmUoJy4uL3RpbWUnKSxcbiAgICBFUFNJTE9OID0gMWUtMTU7XG5cbmZ1bmN0aW9uIGJpbnMob3B0KSB7XG4gIGlmICghb3B0KSB7IHRocm93IEVycm9yKFwiTWlzc2luZyBiaW5uaW5nIG9wdGlvbnMuXCIpOyB9XG5cbiAgLy8gZGV0ZXJtaW5lIHJhbmdlXG4gIHZhciBtYXhiID0gb3B0Lm1heGJpbnMgfHwgMTUsXG4gICAgICBiYXNlID0gb3B0LmJhc2UgfHwgMTAsXG4gICAgICBsb2diID0gTWF0aC5sb2coYmFzZSksXG4gICAgICBkaXYgPSBvcHQuZGl2IHx8IFs1LCAyXSxcbiAgICAgIG1pbiA9IG9wdC5taW4sXG4gICAgICBtYXggPSBvcHQubWF4LFxuICAgICAgc3BhbiA9IG1heCAtIG1pbixcbiAgICAgIHN0ZXAsIGxldmVsLCBtaW5zdGVwLCBwcmVjaXNpb24sIHYsIGksIGVwcztcblxuICBpZiAob3B0LnN0ZXApIHtcbiAgICAvLyBpZiBzdGVwIHNpemUgaXMgZXhwbGljaXRseSBnaXZlbiwgdXNlIHRoYXRcbiAgICBzdGVwID0gb3B0LnN0ZXA7XG4gIH0gZWxzZSBpZiAob3B0LnN0ZXBzKSB7XG4gICAgLy8gaWYgcHJvdmlkZWQsIGxpbWl0IGNob2ljZSB0byBhY2NlcHRhYmxlIHN0ZXAgc2l6ZXNcbiAgICBzdGVwID0gb3B0LnN0ZXBzW01hdGgubWluKFxuICAgICAgb3B0LnN0ZXBzLmxlbmd0aCAtIDEsXG4gICAgICBiaXNlY3Qob3B0LnN0ZXBzLCBzcGFuL21heGIsIDAsIG9wdC5zdGVwcy5sZW5ndGgpXG4gICAgKV07XG4gIH0gZWxzZSB7XG4gICAgLy8gZWxzZSB1c2Ugc3BhbiB0byBkZXRlcm1pbmUgc3RlcCBzaXplXG4gICAgbGV2ZWwgPSBNYXRoLmNlaWwoTWF0aC5sb2cobWF4YikgLyBsb2diKTtcbiAgICBtaW5zdGVwID0gb3B0Lm1pbnN0ZXAgfHwgMDtcbiAgICBzdGVwID0gTWF0aC5tYXgoXG4gICAgICBtaW5zdGVwLFxuICAgICAgTWF0aC5wb3coYmFzZSwgTWF0aC5yb3VuZChNYXRoLmxvZyhzcGFuKSAvIGxvZ2IpIC0gbGV2ZWwpXG4gICAgKTtcblxuICAgIC8vIGluY3JlYXNlIHN0ZXAgc2l6ZSBpZiB0b28gbWFueSBiaW5zXG4gICAgd2hpbGUgKE1hdGguY2VpbChzcGFuL3N0ZXApID4gbWF4YikgeyBzdGVwICo9IGJhc2U7IH1cblxuICAgIC8vIGRlY3JlYXNlIHN0ZXAgc2l6ZSBpZiBhbGxvd2VkXG4gICAgZm9yIChpPTA7IGk8ZGl2Lmxlbmd0aDsgKytpKSB7XG4gICAgICB2ID0gc3RlcCAvIGRpdltpXTtcbiAgICAgIGlmICh2ID49IG1pbnN0ZXAgJiYgc3BhbiAvIHYgPD0gbWF4Yikgc3RlcCA9IHY7XG4gICAgfVxuICB9XG5cbiAgLy8gdXBkYXRlIHByZWNpc2lvbiwgbWluIGFuZCBtYXhcbiAgdiA9IE1hdGgubG9nKHN0ZXApO1xuICBwcmVjaXNpb24gPSB2ID49IDAgPyAwIDogfn4oLXYgLyBsb2diKSArIDE7XG4gIGVwcyA9IE1hdGgucG93KGJhc2UsIC1wcmVjaXNpb24gLSAxKTtcbiAgbWluID0gTWF0aC5taW4obWluLCBNYXRoLmZsb29yKG1pbiAvIHN0ZXAgKyBlcHMpICogc3RlcCk7XG4gIG1heCA9IE1hdGguY2VpbChtYXggLyBzdGVwKSAqIHN0ZXA7XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogbWluLFxuICAgIHN0b3A6ICBtYXgsXG4gICAgc3RlcDogIHN0ZXAsXG4gICAgdW5pdDogIHtwcmVjaXNpb246IHByZWNpc2lvbn0sXG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGluZGV4OiBpbmRleFxuICB9O1xufVxuXG5mdW5jdGlvbiBiaXNlY3QoYSwgeCwgbG8sIGhpKSB7XG4gIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgaWYgKHV0aWwuY21wKGFbbWlkXSwgeCkgPCAwKSB7IGxvID0gbWlkICsgMTsgfVxuICAgIGVsc2UgeyBoaSA9IG1pZDsgfVxuICB9XG4gIHJldHVybiBsbztcbn1cblxuZnVuY3Rpb24gdmFsdWUodikge1xuICByZXR1cm4gdGhpcy5zdGVwICogTWF0aC5mbG9vcih2IC8gdGhpcy5zdGVwICsgRVBTSUxPTik7XG59XG5cbmZ1bmN0aW9uIGluZGV4KHYpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoKHYgLSB0aGlzLnN0YXJ0KSAvIHRoaXMuc3RlcCArIEVQU0lMT04pO1xufVxuXG5mdW5jdGlvbiBkYXRlX3ZhbHVlKHYpIHtcbiAgcmV0dXJuIHRoaXMudW5pdC5kYXRlKHZhbHVlLmNhbGwodGhpcywgdikpO1xufVxuXG5mdW5jdGlvbiBkYXRlX2luZGV4KHYpIHtcbiAgcmV0dXJuIGluZGV4LmNhbGwodGhpcywgdGhpcy51bml0LnVuaXQodikpO1xufVxuXG5iaW5zLmRhdGUgPSBmdW5jdGlvbihvcHQpIHtcbiAgaWYgKCFvcHQpIHsgdGhyb3cgRXJyb3IoXCJNaXNzaW5nIGRhdGUgYmlubmluZyBvcHRpb25zLlwiKTsgfVxuXG4gIC8vIGZpbmQgdGltZSBzdGVwLCB0aGVuIGJpblxuICB2YXIgdW5pdHMgPSBvcHQudXRjID8gdGltZS51dGMgOiB0aW1lLFxuICAgICAgZG1pbiA9IG9wdC5taW4sXG4gICAgICBkbWF4ID0gb3B0Lm1heCxcbiAgICAgIG1heGIgPSBvcHQubWF4YmlucyB8fCAyMCxcbiAgICAgIG1pbmIgPSBvcHQubWluYmlucyB8fCA0LFxuICAgICAgc3BhbiA9ICgrZG1heCkgLSAoK2RtaW4pLFxuICAgICAgdW5pdCA9IG9wdC51bml0ID8gdW5pdHNbb3B0LnVuaXRdIDogdW5pdHMuZmluZChzcGFuLCBtaW5iLCBtYXhiKSxcbiAgICAgIHNwZWMgPSBiaW5zKHtcbiAgICAgICAgbWluOiAgICAgdW5pdC5taW4gIT0gbnVsbCA/IHVuaXQubWluIDogdW5pdC51bml0KGRtaW4pLFxuICAgICAgICBtYXg6ICAgICB1bml0Lm1heCAhPSBudWxsID8gdW5pdC5tYXggOiB1bml0LnVuaXQoZG1heCksXG4gICAgICAgIG1heGJpbnM6IG1heGIsXG4gICAgICAgIG1pbnN0ZXA6IHVuaXQubWluc3RlcCxcbiAgICAgICAgc3RlcHM6ICAgdW5pdC5zdGVwXG4gICAgICB9KTtcblxuICBzcGVjLnVuaXQgPSB1bml0O1xuICBzcGVjLmluZGV4ID0gZGF0ZV9pbmRleDtcbiAgaWYgKCFvcHQucmF3KSBzcGVjLnZhbHVlID0gZGF0ZV92YWx1ZTtcbiAgcmV0dXJuIHNwZWM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbnM7XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICAgIGdlbiA9IG1vZHVsZS5leHBvcnRzO1xuXG5nZW4ucmVwZWF0ID0gZnVuY3Rpb24odmFsLCBuKSB7XG4gIHZhciBhID0gQXJyYXkobiksIGk7XG4gIGZvciAoaT0wOyBpPG47ICsraSkgYVtpXSA9IHZhbDtcbiAgcmV0dXJuIGE7XG59O1xuXG5nZW4uemVyb3MgPSBmdW5jdGlvbihuKSB7XG4gIHJldHVybiBnZW4ucmVwZWF0KDAsIG4pO1xufTtcblxuZ2VuLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBzdG9wID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICB9XG4gIGlmICgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXAgPT0gSW5maW5pdHkpIHRocm93IG5ldyBFcnJvcignSW5maW5pdGUgcmFuZ2UnKTtcbiAgdmFyIHJhbmdlID0gW10sIGkgPSAtMSwgajtcbiAgaWYgKHN0ZXAgPCAwKSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpID4gc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgZWxzZSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpIDwgc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgcmV0dXJuIHJhbmdlO1xufTtcblxuZ2VuLnJhbmRvbSA9IHt9O1xuXG5nZW4ucmFuZG9tLnVuaWZvcm0gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICBpZiAobWF4ID09PSB1bmRlZmluZWQpIHtcbiAgICBtYXggPSBtaW4gPT09IHVuZGVmaW5lZCA/IDEgOiBtaW47XG4gICAgbWluID0gMDtcbiAgfVxuICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgdmFyIGYgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbWluICsgZCAqIE1hdGgucmFuZG9tKCk7XG4gIH07XG4gIGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTtcbiAgfTtcbiAgZi5wZGYgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuICh4ID49IG1pbiAmJiB4IDw9IG1heCkgPyAxL2QgOiAwO1xuICB9O1xuICBmLmNkZiA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4geCA8IG1pbiA/IDAgOiB4ID4gbWF4ID8gMSA6ICh4IC0gbWluKSAvIGQ7XG4gIH07XG4gIGYuaWNkZiA9IGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gKHAgPj0gMCAmJiBwIDw9IDEpID8gbWluICsgcCpkIDogTmFOO1xuICB9O1xuICByZXR1cm4gZjtcbn07XG5cbmdlbi5yYW5kb20uaW50ZWdlciA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGIgPT09IHVuZGVmaW5lZCkge1xuICAgIGIgPSBhO1xuICAgIGEgPSAwO1xuICB9XG4gIHZhciBkID0gYiAtIGE7XG4gIHZhciBmID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGEgKyBNYXRoLmZsb29yKGQgKiBNYXRoLnJhbmRvbSgpKTtcbiAgfTtcbiAgZi5zYW1wbGVzID0gZnVuY3Rpb24obikge1xuICAgIHJldHVybiBnZW4uemVyb3MobikubWFwKGYpO1xuICB9O1xuICBmLnBkZiA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gKHggPT09IE1hdGguZmxvb3IoeCkgJiYgeCA+PSBhICYmIHggPCBiKSA/IDEvZCA6IDA7XG4gIH07XG4gIGYuY2RmID0gZnVuY3Rpb24oeCkge1xuICAgIHZhciB2ID0gTWF0aC5mbG9vcih4KTtcbiAgICByZXR1cm4gdiA8IGEgPyAwIDogdiA+PSBiID8gMSA6ICh2IC0gYSArIDEpIC8gZDtcbiAgfTtcbiAgZi5pY2RmID0gZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAocCA+PSAwICYmIHAgPD0gMSkgPyBhIC0gMSArIE1hdGguZmxvb3IocCpkKSA6IE5hTjtcbiAgfTtcbiAgcmV0dXJuIGY7XG59O1xuXG5nZW4ucmFuZG9tLm5vcm1hbCA9IGZ1bmN0aW9uKG1lYW4sIHN0ZGV2KSB7XG4gIG1lYW4gPSBtZWFuIHx8IDA7XG4gIHN0ZGV2ID0gc3RkZXYgfHwgMTtcbiAgdmFyIG5leHQ7XG4gIHZhciBmID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHggPSAwLCB5ID0gMCwgcmRzLCBjO1xuICAgIGlmIChuZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHggPSBuZXh0O1xuICAgICAgbmV4dCA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgICBkbyB7XG4gICAgICB4ID0gTWF0aC5yYW5kb20oKSoyLTE7XG4gICAgICB5ID0gTWF0aC5yYW5kb20oKSoyLTE7XG4gICAgICByZHMgPSB4KnggKyB5Knk7XG4gICAgfSB3aGlsZSAocmRzID09PSAwIHx8IHJkcyA+IDEpO1xuICAgIGMgPSBNYXRoLnNxcnQoLTIqTWF0aC5sb2cocmRzKS9yZHMpOyAvLyBCb3gtTXVsbGVyIHRyYW5zZm9ybVxuICAgIG5leHQgPSBtZWFuICsgeSpjKnN0ZGV2O1xuICAgIHJldHVybiBtZWFuICsgeCpjKnN0ZGV2O1xuICB9O1xuICBmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7XG4gIH07XG4gIGYucGRmID0gZnVuY3Rpb24oeCkge1xuICAgIHZhciBleHAgPSBNYXRoLmV4cChNYXRoLnBvdyh4LW1lYW4sIDIpIC8gKC0yICogTWF0aC5wb3coc3RkZXYsIDIpKSk7XG4gICAgcmV0dXJuICgxIC8gKHN0ZGV2ICogTWF0aC5zcXJ0KDIqTWF0aC5QSSkpKSAqIGV4cDtcbiAgfTtcbiAgZi5jZGYgPSBmdW5jdGlvbih4KSB7XG4gICAgLy8gQXBwcm94aW1hdGlvbiBmcm9tIFdlc3QgKDIwMDkpXG4gICAgLy8gQmV0dGVyIEFwcHJveGltYXRpb25zIHRvIEN1bXVsYXRpdmUgTm9ybWFsIEZ1bmN0aW9uc1xuICAgIHZhciBjZCxcbiAgICAgICAgeiA9ICh4IC0gbWVhbikgLyBzdGRldixcbiAgICAgICAgWiA9IE1hdGguYWJzKHopO1xuICAgIGlmIChaID4gMzcpIHtcbiAgICAgIGNkID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN1bSwgZXhwID0gTWF0aC5leHAoLVoqWi8yKTtcbiAgICAgIGlmIChaIDwgNy4wNzEwNjc4MTE4NjU0Nykge1xuICAgICAgICBzdW0gPSAzLjUyNjI0OTY1OTk4OTExZS0wMiAqIFogKyAwLjcwMDM4MzA2NDQ0MzY4ODtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDYuMzczOTYyMjAzNTMxNjU7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyAzMy45MTI4NjYwNzgzODM7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyAxMTIuMDc5MjkxNDk3ODcxO1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgMjIxLjIxMzU5NjE2OTkzMTtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDIyMC4yMDY4Njc5MTIzNzY7XG4gICAgICAgIGNkID0gZXhwICogc3VtO1xuICAgICAgICBzdW0gPSA4LjgzODgzNDc2NDgzMTg0ZS0wMiAqIFogKyAxLjc1NTY2NzE2MzE4MjY0O1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgMTYuMDY0MTc3NTc5MjA3O1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgODYuNzgwNzMyMjAyOTQ2MTtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDI5Ni41NjQyNDg3Nzk2NzQ7XG4gICAgICAgIHN1bSA9IHN1bSAqIFogKyA2MzcuMzMzNjMzMzc4ODMxO1xuICAgICAgICBzdW0gPSBzdW0gKiBaICsgNzkzLjgyNjUxMjUxOTk0ODtcbiAgICAgICAgc3VtID0gc3VtICogWiArIDQ0MC40MTM3MzU4MjQ3NTI7XG4gICAgICAgIGNkID0gY2QgLyBzdW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdW0gPSBaICsgMC42NTtcbiAgICAgICAgc3VtID0gWiArIDQgLyBzdW07XG4gICAgICAgIHN1bSA9IFogKyAzIC8gc3VtO1xuICAgICAgICBzdW0gPSBaICsgMiAvIHN1bTtcbiAgICAgICAgc3VtID0gWiArIDEgLyBzdW07XG4gICAgICAgIGNkID0gZXhwIC8gc3VtIC8gMi41MDY2MjgyNzQ2MzE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB6ID4gMCA/IDEgLSBjZCA6IGNkO1xuICB9O1xuICBmLmljZGYgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gQXBwcm94aW1hdGlvbiBvZiBQcm9iaXQgZnVuY3Rpb24gdXNpbmcgaW52ZXJzZSBlcnJvciBmdW5jdGlvbi5cbiAgICBpZiAocCA8PSAwIHx8IHAgPj0gMSkgcmV0dXJuIE5hTjtcbiAgICB2YXIgeCA9IDIqcCAtIDEsXG4gICAgICAgIHYgPSAoOCAqIChNYXRoLlBJIC0gMykpIC8gKDMgKiBNYXRoLlBJICogKDQtTWF0aC5QSSkpLFxuICAgICAgICBhID0gKDIgLyAoTWF0aC5QSSp2KSkgKyAoTWF0aC5sb2coMSAtIE1hdGgucG93KHgsMikpIC8gMiksXG4gICAgICAgIGIgPSBNYXRoLmxvZygxIC0gKHgqeCkpIC8gdixcbiAgICAgICAgcyA9ICh4ID4gMCA/IDEgOiAtMSkgKiBNYXRoLnNxcnQoTWF0aC5zcXJ0KChhKmEpIC0gYikgLSBhKTtcbiAgICByZXR1cm4gbWVhbiArIHN0ZGV2ICogTWF0aC5TUVJUMiAqIHM7XG4gIH07XG4gIHJldHVybiBmO1xufTtcblxuZ2VuLnJhbmRvbS5ib290c3RyYXAgPSBmdW5jdGlvbihkb21haW4sIHNtb290aCkge1xuICAvLyBHZW5lcmF0ZXMgYSBib290c3RyYXAgc2FtcGxlIGZyb20gYSBzZXQgb2Ygb2JzZXJ2YXRpb25zLlxuICAvLyBTbW9vdGggYm9vdHN0cmFwcGluZyBhZGRzIHJhbmRvbSB6ZXJvLWNlbnRlcmVkIG5vaXNlIHRvIHRoZSBzYW1wbGVzLlxuICB2YXIgdmFsID0gZG9tYWluLmZpbHRlcih1dGlsLmlzVmFsaWQpLFxuICAgICAgbGVuID0gdmFsLmxlbmd0aCxcbiAgICAgIGVyciA9IHNtb290aCA/IGdlbi5yYW5kb20ubm9ybWFsKDAsIHNtb290aCkgOiBudWxsO1xuICB2YXIgZiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWxbfn4oTWF0aC5yYW5kb20oKSpsZW4pXSArIChlcnIgPyBlcnIoKSA6IDApO1xuICB9O1xuICBmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7XG4gIH07XG4gIHJldHVybiBmO1xufTsiLCJ2YXIgZDNfdGltZSA9IHJlcXVpcmUoJ2QzLXRpbWUnKTtcblxudmFyIHRlbXBEYXRlID0gbmV3IERhdGUoKSxcbiAgICBiYXNlRGF0ZSA9IG5ldyBEYXRlKDAsIDAsIDEpLnNldEZ1bGxZZWFyKDApLCAvLyBKYW4gMSwgMCBBRFxuICAgIHV0Y0Jhc2VEYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoMCwgMCwgMSkpLnNldFVUQ0Z1bGxZZWFyKDApO1xuXG5mdW5jdGlvbiBkYXRlKGQpIHtcbiAgcmV0dXJuICh0ZW1wRGF0ZS5zZXRUaW1lKCtkKSwgdGVtcERhdGUpO1xufVxuXG4vLyBjcmVhdGUgYSB0aW1lIHVuaXQgZW50cnlcbmZ1bmN0aW9uIGVudHJ5KHR5cGUsIGRhdGUsIHVuaXQsIHN0ZXAsIG1pbiwgbWF4KSB7XG4gIHZhciBlID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0ZTogZGF0ZSxcbiAgICB1bml0OiB1bml0XG4gIH07XG4gIGlmIChzdGVwKSB7XG4gICAgZS5zdGVwID0gc3RlcDtcbiAgfSBlbHNlIHtcbiAgICBlLm1pbnN0ZXAgPSAxO1xuICB9XG4gIGlmIChtaW4gIT0gbnVsbCkgZS5taW4gPSBtaW47XG4gIGlmIChtYXggIT0gbnVsbCkgZS5tYXggPSBtYXg7XG4gIHJldHVybiBlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGUodHlwZSwgdW5pdCwgYmFzZSwgc3RlcCwgbWluLCBtYXgpIHtcbiAgcmV0dXJuIGVudHJ5KHR5cGUsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gdW5pdC5vZmZzZXQoYmFzZSwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gdW5pdC5jb3VudChiYXNlLCBkKTsgfSxcbiAgICBzdGVwLCBtaW4sIG1heCk7XG59XG5cbnZhciBsb2NhbGUgPSBbXG4gIGNyZWF0ZSgnc2Vjb25kJywgZDNfdGltZS5zZWNvbmQsIGJhc2VEYXRlKSxcbiAgY3JlYXRlKCdtaW51dGUnLCBkM190aW1lLm1pbnV0ZSwgYmFzZURhdGUpLFxuICBjcmVhdGUoJ2hvdXInLCAgIGQzX3RpbWUuaG91ciwgICBiYXNlRGF0ZSksXG4gIGNyZWF0ZSgnZGF5JywgICAgZDNfdGltZS5kYXksICAgIGJhc2VEYXRlLCBbMSwgN10pLFxuICBjcmVhdGUoJ21vbnRoJywgIGQzX3RpbWUubW9udGgsICBiYXNlRGF0ZSwgWzEsIDMsIDZdKSxcbiAgY3JlYXRlKCd5ZWFyJywgICBkM190aW1lLnllYXIsICAgYmFzZURhdGUpLFxuXG4gIC8vIHBlcmlvZGljIHVuaXRzXG4gIGVudHJ5KCdzZWNvbmRzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCAxLCAwLCAwLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFNlY29uZHMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnbWludXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgMSwgMCwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRNaW51dGVzKCk7IH0sXG4gICAgbnVsbCwgMCwgNTlcbiAgKSxcbiAgZW50cnkoJ2hvdXJzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCAxLCBkKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldEhvdXJzKCk7IH0sXG4gICAgbnVsbCwgMCwgMjNcbiAgKSxcbiAgZW50cnkoJ3dlZWtkYXlzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCAwLCA0K2QpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0RGF5KCk7IH0sXG4gICAgWzFdLCAwLCA2XG4gICksXG4gIGVudHJ5KCdkYXRlcycsXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gbmV3IERhdGUoMTk3MCwgMCwgZCk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXREYXRlKCk7IH0sXG4gICAgWzFdLCAxLCAzMVxuICApLFxuICBlbnRyeSgnbW9udGhzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZSgxOTcwLCBkICUgMTIsIDEpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0TW9udGgoKTsgfSxcbiAgICBbMV0sIDAsIDExXG4gIClcbl07XG5cbnZhciB1dGMgPSBbXG4gIGNyZWF0ZSgnc2Vjb25kJywgZDNfdGltZS51dGNTZWNvbmQsIHV0Y0Jhc2VEYXRlKSxcbiAgY3JlYXRlKCdtaW51dGUnLCBkM190aW1lLnV0Y01pbnV0ZSwgdXRjQmFzZURhdGUpLFxuICBjcmVhdGUoJ2hvdXInLCAgIGQzX3RpbWUudXRjSG91ciwgICB1dGNCYXNlRGF0ZSksXG4gIGNyZWF0ZSgnZGF5JywgICAgZDNfdGltZS51dGNEYXksICAgIHV0Y0Jhc2VEYXRlLCBbMSwgN10pLFxuICBjcmVhdGUoJ21vbnRoJywgIGQzX3RpbWUudXRjTW9udGgsICB1dGNCYXNlRGF0ZSwgWzEsIDMsIDZdKSxcbiAgY3JlYXRlKCd5ZWFyJywgICBkM190aW1lLnV0Y1llYXIsICAgdXRjQmFzZURhdGUpLFxuXG4gIC8vIHBlcmlvZGljIHVuaXRzXG4gIGVudHJ5KCdzZWNvbmRzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCAxLCAwLCAwLCBkKSk7IH0sXG4gICAgZnVuY3Rpb24oZCkgeyByZXR1cm4gZGF0ZShkKS5nZXRVVENTZWNvbmRzKCk7IH0sXG4gICAgbnVsbCwgMCwgNTlcbiAgKSxcbiAgZW50cnkoJ21pbnV0ZXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDEsIDAsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ01pbnV0ZXMoKTsgfSxcbiAgICBudWxsLCAwLCA1OVxuICApLFxuICBlbnRyeSgnaG91cnMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDEsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ0hvdXJzKCk7IH0sXG4gICAgbnVsbCwgMCwgMjNcbiAgKSxcbiAgZW50cnkoJ3dlZWtkYXlzJyxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCA0K2QpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ0RheSgpOyB9LFxuICAgIFsxXSwgMCwgNlxuICApLFxuICBlbnRyeSgnZGF0ZXMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIGQpKTsgfSxcbiAgICBmdW5jdGlvbihkKSB7IHJldHVybiBkYXRlKGQpLmdldFVUQ0RhdGUoKTsgfSxcbiAgICBbMV0sIDEsIDMxXG4gICksXG4gIGVudHJ5KCdtb250aHMnLFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIGQgJSAxMiwgMSkpOyB9LFxuICAgIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRhdGUoZCkuZ2V0VVRDTW9udGgoKTsgfSxcbiAgICBbMV0sIDAsIDExXG4gIClcbl07XG5cbnZhciBTVEVQUyA9IFtcbiAgWzMxNTM2ZTYsIDVdLCAgLy8gMS15ZWFyXG4gIFs3Nzc2ZTYsIDRdLCAgIC8vIDMtbW9udGhcbiAgWzI1OTJlNiwgNF0sICAgLy8gMS1tb250aFxuICBbMTIwOTZlNSwgM10sICAvLyAyLXdlZWtcbiAgWzYwNDhlNSwgM10sICAgLy8gMS13ZWVrXG4gIFsxNzI4ZTUsIDNdLCAgIC8vIDItZGF5XG4gIFs4NjRlNSwgM10sICAgIC8vIDEtZGF5XG4gIFs0MzJlNSwgMl0sICAgIC8vIDEyLWhvdXJcbiAgWzIxNmU1LCAyXSwgICAgLy8gNi1ob3VyXG4gIFsxMDhlNSwgMl0sICAgIC8vIDMtaG91clxuICBbMzZlNSwgMl0sICAgICAvLyAxLWhvdXJcbiAgWzE4ZTUsIDFdLCAgICAgLy8gMzAtbWludXRlXG4gIFs5ZTUsIDFdLCAgICAgIC8vIDE1LW1pbnV0ZVxuICBbM2U1LCAxXSwgICAgICAvLyA1LW1pbnV0ZVxuICBbNmU0LCAxXSwgICAgICAvLyAxLW1pbnV0ZVxuICBbM2U0LCAwXSwgICAgICAvLyAzMC1zZWNvbmRcbiAgWzE1ZTMsIDBdLCAgICAgLy8gMTUtc2Vjb25kXG4gIFs1ZTMsIDBdLCAgICAgIC8vIDUtc2Vjb25kXG4gIFsxZTMsIDBdICAgICAgIC8vIDEtc2Vjb25kXG5dO1xuXG5mdW5jdGlvbiBmaW5kKHVuaXRzLCBzcGFuLCBtaW5iLCBtYXhiKSB7XG4gIHZhciBzdGVwID0gU1RFUFNbMF0sIGksIG4sIGJpbnM7XG5cbiAgZm9yIChpPTEsIG49U1RFUFMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHN0ZXAgPSBTVEVQU1tpXTtcbiAgICBpZiAoc3BhbiA+IHN0ZXBbMF0pIHtcbiAgICAgIGJpbnMgPSBzcGFuIC8gc3RlcFswXTtcbiAgICAgIGlmIChiaW5zID4gbWF4Yikge1xuICAgICAgICByZXR1cm4gdW5pdHNbU1RFUFNbaS0xXVsxXV07XG4gICAgICB9XG4gICAgICBpZiAoYmlucyA+PSBtaW5iKSB7XG4gICAgICAgIHJldHVybiB1bml0c1tzdGVwWzFdXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuaXRzW1NURVBTW24tMV1bMV1dO1xufVxuXG5mdW5jdGlvbiB0b1VuaXRNYXAodW5pdHMpIHtcbiAgdmFyIG1hcCA9IHt9LCBpLCBuO1xuICBmb3IgKGk9MCwgbj11bml0cy5sZW5ndGg7IGk8bjsgKytpKSB7XG4gICAgbWFwW3VuaXRzW2ldLnR5cGVdID0gdW5pdHNbaV07XG4gIH1cbiAgbWFwLmZpbmQgPSBmdW5jdGlvbihzcGFuLCBtaW5iLCBtYXhiKSB7XG4gICAgcmV0dXJuIGZpbmQodW5pdHMsIHNwYW4sIG1pbmIsIG1heGIpO1xuICB9O1xuICByZXR1cm4gbWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvVW5pdE1hcChsb2NhbGUpO1xubW9kdWxlLmV4cG9ydHMudXRjID0gdG9Vbml0TWFwKHV0Yyk7IiwidmFyIHUgPSBtb2R1bGUuZXhwb3J0cztcblxuLy8gdXRpbGl0eSBmdW5jdGlvbnNcblxudmFyIEZOQU1FID0gJ19fbmFtZV9fJztcblxudS5uYW1lZGZ1bmMgPSBmdW5jdGlvbihuYW1lLCBmKSB7IHJldHVybiAoZltGTkFNRV0gPSBuYW1lLCBmKTsgfTtcblxudS5uYW1lID0gZnVuY3Rpb24oZikgeyByZXR1cm4gZj09bnVsbCA/IG51bGwgOiBmW0ZOQU1FXTsgfTtcblxudS5pZGVudGl0eSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHg7IH07XG5cbnUudHJ1ZSA9IHUubmFtZWRmdW5jKCd0cnVlJywgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9KTtcblxudS5mYWxzZSA9IHUubmFtZWRmdW5jKCdmYWxzZScsIGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH0pO1xuXG51LmR1cGxpY2F0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn07XG5cbnUuZXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShhKSA9PT0gSlNPTi5zdHJpbmdpZnkoYik7XG59O1xuXG51LmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICBmb3IgKHZhciB4LCBuYW1lLCBpPTEsIGxlbj1hcmd1bWVudHMubGVuZ3RoOyBpPGxlbjsgKytpKSB7XG4gICAgeCA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKG5hbWUgaW4geCkgeyBvYmpbbmFtZV0gPSB4W25hbWVdOyB9XG4gIH1cbiAgcmV0dXJuIG9iajtcbn07XG5cbnUubGVuZ3RoID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4geCAhPSBudWxsICYmIHgubGVuZ3RoICE9IG51bGwgPyB4Lmxlbmd0aCA6IG51bGw7XG59O1xuXG51LmtleXMgPSBmdW5jdGlvbih4KSB7XG4gIHZhciBrZXlzID0gW10sIGs7XG4gIGZvciAoayBpbiB4KSBrZXlzLnB1c2goayk7XG4gIHJldHVybiBrZXlzO1xufTtcblxudS52YWxzID0gZnVuY3Rpb24oeCkge1xuICB2YXIgdmFscyA9IFtdLCBrO1xuICBmb3IgKGsgaW4geCkgdmFscy5wdXNoKHhba10pO1xuICByZXR1cm4gdmFscztcbn07XG5cbnUudG9NYXAgPSBmdW5jdGlvbihsaXN0LCBmKSB7XG4gIHJldHVybiAoZiA9IHUuJChmKSkgP1xuICAgIGxpc3QucmVkdWNlKGZ1bmN0aW9uKG9iaiwgeCkgeyByZXR1cm4gKG9ialtmKHgpXSA9IDEsIG9iaik7IH0sIHt9KSA6XG4gICAgbGlzdC5yZWR1Y2UoZnVuY3Rpb24ob2JqLCB4KSB7IHJldHVybiAob2JqW3hdID0gMSwgb2JqKTsgfSwge30pO1xufTtcblxudS5rZXlzdHIgPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgLy8gdXNlIHRvIGVuc3VyZSBjb25zaXN0ZW50IGtleSBnZW5lcmF0aW9uIGFjcm9zcyBtb2R1bGVzXG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aDtcbiAgaWYgKCFuKSByZXR1cm4gJyc7XG4gIGZvciAodmFyIHM9U3RyaW5nKHZhbHVlc1swXSksIGk9MTsgaTxuOyArK2kpIHtcbiAgICBzICs9ICd8JyArIFN0cmluZyh2YWx1ZXNbaV0pO1xuICB9XG4gIHJldHVybiBzO1xufTtcblxuLy8gdHlwZSBjaGVja2luZyBmdW5jdGlvbnNcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxudS5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn07XG5cbnUuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcblxudS5pc1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcblxudS5pc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbnUuaXNOdW1iZXIgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgTnVtYmVyXSc7XG59O1xuXG51LmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEJvb2xlYW5dJztcbn07XG5cbnUuaXNEYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcbn07XG5cbnUuaXNWYWxpZCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09PSBvYmo7XG59O1xuXG51LmlzQnVmZmVyID0gKHR5cGVvZiBCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgQnVmZmVyLmlzQnVmZmVyKSB8fCB1LmZhbHNlO1xuXG4vLyB0eXBlIGNvZXJjaW9uIGZ1bmN0aW9uc1xuXG51Lm51bWJlciA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMgPT0gbnVsbCB8fCBzID09PSAnJyA/IG51bGwgOiArcztcbn07XG5cbnUuYm9vbGVhbiA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMgPT0gbnVsbCB8fCBzID09PSAnJyA/IG51bGwgOiBzPT09J2ZhbHNlJyA/IGZhbHNlIDogISFzO1xufTtcblxuLy8gcGFyc2UgYSBkYXRlIHdpdGggb3B0aW9uYWwgZDMudGltZS1mb3JtYXQgZm9ybWF0XG51LmRhdGUgPSBmdW5jdGlvbihzLCBmb3JtYXQpIHtcbiAgdmFyIGQgPSBmb3JtYXQgPyBmb3JtYXQgOiBEYXRlO1xuICByZXR1cm4gcyA9PSBudWxsIHx8IHMgPT09ICcnID8gbnVsbCA6IGQucGFyc2Uocyk7XG59O1xuXG51LmFycmF5ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4geCAhPSBudWxsID8gKHUuaXNBcnJheSh4KSA/IHggOiBbeF0pIDogW107XG59O1xuXG51LnN0ciA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHUuaXNBcnJheSh4KSA/ICdbJyArIHgubWFwKHUuc3RyKSArICddJ1xuICAgIDogdS5pc09iamVjdCh4KSA/IEpTT04uc3RyaW5naWZ5KHgpXG4gICAgOiB1LmlzU3RyaW5nKHgpID8gKCdcXCcnK3V0aWxfZXNjYXBlX3N0cih4KSsnXFwnJykgOiB4O1xufTtcblxudmFyIGVzY2FwZV9zdHJfcmUgPSAvKF58W15cXFxcXSknL2c7XG5cbmZ1bmN0aW9uIHV0aWxfZXNjYXBlX3N0cih4KSB7XG4gIHJldHVybiB4LnJlcGxhY2UoZXNjYXBlX3N0cl9yZSwgJyQxXFxcXFxcJycpO1xufVxuXG4vLyBkYXRhIGFjY2VzcyBmdW5jdGlvbnNcblxudmFyIGZpZWxkX3JlID0gL1xcWyguKj8pXFxdfFteLlxcW10rL2c7XG5cbnUuZmllbGQgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBTdHJpbmcoZikubWF0Y2goZmllbGRfcmUpLm1hcChmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIGRbMF0gIT09ICdbJyA/IGQgOlxuICAgICAgZFsxXSAhPT0gXCInXCIgJiYgZFsxXSAhPT0gJ1wiJyA/IGQuc2xpY2UoMSwgLTEpIDpcbiAgICAgIGQuc2xpY2UoMiwgLTIpLnJlcGxhY2UoL1xcXFwoW1wiJ10pL2csICckMScpO1xuICB9KTtcbn07XG5cbnUuYWNjZXNzb3IgPSBmdW5jdGlvbihmKSB7XG4gIHZhciBzO1xuICByZXR1cm4gZj09bnVsbCB8fCB1LmlzRnVuY3Rpb24oZikgPyBmIDpcbiAgICB1Lm5hbWVkZnVuYyhmLCAocyA9IHUuZmllbGQoZikpLmxlbmd0aCA+IDEgP1xuICAgICAgZnVuY3Rpb24oeCkgeyByZXR1cm4gcy5yZWR1Y2UoZnVuY3Rpb24oeCxmKSB7IHJldHVybiB4W2ZdOyB9LCB4KTsgfSA6XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiB4W2ZdOyB9XG4gICAgKTtcbn07XG5cbi8vIHNob3J0LWN1dCBmb3IgYWNjZXNzb3JcbnUuJCA9IHUuYWNjZXNzb3I7XG5cbnUubXV0YXRvciA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIHM7XG4gIHJldHVybiB1LmlzU3RyaW5nKGYpICYmIChzPXUuZmllbGQoZikpLmxlbmd0aCA+IDEgP1xuICAgIGZ1bmN0aW9uKHgsIHYpIHtcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzLmxlbmd0aC0xOyArK2kpIHggPSB4W3NbaV1dO1xuICAgICAgeFtzW2ldXSA9IHY7XG4gICAgfSA6XG4gICAgZnVuY3Rpb24oeCwgdikgeyB4W2ZdID0gdjsgfTtcbn07XG5cblxudS4kZnVuYyA9IGZ1bmN0aW9uKG5hbWUsIG9wKSB7XG4gIHJldHVybiBmdW5jdGlvbihmKSB7XG4gICAgZiA9IHUuJChmKSB8fCB1LmlkZW50aXR5O1xuICAgIHZhciBuID0gbmFtZSArICh1Lm5hbWUoZikgPyAnXycrdS5uYW1lKGYpIDogJycpO1xuICAgIHJldHVybiB1Lm5hbWVkZnVuYyhuLCBmdW5jdGlvbihkKSB7IHJldHVybiBvcChmKGQpKTsgfSk7XG4gIH07XG59O1xuXG51LiR2YWxpZCAgPSB1LiRmdW5jKCd2YWxpZCcsIHUuaXNWYWxpZCk7XG51LiRsZW5ndGggPSB1LiRmdW5jKCdsZW5ndGgnLCB1Lmxlbmd0aCk7XG5cbnUuJGluID0gZnVuY3Rpb24oZiwgdmFsdWVzKSB7XG4gIGYgPSB1LiQoZik7XG4gIHZhciBtYXAgPSB1LmlzQXJyYXkodmFsdWVzKSA/IHUudG9NYXAodmFsdWVzKSA6IHZhbHVlcztcbiAgcmV0dXJuIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICEhbWFwW2YoZCldOyB9O1xufTtcblxuLy8gY29tcGFyaXNvbiAvIHNvcnRpbmcgZnVuY3Rpb25zXG5cbnUuY29tcGFyYXRvciA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgdmFyIHNpZ24gPSBbXTtcbiAgaWYgKHNvcnQgPT09IHVuZGVmaW5lZCkgc29ydCA9IFtdO1xuICBzb3J0ID0gdS5hcnJheShzb3J0KS5tYXAoZnVuY3Rpb24oZikge1xuICAgIHZhciBzID0gMTtcbiAgICBpZiAgICAgIChmWzBdID09PSAnLScpIHsgcyA9IC0xOyBmID0gZi5zbGljZSgxKTsgfVxuICAgIGVsc2UgaWYgKGZbMF0gPT09ICcrJykgeyBzID0gKzE7IGYgPSBmLnNsaWNlKDEpOyB9XG4gICAgc2lnbi5wdXNoKHMpO1xuICAgIHJldHVybiB1LmFjY2Vzc29yKGYpO1xuICB9KTtcbiAgcmV0dXJuIGZ1bmN0aW9uKGEsYikge1xuICAgIHZhciBpLCBuLCBmLCB4LCB5O1xuICAgIGZvciAoaT0wLCBuPXNvcnQubGVuZ3RoOyBpPG47ICsraSkge1xuICAgICAgZiA9IHNvcnRbaV07IHggPSBmKGEpOyB5ID0gZihiKTtcbiAgICAgIGlmICh4IDwgeSkgcmV0dXJuIC0xICogc2lnbltpXTtcbiAgICAgIGlmICh4ID4geSkgcmV0dXJuIHNpZ25baV07XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9O1xufTtcblxudS5jbXAgPSBmdW5jdGlvbihhLCBiKSB7XG4gIGlmIChhIDwgYikge1xuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmIChhID4gYikge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2UgaWYgKGEgPj0gYikge1xuICAgIHJldHVybiAwO1xuICB9IGVsc2UgaWYgKGEgPT09IG51bGwpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSBpZiAoYiA9PT0gbnVsbCkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiBOYU47XG59O1xuXG51Lm51bWNtcCA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEgLSBiOyB9O1xuXG51LnN0YWJsZXNvcnQgPSBmdW5jdGlvbihhcnJheSwgc29ydEJ5LCBrZXlGbikge1xuICB2YXIgaW5kaWNlcyA9IGFycmF5LnJlZHVjZShmdW5jdGlvbihpZHgsIHYsIGkpIHtcbiAgICByZXR1cm4gKGlkeFtrZXlGbih2KV0gPSBpLCBpZHgpO1xuICB9LCB7fSk7XG5cbiAgYXJyYXkuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHNhID0gc29ydEJ5KGEpLFxuICAgICAgICBzYiA9IHNvcnRCeShiKTtcbiAgICByZXR1cm4gc2EgPCBzYiA/IC0xIDogc2EgPiBzYiA/IDFcbiAgICAgICAgIDogKGluZGljZXNba2V5Rm4oYSldIC0gaW5kaWNlc1trZXlGbihiKV0pO1xuICB9KTtcblxuICByZXR1cm4gYXJyYXk7XG59O1xuXG5cbi8vIHN0cmluZyBmdW5jdGlvbnNcblxudS5wYWQgPSBmdW5jdGlvbihzLCBsZW5ndGgsIHBvcywgcGFkY2hhcikge1xuICBwYWRjaGFyID0gcGFkY2hhciB8fCBcIiBcIjtcbiAgdmFyIGQgPSBsZW5ndGggLSBzLmxlbmd0aDtcbiAgaWYgKGQgPD0gMCkgcmV0dXJuIHM7XG4gIHN3aXRjaCAocG9zKSB7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICByZXR1cm4gc3RycmVwKGQsIHBhZGNoYXIpICsgcztcbiAgICBjYXNlICdtaWRkbGUnOlxuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICByZXR1cm4gc3RycmVwKE1hdGguZmxvb3IoZC8yKSwgcGFkY2hhcikgK1xuICAgICAgICAgcyArIHN0cnJlcChNYXRoLmNlaWwoZC8yKSwgcGFkY2hhcik7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzICsgc3RycmVwKGQsIHBhZGNoYXIpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBzdHJyZXAobiwgc3RyKSB7XG4gIHZhciBzID0gXCJcIiwgaTtcbiAgZm9yIChpPTA7IGk8bjsgKytpKSBzICs9IHN0cjtcbiAgcmV0dXJuIHM7XG59XG5cbnUudHJ1bmNhdGUgPSBmdW5jdGlvbihzLCBsZW5ndGgsIHBvcywgd29yZCwgZWxsaXBzaXMpIHtcbiAgdmFyIGxlbiA9IHMubGVuZ3RoO1xuICBpZiAobGVuIDw9IGxlbmd0aCkgcmV0dXJuIHM7XG4gIGVsbGlwc2lzID0gZWxsaXBzaXMgIT09IHVuZGVmaW5lZCA/IFN0cmluZyhlbGxpcHNpcykgOiAnXFx1MjAyNic7XG4gIHZhciBsID0gTWF0aC5tYXgoMCwgbGVuZ3RoIC0gZWxsaXBzaXMubGVuZ3RoKTtcblxuICBzd2l0Y2ggKHBvcykge1xuICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgcmV0dXJuIGVsbGlwc2lzICsgKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwsMSkgOiBzLnNsaWNlKGxlbi1sKSk7XG4gICAgY2FzZSAnbWlkZGxlJzpcbiAgICBjYXNlICdjZW50ZXInOlxuICAgICAgdmFyIGwxID0gTWF0aC5jZWlsKGwvMiksIGwyID0gTWF0aC5mbG9vcihsLzIpO1xuICAgICAgcmV0dXJuICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsMSkgOiBzLnNsaWNlKDAsbDEpKSArXG4gICAgICAgIGVsbGlwc2lzICsgKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwyLDEpIDogcy5zbGljZShsZW4tbDIpKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsKSA6IHMuc2xpY2UoMCxsKSkgKyBlbGxpcHNpcztcbiAgfVxufTtcblxuZnVuY3Rpb24gdHJ1bmNhdGVPbldvcmQocywgbGVuLCByZXYpIHtcbiAgdmFyIGNudCA9IDAsIHRvayA9IHMuc3BsaXQodHJ1bmNhdGVfd29yZF9yZSk7XG4gIGlmIChyZXYpIHtcbiAgICBzID0gKHRvayA9IHRvay5yZXZlcnNlKCkpXG4gICAgICAuZmlsdGVyKGZ1bmN0aW9uKHcpIHsgY250ICs9IHcubGVuZ3RoOyByZXR1cm4gY250IDw9IGxlbjsgfSlcbiAgICAgIC5yZXZlcnNlKCk7XG4gIH0gZWxzZSB7XG4gICAgcyA9IHRvay5maWx0ZXIoZnVuY3Rpb24odykgeyBjbnQgKz0gdy5sZW5ndGg7IHJldHVybiBjbnQgPD0gbGVuOyB9KTtcbiAgfVxuICByZXR1cm4gcy5sZW5ndGggPyBzLmpvaW4oJycpLnRyaW0oKSA6IHRva1swXS5zbGljZSgwLCBsZW4pO1xufVxuXG52YXIgdHJ1bmNhdGVfd29yZF9yZSA9IC8oW1xcdTAwMDlcXHUwMDBBXFx1MDAwQlxcdTAwMENcXHUwMDBEXFx1MDAyMFxcdTAwQTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUyMDI4XFx1MjAyOVxcdTMwMDBcXHVGRUZGXSkvO1xuIiwiZXhwb3J0IGNvbnN0IEFHR1JFR0FURV9PUFMgPSBbXG4gICd2YWx1ZXMnLCAnY291bnQnLCAndmFsaWQnLCAnbWlzc2luZycsICdkaXN0aW5jdCcsXG4gICdzdW0nLCAnbWVhbicsICdhdmVyYWdlJywgJ3ZhcmlhbmNlJywgJ3ZhcmlhbmNlcCcsICdzdGRldicsXG4gICdzdGRldnAnLCAnbWVkaWFuJywgJ3ExJywgJ3EzJywgJ21vZGVza2V3JywgJ21pbicsICdtYXgnLFxuICAnYXJnbWluJywgJ2FyZ21heCdcbl07XG5cbmV4cG9ydCBjb25zdCBTSEFSRURfRE9NQUlOX09QUyA9IFtcbiAgJ21lYW4nLCAnYXZlcmFnZScsICdzdGRldicsICdzdGRldnAnLCAnbWVkaWFuJywgJ3ExJywgJ3EzJywgJ21pbicsICdtYXgnXG5dO1xuXG4vLyBUT0RPOiBtb3ZlIHN1cHBvcnRlZFR5cGVzLCBzdXBwb3J0ZWRFbnVtcyBmcm9tIHNjaGVtYSB0byBoZXJlXG4iLCJpbXBvcnQge0NoYW5uZWwsIFJPVywgQ09MVU1OLCBTSEFQRSwgU0laRX0gZnJvbSAnLi9jaGFubmVsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9NYXhCaW5zKGNoYW5uZWw6IENoYW5uZWwpOiBudW1iZXIge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTFVNTjpcbiAgICBjYXNlIFNJWkU6XG4gICAgICAvLyBGYWNldHMgYW5kIFNpemUgc2hvdWxkbid0IGhhdmUgdG9vIG1hbnkgYmluc1xuICAgICAgLy8gV2UgY2hvb3NlIDYgbGlrZSBzaGFwZSB0byBzaW1wbGlmeSB0aGUgcnVsZVxuICAgIGNhc2UgU0hBUEU6XG4gICAgICByZXR1cm4gNjsgLy8gVmVnYSdzIFwic2hhcGVcIiBoYXMgNiBkaXN0aW5jdCB2YWx1ZXNcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIDEwO1xuICB9XG59XG4iLCIvKlxuICogQ29uc3RhbnRzIGFuZCB1dGlsaXRpZXMgZm9yIGVuY29kaW5nIGNoYW5uZWxzIChWaXN1YWwgdmFyaWFibGVzKVxuICogc3VjaCBhcyAneCcsICd5JywgJ2NvbG9yJy5cbiAqL1xuXG5pbXBvcnQge01hcmt9IGZyb20gJy4vbWFyayc7XG5cbmV4cG9ydCBlbnVtIENoYW5uZWwge1xuICBYID0gJ3gnIGFzIGFueSxcbiAgWSA9ICd5JyBhcyBhbnksXG4gIFJPVyA9ICdyb3cnIGFzIGFueSxcbiAgQ09MVU1OID0gJ2NvbHVtbicgYXMgYW55LFxuICBTSEFQRSA9ICdzaGFwZScgYXMgYW55LFxuICBTSVpFID0gJ3NpemUnIGFzIGFueSxcbiAgQ09MT1IgPSAnY29sb3InIGFzIGFueSxcbiAgVEVYVCA9ICd0ZXh0JyBhcyBhbnksXG4gIERFVEFJTCA9ICdkZXRhaWwnIGFzIGFueSxcbiAgTEFCRUwgPSAnbGFiZWwnIGFzIGFueVxufVxuXG5leHBvcnQgY29uc3QgWCA9IENoYW5uZWwuWDtcbmV4cG9ydCBjb25zdCBZID0gQ2hhbm5lbC5ZO1xuZXhwb3J0IGNvbnN0IFJPVyA9IENoYW5uZWwuUk9XO1xuZXhwb3J0IGNvbnN0IENPTFVNTiA9IENoYW5uZWwuQ09MVU1OO1xuZXhwb3J0IGNvbnN0IFNIQVBFID0gQ2hhbm5lbC5TSEFQRTtcbmV4cG9ydCBjb25zdCBTSVpFID0gQ2hhbm5lbC5TSVpFO1xuZXhwb3J0IGNvbnN0IENPTE9SID0gQ2hhbm5lbC5DT0xPUjtcbmV4cG9ydCBjb25zdCBURVhUID0gQ2hhbm5lbC5URVhUO1xuZXhwb3J0IGNvbnN0IERFVEFJTCA9IENoYW5uZWwuREVUQUlMO1xuZXhwb3J0IGNvbnN0IExBQkVMID0gQ2hhbm5lbC5MQUJFTDtcblxuZXhwb3J0IGNvbnN0IENIQU5ORUxTID0gW1gsIFksIFJPVywgQ09MVU1OLCBTSVpFLCBTSEFQRSwgQ09MT1IsIFRFWFQsIERFVEFJTCwgTEFCRUxdO1xuXG5pbnRlcmZhY2UgU3VwcG9ydGVkTWFyayB7XG4gIHBvaW50PzogYm9vbGVhbjtcbiAgdGljaz86IGJvb2xlYW47XG4gIGNpcmNsZT86IGJvb2xlYW47XG4gIHNxdWFyZT86IGJvb2xlYW47XG4gIGJhcj86IGJvb2xlYW47XG4gIGxpbmU/OiBib29sZWFuO1xuICBhcmVhPzogYm9vbGVhbjtcbiAgdGV4dD86IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIGEgY2hhbm5lbCBzdXBwb3J0cyBhIHBhcnRpY3VsYXIgbWFyayB0eXBlLlxuICogQHBhcmFtIGNoYW5uZWwgIGNoYW5uZWwgbmFtZVxuICogQHBhcmFtIG1hcmsgdGhlIG1hcmsgdHlwZVxuICogQHJldHVybiB3aGV0aGVyIHRoZSBtYXJrIHN1cHBvcnRzIHRoZSBjaGFubmVsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdXBwb3J0TWFyayhjaGFubmVsOiBDaGFubmVsLCBtYXJrOiBNYXJrKSB7XG4gIHJldHVybiAhIWdldFN1cHBvcnRlZE1hcmsoY2hhbm5lbClbbWFya107XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZGljdGlvbmFyeSBzaG93aW5nIHdoZXRoZXIgYSBjaGFubmVsIHN1cHBvcnRzIG1hcmsgdHlwZS5cbiAqIEBwYXJhbSBjaGFubmVsXG4gKiBAcmV0dXJuIEEgZGljdGlvbmFyeSBtYXBwaW5nIG1hcmsgdHlwZXMgdG8gYm9vbGVhbiB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdXBwb3J0ZWRNYXJrKGNoYW5uZWw6IENoYW5uZWwpOiBTdXBwb3J0ZWRNYXJrIHtcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSBYOlxuICAgIGNhc2UgWTpcbiAgICBjYXNlIENPTE9SOlxuICAgIGNhc2UgREVUQUlMOlxuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MVU1OOlxuICAgICAgcmV0dXJuIHsgLy8gYWxsIG1hcmtzXG4gICAgICAgIHBvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSxcbiAgICAgICAgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCB0ZXh0OiB0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgU0laRTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSxcbiAgICAgICAgYmFyOiB0cnVlLCB0ZXh0OiB0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgU0hBUEU6XG4gICAgICByZXR1cm4ge3BvaW50OiB0cnVlfTtcbiAgICBjYXNlIFRFWFQ6XG4gICAgICByZXR1cm4ge3RleHQ6IHRydWV9O1xuICB9XG4gIHJldHVybiB7fTtcbn1cblxuaW50ZXJmYWNlIFN1cHBvcnRlZFJvbGUge1xuICBtZWFzdXJlOiBib29sZWFuO1xuICBkaW1lbnNpb246IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIGEgY2hhbm5lbCBzdXBwb3J0cyBkaW1lbnNpb24gLyBtZWFzdXJlIHJvbGVcbiAqIEBwYXJhbSAgY2hhbm5lbFxuICogQHJldHVybiBBIGRpY3Rpb25hcnkgbWFwcGluZyByb2xlIHRvIGJvb2xlYW4gdmFsdWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3VwcG9ydGVkUm9sZShjaGFubmVsOiBDaGFubmVsKTogU3VwcG9ydGVkUm9sZSB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgWDpcbiAgICBjYXNlIFk6XG4gICAgY2FzZSBDT0xPUjpcbiAgICBjYXNlIExBQkVMOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWVhc3VyZTogdHJ1ZSxcbiAgICAgICAgZGltZW5zaW9uOiB0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MVU1OOlxuICAgIGNhc2UgU0hBUEU6XG4gICAgY2FzZSBERVRBSUw6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZWFzdXJlOiBmYWxzZSxcbiAgICAgICAgZGltZW5zaW9uOiB0cnVlXG4gICAgICB9O1xuICAgIGNhc2UgU0laRTpcbiAgICBjYXNlIFRFWFQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZWFzdXJlOiB0cnVlLFxuICAgICAgICBkaW1lbnNpb246IGZhbHNlXG4gICAgICB9O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBlbmNvZGluZyBjaGFubmVsJyArIGNoYW5uZWwpO1xufVxuIiwiaW1wb3J0IHtTcGVjfSBmcm9tICcuLi9zY2hlbWEvc2NoZW1hJztcbmltcG9ydCB7QXhpcywgYXhpcyBhcyBheGlzU2NoZW1hfSBmcm9tICcuLi9zY2hlbWEvYXhpcy5zY2hlbWEnO1xuaW1wb3J0IHtFbmNvZGluZ30gZnJvbSAnLi4vc2NoZW1hL2VuY29kaW5nLnNjaGVtYSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcbmltcG9ydCB7aW5zdGFudGlhdGV9IGZyb20gJy4uL3NjaGVtYS9zY2hlbWF1dGlsJztcbmltcG9ydCAqIGFzIHNjaGVtYSBmcm9tICcuLi9zY2hlbWEvc2NoZW1hJztcbmltcG9ydCAqIGFzIHNjaGVtYVV0aWwgZnJvbSAnLi4vc2NoZW1hL3NjaGVtYXV0aWwnO1xuXG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZLCBTSVpFLCBURVhULCBDaGFubmVsLCBzdXBwb3J0TWFya30gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge1NPVVJDRSwgU1VNTUFSWX0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQgKiBhcyB2bEZpZWxkRGVmIGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7RmllbGRSZWZPcHRpb259IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtNYXJrLCBCQVIsIFRJQ0ssIFRFWFQgYXMgVEVYVE1BUkt9IGZyb20gJy4uL21hcmsnO1xuXG5pbXBvcnQge2dldEZ1bGxOYW1lLCBOT01JTkFMLCBPUkRJTkFMLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zLCBkdXBsaWNhdGUsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7Y29tcGlsZU1hcmtDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7Y29tcGlsZUxheW91dCwgTGF5b3V0fSBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQge2NvbXBpbGVTdGFja1Byb3BlcnRpZXMsIFN0YWNrUHJvcGVydGllc30gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge3R5cGUgYXMgc2NhbGVUeXBlfSBmcm9tICcuL3NjYWxlJztcblxuLyoqXG4gKiBJbnRlcm5hbCBtb2RlbCBvZiBWZWdhLUxpdGUgc3BlY2lmaWNhdGlvbiBmb3IgdGhlIGNvbXBpbGVyLlxuICovXG5leHBvcnQgY2xhc3MgTW9kZWwge1xuICBwcml2YXRlIF9zcGVjOiBTcGVjO1xuICBwcml2YXRlIF9zdGFjazogU3RhY2tQcm9wZXJ0aWVzO1xuICBwcml2YXRlIF9sYXlvdXQ6IExheW91dDtcblxuICBjb25zdHJ1Y3RvcihzcGVjOiBTcGVjLCB0aGVtZT8pIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBzY2hlbWEuaW5zdGFudGlhdGUoKTtcbiAgICB0aGlzLl9zcGVjID0gc2NoZW1hVXRpbC5tZXJnZURlZXAoZGVmYXVsdHMsIHRoZW1lIHx8IHt9LCBzcGVjKTtcblxuXG4gICAgdmxFbmNvZGluZy5mb3JFYWNoKHRoaXMuX3NwZWMuZW5jb2RpbmcsIGZ1bmN0aW9uKGZpZWxkRGVmOiBGaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgICAgaWYgKCFzdXBwb3J0TWFyayhjaGFubmVsLCB0aGlzLl9zcGVjLm1hcmspKSB7XG4gICAgICAgIC8vIERyb3AgdW5zdXBwb3J0ZWQgY2hhbm5lbFxuXG4gICAgICAgIC8vIEZJWE1FIGNvbnNvbGlkYXRlIHdhcm5pbmcgbWV0aG9kXG4gICAgICAgIGNvbnNvbGUud2FybihjaGFubmVsLCAnZHJvcHBlZCBhcyBpdCBpcyBpbmNvbXBhdGlibGUgd2l0aCcsIHRoaXMuX3NwZWMubWFyayk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zcGVjLmVuY29kaW5nW2NoYW5uZWxdLmZpZWxkO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmllbGREZWYudHlwZSkge1xuICAgICAgICAvLyBjb252ZXJ0IHNob3J0IHR5cGUgdG8gZnVsbCB0eXBlXG4gICAgICAgIGZpZWxkRGVmLnR5cGUgPSBnZXRGdWxsTmFtZShmaWVsZERlZi50eXBlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmLmF4aXMgPT09IHRydWUpIHtcbiAgICAgICAgZmllbGREZWYuYXhpcyA9IGluc3RhbnRpYXRlKGF4aXNTY2hlbWEpO1xuICAgICAgfVxuXG4gICAgICAvLyBzZXQgZGVmYXVsdCBwYWRkaW5nIGZvciBST1cgYW5kIENPTFVNTlxuICAgICAgaWYgKGNoYW5uZWwgPT09IFJPVyAmJiBmaWVsZERlZi5zY2FsZS5wYWRkaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZmllbGREZWYuc2NhbGUucGFkZGluZyA9IHRoaXMuaGFzKFkpID8gMTYgOiAwO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5uZWwgPT09IENPTFVNTiAmJiBmaWVsZERlZi5zY2FsZS5wYWRkaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZmllbGREZWYuc2NhbGUucGFkZGluZyA9IHRoaXMuaGFzKFgpID8gMTYgOiAwO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuXG4gICAgLy8gY2FsY3VsYXRlIHN0YWNrXG4gICAgdGhpcy5fc3RhY2sgPSBjb21waWxlU3RhY2tQcm9wZXJ0aWVzKHRoaXMuX3NwZWMpO1xuICAgIHRoaXMuX3NwZWMuY29uZmlnLm1hcmsgPSBjb21waWxlTWFya0NvbmZpZyh0aGlzLl9zcGVjLCB0aGlzLl9zdGFjayk7XG4gICAgdGhpcy5fbGF5b3V0ID0gY29tcGlsZUxheW91dCh0aGlzKTtcblxuICB9XG5cbiAgcHVibGljIGxheW91dCgpOiBMYXlvdXQge1xuICAgIHJldHVybiB0aGlzLl9sYXlvdXQ7XG4gIH1cblxuICBwdWJsaWMgc3RhY2soKTogU3RhY2tQcm9wZXJ0aWVzIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhY2s7XG4gIH1cblxuICBwdWJsaWMgdG9TcGVjKGV4Y2x1ZGVDb25maWc/LCBleGNsdWRlRGF0YT8pIHtcbiAgICB2YXIgZW5jb2RpbmcgPSBkdXBsaWNhdGUodGhpcy5fc3BlYy5lbmNvZGluZyksXG4gICAgICBzcGVjOiBhbnk7XG5cbiAgICBzcGVjID0ge1xuICAgICAgbWFyazogdGhpcy5fc3BlYy5tYXJrLFxuICAgICAgZW5jb2Rpbmc6IGVuY29kaW5nXG4gICAgfTtcblxuICAgIGlmICghZXhjbHVkZUNvbmZpZykge1xuICAgICAgc3BlYy5jb25maWcgPSBkdXBsaWNhdGUodGhpcy5fc3BlYy5jb25maWcpO1xuICAgIH1cblxuICAgIGlmICghZXhjbHVkZURhdGEpIHtcbiAgICAgIHNwZWMuZGF0YSA9IGR1cGxpY2F0ZSh0aGlzLl9zcGVjLmRhdGEpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBkZWZhdWx0c1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xuICAgIHJldHVybiBzY2hlbWFVdGlsLnN1YnRyYWN0KHNwZWMsIGRlZmF1bHRzKTtcbiAgfVxuXG4gIHB1YmxpYyBtYXJrKCk6IE1hcmsge1xuICAgIHJldHVybiB0aGlzLl9zcGVjLm1hcms7XG4gIH1cblxuICBwdWJsaWMgc3BlYygpOiBTcGVjIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYztcbiAgfVxuXG4gIHB1YmxpYyBpcyhtYXJrOiBNYXJrKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NwZWMubWFyayA9PT0gbWFyaztcbiAgfVxuXG4gIHB1YmxpYyBoYXMoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiB2bEVuY29kaW5nLmhhcyh0aGlzLl9zcGVjLmVuY29kaW5nLCBjaGFubmVsKTtcbiAgfVxuXG4gIHB1YmxpYyBmaWVsZERlZihjaGFubmVsOiBDaGFubmVsKTogRmllbGREZWYge1xuICAgIHJldHVybiB0aGlzLl9zcGVjLmVuY29kaW5nW2NoYW5uZWxdO1xuICB9XG5cbiAgLyoqIEdldCBcImZpZWxkXCIgcmVmZXJlbmNlIGZvciB2ZWdhICovXG4gIHB1YmxpYyBmaWVsZChjaGFubmVsOiBDaGFubmVsLCBvcHQ6IEZpZWxkUmVmT3B0aW9uID0ge30pIHtcbiAgICBjb25zdCBmaWVsZERlZiA9IHRoaXMuZmllbGREZWYoY2hhbm5lbCk7XG4gICAgaWYgKGZpZWxkRGVmLmJpbikgeyAvLyBiaW4gaGFzIGRlZmF1bHQgc3VmZml4IHRoYXQgZGVwZW5kcyBvbiBzY2FsZVR5cGVcbiAgICAgIG9wdCA9IGV4dGVuZCh7XG4gICAgICAgIGJpblN1ZmZpeDogc2NhbGVUeXBlKGZpZWxkRGVmLCBjaGFubmVsLCB0aGlzLm1hcmsoKSkgPT09ICdvcmRpbmFsJyA/ICdfcmFuZ2UnIDogJ19zdGFydCdcbiAgICAgIH0sIG9wdCk7XG4gICAgfVxuICAgIHJldHVybiB2bEZpZWxkRGVmLmZpZWxkKGZpZWxkRGVmLCBvcHQpO1xuICB9XG5cbiAgcHVibGljIGZpZWxkVGl0bGUoY2hhbm5lbDogQ2hhbm5lbCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHZsRmllbGREZWYudGl0bGUodGhpcy5fc3BlYy5lbmNvZGluZ1tjaGFubmVsXSk7XG4gIH1cblxuICBwdWJsaWMgY2hhbm5lbHMoKTogQ2hhbm5lbFtdIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5jaGFubmVscyh0aGlzLl9zcGVjLmVuY29kaW5nKTtcbiAgfVxuXG4gIHB1YmxpYyBtYXAoZjogKGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgZTogRW5jb2RpbmcpID0+IGFueSwgdD86IGFueSkge1xuICAgIHJldHVybiB2bEVuY29kaW5nLm1hcCh0aGlzLl9zcGVjLmVuY29kaW5nLCBmLCB0KTtcbiAgfVxuXG4gIHB1YmxpYyByZWR1Y2UoZjogKGFjYzogYW55LCBmZDogRmllbGREZWYsIGM6IENoYW5uZWwsIGU6IEVuY29kaW5nKSA9PiBhbnksIGluaXQsIHQ/OiBhbnkpIHtcbiAgICByZXR1cm4gdmxFbmNvZGluZy5yZWR1Y2UodGhpcy5fc3BlYy5lbmNvZGluZywgZiwgaW5pdCwgdCk7XG4gIH1cblxuICBwdWJsaWMgZm9yRWFjaChmOiAoZmQ6IEZpZWxkRGVmLCBjOiBDaGFubmVsLCBpOm51bWJlcikgPT4gdm9pZCwgdD86IGFueSkge1xuICAgIHJldHVybiB2bEVuY29kaW5nLmZvckVhY2godGhpcy5fc3BlYy5lbmNvZGluZywgZiwgdCk7XG4gIH1cblxuICBwdWJsaWMgaXNPcmRpbmFsU2NhbGUoY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5maWVsZERlZihjaGFubmVsKTtcbiAgICByZXR1cm4gZmllbGREZWYgJiYgKFxuICAgICAgY29udGFpbnMoW05PTUlOQUwsIE9SRElOQUxdLCBmaWVsZERlZi50eXBlKSB8fFxuICAgICAgKCBmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJiBzY2FsZVR5cGUoZmllbGREZWYsIGNoYW5uZWwsIHRoaXMubWFyaygpKSA9PT0gJ29yZGluYWwnIClcbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgaXNEaW1lbnNpb24oY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIHJldHVybiB2bEZpZWxkRGVmLmlzRGltZW5zaW9uKHRoaXMuZmllbGREZWYoY2hhbm5lbCkpO1xuICB9XG5cbiAgcHVibGljIGlzTWVhc3VyZShjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgcmV0dXJuIHZsRmllbGREZWYuaXNNZWFzdXJlKHRoaXMuZmllbGREZWYoY2hhbm5lbCkpO1xuICB9XG5cbiAgcHVibGljIGlzQWdncmVnYXRlKCkge1xuICAgIHJldHVybiB2bEVuY29kaW5nLmlzQWdncmVnYXRlKHRoaXMuX3NwZWMuZW5jb2RpbmcpO1xuICB9XG5cbiAgcHVibGljIGlzRmFjZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKFJPVykgfHwgdGhpcy5oYXMoQ09MVU1OKTtcbiAgfVxuXG4gIHB1YmxpYyBkYXRhVGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBZ2dyZWdhdGUoKSA/IFNVTU1BUlkgOiBTT1VSQ0U7XG4gIH1cblxuICBwdWJsaWMgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYy5kYXRhO1xuICB9XG5cbiAgLyoqIHJldHVybnMgd2hldGhlciB0aGUgZW5jb2RpbmcgaGFzIHZhbHVlcyBlbWJlZGRlZCAqL1xuICBwdWJsaWMgaGFzVmFsdWVzKCkge1xuICAgIHZhciB2YWxzID0gdGhpcy5kYXRhKCkudmFsdWVzO1xuICAgIHJldHVybiB2YWxzICYmIHZhbHMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc3BlYyBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcHVibGljIGNvbmZpZygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3BlYy5jb25maWc7XG4gIH1cblxuICBwdWJsaWMgYXhpcyhjaGFubmVsOiBDaGFubmVsKTogQXhpcyB7XG4gICAgY29uc3QgYXhpcyA9IHRoaXMuZmllbGREZWYoY2hhbm5lbCkuYXhpcztcbiAgICByZXR1cm4gdHlwZW9mIGF4aXMgIT09ICdib29sZWFuJyA/IGF4aXMgOiB7fTtcbiAgfVxuXG4gIC8qKiByZXR1cm5zIHNjYWxlIG5hbWUgZm9yIGEgZ2l2ZW4gY2hhbm5lbCAqL1xuICBwdWJsaWMgc2NhbGVOYW1lKGNoYW5uZWw6IENoYW5uZWwpOiBzdHJpbmcge1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLnNwZWMoKS5uYW1lO1xuICAgIHJldHVybiAobmFtZSA/IG5hbWUgKyAnLScgOiAnJykgKyBjaGFubmVsO1xuICB9XG5cbiAgcHVibGljIHNpemVWYWx1ZShjaGFubmVsOiBDaGFubmVsID0gU0laRSkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5maWVsZERlZihTSVpFKS52YWx1ZTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMubWFyaygpKSB7XG4gICAgICBjYXNlIFRFWFRNQVJLOlxuICAgICAgICByZXR1cm4gMTA7IC8vIGZvbnQgc2l6ZSAxMCBieSBkZWZhdWx0XG4gICAgICBjYXNlIEJBUjpcbiAgICAgICAgLy8gQkFSJ3Mgc2l6ZSBpcyBhcHBsaWVkIG9uIGVpdGhlciBYIG9yIFlcbiAgICAgICAgcmV0dXJuICF0aGlzLmhhcyhjaGFubmVsKSB8fCB0aGlzLmlzT3JkaW5hbFNjYWxlKGNoYW5uZWwpID9cbiAgICAgICAgICAvLyBGb3Igb3JkaW5hbCBzY2FsZSBvciBzaW5nbGUgYmFyLCB3ZSBjYW4gdXNlIGJhbmRXaWR0aCAtIDFcbiAgICAgICAgICAvLyAoLTEgc28gdGhhdCB0aGUgYm9yZGVyIG9mIHRoZSBiYXIgZmFsbHMgb24gZXhhY3QgcGl4ZWwpXG4gICAgICAgICAgdGhpcy5maWVsZERlZihjaGFubmVsKS5zY2FsZS5iYW5kV2lkdGggLSAxIDpcbiAgICAgICAgICAvLyBvdGhlcndpc2UsIHNldCB0byAyIGJ5IGRlZmF1bHRcbiAgICAgICAgICAyO1xuICAgICAgY2FzZSBUSUNLOlxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZERlZihjaGFubmVsKS5zY2FsZS5iYW5kV2lkdGggLyAxLjU7XG4gICAgfVxuICAgIHJldHVybiAzMDtcbiAgfVxufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge2NvbnRhaW5zLCBleHRlbmQsIHRydW5jYXRlfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7Tk9NSU5BTCwgT1JESU5BTCwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWSwgQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2Zvcm1hdE1peGluc30gZnJvbSAnLi91dGlsJztcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvbWFzdGVyL2RvYy9zcGVjLm1kIzExLWFtYmllbnQtZGVjbGFyYXRpb25zXG5kZWNsYXJlIGxldCBleHBvcnRzO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUF4aXMoY2hhbm5lbDogQ2hhbm5lbCwgbW9kZWw6IE1vZGVsKSB7XG4gIGNvbnN0IGlzQ29sID0gY2hhbm5lbCA9PT0gQ09MVU1OLFxuICAgIGlzUm93ID0gY2hhbm5lbCA9PT0gUk9XLFxuICAgIHR5cGUgPSBpc0NvbCA/ICd4JyA6IGlzUm93ID8gJ3knOiBjaGFubmVsO1xuXG4gIC8vIFRPRE86IHJlcGxhY2UgYW55IHdpdGggVmVnYSBBeGlzIEludGVyZmFjZVxuICBsZXQgZGVmOiBhbnkgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpXG4gIH07XG5cbiAgLy8gZm9ybWF0IG1peGlucyAoYWRkIGZvcm1hdCBhbmQgZm9ybWF0VHlwZSlcbiAgZXh0ZW5kKGRlZiwgZm9ybWF0TWl4aW5zKG1vZGVsLCBjaGFubmVsLCBtb2RlbC5heGlzKGNoYW5uZWwpLmZvcm1hdCkpO1xuXG4gIC8vIDEuMi4gQWRkIHByb3BlcnRpZXNcbiAgW1xuICAgIC8vIGEpIHByb3BlcnRpZXMgd2l0aCBzcGVjaWFsIHJ1bGVzIChzbyBpdCBoYXMgYXhpc1twcm9wZXJ0eV0gbWV0aG9kcykgLS0gY2FsbCBydWxlIGZ1bmN0aW9uc1xuICAgICdncmlkJywgJ2xheWVyJywgJ29yaWVudCcsICd0aWNrU2l6ZScsICd0aWNrcycsICd0aXRsZScsXG4gICAgLy8gYikgcHJvcGVydGllcyB3aXRob3V0IHJ1bGVzLCBvbmx5IHByb2R1Y2UgZGVmYXVsdCB2YWx1ZXMgaW4gdGhlIHNjaGVtYSwgb3IgZXhwbGljaXQgdmFsdWUgaWYgc3BlY2lmaWVkXG4gICAgJ29mZnNldCcsICd0aWNrUGFkZGluZycsICd0aWNrU2l6ZScsICd0aWNrU2l6ZU1ham9yJywgJ3RpY2tTaXplTWlub3InLCAndGlja1NpemVFbmQnLFxuICAgICd0aXRsZU9mZnNldCcsICd2YWx1ZXMnLCAnc3ViZGl2aWRlJ1xuICBdLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICBsZXQgbWV0aG9kOiAobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBkZWY6YW55KT0+YW55O1xuXG4gICAgY29uc3QgdmFsdWUgPSAobWV0aG9kID0gZXhwb3J0c1twcm9wZXJ0eV0pID9cbiAgICAgICAgICAgICAgICAgIC8vIGNhbGxpbmcgYXhpcy5mb3JtYXQsIGF4aXMuZ3JpZCwgLi4uXG4gICAgICAgICAgICAgICAgICBtZXRob2QobW9kZWwsIGNoYW5uZWwsIGRlZikgOlxuICAgICAgICAgICAgICAgICAgbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuYXhpc1twcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlZltwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIDIpIEFkZCBtYXJrIHByb3BlcnR5IGRlZmluaXRpb24gZ3JvdXBzXG4gIGNvbnN0IHByb3BzID0gbW9kZWwuYXhpcyhjaGFubmVsKS5wcm9wZXJ0aWVzIHx8IHt9O1xuXG4gIFtcbiAgICAnYXhpcycsICdsYWJlbHMnLCAvLyBoYXZlIHNwZWNpYWwgcnVsZXNcbiAgICAnZ3JpZCcsICd0aXRsZScsICd0aWNrcycsICdtYWpvclRpY2tzJywgJ21pbm9yVGlja3MnIC8vIG9ubHkgZGVmYXVsdCB2YWx1ZXNcbiAgXS5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgY29uc3QgdmFsdWUgPSBwcm9wZXJ0aWVzW2dyb3VwXSA/XG4gICAgICBwcm9wZXJ0aWVzW2dyb3VwXShtb2RlbCwgY2hhbm5lbCwgcHJvcHNbZ3JvdXBdLCBkZWYpIDpcbiAgICAgIHByb3BzW2dyb3VwXTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmLnByb3BlcnRpZXMgPSBkZWYucHJvcGVydGllcyB8fCB7fTtcbiAgICAgIGRlZi5wcm9wZXJ0aWVzW2dyb3VwXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdyaWQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gIGlmIChjaGFubmVsID09PSBST1cgfHwgY2hhbm5lbCA9PT0gQ09MVU1OKSB7XG4gICAgLy8gbmV2ZXIgYXBwbHkgZ3JpZCBmb3IgUk9XIGFuZCBDT0xVTU4gc2luY2Ugd2UgbWFudWFsbHkgY3JlYXRlIHJ1bGUtZ3JvdXAgZm9yIHRoZW1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgZ3JpZCA9IG1vZGVsLmF4aXMoY2hhbm5lbCkuZ3JpZDtcbiAgaWYgKGdyaWQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBncmlkO1xuICB9XG5cbiAgLy8gSWYgYGdyaWRgIGlzIHVuc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAgZm9yIG9yZGluYWwgc2NhbGVzXG4gIC8vIHRoYXQgYXJlIG5vdCBiaW5uZWRcbiAgcmV0dXJuICFtb2RlbC5pc09yZGluYWxTY2FsZShjaGFubmVsKSAmJiAhZmllbGREZWYuYmluO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXIobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBkZWYpIHtcbiAgY29uc3QgbGF5ZXIgPSBtb2RlbC5heGlzKGNoYW5uZWwpLmxheWVyO1xuICBpZiAobGF5ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBsYXllcjtcbiAgfVxuICBpZiAoZGVmLmdyaWQpIHtcbiAgICAvLyBpZiBncmlkIGlzIHRydWUsIG5lZWQgdG8gcHV0IGxheWVyIG9uIHRoZSBiYWNrIHNvIHRoYXQgZ3JpZCBpcyBiZWhpbmQgbWFya3NcbiAgICByZXR1cm4gJ2JhY2snO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7IC8vIG90aGVyd2lzZSByZXR1cm4gdW5kZWZpbmVkIGFuZCB1c2UgVmVnYSdzIGRlZmF1bHQuXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gb3JpZW50KG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBjb25zdCBvcmllbnQgPSBtb2RlbC5heGlzKGNoYW5uZWwpLm9yaWVudDtcbiAgaWYgKG9yaWVudCkge1xuICAgIHJldHVybiBvcmllbnQ7XG4gIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gQ09MVU1OKSB7XG4gICAgLy8gRklYTUUgdGVzdCBhbmQgZGVjaWRlXG4gICAgcmV0dXJuICd0b3AnO1xuICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IFJPVykge1xuICAgIGlmIChtb2RlbC5oYXMoWSkgJiYgbW9kZWwuYXhpcyhZKS5vcmllbnQgIT09ICdyaWdodCcpIHtcbiAgICAgIHJldHVybiAncmlnaHQnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlja3MobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGNvbnN0IHRpY2tzID0gbW9kZWwuYXhpcyhjaGFubmVsKS50aWNrcztcbiAgaWYgKHRpY2tzICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdGlja3M7XG4gIH1cblxuICAvLyBGSVhNRSBkZXBlbmRzIG9uIHNjYWxlIHR5cGUgdG9vXG4gIGlmIChjaGFubmVsID09PSBYICYmICFtb2RlbC5maWVsZERlZihjaGFubmVsKS5iaW4pIHtcbiAgICAvLyBWZWdhJ3MgZGVmYXVsdCB0aWNrcyBvZnRlbiBsZWFkIHRvIGEgbG90IG9mIGxhYmVsIG9jY2x1c2lvbiBvbiBYIHdpdGhvdXQgOTAgZGVncmVlIHJvdGF0aW9uXG4gICAgcmV0dXJuIDU7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlja1NpemUobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGNvbnN0IHRpY2tTaXplID0gbW9kZWwuYXhpcyhjaGFubmVsKS50aWNrU2l6ZTtcbiAgaWYgKHRpY2tTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdGlja1NpemU7XG4gIH1cbiAgaWYgKGNoYW5uZWwgPT09IFJPVyB8fCBjaGFubmVsID09PSBDT0xVTU4pIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgY29uc3QgYXhpcyA9IG1vZGVsLmF4aXMoY2hhbm5lbCk7XG4gIGlmIChheGlzLnRpdGxlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYXhpcy50aXRsZTtcbiAgfVxuXG4gIC8vIGlmIG5vdCBkZWZpbmVkLCBhdXRvbWF0aWNhbGx5IGRldGVybWluZSBheGlzIHRpdGxlIGZyb20gZmllbGQgZGVmXG4gIGNvbnN0IGZpZWxkVGl0bGUgPSBtb2RlbC5maWVsZFRpdGxlKGNoYW5uZWwpO1xuICBjb25zdCBsYXlvdXQgPSBtb2RlbC5sYXlvdXQoKTtcbiAgY29uc3QgY2VsbFdpZHRoID0gbGF5b3V0LmNlbGxXaWR0aDtcbiAgY29uc3QgY2VsbEhlaWdodCA9IGxheW91dC5jZWxsSGVpZ2h0O1xuXG4gIGxldCBtYXhMZW5ndGg7XG4gIGlmIChheGlzLnRpdGxlTWF4TGVuZ3RoKSB7XG4gICAgbWF4TGVuZ3RoID0gYXhpcy50aXRsZU1heExlbmd0aDtcbiAgfSBlbHNlIGlmIChjaGFubmVsID09PSBYICYmIHR5cGVvZiBjZWxsV2lkdGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gR3Vlc3MgbWF4IGxlbmd0aCBpZiB3ZSBrbm93IGNlbGwgc2l6ZSBhdCBjb21waWxlIHRpbWVcbiAgICBtYXhMZW5ndGggPSBjZWxsV2lkdGggLyBtb2RlbC5heGlzKFgpLmNoYXJhY3RlcldpZHRoO1xuICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IFkgJiYgdHlwZW9mIGNlbGxIZWlnaHQgPT09ICdudW1iZXInKSB7XG4gICAgLy8gR3Vlc3MgbWF4IGxlbmd0aCBpZiB3ZSBrbm93IGNlbGwgc2l6ZSBhdCBjb21waWxlIHRpbWVcbiAgICBtYXhMZW5ndGggPSBjZWxsSGVpZ2h0IC8gbW9kZWwuYXhpcyhZKS5jaGFyYWN0ZXJXaWR0aDtcbiAgfVxuICAvLyBGSVhNRTogd2Ugc2hvdWxkIHVzZSB0ZW1wbGF0ZSB0byB0cnVuY2F0ZSBpbnN0ZWFkXG4gIHJldHVybiBtYXhMZW5ndGggPyB0cnVuY2F0ZShmaWVsZFRpdGxlLCBtYXhMZW5ndGgpIDogZmllbGRUaXRsZTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBwcm9wZXJ0aWVzIHtcbiAgZXhwb3J0IGZ1bmN0aW9uIGF4aXMobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBheGlzUHJvcHNTcGVjKSB7XG4gICAgaWYgKGNoYW5uZWwgPT09IFJPVyB8fCBjaGFubmVsID09PSBDT0xVTU4pIHtcbiAgICAgIC8vIGhpZGUgYXhpcyBmb3IgZmFjZXRzXG4gICAgICByZXR1cm4gZXh0ZW5kKHtcbiAgICAgICAgb3BhY2l0eToge3ZhbHVlOiAwfVxuICAgICAgfSwgYXhpc1Byb3BzU3BlYyB8fCB7fSk7XG4gICAgfVxuICAgIHJldHVybiBheGlzUHJvcHNTcGVjIHx8IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBsYWJlbHNTcGVjLCBkZWYpIHtcbiAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgIGNvbnN0IGF4aXMgPSBtb2RlbC5heGlzKGNoYW5uZWwpO1xuXG4gICAgaWYgKCFheGlzLmxhYmVscykge1xuICAgICAgcmV0dXJuIGV4dGVuZCh7XG4gICAgICAgIHRleHQ6ICcnXG4gICAgICB9LCBsYWJlbHNTcGVjKTtcbiAgICB9XG5cbiAgICBpZiAoY29udGFpbnMoW05PTUlOQUwsIE9SRElOQUxdLCBmaWVsZERlZi50eXBlKSAmJiBheGlzLmxhYmVsTWF4TGVuZ3RoKSB7XG4gICAgICAvLyBUT0RPIHJlcGxhY2UgdGhpcyB3aXRoIFZlZ2EncyBsYWJlbE1heExlbmd0aCBvbmNlIGl0IGlzIGludHJvZHVjZWRcbiAgICAgIGxhYmVsc1NwZWMgPSBleHRlbmQoe1xuICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgdGVtcGxhdGU6ICd7eyBkYXR1bS5kYXRhIHwgdHJ1bmNhdGU6JyArIGF4aXMubGFiZWxNYXhMZW5ndGggKyAnfX0nXG4gICAgICAgIH1cbiAgICAgIH0sIGxhYmVsc1NwZWMgfHwge30pO1xuICAgIH1cblxuICAgICAvLyBmb3IgeC1heGlzLCBzZXQgdGlja3MgZm9yIFEgb3Igcm90YXRlIHNjYWxlIGZvciBvcmRpbmFsIHNjYWxlXG4gICAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgICBjYXNlIFg6XG4gICAgICAgIGlmIChtb2RlbC5pc0RpbWVuc2lvbihYKSB8fCBmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xuICAgICAgICAgIGxhYmVsc1NwZWMgPSBleHRlbmQoe1xuICAgICAgICAgICAgYW5nbGU6IHt2YWx1ZTogMjcwfSxcbiAgICAgICAgICAgIGFsaWduOiB7dmFsdWU6IGRlZi5vcmllbnQgPT09ICd0b3AnID8gJ2xlZnQnOiAncmlnaHQnfSxcbiAgICAgICAgICAgIGJhc2VsaW5lOiB7dmFsdWU6ICdtaWRkbGUnfVxuICAgICAgICAgIH0sIGxhYmVsc1NwZWMgfHwge30pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBST1c6XG4gICAgICAgIGlmIChkZWYub3JpZW50ID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgbGFiZWxzU3BlYyA9IGV4dGVuZCh7XG4gICAgICAgICAgICBhbmdsZToge3ZhbHVlOiA5MH0sXG4gICAgICAgICAgICBhbGlnbjoge3ZhbHVlOiAnY2VudGVyJ30sXG4gICAgICAgICAgICBiYXNlbGluZToge3ZhbHVlOiAnYm90dG9tJ31cbiAgICAgICAgICB9LCBsYWJlbHNTcGVjIHx8IHt9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsYWJlbHNTcGVjIHx8IHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiLyoqXG4gKiBNb2R1bGUgZm9yIGNvbXBpbGluZyBWZWdhLWxpdGUgc3BlYyBpbnRvIFZlZ2Egc3BlYy5cbiAqL1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5cbmltcG9ydCB7Y29tcGlsZUF4aXN9IGZyb20gJy4vYXhpcyc7XG5pbXBvcnQge2NvbXBpbGVEYXRhfSBmcm9tICcuL2RhdGEnO1xuaW1wb3J0IHtmYWNldE1peGluc30gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge2NvbXBpbGVMZWdlbmRzfSBmcm9tICcuL2xlZ2VuZCc7XG5pbXBvcnQge2NvbXBpbGVNYXJrfSBmcm9tICcuL21hcmsnO1xuaW1wb3J0IHtjb21waWxlU2NhbGVzfSBmcm9tICcuL3NjYWxlJztcbmltcG9ydCB7ZXh0ZW5kLCBrZXlzfSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtMQVlPVVR9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5cbmV4cG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZShzcGVjLCB0aGVtZT8pIHtcbiAgY29uc3QgbW9kZWwgPSBuZXcgTW9kZWwoc3BlYywgdGhlbWUpO1xuICBjb25zdCBsYXlvdXQgPSBtb2RlbC5sYXlvdXQoKTtcblxuICAvLyBGSVhNRSByZXBsYWNlIEZJVCB3aXRoIGFwcHJvcHJpYXRlIG1lY2hhbmlzbSBvbmNlIFZlZ2EgaGFzIGl0XG4gIGNvbnN0IEZJVCA9IDE7XG5cbiAgY29uc3QgY29uZmlnID0gbW9kZWwuY29uZmlnKCk7XG5cbiAgLy8gVE9ETzogY2hhbmdlIHR5cGUgdG8gYmVjb21lIFZnU3BlY1xuICBjb25zdCBvdXRwdXQgPSBleHRlbmQoXG4gICAgc3BlYy5uYW1lID8ge25hbWU6IHNwZWMubmFtZX0gOiB7fSxcbiAgICB7XG4gICAgICB3aWR0aDogdHlwZW9mIGxheW91dC53aWR0aCAhPT0gJ251bWJlcicgPyBGSVQgOiBsYXlvdXQud2lkdGgsXG4gICAgICBoZWlnaHQ6IHR5cGVvZiBsYXlvdXQuaGVpZ2h0ICE9PSAnbnVtYmVyJyA/IEZJVCA6IGxheW91dC5oZWlnaHQsXG4gICAgICBwYWRkaW5nOiAnYXV0bydcbiAgICB9LFxuICAgIFsndmlld3BvcnQnLCAnYmFja2dyb3VuZCddLnJlZHVjZShmdW5jdGlvbih0b3BMZXZlbENvbmZpZywgcHJvcGVydHkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29uZmlnW3Byb3BlcnR5XTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRvcExldmVsQ29uZmlnW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRvcExldmVsQ29uZmlnO1xuICAgIH0sIHt9KSxcbiAgICBrZXlzKGNvbmZpZy5zY2VuZSkubGVuZ3RoID4gMCA/IFsnZmlsbCcsICdmaWxsT3BhY2l0eScsICdzdHJva2UnLCAnc3Ryb2tlV2lkdGgnLFxuICAgICAgJ3N0cm9rZU9wYWNpdHknLCAnc3Ryb2tlRGFzaCcsICdzdHJva2VEYXNoT2Zmc2V0J10ucmVkdWNlKGZ1bmN0aW9uKHRvcExldmVsQ29uZmlnOiBhbnksIHByb3BlcnR5KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY29uZmlnLnNjZW5lW3Byb3BlcnR5XTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0b3BMZXZlbENvbmZpZy5zY2VuZSA9IHRvcExldmVsQ29uZmlnLnNjZW5lIHx8IHt9O1xuICAgICAgICAgIHRvcExldmVsQ29uZmlnLnNjZW5lW3Byb3BlcnR5XSA9IHt2YWx1ZTogdmFsdWV9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b3BMZXZlbENvbmZpZztcbiAgICB9LCB7fSkgOiB7fSxcbiAgICB7XG4gICAgICBkYXRhOiBjb21waWxlRGF0YShtb2RlbCksXG4gICAgICBtYXJrczogW2NvbXBpbGVSb290R3JvdXAobW9kZWwpXVxuICAgIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3BlYzogb3V0cHV0XG4gICAgLy8gVE9ETzogYWRkIHdhcm5pbmcgLyBlcnJvcnMgaGVyZVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVJvb3RHcm91cChtb2RlbDogTW9kZWwpIHtcbiAgY29uc3Qgc3BlYyA9IG1vZGVsLnNwZWMoKTtcbiAgY29uc3Qgd2lkdGggPSBtb2RlbC5sYXlvdXQoKS53aWR0aDtcbiAgY29uc3QgaGVpZ2h0ID0gbW9kZWwubGF5b3V0KCkuaGVpZ2h0O1xuXG4gIGxldCByb290R3JvdXA6YW55ID0gZXh0ZW5kKHtcbiAgICAgIG5hbWU6IHNwZWMubmFtZSA/IHNwZWMubmFtZSArICctcm9vdCcgOiAncm9vdCcsXG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIH0sXG4gICAgc3BlYy5kZXNjcmlwdGlvbiA/IHtkZXNjcmlwdGlvbjogc3BlYy5kZXNjcmlwdGlvbn0gOiB7fSxcbiAgICB7XG4gICAgICBmcm9tOiB7ZGF0YTogTEFZT1VUfSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgd2lkdGg6IHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgP1xuICAgICAgICAgICAgICAgICB7ZmllbGQ6IHdpZHRoLmZpZWxkfSA6XG4gICAgICAgICAgICAgICAgIHt2YWx1ZTogd2lkdGh9LFxuICAgICAgICAgIGhlaWdodDogdHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicgP1xuICAgICAgICAgICAgICAgICAge2ZpZWxkOiBoZWlnaHQuZmllbGR9IDpcbiAgICAgICAgICAgICAgICAgIHt2YWx1ZTogaGVpZ2h0fVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgY29uc3QgbWFya3MgPSBjb21waWxlTWFyayhtb2RlbCk7XG5cbiAgLy8gU21hbGwgTXVsdGlwbGVzXG4gIGlmIChtb2RlbC5oYXMoUk9XKSB8fCBtb2RlbC5oYXMoQ09MVU1OKSkge1xuICAgIC8vIHB1dCB0aGUgbWFya3MgaW5zaWRlIGEgZmFjZXQgY2VsbCdzIGdyb3VwXG4gICAgZXh0ZW5kKHJvb3RHcm91cCwgZmFjZXRNaXhpbnMobW9kZWwsIG1hcmtzKSk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdEdyb3VwLm1hcmtzID0gbWFya3M7XG4gICAgcm9vdEdyb3VwLnNjYWxlcyA9IGNvbXBpbGVTY2FsZXMobW9kZWwuY2hhbm5lbHMoKSwgbW9kZWwpO1xuXG4gICAgdmFyIGF4ZXMgPSAobW9kZWwuaGFzKFgpICYmIG1vZGVsLmZpZWxkRGVmKFgpLmF4aXMgPyBbY29tcGlsZUF4aXMoWCwgbW9kZWwpXSA6IFtdKVxuICAgICAgLmNvbmNhdChtb2RlbC5oYXMoWSkgJiYgbW9kZWwuZmllbGREZWYoWSkuYXhpcyA/IFtjb21waWxlQXhpcyhZLCBtb2RlbCldIDogW10pO1xuICAgIGlmIChheGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJvb3RHcm91cC5heGVzID0gYXhlcztcbiAgICB9XG4gIH1cblxuICAvLyBsZWdlbmRzIChzaW1pbGFyIGZvciBlaXRoZXIgZmFjZXRzIG9yIG5vbi1mYWNldHNcbiAgdmFyIGxlZ2VuZHMgPSBjb21waWxlTGVnZW5kcyhtb2RlbCk7XG4gIGlmIChsZWdlbmRzLmxlbmd0aCA+IDApIHtcbiAgICByb290R3JvdXAubGVnZW5kcyA9IGxlZ2VuZHM7XG4gIH1cbiAgcmV0dXJuIHJvb3RHcm91cDtcbn1cbiIsImltcG9ydCB7U3BlY30gZnJvbSAnLi4vc2NoZW1hL3NjaGVtYSc7XG5pbXBvcnQge1N0YWNrUHJvcGVydGllc30gZnJvbSAnLi9zdGFjayc7XG5cbmltcG9ydCB7WCwgWSwgREVUQUlMfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7aXNBZ2dyZWdhdGUsIGhhc30gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtpc01lYXN1cmV9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7UE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7Y29udGFpbnMsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbCc7XG5cbi8qKlxuICogQXVnbWVudCBjb25maWcubWFyayB3aXRoIHJ1bGUtYmFzZWQgZGVmYXVsdCB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTWFya0NvbmZpZyhzcGVjOiBTcGVjLCBzdGFjazogU3RhY2tQcm9wZXJ0aWVzKSB7XG4gICByZXR1cm4gZXh0ZW5kKFxuICAgICBbJ2ZpbGxlZCcsICdvcGFjaXR5JywgJ29yaWVudCcsICdhbGlnbiddLnJlZHVjZShmdW5jdGlvbihjZmcsIHByb3BlcnR5OiBzdHJpbmcpIHtcbiAgICAgICBjb25zdCB2YWx1ZSA9IHNwZWMuY29uZmlnLm1hcmtbcHJvcGVydHldO1xuICAgICAgIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICAgICAgIGNhc2UgJ2ZpbGxlZCc6XG4gICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgLy8gb25seSBwb2ludCBpcyBub3QgZmlsbGVkIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgICBjZmdbcHJvcGVydHldID0gc3BlYy5tYXJrICE9PSBQT0lOVDtcbiAgICAgICAgICAgfVxuICAgICAgICAgICBicmVhaztcbiAgICAgICAgIGNhc2UgJ29wYWNpdHknOlxuICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBjb250YWlucyhbUE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFXSwgc3BlYy5tYXJrKSkge1xuICAgICAgICAgICAgIC8vIHBvaW50LWJhc2VkIG1hcmtzIGFuZCBiYXJcbiAgICAgICAgICAgICBpZiAoIWlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpIHx8IGhhcyhzcGVjLmVuY29kaW5nLCBERVRBSUwpKSB7XG4gICAgICAgICAgICAgICBjZmdbcHJvcGVydHldID0gMC43O1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuICAgICAgICAgICBicmVhaztcbiAgICAgICAgIGNhc2UgJ29yaWVudCc6XG4gICAgICAgICAgIGlmIChzdGFjaykge1xuICAgICAgICAgICAgIC8vIEZvciBzdGFja2VkIGNoYXJ0LCBleHBsaWNpdGx5IHNwZWNpZmllZCBvcmllbnQgcHJvcGVydHkgd2lsbCBiZSBpZ25vcmVkLlxuICAgICAgICAgICAgIGNmZ1twcm9wZXJ0eV0gPSBzdGFjay5ncm91cGJ5Q2hhbm5lbCA9PT0gWSA/ICdob3Jpem9udGFsJyA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgfVxuICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgIGNmZ1twcm9wZXJ0eV0gPSBpc01lYXN1cmUoc3BlYy5lbmNvZGluZ1tYXSkgJiYgICFpc01lYXN1cmUoc3BlYy5lbmNvZGluZ1tZXSkgP1xuICAgICAgICAgICAgICAgLy8gaG9yaXpvbnRhbCBpZiBYIGlzIG1lYXN1cmUgYW5kIFkgaXMgZGltZW5zaW9uIG9yIHVuc3BlY2lmaWVkXG4gICAgICAgICAgICAgICAnaG9yaXpvbnRhbCcgOlxuICAgICAgICAgICAgICAgLy8gdmVydGljYWwgKHVuZGVmaW5lZCkgb3RoZXJ3aXNlLiAgVGhpcyBpbmNsdWRlcyB3aGVuXG4gICAgICAgICAgICAgICAvLyAtIFkgaXMgbWVhc3VyZSBhbmQgWCBpcyBkaW1lbnNpb24gb3IgdW5zcGVjaWZpZWRcbiAgICAgICAgICAgICAgIC8vIC0gYm90aCBYIGFuZCBZIGFyZSBtZWFzdXJlcyBvciBib3RoIGFyZSBkaW1lbnNpb25cbiAgICAgICAgICAgICAgIHVuZGVmaW5lZDsgIC8vXG4gICAgICAgICAgIH1cbiAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAvLyB0ZXh0LW9ubHlcbiAgICAgICAgIGNhc2UgJ2FsaWduJzpcbiAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2ZnW3Byb3BlcnR5XSA9IGhhcyhzcGVjLmVuY29kaW5nLCBYKSA/ICdjZW50ZXInIDogJ3JpZ2h0JztcbiAgICAgICAgICB9XG4gICAgICAgfVxuICAgICAgIHJldHVybiBjZmc7XG4gICAgIH0sIHt9KSxcbiAgICAgc3BlYy5jb25maWcubWFya1xuICAgKTtcbn1cbiIsImltcG9ydCAqIGFzIHZsRmllbGREZWYgZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtleHRlbmQsIGtleXMsIHZhbHMsIHJlZHVjZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtTdGFja1Byb3BlcnRpZXN9IGZyb20gJy4vc3RhY2snO1xuXG5pbXBvcnQge2F1dG9NYXhCaW5zfSBmcm9tICcuLi9iaW4nO1xuaW1wb3J0IHtDaGFubmVsLCBYLCBZLCBST1csIENPTFVNTn0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge1NPVVJDRSwgU1RBQ0tFRF9TQ0FMRSwgTEFZT1VULCBTVU1NQVJZfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7ZmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge3R5cGUgYXMgc2NhbGVUeXBlfSBmcm9tICcuL3NjYWxlJztcbmltcG9ydCB7cGFyc2VFeHByZXNzaW9uLCByYXdEb21haW59IGZyb20gJy4vdGltZSc7XG5cbmNvbnN0IERFRkFVTFRfTlVMTF9GSUxURVJTID0ge1xuICBub21pbmFsOiBmYWxzZSxcbiAgb3JkaW5hbDogZmFsc2UsXG4gIHF1YW50aXRhdGl2ZTogdHJ1ZSxcbiAgdGVtcG9yYWw6IHRydWVcbn07XG5cbi8qKlxuICogQ3JlYXRlIFZlZ2EncyBkYXRhIGFycmF5IGZyb20gYSBnaXZlbiBtb2RlbC5cbiAqXG4gKiBAcGFyYW0gIG1vZGVsXG4gKiBAcmV0dXJuIEFycmF5IG9mIFZlZ2EgZGF0YS5cbiAqICAgICAgICAgICAgICAgICBUaGlzIGFsd2F5cyBpbmNsdWRlcyBhIFwic291cmNlXCIgZGF0YSB0YWJsZS5cbiAqICAgICAgICAgICAgICAgICBJZiB0aGUgbW9kZWwgY29udGFpbnMgYWdncmVnYXRlIHZhbHVlLCB0aGlzIHdpbGwgYWxzbyBjcmVhdGVcbiAqICAgICAgICAgICAgICAgICBhZ2dyZWdhdGUgdGFibGUgYXMgd2VsbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVEYXRhKG1vZGVsOiBNb2RlbCk6IFZnRGF0YVtdIHtcbiAgY29uc3QgZGVmID0gW3NvdXJjZS5kZWYobW9kZWwpXTtcblxuICBjb25zdCBzdW1tYXJ5RGVmID0gc3VtbWFyeS5kZWYobW9kZWwpO1xuICBpZiAoc3VtbWFyeURlZikge1xuICAgIGRlZi5wdXNoKHN1bW1hcnlEZWYpO1xuICB9XG5cbiAgLy8gYXBwZW5kIG5vbi1wb3NpdGl2ZSBmaWx0ZXIgYXQgdGhlIGVuZCBmb3IgdGhlIGRhdGEgdGFibGVcbiAgZmlsdGVyTm9uUG9zaXRpdmVGb3JMb2coZGVmW2RlZi5sZW5ndGggLSAxXSwgbW9kZWwpO1xuXG4gIC8vIGFkZCBzdGF0cyBmb3IgbGF5b3V0IGNhbGN1bGF0aW9uXG4gIGNvbnN0IGxheW91dERlZiA9IGxheW91dC5kZWYobW9kZWwpO1xuICBpZihsYXlvdXREZWYpIHtcbiAgICBkZWYucHVzaChsYXlvdXREZWYpO1xuICB9XG5cbiAgLy8gU3RhY2tcbiAgY29uc3Qgc3RhY2tEZWYgPSBtb2RlbC5zdGFjaygpO1xuICBpZiAoc3RhY2tEZWYpIHtcbiAgICBkZWYucHVzaChzdGFjay5kZWYobW9kZWwsIHN0YWNrRGVmKSk7XG4gIH1cblxuICByZXR1cm4gZGVmLmNvbmNhdChcbiAgICBkYXRlcy5kZWZzKG1vZGVsKSAvLyBUaW1lIGRvbWFpbiB0YWJsZXNcbiAgKTtcbn1cblxuLy8gVE9ETzogQ29uc29saWRhdGUgYWxsIFZlZ2EgaW50ZXJmYWNlc1xuaW50ZXJmYWNlIFZnRGF0YSB7XG4gIG5hbWU6IHN0cmluZztcbiAgc291cmNlPzogc3RyaW5nO1xuICB2YWx1ZXM/OiBhbnk7XG4gIGZvcm1hdD86IGFueTtcbiAgdXJsPzogYW55O1xuICB0cmFuc2Zvcm0/OiBhbnk7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2Ugc291cmNlIHtcbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZihtb2RlbDogTW9kZWwpOiBWZ0RhdGEge1xuICAgIHZhciBzb3VyY2U6VmdEYXRhID0ge25hbWU6IFNPVVJDRX07XG5cbiAgICAvLyBEYXRhIHNvdXJjZSAodXJsIG9yIGlubGluZSlcbiAgICBpZiAobW9kZWwuaGFzVmFsdWVzKCkpIHtcbiAgICAgIHNvdXJjZS52YWx1ZXMgPSBtb2RlbC5kYXRhKCkudmFsdWVzO1xuICAgICAgc291cmNlLmZvcm1hdCA9IHt0eXBlOiAnanNvbid9O1xuICAgIH0gZWxzZSB7XG4gICAgICBzb3VyY2UudXJsID0gbW9kZWwuZGF0YSgpLnVybDtcbiAgICAgIHNvdXJjZS5mb3JtYXQgPSB7dHlwZTogbW9kZWwuZGF0YSgpLmZvcm1hdFR5cGV9O1xuICAgIH1cblxuICAgIC8vIFNldCBkYXRhJ3MgZm9ybWF0LnBhcnNlIGlmIG5lZWRlZFxuICAgIHZhciBwYXJzZSA9IGZvcm1hdFBhcnNlKG1vZGVsKTtcbiAgICBpZiAocGFyc2UpIHtcbiAgICAgIHNvdXJjZS5mb3JtYXQucGFyc2UgPSBwYXJzZTtcbiAgICB9XG5cbiAgICBzb3VyY2UudHJhbnNmb3JtID0gdHJhbnNmb3JtKG1vZGVsKTtcbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0UGFyc2UobW9kZWw6IE1vZGVsKSB7XG4gICAgY29uc3QgY2FsY0ZpZWxkTWFwID0gKG1vZGVsLmRhdGEoKS5jYWxjdWxhdGUgfHwgW10pLnJlZHVjZShmdW5jdGlvbihmaWVsZE1hcCwgZm9ybXVsYSkge1xuICAgICAgZmllbGRNYXBbZm9ybXVsYS5maWVsZF0gPSB0cnVlO1xuICAgICAgcmV0dXJuIGZpZWxkTWFwO1xuICAgIH0sIHt9KTtcblxuICAgIGxldCBwYXJzZTtcbiAgICAvLyB1c2UgZm9yRWFjaCByYXRoZXIgdGhhbiByZWR1Y2Ugc28gdGhhdCBpdCBjYW4gcmV0dXJuIHVuZGVmaW5lZFxuICAgIC8vIGlmIHRoZXJlIGlzIG5vIHBhcnNlIG5lZWRlZFxuICAgIG1vZGVsLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gICAgICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICAgICAgcGFyc2UgPSBwYXJzZSB8fCB7fTtcbiAgICAgICAgcGFyc2VbZmllbGREZWYuZmllbGRdID0gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICAgICAgaWYgKHZsRmllbGREZWYuaXNDb3VudChmaWVsZERlZikgfHwgY2FsY0ZpZWxkTWFwW2ZpZWxkRGVmLmZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwYXJzZSA9IHBhcnNlIHx8IHt9O1xuICAgICAgICBwYXJzZVtmaWVsZERlZi5maWVsZF0gPSAnbnVtYmVyJztcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGFyc2U7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgVmVnYSB0cmFuc2Zvcm1zIGZvciB0aGUgc291cmNlIGRhdGEgdGFibGUuICBUaGlzIGNhbiBpbmNsdWRlXG4gICAqIHRyYW5zZm9ybXMgZm9yIHRpbWUgdW5pdCwgYmlubmluZyBhbmQgZmlsdGVyaW5nLlxuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBudWxsIGZpbHRlciBjb21lcyBmaXJzdCBzbyB0cmFuc2Zvcm1zIGFyZSBub3QgcGVyZm9ybWVkIG9uIG51bGwgdmFsdWVzXG4gICAgLy8gdGltZSBhbmQgYmluIHNob3VsZCBjb21lIGJlZm9yZSBmaWx0ZXIgc28gd2UgY2FuIGZpbHRlciBieSB0aW1lIGFuZCBiaW5cbiAgICByZXR1cm4gbnVsbEZpbHRlclRyYW5zZm9ybShtb2RlbCkuY29uY2F0KFxuICAgICAgZm9ybXVsYVRyYW5zZm9ybShtb2RlbCksXG4gICAgICB0aW1lVHJhbnNmb3JtKG1vZGVsKSxcbiAgICAgIGJpblRyYW5zZm9ybShtb2RlbCksXG4gICAgICBmaWx0ZXJUcmFuc2Zvcm0obW9kZWwpXG4gICAgKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB0aW1lVHJhbnNmb3JtKG1vZGVsOiBNb2RlbCkge1xuICAgIHJldHVybiBtb2RlbC5yZWR1Y2UoZnVuY3Rpb24odHJhbnNmb3JtLCBmaWVsZERlZjogRmllbGREZWYsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICAgIGNvbnN0IHJlZiA9IGZpZWxkKGZpZWxkRGVmLCB7IG5vZm46IHRydWUsIGRhdHVtOiB0cnVlIH0pO1xuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMICYmIGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgICAgZmllbGQ6IGZpZWxkKGZpZWxkRGVmKSxcbiAgICAgICAgICBleHByOiBwYXJzZUV4cHJlc3Npb24oZmllbGREZWYudGltZVVuaXQsIHJlZilcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJhbnNmb3JtO1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBiaW5UcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIG1vZGVsLnJlZHVjZShmdW5jdGlvbih0cmFuc2Zvcm0sIGZpZWxkRGVmOiBGaWVsZERlZiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgICAgY29uc3QgYmluID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuYmluO1xuICAgICAgaWYgKGJpbikge1xuICAgICAgICBsZXQgYmluVHJhbnMgPSBleHRlbmQoe1xuICAgICAgICAgICAgdHlwZTogJ2JpbicsXG4gICAgICAgICAgICBmaWVsZDogZmllbGREZWYuZmllbGQsXG4gICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgc3RhcnQ6IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX3N0YXJ0J30pLFxuICAgICAgICAgICAgICBtaWQ6IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX21pZCd9KSxcbiAgICAgICAgICAgICAgZW5kOiBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19lbmQnfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIGlmIGJpbiBpcyBhbiBvYmplY3QsIGxvYWQgcGFyYW1ldGVyIGhlcmUhXG4gICAgICAgICAgdHlwZW9mIGJpbiA9PT0gJ2Jvb2xlYW4nID8ge30gOiBiaW5cbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoIWJpblRyYW5zLm1heGJpbnMgJiYgIWJpblRyYW5zLnN0ZXApIHtcbiAgICAgICAgICAvLyBpZiBib3RoIG1heGJpbnMgYW5kIHN0ZXAgYXJlIHNwZWNpZmllZCwgbmVlZCB0byBhdXRvbWF0aWNhbGx5IGRldGVybWluZSBiaW5cbiAgICAgICAgICBiaW5UcmFucy5tYXhiaW5zID0gYXV0b01heEJpbnMoY2hhbm5lbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc2Zvcm0ucHVzaChiaW5UcmFucyk7XG4gICAgICAgIGlmIChzY2FsZVR5cGUoZmllbGREZWYsIGNoYW5uZWwsIG1vZGVsLm1hcmsoKSkgPT09ICdvcmRpbmFsJykge1xuICAgICAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICAgIGZpZWxkOiBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19yYW5nZSd9KSxcbiAgICAgICAgICAgIGV4cHI6IGZpZWxkKGZpZWxkRGVmLCB7ZGF0dW06IHRydWUsIGJpblN1ZmZpeDogJ19zdGFydCd9KSArXG4gICAgICAgICAgICAgICAgICAnKyBcXCctXFwnICsnICtcbiAgICAgICAgICAgICAgICAgIGZpZWxkKGZpZWxkRGVmLCB7ZGF0dW06IHRydWUsIGJpblN1ZmZpeDogJ19lbmQnfSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgICB9LCBbXSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiBBbiBhcnJheSB0aGF0IG1pZ2h0IGNvbnRhaW4gYSBmaWx0ZXIgdHJhbnNmb3JtIGZvciBmaWx0ZXJpbmcgbnVsbCB2YWx1ZSBiYXNlZCBvbiBmaWx0ZXJOdWwgY29uZmlnXG4gICAqL1xuICBleHBvcnQgZnVuY3Rpb24gbnVsbEZpbHRlclRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgICBjb25zdCBmaWx0ZXJOdWxsID0gbW9kZWwuY29uZmlnKCkuZmlsdGVyTnVsbDtcbiAgICBjb25zdCBmaWx0ZXJlZEZpZWxkcyA9IGtleXMobW9kZWwucmVkdWNlKGZ1bmN0aW9uKGFnZ3JlZ2F0b3IsIGZpZWxkRGVmOiBGaWVsZERlZikge1xuICAgICAgaWYgKGZpbHRlck51bGwgfHxcbiAgICAgICAgKGZpbHRlck51bGwgPT09IHVuZGVmaW5lZCAmJiBmaWVsZERlZi5maWVsZCAmJiBmaWVsZERlZi5maWVsZCAhPT0gJyonICYmIERFRkFVTFRfTlVMTF9GSUxURVJTW2ZpZWxkRGVmLnR5cGVdKSkge1xuICAgICAgICBhZ2dyZWdhdG9yW2ZpZWxkRGVmLmZpZWxkXSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWdncmVnYXRvcjtcbiAgICB9LCB7fSkpO1xuXG4gICAgcmV0dXJuIGZpbHRlcmVkRmllbGRzLmxlbmd0aCA+IDAgP1xuICAgICAgW3tcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIHRlc3Q6IGZpbHRlcmVkRmllbGRzLm1hcChmdW5jdGlvbihmaWVsZE5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gJ2RhdHVtLicgKyBmaWVsZE5hbWUgKyAnIT09bnVsbCc7XG4gICAgICAgIH0pLmpvaW4oJyAmJiAnKVxuICAgICAgfV0gOiBbXTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gICAgdmFyIGZpbHRlciA9IG1vZGVsLmRhdGEoKS5maWx0ZXI7XG4gICAgcmV0dXJuIGZpbHRlciA/IFt7XG4gICAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgICB0ZXN0OiBmaWx0ZXJcbiAgICB9XSA6IFtdO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGZvcm11bGFUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIChtb2RlbC5kYXRhKCkuY2FsY3VsYXRlIHx8IFtdKS5yZWR1Y2UoZnVuY3Rpb24odHJhbnNmb3JtLCBmb3JtdWxhKSB7XG4gICAgICB0cmFuc2Zvcm0ucHVzaChleHRlbmQoe3R5cGU6ICdmb3JtdWxhJ30sIGZvcm11bGEpKTtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm07XG4gICAgfSwgW10pO1xuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgbGF5b3V0IHtcblxuICBleHBvcnQgZnVuY3Rpb24gZGVmKG1vZGVsOiBNb2RlbCk6IFZnRGF0YSB7XG4gICAgbGV0IHN1bW1hcml6ZSA9IFtdO1xuICAgIGxldCBmb3JtdWxhcyA9IFtdO1xuXG4gICAgLy8gVE9ETzogaGFuZGxlIFwiZml0XCIgbW9kZVxuICAgIGlmIChtb2RlbC5oYXMoWCkgJiYgbW9kZWwuaXNPcmRpbmFsU2NhbGUoWCkpIHtcbiAgICAgIGNvbnN0IHhTY2FsZSA9IG1vZGVsLmZpZWxkRGVmKFgpLnNjYWxlO1xuICAgICAgY29uc3QgeEhhc0RvbWFpbiA9IHhTY2FsZS5kb21haW4gaW5zdGFuY2VvZiBBcnJheTtcbiAgICAgIGlmICgheEhhc0RvbWFpbikge1xuICAgICAgICBzdW1tYXJpemUucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCddXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgeENhcmRpbmFsaXR5ID0geEhhc0RvbWFpbiA/IHhTY2FsZS5kb21haW4ubGVuZ3RoIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZmllbGQoWCwge2RhdHVtOiB0cnVlLCBwcmVmbjogJ2Rpc3RpbmN0Xyd9KTtcbiAgICAgIGZvcm11bGFzLnB1c2goe1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGZpZWxkOiAnY2VsbFdpZHRoJyxcbiAgICAgICAgZXhwcjogJygnICsgeENhcmRpbmFsaXR5ICsgJyArICcgKyB4U2NhbGUucGFkZGluZyArICcpICogJyArIHhTY2FsZS5iYW5kV2lkdGhcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChtb2RlbC5oYXMoWSkgJiYgbW9kZWwuaXNPcmRpbmFsU2NhbGUoWSkpIHtcbiAgICAgIGNvbnN0IHlTY2FsZSA9IG1vZGVsLmZpZWxkRGVmKFkpLnNjYWxlO1xuICAgICAgY29uc3QgeUhhc0RvbWFpbiA9IHlTY2FsZS5kb21haW4gaW5zdGFuY2VvZiBBcnJheTtcblxuICAgICAgaWYgKCF5SGFzRG9tYWluKSB7XG4gICAgICAgIHN1bW1hcml6ZS5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSksXG4gICAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHlDYXJkaW5hbGl0eSA9IHlIYXNEb21haW4gPyB5U2NhbGUuZG9tYWluLmxlbmd0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmZpZWxkKFksIHtkYXR1bTogdHJ1ZSwgcHJlZm46ICdkaXN0aW5jdF8nfSk7XG4gICAgICBmb3JtdWxhcy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBmaWVsZDogJ2NlbGxIZWlnaHQnLFxuICAgICAgICBleHByOiAnKCcgKyB5Q2FyZGluYWxpdHkgKyAnICsgJyArIHlTY2FsZS5wYWRkaW5nICsgJykgKiAnICsgeVNjYWxlLmJhbmRXaWR0aFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgbGF5b3V0ID0gbW9kZWwubGF5b3V0KCk7XG5cbiAgICBpZiAobW9kZWwuaGFzKENPTFVNTikpIHtcbiAgICAgIGNvbnN0IGxheW91dENlbGxXaWR0aCA9IGxheW91dC5jZWxsV2lkdGg7XG4gICAgICBjb25zdCBjZWxsV2lkdGggPSB0eXBlb2YgbGF5b3V0Q2VsbFdpZHRoICE9PSAnbnVtYmVyJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0dW0uJyArIGxheW91dENlbGxXaWR0aC5maWVsZCA6XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXRDZWxsV2lkdGg7XG4gICAgICBjb25zdCBjb2xTY2FsZSA9IG1vZGVsLmZpZWxkRGVmKENPTFVNTikuc2NhbGU7XG4gICAgICBjb25zdCBjb2xIYXNEb21haW4gPSBjb2xTY2FsZS5kb21haW4gaW5zdGFuY2VvZiBBcnJheTtcbiAgICAgIGlmICghY29sSGFzRG9tYWluKSB7XG4gICAgICAgIHN1bW1hcml6ZS5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoQ09MVU1OKSxcbiAgICAgICAgICBvcHM6IFsnZGlzdGluY3QnXVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29sQ2FyZGluYWxpdHkgPSBjb2xIYXNEb21haW4gPyBjb2xTY2FsZS5kb21haW4ubGVuZ3RoIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5maWVsZChDT0xVTU4sIHtkYXR1bTogdHJ1ZSwgcHJlZm46ICdkaXN0aW5jdF8nfSk7XG4gICAgICBmb3JtdWxhcy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBmaWVsZDogJ3dpZHRoJyxcbiAgICAgICAgZXhwcjogJygnICsgY2VsbFdpZHRoICsgJyArICcgKyBjb2xTY2FsZS5wYWRkaW5nICsgJyknICsgJyAqICcgKyBjb2xDYXJkaW5hbGl0eVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG1vZGVsLmhhcyhST1cpKSB7XG4gICAgICBjb25zdCBsYXlvdXRDZWxsSGVpZ2h0ID0gbGF5b3V0LmNlbGxIZWlnaHQ7XG4gICAgICBjb25zdCBjZWxsSGVpZ2h0ID0gdHlwZW9mIGxheW91dENlbGxIZWlnaHQgIT09ICdudW1iZXInID9cbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXR1bS4nICsgbGF5b3V0Q2VsbEhlaWdodC5maWVsZCA6XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXRDZWxsSGVpZ2h0O1xuICAgICAgY29uc3Qgcm93U2NhbGUgPSBtb2RlbC5maWVsZERlZihST1cpLnNjYWxlO1xuICAgICAgY29uc3Qgcm93SGFzRG9tYWluID0gcm93U2NhbGUuZG9tYWluIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgICBpZiAoIXJvd0hhc0RvbWFpbikge1xuICAgICAgICBzdW1tYXJpemUucHVzaCh7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFJPVyksXG4gICAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJvd0NhcmRpbmFsaXR5ID0gcm93SGFzRG9tYWluID8gcm93U2NhbGUuZG9tYWluLmxlbmd0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZmllbGQoUk9XLCB7ZGF0dW06IHRydWUsIHByZWZuOiAnZGlzdGluY3RfJ30pO1xuICAgICAgZm9ybXVsYXMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgZmllbGQ6ICdoZWlnaHQnLFxuICAgICAgICBleHByOiAnKCcgKyBjZWxsSGVpZ2h0ICsgJysnICsgcm93U2NhbGUucGFkZGluZyArICcpJyArICcgKiAnICsgcm93Q2FyZGluYWxpdHlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChmb3JtdWxhcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gc3VtbWFyaXplLmxlbmd0aCA+IDAgPyB7XG4gICAgICAgIG5hbWU6IExBWU9VVCxcbiAgICAgICAgc291cmNlOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgICBzdW1tYXJpemU6IHN1bW1hcml6ZVxuICAgICAgICAgIH1dLmNvbmNhdChmb3JtdWxhcylcbiAgICAgIH0gOiB7XG4gICAgICAgIG5hbWU6IExBWU9VVCxcbiAgICAgICAgdmFsdWVzOiBbe31dLFxuICAgICAgICB0cmFuc2Zvcm06IGZvcm11bGFzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIHN1bW1hcnkge1xuICBleHBvcnQgZnVuY3Rpb24gZGVmKG1vZGVsOiBNb2RlbCk6VmdEYXRhIHtcbiAgICAvKiBkaWN0IHNldCBmb3IgZGltZW5zaW9ucyAqL1xuICAgIHZhciBkaW1zID0ge307XG5cbiAgICAvKiBkaWN0aW9uYXJ5IG1hcHBpbmcgZmllbGQgbmFtZSA9PiBkaWN0IHNldCBvZiBhZ2dyZWdhdGlvbiBmdW5jdGlvbnMgKi9cbiAgICB2YXIgbWVhcyA9IHt9O1xuXG4gICAgdmFyIGhhc0FnZ3JlZ2F0ZSA9IGZhbHNlO1xuXG4gICAgbW9kZWwuZm9yRWFjaChmdW5jdGlvbihmaWVsZERlZjogRmllbGREZWYsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICAgIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgaGFzQWdncmVnYXRlID0gdHJ1ZTtcbiAgICAgICAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jykge1xuICAgICAgICAgIG1lYXNbJyonXSA9IG1lYXNbJyonXSB8fCB7fTtcbiAgICAgICAgICBtZWFzWycqJ10uY291bnQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdID0gbWVhc1tmaWVsZERlZi5maWVsZF0gfHwge307XG4gICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF1bZmllbGREZWYuYWdncmVnYXRlXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgICBkaW1zW2ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX3N0YXJ0J30pXSA9IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX3N0YXJ0J30pO1xuICAgICAgICAgIGRpbXNbZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdfbWlkJ30pXSA9IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX21pZCd9KTtcbiAgICAgICAgICBkaW1zW2ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnX2VuZCd9KV0gPSBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19lbmQnfSk7XG5cbiAgICAgICAgICBpZiAoc2NhbGVUeXBlKGZpZWxkRGVmLCBjaGFubmVsLCBtb2RlbC5tYXJrKCkpID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgICAgIC8vIGFsc28gcHJvZHVjZSBiaW5fcmFuZ2UgaWYgdGhlIGJpbm5lZCBmaWVsZCB1c2Ugb3JkaW5hbCBzY2FsZVxuICAgICAgICAgICAgZGltc1tmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19yYW5nZSd9KV0gPSBmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ19yYW5nZSd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGltc1tmaWVsZChmaWVsZERlZildID0gZmllbGQoZmllbGREZWYpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgZ3JvdXBieSA9IHZhbHMoZGltcyk7XG5cbiAgICAvLyBzaG9ydC1mb3JtYXQgc3VtbWFyaXplIG9iamVjdCBmb3IgVmVnYSdzIGFnZ3JlZ2F0ZSB0cmFuc2Zvcm1cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhL3dpa2kvRGF0YS1UcmFuc2Zvcm1zIy1hZ2dyZWdhdGVcbiAgICB2YXIgc3VtbWFyaXplID0gcmVkdWNlKG1lYXMsIGZ1bmN0aW9uKGFnZ3JlZ2F0b3IsIGZuRGljdFNldCwgZmllbGQpIHtcbiAgICAgIGFnZ3JlZ2F0b3JbZmllbGRdID0ga2V5cyhmbkRpY3RTZXQpO1xuICAgICAgcmV0dXJuIGFnZ3JlZ2F0b3I7XG4gICAgfSwge30pO1xuXG4gICAgaWYgKGhhc0FnZ3JlZ2F0ZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogU1VNTUFSWSxcbiAgICAgICAgc291cmNlOiBTT1VSQ0UsXG4gICAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgICBncm91cGJ5OiBncm91cGJ5LFxuICAgICAgICAgIHN1bW1hcml6ZTogc3VtbWFyaXplXG4gICAgICAgIH1dXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIHN0YWNrIHtcbiAgLyoqXG4gICAqIEFkZCBzdGFja2VkIGRhdGEgc291cmNlLCBmb3IgZmVlZGluZyB0aGUgc2hhcmVkIHNjYWxlLlxuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZihtb2RlbDogTW9kZWwsIHN0YWNrUHJvcHM6IFN0YWNrUHJvcGVydGllcyk6VmdEYXRhIHtcbiAgICB2YXIgZ3JvdXBieUNoYW5uZWwgPSBzdGFja1Byb3BzLmdyb3VwYnlDaGFubmVsO1xuICAgIHZhciBmaWVsZENoYW5uZWwgPSBzdGFja1Byb3BzLmZpZWxkQ2hhbm5lbDtcbiAgICB2YXIgZmFjZXRGaWVsZHMgPSAobW9kZWwuaGFzKENPTFVNTikgPyBbbW9kZWwuZmllbGQoQ09MVU1OKV0gOiBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KChtb2RlbC5oYXMoUk9XKSA/IFttb2RlbC5maWVsZChST1cpXSA6IFtdKSk7XG5cbiAgICB2YXIgc3RhY2tlZDpWZ0RhdGEgPSB7XG4gICAgICBuYW1lOiBTVEFDS0VEX1NDQUxFLFxuICAgICAgc291cmNlOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIC8vIGdyb3VwIGJ5IGNoYW5uZWwgYW5kIG90aGVyIGZhY2V0c1xuICAgICAgICBncm91cGJ5OiBbbW9kZWwuZmllbGQoZ3JvdXBieUNoYW5uZWwpXS5jb25jYXQoZmFjZXRGaWVsZHMpLFxuICAgICAgICBzdW1tYXJpemU6IFt7b3BzOiBbJ3N1bSddLCBmaWVsZDogbW9kZWwuZmllbGQoZmllbGRDaGFubmVsKX1dXG4gICAgICB9XVxuICAgIH07XG5cbiAgICByZXR1cm4gc3RhY2tlZDtcbiAgfTtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBkYXRlcyB7XG4gIC8qKlxuICAgKiBBZGQgZGF0YSBzb3VyY2UgZm9yIHdpdGggZGF0ZXMgZm9yIGFsbCBtb250aHMsIGRheXMsIGhvdXJzLCAuLi4gYXMgbmVlZGVkLlxuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIGRlZnMobW9kZWw6IE1vZGVsKSB7XG4gICAgbGV0IGFscmVhZHlBZGRlZCA9IHt9O1xuXG4gICAgcmV0dXJuIG1vZGVsLnJlZHVjZShmdW5jdGlvbihhZ2dyZWdhdG9yLCBmaWVsZERlZjogRmllbGREZWYsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgICAgIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICBjb25zdCBkb21haW4gPSByYXdEb21haW4oZmllbGREZWYudGltZVVuaXQsIGNoYW5uZWwpO1xuICAgICAgICBpZiAoZG9tYWluICYmICFhbHJlYWR5QWRkZWRbZmllbGREZWYudGltZVVuaXRdKSB7XG4gICAgICAgICAgYWxyZWFkeUFkZGVkW2ZpZWxkRGVmLnRpbWVVbml0XSA9IHRydWU7XG4gICAgICAgICAgYWdncmVnYXRvci5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IGZpZWxkRGVmLnRpbWVVbml0LFxuICAgICAgICAgICAgdmFsdWVzOiBkb21haW4sXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICAgICAgZmllbGQ6ICdkYXRlJyxcbiAgICAgICAgICAgICAgZXhwcjogcGFyc2VFeHByZXNzaW9uKGZpZWxkRGVmLnRpbWVVbml0LCAnZGF0dW0uZGF0YScsIHRydWUpXG4gICAgICAgICAgICB9XVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYWdncmVnYXRvcjtcbiAgICB9LCBbXSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlck5vblBvc2l0aXZlRm9yTG9nKGRhdGFUYWJsZSwgbW9kZWw6IE1vZGVsKSB7XG4gIG1vZGVsLmZvckVhY2goZnVuY3Rpb24oXywgY2hhbm5lbCkge1xuICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGU7XG4gICAgaWYgKHNjYWxlICYmIHNjYWxlLnR5cGUgPT09ICdsb2cnKSB7XG4gICAgICBkYXRhVGFibGUudHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgICAgdGVzdDogbW9kZWwuZmllbGQoY2hhbm5lbCwge2RhdHVtOiB0cnVlfSkgKyAnID4gMCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iLCJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtleHRlbmR9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtDT0xVTU4sIFJPVywgWCwgWX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcblxuaW1wb3J0IHtjb21waWxlQXhpc30gZnJvbSAnLi9heGlzJztcbmltcG9ydCB7Y29tcGlsZVNjYWxlc30gZnJvbSAnLi9zY2FsZSc7XG5cbi8qKlxuICogcmV0dXJuIG1peGlucyB0aGF0IGNvbnRhaW5zIG1hcmtzLCBzY2FsZXMsIGFuZCBheGVzIGZvciB0aGUgcm9vdEdyb3VwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmYWNldE1peGlucyhtb2RlbDogTW9kZWwsIG1hcmtzKSB7XG4gIGNvbnN0IGxheW91dCA9IG1vZGVsLmxheW91dCgpO1xuICBjb25zdCBjZWxsQ29uZmlnID0gbW9kZWwuY29uZmlnKCkuY2VsbDtcbiAgY29uc3QgY2VsbFdpZHRoOiBhbnkgPSAhbW9kZWwuaGFzKENPTFVNTikgP1xuICAgICAge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9fSA6ICAgICAvLyBjZWxsV2lkdGggPSB3aWR0aCAtLSBqdXN0IHVzZSBncm91cCdzXG4gICAgdHlwZW9mIGxheW91dC5jZWxsV2lkdGggIT09ICdudW1iZXInID9cbiAgICAgIHtzY2FsZTogbW9kZWwuc2NhbGVOYW1lKENPTFVNTiksIGJhbmQ6IHRydWV9IDogLy8gYmFuZFNpemUgb2YgdGhlIHNjYWxlXG4gICAgICB7dmFsdWU6IGxheW91dC5jZWxsV2lkdGh9OyAgICAgIC8vIHN0YXRpYyB2YWx1ZVxuXG4gIGNvbnN0IGNlbGxIZWlnaHQ6IGFueSA9ICFtb2RlbC5oYXMoUk9XKSA/XG4gICAgICB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fSA6ICAvLyBjZWxsSGVpZ2h0ID0gaGVpZ2h0IC0tIGp1c3QgdXNlIGdyb3VwJ3NcbiAgICB0eXBlb2YgbGF5b3V0LmNlbGxIZWlnaHQgIT09ICdudW1iZXInID9cbiAgICAgIHtzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFJPVyksIGJhbmQ6IHRydWV9IDogIC8vIGJhbmRTaXplIG9mIHRoZSBzY2FsZVxuICAgICAge3ZhbHVlOiBsYXlvdXQuY2VsbEhlaWdodH07ICAgLy8gc3RhdGljIHZhbHVlXG5cbiAgbGV0IGZhY2V0R3JvdXBQcm9wZXJ0aWVzOiBhbnkgPSB7XG4gICAgd2lkdGg6IGNlbGxXaWR0aCxcbiAgICBoZWlnaHQ6IGNlbGxIZWlnaHRcbiAgfTtcblxuICAvLyBhZGQgY29uZmlncyB0aGF0IGFyZSB0aGUgcmVzdWx0aW5nIGdyb3VwIG1hcmtzIHByb3BlcnRpZXNcbiAgWydjbGlwJywgJ2ZpbGwnLCAnZmlsbE9wYWNpdHknLCAnc3Ryb2tlJywgJ3N0cm9rZVdpZHRoJyxcbiAgICAnc3Ryb2tlT3BhY2l0eScsICdzdHJva2VEYXNoJywgJ3N0cm9rZURhc2hPZmZzZXQnXVxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNlbGxDb25maWdbcHJvcGVydHldO1xuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZmFjZXRHcm91cFByb3BlcnRpZXNbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgbGV0IHJvb3RNYXJrcyA9IFtdLCByb290QXhlcyA9IFtdLCBmYWNldEtleXMgPSBbXSwgY2VsbEF4ZXMgPSBbXTtcbiAgY29uc3QgaGFzUm93ID0gbW9kZWwuaGFzKFJPVyksIGhhc0NvbCA9IG1vZGVsLmhhcyhDT0xVTU4pO1xuXG4gIC8vIFRPRE8oIzkwKTogYWRkIHByb3BlcnR5IHRvIGtlZXAgYXhlcyBpbiBjZWxscyBldmVuIGlmIHJvdyBpcyBlbmNvZGVkXG4gIGlmIChoYXNSb3cpIHtcbiAgICBpZiAoIW1vZGVsLmlzRGltZW5zaW9uKFJPVykpIHtcbiAgICAgIC8vIFRPRE86IGFkZCBlcnJvciB0byBtb2RlbCBpbnN0ZWFkXG4gICAgICB1dGlsLmVycm9yKCdSb3cgZW5jb2Rpbmcgc2hvdWxkIGJlIG9yZGluYWwuJyk7XG4gICAgfVxuICAgIGZhY2V0R3JvdXBQcm9wZXJ0aWVzLnkgPSB7XG4gICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFJPVyksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoUk9XKSxcbiAgICAgIG9mZnNldDogbW9kZWwuZmllbGREZWYoUk9XKS5zY2FsZS5wYWRkaW5nIC8gMlxuICAgIH07XG5cbiAgICBmYWNldEtleXMucHVzaChtb2RlbC5maWVsZChST1cpKTtcbiAgICByb290QXhlcy5wdXNoKGNvbXBpbGVBeGlzKFJPVywgbW9kZWwpKTtcbiAgICBpZiAobW9kZWwuaGFzKFgpKSB7XG4gICAgICAvLyBJZiBoYXMgWCwgcHJlcGVuZCBhIGdyb3VwIGZvciBzaGFyZWQgeC1heGVzIGluIHRoZSByb290IGdyb3VwJ3MgbWFya3NcbiAgICAgIHJvb3RNYXJrcy5wdXNoKGdldFhBeGVzR3JvdXAobW9kZWwsIGNlbGxXaWR0aCwgaGFzQ29sKSk7XG4gICAgfVxuICAgIGNvbnN0IHJvd0F4aXMgPSBtb2RlbC5maWVsZERlZihST1cpLmF4aXM7XG4gICAgaWYgKHR5cGVvZiByb3dBeGlzID09PSAnYm9vbGVhbicgfHwgcm93QXhpcy5ncmlkICE9PSBmYWxzZSkge1xuICAgICAgcm9vdE1hcmtzLnB1c2goZ2V0Um93R3JpZEdyb3VwKG1vZGVsLCBjZWxsSGVpZ2h0KSk7XG4gICAgfVxuICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgcm93XG4gICAgaWYgKG1vZGVsLmhhcyhYKSkgeyAvLyBrZWVwIHggYXhpcyBpbiB0aGUgY2VsbFxuICAgICAgY2VsbEF4ZXMucHVzaChjb21waWxlQXhpcyhYLCBtb2RlbCkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE8oIzkwKTogYWRkIHByb3BlcnR5IHRvIGtlZXAgYXhlcyBpbiBjZWxscyBldmVuIGlmIGNvbHVtbiBpcyBlbmNvZGVkXG4gIGlmIChoYXNDb2wpIHtcbiAgICBpZiAoIW1vZGVsLmlzRGltZW5zaW9uKENPTFVNTikpIHtcbiAgICAgIC8vIFRPRE86IGFkZCBlcnJvciB0byBtb2RlbCBpbnN0ZWFkXG4gICAgICB1dGlsLmVycm9yKCdDb2wgZW5jb2Rpbmcgc2hvdWxkIGJlIG9yZGluYWwuJyk7XG4gICAgfVxuICAgIGZhY2V0R3JvdXBQcm9wZXJ0aWVzLnggPSB7XG4gICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKENPTFVNTiksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoQ09MVU1OKSxcbiAgICAgIG9mZnNldDogbW9kZWwuZmllbGREZWYoQ09MVU1OKS5zY2FsZS5wYWRkaW5nIC8gMlxuICAgIH07XG5cbiAgICBmYWNldEtleXMucHVzaChtb2RlbC5maWVsZChDT0xVTU4pKTtcbiAgICByb290QXhlcy5wdXNoKGNvbXBpbGVBeGlzKENPTFVNTiwgbW9kZWwpKTtcblxuICAgIGlmIChtb2RlbC5oYXMoWSkpIHtcbiAgICAgIC8vIElmIGhhcyBZLCBwcmVwZW5kIGEgZ3JvdXAgZm9yIHNoYXJlZCB5LWF4ZXMgaW4gdGhlIHJvb3QgZ3JvdXAncyBtYXJrc1xuICAgICAgcm9vdE1hcmtzLnB1c2goZ2V0WUF4ZXNHcm91cChtb2RlbCwgY2VsbEhlaWdodCwgaGFzUm93KSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29sQXhpcyA9IG1vZGVsLmZpZWxkRGVmKENPTFVNTikuYXhpcztcbiAgICBpZiAodHlwZW9mIGNvbEF4aXMgPT09ICdib29sZWFuJyB8fCBjb2xBeGlzLmdyaWQgIT09IGZhbHNlKSB7XG4gICAgICByb290TWFya3MucHVzaChnZXRDb2x1bW5HcmlkR3JvdXAobW9kZWwsIGNlbGxXaWR0aCkpO1xuICAgIH1cbiAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIGNvbHVtblxuICAgIGlmIChtb2RlbC5oYXMoWSkpIHsgLy8ga2VlcCB5IGF4aXMgaW4gdGhlIGNlbGxcbiAgICAgIGNlbGxBeGVzLnB1c2goY29tcGlsZUF4aXMoWSwgbW9kZWwpKTtcbiAgICB9XG4gIH1cbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICBsZXQgZmFjZXRHcm91cDogYW55ID0ge1xuICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICdjZWxsJyxcbiAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIGZyb206IHtcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgdHJhbnNmb3JtOiBbe3R5cGU6ICdmYWNldCcsIGdyb3VwYnk6IGZhY2V0S2V5c31dXG4gICAgfSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB1cGRhdGU6IGZhY2V0R3JvdXBQcm9wZXJ0aWVzXG4gICAgfSxcbiAgICBtYXJrczogbWFya3NcbiAgfTtcbiAgaWYgKGNlbGxBeGVzLmxlbmd0aCA+IDApIHtcbiAgICBmYWNldEdyb3VwLmF4ZXMgPSBjZWxsQXhlcztcbiAgfVxuICByb290TWFya3MucHVzaChmYWNldEdyb3VwKTtcblxuICByZXR1cm4ge1xuICAgIG1hcmtzOiByb290TWFya3MsXG4gICAgYXhlczogcm9vdEF4ZXMsXG4gICAgLy8gYXNzdW1pbmcgZXF1YWwgY2VsbFdpZHRoIGhlcmVcbiAgICBzY2FsZXM6IGNvbXBpbGVTY2FsZXMoXG4gICAgICBtb2RlbC5jaGFubmVscygpLCAvLyBUT0RPOiB3aXRoIG5lc3RpbmcsIG5vdCBhbGwgc2NhbGUgbWlnaHQgYmUgYSByb290LWxldmVsXG4gICAgICBtb2RlbFxuICAgIClcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0WEF4ZXNHcm91cChtb2RlbDogTW9kZWwsIGNlbGxXaWR0aCwgaGFzQ29sOiBib29sZWFuKSB7IC8vIFRPRE86IFZnTWFya3NcbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICByZXR1cm4gZXh0ZW5kKHtcbiAgICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICd4LWF4ZXMnLFxuICAgICAgdHlwZTogJ2dyb3VwJ1xuICAgIH0sXG4gICAgaGFzQ29sID8ge1xuICAgICAgZnJvbToge1xuICAgICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFttb2RlbC5maWVsZChDT0xVTU4pXSxcbiAgICAgICAgICBzdW1tYXJpemU6IHsnKic6ICdjb3VudCd9IC8vIGp1c3QgYSBwbGFjZWhvbGRlciBhZ2dyZWdhdGlvblxuICAgICAgICB9XVxuICAgICAgfVxuICAgIH0gOiB7fSxcbiAgICB7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiBjZWxsV2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fSxcbiAgICAgICAgICB4OiBoYXNDb2wgPyB7c2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xVTU4pLCBmaWVsZDogbW9kZWwuZmllbGQoQ09MVU1OKX0gOiB7dmFsdWU6IDB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBheGVzOiBbY29tcGlsZUF4aXMoWCwgbW9kZWwpXVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRZQXhlc0dyb3VwKG1vZGVsOiBNb2RlbCwgY2VsbEhlaWdodCwgaGFzUm93OiBib29sZWFuKSB7IC8vIFRPRE86IFZnTWFya3NcbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICByZXR1cm4gZXh0ZW5kKHtcbiAgICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICd5LWF4ZXMnLFxuICAgICAgdHlwZTogJ2dyb3VwJ1xuICAgIH0sXG4gICAgaGFzUm93ID8ge1xuICAgICAgZnJvbToge1xuICAgICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFttb2RlbC5maWVsZChST1cpXSxcbiAgICAgICAgICBzdW1tYXJpemU6IHsnKic6ICdjb3VudCd9IC8vIGp1c3QgYSBwbGFjZWhvbGRlciBhZ2dyZWdhdGlvblxuICAgICAgICB9XVxuICAgICAgfVxuICAgIH0gOiB7fSxcbiAgICB7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319LFxuICAgICAgICAgIGhlaWdodDogY2VsbEhlaWdodCxcbiAgICAgICAgICB5OiBoYXNSb3cgPyB7c2NhbGU6IG1vZGVsLnNjYWxlTmFtZShST1cpLCBmaWVsZDogbW9kZWwuZmllbGQoUk9XKX0gOiB7dmFsdWU6IDB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBheGVzOiBbY29tcGlsZUF4aXMoWSwgbW9kZWwpXVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRSb3dHcmlkR3JvdXAobW9kZWw6IE1vZGVsLCBjZWxsSGVpZ2h0KTogYW55IHsgLy8gVE9ETzogVmdNYXJrc1xuICBjb25zdCBuYW1lID0gbW9kZWwuc3BlYygpLm5hbWU7XG4gIGNvbnN0IGNlbGxDb25maWcgPSBtb2RlbC5jb25maWcoKS5jZWxsO1xuXG4gIGNvbnN0IHJvd0dyaWQgPSB7XG4gICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgJ3Jvdy1ncmlkJyxcbiAgICB0eXBlOiAncnVsZScsXG4gICAgZnJvbToge1xuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICB0cmFuc2Zvcm06IFt7dHlwZTogJ2ZhY2V0JywgZ3JvdXBieTogW21vZGVsLmZpZWxkKFJPVyldfV1cbiAgICB9LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHVwZGF0ZToge1xuICAgICAgICB5OiB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShST1cpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChST1cpXG4gICAgICAgIH0sXG4gICAgICAgIHg6IHt2YWx1ZTogMCwgb2Zmc2V0OiAtY2VsbENvbmZpZy5ncmlkT2Zmc2V0IH0sXG4gICAgICAgIHgyOiB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ30sIG9mZnNldDogY2VsbENvbmZpZy5ncmlkT2Zmc2V0IH0sXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogY2VsbENvbmZpZy5ncmlkQ29sb3IgfSxcbiAgICAgICAgc3Ryb2tlT3BhY2l0eTogeyB2YWx1ZTogY2VsbENvbmZpZy5ncmlkT3BhY2l0eSB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJvd0dyaWRPblRvcCA9ICFtb2RlbC5oYXMoWCkgfHwgbW9kZWwuYXhpcyhYKS5vcmllbnQgIT09ICd0b3AnO1xuICBpZiAocm93R3JpZE9uVG9wKSB7IC8vIG9uIHRvcCAtIG5vIG5lZWQgdG8gYWRkIG9mZnNldFxuICAgIHJldHVybiByb3dHcmlkO1xuICB9IC8vIG90aGVyd2lzZSwgbmVlZCB0byBvZmZzZXQgYWxsIGdyaWQgYnkgY2VsbEhlaWdodFxuICByZXR1cm4ge1xuICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICdyb3ctZ3JpZC1ncm91cCcsXG4gICAgdHlwZTogJ2dyb3VwJyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB1cGRhdGU6IHtcbiAgICAgICAgLy8gYWRkIGdyb3VwIG9mZnNldCA9IGBjZWxsSGVpZ2h0ICsgcGFkZGluZ2AgdG8gYXZvaWQgY2xhc2hpbmcgd2l0aCBheGlzXG4gICAgICAgIHk6IGNlbGxIZWlnaHQudmFsdWUgPyB7XG4gICAgICAgICAgICAvLyBJZiBjZWxsSGVpZ2h0IGNvbnRhaW5zIHZhbHVlLCBqdXN0IHVzZSBpdC5cbiAgICAgICAgICAgIHZhbHVlOiBjZWxsSGVpZ2h0LFxuICAgICAgICAgICAgb2Zmc2V0OiBtb2RlbC5maWVsZERlZihST1cpLnNjYWxlLnBhZGRpbmdcbiAgICAgICAgICB9IDoge1xuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBuZWVkIHRvIGdldCBpdCBmcm9tIGxheW91dCBkYXRhIGluIHRoZSByb290IGdyb3VwXG4gICAgICAgICAgICBmaWVsZDoge3BhcmVudDogJ2NlbGxIZWlnaHQnfSxcbiAgICAgICAgICAgIG9mZnNldDogbW9kZWwuZmllbGREZWYoUk9XKS5zY2FsZS5wYWRkaW5nXG4gICAgICAgICAgfSxcbiAgICAgICAgLy8gaW5jbHVkZSB3aWR0aCBzbyBpdCBjYW4gYmUgcmVmZXJyZWQgaW5zaWRlIHJvdy1ncmlkXG4gICAgICAgIHdpZHRoOiB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319XG4gICAgICB9XG4gICAgfSxcbiAgICBtYXJrczogW3Jvd0dyaWRdXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldENvbHVtbkdyaWRHcm91cChtb2RlbDogTW9kZWwsIGNlbGxXaWR0aCk6IGFueSB7IC8vIFRPRE86IFZnTWFya3NcbiAgY29uc3QgbmFtZSA9IG1vZGVsLnNwZWMoKS5uYW1lO1xuICBjb25zdCBjZWxsQ29uZmlnID0gbW9kZWwuY29uZmlnKCkuY2VsbDtcblxuICBjb25zdCBjb2x1bW5HcmlkID0ge1xuICAgIG5hbWU6IChuYW1lID8gbmFtZSArICctJyA6ICcnKSArICdjb2x1bW4tZ3JpZCcsXG4gICAgdHlwZTogJ3J1bGUnLFxuICAgIGZyb206IHtcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgdHJhbnNmb3JtOiBbe3R5cGU6ICdmYWNldCcsIGdyb3VwYnk6IFttb2RlbC5maWVsZChDT0xVTU4pXX1dXG4gICAgfSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB1cGRhdGU6IHtcbiAgICAgICAgeDoge1xuICAgICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoQ09MVU1OKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoQ09MVU1OKVxuICAgICAgICB9LFxuICAgICAgICB5OiB7dmFsdWU6IDAsIG9mZnNldDogLWNlbGxDb25maWcuZ3JpZE9mZnNldH0sXG4gICAgICAgIHkyOiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9LCBvZmZzZXQ6IGNlbGxDb25maWcuZ3JpZE9mZnNldCB9LFxuICAgICAgICBzdHJva2U6IHsgdmFsdWU6IGNlbGxDb25maWcuZ3JpZENvbG9yIH0sXG4gICAgICAgIHN0cm9rZU9wYWNpdHk6IHsgdmFsdWU6IGNlbGxDb25maWcuZ3JpZE9wYWNpdHkgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBjb2x1bW5HcmlkT25MZWZ0ID0gIW1vZGVsLmhhcyhZKSB8fCBtb2RlbC5heGlzKFkpLm9yaWVudCA9PT0gJ3JpZ2h0JztcbiAgaWYgKGNvbHVtbkdyaWRPbkxlZnQpIHsgLy8gb24gbGVmdCwgbm8gbmVlZCB0byBhZGQgZ2xvYmFsIG9mZnNldFxuICAgIHJldHVybiBjb2x1bW5HcmlkO1xuICB9IC8vIG90aGVyd2lzZSwgbmVlZCB0byBvZmZzZXQgYWxsIGdyaWQgYnkgY2VsbFdpZHRoXG4gIHJldHVybiB7XG4gICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgJ2NvbHVtbi1ncmlkLWdyb3VwJyxcbiAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHVwZGF0ZToge1xuICAgICAgICAvLyBBZGQgZ3JvdXAgb2Zmc2V0ID0gYGNlbGxXaWR0aCArIHBhZGRpbmdgIHRvIGF2b2lkIGNsYXNoaW5nIHdpdGggYXhpc1xuICAgICAgICB4OiBjZWxsV2lkdGgudmFsdWUgPyB7XG4gICAgICAgICAgICAgLy8gSWYgY2VsbFdpZHRoIGNvbnRhaW5zIHZhbHVlLCBqdXN0IHVzZSBpdC5cbiAgICAgICAgICAgICB2YWx1ZTogY2VsbFdpZHRoLFxuICAgICAgICAgICAgIG9mZnNldDogbW9kZWwuZmllbGREZWYoQ09MVU1OKS5zY2FsZS5wYWRkaW5nXG4gICAgICAgICAgIH0gOiB7XG4gICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBuZWVkIHRvIGdldCBpdCBmcm9tIGxheW91dCBkYXRhIGluIHRoZSByb290IGdyb3VwXG4gICAgICAgICAgICAgZmllbGQ6IHtwYXJlbnQ6ICdjZWxsV2lkdGgnfSxcbiAgICAgICAgICAgICBvZmZzZXQ6IG1vZGVsLmZpZWxkRGVmKENPTFVNTikuc2NhbGUucGFkZGluZ1xuICAgICAgICAgICB9LFxuICAgICAgICAvLyBpbmNsdWRlIGhlaWdodCBzbyBpdCBjYW4gYmUgcmVmZXJyZWQgaW5zaWRlIGNvbHVtbi1ncmlkXG4gICAgICAgIGhlaWdodDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1hcmtzOiBbY29sdW1uR3JpZF1cbiAgfTtcbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuXG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZLCBURVhUfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7VEVYVCBhcyBURVhUX01BUkt9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtMQVlPVVR9IGZyb20gJy4uL2RhdGEnO1xuXG5pbnRlcmZhY2UgRGF0YVJlZiB7XG4gIGRhdGE/OiBzdHJpbmc7XG4gIGZpZWxkPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMYXlvdXQge1xuICBjZWxsV2lkdGg6IExheW91dFZhbHVlO1xuICBjZWxsSGVpZ2h0OiBMYXlvdXRWYWx1ZTtcbiAgd2lkdGg6IExheW91dFZhbHVlO1xuICBoZWlnaHQ6IExheW91dFZhbHVlO1xufVxuXG4vLyB2YWx1ZSB0aGF0IHdlIGNhbiBwdXQgaW4gc2NhbGUncyBkb21haW4vcmFuZ2UgKGVpdGhlciBhIG51bWJlciwgb3IgYSBkYXRhIHJlZilcbnR5cGUgTGF5b3V0VmFsdWUgPSBudW1iZXIgfCBEYXRhUmVmO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUxheW91dChtb2RlbDogTW9kZWwpOiBMYXlvdXQge1xuICBjb25zdCBjZWxsV2lkdGggPSBnZXRDZWxsV2lkdGgobW9kZWwpO1xuICBjb25zdCBjZWxsSGVpZ2h0ID0gZ2V0Q2VsbEhlaWdodChtb2RlbCk7XG4gIHJldHVybiB7XG4gICAgLy8gd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgd2hvbGUgY2VsbFxuICAgIGNlbGxXaWR0aDogY2VsbFdpZHRoLFxuICAgIGNlbGxIZWlnaHQ6IGNlbGxIZWlnaHQsXG4gICAgLy8gd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgY2hhcnRcbiAgICB3aWR0aDogZ2V0V2lkdGgobW9kZWwsIGNlbGxXaWR0aCksXG4gICAgaGVpZ2h0OiBnZXRIZWlnaHQobW9kZWwsIGNlbGxIZWlnaHQpXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldENlbGxXaWR0aChtb2RlbDogTW9kZWwpOiBMYXlvdXRWYWx1ZSB7XG4gIGlmIChtb2RlbC5oYXMoWCkpIHtcbiAgICBpZiAobW9kZWwuaXNPcmRpbmFsU2NhbGUoWCkpIHsgLy8gY2FsY3VsYXRlIGluIGRhdGFcbiAgICAgIHJldHVybiB7ZGF0YTogTEFZT1VULCBmaWVsZDogJ2NlbGxXaWR0aCd9O1xuICAgIH1cbiAgICByZXR1cm4gbW9kZWwuY29uZmlnKCkuY2VsbC53aWR0aDtcbiAgfVxuICBpZiAobW9kZWwubWFyaygpID09PSBURVhUX01BUkspIHtcbiAgICByZXR1cm4gbW9kZWwuY29uZmlnKCkudGV4dENlbGxXaWR0aDtcbiAgfVxuICByZXR1cm4gbW9kZWwuZmllbGREZWYoWCkuc2NhbGUuYmFuZFdpZHRoO1xufVxuXG5mdW5jdGlvbiBnZXRXaWR0aChtb2RlbDogTW9kZWwsIGNlbGxXaWR0aDogTGF5b3V0VmFsdWUpOiBMYXlvdXRWYWx1ZSB7XG4gIGlmIChtb2RlbC5oYXMoQ09MVU1OKSkgeyAvLyBjYWxjdWxhdGUgaW4gZGF0YVxuICAgIHJldHVybiB7ZGF0YTogTEFZT1VULCBmaWVsZDogJ3dpZHRoJ307XG4gIH1cbiAgcmV0dXJuIGNlbGxXaWR0aDtcbn1cblxuZnVuY3Rpb24gZ2V0Q2VsbEhlaWdodChtb2RlbDogTW9kZWwpOiBMYXlvdXRWYWx1ZSB7XG4gIGlmIChtb2RlbC5oYXMoWSkpIHtcbiAgICBpZiAobW9kZWwuaXNPcmRpbmFsU2NhbGUoWSkpIHsgLy8gY2FsY3VsYXRlIGluIGRhdGFcbiAgICAgIHJldHVybiB7ZGF0YTogTEFZT1VULCBmaWVsZDogJ2NlbGxIZWlnaHQnfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG1vZGVsLmNvbmZpZygpLmNlbGwuaGVpZ2h0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gbW9kZWwuZmllbGREZWYoWSkuc2NhbGUuYmFuZFdpZHRoO1xufVxuXG5mdW5jdGlvbiBnZXRIZWlnaHQobW9kZWw6IE1vZGVsLCBjZWxsSGVpZ2h0OiBMYXlvdXRWYWx1ZSk6IExheW91dFZhbHVlIHtcbiAgaWYgKG1vZGVsLmhhcyhST1cpKSB7XG4gICAgcmV0dXJuIHtkYXRhOiBMQVlPVVQsIGZpZWxkOiAnaGVpZ2h0J307XG4gIH1cbiAgcmV0dXJuIGNlbGxIZWlnaHQ7XG59XG4iLCJpbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi9zY2hlbWEvZmllbGRkZWYuc2NoZW1hJztcblxuaW1wb3J0IHtDT0xPUiwgU0laRSwgU0hBUEUsIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHt0aXRsZSBhcyBmaWVsZFRpdGxlfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge0FSRUEsIEJBUiwgVElDSywgVEVYVCwgTElORSwgUE9JTlQsIENJUkNMRSwgU1FVQVJFfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7ZXh0ZW5kLCBrZXlzfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHthcHBseU1hcmtDb25maWcsIEZJTExfU1RST0tFX0NPTkZJRywgZm9ybWF0TWl4aW5zIGFzIHV0aWxGb3JtYXRNaXhpbnN9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTGVnZW5kcyhtb2RlbDogTW9kZWwpIHtcbiAgdmFyIGRlZnMgPSBbXTtcblxuICBpZiAobW9kZWwuaGFzKENPTE9SKSAmJiBtb2RlbC5maWVsZERlZihDT0xPUikubGVnZW5kKSB7XG4gICAgZGVmcy5wdXNoKGNvbXBpbGVMZWdlbmQobW9kZWwsIENPTE9SLCB7XG4gICAgICBmaWxsOiBtb2RlbC5zY2FsZU5hbWUoQ09MT1IpXG4gICAgICAvLyBUT0RPOiBjb25zaWRlciBpZiB0aGlzIHNob3VsZCBiZSBzdHJva2UgZm9yIGxpbmVcbiAgICB9KSk7XG4gIH1cblxuICBpZiAobW9kZWwuaGFzKFNJWkUpICYmIG1vZGVsLmZpZWxkRGVmKFNJWkUpLmxlZ2VuZCkge1xuICAgIGRlZnMucHVzaChjb21waWxlTGVnZW5kKG1vZGVsLCBTSVpFLCB7XG4gICAgICBzaXplOiBtb2RlbC5zY2FsZU5hbWUoU0laRSlcbiAgICB9KSk7XG4gIH1cblxuICBpZiAobW9kZWwuaGFzKFNIQVBFKSAmJiBtb2RlbC5maWVsZERlZihTSEFQRSkubGVnZW5kKSB7XG4gICAgZGVmcy5wdXNoKGNvbXBpbGVMZWdlbmQobW9kZWwsIFNIQVBFLCB7XG4gICAgICBzaGFwZTogbW9kZWwuc2NhbGVOYW1lKFNIQVBFKVxuICAgIH0pKTtcbiAgfVxuICByZXR1cm4gZGVmcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVMZWdlbmQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBkZWYpIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgY29uc3QgbGVnZW5kID0gZmllbGREZWYubGVnZW5kO1xuXG4gIC8vIDEuMSBBZGQgcHJvcGVydGllcyB3aXRoIHNwZWNpYWwgcnVsZXNcbiAgZGVmLnRpdGxlID0gdGl0bGUoZmllbGREZWYpO1xuXG4gIGV4dGVuZChkZWYsIGZvcm1hdE1peGlucyhtb2RlbCwgY2hhbm5lbCkpO1xuXG4gIC8vIDEuMiBBZGQgcHJvcGVydGllcyB3aXRob3V0IHJ1bGVzXG4gIFsnb3JpZW50JywgJ3ZhbHVlcyddLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGxlZ2VuZFtwcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlZltwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIDIpIEFkZCBtYXJrIHByb3BlcnR5IGRlZmluaXRpb24gZ3JvdXBzXG4gIGNvbnN0IHByb3BzID0gKHR5cGVvZiBsZWdlbmQgIT09ICdib29sZWFuJyAmJiBsZWdlbmQucHJvcGVydGllcykgfHwge307XG4gIFsndGl0bGUnLCAnc3ltYm9scycsICdsZWdlbmQnXS5mb3JFYWNoKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgbGV0IHZhbHVlID0gcHJvcGVydGllc1tncm91cF0gP1xuICAgICAgcHJvcGVydGllc1tncm91cF0oZmllbGREZWYsIHByb3BzW2dyb3VwXSwgbW9kZWwsIGNoYW5uZWwpIDogLy8gYXBwbHkgcnVsZVxuICAgICAgcHJvcHNbZ3JvdXBdOyAvLyBubyBydWxlIC0tIGp1c3QgZGVmYXVsdCB2YWx1ZXNcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmLnByb3BlcnRpZXMgPSBkZWYucHJvcGVydGllcyB8fCB7fTtcbiAgICAgIGRlZi5wcm9wZXJ0aWVzW2dyb3VwXSA9IHZhbHVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpdGxlKGZpZWxkRGVmOiBGaWVsZERlZikge1xuICBjb25zdCBsZWdlbmQgPSBmaWVsZERlZi5sZWdlbmQ7XG4gIGlmICh0eXBlb2YgbGVnZW5kICE9PSAnYm9vbGVhbicgJiYgbGVnZW5kLnRpdGxlKSB7XG4gICAgcmV0dXJuIGxlZ2VuZC50aXRsZTtcbiAgfVxuXG4gIHJldHVybiBmaWVsZFRpdGxlKGZpZWxkRGVmKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE1peGlucyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICAvLyBJZiB0aGUgY2hhbm5lbCBpcyBiaW5uZWQsIHdlIHNob3VsZCBub3Qgc2V0IHRoZSBmb3JtYXQgYmVjYXVzZSB3ZSBoYXZlIGEgcmFuZ2UgbGFiZWxcbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGNvbnN0IGxlZ2VuZCA9IGZpZWxkRGVmLmxlZ2VuZDtcbiAgcmV0dXJuIHV0aWxGb3JtYXRNaXhpbnMobW9kZWwsIGNoYW5uZWwsIHR5cGVvZiBsZWdlbmQgIT09ICdib29sZWFuJyA/IGxlZ2VuZC5mb3JtYXQgOiB1bmRlZmluZWQpO1xufVxuXG5uYW1lc3BhY2UgcHJvcGVydGllcyB7XG4gIGV4cG9ydCBmdW5jdGlvbiBzeW1ib2xzKGZpZWxkRGVmOiBGaWVsZERlZiwgc3ltYm9sc1NwZWMsIG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICAgIGxldCBzeW1ib2xzOmFueSA9IHt9O1xuICAgIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrKCk7XG5cbiAgICBzd2l0Y2ggKG1hcmspIHtcbiAgICAgIGNhc2UgQkFSOlxuICAgICAgY2FzZSBUSUNLOlxuICAgICAgY2FzZSBURVhUOlxuICAgICAgICBzeW1ib2xzLnNoYXBlID0ge3ZhbHVlOiAnc3F1YXJlJ307XG5cbiAgICAgICAgLy8gc2V0IHN0cm9rZSB0byB0cmFuc3BhcmVudCBieSBkZWZhdWx0IHVubGVzcyB0aGVyZSBpcyBhIGNvbmZpZyBmb3Igc3Ryb2tlXG4gICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcbiAgICAgICAgYXBwbHlNYXJrQ29uZmlnKHN5bWJvbHMsIG1vZGVsLCBGSUxMX1NUUk9LRV9DT05GSUcpO1xuXG4gICAgICAgIC8vIG5vIG5lZWQgdG8gYXBwbHkgY29sb3IgdG8gZmlsbCBhcyB0aGV5IGFyZSBzZXQgYXV0b21hdGljYWxseVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBDSVJDTEU6XG4gICAgICBjYXNlIFNRVUFSRTpcbiAgICAgICAgc3ltYm9scy5zaGFwZSA9IHt2YWx1ZTogbWFya307XG4gICAgICAgIC8qIGZhbGwgdGhyb3VnaCAqL1xuICAgICAgY2FzZSBQT0lOVDpcbiAgICAgICAgLy8gZmlsbCBvciBzdHJva2VcbiAgICAgICAgaWYgKG1vZGVsLmNvbmZpZygpLm1hcmsuZmlsbGVkKSB7IC8vIGZpbGxlZFxuICAgICAgICAgIC8vIHNldCBzdHJva2UgdG8gdHJhbnNwYXJlbnQgYnkgZGVmYXVsdCB1bmxlc3MgdGhlcmUgaXMgYSBjb25maWcgZm9yIHN0cm9rZVxuICAgICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiAndHJhbnNwYXJlbnQnfTtcbiAgICAgICAgICBhcHBseU1hcmtDb25maWcoc3ltYm9scywgbW9kZWwsIEZJTExfU1RST0tFX0NPTkZJRyk7XG5cbiAgICAgICAgICBpZiAobW9kZWwuaGFzKENPTE9SKSAmJiBjaGFubmVsID09PSBDT0xPUikge1xuICAgICAgICAgICAgc3ltYm9scy5maWxsID0ge3NjYWxlOiBtb2RlbC5zY2FsZU5hbWUoQ09MT1IpLCBmaWVsZDogJ2RhdGEnfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3ltYm9scy5maWxsID0ge3ZhbHVlOiBtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWV9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gc3Ryb2tlZFxuICAgICAgICAgIC8vIHNldCBmaWxsIHRvIHRyYW5zcGFyZW50IGJ5IGRlZmF1bHQgdW5sZXNzIHRoZXJlIGlzIGEgY29uZmlnIGZvciBzdHJva2VcbiAgICAgICAgICBzeW1ib2xzLmZpbGwgPSB7dmFsdWU6ICd0cmFuc3BhcmVudCd9O1xuICAgICAgICAgIGFwcGx5TWFya0NvbmZpZyhzeW1ib2xzLCBtb2RlbCwgRklMTF9TVFJPS0VfQ09ORklHKTtcblxuICAgICAgICAgIGlmIChtb2RlbC5oYXMoQ09MT1IpICYmIGNoYW5uZWwgPT09IENPTE9SKSB7XG4gICAgICAgICAgICBzeW1ib2xzLnN0cm9rZSA9IHtzY2FsZTogbW9kZWwuc2NhbGVOYW1lKENPTE9SKSwgZmllbGQ6ICdkYXRhJ307XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN5bWJvbHMuc3Ryb2tlID0ge3ZhbHVlOiBtb2RlbC5maWVsZERlZihDT0xPUikudmFsdWV9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMSU5FOlxuICAgICAgY2FzZSBBUkVBOlxuICAgICAgICAvLyBzZXQgc3Ryb2tlIHRvIHRyYW5zcGFyZW50IGJ5IGRlZmF1bHQgdW5sZXNzIHRoZXJlIGlzIGEgY29uZmlnIGZvciBzdHJva2VcbiAgICAgICAgc3ltYm9scy5zdHJva2UgPSB7dmFsdWU6ICd0cmFuc3BhcmVudCd9O1xuICAgICAgICBhcHBseU1hcmtDb25maWcoc3ltYm9scywgbW9kZWwsIEZJTExfU1RST0tFX0NPTkZJRyk7XG5cbiAgICAgICAgLy8gVE9ETyB1c2Ugc2hhcGUgaGVyZSBhZnRlciBpbXBsZW1lbnRpbmcgIzUwOFxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBzeW1ib2xzID0gZXh0ZW5kKHN5bWJvbHMsIHN5bWJvbHNTcGVjIHx8IHt9KTtcblxuICAgIHJldHVybiBrZXlzKHN5bWJvbHMpLmxlbmd0aCA+IDAgPyBzeW1ib2xzIDogdW5kZWZpbmVkO1xuICB9XG59XG4iLCJpbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7WCwgWX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2FwcGx5Q29sb3JBbmRPcGFjaXR5LCBhcHBseU1hcmtDb25maWd9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgYXJlYSB7XG4gIGV4cG9ydCBmdW5jdGlvbiBtYXJrVHlwZSgpIHtcbiAgICByZXR1cm4gJ2FyZWEnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETyBVc2UgVmVnYSdzIG1hcmtzIHByb3BlcnRpZXMgaW50ZXJmYWNlXG4gICAgdmFyIHA6IGFueSA9IHt9O1xuXG4gICAgY29uc3Qgb3JpZW50ID0gbW9kZWwuY29uZmlnKCkubWFyay5vcmllbnQ7XG4gICAgaWYgKG9yaWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwLm9yaWVudCA9IHsgdmFsdWU6IG9yaWVudCB9O1xuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2soKTtcbiAgICAvLyB4XG4gICAgaWYgKHN0YWNrICYmIFggPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkgeyAvLyBTdGFja2VkIE1lYXN1cmVcbiAgICAgIHAueCA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgpICsgJ19zdGFydCdcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5pc01lYXN1cmUoWCkpIHsgLy8gTWVhc3VyZVxuICAgICAgcC54ID0geyBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLCBmaWVsZDogbW9kZWwuZmllbGQoWCkgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmlzRGltZW5zaW9uKFgpKSB7XG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHgyXG4gICAgaWYgKG9yaWVudCA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBpZiAoc3RhY2sgJiYgWCA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XG4gICAgICAgIHAueDIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCkgKyAnX2VuZCdcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAueDIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHlcbiAgICBpZiAoc3RhY2sgJiYgWSA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7IC8vIFN0YWNrZWQgTWVhc3VyZVxuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSkgKyAnX3N0YXJ0J1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmlzTWVhc3VyZShZKSkge1xuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSlcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAob3JpZW50ICE9PSAnaG9yaXpvbnRhbCcpIHsgLy8gJ3ZlcnRpY2FsJyBvciB1bmRlZmluZWQgYXJlIHZlcnRpY2FsXG4gICAgICBpZiAoc3RhY2sgJiYgWSA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XG4gICAgICAgIHAueTIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSkgKyAnX2VuZCdcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAueTIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsKTtcbiAgICBhcHBseU1hcmtDb25maWcocCwgbW9kZWwsIFsnaW50ZXJwb2xhdGUnLCAndGVuc2lvbiddKTtcbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBTSVpFfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlDb2xvckFuZE9wYWNpdHl9IGZyb20gJy4vdXRpbCc7XG5cblxuZXhwb3J0IG5hbWVzcGFjZSBiYXIge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICdyZWN0JztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8gVXNlIFZlZ2EncyBtYXJrcyBwcm9wZXJ0aWVzIGludGVyZmFjZVxuICAgIGxldCBwOiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IG9yaWVudCA9IG1vZGVsLmNvbmZpZygpLm1hcmsub3JpZW50O1xuXG4gICAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaygpO1xuICAgIC8vIHgsIHgyLCBhbmQgd2lkdGggLS0gd2UgbXVzdCBzcGVjaWZ5IHR3byBvZiB0aGVzZSBpbiBhbGwgY29uZGl0aW9uc1xuICAgIGlmIChzdGFjayAmJiBYID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcbiAgICAgIC8vICd4JyBpcyBhIHN0YWNrZWQgbWVhc3VyZSwgdGh1cyB1c2UgPGZpZWxkPl9zdGFydCBhbmQgPGZpZWxkPl9lbmQgZm9yIHgsIHgyLlxuICAgICAgcC54ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCkgKyAnX3N0YXJ0J1xuICAgICAgfTtcbiAgICAgIHAueDIgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYKSArICdfZW5kJ1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1vZGVsLmlzTWVhc3VyZShYKSkge1xuICAgICAgaWYgKG9yaWVudCA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIHAueCA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYKVxuICAgICAgICB9O1xuICAgICAgICBwLngyID0geyB2YWx1ZTogMCB9O1xuICAgICAgfSBlbHNlIHsgLy8gdmVydGljYWxcbiAgICAgICAgcC54YyA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYKVxuICAgICAgICB9O1xuICAgICAgICBwLndpZHRoID0ge3ZhbHVlOiBtb2RlbC5zaXplVmFsdWUoWCl9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobW9kZWwuZmllbGREZWYoWCkuYmluKSB7XG4gICAgICBpZiAobW9kZWwuaGFzKFNJWkUpICYmIG9yaWVudCAhPT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIC8vIEZvciB2ZXJ0aWNhbCBjaGFydCB0aGF0IGhhcyBiaW5uZWQgWCBhbmQgc2l6ZSxcbiAgICAgICAgLy8gY2VudGVyIGJhciBhbmQgYXBwbHkgc2l6ZSB0byB3aWR0aC5cbiAgICAgICAgcC54YyA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICAgIH07XG4gICAgICAgIHAud2lkdGggPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAueCA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19zdGFydCcgfSksXG4gICAgICAgICAgb2Zmc2V0OiAxXG4gICAgICAgIH07XG4gICAgICAgIHAueDIgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBiaW5TdWZmaXg6ICdfZW5kJyB9KVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIHggaXMgZGltZW5zaW9uIG9yIHVuc3BlY2lmaWVkXG4gICAgICBpZiAobW9kZWwuaGFzKFgpKSB7IC8vIGlzIG9yZGluYWxcbiAgICAgICBwLnhjID0ge1xuICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYKVxuICAgICAgIH07XG4gICAgIH0gZWxzZSB7IC8vIG5vIHhcbiAgICAgICAgcC54ID0geyB2YWx1ZTogMCwgb2Zmc2V0OiAyIH07XG4gICAgICB9XG5cbiAgICAgIHAud2lkdGggPSBtb2RlbC5oYXMoU0laRSkgJiYgb3JpZW50ICE9PSAnaG9yaXpvbnRhbCcgPyB7XG4gICAgICAgICAgLy8gYXBwbHkgc2l6ZSBzY2FsZSBpZiBoYXMgc2l6ZSBhbmQgaXMgdmVydGljYWwgKGV4cGxpY2l0IFwidmVydGljYWxcIiBvciB1bmRlZmluZWQpXG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoU0laRSlcbiAgICAgICAgfSA6IHtcbiAgICAgICAgICAvLyBvdGhlcndpc2UsIHVzZSBmaXhlZCBzaXplXG4gICAgICAgICAgdmFsdWU6IG1vZGVsLnNpemVWYWx1ZShYKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIHksIHkyICYgaGVpZ2h0IC0tIHdlIG11c3Qgc3BlY2lmeSB0d28gb2YgdGhlc2UgaW4gYWxsIGNvbmRpdGlvbnNcbiAgICBpZiAoc3RhY2sgJiYgWSA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7IC8vIHkgaXMgc3RhY2tlZCBtZWFzdXJlXG4gICAgICBwLnkgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZKSArICdfc3RhcnQnXG4gICAgICB9O1xuICAgICAgcC55MiA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFkpICsgJ19lbmQnXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobW9kZWwuaXNNZWFzdXJlKFkpKSB7XG4gICAgICBpZiAob3JpZW50ICE9PSAnaG9yaXpvbnRhbCcpIHsgLy8gdmVydGljYWwgKGV4cGxpY2l0ICd2ZXJ0aWNhbCcgb3IgdW5kZWZpbmVkKVxuICAgICAgICBwLnkgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSlcbiAgICAgICAgfTtcbiAgICAgICAgcC55MiA9IHsgZmllbGQ6IHsgZ3JvdXA6ICdoZWlnaHQnIH0gfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAueWMgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSlcbiAgICAgICAgfTtcbiAgICAgICAgcC5oZWlnaHQgPSB7IHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoWSkgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1vZGVsLmZpZWxkRGVmKFkpLmJpbikge1xuICAgICAgaWYgKG1vZGVsLmhhcyhTSVpFKSAmJiBvcmllbnQgPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAvLyBGb3IgaG9yaXpvbnRhbCBjaGFydCB0aGF0IGhhcyBiaW5uZWQgWSBhbmQgc2l6ZSxcbiAgICAgICAgLy8gY2VudGVyIGJhciBhbmQgYXBwbHkgc2l6ZSB0byBoZWlnaHQuXG4gICAgICAgIHAueWMgPSB7XG4gICAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShZKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgICB9O1xuICAgICAgICBwLmhlaWdodCA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBzaW1wbHkgdXNlIDxmaWVsZD5fc3RhcnQsIDxmaWVsZD5fZW5kXG4gICAgICAgIHAueSA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IGJpblN1ZmZpeDogJ19zdGFydCcgfSlcbiAgICAgICAgfTtcbiAgICAgICAgcC55MiA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IGJpblN1ZmZpeDogJ19lbmQnIH0pLFxuICAgICAgICAgIG9mZnNldDogMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIHkgaXMgb3JkaW5hbCBvciB1bnNwZWNpZmllZFxuXG4gICAgICBpZiAobW9kZWwuaGFzKFkpKSB7IC8vIGlzIG9yZGluYWxcbiAgICAgICAgcC55YyA9IHtcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHsgLy8gTm8gWVxuICAgICAgICBwLnkyID0ge1xuICAgICAgICAgIGZpZWxkOiB7IGdyb3VwOiAnaGVpZ2h0JyB9LFxuICAgICAgICAgIG9mZnNldDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcC5oZWlnaHQgPSBtb2RlbC5oYXMoU0laRSkgICYmIG9yaWVudCA9PT0gJ2hvcml6b250YWwnID8ge1xuICAgICAgICAgIC8vIGFwcGx5IHNpemUgc2NhbGUgaWYgaGFzIHNpemUgYW5kIGlzIGhvcml6b250YWxcbiAgICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNJWkUpLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChTSVpFKVxuICAgICAgICB9IDoge1xuICAgICAgICAgIHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoWSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhcHBseUNvbG9yQW5kT3BhY2l0eShwLCBtb2RlbCk7XG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbGFiZWxzKG1vZGVsOiBNb2RlbCkge1xuICAgIC8vIFRPRE8oIzY0KTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlDb2xvckFuZE9wYWNpdHksIGFwcGx5TWFya0NvbmZpZywgQ29sb3JNb2RlfSBmcm9tICcuL3V0aWwnO1xuXG5cbmV4cG9ydCBuYW1lc3BhY2UgbGluZSB7XG4gIGV4cG9ydCBmdW5jdGlvbiBtYXJrVHlwZSgpIHtcbiAgICByZXR1cm4gJ2xpbmUnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETyBVc2UgVmVnYSdzIG1hcmtzIHByb3BlcnRpZXMgaW50ZXJmYWNlXG4gICAgdmFyIHA6IGFueSA9IHt9O1xuXG4gICAgLy8geFxuICAgIGlmIChtb2RlbC5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueCA9IHsgdmFsdWU6IDAgfTtcbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKG1vZGVsLmhhcyhZKSkge1xuICAgICAgcC55ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFkpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWSwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC55ID0geyBmaWVsZDogeyBncm91cDogJ2hlaWdodCcgfSB9O1xuICAgIH1cblxuICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsLCBDb2xvck1vZGUuQUxXQVlTX1NUUk9LRUQpO1xuICAgIGFwcGx5TWFya0NvbmZpZyhwLCBtb2RlbCwgWydpbnRlcnBvbGF0ZScsICd0ZW5zaW9uJ10pO1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhYmVscyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPKCMyNDApOiBmaWxsIHRoaXMgbWV0aG9kXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge1gsIFksIFNIQVBFLCBTSVpFfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlDb2xvckFuZE9wYWNpdHksIENvbG9yTW9kZX0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IG5hbWVzcGFjZSBwb2ludCB7XG4gIGV4cG9ydCBmdW5jdGlvbiBtYXJrVHlwZSgpIHtcbiAgICByZXR1cm4gJ3N5bWJvbCc7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJvcGVydGllcyhtb2RlbDogTW9kZWwsIGZpeGVkU2hhcGU/OiBzdHJpbmcpIHtcbiAgICAvLyBUT0RPIFVzZSBWZWdhJ3MgbWFya3MgcHJvcGVydGllcyBpbnRlcmZhY2VcbiAgICB2YXIgcDogYW55ID0ge307XG5cbiAgICAvLyB4XG4gICAgaWYgKG1vZGVsLmhhcyhYKSkge1xuICAgICAgcC54ID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFgpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoWCwgeyBiaW5TdWZmaXg6ICdfbWlkJyB9KVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC54ID0geyB2YWx1ZTogbW9kZWwuZmllbGREZWYoWCkuc2NhbGUuYmFuZFdpZHRoIC8gMiB9O1xuICAgIH1cblxuICAgIC8vIHlcbiAgICBpZiAobW9kZWwuaGFzKFkpKSB7XG4gICAgICBwLnkgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnkgPSB7IHZhbHVlOiBtb2RlbC5maWVsZERlZihZKS5zY2FsZS5iYW5kV2lkdGggLyAyIH07XG4gICAgfVxuXG4gICAgLy8gc2l6ZVxuICAgIGlmIChtb2RlbC5oYXMoU0laRSkpIHtcbiAgICAgIHAuc2l6ZSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnNpemUgPSB7IHZhbHVlOiBtb2RlbC5zaXplVmFsdWUoKSB9O1xuICAgIH1cblxuICAgIC8vIHNoYXBlXG4gICAgaWYgKGZpeGVkU2hhcGUpIHsgLy8gc3F1YXJlIGFuZCBjaXJjbGUgbWFya3NcbiAgICAgIHAuc2hhcGUgPSB7IHZhbHVlOiBmaXhlZFNoYXBlIH07XG4gICAgfSBlbHNlIGlmIChtb2RlbC5oYXMoU0hBUEUpKSB7XG4gICAgICBwLnNoYXBlID0ge1xuICAgICAgICBzY2FsZTogbW9kZWwuc2NhbGVOYW1lKFNIQVBFKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNIQVBFKVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC5zaGFwZSA9IHsgdmFsdWU6IG1vZGVsLmZpZWxkRGVmKFNIQVBFKS52YWx1ZSB9O1xuICAgIH1cblxuICAgIGFwcGx5Q29sb3JBbmRPcGFjaXR5KHAsIG1vZGVsLFxuICAgICAgLy8gc3F1YXJlIGFuZCBjaXJjbGUgYXJlIGZpbGxlZCBieSBkZWZhdWx0LCBidXQgcG9pbnQgaXMgc3Ryb2tlZCBieSBkZWZhdWx0LlxuICAgICAgZml4ZWRTaGFwZSA/IENvbG9yTW9kZS5GSUxMRURfQllfREVGQVVMVCA6IENvbG9yTW9kZS5TVFJPS0VEX0JZX0RFRkFVTFRcbiAgICApO1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxhYmVscyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPKCMyNDApOiBmaWxsIHRoaXMgbWV0aG9kXG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBjaXJjbGUge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUobW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuICdzeW1ib2wnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIHBvaW50LnByb3BlcnRpZXMobW9kZWwsICdjaXJjbGUnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBzcXVhcmUge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUobW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuICdzeW1ib2wnO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSB7XG4gICAgcmV0dXJuIHBvaW50LnByb3BlcnRpZXMobW9kZWwsICdzcXVhcmUnKTtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBDT0xPUiwgVEVYVCwgU0laRX0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge2FwcGx5TWFya0NvbmZpZywgYXBwbHlDb2xvckFuZE9wYWNpdHksIGZvcm1hdE1peGluc30gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7ZXh0ZW5kLCBjb250YWluc30gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge1FVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuXG5leHBvcnQgbmFtZXNwYWNlIHRleHQge1xuICBleHBvcnQgZnVuY3Rpb24gbWFya1R5cGUoKSB7XG4gICAgcmV0dXJuICd0ZXh0JztcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBiYWNrZ3JvdW5kKG1vZGVsOiBNb2RlbCkge1xuICAgIHJldHVybiB7XG4gICAgICB4OiB7IHZhbHVlOiAwIH0sXG4gICAgICB5OiB7IHZhbHVlOiAwIH0sXG4gICAgICB3aWR0aDogeyBmaWVsZDogeyBncm91cDogJ3dpZHRoJyB9IH0sXG4gICAgICBoZWlnaHQ6IHsgZmllbGQ6IHsgZ3JvdXA6ICdoZWlnaHQnIH0gfSxcbiAgICAgIGZpbGw6IHsgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xPUiksIGZpZWxkOiBtb2RlbC5maWVsZChDT0xPUikgfVxuICAgIH07XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJvcGVydGllcyhtb2RlbDogTW9kZWwpIHtcbiAgICAvLyBUT0RPIFVzZSBWZWdhJ3MgbWFya3MgcHJvcGVydGllcyBpbnRlcmZhY2VcbiAgICBsZXQgcDogYW55ID0ge307XG4gICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihURVhUKTtcblxuICAgIC8vIHhcbiAgICBpZiAobW9kZWwuaGFzKFgpKSB7XG4gICAgICBwLnggPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWCksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChYLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobW9kZWwuaGFzKFRFWFQpICYmIG1vZGVsLmZpZWxkRGVmKFRFWFQpLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xuICAgICAgICBwLnggPSB7IGZpZWxkOiB7IGdyb3VwOiAnd2lkdGgnIH0sIG9mZnNldDogLTUgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAueCA9IHsgdmFsdWU6IG1vZGVsLmZpZWxkRGVmKFgpLnNjYWxlLmJhbmRXaWR0aCAvIDIgfTtcbiAgICAgIH1cbiAgICAgIC8vIFRPRE86IHN1cHBvcnQgeC52YWx1ZVxuICAgIH1cblxuICAgIC8vIHlcbiAgICBpZiAobW9kZWwuaGFzKFkpKSB7XG4gICAgICBwLnkgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnkgPSB7IHZhbHVlOiBtb2RlbC5maWVsZERlZihZKS5zY2FsZS5iYW5kV2lkdGggLyAyIH07XG4gICAgICAvLyBUT0RPOiBzdXBwb3J0IHgudmFsdWVcbiAgICB9XG5cbiAgICAvLyBzaXplXG4gICAgaWYgKG1vZGVsLmhhcyhTSVpFKSkge1xuICAgICAgcC5mb250U2l6ZSA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShTSVpFKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFNJWkUpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLmZvbnRTaXplID0geyB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKCkgfTtcbiAgICB9XG5cbiAgICBpZiAobW9kZWwuY29uZmlnKCkubWFyay5hcHBseUNvbG9yVG9CYWNrZ3JvdW5kICYmICFtb2RlbC5oYXMoWCkgJiYgIW1vZGVsLmhhcyhZKSkge1xuICAgICAgcC5maWxsID0ge3ZhbHVlOiAnYmxhY2snfTsgLy8gVE9ETzogYWRkIHJ1bGVzIGZvciBzd2FwcGluZyBiZXR3ZWVuIGJsYWNrIGFuZCB3aGl0ZVxuXG4gICAgICAvLyBvcGFjaXR5XG4gICAgICBjb25zdCBvcGFjaXR5ID0gbW9kZWwuY29uZmlnKCkubWFyay5vcGFjaXR5O1xuICAgICAgaWYgKG9wYWNpdHkpIHsgcC5vcGFjaXR5ID0geyB2YWx1ZTogb3BhY2l0eSB9OyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHBseUNvbG9yQW5kT3BhY2l0eShwLCBtb2RlbCk7XG4gICAgfVxuXG5cbiAgICAvLyB0ZXh0XG4gICAgaWYgKG1vZGVsLmhhcyhURVhUKSkge1xuICAgICAgaWYgKGNvbnRhaW5zKFtRVUFOVElUQVRJVkUsIFRFTVBPUkFMXSwgbW9kZWwuZmllbGREZWYoVEVYVCkudHlwZSkpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0ID0gbW9kZWwuY29uZmlnKCkubWFyay5mb3JtYXQ7XG4gICAgICAgIGV4dGVuZChwLCBmb3JtYXRNaXhpbnMobW9kZWwsIFRFWFQsIGZvcm1hdCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcC50ZXh0ID0geyBmaWVsZDogbW9kZWwuZmllbGQoVEVYVCkgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcC50ZXh0ID0geyB2YWx1ZTogZmllbGREZWYudmFsdWUgfTtcbiAgICB9XG5cbiAgICBhcHBseU1hcmtDb25maWcocCwgbW9kZWwsXG4gICAgICBbJ2FuZ2xlJywgJ2FsaWduJywgJ2Jhc2VsaW5lJywgJ2R4JywgJ2R5JywgJ2ZvbnQnLCAnZm9udFdlaWdodCcsXG4gICAgICAgICdmb250U3R5bGUnLCAncmFkaXVzJywgJ3RoZXRhJ10pO1xuXG4gICAgcmV0dXJuIHA7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7YXBwbHlDb2xvckFuZE9wYWNpdHksIENvbG9yTW9kZX0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IG5hbWVzcGFjZSB0aWNrIHtcbiAgZXhwb3J0IGZ1bmN0aW9uIG1hcmtUeXBlKCkge1xuICAgIHJldHVybiAncmVjdCc7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gcHJvcGVydGllcyhtb2RlbDogTW9kZWwpIHtcbiAgICB2YXIgcDogYW55ID0ge307XG5cbiAgICAvLyB4XG4gICAgaWYgKG1vZGVsLmhhcyhYKSkge1xuICAgICAgcC54YyA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShYKSxcbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKFgsIHsgYmluU3VmZml4OiAnX21pZCcgfSlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAueGMgPSB7IHZhbHVlOiBtb2RlbC5maWVsZERlZihYKS5zY2FsZS5iYW5kV2lkdGggLyAyIH07XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChtb2RlbC5oYXMoWSkpIHtcbiAgICAgIHAueWMgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoWSksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChZLCB7IGJpblN1ZmZpeDogJ19taWQnIH0pXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnljID0geyB2YWx1ZTogbW9kZWwuZmllbGREZWYoWSkuc2NhbGUuYmFuZFdpZHRoIC8gMiB9O1xuICAgIH1cblxuICAgIGlmIChtb2RlbC5jb25maWcoKS5tYXJrLm9yaWVudCA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBwLndpZHRoID0geyB2YWx1ZTogbW9kZWwuY29uZmlnKCkubWFyay50aGlja25lc3MgfTtcbiAgICAgIHAuaGVpZ2h0ID0geyB2YWx1ZTogbW9kZWwuc2l6ZVZhbHVlKFkpIH07IC8vIFRPRE8oIzkzMikgc3VwcG9ydCBzaXplIGNoYW5uZWxcbiAgICB9IGVsc2Uge1xuICAgICAgcC53aWR0aCA9IHsgdmFsdWU6IG1vZGVsLnNpemVWYWx1ZShYKSB9OyAvLyBUT0RPKCM5MzIpIHN1cHBvcnQgc2l6ZSBjaGFubmVsXG4gICAgICBwLmhlaWdodCA9IHsgdmFsdWU6IG1vZGVsLmNvbmZpZygpLm1hcmsudGhpY2tuZXNzIH07XG4gICAgfVxuXG4gICAgYXBwbHlDb2xvckFuZE9wYWNpdHkocCwgbW9kZWwsIENvbG9yTW9kZS5BTFdBWVNfRklMTEVEKTtcbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBsYWJlbHMobW9kZWw6IE1vZGVsKSB7XG4gICAgLy8gVE9ETygjMjQwKTogZmlsbCB0aGlzIG1ldGhvZFxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtYLCBZLCBDT0xPUiwgVEVYVCwgU0hBUEUsIERFVEFJTCwgUk9XLCBDT0xVTU4sIExBQkVMfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7QVJFQSwgTElORSwgVEVYVCBhcyBURVhUTUFSS30gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge2ltcHV0ZVRyYW5zZm9ybSwgc3RhY2tUcmFuc2Zvcm19IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHtleHRlbmR9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHthcmVhfSBmcm9tICcuL21hcmstYXJlYSc7XG5pbXBvcnQge2Jhcn0gZnJvbSAnLi9tYXJrLWJhcic7XG5pbXBvcnQge2xpbmV9IGZyb20gJy4vbWFyay1saW5lJztcbmltcG9ydCB7cG9pbnQsIGNpcmNsZSwgc3F1YXJlfSBmcm9tICcuL21hcmstcG9pbnQnO1xuaW1wb3J0IHt0ZXh0fSBmcm9tICcuL21hcmstdGV4dCc7XG5pbXBvcnQge3RpY2t9IGZyb20gJy4vbWFyay10aWNrJztcblxuY29uc3QgbWFya0NvbXBpbGVyID0ge1xuICBhcmVhOiBhcmVhLFxuICBiYXI6IGJhcixcbiAgbGluZTogbGluZSxcbiAgcG9pbnQ6IHBvaW50LFxuICB0ZXh0OiB0ZXh0LFxuICB0aWNrOiB0aWNrLFxuICBjaXJjbGU6IGNpcmNsZSxcbiAgc3F1YXJlOiBzcXVhcmVcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTWFyayhtb2RlbDogTW9kZWwpOiBhbnlbXSB7XG4gIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrKCk7XG4gIGNvbnN0IG5hbWUgPSBtb2RlbC5zcGVjKCkubmFtZTtcbiAgY29uc3QgaXNGYWNldGVkID0gbW9kZWwuaGFzKFJPVykgfHwgbW9kZWwuaGFzKENPTFVNTik7XG4gIGNvbnN0IGRhdGFGcm9tID0ge2RhdGE6IG1vZGVsLmRhdGFUYWJsZSgpfTtcbiAgY29uc3QgbWFya0NvbmZpZyA9IG1vZGVsLmNvbmZpZygpLm1hcms7XG4gIGNvbnN0IHNvcnRCeSA9IG1hcmtDb25maWcuc29ydEJ5O1xuXG4gIGlmIChtYXJrID09PSBMSU5FIHx8IG1hcmsgPT09IEFSRUEpIHtcbiAgICBjb25zdCBkZXRhaWxzID0gZGV0YWlsRmllbGRzKG1vZGVsKTtcblxuICAgIC8vIEZvciBsaW5lIGFuZCBhcmVhLCB3ZSBzb3J0IHZhbHVlcyBiYXNlZCBvbiBkaW1lbnNpb24gYnkgZGVmYXVsdFxuICAgIC8vIEZvciBsaW5lLCBhIHNwZWNpYWwgY29uZmlnIFwic29ydExpbmVCeVwiIGlzIGFsbG93ZWRcbiAgICBsZXQgc29ydExpbmVCeSA9IG1hcmsgPT09IExJTkUgPyBtYXJrQ29uZmlnLnNvcnRMaW5lQnkgOiB1bmRlZmluZWQ7XG4gICAgaWYgKCFzb3J0TGluZUJ5KSB7XG4gICAgICBzb3J0TGluZUJ5ID0gJy0nICsgbW9kZWwuZmllbGQobWFya0NvbmZpZy5vcmllbnQgPT09ICdob3Jpem9udGFsJyA/IFkgOiBYKTtcbiAgICB9XG5cbiAgICBsZXQgcGF0aE1hcmtzOiBhbnkgPSBleHRlbmQoXG4gICAgICBuYW1lID8geyBuYW1lOiBuYW1lICsgJy1tYXJrcycgfSA6IHt9LFxuICAgICAge1xuICAgICAgICB0eXBlOiBtYXJrQ29tcGlsZXJbbWFya10ubWFya1R5cGUobW9kZWwpLFxuICAgICAgICBmcm9tOiBleHRlbmQoXG4gICAgICAgICAgLy8gSWYgaGFzIGZhY2V0LCBgZnJvbS5kYXRhYCB3aWxsIGJlIGFkZGVkIGluIHRoZSBjZWxsIGdyb3VwLlxuICAgICAgICAgIC8vIElmIGhhcyBzdWJmYWNldCBmb3IgbGluZS9hcmVhIGdyb3VwLCBgZnJvbS5kYXRhYCB3aWxsIGJlIGFkZGVkIGluIHRoZSBvdXRlciBzdWJmYWNldCBncm91cCBiZWxvdy5cbiAgICAgICAgICAvLyBJZiBoYXMgbm8gc3ViZmFjZXQsIGFkZCBmcm9tLmRhdGEuXG4gICAgICAgICAgaXNGYWNldGVkIHx8IGRldGFpbHMubGVuZ3RoID4gMCA/IHt9IDogZGF0YUZyb20sXG5cbiAgICAgICAgICAvLyBzb3J0IHRyYW5zZm9ybVxuICAgICAgICAgIHt0cmFuc2Zvcm06IFt7IHR5cGU6ICdzb3J0JywgYnk6IHNvcnRMaW5lQnkgfV19XG4gICAgICAgICksXG4gICAgICAgIHByb3BlcnRpZXM6IHsgdXBkYXRlOiBtYXJrQ29tcGlsZXJbbWFya10ucHJvcGVydGllcyhtb2RlbCkgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBGSVhNRSBpcyB0aGVyZSBhIGNhc2Ugd2hlcmUgYXJlYSByZXF1aXJlcyBpbXB1dGUgd2l0aG91dCBzdGFja2luZz9cblxuICAgIGlmIChkZXRhaWxzLmxlbmd0aCA+IDApIHsgLy8gaGF2ZSBsZXZlbCBvZiBkZXRhaWxzIC0gbmVlZCB0byBmYWNldCBsaW5lIGludG8gc3ViZ3JvdXBzXG4gICAgICBjb25zdCBmYWNldFRyYW5zZm9ybSA9IHsgdHlwZTogJ2ZhY2V0JywgZ3JvdXBieTogZGV0YWlscyB9O1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBhbnlbXSA9IFtdLmNvbmNhdChcbiAgICAgICAgKHNvcnRCeSA/IFt7dHlwZTogJ3NvcnQnLCBieTogc29ydEJ5fV0gOiBbXSksXG4gICAgICAgIG1hcmsgPT09IEFSRUEgJiYgbW9kZWwuc3RhY2soKSA/XG4gICAgICAgICAgLy8gRm9yIHN0YWNrZWQgYXJlYSwgd2UgbmVlZCB0byBpbXB1dGUgbWlzc2luZyB0dXBsZXMgYW5kIHN0YWNrIHZhbHVlc1xuICAgICAgICAgIFtpbXB1dGVUcmFuc2Zvcm0obW9kZWwpLCBzdGFja1RyYW5zZm9ybShtb2RlbCksIGZhY2V0VHJhbnNmb3JtXSA6XG4gICAgICAgICAgW2ZhY2V0VHJhbnNmb3JtXVxuICAgICAgICApO1xuXG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgbmFtZTogKG5hbWUgPyBuYW1lICsgJy0nIDogJycpICsgbWFyayArICctZmFjZXQnLFxuICAgICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgICBmcm9tOiBleHRlbmQoXG4gICAgICAgICAgLy8gSWYgaGFzIGZhY2V0LCBgZnJvbS5kYXRhYCB3aWxsIGJlIGFkZGVkIGluIHRoZSBjZWxsIGdyb3VwLlxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgYWRkIGl0IGhlcmUuXG4gICAgICAgICAgaXNGYWNldGVkID8ge30gOiBkYXRhRnJvbSxcbiAgICAgICAgICB7dHJhbnNmb3JtOiB0cmFuc2Zvcm19XG4gICAgICAgICksXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICAgIHdpZHRoOiB7IGZpZWxkOiB7IGdyb3VwOiAnd2lkdGgnIH0gfSxcbiAgICAgICAgICAgIGhlaWdodDogeyBmaWVsZDogeyBncm91cDogJ2hlaWdodCcgfSB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtYXJrczogW3BhdGhNYXJrc11cbiAgICAgIH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW3BhdGhNYXJrc107XG4gICAgfVxuICB9IGVsc2UgeyAvLyBvdGhlciBtYXJrIHR5cGVcbiAgICBsZXQgbWFya3MgPSBbXTsgLy8gVE9ETzogdmdNYXJrc1xuICAgIGlmIChtYXJrID09PSBURVhUTUFSSyAmJlxuICAgICAgbW9kZWwuaGFzKENPTE9SKSAmJlxuICAgICAgbW9kZWwuY29uZmlnKCkubWFyay5hcHBseUNvbG9yVG9CYWNrZ3JvdW5kICYmICFtb2RlbC5oYXMoWCkgJiYgIW1vZGVsLmhhcyhZKVxuICAgICkge1xuICAgICAgLy8gYWRkIGJhY2tncm91bmQgdG8gJ3RleHQnIG1hcmtzIGlmIGhhcyBjb2xvclxuICAgICAgbWFya3MucHVzaChleHRlbmQoXG4gICAgICAgIG5hbWUgPyB7IG5hbWU6IG5hbWUgKyAnLWJhY2tncm91bmQnIH0gOiB7fSxcbiAgICAgICAge3R5cGU6ICdyZWN0J30sXG4gICAgICAgIC8vIElmIGhhcyBmYWNldCwgYGZyb20uZGF0YWAgd2lsbCBiZSBhZGRlZCBpbiB0aGUgY2VsbCBncm91cC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhZGQgaXQgaGVyZS5cbiAgICAgICAgaXNGYWNldGVkID8ge30gOiB7ZnJvbTogZGF0YUZyb219LFxuICAgICAgICAvLyBQcm9wZXJ0aWVzXG4gICAgICAgIHtwcm9wZXJ0aWVzOiB7IHVwZGF0ZTogdGV4dC5iYWNrZ3JvdW5kKG1vZGVsKSB9IH1cbiAgICAgICkpO1xuICAgIH1cblxuICAgIG1hcmtzLnB1c2goZXh0ZW5kKFxuICAgICAgbmFtZSA/IHsgbmFtZTogbmFtZSArICctbWFya3MnIH0gOiB7fSxcbiAgICAgIHsgdHlwZTogbWFya0NvbXBpbGVyW21hcmtdLm1hcmtUeXBlKG1vZGVsKSB9LFxuICAgICAgLy8gQWRkIGBmcm9tYCBpZiBuZWVkZWRcbiAgICAgICghaXNGYWNldGVkIHx8IG1vZGVsLnN0YWNrKCkgfHwgc29ydEJ5KSA/IHtcbiAgICAgICAgZnJvbTogZXh0ZW5kKFxuICAgICAgICAgIC8vIElmIGZhY2V0ZWQsIGBmcm9tLmRhdGFgIHdpbGwgYmUgYWRkZWQgaW4gdGhlIGNlbGwgZ3JvdXAuXG4gICAgICAgICAgLy8gT3RoZXJ3aXNlLCBhZGQgaXQgaGVyZVxuICAgICAgICAgIGlzRmFjZXRlZCA/IHt9IDogZGF0YUZyb20sXG4gICAgICAgICAgLy8gU3RhY2tlZCBDaGFydCBuZWVkIGFkZGl0aW9uYWwgdHJhbnNmb3JtXG4gICAgICAgICAgbW9kZWwuc3RhY2soKSB8fCBzb3J0QnkgPyB7IHRyYW5zZm9ybTogW10uY29uY2F0KFxuICAgICAgICAgICAgICAobW9kZWwuc3RhY2soKSA/IFtzdGFja1RyYW5zZm9ybShtb2RlbCldIDogW10pLFxuICAgICAgICAgICAgICBzb3J0QnkgPyBbe3R5cGU6J3NvcnQnLCBieTogc29ydEJ5fV0gOiBbXVxuICAgICAgICAgICl9IDoge31cbiAgICAgICAgKVxuICAgICAgfSA6IHt9LFxuICAgICAgLy8gcHJvcGVydGllcyBncm91cHNcbiAgICAgIHsgcHJvcGVydGllczogeyB1cGRhdGU6IG1hcmtDb21waWxlclttYXJrXS5wcm9wZXJ0aWVzKG1vZGVsKSB9IH1cbiAgICApKTtcblxuICAgIGlmIChtb2RlbC5oYXMoTEFCRUwpICYmIG1hcmtDb21waWxlclttYXJrXS5sYWJlbHMpIHtcbiAgICAgIGNvbnN0IGxhYmVsUHJvcGVydGllcyA9IG1hcmtDb21waWxlclttYXJrXS5sYWJlbHMobW9kZWwpO1xuXG4gICAgICAvLyBjaGVjayBpZiB3ZSBoYXZlIGxhYmVsIG1ldGhvZCBmb3IgY3VycmVudCBtYXJrIHR5cGUuXG4gICAgICBpZiAobGFiZWxQcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQpIHsgLy8gSWYgbGFiZWwgaXMgc3VwcG9ydGVkXG4gICAgICAgIC8vIGFkZCBsYWJlbCBncm91cFxuICAgICAgICBtYXJrcy5wdXNoKGV4dGVuZChcbiAgICAgICAgICBuYW1lID8geyBuYW1lOiBuYW1lICsgJy1sYWJlbCcgfSA6IHt9LFxuICAgICAgICAgIHt0eXBlOiAndGV4dCd9LFxuICAgICAgICAgIC8vIElmIGhhcyBmYWNldCwgYGZyb20uZGF0YWAgd2lsbCBiZSBhZGRlZCBpbiB0aGUgY2VsbCBncm91cC5cbiAgICAgICAgICAvLyBPdGhlcndpc2UsIGFkZCBpdCBoZXJlLlxuICAgICAgICAgIGlzRmFjZXRlZCA/IHt9IDoge2Zyb206IGRhdGFGcm9tfSxcbiAgICAgICAgICAvLyBQcm9wZXJ0aWVzXG4gICAgICAgICAgeyBwcm9wZXJ0aWVzOiB7IHVwZGF0ZTogbGFiZWxQcm9wZXJ0aWVzIH0gfVxuICAgICAgICApKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWFya3M7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGxpc3Qgb2YgZGV0YWlsIGZpZWxkcyAoZm9yICdjb2xvcicsICdzaGFwZScsIG9yICdkZXRhaWwnIGNoYW5uZWxzKVxuICogdGhhdCB0aGUgbW9kZWwncyBzcGVjIGNvbnRhaW5zLlxuICovXG5mdW5jdGlvbiBkZXRhaWxGaWVsZHMobW9kZWw6IE1vZGVsKTogc3RyaW5nW10ge1xuICByZXR1cm4gW0NPTE9SLCBERVRBSUwsIFNIQVBFXS5yZWR1Y2UoZnVuY3Rpb24oZGV0YWlscywgY2hhbm5lbCkge1xuICAgIGlmIChtb2RlbC5oYXMoY2hhbm5lbCkgJiYgIW1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLmFnZ3JlZ2F0ZSkge1xuICAgICAgZGV0YWlscy5wdXNoKG1vZGVsLmZpZWxkKGNoYW5uZWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH0sIFtdKTtcbn1cbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9ibG9iL21hc3Rlci9kb2Mvc3BlYy5tZCMxMS1hbWJpZW50LWRlY2xhcmF0aW9uc1xuZGVjbGFyZSB2YXIgZXhwb3J0cztcblxuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5cbmltcG9ydCB7Y29udGFpbnMsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL01vZGVsJztcbmltcG9ydCB7U0hBUkVEX0RPTUFJTl9PUFN9IGZyb20gJy4uL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZLCBTSEFQRSwgU0laRSwgQ09MT1IsIFRFWFQsIERFVEFJTCwgQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge1NPVVJDRSwgU1RBQ0tFRF9TQ0FMRX0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQge2lzRGltZW5zaW9ufSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge05PTUlOQUwsIE9SRElOQUwsIFFVQU5USVRBVElWRSwgVEVNUE9SQUx9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHtNYXJrLCBCQVIsIFRFWFQgYXMgVEVYVF9NQVJLLCBUSUNLfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7cmF3RG9tYWlufSBmcm9tICcuL3RpbWUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVNjYWxlcyhjaGFubmVsczogQ2hhbm5lbFtdLCBtb2RlbDogTW9kZWwpIHtcbiAgcmV0dXJuIGNoYW5uZWxzLmZpbHRlcihmdW5jdGlvbihjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICByZXR1cm4gY2hhbm5lbCAhPT0gREVUQUlMO1xuICAgIH0pXG4gICAgLm1hcChmdW5jdGlvbihjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gICAgICB2YXIgc2NhbGVEZWY6IGFueSA9IHtcbiAgICAgICAgbmFtZTogbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpLFxuICAgICAgICB0eXBlOiB0eXBlKGZpZWxkRGVmLCBjaGFubmVsLCBtb2RlbC5tYXJrKCkpLFxuICAgICAgfTtcblxuICAgICAgc2NhbGVEZWYuZG9tYWluID0gZG9tYWluKG1vZGVsLCBjaGFubmVsLCBzY2FsZURlZi50eXBlKTtcbiAgICAgIGV4dGVuZChzY2FsZURlZiwgcmFuZ2VNaXhpbnMobW9kZWwsIGNoYW5uZWwsIHNjYWxlRGVmLnR5cGUpKTtcblxuICAgICAgLy8gQWRkIG9wdGlvbmFsIHByb3BlcnRpZXNcbiAgICAgIFtcbiAgICAgICAgLy8gZ2VuZXJhbCBwcm9wZXJ0aWVzXG4gICAgICAgICdyZXZlcnNlJywgJ3JvdW5kJyxcbiAgICAgICAgLy8gcXVhbnRpdGF0aXZlIC8gdGltZVxuICAgICAgICAnY2xhbXAnLCAnbmljZScsXG4gICAgICAgIC8vIHF1YW50aXRhdGl2ZVxuICAgICAgICAnZXhwb25lbnQnLCAnemVybycsXG4gICAgICAgIC8vIG9yZGluYWxcbiAgICAgICAgJ291dGVyUGFkZGluZycsICdwYWRkaW5nJywgJ3BvaW50cydcbiAgICAgIF0uZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAvLyBUT0RPIGluY2x1ZGUgZmllbGREZWYgYXMgcGFydCBvZiB0aGUgcGFyYW1ldGVyc1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGV4cG9ydHNbcHJvcGVydHldKG1vZGVsLCBjaGFubmVsLCBzY2FsZURlZi50eXBlKTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzY2FsZURlZltwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBzY2FsZURlZjtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGUoZmllbGREZWY6IEZpZWxkRGVmLCBjaGFubmVsOiBDaGFubmVsLCBtYXJrOiBNYXJrKTogc3RyaW5nIHtcbiAgc3dpdGNoIChmaWVsZERlZi50eXBlKSB7XG4gICAgY2FzZSBOT01JTkFMOlxuICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICBjYXNlIE9SRElOQUw6XG4gICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgIGNhc2UgVEVNUE9SQUw6XG4gICAgICBpZiAoY2hhbm5lbCA9PT0gQ09MT1IpIHtcbiAgICAgICAgLy8gRklYTUUoIzg5MCkgaWYgdXNlciBzcGVjaWZ5IHNjYWxlLnJhbmdlIGFzIG9yZGluYWwgcHJlc2V0cywgdGhlbiB0aGlzIHNob3VsZCBiZSBvcmRpbmFsLlxuICAgICAgICAvLyBBbHNvLCBpZiB3ZSBzdXBwb3J0IGNvbG9yIHJhbXAsIHRoaXMgc2hvdWxkIGJlIG9yZGluYWwgdG9vLlxuICAgICAgICByZXR1cm4gJ3RpbWUnOyAvLyB0aW1lIGhhcyBvcmRlciwgc28gdXNlIGludGVycG9sYXRlZCBvcmRpbmFsIGNvbG9yIHNjYWxlLlxuICAgICAgfVxuICAgICAgaWYgKGNvbnRhaW5zKFtST1csIENPTFVNTiwgU0hBUEVdLCBjaGFubmVsKSkge1xuICAgICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgICAgfVxuICAgICAgaWYgKGZpZWxkRGVmLnNjYWxlLnR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmllbGREZWYuc2NhbGUudHlwZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgICAgIHN3aXRjaCAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgICBjYXNlICdob3Vycyc6XG4gICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgICAgIC8vIFJldHVybnMgb3JkaW5hbCBpZiAoMSkgdGhlIGNoYW5uZWwgaXMgWCBvciBZLCBhbmRcbiAgICAgICAgICAgIC8vICgyKSBpcyB0aGUgZGltZW5zaW9uIG9mIEJBUiBvciBUSUNLIG1hcmsuXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UgcmV0dXJuIGxpbmVhci5cbiAgICAgICAgICAgIHJldHVybiBjb250YWlucyhbQkFSLCBUSUNLXSwgbWFyaykgJiZcbiAgICAgICAgICAgICAgaXNEaW1lbnNpb24oZmllbGREZWYpID8gJ29yZGluYWwnIDogJ3RpbWUnO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAvLyB5ZWFybW9udGgsIG1vbnRoZGF5LCAuLi5cbiAgICAgICAgICAgIHJldHVybiAnb3JkaW5hbCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAndGltZSc7XG5cbiAgICBjYXNlIFFVQU5USVRBVElWRTpcbiAgICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgLy8gVE9ETygjODkwKTogSWRlYWxseSBiaW5uZWQgQ09MT1Igc2hvdWxkIGJlIGFuIG9yZGluYWwgc2NhbGVcbiAgICAgICAgLy8gSG93ZXZlciwgY3VycmVudGx5IG9yZGluYWwgc2NhbGUgZG9lc24ndCBzdXBwb3J0IGNvbG9yIHJhbXAgeWV0LlxuICAgICAgICByZXR1cm4gY29udGFpbnMoW1gsIFksIENPTE9SXSwgY2hhbm5lbCkgPyAnbGluZWFyJyA6ICdvcmRpbmFsJztcbiAgICAgIH1cbiAgICAgIGlmIChmaWVsZERlZi5zY2FsZS50eXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkRGVmLnNjYWxlLnR5cGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gJ2xpbmVhcic7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvbWFpbihtb2RlbDogTW9kZWwsIGNoYW5uZWw6Q2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpIHtcbiAgdmFyIGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgaWYgKGZpZWxkRGVmLnNjYWxlLmRvbWFpbikgeyAvLyBleHBsaWNpdCB2YWx1ZVxuICAgIHJldHVybiBmaWVsZERlZi5zY2FsZS5kb21haW47XG4gIH1cblxuICAvLyBzcGVjaWFsIGNhc2UgZm9yIHRlbXBvcmFsIHNjYWxlXG4gIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xuICAgIGlmIChyYXdEb21haW4oZmllbGREZWYudGltZVVuaXQsIGNoYW5uZWwpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRhOiBmaWVsZERlZi50aW1lVW5pdCxcbiAgICAgICAgZmllbGQ6ICdkYXRlJ1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCksXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsKSxcbiAgICAgICAgb3A6ICdtaW4nXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIEZvciBzdGFjaywgdXNlIFNUQUNLRUQgZGF0YS5cbiAgdmFyIHN0YWNrID0gbW9kZWwuc3RhY2soKTtcbiAgaWYgKHN0YWNrICYmIGNoYW5uZWwgPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBTVEFDS0VEX1NDQUxFLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtcbiAgICAgICAgLy8gSWYgZmFjZXRlZCwgc2NhbGUgaXMgZGV0ZXJtaW5lZCBieSB0aGUgbWF4IG9mIHN1bSBpbiBlYWNoIGZhY2V0LlxuICAgICAgICBwcmVmbjogJ3N1bV8nXG4gICAgICB9KVxuICAgIH07XG4gIH1cblxuICB2YXIgdXNlUmF3RG9tYWluID0gX3VzZVJhd0RvbWFpbihtb2RlbCwgY2hhbm5lbCwgc2NhbGVUeXBlKTtcbiAgdmFyIHNvcnQgPSBkb21haW5Tb3J0KG1vZGVsLCBjaGFubmVsLCBzY2FsZVR5cGUpO1xuXG4gIGlmICh1c2VSYXdEb21haW4pIHsgLy8gdXNlUmF3RG9tYWluIC0gb25seSBRL1RcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogU09VUkNFLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtub0FnZ3JlZ2F0ZTogdHJ1ZX0pXG4gICAgfTtcbiAgfSBlbHNlIGlmIChmaWVsZERlZi5iaW4pIHsgLy8gYmluXG4gICAgcmV0dXJuIHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnID8ge1xuICAgICAgLy8gb3JkaW5hbCBiaW4gc2NhbGUgdGFrZXMgZG9tYWluIGZyb20gYmluX3JhbmdlLCBvcmRlcmVkIGJ5IGJpbl9zdGFydFxuICAgICAgZGF0YTogbW9kZWwuZGF0YVRhYmxlKCksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwgeyBiaW5TdWZmaXg6ICdfcmFuZ2UnIH0pLFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwgeyBiaW5TdWZmaXg6ICdfc3RhcnQnIH0pLFxuICAgICAgICBvcDogJ21pbicgLy8gbWluIG9yIG1heCBkb2Vzbid0IG1hdHRlciBzaW5jZSBzYW1lIF9yYW5nZSB3b3VsZCBoYXZlIHRoZSBzYW1lIF9zdGFydFxuICAgICAgfVxuICAgIH0gOiBjaGFubmVsID09PSBDT0xPUiA/IHtcbiAgICAgIC8vIEN1cnJlbnRseSwgYmlubmVkIG9uIGNvbG9yIHVzZXMgbGluZWFyIHNjYWxlIGFuZCB0aHVzIHVzZSBfc3RhcnQgcG9pbnRcbiAgICAgIC8vIFRPRE86IFRoaXMgaWRlYWxseSBzaG91bGQgYmVjb21lIG9yZGluYWwgc2NhbGUgb25jZSBvcmRpbmFsIHNjYWxlIHN1cHBvcnRzIGNvbG9yIHJhbXAuXG4gICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7IGJpblN1ZmZpeDogJ19zdGFydCcgfSlcbiAgICB9IDoge1xuICAgICAgLy8gb3RoZXIgbGluZWFyIGJpbiBzY2FsZSBtZXJnZXMgYm90aCBiaW5fc3RhcnQgYW5kIGJpbl9lbmQgZm9yIG5vbi1vcmRpbmFsIHNjYWxlXG4gICAgICBkYXRhOiBtb2RlbC5kYXRhVGFibGUoKSxcbiAgICAgIGZpZWxkOiBbXG4gICAgICAgIG1vZGVsLmZpZWxkKGNoYW5uZWwsIHsgYmluU3VmZml4OiAnX3N0YXJ0JyB9KSxcbiAgICAgICAgbW9kZWwuZmllbGQoY2hhbm5lbCwgeyBiaW5TdWZmaXg6ICdfZW5kJyB9KVxuICAgICAgXVxuICAgIH07XG4gIH0gZWxzZSBpZiAoc29ydCkgeyAvLyBoYXZlIHNvcnQgLS0gb25seSBmb3Igb3JkaW5hbFxuICAgIHJldHVybiB7XG4gICAgICAvLyBJZiBzb3J0IGJ5IGFnZ3JlZ2F0aW9uIG9mIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQsIHdlIG5lZWQgdG8gdXNlIFNPVVJDRSB0YWJsZSxcbiAgICAgIC8vIHNvIHdlIGNhbiBhZ2dyZWdhdGUgdmFsdWVzIGZvciB0aGUgc2NhbGUgaW5kZXBlbmRlbnRseSBmcm9tIHRoZSBtYWluIGFnZ3JlZ2F0aW9uLlxuICAgICAgZGF0YTogc29ydC5vcCA/IFNPVVJDRSA6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwpLFxuICAgICAgc29ydDogc29ydFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IG1vZGVsLmRhdGFUYWJsZSgpLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwpXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9tYWluU29ydChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKTogYW55IHtcbiAgdmFyIHNvcnQgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zb3J0O1xuICBpZiAoc29ydCA9PT0gJ2FzY2VuZGluZycgfHwgc29ydCA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBTb3J0ZWQgYmFzZWQgb24gYW4gYWdncmVnYXRlIGNhbGN1bGF0aW9uIG92ZXIgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCAob25seSBmb3Igb3JkaW5hbCBzY2FsZSlcbiAgaWYgKHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnICYmIHR5cGVvZiBzb3J0ICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB7XG4gICAgICBvcDogc29ydC5vcCxcbiAgICAgIGZpZWxkOiBzb3J0LmZpZWxkXG4gICAgfTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmV2ZXJzZShtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgdmFyIHNvcnQgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKS5zb3J0O1xuICByZXR1cm4gc29ydCAmJiAodHlwZW9mIHNvcnQgPT09ICdzdHJpbmcnID9cbiAgICAgICAgICAgICAgICAgICAgc29ydCA9PT0gJ2Rlc2NlbmRpbmcnIDpcbiAgICAgICAgICAgICAgICAgICAgc29ydC5vcmRlciA9PT0gJ2Rlc2NlbmRpbmcnXG4gICAgICAgICAgICAgICAgICkgPyB0cnVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB1c2VSYXdEb21haW4gc2hvdWxkIGJlIGFjdGl2YXRlZCBmb3IgdGhpcyBzY2FsZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBhbGwgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRvbnMgYXBwbGllczpcbiAqIDEuIGB1c2VSYXdEb21haW5gIGlzIGVuYWJsZWQgZWl0aGVyIHRocm91Z2ggc2NhbGUgb3IgY29uZmlnXG4gKiAyLiBBZ2dyZWdhdGlvbiBmdW5jdGlvbiBpcyBub3QgYGNvdW50YCBvciBgc3VtYFxuICogMy4gVGhlIHNjYWxlIGlzIHF1YW50aXRhdGl2ZSBvciB0aW1lIHNjYWxlLlxuICovXG5mdW5jdGlvbiBfdXNlUmF3RG9tYWluIChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgcmV0dXJuIGZpZWxkRGVmLnNjYWxlLnVzZVJhd0RvbWFpbiAmJiAvLyAgaWYgdXNlUmF3RG9tYWluIGlzIGVuYWJsZWRcbiAgICAvLyBvbmx5IGFwcGxpZWQgdG8gYWdncmVnYXRlIHRhYmxlXG4gICAgZmllbGREZWYuYWdncmVnYXRlICYmXG4gICAgLy8gb25seSBhY3RpdmF0ZWQgaWYgdXNlZCB3aXRoIGFnZ3JlZ2F0ZSBmdW5jdGlvbnMgdGhhdCBwcm9kdWNlcyB2YWx1ZXMgcmFuZ2luZyBpbiB0aGUgZG9tYWluIG9mIHRoZSBzb3VyY2UgZGF0YVxuICAgIFNIQVJFRF9ET01BSU5fT1BTLmluZGV4T2YoZmllbGREZWYuYWdncmVnYXRlKSA+PSAwICYmXG4gICAgKFxuICAgICAgLy8gUSBhbHdheXMgdXNlcyBxdWFudGl0YXRpdmUgc2NhbGUgZXhjZXB0IHdoZW4gaXQncyBiaW5uZWQuXG4gICAgICAvLyBCaW5uZWQgZmllbGQgaGFzIHNpbWlsYXIgdmFsdWVzIGluIGJvdGggdGhlIHNvdXJjZSB0YWJsZSBhbmQgdGhlIHN1bW1hcnkgdGFibGVcbiAgICAgIC8vIGJ1dCB0aGUgc3VtbWFyeSB0YWJsZSBoYXMgZmV3ZXIgdmFsdWVzLCB0aGVyZWZvcmUgYmlubmVkIGZpZWxkcyBkcmF3XG4gICAgICAvLyBkb21haW4gdmFsdWVzIGZyb20gdGhlIHN1bW1hcnkgdGFibGUuXG4gICAgICAoZmllbGREZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFICYmICFmaWVsZERlZi5iaW4pIHx8XG4gICAgICAvLyBUIHVzZXMgbm9uLW9yZGluYWwgc2NhbGUgd2hlbiB0aGVyZSdzIG5vIHVuaXQgb3Igd2hlbiB0aGUgdW5pdCBpcyBub3Qgb3JkaW5hbC5cbiAgICAgIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCAmJiBzY2FsZVR5cGUgPT09ICdsaW5lYXInKVxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYW5kV2lkdGgobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IHN0cmluZykge1xuICBpZiAoc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUuYmFuZFdpZHRoO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFtcChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgLy8gb25seSByZXR1cm4gdmFsdWUgaWYgZXhwbGljaXQgdmFsdWUgaXMgc3BlY2lmaWVkLlxuICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUuY2xhbXA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHBvbmVudChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgLy8gb25seSByZXR1cm4gdmFsdWUgaWYgZXhwbGljaXQgdmFsdWUgaXMgc3BlY2lmaWVkLlxuICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUuZXhwb25lbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuaWNlKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpIHtcbiAgaWYgKG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLm5pY2UgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIGV4cGxpY2l0IHZhbHVlXG4gICAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLm5pY2U7XG4gIH1cblxuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFg6IC8qIGZhbGwgdGhyb3VnaCAqL1xuICAgIGNhc2UgWTpcbiAgICAgIGlmIChzY2FsZVR5cGUgPT09ICd0aW1lJyB8fCBzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjYXNlIFJPVzogLyogZmFsbCB0aHJvdWdoICovXG4gICAgY2FzZSBDT0xVTU46XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3V0ZXJQYWRkaW5nKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgc2NhbGVUeXBlOiBzdHJpbmcpIHtcbiAgaWYgKHNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgaWYgKG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLm91dGVyUGFkZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbW9kZWwuZmllbGREZWYoY2hhbm5lbCkuc2NhbGUub3V0ZXJQYWRkaW5nOyAvLyBleHBsaWNpdCB2YWx1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkZGluZyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJyAmJiBjaGFubmVsICE9PSBST1cgJiYgY2hhbm5lbCAhPT0gQ09MVU1OKSB7XG4gICAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLnBhZGRpbmc7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvaW50cyhtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIHNjYWxlVHlwZTogc3RyaW5nKSB7XG4gIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgICAgY2FzZSBYOlxuICAgICAgY2FzZSBZOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VNaXhpbnMobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IHN0cmluZyk6IGFueSB7XG4gIHZhciBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJyAmJiBmaWVsZERlZi5zY2FsZS5iYW5kV2lkdGgpIHtcbiAgICByZXR1cm4ge2JhbmRXaWR0aDogZmllbGREZWYuc2NhbGUuYmFuZFdpZHRofTtcbiAgfVxuXG4gIGlmIChmaWVsZERlZi5zY2FsZS5yYW5nZSkgeyAvLyBleHBsaWNpdCB2YWx1ZVxuICAgIHJldHVybiB7cmFuZ2U6IGZpZWxkRGVmLnNjYWxlLnJhbmdlfTtcbiAgfVxuXG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgWDpcbiAgICAgIC8vIHdlIGNhbid0IHVzZSB7cmFuZ2U6IFwid2lkdGhcIn0gaGVyZSBzaW5jZSB3ZSBwdXQgc2NhbGUgaW4gdGhlIHJvb3QgZ3JvdXBcbiAgICAgIC8vIG5vdCBpbnNpZGUgdGhlIGNlbGwsIHNvIHNjYWxlIGlzIHJldXNhYmxlIGZvciBheGVzIGdyb3VwXG4gICAgICByZXR1cm4ge3JhbmdlTWluOiAwLCByYW5nZU1heDogbW9kZWwubGF5b3V0KCkuY2VsbFdpZHRofTtcbiAgICBjYXNlIFk6XG4gICAgICAvLyBXZSBjYW4ndCB1c2Uge3JhbmdlOiBcImhlaWdodFwifSBoZXJlIGZvciB0aGUgc2FtZSByZWFzb25cbiAgICAgIGlmIChzY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICByZXR1cm4ge3JhbmdlTWluOiAwLCByYW5nZU1heDogbW9kZWwubGF5b3V0KCkuY2VsbEhlaWdodH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge3JhbmdlTWluOiBtb2RlbC5sYXlvdXQoKS5jZWxsSGVpZ2h0LCByYW5nZU1heDogMH07XG4gICAgY2FzZSBTSVpFOlxuICAgICAgaWYgKG1vZGVsLmlzKEJBUikpIHtcbiAgICAgICAgLy8gVE9ETzogZGV0ZXJtaW5lIGJhbmRTaXplIGZvciBiaW4sIHdoaWNoIGFjdHVhbGx5IHVzZXMgbGluZWFyIHNjYWxlXG4gICAgICAgIGNvbnN0IGRpbWVuc2lvbiA9IG1vZGVsLmNvbmZpZygpLm1hcmsub3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyBZIDogWDtcbiAgICAgICAgcmV0dXJuIHtyYW5nZTogWzIsIG1vZGVsLmZpZWxkRGVmKGRpbWVuc2lvbikuc2NhbGUuYmFuZFdpZHRoXX07XG4gICAgICB9IGVsc2UgaWYgKG1vZGVsLmlzKFRFWFRfTUFSSykpIHtcbiAgICAgICAgcmV0dXJuIHtyYW5nZTogWzgsIDQwXX07XG4gICAgICB9IGVsc2UgeyAvLyBwb2ludCwgc3F1YXJlLCBjaXJjbGVcbiAgICAgICAgY29uc3QgeElzTWVhc3VyZSA9IG1vZGVsLmlzTWVhc3VyZShYKTtcbiAgICAgICAgY29uc3QgeUlzTWVhc3VyZSA9IG1vZGVsLmlzTWVhc3VyZShZKTtcblxuICAgICAgICBjb25zdCBiYW5kV2lkdGggPSB4SXNNZWFzdXJlICE9PSB5SXNNZWFzdXJlID9cbiAgICAgICAgICBtb2RlbC5maWVsZERlZih4SXNNZWFzdXJlID8gWSA6IFgpLnNjYWxlLmJhbmRXaWR0aCA6XG4gICAgICAgICAgTWF0aC5taW4obW9kZWwuZmllbGREZWYoWCkuc2NhbGUuYmFuZFdpZHRoLCBtb2RlbC5maWVsZERlZihZKS5zY2FsZS5iYW5kV2lkdGgpO1xuXG4gICAgICAgIHJldHVybiB7cmFuZ2U6IFsxMCwgKGJhbmRXaWR0aCAtIDIpICogKGJhbmRXaWR0aCAtIDIpXX07XG4gICAgICB9XG4gICAgY2FzZSBTSEFQRTpcbiAgICAgIHJldHVybiB7cmFuZ2U6ICdzaGFwZXMnfTtcbiAgICBjYXNlIENPTE9SOlxuICAgICAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IE5PTUlOQUwpIHtcbiAgICAgICAgcmV0dXJuIHtyYW5nZTogJ2NhdGVnb3J5MTAnfTtcbiAgICAgIH0gZWxzZSB7IC8vIHRpbWUgb3IgcXVhbnRpdGF0aXZlXG4gICAgICAgIHJldHVybiB7cmFuZ2U6IFsnI0FGQzZBMycsICcjMDk2MjJBJ119OyAvLyB0YWJsZWF1IGdyZWVuc1xuICAgICAgfVxuICAgIGNhc2UgUk9XOlxuICAgICAgcmV0dXJuIHtyYW5nZTogJ2hlaWdodCd9O1xuICAgIGNhc2UgQ09MVU1OOlxuICAgICAgcmV0dXJuIHtyYW5nZTogJ3dpZHRoJ307XG4gIH1cbiAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcm91bmQobW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGlmIChtb2RlbC5maWVsZERlZihjaGFubmVsKS5zY2FsZS5yb3VuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnNjYWxlLnJvdW5kO1xuICB9XG5cbiAgLy8gRklYTUU6IHJldmlzZSBpZiByb3VuZCBpcyBhbHJlYWR5IHRoZSBkZWZhdWx0IHZhbHVlXG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgWDogLyogZmFsbCB0aHJvdWdoICovXG4gICAgY2FzZSBZOlxuICAgIGNhc2UgUk9XOlxuICAgIGNhc2UgQ09MVU1OOlxuICAgIGNhc2UgU0laRTpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICB2YXIgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgdmFyIHRpbWVVbml0ID0gZmllbGREZWYudGltZVVuaXQ7XG5cbiAgaWYgKGZpZWxkRGVmLnNjYWxlLnplcm8gIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIGV4cGxpY2l0IHZhbHVlXG4gICAgcmV0dXJuIGZpZWxkRGVmLnNjYWxlLnplcm87XG4gIH1cblxuICBpZiAoZmllbGREZWYudHlwZSA9PT0gVEVNUE9SQUwpIHtcbiAgICBpZiAodGltZVVuaXQgPT09ICd5ZWFyJykge1xuICAgICAgLy8geWVhciBpcyB1c2luZyBsaW5lYXIgc2NhbGUsIGJ1dCBzaG91bGQgbm90IGluY2x1ZGUgemVyb1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBJZiB0aGVyZSBpcyBubyB0aW1lVW5pdCBvciB0aGUgdGltZVVuaXQgdXNlcyBvcmRpbmFsIHNjYWxlLFxuICAgIC8vIHplcm8gcHJvcGVydHkgaXMgaWdub3JlZCBieSB2ZWdhIHNvIHdlIHNob3VsZCBub3QgZ2VuZXJhdGUgdGhlbSBhbnkgd2F5XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgLy8gUmV0dXJucyBmYWxzZSAodW5kZWZpbmVkKSBieSBkZWZhdWx0IG9mIGJpblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBjaGFubmVsID09PSBYIHx8IGNoYW5uZWwgPT09IFkgP1xuICAgIC8vIGlmIG5vdCBiaW4gLyB0ZW1wb3JhbCwgcmV0dXJucyB1bmRlZmluZWQgZm9yIFggYW5kIFkgZW5jb2RpbmdcbiAgICAvLyBzaW5jZSB6ZXJvIGlzIHRydWUgYnkgZGVmYXVsdCBpbiB2ZWdhIGZvciBsaW5lYXIgc2NhbGVcbiAgICB1bmRlZmluZWQgOlxuICAgIGZhbHNlO1xufVxuIiwiaW1wb3J0IHtTcGVjfSBmcm9tICcuLi9zY2hlbWEvc2NoZW1hJztcbmltcG9ydCB7c3RhY2tDb25maWcgYXMgc3RhY2tDb25maWdTY2hlbWF9IGZyb20gJy4uL3NjaGVtYS9jb25maWcuc3RhY2suc2NoZW1hJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uL3NjaGVtYS9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtpbnN0YW50aWF0ZX0gZnJvbSAnLi4vc2NoZW1hL3NjaGVtYXV0aWwnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9Nb2RlbCc7XG5pbXBvcnQge0NoYW5uZWwsIFgsIFksIENPTE9SLCBERVRBSUx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtCQVIsIEFSRUF9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtmaWVsZCwgaXNNZWFzdXJlfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge2hhcywgaXNBZ2dyZWdhdGV9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7aXNBcnJheSwgY29udGFpbnN9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge3R5cGUgYXMgc2NhbGVUeXBlfSBmcm9tICcuL3NjYWxlJztcblxuZXhwb3J0IGludGVyZmFjZSBTdGFja1Byb3BlcnRpZXMge1xuICAvKiogRGltZW5zaW9uIGF4aXMgb2YgdGhlIHN0YWNrICgneCcgb3IgJ3knKS4gKi9cbiAgZ3JvdXBieUNoYW5uZWw6IENoYW5uZWw7XG4gIC8qKiBNZWFzdXJlIGF4aXMgb2YgdGhlIHN0YWNrICgneCcgb3IgJ3knKS4gKi9cbiAgZmllbGRDaGFubmVsOiBDaGFubmVsO1xuXG4gIC8qKiBTdGFjay1ieSBmaWVsZCBuYW1lcyAoZnJvbSAnY29sb3InIGFuZCAnZGV0YWlsJykgKi9cbiAgc3RhY2tGaWVsZHM6IHN0cmluZ1tdO1xuXG4gIC8qKiBTdGFjayBjb25maWcgZm9yIHRoZSBzdGFjayB0cmFuc2Zvcm0uICovXG4gIGNvbmZpZzogYW55O1xufVxuXG4vLyBUT0RPOiBwdXQgYWxsIHZlZ2EgaW50ZXJmYWNlIGluIG9uZSBwbGFjZVxuaW50ZXJmYWNlIFN0YWNrVHJhbnNmb3JtIHtcbiAgdHlwZTogc3RyaW5nO1xuICBvZmZzZXQ/OiBhbnk7XG4gIGdyb3VwYnk6IGFueTtcbiAgZmllbGQ6IGFueTtcbiAgc29ydGJ5OiBhbnk7XG4gIG91dHB1dDogYW55O1xufVxuXG4vKiogQ29tcGlsZSBzdGFjayBwcm9wZXJ0aWVzIGZyb20gYSBnaXZlbiBzcGVjICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVN0YWNrUHJvcGVydGllcyhzcGVjOiBTcGVjKSB7XG4gIGNvbnN0IHN0YWNrRmllbGRzID0gZ2V0U3RhY2tGaWVsZHMoc3BlYyk7XG5cbiAgaWYgKHN0YWNrRmllbGRzLmxlbmd0aCA+IDAgJiZcbiAgICAgIGNvbnRhaW5zKFtCQVIsIEFSRUFdLCBzcGVjLm1hcmspICYmXG4gICAgICBzcGVjLmNvbmZpZy5zdGFjayAhPT0gZmFsc2UgJiZcbiAgICAgIGlzQWdncmVnYXRlKHNwZWMuZW5jb2RpbmcpKSB7XG5cbiAgICB2YXIgaXNYTWVhc3VyZSA9IGhhcyhzcGVjLmVuY29kaW5nLCBYKSAmJiBpc01lYXN1cmUoc3BlYy5lbmNvZGluZy54KTtcbiAgICB2YXIgaXNZTWVhc3VyZSA9IGhhcyhzcGVjLmVuY29kaW5nLCBZKSAmJiBpc01lYXN1cmUoc3BlYy5lbmNvZGluZy55KTtcblxuICAgIGlmIChpc1hNZWFzdXJlICYmICFpc1lNZWFzdXJlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBncm91cGJ5Q2hhbm5lbDogWSxcbiAgICAgICAgZmllbGRDaGFubmVsOiBYLFxuICAgICAgICBzdGFja0ZpZWxkczogc3RhY2tGaWVsZHMsXG4gICAgICAgIGNvbmZpZzogc3BlYy5jb25maWcuc3RhY2sgPT09IHRydWUgID8gaW5zdGFudGlhdGUoc3RhY2tDb25maWdTY2hlbWEpIDogc3BlYy5jb25maWcuc3RhY2tcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChpc1lNZWFzdXJlICYmICFpc1hNZWFzdXJlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBncm91cGJ5Q2hhbm5lbDogWCxcbiAgICAgICAgZmllbGRDaGFubmVsOiBZLFxuICAgICAgICBzdGFja0ZpZWxkczogc3RhY2tGaWVsZHMsXG4gICAgICAgIGNvbmZpZzogc3BlYy5jb25maWcuc3RhY2sgPT09IHRydWUgID8gaW5zdGFudGlhdGUoc3RhY2tDb25maWdTY2hlbWEpIDogc3BlYy5jb25maWcuc3RhY2tcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKiogQ29tcGlsZSBzdGFjay1ieSBmaWVsZCBuYW1lcyBmcm9tIChmcm9tICdjb2xvcicgYW5kICdkZXRhaWwnKSAqL1xuZnVuY3Rpb24gZ2V0U3RhY2tGaWVsZHMoc3BlYzogU3BlYykge1xuICByZXR1cm4gW0NPTE9SLCBERVRBSUxdLnJlZHVjZShmdW5jdGlvbihmaWVsZHMsIGNoYW5uZWwpIHtcbiAgICBjb25zdCBjaGFubmVsRW5jb2RpbmcgPSBzcGVjLmVuY29kaW5nW2NoYW5uZWxdO1xuICAgIGlmIChoYXMoc3BlYy5lbmNvZGluZywgY2hhbm5lbCkpIHtcbiAgICAgIGlmIChpc0FycmF5KGNoYW5uZWxFbmNvZGluZykpIHtcbiAgICAgICAgY2hhbm5lbEVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWYpIHtcbiAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZChmaWVsZERlZikpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGZpZWxkRGVmOiBGaWVsZERlZiA9IGNoYW5uZWxFbmNvZGluZztcbiAgICAgICAgZmllbGRzLnB1c2goZmllbGQoZmllbGREZWYsIHtcbiAgICAgICAgICBiaW5TdWZmaXg6IHNjYWxlVHlwZShmaWVsZERlZiwgY2hhbm5lbCwgc3BlYy5tYXJrKSA9PT0gJ29yZGluYWwnID8gJ19yYW5nZScgOiAnX3N0YXJ0J1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHM7XG4gIH0sIFtdKTtcbn1cblxuLy8gaW1wdXRlIGRhdGEgZm9yIHN0YWNrZWQgYXJlYVxuZXhwb3J0IGZ1bmN0aW9uIGltcHV0ZVRyYW5zZm9ybShtb2RlbDogTW9kZWwpIHtcbiAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaygpO1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdpbXB1dGUnLFxuICAgIGZpZWxkOiBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpLFxuICAgIGdyb3VwYnk6IHN0YWNrLnN0YWNrRmllbGRzLFxuICAgIG9yZGVyYnk6IFttb2RlbC5maWVsZChzdGFjay5ncm91cGJ5Q2hhbm5lbCldLFxuICAgIG1ldGhvZDogJ3ZhbHVlJyxcbiAgICB2YWx1ZTogMFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhY2tUcmFuc2Zvcm0obW9kZWw6IE1vZGVsKSB7XG4gIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2soKTtcbiAgY29uc3Qgc29ydGJ5ID0gc3RhY2suY29uZmlnLnNvcnQgPT09ICdhc2NlbmRpbmcnID9cbiAgICAgICAgICAgICAgICAgICBzdGFjay5zdGFja0ZpZWxkcyA6XG4gICAgICAgICAgICAgICAgIGlzQXJyYXkoc3RhY2suY29uZmlnLnNvcnQpID9cbiAgICAgICAgICAgICAgICAgICBzdGFjay5jb25maWcuc29ydCA6XG4gICAgICAgICAgICAgICAgICAgLy8gZGVzY2VuZGluZywgb3IgZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgIHN0YWNrLnN0YWNrRmllbGRzLm1hcChmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICctJyArIGZpZWxkO1xuICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gIGNvbnN0IHZhbE5hbWUgPSBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpO1xuXG4gIC8vIGFkZCBzdGFjayB0cmFuc2Zvcm0gdG8gbWFya1xuICB2YXIgdHJhbnNmb3JtOiBTdGFja1RyYW5zZm9ybSA9IHtcbiAgICB0eXBlOiAnc3RhY2snLFxuICAgIGdyb3VwYnk6IFttb2RlbC5maWVsZChzdGFjay5ncm91cGJ5Q2hhbm5lbCldLFxuICAgIGZpZWxkOiBtb2RlbC5maWVsZChzdGFjay5maWVsZENoYW5uZWwpLFxuICAgIHNvcnRieTogc29ydGJ5LFxuICAgIG91dHB1dDoge1xuICAgICAgc3RhcnQ6IHZhbE5hbWUgKyAnX3N0YXJ0JyxcbiAgICAgIGVuZDogdmFsTmFtZSArICdfZW5kJ1xuICAgIH1cbiAgfTtcblxuICBpZiAoc3RhY2suY29uZmlnLm9mZnNldCkge1xuICAgIHRyYW5zZm9ybS5vZmZzZXQgPSBzdGFjay5jb25maWcub2Zmc2V0O1xuICB9XG4gIHJldHVybiB0cmFuc2Zvcm07XG59XG4iLCJpbXBvcnQge2NvbnRhaW5zLCByYW5nZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBTSEFQRSwgQ09MT1IsIENoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuXG4vKiogcmV0dXJucyB0aGUgdGVtcGxhdGUgbmFtZSB1c2VkIGZvciBheGlzIGxhYmVscyBmb3IgYSB0aW1lIHVuaXQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXQodGltZVVuaXQsIGFiYnJldmlhdGVkID0gZmFsc2UpOiBzdHJpbmcge1xuICBpZiAoIXRpbWVVbml0KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxldCBkYXRlQ29tcG9uZW50cyA9IFtdO1xuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCd5ZWFyJykgPiAtMSkge1xuICAgIGRhdGVDb21wb25lbnRzLnB1c2goYWJicmV2aWF0ZWQgPyAnJXknIDogJyVZJyk7XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignbW9udGgnKSA+IC0xKSB7XG4gICAgZGF0ZUNvbXBvbmVudHMucHVzaChhYmJyZXZpYXRlZCA/ICclYicgOiAnJUInKTtcbiAgfVxuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdkYXknKSA+IC0xKSB7XG4gICAgZGF0ZUNvbXBvbmVudHMucHVzaChhYmJyZXZpYXRlZCA/ICclYScgOiAnJUEnKTtcbiAgfSBlbHNlIGlmICh0aW1lVW5pdC5pbmRleE9mKCdkYXRlJykgPiAtMSkge1xuICAgIGRhdGVDb21wb25lbnRzLnB1c2goJyVkJyk7XG4gIH1cblxuICBsZXQgdGltZUNvbXBvbmVudHMgPSBbXTtcblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignaG91cicpID4gLTEpIHtcbiAgICB0aW1lQ29tcG9uZW50cy5wdXNoKCclSCcpO1xuICB9XG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdtaW51dGUnKSA+IC0xKSB7XG4gICAgdGltZUNvbXBvbmVudHMucHVzaCgnJU0nKTtcbiAgfVxuICBpZiAodGltZVVuaXQuaW5kZXhPZignc2Vjb25kJykgPiAtMSkge1xuICAgIHRpbWVDb21wb25lbnRzLnB1c2goJyVTJyk7XG4gIH1cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ21pbGxpc2Vjb25kcycpID4gLTEpIHtcbiAgICB0aW1lQ29tcG9uZW50cy5wdXNoKCclTCcpO1xuICB9XG5cbiAgbGV0IG91dCA9IFtdO1xuICBpZiAoZGF0ZUNvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgIG91dC5wdXNoKGRhdGVDb21wb25lbnRzLmpvaW4oJy0nKSk7XG4gIH1cbiAgaWYgKHRpbWVDb21wb25lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBvdXQucHVzaCh0aW1lQ29tcG9uZW50cy5qb2luKCc6JykpO1xuICB9XG5cbiAgcmV0dXJuIG91dC5sZW5ndGggPiAwID8gb3V0LmpvaW4oJyAnKSA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbih0aW1lVW5pdDogc3RyaW5nLCBmaWVsZFJlZjogc3RyaW5nLCBvbmx5UmVmID0gZmFsc2UpOiBzdHJpbmcge1xuICBsZXQgb3V0ID0gJ2RhdGV0aW1lKCc7XG5cbiAgZnVuY3Rpb24gZ2V0KGZ1bjogc3RyaW5nLCBhZGRDb21tYSA9IHRydWUpIHtcbiAgICBpZiAob25seVJlZikge1xuICAgICAgcmV0dXJuIGZpZWxkUmVmICsgKGFkZENvbW1hID8gJywgJyA6ICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZ1biArICcoJyArIGZpZWxkUmVmICsgJyknICsgKGFkZENvbW1hID8gJywgJyA6ICcnKTtcbiAgICB9XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZigneWVhcicpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCd5ZWFyJyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcyMDA2LCAnOyAvLyBKYW51YXJ5IDEgMjAwNiBpcyBhIFN1bmRheVxuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ21vbnRoJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ21vbnRoJyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gbW9udGggc3RhcnRzIGF0IDAgaW4gamF2YXNjcmlwdFxuICAgIG91dCArPSAnMCwgJztcbiAgfVxuXG4gIC8vIG5lZWQgdG8gYWRkIDEgYmVjYXVzZSBkYXlzIHN0YXJ0IGF0IDFcbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ2RheScpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCdkYXknLCBmYWxzZSkgKyAnKzEsICc7XG4gIH0gZWxzZSBpZiAodGltZVVuaXQuaW5kZXhPZignZGF0ZScpID4gLTEpIHtcbiAgICBvdXQgKz0gZ2V0KCdkYXRlJyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcxLCAnO1xuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ2hvdXJzJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ2hvdXJzJyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcwLCAnO1xuICB9XG5cbiAgaWYgKHRpbWVVbml0LmluZGV4T2YoJ21pbnV0ZXMnKSA+IC0xKSB7XG4gICAgb3V0ICs9IGdldCgnbWludXRlcycpO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnMCwgJztcbiAgfVxuXG4gIGlmICh0aW1lVW5pdC5pbmRleE9mKCdzZWNvbmRzJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ3NlY29uZHMnKTtcbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJzAsICc7XG4gIH1cblxuICBpZiAodGltZVVuaXQuaW5kZXhPZignbWlsbGlzZWNvbmRzJykgPiAtMSkge1xuICAgIG91dCArPSBnZXQoJ21pbGxpc2Vjb25kcycsIGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJzAnO1xuICB9XG5cbiAgcmV0dXJuIG91dCArICcpJztcbn1cblxuLyoqIEdlbmVyYXRlIHRoZSBjb21wbGV0ZSByYXcgZG9tYWluLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhd0RvbWFpbih0aW1lVW5pdDogc3RyaW5nLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGlmIChjb250YWlucyhbUk9XLCBDT0xVTU4sIFNIQVBFLCBDT0xPUl0sIGNoYW5uZWwpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBzd2l0Y2ggKHRpbWVVbml0KSB7XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgICByZXR1cm4gcmFuZ2UoMCwgNjApO1xuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgICAgcmV0dXJuIHJhbmdlKDAsIDYwKTtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgICByZXR1cm4gcmFuZ2UoMCwgMjQpO1xuICAgIGNhc2UgJ2RheSc6XG4gICAgICByZXR1cm4gcmFuZ2UoMCwgNyk7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gcmFuZ2UoMSwgMzIpO1xuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHJldHVybiByYW5nZSgwLCAxMik7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsImltcG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBYLCBZLCBTSVpFLCBDT0xPUiwgU0hBUEUsIFRFWFQsIExBQkVMLCBDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge2Zvcm1hdCBhcyB0aW1lRm9ybWF0RXhwcn0gZnJvbSAnLi90aW1lJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uL3V0aWwnO1xuXG5leHBvcnQgZW51bSBDb2xvck1vZGUge1xuICBBTFdBWVNfRklMTEVELFxuICBBTFdBWVNfU1RST0tFRCxcbiAgRklMTEVEX0JZX0RFRkFVTFQsXG4gIFNUUk9LRURfQllfREVGQVVMVFxufVxuXG5leHBvcnQgY29uc3QgRklMTF9TVFJPS0VfQ09ORklHID0gWydmaWxsJywgJ2ZpbGxPcGFjaXR5JyxcbiAgJ3N0cm9rZScsICdzdHJva2VXaWR0aCcsICdzdHJva2VEYXNoJywgJ3N0cm9rZURhc2hPZmZzZXQnLCAnc3Ryb2tlT3BhY2l0eScsXG4gICdvcGFjaXR5J107XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUNvbG9yQW5kT3BhY2l0eShwLCBtb2RlbDogTW9kZWwsIGNvbG9yTW9kZTogQ29sb3JNb2RlID0gQ29sb3JNb2RlLlNUUk9LRURfQllfREVGQVVMVCkge1xuICBjb25zdCBmaWxsZWQgPSBjb2xvck1vZGUgPT09IENvbG9yTW9kZS5BTFdBWVNfRklMTEVEID8gdHJ1ZSA6XG4gICAgY29sb3JNb2RlID09PSBDb2xvck1vZGUuQUxXQVlTX1NUUk9LRUQgPyBmYWxzZSA6XG4gICAgICBtb2RlbC5jb25maWcoKS5tYXJrLmZpbGxlZCAhPT0gdW5kZWZpbmVkID8gbW9kZWwuY29uZmlnKCkubWFyay5maWxsZWQgOlxuICAgICAgICBjb2xvck1vZGUgPT09IENvbG9yTW9kZS5GSUxMRURfQllfREVGQVVMVCA/IHRydWUgOlxuICAgICAgICAgIGZhbHNlOyAvLyBDb2xvck1vZGUuU1RST0tFRF9CWV9ERUZBVUxUXG5cbiAgLy8gQXBwbHkgZmlsbCBhbmQgc3Ryb2tlIGNvbmZpZyBmaXJzdFxuICAvLyBzbyB0aGF0IGBjb2xvci52YWx1ZWAgY2FuIG92ZXJyaWRlIGBmaWxsYCBhbmQgYHN0cm9rZWAgY29uZmlnXG4gIGFwcGx5TWFya0NvbmZpZyhwLCBtb2RlbCwgRklMTF9TVFJPS0VfQ09ORklHKTtcblxuICBpZiAoZmlsbGVkKSB7XG4gICAgaWYgKG1vZGVsLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuZmlsbCA9IHtcbiAgICAgICAgc2NhbGU6IG1vZGVsLnNjYWxlTmFtZShDT0xPUiksXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChDT0xPUilcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuZmlsbCA9IHsgdmFsdWU6IG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZSB9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAobW9kZWwuaGFzKENPTE9SKSkge1xuICAgICAgcC5zdHJva2UgPSB7XG4gICAgICAgIHNjYWxlOiBtb2RlbC5zY2FsZU5hbWUoQ09MT1IpLFxuICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoQ09MT1IpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnN0cm9rZSA9IHsgdmFsdWU6IG1vZGVsLmZpZWxkRGVmKENPTE9SKS52YWx1ZSB9O1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlNYXJrQ29uZmlnKG1hcmtzUHJvcGVydGllcywgbW9kZWw6IE1vZGVsLCBwcm9wc0xpc3Q6IHN0cmluZ1tdKSB7XG4gIHByb3BzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgY29uc3QgdmFsdWUgPSBtb2RlbC5jb25maWcoKS5tYXJrW3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbWFya3NQcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IHsgdmFsdWU6IHZhbHVlIH07XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiAqIEJ1aWxkcyBhbiBvYmplY3Qgd2l0aCBmb3JtYXQgYW5kIGZvcm1hdFR5cGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0gZm9ybWF0IGV4cGxpY2l0bHkgc3BlY2lmaWVkIGZvcm1hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TWl4aW5zKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogQ2hhbm5lbCwgZm9ybWF0OiBzdHJpbmcpIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICBpZighY29udGFpbnMoW1FVQU5USVRBVElWRSwgVEVNUE9SQUxdLCBmaWVsZERlZi50eXBlKSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGxldCBkZWY6IGFueSA9IHt9O1xuXG4gIGlmIChmaWVsZERlZi50eXBlID09PSBURU1QT1JBTCkge1xuICAgIGRlZi5mb3JtYXRUeXBlID0gJ3RpbWUnO1xuICB9XG5cbiAgaWYgKGZvcm1hdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZGVmLmZvcm1hdCA9IGZvcm1hdDtcbiAgfSBlbHNlIHtcbiAgICBzd2l0Y2ggKGZpZWxkRGVmLnR5cGUpIHtcbiAgICAgIGNhc2UgUVVBTlRJVEFUSVZFOlxuICAgICAgICBkZWYuZm9ybWF0ID0gbW9kZWwuY29uZmlnKCkubnVtYmVyRm9ybWF0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVEVNUE9SQUw6XG4gICAgICAgIGRlZi5mb3JtYXQgPSB0aW1lRm9ybWF0KG1vZGVsLCBjaGFubmVsKSB8fCBtb2RlbC5jb25maWcoKS50aW1lRm9ybWF0O1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoY2hhbm5lbCA9PT0gVEVYVCkge1xuICAgIC8vIHRleHQgZG9lcyBub3Qgc3VwcG9ydCBmb3JtYXQgYW5kIGZvcm1hdFR5cGVcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhL2lzc3Vlcy81MDVcblxuICAgIGNvbnN0IGZpbHRlciA9IChkZWYuZm9ybWF0VHlwZSB8fCAnbnVtYmVyJykgKyAoZGVmLmZvcm1hdCA/ICc6XFwnJyArIGRlZi5mb3JtYXQgKyAnXFwnJyA6ICcnKTtcbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDoge1xuICAgICAgICB0ZW1wbGF0ZTogJ3t7JyArIG1vZGVsLmZpZWxkKGNoYW5uZWwsIHsgZGF0dW06IHRydWUgfSkgKyAnIHwgJyArIGZpbHRlciArICd9fSdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGRlZjtcbn1cblxuZnVuY3Rpb24gaXNBYmJyZXZpYXRlZChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZikge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTFVNTjpcbiAgICBjYXNlIFg6XG4gICAgY2FzZSBZOlxuICAgICAgY29uc3QgYXhpcyA9IGZpZWxkRGVmLmF4aXM7XG4gICAgICByZXR1cm4gKHR5cGVvZiBheGlzICE9PSAnYm9vbGVhbicgPyBheGlzLnNob3J0VGltZUxhYmVscyA6IGZhbHNlKTtcbiAgICBjYXNlIENPTE9SOlxuICAgIGNhc2UgU0hBUEU6XG4gICAgY2FzZSBTSVpFOlxuICAgICAgY29uc3QgbGVnZW5kID0gZmllbGREZWYubGVnZW5kO1xuICAgICAgcmV0dXJuICh0eXBlb2YgbGVnZW5kICE9PSAnYm9vbGVhbicgPyBsZWdlbmQuc2hvcnRUaW1lTGFiZWxzIDogZmFsc2UpO1xuICAgIGNhc2UgVEVYVDpcbiAgICAgIHJldHVybiBtb2RlbC5jb25maWcoKS5tYXJrLnNob3J0VGltZUxhYmVscztcbiAgICBjYXNlIExBQkVMOlxuICAgICAgLy8gVE9ETygjODk3KTogaW1wbGVtZW50IHdoZW4gd2UgaGF2ZSBsYWJlbFxuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdGltZSBmb3JtYXQgdXNlZCBmb3IgYXhpcyBsYWJlbHMgZm9yIGEgdGltZSB1bml0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZUZvcm1hdChtb2RlbDogTW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpOiBzdHJpbmcge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICByZXR1cm4gdGltZUZvcm1hdEV4cHIoZmllbGREZWYudGltZVVuaXQsIGlzQWJicmV2aWF0ZWQobW9kZWwsIGNoYW5uZWwsIGZpZWxkRGVmKSk7XG59XG4iLCIvKlxuICogQ29uc3RhbnRzIGFuZCB1dGlsaXRpZXMgZm9yIGRhdGEuXG4gKi9cblxuaW1wb3J0IHtOT01JTkFMLCBRVUFOVElUQVRJVkUsIFRFTVBPUkFMfSBmcm9tICcuL3R5cGUnO1xuXG5leHBvcnQgY29uc3QgU1VNTUFSWSA9ICdzdW1tYXJ5JztcbmV4cG9ydCBjb25zdCBTT1VSQ0UgPSAnc291cmNlJztcbmV4cG9ydCBjb25zdCBTVEFDS0VEX1NDQUxFID0gJ3N0YWNrZWRfc2NhbGUnO1xuZXhwb3J0IGNvbnN0IExBWU9VVCA9ICdsYXlvdXQnO1xuXG4vKiogTWFwcGluZyBmcm9tIGRhdGFsaWIncyBpbmZlcnJlZCB0eXBlIHRvIFZlZ2EtbGl0ZSdzIHR5cGUgKi9cbi8vIFRPRE86IEFMTF9DQVBTXG5leHBvcnQgY29uc3QgdHlwZXMgPSB7XG4gICdib29sZWFuJzogTk9NSU5BTCxcbiAgJ251bWJlcic6IFFVQU5USVRBVElWRSxcbiAgJ2ludGVnZXInOiBRVUFOVElUQVRJVkUsXG4gICdkYXRlJzogVEVNUE9SQUwsXG4gICdzdHJpbmcnOiBOT01JTkFMXG59O1xuIiwiLy8gdXRpbGl0eSBmb3IgZW5jb2RpbmcgbWFwcGluZ1xuaW1wb3J0IHtFbmNvZGluZ30gZnJvbSAnLi9zY2hlbWEvZW5jb2Rpbmcuc2NoZW1hJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge0NoYW5uZWwsIENIQU5ORUxTfSBmcm9tICcuL2NoYW5uZWwnO1xuaW1wb3J0IHtpc0FycmF5fSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY291bnRSZXRpbmFsKGVuY29kaW5nOiBFbmNvZGluZykge1xuICB2YXIgY291bnQgPSAwO1xuICBpZiAoZW5jb2RpbmcuY29sb3IpIHsgY291bnQrKzsgfVxuICBpZiAoZW5jb2Rpbmcuc2l6ZSkgeyBjb3VudCsrOyB9XG4gIGlmIChlbmNvZGluZy5zaGFwZSkgeyBjb3VudCsrOyB9XG4gIHJldHVybiBjb3VudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5uZWxzKGVuY29kaW5nOiBFbmNvZGluZykge1xuICByZXR1cm4gQ0hBTk5FTFMuZmlsdGVyKGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICByZXR1cm4gaGFzKGVuY29kaW5nLCBjaGFubmVsKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXMoZW5jb2Rpbmc6IEVuY29kaW5nLCBjaGFubmVsOiBDaGFubmVsKTogYm9vbGVhbiB7XG4gIGNvbnN0IGNoYW5uZWxFbmNvZGluZyA9IGVuY29kaW5nICYmIGVuY29kaW5nW2NoYW5uZWxdO1xuICByZXR1cm4gY2hhbm5lbEVuY29kaW5nICYmIChcbiAgICBjaGFubmVsRW5jb2RpbmcuZmllbGQgIT09IHVuZGVmaW5lZCB8fFxuICAgIChpc0FycmF5KGNoYW5uZWxFbmNvZGluZykgJiYgY2hhbm5lbEVuY29kaW5nLmxlbmd0aCA+IDApXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FnZ3JlZ2F0ZShlbmNvZGluZzogRW5jb2RpbmcpIHtcbiAgZm9yICh2YXIgayBpbiBlbmNvZGluZykge1xuICAgIGlmIChoYXMoZW5jb2RpbmcsIGspICYmIGVuY29kaW5nW2tdLmFnZ3JlZ2F0ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkRGVmcyhlbmNvZGluZzogRW5jb2RpbmcpOiBGaWVsZERlZltdIHtcbiAgdmFyIGFyciA9IFtdO1xuICBDSEFOTkVMUy5mb3JFYWNoKGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICBpZiAoaGFzKGVuY29kaW5nLCBjaGFubmVsKSkge1xuICAgICAgaWYgKGlzQXJyYXkoZW5jb2RpbmdbY2hhbm5lbF0pKSB7XG4gICAgICAgIGVuY29kaW5nW2NoYW5uZWxdLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWYpIHtcbiAgICAgICAgICBhcnIucHVzaChmaWVsZERlZik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyLnB1c2goZW5jb2RpbmdbY2hhbm5lbF0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcnI7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZm9yRWFjaChlbmNvZGluZzogRW5jb2RpbmcsXG4gICAgZjogKGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgaTogbnVtYmVyKSA9PiB2b2lkLFxuICAgIHRoaXNBcmc/OiBhbnkpIHtcbiAgdmFyIGkgPSAwO1xuICBDSEFOTkVMUy5mb3JFYWNoKGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICBpZiAoaGFzKGVuY29kaW5nLCBjaGFubmVsKSkge1xuICAgICAgaWYgKGlzQXJyYXkoZW5jb2RpbmdbY2hhbm5lbF0pKSB7XG4gICAgICAgIGVuY29kaW5nW2NoYW5uZWxdLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWYpIHtcbiAgICAgICAgICAgIGYuY2FsbCh0aGlzQXJnLCBmaWVsZERlZiwgY2hhbm5lbCwgaSsrKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmLmNhbGwodGhpc0FyZywgZW5jb2RpbmdbY2hhbm5lbF0sIGNoYW5uZWwsIGkrKyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcChlbmNvZGluZzogRW5jb2RpbmcsXG4gICAgZjogKGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgZTogRW5jb2RpbmcpID0+IGFueSxcbiAgICB0aGlzQXJnPzogYW55KSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgQ0hBTk5FTFMuZm9yRWFjaChmdW5jdGlvbihjaGFubmVsKSB7XG4gICAgaWYgKGhhcyhlbmNvZGluZywgY2hhbm5lbCkpIHtcbiAgICAgIGlmIChpc0FycmF5KGVuY29kaW5nW2NoYW5uZWxdKSkge1xuICAgICAgICBlbmNvZGluZ1tjaGFubmVsXS5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkRGVmKSB7XG4gICAgICAgICAgYXJyLnB1c2goZi5jYWxsKHRoaXNBcmcsIGZpZWxkRGVmLCBjaGFubmVsLCBlbmNvZGluZykpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyci5wdXNoKGYuY2FsbCh0aGlzQXJnLCBlbmNvZGluZ1tjaGFubmVsXSwgY2hhbm5lbCwgZW5jb2RpbmcpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlKGVuY29kaW5nOiBFbmNvZGluZyxcbiAgICBmOiAoYWNjOiBhbnksIGZkOiBGaWVsZERlZiwgYzogQ2hhbm5lbCwgZTogRW5jb2RpbmcpID0+IGFueSxcbiAgICBpbml0LFxuICAgIHRoaXNBcmc/OiBhbnkpIHtcbiAgdmFyIHIgPSBpbml0O1xuICBDSEFOTkVMUy5mb3JFYWNoKGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICBpZiAoaGFzKGVuY29kaW5nLCBjaGFubmVsKSkge1xuICAgICAgaWYgKGlzQXJyYXkoZW5jb2RpbmdbY2hhbm5lbF0pKSB7XG4gICAgICAgIGVuY29kaW5nW2NoYW5uZWxdLmZvckVhY2goZnVuY3Rpb24oZmllbGREZWYpIHtcbiAgICAgICAgICAgIHIgPSBmLmNhbGwodGhpc0FyZywgciwgZmllbGREZWYsIGNoYW5uZWwsIGVuY29kaW5nKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByID0gZi5jYWxsKHRoaXNBcmcsIHIsIGVuY29kaW5nW2NoYW5uZWxdLCBjaGFubmVsLCBlbmNvZGluZyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHI7XG59XG4iLCIvLyB1dGlsaXR5IGZvciBhIGZpZWxkIGRlZmluaXRpb24gb2JqZWN0XG5cbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge2NvbnRhaW5zLCBnZXRiaW5zfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtOT01JTkFMLCBPUkRJTkFMLCBRVUFOVElUQVRJVkUsIFRFTVBPUkFMfSBmcm9tICcuL3R5cGUnO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgRmllbGRSZWZPcHRpb24ge1xuICAvKiogZXhjbHVkZSBiaW4sIGFnZ3JlZ2F0ZSwgdGltZVVuaXQgKi9cbiAgbm9mbj86IGJvb2xlYW47XG4gIC8qKiBleGNsdWRlIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9uICovXG4gIG5vQWdncmVnYXRlPzogYm9vbGVhbjtcbiAgLyoqIGluY2x1ZGUgJ2RhdHVtLicgKi9cbiAgZGF0dW0/OiBib29sZWFuO1xuICAvKiogcmVwbGFjZSBmbiB3aXRoIGN1c3RvbSBmdW5jdGlvbiBwcmVmaXggKi9cbiAgZm4/OiBzdHJpbmc7XG4gIC8qKiBwcmVwZW5kIGZuIHdpdGggY3VzdG9tIGZ1bmN0aW9uIHByZWZpeCAqL1xuICBwcmVmbj86IHN0cmluZztcbiAgLyoqIGFwcGVuZCBzdWZmaXggdG8gdGhlIGZpZWxkIHJlZiBmb3IgYmluIChkZWZhdWx0PSdfc3RhcnQnKSAqL1xuICBiaW5TdWZmaXg/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWVsZChmaWVsZERlZjogRmllbGREZWYsIG9wdDogRmllbGRSZWZPcHRpb24gPSB7fSkge1xuICB2YXIgZiA9IChvcHQuZGF0dW0gPyAnZGF0dW0uJyA6ICcnKSArIChvcHQucHJlZm4gfHwgJycpLFxuICAgIGZpZWxkID0gZmllbGREZWYuZmllbGQ7XG5cbiAgaWYgKGlzQ291bnQoZmllbGREZWYpKSB7XG4gICAgcmV0dXJuIGYgKyAnY291bnQnO1xuICB9IGVsc2UgaWYgKG9wdC5mbikge1xuICAgIHJldHVybiBmICsgb3B0LmZuICsgJ18nICsgZmllbGQ7XG4gIH0gZWxzZSBpZiAoIW9wdC5ub2ZuICYmIGZpZWxkRGVmLmJpbikge1xuICAgIHJldHVybiBmICsgJ2Jpbl8nICsgZmllbGQgKyBvcHQuYmluU3VmZml4IHx8ICdfc3RhcnQnO1xuICB9IGVsc2UgaWYgKCFvcHQubm9mbiAmJiAhb3B0Lm5vQWdncmVnYXRlICYmIGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgIHJldHVybiBmICsgZmllbGREZWYuYWdncmVnYXRlICsgJ18nICsgZmllbGQ7XG4gIH0gZWxzZSBpZiAoIW9wdC5ub2ZuICYmIGZpZWxkRGVmLnRpbWVVbml0KSB7XG4gICAgcmV0dXJuIGYgKyBmaWVsZERlZi50aW1lVW5pdCArICdfJyArIGZpZWxkO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmICsgZmllbGQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2lzRmllbGREaW1lbnNpb24oZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIHJldHVybiBjb250YWlucyhbTk9NSU5BTCwgT1JESU5BTF0sIGZpZWxkRGVmLnR5cGUpIHx8ICEhZmllbGREZWYuYmluIHx8XG4gICAgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMICYmICEhZmllbGREZWYudGltZVVuaXQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEaW1lbnNpb24oZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIHJldHVybiBmaWVsZERlZiAmJiBmaWVsZERlZi5maWVsZCAmJiBfaXNGaWVsZERpbWVuc2lvbihmaWVsZERlZik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc01lYXN1cmUoZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIHJldHVybiBmaWVsZERlZiAmJiBmaWVsZERlZi5maWVsZCAmJiAhX2lzRmllbGREaW1lbnNpb24oZmllbGREZWYpO1xufVxuXG5leHBvcnQgY29uc3QgQ09VTlRfRElTUExBWU5BTUUgPSAnTnVtYmVyIG9mIFJlY29yZHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY291bnQoKTogRmllbGREZWYge1xuICByZXR1cm4geyBmaWVsZDogJyonLCBhZ2dyZWdhdGU6ICdjb3VudCcsIHR5cGU6IFFVQU5USVRBVElWRSwgZGlzcGxheU5hbWU6IENPVU5UX0RJU1BMQVlOQU1FIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvdW50KGZpZWxkRGVmOiBGaWVsZERlZikge1xuICByZXR1cm4gZmllbGREZWYuYWdncmVnYXRlID09PSAnY291bnQnO1xufVxuXG4vLyBGSVhNRSByZW1vdmUgdGhpcywgYW5kIHRoZSBnZXRiaW5zIG1ldGhvZFxuLy8gRklYTUUgdGhpcyBkZXBlbmRzIG9uIGNoYW5uZWxcbmV4cG9ydCBmdW5jdGlvbiBjYXJkaW5hbGl0eShmaWVsZERlZjogRmllbGREZWYsIHN0YXRzLCBmaWx0ZXJOdWxsID0ge30pIHtcbiAgLy8gRklYTUUgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcblxuICB2YXIgc3RhdCA9IHN0YXRzW2ZpZWxkRGVmLmZpZWxkXTtcbiAgdmFyIHR5cGUgPSBmaWVsZERlZi50eXBlO1xuXG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAvLyBuZWVkIHRvIHJlYXNzaWduIGJpbiwgb3RoZXJ3aXNlIGNvbXBpbGF0aW9uIHdpbGwgZmFpbCBkdWUgdG8gYSBUUyBidWcuXG4gICAgY29uc3QgYmluID0gZmllbGREZWYuYmluO1xuICAgIGxldCBtYXhiaW5zID0gKHR5cGVvZiBiaW4gPT09ICdib29sZWFuJykgPyB1bmRlZmluZWQgOiBiaW4ubWF4YmlucztcbiAgICBpZiAobWF4YmlucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtYXhiaW5zID0gMTA7XG4gICAgfVxuXG4gICAgdmFyIGJpbnMgPSBnZXRiaW5zKHN0YXQsIG1heGJpbnMpO1xuICAgIHJldHVybiAoYmlucy5zdG9wIC0gYmlucy5zdGFydCkgLyBiaW5zLnN0ZXA7XG4gIH1cbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFRFTVBPUkFMKSB7XG4gICAgdmFyIHRpbWVVbml0ID0gZmllbGREZWYudGltZVVuaXQ7XG4gICAgc3dpdGNoICh0aW1lVW5pdCkge1xuICAgICAgY2FzZSAnc2Vjb25kcyc6IHJldHVybiA2MDtcbiAgICAgIGNhc2UgJ21pbnV0ZXMnOiByZXR1cm4gNjA7XG4gICAgICBjYXNlICdob3Vycyc6IHJldHVybiAyNDtcbiAgICAgIGNhc2UgJ2RheSc6IHJldHVybiA3O1xuICAgICAgY2FzZSAnZGF0ZSc6IHJldHVybiAzMTtcbiAgICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIDEyO1xuICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgIHZhciB5ZWFyc3RhdCA9IHN0YXRzWyd5ZWFyXycgKyBmaWVsZERlZi5maWVsZF07XG5cbiAgICAgICAgaWYgKCF5ZWFyc3RhdCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICAgIHJldHVybiB5ZWFyc3RhdC5kaXN0aW5jdCAtXG4gICAgICAgICAgKHN0YXQubWlzc2luZyA+IDAgJiYgZmlsdGVyTnVsbFt0eXBlXSA/IDEgOiAwKTtcbiAgICB9XG4gICAgLy8gb3RoZXJ3aXNlIHVzZSBjYWxjdWxhdGlvbiBiZWxvd1xuICB9XG4gIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIC8vIHJlbW92ZSBudWxsXG4gIHJldHVybiBzdGF0LmRpc3RpbmN0IC1cbiAgICAoc3RhdC5taXNzaW5nID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUoZmllbGREZWY6IEZpZWxkRGVmKSB7XG4gIGlmIChpc0NvdW50KGZpZWxkRGVmKSkge1xuICAgIHJldHVybiBDT1VOVF9ESVNQTEFZTkFNRTtcbiAgfVxuICB2YXIgZm4gPSBmaWVsZERlZi5hZ2dyZWdhdGUgfHwgZmllbGREZWYudGltZVVuaXQgfHwgKGZpZWxkRGVmLmJpbiAmJiAnYmluJyk7XG4gIGlmIChmbikge1xuICAgIHJldHVybiBmbi50b1VwcGVyQ2FzZSgpICsgJygnICsgZmllbGREZWYuZmllbGQgKyAnKSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZpZWxkRGVmLmZpZWxkO1xuICB9XG59XG4iLCJleHBvcnQgZW51bSBNYXJrIHtcbiAgQVJFQSA9ICdhcmVhJyBhcyBhbnksXG4gIEJBUiA9ICdiYXInIGFzIGFueSxcbiAgTElORSA9ICdsaW5lJyBhcyBhbnksXG4gIFBPSU5UID0gJ3BvaW50JyBhcyBhbnksXG4gIFRFWFQgPSAndGV4dCcgYXMgYW55LFxuICBUSUNLID0gJ3RpY2snIGFzIGFueSxcbiAgQ0lSQ0xFID0gJ2NpcmNsZScgYXMgYW55LFxuICBTUVVBUkUgPSAnc3F1YXJlJyBhcyBhbnlcbn1cblxuZXhwb3J0IGNvbnN0IEFSRUEgPSBNYXJrLkFSRUE7XG5leHBvcnQgY29uc3QgQkFSID0gTWFyay5CQVI7XG5leHBvcnQgY29uc3QgTElORSA9IE1hcmsuTElORTtcbmV4cG9ydCBjb25zdCBQT0lOVCA9IE1hcmsuUE9JTlQ7XG5leHBvcnQgY29uc3QgVEVYVCA9IE1hcmsuVEVYVDtcbmV4cG9ydCBjb25zdCBUSUNLID0gTWFyay5USUNLO1xuXG5leHBvcnQgY29uc3QgQ0lSQ0xFID0gTWFyay5DSVJDTEU7XG5leHBvcnQgY29uc3QgU1FVQVJFID0gTWFyay5TUVVBUkU7XG4iLCJleHBvcnQgaW50ZXJmYWNlIEF4aXMge1xuICAvLyBWZWdhIEF4aXMgUHJvcGVydGllc1xuICBmb3JtYXQ/OiBzdHJpbmc7XG4gIGdyaWQ/OiBib29sZWFuO1xuICBsYXllcj86IHN0cmluZztcbiAgb2Zmc2V0PzogbnVtYmVyO1xuICBvcmllbnQ/OiBzdHJpbmc7XG4gIHN1YmRpdmlkZT86IG51bWJlcjtcbiAgdGlja3M/OiBudW1iZXI7XG4gIHRpY2tQYWRkaW5nPzogbnVtYmVyO1xuICB0aWNrU2l6ZT86IG51bWJlcjtcbiAgdGlja1NpemVNYWpvcj86IG51bWJlcjtcbiAgdGlja1NpemVNaW5vcj86IG51bWJlcjtcbiAgdGlja1NpemVFbmQ/OiBudW1iZXI7XG4gIHRpdGxlPzogc3RyaW5nO1xuICB0aXRsZU9mZnNldD86IG51bWJlcjtcbiAgdmFsdWVzPzogbnVtYmVyW107XG4gIHByb3BlcnRpZXM/OiBhbnk7IC8vIFRPRE86IGRlY2xhcmUgVmdBeGlzUHJvcGVydGllc1xuICAvLyBWZWdhLUxpdGUgb25seVxuICBjaGFyYWN0ZXJXaWR0aD86IG51bWJlcjtcbiAgbGFiZWxNYXhMZW5ndGg/OiBudW1iZXI7XG4gIGxhYmVscz86IGJvb2xlYW47XG4gIHNob3J0VGltZUxhYmVscz86IGJvb2xlYW47XG4gIHRpdGxlTWF4TGVuZ3RoPzogbnVtYmVyO1xufVxuXG5leHBvcnQgdmFyIGF4aXMgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLyogVmVnYSBBeGlzIFByb3BlcnRpZXMgKi9cbiAgICBmb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9ybWF0dGluZyBwYXR0ZXJuIGZvciBheGlzIGxhYmVscy4gSWYgdW5kZWZpbmVkLCBhIGdvb2QgZm9ybWF0IGlzIGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lZC4gVmVnYS1MaXRlIHVzZXMgRDNcXCdzIGZvcm1hdCBwYXR0ZXJuIGFuZCBhdXRvbWF0aWNhbGx5IHN3aXRjaGVzIHRvIGRhdGV0aW1lIGZvcm1hdHRlcnMuJ1xuICAgIH0sXG4gICAgZ3JpZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdBIGZsYWcgaW5kaWNhdGUgaWYgZ3JpZGxpbmVzIHNob3VsZCBiZSBjcmVhdGVkIGluIGFkZGl0aW9uIHRvIHRpY2tzLiBJZiBgZ3JpZGAgaXMgdW5zcGVjaWZpZWQsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGB0cnVlYCBmb3IgUk9XIGFuZCBDT0wuIEZvciBYIGFuZCBZLCB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAgZm9yIHF1YW50aXRhdGl2ZSBhbmQgdGltZSBmaWVsZHMgYW5kIGBmYWxzZWAgb3RoZXJ3aXNlLidcbiAgICB9LFxuICAgIGxheWVyOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBzdHJpbmcgaW5kaWNhdGluZyBpZiB0aGUgYXhpcyAoYW5kIGFueSBncmlkbGluZXMpIHNob3VsZCBiZSBwbGFjZWQgYWJvdmUgb3IgYmVsb3cgdGhlIGRhdGEgbWFya3MuJ1xuICAgIH0sXG4gICAgb2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9mZnNldCwgaW4gcGl4ZWxzLCBieSB3aGljaCB0byBkaXNwbGFjZSB0aGUgYXhpcyBmcm9tIHRoZSBlZGdlIG9mIHRoZSBlbmNsb3NpbmcgZ3JvdXAgb3IgZGF0YSByZWN0YW5nbGUuJ1xuICAgIH0sXG4gICAgb3JpZW50OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGVudW06IFsndG9wJywgJ3JpZ2h0JywgJ2xlZnQnLCAnYm90dG9tJ10sXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXhpcy4gT25lIG9mIHRvcCwgYm90dG9tLCBsZWZ0IG9yIHJpZ2h0LiBUaGUgb3JpZW50YXRpb24gY2FuIGJlIHVzZWQgdG8gZnVydGhlciBzcGVjaWFsaXplIHRoZSBheGlzIHR5cGUgKGUuZy4sIGEgeSBheGlzIG9yaWVudGVkIGZvciB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgY2hhcnQpLidcbiAgICB9LFxuICAgIHN1YmRpdmlkZToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHByb3ZpZGVkLCBzZXRzIHRoZSBudW1iZXIgb2YgbWlub3IgdGlja3MgYmV0d2VlbiBtYWpvciB0aWNrcyAodGhlIHZhbHVlIDkgcmVzdWx0cyBpbiBkZWNpbWFsIHN1YmRpdmlzaW9uKS4gT25seSBhcHBsaWNhYmxlIGZvciBheGVzIHZpc3VhbGl6aW5nIHF1YW50aXRhdGl2ZSBzY2FsZXMuJ1xuICAgIH0sXG4gICAgdGlja3M6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgZGVzaXJlZCBudW1iZXIgb2YgdGlja3MsIGZvciBheGVzIHZpc3VhbGl6aW5nIHF1YW50aXRhdGl2ZSBzY2FsZXMuIFRoZSByZXN1bHRpbmcgbnVtYmVyIG1heSBiZSBkaWZmZXJlbnQgc28gdGhhdCB2YWx1ZXMgYXJlIFwibmljZVwiIChtdWx0aXBsZXMgb2YgMiwgNSwgMTApIGFuZCBsaWUgd2l0aGluIHRoZSB1bmRlcmx5aW5nIHNjYWxlXFwncyByYW5nZS4nXG4gICAgfSxcbiAgICB0aWNrUGFkZGluZzoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgcGFkZGluZywgaW4gcGl4ZWxzLCBiZXR3ZWVuIHRpY2tzIGFuZCB0ZXh0IGxhYmVscy4nXG4gICAgfSxcbiAgICB0aWNrU2l6ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHNpemUsIGluIHBpeGVscywgb2YgbWFqb3IsIG1pbm9yIGFuZCBlbmQgdGlja3MuJ1xuICAgIH0sXG4gICAgdGlja1NpemVNYWpvcjoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHNpemUsIGluIHBpeGVscywgb2YgbWFqb3IgdGlja3MuJ1xuICAgIH0sXG4gICAgdGlja1NpemVNaW5vcjoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHNpemUsIGluIHBpeGVscywgb2YgbWlub3IgdGlja3MuJ1xuICAgIH0sXG4gICAgdGlja1NpemVFbmQ6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBzaXplLCBpbiBwaXhlbHMsIG9mIGVuZCB0aWNrcy4nXG4gICAgfSxcbiAgICB0aXRsZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgZm9yIHRoZSBheGlzLiAoU2hvd3MgZmllbGQgbmFtZSBhbmQgaXRzIGZ1bmN0aW9uIGJ5IGRlZmF1bHQuKSdcbiAgICB9LFxuICAgIHRpdGxlT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgb2Zmc2V0IHZhbHVlIGZvciB0aGUgYXhpcy4nXG4gICAgfSxcbiAgICB2YWx1ZXM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgZGVzY3JpcHRpb246ICdPcHRpb25hbCBtYXJrIHByb3BlcnR5IGRlZmluaXRpb25zIGZvciBjdXN0b20gYXhpcyBzdHlsaW5nLidcbiAgICB9LFxuICAgIC8qIFZlZ2EtbGl0ZSBvbmx5ICovXG4gICAgY2hhcmFjdGVyV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDYsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NoYXJhY3RlciB3aWR0aCBmb3IgYXV0b21hdGljYWxseSBkZXRlcm1pbmluZyB0aXRsZSBtYXggbGVuZ3RoLidcbiAgICB9LFxuICAgIGxhYmVsTWF4TGVuZ3RoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyNSxcbiAgICAgIG1pbmltdW06IDEsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RydW5jYXRlIGxhYmVscyB0aGF0IGFyZSB0b28gbG9uZy4nXG4gICAgfSxcbiAgICBsYWJlbHM6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuYWJsZSBvciBkaXNhYmxlIGxhYmVscy4nXG4gICAgfSxcbiAgICBzaG9ydFRpbWVMYWJlbHM6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIG1vbnRoIGFuZCBkYXkgbmFtZXMgc2hvdWxkIGJlIGFiYnJldmlhdGVkLidcbiAgICB9LFxuICAgIHRpdGxlTWF4TGVuZ3RoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdNYXggbGVuZ3RoIGZvciBheGlzIHRpdGxlIGlmIHRoZSB0aXRsZSBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBmcm9tIHRoZSBmaWVsZFxcJ3MgZGVzY3JpcHRpb24uJyArXG4gICAgICAnQnkgZGVmYXVsdCwgdGhpcyBpcyBhdXRvbWF0aWNhbGx5IGJhc2VkIG9uIGNlbGwgc2l6ZSBhbmQgY2hhcmFjdGVyV2lkdGggcHJvcGVydHkuJ1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7UVVBTlRJVEFUSVZFfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7dG9NYXB9IGZyb20gJy4uL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJpbiB7XG4gIG1pbj86IG51bWJlcjtcbiAgbWF4PzogbnVtYmVyO1xuICBiYXNlPzogbnVtYmVyO1xuICBzdGVwPzogbnVtYmVyO1xuICBzdGVwcz86IG51bWJlcltdO1xuICBtaW5zdGVwPzogbnVtYmVyO1xuICBkaXY/OiBudW1iZXJbXTtcbiAgbWF4Ymlucz86IG51bWJlcjtcbn1cblxuZXhwb3J0IHZhciBiaW4gPSB7XG4gIHR5cGU6IFsnYm9vbGVhbicsICdvYmplY3QnXSxcbiAgZGVmYXVsdDogZmFsc2UsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBtaW46IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgbWluaW11bSBiaW4gdmFsdWUgdG8gY29uc2lkZXIuIElmIHVuc3BlY2lmaWVkLCB0aGUgbWluaW11bSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIGZpZWxkIGlzIHVzZWQuJ1xuICAgIH0sXG4gICAgbWF4OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG1heGltdW0gYmluIHZhbHVlIHRvIGNvbnNpZGVyLiBJZiB1bnNwZWNpZmllZCwgdGhlIG1heGltdW0gdmFsdWUgb2YgdGhlIHNwZWNpZmllZCBmaWVsZCBpcyB1c2VkLidcbiAgICB9LFxuICAgIGJhc2U6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgbnVtYmVyIGJhc2UgdG8gdXNlIGZvciBhdXRvbWF0aWMgYmluIGRldGVybWluYXRpb24gKGRlZmF1bHQgaXMgYmFzZSAxMCkuJ1xuICAgIH0sXG4gICAgc3RlcDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FuIGV4YWN0IHN0ZXAgc2l6ZSB0byB1c2UgYmV0d2VlbiBiaW5zLiBJZiBwcm92aWRlZCwgb3B0aW9ucyBzdWNoIGFzIG1heGJpbnMgd2lsbCBiZSBpZ25vcmVkLidcbiAgICB9LFxuICAgIHN0ZXBzOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdBbiBhcnJheSBvZiBhbGxvd2FibGUgc3RlcCBzaXplcyB0byBjaG9vc2UgZnJvbS4nXG4gICAgfSxcbiAgICBtaW5zdGVwOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBtaW5pbXVtIGFsbG93YWJsZSBzdGVwIHNpemUgKHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIGludGVnZXIgdmFsdWVzKS4nXG4gICAgfSxcbiAgICBkaXY6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NjYWxlIGZhY3RvcnMgaW5kaWNhdGluZyBhbGxvd2FibGUgc3ViZGl2aXNpb25zLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBbNSwgMl0sIHdoaWNoIGluZGljYXRlcyB0aGF0IGZvciBiYXNlIDEwIG51bWJlcnMgKHRoZSBkZWZhdWx0IGJhc2UpLCB0aGUgbWV0aG9kIG1heSBjb25zaWRlciBkaXZpZGluZyBiaW4gc2l6ZXMgYnkgNSBhbmQvb3IgMi4gRm9yIGV4YW1wbGUsIGZvciBhbiBpbml0aWFsIHN0ZXAgc2l6ZSBvZiAxMCwgdGhlIG1ldGhvZCBjYW4gY2hlY2sgaWYgYmluIHNpemVzIG9mIDIgKD0gMTAvNSksIDUgKD0gMTAvMiksIG9yIDEgKD0gMTAvKDUqMikpIG1pZ2h0IGFsc28gc2F0aXNmeSB0aGUgZ2l2ZW4gY29uc3RyYWludHMuJ1xuICAgIH0sXG4gICAgbWF4Ymluczoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgbWluaW11bTogMixcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWF4aW11bSBudW1iZXIgb2YgYmlucy4nXG4gICAgfVxuICB9LFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRV0pIC8vIFRPRE86IGFkZCBPIGFmdGVyIGZpbmlzaGluZyAjODFcbn07XG4iLCJleHBvcnQgaW50ZXJmYWNlIENlbGxDb25maWcge1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuXG4gIGdyaWRDb2xvcj86IHN0cmluZztcbiAgZ3JpZE9wYWNpdHk/OiBudW1iZXI7XG4gIGdyaWRPZmZzZXQ/OiBudW1iZXI7XG5cbiAgZmlsbD86IHN0cmluZztcbiAgZmlsbE9wYWNpdHk/OiBudW1iZXI7XG4gIHN0cm9rZT86IHN0cmluZztcbiAgc3Ryb2tlV2lkdGg/OiBudW1iZXI7XG4gIHN0cm9rZU9wYWNpdHk/IDpudW1iZXI7XG4gIHN0cm9rZURhc2g/OiBudW1iZXI7XG4gIHN0cm9rZURhc2hPZmZzZXQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjb25zdCBjZWxsQ29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDBcbiAgICB9LFxuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjAwXG4gICAgfSxcbiAgICBncmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICcjMDAwMDAwJ1xuICAgIH0sXG4gICAgZ3JpZE9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDEsXG4gICAgICBkZWZhdWx0OiAwLjRcbiAgICB9LFxuICAgIGdyaWRPZmZzZXQ6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH0sXG5cbiAgICAvLyBHcm91cCBwcm9wZXJ0aWVzXG4gICAgY2xpcDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIH0sXG4gICAgZmlsbDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJ3JnYmEoMCwwLDAsMCknXG4gICAgfSxcbiAgICBmaWxsT3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgfSxcbiAgICBzdHJva2U6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICB9LFxuICAgIHN0cm9rZVdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICB9LFxuICAgIHN0cm9rZU9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgfSxcbiAgICBzdHJva2VEYXNoOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBzdHJva2VEYXNoT2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBvZmZzZXQgKGluIHBpeGVscykgaW50byB3aGljaCB0byBiZWdpbiBkcmF3aW5nIHdpdGggdGhlIHN0cm9rZSBkYXNoIGFycmF5LidcbiAgICB9XG4gIH1cbn07XG4iLCJleHBvcnQgaW50ZXJmYWNlIE1hcmtDb25maWcge1xuICBmaWxsZWQ/OiBib29sZWFuO1xuICBzb3J0Qnk/OiBTdHJpbmcgfCBTdHJpbmdbXTtcbiAgc29ydExpbmVCeT86IFN0cmluZyB8IFN0cmluZ1tdO1xuXG4gIC8vIEdlbmVyYWwgVmVnYVxuICBvcGFjaXR5PzogbnVtYmVyO1xuXG4gIHN0cm9rZVdpZHRoPzogbnVtYmVyO1xuICBzdHJva2VEYXNoPzogbnVtYmVyW107XG4gIHN0cm9rZURhc2hPZmZzZXQ/OiBudW1iZXJbXTtcbiAgZmlsbD86IHN0cmluZztcbiAgZmlsbE9wYWNpdHk/OiBudW1iZXI7XG4gIHN0cm9rZT86IHN0cmluZztcbiAgc3Ryb2tlT3BhY2l0eT86IG51bWJlcjtcblxuICAvLyBCYXIgLyBhcmVhXG4gIG9yaWVudD86IHN0cmluZztcbiAgLy8gTGluZSAvIGFyZWFcbiAgaW50ZXJwb2xhdGU/OiBzdHJpbmc7XG4gIHRlbnNpb24/OiBudW1iZXI7XG5cbiAgLy8gVGljay1vbmx5XG4gIHRoaWNrbmVzcz86IG51bWJlcjtcblxuICAvLyBUZXh0LW9ubHlcbiAgYWxpZ24/OiBzdHJpbmc7XG4gIGFuZ2xlPzogbnVtYmVyO1xuICBiYXNlbGluZT86IHN0cmluZztcbiAgZHg/OiBudW1iZXI7XG4gIGR5PzogbnVtYmVyO1xuICByYWRpdXM/OiBudW1iZXI7XG4gIHRoZXRhPzogbnVtYmVyO1xuICBmb250Pzogc3RyaW5nO1xuICBmb250U3R5bGU/OiBzdHJpbmc7XG4gIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XG4gIC8vIFZlZ2EtTGl0ZSBvbmx5IGZvciB0ZXh0IG9ubHlcbiAgZm9ybWF0Pzogc3RyaW5nO1xuICBzaG9ydFRpbWVMYWJlbHM/OiBib29sZWFuO1xuXG4gIGFwcGx5Q29sb3JUb0JhY2tncm91bmQ/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgbWFya0NvbmZpZyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvLyBWZWdhLUxpdGUgc3BlY2lhbFxuICAgIGZpbGxlZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRoZSBzaGFwZVxcJ3MgY29sb3Igc2hvdWxkIGJlIHVzZWQgYXMgZmlsbCBjb2xvciBpbnN0ZWFkIG9mIHN0cm9rZSBjb2xvci4gJyArXG4gICAgICAgICdUaGlzIGlzIG9ubHkgYXBwbGljYWJsZSBmb3IgXCJiYXJcIiwgXCJwb2ludFwiLCBhbmQgXCJhcmVhXCIuICcgK1xuICAgICAgICAnQWxsIG1hcmtzIGV4Y2VwdCBcInBvaW50XCIgbWFya3MgYXJlIGZpbGxlZCBieSBkZWZhdWx0LidcbiAgICB9LFxuICAgIHNvcnRCeToge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgb25lT2Y6IFtcbiAgICAgICAge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAge3R5cGU6ICdhcnJheScsIGl0ZW1zOnt0eXBlOidzdHJpbmcnfX1cbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ1NvcnQgbGF5ZXIgb2YgbWFya3MgYnkgYSBnaXZlbiBmaWVsZCBvciBmaWVsZHMuJ1xuICAgIH0sXG4gICAgc29ydExpbmVCeToge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgb25lT2Y6IFtcbiAgICAgICAge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAge3R5cGU6ICdhcnJheScsIGl0ZW1zOnt0eXBlOidzdHJpbmcnfX1cbiAgICAgIF0sXG4gICAgICBkZXNjcmlwdGlvbjogJ1NvcnQgbGF5ZXIgb2YgbWFya3MgYnkgYSBnaXZlbiBmaWVsZCBvciBmaWVsZHMuJ1xuICAgIH0sXG4gICAgLy8gR2VuZXJhbCBWZWdhXG4gICAgZmlsbDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBmaWxsT3BhY2l0eToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsICAvLyBhdXRvXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMVxuICAgIH0sXG4gICAgc3Ryb2tlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHN0cm9rZU9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDFcbiAgICB9LFxuICAgIG9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDFcbiAgICB9LFxuICAgIHN0cm9rZVdpZHRoOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDIsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzdHJva2VEYXNoOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdBbiBhcnJheSBvZiBhbHRlcm5hdGluZyBzdHJva2UsIHNwYWNlIGxlbmd0aHMgZm9yIGNyZWF0aW5nIGRhc2hlZCBvciBkb3R0ZWQgbGluZXMuJ1xuICAgIH0sXG4gICAgc3Ryb2tlRGFzaE9mZnNldDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9mZnNldCAoaW4gcGl4ZWxzKSBpbnRvIHdoaWNoIHRvIGJlZ2luIGRyYXdpbmcgd2l0aCB0aGUgc3Ryb2tlIGRhc2ggYXJyYXkuJ1xuICAgIH0sXG5cbiAgICAvLyBiYXIgLyBhcmVhXG4gICAgb3JpZW50OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG9yaWVudGF0aW9uIG9mIGEgbm9uLXN0YWNrZWQgYmFyLCBhcmVhLCBhbmQgbGluZSBjaGFydHMuJyArXG4gICAgICAgJ1RoZSB2YWx1ZSBpcyBlaXRoZXIgaG9yaXpvbnRhbCAoZGVmYXVsdCkgb3IgdmVydGljYWwuJyArXG4gICAgICAgJ0ZvciBhcmVhLCB0aGlzIHByb3BlcnR5IGRldGVybWluZXMgdGhlIG9yaWVudCBwcm9wZXJ0eSBvZiB0aGUgVmVnYSBvdXRwdXQuJyArXG4gICAgICAgJ0ZvciBsaW5lLCB0aGlzIHByb3BlcnR5IGRldGVybWluZXMgdGhlIHNvcnQgb3JkZXIgb2YgdGhlIHBvaW50cyBpbiB0aGUgbGluZSBpZiBgY29uZmlnLnNvcnRMaW5lQnlgIGlzIG5vdCBzcGVjaWZpZWQuJyArXG4gICAgICAgJ0ZvciBzdGFja2VkIGNoYXJ0cywgdGhpcyBpcyBhbHdheXMgZGV0ZXJtaW5lZCBieSB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHN0YWNrOyAnICtcbiAgICAgICAndGhlcmVmb3JlIGV4cGxpY2l0bHkgc3BlY2lmaWVkIHZhbHVlIHdpbGwgYmUgaWdub3JlZC4nXG4gICAgfSxcblxuICAgIC8vIGxpbmUgLyBhcmVhXG4gICAgaW50ZXJwb2xhdGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgLy8gVE9ETyBiZXR0ZXIgZGVzY3JpYmUgdGhhdCBzb21lIG9mIHRoZW0gaXNuJ3Qgc3VwcG9ydGVkIGluIGFyZWFcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGxpbmUgaW50ZXJwb2xhdGlvbiBtZXRob2QgdG8gdXNlLiBPbmUgb2YgbGluZWFyLCBzdGVwLWJlZm9yZSwgc3RlcC1hZnRlciwgYmFzaXMsIGJhc2lzLW9wZW4sIGJhc2lzLWNsb3NlZCwgYnVuZGxlLCBjYXJkaW5hbCwgY2FyZGluYWwtb3BlbiwgY2FyZGluYWwtY2xvc2VkLCBtb25vdG9uZS4nXG4gICAgfSxcbiAgICB0ZW5zaW9uOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVwZW5kaW5nIG9uIHRoZSBpbnRlcnBvbGF0aW9uIHR5cGUsIHNldHMgdGhlIHRlbnNpb24gcGFyYW1ldGVyLidcbiAgICB9LFxuXG4gICAgLy8gVGljay1vbmx5XG4gICAgdGhpY2tuZXNzOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaWNrbmVzcyBvZiB0aGUgdGljayBtYXJrLidcbiAgICB9LFxuXG4gICAgLy8gdGV4dC1vbmx5XG4gICAgYWxpZ246IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZW51bTogWydsZWZ0JywgJ3JpZ2h0JywgJ2NlbnRlciddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgaG9yaXpvbnRhbCBhbGlnbm1lbnQgb2YgdGhlIHRleHQuIE9uZSBvZiBsZWZ0LCByaWdodCwgY2VudGVyLidcbiAgICB9LFxuICAgIGFuZ2xlOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHJvdGF0aW9uIGFuZ2xlIG9mIHRoZSB0ZXh0LCBpbiBkZWdyZWVzLidcbiAgICB9LFxuICAgIGJhc2VsaW5lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdtaWRkbGUnLFxuICAgICAgZW51bTogWyd0b3AnLCAnbWlkZGxlJywgJ2JvdHRvbSddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgdmVydGljYWwgYWxpZ25tZW50IG9mIHRoZSB0ZXh0LiBPbmUgb2YgdG9wLCBtaWRkbGUsIGJvdHRvbS4nXG4gICAgfSxcbiAgICBkeDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBob3Jpem9udGFsIG9mZnNldCwgaW4gcGl4ZWxzLCBiZXR3ZWVuIHRoZSB0ZXh0IGxhYmVsIGFuZCBpdHMgYW5jaG9yIHBvaW50LiBUaGUgb2Zmc2V0IGlzIGFwcGxpZWQgYWZ0ZXIgcm90YXRpb24gYnkgdGhlIGFuZ2xlIHByb3BlcnR5LidcbiAgICB9LFxuICAgIGR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHZlcnRpY2FsIG9mZnNldCwgaW4gcGl4ZWxzLCBiZXR3ZWVuIHRoZSB0ZXh0IGxhYmVsIGFuZCBpdHMgYW5jaG9yIHBvaW50LiBUaGUgb2Zmc2V0IGlzIGFwcGxpZWQgYWZ0ZXIgcm90YXRpb24gYnkgdGhlIGFuZ2xlIHByb3BlcnR5LidcbiAgICB9LFxuICAgIGZvbnQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgcm9sZTogJ2ZvbnQnLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgdHlwZWZhY2UgdG8gc2V0IHRoZSB0ZXh0IGluIChlLmcuLCBIZWx2ZXRpY2EgTmV1ZSkuJ1xuICAgIH0sXG4gICAgLy8gZm9udFNpemUgZXhjbHVkZWQgYXMgd2UgdXNlIHNpemUudmFsdWVcbiAgICBmb250U3R5bGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZW51bTogWydub3JtYWwnLCAnaXRhbGljJ10sXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb250IHN0eWxlIChlLmcuLCBpdGFsaWMpLidcbiAgICB9LFxuICAgIGZvbnRXZWlnaHQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydub3JtYWwnLCAnYm9sZCddLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgZm9udCB3ZWlnaHQgKGUuZy4sIGJvbGQpLidcbiAgICB9LFxuICAgIHJhZGl1czoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1BvbGFyIGNvb3JkaW5hdGUgcmFkaWFsIG9mZnNldCwgaW4gcGl4ZWxzLCBvZiB0aGUgdGV4dCBsYWJlbCBmcm9tIHRoZSBvcmlnaW4gZGV0ZXJtaW5lZCBieSB0aGUgeCBhbmQgeSBwcm9wZXJ0aWVzLidcbiAgICB9LFxuICAgIHRoZXRhOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUG9sYXIgY29vcmRpbmF0ZSBhbmdsZSwgaW4gcmFkaWFucywgb2YgdGhlIHRleHQgbGFiZWwgZnJvbSB0aGUgb3JpZ2luIGRldGVybWluZWQgYnkgdGhlIHggYW5kIHkgcHJvcGVydGllcy4gVmFsdWVzIGZvciB0aGV0YSBmb2xsb3cgdGhlIHNhbWUgY29udmVudGlvbiBvZiBhcmMgbWFyayBzdGFydEFuZ2xlIGFuZCBlbmRBbmdsZSBwcm9wZXJ0aWVzOiBhbmdsZXMgYXJlIG1lYXN1cmVkIGluIHJhZGlhbnMsIHdpdGggMCBpbmRpY2F0aW5nIFwibm9ydGhcIi4nXG4gICAgfSxcbiAgICAvLyB0ZXh0LW9ubHkgJiBWTCBvbmx5XG4gICAgZm9ybWF0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgdGV4dCB2YWx1ZS4gSWYgbm90IGRlZmluZWQsIHRoaXMgd2lsbCBiZSBkZXRlcm1pbmVkIGF1dG9tYXRpY2FsbHkuICdcbiAgICB9LFxuICAgIHNob3J0VGltZUxhYmVsczoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgbW9udGggbmFtZXMgYW5kIHdlZWtkYXkgbmFtZXMgc2hvdWxkIGJlIGFiYnJldmlhdGVkLidcbiAgICB9LFxuICAgIGFwcGx5Q29sb3JUb0JhY2tncm91bmQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdBcHBseSBjb2xvciBmaWVsZCB0byBiYWNrZ3JvdW5kIGNvbG9yIGluc3RlYWQgb2YgdGhlIHRleHQuJ1xuICAgIH1cbiAgfVxufTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgU2NlbmVDb25maWcge1xuICBmaWxsPzogc3RyaW5nO1xuICBmaWxsT3BhY2l0eT86IG51bWJlcjtcbiAgc3Ryb2tlPzogc3RyaW5nO1xuICBzdHJva2VXaWR0aD86IG51bWJlcjtcbiAgc3Ryb2tlT3BhY2l0eT8gOm51bWJlcjtcbiAgc3Ryb2tlRGFzaD86IG51bWJlcjtcbiAgc3Ryb2tlRGFzaE9mZnNldD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IHNjZW5lQ29uZmlnID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGZpbGw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJ1xuICAgIH0sXG4gICAgZmlsbE9wYWNpdHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgIH0sXG4gICAgc3Ryb2tlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgfSxcbiAgICBzdHJva2VXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgfSxcbiAgICBzdHJva2VPcGFjaXR5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgIH0sXG4gICAgc3Ryb2tlRGFzaDoge1xuICAgICAgdHlwZTogJ2FycmF5J1xuICAgIH0sXG4gICAgc3Ryb2tlRGFzaE9mZnNldDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgb2Zmc2V0IChpbiBwaXhlbHMpIGludG8gd2hpY2ggdG8gYmVnaW4gZHJhd2luZyB3aXRoIHRoZSBzdHJva2UgZGFzaCBhcnJheS4nXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHtTdGFja0NvbmZpZywgc3RhY2tDb25maWd9IGZyb20gJy4vY29uZmlnLnN0YWNrLnNjaGVtYSc7XG5pbXBvcnQge0NlbGxDb25maWcsIGNlbGxDb25maWd9IGZyb20gJy4vY29uZmlnLmNlbGwuc2NoZW1hJztcbmltcG9ydCB7TWFya0NvbmZpZywgbWFya0NvbmZpZ30gZnJvbSAnLi9jb25maWcubWFya3Muc2NoZW1hJztcbmltcG9ydCB7U2NlbmVDb25maWcsIHNjZW5lQ29uZmlnfSBmcm9tICcuL2NvbmZpZy5zY2VuZS5zY2hlbWEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIHBhZGRpbmc/OiBudW1iZXJ8c3RyaW5nO1xuICB2aWV3cG9ydD86IG51bWJlcjtcbiAgYmFja2dyb3VuZD86IHN0cmluZztcbiAgZmlsdGVyTnVsbD86IGJvb2xlYW47XG5cbiAgY2VsbD86IENlbGxDb25maWc7XG4gIG1hcms/OiBNYXJrQ29uZmlnO1xuICBzY2VuZT86IFNjZW5lQ29uZmlnO1xuICBzdGFjaz86IFN0YWNrQ29uZmlnO1xuXG4gIC8vIFRPRE86IHJldmlzZVxuICB0ZXh0Q2VsbFdpZHRoPzogYW55O1xuICBudW1iZXJGb3JtYXQ/OiBzdHJpbmc7XG4gIHRpbWVGb3JtYXQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gdGVtcGxhdGVcbiAgICAvLyBUT0RPOiBhZGQgdGhpcyBiYWNrIG9uY2Ugd2UgaGF2ZSB0b3AtZG93biBsYXlvdXQgYXBwcm9hY2hcbiAgICAvLyB3aWR0aDoge1xuICAgIC8vICAgdHlwZTogJ2ludGVnZXInLFxuICAgIC8vICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgLy8gfSxcbiAgICAvLyBoZWlnaHQ6IHtcbiAgICAvLyAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAvLyAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIC8vIH0sXG4gICAgLy8gcGFkZGluZzoge1xuICAgIC8vICAgdHlwZTogWydudW1iZXInLCAnc3RyaW5nJ10sXG4gICAgLy8gICBkZWZhdWx0OiAnYXV0bydcbiAgICAvLyB9LFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgb24tc2NyZWVuIHZpZXdwb3J0LCBpbiBwaXhlbHMuIElmIG5lY2Vzc2FyeSwgY2xpcHBpbmcgYW5kIHNjcm9sbGluZyB3aWxsIGJlIGFwcGxpZWQuJ1xuICAgIH0sXG4gICAgYmFja2dyb3VuZDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdDU1MgY29sb3IgcHJvcGVydHkgdG8gdXNlIGFzIGJhY2tncm91bmQgb2YgdmlzdWFsaXphdGlvbi4gRGVmYXVsdCBpcyBgXCJ0cmFuc3BhcmVudFwiYC4nXG4gICAgfSxcblxuICAgIC8vIGZpbHRlciBudWxsXG4gICAgZmlsdGVyTnVsbDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdGaWx0ZXIgbnVsbCB2YWx1ZXMgZnJvbSB0aGUgZGF0YS4gSWYgc2V0IHRvIHRydWUsIGFsbCByb3dzIHdpdGggbnVsbCB2YWx1ZXMgYXJlIGZpbHRlcmVkLiBJZiBmYWxzZSwgbm8gcm93cyBhcmUgZmlsdGVyZWQuIFNldCB0aGUgcHJvcGVydHkgdG8gdW5kZWZpbmVkIHRvIGZpbHRlciBvbmx5IHF1YW50aXRhdGl2ZSBhbmQgdGVtcG9yYWwgZmllbGRzLidcbiAgICB9LFxuXG4gICAgLy8gZm9ybWF0c1xuICAgIG51bWJlckZvcm1hdDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0QzIE51bWJlciBmb3JtYXQgZm9yIGF4aXMgbGFiZWxzIGFuZCB0ZXh0IHRhYmxlcy4gRm9yIGV4YW1wbGUgXCJzXCIgZm9yIFNJIHVuaXRzLidcbiAgICB9LFxuICAgIHRpbWVGb3JtYXQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJyVZLSVtLSVkJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVmYXVsdCBkYXRldGltZSBmb3JtYXQgZm9yIGF4aXMgYW5kIGxlZ2VuZCBsYWJlbHMuIFRoZSBmb3JtYXQgY2FuIGJlIHNldCBkaXJlY3RseSBvbiBlYWNoIGF4aXMgYW5kIGxlZ2VuZC4nXG4gICAgfSxcblxuICAgIHRleHRDZWxsV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDkwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG5cbiAgICAvLyBuZXN0ZWRcbiAgICBzdGFjazogc3RhY2tDb25maWcsXG4gICAgY2VsbDogY2VsbENvbmZpZyxcbiAgICBtYXJrOiBtYXJrQ29uZmlnLFxuICAgIHNjZW5lOiBzY2VuZUNvbmZpZ1xuICB9XG59O1xuIiwiZXhwb3J0IGludGVyZmFjZSBTdGFja0NvbmZpZyB7XG4gIHNvcnQ/OiBzdHJpbmd8c3RyaW5nW107XG4gIG9mZnNldD86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IHN0YWNrQ29uZmlnID0ge1xuICB0eXBlOiBbJ2Jvb2xlYW4nLCAnb2JqZWN0J10sXG4gIGRlZmF1bHQ6IHt9LFxuICBkZXNjcmlwdGlvbjogJ0VuYWJsZSBzdGFja2luZyAoZm9yIGJhciBhbmQgYXJlYSBtYXJrcyBvbmx5KS4nLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc29ydDoge1xuICAgICAgb25lT2Y6IFt7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBlbnVtOiBbJ2FzY2VuZGluZycsICdkZXNjZW5kaW5nJ11cbiAgICAgIH0se1xuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBpdGVtczoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgIH1dLFxuICAgICAgZGVzY3JpcHRpb246ICdPcmRlciBvZiB0aGUgc3RhY2suICcgK1xuICAgICAgICAnVGhpcyBjYW4gYmUgZWl0aGVyIGEgc3RyaW5nIChlaXRoZXIgXCJkZXNjZW5kaW5nXCIgb3IgXCJhc2NlbmRpbmdcIiknICtcbiAgICAgICAgJ29yIGEgbGlzdCBvZiBmaWVsZHMgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBvZiBzdGFjayBsYXllcnMuJyArXG4gICAgICAgICdCeSBkZWZhdWx0LCBzdGFjayB1c2VzIGRlc2NlbmRpbmcgb3JkZXIuJ1xuICAgIH0sXG4gICAgb2Zmc2V0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnemVybycsICdjZW50ZXInLCAnbm9ybWFsaXplJ11cbiAgICAgIC8vIFRPRE8oIzYyMCkgcmVmZXIgdG8gVmVnYSBzcGVjIG9uY2UgaXQgZG9lc24ndCB0aHJvdyBlcnJvclxuICAgICAgLy8gZW51bTogdmdTdGFja1NjaGVtYS5wcm9wZXJ0aWVzLm9mZnNldC5vbmVPZlswXS5lbnVtXG4gICAgfVxuICB9XG59O1xuIiwiZXhwb3J0IGludGVyZmFjZSBEYXRhIHtcbiAgZm9ybWF0VHlwZT86IHN0cmluZztcbiAgdXJsPzogc3RyaW5nO1xuICB2YWx1ZXM/OiBhbnlbXTtcbiAgZmlsdGVyPzogc3RyaW5nO1xuICBjYWxjdWxhdGU/OiBWZ0Zvcm11bGFbXTtcbn1cblxuLy8gVE9ETyBtb3ZlIHRoaXMgdG8gb25lIGNlbnRyYWwgcG9zaXRpb25cbmV4cG9ydCBpbnRlcmZhY2UgVmdGb3JtdWxhIHtcbiAgZmllbGQ6IHN0cmluZztcbiAgZXhwcjogc3RyaW5nO1xufVxuXG5leHBvcnQgdmFyIGRhdGEgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gZGF0YSBzb3VyY2VcbiAgICBmb3JtYXRUeXBlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnanNvbicsICdjc3YnLCAndHN2J10sXG4gICAgICBkZWZhdWx0OiAnanNvbidcbiAgICB9LFxuICAgIHVybDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHZhbHVlczoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGFzcyBhcnJheSBvZiBvYmplY3RzIGluc3RlYWQgb2YgYSB1cmwgdG8gYSBmaWxlLicsXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIHdlIGdlbmVyYXRlIGEgdmVnYSBmaWx0ZXIgdHJhbnNmb3JtXG4gICAgZmlsdGVyOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBzdHJpbmcgY29udGFpbmluZyB0aGUgZmlsdGVyIFZlZ2EgZXhwcmVzc2lvbi4gVXNlIGBkYXR1bWAgdG8gcmVmZXIgdG8gdGhlIGN1cnJlbnQgZGF0YSBvYmplY3QuJ1xuICAgIH0sXG4gICAgLy8gd2UgZ2VuZXJhdGUgYSB2ZWdhIGZvcm11bGEgdHJhbnNmb3JtXG4gICAgY2FsY3VsYXRlOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgZGVzY3JpcHRpb246ICdDYWxjdWxhdGUgbmV3IGZpZWxkKHMpIHVzaW5nIHRoZSBwcm92aWRlZCBleHByZXNzc2lvbihzKS4gQ2FsY3VsYXRpb24gYXJlIGFwcGxpZWQgYmVmb3JlIGZpbHRlci4nLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBmaWVsZDoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmaWVsZCBpbiB3aGljaCB0byBzdG9yZSB0aGUgY29tcHV0ZWQgZm9ybXVsYSB2YWx1ZS4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBleHByOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBzdHJpbmcgY29udGFpbmluZyBhbiBleHByZXNzaW9uIGZvciB0aGUgZm9ybXVsYS4gVXNlIHRoZSB2YXJpYWJsZSBgZGF0dW1gIHRvIHRvIHJlZmVyIHRvIHRoZSBjdXJyZW50IGRhdGEgb2JqZWN0LidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQge21lcmdlRGVlcH0gZnJvbSAnLi9zY2hlbWF1dGlsJztcbmltcG9ydCB7ZHVwbGljYXRlfSBmcm9tICcuLi91dGlsJztcblxuXG5pbXBvcnQge2F4aXN9IGZyb20gJy4vYXhpcy5zY2hlbWEnO1xuaW1wb3J0IHtGaWVsZERlZiwgZmllbGREZWYsIGZhY2V0RmllbGQsIG9ubHlPcmRpbmFsRmllbGQsIHR5cGljYWxGaWVsZH0gZnJvbSAnLi9maWVsZGRlZi5zY2hlbWEnO1xuaW1wb3J0IHtsZWdlbmR9IGZyb20gJy4vbGVnZW5kLnNjaGVtYSc7XG5pbXBvcnQge3NvcnR9IGZyb20gJy4vc29ydC5zY2hlbWEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVuY29kaW5nIHtcbiAgeD86IEZpZWxkRGVmO1xuICB5PzogRmllbGREZWY7XG4gIHJvdz86IEZpZWxkRGVmO1xuICBjb2x1bW4/OiBGaWVsZERlZjtcbiAgY29sb3I/OiBGaWVsZERlZjtcbiAgc2l6ZT86IEZpZWxkRGVmO1xuICBzaGFwZT86IEZpZWxkRGVmO1xuICBkZXRhaWw/OiBGaWVsZERlZiB8IEZpZWxkRGVmW107XG4gIHRleHQ/OiBGaWVsZERlZjtcbiAgbGFiZWw/OiBGaWVsZERlZjtcbn1cblxudmFyIHggPSBtZXJnZURlZXAoZHVwbGljYXRlKHR5cGljYWxGaWVsZCksIHtcbiAgcmVxdWlyZWQ6IFsnZmllbGQnLCAndHlwZSddLCAvLyBUT0RPOiByZW1vdmUgaWYgcG9zc2libGVcbiAgcHJvcGVydGllczoge1xuICAgIHNjYWxlOiB7Ly8gcmVwbGFjaW5nIGRlZmF1bHQgdmFsdWVzIGZvciBqdXN0IHRoZXNlIHR3byBheGVzXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBhZGRpbmc6IHtkZWZhdWx0OiAxfSxcbiAgICAgICAgYmFuZFdpZHRoOiB7ZGVmYXVsdDogMjF9XG4gICAgICB9XG4gICAgfSxcbiAgICBheGlzOiBheGlzLFxuICAgIHNvcnQ6IHNvcnRcbiAgfVxufSk7XG5cbnZhciB5ID0gZHVwbGljYXRlKHgpO1xuXG52YXIgcm93ID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShmYWNldEZpZWxkKSk7XG52YXIgY29sdW1uID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShmYWNldEZpZWxkKSk7XG5cbnZhciBzaXplID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZSh0eXBpY2FsRmllbGQpLCB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBsZWdlbmQ6IGxlZ2VuZCxcbiAgICBzb3J0OiBzb3J0LFxuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVzY3JpcHRpb246ICdTaXplIG9mIG1hcmtzLiBCeSBkZWZhdWx0LCB0aGlzIGlzIDMwIGZvciBwb2ludCwgc3F1YXJlLCBhbmQgY2lyY2xlLCBhbmQgMTAgZm9yIHRleHQuJ1xuICAgIH1cbiAgfVxufSk7XG5cbnZhciBjb2xvciA9IG1lcmdlRGVlcChkdXBsaWNhdGUodHlwaWNhbEZpZWxkKSwge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGVnZW5kOiBsZWdlbmQsXG4gICAgc29ydDogc29ydCxcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJyM0NjgyYjQnLFxuICAgICAgZGVzY3JpcHRpb246ICdDb2xvciB0byBiZSB1c2VkIGZvciBtYXJrcy4nXG4gICAgfSxcbiAgICBzY2FsZToge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHF1YW50aXRhdGl2ZVJhbmdlOiB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBkZWZhdWx0OiBbJyNBRkM2QTMnLCAnIzA5NjIyQSddLCAvLyB0YWJsZWF1IGdyZWVuc1xuICAgICAgICAgIC8vIGRlZmF1bHQ6IFsnI2NjZWNlNicsICcjMDA0NDFiJ10sIC8vIEJ1R24uOSBbMi04XVxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ29sb3IgcmFuZ2UgdG8gZW5jb2RlIHF1YW50aXRhdGl2ZSB2YXJpYWJsZXMuJyxcbiAgICAgICAgICBtaW5JdGVtczogMixcbiAgICAgICAgICBtYXhJdGVtczogMixcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICByb2xlOiAnY29sb3InXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxudmFyIHNoYXBlID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShvbmx5T3JkaW5hbEZpZWxkKSwge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGVnZW5kOiBsZWdlbmQsXG4gICAgc29ydDogc29ydCxcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2NpcmNsZScsICdzcXVhcmUnLCAnY3Jvc3MnLCAnZGlhbW9uZCcsICd0cmlhbmdsZS11cCcsICd0cmlhbmdsZS1kb3duJ10sXG4gICAgICBkZWZhdWx0OiAnY2lyY2xlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWFyayB0byBiZSB1c2VkLidcbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgZGV0YWlsID0ge1xuICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gIG9uZU9mOiBbZHVwbGljYXRlKGZpZWxkRGVmKSwge1xuICAgIHR5cGU6ICdhcnJheScsXG4gICAgaXRlbXM6IGR1cGxpY2F0ZShmaWVsZERlZilcbiAgfV1cbn07XG5cbi8vIHdlIG9ubHkgcHV0IGFnZ3JlZ2F0ZWQgbWVhc3VyZSBpbiBwaXZvdCB0YWJsZVxudmFyIHRleHQgPSBtZXJnZURlZXAoZHVwbGljYXRlKHR5cGljYWxGaWVsZCksIHtcbiAgcHJvcGVydGllczoge1xuICAgIHNvcnQ6IHNvcnQsXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ0FiYydcbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgbGFiZWwgPSBtZXJnZURlZXAoZHVwbGljYXRlKHR5cGljYWxGaWVsZCksIHtcbiAgcHJvcGVyaWVzOiB7XG4gICAgc29ydDogc29ydFxuICB9XG59KTtcblxuZXhwb3J0IHZhciBlbmNvZGluZyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICB4OiB4LFxuICAgIHk6IHksXG4gICAgcm93OiByb3csXG4gICAgY29sdW1uOiBjb2x1bW4sXG4gICAgc2l6ZTogc2l6ZSxcbiAgICBjb2xvcjogY29sb3IsXG4gICAgc2hhcGU6IHNoYXBlLFxuICAgIHRleHQ6IHRleHQsXG4gICAgZGV0YWlsOiBkZXRhaWwsXG4gICAgbGFiZWw6IGxhYmVsXG4gIH1cbn07XG4iLCJpbXBvcnQge2F4aXMsIEF4aXN9IGZyb20gJy4vYXhpcy5zY2hlbWEnO1xuaW1wb3J0IHtiaW4sIEJpbn0gZnJvbSAnLi9iaW4uc2NoZW1hJztcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuL2xlZ2VuZC5zY2hlbWEnO1xuaW1wb3J0IHt0eXBpY2FsU2NhbGUsIG9yZGluYWxPbmx5U2NhbGUsIFNjYWxlfSBmcm9tICcuL3NjYWxlLnNjaGVtYSc7XG5pbXBvcnQge3NvcnQsIFNvcnR9IGZyb20gJy4vc29ydC5zY2hlbWEnO1xuXG5pbXBvcnQge0FHR1JFR0FURV9PUFN9IGZyb20gJy4uL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge3RvTWFwLCBkdXBsaWNhdGV9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHttZXJnZURlZXB9IGZyb20gJy4vc2NoZW1hdXRpbCc7XG5pbXBvcnQge1RJTUVVTklUU30gZnJvbSAnLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtOT01JTkFMLCBPUkRJTkFMLCBRVUFOVElUQVRJVkUsIFRFTVBPUkFMLCBUeXBlfSBmcm9tICcuLi90eXBlJztcblxuLyoqXG4gKiAgSW50ZXJmYWNlIGZvciBhbnkga2luZCBvZiBGaWVsZERlZjtcbiAqICBGb3Igc2ltcGxpY2l0eSwgd2UgZG8gbm90IGRlY2xhcmUgbXVsdGlwbGUgaW50ZXJmYWNlcyBvZiBGaWVsZERlZiBsaWtlXG4gKiAgd2UgZG8gZm9yIEpTT04gc2NoZW1hLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpZWxkRGVmIHtcbiAgZmllbGQ/OiBzdHJpbmc7XG4gIHR5cGU/OiBUeXBlO1xuICB2YWx1ZT86IGFueTtcblxuICAvLyBmdW5jdGlvblxuICB0aW1lVW5pdD86IHN0cmluZztcbiAgYmluPzogYm9vbGVhbiB8IEJpbjtcblxuICBhZ2dyZWdhdGU/OiBzdHJpbmc7XG4gIHNvcnQ/OiBTb3J0IHwgc3RyaW5nO1xuXG4gIC8vIG92ZXJyaWRlIHZlZ2EgY29tcG9uZW50c1xuICBheGlzPzogQXhpcyB8IGJvb2xlYW47XG4gIGxlZ2VuZD86IExlZ2VuZCB8IGJvb2xlYW47XG4gIHNjYWxlPzogU2NhbGU7XG5cbiAgLy8gVE9ETzogbWF5YmUgZXh0ZW5kIHRoaXMgaW4gb3RoZXIgYXBwP1xuICAvLyB1bnVzZWQgbWV0YWRhdGEgLS0gZm9yIG90aGVyIGFwcGxpY2F0aW9uXG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgdmFyIGZpZWxkRGVmID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGZpZWxkOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIH0sXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbTk9NSU5BTCwgT1JESU5BTCwgUVVBTlRJVEFUSVZFLCBURU1QT1JBTF1cbiAgICB9LFxuICAgIHRpbWVVbml0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFRJTUVVTklUUyxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbVEVNUE9SQUxdKVxuICAgIH0sXG4gICAgYmluOiBiaW4sXG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgYWdncmVnYXRlID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogQUdHUkVHQVRFX09QUyxcbiAgc3VwcG9ydGVkRW51bXM6IHtcbiAgICBxdWFudGl0YXRpdmU6IEFHR1JFR0FURV9PUFMsXG4gICAgb3JkaW5hbDogWydtZWRpYW4nLCdtaW4nLCdtYXgnXSxcbiAgICBub21pbmFsOiBbXSxcbiAgICB0ZW1wb3JhbDogWydtZWFuJywgJ21lZGlhbicsICdtaW4nLCAnbWF4J10sIC8vIFRPRE86IHJldmlzZSB3aGF0IHNob3VsZCB0aW1lIHN1cHBvcnRcbiAgICAnJzogWydjb3VudCddXG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUVVBTlRJVEFUSVZFLCBOT01JTkFMLCBPUkRJTkFMLCBURU1QT1JBTCwgJyddKVxufTtcblxuZXhwb3J0IHZhciB0eXBpY2FsRmllbGQgPSBtZXJnZURlZXAoZHVwbGljYXRlKGZpZWxkRGVmKSwge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgYWdncmVnYXRlOiBhZ2dyZWdhdGUsXG4gICAgc2NhbGU6IHR5cGljYWxTY2FsZVxuICB9XG59KTtcblxuZXhwb3J0IHZhciBvbmx5T3JkaW5hbEZpZWxkID0gbWVyZ2VEZWVwKGR1cGxpY2F0ZShmaWVsZERlZiksIHtcbiAgcHJvcGVydGllczoge1xuICAgIHNjYWxlOiBvcmRpbmFsT25seVNjYWxlXG4gIH1cbn0pO1xuXG5leHBvcnQgdmFyIGZhY2V0RmllbGQgPSBtZXJnZURlZXAoZHVwbGljYXRlKG9ubHlPcmRpbmFsRmllbGQpLCB7XG4gIHJlcXVpcmVkOiBbJ2ZpZWxkJywgJ3R5cGUnXSxcbiAgcHJvcGVydGllczoge1xuICAgIGF4aXM6IGF4aXMsXG4gICAgc29ydDogc29ydFxuICB9XG59KTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgTGVnZW5kIHtcbiAgb3JpZW50Pzogc3RyaW5nO1xuICB0aXRsZT86IHN0cmluZztcbiAgZm9ybWF0Pzogc3RyaW5nO1xuICB2YWx1ZXM/OiBBcnJheTxhbnk+O1xuICBwcm9wZXJ0aWVzPzogYW55OyAvLyBUT0RPIGRlY2xhcmUgVmdMZWdlbmRQcm9wZXJ0aWVzXG5cbiAgLy8gVmVnYS1MaXRlIG9ubHlcbiAgc2hvcnRUaW1lTGFiZWxzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IHZhciBsZWdlbmQgPSB7XG4gIGRlZmF1bHQ6IHRydWUsXG4gIGRlc2NyaXB0aW9uOiAnUHJvcGVydGllcyBvZiBhIGxlZ2VuZCBvciBib29sZWFuIGZsYWcgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgdG8gc2hvdyBpdC4nLFxuICBvbmVPZjogW3tcbiAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBvcmllbnQ6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgb3JpZW50YXRpb24gb2YgdGhlIGxlZ2VuZC4gT25lIG9mIFwibGVmdFwiIG9yIFwicmlnaHRcIi4gVGhpcyBkZXRlcm1pbmVzIGhvdyB0aGUgbGVnZW5kIGlzIHBvc2l0aW9uZWQgd2l0aGluIHRoZSBzY2VuZS4gVGhlIGRlZmF1bHQgaXMgXCJyaWdodFwiLidcbiAgICAgIH0sXG4gICAgICB0aXRsZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgZm9yIHRoZSBsZWdlbmQuIChTaG93cyBmaWVsZCBuYW1lIGFuZCBpdHMgZnVuY3Rpb24gYnkgZGVmYXVsdC4pJ1xuICAgICAgfSxcbiAgICAgIGZvcm1hdDoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0FuIG9wdGlvbmFsIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgbGVnZW5kIGxhYmVscy4gVmVnYSB1c2VzIEQzXFwncyBmb3JtYXQgcGF0dGVybi4nXG4gICAgICB9LFxuICAgICAgdmFsdWVzOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFeHBsaWNpdGx5IHNldCB0aGUgdmlzaWJsZSBsZWdlbmQgdmFsdWVzLidcbiAgICAgIH0sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnT3B0aW9uYWwgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9ucyBmb3IgY3VzdG9tIGxlZ2VuZCBzdHlsaW5nLiAnXG4gICAgICB9LFxuXG4gICAgICAvKiBWZWdhLWxpdGUgb25seSAqL1xuICAgICAgc2hvcnRUaW1lTGFiZWxzOiB7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciBtb250aCBuYW1lcyBhbmQgd2Vla2RheSBuYW1lcyBzaG91bGQgYmUgYWJicmV2aWF0ZWQuJ1xuICAgICAgfVxuICAgIH0sXG4gIH0sIHtcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgfV1cbn07XG4iLCJleHBvcnQgdmFyIG1hcmsgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBbJ3BvaW50JywgJ3RpY2snLCAnYmFyJywgJ2xpbmUnLCAnYXJlYScsICdjaXJjbGUnLCAnc3F1YXJlJywgJ3RleHQnXVxufTtcbiIsImltcG9ydCB7dG9NYXAsIGR1cGxpY2F0ZSBhcyBjbG9uZX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge21lcmdlRGVlcH0gZnJvbSAnLi9zY2hlbWF1dGlsJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFLCBURU1QT1JBTH0gZnJvbSAnLi4vdHlwZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NhbGUge1xuICB0eXBlPzogc3RyaW5nO1xuICBkb21haW4/OiBhbnk7IC8vIFRPRE86IGRlY2xhcmUgdmdEYXRhRG9tYWluXG4gIHJhbmdlPzogYW55OyAvLyBUT0RPOiBkZWNsYXJlIHZnUmFuZ2VEb21haW5cbiAgcm91bmQ/OiBib29sZWFuO1xuXG4gIC8vIG9yZGluYWxcbiAgYmFuZFdpZHRoPzogbnVtYmVyO1xuICBvdXRlclBhZGRpbmc/OiBudW1iZXI7XG4gIHBhZGRpbmc/OiBudW1iZXI7XG5cbiAgLy8gdHlwaWNhbFxuICBjbGFtcD86IGJvb2xlYW47XG4gIG5pY2U/OiBib29sZWFufHN0cmluZztcbiAgZXhwb25lbnQ/OiBudW1iZXI7XG4gIHplcm8/OiBib29sZWFuO1xuXG4gIC8vIGNvbG9yIGNoYW5uZWwgb25seVxuICBxdWFudGl0YXRpdmVSYW5nZT8gOiBzdHJpbmdbXTtcblxuICAvLyBWZWdhLUxpdGUgb25seVxuICB1c2VSYXdEb21haW4/OiBib29sZWFuO1xufVxuXG52YXIgc2NhbGUgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICAvLyBUT0RPOiByZWZlciB0byBWZWdhJ3Mgc2NhbGUgc2NoZW1hXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvKiBDb21tb24gU2NhbGUgUHJvcGVydGllcyAqL1xuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydsaW5lYXInLCAnbG9nJywgJ3BvdycsICdzcXJ0JywgJ3F1YW50aWxlJywgJ29yZGluYWwnXSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUVVBTlRJVEFUSVZFXSlcbiAgICB9LFxuICAgIGRvbWFpbjoge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgdHlwZTogWydhcnJheScsICdvYmplY3QnXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGRvbWFpbiBvZiB0aGUgc2NhbGUsIHJlcHJlc2VudGluZyB0aGUgc2V0IG9mIGRhdGEgdmFsdWVzLiBGb3IgcXVhbnRpdGF0aXZlIGRhdGEsIHRoaXMgY2FuIHRha2UgdGhlIGZvcm0gb2YgYSB0d28tZWxlbWVudCBhcnJheSB3aXRoIG1pbmltdW0gYW5kIG1heGltdW0gdmFsdWVzLiBGb3Igb3JkaW5hbC9jYXRlZ29yaWNhbCBkYXRhLCB0aGlzIG1heSBiZSBhbiBhcnJheSBvZiB2YWxpZCBpbnB1dCB2YWx1ZXMuIFRoZSBkb21haW4gbWF5IGFsc28gYmUgc3BlY2lmaWVkIGJ5IGEgcmVmZXJlbmNlIHRvIGEgZGF0YSBzb3VyY2UuJ1xuICAgIH0sXG4gICAgcmFuZ2U6IHtcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIHR5cGU6IFsnYXJyYXknLCAnb2JqZWN0JywgJ3N0cmluZyddLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgcmFuZ2Ugb2YgdGhlIHNjYWxlLCByZXByZXNlbnRpbmcgdGhlIHNldCBvZiB2aXN1YWwgdmFsdWVzLiBGb3IgbnVtZXJpYyB2YWx1ZXMsIHRoZSByYW5nZSBjYW4gdGFrZSB0aGUgZm9ybSBvZiBhIHR3by1lbGVtZW50IGFycmF5IHdpdGggbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMuIEZvciBvcmRpbmFsIG9yIHF1YW50aXplZCBkYXRhLCB0aGUgcmFuZ2UgbWF5IGJ5IGFuIGFycmF5IG9mIGRlc2lyZWQgb3V0cHV0IHZhbHVlcywgd2hpY2ggYXJlIG1hcHBlZCB0byBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIGRvbWFpbi4gRm9yIG9yZGluYWwgc2NhbGVzIG9ubHksIHRoZSByYW5nZSBjYW4gYmUgZGVmaW5lZCB1c2luZyBhIERhdGFSZWY6IHRoZSByYW5nZSB2YWx1ZXMgYXJlIHRoZW4gZHJhd24gZHluYW1pY2FsbHkgZnJvbSBhIGJhY2tpbmcgZGF0YSBzZXQuJ1xuICAgIH0sXG4gICAgcm91bmQ6IHtcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgLy8gVE9ETzogcmV2aXNlIGRlZmF1bHRcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgdHJ1ZSwgcm91bmRzIG51bWVyaWMgb3V0cHV0IHZhbHVlcyB0byBpbnRlZ2Vycy4gVGhpcyBjYW4gYmUgaGVscGZ1bCBmb3Igc25hcHBpbmcgdG8gdGhlIHBpeGVsIGdyaWQuJ1xuICAgIH1cbiAgfVxufTtcblxuXG52YXIgb3JkaW5hbFNjYWxlTWl4aW4gPSB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBiYW5kV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIC8qIE9yZGluYWwgU2NhbGUgUHJvcGVydGllcyAqL1xuICAgIG91dGVyUGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICAgIC8vIFRPRE86IGFkZCBkZXNjcmlwdGlvbiBvbmNlIGl0IGlzIGRvY3VtZW50ZWQgaW4gVmVnYVxuICAgIH0sXG4gICAgcGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FwcGxpZXMgc3BhY2luZyBhbW9uZyBvcmRpbmFsIGVsZW1lbnRzIGluIHRoZSBzY2FsZSByYW5nZS4gVGhlIGFjdHVhbCBlZmZlY3QgZGVwZW5kcyBvbiBob3cgdGhlIHNjYWxlIGlzIGNvbmZpZ3VyZWQuIElmIHRoZSBfX3BvaW50c19fIHBhcmFtZXRlciBpcyBgdHJ1ZWAsIHRoZSBwYWRkaW5nIHZhbHVlIGlzIGludGVycHJldGVkIGFzIGEgbXVsdGlwbGUgb2YgdGhlIHNwYWNpbmcgYmV0d2VlbiBwb2ludHMuIEEgcmVhc29uYWJsZSB2YWx1ZSBpcyAxLjAsIHN1Y2ggdGhhdCB0aGUgZmlyc3QgYW5kIGxhc3QgcG9pbnQgd2lsbCBiZSBvZmZzZXQgZnJvbSB0aGUgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZSBieSBoYWxmIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHBvaW50cy4gT3RoZXJ3aXNlLCBwYWRkaW5nIGlzIHR5cGljYWxseSBpbiB0aGUgcmFuZ2UgWzAsIDFdIGFuZCBjb3JyZXNwb25kcyB0byB0aGUgZnJhY3Rpb24gb2Ygc3BhY2UgaW4gdGhlIHJhbmdlIGludGVydmFsIHRvIGFsbG9jYXRlIHRvIHBhZGRpbmcuIEEgdmFsdWUgb2YgMC41IG1lYW5zIHRoYXQgdGhlIHJhbmdlIGJhbmQgd2lkdGggd2lsbCBiZSBlcXVhbCB0byB0aGUgcGFkZGluZyB3aWR0aC4gRm9yIG1vcmUsIHNlZSB0aGUgW0QzIG9yZGluYWwgc2NhbGUgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly9naXRodWIuY29tL21ib3N0b2NrL2QzL3dpa2kvT3JkaW5hbC1TY2FsZXMpLidcbiAgICB9XG4gIH1cbn07XG5cbnZhciB0eXBpY2FsU2NhbGVNaXhpbiA9IHtcbiAgcHJvcGVydGllczoge1xuICAgIC8qIFF1YW50aXRhdGl2ZSBhbmQgdGVtcG9yYWwgU2NhbGUgUHJvcGVydGllcyAqL1xuICAgIGNsYW1wOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgZGVzY3JpcHRpb246ICdJZiB0cnVlLCB2YWx1ZXMgdGhhdCBleGNlZWQgdGhlIGRhdGEgZG9tYWluIGFyZSBjbGFtcGVkIHRvIGVpdGhlciB0aGUgbWluaW11bSBvciBtYXhpbXVtIHJhbmdlIHZhbHVlJ1xuICAgIH0sXG4gICAgbmljZToge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgb25lT2Y6IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIHRydWUsIG1vZGlmaWVzIHRoZSBzY2FsZSBkb21haW4gdG8gdXNlIGEgbW9yZSBodW1hbi1mcmllbmRseSBudW1iZXIgcmFuZ2UgKGUuZy4sIDcgaW5zdGVhZCBvZiA2Ljk2KS4nXG4gICAgICAgIH0se1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IFsnc2Vjb25kJywgJ21pbnV0ZScsICdob3VyJywgJ2RheScsICd3ZWVrJywgJ21vbnRoJywgJ3llYXInXSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIHNwZWNpZmllZCwgbW9kaWZpZXMgdGhlIHNjYWxlIGRvbWFpbiB0byB1c2UgYSBtb3JlIGh1bWFuLWZyaWVuZGx5IHZhbHVlIHJhbmdlLiBGb3IgdGltZSBhbmQgdXRjIHNjYWxlIHR5cGVzIG9ubHksIHRoZSBuaWNlIHZhbHVlIHNob3VsZCBiZSBhIHN0cmluZyBpbmRpY2F0aW5nIHRoZSBkZXNpcmVkIHRpbWUgaW50ZXJ2YWw7IGxlZ2FsIHZhbHVlcyBhcmUgXCJzZWNvbmRcIiwgXCJtaW51dGVcIiwgXCJob3VyXCIsIFwiZGF5XCIsIFwid2Vla1wiLCBcIm1vbnRoXCIsIG9yIFwieWVhclwiLidcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIC8vIEZJWE1FIHRoaXMgcGFydCBtaWdodCBicmVhayBwb2xlc3RhclxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHRvTWFwKFtRVUFOVElUQVRJVkUsIFRFTVBPUkFMXSksXG4gICAgICBkZXNjcmlwdGlvbjogJydcbiAgICB9LFxuXG4gICAgLyogUXVhbnRpdGF0aXZlIFNjYWxlIFByb3BlcnRpZXMgKi9cbiAgICBleHBvbmVudDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NldHMgdGhlIGV4cG9uZW50IG9mIHRoZSBzY2FsZSB0cmFuc2Zvcm1hdGlvbi4gRm9yIHBvdyBzY2FsZSB0eXBlcyBvbmx5LCBvdGhlcndpc2UgaWdub3JlZC4nXG4gICAgfSxcbiAgICB6ZXJvOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0lmIHRydWUsIGVuc3VyZXMgdGhhdCBhIHplcm8gYmFzZWxpbmUgdmFsdWUgaXMgaW5jbHVkZWQgaW4gdGhlIHNjYWxlIGRvbWFpbi4gVGhpcyBvcHRpb24gaXMgaWdub3JlZCBmb3Igbm9uLXF1YW50aXRhdGl2ZSBzY2FsZXMuJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB0b01hcChbUVVBTlRJVEFUSVZFLCBURU1QT1JBTF0pXG4gICAgfSxcblxuICAgIC8qIFZlZ2EtbGl0ZSBvbmx5IFByb3BlcnRpZXMgKi9cbiAgICB1c2VSYXdEb21haW46IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdVc2VzIHRoZSBzb3VyY2UgZGF0YSByYW5nZSBhcyBzY2FsZSBkb21haW4gaW5zdGVhZCBvZiAnICtcbiAgICAgICAgICAgICAgICAgICAnYWdncmVnYXRlZCBkYXRhIGZvciBhZ2dyZWdhdGUgYXhpcy4gJyArXG4gICAgICAgICAgICAgICAgICAgJ1RoaXMgb3B0aW9uIGRvZXMgbm90IHdvcmsgd2l0aCBzdW0gb3IgY291bnQgYWdncmVnYXRlJyArXG4gICAgICAgICAgICAgICAgICAgJ2FzIHRoZXkgbWlnaHQgaGF2ZSBhIHN1YnN0YW50aWFsbHkgbGFyZ2VyIHNjYWxlIHJhbmdlLidcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgb3JkaW5hbE9ubHlTY2FsZSA9IG1lcmdlRGVlcChjbG9uZShzY2FsZSksIG9yZGluYWxTY2FsZU1peGluKTtcbmV4cG9ydCB2YXIgdHlwaWNhbFNjYWxlID0gbWVyZ2VEZWVwKGNsb25lKHNjYWxlKSwgb3JkaW5hbFNjYWxlTWl4aW4sIHR5cGljYWxTY2FsZU1peGluKTtcbiIsIi8vIFBhY2thZ2Ugb2YgZGVmaW5pbmcgVmVnYS1saXRlIFNwZWNpZmljYXRpb24ncyBqc29uIHNjaGVtYVxuXG5pbXBvcnQgKiBhcyBzY2hlbWFVdGlsIGZyb20gJy4vc2NoZW1hdXRpbCc7XG5pbXBvcnQge21hcmt9IGZyb20gJy4vbWFyay5zY2hlbWEnO1xuaW1wb3J0IHtjb25maWcsIENvbmZpZ30gZnJvbSAnLi9jb25maWcuc2NoZW1hJztcbmltcG9ydCB7ZGF0YSwgRGF0YX0gZnJvbSAnLi9kYXRhLnNjaGVtYSc7XG5pbXBvcnQge2VuY29kaW5nLCBFbmNvZGluZ30gZnJvbSAnLi9lbmNvZGluZy5zY2hlbWEnO1xuaW1wb3J0IHtNYXJrfSBmcm9tICcuLi9tYXJrJztcblxuZXhwb3J0IGludGVyZmFjZSBTcGVjIHtcbiAgbmFtZT86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIGRhdGE/OiBEYXRhO1xuICBtYXJrPzogTWFyaztcbiAgZW5jb2Rpbmc/OiBFbmNvZGluZztcbiAgY29uZmlnPzogQ29uZmlnO1xufVxuXG4vLyBUT0RPIHJlbW92ZSB0aGlzXG5leHBvcnQge2FnZ3JlZ2F0ZX0gZnJvbSAnLi9maWVsZGRlZi5zY2hlbWEnO1xuXG5leHBvcnQgdmFyIHV0aWwgPSBzY2hlbWFVdGlsO1xuXG4vKiogQHR5cGUgT2JqZWN0IFNjaGVtYSBvZiBhIHZlZ2EtbGl0ZSBzcGVjaWZpY2F0aW9uICovXG5leHBvcnQgdmFyIHNjaGVtYSA9IHtcbiAgJHNjaGVtYTogJ2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hIycsXG4gIGRlc2NyaXB0aW9uOiAnU2NoZW1hIGZvciBWZWdhLUxpdGUgc3BlY2lmaWNhdGlvbicsXG4gIHR5cGU6ICdvYmplY3QnLFxuICByZXF1aXJlZDogWydtYXJrJywgJ2VuY29kaW5nJ10sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIH0sXG4gICAgZGVzY3JpcHRpb246IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgfSxcbiAgICBkYXRhOiBkYXRhLFxuICAgIG1hcms6IG1hcmssXG4gICAgZW5jb2Rpbmc6IGVuY29kaW5nLFxuICAgIGNvbmZpZzogY29uZmlnXG4gIH1cbn07XG5cbi8qKiBJbnN0YW50aWF0ZSBhIHZlcmJvc2Ugdmwgc3BlYyBmcm9tIHRoZSBzY2hlbWEgKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnN0YW50aWF0ZSgpIHtcbiAgcmV0dXJuIHNjaGVtYVV0aWwuaW5zdGFudGlhdGUoc2NoZW1hKTtcbn07XG4iLCJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKGluc3RhbmNlLCBzY2hlbWEpIHtcbiAgcmV0dXJuIG1lcmdlRGVlcChpbnN0YW50aWF0ZShzY2hlbWEpLCBpbnN0YW5jZSk7XG59O1xuXG4vLyBpbnN0YW50aWF0ZSBhIHNjaGVtYVxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbnRpYXRlKHNjaGVtYSkge1xuICB2YXIgdmFsO1xuICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKCdkZWZhdWx0JyBpbiBzY2hlbWEpIHtcbiAgICB2YWwgPSBzY2hlbWEuZGVmYXVsdDtcbiAgICByZXR1cm4gdXRpbC5pc09iamVjdCh2YWwpID8gdXRpbC5kdXBsaWNhdGUodmFsKSA6IHZhbDtcbiAgfSBlbHNlIGlmIChzY2hlbWEudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB7fTtcbiAgICBmb3IgKHZhciBuYW1lIGluIHNjaGVtYS5wcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAoc2NoZW1hLnByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgdmFsID0gaW5zdGFudGlhdGUoc2NoZW1hLnByb3BlcnRpZXNbbmFtZV0pO1xuICAgICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpbnN0YW5jZVtuYW1lXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSBpZiAoc2NoZW1hLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG4vLyByZW1vdmUgYWxsIGRlZmF1bHRzIGZyb20gYW4gaW5zdGFuY2VcbmV4cG9ydCBmdW5jdGlvbiBzdWJ0cmFjdChpbnN0YW5jZSwgZGVmYXVsdHMpIHtcbiAgdmFyIGNoYW5nZXM6IGFueSA9IHt9O1xuICBmb3IgKHZhciBwcm9wIGluIGluc3RhbmNlKSB7XG4gICAgaWYgKGluc3RhbmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICB2YXIgZGVmID0gZGVmYXVsdHNbcHJvcF07XG4gICAgICB2YXIgaW5zID0gaW5zdGFuY2VbcHJvcF07XG4gICAgICAvLyBOb3RlOiBkb2VzIG5vdCBwcm9wZXJseSBzdWJ0cmFjdCBhcnJheXNcbiAgICAgIGlmICghZGVmYXVsdHMgfHwgZGVmICE9PSBpbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnMgPT09ICdvYmplY3QnICYmICF1dGlsLmlzQXJyYXkoaW5zKSAmJiBkZWYpIHtcbiAgICAgICAgICB2YXIgYyA9IHN1YnRyYWN0KGlucywgZGVmKTtcbiAgICAgICAgICBpZiAoIWlzRW1wdHkoYykpIHtcbiAgICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBjO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh1dGlsLmlzQXJyYXkoaW5zKSkge1xuICAgICAgICAgIGlmICh1dGlsLmlzQXJyYXkoZGVmKSkge1xuICAgICAgICAgICAgLy8gY2hlY2sgZWFjaCBpdGVtIGluIHRoZSBhcnJheVxuICAgICAgICAgICAgaWYgKGlucy5sZW5ndGggPT09IGRlZi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdmFyIGVxdWFsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5zW2ldICE9PSBkZWZbaV0pIHtcbiAgICAgICAgICAgICAgICAgIGVxdWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGVxdWFsKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7IC8vIGNvbnRpbnVlIHdpdGggbmV4dCBwcm9wZXJ0eVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBpbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hhbmdlc1twcm9wXSA9IGlucztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY2hhbmdlcztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlZXAoZGVzdCwgLi4uc3JjOiBhbnlbXSkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNyYy5sZW5ndGg7IGkrKykge1xuICAgIGRlc3QgPSBkZWVwTWVyZ2VfKGRlc3QsIHNyY1tpXSk7XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59O1xuXG4vLyByZWN1cnNpdmVseSBtZXJnZXMgc3JjIGludG8gZGVzdFxuZnVuY3Rpb24gZGVlcE1lcmdlXyhkZXN0LCBzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgZm9yICh2YXIgcCBpbiBzcmMpIHtcbiAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzcmNbcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc3JjW3BdICE9PSAnb2JqZWN0JyB8fCBzcmNbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBzcmNbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdFtwXSAhPT0gJ29iamVjdCcgfHwgZGVzdFtwXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IG1lcmdlRGVlcChzcmNbcF0uY29uc3RydWN0b3IgPT09IEFycmF5ID8gW10gOiB7fSwgc3JjW3BdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2VEZWVwKGRlc3RbcF0sIHNyY1twXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXN0O1xufVxuIiwiaW1wb3J0IHtBR0dSRUdBVEVfT1BTfSBmcm9tICcuLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtPUkRJTkFMLCBRVUFOVElUQVRJVkV9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHt0b01hcH0gZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ydCB7XG4gIGZpZWxkOiBzdHJpbmc7XG4gIG9wOiBzdHJpbmc7XG4gIG9yZGVyPzogc3RyaW5nO1xufVxuXG5leHBvcnQgdmFyIHNvcnQgPSB7XG4gIGRlZmF1bHQ6ICdhc2NlbmRpbmcnLFxuICBzdXBwb3J0ZWRUeXBlczogdG9NYXAoW1FVQU5USVRBVElWRSwgT1JESU5BTF0pLFxuICBvbmVPZjogW1xuICAgIHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydhc2NlbmRpbmcnLCAnZGVzY2VuZGluZycsICd1bnNvcnRlZCddXG4gICAgfSxcbiAgICB7IC8vIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYW5vdGhlciBmaWVsZFxuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICByZXF1aXJlZDogWydmaWVsZCcsICdvcCddLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBmaWVsZDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZpZWxkIG5hbWUgdG8gYWdncmVnYXRlIG92ZXIuJ1xuICAgICAgICB9LFxuICAgICAgICBvcDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IEFHR1JFR0FURV9PUFMsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgZmllbGQgbmFtZSB0byBhZ2dyZWdhdGUgb3Zlci4nXG4gICAgICAgIH0sXG4gICAgICAgIG9yZGVyOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydhc2NlbmRpbmcnLCAnZGVzY2VuZGluZyddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIF1cbn07XG4iLCIvKiogbW9kdWxlIGZvciBzaG9ydGhhbmQgKi9cblxuaW1wb3J0IHtFbmNvZGluZ30gZnJvbSAnLi9zY2hlbWEvZW5jb2Rpbmcuc2NoZW1hJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge1NwZWN9IGZyb20gJy4vc2NoZW1hL3NjaGVtYSc7XG5cbmltcG9ydCB7QUdHUkVHQVRFX09QU30gZnJvbSAnLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtUSU1FVU5JVFN9IGZyb20gJy4vdGltZXVuaXQnO1xuaW1wb3J0IHtTSE9SVF9UWVBFLCBUWVBFX0ZST01fU0hPUlRfVFlQRX0gZnJvbSAnLi90eXBlJztcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi9lbmNvZGluZyc7XG5pbXBvcnQge01hcmt9IGZyb20gJy4vbWFyayc7XG5cbmV4cG9ydCBjb25zdCBERUxJTSA9ICd8JztcbmV4cG9ydCBjb25zdCBBU1NJR04gPSAnPSc7XG5leHBvcnQgY29uc3QgVFlQRSA9ICcsJztcbmV4cG9ydCBjb25zdCBGVU5DID0gJ18nO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBzaG9ydGVuKHNwZWM6IFNwZWMpOiBzdHJpbmcge1xuICByZXR1cm4gJ21hcmsnICsgQVNTSUdOICsgc3BlYy5tYXJrICtcbiAgICBERUxJTSArIHNob3J0ZW5FbmNvZGluZyhzcGVjLmVuY29kaW5nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKHNob3J0aGFuZDogc3RyaW5nLCBkYXRhPywgY29uZmlnPykge1xuICBsZXQgc3BsaXQgPSBzaG9ydGhhbmQuc3BsaXQoREVMSU0pLFxuICAgIG1hcmsgPSBzcGxpdC5zaGlmdCgpLnNwbGl0KEFTU0lHTilbMV0udHJpbSgpLFxuICAgIGVuY29kaW5nID0gcGFyc2VFbmNvZGluZyhzcGxpdC5qb2luKERFTElNKSk7XG5cbiAgbGV0IHNwZWM6U3BlYyA9IHtcbiAgICBtYXJrOiBNYXJrW21hcmtdLFxuICAgIGVuY29kaW5nOiBlbmNvZGluZ1xuICB9O1xuXG4gIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICBzcGVjLmRhdGEgPSBkYXRhO1xuICB9XG4gIGlmIChjb25maWcgIT09IHVuZGVmaW5lZCkge1xuICAgIHNwZWMuY29uZmlnID0gY29uZmlnO1xuICB9XG4gIHJldHVybiBzcGVjO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRlbkVuY29kaW5nKGVuY29kaW5nOiBFbmNvZGluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2bEVuY29kaW5nLm1hcChlbmNvZGluZywgZnVuY3Rpb24oZmllbGREZWYsIGNoYW5uZWwpIHtcbiAgICByZXR1cm4gY2hhbm5lbCArIEFTU0lHTiArIHNob3J0ZW5GaWVsZERlZihmaWVsZERlZik7XG4gIH0pLmpvaW4oREVMSU0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VFbmNvZGluZyhlbmNvZGluZ1Nob3J0aGFuZDogc3RyaW5nKTogRW5jb2Rpbmcge1xuICByZXR1cm4gZW5jb2RpbmdTaG9ydGhhbmQuc3BsaXQoREVMSU0pLnJlZHVjZShmdW5jdGlvbihtLCBlKSB7XG4gICAgdmFyIHNwbGl0ID0gZS5zcGxpdChBU1NJR04pLFxuICAgICAgICBlbmN0eXBlID0gc3BsaXRbMF0udHJpbSgpLFxuICAgICAgICBmaWVsZERlZlNob3J0aGFuZCA9IHNwbGl0WzFdO1xuXG4gICAgbVtlbmN0eXBlXSA9IHBhcnNlRmllbGREZWYoZmllbGREZWZTaG9ydGhhbmQpO1xuICAgIHJldHVybiBtO1xuICB9LCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG9ydGVuRmllbGREZWYoZmllbGREZWY6IEZpZWxkRGVmKTogc3RyaW5nIHtcbiAgcmV0dXJuIChmaWVsZERlZi5hZ2dyZWdhdGUgPyBmaWVsZERlZi5hZ2dyZWdhdGUgKyBGVU5DIDogJycpICtcbiAgICAoZmllbGREZWYudGltZVVuaXQgPyBmaWVsZERlZi50aW1lVW5pdCArIEZVTkMgOiAnJykgK1xuICAgIChmaWVsZERlZi5iaW4gPyAnYmluJyArIEZVTkMgOiAnJykgK1xuICAgIChmaWVsZERlZi5maWVsZCB8fCAnJykgKyBUWVBFICsgU0hPUlRfVFlQRVtmaWVsZERlZi50eXBlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3J0ZW5GaWVsZERlZnMoZmllbGREZWZzOiBGaWVsZERlZltdLCBkZWxpbSA9IERFTElNKTogc3RyaW5nIHtcbiAgcmV0dXJuIGZpZWxkRGVmcy5tYXAoc2hvcnRlbkZpZWxkRGVmKS5qb2luKGRlbGltKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRmllbGREZWYoZmllbGREZWZTaG9ydGhhbmQ6IHN0cmluZyk6IEZpZWxkRGVmIHtcbiAgdmFyIHNwbGl0ID0gZmllbGREZWZTaG9ydGhhbmQuc3BsaXQoVFlQRSk7XG5cbiAgdmFyIGZpZWxkRGVmOiBGaWVsZERlZiA9IHtcbiAgICBmaWVsZDogc3BsaXRbMF0udHJpbSgpLFxuICAgIHR5cGU6IFRZUEVfRlJPTV9TSE9SVF9UWVBFW3NwbGl0WzFdLnRyaW0oKV1cbiAgfTtcblxuICAvLyBjaGVjayBhZ2dyZWdhdGUgdHlwZVxuICBmb3IgKGxldCBpID0gMDsgaSA8IEFHR1JFR0FURV9PUFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYSA9IEFHR1JFR0FURV9PUFNbaV07XG4gICAgaWYgKGZpZWxkRGVmLmZpZWxkLmluZGV4T2YoYSArICdfJykgPT09IDApIHtcbiAgICAgIGZpZWxkRGVmLmZpZWxkID0gZmllbGREZWYuZmllbGQuc3Vic3RyKGEubGVuZ3RoICsgMSk7XG4gICAgICBpZiAoYSA9PT0gJ2NvdW50JyAmJiBmaWVsZERlZi5maWVsZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZmllbGREZWYuZmllbGQgPSAnKic7XG4gICAgICB9XG4gICAgICBmaWVsZERlZi5hZ2dyZWdhdGUgPSBhO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBUSU1FVU5JVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdHUgPSBUSU1FVU5JVFNbaV07XG4gICAgaWYgKGZpZWxkRGVmLmZpZWxkICYmIGZpZWxkRGVmLmZpZWxkLmluZGV4T2YodHUgKyAnXycpID09PSAwKSB7XG4gICAgICBmaWVsZERlZi5maWVsZCA9IGZpZWxkRGVmLmZpZWxkLnN1YnN0cihmaWVsZERlZi5maWVsZC5sZW5ndGggKyAxKTtcbiAgICAgIGZpZWxkRGVmLnRpbWVVbml0ID0gdHU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBjaGVjayBiaW5cbiAgaWYgKGZpZWxkRGVmLmZpZWxkICYmIGZpZWxkRGVmLmZpZWxkLmluZGV4T2YoJ2Jpbl8nKSA9PT0gMCkge1xuICAgIGZpZWxkRGVmLmZpZWxkID0gZmllbGREZWYuZmllbGQuc3Vic3RyKDQpO1xuICAgIGZpZWxkRGVmLmJpbiA9IHRydWU7XG4gIH1cblxuICByZXR1cm4gZmllbGREZWY7XG59XG4iLCIvKiBVdGlsaXRpZXMgZm9yIGEgVmVnYS1MaXRlIHNwZWNpZmljaWF0aW9uICovXG5cbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4vc2NoZW1hL2ZpZWxkZGVmLnNjaGVtYSc7XG5pbXBvcnQge1NwZWN9IGZyb20gJy4vc2NoZW1hL3NjaGVtYSc7XG5cbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vY29tcGlsZS9Nb2RlbCc7XG5pbXBvcnQge0NPTE9SLCBTSEFQRX0gZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCAqIGFzIHZsRW5jb2RpbmcgZnJvbSAnLi9lbmNvZGluZyc7XG5pbXBvcnQge0JBUiwgQVJFQX0gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7ZHVwbGljYXRlfSBmcm9tICcuL3V0aWwnO1xuXG4vLyBUT0RPOiBhZGQgdmwuc3BlYy52YWxpZGF0ZSAmIG1vdmUgc3R1ZmYgZnJvbSB2bC52YWxpZGF0ZSB0byBoZXJlXG5cbmV4cG9ydCBmdW5jdGlvbiBhbHdheXNOb09jY2x1c2lvbihzcGVjOiBTcGVjKTogYm9vbGVhbiB7XG4gIC8vIEZJWE1FIHJhdyBPeFEgd2l0aCAjIG9mIHJvd3MgPSAjIG9mIE9cbiAgcmV0dXJuIHZsRW5jb2RpbmcuaXNBZ2dyZWdhdGUoc3BlYy5lbmNvZGluZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWVsZERlZnMoc3BlYzogU3BlYyk6IEZpZWxkRGVmW10ge1xuICAvLyBUT0RPOiByZWZhY3RvciB0aGlzIG9uY2Ugd2UgaGF2ZSBjb21wb3NpdGlvblxuICByZXR1cm4gdmxFbmNvZGluZy5maWVsZERlZnMoc3BlYy5lbmNvZGluZyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xlYW5TcGVjKHNwZWM6IFNwZWMpOiBTcGVjIHtcbiAgLy8gVE9ETzogbW92ZSB0b1NwZWMgdG8gaGVyZSFcbiAgcmV0dXJuIG5ldyBNb2RlbChzcGVjKS50b1NwZWModHJ1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0YWNrKHNwZWM6IFNwZWMpOiBib29sZWFuIHtcbiAgcmV0dXJuICh2bEVuY29kaW5nLmhhcyhzcGVjLmVuY29kaW5nLCBDT0xPUikgfHwgdmxFbmNvZGluZy5oYXMoc3BlYy5lbmNvZGluZywgU0hBUEUpKSAmJlxuICAgIChzcGVjLm1hcmsgPT09IEJBUiB8fCBzcGVjLm1hcmsgPT09IEFSRUEpICYmXG4gICAgKCFzcGVjLmNvbmZpZyB8fCAhc3BlYy5jb25maWcuc3RhY2sgIT09IGZhbHNlKSAmJlxuICAgIHZsRW5jb2RpbmcuaXNBZ2dyZWdhdGUoc3BlYy5lbmNvZGluZyk7XG59XG5cbi8vIFRPRE8gcmV2aXNlXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwb3NlKHNwZWM6IFNwZWMpOiBTcGVjIHtcbiAgdmFyIG9sZGVuYyA9IHNwZWMuZW5jb2RpbmcsXG4gICAgZW5jb2RpbmcgPSBkdXBsaWNhdGUoc3BlYy5lbmNvZGluZyk7XG4gIGVuY29kaW5nLnggPSBvbGRlbmMueTtcbiAgZW5jb2RpbmcueSA9IG9sZGVuYy54O1xuICBlbmNvZGluZy5yb3cgPSBvbGRlbmMuY29sdW1uO1xuICBlbmNvZGluZy5jb2x1bW4gPSBvbGRlbmMucm93O1xuICBzcGVjLmVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIHJldHVybiBzcGVjO1xufVxuIiwiZXhwb3J0IGNvbnN0IFRJTUVVTklUUyA9IFtcbiAgJ3llYXInLCAnbW9udGgnLCAnZGF5JywgJ2RhdGUnLCAnaG91cnMnLCAnbWludXRlcycsICdzZWNvbmRzJywgJ21pbGxpc2Vjb25kcycsXG4gICd5ZWFybW9udGgnLCAneWVhcm1vbnRoZGF5JywgJ3llYXJtb250aGRhdGUnLCAneWVhcmRheScsICd5ZWFyZGF0ZScsICd5ZWFybW9udGhkYXlob3VycycsICd5ZWFybW9udGhkYXlob3Vyc21pbnV0ZXMnLCAnaG91cnNtaW51dGVzJywgJ2hvdXJzbWludXRlc3NlY29uZHMnLCAnbWludXRlc3NlY29uZHMnLCAnc2Vjb25kc21pbGxpc2Vjb25kcydcbl07XG4iLCIvKiogQ29uc3RhbnRzIGFuZCB1dGlsaXRpZXMgZm9yIGRhdGEgdHlwZSAqL1xuXG5leHBvcnQgZW51bSBUeXBlIHtcbiAgUVVBTlRJVEFUSVZFID0gJ3F1YW50aXRhdGl2ZScgYXMgYW55LFxuICBPUkRJTkFMID0gJ29yZGluYWwnIGFzIGFueSxcbiAgVEVNUE9SQUwgPSAndGVtcG9yYWwnIGFzIGFueSxcbiAgTk9NSU5BTCA9ICdub21pbmFsJyBhcyBhbnlcbn1cblxuZXhwb3J0IGNvbnN0IFFVQU5USVRBVElWRSA9IFR5cGUuUVVBTlRJVEFUSVZFO1xuZXhwb3J0IGNvbnN0IE9SRElOQUwgPSBUeXBlLk9SRElOQUw7XG5leHBvcnQgY29uc3QgVEVNUE9SQUwgPSBUeXBlLlRFTVBPUkFMO1xuZXhwb3J0IGNvbnN0IE5PTUlOQUwgPSBUeXBlLk5PTUlOQUw7XG5cbi8qKlxuICogTWFwcGluZyBmcm9tIGZ1bGwgdHlwZSBuYW1lcyB0byBzaG9ydCB0eXBlIG5hbWVzLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGNvbnN0IFNIT1JUX1RZUEUgPSB7XG4gIHF1YW50aXRhdGl2ZTogJ1EnLFxuICB0ZW1wb3JhbDogJ1QnLFxuICBub21pbmFsOiAnTicsXG4gIG9yZGluYWw6ICdPJ1xufTtcbi8qKlxuICogTWFwcGluZyBmcm9tIHNob3J0IHR5cGUgbmFtZXMgdG8gZnVsbCB0eXBlIG5hbWVzLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGNvbnN0IFRZUEVfRlJPTV9TSE9SVF9UWVBFID0ge1xuICBROiBRVUFOVElUQVRJVkUsXG4gIFQ6IFRFTVBPUkFMLFxuICBPOiBPUkRJTkFMLFxuICBOOiBOT01JTkFMXG59O1xuXG4vKipcbiAqIEdldCBmdWxsLCBsb3dlcmNhc2UgdHlwZSBuYW1lIGZvciBhIGdpdmVuIHR5cGUuXG4gKiBAcGFyYW0gIHR5cGVcbiAqIEByZXR1cm4gRnVsbCB0eXBlIG5hbWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdWxsTmFtZSh0eXBlOiBUeXBlKTogVHlwZSB7XG4gIGNvbnN0IHR5cGVTdHJpbmcgPSA8YW55PnR5cGU7ICAvLyBmb3JjZSB0eXBlIGFzIHN0cmluZyBzbyB3ZSBjYW4gdHJhbnNsYXRlIHNob3J0IHR5cGVzXG4gIHJldHVybiBUWVBFX0ZST01fU0hPUlRfVFlQRVt0eXBlU3RyaW5nLnRvVXBwZXJDYXNlKCldIHx8IC8vIHNob3J0IHR5cGUgaXMgdXBwZXJjYXNlIGJ5IGRlZmF1bHRcbiAgICAgICAgIHR5cGVTdHJpbmcudG9Mb3dlckNhc2UoKTtcbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2RhdGFsaWIuZC50c1wiLz5cblxuZXhwb3J0IHtrZXlzLCBleHRlbmQsIGR1cGxpY2F0ZSwgaXNBcnJheSwgdmFscywgdHJ1bmNhdGUsIHRvTWFwLCBpc09iamVjdH0gZnJvbSAnZGF0YWxpYi9zcmMvdXRpbCc7XG5leHBvcnQge3JhbmdlfSBmcm9tICdkYXRhbGliL3NyYy9nZW5lcmF0ZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250YWlucyhhcnJheTogQXJyYXk8YW55PiwgaXRlbTogYW55KSB7XG4gIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pID4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoKG9iaiwgZjogKGEsIGQsIGssIG8pID0+IGFueSwgdGhpc0FyZykge1xuICBpZiAob2JqLmZvckVhY2gpIHtcbiAgICBvYmouZm9yRWFjaC5jYWxsKHRoaXNBcmcsIGYpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGssIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2Uob2JqLCBmOiAoYSwgaSwgZCwgaywgbykgPT4gYW55LCBpbml0LCB0aGlzQXJnPykge1xuICBpZiAob2JqLnJlZHVjZSkge1xuICAgIHJldHVybiBvYmoucmVkdWNlLmNhbGwodGhpc0FyZywgZiwgaW5pdCk7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgaW5pdCA9IGYuY2FsbCh0aGlzQXJnLCBpbml0LCBvYmpba10sIGssIG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbml0O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXAob2JqLCBmOiAoYSwgZCwgaywgbykgPT4gYW55LCB0aGlzQXJnPykge1xuICBpZiAob2JqLm1hcCkge1xuICAgIHJldHVybiBvYmoubWFwLmNhbGwodGhpc0FyZywgZik7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG91dHB1dCA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGssIG9iaikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbnkoYXJyOiBBcnJheTxhbnk+LCBmOiAoZCwgaz8sIGk/KSA9PiBib29sZWFuKSB7XG4gIHZhciBpID0gMDtcbiAgZm9yIChsZXQgayA9IDA7IGs8YXJyLmxlbmd0aDsgaysrKSB7XG4gICAgaWYgKGYoYXJyW2tdLCBrLCBpKyspKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWxsKGFycjogQXJyYXk8YW55PiwgZjogKGQsIGs/LCBpPykgPT4gYm9vbGVhbikge1xuICB2YXIgaSA9IDA7XG4gIGZvciAobGV0IGsgPSAwOyBrPGFyci5sZW5ndGg7IGsrKykge1xuICAgIGlmICghZihhcnJba10sIGssIGkrKykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIEZJWE1FIHJlbW92ZSB0aGlzXG5pbXBvcnQgZGxCaW4gPSByZXF1aXJlKCdkYXRhbGliL3NyYy9iaW5zL2JpbnMnKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRiaW5zKHN0YXRzLCBtYXhiaW5zKSB7XG4gIHJldHVybiBkbEJpbih7XG4gICAgbWluOiBzdGF0cy5taW4sXG4gICAgbWF4OiBzdGF0cy5tYXgsXG4gICAgbWF4YmluczogbWF4Ymluc1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVycm9yKG1lc3NhZ2U6IGFueSkge1xuICBjb25zb2xlLmVycm9yKCdbVkwgRXJyb3JdJywgbWVzc2FnZSk7XG59XG4iLCJpbXBvcnQge1NwZWN9IGZyb20gJy4vc2NoZW1hL3NjaGVtYSc7XG5cbi8vIFRPRE86IG1vdmUgdG8gdmwuc3BlYy52YWxpZGF0b3I/XG5cbmltcG9ydCB7dG9NYXB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge0JBUn0gZnJvbSAnLi9tYXJrJztcblxuaW50ZXJmYWNlIFJlcXVpcmVkQ2hhbm5lbE1hcCB7XG4gIFttYXJrOiBzdHJpbmddOiBBcnJheTxzdHJpbmc+O1xufVxuXG4vKipcbiAqIFJlcXVpcmVkIEVuY29kaW5nIENoYW5uZWxzIGZvciBlYWNoIG1hcmsgdHlwZVxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUkVRVUlSRURfQ0hBTk5FTF9NQVA6IFJlcXVpcmVkQ2hhbm5lbE1hcCA9IHtcbiAgdGV4dDogWyd0ZXh0J10sXG4gIGxpbmU6IFsneCcsICd5J10sXG4gIGFyZWE6IFsneCcsICd5J11cbn07XG5cbmludGVyZmFjZSBTdXBwb3J0ZWRDaGFubmVsTWFwIHtcbiAgW21hcms6IHN0cmluZ106IHtcbiAgICBbY2hhbm5lbDogc3RyaW5nXTogbnVtYmVyXG4gIH07XG59XG5cbi8qKlxuICogU3VwcG9ydGVkIEVuY29kaW5nIENoYW5uZWwgZm9yIGVhY2ggbWFyayB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NVUFBPUlRFRF9DSEFOTkVMX1RZUEU6IFN1cHBvcnRlZENoYW5uZWxNYXAgPSB7XG4gIGJhcjogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdzaXplJywgJ2NvbG9yJywgJ2RldGFpbCddKSxcbiAgbGluZTogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdkZXRhaWwnXSksIC8vIFRPRE86IGFkZCBzaXplIHdoZW4gVmVnYSBzdXBwb3J0c1xuICBhcmVhOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2RldGFpbCddKSxcbiAgdGljazogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdkZXRhaWwnXSksXG4gIGNpcmNsZTogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdzaXplJywgJ2RldGFpbCddKSxcbiAgc3F1YXJlOiB0b01hcChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ3NpemUnLCAnZGV0YWlsJ10pLFxuICBwb2ludDogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdzaXplJywgJ2RldGFpbCcsICdzaGFwZSddKSxcbiAgdGV4dDogdG9NYXAoWydyb3cnLCAnY29sdW1uJywgJ3NpemUnLCAnY29sb3InLCAndGV4dCddKSAvLyBUT0RPKCM3MjQpIHJldmlzZVxufTtcblxuLy8gVE9ETzogY29uc2lkZXIgaWYgd2Ugc2hvdWxkIGFkZCB2YWxpZGF0ZSBtZXRob2QgYW5kXG4vLyByZXF1aXJlcyBaU2NoZW1hIGluIHRoZSBtYWluIHZlZ2EtbGl0ZSByZXBvXG5cbi8qKlxuICogRnVydGhlciBjaGVjayBpZiBlbmNvZGluZyBtYXBwaW5nIG9mIGEgc3BlYyBpcyBpbnZhbGlkIGFuZFxuICogcmV0dXJuIGVycm9yIGlmIGl0IGlzIGludmFsaWQuXG4gKlxuICogVGhpcyBjaGVja3MgaWZcbiAqICgxKSBhbGwgdGhlIHJlcXVpcmVkIGVuY29kaW5nIGNoYW5uZWxzIGZvciB0aGUgbWFyayB0eXBlIGFyZSBzcGVjaWZpZWRcbiAqICgyKSBhbGwgdGhlIHNwZWNpZmllZCBlbmNvZGluZyBjaGFubmVscyBhcmUgc3VwcG9ydGVkIGJ5IHRoZSBtYXJrIHR5cGVcbiAqIEBwYXJhbSAge1t0eXBlXX0gc3BlYyBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtSZXF1aXJlZENoYW5uZWxNYXAgID0gRGVmYXVsdFJlcXVpcmVkQ2hhbm5lbE1hcH0gIHJlcXVpcmVkQ2hhbm5lbE1hcFxuICogQHBhcmFtICB7U3VwcG9ydGVkQ2hhbm5lbE1hcCA9IERlZmF1bHRTdXBwb3J0ZWRDaGFubmVsTWFwfSBzdXBwb3J0ZWRDaGFubmVsTWFwXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFJldHVybiBvbmUgcmVhc29uIHdoeSB0aGUgZW5jb2RpbmcgaXMgaW52YWxpZCxcbiAqICAgICAgICAgICAgICAgICAgb3IgbnVsbCBpZiB0aGUgZW5jb2RpbmcgaXMgdmFsaWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbmNvZGluZ01hcHBpbmdFcnJvcihzcGVjOiBTcGVjLFxuICByZXF1aXJlZENoYW5uZWxNYXA6IFJlcXVpcmVkQ2hhbm5lbE1hcCA9IERFRkFVTFRfUkVRVUlSRURfQ0hBTk5FTF9NQVAsXG4gIHN1cHBvcnRlZENoYW5uZWxNYXA6IFN1cHBvcnRlZENoYW5uZWxNYXAgPSBERUZBVUxUX1NVUFBPUlRFRF9DSEFOTkVMX1RZUEVcbiAgKSB7XG4gIGxldCBtYXJrID0gc3BlYy5tYXJrO1xuICBsZXQgZW5jb2RpbmcgPSBzcGVjLmVuY29kaW5nO1xuICBsZXQgcmVxdWlyZWRDaGFubmVscyA9IHJlcXVpcmVkQ2hhbm5lbE1hcFttYXJrXTtcbiAgbGV0IHN1cHBvcnRlZENoYW5uZWxzID0gc3VwcG9ydGVkQ2hhbm5lbE1hcFttYXJrXTtcblxuICBmb3IgKGxldCBpIGluIHJlcXVpcmVkQ2hhbm5lbHMpIHsgLy8gYWxsIHJlcXVpcmVkIGNoYW5uZWxzIGFyZSBpbiBlbmNvZGluZ2BcbiAgICBpZiAoIShyZXF1aXJlZENoYW5uZWxzW2ldIGluIGVuY29kaW5nKSkge1xuICAgICAgcmV0dXJuICdNaXNzaW5nIGVuY29kaW5nIGNoYW5uZWwgXFxcIicgKyByZXF1aXJlZENoYW5uZWxzW2ldICtcbiAgICAgICAgJ1xcXCIgZm9yIG1hcmsgXFxcIicgKyBtYXJrICsgJ1xcXCInO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGNoYW5uZWwgaW4gZW5jb2RpbmcpIHsgLy8gYWxsIGNoYW5uZWxzIGluIGVuY29kaW5nIGFyZSBzdXBwb3J0ZWRcbiAgICBpZiAoIXN1cHBvcnRlZENoYW5uZWxzW2NoYW5uZWxdKSB7XG4gICAgICByZXR1cm4gJ0VuY29kaW5nIGNoYW5uZWwgXFxcIicgKyBjaGFubmVsICtcbiAgICAgICAgJ1xcXCIgaXMgbm90IHN1cHBvcnRlZCBieSBtYXJrIHR5cGUgXFxcIicgKyBtYXJrICsgJ1xcXCInO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtYXJrID09PSBCQVIgJiYgIWVuY29kaW5nLnggJiYgIWVuY29kaW5nLnkpIHtcbiAgICByZXR1cm4gJ01pc3NpbmcgYm90aCB4IGFuZCB5IGZvciBiYXInO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCJpbXBvcnQgKiBhcyB2bEJpbiBmcm9tICcuL2Jpbic7XG5pbXBvcnQgKiBhcyB2bENoYW5uZWwgZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCAqIGFzIHZsRGF0YSBmcm9tICcuL2RhdGEnO1xuaW1wb3J0ICogYXMgdmxFbmNvZGluZyBmcm9tICcuL2VuY29kaW5nJztcbmltcG9ydCAqIGFzIHZsRmllbGREZWYgZnJvbSAnLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyB2bENvbXBpbGUgZnJvbSAnLi9jb21waWxlL2NvbXBpbGUnO1xuaW1wb3J0ICogYXMgdmxTY2hlbWEgZnJvbSAnLi9zY2hlbWEvc2NoZW1hJztcbmltcG9ydCAqIGFzIHZsU2hvcnRoYW5kIGZyb20gJy4vc2hvcnRoYW5kJztcbmltcG9ydCAqIGFzIHZsU3BlYyBmcm9tICcuL3NwZWMnO1xuaW1wb3J0ICogYXMgdmxUaW1lVW5pdCBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCAqIGFzIHZsVHlwZSBmcm9tICcuL3R5cGUnO1xuaW1wb3J0ICogYXMgdmxWYWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlJztcbmltcG9ydCAqIGFzIHZsVXRpbCBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgYmluID0gdmxCaW47XG5leHBvcnQgY29uc3QgY2hhbm5lbCA9IHZsQ2hhbm5lbDtcbmV4cG9ydCBjb25zdCBjb21waWxlID0gdmxDb21waWxlLmNvbXBpbGU7XG5leHBvcnQgY29uc3QgZGF0YSA9IHZsRGF0YTtcbmV4cG9ydCBjb25zdCBlbmNvZGluZyA9IHZsRW5jb2Rpbmc7XG5leHBvcnQgY29uc3QgZmllbGREZWYgPSB2bEZpZWxkRGVmO1xuZXhwb3J0IGNvbnN0IHNjaGVtYSA9IHZsU2NoZW1hO1xuZXhwb3J0IGNvbnN0IHNob3J0aGFuZCA9IHZsU2hvcnRoYW5kO1xuZXhwb3J0IGNvbnN0IHNwZWMgPSB2bFNwZWM7XG5leHBvcnQgY29uc3QgdGltZVVuaXQgPSB2bFRpbWVVbml0O1xuZXhwb3J0IGNvbnN0IHR5cGUgPSB2bFR5cGU7XG5leHBvcnQgY29uc3QgdXRpbCA9IHZsVXRpbDtcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZSA9IHZsVmFsaWRhdGU7XG5cbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJ19fVkVSU0lPTl9fJztcbiJdfQ==
