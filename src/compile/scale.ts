import * as log from '../log';

import {SHARED_DOMAIN_OPS} from '../aggregate';
import {COLUMN, ROW, X, Y, X2, Y2, SHAPE, SIZE, COLOR, OPACITY, TEXT, hasScale, supportScaleType, Channel} from '../channel';
import {SOURCE, STACKED_SCALE} from '../data';
import {DateTime, isDateTime, timestamp} from '../datetime';
import {ChannelDefWithScale, FieldDef, field} from '../fielddef';
import {Mark, BAR, TEXT as TEXTMARK, RECT, RULE, TICK} from '../mark';
import {Scale, ScaleConfig, ScaleType, NiceTime, BANDSIZE_FIT, BandSize, isDiscreteScale, scaleTypeSupportProperty} from '../scale';
import {isSortField, SortOrder} from '../sort';
import {StackOffset} from '../stack';
import {TimeUnit} from '../timeunit';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';
import {contains, extend, Dict} from '../util';
import {VgScale} from '../vega.schema';

import {Model} from './model';
import {smallestUnit} from '../timeunit';
import {UnitModel} from './unit';

/**
 * Color Ramp's scale for legends.  This scale has to be ordinal so that its
 * legends show a list of numbers.
 */
export const COLOR_LEGEND = 'color_legend';

// scale used to get labels for binned color scales
export const COLOR_LEGEND_LABEL = 'color_legend_label';


// FIXME: With layer and concat, scaleComponent should decompose between
// ScaleSignature and ScaleDomain[].
// Basically, if two unit specs has the same scale, signature for a particular channel,
// the scale can be unioned by combining the domain.
export type ScaleComponent = VgScale;

export type ScaleComponents = {
  main: ScaleComponent;
  colorLegend?: ScaleComponent,
  binColorLegend?: ScaleComponent
}

export function channelScalePropertyIncompatability(channel: Channel, propName: string): string {
  switch (propName) {
    case 'range':
      // User should not customize range for position and facet channel directly.
      if (channel === X || channel === Y) {
        return log.message.CANNOT_USE_RANGE_WITH_POSITION;
      }
      if (channel === ROW || channel === COLUMN) {
        return log.message.cannotUseRangeOrBandSizePropertyWithFacet('range');
      }
      return undefined; // GOOD!
    // band / point
    case 'bandSize':
      if (channel === ROW || channel === COLUMN) {
        return log.message.cannotUseRangeOrBandSizePropertyWithFacet('bandSize');
      }
      return undefined; // GOOD!
    case 'padding':
      if (channel === ROW || channel === COLUMN) {
        /*
         * We do not use d3 scale's padding for row/column because padding there
         * is a ratio ([0, 1]) and it causes the padding to be decimals.
         * Therefore, we manually calculate "spacing" in the layout by ourselves.
         */
        return log.message.CANNOT_USE_PADDING_WITH_FACET;
      }
      return undefined; // GOOD!
    case 'scheme':
      if (channel !== COLOR) {
        return log.message.CANNOT_USE_SCHEME_WITH_NON_COLOR;
      }
      return undefined;
    case 'type':
    case 'domain':
    case 'round':
    case 'clamp':
    case 'exponent':
    case 'nice':
    case 'zero':
    case 'useRawDomain':
      // These channel do not have strict requirement
      return undefined; // GOOD!
  }
  /* istanbul ignore next: it should never reach here */
  throw new Error('Invalid scale property "${propName}".');
}


