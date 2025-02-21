import {SignalRef, TimeInterval} from 'vega';
import {isArray, isNumber} from 'vega-util';
import {isBinned, isBinning, isBinParams} from '../../bin.js';
import {
  COLOR,
  FILL,
  getSecondaryRangeChannel,
  isXorY,
  isXorYOffset,
  POLAR_POSITION_SCALE_CHANNELS,
  POSITION_SCALE_CHANNELS,
  ScaleChannel,
  STROKE,
} from '../../channel.js';
import {
  getFieldDef,
  getFieldOrDatumDef,
  isFieldDef,
  ScaleDatumDef,
  ScaleFieldDef,
  TypedFieldDef,
  valueExpr,
} from '../../channeldef.js';
import {Config} from '../../config.js';
import {isDateTime} from '../../datetime.js';
import {channelHasNestedOffsetScale} from '../../encoding.js';
import * as log from '../../log/index.js';
import {Mark, MarkDef, RectConfig} from '../../mark.js';
import {
  channelScalePropertyIncompatability,
  Domain,
  hasContinuousDomain,
  isContinuousToContinuous,
  isContinuousToDiscrete,
  Scale,
  ScaleConfig,
  ScaleType,
  scaleTypeSupportProperty,
} from '../../scale.js';
import {Sort} from '../../sort.js';
import {Type} from '../../type.js';
import * as util from '../../util.js';
import {contains, getFirstDefined, keys} from '../../util.js';
import {isSignalRef, VgScale} from '../../vega.schema.js';
import {getBinSignalName} from '../data/bin.js';
import {isUnitModel, Model} from '../model.js';
import {SignalRefWrapper} from '../signal.js';
import {Explicit, mergeValuesWithExplicit, tieBreakByComparing} from '../split.js';
import {UnitModel} from '../unit.js';
import {ScaleComponentIndex, ScaleComponentProps} from './component.js';
import {parseUnitScaleRange} from './range.js';

export function parseScaleProperty(model: Model, property: Exclude<keyof (Scale | ScaleComponentProps), 'range'>) {
  if (isUnitModel(model)) {
    parseUnitScaleProperty(model, property);
  } else {
    parseNonUnitScaleProperty(model, property);
  }
}

function parseUnitScaleProperty(model: UnitModel, property: Exclude<keyof (Scale | ScaleComponentProps), 'range'>) {
  const localScaleComponents: ScaleComponentIndex = model.component.scales;
  const {config, encoding, markDef, specifiedScales} = model;

  for (const channel of keys(localScaleComponents)) {
    const specifiedScale = specifiedScales[channel];
    const localScaleCmpt = localScaleComponents[channel];
    const mergedScaleCmpt = model.getScaleComponent(channel);
    const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]) as ScaleFieldDef<string, Type> | ScaleDatumDef;

    const specifiedValue = specifiedScale[property];
    const scaleType = mergedScaleCmpt.get('type');
    const scalePadding = mergedScaleCmpt.get('padding');
    const scalePaddingInner = mergedScaleCmpt.get('paddingInner');

    const supportedByScaleType = scaleTypeSupportProperty(scaleType, property);
    const channelIncompatability = channelScalePropertyIncompatability(channel, property);

    if (specifiedValue !== undefined) {
      // If there is a specified value, check if it is compatible with scale type and channel
      if (!supportedByScaleType) {
        log.warn(log.message.scalePropertyNotWorkWithScaleType(scaleType, property, channel));
      } else if (channelIncompatability) {
        // channel
        log.warn(channelIncompatability);
      }
    }
    if (supportedByScaleType && channelIncompatability === undefined) {
      if (specifiedValue !== undefined) {
        const timeUnit = (fieldOrDatumDef as any).timeUnit;
        const type = fieldOrDatumDef.type;

        switch (property) {
          // domainMax/Min to signal if the value is a datetime object
          case 'domainMax':
          case 'domainMin':
            if (isDateTime(specifiedScale[property]) || type === 'temporal' || timeUnit) {
              localScaleCmpt.set(property, {signal: valueExpr(specifiedScale[property], {type, timeUnit})}, true);
            } else {
              localScaleCmpt.set(property, specifiedScale[property] as any, true);
            }
            break;
          default:
            localScaleCmpt.copyKeyFromObject<Omit<ScaleComponentProps, 'range' | 'domainMin' | 'domainMax'>>(
              property,
              specifiedScale,
            );
        }
      } else {
        const value = util.hasProperty(scaleRules, property)
          ? scaleRules[property]({
              model,
              channel,
              fieldOrDatumDef,
              scaleType,
              scalePadding,
              scalePaddingInner,
              domain: specifiedScale.domain,
              domainMin: specifiedScale.domainMin,
              domainMax: specifiedScale.domainMax,
              markDef,
              config,
              hasNestedOffsetScale: channelHasNestedOffsetScale(encoding, channel),
              hasSecondaryRangeChannel: !!encoding[getSecondaryRangeChannel(channel)],
            })
          : config.scale[property];
        if (value !== undefined) {
          localScaleCmpt.set(property, value as any, false);
        }
      }
    }
  }
}

