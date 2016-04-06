
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
    YEARDATE = 'yeardate' as any,
    YEARMONTHDAYHOURS = 'yearmonthdayhours' as any,
    YEARMONTHDAYHOURSMINUTES = 'yearmonthdayhoursminutes' as any,
    YEARMONTHDAYHOURSMINUTESSECONDS = 'yearmonthdayhoursminutesseconds' as any,
    HOURSMINUTES = 'hoursminutes' as any,
    HOURSMINUTESSECONDS = 'hoursminutesseconds' as any,
    MINUTESSECONDS = 'minutesseconds' as any,
    SECONDSMILLISECONDS = 'secondsmilliseconds' as any,
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
    TimeUnit.YEARDATE,
    TimeUnit.YEARMONTHDAYHOURS,
    TimeUnit.YEARMONTHDAYHOURSMINUTES,
    TimeUnit.YEARMONTHDAYHOURSMINUTESSECONDS,
    TimeUnit.HOURSMINUTES,
    TimeUnit.HOURSMINUTESSECONDS,
    TimeUnit.MINUTESSECONDS,
    TimeUnit.SECONDSMILLISECONDS,
];

/** returns the template name used for axis labels for a time unit */
export function format(timeUnit: TimeUnit, abbreviated = false): string {
  if (!timeUnit) {
    return undefined;
  }

  let timeString = timeUnit.toString();

  let dateComponents = [];

  if (timeString.indexOf('year') > -1) {
    dateComponents.push(abbreviated ? '%y' : '%Y');
  }

  if (timeString.indexOf('month') > -1) {
    dateComponents.push(abbreviated ? '%b' : '%B');
  }

  if (timeString.indexOf('day') > -1) {
    dateComponents.push(abbreviated ? '%a' : '%A');
  } else if (timeString.indexOf('date') > -1) {
    dateComponents.push('%d');
  }

  let timeComponents = [];

  if (timeString.indexOf('hours') > -1) {
    timeComponents.push('%H');
  }
  if (timeString.indexOf('minutes') > -1) {
    timeComponents.push('%M');
  }
  if (timeString.indexOf('seconds') > -1) {
    timeComponents.push('%S');
  }
  if (timeString.indexOf('milliseconds') > -1) {
    timeComponents.push('%L');
  }

  let out = [];
  if (dateComponents.length > 0) {
    out.push(dateComponents.join('-'));
  }
  if (timeComponents.length > 0) {
    out.push(timeComponents.join(':'));
  }

  return out.length > 0 ? out.join(' ') : undefined;
}
