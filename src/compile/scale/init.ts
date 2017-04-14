import * as log from '../../log';

import {Channel} from '../../channel';
import {Config} from '../../config';
import {FieldDef, ScaleFieldDef} from '../../fielddef';
import {Mark} from '../../mark';
import {channelScalePropertyIncompatability, Scale, ScaleConfig, scaleTypeSupportProperty} from '../../scale';
import * as util from '../../util';

import {initDomain} from './domain';
import rangeMixins from './range';
import * as rules from './rules';
import scaleType from './type';

/**
 * All scale properties except type and all range properties.
 */
export const NON_TYPE_RANGE_SCALE_PROPERTIES: (keyof Scale)[] = [
  // general properties
  'domain', // For domain, we only copy specified value here.  Default value is determined during parsing phase.
  'round',
  // quantitative / time
  'clamp', 'nice',
  // quantitative
  'exponent', 'zero', // zero depends on domain
  'interpolate',
  // ordinal
  'padding', 'paddingInner', 'paddingOuter' // padding
];

/**
 * Initialize Vega-Lite Scale's properties
 *
 * Note that we have to apply these rules here because:
 * - many other scale and non-scale properties (including layout, mark) depend on scale type
 * - layout depends on padding
 * - range depends on zero and size (width and height) depends on range
 */
export default function init(
    channel: Channel, fieldDef: ScaleFieldDef, config: Config,
    mark: Mark | undefined, topLevelSize: number | undefined, xyRangeSteps: number[]): Scale {
  const specifiedScale = (fieldDef || {}).scale || {};

  const scale: Scale = {
    type: scaleType(
      specifiedScale.type, channel, fieldDef, mark, topLevelSize !== undefined,
      specifiedScale.rangeStep, config.scale
    )
  };

  // Use specified value if compatible or determine default values for each property
  NON_TYPE_RANGE_SCALE_PROPERTIES.forEach(function(property) {
    const specifiedValue = specifiedScale[property];

    const supportedByScaleType = scaleTypeSupportProperty(scale.type, property);
    const channelIncompatability = channelScalePropertyIncompatability(channel, property);

    if (specifiedValue !== undefined) {
      // If there is a specified value, check if it is compatible with scale type and channel
      if (!supportedByScaleType) {
        log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, property, channel));
      } else if (channelIncompatability) { // channel
        log.warn(channelIncompatability);
      }
    }
    if (supportedByScaleType && channelIncompatability === undefined) {
      const value = getValue(specifiedValue, property, scale, channel, fieldDef, config.scale);
      if (value !== undefined) { // use the default value
        scale[property] = value;
      }
    }
  });

  return util.extend(
    scale,
    rangeMixins(
      channel, scale.type, fieldDef.type, specifiedScale, config,
      scale.zero, mark, topLevelSize, xyRangeSteps
    )
  );
}

function getValue(specifiedValue: any, property: keyof Scale, scale: Scale, channel: Channel, fieldDef: FieldDef, scaleConfig: ScaleConfig) {
  // For domain, we might override specified value
  if (property === 'domain') {
    return initDomain(specifiedValue, fieldDef, scale.type, scaleConfig);
  }

  // Other properties, no overriding default values
  if (specifiedValue !== undefined) {
    return specifiedValue;
  }
  return getDefaultValue(property, scale, channel, fieldDef, scaleConfig);
}

function getDefaultValue(property: keyof Scale, scale: Scale, channel: Channel, fieldDef: FieldDef, scaleConfig: ScaleConfig) {

  // If we have default rule-base, determine default value first
  switch (property) {
    case 'nice':
      return rules.nice(scale.type, channel, fieldDef);
    case 'padding':
      return rules.padding(channel, scale.type, scaleConfig);
    case 'paddingInner':
      return rules.paddingInner(scale.padding, channel, scaleConfig);
    case 'paddingOuter':
      return rules.paddingOuter(scale.padding, channel, scale.type, scale.paddingInner, scaleConfig);
    case 'round':
      return rules.round(channel, scaleConfig);
    case 'zero':
      return rules.zero(scale, channel, fieldDef);
  }
  // Otherwise, use scale config
  return scaleConfig[property];
}
