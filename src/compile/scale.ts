import * as log from '../log';

import {SHARED_DOMAIN_OPS} from '../aggregate';
import {COLUMN, ROW, X, Y, X2, Y2, SHAPE, SIZE, COLOR, OPACITY, TEXT, hasScale, supportScaleType, Channel} from '../channel';
import {Config} from '../config';
import {SOURCE, STACKED_SCALE} from '../data';
import {DateTime, isDateTime, timestamp} from '../datetime';
import {ChannelDefWithScale, FieldDef, field} from '../fielddef';
import {Mark, BAR, TEXT as TEXTMARK, RECT, MarkConfig, PointConfig} from '../mark';
import {Scale, ScaleConfig, ScaleType, NiceTime, hasDiscreteDomain, scaleTypeSupportProperty, hasContinuousDomain} from '../scale';
import {isSortField, SortOrder} from '../sort';
import {StackOffset} from '../stack';
import {TimeUnit} from '../timeunit';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';
import {contains, extend, Dict} from '../util';
import {VgScale} from '../vega.schema';

import {Model} from './model';
import {smallestUnit} from '../timeunit';
import {UnitModel} from './unit';

/** Scale suffix for scale used to get drive binned legends. */
export const BIN_LEGEND_SUFFIX = '_bin_legend';
/** Scale suffix for scale for binned field's legend labels, which maps a binned field's quantitative values to range strings. */
export const BIN_LEGEND_LABEL_SUFFIX = '_bin_legend_label';

// FIXME: With layer and concat, scaleComponent should decompose between
// ScaleSignature and ScaleDomain[].
// Basically, if two unit specs has the same scale, signature for a particular channel,
// the scale can be unioned by combining the domain.
export type ScaleComponent = VgScale;

export type ScaleComponents = {
  main: ScaleComponent;
  binLegend?: ScaleComponent;
  binLegendLabel?: ScaleComponent;
}

