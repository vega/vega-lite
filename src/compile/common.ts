import {SignalRef, Text} from 'vega';
import {array, isString} from 'vega-util';
import {Axis} from '../axis';
import {isBinning} from '../bin';
import {
  FieldDefBase,
  FieldRefOption,
  isScaleFieldDef,
  isTimeFormatFieldDef,
  OrderFieldDef,
  TypedFieldDef,
  vgField
} from '../channeldef';
import {Config, StyleConfigIndex} from '../config';
import {isCustomFormatType} from '../guide';
import {AnyMarkConfig, MarkConfig, MarkDef} from '../mark';
import {fieldValidPredicate} from '../predicate';
import {ScaleType} from '../scale';
import {SortFields} from '../sort';
import {formatExpression, normalizeTimeUnit, TimeUnit} from '../timeunit';
import {isText} from '../title';
import {QUANTITATIVE} from '../type';
import {getFirstDefined} from '../util';
import {isSignalRef, VgEncodeEntry} from '../vega.schema';
import {deepEqual} from './../util';
import {AxisComponentProps} from './axis/component';
import {Explicit} from './split';
import {UnitModel} from './unit';

export const BIN_RANGE_DELIMITER = ' \u2013 ';

export function signalOrValueRef<T>(value: T | SignalRef): {value: T} | SignalRef {
  if (isSignalRef(value)) {
    return value;
  }
  return {value};
}

export function applyMarkConfig(e: VgEncodeEntry, model: UnitModel, propsList: (keyof MarkConfig)[]) {
  for (const property of propsList) {
    const value = getMarkConfig(property, model.markDef, model.config);
    if (value !== undefined) {
      e[property] = {value: value};
    }
  }
  return e;
}

export function getStyles(mark: MarkDef): string[] {
  return [].concat(mark.type, mark.style ?? []);
}

export function getMarkPropOrConfig<P extends keyof MarkConfig>(channel: P, mark: MarkDef, config: Config) {
  return getFirstDefined(mark[channel], getMarkConfig(channel, mark, config));
}

/**
 * Return property value from style or mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
export function getMarkConfig<P extends keyof MarkConfig>(
  channel: P,
  mark: MarkDef,
  config: Config,
  {vgChannel}: {vgChannel?: any} = {} // Note: Ham: I use `any` here as it's too hard to make TS knows that MarkConfig[vgChannel] would have the same type as MarkConfig[P]
): MarkConfig[P] {
  return getFirstDefined(
    // style config has highest precedence
    vgChannel ? getMarkStyleConfig(channel, mark, config.style) : undefined,
    getMarkStyleConfig(channel, mark, config.style),
    // then mark-specific config
    vgChannel ? config[mark.type][vgChannel] : undefined,
    config[mark.type][channel],
    // If there is vgChannel, skip vl channel.
    // For example, vl size for text is vg fontSize, but config.mark.size is only for point size.
    vgChannel ? config.mark[vgChannel] : config.mark[channel]
  );
}

export function getMarkStyleConfig<P extends keyof AnyMarkConfig>(
  prop: P,
  mark: MarkDef,
  styleConfigIndex: StyleConfigIndex
) {
  return getStyleConfig(prop, getStyles(mark), styleConfigIndex);
}

export function getStyleConfig<P extends keyof AnyMarkConfig | keyof Axis>(
  p: P,
  styles: string | string[],
  styleConfigIndex: StyleConfigIndex
) {
  styles = array(styles);
  let value;
  for (const style of styles) {
    const styleConfig = styleConfigIndex[style];

    if (styleConfig) {
      value = styleConfig[p as string];
    }
  }
  return value;
}

export function customFormatExpr({
  formatType,
  field,
  format
}: {
  formatType: string;
  field: string;
  format: string | object;
}) {
  return `${formatType}(${field}, ${JSON.stringify(format)})`;
}

export function formatSignalRef({
  fieldDef,
  format,
  formatType,
  expr,
  config,
  field,
  omitNumberFormatAndEmptyTimeFormat,
  omitTimeFormatConfig,
  isUTCScale
}: {
  fieldDef: TypedFieldDef<string>;
  format: string | object;
  formatType: string;
  expr?: 'datum' | 'parent' | 'datum.datum';
  config: Config;
  omitTimeFormatConfig?: boolean; // axis doesn't use config.timeFormat
  field?: string; // axis/legend "use datum.value"
  omitNumberFormatAndEmptyTimeFormat?: boolean; // axis/legend's encoding block doesn't need explicit encoding format
  isUTCScale?: boolean;
}) {
  field = field ?? vgField(fieldDef, {expr});
  isUTCScale =
    isUTCScale ?? (isScaleFieldDef(fieldDef) && fieldDef['scale'] && fieldDef['scale'].type === ScaleType.UTC);

  const defaultTimeFormat = omitTimeFormatConfig ? null : config.timeFormat;

  if (isCustomFormatType(formatType)) {
    return {signal: customFormatExpr({formatType, format, field})};
  } else if (isTimeFormatFieldDef(fieldDef)) {
    const signal = timeFormatExpression(
      field,
      normalizeTimeUnit(fieldDef.timeUnit)?.unit,
      format,
      defaultTimeFormat,
      isUTCScale,
      !omitNumberFormatAndEmptyTimeFormat
    );
    return signal ? {signal} : undefined;
  } else if (!omitNumberFormatAndEmptyTimeFormat) {
    format = numberFormat(fieldDef, format, config);
    if (isBinning(fieldDef.bin)) {
      const endField = vgField(fieldDef, {expr, binSuffix: 'end'});
      return {
        signal: binFormatExpression(field, endField, format, formatType, config)
      };
    } else if (fieldDef.type === 'quantitative' || format) {
      return {
        signal: `${formatExpr(vgField(fieldDef, {expr, binSuffix: 'range'}), format)}`
      };
    } else {
      return {signal: `''+${vgField(fieldDef, {expr})}`};
    }
  }
  return undefined;
}

/**
 * Returns number format for a fieldDef
 */
