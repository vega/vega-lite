/// <reference path="../../typings/colorbrewer.d.ts"/>
/// <reference path="../../typings/d3-color.d.ts"/>

// https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#11-ambient-declarations
declare var exports;

import * as colorbrewer from 'colorbrewer';
import {interpolateHsl} from 'd3-color';

import * as util from '../util';
import {Model} from './Model';
import {COL, ROW, X, Y, SHAPE, SIZE, COLOR, TEXT, Channel} from '../channel';
import {SOURCE, STACKED} from '../data';
import * as time from './time';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';

export function names(props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    if (props[x] && props[x].scale) a[props[x].scale] = 1;
    return a;
  }, {}));
}

export function defs(names: Array<string>, model: Model, layout, stats, facet?) {
  return names.reduce(function(a, channel: Channel) {
    var scaleDef: any = {};

    scaleDef.name = channel;
    var t = scaleDef.type = type(channel, model);
    scaleDef.domain = domain(model, channel, t, facet);

    // Add optional properties
    [
      // general properties
      'range', 'reverse', 'round',
      // quantitative / time
      'clamp', 'nice',
      // quantitative
      'exponent', 'zero',
      // ordinal
      'bandWidth', 'outerPadding', 'padding', 'points'
    ].forEach(function(property) {
      var value = exports[property](model, channel, t, layout, stats);
      if (value !== undefined) {
        scaleDef[property] = value;
      }
    });

    return (a.push(scaleDef), a);
  }, []);
}

export function type(channel: Channel, model: Model) {
  var type = model.fieldDef(channel).type;
  switch (type) {
    case NOMINAL: //fall through
    case ORDINAL:
      return 'ordinal';
    case TEMPORAL:
      var timeUnit = model.fieldDef(channel).timeUnit;
      return timeUnit ? time.scale.type(timeUnit, channel) : 'time';
    case QUANTITATIVE:
      if (model.bin(channel)) {
        return channel === ROW || channel === COL || channel === SHAPE ? 'ordinal' : 'linear';
      }
      return model.scale(channel).type;
  }
}

export function domain(model: Model, channel:Channel, type, facet:boolean = false) {
  var fieldDef = model.fieldDef(channel);

  if (fieldDef.scale.domain) { // explicit value
    return fieldDef.scale.domain;
  }

  // special case for temporal scale
  if (fieldDef.type === TEMPORAL) {
    var range = time.scale.domain(fieldDef.timeUnit, channel);
    if (range) return range;
  }

  // For stack, use STACKED data.
  var stack = model.stack();
  if (stack && channel === stack.value) {
    return {
      data: STACKED,
      field: model.fieldRef(channel, {
        // If faceted, scale is determined by the max of sum in each facet.
        prefn: (facet ? 'max_' : '') + 'sum_'
      })
    };
  }

  var useRawDomain = _useRawDomain(model, channel);
  var sort = domainSort(model, channel, type);

  if (useRawDomain) { // useRawDomain - only Q/T
    return {
      data: SOURCE,
      field: model.fieldRef(channel, {noAggregate:true})
    };
  } else if (fieldDef.bin) { // bin

    return {
      data: model.dataTable(),
      field: type === 'ordinal' ?
        // ordinal scale only use bin start for now
        model.fieldRef(channel, { binSuffix: '_start' }) :
        // need to merge both bin_start and bin_end for non-ordinal scale
        [
          model.fieldRef(channel, { binSuffix: '_start' }),
          model.fieldRef(channel, { binSuffix: '_end' })
        ]
    };
  } else if (sort) { // have sort -- only for ordinal
    return {
      // If sort by aggregation of a specified sort field, we need to use SOURCE table,
      // so we can aggregate values for the scale independently from the main aggregation.
      data: sort.op ? SOURCE : model.dataTable(),
      field: model.fieldRef(channel),
      sort: sort
    };
  } else {
    return {
      data: model.dataTable(),
      field: model.fieldRef(channel)
    };
  }
}

export function domainSort(model: Model, channel: Channel, type):any {
  var sort = model.fieldDef(channel).sort;
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
}