export interface ScaleRuleParams {
  model: Model;
  channel: ScaleChannel;
  fieldOrDatumDef: ScaleFieldDef<string, Type> | ScaleDatumDef;
  hasNestedOffsetScale: boolean;
  scaleType: ScaleType;
  scalePadding: number | SignalRef;
  scalePaddingInner: number | SignalRef;
  domain: Domain;
  domainMin: Scale['domainMin'];
  domainMax: Scale['domainMax'];
  markDef: MarkDef<Mark, SignalRef>;
  config: Config<SignalRef>;
  hasSecondaryRangeChannel: boolean;
}

export const scaleRules: {
  [k in keyof Scale]?: (params: ScaleRuleParams) => Scale[k];
} = {
  bins: ({model, fieldOrDatumDef}) => (isFieldDef(fieldOrDatumDef) ? bins(model, fieldOrDatumDef) : undefined),

  interpolate: ({channel, fieldOrDatumDef}) => interpolate(channel, fieldOrDatumDef.type),

  nice: ({scaleType, channel, domain, domainMin, domainMax, fieldOrDatumDef}) =>
    nice(scaleType, channel, domain, domainMin, domainMax, fieldOrDatumDef),

  padding: ({channel, scaleType, fieldOrDatumDef, markDef, config}) =>
    padding(channel, scaleType, config.scale, fieldOrDatumDef, markDef, config.bar),

  paddingInner: ({scalePadding, channel, markDef, scaleType, config, hasNestedOffsetScale}) =>
    paddingInner(scalePadding, channel, markDef.type, scaleType, config.scale, hasNestedOffsetScale),

  paddingOuter: ({scalePadding, channel, scaleType, scalePaddingInner, config, hasNestedOffsetScale}) =>
    paddingOuter(scalePadding, channel, scaleType, scalePaddingInner, config.scale, hasNestedOffsetScale),

  reverse: ({fieldOrDatumDef, scaleType, channel, config}) => {
    const sort = isFieldDef(fieldOrDatumDef) ? fieldOrDatumDef.sort : undefined;
    return reverse(scaleType, sort, channel, config.scale);
  },
  zero: ({channel, fieldOrDatumDef, domain, markDef, scaleType, config, hasSecondaryRangeChannel}) =>
    zero(channel, fieldOrDatumDef, domain, markDef, scaleType, config.scale, hasSecondaryRangeChannel),
};

// This method is here rather than in range.ts to avoid circular dependency.
export function parseScaleRange(model: Model) {
  if (isUnitModel(model)) {
    parseUnitScaleRange(model);
  } else {
    parseNonUnitScaleProperty(model, 'range');
  }
}

export function parseNonUnitScaleProperty(model: Model, property: keyof (Scale | ScaleComponentProps)) {
  const localScaleComponents: ScaleComponentIndex = model.component.scales;

  for (const child of model.children) {
    if (property === 'range') {
      parseScaleRange(child);
    } else {
      parseScaleProperty(child, property);
    }
  }

  for (const channel of keys(localScaleComponents)) {
    let valueWithExplicit: Explicit<any>;

    for (const child of model.children) {
      const childComponent = child.component.scales[channel];
      if (childComponent) {
        const childValueWithExplicit = childComponent.getWithExplicit(property);
        valueWithExplicit = mergeValuesWithExplicit<VgScale, any>(
          valueWithExplicit,
          childValueWithExplicit,
          property,
          'scale',
          tieBreakByComparing<VgScale, any>((v1, v2) => {
            switch (property) {
              case 'range':
                // For step, prefer larger step
                if (v1.step && v2.step) {
                  return v1.step - v2.step;
                }
                return 0;
              // TODO: precedence rule for other properties
            }
            return 0;
          }),
        );
      }
    }
    localScaleComponents[channel].setWithExplicit(property, valueWithExplicit);
  }
}

