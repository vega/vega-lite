import {X, Y, X2, Y2, Channel} from '../../channel';
import {FieldDef, field} from '../../fielddef';
import {ScaleType, hasContinuousDomain} from '../../scale';
import {isSortField, SortOrder} from '../../sort';
import {extend, Dict} from '../../util';

import {Model} from '../model';

import {ScaleComponent, ScaleComponents, BIN_LEGEND_LABEL_SUFFIX} from './scale';
import domain from './domain';

/**
 * Parse scales for all channels of a model.
 */
export default function parseScaleComponent(model: Model): Dict<ScaleComponents> {
  // TODO: should model.channels() inlcude X2/Y2?
  return model.channels().reduce(function(scale: Dict<ScaleComponents>, channel: Channel) {
    const scales = parseScale(model, channel);
    if (scales) {
      scale[channel] = scales;
    }
    return scale;
  }, {});
}

/**
 * Parse scales for a single channel of a model.
 */
export function parseScale(model: Model, channel: Channel) {
   if (model.scale(channel)) {
    const fieldDef = model.fieldDef(channel);
    const scales: ScaleComponents = {
      main: parseMainScale(model, fieldDef, channel)
    };

    // Add additional scale needed for the labels in the binned legend.
    if (model.legend(channel) && fieldDef.bin && hasContinuousDomain(model.scale(channel).type)) {
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
  if (channel === X && model.channelHasField(X2)) {
    if (model.channelHasField(X)) {
      // FIXME: Verify if this is really correct
      scaleDef.domain = { fields: [domain(scale, model, X), domain(scale, model, X2)] };
    } else {
      scaleDef.domain = domain(scale, model, X2);
    }
  } else if (channel === Y && model.channelHasField(Y2)) {
    if (model.channelHasField(Y)) {
      // FIXME: Verify if this is really correct
      scaleDef.domain = { fields: [domain(scale, model, Y), domain(scale, model, Y2)] };
    } else {
      scaleDef.domain = domain(scale, model, Y2);
    }
  } else {
    scaleDef.domain = domain(scale, model, channel);
  }

  if (sort && (isSortField(sort) ? sort.order : sort) === SortOrder.DESCENDING) {
    scaleDef.reverse = true;
  }

  return scaleDef;
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