export function reverse(model: Model, channel: Channel) {
  var sort = model.fieldDef(channel).sort;
  return sort && (sort === 'descending' || (sort.order === 'descending')) ? true : undefined;
}

var sharedDomainAggregate = ['mean', 'average', 'stdev', 'stdevp', 'median', 'q1', 'q3', 'min', 'max'];

/**
 * Determine if useRawDomain should be activated for this scale.
 * @return {Boolean} Returns true if all of the following conditons applies:
 * 1. `useRawDomain` is enabled either through scale or config
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
export function _useRawDomain (model: Model, channel: Channel) {
  var fieldDef = model.fieldDef(channel);

  // scale value
  var scaleUseRawDomain = model.scale(channel).useRawDomain;

  // Determine if useRawDomain is enabled. If scale value is specified, use scale value.
  // Otherwise, use config value.
  var useRawDomainEnabled = scaleUseRawDomain !== undefined ?
      scaleUseRawDomain : model.config('useRawDomain');

  return  useRawDomainEnabled &&
    // only applied to aggregate table
    fieldDef.aggregate &&
    // only activated if used with aggregate functions that produces values ranging in the domain of the source data
    sharedDomainAggregate.indexOf(fieldDef.aggregate) >= 0 &&
    (
      // Q always uses quantitative scale except when it's binned.
      // Binned field has similar values in both the source table and the summary table
      // but the summary table has fewer values, therefore binned fields draw
      // domain values from the summary table.
      (fieldDef.type === QUANTITATIVE && !fieldDef.bin) ||
      // T uses non-ordinal scale when there's no unit or when the unit is not ordinal.
      (fieldDef.type === TEMPORAL &&
        (!fieldDef.timeUnit || !time.isOrdinalFn(fieldDef.timeUnit))
      )
    );
}

export function bandWidth(model: Model, channel: Channel, type, layout) {
  // TODO: eliminate layout

  switch (channel) {
    case X: /* fall through */
    case Y:
      if (type === 'ordinal') {
        return model.bandWidth(channel, layout[channel].useSmallBand);
      }
      break;
    case ROW: // support only ordinal
      return layout.cellHeight;
    case COL: // support only ordinal
      return layout.cellWidth;
  }
  return undefined;
}

export function clamp(model: Model, channel: Channel) {
  // only return value if explicit value is specified.
  return model.fieldDef(channel).scale.clamp;
}

export function exponent(model: Model, channel: Channel) {
  // only return value if explicit value is specified.
  return model.fieldDef(channel).scale.exponent;
}

export function nice(model: Model, channel: Channel, type) {
  if (model.fieldDef(channel).scale.nice !== undefined) {
    // explicit value
    return model.fieldDef(channel).scale.nice;
  }

  switch (channel) {
    case X: /* fall through */
    case Y:
      if (type === 'time' || type === 'ordinal') {
        return undefined;
      }
      return true;

    case ROW: /* fall through */
    case COL:
      return true;
  }
  return undefined;
}

export function outerPadding(model: Model, channel: Channel, type) {
  if (type === 'ordinal') {
    if (model.fieldDef(channel).scale.outerPadding !== undefined) {
      return model.fieldDef(channel).scale.outerPadding; // explicit value
    }
    if (channel === ROW || channel === COL) {
      return 0;
    }
  }
  return undefined;
}

export function padding(model: Model, channel: Channel, type) {
  if (type === 'ordinal') {
    // Both explicit and non-explicit values are handled by the helper method.
    return model.padding(channel);
  }
  return undefined;
}

export function points(model: Model, channel: Channel, type) {
  if (type === 'ordinal') {
    if (model.fieldDef(channel).scale.points !== undefined) {
      // explicit value
      return model.fieldDef(channel).scale.points;
    }

    switch (channel) {
      case X:
      case Y:
        return true;
    }
  }
  return undefined;
}


