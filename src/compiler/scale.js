'use strict';
require('../globals');
var util = require('../util'),
  time = require('./time'),
  colorbrewer = require('colorbrewer'),
  interpolate = require('d3-color').interpolateHsl;

var scale = module.exports = {};

scale.names = function(props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    if (props[x] && props[x].scale) a[props[x].scale] = 1;
    return a;
  }, {}));
};

scale.defs = function(names, encoding, layout, stats, facet) {
  return names.reduce(function(a, name) {
    var scaleDef = {};

    scaleDef.name = name;
    scaleDef.type = scale.type(name, encoding);
    scaleDef.domain = scale.domain(encoding, name, scaleDef.type, facet);

    // Add optional properties
    var reverse = scale.reverse(encoding, name);
    if (reverse) {
      scaleDef.reverse = reverse;
    }

    var zero = scale.zero(encoding, name);
    if (zero !== undefined) {
      scaleDef.zero = zero;
    }

    // TODO split scale.range into methods for each properties
    scaleDef = scale.range(scaleDef, encoding, layout, stats);

    return (a.push(scaleDef), a);
  }, []);
};

scale.type = function(name, encoding) {
  switch (encoding.type(name)) {
    case N: //fall through
    case O: return 'ordinal';
    case T:
      var timeUnit = encoding.encDef(name).timeUnit;
      return timeUnit ? time.scale.type(timeUnit, name) : 'time';
    case Q:
      if (encoding.bin(name)) {
        return 'linear';
      }
      return encoding.scale(name).type;
  }
};

scale.domain = function (encoding, name, type, facet) {
  var encDef = encoding.encDef(name);

  // special case for temporal scale
  if (encoding.isType(name, T)) {
    var range = time.scale.domain(encDef.timeUnit, name);
    if (range) return range;
  }

  // For stack, use STACKED data.
  var stack = encoding.stack();
  if (stack && name === stack.value) {
    return {
      data: STACKED,
      field: encoding.fieldRef(name, {
        // If faceted, scale is determined by the max of sum in each facet.
        prefn: (facet ? 'max_' : '') + 'sum_'
      })
    };
  }

  var useRawDomain = scale._useRawDomain(encoding, name);
  var sort = scale.sort(encoding, name, type);

  if (useRawDomain) { // useRawDomain - only Q/T
    return {
      data: RAW,
      field: encoding.fieldRef(name, {noAggregate:true})
    };
  } else if (encDef.bin) { // bin -- need to merge both bin_start and bin_end
    return {
      data: encoding.dataTable(),
      field: [
        encoding.fieldRef(name, {bin_suffix:'_start'}),
        encoding.fieldRef(name, {bin_suffix:'_end'})
      ]
    };
  } else if (sort) { // have sort -- only for ordinal
    return {
      // If sort by aggregation of a specified sort field, we need to use RAW table,
      // so we can aggregate values for the scale independently from the main aggregation.
      data: sort.op ? RAW : encoding.dataTable(),
      field: encoding.fieldRef(name),
      sort: sort
    };
  } else {
    return {
      data: encoding.dataTable(),
      field: encoding.fieldRef(name)
    };
  }
};

scale.sort = function(encoding, name, type) {
  var sort = encoding.encDef(name).sort;
  if (sort === 'ascending' || sort === 'descending') {
    return true;
  }

  // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
  if (type === 'ordinal' && util.isObject(sort)) {
    return {
      op: sort.op,
      field: sort.field
    };
  }
  return undefined;
};

scale.reverse = function(encoding, name) {
  var sort = encoding.encDef(name).sort;
  return sort && (sort === 'descending' || (sort.order === 'descending'));
};

