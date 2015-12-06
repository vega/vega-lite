// https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#11-ambient-declarations
declare var exports;

import {extend} from '../util';
import {Model} from './Model';
import {SHARED_DOMAIN_OPS} from '../aggregate';
import {COLUMN, ROW, X, Y, SHAPE, SIZE, COLOR, TEXT, Channel} from '../channel';
import {SOURCE, STACKED} from '../data';
import * as time from './time';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';
import {BAR, TEXT as TEXT_MARK} from '../mark';

export function compileScales(names: Array<Channel>, model: Model) {
  return names.reduce(function(a, channel: Channel) {
    var scaleDef: any = {
      name: channel,
      type: type(channel, model),
    };

    scaleDef.domain = domain(model, channel, scaleDef.type);
    extend(scaleDef, rangeMixins(model, channel, scaleDef.type));

    // Add optional properties
    [
      // general properties
      'reverse', 'round',
      // quantitative / time
      'clamp', 'nice',
      // quantitative
      'exponent', 'zero',
      // ordinal
      'bandWidth', 'outerPadding', 'padding', 'points'
    ].forEach(function(property) {
      // TODO include fieldDef as part of the parameters
      var value = exports[property](model, channel, scaleDef.type);
      if (value !== undefined) {
        scaleDef[property] = value;
      }
    });

    return (a.push(scaleDef), a);
  }, []);
}

export function type(channel: Channel, model: Model): string {
  const fieldDef = model.fieldDef(channel);
  switch (fieldDef.type) {
    case NOMINAL: // fall through
      return 'ordinal';
    case ORDINAL:
      let range = fieldDef.scale.range;
      return channel === COLOR && (typeof range !== 'string') ? 'linear' : 'ordinal';
    case TEMPORAL:
      return time.scale.type(fieldDef.timeUnit, channel);
    case QUANTITATIVE:
      if (fieldDef.bin) {
        return channel === ROW || channel === COLUMN || channel === SHAPE ? 'ordinal' : 'linear';
      }
      return fieldDef.scale.type;
  }
}

export function domain(model: Model, channel:Channel, type) {
  var fieldDef = model.fieldDef(channel);

  if (fieldDef.scale.domain) { // explicit value
    return fieldDef.scale.domain;
  }

  // special case for temporal scale
  if (fieldDef.type === TEMPORAL) {
    var range = time.scale.domain(fieldDef.timeUnit, channel);
    if (range) { return range; }
  }

  // For stack, use STACKED data.
  var stack = model.stack();
  if (stack && channel === stack.fieldChannel) {
    const facet = model.has(ROW) || model.has(COLUMN);
    return {
      data: STACKED,
      field: model.field(channel, {
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
      field: model.field(channel, {noAggregate:true})
    };
  } else if (fieldDef.bin) { // bin

    return {
      data: model.dataTable(),
      field: type === 'ordinal' ?
        // ordinal scale only use bin start for now
        model.field(channel, { binSuffix: '_start' }) :
        // need to merge both bin_start and bin_end for non-ordinal scale
        [
          model.field(channel, { binSuffix: '_start' }),
          model.field(channel, { binSuffix: '_end' })
        ]
    };
  } else if (sort) { // have sort -- only for ordinal
    return {
      // If sort by aggregation of a specified sort field, we need to use SOURCE table,
      // so we can aggregate values for the scale independently from the main aggregation.
      data: sort.op ? SOURCE : model.dataTable(),
      field: model.field(channel),
      sort: sort
    };
  } else {
    return {
      data: model.dataTable(),
      field: model.field(channel)
    };
  }
}

export function domainSort(model: Model, channel: Channel, type):any {
  var sort = model.fieldDef(channel).sort;
  if (sort === 'ascending' || sort === 'descending') {
    return true;
  }

  // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
  if (type === 'ordinal' && typeof sort !== 'string') {
    return {
      op: sort.op,
      field: sort.field
    };
  }
  return undefined;
}

export function reverse(model: Model, channel: Channel) {
  var sort = model.fieldDef(channel).sort;
  return sort && (typeof sort === 'string' ?
                    sort === 'descending' :
                    sort.order === 'descending'
                 ) ? true : undefined;
}

/**
 * Determine if useRawDomain should be activated for this scale.
 * @return {Boolean} Returns true if all of the following conditons applies:
 * 1. `useRawDomain` is enabled either through scale or config
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
export function _useRawDomain (model: Model, channel: Channel) {
  const fieldDef = model.fieldDef(channel);

  return fieldDef.scale.useRawDomain && //  if useRawDomain is enabled
    // only applied to aggregate table
    fieldDef.aggregate &&
    // only activated if used with aggregate functions that produces values ranging in the domain of the source data
    SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate) >= 0 &&
    (
      // Q always uses quantitative scale except when it's binned.
      // Binned field has similar values in both the source table and the summary table
      // but the summary table has fewer values, therefore binned fields draw
      // domain values from the summary table.
      (fieldDef.type === QUANTITATIVE && !fieldDef.bin) ||
      // T uses non-ordinal scale when there's no unit or when the unit is not ordinal.
      (fieldDef.type === TEMPORAL &&
        (!fieldDef.timeUnit || time.scale.type(fieldDef.timeUnit, channel) === 'linear')
      )
    );
}

export function bandWidth(model: Model, channel: Channel, scaleType) {
  if (scaleType === 'ordinal') {
    return model.fieldDef(channel).scale.bandWidth;
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

export function nice(model: Model, channel: Channel, scaleType) {
  if (model.fieldDef(channel).scale.nice !== undefined) {
    // explicit value
    return model.fieldDef(channel).scale.nice;
  }

  switch (channel) {
    case X: /* fall through */
    case Y:
      if (scaleType === 'time' || scaleType === 'ordinal') {
        return undefined;
      }
      return true;

    case ROW: /* fall through */
    case COLUMN:
      return true;
  }
  return undefined;
}

