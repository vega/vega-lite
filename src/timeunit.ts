import {DateTimeExpr, dateTimeExpr} from './datetime';
import * as log from './log';
import {Dict, keys} from './util';

export namespace TimeUnit {
  export const YEAR: 'year' = 'year';
  export const MONTH: 'month' = 'month';
  export const DAY: 'day' = 'day';
  export const DATE: 'date' = 'date';
  export const HOURS: 'hours' = 'hours';
  export const MINUTES: 'minutes' = 'minutes';
  export const SECONDS: 'seconds' = 'seconds';
  export const MILLISECONDS: 'milliseconds' = 'milliseconds';
  export const YEARMONTH: 'yearmonth' = 'yearmonth';
  export const YEARMONTHDATE: 'yearmonthdate' = 'yearmonthdate';
  export const YEARMONTHDATEHOURS: 'yearmonthdatehours' = 'yearmonthdatehours';
  export const YEARMONTHDATEHOURSMINUTES: 'yearmonthdatehoursminutes' = 'yearmonthdatehoursminutes';
  export const YEARMONTHDATEHOURSMINUTESSECONDS: 'yearmonthdatehoursminutesseconds' = 'yearmonthdatehoursminutesseconds';

  // MONTHDATE always include 29 February since we use year 0th (which is a leap year);
  export const MONTHDATE: 'monthdate' = 'monthdate';
  export const HOURSMINUTES: 'hoursminutes' = 'hoursminutes';
  export const HOURSMINUTESSECONDS: 'hoursminutesseconds' = 'hoursminutesseconds';
  export const MINUTESSECONDS: 'minutesseconds' = 'minutesseconds';
  export const SECONDSMILLISECONDS: 'secondsmilliseconds' = 'secondsmilliseconds';
  export const QUARTER: 'quarter' = 'quarter';
  export const YEARQUARTER: 'yearquarter' = 'yearquarter';
  export const QUARTERMONTH: 'quartermonth' = 'quartermonth';
  export const YEARQUARTERMONTH: 'yearquartermonth' = 'yearquartermonth';
}

export type TimeUnit = typeof TimeUnit.YEAR | typeof TimeUnit.MONTH | typeof TimeUnit.DAY | typeof TimeUnit.DATE | typeof TimeUnit.HOURS
  | typeof TimeUnit.MINUTES | typeof TimeUnit.SECONDS | typeof TimeUnit.MILLISECONDS | typeof TimeUnit.YEARMONTH
  | typeof TimeUnit.YEARMONTHDATE | typeof TimeUnit.YEARMONTHDATEHOURS | typeof TimeUnit.YEARMONTHDATEHOURSMINUTES
  | typeof TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS | typeof TimeUnit.MONTHDATE | typeof TimeUnit.HOURSMINUTES
  | typeof TimeUnit.HOURSMINUTESSECONDS | typeof TimeUnit.MINUTESSECONDS | typeof TimeUnit.SECONDSMILLISECONDS
  | typeof TimeUnit.QUARTER | typeof TimeUnit.YEARQUARTER | typeof TimeUnit.QUARTERMONTH | typeof TimeUnit.YEARQUARTERMONTH;

/** Time Unit that only corresponds to only one part of Date objects. */
export const SINGLE_TIMEUNITS = [
  TimeUnit.YEAR,
  TimeUnit.QUARTER,
  TimeUnit.MONTH,
  TimeUnit.DAY,
  TimeUnit.DATE,
  TimeUnit.HOURS,
  TimeUnit.MINUTES,
  TimeUnit.SECONDS,
  TimeUnit.MILLISECONDS,
];

const SINGLE_TIMEUNIT_INDEX: Dict<boolean> = SINGLE_TIMEUNITS.reduce((d, timeUnit) => {
  d[timeUnit] = true;
  return d;
}, {});

export function isSingleTimeUnit(timeUnit: TimeUnit) {
  return !!SINGLE_TIMEUNIT_INDEX[timeUnit];
}

/**
 * Converts a date to only have the measurements relevant to the specified unit
 * i.e. ('yearmonth', '2000-12-04 07:58:14') -> '2000-12-01 00:00:00'
 * Note: the base date is Jan 01 1900 00:00:00
 */
export function convert(unit: TimeUnit, date: Date): Date {
  const result: Date = new Date(0, 0, 1, 0, 0, 0, 0); // start with uniform date
  SINGLE_TIMEUNITS.forEach(function(singleUnit) {
    if (containsTimeUnit(unit, singleUnit)) {
      switch (singleUnit) {
        case TimeUnit.DAY:
          throw new Error('Cannot convert to TimeUnits containing \'day\'');
        case TimeUnit.YEAR:
          result.setFullYear(date.getFullYear());
          break;
        case TimeUnit.QUARTER:
          // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
          result.setMonth((Math.floor(date.getMonth() / 3)) * 3);
          break;
        case TimeUnit.MONTH:
          result.setMonth(date.getMonth());
          break;
        case TimeUnit.DATE:
          result.setDate(date.getDate());
          break;
        case TimeUnit.HOURS:
          result.setHours(date.getHours());
          break;
        case TimeUnit.MINUTES:
          result.setMinutes(date.getMinutes());
          break;
        case TimeUnit.SECONDS:
          result.setSeconds(date.getSeconds());
          break;
        case TimeUnit.MILLISECONDS:
          result.setMilliseconds(date.getMilliseconds());
          break;
      }
    }
  });

  return result;
}

