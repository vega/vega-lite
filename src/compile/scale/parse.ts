import {getScaleChannelForKey, ScaleKey, SHAPE} from '../../channel.js';
import {ScaleDatumDef, TypedFieldDef} from '../../channeldef.js';
import {channelHasNestedOffsetScale} from '../../encoding.js';
import {GEOSHAPE} from '../../mark.js';
import {
  NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES,
  scaleCompatible,
  ScaleType,
  scaleTypePrecedence,
} from '../../scale.js';
import {GEOJSON} from '../../type.js';
import {keys} from '../../util.js';
import {VgScale} from '../../vega.schema.js';
import {isUnitModel, Model} from '../model.js';
import {defaultScaleResolve} from '../resolve.js';
import {Explicit, mergeValuesWithExplicit, tieBreakByComparing} from '../split.js';
import {UnitModel} from '../unit.js';
import {ScaleComponent, ScaleComponentIndex} from './component.js';
import {parseScaleDomain} from './domain.js';
import {parseScaleProperty, parseScaleRange} from './properties.js';
import {scaleType} from './type.js';

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
  for (const key of model.scaleKeys()) {
    const channel = getScaleChannelForKey(key);
    const fieldOrDatumDef = model.scaleDef(key) as TypedFieldDef<string> | ScaleDatumDef; // must be typed def to have scale

    // Don't generate scale for shape of geoshape
    if (fieldOrDatumDef && mark === GEOSHAPE && channel === SHAPE && fieldOrDatumDef.type === GEOJSON) {
      continue;
    }

    let specifiedScale = fieldOrDatumDef && model.specifiedScale(key);
    if (fieldOrDatumDef && (fieldOrDatumDef as {scale?: unknown}).scale !== null && specifiedScale !== null) {
      specifiedScale ??= {};
      const offsetKeys = channel === 'xOffset' || channel === 'yOffset' ? model.offsetScaleKeys(channel) : [];
      const hasNestedOffsetScale =
        channelHasNestedOffsetScale(encoding, channel) ||
        (offsetKeys.length > 0 && offsetKeys.indexOf(key as any) < offsetKeys.length - 1);

      const sType = scaleType(specifiedScale, channel, fieldOrDatumDef, markDef, hasNestedOffsetScale);
      scaleComponents[key] = new ScaleComponent(model.scaleName(key, true), {
        value: sType,
        explicit: specifiedScale.type === sType,
      });
    }
  }
  return scaleComponents;
}

const scaleTypeTieBreaker = tieBreakByComparing(
  (st1: ScaleType, st2: ScaleType) => scaleTypePrecedence(st1) - scaleTypePrecedence(st2),
);

function parseNonUnitScaleCore(model: Model) {
  const scaleComponents: ScaleComponentIndex = (model.component.scales = {});

  const scaleTypeWithExplicitIndex: Partial<Record<ScaleKey, Explicit<ScaleType>>> = {};
  const resolve = model.component.resolve;

  // Parse each child scale and determine if a particular channel can be merged.
  for (const child of model.children) {
    parseScaleCore(child);

    // Instead of always merging right away -- check if it is compatible to merge first!
    for (const key of keys(child.component.scales) as ScaleKey[]) {
      const channel = getScaleChannelForKey(key);
      // if resolve is undefined, set default first
      resolve.scale[channel] ??= defaultScaleResolve(channel, model);

      if (resolve.scale[channel] === 'shared') {
        const explicitScaleType = scaleTypeWithExplicitIndex[key];
        const childScaleType = child.component.scales[key].getWithExplicit('type');

        if (explicitScaleType) {
          if (scaleCompatible(explicitScaleType.value, childScaleType.value)) {
            // merge scale component if type are compatible
            scaleTypeWithExplicitIndex[key] = mergeValuesWithExplicit<VgScale, ScaleType>(
              explicitScaleType,
              childScaleType,
              'type',
              'scale',
              scaleTypeTieBreaker,
            );
          } else {
            // Otherwise, update conflicting channel to be independent
            resolve.scale[channel] = 'independent';
            // Remove from the index so they don't get merged
            delete scaleTypeWithExplicitIndex[key];
          }
        } else {
          scaleTypeWithExplicitIndex[key] = childScaleType;
        }
      }
    }
  }

  // Merge each channel listed in the index
  for (const key of keys(scaleTypeWithExplicitIndex) as ScaleKey[]) {
    // Create new merged scale component
    const name = model.scaleName(key, true);
    const typeWithExplicit = scaleTypeWithExplicitIndex[key];
    scaleComponents[key] = new ScaleComponent(name, typeWithExplicit);

    // rename each child and mark them as merged
    for (const child of model.children) {
      const childScale = child.component.scales[key];
      if (childScale) {
        child.renameScale(childScale.get('name'), name);
        childScale.merged = true;
      }
    }
  }

  return scaleComponents;
}
