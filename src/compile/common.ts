import {isArray} from 'vega-util';
import {Channel, isScaleChannel} from '../channel';
import {Config, ViewConfig} from '../config';
import {FieldDef, FieldDefBase, FieldRefOption, isScaleFieldDef, isTimeFieldDef, OrderFieldDef, vgField} from '../fielddef';
import {MarkConfig, MarkDef, TextConfig} from '../mark';
import {ScaleType} from '../scale';
import {TimeUnit} from '../timeunit';
import {formatExpression} from '../timeunit';
import {QUANTITATIVE} from '../type';
import {contains, stringify} from '../util';
import {VgEncodeEntry, VgMarkConfig, VgSort} from '../vega.schema';
import {AxisComponentProps} from './axis/component';
import {Explicit} from './split';
import {UnitModel} from './unit';


export function applyConfig(e: VgEncodeEntry,
    config: ViewConfig | MarkConfig | TextConfig, // TODO(#1842): consolidate MarkConfig | TextConfig?
    propsList: string[]) {
  for (const property of propsList) {
    const value = config[property];
    if (value !== undefined) {
      e[property] = {value: value};
    }
  }
  return e;
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
  return [].concat(mark.type, mark.style || []);
}

/**
 * Return property value from style or mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
export function getMarkConfig<P extends keyof MarkConfig>(prop: P, mark: MarkDef, config: Config): MarkConfig[P] {
  // By default, read from mark config first!
  let value = config.mark[prop];

  // Then read mark specific config, which has higher precedence
  const markSpecificConfig = config[mark.type];
  if (markSpecificConfig[prop] !== undefined) {
    value = markSpecificConfig[prop];
  }

  // Then read style config, which has even higher precedence.
  const styles = getStyles(mark);
  for (const style of styles) {
    const styleConfig = config.style[style];

    // MarkConfig extends VgMarkConfig so a prop may not be a valid property for style
    // However here we also check if it is defined, so it is okay to cast here
    const p = prop as keyof VgMarkConfig;
    if (styleConfig && styleConfig[p] !== undefined) {
      value = styleConfig[p];
    }
  }

  return value;
}

export function formatSignalRef(fieldDef: FieldDef<string>, specifiedFormat: string, expr: 'datum' | 'parent', config: Config) {
  const format = numberFormat(fieldDef, specifiedFormat, config);
  if (fieldDef.bin) {
    const startField = vgField(fieldDef, {expr});
    const endField = vgField(fieldDef, {expr, binSuffix: 'end'});
    return {
      signal: binFormatExpression(startField, endField, format, config)
    };
  } else if (fieldDef.type === 'quantitative') {
    return {
      signal: `${formatExpr(vgField(fieldDef, {expr}), format)}`
    };
  } else if (isTimeFieldDef(fieldDef)) {
    const isUTCScale = isScaleFieldDef(fieldDef) && fieldDef['scale'] && fieldDef['scale'].type === ScaleType.UTC;
    return {
      signal: timeFormatExpression(vgField(fieldDef, {expr}), fieldDef.timeUnit, specifiedFormat, config.text.shortTimeLabels, config.timeFormat, isUTCScale)
    };
  } else {
    return {
      signal: `''+${vgField(fieldDef, {expr})}`
    };
  }
}

export function getSpecifiedOrDefaultValue<T>(specifiedValue: T, defaultValue: T | {signal: string}) {
  if (specifiedValue !== undefined) {
    return specifiedValue;
  }
  return defaultValue;
}

/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
export function numberFormat(fieldDef: FieldDef<string>, specifiedFormat: string, config: Config) {
  if (fieldDef.type === QUANTITATIVE) {
    // add number format for quantitative type only

    // Specified format in axis/legend has higher precedence than fieldDef.format
    if (specifiedFormat) {
      return specifiedFormat;
    }

    // TODO: need to make this work correctly for numeric ordinal / nominal type
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
  return `${startField} === null || isNaN(${startField}) ? "null" : ${numberFormatExpr(startField, format, config)} + " - " + ${numberFormatExpr(endField, format, config)}`;
}


/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export function timeFormatExpression(field: string, timeUnit: TimeUnit, format: string, shortTimeLabels: boolean, timeFormatConfig: string, isUTCScale: boolean): string {
  if (!timeUnit || format) {
    // If there is not time unit, or if user explicitly specify format for axis/legend/text.
    const _format = format || timeFormatConfig; // only use config.timeFormat if there is no timeUnit.
    if (isUTCScale) {
      return `utcFormat(${field}, '${_format}')`;
    } else {
      return `timeFormat(${field}, '${_format}')`;
    }
  } else {
    return formatExpression(timeUnit, field, shortTimeLabels, isUTCScale);
  }
}

/**
 * Return Vega sort parameters (tuple of field and order).
 */
export function sortParams(orderDef: OrderFieldDef<string> | OrderFieldDef<string>[], fieldRefOption?: FieldRefOption): VgSort {
  return (isArray(orderDef) ? orderDef : [orderDef]).reduce((s, orderChannelDef) => {
    s.field.push(vgField(orderChannelDef, fieldRefOption));
    s.order.push(orderChannelDef.sort || 'ascending');
    return s;
  }, {field:[], order: []});
}

export type AxisTitleComponent = AxisComponentProps['title'];

export function mergeTitleFieldDefs(f1: FieldDefBase<string>[], f2: FieldDefBase<string>[]) {
  const merged = [...f1];

  f2.forEach((fdToMerge) => {
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

export function titleMerger(
  v1: Explicit<AxisTitleComponent>, v2: Explicit<AxisTitleComponent>
) {
  if (isArray(v1.value) && isArray(v2.value)) {
    return {
      explicit: v1.explicit,
      value: mergeTitleFieldDefs(v1.value, v2.value)
    };
  } else if (!isArray(v1.value) && !isArray(v2.value)) {
    return {
      explicit: v1.explicit, // keep the old explicit
      value: v1.value === v2.value ?
        v1.value : // if title is the same just use one of them
        v1.value + ', ' + v2.value // join title with comma if different
    };
  }
  /* istanbul ignore next: Condition should not happen -- only for warning in development. */
  throw new Error('It should never reach here');
}

/**
 * Checks whether a fieldDef for a particular channel requires a computed bin range.
 */
export function binRequiresRange(fieldDef: FieldDef<string>, channel: Channel) {
  if (!fieldDef.bin) {
    console.warn('Only use this method with binned field defs');
    return false;
  }

  // We need the range only when the user explicitly forces a binned field to be use discrete scale. In this case, bin range is used in axis and legend labels.
  // We could check whether the axis or legend exists (not disabled) but that seems overkill.
  return isScaleChannel(channel) && contains(['ordinal', 'nominal'], fieldDef.type);
}
