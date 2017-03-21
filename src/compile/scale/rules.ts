
import {Channel, X, Y} from '../../channel';
import {FieldDef} from '../../fielddef';
import {NiceTime, Scale, ScaleConfig, ScaleType} from '../../scale';
import {smallestUnit} from '../../timeunit';
import * as util from '../../util';

export function nice(scaleType: ScaleType, channel: Channel, fieldDef: FieldDef): boolean | NiceTime {
  if (util.contains([ScaleType.TIME, ScaleType.UTC], scaleType)) {
    return smallestUnit(fieldDef.timeUnit) as any;
  }
  return util.contains([X, Y], channel); // return true for quantitative X/Y
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
  if (util.contains(['x', 'y', 'row', 'column'], channel)) {
    return scaleConfig.round;
  }
  return undefined;
}

export function zero(specifiedScale: Scale, channel: Channel, fieldDef: FieldDef) {
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
  if (!specifiedScale.domain && !fieldDef.bin && util.contains([X, Y], channel)) {
    return true;
  }
  return false;
}