export const MULTI_TIMEUNITS = [
  TimeUnit.YEARQUARTER,
  TimeUnit.YEARQUARTERMONTH,
  TimeUnit.YEARMONTH,
  TimeUnit.YEARMONTHDATE,
  TimeUnit.YEARMONTHDATEHOURS,
  TimeUnit.YEARMONTHDATEHOURSMINUTES,
  TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
  TimeUnit.QUARTERMONTH,
  TimeUnit.HOURSMINUTES,
  TimeUnit.HOURSMINUTESSECONDS,
  TimeUnit.MINUTESSECONDS,
  TimeUnit.SECONDSMILLISECONDS,
];

const MULTI_TIMEUNIT_INDEX: Dict<boolean> = MULTI_TIMEUNITS.reduce((d, timeUnit) => {
  d[timeUnit] = true;
  return d;
}, {});

export function isMultiTimeUnit(timeUnit: TimeUnit) {
  return !!MULTI_TIMEUNIT_INDEX[timeUnit];
}

export const TIMEUNITS = [
  TimeUnit.YEAR,
  TimeUnit.QUARTER,
  TimeUnit.MONTH,
  TimeUnit.DAY,
  TimeUnit.DATE,
  TimeUnit.HOURS,
  TimeUnit.MINUTES,
  TimeUnit.SECONDS,
  TimeUnit.MILLISECONDS,
  TimeUnit.YEARQUARTER,
  TimeUnit.YEARQUARTERMONTH,
  TimeUnit.YEARMONTH,
  TimeUnit.YEARMONTHDATE,
  TimeUnit.YEARMONTHDATEHOURS,
  TimeUnit.YEARMONTHDATEHOURSMINUTES,
  TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
  TimeUnit.QUARTERMONTH,
  TimeUnit.HOURSMINUTES,
  TimeUnit.HOURSMINUTESSECONDS,
  TimeUnit.MINUTESSECONDS,
  TimeUnit.SECONDSMILLISECONDS
];

/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
export function containsTimeUnit(fullTimeUnit: TimeUnit, timeUnit: TimeUnit) {
  const index = fullTimeUnit.indexOf(timeUnit);
  return index > -1 &&
    (
      timeUnit !== TimeUnit.SECONDS ||
      index === 0 ||
      fullTimeUnit.charAt(index-1) !== 'i' // exclude milliseconds
    );
}

/**
 * Returns Vega expresssion for a given timeUnit and fieldRef
 */
export function fieldExpr(fullTimeUnit: TimeUnit, field: string): string {
  const fieldRef =  `datum["${field}"]`;

  function func(timeUnit: TimeUnit) {
    if (timeUnit === TimeUnit.QUARTER) {
      // quarter starting at 0 (0,3,6,9).
      return `(quarter(${fieldRef})-1)`;
    } else {
      return `${timeUnit}(${fieldRef})`;
    }
  }

  const d = SINGLE_TIMEUNITS.reduce((_d: DateTimeExpr, tu: TimeUnit) => {
    if (containsTimeUnit(fullTimeUnit, tu)) {
      _d[tu] = func(tu);
    }
    return _d;
  }, {});

  if (d.day && keys(d).length > 1) {
    log.warn(log.message.dayReplacedWithDate(fullTimeUnit));
    delete d.day;
    d.date = func(TimeUnit.DATE);
  }

  return dateTimeExpr(d);
}

/** returns the smallest nice unit for scale.nice */
export function smallestUnit(timeUnit: TimeUnit): string {
  if (!timeUnit) {
    return undefined;
  }

  if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
    return 'second';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
    return 'minute';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
    return 'hour';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.DAY) ||
      containsTimeUnit(timeUnit, TimeUnit.DATE)) {
    return 'day';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
    return 'month';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.YEAR)) {
    return 'year';
  }
  return undefined;
}

/** returns the signal expression used for axis labels for a time unit */
export function formatExpression(timeUnit: TimeUnit, field: string, shortTimeLabels: boolean): string {
  if (!timeUnit) {
    return undefined;
  }

  const dateComponents: string[] = [];
  let expression = '';
  const hasYear = containsTimeUnit(timeUnit, TimeUnit.YEAR);

  if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
   // special expression for quarter as prefix
    expression = `'Q' + quarter(${field})`;
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
    // By default use short month name
    dateComponents.push(shortTimeLabels !== false ? '%b' : '%B');
  }

  if (containsTimeUnit(timeUnit, TimeUnit.DAY)) {
    dateComponents.push(shortTimeLabels ? '%a' : '%A');
  } else if (containsTimeUnit(timeUnit, TimeUnit.DATE)) {
    dateComponents.push('%d' + (hasYear ? ',' : '')); // add comma if there is year
  }

  if (hasYear) {
    dateComponents.push(shortTimeLabels ? '%y' : '%Y');
  }

  const timeComponents: string[] = [];

  if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
    timeComponents.push('%H');
  }
  if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
    timeComponents.push('%M');
  }
  if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
    timeComponents.push('%S');
  }
  if (containsTimeUnit(timeUnit, TimeUnit.MILLISECONDS)) {
    timeComponents.push('%L');
  }

  const dateTimeComponents: string[] = [];
  if (dateComponents.length > 0) {
    dateTimeComponents.push(dateComponents.join(' '));
  }
  if (timeComponents.length > 0) {
    dateTimeComponents.push(timeComponents.join(':'));
  }

  if (dateTimeComponents.length > 0) {
    if (expression) {
      // Add space between quarter and main time format
      expression += ` + ' ' + `;
    }
    expression += `timeFormat(${field}, '${dateTimeComponents.join(' ')}')`;
  }

  // If expression is still an empty string, return undefined instead.
  return expression || undefined;
}

export function isDiscreteByDefault(timeUnit: TimeUnit) {
  switch (timeUnit) {
    // These time unit use discrete scale by default
    case 'hours':
    case 'day':
    case 'month':
    case 'quarter':
      return true;
  }
  return false;
}
