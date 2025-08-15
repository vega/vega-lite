import {isObject, isString} from 'vega-util';
import {DateTimeExpr, dateTimeExprToExpr} from './datetime';
import {accessPathWithDatum, keys, stringify, varName} from './util';

/** Time Unit that only corresponds to only one part of Date objects. */
export const LOCAL_SINGLE_TIMEUNIT_INDEX = {
  year: 1,
  quarter: 1,
  month: 1,
  week: 1,
  day: 1,
  dayofyear: 1,
  date: 1,
  hours: 1,
  minutes: 1,
  seconds: 1,
  milliseconds: 1
} as const;

export type LocalSingleTimeUnit = keyof typeof LOCAL_SINGLE_TIMEUNIT_INDEX;

export const TIMEUNIT_PARTS = keys(LOCAL_SINGLE_TIMEUNIT_INDEX);

export function isLocalSingleTimeUnit(timeUnit: string): timeUnit is LocalSingleTimeUnit {
  return !!LOCAL_SINGLE_TIMEUNIT_INDEX[timeUnit];
}

export const UTC_SINGLE_TIMEUNIT_INDEX = {
  utcyear: 1,
  utcquarter: 1,
  utcmonth: 1,
  utcweek: 1,
  utcday: 1,
  utcdayofyear: 1,
  utcdate: 1,
  utchours: 1,
  utcminutes: 1,
  utcseconds: 1,
  utcmilliseconds: 1
} as const;

export type UtcSingleTimeUnit = keyof typeof UTC_SINGLE_TIMEUNIT_INDEX;

export type SingleTimeUnit = LocalSingleTimeUnit | UtcSingleTimeUnit;

export const LOCAL_MULTI_TIMEUNIT_INDEX = {
  yearquarter: 1,
  yearquartermonth: 1,

  yearmonth: 1,
  yearmonthdate: 1,
  yearmonthdatehours: 1,
  yearmonthdatehoursminutes: 1,
  yearmonthdatehoursminutesseconds: 1,

  yearweek: 1,
  yearweekday: 1,
  yearweekdayhours: 1,
  yearweekdayhoursminutes: 1,
  yearweekdayhoursminutesseconds: 1,

  yeardayofyear: 1,

  quartermonth: 1,

  monthdate: 1,
  monthdatehours: 1,
  monthdatehoursminutes: 1,
  monthdatehoursminutesseconds: 1,

  weekday: 1,
  weekdayhours: 1,
  weekdayhoursminutes: 1,
  weekdayhoursminutesseconds: 1,

  dayhours: 1,
  dayhoursminutes: 1,
  dayhoursminutesseconds: 1,

  hoursminutes: 1,
  hoursminutesseconds: 1,

  minutesseconds: 1,

  secondsmilliseconds: 1
} as const;

export type LocalMultiTimeUnit = keyof typeof LOCAL_MULTI_TIMEUNIT_INDEX;

export const UTC_MULTI_TIMEUNIT_INDEX = {
  utcyearquarter: 1,
  utcyearquartermonth: 1,

  utcyearmonth: 1,
  utcyearmonthdate: 1,
  utcyearmonthdatehours: 1,
  utcyearmonthdatehoursminutes: 1,
  utcyearmonthdatehoursminutesseconds: 1,

  utcyearweek: 1,
  utcyearweekday: 1,
  utcyearweekdayhours: 1,
  utcyearweekdayhoursminutes: 1,
  utcyearweekdayhoursminutesseconds: 1,

  utcyeardayofyear: 1,

  utcquartermonth: 1,

  utcmonthdate: 1,
  utcmonthdatehours: 1,
  utcmonthdatehoursminutes: 1,
  utcmonthdatehoursminutesseconds: 1,

  utcweekday: 1,
  utcweekdayhours: 1,
  utcweekdayhoursminutes: 1,
  utcweekdayhoursminutesseconds: 1,

  utcdayhours: 1,
  utcdayhoursminutes: 1,
  utcdayhoursminutesseconds: 1,

  utchoursminutes: 1,
  utchoursminutesseconds: 1,

  utcminutesseconds: 1,

  utcsecondsmilliseconds: 1
} as const;

export type UtcMultiTimeUnit = keyof typeof UTC_MULTI_TIMEUNIT_INDEX;

export type MultiTimeUnit = LocalMultiTimeUnit | UtcMultiTimeUnit;

export type LocalTimeUnit = LocalSingleTimeUnit | LocalMultiTimeUnit;
export type UtcTimeUnit = UtcSingleTimeUnit | UtcMultiTimeUnit;

export function isUTCTimeUnit(t: string): t is UtcTimeUnit {
  return t.startsWith('utc');
}

export function getLocalTimeUnit(t: UtcTimeUnit): LocalTimeUnit {
  return t.substr(3) as LocalTimeUnit;
}

export type TimeUnit = SingleTimeUnit | MultiTimeUnit;

export type TimeUnitFormat =
  | 'year'
  | 'year-month'
  | 'year-month-date'
  | 'quarter'
  | 'month'
  | 'date'
  | 'week'
  | 'day'
  | 'hours'
  | 'hours-minutes'
  | 'minutes'
  | 'seconds'
  | 'milliseconds';

