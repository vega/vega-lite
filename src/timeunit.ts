import {DateTimeExpr, dateTimeExpr} from './datetime';
import * as log from './log';
import {accessPathWithDatum, Flag, flagKeys} from './util';

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
  export const YEARMONTHDATEHOURSMINUTESSECONDS: 'yearmonthdatehoursminutesseconds' =
    'yearmonthdatehoursminutesseconds';

  // MONTHDATE and MONTHDATEHOURS always include 29 February since we use year 0th (which is a leap year);
  export const MONTHDATE: 'monthdate' = 'monthdate';
  export const MONTHDATEHOURS: 'monthdatehours' = 'monthdatehours';
  export const HOURSMINUTES: 'hoursminutes' = 'hoursminutes';
  export const HOURSMINUTESSECONDS: 'hoursminutesseconds' = 'hoursminutesseconds';
  export const MINUTESSECONDS: 'minutesseconds' = 'minutesseconds';
  export const SECONDSMILLISECONDS: 'secondsmilliseconds' = 'secondsmilliseconds';
  export const QUARTER: 'quarter' = 'quarter';
  export const YEARQUARTER: 'yearquarter' = 'yearquarter';
  export const QUARTERMONTH: 'quartermonth' = 'quartermonth';
  export const YEARQUARTERMONTH: 'yearquartermonth' = 'yearquartermonth';
  export const UTCYEAR: 'utcyear' = 'utcyear';
  export const UTCMONTH: 'utcmonth' = 'utcmonth';
  export const UTCDAY: 'utcday' = 'utcday';
  export const UTCDATE: 'utcdate' = 'utcdate';
  export const UTCHOURS: 'utchours' = 'utchours';
  export const UTCMINUTES: 'utcminutes' = 'utcminutes';
  export const UTCSECONDS: 'utcseconds' = 'utcseconds';
  export const UTCMILLISECONDS: 'utcmilliseconds' = 'utcmilliseconds';
  export const UTCYEARMONTH: 'utcyearmonth' = 'utcyearmonth';
  export const UTCYEARMONTHDATE: 'utcyearmonthdate' = 'utcyearmonthdate';
  export const UTCYEARMONTHDATEHOURS: 'utcyearmonthdatehours' = 'utcyearmonthdatehours';
  export const UTCYEARMONTHDATEHOURSMINUTES: 'utcyearmonthdatehoursminutes' = 'utcyearmonthdatehoursminutes';
  export const UTCYEARMONTHDATEHOURSMINUTESSECONDS: 'utcyearmonthdatehoursminutesseconds' =
    'utcyearmonthdatehoursminutesseconds';

  // UTCMONTHDATE and UTCMONTHDATEHOURS always include 29 February since we use year 0th (which is a leap year);
  export const UTCMONTHDATE: 'utcmonthdate' = 'utcmonthdate';
  export const UTCMONTHDATEHOURS: 'utcmonthdatehours' = 'utcmonthdatehours';
  export const UTCHOURSMINUTES: 'utchoursminutes' = 'utchoursminutes';
  export const UTCHOURSMINUTESSECONDS: 'utchoursminutesseconds' = 'utchoursminutesseconds';
  export const UTCMINUTESSECONDS: 'utcminutesseconds' = 'utcminutesseconds';
  export const UTCSECONDSMILLISECONDS: 'utcsecondsmilliseconds' = 'utcsecondsmilliseconds';
  export const UTCQUARTER: 'utcquarter' = 'utcquarter';
  export const UTCYEARQUARTER: 'utcyearquarter' = 'utcyearquarter';
  export const UTCQUARTERMONTH: 'utcquartermonth' = 'utcquartermonth';
  export const UTCYEARQUARTERMONTH: 'utcyearquartermonth' = 'utcyearquartermonth';
}

export type LocalSingleTimeUnit =
  | typeof TimeUnit.YEAR
  | typeof TimeUnit.QUARTER
  | typeof TimeUnit.MONTH
  | typeof TimeUnit.DAY
  | typeof TimeUnit.DATE
  | typeof TimeUnit.HOURS
  | typeof TimeUnit.MINUTES
  | typeof TimeUnit.SECONDS
  | typeof TimeUnit.MILLISECONDS;