/**
 * Determine if useRawDomain should be activated for this scale.
 * @return {Boolean} Returns true if all of the following conditons applies:
 * 1. `useRawDomain` is enabled either through scale or config
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
scale._useRawDomain = function (encoding, name) {
  var encDef = encoding.encDef(name);

  // scale value
  var scaleUseRawDomain = encoding.scale(name).useRawDomain;

  // Determine if useRawDomain is enabled. If scale value is specified, use scale value.
  // Otherwise, use config value.
  var useRawDomainEnabled = scaleUseRawDomain !== undefined ?
      scaleUseRawDomain : encoding.config('useRawDomain');

  var notCountOrSum = !encDef.aggregate ||
    (encDef.aggregate !=='count' && encDef.aggregate !== 'sum');

  return  useRawDomainEnabled &&
    notCountOrSum && (
      // Q always uses quantitative scale except when it's binned and thus uses ordinal scale.
      (
        encoding.isType(name, Q) &&
        !encDef.bin // TODO(#614): this must be changed once bin is reimplemented
      ) ||
      // TODO: revise this
      // T uses non-ordinal scale when there's no unit or when the unit is not ordinal.
      (
        encoding.isType(name, T) &&
        (!encDef.timeUnit || !time.isOrdinalFn(encDef.timeUnit))
      )
    );
};

// FIXME revise if we should produce undefined for shorter spec (and just use vega's default value.)
// However, let's ignore it for now as it is unclear what is Vega's default value.
scale.zero = function(encoding, name) {
  var spec = encoding.scale(name);
  var encDef = encoding.encDef(name);
  var timeUnit = encDef.timeUnit;

  if (spec.zero) {
    return spec.zero; // return explicit value if defined
  }

  if (encoding.isType(name, T) && (!timeUnit || timeUnit === 'year')) { // FIXME revise this
    // Returns false (undefined)  by default for time scale
    return false;
  }
  if (encDef.bin) {
    // Returns false (undefined) by default of bin
    return false;
  }
  // if not bin / temporal, returns true by default
  return name === X || name === Y || name === SIZE;
};

scale.range = function (scaleDef, encoding, layout, stats) {
  var encDef = encoding.encDef(scaleDef.name);
  var timeUnit = encDef.timeUnit;

  switch (scaleDef.name) {
    case X:
      scaleDef.range = layout.cellWidth ? [0, layout.cellWidth] : 'width';
      if (scaleDef.type === 'ordinal') {
        scaleDef.bandWidth = encoding.bandSize(X, layout.x.useSmallBand);
      }
      scaleDef.round = true;
      if (scaleDef.type === 'time') {
        scaleDef.nice = timeUnit || encoding.config('timeScaleNice');
      }else {
        scaleDef.nice = true;
      }
      break;
    case Y:
      if (scaleDef.type === 'ordinal') {
        scaleDef.range = layout.cellHeight ?
          (encDef.bin ? [layout.cellHeight, 0] : [0, layout.cellHeight]) :
          'height';
        scaleDef.bandWidth = encoding.bandSize(Y, layout.y.useSmallBand);
      } else {
        scaleDef.range = layout.cellHeight ? [layout.cellHeight, 0] : 'height';
      }

      scaleDef.round = true;

      if (scaleDef.type === 'time') {
        scaleDef.nice = timeUnit || encoding.config('timeScaleNice');
      }else {
        scaleDef.nice = true;
      }
      break;
    case ROW: // support only ordinal
      scaleDef.bandWidth = layout.cellHeight;
      scaleDef.round = true;
      scaleDef.nice = true;
      break;
    case COL: // support only ordinal
      scaleDef.bandWidth = layout.cellWidth;
      scaleDef.round = true;
      scaleDef.nice = true;
      break;
    case SIZE:
      if (encoding.is('bar')) {
        // FIXME this is definitely incorrect
        // but let's fix it later since bar size is a bad encoding anyway
        scaleDef.range = [3, Math.max(encoding.bandSize(X), encoding.bandSize(Y))];
      } else if (encoding.is(TEXT)) {
        scaleDef.range = [8, 40];
      } else { //point
        var bandSize = Math.min(encoding.bandSize(X), encoding.bandSize(Y)) - 1;
        scaleDef.range = [10, 0.8 * bandSize*bandSize];
      }
      scaleDef.round = true;
      break;
    case SHAPE:
      scaleDef.range = 'shapes';
      break;
    case COLOR:
      scaleDef.range = scale.color(scaleDef, encoding, stats);
      break;
    default:
      throw new Error('Unknown encoding name: '+ scaleDef.name);
  }

  // FIXME(kanitw): Jul 29, 2015 - consolidate this with above
  switch (scaleDef.name) {
    case ROW:
    case COL:
      scaleDef.padding = encoding.config('cellPadding');
      scaleDef.outerPadding = 0;
      break;
    case X:
    case Y:
      if (scaleDef.type === 'ordinal') { //&& !s.bandWidth
        scaleDef.points = true;
        scaleDef.padding = encoding.encDef(scaleDef.name).band.padding;
      }
  }

  return scaleDef;
};

scale.color = function(s, encoding, stats) {
  var colorScale = encoding.scale(COLOR),
    range = colorScale.range,
    cardinality = encoding.cardinality(COLOR, stats),
    type = encoding.type(COLOR);

  if (range === undefined) {
    var ordinalPalette = colorScale.ordinalPalette,
      quantitativeRange = colorScale.quantitativeRange;

    if (s.type === 'ordinal') {
      if (type === N) {
        // use categorical color scale
        if (cardinality <= 10) {
          range = colorScale.c10palette;
        } else {
          range = colorScale.c20palette;
        }
        return scale.color.palette(range, cardinality, type);
      } else {
        if (ordinalPalette) {
          return scale.color.palette(ordinalPalette, cardinality, type);
        }
        return scale.color.interpolate(quantitativeRange[0], quantitativeRange[1], cardinality);
      }
    } else { //time or quantitative
      return [quantitativeRange[0], quantitativeRange[1]];
    }
  }
};

scale.color.palette = function(range, cardinality, type) {
  // FIXME(kanitw): Jul 29, 2015 - check range is string
  switch (range) {
    case 'category10k':
      // tableau's category 10, ordered by perceptual kernel study results
      // https://github.com/uwdata/perceptual-kernels
      return ['#2ca02c', '#e377c2', '#7f7f7f', '#17becf', '#8c564b', '#d62728', '#bcbd22', '#9467bd', '#ff7f0e', '#1f77b4'];

    // d3/tableau category10/20/20b/20c
    case 'category10':
      return ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

    case 'category20':
      return ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];

    case 'category20b':
      return ['#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a', '#d6616b', '#e7969c', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6'];

    case 'category20c':
      return ['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc', '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9'];
  }

  // TODO add our own set of custom ordinal color palette

  if (range in colorbrewer) {
    var palette = colorbrewer[range];

    // if cardinality pre-defined, use it.
    if (cardinality in palette) return palette[cardinality];

    // if not, use the highest cardinality one for nominal
    if (type === N) {
      return palette[Math.max.apply(null, util.keys(palette))];
    }

    // otherwise, interpolate
    var ps = cardinality < 3 ? 3 : Math.max.apply(null, util.keys(palette)),
      from = 0 , to = ps - 1;
    // FIXME add config for from / to

    return scale.color.interpolate(palette[ps][from], palette[ps][to], cardinality);
  }

  return range;
};

scale.color.interpolate = function (start, end, cardinality) {

  var interpolator = interpolate(start, end);
  return util.range(cardinality).map(function(i) { return interpolator(i*1.0/(cardinality-1)); });
};
