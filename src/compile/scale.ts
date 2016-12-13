import * as log from '../log';

import {COLUMN, ROW, X, Y, X2, Y2, COLOR, Channel} from '../channel';
import {ChannelDefWithScale, FieldDef, field} from '../fielddef';
import {Mark} from '../mark';
import {Scale, ScaleConfig, ScaleType, scaleTypeSupportProperty, hasContinuousDomain} from '../scale';
import {isSortField, SortOrder} from '../sort';
import {extend, Dict} from '../util';
import {VgScale} from '../vega.schema';

import {Model} from './model';


import {domain} from './scale/domain';
import {rangeMixins, rangeStep} from './scale/range';
import * as rules from './scale/rules';
import {type} from './scale/type';

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
    'range',
    'scheme',
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
          value = rules.nice(scale.type, channel, fieldDef);
        } else if (property === 'padding') {
          value = rules.padding(channel, scale.type, scaleConfig);
        } else if (property === 'paddingInner') {
          value = rules.paddingInner(scale.padding, channel, scaleConfig);
        } else if (property === 'paddingOuter') {
          value = rules.paddingOuter(scale.padding, channel, scale.type, scale.paddingInner, scaleConfig);
        } else if (property === 'round') {
          value = rules.round(channel, scaleConfig);
        } else if (property === 'zero') {
          value = rules.zero(scale, channel, fieldDef);
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