export function bins(model: Model, fieldDef: TypedFieldDef<string>) {
  const bin = fieldDef.bin;
  if (isBinning(bin)) {
    const binSignal = getBinSignalName(model, fieldDef.field, bin);
    return new SignalRefWrapper(() => {
      return model.getSignalName(binSignal);
    });
  } else if (isBinned(bin) && isBinParams(bin) && bin.step !== undefined) {
    // start and stop will be determined from the scale domain
    return {
      step: bin.step,
    };
  }
  return undefined;
}

export function interpolate(channel: ScaleChannel, type: Type): Scale['interpolate'] {
  if (contains([COLOR, FILL, STROKE], channel) && type !== 'nominal') {
    return 'hcl';
  }
  return undefined;
}

export function nice(
  scaleType: ScaleType,
  channel: ScaleChannel,
  specifiedDomain: Domain,
  domainMin: Scale['domainMin'],
  domainMax: Scale['domainMax'],
  fieldOrDatumDef: TypedFieldDef<string> | ScaleDatumDef,
): boolean | TimeInterval {
  if (
    getFieldDef(fieldOrDatumDef)?.bin ||
    isArray(specifiedDomain) ||
    domainMax != null ||
    domainMin != null ||
    util.contains([ScaleType.TIME, ScaleType.UTC], scaleType)
  ) {
    return undefined;
  }
  return isXorY(channel) ? true : undefined;
}

export function padding(
  channel: ScaleChannel,
  scaleType: ScaleType,
  scaleConfig: ScaleConfig<SignalRef>,
  fieldOrDatumDef: TypedFieldDef<string> | ScaleDatumDef,
  markDef: MarkDef<Mark, SignalRef>,
  barConfig: RectConfig<SignalRef>,
) {
  if (isXorY(channel)) {
    if (isContinuousToContinuous(scaleType)) {
      if (scaleConfig.continuousPadding !== undefined) {
        return scaleConfig.continuousPadding;
      }

      const {type, orient} = markDef;
      if (type === 'bar' && !(isFieldDef(fieldOrDatumDef) && (fieldOrDatumDef.bin || fieldOrDatumDef.timeUnit))) {
        if ((orient === 'vertical' && channel === 'x') || (orient === 'horizontal' && channel === 'y')) {
          return barConfig.continuousBandSize;
        }
      }
    }

    if (scaleType === ScaleType.POINT) {
      return scaleConfig.pointPadding;
    }
  }
  return undefined;
}

export function paddingInner(
  paddingValue: number | SignalRef,
  channel: ScaleChannel,
  mark: Mark,
  scaleType: ScaleType,
  scaleConfig: ScaleConfig<SignalRef>,
  hasNestedOffsetScale = false,
) {
  if (paddingValue !== undefined) {
    // If user has already manually specified "padding", no need to add default paddingInner.
    return undefined;
  }

  if (isXorY(channel)) {
    // Padding is only set for X and Y by default.
    // Basically it doesn't make sense to add padding for color and size.

    // paddingOuter would only be called if it's a band scale, just return the default for bandScale.
    const {
      bandPaddingInner,
      barBandPaddingInner,
      rectBandPaddingInner,
      tickBandPaddingInner,
      bandWithNestedOffsetPaddingInner,
    } = scaleConfig;

    if (hasNestedOffsetScale) {
      return bandWithNestedOffsetPaddingInner;
    }

    return getFirstDefined(
      bandPaddingInner,
      mark === 'bar' ? barBandPaddingInner : mark === 'tick' ? tickBandPaddingInner : rectBandPaddingInner,
    );
  } else if (isXorYOffset(channel)) {
    if (scaleType === ScaleType.BAND) {
      return scaleConfig.offsetBandPaddingInner;
    }
  }
  return undefined;
}

