import {Channel, TEXT} from '../channel';
import {CellConfig, Config} from '../config';
import {field, FieldDef, FieldRefOption, isScaleFieldDef, OrderFieldDef} from '../fielddef';
import * as log from '../log';
import {Mark, MarkConfig, MarkDef, TextConfig} from '../mark';
import {ScaleType} from '../scale';
import {isConcatSpec, isFacetSpec, isLayerSpec, isRepeatSpec, isUnitSpec, LayoutSizeMixins, Spec} from '../spec';
import {TimeUnit} from '../timeunit';
import {formatExpression} from '../timeunit';
import {QUANTITATIVE} from '../type';
import {isArray} from '../util';
import {VgEncodeEntry, VgSort} from '../vega.schema';
import {ConcatModel} from './concat';
import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {Model} from './model';
import {RepeatModel} from './repeat';
import {RepeaterValue} from './repeater';
import {Explicit} from './split';
import {UnitModel} from './unit';


export function buildModel(spec: Spec, parent: Model, parentGivenName: string,
  unitSize: LayoutSizeMixins, repeater: RepeaterValue, config: Config): Model {
  if (isFacetSpec(spec)) {
    return new FacetModel(spec, parent, parentGivenName, repeater, config);
  }

  if (isLayerSpec(spec)) {
    return new LayerModel(spec, parent, parentGivenName, unitSize, repeater, config);
  }

  if (isUnitSpec(spec)) {
    return new UnitModel(spec, parent, parentGivenName, unitSize, repeater, config);
  }

  if (isRepeatSpec(spec)) {
    return new RepeatModel(spec, parent, parentGivenName, repeater, config);
  }

  if (isConcatSpec(spec)) {
    return new ConcatModel(spec, parent, parentGivenName, repeater, config);
  }

  throw new Error(log.message.INVALID_SPEC);
}

export function applyConfig(e: VgEncodeEntry,
    config: CellConfig | MarkConfig | TextConfig, // TODO(#1842): consolidate MarkConfig | TextConfig?
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
  if (mark.style) {
    return isArray(mark.style) ? mark.style : [mark.style];
  }
  return [mark.type];
}

/**
 * Return value mark specific config property if exists.
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

  const styles = getStyles(mark);
  for (const style of styles) {
    const styleConfig = config.style[style];
    if (styleConfig && styleConfig[prop] !== undefined) {
      value = styleConfig[prop];
    }
  }

  return value;
}

export function formatSignalRef(fieldDef: FieldDef<string>, specifiedFormat: string, expr: 'datum' | 'parent', config: Config, useBinRange?: boolean) {
  if (fieldDef.type === 'quantitative') {
    const format = numberFormat(fieldDef, specifiedFormat, config);
    if (fieldDef.bin) {
      if (useBinRange) {
        // For bin range, no need to apply format as the formula that creates range already include format
        return {signal: field(fieldDef, {expr, binSuffix: 'range'})};
      } else {
        return {
          signal: `${formatExpr(field(fieldDef, {expr, binSuffix: 'start'}), format)} + '-' + ${formatExpr(field(fieldDef, {expr, binSuffix: 'end'}), format)}`
        };
      }
    } else {
      return {
        signal: `${formatExpr(field(fieldDef, {expr}), format)}`
      };
    }
  } else if (fieldDef.type === 'temporal') {
    const isUTCScale = isScaleFieldDef(fieldDef) && fieldDef['scale'] && fieldDef['scale'].type === ScaleType.UTC;
    return {
      signal: timeFormatExpression(field(fieldDef, {expr}), fieldDef.timeUnit, specifiedFormat, config.text.shortTimeLabels, config.timeFormat, isUTCScale)
    };
  } else {
    return {signal: `''+${field(fieldDef, {expr})}`};
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
  return `format(${field}, '${format || ''}')`;
}

export function numberFormatExpr(field: string, specifiedFormat: string, config: Config) {
  return formatExpr(field, specifiedFormat || config.numberFormat);
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
    s.field.push(field(orderChannelDef, {binSuffix: 'start', ...fieldRefOption}));
    s.order.push(orderChannelDef.sort || 'ascending');
    return s;
  }, {field:[], order: []});
}

export function titleMerger(v1: Explicit<string>, v2: Explicit<string>) {
  return {
    explicit: v1.explicit, // keep the old explicit
    value: v1.value === v2.value ?
      v1.value : // if title is the same just use one of them
      v1.value + ', ' + v2.value // join title with comma if different
  };
}
