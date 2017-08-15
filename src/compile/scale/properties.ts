import {Channel, ScaleChannel, X, Y} from '../../channel';
import {FieldDef} from '../../fielddef';
import * as log from '../../log';
import {channelScalePropertyIncompatability, Domain, hasContinuousDomain, NiceTime, Scale, ScaleConfig, ScaleType, scaleTypeSupportProperty} from '../../scale';
import {SortField, SortOrder} from '../../sort';
import {smallestUnit} from '../../timeunit';
import * as util from '../../util';
import {keys} from '../../util';
import {VgScale} from '../../vega.schema';
import {isUnitModel, Model} from '../model';
import {Explicit, mergeValuesWithExplicit, tieBreakByComparing} from '../split';
import {UnitModel} from '../unit';
import {ScaleComponent, ScaleComponentIndex, ScaleComponentProps} from './component';
import {parseScaleRange} from './range';


export function parseScaleProperty(model: Model, property: keyof (Scale | ScaleComponentProps)) {
  if (isUnitModel(model)) {
    parseUnitScaleProperty(model, property);
  } else {
    parseNonUnitScaleProperty(model, property);
  }
}

function parseUnitScaleProperty(model: UnitModel, property: keyof (Scale | ScaleComponentProps)) {
  const localScaleComponents: ScaleComponentIndex = model.component.scales;

  keys(localScaleComponents).forEach((channel: ScaleChannel) => {
    const specifiedScale = model.specifiedScales[channel];
    const localScaleCmpt = localScaleComponents[channel];
    const mergedScaleCmpt = model.getScaleComponent(channel);
    const fieldDef = model.fieldDef(channel);
    const sort = model.sort(channel);
    const config = model.config;

    const specifiedValue = specifiedScale[property];
    const sType = mergedScaleCmpt.get('type');

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
      if (specifiedValue !== undefined) {
        // copyKeyFromObject ensure type safety
        localScaleCmpt.copyKeyFromObject(property, specifiedScale);
      } else {
        const value = getDefaultValue(property, specifiedScale, mergedScaleCmpt, channel, fieldDef, sort, config.scale);
        if (value !== undefined) {
          localScaleCmpt.set(property, value, false);
        }
      }
    }
  });
}

function getDefaultValue(property: keyof Scale, specifiedScale: Scale, scaleCmpt: ScaleComponent, channel: Channel, fieldDef: FieldDef<string>, sort: SortOrder | SortField, scaleConfig: ScaleConfig) {

  // If we have default rule-base, determine default value first
  switch (property) {
    case 'nice':
      return nice(scaleCmpt.get('type'), channel, fieldDef);
    case 'padding':
      return padding(channel, scaleCmpt.get('type'), scaleConfig);
    case 'paddingInner':
      return paddingInner(scaleCmpt.get('padding'), channel, scaleConfig);
    case 'paddingOuter':
      return paddingOuter(scaleCmpt.get('padding'), channel, scaleCmpt.get('type'), scaleCmpt.get('paddingInner'), scaleConfig);
    case 'round':
      return round(channel, scaleConfig);
    case 'reverse':
      return reverse(scaleCmpt.get('type'), sort);
    case 'zero':
      return zero(channel, fieldDef, specifiedScale.domain);
  }
  // Otherwise, use scale config
  return scaleConfig[property];
}

export function parseNonUnitScaleProperty(model: Model, property: keyof (Scale | ScaleComponentProps)) {
  const localScaleComponents: ScaleComponentIndex = model.component.scales;

  for (const child of model.children) {
    if (property === 'range') {
      parseScaleRange(child);
    }  else {
      parseScaleProperty(child, property);
    }
  }

  keys(localScaleComponents).forEach((channel: ScaleChannel) => {
    let valueWithExplicit: Explicit<any>;

    for (const child of model.children) {
      const childComponent = child.component.scales[channel];
      if (childComponent) {
        const childValueWithExplicit = childComponent.getWithExplicit(property);
        valueWithExplicit = mergeValuesWithExplicit<VgScale, any>(
          valueWithExplicit, childValueWithExplicit,
          property,
          'scale',
          tieBreakByComparing<VgScale, any>((v1, v2) => {
            switch (property) {
              case 'range':
                // For range step, prefer larger step
                if (v1.step && v2.step) {
                  return v1.step - v2.step;
                }
                return 0;
              // TODO: precedence rule for other properties
            }
            return 0;
          })
        );
      }
    }
    localScaleComponents[channel].setWithExplicit(property, valueWithExplicit);
  });
}