export function numberFormat(fieldDef: TypedFieldDef<string>, specifiedFormat: string | object, config: Config) {
  // Specified format in axis/legend has higher precedence than fieldDef.format
  if (isString(specifiedFormat)) {
    return specifiedFormat;
  }

  if (fieldDef.type === QUANTITATIVE) {
    // we only apply the default if the field is quantitative
    return config.numberFormat;
  }
  return undefined;
}

function formatExpr(field: string, format: string) {
  return `format(${field}, "${format || ''}")`;
}

function binNumberFormatExpr(field: string, format: string | object, formatType: string, config: Config) {
  if (isCustomFormatType(formatType)) {
    return customFormatExpr({formatType, field, format});
  }

  return formatExpr(field, (isString(format) ? format : undefined) ?? config.numberFormat);
}

export function binFormatExpression(
  startField: string,
  endField: string,
  format: string | object,
  formatType: string,
  config: Config
) {
  const start = binNumberFormatExpr(startField, format, formatType, config);
  const end = binNumberFormatExpr(endField, format, formatType, config);
  return `${fieldValidPredicate(startField, false)} ? "null" : ${start} + "${BIN_RANGE_DELIMITER}" + ${end}`;
}

/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export function timeFormatExpression(
  field: string,
  timeUnit: TimeUnit,
  format: string | object,
  rawTimeFormat: string, // should be provided only for actual text and headers, not axis/legend labels
  isUTCScale: boolean,
  alwaysReturn = false
): string {
  if (!timeUnit || format) {
    // If there is not time unit, or if user explicitly specify format for axis/legend/text.
    format = isString(format) ? format : rawTimeFormat; // only use provided timeFormat if there is no timeUnit.
    if (format || alwaysReturn) {
      return `${isUTCScale ? 'utc' : 'time'}Format(${field}, '${format}')`;
    } else {
      return undefined;
    }
  } else {
    return formatExpression(timeUnit, field, isUTCScale);
  }
}

/**
 * Return Vega sort parameters (tuple of field and order).
 */
export function sortParams(
  orderDef: OrderFieldDef<string> | OrderFieldDef<string>[],
  fieldRefOption?: FieldRefOption
): SortFields {
  return array(orderDef).reduce(
    (s, orderChannelDef) => {
      s.field.push(vgField(orderChannelDef, fieldRefOption));
      s.order.push(orderChannelDef.sort ?? 'ascending');
      return s;
    },
    {field: [], order: []}
  );
}

export type AxisTitleComponent = AxisComponentProps['title'];

export function mergeTitleFieldDefs(f1: readonly FieldDefBase<string>[], f2: readonly FieldDefBase<string>[]) {
  const merged = [...f1];

  f2.forEach(fdToMerge => {
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
      value: null
    };
  } else if (isText(v1Val) && isText(v2Val)) {
    return {
      explicit: v1.explicit,
      value: mergeTitle(v1Val, v2Val)
    };
  } else if (!isText(v1Val) && !isText(v2Val)) {
    return {
      explicit: v1.explicit,
      value: mergeTitleFieldDefs(v1Val, v2Val)
    };
  }
  /* istanbul ignore next: Condition should not happen -- only for warning in development. */
  throw new Error('It should never reach here');
}
