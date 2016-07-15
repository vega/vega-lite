import {contains, range} from './util';
import {COLUMN, ROW, SHAPE, COLOR, Channel} from './channel';

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
    YEARMONTHDAY = 'yearmonthday' as any,
    YEARMONTHDATE = 'yearmonthdate' as any,
    YEARDAY = 'yearday' as any,
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

export const TIMEUNITS = [
    TimeUnit.YEAR,
    TimeUnit.MONTH,
    TimeUnit.DAY,
    TimeUnit.DATE,
    TimeUnit.HOURS,
    TimeUnit.MINUTES,
    TimeUnit.SECONDS,
    TimeUnit.MILLISECONDS,
    TimeUnit.YEARMONTH,
    TimeUnit.YEARMONTHDAY,
    TimeUnit.YEARMONTHDATE,
    TimeUnit.YEARDAY,
    TimeUnit.YEARMONTHDATEHOURS,
    TimeUnit.YEARMONTHDATEHOURSMINUTES,
    TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
    TimeUnit.HOURSMINUTES,
    TimeUnit.HOURSMINUTESSECONDS,
    TimeUnit.MINUTESSECONDS,
    TimeUnit.SECONDSMILLISECONDS,
    TimeUnit.QUARTER,
    TimeUnit.YEARQUARTER,
    TimeUnit.QUARTERMONTH,
    TimeUnit.YEARQUARTERMONTH,
];

/** Returns true if container contains the containee, false otherwise. */
export function containsTimeUnit(fullTimeUnit: TimeUnit, timeUnit: TimeUnit) {
  let fullTimeUnitStr = fullTimeUnit.toString();
  let timeUnitStr = timeUnit.toString();
  return fullTimeUnitStr.indexOf(timeUnitStr) > -1;
}

/**
 * Returns Vega expresssion for a given timeUnit and fieldRef
 */
export function expression(timeUnit: TimeUnit, fieldRef: string, onlyRef = false): string {
  let out = 'datetime(';

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
  } else {
    out += '2006, '; // January 1 2006 is a Sunday
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

