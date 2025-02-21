import type {ExprRef, SignalRef, Text} from 'vega';
import {array, isArray, stringValue} from 'vega-util';
import {AxisConfig, ConditionalAxisProperty} from '../axis.js';
import {
  ConditionalPredicate,
  DatumDef,
  FieldDef,
  FieldDefBase,
  FieldRefOption,
  OrderFieldDef,
  Value,
  ValueDef,
  vgField,
} from '../channeldef.js';
import {Config, StyleConfigIndex} from '../config.js';
import {isExprRef} from '../expr.js';
import {Mark, MarkConfig, MarkDef} from '../mark.js';
import {SortFields} from '../sort.js';
import {isText} from '../title.js';
import {deepEqual, getFirstDefined, hasProperty} from '../util.js';
import {isSignalRef, VgEncodeChannel, VgEncodeEntry, VgValueRef} from '../vega.schema.js';
import {AxisComponentProps} from './axis/component.js';
import {Explicit} from './split.js';
import {UnitModel} from './unit.js';

export const BIN_RANGE_DELIMITER = ' \u2013 ';

export function signalOrValueRefWithCondition<V extends Value | number[]>(
  val: ConditionalAxisProperty<V, SignalRef | ExprRef>,
): ConditionalAxisProperty<V, SignalRef> {
  const condition = isArray(val.condition)
    ? (val.condition as ConditionalPredicate<ValueDef<any> | ExprRef | SignalRef>[]).map(conditionalSignalRefOrValue)
    : conditionalSignalRefOrValue(val.condition);

  return {
    ...signalRefOrValue<ValueDef<any>>(val),
    condition,
  };
}

export function signalRefOrValue<T>(value: T | SignalRef | ExprRef): T | SignalRef {
  if (isExprRef(value)) {
    const {expr, ...rest} = value;
    return {signal: expr, ...rest};
  }
  return value;
}

export function conditionalSignalRefOrValue<T extends FieldDef<any> | DatumDef | ValueDef<any>>(
  value: ConditionalPredicate<T | ExprRef | SignalRef>,
): ConditionalPredicate<T | SignalRef> {
  if (isExprRef(value)) {
    const {expr, ...rest} = value;
    return {signal: expr, ...rest};
  }
  return value;
}

export function signalOrValueRef<T>(value: T | SignalRef | ExprRef): {value: T} | SignalRef {
  if (isExprRef(value)) {
    const {expr, ...rest} = value;
    return {signal: expr, ...rest};
  }
  if (isSignalRef(value)) {
    return value;
  }
  return value !== undefined ? {value} : undefined;
}

export function exprFromSignalRefOrValue<T extends SignalRef>(ref: Value<T> | SignalRef): string {
  if (isSignalRef(ref)) {
    return ref.signal;
  }
  return stringValue(ref);
}
export function exprFromValueRefOrSignalRef(ref: VgValueRef | SignalRef): string {
  if (isSignalRef(ref)) {
    return ref.signal;
  }
  return stringValue(ref.value);
}

export function signalOrStringValue(v: SignalRef | any) {
  if (isSignalRef(v)) {
    return v.signal;
  }
  return v == null ? null : stringValue(v);
}

export function applyMarkConfig(e: VgEncodeEntry, model: UnitModel, propsList: (keyof MarkConfig<any>)[]) {
  for (const property of propsList) {
    const value = getMarkConfig(property, model.markDef, model.config);
    if (value !== undefined) {
      (e as any)[property] = signalOrValueRef(value);
    }
  }
  return e;
}

export function getStyles(mark: MarkDef): string[] {
  return [].concat(mark.type, mark.style ?? []);
}

export function getMarkPropOrConfig<P extends keyof MarkDef, ES extends ExprRef | SignalRef>(
  channel: P,
  mark: MarkDef<Mark, ES>,
  config: Config<SignalRef>,
  opt: {
    vgChannel?: VgEncodeChannel;
    ignoreVgConfig?: boolean;
  } = {},
): MarkDef<Mark, ES>[P] {
  const {vgChannel, ignoreVgConfig} = opt;
  if (vgChannel && hasProperty(mark, vgChannel)) {
    return mark[vgChannel] as any;
  } else if (mark[channel] !== undefined) {
    return mark[channel];
  } else if (ignoreVgConfig && (!vgChannel || vgChannel === channel)) {
    return undefined;
  }

  return getMarkConfig(channel, mark, config, opt);
}

