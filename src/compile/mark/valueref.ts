/**
 * Utility files for producing Vega ValueRef for marks
 */

import {Channel, X, X2, Y, Y2} from '../../channel';
import {Config} from '../../config';
import {FieldDef, FieldRefOption, field} from '../../fielddef';
import {Scale, ScaleType} from '../../scale';
import {StackProperties} from '../../stack';
import {contains} from '../../util';
import {VgValueRef} from '../../vega.schema';

// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.

/**
 * @return Vega ValueRef for stackable x or y
 */
export function stackable(channel: Channel, fieldDef: FieldDef, scaleName: string, scale: Scale,
    stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
  if (fieldDef && stack && channel === stack.fieldChannel) {
    // x or y use stack_end so that stacked line's point mark use stack_end too.
    return fieldRef(fieldDef, scaleName, {suffix: 'end'});
  }
  return normal(channel, fieldDef, scaleName, scale, defaultRef);
}

/**
 * @return Vega ValueRef for stackable x2 or y2
 */
export function stackable2(channel: Channel, aFieldDef: FieldDef, a2fieldDef: FieldDef, scaleName: string, scale: Scale,
    stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
  if (aFieldDef && stack &&
      // If fieldChannel is X and channel is X2 (or Y and Y2)
      (channel as any as string).charAt(0) === (stack.fieldChannel as any as string).charAt(0)
      ) {
    return fieldRef(aFieldDef, scaleName, {suffix: 'start'});
  }
  return normal(channel, a2fieldDef, scaleName, scale, defaultRef);
}

/**
 * Value Ref for binned fields
 */
export function bin(fieldDef: FieldDef, scaleName: string, side: 'start' | 'end',  offset?: number) {
  return fieldRef(fieldDef, scaleName, {binSuffix: side}, offset);
}

export function fieldRef(fieldDef: FieldDef, scaleName: string, opt: FieldRefOption, offset?: number): VgValueRef {
  let ref: VgValueRef = {
    scale: scaleName,
    field: field(fieldDef, opt),
  };
  if (offset) {
    ref.offset = offset;
  }
  return ref;
}

export function band(scaleName: string, offset?: number) {
  let ref: VgValueRef = {
    scale: scaleName,
    band: true
  };
  if (offset) {
    ref.offset = offset;
  }
  return ref;
}


export function normal(channel: Channel, fieldDef: FieldDef, scaleName: string, scale: Scale,
defaultRef: VgValueRef | 'base' | 'baseOrMax'): VgValueRef {
  // TODO: datum support

  if (fieldDef) {
    if (fieldDef.field) {
      if (scale.type === ScaleType.ORDINAL) {
        return fieldRef(fieldDef, scaleName, {binSuffix: 'range'});
      } else {
        return fieldRef(fieldDef, scaleName, {binSuffix: 'mid'});
      }
    } else if (fieldDef.value) {
      return {
        value: fieldDef.value
      };
    }
  }

  if (defaultRef) {
    if (defaultRef === 'base') {
      if (channel === X || channel === X2) {
        return baseX(scaleName, scale);
      } else if (channel === Y || channel === Y2) {
        return baseY(scaleName, scale);
      }
    } else if (defaultRef === 'baseOrMax') {
      if (channel === X || channel === X2) {
        return baseOrMaxX(scaleName, scale);
      } else if (channel === Y || channel === Y2) {
        return baseOrMaxY(scaleName, scale);
      }
    } else {
      return defaultRef;
    }
  }
  return undefined;
}


export function midX(config: Config): VgValueRef {
  // TODO: For fit-mode, use middle of the width
  return {value: config.scale.bandSize / 2};
}

export function midY(config: Config): VgValueRef {
  // TODO: For fit-mode, use middle of the width
  return {value: config.scale.bandSize / 2};
}

function baseX(scaleName: string, scale: Scale): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.type) &&
      scale.zero !== false) {

      return {
        scale: scaleName,
        value: 0
      };
    }
  }
  // Put the mark on the x-axis
  return {value: 0};
}

function baseOrMaxX(scaleName: string, scale: Scale): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.type) &&
      scale.zero !== false) {

      return {
        scale: scaleName,
        value: 0
      };
    }
  }
  return {field: {group: 'width'}};
}

function baseY(scaleName: string, scale: Scale): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.type) &&
      scale.zero !== false) {

      return {
        scale: scaleName,
        value: 0
      };
    }
  }
  // Put the mark on the y-axis
  return {field: {group: 'height'}};
}

function baseOrMaxY(scaleName: string, scale: Scale): VgValueRef {
  if (scaleName) {
    // Log / Time / UTC scale do not support zero
    if (!contains([ScaleType.LOG, ScaleType.TIME, ScaleType.UTC], scale.type) &&
      scale.zero !== false) {

      return {
        scale: scaleName,
        value: 0
      };
    }
  }
  // Put the mark on the y-axis
  return {value: 0};
}