export function outerPadding(model: Model, channel: Channel, scaleType) {
  if (scaleType === 'ordinal') {
    if (model.fieldDef(channel).scale.outerPadding !== undefined) {
      return model.fieldDef(channel).scale.outerPadding; // explicit value
    }
  }
  return undefined;
}

export function padding(model: Model, channel: Channel, scaleType) {
  if (scaleType === 'ordinal') {
    // Both explicit and non-explicit values are handled by the helper method.
    return model.fieldDef(channel).scale.padding;
  }
  return undefined;
}

export function points(model: Model, channel: Channel, scaleType) {
  if (scaleType === 'ordinal') {
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


export function rangeMixins(model: Model, channel: Channel, scaleType): any {
  var fieldDef = model.fieldDef(channel);

  if (fieldDef.scale.range) { // explicit value
    return {range: fieldDef.scale.range};
  }

  switch (channel) {
    case X:
      // we can't use {range: "width"} here since we put scale in the root group
      // not inside the cell, so scale is reusable for axes group
      return {rangeMin: 0, rangeMax: model.layout().cellWidth};
    case Y:
      // We can't use {range: "height"} here for the same reason
      if (scaleType === 'ordinal') {
        return {rangeMin: 0, rangeMax: model.layout().cellHeight};
      }
      return {rangeMin: model.layout().cellHeight, rangeMax :0};
    case SIZE:
      if (model.is(BAR)) {
        // FIXME this is definitely incorrect
        // but let's fix it later since bar size is a bad encoding anyway
        return {
          range: [3, Math.max(
            model.fieldDef(X).scale.bandWidth,
            model.fieldDef(Y).scale.bandWidth
          )]
        };
      } else if (model.is(TEXT_MARK)) {
        return {range: [8, 40]};
      }
      // else -- point
      var bandWidth = Math.min(model.fieldDef(X).scale.bandWidth, model.fieldDef(Y).scale.bandWidth) - 1;
      return {range: [10, 0.8 * bandWidth*bandWidth]};
    case SHAPE:
      return {range: 'shapes'};
    case COLOR:
      if (scaleType === 'ordinal') {
        return {range: 'category10'};
      } else { // time or quantitative
        return {range: ['#AFC6A3', '#09622A']}; // tableau greens
      }
    case ROW:
      return {range: 'height'};
    case COLUMN:
      return {range: 'width'};
  }
  return {};
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
    case COLUMN:
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
