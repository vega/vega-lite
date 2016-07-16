import {contains, range, Dict} from './util';
import {COLUMN, ROW, SHAPE, COLOR, Channel} from './channel';
import {ScaleType} from './scale';

export enum TimeUnit {
  YEAR = 'year' as any,
  MONTH = 'month' as any,
  DAY = 'day' as any,
  DATE = 'date' as any,
  HOURS = 'hours' as any,
  MINUTES = 'minutes' as any,
  SECONDS = 'seconds' as any,
  MILLISECONDS = 'milliseconds' as any,
  YEARMONTH = 'yearmonth' as any,
  YEARMONTHDATE = 'yearmonthdate' as any,
  YEARMONTHDATEHOURS = 'yearmonthdatehours' as any,
  YEARMONTHDATEHOURSMINUTES = 'yearmonthdatehoursminutes' as any,
  YEARMONTHDATEHOURSMINUTESSECONDS = 'yearmonthdatehoursminutesseconds' as any,
  HOURSMINUTES = 'hoursminutes' as any,
  HOURSMINUTESSECONDS = 'hoursminutesseconds' as any,
  MINUTESSECONDS = 'minutesseconds' as any,
  SECONDSMILLISECONDS = 'secondsmilliseconds' as any,
  QUARTER = 'quarter' as any,
  YEARQUARTER = 'yearquarter' as any,
  QUARTERMONTH = 'quartermonth' as any,
  YEARQUARTERMONTH = 'yearquartermonth' as any,
}

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

export const TIMEUNITS = SINGLE_TIMEUNITS.concat(MULTI_TIMEUNITS);

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

export function defaultScaleType(timeUnit: TimeUnit) {
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
export function fieldExpr(timeUnit: TimeUnit, field: string, onlyRef = false): string {
  let out = 'datetime(';
  const fieldRef = 'datum.' + field;

  function func(fun: string, addComma = true) {
    if (onlyRef) {
      return fieldRef + (addComma ? ', ' : '');
    } else {
      let res = '';
      if (fun === 'quarter') {
        // Divide by 3 to get the corresponding quarter number, multiply by 3
        // to scale to the first month of the corresponding quarter(0,3,6,9).
        res = 'floor(month(' + fieldRef + ')' + '/3)*3';
      } else {
        res = fun + '(' + fieldRef + ')' ;
      }
      return res + (addComma ? ', ' : '');
    }
  }

  if (containsTimeUnit(timeUnit, TimeUnit.YEAR)) {
    out += func('year');
  } else if (timeUnit === TimeUnit.DAY) {
    out += '2006, '; // January 1 2006 is a Sunday
  } else {
    out += '0, ';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
    out += func('month');
  } else if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
    out += func('quarter');
  } else {
    // month starts at 0 in javascript
    out += '0, ';
  }

  // need to add 1 because days start at 1
  if (containsTimeUnit(timeUnit, TimeUnit.DAY)) {
    out += func('day', false) + '+1, ';
  } else if (containsTimeUnit(timeUnit, TimeUnit.DATE)) {
    out += func('date');
  } else {
    out += '1, ';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
    out += func('hours');
  } else {
    out += '0, ';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
    out += func('minutes');
  } else {
    out += '0, ';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
    out += func('seconds');
  } else {
    out += '0, ';
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MILLISECONDS)) {
    out += func('milliseconds', false);
  } else {
    out += '0';
  }

  return out + ')';
}

/** Generate the complete raw domain. */
export function rawDomain(timeUnit: TimeUnit, channel: Channel) {
  if (contains([ROW, COLUMN, SHAPE, COLOR], channel)) {
    return null;
  }

  switch (timeUnit) {
    case TimeUnit.SECONDS:
      return range(0, 60);
    case TimeUnit.MINUTES:
      return range(0, 60);
    case TimeUnit.HOURS:
      return range(0, 24);
    case TimeUnit.DAY:
      return range(0, 7);
    case TimeUnit.DATE:
      return range(1, 32);
    case TimeUnit.MONTH:
      return range(0, 12);
    case TimeUnit.QUARTER:
      return [0,3,6,9];
  }

  return null;
}

/** returns the smallest nice unit for scale.nice */
export function smallestUnit(timeUnit): string {
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

  let dateComponents = [];

  if (containsTimeUnit(timeUnit, TimeUnit.YEAR)) {
    dateComponents.push(shortTimeLabels ? '%y' : '%Y');
  }

  if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
   // special template for quarter
   dateComponents.push('\'}}Q{{' + field + ' | quarter}}{{' + field + ' | time:\'');
  }

  if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
    dateComponents.push(shortTimeLabels ? '%b' : '%B');
  }

  if (containsTimeUnit(timeUnit, TimeUnit.DAY)) {
    dateComponents.push(shortTimeLabels ? '%a' : '%A');
  } else if (containsTimeUnit(timeUnit, TimeUnit.DATE)) {
    dateComponents.push('%d');
  }

  let timeComponents = [];

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

  let out = [];
  if (dateComponents.length > 0) {
    out.push(dateComponents.join('-'));
  }
  if (timeComponents.length > 0) {
    out.push(timeComponents.join(':'));
  }

  if (out.length > 0) {
  // clean up empty formatting expressions that may have been generated by the quarter time unit
   const template = '{{' + field + ' | time:\'' + out.join(' ') + '\'}}';

   // FIXME: Remove this RegExp Hack!!!
   return template.replace(new RegExp('{{' + field + ' \\| time:\'\'}}', 'g'), '');
  } else {
   return undefined;
  }
}