export function initScale(topLevelSize: number | undefined, mark: Mark | undefined,
    channel: Channel, fieldDef: ChannelDefWithScale, scaleConfig: ScaleConfig): Scale {
  let specifiedScale = (fieldDef || {}).scale || {};
  let scale: Scale = {};

  const rangeProperties: any[] = ((scale.bandSize ? ['bandSize'] : []) as any[]).concat(
    scale.scheme ? ['scheme'] : [],
    scale.range ? ['range'] : []
  );

  if (rangeProperties.length > 1) {
    log.warn(log.message.mutuallyExclusiveScaleProperties(rangeProperties));
  }

  // initialize bandSize as if it's an ordinal scale first since ordinal scale type depends on this.
  const size = bandSize(specifiedScale.bandSize, topLevelSize, mark, channel, scaleConfig);
  scale.type = type(specifiedScale.type, fieldDef, channel, mark, !!size);

  if ((scale.type === ScaleType.POINT || scale.type === ScaleType.BAND)) {
    if (size !== undefined) {
      scale.bandSize = size;
    }
  } else if (specifiedScale.bandSize !== undefined) {
    log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, 'bandSize', channel));
  }

  // Use specified value if compatible or determine default values for each property
  [
    // general properties
    'domain', // For domain, we only copy specified value here.  Default value is determined during parsing phase.
    'round',
    // quantitative / time
    'clamp', 'nice',
    // quantitative
    'exponent', 'zero', // zero depends on domain
    // ordinal
    'padding', // padding

    // FIXME: useRawDomain should not be included here as it is not really a Vega scale property
    'useRawDomain'
  ].forEach(function(property) {
    const specifiedValue = specifiedScale[property];

    let supportedByScaleType = scaleTypeSupportProperty(scale.type, property);
    const channelIncompatability = channelScalePropertyIncompatability(channel, property);

    if (specifiedValue !== undefined) {
      // If there is a specified value, check if it is compatible with scale type and channel
      if (!supportedByScaleType) {
        log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, property, channel));
      } else if (channelIncompatability) { // channel
        log.warn(channelIncompatability);
      } else {
        scale[property] = specifiedValue;
      }
      return;
    } else {
      // If there is no property specified, check if we need to determine default value.
      if (supportedByScaleType && channelIncompatability === undefined) {
        let value: any;

        // If we have default rule-base, determine default value first
        if (property === 'nice') {
          value = defaultProperty.nice(scale.type, channel, fieldDef);
        } else if (property === 'padding') {
          value = defaultProperty.padding(scale.type, channel, scaleConfig);
        } else if (property === 'zero') {
          value = defaultProperty.zero(scale, channel, fieldDef);
        } else {
          value = scaleConfig[property];
        }

        if (value !== undefined) { // use the default value
          scale[property] = value;
        }
      }
    }

  });
  return scale;
}

export function parseScaleComponent(model: Model): Dict<ScaleComponents> {
  // TODO: should model.channels() inlcude X2/Y2?
  return model.channels().reduce(function(scale: Dict<ScaleComponents>, channel: Channel) {
      if (model.scale(channel)) {
        const fieldDef = model.fieldDef(channel);
        const scales: ScaleComponents = {
          main: parseMainScale(model, fieldDef, channel)
        };

        // Add additional scales needed to support ordinal legends (list of values)
        // for color ramp.
        if (channel === COLOR && model.legend(COLOR) && (fieldDef.type === ORDINAL || fieldDef.bin || fieldDef.timeUnit)) {
          scales.colorLegend = parseColorLegendScale(model, fieldDef);
          if (fieldDef.bin) {
            scales.binColorLegend = parseBinColorLegendLabel(model, fieldDef);
          }
        }

        scale[channel] = scales;
      }
      return scale;
    }, {} as Dict<ScaleComponents>);
}

// TODO: consider return type of this method
// maybe we should just return domain as we can have the rest of scale (ScaleSignature constant)
/**
 * Return the main scale for each channel.  (Only color can have multiple scales.)
 */