/** Time Unit that only corresponds to only one part of Date objects. */
const LOCAL_SINGLE_TIMEUNIT_INDEX: Flag<LocalSingleTimeUnit> = {
  year: 1,
  quarter: 1,
  month: 1,
  day: 1,
  date: 1,
  hours: 1,
  minutes: 1,
  seconds: 1,
  milliseconds: 1
};

export const TIMEUNIT_PARTS = flagKeys(LOCAL_SINGLE_TIMEUNIT_INDEX);

export function isLocalSingleTimeUnit(timeUnit: string): timeUnit is LocalSingleTimeUnit {
  return !!LOCAL_SINGLE_TIMEUNIT_INDEX[timeUnit];
}

export type UtcSingleTimeUnit =
  | typeof TimeUnit.UTCYEAR
  | typeof TimeUnit.UTCQUARTER
  | typeof TimeUnit.UTCMONTH
  | typeof TimeUnit.UTCDAY
  | typeof TimeUnit.UTCDATE
  | typeof TimeUnit.UTCHOURS
  | typeof TimeUnit.UTCMINUTES
  | typeof TimeUnit.UTCSECONDS
  | typeof TimeUnit.UTCMILLISECONDS;

const UTC_SINGLE_TIMEUNIT_INDEX: Flag<UtcSingleTimeUnit> = {
  utcyear: 1,
  utcquarter: 1,
  utcmonth: 1,
  utcday: 1,
  utcdate: 1,
  utchours: 1,
  utcminutes: 1,
  utcseconds: 1,
  utcmilliseconds: 1
};

export function isUtcSingleTimeUnit(timeUnit: string): timeUnit is UtcSingleTimeUnit {
  return !!UTC_SINGLE_TIMEUNIT_INDEX[timeUnit];
}

export type SingleTimeUnit = LocalSingleTimeUnit | UtcSingleTimeUnit;

export type LocalMultiTimeUnit =
  // Local Time
  | typeof TimeUnit.YEARQUARTER
  | typeof TimeUnit.YEARQUARTERMONTH
  | typeof TimeUnit.YEARMONTH
  | typeof TimeUnit.YEARMONTHDATE
  | typeof TimeUnit.YEARMONTHDATEHOURS
  | typeof TimeUnit.YEARMONTHDATEHOURSMINUTES
  | typeof TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS
  | typeof TimeUnit.QUARTERMONTH
  | typeof TimeUnit.MONTHDATE
  | typeof TimeUnit.MONTHDATEHOURS
  | typeof TimeUnit.HOURSMINUTES
  | typeof TimeUnit.HOURSMINUTESSECONDS
  | typeof TimeUnit.MINUTESSECONDS
  | typeof TimeUnit.SECONDSMILLISECONDS;

const LOCAL_MULTI_TIMEUNIT_INDEX: Flag<LocalMultiTimeUnit> = {
  yearquarter: 1,
  yearquartermonth: 1,

  yearmonth: 1,
  yearmonthdate: 1,
  yearmonthdatehours: 1,
  yearmonthdatehoursminutes: 1,
  yearmonthdatehoursminutesseconds: 1,

  quartermonth: 1,

  monthdate: 1,
  monthdatehours: 1,

  hoursminutes: 1,
  hoursminutesseconds: 1,

  minutesseconds: 1,

  secondsmilliseconds: 1
};

export type UtcMultiTimeUnit =
  | typeof TimeUnit.UTCYEARQUARTER
  | typeof TimeUnit.UTCYEARQUARTERMONTH
  | typeof TimeUnit.UTCYEARMONTH
  | typeof TimeUnit.UTCYEARMONTHDATE
  | typeof TimeUnit.UTCYEARMONTHDATEHOURS
  | typeof TimeUnit.UTCYEARMONTHDATEHOURSMINUTES
  | typeof TimeUnit.UTCYEARMONTHDATEHOURSMINUTESSECONDS
  | typeof TimeUnit.UTCQUARTERMONTH
  | typeof TimeUnit.UTCMONTHDATE
  | typeof TimeUnit.UTCMONTHDATEHOURS
  | typeof TimeUnit.UTCHOURSMINUTES
  | typeof TimeUnit.UTCHOURSMINUTESSECONDS
  | typeof TimeUnit.UTCMINUTESSECONDS
  | typeof TimeUnit.UTCSECONDSMILLISECONDS;

