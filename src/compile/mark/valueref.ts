import {X, Y} from '../../channel';
import {Config} from '../../config';
import {FieldDef, FieldRefOption, field} from '../../fielddef';
import {Scale, ScaleType} from '../../scale';
import {StackProperties} from '../../stack';
import {contains} from '../../util';
import {VgValueRef} from '../../vega.schema';

// TODO: we need to find a way to refactor these so that scaleName is a part of scale
// but that's complicated.  For now, this is a huge step moving forward.

export function stackableX(fieldDef: FieldDef, scaleName: string, scale: Scale,
    stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
  if (fieldDef && stack && X === stack.fieldChannel) {
    // x use stack_end so that stacked line's point mark use stack_end too.
    return stackRef(fieldDef, scaleName, 'end');
  }
  return normal(fieldDef, scaleName, scale, defaultRef);
}

export function stackableY(fieldDef: FieldDef, scaleName: string, scale: Scale,
    stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
  if (fieldDef && stack && Y === stack.fieldChannel) {
    // y use stack_end so that stacked line's point mark use stack_end too.
    return stackRef(fieldDef, scaleName, 'end');
  }
  return normal(fieldDef, scaleName, scale, defaultRef);
}

export function stackableX2(xFieldDef: FieldDef, x2FieldDef: FieldDef, scaleName: string, scale: Scale,
    stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
  if (xFieldDef && stack && X === stack.fieldChannel) {
    return stackRef(xFieldDef, scaleName, 'start');
  }
  return normal(x2FieldDef, scaleName, scale, defaultRef);
}

export function stackableY2(yFieldDef: FieldDef, y2FieldDef: FieldDef, scaleName: string, scale: Scale,
    stack: StackProperties, defaultRef: VgValueRef): VgValueRef {
  if (yFieldDef && stack && Y === stack.fieldChannel) {
    return stackRef(yFieldDef, scaleName, 'start');
  }
  return normal(y2FieldDef, scaleName, scale, defaultRef);
}

export function normal(fieldDef: FieldDef, scaleName: string, scale: Scale,
defaultRef: VgValueRef | 'baseX' | 'baseY' | 'baseOrMaxX' | 'baseOrMaxY'): VgValueRef {
  // TODO: datum support

  if (fieldDef) {
    if (fieldDef.field) {
      let opt: FieldRefOption = {};
      if (scale.type === ScaleType.ORDINAL) {
        opt = {binSuffix: 'range'};
      } else {
        opt = {binSuffix: 'mid'};
      }
      return {
        scale: scaleName,
        field: field(fieldDef, opt)
      };
    } else if (fieldDef.value) {
      return {
        value: fieldDef.value
      };
    }
  }

  if (defaultRef) {
    switch (defaultRef) {
      case 'baseX':
        return baseX(scaleName, scale);
      case 'baseY':
        return baseY(scaleName, scale);
      case 'baseOrMaxX':
        return baseOrMaxX(scaleName, scale);
      case 'baseOrMaxY':
        return baseOrMaxY(scaleName, scale);
    }
    return defaultRef;
  }
  return undefined;
}

export function stackRef(fieldDef: FieldDef, scaleName: string, suffix: string): VgValueRef {
  return {
    scale: scaleName,
    field: field(fieldDef, {suffix: suffix})
  };
}

export function zeroOrXAxis(): VgValueRef {
  return {};
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
