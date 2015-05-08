!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.vl=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var globals = require('./globals'),
    util = require('./util'),
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

},{"./Encoding":22,"./compile/compile":26,"./consts":40,"./data":41,"./enc":42,"./field":43,"./globals":44,"./schema/schema":45,"./util":47}],2:[function(require,module,exports){

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

},{"./date-units":5,"./util":21}],5:[function(require,module,exports){
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

},{"./util":21}],6:[function(require,module,exports){
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
var stats = require('./stats');
var util = require('./util');
var bin = require('./bin');
var gen = require('./generate');

module.exports = function(values, f, options) {
  if (options === undefined && !util.isFunction(f)) { options = f; f = null; }

  var type = options && options.type || infer(values, f);
  if (type !== 'number' && type !== 'date' && type !== 'integer') {
    return categorical(values, f, options && options.sort);
  }

  var ext = stats.extent(values, f),
      opt = util.extend({min: ext[0], max: ext[1]}, options);
  if (type === 'integer' && opt.minstep == null) opt.minstep = 1;
  var b = type === 'date' ? bin.date(opt) : bin(opt);
  return numerical(values, f, b);
};

function infer(values, f) {
  var v = null, i;

  // if data array has type annotations, use them
  if (values.types) {
    v = f(values.types);
    if (util.isString(v)) return v;
  }

  for (i=0; !util.isNotNull(v) && i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
  }
  return util.isDate(v) ? 'date' : util.isNumber(v) ? 'number' : 'string';
}

function numerical(values, f, b) {
  var h = gen.range(b.start, b.stop + b.step/2, b.step)
    .map(function(v) { return {value: b.value(v), count: 0}; });

  for (var i=0, v, j; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isNotNull(v)) {
      j = b.index(v);
      if (j < 0 || j >= h.length || !isFinite(j)) continue;
      h[j].count += 1;
    }
  }
  h.bins = b;
  return h;
}

function categorical(values, f, sort) {
  var c = stats.unique(values, f).counts;
  return util.keys(c)
    .map(function(k) { return {value: k, count: c[k]}; })
    .sort(util.comparator(sort ? "-count" : "+value"));
}
},{"./bin":4,"./generate":6,"./stats":18,"./util":21}],8:[function(require,module,exports){
(function (global){
var d3 = (typeof window !== "undefined" ? window.d3 : typeof global !== "undefined" ? global.d3 : null);

module.exports = function(data, format) {
  var d = d3.csv.parse(data ? data.toString() : data);
  return d;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
module.exports = {
  json: require('./json'),
  csv: require('./csv'),
  tsv: require('./tsv'),
  topojson: require('./topojson'),
  treejson: require('./treejson')
};
},{"./csv":8,"./json":10,"./topojson":11,"./treejson":12,"./tsv":13}],10:[function(require,module,exports){
var util = require('../../util');

module.exports = function(data, format) {
  var d = util.isObject(data) && !util.isBuffer(data)
    ? data : JSON.parse(data);
  if (format && format.property) {
    d = util.accessor(format.property)(d);
  }
  return d;
};

},{"../../util":21}],11:[function(require,module,exports){
(function (global){
var json = require('./json');
var topojson = (typeof window !== "undefined" ? window.topojson : typeof global !== "undefined" ? global.topojson : null);

module.exports = function(data, format) {
  if (topojson == null) { throw Error("TopoJSON library not loaded."); }

  var t = json(data, format), obj;

  if (format && format.feature) {
    if (obj = t.objects[format.feature]) {
      return topojson.feature(t, obj).features
    } else {
      throw Error("Invalid TopoJSON object: "+format.feature);
    }
  } else if (format && format.mesh) {
    if (obj = t.objects[format.mesh]) {
      return [topojson.mesh(t, t.objects[format.mesh])];
    } else {
      throw Error("Invalid TopoJSON object: " + format.mesh);
    }
  } else {
    throw Error("Missing TopoJSON feature or mesh parameter.");
  }

  return [];
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./json":10}],12:[function(require,module,exports){
var json = require('./json');

module.exports = function(data, format) {
  data = json(data, format);
  return toTable(data, (format && format.children));
};

function toTable(root, childrenField) {
  childrenField = childrenField || "children";
  var table = [];
  
  function visit(node, parent) {
    table.push(node);
    var children = node[childrenField];
    if (children) {
      for (var i=0; i<children.length; ++i) {
        visit(children[i], node);
      }
    }
  }
  
  visit(root, null);
  return (table.root = root, table);
}
},{"./json":10}],13:[function(require,module,exports){
(function (global){
var d3 = (typeof window !== "undefined" ? window.d3 : typeof global !== "undefined" ? global.d3 : null);

module.exports = function(data, format) {
  var d = d3.tsv.parse(data ? data.toString() : data);
  return d;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],14:[function(require,module,exports){
var util = require('../util');

// Matches absolute URLs with optional protocol
//   https://...    file://...    //...
var protocol_re = /^([A-Za-z]+:)?\/\//;

// Special treatment in node.js for the file: protocol
var fileProtocol = 'file://';

// Validate and cleanup URL to ensure that it is allowed to be accessed
// Returns cleaned up URL, or false if access is not allowed
function sanitizeUrl(opt) {
  var url = opt.url;
  if (!url && opt.file) { return fileProtocol + opt.file; }

  // In case this is a relative url (has no host), prepend opt.baseURL
  if (opt.baseURL && !protocol_re.test(url)) {
    if (!util.startsWith(url, '/') && opt.baseURL[opt.baseURL.length-1] !== '/') {
      url = '/' + url; // Ensure that there is a slash between the baseURL (e.g. hostname) and url
    }
    url = opt.baseURL + url;
  }
  // relative protocol, starts with '//'
  if (util.isNode && util.startsWith(url, '//')) {
    url = (opt.defaultProtocol || 'http') + ':' + url;
  }
  // If opt.domainWhiteList is set, only allows url, whose hostname
  // * Is the same as the origin (window.location.hostname)
  // * Equals one of the values in the whitelist
  // * Is a proper subdomain of one of the values in the whitelist
  if (opt.domainWhiteList) {
    var domain, origin;
    if (util.isNode) {
      // relative protocol is broken: https://github.com/defunctzombie/node-url/issues/5
      var parts = require('url').parse(url);
      domain = parts.hostname;
      origin = null;
    } else {
      var a = document.createElement('a');
      a.href = url;
      // From http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
      // IE doesn't populate all link properties when setting .href with a relative URL,
      // however .href will return an absolute URL which then can be used on itself
      // to populate these additional fields.
      if (a.host == "") {
        a.href = a.href;
      }
      domain = a.hostname.toLowerCase();
      origin = window.location.hostname;
    }

    if (origin !== domain) {
      var whiteListed = opt.domainWhiteList.some(function (d) {
        var idx = domain.length - d.length;
        return d === domain ||
          (idx > 1 && domain[idx-1] === '.' && domain.lastIndexOf(d) === idx);
      });
      if (!whiteListed) {
        throw 'URL is not whitelisted: ' + url;
      }
    }
  }
  return url;
}

function load(opt, callback) {
  var error = callback || function(e) { throw e; };
  
  try {
    var url = load.sanitizeUrl(opt); // enable override
  } catch (err) {
    error(err);
    return;
  }

  if (!url) {
    error('Invalid URL: ' + url);
  } else if (!util.isNode) {
    // in browser, use xhr
    return xhr(url, callback);
  } else if (util.startsWith(url, fileProtocol)) {
    // in node.js, if url starts with 'file://', strip it and load from file
    return file(url.slice(fileProtocol.length), callback);
  } else {
    // for regular URLs in node.js
    return http(url, callback);
  }
}

function xhrHasResponse(request) {
  var type = request.responseType;
  return type && type !== "text"
      ? request.response // null on error
      : request.responseText; // "" on error
}

function xhr(url, callback) {
  var async = !!callback;
  var request = new XMLHttpRequest;
  // If IE does not support CORS, use XDomainRequest (copied from d3.xhr)
  if (this.XDomainRequest
      && !("withCredentials" in request)
      && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest;

  function respond() {
    var status = request.status;
    if (!status && xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
      callback(null, request.responseText);
    } else {
      callback(request, null);
    }
  }

  if (async) {
    "onload" in request
      ? request.onload = request.onerror = respond
      : request.onreadystatechange = function() { request.readyState > 3 && respond(); };
  }
  
  request.open("GET", url, async);
  request.send();
  
  if (!async && xhrHasResponse(request)) {
    return request.responseText;
  }
}

function file(file, callback) {
  var fs = require('fs');
  if (!callback) {
    return fs.readFileSync(file, 'utf8');
  }
  require('fs').readFile(file, callback);
}

function http(url, callback) {
  if (!callback) {
    return require('sync-request')('GET', url).getBody();
  }
  require('request')(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(null, body);
    } else {
      callback(error, null);
    }
  });
}

load.sanitizeUrl = sanitizeUrl;

module.exports = load;

},{"../util":21,"fs":2,"request":2,"sync-request":2,"url":2}],15:[function(require,module,exports){
var util = require('../util');
var load = require('./load');
var read = require('./read');

module.exports = util
  .keys(read.formats)
  .reduce(function(out, type) {
    out[type] = function(opt, format, callback) {
      // process arguments
      if (util.isString(opt)) opt = {url: opt};
      if (arguments.length === 2 && util.isFunction(format)) {
        callback = format;
        format = undefined;
      }

      // set up read format
      format = util.extend({parse: 'auto'}, format);
      format.type = type;

      // load data
      var data = load(opt, callback ? function(error, data) {
        if (error) callback(error, null);
        try {
          // data loaded, now parse it (async)
          data = read(data, format);
        } catch (e) {
          callback(e, null);
        }
        callback(null, data);
      } : undefined);
      
      // data loaded, now parse it (sync)
      if (data) return read(data, format);
    };
    return out;
  }, {});

},{"../util":21,"./load":14,"./read":16}],16:[function(require,module,exports){
var util = require('../util');
var formats = require('./formats');

var PARSERS = {
  boolean: util.boolean,
  integer: util.number,
  number:  util.number,
  date:    util.date,
  string:  util.identity
};

var TESTS = {
  boolean: function(x) { return x==="true" || x==="false" || util.isBoolean(x); },
  integer: function(x) { return TESTS.number(x) && (x=+x) === ~~x; },
  number: function(x) { return !isNaN(+x) && !util.isDate(x); },
  date: function(x) { return !isNaN(Date.parse(x)); }
};

function read(data, format) {
  var type = (format && format.type) || "json";
  data = formats[type](data, format);
  if (format && format.parse) parse(data, format.parse);
  return data;
}

function infer_type(values, f) {
  var i, j, v;

  // types to test for, in precedence order
  var types = ['boolean', 'integer', 'number', 'date'];

  for (i=0; i<values.length; ++i) {
    // get next value to test
    v = f ? f(values[i]) : values[i];
    // test value against remaining types
    for (j=0; j<types.length; ++j) {
      if (util.isNotNull(v) && !TESTS[types[j]](v)) {
        types.splice(j, 1);
        j -= 1;
      }
    }
    // if no types left, return 'string'
    if (types.length === 0) return 'string';
  }

  return types[0];
}

function infer_types(data, fields) {
  fields = fields || util.keys(data[0]);
  return fields.reduce(function(types, f) {
    var type = infer_type(data, util.accessor(f));
    if (PARSERS[type]) types[f] = type;
    return types;
  }, {});
}

function parse(data, types) {
  var cols, parsers, d, i, j, clen, len = data.length;

  types = (types==='auto') ? infer_types(data) : util.duplicate(types);
  cols = util.keys(types);
  parsers = cols.map(function(c) { return PARSERS[types[c]]; });

  for (i=0, clen=cols.length; i<len; ++i) {
    d = data[i];
    for (j=0; j<clen; ++j) {
      d[cols[j]] = parsers[j](d[cols[j]]);
    }
  }
  data.types = types;
}

read.type = infer_type;
read.types = infer_types;
read.formats = formats;
read.parse = parse;
module.exports = read;

},{"../util":21,"./formats":9}],17:[function(require,module,exports){
var util = require('./util');

var dl = {
  load:      require('./import/load'),
  read:      require('./import/read'),
  bin:       require('./bin'),
  histogram: require('./histogram'),
  summary:   require('./summary'),
  template:  require('./template'),
  dateunits: require('./date-units')
};

util.extend(dl, util);
util.extend(dl, require('./generate'));
util.extend(dl, require('./stats'));
util.extend(dl, require('./import/loaders'));

module.exports = dl;
},{"./bin":4,"./date-units":5,"./generate":6,"./histogram":7,"./import/load":14,"./import/loaders":15,"./import/read":16,"./stats":18,"./summary":19,"./template":20,"./util":21}],18:[function(require,module,exports){
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
    v = (typeof v === 'string') ? v.length : v;
    if (util.isNotNull(v)) { a = b = v; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    v = (typeof v === 'string') ? v.length : v;
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
    v = (typeof v === 'string') ? v.length : v;
    if (util.isNotNull(v)) { a = b = v; x = y = i; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    v = (typeof v === 'string') ? v.length : v;
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
      // update stats
      x = (typeof v === 'string') ? v.length : v;
      if (min===null || x < min) min = x;
      if (max===null || x > max) max = x;

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
},{"./generate":6,"./util":21}],19:[function(require,module,exports){
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
},{"./stats":18,"./util":21}],20:[function(require,module,exports){
(function (global){
var util = require('./util');
var d3 = (typeof window !== "undefined" ? window.d3 : typeof global !== "undefined" ? global.d3 : null);

var context = {
  formats:    [],
  format_map: {},
  truncate:   util.truncate
};

function template(text) {
  var src = source(text, "d");
  src = "var __t; return " + src + ";";

  try {
    return (new Function("d", src)).bind(context);
  } catch (e) {
    e.source = src;
    throw e;
  }
}

module.exports = template;

// clear cache of format objects
// can *break* prior template functions, so invoke with care
template.clearFormatCache = function() {
  context.formats = [];
  context.format_map = {};
};

function source(text, variable) {
  variable = variable || "obj";
  var index = 0;
  var src = "'";
  var regex = template_re;

  // Compile the template source, escaping string literals appropriately.
  text.replace(regex, function(match, interpolate, offset) {
    src += text
      .slice(index, offset)
      .replace(template_escaper, template_escapeChar);
    index = offset + match.length;

    if (interpolate) {
      src += "'\n+((__t=("
        + template_var(interpolate, variable)
        + "))==null?'':__t)+\n'";
    }

    // Adobe VMs need the match returned to produce the correct offest.
    return match;
  });
  return src + "'";
}

function template_var(text, variable) {
  var filters = text.split('|');
  var prop = filters.shift().trim();
  var format = [];
  var stringCast = true;
  
  function strcall(fn) {
    fn = fn || "";
    if (stringCast) {
      stringCast = false;
      src = "String(" + src + ")" + fn;
    } else {
      src += fn;
    }
    return src;
  }
  
  var src = util.field(prop).map(util.str).join("][");
  src = variable + "[" + src + "]";
  
  for (var i=0; i<filters.length; ++i) {
    var f = filters[i], args = null, pidx, a, b;

    if ((pidx=f.indexOf(':')) > 0) {
      f = f.slice(0, pidx);
      args = filters[i].slice(pidx+1).split(',')
        .map(function(s) { return s.trim(); });
    }
    f = f.trim();

    switch (f) {
      case 'length':
        strcall('.length');
        break;
      case 'lower':
        strcall('.toLowerCase()');
        break;
      case 'upper':
        strcall('.toUpperCase()');
        break;
      case 'lower-locale':
        strcall('.toLocaleLowerCase()');
        break;
      case 'upper-locale':
        strcall('.toLocaleUpperCase()');
        break;
      case 'trim':
        strcall('.trim()');
        break;
      case 'left':
        a = util.number(args[0]);
        strcall('.slice(0,' + a + ')');
        break;
      case 'right':
        a = util.number(args[0]);
        strcall('.slice(-' + a +')');
        break;
      case 'mid':
        a = util.number(args[0]);
        b = a + util.number(args[1]);
        strcall('.slice(+'+a+','+b+')');
        break;
      case 'slice':
        a = util.number(args[0]);
        strcall('.slice('+ a
          + (args.length > 1 ? ',' + util.number(args[1]) : '')
          + ')');
        break;
      case 'truncate':
        a = util.number(args[0]);
        b = args[1];
        b = (b!=="left" && b!=="middle" && b!=="center") ? "right" : b;
        src = 'this.truncate(' + strcall() + ',' + a + ',"' + b + '")';
        break;
      case 'number':
        a = template_format(args[0], d3.format);
        stringCast = false;
        src = 'this.formats['+a+']('+src+')';
        break;
      case 'time':
        a = template_format(args[0], d3.time.format);
        stringCast = false;
        src = 'this.formats['+a+']('+src+')';
        break;
      default:
        throw Error("Unrecognized template filter: " + f);
    }
  }

  return src;
}

var template_re = /\{\{(.+?)\}\}|$/g;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var template_escapes = {
  "'":      "'",
  '\\':     '\\',
  '\r':     'r',
  '\n':     'n',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var template_escaper = /\\|'|\r|\n|\u2028|\u2029/g;

function template_escapeChar(match) {
  return '\\' + template_escapes[match];
}

function template_format(pattern, fmt) {
  if ((pattern[0] === "'" && pattern[pattern.length-1] === "'") ||
      (pattern[0] !== '"' && pattern[pattern.length-1] === '"')) {
    pattern = pattern.slice(1, -1);
  } else {
    throw Error("Format pattern must be quoted: " + pattern);
  }
  if (!context.format_map[pattern]) {
    var f = fmt(pattern);
    var i = context.formats.length;
    context.formats.push(f);
    context.format_map[pattern] = i;
  }
  return context.format_map[pattern];
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./util":21}],21:[function(require,module,exports){
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

},{"_process":3,"buffer":2}],22:[function(require,module,exports){
'use strict';

var globals = require('./globals'),
  consts = require('./consts'),
  util = require('./util'),
  vlfield = require('./field'),
  vlenc = require('./enc'),
  schema = require('./schema/schema'),
  time = require('./compile/time');

var Encoding = module.exports = (function() {

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

    if (this._enc[et].aggr === 'count') {
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

  Encoding.alwaysNoOcclusion = function(spec, stats) {
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

  proto.config = function(name) {
    return this._config[name];
  };

  proto.toSpec = function(excludeConfig) {
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

},{"./compile/time":39,"./consts":40,"./enc":42,"./field":43,"./globals":44,"./schema/schema":45,"./util":47}],23:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util');

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

  if (meas.length > 0 && !opt.preaggregatedData) {
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

},{"../globals":44,"../util":47}],24:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util'),
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
        stroke: { value: encoding.config('cellGridColor') }
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
        stroke: { value: encoding.config('cellGridColor') }
      });
    } else {
      setter(def, ['properties', 'grid', 'stroke'], {
        value: encoding.config('gridColor')
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

},{"../globals":44,"../util":47,"./time":39}],25:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util');

module.exports = binning;

function binning(spec, encoding, opt) {
  opt = opt || {};
  var bins = {};

  if (opt.preaggregatedData) {
    return;
  }

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

},{"../globals":44,"../util":47}],26:[function(require,module,exports){
'use strict';

var globals = require('../globals');

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

  var preaggregatedData = !!encoding.data('vegaServer');

  for (var i = 0; i < mdefs.length; i++) {
    group.marks.push(mdefs[i]);
  }

  compile.bin(spec.data[1], encoding, {preaggregatedData: preaggregatedData});

  var lineType = marks[encoding.marktype()].line;

  if (!preaggregatedData) {
    spec = compile.time(spec, encoding);
  }

  // handle subfacets
  var aggResult = compile.aggregate(spec, encoding, {preaggregatedData: preaggregatedData}),
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


},{"../Encoding":22,"../globals":44,"./aggregate":23,"./axis":24,"./bin":25,"./facet":27,"./filter":28,"./group":29,"./layout":30,"./legend":31,"./marks":32,"./scale":33,"./sort":34,"./stack":35,"./style":36,"./subfacet":37,"./template":38,"./time":39}],27:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util');

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

},{"../globals":44,"../util":47,"./axis":24,"./group":29,"./scale":33}],28:[function(require,module,exports){
'use strict';

var globals = require('../globals');

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


},{"../globals":44}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util'),
  setter = util.setter,
  schema = require('../schema/schema'),
  time = require('./time'),
  vlfield = require('../field');

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

},{"../field":43,"../globals":44,"../schema/schema":45,"../util":47,"./time":39}],31:[function(require,module,exports){
'use strict';

var global = require('../globals'),
  time = require('./time');

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
      console.error('Vegalite currently only supports two legends');
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

},{"../globals":44,"./time":39}],32:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util'),
  vlscale = require('./scale');

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

function line_props(e, layout, style) {
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

},{"../globals":44,"../util":47,"./scale":33}],33:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util'),
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

},{"../globals":44,"../util":47,"./time":39}],34:[function(require,module,exports){
'use strict';

var globals = require('../globals');

module.exports = addSortTransforms;

// adds new transforms that produce sorted fields
function addSortTransforms(spec, encoding, stats, opt) {
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

},{"../globals":44}],35:[function(require,module,exports){
"use strict";

var globals = require('../globals'),
  util = require('../util'),
  marks = require('./marks');

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

},{"../globals":44,"../util":47,"./marks":32}],36:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util'),
  vlfield = require('../field'),
  Encoding = require('../Encoding');

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


},{"../Encoding":22,"../field":43,"../globals":44,"../util":47}],37:[function(require,module,exports){
'use strict';

var global = require('../globals');

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

},{"../globals":44,"./group":29}],38:[function(require,module,exports){
'use strict';

var globals = require('../globals');

var groupdef = require('./group').def,
  vldata = require('../data');

module.exports = template;

function template(encoding, layout, stats) { //hack use stats

  var data = {name: RAW, format: {type: encoding.data('formatType')}},
    table = {name: TABLE, source: RAW},
    dataUrl = vldata.getUrl(encoding, stats);
  if (dataUrl) data.url = dataUrl;

  var preaggregatedData = !!encoding.data('vegaServer');

  encoding.forEach(function(field, encType) {
    var name;
    if (field.type == T) {
      data.format.parse = data.format.parse || {};
      data.format.parse[field.name] = 'date';
    } else if (field.type == Q) {
      data.format.parse = data.format.parse || {};
      if (field.aggr === 'count') {
        name = 'count';
      } else if (preaggregatedData && field.bin) {
        name = 'bin_' + field.name;
      } else if (preaggregatedData && field.aggr) {
        name = field.aggr + '_' + field.name;
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

},{"../data":41,"../globals":44,"./group":29}],39:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util');

module.exports = time;

function time(spec, encoding, opt) {
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



},{"../globals":44,"../util":47}],40:[function(require,module,exports){
'use strict';

var globals = require('./globals');

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

},{"./globals":44}],41:[function(require,module,exports){
'use strict';

var dl = require('datalib');

var vldata = module.exports = {},
  vlfield = require('./field'),
  util = require('./util');

vldata.getUrl = function getDataUrl(encoding, stats) {
  if (!encoding.data('vegaServer')) {
    // don't use vega server
    return encoding.data('url');
  }

  if (encoding.length() === 0) {
    // no fields
    return;
  }

  var fields = [];
  encoding.forEach(function(field, encType) {
    var obj = {
      name: encoding.field(encType, true),
      field: field.name
    };
    if (field.aggr) {
      obj.aggr = field.aggr;
    }
    if (field.bin) {
      obj.binSize = util.getbins(stats[field.name], encoding.bin(encType).maxbins).step;
    }
    fields.push(obj);
  });

  var query = {
    table: encoding.data('vegaServer').table,
    fields: fields
  };

  return encoding.data('vegaServer').url + '/query/?q=' + JSON.stringify(query);
};

/** Mapping from datalib's inferred type to vegalite's type */
vldata.types = {
  'boolean': 'O',
  'number': 'Q',
  'integer': 'Q',
  'date': 'T',
  'string': 'O'
};

vldata.getStats = function(data) {
  var stats = {},
    fields = util.keys(data[0]);

  fields.forEach(function(k) {
    var stat = dl.profile(data, function(d) {
      return d[k];
    });

    var sample = {};
    while(Object.keys(sample).length < Math.min(stat.distinct, 10)) {
      var value = data[Math.floor(Math.random() * data.length)][k];
      sample[value] = true;
    }
    stat.sample = Object.keys(sample);

    stats[k] = stat;
  });

  stats.count = data.length;
  return stats;
};

},{"./field":43,"./util":47,"datalib":17}],42:[function(require,module,exports){
// utility for enc

'use strict';

var consts = require('./consts'),
  c = consts.shorthand,
  time = require('./compile/time'),
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
  var r = init, i = 0, k;
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
  return vlenc.reduce(enc, function (m, field, encType) {
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
},{"./compile/time":39,"./consts":40,"./field":43,"./schema/schema":45,"./util":47}],43:[function(require,module,exports){
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

},{"./compile/time":39,"./consts":40,"./schema/schema":45,"./util":47}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
// Package of defining Vegalite Specification's json schema
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
    vegaServer: {
      type: 'object',
      default: null,
      properties: {
        table: {
          type: 'string',
          default: undefined
        },
        url: {
          type: 'string',
          default: 'http://localhost:3001'
        }
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
      default: '#eeeeee'
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
      default: '#aaaaaa'
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

/** @type Object Schema of a vegalite specification */
schema.schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: 'Schema for vegalite specification',
  type: 'object',
  required: ['marktype', 'enc', 'data', 'config'],
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

},{"../util":47,"./schemautil":46}],46:[function(require,module,exports){
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
},{"../util":47}],47:[function(require,module,exports){
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


},{"datalib/src/bin":4,"datalib/src/generate":6,"datalib/src/util":21}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdmwiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9iaW4uanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvZGF0ZS11bml0cy5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9nZW5lcmF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhbGliL3NyYy9oaXN0b2dyYW0uanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvaW1wb3J0L2Zvcm1hdHMvY3N2LmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2ltcG9ydC9mb3JtYXRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2ltcG9ydC9mb3JtYXRzL2pzb24uanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvaW1wb3J0L2Zvcm1hdHMvdG9wb2pzb24uanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvaW1wb3J0L2Zvcm1hdHMvdHJlZWpzb24uanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvaW1wb3J0L2Zvcm1hdHMvdHN2LmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2ltcG9ydC9sb2FkLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2ltcG9ydC9sb2FkZXJzLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2ltcG9ydC9yZWFkLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL3N0YXRzLmpzIiwibm9kZV9tb2R1bGVzL2RhdGFsaWIvc3JjL3N1bW1hcnkuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvdGVtcGxhdGUuanMiLCJub2RlX21vZHVsZXMvZGF0YWxpYi9zcmMvdXRpbC5qcyIsInNyYy9FbmNvZGluZy5qcyIsInNyYy9jb21waWxlL2FnZ3JlZ2F0ZS5qcyIsInNyYy9jb21waWxlL2F4aXMuanMiLCJzcmMvY29tcGlsZS9iaW4uanMiLCJzcmMvY29tcGlsZS9jb21waWxlLmpzIiwic3JjL2NvbXBpbGUvZmFjZXQuanMiLCJzcmMvY29tcGlsZS9maWx0ZXIuanMiLCJzcmMvY29tcGlsZS9ncm91cC5qcyIsInNyYy9jb21waWxlL2xheW91dC5qcyIsInNyYy9jb21waWxlL2xlZ2VuZC5qcyIsInNyYy9jb21waWxlL21hcmtzLmpzIiwic3JjL2NvbXBpbGUvc2NhbGUuanMiLCJzcmMvY29tcGlsZS9zb3J0LmpzIiwic3JjL2NvbXBpbGUvc3RhY2suanMiLCJzcmMvY29tcGlsZS9zdHlsZS5qcyIsInNyYy9jb21waWxlL3N1YmZhY2V0LmpzIiwic3JjL2NvbXBpbGUvdGVtcGxhdGUuanMiLCJzcmMvY29tcGlsZS90aW1lLmpzIiwic3JjL2NvbnN0cy5qcyIsInNyYy9kYXRhLmpzIiwic3JjL2VuYy5qcyIsInNyYy9maWVsZC5qcyIsInNyYy9nbG9iYWxzLmpzIiwic3JjL3NjaGVtYS9zY2hlbWEuanMiLCJzcmMvc2NoZW1hL3NjaGVtYXV0aWwuanMiLCJzcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDamJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNW1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKSxcbiAgICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gICAgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKTtcblxudmFyIHZsID0ge307XG5cbnV0aWwuZXh0ZW5kKHZsLCBjb25zdHMsIHV0aWwpO1xuXG52bC5FbmNvZGluZyA9IHJlcXVpcmUoJy4vRW5jb2RpbmcnKTtcbnZsLmNvbXBpbGUgPSByZXF1aXJlKCcuL2NvbXBpbGUvY29tcGlsZScpO1xudmwuZGF0YSA9IHJlcXVpcmUoJy4vZGF0YScpO1xudmwuZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyk7XG52bC5lbmMgPSByZXF1aXJlKCcuL2VuYycpO1xudmwuc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEvc2NoZW1hJyk7XG52bC50b1Nob3J0aGFuZCA9IHZsLkVuY29kaW5nLnNob3J0aGFuZDtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHZsO1xuIixudWxsLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciB1bml0cyA9IHJlcXVpcmUoJy4vZGF0ZS11bml0cycpO1xudmFyIEVQU0lMT04gPSAxZS0xNTtcblxuZnVuY3Rpb24gYmluKG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG5cbiAgLy8gZGV0ZXJtaW5lIHJhbmdlXG4gIHZhciBtYXhiID0gb3B0Lm1heGJpbnMgfHwgMTUsXG4gICAgICBiYXNlID0gb3B0LmJhc2UgfHwgMTAsXG4gICAgICBsb2diID0gTWF0aC5sb2coYmFzZSksXG4gICAgICBkaXYgPSBvcHQuZGl2IHx8IFs1LCAyXSwgICAgICBcbiAgICAgIG1pbiA9IG9wdC5taW4sXG4gICAgICBtYXggPSBvcHQubWF4LFxuICAgICAgc3BhbiA9IG1heCAtIG1pbixcbiAgICAgIHN0ZXAsIGxvZ2IsIGxldmVsLCBtaW5zdGVwLCBwcmVjaXNpb24sIHYsIGksIGVwcztcblxuICBpZiAob3B0LnN0ZXAgIT0gbnVsbCkge1xuICAgIC8vIGlmIHN0ZXAgc2l6ZSBpcyBleHBsaWNpdGx5IGdpdmVuLCB1c2UgdGhhdFxuICAgIHN0ZXAgPSBvcHQuc3RlcDtcbiAgfSBlbHNlIGlmIChvcHQuc3RlcHMpIHtcbiAgICAvLyBpZiBwcm92aWRlZCwgbGltaXQgY2hvaWNlIHRvIGFjY2VwdGFibGUgc3RlcCBzaXplc1xuICAgIHN0ZXAgPSBvcHQuc3RlcHNbTWF0aC5taW4oXG4gICAgICBvcHQuc3RlcHMubGVuZ3RoIC0gMSxcbiAgICAgIGJpc2VjdChvcHQuc3RlcHMsIHNwYW4vbWF4YiwgMCwgb3B0LnN0ZXBzLmxlbmd0aClcbiAgICApXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBlbHNlIHVzZSBzcGFuIHRvIGRldGVybWluZSBzdGVwIHNpemVcbiAgICBsZXZlbCA9IE1hdGguY2VpbChNYXRoLmxvZyhtYXhiKSAvIGxvZ2IpO1xuICAgIG1pbnN0ZXAgPSBvcHQubWluc3RlcCB8fCAwO1xuICAgIHN0ZXAgPSBNYXRoLm1heChcbiAgICAgIG1pbnN0ZXAsXG4gICAgICBNYXRoLnBvdyhiYXNlLCBNYXRoLnJvdW5kKE1hdGgubG9nKHNwYW4pIC8gbG9nYikgLSBsZXZlbClcbiAgICApO1xuICAgIFxuICAgIC8vIGluY3JlYXNlIHN0ZXAgc2l6ZSBpZiB0b28gbWFueSBiaW5zXG4gICAgZG8geyBzdGVwICo9IGJhc2U7IH0gd2hpbGUgKE1hdGguY2VpbChzcGFuL3N0ZXApID4gbWF4Yik7XG5cbiAgICAvLyBkZWNyZWFzZSBzdGVwIHNpemUgaWYgYWxsb3dlZFxuICAgIGZvciAoaT0wOyBpPGRpdi5sZW5ndGg7ICsraSkge1xuICAgICAgdiA9IHN0ZXAgLyBkaXZbaV07XG4gICAgICBpZiAodiA+PSBtaW5zdGVwICYmIHNwYW4gLyB2IDw9IG1heGIpIHN0ZXAgPSB2O1xuICAgIH1cbiAgfVxuXG4gIC8vIHVwZGF0ZSBwcmVjaXNpb24sIG1pbiBhbmQgbWF4XG4gIHYgPSBNYXRoLmxvZyhzdGVwKTtcbiAgcHJlY2lzaW9uID0gdiA+PSAwID8gMCA6IH5+KC12IC8gbG9nYikgKyAxO1xuICBlcHMgPSBNYXRoLnBvdyhiYXNlLCAtcHJlY2lzaW9uIC0gMSk7XG4gIG1pbiA9IE1hdGgubWluKG1pbiwgTWF0aC5mbG9vcihtaW4gLyBzdGVwICsgZXBzKSAqIHN0ZXApO1xuICBtYXggPSBNYXRoLmNlaWwobWF4IC8gc3RlcCkgKiBzdGVwO1xuXG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IG1pbixcbiAgICBzdG9wOiAgbWF4LFxuICAgIHN0ZXA6ICBzdGVwLFxuICAgIHVuaXQ6ICB7cHJlY2lzaW9uOiBwcmVjaXNpb259LFxuICAgIHZhbHVlOiB2YWx1ZSxcbiAgICBpbmRleDogaW5kZXhcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGJpc2VjdChhLCB4LCBsbywgaGkpIHtcbiAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICBpZiAodXRpbC5jbXAoYVttaWRdLCB4KSA8IDApIHsgbG8gPSBtaWQgKyAxOyB9XG4gICAgZWxzZSB7IGhpID0gbWlkOyB9XG4gIH1cbiAgcmV0dXJuIGxvO1xufTtcblxuZnVuY3Rpb24gdmFsdWUodikge1xuICByZXR1cm4gdGhpcy5zdGVwICogTWF0aC5mbG9vcih2IC8gdGhpcy5zdGVwICsgRVBTSUxPTik7XG59XG5cbmZ1bmN0aW9uIGluZGV4KHYpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoKHYgLSB0aGlzLnN0YXJ0KSAvIHRoaXMuc3RlcCArIEVQU0lMT04pO1xufVxuXG5mdW5jdGlvbiBkYXRlX3ZhbHVlKHYpIHtcbiAgcmV0dXJuIHRoaXMudW5pdC5kYXRlKHZhbHVlLmNhbGwodGhpcywgdikpO1xufVxuXG5mdW5jdGlvbiBkYXRlX2luZGV4KHYpIHtcbiAgcmV0dXJuIGluZGV4LmNhbGwodGhpcywgdGhpcy51bml0LnVuaXQodikpO1xufVxuXG5iaW4uZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG5cbiAgLy8gZmluZCB0aW1lIHN0ZXAsIHRoZW4gYmluXG4gIHZhciBkbWluID0gb3B0Lm1pbixcbiAgICAgIGRtYXggPSBvcHQubWF4LFxuICAgICAgbWF4YiA9IG9wdC5tYXhiaW5zIHx8IDIwLFxuICAgICAgbWluYiA9IG9wdC5taW5iaW5zIHx8IDQsXG4gICAgICBzcGFuID0gKCtkbWF4KSAtICgrZG1pbik7XG4gICAgICB1bml0ID0gb3B0LnVuaXQgPyB1bml0c1tvcHQudW5pdF0gOiB1bml0cy5maW5kKHNwYW4sIG1pbmIsIG1heGIpLFxuICAgICAgYmlucyA9IGJpbih7XG4gICAgICAgIG1pbjogICAgIHVuaXQubWluICE9IG51bGwgPyB1bml0Lm1pbiA6IHVuaXQudW5pdChkbWluKSxcbiAgICAgICAgbWF4OiAgICAgdW5pdC5tYXggIT0gbnVsbCA/IHVuaXQubWF4IDogdW5pdC51bml0KGRtYXgpLFxuICAgICAgICBtYXhiaW5zOiBtYXhiLFxuICAgICAgICBtaW5zdGVwOiB1bml0Lm1pbnN0ZXAsXG4gICAgICAgIHN0ZXBzOiAgIHVuaXQuc3RlcFxuICAgICAgfSk7XG5cbiAgYmlucy51bml0ID0gdW5pdDtcbiAgYmlucy5pbmRleCA9IGRhdGVfaW5kZXg7XG4gIGlmICghb3B0LnJhdykgYmlucy52YWx1ZSA9IGRhdGVfdmFsdWU7XG4gIHJldHVybiBiaW5zO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiaW47XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG52YXIgU1RFUFMgPSBbXG4gIFszMTUzNmU2LCA1XSwgIC8vIDEteWVhclxuICBbNzc3NmU2LCA0XSwgICAvLyAzLW1vbnRoXG4gIFsyNTkyZTYsIDRdLCAgIC8vIDEtbW9udGhcbiAgWzEyMDk2ZTUsIDNdLCAgLy8gMi13ZWVrXG4gIFs2MDQ4ZTUsIDNdLCAgIC8vIDEtd2Vla1xuICBbMTcyOGU1LCAzXSwgICAvLyAyLWRheVxuICBbODY0ZTUsIDNdLCAgICAvLyAxLWRheVxuICBbNDMyZTUsIDJdLCAgICAvLyAxMi1ob3VyXG4gIFsyMTZlNSwgMl0sICAgIC8vIDYtaG91clxuICBbMTA4ZTUsIDJdLCAgICAvLyAzLWhvdXJcbiAgWzM2ZTUsIDJdLCAgICAgLy8gMS1ob3VyXG4gIFsxOGU1LCAxXSwgICAgIC8vIDMwLW1pbnV0ZVxuICBbOWU1LCAxXSwgICAgICAvLyAxNS1taW51dGVcbiAgWzNlNSwgMV0sICAgICAgLy8gNS1taW51dGVcbiAgWzZlNCwgMV0sICAgICAgLy8gMS1taW51dGVcbiAgWzNlNCwgMF0sICAgICAgLy8gMzAtc2Vjb25kXG4gIFsxNWUzLCAwXSwgICAgIC8vIDE1LXNlY29uZFxuICBbNWUzLCAwXSwgICAgICAvLyA1LXNlY29uZFxuICBbMWUzLCAwXSAgICAgICAvLyAxLXNlY29uZFxuXTtcblxudmFyIGVudHJpZXMgPSBbXG4gIHtcbiAgICB0eXBlOiBcInNlY29uZFwiLFxuICAgIG1pbnN0ZXA6IDEsXG4gICAgZm9ybWF0OiBcIiVZICViICUtZCAlSDolTTolUy4lTFwiLFxuICAgIGRhdGU6IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZShkICogMWUzKTtcbiAgICB9LFxuICAgIHVuaXQ6IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiAoK2QgLyAxZTMpO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIHR5cGU6IFwibWludXRlXCIsXG4gICAgbWluc3RlcDogMSxcbiAgICBmb3JtYXQ6IFwiJVkgJWIgJS1kICVIOiVNXCIsXG4gICAgZGF0ZTogZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKGQgKiA2ZTQpO1xuICAgIH0sXG4gICAgdW5pdDogZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIH5+KCtkIC8gNmU0KTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICB0eXBlOiBcImhvdXJcIixcbiAgICBtaW5zdGVwOiAxLFxuICAgIGZvcm1hdDogXCIlWSAlYiAlLWQgJUg6MDBcIixcbiAgICBkYXRlOiBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoZCAqIDM2ZTUpO1xuICAgIH0sXG4gICAgdW5pdDogZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIH5+KCtkIC8gMzZlNSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgdHlwZTogXCJkYXlcIixcbiAgICBtaW5zdGVwOiAxLFxuICAgIHN0ZXA6IFsxLCA3XSxcbiAgICBmb3JtYXQ6IFwiJVkgJWIgJS1kXCIsXG4gICAgZGF0ZTogZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKGQgKiA4NjRlNSk7XG4gICAgfSxcbiAgICB1bml0OiBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gfn4oK2QgLyA4NjRlNSk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgdHlwZTogXCJtb250aFwiLFxuICAgIG1pbnN0ZXA6IDEsXG4gICAgc3RlcDogWzEsIDMsIDZdLFxuICAgIGZvcm1hdDogXCIlYiAlWVwiLFxuICAgIGRhdGU6IGZ1bmN0aW9uKGQpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh+fihkIC8gMTIpLCBkICUgMTIsIDEpKTtcbiAgICB9LFxuICAgIHVuaXQ6IGZ1bmN0aW9uKGQpIHtcbiAgICAgIGlmICh1dGlsLmlzTnVtYmVyKGQpKSBkID0gbmV3IERhdGUoZCk7XG4gICAgICByZXR1cm4gMTIgKiBkLmdldFVUQ0Z1bGxZZWFyKCkgKyBkLmdldFVUQ01vbnRoKCk7XG4gICAgfVxuICB9LFxuICB7XG4gICAgdHlwZTogXCJ5ZWFyXCIsXG4gICAgbWluc3RlcDogMSxcbiAgICBmb3JtYXQ6IFwiJVlcIixcbiAgICBkYXRlOiBmdW5jdGlvbihkKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoZCwgMCwgMSkpO1xuICAgIH0sXG4gICAgdW5pdDogZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuICh1dGlsLmlzTnVtYmVyKGQpID8gbmV3IERhdGUoZCkgOiBkKS5nZXRVVENGdWxsWWVhcigpO1xuICAgIH1cbiAgfVxuXTtcblxudmFyIG1pbnV0ZU9mSG91ciA9IHtcbiAgdHlwZTogXCJtaW51dGVPZkhvdXJcIixcbiAgbWluOiAwLFxuICBtYXg6IDU5LFxuICBtaW5zdGVwOiAxLFxuICBmb3JtYXQ6IFwiJU1cIixcbiAgZGF0ZTogZnVuY3Rpb24oZCkge1xuICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCAxLCAwLCBkKSk7XG4gIH0sXG4gIHVuaXQ6IGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gKHV0aWwuaXNOdW1iZXIoZCkgPyBuZXcgRGF0ZShkKSA6IGQpLmdldFVUQ01pbnV0ZXMoKTtcbiAgfVxufTtcblxudmFyIGhvdXJPZkRheSA9IHtcbiAgdHlwZTogXCJob3VyT2ZEYXlcIixcbiAgbWluOiAwLFxuICBtYXg6IDIzLFxuICBtaW5zdGVwOiAxLFxuICBmb3JtYXQ6IFwiJUhcIixcbiAgZGF0ZTogZnVuY3Rpb24oZCkge1xuICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCAxLCBkKSk7XG4gIH0sXG4gIHVuaXQ6IGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gKHV0aWwuaXNOdW1iZXIoZCkgPyBuZXcgRGF0ZShkKSA6IGQpLmdldFVUQ0hvdXJzKCk7XG4gIH1cbn07XG5cbnZhciBkYXlPZldlZWsgPSB7XG4gIHR5cGU6IFwiZGF5T2ZXZWVrXCIsXG4gIG1pbjogMCxcbiAgbWF4OiA2LFxuICBzdGVwOiBbMV0sXG4gIGZvcm1hdDogXCIlYVwiLFxuICBkYXRlOiBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5NzAsIDAsIDQgKyBkKSk7XG4gIH0sXG4gIHVuaXQ6IGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gKHV0aWwuaXNOdW1iZXIoZCkgPyBuZXcgRGF0ZShkKSA6IGQpLmdldFVUQ0RheSgpO1xuICB9XG59O1xuXG52YXIgZGF5T2ZNb250aCA9IHtcbiAgdHlwZTogXCJkYXlPZk1vbnRoXCIsXG4gIG1pbjogMSxcbiAgbWF4OiAzMSxcbiAgc3RlcDogWzFdLFxuICBmb3JtYXQ6IFwiJS1kXCIsXG4gIGRhdGU6IGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgMCwgZCkpO1xuICB9LFxuICB1bml0OiBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuICh1dGlsLmlzTnVtYmVyKGQpID8gbmV3IERhdGUoZCkgOiBkKS5nZXRVVENEYXRlKCk7XG4gIH1cbn07XG5cbnZhciBtb250aE9mWWVhciA9IHtcbiAgdHlwZTogXCJtb250aE9mWWVhclwiLFxuICBtaW46IDAsXG4gIG1heDogMTEsXG4gIHN0ZXA6IFsxXSxcbiAgZm9ybWF0OiBcIiViXCIsXG4gIGRhdGU6IGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk3MCwgZCAlIDEyLCAxKSk7XG4gIH0sXG4gIHVuaXQ6IGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gKHV0aWwuaXNOdW1iZXIoZCkgPyBuZXcgRGF0ZShkKSA6IGQpLmdldFVUQ01vbnRoKCk7XG4gIH1cbn07XG5cbnZhciB1bml0cyA9IHtcbiAgXCJzZWNvbmRcIjogICAgICAgZW50cmllc1swXSxcbiAgXCJtaW51dGVcIjogICAgICAgZW50cmllc1sxXSxcbiAgXCJob3VyXCI6ICAgICAgICAgZW50cmllc1syXSxcbiAgXCJkYXlcIjogICAgICAgICAgZW50cmllc1szXSxcbiAgXCJtb250aFwiOiAgICAgICAgZW50cmllc1s0XSxcbiAgXCJ5ZWFyXCI6ICAgICAgICAgZW50cmllc1s1XSxcbiAgXCJtaW51dGVPZkhvdXJcIjogbWludXRlT2ZIb3VyLFxuICBcImhvdXJPZkRheVwiOiAgICBob3VyT2ZEYXksXG4gIFwiZGF5T2ZXZWVrXCI6ICAgIGRheU9mV2VlayxcbiAgXCJkYXlPZk1vbnRoXCI6ICAgZGF5T2ZNb250aCxcbiAgXCJtb250aE9mWWVhclwiOiAgbW9udGhPZlllYXIsXG4gIFwidGltZXN0ZXBzXCI6ICAgIGVudHJpZXNcbn07XG5cbnVuaXRzLmZpbmQgPSBmdW5jdGlvbihzcGFuLCBtaW5iLCBtYXhiKSB7XG4gIHZhciBpLCBsZW4sIGJpbnMsIHN0ZXAgPSBTVEVQU1swXTtcblxuICBmb3IgKGkgPSAxLCBsZW4gPSBTVEVQUy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHN0ZXAgPSBTVEVQU1tpXTtcbiAgICBpZiAoc3BhbiA+IHN0ZXBbMF0pIHtcbiAgICAgIGJpbnMgPSBzcGFuIC8gc3RlcFswXTtcbiAgICAgIGlmIChiaW5zID4gbWF4Yikge1xuICAgICAgICByZXR1cm4gZW50cmllc1tTVEVQU1tpIC0gMV1bMV1dO1xuICAgICAgfVxuICAgICAgaWYgKGJpbnMgPj0gbWluYikge1xuICAgICAgICByZXR1cm4gZW50cmllc1tzdGVwWzFdXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVudHJpZXNbU1RFUFNbU1RFUFMubGVuZ3RoIC0gMV1bMV1dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1bml0cztcbiIsInZhciBnZW4gPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5nZW4ucmVwZWF0ID0gZnVuY3Rpb24odmFsLCBuKSB7XG4gIHZhciBhID0gQXJyYXkobiksIGk7XG4gIGZvciAoaT0wOyBpPG47ICsraSkgYVtpXSA9IHZhbDtcbiAgcmV0dXJuIGE7XG59O1xuXG5nZW4uemVyb3MgPSBmdW5jdGlvbihuKSB7XG4gIHJldHVybiBnZW4ucmVwZWF0KDAsIG4pO1xufTtcblxuZ2VuLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBzdG9wID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICB9XG4gIGlmICgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXAgPT0gSW5maW5pdHkpIHRocm93IG5ldyBFcnJvcignSW5maW5pdGUgcmFuZ2UnKTtcbiAgdmFyIHJhbmdlID0gW10sIGkgPSAtMSwgajtcbiAgaWYgKHN0ZXAgPCAwKSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpID4gc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgZWxzZSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpIDwgc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgcmV0dXJuIHJhbmdlO1xufTtcblxuZ2VuLnJhbmRvbSA9IHt9O1xuXG5nZW4ucmFuZG9tLnVuaWZvcm0gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICBpZiAobWF4ID09PSB1bmRlZmluZWQpIHtcblx0XHRtYXggPSBtaW47XG5cdFx0bWluID0gMDtcblx0fVxuXHR2YXIgZCA9IG1heCAtIG1pbjtcblx0dmFyIGYgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbWluICsgZCAqIE1hdGgucmFuZG9tKCk7XG5cdH07XG5cdGYuc2FtcGxlcyA9IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIGdlbi56ZXJvcyhuKS5tYXAoZik7IH07XG5cdHJldHVybiBmO1xufTtcblxuZ2VuLnJhbmRvbS5pbnRlZ2VyID0gZnVuY3Rpb24oYSwgYikge1xuXHRpZiAoYiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0YiA9IGE7XG5cdFx0YSA9IDA7XG5cdH1cbiAgdmFyIGQgPSBiIC0gYTtcblx0dmFyIGYgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYSArIE1hdGguZmxvb3IoZCAqIE1hdGgucmFuZG9tKCkpO1xuXHR9O1xuXHRmLnNhbXBsZXMgPSBmdW5jdGlvbihuKSB7IHJldHVybiBnZW4uemVyb3MobikubWFwKGYpOyB9O1xuXHRyZXR1cm4gZjtcbn07XG5cbmdlbi5yYW5kb20ubm9ybWFsID0gZnVuY3Rpb24obWVhbiwgc3RkZXYpIHtcblx0bWVhbiA9IG1lYW4gfHwgMDtcblx0c3RkZXYgPSBzdGRldiB8fCAxO1xuXHR2YXIgbmV4dCA9IHVuZGVmaW5lZDtcblx0dmFyIGYgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgeCA9IDAsIHkgPSAwLCByZHMsIGM7XG5cdFx0aWYgKG5leHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0eCA9IG5leHQ7XG5cdFx0XHRuZXh0ID0gdW5kZWZpbmVkO1xuXHRcdFx0cmV0dXJuIHg7XG5cdFx0fVxuXHRcdGRvIHtcblx0XHRcdHggPSBNYXRoLnJhbmRvbSgpKjItMTtcblx0XHRcdHkgPSBNYXRoLnJhbmRvbSgpKjItMTtcblx0XHRcdHJkcyA9IHgqeCArIHkqeTtcblx0XHR9IHdoaWxlIChyZHMgPT0gMCB8fCByZHMgPiAxKTtcblx0XHRjID0gTWF0aC5zcXJ0KC0yKk1hdGgubG9nKHJkcykvcmRzKTsgLy8gQm94LU11bGxlciB0cmFuc2Zvcm1cblx0XHRuZXh0ID0gbWVhbiArIHkqYypzdGRldjtcblx0XHRyZXR1cm4gbWVhbiArIHgqYypzdGRldjtcblx0fTtcblx0Zi5zYW1wbGVzID0gZnVuY3Rpb24obikgeyByZXR1cm4gZ2VuLnplcm9zKG4pLm1hcChmKTsgfTtcblx0cmV0dXJuIGY7XG59OyIsInZhciBzdGF0cyA9IHJlcXVpcmUoJy4vc3RhdHMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgYmluID0gcmVxdWlyZSgnLi9iaW4nKTtcbnZhciBnZW4gPSByZXF1aXJlKCcuL2dlbmVyYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsdWVzLCBmLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgJiYgIXV0aWwuaXNGdW5jdGlvbihmKSkgeyBvcHRpb25zID0gZjsgZiA9IG51bGw7IH1cblxuICB2YXIgdHlwZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy50eXBlIHx8IGluZmVyKHZhbHVlcywgZik7XG4gIGlmICh0eXBlICE9PSAnbnVtYmVyJyAmJiB0eXBlICE9PSAnZGF0ZScgJiYgdHlwZSAhPT0gJ2ludGVnZXInKSB7XG4gICAgcmV0dXJuIGNhdGVnb3JpY2FsKHZhbHVlcywgZiwgb3B0aW9ucyAmJiBvcHRpb25zLnNvcnQpO1xuICB9XG5cbiAgdmFyIGV4dCA9IHN0YXRzLmV4dGVudCh2YWx1ZXMsIGYpLFxuICAgICAgb3B0ID0gdXRpbC5leHRlbmQoe21pbjogZXh0WzBdLCBtYXg6IGV4dFsxXX0sIG9wdGlvbnMpO1xuICBpZiAodHlwZSA9PT0gJ2ludGVnZXInICYmIG9wdC5taW5zdGVwID09IG51bGwpIG9wdC5taW5zdGVwID0gMTtcbiAgdmFyIGIgPSB0eXBlID09PSAnZGF0ZScgPyBiaW4uZGF0ZShvcHQpIDogYmluKG9wdCk7XG4gIHJldHVybiBudW1lcmljYWwodmFsdWVzLCBmLCBiKTtcbn07XG5cbmZ1bmN0aW9uIGluZmVyKHZhbHVlcywgZikge1xuICB2YXIgdiA9IG51bGwsIGk7XG5cbiAgLy8gaWYgZGF0YSBhcnJheSBoYXMgdHlwZSBhbm5vdGF0aW9ucywgdXNlIHRoZW1cbiAgaWYgKHZhbHVlcy50eXBlcykge1xuICAgIHYgPSBmKHZhbHVlcy50eXBlcyk7XG4gICAgaWYgKHV0aWwuaXNTdHJpbmcodikpIHJldHVybiB2O1xuICB9XG5cbiAgZm9yIChpPTA7ICF1dGlsLmlzTm90TnVsbCh2KSAmJiBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICB9XG4gIHJldHVybiB1dGlsLmlzRGF0ZSh2KSA/ICdkYXRlJyA6IHV0aWwuaXNOdW1iZXIodikgPyAnbnVtYmVyJyA6ICdzdHJpbmcnO1xufVxuXG5mdW5jdGlvbiBudW1lcmljYWwodmFsdWVzLCBmLCBiKSB7XG4gIHZhciBoID0gZ2VuLnJhbmdlKGIuc3RhcnQsIGIuc3RvcCArIGIuc3RlcC8yLCBiLnN0ZXApXG4gICAgLm1hcChmdW5jdGlvbih2KSB7IHJldHVybiB7dmFsdWU6IGIudmFsdWUodiksIGNvdW50OiAwfTsgfSk7XG5cbiAgZm9yICh2YXIgaT0wLCB2LCBqOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh1dGlsLmlzTm90TnVsbCh2KSkge1xuICAgICAgaiA9IGIuaW5kZXgodik7XG4gICAgICBpZiAoaiA8IDAgfHwgaiA+PSBoLmxlbmd0aCB8fCAhaXNGaW5pdGUoaikpIGNvbnRpbnVlO1xuICAgICAgaFtqXS5jb3VudCArPSAxO1xuICAgIH1cbiAgfVxuICBoLmJpbnMgPSBiO1xuICByZXR1cm4gaDtcbn1cblxuZnVuY3Rpb24gY2F0ZWdvcmljYWwodmFsdWVzLCBmLCBzb3J0KSB7XG4gIHZhciBjID0gc3RhdHMudW5pcXVlKHZhbHVlcywgZikuY291bnRzO1xuICByZXR1cm4gdXRpbC5rZXlzKGMpXG4gICAgLm1hcChmdW5jdGlvbihrKSB7IHJldHVybiB7dmFsdWU6IGssIGNvdW50OiBjW2tdfTsgfSlcbiAgICAuc29ydCh1dGlsLmNvbXBhcmF0b3Ioc29ydCA/IFwiLWNvdW50XCIgOiBcIit2YWx1ZVwiKSk7XG59IiwidmFyIGQzID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuZDMgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLmQzIDogbnVsbCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGF0YSwgZm9ybWF0KSB7XG4gIHZhciBkID0gZDMuY3N2LnBhcnNlKGRhdGEgPyBkYXRhLnRvU3RyaW5nKCkgOiBkYXRhKTtcbiAgcmV0dXJuIGQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGpzb246IHJlcXVpcmUoJy4vanNvbicpLFxuICBjc3Y6IHJlcXVpcmUoJy4vY3N2JyksXG4gIHRzdjogcmVxdWlyZSgnLi90c3YnKSxcbiAgdG9wb2pzb246IHJlcXVpcmUoJy4vdG9wb2pzb24nKSxcbiAgdHJlZWpzb246IHJlcXVpcmUoJy4vdHJlZWpzb24nKVxufTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhLCBmb3JtYXQpIHtcbiAgdmFyIGQgPSB1dGlsLmlzT2JqZWN0KGRhdGEpICYmICF1dGlsLmlzQnVmZmVyKGRhdGEpXG4gICAgPyBkYXRhIDogSlNPTi5wYXJzZShkYXRhKTtcbiAgaWYgKGZvcm1hdCAmJiBmb3JtYXQucHJvcGVydHkpIHtcbiAgICBkID0gdXRpbC5hY2Nlc3Nvcihmb3JtYXQucHJvcGVydHkpKGQpO1xuICB9XG4gIHJldHVybiBkO1xufTtcbiIsInZhciBqc29uID0gcmVxdWlyZSgnLi9qc29uJyk7XG52YXIgdG9wb2pzb24gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy50b3BvanNvbiA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwudG9wb2pzb24gOiBudWxsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhLCBmb3JtYXQpIHtcbiAgaWYgKHRvcG9qc29uID09IG51bGwpIHsgdGhyb3cgRXJyb3IoXCJUb3BvSlNPTiBsaWJyYXJ5IG5vdCBsb2FkZWQuXCIpOyB9XG5cbiAgdmFyIHQgPSBqc29uKGRhdGEsIGZvcm1hdCksIG9iajtcblxuICBpZiAoZm9ybWF0ICYmIGZvcm1hdC5mZWF0dXJlKSB7XG4gICAgaWYgKG9iaiA9IHQub2JqZWN0c1tmb3JtYXQuZmVhdHVyZV0pIHtcbiAgICAgIHJldHVybiB0b3BvanNvbi5mZWF0dXJlKHQsIG9iaikuZmVhdHVyZXNcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgRXJyb3IoXCJJbnZhbGlkIFRvcG9KU09OIG9iamVjdDogXCIrZm9ybWF0LmZlYXR1cmUpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChmb3JtYXQgJiYgZm9ybWF0Lm1lc2gpIHtcbiAgICBpZiAob2JqID0gdC5vYmplY3RzW2Zvcm1hdC5tZXNoXSkge1xuICAgICAgcmV0dXJuIFt0b3BvanNvbi5tZXNoKHQsIHQub2JqZWN0c1tmb3JtYXQubWVzaF0pXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgRXJyb3IoXCJJbnZhbGlkIFRvcG9KU09OIG9iamVjdDogXCIgKyBmb3JtYXQubWVzaCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKFwiTWlzc2luZyBUb3BvSlNPTiBmZWF0dXJlIG9yIG1lc2ggcGFyYW1ldGVyLlwiKTtcbiAgfVxuXG4gIHJldHVybiBbXTtcbn07XG4iLCJ2YXIganNvbiA9IHJlcXVpcmUoJy4vanNvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRhdGEsIGZvcm1hdCkge1xuICBkYXRhID0ganNvbihkYXRhLCBmb3JtYXQpO1xuICByZXR1cm4gdG9UYWJsZShkYXRhLCAoZm9ybWF0ICYmIGZvcm1hdC5jaGlsZHJlbikpO1xufTtcblxuZnVuY3Rpb24gdG9UYWJsZShyb290LCBjaGlsZHJlbkZpZWxkKSB7XG4gIGNoaWxkcmVuRmllbGQgPSBjaGlsZHJlbkZpZWxkIHx8IFwiY2hpbGRyZW5cIjtcbiAgdmFyIHRhYmxlID0gW107XG4gIFxuICBmdW5jdGlvbiB2aXNpdChub2RlLCBwYXJlbnQpIHtcbiAgICB0YWJsZS5wdXNoKG5vZGUpO1xuICAgIHZhciBjaGlsZHJlbiA9IG5vZGVbY2hpbGRyZW5GaWVsZF07XG4gICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICBmb3IgKHZhciBpPTA7IGk8Y2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmlzaXQoY2hpbGRyZW5baV0sIG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdmlzaXQocm9vdCwgbnVsbCk7XG4gIHJldHVybiAodGFibGUucm9vdCA9IHJvb3QsIHRhYmxlKTtcbn0iLCJ2YXIgZDMgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5kMyA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuZDMgOiBudWxsKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhLCBmb3JtYXQpIHtcbiAgdmFyIGQgPSBkMy50c3YucGFyc2UoZGF0YSA/IGRhdGEudG9TdHJpbmcoKSA6IGRhdGEpO1xuICByZXR1cm4gZDtcbn07XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxuLy8gTWF0Y2hlcyBhYnNvbHV0ZSBVUkxzIHdpdGggb3B0aW9uYWwgcHJvdG9jb2xcbi8vICAgaHR0cHM6Ly8uLi4gICAgZmlsZTovLy4uLiAgICAvLy4uLlxudmFyIHByb3RvY29sX3JlID0gL14oW0EtWmEtel0rOik/XFwvXFwvLztcblxuLy8gU3BlY2lhbCB0cmVhdG1lbnQgaW4gbm9kZS5qcyBmb3IgdGhlIGZpbGU6IHByb3RvY29sXG52YXIgZmlsZVByb3RvY29sID0gJ2ZpbGU6Ly8nO1xuXG4vLyBWYWxpZGF0ZSBhbmQgY2xlYW51cCBVUkwgdG8gZW5zdXJlIHRoYXQgaXQgaXMgYWxsb3dlZCB0byBiZSBhY2Nlc3NlZFxuLy8gUmV0dXJucyBjbGVhbmVkIHVwIFVSTCwgb3IgZmFsc2UgaWYgYWNjZXNzIGlzIG5vdCBhbGxvd2VkXG5mdW5jdGlvbiBzYW5pdGl6ZVVybChvcHQpIHtcbiAgdmFyIHVybCA9IG9wdC51cmw7XG4gIGlmICghdXJsICYmIG9wdC5maWxlKSB7IHJldHVybiBmaWxlUHJvdG9jb2wgKyBvcHQuZmlsZTsgfVxuXG4gIC8vIEluIGNhc2UgdGhpcyBpcyBhIHJlbGF0aXZlIHVybCAoaGFzIG5vIGhvc3QpLCBwcmVwZW5kIG9wdC5iYXNlVVJMXG4gIGlmIChvcHQuYmFzZVVSTCAmJiAhcHJvdG9jb2xfcmUudGVzdCh1cmwpKSB7XG4gICAgaWYgKCF1dGlsLnN0YXJ0c1dpdGgodXJsLCAnLycpICYmIG9wdC5iYXNlVVJMW29wdC5iYXNlVVJMLmxlbmd0aC0xXSAhPT0gJy8nKSB7XG4gICAgICB1cmwgPSAnLycgKyB1cmw7IC8vIEVuc3VyZSB0aGF0IHRoZXJlIGlzIGEgc2xhc2ggYmV0d2VlbiB0aGUgYmFzZVVSTCAoZS5nLiBob3N0bmFtZSkgYW5kIHVybFxuICAgIH1cbiAgICB1cmwgPSBvcHQuYmFzZVVSTCArIHVybDtcbiAgfVxuICAvLyByZWxhdGl2ZSBwcm90b2NvbCwgc3RhcnRzIHdpdGggJy8vJ1xuICBpZiAodXRpbC5pc05vZGUgJiYgdXRpbC5zdGFydHNXaXRoKHVybCwgJy8vJykpIHtcbiAgICB1cmwgPSAob3B0LmRlZmF1bHRQcm90b2NvbCB8fCAnaHR0cCcpICsgJzonICsgdXJsO1xuICB9XG4gIC8vIElmIG9wdC5kb21haW5XaGl0ZUxpc3QgaXMgc2V0LCBvbmx5IGFsbG93cyB1cmwsIHdob3NlIGhvc3RuYW1lXG4gIC8vICogSXMgdGhlIHNhbWUgYXMgdGhlIG9yaWdpbiAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKVxuICAvLyAqIEVxdWFscyBvbmUgb2YgdGhlIHZhbHVlcyBpbiB0aGUgd2hpdGVsaXN0XG4gIC8vICogSXMgYSBwcm9wZXIgc3ViZG9tYWluIG9mIG9uZSBvZiB0aGUgdmFsdWVzIGluIHRoZSB3aGl0ZWxpc3RcbiAgaWYgKG9wdC5kb21haW5XaGl0ZUxpc3QpIHtcbiAgICB2YXIgZG9tYWluLCBvcmlnaW47XG4gICAgaWYgKHV0aWwuaXNOb2RlKSB7XG4gICAgICAvLyByZWxhdGl2ZSBwcm90b2NvbCBpcyBicm9rZW46IGh0dHBzOi8vZ2l0aHViLmNvbS9kZWZ1bmN0em9tYmllL25vZGUtdXJsL2lzc3Vlcy81XG4gICAgICB2YXIgcGFydHMgPSByZXF1aXJlKCd1cmwnKS5wYXJzZSh1cmwpO1xuICAgICAgZG9tYWluID0gcGFydHMuaG9zdG5hbWU7XG4gICAgICBvcmlnaW4gPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIGEuaHJlZiA9IHVybDtcbiAgICAgIC8vIEZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MzY1MTMvaG93LWRvLWktcGFyc2UtYS11cmwtaW50by1ob3N0bmFtZS1hbmQtcGF0aC1pbi1qYXZhc2NyaXB0XG4gICAgICAvLyBJRSBkb2Vzbid0IHBvcHVsYXRlIGFsbCBsaW5rIHByb3BlcnRpZXMgd2hlbiBzZXR0aW5nIC5ocmVmIHdpdGggYSByZWxhdGl2ZSBVUkwsXG4gICAgICAvLyBob3dldmVyIC5ocmVmIHdpbGwgcmV0dXJuIGFuIGFic29sdXRlIFVSTCB3aGljaCB0aGVuIGNhbiBiZSB1c2VkIG9uIGl0c2VsZlxuICAgICAgLy8gdG8gcG9wdWxhdGUgdGhlc2UgYWRkaXRpb25hbCBmaWVsZHMuXG4gICAgICBpZiAoYS5ob3N0ID09IFwiXCIpIHtcbiAgICAgICAgYS5ocmVmID0gYS5ocmVmO1xuICAgICAgfVxuICAgICAgZG9tYWluID0gYS5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgb3JpZ2luID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuICAgIH1cblxuICAgIGlmIChvcmlnaW4gIT09IGRvbWFpbikge1xuICAgICAgdmFyIHdoaXRlTGlzdGVkID0gb3B0LmRvbWFpbldoaXRlTGlzdC5zb21lKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHZhciBpZHggPSBkb21haW4ubGVuZ3RoIC0gZC5sZW5ndGg7XG4gICAgICAgIHJldHVybiBkID09PSBkb21haW4gfHxcbiAgICAgICAgICAoaWR4ID4gMSAmJiBkb21haW5baWR4LTFdID09PSAnLicgJiYgZG9tYWluLmxhc3RJbmRleE9mKGQpID09PSBpZHgpO1xuICAgICAgfSk7XG4gICAgICBpZiAoIXdoaXRlTGlzdGVkKSB7XG4gICAgICAgIHRocm93ICdVUkwgaXMgbm90IHdoaXRlbGlzdGVkOiAnICsgdXJsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdXJsO1xufVxuXG5mdW5jdGlvbiBsb2FkKG9wdCwgY2FsbGJhY2spIHtcbiAgdmFyIGVycm9yID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oZSkgeyB0aHJvdyBlOyB9O1xuICBcbiAgdHJ5IHtcbiAgICB2YXIgdXJsID0gbG9hZC5zYW5pdGl6ZVVybChvcHQpOyAvLyBlbmFibGUgb3ZlcnJpZGVcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyb3IoZXJyKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIXVybCkge1xuICAgIGVycm9yKCdJbnZhbGlkIFVSTDogJyArIHVybCk7XG4gIH0gZWxzZSBpZiAoIXV0aWwuaXNOb2RlKSB7XG4gICAgLy8gaW4gYnJvd3NlciwgdXNlIHhoclxuICAgIHJldHVybiB4aHIodXJsLCBjYWxsYmFjayk7XG4gIH0gZWxzZSBpZiAodXRpbC5zdGFydHNXaXRoKHVybCwgZmlsZVByb3RvY29sKSkge1xuICAgIC8vIGluIG5vZGUuanMsIGlmIHVybCBzdGFydHMgd2l0aCAnZmlsZTovLycsIHN0cmlwIGl0IGFuZCBsb2FkIGZyb20gZmlsZVxuICAgIHJldHVybiBmaWxlKHVybC5zbGljZShmaWxlUHJvdG9jb2wubGVuZ3RoKSwgY2FsbGJhY2spO1xuICB9IGVsc2Uge1xuICAgIC8vIGZvciByZWd1bGFyIFVSTHMgaW4gbm9kZS5qc1xuICAgIHJldHVybiBodHRwKHVybCwgY2FsbGJhY2spO1xuICB9XG59XG5cbmZ1bmN0aW9uIHhockhhc1Jlc3BvbnNlKHJlcXVlc3QpIHtcbiAgdmFyIHR5cGUgPSByZXF1ZXN0LnJlc3BvbnNlVHlwZTtcbiAgcmV0dXJuIHR5cGUgJiYgdHlwZSAhPT0gXCJ0ZXh0XCJcbiAgICAgID8gcmVxdWVzdC5yZXNwb25zZSAvLyBudWxsIG9uIGVycm9yXG4gICAgICA6IHJlcXVlc3QucmVzcG9uc2VUZXh0OyAvLyBcIlwiIG9uIGVycm9yXG59XG5cbmZ1bmN0aW9uIHhocih1cmwsIGNhbGxiYWNrKSB7XG4gIHZhciBhc3luYyA9ICEhY2FsbGJhY2s7XG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICAvLyBJZiBJRSBkb2VzIG5vdCBzdXBwb3J0IENPUlMsIHVzZSBYRG9tYWluUmVxdWVzdCAoY29waWVkIGZyb20gZDMueGhyKVxuICBpZiAodGhpcy5YRG9tYWluUmVxdWVzdFxuICAgICAgJiYgIShcIndpdGhDcmVkZW50aWFsc1wiIGluIHJlcXVlc3QpXG4gICAgICAmJiAvXihodHRwKHMpPzopP1xcL1xcLy8udGVzdCh1cmwpKSByZXF1ZXN0ID0gbmV3IFhEb21haW5SZXF1ZXN0O1xuXG4gIGZ1bmN0aW9uIHJlc3BvbmQoKSB7XG4gICAgdmFyIHN0YXR1cyA9IHJlcXVlc3Quc3RhdHVzO1xuICAgIGlmICghc3RhdHVzICYmIHhockhhc1Jlc3BvbnNlKHJlcXVlc3QpIHx8IHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwIHx8IHN0YXR1cyA9PT0gMzA0KSB7XG4gICAgICBjYWxsYmFjayhudWxsLCByZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKHJlcXVlc3QsIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhc3luYykge1xuICAgIFwib25sb2FkXCIgaW4gcmVxdWVzdFxuICAgICAgPyByZXF1ZXN0Lm9ubG9hZCA9IHJlcXVlc3Qub25lcnJvciA9IHJlc3BvbmRcbiAgICAgIDogcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHsgcmVxdWVzdC5yZWFkeVN0YXRlID4gMyAmJiByZXNwb25kKCk7IH07XG4gIH1cbiAgXG4gIHJlcXVlc3Qub3BlbihcIkdFVFwiLCB1cmwsIGFzeW5jKTtcbiAgcmVxdWVzdC5zZW5kKCk7XG4gIFxuICBpZiAoIWFzeW5jICYmIHhockhhc1Jlc3BvbnNlKHJlcXVlc3QpKSB7XG4gICAgcmV0dXJuIHJlcXVlc3QucmVzcG9uc2VUZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpbGUoZmlsZSwgY2FsbGJhY2spIHtcbiAgdmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgaWYgKCFjYWxsYmFjaykge1xuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgJ3V0ZjgnKTtcbiAgfVxuICByZXF1aXJlKCdmcycpLnJlYWRGaWxlKGZpbGUsIGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gaHR0cCh1cmwsIGNhbGxiYWNrKSB7XG4gIGlmICghY2FsbGJhY2spIHtcbiAgICByZXR1cm4gcmVxdWlyZSgnc3luYy1yZXF1ZXN0JykoJ0dFVCcsIHVybCkuZ2V0Qm9keSgpO1xuICB9XG4gIHJlcXVpcmUoJ3JlcXVlc3QnKSh1cmwsIGZ1bmN0aW9uKGVycm9yLCByZXNwb25zZSwgYm9keSkge1xuICAgIGlmICghZXJyb3IgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICBjYWxsYmFjayhudWxsLCBib2R5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgIH1cbiAgfSk7XG59XG5cbmxvYWQuc2FuaXRpemVVcmwgPSBzYW5pdGl6ZVVybDtcblxubW9kdWxlLmV4cG9ydHMgPSBsb2FkO1xuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG52YXIgbG9hZCA9IHJlcXVpcmUoJy4vbG9hZCcpO1xudmFyIHJlYWQgPSByZXF1aXJlKCcuL3JlYWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB1dGlsXG4gIC5rZXlzKHJlYWQuZm9ybWF0cylcbiAgLnJlZHVjZShmdW5jdGlvbihvdXQsIHR5cGUpIHtcbiAgICBvdXRbdHlwZV0gPSBmdW5jdGlvbihvcHQsIGZvcm1hdCwgY2FsbGJhY2spIHtcbiAgICAgIC8vIHByb2Nlc3MgYXJndW1lbnRzXG4gICAgICBpZiAodXRpbC5pc1N0cmluZyhvcHQpKSBvcHQgPSB7dXJsOiBvcHR9O1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgdXRpbC5pc0Z1bmN0aW9uKGZvcm1hdCkpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBmb3JtYXQ7XG4gICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHVwIHJlYWQgZm9ybWF0XG4gICAgICBmb3JtYXQgPSB1dGlsLmV4dGVuZCh7cGFyc2U6ICdhdXRvJ30sIGZvcm1hdCk7XG4gICAgICBmb3JtYXQudHlwZSA9IHR5cGU7XG5cbiAgICAgIC8vIGxvYWQgZGF0YVxuICAgICAgdmFyIGRhdGEgPSBsb2FkKG9wdCwgY2FsbGJhY2sgPyBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyb3IpIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBkYXRhIGxvYWRlZCwgbm93IHBhcnNlIGl0IChhc3luYylcbiAgICAgICAgICBkYXRhID0gcmVhZChkYXRhLCBmb3JtYXQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG4gICAgICB9IDogdW5kZWZpbmVkKTtcbiAgICAgIFxuICAgICAgLy8gZGF0YSBsb2FkZWQsIG5vdyBwYXJzZSBpdCAoc3luYylcbiAgICAgIGlmIChkYXRhKSByZXR1cm4gcmVhZChkYXRhLCBmb3JtYXQpO1xuICAgIH07XG4gICAgcmV0dXJuIG91dDtcbiAgfSwge30pO1xuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG52YXIgZm9ybWF0cyA9IHJlcXVpcmUoJy4vZm9ybWF0cycpO1xuXG52YXIgUEFSU0VSUyA9IHtcbiAgYm9vbGVhbjogdXRpbC5ib29sZWFuLFxuICBpbnRlZ2VyOiB1dGlsLm51bWJlcixcbiAgbnVtYmVyOiAgdXRpbC5udW1iZXIsXG4gIGRhdGU6ICAgIHV0aWwuZGF0ZSxcbiAgc3RyaW5nOiAgdXRpbC5pZGVudGl0eVxufTtcblxudmFyIFRFU1RTID0ge1xuICBib29sZWFuOiBmdW5jdGlvbih4KSB7IHJldHVybiB4PT09XCJ0cnVlXCIgfHwgeD09PVwiZmFsc2VcIiB8fCB1dGlsLmlzQm9vbGVhbih4KTsgfSxcbiAgaW50ZWdlcjogZnVuY3Rpb24oeCkgeyByZXR1cm4gVEVTVFMubnVtYmVyKHgpICYmICh4PSt4KSA9PT0gfn54OyB9LFxuICBudW1iZXI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuICFpc05hTigreCkgJiYgIXV0aWwuaXNEYXRlKHgpOyB9LFxuICBkYXRlOiBmdW5jdGlvbih4KSB7IHJldHVybiAhaXNOYU4oRGF0ZS5wYXJzZSh4KSk7IH1cbn07XG5cbmZ1bmN0aW9uIHJlYWQoZGF0YSwgZm9ybWF0KSB7XG4gIHZhciB0eXBlID0gKGZvcm1hdCAmJiBmb3JtYXQudHlwZSkgfHwgXCJqc29uXCI7XG4gIGRhdGEgPSBmb3JtYXRzW3R5cGVdKGRhdGEsIGZvcm1hdCk7XG4gIGlmIChmb3JtYXQgJiYgZm9ybWF0LnBhcnNlKSBwYXJzZShkYXRhLCBmb3JtYXQucGFyc2UpO1xuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gaW5mZXJfdHlwZSh2YWx1ZXMsIGYpIHtcbiAgdmFyIGksIGosIHY7XG5cbiAgLy8gdHlwZXMgdG8gdGVzdCBmb3IsIGluIHByZWNlZGVuY2Ugb3JkZXJcbiAgdmFyIHR5cGVzID0gWydib29sZWFuJywgJ2ludGVnZXInLCAnbnVtYmVyJywgJ2RhdGUnXTtcblxuICBmb3IgKGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBnZXQgbmV4dCB2YWx1ZSB0byB0ZXN0XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgLy8gdGVzdCB2YWx1ZSBhZ2FpbnN0IHJlbWFpbmluZyB0eXBlc1xuICAgIGZvciAoaj0wOyBqPHR5cGVzLmxlbmd0aDsgKytqKSB7XG4gICAgICBpZiAodXRpbC5pc05vdE51bGwodikgJiYgIVRFU1RTW3R5cGVzW2pdXSh2KSkge1xuICAgICAgICB0eXBlcy5zcGxpY2UoaiwgMSk7XG4gICAgICAgIGogLT0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaWYgbm8gdHlwZXMgbGVmdCwgcmV0dXJuICdzdHJpbmcnXG4gICAgaWYgKHR5cGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICdzdHJpbmcnO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVzWzBdO1xufVxuXG5mdW5jdGlvbiBpbmZlcl90eXBlcyhkYXRhLCBmaWVsZHMpIHtcbiAgZmllbGRzID0gZmllbGRzIHx8IHV0aWwua2V5cyhkYXRhWzBdKTtcbiAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoZnVuY3Rpb24odHlwZXMsIGYpIHtcbiAgICB2YXIgdHlwZSA9IGluZmVyX3R5cGUoZGF0YSwgdXRpbC5hY2Nlc3NvcihmKSk7XG4gICAgaWYgKFBBUlNFUlNbdHlwZV0pIHR5cGVzW2ZdID0gdHlwZTtcbiAgICByZXR1cm4gdHlwZXM7XG4gIH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gcGFyc2UoZGF0YSwgdHlwZXMpIHtcbiAgdmFyIGNvbHMsIHBhcnNlcnMsIGQsIGksIGosIGNsZW4sIGxlbiA9IGRhdGEubGVuZ3RoO1xuXG4gIHR5cGVzID0gKHR5cGVzPT09J2F1dG8nKSA/IGluZmVyX3R5cGVzKGRhdGEpIDogdXRpbC5kdXBsaWNhdGUodHlwZXMpO1xuICBjb2xzID0gdXRpbC5rZXlzKHR5cGVzKTtcbiAgcGFyc2VycyA9IGNvbHMubWFwKGZ1bmN0aW9uKGMpIHsgcmV0dXJuIFBBUlNFUlNbdHlwZXNbY11dOyB9KTtcblxuICBmb3IgKGk9MCwgY2xlbj1jb2xzLmxlbmd0aDsgaTxsZW47ICsraSkge1xuICAgIGQgPSBkYXRhW2ldO1xuICAgIGZvciAoaj0wOyBqPGNsZW47ICsraikge1xuICAgICAgZFtjb2xzW2pdXSA9IHBhcnNlcnNbal0oZFtjb2xzW2pdXSk7XG4gICAgfVxuICB9XG4gIGRhdGEudHlwZXMgPSB0eXBlcztcbn1cblxucmVhZC50eXBlID0gaW5mZXJfdHlwZTtcbnJlYWQudHlwZXMgPSBpbmZlcl90eXBlcztcbnJlYWQuZm9ybWF0cyA9IGZvcm1hdHM7XG5yZWFkLnBhcnNlID0gcGFyc2U7XG5tb2R1bGUuZXhwb3J0cyA9IHJlYWQ7XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG52YXIgZGwgPSB7XG4gIGxvYWQ6ICAgICAgcmVxdWlyZSgnLi9pbXBvcnQvbG9hZCcpLFxuICByZWFkOiAgICAgIHJlcXVpcmUoJy4vaW1wb3J0L3JlYWQnKSxcbiAgYmluOiAgICAgICByZXF1aXJlKCcuL2JpbicpLFxuICBoaXN0b2dyYW06IHJlcXVpcmUoJy4vaGlzdG9ncmFtJyksXG4gIHN1bW1hcnk6ICAgcmVxdWlyZSgnLi9zdW1tYXJ5JyksXG4gIHRlbXBsYXRlOiAgcmVxdWlyZSgnLi90ZW1wbGF0ZScpLFxuICBkYXRldW5pdHM6IHJlcXVpcmUoJy4vZGF0ZS11bml0cycpXG59O1xuXG51dGlsLmV4dGVuZChkbCwgdXRpbCk7XG51dGlsLmV4dGVuZChkbCwgcmVxdWlyZSgnLi9nZW5lcmF0ZScpKTtcbnV0aWwuZXh0ZW5kKGRsLCByZXF1aXJlKCcuL3N0YXRzJykpO1xudXRpbC5leHRlbmQoZGwsIHJlcXVpcmUoJy4vaW1wb3J0L2xvYWRlcnMnKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGw7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBnZW4gPSByZXF1aXJlKCcuL2dlbmVyYXRlJyk7XG52YXIgc3RhdHMgPSB7fTtcblxuLy8gQ29sbGVjdCB1bmlxdWUgdmFsdWVzIGFuZCBhc3NvY2lhdGVkIGNvdW50cy5cbi8vIE91dHB1dDogYW4gYXJyYXkgb2YgdW5pcXVlIHZhbHVlcywgaW4gb2JzZXJ2ZWQgb3JkZXJcbi8vIFRoZSBhcnJheSBpbmNsdWRlcyBhbiBhZGRpdGlvbmFsICdjb3VudHMnIHByb3BlcnR5LFxuLy8gd2hpY2ggaXMgYSBoYXNoIGZyb20gdW5pcXVlIHZhbHVlcyB0byBvY2N1cnJlbmNlIGNvdW50cy5cbnN0YXRzLnVuaXF1ZSA9IGZ1bmN0aW9uKHZhbHVlcywgZiwgcmVzdWx0cykge1xuICBpZiAoIXV0aWwuaXNBcnJheSh2YWx1ZXMpIHx8IHZhbHVlcy5sZW5ndGg9PT0wKSByZXR1cm4gW107XG4gIHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuICB2YXIgdSA9IHt9LCB2LCBpO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh2IGluIHUpIHtcbiAgICAgIHVbdl0gKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgdVt2XSA9IDE7XG4gICAgICByZXN1bHRzLnB1c2godik7XG4gICAgfVxuICB9XG4gIHJlc3VsdHMuY291bnRzID0gdTtcbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vLyBDb3VudCB0aGUgbnVtYmVyIG9mIG5vbi1udWxsIHZhbHVlcy5cbnN0YXRzLmNvdW50ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGlmICghdXRpbC5pc0FycmF5KHZhbHVlcykgfHwgdmFsdWVzLmxlbmd0aD09PTApIHJldHVybiAwO1xuICB2YXIgdiwgaSwgY291bnQgPSAwO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh2ICE9IG51bGwpIGNvdW50ICs9IDE7XG4gIH1cbiAgcmV0dXJuIGNvdW50O1xufTtcblxuLy8gQ291bnQgdGhlIG51bWJlciBvZiBkaXN0aW5jdCB2YWx1ZXMuXG5zdGF0cy5jb3VudC5kaXN0aW5jdCA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBpZiAoIXV0aWwuaXNBcnJheSh2YWx1ZXMpIHx8IHZhbHVlcy5sZW5ndGg9PT0wKSByZXR1cm4gMDtcbiAgdmFyIHUgPSB7fSwgdiwgaSwgY291bnQgPSAwO1xuICBmb3IgKGk9MCwgbj12YWx1ZXMubGVuZ3RoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh2IGluIHUpIGNvbnRpbnVlO1xuICAgIHVbdl0gPSAxO1xuICAgIGNvdW50ICs9IDE7XG4gIH1cbiAgcmV0dXJuIGNvdW50O1xufTtcblxuLy8gQ291bnQgdGhlIG51bWJlciBvZiBudWxsIG9yIHVuZGVmaW5lZCB2YWx1ZXMuXG5zdGF0cy5jb3VudC5udWxscyA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBpZiAoIXV0aWwuaXNBcnJheSh2YWx1ZXMpIHx8IHZhbHVlcy5sZW5ndGg9PT0wKSByZXR1cm4gMDtcbiAgdmFyIHYsIGksIGNvdW50ID0gMDtcbiAgZm9yIChpPTAsIG49dmFsdWVzLmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICBpZiAodiA9PSBudWxsKSBjb3VudCArPSAxO1xuICB9XG4gIHJldHVybiBjb3VudDtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG1lZGlhbiBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuc3RhdHMubWVkaWFuID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIGlmICghdXRpbC5pc0FycmF5KHZhbHVlcykgfHwgdmFsdWVzLmxlbmd0aD09PTApIHJldHVybiAwO1xuICBpZiAoZikgdmFsdWVzID0gdmFsdWVzLm1hcChmKTtcbiAgdmFsdWVzID0gdmFsdWVzLmZpbHRlcih1dGlsLmlzTm90TnVsbCkuc29ydCh1dGlsLmNtcCk7XG4gIHZhciBoYWxmID0gTWF0aC5mbG9vcih2YWx1ZXMubGVuZ3RoLzIpO1xuICBpZiAodmFsdWVzLmxlbmd0aCAlIDIpIHtcbiAgICByZXR1cm4gdmFsdWVzW2hhbGZdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAodmFsdWVzW2hhbGYtMV0gKyB2YWx1ZXNbaGFsZl0pIC8gMi4wO1xuICB9XG59O1xuXG4vLyBDb21wdXRlIHRoZSBxdWFudGlsZSBvZiBhIHNvcnRlZCBhcnJheSBvZiBudW1iZXJzLlxuLy8gQWRhcHRlZCBmcm9tIHRoZSBEMy5qcyBpbXBsZW1lbnRhdGlvbi5cbnN0YXRzLnF1YW50aWxlID0gZnVuY3Rpb24odmFsdWVzLCBmLCBwKSB7XG4gIGlmIChwID09PSB1bmRlZmluZWQpIHsgcCA9IGY7IGYgPSB1dGlsLmlkZW50aXR5OyB9XG4gIHZhciBIID0gKHZhbHVlcy5sZW5ndGggLSAxKSAqIHAgKyAxLFxuICAgICAgaCA9IE1hdGguZmxvb3IoSCksXG4gICAgICB2ID0gK2YodmFsdWVzW2ggLSAxXSksXG4gICAgICBlID0gSCAtIGg7XG4gIHJldHVybiBlID8gdiArIGUgKiAoZih2YWx1ZXNbaF0pIC0gdikgOiB2O1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgbWVhbiAoYXZlcmFnZSkgb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLm1lYW4gPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgaWYgKCF1dGlsLmlzQXJyYXkodmFsdWVzKSB8fCB2YWx1ZXMubGVuZ3RoPT09MCkgcmV0dXJuIDA7XG4gIHZhciBtZWFuID0gMCwgZGVsdGEsIGksIGMsIHY7XG4gIGZvciAoaT0wLCBjPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG4gICAgaWYgKHYgIT0gbnVsbCAmJiAhaXNOYU4odikpIHtcbiAgICAgIGRlbHRhID0gdiAtIG1lYW47XG4gICAgICBtZWFuID0gbWVhbiArIGRlbHRhIC8gKCsrYyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtZWFuO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIHZhcmlhbmNlIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy52YXJpYW5jZSA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICBpZiAoIXV0aWwuaXNBcnJheSh2YWx1ZXMpIHx8IHZhbHVlcy5sZW5ndGg9PT0wKSByZXR1cm4gMDtcbiAgdmFyIG1lYW4gPSAwLCBNMiA9IDAsIGRlbHRhLCBpLCBjLCB2O1xuICBmb3IgKGk9MCwgYz0wOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIGlmICh2ICE9IG51bGwgJiYgIWlzTmFOKHYpKSB7XG4gICAgICBkZWx0YSA9IHYgLSBtZWFuO1xuICAgICAgbWVhbiA9IG1lYW4gKyBkZWx0YSAvICgrK2MpO1xuICAgICAgTTIgPSBNMiArIGRlbHRhICogKHYgLSBtZWFuKTtcbiAgICB9XG4gIH1cbiAgTTIgPSBNMiAvIChjIC0gMSk7XG4gIHJldHVybiBNMjtcbn07XG5cbi8vIENvbXB1dGUgdGhlIHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb24gb2YgYW4gYXJyYXkgb2YgbnVtYmVycy5cbnN0YXRzLnN0ZGV2ID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHJldHVybiBNYXRoLnNxcnQoc3RhdHMudmFyaWFuY2UodmFsdWVzLCBmKSk7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBQZWFyc29uIG1vZGUgc2tld25lc3MgKChtZWRpYW4tbWVhbikvc3RkZXYpIG9mIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5tb2Rlc2tldyA9IGZ1bmN0aW9uKHZhbHVlcywgZikge1xuICB2YXIgYXZnID0gc3RhdHMubWVhbih2YWx1ZXMsIGYpLFxuICAgICAgbWVkID0gc3RhdHMubWVkaWFuKHZhbHVlcywgZiksXG4gICAgICBzdGQgPSBzdGF0cy5zdGRldih2YWx1ZXMsIGYpO1xuICByZXR1cm4gc3RkID09PSAwID8gMCA6IChhdmcgLSBtZWQpIC8gc3RkO1xufTtcblxuLy8gRmluZCB0aGUgbWluaW11bSBhbmQgbWF4aW11bSBvZiBhbiBhcnJheSBvZiB2YWx1ZXMuXG5zdGF0cy5leHRlbnQgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgdmFyIGEsIGIsIHYsIGksIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICB2ID0gKHR5cGVvZiB2ID09PSAnc3RyaW5nJykgPyB2Lmxlbmd0aCA6IHY7XG4gICAgaWYgKHV0aWwuaXNOb3ROdWxsKHYpKSB7IGEgPSBiID0gdjsgYnJlYWs7IH1cbiAgfVxuICBmb3IgKDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICB2ID0gKHR5cGVvZiB2ID09PSAnc3RyaW5nJykgPyB2Lmxlbmd0aCA6IHY7XG4gICAgaWYgKHV0aWwuaXNOb3ROdWxsKHYpKSB7XG4gICAgICBpZiAodiA8IGEpIGEgPSB2O1xuICAgICAgaWYgKHYgPiBiKSBiID0gdjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFthLCBiXTtcbn07XG5cbi8vIEZpbmQgdGhlIGludGVnZXIgaW5kaWNlcyBvZiB0aGUgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMuXG5zdGF0cy5leHRlbnQuaW5kZXggPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgdmFyIGEsIGIsIHgsIHksIHYsIGksIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICB2ID0gZiA/IGYodmFsdWVzW2ldKSA6IHZhbHVlc1tpXTtcbiAgICB2ID0gKHR5cGVvZiB2ID09PSAnc3RyaW5nJykgPyB2Lmxlbmd0aCA6IHY7XG4gICAgaWYgKHV0aWwuaXNOb3ROdWxsKHYpKSB7IGEgPSBiID0gdjsgeCA9IHkgPSBpOyBicmVhazsgfVxuICB9XG4gIGZvciAoOyBpPG47ICsraSkge1xuICAgIHYgPSBmID8gZih2YWx1ZXNbaV0pIDogdmFsdWVzW2ldO1xuICAgIHYgPSAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSA/IHYubGVuZ3RoIDogdjtcbiAgICBpZiAodXRpbC5pc05vdE51bGwodikpIHtcbiAgICAgIGlmICh2IDwgYSkgeyBhID0gdjsgeCA9IGk7IH1cbiAgICAgIGlmICh2ID4gYikgeyBiID0gdjsgeSA9IGk7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFt4LCB5XTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byBhcnJheXMgb2YgbnVtYmVycy5cbnN0YXRzLmRvdCA9IGZ1bmN0aW9uKHZhbHVlcywgYSwgYikge1xuICB2YXIgc3VtID0gMCwgaSwgdjtcbiAgaWYgKCFiKSB7XG4gICAgaWYgKHZhbHVlcy5sZW5ndGggIT09IGEubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihcIkFycmF5IGxlbmd0aHMgbXVzdCBtYXRjaC5cIik7XG4gICAgfVxuICAgIGZvciAoaT0wOyBpPHZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgICAgdiA9IHZhbHVlc1tpXSAqIGFbaV07XG4gICAgICBpZiAoIWlzTmFOKHYpKSBzdW0gKz0gdjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2ID0gYSh2YWx1ZXNbaV0pICogYih2YWx1ZXNbaV0pO1xuICAgICAgaWYgKCFpc05hTih2KSkgc3VtICs9IHY7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdW07XG59O1xuXG4vLyBDb21wdXRlIGFzY2VuZGluZyByYW5rIHNjb3JlcyBmb3IgYW4gYXJyYXkgb2YgdmFsdWVzLlxuLy8gVGllcyBhcmUgYXNzaWduZWQgdGhlaXIgY29sbGVjdGl2ZSBtZWFuIHJhbmsuXG5zdGF0cy5yYW5rID0gZnVuY3Rpb24odmFsdWVzLCBmKSB7XG4gIHZhciBhID0gdmFsdWVzLm1hcChmdW5jdGlvbih2LCBpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZHg6IGksXG4gICAgICAgIHZhbDogKGYgPyBmKHYpIDogdilcbiAgICAgIH07XG4gICAgfSlcbiAgICAuc29ydCh1dGlsLmNvbXBhcmF0b3IoXCJ2YWxcIikpO1xuXG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIHIgPSBBcnJheShuKSxcbiAgICAgIHRpZSA9IC0xLCBwID0ge30sIGksIHYsIG11O1xuXG4gIGZvciAoaT0wOyBpPG47ICsraSkge1xuICAgIHYgPSBhW2ldLnZhbDtcbiAgICBpZiAodGllIDwgMCAmJiBwID09PSB2KSB7XG4gICAgICB0aWUgPSBpIC0gMTtcbiAgICB9IGVsc2UgaWYgKHRpZSA+IC0xICYmIHAgIT09IHYpIHtcbiAgICAgIG11ID0gMSArIChpLTEgKyB0aWUpIC8gMjtcbiAgICAgIGZvciAoOyB0aWU8aTsgKyt0aWUpIHJbYVt0aWVdLmlkeF0gPSBtdTtcbiAgICAgIHRpZSA9IC0xO1xuICAgIH1cbiAgICByW2FbaV0uaWR4XSA9IGkgKyAxO1xuICAgIHAgPSB2O1xuICB9XG5cbiAgaWYgKHRpZSA+IC0xKSB7XG4gICAgbXUgPSAxICsgKG4tMSArIHRpZSkgLyAyO1xuICAgIGZvciAoOyB0aWU8bjsgKyt0aWUpIHJbYVt0aWVdLmlkeF0gPSBtdTtcbiAgfVxuXG4gIHJldHVybiByO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIFBlYXJzb24gcHJvZHVjdC1tb21lbnQgY29ycmVsYXRpb24gb2YgdHdvIGFycmF5cyBvZiBudW1iZXJzLlxuc3RhdHMuY29yID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciBmbiA9IGI7XG4gIGIgPSBmbiA/IHZhbHVlcy5tYXAoYikgOiBhLFxuICBhID0gZm4gPyB2YWx1ZXMubWFwKGEpIDogdmFsdWVzO1xuXG4gIHZhciBkb3QgPSBzdGF0cy5kb3QoYSwgYiksXG4gICAgICBtdWEgPSBzdGF0cy5tZWFuKGEpLFxuICAgICAgbXViID0gc3RhdHMubWVhbihiKSxcbiAgICAgIHNkYSA9IHN0YXRzLnN0ZGV2KGEpLFxuICAgICAgc2RiID0gc3RhdHMuc3RkZXYoYiksXG4gICAgICBuID0gdmFsdWVzLmxlbmd0aDtcblxuICByZXR1cm4gKGRvdCAtIG4qbXVhKm11YikgLyAoKG4tMSkgKiBzZGEgKiBzZGIpO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgU3BlYXJtYW4gcmFuayBjb3JyZWxhdGlvbiBvZiB0d28gYXJyYXlzIG9mIHZhbHVlcy5cbnN0YXRzLmNvci5yYW5rID0gZnVuY3Rpb24odmFsdWVzLCBhLCBiKSB7XG4gIHZhciByYSA9IGIgPyBzdGF0cy5yYW5rKHZhbHVlcywgYSkgOiBzdGF0cy5yYW5rKHZhbHVlcyksXG4gICAgICByYiA9IGIgPyBzdGF0cy5yYW5rKHZhbHVlcywgYikgOiBzdGF0cy5yYW5rKGEpLFxuICAgICAgbiA9IHZhbHVlcy5sZW5ndGgsIGksIHMsIGQ7XG5cbiAgZm9yIChpPTAsIHM9MDsgaTxuOyArK2kpIHtcbiAgICBkID0gcmFbaV0gLSByYltpXTtcbiAgICBzICs9IGQgKiBkO1xuICB9XG5cbiAgcmV0dXJuIDEgLSA2KnMgLyAobiAqIChuKm4tMSkpO1xufTtcblxuLy8gQ29tcHV0ZSB0aGUgZGlzdGFuY2UgY29ycmVsYXRpb24gb2YgdHdvIGFycmF5cyBvZiBudW1iZXJzLlxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EaXN0YW5jZV9jb3JyZWxhdGlvblxuc3RhdHMuY29yLmRpc3QgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIpIHtcbiAgdmFyIFggPSBiID8gdmFsdWVzLm1hcChhKSA6IHZhbHVlcyxcbiAgICAgIFkgPSBiID8gdmFsdWVzLm1hcChiKSA6IGE7XG5cbiAgdmFyIEEgPSBzdGF0cy5kaXN0Lm1hdChYKSxcbiAgICAgIEIgPSBzdGF0cy5kaXN0Lm1hdChZKSxcbiAgICAgIG4gPSBBLmxlbmd0aCxcbiAgICAgIGksIGFhLCBiYiwgYWI7XG5cbiAgZm9yIChpPTAsIGFhPTAsIGJiPTAsIGFiPTA7IGk8bjsgKytpKSB7XG4gICAgYWEgKz0gQVtpXSpBW2ldO1xuICAgIGJiICs9IEJbaV0qQltpXTtcbiAgICBhYiArPSBBW2ldKkJbaV07XG4gIH1cblxuICByZXR1cm4gTWF0aC5zcXJ0KGFiIC8gTWF0aC5zcXJ0KGFhKmJiKSk7XG59O1xuXG4vLyBDb21wdXRlIHRoZSB2ZWN0b3IgZGlzdGFuY2UgYmV0d2VlbiB0d28gYXJyYXlzIG9mIG51bWJlcnMuXG4vLyBEZWZhdWx0IGlzIEV1Y2xpZGVhbiAoZXhwPTIpIGRpc3RhbmNlLCBjb25maWd1cmFibGUgdmlhIGV4cCBhcmd1bWVudC5cbnN0YXRzLmRpc3QgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIsIGV4cCkge1xuICB2YXIgZiA9IHV0aWwuaXNGdW5jdGlvbihiKSxcbiAgICAgIFggPSB2YWx1ZXMsXG4gICAgICBZID0gZiA/IHZhbHVlcyA6IGEsXG4gICAgICBlID0gZiA/IGV4cCA6IGIsXG4gICAgICBuID0gdmFsdWVzLmxlbmd0aCwgcyA9IDAsIGQsIGk7XG5cbiAgaWYgKGUgPT09IDIgfHwgZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgICBkID0gZiA/IChhKFhbaV0pLWIoWVtpXSkpIDogKFhbaV0tWVtpXSk7XG4gICAgICBzICs9IGQqZDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguc3FydChzKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICAgIGQgPSBNYXRoLmFicyhmID8gKGEoWFtpXSktYihZW2ldKSkgOiAoWFtpXS1ZW2ldKSk7XG4gICAgICBzICs9IE1hdGgucG93KGQsIGUpO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5wb3cocywgMS9lKTtcbiAgfVxufTtcblxuLy8gQ29uc3RydWN0IGEgbWVhbi1jZW50ZXJlZCBkaXN0YW5jZSBtYXRyaXggZm9yIGFuIGFycmF5IG9mIG51bWJlcnMuXG5zdGF0cy5kaXN0Lm1hdCA9IGZ1bmN0aW9uKFgpIHtcbiAgdmFyIG4gPSBYLmxlbmd0aCxcbiAgICAgIG0gPSBuKm4sXG4gICAgICBBID0gQXJyYXkobSksXG4gICAgICBSID0gZ2VuLnplcm9zKG4pLFxuICAgICAgTSA9IDAsIHYsIGksIGo7XG5cbiAgZm9yIChpPTA7IGk8bjsgKytpKSB7XG4gICAgQVtpKm4raV0gPSAwO1xuICAgIGZvciAoaj1pKzE7IGo8bjsgKytqKSB7XG4gICAgICBBW2kqbitqXSA9ICh2ID0gTWF0aC5hYnMoWFtpXSAtIFhbal0pKTtcbiAgICAgIEFbaipuK2ldID0gdjtcbiAgICAgIFJbaV0gKz0gdjtcbiAgICAgIFJbal0gKz0gdjtcbiAgICB9XG4gIH1cblxuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBNICs9IFJbaV07XG4gICAgUltpXSAvPSBuO1xuICB9XG4gIE0gLz0gbTtcblxuICBmb3IgKGk9MDsgaTxuOyArK2kpIHtcbiAgICBmb3IgKGo9aTsgajxuOyArK2opIHtcbiAgICAgIEFbaSpuK2pdICs9IE0gLSBSW2ldIC0gUltqXTtcbiAgICAgIEFbaipuK2ldID0gQVtpKm4ral07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEE7XG59O1xuXG4vLyBDb21wdXRlIHRoZSBTaGFubm9uIGVudHJvcHkgKGxvZyBiYXNlIDIpIG9mIGFuIGFycmF5IG9mIGNvdW50cy5cbnN0YXRzLmVudHJvcHkgPSBmdW5jdGlvbihjb3VudHMsIGYpIHtcbiAgdmFyIGksIHAsIHMgPSAwLCBIID0gMCwgTiA9IGNvdW50cy5sZW5ndGg7XG4gIGZvciAoaT0wOyBpPE47ICsraSkge1xuICAgIHMgKz0gKGYgPyBmKGNvdW50c1tpXSkgOiBjb3VudHNbaV0pO1xuICB9XG4gIGlmIChzID09PSAwKSByZXR1cm4gMDtcbiAgZm9yIChpPTA7IGk8TjsgKytpKSB7XG4gICAgcCA9IChmID8gZihjb3VudHNbaV0pIDogY291bnRzW2ldKSAvIHM7XG4gICAgaWYgKHAgPiAwKSBIICs9IHAgKiBNYXRoLmxvZyhwKSAvIE1hdGguTE4yO1xuICB9XG4gIHJldHVybiAtSDtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG5vcm1hbGl6ZWQgU2hhbm5vbiBlbnRyb3B5IChsb2cgYmFzZSAyKSBvZiBhbiBhcnJheSBvZiBjb3VudHMuXG5zdGF0cy5lbnRyb3B5Lm5vcm1hbGl6ZWQgPSBmdW5jdGlvbihjb3VudHMsIGYpIHtcbiAgdmFyIEggPSBzdGF0cy5lbnRyb3B5KGNvdW50cywgZik7XG4gIHJldHVybiBIPT09MCA/IDAgOiBIICogTWF0aC5MTjIgLyBNYXRoLmxvZyhjb3VudHMubGVuZ3RoKTtcbn07XG5cbi8vIENvbXB1dGUgdGhlIG11dHVhbCBpbmZvcm1hdGlvbiBiZXR3ZWVuIHR3byBkaXNjcmV0ZSB2YXJpYWJsZXMuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL011dHVhbF9pbmZvcm1hdGlvblxuc3RhdHMuZW50cm9weS5tdXR1YWwgPSBmdW5jdGlvbih2YWx1ZXMsIGEsIGIsIGNvdW50cykge1xuICB2YXIgeCA9IGNvdW50cyA/IHZhbHVlcy5tYXAoYSkgOiB2YWx1ZXMsXG4gICAgICB5ID0gY291bnRzID8gdmFsdWVzLm1hcChiKSA6IGEsXG4gICAgICB6ID0gY291bnRzID8gdmFsdWVzLm1hcChjb3VudHMpIDogYjtcblxuICB2YXIgcHggPSB7fSxcblx0ICAgIHB5ID0ge30sXG5cdCAgICBpLCB4eCwgeXksIHp6LCBzID0gMCwgdCwgTiA9IHoubGVuZ3RoLCBwLCBJID0gMDtcblxuXHRmb3IgKGk9MDsgaTxOOyArK2kpIHtcblx0ICBweFt4W2ldXSA9IDA7XG5cdCAgcHlbeVtpXV0gPSAwO1xuICB9XG5cblx0Zm9yIChpPTA7IGk8TjsgKytpKSB7XG5cdFx0cHhbeFtpXV0gKz0geltpXTtcblx0XHRweVt5W2ldXSArPSB6W2ldO1xuXHRcdHMgKz0geltpXTtcblx0fVxuXG5cdHQgPSAxIC8gKHMgKiBNYXRoLkxOMik7XG5cdGZvciAoaT0wOyBpPE47ICsraSkge1xuXHRcdGlmICh6W2ldID09PSAwKSBjb250aW51ZTtcblx0XHRwID0gKHMgKiB6W2ldKSAvIChweFt4W2ldXSAqIHB5W3lbaV1dKTtcblx0XHRJICs9IHpbaV0gKiB0ICogTWF0aC5sb2cocCk7XG5cdH1cblxuXHRyZXR1cm4gSTtcbn07XG5cbi8vIENvbXB1dGUgYSBwcm9maWxlIG9mIHN1bW1hcnkgc3RhdGlzdGljcyBmb3IgYSB2YXJpYWJsZS5cbnN0YXRzLnByb2ZpbGUgPSBmdW5jdGlvbih2YWx1ZXMsIGYpIHtcbiAgdmFyIHAgPSB7fSxcbiAgICAgIG1lYW4gPSAwLFxuICAgICAgY291bnQgPSAwLFxuICAgICAgZGlzdGluY3QgPSAwLFxuICAgICAgbWluID0gbnVsbCxcbiAgICAgIG1heCA9IG51bGwsXG4gICAgICBNMiA9IDAsXG4gICAgICB2YWxzID0gW10sXG4gICAgICB1ID0ge30sIGRlbHRhLCBzZCwgaSwgdiwgeCwgaGFsZiwgaCwgaDI7XG5cbiAgLy8gY29tcHV0ZSBzdW1tYXJ5IHN0YXRzXG4gIGZvciAoaT0wLCBjPTA7IGk8dmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgdiA9IGYgPyBmKHZhbHVlc1tpXSkgOiB2YWx1ZXNbaV07XG5cbiAgICAvLyB1cGRhdGUgdW5pcXVlIHZhbHVlc1xuICAgIHVbdl0gPSAodiBpbiB1KSA/IHVbdl0gKyAxIDogKGRpc3RpbmN0ICs9IDEsIDEpO1xuXG4gICAgaWYgKHV0aWwuaXNOb3ROdWxsKHYpKSB7XG4gICAgICAvLyB1cGRhdGUgc3RhdHNcbiAgICAgIHggPSAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSA/IHYubGVuZ3RoIDogdjtcbiAgICAgIGlmIChtaW49PT1udWxsIHx8IHggPCBtaW4pIG1pbiA9IHg7XG4gICAgICBpZiAobWF4PT09bnVsbCB8fCB4ID4gbWF4KSBtYXggPSB4O1xuXG4gICAgICBkZWx0YSA9IHggLSBtZWFuO1xuICAgICAgbWVhbiA9IG1lYW4gKyBkZWx0YSAvICgrK2NvdW50KTtcbiAgICAgIE0yID0gTTIgKyBkZWx0YSAqICh4IC0gbWVhbik7XG4gICAgICB2YWxzLnB1c2goeCk7XG4gICAgfVxuICB9XG4gIE0yID0gTTIgLyAoY291bnQgLSAxKTtcbiAgc2QgPSBNYXRoLnNxcnQoTTIpO1xuXG4gIC8vIHNvcnQgdmFsdWVzIGZvciBtZWRpYW4gYW5kIGlxclxuICB2YWxzLnNvcnQodXRpbC5jbXApO1xuXG4gIHJldHVybiB7XG4gICAgdW5pcXVlOiAgIHUsXG4gICAgY291bnQ6ICAgIGNvdW50LFxuICAgIG51bGxzOiAgICB2YWx1ZXMubGVuZ3RoIC0gY291bnQsXG4gICAgZGlzdGluY3Q6IGRpc3RpbmN0LFxuICAgIG1pbjogICAgICBtaW4sXG4gICAgbWF4OiAgICAgIG1heCxcbiAgICBtZWFuOiAgICAgbWVhbixcbiAgICBzdGRldjogICAgc2QsXG4gICAgbWVkaWFuOiAgICh2ID0gc3RhdHMucXVhbnRpbGUodmFscywgMC41KSksXG4gICAgbW9kZXNrZXc6IHNkID09PSAwID8gMCA6IChtZWFuIC0gdikgLyBzZCxcbiAgICBpcXI6ICAgICAgW3N0YXRzLnF1YW50aWxlKHZhbHMsIDAuMjUpLCBzdGF0cy5xdWFudGlsZSh2YWxzLCAwLjc1KV1cbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhdHM7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBzdGF0cyA9IHJlcXVpcmUoJy4vc3RhdHMnKTtcblxuLy8gQ29tcHV0ZSBwcm9maWxlcyBmb3IgYWxsIHZhcmlhYmxlcyBpbiBhIGRhdGEgc2V0LlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhLCBmaWVsZHMpIHtcbiAgaWYgKGRhdGEgPT0gbnVsbCB8fCBkYXRhLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gIGZpZWxkcyA9IGZpZWxkcyB8fCB1dGlsLmtleXMoZGF0YVswXSk7XG5cbiAgdmFyIHByb2ZpbGVzID0gZmllbGRzLm1hcChmdW5jdGlvbihmKSB7XG4gICAgdmFyIHAgPSBzdGF0cy5wcm9maWxlKGRhdGEsIHV0aWwuYWNjZXNzb3IoZikpO1xuICAgIHJldHVybiAocC5maWVsZCA9IGYsIHApO1xuICB9KTtcbiAgXG4gIHByb2ZpbGVzLnRvU3RyaW5nID0gcHJpbnRTdW1tYXJ5O1xuICByZXR1cm4gcHJvZmlsZXM7XG59O1xuXG5mdW5jdGlvbiBwcmludFN1bW1hcnkoKSB7XG4gIHZhciBwcm9maWxlcyA9IHRoaXM7XG4gIHZhciBzdHIgPSBbXTtcbiAgcHJvZmlsZXMuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgc3RyLnB1c2goXCItLS0tLSBGaWVsZDogJ1wiICsgcC5maWVsZCArIFwiJyAtLS0tLVwiKTtcbiAgICBpZiAodHlwZW9mIHAubWluID09PSAnc3RyaW5nJyB8fCBwLmRpc3RpbmN0IDwgMTApIHtcbiAgICAgIHN0ci5wdXNoKHByaW50Q2F0ZWdvcmljYWxQcm9maWxlKHApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyLnB1c2gocHJpbnRRdWFudGl0YXRpdmVQcm9maWxlKHApKTtcbiAgICB9XG4gICAgc3RyLnB1c2goXCJcIik7XG4gIH0pO1xuICByZXR1cm4gc3RyLmpvaW4oXCJcXG5cIik7XG59XG5cbmZ1bmN0aW9uIHByaW50UXVhbnRpdGF0aXZlUHJvZmlsZShwKSB7XG4gIHJldHVybiBbXG4gICAgXCJkaXN0aW5jdDogXCIgKyBwLmRpc3RpbmN0LFxuICAgIFwibnVsbHM6ICAgIFwiICsgcC5udWxscyxcbiAgICBcIm1pbjogICAgICBcIiArIHAubWluLFxuICAgIFwibWF4OiAgICAgIFwiICsgcC5tYXgsXG4gICAgXCJtZWRpYW46ICAgXCIgKyBwLm1lZGlhbixcbiAgICBcIm1lYW46ICAgICBcIiArIHAubWVhbixcbiAgICBcInN0ZGV2OiAgICBcIiArIHAuc3RkZXYsXG4gICAgXCJtb2Rlc2tldzogXCIgKyBwLm1vZGVza2V3XG4gIF0uam9pbihcIlxcblwiKTtcbn1cblxuZnVuY3Rpb24gcHJpbnRDYXRlZ29yaWNhbFByb2ZpbGUocCkge1xuICB2YXIgbGlzdCA9IFtcbiAgICBcImRpc3RpbmN0OiBcIiArIHAuZGlzdGluY3QsXG4gICAgXCJudWxsczogICAgXCIgKyBwLm51bGxzLFxuICAgIFwidG9wIHZhbHVlczogXCJcbiAgXTtcbiAgdmFyIHUgPSBwLnVuaXF1ZTtcbiAgdmFyIHRvcCA9IHV0aWwua2V5cyh1KVxuICAgIC5zb3J0KGZ1bmN0aW9uKGEsYikgeyByZXR1cm4gdVtiXSAtIHVbYV07IH0pXG4gICAgLnNsaWNlKDAsIDYpXG4gICAgLm1hcChmdW5jdGlvbih2KSB7IHJldHVybiBcIiAnXCIgKyB2ICsgXCInIChcIiArIHVbdl0gKyBcIilcIjsgfSk7XG4gIHJldHVybiBsaXN0LmNvbmNhdCh0b3ApLmpvaW4oXCJcXG5cIik7XG59IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBkMyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LmQzIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5kMyA6IG51bGwpO1xuXG52YXIgY29udGV4dCA9IHtcbiAgZm9ybWF0czogICAgW10sXG4gIGZvcm1hdF9tYXA6IHt9LFxuICB0cnVuY2F0ZTogICB1dGlsLnRydW5jYXRlXG59O1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZXh0KSB7XG4gIHZhciBzcmMgPSBzb3VyY2UodGV4dCwgXCJkXCIpO1xuICBzcmMgPSBcInZhciBfX3Q7IHJldHVybiBcIiArIHNyYyArIFwiO1wiO1xuXG4gIHRyeSB7XG4gICAgcmV0dXJuIChuZXcgRnVuY3Rpb24oXCJkXCIsIHNyYykpLmJpbmQoY29udGV4dCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlLnNvdXJjZSA9IHNyYztcbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cbi8vIGNsZWFyIGNhY2hlIG9mIGZvcm1hdCBvYmplY3RzXG4vLyBjYW4gKmJyZWFrKiBwcmlvciB0ZW1wbGF0ZSBmdW5jdGlvbnMsIHNvIGludm9rZSB3aXRoIGNhcmVcbnRlbXBsYXRlLmNsZWFyRm9ybWF0Q2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgY29udGV4dC5mb3JtYXRzID0gW107XG4gIGNvbnRleHQuZm9ybWF0X21hcCA9IHt9O1xufTtcblxuZnVuY3Rpb24gc291cmNlKHRleHQsIHZhcmlhYmxlKSB7XG4gIHZhcmlhYmxlID0gdmFyaWFibGUgfHwgXCJvYmpcIjtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIHNyYyA9IFwiJ1wiO1xuICB2YXIgcmVnZXggPSB0ZW1wbGF0ZV9yZTtcblxuICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICB0ZXh0LnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uKG1hdGNoLCBpbnRlcnBvbGF0ZSwgb2Zmc2V0KSB7XG4gICAgc3JjICs9IHRleHRcbiAgICAgIC5zbGljZShpbmRleCwgb2Zmc2V0KVxuICAgICAgLnJlcGxhY2UodGVtcGxhdGVfZXNjYXBlciwgdGVtcGxhdGVfZXNjYXBlQ2hhcik7XG4gICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgIHNyYyArPSBcIidcXG4rKChfX3Q9KFwiXG4gICAgICAgICsgdGVtcGxhdGVfdmFyKGludGVycG9sYXRlLCB2YXJpYWJsZSlcbiAgICAgICAgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgIH1cblxuICAgIC8vIEFkb2JlIFZNcyBuZWVkIHRoZSBtYXRjaCByZXR1cm5lZCB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IG9mZmVzdC5cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH0pO1xuICByZXR1cm4gc3JjICsgXCInXCI7XG59XG5cbmZ1bmN0aW9uIHRlbXBsYXRlX3Zhcih0ZXh0LCB2YXJpYWJsZSkge1xuICB2YXIgZmlsdGVycyA9IHRleHQuc3BsaXQoJ3wnKTtcbiAgdmFyIHByb3AgPSBmaWx0ZXJzLnNoaWZ0KCkudHJpbSgpO1xuICB2YXIgZm9ybWF0ID0gW107XG4gIHZhciBzdHJpbmdDYXN0ID0gdHJ1ZTtcbiAgXG4gIGZ1bmN0aW9uIHN0cmNhbGwoZm4pIHtcbiAgICBmbiA9IGZuIHx8IFwiXCI7XG4gICAgaWYgKHN0cmluZ0Nhc3QpIHtcbiAgICAgIHN0cmluZ0Nhc3QgPSBmYWxzZTtcbiAgICAgIHNyYyA9IFwiU3RyaW5nKFwiICsgc3JjICsgXCIpXCIgKyBmbjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3JjICs9IGZuO1xuICAgIH1cbiAgICByZXR1cm4gc3JjO1xuICB9XG4gIFxuICB2YXIgc3JjID0gdXRpbC5maWVsZChwcm9wKS5tYXAodXRpbC5zdHIpLmpvaW4oXCJdW1wiKTtcbiAgc3JjID0gdmFyaWFibGUgKyBcIltcIiArIHNyYyArIFwiXVwiO1xuICBcbiAgZm9yICh2YXIgaT0wOyBpPGZpbHRlcnMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgZiA9IGZpbHRlcnNbaV0sIGFyZ3MgPSBudWxsLCBwaWR4LCBhLCBiO1xuXG4gICAgaWYgKChwaWR4PWYuaW5kZXhPZignOicpKSA+IDApIHtcbiAgICAgIGYgPSBmLnNsaWNlKDAsIHBpZHgpO1xuICAgICAgYXJncyA9IGZpbHRlcnNbaV0uc2xpY2UocGlkeCsxKS5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocykgeyByZXR1cm4gcy50cmltKCk7IH0pO1xuICAgIH1cbiAgICBmID0gZi50cmltKCk7XG5cbiAgICBzd2l0Y2ggKGYpIHtcbiAgICAgIGNhc2UgJ2xlbmd0aCc6XG4gICAgICAgIHN0cmNhbGwoJy5sZW5ndGgnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsb3dlcic6XG4gICAgICAgIHN0cmNhbGwoJy50b0xvd2VyQ2FzZSgpJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndXBwZXInOlxuICAgICAgICBzdHJjYWxsKCcudG9VcHBlckNhc2UoKScpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xvd2VyLWxvY2FsZSc6XG4gICAgICAgIHN0cmNhbGwoJy50b0xvY2FsZUxvd2VyQ2FzZSgpJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndXBwZXItbG9jYWxlJzpcbiAgICAgICAgc3RyY2FsbCgnLnRvTG9jYWxlVXBwZXJDYXNlKCknKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0cmltJzpcbiAgICAgICAgc3RyY2FsbCgnLnRyaW0oKScpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICBhID0gdXRpbC5udW1iZXIoYXJnc1swXSk7XG4gICAgICAgIHN0cmNhbGwoJy5zbGljZSgwLCcgKyBhICsgJyknKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgIGEgPSB1dGlsLm51bWJlcihhcmdzWzBdKTtcbiAgICAgICAgc3RyY2FsbCgnLnNsaWNlKC0nICsgYSArJyknKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtaWQnOlxuICAgICAgICBhID0gdXRpbC5udW1iZXIoYXJnc1swXSk7XG4gICAgICAgIGIgPSBhICsgdXRpbC5udW1iZXIoYXJnc1sxXSk7XG4gICAgICAgIHN0cmNhbGwoJy5zbGljZSgrJythKycsJytiKycpJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2xpY2UnOlxuICAgICAgICBhID0gdXRpbC5udW1iZXIoYXJnc1swXSk7XG4gICAgICAgIHN0cmNhbGwoJy5zbGljZSgnKyBhXG4gICAgICAgICAgKyAoYXJncy5sZW5ndGggPiAxID8gJywnICsgdXRpbC5udW1iZXIoYXJnc1sxXSkgOiAnJylcbiAgICAgICAgICArICcpJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndHJ1bmNhdGUnOlxuICAgICAgICBhID0gdXRpbC5udW1iZXIoYXJnc1swXSk7XG4gICAgICAgIGIgPSBhcmdzWzFdO1xuICAgICAgICBiID0gKGIhPT1cImxlZnRcIiAmJiBiIT09XCJtaWRkbGVcIiAmJiBiIT09XCJjZW50ZXJcIikgPyBcInJpZ2h0XCIgOiBiO1xuICAgICAgICBzcmMgPSAndGhpcy50cnVuY2F0ZSgnICsgc3RyY2FsbCgpICsgJywnICsgYSArICcsXCInICsgYiArICdcIiknO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGEgPSB0ZW1wbGF0ZV9mb3JtYXQoYXJnc1swXSwgZDMuZm9ybWF0KTtcbiAgICAgICAgc3RyaW5nQ2FzdCA9IGZhbHNlO1xuICAgICAgICBzcmMgPSAndGhpcy5mb3JtYXRzWycrYSsnXSgnK3NyYysnKSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIGEgPSB0ZW1wbGF0ZV9mb3JtYXQoYXJnc1swXSwgZDMudGltZS5mb3JtYXQpO1xuICAgICAgICBzdHJpbmdDYXN0ID0gZmFsc2U7XG4gICAgICAgIHNyYyA9ICd0aGlzLmZvcm1hdHNbJythKyddKCcrc3JjKycpJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBFcnJvcihcIlVucmVjb2duaXplZCB0ZW1wbGF0ZSBmaWx0ZXI6IFwiICsgZik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNyYztcbn1cblxudmFyIHRlbXBsYXRlX3JlID0gL1xce1xceyguKz8pXFx9XFx9fCQvZztcblxuLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbi8vIHN0cmluZyBsaXRlcmFsLlxudmFyIHRlbXBsYXRlX2VzY2FwZXMgPSB7XG4gIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICdcXHInOiAgICAgJ3InLFxuICAnXFxuJzogICAgICduJyxcbiAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAnXFx1MjAyOSc6ICd1MjAyOSdcbn07XG5cbnZhciB0ZW1wbGF0ZV9lc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZV9lc2NhcGVDaGFyKG1hdGNoKSB7XG4gIHJldHVybiAnXFxcXCcgKyB0ZW1wbGF0ZV9lc2NhcGVzW21hdGNoXTtcbn1cblxuZnVuY3Rpb24gdGVtcGxhdGVfZm9ybWF0KHBhdHRlcm4sIGZtdCkge1xuICBpZiAoKHBhdHRlcm5bMF0gPT09IFwiJ1wiICYmIHBhdHRlcm5bcGF0dGVybi5sZW5ndGgtMV0gPT09IFwiJ1wiKSB8fFxuICAgICAgKHBhdHRlcm5bMF0gIT09ICdcIicgJiYgcGF0dGVybltwYXR0ZXJuLmxlbmd0aC0xXSA9PT0gJ1wiJykpIHtcbiAgICBwYXR0ZXJuID0gcGF0dGVybi5zbGljZSgxLCAtMSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoXCJGb3JtYXQgcGF0dGVybiBtdXN0IGJlIHF1b3RlZDogXCIgKyBwYXR0ZXJuKTtcbiAgfVxuICBpZiAoIWNvbnRleHQuZm9ybWF0X21hcFtwYXR0ZXJuXSkge1xuICAgIHZhciBmID0gZm10KHBhdHRlcm4pO1xuICAgIHZhciBpID0gY29udGV4dC5mb3JtYXRzLmxlbmd0aDtcbiAgICBjb250ZXh0LmZvcm1hdHMucHVzaChmKTtcbiAgICBjb250ZXh0LmZvcm1hdF9tYXBbcGF0dGVybl0gPSBpO1xuICB9XG4gIHJldHVybiBjb250ZXh0LmZvcm1hdF9tYXBbcGF0dGVybl07XG59XG4iLCJ2YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xudmFyIHUgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyB3aGVyZSBhcmUgd2U/XG5cbnUuaXNOb2RlID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICYmIHR5cGVvZiBwcm9jZXNzLnN0ZGVyciAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnUuaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG59O1xuXG51LmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcblxudS5pc1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcblxudS5pc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudS5pc051bWJlciA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQob2JqKSkgJiYgaXNGaW5pdGUob2JqKTtcbn07XG5cbnUuaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufTtcblxudS5pc0RhdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBEYXRlXSc7XG59O1xuXG51LmlzTm90TnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKHR5cGVvZiBvYmogIT09ICdudW1iZXInID8gdHJ1ZSA6ICFpc05hTihvYmopKTtcbn07XG5cbnUuaXNCdWZmZXIgPSAoQnVmZmVyICYmIEJ1ZmZlci5pc0J1ZmZlcikgfHwgdS5mYWxzZTtcblxuLy8gdHlwZSBjb2VyY2lvbiBmdW5jdGlvbnNcblxudS5udW1iZXIgPSBmdW5jdGlvbihzKSB7IHJldHVybiBzID09IG51bGwgPyBudWxsIDogK3M7IH07XG5cbnUuYm9vbGVhbiA9IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMgPT0gbnVsbCA/IG51bGwgOiBzPT09J2ZhbHNlJyA/IGZhbHNlIDogISFzOyB9O1xuXG51LmRhdGUgPSBmdW5jdGlvbihzKSB7IHJldHVybiBzID09IG51bGwgPyBudWxsIDogRGF0ZS5wYXJzZShzKTsgfVxuXG51LmFycmF5ID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAhPSBudWxsID8gKHUuaXNBcnJheSh4KSA/IHggOiBbeF0pIDogW107IH07XG5cbnUuc3RyID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gdS5pc0FycmF5KHgpID8gXCJbXCIgKyB4Lm1hcCh1LnN0cikgKyBcIl1cIlxuICAgIDogdS5pc09iamVjdCh4KSA/IEpTT04uc3RyaW5naWZ5KHgpXG4gICAgOiB1LmlzU3RyaW5nKHgpID8gKFwiJ1wiK3V0aWxfZXNjYXBlX3N0cih4KStcIidcIikgOiB4O1xufTtcblxudmFyIGVzY2FwZV9zdHJfcmUgPSAvKF58W15cXFxcXSknL2c7XG5cbmZ1bmN0aW9uIHV0aWxfZXNjYXBlX3N0cih4KSB7XG4gIHJldHVybiB4LnJlcGxhY2UoZXNjYXBlX3N0cl9yZSwgXCIkMVxcXFwnXCIpO1xufVxuXG4vLyB1dGlsaXR5IGZ1bmN0aW9uc1xuXG51LmlkZW50aXR5ID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geDsgfTtcblxudS50cnVlID0gZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9O1xuXG51LmZhbHNlID0gZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZTsgfTtcblxudS5kdXBsaWNhdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG59O1xuXG51LmVxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYSkgPT09IEpTT04uc3RyaW5naWZ5KGIpO1xufTtcblxudS5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgZm9yICh2YXIgeCwgbmFtZSwgaT0xLCBsZW49YXJndW1lbnRzLmxlbmd0aDsgaTxsZW47ICsraSkge1xuICAgIHggPSBhcmd1bWVudHNbaV07XG4gICAgZm9yIChuYW1lIGluIHgpIHsgb2JqW25hbWVdID0geFtuYW1lXTsgfVxuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG51LmtleXMgPSBmdW5jdGlvbih4KSB7XG4gIHZhciBrZXlzID0gW10sIGs7XG4gIGZvciAoayBpbiB4KSBrZXlzLnB1c2goayk7XG4gIHJldHVybiBrZXlzO1xufTtcblxudS52YWxzID0gZnVuY3Rpb24oeCkge1xuICB2YXIgdmFscyA9IFtdLCBrO1xuICBmb3IgKGsgaW4geCkgdmFscy5wdXNoKHhba10pO1xuICByZXR1cm4gdmFscztcbn07XG5cbnUudG9NYXAgPSBmdW5jdGlvbihsaXN0KSB7XG4gIHJldHVybiBsaXN0LnJlZHVjZShmdW5jdGlvbihvYmosIHgpIHtcbiAgICByZXR1cm4gKG9ialt4XSA9IDEsIG9iaik7XG4gIH0sIHt9KTtcbn07XG5cbnUua2V5c3RyID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIC8vIHVzZSB0byBlbnN1cmUgY29uc2lzdGVudCBrZXkgZ2VuZXJhdGlvbiBhY3Jvc3MgbW9kdWxlc1xuICByZXR1cm4gdmFsdWVzLmpvaW4oXCJ8XCIpO1xufTtcblxuLy8gZGF0YSBhY2Nlc3MgZnVuY3Rpb25zXG5cbnUuZmllbGQgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBmLnNwbGl0KFwiXFxcXC5cIilcbiAgICAubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuc3BsaXQoXCIuXCIpOyB9KVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24oYSwgYikge1xuICAgICAgaWYgKGEubGVuZ3RoKSB7IGFbYS5sZW5ndGgtMV0gKz0gXCIuXCIgKyBiLnNoaWZ0KCk7IH1cbiAgICAgIGEucHVzaC5hcHBseShhLCBiKTtcbiAgICAgIHJldHVybiBhO1xuICAgIH0sIFtdKTtcbn07XG5cbnUuYWNjZXNzb3IgPSBmdW5jdGlvbihmKSB7XG4gIHZhciBzO1xuICByZXR1cm4gKHUuaXNGdW5jdGlvbihmKSB8fCBmPT1udWxsKVxuICAgID8gZiA6IHUuaXNTdHJpbmcoZikgJiYgKHM9dS5maWVsZChmKSkubGVuZ3RoID4gMVxuICAgID8gZnVuY3Rpb24oeCkgeyByZXR1cm4gcy5yZWR1Y2UoZnVuY3Rpb24oeCxmKSB7XG4gICAgICAgICAgcmV0dXJuIHhbZl07XG4gICAgICAgIH0sIHgpO1xuICAgICAgfVxuICAgIDogZnVuY3Rpb24oeCkgeyByZXR1cm4geFtmXTsgfTtcbn07XG5cbnUubXV0YXRvciA9IGZ1bmN0aW9uKGYpIHtcbiAgdmFyIHM7XG4gIHJldHVybiB1LmlzU3RyaW5nKGYpICYmIChzPXUuZmllbGQoZikpLmxlbmd0aCA+IDFcbiAgICA/IGZ1bmN0aW9uKHgsIHYpIHtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHMubGVuZ3RoLTE7ICsraSkgeCA9IHhbc1tpXV07XG4gICAgICAgIHhbc1tpXV0gPSB2O1xuICAgICAgfVxuICAgIDogZnVuY3Rpb24oeCwgdikgeyB4W2ZdID0gdjsgfTtcbn07XG5cblxuLy8gY29tcGFyaXNvbiAvIHNvcnRpbmcgZnVuY3Rpb25zXG5cbnUuY29tcGFyYXRvciA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgdmFyIHNpZ24gPSBbXTtcbiAgaWYgKHNvcnQgPT09IHVuZGVmaW5lZCkgc29ydCA9IFtdO1xuICBzb3J0ID0gdS5hcnJheShzb3J0KS5tYXAoZnVuY3Rpb24oZikge1xuICAgIHZhciBzID0gMTtcbiAgICBpZiAgICAgIChmWzBdID09PSBcIi1cIikgeyBzID0gLTE7IGYgPSBmLnNsaWNlKDEpOyB9XG4gICAgZWxzZSBpZiAoZlswXSA9PT0gXCIrXCIpIHsgcyA9ICsxOyBmID0gZi5zbGljZSgxKTsgfVxuICAgIHNpZ24ucHVzaChzKTtcbiAgICByZXR1cm4gdS5hY2Nlc3NvcihmKTtcbiAgfSk7XG4gIHJldHVybiBmdW5jdGlvbihhLGIpIHtcbiAgICB2YXIgaSwgbiwgZiwgeCwgeTtcbiAgICBmb3IgKGk9MCwgbj1zb3J0Lmxlbmd0aDsgaTxuOyArK2kpIHtcbiAgICAgIGYgPSBzb3J0W2ldOyB4ID0gZihhKTsgeSA9IGYoYik7XG4gICAgICBpZiAoeCA8IHkpIHJldHVybiAtMSAqIHNpZ25baV07XG4gICAgICBpZiAoeCA+IHkpIHJldHVybiBzaWduW2ldO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfTtcbn07XG5cbnUuY21wID0gZnVuY3Rpb24oYSwgYikge1xuICBpZiAoYSA8IGIpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSBpZiAoYSA+IGIpIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIGlmIChhID49IGIpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChhID09PSBudWxsICYmIGIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gTmFOO1xufTtcblxudS5udW1jbXAgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhIC0gYjsgfTtcblxudS5zdGFibGVzb3J0ID0gZnVuY3Rpb24oYXJyYXksIHNvcnRCeSwga2V5Rm4pIHtcbiAgdmFyIGluZGljZXMgPSBhcnJheS5yZWR1Y2UoZnVuY3Rpb24oaWR4LCB2LCBpKSB7XG4gICAgcmV0dXJuIChpZHhba2V5Rm4odildID0gaSwgaWR4KTtcbiAgfSwge30pO1xuXG4gIGFycmF5LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciBzYSA9IHNvcnRCeShhKSxcbiAgICAgICAgc2IgPSBzb3J0QnkoYik7XG4gICAgcmV0dXJuIHNhIDwgc2IgPyAtMSA6IHNhID4gc2IgPyAxXG4gICAgICAgICA6IChpbmRpY2VzW2tleUZuKGEpXSAtIGluZGljZXNba2V5Rm4oYildKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFycmF5O1xufTtcblxuXG4vLyBzdHJpbmcgZnVuY3Rpb25zXG5cbi8vIEVTNiBjb21wYXRpYmlsaXR5IHBlciBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvc3RhcnRzV2l0aCNQb2x5ZmlsbFxuLy8gV2UgY291bGQgaGF2ZSB1c2VkIHRoZSBwb2x5ZmlsbCBjb2RlLCBidXQgbGV0cyB3YWl0IHVudGlsIEVTNiBiZWNvbWVzIGEgc3RhbmRhcmQgZmlyc3RcbnUuc3RhcnRzV2l0aCA9IFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aFxuICA/IGZ1bmN0aW9uKHN0cmluZywgc2VhcmNoU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zdGFydHNXaXRoKHNlYXJjaFN0cmluZyk7XG4gIH1cbiAgOiBmdW5jdGlvbihzdHJpbmcsIHNlYXJjaFN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcubGFzdEluZGV4T2Yoc2VhcmNoU3RyaW5nLCAwKSA9PT0gMDtcbiAgfTtcblxudS50cnVuY2F0ZSA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCB3b3JkLCBlbGxpcHNpcykge1xuICB2YXIgbGVuID0gcy5sZW5ndGg7XG4gIGlmIChsZW4gPD0gbGVuZ3RoKSByZXR1cm4gcztcbiAgZWxsaXBzaXMgPSBlbGxpcHNpcyAhPT0gdW5kZWZpbmVkID8gU3RyaW5nKGVsbGlwc2lzKSA6IFwi4oCmXCI7XG4gIHZhciBsID0gTWF0aC5tYXgoMCwgbGVuZ3RoIC0gZWxsaXBzaXMubGVuZ3RoKTtcblxuICBzd2l0Y2ggKHBvcykge1xuICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICByZXR1cm4gZWxsaXBzaXMgKyAod29yZCA/IHRydW5jYXRlT25Xb3JkKHMsbCwxKSA6IHMuc2xpY2UobGVuLWwpKTtcbiAgICBjYXNlIFwibWlkZGxlXCI6XG4gICAgY2FzZSBcImNlbnRlclwiOlxuICAgICAgdmFyIGwxID0gTWF0aC5jZWlsKGwvMiksIGwyID0gTWF0aC5mbG9vcihsLzIpO1xuICAgICAgcmV0dXJuICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsMSkgOiBzLnNsaWNlKDAsbDEpKSArIGVsbGlwc2lzXG4gICAgICAgICsgKHdvcmQgPyB0cnVuY2F0ZU9uV29yZChzLGwyLDEpIDogcy5zbGljZShsZW4tbDIpKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICh3b3JkID8gdHJ1bmNhdGVPbldvcmQocyxsKSA6IHMuc2xpY2UoMCxsKSkgKyBlbGxpcHNpcztcbiAgfVxufTtcblxuZnVuY3Rpb24gdHJ1bmNhdGVPbldvcmQocywgbGVuLCByZXYpIHtcbiAgdmFyIGNudCA9IDAsIHRvayA9IHMuc3BsaXQodHJ1bmNhdGVfd29yZF9yZSk7XG4gIGlmIChyZXYpIHtcbiAgICBzID0gKHRvayA9IHRvay5yZXZlcnNlKCkpXG4gICAgICAuZmlsdGVyKGZ1bmN0aW9uKHcpIHsgY250ICs9IHcubGVuZ3RoOyByZXR1cm4gY250IDw9IGxlbjsgfSlcbiAgICAgIC5yZXZlcnNlKCk7XG4gIH0gZWxzZSB7XG4gICAgcyA9IHRvay5maWx0ZXIoZnVuY3Rpb24odykgeyBjbnQgKz0gdy5sZW5ndGg7IHJldHVybiBjbnQgPD0gbGVuOyB9KTtcbiAgfVxuICByZXR1cm4gcy5sZW5ndGggPyBzLmpvaW4oXCJcIikudHJpbSgpIDogdG9rWzBdLnNsaWNlKDAsIGxlbik7XG59XG5cbnZhciB0cnVuY2F0ZV93b3JkX3JlID0gLyhbXFx1MDAwOVxcdTAwMEFcXHUwMDBCXFx1MDAwQ1xcdTAwMERcXHUwMDIwXFx1MDBBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTIwMjhcXHUyMDI5XFx1MzAwMFxcdUZFRkZdKS87XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi9nbG9iYWxzJyksXG4gIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgdmxmaWVsZCA9IHJlcXVpcmUoJy4vZmllbGQnKSxcbiAgdmxlbmMgPSByZXF1aXJlKCcuL2VuYycpLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKSxcbiAgdGltZSA9IHJlcXVpcmUoJy4vY29tcGlsZS90aW1lJyk7XG5cbnZhciBFbmNvZGluZyA9IG1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuXG4gIGZ1bmN0aW9uIEVuY29kaW5nKG1hcmt0eXBlLCBlbmMsIGRhdGEsIGNvbmZpZywgZmlsdGVyLCB0aGVtZSkge1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xuXG4gICAgdmFyIHNwZWMgPSB7XG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgbWFya3R5cGU6IG1hcmt0eXBlLFxuICAgICAgZW5jOiBlbmMsXG4gICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgIGZpbHRlcjogZmlsdGVyIHx8IFtdXG4gICAgfTtcblxuICAgIC8vIHR5cGUgdG8gYml0Y29kZVxuICAgIGZvciAodmFyIGUgaW4gZGVmYXVsdHMuZW5jKSB7XG4gICAgICBkZWZhdWx0cy5lbmNbZV0udHlwZSA9IGNvbnN0cy5kYXRhVHlwZXNbZGVmYXVsdHMuZW5jW2VdLnR5cGVdO1xuICAgIH1cblxuICAgIHZhciBzcGVjRXh0ZW5kZWQgPSBzY2hlbWEudXRpbC5tZXJnZShkZWZhdWx0cywgdGhlbWUgfHwge30sIHNwZWMpIDtcblxuICAgIHRoaXMuX2RhdGEgPSBzcGVjRXh0ZW5kZWQuZGF0YTtcbiAgICB0aGlzLl9tYXJrdHlwZSA9IHNwZWNFeHRlbmRlZC5tYXJrdHlwZTtcbiAgICB0aGlzLl9lbmMgPSBzcGVjRXh0ZW5kZWQuZW5jO1xuICAgIHRoaXMuX2NvbmZpZyA9IHNwZWNFeHRlbmRlZC5jb25maWc7XG4gICAgdGhpcy5fZmlsdGVyID0gc3BlY0V4dGVuZGVkLmZpbHRlcjtcbiAgfVxuXG4gIHZhciBwcm90byA9IEVuY29kaW5nLnByb3RvdHlwZTtcblxuICBwcm90by5tYXJrdHlwZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXJrdHlwZTtcbiAgfTtcblxuICBwcm90by5pcyA9IGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya3R5cGUgPT09IG07XG4gIH07XG5cbiAgcHJvdG8uaGFzID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICAgIC8vIGVxdWl2YWxlbnQgdG8gY2FsbGluZyB2bGVuYy5oYXModGhpcy5fZW5jLCBlbmNUeXBlKVxuICAgIHJldHVybiB0aGlzLl9lbmNbZW5jVHlwZV0ubmFtZSAhPT0gdW5kZWZpbmVkO1xuICB9O1xuXG4gIHByb3RvLmVuYyA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF07XG4gIH07XG5cbiAgcHJvdG8uZmlsdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlck51bGwgPSBbXSxcbiAgICAgIGZpZWxkcyA9IHRoaXMuZmllbGRzKCksXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIHV0aWwuZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkTGlzdCwgZmllbGROYW1lKSB7XG4gICAgICBpZiAoZmllbGROYW1lID09PSAnKicpIHJldHVybjsgLy9jb3VudFxuXG4gICAgICBpZiAoKHNlbGYuY29uZmlnKCdmaWx0ZXJOdWxsJykuUSAmJiBmaWVsZExpc3QuY29udGFpbnNUeXBlW1FdKSB8fFxuICAgICAgICAgIChzZWxmLmNvbmZpZygnZmlsdGVyTnVsbCcpLlQgJiYgZmllbGRMaXN0LmNvbnRhaW5zVHlwZVtUXSkgfHxcbiAgICAgICAgICAoc2VsZi5jb25maWcoJ2ZpbHRlck51bGwnKS5PICYmIGZpZWxkTGlzdC5jb250YWluc1R5cGVbT10pKSB7XG4gICAgICAgIGZpbHRlck51bGwucHVzaCh7XG4gICAgICAgICAgb3BlcmFuZHM6IFtmaWVsZE5hbWVdLFxuICAgICAgICAgIG9wZXJhdG9yOiAnbm90TnVsbCdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmlsdGVyTnVsbC5jb25jYXQodGhpcy5fZmlsdGVyKTtcbiAgfTtcblxuICAvLyBnZXQgXCJmaWVsZFwiIHByb3BlcnR5IGZvciB2ZWdhXG4gIHByb3RvLmZpZWxkID0gZnVuY3Rpb24oZXQsIG5vZGF0YSwgbm9mbikge1xuICAgIGlmICghdGhpcy5oYXMoZXQpKSByZXR1cm4gbnVsbDtcblxuICAgIHZhciBmID0gKG5vZGF0YSA/ICcnIDogJ2RhdGEuJyk7XG5cbiAgICBpZiAodGhpcy5fZW5jW2V0XS5hZ2dyID09PSAnY291bnQnKSB7XG4gICAgICByZXR1cm4gZiArICdjb3VudCc7XG4gICAgfSBlbHNlIGlmICghbm9mbiAmJiB0aGlzLl9lbmNbZXRdLmJpbikge1xuICAgICAgcmV0dXJuIGYgKyAnYmluXycgKyB0aGlzLl9lbmNbZXRdLm5hbWU7XG4gICAgfSBlbHNlIGlmICghbm9mbiAmJiB0aGlzLl9lbmNbZXRdLmFnZ3IpIHtcbiAgICAgIHJldHVybiBmICsgdGhpcy5fZW5jW2V0XS5hZ2dyICsgJ18nICsgdGhpcy5fZW5jW2V0XS5uYW1lO1xuICAgIH0gZWxzZSBpZiAoIW5vZm4gJiYgdGhpcy5fZW5jW2V0XS5mbikge1xuICAgICAgcmV0dXJuIGYgKyB0aGlzLl9lbmNbZXRdLmZuICsgJ18nICsgdGhpcy5fZW5jW2V0XS5uYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZiArIHRoaXMuX2VuY1tldF0ubmFtZTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdG8uZmllbGROYW1lID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5uYW1lO1xuICB9O1xuXG4gIC8qXG4gICAqIHJldHVybiBrZXktdmFsdWUgcGFpcnMgb2YgZmllbGQgbmFtZSBhbmQgbGlzdCBvZiBmaWVsZHMgb2YgdGhhdCBmaWVsZCBuYW1lXG4gICAqL1xuICBwcm90by5maWVsZHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmxlbmMuZmllbGRzKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgcHJvdG8uZmllbGRUaXRsZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgaWYgKHZsZmllbGQuaXNDb3VudCh0aGlzLl9lbmNbZXRdKSkge1xuICAgICAgcmV0dXJuIHZsZmllbGQuY291bnQuZGlzcGxheU5hbWU7XG4gICAgfVxuICAgIHZhciBmbiA9IHRoaXMuX2VuY1tldF0uYWdnciB8fCB0aGlzLl9lbmNbZXRdLmZuIHx8ICh0aGlzLl9lbmNbZXRdLmJpbiAmJiBcImJpblwiKTtcbiAgICBpZiAoZm4pIHtcbiAgICAgIHJldHVybiBmbi50b1VwcGVyQ2FzZSgpICsgJygnICsgdGhpcy5fZW5jW2V0XS5uYW1lICsgJyknO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5uYW1lO1xuICAgIH1cbiAgfTtcblxuICBwcm90by5zY2FsZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uc2NhbGUgfHwge307XG4gIH07XG5cbiAgcHJvdG8uYXhpcyA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uYXhpcyB8fCB7fTtcbiAgfTtcblxuICBwcm90by5iYW5kID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW2V0XS5iYW5kIHx8IHt9O1xuICB9O1xuXG4gIHByb3RvLmJhbmRTaXplID0gZnVuY3Rpb24oZW5jVHlwZSwgdXNlU21hbGxCYW5kKSB7XG4gICAgdXNlU21hbGxCYW5kID0gdXNlU21hbGxCYW5kIHx8XG4gICAgICAvL2lzQmFuZEluU21hbGxNdWx0aXBsZXNcbiAgICAgIChlbmNUeXBlID09PSBZICYmIHRoaXMuaGFzKFJPVykgJiYgdGhpcy5oYXMoWSkpIHx8XG4gICAgICAoZW5jVHlwZSA9PT0gWCAmJiB0aGlzLmhhcyhDT0wpICYmIHRoaXMuaGFzKFgpKTtcblxuICAgIC8vIGlmIGJhbmQuc2l6ZSBpcyBleHBsaWNpdGx5IHNwZWNpZmllZCwgZm9sbG93IHRoZSBzcGVjaWZpY2F0aW9uLCBvdGhlcndpc2UgZHJhdyB2YWx1ZSBmcm9tIGNvbmZpZy5cbiAgICByZXR1cm4gdGhpcy5iYW5kKGVuY1R5cGUpLnNpemUgfHxcbiAgICAgIHRoaXMuY29uZmlnKHVzZVNtYWxsQmFuZCA/ICdzbWFsbEJhbmRTaXplJyA6ICdsYXJnZUJhbmRTaXplJyk7XG4gIH07XG5cbiAgcHJvdG8uYWdnciA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0uYWdncjtcbiAgfTtcblxuICAvLyByZXR1cm5zIGZhbHNlIGlmIGJpbm5pbmcgaXMgZGlzYWJsZWQsIG90aGVyd2lzZSBhbiBvYmplY3Qgd2l0aCBiaW5uaW5nIHByb3BlcnRpZXNcbiAgcHJvdG8uYmluID0gZnVuY3Rpb24oZXQpIHtcbiAgICB2YXIgYmluID0gdGhpcy5fZW5jW2V0XS5iaW47XG4gICAgaWYgKGJpbiA9PT0ge30pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGJpbiA9PT0gdHJ1ZSlcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1heGJpbnM6IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFRcbiAgICAgIH07XG4gICAgcmV0dXJuIGJpbjtcbiAgfTtcblxuICBwcm90by5sZWdlbmQgPSBmdW5jdGlvbihldCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbZXRdLmxlZ2VuZDtcbiAgfTtcblxuICBwcm90by52YWx1ZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1tldF0udmFsdWU7XG4gIH07XG5cbiAgcHJvdG8uZm4gPSBmdW5jdGlvbihldCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbZXRdLmZuO1xuICB9O1xuXG4gIHByb3RvLnNvcnQgPSBmdW5jdGlvbihldCwgc3RhdHMpIHtcbiAgICB2YXIgc29ydCA9IHRoaXMuX2VuY1tldF0uc29ydCxcbiAgICAgIGVuYyA9IHRoaXMuX2VuYyxcbiAgICAgIGlzVHlwZSA9IHZsZmllbGQuaXNUeXBlLmJ5Q29kZTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdzb3J0OicsIHNvcnQsICdzdXBwb3J0OicsIEVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydCh7ZW5jOnRoaXMuX2VuY30sIHN0YXRzKSAsICd0b2dnbGU6JywgdGhpcy5jb25maWcoJ3RvZ2dsZVNvcnQnKSlcblxuICAgIGlmICgoIXNvcnQgfHwgc29ydC5sZW5ndGg9PT0wKSAmJlxuICAgICAgICBFbmNvZGluZy50b2dnbGVTb3J0LnN1cHBvcnQoe2VuYzp0aGlzLl9lbmN9LCBzdGF0cywgdHJ1ZSkgJiYgLy9IQUNLXG4gICAgICAgIHRoaXMuY29uZmlnKCd0b2dnbGVTb3J0JykgPT09ICdRJ1xuICAgICAgKSB7XG4gICAgICB2YXIgcUZpZWxkID0gaXNUeXBlKGVuYy54LCBPKSA/IGVuYy55IDogZW5jLng7XG5cbiAgICAgIGlmIChpc1R5cGUoZW5jW2V0XSwgTykpIHtcbiAgICAgICAgc29ydCA9IFt7XG4gICAgICAgICAgbmFtZTogcUZpZWxkLm5hbWUsXG4gICAgICAgICAgYWdncjogcUZpZWxkLmFnZ3IsXG4gICAgICAgICAgdHlwZTogcUZpZWxkLnR5cGUsXG4gICAgICAgICAgcmV2ZXJzZTogdHJ1ZVxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc29ydDtcbiAgfTtcblxuICBwcm90by5sZW5ndGggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdXRpbC5rZXlzKHRoaXMuX2VuYykubGVuZ3RoO1xuICB9O1xuXG4gIHByb3RvLm1hcCA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gdmxlbmMubWFwKHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8ucmVkdWNlID0gZnVuY3Rpb24oZiwgaW5pdCkge1xuICAgIHJldHVybiB2bGVuYy5yZWR1Y2UodGhpcy5fZW5jLCBmLCBpbml0KTtcbiAgfTtcblxuICBwcm90by5mb3JFYWNoID0gZnVuY3Rpb24oZikge1xuICAgIHJldHVybiB2bGVuYy5mb3JFYWNoKHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8udHlwZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGV0KSA/IHRoaXMuX2VuY1tldF0udHlwZSA6IG51bGw7XG4gIH07XG5cbiAgcHJvdG8ucm9sZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGV0KSA/IHZsZmllbGQucm9sZSh0aGlzLl9lbmNbZXRdKSA6IG51bGw7XG4gIH07XG5cbiAgcHJvdG8udGV4dCA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMuX2VuY1tURVhUXS50ZXh0O1xuICAgIHJldHVybiBwcm9wID8gdGV4dFtwcm9wXSA6IHRleHQ7XG4gIH07XG5cbiAgcHJvdG8uZm9udCA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgICB2YXIgZm9udCA9IHRoaXMuX2VuY1tURVhUXS5mb250O1xuICAgIHJldHVybiBwcm9wID8gZm9udFtwcm9wXSA6IGZvbnQ7XG4gIH07XG5cbiAgcHJvdG8uaXNUeXBlID0gZnVuY3Rpb24oZXQsIHR5cGUpIHtcbiAgICB2YXIgZmllbGQgPSB0aGlzLmVuYyhldCk7XG4gICAgcmV0dXJuIGZpZWxkICYmIEVuY29kaW5nLmlzVHlwZShmaWVsZCwgdHlwZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNUeXBlID0gZnVuY3Rpb24gKGZpZWxkRGVmLCB0eXBlKSB7XG4gICAgLy8gRklYTUUgdmxmaWVsZC5pc1R5cGVcbiAgICByZXR1cm4gKGZpZWxkRGVmLnR5cGUgJiB0eXBlKSA+IDA7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUgPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzT3JkaW5hbFNjYWxlKGVuY29kaW5nLmVuYyhlbmNUeXBlKSwgdHJ1ZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzRGltZW5zaW9uKGVuY29kaW5nLmVuYyhlbmNUeXBlKSwgdHJ1ZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNNZWFzdXJlID0gZnVuY3Rpb24oZW5jb2RpbmcsIGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5pc01lYXN1cmUoZW5jb2RpbmcuZW5jKGVuY1R5cGUpLCB0cnVlKTtcbiAgfTtcblxuICBwcm90by5pc09yZGluYWxTY2FsZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoZW5jVHlwZSkgJiYgRW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUodGhpcywgZW5jVHlwZSk7XG4gIH07XG5cbiAgcHJvdG8uaXNEaW1lbnNpb24gPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzRGltZW5zaW9uKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzTWVhc3VyZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoZW5jVHlwZSkgJiYgRW5jb2RpbmcuaXNNZWFzdXJlKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzQWdncmVnYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNBZ2dyZWdhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHNwZWMuZW5jKTtcbiAgfTtcblxuICBFbmNvZGluZy5hbHdheXNOb09jY2x1c2lvbiA9IGZ1bmN0aW9uKHNwZWMsIHN0YXRzKSB7XG4gICAgLy8gRklYTUUgcmF3IE94USB3aXRoICMgb2Ygcm93cyA9ICMgb2YgT1xuICAgIHJldHVybiB2bGVuYy5pc0FnZ3JlZ2F0ZShzcGVjLmVuYyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNTdGFjayA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICAvLyBGSVhNRSB1cGRhdGUgdGhpcyBvbmNlIHdlIGhhdmUgY29udHJvbCBmb3Igc3RhY2sgLi4uXG4gICAgcmV0dXJuIChzcGVjLm1hcmt0eXBlID09PSAnYmFyJyB8fCBzcGVjLm1hcmt0eXBlID09PSAnYXJlYScpICYmXG4gICAgICBzcGVjLmVuYy5jb2xvcjtcbiAgfTtcblxuICBwcm90by5pc1N0YWNrID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gRklYTUUgdXBkYXRlIHRoaXMgb25jZSB3ZSBoYXZlIGNvbnRyb2wgZm9yIHN0YWNrIC4uLlxuICAgIHJldHVybiAodGhpcy5pcygnYmFyJykgfHwgdGhpcy5pcygnYXJlYScpKSAmJiB0aGlzLmhhcygnY29sb3InKTtcbiAgfTtcblxuICBwcm90by5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGVuY1R5cGUsIHN0YXRzKSB7XG4gICAgcmV0dXJuIHZsZmllbGQuY2FyZGluYWxpdHkodGhpcy5lbmMoZW5jVHlwZSksIHN0YXRzLCB0aGlzLmNvbmZpZygnZmlsdGVyTnVsbCcpLCB0cnVlKTtcbiAgfTtcblxuICBwcm90by5pc1JhdyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0FnZ3JlZ2F0ZSgpO1xuICB9O1xuXG4gIHByb3RvLmRhdGEgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFbbmFtZV07XG4gIH07XG5cbiAgcHJvdG8uY29uZmlnID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9jb25maWdbbmFtZV07XG4gIH07XG5cbiAgcHJvdG8udG9TcGVjID0gZnVuY3Rpb24oZXhjbHVkZUNvbmZpZykge1xuICAgIHZhciBlbmMgPSB1dGlsLmR1cGxpY2F0ZSh0aGlzLl9lbmMpLFxuICAgICAgc3BlYztcblxuICAgIC8vIGNvbnZlcnQgdHlwZSdzIGJpdGNvZGUgdG8gdHlwZSBuYW1lXG4gICAgZm9yICh2YXIgZSBpbiBlbmMpIHtcbiAgICAgIGVuY1tlXS50eXBlID0gY29uc3RzLmRhdGFUeXBlTmFtZXNbZW5jW2VdLnR5cGVdO1xuICAgIH1cblxuICAgIHNwZWMgPSB7XG4gICAgICBtYXJrdHlwZTogdGhpcy5fbWFya3R5cGUsXG4gICAgICBlbmM6IGVuYyxcbiAgICAgIGZpbHRlcjogdGhpcy5fZmlsdGVyXG4gICAgfTtcblxuICAgIGlmICghZXhjbHVkZUNvbmZpZykge1xuICAgICAgc3BlYy5jb25maWcgPSB1dGlsLmR1cGxpY2F0ZSh0aGlzLl9jb25maWcpO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBkZWZhdWx0c1xuICAgIHZhciBkZWZhdWx0cyA9IHNjaGVtYS5pbnN0YW50aWF0ZSgpO1xuICAgIHJldHVybiBzY2hlbWEudXRpbC5zdWJ0cmFjdChzcGVjLCBkZWZhdWx0cyk7XG4gIH07XG5cbiAgcHJvdG8udG9TaG9ydGhhbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQ7XG4gICAgcmV0dXJuICdtYXJrJyArIGMuYXNzaWduICsgdGhpcy5fbWFya3R5cGUgK1xuICAgICAgYy5kZWxpbSArIHZsZW5jLnNob3J0aGFuZCh0aGlzLl9lbmMpO1xuICB9O1xuXG4gIEVuY29kaW5nLnNob3J0aGFuZCA9IGZ1bmN0aW9uIChzcGVjKSB7XG4gICAgdmFyIGMgPSBjb25zdHMuc2hvcnRoYW5kO1xuICAgIHJldHVybiAnbWFyaycgKyBjLmFzc2lnbiArIHNwZWMubWFya3R5cGUgK1xuICAgICAgYy5kZWxpbSArIHZsZW5jLnNob3J0aGFuZChzcGVjLmVuYyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuZnJvbVNob3J0aGFuZCA9IGZ1bmN0aW9uKHNob3J0aGFuZCwgZGF0YSwgY29uZmlnLCB0aGVtZSkge1xuICAgIHZhciBjID0gY29uc3RzLnNob3J0aGFuZCxcbiAgICAgICAgc3BsaXQgPSBzaG9ydGhhbmQuc3BsaXQoYy5kZWxpbSksXG4gICAgICAgIG1hcmt0eXBlID0gc3BsaXQuc2hpZnQoKS5zcGxpdChjLmFzc2lnbilbMV0udHJpbSgpLFxuICAgICAgICBlbmMgPSB2bGVuYy5mcm9tU2hvcnRoYW5kKHNwbGl0LCB0cnVlKTtcblxuICAgIHJldHVybiBuZXcgRW5jb2RpbmcobWFya3R5cGUsIGVuYywgZGF0YSwgY29uZmlnLCBudWxsLCB0aGVtZSk7XG4gIH07XG5cbiAgRW5jb2Rpbmcuc3BlY0Zyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGRhdGEsIGNvbmZpZywgZXhjbHVkZUNvbmZpZykge1xuICAgIHJldHVybiBFbmNvZGluZy5mcm9tU2hvcnRoYW5kKHNob3J0aGFuZCwgZGF0YSwgY29uZmlnKS50b1NwZWMoZXhjbHVkZUNvbmZpZyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuZnJvbVNwZWMgPSBmdW5jdGlvbihzcGVjLCB0aGVtZSkge1xuICAgIHZhciBlbmMgPSB1dGlsLmR1cGxpY2F0ZShzcGVjLmVuYyB8fCB7fSk7XG5cbiAgICAvL2NvbnZlcnQgdHlwZSBmcm9tIHN0cmluZyB0byBiaXRjb2RlIChlLmcsIE89MSlcbiAgICBmb3IgKHZhciBlIGluIGVuYykge1xuICAgICAgZW5jW2VdLnR5cGUgPSBjb25zdHMuZGF0YVR5cGVzW2VuY1tlXS50eXBlXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEVuY29kaW5nKHNwZWMubWFya3R5cGUsIGVuYywgc3BlYy5kYXRhLCBzcGVjLmNvbmZpZywgc3BlYy5maWx0ZXIsIHRoZW1lKTtcbiAgfTtcblxuICBFbmNvZGluZy50cmFuc3Bvc2UgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgdmFyIG9sZGVuYyA9IHNwZWMuZW5jLFxuICAgICAgZW5jID0gdXRpbC5kdXBsaWNhdGUoc3BlYy5lbmMpO1xuICAgIGVuYy54ID0gb2xkZW5jLnk7XG4gICAgZW5jLnkgPSBvbGRlbmMueDtcbiAgICBlbmMucm93ID0gb2xkZW5jLmNvbDtcbiAgICBlbmMuY29sID0gb2xkZW5jLnJvdztcbiAgICBzcGVjLmVuYyA9IGVuYztcbiAgICByZXR1cm4gc3BlYztcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVTb3J0ID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHNwZWMuY29uZmlnID0gc3BlYy5jb25maWcgfHwge307XG4gICAgc3BlYy5jb25maWcudG9nZ2xlU29ydCA9IHNwZWMuY29uZmlnLnRvZ2dsZVNvcnQgPT09ICdRJyA/ICdPJyA6J1EnO1xuICAgIHJldHVybiBzcGVjO1xuICB9O1xuXG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5kaXJlY3Rpb24gPSBmdW5jdGlvbihzcGVjLCB1c2VUeXBlQ29kZSkge1xuICAgIGlmICghRW5jb2RpbmcudG9nZ2xlU29ydC5zdXBwb3J0KHNwZWMsIHVzZVR5cGVDb2RlKSkgeyByZXR1cm47IH1cbiAgICB2YXIgZW5jID0gc3BlYy5lbmM7XG4gICAgcmV0dXJuIGVuYy54LnR5cGUgPT09ICdPJyA/ICd4JyA6ICAneSc7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5tb2RlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBzcGVjLmNvbmZpZy50b2dnbGVTb3J0O1xuICB9O1xuXG4gIEVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydCA9IGZ1bmN0aW9uKHNwZWMsIHN0YXRzLCB1c2VUeXBlQ29kZSkge1xuICAgIHZhciBlbmMgPSBzcGVjLmVuYyxcbiAgICAgIGlzVHlwZSA9IHZsZmllbGQuaXNUeXBlLmdldCh1c2VUeXBlQ29kZSk7XG5cbiAgICBpZiAodmxlbmMuaGFzKGVuYywgUk9XKSB8fCB2bGVuYy5oYXMoZW5jLCBDT0wpIHx8XG4gICAgICAhdmxlbmMuaGFzKGVuYywgWCkgfHwgIXZsZW5jLmhhcyhlbmMsIFkpIHx8XG4gICAgICAhRW5jb2RpbmcuYWx3YXlzTm9PY2NsdXNpb24oc3BlYywgc3RhdHMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuICggaXNUeXBlKGVuYy54LCBPKSAmJiB2bGZpZWxkLmlzTWVhc3VyZShlbmMueSwgdXNlVHlwZUNvZGUpKSA/ICd4JyA6XG4gICAgICAoIGlzVHlwZShlbmMueSwgTykgJiYgdmxmaWVsZC5pc01lYXN1cmUoZW5jLngsIHVzZVR5cGVDb2RlKSkgPyAneScgOiBmYWxzZTtcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVGaWx0ZXJOdWxsTyA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICBzcGVjLmNvbmZpZyA9IHNwZWMuY29uZmlnIHx8IHt9O1xuICAgIHNwZWMuY29uZmlnLmZpbHRlck51bGwgPSBzcGVjLmNvbmZpZy5maWx0ZXJOdWxsIHx8IHsgLy9GSVhNRVxuICAgICAgVDogdHJ1ZSxcbiAgICAgIFE6IHRydWVcbiAgICB9O1xuICAgIHNwZWMuY29uZmlnLmZpbHRlck51bGwuTyA9ICFzcGVjLmNvbmZpZy5maWx0ZXJOdWxsLk87XG4gICAgcmV0dXJuIHNwZWM7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlRmlsdGVyTnVsbE8uc3VwcG9ydCA9IGZ1bmN0aW9uKHNwZWMsIHN0YXRzKSB7XG4gICAgdmFyIGZpZWxkcyA9IHZsZW5jLmZpZWxkcyhzcGVjLmVuYyk7XG4gICAgZm9yICh2YXIgZmllbGROYW1lIGluIGZpZWxkcykge1xuICAgICAgdmFyIGZpZWxkTGlzdCA9IGZpZWxkc1tmaWVsZE5hbWVdO1xuICAgICAgaWYgKGZpZWxkTGlzdC5jb250YWluc1R5cGUuTyAmJiBmaWVsZE5hbWUgaW4gc3RhdHMgJiYgc3RhdHNbZmllbGROYW1lXS5udWxscyA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZXR1cm4gRW5jb2Rpbmc7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhZ2dyZWdhdGVzO1xuXG5mdW5jdGlvbiBhZ2dyZWdhdGVzKHNwZWMsIGVuY29kaW5nLCBvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIHZhciBkaW1zID0ge30sIG1lYXMgPSB7fSwgZGV0YWlsID0ge30sIGZhY2V0cyA9IHt9LFxuICAgIGRhdGEgPSBzcGVjLmRhdGFbMV07IC8vIGN1cnJlbnRseSBkYXRhWzBdIGlzIHJhdyBhbmQgZGF0YVsxXSBpcyB0YWJsZVxuXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZmllbGQuYWdncikge1xuICAgICAgaWYgKGZpZWxkLmFnZ3IgPT09ICdjb3VudCcpIHtcbiAgICAgICAgbWVhcy5jb3VudCA9IHtvcDogJ2NvdW50JywgZmllbGQ6ICcqJ307XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIG1lYXNbZmllbGQuYWdnciArICd8JysgZmllbGQubmFtZV0gPSB7XG4gICAgICAgICAgb3A6IGZpZWxkLmFnZ3IsXG4gICAgICAgICAgZmllbGQ6ICdkYXRhLicrIGZpZWxkLm5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGltc1tmaWVsZC5uYW1lXSA9IGVuY29kaW5nLmZpZWxkKGVuY1R5cGUpO1xuICAgICAgaWYgKGVuY1R5cGUgPT0gUk9XIHx8IGVuY1R5cGUgPT0gQ09MKSB7XG4gICAgICAgIGZhY2V0c1tmaWVsZC5uYW1lXSA9IGRpbXNbZmllbGQubmFtZV07XG4gICAgICB9ZWxzZSBpZiAoZW5jVHlwZSAhPT0gWCAmJiBlbmNUeXBlICE9PSBZKSB7XG4gICAgICAgIGRldGFpbFtmaWVsZC5uYW1lXSA9IGRpbXNbZmllbGQubmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgZGltcyA9IHV0aWwudmFscyhkaW1zKTtcbiAgbWVhcyA9IHV0aWwudmFscyhtZWFzKTtcblxuICBpZiAobWVhcy5sZW5ndGggPiAwICYmICFvcHQucHJlYWdncmVnYXRlZERhdGEpIHtcbiAgICBpZiAoIWRhdGEudHJhbnNmb3JtKSBkYXRhLnRyYW5zZm9ybSA9IFtdO1xuICAgIGRhdGEudHJhbnNmb3JtLnB1c2goe1xuICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICBncm91cGJ5OiBkaW1zLFxuICAgICAgZmllbGRzOiBtZWFzXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBkZXRhaWxzOiB1dGlsLnZhbHMoZGV0YWlsKSxcbiAgICBkaW1zOiBkaW1zLFxuICAgIGZhY2V0czogdXRpbC52YWxzKGZhY2V0cyksXG4gICAgYWdncmVnYXRlZDogbWVhcy5sZW5ndGggPiAwXG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICBzZXR0ZXIgPSB1dGlsLnNldHRlcixcbiAgZ2V0dGVyID0gdXRpbC5nZXR0ZXIsXG4gIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxudmFyIGF4aXMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5heGlzLm5hbWVzID0gZnVuY3Rpb24ocHJvcHMpIHtcbiAgcmV0dXJuIHV0aWwua2V5cyh1dGlsLmtleXMocHJvcHMpLnJlZHVjZShmdW5jdGlvbihhLCB4KSB7XG4gICAgdmFyIHMgPSBwcm9wc1t4XS5zY2FsZTtcbiAgICBpZiAocyA9PT0gWCB8fCBzID09PSBZKSBhW3Byb3BzW3hdLnNjYWxlXSA9IDE7XG4gICAgcmV0dXJuIGE7XG4gIH0sIHt9KSk7XG59O1xuXG5heGlzLmRlZnMgPSBmdW5jdGlvbihuYW1lcywgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMsIG9wdCkge1xuICByZXR1cm4gbmFtZXMucmVkdWNlKGZ1bmN0aW9uKGEsIG5hbWUpIHtcbiAgICBhLnB1c2goYXhpcy5kZWYobmFtZSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMsIG9wdCkpO1xuICAgIHJldHVybiBhO1xuICB9LCBbXSk7XG59O1xuXG5heGlzLmRlZiA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzLCBvcHQpIHtcbiAgdmFyIHR5cGUgPSBuYW1lO1xuICB2YXIgaXNDb2wgPSBuYW1lID09IENPTCwgaXNSb3cgPSBuYW1lID09IFJPVztcbiAgdmFyIHJvd09mZnNldCA9IGF4aXNUaXRsZU9mZnNldChlbmNvZGluZywgbGF5b3V0LCBZKSArIDIwLFxuICAgIGNlbGxQYWRkaW5nID0gbGF5b3V0LmNlbGxQYWRkaW5nO1xuXG5cbiAgaWYgKGlzQ29sKSB0eXBlID0gJ3gnO1xuICBpZiAoaXNSb3cpIHR5cGUgPSAneSc7XG5cbiAgdmFyIGRlZiA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIHNjYWxlOiBuYW1lXG4gIH07XG5cbiAgaWYgKGVuY29kaW5nLmF4aXMobmFtZSkuZ3JpZCkge1xuICAgIGRlZi5ncmlkID0gdHJ1ZTtcbiAgICBkZWYubGF5ZXIgPSAoaXNSb3cgfHwgaXNDb2wpID8gJ2Zyb250JyA6ICAnYmFjayc7XG5cbiAgICBpZiAoaXNDb2wpIHtcbiAgICAgIC8vIHNldCBncmlkIHByb3BlcnR5IC0tIHB1dCB0aGUgbGluZXMgb24gdGhlIHJpZ2h0IHRoZSBjZWxsXG4gICAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnZ3JpZCddLCB7XG4gICAgICAgIHg6IHtcbiAgICAgICAgICBvZmZzZXQ6IGxheW91dC5jZWxsV2lkdGggKiAoMSsgY2VsbFBhZGRpbmcvMi4wKSxcbiAgICAgICAgICAvLyBkZWZhdWx0IHZhbHVlKHMpIC0tIHZlZ2EgZG9lc24ndCBkbyByZWN1cnNpdmUgbWVyZ2VcbiAgICAgICAgICBzY2FsZTogJ2NvbCdcbiAgICAgICAgfSxcbiAgICAgICAgeToge1xuICAgICAgICAgIHZhbHVlOiAtbGF5b3V0LmNlbGxIZWlnaHQgKiAoY2VsbFBhZGRpbmcvMiksXG4gICAgICAgIH0sXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZENvbG9yJykgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChpc1Jvdykge1xuICAgICAgLy8gc2V0IGdyaWQgcHJvcGVydHkgLS0gcHV0IHRoZSBsaW5lcyBvbiB0aGUgdG9wXG4gICAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnZ3JpZCddLCB7XG4gICAgICAgIHk6IHtcbiAgICAgICAgICBvZmZzZXQ6IC1sYXlvdXQuY2VsbEhlaWdodCAqIChjZWxsUGFkZGluZy8yKSxcbiAgICAgICAgICAvLyBkZWZhdWx0IHZhbHVlKHMpIC0tIHZlZ2EgZG9lc24ndCBkbyByZWN1cnNpdmUgbWVyZ2VcbiAgICAgICAgICBzY2FsZTogJ3JvdydcbiAgICAgICAgfSxcbiAgICAgICAgeDoge1xuICAgICAgICAgIHZhbHVlOiByb3dPZmZzZXRcbiAgICAgICAgfSxcbiAgICAgICAgeDI6IHtcbiAgICAgICAgICBvZmZzZXQ6IHJvd09mZnNldCArIChsYXlvdXQuY2VsbFdpZHRoICogMC4wNSksXG4gICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZShzKSAtLSB2ZWdhIGRvZXNuJ3QgZG8gcmVjdXJzaXZlIG1lcmdlXG4gICAgICAgICAgZ3JvdXA6IFwibWFyay5ncm91cC53aWR0aFwiLFxuICAgICAgICAgIG11bHQ6IDFcbiAgICAgICAgfSxcbiAgICAgICAgc3Ryb2tlOiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxHcmlkQ29sb3InKSB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ2dyaWQnLCAnc3Ryb2tlJ10sIHtcbiAgICAgICAgdmFsdWU6IGVuY29kaW5nLmNvbmZpZygnZ3JpZENvbG9yJylcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbmNvZGluZy5heGlzKG5hbWUpLnRpdGxlKSB7XG4gICAgZGVmID0gYXhpc190aXRsZShkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIG9wdCk7XG4gIH1cblxuICBpZiAoaXNSb3cgfHwgaXNDb2wpIHtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAndGlja3MnXSwge1xuICAgICAgb3BhY2l0eToge3ZhbHVlOiAwfVxuICAgIH0pO1xuICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsICdtYWpvclRpY2tzJ10sIHtcbiAgICAgIG9wYWNpdHk6IHt2YWx1ZTogMH1cbiAgICB9KTtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnYXhpcyddLCB7XG4gICAgICBvcGFjaXR5OiB7dmFsdWU6IDB9XG4gICAgfSk7XG4gIH1cblxuICBpZiAoaXNDb2wpIHtcbiAgICBkZWYub3JpZW50ID0gJ3RvcCc7XG4gIH1cblxuICBpZiAoaXNSb3cpIHtcbiAgICBkZWYub2Zmc2V0ID0gcm93T2Zmc2V0O1xuICB9XG5cbiAgaWYgKG5hbWUgPT0gWCkge1xuICAgIGlmIChlbmNvZGluZy5oYXMoWSkgJiYgZW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUoWSkgJiYgZW5jb2RpbmcuY2FyZGluYWxpdHkoWSwgc3RhdHMpID4gMzApIHtcbiAgICAgIGRlZi5vcmllbnQgPSAndG9wJztcbiAgICB9XG5cbiAgICBpZiAoZW5jb2RpbmcuaXNEaW1lbnNpb24oWCkgfHwgZW5jb2RpbmcuaXNUeXBlKFgsIFQpKSB7XG4gICAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCdsYWJlbHMnXSwge1xuICAgICAgICBhbmdsZToge3ZhbHVlOiAyNzB9LFxuICAgICAgICBhbGlnbjoge3ZhbHVlOiAncmlnaHQnfSxcbiAgICAgICAgYmFzZWxpbmU6IHt2YWx1ZTogJ21pZGRsZSd9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgeyAvLyBRXG4gICAgICBkZWYudGlja3MgPSA1O1xuICAgIH1cbiAgfVxuXG4gIGRlZiA9IGF4aXNfbGFiZWxzKGRlZiwgbmFtZSwgZW5jb2RpbmcsIGxheW91dCwgb3B0KTtcblxuICByZXR1cm4gZGVmO1xufTtcblxuZnVuY3Rpb24gYXhpc190aXRsZShkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIG9wdCkge1xuICB2YXIgbWF4bGVuZ3RoID0gbnVsbCxcbiAgICBmaWVsZFRpdGxlID0gZW5jb2RpbmcuZmllbGRUaXRsZShuYW1lKTtcbiAgaWYgKG5hbWU9PT1YKSB7XG4gICAgbWF4bGVuZ3RoID0gbGF5b3V0LmNlbGxXaWR0aCAvIGVuY29kaW5nLmNvbmZpZygnY2hhcmFjdGVyV2lkdGgnKTtcbiAgfSBlbHNlIGlmIChuYW1lID09PSBZKSB7XG4gICAgbWF4bGVuZ3RoID0gbGF5b3V0LmNlbGxIZWlnaHQgLyBlbmNvZGluZy5jb25maWcoJ2NoYXJhY3RlcldpZHRoJyk7XG4gIH1cblxuICBkZWYudGl0bGUgPSBtYXhsZW5ndGggPyB1dGlsLnRydW5jYXRlKGZpZWxkVGl0bGUsIG1heGxlbmd0aCkgOiBmaWVsZFRpdGxlO1xuXG4gIGlmIChuYW1lID09PSBST1cpIHtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCd0aXRsZSddLCB7XG4gICAgICBhbmdsZToge3ZhbHVlOiAwfSxcbiAgICAgIGFsaWduOiB7dmFsdWU6ICdyaWdodCd9LFxuICAgICAgYmFzZWxpbmU6IHt2YWx1ZTogJ21pZGRsZSd9LFxuICAgICAgZHk6IHt2YWx1ZTogKC1sYXlvdXQuaGVpZ2h0LzIpIC0yMH1cbiAgICB9KTtcbiAgfVxuXG4gIGRlZi50aXRsZU9mZnNldCA9IGF4aXNUaXRsZU9mZnNldChlbmNvZGluZywgbGF5b3V0LCBuYW1lKTtcbiAgcmV0dXJuIGRlZjtcbn1cblxuZnVuY3Rpb24gYXhpc19sYWJlbHMoZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0LCBvcHQpIHtcbiAgdmFyIGZuO1xuICAvLyBhZGQgY3VzdG9tIGxhYmVsIGZvciB0aW1lIHR5cGVcbiAgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJiAoZm4gPSBlbmNvZGluZy5mbihuYW1lKSkgJiYgKHRpbWUuaGFzU2NhbGUoZm4pKSkge1xuICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsJ2xhYmVscycsJ3RleHQnLCdzY2FsZSddLCAndGltZS0nKyBmbik7XG4gIH1cblxuICB2YXIgdGV4dFRlbXBsYXRlUGF0aCA9IFsncHJvcGVydGllcycsJ2xhYmVscycsJ3RleHQnLCd0ZW1wbGF0ZSddO1xuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS5mb3JtYXQpIHtcbiAgICBkZWYuZm9ybWF0ID0gZW5jb2RpbmcuYXhpcyhuYW1lKS5mb3JtYXQ7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFEpKSB7XG4gICAgc2V0dGVyKGRlZiwgdGV4dFRlbXBsYXRlUGF0aCwgXCJ7e2RhdGEgfCBudW1iZXI6Jy4zcyd9fVwiKTtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGUobmFtZSwgVCkgJiYgIWVuY29kaW5nLmZuKG5hbWUpKSB7XG4gICAgc2V0dGVyKGRlZiwgdGV4dFRlbXBsYXRlUGF0aCwgXCJ7e2RhdGEgfCB0aW1lOiclWS0lbS0lZCd9fVwiKTtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGUobmFtZSwgVCkgJiYgZW5jb2RpbmcuZm4obmFtZSkgPT09ICd5ZWFyJykge1xuICAgIHNldHRlcihkZWYsIHRleHRUZW1wbGF0ZVBhdGgsIFwie3tkYXRhIHwgbnVtYmVyOidkJ319XCIpO1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBPKSAmJiBlbmNvZGluZy5heGlzKG5hbWUpLm1heExhYmVsTGVuZ3RoKSB7XG4gICAgc2V0dGVyKGRlZiwgdGV4dFRlbXBsYXRlUGF0aCwgJ3t7ZGF0YSB8IHRydW5jYXRlOicgKyBlbmNvZGluZy5heGlzKG5hbWUpLm1heExhYmVsTGVuZ3RoICsgJ319Jyk7XG4gIH1cblxuICByZXR1cm4gZGVmO1xufVxuXG5mdW5jdGlvbiBheGlzVGl0bGVPZmZzZXQoZW5jb2RpbmcsIGxheW91dCwgbmFtZSkge1xuICB2YXIgdmFsdWUgPSBlbmNvZGluZy5heGlzKG5hbWUpLnRpdGxlT2Zmc2V0O1xuICBpZiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSBST1c6IHJldHVybiAwO1xuICAgIGNhc2UgQ09MOiByZXR1cm4gMzU7XG4gIH1cbiAgcmV0dXJuIGdldHRlcihsYXlvdXQsIFtuYW1lLCAnYXhpc1RpdGxlT2Zmc2V0J10pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiaW5uaW5nO1xuXG5mdW5jdGlvbiBiaW5uaW5nKHNwZWMsIGVuY29kaW5nLCBvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuICB2YXIgYmlucyA9IHt9O1xuXG4gIGlmIChvcHQucHJlYWdncmVnYXRlZERhdGEpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIXNwZWMudHJhbnNmb3JtKSBzcGVjLnRyYW5zZm9ybSA9IFtdO1xuXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZW5jb2RpbmcuYmluKGVuY1R5cGUpKSB7XG4gICAgICBzcGVjLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2JpbicsXG4gICAgICAgIGZpZWxkOiAnZGF0YS4nICsgZmllbGQubmFtZSxcbiAgICAgICAgb3V0cHV0OiAnZGF0YS5iaW5fJyArIGZpZWxkLm5hbWUsXG4gICAgICAgIG1heGJpbnM6IGVuY29kaW5nLmJpbihlbmNUeXBlKS5tYXhiaW5zXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlO1xuXG52YXIgRW5jb2RpbmcgPSByZXF1aXJlKCcuLi9FbmNvZGluZycpLFxuICBheGlzID0gY29tcGlsZS5heGlzID0gcmVxdWlyZSgnLi9heGlzJyksXG4gIGZpbHRlciA9IGNvbXBpbGUuZmlsdGVyID0gcmVxdWlyZSgnLi9maWx0ZXInKSxcbiAgbGVnZW5kID0gY29tcGlsZS5sZWdlbmQgPSByZXF1aXJlKCcuL2xlZ2VuZCcpLFxuICBtYXJrcyA9IGNvbXBpbGUubWFya3MgPSByZXF1aXJlKCcuL21hcmtzJyksXG4gIHNjYWxlID0gY29tcGlsZS5zY2FsZSA9IHJlcXVpcmUoJy4vc2NhbGUnKTtcblxuY29tcGlsZS5hZ2dyZWdhdGUgPSByZXF1aXJlKCcuL2FnZ3JlZ2F0ZScpO1xuY29tcGlsZS5iaW4gPSByZXF1aXJlKCcuL2JpbicpO1xuY29tcGlsZS5mYWNldCA9IHJlcXVpcmUoJy4vZmFjZXQnKTtcbmNvbXBpbGUuZ3JvdXAgPSByZXF1aXJlKCcuL2dyb3VwJyk7XG5jb21waWxlLmxheW91dCA9IHJlcXVpcmUoJy4vbGF5b3V0Jyk7XG5jb21waWxlLnNvcnQgPSByZXF1aXJlKCcuL3NvcnQnKTtcbmNvbXBpbGUuc3RhY2sgPSByZXF1aXJlKCcuL3N0YWNrJyk7XG5jb21waWxlLnN0eWxlID0gcmVxdWlyZSgnLi9zdHlsZScpO1xuY29tcGlsZS5zdWJmYWNldCA9IHJlcXVpcmUoJy4vc3ViZmFjZXQnKTtcbmNvbXBpbGUudGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlJyk7XG5jb21waWxlLnRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxuZnVuY3Rpb24gY29tcGlsZShzcGVjLCBzdGF0cywgdGhlbWUpIHtcbiAgcmV0dXJuIGNvbXBpbGUuZW5jb2RpbmcoRW5jb2RpbmcuZnJvbVNwZWMoc3BlYywgdGhlbWUpLCBzdGF0cyk7XG59XG5cbmNvbXBpbGUuc2hvcnRoYW5kID0gZnVuY3Rpb24gKHNob3J0aGFuZCwgc3RhdHMsIGNvbmZpZywgdGhlbWUpIHtcbiAgcmV0dXJuIGNvbXBpbGUuZW5jb2RpbmcoRW5jb2RpbmcuZnJvbVNob3J0aGFuZChzaG9ydGhhbmQsIGNvbmZpZywgdGhlbWUpLCBzdGF0cyk7XG59O1xuXG5jb21waWxlLmVuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgbGF5b3V0ID0gY29tcGlsZS5sYXlvdXQoZW5jb2RpbmcsIHN0YXRzKSxcbiAgICBzdHlsZSA9IGNvbXBpbGUuc3R5bGUoZW5jb2RpbmcsIHN0YXRzKSxcbiAgICBzcGVjID0gY29tcGlsZS50ZW1wbGF0ZShlbmNvZGluZywgbGF5b3V0LCBzdGF0cyksXG4gICAgZ3JvdXAgPSBzcGVjLm1hcmtzWzBdLFxuICAgIG1hcmsgPSBtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXSxcbiAgICBtZGVmcyA9IG1hcmtzLmRlZihtYXJrLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSksXG4gICAgbWRlZiA9IG1kZWZzWzBdOyAgLy8gVE9ETzogcmVtb3ZlIHRoaXMgZGlydHkgaGFjayBieSByZWZhY3RvcmluZyB0aGUgd2hvbGUgZmxvd1xuXG4gIGZpbHRlci5hZGRGaWx0ZXJzKHNwZWMsIGVuY29kaW5nKTtcbiAgdmFyIHNvcnRpbmcgPSBjb21waWxlLnNvcnQoc3BlYywgZW5jb2RpbmcsIHN0YXRzKTtcblxuICB2YXIgaGFzUm93ID0gZW5jb2RpbmcuaGFzKFJPVyksIGhhc0NvbCA9IGVuY29kaW5nLmhhcyhDT0wpO1xuXG4gIHZhciBwcmVhZ2dyZWdhdGVkRGF0YSA9ICEhZW5jb2RpbmcuZGF0YSgndmVnYVNlcnZlcicpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbWRlZnMubGVuZ3RoOyBpKyspIHtcbiAgICBncm91cC5tYXJrcy5wdXNoKG1kZWZzW2ldKTtcbiAgfVxuXG4gIGNvbXBpbGUuYmluKHNwZWMuZGF0YVsxXSwgZW5jb2RpbmcsIHtwcmVhZ2dyZWdhdGVkRGF0YTogcHJlYWdncmVnYXRlZERhdGF9KTtcblxuICB2YXIgbGluZVR5cGUgPSBtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXS5saW5lO1xuXG4gIGlmICghcHJlYWdncmVnYXRlZERhdGEpIHtcbiAgICBzcGVjID0gY29tcGlsZS50aW1lKHNwZWMsIGVuY29kaW5nKTtcbiAgfVxuXG4gIC8vIGhhbmRsZSBzdWJmYWNldHNcbiAgdmFyIGFnZ1Jlc3VsdCA9IGNvbXBpbGUuYWdncmVnYXRlKHNwZWMsIGVuY29kaW5nLCB7cHJlYWdncmVnYXRlZERhdGE6IHByZWFnZ3JlZ2F0ZWREYXRhfSksXG4gICAgZGV0YWlscyA9IGFnZ1Jlc3VsdC5kZXRhaWxzLFxuICAgIGhhc0RldGFpbHMgPSBkZXRhaWxzICYmIGRldGFpbHMubGVuZ3RoID4gMCxcbiAgICBzdGFjayA9IGhhc0RldGFpbHMgJiYgY29tcGlsZS5zdGFjayhzcGVjLCBlbmNvZGluZywgbWRlZiwgYWdnUmVzdWx0LmZhY2V0cyk7XG5cbiAgaWYgKGhhc0RldGFpbHMgJiYgKHN0YWNrIHx8IGxpbmVUeXBlKSkge1xuICAgIC8vc3ViZmFjZXQgdG8gZ3JvdXAgc3RhY2sgLyBsaW5lIHRvZ2V0aGVyIGluIG9uZSBncm91cFxuICAgIGNvbXBpbGUuc3ViZmFjZXQoZ3JvdXAsIG1kZWYsIGRldGFpbHMsIHN0YWNrLCBlbmNvZGluZyk7XG4gIH1cblxuICAvLyBhdXRvLXNvcnQgbGluZS9hcmVhIHZhbHVlc1xuICAvL1RPRE8oa2FuaXR3KTogaGF2ZSBzb21lIGNvbmZpZyB0byB0dXJuIG9mZiBhdXRvLXNvcnQgZm9yIGxpbmUgKGZvciBsaW5lIGNoYXJ0IHRoYXQgZW5jb2RlcyB0ZW1wb3JhbCBpbmZvcm1hdGlvbilcbiAgaWYgKGxpbmVUeXBlKSB7XG4gICAgdmFyIGYgPSAoZW5jb2RpbmcuaXNNZWFzdXJlKFgpICYmIGVuY29kaW5nLmlzRGltZW5zaW9uKFkpKSA/IFkgOiBYO1xuICAgIGlmICghbWRlZi5mcm9tKSBtZGVmLmZyb20gPSB7fTtcbiAgICAvLyBUT0RPOiB3aHkgLSA/XG4gICAgbWRlZi5mcm9tLnRyYW5zZm9ybSA9IFt7dHlwZTogJ3NvcnQnLCBieTogJy0nICsgZW5jb2RpbmcuZmllbGQoZil9XTtcbiAgfVxuXG4gIC8vIFNtYWxsIE11bHRpcGxlc1xuICBpZiAoaGFzUm93IHx8IGhhc0NvbCkge1xuICAgIHNwZWMgPSBjb21waWxlLmZhY2V0KGdyb3VwLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc29ydGluZywgc3BlYywgbWRlZiwgc3RhY2ssIHN0YXRzKTtcbiAgICBzcGVjLmxlZ2VuZHMgPSBsZWdlbmQuZGVmcyhlbmNvZGluZyk7XG4gIH0gZWxzZSB7XG4gICAgZ3JvdXAuc2NhbGVzID0gc2NhbGUuZGVmcyhzY2FsZS5uYW1lcyhtZGVmLnByb3BlcnRpZXMudXBkYXRlKSwgZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIHNvcnRpbmcsXG4gICAgICB7c3RhY2s6IHN0YWNrLCBzdGF0czogc3RhdHN9KTtcbiAgICBncm91cC5heGVzID0gYXhpcy5kZWZzKGF4aXMubmFtZXMobWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZSksIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKTtcbiAgICBncm91cC5sZWdlbmRzID0gbGVnZW5kLmRlZnMoZW5jb2RpbmcpO1xuICB9XG5cbiAgZmlsdGVyLmZpbHRlckxlc3NUaGFuWmVybyhzcGVjLCBlbmNvZGluZyk7XG5cbiAgcmV0dXJuIHNwZWM7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpLFxuICBncm91cGRlZiA9IHJlcXVpcmUoJy4vZ3JvdXAnKS5kZWYsXG4gIHNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY2V0aW5nO1xuXG5mdW5jdGlvbiBmYWNldGluZyhncm91cCwgZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIHNvcnRpbmcsIHNwZWMsIG1kZWYsIHN0YWNrLCBzdGF0cykge1xuICB2YXIgZW50ZXIgPSBncm91cC5wcm9wZXJ0aWVzLmVudGVyO1xuICB2YXIgZmFjZXRLZXlzID0gW10sIGNlbGxBeGVzID0gW10sIGZyb20sIGF4ZXNHcnA7XG5cbiAgdmFyIGhhc1JvdyA9IGVuY29kaW5nLmhhcyhST1cpLCBoYXNDb2wgPSBlbmNvZGluZy5oYXMoQ09MKTtcblxuICBlbnRlci5maWxsID0ge3ZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxCYWNrZ3JvdW5kQ29sb3InKX07XG5cbiAgLy9tb3ZlIFwiZnJvbVwiIHRvIGNlbGwgbGV2ZWwgYW5kIGFkZCBmYWNldCB0cmFuc2Zvcm1cbiAgZ3JvdXAuZnJvbSA9IHtkYXRhOiBncm91cC5tYXJrc1swXS5mcm9tLmRhdGF9O1xuXG4gIC8vIEhhY2ssIHRoaXMgbmVlZHMgdG8gYmUgcmVmYWN0b3JlZFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGdyb3VwLm1hcmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG1hcmsgPSBncm91cC5tYXJrc1tpXTtcbiAgICBpZiAobWFyay5mcm9tLnRyYW5zZm9ybSkge1xuICAgICAgZGVsZXRlIG1hcmsuZnJvbS5kYXRhOyAvL25lZWQgdG8ga2VlcCB0cmFuc2Zvcm0gZm9yIHN1YmZhY2V0dGluZyBjYXNlXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBtYXJrLmZyb207XG4gICAgfVxuICB9XG5cbiAgaWYgKGhhc1Jvdykge1xuICAgIGlmICghZW5jb2RpbmcuaXNEaW1lbnNpb24oUk9XKSkge1xuICAgICAgdXRpbC5lcnJvcignUm93IGVuY29kaW5nIHNob3VsZCBiZSBvcmRpbmFsLicpO1xuICAgIH1cbiAgICBlbnRlci55ID0ge3NjYWxlOiBST1csIGZpZWxkOiAna2V5cy4nICsgZmFjZXRLZXlzLmxlbmd0aH07XG4gICAgZW50ZXIuaGVpZ2h0ID0geyd2YWx1ZSc6IGxheW91dC5jZWxsSGVpZ2h0fTsgLy8gSEFDS1xuXG4gICAgZmFjZXRLZXlzLnB1c2goZW5jb2RpbmcuZmllbGQoUk9XKSk7XG5cbiAgICBpZiAoaGFzQ29sKSB7XG4gICAgICBmcm9tID0gdXRpbC5kdXBsaWNhdGUoZ3JvdXAuZnJvbSk7XG4gICAgICBmcm9tLnRyYW5zZm9ybSA9IGZyb20udHJhbnNmb3JtIHx8IFtdO1xuICAgICAgZnJvbS50cmFuc2Zvcm0udW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogW2VuY29kaW5nLmZpZWxkKENPTCldfSk7XG4gICAgfVxuXG4gICAgYXhlc0dycCA9IGdyb3VwZGVmKCd4LWF4ZXMnLCB7XG4gICAgICAgIGF4ZXM6IGVuY29kaW5nLmhhcyhYKSA/IGF4aXMuZGVmcyhbJ3gnXSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpIDogdW5kZWZpbmVkLFxuICAgICAgICB4OiBoYXNDb2wgPyB7c2NhbGU6IENPTCwgZmllbGQ6ICdrZXlzLjAnfSA6IHt2YWx1ZTogMH0sXG4gICAgICAgIHdpZHRoOiBoYXNDb2wgJiYgeyd2YWx1ZSc6IGxheW91dC5jZWxsV2lkdGh9LCAvL0hBQ0s/XG4gICAgICAgIGZyb206IGZyb21cbiAgICAgIH0pO1xuXG4gICAgc3BlYy5tYXJrcy51bnNoaWZ0KGF4ZXNHcnApOyAvLyBuZWVkIHRvIHByZXBlbmQgc28gaXQgYXBwZWFycyB1bmRlciB0aGUgcGxvdHNcbiAgICAoc3BlYy5heGVzID0gc3BlYy5heGVzIHx8IFtdKTtcbiAgICBzcGVjLmF4ZXMucHVzaC5hcHBseShzcGVjLmF4ZXMsIGF4aXMuZGVmcyhbJ3JvdyddLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgcm93XG4gICAgaWYgKGVuY29kaW5nLmhhcyhYKSkge1xuICAgICAgLy9rZWVwIHggYXhpcyBpbiB0aGUgY2VsbFxuICAgICAgY2VsbEF4ZXMucHVzaC5hcHBseShjZWxsQXhlcywgYXhpcy5kZWZzKFsneCddLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChoYXNDb2wpIHtcbiAgICBpZiAoIWVuY29kaW5nLmlzRGltZW5zaW9uKENPTCkpIHtcbiAgICAgIHV0aWwuZXJyb3IoJ0NvbCBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC4nKTtcbiAgICB9XG4gICAgZW50ZXIueCA9IHtzY2FsZTogQ09MLCBmaWVsZDogJ2tleXMuJyArIGZhY2V0S2V5cy5sZW5ndGh9O1xuICAgIGVudGVyLndpZHRoID0geyd2YWx1ZSc6IGxheW91dC5jZWxsV2lkdGh9OyAvLyBIQUNLXG5cbiAgICBmYWNldEtleXMucHVzaChlbmNvZGluZy5maWVsZChDT0wpKTtcblxuICAgIGlmIChoYXNSb3cpIHtcbiAgICAgIGZyb20gPSB1dGlsLmR1cGxpY2F0ZShncm91cC5mcm9tKTtcbiAgICAgIGZyb20udHJhbnNmb3JtID0gZnJvbS50cmFuc2Zvcm0gfHwgW107XG4gICAgICBmcm9tLnRyYW5zZm9ybS51bnNoaWZ0KHt0eXBlOiAnZmFjZXQnLCBrZXlzOiBbZW5jb2RpbmcuZmllbGQoUk9XKV19KTtcbiAgICB9XG5cbiAgICBheGVzR3JwID0gZ3JvdXBkZWYoJ3ktYXhlcycsIHtcbiAgICAgIGF4ZXM6IGVuY29kaW5nLmhhcyhZKSA/IGF4aXMuZGVmcyhbJ3knXSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpIDogdW5kZWZpbmVkLFxuICAgICAgeTogaGFzUm93ICYmIHtzY2FsZTogUk9XLCBmaWVsZDogJ2tleXMuMCd9LFxuICAgICAgeDogaGFzUm93ICYmIHt2YWx1ZTogMH0sXG4gICAgICBoZWlnaHQ6IGhhc1JvdyAmJiB7J3ZhbHVlJzogbGF5b3V0LmNlbGxIZWlnaHR9LCAvL0hBQ0s/XG4gICAgICBmcm9tOiBmcm9tXG4gICAgfSk7XG5cbiAgICBzcGVjLm1hcmtzLnVuc2hpZnQoYXhlc0dycCk7IC8vIG5lZWQgdG8gcHJlcGVuZCBzbyBpdCBhcHBlYXJzIHVuZGVyIHRoZSBwbG90c1xuICAgIChzcGVjLmF4ZXMgPSBzcGVjLmF4ZXMgfHwgW10pO1xuICAgIHNwZWMuYXhlcy5wdXNoLmFwcGx5KHNwZWMuYXhlcywgYXhpcy5kZWZzKFsnY29sJ10sIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSk7XG4gIH0gZWxzZSB7IC8vIGRvZXNuJ3QgaGF2ZSBjb2xcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFkpKSB7XG4gICAgICBjZWxsQXhlcy5wdXNoLmFwcGx5KGNlbGxBeGVzLCBheGlzLmRlZnMoWyd5J10sIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gYXNzdW1pbmcgZXF1YWwgY2VsbFdpZHRoIGhlcmVcbiAgLy8gVE9ETzogc3VwcG9ydCBoZXRlcm9nZW5vdXMgY2VsbFdpZHRoIChtYXliZSBieSB1c2luZyBtdWx0aXBsZSBzY2FsZXM/KVxuICBzcGVjLnNjYWxlcyA9IChzcGVjLnNjYWxlcyB8fCBbXSkuY29uY2F0KHNjYWxlLmRlZnMoXG4gICAgc2NhbGUubmFtZXMoZW50ZXIpLmNvbmNhdChzY2FsZS5uYW1lcyhtZGVmLnByb3BlcnRpZXMudXBkYXRlKSksXG4gICAgZW5jb2RpbmcsXG4gICAgbGF5b3V0LFxuICAgIHN0eWxlLFxuICAgIHNvcnRpbmcsXG4gICAge3N0YWNrOiBzdGFjaywgZmFjZXQ6IHRydWUsIHN0YXRzOiBzdGF0c31cbiAgKSk7IC8vIHJvdy9jb2wgc2NhbGVzICsgY2VsbCBzY2FsZXNcblxuICBpZiAoY2VsbEF4ZXMubGVuZ3RoID4gMCkge1xuICAgIGdyb3VwLmF4ZXMgPSBjZWxsQXhlcztcbiAgfVxuXG4gIC8vIGFkZCBmYWNldCB0cmFuc2Zvcm1cbiAgdmFyIHRyYW5zID0gKGdyb3VwLmZyb20udHJhbnNmb3JtIHx8IChncm91cC5mcm9tLnRyYW5zZm9ybSA9IFtdKSk7XG4gIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IGZhY2V0S2V5c30pO1xuXG4gIHJldHVybiBzcGVjO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIGZpbHRlciA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZhciBCSU5BUlkgPSB7XG4gICc+JzogIHRydWUsXG4gICc+PSc6IHRydWUsXG4gICc9JzogIHRydWUsXG4gICchPSc6IHRydWUsXG4gICc8JzogIHRydWUsXG4gICc8PSc6IHRydWVcbn07XG5cbmZpbHRlci5hZGRGaWx0ZXJzID0gZnVuY3Rpb24oc3BlYywgZW5jb2RpbmcpIHtcbiAgdmFyIGZpbHRlcnMgPSBlbmNvZGluZy5maWx0ZXIoKSxcbiAgICBkYXRhID0gc3BlYy5kYXRhWzBdOyAgLy8gYXBwbHkgZmlsdGVycyB0byByYXcgZGF0YSBiZWZvcmUgYWdncmVnYXRpb25cblxuICBpZiAoIWRhdGEudHJhbnNmb3JtKVxuICAgIGRhdGEudHJhbnNmb3JtID0gW107XG5cbiAgLy8gYWRkIGN1c3RvbSBmaWx0ZXJzXG4gIGZvciAodmFyIGkgaW4gZmlsdGVycykge1xuICAgIHZhciBmaWx0ZXIgPSBmaWx0ZXJzW2ldO1xuXG4gICAgdmFyIGNvbmRpdGlvbiA9ICcnO1xuICAgIHZhciBvcGVyYXRvciA9IGZpbHRlci5vcGVyYXRvcjtcbiAgICB2YXIgb3BlcmFuZHMgPSBmaWx0ZXIub3BlcmFuZHM7XG5cbiAgICBpZiAoQklOQVJZW29wZXJhdG9yXSkge1xuICAgICAgLy8gZXhwZWN0cyBhIGZpZWxkIGFuZCBhIHZhbHVlXG4gICAgICBpZiAob3BlcmF0b3IgPT09ICc9Jykge1xuICAgICAgICBvcGVyYXRvciA9ICc9PSc7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcDEgPSBvcGVyYW5kc1swXTtcbiAgICAgIHZhciBvcDIgPSBvcGVyYW5kc1sxXTtcbiAgICAgIGNvbmRpdGlvbiA9ICdkLmRhdGEuJyArIG9wMSArIG9wZXJhdG9yICsgb3AyO1xuICAgIH0gZWxzZSBpZiAob3BlcmF0b3IgPT09ICdub3ROdWxsJykge1xuICAgICAgLy8gZXhwZWN0cyBhIG51bWJlciBvZiBmaWVsZHNcbiAgICAgIGZvciAodmFyIGogaW4gb3BlcmFuZHMpIHtcbiAgICAgICAgY29uZGl0aW9uICs9ICdkLmRhdGEuJyArIG9wZXJhbmRzW2pdICsgJyE9PW51bGwnO1xuICAgICAgICBpZiAoaiA8IG9wZXJhbmRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBjb25kaXRpb24gKz0gJyAmJiAnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignVW5zdXBwb3J0ZWQgb3BlcmF0b3I6ICcsIG9wZXJhdG9yKTtcbiAgICB9XG5cbiAgICBkYXRhLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgdGVzdDogY29uZGl0aW9uXG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIHJlbW92ZSBsZXNzIHRoYW4gMCB2YWx1ZXMgaWYgd2UgdXNlIGxvZyBmdW5jdGlvblxuZmlsdGVyLmZpbHRlckxlc3NUaGFuWmVybyA9IGZ1bmN0aW9uKHNwZWMsIGVuY29kaW5nKSB7XG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZW5jb2Rpbmcuc2NhbGUoZW5jVHlwZSkudHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIHNwZWMuZGF0YVsxXS50cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgICB0ZXN0OiAnZC4nICsgZW5jb2RpbmcuZmllbGQoZW5jVHlwZSkgKyAnPjAnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVmOiBncm91cGRlZlxufTtcblxuZnVuY3Rpb24gZ3JvdXBkZWYobmFtZSwgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcbiAgcmV0dXJuIHtcbiAgICBfbmFtZTogbmFtZSB8fCB1bmRlZmluZWQsXG4gICAgdHlwZTogJ2dyb3VwJyxcbiAgICBmcm9tOiBvcHQuZnJvbSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBlbnRlcjoge1xuICAgICAgICB4OiBvcHQueCB8fCB1bmRlZmluZWQsXG4gICAgICAgIHk6IG9wdC55IHx8IHVuZGVmaW5lZCxcbiAgICAgICAgd2lkdGg6IG9wdC53aWR0aCB8fCB7Z3JvdXA6ICd3aWR0aCd9LFxuICAgICAgICBoZWlnaHQ6IG9wdC5oZWlnaHQgfHwge2dyb3VwOiAnaGVpZ2h0J31cbiAgICAgIH1cbiAgICB9LFxuICAgIHNjYWxlczogb3B0LnNjYWxlcyB8fCB1bmRlZmluZWQsXG4gICAgYXhlczogb3B0LmF4ZXMgfHwgdW5kZWZpbmVkLFxuICAgIG1hcmtzOiBvcHQubWFya3MgfHwgW11cbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHNldHRlciA9IHV0aWwuc2V0dGVyLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWEvc2NoZW1hJyksXG4gIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKSxcbiAgdmxmaWVsZCA9IHJlcXVpcmUoJy4uL2ZpZWxkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdmxsYXlvdXQ7XG5cbmZ1bmN0aW9uIHZsbGF5b3V0KGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgbGF5b3V0ID0gYm94KGVuY29kaW5nLCBzdGF0cyk7XG4gIGxheW91dCA9IG9mZnNldChlbmNvZGluZywgc3RhdHMsIGxheW91dCk7XG4gIHJldHVybiBsYXlvdXQ7XG59XG5cbi8qXG4gIEhBQ0sgdG8gc2V0IGNoYXJ0IHNpemVcbiAgTk9URTogdGhpcyBmYWlscyBmb3IgcGxvdHMgZHJpdmVuIGJ5IGRlcml2ZWQgdmFsdWVzIChlLmcuLCBhZ2dyZWdhdGVzKVxuICBPbmUgc29sdXRpb24gaXMgdG8gdXBkYXRlIFZlZ2EgdG8gc3VwcG9ydCBhdXRvLXNpemluZ1xuICBJbiB0aGUgbWVhbnRpbWUsIGF1dG8tcGFkZGluZyAobW9zdGx5KSBkb2VzIHRoZSB0cmlja1xuICovXG5mdW5jdGlvbiBib3goZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSxcbiAgICAgIGhhc0NvbCA9IGVuY29kaW5nLmhhcyhDT0wpLFxuICAgICAgaGFzWCA9IGVuY29kaW5nLmhhcyhYKSxcbiAgICAgIGhhc1kgPSBlbmNvZGluZy5oYXMoWSksXG4gICAgICBtYXJrdHlwZSA9IGVuY29kaW5nLm1hcmt0eXBlKCk7XG5cbiAgLy8gRklYTUUvSEFDSyB3ZSBuZWVkIHRvIHRha2UgZmlsdGVyIGludG8gYWNjb3VudFxuICB2YXIgeENhcmRpbmFsaXR5ID0gaGFzWCAmJiBlbmNvZGluZy5pc0RpbWVuc2lvbihYKSA/IGVuY29kaW5nLmNhcmRpbmFsaXR5KFgsIHN0YXRzKSA6IDEsXG4gICAgeUNhcmRpbmFsaXR5ID0gaGFzWSAmJiBlbmNvZGluZy5pc0RpbWVuc2lvbihZKSA/IGVuY29kaW5nLmNhcmRpbmFsaXR5KFksIHN0YXRzKSA6IDE7XG5cbiAgdmFyIHVzZVNtYWxsQmFuZCA9IHhDYXJkaW5hbGl0eSA+IGVuY29kaW5nLmNvbmZpZygnbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHknKSB8fFxuICAgIHlDYXJkaW5hbGl0eSA+IGVuY29kaW5nLmNvbmZpZygnbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHknKTtcblxuICB2YXIgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0LCBjZWxsUGFkZGluZyA9IGVuY29kaW5nLmNvbmZpZygnY2VsbFBhZGRpbmcnKTtcblxuICAvLyBzZXQgY2VsbFdpZHRoXG4gIGlmIChoYXNYKSB7XG4gICAgaWYgKGVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKFgpKSB7XG4gICAgICAvLyBmb3Igb3JkaW5hbCwgaGFzQ29sIG9yIG5vdCBkb2Vzbid0IG1hdHRlciAtLSB3ZSBzY2FsZSBiYXNlZCBvbiBjYXJkaW5hbGl0eVxuICAgICAgY2VsbFdpZHRoID0gKHhDYXJkaW5hbGl0eSArIGVuY29kaW5nLmJhbmQoWCkucGFkZGluZykgKiBlbmNvZGluZy5iYW5kU2l6ZShYLCB1c2VTbWFsbEJhbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsV2lkdGggPSBoYXNDb2wgfHwgaGFzUm93ID8gZW5jb2RpbmcuZW5jKENPTCkud2lkdGggOiAgZW5jb2RpbmcuY29uZmlnKFwic2luZ2xlV2lkdGhcIik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChtYXJrdHlwZSA9PT0gVEVYVCkge1xuICAgICAgY2VsbFdpZHRoID0gZW5jb2RpbmcuY29uZmlnKCd0ZXh0Q2VsbFdpZHRoJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGxXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNldCBjZWxsSGVpZ2h0XG4gIGlmIChoYXNZKSB7XG4gICAgaWYgKGVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKFkpKSB7XG4gICAgICAvLyBmb3Igb3JkaW5hbCwgaGFzQ29sIG9yIG5vdCBkb2Vzbid0IG1hdHRlciAtLSB3ZSBzY2FsZSBiYXNlZCBvbiBjYXJkaW5hbGl0eVxuICAgICAgY2VsbEhlaWdodCA9ICh5Q2FyZGluYWxpdHkgKyBlbmNvZGluZy5iYW5kKFkpLnBhZGRpbmcpICogZW5jb2RpbmcuYmFuZFNpemUoWSwgdXNlU21hbGxCYW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbEhlaWdodCA9IGhhc0NvbCB8fCBoYXNSb3cgPyBlbmNvZGluZy5lbmMoUk9XKS5oZWlnaHQgOiAgZW5jb2RpbmcuY29uZmlnKFwic2luZ2xlSGVpZ2h0XCIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjZWxsSGVpZ2h0ID0gZW5jb2RpbmcuYmFuZFNpemUoWSk7XG4gIH1cblxuICAvLyBDZWxsIGJhbmRzIHVzZSByYW5nZUJhbmRzKCkuIFRoZXJlIGFyZSBuLTEgcGFkZGluZy4gIE91dGVycGFkZGluZyA9IDAgZm9yIGNlbGxzXG5cbiAgdmFyIHdpZHRoID0gY2VsbFdpZHRoLCBoZWlnaHQgPSBjZWxsSGVpZ2h0O1xuICBpZiAoaGFzQ29sKSB7XG4gICAgdmFyIGNvbENhcmRpbmFsaXR5ID0gZW5jb2RpbmcuY2FyZGluYWxpdHkoQ09MLCBzdGF0cyk7XG4gICAgd2lkdGggPSBjZWxsV2lkdGggKiAoKDEgKyBjZWxsUGFkZGluZykgKiAoY29sQ2FyZGluYWxpdHkgLSAxKSArIDEpO1xuICB9XG4gIGlmIChoYXNSb3cpIHtcbiAgICB2YXIgcm93Q2FyZGluYWxpdHkgPSAgZW5jb2RpbmcuY2FyZGluYWxpdHkoUk9XLCBzdGF0cyk7XG4gICAgaGVpZ2h0ID0gY2VsbEhlaWdodCAqICgoMSArIGNlbGxQYWRkaW5nKSAqIChyb3dDYXJkaW5hbGl0eSAtIDEpICsgMSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHdob2xlIGNlbGxcbiAgICBjZWxsV2lkdGg6IGNlbGxXaWR0aCxcbiAgICBjZWxsSGVpZ2h0OiBjZWxsSGVpZ2h0LFxuICAgIGNlbGxQYWRkaW5nOiBjZWxsUGFkZGluZyxcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjaGFydFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAvLyBpbmZvcm1hdGlvbiBhYm91dCB4IGFuZCB5LCBzdWNoIGFzIGJhbmQgc2l6ZVxuICAgIHg6IHt1c2VTbWFsbEJhbmQ6IHVzZVNtYWxsQmFuZH0sXG4gICAgeToge3VzZVNtYWxsQmFuZDogdXNlU21hbGxCYW5kfVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRNYXhMZW5ndGgoZW5jb2RpbmcsIHN0YXRzLCBldCkge1xuICAvLyBGSVhNRSBkZXRlcm1pbmUgY29uc3RhbnQgZm9yIFEgYW5kIFQgaW4gYSBuaWNlciB3YXlcbiAgcmV0dXJuIGVuY29kaW5nLmlzVHlwZShldCwgUSkgPyAyMCA6XG4gICAgZW5jb2RpbmcuaXNUeXBlKGV0LCBUKSA/IDIwIDpcbiAgICBzdGF0c1tlbmNvZGluZy5maWVsZE5hbWUoZXQpXS5tYXg7XG59XG5cbmZ1bmN0aW9uIG9mZnNldChlbmNvZGluZywgc3RhdHMsIGxheW91dCkge1xuICBbWCwgWV0uZm9yRWFjaChmdW5jdGlvbiAoeCkge1xuICAgIHZhciBtYXhMZW5ndGg7XG4gICAgaWYgKGVuY29kaW5nLmlzRGltZW5zaW9uKHgpIHx8IGVuY29kaW5nLmlzVHlwZSh4LCBUKSkge1xuICAgICAgbWF4TGVuZ3RoID0gIGdldE1heExlbmd0aChlbmNvZGluZywgc3RhdHMsIHgpO1xuICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcuYWdncih4KSA9PT0gJ2NvdW50Jykge1xuICAgICAgLy9hc3NpZ24gZGVmYXVsdCB2YWx1ZSBmb3IgY291bnQgYXMgaXQgd29uJ3QgaGF2ZSBzdGF0c1xuICAgICAgbWF4TGVuZ3RoID0gIDM7XG4gICAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGUoeCwgUSkpIHtcbiAgICAgIGlmICh4PT09WCkge1xuICAgICAgICBtYXhMZW5ndGggPSAzO1xuICAgICAgfSBlbHNlIHsgLy8gWVxuICAgICAgICAvL2Fzc3VtZSB0aGF0IGRlZmF1bHQgZm9ybWF0aW5nIGlzIGFsd2F5cyBzaG9ydGVyIHRoYW4gN1xuICAgICAgICBtYXhMZW5ndGggPSBNYXRoLm1pbihnZXRNYXhMZW5ndGgoZW5jb2RpbmcsIHN0YXRzLCB4KSwgNyk7XG4gICAgICB9XG4gICAgfVxuICAgIHNldHRlcihsYXlvdXQsW3gsICdheGlzVGl0bGVPZmZzZXQnXSwgZW5jb2RpbmcuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpICogIG1heExlbmd0aCArIDIwKTtcbiAgfSk7XG4gIHJldHVybiBsYXlvdXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxudmFyIGxlZ2VuZCA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmxlZ2VuZC5kZWZzID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdmFyIGRlZnMgPSBbXTtcblxuICAvLyBUT0RPOiBzdXBwb3J0IGFscGhhXG5cbiAgaWYgKGVuY29kaW5nLmhhcyhDT0xPUikgJiYgZW5jb2RpbmcubGVnZW5kKENPTE9SKSkge1xuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKENPTE9SLCBlbmNvZGluZywge1xuICAgICAgZmlsbDogQ09MT1IsXG4gICAgICBvcmllbnQ6ICdyaWdodCdcbiAgICB9KSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNJWkUpICYmIGVuY29kaW5nLmxlZ2VuZChTSVpFKSkge1xuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKFNJWkUsIGVuY29kaW5nLCB7XG4gICAgICBzaXplOiBTSVpFLFxuICAgICAgb3JpZW50OiBkZWZzLmxlbmd0aCA9PT0gMSA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB9KSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNIQVBFKSAmJiBlbmNvZGluZy5sZWdlbmQoU0hBUEUpKSB7XG4gICAgaWYgKGRlZnMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBUT0RPOiBmaXggdGhpc1xuICAgICAgY29uc29sZS5lcnJvcignVmVnYWxpdGUgY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgdHdvIGxlZ2VuZHMnKTtcbiAgICAgIHJldHVybiBkZWZzO1xuICAgIH1cbiAgICBkZWZzLnB1c2gobGVnZW5kLmRlZihTSEFQRSwgZW5jb2RpbmcsIHtcbiAgICAgIHNoYXBlOiBTSEFQRSxcbiAgICAgIG9yaWVudDogZGVmcy5sZW5ndGggPT09IDEgPyAnbGVmdCcgOiAncmlnaHQnXG4gICAgfSkpO1xuICB9XG5cbiAgcmV0dXJuIGRlZnM7XG59O1xuXG5sZWdlbmQuZGVmID0gZnVuY3Rpb24obmFtZSwgZW5jb2RpbmcsIHByb3BzKSB7XG4gIHZhciBkZWYgPSBwcm9wcywgZm47XG5cbiAgZGVmLnRpdGxlID0gZW5jb2RpbmcuZmllbGRUaXRsZShuYW1lKTtcblxuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmIChmbiA9IGVuY29kaW5nLmZuKG5hbWUpKSAmJlxuICAgIHRpbWUuaGFzU2NhbGUoZm4pKSB7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBkZWYucHJvcGVydGllcyA9IGRlZi5wcm9wZXJ0aWVzIHx8IHt9LFxuICAgICAgbGFiZWxzID0gcHJvcGVydGllcy5sYWJlbHMgPSBwcm9wZXJ0aWVzLmxhYmVscyB8fCB7fSxcbiAgICAgIHRleHQgPSBsYWJlbHMudGV4dCA9IGxhYmVscy50ZXh0IHx8IHt9O1xuXG4gICAgdGV4dC5zY2FsZSA9ICd0aW1lLScrIGZuO1xuICB9XG5cbiAgcmV0dXJuIGRlZjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICB2bHNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG52YXIgbWFya3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5tYXJrcy5kZWYgPSBmdW5jdGlvbihtYXJrLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSkge1xuICB2YXIgZGVmcyA9IFtdO1xuXG4gIC8vIHRvIGFkZCBhIGJhY2tncm91bmQgdG8gdGV4dCwgd2UgbmVlZCB0byBhZGQgaXQgYmVmb3JlIHRoZSB0ZXh0XG4gIGlmIChlbmNvZGluZy5tYXJrdHlwZSgpID09PSBURVhUICYmIGVuY29kaW5nLmhhcyhDT0xPUikpIHtcbiAgICB2YXIgYmcgPSB7XG4gICAgICB4OiB7dmFsdWU6IDB9LFxuICAgICAgeToge3ZhbHVlOiAwfSxcbiAgICAgIHgyOiB7dmFsdWU6IGxheW91dC5jZWxsV2lkdGh9LFxuICAgICAgeTI6IHt2YWx1ZTogbGF5b3V0LmNlbGxIZWlnaHR9LFxuICAgICAgZmlsbDoge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGVuY29kaW5nLmZpZWxkKENPTE9SKX1cbiAgICB9O1xuICAgIGRlZnMucHVzaCh7XG4gICAgICB0eXBlOiAncmVjdCcsXG4gICAgICBmcm9tOiB7ZGF0YTogVEFCTEV9LFxuICAgICAgcHJvcGVydGllczoge2VudGVyOiBiZywgdXBkYXRlOiBiZ31cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGFkZCB0aGUgbWFyayBkZWYgZm9yIHRoZSBtYWluIHRoaW5nXG4gIHZhciBwID0gbWFyay5wcm9wKGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlKTtcbiAgZGVmcy5wdXNoKHtcbiAgICB0eXBlOiBtYXJrLnR5cGUsXG4gICAgZnJvbToge2RhdGE6IFRBQkxFfSxcbiAgICBwcm9wZXJ0aWVzOiB7ZW50ZXI6IHAsIHVwZGF0ZTogcH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRlZnM7XG59O1xuXG5tYXJrcy5iYXIgPSB7XG4gIHR5cGU6ICdyZWN0JyxcbiAgc3RhY2s6IHRydWUsXG4gIHByb3A6IGJhcl9wcm9wcyxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgc2l6ZTogMSwgY29sb3I6IDEsIGFscGhhOiAxfVxufTtcblxubWFya3MubGluZSA9IHtcbiAgdHlwZTogJ2xpbmUnLFxuICBsaW5lOiB0cnVlLFxuICBwcm9wOiBsaW5lX3Byb3BzLFxuICByZXF1aXJlZEVuY29kaW5nOiBbJ3gnLCAneSddLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBjb2xvcjogMSwgYWxwaGE6IDEsIGRldGFpbDoxfVxufTtcblxubWFya3MuYXJlYSA9IHtcbiAgdHlwZTogJ2FyZWEnLFxuICBzdGFjazogdHJ1ZSxcbiAgbGluZTogdHJ1ZSxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgcHJvcDogYXJlYV9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDEsIGFscGhhOiAxfVxufTtcblxubWFya3MudGljayA9IHtcbiAgdHlwZTogJ3JlY3QnLFxuICBwcm9wOiB0aWNrX3Byb3BzLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBjb2xvcjogMSwgYWxwaGE6IDEsIGRldGFpbDogMX1cbn07XG5cbm1hcmtzLmNpcmNsZSA9IHtcbiAgdHlwZTogJ3N5bWJvbCcsXG4gIHByb3A6IGZpbGxlZF9wb2ludF9wcm9wcygnY2lyY2xlJyksXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIHNpemU6IDEsIGNvbG9yOiAxLCBhbHBoYTogMSwgZGV0YWlsOiAxfVxufTtcblxubWFya3Muc3F1YXJlID0ge1xuICB0eXBlOiAnc3ltYm9sJyxcbiAgcHJvcDogZmlsbGVkX3BvaW50X3Byb3BzKCdzcXVhcmUnKSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IG1hcmtzLmNpcmNsZS5zdXBwb3J0ZWRFbmNvZGluZ1xufTtcblxubWFya3MucG9pbnQgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBwb2ludF9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgc2l6ZTogMSwgY29sb3I6IDEsIGFscGhhOiAxLCBzaGFwZTogMSwgZGV0YWlsOiAxfVxufTtcblxubWFya3MudGV4dCA9IHtcbiAgdHlwZTogJ3RleHQnLFxuICBwcm9wOiB0ZXh0X3Byb3BzLFxuICByZXF1aXJlZEVuY29kaW5nOiBbJ3RleHQnXSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgc2l6ZTogMSwgY29sb3I6IDEsIGFscGhhOiAxLCB0ZXh0OiAxfVxufTtcblxuZnVuY3Rpb24gYmFyX3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmlzTWVhc3VyZShYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICAgIGlmIChlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3NjYWxlOiBYLCB2YWx1ZTogZS5zY2FsZShYKS50eXBlID09PSAnbG9nJyA/IDEgOiAwfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZS5oYXMoWCkpIHsgLy8gaXMgb3JkaW5hbFxuICAgIHAueGMgPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUT0RPIGFkZCBzaW5nbGUgYmFyIG9mZnNldFxuICAgIHAueGMgPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5pc01lYXN1cmUoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICBwLnkyID0ge3NjYWxlOiBZLCB2YWx1ZTogZS5zY2FsZShZKS50eXBlID09PSAnbG9nJyA/IDEgOiAwfTtcbiAgfSBlbHNlIGlmIChlLmhhcyhZKSkgeyAvLyBpcyBvcmRpbmFsXG4gICAgcC55YyA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICB9IGVsc2Uge1xuICAgIC8vIFRPRE8gYWRkIHNpbmdsZSBiYXIgb2Zmc2V0XG4gICAgcC55YyA9IHtncm91cDogJ2hlaWdodCd9O1xuICB9XG5cbiAgLy8gd2lkdGhcbiAgaWYgKCFlLmhhcyhYKSB8fCBlLmlzT3JkaW5hbFNjYWxlKFgpKSB7IC8vIG5vIFggb3IgWCBpcyBvcmRpbmFsXG4gICAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgICBwLndpZHRoID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZChTSVpFKX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAud2lkdGggPSB7XG4gICAgICAgIHZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCksXG4gICAgICAgIG9mZnNldDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9IGVsc2UgeyAvLyBYIGlzIFF1YW50IG9yIFRpbWUgU2NhbGVcbiAgICBwLndpZHRoID0ge3ZhbHVlOiAyfTtcbiAgfVxuXG4gIC8vIGhlaWdodFxuICBpZiAoIWUuaGFzKFkpIHx8IGUuaXNPcmRpbmFsU2NhbGUoWSkpIHsgLy8gbm8gWSBvciBZIGlzIG9yZGluYWxcbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAuaGVpZ2h0ID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZChTSVpFKX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuaGVpZ2h0ID0ge1xuICAgICAgICB2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpLFxuICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIHsgLy8gWSBpcyBRdWFudCBvciBUaW1lIFNjYWxlXG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6IDJ9O1xuICB9XG5cbiAgLy8gZmlsbFxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IGUudmFsdWUoQUxQSEEpfTtcbiAgfVxuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBwb2ludF9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LngudXNlU21hbGxCYW5kKSAvIDJ9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDJ9O1xuICB9XG5cbiAgLy8gc2l6ZVxuICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICBwLnNpemUgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoU0laRSkpIHtcbiAgICBwLnNpemUgPSB7dmFsdWU6IGUudmFsdWUoU0laRSl9O1xuICB9XG5cbiAgLy8gc2hhcGVcbiAgaWYgKGUuaGFzKFNIQVBFKSkge1xuICAgIHAuc2hhcGUgPSB7c2NhbGU6IFNIQVBFLCBmaWVsZDogZS5maWVsZChTSEFQRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSEFQRSkpIHtcbiAgICBwLnNoYXBlID0ge3ZhbHVlOiBlLnZhbHVlKFNIQVBFKX07XG4gIH1cblxuICAvLyBzdHJva2VcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IGUudmFsdWUoQUxQSEEpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBzdHlsZS5vcGFjaXR5fTtcbiAgfVxuXG4gIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gbGluZV9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfVxuXG4gIC8vIHN0cm9rZVxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLnN0cm9rZSA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogZS52YWx1ZShBTFBIQSl9O1xuICB9XG5cbiAgcC5zdHJva2VXaWR0aCA9IHt2YWx1ZTogZS5jb25maWcoJ3N0cm9rZVdpZHRoJyl9O1xuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBhcmVhX3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmlzTWVhc3VyZShYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICAgIGlmIChlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3NjYWxlOiBYLCB2YWx1ZTogMH07XG4gICAgICBwLm9yaWVudCA9IHt2YWx1ZTogJ2hvcml6b250YWwnfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5pc01lYXN1cmUoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICBwLnkyID0ge3NjYWxlOiBZLCB2YWx1ZTogMH07XG4gIH0gZWxzZSBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIHtcbiAgICBwLnkgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfVxuXG4gIC8vIHN0cm9rZVxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gIH1cblxuICAvLyBhbHBoYVxuICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3NjYWxlOiBBTFBIQSwgZmllbGQ6IGUuZmllbGQoQUxQSEEpfTtcbiAgfSBlbHNlIGlmIChlLnZhbHVlKEFMUEhBKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBlLnZhbHVlKEFMUEhBKX07XG4gIH1cblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gdGlja19wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihYKSkge1xuICAgICAgcC54Lm9mZnNldCA9IC1lLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAzO1xuICAgIH1cbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC55Lm9mZnNldCA9IC1lLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAzO1xuICAgIH1cbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8gd2lkdGhcbiAgaWYgKCFlLmhhcyhYKSB8fCBlLmlzRGltZW5zaW9uKFgpKSB7XG4gICAgcC53aWR0aCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMS41fTtcbiAgfSBlbHNlIHtcbiAgICBwLndpZHRoID0ge3ZhbHVlOiAxfTtcbiAgfVxuXG4gIC8vIGhlaWdodFxuICBpZiAoIWUuaGFzKFkpIHx8IGUuaXNEaW1lbnNpb24oWSkpIHtcbiAgICBwLmhlaWdodCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMS41fTtcbiAgfSBlbHNlIHtcbiAgICBwLmhlaWdodCA9IHt2YWx1ZTogMX07XG4gIH1cblxuICAvLyBmaWxsXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICB9IGVsc2Uge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogZS52YWx1ZShBTFBIQSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IHN0eWxlLm9wYWNpdHl9O1xuICB9XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGZpbGxlZF9wb2ludF9wcm9wcyhzaGFwZSkge1xuICByZXR1cm4gZnVuY3Rpb24oZSwgbGF5b3V0LCBzdHlsZSkge1xuICAgIHZhciBwID0ge307XG5cbiAgICAvLyB4XG4gICAgaWYgKGUuaGFzKFgpKSB7XG4gICAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgICAgcC54ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKGUuaGFzKFkpKSB7XG4gICAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgICAgcC55ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgICB9XG5cbiAgICAvLyBzaXplXG4gICAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgICBwLnNpemUgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgICAgcC5zaXplID0ge3ZhbHVlOiBlLnZhbHVlKFNJWkUpfTtcbiAgICB9XG5cbiAgICAvLyBzaGFwZVxuICAgIHAuc2hhcGUgPSB7dmFsdWU6IHNoYXBlfTtcblxuICAgIC8vIGZpbGxcbiAgICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gICAgfVxuXG4gICAgLy8gYWxwaGFcbiAgICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICAgIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBlLnZhbHVlKEFMUEhBKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IHN0eWxlLm9wYWNpdHl9O1xuICAgIH1cblxuICAgIHJldHVybiBwO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0X3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIGlmIChlLmhhcyhURVhUKSAmJiBlLmlzVHlwZShURVhULCBRKSkge1xuICAgICAgcC54ID0ge3ZhbHVlOiBsYXlvdXQuY2VsbFdpZHRoLTV9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LngudXNlU21hbGxCYW5kKSAvIDJ9O1xuICAgIH1cbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgfVxuXG4gIC8vIHNpemVcbiAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgcC5mb250U2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGQoU0laRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSVpFKSkge1xuICAgIHAuZm9udFNpemUgPSB7dmFsdWU6IGUuZm9udCgnc2l6ZScpfTtcbiAgfVxuXG4gIC8vIGZpbGxcbiAgLy8gY29sb3Igc2hvdWxkIGJlIHNldCB0byBiYWNrZ3JvdW5kXG4gIHAuZmlsbCA9IHt2YWx1ZTogJ2JsYWNrJ307XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogZS52YWx1ZShBTFBIQSl9O1xuICB9IGVsc2Uge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogc3R5bGUub3BhY2l0eX07XG4gIH1cblxuICAvLyB0ZXh0XG4gIGlmIChlLmhhcyhURVhUKSkge1xuICAgIGlmIChlLmlzVHlwZShURVhULCBRKSkge1xuICAgICAgcC50ZXh0ID0ge3RlbXBsYXRlOiBcInt7XCIgKyBlLmZpZWxkKFRFWFQpICsgXCIgfCBudW1iZXI6Jy4zcyd9fVwifTtcbiAgICAgIHAuYWxpZ24gPSB7dmFsdWU6ICdyaWdodCd9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnRleHQgPSB7ZmllbGQ6IGUuZmllbGQoVEVYVCl9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwLnRleHQgPSB7dmFsdWU6ICdBYmMnfTtcbiAgfVxuXG4gIHAuZm9udCA9IHt2YWx1ZTogZS5mb250KCdmYW1pbHknKX07XG4gIHAuZm9udFdlaWdodCA9IHt2YWx1ZTogZS5mb250KCd3ZWlnaHQnKX07XG4gIHAuZm9udFN0eWxlID0ge3ZhbHVlOiBlLmZvbnQoJ3N0eWxlJyl9O1xuICBwLmJhc2VsaW5lID0ge3ZhbHVlOiBlLnRleHQoJ2Jhc2VsaW5lJyl9O1xuXG4gIHJldHVybiBwO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG52YXIgc2NhbGUgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5zY2FsZS5uYW1lcyA9IGZ1bmN0aW9uKHByb3BzKSB7XG4gIHJldHVybiB1dGlsLmtleXModXRpbC5rZXlzKHByb3BzKS5yZWR1Y2UoZnVuY3Rpb24oYSwgeCkge1xuICAgIGlmIChwcm9wc1t4XSAmJiBwcm9wc1t4XS5zY2FsZSkgYVtwcm9wc1t4XS5zY2FsZV0gPSAxO1xuICAgIHJldHVybiBhO1xuICB9LCB7fSkpO1xufTtcblxuc2NhbGUuZGVmcyA9IGZ1bmN0aW9uKG5hbWVzLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc29ydGluZywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcblxuICByZXR1cm4gbmFtZXMucmVkdWNlKGZ1bmN0aW9uKGEsIG5hbWUpIHtcbiAgICB2YXIgcyA9IHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB0eXBlOiBzY2FsZS50eXBlKG5hbWUsIGVuY29kaW5nKSxcbiAgICAgIGRvbWFpbjogc2NhbGVfZG9tYWluKG5hbWUsIGVuY29kaW5nLCBzb3J0aW5nLCBvcHQpXG4gICAgfTtcbiAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcgJiYgIWVuY29kaW5nLmJpbihuYW1lKSAmJiBlbmNvZGluZy5zb3J0KG5hbWUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcy5zb3J0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzY2FsZV9yYW5nZShzLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgb3B0KTtcblxuICAgIHJldHVybiAoYS5wdXNoKHMpLCBhKTtcbiAgfSwgW10pO1xufTtcblxuc2NhbGUudHlwZSA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nKSB7XG5cbiAgc3dpdGNoIChlbmNvZGluZy50eXBlKG5hbWUpKSB7XG4gICAgY2FzZSBPOiByZXR1cm4gJ29yZGluYWwnO1xuICAgIGNhc2UgVDpcbiAgICAgIHZhciBmbiA9IGVuY29kaW5nLmZuKG5hbWUpO1xuICAgICAgcmV0dXJuIChmbiAmJiB0aW1lLnNjYWxlLnR5cGUoZm4sIG5hbWUpKSB8fCAndGltZSc7XG4gICAgY2FzZSBROlxuICAgICAgaWYgKGVuY29kaW5nLmJpbihuYW1lKSkge1xuICAgICAgICByZXR1cm4gbmFtZSA9PT0gQ09MT1IgPyAnbGluZWFyJyA6ICdvcmRpbmFsJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbmNvZGluZy5zY2FsZShuYW1lKS50eXBlO1xuICB9XG59O1xuXG5mdW5jdGlvbiBzY2FsZV9kb21haW4obmFtZSwgZW5jb2RpbmcsIHNvcnRpbmcsIG9wdCkge1xuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpKSB7XG4gICAgdmFyIHJhbmdlID0gdGltZS5zY2FsZS5kb21haW4oZW5jb2RpbmcuZm4obmFtZSksIG5hbWUpO1xuICAgIGlmKHJhbmdlKSByZXR1cm4gcmFuZ2U7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuYmluKG5hbWUpKSB7XG4gICAgLy8gVE9ETzogYWRkIGluY2x1ZGVFbXB0eUNvbmZpZyBoZXJlXG4gICAgaWYgKG9wdC5zdGF0cykge1xuICAgICAgdmFyIGJpbnMgPSB1dGlsLmdldGJpbnMob3B0LnN0YXRzW2VuY29kaW5nLmZpZWxkTmFtZShuYW1lKV0sIGVuY29kaW5nLmJpbihuYW1lKS5tYXhiaW5zKTtcbiAgICAgIHZhciBkb21haW4gPSB1dGlsLnJhbmdlKGJpbnMuc3RhcnQsIGJpbnMuc3RvcCwgYmlucy5zdGVwKTtcbiAgICAgIHJldHVybiBuYW1lID09PSBZID8gZG9tYWluLnJldmVyc2UoKSA6IGRvbWFpbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSA9PSBvcHQuc3RhY2sgP1xuICAgIHtcbiAgICAgIGRhdGE6IFNUQUNLRUQsXG4gICAgICBmaWVsZDogJ2RhdGEuJyArIChvcHQuZmFjZXQgPyAnbWF4XycgOiAnJykgKyAnc3VtXycgKyBlbmNvZGluZy5maWVsZChuYW1lLCB0cnVlKVxuICAgIH0gOlxuICAgIHtkYXRhOiBzb3J0aW5nLmdldERhdGFzZXQobmFtZSksIGZpZWxkOiBlbmNvZGluZy5maWVsZChuYW1lKX07XG59XG5cbmZ1bmN0aW9uIHNjYWxlX3JhbmdlKHMsIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlLCBvcHQpIHtcbiAgdmFyIHNwZWMgPSBlbmNvZGluZy5zY2FsZShzLm5hbWUpO1xuICBzd2l0Y2ggKHMubmFtZSkge1xuICAgIGNhc2UgWDpcbiAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICBzLmJhbmRXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzLnJhbmdlID0gbGF5b3V0LmNlbGxXaWR0aCA/IFswLCBsYXlvdXQuY2VsbFdpZHRoXSA6ICd3aWR0aCc7XG5cbiAgICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsVCkgJiYgZW5jb2RpbmcuZm4ocy5uYW1lKSA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvID09PSB1bmRlZmluZWQgPyB0cnVlIDogc3BlYy56ZXJvO1xuICAgICAgICB9XG5cbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBpZiAocy50eXBlID09PSAndGltZScpIHtcbiAgICAgICAgcy5uaWNlID0gZW5jb2RpbmcuZm4ocy5uYW1lKTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgcy5uaWNlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgWTpcbiAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICBzLmJhbmRXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzLnJhbmdlID0gbGF5b3V0LmNlbGxIZWlnaHQgPyBbbGF5b3V0LmNlbGxIZWlnaHQsIDBdIDogJ2hlaWdodCc7XG5cbiAgICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsVCkgJiYgZW5jb2RpbmcuZm4ocy5uYW1lKSA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvID09PSB1bmRlZmluZWQgPyB0cnVlIDogc3BlYy56ZXJvO1xuICAgICAgICB9XG5cbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlO1xuICAgICAgfVxuXG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcblxuICAgICAgaWYgKHMudHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICAgIHMubmljZSA9IGVuY29kaW5nLmZuKHMubmFtZSkgfHwgZW5jb2RpbmcuY29uZmlnKCd0aW1lU2NhbGVOaWNlJyk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFJPVzogLy8gc3VwcG9ydCBvbmx5IG9yZGluYWxcbiAgICAgIHMuYmFuZFdpZHRoID0gbGF5b3V0LmNlbGxIZWlnaHQ7XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIENPTDogLy8gc3VwcG9ydCBvbmx5IG9yZGluYWxcbiAgICAgIHMuYmFuZFdpZHRoID0gbGF5b3V0LmNlbGxXaWR0aDtcbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgcy5uaWNlID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU0laRTpcbiAgICAgIGlmIChlbmNvZGluZy5pcygnYmFyJykpIHtcbiAgICAgICAgLy8gRklYTUUgdGhpcyBpcyBkZWZpbml0ZWx5IGluY29ycmVjdFxuICAgICAgICAvLyBidXQgbGV0J3MgZml4IGl0IGxhdGVyIHNpbmNlIGJhciBzaXplIGlzIGEgYmFkIGVuY29kaW5nIGFueXdheVxuICAgICAgICBzLnJhbmdlID0gWzMsIE1hdGgubWF4KGVuY29kaW5nLmJhbmRTaXplKFgpLCBlbmNvZGluZy5iYW5kU2l6ZShZKSldO1xuICAgICAgfSBlbHNlIGlmIChlbmNvZGluZy5pcyhURVhUKSkge1xuICAgICAgICBzLnJhbmdlID0gWzgsIDQwXTtcbiAgICAgIH0gZWxzZSB7IC8vcG9pbnRcbiAgICAgICAgdmFyIGJhbmRTaXplID0gTWF0aC5taW4oZW5jb2RpbmcuYmFuZFNpemUoWCksIGVuY29kaW5nLmJhbmRTaXplKFkpKSAtIDE7XG4gICAgICAgIHMucmFuZ2UgPSBbMTAsIDAuOCAqIGJhbmRTaXplKmJhbmRTaXplXTtcbiAgICAgIH1cbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNIQVBFOlxuICAgICAgcy5yYW5nZSA9ICdzaGFwZXMnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDT0xPUjpcbiAgICAgIHZhciByYW5nZSA9IGVuY29kaW5nLnNjYWxlKENPTE9SKS5yYW5nZTtcbiAgICAgIGlmIChyYW5nZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICAgIC8vIEZJWE1FXG4gICAgICAgICAgcmFuZ2UgPSBzdHlsZS5jb2xvclJhbmdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJhbmdlID0gWycjQTlEQjlGJywgJyMwRDVDMjEnXTtcbiAgICAgICAgICBzLnplcm8gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcy5yYW5nZSA9IHJhbmdlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBBTFBIQTpcbiAgICAgIHMucmFuZ2UgPSBbMC4yLCAxLjBdO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZyBuYW1lOiAnKyBzLm5hbWUpO1xuICB9XG5cbiAgc3dpdGNoIChzLm5hbWUpIHtcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTDpcbiAgICAgIHMucGFkZGluZyA9IGVuY29kaW5nLmNvbmZpZygnY2VsbFBhZGRpbmcnKTtcbiAgICAgIHMub3V0ZXJQYWRkaW5nID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgWDpcbiAgICBjYXNlIFk6XG4gICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHsgLy8mJiAhcy5iYW5kV2lkdGhcbiAgICAgICAgcy5wb2ludHMgPSB0cnVlO1xuICAgICAgICBzLnBhZGRpbmcgPSBlbmNvZGluZy5iYW5kKHMubmFtZSkucGFkZGluZztcbiAgICAgIH1cbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhZGRTb3J0VHJhbnNmb3JtcztcblxuLy8gYWRkcyBuZXcgdHJhbnNmb3JtcyB0aGF0IHByb2R1Y2Ugc29ydGVkIGZpZWxkc1xuZnVuY3Rpb24gYWRkU29ydFRyYW5zZm9ybXMoc3BlYywgZW5jb2RpbmcsIHN0YXRzLCBvcHQpIHtcbiAgdmFyIGRhdGFzZXRNYXBwaW5nID0ge307XG4gIHZhciBjb3VudGVyID0gMDtcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgdmFyIHNvcnRCeSA9IGVuY29kaW5nLnNvcnQoZW5jVHlwZSwgc3RhdHMpO1xuICAgIGlmIChzb3J0QnkubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGZpZWxkcyA9IHNvcnRCeS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG9wOiBkLmFnZ3IsXG4gICAgICAgICAgZmllbGQ6ICdkYXRhLicgKyBkLm5hbWVcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgYnlDbGF1c2UgPSBzb3J0QnkubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgdmFyIHJldmVyc2UgPSAoZC5yZXZlcnNlID8gJy0nIDogJycpO1xuICAgICAgICByZXR1cm4gcmV2ZXJzZSArICdkYXRhLicgKyAoZC5hZ2dyPT09J2NvdW50JyA/ICdjb3VudCcgOiAoZC5hZ2dyICsgJ18nICsgZC5uYW1lKSk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIGRhdGFOYW1lID0gJ3NvcnRlZCcgKyBjb3VudGVyKys7XG5cbiAgICAgIHZhciB0cmFuc2Zvcm1zID0gW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogWydkYXRhLicgKyBmaWVsZC5uYW1lXSxcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ3NvcnQnLFxuICAgICAgICAgIGJ5OiBieUNsYXVzZVxuICAgICAgICB9XG4gICAgICBdO1xuXG4gICAgICBzcGVjLmRhdGEucHVzaCh7XG4gICAgICAgIG5hbWU6IGRhdGFOYW1lLFxuICAgICAgICBzb3VyY2U6IFJBVyxcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1zXG4gICAgICB9KTtcblxuICAgICAgZGF0YXNldE1hcHBpbmdbZW5jVHlwZV0gPSBkYXRhTmFtZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3BlYzogc3BlYyxcbiAgICBnZXREYXRhc2V0OiBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgICB2YXIgZGF0YSA9IGRhdGFzZXRNYXBwaW5nW2VuY1R5cGVdO1xuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIHJldHVybiBUQUJMRTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgbWFya3MgPSByZXF1aXJlKCcuL21hcmtzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tpbmc7XG5cbmZ1bmN0aW9uIHN0YWNraW5nKHNwZWMsIGVuY29kaW5nLCBtZGVmLCBmYWNldHMpIHtcbiAgaWYgKCFtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXS5zdGFjaykgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFRPRE86IGFkZCB8fCBlbmNvZGluZy5oYXMoTE9EKSBoZXJlIG9uY2UgTE9EIGlzIGltcGxlbWVudGVkXG4gIGlmICghZW5jb2RpbmcuaGFzKENPTE9SKSkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBkaW09bnVsbCwgdmFsPW51bGwsIGlkeCA9bnVsbCxcbiAgICBpc1hNZWFzdXJlID0gZW5jb2RpbmcuaXNNZWFzdXJlKFgpLFxuICAgIGlzWU1lYXN1cmUgPSBlbmNvZGluZy5pc01lYXN1cmUoWSk7XG5cbiAgaWYgKGlzWE1lYXN1cmUgJiYgIWlzWU1lYXN1cmUpIHtcbiAgICBkaW0gPSBZO1xuICAgIHZhbCA9IFg7XG4gICAgaWR4ID0gMDtcbiAgfSBlbHNlIGlmIChpc1lNZWFzdXJlICYmICFpc1hNZWFzdXJlKSB7XG4gICAgZGltID0gWDtcbiAgICB2YWwgPSBZO1xuICAgIGlkeCA9IDE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7IC8vIG5vIHN0YWNrIGVuY29kaW5nXG4gIH1cblxuICAvLyBhZGQgdHJhbnNmb3JtIHRvIGNvbXB1dGUgc3VtcyBmb3Igc2NhbGVcbiAgdmFyIHN0YWNrZWQgPSB7XG4gICAgbmFtZTogU1RBQ0tFRCxcbiAgICBzb3VyY2U6IFRBQkxFLFxuICAgIHRyYW5zZm9ybTogW3tcbiAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgZ3JvdXBieTogW2VuY29kaW5nLmZpZWxkKGRpbSldLmNvbmNhdChmYWNldHMpLCAvLyBkaW0gYW5kIG90aGVyIGZhY2V0c1xuICAgICAgZmllbGRzOiBbe29wOiAnc3VtJywgZmllbGQ6IGVuY29kaW5nLmZpZWxkKHZhbCl9XSAvLyBUT0RPIGNoZWNrIGlmIGZpZWxkIHdpdGggYWdnciBpcyBjb3JyZWN0P1xuICAgIH1dXG4gIH07XG5cbiAgaWYgKGZhY2V0cyAmJiBmYWNldHMubGVuZ3RoID4gMCkge1xuICAgIHN0YWNrZWQudHJhbnNmb3JtLnB1c2goeyAvL2NhbGN1bGF0ZSBtYXggZm9yIGVhY2ggZmFjZXRcbiAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgZ3JvdXBieTogZmFjZXRzLFxuICAgICAgZmllbGRzOiBbe29wOiAnbWF4JywgZmllbGQ6ICdkYXRhLnN1bV8nICsgZW5jb2RpbmcuZmllbGQodmFsLCB0cnVlKX1dXG4gICAgfSk7XG4gIH1cblxuICBzcGVjLmRhdGEucHVzaChzdGFja2VkKTtcblxuICAvLyBhZGQgc3RhY2sgdHJhbnNmb3JtIHRvIG1hcmtcbiAgbWRlZi5mcm9tLnRyYW5zZm9ybSA9IFt7XG4gICAgdHlwZTogJ3N0YWNrJyxcbiAgICBwb2ludDogZW5jb2RpbmcuZmllbGQoZGltKSxcbiAgICBoZWlnaHQ6IGVuY29kaW5nLmZpZWxkKHZhbCksXG4gICAgb3V0cHV0OiB7eTE6IHZhbCwgeTA6IHZhbCArICcyJ31cbiAgfV07XG5cbiAgLy8gVE9ETzogVGhpcyBpcyBzdXBlciBoYWNrLWlzaCAtLSBjb25zb2xpZGF0ZSBpbnRvIG1vZHVsYXIgbWFyayBwcm9wZXJ0aWVzP1xuICBtZGVmLnByb3BlcnRpZXMudXBkYXRlW3ZhbF0gPSBtZGVmLnByb3BlcnRpZXMuZW50ZXJbdmFsXSA9IHtzY2FsZTogdmFsLCBmaWVsZDogdmFsfTtcbiAgbWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZVt2YWwgKyAnMiddID0gbWRlZi5wcm9wZXJ0aWVzLmVudGVyW3ZhbCArICcyJ10gPSB7c2NhbGU6IHZhbCwgZmllbGQ6IHZhbCArICcyJ307XG5cbiAgcmV0dXJuIHZhbDsgLy9yZXR1cm4gc3RhY2sgZW5jb2Rpbmdcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHZsZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpLFxuICBFbmNvZGluZyA9IHJlcXVpcmUoJy4uL0VuY29kaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHJldHVybiB7XG4gICAgb3BhY2l0eTogZXN0aW1hdGVPcGFjaXR5KGVuY29kaW5nLCBzdGF0cyksXG4gICAgY29sb3JSYW5nZTogY29sb3JSYW5nZShlbmNvZGluZywgc3RhdHMpXG4gIH07XG59O1xuXG5mdW5jdGlvbiBjb2xvclJhbmdlKGVuY29kaW5nLCBzdGF0cyl7XG4gIGlmIChlbmNvZGluZy5oYXMoQ09MT1IpICYmIGVuY29kaW5nLmlzRGltZW5zaW9uKENPTE9SKSkge1xuICAgIHZhciBjYXJkaW5hbGl0eSA9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTE9SLCBzdGF0cyk7XG4gICAgaWYgKGNhcmRpbmFsaXR5IDw9IDEwKSB7XG4gICAgICByZXR1cm4gXCJjYXRlZ29yeTEwXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcImNhdGVnb3J5MjBcIjtcbiAgICB9XG4gICAgLy8gVE9ETyBjYW4gdmVnYSBpbnRlcnBvbGF0ZSByYW5nZSBmb3Igb3JkaW5hbCBzY2FsZT9cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZXN0aW1hdGVPcGFjaXR5KGVuY29kaW5nLHN0YXRzKSB7XG4gIGlmICghc3RhdHMpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHZhciBudW1Qb2ludHMgPSAwO1xuXG4gIGlmIChlbmNvZGluZy5pc0FnZ3JlZ2F0ZSgpKSB7IC8vIGFnZ3JlZ2F0ZSBwbG90XG4gICAgbnVtUG9pbnRzID0gMTtcblxuICAgIC8vICBnZXQgbnVtYmVyIG9mIHBvaW50cyBpbiBlYWNoIFwiY2VsbFwiXG4gICAgLy8gIGJ5IGNhbGN1bGF0aW5nIHByb2R1Y3Qgb2YgY2FyZGluYWxpdHlcbiAgICAvLyAgZm9yIGVhY2ggbm9uIGZhY2V0aW5nIGFuZCBub24tb3JkaW5hbCBYIC8gWSBmaWVsZHNcbiAgICAvLyAgbm90ZSB0aGF0IG9yZGluYWwgeCx5IGFyZSBub3QgaW5jbHVkZSBzaW5jZSB3ZSBjYW5cbiAgICAvLyAgY29uc2lkZXIgdGhhdCBvcmRpbmFsIHggYXJlIHN1YmRpdmlkaW5nIHRoZSBjZWxsIGludG8gc3ViY2VsbHMgYW55d2F5XG4gICAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuXG4gICAgICBpZiAoZW5jVHlwZSAhPT0gUk9XICYmIGVuY1R5cGUgIT09IENPTCAmJlxuICAgICAgICAgICEoKGVuY1R5cGUgPT09IFggfHwgZW5jVHlwZSA9PT0gWSkgJiZcbiAgICAgICAgICB2bGZpZWxkLmlzT3JkaW5hbFNjYWxlKGZpZWxkLCB0cnVlKSlcbiAgICAgICAgKSB7XG4gICAgICAgIG51bVBvaW50cyAqPSBlbmNvZGluZy5jYXJkaW5hbGl0eShlbmNUeXBlLCBzdGF0cyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSBlbHNlIHsgLy8gcmF3IHBsb3RcbiAgICBudW1Qb2ludHMgPSBzdGF0cy5jb3VudDtcblxuICAgIC8vIHNtYWxsIG11bHRpcGxlcyBkaXZpZGUgbnVtYmVyIG9mIHBvaW50c1xuICAgIHZhciBudW1NdWx0aXBsZXMgPSAxO1xuICAgIGlmIChlbmNvZGluZy5oYXMoUk9XKSkge1xuICAgICAgbnVtTXVsdGlwbGVzICo9IGVuY29kaW5nLmNhcmRpbmFsaXR5KFJPVywgc3RhdHMpO1xuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcuaGFzKENPTCkpIHtcbiAgICAgIG51bU11bHRpcGxlcyAqPSBlbmNvZGluZy5jYXJkaW5hbGl0eShDT0wsIHN0YXRzKTtcbiAgICB9XG4gICAgbnVtUG9pbnRzIC89IG51bU11bHRpcGxlcztcbiAgfVxuXG4gIHZhciBvcGFjaXR5ID0gMDtcbiAgaWYgKG51bVBvaW50cyA8IDIwKSB7XG4gICAgb3BhY2l0eSA9IDE7XG4gIH0gZWxzZSBpZiAobnVtUG9pbnRzIDwgMjAwKSB7XG4gICAgb3BhY2l0eSA9IDAuNztcbiAgfSBlbHNlIGlmIChudW1Qb2ludHMgPCAxMDAwIHx8IGVuY29kaW5nLmlzKCd0aWNrJykpIHtcbiAgICBvcGFjaXR5ID0gMC42O1xuICB9IGVsc2Uge1xuICAgIG9wYWNpdHkgPSAwLjM7XG4gIH1cblxuICByZXR1cm4gb3BhY2l0eTtcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgZ3JvdXBkZWYgPSByZXF1aXJlKCcuL2dyb3VwJykuZGVmO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN1YmZhY2V0aW5nO1xuXG5mdW5jdGlvbiBzdWJmYWNldGluZyhncm91cCwgbWRlZiwgZGV0YWlscywgc3RhY2ssIGVuY29kaW5nKSB7XG4gIHZhciBtID0gZ3JvdXAubWFya3MsXG4gICAgZyA9IGdyb3VwZGVmKCdzdWJmYWNldCcsIHttYXJrczogbX0pO1xuXG4gIGdyb3VwLm1hcmtzID0gW2ddO1xuICBnLmZyb20gPSBtZGVmLmZyb207XG4gIGRlbGV0ZSBtZGVmLmZyb207XG5cbiAgLy9UT0RPIHRlc3QgTE9EIC0tIHdlIHNob3VsZCBzdXBwb3J0IHN0YWNrIC8gbGluZSB3aXRob3V0IGNvbG9yIChMT0QpIGZpZWxkXG4gIHZhciB0cmFucyA9IChnLmZyb20udHJhbnNmb3JtIHx8IChnLmZyb20udHJhbnNmb3JtID0gW10pKTtcbiAgdHJhbnMudW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogZGV0YWlsc30pO1xuXG4gIGlmIChzdGFjayAmJiBlbmNvZGluZy5oYXMoQ09MT1IpKSB7XG4gICAgdHJhbnMudW5zaGlmdCh7dHlwZTogJ3NvcnQnLCBieTogZW5jb2RpbmcuZmllbGQoQ09MT1IpfSk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciBncm91cGRlZiA9IHJlcXVpcmUoJy4vZ3JvdXAnKS5kZWYsXG4gIHZsZGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuZnVuY3Rpb24gdGVtcGxhdGUoZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpIHsgLy9oYWNrIHVzZSBzdGF0c1xuXG4gIHZhciBkYXRhID0ge25hbWU6IFJBVywgZm9ybWF0OiB7dHlwZTogZW5jb2RpbmcuZGF0YSgnZm9ybWF0VHlwZScpfX0sXG4gICAgdGFibGUgPSB7bmFtZTogVEFCTEUsIHNvdXJjZTogUkFXfSxcbiAgICBkYXRhVXJsID0gdmxkYXRhLmdldFVybChlbmNvZGluZywgc3RhdHMpO1xuICBpZiAoZGF0YVVybCkgZGF0YS51cmwgPSBkYXRhVXJsO1xuXG4gIHZhciBwcmVhZ2dyZWdhdGVkRGF0YSA9ICEhZW5jb2RpbmcuZGF0YSgndmVnYVNlcnZlcicpO1xuXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICB2YXIgbmFtZTtcbiAgICBpZiAoZmllbGQudHlwZSA9PSBUKSB7XG4gICAgICBkYXRhLmZvcm1hdC5wYXJzZSA9IGRhdGEuZm9ybWF0LnBhcnNlIHx8IHt9O1xuICAgICAgZGF0YS5mb3JtYXQucGFyc2VbZmllbGQubmFtZV0gPSAnZGF0ZSc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09IFEpIHtcbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlID0gZGF0YS5mb3JtYXQucGFyc2UgfHwge307XG4gICAgICBpZiAoZmllbGQuYWdnciA9PT0gJ2NvdW50Jykge1xuICAgICAgICBuYW1lID0gJ2NvdW50JztcbiAgICAgIH0gZWxzZSBpZiAocHJlYWdncmVnYXRlZERhdGEgJiYgZmllbGQuYmluKSB7XG4gICAgICAgIG5hbWUgPSAnYmluXycgKyBmaWVsZC5uYW1lO1xuICAgICAgfSBlbHNlIGlmIChwcmVhZ2dyZWdhdGVkRGF0YSAmJiBmaWVsZC5hZ2dyKSB7XG4gICAgICAgIG5hbWUgPSBmaWVsZC5hZ2dyICsgJ18nICsgZmllbGQubmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgPSBmaWVsZC5uYW1lO1xuICAgICAgfVxuICAgICAgZGF0YS5mb3JtYXQucGFyc2VbbmFtZV0gPSAnbnVtYmVyJztcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGxheW91dC53aWR0aCxcbiAgICBoZWlnaHQ6IGxheW91dC5oZWlnaHQsXG4gICAgcGFkZGluZzogJ2F1dG8nLFxuICAgIGRhdGE6IFtkYXRhLCB0YWJsZV0sXG4gICAgbWFya3M6IFtncm91cGRlZignY2VsbCcsIHtcbiAgICAgIHdpZHRoOiBsYXlvdXQuY2VsbFdpZHRoID8ge3ZhbHVlOiBsYXlvdXQuY2VsbFdpZHRofSA6IHVuZGVmaW5lZCxcbiAgICAgIGhlaWdodDogbGF5b3V0LmNlbGxIZWlnaHQgPyB7dmFsdWU6IGxheW91dC5jZWxsSGVpZ2h0fSA6IHVuZGVmaW5lZFxuICAgIH0pXVxuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aW1lO1xuXG5mdW5jdGlvbiB0aW1lKHNwZWMsIGVuY29kaW5nLCBvcHQpIHtcbiAgdmFyIHRpbWVGaWVsZHMgPSB7fSwgdGltZUZuID0ge307XG5cbiAgLy8gZmluZCB1bmlxdWUgZm9ybXVsYSB0cmFuc2Zvcm1hdGlvbiBhbmQgYmluIGZ1bmN0aW9uXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gVCAmJiBmaWVsZC5mbikge1xuICAgICAgdGltZUZpZWxkc1tlbmNvZGluZy5maWVsZChlbmNUeXBlKV0gPSB7XG4gICAgICAgIGZpZWxkOiBmaWVsZCxcbiAgICAgICAgZW5jVHlwZTogZW5jVHlwZVxuICAgICAgfTtcbiAgICAgIHRpbWVGbltmaWVsZC5mbl0gPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gYWRkIGZvcm11bGEgdHJhbnNmb3JtXG4gIHZhciBkYXRhID0gc3BlYy5kYXRhWzFdLFxuICAgIHRyYW5zZm9ybSA9IGRhdGEudHJhbnNmb3JtID0gZGF0YS50cmFuc2Zvcm0gfHwgW107XG5cbiAgZm9yICh2YXIgZiBpbiB0aW1lRmllbGRzKSB7XG4gICAgdmFyIHRmID0gdGltZUZpZWxkc1tmXTtcbiAgICB0aW1lLnRyYW5zZm9ybSh0cmFuc2Zvcm0sIGVuY29kaW5nLCB0Zi5lbmNUeXBlLCB0Zi5maWVsZCk7XG4gIH1cblxuICAvLyBhZGQgc2NhbGVzXG4gIHZhciBzY2FsZXMgPSBzcGVjLnNjYWxlcyA9IHNwZWMuc2NhbGVzIHx8IFtdO1xuICBmb3IgKHZhciBmbiBpbiB0aW1lRm4pIHtcbiAgICB0aW1lLnNjYWxlKHNjYWxlcywgZm4sIGVuY29kaW5nKTtcbiAgfVxuICByZXR1cm4gc3BlYztcbn1cblxudGltZS5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSkge1xuICB2YXIgZm4gPSBmaWVsZC5mbjtcbiAgc3dpdGNoIChmbikge1xuICAgIGNhc2UgJ3NlY29uZHMnOiByZXR1cm4gNjA7XG4gICAgY2FzZSAnbWludXRlcyc6IHJldHVybiA2MDtcbiAgICBjYXNlICdob3Vycyc6IHJldHVybiAyNDtcbiAgICBjYXNlICdkYXknOiByZXR1cm4gNztcbiAgICBjYXNlICdkYXRlJzogcmV0dXJuIDMxO1xuICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIDEyO1xuICAgIGNhc2UgJ3llYXInOlxuICAgICAgdmFyIHN0YXQgPSBzdGF0c1tmaWVsZC5uYW1lXSxcbiAgICAgICAgeWVhcnN0YXQgPSBzdGF0c1sneWVhcl8nK2ZpZWxkLm5hbWVdO1xuXG4gICAgICBpZiAoIXllYXJzdGF0KSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAgIHJldHVybiB5ZWFyc3RhdC5kaXN0aW5jdCAtXG4gICAgICAgIChzdGF0Lm51bGxzID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5mdW5jdGlvbiBmaWVsZEZuKGZ1bmMsIGZpZWxkKSB7XG4gIHJldHVybiAndXRjJyArIGZ1bmMgKyAnKGQuZGF0YS4nKyBmaWVsZC5uYW1lICsnKSc7XG59XG5cbi8qKlxuICogQHJldHVybiB7U3RyaW5nfSBkYXRlIGJpbm5pbmcgZm9ybXVsYSBvZiB0aGUgZ2l2ZW4gZmllbGRcbiAqL1xudGltZS5mb3JtdWxhID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGZpZWxkRm4oZmllbGQuZm4sIGZpZWxkKTtcbn07XG5cbi8qKiBhZGQgZm9ybXVsYSB0cmFuc2Zvcm1zIHRvIGRhdGEgKi9cbnRpbWUudHJhbnNmb3JtID0gZnVuY3Rpb24odHJhbnNmb3JtLCBlbmNvZGluZywgZW5jVHlwZSwgZmllbGQpIHtcbiAgdHJhbnNmb3JtLnB1c2goe1xuICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICBmaWVsZDogZW5jb2RpbmcuZmllbGQoZW5jVHlwZSksXG4gICAgZXhwcjogdGltZS5mb3JtdWxhKGZpZWxkKVxuICB9KTtcbn07XG5cbi8qKiBhcHBlbmQgY3VzdG9tIHRpbWUgc2NhbGVzIGZvciBheGlzIGxhYmVsICovXG50aW1lLnNjYWxlID0gZnVuY3Rpb24oc2NhbGVzLCBmbiwgZW5jb2RpbmcpIHtcbiAgdmFyIGxhYmVsTGVuZ3RoID0gZW5jb2RpbmcuY29uZmlnKCd0aW1lU2NhbGVMYWJlbExlbmd0aCcpO1xuICAvLyBUT0RPIGFkZCBvcHRpb24gZm9yIHNob3J0ZXIgc2NhbGUgLyBjdXN0b20gcmFuZ2VcbiAgc3dpdGNoIChmbikge1xuICAgIGNhc2UgJ2RheSc6XG4gICAgICBzY2FsZXMucHVzaCh7XG4gICAgICAgIG5hbWU6ICd0aW1lLScrZm4sXG4gICAgICAgIHR5cGU6ICdvcmRpbmFsJyxcbiAgICAgICAgZG9tYWluOiB1dGlsLnJhbmdlKDAsIDcpLFxuICAgICAgICByYW5nZTogWydNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5JywgJ1N1bmRheSddLm1hcChcbiAgICAgICAgICBmdW5jdGlvbihzKSB7IHJldHVybiBzLnN1YnN0cigwLCBsYWJlbExlbmd0aCk7fVxuICAgICAgICApXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHNjYWxlcy5wdXNoKHtcbiAgICAgICAgbmFtZTogJ3RpbWUtJytmbixcbiAgICAgICAgdHlwZTogJ29yZGluYWwnLFxuICAgICAgICBkb21haW46IHV0aWwucmFuZ2UoMCwgMTIpLFxuICAgICAgICByYW5nZTogWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ10ubWFwKFxuICAgICAgICAgICAgZnVuY3Rpb24ocykgeyByZXR1cm4gcy5zdWJzdHIoMCwgbGFiZWxMZW5ndGgpO31cbiAgICAgICAgICApXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG50aW1lLmlzT3JkaW5hbEZuID0gZnVuY3Rpb24oZm4pIHtcbiAgc3dpdGNoIChmbikge1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2RhdGUnOlxuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnRpbWUuc2NhbGUudHlwZSA9IGZ1bmN0aW9uKGZuLCBuYW1lKSB7XG4gIGlmIChuYW1lID09PSBDT0xPUikge1xuICAgIHJldHVybiAnbGluZWFyJzsgLy8gdGhpcyBoYXMgb3JkZXJcbiAgfVxuXG4gIHJldHVybiB0aW1lLmlzT3JkaW5hbEZuKGZuKSB8fCBuYW1lID09PSBDT0wgfHwgbmFtZSA9PT0gUk9XID8gJ29yZGluYWwnIDogJ2xpbmVhcic7XG59O1xuXG50aW1lLnNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKGZuLCBuYW1lKSB7XG4gIHZhciBpc0NvbG9yID0gbmFtZSA9PT0gQ09MT1I7XG4gIHN3aXRjaCAoZm4pIHtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdtaW51dGVzJzogcmV0dXJuIGlzQ29sb3IgPyBbMCw1OV0gOiB1dGlsLnJhbmdlKDAsIDYwKTtcbiAgICBjYXNlICdob3Vycyc6IHJldHVybiBpc0NvbG9yID8gWzAsMjNdIDogdXRpbC5yYW5nZSgwLCAyNCk7XG4gICAgY2FzZSAnZGF5JzogcmV0dXJuIGlzQ29sb3IgPyBbMCw2XSA6IHV0aWwucmFuZ2UoMCwgNyk7XG4gICAgY2FzZSAnZGF0ZSc6IHJldHVybiBpc0NvbG9yID8gWzEsMzFdIDogdXRpbC5yYW5nZSgxLCAzMik7XG4gICAgY2FzZSAnbW9udGgnOiByZXR1cm4gaXNDb2xvciA/IFswLDExXSA6IHV0aWwucmFuZ2UoMCwgMTIpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqIHdoZXRoZXIgYSBwYXJ0aWN1bGFyIHRpbWUgZnVuY3Rpb24gaGFzIGN1c3RvbSBzY2FsZSBmb3IgbGFiZWxzIGltcGxlbWVudGVkIGluIHRpbWUuc2NhbGUgKi9cbnRpbWUuaGFzU2NhbGUgPSBmdW5jdGlvbihmbikge1xuICBzd2l0Y2ggKGZuKSB7XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdtb250aCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKTtcblxudmFyIGNvbnN0cyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmNvbnN0cy5lbmNvZGluZ1R5cGVzID0gW1gsIFksIFJPVywgQ09MLCBTSVpFLCBTSEFQRSwgQ09MT1IsIEFMUEhBLCBURVhULCBERVRBSUxdO1xuXG5jb25zdHMuZGF0YVR5cGVzID0geydPJzogTywgJ1EnOiBRLCAnVCc6IFR9O1xuXG5jb25zdHMuZGF0YVR5cGVOYW1lcyA9IFsnTycsICdRJywgJ1QnXS5yZWR1Y2UoZnVuY3Rpb24ociwgeCkge1xuICByW2NvbnN0cy5kYXRhVHlwZXNbeF1dID0geDtcbiAgcmV0dXJuIHI7XG59LHt9KTtcblxuY29uc3RzLnNob3J0aGFuZCA9IHtcbiAgZGVsaW06ICAnfCcsXG4gIGFzc2lnbjogJz0nLFxuICB0eXBlOiAgICcsJyxcbiAgZnVuYzogICAnXydcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkbCA9IHJlcXVpcmUoJ2RhdGFsaWInKTtcblxudmFyIHZsZGF0YSA9IG1vZHVsZS5leHBvcnRzID0ge30sXG4gIHZsZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmxkYXRhLmdldFVybCA9IGZ1bmN0aW9uIGdldERhdGFVcmwoZW5jb2RpbmcsIHN0YXRzKSB7XG4gIGlmICghZW5jb2RpbmcuZGF0YSgndmVnYVNlcnZlcicpKSB7XG4gICAgLy8gZG9uJ3QgdXNlIHZlZ2Egc2VydmVyXG4gICAgcmV0dXJuIGVuY29kaW5nLmRhdGEoJ3VybCcpO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmxlbmd0aCgpID09PSAwKSB7XG4gICAgLy8gbm8gZmllbGRzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGZpZWxkcyA9IFtdO1xuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIG5hbWU6IGVuY29kaW5nLmZpZWxkKGVuY1R5cGUsIHRydWUpLFxuICAgICAgZmllbGQ6IGZpZWxkLm5hbWVcbiAgICB9O1xuICAgIGlmIChmaWVsZC5hZ2dyKSB7XG4gICAgICBvYmouYWdnciA9IGZpZWxkLmFnZ3I7XG4gICAgfVxuICAgIGlmIChmaWVsZC5iaW4pIHtcbiAgICAgIG9iai5iaW5TaXplID0gdXRpbC5nZXRiaW5zKHN0YXRzW2ZpZWxkLm5hbWVdLCBlbmNvZGluZy5iaW4oZW5jVHlwZSkubWF4Ymlucykuc3RlcDtcbiAgICB9XG4gICAgZmllbGRzLnB1c2gob2JqKTtcbiAgfSk7XG5cbiAgdmFyIHF1ZXJ5ID0ge1xuICAgIHRhYmxlOiBlbmNvZGluZy5kYXRhKCd2ZWdhU2VydmVyJykudGFibGUsXG4gICAgZmllbGRzOiBmaWVsZHNcbiAgfTtcblxuICByZXR1cm4gZW5jb2RpbmcuZGF0YSgndmVnYVNlcnZlcicpLnVybCArICcvcXVlcnkvP3E9JyArIEpTT04uc3RyaW5naWZ5KHF1ZXJ5KTtcbn07XG5cbi8qKiBNYXBwaW5nIGZyb20gZGF0YWxpYidzIGluZmVycmVkIHR5cGUgdG8gdmVnYWxpdGUncyB0eXBlICovXG52bGRhdGEudHlwZXMgPSB7XG4gICdib29sZWFuJzogJ08nLFxuICAnbnVtYmVyJzogJ1EnLFxuICAnaW50ZWdlcic6ICdRJyxcbiAgJ2RhdGUnOiAnVCcsXG4gICdzdHJpbmcnOiAnTydcbn07XG5cbnZsZGF0YS5nZXRTdGF0cyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgdmFyIHN0YXRzID0ge30sXG4gICAgZmllbGRzID0gdXRpbC5rZXlzKGRhdGFbMF0pO1xuXG4gIGZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICB2YXIgc3RhdCA9IGRsLnByb2ZpbGUoZGF0YSwgZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuIGRba107XG4gICAgfSk7XG5cbiAgICB2YXIgc2FtcGxlID0ge307XG4gICAgd2hpbGUoT2JqZWN0LmtleXMoc2FtcGxlKS5sZW5ndGggPCBNYXRoLm1pbihzdGF0LmRpc3RpbmN0LCAxMCkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGRhdGFbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZGF0YS5sZW5ndGgpXVtrXTtcbiAgICAgIHNhbXBsZVt2YWx1ZV0gPSB0cnVlO1xuICAgIH1cbiAgICBzdGF0LnNhbXBsZSA9IE9iamVjdC5rZXlzKHNhbXBsZSk7XG5cbiAgICBzdGF0c1trXSA9IHN0YXQ7XG4gIH0pO1xuXG4gIHN0YXRzLmNvdW50ID0gZGF0YS5sZW5ndGg7XG4gIHJldHVybiBzdGF0cztcbn07XG4iLCIvLyB1dGlsaXR5IGZvciBlbmNcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gIHRpbWUgPSByZXF1aXJlKCcuL2NvbXBpbGUvdGltZScpLFxuICB2bGZpZWxkID0gcmVxdWlyZSgnLi9maWVsZCcpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpLFxuICBlbmNUeXBlcyA9IHNjaGVtYS5lbmNUeXBlcztcblxudmFyIHZsZW5jID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmxlbmMuY291bnRSZXRpbmFsID0gZnVuY3Rpb24oZW5jKSB7XG4gIHZhciBjb3VudCA9IDA7XG4gIGlmIChlbmMuY29sb3IpIGNvdW50Kys7XG4gIGlmIChlbmMuYWxwaGEpIGNvdW50Kys7XG4gIGlmIChlbmMuc2l6ZSkgY291bnQrKztcbiAgaWYgKGVuYy5zaGFwZSkgY291bnQrKztcbiAgcmV0dXJuIGNvdW50O1xufTtcblxudmxlbmMuaGFzID0gZnVuY3Rpb24oZW5jLCBlbmNUeXBlKSB7XG4gIHZhciBmaWVsZERlZiA9IGVuYyAmJiBlbmNbZW5jVHlwZV07XG4gIHJldHVybiBmaWVsZERlZiAmJiBmaWVsZERlZi5uYW1lO1xufTtcblxudmxlbmMuaXNBZ2dyZWdhdGUgPSBmdW5jdGlvbihlbmMpIHtcbiAgZm9yICh2YXIgayBpbiBlbmMpIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykgJiYgZW5jW2tdLmFnZ3IpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG52bGVuYy5mb3JFYWNoID0gZnVuY3Rpb24oZW5jLCBmKSB7XG4gIHZhciBpID0gMDtcbiAgZW5jVHlwZXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIGspKSB7XG4gICAgICBmKGVuY1trXSwgaywgaSsrKTtcbiAgICB9XG4gIH0pO1xufTtcblxudmxlbmMubWFwID0gZnVuY3Rpb24oZW5jLCBmKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgZW5jVHlwZXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIGspKSB7XG4gICAgICBhcnIucHVzaChmKGVuY1trXSwgaywgZW5jKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFycjtcbn07XG5cbnZsZW5jLnJlZHVjZSA9IGZ1bmN0aW9uKGVuYywgZiwgaW5pdCkge1xuICB2YXIgciA9IGluaXQsIGkgPSAwLCBrO1xuICBlbmNUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykpIHtcbiAgICAgIHIgPSBmKHIsIGVuY1trXSwgaywgIGVuYyk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHI7XG59O1xuXG4vKlxuICogcmV0dXJuIGtleS12YWx1ZSBwYWlycyBvZiBmaWVsZCBuYW1lIGFuZCBsaXN0IG9mIGZpZWxkcyBvZiB0aGF0IGZpZWxkIG5hbWVcbiAqL1xudmxlbmMuZmllbGRzID0gZnVuY3Rpb24oZW5jKSB7XG4gIHJldHVybiB2bGVuYy5yZWR1Y2UoZW5jLCBmdW5jdGlvbiAobSwgZmllbGQsIGVuY1R5cGUpIHtcbiAgICB2YXIgZmllbGRMaXN0ID0gbVtmaWVsZC5uYW1lXSA9IG1bZmllbGQubmFtZV0gfHwgW10sXG4gICAgICBjb250YWluc1R5cGUgPSBmaWVsZExpc3QuY29udGFpbnNUeXBlID0gZmllbGRMaXN0LmNvbnRhaW5zVHlwZSB8fCB7fTtcblxuICAgIGlmIChmaWVsZExpc3QuaW5kZXhPZihmaWVsZCkgPT09IC0xKSB7XG4gICAgICBmaWVsZExpc3QucHVzaChmaWVsZCk7XG4gICAgICAvLyBhdWdtZW50IHRoZSBhcnJheSB3aXRoIGNvbnRhaW5zVHlwZS5RIC8gTyAvIFRcbiAgICAgIGNvbnRhaW5zVHlwZVtmaWVsZC50eXBlXSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBtO1xuICB9LCB7fSk7XG59O1xuXG52bGVuYy5zaG9ydGhhbmQgPSBmdW5jdGlvbihlbmMpIHtcbiAgcmV0dXJuIHZsZW5jLm1hcChlbmMsIGZ1bmN0aW9uKGZpZWxkLCBldCkge1xuICAgIHJldHVybiBldCArIGMuYXNzaWduICsgdmxmaWVsZC5zaG9ydGhhbmQoZmllbGQpO1xuICB9KS5qb2luKGMuZGVsaW0pO1xufTtcblxudmxlbmMuZnJvbVNob3J0aGFuZCA9IGZ1bmN0aW9uKHNob3J0aGFuZCwgY29udmVydFR5cGUpIHtcbiAgdmFyIGVuYyA9IHV0aWwuaXNBcnJheShzaG9ydGhhbmQpID8gc2hvcnRoYW5kIDogc2hvcnRoYW5kLnNwbGl0KGMuZGVsaW0pO1xuICByZXR1cm4gZW5jLnJlZHVjZShmdW5jdGlvbihtLCBlKSB7XG4gICAgdmFyIHNwbGl0ID0gZS5zcGxpdChjLmFzc2lnbiksXG4gICAgICAgIGVuY3R5cGUgPSBzcGxpdFswXS50cmltKCksXG4gICAgICAgIGZpZWxkID0gc3BsaXRbMV07XG5cbiAgICBtW2VuY3R5cGVdID0gdmxmaWVsZC5mcm9tU2hvcnRoYW5kKGZpZWxkLCBjb252ZXJ0VHlwZSk7XG4gICAgcmV0dXJuIG07XG4gIH0sIHt9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB1dGlsaXR5IGZvciBmaWVsZFxuXG52YXIgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gIHRpbWUgPSByZXF1aXJlKCcuL2NvbXBpbGUvdGltZScpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpO1xuXG52YXIgdmxmaWVsZCA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZsZmllbGQuc2hvcnRoYW5kID0gZnVuY3Rpb24oZikge1xuICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQ7XG4gIHJldHVybiAoZi5hZ2dyID8gZi5hZ2dyICsgYy5mdW5jIDogJycpICtcbiAgICAoZi5mbiA/IGYuZm4gKyBjLmZ1bmMgOiAnJykgK1xuICAgIChmLmJpbiA/ICdiaW4nICsgYy5mdW5jIDogJycpICtcbiAgICAoZi5uYW1lIHx8ICcnKSArIGMudHlwZSArXG4gICAgKGNvbnN0cy5kYXRhVHlwZU5hbWVzW2YudHlwZV0gfHwgZi50eXBlKTtcbn07XG5cbnZsZmllbGQuc2hvcnRoYW5kcyA9IGZ1bmN0aW9uKGZpZWxkcywgZGVsaW0pIHtcbiAgZGVsaW0gPSBkZWxpbSB8fCBjLmRlbGltO1xuICByZXR1cm4gZmllbGRzLm1hcCh2bGZpZWxkLnNob3J0aGFuZCkuam9pbihkZWxpbSk7XG59O1xuXG52bGZpZWxkLmZyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGNvbnZlcnRUeXBlKSB7XG4gIHZhciBzcGxpdCA9IHNob3J0aGFuZC5zcGxpdChjLnR5cGUpLCBpO1xuICB2YXIgbyA9IHtcbiAgICBuYW1lOiBzcGxpdFswXS50cmltKCksXG4gICAgdHlwZTogY29udmVydFR5cGUgPyBjb25zdHMuZGF0YVR5cGVzW3NwbGl0WzFdLnRyaW0oKV0gOiBzcGxpdFsxXS50cmltKClcbiAgfTtcblxuICAvLyBjaGVjayBhZ2dyZWdhdGUgdHlwZVxuICBmb3IgKGkgaW4gc2NoZW1hLmFnZ3IuZW51bSkge1xuICAgIHZhciBhID0gc2NoZW1hLmFnZ3IuZW51bVtpXTtcbiAgICBpZiAoby5uYW1lLmluZGV4T2YoYSArICdfJykgPT09IDApIHtcbiAgICAgIG8ubmFtZSA9IG8ubmFtZS5zdWJzdHIoYS5sZW5ndGggKyAxKTtcbiAgICAgIGlmIChhID09ICdjb3VudCcgJiYgby5uYW1lLmxlbmd0aCA9PT0gMCkgby5uYW1lID0gJyonO1xuICAgICAgby5hZ2dyID0gYTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoZWNrIHRpbWUgZm5cbiAgZm9yIChpIGluIHNjaGVtYS50aW1lZm5zKSB7XG4gICAgdmFyIGYgPSBzY2hlbWEudGltZWZuc1tpXTtcbiAgICBpZiAoby5uYW1lICYmIG8ubmFtZS5pbmRleE9mKGYgKyAnXycpID09PSAwKSB7XG4gICAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKG8ubGVuZ3RoICsgMSk7XG4gICAgICBvLmZuID0gZjtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoZWNrIGJpblxuICBpZiAoby5uYW1lICYmIG8ubmFtZS5pbmRleE9mKCdiaW5fJykgPT09IDApIHtcbiAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKDQpO1xuICAgIG8uYmluID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBvO1xufTtcblxudmFyIHR5cGVPcmRlciA9IHtcbiAgTzogMCxcbiAgRzogMSxcbiAgVDogMixcbiAgUTogM1xufTtcblxudmxmaWVsZC5vcmRlciA9IHt9O1xuXG52bGZpZWxkLm9yZGVyLnR5cGUgPSBmdW5jdGlvbihmaWVsZCkge1xuICBpZiAoZmllbGQuYWdncj09PSdjb3VudCcpIHJldHVybiA0O1xuICByZXR1cm4gdHlwZU9yZGVyW2ZpZWxkLnR5cGVdO1xufTtcblxudmxmaWVsZC5vcmRlci50eXBlVGhlbk5hbWUgPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gdmxmaWVsZC5vcmRlci50eXBlKGZpZWxkKSArICdfJyArIGZpZWxkLm5hbWUudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZsZmllbGQub3JkZXIub3JpZ2luYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIDA7IC8vIG5vIHN3YXAgd2lsbCBvY2N1clxufTtcblxudmxmaWVsZC5vcmRlci5uYW1lID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGZpZWxkLm5hbWU7XG59O1xuXG52bGZpZWxkLm9yZGVyLnR5cGVUaGVuQ2FyZGluYWxpdHkgPSBmdW5jdGlvbihmaWVsZCwgc3RhdHMpe1xuICByZXR1cm4gc3RhdHNbZmllbGQubmFtZV0uZGlzdGluY3Q7XG59O1xuXG4vLyBGSVhNRSByZWZhY3RvclxudmxmaWVsZC5pc1R5cGUgPSBmdW5jdGlvbiAoZmllbGREZWYsIHR5cGUpIHtcbiAgcmV0dXJuIChmaWVsZERlZi50eXBlICYgdHlwZSkgPiAwO1xufTtcblxudmxmaWVsZC5pc1R5cGUuYnlDb2RlID0gdmxmaWVsZC5pc1R5cGU7XG5cbnZsZmllbGQuaXNUeXBlLmJ5TmFtZSA9IGZ1bmN0aW9uIChmaWVsZCwgdHlwZSkge1xuICByZXR1cm4gZmllbGQudHlwZSA9PT0gY29uc3RzLmRhdGFUeXBlTmFtZXNbdHlwZV07XG59O1xuXG5cbmZ1bmN0aW9uIGdldElzVHlwZSh1c2VUeXBlQ29kZSkge1xuICByZXR1cm4gdXNlVHlwZUNvZGUgPyB2bGZpZWxkLmlzVHlwZS5ieUNvZGUgOiB2bGZpZWxkLmlzVHlwZS5ieU5hbWU7XG59XG5cbnZsZmllbGQuaXNUeXBlLmdldCA9IGdldElzVHlwZTsgLy9GSVhNRVxuXG4vKlxuICogTW9zdCBmaWVsZHMgdGhhdCB1c2Ugb3JkaW5hbCBzY2FsZSBhcmUgZGltZW5zaW9ucy5cbiAqIEhvd2V2ZXIsIFlFQVIoVCksIFlFQVJNT05USChUKSB1c2UgdGltZSBzY2FsZSwgbm90IG9yZGluYWwgYnV0IGFyZSBkaW1lbnNpb25zIHRvby5cbiAqL1xudmxmaWVsZC5pc09yZGluYWxTY2FsZSA9IGZ1bmN0aW9uKGZpZWxkLCB1c2VUeXBlQ29kZSAvKm9wdGlvbmFsKi8pIHtcbiAgdmFyIGlzVHlwZSA9IGdldElzVHlwZSh1c2VUeXBlQ29kZSk7XG4gIHJldHVybiAgaXNUeXBlKGZpZWxkLCBPKSB8fCBmaWVsZC5iaW4gfHxcbiAgICAoIGlzVHlwZShmaWVsZCwgVCkgJiYgZmllbGQuZm4gJiYgdGltZS5pc09yZGluYWxGbihmaWVsZC5mbikgKTtcbn07XG5cbmZ1bmN0aW9uIGlzRGltZW5zaW9uKGZpZWxkLCB1c2VUeXBlQ29kZSAvKm9wdGlvbmFsKi8pIHtcbiAgdmFyIGlzVHlwZSA9IGdldElzVHlwZSh1c2VUeXBlQ29kZSk7XG4gIHJldHVybiAgaXNUeXBlKGZpZWxkLCBPKSB8fCAhIWZpZWxkLmJpbiB8fFxuICAgICggaXNUeXBlKGZpZWxkLCBUKSAmJiAhIWZpZWxkLmZuICk7XG59XG5cbi8qKlxuICogRm9yIGVuY29kaW5nLCB1c2UgZW5jb2RpbmcuaXNEaW1lbnNpb24oKSB0byBhdm9pZCBjb25mdXNpb24uXG4gKiBPciB1c2UgRW5jb2RpbmcuaXNUeXBlIGlmIHlvdXIgZmllbGQgaXMgZnJvbSBFbmNvZGluZyAoYW5kIHRodXMgaGF2ZSBudW1lcmljIGRhdGEgdHlwZSkuXG4gKiBvdGhlcndpc2UsIGRvIG5vdCBzcGVjaWZpYyBpc1R5cGUgc28gd2UgY2FuIHVzZSB0aGUgZGVmYXVsdCBpc1R5cGVOYW1lIGhlcmUuXG4gKi9cbnZsZmllbGQuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihmaWVsZCwgdXNlVHlwZUNvZGUgLypvcHRpb25hbCovKSB7XG4gIHJldHVybiBmaWVsZCAmJiBpc0RpbWVuc2lvbihmaWVsZCwgdXNlVHlwZUNvZGUpO1xufTtcblxudmxmaWVsZC5pc01lYXN1cmUgPSBmdW5jdGlvbihmaWVsZCwgdXNlVHlwZUNvZGUpIHtcbiAgcmV0dXJuIGZpZWxkICYmICFpc0RpbWVuc2lvbihmaWVsZCwgdXNlVHlwZUNvZGUpO1xufTtcblxudmxmaWVsZC5yb2xlID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGlzRGltZW5zaW9uKGZpZWxkKSA/ICdkaW1lbnNpb24nIDogJ21lYXN1cmUnO1xufTtcblxudmxmaWVsZC5jb3VudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge25hbWU6JyonLCBhZ2dyOiAnY291bnQnLCB0eXBlOidRJywgZGlzcGxheU5hbWU6IHZsZmllbGQuY291bnQuZGlzcGxheU5hbWV9O1xufTtcblxudmxmaWVsZC5jb3VudC5kaXNwbGF5TmFtZSA9ICdOdW1iZXIgb2YgUmVjb3Jkcyc7XG5cbnZsZmllbGQuaXNDb3VudCA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiBmaWVsZC5hZ2dyID09PSAnY291bnQnO1xufTtcblxuLyoqXG4gKiBGb3IgZW5jb2RpbmcsIHVzZSBlbmNvZGluZy5jYXJkaW5hbGl0eSgpIHRvIGF2b2lkIGNvbmZ1c2lvbi4gIE9yIHVzZSBFbmNvZGluZy5pc1R5cGUgaWYgeW91ciBmaWVsZCBpcyBmcm9tIEVuY29kaW5nIChhbmQgdGh1cyBoYXZlIG51bWVyaWMgZGF0YSB0eXBlKS5cbiAqIG90aGVyd2lzZSwgZG8gbm90IHNwZWNpZmljIGlzVHlwZSBzbyB3ZSBjYW4gdXNlIHRoZSBkZWZhdWx0IGlzVHlwZU5hbWUgaGVyZS5cbiAqL1xudmxmaWVsZC5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdXNlVHlwZUNvZGUpIHtcbiAgLy8gRklYTUUgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcblxuICB2YXIgc3RhdCA9IHN0YXRzW2ZpZWxkLm5hbWVdO1xuICB2YXIgaXNUeXBlID0gZ2V0SXNUeXBlKHVzZVR5cGVDb2RlKSxcbiAgICB0eXBlID0gdXNlVHlwZUNvZGUgPyBjb25zdHMuZGF0YVR5cGVOYW1lc1tmaWVsZC50eXBlXSA6IGZpZWxkLnR5cGU7XG5cbiAgZmlsdGVyTnVsbCA9IGZpbHRlck51bGwgfHwge307XG5cbiAgaWYgKGZpZWxkLmJpbikge1xuICAgIHZhciBiaW5zID0gdXRpbC5nZXRiaW5zKHN0YXQsIGZpZWxkLmJpbi5tYXhiaW5zIHx8IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQpO1xuICAgIHJldHVybiAoYmlucy5zdG9wIC0gYmlucy5zdGFydCkgLyBiaW5zLnN0ZXA7XG4gIH1cbiAgaWYgKGlzVHlwZShmaWVsZCwgVCkpIHtcbiAgICB2YXIgY2FyZGluYWxpdHkgPSB0aW1lLmNhcmRpbmFsaXR5KGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSk7XG4gICAgaWYoY2FyZGluYWxpdHkgIT09IG51bGwpIHJldHVybiBjYXJkaW5hbGl0eTtcbiAgICAvL290aGVyd2lzZSB1c2UgY2FsY3VsYXRpb24gYmVsb3dcbiAgfVxuICBpZiAoZmllbGQuYWdncikge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgLy8gcmVtb3ZlIG51bGxcbiAgcmV0dXJuIHN0YXQuZGlzdGluY3QgLVxuICAgIChzdGF0Lm51bGxzID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gZGVjbGFyZSBnbG9iYWwgY29uc3RhbnRcbnZhciBnID0gZ2xvYmFsIHx8IHdpbmRvdztcblxuZy5UQUJMRSA9ICd0YWJsZSc7XG5nLlJBVyA9ICdyYXcnO1xuZy5TVEFDS0VEID0gJ3N0YWNrZWQnO1xuZy5JTkRFWCA9ICdpbmRleCc7XG5cbmcuWCA9ICd4JztcbmcuWSA9ICd5JztcbmcuUk9XID0gJ3Jvdyc7XG5nLkNPTCA9ICdjb2wnO1xuZy5TSVpFID0gJ3NpemUnO1xuZy5TSEFQRSA9ICdzaGFwZSc7XG5nLkNPTE9SID0gJ2NvbG9yJztcbmcuQUxQSEEgPSAnYWxwaGEnO1xuZy5URVhUID0gJ3RleHQnO1xuZy5ERVRBSUwgPSAnZGV0YWlsJztcblxuZy5PID0gMTtcbmcuUSA9IDI7XG5nLlQgPSA0O1xuIiwiLy8gUGFja2FnZSBvZiBkZWZpbmluZyBWZWdhbGl0ZSBTcGVjaWZpY2F0aW9uJ3MganNvbiBzY2hlbWFcblwidXNlIHN0cmljdFwiO1xuXG52YXIgc2NoZW1hID0gbW9kdWxlLmV4cG9ydHMgPSB7fSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxuc2NoZW1hLnV0aWwgPSByZXF1aXJlKCcuL3NjaGVtYXV0aWwnKTtcblxuc2NoZW1hLm1hcmt0eXBlID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogWydwb2ludCcsICd0aWNrJywgJ2JhcicsICdsaW5lJywgJ2FyZWEnLCAnY2lyY2xlJywgJ3NxdWFyZScsICd0ZXh0J11cbn07XG5cbnNjaGVtYS5hZ2dyID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogWydhdmcnLCAnc3VtJywgJ21pbicsICdtYXgnLCAnY291bnQnXSxcbiAgc3VwcG9ydGVkRW51bXM6IHtcbiAgICBROiBbJ2F2ZycsICdzdW0nLCAnbWluJywgJ21heCcsICdjb3VudCddLFxuICAgIE86IFtdLFxuICAgIFQ6IFsnYXZnJywgJ21pbicsICdtYXgnXSxcbiAgICAnJzogWydjb3VudCddXG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB7J1EnOiB0cnVlLCAnTyc6IHRydWUsICdUJzogdHJ1ZSwgJyc6IHRydWV9XG59O1xuc2NoZW1hLmJhbmQgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc2l6ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgcGFkZGluZzoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlZmF1bHQ6IDFcbiAgICB9XG4gIH1cbn07XG5cbnNjaGVtYS5nZXRTdXBwb3J0ZWRSb2xlID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICByZXR1cm4gc2NoZW1hLnNjaGVtYS5wcm9wZXJ0aWVzLmVuYy5wcm9wZXJ0aWVzW2VuY1R5cGVdLnN1cHBvcnRlZFJvbGU7XG59O1xuXG5zY2hlbWEudGltZWZucyA9IFsneWVhcicsICdtb250aCcsICdkYXknLCAnZGF0ZScsICdob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnXTtcblxuc2NoZW1hLmRlZmF1bHRUaW1lRm4gPSAnbW9udGgnO1xuXG5zY2hlbWEuZm4gPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBzY2hlbWEudGltZWZucyxcbiAgc3VwcG9ydGVkVHlwZXM6IHsnVCc6IHRydWV9XG59O1xuXG4vL1RPRE8oa2FuaXR3KTogYWRkIG90aGVyIHR5cGUgb2YgZnVuY3Rpb24gaGVyZVxuXG5zY2hlbWEuc2NhbGVfdHlwZSA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IFsnbGluZWFyJywgJ2xvZycsICdwb3cnLCAnc3FydCcsICdxdWFudGlsZSddLFxuICBkZWZhdWx0OiAnbGluZWFyJyxcbiAgc3VwcG9ydGVkVHlwZXM6IHsnUSc6IHRydWV9XG59O1xuXG5zY2hlbWEuZmllbGQgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICB9XG4gIH1cbn07XG5cbnZhciBjbG9uZSA9IHV0aWwuZHVwbGljYXRlO1xudmFyIG1lcmdlID0gc2NoZW1hLnV0aWwubWVyZ2U7XG5cbnNjaGVtYS5NQVhCSU5TX0RFRkFVTFQgPSAxNTtcblxudmFyIGJpbiA9IHtcbiAgdHlwZTogWydib29sZWFuJywgJ29iamVjdCddLFxuICBkZWZhdWx0OiBmYWxzZSxcbiAgcHJvcGVydGllczoge1xuICAgIG1heGJpbnM6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQsXG4gICAgICBtaW5pbXVtOiAyXG4gICAgfVxuICB9LFxuICBzdXBwb3J0ZWRUeXBlczogeydRJzogdHJ1ZX0gLy8gVE9ETzogYWRkICdPJyBhZnRlciBmaW5pc2hpbmcgIzgxXG59O1xuXG52YXIgdHlwaWNhbEZpZWxkID0gbWVyZ2UoY2xvbmUoc2NoZW1hLmZpZWxkKSwge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydPJywgJ1EnLCAnVCddXG4gICAgfSxcbiAgICBhZ2dyOiBzY2hlbWEuYWdncixcbiAgICBmbjogc2NoZW1hLmZuLFxuICAgIGJpbjogYmluLFxuICAgIHNjYWxlOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdHlwZTogc2NoZW1hLnNjYWxlX3R5cGUsXG4gICAgICAgIHJldmVyc2U6IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHsnUSc6IHRydWUsICdUJzogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgICAgemVybzoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0luY2x1ZGUgemVybycsXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczogeydRJzogdHJ1ZSwgJ1QnOiB0cnVlfVxuICAgICAgICB9LFxuICAgICAgICBuaWNlOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydzZWNvbmQnLCAnbWludXRlJywgJ2hvdXInLCAnZGF5JywgJ3dlZWsnLCAnbW9udGgnLCAneWVhciddLFxuICAgICAgICAgIHN1cHBvcnRlZFR5cGVzOiB7J1QnOiB0cnVlfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxudmFyIG9ubHlPcmRpbmFsRmllbGQgPSBtZXJnZShjbG9uZShzY2hlbWEuZmllbGQpLCB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgZGltZW5zaW9uOiB0cnVlXG4gIH0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnTycsJ1EnLCAnVCddIC8vIG9yZGluYWwtb25seSBmaWVsZCBzdXBwb3J0cyBRIHdoZW4gYmluIGlzIGFwcGxpZWQgYW5kIFQgd2hlbiBmbiBpcyBhcHBsaWVkLlxuICAgIH0sXG4gICAgZm46IHNjaGVtYS5mbixcbiAgICBiaW46IGJpbixcbiAgICBhZ2dyOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnY291bnQnXSxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB7J08nOiB0cnVlfVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBheGlzTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBheGlzOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ3JpZDoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBmbGFnIGluZGljYXRlIGlmIGdyaWRsaW5lcyBzaG91bGQgYmUgY3JlYXRlZCBpbiBhZGRpdGlvbiB0byB0aWNrcy4nXG4gICAgICAgIH0sXG4gICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIGZvciB0aGUgYXhpcy4nXG4gICAgICAgIH0sXG4gICAgICAgIHRpdGxlT2Zmc2V0OiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgb2Zmc2V0IHZhbHVlIGZvciB0aGUgYXhpcy4nXG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb3JtYXR0aW5nIHBhdHRlcm4gZm9yIGF4aXMgbGFiZWxzLidcbiAgICAgICAgfSxcbiAgICAgICAgbWF4TGFiZWxMZW5ndGg6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogMjUsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RydW5jYXRlIGxhYmVscyB0aGF0IGFyZSB0b28gbG9uZy4nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBzb3J0TWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc29ydDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHN1cHBvcnRlZFR5cGVzOiB7J08nOiB0cnVlfSxcbiAgICAgICAgcmVxdWlyZWQ6IFsnbmFtZScsICdhZ2dyJ10sXG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9LFxuICAgICAgICBhZ2dyOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydhdmcnLCAnc3VtJywgJ21pbicsICdtYXgnLCAnY291bnQnXVxuICAgICAgICB9LFxuICAgICAgICByZXZlcnNlOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBiYW5kTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYmFuZDogc2NoZW1hLmJhbmRcbiAgfVxufTtcblxudmFyIGxlZ2VuZE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGxlZ2VuZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcblxudmFyIHRleHRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczogeyd0ZXh0JzogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB0ZXh0OiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYWxpZ246IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnbGVmdCdcbiAgICAgICAgfSxcbiAgICAgICAgYmFzZWxpbmU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnbWlkZGxlJ1xuICAgICAgICB9LFxuICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogNCxcbiAgICAgICAgICBtaW5pbXVtOiAwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGZvbnQ6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBbJ25vcm1hbCcsICdib2xkJ10sXG4gICAgICAgICAgZGVmYXVsdDogJ25vcm1hbCdcbiAgICAgICAgfSxcbiAgICAgICAgc2l6ZToge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiAxMCxcbiAgICAgICAgICBtaW5pbXVtOiAwXG4gICAgICAgIH0sXG4gICAgICAgIGZhbWlseToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdIZWx2ZXRpY2EgTmV1ZSdcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnbm9ybWFsJyxcbiAgICAgICAgICBlbnVtOiBbJ25vcm1hbCcsICdpdGFsaWMnXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgc2l6ZU1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIGJhcjogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsIHRleHQ6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDMwLFxuICAgICAgbWluaW11bTogMFxuICAgIH1cbiAgfVxufTtcblxudmFyIGNvbG9yTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgJ3RleHQnOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnc3RlZWxibHVlJ1xuICAgIH0sXG4gICAgc2NhbGU6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByYW5nZToge1xuICAgICAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ2FycmF5J11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGFscGhhTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgJ3RleHQnOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxXG4gICAgfVxuICB9XG59O1xuXG52YXIgc2hhcGVNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2NpcmNsZScsICdzcXVhcmUnLCAnY3Jvc3MnLCAnZGlhbW9uZCcsICd0cmlhbmdsZS11cCcsICd0cmlhbmdsZS1kb3duJ10sXG4gICAgICBkZWZhdWx0OiAnY2lyY2xlJ1xuICAgIH1cbiAgfVxufTtcblxudmFyIGRldGFpbE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGxpbmU6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlfVxufTtcblxudmFyIHJvd01peGluID0ge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZWZhdWx0OiAxNTBcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgZmxhZyBpbmRpY2F0ZSBpZiBncmlkbGluZXMgc2hvdWxkIGJlIGNyZWF0ZWQgaW4gYWRkaXRpb24gdG8gdGlja3MuJ1xuICAgIH0sXG4gIH1cbn07XG5cbnZhciBjb2xNaXhpbiA9IHtcbiAgcHJvcGVydGllczoge1xuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZWZhdWx0OiAxNTBcbiAgICB9LFxuICAgIGF4aXM6IHtcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbWF4TGFiZWxMZW5ndGg6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogMTIsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RydW5jYXRlIGxhYmVscyB0aGF0IGFyZSB0b28gbG9uZy4nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBmYWNldE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGJhcjogdHJ1ZSwgbGluZTogdHJ1ZSwgYXJlYTogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsIHRleHQ6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgcGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMSxcbiAgICAgIGRlZmF1bHQ6IDAuMVxuICAgIH1cbiAgfVxufTtcblxudmFyIHJlcXVpcmVkTmFtZVR5cGUgPSB7XG4gIHJlcXVpcmVkOiBbJ25hbWUnLCAndHlwZSddXG59O1xuXG52YXIgbXVsdGlSb2xlRmllbGQgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCB7XG4gIHN1cHBvcnRlZFJvbGU6IHtcbiAgICBtZWFzdXJlOiB0cnVlLFxuICAgIGRpbWVuc2lvbjogdHJ1ZVxuICB9XG59KTtcblxudmFyIHF1YW50aXRhdGl2ZUZpZWxkID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwge1xuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgbWVhc3VyZTogdHJ1ZSxcbiAgICBkaW1lbnNpb246ICdvcmRpbmFsLW9ubHknIC8vIHVzaW5nIGFscGhhIC8gc2l6ZSB0byBlbmNvZGluZyBjYXRlZ29yeSBsZWFkIHRvIG9yZGVyIGludGVycHJldGF0aW9uXG4gIH1cbn0pO1xuXG52YXIgb25seVF1YW50aXRhdGl2ZUZpZWxkID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwge1xuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgbWVhc3VyZTogdHJ1ZVxuICB9XG59KTtcblxudmFyIHggPSBtZXJnZShjbG9uZShtdWx0aVJvbGVGaWVsZCksIGF4aXNNaXhpbiwgYmFuZE1peGluLCByZXF1aXJlZE5hbWVUeXBlLCBzb3J0TWl4aW4pO1xudmFyIHkgPSBjbG9uZSh4KTtcblxudmFyIGZhY2V0ID0gbWVyZ2UoY2xvbmUob25seU9yZGluYWxGaWVsZCksIHJlcXVpcmVkTmFtZVR5cGUsIGZhY2V0TWl4aW4sIHNvcnRNaXhpbik7XG52YXIgcm93ID0gbWVyZ2UoY2xvbmUoZmFjZXQpLCBheGlzTWl4aW4sIHJvd01peGluKTtcbnZhciBjb2wgPSBtZXJnZShjbG9uZShmYWNldCksIGF4aXNNaXhpbiwgY29sTWl4aW4pO1xuXG52YXIgc2l6ZSA9IG1lcmdlKGNsb25lKHF1YW50aXRhdGl2ZUZpZWxkKSwgbGVnZW5kTWl4aW4sIHNpemVNaXhpbiwgc29ydE1peGluKTtcbnZhciBjb2xvciA9IG1lcmdlKGNsb25lKG11bHRpUm9sZUZpZWxkKSwgbGVnZW5kTWl4aW4sIGNvbG9yTWl4aW4sIHNvcnRNaXhpbik7XG52YXIgYWxwaGEgPSBtZXJnZShjbG9uZShxdWFudGl0YXRpdmVGaWVsZCksIGFscGhhTWl4aW4sIHNvcnRNaXhpbik7XG52YXIgc2hhcGUgPSBtZXJnZShjbG9uZShvbmx5T3JkaW5hbEZpZWxkKSwgbGVnZW5kTWl4aW4sIHNoYXBlTWl4aW4sIHNvcnRNaXhpbik7XG52YXIgZGV0YWlsID0gbWVyZ2UoY2xvbmUob25seU9yZGluYWxGaWVsZCksIGRldGFpbE1peGluLCBzb3J0TWl4aW4pO1xuXG4vLyB3ZSBvbmx5IHB1dCBhZ2dyZWdhdGVkIG1lYXN1cmUgaW4gcGl2b3QgdGFibGVcbnZhciB0ZXh0ID0gbWVyZ2UoY2xvbmUob25seVF1YW50aXRhdGl2ZUZpZWxkKSwgdGV4dE1peGluLCBzb3J0TWl4aW4pO1xuXG4vLyBUT0RPIGFkZCBsYWJlbFxuXG52YXIgZmlsdGVyID0ge1xuICB0eXBlOiAnYXJyYXknLFxuICBpdGVtczoge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIG9wZXJhbmRzOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgdHlwZTogWydzdHJpbmcnLCAnYm9vbGVhbicsICdpbnRlZ2VyJywgJ251bWJlciddXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvcGVyYXRvcjoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZW51bTogWyc+JywgJz49JywgJz0nLCAnIT0nLCAnPCcsICc8PScsICdub3ROdWxsJ11cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBkYXRhID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIC8vIGRhdGEgc291cmNlXG4gICAgZm9ybWF0VHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2pzb24nLCAnY3N2J10sXG4gICAgICBkZWZhdWx0OiAnanNvbidcbiAgICB9LFxuICAgIHVybDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIHZlZ2FTZXJ2ZXI6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGFibGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICAgICAgfSxcbiAgICAgICAgdXJsOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGNvbmZpZyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvLyB0ZW1wbGF0ZVxuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2aWV3cG9ydDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgfSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgZ3JpZENvbG9yOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnI2VlZWVlZSdcbiAgICB9LFxuXG4gICAgLy8gZmlsdGVyIG51bGxcbiAgICBmaWx0ZXJOdWxsOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgTzoge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiBmYWxzZX0sXG4gICAgICAgIFE6IHt0eXBlOidib29sZWFuJywgZGVmYXVsdDogdHJ1ZX0sXG4gICAgICAgIFQ6IHt0eXBlOidib29sZWFuJywgZGVmYXVsdDogdHJ1ZX1cbiAgICAgIH1cbiAgICB9LFxuICAgIHRvZ2dsZVNvcnQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ08nXG4gICAgfSxcblxuICAgIC8vIHNpbmdsZSBwbG90XG4gICAgc2luZ2xlSGVpZ2h0OiB7XG4gICAgICAvLyB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IGJhbmRXaWR0aCAqIChjYXJkaW5hbGl0eSArIHBhZGRpbmcpXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzaW5nbGVXaWR0aDoge1xuICAgICAgLy8gd2lsbCBiZSBvdmVyd3JpdHRlbiBieSBiYW5kV2lkdGggKiAoY2FyZGluYWxpdHkgKyBwYWRkaW5nKVxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjAwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gYmFuZCBzaXplXG4gICAgbGFyZ2VCYW5kU2l6ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjEsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzbWFsbEJhbmRTaXplOiB7XG4gICAgICAvL3NtYWxsIG11bHRpcGxlcyBvciBzaW5nbGUgcGxvdCB3aXRoIGhpZ2ggY2FyZGluYWxpdHlcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDEyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHk6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDEwXG4gICAgfSxcbiAgICAvLyBzbWFsbCBtdWx0aXBsZXNcbiAgICBjZWxsUGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwLjFcbiAgICB9LFxuICAgIGNlbGxHcmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICcjYWFhYWFhJ1xuICAgIH0sXG4gICAgY2VsbEJhY2tncm91bmRDb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJ3RyYW5zcGFyZW50J1xuICAgIH0sXG4gICAgdGV4dENlbGxXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogOTAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcblxuICAgIC8vIG1hcmtzXG4gICAgc3Ryb2tlV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDIsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcblxuICAgIC8vIHNjYWxlc1xuICAgIHRpbWVTY2FsZUxhYmVsTGVuZ3RoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAzLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gb3RoZXJcbiAgICBjaGFyYWN0ZXJXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogNlxuICAgIH1cbiAgfVxufTtcblxuLyoqIEB0eXBlIE9iamVjdCBTY2hlbWEgb2YgYSB2ZWdhbGl0ZSBzcGVjaWZpY2F0aW9uICovXG5zY2hlbWEuc2NoZW1hID0ge1xuICAkc2NoZW1hOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgZGVzY3JpcHRpb246ICdTY2hlbWEgZm9yIHZlZ2FsaXRlIHNwZWNpZmljYXRpb24nLFxuICB0eXBlOiAnb2JqZWN0JyxcbiAgcmVxdWlyZWQ6IFsnbWFya3R5cGUnLCAnZW5jJywgJ2RhdGEnLCAnY29uZmlnJ10sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBkYXRhOiBkYXRhLFxuICAgIG1hcmt0eXBlOiBzY2hlbWEubWFya3R5cGUsXG4gICAgZW5jOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeSxcbiAgICAgICAgcm93OiByb3csXG4gICAgICAgIGNvbDogY29sLFxuICAgICAgICBzaXplOiBzaXplLFxuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIGFscGhhOiBhbHBoYSxcbiAgICAgICAgc2hhcGU6IHNoYXBlLFxuICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICBkZXRhaWw6IGRldGFpbFxuICAgICAgfVxuICAgIH0sXG4gICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgY29uZmlnOiBjb25maWdcbiAgfVxufTtcblxuc2NoZW1hLmVuY1R5cGVzID0gdXRpbC5rZXlzKHNjaGVtYS5zY2hlbWEucHJvcGVydGllcy5lbmMucHJvcGVydGllcyk7XG5cbi8qKiBJbnN0YW50aWF0ZSBhIHZlcmJvc2Ugdmwgc3BlYyBmcm9tIHRoZSBzY2hlbWEgKi9cbnNjaGVtYS5pbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gc2NoZW1hLnV0aWwuaW5zdGFudGlhdGUoc2NoZW1hLnNjaGVtYSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2NoZW1hdXRpbCA9IG1vZHVsZS5leHBvcnRzID0ge30sXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBpc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbn07XG5cbnNjaGVtYXV0aWwuZXh0ZW5kID0gZnVuY3Rpb24oaW5zdGFuY2UsIHNjaGVtYSkge1xuICByZXR1cm4gc2NoZW1hdXRpbC5tZXJnZShzY2hlbWF1dGlsLmluc3RhbnRpYXRlKHNjaGVtYSksIGluc3RhbmNlKTtcbn07XG5cbi8vIGluc3RhbnRpYXRlIGEgc2NoZW1hXG5zY2hlbWF1dGlsLmluc3RhbnRpYXRlID0gZnVuY3Rpb24oc2NoZW1hKSB7XG4gIHZhciB2YWw7XG4gIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0gZWxzZSBpZiAoJ2RlZmF1bHQnIGluIHNjaGVtYSkge1xuICAgIHZhbCA9IHNjaGVtYS5kZWZhdWx0O1xuICAgIHJldHVybiB1dGlsLmlzT2JqZWN0KHZhbCkgPyB1dGlsLmR1cGxpY2F0ZSh2YWwpIDogdmFsO1xuICB9IGVsc2UgaWYgKHNjaGVtYS50eXBlID09PSAnb2JqZWN0Jykge1xuICAgIHZhciBpbnN0YW5jZSA9IHt9O1xuICAgIGZvciAodmFyIG5hbWUgaW4gc2NoZW1hLnByb3BlcnRpZXMpIHtcbiAgICAgIHZhbCA9IHNjaGVtYXV0aWwuaW5zdGFudGlhdGUoc2NoZW1hLnByb3BlcnRpZXNbbmFtZV0pO1xuICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGluc3RhbmNlW25hbWVdID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSBpZiAoc2NoZW1hLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbi8vIHJlbW92ZSBhbGwgZGVmYXVsdHMgZnJvbSBhbiBpbnN0YW5jZVxuc2NoZW1hdXRpbC5zdWJ0cmFjdCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBkZWZhdWx0cykge1xuICB2YXIgY2hhbmdlcyA9IHt9O1xuICBmb3IgKHZhciBwcm9wIGluIGluc3RhbmNlKSB7XG4gICAgdmFyIGRlZiA9IGRlZmF1bHRzW3Byb3BdO1xuICAgIHZhciBpbnMgPSBpbnN0YW5jZVtwcm9wXTtcbiAgICAvLyBOb3RlOiBkb2VzIG5vdCBwcm9wZXJseSBzdWJ0cmFjdCBhcnJheXNcbiAgICBpZiAoIWRlZmF1bHRzIHx8IGRlZiAhPT0gaW5zKSB7XG4gICAgICBpZiAodHlwZW9mIGlucyA9PT0gJ29iamVjdCcgJiYgIXV0aWwuaXNBcnJheShpbnMpICYmIGRlZikge1xuICAgICAgICB2YXIgYyA9IHNjaGVtYXV0aWwuc3VidHJhY3QoaW5zLCBkZWYpO1xuICAgICAgICBpZiAoIWlzRW1wdHkoYykpXG4gICAgICAgICAgY2hhbmdlc1twcm9wXSA9IGM7XG4gICAgICB9IGVsc2UgaWYgKCF1dGlsLmlzQXJyYXkoaW5zKSB8fCBpbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBjaGFuZ2VzW3Byb3BdID0gaW5zO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY2hhbmdlcztcbn07XG5cbnNjaGVtYXV0aWwubWVyZ2UgPSBmdW5jdGlvbigvKmRlc3QqLCBzcmMwLCBzcmMxLCAuLi4qLyl7XG4gIHZhciBkZXN0ID0gYXJndW1lbnRzWzBdO1xuICBmb3IgKHZhciBpPTEgOyBpPGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGRlc3QgPSBtZXJnZShkZXN0LCBhcmd1bWVudHNbaV0pO1xuICB9XG4gIHJldHVybiBkZXN0O1xufTtcblxuLy8gcmVjdXJzaXZlbHkgbWVyZ2VzIHNyYyBpbnRvIGRlc3RcbmZ1bmN0aW9uIG1lcmdlKGRlc3QsIHNyYykge1xuICBpZiAodHlwZW9mIHNyYyAhPT0gJ29iamVjdCcgfHwgc3JjID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGRlc3Q7XG4gIH1cblxuICBmb3IgKHZhciBwIGluIHNyYykge1xuICAgIGlmICghc3JjLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNyY1twXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzcmNbcF0gIT09ICdvYmplY3QnIHx8IHNyY1twXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IHNyY1twXTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZXN0W3BdICE9PSAnb2JqZWN0JyB8fCBkZXN0W3BdID09PSBudWxsKSB7XG4gICAgICBkZXN0W3BdID0gbWVyZ2Uoc3JjW3BdLmNvbnN0cnVjdG9yID09PSBBcnJheSA/IFtdIDoge30sIHNyY1twXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lcmdlKGRlc3RbcF0sIHNyY1twXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXN0O1xufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL3V0aWwnKTtcblxudXRpbC5leHRlbmQodXRpbCwgcmVxdWlyZSgnZGF0YWxpYi9zcmMvZ2VuZXJhdGUnKSk7XG51dGlsLmJpbiA9IHJlcXVpcmUoJ2RhdGFsaWIvc3JjL2JpbicpO1xuXG51dGlsLmlzaW4gPSBmdW5jdGlvbihpdGVtLCBhcnJheSkge1xuICByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtKSAhPT0gLTE7XG59O1xuXG51dGlsLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGYsIHRoaXNBcmcpIHtcbiAgaWYgKG9iai5mb3JFYWNoKSB7XG4gICAgb2JqLmZvckVhY2guY2FsbCh0aGlzQXJnLCBmKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgZi5jYWxsKHRoaXNBcmcsIG9ialtrXSwgayAsIG9iaik7XG4gICAgfVxuICB9XG59O1xuXG51dGlsLmdldGJpbnMgPSBmdW5jdGlvbihzdGF0cywgbWF4Ymlucykge1xuICByZXR1cm4gdXRpbC5iaW4oe1xuICAgIG1pbjogc3RhdHMubWluLFxuICAgIG1heDogc3RhdHMubWF4LFxuICAgIG1heGJpbnM6IG1heGJpbnNcbiAgfSk7XG59O1xuXG4vKipcbiAqIHhbcFswXV0uLi5bcFtuXV0gPSB2YWxcbiAqIEBwYXJhbSBub2F1Z21lbnQgZGV0ZXJtaW5lIHdoZXRoZXIgbmV3IG9iamVjdCBzaG91bGQgYmUgYWRkZWQgZlxuICogb3Igbm9uLWV4aXN0aW5nIHByb3BlcnRpZXMgYWxvbmcgdGhlIHBhdGhcbiAqL1xudXRpbC5zZXR0ZXIgPSBmdW5jdGlvbih4LCBwLCB2YWwsIG5vYXVnbWVudCkge1xuICBmb3IgKHZhciBpPTA7IGk8cC5sZW5ndGgtMTsgKytpKSB7XG4gICAgaWYgKCFub2F1Z21lbnQgJiYgIShwW2ldIGluIHgpKXtcbiAgICAgIHggPSB4W3BbaV1dID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSB4W3BbaV1dO1xuICAgIH1cbiAgfVxuICB4W3BbaV1dID0gdmFsO1xufTtcblxuXG4vKipcbiAqIHJldHVybnMgeFtwWzBdXS4uLltwW25dXVxuICogQHBhcmFtIGF1Z21lbnQgZGV0ZXJtaW5lIHdoZXRoZXIgbmV3IG9iamVjdCBzaG91bGQgYmUgYWRkZWQgZlxuICogb3Igbm9uLWV4aXN0aW5nIHByb3BlcnRpZXMgYWxvbmcgdGhlIHBhdGhcbiAqL1xudXRpbC5nZXR0ZXIgPSBmdW5jdGlvbih4LCBwLCBub2F1Z21lbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPHAubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoIW5vYXVnbWVudCAmJiAhKHBbaV0gaW4geCkpe1xuICAgICAgeCA9IHhbcFtpXV0gPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IHhbcFtpXV07XG4gICAgfVxuICB9XG4gIHJldHVybiB4O1xufTtcblxudXRpbC5lcnJvciA9IGZ1bmN0aW9uKG1zZykge1xuICBjb25zb2xlLmVycm9yKCdbVkwgRXJyb3JdJywgbXNnKTtcbn07XG5cbiJdfQ==
