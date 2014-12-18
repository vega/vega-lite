vg.data.bin = function() {

  var field,
      accessor,
      output = "bin";


  function compare(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function bisectLeft(a, x, lo, hi) {
    if (arguments.length < 3) { lo = 0; }
    if (arguments.length < 4) { hi = a.length; }
    while (lo < hi) {
      var mid = lo + hi >>> 1;
      if (compare(a[mid], x) < 0) { lo = mid + 1; }
      else { hi = mid; }
    }
    return lo;
  }

  function bins(stats, opt) {
    opt = opt || {};

    // determine range
    var maxb = opt.maxbins || 1024,
        base = opt.base || 10,
        div = opt.div || [5, 2],
        mins = opt.minstep || 0,
        logb = Math.log(base),
        level = Math.ceil(Math.log(maxb) / logb),
        min = stats.min,
        max = stats.max,
        span = max - min,
        step = Math.max(mins, Math.pow(base, Math.round(Math.log(span) / logb) - level)),
        nbins = Math.ceil(span / step),
        precision, v, i, eps;

    if (opt.steps) {
      // if provided, limit choice to acceptable step sizes
      step = opt.steps[Math.min(
              opt.steps.length - 1,
          bisectLeft(opt.steps, span / maxb)
      )];
    } else {
      // increase step size if too many bins
      do {
        step *= base;
        nbins = Math.ceil(span / step);
      } while (nbins > maxb);

      // decrease step size if allowed
      for (i = 0; i < div.length; ++i) {
        v = step / div[i];
        if (v >= mins && span / v <= maxb) {
          step = v;
          nbins = Math.ceil(span / step);
        }
      }
    }

    // update precision, min and max
    v = Math.log(step);
    precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
    eps = Math.pow(base, -precision - 1);

    // outer Math.min to remove some rounding errors:
    min = Math.min(min, Math.floor(min / step + eps) * step);

    max = Math.ceil(max / step) * step;

    return {
      start: min,
      stop: max,
      step: step,
      unit: precision
    };
  }

  function bin(input) {
    var stats = {min: +Infinity, max: -Infinity};
    input.forEach(function(d) {
      var v = accessor(d);
      if (v > stats.max) stats.max = v;
      if (v < stats.min) stats.min = v;
    });
    var b = bins(stats, {maxbins: 20});
    input.forEach(function(d) {
      var v = accessor(d);
      d.data[output] = b.start + b.step * ~~((v - b.start) / b.step);
    });
    return input;
  }

  // HACK for setting visualization size
  bin.numbins = function(input){
    var stats = {min: +Infinity, max: -Infinity};
    input.forEach(function(d) {
      var v = accessor(d);
      if (v > stats.max) stats.max = v;
      if (v < stats.min) stats.min = v;
    });
    var b = bins(stats, {maxbins: 20});
    var uniqueBins = {}; // reset (HACK)
    input.forEach(function(d) {
      var v = accessor(d);
      var vbin = b.start + b.step * ~~((v - b.start) / b.step);
      uniqueBins[vbin] = 1;
    });
    return vg.keys(uniqueBins).length;
  }

  bin.field = function(f) {
    field = f;
    accessor = vg.accessor(f);
    return bin;
  };

  bin.output = function(f) {
    output = f;
    return bin;
  };

  bin.bins = bins;

  return bin;
}