export function paddingOuter(
  paddingValue: number | SignalRef,
  channel: ScaleChannel,
  scaleType: ScaleType,
  paddingInnerValue: number | SignalRef,
  scaleConfig: ScaleConfig<SignalRef>,
  hasNestedOffsetScale = false,
) {
  if (paddingValue !== undefined) {
    // If user has already manually specified "padding", no need to add default paddingOuter.
    return undefined;
  }

  if (isXorY(channel)) {
    const {bandPaddingOuter, bandWithNestedOffsetPaddingOuter} = scaleConfig;
    if (hasNestedOffsetScale) {
      return bandWithNestedOffsetPaddingOuter;
    }
    // Padding is only set for X and Y by default.
    // Basically it doesn't make sense to add padding for color and size.
    if (scaleType === ScaleType.BAND) {
      return getFirstDefined(
        bandPaddingOuter,
        /* By default, paddingOuter is paddingInner / 2. The reason is that
          size (width/height) = step * (cardinality - paddingInner + 2 * paddingOuter).
          and we want the width/height to be integer by default.
          Note that step (by default) and cardinality are integers.) */
        isSignalRef(paddingInnerValue) ? {signal: `${paddingInnerValue.signal}/2`} : paddingInnerValue / 2,
      );
    }
  } else if (isXorYOffset(channel)) {
    if (scaleType === ScaleType.POINT) {
      return 0.5; // so the point positions align with centers of band scales.
    } else if (scaleType === ScaleType.BAND) {
      return scaleConfig.offsetBandPaddingOuter;
    }
  }
  return undefined;
}

export function reverse(
  scaleType: ScaleType,
  sort: Sort<string>,
  channel: ScaleChannel,
  scaleConfig: ScaleConfig<SignalRef>,
) {
  if (channel === 'x' && scaleConfig.xReverse !== undefined) {
    if (hasContinuousDomain(scaleType) && sort === 'descending') {
      if (isSignalRef(scaleConfig.xReverse)) {
        return {signal: `!${scaleConfig.xReverse.signal}`};
      } else {
        return !scaleConfig.xReverse;
      }
    }
    return scaleConfig.xReverse;
  }

  if (hasContinuousDomain(scaleType) && sort === 'descending') {
    // For continuous domain scales, Vega does not support domain sort.
    // Thus, we reverse range instead if sort is descending
    return true;
  }
  return undefined;
}

export function zero(
  channel: ScaleChannel,
  fieldDef: TypedFieldDef<string> | ScaleDatumDef,
  specifiedDomain: Domain,
  markDef: MarkDef,
  scaleType: ScaleType,
  scaleConfig: ScaleConfig<SignalRef>,
  hasSecondaryRangeChannel: boolean,
) {
  // If users explicitly provide a domain, we should not augment zero as that will be unexpected.
  const hasCustomDomain = !!specifiedDomain && specifiedDomain !== 'unaggregated';
  if (hasCustomDomain) {
    if (hasContinuousDomain(scaleType)) {
      if (isArray(specifiedDomain)) {
        const first = specifiedDomain[0];
        const last = specifiedDomain[specifiedDomain.length - 1];

        if (isNumber(first) && first <= 0 && isNumber(last) && last >= 0) {
          // if the domain includes zero, make zero remain true
          return true;
        }
      }
      return false;
    }
  }

  // If there is no custom domain, return configZero value (=`true` as default) only for the following cases:

  // 1) using quantitative field with size
  // While this can be either ratio or interval fields, our assumption is that
  // ratio are more common. However, if the scaleType is discretizing scale, we want to return
  // false so that range doesn't start at zero
  if (channel === 'size' && fieldDef.type === 'quantitative' && !isContinuousToDiscrete(scaleType)) {
    return true;
  }

  // 2) non-binned, quantitative x-scale or y-scale
  // (For binning, we should not include zero by default because binning are calculated without zero.)
  // (For area/bar charts with ratio scale chart, we should always include zero.)
  if (
    !(isFieldDef(fieldDef) && fieldDef.bin) &&
    util.contains([...POSITION_SCALE_CHANNELS, ...POLAR_POSITION_SCALE_CHANNELS], channel)
  ) {
    const {orient, type} = markDef;
    if (contains(['bar', 'area', 'line', 'trail'], type)) {
      if ((orient === 'horizontal' && channel === 'y') || (orient === 'vertical' && channel === 'x')) {
        return false;
      }
    }

    if (contains(['bar', 'area'], type) && !hasSecondaryRangeChannel) {
      return true;
    }

    return scaleConfig?.zero;
  }

  return false;
}