const UTC_MULTI_TIMEUNIT_INDEX: Flag<UtcMultiTimeUnit> = {
  utcyearquarter: 1,
  utcyearquartermonth: 1,

  utcyearmonth: 1,
  utcyearmonthdate: 1,
  utcyearmonthdatehours: 1,
  utcyearmonthdatehoursminutes: 1,
  utcyearmonthdatehoursminutesseconds: 1,

  utcquartermonth: 1,

  utcmonthdate: 1,
  utcmonthdatehours: 1,

  utchoursminutes: 1,
  utchoursminutesseconds: 1,

  utcminutesseconds: 1,

  utcsecondsmilliseconds: 1
};

export type MultiTimeUnit = LocalMultiTimeUnit | UtcMultiTimeUnit;

export type LocalTimeUnit = LocalSingleTimeUnit | LocalMultiTimeUnit;
export type UtcTimeUnit = UtcSingleTimeUnit | UtcMultiTimeUnit;

const UTC_TIMEUNIT_INDEX: Flag<UtcTimeUnit> = {
  ...UTC_SINGLE_TIMEUNIT_INDEX,
  ...UTC_MULTI_TIMEUNIT_INDEX
};

export function isUTCTimeUnit(t: string): t is UtcTimeUnit {
  return !!UTC_TIMEUNIT_INDEX[t];
}

export function getLocalTimeUnit(t: UtcTimeUnit): LocalTimeUnit {
  return t.substr(3) as LocalTimeUnit;
}

export type TimeUnit = SingleTimeUnit | MultiTimeUnit;

const TIMEUNIT_INDEX: Flag<TimeUnit> = {
  ...LOCAL_SINGLE_TIMEUNIT_INDEX,
  ...UTC_SINGLE_TIMEUNIT_INDEX,
  ...LOCAL_MULTI_TIMEUNIT_INDEX,
  ...UTC_MULTI_TIMEUNIT_INDEX
};

export const TIMEUNITS = flagKeys(TIMEUNIT_INDEX);

export function isTimeUnit(t: string): t is TimeUnit {
  return !!TIMEUNIT_INDEX[t];
}

type DateMethodName = keyof Date;

const SET_DATE_METHOD: Record<LocalSingleTimeUnit, DateMethodName> = {
  year: 'setFullYear',
  month: 'setMonth',
  date: 'setDate',
  hours: 'setHours',
  minutes: 'setMinutes',
  seconds: 'setSeconds',
  milliseconds: 'setMilliseconds',
  // Day and quarter have their own special cases
  quarter: null,
  day: null
};

/**
 * Converts a date to only have the measurements relevant to the specified unit
 * i.e. ('yearmonth', '2000-12-04 07:58:14') -> '2000-12-01 00:00:00'
 * Note: the base date is Jan 01 1900 00:00:00
 */
export function convert(unit: TimeUnit, date: Date): Date {
  const isUTC = isUTCTimeUnit(unit);
  const result: Date = isUTC
    ? // start with uniform date
      new Date(Date.UTC(1972, 0, 1, 0, 0, 0, 0)) // 1972 is the first leap year after 1970, the start of unix time
    : new Date(1972, 0, 1, 0, 0, 0, 0);
  for (const timeUnitPart of TIMEUNIT_PARTS) {
    if (containsTimeUnit(unit, timeUnitPart)) {
      switch (timeUnitPart) {
        case TimeUnit.DAY:
          throw new Error("Cannot convert to TimeUnits containing 'day'");
        case TimeUnit.QUARTER: {
          const {getDateMethod, setDateMethod} = dateMethods('month', isUTC);
          // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
          result[setDateMethod](Math.floor(date[getDateMethod]() / 3) * 3);
          break;
        }
        default:
          const {getDateMethod, setDateMethod} = dateMethods(timeUnitPart, isUTC);
          result[setDateMethod](date[getDateMethod]());
      }
    }
  }
  return result;
}

