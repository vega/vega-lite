import {Channel} from '../../channel';
import {Config} from '../../config';
import {FieldDef, ScaleFieldDef} from '../../fielddef';
import * as log from '../../log';
import {Mark} from '../../mark';
import {channelScalePropertyIncompatability, Scale, ScaleConfig, scaleTypeSupportProperty} from '../../scale';
import * as util from '../../util';
import {Split} from '../split';
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
    channel: Channel, fieldDef: FieldDef<string>, specifiedScale: Scale = {}, config: Config,
    mark: Mark | undefined, topLevelSize: number | undefined, xyRangeSteps: number[]): Split<Scale> {

  const splitScale = new Split<Scale>();

  const sType = scaleType(
    specifiedScale.type, channel, fieldDef, mark, topLevelSize !== undefined,
    specifiedScale.rangeStep, config.scale
  );
  splitScale.set('type', sType, sType === specifiedScale.type);


  // Use specified value if compatible or determine default values for each property
  NON_TYPE_RANGE_SCALE_PROPERTIES.forEach(function(property) {
    const specifiedValue = specifiedScale[property];

    const supportedByScaleType = scaleTypeSupportProperty(sType, property);
    const channelIncompatability = channelScalePropertyIncompatability(channel, property);

    if (specifiedValue !== undefined) {
      // If there is a specified value, check if it is compatible with scale type and channel
      if (!supportedByScaleType) {
        log.warn(log.message.scalePropertyNotWorkWithScaleType(sType, property, channel));
      } else if (channelIncompatability) { // channel
        log.warn(channelIncompatability);
      }
    }
    if (supportedByScaleType && channelIncompatability === undefined) {
      const value = getValue(specifiedValue, property, splitScale, channel, fieldDef, config.scale);
      if (value !== undefined) {
        splitScale.set(property, value, value === specifiedValue);
      }
    }
  });


  const {explicit, mixins} = rangeMixins(
    channel, sType, fieldDef.type, specifiedScale, config,
    splitScale.get('zero'), mark, topLevelSize, xyRangeSteps
  );

  return splitScale.extend(mixins, explicit);
}

function getValue(specifiedValue: any, property: keyof Scale, scale: Split<Scale>, channel: Channel, fieldDef: FieldDef<string>, scaleConfig: ScaleConfig) {
  // For domain, we might override specified value
  if (property === 'domain') {
    return initDomain(specifiedValue, fieldDef, scale.get('type'), scaleConfig);
  }

  // Other properties, no overriding default values
  if (specifiedValue !== undefined) {
    return specifiedValue;
  }
  return getDefaultValue(property, scale, channel, fieldDef, scaleConfig);
}

function getDefaultValue(property: keyof Scale, scale: Split<Scale>, channel: Channel, fieldDef: FieldDef<string>, scaleConfig: ScaleConfig) {

  // If we have default rule-base, determine default value first
  switch (property) {
    case 'nice':
      return rules.nice(scale.get('type'), channel, fieldDef);
    case 'padding':
      return rules.padding(channel, scale.get('type'), scaleConfig);
    case 'paddingInner':
      return rules.paddingInner(scale.get('padding'), channel, scaleConfig);
    case 'paddingOuter':
      return rules.paddingOuter(scale.get('padding'), channel, scale.get('type'), scale.get('paddingInner'), scaleConfig);
    case 'round':
      return rules.round(channel, scaleConfig);
    case 'zero':
      return rules.zero(scale, channel, fieldDef);
  }
  // Otherwise, use scale config
  return scaleConfig[property];
}