function parseMainScale(model: Model, fieldDef: FieldDef, channel: Channel) {
  const scale = model.scale(channel);
  const sort = model.sort(channel);

  let scaleDef: any = extend({
    name: model.scaleName(channel + '', true),
  }, scale);
  // FIXME refactor initScale to remove useRawDomain to avoid this hack
  // HACK: useRawDomain isn't really a Vega scale output
  delete scaleDef.useRawDomain;

  // If channel is either X or Y then union them with X2 & Y2 if they exist
  if (channel === X && model.has(X2)) {
    if (model.has(X)) {
      scaleDef.domain = { fields: [domain(scale, model, X), domain(scale, model, X2)] };
    } else {
      scaleDef.domain = domain(scale, model, X2);
    }
  } else if (channel === Y && model.has(Y2)) {
    if (model.has(Y)) {
      scaleDef.domain = { fields: [domain(scale, model, Y), domain(scale, model, Y2)] };
    } else {
      scaleDef.domain = domain(scale, model, Y2);
    }
  } else {
    scaleDef.domain = domain(scale, model, channel);
  }

  // TODO: move range to init, make it come after zero (rangeMixins depends on zero).
  extend(scaleDef, rangeMixins(scale, model, channel));

  if (sort && (isSortField(sort) ? sort.order : sort) === SortOrder.DESCENDING) {
    scaleDef.reverse = true;
  }

  return scaleDef;
}

/**
 *  Return a scale  for producing ordinal scale for legends.
 *  - For an ordinal field, provide an ordinal scale that maps rank values to field value
 *  - For a field with bin or timeUnit, provide an identity ordinal scale
 *    (mapping the field values to themselves)
 */
function parseColorLegendScale(model: Model, fieldDef: FieldDef): ScaleComponent {
  return {
    name: model.scaleName(COLOR_LEGEND, true),
    type: ScaleType.ORDINAL_LOOKUP,
    domain: {
      data: model.dataTable(),
      // use rank_<field> for ordinal type, for bin and timeUnit use default field
      field: model.field(COLOR, (fieldDef.bin || fieldDef.timeUnit) ? {} : {prefix: 'rank'}),
      sort: true
    },
    range: {data: model.dataTable(), field: model.field(COLOR), sort: true}
  };
}

/**
 *  Return an additional scale for bin labels because we need to map bin_start to bin_range in legends
 */
function parseBinColorLegendLabel(model: Model, fieldDef: FieldDef): ScaleComponent {
  return {
    name: model.scaleName(COLOR_LEGEND_LABEL, true),
    type: ScaleType.ORDINAL_LOOKUP,
    domain: {
      data: model.dataTable(),
      field: model.field(COLOR),
      sort: true
    },
    range: {
      data: model.dataTable(),
      field: field(fieldDef, {binSuffix: 'range'}),
      sort: {
        field: model.field(COLOR, { binSuffix: 'start' }),
        op: 'min' // min or max doesn't matter since same _range would have the same _start
      }
    }
  };
}

/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
export function type(specifiedType: ScaleType, fieldDef: FieldDef, channel: Channel, mark: Mark, canHaveBandSize: boolean): ScaleType {
  if (!hasScale(channel)) {
    // There is no scale for these channels
    return null;
  }

  if (specifiedType !== undefined) {
    // Check if explicitly specified scale type is supported by the channel
    if (supportScaleType(channel, specifiedType)) {
      return specifiedType;
    } else {
      const newScaleType = defaultProperty.type(fieldDef, channel, mark, canHaveBandSize);
      log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, newScaleType));
      return newScaleType;
    }
  }

  return defaultProperty.type(fieldDef, channel, mark, canHaveBandSize);
}

