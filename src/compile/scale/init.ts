import * as log from '../../log';

import {Channel} from '../../channel';
import {ChannelDefWithScale, FieldDef} from '../../fielddef';
import {Mark} from '../../mark';
import {Scale, ScaleConfig, ScaleType, scaleTypeSupportProperty} from '../../scale';

import {channelScalePropertyIncompatability} from './scale';
import {rangeStep} from './range';
import * as rules from './rules';
import {type} from './type';

export default function init(topLevelSize: number | undefined, mark: Mark | undefined,
    channel: Channel, fieldDef: ChannelDefWithScale, scaleConfig: ScaleConfig): Scale {
  let specifiedScale = (fieldDef || {}).scale || {};
  let scale: Scale = {};

  const rangeProperties: any[] = ((scale.rangeStep ? ['rangeStep'] : []) as any[]).concat(
    scale.scheme ? ['scheme'] : [],
    scale.range ? ['range'] : []
  );

  if (rangeProperties.length > 1) {
    log.warn(log.message.mutuallyExclusiveScaleProperties(rangeProperties));
  }

  // initialize rangeStep as if it's an ordinal scale first since ordinal scale type depends on this.
  const step = rangeStep(specifiedScale.rangeStep, topLevelSize, mark, channel, scaleConfig);
  scale.type = type(specifiedScale.type, fieldDef, channel, mark, !!step);

  if ((scale.type === ScaleType.POINT || scale.type === ScaleType.BAND)) {
    if (step !== undefined) {
      scale.rangeStep = step;
    }
  } else if (specifiedScale.rangeStep !== undefined) {
    log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, 'rangeStep', channel));
  }

  // Use specified value if compatible or determine default values for each property
  [
    // general properties
    'domain', // For domain, we only copy specified value here.  Default value is determined during parsing phase.
    'round',
    'range',
    'scheme',
    // quantitative / time
    'clamp', 'nice',
    // quantitative
    'exponent', 'zero', // zero depends on domain
    // ordinal
    'padding', 'paddingInner', 'paddingOuter', // padding

    // FIXME: useRawDomain should not be included here as it is not really a Vega scale property
    'useRawDomain'
  ].forEach(function(property) {
    const specifiedValue = specifiedScale[property];

    let supportedByScaleType = scaleTypeSupportProperty(scale.type, property);
    const channelIncompatability = channelScalePropertyIncompatability(channel, property);

    if (specifiedValue !== undefined) {
      // If there is a specified value, check if it is compatible with scale type and channel
      if (!supportedByScaleType) {
        log.warn(log.message.scalePropertyNotWorkWithScaleType(scale.type, property, channel));
      } else if (channelIncompatability) { // channel
        log.warn(channelIncompatability);
      } else {
        scale[property] = specifiedValue;
      }
      return;
    } else {
      // If there is no property specified, check if we need to determine default value.
      if (supportedByScaleType && channelIncompatability === undefined) {
        const value = getDefaultValue(property, scale, channel, fieldDef, scaleConfig);
        if (value !== undefined) { // use the default value
          scale[property] = value;
        }
      }
    }
  });
  return scale;
}

function getDefaultValue(property: string, scale: Scale, channel: Channel, fieldDef: FieldDef, scaleConfig: ScaleConfig) {
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

