// https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#11-ambient-declarations
declare var exports;

import {FieldDef} from '../schema/fielddef.schema';

import {contains, extend} from '../util';
import {Model} from './Model';
import {SHARED_DOMAIN_OPS} from '../aggregate';
import {COLUMN, ROW, X, Y, SHAPE, SIZE, COLOR, PATH, TEXT, DETAIL, Channel} from '../channel';
import {SOURCE, STACKED_SCALE} from '../data';
import {isDimension} from '../fielddef';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';
import {Mark, BAR, TEXT as TEXT_MARK, TICK} from '../mark';
import {rawDomain} from './time';

export function compileScales(channels: Channel[], model: Model) {
  return channels.filter(function(channel: Channel) {
      return channel !== DETAIL && channel !== PATH;
    })
    .map(function(channel: Channel) {
      const fieldDef = model.fieldDef(channel);

      var scaleDef: any = {
        name: model.scaleName(channel),
        type: type(fieldDef, channel, model.mark()),
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
        'outerPadding', 'padding', 'points'
      ].forEach(function(property) {
        // TODO include fieldDef as part of the parameters
        const value = exports[property](model, channel, scaleDef.type);
        if (value !== undefined) {
          scaleDef[property] = value;
        }
      });

      return scaleDef;
    });
}

export function type(fieldDef: FieldDef, channel: Channel, mark: Mark): string {
  if (channel === DETAIL || channel === PATH) {
    return null; // no scale for DETAIL and PATH
  }

  switch (fieldDef.type) {
    case NOMINAL:
      return 'ordinal';
    case ORDINAL:
      return 'ordinal';
    case TEMPORAL:
      if (channel === COLOR) {
        // FIXME(#890) if user specify scale.range as ordinal presets, then this should be ordinal.
        // Also, if we support color ramp, this should be ordinal too.
        return 'time'; // time has order, so use interpolated ordinal color scale.
      }
      if (contains([ROW, COLUMN, SHAPE], channel)) {
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
            // Returns ordinal if (1) the channel is X or Y, and
            // (2) is the dimension of BAR or TICK mark.
            // Otherwise return linear.
            return contains([BAR, TICK], mark) &&
              isDimension(fieldDef) ? 'ordinal' : 'time';
          default:
            // yearmonth, monthday, ...
            return 'ordinal';
        }
      }
      return 'time';

    case QUANTITATIVE:
      if (fieldDef.bin) {
        // TODO(#890): Ideally binned COLOR should be an ordinal scale
        // However, currently ordinal scale doesn't support color ramp yet.
        return contains([X, Y, COLOR], channel) ? 'linear' : 'ordinal';
      }
      if (fieldDef.scale.type !== undefined) {
        return fieldDef.scale.type;
      }
      return 'linear';
  }
}

export function domain(model: Model, channel:Channel, scaleType: string) {
  var fieldDef = model.fieldDef(channel);

  if (fieldDef.scale.domain) { // explicit value
    return fieldDef.scale.domain;
  }

  // special case for temporal scale
  if (fieldDef.type === TEMPORAL) {
    if (rawDomain(fieldDef.timeUnit, channel)) {
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

  // For stack, use STACKED data.
  var stack = model.stack();
  if (stack && channel === stack.fieldChannel) {
    if(stack.config.offset === 'normalize') {
      return [0, 1];
    }
    return {
      data: STACKED_SCALE,
      // STACKED_SCALE produces sum of the field's value e.g., sum of sum, sum of distinct
      field: model.field(channel, {prefn: 'sum_'})
    };
  }

  var useRawDomain = _useRawDomain(model, channel, scaleType);
  var sort = domainSort(model, channel, scaleType);

  if (useRawDomain) { // useRawDomain - only Q/T
    return {
      data: SOURCE,
      field: model.field(channel, {noAggregate: true})
    };
  } else if (fieldDef.bin) { // bin
    return scaleType === 'ordinal' ? {
      // ordinal bin scale takes domain from bin_range, ordered by bin_start
      data: model.dataTable(),
      field: model.field(channel, { binSuffix: '_range' }),
      sort: {
        field: model.field(channel, { binSuffix: '_start' }),
        op: 'min' // min or max doesn't matter since same _range would have the same _start
      }
    } : channel === COLOR ? {
      // Currently, binned on color uses linear scale and thus use _start point
      // TODO: This ideally should become ordinal scale once ordinal scale supports color ramp.
      data: model.dataTable(),
      field: model.field(channel, { binSuffix: '_start' })
    } : {
      // other linear bin scale merges both bin_start and bin_end for non-ordinal scale
      data: model.dataTable(),
      field: [
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

export function domainSort(model: Model, channel: Channel, scaleType: string): any {
  var sort = model.fieldDef(channel).sort;
  if (sort === 'ascending' || sort === 'descending') {
    return true;
  }

  // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
  if (scaleType === 'ordinal' && typeof sort !== 'string') {
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
function _useRawDomain (model: Model, channel: Channel, scaleType: string) {
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
      (fieldDef.type === TEMPORAL && scaleType === 'linear')
    );
}

export function bandWidth(model: Model, channel: Channel, scaleType: string) {
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

export function nice(model: Model, channel: Channel, scaleType: string) {
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

export function outerPadding(model: Model, channel: Channel, scaleType: string) {
  if (scaleType === 'ordinal') {
    if (model.fieldDef(channel).scale.outerPadding !== undefined) {
      return model.fieldDef(channel).scale.outerPadding; // explicit value
    }
  }
  return undefined;
}

export function padding(model: Model, channel: Channel, scaleType: string) {
  if (scaleType === 'ordinal' && channel !== ROW && channel !== COLUMN) {
    return model.fieldDef(channel).scale.padding;
  }
  return undefined;
}

export function points(model: Model, channel: Channel, scaleType: string) {
  if (scaleType === 'ordinal') {
    switch (channel) {
      case X:
      case Y:
        return true;
    }
  }
  return undefined;
}


export function rangeMixins(model: Model, channel: Channel, scaleType: string): any {
  var fieldDef = model.fieldDef(channel);

  if (scaleType === 'ordinal' && fieldDef.scale.bandWidth) {
    return {bandWidth: fieldDef.scale.bandWidth};
  }

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
      return {rangeMin: model.layout().cellHeight, rangeMax: 0};
    case SIZE:
      if (model.is(BAR)) {
        // TODO: determine bandSize for bin, which actually uses linear scale
        const dimension = model.config().mark.orient === 'horizontal' ? Y : X;
        return {range: [2, model.fieldDef(dimension).scale.bandWidth]};
      } else if (model.is(TEXT_MARK)) {
        return {range: [8, 40]};
      } else { // point, square, circle
        const xIsMeasure = model.isMeasure(X);
        const yIsMeasure = model.isMeasure(Y);

        const bandWidth = xIsMeasure !== yIsMeasure ?
          model.fieldDef(xIsMeasure ? Y : X).scale.bandWidth :
          Math.min(model.fieldDef(X).scale.bandWidth, model.fieldDef(Y).scale.bandWidth);

        return {range: [10, (bandWidth - 2) * (bandWidth - 2)]};
      }
    case SHAPE:
      return {range: 'shapes'};
    case COLOR:
      if (fieldDef.type === NOMINAL
        || fieldDef.type === ORDINAL // FIXME remove this once we support color ramp for ordinal
      ) {
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
