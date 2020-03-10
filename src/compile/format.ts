import {isString} from 'vega-util';
import {isBinning} from '../bin';
import {isScaleFieldDef, isTimeFormatFieldDef, TypedFieldDef, vgField} from '../channeldef';
import {Config} from '../config';
import {isCustomFormatType} from '../guide';
import {fieldValidPredicate} from '../predicate';
import {ScaleType} from '../scale';
import {formatExpression, normalizeTimeUnit, TimeUnit} from '../timeunit';
import {QUANTITATIVE} from '../type';

export const BIN_RANGE_DELIMITER = ' \u2013 ';

function customFormatExpr({formatType, field, format}: {formatType: string; field: string; format: string | object}) {
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

function binFormatExpression(
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
