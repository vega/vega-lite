import {Channel} from '../../channel';
import {isSelectionDomain, Scale} from '../../scale';
import {isSortField} from '../../sort';
import {Dict} from '../../util';
import {isSignalRefDomain, VgScale} from '../../vega.schema';

import {UnitModel} from '../unit';

import {Model} from '../model';
import {ScaleComponent, ScaleComponentIndex} from './component';
import {parseDomain, unionDomains} from './domain';
import {parseRange} from './range';

/**
 * Parse scales for all channels of a model.
 */
export default function parseScaleComponent(model: UnitModel): ScaleComponentIndex {
  // TODO: should model.channels() inlcude X2/Y2?
  return model.channels().reduce(function(scaleComponentsIndex: ScaleComponentIndex, channel: Channel) {
    const scaleComponents = parseScale(model, channel);
    if (scaleComponents) {
      scaleComponentsIndex[channel] = scaleComponents;
    }
    return scaleComponentsIndex;
  }, {});
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

/**
 * Parse scales for a single channel of a model.
 */
export function parseScale(model: UnitModel, channel: Channel) {
  if (!model.scale(channel)) {
    return null;
  }

  const scale = model.scale(channel);
  const sort = model.sort(channel);

  const scaleComponent: VgScale = {
    name: model.scaleName(channel + '', true),
    type: scale.type,
    domain: parseDomain(model, channel),
    range: parseRange(scale)
  };

  if (isSelectionDomain(scale.domain)) {
    scaleComponent.domainRaw = scale.domain;
  }

  NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES.forEach((property) => {
    scaleComponent[property] = scale[property];
  });

  if (sort && (isSortField(sort) ? sort.order : sort) === 'descending') {
    scaleComponent.reverse = true;
  }
  return scaleComponent;
}

export function moveSharedScaleUp(model: Model, scaleComponent: Dict<ScaleComponent>, child: Model, channel: Channel) {
  // Check whether the scales are actually compatible, e.g. use the same sort or throw error

  const childScale = child.component.scales[channel];
  let modelScale = scaleComponent[channel];

  if (modelScale) {
    modelScale.domain = unionDomains(modelScale.domain, childScale.domain);
  } else {
    modelScale = scaleComponent[channel] = childScale;
  }

  // rename child scale to parent scales
  const scaleNameWithoutPrefix = childScale.name.substr(child.getName('').length);
  const newName = model.scaleName(scaleNameWithoutPrefix, true);
  child.renameScale(childScale.name, newName);
  childScale.name = newName;

  // remove merged scales from children
  delete child.component.scales[channel];

  return modelScale;
}