export function nice(scaleType: ScaleType, channel: Channel, fieldDef: FieldDef<string>): boolean | NiceTime {
  if (util.contains([ScaleType.TIME, ScaleType.UTC], scaleType)) {
    return smallestUnit(fieldDef.timeUnit) as any;
  }
  if (fieldDef.bin) {
    return undefined;
  }
  return util.contains([X, Y], channel); // return true for quantitative X/Y unless binned
}

export function padding(channel: Channel, scaleType: ScaleType, scaleConfig: ScaleConfig) {
  if (util.contains([X, Y], channel)) {
    if (scaleType === ScaleType.POINT) {
      return scaleConfig.pointPadding;
    }
  }
  return undefined;
}

export function paddingInner(padding: number, channel: Channel,  scaleConfig: ScaleConfig) {
  if (padding !== undefined) {
    // If user has already manually specified "padding", no need to add default paddingInner.
    return undefined;
  }

  if (util.contains([X, Y], channel)) {
    // Padding is only set for X and Y by default.
    // Basically it doesn't make sense to add padding for color and size.

    // paddingOuter would only be called if it's a band scale, just return the default for bandScale.
    return scaleConfig.bandPaddingInner;
  }
  return undefined;
}

export function paddingOuter(padding: number, channel: Channel, scaleType: ScaleType, paddingInner: number, scaleConfig: ScaleConfig) {
  if (padding !== undefined) {
    // If user has already manually specified "padding", no need to add default paddingOuter.
    return undefined;
  }

  if (util.contains([X, Y], channel)) {
    // Padding is only set for X and Y by default.
    // Basically it doesn't make sense to add padding for color and size.
    if (scaleType === ScaleType.BAND) {
      if (scaleConfig.bandPaddingOuter !== undefined) {
        return scaleConfig.bandPaddingOuter;
      }
      /* By default, paddingOuter is paddingInner / 2. The reason is that
          size (width/height) = step * (cardinality - paddingInner + 2 * paddingOuter).
          and we want the width/height to be integer by default.
          Note that step (by default) and cardinality are integers.) */
      return paddingInner / 2;
    }
  }
  return undefined;
}

export function round(channel: Channel, scaleConfig: ScaleConfig) {
  if (util.contains(['x', 'y'], channel)) {
    return scaleConfig.round;
  }
  return undefined;
}

export function reverse(scaleType: ScaleType, sort: SortOrder | SortField) {
  if (hasContinuousDomain(scaleType) && sort === 'descending') {
    // For continuous domain scales, Vega does not support domain sort.
    // Thus, we reverse range instead if sort is descending
    return true;
  }
  return undefined;
}

export function zero(channel: Channel, fieldDef: FieldDef<string>, specifiedScale: Domain) {
  // By default, return true only for the following cases:

  // 1) using quantitative field with size
  // While this can be either ratio or interval fields, our assumption is that
  // ratio are more common.
  if (channel === 'size' && fieldDef.type === 'quantitative') {
    return true;
  }

  // 2) non-binned, quantitative x-scale or y-scale if no custom domain is provided.
  // (For binning, we should not include zero by default because binning are calculated without zero.
  // Similar, if users explicitly provide a domain range, we should not augment zero as that will be unexpected.)
  const hasCustomDomain = !!specifiedScale && specifiedScale !== 'unaggregated';
  if (!hasCustomDomain && !fieldDef.bin && util.contains([X, Y], channel)) {
    return true;
  }
  return false;
}