function dateMethods(singleUnit: SingleTimeUnit, isUtc: boolean) {
  const rawSetDateMethod = SET_DATE_METHOD[singleUnit];
  const setDateMethod = isUtc ? 'setUTC' + rawSetDateMethod.substr(3) : rawSetDateMethod;
  const getDateMethod = 'get' + (isUtc ? 'UTC' : '') + rawSetDateMethod.substr(3);
  return {setDateMethod, getDateMethod};
}

export function getTimeUnitParts(timeUnit: TimeUnit) {
  return TIMEUNIT_PARTS.reduce((parts, part) => {
    if (containsTimeUnit(timeUnit, part)) {
      return parts.concat(part);
    }
    return parts;
  }, []);
}

/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
export function containsTimeUnit(fullTimeUnit: TimeUnit, timeUnit: TimeUnit) {
  const index = fullTimeUnit.indexOf(timeUnit);
  return (
    index > -1 && (timeUnit !== TimeUnit.SECONDS || index === 0 || fullTimeUnit.charAt(index - 1) !== 'i') // exclude milliseconds
  );
}

/**
 * Returns Vega expresssion for a given timeUnit and fieldRef
 */
export function fieldExpr(fullTimeUnit: TimeUnit, field: string): string {
  const fieldRef = accessPathWithDatum(field);

  const utc = isUTCTimeUnit(fullTimeUnit) ? 'utc' : '';
  function func(timeUnit: TimeUnit) {
    if (timeUnit === TimeUnit.QUARTER) {
      // quarter starting at 0 (0,3,6,9).
      return `(${utc}quarter(${fieldRef})-1)`;
    } else {
      return `${utc}${timeUnit}(${fieldRef})`;
    }
  }

  const d = TIMEUNIT_PARTS.reduce(
    (dateExpr: DateTimeExpr, tu: TimeUnit) => {
      if (containsTimeUnit(fullTimeUnit, tu)) {
        dateExpr[tu] = func(tu);
      }
      return dateExpr;
    },
    {} as {[key in SingleTimeUnit]: string}
  );

  return dateTimeExpr(d);
}

export function getDateTimeComponents(timeUnit: TimeUnit, shortTimeLabels: boolean) {
  if (!timeUnit) {
    return undefined;
  }

  const dateComponents: string[] = [];
  const hasYear = containsTimeUnit(timeUnit, TimeUnit.YEAR);

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

  return dateTimeComponents;
}

/**
 * returns the signal expression used for axis labels for a time unit
 */
export function formatExpression(
  timeUnit: TimeUnit,
  field: string,
  shortTimeLabels: boolean,
  isUTCScale: boolean
): string {
  if (!timeUnit) {
    return undefined;
  }

  const dateTimeComponents: string[] = getDateTimeComponents(timeUnit, shortTimeLabels);
  let expression = '';

  if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
    // special expression for quarter as prefix
    expression = `'Q' + quarter(${field})`;
  }

  if (dateTimeComponents.length > 0) {
    if (expression) {
      // Add space between quarter and main time format
      expression += ` + ' ' + `;
    }

    // We only use utcFormat for utc scale
    // For utc time units, the data is already converted as a part of timeUnit transform.
    // Thus, utc time units should use timeFormat to avoid shifting the time twice.
    if (isUTCScale) {
      expression += `utcFormat(${field}, '${dateTimeComponents.join(' ')}')`;
    } else {
      expression += `timeFormat(${field}, '${dateTimeComponents.join(' ')}')`;
    }
  }

  // If expression is still an empty string, return undefined instead.
  return expression || undefined;
}

export function normalizeTimeUnit(timeUnit: TimeUnit): TimeUnit {
  if (timeUnit !== 'day' && timeUnit.indexOf('day') >= 0) {
    log.warn(log.message.dayReplacedWithDate(timeUnit));
    return timeUnit.replace('day', 'date') as TimeUnit;
  }
  return timeUnit;
}
