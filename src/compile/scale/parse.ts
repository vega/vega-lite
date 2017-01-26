import {X, Y, X2, Y2, Channel} from '../../channel';
import {FieldDef, field} from '../../fielddef';
import {ScaleType, hasContinuousDomain} from '../../scale';
import {isSortField, SortOrder} from '../../sort';
import {Dict} from '../../util';

import {Model} from '../model';

import {ScaleComponent, ScaleComponents, BIN_LEGEND_SUFFIX, BIN_LEGEND_LABEL_SUFFIX} from './scale';
import {default as domain, unionDomains} from './domain';
import {parseRange} from './range';
import {VgScale, VgDomain} from '../../vega.schema';

/**
 * Parse scales for all channels of a model.
 */
export default function parseScaleComponent(model: Model): Dict<ScaleComponents> {
  // TODO: should model.channels() inlcude X2/Y2?
  return model.channels().reduce(function(scaleComponentsIndex: Dict<ScaleComponents>, channel: Channel) {
    const scaleComponents = parseScale(model, channel);
    if (scaleComponents) {
      scaleComponentsIndex[channel] = scaleComponents;
    }
    return scaleComponentsIndex;
  }, {});
}

/**
 * Parse scales for a single channel of a model.
 */
export function parseScale(model: Model, channel: Channel) {
   if (model.scale(channel)) {
    const fieldDef = model.fieldDef(channel);
    const scales: ScaleComponents = {
      main: parseMainScale(model, channel)
    };

    // Add additional scale needed for the labels in the binned legend.
    if (model.legend(channel) && fieldDef.bin && hasContinuousDomain(model.scale(channel).type)) {
      scales.binLegend = parseBinLegend(channel, model);
      scales.binLegendLabel = parseBinLegendLabel(channel, model, fieldDef);
    }

    return scales;
  }
  return null;
}

// TODO: consider return type of this method
// maybe we should just return domain as we can have the rest of scale (ScaleSignature constant)
/**
 * Return the main scale for each channel.  (Only color can have multiple scales.)
 */
function parseMainScale(model: Model, channel: Channel) {
  const scale = model.scale(channel);
  const sort = model.sort(channel);

  let scaleComponent: VgScale = {
    name: model.scaleName(channel + '', true),
    type: scale.type,
    domain: parseDomain(model, channel),
    range: parseRange(scale)
  };

  [ 'round',
    // quantitative / time
    'clamp', 'nice',
    // quantitative
    'exponent', 'zero', // zero depends on domain
    // ordinal
    'padding', 'paddingInner', 'paddingOuter', // padding
  ].forEach((property) => {
    scaleComponent[property] = scale[property];
  });

  if (sort && (isSortField(sort) ? sort.order : sort) === SortOrder.DESCENDING) {
    scaleComponent.reverse = true;
  }

  return scaleComponent;
}

export function parseDomain(model: Model, channel: Channel): VgDomain {
  const scale = model.scale(channel);

  // If channel is either X or Y then union them with X2 & Y2 if they exist
  if (channel === X && model.channelHasField(X2)) {
    if (model.channelHasField(X)) {
      return unionDomains(domain(scale, model, X), domain(scale, model, X2));
    } else {
      return domain(scale, model, X2);
    }
  } else if (channel === Y && model.channelHasField(Y2)) {
    if (model.channelHasField(Y)) {
      return unionDomains(domain(scale, model, Y), domain(scale, model, Y2));
    } else {
      return domain(scale, model, Y2);
    }
  }
  return domain(scale, model, channel);
}

/**
 * Return additional scale to drive legend when we use a continuous scale and binning.
 */
function parseBinLegend(channel: Channel, model: Model): ScaleComponent {
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
    type: ScaleType.ORDINAL,
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