export interface TimeUnitParams {
  /**
   * Defines how date-time values should be binned.
   */
  unit?: TimeUnit;

  /**
   * If no `unit` is specified, maxbins is used to infer time units.
   */
  maxbins?: number;

  /**
   * The number of steps between bins, in terms of the least
   * significant unit provided.
   */
  step?: number;

  /**
   * True to use UTC timezone. Equivalent to using a `utc` prefixed `TimeUnit`.
   */
  utc?: boolean;
}

// matches vega time unit format specifier
export type TimeFormatConfig = Partial<Record<TimeUnitFormat, string>>;

// In order of increasing specificity
export const VEGALITE_TIMEFORMAT: TimeFormatConfig = {
  'year-month': '%b %Y ',
  'year-month-date': '%b %d, %Y '
};

export function getTimeUnitParts(timeUnit: TimeUnit): LocalSingleTimeUnit[] {
  return TIMEUNIT_PARTS.filter(part => containsTimeUnit(timeUnit, part));
}

/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
export function containsTimeUnit(fullTimeUnit: TimeUnit, timeUnit: TimeUnit) {
  const index = fullTimeUnit.indexOf(timeUnit);

  if (index < 0) {
    return false;
  }

  // exclude milliseconds
  if (index > 0 && timeUnit === 'seconds' && fullTimeUnit.charAt(index - 1) === 'i') {
    return false;
  }

  // exclude dayofyear
  if (fullTimeUnit.length > index + 3 && timeUnit === 'day' && fullTimeUnit.charAt(index + 3) === 'o') {
    return false;
  }
  if (index > 0 && timeUnit === 'year' && fullTimeUnit.charAt(index - 1) === 'f') {
    return false;
  }

  return true;
}

/**
 * Returns Vega expression for a given timeUnit and fieldRef
 */
export function fieldExpr(fullTimeUnit: TimeUnit, field: string, {end}: {end: boolean} = {end: false}): string {
  const fieldRef = accessPathWithDatum(field);

  const utc = isUTCTimeUnit(fullTimeUnit) ? 'utc' : '';

  function func(timeUnit: TimeUnit) {
    if (timeUnit === 'quarter') {
      // quarter starting at 0 (0,3,6,9).
      return `(${utc}quarter(${fieldRef})-1)`;
    } else {
      return `${utc}${timeUnit}(${fieldRef})`;
    }
  }

  let lastTimeUnit: TimeUnit;

  const dateExpr: DateTimeExpr = {};

  for (const part of TIMEUNIT_PARTS) {
    if (containsTimeUnit(fullTimeUnit, part)) {
      dateExpr[part] = func(part);
      lastTimeUnit = part;
    }
  }

  if (end) {
    dateExpr[lastTimeUnit] += '+1';
  }

  return dateTimeExprToExpr(dateExpr);
}

export function timeUnitSpecifierExpression(timeUnit: TimeUnit) {
  if (!timeUnit) {
    return undefined;
  }

  const timeUnitParts = getTimeUnitParts(timeUnit);
  return `timeUnitSpecifier(${stringify(timeUnitParts)}, ${stringify(VEGALITE_TIMEFORMAT)})`;
}

/**
 * Returns the signal expression used for axis labels for a time unit.
 */
export function formatExpression(timeUnit: TimeUnit, field: string, isUTCScale: boolean): string {
  if (!timeUnit) {
    return undefined;
  }

  const expr = timeUnitSpecifierExpression(timeUnit);

  // We only use utcFormat for utc scale
  // For utc time units, the data is already converted as a part of timeUnit transform.
  // Thus, utc time units should use timeFormat to avoid shifting the time twice.
  const utc = isUTCScale || isUTCTimeUnit(timeUnit);

  return `${utc ? 'utc' : 'time'}Format(${field}, ${expr})`;
}

export function normalizeTimeUnit(timeUnit: TimeUnit | TimeUnitParams): TimeUnitParams {
  if (!timeUnit) {
    return undefined;
  }

  let params: TimeUnitParams;
  if (isString(timeUnit)) {
    params = {
      unit: timeUnit
    };
  } else if (isObject(timeUnit)) {
    params = {
      ...timeUnit,
      ...(timeUnit.unit ? {unit: timeUnit.unit} : {})
    };
  }

  if (isUTCTimeUnit(params.unit)) {
    params.utc = true;
    params.unit = getLocalTimeUnit(params.unit);
  }

  return params;
}

export function timeUnitToString(tu: TimeUnit | TimeUnitParams) {
  const {utc, ...rest} = normalizeTimeUnit(tu);

  if (rest.unit) {
    return (
      (utc ? 'utc' : '') +
      keys(rest)
        .map(p => varName(`${p === 'unit' ? '' : `_${p}_`}${rest[p]}`))
        .join('')
    );
  } else {
    // when maxbins is specified instead of units
    return (
      (utc ? 'utc' : '') +
      'timeunit' +
      keys(rest)
        .map(p => varName(`_${p}_${rest[p]}`))
        .join('')
    );
  }
}
