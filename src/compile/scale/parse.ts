import {ScaleChannel} from '../../channel';
import {Scale} from '../../scale';
import {scaleCompatible, ScaleType, scaleTypePrecedence} from '../../scale';
import {keys} from '../../util';
import {VgScale} from '../../vega.schema';
import {Model} from '../model';
import {Explicit, mergeValuesWithExplicit} from '../split';
import {UnitModel} from '../unit';
import {ScaleComponent, ScaleComponentIndex} from './component';
import {parseScaleDomain} from './domain';
import {parseScaleRange} from './range';
import {parseScaleProperty} from './rules';

export const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES: (keyof (Scale | VgScale))[] = [
  'round',
  // quantitative / time
  'clamp', 'nice',
  // quantitative
  'exponent', 'interpolate', 'zero', // zero depends on domain
  // ordinal
  'padding', 'paddingInner', 'paddingOuter', // padding
];

export function parseScale(model: Model) {
  parseScaleCore(model);
  parseScaleDomain(model);
  for (const prop of NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES) {
    parseScaleProperty(model, prop);
  }
  // range depends on zero
  parseScaleRange(model);
}

export function parseScaleCore(model: Model) {
  if (model instanceof UnitModel) {
    model.component.scales = parseUnitScaleCore(model);
  } else {
    model.component.scales = parseNonUnitScaleCore(model);
  }
}

/**
 * Parse scales for all channels of a model.
 */
function parseUnitScaleCore(model: UnitModel): ScaleComponentIndex {
  const scales = model.scales;

  return keys(scales)
    .reduce((scaleComponents: ScaleComponentIndex, channel: ScaleChannel) => {
      scaleComponents[channel] = new ScaleComponent(
        model.scaleName(channel + '', true),
        scales[channel].getWithExplicit('type')
      );
      return scaleComponents;
    }, {});
}

function parseNonUnitScaleCore(model: Model) {
  const scaleComponents: ScaleComponentIndex = model.component.scales = {};

  const scaleTypeWithExplicitIndex: {[k in ScaleChannel]?: Explicit<ScaleType>} = {};
  const channelHasConflict: {[k in ScaleChannel]?: true} = {};

  // Parse each child scale and determine if a particular channel can be merged.
  for (const child of model.children) {
    parseScaleCore(child);

    // Instead of always merging right away -- check if it is compatible to merge first!
    keys(child.component.scales).forEach((channel: ScaleChannel) => {
      if (model.resolve[channel].scale === 'shared') {
        if (channelHasConflict[channel]) {
          return;
        }

        const scaleType = scaleTypeWithExplicitIndex[channel];
        const childScaleType = child.component.scales[channel].getWithExplicit('type');

        if (scaleType) {
          if (scaleCompatible(scaleType.value, childScaleType.value)) {
            // merge scale component if type are compatible
            scaleTypeWithExplicitIndex[channel] = mergeValuesWithExplicit(
              scaleType, childScaleType, scaleTypePrecedence
            );
          } else {
            // Otherwise, mark as conflict and remove from the index so they don't get merged
            channelHasConflict[channel] = true;
            delete scaleTypeWithExplicitIndex[channel];
          }
        } else {
          scaleTypeWithExplicitIndex[channel] = childScaleType;
        }
      }
    });
  }

  // Merge each channel listed in the index
  keys(scaleTypeWithExplicitIndex).forEach((channel: ScaleChannel) => {
    // Create new merged scale component
    const name = model.scaleName(channel, true);
    const typeWithExplicit = scaleTypeWithExplicitIndex[channel];
    const modelScale = scaleComponents[channel] = new ScaleComponent(name, typeWithExplicit);

    // rename each child and mark them as merged
    for (const child of model.children) {
      const childScale = child.component.scales[channel];
      if (childScale) {
        child.renameScale(childScale.get('name'), name);
        childScale.merged = true;
      }
    }
  });

  return scaleComponents;
}
