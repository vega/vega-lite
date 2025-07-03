import {Align, AxisOrient, Orient, SignalRef} from 'vega';
import {isArray, isObject} from 'vega-util';
import {AxisInternal} from '../../axis.js';
import {isBinned, isBinning} from '../../bin.js';
import {PositionScaleChannel, X} from '../../channel.js';
import {
  DatumDef,
  isDiscrete,
  isFieldDef,
  PositionDatumDef,
  PositionFieldDef,
  toFieldDefBase,
  TypedFieldDef,
  valueArray,
} from '../../channeldef.js';
import {Config, StyleConfigIndex} from '../../config.js';
import {Mark} from '../../mark.js';
import {hasDiscreteDomain} from '../../scale.js';
import {Sort} from '../../sort.js';
import {durationExpr, normalizeTimeUnit} from '../../timeunit.js';
import {NOMINAL, ORDINAL, Type} from '../../type.js';
import {contains, normalizeAngle} from '../../util.js';
import {isSignalRef} from '../../vega.schema.js';
import {mergeTitle, mergeTitleFieldDefs} from '../common.js';
import {guideFormatType} from '../format.js';
import {UnitModel} from '../unit.js';
import {ScaleType} from './../../scale.js';
import {AxisComponentProps} from './component.js';
import {AxisConfigs, getAxisConfig} from './config.js';

export interface AxisRuleParams {
  fieldOrDatumDef: PositionFieldDef<string> | PositionDatumDef<string>;
  axis: AxisInternal;
  channel: PositionScaleChannel;
  model: UnitModel;

  mark: Mark;
  scaleType: ScaleType;
  orient: Orient | SignalRef;
  labelAngle: number | SignalRef;
  format: string | SignalRef;
  formatType: ReturnType<typeof guideFormatType>;
  config: Config;
}

export const axisRules: {
  [k in keyof AxisComponentProps]?: (params: AxisRuleParams) => AxisComponentProps[k];
} = {
  scale: ({model, channel}) => model.scaleName(channel),

  format: ({format}) => format, // we already calculate this in parse

  formatType: ({formatType}) => formatType, // we already calculate this in parse

  grid: ({fieldOrDatumDef, axis, scaleType}) => axis.grid ?? defaultGrid(scaleType, fieldOrDatumDef),

  gridScale: ({model, channel}) => gridScale(model, channel),

  labelAlign: ({axis, labelAngle, orient, channel}) =>
    axis.labelAlign || defaultLabelAlign(labelAngle, orient, channel),

  labelAngle: ({labelAngle}) => labelAngle, // we already calculate this in parse

  labelBaseline: ({axis, labelAngle, orient, channel}) =>
    axis.labelBaseline || defaultLabelBaseline(labelAngle, orient, channel),

  labelFlush: ({axis, fieldOrDatumDef, channel}) => axis.labelFlush ?? defaultLabelFlush(fieldOrDatumDef.type, channel),

  labelOverlap: ({axis, fieldOrDatumDef, scaleType}) =>
    axis.labelOverlap ??
    defaultLabelOverlap(
      fieldOrDatumDef.type,
      scaleType,
      isFieldDef(fieldOrDatumDef) && !!fieldOrDatumDef.timeUnit,
      isFieldDef(fieldOrDatumDef) ? fieldOrDatumDef.sort : undefined,
    ),

  // we already calculate orient in parse
  orient: ({orient}) => orient as AxisOrient, // Need to cast until Vega supports signal

  tickCount: ({channel, model, axis, fieldOrDatumDef, scaleType}) => {
    const sizeType = channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
    const size = sizeType ? model.getSizeSignalRef(sizeType) : undefined;
    return axis.tickCount ?? defaultTickCount({fieldOrDatumDef, scaleType, size, values: axis.values});
  },

  tickMinStep: ({axis, format, fieldOrDatumDef}) => axis.tickMinStep ?? defaultTickMinStep({format, fieldOrDatumDef}),

  title: ({axis, model, channel}) => {
    if (axis.title !== undefined) {
      return axis.title;
    }
    const fieldDefTitle = getFieldDefTitle(model, channel);
    if (fieldDefTitle !== undefined) {
      return fieldDefTitle;
    }
    const fieldDef = model.typedFieldDef(channel);
    const channel2 = channel === 'x' ? 'x2' : 'y2';
    const fieldDef2 = model.fieldDef(channel2);

    // If title not specified, store base parts of fieldDef (and fieldDef2 if exists)
    return mergeTitleFieldDefs(
      fieldDef ? [toFieldDefBase(fieldDef)] : [],
      isFieldDef(fieldDef2) ? [toFieldDefBase(fieldDef2)] : [],
    );
  },

  values: ({axis, fieldOrDatumDef}) => values(axis, fieldOrDatumDef),

  zindex: ({axis, fieldOrDatumDef, mark}) => axis.zindex ?? defaultZindex(mark, fieldOrDatumDef),
};

// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */

export function defaultGrid(scaleType: ScaleType, fieldDef: TypedFieldDef<string> | DatumDef) {
  return !hasDiscreteDomain(scaleType) && isFieldDef(fieldDef) && !isBinning(fieldDef?.bin) && !isBinned(fieldDef?.bin);
}

export function gridScale(model: UnitModel, channel: PositionScaleChannel) {
  const gridChannel: PositionScaleChannel = channel === 'x' ? 'y' : 'x';
  if (model.getScaleComponent(gridChannel)) {
    return model.scaleName(gridChannel);
  }
  return undefined;
}

export function getLabelAngle(
  fieldOrDatumDef: PositionFieldDef<string> | PositionDatumDef<string>,
  axis: AxisInternal,
  channel: PositionScaleChannel,
  styleConfig: StyleConfigIndex<SignalRef>,
  axisConfigs?: AxisConfigs,
) {
  const labelAngle = axis?.labelAngle;
  // try axis value
  if (labelAngle !== undefined) {
    return isSignalRef(labelAngle) ? labelAngle : normalizeAngle(labelAngle);
  } else {
    // try axis config value
    const {configValue: angle} = getAxisConfig('labelAngle', styleConfig, axis?.style, axisConfigs);
    if (angle !== undefined) {
      return normalizeAngle(angle);
    } else {
      // get default value
      if (
        channel === X &&
        contains([NOMINAL, ORDINAL], fieldOrDatumDef.type) &&
        !(isFieldDef(fieldOrDatumDef) && fieldOrDatumDef.timeUnit)
      ) {
        return 270;
      }
      // no default
      return undefined;
    }
  }
}

export function normalizeAngleExpr(angle: SignalRef) {
  return `(((${angle.signal} % 360) + 360) % 360)`;
}

export function defaultLabelBaseline(
  angle: number | SignalRef,
  orient: AxisOrient | SignalRef,
  channel: 'x' | 'y',
  alwaysIncludeMiddle?: boolean,
) {
  if (angle !== undefined) {
    if (channel === 'x') {
      if (isSignalRef(angle)) {
        const a = normalizeAngleExpr(angle);
        const orientIsTop = isSignalRef(orient) ? `(${orient.signal} === "top")` : orient === 'top';
        return {
          signal:
            `(45 < ${a} && ${a} < 135) || (225 < ${a} && ${a} < 315) ? "middle" :` +
            `(${a} <= 45 || 315 <= ${a}) === ${orientIsTop} ? "bottom" : "top"`,
        };
      }

      if ((45 < angle && angle < 135) || (225 < angle && angle < 315)) {
        return 'middle';
      }

      if (isSignalRef(orient)) {
        const op = angle <= 45 || 315 <= angle ? '===' : '!==';
        return {signal: `${orient.signal} ${op} "top" ? "bottom" : "top"`};
      }

      return (angle <= 45 || 315 <= angle) === (orient === 'top') ? 'bottom' : 'top';
    } else {
      if (isSignalRef(angle)) {
        const a = normalizeAngleExpr(angle);
        const orientIsLeft = isSignalRef(orient) ? `(${orient.signal} === "left")` : orient === 'left';
        const middle = alwaysIncludeMiddle ? '"middle"' : 'null';
        return {
          signal: `${a} <= 45 || 315 <= ${a} || (135 <= ${a} && ${a} <= 225) ? ${middle} : (45 <= ${a} && ${a} <= 135) === ${orientIsLeft} ? "top" : "bottom"`,
        };
      }

      if (angle <= 45 || 315 <= angle || (135 <= angle && angle <= 225)) {
        return alwaysIncludeMiddle ? 'middle' : null;
      }

      if (isSignalRef(orient)) {
        const op = 45 <= angle && angle <= 135 ? '===' : '!==';
        return {signal: `${orient.signal} ${op} "left" ? "top" : "bottom"`};
      }

      return (45 <= angle && angle <= 135) === (orient === 'left') ? 'top' : 'bottom';
    }
  }
  return undefined;
}

