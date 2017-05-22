import {Channel, SCALE_CHANNELS, ScaleChannel} from '../../channel';
import {isSelectionDomain, Scale} from '../../scale';
import {isSortField} from '../../sort';
import {Dict} from '../../util';
import {isSignalRefDomain, VgScale} from '../../vega.schema';

import {UnitModel} from '../unit';

import {GEOSHAPE} from '../../mark';
import {Model} from '../model';
import {ScaleComponent, ScaleComponentIndex} from './component';
import {parseDomain, unionDomains} from './domain';
import {parseRange} from './range';

import {SELECTION_DOMAIN} from '../selection/selection';
import {Split} from '../split';

/**
 * Parse scales for all channels of a model.
 */
export default function parseScaleComponent(model: UnitModel): ScaleComponentIndex {
  return SCALE_CHANNELS.reduce(function(scaleComponentsIndex: ScaleComponentIndex, channel: ScaleChannel) {
    const scaleComponents = parseScale(model, channel);
    if (scaleComponents) {
      scaleComponentsIndex[channel] = scaleComponents;
    }
    return scaleComponentsIndex;
  }, {});
}

export const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES: (keyof (Scale | VgScale))[] = [
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
export function parseScale(model: UnitModel, channel: ScaleChannel) {
  if (!model.scale(channel)) {
    return null;
  }

  // shape is not a scale channel for geoshape mark
  if (model.mark() === GEOSHAPE && channel === SHAPE) {
    return null;
  }

  const scale = model.scale(channel);
  const sort = model.sort(channel);

  const scaleComponent: ScaleComponent = new Split<Partial<VgScale>>(
    {},
    // Implicit
    {
      name: model.scaleName(channel + '', true)
    }
  );
  scaleComponent.copyKeyFrom('type', scale);

  // FIXME(https://github.com/vega/vega-lite/issues/2497): this condition to be implicit/explicit may be incorrect
  const domain = parseDomain(model, channel);
  scaleComponent.set('domain', domain, domain === model.scaleDomain(channel));

  if (isSelectionDomain(scale.get('domain'))) {
    // As scale parsing occurs before selection parsing, we use a temporary
    // signal here and append the scale.domain definition. This is replaced
    // with the correct domainRaw signal during scale assembly.
    // For more information, see isRawSelectionDomain in selection.ts.

    // FIXME: replace this with a special property in the scaleComponent
    scaleComponent.set('domainRaw', {
      signal: SELECTION_DOMAIN + JSON.stringify(scale.get('domain'))
    }, true);
  }

  const {explicit, range} = parseRange(scale);
  scaleComponent.set('range', range, explicit);

  NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES.forEach((property) => {
    scaleComponent.copyKeyFrom(property, scale);
  });

  return scaleComponent;
}

/**
 * Move scale from child up.
 */
export function moveSharedScaleUp(model: Model, scaleComponent: Dict<ScaleComponent>, child: Model, channel: ScaleChannel) {
  // TODO: Check whether the scales are actually compatible and merge them, e.g. they shoud use the same sort or throw error

  const childScale = child.component.scales[channel];
  let modelScale = scaleComponent[channel];

  if (modelScale) {
    const {explicit, value: domain} = modelScale.getWithType('domain');
    const {explicit: childExplicit, value: childDomain} = childScale.getWithType('domain');

    modelScale.set('domain', unionDomains(domain, childDomain), explicit || childExplicit);
  } else {
    modelScale = scaleComponent[channel] = childScale;
  }

  // rename child scale to parent scales
  const scaleNameWithoutPrefix = childScale.get('name').substr(child.getName('').length);
  const newName = model.scaleName(scaleNameWithoutPrefix, true);
  child.renameScale(childScale.get('name'), newName);
  childScale.set('name', newName, false);

  // remove merged scales from children
  delete child.component.scales[channel];

  return modelScale;
}