export namespace defaultProperty {
  /**
   * Determine appropriate default scale type.
   */
  export function type(fieldDef: FieldDef, channel: Channel, mark: Mark, canHaveBandSize: boolean): ScaleType {
    if (contains([ROW, COLUMN], channel)) {
      return ScaleType.BAND;
    }
    if (channel === SHAPE) {
      return ScaleType.ORDINAL_LOOKUP;
    }

    switch (fieldDef.type) {
      case NOMINAL:
        if (channel === COLOR) {
          return ScaleType.ORDINAL_LOOKUP;
        }
        return discreteToContinuousType(channel, mark, canHaveBandSize);
      case ORDINAL:
        if (channel === COLOR) {
          // TODO: check if this is still true
          return ScaleType.LINEAR; // ordinal has order, so use interpolated ordinal color scale.
        }
        return discreteToContinuousType(channel, mark, canHaveBandSize);
      case TEMPORAL:
        if (channel === COLOR) {
          // FIXME: or sequential?
          return ScaleType.TIME; // time has order, so use interpolated color scale.
        }

        switch (fieldDef.timeUnit) {
          // These time unit use discrete scale by default
          case TimeUnit.HOURS:
          case TimeUnit.DAY:
          case TimeUnit.MONTH:
          case TimeUnit.QUARTER:
            return discreteToContinuousType(channel, mark, canHaveBandSize);
        }
        return ScaleType.TIME;

      case QUANTITATIVE:
        return ScaleType.LINEAR;
    }

    /* istanbul ignore next: should never reach this */
    throw new Error(log.message.invalidFieldType(fieldDef.type));
  }

  /**
   * Determines default scale type for nominal/ordinal field.
   * @returns BAND or POINT scale based on channel, mark, and bandSize
   */
  function discreteToContinuousType(channel: Channel, mark: Mark, canHaveBandSize: boolean): ScaleType {
    if (contains([X, Y], channel)) {
      // Use band ordinal scale for x/y scale in one of the following cases:
      if (
        // 1) the mark is bar and the scale's bandWidth is 'fit'.
        // Basically, for fit mode
        (mark === BAR && !canHaveBandSize) ||
        // 2) the mark is rect as the rect mark should fit into a band.
        mark === RECT
      ) {
        return ScaleType.BAND;
      }
    }
    // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
    return ScaleType.POINT;
  }


  export function nice(scaleType: ScaleType, channel: Channel, fieldDef: FieldDef): boolean | NiceTime {
    if (contains([ScaleType.TIME, ScaleType.UTC], scaleType)) {
      return smallestUnit(fieldDef.timeUnit) as any;
    }
    return contains([X, Y], channel); // return true for quantitative X/Y
  }

  export function padding(scaleType: ScaleType, channel: Channel, scaleConfig: ScaleConfig) {
    if (contains([X, Y], channel)) {
      // Padding is only set for X and Y by default.
      // Basically it doesn't make sense to add padding for color and size.
      if (scaleType === ScaleType.POINT) {
        return scaleConfig.pointPadding;
      } else if (scaleType === ScaleType.BAND) {
        return scaleConfig.bandPadding;
      }
    }
    return undefined;
  }

  export function zero(specifiedScale: Scale, channel: Channel, fieldDef: FieldDef) {
    // By default, return true only for the following cases:

    // 1) using quantitative field with size
    // While this can be either ratio or interval fields, our assumption is that
    // ratio are more common.
    if (channel === SIZE && fieldDef.type === 'quantitative') {
      return true;
    }

    // 2) non-binned, quantitative x-scale or y-scale if no custom domain is provided.
    // (For binning, we should not include zero by default because binning are calculated without zero.
    // Similar, if users explicitly provide a domain range, we should not augment zero as that will be unexpected.)
    if (!specifiedScale.domain && !fieldDef.bin && contains([X, Y], channel)) {
      return true;
    }
    return false;
  }
}


// TODO: determine where this should go
export function bandSize(bandSize: number | BandSize, topLevelSize: number | undefined, mark: Mark | undefined,
    channel: Channel, scaleConfig: ScaleConfig): number {
  if (topLevelSize === undefined) {
    if (bandSize === BANDSIZE_FIT || bandSize === null) {
      return undefined; // no bandSize
    } else if (bandSize !== undefined) {
      // Use manually specified bandSize
      return bandSize;
    } else if (contains([X, Y], channel)) {
      // only use config by default for X and Y
      if (channel === X && mark === TEXTMARK) {
        return scaleConfig.textBandWidth;
      } else if (scaleConfig.bandSize !== BANDSIZE_FIT) {
        return scaleConfig.bandSize;
      }
    }
  }

  // If top-level is specified, use bandSize fit
  if (bandSize && bandSize !== BANDSIZE_FIT) {
    // If top-level size is specified, we override specified bandSize with "fit"
    log.warn(log.message.bandSizeOverridden(channel));
  }
  return undefined;
}

