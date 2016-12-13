import * as log from '../../log';

import {Channel} from '../../channel';
import {ChannelDefWithScale} from '../../fielddef';
import {Mark} from '../../mark';
import {Scale, ScaleConfig, ScaleType, scaleTypeSupportProperty} from '../../scale';

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
        let value: any;

        // If we have default rule-base, determine default value first

        if (property === 'nice') {
          value = rules.nice(scale.type, channel, fieldDef);
        } else if (property === 'padding') {
          value = rules.padding(channel, scale.type, scaleConfig);
        } else if (property === 'paddingInner') {
          value = rules.paddingInner(scale.padding, channel, scaleConfig);
        } else if (property === 'paddingOuter') {
          value = rules.paddingOuter(scale.padding, channel, scale.type, scale.paddingInner, scaleConfig);
        } else if (property === 'round') {
          value = rules.round(channel, scaleConfig);
        } else if (property === 'zero') {
          value = rules.zero(scale, channel, fieldDef);
        } else {
          value = scaleConfig[property];
        }

        if (value !== undefined) { // use the default value
          scale[property] = value;
        }
      }
    }
  });
  return scale;
}

function channelScalePropertyIncompatability(channel: Channel, propName: string): string {
  switch (propName) {
    case 'range':
      // User should not customize range for position and facet channel directly.
      if (channel === 'x' || channel === 'y') {
        return log.message.CANNOT_USE_RANGE_WITH_POSITION;
      }
      if (channel === 'row' || channel === 'column') {
        return log.message.cannotUseRangePropertyWithFacet('range');
      }
      return undefined; // GOOD!
    // band / point
    case 'rangeStep':
      if (channel === 'row' || channel === 'column') {
        return log.message.cannotUseRangePropertyWithFacet('rangeStep');
      }
      return undefined; // GOOD!
    case 'padding':
    case 'paddingInner':
    case 'paddingOuter':
      if (channel === 'row' || channel === 'column') {
        /*
         * We do not use d3 scale's padding for row/column because padding there
         * is a ratio ([0, 1]) and it causes the padding to be decimals.
         * Therefore, we manually calculate "spacing" in the layout by ourselves.
         */
        return log.message.CANNOT_USE_PADDING_WITH_FACET;
      }
      return undefined; // GOOD!
    case 'scheme':
      if (channel !== 'color') {
        return log.message.CANNOT_USE_SCHEME_WITH_NON_COLOR;
      }
      return undefined;
    case 'type':
    case 'domain':
    case 'round':
    case 'clamp':
    case 'exponent':
    case 'nice':
    case 'zero':
    case 'useRawDomain':
      // These channel do not have strict requirement
      return undefined; // GOOD!
  }
  /* istanbul ignore next: it should never reach here */
  throw new Error('Invalid scale property "${propName}".');
}
