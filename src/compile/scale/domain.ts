
import {SHARED_DOMAIN_OPS} from '../../aggregate';
import {Channel} from '../../channel';
import {SOURCE} from '../../data';
import {DateTime, isDateTime, timestamp} from '../../datetime';
import {Scale, ScaleType, hasDiscreteDomain} from '../../scale';
import {isSortField, SortOrder} from '../../sort';
import {StackOffset} from '../../stack';

import * as util from '../../util';

import {Model} from '../model';

export default function domain(scale: Scale, model: Model, channel:Channel): any {
  const fieldDef = model.fieldDef(channel);

  if (scale.domain) { // explicit value
    if (isDateTime(scale.domain[0])) {
      return (scale.domain as DateTime[]).map((dt) => {
        return timestamp(dt, true);
      });
    }
    return scale.domain;
  }

  // special case for temporal scale
  if (fieldDef.type === 'temporal') {
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
  const stack = model.stack();
  if (stack && channel === stack.fieldChannel) {
    if(stack.offset === StackOffset.NORMALIZE) {
      return [0, 1];
    }
    return {
      data: model.dataName('stacked'),
      fields: [
        model.field(channel, {suffix: 'start'}),
        model.field(channel, {suffix: 'end'})
      ]
    };
  }

  // FIXME refactor _useRawDomain's signature
  const useRawDomain = _useRawDomain(scale, model, channel);

  const sort = domainSort(model, channel, scale.type);

  if (useRawDomain) { // useRawDomain - only Q/T
    return {
      data: SOURCE,
      field: model.field(channel, {
        // no aggregate rather than nofn as bin and timeUnit is fine
        noAggregate: true
      })
    };
  } else if (fieldDef.bin) { // bin
    if (hasDiscreteDomain(scale.type)) {
      // ordinal bin scale takes domain from bin_range, ordered by bin_start
      // This is useful for both axis-based scale (x, y, column, and row) and legend-based scale (other channels).
      return {
        data: model.dataTable(),
        field: model.field(channel, { binSuffix: 'range' }),
        sort: {
          field: model.field(channel, { binSuffix: 'start' }),
          op: 'min' // min or max doesn't matter since same _range would have the same _start
        }
      };
    } else { // continuous scales
      if (channel === 'x' || channel === 'y') {
        // X/Y position have to include start and end for non-ordinal scale
        return {
          data: model.dataTable(),
          fields: [
            model.field(channel, { binSuffix: 'start' }),
            model.field(channel, { binSuffix: 'end' })
          ]
        };
      } else {
        // TODO: use bin_mid
        return {
          data: model.dataTable(),
          field: model.field(channel, { binSuffix: 'start' })
        };
      }
    }
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
      field: model.field(channel),
    };
  }
}

export function domainSort(model: Model, channel: Channel, scaleType: ScaleType): any {
  if (!hasDiscreteDomain(scaleType)) {
    return undefined;
  }

  const sort = model.sort(channel);

  // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
  if (isSortField(sort)) {
    return {
      op: sort.op,
      field: sort.field
    };
  }

  if (util.contains([SortOrder.ASCENDING, SortOrder.DESCENDING, undefined /* default =ascending*/], sort)) {
    return true;
  }

  // sort === 'none'
  return undefined;
}

/**
 * Determine if useRawDomain should be activated for this scale.
 * @return {Boolean} Returns true if all of the following conditons applies:
 * 1. `useRawDomain` is enabled either through scale or config
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
function _useRawDomain (scale: Scale, model: Model, channel: Channel) {
  const fieldDef = model.fieldDef(channel);

  return scale.useRawDomain && //  if useRawDomain is enabled
    // only applied to aggregate table
    fieldDef.aggregate &&
    // only activated if used with aggregate functions that produces values ranging in the domain of the source data
    SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate as any) >= 0 &&
    (
      // Q always uses quantitative scale except when it's binned.
      // Binned field has similar values in both the source table and the summary table
      // but the summary table has fewer values, therefore binned fields draw
      // domain values from the summary table.
      // Meanwhile, we rely on non-positive filter inside summary data source, thus
      // we can't use raw domain to feed into log scale
      // FIXME(https://github.com/vega/vega-lite/issues/1537):
      // consider allowing useRawDomain for log scale once we reimplement data sources
      (fieldDef.type === 'quantitative' && !fieldDef.bin && scale.type !== ScaleType.LOG) ||
      // T uses non-ordinal scale when there's no unit or when the unit is not ordinal.
      (fieldDef.type === 'temporal' && util.contains([ScaleType.TIME, ScaleType.UTC], scale.type))
    );
}
