import {Channel} from '../../channel';
import {Scale} from '../../scale';
import {isSortField} from '../../sort';
import {Dict} from '../../util';

import {Model} from '../model';

import {ScaleComponents} from './scale';
import {parseDomain} from './domain';
import {parseRange} from './range';
import {VgScale} from '../../vega.schema';

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
    return {
      main: parseMainScale(model, channel)
    };
  }
  return null;
}

export const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES: (keyof Scale)[] = [
  'round',
  // quantitative / time
  'clamp', 'nice',
  // quantitative
  'exponent', 'interpolate', 'zero', // zero depends on domain
  // ordinal
  'padding', 'paddingInner', 'paddingOuter', // padding
];

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

  NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES.forEach((property) => {
    scaleComponent[property] = scale[property];
  });

  if (sort && (isSortField(sort) ? sort.order : sort) === 'descending') {
    scaleComponent.reverse = true;
  }

  return scaleComponent;
}