export function channelScalePropertyIncompatability(channel: Channel, propName: string): string {
  switch (propName) {
    case 'range':
      // User should not customize range for position and facet channel directly.
      if (channel === X || channel === Y) {
        return log.message.CANNOT_USE_RANGE_WITH_POSITION;
      }
      if (channel === ROW || channel === COLUMN) {
        return log.message.cannotUseRangePropertyWithFacet('range');
      }
      return undefined; // GOOD!
    // band / point
    case 'rangeStep':
      if (channel === ROW || channel === COLUMN) {
        return log.message.cannotUseRangePropertyWithFacet('rangeStep');
      }
      return undefined; // GOOD!
    case 'padding':
    case 'paddingInner':
    case 'paddingOuter':
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

  const rangeProperties: any[] = ((scale.rangeStep ? ['rangeStep'] : []) as any[]).concat(
    scale.scheme ? ['scheme'] : [],
    scale.range ? ['range'] : []
  );

  if (rangeProperties.length > 1) {
    log.warn(log.message.mutuallyExclusiveScaleProperties(rangeProperties));
  }

  // initialize rangeStep as if it's an ordinal scale first since ordinal scale type depends on this.
  const step = rangeStep(specifiedScale.rangeStep, topLevelSize, mark, channel, scaleConfig);
  scale.type = type(specifiedScale.type, fieldDef, channel, mark, !!step);

  if ((scale.type === ScaleType.POINT || scale.type === ScaleType.BAND)) {
    if (step !== undefined) {
      scale.rangeStep = step;
    }
  } else if (specifiedScale.rangeStep !== undefined) {
    log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, 'rangeStep', channel));
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
    'padding', 'paddingInner', 'paddingOuter', // padding

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
        } else if (property === 'paddingInner') {
          value = defaultProperty.paddingInner(scale.padding, channel, scaleConfig);
        } else if (property === 'paddingOuter') {
          value = defaultProperty.paddingOuter(scale.padding, channel, scale.type, scale.paddingInner, scaleConfig);
        } else if (property === 'round') {
          value = defaultProperty.round(channel, scaleConfig);
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

        // Add additional scale needed for the labels in the binned legend.
        if (model.legend(channel) && fieldDef.bin && hasContinuousDomain(model.scale(channel).type)) {
          scales.binLegend = parseBinLegend(channel, model, fieldDef);
          scales.binLegendLabel = parseBinLegendLabel(channel, model, fieldDef);
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
      // FIXME: Verify if this is really correct
      scaleDef.domain = { fields: [domain(scale, model, X), domain(scale, model, X2)] };
    } else {
      scaleDef.domain = domain(scale, model, X2);
    }
  } else if (channel === Y && model.has(Y2)) {
    if (model.has(Y)) {
      // FIXME: Verify if this is really correct
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
 * Return additional scale to drive legend when we use a continuous scale and binning.
 */
function parseBinLegend(channel: Channel, model: Model, fieldDef: FieldDef): ScaleComponent {
  return {
    name: model.scaleName(channel, true) + BIN_LEGEND_SUFFIX,
    type: ScaleType.POINT,
    domain: {
      data: model.dataTable(),
      field: model.field(channel),
      sort: true
    },
    range: [0,1] // doesn't matter because we override it
  };
}

/**
 *  Return an additional scale for bin labels because we need to map bin_start to bin_range in legends
 */
function parseBinLegendLabel(channel: Channel, model: Model, fieldDef: FieldDef): ScaleComponent {
  return {
    name: model.scaleName(channel, true) + BIN_LEGEND_LABEL_SUFFIX,
    type: ScaleType.ORDINAL_LOOKUP,
    domain: {
      data: model.dataTable(),
      field: model.field(channel),
      sort: true
    },
    range: {
      data: model.dataTable(),
      field: field(fieldDef, {binSuffix: 'range'}),
      sort: {
        field: model.field(channel, { binSuffix: 'start' }),
        op: 'min' // min or max doesn't matter since same _range would have the same _start
      }
    }
  };
}

/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
export function type(specifiedType: ScaleType, fieldDef: FieldDef, channel: Channel, mark: Mark, canHaveRangeStep: boolean): ScaleType {
  if (!hasScale(channel)) {
    // There is no scale for these channels
    return null;
  }

  if (specifiedType !== undefined) {
    // Check if explicitly specified scale type is supported by the channel
    if (supportScaleType(channel, specifiedType)) {
      return specifiedType;
    } else {
      const newScaleType = defaultProperty.type(fieldDef, channel, mark, canHaveRangeStep);
      log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, newScaleType));
      return newScaleType;
    }
  }

  return defaultProperty.type(fieldDef, channel, mark, canHaveRangeStep);
}

export namespace defaultProperty {
  /**
   * Determine appropriate default scale type.
   */
  export function type(fieldDef: FieldDef, channel: Channel, mark: Mark, canHaveRangeStep: boolean): ScaleType {
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
        return discreteToContinuousType(channel, mark, canHaveRangeStep);
      case ORDINAL:
        if (channel === COLOR) {
          return ScaleType.INDEX;
        }
        return discreteToContinuousType(channel, mark, canHaveRangeStep);
      case TEMPORAL:
        if (channel === COLOR) {
          return ScaleType.SEQUENTIAL;
        }

        switch (fieldDef.timeUnit) {
          // These time unit use discrete scale by default
          case TimeUnit.HOURS:
          case TimeUnit.DAY:
          case TimeUnit.MONTH:
          case TimeUnit.QUARTER:
            return discreteToContinuousType(channel, mark, canHaveRangeStep);
        }
        return ScaleType.TIME;

      case QUANTITATIVE:
        if (channel === COLOR) {
          return ScaleType.SEQUENTIAL;
        }
        return ScaleType.LINEAR;
    }