// TODO: rename to parseDomain?
export function domain(scale: Scale, model: Model, channel:Channel): any {
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
  if (fieldDef.type === TEMPORAL) {
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
      data: model.dataName(STACKED_SCALE),
      // STACKED_SCALE produces sum of the field's value e.g., sum of sum, sum of distinct
      field: model.field(channel, {prefix: 'sum'})
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
    if (isDiscreteScale(scale.type)) {
      // ordinal bin scale takes domain from bin_range, ordered by bin_start
      return {
        data: model.dataTable(),
        field: model.field(channel, { binSuffix: 'range' }),
        sort: {
          field: model.field(channel, { binSuffix: 'start' }),
          op: 'min' // min or max doesn't matter since same _range would have the same _start
        }
      };
    } else if (channel === COLOR) {
      // Currently, binned on color uses linear scale and thus use _start point
      return {
        data: model.dataTable(),
        field: model.field(channel, { binSuffix: 'start' })
      };
    } else {
      // other linear bin scale merges both bin_start and bin_end for non-ordinal scale
      return {
        data: model.dataTable(),
        field: [
          model.field(channel, { binSuffix: 'start' }),
          model.field(channel, { binSuffix: 'end' })
        ]
      };
    }
  } else if (sort) { // have sort -- only for ordinal
    return {
      // If sort by aggregation of a specified sort field, we need to use SOURCE table,
      // so we can aggregate values for the scale independently from the main aggregation.
      data: sort.op ? SOURCE : model.dataTable(),
      field: (fieldDef.type === ORDINAL && channel === COLOR) ? model.field(channel, {prefix: 'rank'}) : model.field(channel),
      sort: sort
    };
  } else {
    return {
      data: model.dataTable(),
      field: (fieldDef.type === ORDINAL && channel === COLOR) ? model.field(channel, {prefix: 'rank'}) : model.field(channel),
    };
  }
}

export function domainSort(model: Model, channel: Channel, scaleType: ScaleType): any {
  if (!isDiscreteScale(scaleType)) {
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

  if (contains([SortOrder.ASCENDING, SortOrder.DESCENDING, undefined /* default =ascending*/], sort)) {
    return true;
  }

  // sort === 'none'
  return undefined;
}

// TODO: determine where this should go
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
      (fieldDef.type === QUANTITATIVE && !fieldDef.bin && scale.type !== ScaleType.LOG) ||
      // T uses non-ordinal scale when there's no unit or when the unit is not ordinal.
      (fieldDef.type === TEMPORAL && contains([ScaleType.TIME, ScaleType.UTC], scale.type))
    );
}

// TODO: refactor where this should go
/**
 * @returns {*} mix-in of bandSize, range, scheme.
 */