/**
 * Return property value from style or mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
export function getMarkConfig<P extends keyof MarkDef, ES extends ExprRef | SignalRef>(
  channel: P,
  mark: MarkDef<Mark, ES>,
  config: Config<SignalRef>,
  {vgChannel}: {vgChannel?: VgEncodeChannel} = {},
): MarkDef<Mark, ES>[P] {
  const cfg = getMarkStyleConfig(channel, mark, config.style) as MarkDef<Mark, ES>[P];
  return getFirstDefined<MarkDef<Mark, ES>[P]>(
    // style config has highest precedence
    vgChannel ? cfg : undefined,
    cfg,
    // then mark-specific config
    vgChannel ? (config[mark.type] as any)[vgChannel] : undefined,

    (config[mark.type] as any)[channel], // Need to cast because MarkDef doesn't perfectly match with AnyMarkConfig, but if the type isn't available, we'll get nothing here, which is fine

    // If there is vgChannel, skip vl channel.
    // For example, vl size for text is vg fontSize, but config.mark.size is only for point size.
    vgChannel ? (config.mark as any)[vgChannel] : (config.mark as any)[channel], // Need to cast for the same reason as above
  );
}

export function getMarkStyleConfig<P extends keyof MarkDef, ES extends ExprRef | SignalRef>(
  prop: P,
  mark: MarkDef<Mark, ES>,
  styleConfigIndex: StyleConfigIndex<SignalRef>,
) {
  return getStyleConfig(prop, getStyles(mark), styleConfigIndex);
}

export function getStyleConfig<P extends keyof MarkDef | keyof AxisConfig<SignalRef>>(
  p: P,
  styles: string | string[],
  styleConfigIndex: StyleConfigIndex<SignalRef>,
) {
  styles = array(styles);
  let value;
  for (const style of styles) {
    const styleConfig = styleConfigIndex[style];

    if (hasProperty(styleConfig, p)) {
      value = styleConfig[p];
    }
  }
  return value;
}

/**
 * Return Vega sort parameters (tuple of field and order).
 */
export function sortParams(
  orderDef: OrderFieldDef<string> | OrderFieldDef<string>[],
  fieldRefOption?: FieldRefOption,
): SortFields {
  return array(orderDef).reduce(
    (s, orderChannelDef) => {
      s.field.push(vgField(orderChannelDef, fieldRefOption));
      s.order.push(orderChannelDef.sort ?? 'ascending');
      return s;
    },
    {field: [], order: []},
  );
}

export type AxisTitleComponent = AxisComponentProps['title'];

export function mergeTitleFieldDefs(f1: readonly FieldDefBase<string>[], f2: readonly FieldDefBase<string>[]) {
  const merged = [...f1];

  f2.forEach((fdToMerge) => {
    for (const fieldDef1 of merged) {
      // If already exists, no need to append to merged array
      if (deepEqual(fieldDef1, fdToMerge)) {
        return;
      }
    }
    merged.push(fdToMerge);
  });
  return merged;
}

export function mergeTitle(title1: Text | SignalRef, title2: Text | SignalRef) {
  if (deepEqual(title1, title2) || !title2) {
    // if titles are the same or title2 is falsy
    return title1;
  } else if (!title1) {
    // if title1 is falsy
    return title2;
  } else {
    return [...array(title1), ...array(title2)].join(', ');
  }
}

export function mergeTitleComponent(v1: Explicit<AxisTitleComponent>, v2: Explicit<AxisTitleComponent>) {
  const v1Val = v1.value;
  const v2Val = v2.value;

  if (v1Val == null || v2Val === null) {
    return {
      explicit: v1.explicit,
      value: null,
    };
  } else if ((isText(v1Val) || isSignalRef(v1Val)) && (isText(v2Val) || isSignalRef(v2Val))) {
    return {
      explicit: v1.explicit,
      value: mergeTitle(v1Val, v2Val),
    };
  } else if (isText(v1Val) || isSignalRef(v1Val)) {
    return {
      explicit: v1.explicit,
      value: v1Val,
    };
  } else if (isText(v2Val) || isSignalRef(v2Val)) {
    return {
      explicit: v1.explicit,
      value: v2Val,
    };
  } else if (!isText(v1Val) && !isSignalRef(v1Val) && !isText(v2Val) && !isSignalRef(v2Val)) {
    return {
      explicit: v1.explicit,
      value: mergeTitleFieldDefs(v1Val, v2Val),
    };
  }
  /* istanbul ignore next: Condition should not happen -- only for warning in development. */
  throw new Error('It should never reach here');
}