    /* istanbul ignore next: should never reach this */
    throw new Error(log.message.invalidFieldType(fieldDef.type));
  }

  /**
   * Determines default scale type for nominal/ordinal field.
   * @returns BAND or POINT scale based on channel, mark, and rangeStep
   */
  function discreteToContinuousType(channel: Channel, mark: Mark, canHaveRangeStep: boolean): ScaleType {
    if (contains([X, Y], channel)) {
      // Use band ordinal scale for x/y scale in one of the following cases:
      if (
        // 1) the mark is bar and the scale cannot have range step (fit mode).
        (mark === BAR && !canHaveRangeStep) ||
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

  export function paddingInner(padding: number, channel: Channel,  scaleConfig: ScaleConfig) {
    if (padding !== undefined) {
      // If user has already manually specified "padding", no need to add default paddingInner.
      return undefined;
    }

    if (contains([X, Y], channel)) {
      // Padding is only set for X and Y by default.
      // Basically it doesn't make sense to add padding for color and size.

      // paddingOuter would only be called if it's a band scale, just return the default for bandScale.
      return scaleConfig.bandPaddingInner;
    }
    return undefined;
  }

  export function paddingOuter(padding: number, channel: Channel, scaleType: ScaleType, paddingInner: number, scaleConfig: ScaleConfig) {
    if (padding !== undefined) {
      // If user has already manually specified "padding", no need to add default paddingOuter.
      return undefined;
    }

    if (contains([X, Y], channel)) {
      // Padding is only set for X and Y by default.
      // Basically it doesn't make sense to add padding for color and size.
      if (scaleType === ScaleType.POINT) {
        return scaleConfig.pointPadding;
      } else if (scaleType === ScaleType.BAND) {
        if (scaleConfig.bandPaddingOuter !== undefined) {
          return scaleConfig.bandPaddingOuter;
        }
        /* By default, paddingOuter is paddingInner / 2. The reason is that
           size (width/height) = step * (cardinality - paddingInner + 2 * paddingOuter).
           and we want the width/height to be integer by default.
           Note that step (by default) and cardinality are integers.) */
        return paddingInner / 2;
      }
    }
    return undefined;
  }

  export function round(channel: Channel, scaleConfig: ScaleConfig) {
    if (contains(['x', 'y', 'row', 'column'], channel)) {
      return scaleConfig.round;
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
export function rangeStep(rangeStep: number | null, topLevelSize: number | undefined, mark: Mark | undefined,
    channel: Channel, scaleConfig: ScaleConfig): number {
  if (topLevelSize === undefined) {
    // If null, we really want to make rangeStep fit width/height.  (If undefined, use default value.)
    if (rangeStep === null) {
      return undefined; // no rangeStep
    } else if (rangeStep !== undefined) {
      // Use manually specified rangeStep
      return rangeStep;
    } else if (contains([X, Y], channel)) {
      // only use config by default for X and Y
      if (channel === X && mark === TEXTMARK) {
        return scaleConfig.textXRangeStep;
      } else if (scaleConfig.rangeStep) {
        return scaleConfig.rangeStep;
      }
    }
  }

  // If top-level is specified, use rangeStep fit
  if (rangeStep && rangeStep !== null) {
    // If top-level size is specified, we drop specified rangeStep.
    log.warn(log.message.rangeStepDropped(channel));
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
      if (channel === X || channel === Y) {
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
 * @returns {*} mix-in of rangeStep, range, scheme.
 */

export function rangeMixins(scale: Scale, model: Model, channel: Channel):
  {range: string | Array<number|string|{data: string, field:string}>} | {rangeStep: number} | {scheme: string} {

  const config = model.config();

  // TODO: need to add rule for quantile, quantize, threshold scale

  const fieldDef = model.fieldDef(channel);

  if (scale.rangeStep) {
    /* istanbul ignore else: should never reach there */
    if (scale.type === ScaleType.BAND || scale.type === ScaleType.POINT) {
      return {rangeStep: scale.rangeStep};
    } else {
      delete scale.rangeStep;
      log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, 'rangeStep', channel));
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
      // TODO: support custom rangeMin, rangeMax
      const rangeMin = sizeRangeMin(mark, scale.zero, config);
      const rangeMax = sizeRangeMax(mark, model, config);
      return {range: [rangeMin, rangeMax]};
    case SHAPE:
      return {range: config.point.shapes};
    case COLOR:
      if (fieldDef.type === NOMINAL) {
        return {scheme: config.mark.nominalColorScheme};
      }
      // TODO(#1737): support sequentialColorRange (with linear scale) if sequentialColorScheme is not specified.
      // TODO: support custom rangeMin, rangeMax
      // else -- ordinal, time, or quantitative
      return {scheme: config.mark.sequentialColorScheme};

    case OPACITY:
      // TODO: support custom rangeMin, rangeMax
      return {range: [config.mark.minOpacity, config.mark.maxOpacity]};
  }
  /* istanbul ignore next: should never reach here */
  throw new Error(`Scale range undefined for channel ${channel}`);
}

function sizeRangeMin(mark: Mark, zero: boolean, config: Config) {
  if (zero) {
    return 0;
  }
  switch (mark) {
    case 'bar':
      return config.bar.minBandSize !== undefined ? config.bar.minBandSize : config.bar.continuousBandSize;
    case 'tick':
      return config.tick.minBandSize;
    case 'rule':
      return config.rule.minStrokeWidth;
    case 'text':
      return config.text.minFontSize;
    case 'point':
      return config.point.minSize;
    case 'square':
      return config.square.minSize;
    case 'circle':
      return config.circle.minSize;
  }
  /* istanbul ignore next: should never reach here */
  // sizeRangeMin not implemented for the mark
  throw new Error(log.message.incompatibleChannel('size', mark));
}

function sizeRangeMax(mark: Mark, model: Model,  config: Config) {
  const scaleConfig = model.config().scale;
  // TODO(#1168): make max size scale based on rangeStep / overall plot size
  switch (mark) {
    case 'bar':
      if (config.bar.maxBandSize !== undefined) {
        return config.bar.maxBandSize;
      }
      return barTickRangeStep(model, config.mark) - 1;
    case 'tick':
      if (config.tick.maxBandSize !== undefined) {
        return config.tick.maxBandSize;
      }
      return barTickRangeStep(model, config.mark) - 1;
    case 'rule':
      return config.rule.maxStrokeWidth;
    case 'text':
      return config.text.maxFontSize;
    case 'point':
    case 'square':
    case 'circle':
      if ((config[mark] as PointConfig).maxSize) {
        return (config[mark] as PointConfig).maxSize;
      }

      // FIXME this case totally should be refactored
      const pointStep = pointRangeStep(model as UnitModel, scaleConfig);
      return (pointStep - 2) * (pointStep - 2);
  }
  /* istanbul ignore next: should never reach here */
  // sizeRangeMax not implemented for the mark
  throw new Error(log.message.incompatibleChannel('size', mark));
}

// TODO: we might be able to consolidate this with pointRangeStep
function barTickRangeStep(model: Model, markConfig: MarkConfig) {
  const dimension = markConfig.orient === 'horizontal' ? Y : X;
  const step = model.scale(dimension).rangeStep;
  if (step) {
    return step;
  }
  // TODO(#1168): proportional rangeStep for fit mode
  return 21;
}

/**
 * @returns {number} Range step of x or y or minimum between the two if both are ordinal scale.
 */
function pointRangeStep(model: UnitModel, scaleConfig: ScaleConfig): number {
  const rangeSteps: number[] = [];
  if (model.scale(X)) {
    const xStep = model.scale(X).rangeStep;
    // TODO(#1168): proportional rangeStep for fit mode
    if (xStep) {
      rangeSteps.push(xStep);
    }
  }

  if (model.scale(Y)) {
    const yStep = model.scale(Y).rangeStep;
    // TODO(#1168): proportional rangeStep for fit mode
    if (yStep) {
      rangeSteps.push(yStep);
    }
  }

  if (rangeSteps.length > 0) {
    return Math.min.apply(null, rangeSteps);
  }
  if (scaleConfig.rangeStep) {
    return scaleConfig.rangeStep;
  }
  return 21;
}
