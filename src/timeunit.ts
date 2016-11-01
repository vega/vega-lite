import {DateTimeExpr, dateTimeExpr} from './datetime';
import {ScaleType} from './scale';
import {Dict, keys} from './util';
import * as log from './log';

export namespace TimeUnit {
  export const YEAR: 'year' = 'year';
  export type YEAR = typeof YEAR;
  export const MONTH: 'month' = 'month';
  export type MONTH = typeof MONTH;
  export const DAY: 'day' = 'day';
  export type DAY = typeof DAY;
  export const DATE: 'date' = 'date';
  export type DATE = typeof DATE;
  export const HOURS: 'hours' = 'hours';
  export type HOURS = typeof HOURS;
  export const MINUTES: 'minutes' = 'minutes';
  export type MINUTES = typeof MINUTES;
  export const SECONDS: 'seconds' = 'seconds';
  export type SECONDS = typeof SECONDS;
  export const MILLISECONDS: 'milliseconds' = 'milliseconds';
  export type MILLISECONDS = typeof MILLISECONDS;
  export const YEARMONTH: 'yearmonth' = 'yearmonth';
  export type YEARMONTH = typeof YEARMONTH;
  export const YEARMONTHDATE: 'yearmonthdate' = 'yearmonthdate';
  export type YEARMONTHDATE = typeof YEARMONTHDATE;
  export const YEARMONTHDATEHOURS: 'yearmonthdatehours' = 'yearmonthdatehours';
  export type YEARMONTHDATEHOURS = typeof YEARMONTHDATEHOURS;
  export const YEARMONTHDATEHOURSMINUTES: 'yearmonthdatehoursminutes' = 'yearmonthdatehoursminutes';
  export type YEARMONTHDATEHOURSMINUTES = typeof YEARMONTHDATEHOURSMINUTES;
  export const YEARMONTHDATEHOURSMINUTESSECONDS: 'yearmonthdatehoursminutesseconds' = 'yearmonthdatehoursminutesseconds';
  export type YEARMONTHDATEHOURSMINUTESSECONDS = typeof YEARMONTHDATEHOURSMINUTESSECONDS;

  // MONTHDATE always include 29 February since we use year 0th (which is a leap year);
  export const MONTHDATE: 'monthdate' = 'monthdate';
  export type MONTHDATE = typeof MONTHDATE;
  export const HOURSMINUTES: 'hoursminutes' = 'hoursminutes';
  export type HOURSMINUTES = typeof HOURSMINUTES;
  export const HOURSMINUTESSECONDS: 'hoursminutesseconds' = 'hoursminutesseconds';
  export type HOURSMINUTESSECONDS = typeof HOURSMINUTESSECONDS;
  export const MINUTESSECONDS: 'minutesseconds' = 'minutesseconds';
  export type MINUTESSECONDS = typeof MINUTESSECONDS;
  export const SECONDSMILLISECONDS: 'secondsmilliseconds' = 'secondsmilliseconds';
  export type SECONDSMILLISECONDS = typeof SECONDSMILLISECONDS;
  export const QUARTER: 'quarter' = 'quarter';
  export type QUARTER = typeof QUARTER;
  export const YEARQUARTER: 'yearquarter' = 'yearquarter';
  export type YEARQUARTER = typeof YEARQUARTER;
  export const QUARTERMONTH: 'quartermonth' = 'quartermonth';
  export type QUARTERMONTH = typeof QUARTERMONTH;
  export const YEARQUARTERMONTH: 'yearquartermonth' = 'yearquartermonth';
  export type YEARQUARTERMONTH = typeof YEARQUARTERMONTH;
}
export type TimeUnit = TimeUnit.YEAR | TimeUnit.MONTH | TimeUnit.DAY | TimeUnit.DATE | TimeUnit.HOURS
  | TimeUnit.MINUTES | TimeUnit.SECONDS | TimeUnit.MILLISECONDS | TimeUnit.YEARMONTH
  | TimeUnit.YEARMONTHDATE | TimeUnit.YEARMONTHDATEHOURS | TimeUnit.YEARMONTHDATEHOURSMINUTES
  | TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS | TimeUnit.MONTHDATE | TimeUnit.HOURSMINUTES
  | TimeUnit.HOURSMINUTESSECONDS | TimeUnit.MINUTESSECONDS | TimeUnit.SECONDSMILLISECONDS
  | TimeUnit.QUARTER | TimeUnit.YEARQUARTER | TimeUnit.QUARTERMONTH | TimeUnit.YEARQUARTERMONTH;

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
}, {} as Dict<boolean>);

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
}, {} as Dict<boolean>);

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
  let fullTimeUnitStr = fullTimeUnit.toString();
  let timeUnitStr = timeUnit.toString();
  const index = fullTimeUnitStr.indexOf(timeUnitStr);
  return index > -1 &&
    (
      timeUnit !== TimeUnit.SECONDS ||
      index === 0 ||
      fullTimeUnitStr.charAt(index-1) !== 'i' // exclude milliseconds
    );
}

export function defaultScaleType(timeUnit: TimeUnit): ScaleType {
   switch (timeUnit) {
    case TimeUnit.HOURS:
    case TimeUnit.DAY:
    case TimeUnit.MONTH:
    case TimeUnit.QUARTER:
      return ScaleType.ORDINAL;
  }
  // date, year, minute, second, yearmonth, monthday, ...
  return ScaleType.TIME;
}

/**
 * Returns Vega expresssion for a given timeUnit and fieldRef
 */
export function fieldExpr(fullTimeUnit: TimeUnit, field: string): string {
  const fieldRef = 'datum["' + field + '"]';

  function func(timeUnit: TimeUnit) {
    if (timeUnit === TimeUnit.QUARTER) {
      // Divide by 3 to get the corresponding quarter number, multiply by 3
      // to scale to the first month of the corresponding quarter(0,3,6,9).
      return 'floor(month(' + fieldRef + ')' + '/3)';
    } else {
      return timeUnit + '(' + fieldRef + ')' ;
    }
  }

  let d = SINGLE_TIMEUNITS.reduce((_d: DateTimeExpr, tu: TimeUnit) => {
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

/** returns the template name used for axis labels for a time unit */
export function template(timeUnit: TimeUnit, field: string, shortTimeLabels: boolean): string {
  if (!timeUnit) {
    return undefined;
  }

  let dateComponents: string[] = [];
  let template = '';
  const hasYear = containsTimeUnit(timeUnit, TimeUnit.YEAR);

  if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
   // special template for quarter as prefix
    template = 'Q{{' + field + ' | quarter}}';
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

  let timeComponents: string[] = [];

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

  let dateTimeComponents: string[] = [];
  if (dateComponents.length > 0) {
    dateTimeComponents.push(dateComponents.join(' '));
  }
  if (timeComponents.length > 0) {
    dateTimeComponents.push(timeComponents.join(':'));
  }

  if (dateTimeComponents.length > 0) {
    if (template) {
      // Add space between quarter and main time format
      template += ' ';
    }
    template += '{{' + field + ' | time:\'' + dateTimeComponents.join(' ') + '\'}}';
  }

  // If template is still an empty string, return undefined instead.
  return template || undefined;
}