export function range(model: Model, channel: Channel, type, layout, stats) {
  var fieldDef = model.fieldDef(channel);

  if (fieldDef.scale.range) { // explicit value
    return fieldDef.scale.range;
  }

  switch (channel) {
    case X:
      return layout.cellWidth ? [0, layout.cellWidth] : 'width';
    case Y:
      if (type === 'ordinal') {
        return layout.cellHeight ?
          (fieldDef.bin ? [layout.cellHeight, 0] : [0, layout.cellHeight]) :
          'height';
      }
      return layout.cellHeight ? [layout.cellHeight, 0] : 'height';
    case SIZE:
      if (model.is('bar')) {
        // FIXME this is definitely incorrect
        // but let's fix it later since bar size is a bad encoding anyway
        return [3, Math.max(model.bandWidth(X), model.bandWidth(Y))];
      } else if (model.is(TEXT)) {
        return [8, 40];
      }
      // else -- point
      var bandWidth = Math.min(model.bandWidth(X), model.bandWidth(Y)) - 1;
      return [10, 0.8 * bandWidth*bandWidth];
    case SHAPE:
      return 'shapes';
    case COLOR:
      return color(model, channel, type, stats);
  }

  return undefined;
}

export function round(model: Model, channel: Channel) {
  if (model.fieldDef(channel).scale.round !== undefined) {
    return model.fieldDef(channel).scale.round;
  }

  // FIXME: revise if round is already the default value
  switch (channel) {
    case X: /* fall through */
    case Y:
    case ROW:
    case COL:
    case SIZE:
      return true;
  }
  return undefined;
}

export function zero(model: Model, channel: Channel) {
  var fieldDef = model.fieldDef(channel);
  var timeUnit = fieldDef.timeUnit;

  if (fieldDef.scale.zero !== undefined) {
    // explicit value
    return fieldDef.scale.zero;
  }

  if (fieldDef.type === TEMPORAL) {
    if (timeUnit === 'year') {
      // year is using linear scale, but should not include zero
      return false;
    }
    // If there is no timeUnit or the timeUnit uses ordinal scale,
    // zero property is ignored by vega so we should not generate them any way
    return undefined;
  }
  if (fieldDef.bin) {
    // Returns false (undefined) by default of bin
    return false;
  }

  return channel === X || channel === Y ?
    // if not bin / temporal, returns undefined for X and Y encoding
    // since zero is true by default in vega for linear scale
    undefined :
    false;
}

export function color(model: Model, channel: Channel, scaleType, stats) {
  var colorScale = model.scale(COLOR),
    range = colorScale.range,
    cardinality = model.cardinality(COLOR, stats),
    type = model.fieldDef(COLOR).type;

  if (range === undefined) {
    var ordinalPalette = colorScale.ordinalPalette,
      quantitativeRange = colorScale.quantitativeRange;

    if (scaleType === 'ordinal') {
      if (type === NOMINAL) {
        // use categorical color scale
        if (cardinality <= 10) {
          range = colorScale.c10palette;
        } else {
          range = colorScale.c20palette;
        }
        return colors.palette(range, cardinality, type);
      } else {
        if (ordinalPalette) {
          return colors.palette(ordinalPalette, cardinality, type);
        }
        return colors.interpolate(quantitativeRange[0], quantitativeRange[1], cardinality);
      }
    } else { //time or quantitative
      return [quantitativeRange[0], quantitativeRange[1]];
    }
  }
}

export namespace colors {
  export function palette(range, cardinality?, type?: String) {
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
      if (type === NOMINAL) {
        return palette[Math.max.apply(null, util.keys(palette))];
      }

      // otherwise, interpolate
      var ps = cardinality < 3 ? 3 : Math.max.apply(null, util.keys(palette)),
        from = 0 , to = ps - 1;
      // FIXME add config for from / to

      return colors.interpolate(palette[ps][from], palette[ps][to], cardinality);
    }

    return range;
  }

  export function interpolate(start, end, cardinality) {
    var interpolator = interpolateHsl(start, end);
    return util.range(cardinality).map(function(i) { return interpolator(i*1.0/(cardinality-1)); });
  }
}
