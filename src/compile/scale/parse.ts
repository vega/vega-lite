import {getMainChannelFromOffsetChannel, isXorYOffset, ScaleChannel, SCALE_CHANNELS, SHAPE} from '../../channel';
import {getFieldOrDatumDef, ScaleDatumDef, TypedFieldDef} from '../../channeldef';
import {channelHasNestedOffsetScale} from '../../encoding';
import * as log from '../../log';
import {GEOSHAPE} from '../../mark';
import {
  NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES,
  scaleCompatible,
  ScaleType,
  scaleTypePrecedence
} from '../../scale';
import {GEOJSON} from '../../type';
import {keys} from '../../util';
import {VgScale} from '../../vega.schema';
import {isUnitModel, Model} from '../model';
import {defaultScaleResolve} from '../resolve';
import {Explicit, mergeValuesWithExplicit, tieBreakByComparing} from '../split';
import {UnitModel} from '../unit';
import {ScaleComponent, ScaleComponentIndex} from './component';
import {parseScaleDomain} from './domain';
import {parseScaleProperty, parseScaleRange} from './properties';
import {scaleType} from './type';

export function parseScales(model: Model, {ignoreRange}: {ignoreRange?: boolean} = {}) {
  parseScaleCore(model);
  parseScaleDomain(model);
  for (const prop of NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES) {
    parseScaleProperty(model, prop);
  }
  if (!ignoreRange) {
    // range depends on zero
    parseScaleRange(model);
  }
}

export function parseScaleCore(model: Model) {
  if (isUnitModel(model)) {
    model.component.scales = parseUnitScaleCore(model);
  } else {
    model.component.scales = parseNonUnitScaleCore(model);
  }
}

/**
 * Parse scales for all channels of a model.
 */
function parseUnitScaleCore(model: UnitModel): ScaleComponentIndex {
  const {encoding, mark, markDef} = model;
  const scaleComponents: ScaleComponentIndex = {};
  for (const channel of SCALE_CHANNELS) {
    const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]) as TypedFieldDef<string> | ScaleDatumDef; // must be typed def to have scale

    // Don't generate scale for shape of geoshape
    if (fieldOrDatumDef && mark === GEOSHAPE && channel === SHAPE && fieldOrDatumDef.type === GEOJSON) {
      continue;
    }

    let specifiedScale = fieldOrDatumDef && fieldOrDatumDef['scale'];
    if (isXorYOffset(channel)) {
      const mainChannel = getMainChannelFromOffsetChannel(channel);
      if (!channelHasNestedOffsetScale(encoding, mainChannel)) {
        // Don't generate scale when the offset encoding shouldn't yield a nested scale
        if (specifiedScale) {
          log.warn(log.message.offsetEncodingScaleIgnored(channel));
        }
        continue;
      }
    }

    if (fieldOrDatumDef && specifiedScale !== null && specifiedScale !== false) {
      specifiedScale ??= {};
      const hasNestedOffsetScale = channelHasNestedOffsetScale(encoding, channel);

      const sType = scaleType(specifiedScale, channel, fieldOrDatumDef, markDef, hasNestedOffsetScale);
      scaleComponents[channel] = new ScaleComponent(model.scaleName(`${channel}`, true), {
        value: sType,
        explicit: specifiedScale.type === sType
      });
    }
  }
  return scaleComponents;
}

const scaleTypeTieBreaker = tieBreakByComparing(
  (st1: ScaleType, st2: ScaleType) => scaleTypePrecedence(st1) - scaleTypePrecedence(st2)
);

function parseNonUnitScaleCore(model: Model) {
  const scaleComponents: ScaleComponentIndex = (model.component.scales = {});

  const scaleTypeWithExplicitIndex: Partial<Record<ScaleChannel, Explicit<ScaleType>>> = {};
  const resolve = model.component.resolve;

  // Parse each child scale and determine if a particular channel can be merged.
  for (const child of model.children) {
    parseScaleCore(child);

    // Instead of always merging right away -- check if it is compatible to merge first!
    for (const channel of keys(child.component.scales)) {
      // if resolve is undefined, set default first
      resolve.scale[channel] ??= defaultScaleResolve(channel, model);

      if (resolve.scale[channel] === 'shared') {
        const explicitScaleType = scaleTypeWithExplicitIndex[channel];
        const childScaleType = child.component.scales[channel].getWithExplicit('type');

        if (explicitScaleType) {
          if (scaleCompatible(explicitScaleType.value, childScaleType.value)) {
            // merge scale component if type are compatible
            scaleTypeWithExplicitIndex[channel] = mergeValuesWithExplicit<VgScale, ScaleType>(
              explicitScaleType,
              childScaleType,
              'type',
              'scale',
              scaleTypeTieBreaker
            );
          } else {
            // Otherwise, update conflicting channel to be independent
            resolve.scale[channel] = 'independent';
            // Remove from the index so they don't get merged
            delete scaleTypeWithExplicitIndex[channel];
          }
        } else {
          scaleTypeWithExplicitIndex[channel] = childScaleType;
        }
      }
    }
  }

  // Merge each channel listed in the index
  for (const channel of keys(scaleTypeWithExplicitIndex)) {
    // Create new merged scale component
    const name = model.scaleName(channel, true);
    const typeWithExplicit = scaleTypeWithExplicitIndex[channel];
    scaleComponents[channel] = new ScaleComponent(name, typeWithExplicit);

    // rename each child and mark them as merged
    for (const child of model.children) {
      const childScale = child.component.scales[channel];
      if (childScale) {
        child.renameScale(childScale.get('name'), name);
        childScale.merged = true;
      }
    }
  }

  return scaleComponents;
}