export function rangeMixins(scale: Scale, model: Model, channel: Channel):
  {range: string | Array<number|string|{data: string, field:string}>} | {bandSize: number} | {scheme: string} {

  const config = model.config();
  const markConfig = model.config().mark;
  const scaleConfig = model.config().scale;

  // TODO: need to add rule for quantile, quantize, threshold scale

  const fieldDef = model.fieldDef(channel);

  if (scale.bandSize && scale.bandSize !== BANDSIZE_FIT) {
    /* istanbul ignore else: should never reach there */
    if (scale.type === ScaleType.BAND || scale.type === ScaleType.POINT) {
      return {bandSize: scale.bandSize};
    } else {
      delete scale.bandSize;
      log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, 'bandSize', channel));
    }
  }

  if (scale.scheme) {
    if (scale.type === 'ordinal' || scale.type === 'sequential') {
      return {scheme: scale.scheme};
    } else {
      log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, 'scheme', channel));
    }
  }

  if (scale.range) {
    if (!contains([X, Y, ROW, COLUMN], channel)) {
      // explicit range value
      return {range: scale.range};
    } else {
      // Do not allow explicit values for X, Y, ROW, COLUMN)
      log.warn(log.message.customScaleRangeNotAllowed(channel));
    }
  }

  switch (channel) {
    case ROW:
      return {range: 'height'};
    case COLUMN:
      return {range: 'width'};
  }

  // If not ROW / COLUMN, we can assume that this is a unit spec.
  const unitModel = model as UnitModel;
  const topLevelSize = channel === X ? unitModel.width : unitModel.height;
  const mark = unitModel.mark();

  switch (channel) {
    case X:
      // FIXME revise if this is still true in Vega 3
      // FIXME: what if size is not specified
      // we can't use {range: "width"} here since we put scale in the root group
      // not inside the cell, so scale is reusable for axes group

      return {range: [0, topLevelSize]};
    case Y:
      // FIXME revise if this is still true in Vega 3
      // FIXME: what if size is not specified
      return {range: [topLevelSize, 0]};
    case SIZE:
      if (mark === BAR) {
        if (scaleConfig.barSizeRange !== undefined) {
          return {range: scaleConfig.barSizeRange};
        }
        const dimension = markConfig.orient === 'horizontal' ? Y : X;
        return {range: [config.bar.continuousBandSize, model.scale(dimension).bandSize]};
      } else if (mark === TEXTMARK) {
        return {range: scaleConfig.fontSizeRange };
      } else if (mark === RULE) {
        return {range: scaleConfig.ruleSizeRange };
      } else if (mark === TICK) {
        return {range: scaleConfig.tickSizeRange };
        // FIXME similar to bar?
      }
      // else -- point, square, circle
      if (scaleConfig.pointSizeRange !== undefined) {
        return {range: scaleConfig.pointSizeRange};
      }

      // If not ROW / COLUMN, we can assume that this is a unit spec.
      const bandSize = pointBandSize(model as UnitModel, scaleConfig);

      //  TODO: make 9 a config
      return {range: [9, (bandSize - 2) * (bandSize - 2)]};
    case SHAPE:
      return {range: scaleConfig.shapeRange};
    case COLOR:
      if (fieldDef.type === NOMINAL) {
        return {scheme: scaleConfig.nominalColorScheme};
      }
      // else -- ordinal, time, or quantitative
      return {scheme: scaleConfig.sequentialColorScheme};

    case OPACITY:
      return {range: scaleConfig.opacity};
  }
  /* istanbul ignore next: should never reach here */
  throw new Error(`Scale range undefined for channel ${channel}`);
}

/**
 * @returns {number} Band size of x or y or minimum between the two if both are ordinal scale.
 */
function pointBandSize(model: UnitModel, scaleConfig: ScaleConfig): number {
  const bandSizes: number[] = [];
  if (model.scale(X)) {
    const xBandSize = model.scale(X).bandSize;
    if (xBandSize && xBandSize !== BANDSIZE_FIT) {
      bandSizes.push(xBandSize);
    }
  }

  if (model.scale(Y)) {
    const yBandSize = model.scale(Y).bandSize;
    if (yBandSize && yBandSize !== BANDSIZE_FIT) {
      bandSizes.push(yBandSize);
    }
  }

  if (bandSizes.length > 0) {
    return Math.min.apply(null, bandSizes);
  }
  if (scaleConfig.bandSize && scaleConfig.bandSize !== BANDSIZE_FIT) {
    return scaleConfig.bandSize;
  }
  // TODO(#1168): better default point bandSize for fit mode
  return 21;
}