export function defaultLabelAlign(
  angle: number | SignalRef,
  orient: AxisOrient | SignalRef,
  channel: 'x' | 'y',
): Align | SignalRef {
  if (angle === undefined) {
    return undefined;
  }

  const isX = channel === 'x';
  const startAngle = isX ? 0 : 90;
  const mainOrient = isX ? 'bottom' : 'left';

  if (isSignalRef(angle)) {
    const a = normalizeAngleExpr(angle);
    const orientIsMain = isSignalRef(orient) ? `(${orient.signal} === "${mainOrient}")` : orient === mainOrient;
    return {
      signal:
        `(${startAngle ? `(${a} + 90)` : a} % 180 === 0) ? ${isX ? null : '"center"'} :` +
        `(${startAngle} < ${a} && ${a} < ${180 + startAngle}) === ${orientIsMain} ? "left" : "right"`,
    };
  }

  if ((angle + startAngle) % 180 === 0) {
    // For bottom, use default label align so label flush still works
    return isX ? null : 'center';
  }

  if (isSignalRef(orient)) {
    const op = startAngle < angle && angle < 180 + startAngle ? '===' : '!==';
    const orientIsMain = `${orient.signal} ${op} "${mainOrient}"`;
    return {
      signal: `${orientIsMain} ? "left" : "right"`,
    };
  }

  if ((startAngle < angle && angle < 180 + startAngle) === (orient === mainOrient)) {
    return 'left';
  }

  return 'right';
}

export function defaultLabelFlush(type: Type, channel: PositionScaleChannel) {
  if (channel === 'x' && contains(['quantitative', 'temporal'], type)) {
    return true;
  }
  return undefined;
}

export function defaultLabelOverlap(type: Type, scaleType: ScaleType, hasTimeUnit: boolean, sort?: Sort<string>) {
  // do not prevent overlap for nominal data because there is no way to infer what the missing labels are
  if ((hasTimeUnit && !isObject(sort)) || (type !== 'nominal' && type !== 'ordinal')) {
    if (scaleType === 'log' || scaleType === 'symlog') {
      return 'greedy';
    }
    return true;
  }
  return undefined;
}

export function defaultOrient(channel: PositionScaleChannel) {
  return channel === 'x' ? 'bottom' : 'left';
}

export function defaultTickCount({
  fieldOrDatumDef,
  scaleType,
  size,
  values: vals,
}: {
  fieldOrDatumDef: TypedFieldDef<string> | DatumDef;
  scaleType: ScaleType;
  size?: SignalRef;
  values?: AxisInternal['values'];
}) {
  if (!vals && !hasDiscreteDomain(scaleType) && scaleType !== 'log') {
    if (isFieldDef(fieldOrDatumDef)) {
      if (isBinning(fieldOrDatumDef.bin)) {
        // for binned data, we don't want more ticks than maxbins
        return {signal: `ceil(${size.signal}/10)`};
      }

      if (
        fieldOrDatumDef.timeUnit &&
        contains(['month', 'hours', 'day', 'quarter'], normalizeTimeUnit(fieldOrDatumDef.timeUnit)?.unit)
      ) {
        return undefined;
      }
    }

    return {signal: `ceil(${size.signal}/40)`};
  }

  return undefined;
}

export function defaultTickMinStep({format, fieldOrDatumDef}: Pick<AxisRuleParams, 'format' | 'fieldOrDatumDef'>) {
  if (format === 'd') {
    return 1;
  }

  if (isFieldDef(fieldOrDatumDef)) {
    const {timeUnit} = fieldOrDatumDef;
    if (timeUnit) {
      const signal = durationExpr(timeUnit);
      if (signal) {
        return {signal};
      }
    }
  }
  return undefined;
}

export function getFieldDefTitle(model: UnitModel, channel: 'x' | 'y') {
  const channel2 = channel === 'x' ? 'x2' : 'y2';
  const fieldDef = model.fieldDef(channel);
  const fieldDef2 = model.fieldDef(channel2);

  const title1 = fieldDef ? fieldDef.title : undefined;
  const title2 = fieldDef2 ? fieldDef2.title : undefined;

  if (title1 && title2) {
    return mergeTitle(title1, title2);
  } else if (title1) {
    return title1;
  } else if (title2) {
    return title2;
  } else if (title1 !== undefined) {
    // falsy value to disable config
    return title1;
  } else if (title2 !== undefined) {
    // falsy value to disable config
    return title2;
  }

  return undefined;
}

export function values(axis: AxisInternal, fieldOrDatumDef: TypedFieldDef<string> | DatumDef) {
  const vals = axis.values;

  if (isArray(vals)) {
    return valueArray(fieldOrDatumDef, vals);
  } else if (isSignalRef(vals)) {
    return vals;
  }

  return undefined;
}

export function defaultZindex(mark: Mark, fieldDef: TypedFieldDef<string> | DatumDef) {
  if (mark === 'rect' && isDiscrete(fieldDef)) {
    return 1;
  }
  return 0;
}
