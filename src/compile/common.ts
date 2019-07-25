import {isArray} from 'vega-util';
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
import {MarkConfig, MarkDef} from '../mark';
import {ScaleType} from '../scale';
import {SortFields} from '../sort';
import {formatExpression, TimeUnit} from '../timeunit';
import {QUANTITATIVE} from '../type';
import {getFirstDefined, stringify} from '../util';
import {BaseMarkConfig, VgEncodeEntry} from '../vega.schema';
import {AxisComponentProps} from './axis/component';
import {Explicit} from './split';
import {UnitModel} from './unit';

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
  return [].concat(mark.type, mark.style || []);
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
    vgChannel ? getStyleConfig(channel, mark, config.style) : undefined,
    getStyleConfig(channel, mark, config.style),
    // then mark-specific config
    vgChannel ? config[mark.type][vgChannel] : undefined,
    config[mark.type][channel],
    // If there is vgChannel, skip vl channel.
    // For example, vl size for text is vg fontSize, but config.mark.size is only for point size.
    vgChannel ? config.mark[vgChannel] : config.mark[channel]
  );
}

export function getStyleConfig<P extends keyof MarkConfig>(prop: P, mark: MarkDef, styleConfigIndex: StyleConfigIndex) {
  const styles = getStyles(mark);
  let value;
  for (const style of styles) {
    const styleConfig = styleConfigIndex[style];

    // MarkConfig extends VgMarkConfig so a prop may not be a valid property for style
    // However here we also check if it is defined, so it is okay to cast here
    const p = prop as keyof BaseMarkConfig;
    if (styleConfig && styleConfig[p] !== undefined) {
      value = styleConfig[p];
    }
  }
  return value;
}

export function formatSignalRef(
  fieldDef: TypedFieldDef<string>,
  specifiedFormat: string,
  expr: 'datum' | 'parent' | 'datum.datum',
  config: Config
) {
  if (isTimeFormatFieldDef(fieldDef)) {
    const isUTCScale = isScaleFieldDef(fieldDef) && fieldDef['scale'] && fieldDef['scale'].type === ScaleType.UTC;
    return {
      signal: timeFormatExpression(
        vgField(fieldDef, {
          expr
        }),
        fieldDef.timeUnit,
        specifiedFormat,
        config.text.shortTimeLabels,
        config.timeFormat,
        isUTCScale,
        true
      )
    };
  } else {
    const format = numberFormat(fieldDef, specifiedFormat, config);
    if (isBinning(fieldDef.bin)) {
      const startField = vgField(fieldDef, {expr});
      const endField = vgField(fieldDef, {expr, binSuffix: 'end'});
      return {
        signal: binFormatExpression(startField, endField, format, config)
      };
    } else if (fieldDef.type === 'quantitative' || format) {
      return {
        signal: `${formatExpr(vgField(fieldDef, {expr, binSuffix: 'range'}), format)}`
      };
    } else {
      return {signal: `''+${vgField(fieldDef, {expr})}`};
    }
  }
}

/**
 * Returns number format for a fieldDef
 */
export function numberFormat(fieldDef: TypedFieldDef<string>, specifiedFormat: string, config: Config) {
  // Specified format in axis/legend has higher precedence than fieldDef.format
  if (specifiedFormat) {
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

export function numberFormatExpr(field: string, specifiedFormat: string, config: Config) {
  return formatExpr(field, specifiedFormat || config.numberFormat);
}

export function binFormatExpression(startField: string, endField: string, format: string, config: Config) {
  return `${startField} === null || isNaN(${startField}) ? "null" : ${numberFormatExpr(
    startField,
    format,
    config
  )} + " - " + ${numberFormatExpr(endField, format, config)}`;
}

/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export function timeFormatExpression(
  field: string,
  timeUnit: TimeUnit,
  format: string,
  shortTimeLabels: boolean,
  rawTimeFormat: string, // should be provided only for actual text and headers, not axis/legend labels
  isUTCScale: boolean,
  alwaysReturn: boolean = false
): string {
  if (!timeUnit || format) {
    // If there is not time unit, or if user explicitly specify format for axis/legend/text.
    format = format || rawTimeFormat; // only use provided timeFormat if there is no timeUnit.

    if (format || alwaysReturn) {
      return `${isUTCScale ? 'utc' : 'time'}Format(${field}, '${format}')`;
    } else {
      return undefined;
    }
  } else {
    return formatExpression(timeUnit, field, shortTimeLabels, isUTCScale);
  }
}

/**
 * Return Vega sort parameters (tuple of field and order).
 */
export function sortParams(
  orderDef: OrderFieldDef<string> | OrderFieldDef<string>[],
  fieldRefOption?: FieldRefOption
): SortFields {
  return (isArray(orderDef) ? orderDef : [orderDef]).reduce(
    (s, orderChannelDef) => {
      s.field.push(vgField(orderChannelDef, fieldRefOption));
      s.order.push(orderChannelDef.sort || 'ascending');
      return s;
    },
    {field: [], order: []}
  );
}

export type AxisTitleComponent = AxisComponentProps['title'];

export function mergeTitleFieldDefs(f1: FieldDefBase<string>[], f2: FieldDefBase<string>[]) {
  const merged = [...f1];

  f2.forEach(fdToMerge => {
    for (const fieldDef1 of merged) {
      // If already exists, no need to append to merged array
      if (stringify(fieldDef1) === stringify(fdToMerge)) {
        return;
      }
    }
    merged.push(fdToMerge);
  });
  return merged;
}

export function mergeTitle(title1: string, title2: string) {
  if (title1 === title2 || !title2) {
    // if titles are the same or title2 is falsy
    return title1;
  } else if (!title1) {
    // if title1 is falsy
    return title2;
  } else {
    // join title with comma if they are different
    return title1 + ', ' + title2;
  }
}

export function mergeTitleComponent(v1: Explicit<AxisTitleComponent>, v2: Explicit<AxisTitleComponent>) {
  if (isArray(v1.value) && isArray(v2.value)) {
    return {
      explicit: v1.explicit,
      value: mergeTitleFieldDefs(v1.value, v2.value)
    };
  } else if (!isArray(v1.value) && !isArray(v2.value)) {
    return {
      explicit: v1.explicit, // keep the old explicit
      value: mergeTitle(v1.value, v2.value)
    };
  }
  /* istanbul ignore next: Condition should not happen -- only for warning in development. */
  throw new Error('It should never reach here');
}
